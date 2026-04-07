---
title: "DeSci on Zoo: Decentralized Science Infrastructure"
description: "Open biodiversity databases, citizen science, research DAOs, and reproducibility attestation — how Zoo builds the infrastructure for decentralized science."
date: 2026-04-06
authors: [zoo]
tags: [desci, science, biodiversity, research, governance]
---

# DeSci on Zoo: Decentralized Science Infrastructure

Science has a reproducibility problem and a funding problem. Over 70% of researchers report failing to reproduce published results. The funding pipeline — grant applications, institutional review, publication gatekeeping — takes years and favors incremental work over fundamental research. Decentralized Science (DeSci) addresses both by building infrastructure that makes research data open, funding permissionless, and results verifiable.

Zoo Labs Foundation is building DeSci infrastructure specifically for biodiversity science and AI research. This post describes the six systems specified in ZIPs 0600 through 0606.

## ZIP-0600: Open Biodiversity Database

The world's biodiversity data is fragmented across thousands of institutional databases, most of which are incompatible, many of which are paywalled. GBIF (Global Biodiversity Information Facility) aggregates 2.4 billion occurrence records but cannot enforce data quality standards across contributing institutions. iNaturalist collects citizen observations but lacks the structured metadata that research requires.

ZIP-0600 specifies an open biodiversity database on the Zoo subnet with three properties that existing databases lack:

**Content-addressed storage.** Every observation record is stored on IPFS with its content hash recorded on-chain. Records cannot be silently modified — any change creates a new record with a new hash, and the provenance chain from original to modified is visible.

**Structured quality tiers.** Records are classified into three tiers based on verification:

- **Tier 1 (Community):** Citizen science observations with photo evidence, GPS coordinates, and species identification by the observer. Equivalent to iNaturalist "Research Grade."
- **Tier 2 (Expert):** Tier 1 records verified by a credentialed taxonomist (verified via Hanzo IAM credential). Verification is recorded on-chain with the verifier's DID.
- **Tier 3 (Institutional):** Records from institutional surveys with standardized methodology, peer-reviewed sampling design, and complete metadata (weather, habitat, transect specification). Submitted by institutional DIDs.

**Permissionless contribution.** Anyone can submit observations. Tier promotion happens through verification, not gatekeeping. A citizen scientist in Borneo who photographs an undocumented species enters the database at Tier 1 and can reach Tier 3 through expert verification and methodological documentation — without institutional affiliation.

The database currently holds 340,000 records, primarily from pilot programs in East Africa (Kenya Wildlife Service partnership) and Southeast Asia (Borneo rainforest survey).

## ZIP-0601: Citizen Science Protocol

ZIP-0601 specifies the protocol for citizen science campaigns — structured data collection efforts coordinated through the Zoo network.

A campaign has:

- **Scope:** Geographic area, target species or taxa, collection period
- **Methodology:** Standardized observation protocol (photo requirements, GPS precision, time-of-day constraints)
- **Incentives:** $ZOO token rewards for valid observations that meet methodology requirements
- **Validation:** Automated pre-screening (image quality, GPS plausibility, known range check) followed by expert review for borderline cases

The reward structure is designed to incentivize quality over quantity. A single well-documented observation of a rare species in a data-sparse region earns more than 100 blurry photos of common species in well-surveyed areas. The reward function:

```
reward(obs) = base × rarity_multiplier(species)
            × data_gap_multiplier(location)
            × quality_multiplier(metadata_completeness)
```

Rarity and data gap multipliers are computed from the existing database — species with fewer records and locations with less coverage generate higher rewards. This creates a natural incentive to fill gaps in the global biodiversity knowledge base.

Active campaigns: 3 (Tsavo East large mammals, Borneo primates, Mediterranean seagrass).

## ZIP-0602: Research DAOs

Research DAOs are the funding mechanism for DeSci on Zoo. A Research DAO is a purpose-built organization that pools capital, selects research proposals, funds researchers, and governs the resulting intellectual output.

The DAO structure:

**Treasury.** Funded by $ZOO token allocations, conservation fund disbursements, and direct donations. The treasury is a multisig on the Zoo subnet with spend authorization via DAO vote.

**Proposals.** Researchers submit proposals specifying: research question, methodology, timeline, budget, expected outputs, and open data commitments. Proposals are reviewed publicly — any $ZOO holder can comment, and the review period is a minimum of 14 days.

**Voting.** Token-weighted voting with delegation. Quorum is 33% of circulating $ZOO. Approval threshold is 51%. Quadratic voting is available for proposals flagged as high-impact by the Research Committee.

**Milestones.** Funded research is paid in milestone tranches. Each milestone requires deliverables (data, code, draft manuscript) that are reviewed by the DAO before the next tranche is released. If a milestone is rejected, the remaining funds return to the treasury.

**IP governance.** All research funded by Zoo Research DAOs must be published open access. Data must be deposited in the ZIP-0600 biodiversity database or an equivalent open repository. Code must be published under Apache 2.0 or MIT. The DAO retains no IP rights — the researcher retains authorship credit, the community retains access.

Active Research DAOs: 2 (Biodiversity AI, Conservation Economics). Combined treasury: $420K.

## ZIP-0603: Reproducibility Attestation

The reproducibility crisis in science is partially a tooling problem. Researchers describe their methods in papers, but the description is never precise enough to reproduce the computation. Package versions, random seeds, hardware differences, preprocessing steps — any of these can produce different results.

ZIP-0603 specifies a reproducibility attestation system:

