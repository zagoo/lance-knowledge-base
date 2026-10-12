# Object storage and I/O scheduling

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

**Trust: contract-verified I/O seams; providers/platform helpers mapped only.** Source snapshot `c3c8d6fb505fb437b2b673c5195e1d4b74436b2f`. [Entry](../README.md) · [Scope](../V21-PROTOCOL.md) · [Format](../L3-symbols/format-spec.md).

Wraps object storage with Lance reader/writer traits, URI/provider resolution, scheduling, streaming and spill support. Dataset commits use these primitives but own their own publication policy. Cloud SDK and operating-system implementations are external boundaries, not KB analysis targets.

## Module Map

<a id="rust-lance-io-src"></a>

### `rust/lance-io/src/`

Reader/Writer interfaces, object reader/writer, local and scheduled access, stream/spill and facade types. Select traits.rs for interface changes and scheduler.rs for request lifecycle.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-io/src/lib.rs` | 1-20, 23-303 | mapped |
| `rust/lance-io/src/local.rs` | 1-453 | mapped |
| `rust/lance-io/src/object_reader.rs` | 1-463 | mapped |
| `rust/lance-io/src/object_store.rs` | 1-65, 68-1976 | mapped |
| `rust/lance-io/src/object_writer.rs` | 1-857 | mapped |
| `rust/lance-io/src/scheduler.rs` | 1-1130, 1135-1378 | Key File (checked ranges) |
| `rust/lance-io/src/spill.rs` | 1-340 | mapped |
| `rust/lance-io/src/stream.rs` | 1-76 | mapped |
| `rust/lance-io/src/traits.rs` | 1-177 | Key File (checked ranges) |
| `rust/lance-io/src/uring.rs` | 1-61, 64-84 | mapped |
| `rust/lance-io/src/utils.rs` | 1-352 | mapped |
<a id="rust-lance-io-src-object-store"></a>

### `rust/lance-io/src/object_store/`

Registry/provider integration, dynamic credentials/storage options, tracing, metrics, retry/throttle and directory helpers. These adapt stores; manifest conflict policy is outside this layer.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-io/src/object_store/dynamic_credentials.rs` | 1-258 | mapped |
| `rust/lance-io/src/object_store/dynamic_opendal.rs` | 1-251 | mapped |
| `rust/lance-io/src/object_store/list_retry.rs` | 1-50, 72-155 | mapped |
| `rust/lance-io/src/object_store/metrics.rs` | 1-696, 817-821 | mapped |
| `rust/lance-io/src/object_store/opendal_store.rs` | 1-166 | mapped |
| `rust/lance-io/src/object_store/providers.rs` | 1-425 | mapped |
| `rust/lance-io/src/object_store/read_dir.rs` | 1-272 | mapped |
| `rust/lance-io/src/object_store/storage_options.rs` | 1-16, 19-686 | mapped |
| `rust/lance-io/src/object_store/throttle.rs` | 1-33, 36-1120 | mapped |
| `rust/lance-io/src/object_store/tracing.rs` | 1-162 | mapped |
<a id="rust-lance-io-src-object-store-providers"></a>

### `rust/lance-io/src/object_store/providers/`

Mapped-only storage-specific provider constructors. Select by registered URI scheme through ObjectStoreRegistry; do not duplicate scheme-specific code in Dataset callers.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-io/src/object_store/providers/aws.rs` | 1-5, 8-684 | mapped |
| `rust/lance-io/src/object_store/providers/azure.rs` | 1-381 | mapped |
| `rust/lance-io/src/object_store/providers/gcp.rs` | 1-401 | mapped |
| `rust/lance-io/src/object_store/providers/goosefs.rs` | 1-542 | mapped |
| `rust/lance-io/src/object_store/providers/huggingface.rs` | 1-256 | mapped |
| `rust/lance-io/src/object_store/providers/local.rs` | 1-176 | mapped |
| `rust/lance-io/src/object_store/providers/memory.rs` | 1-63 | mapped |
| `rust/lance-io/src/object_store/providers/oss.rs` | 1-153 | mapped |
| `rust/lance-io/src/object_store/providers/shared_memory.rs` | 1-73 | mapped |
| `rust/lance-io/src/object_store/providers/tencent.rs` | 1-109 | mapped |
| `rust/lance-io/src/object_store/providers/tos.rs` | 1-159 | mapped |
<a id="rust-lance-io-src-scheduler"></a>

### `rust/lance-io/src/scheduler/`

Lite scheduler implementation selected by SchedulerConfig/store preference. The standard scheduler remains in scheduler.rs; their admission/lifetime differences are M3 protocol concerns.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-io/src/scheduler/lite.rs` | 1-718 | mapped |
<a id="rust-lance-io-src-uring"></a>

### `rust/lance-io/src/uring/`

Mapped-only Linux io_uring integration and supporting workers/resources; platform-specific implementation requires source reading before changes.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-io/src/uring/current_thread.rs` | 1-430 | mapped |
| `rust/lance-io/src/uring/current_thread_future.rs` | 1-102 | mapped |
| `rust/lance-io/src/uring/future.rs` | 1-46 | mapped |
| `rust/lance-io/src/uring/reader.rs` | 1-320 | mapped |
| `rust/lance-io/src/uring/requests.rs` | 1-57 | mapped |
| `rust/lance-io/src/uring/thread.rs` | 1-520 | mapped |
<a id="rust-lance-io-src-utils"></a>

### `rust/lance-io/src/utils/`

Mapped-only I/O utility support including cached file-size metadata.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-io/src/utils/tracking_store.rs` | 1-603 | mapped |

