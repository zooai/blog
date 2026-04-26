---
title: "Zoo DEX Launch: Conservation Finance on Liquidity Protocol"
description: "Zoo DEX goes live on the Liquidity Protocol rail — impact-bond NFTs, carbon credits, animal yield products, all settling cross-chain. 2% sustainability tax to Foundation Treasury."
date: 2026-04-20
authors: [zoo, antje]
tags: [zoo, dex, liquidity, conservation, nft, impact-bonds, carbon, animal-yield]
---

# Zoo DEX Launch

Today, Zoo DEX goes live on Liquidity Protocol. The contracts have been deployed on Zoo Chain since the sovereign L1 activation on February 14; April 20 is the day the rail opens externally. Funders on Ethereum, traders on Solana, and conservation organizations on the Zoo Chain itself can now quote, fill, and settle impact-bond NFTs, carbon credits, and animal yield products on the same wire format that Hanzo's HMM, Pars' DEX, and Lux's D-Chain use.

This post walks through what's tradeable, why a conservation chain belongs on a generic DEX rail, and the 2% sustainability tax that flows directly to the Foundation Treasury.

## What's tradeable today

Four asset classes, all live as of 12:00 UTC:

**Standard pairs**
- ZOO/USDC, ZOO/BTC, ZOO/ETH (HMM concentrated liquidity)
- AI/ZOO (mineable token cross to governance token)
- conservation-stable pairs (CARBON-USDC, IMPACT-USDC)

**Impact-bond NFTs (ERC-721 on LRC-1)**
- WWF Tiger Conservation 2030 Bond (annual yield from monitored populations)
- IUCN Reforestation Series A (biodiversity credit yield)
- Panthera Snow Leopard Habitat Bond (10-year, anti-poaching outcomes)
- ZSL Marine Mammal Recovery Bond (cetacean population indices)

**Carbon credits**
- Verified retired credits (cannot trade after retirement, but can trade rights to retire)
- Future-vintage commitments (forward delivery against verified projects)
- FHE-private corporate offset positions (LRC-3 — buyer not revealed)

**Animal yield products**
- Living-NFT positions (the egg/baby/teen/adult curve from the 2021 whitepaper, now on-chain enforceable)
- Pooled yield notes (diversified exposure across many animal NFTs)
- Foundation impact tokens (1:1 backed by Treasury holdings, redeemable for annual conservation reports)

The full asset registry is at https://zoo.network/dex/assets.

## Why conservation belongs on a DEX rail

The objection one hears is: conservation finance is supposed to be patient capital. Why put it on a DEX where someone can flip a tiger bond in 14 seconds?

Three answers.

**Answer 1: Liquidity is access.** The biggest problem in conservation finance today is not that capital isn't patient enough; it is that capital can't get in at all. A philanthropic family office that wants to allocate $20K to anti-poaching has limited paths — most "conservation funds" require six-figure minimums, accredited investor status, or institutional relationships. A DEX-listed impact bond is purchasable in any size by any wallet. The total addressable funder base goes from thousands to millions.

**Answer 2: Patient capital can be on a DEX.** The bond contract decides the holding behavior, not the venue. Many of today's listed assets have lock-up periods (the WWF Tiger Bond has a 5-year minimum hold), early-redemption penalties (graduated 2-6% depending on the project), and yield distributions that vest over multi-year horizons. The DEX is where you enter and exit those positions; the patient-capital structure is in the asset itself.

**Answer 3: Cross-chain is necessary.** A funder in Singapore wants to allocate from their Cosmos wallet. A foundation in Geneva uses Ethereum-denominated stablecoins. A retail donor in Indonesia uses TON. Conservation-finance products that exist only on Zoo Chain reach a fraction of the available funder base. The Liquidity Protocol rail is what lets those funders participate without needing to first acquire $ZOO or learn about Zoo Chain at all.

## The 2% sustainability tax

Every trade on Zoo DEX pays a 2.0% sustainability tax — 1.0% from each side of the trade. The tax does not go to LPs. It goes directly to the Foundation Treasury, which is governed by Zoo DAO and audited annually.

Allocation:

- **60% to verified conservation projects** — the WWF, IUCN, ZSL, Panthera partner network and their grant pipelines
- **20% to open-source conservation tech** — sensor networks, anti-poaching ML models, conservation data platforms
- **10% to DAO operations and audits** — auditor fees, legal compliance, community grants
- **10% to long-term reserve** — multi-decade endowment for conservation in jurisdictions where political risk would otherwise prevent commitment

