---
title: "Zoo 4.0: Sovereign GPU-Native L1"
description: "Zoo graduates from BSC token (2021) to Lux L2 (2024) to full PQ (2025) to a sovereign GPU-native L1 with the DEX+EVM+FHE trifecta."
date: 2026-02-14
authors: [zoo, antje, zach]
tags: [zoo, 4-0, l1, gpu, dex, evm, fhe, sovereign, conservation]
---

# Zoo 4.0: Sovereign GPU-Native L1

Today, February 14, 2026, Zoo activates as a sovereign Layer 1. The chain runs the trifecta — DEX, EVM, FHE — on GPU, and its existence completes a five-year journey from a tokenomics idea on Binance Smart Chain to a fully sovereign blockchain dedicated to conservation finance and decentralized AI.

This post is the Zoo Labs Foundation account of that journey, co-authored by Antje Worring (Chief Scientist) and Zach Kelling, with reference to the canonical launch paper at `/Users/z/work/zoo/papers/zoo-4-0-launch/`.

## The five-year arc

| Era | Stack | Why we moved |
|-----|-------|--------------|
| **1.0 — BSC (Oct 2021)** | $ZOO BEP-20 + PancakeSwap LP + AnimalNFTs as ERC-721 | Cheapest path to launch a tokenomics-driven conservation protocol with the smallest team |
| **2.0 — Lux L2 (2024)** | Zoo subnet on Lux, EVM-compatible, Warp V2 messaging to C-Chain | We needed real block space, sovereign validator economics, and bridge access without our own consensus |
| **3.0 — Full PQ (2025)** | Lattice-based signatures (ML-DSA, Falcon) at the application layer; PQ-secured custody | Threat model shifted: institutional conservation funders required PQ readiness for multi-decade asset commitments |
| **4.0 — Sovereign GPU-native L1 (today)** | Own validator set, GPU-resident state, native DEX+EVM+FHE | Every L1 needs the trifecta. Borrowing trifecta features from a parent chain is not the same as owning them. |

Each transition was forced by the constraints of the previous era. None of them were aesthetic.

## What Zoo 4.0 is

Three subsystems running on the same chain, all GPU-native:

1. **Zoo DEX** — built on Liquidity Protocol's LRC-1 interface, specialized for conservation-impact assets. Standard pairs (ZOO/USDC, BTC/USDC) plus NFT pairs (impact bonds, carbon credits, animal yield products) plus FHE-private donor pairs.
2. **Zoo EVM** — EIP-1559 standard EVM with one Zoo-specific precompile at `0x0c01`: the **conservation oracle**, which queries verified field data from partner organizations (WWF, IUCN, ZSL, Panthera) and returns yield-eligibility signals.
3. **zoo-fhe-conservation** — encrypted donor flows. A funder can route money to a specific species or region without revealing their identity, the amount, or the recipient until they choose to publish.

The chain ID is 200200 (mainnet), 200201 (testnet). Block time is 1 second. Finality is 1.7 seconds with the Quasar STM-4 consensus inherited from the Lux 4.0 specification.

## The conservation oracle

The Zoo-specific precompile (`0x0c01`) is what makes this a conservation chain rather than a generic L1 with conservation NFTs. Field data — population counts, habitat health indices, anti-poaching outcomes — is signed by partner organizations and submitted on-chain. A contract that pays yield based on conservation outcomes can call:

```solidity
// Returns the verified outcome score for a project ID
uint256 score = IConservationOracle(0x0c01).query(projectId, period);
```

The signature scheme uses BLS aggregation: at least 2 of {WWF, IUCN, ZSL, Panthera, Foundation auditor} must co-sign each data point. The full signature scheme is in `/Users/z/work/zoo/papers/zoo-conservation-mission/`.

This precompile is the on-chain bridge between conservation outcomes and DeFi yield. The Zoo NFT Liquidity Protocol (which Antje named in 2021, see below) becomes a real product the moment this oracle ships.

## Antje on the lineage

I want to take a paragraph here as Chief Scientist to mark something specific. In the Zoo whitepaper I wrote on October 31, 2021 — the document at `/Users/z/work/zoo/papers/zoo-2021-original-whitepaper/` — I introduced the term "NFT Liquidity Protocol" in §4, "Differentiators." The language was: "Zoo is a liquidity protocol for NFTs, in the way that Uniswap or PancakeSwap is for tokens."

