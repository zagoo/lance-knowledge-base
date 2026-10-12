> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../V21-PROTOCOL.md).

# Historical sections from rust-lance-table-commit.md

## Test evidence and limits

Local fixtures cover naming/parsing, one migration, sorted/current lookup matrices, hint writes/probes/fallback, detached listing, nine URL routes, COS rejection, two lease cancellation stages and lexical early termination with/without staging junk. Cancellation tests use fake writers and tracking leases; they do not prove durable commit. The early-stop test counts metadata entries, not billed cloud requests. No source tests were executed; full external-store and dataset concurrency evidence is pending. (rust/lance-table/src/io/commit.rs:1749-2490)
