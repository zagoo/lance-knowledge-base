> **V2.1 navigation and contract layer.** Source reading is permitted. Production contracts retained from iteration 85 remain valid at the recorded snapshot. Historical line-count/test-coverage statements are provenance, not completeness requirements. Use [V2.1 protocol](../V21-PROTOCOL.md) and CORE-MANIFEST.json for current scope.

> Refresh 2026-10-12, `011953c22097b67b699595adbe99e7f0155d83e4`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-12.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

# lance-core

**Deep local coverage retained — no re-analysis planned.** All 42 currently selected production files have frozen verified L2 records. Former counts included tests and support files; they are not the V2.1 completion denominator.

[Orientation](../L0-orientation.md) · [Symbol index](../L3-symbols/symbol-index.md) · [Behavior contracts](../L3-symbols/behavior-contracts.md) · [Build/test](../L4-crosscutting/build-and-test.md)

The crate exports common cache/container/datatypes/deepsize/error/levenshtein/traits/utils modules and re-exports the error/result surface. This boundary provides core types without requiring a concrete lance Dataset in the row-taking abstraction. (rust/lance-core/src/lib.rs:11-20; rust/lance-core/src/traits.rs:12-26)

| Reviewed file | Responsibility |
|---|---|
| [Cargo.toml](../L2-files/rust/lance-core/Cargo.toml.md) | Workspace-inherited package/dependency settings, optional DataFusion and backtrace features; rust/lance-core/Cargo.toml:1-65 |
| [lib.rs](../L2-files/rust/lance-core/src/lib.rs.md) | Exports, reserved names/IDs, LazyLock Arrow fields and exact string matching; rust/lance-core/src/lib.rs:1-98 |
| [utils.rs](../L2-files/rust/lance-core/src/utils.rs.md) | Public utility-module declarations; rust/lance-core/src/utils.rs:4-24 |
| [traits.rs](../L2-files/rust/lance-core/src/traits.rs.md) | Publicly visible but documented-internal DatasetTakeRows abstraction; rust/lance-core/src/traits.rs:12-27 |
| [address.rs](../L2-files/rust/lance-core/src/utils/address.rs.md) | Physical row address packing/conversion/formatting and tests; rust/lance-core/src/utils/address.rs:6-116 |
| [blob.rs](../L2-files/rust/lance-core/src/utils/blob.rs.md) | Deterministic bit-reversed sidecar filenames and tests; rust/lance-core/src/utils/blob.rs:32-100 |
| [cpu.rs](../L2-files/rust/lance-core/src/utils/cpu.rs.md) | Platform SIMD detection and diagnostics; rust/lance-core/src/utils/cpu.rs:7-369 |
| [tokio.rs](../L2-files/rust/lance-core/src/utils/tokio.rs.md) | CPU pool, environment parsing, fork reset, panic-preserving spawn; rust/lance-core/src/utils/tokio.rs:12-272 |
| [futures.rs](../L2-files/rust/lance-core/src/utils/futures.rs.md) | Two-consumer replay, bounded permits, EOF/drop callbacks; rust/lance-core/src/utils/futures.rs:15-701 |
| [assume.rs](../L2-files/rust/lance-core/src/utils/assume.rs.md) | Checked exported assertion macros; rust/lance-core/src/utils/assume.rs:4-43 |
| [parse.rs](../L2-files/rust/lance-core/src/utils/parse.rs.md) | Boolean token and environment interpretation; rust/lance-core/src/utils/parse.rs:5-83 |
| [error.rs](../L2-files/rust/lance-core/src/error.rs.md) | Exhaustive error enum, typed signals, conversion/clone rules, backtrace and tests; rust/lance-core/src/error.rs:1-1748 |
| [levenshtein.rs](../L2-files/rust/lance-core/src/levenshtein.rs.md) | Unicode-scalar edit distance and borrowed thresholded suggestions; rust/lance-core/src/levenshtein.rs:1-133 |

