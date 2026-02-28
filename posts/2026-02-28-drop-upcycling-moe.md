---
title: "Drop-Upcycling: Building 13B-Quality MoE Models at 1/4 the Cost"
date: "2026-02-28"
author: "Zach Kelling"
tags: ["ai", "moe", "zen", "drop-upcycling", "zen4", "training", "architecture", "q-galore", "gt-qlora"]
description: "How Drop-Upcycling transforms a dense model into a high-quality MoE at a fraction of the training cost — and how we apply it to Zen MoDE for efficient expert specialization."
---

# Drop-Upcycling: Building 13B-Quality MoE Models at 1/4 the Cost

Training a Mixture of Experts model from scratch is expensive by design. You are not just training one set of FFN weights — you are training K sets, plus a routing mechanism that must learn to specialize them, plus the overhead of ensuring experts do not all collapse to the same representation. The full MoE training cost can reach 4-6x the cost of training an equivalent dense model, for a final model that activates only a fraction of its parameters at inference.

There is a better path. Drop-Upcycling (arXiv:2502.19261) converts a pre-trained dense model into a high-quality MoE at approximately 1/4 the training cost of a from-scratch MoE, while matching or exceeding the quality of the from-scratch approach. For Zen MoDE (Mixture of Distilled Experts), this is not a research curiosity — it is the production training strategy.

## The Dense-to-MoE Transformation Problem

The natural approach to upcycling a dense model into MoE is expert cloning: take the FFN layers of the dense model, replicate them K times to create K experts, initialize the routing gate randomly, and continue training.

This fails in a specific and predictable way: **weight correlation collapse**.

When K experts are initialized as identical copies of the same FFN, they are perfectly correlated. The routing gate has no signal to distinguish them — any routing decision produces the same output. Gradient updates push each expert in slightly different directions based on which examples it routes, but the initial correlation is strong enough that training is slow and the experts remain substantially similar throughout.

The consequence: the resulting MoE model has K experts that are minor variations on the same representation. The capacity of the MoE — its ability to deploy K distinct computational strategies on different input types — is not realized. You pay K× the FFN cost at training time and get less than K× the benefit.

This is the problem Drop-Upcycling solves.

## Drop-Upcycling: Breaking Correlation Through Partial Re-Initialization

The Drop-Upcycling approach is deceptively simple: do not clone the FFN weights into K identical experts. Instead, partially re-initialize each copy.

**The procedure**:

1. Take the pre-trained dense model's FFN weight matrix W ∈ ℝ^{d_ff × d_model}
2. For each expert i from 1 to K:
   a. Start with a copy of W
   b. Drop p% of the weight rows (the "dropped" rows) — set them to fresh random initialization
   c. Keep (1-p)% of the rows at their pre-trained values
3. Initialize routing gate randomly
4. Continue training from this mixed initialization

The dropped rows are the critical mechanism. By reinitializing a fraction of each expert's weights from scratch, we break the inter-expert correlation: the re-initialized rows immediately diverge across experts (different random seeds), while the preserved rows carry the pre-trained knowledge.

**Why this works**: the dropped rows create differentiation pressure from step 1 of continued training. The routing gate immediately has signal to distinguish experts — expert A's dropped rows produce different outputs from expert B's dropped rows, even on the same input. The router learns to use this differentiation. As training continues, the dropped rows specialize to capture the information most useful for the examples each expert routes, while the preserved rows ensure that fundamental language capabilities from pre-training are not destroyed.

```python
def drop_upcycle(
    dense_weights: dict[str, torch.Tensor],
    num_experts: int,
    drop_rate: float = 0.5,
    seed: int = 42,
) -> dict[str, torch.Tensor]:
    """
    Convert dense FFN weights to MoE expert initialization.
    drop_rate: fraction of FFN rows to re-initialize per expert.
    """
    moe_weights = {}

    for layer_name, W in dense_weights.items():
        if 'mlp' not in layer_name and 'ffn' not in layer_name:
            moe_weights[layer_name] = W.clone()
            continue

        d_ff, d_model = W.shape
        n_drop = int(d_ff * drop_rate)
        expert_tensors = []

        for expert_idx in range(num_experts):
            rng = torch.Generator()
            rng.manual_seed(seed + expert_idx * 1000 + hash(layer_name) % 1000)

            # Randomly select which rows to drop for this expert
            perm = torch.randperm(d_ff, generator=rng)
            drop_indices = perm[:n_drop]
            keep_indices = perm[n_drop:]

            W_expert = W.clone()

            # Re-initialize dropped rows with Kaiming uniform
            fan_in = d_model
            bound = (6.0 / fan_in) ** 0.5
            W_expert[drop_indices] = torch.empty(
                n_drop, d_model, generator=rng
            ).uniform_(-bound, bound)

            expert_tensors.append(W_expert)

        moe_weights[f'{layer_name}.experts'] = torch.stack(expert_tensors)

    return moe_weights
```

The drop rate p is a hyperparameter controlling the tradeoff between preserving pre-trained knowledge (low p) and enabling expert differentiation (high p). Drop-Upcycling's published results show p=0.5 as robust across model scales, and this is what we use for Zen MoDE.

