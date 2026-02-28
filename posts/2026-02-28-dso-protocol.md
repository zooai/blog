---
title: "DSO: Decentralized Semantic Optimization for Open AI Research"
date: "2026-02-28"
author: "Zoo Labs Foundation"
tags: ["Research", "DSO", "ZIPs", "DeAI", "PoAI"]
description: "ZIP-001 formalizes the Decentralized Semantic Optimization protocol — how distributed networks optimize language model behavior without centralized gradient updates."
---

# DSO: Decentralized Semantic Optimization for Open AI Research

Every major language model in production today is optimized by a single organization. OpenAI decides what GPT-4 values. Anthropic decides what Claude refuses. Google decides what Gemini prioritizes. The weights are the policy, and control of the weights is control of the policy.

This is not a critique of those organizations. It is a description of an architectural fact: centralized fine-tuning produces centralized behavioral control, regardless of the intentions of the organization doing the tuning. The structure of the system determines its governance properties, not the stated values of its operators.

ZIP-001 formalizes the **Decentralized Semantic Optimization (DSO)** protocol — a mechanism by which distributed networks optimize language model behavior through community-governed experience ledgers rather than centralized gradient updates. This post describes the protocol, its architecture, its relationship to recent research in continual learning, and its economic incentive structure.

## The Problem with Centralized Fine-Tuning

Centralized fine-tuning has three failure modes that compound at scale.

**Single point of behavioral control.** When one organization controls the fine-tuning pipeline, that organization's biases, errors, and priorities become the model's biases, errors, and priorities. This is not hypothetical — every major model has documented behavioral patterns that reflect the organizational culture of its trainer. The solution is not to find a better organization. The solution is to distribute control.

**Reward hacking.** RLHF (Reinforcement Learning from Human Feedback), the dominant fine-tuning paradigm, uses a reward model to proxy human preferences. Reward models are imperfect. Models trained against them learn to maximize reward model scores rather than actual human preference — a phenomenon documented extensively in the literature as reward hacking or specification gaming. The reward model becomes a target to exploit rather than a signal to follow.

**Lock-in.** Fine-tuned models are updated infrequently, at high cost, by centralized teams. Communities that want different behavioral properties — different safety tradeoffs, different domain priorities, different linguistic norms — have no recourse. They can choose from the options offered, or not use the model.

DSO addresses all three failure modes by replacing the centralized fine-tuning loop with a distributed protocol.

## What is DSO?

Decentralized Semantic Optimization is a protocol for community-governed optimization of model behavior through **experience ledgers** — structured collections of (input, reasoning, output, evaluation) tuples that guide model behavior at inference time without modifying model weights.

The core insight is this: you do not need to change a model's weights to change its behavior. You need to change what the model sees when it processes a request. If the model sees high-quality demonstrations of desired behavior in its context window, it will produce behavior consistent with those demonstrations. This is in-context learning, and it is a property of every sufficiently large language model.

DSO formalizes this insight into a governance protocol:

1. Community members contribute **experience entries** — demonstrations of desired model behavior
2. Entries are validated against quality criteria and voted on by $ZOO token holders
3. Accepted entries are added to the **experience ledger** — a distributed, content-addressed store
4. At inference time, the DSO runtime retrieves relevant experiences and injects them into the model's context
5. The model's behavior is shaped by community-accepted demonstrations, not by centralized fine-tuning

The model weights remain frozen. The governance is over the experience ledger, not the weights.

## DSO Architecture

The DSO system has four components: experience nodes, semantic routing, the NLL-prioritized replay buffer, and DAO governance.

### Experience Nodes

Experience nodes are the participants who contribute entries to the ledger. An experience entry has the following format, as specified in ZIP-001:

```json
{
  "id": "sha256:<content-hash>",
  "version": "1.0",
  "created_at": "<unix-timestamp>",
  "contributor": "<wallet-address>",
  "domain": "<capability-domain>",
  "input": {
    "prompt": "...",
    "context": "..."
  },
  "reasoning": "...",
  "output": "...",
  "evaluation": {
    "quality_score": 0.0,
    "correctness": true,
    "reasoning_quality": 0.0,
    "evaluator": "<wallet-address | 'self'>"
  },
  "metadata": {
    "model_family": "qwen3",
    "task_type": "...",
    "language": "en"
  }
}
```

The content hash is computed over the canonical JSON serialization of the entry, excluding the `id` field. This makes entries content-addressed and tamper-evident: any modification changes the hash and invalidates the entry.

### Semantic Similarity Routing

When a user submits a request, the DSO runtime computes a dense embedding of the request and queries the experience ledger for semantically similar entries. This is a nearest-neighbor search over the embedding space of all accepted experiences.

The retrieval uses a frozen sentence embedding model (Zen Embedding, as specified in ZIP-003) to ensure that routing is deterministic and auditable. Any node can verify that a set of retrieved experiences is the correct result for a given query.

Retrieved experiences are ranked by a composite score:

```
score(e) = α · cosine_sim(query_emb, entry_emb)
         + β · quality_score(e)
         + γ · freshness(e)
         + δ · contributor_reputation(e)
```

The top-k experiences (default k=8) are injected into the model's context as demonstrations before the user's actual request.

### NLL-Prioritized Replay Buffer

