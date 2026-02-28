---
title: "PoAI: Proof of AI — Consensus for Decentralized Compute Networks"
date: "2026-02-28"
author: "Zoo Labs Foundation"
tags: ["Research", "PoAI", "Consensus", "Decentralized Compute", "Lux"]
description: "ZIP-002 introduces Proof of AI — a consensus mechanism where network participants validate AI compute contributions, replacing energy waste with productive intelligence."
---

# PoAI: Proof of AI — Consensus for Decentralized Compute Networks

Bitcoin burns electricity to produce security. In the twelve years since its mainnet launch, proof-of-work consensus has consumed an estimated 1,400 TWh of electricity — comparable to the annual consumption of a mid-sized country — to produce a sequence of hash values that serve no purpose except to make block production expensive.

This is not a bug in proof-of-work. It is the mechanism. The waste is the security. Hash functions are chosen precisely because they are computationally expensive and economically useless: any attempt to redirect them to productive work would allow miners to amortize their costs across two revenue streams, breaking the security guarantee.

**Proof of AI (PoAI)**, specified in ZIP-002, proposes a different security primitive: validators prove their participation by producing AI inference outputs, and consensus validates those outputs for quality rather than difficulty. The computation that secures the network is identical to the computation the network exists to provide. There is no waste.

## The Proof-of-Work Problem

Proof-of-work's security model rests on one invariant: producing a valid block must be more expensive than the reward for doing so dishonestly. This invariant holds as long as mining has no productive use outside the network.

The environmental cost is a direct consequence of this design requirement, not a remediable inefficiency. Switching to a more energy-efficient hash function does not help; it just shifts costs until the invariant is restored. Proof-of-work is intrinsically wasteful because it must be.

Proof-of-stake improves energy efficiency but introduces different problems: capital concentration drives validation concentration, and the security guarantee becomes "no single entity controls a majority of staked capital" — an assumption that becomes harder to verify as capital accumulates in institutional hands.

PoAI takes a third path. The security primitive is productive compute rather than wasted compute. The economic invariant holds differently: producing a valid inference output requires genuine GPU resources, and the cost of those resources is the floor on the cost of attacking the network.

## PoAI Concept: Consensus on Intelligence

The PoAI consensus mechanism replaces hash puzzles with inference tasks. Validators receive a task — a prompt requiring language model inference — and must produce an output. Consensus validates whether that output is high-quality relative to a reference distribution.

Quality is measured by **negative log-likelihood (NLL)** scoring against a reference model. A valid inference output is one that achieves an NLL score below a dynamically adjusted threshold. An output that is too dissimilar from the reference distribution — indicating that the validator either ran a poor model or fabricated an output without running inference — fails validation.

This creates the same security property as proof-of-work: you cannot produce a valid block cheaply. But the expensive computation is language model inference, which is useful, rather than SHA-256 hashing, which is not.

## Consensus Rounds

A PoAI consensus round proceeds as follows:

**1. Task Issuance.** The round coordinator (rotated by stake weight, similar to proof-of-stake validator selection) issues an inference task to all active validators. Tasks are drawn from a public task pool and selected to be diverse across domains, preventing validators from specializing on a narrow distribution.

The task format is a standard prompt with a difficulty parameter that controls expected output length and reasoning depth. Difficulty is adjusted to target an expected inference time of 2-5 seconds on a modern GPU, keeping round latency manageable while ensuring meaningful compute expenditure.

**2. Parallel Inference.** All validators run inference independently and in parallel. Outputs are hashed and submitted to the coordinator before the full output is revealed, creating a commit-reveal scheme that prevents validators from copying each other's outputs.

**3. NLL Comparison.** After the reveal window closes, all submitted outputs are evaluated against the reference distribution using NLL scoring. The reference model is a lightweight embedding model (Zen Embedding, ~400M parameters) that can be run by light clients for verification. NLL scores are deterministic given the reference model weights and the output text.

The NLL scoring function measures how probable the output is under the reference distribution:

```
NLL(output) = -Σ_t log p_ref(token_t | token_{1..t-1}, prompt)
```

Lower NLL indicates an output that is more consistent with what a capable model would produce for the given prompt. High NLL indicates an output that is implausible — either nonsensical, off-topic, or inconsistent with the prompt.

**4. Schelling Point Voting.** Rather than requiring exact output agreement (which is impossible for generative models), PoAI uses Schelling point voting: each validator selects the output it believes the community will identify as the best output. Validators are rewarded when their chosen output matches the majority selection.

This creates a focal point around quality: the community naturally converges on the highest-quality output as the Schelling point, since all participants know that high-quality outputs are more likely to attract majority votes. Attempting to coordinate on a low-quality output requires explicit collusion.

**5. Block Finalization.** The winning output and its NLL score are recorded in the block header. The block is finalized when a supermajority (67%) of stake weight endorses the winning output.

## Network Architecture: Lux → Hanzo → Zoo

PoAI is implemented as the consensus mechanism for the Hanzo Network, which runs as a compute chain on the Lux Network substrate.

**Lux Network (L0 — Base Consensus):** Post-quantum consensus layer using the Quasar consensus protocol. Provides sub-second finality and settlement guarantees. All higher-layer chains inherit Lux's security properties. Chain uses luxfi packages exclusively — not go-ethereum or ava-labs.

**Hanzo Network (L1 — AI Compute Chain):** The PoAI consensus layer. Chain ID 36900 (mainnet), 36901 (testnet). Validators earn $AI tokens by contributing valid GPU inference. The Hanzo Network's primary function is matching inference demand with validated compute supply.

```
Mainnet:  https://rpc.hanzo.network  (chain ID 36900)
Testnet:  https://rpc.hanzo-test.network  (chain ID 36901)
P2P port: 3692
HTTP API: 3690
```

**Zoo Network (App Layer):** Lightweight application shim that connects to Hanzo compute via the DSO experience protocol. The Zoo Network provides user-facing APIs, experience ledger access, and DAO governance interfaces. $ZOO tokens (fixed supply, non-mineable) are used for governance; $AI tokens are earned through compute contribution.

This three-layer architecture allows the Zoo application layer to remain lightweight and upgradeable while the heavy consensus and compute work happens in the lower layers with their own security guarantees.

## $AI Token Economics

Validators in the Hanzo Network earn $AI tokens for contributing valid inference compute. The reward structure:

- **Base compute reward:** approximately 1 $AI per minute of GPU-equivalent compute contributed
- **Quality multiplier:** outputs that score in the top quartile of NLL for their round receive a 1.25x multiplier
- **Consistency bonus:** validators that participate in 95%+ of rounds over a 30-day window receive an additional 1.1x multiplier

Slashing occurs when a validator submits an invalid output — one whose NLL exceeds the validity threshold for its round. Slashing magnitude is proportional to the stake committed and the severity of the invalidity:

- NLL above threshold (invalid inference): 0.5% slash
- Empty or malformed output: 2% slash
- Evidence of output fabrication (statistical proof of no inference): 10% slash + temporary exclusion

The slashing mechanism creates a strong economic incentive to run genuine inference. The cost of slashing on fabricated outputs exceeds the cost of running actual GPU inference across all realistic cost structures.

## GPU and CPU Contribution

The Zoo Desktop App (Tauri/React) exposes GPU compute contribution through a simple interface: users enable mining and the app connects to the Hanzo Network, receives inference tasks, runs them locally using the bundled Ollama inference runtime, and submits outputs for validation.

Compute contribution rates (approximate, subject to network demand):

| Hardware | Expected Rate |
|---|---|
| Consumer GPU (RTX 4090) | ~1.2 $AI/min |
| Consumer GPU (RTX 4080) | ~0.9 $AI/min |
| Enterprise GPU (H100) | ~4.5 $AI/min |
| CPU only | ~0.08 $AI/min |

CPU contribution is supported but operates at significantly lower efficiency. The network accepts CPU contributions because they provide inference capacity for smaller models and light validation tasks, but the economics strongly favor GPU participation.

