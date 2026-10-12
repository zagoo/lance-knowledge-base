> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../V21-PROTOCOL.md).

# Historical sections from rust-lance-file-shared-reader.md

## Test evidence and limits

| Coverage | Versions / exact oracle |
|---|---|
| Sparse values/lists with null/empty cases |V2_3 full, slice1..5 and take[0,3,5] equal Arrow originals |
| Full positive Int8 dictionary |V2_2 all128 keys0..127, full batch equality |
| Payload corruption |V2_1 mini-block count; V2_1/2/3 Arrow dictionary, storage dictionary and mini-block offsets; typed CorruptFile plus message |
| Ordinary/embedded identity |V2_0 standard(0,3); mini/self-described(2,0); full equality in embedded tests |
| Projection |V2_0/1/2 field-ID/name and base/read-time modes, exact values/batch sizing; empty/duplicate errors |
| Lazy metadata |V2_1 direct/FSL/nested eager-baseline equality; zero-row reads fetch<half metadata; direct repeated read0IO |
| Indexed rejection |V2_0 NotSupported despite shape preference; missing projection InvalidInput; blob/packed NotSupported |
| Unequal roots |V2_1 indexed[a,c] open succeeds/read_tasks fails; singlec returns100 |
| IO grouping |WarmV2_1 multi-page scan1IO; warmV2_0/1 take across16columns1IO |
| Drop behavior |V2_0 stream usable after reader drop; receiver-dropped direct scheduling returns without panic |
| Globals |V2_1 retained versus fallback byte equality and0/1IO; schema not retained; out-of-range index error |
| Deep size |All4V2 versions exceed1024 and50*columns; no eviction/allocation measurement |
| Synthetic lengths |V2_0/1 struct mismatch, list boundary, empty struct; V2_0 unloaded blob opaque |

Detailed fixtures, exact byte patches, matrix inputs, helpers and oracle limitations are in the L2. The tests do not establish filtered-take parity, base-projection restriction, concurrent metadata single-flight, unknown-schema consistency, complete malformed-footer safety or backend-independent performance. None was executed. (rust/lance-file/src/reader.rs:2476-2656; rust/lance-file/src/reader.rs:2808-3407; rust/lance-file/src/reader.rs:3409-3937; rust/lance-file/src/reader.rs:4032-4804)