## The Numbers: Quality at 1/4 the Cost

The headline result from the Drop-Upcycling paper: converting a 5.9B parameter dense model to a 13B-parameter equivalent MoE (30B total, 5.9B active) achieves:

- **13B-class quality**: comparable benchmark performance to a from-scratch dense 13B model
- **1/4 training FLOPs**: relative to training the equivalent MoE from scratch
- **5.9B active parameters**: only 5.9B parameters activated per forward pass, giving 13B-class capability at 5.9B inference cost

The efficiency gain comes from the pre-trained dense model carrying strong priors into MoE training. The from-scratch MoE must learn language, reasoning, and factual knowledge from zero alongside learning to specialize its experts. Drop-Upcycling starts with all of that knowledge intact in the preserved rows and spends training budget purely on expert specialization.

## Zen MoDE: Drop-Upcycling in Production

The Zen4 Max architecture (30B total, 3B active) is a direct application of Drop-Upcycling. The training sequence:

**Stage 1: Dense pre-training**
Train a dense 3B parameter model to high quality on the Zen pretraining corpus. This is the foundation: a compact but capable model that encodes strong priors about language, code, and reasoning.

**Stage 2: Drop-Upcycling to 10 experts**
Apply Drop-Upcycling to convert the dense 3B FFN layers into 10-expert MoE layers. With drop_rate=0.5, each expert preserves 50% of the pre-trained FFN weights and re-initializes the other 50%. Total parameters: 30B. Active parameters per forward pass: 3B (top-1 routing, one expert per MoE layer).

**Stage 3: Continued training for expert specialization**
Train the MoE with the same data mixture, routing gate fully trainable, expert weights unfrozen. The dropped rows specialize; the routing gate learns which expert clusters handle which input types. Training budget: approximately 25% of what a from-scratch 30B MoE would require.

**Stage 4: Abliteration (for research variants)**
Behavioral modification via targeted weight adjustment in the localized refusal-related directions. Drop-Upcycling is compatible with post-hoc behavioral modification because the MoE's factual and reasoning capabilities are distributed across experts — abliteration modifies specific behavioral circuits without affecting expert specialization.

**Stage 5: GT-QLoRA fine-tuning**
Gate-Thawed Quantized Low-Rank Adaptation: LoRA applied to MoE fine-tuning with routing gates partially unfrozen. Standard LoRA for MoE leaves gates frozen, which prevents fine-tuning from affecting which expert handles a given input. GT-QLoRA uses constrained gate updates — small learning rate, L2 regularization toward the pre-trained gate — allowing fine-tuning to guide routing without destroying expert specialization.

## Contrast: DeepSeek MoE Architecture

It is instructive to compare Drop-Upcycling's approach with DeepSeek's MoE architecture (DeepSeek-V2, DeepSeek-V3), which takes a different path to expert specialization.

DeepSeek's approach:
- Train MoE from scratch with all experts initialized randomly
- Use fine-grained expert segmentation: many small experts rather than few large experts
- Apply auxiliary load-balancing losses to prevent expert collapse
- Expert specialization emerges entirely from training signal

The tradeoffs are genuine:

| Aspect | Drop-Upcycling | DeepSeek MoE |
|--------|---------------|--------------|
| Training cost | 1/4 of from-scratch | Full from-scratch |
| Expert count | 8-10 (typical) | 64+ fine-grained |
| Pre-trained knowledge | Preserved from dense | Learned from scratch |
| Specialization flexibility | Bounded by initialization | Unconstrained |
| Infrastructure complexity | Moderate | Higher (many experts) |

DeepSeek's fine-grained experts provide more routing granularity, which is valuable at the 70B+ parameter scale where hundreds of billions of parameters need effective utilization. Drop-Upcycling's advantage is economic: at the 30B-equivalent scale that characterizes the Zen Max line, the cost reduction outweighs the flexibility loss.

## Q-GaLore: Memory-Efficient MoE Training

Training a 30B MoE, even from a Drop-Upcycled initialization, requires managing optimizer state for 30B parameters. In Adam/AdamW, optimizer state is 2× the model size: 60GB just for optimizer state, before model weights or activations.

**Q-GaLore** (Quantized Gradient Low-Rank Projection) addresses this directly. Rather than storing full-rank gradient statistics for all parameters, Q-GaLore projects gradients into a low-rank subspace before accumulating optimizer state:

```
For weight W ∈ ℝ^{m×n}:
  Compute gradient G ∈ ℝ^{m×n}
  Project: G_low = P_left · G · P_right^T  where G_low ∈ ℝ^{r×r}
  Accumulate optimizer state for G_low (not G)
  Update in projected space, unproject to apply
```

The projection matrices P_left ∈ ℝ^{r×m} and P_right ∈ ℝ^{r×n} are updated periodically (every T steps) via SVD on the accumulated gradient to track the current dominant gradient subspace. The "Q" in Q-GaLore adds 4-bit quantization of the projected gradient before accumulation, further reducing memory.

