# Scoped contract answers — KB only, before source confirmation

Pin: `84d1681e07af565837f2d97e72ff1b8b040cd15c`. All five original questions touch changed files. The unchanged portions retain the [iteration-95 answers](../iteration-095-contract-answers.md); current changes are answered below from [delta contracts](../../L3-symbols/refresh-2026-10-07.md), [commit](../../L3-symbols/protocol-commit.md), [index](../../L3-symbols/protocol-index.md), and [format](../../L3-symbols/format-spec.md). This is a Navigation & Contract Layer test, not a source replacement test.

## Q1 — Write, then compact

Staged physical files become visible through manifest publication, not existence alone. V2.2/V2.3 blob writers now create independently owned managed objects, requiring paired sticky flags; descriptors preserve exact base/range identity. Compaction may preserve/adopt existing managed descriptors instead of copying payload. Stable IDs do not imply physical addresses: deferred compaction with address-domain indices is distinct from row-ID-domain user indices, and tagged transition intent still rejects stable-ID datasets. Trim/prune must rederive on rebase; ambiguous outcomes preserve files. Cleanup protects retained/branch references and fails conservatively on unresolved FRI. Evidence: B01–B07, C04, F02, F08–F09, T04.

## Q2 — Scalar index extension

Implement ScalarIndex plus plugin/trainer interfaces and register identity/details. Existing certainty, filtering, publication and row-domain requirements remain. Load methods now receive the persisted segment version. Streaming remap uses RowAddrTranslator; fallback needs complete stored fragment counts and a bounded budget. Only typed RemapUnavailable allows skipping; arbitrary errors are not a skip signal. Bitmap joins BTree/NGram N:1 merge support. JSON rejects new array/object targets and its wrapper lacks persisted target-version identity. These are declared limits, not invented compatibility guarantees. Evidence: F03–F06, I01–I02 and the retained extension protocol.

## Q3 — V2 semantics and gates

Retain exact file-version selectors and stable format boundaries from the format specification. New managed kinds 4/5 use known ranges and explicit-base semantics; feature bit 14 is sticky and paired. Bit 15 is the first unknown boundary, not an enabled feature. Current transaction offset is field 23 with deprecated-21 fallback; unknown transaction operations can be represented for reads, but cannot be serialized/applied as new writes. Do not derive a universal conflict rule from that decoding behavior. Evidence: T01–T03 and B01–B04.

## Q4 — Python/API mapping

Primary Python facade routes through PyO3 into Dataset/Scanner as retained in public-api and declaration maps. Deprecated index_cache_size emits DeprecationWarning and has no effect; byte-based cache controls apply. Fragment staging's stable-ID option does not assign IDs; commit does. Rust Scanner schema projection is now public and resolves by names/types rather than identical IDs. Adapter boolean coercion is restricted to AND/OR/NOT; count pushdown must respect cardinality and physical-versus-visible statistics. Java remains mapped only. Evidence: Q01–Q04 plus the existing facade map.

## Q5 — New transaction operation and conflicts

Coordinate operation definition, codec, manifest application, equality/metadata predicates, admission and directional conflict dispatch. Preserve schema tags and current transaction-section compatibility. Unknown history is read-only; current Clone and UpdateBases have exceptions to the comment claiming universal incompatibility. Maintenance replay, trim/prune rederivation and v0 ordered-subsequence checks must preserve provenance across retries. Appends/add-column changes can carry opaque history when no physical columns are rewritten. Dataset clone relocates tagged history through its own path, not the generic gate's Clone branch. Evidence: T01–T04, C01/C03 and F01/F08/F09.

No question required guessing beyond the contracts; source confirmation is recorded separately. These answers do not assert runtime or binary compatibility qualification.
