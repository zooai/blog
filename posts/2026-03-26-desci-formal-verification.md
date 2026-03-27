---
title: "DeSci Meets Formal Verification: Machine-Checked Proofs for Zoo"
description: "31 Lean 4 proofs covering AI agents, PoAI consensus, experience ledger, conservation DeFi, and governance"
date: 2026-03-26
authors: [zoo]
tags: [formal-verification, desci, lean4, poai, agents]
---

Zoo Labs Foundation has open-sourced formal verification proofs for the decentralized AI research network. 31 Lean 4 files proving properties of agent economics, PoAI consensus, conservation DeFi, and governance — machine-checked, zero incomplete proofs.

## From Agent NFTs to Formal Proofs

Zoo started in October 2021 with a radical idea: AI agents backed by NFTs, each with its own crypto wallet and autonomous economic agency. Four years later, the Zoo network spans PoAI consensus, decentralized semantic optimization, federated wildlife AI, and conservation finance.

Every one of those systems makes promises. The experience ledger promises append-only integrity. PoAI consensus promises Byzantine robustness. Carbon credit contracts promise conservation. Formal verification makes those promises mathematical.

## What's Proven

**AI Agent Properties (8 proofs)**
- Agent NFT ownership: wallet binding, non-transferable autonomy
- DeltaSoup emergence: compositional agent behavior
- GRPO convergence: training-free continuous learning bounds
- Gym safety: training completion, resource bounds, no-regression
- Reward shaping: incentive compatibility

**Consensus & AI (3 proofs)**
- **PoAI**: TEE attestation chain integrity, quality scoring under Byzantine faults
- Federated wildlife AI convergence across heterogeneous nodes
- Species classification accuracy bounds

**Governance (5 proofs)**
- ZIP quorum + timelock enforcement
- Contribution tracking monotonicity
- Compensation fairness: proportional distribution
- Treasury spend authorization + balance conservation

**Conservation DeFi (2 proofs)**
- Carbon credit retirement: conservation monotonicity
- Impact bonds: maturity + outcome verification

**Data & Infrastructure (2 proofs)**
- Experience ledger: append-only, deduplication, contribution monotonicity
- Data commons: access control, privacy preservation

## The Three-Layer Verification Stack

Zoo's formal proofs sit within a unified verification framework spanning the entire ecosystem:

| Layer | Repo | Proofs | Focus |
|-------|------|--------|-------|
| **Lux** (L1) | [luxfi/proofs](https://github.com/luxfi/proofs) | 50 files | Consensus, crypto, protocols, DeFi |
| **Hanzo** (Compute) | [hanzoai/proofs](https://github.com/hanzoai/proofs) | 17 files | Agent safety, MCP, PoAI, platform |
| **Zoo** (AI) | [zooai/proofs](https://github.com/zooai/proofs) | 31 files | AI agents, governance, conservation |

Together: **98 Lean 4 files, 0 sorry, machine-checked end-to-end**.

## Links

- **Proofs**: [github.com/zooai/proofs](https://github.com/zooai/proofs)
- **Papers**: [github.com/zooai/papers](https://github.com/zooai/papers) — 30 research papers from October 2021
- **Site**: [proofs.zoo.ngo](https://proofs.zoo.ngo)
- **ZIPs**: [zips.zoo.ngo](https://zips.zoo.ngo) — Zoo Improvement Proposals including ZIP-002 PoAI
