> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../V21-PROTOCOL.md).

# Historical sections from rust-lance-core-cache.md

## Facade source-test guarantees and gaps

The Moka concurrent success/error/cancellation tests wait for owner-start and first-Pending contender handshakes. Success asserts four hits/one miss; shared error asserts all Timeout and one loader; cancellation asserts a new loader returns31 within five seconds after abort. Early start/parking waits are not timeout-bounded. Test HashMapBackend deliberately uses non-coalescing get/load/insert and excludes key weights; do not copy it as a production backend specification. Wrong-type tests cover sized paths only. (rust/lance-core/src/cache/mod.rs:737-756; rust/lance-core/src/cache/mod.rs:937-1038; rust/lance-core/src/cache/mod.rs:1179-1191; rust/lance-core/src/cache/mod.rs:1289-1465)

The ignored serialization example is stale: current CacheCodecImpl requires TYPE_ID/CURRENT_VERSION and CacheEntryWriter/Reader signatures. Treat the symbol declarations and codec analysis as authoritative. No tests or examples were compiled/run during this offline analysis. (rust/lance-core/src/cache/mod.rs:15-29; rust/lance-core/src/cache/codec.rs:209-228)

## Benchmark and allocation-test boundaries

[Criterion benchmark](../../L2-files/rust/lance-core/benches/cache_keys.rs.md) · [Allocation integration test](../../L2-files/rust/lance-core/tests/cache_key_allocations.rs.md). The legacy-shaped benchmark types are local comparison models, not released fixtures or a supported legacy writer. Their string/Arc keys, invalidation-enabled Moka construction, extra future boxing and weak-handle ownership differ from the current facade. Operation comparisons would include those costs, not isolate hashing alone. (rust/lance-core/benches/cache_keys.rs:44-207)

| Benchmark group | Cases and timed work | Setup outside measurement | Evidence |
|---|---|---|---|
| cache_key_preparation | legacy formatted/Arc key vs typed BLAKE3, both outer RandomState hash; dataset vs1024-character prefix | namespace derivation and prefix allocation | rust/lance-core/benches/cache_keys.rs:209-247 |
| cache_namespace_derivation | root; child dataset; child160-character segment | root for child cases; long string | rust/lance-core/benches/cache_keys.rs:249-273 |
| cache_operations | strong/weak warmed get; rotating insert; legacy/fixed | Runtime,64KiB caches,1024-character prefix, warm32-byte value and16 reused32-byte values | rust/lance-core/benches/cache_keys.rs:275-357 |

Rotating inserts use512 page IDs,column17 and separate Relaxed sequence counters. Finite keys/reused payloads bound workload growth but do not guarantee equal retention or all keys fitting capacity. Warmed hits return Options without assertions. No timings, ratios, sample settings or passing benchmark results are supplied by this source analysis. (rust/lance-core/benches/cache_keys.rs:296-365)

TrackingAllocator forwards to System and counts alloc/alloc_zeroed/realloc calls before they occur, gated by thread-local boolean and one global counter; dealloc is uncounted. Counts describe API attempts, including potential failures/in-place realloc, not bytes. measured_allocations has no panic guard and is neither nested-measurement-safe nor concurrent-measurement-safe. Only one local test uses three sequential windows. (rust/lance-core/tests/cache_key_allocations.rs:12-57; rust/lance-core/tests/cache_key_allocations.rs:125-166)

The test prebuilds namespace and warms three key shapes, then asserts0 counted calls separately for path+u32+u64, generation+Some16bytes, and generation+None. Its prepare_key reproduces the facade's canonical hash pipeline but never calls cache backend, codec or value sizing. It establishes a source assertion for those warmed fixtures only; it was not executed. (rust/lance-core/tests/cache_key_allocations.rs:59-166; rust/lance-core/src/cache/mod.rs:553-563)
