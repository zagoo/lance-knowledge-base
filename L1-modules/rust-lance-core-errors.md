> **V2.1 navigation and contract layer.** Source reading is permitted. Production contracts retained from iteration 85 remain valid at the recorded snapshot. Historical line-count/test-coverage statements are provenance, not completeness requirements. Use [V2.1 protocol](../V21-PROTOCOL.md) and CORE-MANIFEST.json for current scope.

# lance-core error surface

This supplement covers the explicit source-defined error API and its conversions. Snafu-derived selector visibility is recorded, but macro-expanded generic selector declarations and downstream binding mappings remain incomplete. Full source and contiguous behavior annotations are preserved in [error.rs](../L2-files/rust/lance-core/src/error.rs.md). (rust/lance-core/src/error.rs:157-425)

[Core module](rust-lance-core.md) · [Symbol index](../L3-symbols/symbol-index.md) · [Runtime contracts](../L3-symbols/behavior-contracts.md) · [Pitfalls](../L4-crosscutting/pitfalls.md)

## Types and diagnostic payloads

`Error` is a public exhaustive enum with 37 variants, deriving Debug/Snafu and requesting public Snafu selectors. `Result<T>` aliases std::result::Result<T,Error>; `ArrowResult<T>` uses ArrowError; `DataFusionResult<T>` exists only with datafusion. The source-private alias `BoxedError` expands to `Box<dyn std::error::Error + Send + Sync + 'static>` throughout public signatures. (rust/lance-core/src/error.rs:9-9; rust/lance-core/src/error.rs:157-425; rust/lance-core/src/error.rs:838-841)

The exact variant field declarations appear in the API catalog below. Most carry implicit Snafu Location and MaybeBacktrace, while Timeout/DiskCapExceeded/Fenced/Backpressure carry only Location and several others carry neither. Twenty-four variants have a trace field. With backtrace disabled, MaybeBacktrace is zero-sized and Error::backtrace always returns None; with it enabled the method matches every variant explicitly and returns only its own trace. Capture generation is delegated to Snafu's Option<Backtrace>; local docs name RUST_BACKTRACE=1. (rust/lance-core/src/error.rs:11-55; rust/lance-core/src/error.rs:427-486)

`FieldNotFoundError { pub field_name:String, pub candidates:Vec<String> }` computes suggestions only during Display. Search considers every candidate while output lists only the first ten plus a remaining count. The underlying algorithm counts Unicode scalar values, uses maximum distance floor(input_length/3), and retains the earliest equal-distance candidate. Empty input has no suggestion; length1/2 input can match exactly. (rust/lance-core/src/error.rs:57-92; rust/lance-core/src/levenshtein.rs:17-89)

`CommitStatusUnknownError` exposes version() and a typed source but keeps fields private. Error::commit_status_unknown_source puts it directly inside Wrapped, preserving the exhaustive enum. Its message instructs checking table state before retrying because the commit may already have applied. This module emits no automatic retry or storage query. (rust/lance-core/src/error.rs:94-127; rust/lance-core/src/error.rs:748-761)

`FenceReason` is a copyable/hashable enum distinguishing peer epoch takeover from own persistence failure. Fenced preserves the legacy Writer fenced message prefix, but the supported typed discriminator is fence_reason(). Backpressure means the write was rejected before acceptance according to the contract; it is distinct from a terminal fence. Call-site enforcement remains pending. (rust/lance-core/src/error.rs:135-155; rust/lance-core/src/error.rs:402-424; rust/lance-core/src/error.rs:520-565)

## Typed accessors and traversal

