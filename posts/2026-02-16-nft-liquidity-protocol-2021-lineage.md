---
title: "The 2021 Lineage: How the NFT Liquidity Protocol Became Liquidity Protocol"
description: "Antje Worring coined 'NFT Liquidity Protocol' in §4 of the October 31, 2021 Zoo whitepaper. Five years later, that abstraction is the cross-chain rail."
date: 2026-02-16
authors: [zoo, antje]
tags: [history, research, nft, liquidity-protocol, zoo, 2021, antje-worring]
---

# The 2021 Lineage

Two days ago, Zoo activated as a sovereign GPU-native L1, with Liquidity Protocol's LRC-1, LRC-2, and LRC-3 contracts native to the chain. The cross-chain Liquidity Protocol launches April 1. By April 20, four production DEXes — Zoo, Hanzo, Pars, and Lux's D-Chain — will be running on a common rail.

The term "Liquidity Protocol" — and the underlying abstraction of NFTs as positions in a continuous liquidity curve — has a specific origin. It was coined in §4 of the Zoo whitepaper published on October 31, 2021. The author of that section was Antje Worring, then and now Chief Scientist of Zoo Labs Foundation. This post is from her, marking that lineage.

## What the 2021 whitepaper said

The published whitepaper PDF lives at `/Users/z/work/zoo/papers/zoo-2021-original-whitepaper/zoo-2021-original-whitepaper.pdf`. The relevant section is titled "Zoo: An NFT Liquidity Protocol," and it opens with these two sentences:

> *Zoo is a liquidity protocol for NFTs, in the way that Uniswap or PancakeSwap is for tokens.*

> *Animals exist as continuous positions: egg, baby, teen, and adult forms each represent a state in the protocol. Collateral is locked into each NFT and unlockable on burn or transfer.*

In 2021, the conventional NFT model was discrete — each token was a distinct collectible, illiquid by design, with secondary trading through fixed-listing marketplaces (OpenSea, LooksRare). The conventional fungible-token DEX model was continuous — assets traded against AMM curves, with prices defined by pool ratios.

The abstraction in §4 was that the two could be unified. An NFT could carry collateral, and that collateral could flow continuously between life stages of an animal (egg → baby → teen → adult), creating a curve along which positions could be entered and exited. The animal was both the asset and the position. Liquidity was a property of the protocol that issued the NFT, not of a third-party AMM that listed it.

## What was happening in October 2021

The context matters. NFTs were 6 months past the Beeple/Christie's auction. CryptoPunks were trading at six figures. The Logan Paul Zoo scam (different "Zoo," same period) was disintegrating. The conventional wisdom was that NFTs were collectibles with cultural value but no economic structure beyond what marketplaces provided.

Three things made the 2021 abstraction non-obvious in that environment:

1. **Conservation as the use case.** Most NFT projects were art or gaming. Conservation was a mission domain that required the asset to do something productive — feed animals, fund habitats — over time. That demanded continuity, not collectibility.

2. **Cross-chain from day one.** The original Zoo deployment was on Binance Smart Chain because of fees, but the whitepaper anticipated chains being interchangeable for the same NFT positions. That premise — that the protocol exists above the chain — was unusual then and standard now.

3. **AI integration as a first-class concern.** §3 of the same whitepaper discussed AI and blockchain intersection, with animal NFTs as data sources for AI training and AI as governance for NFT issuance. The path from that 2021 framing to today's HLLMs is direct, even if the architecture has changed.

## The path from 2021 to 2026

The lineage is not a straight line. It went through three phases:

**Phase 1 — Validation on BSC (2021–2023).** The Zoo BEP-20 token launched, AnimalNFTs traded, conservation funding flowed. The economic model worked at small scale. The technical infrastructure (BSC + PancakeSwap) limited per-NFT continuity in practice; the original "egg → adult" curve was simulated rather than enforced on-chain.

**Phase 2 — Lux L2 rebuild (2024).** When we moved Zoo to Lux as an L2 subnet, we got real block space and EVM control. The continuity curve became enforceable: an NFT could carry collateral that was redistributable across life stages within the contract, not just metadata that suggested a curve. This is the "V4" rebuild that followed the BSC launch.

**Phase 3 — Sovereign L1 (2026).** Today's Zoo Chain owns its consensus, runs the trifecta on GPU, and ships LRC-1/LRC-2/LRC-3 — the contract surface that Liquidity Protocol standardizes — as native primitives. The 2021 abstraction is now a wire format that other chains can adopt.

## Why "Liquidity Protocol" is the right name

There was a moment in late 2025 when we considered renaming the cross-chain rail to something more generic. "Cross-Chain DEX Standard." "Universal Trading Layer." Several proposals.

We kept "Liquidity Protocol" — without the "NFT" prefix, since the rail handles all asset classes — for two reasons.

First, fidelity to the original abstraction. The whole point of the 2021 framing was that liquidity is a protocol-level property, not a venue-level property. The name has to reflect that. "DEX" or "Trading Layer" centers the venue. "Liquidity Protocol" centers the network.

Second, naming continuity. Five years of papers, talks, and product decisions have used "Liquidity Protocol" as the term. Renaming for marketing reasons would erase a thread of intellectual lineage that the field benefits from preserving.

The dropped "NFT" prefix is the only change. NFTs are no longer the only asset class — Liquidity Protocol handles fungible tokens, NFTs, FHE-private positions, and compute receipts. But the abstraction that made NFTs liquid is the same one that makes any asset class liquid: protocol-level continuity, with the asset as the position.

## What this lineage means for the field

A research idea that takes five years to become standard does so because three things had to happen:

1. **The infrastructure had to catch up.** GPU-native chains, FHE precompiles, BLS aggregation across heterogeneous chains — these were not available in 2021. The abstraction was correct; the substrate was not yet.

2. **The use cases had to multiply.** Conservation NFTs were one application. Compute receipts (Hanzo), DEX-native securities (Pars), confidential trading (D-Chain) are others. The general framework needs many specific instances to be recognized as general.

3. **The naming had to stabilize.** "Liquidity Protocol" was used variously through 2022-2024 to mean different things. By 2025 the meaning had converged in a community of practitioners that included the Lux, Hanzo, Zoo, and Pars teams. April 1's launch is the formalization, not the invention.

I am writing this from the perspective of someone who has watched a research idea I named become a product I could not have built alone. The team work — across Lux's chain architecture, Hanzo's AI infrastructure, Pars' DEX, and the broader engineering crews — is what made the path real. The 2021 abstraction was a starting point. The 2026 product is everyone's.

## Links

- **Zoo 2021 Original Whitepaper**: `/Users/z/work/zoo/papers/zoo-2021-original-whitepaper/zoo-2021-original-whitepaper.pdf`
- **Zoo 4.0 launch post**: [/2026-02-14-zoo-4-0-sovereign-l1](2026-02-14-zoo-4-0-sovereign-l1)
- **Liquidity Protocol spec**: https://github.com/liquidity-io/spec
- **Antje Worring**: https://antjeworring.com

---

*Zoo Labs Foundation. Authored by Antje Worring, Chief Scientist.*
