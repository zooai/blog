---
title: "ZIPs: How Zoo Labs Governs Open AI Research"
date: "2026-02-28"
author: "Zoo Labs Foundation"
tags: ["Governance", "ZIPs", "DAO", "Open Research", "Community"]
description: "Zoo Improvement Proposals (ZIPs) provide the governance framework for decentralized AI research — how community consensus shapes the future of open intelligence."
---

# ZIPs: How Zoo Labs Governs Open AI Research

Open source software has a governance problem that most projects solve poorly. Linux uses Linus Torvalds's judgment. Apache uses the Apache Software Foundation board. Node.js uses the OpenJS Foundation's technical steering committee. All of these are improvements over pure corporate ownership, but all of them still depend on a small group of trusted individuals to make final decisions.

Bitcoin solved this governance problem for monetary policy. The BIP (Bitcoin Improvement Proposal) process, modeled on Python's PEP process, provides a public record of design decisions, a structured path from idea to specification, and a social contract that makes unilateral changes to core protocol rules prohibitively costly. The process is imperfect and contentious, but it is accountable in ways that corporate decision-making is not.

Zoo Labs Foundation applies the same principle to AI research. **Zoo Improvement Proposals (ZIPs)** are the governance framework for the Zoo ecosystem: the mechanism by which the community proposes, debates, and ratifies changes to protocols, standards, and research directions.

## What ZIPs Are

A ZIP is a design document providing information to the Zoo community, or describing a new feature for Zoo's protocols, processes, or environment. ZIPs are the primary mechanism for proposing new features, collecting community technical input, and documenting design decisions.

The ZIP process is modeled on EIPs (Ethereum Improvement Proposals), which are themselves modeled on BIPs and PEPs. The conceptual lineage is explicit: every well-functioning technical community needs a public, versioned, attributable record of how it decides things.

ZIPs serve three functions:

1. **Specification.** ZIPs describe protocols precisely enough that multiple independent implementations can be built. A protocol that cannot be unambiguously specified is not ready to be governed.

2. **Discussion.** The review process requires that proposals be discussed publicly before ratification. This surfaces objections, identifies edge cases, and builds the shared understanding that makes governance legitimate rather than merely procedural.

3. **Historical record.** Ratified ZIPs are immutable. Superseded ZIPs record their supersession and link to the superseding ZIP. The governance history is part of the protocol.

## ZIP Lifecycle

A ZIP moves through the following stages:

```
Draft → Review → Last Call → Final
                           → Withdrawn
                           → Superseded
```