| Accessor | Positive cases | Negative/boundary cases | Evidence |
|---|---|---|---|
| fence_reason | Direct Fenced returns copied FenceReason | Every wrapper/other variant returns None | rust/lance-core/src/error.rs:541-548 |
| is_backpressure | Direct Backpressure | No source traversal | rust/lance-core/src/error.rs:560-565 |
| is_commit_status_unknown | Direct Wrapped whose immediate source is CommitStatusUnknownError | Nested generic wrappers are not recursively classified | rust/lance-core/src/error.rs:753-761 |
| is_not_found | Direct NotFound; selected IO/Wrapped typed source chains | Explicit unknown-commit veto; DatasetNotFound/External/IndexNotFound and std IO kind alone are not positive | rust/lance-core/src/error.rs:601-615; rust/lance-core/src/error.rs:813-821 |
| external_source | Direct External, borrowing its boxed source | No recursive traversal | rust/lance-core/src/error.rs:792-800 |
| into_external | Direct External yields owned source | Err(self) preserves ownership for other categories | rust/lance-core/src/error.rs:802-810 |

The private not-found walker delegates back to Lance Error predicates, recognizes object_store::Error::NotFound, and recursively follows other Error::source links. Encountering a Lance error whose predicate is false ends that branch rather than unconditionally walking its source. There is no cycle/depth guard. (rust/lance-core/src/error.rs:813-822)

## Conversion matrix

| Conversion | Result and retained information | Evidence |
|---|---|---|
| Owned Arrow ExternalError | Recover boxed Lance Error by downcast; otherwise External retains original box | rust/lance-core/src/error.rs:843-856 |
| Other owned Arrow / any borrowed Arrow | Arrow(message); concrete source identity is lost | rust/lance-core/src/error.rs:854-864 |
| std IO containing immediate Lance Error | Recover exact original variant and payload | rust/lance-core/src/error.rs:866-881 |
| Other std IO | IO with original boxed std error; NotFound kind is not promoted | rust/lance-core/src/error.rs:866-881 |
| object_store NotFound | NotFound(uri=path); original source discarded | rust/lance-core/src/error.rs:884-892 |
| Other object_store, prost encode/decode/unknown enum, Tokio JoinError, path error, URL parse | IO with original boxed source | rust/lance-core/src/error.rs:884-935 |
| serde_json error | Arrow string; original type discarded | rust/lance-core/src/error.rs:937-942 |
| Lance to Arrow | External passes box; Schema becomes SchemaError(message); all others ExternalError(Box<Lance Error>) | rust/lance-core/src/error.rs:944-955 |
| Direct SQL parser/tokenizer error | IO boxed source, datafusion feature only | rust/lance-core/src/error.rs:957-971 |
| Lance to DataFusion | External(Box<Lance Error>), feature only | rust/lance-core/src/error.rs:973-979 |
| DataFusion Diagnostic/Context | Discard wrapper, recursively classify inner | rust/lance-core/src/error.rs:981-994 |
| DataFusion Collection | First error only; empty becomes Execution with fixed message | rust/lance-core/src/error.rs:994-1001 |
| DataFusion SQL/Plan/Configuration/SchemaError | InvalidInput retaining corresponding DataFusion source | rust/lance-core/src/error.rs:1002-1007 |
| DataFusion ArrowError/NotImplemented/Execution | Delegate owned Arrow / boxed NotSupported / string Execution respectively | rust/lance-core/src/error.rs:1008-1012 |
| DataFusion Shared | Unique Arc unwraps recursively; multiple owners retained behind External(Shared) | rust/lance-core/src/error.rs:1013-1028 |
| DataFusion External | Recover boxed Lance Error or preserve another External source | rust/lance-core/src/error.rs:1029-1035 |
| Remaining DataFusion | IO boxed source | rust/lance-core/src/error.rs:1036-1039 |
| Lance to object_store | Generic with store N/A and boxed original | rust/lance-core/src/error.rs:1041-1051 |

These mappings are not uniformly lossless. In particular Schema -> Arrow SchemaError -> Lance Arrow changes category, borrowed Arrow conversion loses type, and multi-owner DataFusion Shared retains discoverability rather than the same immediate category. Do not infer a general typed-accessor guarantee from a preserved source chain. (rust/lance-core/src/error.rs:843-864; rust/lance-core/src/error.rs:944-955; rust/lance-core/src/error.rs:1013-1028)