**Environment capture.** When a researcher runs an experiment, the reproducibility tool captures the complete environment: OS, package versions (lock file), hardware specs, random seeds, input data hashes, and the git commit of the analysis code.

**Attestation.** The environment capture and output hashes are recorded on the Zoo subnet. The attestation proves: "This code, at this commit, with these dependencies, on this hardware, with this input data, produced this output."

**Verification.** An independent party can pull the attested environment specification, run the same code, and compare output hashes. If they match, the result is reproduced. If they differ, the attestation system identifies which input differed (dependency version, hardware, data).

**Integration.** The attestation tool integrates with standard research workflows — Python (pip/uv), R (renv), Julia (Pkg), and container-based workflows (Docker/Apptainer). The researcher adds one command to their workflow; the tool handles environment capture automatically.

For AI research specifically, the attestation captures: model architecture hash, training data hash, hyperparameters, training hardware (GPU model, count, driver version), and checkpoint hashes at configurable intervals. This is the same attestation infrastructure used for Zen model verification, adapted for general research use.

## ZIP-0604: Federated Biodiversity AI

Zoo runs federated machine learning for species identification across a network of heterogeneous nodes — ranger stations with edge devices, university labs with GPU servers, and ACI compute nodes with H100 clusters. The nodes have different hardware capabilities, different local datasets, and intermittent connectivity.

ZIP-0604 specifies the federated learning protocol:

- **Model architecture:** Zen-based vision model (zen4-vl fine-tuned on iNaturalist + Zoo biodiversity database)
- **Aggregation:** FedAvg with contribution-weighted averaging. Nodes that contribute more training data get proportionally more influence on the global model.
- **Privacy:** Local data never leaves the node. Only model updates (gradients or weight deltas) are transmitted.
- **Convergence:** Formally proven convergence under Byzantine faults (see [zooai/proofs](https://github.com/zooai/proofs), federated convergence theorem)
- **Incentives:** Nodes earn $ZOO for training contributions, proportional to the improvement their update provides to the global model (measured by held-out validation set performance delta)

Current deployment: 14 nodes across 6 countries. Global model accuracy: 94.2% top-1 on the Zoo species identification benchmark (12,000 species).

## ZIP-0605: Data Commons

The Data Commons is Zoo's infrastructure for sharing research datasets with provenance tracking and access control:

- **Storage:** IPFS with pinning on Zoo-operated nodes. Large datasets (>1GB) use Filecoin for persistent storage with Zoo-funded storage deals.
- **Metadata:** Dublin Core + Darwin Core for biodiversity data. Machine-readable metadata stored on-chain.
- **Access control:** Datasets can be open (anyone), restricted (Zoo DAO members), or embargoed (time-locked, common for pre-publication data). Access control is enforced by encryption — restricted datasets are encrypted to the authorized group's keys.
- **Provenance:** Every dataset has a complete provenance chain: who collected it, how it was processed, what other datasets it derives from. Provenance is recorded on-chain and follows the W3C PROV ontology.
- **Citation:** Datasets have DOIs (via DataCite) and on-chain citation records. Researchers who use a dataset generate an on-chain citation, which contributes to the original author's reputation score.

Current Data Commons: 47 datasets, 2.1TB total, covering camera trap imagery, acoustic monitoring, satellite imagery, and genomic data.

## ZIP-0606: Research Incentives

ZIP-0606 ties the previous five ZIPs together with an economic incentive layer:

- **Data contribution:** $ZOO rewards for contributing observations (ZIP-0601), datasets (ZIP-0605), and expert verification (ZIP-0600)
- **Research output:** $ZOO rewards for publishing open-access papers with reproducibility attestations (ZIP-0603)
- **Peer review:** $ZOO rewards for reviewing research proposals (ZIP-0602) and verifying reproducibility claims
- **Compute contribution:** $ZOO rewards for running federated learning nodes (ZIP-0604)

All rewards are funded from the Zoo Foundation's research endowment and DeFi conservation yield (ZIP-0802). The total annual research incentive budget is governed by DAO vote.

## What DeSci on Zoo Looks Like in Practice

A researcher in Nairobi photographs an unknown insect. She uploads it through the Zoo app — GPS, timestamp, photo metadata captured automatically (ZIP-0600, Tier 1). An entomologist in London verifies the species identification two days later (Tier 2). The observation contributes to a citizen science campaign mapping insect diversity in the East African highlands (ZIP-0601). She earns $ZOO for the observation and uses it to vote on a Research DAO proposal to fund a systematic survey of the region (ZIP-0602). The funded survey produces a dataset deposited in the Data Commons (ZIP-0605) and a paper with a reproducibility attestation (ZIP-0603). The survey's AI species identification model is trained federally across devices in the field (ZIP-0604).

No institutional gatekeeping. No paywalls. No data silos. Every contribution is recorded, attributed, and rewarded.

## Links

- **ZIPs 0600-0606:** [zips.zoo.ngo](https://zips.zoo.ngo) — full specifications
- **Biodiversity database:** [data.zoo.ngo](https://data.zoo.ngo)
- **Research DAOs:** [dao.zoo.ngo](https://dao.zoo.ngo)
- **Papers:** [github.com/zooai/papers](https://github.com/zooai/papers)
- **Proofs:** [github.com/zooai/proofs](https://github.com/zooai/proofs) — formal verification of federated convergence and governance properties

---

*Zoo Labs Foundation is a 501(c)(3) non-profit. Learn more at [zoo.ngo](https://zoo.ngo). Governance at [zips.zoo.ngo](https://zips.zoo.ngo). Research at [github.com/zooai](https://github.com/zooai).*