That section described animal NFTs as positions in a continuous liquidity curve — an egg, a baby, a teen, an adult, each a different state in the same protocol, with collateral locked in and unlockable on burn or transfer. The framework was specific to animals and conservation, but the abstraction was a general one: NFTs as the unit of trade in a liquidity protocol, not just collectibles in a marketplace.

Five years later, Liquidity Protocol — the cross-chain rail launching April 1 — is what that 2021 abstraction looks like at scale. Zoo 4.0 ships with Liquidity Protocol's LRC-1, LRC-2, and LRC-3 as native contracts. The Zoo DEX speaks the same wire format as Hanzo's HMM, Pars' DEX, and Lux's D-Chain. NFTs of conservation impact are first-class citizens on that rail.

Naming a thing in 2021 and watching it become an ecosystem standard in 2026 is the most concrete validation of a research direction I have experienced in this field.

## The token economics

$ZOO is fixed-supply, 100% minted at genesis. No inflation, no mining, no reissuance. It exists for governance and for the conservation tax mechanism.

The conservation tax: every DEX trade on Zoo Chain pays a 1-3% sustainability surcharge, with the rate set by ZIP governance. The surcharge accrues to the Foundation Treasury, which is governed by the Zoo DAO and audited annually by Foundation auditors. Treasury funds flow to:

- Verified conservation projects (60% of tax revenue)
- Open-source conservation tech development (20%)
- DAO operating costs and audits (10%)
- Long-term reserve (10%)

The 1-3% range was chosen to be competitive with traditional conservation finance overhead (5-15% typical) while leaving room for the DEX itself to remain liquid. Activation today sets the rate at 2.0%; the first DAO vote to adjust will come in Q3.

$AI is mineable on Zoo Chain via the same PoAI mechanism Hanzo uses, since the two chains share the compute precompile interface. Users running Zoo desktop on a GPU mine $AI and can swap to $ZOO or to fiat-backed stablecoins on the native DEX with zero bridge friction.

## Why a sovereign chain matters here

Conservation finance has a specific property that other DeFi categories do not: the cost of capital is multi-decade. A reforestation project signs a 30-year carbon credit commitment. A species protection fund commits to a 50-year monitoring schedule. The chain that hosts those commitments needs to be operational with very high probability over those time horizons.

A subnet on someone else's chain inherits that chain's lifetime. If the parent chain hard-forks, slashes its validators, or pivots its economics, the subnet's commitments are at risk. A sovereign chain controls its own consensus, its own upgrade path, and its own validator economics.

We made this concrete in `/Users/z/work/zoo/papers/zoo-conservation-mission/`. Sovereignty is not a flag we wave; it is a property required by the asset class we serve.

## The 4.0 launch in numbers

- **47** validators in the launch set (institutional + Foundation + community)
- **9.2M** $ZOO holders migrated from BSC and Lux L2 (auto-migrated, no user action)
- **$184M** TVL committed by partners at activation
- **17,300** existing AnimalNFTs ported from BSC
- **211** conservation projects with verified field data ready for the oracle
- **2.0%** initial conservation tax rate

## What ships next

April 20 is the Zoo DEX public wave on Liquidity Protocol. The on-chain bits go live today; the cross-chain access opens on April 20. There is a separate post for that launch.

April 1 is the Liquidity Protocol launch itself. Zoo Chain is one of the four launch venues alongside D-Chain, Hanzo, and Pars.

Q2 work focuses on the conservation oracle: more partners, more data feeds, and the first round of impact-bond NFTs structured against verified outcome data.

## Links

- **zoo-4-0-launch paper**: `/Users/z/work/zoo/papers/zoo-4-0-launch/`
- **zoo-2021-original-whitepaper**: `/Users/z/work/zoo/papers/zoo-2021-original-whitepaper/`
- **zoo-conservation-mission**: `/Users/z/work/zoo/papers/zoo-conservation-mission/`
- **ZIPs (governance)**: https://zips.zoo.ngo
- **Zoo Network**: https://zoo.network
- **Foundation site**: https://zoo.ngo

---

*Zoo Labs Foundation is a 501(c)(3) non-profit. Co-authored by Antje Worring (Chief Scientist) and Zach Kelling.*
