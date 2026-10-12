> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../V21-PROTOCOL.md).

# Historical sections from rust-lance-file-v1-writer.md

## Seven source-test oracles

| Test | Exact evidence and boundary |
|---|---|
| test_write_file | 100 rows across 19 roots, typed values and nested/dictionary combinations; preload schema dictionaries and assert full equality after reopening; no actual non-Null-type nulls or schema discovery |
| test_dictionary_first_element_file | Sole field0 UInt32/UTF8 dictionary cycles a/b/c; full equality with supplied hydrated schema |
| test_write_temporal_types | Two second timestamps without timezone and two microsecond timestamps tagged America/Los_Angeles; complete equality, not timezone conversion |
| test_write_empty_non_nullable_string | Write one zero-row batch, finish summary rows0, reopen batch0 rows0; does not cover no calls or an empty outer slice |
| test_collect_stats | Two batches of3 and2 rows; IDs0/1/5/6, exact schema, null counts0 and numeric/string bounds; list is not requested and no supported scalar is omitted |
| test_encode_slice | 250 four-row slices from one 1000-row Int32 buffer; file size<16000 and exact concatenated readback |
| test_write_schema_with_holes | IDs0/2 and ten rows; after finish assert in-memory entries(0,0)/(2,0), with no reopened disk-table assertion |

Evidence: rust/lance-file/src/versions/v1/writer/mod.rs:715-1150; rust/lance-file/src/versions/v1/writer/mod.rs:1229-1311. In the statistics fixture UTF8 maxima are exactly c/e, despite the nearby historical FIXME about incremented maxima. Helpers build explicit null_count/min_value/max_value structs and collect all file batches in memory for comparison. (rust/lance-file/src/versions/v1/writer/mod.rs:1111-1227)

Local tests do not assert rejected nullability, failure/cancellation ordering, provider errors, repeated finish, no-write finish, explicit invalid stats IDs, evolved dictionary equality, shutdown byte-count authority or overflow. These are source-observed boundaries, not runtime reproductions. The full [statistics implementation](../rust-lance-file-v1-statistics.md) and [V1 binary fixture](rust-lance-file-binary-fixtures.md) are now covered. Backend implementations and remaining fixture formats are still necessary before repository-wide acceptance. (rust/lance-file/src/versions/v1/writer/mod.rs:694-1311)