## Established API contracts

`row_lineage_field_id(&str) -> Option<i32>` maps only _rowid, _row_created_at_version and _row_last_updated_at_version to -3/-4/-5. `is_system_column(&str) -> bool` recognizes these plus _rowaddr and _rowoffset. Matching is exact and case-sensitive. The root's UInt64 Arrow metadata fields are nullable for scan/selection use, while hidden persisted lineage columns have a separate non-null contract. (rust/lance-core/src/lib.rs:22-98; protos/fragment_metadata.proto:288-305)

`DatasetTakeRows: Debug + Send + Sync` supplies `schema(&self) -> &Schema` and async `take_rows(&self, row_ids: &[u64], projection: &Schema) -> Result<RecordBatch>`. It is an extension boundary for internal consumers, not a promise of stable public behavior merely because Rust visibility is pub. No ordering or missing-ID policy is defined by the trait itself. (rust/lance-core/src/traits.rs:12-27)

`RowAddress(u64)` privately stores high-32 fragment and low-32 offset. The maximum fragment and all-ones row are tombstone constants, but constructors accept them. `address_range` computes fragment+1 without an overflow guard, so its maximum-u32 input is an unresolved caller-boundary risk, not evidence that every call is unsafe. (rust/lance-core/src/utils/address.rs:23-79)

`blob_path(&Path, &str, u32) -> Path` constructs base/stem/32-bit-reversed-binary-id.blob without IO. Changing the bit reversal, width or suffix changes stored sidecar lookup identity. (rust/lance-core/src/utils/blob.rs:32-41)

## Features, dependencies and pending work

Feature `datafusion` activates optional common/SQL dependencies and gates DataFusionResult plus parser/DataFusion conversions. `backtrace` is off by default according to manifest comments; enabled capture generation delegates to Snafu's Option<Backtrace>, while disabled fields are zero-sized and accessor returns None. Local docs name RUST_BACKTRACE=1, but dependency-level environment checks remain unreviewed. All dependency declarations are preserved in L2; a complete reason/call-site mapping and resolved versions are not yet established. (rust/lance-core/Cargo.toml:14-58; rust/lance-core/src/error.rs:11-55; rust/lance-core/src/error.rs:427-486; rust/lance-core/src/error.rs:838-841; rust/lance-core/src/error.rs:957-1039)

No code was changed or tests executed. The row-address/blob tests were read and their asserted cases and gaps recorded; they are not reported as passing runtime tests. (rust/lance-core/src/utils/address.rs:92-116; rust/lance-core/src/utils/blob.rs:43-100)

## SIMD API and dispatch policy

Public `#[non_exhaustive] enum SimdSupport` has None, Neon, Sse, Avx, AvxFma, Avx2, Avx512, Avx512FP16, Lsx and Lasx. Its Display implementation emits lowercase labels (AVX512 FP16 uses `avx512_fp16`). Public `struct SimdInfo` has `pub tier: SimdSupport`, `pub target_arch: &'static str`, `pub host_features: Vec<&'static str>`. `pub fn simd_info() -> SimdInfo` reports cached `pub static SIMD_SUPPORT: LazyLock<SimdSupport>` and a newly constructed raw capability list; only x86 populates that list. (rust/lance-core/src/utils/cpu.rs:7-96; rust/lance-core/src/utils/cpu.rs:98-164)

On x86 the priority is AVX512F with optional FP16 bit, AVX2+FMA, AVX+FMA, AVX, None. Sse is never selected here. aarch64 iOS/tvOS and macOS select Neon; Linux requires HWCAP_FPHP; Windows/Android helpers return false. loongarch prefers LASX then LSX. This proves selection policy only; matching every selected tier to downstream unsafe kernels remains pending. (rust/lance-core/src/utils/cpu.rs:164-304)

## CPU pool API and failure contract