## Key types and files

### Reader / Writer

`rust/lance-io/src/traits.rs` — read `24-43,136-177`.

Defines asynchronous range/stream reads and writer finalization.  
Reader promises object bytes; higher layers interpret formats.  
Default get_stream/get_range_stream materialize through get_all/get_range before wrapping a stream.  
Writer shutdown finalizes bytes and returns WriteResult, not a Dataset version.

[Selected contract record](../L2-files/rust/lance-io/src/traits.rs.md).

### ScanScheduler / FileScheduler / SchedulerConfig

`rust/lance-io/src/scheduler.rs` — read `795-859,889-930,1315-1352`.

Owns scheduled requests, buffer budget and shared I/O statistics.  
SchedulerConfig can force lite/standard behavior or defer to store preference.  
Response drop refunds the standard queue reservation, including undelivered cancelled responses.  
Indirect reads have an explicit bypass-backpressure handle to avoid dependency deadlock.

[Selected contract record](../L2-files/rust/lance-io/src/scheduler.rs.md).

## Contracts and extension boundaries

**Buffer policy.** io_buffer_size_bytes controls queued/unconsumed buffering. use_lite_scheduler Some(true/false) forces a choice; None uses the store preference. The environment is read when constructing config. (rust/lance-io/src/scheduler.rs:836-859; rust/lance-io/src/scheduler.rs:889-920)

**Cancellation accounting.** Standard Response::drop refunds its byte/request reservation; direct ScanScheduler users must retain the scheduler through outstanding I/O. (rust/lance-io/src/scheduler.rs:795-834)

**Indirect reads.** with_bypass_backpressure clones a FileScheduler with bypass enabled; it is intended for dependent reads after decoding offsets. It is not the default for arbitrary bulk scans. (rust/lance-io/src/scheduler.rs:1343-1352)

**Streams.** Default Reader stream methods first obtain complete Bytes via get_all or get_range. A stream-shaped return type alone does not guarantee bounded-memory streaming. (rust/lance-io/src/traits.rs:153-175)

M3 supplies the complete API-family/protocol decision tables and recipe navigation. This Module Map establishes ownership and the checked seams; it does not claim runtime qualification.


## V2.1 protocol route

Use the [canonical protocol](../L3-symbols/protocol-io.md) for decision rules and ordered implementation read sets. Module/file catalogs remain navigation evidence rather than additional analysis obligations.


## Public API route

[Public API family contracts and declaration directories](../L3-symbols/public-api.md) distinguish source-declared interfaces from checked implementation behavior and provide binding-to-engine read sets.

## Source refresh map — 2026-10-11

Current source `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`. [Changed contracts](../L3-symbols/refresh-2026-10-11.md). Existing directory responsibilities remain; declarations below locate changed boundaries.

### `rust/lance-io/src/object_store.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `ObjectStoreExt` (rust/lance-io/src/object_store.rs:156-156), `LocalDirOperations` (rust/lance-io/src/object_store.rs:171-171), `ObjectStore` (rust/lance-io/src/object_store.rs:203-203), `WrappingObjectStore` (rust/lance-io/src/object_store.rs:269-269), `ChainedWrappingObjectStore` (rust/lance-io/src/object_store.rs:306-306), `new` (rust/lance-io/src/object_store.rs:311-311), `add_wrapper` (rust/lance-io/src/object_store.rs:315-315), `ObjectStoreParams` (rust/lance-io/src/object_store.rs:343-343).

### `rust/lance-io/src/object_store/providers/aws.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `AwsStoreProvider` (rust/lance-io/src/object_store/providers/aws.rs:44-44), `AwsProviderScheme` (rust/lance-io/src/object_store/providers/aws.rs:331-331), `build_aws_credential` (rust/lance-io/src/object_store/providers/aws.rs:364-364), `AwsCredentialAdapter` (rust/lance-io/src/object_store/providers/aws.rs:489-489), `new` (rust/lance-io/src/object_store/providers/aws.rs:503-503), `with_env_s3` (rust/lance-io/src/object_store/providers/aws.rs:619-619), `as_s3_options` (rust/lance-io/src/object_store/providers/aws.rs:644-644), `aws_provider_scheme` (rust/lance-io/src/object_store/providers/aws.rs:649-649).

### `rust/lance-io/src/object_store/providers/azure.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `AzureBlobStoreProvider` (rust/lance-io/src/object_store/providers/azure.rs:32-32), `with_env_azure` (rust/lance-io/src/object_store/providers/azure.rs:340-340), `as_azure_options` (rust/lance-io/src/object_store/providers/azure.rs:366-366).

### `rust/lance-io/src/object_store/providers/gcp.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `GcsStoreProvider` (rust/lance-io/src/object_store/providers/gcp.rs:33-33), `with_env_gcs` (rust/lance-io/src/object_store/providers/gcp.rs:361-361), `as_gcs_options` (rust/lance-io/src/object_store/providers/gcp.rs:397-397).

