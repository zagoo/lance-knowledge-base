# KB-only contract answers — 2026-10-12

Prepared before source confirmation, from [current contracts](../../L3-symbols/refresh-2026-10-12.md) and retained [prior answers](../refresh-4ac2f7c8/contract-answers.md). Q2 scalar/index extension is unchanged; frag_reuse changed only excluded tests. It is skipped.

## Q1 — Write/compact

MemWAL generation creation opts into preserving base-table field IDs. The policy passes through insert, version/schema preparation and new-dataset commit. Ordinary callers default to reassignment; hidden lineage fields remain separate from normal fields. Fixed file names still reject target bases. Uncommitted insertion still omits publication. Compaction behavior is retained. Evidence W01–W09.

## Q3 — Format and gates

RowLineageColumn remains an empty field-ID-resolved v2 marker. The removed comment changes neither fields nor wire numbers. Contrary to the prior E06 claim, bit 11 is unstable: implementation sets both feature words and supports the capability only in debug builds or with the opt-in environment variable present. Stable file-version contracts are unchanged. Evidence F01–F02.

## Q4 — Python mapping

Python namespace insert methods deserialize the inner response, whose optional fields now document row count and version. DirectoryNamespace returns input IPC row count and the written dataset version, with no transaction ID. This does not promise that every REST backend or the default trait implements insertion. Evidence N01–N03.

## Q5 — Transactions/conflicts

The generation-only crate-private policy changes new-dataset canonicalization: preserve carried IDs, validate overwrite schema and primary key, then validate the operation. Existing-dataset retry/conflict and high-water semantics remain as previously documented. The flag is default-false; it is not a public bypass for caller IDs. Evidence W07–W08.