`pub fn get_num_compute_intensive_cpus() -> usize` reads a process-wide LazyLock. `pub static IO_CORE_RESERVATION: LazyLock<usize>` is public. Environment settings are cached on first relevant use, and invalid numeric values panic through the initializer. (rust/lance-core/src/utils/tokio.rs:12-76)

| Setting | Accepted value | Default/interaction | Evidence |
|---|---|---|---|
| LANCE_CPU_THREADS | Trimmed usize >=1 | If readable, overrides automatic sizing; otherwise max(1, CPU count minus reservation) | rust/lance-core/src/utils/tokio.rs:23-61 |
| LANCE_IO_CORE_RESERVATION | Trimmed usize >=0 | 2 when env read fails; automatic sizing still leaves >=1 compute worker | rust/lance-core/src/utils/tokio.rs:63-76 |

Full public submission signature follows; `Result` is std::result::Result with caller-selected E, not the Lance alias. Work is submitted synchronously when this function is called. The returned future awaits the join outcome and rethrows the original panic payload; pure-CPU restrictions are documented but not type-enforced. (rust/lance-core/src/utils/tokio.rs:135-208)

```rust
pub fn spawn_cpu<
    E: std::error::Error + Send + 'static,
    F: FnOnce() -> std::result::Result<R, E> + Send + 'static,
    R: Send + 'static,
>(func: F) -> impl Future<Output = std::result::Result<R, E>>
```

The private Runtime is leaked for static lifetime, uses one async worker and the configured maximum blocking workers, and is lazily published through SeqCst atomics. Non-Windows child-after-fork hook clears pointer/election state. Initialization panic has no guard resetting the election flag; pthread_atfork errors are ignored. Neither these failure paths nor fork behavior has been runtime-tested during this extraction. (rust/lance-core/src/utils/tokio.rs:78-134)

## Stream API and extension boundaries

Public `enum Capacity { Bounded(u32), Unbounded }` controls cloned-item backlog, not bytes. `SharedStream<'a,T:Clone>::new(inner:BoxStream<'a,T>,capacity:Capacity)->(Self,Self)` returns two handles with shared private mutex state. `impl<T:Clone> Stream for SharedStream<'_,T>` has Item=T. `Bounded(0)` is accepted but cannot acquire a permit, even after dropping one side. (rust/lance-core/src/utils/futures.rs:21-80; rust/lance-core/src/utils/futures.rs:127-170)

```rust
pub trait SharedStreamExt<'a>: Stream + Send where Self::Item: Clone {
    fn share(self, capacity: Capacity)
        -> (SharedStream<'a, Self::Item>, SharedStream<'a, Self::Item>);
}
```

Only `BoxStream<'a,T>` implements the sharing extension here. The two consumers must advance sufficiently evenly under bounded capacity; unbounded capacity can retain the entire input. Dropping a lagging side discards its pending clones/releases permits; dropping a pending polling owner releases ownership and wakes the parked peer outside the mutex. Upstream panics and clone panics have no recovery guarantee. (rust/lance-core/src/utils/futures.rs:82-247; rust/lance-core/src/utils/futures.rs:249-275)

Both callback wrappers are public structs generic over `S: Stream, F: FnOnce()`, expose `pub fn new(stream:S,f:F)->Self`, and implement Stream<Item=S::Item>. `FinallyStream` calls F synchronously on the first observed None; early destruction does not call it. `OnDropStream` calls F at destruction, including unpolled or early-dropped instances, and does nothing special at EOF. Callback panics propagate. (rust/lance-core/src/utils/futures.rs:277-361)

```rust
pub trait FinallyStreamExt<S: Stream>: Stream + Sized {
    fn finally<F: FnOnce()>(self, f: F) -> FinallyStream<Self, F>;
}
pub trait StreamOnDropExt: Stream + Sized {
    fn on_drop<F: FnOnce()>(self, f: F) -> OnDropStream<Self, F>;
}
```

