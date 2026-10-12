# GOAL: Technical Design — High-Performance Tree & Graph Data Types for Lance

## Objective
Produce a **detailed technical design document** (a single Markdown file) for adding **Tree** and **Graph** data type support to the Lance project — covering **write, storage, indexing, and query** — with high performance as a first-class requirement.

- Lance source code (READ-ONLY): `/Users/renshaobin/Workspace/Develop/GitHub/lance`
- Lance Knowledge Base (KB): `/Users/renshaobin/Workspace/Develop/GitHub/lance-knowledge-base`
- KB usage rules (MANDATORY): `/Users/renshaobin/Workspace/Develop/GitHub/lance-knowledge-base/prompt/CONSUMER PROMPT.md`

## Hard Constraints

1. **Design only, zero code.** Do not write, modify, or generate implementation code — not in the Lance repo, not anywhere. The ONLY deliverable is the design document. Do not modify any file in the Lance repository or in the KB.
2. **KB-first understanding.** Before designing anything, read `CONSUMER PROMPT.md` and follow it strictly for the entire task: KB decides WHERE to look and WHAT the contracts are; read source only via KB pointers (Navigation Protocol §3); never invent APIs, types, or behavior; honor the trust map (deep-verified vs `mapped only` areas); cite `path:line` for every claim about existing Lance behavior.
3. **Independent, merge-friendly modules.** All new Tree/Graph functionality MUST be designed as **new, standalone modules** (e.g., new workspace crates such as `rust/lance-tree`, `rust/lance-graph`, plus clearly separated optional integration points) so that future upstream Lance upgrades can be merged with minimal conflict. Any touchpoint with existing code must be (a) minimized, (b) explicitly listed, and (c) designed against documented public APIs / extension seams only — never against crate-internal items.

## Required Content of the Design Document

1. **Motivation & scope** — target workloads for Tree (hierarchical/nested ordered structures) and Graph (vertices/edges, adjacency, traversal) on a columnar lakehouse format; explicit non-goals.
2. **Data model mapping** — how Tree and Graph data map onto Lance's columnar model: schema representation, encoding choices (justify against `L3-symbols/format-spec.md` version gates), nullability, nested vs. flattened trade-offs, adjacency representation options (CSR-like vs. edge-list) with a reasoned choice.
3. **Write path** — how Tree/Graph data is ingested and persisted: fragment layout, transaction/operation types needed (check the commit/conflict-resolution contract), versioning implications, and how writes stay compatible with existing compaction.
4. **Storage layout** — file/fragment organization, zone maps / page structure usage, size budgets, interaction with the v2 format; what is purely additive vs. what requires a format version gate.
5. **Index design** — new index type(s) for Tree/Graph (e.g., adjacency index, path/prefix index, traversal accelerator): on-disk structure, build/update path, registration mechanism, interaction with the existing scalar/vector/FTS index framework (use the "add a new index type" recipe in `L4-crosscutting/cookbook.md` as backbone).
6. **Query design** — query operators (traversal, path queries, subtree scans, neighborhood expansion), pushdown strategy, DataFusion integration points, and how queries compose with existing Lance scan/filter/projection.
7. **Module & API design** — exact new crate/module boundaries, public API sketches (Rust traits/types, and optional Python bindings), dependency rules (what the new crates may depend on and what must never depend on them), feature flags, and the complete list of touchpoints into existing Lance code (each with the extension seam used and a merge-conflict risk note).
8. **Performance engineering** — target metrics and concrete mechanisms: IO scheduling usage, encoding/compression choices, memory-mapping, parallelism, caching; a benchmark plan (datasets, baselines, harness) consistent with the repo's benchmark setup.
9. **Compatibility & migration** — on-disk format compatibility (forward/backward), behavior when old readers meet new data, feature detection.
10. **Implementation plan (design-level)** — milestone breakdown, file-by-file plan (which new files, which existing files touched and why), testing strategy per `L4-crosscutting/build-and-test.md`, and open questions/risks.

## Process Requirements

- Follow the CONSUMER PROMPT's workflow: L0 → L1 Module Map → Navigation Index → targeted source reading → L3 contracts. Do not wander the repo.
- Every design decision that depends on existing Lance behavior MUST cite the KB document and the source `path:line` it rests on.
- Where the KB is insufficient or contradictory, follow its §6: produce Gap Reports / KB Bug Reports as a separate section at the end of the design document — do NOT guess.
- If any part of your design would violate a documented contract, invariant, or version gate, redesign — or explicitly justify and flag it as a risk requiring maintainer review.

## Deliverable

One Markdown file: `/Users/renshaobin/Workspace/Develop/GitHub/lance-design/tree-graph-design.md`
(create the directory if missing; do not place the document inside the Lance repo or the KB).

End the document with: (1) a self-review checklist against every L3 contract you relied on, (2) the Gap/Bug Report section, (3) an explicit statement of which KB trust-map areas the design depends on.