The tax rate is set by ZIP governance and adjustable. The 2.0% was chosen as the launch rate after community deliberation in `/Users/z/work/zoo/zips/` proposals from late 2025. The first DAO vote to adjust the rate is scheduled for Q3 2026.

For comparison: traditional conservation NGO overhead runs 5-15% on average. A 2% on-chain rate that flows directly to a 501(c)(3) Foundation Treasury, with annual audits and on-chain receipts of every disbursement, is a structural improvement in capital efficiency.

## Why FHE-private positions matter for corporates

LRC-3 is the FHE-encrypted pair extension. On Zoo DEX, it is used for corporate carbon offset positions where the buyer wants to acquire credits without telegraphing their volume to competitors or to the public.

A Fortune 500 company committing to net-zero by 2030 may need to acquire 200,000 tonnes of carbon credits per year. If they bought those credits in public, the market would price up against them, and competitors would learn their decarbonization timeline.

With LRC-3, the trade flow is:

1. Corporate buyer encrypts the order under their key.
2. The Zoo DEX matching engine fills the order using FHE arithmetic — no party in the middle sees the volume.
3. The retired credits are recorded on-chain with the corporate buyer's identity hidden behind a commitment.
4. At year-end, the corporate publishes their decryption key, revealing the full position. The chain history retroactively shows the trade was real, the credits were retired, and the audit is complete.

This is not theoretical. Eight publicly-listed companies are signed on as launch participants for the FHE-private offset pool, with combined annual commitments above 1.4M tonnes.

## Animal yield products: the 2021 idea, finally executable

Antje speaking. The original 2021 whitepaper described animal NFTs as positions in a continuous liquidity curve — egg, baby, teen, adult, each a state in the same protocol with collateral flowing between stages. On Binance Smart Chain in 2021, that curve was enforced by metadata and a marketplace contract; it wasn't really continuous in the way the abstraction wanted.

On Zoo Chain 4.0, with the conservation oracle precompile (`0x0c01`) and the LRC-1 contract surface, the curve is finally enforceable in the way the 2021 paper described. An animal NFT can carry collateral. Outcomes from the field (population counts, habitat health, anti-poaching results) flow into the NFT via the oracle. As the animal "ages" through the protocol stages, its collateral redistributes — eggs are speculative, adults pay yield, with intermediate states pricing the risk of survival.

This is what the 2021 paper called the "continuous position." It took five years for the substrate to exist. Today it ships.

## Numbers from the first hours

Six hours after the rail opened externally:

- 3,100 LRC-1 quotes/sec from Zoo DEX
- 88 cross-chain fills (smaller than Hanzo or D-Chain, as expected — conservation is not a high-frequency category)
- $2.1M notional volume
- $42K accrued to Foundation Treasury at the 2% rate
- 11 corporate offset trades via LRC-3 FHE pairs
- 2,400 retail impact-bond purchases (median ticket size: $312)

The retail tickets are the number we are happiest with. A median impact-bond purchase of $312 across 2,400 wallets in six hours is exactly the long-tail funder base that conservation has needed and never had.

## What's next

Q2 work splits across three threads:

- **More partners and more oracle data feeds.** Smithsonian National Zoo, Wildlife Conservation Society, and African Parks Network are in onboarding.
- **Impact-bond expansion.** Currently four bonds; we expect 25+ by end of Q2 across vertebrate conservation, marine, reforestation, and habitat connectivity.
- **Cross-chain Zoo DEX UI on liquidity.io.** Today users come to zoo.network/dex; the Liquidity reference UI will surface Zoo assets natively for users on other chains.

## Links

- **Zoo 4.0 sovereign L1**: [/2026-02-14-zoo-4-0-sovereign-l1](2026-02-14-zoo-4-0-sovereign-l1)
- **2021 NFT Liquidity Protocol lineage**: [/2026-02-16-nft-liquidity-protocol-2021-lineage](2026-02-16-nft-liquidity-protocol-2021-lineage)
- **zoo-dex paper**: `/Users/z/work/zoo/papers/zoo-dex/`
- **zoo-dex-launch-2026-04-20**: `/Users/z/work/zoo/papers/zoo-dex-launch-2026-04-20/`
- **zoo-nft-liquidity-protocol** (canonical contracts): `/Users/z/work/zoo/papers/zoo-nft-liquidity-protocol/`
- **liquidity.io**: https://liquidity.io
- **Zoo Network DEX**: https://zoo.network/dex

---

*Zoo Labs Foundation 501(c)(3). Co-authored by Antje Worring (Chief Scientist).*