These are signature-only excerpts: both methods have default bodies, and blanket implementations cover stream types. FinallyStreamExt's default body constructs fields directly, while its blanket implementation calls FinallyStream::new; StreamOnDropExt's default calls OnDropStream::new. Exact bodies and pin projection are preserved in L2. (rust/lance-core/src/utils/futures.rs:309-322; rust/lance-core/src/utils/futures.rs:363-370)

## Parsing and assertion APIs

`pub fn str_is_truthy(val:&str)->bool` accepts only case-insensitive 1/true/on/yes/y. `pub fn str_to_bool(val:&str)->Option<bool>` additionally recognizes 0/false/off/no/n and returns None for unknown tokens. Neither trims input. `pub fn parse_env_as_bool(env_var_name:&str,default_value:bool)->bool` trims a present value and truth-tests it; unrecognized-but-present means false, while absent/non-Unicode uses the default. (rust/lance-core/src/utils/parse.rs:5-42)

Crate-root `assume!($cond)` and `assume!($cond, $($arg)+)` forward to assert!; `assume_eq!($left,$right)` and its message arm forward to assert_eq!. Both retain release checks. They are public macro exports, not unsafe optimizer promises or debug-only checks. Exact token patterns are retained in L2/L3. (rust/lance-core/src/utils/assume.rs:4-28)

Private data and helper symbols, cfg variants, tests, exact signatures, local callees and known lexical external uses are listed in [the symbol records](../L3-symbols/symbols.json). Whole-repository callers, dependency source internals and unreviewed crate public APIs remain incomplete.

## Errors and diagnostic suggestions

The [error API supplement](rust-lance-core-errors.md) lists all 37 explicit variants, source-defined constructors/accessors, full signatures, feature gates and conversion/clone matrix. It distinguishes preserved typed sources from preserved immediate categories: owned Arrow external errors can recover the original Lance error; borrowed Arrow always becomes a string-category error; DataFusion wrapper/collection/shared branches have different fidelity. (rust/lance-core/src/error.rs:157-425; rust/lance-core/src/error.rs:843-1039)

`Error::is_not_found` traverses selected IO/Wrapped sources and explicitly vetoes direct CommitStatusUnknownError wrappers. `fence_reason`, `is_backpressure`, `is_commit_status_unknown`, `external_source` and `into_external` have narrower direct-variant/source checks. The module defines signals; it does not implement their writer/transaction retry rules. (rust/lance-core/src/error.rs:541-565; rust/lance-core/src/error.rs:601-615; rust/lance-core/src/error.rs:753-821)

`pub fn levenshtein_distance(s1:&str,s2:&str)->usize` computes exact char-based edit distance with O(m*n) time and O(m+n) total auxiliary memory, including both char vectors. `pub fn find_best_suggestion<'a,'b>(input:&'a str,options:&'b [impl AsRef<str>])->Option<&'b str>` returns the earliest closest option at distance <=floor(input char count/3); empty input returns None. It computes every option's full distance even after an exact match. FieldNotFoundError Display uses this lazily and lists only ten candidates while searching all of them. (rust/lance-core/src/levenshtein.rs:17-89; rust/lance-core/src/error.rs:57-88)

## Datatypes and Field trees

The [datatype API supplement](rust-lance-core-datatypes.md) covers both full source files, including exact public declarations, logical-string grammar, stable blob descriptor names, comparison modes, metadata/ID conversion and tree-operation edge cases. The corresponding L2 documents are [datatypes.rs](../L2-files/rust/lance-core/src/datatypes.rs.md) and [field.rs](../L2-files/rust/lance-core/src/datatypes/field.rs.md). Schema module exports and their implementation are covered in the [schema supplement](rust-lance-core-schema.md). (rust/lance-core/src/datatypes.rs:1-1005; rust/lance-core/src/datatypes/field.rs:1-2241)
## Core containers, memory and small utilities

