> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../V21-PROTOCOL.md).

# Historical sections from rust-lance-file-v1-statistics.md

## Test oracles and their limits

The [complete L2 catalog](../../L2-files/rust/lance-file/src/versions/v1/writer/statistics.rs.md) preserves each literal fixture and assertion, including24 primitive cases,13 string/binary/fixed-binary cases,19 constant values tested with/without null, timestamp unit/timezone sampling, float subsequence bounds, and string/binary/fixed-binary property generators. Fourteen entry points include the empty-outer panic, empty typed arrays, float NaN/infinity/zero behavior, two dictionary examples, complete collector batch/schema comparisons and Boolean multi-array null counting. (rust/lance-file/src/versions/v1/writer/statistics.rs:932-2249)

The width71 fixed-binary fixture expects its absent maximum tagged64, whereas production tags both bounds with original width71. This is a literal code/fixture discrepancy; dependency equality semantics and test execution are unverified. Decimal fixture expected scalars explicitly use precision38/scale10 while arrays use constructor defaults. Do not claim a passing/failing runtime from those lines alone. (rust/lance-file/src/versions/v1/writer/statistics.rs:1284-1293) (rust/lance-file/src/versions/v1/writer/statistics.rs:1542-1600) (rust/lance-file/src/versions/v1/writer/statistics.rs:446-450)

Binary property generators use half-open0..u8::MAX, excluding0xFF; deterministic cases cover all0xFF overflow separately. Float properties exempt NaN from inequalities and do not assert null_count. No local direct collector test establishes duplicate-ID behavior, unsupported-type selection, parent validity masking, fixed-binary appendability or safe retry after failure. (rust/lance-file/src/versions/v1/writer/statistics.rs:1491-1541) (rust/lance-file/src/versions/v1/writer/statistics.rs:1647-1948) (rust/lance-file/src/versions/v1/writer/statistics.rs:2038-2249)