## Verifiable Inference: Merkle Proofs over Activations

A recurring challenge in decentralized compute networks is verifying that a claimed computation was actually performed. Simply accepting NLL scores from validators without verification creates an attack vector: validators could compute NLL scores analytically (much cheaper than running inference) and submit plausible-looking outputs.

PoAI uses a verifiable inference scheme based on Merkle proofs over intermediate activation layers.

When a validator runs inference, the runtime logs a cryptographic commitment to the activation values at selected transformer layers. These commitments are included in the submitted output. After the reveal window, the coordinator can challenge any submission with a request for a specific activation layer's proof. The validator must respond with the Merkle proof linking the claimed activation to the commitment in their submission.

For light clients, full activation verification is not necessary. Light clients verify only the final-layer output against the NLL scoring function and the activation commitment against the block header. Full nodes can perform complete activation verification for any challenged submission.

This creates a probabilistic verification scheme: the probability that a validator can successfully fabricate an output and pass all activation challenges drops exponentially with the number of challenge layers. In practice, fabrication is economically dominated by genuine inference before reaching the verification floor.

## Anti-Gaming Mechanisms

Several mechanisms prevent gaming of the PoAI consensus:

**Reference model rotation.** The reference model used for NLL scoring is rotated every 1,000 blocks, with the new model committed to 10,000 blocks in advance. This prevents validators from over-optimizing their inference to score well on a specific reference model. The rotation schedule is deterministic and governed by the block hash of the commitment block.

**Task diversity requirements.** Each validator must demonstrate capability across at least 8 distinct task domains over any 100-round window. Validators who specialize too narrowly receive a diversity penalty. This prevents validators from deploying purpose-built hardware optimized for a single task type.

**Stake-weighted Schelling voting.** Votes in the Schelling point selection are weighted by stake, not raw validator count. This makes sybil attacks — spinning up many low-stake validators — expensive and ineffective.

**Output entropy floor.** Outputs must meet a minimum entropy requirement, preventing validators from submitting degenerate outputs (repeated tokens, truncated responses) that might achieve low NLL through pathological means.

## Comparison to Filecoin's Proof-of-Spacetime

Filecoin's Proof-of-Spacetime (PoSt) is the closest analogue to PoAI in the existing decentralized infrastructure landscape. Both protocols aim to prove productive work rather than wasted computation. The comparison is instructive.

Filecoin proves that a validator is **storing data**: the validator must periodically prove, via cryptographic challenges against their stored sectors, that the claimed data is present and intact. Proof-of-spacetime proves storage.

PoAI proves that a validator is **running inference**: the validator must produce outputs consistent with genuine language model inference, demonstrated through NLL scoring and activation commitments. Proof-of-AI proves productive intelligence.

The distinction matters for economic alignment. Filecoin's validators are economically rewarded for hoarding storage capacity even when demand is low. PoAI validators are rewarded for available inference capacity, with rewards proportional to actual task completion. The economic alignment between validator incentives and user demand is tighter in PoAI.

## Current Status

The Hanzo Network is operational with chain ID 36900 (mainnet) and 36901 (testnet). PoAI consensus is live on testnet as of February 2026. Mainnet launch is scheduled for Q2 2026, pending ZIP-002 ratification through the $ZOO governance process.

Testnet validators can register at [zoo.ngo/validator](https://zoo.ngo/validator). Testnet $AI rewards are non-transferable but contribute to validator reputation scores that will carry forward to mainnet.

The reference implementation is open source at [github.com/zooai/poai](https://github.com/zooai/poai). The implementation uses the Lux consensus primitives through the luxfi package ecosystem, following the architectural specification in ZIP-002.

---

*ZIP-002 full specification at [zips.zoo.ngo/zip-002](https://zips.zoo.ngo/zip-002). Run a validator node at [zoo.ngo/validator](https://zoo.ngo/validator). Hanzo Network documentation at [hanzo.network](https://hanzo.network).*