The [container/memory/utility supplement](rust-lance-core-storage.md) contains exact public declarations and implementation headers, local failure modes and tests for ten additional files. It records current edge cases without claiming downstream impact or runtime validation. (rust/lance-core/src/container/list.rs:1-306; rust/lance-core/src/deepsize.rs:1-467; rust/lance-core/src/utils/backoff.rs:1-291; rust/lance-core/src/utils/tempfile.rs:1-343)
## Deletion vectors and single-rewrite mapping

The [deletion/mapping supplement](rust-lance-core-deletion-mapping.md) documents local offset filtering, stateful visible-to-physical mapping and the MappingReader contract, with exact declarations. It does not complete deletion-file IO or FRI graph traversal. (rust/lance-core/src/utils/deletion.rs:14-183; rust/lance-core/src/utils/fragment_reuse.rs:4-73)
## Ordered and stable-partition row mapping

The [row-mapping supplement](rust-lance-core-row-mapping.md) documents tri-state ordered remapping, representation selection, chained rewrite behavior, nullable destination-label ranking and the local dense count-matrix codec. External remap production/selection and persisted FRI traversal remain pending. (rust/lance-core/src/utils/row_addr_remap.rs:57-193; rust/lance-core/src/utils/stable_partition.rs:4-60)
## AIMD control and object-store test instrumentation

The [control/testing supplement](rust-lance-core-control-testing.md) documents lazy AIMD window evaluation, complete config validation, operation-specific proxy policy coverage, listing-count timing and saved seed evidence. Production rate-limiter integration and current regression-seed consumers remain pending. (rust/lance-core/src/utils/aimd.rs:102-290; rust/lance-core/src/utils/testing.rs:165-300)
## Generic split-block Bloom filters

The [Bloom supplement](rust-lance-core-bloom.md) documents canonical byte inputs, exact split-block membership/serialization, sizing estimates, builder precedence and intersection limits. Higher-level scalar-index registration, persistence metadata and query semantics are not established by these primitives. (rust/lance-core/src/utils/bloomfilter.rs:4-10; rust/lance-core/src/utils/bloomfilter/sbbf.rs:243-480)

## Cache identities and backend configuration

The [cache supplement](rust-lance-core-cache.md) specifies the canonical key protocol, backend trait, URI subset and process-local constructor registry. It also documents the typed LanceCache/WeakLanceCache lifecycle, public export routing and concrete Moka/Quick backends; downstream dataset/session integration remains pending. (rust/lance-core/src/cache/key.rs:19-314; rust/lance-core/src/cache/backend.rs:45-215; rust/lance-core/src/cache/backend_uri.rs:44-171; rust/lance-core/src/cache/registry.rs:24-193)

<a id="rust-lance-core-src-cache"></a>

### `rust/lance-core/src/cache/`

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-core/src/cache/priority.rs` | 1-117 | mapped |

## Source refresh map — 2026-10-11

Current source `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`. [Changed contracts](../L3-symbols/refresh-2026-10-11.md). Existing directory responsibilities remain; declarations below locate changed boundaries.

### `rust/lance-core/src/cache/backend.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `CacheEntry` (rust/lance-core/src/cache/backend.rs:46-46), `CacheTier` (rust/lance-core/src/cache/backend.rs:51-51), `CacheBackend` (rust/lance-core/src/cache/backend.rs:69-69).

### `rust/lance-core/src/cache/codec.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `has_cache_envelope` (rust/lance-core/src/cache/codec.rs:68-68), `CacheMissReason` (rust/lance-core/src/cache/codec.rs:151-151), `CacheDecode` (rust/lance-core/src/cache/codec.rs:173-173), `hit` (rust/lance-core/src/cache/codec.rs:179-179), `CacheRangeReader` (rust/lance-core/src/cache/codec.rs:193-193), `CacheCodecImpl` (rust/lance-core/src/cache/codec.rs:220-220), `ArcAny` (rust/lance-core/src/cache/codec.rs:280-280), `CacheCodec` (rust/lance-core/src/cache/codec.rs:299-299).

