# Lance KB Loop Me workflow — V2.1

The user's [V2.1 amendment](../V21-PROTOCOL.md) is authoritative. The Loop Me skill at `/Users/renshaobin/.agents/skills/loop-me/SKILL.md` defines this workflow; the explicit user request authorizes execution without an interview. Runtime Goal status is managed separately.

Inputs: read-only Lance checkout, single [CORE-MANIFEST](../CORE-MANIFEST.json), milestone state and frozen deep evidence. All output stays in the KB. Consumers may read source. Tests/generated code/binaries/external implementations remain excluded.

1. ANALYZE: address Step 0 once, then M1, M2, M3, M4 in order. Reuse frozen contracts. Read only what establishes a missing contract or navigation pointer. No ordinary-file L2 expansion, wholesale symbol indexing or old line-count targets.
2. Write a canonical contract or Module Map and link other layers to it. Track changed artifacts and new assertions. Select Key Files explicitly. Update only CORE-MANIFEST.json with truthful evidence; unclassified entries stay unclassified until mapped or deeply covered.
3. VERIFY delta: changed-document links, ledger consistency and at most ten changed claims. Do not re-audit unchanged frozen source claims. Fix issues and record the iteration result.
4. At a milestone boundary perform all five full V2.1 checks, including ten navigation tasks, KB-only contract answers and at least twenty random claims. Only these boundaries/end permit a full cross-link scan. Expose later-milestone gaps; do not invent early passes.
5. Record results in verification-log.md and iteration-state.json. Advance only after delta verification. Step 0 is exactly iteration 86 and does not recur.
6. M4 requires M1–M3, 100% classified/navigation-covered ledger, all five final checks passing, then COMPLETION-REPORT.md with trust map/exclusions.

Do not run historical per-file/all-KB verification, MANIFEST regeneration or fixture reconstruction tools. Use V2.1 delta/milestone tools. Frozen L2 bodies and symbols.json are immutable; snapshot notices explain historical scope separately.
