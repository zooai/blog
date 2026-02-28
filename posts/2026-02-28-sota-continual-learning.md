---
title: "Continual Learning Without Catastrophic Forgetting: A Production Guide"
date: "2026-02-28"
author: "Zach Kelling"
tags: ["ai", "continual-learning", "fine-tuning", "lora", "zen", "research", "oplora", "sure", "opcm"]
description: "How we use OPLoRA, SuRe, OPCM, and Youtu-Agent to keep Zen models learning without degrading what they already know. A production guide to the 2025-2026 continual learning stack."
---

# Continual Learning Without Catastrophic Forgetting: A Production Guide

The hardest problem in production model maintenance is not training a model. It is training a model again without destroying the model you already have.

Catastrophic forgetting — the phenomenon where a neural network loses previously acquired knowledge when learning new tasks — is not a theoretical curiosity. It is a production crisis. Every time you fine-tune a model on new data, you risk degrading its performance on everything else. For the Zen model family, where behavioral properties span code generation, reasoning, multilingual understanding, and domain-specific knowledge, this is the central engineering challenge of ongoing model development.

This post describes the continual learning stack we use for Zen models in 2025-2026: four techniques from recent research that combine into a coherent production pipeline. All are based on published work; none require exotic infrastructure.

## The Problem: Why Models Forget

Understanding the mechanism of forgetting is prerequisite to preventing it.

Neural networks are function approximators parameterized by weights. During training, gradient descent updates these weights to minimize loss on the training distribution. When the training distribution changes — as it does in any fine-tuning scenario — gradients push weights toward configurations that minimize the new loss, often at the cost of moving weights away from configurations that minimized the old loss.

The **Neural Tangent Kernel (NTK)** perspective makes this precise. The NTK characterizes how a network's output changes in response to weight perturbations. During continual learning, the effective NTK drifts: the learned kernel for previous tasks is no longer approximated by the updated weights. Forgetting is NTK drift made manifest.

The **plasticity-stability tradeoff** is the practical tension: a model that learns quickly (high plasticity) overwrites previous knowledge readily. A model that preserves previous knowledge well (high stability) cannot learn new tasks efficiently. Both extremes are pathological. The goal is a calibrated middle.

Three families of approaches address this:

1. **Regularization**: add terms to the loss that penalize weight updates that would damage performance on previous tasks (EWC, SI, online EWC)
2. **Replay**: maintain a buffer of examples from previous tasks and include them in training on new tasks (Experience Replay, DER++)
3. **Architecture**: structure the model so that new task learning cannot interfere with old task representations (PackNet, progressive networks)

LoRA-based continual learning sits at the intersection of all three. The low-rank adaptation structure constrains which directions in weight space can be modified, providing architectural regularization. Recent work has sharpened this significantly.

## OPLoRA: Orthogonal Projection for Clean Adapter Updates

**OPLoRA** (arXiv:2510.13003) is the most structurally principled of the techniques we use.

The core observation: the frozen base model's weight matrix W has a dominant subspace characterized by its top singular vectors. When a LoRA update BA is applied (where B ∈ ℝ^{d×r} and A ∈ ℝ^{r×k}), interference with the base model's dominant subspace is catastrophic — it modifies the most information-rich directions in weight space.

OPLoRA constrains LoRA updates to the null space of the base model's dominant singular vectors:

```
Let U_k = top-k left singular vectors of W (frozen base weight)
Project the LoRA output onto the complement of U_k's span:
  ΔW_eff = (I - U_k U_k^T) · B · A
```

This orthogonal projection operation ensures that LoRA updates carry zero component along the directions that matter most to the base model's existing representations. New task learning proceeds through the remaining orthogonal complement — directions the base model uses less, freeing them up for behavioral modification without destructive interference.

Implementation is a single projection step applied to the LoRA output before it is added to the frozen weight's output:

```python
class OPLoRALayer(nn.Module):
    def __init__(self, base_weight: torch.Tensor, rank: int, k_singular: int = 64):
        super().__init__()
        # Compute and cache dominant singular vectors of base weight
        U, S, Vh = torch.linalg.svd(base_weight, full_matrices=False)
        self.register_buffer('U_k', U[:, :k_singular])  # top-k left singular vectors

        d_out, d_in = base_weight.shape
        self.lora_A = nn.Parameter(torch.randn(rank, d_in) * 0.02)
        self.lora_B = nn.Parameter(torch.zeros(d_out, rank))
        self.scale = 1.0 / rank

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # Standard LoRA delta
        delta = (self.lora_B @ self.lora_A) * self.scale
        # Project onto orthogonal complement of base model's dominant subspace
        projection = self.U_k @ (self.U_k.T @ delta)
        delta_projected = delta - projection
        return x @ delta_projected.T
```