The replay buffer is borrowed directly from **SuRe** (arXiv:2511.22367), which we use in the Zen continual learning pipeline. SuRe's key contribution is prioritizing replay by surprise: examples that the current model handles poorly — measured by negative log-likelihood — are replayed more frequently than examples the model handles confidently.

In the DSO context, the replay buffer serves a different function: it identifies which experiences in the ledger are providing the most behavioral lift. Experiences with high NLL scores are the ones where the model's behavior deviates most from the desired behavior demonstrated in the experience. These are the experiences that are contributing most to behavioral optimization.

This creates a feedback loop: high-NLL experiences are retrieved more frequently, providing more demonstration signal, which reduces the model's deviation on those patterns over time. The ledger self-prioritizes toward the experiences with the highest marginal impact.

### DAO Governance and Voting

The DAO governance layer is the mechanism by which experience entries are accepted into or rejected from the ledger.

When a contributor submits an experience entry, it enters a **review period** of 72 hours. During this period, $ZOO token holders can:

- **Upvote**: signal that this entry demonstrates desirable behavior
- **Downvote**: signal that this entry demonstrates undesirable or incorrect behavior
- **Flag**: mark for expert review (technical accuracy, safety concerns)

An entry is accepted into the ledger if it meets both thresholds specified in ZIP-001:

- **Quorum**: at least 66% of active voting weight must participate
- **Approval**: at least 51% of votes cast must be upvotes

Flagged entries go to a dedicated expert review panel before voting proceeds.

Conflict resolution for entries that contradict existing ledger entries uses a temporal precedence rule by default: the newer entry supersedes the older entry for its domain. Domain maintainers (contributors with high reputation in a specific domain) can override temporal precedence through a supersession vote.

## Relationship to SuRe and Youtu-Agent

DSO is the governance and distribution layer that sits on top of two specific research contributions from the continual learning literature.

**SuRe** (arXiv:2511.22367) provides the replay prioritization mechanism. In the centralized continual learning setting, SuRe prioritizes which training examples to replay based on NLL surprise scores. DSO borrows this prioritization and applies it to the decentralized ledger: the surprise score determines which experiences are most valuable to retrieve, inject, and promote.

**Youtu-Agent** (arXiv:2512.24615) provides the inference mechanism. Youtu-Agent demonstrates that training-free in-context experience injection can improve model performance by +2.7% on AIME 2024 without any weight modification. This is the mechanism DSO uses: the ledger's accepted experiences are injected into context at inference time, following the Youtu-Agent format of structured (problem, reasoning, outcome) triples.

The relationship is architectural: SuRe tells us which experiences matter most; Youtu-Agent tells us how to use them at inference time; DSO provides the governance protocol for a community to collectively maintain the experience ledger.

## Comparison to RLHF

The standard objection to DSO is: why not just use RLHF with community feedback as the signal?

RLHF with community feedback has been tried and studied. Its failure mode is well-documented: the reward model trained on community feedback learns to predict what gets upvotes, not what is genuinely correct or helpful. These are different. Upvotes correlate with confidence, fluency, and length — not accuracy. Reward hacking on community-labeled data is at least as bad as reward hacking on expert-labeled data.

DSO sidesteps the reward model entirely. There is no model that predicts reward. There is no function that the trained model can learn to exploit. The community votes on specific experience entries — concrete demonstrations of behavior — not on abstract quality scores. An entry either demonstrates what the community wants or it does not. The model sees the demonstrations directly.

This is a harder governance problem (you cannot aggregate demonstrations as easily as you can aggregate scores), but it is a more robust one. You cannot reward-hack a demonstration. You can only reject or accept it.

## Economic Incentives: $ZOO Token Rewards

Contributors who submit accepted experience entries receive $ZOO token rewards proportional to the ledger impact of their contribution. Impact is measured by the cumulative retrieval frequency of the entry: experiences that are retrieved frequently across many queries have demonstrated high value to the community.

The reward function is:

```
reward(e) = base_reward × retrieval_count(e, 30d) × quality_score(e) × domain_multiplier(e)
```

Domain multipliers are set by DAO governance to incentivize contributions in underserved domains. Technical domains (mathematics, code, scientific reasoning) currently carry a 1.5x multiplier; common conversational domains carry a 1.0x multiplier.

The $ZOO token supply is fixed. New rewards are drawn from a community treasury funded by inference fees — a percentage of every API call that uses DSO experience injection is directed to the rewards pool.

## Current Implementation

The zooai/skills repository currently contains 743 curated agent skills using the DSO experience format. These skills were assembled from community contributions across six domains: code generation, mathematical reasoning, scientific explanation, multilingual translation, document analysis, and tool use.

These 743 skills are the bootstrap dataset for the DSO ledger. They have been manually reviewed by Zoo Labs Foundation staff to ensure correctness and safety, and they serve as the positive class for training the initial quality classifier used in the review pipeline.

The ledger is live at skills.zoo.ngo. Submissions are open. The first DAO governance vote is scheduled for March 2026, at which point the manual review fallback will be replaced by the full token-weighted voting process specified in ZIP-001.

---

*ZIP-001 specification and the DSO experience schema are published at [zips.zoo.ngo](https://zips.zoo.ngo). Contribute experiences at [skills.zoo.ngo](https://skills.zoo.ngo). $ZOO token governance at [zoo.ngo](https://zoo.ngo).*