### `rust/lance-core/src/cache/mod.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `CacheKey` (rust/lance-core/src/cache/mod.rs:107-107), `UnsizedCacheKey` (rust/lance-core/src/cache/mod.rs:168-168), `LanceCache` (rust/lance-core/src/cache/mod.rs:268-268), `with_capacity` (rust/lance-core/src/cache/mod.rs:306-306), `with_backend` (rust/lance-core/src/cache/mod.rs:311-311), `no_cache` (rust/lance-core/src/cache/mod.rs:318-318), `with_key_prefix` (rust/lance-core/src/cache/mod.rs:327-327), `size` (rust/lance-core/src/cache/mod.rs:334-334).

### `rust/lance-core/src/cache/moka.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `key_footprint` (rust/lance-core/src/cache/moka.rs:26-26), `MokaCacheBackend` (rust/lance-core/src/cache/moka.rs:53-53), `with_capacity` (rust/lance-core/src/cache/moka.rs:68-68), `no_cache` (rust/lance-core/src/cache/moka.rs:84-84), `capacity` (rust/lance-core/src/cache/moka.rs:93-93), `build_moka_backend` (rust/lance-core/src/cache/moka.rs:338-338), `build_moka` (rust/lance-core/src/cache/moka.rs:374-374).

### `rust/lance-core/src/cache/priority.rs`

Strict priority and recency admission under a shared cache byte budget.

Key declarations: `PriorityEntries` (rust/lance-core/src/cache/priority.rs:9-9), `is_empty` (rust/lance-core/src/cache/priority.rs:28-28), `len` (rust/lance-core/src/cache/priority.rs:32-32), `bytes` (rust/lance-core/src/cache/priority.rs:35-35), `get` (rust/lance-core/src/cache/priority.rs:38-38), `peek` (rust/lance-core/src/cache/priority.rs:47-47), `contains` (rust/lance-core/src/cache/priority.rs:52-52), `remove` (rust/lance-core/src/cache/priority.rs:55-55).

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-core/src/cache/priority.rs` | 1-117 | mapped |

### `rust/lance-core/src/cache/quick.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `QuickCacheBackend` (rust/lance-core/src/cache/quick.rs:38-38), `QuickCacheShardPolicy` (rust/lance-core/src/cache/quick.rs:48-48), `recommended_cache_shards` (rust/lance-core/src/cache/quick.rs:75-75), `with_capacity` (rust/lance-core/src/cache/quick.rs:103-103), `with_shard_policy` (rust/lance-core/src/cache/quick.rs:124-124).

### `rust/lance-core/src/datatypes/field.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `NullabilityComparison` (rust/lance-core/src/datatypes/field.rs:73-73), `SchemaCompareOptions` (rust/lance-core/src/datatypes/field.rs:84-84), `BlobVersion` (rust/lance-core/src/datatypes/field.rs:107-107), `Encoding` (rust/lance-core/src/datatypes/field.rs:116-116), `OnTypeMismatch` (rust/lance-core/src/datatypes/field.rs:129-129), `Field` (rust/lance-core/src/datatypes/field.rs:137-137), `new_arrow` (rust/lance-core/src/datatypes/field.rs:166-166), `data_type` (rust/lance-core/src/datatypes/field.rs:171-171).

### `rust/lance-core/src/datatypes/schema.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `Schema` (rust/lance-core/src/datatypes/schema.rs:30-30), `FieldRef` (rust/lance-core/src/datatypes/schema.rs:39-39), `into_id` (rust/lance-core/src/datatypes/schema.rs:48-48), `validate_fixed_size_list_dimensions` (rust/lance-core/src/datatypes/schema.rs:128-128), `unenforced_primary_key` (rust/lance-core/src/datatypes/schema.rs:146-146), `unenforced_clustering_key` (rust/lance-core/src/datatypes/schema.rs:167-167), `compare_with_options` (rust/lance-core/src/datatypes/schema.rs:178-178), `explain_difference` (rust/lance-core/src/datatypes/schema.rs:183-183).