The k_singular hyperparameter controls the trade-off: larger k_singular preserves more of the base model's structure (more stability) at the cost of a smaller space for new learning (less plasticity). In our experiments on Zen models, k_singular=64 per transformer layer provides adequate plasticity while eliminating meaningful regression on held-out evaluations from previous training phases.

## SuRe: Surprise-Driven Prioritized Replay

**SuRe** (arXiv:2511.22367) addresses the replay family of approaches with a principled prioritization scheme and a novel LoRA merging strategy.

The core idea: not all examples in a replay buffer are equally useful for preventing forgetting. Examples that the current model handles confidently — low loss — provide little gradient signal. Examples that the model has "forgotten" — high loss — provide strong forgetting-correction signal. SuRe uses this asymmetry explicitly.

**Priority signal**: for each example in the replay buffer, SuRe maintains a surprise score defined as the negative log-likelihood under the current model:

```
surprise(x) = -log p_θ(y | x) = NLL(x)
```

Higher surprise means the current model is less confident on this example — a stronger forgetting signal. The replay buffer is sampled proportionally to these surprise scores, biasing training toward examples where forgetting has occurred.

**Dual EMA merging**: SuRe maintains two LoRA adapters with different update rates. A fast adapter (high learning rate α_fast) tracks the current training distribution. A slow adapter (low learning rate α_slow) tracks a smoothed historical average. The final adapter is a convex combination:

```
θ_final = λ · θ_slow + (1 - λ) · θ_fast
```

The slow adapter serves as an implicit regularizer: it pulls the effective parameters toward the historical distribution, preventing the fast adapter's aggressive updates from propagating fully to inference.

```python
class SuReReplayBuffer:
    def __init__(self, capacity: int, alpha: float = 0.6):
        self.buffer = []
        self.priorities = np.zeros(capacity)
        self.capacity = capacity
        self.position = 0
        self.alpha = alpha  # priority exponent

    def add(self, example: dict, model: nn.Module):
        """Add example with initial surprise score."""
        with torch.no_grad():
            nll = compute_nll(model, example)

        priority = nll.item() ** self.alpha
        if len(self.buffer) < self.capacity:
            self.buffer.append(example)
        else:
            self.buffer[self.position] = example

        self.priorities[self.position] = priority
        self.position = (self.position + 1) % self.capacity

    def sample(self, batch_size: int) -> list[dict]:
        """Sample proportionally to surprise scores."""
        if len(self.buffer) < batch_size:
            return self.buffer

        probs = self.priorities[:len(self.buffer)]
        probs = probs / probs.sum()
        indices = np.random.choice(len(self.buffer), batch_size, p=probs, replace=False)

        # Update surprise scores for sampled examples
        for idx in indices:
            with torch.no_grad():
                self.priorities[idx] = compute_nll(self.model, self.buffer[idx]).item() ** self.alpha

        return [self.buffer[i] for i in indices]

    def merge_adapters(self, fast_lora, slow_lora, lam: float = 0.4):
        """Dual EMA merge: favor slow adapter for stability."""
        merged = {}
        for key in fast_lora:
            merged[key] = lam * slow_lora[key] + (1 - lam) * fast_lora[key]
        return merged
```

SuRe demonstrates 5-point accuracy improvement on the LNT (Learn-Never-Forget) benchmark over standard experience replay. The replay buffer overhead is modest — we maintain buffers of 50K examples per training phase, approximately 2GB of compressed token sequences.

## OPCM: Orthogonal Projection Continual Merging

**OPCM** (arXiv:2501.09522) addresses a different problem: what happens when you have multiple task-specific adapters and want to merge them into a single model that retains all capabilities?

Naive model merging — arithmetic averaging of weights — suffers from task vector interference. If adapter A pushes weight W in direction d_A and adapter B pushes the same weight in direction d_B, their average produces a component in (d_A + d_B)/2 that may be suboptimal for both tasks.

OPCM applies orthogonal projection during sequential merging to eliminate this interference:

1. Begin with base model weights W_0
2. Merge adapter 1: compute task vector τ_1 = W_1 - W_0, apply to get W_1_merged
3. Before merging adapter 2: project τ_2 onto the null space of τ_1
   - τ_2_orth = τ_2 - (τ_2 · τ_1 / ||τ_1||²) · τ_1
4. Apply projected δ: W_merged = W_1_merged + τ_2_orth
5. Repeat for each subsequent adapter

The key property: each task vector is projected to be orthogonal to all previously merged task vectors. This ensures that merging adapter N does not degrade the performance contributions of adapters 1 through N-1.

The computational cost is O(|θ|) per merge step — linear in parameter count — making it tractable for models up to 70B parameters on standard compute. Simultaneous merging (merge all adapters at once without sequential projection) is faster but worse; OPCM's sequential approach demonstrates 5-8% improvement over simultaneous merge on multi-task evaluations.

## Youtu-Agent: Training-Free Continual Adaptation

**Youtu-Agent** (arXiv:2512.24615) is the most unusual technique in the stack: it achieves continual learning without gradient updates at all.

The mechanism is in-context experience accumulation. Rather than fine-tuning model weights to incorporate new knowledge, Youtu-Agent maintains an experience library — a structured collection of (problem, reasoning trace, outcome) triples accumulated from prior interactions. When the model encounters a new problem, the experience library retrieves the most relevant prior experiences and injects them into the context via a GRPO-style (Group Relative Policy Optimization) in-context prompt.

The key insight: GRPO's relative advantage estimation can be computed over in-context examples without any gradient computation. The model "learns" by seeing demonstrations of what worked and what didn't, formatted as an implicit reward signal in the prompt.

```
Experience Library Format:
{
  "problem": "...",
  "attempt": "...",
  "outcome": "correct" | "incorrect",
  "reasoning_quality": 0.0-1.0
}

Retrieval: cosine similarity over frozen sentence embeddings
Injection: top-k experiences formatted as implicit GRPO context
```

Results: +2.7% on AIME 2024 over the base model, without any weight modification. The accuracy gain compounds as the experience library grows — the model gets better at the tasks it is repeatedly asked to perform purely through improved context.

Youtu-Agent is particularly valuable for Zen deployment because it enables per-user adaptation at zero marginal compute cost. Each user's interaction history becomes their private experience library, delivered via context injection at inference time.

## The Zen Continual Learning Pipeline

These four techniques are not alternatives — they are layers in a unified pipeline:

```
Phase 1: New capability training
  - OPLoRA for weight updates (preserves base model subspace)
  - SuRe replay buffer sampling (prioritizes forgotten examples)
  - Dual EMA merge during training (stability anchor)

Phase 2: Cross-capability merging
  - OPCM sequential merge of task adapters
  - Orthogonal projection eliminates inter-task interference
  - Evaluation on held-out tasks from all prior phases

Phase 3: Inference-time adaptation
  - Youtu-Agent experience library per deployment context
  - GRPO in-context learning without gradient updates
  - Experience retrieval via frozen embedding similarity
```

The result: Zen models can be updated monthly with new capability fine-tunes without regression on existing capabilities. The held-out evaluation suite covers 23 capability dimensions, and we track performance across all of them for every training run. Regression on any dimension by more than 0.5% triggers an investigation before the checkpoint ships.

## Practical Notes

**Hardware**: OPLoRA's SVD computation for singular vector extraction is a one-time cost per layer, cached to disk. A 70B parameter model requires approximately 45 minutes of SVD preprocessing on 8x A100s, done once before any training begins.

**Buffer sizing**: SuRe's replay buffer should be sized to approximately 5% of the new training data volume. Too small, and priority sampling degenerates to random; too large, and the NLL recomputation overhead dominates training time.

**OPCM merge order**: merge adapters in order of training recency, most recent last. More recent adapters typically have smaller task vectors (later training phases produce smaller behavioral deltas); merging them last reduces the projection's aggressiveness on the most important updates.

**Youtu-Agent retrieval latency**: at 50K experiences per user, retrieval adds ~8ms to inference latency with approximate nearest neighbor search. Exact search is not necessary; cosine similarity over the top-1000 candidates by embedding cluster is sufficient.

Catastrophic forgetting is a solved problem in research. The gap between research and production is operational: the orchestration, evaluation, and failure handling that make these techniques reliable at scale. We have done that work. The Zen continual learning pipeline runs every month. The models get better. The old capabilities do not regress.

---

*Zen models are available at [zenlm.org](https://zenlm.org). API access via [hanzo.ai](https://hanzo.ai).*