The practical outcome: Q-GaLore reduces optimizer state memory by approximately 50% compared to LoRA for equivalent effective rank, with similar convergence properties. For Zen4 Max training on 8x H100 nodes, this is the difference between a feasible training run and an out-of-memory failure.

```python
class QGaLoreAdamW:
    def __init__(self, params, lr=1e-4, rank=64, update_proj_gap=200, quant_bits=4):
        self.rank = rank
        self.update_proj_gap = update_proj_gap
        self.quant_bits = quant_bits
        self.step_count = 0
        self.projections = {}  # layer → (P_left, P_right)
        self.optimizer_state = {}  # layer → (m_low, v_low) in low-rank space

    def update_projection(self, param_id, grad):
        """Recompute projection via SVD every update_proj_gap steps."""
        U, S, Vh = torch.linalg.svd(grad, full_matrices=False)
        P_left = U[:, :self.rank].T   # r × m
        P_right = Vh[:self.rank, :]   # r × n
        self.projections[param_id] = (P_left, P_right)

    def step(self, params_and_grads):
        self.step_count += 1
        for param_id, (param, grad) in enumerate(params_and_grads):
            if self.step_count % self.update_proj_gap == 0:
                self.update_projection(param_id, grad)

            P_left, P_right = self.projections[param_id]

            # Project gradient to low-rank space
            grad_low = P_left @ grad @ P_right.T  # r × r

            # Quantize projected gradient (4-bit)
            grad_low_q = quantize(grad_low, bits=self.quant_bits)

            # Adam update in low-rank space
            if param_id not in self.optimizer_state:
                self.optimizer_state[param_id] = (
                    torch.zeros_like(grad_low_q),
                    torch.zeros_like(grad_low_q)
                )
            m, v = self.optimizer_state[param_id]
            m = 0.9 * m + 0.1 * grad_low_q
            v = 0.999 * v + 0.001 * grad_low_q ** 2
            update_low = m / (v.sqrt() + 1e-8)

            # Unproject back to full rank
            update_full = P_left.T @ update_low @ P_right
            param.data -= self.lr * update_full
            self.optimizer_state[param_id] = (m, v)
```

## The Full Zen MoDE Training Stack

Assembling the full picture:

```
1. Dense pre-training (3B dense model)
   - Standard AdamW, no compression
   - Full Zen pretraining corpus (~3T tokens)
   - Checkpoint: zen4-dense-3b-base

2. Drop-Upcycling (3B dense → 30B MoE, 10 experts)
   - drop_rate=0.5, seed deterministic per layer
   - Initialize gate with uniform random weights
   - Checkpoint: zen4-moe-30b-init

3. MoE specialization training
   - Q-GaLore optimizer for memory efficiency
   - Load-balancing auxiliary loss (coefficient 0.01)
   - ~750B additional tokens
   - Checkpoint: zen4-max-base

4. Instruction fine-tuning
   - OPLoRA adapters (orthogonal to base dominant subspace)
   - GT-QLoRA gate unfreeze (lr_gate = 0.1 × lr_expert)
   - SuRe replay buffer for continual learning
   - Checkpoint: zen4-max-instruct

5. Behavioral variant production
   - MonoSoup merging across instruct checkpoints
   - OPCM sequential merge for multi-capability variants
   - BitDelta compression for serving layer
   - 14 behavioral variants from one base checkpoint
```

The total training cost for Zen4 Max in this configuration: approximately 340,000 H100-hours. A from-scratch 30B dense model of equivalent quality would require approximately 900,000 H100-hours. The Drop-Upcycling efficiency gain, combined with Q-GaLore's optimizer memory savings enabling larger batch sizes, produces a 2.6× reduction in total training compute.

For zen4-ultra (1.04T total, 32B active), we apply the same strategy at scale: Drop-Upcycle from a 32B dense base into 32 experts. The economics at that scale are even more favorable — the from-scratch alternative is not practical within any reasonable compute budget.

## What Comes Next: GT-QLoRA for Expert Behavioral Tuning

The outstanding problem in MoE fine-tuning is routing-aware behavioral modification. When you fine-tune a MoE model with LoRA applied only to expert weights (gates frozen), the fine-tuning can only modify the behavior of each expert independently. It cannot change which expert handles which inputs — the routing structure is fixed.

GT-QLoRA (gate-thawed QLora) is our current research direction for this problem. The gate unfreeze approach uses a small learning rate for gate parameters (typically 10-100× smaller than expert learning rate) with L2 regularization toward the pre-trained gate values:

```
L_total = L_task + λ_gate · ||θ_gate - θ_gate_frozen||²
```

The regularization term acts as a prior: the routing structure should change as little as possible from the pre-trained configuration, but can shift to the extent required by the fine-tuning task. Early results suggest GT-QLoRA enables more targeted behavioral modification on task-specific fine-tunes — the model can learn to route certain input types to experts that are more capable for the task, rather than applying behavioral modification uniformly across all routing paths.

This remains active research. The Zen team expects GT-QLoRA to appear in the next major model training run.

---

*Zen models are available at [zenlm.org](https://zenlm.org). Hanzo AI infrastructure at [hanzo.ai](https://hanzo.ai).*
