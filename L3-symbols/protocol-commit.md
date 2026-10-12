# Dataset commit, transactions and conflict resolution

> Refresh 2026-10-12, `011953c22097b67b699595adbe99e7f0155d83e4`: source coordinates updated. [Changed contracts](refresh-2026-10-12.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

**Trust: source-verified contract and navigation, not runtime qualification.** Scope is the current Dataset commit/rebase path. The frozen [transaction definition](../L2-files/rust/lance-table/src/format/transaction.rs.md) and [table module](../L1-modules/rust-lance-table.md) remain the authority for operation payloads, codecs and manifest application. [Dataset map](../L1-modules/rust-lance.md) · [Behavior contracts](behavior-contracts.md).

## Ownership and publication

A transaction describes intent relative to `read_version`. Data-file completion is not dataset publication. `InsertBuilder` writes fragments, constructs an Overwrite or Append transaction, then supplies it to `CommitBuilder`; `execute_uncommitted` stops before that publication. `CommitBuilder` selects new, existing or detached commit paths and constructs a new Dataset handle from the committed manifest. (rust/lance/src/dataset/write/insert.rs:108-183; rust/lance/src/dataset/write/insert.rs:219-320; rust/lance/src/dataset/write/commit.rs:469-582)

For an existing dataset, the normal publication loop is:

1. Retain the transaction's read-version Dataset and index state. A strict Overwrite (`num_retries == 0`) skips automatic rebase; otherwise restore the original read snapshot when required. There are `max(num_retries, 1)` attempts, not `num_retries + 1`. (rust/lance/src/io/commit.rs:1691-1747)
2. Fetch the latest Dataset and intervening transactions; sort transactions by committed version. Check writer feature flags. Construct the resolver from original intent/read-state, load current lineage, check every intervening operation in order, then finish rebase. Resolver errors propagate out of this publication loop. (rust/lance/src/io/commit.rs:1625-1635; rust/lance/src/io/commit.rs:1748-1811)
3. Serialize the rebased transaction, write an external transaction file when configured, and select the next non-detached version. Prepare index state afresh from the latest manifest on each attempt. Restore uses its separate old-manifest path. Build/migrate the candidate, fix schema, validate storage version and fragment IDs, and migrate/withdraw index coverage before publication. (rust/lance/src/io/commit.rs:1548-1623; rust/lance/src/io/commit.rs:1826-1937)
4. Publish through `write_manifest_file` and the selected CommitHandler. On success cache transaction/manifest/index state and run automatic cleanup; a cleanup-hook error is logged, not converted into commit failure. (rust/lance/src/io/commit.rs:1641-1687; rust/lance/src/io/commit.rs:1916-1946)
5. On a publication collision, establish the actual outcome before retry or cleanup. A retry fetches current state and rebuilds candidate/attempt-local index assembly; it must not feed prepared output back into original transaction intent. (rust/lance/src/io/commit.rs:1589-1623; rust/lance/src/io/commit.rs:1947-2087)

An optional overall `CommitBuilder` timeout is separately validated (zero is invalid). The lower commit retry timeout defaults to 30 seconds; `LANCE_COMMIT_RETRY_TIMEOUT_SECS` accepts a positive finite floating-point number, is cached on first access, and warns/falls back on invalid input. The lower retry clock starts after initial catch-up. Attempt zero is not bounded by the remaining-retry helper; later attempts use the remaining duration. First collision backoff derives from that attempt's elapsed time, excluding catch-up. These are different clocks, not one hard bound on all work. (rust/lance/src/dataset/write/commit.rs:310-335; rust/lance/src/io/commit.rs:89-153; rust/lance/src/io/commit.rs:1741-1811; rust/lance/src/io/commit.rs:1947-2032)

## Errors, retries and ambiguous success

| Result | Meaning and caller obligation | Evidence |
|---|---|---|
| Publication `CommitConflict` | The commit loop may catch up, rebase and publish a new candidate within its attempt/time budget. This is not automatically an operation-level conflict. | rust/lance/src/io/commit.rs:1947-2032 |
| Resolver retryable conflict (**R** below) | Current operation payload cannot safely merge as-is. Error propagates from `check_txn`/finish; an outer operation may need to reread/recompute. Do not promise that this commit loop silently rebuilds arbitrary user work. | rust/lance/src/io/commit/conflict_resolver.rs:468-525; rust/lance/src/io/commit.rs:1753-1803 |
| Resolver incompatible conflict (**I** below) | Reject this stale/incompatible intent. Do not resubmit it unchanged as a publication collision. | rust/lance/src/io/commit/conflict_resolver.rs:468-525 |
| `CommitStatusUnknown` | Publication could have succeeded. Preserve evidence/files, inspect durable table state, and reconcile before retrying or destructive cleanup. This wrapper is deliberately not classified as ordinary not-found. | rust/lance/src/io/commit.rs:237-350; rust/lance/src/io/commit.rs:1971-1991; rust/lance-core/src/error.rs:601-615 |

After a handler error, the commit path reads the target manifest and its durable transaction and compares **serialized protobuf transaction values**, not transient in-memory payloads. Outcomes are Ours, Foreign, Absent or Unknown. A manifest without our recorded transaction is Foreign. Missing manifest is definitive Absent only if the handler says version-not-found is definitive; otherwise bounded read retries may end Unknown. Recovery makes at most three read attempts. (rust/lance/src/io/commit.rs:237-350)

Ours normally becomes success, with caches/cleanup updated. On `OtherError`, a handler may explicitly request that the original error still propagate after confirmed success. Foreign/Absent permit cleaning the stale transaction file; Unknown forbids that cleanup. Exhausted publication conflicts clean the attempt's transaction file and return conflict. Therefore “returned error” is not proof that nothing committed, and blanket file deletion in a caller's error path is unsafe. (rust/lance/src/io/commit.rs:1947-2087)

## Directional operation rules

Read each row as **our uncommitted operation against an intervening committed operation**. Rules are asymmetric. Table shorthand MemWal means `UpdateMemWalState`, Config means `UpdateConfig`, and Bases means `UpdateBases`. **P** means the checker permits proceeding, possibly after coverage mutation and finish-time validation; it does not guarantee commit success. **R** and **I** have the meanings above. “Other P” never overrides the global guards or specialized rules that follow.

Global guards run before the table: a Project/Merge that does not preserve nullability versus a value-supplying Append/Update/DataReplacement/DataOverlay is R in either order; Merge versus an effective schema/field metadata update is R in either order; Restore versus such a metadata update is I in either order. Effective metadata update means replacement or nonempty updates, not merely an empty optional map. (rust/lance/src/io/commit/conflict_resolver.rs:637-704)

| Our operation | Intervening operations and disposition | Evidence |
|---|---|---|
| Append | Overwrite/Restore/MemWal are I; other P. | rust/lance/src/io/commit/conflict_resolver.rs:1867-1899 |
| Overwrite | Overwrite is R unless conflicting configuration upserts make it I; UpdateConfig is I on upsert collision, otherwise P; MemWal I; other P. | rust/lance/src/io/commit/conflict_resolver.rs:1814-1865 |
| Delete | Merge R; Overwrite/Restore/MemWal I. Rewrite/DataReplacement touching our modified fragments R. Delete/Update use affected-row reconciliation below. Other P. | rust/lance/src/io/commit/conflict_resolver.rs:706-811 |
| Update | Merge R; Overwrite/Restore I. Project, Append, other Update, Overlay, Rewrite/Replacement and MemWal have specialized rules below. Other P. | rust/lance/src/io/commit/conflict_resolver.rs:812-1070 |
| CreateIndex | Overwrite/Restore I; index-name/removal/singleton collisions R as below. Merge/Rewrite/Replacement/Update may withdraw coverage or conflict. MemWal permits our MemWal maintenance, otherwise I. Other P. | rust/lance/src/io/commit/conflict_resolver.rs:1071-1545 |
| Rewrite | Overwrite/Restore I; Merge R. Overlapping Delete/Update/Overlay/Replacement or Rewrite R, except tagged double-consumption I. New indices and concurrent FRI maintenance have specialized rules. Other P. | rust/lance/src/io/commit/conflict_resolver.rs:1546-1813 |
| DataReplacement | Overwrite/Restore/MemWal I; Merge R. Removed target fragment/field I. Same-fragment field replacement, row-moving update, new affected-field index or overlapping rewrite may be R. Other P. | rust/lance/src/io/commit/conflict_resolver.rs:1900-2065 |
| DataOverlay | Overwrite/Restore/MemWal I; Merge R. Removed target fragment or rewrite consuming it R. Row-moving Update needs finish-time row validation; Overlay/Replacement and other P. | rust/lance/src/io/commit/conflict_resolver.rs:2082-2182 |
| Merge | Overwrite/Restore/Project/MemWal I; Update/Append/Delete/Rewrite/Merge/Replacement/Overlay R. CreateIndex installing MemWal R, other CreateIndex P; Reserve/Clone/Config/Bases P. | rust/lance/src/io/commit/conflict_resolver.rs:2184-2223 |
| Restore | MemWal I; other P subject to global metadata guard. | rust/lance/src/io/commit/conflict_resolver.rs:2225-2254 |
| ReserveFragments | Overwrite/Restore I; other P. | rust/lance/src/io/commit/conflict_resolver.rs:2256-2284 |
| Project | Merge/Project R; Overwrite/Restore/MemWal I; other P subject to global nullability guard. | rust/lance/src/io/commit/conflict_resolver.rs:2286-2318 |
| UpdateConfig | Against Overwrite, any schema-metadata option, nonempty field-metadata map or conflicting config upsert is I. Against UpdateConfig, conflicting upsert or same metadata target is I. Other P subject to global guards. | rust/lance/src/io/commit/conflict_resolver.rs:2320-2384 |
| MemWal | Config/Rewrite/Reserve/Bases P. MemWal/Update compare SST shard generations; CreateIndex does so if it installs MemWal, otherwise P. Append/Overwrite/Delete/Replacement/Overlay/Merge/Restore/Clone/Project I. Activation checks run again during application. | rust/lance/src/io/commit/conflict_resolver.rs:2386-2464 |
| UpdateBases | Another UpdateBases with equal nonzero ID, equal present name, or equal path is I; otherwise P. | rust/lance/src/io/commit/conflict_resolver.rs:2466-2507 |
| Clone | Checker returns P; this says nothing about validation/application in other layers. | rust/lance/src/io/commit/conflict_resolver.rs:670-704 |

### Row updates, deletes and overlays

Delete/Update first accept disjoint modified-fragment sets. An overlap requires an affected-row map; without one it is R. For tracked fragments, changed data-file identity or disappearance of the initial fragment is R. A changed deletion file marks the fragment for finish-time reconciliation. If the operation already removed entire fragments and supplied no updated fragments, initialization can discard the affected-row map as a full-fragment shortcut. (rust/lance/src/io/commit/conflict_resolver.rs:245-465; rust/lance/src/io/commit/conflict_resolver.rs:706-1070)

Finish-time reconciliation loads current deletion vectors for marked fragments. Any intersection between current deletions and our affected rows (or an indeterminate intersection size) is R. Otherwise union deletions, remove fully deleted fragments or write/cache replacement deletion files, update transaction fragment metadata and advance `read_version` to the current manifest. A marked fragment without the required affected-row map is an internal error. The operation is not safe merely because the earlier fragment-level test returned P. (rust/lance/src/io/commit/conflict_resolver.rs:2585-2745)

Update has additional guards: with a primary-key filter, a concurrent Append is R; another Update without a filter is R; mismatched filter fields, comparison failure or possible overlap is R. Project removing a modified field is R. Against an Overlay, RewriteColumns conflicts when the same updated fragment and modified field overlap, regardless of actual row overlap. A row-moving update (new fragments with RewriteRows or unspecified mode) requires affected rows and rejects intersection with overlay coverage. (rust/lance/src/io/commit/conflict_resolver.rs:812-1070)

Overlay ordering is deliberately asymmetric. Our Overlay after another Overlay or RewriteColumns update is permitted by this checker; the newer overlay can win. Against a row-moving Update, mark affected fragments, then compare `(current deleted offsets − original deleted offsets)` with the union of our overlay coverage across fields. Intersection or missing current fragment is R; otherwise advance read version. A concurrent Delete alone does not mark a fragment for this calculation, but removing an entire target fragment already conflicts. A Delete combined with a marked Update may cause a conservative retry. (rust/lance/src/io/commit/conflict_resolver.rs:2082-2182; rust/lance/src/io/commit/conflict_resolver.rs:2759-2829; rust/lance/src/io/commit/conflict_resolver.rs:3264-3293)

DataReplacement rejects removal of a nonnegative replacement field or target fragment as I. A partial Delete can coexist. Update conflicts when it removes the target (I), or when a matching updated fragment is row-moving or modifies a replacement field (R). Another replacement conflicts only on both fragment and field overlap. A new index on a replaced field conflicts irrespective of its fragment bitmap. (rust/lance/src/io/commit/conflict_resolver.rs:1900-2065)

### Index coverage and rewrite lineage

CreateIndex detects duplicate new ordinary names, two installations of either system singleton, append-versus-drop of the same name, and conflicting replacement of a shared removed UUID. Pure duplicate removal is idempotent. CreateIndex after Update/Merge/DataReplacement may withdraw coverage through current tagged lineage; a bitmap must never keep claiming rows whose indexed values changed. Without the tagged withdrawal path, affected-field DataReplacement is R. Merge installing MemWal or removing/retyping indexed fields in the tagged path is R. (rust/lance/src/io/commit/conflict_resolver.rs:1071-1391; rust/lance/src/io/commit/conflict_resolver.rs:1463-1545)

CreateIndex after Rewrite uses provenance, not just destination fragment IDs. In the durable tagged-lineage path each new index needs a bitmap; same-name segment coverage is unioned. Overlap is R if the rewrite is not recorded in lineage or the index is NGram. Recorded partial coverage may proceed without claiming the unproven transition, leaving scan fallback. The in-memory untagged FRI path has separate frozen behavior. (rust/lance/src/io/commit/conflict_resolver.rs:1340-1476)

Rewrite after CreateIndex differs: deferred remapping without a new FRI requires every rewrite group to be entirely inside or entirely outside each segment's bitmap; a partial group is R. Eager remapping conflicts with any new index covering an old source. A concurrent FRI replacement must contain exactly one new and one removed index, otherwise I. Tagged assembly reloads the current entry at finish; frozen v0 maintenance instead accumulates legacy cleanup history. (rust/lance/src/io/commit/conflict_resolver.rs:1658-1813)

Two Rewrite operations that overlap old fragments are R. A tagged intent whose transition source/destination is consumed by the other rewrite is **I**, even though a nearby comment describes retrying: the actual error requires rebuilding transition intent. Concurrent whole-entry untagged FRI replacements are R only when the transient payload is available; the source records that this transient field does not survive protobuf persistence, so that frozen v0 collision branch is not a cross-process guarantee. (rust/lance/src/io/commit/conflict_resolver.rs:1546-1658)

Tagged rewrite intent must have been built from the transaction's **read-version** snapshot. `proposed.dataset_version != transaction.read_version` is rejected. Diff the proposal against that original entry to obtain only our additions; do not accidentally re-add concurrent writers' transitions. If the original read version has been cleaned up, propagate checkout failure rather than guess. Finish assembles those additions against the **current** entry into a separate `TaggedRewriteAssembly`, refreshing base version and validating the complete lineage. An attempt's assembly must never replace original intent. (rust/lance/src/io/commit/conflict_resolver.rs:42-113; rust/lance/src/io/commit/conflict_resolver.rs:3046-3075; rust/lance/src/io/commit/conflict_resolver.rs:3169-3229)

A v0-shaped proposal racing with a table that has become tagged is converted from its newly added legacy versions into ordered-compaction transitions, then passed through current tagged assembly. The sticky feature flag still identifies tagged history after a trim removes the entry. Pure v0-table behavior stays on its frozen whole-history replacement path; this is existing compatibility behavior, not permission to extend legacy writers. (rust/lance/src/io/commit/conflict_resolver.rs:2983-3161)

Finishing CreateIndex merges relevant historical FRI maintenance, reconciles already-committed MemWal compacted SST facts by highest generation per shard, and ensures all current matching singleton UUIDs appear in removals. This fact-merging differs from proposal conflict checks: for proposed SST progress against an intervening operation, the same shard's committed generation `>= ours` is I, lower is R; disjoint shards are P. Application still validates current state. (rust/lance/src/io/commit/conflict_resolver.rs:2509-2535; rust/lance/src/io/commit/conflict_resolver.rs:2831-2971)

## Extending the operation protocol: ordered read sets

Do not place a new operation only in the top-level matcher. First define persistent intent and its compatibility/validation/application rules, then decide both directions of conflicts, then expose an API. The following sets deliberately separate definition/application from orchestration so each task starts with at most five files.

**Definition/application set:** [transaction definition, including PB conversion references](../L2-files/rust/lance-table/src/format/transaction.rs.md) → [table transaction map](../L1-modules/rust-lance-table.md). Select the definition, codec, validation, index-maintenance and manifest-build records relevant to the new payload; frozen records hold exact ranges. Do not serialize attempt-local tagged assembly as user intent.

**Publication/conflict set:**

1. `rust/lance/src/dataset/write/commit.rs:310-582` — public builder validation and path dispatch.
2. `rust/lance/src/io/commit.rs:1548-2087` — fresh-attempt state, catch-up, candidate building, publish/recovery.
3. `rust/lance/src/io/commit/conflict_resolver.rs:637-704` — global symmetric guards and directional dispatch; then the relevant rows/ranges above, and `rust/lance/src/io/commit/conflict_resolver.rs:2520-2583` for finish dispatch.
4. `rust/lance/src/io/commit.rs:237-350` — reconcile ambiguous outcomes; preserve durable transaction identity.

These are three unique source files. A concrete new operation must also choose its public caller and definition/application subtask; this document does not imply those can all be changed safely by editing one matcher. Validate input and preserve stable format/API contracts; no tests or generated/binary files were analyzed for this synthesis.

## Refresh: unknown history and maintenance

[Current compatibility and conflict clauses](refresh-2026-10-07.md#manifest-transaction-compatibility) cover Unknown operations, including Clone/UpdateBases exceptions. [Maintenance clauses](refresh-2026-10-07.md#fragment-reuse-remapping-and-concurrency) govern rederivation of trim/prune on retries, v0 trim subsequences, and the distinction between stable-ID deferred compaction and tagged transition admission. [Clone/GC clauses](refresh-2026-10-07.md#clone-and-garbage-collection) replace blanket tagged-clone refusal for the Dataset API.

## Refresh — 2026-10-09

Pin `db684d1f0726c00b6defb7963a604a7719e82b5a`. [Current contract amendments](refresh-2026-10-09.md) cover memwal schema ownership and reads. The JSON target-type declaration is ahead of the constructors at this pin: current constructors still emit Unspecified. Do not infer implemented preservation from the proto comments.

## Current delta — 2026-10-11

[Current refresh contracts](refresh-2026-10-11.md) supersede changed field-ID/transaction, unstable encoding, cache, API, MemWAL and index-coverage statements at the new pin. Follow the task index for bounded source reading.
