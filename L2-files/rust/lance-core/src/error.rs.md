> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md).

# rust/lance-core/src/error.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `db149483d5fec5c6b8bc598ef19c86640d52a818c50389eaf6c0817c9d4772f2`. Reviewed physical lines: 1-1748.

[Module](../../../../L1-modules/rust-lance-core.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Central public error enum, source-preserving constructors/conversions, typed writer and commit signals, feature-gated backtrace support, cloneable degradation rules, Result aliases, and regression tests. This module classifies errors but does not itself implement transactions, retries, storage IO or writer state transitions. (rust/lance-core/src/error.rs:1-1748)

## Complete range analysis

### Lines 1-10

SPDX, fmt, ArrowError, and Snafu imports. Private alias BoxedError=Box<dyn std::error::Error+Send+Sync+'static> is used in public signatures; its expanded trait-object type is the contract even though the alias name is not public. IntoError is imported anonymously for generated-selector methods. (rust/lance-core/src/error.rs:1-10)

### Lines 11-32

With feature backtrace, private module backtrace_support defines pub-in-private-module MaybeBacktrace(pub Option<std::backtrace::Backtrace>) with Debug. GenerateImplicitData::generate delegates to Snafu's Option<Backtrace> generation; AsBacktrace borrows the optional trace. Actual environment gating is delegated to dependencies, not an env read implemented here. (rust/lance-core/src/error.rs:11-32)

### Lines 33-56

Without feature backtrace, the same module/type name is a zero-sized unit struct. Generation returns Self and AsBacktrace always None. The selected type is privately imported. This establishes no-backtrace storage for that field, not a zero-size Error enum or a measured overhead guarantee. (rust/lance-core/src/error.rs:33-56)

### Lines 57-92

Public FieldNotFoundError has public field_name:String and candidates:Vec<String>, deriving Debug and implementing Display/Error. Formatting prints the missing name, calls levenshtein::find_best_suggestion lazily, optionally prints Did you mean, then the first ten candidates in original order and an exact remaining count if longer. It still passes the entire candidate list to suggestion search; ten is a display limit, not a search limit. Empty candidates print empty brackets. Formatting errors propagate via ?. No escaping of names is added. The Error impl has no custom source. (rust/lance-core/src/error.rs:57-92)

### Lines 93-128

Public CommitStatusUnknownError derives Debug but its version:u64 and source:BoxedError fields are private. Public version(&self)->u64 reads the version. Display explicitly says commit may or may not have applied and table state must be checked before retrying; source() returns the original boxed source. The comment explains wrapping inside existing Error::Wrapped avoids adding a variant to the exhaustive public Error enum. This type signals uncertain outcome, not definite conflict or missing object. (rust/lance-core/src/error.rs:93-128)

### Lines 129-155

Public inline box_error(e:impl Error+Send+Sync+'static)->BoxedError allocates the concrete error. Public FenceReason derives Debug/Clone/Copy/PartialEq/Eq/Hash with PeerClaimedEpoch and PersistenceFailure; both are documented terminal writer fences, distinguishing takeover from own WAL failure/replay requirement. Display uses stable strings peer claimed epoch and persistence failure. No retry or reopening is performed here. (rust/lance-core/src/error.rs:129-155)

### Lines 156-183

Public exhaustive Error derives Debug/Snafu and requests pub selector visibility. InvalidInput stores source:BoxedError; DatasetAlreadyExists stores uri:String; SchemaMismatch stores difference:String. Each includes implicit Location and MaybeBacktrace. Their Snafu Display attributes respectively identify invalid user input, existing dataset and append schema difference. Exact format strings and generated-selector source annotations are preserved in evidence; macro-expanded generic APIs are not independently expanded here. (rust/lance-core/src/error.rs:156-183)

### Lines 184-209

DatasetNotFound stores path:String plus boxed source; CorruptFile stores object_store::path::Path plus boxed source; NotSupported stores boxed source. Each has implicit location/backtrace and contextual Display text. DatasetNotFound is a distinct variant from NotFound and is not recognized by is_not_found below; variant names alone must not substitute for accessor behavior (rust/lance-core/src/error.rs:601-615). (rust/lance-core/src/error.rs:184-209)

### Lines 210-243

CommitConflict and RetryableCommitConflict each carry version:u64, boxed source, implicit location/backtrace; IncompatibleTransaction has boxed source and implicit location/backtrace without version. TooMuchWriteContention carries message:String with implicit location/backtrace. Their names and display labels distinguish conflict categories; no automatic retry policy or conflict matrix is implemented in these declarations. (rust/lance-core/src/error.rs:210-243)

### Lines 244-275

Timeout carries message:String and implicit Location without backtrace. Internal carries message/location/backtrace and its Display requests a bug report at the literal URL. PrerequisiteFailed and Unprocessable likewise carry message/location/backtrace. URLs are retained source text, not accessed. Location and trace presence vary by variant; do not assume every diagnostic captures both. (rust/lance-core/src/error.rs:244-275)

### Lines 276-307

Arrow and Schema variants carry message:String plus implicit location/backtrace; NotFound carries uri:String plus implicit location/backtrace; IO stores boxed source plus implicit location/backtrace. Arrow here is a Lance enum category, not the original ArrowError type. IO preserves an inspectable source unless constructed from only a string. (rust/lance-core/src/error.rs:276-307)

### Lines 308-336

Index stores message:String/location/backtrace; IndexNotFound identity:String/location/backtrace; InvalidTableLocation only message:String. Stop is a fieldless early-stop signal. Wrapped stores error:BoxedError explicitly marked snafu(source), plus implicit location/backtrace. Wrapped does not itself guarantee a particular classification; typed accessors inspect selected sources. (rust/lance-core/src/error.rs:308-336)

### Lines 337-372

Cloned and Execution store message:String/location/backtrace. InvalidRef, RefConflict, RefNotFound, Cleanup and VersionNotFound contain only message:String. VersionConflict adds major_version:u16, minor_version:u16, implicit location/backtrace to message; its Display renders only the message and does not interpolate those numeric version fields. Exact field retention and human text are different contracts. (rust/lance-core/src/error.rs:337-372)

### Lines 373-401

Namespace holds boxed source/location/backtrace. Transparent External holds only boxed source and is intended to preserve user error downcasts. Transparent FieldNotFound holds FieldNotFoundError. DiskCapExceeded carries cap_bytes:u64, used_bytes:u64 and Location, without backtrace, and prints cap/usage. Constructors do not validate that used_bytes actually exceeds cap; tests below intentionally use cap100/used50. The unvalidated constructor and cap100/used50 recovery fixture are at rust/lance-core/src/error.rs:768-775 and rust/lance-core/src/error.rs:1311-1327. (rust/lance-core/src/error.rs:373-401)

### Lines 402-426

Fenced stores FenceReason, message:String and implicit Location; Display retains Writer fenced prefix for legacy text consumers, while new callers should use fence_reason(). Backpressure has message/Location; documentation states write was never accepted and can be retried after pipeline drain, suggesting HTTP503. These are declared semantics that writer call sites must uphold; the error type does not enforce no-data-loss or an HTTP mapping itself. (rust/lance-core/src/error.rs:402-426)

### Lines 427-478

With backtrace feature, public backtrace(&self)->Option<&Backtrace> exhaustively matches all 24 backtrace-carrying variants and delegates to AsBacktrace. Thirteen non-trace variants (InvalidTableLocation, Stop, five message-only ref/cleanup/version variants, External, FieldNotFound, Timeout, DiskCapExceeded, Fenced, Backpressure) explicitly return None, making future enum additions require match maintenance. The docs require compile feature and RUST_BACKTRACE=1; actual generation remains Snafu-dependent. Count and exact variants are retained in the enum/index; no wildcard suppresses new-variant review. (rust/lance-core/src/error.rs:427-478)

### Lines 479-503

Without backtrace feature the same public backtrace signature always returns None. track_caller corrupt_file(path:Path,message:impl Into<String>)->Self uses CorruptFileSnafu with a boxed string error. corrupt_file_named(name:&str,message:impl Into<String>)->Self converts a logical/section name into Path then delegates; docs explicitly warn that this path field need not be a real filesystem location. (rust/lance-core/src/error.rs:479-503)

### Lines 504-519

track_caller invalid_input(message), invalid_input_source(BoxedError) and io(message) use generated selectors. Message forms convert Into<String> and then into a boxed error, so they preserve text but no original concrete source; the source form retains the supplied box. Location capture depends on track_caller and Snafu's implicit generation. (rust/lance-core/src/error.rs:504-519)

### Lines 520-549

track_caller fenced_by_peer(message)->Self and writer_poisoned(message)->Self build Fenced with the corresponding reason. fence_reason(&self)->Option<FenceReason> matches only a direct Fenced variant, returning copied reason or None; it does not recurse through Wrapped/IO/External sources. Thus wrapping a fence is not equivalent to preserving this accessor unless a conversion unwraps it first. (rust/lance-core/src/error.rs:520-549)

### Lines 550-570

track_caller backpressure(message)->Self builds Backpressure. is_backpressure(&self)->bool is a direct-variant match, not source-chain traversal. track_caller io_source(source:BoxedError)->Self retains the box through IOSnafu. Backpressure's no-acceptance meaning is documented in the constructor/type, not verified against writer implementations here. (rust/lance-core/src/error.rs:550-570)

### Lines 571-600

track_caller dataset_already_exists(uri), dataset_not_found(path,source), version_conflict(message,major_version:u16,minor_version:u16), and not_found(uri) construct their exact variants through selectors. Inputs are Into<String> where shown; no URI parsing, version validation or storage access occurs. version_conflict preserves both u16 fields even though Display uses only its message. (rust/lance-core/src/error.rs:571-600)

### Lines 601-620

is_not_found(&self)->bool returns true for direct NotFound; specifically returns false for Wrapped whose immediate boxed error is CommitStatusUnknownError; recursively inspects only IO.source and other Wrapped.error through error_source_is_not_found; every other variant returns false. This intentionally prevents uncertain commit visibility from being treated as definite absence. wrapped(BoxedError)->Self is track_caller and builds Wrapped without classifying its source. (rust/lance-core/src/error.rs:601-620)

### Lines 621-646

track_caller schema(message) builds Schema. not_supported(message) string-boxes its text; not_supported_source preserves the original source box. internal(message) builds Internal. These constructors allocate/convert diagnostic payloads and do not independently decide whether the underlying operation was user error, unsupported or internal. (rust/lance-core/src/error.rs:621-646)

### Lines 647-673

track_caller timeout(message) builds Timeout; namespace(message) string-boxes text; namespace_source explicitly accepts Box<dyn Error+Send+Sync+'static>; arrow(message) builds Arrow. Source-preserving versus string constructors are deliberate API alternatives; same display text does not imply downcast equivalence. (rust/lance-core/src/error.rs:647-673)

### Lines 674-704

track_caller execution(message), cloned(message), schema_mismatch(difference) and unprocessable(message) directly build matching message/difference variants. cloned is a constructor, not an implementation of Clone for Error. Error itself does not derive Clone. (rust/lance-core/src/error.rs:674-704)

### Lines 705-737

track_caller too_much_write_contention(message), prerequisite_failed(message), index(message), index_not_found(identity) each call matching Snafu selector build. There is no message parsing, automatic retry flag, or validation in these convenience methods. (rust/lance-core/src/error.rs:705-737)

### Lines 738-767

track_caller commit_conflict_source(version,source) and retryable_commit_conflict_source(version,source) retain typed source boxes. commit_status_unknown_source(version,source) constructs CommitStatusUnknownError, boxes it and delegates to wrapped. is_commit_status_unknown(&self)->bool checks only direct Wrapped whose immediate source downcasts to that type, not arbitrary nested chains. incompatible_transaction_source(source) builds its matching variant. All source parameters expand to boxed Send+Sync+'static error traits. (rust/lance-core/src/error.rs:738-767)

### Lines 768-791

track_caller disk_cap_exceeded(cap_bytes:u64,used_bytes:u64)->Self stores values without comparing them. external(source:BoxedError)->Self directly constructs transparent External and has no track_caller/location. field_not_found(field_name:impl Into<String>,candidates:Vec<String>)->Self moves owned candidate strings into FieldNotFoundError; suggestions are computed later at Display time. (rust/lance-core/src/error.rs:768-791)

### Lines 792-812

external_source(&self)->Option<&BoxedError> borrows the source only for direct External. into_external(self)->std::result::Result<BoxedError,Self> moves it out for External, otherwise returns Err(original self) unchanged. Neither traverses nested sources, and callers can chain handling without losing ownership on a mismatch. (rust/lance-core/src/error.rs:792-812)

### Lines 813-823

Private error_source_is_not_found(source:&(dyn std::error::Error+'static))->bool first downcasts Lance Error and delegates is_not_found, thereby respecting its deliberate negative cases; then object_store::Error matches NotFound or recursively inspects its source; all other errors recurse through source(). No std::io::ErrorKind::NotFound or message matching is performed. There is no visited-set/depth guard for pathological cyclic/custom source chains. (rust/lance-core/src/error.rs:813-823)

### Lines 824-842

Public LanceOptionExt<T>::expect_ok(self)->Result<T> is implemented for Option<T>; track_caller impl uses ok_or_else to create Internal with fixed Expected option to have value only on None, preserving Some payload. Public Result<T>=std::result::Result<T,Error> and ArrowResult<T>=std::result::Result<T,ArrowError> aliases exist unconditionally; DataFusionResult<T> is gated by datafusion. Alias declarations are fully qualified in evidence to avoid confusing different Result types. (rust/lance-core/src/error.rs:824-842)

### Lines 843-865

Owned From<ArrowError> recovers a boxed Lance Error directly from ExternalError when downcast succeeds; any other external concrete error becomes transparent External; all non-external Arrow errors become Arrow with to_string. Borrowed From<&ArrowError> always stringifies into Arrow, losing typed identity. Both conversion methods are track_caller. (rust/lance-core/src/error.rs:843-865)

### Lines 866-883

From<std::io::Error> checks its immediate get_ref for Lance Error; if so consumes into_inner and downcasts, preserving the exact variant. expect calls are justified by preceding presence/type check on the same owned error, not unchecked unsafe operations. Otherwise boxes the original std IO error into Lance IO. Plain IO NotFound kind is not promoted to Lance NotFound by this conversion. (rust/lance-core/src/error.rs:866-883)

### Lines 884-901

From<object_store::Error> converts direct NotFound path to Lance NotFound and intentionally drops its original source; every other store error is boxed as IO. From<prost::DecodeError> retains the decode error as boxed IO. Both track caller. Losing the source for direct store NotFound is an explicit exception to general preservation. (rust/lance-core/src/error.rs:884-901)

### Lines 902-936

track_caller From implementations for prost::EncodeError, prost::UnknownEnumValue, tokio::task::JoinError, object_store::path::Error and url::ParseError all box the original as IO. JoinError conversion here is categorization, unlike spawn_cpu's explicit resume_unwind behavior (rust/lance-core/src/utils/tokio.rs:194-208). No runtime panic is resumed by these From implementations. (rust/lance-core/src/error.rs:902-936)

### Lines 937-956

From<serde_json::Error> stringifies into Arrow, discarding the concrete JSON error type. From<Error> for ArrowError passes External source directly to Arrow ExternalError, maps Schema.message to Arrow SchemaError while dropping other fields, and wraps every other Lance Error intact in Arrow ExternalError. Therefore most owned Arrow round trips recover variants, but Schema -> Arrow SchemaError -> Lance Arrow is category-lossy (rust/lance-core/src/error.rs:843-855). (rust/lance-core/src/error.rs:937-956)

### Lines 957-980

Under datafusion feature, ParserError and TokenizerError convert to boxed IO, preserving source. From<Lance Error> for DataFusionError always wraps intact in External(Box<Error>). All three methods are track_caller. Direct parser/tokenizer conversions differ from DataFusionError::SQL categorization below. (rust/lance-core/src/error.rs:957-980)

### Lines 981-1007

DataFusionError -> Error is feature-gated and track_caller. Diagnostic and Context wrappers are consumed, their annotations/context discarded, and inner error recursively classified. Collection chooses only its first error and drops the rest; empty collection becomes Execution with a fixed message. SQL, Plan, Configuration and SchemaError become InvalidInput with the entire corresponding inner DataFusion error boxed. The source comments call wrappers display-transparent, but local conversion still discards wrapper-specific data. (rust/lance-core/src/error.rs:981-1007)

### Lines 1008-1028

DataFusion ArrowError consumes boxed Arrow error and ignores the companion context before delegating to Arrow conversion. NotImplemented preserves the DataFusion error as NotSupported source. Execution is stringified into Lance Execution. Shared attempts Arc::try_unwrap: sole owner recursively classifies the inner error; multiple owners reconstruct DataFusion Shared inside Lance External to retain an inspectable typed source chain instead of forcing a message-only clone. Direct category thus depends on shared ownership. (rust/lance-core/src/error.rs:1008-1028)

### Lines 1029-1052

DataFusion External tries downcast to Lance Error and recovers it unchanged, otherwise becomes External with original source. Every remaining DataFusion variant becomes boxed IO. From<Lance Error> for object_store::Error always wraps Generic {store:N/A,source:Box<Error>} to satisfy store-stream signatures; converting that Generic back normally adds Lance IO rather than directly recovering the original category, though is_not_found may traverse the chain (rust/lance-core/src/error.rs:813-821; rust/lance-core/src/error.rs:884-892). (rust/lance-core/src/error.rs:1029-1052)

### Lines 1053-1075

Public track_caller get_caller_location()->&'static std::panic::Location<'static> returns Location::caller(). Public CloneableError(pub Error) has documentation specifying selective category/accessor preservation while degrading non-cloneable sources to strings. It is not a general lossless error clone. External is deliberately not preserved because a fake reconstructed source would make external_source misleading. (rust/lance-core/src/error.rs:1053-1075)

### Lines 1076-1095

Private DisplayError(Error) implements Debug by delegating to its own Display, Display by formatting the inner Error, and Error::source as Some(&inner). It hides structural debug detail while retaining a typed source link, allowing cloned not-found diagnostics to remain recognizable through recursive detection. (rust/lance-core/src/error.rs:1076-1095)

### Lines 1096-1112

CloneableError::clone is track_caller. First, a direct Wrapped CommitStatusUnknownError is rebuilt with the same version and a source string obtained from the original immediate source (falling back to unknown's own display). That string becomes Error::Cloned inside DisplayError then is boxed into a new unknown-commit wrapper. The original concrete source type and original location/trace are not cloned; typed unknown outcome/version survive repeated clones. (rust/lance-core/src/error.rs:1096-1112)

### Lines 1113-1139

Clone dispatch then preserves NotFound URI via Wrapped(DisplayError(NotFound)); other errors whose is_not_found is true become analogous wrappers with original display text stored as URI. Timeout retains message/category; IO retains category but source becomes a string error; Fenced retains reason/message; Backpressure retains category/message. Everything else becomes Cloned(original.to_string()). Constructors generate new diagnostics rather than copying original Location/backtrace. Accessor preservation is explicit; arbitrary source identity is not. (rust/lance-core/src/error.rs:1113-1139)

### Lines 1140-1154

Public #[derive(Clone)] CloneableResult<T:Clone>(pub std::result::Result<T,CloneableError>) provides a cloneable success/error container. From<Lance Result<T>> maps Err into CloneableError without cloning yet and leaves Ok payload. Private test module imports parent symbols, std Error trait methods and fmt. There is no reverse conversion supplied here. (rust/lance-core/src/error.rs:1140-1154)

### Lines 1155-1192

cloneable_error_preserves_accessor_contracts tests both fence reasons, backpressure, and unknown commit version7 wrapped around Timeout. It checks direct and cloned accessor results, clones the clone and verifies unknown status persists and not-found remains false. The test does not assert every rebuilt source's exact concrete type or captured location. (rust/lance-core/src/error.rs:1155-1192)

### Lines 1193-1239

cloneable_error_preserves_not_found_contract checks direct NotFound then two clone generations, case-insensitive display/debug contains not found, and discoverable Lance Error in source chain. It wraps the clone through store Generic, IO and Wrapped and checks recognition remains. It also checks Timeout and IO categories survive cloning. It does not claim Error implements Clone directly. (rust/lance-core/src/error.rs:1193-1239)

### Lines 1240-1281

Caller-location tests record get_caller_location and use ? on store Generic/NotFound inside closures, then assert resulting IO/NotFound Location line equals the source error-construction line offset (+4/+2 respectively). A comment warns .into() does not capture the same location; this file's tests exercise ?, not every conversion-syntax variant. Panic fallback branches identify unexpected categories. (rust/lance-core/src/error.rs:1240-1281)

### Lines 1282-1310

test_object_store_not_found_converts_to_not_found checks path retained as URI. Private MyCustomError {code:i32,message:String} derives Debug, formats MyCustomError(code): message, and implements Error with no source; it is the typed marker for subsequent downcast tests. (rust/lance-core/src/error.rs:1282-1310)

### Lines 1311-1337

IO conversion tests wrap DiskCapExceeded(cap100,used50) in std::io::Error::other, require exact recovered numeric fields, and separately convert plain std IO NotFound kind to Lance IO. This asserts category preservation for a directly embedded Lance error, not validation of disk-cap arithmetic or generic NotFound-kind promotion. (rust/lance-core/src/error.rs:1311-1337)

### Lines 1338-1356

test_commit_status_unknown_is_structured_without_masking_as_not_found uses version42 with a NotFound source, asserts unknown true/not-found false and display contains version, then downcasts Wrapped source to CommitStatusUnknownError and checks version42. The test name/comment explain why an exhaustive-enum-compatible wrapper matters. (rust/lance-core/src/error.rs:1338-1356)

### Lines 1357-1391

test_external_error_creation retains custom code42/message; test_external_source_method borrows/downcasts code123 and checks IO.external_source() is None. These tests distinguish original source preservation from matching text. (rust/lance-core/src/error.rs:1357-1391)

### Lines 1392-1415

test_into_external_method consumes/downcasts custom code456 through Ok(source), and checks a non-External IO comes back unchanged as Err(Error::IO). No source-chain extraction is promised. (rust/lance-core/src/error.rs:1392-1415)

### Lines 1416-1451

Arrow external conversion test consumes Arrow ExternalError(custom code789) and checks Lance External downcast. The external-to-Arrow test checks custom code999 reaches Arrow ExternalError directly, with no extra Lance wrapper. It tests one direction by inspecting Arrow output rather than converting it all the way back. (rust/lance-core/src/error.rs:1416-1451)

### Lines 1452-1479

DataFusion-gated schema-error test constructs missing_col FieldNotFound with empty valid fields, converts it and asserts InvalidInput plus column name in text. Comments tie this classification to downstream FFI/Python mapping, but those bindings themselves remain unreviewed. (rust/lance-core/src/error.rs:1452-1479)

### Lines 1480-1520

DataFusion-gated rstest has four wrappers: Diagnostic, Context, one-element Collection and nested Diagnostic(Context). Each wraps Plan invalid function no_such_function and asserts InvalidInput plus retained function name. This covers recursive category recovery and useful inner message, not preservation of wrapper annotations or multi-error collections. (rust/lance-core/src/error.rs:1480-1520)

### Lines 1521-1559

Wrapped-internal test expects DataFusion Context(Internal) -> Lance IO, ensuring it is not misclassified as user input. Wrapped-external-Lance test sends Lance IO through DataFusion External and Context, then requires recovered IO source message. These pin fallback and downcast behavior separately. (rust/lance-core/src/error.rs:1521-1559)

### Lines 1560-1599

Two datafusion-gated tests preserve MyCustomError code111 from direct DataFusion External and code222 from DataFusion ArrowError(Arrow ExternalError). They assert concrete type recovery, not only text equality. (rust/lance-core/src/error.rs:1560-1599)

### Lines 1600-1648

Owned InvalidInput round trips through Arrow and, under feature gate, DataFusion are tested for same category and message. These examples support the recovery branch; they do not establish lossless Schema or borrowed Arrow conversion, which follow different branches. (rust/lance-core/src/error.rs:1600-1648)

### Lines 1649-1684

DataFusion Shared multi-owner test keeps a second Arc, converts shared custom code42, then walks Error::source until MyCustomError is found. It asserts discovery, not direct External source downcast or retained top-level category. No sole-owner Shared or empty/multi-element Collection-specific test appears here. (rust/lance-core/src/error.rs:1649-1684)

### Lines 1685-1703

test_backtrace_accessor creates IO and calls backtrace. With feature enabled it only checks the call can execute (binds/discards the Option); without feature it asserts None. The enabled branch does not require capture. (rust/lance-core/src/error.rs:1685-1703)

### Lines 1704-1732

test_backtrace_captured_when_feature_enabled comments require RUST_BACKTRACE=1 before process startup because capture checks may cache. Actual enabled assertion runs whenever std::env::var(RUST_BACKTRACE).is_ok(), not only when value equals 1, so comment and predicate differ for values such as 0 or empty. If unset it makes no capture assertion. Feature-disabled branch asserts None. No environment is changed by the test itself. (rust/lance-core/src/error.rs:1704-1732)

### Lines 1733-1748

Final test requires None for InvalidTableLocation, InvalidRef and Stop. Its name mentions variants without location, but the broader accessor also returns None for variants with Location but no trace field (Timeout, DiskCapExceeded, Fenced, Backpressure). All tests were read but not executed; no coverage or performance measurement is claimed. The complete no-trace branch is at rust/lance-core/src/error.rs:462-486. (rust/lance-core/src/error.rs:1733-1748)

## Interaction and interpretation limits

The public suggestion algorithm is analyzed at rust/lance-core/src/levenshtein.rs:17-89. Snafu macro expansion/implicit-data environment implementation, dependency error source semantics, full external conversion callers, Python/Java error mappings and writer/commit call sites remain pending. Source-error chain recursion has no cycle guard; typed accessors vary between direct-variant checks and selected recursive detection (rust/lance-core/src/error.rs:541-565; rust/lance-core/src/error.rs:601-615; rust/lance-core/src/error.rs:753-821). No unsafe block, async task or storage operation is implemented here.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::fmt;
    5 | 
    6 | use arrow_schema::ArrowError;
    7 | use snafu::{IntoError as _, Location, Snafu};
    8 | 
    9 | type BoxedError = Box<dyn std::error::Error + Send + Sync + 'static>;
   10 | 
   11 | #[cfg(feature = "backtrace")]
   12 | mod backtrace_support {
   13 |     use std::backtrace::Backtrace;
   14 | 
   15 |     use snafu::{AsBacktrace, GenerateImplicitData};
   16 | 
   17 |     #[derive(Debug)]
   18 |     pub struct MaybeBacktrace(pub Option<Backtrace>);
   19 | 
   20 |     impl GenerateImplicitData for MaybeBacktrace {
   21 |         fn generate() -> Self {
   22 |             Self(<Option<Backtrace>>::generate())
   23 |         }
   24 |     }
   25 | 
   26 |     impl AsBacktrace for MaybeBacktrace {
   27 |         fn as_backtrace(&self) -> Option<&Backtrace> {
   28 |             self.0.as_ref()
   29 |         }
   30 |     }
   31 | }
   32 | 
   33 | #[cfg(not(feature = "backtrace"))]
   34 | mod backtrace_support {
   35 |     use std::backtrace::Backtrace;
   36 | 
   37 |     use snafu::{AsBacktrace, GenerateImplicitData};
   38 | 
   39 |     #[derive(Debug)]
   40 |     pub struct MaybeBacktrace;
   41 | 
   42 |     impl GenerateImplicitData for MaybeBacktrace {
   43 |         fn generate() -> Self {
   44 |             Self
   45 |         }
   46 |     }
   47 | 
   48 |     impl AsBacktrace for MaybeBacktrace {
   49 |         fn as_backtrace(&self) -> Option<&Backtrace> {
   50 |             None
   51 |         }
   52 |     }
   53 | }
   54 | 
   55 | use backtrace_support::MaybeBacktrace;
   56 | 
   57 | /// Error for when a requested field is not found in a schema.
   58 | ///
   59 | /// This error computes suggestions lazily (only when displayed) to avoid
   60 | /// computing Levenshtein distance when the error is created but never shown.
   61 | #[derive(Debug)]
   62 | pub struct FieldNotFoundError {
   63 |     pub field_name: String,
   64 |     pub candidates: Vec<String>,
   65 | }
   66 | 
   67 | impl fmt::Display for FieldNotFoundError {
   68 |     fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
   69 |         write!(f, "Field '{}' not found.", self.field_name)?;
   70 |         let suggestion =
   71 |             crate::levenshtein::find_best_suggestion(&self.field_name, &self.candidates);
   72 |         if let Some(suggestion) = suggestion {
   73 |             write!(f, " Did you mean '{}'?", suggestion)?;
   74 |         }
   75 |         write!(f, "\nAvailable fields: [")?;
   76 |         for (i, candidate) in self.candidates.iter().take(10).enumerate() {
   77 |             if i > 0 {
   78 |                 write!(f, ", ")?;
   79 |             }
   80 |             write!(f, "'{}'", candidate)?;
   81 |         }
   82 |         if self.candidates.len() > 10 {
   83 |             let remaining = self.candidates.len() - 10;
   84 |             write!(f, ", ... and {} more]", remaining)?;
   85 |         } else {
   86 |             write!(f, "]")?;
   87 |         }
   88 |         Ok(())
   89 |     }
   90 | }
   91 | 
   92 | impl std::error::Error for FieldNotFoundError {}
   93 | 
   94 | /// A manifest commit returned an error and its final outcome could not be
   95 | /// determined safely.
   96 | ///
   97 | /// This is wrapped in [`Error::Wrapped`] so Lance can expose a structured
   98 | /// source without adding a variant to the exhaustive public [`Error`] enum.
   99 | #[derive(Debug)]
  100 | pub struct CommitStatusUnknownError {
  101 |     version: u64,
  102 |     source: BoxedError,
  103 | }
  104 | 
  105 | impl CommitStatusUnknownError {
  106 |     /// Return the manifest version whose commit outcome is unknown.
  107 |     pub fn version(&self) -> u64 {
  108 |         self.version
  109 |     }
  110 | }
  111 | 
  112 | impl std::fmt::Display for CommitStatusUnknownError {
  113 |     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
  114 |         write!(
  115 |             f,
  116 |             "Commit result for version {} is unknown: the commit may or may not have been \
  117 |              applied; check the table state before retrying: {}",
  118 |             self.version, self.source
  119 |         )
  120 |     }
  121 | }
  122 | 
  123 | impl std::error::Error for CommitStatusUnknownError {
  124 |     fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
  125 |         Some(self.source.as_ref())
  126 |     }
  127 | }
  128 | 
  129 | /// Allocates error on the heap and then places `e` into it.
  130 | #[inline]
  131 | pub fn box_error(e: impl std::error::Error + Send + Sync + 'static) -> BoxedError {
  132 |     Box::new(e)
  133 | }
  134 | 
  135 | /// Why a writer is fenced. Both reasons are terminal, but callers must tell them
  136 | /// apart (a peer takeover vs. our own failure) rather than parse the message.
  137 | #[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
  138 | pub enum FenceReason {
  139 |     /// A successor writer claimed a higher epoch; this writer lost ownership.
  140 |     PeerClaimedEpoch,
  141 |     /// Our own WAL persistence failed, so in-memory state may have diverged from
  142 |     /// the durable WAL. The writer must be reopened to replay.
  143 |     PersistenceFailure,
  144 | }
  145 | 
  146 | impl std::fmt::Display for FenceReason {
  147 |     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
  148 |         // Stable strings — surfaced in error messages.
  149 |         let s = match self {
  150 |             Self::PeerClaimedEpoch => "peer claimed epoch",
  151 |             Self::PersistenceFailure => "persistence failure",
  152 |         };
  153 |         f.write_str(s)
  154 |     }
  155 | }
  156 | 
  157 | #[derive(Debug, Snafu)]
  158 | #[snafu(visibility(pub))]
  159 | pub enum Error {
  160 |     #[snafu(display("Invalid user input: {source}, {location}"))]
  161 |     InvalidInput {
  162 |         source: BoxedError,
  163 |         #[snafu(implicit)]
  164 |         location: Location,
  165 |         #[snafu(implicit)]
  166 |         backtrace: MaybeBacktrace,
  167 |     },
  168 |     #[snafu(display("Dataset already exists: {uri}, {location}"))]
  169 |     DatasetAlreadyExists {
  170 |         uri: String,
  171 |         #[snafu(implicit)]
  172 |         location: Location,
  173 |         #[snafu(implicit)]
  174 |         backtrace: MaybeBacktrace,
  175 |     },
  176 |     #[snafu(display("Append with different schema: {difference}, location: {location}"))]
  177 |     SchemaMismatch {
  178 |         difference: String,
  179 |         #[snafu(implicit)]
  180 |         location: Location,
  181 |         #[snafu(implicit)]
  182 |         backtrace: MaybeBacktrace,
  183 |     },
  184 |     #[snafu(display("Dataset at path {path} was not found: {source}, {location}"))]
  185 |     DatasetNotFound {
  186 |         path: String,
  187 |         source: BoxedError,
  188 |         #[snafu(implicit)]
  189 |         location: Location,
  190 |         #[snafu(implicit)]
  191 |         backtrace: MaybeBacktrace,
  192 |     },
  193 |     #[snafu(display("Encountered corrupt file {path}: {source}, {location}"))]
  194 |     CorruptFile {
  195 |         path: object_store::path::Path,
  196 |         source: BoxedError,
  197 |         #[snafu(implicit)]
  198 |         location: Location,
  199 |         #[snafu(implicit)]
  200 |         backtrace: MaybeBacktrace,
  201 |     },
  202 |     #[snafu(display("Not supported: {source}, {location}"))]
  203 |     NotSupported {
  204 |         source: BoxedError,
  205 |         #[snafu(implicit)]
  206 |         location: Location,
  207 |         #[snafu(implicit)]
  208 |         backtrace: MaybeBacktrace,
  209 |     },
  210 |     #[snafu(display("Commit conflict for version {version}: {source}, {location}"))]
  211 |     CommitConflict {
  212 |         version: u64,
  213 |         source: BoxedError,
  214 |         #[snafu(implicit)]
  215 |         location: Location,
  216 |         #[snafu(implicit)]
  217 |         backtrace: MaybeBacktrace,
  218 |     },
  219 |     #[snafu(display("Incompatible transaction: {source}, {location}"))]
  220 |     IncompatibleTransaction {
  221 |         source: BoxedError,
  222 |         #[snafu(implicit)]
  223 |         location: Location,
  224 |         #[snafu(implicit)]
  225 |         backtrace: MaybeBacktrace,
  226 |     },
  227 |     #[snafu(display("Retryable commit conflict for version {version}: {source}, {location}"))]
  228 |     RetryableCommitConflict {
  229 |         version: u64,
  230 |         source: BoxedError,
  231 |         #[snafu(implicit)]
  232 |         location: Location,
  233 |         #[snafu(implicit)]
  234 |         backtrace: MaybeBacktrace,
  235 |     },
  236 |     #[snafu(display("Too many concurrent writers. {message}, {location}"))]
  237 |     TooMuchWriteContention {
  238 |         message: String,
  239 |         #[snafu(implicit)]
  240 |         location: Location,
  241 |         #[snafu(implicit)]
  242 |         backtrace: MaybeBacktrace,
  243 |     },
  244 |     #[snafu(display("Operation timed out: {message}, {location}"))]
  245 |     Timeout {
  246 |         message: String,
  247 |         #[snafu(implicit)]
  248 |         location: Location,
  249 |     },
  250 |     #[snafu(display(
  251 |         "Encountered internal error. Please file a bug report at https://github.com/lance-format/lance/issues. {message}, {location}"
  252 |     ))]
  253 |     Internal {
  254 |         message: String,
  255 |         #[snafu(implicit)]
  256 |         location: Location,
  257 |         #[snafu(implicit)]
  258 |         backtrace: MaybeBacktrace,
  259 |     },
  260 |     #[snafu(display("A prerequisite task failed: {message}, {location}"))]
  261 |     PrerequisiteFailed {
  262 |         message: String,
  263 |         #[snafu(implicit)]
  264 |         location: Location,
  265 |         #[snafu(implicit)]
  266 |         backtrace: MaybeBacktrace,
  267 |     },
  268 |     #[snafu(display("Unprocessable: {message}, {location}"))]
  269 |     Unprocessable {
  270 |         message: String,
  271 |         #[snafu(implicit)]
  272 |         location: Location,
  273 |         #[snafu(implicit)]
  274 |         backtrace: MaybeBacktrace,
  275 |     },
  276 |     #[snafu(display("LanceError(Arrow): {message}, {location}"))]
  277 |     Arrow {
  278 |         message: String,
  279 |         #[snafu(implicit)]
  280 |         location: Location,
  281 |         #[snafu(implicit)]
  282 |         backtrace: MaybeBacktrace,
  283 |     },
  284 |     #[snafu(display("LanceError(Schema): {message}, {location}"))]
  285 |     Schema {
  286 |         message: String,
  287 |         #[snafu(implicit)]
  288 |         location: Location,
  289 |         #[snafu(implicit)]
  290 |         backtrace: MaybeBacktrace,
  291 |     },
  292 |     #[snafu(display("Not found: {uri}, {location}"))]
  293 |     NotFound {
  294 |         uri: String,
  295 |         #[snafu(implicit)]
  296 |         location: Location,
  297 |         #[snafu(implicit)]
  298 |         backtrace: MaybeBacktrace,
  299 |     },
  300 |     #[snafu(display("LanceError(IO): {source}, {location}"))]
  301 |     IO {
  302 |         source: BoxedError,
  303 |         #[snafu(implicit)]
  304 |         location: Location,
  305 |         #[snafu(implicit)]
  306 |         backtrace: MaybeBacktrace,
  307 |     },
  308 |     #[snafu(display("LanceError(Index): {message}, {location}"))]
  309 |     Index {
  310 |         message: String,
  311 |         #[snafu(implicit)]
  312 |         location: Location,
  313 |         #[snafu(implicit)]
  314 |         backtrace: MaybeBacktrace,
  315 |     },
  316 |     #[snafu(display("Lance index not found: {identity}, {location}"))]
  317 |     IndexNotFound {
  318 |         identity: String,
  319 |         #[snafu(implicit)]
  320 |         location: Location,
  321 |         #[snafu(implicit)]
  322 |         backtrace: MaybeBacktrace,
  323 |     },
  324 |     #[snafu(display("Cannot infer storage location from: {message}"))]
  325 |     InvalidTableLocation { message: String },
  326 |     /// Stream early stop
  327 |     Stop,
  328 |     #[snafu(display("Wrapped error: {error}, {location}"))]
  329 |     Wrapped {
  330 |         #[snafu(source)]
  331 |         error: BoxedError,
  332 |         #[snafu(implicit)]
  333 |         location: Location,
  334 |         #[snafu(implicit)]
  335 |         backtrace: MaybeBacktrace,
  336 |     },
  337 |     #[snafu(display("Cloned error: {message}, {location}"))]
  338 |     Cloned {
  339 |         message: String,
  340 |         #[snafu(implicit)]
  341 |         location: Location,
  342 |         #[snafu(implicit)]
  343 |         backtrace: MaybeBacktrace,
  344 |     },
  345 |     #[snafu(display("Query Execution error: {message}, {location}"))]
  346 |     Execution {
  347 |         message: String,
  348 |         #[snafu(implicit)]
  349 |         location: Location,
  350 |         #[snafu(implicit)]
  351 |         backtrace: MaybeBacktrace,
  352 |     },
  353 |     #[snafu(display("Ref is invalid: {message}"))]
  354 |     InvalidRef { message: String },
  355 |     #[snafu(display("Ref conflict error: {message}"))]
  356 |     RefConflict { message: String },
  357 |     #[snafu(display("Ref not found error: {message}"))]
  358 |     RefNotFound { message: String },
  359 |     #[snafu(display("Cleanup error: {message}"))]
  360 |     Cleanup { message: String },
  361 |     #[snafu(display("Version not found error: {message}"))]
  362 |     VersionNotFound { message: String },
  363 |     #[snafu(display("Version conflict error: {message}"))]
  364 |     VersionConflict {
  365 |         message: String,
  366 |         major_version: u16,
  367 |         minor_version: u16,
  368 |         #[snafu(implicit)]
  369 |         location: Location,
  370 |         #[snafu(implicit)]
  371 |         backtrace: MaybeBacktrace,
  372 |     },
  373 |     #[snafu(display("Namespace error: {source}, {location}"))]
  374 |     Namespace {
  375 |         source: BoxedError,
  376 |         #[snafu(implicit)]
  377 |         location: Location,
  378 |         #[snafu(implicit)]
  379 |         backtrace: MaybeBacktrace,
  380 |     },
  381 |     /// External error passed through from user code.
  382 |     ///
  383 |     /// This variant preserves errors that users pass into Lance APIs (e.g., via streams
  384 |     /// with custom error types). The original error can be recovered using [`Error::into_external`]
  385 |     /// or inspected using [`Error::external_source`].
  386 |     #[snafu(transparent)]
  387 |     External { source: BoxedError },
  388 | 
  389 |     /// A requested field was not found in a schema.
  390 |     #[snafu(transparent)]
  391 |     FieldNotFound { source: FieldNotFoundError },
  392 | 
  393 |     #[snafu(display(
  394 |         "Spill disk cap of {cap_bytes} bytes exceeded; currently using {used_bytes} bytes, {location}"
  395 |     ))]
  396 |     DiskCapExceeded {
  397 |         cap_bytes: u64,
  398 |         used_bytes: u64,
  399 |         #[snafu(implicit)]
  400 |         location: Location,
  401 |     },
  402 |     /// A writer has been fenced and must stop (see [`FenceReason`]). The message
  403 |     /// keeps the `Writer fenced` prefix for legacy string consumers; new code
  404 |     /// should match on [`Error::fence_reason`].
  405 |     #[snafu(display("Writer fenced ({reason}): {message}, {location}"))]
  406 |     Fenced {
  407 |         reason: FenceReason,
  408 |         message: String,
  409 |         #[snafu(implicit)]
  410 |         location: Location,
  411 |     },
  412 |     /// A write was refused to keep the writer inside its memory budget.
  413 |     ///
  414 |     /// Unlike every other write error this one is *expected* under load and
  415 |     /// carries no data loss: the write was never accepted, so a caller that
  416 |     /// retries once the flush pipeline drains loses nothing. Callers should
  417 |     /// surface it as a retryable "busy" signal (HTTP 503), not a failure.
  418 |     /// Match via [`Error::is_backpressure`] rather than on the message.
  419 |     #[snafu(display("Write rejected by backpressure: {message}, {location}"))]
  420 |     Backpressure {
  421 |         message: String,
  422 |         #[snafu(implicit)]
  423 |         location: Location,
  424 |     },
  425 | }
  426 | 
  427 | impl Error {
  428 |     /// Returns the captured Rust backtrace, if available.
  429 |     ///
  430 |     /// Requires the `backtrace` feature to be enabled at compile time
  431 |     /// and `RUST_BACKTRACE=1` at runtime.
  432 |     #[cfg(feature = "backtrace")]
  433 |     pub fn backtrace(&self) -> Option<&std::backtrace::Backtrace> {
  434 |         match self {
  435 |             Self::InvalidInput { backtrace, .. }
  436 |             | Self::DatasetAlreadyExists { backtrace, .. }
  437 |             | Self::SchemaMismatch { backtrace, .. }
  438 |             | Self::DatasetNotFound { backtrace, .. }
  439 |             | Self::CorruptFile { backtrace, .. }
  440 |             | Self::NotSupported { backtrace, .. }
  441 |             | Self::CommitConflict { backtrace, .. }
  442 |             | Self::IncompatibleTransaction { backtrace, .. }
  443 |             | Self::RetryableCommitConflict { backtrace, .. }
  444 |             | Self::TooMuchWriteContention { backtrace, .. }
  445 |             | Self::Internal { backtrace, .. }
  446 |             | Self::PrerequisiteFailed { backtrace, .. }
  447 |             | Self::Unprocessable { backtrace, .. }
  448 |             | Self::Arrow { backtrace, .. }
  449 |             | Self::Schema { backtrace, .. }
  450 |             | Self::NotFound { backtrace, .. }
  451 |             | Self::IO { backtrace, .. }
  452 |             | Self::Index { backtrace, .. }
  453 |             | Self::IndexNotFound { backtrace, .. }
  454 |             | Self::Wrapped { backtrace, .. }
  455 |             | Self::Cloned { backtrace, .. }
  456 |             | Self::Execution { backtrace, .. }
  457 |             | Self::VersionConflict { backtrace, .. }
  458 |             | Self::Namespace { backtrace, .. } => {
  459 |                 use snafu::AsBacktrace;
  460 |                 backtrace.as_backtrace()
  461 |             }
  462 |             // Variants without a backtrace field — listed explicitly so that
  463 |             // adding a new variant with a backtrace field triggers a compiler error.
  464 |             Self::InvalidTableLocation { .. }
  465 |             | Self::Stop
  466 |             | Self::InvalidRef { .. }
  467 |             | Self::RefConflict { .. }
  468 |             | Self::RefNotFound { .. }
  469 |             | Self::Cleanup { .. }
  470 |             | Self::VersionNotFound { .. }
  471 |             | Self::External { .. }
  472 |             | Self::FieldNotFound { .. }
  473 |             | Self::Timeout { .. }
  474 |             | Self::DiskCapExceeded { .. }
  475 |             | Self::Fenced { .. }
  476 |             | Self::Backpressure { .. } => None,
  477 |         }
  478 |     }
  479 | 
  480 |     /// Returns the captured Rust backtrace, if available.
  481 |     ///
  482 |     /// Always returns `None` when the `backtrace` feature is not enabled.
  483 |     #[cfg(not(feature = "backtrace"))]
  484 |     pub fn backtrace(&self) -> Option<&std::backtrace::Backtrace> {
  485 |         None
  486 |     }
  487 | 
  488 |     #[track_caller]
  489 |     pub fn corrupt_file(path: object_store::path::Path, message: impl Into<String>) -> Self {
  490 |         CorruptFileSnafu { path }.into_error(message.into().into())
  491 |     }
  492 | 
  493 |     /// Reports a corrupt file when the caller only has a logical/section name
  494 |     /// rather than the real file path (for example, a decoder that validates an
  495 |     /// in-memory buffer and does not know where it came from).
  496 |     ///
  497 |     /// `name` is carried in the `path` field of the resulting [`Error::CorruptFile`]
  498 |     /// variant and is NOT a filesystem path; callers that have the real path should
  499 |     /// use [`Self::corrupt_file`] instead.
  500 |     #[track_caller]
  501 |     pub fn corrupt_file_named(name: &str, message: impl Into<String>) -> Self {
  502 |         Self::corrupt_file(object_store::path::Path::from(name), message)
  503 |     }
  504 | 
  505 |     #[track_caller]
  506 |     pub fn invalid_input(message: impl Into<String>) -> Self {
  507 |         InvalidInputSnafu.into_error(message.into().into())
  508 |     }
  509 | 
  510 |     #[track_caller]
  511 |     pub fn invalid_input_source(source: BoxedError) -> Self {
  512 |         InvalidInputSnafu.into_error(source)
  513 |     }
  514 | 
  515 |     #[track_caller]
  516 |     pub fn io(message: impl Into<String>) -> Self {
  517 |         IOSnafu.into_error(message.into().into())
  518 |     }
  519 | 
  520 |     /// A successor writer claimed a higher epoch; this writer lost ownership.
  521 |     #[track_caller]
  522 |     pub fn fenced_by_peer(message: impl Into<String>) -> Self {
  523 |         FencedSnafu {
  524 |             reason: FenceReason::PeerClaimedEpoch,
  525 |             message: message.into(),
  526 |         }
  527 |         .build()
  528 |     }
  529 | 
  530 |     /// Our WAL persistence failed; in-memory state may have diverged from the
  531 |     /// durable WAL, so the writer must be reopened to replay.
  532 |     #[track_caller]
  533 |     pub fn writer_poisoned(message: impl Into<String>) -> Self {
  534 |         FencedSnafu {
  535 |             reason: FenceReason::PersistenceFailure,
  536 |             message: message.into(),
  537 |         }
  538 |         .build()
  539 |     }
  540 | 
  541 |     /// The [`FenceReason`] if this is [`Error::Fenced`], else `None`. Prefer this
  542 |     /// over matching the error message to decide how to react to a fence.
  543 |     pub fn fence_reason(&self) -> Option<FenceReason> {
  544 |         match self {
  545 |             Self::Fenced { reason, .. } => Some(*reason),
  546 |             _ => None,
  547 |         }
  548 |     }
  549 | 
  550 |     /// A write was refused because the writer is at its memory ceiling; the
  551 |     /// data was never accepted. See [`Error::Backpressure`].
  552 |     #[track_caller]
  553 |     pub fn backpressure(message: impl Into<String>) -> Self {
  554 |         BackpressureSnafu {
  555 |             message: message.into(),
  556 |         }
  557 |         .build()
  558 |     }
  559 | 
  560 |     /// Whether this is [`Error::Backpressure`] — i.e. a retryable "writer is
  561 |     /// full" signal rather than a real failure. Prefer this over matching the
  562 |     /// error message.
  563 |     pub fn is_backpressure(&self) -> bool {
  564 |         matches!(self, Self::Backpressure { .. })
  565 |     }
  566 | 
  567 |     #[track_caller]
  568 |     pub fn io_source(source: BoxedError) -> Self {
  569 |         IOSnafu.into_error(source)
  570 |     }
  571 | 
  572 |     #[track_caller]
  573 |     pub fn dataset_already_exists(uri: impl Into<String>) -> Self {
  574 |         DatasetAlreadyExistsSnafu { uri: uri.into() }.build()
  575 |     }
  576 | 
  577 |     #[track_caller]
  578 |     pub fn dataset_not_found(path: impl Into<String>, source: BoxedError) -> Self {
  579 |         DatasetNotFoundSnafu { path: path.into() }.into_error(source)
  580 |     }
  581 | 
  582 |     #[track_caller]
  583 |     pub fn version_conflict(
  584 |         message: impl Into<String>,
  585 |         major_version: u16,
  586 |         minor_version: u16,
  587 |     ) -> Self {
  588 |         VersionConflictSnafu {
  589 |             message: message.into(),
  590 |             major_version,
  591 |             minor_version,
  592 |         }
  593 |         .build()
  594 |     }
  595 | 
  596 |     #[track_caller]
  597 |     pub fn not_found(uri: impl Into<String>) -> Self {
  598 |         NotFoundSnafu { uri: uri.into() }.build()
  599 |     }
  600 | 
  601 |     /// Return whether this error or one of its typed sources is a missing object.
  602 |     pub fn is_not_found(&self) -> bool {
  603 |         match self {
  604 |             Self::NotFound { .. } => true,
  605 |             Self::Wrapped { error, .. }
  606 |                 if error.downcast_ref::<CommitStatusUnknownError>().is_some() =>
  607 |             {
  608 |                 false
  609 |             }
  610 |             Self::IO { source, .. } | Self::Wrapped { error: source, .. } => {
  611 |                 error_source_is_not_found(source.as_ref())
  612 |             }
  613 |             _ => false,
  614 |         }
  615 |     }
  616 | 
  617 |     #[track_caller]
  618 |     pub fn wrapped(error: BoxedError) -> Self {
  619 |         WrappedSnafu.into_error(error)
  620 |     }
  621 | 
  622 |     #[track_caller]
  623 |     pub fn schema(message: impl Into<String>) -> Self {
  624 |         SchemaSnafu {
  625 |             message: message.into(),
  626 |         }
  627 |         .build()
  628 |     }
  629 | 
  630 |     #[track_caller]
  631 |     pub fn not_supported(message: impl Into<String>) -> Self {
  632 |         NotSupportedSnafu.into_error(message.into().into())
  633 |     }
  634 | 
  635 |     #[track_caller]
  636 |     pub fn not_supported_source(source: BoxedError) -> Self {
  637 |         NotSupportedSnafu.into_error(source)
  638 |     }
  639 | 
  640 |     #[track_caller]
  641 |     pub fn internal(message: impl Into<String>) -> Self {
  642 |         InternalSnafu {
  643 |             message: message.into(),
  644 |         }
  645 |         .build()
  646 |     }
  647 | 
  648 |     #[track_caller]
  649 |     pub fn timeout(message: impl Into<String>) -> Self {
  650 |         TimeoutSnafu {
  651 |             message: message.into(),
  652 |         }
  653 |         .build()
  654 |     }
  655 | 
  656 |     #[track_caller]
  657 |     pub fn namespace(message: impl Into<String>) -> Self {
  658 |         NamespaceSnafu.into_error(message.into().into())
  659 |     }
  660 | 
  661 |     #[track_caller]
  662 |     pub fn namespace_source(source: Box<dyn std::error::Error + Send + Sync + 'static>) -> Self {
  663 |         NamespaceSnafu.into_error(source)
  664 |     }
  665 | 
  666 |     #[track_caller]
  667 |     pub fn arrow(message: impl Into<String>) -> Self {
  668 |         ArrowSnafu {
  669 |             message: message.into(),
  670 |         }
  671 |         .build()
  672 |     }
  673 | 
  674 |     #[track_caller]
  675 |     pub fn execution(message: impl Into<String>) -> Self {
  676 |         ExecutionSnafu {
  677 |             message: message.into(),
  678 |         }
  679 |         .build()
  680 |     }
  681 | 
  682 |     #[track_caller]
  683 |     pub fn cloned(message: impl Into<String>) -> Self {
  684 |         ClonedSnafu {
  685 |             message: message.into(),
  686 |         }
  687 |         .build()
  688 |     }
  689 | 
  690 |     #[track_caller]
  691 |     pub fn schema_mismatch(difference: impl Into<String>) -> Self {
  692 |         SchemaMismatchSnafu {
  693 |             difference: difference.into(),
  694 |         }
  695 |         .build()
  696 |     }
  697 | 
  698 |     #[track_caller]
  699 |     pub fn unprocessable(message: impl Into<String>) -> Self {
  700 |         UnprocessableSnafu {
  701 |             message: message.into(),
  702 |         }
  703 |         .build()
  704 |     }
  705 | 
  706 |     #[track_caller]
  707 |     pub fn too_much_write_contention(message: impl Into<String>) -> Self {
  708 |         TooMuchWriteContentionSnafu {
  709 |             message: message.into(),
  710 |         }
  711 |         .build()
  712 |     }
  713 | 
  714 |     #[track_caller]
  715 |     pub fn prerequisite_failed(message: impl Into<String>) -> Self {
  716 |         PrerequisiteFailedSnafu {
  717 |             message: message.into(),
  718 |         }
  719 |         .build()
  720 |     }
  721 | 
  722 |     #[track_caller]
  723 |     pub fn index(message: impl Into<String>) -> Self {
  724 |         IndexSnafu {
  725 |             message: message.into(),
  726 |         }
  727 |         .build()
  728 |     }
  729 | 
  730 |     #[track_caller]
  731 |     pub fn index_not_found(identity: impl Into<String>) -> Self {
  732 |         IndexNotFoundSnafu {
  733 |             identity: identity.into(),
  734 |         }
  735 |         .build()
  736 |     }
  737 | 
  738 |     #[track_caller]
  739 |     pub fn commit_conflict_source(version: u64, source: BoxedError) -> Self {
  740 |         CommitConflictSnafu { version }.into_error(source)
  741 |     }
  742 | 
  743 |     #[track_caller]
  744 |     pub fn retryable_commit_conflict_source(version: u64, source: BoxedError) -> Self {
  745 |         RetryableCommitConflictSnafu { version }.into_error(source)
  746 |     }
  747 | 
  748 |     #[track_caller]
  749 |     pub fn commit_status_unknown_source(version: u64, source: BoxedError) -> Self {
  750 |         Self::wrapped(box_error(CommitStatusUnknownError { version, source }))
  751 |     }
  752 | 
  753 |     /// Return whether this error represents a commit whose final outcome could
  754 |     /// not be determined safely.
  755 |     pub fn is_commit_status_unknown(&self) -> bool {
  756 |         matches!(
  757 |             self,
  758 |             Self::Wrapped { error, .. }
  759 |                 if error.downcast_ref::<CommitStatusUnknownError>().is_some()
  760 |         )
  761 |     }
  762 | 
  763 |     #[track_caller]
  764 |     pub fn incompatible_transaction_source(source: BoxedError) -> Self {
  765 |         IncompatibleTransactionSnafu.into_error(source)
  766 |     }
  767 | 
  768 |     #[track_caller]
  769 |     pub fn disk_cap_exceeded(cap_bytes: u64, used_bytes: u64) -> Self {
  770 |         DiskCapExceededSnafu {
  771 |             cap_bytes,
  772 |             used_bytes,
  773 |         }
  774 |         .build()
  775 |     }
  776 | 
  777 |     /// Create an External error from a boxed error source.
  778 |     pub fn external(source: BoxedError) -> Self {
  779 |         Self::External { source }
  780 |     }
  781 | 
  782 |     /// Create a FieldNotFound error with the given field name and available candidates.
  783 |     pub fn field_not_found(field_name: impl Into<String>, candidates: Vec<String>) -> Self {
  784 |         Self::FieldNotFound {
  785 |             source: FieldNotFoundError {
  786 |                 field_name: field_name.into(),
  787 |                 candidates,
  788 |             },
  789 |         }
  790 |     }
  791 | 
  792 |     /// Returns a reference to the external error source if this is an `External` variant.
  793 |     ///
  794 |     /// This allows downcasting to recover the original error type.
  795 |     pub fn external_source(&self) -> Option<&BoxedError> {
  796 |         match self {
  797 |             Self::External { source } => Some(source),
  798 |             _ => None,
  799 |         }
  800 |     }
  801 | 
  802 |     /// Consumes the error and returns the external source if this is an `External` variant.
  803 |     ///
  804 |     /// Returns `Err(self)` if this is not an `External` variant, allowing for chained handling.
  805 |     pub fn into_external(self) -> std::result::Result<BoxedError, Self> {
  806 |         match self {
  807 |             Self::External { source } => Ok(source),
  808 |             other => Err(other),
  809 |         }
  810 |     }
  811 | }
  812 | 
  813 | fn error_source_is_not_found(source: &(dyn std::error::Error + 'static)) -> bool {
  814 |     if let Some(error) = source.downcast_ref::<Error>() {
  815 |         return error.is_not_found();
  816 |     }
  817 |     if let Some(error) = source.downcast_ref::<object_store::Error>() {
  818 |         return matches!(error, object_store::Error::NotFound { .. })
  819 |             || std::error::Error::source(error).is_some_and(error_source_is_not_found);
  820 |     }
  821 |     source.source().is_some_and(error_source_is_not_found)
  822 | }
  823 | 
  824 | pub trait LanceOptionExt<T> {
  825 |     /// Unwraps an option, returning an internal error if the option is None.
  826 |     ///
  827 |     /// Can be used when an option is expected to have a value.
  828 |     fn expect_ok(self) -> Result<T>;
  829 | }
  830 | 
  831 | impl<T> LanceOptionExt<T> for Option<T> {
  832 |     #[track_caller]
  833 |     fn expect_ok(self) -> Result<T> {
  834 |         self.ok_or_else(|| Error::internal("Expected option to have value"))
  835 |     }
  836 | }
  837 | 
  838 | pub type Result<T> = std::result::Result<T, Error>;
  839 | pub type ArrowResult<T> = std::result::Result<T, ArrowError>;
  840 | #[cfg(feature = "datafusion")]
  841 | pub type DataFusionResult<T> = std::result::Result<T, datafusion_common::DataFusionError>;
  842 | 
  843 | impl From<ArrowError> for Error {
  844 |     #[track_caller]
  845 |     fn from(e: ArrowError) -> Self {
  846 |         match e {
  847 |             ArrowError::ExternalError(source) => {
  848 |                 // Try to downcast to lance_core::Error first to recover the original
  849 |                 match source.downcast::<Self>() {
  850 |                     Ok(lance_err) => *lance_err,
  851 |                     Err(source) => Self::External { source },
  852 |                 }
  853 |             }
  854 |             other => Self::arrow(other.to_string()),
  855 |         }
  856 |     }
  857 | }
  858 | 
  859 | impl From<&ArrowError> for Error {
  860 |     #[track_caller]
  861 |     fn from(e: &ArrowError) -> Self {
  862 |         Self::arrow(e.to_string())
  863 |     }
  864 | }
  865 | 
  866 | impl From<std::io::Error> for Error {
  867 |     #[track_caller]
  868 |     fn from(e: std::io::Error) -> Self {
  869 |         // A lance `Error` may have been wrapped in an `io::Error` (e.g. via
  870 |         // `io::Error::other(Error::...)`) to cross an `AsyncWrite`/`AsyncRead`
  871 |         // boundary. Recover it so typed errors such as `DiskCapExceeded`
  872 |         // survive the round-trip instead of collapsing into an opaque `IO`.
  873 |         if e.get_ref().is_some_and(|inner| inner.is::<Self>()) {
  874 |             return *e
  875 |                 .into_inner()
  876 |                 .expect("checked Some above")
  877 |                 .downcast::<Self>()
  878 |                 .expect("checked type above");
  879 |         }
  880 |         Self::io_source(box_error(e))
  881 |     }
  882 | }
  883 | 
  884 | impl From<object_store::Error> for Error {
  885 |     #[track_caller]
  886 |     fn from(e: object_store::Error) -> Self {
  887 |         match e {
  888 |             // source intentionally dropped; Error::NotFound carries only the path
  889 |             object_store::Error::NotFound { path, .. } => Self::not_found(path),
  890 |             other => Self::io_source(box_error(other)),
  891 |         }
  892 |     }
  893 | }
  894 | 
  895 | impl From<prost::DecodeError> for Error {
  896 |     #[track_caller]
  897 |     fn from(e: prost::DecodeError) -> Self {
  898 |         Self::io_source(box_error(e))
  899 |     }
  900 | }
  901 | 
  902 | impl From<prost::EncodeError> for Error {
  903 |     #[track_caller]
  904 |     fn from(e: prost::EncodeError) -> Self {
  905 |         Self::io_source(box_error(e))
  906 |     }
  907 | }
  908 | 
  909 | impl From<prost::UnknownEnumValue> for Error {
  910 |     #[track_caller]
  911 |     fn from(e: prost::UnknownEnumValue) -> Self {
  912 |         Self::io_source(box_error(e))
  913 |     }
  914 | }
  915 | 
  916 | impl From<tokio::task::JoinError> for Error {
  917 |     #[track_caller]
  918 |     fn from(e: tokio::task::JoinError) -> Self {
  919 |         Self::io_source(box_error(e))
  920 |     }
  921 | }
  922 | 
  923 | impl From<object_store::path::Error> for Error {
  924 |     #[track_caller]
  925 |     fn from(e: object_store::path::Error) -> Self {
  926 |         Self::io_source(box_error(e))
  927 |     }
  928 | }
  929 | 
  930 | impl From<url::ParseError> for Error {
  931 |     #[track_caller]
  932 |     fn from(e: url::ParseError) -> Self {
  933 |         Self::io_source(box_error(e))
  934 |     }
  935 | }
  936 | 
  937 | impl From<serde_json::Error> for Error {
  938 |     #[track_caller]
  939 |     fn from(e: serde_json::Error) -> Self {
  940 |         Self::arrow(e.to_string())
  941 |     }
  942 | }
  943 | 
  944 | impl From<Error> for ArrowError {
  945 |     fn from(value: Error) -> Self {
  946 |         match value {
  947 |             // Pass through external errors directly
  948 |             Error::External { source } => Self::ExternalError(source),
  949 |             // Preserve schema errors with their specific type
  950 |             Error::Schema { message, .. } => Self::SchemaError(message),
  951 |             // Wrap all other lance errors so they can be recovered
  952 |             e => Self::ExternalError(Box::new(e)),
  953 |         }
  954 |     }
  955 | }
  956 | 
  957 | #[cfg(feature = "datafusion")]
  958 | impl From<datafusion_sql::sqlparser::parser::ParserError> for Error {
  959 |     #[track_caller]
  960 |     fn from(e: datafusion_sql::sqlparser::parser::ParserError) -> Self {
  961 |         Self::io_source(box_error(e))
  962 |     }
  963 | }
  964 | 
  965 | #[cfg(feature = "datafusion")]
  966 | impl From<datafusion_sql::sqlparser::tokenizer::TokenizerError> for Error {
  967 |     #[track_caller]
  968 |     fn from(e: datafusion_sql::sqlparser::tokenizer::TokenizerError) -> Self {
  969 |         Self::io_source(box_error(e))
  970 |     }
  971 | }
  972 | 
  973 | #[cfg(feature = "datafusion")]
  974 | impl From<Error> for datafusion_common::DataFusionError {
  975 |     #[track_caller]
  976 |     fn from(e: Error) -> Self {
  977 |         Self::External(Box::new(e))
  978 |     }
  979 | }
  980 | 
  981 | #[cfg(feature = "datafusion")]
  982 | impl From<datafusion_common::DataFusionError> for Error {
  983 |     #[track_caller]
  984 |     fn from(e: datafusion_common::DataFusionError) -> Self {
  985 |         match e {
  986 |             // DataFusion wraps an error to attach end-user context and source
  987 |             // spans (`Diagnostic`), a description of what was running
  988 |             // (`Context`), or to report several failures at once
  989 |             // (`Collection`). All three are display-transparent, so the
  990 |             // category has to come from the error underneath; classifying the
  991 |             // wrapper itself reports a malformed query as an internal failure.
  992 |             datafusion_common::DataFusionError::Diagnostic(_, inner)
  993 |             | datafusion_common::DataFusionError::Context(_, inner) => Self::from(*inner),
  994 |             datafusion_common::DataFusionError::Collection(errors) => {
  995 |                 match errors.into_iter().next() {
  996 |                     // `Collection` reports the first error's message, so take
  997 |                     // its category too.
  998 |                     Some(first) => Self::from(first),
  999 |                     None => Self::execution("DataFusion returned an empty error collection"),
 1000 |                 }
 1001 |             }
 1002 |             datafusion_common::DataFusionError::SQL(..)
 1003 |             | datafusion_common::DataFusionError::Plan(..)
 1004 |             | datafusion_common::DataFusionError::Configuration(..)
 1005 |             | datafusion_common::DataFusionError::SchemaError(..) => {
 1006 |                 Self::invalid_input_source(box_error(e))
 1007 |             }
 1008 |             datafusion_common::DataFusionError::ArrowError(arrow_err, _) => Self::from(*arrow_err),
 1009 |             datafusion_common::DataFusionError::NotImplemented(..) => {
 1010 |                 Self::not_supported_source(box_error(e))
 1011 |             }
 1012 |             datafusion_common::DataFusionError::Execution(..) => Self::execution(e.to_string()),
 1013 |             datafusion_common::DataFusionError::Shared(shared) => {
 1014 |                 // DataFusion shares an error across consumers (e.g. a join's
 1015 |                 // build-side error fanned out to every probe partition) behind an
 1016 |                 // `Arc`. If we are the sole owner we can recurse for full fidelity;
 1017 |                 // otherwise re-wrap in `Shared` so the concrete error type is still
 1018 |                 // reachable via `Error::source` / `downcast_ref`.
 1019 |                 match std::sync::Arc::try_unwrap(shared) {
 1020 |                     Ok(inner) => Self::from(inner),
 1021 |                     Err(shared) => {
 1022 |                         let rewrapped = datafusion_common::DataFusionError::Shared(shared);
 1023 |                         Self::External {
 1024 |                             source: box_error(rewrapped),
 1025 |                         }
 1026 |                     }
 1027 |                 }
 1028 |             }
 1029 |             datafusion_common::DataFusionError::External(source) => {
 1030 |                 // Try to downcast to lance_core::Error first
 1031 |                 match source.downcast::<Self>() {
 1032 |                     Ok(lance_err) => *lance_err,
 1033 |                     Err(source) => Self::External { source },
 1034 |                 }
 1035 |             }
 1036 |             _ => Self::io_source(box_error(e)),
 1037 |         }
 1038 |     }
 1039 | }
 1040 | 
 1041 | // This is a bit odd but some object_store functions only accept
 1042 | // Stream<Result<T, ObjectStoreError>> and so we need to convert
 1043 | // to ObjectStoreError to call the methods.
 1044 | impl From<Error> for object_store::Error {
 1045 |     fn from(err: Error) -> Self {
 1046 |         Self::Generic {
 1047 |             store: "N/A",
 1048 |             source: Box::new(err),
 1049 |         }
 1050 |     }
 1051 | }
 1052 | 
 1053 | #[track_caller]
 1054 | pub fn get_caller_location() -> &'static std::panic::Location<'static> {
 1055 |     std::panic::Location::caller()
 1056 | }
 1057 | 
 1058 | /// Wrap an error in a new error type that implements Clone
 1059 | ///
 1060 | /// This is useful when two threads/streams share a common fallible source
 1061 | /// The variants whose meaning callers read through an accessor rather than
 1062 | /// through the message survive the clone: definite not-found errors keep typed
 1063 | /// source-chain detection (`is_not_found`), fenced errors keep their
 1064 | /// [`FenceReason`] (`fence_reason`), backpressure stays backpressure
 1065 | /// (`is_backpressure`), and an unknown commit outcome keeps its version
 1066 | /// (`is_commit_status_unknown`) with the typed source degraded to its message.
 1067 | /// Timeout and I/O errors preserve their categories. Everything else becomes
 1068 | /// `Error::Cloned` carrying the string representation.
 1069 | ///
 1070 | /// One gap: [`Error::External`] is not preserved, because its source is not
 1071 | /// cloneable and rebuilding it from a message would leave `external_source`
 1072 | /// returning `Some` while the downcast the caller wants fails. After a clone,
 1073 | /// `external_source` and `into_external` no longer recover the original error.
 1074 | pub struct CloneableError(pub Error);
 1075 | 
 1076 | struct DisplayError(Error);
 1077 | 
 1078 | impl fmt::Debug for DisplayError {
 1079 |     fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
 1080 |         fmt::Display::fmt(self, f)
 1081 |     }
 1082 | }
 1083 | 
 1084 | impl fmt::Display for DisplayError {
 1085 |     fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
 1086 |         fmt::Display::fmt(&self.0, f)
 1087 |     }
 1088 | }
 1089 | 
 1090 | impl std::error::Error for DisplayError {
 1091 |     fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
 1092 |         Some(&self.0)
 1093 |     }
 1094 | }
 1095 | 
 1096 | impl Clone for CloneableError {
 1097 |     #[track_caller]
 1098 |     fn clone(&self) -> Self {
 1099 |         // Same reasoning for `is_commit_status_unknown`, but its typed source is
 1100 |         // not cloneable, so the rebuild keeps the version and carries the
 1101 |         // source's own message, as the `NotFound` arm does.
 1102 |         if let Error::Wrapped { error, .. } = &self.0
 1103 |             && let Some(unknown) = error.downcast_ref::<CommitStatusUnknownError>()
 1104 |         {
 1105 |             let source = std::error::Error::source(unknown)
 1106 |                 .map(|source| source.to_string())
 1107 |                 .unwrap_or_else(|| unknown.to_string());
 1108 |             return Self(Error::commit_status_unknown_source(
 1109 |                 unknown.version(),
 1110 |                 box_error(DisplayError(Error::cloned(source))),
 1111 |             ));
 1112 |         }
 1113 |         match &self.0 {
 1114 |             Error::NotFound { uri, .. } => Self(Error::wrapped(Box::new(DisplayError(
 1115 |                 Error::not_found(uri.clone()),
 1116 |             )))),
 1117 |             error if error.is_not_found() => Self(Error::wrapped(Box::new(DisplayError(
 1118 |                 Error::not_found(error.to_string()),
 1119 |             )))),
 1120 |             Error::Timeout { message, .. } => Self(Error::timeout(message.clone())),
 1121 |             Error::IO { source, .. } => Self(Error::io(source.to_string())),
 1122 |             // Callers react to these via `fence_reason` / `is_backpressure`
 1123 |             // rather than the message; collapsing them into a cloned string
 1124 |             // would silently drop that signal across the clone boundary.
 1125 |             Error::Fenced {
 1126 |                 reason, message, ..
 1127 |             } => Self(
 1128 |                 FencedSnafu {
 1129 |                     reason: *reason,
 1130 |                     message: message.clone(),
 1131 |                 }
 1132 |                 .build(),
 1133 |             ),
 1134 |             Error::Backpressure { message, .. } => Self(Error::backpressure(message.clone())),
 1135 |             error => Self(Error::cloned(error.to_string())),
 1136 |         }
 1137 |     }
 1138 | }
 1139 | 
 1140 | #[derive(Clone)]
 1141 | pub struct CloneableResult<T: Clone>(pub std::result::Result<T, CloneableError>);
 1142 | 
 1143 | impl<T: Clone> From<Result<T>> for CloneableResult<T> {
 1144 |     fn from(result: Result<T>) -> Self {
 1145 |         Self(result.map_err(CloneableError))
 1146 |     }
 1147 | }
 1148 | 
 1149 | #[cfg(test)]
 1150 | mod test {
 1151 |     use super::*;
 1152 |     use std::error::Error as _;
 1153 |     use std::fmt;
 1154 | 
 1155 |     /// The variants whose meaning lives in an accessor rather than in the
 1156 |     /// message: collapsing them into a cloned string drops the signal.
 1157 |     #[test]
 1158 |     fn cloneable_error_preserves_accessor_contracts() {
 1159 |         // Both reasons, because carrying `reason` through is the arm's whole job.
 1160 |         for (original, expected) in [
 1161 |             (
 1162 |                 Error::fenced_by_peer("peer claimed epoch 7"),
 1163 |                 FenceReason::PeerClaimedEpoch,
 1164 |             ),
 1165 |             (
 1166 |                 Error::writer_poisoned("wal flush failed"),
 1167 |                 FenceReason::PersistenceFailure,
 1168 |             ),
 1169 |         ] {
 1170 |             let original = CloneableError(original);
 1171 |             assert_eq!(original.0.fence_reason(), Some(expected));
 1172 |             assert_eq!(original.clone().0.fence_reason(), Some(expected));
 1173 |         }
 1174 | 
 1175 |         let original = CloneableError(Error::backpressure("writer at memory ceiling"));
 1176 |         let cloned = original.clone();
 1177 |         assert!(original.0.is_backpressure());
 1178 |         assert!(cloned.0.is_backpressure());
 1179 | 
 1180 |         let original = CloneableError(Error::commit_status_unknown_source(
 1181 |             7,
 1182 |             box_error(DisplayError(Error::timeout("put timed out"))),
 1183 |         ));
 1184 |         let cloned = original.clone();
 1185 |         // Cloning the clone must not degrade it further.
 1186 |         let twice = cloned.clone();
 1187 |         assert!(original.0.is_commit_status_unknown());
 1188 |         assert!(cloned.0.is_commit_status_unknown());
 1189 |         assert!(!cloned.0.is_not_found());
 1190 |         assert!(twice.0.is_commit_status_unknown());
 1191 |     }
 1192 | 
 1193 |     #[test]
 1194 |     fn cloneable_error_preserves_not_found_contract() {
 1195 |         let original = CloneableError(Error::not_found("metadata.lance"));
 1196 |         let cloned = original.clone();
 1197 |         let cloned_again = cloned.clone();
 1198 |         assert!(matches!(original.0, Error::NotFound { .. }));
 1199 |         assert!(cloned.0.is_not_found());
 1200 |         assert!(cloned_again.0.is_not_found());
 1201 |         assert!(cloned.0.to_string().to_lowercase().contains("not found"));
 1202 |         assert!(
 1203 |             cloned_again
 1204 |                 .0
 1205 |                 .to_string()
 1206 |                 .to_lowercase()
 1207 |                 .contains("not found")
 1208 |         );
 1209 |         assert!(
 1210 |             format!("{:?}", cloned.0)
 1211 |                 .to_lowercase()
 1212 |                 .contains("not found")
 1213 |         );
 1214 |         assert!(cloned.0.source().is_some_and(|source| source.is::<Error>()
 1215 |             || source.source().is_some_and(|source| source.is::<Error>())));
 1216 |         let downstream_error = Error::wrapped(Box::new(Error::io_source(Box::new(
 1217 |             object_store::Error::Generic {
 1218 |                 store: "N/A",
 1219 |                 source: Box::new(cloned.0),
 1220 |             },
 1221 |         ))));
 1222 |         assert!(downstream_error.is_not_found());
 1223 |         assert!(
 1224 |             format!("{downstream_error:?}")
 1225 |                 .to_lowercase()
 1226 |                 .contains("not found")
 1227 |         );
 1228 | 
 1229 |         let original = CloneableError(Error::timeout("metadata read timed out"));
 1230 |         let cloned = original.clone();
 1231 |         assert!(matches!(original.0, Error::Timeout { .. }));
 1232 |         assert!(matches!(cloned.0, Error::Timeout { .. }));
 1233 | 
 1234 |         let original = CloneableError(Error::io("metadata read was denied"));
 1235 |         let cloned = original.clone();
 1236 |         assert!(matches!(original.0, Error::IO { .. }));
 1237 |         assert!(matches!(cloned.0, Error::IO { .. }));
 1238 |     }
 1239 | 
 1240 |     #[test]
 1241 |     fn test_caller_location_capture() {
 1242 |         let current_fn = get_caller_location();
 1243 |         // make sure ? captures the correct location
 1244 |         // .into() WILL NOT capture the correct location
 1245 |         let f: Box<dyn Fn() -> Result<()>> = Box::new(|| {
 1246 |             Err(object_store::Error::Generic {
 1247 |                 store: "",
 1248 |                 source: "".into(),
 1249 |             })?;
 1250 |             Ok(())
 1251 |         });
 1252 |         match f().unwrap_err() {
 1253 |             Error::IO { location, .. } => {
 1254 |                 // +4 is the beginning of object_store::Error::Generic...
 1255 |                 assert_eq!(location.line(), current_fn.line() + 4, "{}", location)
 1256 |             }
 1257 |             #[allow(unreachable_patterns)]
 1258 |             _ => panic!("expected ObjectStore error"),
 1259 |         }
 1260 |     }
 1261 | 
 1262 |     #[test]
 1263 |     fn test_caller_location_capture_not_found() {
 1264 |         let current_fn = get_caller_location();
 1265 |         let f: Box<dyn Fn() -> Result<()>> = Box::new(|| {
 1266 |             Err(object_store::Error::NotFound {
 1267 |                 path: "some/path".to_string(),
 1268 |                 source: "not found".into(),
 1269 |             })?;
 1270 |             Ok(())
 1271 |         });
 1272 |         match f().unwrap_err() {
 1273 |             Error::NotFound { location, .. } => {
 1274 |                 // +2 is the beginning of object_store::Error::NotFound...
 1275 |                 assert_eq!(location.line(), current_fn.line() + 2, "{}", location)
 1276 |             }
 1277 |             #[allow(unreachable_patterns)]
 1278 |             other => panic!("expected NotFound, got {:?}", other),
 1279 |         }
 1280 |     }
 1281 | 
 1282 |     #[test]
 1283 |     fn test_object_store_not_found_converts_to_not_found() {
 1284 |         let os_err = object_store::Error::NotFound {
 1285 |             path: "test/path".to_string(),
 1286 |             source: "no such file".into(),
 1287 |         };
 1288 |         let lance_err: Error = os_err.into();
 1289 |         match lance_err {
 1290 |             Error::NotFound { uri, .. } => {
 1291 |                 assert_eq!(uri, "test/path");
 1292 |             }
 1293 |             other => panic!("Expected NotFound, got {:?}", other),
 1294 |         }
 1295 |     }
 1296 | 
 1297 |     #[derive(Debug)]
 1298 |     struct MyCustomError {
 1299 |         code: i32,
 1300 |         message: String,
 1301 |     }
 1302 | 
 1303 |     impl fmt::Display for MyCustomError {
 1304 |         fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
 1305 |             write!(f, "MyCustomError({}): {}", self.code, self.message)
 1306 |         }
 1307 |     }
 1308 | 
 1309 |     impl std::error::Error for MyCustomError {}
 1310 | 
 1311 |     #[test]
 1312 |     fn test_io_error_recovers_wrapped_lance_error() {
 1313 |         // A lance Error wrapped in io::Error::other should round-trip back to
 1314 |         // the original variant rather than collapsing into Error::IO.
 1315 |         let io_err = std::io::Error::other(Error::disk_cap_exceeded(100, 50));
 1316 |         let recovered: Error = io_err.into();
 1317 |         match recovered {
 1318 |             Error::DiskCapExceeded {
 1319 |                 cap_bytes,
 1320 |                 used_bytes,
 1321 |                 ..
 1322 |             } => {
 1323 |                 assert_eq!(cap_bytes, 100);
 1324 |                 assert_eq!(used_bytes, 50);
 1325 |             }
 1326 |             other => panic!("expected DiskCapExceeded, got {other:?}"),
 1327 |         }
 1328 |     }
 1329 | 
 1330 |     #[test]
 1331 |     fn test_io_error_without_lance_error_stays_io() {
 1332 |         // A plain io::Error (no wrapped lance Error) should become Error::IO.
 1333 |         let io_err = std::io::Error::new(std::io::ErrorKind::NotFound, "missing");
 1334 |         let converted: Error = io_err.into();
 1335 |         assert!(matches!(converted, Error::IO { .. }));
 1336 |     }
 1337 | 
 1338 |     #[test]
 1339 |     fn test_commit_status_unknown_is_structured_without_masking_as_not_found() {
 1340 |         let error = Error::commit_status_unknown_source(
 1341 |             42,
 1342 |             box_error(Error::not_found("temporarily invisible manifest")),
 1343 |         );
 1344 | 
 1345 |         assert!(error.is_commit_status_unknown());
 1346 |         assert!(!error.is_not_found());
 1347 |         assert!(error.to_string().contains("version 42 is unknown"));
 1348 |         let Error::Wrapped { error, .. } = error else {
 1349 |             panic!("commit-status-unknown must use the semver-compatible wrapper")
 1350 |         };
 1351 |         let status = error
 1352 |             .downcast_ref::<CommitStatusUnknownError>()
 1353 |             .expect("wrapper must retain the typed commit status");
 1354 |         assert_eq!(status.version(), 42);
 1355 |     }
 1356 | 
 1357 |     #[test]
 1358 |     fn test_external_error_creation() {
 1359 |         let custom_err = MyCustomError {
 1360 |             code: 42,
 1361 |             message: "test error".to_string(),
 1362 |         };
 1363 |         let err = Error::external(Box::new(custom_err));
 1364 | 
 1365 |         match &err {
 1366 |             Error::External { source } => {
 1367 |                 let recovered = source.downcast_ref::<MyCustomError>().unwrap();
 1368 |                 assert_eq!(recovered.code, 42);
 1369 |                 assert_eq!(recovered.message, "test error");
 1370 |             }
 1371 |             _ => panic!("Expected External variant"),
 1372 |         }
 1373 |     }
 1374 | 
 1375 |     #[test]
 1376 |     fn test_external_source_method() {
 1377 |         let custom_err = MyCustomError {
 1378 |             code: 123,
 1379 |             message: "source test".to_string(),
 1380 |         };
 1381 |         let err = Error::external(Box::new(custom_err));
 1382 | 
 1383 |         let source = err.external_source().expect("should have external source");
 1384 |         let recovered = source.downcast_ref::<MyCustomError>().unwrap();
 1385 |         assert_eq!(recovered.code, 123);
 1386 | 
 1387 |         // Test that non-External variants return None
 1388 |         let io_err = Error::io("test");
 1389 |         assert!(io_err.external_source().is_none());
 1390 |     }
 1391 | 
 1392 |     #[test]
 1393 |     fn test_into_external_method() {
 1394 |         let custom_err = MyCustomError {
 1395 |             code: 456,
 1396 |             message: "into test".to_string(),
 1397 |         };
 1398 |         let err = Error::external(Box::new(custom_err));
 1399 | 
 1400 |         match err.into_external() {
 1401 |             Ok(source) => {
 1402 |                 let recovered = source.downcast::<MyCustomError>().unwrap();
 1403 |                 assert_eq!(recovered.code, 456);
 1404 |             }
 1405 |             Err(_) => panic!("Expected Ok"),
 1406 |         }
 1407 | 
 1408 |         // Test that non-External variants return Err(self)
 1409 |         let io_err = Error::io("test");
 1410 |         match io_err.into_external() {
 1411 |             Err(Error::IO { .. }) => {}
 1412 |             _ => panic!("Expected Err with IO variant"),
 1413 |         }
 1414 |     }
 1415 | 
 1416 |     #[test]
 1417 |     fn test_arrow_external_error_conversion() {
 1418 |         let custom_err = MyCustomError {
 1419 |             code: 789,
 1420 |             message: "arrow test".to_string(),
 1421 |         };
 1422 |         let arrow_err = ArrowError::ExternalError(Box::new(custom_err));
 1423 |         let lance_err: Error = arrow_err.into();
 1424 | 
 1425 |         match lance_err {
 1426 |             Error::External { source } => {
 1427 |                 let recovered = source.downcast_ref::<MyCustomError>().unwrap();
 1428 |                 assert_eq!(recovered.code, 789);
 1429 |             }
 1430 |             _ => panic!("Expected External variant, got {:?}", lance_err),
 1431 |         }
 1432 |     }
 1433 | 
 1434 |     #[test]
 1435 |     fn test_external_to_arrow_roundtrip() {
 1436 |         let custom_err = MyCustomError {
 1437 |             code: 999,
 1438 |             message: "roundtrip".to_string(),
 1439 |         };
 1440 |         let lance_err = Error::external(Box::new(custom_err));
 1441 |         let arrow_err: ArrowError = lance_err.into();
 1442 | 
 1443 |         match arrow_err {
 1444 |             ArrowError::ExternalError(source) => {
 1445 |                 let recovered = source.downcast_ref::<MyCustomError>().unwrap();
 1446 |                 assert_eq!(recovered.code, 999);
 1447 |             }
 1448 |             _ => panic!("Expected ExternalError variant"),
 1449 |         }
 1450 |     }
 1451 | 
 1452 |     #[cfg(feature = "datafusion")]
 1453 |     #[test]
 1454 |     fn test_datafusion_schema_error_is_invalid_input() {
 1455 |         // Schema errors from DataFusion (e.g., a filter referencing an unknown
 1456 |         // column) are user-input failures, not internal lance failures. They
 1457 |         // must surface as `Error::InvalidInput` so downstream FFI/Python
 1458 |         // bindings can map them to the right user-facing error code.
 1459 |         use datafusion_common::Column;
 1460 | 
 1461 |         let schema_err = datafusion_common::SchemaError::FieldNotFound {
 1462 |             field: Box::new(Column::from_name("missing_col")),
 1463 |             valid_fields: vec![],
 1464 |         };
 1465 |         let df_err =
 1466 |             datafusion_common::DataFusionError::SchemaError(Box::new(schema_err), Box::new(None));
 1467 |         let lance_err: Error = df_err.into();
 1468 | 
 1469 |         match lance_err {
 1470 |             Error::InvalidInput { .. } => {
 1471 |                 assert!(
 1472 |                     lance_err.to_string().contains("missing_col"),
 1473 |                     "expected the column name to survive in the error message, got: {lance_err}"
 1474 |                 );
 1475 |             }
 1476 |             _ => panic!("Expected InvalidInput variant, got {:?}", lance_err),
 1477 |         }
 1478 |     }
 1479 | 
 1480 |     /// DataFusion wraps errors to attach end-user context (`Diagnostic`), a
 1481 |     /// description of what was running (`Context`), or to report several at
 1482 |     /// once (`Collection`). All three are display-transparent, so a wrapped
 1483 |     /// user error looks exactly like an unwrapped one but would be classified
 1484 |     /// as an internal failure if the conversion matched on the wrapper.
 1485 |     #[cfg(feature = "datafusion")]
 1486 |     #[rstest::rstest]
 1487 |     #[case::diagnostic(|inner| datafusion_common::DataFusionError::Diagnostic(
 1488 |         Box::new(datafusion_common::Diagnostic::new_error("invalid function", None)),
 1489 |         Box::new(inner),
 1490 |     ))]
 1491 |     #[case::context(|inner| datafusion_common::DataFusionError::Context(
 1492 |         "type_coercion".to_string(),
 1493 |         Box::new(inner),
 1494 |     ))]
 1495 |     #[case::collection(|inner| datafusion_common::DataFusionError::Collection(vec![inner]))]
 1496 |     #[case::nested(|inner| datafusion_common::DataFusionError::Diagnostic(
 1497 |         Box::new(datafusion_common::Diagnostic::new_error("invalid function", None)),
 1498 |         Box::new(datafusion_common::DataFusionError::Context(
 1499 |             "type_coercion".to_string(),
 1500 |             Box::new(inner),
 1501 |         )),
 1502 |     ))]
 1503 |     fn test_datafusion_wrapped_plan_error_is_invalid_input(
 1504 |         #[case] wrap: fn(datafusion_common::DataFusionError) -> datafusion_common::DataFusionError,
 1505 |     ) {
 1506 |         let df_err = wrap(datafusion_common::DataFusionError::Plan(
 1507 |             "Invalid function 'no_such_function'".to_string(),
 1508 |         ));
 1509 |         let lance_err = Error::from(df_err);
 1510 | 
 1511 |         assert!(
 1512 |             matches!(lance_err, Error::InvalidInput { .. }),
 1513 |             "expected InvalidInput, got {lance_err:?}"
 1514 |         );
 1515 |         assert!(
 1516 |             lance_err.to_string().contains("no_such_function"),
 1517 |             "expected the function name to survive, got: {lance_err}"
 1518 |         );
 1519 |     }
 1520 | 
 1521 |     /// Unwrapping must classify by the inner error rather than assume the
 1522 |     /// wrapper always hides a user error.
 1523 |     #[cfg(feature = "datafusion")]
 1524 |     #[test]
 1525 |     fn test_datafusion_wrapped_internal_error_is_not_invalid_input() {
 1526 |         let df_err = datafusion_common::DataFusionError::Context(
 1527 |             "while running".to_string(),
 1528 |             Box::new(datafusion_common::DataFusionError::Internal(
 1529 |                 "invariant violated".to_string(),
 1530 |             )),
 1531 |         );
 1532 | 
 1533 |         assert!(
 1534 |             matches!(Error::from(df_err), Error::IO { .. }),
 1535 |             "an internal DataFusion failure must not be reported as user input"
 1536 |         );
 1537 |     }
 1538 | 
 1539 |     /// A Lance error that round-trips through DataFusion keeps its own
 1540 |     /// category even when DataFusion wraps it on the way back.
 1541 |     #[cfg(feature = "datafusion")]
 1542 |     #[test]
 1543 |     fn test_wrapped_external_lance_error_keeps_its_category() {
 1544 |         let df_err = datafusion_common::DataFusionError::Context(
 1545 |             "while scanning".to_string(),
 1546 |             Box::new(datafusion_common::DataFusionError::from(Error::io(
 1547 |                 "object store unavailable",
 1548 |             ))),
 1549 |         );
 1550 | 
 1551 |         match Error::from(df_err) {
 1552 |             Error::IO { source, .. } => assert!(
 1553 |                 source.to_string().contains("object store unavailable"),
 1554 |                 "expected the original message, got: {source}"
 1555 |             ),
 1556 |             other => panic!("expected the original IO error, got {other:?}"),
 1557 |         }
 1558 |     }
 1559 | 
 1560 |     #[cfg(feature = "datafusion")]
 1561 |     #[test]
 1562 |     fn test_datafusion_external_error_conversion() {
 1563 |         let custom_err = MyCustomError {
 1564 |             code: 111,
 1565 |             message: "datafusion test".to_string(),
 1566 |         };
 1567 |         let df_err = datafusion_common::DataFusionError::External(Box::new(custom_err));
 1568 |         let lance_err: Error = df_err.into();
 1569 | 
 1570 |         match lance_err {
 1571 |             Error::External { source } => {
 1572 |                 let recovered = source.downcast_ref::<MyCustomError>().unwrap();
 1573 |                 assert_eq!(recovered.code, 111);
 1574 |             }
 1575 |             _ => panic!("Expected External variant"),
 1576 |         }
 1577 |     }
 1578 | 
 1579 |     #[cfg(feature = "datafusion")]
 1580 |     #[test]
 1581 |     fn test_datafusion_arrow_external_error_conversion() {
 1582 |         // Test the nested case: ArrowError::ExternalError inside DataFusionError::ArrowError
 1583 |         let custom_err = MyCustomError {
 1584 |             code: 222,
 1585 |             message: "nested test".to_string(),
 1586 |         };
 1587 |         let arrow_err = ArrowError::ExternalError(Box::new(custom_err));
 1588 |         let df_err = datafusion_common::DataFusionError::ArrowError(Box::new(arrow_err), None);
 1589 |         let lance_err: Error = df_err.into();
 1590 | 
 1591 |         match lance_err {
 1592 |             Error::External { source } => {
 1593 |                 let recovered = source.downcast_ref::<MyCustomError>().unwrap();
 1594 |                 assert_eq!(recovered.code, 222);
 1595 |             }
 1596 |             _ => panic!("Expected External variant, got {:?}", lance_err),
 1597 |         }
 1598 |     }
 1599 | 
 1600 |     /// Test that lance_core::Error round-trips through ArrowError.
 1601 |     ///
 1602 |     /// This simulates the case where a user defines an iterator in terms of
 1603 |     /// lance_core::Error, and the error goes through Arrow's error type
 1604 |     /// (e.g., via RecordBatchIterator) before being converted back.
 1605 |     #[test]
 1606 |     fn test_lance_error_roundtrip_through_arrow() {
 1607 |         let original = Error::invalid_input("test validation error");
 1608 | 
 1609 |         // Simulate what happens when using ? in an Arrow context
 1610 |         let arrow_err: ArrowError = original.into();
 1611 | 
 1612 |         // Convert back to lance error (as happens when Lance consumes the stream)
 1613 |         let recovered: Error = arrow_err.into();
 1614 | 
 1615 |         // Should get back the original lance error directly (not wrapped in External)
 1616 |         match recovered {
 1617 |             Error::InvalidInput { .. } => {
 1618 |                 assert!(recovered.to_string().contains("test validation error"));
 1619 |             }
 1620 |             _ => panic!("Expected InvalidInput variant, got {:?}", recovered),
 1621 |         }
 1622 |     }
 1623 | 
 1624 |     /// Test that lance_core::Error round-trips through DataFusionError.
 1625 |     ///
 1626 |     /// This simulates the case where a user defines a stream in terms of
 1627 |     /// lance_core::Error, and the error goes through DataFusion's error type
 1628 |     /// (e.g., via SendableRecordBatchStream) before being converted back.
 1629 |     #[cfg(feature = "datafusion")]
 1630 |     #[test]
 1631 |     fn test_lance_error_roundtrip_through_datafusion() {
 1632 |         let original = Error::invalid_input("test validation error");
 1633 | 
 1634 |         // Simulate what happens when using ? in a DataFusion context
 1635 |         let df_err: datafusion_common::DataFusionError = original.into();
 1636 | 
 1637 |         // Convert back to lance error (as happens when Lance consumes the stream)
 1638 |         let recovered: Error = df_err.into();
 1639 | 
 1640 |         // Should get back the original lance error directly (not wrapped in External)
 1641 |         match recovered {
 1642 |             Error::InvalidInput { .. } => {
 1643 |                 assert!(recovered.to_string().contains("test validation error"));
 1644 |             }
 1645 |             _ => panic!("Expected InvalidInput variant, got {:?}", recovered),
 1646 |         }
 1647 |     }
 1648 | 
 1649 |     /// Test that a typed error survives a multiply-owned `DataFusionError::Shared`.
 1650 |     ///
 1651 |     /// When DataFusion fans one error out to multiple consumers via `Arc`, we
 1652 |     /// cannot move the inner error out.  The typed source must still be
 1653 |     /// reachable after conversion to `lance_core::Error`.
 1654 |     #[cfg(feature = "datafusion")]
 1655 |     #[test]
 1656 |     fn test_datafusion_shared_multi_owner_preserves_type() {
 1657 |         let custom_err = MyCustomError {
 1658 |             code: 42,
 1659 |             message: "shared typed error".to_string(),
 1660 |         };
 1661 |         let marker = datafusion_common::DataFusionError::External(Box::new(custom_err));
 1662 |         // Put it in an Arc and keep a second owner so try_unwrap fails.
 1663 |         let arc = std::sync::Arc::new(marker);
 1664 |         let _arc2 = arc.clone();
 1665 |         let shared = datafusion_common::DataFusionError::Shared(arc);
 1666 | 
 1667 |         let lance_err: Error = shared.into();
 1668 | 
 1669 |         // The concrete error must be discoverable via source chain.
 1670 |         let mut found = false;
 1671 |         let mut src: Option<&dyn std::error::Error> = Some(&lance_err);
 1672 |         while let Some(e) = src {
 1673 |             if e.downcast_ref::<MyCustomError>().is_some() {
 1674 |                 found = true;
 1675 |                 break;
 1676 |             }
 1677 |             src = e.source();
 1678 |         }
 1679 |         assert!(
 1680 |             found,
 1681 |             "MyCustomError not found in source chain: {lance_err:?}"
 1682 |         );
 1683 |     }
 1684 | 
 1685 |     #[test]
 1686 |     fn test_backtrace_accessor() {
 1687 |         // Verify that backtrace() returns the expected result based on feature state
 1688 |         let err = Error::io("test backtrace");
 1689 |         let bt = err.backtrace();
 1690 |         #[cfg(feature = "backtrace")]
 1691 |         {
 1692 |             // With the backtrace feature enabled, whether a backtrace is captured
 1693 |             // depends on the RUST_BACKTRACE env var at runtime. We just verify
 1694 |             // the accessor doesn't panic and returns a valid Option.
 1695 |             let _ = bt;
 1696 |         }
 1697 |         #[cfg(not(feature = "backtrace"))]
 1698 |         {
 1699 |             // Without the backtrace feature, this must always be None.
 1700 |             assert!(bt.is_none());
 1701 |         }
 1702 |     }
 1703 | 
 1704 |     #[test]
 1705 |     fn test_backtrace_captured_when_feature_enabled() {
 1706 |         // Test that backtrace is actually captured when the feature is on and
 1707 |         // RUST_BACKTRACE=1 is set in the environment before the process starts.
 1708 |         //
 1709 |         // NOTE: std::backtrace::Backtrace caches the RUST_BACKTRACE env check,
 1710 |         // so set_var at runtime does not reliably enable capture. This test
 1711 |         // verifies the accessor works correctly in both cases:
 1712 |         // - If RUST_BACKTRACE=1 was set before the test binary started, we get Some.
 1713 |         // - If not, we get None (even with the feature on), which is expected.
 1714 |         #[cfg(feature = "backtrace")]
 1715 |         {
 1716 |             let err = Error::io("backtrace capture test");
 1717 |             if std::env::var("RUST_BACKTRACE").is_ok() {
 1718 |                 assert!(
 1719 |                     err.backtrace().is_some(),
 1720 |                     "Expected a backtrace when RUST_BACKTRACE=1 and backtrace feature is enabled"
 1721 |                 );
 1722 |             }
 1723 |             // When RUST_BACKTRACE is not set, backtrace() may return None even
 1724 |             // with the feature enabled — this is correct runtime gating behavior.
 1725 |         }
 1726 |         #[cfg(not(feature = "backtrace"))]
 1727 |         {
 1728 |             let err = Error::io("backtrace capture test");
 1729 |             assert!(err.backtrace().is_none());
 1730 |         }
 1731 |     }
 1732 | 
 1733 |     #[test]
 1734 |     fn test_backtrace_returns_none_for_variants_without_location() {
 1735 |         let err = Error::InvalidTableLocation {
 1736 |             message: "test".to_string(),
 1737 |         };
 1738 |         assert!(err.backtrace().is_none());
 1739 | 
 1740 |         let err = Error::InvalidRef {
 1741 |             message: "test".to_string(),
 1742 |         };
 1743 |         assert!(err.backtrace().is_none());
 1744 | 
 1745 |         let err = Error::Stop;
 1746 |         assert!(err.backtrace().is_none());
 1747 |     }
 1748 | }
``````