## Clone and optional-value behavior

`CloneableError(pub Error)` implements selective cloning: unknown commit retains version/category with message-only source; not-found semantics are reconstructed through DisplayError source chains; Timeout/IO/Fenced/Backpressure retain categories, with Fenced retaining reason. All other variants become Cloned(display text), including External. New constructors recapture implicit diagnostic data rather than copying original Location/backtrace. (rust/lance-core/src/error.rs:1058-1138)

`CloneableResult<T:Clone>(pub std::result::Result<T,CloneableError>)` derives Clone and converts from Lance Result by wrapping only Err. `LanceOptionExt<T>::expect_ok(self)->Result<T>` preserves Some and returns Internal with fixed text for None. These utilities perform no IO, retries or async scheduling. (rust/lance-core/src/error.rs:824-839; rust/lance-core/src/error.rs:1140-1147)

Source tests cover typed fences/backpressure/unknown outcome and not-found clones, selected caller locations, typed std IO/Arrow/DataFusion round trips, shared error discoverability and feature-dependent backtrace access. No tests were run. The capture test's enabled predicate checks merely that RUST_BACKTRACE is readable, although its comment says value1; the discrepancy remains recorded, not silently corrected in source. (rust/lance-core/src/error.rs:1155-1748)

## Explicit API catalog

The table below is generated only from reviewed source ranges. It contains literal declarations, so opening braces may denote omitted bodies; full bodies, attributes and tests are in L2. Trait implementations use qualified owner names in the symbol catalog. cfg-specific alternatives are separate records, not simultaneous overloads. Snafu-generated selectors still require macro-expansion analysis before claiming a complete generated public ABI. (rust/lance-core/src/error.rs:11-53; rust/lance-core/src/error.rs:157-425)

<!-- API_CATALOG -->

