> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-table/src/io/commit.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `c6d37042a8732b89d728a1ae13dbea1285ad6cefa4a3fe6109f9b2b5a5b99ebb`. Reviewed physical lines: 1-2490.

[Module](../../../../../L1-modules/rust-lance-table-commit.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Manifest naming, listing/latest/version resolution, version-hint optimization, backend routing, commit policy extension traits and concrete unsafe/lease/rename/conditional publication. Owns single-version publication and resolver policy hooks; dataset operation conflict resolution, retry/cleanup, predecessor-capable external stores and underlying atomic IO remain separate. (rust/lance-table/src/io/commit.rs:1-2490)

## Complete range analysis

### Lines 1-24

SPDX/module docs define commit as publication of next manifest exactly once across concurrent writers and introduce CommitHandler/CommitLock. Their default-handler statements are comments to compare against actual routing below, not independently current backend guarantees; full store atomicity is outside this file. (rust/lance-table/src/io/commit.rs:1-24)

### Lines 25-69

Imports async streams/futures, Arc/AtomicBool/local DirEntry, manifest body writer, ObjectWriter/WriteResult/get_etag, underlying object-store APIs, tracing/log and URL. Canonical footer constants come from lance_file::format, not table format facade. external_manifest module always public; dynamodb child and AWS credentials/config helpers gated on feature dynamodb. (rust/lance-table/src/io/commit.rs:25-69)

### Lines 70-90

Public VERSIONS_DIR is _versions. Private extension manifest, detached prefix d and hint filename latest_version_hint.json. Public Copy/Eq ManifestNamingScheme has V1 and V2. V2 doc says _manifests, but manifest_path below uses _versions for both; zero-padding/inversion optimize lexically ordered listing, distinct from Lance data-file format version. (rust/lance-table/src/io/commit.rs:70-90)

### Lines 91-113

Public manifest_path borrows scheme/base and accepts u64. Detached-bit versions always become base/_versions/d{version}.manifest independent of scheme; attached V1 uses decimal version, V2 uses u64MAX-version padded to20 digits. No IO or version allocation. Lexical detached separation is naming, not visibility/commit validation. (rust/lance-table/src/io/commit.rs:91-113)

### Lines 114-137

parse_version parses digits before first dot without checking remaining suffix; V1 returns raw number, V2 subtracts from u64MAX. d-prefixed names fail ordinary numeric parse. parse_detached_version requires leading d and parses number before first dot, but does not enforce extension or set/check detached mask despite doc saying returned number has mask. Malformed parse returnsNone. (rust/lance-table/src/io/commit.rs:114-137)

### Lines 138-164

detect_scheme returnsV2 for any leading d without validating suffix or digits; otherwise requires ends_with(manifest), classifies byte length20+1+extension length asV2 and every other length asV1. detect_scheme_staging uses character index20 equals dot elseV1, without parse/extension/mask validation. These are naming heuristics, not robust file validators. (rust/lance-table/src/io/commit.rs:138-164)

### Lines 165-186

Public async migrate_scheme_to_v2 docs require quiescent store and completion before other work; list underlying base/_versions and retain locations with filename classifiedV1. Does not validate numeric version during filtering or wrap operation in atomic directory transaction. (rust/lance-table/src/io/commit.rs:165-186)

### Lines 187-198

Migration processes retained entries concurrently up to object_store.io_parallelism, unwraps filename and V1 numeric parse, builds V2 path and calls unconditional inner.rename. Malformed classifier-accepted numeric name can panic; individual rename errors propagate after prior/concurrent renames may succeed. Idempotency documented for valid complete migration, not rollback of partial work; no hint or external-index update here. (rust/lance-table/src/io/commit.rs:187-198)

### Lines 199-230

Public ManifestWriter is higher-ranked fn borrowing ObjectStore/Manifest/Path and owning optional indices/transaction, returning BoxFuture<Result<WriteResult>> (not merely size as comment says). Public canonical write_manifest_file_to_path returns a boxed async future: await ObjectWriter construction, body serialization, footer using lance-file constants, shutdown, then audit create and return result. Body mutations/bytes precede later failures; no cleanup/arbitration in this writer. (rust/lance-table/src/io/commit.rs:199-230)

### Lines 231-264

Public Clone/Debug ManifestLocation exposes version,path,size,naming_scheme,e_tag,identity. Path doc says relative root but functions construct supplied-base-qualified paths. SizeNone means unknown. ETag is opaque physical generation, explicitly not content/logical/dataset incarnation identity; None proves no sameness. identity is a distinct optional external-store manifest-record incarnation token. Generic external workflow does not persist/validate ETag; the complete child implementation is covered at rust/lance-table/src/io/commit/external_manifest.rs:1-2553. (rust/lance-table/src/io/commit.rs:231-264)

### Lines 265-288

TryFrom<ObjectMeta> requires filename, detected scheme and numeric parse, mapping failures to Internal with filename context. Moves path/ETag, stores Some(size), sets identityNone. d-prefixed detached metadata fails numeric parse even though detect_scheme returnsV2; detached converter is separate. No manifest bytes or version field consistency is read. (rust/lance-table/src/io/commit.rs:265-288)

### Lines 289-314

Private async current_manifest_path first tries synchronous current_manifest_local only for direct local paths; only Ok(Some) returns, with errors/None silently falling through. Because hint is else-if, direct-local failure bypasses hint entirely. Other stores consult hint only if uses_version_hint; success returns, otherwise full listing. Local optimization does blocking filesystem work inline in async caller. (rust/lance-table/src/io/commit.rs:289-314)

### Lines 315-336

Private serde VersionHint contains u64version only. Environment name LANCE_USE_VERSION_HINT is parsed once process-wide via function-local OnceLock: trimmed ASCII-lowercased 0/false/off disable; all other strings or env errors (including non-Unicode) enable. Docs mention0/false but implementation alsooff. Changes after first lookup have no effect. (rust/lance-table/src/io/commit.rs:315-336)

### Lines 337-354

Public uses_version_hint combines cached global enable with !list_is_lexically_ordered; storage kind names are explanatory examples, not actual routing predicates. Private hint path is base/_versions/latest_version_hint.json. (rust/lance-table/src/io/commit.rs:337-354)

### Lines 355-372

Public async write_version_hint no-ops for detached or nonbenefiting stores. Serialize VersionHint toVec with expect, then ordinary object_store.put; write error logs warn and is swallowed. No monotonic CAS: concurrent/out-of-order commits can overwrite hint with older version. Correctness relies on verified upward probes and fallback assumptions, not hint durability. No Result return. (rust/lance-table/src/io/commit.rs:355-372)

### Lines 373-386

read_version_from_hint full inner.get plus bytes then serde parse, converting all GET/body/JSON errors toNone. Returns any decodedu64 without mask/range validation, HEAD or freshness checks; caller decides fallback. Entire small-but-unbounded object is buffered. (rust/lance-table/src/io/commit.rs:373-386)

### Lines 387-411

read_version_hint_and_probe reads hint, calls upward probe and suppresses every error/None. Pops last collected pair and constructs location with scheme-generated path, metadata size/ETag and identityNone. Latest lookup retains all probed metadata though only last needed; no hint refresh here. (rust/lance-table/src/io/commit.rs:387-411)

### Lines 412-443

MAX_HINT_PROBE_GAP=1000 gates the later since-version path, not all upward probing. Probe docs assume attached versions contiguous above start and cleanup removes only old versions; first missing ends history, errors invalidate result. Private async probe returns optional(latest,scheme,Vec(version,ObjectMeta)); no explicit bound/mask check in signature. (rust/lance-table/src/io/commit.rs:412-443)

### Lines 444-466

Probe HEADs V2 path at starting version, falls back toV1 only on NotFound, returnsNone only when both missing. Other errors propagate. Chosen scheme remains fixed for subsequent probes; if both schemes exist V2 wins and no mixed-scheme validation occurs. Detached input maps to same d path in both attempts. (rust/lance-table/src/io/commit.rs:444-466)

### Lines 467-489

Store initial metadata, then sequentially HEAD version+1 in chosen scheme until NotFound; success appends metadata and advances, other errors propagate discarding local collected result. Ordinary u64 increment may overflow; crossing attached/detached boundary not guarded. Work/memory linear in successful range; no concurrency or 1000 cap here. Gaps can hide later versions under documented contiguity assumption. (rust/lance-table/src/io/commit.rs:467-489)

### Lines 490-526

Private since-hint reader returnsNone if hint unavailable or hint.saturating_sub(since)>1000. Starts at hint if newer, otherwise since+1. Missing newer hint triggers listing fallback; missing since+1 yields Some(empty). Any probe error falls back. Ordinary since+1 unchecked, and threshold limits initial backward gap only, not stale-hint upward distance. (rust/lance-table/src/io/commit.rs:490-526)

### Lines 527-540

Map probed entries newer than since into locations carrying scheme-generated path, size/ETag and identityNone; retain a Vec of all observed metadata. No byte reads or commit identity resolution. (rust/lance-table/src/io/commit.rs:527-540)

### Lines 541-572

If hint>since+1, fill intervening versions by HEAD in chosen scheme with buffer_unordered(io_parallelism); any error including NotFound yieldsNone for full fallback. On success append gap locations then sort descendingversion. This materializes all results and repeats requests on fallback; no minimum1 normalization shown. Local no-missing assumption does not inspect unprobed other scheme. (rust/lance-table/src/io/commit.rs:541-572)

### Lines 573-593

resolve_version_from_listing lists base/_versions through wrapper and filters names using detect_scheme plus successful numeric parse, skipping detached and invalid names. filename unwrap assumes list entries always have filenames; listing errors propagate. Hint JSON/temp names filter out. (rust/lance-table/src/io/commit.rs:573-593)

### Lines 594-618

Take first valid manifest. If schemeV2 and store advertises lexical ordering, return immediately with actual listed path/size/ETag and identityNone. Deliberately avoids checking remaining pages/scheme uniformity, assuming all manifests useV2. Thus mixed-name validation is absent on this fast path and later listing errors are unobserved. (rust/lance-table/src/io/commit.rs:594-618)

### Lines 619-658

Otherwise scan every valid entry, requiring same naming scheme or Internal error with migration instruction. Track highest numericversion; equalversion preserves earlier metadata. Return stored actual path/size/ETag, identityNone; zero valid entries =>NotFound(base/_versions). Stream errors abort, not best-effort partial latest. (rust/lance-table/src/io/commit.rs:619-658)

### Lines 659-694

Private current_manifest_local converts base/_versions to local path, synchronously read_dir and scans entries without per-entry metadata initially. Lossy filename conversion then scheme detection; scheme consistency is checked before numeric parse, so even d-prefixed unparseable names can establish/conflict with scheme. Entry/read-dir or mixed-scheme errors propagate as io errors to caller, which may fall back to listing. (rust/lance-table/src/io/commit.rs:659-694)

### Lines 695-722

Local scan skips failed numeric parse, retains strictly largestversion, then loads metadata only for chosen entry. Returns scheme-generated path rather than observed filename path, Some(len), get_etag(metadata) and identityNone. No file-type check; classifier-accepted directory or noncanonical name can select a reconstructed path. Empty=>Ok(None); chosen metadata failure propagates. (rust/lance-table/src/io/commit.rs:695-722)

### Lines 723-738

Private list_manifests streams read_dir_all and silently drops metadata-to-location conversion errors by ok(), while storage errors survive transpose. Returned boxed stream is not sorted here, does not validate uniform naming or read bytes, and excludes detached numeric parse failures. (rust/lance-table/src/io/commit.rs:723-738)

### Lines 739-754

Private detached converter requires filename and parse_detached_version only, moves actualpath/ETag, sets Some(size), namingV2 and identityNone. Because parser only checks d+number+dot, neither extension nor detached mask is enforced. (rust/lance-table/src/io/commit.rs:739-754)

### Lines 755-771

Public list_detached_manifests streams read_dir_all, maps detached converter, drops unrecognized names while preserving store errors through transpose. No sorting, payload validation, deduplication, identity lookup or mask check beyond converter. (rust/lance-table/src/io/commit.rs:755-771)

### Lines 772-780

Crate-visible make_staging_manifest_path generates UUIDv4, appends hyphenUUID to supplied base string, parsesPath and maps parse error to IO source; no filesystem creation or reservation. Under dynamodb feature private URL query key is exactly ddbTableName. Following doc introduces object-store resolver boundary. (rust/lance-table/src/io/commit.rs:772-780)

### Lines 781-799

Crate-visible default_list_manifest_locations returns the underlying boxed stream immediately when sorted_descending is false. Nested sort_stream collects every entry, propagates the first error, sorts by Reverse(version), and emits an owned stream. Memory scales with metadata entries, not manifest bytes. (rust/lance-table/src/io/commit.rs:781-799)

### Lines 800-834

Sorted lexical stores peek the first result: V2 passes the remaining stream through; empty or error also selects this branch so the original error remains streamed. First V1 collects and sorts. Nonlexical stores always collect and sort. No mixed-scheme validation occurs here; the optimized order assumes the first scheme applies throughout. (rust/lance-table/src/io/commit.rs:800-834)

### Lines 835-866

Crate-visible since-version default without hints uses descending listing and try_take_while(version > since), stopping at the first older or equal version. With hints it clones the base into a lazy future, accepts Some locations or falls back to collecting all ordinary listings, filtering and sorting. Once/try_flatten exposes the resulting stream; IO errors propagate. (rust/lance-table/src/io/commit.rs:835-866)

### Lines 867-899

Public async_trait CommitHandler requires Debug + Send + Sync. All concurrent writers must use the same handler type by contract. Defaults are is_version_not_found_definitive=false and propagate_commit_error_after_success=true, protecting cleanup under delayed visibility and preserving custom-handler errors after matching readback. These hooks do not themselves implement readback. (rust/lance-table/src/io/commit.rs:867-899)

### Lines 900-916

Default async resolve_latest_location delegates current_manifest_path; resolve_version_location delegates default_resolve_version using the underlying store. Neither decodes manifest bytes. The exact-version resolver can return an unproven fallback path. (rust/lance-table/src/io/commit.rs:900-916)

### Lines 917-936

Default version_exists HEADs the path from the supplied scheme: success yields true, NotFound false, other errors propagate. Although documented for attached versions, it does not reject detached input. It does not try another naming scheme or external authority; such handlers must override it. (rust/lance-table/src/io/commit.rs:917-936)

### Lines 937-962

Default detached listing delegates the public detached stream in arbitrary order. Default attached listing delegates the sorted/unsorted helper. Returned streams borrow the store and own needed path state. There is no implicit external authority lookup. (rust/lance-table/src/io/commit.rs:937-962)

### Lines 963-993

Default list_manifest_locations_since delegates the hint-aware helper. Required commit mutably borrows Manifest, owns optional indices/transaction, and receives base/store/function-pointer writer/scheme. It returns Result<ManifestLocation, CommitError>; existing versions should produce CommitConflict by contract. The trait does not enforce atomicity or callback behavior. (rust/lance-table/src/io/commit.rs:963-993)

### Lines 994-1019

Predecessor hooks default to unsupported: supports_predecessor_condition=false; async latest and specific identity queries return Ok(None) without IO. None means no supplied identity, not a zero version or token. (rust/lance-table/src/io/commit.rs:994-1019)

### Lines 1020-1056

commit_after requires reservation conditioned on predecessor identity, with mismatch PrerequisiteFailed rather than conflict. Its default returns OtherError(NotSupported) without invoking the writer. Default forget_version and delete are async no-ops; neither deletes manifest objects. Identity-conditional retirement is an implementer obligation. (rust/lance-table/src/io/commit.rs:1020-1056)

### Lines 1057-1075

For detached input, default_resolve_version returns a deterministic d path with V2 and unknown size/ETag/identity without any existence check. A successful location result does not prove an object exists. (rust/lance-table/src/io/commit.rs:1057-1075)

### Lines 1076-1102

For attached input, HEAD only the V2 path. Success returns size/ETag with identity None. V2 NotFound returns a V1 path with unknown size and ETag without HEADing V1; other errors propagate. Later byte reads establish fallback existence. (rust/lance-table/src/io/commit.rs:1076-1102)

### Lines 1103-1138

DynamoDB-only OSObjectStoreToAwsCredAdaptor implements ProvideCredentials. Each future fetches provider credentials, maps errors, and creates AWS credentials with copied key/secret, cloned token, artificial expiry now+600 seconds via checked_add.expect, and empty provider name. Actual provider expiry is not preserved here. No credential values are logged. (rust/lance-table/src/io/commit.rs:1103-1138)

### Lines 1139-1170

DynamoDB builder configures latest SDK behavior, supplied region/credentials, no identity cache because the provider owns caching, and standard retry max_attempts=5 including the initial request. An optional endpoint overrides the SDK endpoint. It builds a Client and awaits child new_external_store. Child schema validation, request construction and result/error handling are now covered at rust/lance-table/src/io/commit/dynamodb.rs:162-513; no remote service was exercised. (rust/lance-table/src/io/commit.rs:1139-1170)

### Lines 1171-1198

Public commit_handler_from_url chooses Rename locally on Windows and ConditionalPut otherwise. Parse failure or a Windows single-character scheme returns local. file/file-object-store use local; s3, gs, az, abfss, memory, oss, tos, shared-memory and goosefs use ConditionalPut; cos uses TencentCosCommitHandler. This contradicts the module default-handler comments. Routing does not probe backend atomicity. (rust/lance-table/src/io/commit.rs:1171-1198)

### Lines 1199-1226

s3+ddb without the feature returns InvalidInput. With the feature, require exactly one query pair, ddbTableName, nonempty value, and both strings Cow::Borrowed. Decoding that produces owned key/value strings fails this pattern even if decoded text matches. Wrong count/key/ownership use the query diagnostic; an empty borrowed value has its own error. (rust/lance-table/src/io/commit.rs:1199-1226)

### Lines 1227-1264

For accepted DDB input, clone/default ObjectStoreParams; extract raw storage options, endpoint, S3 options, optional region, accessor and provider scheme; await credential construction with refresh offset and optional supplied credentials. Build ExternalManifestCommitHandler using app name lancedb. Delegated errors propagate. Every other parsed scheme chooses UnsafeCommitHandler. (rust/lance-table/src/io/commit.rs:1227-1264)

### Lines 1265-1273

DynamoDB endpoint lookup prefers raw option dynamodb_endpoint, including an empty string, over DYNAMODB_ENDPOINT. Missing or non-Unicode environment values become None. This environment lookup happens per invocation, unlike the cached hint setting. (rust/lance-table/src/io/commit.rs:1265-1273)

### Lines 1274-1297

Public Debug CommitError has CommitConflict and OtherError(Error). Converting from core Error wraps it. Converting back unwraps OtherError, but turns CommitConflict into Internal with text Commit conflict, losing the dedicated discriminant. No Display/Error implementation appears locally. (rust/lance-table/src/io/commit.rs:1274-1297)

### Lines 1298-1316

Global AtomicBool WARNED_ON_UNSAFE_COMMIT starts false. Public UnsafeCommitHandler advertises definitive NotFound and suppressible errors after successful readback. Its separate relaxed load/store warning guard below is not atomic test-and-set, so concurrent first uses may log more than once. (rust/lance-table/src/io/commit.rs:1298-1316)

### Lines 1317-1358

Unsafe commit warns as needed, computes final path, awaits injected writer directly there, writes the best-effort hint, and returns writer size/ETag with current manifest version and identity None. No lock, condition, staging or readback. Writer error skips the hint. A custom writer may mutate Manifest; the path was computed before that callback. Debug prints the unit type name. (rust/lance-table/src/io/commit.rs:1317-1358)

### Lines 1359-1388

Public CommitLock: Debug associates a CommitLease and asynchronously locks a version. Docs require waiting and returning conflict if already committed, and recommend at least 30 seconds of timeout; the trait supplies no TTL or fencing. CommitLease: Send + Sync releases with a success flag and should tolerate repeated calls because cancellation can trigger a later release(false). (rust/lance-table/src/io/commit.rs:1359-1388)

### Lines 1389-1423

Private LeaseGuard owns Option<L>. Its consuming explicit release keeps the lease inside the guard while awaiting, then clears the option even when release returns Err. Completed release errors get no background retry; cancellation while awaiting leaves ownership for Drop. The expect relies on private construction and the consuming method. (rust/lance-table/src/io/commit.rs:1389-1423)

### Lines 1424-1448

Drop takes the lease and, if a current Tokio handle exists, spawns release(false), ignoring its result without warning or join. Runtime shutdown may prevent completion. Without a runtime the lease is dropped; TTL recovery mentioned in comments is not enforced by the trait. Blanket CommitHandler for a Send+Sync CommitLock with static lease sets definitive NotFound=true but retains propagate-after-success=true. (rust/lance-table/src/io/commit.rs:1424-1448)

### Lines 1449-1483

Lock commit computes a path, awaits acquisition, then wraps the returned lease immediately. Under the lease, HEAD success releases(false) before returning conflict; NotFound proceeds; other HEAD errors release(false) before returning the error. Release failures take precedence through ?. Cancellation during acquisition has no guard yet and is the custom lock responsibility. (rust/lance-table/src/io/commit.rs:1449-1483)

### Lines 1484-1503

Await the writer under the lease and retain its Result. Release with res.is_ok() before unwrapping that result. A release error can mask a writer error or report failure after successful publication. Only successful write and release reach hint writing and the returned location. No renewal, fencing or CAS is implemented; safety depends on effective shared locking. (rust/lance-table/src/io/commit.rs:1484-1503)

### Lines 1504-1540

The Arc<T: CommitLock + Send + Sync> CommitHandler implementation forwards the definitive and propagation hooks plus commit arguments to the inner value. Other methods retain trait defaults. This is not a general Arc<dyn CommitHandler> adapter. (rust/lance-table/src/io/commit.rs:1504-1540)

### Lines 1541-1578

Public RenameCommitHandler requires atomic rename-if-absent by contract, sets definitive NotFound=true and propagate-after-success=false. Compute final and UUID staging paths, await the writer at staging, then invoke underlying rename_if_not_exists. Writer errors and cancellation have no cleanup guard here. (rust/lance-table/src/io/commit.rs:1541-1578)

### Lines 1579-1611

Rename success writes the hint and returns writer size but no ETag because renaming may change it. AlreadyExists tries deleting staging, ignores cleanup errors, and returns conflict. Other rename errors return OtherError without cleanup. Therefore the comment about cleaning up on failure is broader than implementation. Ambiguous transport outcomes need caller recovery. Debug prints the unit name. (rust/lance-table/src/io/commit.rs:1579-1611)

### Lines 1612-1647

Public ConditionalPutCommitHandler has definitive NotFound=true and propagate-after-success=false. It creates a fresh memory store, calls the injected writer at dummy, ignores its WriteResult, then reads all dummy bytes and derives actual size. Manifest mutations precede durable publication, and complete serialized bytes remain in memory. A callback that does not create dummy fails at readback. (rust/lance-table/src/io/commit.rs:1612-1647)

### Lines 1648-1678

Publish full bytes through inner.put_opts with PutMode::Create and default remaining options. AlreadyExists or Precondition maps to conflict; other errors map to OtherError. Success writes the hint and returns actual byte size and put ETag, identity None. No local retry, predecessor condition or incarnation protection. Atomicity depends on backend Create semantics; cancellation may leave an unknown outcome. (rust/lance-table/src/io/commit.rs:1648-1678)

### Lines 1679-1723

Conditional Debug prints its unit name. Private TencentCosCommitHandler documents bucket-versioning history as the reason conditional create is unsafe; this is source rationale, not live validation. It retains default reads/listings and definitive NotFound=true, while commit immediately returns NotSupported requesting a distributed Python commit_lock or custom Rust handler. No callback or storage invocation. Propagation policy remains the default true. (rust/lance-table/src/io/commit.rs:1679-1723)

### Lines 1724-1748

Public PredecessorIdentity derives Clone/Eq and stores version plus String identity; physical-incarnation uniqueness is a handler contract rather than type validation. Public CommitConfig has num_retries:u32 and skip_auto_cleanup:bool, defaulting to 20 and false. The isolation-level TODO has no field. This file declares configuration but does not run retry or cleanup loops. (rust/lance-table/src/io/commit.rs:1724-1748)

### Lines 1749-1781

Private test module imports synchronization counters, TempObjDir and ProxyObjectStore policy. Naming fixture checks attached versions 0/42 under V1 decimal and V2 inverted 20-digit filenames, both in base/_versions. No detached generation, staging detection or malformed names are tested here. (rust/lance-table/src/io/commit.rs:1749-1781)

### Lines 1782-1803

The naming fixture parses attached 0/42 and staged UUID-suffix variants under both schemes, detects ordinary V1/V2 names and rejects unrelated text. Parsing accepts suffix text after the first dot whereas detection is stricter. Mixed schemes and numeric overflow are not tested. (rust/lance-table/src/io/commit.rs:1782-1803)

### Lines 1804-1836

Migration memory fixture writes an irrelevant empty object, V1 version 0 and V2 version 1; its comment misstates the count/types. It migrates once and asserts the exact listed paths. No second invocation, concurrent rename, malformed name or collision case establishes idempotency or recovery. (rust/lance-table/src/io/commit.rs:1804-1836)

### Lines 1837-1872

Sorted-list matrix crosses lexical flag with V1/V2. Lexical uses memory; nonlexical uses a real local store and asserts its flag is false. Twelve empty manifest-named objects are written from 11 down to 0. Sorted handler listing must return exact paths in that order. No bytes are decoded. (rust/lance-table/src/io/commit.rs:1837-1872)

### Lines 1873-1899

Current-path matrix crosses lexical flag with V1/V2 but uses memory for both, avoiding the direct-local optimization. Shuffled versions 0 through 11 must resolve to version 11 with matching scheme/path. Changing the flag selects the algorithm without making memory listing physically unordered. (rust/lance-table/src/io/commit.rs:1873-1899)

### Lines 1900-1927

non_lexical_memory_store changes only the memory wrapper ordering flag. Hint-write fixture asserts no hint for lexical stores, then writes and reads 42 followed by 100 on the nonlexical wrapper. Tests depend on the cached global environment setting; no explicit override is installed. (rust/lance-table/src/io/commit.rs:1900-1927)

### Lines 1928-1948

Writing detached mask|7 must leave hint 100 unchanged. Replacing the hint with non-JSON bytes must read as None. Failed put warnings, backward overwrites, environment parsing and maximum version are not tested. (rust/lance-table/src/io/commit.rs:1928-1948)

### Lines 1949-1979

V1/V2 hint-probe matrix starts with missing hint None, creates versions 1 through 5, writes stale hint 3, and expects latest 5 with the chosen scheme. It assumes contiguous history and does not inject transport errors. (rust/lance-table/src/io/commit.rs:1949-1979)

### Lines 1980-1995

The probe fixture then writes hint 5 and expects latest 5; nonexistent future hint 10 returns None. It does not measure HEAD count or inspect generation tokens. (rust/lance-table/src/io/commit.rs:1980-1995)

### Lines 1996-2032

Since-hint fixture creates V2 versions 1 through 10. Missing hint returns None; hint 10 with since 10 gives Some(empty); since 7 gives descending [10,9,8], exercising gap filling. It asserts versions, not token values or concurrency limits. (rust/lance-table/src/io/commit.rs:1996-2032)

### Lines 2033-2051

The same since fixture writes stale hint 8 and still expects [10,9,8], then future hint 20 returns None. No threshold-above-1000, intermediate gap, hint-behind-since or overflow case appears here. (rust/lance-table/src/io/commit.rs:2033-2051)

### Lines 2052-2071

Nonlexical current-path fixture writes V2 versions 1 through 100 and hint 98, then expects version 100. This is memory-store simulation, not S3 Express performance or IO-count evidence. (rust/lance-table/src/io/commit.rs:2052-2071)

### Lines 2072-2089

Future-hint fallback fixture stores only V2 version 5 but hint 10; current_manifest_path must return 5. It does not count listing calls or inject HEAD/GET errors. (rust/lance-table/src/io/commit.rs:2072-2089)

### Lines 2090-2117

Detached parser fixture accepts d12345.manifest as Some(12345), explicitly without the detached mask, and also accepts d2^63. It rejects unprefixed decimal, ordinary V2 and a d-number with no dot. Thus parser/tests do not enforce the mask implied by documentation; alternate extensions and overflow remain untested. (rust/lance-table/src/io/commit.rs:2090-2117)

### Lines 2118-2143

Detached-list fixture writes regular V2 versions 1/2/3 and three d-prefixed versions mask|100/200/300 as empty objects. Detached names are constructed manually; no manifest payload is serialized. (rust/lance-table/src/io/commit.rs:2118-2143)

### Lines 2144-2162

Collect detached listing, require three results all marked V2, sort found and expected version vectors, then compare. Output order, paths, sizes, ETags and mask rejection are not asserted. (rust/lance-table/src/io/commit.rs:2144-2162)

### Lines 2163-2186

Nine URL cases memory/shared-memory/s3/gs/az/abfss/oss/tos/goosefs call the factory with no options and assert the ConditionalPutCommitHandler Debug name. They test routing only, not remote credentials, storage or atomic create. Local, unknown and DDB routing are absent from this fixture. (rust/lance-table/src/io/commit.rs:2163-2186)

### Lines 2187-2216

TrackingLock and TrackingLease share an AtomicBool. Lock returns immediately regardless of version; release ignores its success argument and stores true with SeqCst ordering. They track invocation but do not serialize writers or model TTL. (rust/lance-table/src/io/commit.rs:2187-2216)

### Lines 2217-2262

HangingReleaseLock/Lease share a call counter and released flag. The first release increments the counter then remains pending forever; later calls mark released. Success is ignored. This models cancellation during explicit release, not a real distributed lease. (rust/lance-table/src/io/commit.rs:2217-2262)

### Lines 2263-2292

succeeding_manifest_writer immediately returns default WriteResult without writing any object or mutating Manifest. test_manifest constructs nonnullable Int32 i, empty fragments/base paths and resolved Stable storage. The fake allows lease tests to reach release without proving publication. (rust/lance-table/src/io/commit.rs:2263-2292)

### Lines 2293-2319

COS fixture asserts factory Debug name, then calls commit with memory store, fake writer and V2. It requires OtherError(NotSupported) with distributed commit_lock in the message. It does not instrument callback invocation or qualify custom COS locking. (rust/lance-table/src/io/commit.rs:2293-2319)

### Lines 2320-2333

hanging_manifest_writer ignores every argument and returns a permanently pending future followed by unreachable code. No IO occurs; it models cancellation while the commit owns a lease. (rust/lance-table/src/io/commit.rs:2320-2333)

### Lines 2334-2363

First cancellation fixture creates TrackingLock and invokes commit with the hanging writer. A 50 ms timeout must expire. The missing-path HEAD precedes the writer, but no separate signal asserts which stage was reached. (rust/lance-table/src/io/commit.rs:2334-2363)

### Lines 2364-2376

After timeout, poll released up to 100 times with 10 ms sleeps and require true. This checks background release invocation under Tokio, not its success flag, TTL/fencing, no-runtime behavior or runtime shutdown. (rust/lance-table/src/io/commit.rs:2364-2376)

### Lines 2377-2409

Second cancellation fixture uses HangingReleaseLock and the successful fake writer, again requiring a 50 ms timeout. Explicit release(true) hangs on its first call; the fake writer has not actually published a manifest. (rust/lance-table/src/io/commit.rs:2377-2409)

### Lines 2410-2428

Poll the released flag up to 100 times at 10 ms and require exactly two release calls: one hung explicit call and one drop-path attempt. Completed release errors, background errors and cancellation before acquisition are not covered. (rust/lance-table/src/io/commit.rs:2410-2428)

### Lines 2429-2463

Lexical resolver regression has clean(false,1) and leftover_staging(true,2) cases. It writes V2 versions 0 through 9 and optionally a UUID staging name for version 10 that sorts before version 9. Comments relate pulled entries to billing, but this fixture counts metadata events, not cloud requests/pages/billing. (rust/lance-table/src/io/commit.rs:2429-2463)

### Lines 2464-2490

Proxy policy increments an AtomicUsize only for list metadata and passes entries unchanged. Resolve latest, assert version 9 and counts 1 or 2. This pins stopping at the first valid entry and staging-name filtering in memory. No concurrent write, error, mixed scheme or backend pagination case. All source tests were read, not run. (rust/lance-table/src/io/commit.rs:2464-2490)

## Interaction and interpretation limits

All 2490 physical lines read in complete bounded outputs and assigned authored contiguous ranges, including every local test. No source builds/tests or remote storage calls performed. Cloud behavior claims are source contracts/rationale, not measured guarantees. ExternalManifestCommitHandler, DynamoDB implementation and complete Dataset commit orchestration remain pending.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Trait for commit implementations.
    5 | //!
    6 | //! In Lance, a transaction is committed by writing the next manifest file.
    7 | //! However, care should be taken to ensure that the manifest file is written
    8 | //! only once, even if there are concurrent writers. Different stores have
    9 | //! different abilities to handle concurrent writes, so a trait is provided
   10 | //! to allow for different implementations.
   11 | //!
   12 | //! The trait [CommitHandler] can be implemented to provide different commit
   13 | //! strategies. The default implementation for most object stores is
   14 | //! [RenameCommitHandler], which writes the manifest to a temporary path, then
   15 | //! renames the temporary path to the final path if no object already exists
   16 | //! at the final path. This is an atomic operation in most object stores, but
   17 | //! not in AWS S3. So for AWS S3, the default commit handler is
   18 | //! [UnsafeCommitHandler], which writes the manifest to the final path without
   19 | //! any checks.
   20 | //!
   21 | //! When providing your own commit handler, most often you are implementing in
   22 | //! terms of a lock. The trait [CommitLock] can be implemented as a simpler
   23 | //! alternative to [CommitHandler].
   24 | 
   25 | use std::io;
   26 | use std::pin::Pin;
   27 | use std::sync::Arc;
   28 | use std::sync::atomic::AtomicBool;
   29 | use std::{fmt::Debug, fs::DirEntry};
   30 | 
   31 | use super::manifest::write_manifest;
   32 | use futures::Stream;
   33 | use futures::future::Either;
   34 | use futures::{
   35 |     StreamExt, TryStreamExt,
   36 |     future::{self, BoxFuture},
   37 |     stream::BoxStream,
   38 | };
   39 | use lance_file::format::{MAGIC, MAJOR_VERSION, MINOR_VERSION};
   40 | use lance_io::object_writer::{ObjectWriter, WriteResult, get_etag};
   41 | use log::warn;
   42 | use object_store::ObjectStoreExt as OSObjectStoreExt;
   43 | use object_store::PutOptions;
   44 | use object_store::{Error as ObjectStoreError, ObjectStore as OSObjectStore, path::Path};
   45 | use tracing::info;
   46 | use url::Url;
   47 | 
   48 | #[cfg(feature = "dynamodb")]
   49 | pub mod dynamodb;
   50 | pub mod external_manifest;
   51 | 
   52 | use lance_core::{Error, Result};
   53 | use lance_io::object_store::{ObjectStore, ObjectStoreExt, ObjectStoreParams};
   54 | use lance_io::traits::{WriteExt, Writer};
   55 | 
   56 | use crate::format::{IndexMetadata, Manifest, Transaction, is_detached_version};
   57 | use lance_core::utils::tracing::{AUDIT_MODE_CREATE, AUDIT_TYPE_MANIFEST, TRACE_FILE_AUDIT};
   58 | #[cfg(feature = "dynamodb")]
   59 | use {
   60 |     self::external_manifest::{ExternalManifestCommitHandler, ExternalManifestStore},
   61 |     aws_credential_types::provider::ProvideCredentials,
   62 |     aws_credential_types::provider::error::CredentialsError,
   63 |     lance_io::object_store::{StorageOptions, providers::aws::build_aws_credential},
   64 |     object_store::aws::AmazonS3ConfigKey,
   65 |     object_store::aws::AwsCredentialProvider,
   66 |     std::borrow::Cow,
   67 |     std::time::{Duration, SystemTime},
   68 | };
   69 | 
   70 | pub const VERSIONS_DIR: &str = "_versions";
   71 | const MANIFEST_EXTENSION: &str = "manifest";
   72 | const DETACHED_VERSION_PREFIX: &str = "d";
   73 | /// File name for the JSON version hint file, stored under `_versions/`.
   74 | ///
   75 | /// The file contains `{"version":N}` where `N` is the latest committed version
   76 | /// at the time of writing. It enables O(1)/O(k) latest-version lookup via HEAD
   77 | /// requests on object stores where listing is not lexicographically ordered
   78 | /// (e.g. S3 Express, local filesystem) instead of an O(n) listing.
   79 | const VERSION_HINT_FILE: &str = "latest_version_hint.json";
   80 | 
   81 | /// How manifest files should be named.
   82 | #[derive(Clone, Copy, Debug, PartialEq, Eq)]
   83 | pub enum ManifestNamingScheme {
   84 |     /// `_versions/{version}.manifest`
   85 |     V1,
   86 |     /// `_manifests/{u64::MAX - version}.manifest`
   87 |     ///
   88 |     /// Zero-padded and reversed for O(1) lookup of latest version on object stores.
   89 |     V2,
   90 | }
   91 | 
   92 | impl ManifestNamingScheme {
   93 |     pub fn manifest_path(&self, base: &Path, version: u64) -> Path {
   94 |         if is_detached_version(version) {
   95 |             // Detached versions should never show up first in a list operation which
   96 |             // means it needs to come lexicographically after all attached manifest
   97 |             // files and so we add the prefix `d`.  There is no need to invert the
   98 |             // version number since detached versions are not part of the version
   99 |             base.clone().join(VERSIONS_DIR).join(format!(
  100 |                 "{DETACHED_VERSION_PREFIX}{version}.{MANIFEST_EXTENSION}"
  101 |             ))
  102 |         } else {
  103 |             let directory = base.clone().join(VERSIONS_DIR);
  104 |             match self {
  105 |                 Self::V1 => directory.join(format!("{version}.{MANIFEST_EXTENSION}")),
  106 |                 Self::V2 => {
  107 |                     let inverted_version = u64::MAX - version;
  108 |                     directory.join(format!("{inverted_version:020}.{MANIFEST_EXTENSION}"))
  109 |                 }
  110 |             }
  111 |         }
  112 |     }
  113 | 
  114 |     pub fn parse_version(&self, filename: &str) -> Option<u64> {
  115 |         let file_number = filename
  116 |             .split_once('.')
  117 |             // Detached versions will fail the `parse` step, which is ok.
  118 |             .and_then(|(version_str, _)| version_str.parse::<u64>().ok());
  119 |         match self {
  120 |             Self::V1 => file_number,
  121 |             Self::V2 => file_number.map(|v| u64::MAX - v),
  122 |         }
  123 |     }
  124 | 
  125 |     /// Parse a detached version from a filename like `d123456.manifest`.
  126 |     ///
  127 |     /// Returns the full version number with the detached mask bit set.
  128 |     pub fn parse_detached_version(filename: &str) -> Option<u64> {
  129 |         if !filename.starts_with(DETACHED_VERSION_PREFIX) {
  130 |             return None;
  131 |         }
  132 |         let without_prefix = &filename[DETACHED_VERSION_PREFIX.len()..];
  133 |         without_prefix
  134 |             .split_once('.')
  135 |             .and_then(|(version_str, _)| version_str.parse::<u64>().ok())
  136 |     }
  137 | 
  138 |     pub fn detect_scheme(filename: &str) -> Option<Self> {
  139 |         if filename.starts_with(DETACHED_VERSION_PREFIX) {
  140 |             // Currently, detached versions must imply V2
  141 |             return Some(Self::V2);
  142 |         }
  143 |         if filename.ends_with(MANIFEST_EXTENSION) {
  144 |             const V2_LEN: usize = 20 + 1 + MANIFEST_EXTENSION.len();
  145 |             if filename.len() == V2_LEN {
  146 |                 Some(Self::V2)
  147 |             } else {
  148 |                 Some(Self::V1)
  149 |             }
  150 |         } else {
  151 |             None
  152 |         }
  153 |     }
  154 | 
  155 |     pub fn detect_scheme_staging(filename: &str) -> Self {
  156 |         // We shouldn't have to worry about detached versions here since there is no
  157 |         // such thing as "detached" and "staged" at the same time.
  158 |         if filename.chars().nth(20) == Some('.') {
  159 |             Self::V2
  160 |         } else {
  161 |             Self::V1
  162 |         }
  163 |     }
  164 | }
  165 | 
  166 | /// Migrate all V1 manifests to V2 naming scheme.
  167 | ///
  168 | /// This function will rename all V1 manifests to V2 naming scheme.
  169 | ///
  170 | /// This function is idempotent, and can be run multiple times without
  171 | /// changing the state of the object store.
  172 | ///
  173 | /// However, it should not be run while other concurrent operations are happening.
  174 | /// And it should also run until completion before resuming other operations.
  175 | pub async fn migrate_scheme_to_v2(object_store: &ObjectStore, dataset_base: &Path) -> Result<()> {
  176 |     object_store
  177 |         .inner
  178 |         .list(Some(&dataset_base.clone().join(VERSIONS_DIR)))
  179 |         .try_filter(|res| {
  180 |             let res = if let Some(filename) = res.location.filename() {
  181 |                 ManifestNamingScheme::detect_scheme(filename) == Some(ManifestNamingScheme::V1)
  182 |             } else {
  183 |                 false
  184 |             };
  185 |             future::ready(res)
  186 |         })
  187 |         .try_for_each_concurrent(object_store.io_parallelism(), |meta| async move {
  188 |             let filename = meta.location.filename().unwrap();
  189 |             let version = ManifestNamingScheme::V1.parse_version(filename).unwrap();
  190 |             let path = ManifestNamingScheme::V2.manifest_path(dataset_base, version);
  191 |             object_store.inner.rename(&meta.location, &path).await?;
  192 |             Ok(())
  193 |         })
  194 |         .await?;
  195 | 
  196 |     Ok(())
  197 | }
  198 | 
  199 | /// Function that writes the manifest to the object store.
  200 | ///
  201 | /// Returns the size of the written manifest.
  202 | pub type ManifestWriter = for<'a> fn(
  203 |     object_store: &'a ObjectStore,
  204 |     manifest: &'a mut Manifest,
  205 |     indices: Option<Vec<IndexMetadata>>,
  206 |     path: &'a Path,
  207 |     transaction: Option<Transaction>,
  208 | ) -> BoxFuture<'a, Result<WriteResult>>;
  209 | 
  210 | /// Canonical manifest writer; its function item type exactly matches `ManifestWriter`.
  211 | /// Rationale: keep a crate-local writer implementation so call sites can pass this function
  212 | /// directly without non-primitive casts or lifetime coercions.
  213 | pub fn write_manifest_file_to_path<'a>(
  214 |     object_store: &'a ObjectStore,
  215 |     manifest: &'a mut Manifest,
  216 |     indices: Option<Vec<IndexMetadata>>,
  217 |     path: &'a Path,
  218 |     transaction: Option<Transaction>,
  219 | ) -> BoxFuture<'a, Result<WriteResult>> {
  220 |     Box::pin(async move {
  221 |         let mut object_writer = ObjectWriter::new(object_store, path).await?;
  222 |         let pos = write_manifest(&mut object_writer, manifest, indices, transaction).await?;
  223 |         object_writer
  224 |             .write_magics(pos, MAJOR_VERSION, MINOR_VERSION, MAGIC)
  225 |             .await?;
  226 |         let res = Writer::shutdown(&mut object_writer).await?;
  227 |         info!(target: TRACE_FILE_AUDIT, mode=AUDIT_MODE_CREATE, r#type=AUDIT_TYPE_MANIFEST, path = path.to_string());
  228 |         Ok(res)
  229 |     })
  230 | }
  231 | 
  232 | #[derive(Debug, Clone)]
  233 | pub struct ManifestLocation {
  234 |     /// The version the manifest corresponds to.
  235 |     pub version: u64,
  236 |     /// Path of the manifest file, relative to the table root.
  237 |     pub path: Path,
  238 |     /// Size, in bytes, of the manifest file. If it is not known, this field should be `None`.
  239 |     pub size: Option<u64>,
  240 |     /// Naming scheme of the manifest file.
  241 |     pub naming_scheme: ManifestNamingScheme,
  242 |     /// Optional opaque object generation token observed at `path`.
  243 |     ///
  244 |     /// An ETag is not necessarily a content checksum and may change when an
  245 |     /// object is rewritten with identical bytes. In particular, S3 Express
  246 |     /// returns an object-specific opaque value. Callers must not treat it as a
  247 |     /// content checksum, logical manifest identity, or dataset-incarnation
  248 |     /// identity. The generic
  249 |     /// [`ExternalManifestStore`](crate::io::commit::external_manifest::ExternalManifestStore)
  250 |     /// workflow therefore neither persists nor validates it: COPY and external
  251 |     /// index publication are not atomic, so an otherwise correct equivalent
  252 |     /// materialization can make a stored token stale before it is published.
  253 |     ///
  254 |     /// When present, the token still distinguishes the physical object
  255 |     /// generation observed by this caller and can prevent reuse of an older
  256 |     /// cached Dataset at the same URI and version. Conversely, `None` must not
  257 |     /// be interpreted as proof that two observations belong to the same dataset
  258 |     /// incarnation.
  259 |     pub e_tag: Option<String>,
  260 |     /// A token unique to this manifest record in the commit handler's store,
  261 |     /// where it keeps one (`ExternalManifestStore::get_identity`). A dataset
  262 |     /// recreated at the same version has a different one.
  263 |     pub identity: Option<String>,
  264 | }
  265 | 
  266 | impl TryFrom<object_store::ObjectMeta> for ManifestLocation {
  267 |     type Error = Error;
  268 | 
  269 |     fn try_from(meta: object_store::ObjectMeta) -> Result<Self> {
  270 |         let filename = meta.location.filename().ok_or_else(|| {
  271 |             Error::internal("ObjectMeta location does not have a filename".to_string())
  272 |         })?;
  273 |         let scheme = ManifestNamingScheme::detect_scheme(filename)
  274 |             .ok_or_else(|| Error::internal(format!("Invalid manifest filename: '{}'", filename)))?;
  275 |         let version = scheme
  276 |             .parse_version(filename)
  277 |             .ok_or_else(|| Error::internal(format!("Invalid manifest filename: '{}'", filename)))?;
  278 |         Ok(Self {
  279 |             version,
  280 |             path: meta.location,
  281 |             size: Some(meta.size),
  282 |             naming_scheme: scheme,
  283 |             e_tag: meta.e_tag,
  284 |             identity: None,
  285 |         })
  286 |     }
  287 | }
  288 | 
  289 | /// Get the latest manifest path.
  290 | ///
  291 | /// - Local filesystem: a single directory read.
  292 | /// - Stores where listing is not lexicographically ordered (e.g. S3 Express):
  293 | ///   the version hint (read the hint file, then probe higher versions with
  294 | ///   HEADs), falling back to a listing if the hint is missing or stale. A full
  295 | ///   listing on these stores is O(n) in the number of versions.
  296 | /// - Lexicographically ordered stores (e.g. S3 Standard, GCS): the listing
  297 | ///   already resolves the latest version in roughly one request.
  298 | async fn current_manifest_path(
  299 |     object_store: &ObjectStore,
  300 |     base: &Path,
  301 | ) -> Result<ManifestLocation> {
  302 |     if object_store.has_direct_local_paths() {
  303 |         if let Ok(Some(location)) = current_manifest_local(base) {
  304 |             return Ok(location);
  305 |         }
  306 |     } else if uses_version_hint(object_store)
  307 |         && let Some(location) = read_version_hint_and_probe(object_store, base).await
  308 |     {
  309 |         return Ok(location);
  310 |     }
  311 | 
  312 |     resolve_version_from_listing(object_store, base).await
  313 | }
  314 | 
  315 | /// JSON body of the version hint file: `{"version":N}`.
  316 | #[derive(serde::Serialize, serde::Deserialize)]
  317 | struct VersionHint {
  318 |     version: u64,
  319 | }
  320 | 
  321 | /// Set `LANCE_USE_VERSION_HINT=0` (or `false`) to globally disable the version
  322 | /// hint — writers stop emitting the hint file and readers stop consulting it,
  323 | /// falling back to plain listing. Intended as a benchmark/escape-hatch knob;
  324 | /// the hint is on by default.
  325 | const VERSION_HINT_ENV: &str = "LANCE_USE_VERSION_HINT";
  326 | 
  327 | fn version_hint_globally_enabled() -> bool {
  328 |     static ENABLED: std::sync::OnceLock<bool> = std::sync::OnceLock::new();
  329 |     *ENABLED.get_or_init(|| match std::env::var(VERSION_HINT_ENV) {
  330 |         Ok(v) => !matches!(
  331 |             v.trim().to_ascii_lowercase().as_str(),
  332 |             "0" | "false" | "off"
  333 |         ),
  334 |         Err(_) => true,
  335 |     })
  336 | }
  337 | 
  338 | /// Whether this object store benefits from a version hint.
  339 | ///
  340 | /// On stores where listing is lexicographically ordered (S3 Standard, GCS,
  341 | /// Azure, ...) the latest version is already resolved in roughly one request,
  342 | /// so the hint would only add a write per commit for nothing. We write (and
  343 | /// read) it only on stores where listing is not lexicographically ordered —
  344 | /// S3 Express and the local filesystem. Can be force-disabled with the
  345 | /// `LANCE_USE_VERSION_HINT=0` environment variable.
  346 | pub fn uses_version_hint(object_store: &ObjectStore) -> bool {
  347 |     version_hint_globally_enabled() && !object_store.list_is_lexically_ordered
  348 | }
  349 | 
  350 | /// Path to the JSON version hint file for a dataset.
  351 | fn version_hint_path(base: &Path) -> Path {
  352 |     base.clone().join(VERSIONS_DIR).join(VERSION_HINT_FILE)
  353 | }
  354 | 
  355 | /// Write the version hint file after a successful commit.
  356 | ///
  357 | /// The hint is stored as JSON: `{"version":N}`. This write is best-effort —
  358 | /// failures are logged and ignored, since the hint only accelerates reads and
  359 | /// never affects correctness (readers verify the hinted version and probe
  360 | /// upward from there). It is a no-op for detached versions and for stores that
  361 | /// do not benefit from a hint (see [`uses_version_hint`]).
  362 | pub async fn write_version_hint(object_store: &ObjectStore, base: &Path, version: u64) {
  363 |     if is_detached_version(version) || !uses_version_hint(object_store) {
  364 |         return;
  365 |     }
  366 |     let hint_path = version_hint_path(base);
  367 |     let content = serde_json::to_vec(&VersionHint { version }).expect("serialize version hint");
  368 |     if let Err(e) = object_store.put(&hint_path, content.as_slice()).await {
  369 |         warn!("Failed to write version hint file for version {version}: {e}");
  370 |     }
  371 | }
  372 | 
  373 | /// Read the latest version from the hint file, or `None` if it does not exist
  374 | /// or cannot be parsed.
  375 | async fn read_version_from_hint(object_store: &ObjectStore, base: &Path) -> Option<u64> {
  376 |     let bytes = object_store
  377 |         .inner
  378 |         .get(&version_hint_path(base))
  379 |         .await
  380 |         .ok()?
  381 |         .bytes()
  382 |         .await
  383 |         .ok()?;
  384 |     Some(serde_json::from_slice::<VersionHint>(&bytes).ok()?.version)
  385 | }
  386 | 
  387 | /// Read the version hint and probe upward to find the true latest manifest.
  388 | ///
  389 | /// Returns `None` if the hint file is missing, the hinted version no longer
  390 | /// exists, or any error occurred — callers should fall back to listing.
  391 | async fn read_version_hint_and_probe(
  392 |     object_store: &ObjectStore,
  393 |     base: &Path,
  394 | ) -> Option<ManifestLocation> {
  395 |     let hint_version = read_version_from_hint(object_store, base).await?;
  396 |     let (version, scheme, mut probed) = probe_versions_upward(object_store, base, hint_version)
  397 |         .await
  398 |         .ok()
  399 |         .flatten()?;
  400 |     // `probed` is non-empty and its last entry is the highest version found.
  401 |     let (_, meta) = probed.pop()?;
  402 |     Some(ManifestLocation {
  403 |         version,
  404 |         path: scheme.manifest_path(base, version),
  405 |         size: Some(meta.size),
  406 |         naming_scheme: scheme,
  407 |         e_tag: meta.e_tag,
  408 |         identity: None,
  409 |     })
  410 | }
  411 | 
  412 | /// Maximum version gap between the hint and the read version for which we use
  413 | /// the hint-based parallel-HEAD path; beyond this a single (paginated) listing
  414 | /// is cheaper, so callers fall back to it.
  415 | const MAX_HINT_PROBE_GAP: u64 = 1000;
  416 | 
  417 | /// Probe `from_version`, then `from_version + 1`, `+ 2`, ... with HEAD requests
  418 | /// until one is not found.
  419 | ///
  420 | /// Assumes attached versions are contiguous above `from_version` (true in
  421 | /// practice: every commit increments by one, and cleanup only removes *old*
  422 | /// versions, never ones newer than the latest). A `NotFound` therefore marks
  423 | /// the end of the history.
  424 | ///
  425 | /// - `Ok(Some((true_latest_version, naming_scheme, [(version, meta), ...])))`:
  426 | ///   the vec covers every version from `from_version` through the true latest
  427 | ///   in ascending order.
  428 | /// - `Ok(None)`: `from_version` itself does not exist (a `NotFound` for both
  429 | ///   naming schemes) — i.e. the hint pointed past the end.
  430 | /// - `Err(_)`: a transient object-store error was hit, so the probed range may
  431 | ///   be incomplete; callers should fall back to a full listing rather than
  432 | ///   trust a possibly-stale result.
  433 | async fn probe_versions_upward(
  434 |     object_store: &ObjectStore,
  435 |     base: &Path,
  436 |     from_version: u64,
  437 | ) -> Result<
  438 |     Option<(
  439 |         u64,
  440 |         ManifestNamingScheme,
  441 |         Vec<(u64, object_store::ObjectMeta)>,
  442 |     )>,
  443 | > {
  444 |     // Newer datasets use V2; fall back to V1 if the V2 path is not found.
  445 |     let mut scheme = ManifestNamingScheme::V2;
  446 |     let meta = match object_store
  447 |         .inner
  448 |         .head(&scheme.manifest_path(base, from_version))
  449 |         .await
  450 |     {
  451 |         Ok(meta) => meta,
  452 |         Err(ObjectStoreError::NotFound { .. }) => {
  453 |             scheme = ManifestNamingScheme::V1;
  454 |             match object_store
  455 |                 .inner
  456 |                 .head(&scheme.manifest_path(base, from_version))
  457 |                 .await
  458 |             {
  459 |                 Ok(meta) => meta,
  460 |                 Err(ObjectStoreError::NotFound { .. }) => return Ok(None),
  461 |                 Err(e) => return Err(e.into()),
  462 |             }
  463 |         }
  464 |         Err(e) => return Err(e.into()),
  465 |     };
  466 | 
  467 |     let mut probed = vec![(from_version, meta)];
  468 |     let mut version = from_version;
  469 |     loop {
  470 |         let next = version + 1;
  471 |         match object_store
  472 |             .inner
  473 |             .head(&scheme.manifest_path(base, next))
  474 |             .await
  475 |         {
  476 |             Ok(meta) => {
  477 |                 probed.push((next, meta));
  478 |                 version = next;
  479 |             }
  480 |             // NotFound means we found the latest version.
  481 |             Err(ObjectStoreError::NotFound { .. }) => break,
  482 |             // A transient error means a newer version might exist that we
  483 |             // failed to observe — surface it so callers fall back to listing.
  484 |             Err(e) => return Err(e.into()),
  485 |         }
  486 |     }
  487 |     Ok(Some((version, scheme, probed)))
  488 | }
  489 | 
  490 | /// List manifest locations with version `> since_version` using the version
  491 | /// hint, in descending order of version.
  492 | ///
  493 | /// Returns `None` if the hint is missing or stale enough that this is not
  494 | /// usable — callers should fall back to a full listing. `Some(vec![])` is the
  495 | /// fast path where the hint confirms there are no new versions.
  496 | async fn list_manifests_since_version_with_hint(
  497 |     object_store: &ObjectStore,
  498 |     base: &Path,
  499 |     since_version: u64,
  500 | ) -> Option<Vec<ManifestLocation>> {
  501 |     let hint_version = read_version_from_hint(object_store, base).await?;
  502 | 
  503 |     // A reader that is very far behind is cheaper to serve with one paginated
  504 |     // listing than with thousands of HEADs.
  505 |     if hint_version.saturating_sub(since_version) > MAX_HINT_PROBE_GAP {
  506 |         return None;
  507 |     }
  508 | 
  509 |     // If the hint is not newer than the read version, the only versions that
  510 |     // could exist are right above it; otherwise start at the hint.
  511 |     let probe_from = if hint_version > since_version {
  512 |         hint_version
  513 |     } else {
  514 |         since_version + 1
  515 |     };
  516 | 
  517 |     let (scheme, probed) = match probe_versions_upward(object_store, base, probe_from).await {
  518 |         Ok(Some((_true_latest, scheme, probed))) => (scheme, probed),
  519 |         // Nothing at `probe_from`. If we were probing from the hint, the hint
  520 |         // is stale — bail to a full listing. If we were probing from
  521 |         // `since_version + 1`, there are simply no new versions.
  522 |         Ok(None) if hint_version > since_version => return None,
  523 |         Ok(None) => return Some(Vec::new()),
  524 |         // Transient error: don't trust the hint path, fall back to listing.
  525 |         Err(_) => return None,
  526 |     };
  527 | 
  528 |     let mut locations: Vec<ManifestLocation> = probed
  529 |         .into_iter()
  530 |         .filter(|(v, _)| *v > since_version)
  531 |         .map(|(version, meta)| ManifestLocation {
  532 |             version,
  533 |             path: scheme.manifest_path(base, version),
  534 |             size: Some(meta.size),
  535 |             naming_scheme: scheme,
  536 |             e_tag: meta.e_tag,
  537 |             identity: None,
  538 |         })
  539 |         .collect();
  540 | 
  541 |     // Fill the gap between `since_version` and the hint with HEADs (the probe
  542 |     // above already covered `hint_version` and up). The range is contiguous, so
  543 |     // any error here (including a `NotFound`) means we can't trust the hint path
  544 |     // — fall back to a full listing.
  545 |     if hint_version > since_version + 1 {
  546 |         let gap_locations: Vec<ManifestLocation> =
  547 |             futures::stream::iter((since_version + 1)..hint_version)
  548 |                 .map(|version| async move {
  549 |                     object_store
  550 |                         .inner
  551 |                         .head(&scheme.manifest_path(base, version))
  552 |                         .await
  553 |                         .map(|meta| ManifestLocation {
  554 |                             version,
  555 |                             path: scheme.manifest_path(base, version),
  556 |                             size: Some(meta.size),
  557 |                             naming_scheme: scheme,
  558 |                             e_tag: meta.e_tag,
  559 |                             identity: None,
  560 |                         })
  561 |                 })
  562 |                 .buffer_unordered(object_store.io_parallelism())
  563 |                 .try_collect()
  564 |                 .await
  565 |                 .ok()?;
  566 |         locations.extend(gap_locations);
  567 |     }
  568 | 
  569 |     locations.sort_by_key(|loc| std::cmp::Reverse(loc.version));
  570 |     Some(locations)
  571 | }
  572 | 
  573 | /// Resolve the latest manifest by listing the versions directory.
  574 | async fn resolve_version_from_listing(
  575 |     object_store: &ObjectStore,
  576 |     base: &Path,
  577 | ) -> Result<ManifestLocation> {
  578 |     let manifest_files = object_store.list(Some(base.clone().join(VERSIONS_DIR)));
  579 | 
  580 |     let mut valid_manifests = manifest_files.try_filter_map(|res| {
  581 |         let filename = res.location.filename().unwrap();
  582 |         if let Some(scheme) = ManifestNamingScheme::detect_scheme(filename) {
  583 |             // Only include if we can parse a version (skip detached versions)
  584 |             if scheme.parse_version(filename).is_some() {
  585 |                 future::ready(Ok(Some((scheme, res))))
  586 |             } else {
  587 |                 future::ready(Ok(None))
  588 |             }
  589 |         } else {
  590 |             future::ready(Ok(None))
  591 |         }
  592 |     });
  593 | 
  594 |     let first = valid_manifests.next().await.transpose()?;
  595 |     match (first, object_store.list_is_lexically_ordered) {
  596 |         // If the first valid manifest we see is V2, we can assume that we are using
  597 |         // V2 naming scheme for all manifests.
  598 |         //
  599 |         // V2 filenames are `u64::MAX - version` zero-padded to 20 digits, so on a
  600 |         // lexically ordered store the first entry is the newest version and nothing
  601 |         // after it can change the answer. We stop there rather than validating the
  602 |         // entries behind it: that check was bounded in *valid manifests*, not keys,
  603 |         // so a directory holding anything the filter drops made it spill into
  604 |         // further listing pages on every open.
  605 |         (Some((scheme @ ManifestNamingScheme::V2, meta)), true) => {
  606 |             let version = scheme
  607 |                 .parse_version(meta.location.filename().unwrap())
  608 |                 .unwrap();
  609 | 
  610 |             Ok(ManifestLocation {
  611 |                 version,
  612 |                 path: meta.location,
  613 |                 size: Some(meta.size),
  614 |                 naming_scheme: scheme,
  615 |                 e_tag: meta.e_tag,
  616 |                 identity: None,
  617 |             })
  618 |         }
  619 |         // If the list is not lexically ordered, we need to iterate all manifests
  620 |         // to find the latest version. This works for both V1 and V2 schemes.
  621 |         (Some((first_scheme, meta)), _) => {
  622 |             let mut current_version = first_scheme
  623 |                 .parse_version(meta.location.filename().unwrap())
  624 |                 .unwrap();
  625 |             let mut current_meta = meta;
  626 |             let scheme = first_scheme;
  627 | 
  628 |             while let Some((entry_scheme, meta)) = valid_manifests.next().await.transpose()? {
  629 |                 if entry_scheme != scheme {
  630 |                     return Err(Error::internal(format!(
  631 |                         "Found multiple manifest naming schemes in the same directory: {:?} and {:?}. \
  632 |                          Use `migrate_manifest_paths_v2` to migrate the directory.",
  633 |                         scheme, entry_scheme
  634 |                     )));
  635 |                 }
  636 |                 let version = entry_scheme
  637 |                     .parse_version(meta.location.filename().unwrap())
  638 |                     .unwrap();
  639 |                 if version > current_version {
  640 |                     current_version = version;
  641 |                     current_meta = meta;
  642 |                 }
  643 |             }
  644 |             Ok(ManifestLocation {
  645 |                 version: current_version,
  646 |                 path: current_meta.location,
  647 |                 size: Some(current_meta.size),
  648 |                 naming_scheme: scheme,
  649 |                 e_tag: current_meta.e_tag,
  650 |                 identity: None,
  651 |             })
  652 |         }
  653 |         (None, _) => Err(Error::not_found(
  654 |             base.clone().join(VERSIONS_DIR).to_string(),
  655 |         )),
  656 |     }
  657 | }
  658 | 
  659 | // This is an optimized function that searches for the latest manifest. In
  660 | // object_store, list operations lookup metadata for each file listed. This
  661 | // method only gets the metadata for the found latest manifest.
  662 | fn current_manifest_local(base: &Path) -> std::io::Result<Option<ManifestLocation>> {
  663 |     let path = lance_io::local::to_local_path(&base.clone().join(VERSIONS_DIR));
  664 |     let entries = std::fs::read_dir(path)?;
  665 | 
  666 |     let mut latest_entry: Option<(u64, DirEntry, ManifestNamingScheme)> = None;
  667 | 
  668 |     let mut scheme: Option<ManifestNamingScheme> = None;
  669 | 
  670 |     for entry in entries {
  671 |         let entry = entry?;
  672 |         let filename_raw = entry.file_name();
  673 |         let filename = filename_raw.to_string_lossy();
  674 | 
  675 |         let Some(entry_scheme) = ManifestNamingScheme::detect_scheme(&filename) else {
  676 |             // Need to ignore temporary files, such as
  677 |             // .tmp_7.manifest_9c100374-3298-4537-afc6-f5ee7913666d
  678 |             continue;
  679 |         };
  680 | 
  681 |         if let Some(scheme) = scheme {
  682 |             if scheme != entry_scheme {
  683 |                 return Err(io::Error::new(
  684 |                     io::ErrorKind::InvalidData,
  685 |                     format!(
  686 |                         "Found multiple manifest naming schemes in the same directory: {:?} and {:?}",
  687 |                         scheme, entry_scheme
  688 |                     ),
  689 |                 ));
  690 |             }
  691 |         } else {
  692 |             scheme = Some(entry_scheme);
  693 |         }
  694 | 
  695 |         let Some(version) = entry_scheme.parse_version(&filename) else {
  696 |             continue;
  697 |         };
  698 | 
  699 |         if let Some((latest_version, _, _)) = &latest_entry {
  700 |             if version > *latest_version {
  701 |                 latest_entry = Some((version, entry, entry_scheme));
  702 |             }
  703 |         } else {
  704 |             latest_entry = Some((version, entry, entry_scheme));
  705 |         }
  706 |     }
  707 | 
  708 |     if let Some((version, entry, naming_scheme)) = latest_entry {
  709 |         let metadata = entry.metadata()?;
  710 |         Ok(Some(ManifestLocation {
  711 |             version,
  712 |             path: naming_scheme.manifest_path(base, version),
  713 |             size: Some(metadata.len()),
  714 |             naming_scheme,
  715 |             e_tag: Some(get_etag(&metadata)),
  716 |             identity: None,
  717 |         }))
  718 |     } else {
  719 |         Ok(None)
  720 |     }
  721 | }
  722 | 
  723 | fn list_manifests<'a>(
  724 |     base_path: &Path,
  725 |     object_store: &'a dyn OSObjectStore,
  726 | ) -> impl Stream<Item = Result<ManifestLocation>> + 'a {
  727 |     object_store
  728 |         .read_dir_all(&base_path.clone().join(VERSIONS_DIR), None)
  729 |         .filter_map(|obj_meta| {
  730 |             futures::future::ready(
  731 |                 obj_meta
  732 |                     .map(|m| ManifestLocation::try_from(m).ok())
  733 |                     .transpose(),
  734 |             )
  735 |         })
  736 |         .boxed()
  737 | }
  738 | 
  739 | /// Convert object metadata to ManifestLocation for detached manifests.
  740 | fn detached_manifest_location_from_meta(
  741 |     meta: object_store::ObjectMeta,
  742 | ) -> Option<ManifestLocation> {
  743 |     let filename = meta.location.filename()?;
  744 |     let version = ManifestNamingScheme::parse_detached_version(filename)?;
  745 |     Some(ManifestLocation {
  746 |         version,
  747 |         path: meta.location,
  748 |         size: Some(meta.size),
  749 |         naming_scheme: ManifestNamingScheme::V2,
  750 |         e_tag: meta.e_tag,
  751 |         identity: None,
  752 |     })
  753 | }
  754 | 
  755 | /// List all detached manifest files in the versions directory.
  756 | pub fn list_detached_manifests<'a>(
  757 |     base_path: &Path,
  758 |     object_store: &'a dyn OSObjectStore,
  759 | ) -> impl Stream<Item = Result<ManifestLocation>> + 'a {
  760 |     object_store
  761 |         .read_dir_all(&base_path.clone().join(VERSIONS_DIR), None)
  762 |         .filter_map(|obj_meta| {
  763 |             futures::future::ready(
  764 |                 obj_meta
  765 |                     .map(detached_manifest_location_from_meta)
  766 |                     .transpose(),
  767 |             )
  768 |         })
  769 |         .boxed()
  770 | }
  771 | 
  772 | pub(crate) fn make_staging_manifest_path(base: &Path) -> Result<Path> {
  773 |     let id = uuid::Uuid::new_v4().to_string();
  774 |     Path::parse(format!("{base}-{id}")).map_err(|e| Error::io_source(Box::new(e)))
  775 | }
  776 | 
  777 | #[cfg(feature = "dynamodb")]
  778 | const DDB_URL_QUERY_KEY: &str = "ddbTableName";
  779 | 
  780 | /// Object-store listing of `_versions/`; the `CommitHandler` defaults.
  781 | pub(crate) fn default_list_manifest_locations<'a>(
  782 |     base_path: &Path,
  783 |     object_store: &'a ObjectStore,
  784 |     sorted_descending: bool,
  785 | ) -> BoxStream<'a, Result<ManifestLocation>> {
  786 |     let underlying_stream = list_manifests(base_path, &object_store.inner);
  787 | 
  788 |     if !sorted_descending {
  789 |         return underlying_stream.boxed();
  790 |     }
  791 | 
  792 |     async fn sort_stream(
  793 |         input_stream: impl futures::Stream<Item = Result<ManifestLocation>> + Unpin,
  794 |     ) -> Result<impl Stream<Item = Result<ManifestLocation>> + Unpin> {
  795 |         let mut locations = input_stream.try_collect::<Vec<_>>().await?;
  796 |         locations.sort_by_key(|m| std::cmp::Reverse(m.version));
  797 |         Ok(futures::stream::iter(locations.into_iter().map(Ok)))
  798 |     }
  799 | 
  800 |     // If the object store supports lexicographically ordered lists and
  801 |     // the naming scheme is V2, we can use an optimized list operation.
  802 |     if object_store.list_is_lexically_ordered {
  803 |         // We don't know the naming scheme until we see the first manifest.
  804 |         let mut peekable = underlying_stream.peekable();
  805 | 
  806 |         futures::stream::once(async move {
  807 |             let naming_scheme = match Pin::new(&mut peekable).peek().await {
  808 |                 Some(Ok(m)) => m.naming_scheme,
  809 |                 // If we get an error or no manifests are found, we default
  810 |                 // to V2 naming scheme, since it doesn't matter.
  811 |                 Some(Err(_)) => ManifestNamingScheme::V2,
  812 |                 None => ManifestNamingScheme::V2,
  813 |             };
  814 | 
  815 |             if naming_scheme == ManifestNamingScheme::V2 {
  816 |                 // If the first manifest is V2, we can use the optimized list operation.
  817 |                 Ok(Either::Left(peekable))
  818 |             } else {
  819 |                 sort_stream(peekable).await.map(Either::Right)
  820 |             }
  821 |         })
  822 |         .try_flatten()
  823 |         .boxed()
  824 |     } else {
  825 |         // If the object store does not support lexicographically ordered lists,
  826 |         // we need to sort the manifests in memory. Systems where this isn't
  827 |         // supported (local fs, S3 express) are typically fast enough
  828 |         // that this is not a problem.
  829 |         futures::stream::once(sort_stream(underlying_stream))
  830 |             .try_flatten()
  831 |             .boxed()
  832 |     }
  833 | }
  834 | 
  835 | pub(crate) fn default_list_manifest_locations_since<'a>(
  836 |     base_path: &Path,
  837 |     object_store: &'a ObjectStore,
  838 |     since_version: u64,
  839 | ) -> BoxStream<'a, Result<ManifestLocation>> {
  840 |     if !uses_version_hint(object_store) {
  841 |         return default_list_manifest_locations(base_path, object_store, true)
  842 |             .try_take_while(move |loc| future::ready(Ok(loc.version > since_version)))
  843 |             .boxed();
  844 |     }
  845 | 
  846 |     let base_path = base_path.clone();
  847 |     futures::stream::once(async move {
  848 |         let locations =
  849 |             match list_manifests_since_version_with_hint(object_store, &base_path, since_version)
  850 |                 .await
  851 |             {
  852 |                 Some(locations) => locations,
  853 |                 None => {
  854 |                     let mut locations = list_manifests(&base_path, &object_store.inner)
  855 |                         .try_collect::<Vec<_>>()
  856 |                         .await?;
  857 |                     locations.retain(|loc| loc.version > since_version);
  858 |                     locations.sort_by_key(|loc| std::cmp::Reverse(loc.version));
  859 |                     locations
  860 |                 }
  861 |             };
  862 |         Ok::<_, Error>(futures::stream::iter(locations.into_iter().map(Ok)))
  863 |     })
  864 |     .try_flatten()
  865 |     .boxed()
  866 | }
  867 | 
  868 | /// Handle commits that prevent conflicting writes.
  869 | ///
  870 | /// Commit implementations ensure that if there are multiple concurrent writers
  871 | /// attempting to write the next version of a table, only one will win. In order
  872 | /// to work, all writers must use the same commit handler type.
  873 | /// This trait is also responsible for resolving where the manifests live.
  874 | ///
  875 | // TODO: pub(crate)
  876 | #[async_trait::async_trait]
  877 | #[allow(clippy::too_many_arguments)]
  878 | pub trait CommitHandler: Debug + Send + Sync {
  879 |     /// Whether a not-found result from [`Self::resolve_version_location`] is
  880 |     /// definitive immediately after a commit attempt.
  881 |     ///
  882 |     /// Handlers backed by an eventually consistent or external source of
  883 |     /// truth should keep the conservative default. This prevents callers from
  884 |     /// deleting files that a newly committed manifest may reference while the
  885 |     /// manifest is not yet visible through the resolver.
  886 |     fn is_version_not_found_definitive(&self) -> bool {
  887 |         false
  888 |     }
  889 | 
  890 |     /// Whether an error should still be returned after readback proves that
  891 |     /// the manifest from the current commit attempt landed.
  892 |     ///
  893 |     /// The conservative default preserves errors from custom handlers. Built-in
  894 |     /// object-store handlers override this because their commit errors may be
  895 |     /// ambiguous transport failures whose successful outcome is authoritative.
  896 |     fn propagate_commit_error_after_success(&self) -> bool {
  897 |         true
  898 |     }
  899 | 
  900 |     async fn resolve_latest_location(
  901 |         &self,
  902 |         base_path: &Path,
  903 |         object_store: &ObjectStore,
  904 |     ) -> Result<ManifestLocation> {
  905 |         Ok(current_manifest_path(object_store, base_path).await?)
  906 |     }
  907 | 
  908 |     async fn resolve_version_location(
  909 |         &self,
  910 |         base_path: &Path,
  911 |         version: u64,
  912 |         object_store: &dyn OSObjectStore,
  913 |     ) -> Result<ManifestLocation> {
  914 |         default_resolve_version(base_path, version, object_store).await
  915 |     }
  916 | 
  917 |     /// Check whether an attached manifest version exists without loading it.
  918 |     ///
  919 |     /// The default implementation probes the deterministic manifest path for
  920 |     /// the given naming scheme. Commit handlers with an external source of
  921 |     /// truth should override this method.
  922 |     async fn version_exists(
  923 |         &self,
  924 |         base_path: &Path,
  925 |         version: u64,
  926 |         object_store: &dyn OSObjectStore,
  927 |         naming_scheme: ManifestNamingScheme,
  928 |     ) -> Result<bool> {
  929 |         let path = naming_scheme.manifest_path(base_path, version);
  930 |         match object_store.head(&path).await {
  931 |             Ok(_) => Ok(true),
  932 |             Err(ObjectStoreError::NotFound { .. }) => Ok(false),
  933 |             Err(e) => Err(e.into()),
  934 |         }
  935 |     }
  936 | 
  937 |     /// List detached manifest locations.
  938 |     ///
  939 |     /// Returns a stream of detached manifest locations in arbitrary order.
  940 |     fn list_detached_manifest_locations<'a>(
  941 |         &self,
  942 |         base_path: &Path,
  943 |         object_store: &'a ObjectStore,
  944 |     ) -> BoxStream<'a, Result<ManifestLocation>> {
  945 |         list_detached_manifests(base_path, &object_store.inner).boxed()
  946 |     }
  947 | 
  948 |     /// If `sorted_descending` is `true`, the stream will yield manifests in descending
  949 |     /// order of version. When the object store has a lexicographically
  950 |     /// ordered list and the naming scheme is V2, this will use an optimized
  951 |     /// list operation. Otherwise, it will list all manifests and sort them
  952 |     /// in memory. When `sorted_descending` is `false`, the stream will yield manifests
  953 |     /// in arbitrary order.
  954 |     fn list_manifest_locations<'a>(
  955 |         &self,
  956 |         base_path: &Path,
  957 |         object_store: &'a ObjectStore,
  958 |         sorted_descending: bool,
  959 |     ) -> BoxStream<'a, Result<ManifestLocation>> {
  960 |         default_list_manifest_locations(base_path, object_store, sorted_descending)
  961 |     }
  962 | 
  963 |     /// List manifest locations with version `> since_version`, in descending
  964 |     /// order of version.
  965 |     ///
  966 |     /// On lexically-ordered stores this is the standard listing with early
  967 |     /// termination. On non-lexically-ordered stores (e.g. S3 Express) it uses
  968 |     /// the version hint to avoid an O(n) listing, falling back to a full
  969 |     /// listing if the hint is missing or stale.
  970 |     fn list_manifest_locations_since<'a>(
  971 |         &self,
  972 |         base_path: &Path,
  973 |         object_store: &'a ObjectStore,
  974 |         since_version: u64,
  975 |     ) -> BoxStream<'a, Result<ManifestLocation>> {
  976 |         default_list_manifest_locations_since(base_path, object_store, since_version)
  977 |     }
  978 | 
  979 |     /// Commit a manifest.
  980 |     ///
  981 |     /// This function should return an [CommitError::CommitConflict] if another
  982 |     /// transaction has already been committed to the path.
  983 |     async fn commit(
  984 |         &self,
  985 |         manifest: &mut Manifest,
  986 |         indices: Option<Vec<IndexMetadata>>,
  987 |         base_path: &Path,
  988 |         object_store: &ObjectStore,
  989 |         manifest_writer: ManifestWriter,
  990 |         naming_scheme: ManifestNamingScheme,
  991 |         transaction: Option<Transaction>,
  992 |     ) -> std::result::Result<ManifestLocation, CommitError>;
  993 | 
  994 |     /// Whether [`Self::commit_after`] is available.
  995 |     fn supports_predecessor_condition(&self) -> bool {
  996 |         false
  997 |     }
  998 | 
  999 |     /// The identity of the latest manifest, for [`Self::commit_after`].
 1000 |     /// `None` where the handler cannot condition on it.
 1001 |     async fn resolve_latest_identity(
 1002 |         &self,
 1003 |         _base_path: &Path,
 1004 |         _object_store: &ObjectStore,
 1005 |     ) -> Result<Option<PredecessorIdentity>> {
 1006 |         Ok(None)
 1007 |     }
 1008 | 
 1009 |     /// The identity of the manifest at `version` as the handler's store
 1010 |     /// records it now; `None` where it keeps none or has no record.
 1011 |     async fn resolve_identity(
 1012 |         &self,
 1013 |         _base_path: &Path,
 1014 |         _object_store: &ObjectStore,
 1015 |         _version: u64,
 1016 |     ) -> Result<Option<PredecessorIdentity>> {
 1017 |         Ok(None)
 1018 |     }
 1019 | 
 1020 |     /// Commit only if `predecessor` is still the manifest at its version,
 1021 |     /// decided with the reservation; otherwise [`Error::PrerequisiteFailed`],
 1022 |     /// never a conflict.
 1023 |     #[allow(clippy::too_many_arguments)]
 1024 |     async fn commit_after(
 1025 |         &self,
 1026 |         _manifest: &mut Manifest,
 1027 |         _indices: Option<Vec<IndexMetadata>>,
 1028 |         _base_path: &Path,
 1029 |         _object_store: &ObjectStore,
 1030 |         _manifest_writer: ManifestWriter,
 1031 |         _naming_scheme: ManifestNamingScheme,
 1032 |         _transaction: Option<Transaction>,
 1033 |         _predecessor: &PredecessorIdentity,
 1034 |     ) -> std::result::Result<ManifestLocation, CommitError> {
 1035 |         Err(CommitError::OtherError(Error::not_supported(
 1036 |             "this commit handler cannot condition publication on the predecessor manifest",
 1037 |         )))
 1038 |     }
 1039 | 
 1040 |     /// Retire the record for `version` after its manifest was removed, only
 1041 |     /// while the record still carries `identity`; a no-op otherwise.
 1042 |     async fn forget_version(
 1043 |         &self,
 1044 |         _base_path: &Path,
 1045 |         _version: u64,
 1046 |         _identity: &str,
 1047 |     ) -> Result<()> {
 1048 |         Ok(())
 1049 |     }
 1050 | 
 1051 |     /// Delete the recorded manifest information for a dataset at the base_path
 1052 |     async fn delete(&self, _base_path: &Path) -> Result<()> {
 1053 |         Ok(())
 1054 |     }
 1055 | }
 1056 | 
 1057 | async fn default_resolve_version(
 1058 |     base_path: &Path,
 1059 |     version: u64,
 1060 |     object_store: &dyn OSObjectStore,
 1061 | ) -> Result<ManifestLocation> {
 1062 |     if is_detached_version(version) {
 1063 |         return Ok(ManifestLocation {
 1064 |             version,
 1065 |             // Detached versions are not supported with V1 naming scheme.  If we need
 1066 |             // to support in the future we could use a different prefix (e.g. 'x' or something)
 1067 |             naming_scheme: ManifestNamingScheme::V2,
 1068 |             // Both V1 and V2 should give the same path for detached versions
 1069 |             path: ManifestNamingScheme::V2.manifest_path(base_path, version),
 1070 |             size: None,
 1071 |             e_tag: None,
 1072 |             identity: None,
 1073 |         });
 1074 |     }
 1075 | 
 1076 |     // try V2, fallback to V1.
 1077 |     let scheme = ManifestNamingScheme::V2;
 1078 |     let path = scheme.manifest_path(base_path, version);
 1079 |     match object_store.head(&path).await {
 1080 |         Ok(meta) => Ok(ManifestLocation {
 1081 |             version,
 1082 |             path,
 1083 |             size: Some(meta.size),
 1084 |             naming_scheme: scheme,
 1085 |             e_tag: meta.e_tag,
 1086 |             identity: None,
 1087 |         }),
 1088 |         Err(ObjectStoreError::NotFound { .. }) => {
 1089 |             // fallback to V1
 1090 |             let scheme = ManifestNamingScheme::V1;
 1091 |             Ok(ManifestLocation {
 1092 |                 version,
 1093 |                 path: scheme.manifest_path(base_path, version),
 1094 |                 size: None,
 1095 |                 naming_scheme: scheme,
 1096 |                 e_tag: None,
 1097 |                 identity: None,
 1098 |             })
 1099 |         }
 1100 |         Err(e) => Err(e.into()),
 1101 |     }
 1102 | }
 1103 | /// Adapt an object_store credentials into AWS SDK creds
 1104 | #[cfg(feature = "dynamodb")]
 1105 | #[derive(Debug)]
 1106 | struct OSObjectStoreToAwsCredAdaptor(AwsCredentialProvider);
 1107 | 
 1108 | #[cfg(feature = "dynamodb")]
 1109 | impl ProvideCredentials for OSObjectStoreToAwsCredAdaptor {
 1110 |     fn provide_credentials<'a>(
 1111 |         &'a self,
 1112 |     ) -> aws_credential_types::provider::future::ProvideCredentials<'a>
 1113 |     where
 1114 |         Self: 'a,
 1115 |     {
 1116 |         aws_credential_types::provider::future::ProvideCredentials::new(async {
 1117 |             let creds = self
 1118 |                 .0
 1119 |                 .get_credential()
 1120 |                 .await
 1121 |                 .map_err(|e| CredentialsError::provider_error(Box::new(e)))?;
 1122 |             Ok(aws_credential_types::Credentials::new(
 1123 |                 &creds.key_id,
 1124 |                 &creds.secret_key,
 1125 |                 creds.token.clone(),
 1126 |                 Some(
 1127 |                     SystemTime::now()
 1128 |                         .checked_add(Duration::from_secs(
 1129 |                             60 * 10, //  10 min
 1130 |                         ))
 1131 |                         .expect("overflow"),
 1132 |                 ),
 1133 |                 "",
 1134 |             ))
 1135 |         })
 1136 |     }
 1137 | }
 1138 | 
 1139 | #[cfg(feature = "dynamodb")]
 1140 | async fn build_dynamodb_external_store(
 1141 |     table_name: &str,
 1142 |     creds: AwsCredentialProvider,
 1143 |     region: &str,
 1144 |     endpoint: Option<String>,
 1145 |     app_name: &str,
 1146 | ) -> Result<Arc<dyn ExternalManifestStore>> {
 1147 |     use super::commit::dynamodb::DynamoDBExternalManifestStore;
 1148 |     use aws_sdk_dynamodb::{
 1149 |         Client,
 1150 |         config::{IdentityCache, Region, retry::RetryConfig},
 1151 |     };
 1152 | 
 1153 |     let mut dynamodb_config = aws_sdk_dynamodb::config::Builder::new()
 1154 |         .behavior_version_latest()
 1155 |         .region(Some(Region::new(region.to_string())))
 1156 |         .credentials_provider(OSObjectStoreToAwsCredAdaptor(creds))
 1157 |         // caching should be handled by passed AwsCredentialProvider
 1158 |         .identity_cache(IdentityCache::no_cache())
 1159 |         // Be more resilient to transient network issues.
 1160 |         // 5 attempts = 1 initial + 4 retries with exponential backoff.
 1161 |         .retry_config(RetryConfig::standard().with_max_attempts(5));
 1162 | 
 1163 |     if let Some(endpoint) = endpoint {
 1164 |         dynamodb_config = dynamodb_config.endpoint_url(endpoint);
 1165 |     }
 1166 |     let client = Client::from_conf(dynamodb_config.build());
 1167 | 
 1168 |     DynamoDBExternalManifestStore::new_external_store(client.into(), table_name, app_name).await
 1169 | }
 1170 | 
 1171 | pub async fn commit_handler_from_url(
 1172 |     url_or_path: &str,
 1173 |     // This looks unused if dynamodb feature disabled
 1174 |     #[allow(unused_variables)] options: &Option<ObjectStoreParams>,
 1175 | ) -> Result<Arc<dyn CommitHandler>> {
 1176 |     let local_handler: Arc<dyn CommitHandler> = if cfg!(windows) {
 1177 |         Arc::new(RenameCommitHandler)
 1178 |     } else {
 1179 |         Arc::new(ConditionalPutCommitHandler)
 1180 |     };
 1181 | 
 1182 |     let url = match Url::parse(url_or_path) {
 1183 |         Ok(url) if url.scheme().len() == 1 && cfg!(windows) => {
 1184 |             // On Windows, the drive is parsed as a scheme
 1185 |             return Ok(local_handler);
 1186 |         }
 1187 |         Ok(url) => url,
 1188 |         Err(_) => {
 1189 |             return Ok(local_handler);
 1190 |         }
 1191 |     };
 1192 | 
 1193 |     match url.scheme() {
 1194 |         "file" | "file-object-store" => Ok(local_handler),
 1195 |         "s3" | "gs" | "az" | "abfss" | "memory" | "oss" | "tos" | "shared-memory" | "goosefs" => {
 1196 |             Ok(Arc::new(ConditionalPutCommitHandler))
 1197 |         }
 1198 |         "cos" => Ok(Arc::new(TencentCosCommitHandler)),
 1199 |         #[cfg(not(feature = "dynamodb"))]
 1200 |         "s3+ddb" => Err(Error::invalid_input_source(
 1201 |             "`s3+ddb://` scheme requires `dynamodb` feature to be enabled".into(),
 1202 |         )),
 1203 |         #[cfg(feature = "dynamodb")]
 1204 |         "s3+ddb" => {
 1205 |             if url.query_pairs().count() != 1 {
 1206 |                 return Err(Error::invalid_input_source(
 1207 |                     "`s3+ddb://` scheme and expects exactly one query `ddbTableName`".into(),
 1208 |                 ));
 1209 |             }
 1210 |             let table_name = match url.query_pairs().next() {
 1211 |                 Some((Cow::Borrowed(key), Cow::Borrowed(table_name)))
 1212 |                     if key == DDB_URL_QUERY_KEY =>
 1213 |                 {
 1214 |                     if table_name.is_empty() {
 1215 |                         return Err(Error::invalid_input_source(
 1216 |                             "`s3+ddb://` scheme requires non empty dynamodb table name".into(),
 1217 |                         ));
 1218 |                     }
 1219 |                     table_name
 1220 |                 }
 1221 |                 _ => {
 1222 |                     return Err(Error::invalid_input_source(
 1223 |                         "`s3+ddb://` scheme and expects exactly one query `ddbTableName`".into(),
 1224 |                     ));
 1225 |                 }
 1226 |             };
 1227 |             let options = options.clone().unwrap_or_default();
 1228 |             let storage_options_raw =
 1229 |                 StorageOptions(options.storage_options().cloned().unwrap_or_default());
 1230 |             let dynamo_endpoint = get_dynamodb_endpoint(&storage_options_raw);
 1231 |             let storage_options = storage_options_raw.as_s3_options();
 1232 | 
 1233 |             let region = storage_options.get(&AmazonS3ConfigKey::Region).cloned();
 1234 | 
 1235 |             // Get accessor from the options
 1236 |             let accessor = options.get_accessor();
 1237 | 
 1238 |             let provider_scheme = storage_options_raw.aws_provider_scheme()?;
 1239 | 
 1240 |             let (aws_creds, region) = build_aws_credential(
 1241 |                 options.s3_credentials_refresh_offset,
 1242 |                 options.aws_credentials.clone(),
 1243 |                 Some(&storage_options),
 1244 |                 region,
 1245 |                 accessor,
 1246 |                 provider_scheme,
 1247 |             )
 1248 |             .await?;
 1249 | 
 1250 |             Ok(Arc::new(ExternalManifestCommitHandler {
 1251 |                 external_manifest_store: build_dynamodb_external_store(
 1252 |                     table_name,
 1253 |                     aws_creds.clone(),
 1254 |                     &region,
 1255 |                     dynamo_endpoint,
 1256 |                     "lancedb",
 1257 |                 )
 1258 |                 .await?,
 1259 |             }))
 1260 |         }
 1261 |         _ => Ok(Arc::new(UnsafeCommitHandler)),
 1262 |     }
 1263 | }
 1264 | 
 1265 | #[cfg(feature = "dynamodb")]
 1266 | fn get_dynamodb_endpoint(storage_options: &StorageOptions) -> Option<String> {
 1267 |     if let Some(endpoint) = storage_options.0.get("dynamodb_endpoint") {
 1268 |         Some(endpoint.clone())
 1269 |     } else {
 1270 |         std::env::var("DYNAMODB_ENDPOINT").ok()
 1271 |     }
 1272 | }
 1273 | 
 1274 | /// Errors that can occur when committing a manifest.
 1275 | #[derive(Debug)]
 1276 | pub enum CommitError {
 1277 |     /// Another transaction has already been written to the path
 1278 |     CommitConflict,
 1279 |     /// Something else went wrong
 1280 |     OtherError(Error),
 1281 | }
 1282 | 
 1283 | impl From<Error> for CommitError {
 1284 |     fn from(e: Error) -> Self {
 1285 |         Self::OtherError(e)
 1286 |     }
 1287 | }
 1288 | 
 1289 | impl From<CommitError> for Error {
 1290 |     fn from(e: CommitError) -> Self {
 1291 |         match e {
 1292 |             CommitError::CommitConflict => Self::internal("Commit conflict".to_string()),
 1293 |             CommitError::OtherError(e) => e,
 1294 |         }
 1295 |     }
 1296 | }
 1297 | 
 1298 | /// Whether we have issued a warning about using the unsafe commit handler.
 1299 | static WARNED_ON_UNSAFE_COMMIT: AtomicBool = AtomicBool::new(false);
 1300 | 
 1301 | /// A naive commit implementation that does not prevent conflicting writes.
 1302 | ///
 1303 | /// This will log a warning the first time it is used.
 1304 | pub struct UnsafeCommitHandler;
 1305 | 
 1306 | #[async_trait::async_trait]
 1307 | #[allow(clippy::too_many_arguments)]
 1308 | impl CommitHandler for UnsafeCommitHandler {
 1309 |     fn is_version_not_found_definitive(&self) -> bool {
 1310 |         true
 1311 |     }
 1312 | 
 1313 |     fn propagate_commit_error_after_success(&self) -> bool {
 1314 |         false
 1315 |     }
 1316 | 
 1317 |     async fn commit(
 1318 |         &self,
 1319 |         manifest: &mut Manifest,
 1320 |         indices: Option<Vec<IndexMetadata>>,
 1321 |         base_path: &Path,
 1322 |         object_store: &ObjectStore,
 1323 |         manifest_writer: ManifestWriter,
 1324 |         naming_scheme: ManifestNamingScheme,
 1325 |         transaction: Option<Transaction>,
 1326 |     ) -> std::result::Result<ManifestLocation, CommitError> {
 1327 |         // Log a one-time warning
 1328 |         if !WARNED_ON_UNSAFE_COMMIT.load(std::sync::atomic::Ordering::Relaxed) {
 1329 |             WARNED_ON_UNSAFE_COMMIT.store(true, std::sync::atomic::Ordering::Relaxed);
 1330 |             log::warn!(
 1331 |                 "Using unsafe commit handler. Concurrent writes may result in data loss. \
 1332 |                  Consider providing a commit handler that prevents conflicting writes."
 1333 |             );
 1334 |         }
 1335 | 
 1336 |         let version_path = naming_scheme.manifest_path(base_path, manifest.version);
 1337 |         let res =
 1338 |             manifest_writer(object_store, manifest, indices, &version_path, transaction).await?;
 1339 | 
 1340 |         write_version_hint(object_store, base_path, manifest.version).await;
 1341 | 
 1342 |         Ok(ManifestLocation {
 1343 |             version: manifest.version,
 1344 |             size: Some(res.size as u64),
 1345 |             naming_scheme,
 1346 |             path: version_path,
 1347 |             e_tag: res.e_tag,
 1348 |             identity: None,
 1349 |         })
 1350 |     }
 1351 | }
 1352 | 
 1353 | impl Debug for UnsafeCommitHandler {
 1354 |     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
 1355 |         f.debug_struct("UnsafeCommitHandler").finish()
 1356 |     }
 1357 | }
 1358 | 
 1359 | /// A commit implementation that uses a lock to prevent conflicting writes.
 1360 | #[async_trait::async_trait]
 1361 | pub trait CommitLock: Debug {
 1362 |     type Lease: CommitLease;
 1363 | 
 1364 |     /// Attempt to lock the table for the given version.
 1365 |     ///
 1366 |     /// If it is already locked by another transaction, wait until it is unlocked.
 1367 |     /// Once it is unlocked, return [CommitError::CommitConflict] if the version
 1368 |     /// has already been committed. Otherwise, return the lock.
 1369 |     ///
 1370 |     /// To prevent poisoned locks, it's recommended to set a timeout on the lock
 1371 |     /// of at least 30 seconds.
 1372 |     ///
 1373 |     /// It is not required that the lock tracks the version. It is provided in
 1374 |     /// case the locking is handled by a catalog service that needs to know the
 1375 |     /// current version of the table.
 1376 |     async fn lock(&self, version: u64) -> std::result::Result<Self::Lease, CommitError>;
 1377 | }
 1378 | 
 1379 | #[async_trait::async_trait]
 1380 | pub trait CommitLease: Send + Sync {
 1381 |     /// Return the lease, indicating whether the commit was successful.
 1382 |     ///
 1383 |     /// Implementations should tolerate being called more than once: if a commit
 1384 |     /// is cancelled (e.g. by a timeout) while `release` is in flight, a
 1385 |     /// best-effort `release(false)` may be issued afterwards from the drop path.
 1386 |     async fn release(&self, success: bool) -> std::result::Result<(), CommitError>;
 1387 | }
 1388 | 
 1389 | /// Guards a [CommitLease] so the lock is released even if the commit future is
 1390 | /// dropped (e.g. cancelled by a commit timeout) before reaching an explicit
 1391 | /// release.
 1392 | ///
 1393 | /// [CommitLease::release] is async and cannot be awaited from `Drop`, so on the
 1394 | /// drop path we spawn a best-effort background task that releases the lock with
 1395 | /// `success = false`. Without this, a cancelled commit would leak the lock until
 1396 | /// the lease's own TTL expired, blocking other writers in the meantime.
 1397 | struct LeaseGuard<L: CommitLease + 'static> {
 1398 |     lease: Option<L>,
 1399 | }
 1400 | 
 1401 | impl<L: CommitLease + 'static> LeaseGuard<L> {
 1402 |     fn new(lease: L) -> Self {
 1403 |         Self { lease: Some(lease) }
 1404 |     }
 1405 | 
 1406 |     /// Explicitly release the lease, consuming the guard so `Drop` is a no-op.
 1407 |     async fn release(mut self, success: bool) -> std::result::Result<(), CommitError> {
 1408 |         // Keep the lease inside the guard across the await so that, if this
 1409 |         // future is cancelled mid-release (e.g. the release call itself hangs
 1410 |         // and the commit timeout fires), `Drop` still issues a best-effort
 1411 |         // release. Only clear it once the release has fully completed.
 1412 |         let result = {
 1413 |             let lease = self
 1414 |                 .lease
 1415 |                 .as_ref()
 1416 |                 .expect("LeaseGuard released more than once");
 1417 |             lease.release(success).await
 1418 |         };
 1419 |         self.lease = None;
 1420 |         result
 1421 |     }
 1422 | }
 1423 | 
 1424 | impl<L: CommitLease + 'static> Drop for LeaseGuard<L> {
 1425 |     fn drop(&mut self) {
 1426 |         if let Some(lease) = self.lease.take() {
 1427 |             // The guard was dropped without an explicit release, meaning the
 1428 |             // commit future was cancelled while holding the lock. We can't await
 1429 |             // in `Drop`, so spawn a best-effort release. If there is no runtime,
 1430 |             // leave the lease for its TTL to reclaim.
 1431 |             if let Ok(handle) = tokio::runtime::Handle::try_current() {
 1432 |                 handle.spawn(async move {
 1433 |                     let _ = lease.release(false).await;
 1434 |                 });
 1435 |             }
 1436 |         }
 1437 |     }
 1438 | }
 1439 | 
 1440 | #[async_trait::async_trait]
 1441 | impl<T: CommitLock + Send + Sync> CommitHandler for T
 1442 | where
 1443 |     T::Lease: 'static,
 1444 | {
 1445 |     fn is_version_not_found_definitive(&self) -> bool {
 1446 |         true
 1447 |     }
 1448 | 
 1449 |     async fn commit(
 1450 |         &self,
 1451 |         manifest: &mut Manifest,
 1452 |         indices: Option<Vec<IndexMetadata>>,
 1453 |         base_path: &Path,
 1454 |         object_store: &ObjectStore,
 1455 |         manifest_writer: ManifestWriter,
 1456 |         naming_scheme: ManifestNamingScheme,
 1457 |         transaction: Option<Transaction>,
 1458 |     ) -> std::result::Result<ManifestLocation, CommitError> {
 1459 |         let path = naming_scheme.manifest_path(base_path, manifest.version);
 1460 |         // Hold the lease in a guard so the lock is released even if this future
 1461 |         // is cancelled before we reach an explicit release below. The explicit
 1462 |         // releases are still preferred since they report the correct success
 1463 |         // flag and surface release errors; the guard only covers cancellation.
 1464 |         let lease = LeaseGuard::new(self.lock(manifest.version).await?);
 1465 | 
 1466 |         // Head the location and make sure it's not already committed
 1467 |         match object_store.inner.head(&path).await {
 1468 |             Ok(_) => {
 1469 |                 // The path already exists, so it's already committed
 1470 |                 // Release the lock
 1471 |                 lease.release(false).await?;
 1472 | 
 1473 |                 return Err(CommitError::CommitConflict);
 1474 |             }
 1475 |             Err(ObjectStoreError::NotFound { .. }) => {}
 1476 |             Err(e) => {
 1477 |                 // Something else went wrong
 1478 |                 // Release the lock
 1479 |                 lease.release(false).await?;
 1480 | 
 1481 |                 return Err(CommitError::OtherError(e.into()));
 1482 |             }
 1483 |         }
 1484 |         let res = manifest_writer(object_store, manifest, indices, &path, transaction).await;
 1485 | 
 1486 |         // Release the lock
 1487 |         lease.release(res.is_ok()).await?;
 1488 | 
 1489 |         let res = res?;
 1490 | 
 1491 |         write_version_hint(object_store, base_path, manifest.version).await;
 1492 | 
 1493 |         Ok(ManifestLocation {
 1494 |             version: manifest.version,
 1495 |             size: Some(res.size as u64),
 1496 |             naming_scheme,
 1497 |             path,
 1498 |             e_tag: res.e_tag,
 1499 |             identity: None,
 1500 |         })
 1501 |     }
 1502 | }
 1503 | 
 1504 | #[async_trait::async_trait]
 1505 | impl<T: CommitLock + Send + Sync> CommitHandler for Arc<T>
 1506 | where
 1507 |     T::Lease: 'static,
 1508 | {
 1509 |     fn is_version_not_found_definitive(&self) -> bool {
 1510 |         self.as_ref().is_version_not_found_definitive()
 1511 |     }
 1512 | 
 1513 |     fn propagate_commit_error_after_success(&self) -> bool {
 1514 |         self.as_ref().propagate_commit_error_after_success()
 1515 |     }
 1516 | 
 1517 |     async fn commit(
 1518 |         &self,
 1519 |         manifest: &mut Manifest,
 1520 |         indices: Option<Vec<IndexMetadata>>,
 1521 |         base_path: &Path,
 1522 |         object_store: &ObjectStore,
 1523 |         manifest_writer: ManifestWriter,
 1524 |         naming_scheme: ManifestNamingScheme,
 1525 |         transaction: Option<Transaction>,
 1526 |     ) -> std::result::Result<ManifestLocation, CommitError> {
 1527 |         self.as_ref()
 1528 |             .commit(
 1529 |                 manifest,
 1530 |                 indices,
 1531 |                 base_path,
 1532 |                 object_store,
 1533 |                 manifest_writer,
 1534 |                 naming_scheme,
 1535 |                 transaction,
 1536 |             )
 1537 |             .await
 1538 |     }
 1539 | }
 1540 | 
 1541 | /// A commit implementation that uses a temporary path and renames the object.
 1542 | ///
 1543 | /// This only works for object stores that support atomic rename if not exist.
 1544 | pub struct RenameCommitHandler;
 1545 | 
 1546 | #[async_trait::async_trait]
 1547 | impl CommitHandler for RenameCommitHandler {
 1548 |     fn is_version_not_found_definitive(&self) -> bool {
 1549 |         true
 1550 |     }
 1551 | 
 1552 |     fn propagate_commit_error_after_success(&self) -> bool {
 1553 |         false
 1554 |     }
 1555 | 
 1556 |     async fn commit(
 1557 |         &self,
 1558 |         manifest: &mut Manifest,
 1559 |         indices: Option<Vec<IndexMetadata>>,
 1560 |         base_path: &Path,
 1561 |         object_store: &ObjectStore,
 1562 |         manifest_writer: ManifestWriter,
 1563 |         naming_scheme: ManifestNamingScheme,
 1564 |         transaction: Option<Transaction>,
 1565 |     ) -> std::result::Result<ManifestLocation, CommitError> {
 1566 |         // Create a temporary object, then use `rename_if_not_exists` to commit.
 1567 |         // If failed, clean up the temporary object.
 1568 | 
 1569 |         let path = naming_scheme.manifest_path(base_path, manifest.version);
 1570 |         let tmp_path = make_staging_manifest_path(&path)?;
 1571 | 
 1572 |         let res = manifest_writer(object_store, manifest, indices, &tmp_path, transaction).await?;
 1573 | 
 1574 |         match object_store
 1575 |             .inner
 1576 |             .rename_if_not_exists(&tmp_path, &path)
 1577 |             .await
 1578 |         {
 1579 |             Ok(_) => {
 1580 |                 // Successfully committed
 1581 |                 write_version_hint(object_store, base_path, manifest.version).await;
 1582 |                 Ok(ManifestLocation {
 1583 |                     version: manifest.version,
 1584 |                     path,
 1585 |                     size: Some(res.size as u64),
 1586 |                     naming_scheme,
 1587 |                     e_tag: None, // Re-name can change e-tag.,
 1588 |                     identity: None,
 1589 |                 })
 1590 |             }
 1591 |             Err(ObjectStoreError::AlreadyExists { .. }) => {
 1592 |                 // Another transaction has already been committed
 1593 |                 // Attempt to clean up temporary object, but ignore errors if we can't
 1594 |                 let _ = object_store.delete(&tmp_path).await;
 1595 | 
 1596 |                 return Err(CommitError::CommitConflict);
 1597 |             }
 1598 |             Err(e) => {
 1599 |                 // Something else went wrong
 1600 |                 return Err(CommitError::OtherError(e.into()));
 1601 |             }
 1602 |         }
 1603 |     }
 1604 | }
 1605 | 
 1606 | impl Debug for RenameCommitHandler {
 1607 |     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
 1608 |         f.debug_struct("RenameCommitHandler").finish()
 1609 |     }
 1610 | }
 1611 | 
 1612 | pub struct ConditionalPutCommitHandler;
 1613 | 
 1614 | #[async_trait::async_trait]
 1615 | impl CommitHandler for ConditionalPutCommitHandler {
 1616 |     fn is_version_not_found_definitive(&self) -> bool {
 1617 |         true
 1618 |     }
 1619 | 
 1620 |     fn propagate_commit_error_after_success(&self) -> bool {
 1621 |         false
 1622 |     }
 1623 | 
 1624 |     async fn commit(
 1625 |         &self,
 1626 |         manifest: &mut Manifest,
 1627 |         indices: Option<Vec<IndexMetadata>>,
 1628 |         base_path: &Path,
 1629 |         object_store: &ObjectStore,
 1630 |         manifest_writer: ManifestWriter,
 1631 |         naming_scheme: ManifestNamingScheme,
 1632 |         transaction: Option<Transaction>,
 1633 |     ) -> std::result::Result<ManifestLocation, CommitError> {
 1634 |         let path = naming_scheme.manifest_path(base_path, manifest.version);
 1635 | 
 1636 |         let memory_store = ObjectStore::memory();
 1637 |         let dummy_path = "dummy";
 1638 |         manifest_writer(
 1639 |             &memory_store,
 1640 |             manifest,
 1641 |             indices,
 1642 |             &dummy_path.into(),
 1643 |             transaction,
 1644 |         )
 1645 |         .await?;
 1646 |         let dummy_data = memory_store.read_one_all(&dummy_path.into()).await?;
 1647 |         let size = dummy_data.len() as u64;
 1648 |         let res = object_store
 1649 |             .inner
 1650 |             .put_opts(
 1651 |                 &path,
 1652 |                 dummy_data.into(),
 1653 |                 PutOptions {
 1654 |                     mode: object_store::PutMode::Create,
 1655 |                     ..Default::default()
 1656 |                 },
 1657 |             )
 1658 |             .await
 1659 |             .map_err(|err| match err {
 1660 |                 ObjectStoreError::AlreadyExists { .. } | ObjectStoreError::Precondition { .. } => {
 1661 |                     CommitError::CommitConflict
 1662 |                 }
 1663 |                 _ => CommitError::OtherError(err.into()),
 1664 |             })?;
 1665 | 
 1666 |         write_version_hint(object_store, base_path, manifest.version).await;
 1667 | 
 1668 |         Ok(ManifestLocation {
 1669 |             version: manifest.version,
 1670 |             path,
 1671 |             size: Some(size),
 1672 |             naming_scheme,
 1673 |             e_tag: res.e_tag,
 1674 |             identity: None,
 1675 |         })
 1676 |     }
 1677 | }
 1678 | 
 1679 | impl Debug for ConditionalPutCommitHandler {
 1680 |     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
 1681 |         f.debug_struct("ConditionalPutCommitHandler").finish()
 1682 |     }
 1683 | }
 1684 | 
 1685 | /// A read-capable handler that prevents unsafe default commits to Tencent COS.
 1686 | ///
 1687 | /// COS silently ignores its put-if-not-exists header on buckets that have ever
 1688 | /// had versioning enabled. Since that bucket history cannot be inferred from
 1689 | /// the URI or storage options, using [`ConditionalPutCommitHandler`] here can
 1690 | /// let concurrent writers overwrite the same manifest without reporting a
 1691 | /// conflict.
 1692 | struct TencentCosCommitHandler;
 1693 | 
 1694 | #[async_trait::async_trait]
 1695 | impl CommitHandler for TencentCosCommitHandler {
 1696 |     fn is_version_not_found_definitive(&self) -> bool {
 1697 |         true
 1698 |     }
 1699 | 
 1700 |     async fn commit(
 1701 |         &self,
 1702 |         _manifest: &mut Manifest,
 1703 |         _indices: Option<Vec<IndexMetadata>>,
 1704 |         _base_path: &Path,
 1705 |         _object_store: &ObjectStore,
 1706 |         _manifest_writer: ManifestWriter,
 1707 |         _naming_scheme: ManifestNamingScheme,
 1708 |         _transaction: Option<Transaction>,
 1709 |     ) -> std::result::Result<ManifestLocation, CommitError> {
 1710 |         Err(CommitError::OtherError(Error::not_supported(
 1711 |             "Default writes to Tencent COS are disabled because COS does not reliably enforce \
 1712 |              put-if-not-exists after bucket versioning has ever been enabled. Provide a \
 1713 |              distributed commit_lock in Python or a custom CommitHandler in Rust.",
 1714 |         )))
 1715 |     }
 1716 | }
 1717 | 
 1718 | impl Debug for TencentCosCommitHandler {
 1719 |     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
 1720 |         f.debug_struct("TencentCosCommitHandler").finish()
 1721 |     }
 1722 | }
 1723 | 
 1724 | /// A manifest as a commit handler identifies it: its version and a token
 1725 | /// unique to that physical manifest, so a dataset recreated at the same
 1726 | /// version is told apart.
 1727 | #[derive(Debug, Clone, PartialEq, Eq)]
 1728 | pub struct PredecessorIdentity {
 1729 |     pub version: u64,
 1730 |     pub identity: String,
 1731 | }
 1732 | 
 1733 | #[derive(Debug, Clone)]
 1734 | pub struct CommitConfig {
 1735 |     pub num_retries: u32,
 1736 |     pub skip_auto_cleanup: bool,
 1737 |     // TODO: add isolation_level
 1738 | }
 1739 | 
 1740 | impl Default for CommitConfig {
 1741 |     fn default() -> Self {
 1742 |         Self {
 1743 |             num_retries: 20,
 1744 |             skip_auto_cleanup: false,
 1745 |         }
 1746 |     }
 1747 | }
 1748 | 
 1749 | #[cfg(test)]
 1750 | mod tests {
 1751 |     use std::sync::Mutex;
 1752 |     use std::sync::atomic::{AtomicUsize, Ordering};
 1753 | 
 1754 |     use lance_core::utils::tempfile::TempObjDir;
 1755 |     use lance_core::utils::testing::{ProxyObjectStore, ProxyObjectStorePolicy};
 1756 | 
 1757 |     use super::*;
 1758 | 
 1759 |     #[test]
 1760 |     fn test_manifest_naming_scheme() {
 1761 |         let v1 = ManifestNamingScheme::V1;
 1762 |         let v2 = ManifestNamingScheme::V2;
 1763 | 
 1764 |         assert_eq!(
 1765 |             v1.manifest_path(&Path::from("base"), 0),
 1766 |             Path::from("base/_versions/0.manifest")
 1767 |         );
 1768 |         assert_eq!(
 1769 |             v1.manifest_path(&Path::from("base"), 42),
 1770 |             Path::from("base/_versions/42.manifest")
 1771 |         );
 1772 | 
 1773 |         assert_eq!(
 1774 |             v2.manifest_path(&Path::from("base"), 0),
 1775 |             Path::from("base/_versions/18446744073709551615.manifest")
 1776 |         );
 1777 |         assert_eq!(
 1778 |             v2.manifest_path(&Path::from("base"), 42),
 1779 |             Path::from("base/_versions/18446744073709551573.manifest")
 1780 |         );
 1781 | 
 1782 |         assert_eq!(v1.parse_version("0.manifest"), Some(0));
 1783 |         assert_eq!(v1.parse_version("42.manifest"), Some(42));
 1784 |         assert_eq!(
 1785 |             v1.parse_version("42.manifest-cee4fbbb-eb19-4ea3-8ca7-54f5ec33dedc"),
 1786 |             Some(42)
 1787 |         );
 1788 | 
 1789 |         assert_eq!(v2.parse_version("18446744073709551615.manifest"), Some(0));
 1790 |         assert_eq!(v2.parse_version("18446744073709551573.manifest"), Some(42));
 1791 |         assert_eq!(
 1792 |             v2.parse_version("18446744073709551573.manifest-cee4fbbb-eb19-4ea3-8ca7-54f5ec33dedc"),
 1793 |             Some(42)
 1794 |         );
 1795 | 
 1796 |         assert_eq!(ManifestNamingScheme::detect_scheme("0.manifest"), Some(v1));
 1797 |         assert_eq!(
 1798 |             ManifestNamingScheme::detect_scheme("18446744073709551615.manifest"),
 1799 |             Some(v2)
 1800 |         );
 1801 |         assert_eq!(ManifestNamingScheme::detect_scheme("something else"), None);
 1802 |     }
 1803 | 
 1804 |     #[tokio::test]
 1805 |     async fn test_manifest_naming_migration() {
 1806 |         let object_store = ObjectStore::memory();
 1807 |         let base = Path::from("base");
 1808 |         let versions_dir = base.clone().join(VERSIONS_DIR);
 1809 | 
 1810 |         // Write two v1 files and one v1
 1811 |         let original_files = vec![
 1812 |             versions_dir.clone().join("irrelevant"),
 1813 |             ManifestNamingScheme::V1.manifest_path(&base, 0),
 1814 |             ManifestNamingScheme::V2.manifest_path(&base, 1),
 1815 |         ];
 1816 |         for path in original_files {
 1817 |             object_store.put(&path, b"".as_slice()).await.unwrap();
 1818 |         }
 1819 | 
 1820 |         migrate_scheme_to_v2(&object_store, &base).await.unwrap();
 1821 | 
 1822 |         let expected_files = vec![
 1823 |             ManifestNamingScheme::V2.manifest_path(&base, 1),
 1824 |             ManifestNamingScheme::V2.manifest_path(&base, 0),
 1825 |             versions_dir.clone().join("irrelevant"),
 1826 |         ];
 1827 |         let actual_files = object_store
 1828 |             .inner
 1829 |             .list(Some(&versions_dir))
 1830 |             .map_ok(|res| res.location)
 1831 |             .try_collect::<Vec<_>>()
 1832 |             .await
 1833 |             .unwrap();
 1834 |         assert_eq!(actual_files, expected_files);
 1835 |     }
 1836 | 
 1837 |     #[tokio::test]
 1838 |     #[rstest::rstest]
 1839 |     async fn test_list_manifests_sorted(
 1840 |         #[values(true, false)] lexical_list_store: bool,
 1841 |         #[values(ManifestNamingScheme::V1, ManifestNamingScheme::V2)]
 1842 |         naming_scheme: ManifestNamingScheme,
 1843 |     ) {
 1844 |         let tempdir;
 1845 |         let (object_store, base) = if lexical_list_store {
 1846 |             (Box::new(ObjectStore::memory()), Path::from("base"))
 1847 |         } else {
 1848 |             tempdir = TempObjDir::default();
 1849 |             let path = tempdir.clone().join("base");
 1850 |             let store = Box::new(ObjectStore::local());
 1851 |             assert!(!store.list_is_lexically_ordered);
 1852 |             (store, path)
 1853 |         };
 1854 | 
 1855 |         // Write 12 manifest files, latest first
 1856 |         let mut expected_paths = Vec::new();
 1857 |         for i in (0..12).rev() {
 1858 |             let path = naming_scheme.manifest_path(&base, i);
 1859 |             object_store.put(&path, b"".as_slice()).await.unwrap();
 1860 |             expected_paths.push(path);
 1861 |         }
 1862 | 
 1863 |         let actual_versions = ConditionalPutCommitHandler
 1864 |             .list_manifest_locations(&base, &object_store, true)
 1865 |             .map_ok(|location| location.path)
 1866 |             .try_collect::<Vec<_>>()
 1867 |             .await
 1868 |             .unwrap();
 1869 | 
 1870 |         assert_eq!(actual_versions, expected_paths);
 1871 |     }
 1872 | 
 1873 |     #[tokio::test]
 1874 |     #[rstest::rstest]
 1875 |     async fn test_current_manifest_path(
 1876 |         #[values(true, false)] lexical_list_store: bool,
 1877 |         #[values(ManifestNamingScheme::V1, ManifestNamingScheme::V2)]
 1878 |         naming_scheme: ManifestNamingScheme,
 1879 |     ) {
 1880 |         // Use memory store for both cases to avoid local FS special codepath.
 1881 |         // Modify list_is_lexically_ordered to simulate different object stores.
 1882 |         let mut object_store = ObjectStore::memory();
 1883 |         object_store.list_is_lexically_ordered = lexical_list_store;
 1884 |         let object_store = Box::new(object_store);
 1885 |         let base = Path::from("base");
 1886 | 
 1887 |         // Write 12 manifest files in non-sequential order
 1888 |         for version in [5, 2, 11, 0, 8, 3, 10, 1, 7, 4, 9, 6] {
 1889 |             let path = naming_scheme.manifest_path(&base, version);
 1890 |             object_store.put(&path, b"".as_slice()).await.unwrap();
 1891 |         }
 1892 | 
 1893 |         let location = current_manifest_path(&object_store, &base).await.unwrap();
 1894 | 
 1895 |         assert_eq!(location.version, 11);
 1896 |         assert_eq!(location.naming_scheme, naming_scheme);
 1897 |         assert_eq!(location.path, naming_scheme.manifest_path(&base, 11));
 1898 |     }
 1899 | 
 1900 |     /// A memory store that reports `list_is_lexically_ordered == false`, like
 1901 |     /// S3 Express, so the version-hint paths are exercised.
 1902 |     fn non_lexical_memory_store() -> Box<ObjectStore> {
 1903 |         let mut object_store = ObjectStore::memory();
 1904 |         object_store.list_is_lexically_ordered = false;
 1905 |         Box::new(object_store)
 1906 |     }
 1907 | 
 1908 |     #[tokio::test]
 1909 |     async fn test_write_version_hint() {
 1910 |         let base = Path::from("base");
 1911 | 
 1912 |         // No hint is written on lexically-ordered stores (it would not be read).
 1913 |         let lexical = ObjectStore::memory();
 1914 |         write_version_hint(&lexical, &base, 42).await;
 1915 |         assert_eq!(read_version_from_hint(&lexical, &base).await, None);
 1916 | 
 1917 |         let object_store = non_lexical_memory_store();
 1918 |         write_version_hint(&object_store, &base, 42).await;
 1919 |         assert_eq!(read_version_from_hint(&object_store, &base).await, Some(42));
 1920 | 
 1921 |         // A later commit overwrites the hint.
 1922 |         write_version_hint(&object_store, &base, 100).await;
 1923 |         assert_eq!(
 1924 |             read_version_from_hint(&object_store, &base).await,
 1925 |             Some(100)
 1926 |         );
 1927 | 
 1928 |         // Detached versions are never written to the hint.
 1929 |         write_version_hint(
 1930 |             &object_store,
 1931 |             &base,
 1932 |             crate::format::DETACHED_VERSION_MASK | 7,
 1933 |         )
 1934 |         .await;
 1935 |         assert_eq!(
 1936 |             read_version_from_hint(&object_store, &base).await,
 1937 |             Some(100)
 1938 |         );
 1939 | 
 1940 |         // A corrupt / non-JSON hint file is treated as missing.
 1941 |         let hint_path = version_hint_path(&base);
 1942 |         object_store
 1943 |             .put(&hint_path, b"not json".as_slice())
 1944 |             .await
 1945 |             .unwrap();
 1946 |         assert_eq!(read_version_from_hint(&object_store, &base).await, None);
 1947 |     }
 1948 | 
 1949 |     #[tokio::test]
 1950 |     #[rstest::rstest]
 1951 |     async fn test_read_version_hint_and_probe(
 1952 |         #[values(ManifestNamingScheme::V1, ManifestNamingScheme::V2)]
 1953 |         naming_scheme: ManifestNamingScheme,
 1954 |     ) {
 1955 |         let object_store = non_lexical_memory_store();
 1956 |         let base = Path::from("base");
 1957 | 
 1958 |         // No hint file yet.
 1959 |         assert!(
 1960 |             read_version_hint_and_probe(&object_store, &base)
 1961 |                 .await
 1962 |                 .is_none()
 1963 |         );
 1964 | 
 1965 |         for version in 1..=5 {
 1966 |             object_store
 1967 |                 .put(&naming_scheme.manifest_path(&base, version), b"".as_slice())
 1968 |                 .await
 1969 |                 .unwrap();
 1970 |         }
 1971 | 
 1972 |         // Stale hint: should probe forward and find version 5.
 1973 |         write_version_hint(&object_store, &base, 3).await;
 1974 |         let location = read_version_hint_and_probe(&object_store, &base)
 1975 |             .await
 1976 |             .unwrap();
 1977 |         assert_eq!(location.version, 5);
 1978 |         assert_eq!(location.naming_scheme, naming_scheme);
 1979 | 
 1980 |         // Up-to-date hint: returns version 5 directly.
 1981 |         write_version_hint(&object_store, &base, 5).await;
 1982 |         let location = read_version_hint_and_probe(&object_store, &base)
 1983 |             .await
 1984 |             .unwrap();
 1985 |         assert_eq!(location.version, 5);
 1986 | 
 1987 |         // Hint points past the latest version: not usable.
 1988 |         write_version_hint(&object_store, &base, 10).await;
 1989 |         assert!(
 1990 |             read_version_hint_and_probe(&object_store, &base)
 1991 |                 .await
 1992 |                 .is_none()
 1993 |         );
 1994 |     }
 1995 | 
 1996 |     #[tokio::test]
 1997 |     async fn test_list_manifests_since_version_with_hint() {
 1998 |         let object_store = non_lexical_memory_store();
 1999 |         let base = Path::from("base");
 2000 |         let scheme = ManifestNamingScheme::V2;
 2001 | 
 2002 |         for version in 1..=10 {
 2003 |             object_store
 2004 |                 .put(&scheme.manifest_path(&base, version), b"".as_slice())
 2005 |                 .await
 2006 |                 .unwrap();
 2007 |         }
 2008 | 
 2009 |         // No hint yet -> not usable, caller must fall back.
 2010 |         assert!(
 2011 |             list_manifests_since_version_with_hint(&object_store, &base, 7)
 2012 |                 .await
 2013 |                 .is_none()
 2014 |         );
 2015 | 
 2016 |         // Hint exactly at the read version -> fast path, nothing new.
 2017 |         write_version_hint(&object_store, &base, 10).await;
 2018 |         assert!(matches!(
 2019 |             list_manifests_since_version_with_hint(&object_store, &base, 10).await,
 2020 |             Some(v) if v.is_empty()
 2021 |         ));
 2022 | 
 2023 |         // Hint ahead of the read version, with a gap to fill (8, 9) plus probing
 2024 |         // from the hint (10). Results are descending by version.
 2025 |         let locations = list_manifests_since_version_with_hint(&object_store, &base, 7)
 2026 |             .await
 2027 |             .unwrap();
 2028 |         assert_eq!(
 2029 |             locations.iter().map(|l| l.version).collect::<Vec<_>>(),
 2030 |             vec![10, 9, 8]
 2031 |         );
 2032 | 
 2033 |         // Slightly stale hint (points at 8) still probes up to the true latest.
 2034 |         write_version_hint(&object_store, &base, 8).await;
 2035 |         let locations = list_manifests_since_version_with_hint(&object_store, &base, 7)
 2036 |             .await
 2037 |             .unwrap();
 2038 |         assert_eq!(
 2039 |             locations.iter().map(|l| l.version).collect::<Vec<_>>(),
 2040 |             vec![10, 9, 8]
 2041 |         );
 2042 | 
 2043 |         // Hint points past the latest -> not usable, caller falls back.
 2044 |         write_version_hint(&object_store, &base, 20).await;
 2045 |         assert!(
 2046 |             list_manifests_since_version_with_hint(&object_store, &base, 7)
 2047 |                 .await
 2048 |                 .is_none()
 2049 |         );
 2050 |     }
 2051 | 
 2052 |     #[tokio::test]
 2053 |     async fn test_current_manifest_path_with_hint_non_lexical() {
 2054 |         // Simulate S3 Express (non-lexically ordered list) with many versions.
 2055 |         let object_store = non_lexical_memory_store();
 2056 |         let base = Path::from("base");
 2057 |         let naming_scheme = ManifestNamingScheme::V2;
 2058 | 
 2059 |         for version in 1..=100 {
 2060 |             object_store
 2061 |                 .put(&naming_scheme.manifest_path(&base, version), b"".as_slice())
 2062 |                 .await
 2063 |                 .unwrap();
 2064 |         }
 2065 | 
 2066 |         // Slightly stale hint: probing from 98 still resolves the true latest.
 2067 |         write_version_hint(&object_store, &base, 98).await;
 2068 |         let location = current_manifest_path(&object_store, &base).await.unwrap();
 2069 |         assert_eq!(location.version, 100);
 2070 |     }
 2071 | 
 2072 |     #[tokio::test]
 2073 |     async fn test_current_manifest_path_with_stale_hint_falls_back_to_listing() {
 2074 |         let object_store = non_lexical_memory_store();
 2075 |         let base = Path::from("base");
 2076 |         let naming_scheme = ManifestNamingScheme::V2;
 2077 | 
 2078 |         // Only version 5 exists, but the hint claims version 10.
 2079 |         object_store
 2080 |             .put(&naming_scheme.manifest_path(&base, 5), b"".as_slice())
 2081 |             .await
 2082 |             .unwrap();
 2083 |         write_version_hint(&object_store, &base, 10).await;
 2084 | 
 2085 |         // The stale hint is ignored; listing finds version 5.
 2086 |         let location = current_manifest_path(&object_store, &base).await.unwrap();
 2087 |         assert_eq!(location.version, 5);
 2088 |     }
 2089 | 
 2090 |     #[test]
 2091 |     fn test_parse_detached_version() {
 2092 |         // Valid detached version filenames
 2093 |         assert_eq!(
 2094 |             ManifestNamingScheme::parse_detached_version("d12345.manifest"),
 2095 |             Some(12345)
 2096 |         );
 2097 |         assert_eq!(
 2098 |             ManifestNamingScheme::parse_detached_version("d9223372036854775808.manifest"),
 2099 |             Some(9223372036854775808)
 2100 |         );
 2101 | 
 2102 |         // Invalid: not starting with 'd' prefix
 2103 |         assert_eq!(
 2104 |             ManifestNamingScheme::parse_detached_version("12345.manifest"),
 2105 |             None
 2106 |         );
 2107 | 
 2108 |         // Invalid: regular V2 manifest
 2109 |         assert_eq!(
 2110 |             ManifestNamingScheme::parse_detached_version("18446744073709551615.manifest"),
 2111 |             None
 2112 |         );
 2113 | 
 2114 |         // Invalid: no extension
 2115 |         assert_eq!(ManifestNamingScheme::parse_detached_version("d12345"), None);
 2116 |     }
 2117 | 
 2118 |     #[tokio::test]
 2119 |     async fn test_list_detached_manifests() {
 2120 |         use crate::format::DETACHED_VERSION_MASK;
 2121 |         use futures::TryStreamExt;
 2122 | 
 2123 |         let object_store = ObjectStore::memory();
 2124 |         let base = Path::from("base");
 2125 |         let versions_dir = base.clone().join(VERSIONS_DIR);
 2126 | 
 2127 |         // Create some regular manifests
 2128 |         for version in [1, 2, 3] {
 2129 |             let path = ManifestNamingScheme::V2.manifest_path(&base, version);
 2130 |             object_store.put(&path, b"".as_slice()).await.unwrap();
 2131 |         }
 2132 | 
 2133 |         // Create some detached manifests
 2134 |         let detached_versions: Vec<u64> = vec![
 2135 |             100 | DETACHED_VERSION_MASK,
 2136 |             200 | DETACHED_VERSION_MASK,
 2137 |             300 | DETACHED_VERSION_MASK,
 2138 |         ];
 2139 |         for version in &detached_versions {
 2140 |             let path = versions_dir.clone().join(format!("d{}.manifest", version));
 2141 |             object_store.put(&path, b"".as_slice()).await.unwrap();
 2142 |         }
 2143 | 
 2144 |         // List detached manifests
 2145 |         let detached_locations: Vec<ManifestLocation> =
 2146 |             list_detached_manifests(&base, &object_store.inner)
 2147 |                 .try_collect()
 2148 |                 .await
 2149 |                 .unwrap();
 2150 | 
 2151 |         assert_eq!(detached_locations.len(), 3);
 2152 |         for loc in &detached_locations {
 2153 |             assert_eq!(loc.naming_scheme, ManifestNamingScheme::V2);
 2154 |         }
 2155 | 
 2156 |         let mut found_versions: Vec<u64> = detached_locations.iter().map(|l| l.version).collect();
 2157 |         found_versions.sort();
 2158 |         let mut expected_versions = detached_versions.clone();
 2159 |         expected_versions.sort();
 2160 |         assert_eq!(found_versions, expected_versions);
 2161 |     }
 2162 | 
 2163 |     #[tokio::test]
 2164 |     #[rstest::rstest]
 2165 |     #[case::memory("memory://bucket-a/ds")]
 2166 |     #[case::shared_memory("shared-memory://bucket-a/ds")]
 2167 |     #[case::s3("s3://bucket-a/ds")]
 2168 |     #[case::gs("gs://bucket-a/ds")]
 2169 |     #[case::az("az://bucket-a/ds")]
 2170 |     #[case::abfss("abfss://bucket-a/ds")]
 2171 |     #[case::oss("oss://bucket-a/ds")]
 2172 |     #[case::tos("tos://bucket-a/ds")]
 2173 |     #[case::goosefs("goosefs://bucket-a/ds")]
 2174 |     async fn test_commit_handler_from_url_conditional_put_schemes(#[case] url: &str) {
 2175 |         // Every scheme whose store supports atomic put-if-not-exists must
 2176 |         // route to ConditionalPutCommitHandler — otherwise concurrent writers
 2177 |         // fall through to UnsafeCommitHandler and silently clobber each
 2178 |         // other's manifests.
 2179 |         let handler = commit_handler_from_url(url, &None).await.unwrap();
 2180 |         assert_eq!(
 2181 |             format!("{:?}", handler),
 2182 |             "ConditionalPutCommitHandler",
 2183 |             "{url} should route to ConditionalPutCommitHandler",
 2184 |         );
 2185 |     }
 2186 | 
 2187 |     /// A [CommitLock] whose lease records whether it was released, so we can
 2188 |     /// assert the lock does not leak when the commit future is cancelled.
 2189 |     #[derive(Debug)]
 2190 |     struct TrackingLock {
 2191 |         released: Arc<AtomicBool>,
 2192 |     }
 2193 | 
 2194 |     struct TrackingLease {
 2195 |         released: Arc<AtomicBool>,
 2196 |     }
 2197 | 
 2198 |     #[async_trait::async_trait]
 2199 |     impl CommitLock for TrackingLock {
 2200 |         type Lease = TrackingLease;
 2201 |         async fn lock(&self, _version: u64) -> std::result::Result<Self::Lease, CommitError> {
 2202 |             Ok(TrackingLease {
 2203 |                 released: self.released.clone(),
 2204 |             })
 2205 |         }
 2206 |     }
 2207 | 
 2208 |     #[async_trait::async_trait]
 2209 |     impl CommitLease for TrackingLease {
 2210 |         async fn release(&self, _success: bool) -> std::result::Result<(), CommitError> {
 2211 |             self.released
 2212 |                 .store(true, std::sync::atomic::Ordering::SeqCst);
 2213 |             Ok(())
 2214 |         }
 2215 |     }
 2216 | 
 2217 |     /// A [CommitLock] whose lease hangs on its first `release` call but completes
 2218 |     /// on subsequent ones, so we can assert the drop-path best-effort release
 2219 |     /// fires when a commit is cancelled *during* the explicit release.
 2220 |     #[derive(Debug)]
 2221 |     struct HangingReleaseLock {
 2222 |         release_calls: Arc<AtomicUsize>,
 2223 |         released: Arc<AtomicBool>,
 2224 |     }
 2225 | 
 2226 |     struct HangingReleaseLease {
 2227 |         release_calls: Arc<AtomicUsize>,
 2228 |         released: Arc<AtomicBool>,
 2229 |     }
 2230 | 
 2231 |     #[async_trait::async_trait]
 2232 |     impl CommitLock for HangingReleaseLock {
 2233 |         type Lease = HangingReleaseLease;
 2234 |         async fn lock(&self, _version: u64) -> std::result::Result<Self::Lease, CommitError> {
 2235 |             Ok(HangingReleaseLease {
 2236 |                 release_calls: self.release_calls.clone(),
 2237 |                 released: self.released.clone(),
 2238 |             })
 2239 |         }
 2240 |     }
 2241 | 
 2242 |     #[async_trait::async_trait]
 2243 |     impl CommitLease for HangingReleaseLease {
 2244 |         async fn release(&self, _success: bool) -> std::result::Result<(), CommitError> {
 2245 |             // The first release (the explicit one) hangs, simulating a release
 2246 |             // call that stalls long enough for the commit timeout to fire. The
 2247 |             // best-effort release issued from `Drop` is the second call and
 2248 |             // succeeds.
 2249 |             if self
 2250 |                 .release_calls
 2251 |                 .fetch_add(1, std::sync::atomic::Ordering::SeqCst)
 2252 |                 == 0
 2253 |             {
 2254 |                 future::pending::<()>().await;
 2255 |                 unreachable!()
 2256 |             }
 2257 |             self.released
 2258 |                 .store(true, std::sync::atomic::Ordering::SeqCst);
 2259 |             Ok(())
 2260 |         }
 2261 |     }
 2262 | 
 2263 |     /// A manifest writer that succeeds immediately, so the commit reaches the
 2264 |     /// explicit lease release.
 2265 |     fn succeeding_manifest_writer<'a>(
 2266 |         _object_store: &'a ObjectStore,
 2267 |         _manifest: &'a mut Manifest,
 2268 |         _indices: Option<Vec<IndexMetadata>>,
 2269 |         _path: &'a Path,
 2270 |         _transaction: Option<Transaction>,
 2271 |     ) -> BoxFuture<'a, Result<WriteResult>> {
 2272 |         Box::pin(async move { Ok(WriteResult::default()) })
 2273 |     }
 2274 | 
 2275 |     fn test_manifest() -> Manifest {
 2276 |         use std::collections::HashMap;
 2277 | 
 2278 |         use arrow_schema::{DataType, Field as ArrowField, Schema as ArrowSchema};
 2279 |         use lance_core::datatypes::Schema;
 2280 |         use lance_file::version::LanceFileVersion;
 2281 | 
 2282 |         use crate::format::DataStorageFormat;
 2283 | 
 2284 |         let arrow_schema = ArrowSchema::new(vec![ArrowField::new("i", DataType::Int32, false)]);
 2285 |         Manifest::new(
 2286 |             Schema::try_from(&arrow_schema).unwrap(),
 2287 |             Arc::new(vec![]),
 2288 |             DataStorageFormat::new(LanceFileVersion::Stable.resolve()),
 2289 |             HashMap::new(),
 2290 |         )
 2291 |     }
 2292 | 
 2293 |     #[tokio::test]
 2294 |     async fn test_cos_commit_requires_custom_handler() {
 2295 |         let handler = commit_handler_from_url("cos://bucket-a/ds", &None)
 2296 |             .await
 2297 |             .unwrap();
 2298 |         assert_eq!(format!("{:?}", handler), "TencentCosCommitHandler");
 2299 | 
 2300 |         let mut manifest = test_manifest();
 2301 |         let error = handler
 2302 |             .commit(
 2303 |                 &mut manifest,
 2304 |                 None,
 2305 |                 &Path::from("test"),
 2306 |                 &ObjectStore::memory(),
 2307 |                 succeeding_manifest_writer,
 2308 |                 ManifestNamingScheme::V2,
 2309 |                 None,
 2310 |             )
 2311 |             .await
 2312 |             .unwrap_err();
 2313 |         let CommitError::OtherError(error) = error else {
 2314 |             panic!("expected a not-supported commit error");
 2315 |         };
 2316 |         assert!(matches!(error, Error::NotSupported { .. }));
 2317 |         assert!(error.to_string().contains("distributed commit_lock"));
 2318 |     }
 2319 | 
 2320 |     /// A manifest writer that never completes, simulating a hung object store.
 2321 |     fn hanging_manifest_writer<'a>(
 2322 |         _object_store: &'a ObjectStore,
 2323 |         _manifest: &'a mut Manifest,
 2324 |         _indices: Option<Vec<IndexMetadata>>,
 2325 |         _path: &'a Path,
 2326 |         _transaction: Option<Transaction>,
 2327 |     ) -> BoxFuture<'a, Result<WriteResult>> {
 2328 |         Box::pin(async move {
 2329 |             future::pending::<()>().await;
 2330 |             unreachable!()
 2331 |         })
 2332 |     }
 2333 | 
 2334 |     /// Cancelling a commit (as a commit timeout does) while the lock is held must
 2335 |     /// still release the lock; otherwise it leaks until the lease's TTL expires.
 2336 |     #[tokio::test]
 2337 |     async fn test_commit_lock_released_on_cancellation() {
 2338 |         use std::sync::atomic::Ordering;
 2339 |         use std::time::Duration;
 2340 | 
 2341 |         let released = Arc::new(AtomicBool::new(false));
 2342 |         let lock = TrackingLock {
 2343 |             released: released.clone(),
 2344 |         };
 2345 | 
 2346 |         let object_store = ObjectStore::memory();
 2347 |         let base_path = Path::from("test");
 2348 |         let mut manifest = test_manifest();
 2349 | 
 2350 |         // The commit will hang on the manifest writer while holding the lock.
 2351 |         // Cancel it the same way a commit timeout would: drop the future.
 2352 |         let commit_fut = lock.commit(
 2353 |             &mut manifest,
 2354 |             None,
 2355 |             &base_path,
 2356 |             &object_store,
 2357 |             hanging_manifest_writer,
 2358 |             ManifestNamingScheme::V2,
 2359 |             None,
 2360 |         );
 2361 |         let timed_out = tokio::time::timeout(Duration::from_millis(50), commit_fut).await;
 2362 |         assert!(timed_out.is_err(), "commit should not have completed");
 2363 | 
 2364 |         // The drop guard releases the lock on a background task; wait for it.
 2365 |         for _ in 0..100 {
 2366 |             if released.load(Ordering::SeqCst) {
 2367 |                 break;
 2368 |             }
 2369 |             tokio::time::sleep(Duration::from_millis(10)).await;
 2370 |         }
 2371 |         assert!(
 2372 |             released.load(Ordering::SeqCst),
 2373 |             "lock must be released after the commit future is cancelled"
 2374 |         );
 2375 |     }
 2376 | 
 2377 |     /// Cancelling a commit *during* the explicit lease release (e.g. the release
 2378 |     /// call itself hangs and the commit timeout fires) must still release the
 2379 |     /// lock via the drop-path best-effort release.
 2380 |     #[tokio::test]
 2381 |     async fn test_commit_lock_released_on_cancellation_during_release() {
 2382 |         use std::sync::atomic::Ordering;
 2383 |         use std::time::Duration;
 2384 | 
 2385 |         let release_calls = Arc::new(AtomicUsize::new(0));
 2386 |         let released = Arc::new(AtomicBool::new(false));
 2387 |         let lock = HangingReleaseLock {
 2388 |             release_calls: release_calls.clone(),
 2389 |             released: released.clone(),
 2390 |         };
 2391 | 
 2392 |         let object_store = ObjectStore::memory();
 2393 |         let base_path = Path::from("test");
 2394 |         let mut manifest = test_manifest();
 2395 | 
 2396 |         // The manifest writer succeeds, so the commit reaches the explicit
 2397 |         // release, which hangs. Cancel it the same way a commit timeout would.
 2398 |         let commit_fut = lock.commit(
 2399 |             &mut manifest,
 2400 |             None,
 2401 |             &base_path,
 2402 |             &object_store,
 2403 |             succeeding_manifest_writer,
 2404 |             ManifestNamingScheme::V2,
 2405 |             None,
 2406 |         );
 2407 |         let timed_out = tokio::time::timeout(Duration::from_millis(50), commit_fut).await;
 2408 |         assert!(timed_out.is_err(), "commit should not have completed");
 2409 | 
 2410 |         // The drop guard issues a best-effort release on a background task; wait
 2411 |         // for it. This is the second release call (the first one hung).
 2412 |         for _ in 0..100 {
 2413 |             if released.load(Ordering::SeqCst) {
 2414 |                 break;
 2415 |             }
 2416 |             tokio::time::sleep(Duration::from_millis(10)).await;
 2417 |         }
 2418 |         assert!(
 2419 |             released.load(Ordering::SeqCst),
 2420 |             "lock must be released even when cancelled during the explicit release"
 2421 |         );
 2422 |         assert_eq!(
 2423 |             release_calls.load(Ordering::SeqCst),
 2424 |             2,
 2425 |             "expected the hung explicit release plus one best-effort drop release"
 2426 |         );
 2427 |     }
 2428 | 
 2429 |     /// The V2 naming scheme sorts the latest version first, so on a lexically
 2430 |     /// ordered store the resolver should stop at the first *valid* manifest.
 2431 |     /// Anything the filter drops sorts where its name sorts, so junk ahead of the
 2432 |     /// answer costs exactly itself and nothing behind the answer is read at all.
 2433 |     ///
 2434 |     /// Listing streams are lazy, so the entries the resolver pulls are exactly the
 2435 |     /// entries a real object store would be billed for.
 2436 |     #[rstest::rstest]
 2437 |     #[case::clean(false, 1)]
 2438 |     #[case::leftover_staging_manifest(true, 2)]
 2439 |     #[tokio::test]
 2440 |     async fn test_resolve_latest_version_stops_at_first_valid_manifest(
 2441 |         #[case] leftover_staging: bool,
 2442 |         #[case] expected_entries_listed: usize,
 2443 |     ) {
 2444 |         let mut object_store = ObjectStore::memory();
 2445 |         object_store.list_is_lexically_ordered = true;
 2446 | 
 2447 |         let base = Path::from("base");
 2448 |         for version in 0..10u64 {
 2449 |             let path = ManifestNamingScheme::V2.manifest_path(&base, version);
 2450 |             object_store.put(&path, b"".as_slice()).await.unwrap();
 2451 |         }
 2452 |         if leftover_staging {
 2453 |             // A staging manifest orphaned by an interrupted commit of version 10.
 2454 |             // Its inverted version is smaller than version 9's, so it sorts ahead
 2455 |             // of the answer, and `detect_scheme` drops it for the `-{uuid}` suffix.
 2456 |             let final_path = ManifestNamingScheme::V2.manifest_path(&base, 10);
 2457 |             let staging_path = make_staging_manifest_path(&final_path).unwrap();
 2458 |             object_store
 2459 |                 .put(&staging_path, b"".as_slice())
 2460 |                 .await
 2461 |                 .unwrap();
 2462 |         }
 2463 | 
 2464 |         let entries_listed = Arc::new(AtomicUsize::new(0));
 2465 |         let policy = Arc::new(Mutex::new(ProxyObjectStorePolicy::new()));
 2466 |         policy.lock().unwrap().set_obj_meta_policy(
 2467 |             "count_listed_entries",
 2468 |             Arc::new({
 2469 |                 let entries_listed = entries_listed.clone();
 2470 |                 move |op: &str, meta: object_store::ObjectMeta| {
 2471 |                     if op == "list" {
 2472 |                         entries_listed.fetch_add(1, Ordering::Relaxed);
 2473 |                     }
 2474 |                     Ok(meta)
 2475 |                 }
 2476 |             }),
 2477 |         );
 2478 |         object_store.inner = Arc::new(ProxyObjectStore::new(object_store.inner.clone(), policy));
 2479 | 
 2480 |         let location = current_manifest_path(&object_store, &base).await.unwrap();
 2481 |         assert_eq!(location.version, 9);
 2482 |         assert_eq!(
 2483 |             entries_listed.load(Ordering::Relaxed),
 2484 |             expected_entries_listed,
 2485 |             "the resolver must stop at the first valid manifest: the check that \
 2486 |              used to follow it drained up to a thousand more, spilling into \
 2487 |              further listing pages"
 2488 |         );
 2489 |     }
 2490 | }
``````