**Draft.** A contributor opens a pull request to the [github.com/zooai/ZIPs](https://github.com/zooai/ZIPs) repository with a new ZIP following the template. The ZIP number is assigned at this stage. Draft ZIPs are incomplete — they may lack full specification or analysis — but they must state the problem clearly and propose a solution direction.

**Review.** The draft is assigned to a ZIP editor (a community member with expertise in the relevant domain) who coordinates the review. During Review, the proposal is open for community comment. Authors are expected to respond to objections, revise the specification, and produce a document that represents genuine community input rather than a single contributor's initial idea.

**Last Call.** When the ZIP editor judges that the proposal has addressed substantive objections and reached stability, it enters a 14-day Last Call period. During Last Call, only minor corrections are accepted. This period allows the community to raise any remaining blockers before the proposal moves to vote.

**Final (or Withdrawn/Superseded).** After Last Call, the community votes on ratification. The voting threshold is specified in ZIP-000 (the meta-ZIP governing the ZIP process itself): 66% quorum of active $ZOO token voting weight, 51% approval for acceptance. If quorum is not met, the Last Call period resets for 7 additional days; if quorum is still not met, the proposal returns to Review.

A ZIP may be **Withdrawn** by its authors at any point before Final. Withdrawn ZIPs are preserved in the repository with their status noted. A ZIP may be **Superseded** when a subsequent ZIP explicitly replaces it; the original ZIP is marked Superseded with a link to the superseding ZIP.

## Ratified ZIPs as of 2026

Three ZIPs have reached Final status as of February 2026.

**ZIP-001: Decentralized Semantic Optimization (DSO).** Specifies the experience entry format, validation criteria, semantic routing algorithm, NLL-prioritized replay buffer, and DAO voting parameters for the DSO protocol. ZIP-001 is the governance layer for community-maintained experience ledgers — the mechanism by which model behavior is shaped without centralized fine-tuning. Ratified January 2026.

**ZIP-002: Proof of AI (PoAI).** Specifies the PoAI consensus mechanism: inference task format, NLL scoring methodology, Schelling point voting procedure, activation commitment scheme, and $AI token reward formula. ZIP-002 is the foundation for the Hanzo Network's AI compute chain and the Zoo desktop mining application. Ratified February 2026.

**ZIP-003: Zen Model Integration Standards.** Specifies how Zen family models are integrated into the Zoo network: model registration format, capability declaration schema, embedding compatibility requirements, and the versioning convention for model updates. ZIP-003 ensures that any Zen model — from Zen Nano to Zen 480B — can be deployed on Zoo network infrastructure without custom integration work. Ratified February 2026.

## Types of ZIPs

ZIP-000 defines three track classifications:

**Standards Track ZIPs** describe protocol changes that affect Zoo network implementations. These include changes to the DSO experience format, modifications to the PoAI consensus parameters, new token mechanics, or changes to the Zen model integration standard. Standards Track ZIPs require the full review and voting process.

Standards Track ZIPs are further subdivided:
- *Core*: changes to consensus rules, token economics, or fundamental network behavior
- *Interface*: changes to API specifications, data formats, or inter-component protocols
- *Application*: changes to application-layer standards (experience formats, skill schemas)

**Informational ZIPs** describe design principles, guidelines, or general information without proposing protocol changes. An Informational ZIP explaining the DSO threat model, or providing best practices for experience entry authoring, does not change any protocol and does not require a ratification vote. Informational ZIPs are accepted by the ZIP editor after review.

**Meta ZIPs** describe changes to the ZIP process itself. ZIP-000 is a Meta ZIP. Meta ZIPs require the same ratification vote as Standards Track ZIPs.

## Governance Token: $ZOO

The $ZOO token is the unit of voting weight in the ZIP governance process. Its properties are specified in ZIP-000:

- Fixed supply: 100% minted at genesis
- Non-mineable: no new $ZOO tokens are created through any mechanism
- Non-inflating: the supply schedule is immutable
- Distribution: allocated at genesis to foundation treasury, early contributors, community grants, and the DSO rewards pool

$ZOO is explicitly not a work token. You do not earn $ZOO by running validators or contributing compute — that is what $AI is for. $ZOO is a governance token, and its supply is fixed to prevent dilution of governance rights.

Governance rights cannot be purchased arbitrarily at current market prices because doing so would require buying from existing holders, who are economically incentivized to sell only when they believe the buyer will use the votes well. This is not a perfect defense against governance attacks, but it is a different security model from proof-of-stake governance, where governance rights are perpetually mintable.

## Why Decentralized Governance Matters for AI

The governance question for AI systems is not a peripheral concern. It is the central question.

A language model's behavior is governed by its training data, its fine-tuning objectives, and its deployment constraints. All three are, in current practice, controlled by the organizations that build and operate the models. When those organizations make decisions about what the model should and should not do, those decisions are implemented as weight updates or inference-time filters that users cannot inspect, audit, or contest.

This is not inherently malicious. Organizations make these decisions because someone must, and they are the ones with access to the training infrastructure. But it means that the values embedded in the most widely-used AI systems reflect the values of a small number of organizations operating in specific legal, regulatory, and cultural contexts.

ZIP governance does not solve the values problem. But it provides a mechanism for communities to propose, debate, and ratify the values and behavioral standards they want their AI systems to embody — and to do so in a public, auditable way that creates accountability.

The alternative — trusting AI companies to make these decisions well, in perpetuity, without accountability — is a bet that has been made before and will continue to be tested.

## Connection to DeSci

ZIPs are not limited to AI infrastructure. The Zoo Foundation's mandate extends to Decentralized Science (DeSci) — the application of open, transparent governance to scientific research methodology itself.

Future ZIPs are expected to address:

- **Scientific methodology standards**: what constitutes a replicable experiment in decentralized AI research
- **Dataset governance**: how community-contributed datasets are validated, versioned, and attributed
- **Benchmark integrity**: how evaluation benchmarks are maintained to prevent contamination and gaming
- **Preprint standards**: how Zoo Foundation papers are reviewed before arXiv submission

The insight from DeSci is that the governance problems of AI and science are the same problem: a small group controls methodology, data, and evaluation, and the rest of the community takes their word for the results. ZIP governance is the infrastructure for making that control accountable.

## How to Submit a ZIP

The ZIP repository is at [github.com/zooai/ZIPs](https://github.com/zooai/ZIPs).

To submit a ZIP:

1. Fork the repository and copy `zip-template.md` to `zip-NNNN-your-title.md` in the `zips/` directory
2. Fill in the template completely: abstract, motivation, specification, rationale, backwards compatibility, test cases
3. Open a pull request; the repository maintainers will assign a ZIP number and a ZIP editor
4. Engage with review comments and revise the specification
5. When the ZIP editor judges the proposal ready, it enters Last Call and then the ratification vote

Good ZIPs are characterized by precision and honesty. A ZIP that overstates its benefits or minimizes its costs is harder to ratify, not easier — reviewers will identify the gaps and the discussion will stall. State the problem clearly. State the trade-offs honestly. Specify the protocol unambiguously.

## ZIPs in Discussion

Several proposals are in active discussion and approaching Draft status:

**ZIP-004: Federated Learning Standard.** Proposes a protocol for privacy-preserving federated fine-tuning on community-contributed data. Addresses the privacy gap in the current DSO experience entry format, where entries are public by default.

**ZIP-005: Model Verification Specification.** Proposes a cryptographic scheme for verifying that a deployed model corresponds to a claimed set of weights. Addresses the trust gap where users must take a service provider's word that they are running the model they claim.

**ZIP-006: Cross-Chain Experience Bridging.** Proposes a mechanism for DSO experience entries to be verified and accepted across multiple blockchain networks. Addresses ecosystem fragmentation for communities that operate on different chains.

Community members interested in contributing to any of these proposals should join the discussion at [forum.zoo.ngo](https://forum.zoo.ngo) before opening a ZIP pull request. Pre-ZIP discussion surfaces problems early and produces better proposals.

---

*ZIP process documentation at [zips.zoo.ngo](https://zips.zoo.ngo). Governance forum at [forum.zoo.ngo](https://forum.zoo.ngo). $ZOO token information at [zoo.ngo/token](https://zoo.ngo/token).*