| Kind | Exact source declaration | Evidence |
|---|---|---|
| conversion | `fn from(value: Error) -> Self {` | rust/lance-core/src/error.rs:945-945 |
| conversion | `fn from(e: Error) -> Self {` | rust/lance-core/src/error.rs:976-976 |
| method | `fn clone(&self) -> Self {` | rust/lance-core/src/error.rs:1098-1098 |
| method | `fn from(result: Result<T>) -> Self {` | rust/lance-core/src/error.rs:1144-1144 |
| method | `fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {` | rust/lance-core/src/error.rs:124-124 |
| method | `fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {` | rust/lance-core/src/error.rs:113-113 |
| conversion | `fn from(e: &ArrowError) -> Self {` | rust/lance-core/src/error.rs:861-861 |
| conversion | `fn from(e: ArrowError) -> Self {` | rust/lance-core/src/error.rs:845-845 |
| conversion | `fn from(e: datafusion_common::DataFusionError) -> Self {` | rust/lance-core/src/error.rs:984-984 |
| conversion | `fn from(e: datafusion_sql::sqlparser::parser::ParserError) -> Self {` | rust/lance-core/src/error.rs:960-960 |
| conversion | `fn from(e: datafusion_sql::sqlparser::tokenizer::TokenizerError) -> Self {` | rust/lance-core/src/error.rs:968-968 |
| conversion | `fn from(e: object_store::Error) -> Self {` | rust/lance-core/src/error.rs:886-886 |
| conversion | `fn from(e: object_store::path::Error) -> Self {` | rust/lance-core/src/error.rs:925-925 |
| conversion | `fn from(e: prost::DecodeError) -> Self {` | rust/lance-core/src/error.rs:897-897 |
| conversion | `fn from(e: prost::EncodeError) -> Self {` | rust/lance-core/src/error.rs:904-904 |
| conversion | `fn from(e: prost::UnknownEnumValue) -> Self {` | rust/lance-core/src/error.rs:911-911 |
| conversion | `fn from(e: serde_json::Error) -> Self {` | rust/lance-core/src/error.rs:939-939 |
| conversion | `fn from(e: std::io::Error) -> Self {` | rust/lance-core/src/error.rs:868-868 |
| conversion | `fn from(e: tokio::task::JoinError) -> Self {` | rust/lance-core/src/error.rs:918-918 |
| conversion | `fn from(e: url::ParseError) -> Self {` | rust/lance-core/src/error.rs:932-932 |
| method | `fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {` | rust/lance-core/src/error.rs:147-147 |
| method | `fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {` | rust/lance-core/src/error.rs:68-68 |
| conversion | `fn from(err: Error) -> Self {` | rust/lance-core/src/error.rs:1045-1045 |
| method | `fn expect_ok(self) -> Result<T> {` | rust/lance-core/src/error.rs:833-833 |
| type alias | `pub type ArrowResult<T> = std::result::Result<T, ArrowError>;` | rust/lance-core/src/error.rs:839-839 |
| function | `pub fn box_error(e: impl std::error::Error + Send + Sync + 'static) -> BoxedError {` | rust/lance-core/src/error.rs:131-131 |
| struct | `pub struct CloneableError(pub Error);` | rust/lance-core/src/error.rs:1074-1074 |
| struct | `pub struct CloneableResult<T: Clone>(pub std::result::Result<T, CloneableError>);` | rust/lance-core/src/error.rs:1141-1141 |
| struct | `pub struct CommitStatusUnknownError {` | rust/lance-core/src/error.rs:100-100 |
| method | `pub fn version(&self) -> u64 {` | rust/lance-core/src/error.rs:107-107 |
| type alias | `pub type DataFusionResult<T> = std::result::Result<T, datafusion_common::DataFusionError>;` | rust/lance-core/src/error.rs:841-841 |
| enum | `pub enum Error {` | rust/lance-core/src/error.rs:159-159 |
| method | `pub fn arrow(message: impl Into<String>) -> Self {` | rust/lance-core/src/error.rs:667-667 |
| variant | `Arrow {         message: String,         #[snafu(implicit)]         location: Location,         #[snafu(implicit)]         backtrace: MaybeBacktrace,     },` | rust/lance-core/src/error.rs:277-283 |
| method | `pub fn backpressure(message: impl Into<String>) -> Self {` | rust/lance-core/src/error.rs:553-553 |
| variant | `Backpressure {         message: String,         #[snafu(implicit)]         location: Location,     },` | rust/lance-core/src/error.rs:420-424 |
| method | `pub fn backtrace(&self) -> Option<&std::backtrace::Backtrace> {` | rust/lance-core/src/error.rs:433-433 |
| method | `pub fn backtrace(&self) -> Option<&std::backtrace::Backtrace> {` | rust/lance-core/src/error.rs:484-484 |
| variant | `Cleanup { message: String },` | rust/lance-core/src/error.rs:360-360 |
| method | `pub fn cloned(message: impl Into<String>) -> Self {` | rust/lance-core/src/error.rs:683-683 |
| variant | `Cloned {         message: String,         #[snafu(implicit)]         location: Location,         #[snafu(implicit)]         backtrace: MaybeBacktrace,     },` | rust/lance-core/src/error.rs:338-344 |
| method | `pub fn commit_conflict_source(version: u64, source: BoxedError) -> Self {` | rust/lance-core/src/error.rs:739-739 |
| method | `pub fn commit_status_unknown_source(version: u64, source: BoxedError) -> Self {` | rust/lance-core/src/error.rs:749-749 |
| variant | `CommitConflict {         version: u64,         source: BoxedError,         #[snafu(implicit)]         location: Location,         #[snafu(implicit)]         backtrace: MaybeBacktrace,     },` | rust/lance-core/src/error.rs:211-218 |
| method | `pub fn corrupt_file(path: object_store::path::Path, message: impl Into<String>) -> Self {` | rust/lance-core/src/error.rs:489-489 |
| method | `pub fn corrupt_file_named(name: &str, message: impl Into<String>) -> Self {` | rust/lance-core/src/error.rs:501-501 |
| variant | `CorruptFile {         path: object_store::path::Path,         source: BoxedError,         #[snafu(implicit)]         location: Location,         #[snafu(implicit)]         backtrace: MaybeBacktrace,     },` | rust/lance-core/src/error.rs:194-201 |
| method | `pub fn dataset_already_exists(uri: impl Into<String>) -> Self {` | rust/lance-core/src/error.rs:573-573 |
| method | `pub fn dataset_not_found(path: impl Into<String>, source: BoxedError) -> Self {` | rust/lance-core/src/error.rs:578-578 |
| variant | `DatasetAlreadyExists {         uri: String,         #[snafu(implicit)]         location: Location,         #[snafu(implicit)]         backtrace: MaybeBacktrace,     },` | rust/lance-core/src/error.rs:169-175 |
| variant | `DatasetNotFound {         path: String,         source: BoxedError,         #[snafu(implicit)]         location: Location,         #[snafu(implicit)]         backtrace: MaybeBacktrace,     },` | rust/lance-core/src/error.rs:185-192 |
| method | `pub fn disk_cap_exceeded(cap_bytes: u64, used_bytes: u64) -> Self {` | rust/lance-core/src/error.rs:769-769 |
| variant | `DiskCapExceeded {         cap_bytes: u64,         used_bytes: u64,         #[snafu(implicit)]         location: Location,     },` | rust/lance-core/src/error.rs:396-401 |
| method | `pub fn execution(message: impl Into<String>) -> Self {` | rust/lance-core/src/error.rs:675-675 |
| variant | `Execution {         message: String,         #[snafu(implicit)]         location: Location,         #[snafu(implicit)]         backtrace: MaybeBacktrace,     },` | rust/lance-core/src/error.rs:346-352 |
| method | `pub fn external(source: BoxedError) -> Self {` | rust/lance-core/src/error.rs:778-778 |
| variant | `External { source: BoxedError },` | rust/lance-core/src/error.rs:387-387 |
| method | `pub fn external_source(&self) -> Option<&BoxedError> {` | rust/lance-core/src/error.rs:795-795 |
| method | `pub fn fence_reason(&self) -> Option<FenceReason> {` | rust/lance-core/src/error.rs:543-543 |
| variant | `Fenced {         reason: FenceReason,         message: String,         #[snafu(implicit)]         location: Location,     },` | rust/lance-core/src/error.rs:406-411 |
| method | `pub fn fenced_by_peer(message: impl Into<String>) -> Self {` | rust/lance-core/src/error.rs:522-522 |
| method | `pub fn field_not_found(field_name: impl Into<String>, candidates: Vec<String>) -> Self {` | rust/lance-core/src/error.rs:783-783 |
| variant | `FieldNotFound { source: FieldNotFoundError },` | rust/lance-core/src/error.rs:391-391 |
| method | `pub fn incompatible_transaction_source(source: BoxedError) -> Self {` | rust/lance-core/src/error.rs:764-764 |
| variant | `IncompatibleTransaction {         source: BoxedError,         #[snafu(implicit)]         location: Location,         #[snafu(implicit)]         backtrace: MaybeBacktrace,     },` | rust/lance-core/src/error.rs:220-226 |
| method | `pub fn index(message: impl Into<String>) -> Self {` | rust/lance-core/src/error.rs:723-723 |
| variant | `Index {         message: String,         #[snafu(implicit)]         location: Location,         #[snafu(implicit)]         backtrace: MaybeBacktrace,     },` | rust/lance-core/src/error.rs:309-315 |
| method | `pub fn index_not_found(identity: impl Into<String>) -> Self {` | rust/lance-core/src/error.rs:731-731 |
| variant | `IndexNotFound {         identity: String,         #[snafu(implicit)]         location: Location,         #[snafu(implicit)]         backtrace: MaybeBacktrace,     },` | rust/lance-core/src/error.rs:317-323 |
| method | `pub fn internal(message: impl Into<String>) -> Self {` | rust/lance-core/src/error.rs:641-641 |
| variant | `Internal {         message: String,         #[snafu(implicit)]         location: Location,         #[snafu(implicit)]         backtrace: MaybeBacktrace,     },` | rust/lance-core/src/error.rs:253-259 |
| method | `pub fn into_external(self) -> std::result::Result<BoxedError, Self> {` | rust/lance-core/src/error.rs:805-805 |
| method | `pub fn invalid_input(message: impl Into<String>) -> Self {` | rust/lance-core/src/error.rs:506-506 |
| method | `pub fn invalid_input_source(source: BoxedError) -> Self {` | rust/lance-core/src/error.rs:511-511 |
| variant | `InvalidInput {         source: BoxedError,         #[snafu(implicit)]         location: Location,         #[snafu(implicit)]         backtrace: MaybeBacktrace,     },` | rust/lance-core/src/error.rs:161-167 |
| variant | `InvalidRef { message: String },` | rust/lance-core/src/error.rs:354-354 |
| variant | `InvalidTableLocation { message: String },` | rust/lance-core/src/error.rs:325-325 |
| method | `pub fn io(message: impl Into<String>) -> Self {` | rust/lance-core/src/error.rs:516-516 |
| variant | `IO {         source: BoxedError,         #[snafu(implicit)]         location: Location,         #[snafu(implicit)]         backtrace: MaybeBacktrace,     },` | rust/lance-core/src/error.rs:301-307 |
| method | `pub fn io_source(source: BoxedError) -> Self {` | rust/lance-core/src/error.rs:568-568 |
| method | `pub fn is_backpressure(&self) -> bool {` | rust/lance-core/src/error.rs:563-563 |
| method | `pub fn is_commit_status_unknown(&self) -> bool {` | rust/lance-core/src/error.rs:755-755 |
| method | `pub fn is_not_found(&self) -> bool {` | rust/lance-core/src/error.rs:602-602 |
| method | `pub fn namespace(message: impl Into<String>) -> Self {` | rust/lance-core/src/error.rs:657-657 |
| variant | `Namespace {         source: BoxedError,         #[snafu(implicit)]         location: Location,         #[snafu(implicit)]         backtrace: MaybeBacktrace,     },` | rust/lance-core/src/error.rs:374-380 |
| method | `pub fn namespace_source(source: Box<dyn std::error::Error + Send + Sync + 'static>) -> Self {` | rust/lance-core/src/error.rs:662-662 |
| method | `pub fn not_found(uri: impl Into<String>) -> Self {` | rust/lance-core/src/error.rs:597-597 |
| method | `pub fn not_supported(message: impl Into<String>) -> Self {` | rust/lance-core/src/error.rs:631-631 |
| method | `pub fn not_supported_source(source: BoxedError) -> Self {` | rust/lance-core/src/error.rs:636-636 |
| variant | `NotFound {         uri: String,         #[snafu(implicit)]         location: Location,         #[snafu(implicit)]         backtrace: MaybeBacktrace,     },` | rust/lance-core/src/error.rs:293-299 |
| variant | `NotSupported {         source: BoxedError,         #[snafu(implicit)]         location: Location,         #[snafu(implicit)]         backtrace: MaybeBacktrace,     },` | rust/lance-core/src/error.rs:203-209 |
| method | `pub fn prerequisite_failed(message: impl Into<String>) -> Self {` | rust/lance-core/src/error.rs:715-715 |
| variant | `PrerequisiteFailed {         message: String,         #[snafu(implicit)]         location: Location,         #[snafu(implicit)]         backtrace: MaybeBacktrace,     },` | rust/lance-core/src/error.rs:261-267 |
| variant | `RefConflict { message: String },` | rust/lance-core/src/error.rs:356-356 |
| variant | `RefNotFound { message: String },` | rust/lance-core/src/error.rs:358-358 |
| method | `pub fn retryable_commit_conflict_source(version: u64, source: BoxedError) -> Self {` | rust/lance-core/src/error.rs:744-744 |
| variant | `RetryableCommitConflict {         version: u64,         source: BoxedError,         #[snafu(implicit)]         location: Location,         #[snafu(implicit)]         backtrace: MaybeBacktrace,     },` | rust/lance-core/src/error.rs:228-235 |
| method | `pub fn schema(message: impl Into<String>) -> Self {` | rust/lance-core/src/error.rs:623-623 |
| variant | `Schema {         message: String,         #[snafu(implicit)]         location: Location,         #[snafu(implicit)]         backtrace: MaybeBacktrace,     },` | rust/lance-core/src/error.rs:285-291 |
| method | `pub fn schema_mismatch(difference: impl Into<String>) -> Self {` | rust/lance-core/src/error.rs:691-691 |
| variant | `SchemaMismatch {         difference: String,         #[snafu(implicit)]         location: Location,         #[snafu(implicit)]         backtrace: MaybeBacktrace,     },` | rust/lance-core/src/error.rs:177-183 |
| variant | `Stop,` | rust/lance-core/src/error.rs:327-327 |
| method | `pub fn timeout(message: impl Into<String>) -> Self {` | rust/lance-core/src/error.rs:649-649 |
| variant | `Timeout {         message: String,         #[snafu(implicit)]         location: Location,     },` | rust/lance-core/src/error.rs:245-249 |
| method | `pub fn too_much_write_contention(message: impl Into<String>) -> Self {` | rust/lance-core/src/error.rs:707-707 |
| variant | `TooMuchWriteContention {         message: String,         #[snafu(implicit)]         location: Location,         #[snafu(implicit)]         backtrace: MaybeBacktrace,     },` | rust/lance-core/src/error.rs:237-243 |
| method | `pub fn unprocessable(message: impl Into<String>) -> Self {` | rust/lance-core/src/error.rs:699-699 |
| variant | `Unprocessable {         message: String,         #[snafu(implicit)]         location: Location,         #[snafu(implicit)]         backtrace: MaybeBacktrace,     },` | rust/lance-core/src/error.rs:269-275 |
| method | `pub fn version_conflict(         message: impl Into<String>,         major_version: u16,         minor_version: u16,     ) -> Self {` | rust/lance-core/src/error.rs:583-587 |
| variant | `VersionConflict {         message: String,         major_version: u16,         minor_version: u16,         #[snafu(implicit)]         location: Location,         #[snafu(implicit)]         backtrace: MaybeBacktrace,     },` | rust/lance-core/src/error.rs:364-372 |
| variant | `VersionNotFound { message: String },` | rust/lance-core/src/error.rs:362-362 |
| method | `pub fn wrapped(error: BoxedError) -> Self {` | rust/lance-core/src/error.rs:618-618 |
| variant | `Wrapped {         #[snafu(source)]         error: BoxedError,         #[snafu(implicit)]         location: Location,         #[snafu(implicit)]         backtrace: MaybeBacktrace,     },` | rust/lance-core/src/error.rs:329-336 |
| method | `pub fn writer_poisoned(message: impl Into<String>) -> Self {` | rust/lance-core/src/error.rs:533-533 |
| enum | `pub enum FenceReason {` | rust/lance-core/src/error.rs:138-138 |
| variant | `PeerClaimedEpoch,` | rust/lance-core/src/error.rs:140-140 |
| variant | `PersistenceFailure,` | rust/lance-core/src/error.rs:143-143 |
| struct | `pub struct FieldNotFoundError {` | rust/lance-core/src/error.rs:62-62 |
| function | `pub fn get_caller_location() -> &'static std::panic::Location<'static> {` | rust/lance-core/src/error.rs:1054-1054 |
| trait | `pub trait LanceOptionExt<T> {` | rust/lance-core/src/error.rs:824-824 |
| trait method | `fn expect_ok(self) -> Result<T>;` | rust/lance-core/src/error.rs:828-828 |
| type alias | `pub type Result<T> = std::result::Result<T, Error>;` | rust/lance-core/src/error.rs:838-838 |
