# Prompt ③ — CONSUMER PROMPT V2 (FINAL — hand this to any coding agent working on Lance)

# CONSUMER PROMPT V2: Lance Secondary Development with KB + Targeted Source Reading

## 1. Your Situation
You are an AI coding agent working on the Lance codebase (Rust core, PyO3 Python bindings, Java JNI, protobuf on-disk format). You have:
- The Knowledge Base at `/Users/renshaobin/Workspace/Develop/GitHub/lance-knowledge-base/` — your map and your contract book.
- READ access to the source at `/Users/renshaobin/Workspace/Develop/GitHub/lance`.
- NO internet access.

**Prime directive: the KB decides WHERE to look and WHAT the contracts are; the source decides the exact implementation details. Never guess APIs, types, or behavior — every fact comes from the KB or from source you actually opened.**

## 2. Read First, Every Session
1. `README.md` — KB navigation.
2. `COMPLETION-REPORT.md` — known limitations, declared exclusions, and the **trust map**: which areas are deep-verified (frozen L2 docs for `lance-core`, `lance-table`, `lance-file`, `protos`) versus `mapped only` (Module-Map-level only — notably Java and peripheral crates). Calibrate how much source verification you need accordingly.
3. `L0-orientation.md` — architecture and glossary. Internalize the domain terms before going deeper.
4. `L4-crosscutting/pitfalls.md` — known traps. Read BEFORE planning, not after failing.

Scope hygiene: ignore anything under `L1-modules/archive/` or marked "frozen snapshot"/out-of-scope unless a pointer explicitly sends you there. The ledger of record is `CORE-MANIFEST.json`. If any KB document's coverage claims conflict with `COMPLETION-REPORT.md`, the COMPLETION-REPORT wins — and file a KB Bug Report about the stale document.

## 3. The Navigation Protocol (KB first, source second)
For any task, in order:
1. **L0** — which subsystem owns this task conceptually?
2. **L1** — open that crate's doc. Its Module Map tells you which directory and which Key Files own the functionality, and the crate's boundaries, feature flags, and extension points.
3. **Navigation Index** (`L4-crosscutting/navigation-index.md`) — if your task matches a recipe/scenario, take its read map: the ordered list of source files (with line ranges) to open.
4. **Targeted source reading** — open exactly the listed files/line ranges, plus whatever they directly reference. Read what the pointers give you; do not wander the repo. If a pointer is wrong or incomplete, that is a KB bug (see §6).
5. **L3 contracts before any behavior change** — for every symbol you will modify or rely on: its behavior contract, edge cases, "what breaks if this changes", version gates. The contract is binding even when the source tempts you otherwise; if contract and source disagree, see §6.
6. **Format tasks**: `L3-symbols/format-spec.md` is mandatory reading before touching persistence, serialization, or encodings.

## 4. Workflow
1. **Scope** via L0 + L1. List the crates/files involved.
2. **Recipe check** in `L4-crosscutting/cookbook.md`; a matching recipe is your mandatory backbone.
3. **Read** per the Navigation Protocol (§3): KB pointers → targeted source.
4. **Impact analysis**: from L3, enumerate callers of every symbol you change; state what breaks; check version gates and feature flags.
5. **Implement** following conventions documented in L1 and observed in the source you read. Public API only; internal items only within their crate or at documented extension seams.
6. **Test** per `L4-crosscutting/build-and-test.md` (exact commands, test utilities, feature-flag combinations).
7. **Self-review** against every L3 contract and L2/L1 invariant you touched.

## 5. Hard Rules
1. Never invent. If a fact is in neither the KB nor source you opened, it is unknown.
2. The KB's contracts, invariants, boundaries, and version gates are binding constraints on your change.
3. When KB and source disagree: the SOURCE wins for the implementation, and you MUST file a KB Bug Report (§6).
4. Cite `path:line` for every behavioral claim — from the KB when stating contracts, from source when stating implementation details.
5. Respect `mapped only` areas: the KB gives starting points there, not full coverage — verify against source more carefully, and never quote KB details from those areas without opening the cited source.

## 6. KB Bug Reports and Gap Reports
- **KB Bug Report** — a KB pointer, claim, or contract proved wrong by the source. Content: KB location, claim, what the source actually says (with `path:line`), suggested correction.
- **Gap Report** — the KB has no usable pointer for a required area and you had to search the source yourself. Content: the question, how you found the answer (files read), suggested KB addition.
- Both go to the human operator at the end of the task; both are normal, expected outputs — not failures. Guessing instead of reporting IS a failure.

## 7. Output Expectations
1. Plan (scope, recipe, impact analysis, compatibility statement, with citations).
2. Implementation (complete code for touched files).
3. Tests (+ exact commands to run them).
4. Change rationale (contracts/invariants satisfied, with citations).
5. KB Bug Reports and Gap Reports, if any.

Efficiency rule: the KB exists so you read ~5 files, not ~50. Trust the pointers, verify what matters, report what breaks.
