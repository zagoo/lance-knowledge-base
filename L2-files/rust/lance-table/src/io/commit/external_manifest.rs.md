> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md).

# rust/lance-table/src/io/commit/external_manifest.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `f65dc6ebdef604a93d55061f67ee697460d79364471f91d57682df23dd214964`. Reviewed physical lines: 1-2553.

[Module](../../../../../../L1-modules/rust-lance-table-external-commit.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Defines the public ExternalManifestStore extension trait, Reservation result, generic finalize_staged helper and ExternalManifestCommitHandler. It implements generic selected-staging canonical publication and identity-conditioned unique-path publication, reader repair, external history integration, large-object streaming copy and deterministic local regression fixtures. (rust/lance-table/src/io/commit/external_manifest.rs:1-2553)

## Complete range analysis

### Lines 1-34

SPDX and module documentation introduce an external atomic put-if-not-exists coordinator. Imports connect async trait dispatch, streams, Arc, byte buffers, audit events, object-store metadata/errors, tracing, manifest body metadata, parent commit helpers and PredecessorIdentity. There is no local feature gate on this module; the concrete DynamoDB backend is separate. (rust/lance-table/src/io/commit/external_manifest.rs:1-34)

### Lines 35-103

Public async finalize_staged<S: ExternalManifestStore + ?Sized> accepts an already selected staging path, version, expected size, raw object store and naming scheme. It computes the canonical manifest path, calls copy_or_verify_final_manifest, then constructs a canonical ManifestLocation with Some(size), the observed ETag and identity None. It does not itself acquire or validate the external reservation. Correct use requires the caller to have selected these immutable staging bytes. After the canonical copy succeeds, finalize_staged updates the existing external record to the canonical path/size with ETag None. Any index-update error is warned and swallowed: return the committed canonical location and retain staging for a later helper. Thus external index compaction is subsequent repair work, not rollback authority over the durable canonical object. A failed earlier copy/HEAD still propagates before this branch. Once index publication succeeds, finalize_staged deletes staging. Success and object-store NotFound proceed to a DELETE audit; any other delete failure warns and returns the canonical location without the audit. Cleanup failure cannot overturn commit. This helper does not update the version hint and has no cancellation guard spanning these awaits. (rust/lance-table/src/io/commit/external_manifest.rs:35-103)

### Lines 104-116

Public Debug/Clone/PartialEq/Eq Reservation distinguishes Reserved { identity: String }, Taken and PredecessorChanged. The token identifies the new record incarnation; a taken target and a changed prerequisite are distinct outcomes. This enum validates neither token contents nor version relationships. (rust/lance-table/src/io/commit/external_manifest.rs:104-116)

### Lines 117-143

ExternalManifestStore documentation describes a coordinator and lookup index keyed by dataset URI/version, with object storage authoritative for generic manifest bytes. Generic protocol: write unique immutable staging bytes; atomically select one staging path; copy only the selected path to its deterministic canonical location; update the index and garbage-collect staging. Concurrent helpers may copy the same selected bytes. Losing writers must never materialize their own unselected bytes. (rust/lance-table/src/io/commit/external_manifest.rs:117-143)

### Lines 144-161

The trait documentation distinguishes physical object ETags from logical manifest/record identities: equivalent copies may change ETags, so the generic external protocol neither persists nor validates them. It assumes one dataset incarnation owns the physical prefix; arbitrary reuse needs separate incarnation protection. Its linked design image was not fetched. These generic canonical-path comments must be read separately from the later identity-bearing commit_after protocol, whose unique object is itself final. (rust/lance-table/src/io/commit/external_manifest.rs:144-161)

### Lines 162-215

Public async_trait ExternalManifestStore requires Debug + Send + Sync. Required get(base_uri, version) returns a path string. Default get_manifest_location calls get, parses Path with an InvalidInput conversion on failure, detects the naming scheme and returns the requested version with unknown size/ETag/identity. No HEAD, manifest decoding or filename/version consistency check occurs. Implementations that mint identities must override location production to preserve them. Required get_latest_version returns an optional (version, path) pair. Default get_latest_manifest_location maps that pair through path parsing and scheme detection and leaves size, ETag and identity None; None means no indexed version. It does not read object bytes or check existence. The default cannot manufacture identity metadata; the test identified store supplies an override. The canonical-path documentation does not describe every later override/conditioned-publication path. (rust/lance-table/src/io/commit/external_manifest.rs:162-215)

### Lines 216-285

Default async put takes a selected-version candidate plus staging metadata and raw object-store handle. It deliberately ignores its ETag argument, calls put_if_not_exists with ETag None, and returns immediately on reservation error. Successful reservation proceeds to the overridable finalize hook; put itself contains no staging cleanup or retry. Atomic single-winner selection is a contract of the external implementation, not an in-process mutex here. Default put awaits finalize with the same base/version/path/size/store/scheme. Public async finalize delegates to finalize_staged; its documentation permits stores such as namespace-backed implementations to override publication. These hooks are separate from ExternalManifestCommitHandler's private reader finalizer, which directly runs the generic copy/repair protocol. A custom writer-side finalize override must therefore coordinate the form of locations returned to readers. (rust/lance-table/src/io/commit/external_manifest.rs:216-285)

### Lines 286-369

supports_predecessor_condition defaults false; its contract requires supporting stores to populate ManifestLocation.identity. get_identity defaults Ok(None) and documents an immutable per-record incarnation token that is never reused. Support declaration alone does not enforce identity population, atomicity, retirement or listing behavior. Optional list_versions(base_uri, since) defaults Ok(None), selecting object-store fallback. A supported implementation returns all committed locations, optionally restricted to versions greater than since, carrying final paths and identities. This is required to discover predecessor-conditioned publications whose unique final filenames are invisible to ordinary manifest parsing; Some(empty) remains an authoritative empty history. Exact signatures are retained below. forget_version defaults to NotSupported and requires identity-conditional, idempotent removal when implemented; it differs from the parent CommitHandler default no-op. put_if_predecessor likewise defaults NotSupported and must atomically verify the supplied predecessor record identity and reserve the requested new version. This abstraction specifies a prerequisite record condition, not an enforced latest-version or adjacent-version check. Required put_if_not_exists and put_if_exists accept base URI, u64 version, path, u64 size and optional ETag; implementations receiving None must clear obsolete stored ETags. Generic workflow always supplies None. Optional delete defaults Ok(()) without action. Trait closure and spacing complete these extension boundaries; storage-specific atomic operations, schema and error mapping live in concrete implementations. (rust/lance-table/src/io/commit/external_manifest.rs:286-369)

### Lines 370-383

Crate-visible detect_naming_scheme_from_path requires a filename or returns CorruptFile. It tries normal scheme detection, then always supplies the staging-name heuristic. Consequently every present filename obtains a scheme even when malformed; this is classification, not robust manifest-name validation, despite the error wording. Parent staging detection checks the character at index 20 for a dot. (rust/lance-table/src/io/commit/external_manifest.rs:370-383)

### Lines 384-433

Private MAX_SERVER_SIDE_COPY_BYTES is exactly 5 * 1024^3 bytes (5 GiB); COPY_REWRITE_PART_SIZE is exactly 100 * 1024^2 bytes (100 MiB, called MB in comments). Documentation motivates bounded streaming for provider COPY limits and mentions future multipart server-side copy. These comments are repository rationale, not independently verified current cloud guarantees. Expected size controls dispatch. Private async copy_size_aware uses ordinary raw copy only when selected size is strictly below 5 GiB; equality already uses copy_via_read_rewrite. The comments' above-limit wording is less precise than this boundary. Below-limit COPY errors do not trigger a streaming fallback. The helper trusts the supplied size rather than HEADing the source and returns the underlying object-store result. (rust/lance-table/src/io/commit/external_manifest.rs:384-433)

### Lines 434-485

copy_or_verify_final_manifest awaits size-aware copy. On success it records CREATE, HEADs the canonical path, rejects a different size as CorruptFile with version/path/expected/actual context, and returns the current HEAD ETag. HEAD failure still returns an error even after bytes may have landed. There is no content hash, manifest decode or payload-version validation. On any object-store NotFound returned by the copy helper, copy_or_verify_final_manifest HEADs the canonical path: matching size returns its ETag, mismatching size is corruption and HEAD failure propagates. All other copy errors propagate without readback. Same-size recovery is safe only under the selected immutable object and prefix-incarnation assumptions; equality of size is not general proof of equal bytes. A NotFound could also originate inside streaming rewrite. (rust/lance-table/src/io/commit/external_manifest.rs:434-485)

### Lines 486-558

Private copy_via_read_rewrite opens the source GET stream before starting destination multipart upload, allocates a 100 MiB buffer and consumes stream chunks. A stream error attempts upload.abort, ignores abort failure and returns the original stream error. The function returns the object-store result type. Cancellation has no local Drop abort guard, so the explicit error branches do not cover all interrupted uploads. Each input chunk is sliced into the remaining part capacity and copied into the Vec. A full buffer is replaced with a fresh 100 MiB allocation, converted into Bytes and uploaded with a sequential awaited put_part; failure attempts abort and returns the original error. This bounds part buffers, not total memory: the current upstream chunk, in-flight payload and replacement allocation may coexist. Parts are not uploaded in parallel. A remaining nonempty buffer is uploaded as the short final part, with abort-on-error. Empty input proceeds to complete without a part. complete failure also attempts abort and preserves its original error; success returns Ok. No explicit total-byte comparison, checksum, part-count ceiling, abort-error reporting or cancellation cleanup is present; the caller's final HEAD checks only expected size. (rust/lance-table/src/io/commit/external_manifest.rs:486-558)

### Lines 559-622

Public Debug ExternalManifestCommitHandler stores a public Arc<dyn ExternalManifestStore>. Its private verify_finalized_manifest_location HEADs a generic canonical location. On success it destructures metadata, ignores the external record's old ETag and keeps version/path/scheme/identity while obtaining the physical object's current generation. Generic finalized verification rejects Some(expected_size) differing from HEAD size; None is filled from HEAD. Returned ETag always comes from that HEAD. If HEAD reports NotFound, it invokes default_resolve_version for the same version instead of repairing the external record; that fallback can lose recorded identity/size and can return an unchecked V1 or detached path. Other errors propagate. This is not the identity-bearing recorded_as_final fast path. (rust/lance-table/src/io/commit/external_manifest.rs:559-622)

### Lines 623-706

Private finalize_manifest computes the canonical path and independently performs copy_or_verify_final_manifest, producing identity None and the observed ETag. It does not call ExternalManifestStore::finalize, so reader helping uses this generic protocol even if a store overrides writer-side finalization. It next updates the existing external record with canonical path/size and ETag None. Reader finalization warns and returns canonical success when external publication fails, retaining staging for repair. After successful publication it best-effort deletes staging, accepts NotFound, audits DELETE on success/NotFound, and warns without failing for other delete errors. No version hint is written here. As in public finalize_staged, cancellation and post-copy HEAD errors have different outcomes from the swallowed later repair failures. (rust/lance-table/src/io/commit/external_manifest.rs:623-706)

### Lines 707-733

The async CommitHandler implementation's version_exists returns true for any successful external location lookup, including a staging reservation, without verifying an object. Only core NotFound triggers HEAD of the supplied naming scheme's canonical path; raw NotFound becomes false and other errors propagate. Thus existence means an indexed record or visible deterministic object, not necessarily completed canonical materialization. (rust/lance-table/src/io/commit/external_manifest.rs:707-733)

### Lines 734-803

resolve_latest_location first asks the external store for its latest location. Ok(None) uses current_manifest_path; an external error, including NotFound, propagates. An identity-bearing location immediately uses recorded_as_final. Otherwise an exact manifest extension uses generic finalized HEAD verification. Other filenames are treated as staging; no payload parsing occurs. Latest staging resolution uses recorded size when present, otherwise HEADs staging. Missing staging on this unknown-size path triggers a second get_manifest_location and returns that result directly, without another HEAD or finalization; other HEAD errors propagate. Known-size staging proceeds directly to private finalization, whose copy NotFound recovery can inspect canonical storage. The stored naming scheme is used, and identity is restored afterward (normally None because identified records took the earlier branch). (rust/lance-table/src/io/commit/external_manifest.rs:734-803)

### Lines 804-893

resolve_version_location first asks the external index. On core NotFound it calls default_resolve_version and maps any failure of that resolver to a core NotFound for base@version. It then HEADs the fallback path. Success attempts an onboarding put_if_not_exists using actual size and ETag None; reservation failure merely warns. This is best-effort backfill, not a second arbitration step before serving existing object bytes. The onboarding success returns the requested version, fallback path, actual size/ETag, staging naming heuristic and identity None, even if the store minted an identity during insertion. Raw HEAD NotFound becomes a contextual core NotFound; other errors propagate. Other initial external errors propagate directly. The heuristic unwraps filename, relying on the fallback path constructor to provide one. For an indexed exact-version location, identity Some uses recorded_as_final; a manifest extension uses generic finalized verification. Otherwise it recomputes the staging naming heuristic (unlike latest lookup, which uses the recorded scheme), obtains size by HEAD only if absent, and finalizes using the requested version. This unknown-size staging HEAD has no latest-lookup refetch branch on NotFound. The location identity is assigned after finalization. (rust/lance-table/src/io/commit/external_manifest.rs:804-893)

### Lines 894-906

resolve_identity forwards get_identity for the requested base/version and wraps Some(token) as PredecessorIdentity with that requested version. It ignores its ObjectStore argument and does not test object existence or support flags. A missing token remains None; external errors propagate. (rust/lance-table/src/io/commit/external_manifest.rs:894-906)

### Lines 907-933

list_manifest_locations clones base/store handles into a deferred once/flattened async stream. Some(Vec) from external list_versions(base, None) is authoritative, optionally sorted descending by version, and emitted without HEAD, deduplication, detached filtering or identity validation. None selects parent object listing; errors propagate. Metadata is materialized as a Vec at the external boundary, not streamed incrementally. (rust/lance-table/src/io/commit/external_manifest.rs:907-933)

### Lines 934-962

list_manifest_locations_since requests external versions with Some(since). For Some(Vec), it additionally retains only version > since and sorts descending before streaming. None uses the parent's hint-aware fallback. An empty supplied Vec never falls back. The handler does not override the parent's detached-list method, so that method retains its physical-listing behavior. (rust/lance-table/src/io/commit/external_manifest.rs:934-962)

### Lines 963-1012

Ordinary commit derives a canonical path from manifest.version, makes a UUID staging path and awaits the injected ManifestWriter there, passing optional indices/transaction. Write errors propagate through CommitError conversion with no local staging cleanup. The canonical/staging names are computed before the writer may mutate the manifest; external submission reads its version after that await. Ordinary commit calls external_manifest_store.put with the staging size, writer ETag, raw store and scheme. Success writes a best-effort parent version hint and returns the store's location unchanged. Every error from put goes through lose_or_retain, which returns CommitConflict even for IO or ambiguous publication errors. There is no cancellation guard or retry loop inside this handler. (rust/lance-table/src/io/commit/external_manifest.rs:963-1012)

### Lines 1013-1048

delete and forget_version forward to the external store (the latter with the required identity); supports_predecessor_condition forwards its support flag. These methods do not delete physical manifest objects themselves. Store-level default delete is a no-op and default forget is NotSupported. resolve_latest_identity performs two separate awaits: obtain latest (version, path), then fetch that version's identity. It returns None if either is absent and wraps the token otherwise. This is not an atomic latest-version/identity snapshot and does not probe or materialize the object; the later conditioned reservation must check the token. (rust/lance-table/src/io/commit/external_manifest.rs:1013-1048)

### Lines 1049-1122

commit_after constructs a unique staging-shaped path and writes the full manifest before invoking put_if_predecessor. It does not check supports_predecessor_condition first. Reservation receives the post-write manifest version, unique path, size and supplied predecessor. The handler itself enforces neither adjacency nor latest-head equality; atomic identity validation belongs to the store implementation. Reserved { identity } writes the version hint and returns the unique path as FINAL, with writer size/ETag and the minted identity. It performs no canonical COPY, finalize hook, path compaction or staging deletion. The durable object precedes the atomic reservation, which publishes it through the record. This identity protocol depends on authoritative external listings, since normal manifest-name detection excludes the unique suffix. PredecessorChanged best-effort deletes the refused unique object and returns OtherError(PrerequisiteFailed) with predecessor-version context. Taken and every Err, including a default NotSupported error, use lose_or_retain and become CommitConflict. Write failures earlier have no cleanup. The trait implementation ends without overriding the parent's definitive-NotFound or propagate-after-readback defaults. (rust/lance-table/src/io/commit/external_manifest.rs:1049-1122)

### Lines 1123-1150

Private lose_or_retain reads the record for the attempted version. A successful lookup at a different path is treated as a proven loser: best-effort delete its own staging object and return CommitConflict. Same path or any lookup failure warns with the original error and retains staging, but still returns CommitConflict. The comparison is path-only; a canonicalized path also differs from the original staging path. This helper does not expose an unknown-outcome error variant. (rust/lance-table/src/io/commit/external_manifest.rs:1123-1150)

### Lines 1151-1162

Private recorded_as_final trusts an identity-bearing record. If size is absent it HEADs only to fill size; it neither refreshes ETag nor compares a known size. If size is already Some, it performs no object IO at all. It preserves the record's path/scheme/identity/ETag and never copies to a canonical path. Therefore generic canonical verification guarantees must not be attributed to this branch. (rust/lance-table/src/io/commit/external_manifest.rs:1151-1162)

### Lines 1163-1177

Private delete_staging awaits raw delete. Success audits DELETE; NotFound is silently accepted without an audit; other errors warn with why/path/error. It returns no Result and has no cancellation guard. This audit-on-NotFound behavior differs from the two generic finalization routines, which do audit accepted NotFound cleanup. (rust/lance-table/src/io/commit/external_manifest.rs:1163-1177)

### Lines 1178-1194

The cfg(test) module imports HashMap/Mutex, atomic flags/counters, Arrow schema types, Lance schema/storage versions, ObjectStore proxy failure policies, Tokio Notify, the canonical writer and VERSIONS_DIR. These are in-memory deterministic protocol fixtures. Their assertions were read for coverage; none of these tests was executed for this read-only knowledge-base task. (rust/lance-table/src/io/commit/external_manifest.rs:1178-1194)

### Lines 1195-1212

StoredManifest is a Debug/Clone path/size/optional-ETag row. TestExternalManifestStore holds rows keyed by (base URI, version) in a Mutex plus flags for losing a reservation response, failing an index update, or blocking its first final publish; an atomic call counter and two Notify values coordinate the latter race. This mock does not mint identities. (rust/lance-table/src/io/commit/external_manifest.rs:1195-1212)

### Lines 1213-1240

TestExternalManifestStore::new initializes an empty map, configurable first reservation-response failure, other failure flags false, zero publish count and fresh notifications. failing_final_publish_once changes only the final-publication error flag; blocking_first_final_publish enables a deterministic pause. These constructors exercise failure timing, not backend consistency or distributed transactions. (rust/lance-table/src/io/commit/external_manifest.rs:1213-1240)

### Lines 1241-1285

The mock ExternalManifestStore get locks the map and clones the selected path or returns contextual NotFound. get_manifest_location clones the complete row, builds a Path, classifies naming, returns Some(size)/stored ETag/identity None. get_latest_version scans only matching base URIs and selects the largest numeric version, with no detached-version filtering. It inherits the trait's default latest-location conversion, so latest metadata is initially unknown. (rust/lance-table/src/io/commit/external_manifest.rs:1241-1285)

### Lines 1286-1316

Mock put_if_not_exists locks the map, rejects an existing key with a commit conflict, otherwise inserts the full row and drops the lock. Only after insertion does fail_next_put_response.swap(false, SeqCst) simulate an IO response loss. Thus an error can coexist with a successfully selected staging path, which is the ambiguous outcome the retention tests need. (rust/lance-table/src/io/commit/external_manifest.rs:1286-1316)

### Lines 1317-1348

Mock put_if_exists can pause its first final update before taking the row lock, signal that pause and await release. A one-shot failure returns IO before mutating the record. Otherwise it requires the key to exist and overwrites path/size/ETag in place. All mock mutex locks unwrap poison; atomics use SeqCst. Its external record update is serialized locally, but the pause permits a second helper to copy/update/delete staging first. (rust/lance-table/src/io/commit/external_manifest.rs:1317-1348)

### Lines 1349-1358

test_manifest constructs a one-field non-nullable Int32 id schema, empty fragments, DataStorageFormat using resolved Stable LanceFileVersion, and empty config. It is a minimal real Manifest for the injected canonical writer, not a dataset-operation fixture. (rust/lance-table/src/io/commit/external_manifest.rs:1349-1358)

### Lines 1359-1398

test_finalized_manifest_ignores_legacy_external_store_etag writes a canonical V2 object, indexes its actual size with a deliberately wrong legacy ETag, resolves that version, and asserts canonical path, actual size and the object's HEAD ETag. It verifies generation refresh rather than manifest decoding; the stored bytes are only the literal manifest. (rust/lance-table/src/io/commit/external_manifest.rs:1359-1398)

### Lines 1399-1437

test_finalized_manifest_without_external_store_etag_uses_current_etag repeats the canonical-resolution check with an absent indexed ETag and asserts actual path/size/ETag. An absent index token does not prevent the returned location from carrying the current object generation. (rust/lance-table/src/io/commit/external_manifest.rs:1399-1437)

### Lines 1438-1468

test_default_store_returns_but_does_not_persist_etag performs a real ordinary commit through the default external workflow, HEADs the canonical object, compares the returned ETag, and asserts the external record has ETag None. Its next phase changes physical bytes at the same canonical path to test the intended generation-independent external index. (rust/lance-table/src/io/commit/external_manifest.rs:1438-1468)

### Lines 1469-1487

The default-store ETag test overwrites the canonical file with zero bytes of exactly the original length, observes a different ETag, resolves the indexed version and asserts the replacement ETag. This intentionally demonstrates that size/generation handling is not byte-content validation: resolution accepts equal-length replacement bytes without decoding them. (rust/lance-table/src/io/commit/external_manifest.rs:1469-1487)

### Lines 1488-1517

test_helping_finalizer_returns_but_does_not_persist_etag manually writes immutable staging bytes and reserves that path with its physical ETag. This creates a legacy-style indexed staging row so reader helping can be tested independently of ordinary commit. (rust/lance-table/src/io/commit/external_manifest.rs:1488-1517)

### Lines 1518-1531

The helping-finalizer test resolves the reserved version, asserts its returned ETag equals canonical HEAD, and asserts the repaired external record's ETag is None. It proves reader-side finalization clears a stored physical generation; it does not assert the staging deletion in this case. (rust/lance-table/src/io/commit/external_manifest.rs:1518-1531)

### Lines 1532-1565

test_onboarding_returns_but_does_not_persist_etag writes a canonical V2 object without an external row, resolves the version through fallback/onboarding, asserts the returned ETag is current and the newly inserted record has ETag None. This covers backfill of existing object-store history into a generic external store. (rust/lance-table/src/io/commit/external_manifest.rs:1532-1565)

### Lines 1566-1603

test_finalized_manifest_size_mismatch_remains_corruption stores canonical bytes and indexes actual size + 1. Exact-version resolution must return Error::CorruptFile and include Manifest size mismatch. Ignoring indexed ETags therefore does not disable the explicit known-size invariant on the generic finalized path. (rust/lance-table/src/io/commit/external_manifest.rs:1566-1603)

### Lines 1604-1638

test_canonical_manifest_commits_before_index_repair uses a one-shot final-index-update failure. Ordinary commit must still succeed at the canonical path with Some(ETag), and HEAD must find the object. This establishes canonical durability before successful index compaction in the generic workflow; it is an in-memory simulation despite assertion text referring to S3. (rust/lance-table/src/io/commit/external_manifest.rs:1604-1638)

### Lines 1639-1676

The index-repair test confirms the row still points to an existing staging object, then resolves the version to trigger helping. It asserts canonical returned path/ETag, repaired external path/size, indexed ETag None, and NotFound for the formerly retained staging object. Thus it covers success after repair failure and eventual cleanup, without treating repair failure as rollback. (rust/lance-table/src/io/commit/external_manifest.rs:1639-1676)

### Lines 1677-1715

test_concurrent_finalizers_return_but_do_not_persist_generations writes known staging bytes, starts default put in a Tokio task, and arranges to block the first external final update after that writer's COPY/HEAD. The task owns cloned store/base/path/ETag handles; the mock does not hold its row mutex across the pause. (rust/lance-table/src/io/commit/external_manifest.rs:1677-1715)

### Lines 1716-1744

The concurrent test bounds waiting for the writer's pause to five seconds, records its first canonical generation and confirms the reservation still names staging with ETag None. A reader resolves the same selected staging path, performs another equivalent copy and repairs the index; the test then releases and joins the first writer. Comments explain why physical generations may differ despite identical immutable bytes. (rust/lance-table/src/io/commit/external_manifest.rs:1716-1744)

### Lines 1745-1779

The concurrent test loads final bytes/metadata and external row, asserts bytes unchanged, final ETag different from the first generation, writer returned its earlier ETag, reader returned the later ETag, and final external tuple has canonical path/size but no ETag. A subsequent resolver returns the current generation. Thus a returned ETag is an observed physical generation, not a promise that no later equivalent copy will occur. (rust/lance-table/src/io/commit/external_manifest.rs:1745-1779)

### Lines 1780-1817

test_lost_external_store_response_retains_staging_manifest injects an error after reservation insertion. Ordinary commit must surface CommitConflict, the selected staging path remains readable, and a later exact-version resolver creates/finds the canonical V2 file. This codifies broad conflict classification for an ambiguous external response, not proof that the write lost arbitration. (rust/lance-table/src/io/commit/external_manifest.rs:1780-1817)

### Lines 1818-1859

test_finalization_returns_etag_without_persisting_it commits normally, asserts canonical path and returned ETag equal to HEAD, then verifies the external record advances to canonical path with ETag None. Its comments connect the transient ETag to cache separation; complete cache consumer behavior is outside this file. (rust/lance-table/src/io/commit/external_manifest.rs:1818-1859)

### Lines 1860-1885

test_missing_staging_verifies_existing_final_manifest supplies a missing staging path and an existing canonical object with the expected size. copy_or_verify_final_manifest must return that object's current ETag. The fixture tests the helper's NotFound recovery directly with immutable literal bytes. (rust/lance-table/src/io/commit/external_manifest.rs:1860-1885)

### Lines 1886-1905

test_missing_staging_rejects_missing_final_manifest leaves both paths absent and expects core NotFound mentioning the canonical path. A missing selected source without durable canonical evidence cannot establish success. (rust/lance-table/src/io/commit/external_manifest.rs:1886-1905)

### Lines 1906-1933

test_missing_staging_rejects_wrong_final_size leaves staging absent and creates a canonical object whose length differs from expected 42. It requires CorruptFile and the size-mismatch message. This complements the same-size recovery test but does not reject same-size different content. (rust/lance-table/src/io/commit/external_manifest.rs:1906-1933)

### Lines 1934-1967

test_copy_failure_after_external_store_commit_retains_staging_manifest wraps the in-memory raw store in a ProxyObjectStore. A named before-policy fails only the first copy, atomically consumes its flag and records the source path under Mutex. Base/version/canonical path are saved before attempting the real writer/commit workflow. (rust/lance-table/src/io/commit/external_manifest.rs:1934-1967)

### Lines 1968-2011

The injected-copy-failure test expects CommitConflict, confirms the one-shot failure was consumed, verifies the indexed record equals the failed copy's staging source and that staging still exists, then asserts canonical HEAD is NotFound. Reservation success therefore precedes copy success and the winning object must survive the copy error. (rust/lance-table/src/io/commit/external_manifest.rs:1968-2011)

### Lines 2012-2040

After clearing the named proxy policy, the test resolves the version and expects canonical path, updated external row, visible canonical object and deleted staging. This covers reader repair after a pre-copy failure; it does not exercise partial multipart upload, production provider errors or cancellation during copying. (rust/lance-table/src/io/commit/external_manifest.rs:2012-2040)

### Lines 2041-2051

Debug/Default IdentifiedStore is a second mock: Mutex<HashMap<u64, (String, u64, String)>> stores path/size/identity, AtomicUsize mints tokens, and a flag plus two Notify values can pause reservation. It intentionally ignores base URI, so it models one dataset and is not a production multi-tenant store. No ETags are persisted. (rust/lance-table/src/io/commit/external_manifest.rs:2041-2051)

### Lines 2052-2065

IdentifiedStore::mint formats identity-{counter} using fetch_add SeqCst, and handler(self: &Arc<Self>) clones the Arc into ExternalManifestCommitHandler. Counter uniqueness models the never-reuse contract within this fixture; it is not a distributed identity scheme. (rust/lance-table/src/io/commit/external_manifest.rs:2052-2065)

### Lines 2066-2085

recreate locks rows, collects existing version keys, clears records and repopulates the same versions at deterministic V2 paths, size 1 and freshly minted identities. It changes external records only, not object bytes. identity_of locks the map and clones the token for one version. These fixtures isolate dataset-incarnation checking from actual dataset replacement. (rust/lance-table/src/io/commit/external_manifest.rs:2066-2085)

### Lines 2086-2119

IdentifiedStore's get and get_manifest_location ignore base URI, return contextual NotFound for absent versions, and clone recorded values. The location parser unwraps its trusted fixture path, classifies scheme and supplies Some(size), ETag None and Some(identity). This identity-bearing metadata routes readers through recorded_as_final. (rust/lance-table/src/io/commit/external_manifest.rs:2086-2119)

### Lines 2120-2142

The identified store's get_latest_version selects maximum numeric key without detached filtering. Its get_latest_manifest_location override fetches that version's full identified location rather than using the trait default that drops identity. The two awaits do not hold one atomic snapshot; a concurrent deletion could make the second lookup fail. (rust/lance-table/src/io/commit/external_manifest.rs:2120-2142)

### Lines 2143-2176

put_if_not_exists mints a token before locking/checking the target key, so conflicts can consume counter values; a free key stores path/size/token. put_if_exists requires a row and changes only path/size, preserving identity. Both ignore supplied ETag/base URI. These choices make final index compaction preserve record incarnation in the fixture. (rust/lance-table/src/io/commit/external_manifest.rs:2143-2176)

### Lines 2177-2197

The identified store advertises predecessor support, returns identity_of from get_identity, and forget_version removes only a row whose current identity matches. Missing/mismatched rows are successful no-ops. Retirement changes external history only and does not delete its object. (rust/lance-table/src/io/commit/external_manifest.rs:2177-2197)

### Lines 2198-2212

IdentifiedStore::list_versions snapshots keys under the mutex, releases it, then sequentially fetches each requested version's identified location, filtering strictly greater than since when present. Returns Some(Vec), even empty; no sorting here. Concurrent row removal between key snapshot and fetch can fail the entire method; it is not one atomic history snapshot. (rust/lance-table/src/io/commit/external_manifest.rs:2198-2212)

### Lines 2213-2240

put_if_predecessor optionally signals/awaits a held reservation before mutation, mints a token, then holds one mutex while checking predecessor token and target absence and inserting. It returns PredecessorChanged before considering Taken, otherwise reserves with a cloned token. No adjacency/head requirement is imposed. Awaiting the pause before locking makes cancellation/recreation tests deterministic without holding a synchronous mutex across an await. (rust/lance-table/src/io/commit/external_manifest.rs:2213-2240)

### Lines 2241-2255

v2_path constructs a deterministic V2 manifest path under dataset. v2_names maps requested versions through that helper, extracts filenames with unwrap, collects and sorts. These fixture helpers compare physical directory names, not external history. (rust/lance-table/src/io/commit/external_manifest.rs:2241-2255)

### Lines 2256-2289

identified_fixture creates an identified handler plus in-memory store/base, commits version 1 using ordinary generic commit, resolves latest identity and asserts its version is 1. It returns the handler/store/base/predecessor tuple needed for conditioned version 2 tests. The returned ordinary-commit location is discarded; identity is obtained explicitly from the store afterward. (rust/lance-table/src/io/commit/external_manifest.rs:2256-2289)

### Lines 2290-2311

commit_after_v2 creates the minimal Manifest, sets version 2 and calls CommitHandler::commit_after with canonical writer, V2 naming, no indices/transaction and the supplied predecessor. It returns the raw Result so tests distinguish prerequisite failures from ordinary conflicts. (rust/lance-table/src/io/commit/external_manifest.rs:2290-2311)

### Lines 2312-2323

versions_dir_files lists every raw object under base/_versions, extracts filenames, collects and sorts. Unlike manifest listing, it includes unique staging-shaped final files and orphans. It unwraps all fixture IO and filename results. (rust/lance-table/src/io/commit/external_manifest.rs:2312-2323)

### Lines 2324-2359

test_a_conditioned_commit_lands_under_its_minted_identity asserts version 2's filename contains .manifest-, ordinary detect_scheme returns None, and its identity equals the store's token. Latest resolution preserves that path/token; external listing returns [2,1], listing since 1 returns [2], while raw directory count is two. Invisible to manifest discovery here does not mean the raw object store cannot list the physical object. (rust/lance-table/src/io/commit/external_manifest.rs:2324-2359)

### Lines 2360-2384

test_a_changed_predecessor_is_refused_without_publishing supplies a stale version-1 token and expects OtherError(PrerequisiteFailed), no version-2 identity, and only version-1 canonical physical filename after best-effort cleanup succeeds in memory. This is a failed prerequisite rather than a target-version conflict. (rust/lance-table/src/io/commit/external_manifest.rs:2360-2384)

### Lines 2385-2402

test_a_taken_version_is_a_conflict pre-inserts a version-2 record at its canonical path without creating that physical object, attempts a conditioned commit, expects CommitConflict, and verifies only version 1 remains physically. It exercises different-record-path loser cleanup, not validation of the winning record's object existence. (rust/lance-table/src/io/commit/external_manifest.rs:2385-2402)

### Lines 2403-2424

test_a_recreation_before_publication_is_refused replaces all mock records with fresh identities before a conditioned commit using the old predecessor. It expects PrerequisiteFailed and unchanged version-1-only physical filenames. Record recreation, not a real object-prefix deletion/rebuild, is the simulated competing action. (rust/lance-table/src/io/commit/external_manifest.rs:2403-2424)

### Lines 2425-2437

listed_versions requests descending handler manifest locations, maps to version numbers, collects and unwraps. This helper observes authoritative external history rather than all physical files and is reused for cancellation and retirement assertions. (rust/lance-table/src/io/commit/external_manifest.rs:2425-2437)

### Lines 2438-2474

The multithread Tokio cancellation test pauses the next reservation, spawns conditioned version 2, waits up to 30 seconds for the pause, aborts/joins the task and requires cancelled status. There is no version-2 token; external history and ordinary physical manifest discovery both remain [1], but raw directory count is two. The fully written unique orphan survives because cancellation before reservation has no cleanup guard; the test proves non-publication, not absence of orphan bytes. (rust/lance-table/src/io/commit/external_manifest.rs:2438-2474)

### Lines 2475-2505

test_forgetting_a_version_retires_only_that_record commits identified version 2, attempts retirement of version 1 with a stale token and sees [2,1]. It then retires version 1 with its current token twice and sees [2]. This establishes identity-conditional/idempotent record removal; it does not inspect or delete physical files. (rust/lance-table/src/io/commit/external_manifest.rs:2475-2505)

### Lines 2506-2543

Inside test_retirement_is_refused_where_the_store_cannot_forget, Debug NoForget wraps Arc<IdentifiedStore>, delegates only required get/latest/conditional-insert/update methods and returns true for support. It intentionally inherits default forget_version. It also inherits other optional defaults, so it is not a complete correct predecessor-capable implementation; the test isolates refusal of missing retirement support. (rust/lance-table/src/io/commit/external_manifest.rs:2506-2543)

### Lines 2544-2553

The retirement-refusal test wraps NoForget in the handler, calls forget_version with identity-0 and requires Error::NotSupported. The remaining braces close the test and module. No production external service, large-copy threshold, multipart failure/cancellation branch or complete dataset conflict-resolution loop is exercised by these local tests. (rust/lance-table/src/io/commit/external_manifest.rs:2544-2553)

## Interaction and interpretation limits

The full file was read offline and authored line-by-line in contiguous semantic ranges. Source tests were read, not executed. Concrete DynamoDB/namespace implementations, raw object-store/multipart internals, cloud guarantees, dataset retry/rebase/conflict resolution and complete cleanup orchestration remain separately pending; no runtime qualification is claimed. Public and private declarations, exact generic signatures, comments and all fixture assertions are retained below. Parent commit handler defaults and naming are documented in the linked commit module.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Trait for external manifest handler.
    5 | //!
    6 | //! This trait abstracts an external storage with put_if_not_exists semantics.
    7 | 
    8 | use std::sync::Arc;
    9 | 
   10 | use async_trait::async_trait;
   11 | use bytes::Bytes;
   12 | use futures::stream::BoxStream;
   13 | use futures::{StreamExt, TryStreamExt};
   14 | use lance_core::utils::tracing::{
   15 |     AUDIT_MODE_CREATE, AUDIT_MODE_DELETE, AUDIT_TYPE_MANIFEST, TRACE_FILE_AUDIT,
   16 | };
   17 | use lance_core::{Error, Result};
   18 | use lance_io::object_store::ObjectStore;
   19 | use log::warn;
   20 | use object_store::ObjectMeta;
   21 | use object_store::ObjectStoreExt;
   22 | use object_store::{Error as ObjectStoreError, ObjectStore as OSObjectStore, path::Path};
   23 | use tracing::info;
   24 | 
   25 | use super::{
   26 |     MANIFEST_EXTENSION, ManifestLocation, ManifestNamingScheme, current_manifest_path,
   27 |     default_resolve_version, make_staging_manifest_path, write_version_hint,
   28 | };
   29 | use crate::format::{IndexMetadata, Manifest, Transaction};
   30 | use crate::io::commit::{
   31 |     CommitError, CommitHandler, PredecessorIdentity, default_list_manifest_locations,
   32 |     default_list_manifest_locations_since,
   33 | };
   34 | 
   35 | /// Copy `staging_path` to the canonical manifest path for `version`, point
   36 | /// the store's record at it, and drop the staging object.
   37 | #[allow(clippy::too_many_arguments)]
   38 | pub async fn finalize_staged<S: ExternalManifestStore + ?Sized>(
   39 |     store: &S,
   40 |     base_path: &Path,
   41 |     version: u64,
   42 |     staging_path: &Path,
   43 |     size: u64,
   44 |     object_store: &dyn OSObjectStore,
   45 |     naming_scheme: ManifestNamingScheme,
   46 | ) -> Result<ManifestLocation> {
   47 |     // Step 2: Copy staging to final path
   48 |     let final_path = naming_scheme.manifest_path(base_path, version);
   49 |     let final_e_tag =
   50 |         copy_or_verify_final_manifest(object_store, staging_path, &final_path, version, size)
   51 |             .await?;
   52 | 
   53 |     let location = ManifestLocation {
   54 |         version,
   55 |         path: final_path.clone(),
   56 |         size: Some(size),
   57 |         naming_scheme,
   58 |         e_tag: final_e_tag,
   59 |         identity: None,
   60 |     };
   61 | 
   62 |     // Step 3: Update the external index to the final path.
   63 |     //
   64 |     // Publish only generation-independent metadata. COPY and this update
   65 |     // are not one atomic operation, so an ETag observed above can already
   66 |     // be stale when this call linearizes. `location` still carries that
   67 |     // observation to the current caller for cache separation.
   68 |     let published = store
   69 |         .put_if_exists(base_path.as_ref(), version, final_path.as_ref(), size, None)
   70 |         .await;
   71 | 
   72 |     if let Err(error) = published {
   73 |         // The canonical object is already durable and is the commit point.
   74 |         // Keep staging so an old or new reader that still observes the
   75 |         // reservation can retry this cache/index update. A DDB failure must
   76 |         // not turn an S3-committed transaction into a reported conflict.
   77 |         warn!(
   78 |             "Final manifest '{}' is committed, but the external manifest index could not be updated; retaining staging manifest '{}' for repair: {}",
   79 |             final_path, staging_path, error
   80 |         );
   81 |         return Ok(location);
   82 |     }
   83 | 
   84 |     // Step 4: Delete staging manifest
   85 |     match object_store.delete(staging_path).await {
   86 |         Ok(_) => {}
   87 |         Err(ObjectStoreError::NotFound { .. }) => {}
   88 |         Err(error) => {
   89 |             // Staging is no longer authoritative after the canonical
   90 |             // object and final index entry exist. Its deletion is garbage
   91 |             // collection and cannot roll back the commit.
   92 |             warn!(
   93 |                 "Failed to delete finalized staging manifest '{}': {}",
   94 |                 staging_path, error
   95 |             );
   96 |             return Ok(location);
   97 |         }
   98 |     }
   99 |     info!(target: TRACE_FILE_AUDIT, mode=AUDIT_MODE_DELETE, r#type=AUDIT_TYPE_MANIFEST, path = staging_path.as_ref());
  100 | 
  101 |     Ok(location)
  102 | }
  103 | 
  104 | /// Outcome of [`ExternalManifestStore::put_if_predecessor`].
  105 | #[derive(Debug, Clone, PartialEq, Eq)]
  106 | pub enum Reservation {
  107 |     /// The version is recorded at the given path, under the identity the
  108 |     /// store minted for it.
  109 |     Reserved { identity: String },
  110 |     /// The version was already recorded; nothing was written.
  111 |     Taken,
  112 |     /// The predecessor is no longer the manifest it was judged as; nothing
  113 |     /// was written.
  114 |     PredecessorChanged,
  115 | }
  116 | 
  117 | /// External manifest store
  118 | ///
  119 | /// This trait abstracts a concurrency coordinator and lookup index for
  120 | /// manifests. The store is expected to remember
  121 | /// `(uri, version) -> manifest_path` and to atomically select one staging path
  122 | /// for each version. The manifest bytes in object storage remain authoritative.
  123 | ///
  124 | /// This trait is called an **External** manifest store because the store is
  125 | /// expected to work in tandem with the object store. We are only leveraging
  126 | /// the external store for concurrent commit. Any manifest committed thru this
  127 | /// trait should ultimately be materialized in the object store.
  128 | ///
  129 | /// # Correctness model
  130 | ///
  131 | /// 1. Writers first upload immutable manifests to unique staging paths.
  132 | /// 2. `put_if_not_exists` linearizes `(dataset, version)` and records exactly
  133 | ///    one winning staging path. A writer that loses this operation must never
  134 | ///    materialize its own staging object at the final path.
  135 | /// 3. The winner, or any helping reader, copies the recorded staging object to
  136 | ///    the deterministic final path. Successful final-path materialization is
  137 | ///    the durable commit point. Repeating this step is content-idempotent
  138 | ///    because every helper reads the same immutable source selected in step 2.
  139 | /// 4. The external row is then compacted from staging to final path and staging
  140 | ///    is deleted. These are repair and garbage-collection operations: failures
  141 | ///    leave enough information for another helper and cannot undo step 3.
  142 | ///
  143 | /// Object-store overwrites can assign a new ETag to identical bytes. An ETag is
  144 | /// therefore neither logical manifest identity nor dataset-incarnation identity.
  145 | /// The generic protocol never persists or validates ETags in the external index:
  146 | /// a finalizer can observe generation E1, another finalizer can replace it with
  147 | /// the same selected bytes as E2, and then the first finalizer can publish after
  148 | /// the second. Persisting E1 would make a correct canonical object look corrupt.
  149 | ///
  150 | /// A canonical HEAD still returns the generation observed by the current caller
  151 | /// in [`ManifestLocation`]. That ephemeral token keeps runtime caches from
  152 | /// treating a newly materialized object as the same observation as an older
  153 | /// object at the same `(uri, version)`, without turning the external index into
  154 | /// a second authority for physical object generations. The generic external
  155 | /// index stores only stable `(path, size)` metadata and readers ignore any legacy
  156 | /// stored ETag. This protocol assumes one dataset incarnation owns the physical
  157 | /// prefix; a separate incarnation identity is required to make arbitrary prefix
  158 | /// reuse unconditionally safe.
  159 | /// For a visual explanation of the commit loop see
  160 | /// <https://github.com/lance-format/lance/assets/12615154/b0822312-0826-432a-b554-3965f8d48d04>
  161 | 
  162 | #[async_trait]
  163 | pub trait ExternalManifestStore: std::fmt::Debug + Send + Sync {
  164 |     /// Get the manifest path for a given base_uri and version
  165 |     async fn get(&self, base_uri: &str, version: u64) -> Result<String>;
  166 | 
  167 |     async fn get_manifest_location(
  168 |         &self,
  169 |         base_uri: &str,
  170 |         version: u64,
  171 |     ) -> Result<ManifestLocation> {
  172 |         let path = self.get(base_uri, version).await?;
  173 |         let path = Path::parse(&path).map_err(|e| Error::invalid_input(e.to_string()))?;
  174 |         let naming_scheme = detect_naming_scheme_from_path(&path)?;
  175 |         Ok(ManifestLocation {
  176 |             version,
  177 |             path,
  178 |             size: None,
  179 |             naming_scheme,
  180 |             e_tag: None,
  181 |             identity: None,
  182 |         })
  183 |     }
  184 | 
  185 |     /// Get the latest version of a dataset at the base_uri, and the path to the manifest.
  186 |     /// The path is provided as an optimization. The path is deterministic based on
  187 |     /// the version and the store should not customize it.
  188 |     async fn get_latest_version(&self, base_uri: &str) -> Result<Option<(u64, String)>>;
  189 | 
  190 |     /// Get the latest manifest location for a given base_uri.
  191 |     ///
  192 |     /// By default, this calls get_latest_version.  Impls should
  193 |     /// override this method if they store both the location and size
  194 |     /// of the latest manifest.
  195 |     async fn get_latest_manifest_location(
  196 |         &self,
  197 |         base_uri: &str,
  198 |     ) -> Result<Option<ManifestLocation>> {
  199 |         self.get_latest_version(base_uri).await.and_then(|res| {
  200 |             res.map(|(version, uri)| {
  201 |                 let path = Path::parse(&uri).map_err(|e| Error::invalid_input(e.to_string()))?;
  202 |                 let naming_scheme = detect_naming_scheme_from_path(&path)?;
  203 |                 Ok(ManifestLocation {
  204 |                     version,
  205 |                     path,
  206 |                     size: None,
  207 |                     naming_scheme,
  208 |                     e_tag: None,
  209 |                     identity: None,
  210 |                 })
  211 |             })
  212 |             .transpose()
  213 |         })
  214 |     }
  215 | 
  216 |     /// Put the manifest to the external store.
  217 |     ///
  218 |     /// The staging manifest has been written to `staging_path` on the object store.
  219 |     /// This method should atomically claim the version and return the final manifest location.
  220 |     ///
  221 |     /// The default implementation uses put_if_not_exists and put_if_exists to
  222 |     /// implement a staging-based workflow. Implementations that can write directly
  223 |     /// (e.g., namespace-backed stores) should override this method.
  224 |     #[allow(clippy::too_many_arguments)]
  225 |     async fn put(
  226 |         &self,
  227 |         base_path: &Path,
  228 |         version: u64,
  229 |         staging_path: &Path,
  230 |         size: u64,
  231 |         _e_tag: Option<String>,
  232 |         object_store: &dyn OSObjectStore,
  233 |         naming_scheme: ManifestNamingScheme,
  234 |     ) -> Result<ManifestLocation> {
  235 |         // Default implementation: staging-based workflow
  236 | 
  237 |         // Step 1: Record staging path atomically
  238 |         // The external index owns version reservation, not object identity.
  239 |         // Staging paths are immutable and unique, so path and size are enough
  240 |         // to identify the selected source. Keeping ETags out of every generic
  241 |         // write also makes rolling upgrades converge naturally: new readers
  242 |         // ignore legacy values and every new publication removes them.
  243 |         self.put_if_not_exists(
  244 |             base_path.as_ref(),
  245 |             version,
  246 |             staging_path.as_ref(),
  247 |             size,
  248 |             None,
  249 |         )
  250 |         .await?;
  251 | 
  252 |         self.finalize(
  253 |             base_path,
  254 |             version,
  255 |             staging_path,
  256 |             size,
  257 |             object_store,
  258 |             naming_scheme,
  259 |         )
  260 |         .await
  261 |     }
  262 | 
  263 |     /// Steps 2-4 of [`Self::put`], once `version` is recorded at
  264 |     /// `staging_path`; see [`finalize_staged`].
  265 |     async fn finalize(
  266 |         &self,
  267 |         base_path: &Path,
  268 |         version: u64,
  269 |         staging_path: &Path,
  270 |         size: u64,
  271 |         object_store: &dyn OSObjectStore,
  272 |         naming_scheme: ManifestNamingScheme,
  273 |     ) -> Result<ManifestLocation> {
  274 |         finalize_staged(
  275 |             self,
  276 |             base_path,
  277 |             version,
  278 |             staging_path,
  279 |             size,
  280 |             object_store,
  281 |             naming_scheme,
  282 |         )
  283 |         .await
  284 |     }
  285 | 
  286 |     /// Whether [`Self::put_if_predecessor`] is implemented. Such a store also
  287 |     /// fills [`ManifestLocation::identity`] on every location it returns.
  288 |     fn supports_predecessor_condition(&self) -> bool {
  289 |         false
  290 |     }
  291 | 
  292 |     /// A token unique to the record at `version`, minted when the record is
  293 |     /// first written and never reused, so a recreated dataset's record at the
  294 |     /// same version is told apart. `None` where the store keeps none.
  295 |     async fn get_identity(&self, _base_uri: &str, _version: u64) -> Result<Option<String>> {
  296 |         Ok(None)
  297 |     }
  298 | 
  299 |     /// Every committed record with version `> since` (all of them for `None`),
  300 |     /// each a final location carrying its identity. A store that supports
  301 |     /// predecessor conditions must implement this: its conditioned manifests
  302 |     /// are not discoverable by listing the object store. `None` otherwise.
  303 |     async fn list_versions(
  304 |         &self,
  305 |         _base_uri: &str,
  306 |         _since: Option<u64>,
  307 |     ) -> Result<Option<Vec<ManifestLocation>>> {
  308 |         Ok(None)
  309 |     }
  310 | 
  311 |     /// Remove the record for `version` if it still carries `identity`, so a
  312 |     /// recreated dataset's record at that version is left alone. Idempotent.
  313 |     /// Only identity-bearing records are ever retired, so a store that mints
  314 |     /// identities must implement this; the default refuses.
  315 |     async fn forget_version(&self, _base_uri: &str, _version: u64, _identity: &str) -> Result<()> {
  316 |         Err(Error::not_supported(
  317 |             "this external manifest store cannot retire a version record",
  318 |         ))
  319 |     }
  320 | 
  321 |     /// [`Self::put_if_not_exists`], applied only if the record at
  322 |     /// `predecessor.version` still carries `predecessor.identity`, decided
  323 |     /// atomically with the version reservation.
  324 |     async fn put_if_predecessor(
  325 |         &self,
  326 |         _base_uri: &str,
  327 |         _version: u64,
  328 |         _path: &str,
  329 |         _size: u64,
  330 |         _predecessor: &PredecessorIdentity,
  331 |     ) -> Result<Reservation> {
  332 |         Err(Error::not_supported(
  333 |             "this external manifest store cannot condition a reservation on its predecessor",
  334 |         ))
  335 |     }
  336 | 
  337 |     /// Put the manifest path for a given base_uri and version, should fail if the version already exists.
  338 |     ///
  339 |     /// The generic staging workflow always passes `None` for `e_tag`. The
  340 |     /// parameter remains part of the trait for compatibility with stores that
  341 |     /// override the full [`Self::put`] protocol. Generic implementations must
  342 |     /// not retain a previous ETag when `None` is supplied.
  343 |     async fn put_if_not_exists(
  344 |         &self,
  345 |         base_uri: &str,
  346 |         version: u64,
  347 |         path: &str,
  348 |         size: u64,
  349 |         e_tag: Option<String>,
  350 |     ) -> Result<()>;
  351 | 
  352 |     /// Put the manifest path for a given base_uri and version, should fail if the version **does not** already exist.
  353 |     ///
  354 |     /// See [`Self::put_if_not_exists`] for the `e_tag` contract.
  355 |     async fn put_if_exists(
  356 |         &self,
  357 |         base_uri: &str,
  358 |         version: u64,
  359 |         path: &str,
  360 |         size: u64,
  361 |         e_tag: Option<String>,
  362 |     ) -> Result<()>;
  363 | 
  364 |     /// Delete the manifest information for given base_uri from the store
  365 |     async fn delete(&self, _base_uri: &str) -> Result<()> {
  366 |         Ok(())
  367 |     }
  368 | }
  369 | 
  370 | pub(crate) fn detect_naming_scheme_from_path(path: &Path) -> Result<ManifestNamingScheme> {
  371 |     path.filename()
  372 |         .and_then(|name| {
  373 |             ManifestNamingScheme::detect_scheme(name)
  374 |                 .or_else(|| Some(ManifestNamingScheme::detect_scheme_staging(name)))
  375 |         })
  376 |         .ok_or_else(|| {
  377 |             Error::corrupt_file(
  378 |                 path.clone(),
  379 |                 "Path does not follow known manifest naming convention.",
  380 |             )
  381 |         })
  382 | }
  383 | 
  384 | /// The most conservative server-side-copy size limit across the object
  385 | /// stores we support. This is not S3-specific: S3's `CopyObject` and GCS's
  386 | /// single-shot `Objects: copy` both reject sources above ~5 GiB, so we use
  387 | /// 5 GiB as a backend-agnostic threshold. Above it we stream the source
  388 | /// through the client and re-upload via multipart instead of relying on a
  389 | /// server-side copy. Stores that have no such cap (e.g. local filesystem)
  390 | /// also take the fallback above this size — correctness is preserved; only
  391 | /// the rare >5 GiB copy is slower than a native copy would be.
  392 | const MAX_SERVER_SIDE_COPY_BYTES: u64 = 5 * 1024 * 1024 * 1024;
  393 | 
  394 | /// Part size for the read+rewrite fallback. Multipart-capable stores
  395 | /// (S3, GCS) require every part except the last to be ≥5 MB and allow up to
  396 | /// 10,000 parts. 100 MB sits comfortably inside both bounds and keeps the
  397 | /// part count low (~140 parts for a 14 GB manifest) without large per-part
  398 | /// RAM.
  399 | const COPY_REWRITE_PART_SIZE: usize = 100 * 1024 * 1024;
  400 | 
  401 | /// Copy `from` to `to`, falling back to a multipart-equivalent read+rewrite
  402 | /// when the source exceeds the server-side-copy size limit
  403 | /// (`MAX_SERVER_SIDE_COPY_BYTES`).
  404 | ///
  405 | /// For sources below the limit, this is the same fast server-side
  406 | /// `store.copy()` as before. For larger sources, the source is streamed
  407 | /// through the client and re-uploaded as a multipart upload at `to`. This
  408 | /// doubles bytes-on-the-wire for the rare large case while preserving the
  409 | /// cheap fast path for the common small case.
  410 | ///
  411 | /// `size` is the known source size. It is required: the only caller already
  412 | /// has it, and the alternative (an extra `head(from)` round-trip) is work
  413 | /// the caller can avoid by passing what it already knows.
  414 | ///
  415 | /// `NotFound` errors on `from` propagate unchanged so callers can keep
  416 | /// existing `Err(NotFound { .. })` arms.
  417 | ///
  418 | /// This is a workaround for the missing `UploadPartCopy` primitive in the
  419 | /// upstream `object_store` crate. Once that lands, this helper can be
  420 | /// deleted and the call sites can go back to plain `store.copy()`.
  421 | async fn copy_size_aware(
  422 |     store: &dyn OSObjectStore,
  423 |     from: &Path,
  424 |     to: &Path,
  425 |     size: u64,
  426 | ) -> std::result::Result<(), ObjectStoreError> {
  427 |     if size < MAX_SERVER_SIDE_COPY_BYTES {
  428 |         store.copy(from, to).await
  429 |     } else {
  430 |         copy_via_read_rewrite(store, from, to).await
  431 |     }
  432 | }
  433 | 
  434 | /// Copy the selected staging manifest to its canonical path.
  435 | ///
  436 | /// A successful copy is the object store's acknowledgement that the known
  437 | /// immutable bytes were materialized. We then HEAD the destination for two
  438 | /// separate reasons: validate that the materialized size matches the selected
  439 | /// staging object, and return the physical-generation token observed by this
  440 | /// caller. The token is not content identity, but downstream caches currently
  441 | /// use it to avoid reusing an older object at the same `(uri, version)`.
  442 | ///
  443 | /// `NotFound` is different: the selected staging object may have disappeared
  444 | /// because another helper finalized and deleted it, or because the commit is
  445 | /// unrecoverable. Only in that ambiguous recovery path do we HEAD the canonical
  446 | /// object and require its size to match the external-store-selected staging
  447 | /// manifest. Any ETag returned by that required HEAD is merely the current
  448 | /// object's opaque generation metadata.
  449 | async fn copy_or_verify_final_manifest(
  450 |     object_store: &dyn OSObjectStore,
  451 |     staging_path: &Path,
  452 |     final_path: &Path,
  453 |     version: u64,
  454 |     selected_size: u64,
  455 | ) -> Result<Option<String>> {
  456 |     match copy_size_aware(object_store, staging_path, final_path, selected_size).await {
  457 |         Ok(()) => {
  458 |             info!(target: TRACE_FILE_AUDIT, mode=AUDIT_MODE_CREATE, r#type=AUDIT_TYPE_MANIFEST, path = final_path.as_ref());
  459 |             let final_meta = object_store.head(final_path).await?;
  460 |             if final_meta.size != selected_size {
  461 |                 return Err(Error::corrupt_file(
  462 |                     final_path.clone(),
  463 |                     format!(
  464 |                         "Manifest size mismatch for version {}: selected staging manifest had {}, object store returned {}",
  465 |                         version, selected_size, final_meta.size
  466 |                     ),
  467 |                 ));
  468 |             }
  469 |             Ok(final_meta.e_tag)
  470 |         }
  471 |         Err(ObjectStoreError::NotFound { .. }) => match object_store.head(final_path).await {
  472 |             Ok(final_meta) if final_meta.size == selected_size => Ok(final_meta.e_tag),
  473 |             Ok(final_meta) => Err(Error::corrupt_file(
  474 |                 final_path.clone(),
  475 |                 format!(
  476 |                     "Manifest size mismatch for version {}: selected staging manifest had {}, object store returned {}",
  477 |                     version, selected_size, final_meta.size
  478 |                 ),
  479 |             )),
  480 |             Err(error) => Err(error.into()),
  481 |         },
  482 |         Err(error) => Err(error.into()),
  483 |     }
  484 | }
  485 | 
  486 | // NOTE: parts are uploaded sequentially. This could be parallelized (a
  487 | // bounded JoinSet, like lance-io/src/object_writer.rs's
  488 | // LANCE_UPLOAD_CONCURRENCY) or sidestepped entirely by switching to
  489 | // `object_store::WriteMultipart` (which also handles abort-on-drop). Left
  490 | // sequential here: this is a cold path (only >5 GiB manifests) and the
  491 | // helper is itself a stopgap until `object_store` exposes UploadPartCopy.
  492 | async fn copy_via_read_rewrite(
  493 |     store: &dyn OSObjectStore,
  494 |     from: &Path,
  495 |     to: &Path,
  496 | ) -> std::result::Result<(), ObjectStoreError> {
  497 |     // NotFound here propagates upward unchanged.
  498 |     let mut stream = store.get(from).await?.into_stream();
  499 | 
  500 |     // From here on, errors must `abort()` the upload to avoid leaving an
  501 |     // orphan multipart upload on stores that support them (e.g. S3, GCS),
  502 |     // which would otherwise incur storage charges until the bucket's
  503 |     // lifecycle policy cleans it up.
  504 |     //
  505 |     // Note: this does NOT cover task cancellation — `MultipartUpload`'s
  506 |     // upstream Drop is documented as a no-op for S3/GCS. Callers that
  507 |     // need cancellation cleanliness should run this with a guard or
  508 |     // switch to `object_store::WriteMultipart` (planned follow-up).
  509 |     let mut upload = store.put_multipart(to).await?;
  510 |     let mut part_buf: Vec<u8> = Vec::with_capacity(COPY_REWRITE_PART_SIZE);
  511 | 
  512 |     while let Some(chunk) = stream.next().await {
  513 |         let chunk = match chunk {
  514 |             Ok(b) => b,
  515 |             Err(e) => {
  516 |                 let _ = upload.abort().await;
  517 |                 return Err(e);
  518 |             }
  519 |         };
  520 |         // Append the chunk in COPY_REWRITE_PART_SIZE-bounded slices so a
  521 |         // single oversized chunk (e.g., LocalFileSystem returning a whole
  522 |         // file) cannot push part_buf past the backend's per-part size limit
  523 |         // (5 GiB on S3/GCS). COPY_REWRITE_PART_SIZE is well under every
  524 |         // backend's cap, so each flushed part is always valid.
  525 |         let mut offset = 0;
  526 |         while offset < chunk.len() {
  527 |             let want = COPY_REWRITE_PART_SIZE - part_buf.len();
  528 |             let take = want.min(chunk.len() - offset);
  529 |             part_buf.extend_from_slice(&chunk[offset..offset + take]);
  530 |             offset += take;
  531 | 
  532 |             if part_buf.len() >= COPY_REWRITE_PART_SIZE {
  533 |                 let payload =
  534 |                     std::mem::replace(&mut part_buf, Vec::with_capacity(COPY_REWRITE_PART_SIZE));
  535 |                 if let Err(e) = upload.put_part(Bytes::from(payload).into()).await {
  536 |                     let _ = upload.abort().await;
  537 |                     return Err(e);
  538 |                 }
  539 |             }
  540 |         }
  541 |     }
  542 | 
  543 |     // Flush the final (possibly-short) part. The last part of a multipart
  544 |     // upload is exempt from the per-part minimum on S3/GCS.
  545 |     if !part_buf.is_empty()
  546 |         && let Err(e) = upload.put_part(Bytes::from(part_buf).into()).await
  547 |     {
  548 |         let _ = upload.abort().await;
  549 |         return Err(e);
  550 |     }
  551 | 
  552 |     if let Err(e) = upload.complete().await {
  553 |         let _ = upload.abort().await;
  554 |         return Err(e);
  555 |     }
  556 |     Ok(())
  557 | }
  558 | 
  559 | /// External manifest commit handler
  560 | /// This handler is used to commit a manifest to an external store
  561 | /// for detailed design, see <https://github.com/lance-format/lance/issues/1183>
  562 | #[derive(Debug)]
  563 | pub struct ExternalManifestCommitHandler {
  564 |     pub external_manifest_store: Arc<dyn ExternalManifestStore>,
  565 | }
  566 | 
  567 | impl ExternalManifestCommitHandler {
  568 |     async fn verify_finalized_manifest_location(
  569 |         &self,
  570 |         base_path: &Path,
  571 |         location: ManifestLocation,
  572 |         object_store: &dyn OSObjectStore,
  573 |     ) -> std::result::Result<ManifestLocation, Error> {
  574 |         match object_store.head(&location.path).await {
  575 |             Ok(ObjectMeta { size, e_tag, .. }) => {
  576 |                 let ManifestLocation {
  577 |                     version,
  578 |                     path,
  579 |                     size: expected_size,
  580 |                     naming_scheme,
  581 |                     e_tag: _,
  582 |                     identity,
  583 |                 } = location;
  584 | 
  585 |                 let size = match expected_size {
  586 |                     Some(expected_size) if expected_size != size => {
  587 |                         return Err(Error::corrupt_file(
  588 |                             path,
  589 |                             format!(
  590 |                                 "Manifest size mismatch for version {}: external store expected {}, object store returned {}",
  591 |                                 version, expected_size, size
  592 |                             ),
  593 |                         ));
  594 |                     }
  595 |                     Some(expected_size) => Some(expected_size),
  596 |                     None => Some(size),
  597 |                 };
  598 | 
  599 |                 // Ignore any ETag returned by the external index. It may be a
  600 |                 // legacy value published after a later equivalent COPY and is
  601 |                 // therefore neither a safe generation fence nor content proof.
  602 |                 // The HEAD result is the canonical object's current generation
  603 |                 // and is returned only as an ephemeral cache discriminator.
  604 | 
  605 |                 Ok(ManifestLocation {
  606 |                     version,
  607 |                     path,
  608 |                     size,
  609 |                     naming_scheme,
  610 |                     e_tag,
  611 |                     identity,
  612 |                 })
  613 |             }
  614 |             Err(ObjectStoreError::NotFound { .. }) => {
  615 |                 // The external store may hold a stale finalized V2 path while
  616 |                 // the object store still has the manifest at the V1 location.
  617 |                 default_resolve_version(base_path, location.version, object_store).await
  618 |             }
  619 |             Err(e) => Err(e.into()),
  620 |         }
  621 |     }
  622 | 
  623 |     /// Recording the staging path in the external store reserves the version
  624 |     /// for one immutable manifest. The commit becomes authoritative when those
  625 |     /// bytes are materialized at the deterministic final object-store path.
  626 |     /// Updating the external row to that final path and deleting staging are
  627 |     /// repair and garbage-collection steps. They may be completed by any number
  628 |     /// of readers or writers and must not roll back an already materialized
  629 |     /// canonical manifest.
  630 |     #[allow(clippy::too_many_arguments)]
  631 |     async fn finalize_manifest(
  632 |         &self,
  633 |         base_path: &Path,
  634 |         staging_manifest_path: &Path,
  635 |         version: u64,
  636 |         size: u64,
  637 |         store: &dyn OSObjectStore,
  638 |         naming_scheme: ManifestNamingScheme,
  639 |     ) -> std::result::Result<ManifestLocation, Error> {
  640 |         // step 1: copy the manifest to the final location
  641 |         let final_manifest_path = naming_scheme.manifest_path(base_path, version);
  642 | 
  643 |         let final_e_tag = copy_or_verify_final_manifest(
  644 |             store,
  645 |             staging_manifest_path,
  646 |             &final_manifest_path,
  647 |             version,
  648 |             size,
  649 |         )
  650 |         .await?;
  651 | 
  652 |         let location = ManifestLocation {
  653 |             version,
  654 |             path: final_manifest_path,
  655 |             size: Some(size),
  656 |             naming_scheme,
  657 |             e_tag: final_e_tag,
  658 |             identity: None,
  659 |         };
  660 | 
  661 |         // Step 2: point the external index at the final location without an
  662 |         // ETag. A direct writer and any number of helping readers can perform
  663 |         // the same immutable COPY concurrently. Since COPY and index update
  664 |         // are not atomic, persisting a helper's observed generation would let
  665 |         // an older helper overwrite a newer token. `location` retains the
  666 |         // current helper's observation for runtime cache separation only.
  667 |         let published = self
  668 |             .external_manifest_store
  669 |             .put_if_exists(
  670 |                 base_path.as_ref(),
  671 |                 version,
  672 |                 location.path.as_ref(),
  673 |                 size,
  674 |                 None,
  675 |             )
  676 |             .await;
  677 | 
  678 |         if let Err(error) = published {
  679 |             // The canonical object is the data authority. Retaining staging
  680 |             // lets another helper repair the external index without making
  681 |             // this successfully materialized commit appear to have failed.
  682 |             warn!(
  683 |                 "Final manifest '{}' is committed, but the external manifest index could not be updated; retaining staging manifest '{}' for repair: {}",
  684 |                 location.path, staging_manifest_path, error
  685 |             );
  686 |             return Ok(location);
  687 |         }
  688 | 
  689 |         // step 3: delete the staging manifest
  690 |         match store.delete(staging_manifest_path).await {
  691 |             Ok(_) => {}
  692 |             Err(ObjectStoreError::NotFound { .. }) => {}
  693 |             Err(error) => {
  694 |                 warn!(
  695 |                     "Failed to delete finalized staging manifest '{}': {}",
  696 |                     staging_manifest_path, error
  697 |                 );
  698 |                 return Ok(location);
  699 |             }
  700 |         }
  701 |         info!(target: TRACE_FILE_AUDIT, mode=AUDIT_MODE_DELETE, r#type=AUDIT_TYPE_MANIFEST, path = staging_manifest_path.as_ref());
  702 | 
  703 |         Ok(location)
  704 |     }
  705 | }
  706 | 
  707 | #[async_trait]
  708 | impl CommitHandler for ExternalManifestCommitHandler {
  709 |     async fn version_exists(
  710 |         &self,
  711 |         base_path: &Path,
  712 |         version: u64,
  713 |         object_store: &dyn OSObjectStore,
  714 |         naming_scheme: ManifestNamingScheme,
  715 |     ) -> Result<bool> {
  716 |         match self
  717 |             .external_manifest_store
  718 |             .get_manifest_location(base_path.as_ref(), version)
  719 |             .await
  720 |         {
  721 |             Ok(_) => Ok(true),
  722 |             Err(Error::NotFound { .. }) => {
  723 |                 let path = naming_scheme.manifest_path(base_path, version);
  724 |                 match object_store.head(&path).await {
  725 |                     Ok(_) => Ok(true),
  726 |                     Err(ObjectStoreError::NotFound { .. }) => Ok(false),
  727 |                     Err(e) => Err(e.into()),
  728 |                 }
  729 |             }
  730 |             Err(e) => Err(e),
  731 |         }
  732 |     }
  733 | 
  734 |     async fn resolve_latest_location(
  735 |         &self,
  736 |         base_path: &Path,
  737 |         object_store: &ObjectStore,
  738 |     ) -> std::result::Result<ManifestLocation, Error> {
  739 |         let location = self
  740 |             .external_manifest_store
  741 |             .get_latest_manifest_location(base_path.as_ref())
  742 |             .await?;
  743 | 
  744 |         match location {
  745 |             Some(location) => {
  746 |                 if location.identity.is_some() {
  747 |                     return recorded_as_final(location, object_store.inner.as_ref()).await;
  748 |                 }
  749 |                 if location.path.extension() == Some(MANIFEST_EXTENSION) {
  750 |                     return self
  751 |                         .verify_finalized_manifest_location(
  752 |                             base_path,
  753 |                             location,
  754 |                             object_store.inner.as_ref(),
  755 |                         )
  756 |                         .await;
  757 |                 }
  758 | 
  759 |                 let ManifestLocation {
  760 |                     version,
  761 |                     path,
  762 |                     size,
  763 |                     naming_scheme,
  764 |                     e_tag: _,
  765 |                     identity,
  766 |                 } = location;
  767 | 
  768 |                 let size = if let Some(size) = size {
  769 |                     size
  770 |                 } else {
  771 |                     match object_store.inner.head(&path).await {
  772 |                         Ok(meta) => meta.size,
  773 |                         Err(ObjectStoreError::NotFound { .. }) => {
  774 |                             // there may be other threads that have finished executing finalize_manifest.
  775 |                             let new_location = self
  776 |                                 .external_manifest_store
  777 |                                 .get_manifest_location(base_path.as_ref(), version)
  778 |                                 .await?;
  779 |                             return Ok(new_location);
  780 |                         }
  781 |                         Err(e) => return Err(e.into()),
  782 |                     }
  783 |                 };
  784 | 
  785 |                 let mut final_location = self
  786 |                     .finalize_manifest(
  787 |                         base_path,
  788 |                         &path,
  789 |                         version,
  790 |                         size,
  791 |                         &object_store.inner,
  792 |                         naming_scheme,
  793 |                     )
  794 |                     .await?;
  795 |                 final_location.identity = identity;
  796 |                 Ok(final_location)
  797 |             }
  798 |             // Dataset not found in the external store, this could be because the dataset did not
  799 |             // use external store for commit before. In this case, we search for the latest manifest
  800 |             None => current_manifest_path(object_store, base_path).await,
  801 |         }
  802 |     }
  803 | 
  804 |     async fn resolve_version_location(
  805 |         &self,
  806 |         base_path: &Path,
  807 |         version: u64,
  808 |         object_store: &dyn OSObjectStore,
  809 |     ) -> std::result::Result<ManifestLocation, Error> {
  810 |         let location_res = self
  811 |             .external_manifest_store
  812 |             .get_manifest_location(base_path.as_ref(), version)
  813 |             .await;
  814 | 
  815 |         let location = match location_res {
  816 |             Ok(p) => p,
  817 |             // not board external manifest yet, direct to object store
  818 |             Err(Error::NotFound { .. }) => {
  819 |                 let path = default_resolve_version(base_path, version, object_store)
  820 |                     .await
  821 |                     .map_err(|_| Error::not_found(format!("{}@{}", base_path, version)))?
  822 |                     .path;
  823 |                 match object_store.head(&path).await {
  824 |                     Ok(ObjectMeta { size, e_tag, .. }) => {
  825 |                         let res = self
  826 |                             .external_manifest_store
  827 |                             .put_if_not_exists(
  828 |                                 base_path.as_ref(),
  829 |                                 version,
  830 |                                 path.as_ref(),
  831 |                                 size,
  832 |                                 None,
  833 |                             )
  834 |                             .await;
  835 |                         if let Err(e) = res {
  836 |                             warn!(
  837 |                                 "could not update external manifest store during load, with error: {}",
  838 |                                 e
  839 |                             );
  840 |                         }
  841 |                         let naming_scheme =
  842 |                             ManifestNamingScheme::detect_scheme_staging(path.filename().unwrap());
  843 |                         return Ok(ManifestLocation {
  844 |                             version,
  845 |                             path,
  846 |                             size: Some(size),
  847 |                             naming_scheme,
  848 |                             e_tag,
  849 |                             identity: None,
  850 |                         });
  851 |                     }
  852 |                     Err(ObjectStoreError::NotFound { .. }) => {
  853 |                         return Err(Error::not_found(path.to_string()));
  854 |                     }
  855 |                     Err(e) => return Err(e.into()),
  856 |                 }
  857 |             }
  858 |             Err(e) => return Err(e),
  859 |         };
  860 | 
  861 |         if location.identity.is_some() {
  862 |             return recorded_as_final(location, object_store).await;
  863 |         }
  864 |         if location.path.extension() == Some(MANIFEST_EXTENSION) {
  865 |             return self
  866 |                 .verify_finalized_manifest_location(base_path, location, object_store)
  867 |                 .await;
  868 |         }
  869 | 
  870 |         let naming_scheme =
  871 |             ManifestNamingScheme::detect_scheme_staging(location.path.filename().unwrap());
  872 | 
  873 |         let size = if let Some(size) = location.size {
  874 |             size
  875 |         } else {
  876 |             let meta = object_store.head(&location.path).await?;
  877 |             meta.size
  878 |         };
  879 | 
  880 |         let mut final_location = self
  881 |             .finalize_manifest(
  882 |                 base_path,
  883 |                 &location.path,
  884 |                 version,
  885 |                 size,
  886 |                 object_store,
  887 |                 naming_scheme,
  888 |             )
  889 |             .await?;
  890 |         final_location.identity = location.identity;
  891 |         Ok(final_location)
  892 |     }
  893 | 
  894 |     async fn resolve_identity(
  895 |         &self,
  896 |         base_path: &Path,
  897 |         _object_store: &ObjectStore,
  898 |         version: u64,
  899 |     ) -> Result<Option<PredecessorIdentity>> {
  900 |         Ok(self
  901 |             .external_manifest_store
  902 |             .get_identity(base_path.as_ref(), version)
  903 |             .await?
  904 |             .map(|identity| PredecessorIdentity { version, identity }))
  905 |     }
  906 | 
  907 |     fn list_manifest_locations<'a>(
  908 |         &self,
  909 |         base_path: &Path,
  910 |         object_store: &'a ObjectStore,
  911 |         sorted_descending: bool,
  912 |     ) -> BoxStream<'a, Result<ManifestLocation>> {
  913 |         let store = self.external_manifest_store.clone();
  914 |         let base_path = base_path.clone();
  915 |         futures::stream::once(async move {
  916 |             match store.list_versions(base_path.as_ref(), None).await? {
  917 |                 Some(mut locations) => {
  918 |                     if sorted_descending {
  919 |                         locations.sort_by_key(|l| std::cmp::Reverse(l.version));
  920 |                     }
  921 |                     Ok::<_, Error>(futures::stream::iter(locations.into_iter().map(Ok)).boxed())
  922 |                 }
  923 |                 None => Ok(default_list_manifest_locations(
  924 |                     &base_path,
  925 |                     object_store,
  926 |                     sorted_descending,
  927 |                 )),
  928 |             }
  929 |         })
  930 |         .try_flatten()
  931 |         .boxed()
  932 |     }
  933 | 
  934 |     fn list_manifest_locations_since<'a>(
  935 |         &self,
  936 |         base_path: &Path,
  937 |         object_store: &'a ObjectStore,
  938 |         since_version: u64,
  939 |     ) -> BoxStream<'a, Result<ManifestLocation>> {
  940 |         let store = self.external_manifest_store.clone();
  941 |         let base_path = base_path.clone();
  942 |         futures::stream::once(async move {
  943 |             match store
  944 |                 .list_versions(base_path.as_ref(), Some(since_version))
  945 |                 .await?
  946 |             {
  947 |                 Some(mut locations) => {
  948 |                     locations.retain(|l| l.version > since_version);
  949 |                     locations.sort_by_key(|l| std::cmp::Reverse(l.version));
  950 |                     Ok::<_, Error>(futures::stream::iter(locations.into_iter().map(Ok)).boxed())
  951 |                 }
  952 |                 None => Ok(default_list_manifest_locations_since(
  953 |                     &base_path,
  954 |                     object_store,
  955 |                     since_version,
  956 |                 )),
  957 |             }
  958 |         })
  959 |         .try_flatten()
  960 |         .boxed()
  961 |     }
  962 | 
  963 |     async fn commit(
  964 |         &self,
  965 |         manifest: &mut Manifest,
  966 |         indices: Option<Vec<IndexMetadata>>,
  967 |         base_path: &Path,
  968 |         object_store: &ObjectStore,
  969 |         manifest_writer: super::ManifestWriter,
  970 |         naming_scheme: ManifestNamingScheme,
  971 |         transaction: Option<Transaction>,
  972 |     ) -> std::result::Result<ManifestLocation, CommitError> {
  973 |         // path we get here is the path to the manifest we want to write
  974 |         // use object_store.base_path.as_ref() for getting the root of the dataset
  975 | 
  976 |         // step 1: Write the manifest we want to commit to object store with a temporary name
  977 |         let path = naming_scheme.manifest_path(base_path, manifest.version);
  978 |         let staging_path = make_staging_manifest_path(&path)?;
  979 |         let write_res =
  980 |             manifest_writer(object_store, manifest, indices, &staging_path, transaction).await?;
  981 | 
  982 |         // step 2 & 3: Put the manifest to external store
  983 |         let result = self
  984 |             .external_manifest_store
  985 |             .put(
  986 |                 base_path,
  987 |                 manifest.version,
  988 |                 &staging_path,
  989 |                 write_res.size as u64,
  990 |                 write_res.e_tag,
  991 |                 &object_store.inner,
  992 |                 naming_scheme,
  993 |             )
  994 |             .await;
  995 | 
  996 |         match result {
  997 |             Ok(location) => {
  998 |                 write_version_hint(object_store, base_path, manifest.version).await;
  999 |                 Ok(location)
 1000 |             }
 1001 |             Err(error) => Err(self
 1002 |                 .lose_or_retain(
 1003 |                     base_path,
 1004 |                     manifest.version,
 1005 |                     &staging_path,
 1006 |                     object_store,
 1007 |                     error,
 1008 |                 )
 1009 |                 .await),
 1010 |         }
 1011 |     }
 1012 | 
 1013 |     async fn delete(&self, base_path: &Path) -> Result<()> {
 1014 |         self.external_manifest_store
 1015 |             .delete(base_path.as_ref())
 1016 |             .await
 1017 |     }
 1018 | 
 1019 |     async fn forget_version(&self, base_path: &Path, version: u64, identity: &str) -> Result<()> {
 1020 |         self.external_manifest_store
 1021 |             .forget_version(base_path.as_ref(), version, identity)
 1022 |             .await
 1023 |     }
 1024 | 
 1025 |     fn supports_predecessor_condition(&self) -> bool {
 1026 |         self.external_manifest_store
 1027 |             .supports_predecessor_condition()
 1028 |     }
 1029 | 
 1030 |     async fn resolve_latest_identity(
 1031 |         &self,
 1032 |         base_path: &Path,
 1033 |         _object_store: &ObjectStore,
 1034 |     ) -> Result<Option<PredecessorIdentity>> {
 1035 |         let Some((version, _)) = self
 1036 |             .external_manifest_store
 1037 |             .get_latest_version(base_path.as_ref())
 1038 |             .await?
 1039 |         else {
 1040 |             return Ok(None);
 1041 |         };
 1042 |         Ok(self
 1043 |             .external_manifest_store
 1044 |             .get_identity(base_path.as_ref(), version)
 1045 |             .await?
 1046 |             .map(|identity| PredecessorIdentity { version, identity }))
 1047 |     }
 1048 | 
 1049 |     async fn commit_after(
 1050 |         &self,
 1051 |         manifest: &mut Manifest,
 1052 |         indices: Option<Vec<IndexMetadata>>,
 1053 |         base_path: &Path,
 1054 |         object_store: &ObjectStore,
 1055 |         manifest_writer: super::ManifestWriter,
 1056 |         naming_scheme: ManifestNamingScheme,
 1057 |         transaction: Option<Transaction>,
 1058 |         predecessor: &PredecessorIdentity,
 1059 |     ) -> std::result::Result<ManifestLocation, CommitError> {
 1060 |         // Written once at a staging path, which listing never discovers, and
 1061 |         // recorded as final by the reservation itself; the canonical path a
 1062 |         // recreated dataset would share is never written.
 1063 |         let path =
 1064 |             make_staging_manifest_path(&naming_scheme.manifest_path(base_path, manifest.version))?;
 1065 |         let write_res =
 1066 |             manifest_writer(object_store, manifest, indices, &path, transaction).await?;
 1067 |         let size = write_res.size as u64;
 1068 | 
 1069 |         let reserved = self
 1070 |             .external_manifest_store
 1071 |             .put_if_predecessor(
 1072 |                 base_path.as_ref(),
 1073 |                 manifest.version,
 1074 |                 path.as_ref(),
 1075 |                 size,
 1076 |                 predecessor,
 1077 |             )
 1078 |             .await;
 1079 |         match reserved {
 1080 |             Ok(Reservation::Reserved { identity }) => {
 1081 |                 write_version_hint(object_store, base_path, manifest.version).await;
 1082 |                 Ok(ManifestLocation {
 1083 |                     version: manifest.version,
 1084 |                     path,
 1085 |                     size: Some(size),
 1086 |                     naming_scheme,
 1087 |                     e_tag: write_res.e_tag,
 1088 |                     identity: Some(identity),
 1089 |                 })
 1090 |             }
 1091 |             Ok(Reservation::PredecessorChanged) => {
 1092 |                 // Nothing was recorded, so the object is ours to drop.
 1093 |                 delete_staging(object_store, &path, "refused").await;
 1094 |                 Err(CommitError::OtherError(
 1095 |                     lance_core::error::PrerequisiteFailedSnafu {
 1096 |                         message: format!(
 1097 |                             "manifest {} is no longer the predecessor this commit was judged against",
 1098 |                             predecessor.version
 1099 |                         ),
 1100 |                     }
 1101 |                     .build(),
 1102 |                 ))
 1103 |             }
 1104 |             Ok(Reservation::Taken) => Err(self
 1105 |                 .lose_or_retain(
 1106 |                     base_path,
 1107 |                     manifest.version,
 1108 |                     &path,
 1109 |                     object_store,
 1110 |                     Error::commit_conflict_source(
 1111 |                         manifest.version,
 1112 |                         "manifest already exists".into(),
 1113 |                     ),
 1114 |                 )
 1115 |                 .await),
 1116 |             Err(error) => Err(self
 1117 |                 .lose_or_retain(base_path, manifest.version, &path, object_store, error)
 1118 |                 .await),
 1119 |         }
 1120 |     }
 1121 | }
 1122 | 
 1123 | impl ExternalManifestCommitHandler {
 1124 |     /// A different recorded path proves the staging manifest lost, so it is
 1125 |     /// removed; otherwise it is retained for outcome verification.
 1126 |     async fn lose_or_retain(
 1127 |         &self,
 1128 |         base_path: &Path,
 1129 |         version: u64,
 1130 |         staging_path: &Path,
 1131 |         object_store: &ObjectStore,
 1132 |         error: Error,
 1133 |     ) -> CommitError {
 1134 |         let recorded_location = self
 1135 |             .external_manifest_store
 1136 |             .get_manifest_location(base_path.as_ref(), version)
 1137 |             .await;
 1138 |         if matches!(&recorded_location, Ok(location) if location.path != *staging_path) {
 1139 |             delete_staging(object_store, staging_path, "losing").await;
 1140 |             return CommitError::CommitConflict;
 1141 |         }
 1142 |         warn!(
 1143 |             "External manifest commit for version {} failed; retaining staging manifest \
 1144 |              '{}' until the commit outcome is resolved: {}",
 1145 |             version, staging_path, error
 1146 |         );
 1147 |         CommitError::CommitConflict
 1148 |     }
 1149 | }
 1150 | 
 1151 | /// A record from a store that keeps identities is final as recorded and is
 1152 | /// never repaired onto the canonical path.
 1153 | async fn recorded_as_final(
 1154 |     mut location: ManifestLocation,
 1155 |     object_store: &dyn OSObjectStore,
 1156 | ) -> Result<ManifestLocation> {
 1157 |     if location.size.is_none() {
 1158 |         location.size = Some(object_store.head(&location.path).await?.size);
 1159 |     }
 1160 |     Ok(location)
 1161 | }
 1162 | 
 1163 | async fn delete_staging(object_store: &ObjectStore, staging_path: &Path, why: &str) {
 1164 |     match object_store.inner.delete(staging_path).await {
 1165 |         Ok(()) => {
 1166 |             info!(target: TRACE_FILE_AUDIT, mode=AUDIT_MODE_DELETE, r#type=AUDIT_TYPE_MANIFEST, path = staging_path.as_ref());
 1167 |         }
 1168 |         Err(ObjectStoreError::NotFound { .. }) => {}
 1169 |         Err(delete_error) => {
 1170 |             warn!(
 1171 |                 "Failed to delete {} staging manifest '{}': {}",
 1172 |                 why, staging_path, delete_error
 1173 |             );
 1174 |         }
 1175 |     }
 1176 | }
 1177 | 
 1178 | #[cfg(test)]
 1179 | mod tests {
 1180 |     use std::collections::HashMap;
 1181 |     use std::sync::Mutex;
 1182 |     use std::sync::atomic::{AtomicBool, AtomicUsize, Ordering};
 1183 | 
 1184 |     use arrow_schema::{DataType, Field as ArrowField, Schema as ArrowSchema};
 1185 |     use lance_core::datatypes::Schema;
 1186 |     use lance_core::utils::testing::{ProxyObjectStore, ProxyObjectStorePolicy};
 1187 |     use lance_file::version::LanceFileVersion;
 1188 |     use tokio::sync::Notify;
 1189 | 
 1190 |     use super::*;
 1191 |     use crate::format::DataStorageFormat;
 1192 |     use crate::io::commit::{VERSIONS_DIR, write_manifest_file_to_path};
 1193 |     use futures::TryStreamExt;
 1194 | 
 1195 |     #[derive(Debug, Clone)]
 1196 |     struct StoredManifest {
 1197 |         path: String,
 1198 |         size: u64,
 1199 |         e_tag: Option<String>,
 1200 |     }
 1201 | 
 1202 |     #[derive(Debug)]
 1203 |     struct TestExternalManifestStore {
 1204 |         manifests: Mutex<HashMap<(String, u64), StoredManifest>>,
 1205 |         fail_next_put_response: AtomicBool,
 1206 |         fail_next_final_publish: AtomicBool,
 1207 |         block_first_final_publish: bool,
 1208 |         final_publish_calls: AtomicUsize,
 1209 |         first_final_publish_started: Notify,
 1210 |         release_first_final_publish: Notify,
 1211 |     }
 1212 | 
 1213 |     impl TestExternalManifestStore {
 1214 |         fn new(fail_next_put_response: bool) -> Self {
 1215 |             Self {
 1216 |                 manifests: Mutex::new(HashMap::new()),
 1217 |                 fail_next_put_response: AtomicBool::new(fail_next_put_response),
 1218 |                 fail_next_final_publish: AtomicBool::new(false),
 1219 |                 block_first_final_publish: false,
 1220 |                 final_publish_calls: AtomicUsize::new(0),
 1221 |                 first_final_publish_started: Notify::new(),
 1222 |                 release_first_final_publish: Notify::new(),
 1223 |             }
 1224 |         }
 1225 | 
 1226 |         fn failing_final_publish_once() -> Self {
 1227 |             Self {
 1228 |                 fail_next_final_publish: AtomicBool::new(true),
 1229 |                 ..Self::new(false)
 1230 |             }
 1231 |         }
 1232 | 
 1233 |         fn blocking_first_final_publish() -> Self {
 1234 |             Self {
 1235 |                 block_first_final_publish: true,
 1236 |                 ..Self::new(false)
 1237 |             }
 1238 |         }
 1239 |     }
 1240 | 
 1241 |     #[async_trait]
 1242 |     impl ExternalManifestStore for TestExternalManifestStore {
 1243 |         async fn get(&self, base_uri: &str, version: u64) -> Result<String> {
 1244 |             self.manifests
 1245 |                 .lock()
 1246 |                 .unwrap()
 1247 |                 .get(&(base_uri.to_string(), version))
 1248 |                 .map(|manifest| manifest.path.clone())
 1249 |                 .ok_or_else(|| Error::not_found(format!("{base_uri}@{version}")))
 1250 |         }
 1251 | 
 1252 |         async fn get_manifest_location(
 1253 |             &self,
 1254 |             base_uri: &str,
 1255 |             version: u64,
 1256 |         ) -> Result<ManifestLocation> {
 1257 |             let stored = self
 1258 |                 .manifests
 1259 |                 .lock()
 1260 |                 .unwrap()
 1261 |                 .get(&(base_uri.to_string(), version))
 1262 |                 .cloned()
 1263 |                 .ok_or_else(|| Error::not_found(format!("{base_uri}@{version}")))?;
 1264 |             let path = Path::from(stored.path);
 1265 |             Ok(ManifestLocation {
 1266 |                 version,
 1267 |                 naming_scheme: detect_naming_scheme_from_path(&path)?,
 1268 |                 path,
 1269 |                 size: Some(stored.size),
 1270 |                 e_tag: stored.e_tag,
 1271 |                 identity: None,
 1272 |             })
 1273 |         }
 1274 | 
 1275 |         async fn get_latest_version(&self, base_uri: &str) -> Result<Option<(u64, String)>> {
 1276 |             Ok(self
 1277 |                 .manifests
 1278 |                 .lock()
 1279 |                 .unwrap()
 1280 |                 .iter()
 1281 |                 .filter(|((stored_base, _), _)| stored_base == base_uri)
 1282 |                 .max_by_key(|((_, version), _)| *version)
 1283 |                 .map(|((_, version), manifest)| (*version, manifest.path.clone())))
 1284 |         }
 1285 | 
 1286 |         async fn put_if_not_exists(
 1287 |             &self,
 1288 |             base_uri: &str,
 1289 |             version: u64,
 1290 |             path: &str,
 1291 |             size: u64,
 1292 |             e_tag: Option<String>,
 1293 |         ) -> Result<()> {
 1294 |             let key = (base_uri.to_string(), version);
 1295 |             let mut manifests = self.manifests.lock().unwrap();
 1296 |             if manifests.contains_key(&key) {
 1297 |                 return Err(Error::commit_conflict_source(
 1298 |                     version,
 1299 |                     "manifest already exists".to_string().into(),
 1300 |                 ));
 1301 |             }
 1302 |             manifests.insert(
 1303 |                 key,
 1304 |                 StoredManifest {
 1305 |                     path: path.to_string(),
 1306 |                     size,
 1307 |                     e_tag,
 1308 |                 },
 1309 |             );
 1310 |             drop(manifests);
 1311 |             if self.fail_next_put_response.swap(false, Ordering::SeqCst) {
 1312 |                 Err(Error::io("simulated lost external-store response"))
 1313 |             } else {
 1314 |                 Ok(())
 1315 |             }
 1316 |         }
 1317 | 
 1318 |         async fn put_if_exists(
 1319 |             &self,
 1320 |             base_uri: &str,
 1321 |             version: u64,
 1322 |             path: &str,
 1323 |             size: u64,
 1324 |             e_tag: Option<String>,
 1325 |         ) -> Result<()> {
 1326 |             if self.block_first_final_publish
 1327 |                 && self.final_publish_calls.fetch_add(1, Ordering::SeqCst) == 0
 1328 |             {
 1329 |                 self.first_final_publish_started.notify_one();
 1330 |                 self.release_first_final_publish.notified().await;
 1331 |             }
 1332 |             if self.fail_next_final_publish.swap(false, Ordering::SeqCst) {
 1333 |                 return Err(Error::io("simulated final index update failure"));
 1334 |             }
 1335 |             let key = (base_uri.to_string(), version);
 1336 |             let mut manifests = self.manifests.lock().unwrap();
 1337 |             let manifest = manifests
 1338 |                 .get_mut(&key)
 1339 |                 .ok_or_else(|| Error::not_found(format!("{base_uri}@{version}")))?;
 1340 |             *manifest = StoredManifest {
 1341 |                 path: path.to_string(),
 1342 |                 size,
 1343 |                 e_tag,
 1344 |             };
 1345 |             Ok(())
 1346 |         }
 1347 |     }
 1348 | 
 1349 |     fn test_manifest() -> Manifest {
 1350 |         let arrow_schema = ArrowSchema::new(vec![ArrowField::new("id", DataType::Int32, false)]);
 1351 |         Manifest::new(
 1352 |             Schema::try_from(&arrow_schema).unwrap(),
 1353 |             Arc::new(vec![]),
 1354 |             DataStorageFormat::new(LanceFileVersion::Stable.resolve()),
 1355 |             HashMap::new(),
 1356 |         )
 1357 |     }
 1358 | 
 1359 |     #[tokio::test]
 1360 |     async fn test_finalized_manifest_ignores_legacy_external_store_etag() {
 1361 |         let external_store = Arc::new(TestExternalManifestStore::new(false));
 1362 |         let handler = ExternalManifestCommitHandler {
 1363 |             external_manifest_store: external_store.clone(),
 1364 |         };
 1365 |         let object_store = ObjectStore::memory();
 1366 |         let base_path = Path::from("dataset");
 1367 |         let final_path = ManifestNamingScheme::V2.manifest_path(&base_path, 1);
 1368 | 
 1369 |         object_store
 1370 |             .inner
 1371 |             .put(
 1372 |                 &final_path,
 1373 |                 object_store::PutPayload::from_static(b"manifest"),
 1374 |             )
 1375 |             .await
 1376 |             .unwrap();
 1377 |         let final_meta = object_store.inner.head(&final_path).await.unwrap();
 1378 | 
 1379 |         external_store
 1380 |             .put_if_not_exists(
 1381 |                 base_path.as_ref(),
 1382 |                 1,
 1383 |                 final_path.as_ref(),
 1384 |                 final_meta.size,
 1385 |                 Some("expected-generation".to_string()),
 1386 |             )
 1387 |             .await
 1388 |             .unwrap();
 1389 | 
 1390 |         let resolved = handler
 1391 |             .resolve_version_location(&base_path, 1, object_store.inner.as_ref())
 1392 |             .await
 1393 |             .expect("a legacy external-store ETag must not override object storage");
 1394 |         assert_eq!(resolved.path, final_path);
 1395 |         assert_eq!(resolved.size, Some(final_meta.size));
 1396 |         assert_eq!(resolved.e_tag, final_meta.e_tag);
 1397 |     }
 1398 | 
 1399 |     #[tokio::test]
 1400 |     async fn test_finalized_manifest_without_external_store_etag_uses_current_etag() {
 1401 |         let external_store = Arc::new(TestExternalManifestStore::new(false));
 1402 |         let handler = ExternalManifestCommitHandler {
 1403 |             external_manifest_store: external_store.clone(),
 1404 |         };
 1405 |         let object_store = ObjectStore::memory();
 1406 |         let base_path = Path::from("dataset");
 1407 |         let final_path = ManifestNamingScheme::V2.manifest_path(&base_path, 1);
 1408 | 
 1409 |         object_store
 1410 |             .inner
 1411 |             .put(
 1412 |                 &final_path,
 1413 |                 object_store::PutPayload::from_static(b"manifest"),
 1414 |             )
 1415 |             .await
 1416 |             .unwrap();
 1417 |         let final_meta = object_store.inner.head(&final_path).await.unwrap();
 1418 |         external_store
 1419 |             .put_if_not_exists(
 1420 |                 base_path.as_ref(),
 1421 |                 1,
 1422 |                 final_path.as_ref(),
 1423 |                 final_meta.size,
 1424 |                 None,
 1425 |             )
 1426 |             .await
 1427 |             .unwrap();
 1428 | 
 1429 |         let resolved = handler
 1430 |             .resolve_version_location(&base_path, 1, object_store.inner.as_ref())
 1431 |             .await
 1432 |             .expect("an absent external-store ETag must opt out of comparison");
 1433 |         assert_eq!(resolved.path, final_path);
 1434 |         assert_eq!(resolved.size, Some(final_meta.size));
 1435 |         assert_eq!(resolved.e_tag, final_meta.e_tag);
 1436 |     }
 1437 | 
 1438 |     #[tokio::test]
 1439 |     async fn test_default_store_returns_but_does_not_persist_etag() {
 1440 |         let external_store = Arc::new(TestExternalManifestStore::new(false));
 1441 |         let handler = ExternalManifestCommitHandler {
 1442 |             external_manifest_store: external_store.clone(),
 1443 |         };
 1444 |         let object_store = ObjectStore::memory();
 1445 |         let base_path = Path::from("dataset");
 1446 |         let mut manifest = test_manifest();
 1447 | 
 1448 |         let committed = handler
 1449 |             .commit(
 1450 |                 &mut manifest,
 1451 |                 None,
 1452 |                 &base_path,
 1453 |                 &object_store,
 1454 |                 write_manifest_file_to_path,
 1455 |                 ManifestNamingScheme::V2,
 1456 |                 None,
 1457 |             )
 1458 |             .await
 1459 |             .expect("the default store should finalize the selected manifest");
 1460 |         let original = object_store.inner.head(&committed.path).await.unwrap();
 1461 |         assert_eq!(committed.e_tag, original.e_tag);
 1462 | 
 1463 |         let indexed = external_store
 1464 |             .get_manifest_location(base_path.as_ref(), committed.version)
 1465 |             .await
 1466 |             .unwrap();
 1467 |         assert_eq!(indexed.e_tag, None);
 1468 | 
 1469 |         object_store
 1470 |             .inner
 1471 |             .put(
 1472 |                 &committed.path,
 1473 |                 object_store::PutPayload::from(vec![0_u8; original.size as usize]),
 1474 |             )
 1475 |             .await
 1476 |             .unwrap();
 1477 | 
 1478 |         let replacement = object_store.inner.head(&committed.path).await.unwrap();
 1479 |         assert_ne!(replacement.e_tag, original.e_tag);
 1480 | 
 1481 |         let resolved = handler
 1482 |             .resolve_version_location(&base_path, committed.version, object_store.inner.as_ref())
 1483 |             .await
 1484 |             .expect("the external index must not reject a new physical generation");
 1485 |         assert_eq!(resolved.e_tag, replacement.e_tag);
 1486 |     }
 1487 | 
 1488 |     #[tokio::test]
 1489 |     async fn test_helping_finalizer_returns_but_does_not_persist_etag() {
 1490 |         let external_store = Arc::new(TestExternalManifestStore::new(false));
 1491 |         let handler = ExternalManifestCommitHandler {
 1492 |             external_manifest_store: external_store.clone(),
 1493 |         };
 1494 |         let object_store = ObjectStore::memory();
 1495 |         let base_path = Path::from("dataset");
 1496 |         let version = 1;
 1497 |         let final_path = ManifestNamingScheme::V2.manifest_path(&base_path, version);
 1498 |         let staging_path = make_staging_manifest_path(&final_path).unwrap();
 1499 |         let manifest_bytes = Bytes::from_static(b"immutable manifest bytes");
 1500 | 
 1501 |         object_store
 1502 |             .inner
 1503 |             .put(&staging_path, manifest_bytes.clone().into())
 1504 |             .await
 1505 |             .unwrap();
 1506 |         let staging_meta = object_store.inner.head(&staging_path).await.unwrap();
 1507 |         external_store
 1508 |             .put_if_not_exists(
 1509 |                 base_path.as_ref(),
 1510 |                 version,
 1511 |                 staging_path.as_ref(),
 1512 |                 staging_meta.size,
 1513 |                 staging_meta.e_tag,
 1514 |             )
 1515 |             .await
 1516 |             .unwrap();
 1517 | 
 1518 |         let finalized = handler
 1519 |             .resolve_version_location(&base_path, version, object_store.inner.as_ref())
 1520 |             .await
 1521 |             .expect("a reader should finalize the selected staging manifest");
 1522 |         let final_meta = object_store.inner.head(&final_path).await.unwrap();
 1523 |         assert_eq!(finalized.e_tag, final_meta.e_tag);
 1524 | 
 1525 |         let indexed = external_store
 1526 |             .get_manifest_location(base_path.as_ref(), version)
 1527 |             .await
 1528 |             .unwrap();
 1529 |         assert_eq!(indexed.e_tag, None);
 1530 |     }
 1531 | 
 1532 |     #[tokio::test]
 1533 |     async fn test_onboarding_returns_but_does_not_persist_etag() {
 1534 |         let external_store = Arc::new(TestExternalManifestStore::new(false));
 1535 |         let handler = ExternalManifestCommitHandler {
 1536 |             external_manifest_store: external_store.clone(),
 1537 |         };
 1538 |         let object_store = ObjectStore::memory();
 1539 |         let base_path = Path::from("dataset");
 1540 |         let version = 1;
 1541 |         let final_path = ManifestNamingScheme::V2.manifest_path(&base_path, version);
 1542 | 
 1543 |         object_store
 1544 |             .inner
 1545 |             .put(
 1546 |                 &final_path,
 1547 |                 object_store::PutPayload::from_static(b"manifest"),
 1548 |             )
 1549 |             .await
 1550 |             .unwrap();
 1551 |         let final_meta = object_store.inner.head(&final_path).await.unwrap();
 1552 | 
 1553 |         let resolved = handler
 1554 |             .resolve_version_location(&base_path, version, object_store.inner.as_ref())
 1555 |             .await
 1556 |             .expect("an existing manifest should be indexed during onboarding");
 1557 |         assert_eq!(resolved.e_tag, final_meta.e_tag);
 1558 | 
 1559 |         let indexed = external_store
 1560 |             .get_manifest_location(base_path.as_ref(), version)
 1561 |             .await
 1562 |             .unwrap();
 1563 |         assert_eq!(indexed.e_tag, None);
 1564 |     }
 1565 | 
 1566 |     #[tokio::test]
 1567 |     async fn test_finalized_manifest_size_mismatch_remains_corruption() {
 1568 |         let external_store = Arc::new(TestExternalManifestStore::new(false));
 1569 |         let handler = ExternalManifestCommitHandler {
 1570 |             external_manifest_store: external_store.clone(),
 1571 |         };
 1572 |         let object_store = ObjectStore::memory();
 1573 |         let base_path = Path::from("dataset");
 1574 |         let final_path = ManifestNamingScheme::V2.manifest_path(&base_path, 1);
 1575 | 
 1576 |         object_store
 1577 |             .inner
 1578 |             .put(
 1579 |                 &final_path,
 1580 |                 object_store::PutPayload::from_static(b"manifest"),
 1581 |             )
 1582 |             .await
 1583 |             .unwrap();
 1584 |         let final_meta = object_store.inner.head(&final_path).await.unwrap();
 1585 |         external_store
 1586 |             .put_if_not_exists(
 1587 |                 base_path.as_ref(),
 1588 |                 1,
 1589 |                 final_path.as_ref(),
 1590 |                 final_meta.size + 1,
 1591 |                 None,
 1592 |             )
 1593 |             .await
 1594 |             .unwrap();
 1595 | 
 1596 |         let error = handler
 1597 |             .resolve_version_location(&base_path, 1, object_store.inner.as_ref())
 1598 |             .await
 1599 |             .expect_err("copies of the selected staging object must preserve its size");
 1600 |         assert!(matches!(error, Error::CorruptFile { .. }));
 1601 |         assert!(error.to_string().contains("Manifest size mismatch"));
 1602 |     }
 1603 | 
 1604 |     #[tokio::test]
 1605 |     async fn test_canonical_manifest_commits_before_index_repair() {
 1606 |         let external_store = Arc::new(TestExternalManifestStore::failing_final_publish_once());
 1607 |         let handler = ExternalManifestCommitHandler {
 1608 |             external_manifest_store: external_store.clone(),
 1609 |         };
 1610 |         let object_store = ObjectStore::memory();
 1611 |         let base_path = Path::from("dataset");
 1612 |         let mut manifest = test_manifest();
 1613 |         let version = manifest.version;
 1614 |         let final_path = ManifestNamingScheme::V2.manifest_path(&base_path, version);
 1615 | 
 1616 |         let committed = handler
 1617 |             .commit(
 1618 |                 &mut manifest,
 1619 |                 None,
 1620 |                 &base_path,
 1621 |                 &object_store,
 1622 |                 write_manifest_file_to_path,
 1623 |                 ManifestNamingScheme::V2,
 1624 |                 None,
 1625 |             )
 1626 |             .await
 1627 |             .expect("a failed index update must not overturn a canonical S3 commit");
 1628 |         assert_eq!(committed.path, final_path);
 1629 |         assert!(
 1630 |             committed.e_tag.is_some(),
 1631 |             "the caller must retain the canonical generation even when index repair fails"
 1632 |         );
 1633 |         object_store
 1634 |             .inner
 1635 |             .head(&final_path)
 1636 |             .await
 1637 |             .expect("the canonical manifest is the durable commit point");
 1638 | 
 1639 |         let pending = external_store
 1640 |             .get_manifest_location(base_path.as_ref(), version)
 1641 |             .await
 1642 |             .unwrap();
 1643 |         assert_ne!(pending.path, final_path);
 1644 |         object_store
 1645 |             .inner
 1646 |             .head(&pending.path)
 1647 |             .await
 1648 |             .expect("staging must remain until the external index is repaired");
 1649 | 
 1650 |         let repaired = handler
 1651 |             .resolve_version_location(&base_path, version, object_store.inner.as_ref())
 1652 |             .await
 1653 |             .expect("a reader must be able to repair the pending external index");
 1654 |         assert_eq!(repaired.path, final_path);
 1655 |         assert!(
 1656 |             repaired.e_tag.is_some(),
 1657 |             "a helping reader must receive the generation it observed"
 1658 |         );
 1659 |         let indexed = external_store
 1660 |             .get_manifest_location(base_path.as_ref(), version)
 1661 |             .await
 1662 |             .unwrap();
 1663 |         assert_eq!(indexed.path, final_path);
 1664 |         assert_eq!(indexed.size, repaired.size);
 1665 |         assert_eq!(
 1666 |             indexed.e_tag, None,
 1667 |             "the repaired index must not retain a physical object generation"
 1668 |         );
 1669 |         let staging_error = object_store
 1670 |             .inner
 1671 |             .head(&pending.path)
 1672 |             .await
 1673 |             .expect_err("repair should garbage-collect the retained staging object");
 1674 |         assert!(matches!(staging_error, ObjectStoreError::NotFound { .. }));
 1675 |     }
 1676 | 
 1677 |     #[tokio::test]
 1678 |     async fn test_concurrent_finalizers_return_but_do_not_persist_generations() {
 1679 |         let external_store = Arc::new(TestExternalManifestStore::blocking_first_final_publish());
 1680 |         let handler = ExternalManifestCommitHandler {
 1681 |             external_manifest_store: external_store.clone(),
 1682 |         };
 1683 |         let object_store = ObjectStore::memory();
 1684 |         let base_path = Path::from("dataset");
 1685 |         let version = 1;
 1686 |         let final_path = ManifestNamingScheme::V2.manifest_path(&base_path, version);
 1687 |         let staging_path = make_staging_manifest_path(&final_path).unwrap();
 1688 |         let manifest_bytes = Bytes::from_static(b"immutable manifest bytes");
 1689 | 
 1690 |         object_store
 1691 |             .inner
 1692 |             .put(&staging_path, manifest_bytes.clone().into())
 1693 |             .await
 1694 |             .unwrap();
 1695 |         let staging_meta = object_store.inner.head(&staging_path).await.unwrap();
 1696 | 
 1697 |         let writer_store = object_store.inner.clone();
 1698 |         let writer_external_store = external_store.clone();
 1699 |         let writer_base_path = base_path.clone();
 1700 |         let writer_staging_path = staging_path.clone();
 1701 |         let writer_e_tag = staging_meta.e_tag.clone();
 1702 |         let writer = tokio::spawn(async move {
 1703 |             writer_external_store
 1704 |                 .put(
 1705 |                     &writer_base_path,
 1706 |                     version,
 1707 |                     &writer_staging_path,
 1708 |                     staging_meta.size,
 1709 |                     writer_e_tag,
 1710 |                     writer_store.as_ref(),
 1711 |                     ManifestNamingScheme::V2,
 1712 |                 )
 1713 |                 .await
 1714 |         });
 1715 | 
 1716 |         tokio::time::timeout(
 1717 |             std::time::Duration::from_secs(5),
 1718 |             external_store.first_final_publish_started.notified(),
 1719 |         )
 1720 |         .await
 1721 |         .expect("the direct finalizer should pause after COPY");
 1722 | 
 1723 |         let first_generation = object_store.inner.head(&final_path).await.unwrap();
 1724 |         let reservation = external_store
 1725 |             .get_manifest_location(base_path.as_ref(), version)
 1726 |             .await
 1727 |             .unwrap();
 1728 |         assert_eq!(reservation.path, staging_path);
 1729 |         assert_eq!(reservation.e_tag, None);
 1730 | 
 1731 |         // The writer created generation E1. While its final index update is
 1732 |         // paused, a reader observes the DDB-selected staging path and performs
 1733 |         // the same immutable copy, producing generation E2. Each helper HEADs
 1734 |         // the canonical object after its copy and returns the generation it
 1735 |         // observed, but neither persists that race-prone token in the external
 1736 |         // index. Both copies have exactly the same bytes; only their physical
 1737 |         // object generations differ.
 1738 |         let reader_location = handler
 1739 |             .resolve_version_location(&base_path, version, object_store.inner.as_ref())
 1740 |             .await
 1741 |             .unwrap();
 1742 | 
 1743 |         external_store.release_first_final_publish.notify_one();
 1744 |         let writer_location = writer.await.unwrap().unwrap();
 1745 |         let final_meta = object_store.inner.head(&final_path).await.unwrap();
 1746 |         let final_bytes = object_store
 1747 |             .inner
 1748 |             .get(&final_path)
 1749 |             .await
 1750 |             .unwrap()
 1751 |             .bytes()
 1752 |             .await
 1753 |             .unwrap();
 1754 |         let indexed = external_store
 1755 |             .get_manifest_location(base_path.as_ref(), version)
 1756 |             .await
 1757 |             .unwrap();
 1758 | 
 1759 |         assert_eq!(final_bytes, manifest_bytes);
 1760 |         assert_ne!(
 1761 |             first_generation.e_tag, final_meta.e_tag,
 1762 |             "the deterministic race must create a new physical generation"
 1763 |         );
 1764 |         assert_eq!(writer_location.e_tag, first_generation.e_tag);
 1765 |         assert_eq!(reader_location.e_tag, final_meta.e_tag);
 1766 |         assert_eq!(indexed.path, final_path);
 1767 |         assert_eq!(indexed.size, Some(final_meta.size));
 1768 |         assert_eq!(
 1769 |             indexed.e_tag, None,
 1770 |             "all finalizers must publish the same generation-independent tuple"
 1771 |         );
 1772 | 
 1773 |         let resolved = handler
 1774 |             .resolve_version_location(&base_path, version, object_store.inner.as_ref())
 1775 |             .await
 1776 |             .expect("the finalized manifest must remain readable after the race");
 1777 |         assert_eq!(resolved.e_tag, final_meta.e_tag);
 1778 |     }
 1779 | 
 1780 |     #[tokio::test]
 1781 |     async fn test_lost_external_store_response_retains_staging_manifest() {
 1782 |         let external_store = Arc::new(TestExternalManifestStore::new(true));
 1783 |         let handler = ExternalManifestCommitHandler {
 1784 |             external_manifest_store: external_store.clone(),
 1785 |         };
 1786 |         let object_store = ObjectStore::memory();
 1787 |         let base_path = Path::from("dataset");
 1788 |         let mut manifest = test_manifest();
 1789 | 
 1790 |         let commit_error = handler
 1791 |             .commit(
 1792 |                 &mut manifest,
 1793 |                 None,
 1794 |                 &base_path,
 1795 |                 &object_store,
 1796 |                 write_manifest_file_to_path,
 1797 |                 ManifestNamingScheme::V2,
 1798 |                 None,
 1799 |             )
 1800 |             .await
 1801 |             .expect_err("the simulated response loss must be surfaced");
 1802 |         assert!(matches!(commit_error, CommitError::CommitConflict));
 1803 | 
 1804 |         let staging_path = Path::from(external_store.get("dataset", 1).await.unwrap());
 1805 |         object_store.inner.head(&staging_path).await.unwrap();
 1806 | 
 1807 |         let resolved = handler
 1808 |             .resolve_version_location(&base_path, 1, object_store.inner.as_ref())
 1809 |             .await
 1810 |             .expect("the retained staging manifest must allow finalization");
 1811 |         assert_eq!(
 1812 |             resolved.path,
 1813 |             ManifestNamingScheme::V2.manifest_path(&base_path, 1)
 1814 |         );
 1815 |         object_store.inner.head(&resolved.path).await.unwrap();
 1816 |     }
 1817 | 
 1818 |     #[tokio::test]
 1819 |     async fn test_finalization_returns_etag_without_persisting_it() {
 1820 |         let external_store = Arc::new(TestExternalManifestStore::new(false));
 1821 |         let handler = ExternalManifestCommitHandler {
 1822 |             external_manifest_store: external_store.clone(),
 1823 |         };
 1824 |         let object_store = ObjectStore::memory();
 1825 |         let base_path = Path::from("dataset");
 1826 |         let mut manifest = test_manifest();
 1827 |         let version = manifest.version;
 1828 |         let final_path = ManifestNamingScheme::V2.manifest_path(&base_path, version);
 1829 | 
 1830 |         let committed = handler
 1831 |             .commit(
 1832 |                 &mut manifest,
 1833 |                 None,
 1834 |                 &base_path,
 1835 |                 &object_store,
 1836 |                 write_manifest_file_to_path,
 1837 |                 ManifestNamingScheme::V2,
 1838 |                 None,
 1839 |             )
 1840 |             .await
 1841 |             .expect("the generic workflow should commit the canonical manifest");
 1842 |         assert_eq!(committed.path, final_path);
 1843 |         let final_meta = object_store.inner.head(&final_path).await.unwrap();
 1844 |         assert_eq!(
 1845 |             committed.e_tag, final_meta.e_tag,
 1846 |             "the freshly committed Dataset needs the observed generation for cache separation"
 1847 |         );
 1848 | 
 1849 |         let indexed = external_store
 1850 |             .get_manifest_location(base_path.as_ref(), version)
 1851 |             .await
 1852 |             .expect("the external index must advance after the canonical copy");
 1853 |         assert_eq!(indexed.path, final_path);
 1854 |         assert_eq!(
 1855 |             indexed.e_tag, None,
 1856 |             "the external index must remain independent of physical generations"
 1857 |         );
 1858 |     }
 1859 | 
 1860 |     #[tokio::test]
 1861 |     async fn test_missing_staging_verifies_existing_final_manifest() {
 1862 |         let object_store = ObjectStore::memory();
 1863 |         let staging_path = Path::from("dataset/_versions/1.manifest-missing");
 1864 |         let final_path = Path::from("dataset/_versions/1.manifest");
 1865 |         let manifest_bytes = Bytes::from_static(b"immutable manifest bytes");
 1866 |         object_store
 1867 |             .inner
 1868 |             .put(&final_path, manifest_bytes.clone().into())
 1869 |             .await
 1870 |             .unwrap();
 1871 |         let final_meta = object_store.inner.head(&final_path).await.unwrap();
 1872 | 
 1873 |         let recovered_e_tag = copy_or_verify_final_manifest(
 1874 |             object_store.inner.as_ref(),
 1875 |             &staging_path,
 1876 |             &final_path,
 1877 |             1,
 1878 |             manifest_bytes.len() as u64,
 1879 |         )
 1880 |         .await
 1881 |         .expect("an existing canonical manifest should prove another helper finalized it");
 1882 | 
 1883 |         assert_eq!(recovered_e_tag, final_meta.e_tag);
 1884 |     }
 1885 | 
 1886 |     #[tokio::test]
 1887 |     async fn test_missing_staging_rejects_missing_final_manifest() {
 1888 |         let object_store = ObjectStore::memory();
 1889 |         let staging_path = Path::from("dataset/_versions/1.manifest-missing");
 1890 |         let final_path = Path::from("dataset/_versions/1.manifest");
 1891 | 
 1892 |         let error = copy_or_verify_final_manifest(
 1893 |             object_store.inner.as_ref(),
 1894 |             &staging_path,
 1895 |             &final_path,
 1896 |             1,
 1897 |             42,
 1898 |         )
 1899 |         .await
 1900 |         .expect_err("missing staging and canonical objects cannot establish a commit");
 1901 | 
 1902 |         assert!(matches!(error, Error::NotFound { .. }), "{error:?}");
 1903 |         assert!(error.to_string().contains(final_path.as_ref()), "{error}");
 1904 |     }
 1905 | 
 1906 |     #[tokio::test]
 1907 |     async fn test_missing_staging_rejects_wrong_final_size() {
 1908 |         let object_store = ObjectStore::memory();
 1909 |         let staging_path = Path::from("dataset/_versions/1.manifest-missing");
 1910 |         let final_path = Path::from("dataset/_versions/1.manifest");
 1911 |         object_store
 1912 |             .inner
 1913 |             .put(&final_path, Bytes::from_static(b"wrong size").into())
 1914 |             .await
 1915 |             .unwrap();
 1916 | 
 1917 |         let error = copy_or_verify_final_manifest(
 1918 |             object_store.inner.as_ref(),
 1919 |             &staging_path,
 1920 |             &final_path,
 1921 |             1,
 1922 |             42,
 1923 |         )
 1924 |         .await
 1925 |         .expect_err("a same-path object with the wrong size is not the selected manifest");
 1926 | 
 1927 |         assert!(matches!(error, Error::CorruptFile { .. }), "{error:?}");
 1928 |         assert!(
 1929 |             error.to_string().contains("Manifest size mismatch"),
 1930 |             "{error}"
 1931 |         );
 1932 |     }
 1933 | 
 1934 |     #[tokio::test]
 1935 |     async fn test_copy_failure_after_external_store_commit_retains_staging_manifest() {
 1936 |         let external_store = Arc::new(TestExternalManifestStore::new(false));
 1937 |         let handler = ExternalManifestCommitHandler {
 1938 |             external_manifest_store: external_store.clone(),
 1939 |         };
 1940 | 
 1941 |         let mut object_store = ObjectStore::memory();
 1942 |         let fail_next_copy = Arc::new(AtomicBool::new(true));
 1943 |         let failed_copy_source = Arc::new(Mutex::new(None));
 1944 |         let mut policy = ProxyObjectStorePolicy::new();
 1945 |         let policy_fail_next_copy = fail_next_copy.clone();
 1946 |         let policy_failed_copy_source = failed_copy_source.clone();
 1947 |         policy.set_before_policy(
 1948 |             "fail-copy-once",
 1949 |             Arc::new(move |method, location| {
 1950 |                 if method == "copy" && policy_fail_next_copy.swap(false, Ordering::SeqCst) {
 1951 |                     *policy_failed_copy_source.lock().unwrap() = Some(location.clone());
 1952 |                     return Err(Error::io("simulated copy failure"));
 1953 |                 }
 1954 |                 Ok(())
 1955 |             }),
 1956 |         );
 1957 |         let policy = Arc::new(Mutex::new(policy));
 1958 |         object_store.inner = Arc::new(ProxyObjectStore::new(
 1959 |             object_store.inner.clone(),
 1960 |             policy.clone(),
 1961 |         ));
 1962 | 
 1963 |         let base_path = Path::from("dataset");
 1964 |         let mut manifest = test_manifest();
 1965 |         let version = manifest.version;
 1966 |         let canonical_path = ManifestNamingScheme::V2.manifest_path(&base_path, version);
 1967 | 
 1968 |         let commit_error = handler
 1969 |             .commit(
 1970 |                 &mut manifest,
 1971 |                 None,
 1972 |                 &base_path,
 1973 |                 &object_store,
 1974 |                 write_manifest_file_to_path,
 1975 |                 ManifestNamingScheme::V2,
 1976 |                 None,
 1977 |             )
 1978 |             .await
 1979 |             .expect_err("the simulated copy failure must be surfaced");
 1980 |         assert!(matches!(commit_error, CommitError::CommitConflict));
 1981 |         assert!(
 1982 |             !fail_next_copy.load(Ordering::SeqCst),
 1983 |             "the one-shot copy failure must be consumed"
 1984 |         );
 1985 | 
 1986 |         let recorded_location = external_store
 1987 |             .get_manifest_location(base_path.as_ref(), version)
 1988 |             .await
 1989 |             .expect("the external store must retain the committed staging location");
 1990 |         let staging_path = failed_copy_source
 1991 |             .lock()
 1992 |             .unwrap()
 1993 |             .clone()
 1994 |             .expect("the failure must be injected at copy(staging, canonical)");
 1995 |         assert_eq!(recorded_location.path, staging_path);
 1996 |         object_store
 1997 |             .inner
 1998 |             .head(&staging_path)
 1999 |             .await
 2000 |             .expect("the winning staging manifest must be retained");
 2001 | 
 2002 |         let canonical_error = object_store
 2003 |             .inner
 2004 |             .head(&canonical_path)
 2005 |             .await
 2006 |             .expect_err("copy failed before creating the canonical manifest");
 2007 |         assert!(
 2008 |             matches!(canonical_error, ObjectStoreError::NotFound { .. }),
 2009 |             "unexpected canonical manifest error: {canonical_error}"
 2010 |         );
 2011 | 
 2012 |         policy.lock().unwrap().clear_before_policy("fail-copy-once");
 2013 |         let resolved = handler
 2014 |             .resolve_version_location(&base_path, version, object_store.inner.as_ref())
 2015 |             .await
 2016 |             .expect("the retained staging manifest must allow finalization");
 2017 |         assert_eq!(resolved.path, canonical_path);
 2018 | 
 2019 |         let finalized_location = external_store
 2020 |             .get_manifest_location(base_path.as_ref(), version)
 2021 |             .await
 2022 |             .expect("the external store must publish the canonical location");
 2023 |         assert_eq!(finalized_location.path, canonical_path);
 2024 |         object_store
 2025 |             .inner
 2026 |             .head(&canonical_path)
 2027 |             .await
 2028 |             .expect("the canonical manifest must exist after finalization");
 2029 | 
 2030 |         let staging_error = object_store
 2031 |             .inner
 2032 |             .head(&staging_path)
 2033 |             .await
 2034 |             .expect_err("successful finalization must clean up the staging manifest");
 2035 |         assert!(
 2036 |             matches!(staging_error, ObjectStoreError::NotFound { .. }),
 2037 |             "unexpected staging manifest error: {staging_error}"
 2038 |         );
 2039 |     }
 2040 | 
 2041 |     /// `(path, size, identity)` per version; identities are minted per record
 2042 |     /// and never reused.
 2043 |     #[derive(Debug, Default)]
 2044 |     struct IdentifiedStore {
 2045 |         rows: Mutex<HashMap<u64, (String, u64, String)>>,
 2046 |         next_identity: AtomicUsize,
 2047 |         hold_next_reservation: AtomicBool,
 2048 |         reservation_held: Notify,
 2049 |         release_reservation: Notify,
 2050 |     }
 2051 | 
 2052 |     impl IdentifiedStore {
 2053 |         fn mint(&self) -> String {
 2054 |             format!(
 2055 |                 "identity-{}",
 2056 |                 self.next_identity.fetch_add(1, Ordering::SeqCst)
 2057 |             )
 2058 |         }
 2059 | 
 2060 |         fn handler(self: &Arc<Self>) -> ExternalManifestCommitHandler {
 2061 |             ExternalManifestCommitHandler {
 2062 |                 external_manifest_store: self.clone(),
 2063 |             }
 2064 |         }
 2065 | 
 2066 |         /// Drop every record and write a replacement dataset's records at the
 2067 |         /// same versions.
 2068 |         fn recreate(&self) {
 2069 |             let mut rows = self.rows.lock().unwrap();
 2070 |             let versions: Vec<u64> = rows.keys().copied().collect();
 2071 |             rows.clear();
 2072 |             for version in versions {
 2073 |                 rows.insert(version, (v2_path(version), 1, self.mint()));
 2074 |             }
 2075 |         }
 2076 | 
 2077 |         fn identity_of(&self, version: u64) -> Option<String> {
 2078 |             self.rows
 2079 |                 .lock()
 2080 |                 .unwrap()
 2081 |                 .get(&version)
 2082 |                 .map(|row| row.2.clone())
 2083 |         }
 2084 |     }
 2085 | 
 2086 |     #[async_trait]
 2087 |     impl ExternalManifestStore for IdentifiedStore {
 2088 |         async fn get(&self, _base_uri: &str, version: u64) -> Result<String> {
 2089 |             self.rows
 2090 |                 .lock()
 2091 |                 .unwrap()
 2092 |                 .get(&version)
 2093 |                 .map(|row| row.0.clone())
 2094 |                 .ok_or_else(|| Error::not_found(format!("@{version}")))
 2095 |         }
 2096 | 
 2097 |         async fn get_manifest_location(
 2098 |             &self,
 2099 |             _base_uri: &str,
 2100 |             version: u64,
 2101 |         ) -> Result<ManifestLocation> {
 2102 |             let row = self
 2103 |                 .rows
 2104 |                 .lock()
 2105 |                 .unwrap()
 2106 |                 .get(&version)
 2107 |                 .cloned()
 2108 |                 .ok_or_else(|| Error::not_found(format!("@{version}")))?;
 2109 |             let path = Path::parse(&row.0).unwrap();
 2110 |             Ok(ManifestLocation {
 2111 |                 version,
 2112 |                 naming_scheme: detect_naming_scheme_from_path(&path)?,
 2113 |                 path,
 2114 |                 size: Some(row.1),
 2115 |                 e_tag: None,
 2116 |                 identity: Some(row.2),
 2117 |             })
 2118 |         }
 2119 | 
 2120 |         async fn get_latest_version(&self, _base_uri: &str) -> Result<Option<(u64, String)>> {
 2121 |             Ok(self
 2122 |                 .rows
 2123 |                 .lock()
 2124 |                 .unwrap()
 2125 |                 .iter()
 2126 |                 .max_by_key(|(version, _)| **version)
 2127 |                 .map(|(version, row)| (*version, row.0.clone())))
 2128 |         }
 2129 | 
 2130 |         async fn get_latest_manifest_location(
 2131 |             &self,
 2132 |             base_uri: &str,
 2133 |         ) -> Result<Option<ManifestLocation>> {
 2134 |             match self.get_latest_version(base_uri).await? {
 2135 |                 Some((version, _)) => self
 2136 |                     .get_manifest_location(base_uri, version)
 2137 |                     .await
 2138 |                     .map(Some),
 2139 |                 None => Ok(None),
 2140 |             }
 2141 |         }
 2142 | 
 2143 |         async fn put_if_not_exists(
 2144 |             &self,
 2145 |             _base_uri: &str,
 2146 |             version: u64,
 2147 |             path: &str,
 2148 |             size: u64,
 2149 |             _e_tag: Option<String>,
 2150 |         ) -> Result<()> {
 2151 |             let identity = self.mint();
 2152 |             let mut rows = self.rows.lock().unwrap();
 2153 |             if rows.contains_key(&version) {
 2154 |                 return Err(Error::commit_conflict_source(version, "exists".into()));
 2155 |             }
 2156 |             rows.insert(version, (path.to_string(), size, identity));
 2157 |             Ok(())
 2158 |         }
 2159 | 
 2160 |         async fn put_if_exists(
 2161 |             &self,
 2162 |             _base_uri: &str,
 2163 |             version: u64,
 2164 |             path: &str,
 2165 |             size: u64,
 2166 |             _e_tag: Option<String>,
 2167 |         ) -> Result<()> {
 2168 |             let mut rows = self.rows.lock().unwrap();
 2169 |             let row = rows
 2170 |                 .get_mut(&version)
 2171 |                 .ok_or_else(|| Error::not_found(format!("@{version}")))?;
 2172 |             row.0 = path.to_string();
 2173 |             row.1 = size;
 2174 |             Ok(())
 2175 |         }
 2176 | 
 2177 |         fn supports_predecessor_condition(&self) -> bool {
 2178 |             true
 2179 |         }
 2180 | 
 2181 |         async fn get_identity(&self, _base_uri: &str, version: u64) -> Result<Option<String>> {
 2182 |             Ok(self.identity_of(version))
 2183 |         }
 2184 | 
 2185 |         async fn forget_version(
 2186 |             &self,
 2187 |             _base_uri: &str,
 2188 |             version: u64,
 2189 |             identity: &str,
 2190 |         ) -> Result<()> {
 2191 |             let mut rows = self.rows.lock().unwrap();
 2192 |             if rows.get(&version).is_some_and(|row| row.2 == identity) {
 2193 |                 rows.remove(&version);
 2194 |             }
 2195 |             Ok(())
 2196 |         }
 2197 | 
 2198 |         async fn list_versions(
 2199 |             &self,
 2200 |             base_uri: &str,
 2201 |             since: Option<u64>,
 2202 |         ) -> Result<Option<Vec<ManifestLocation>>> {
 2203 |             let versions: Vec<u64> = self.rows.lock().unwrap().keys().copied().collect();
 2204 |             let mut locations = Vec::new();
 2205 |             for version in versions {
 2206 |                 if since.is_none_or(|since| version > since) {
 2207 |                     locations.push(self.get_manifest_location(base_uri, version).await?);
 2208 |                 }
 2209 |             }
 2210 |             Ok(Some(locations))
 2211 |         }
 2212 | 
 2213 |         async fn put_if_predecessor(
 2214 |             &self,
 2215 |             _base_uri: &str,
 2216 |             version: u64,
 2217 |             path: &str,
 2218 |             size: u64,
 2219 |             predecessor: &PredecessorIdentity,
 2220 |         ) -> Result<Reservation> {
 2221 |             if self.hold_next_reservation.swap(false, Ordering::SeqCst) {
 2222 |                 self.reservation_held.notify_one();
 2223 |                 self.release_reservation.notified().await;
 2224 |             }
 2225 |             let identity = self.mint();
 2226 |             let mut rows = self.rows.lock().unwrap();
 2227 |             let held = rows
 2228 |                 .get(&predecessor.version)
 2229 |                 .is_some_and(|row| row.2 == predecessor.identity);
 2230 |             if !held {
 2231 |                 return Ok(Reservation::PredecessorChanged);
 2232 |             }
 2233 |             if rows.contains_key(&version) {
 2234 |                 return Ok(Reservation::Taken);
 2235 |             }
 2236 |             rows.insert(version, (path.to_string(), size, identity.clone()));
 2237 |             Ok(Reservation::Reserved { identity })
 2238 |         }
 2239 |     }
 2240 | 
 2241 |     fn v2_path(version: u64) -> String {
 2242 |         ManifestNamingScheme::V2
 2243 |             .manifest_path(&Path::from("dataset"), version)
 2244 |             .to_string()
 2245 |     }
 2246 | 
 2247 |     fn v2_names(versions: &[u64]) -> Vec<String> {
 2248 |         let mut names: Vec<String> = versions
 2249 |             .iter()
 2250 |             .map(|v| Path::from(v2_path(*v)).filename().unwrap().to_string())
 2251 |             .collect();
 2252 |         names.sort();
 2253 |         names
 2254 |     }
 2255 | 
 2256 |     /// Version 1 committed through `store`, plus what a conditioned commit of
 2257 |     /// version 2 needs.
 2258 |     async fn identified_fixture(
 2259 |         store: &Arc<IdentifiedStore>,
 2260 |     ) -> (
 2261 |         ExternalManifestCommitHandler,
 2262 |         ObjectStore,
 2263 |         Path,
 2264 |         PredecessorIdentity,
 2265 |     ) {
 2266 |         let handler = store.handler();
 2267 |         let object_store = ObjectStore::memory();
 2268 |         let base_path = Path::from("dataset");
 2269 |         handler
 2270 |             .commit(
 2271 |                 &mut test_manifest(),
 2272 |                 None,
 2273 |                 &base_path,
 2274 |                 &object_store,
 2275 |                 write_manifest_file_to_path,
 2276 |                 ManifestNamingScheme::V2,
 2277 |                 None,
 2278 |             )
 2279 |             .await
 2280 |             .unwrap();
 2281 |         let predecessor = handler
 2282 |             .resolve_latest_identity(&base_path, &object_store)
 2283 |             .await
 2284 |             .unwrap()
 2285 |             .unwrap();
 2286 |         assert_eq!(predecessor.version, 1);
 2287 |         (handler, object_store, base_path, predecessor)
 2288 |     }
 2289 | 
 2290 |     async fn commit_after_v2(
 2291 |         handler: &ExternalManifestCommitHandler,
 2292 |         object_store: &ObjectStore,
 2293 |         base_path: &Path,
 2294 |         predecessor: &PredecessorIdentity,
 2295 |     ) -> std::result::Result<ManifestLocation, CommitError> {
 2296 |         let mut manifest = test_manifest();
 2297 |         manifest.version = 2;
 2298 |         handler
 2299 |             .commit_after(
 2300 |                 &mut manifest,
 2301 |                 None,
 2302 |                 base_path,
 2303 |                 object_store,
 2304 |                 write_manifest_file_to_path,
 2305 |                 ManifestNamingScheme::V2,
 2306 |                 None,
 2307 |                 predecessor,
 2308 |             )
 2309 |             .await
 2310 |     }
 2311 | 
 2312 |     async fn versions_dir_files(object_store: &ObjectStore, base_path: &Path) -> Vec<String> {
 2313 |         let mut files: Vec<String> = object_store
 2314 |             .inner
 2315 |             .list(Some(&base_path.clone().join(VERSIONS_DIR)))
 2316 |             .map_ok(|meta| meta.location.filename().unwrap().to_string())
 2317 |             .try_collect()
 2318 |             .await
 2319 |             .unwrap();
 2320 |         files.sort();
 2321 |         files
 2322 |     }
 2323 | 
 2324 |     #[tokio::test]
 2325 |     async fn test_a_conditioned_commit_lands_under_its_minted_identity() {
 2326 |         let store = Arc::new(IdentifiedStore::default());
 2327 |         let (handler, object_store, base_path, predecessor) = identified_fixture(&store).await;
 2328 |         let location = commit_after_v2(&handler, &object_store, &base_path, &predecessor)
 2329 |             .await
 2330 |             .unwrap();
 2331 |         // Published at a staging name: invisible to object-store listing,
 2332 |         // final only through the store's record.
 2333 |         let name = location.path.filename().unwrap();
 2334 |         assert!(name.contains(".manifest-"), "{name}");
 2335 |         assert_eq!(ManifestNamingScheme::detect_scheme(name), None);
 2336 | 
 2337 |         assert!(location.identity.is_some());
 2338 |         assert_eq!(location.identity, store.identity_of(2));
 2339 |         let resolved = handler
 2340 |             .resolve_latest_location(&base_path, &object_store)
 2341 |             .await
 2342 |             .unwrap();
 2343 |         assert_eq!(resolved.path, location.path);
 2344 |         assert_eq!(resolved.identity, location.identity);
 2345 |         // The store, not the object store, is the history.
 2346 |         assert_eq!(
 2347 |             listed_versions(&handler, &object_store, &base_path).await,
 2348 |             vec![2, 1]
 2349 |         );
 2350 |         let since: Vec<u64> = handler
 2351 |             .list_manifest_locations_since(&base_path, &object_store, 1)
 2352 |             .map_ok(|l| l.version)
 2353 |             .try_collect()
 2354 |             .await
 2355 |             .unwrap();
 2356 |         assert_eq!(since, vec![2]);
 2357 |         assert_eq!(versions_dir_files(&object_store, &base_path).await.len(), 2);
 2358 |     }
 2359 | 
 2360 |     #[tokio::test]
 2361 |     async fn test_a_changed_predecessor_is_refused_without_publishing() {
 2362 |         let store = Arc::new(IdentifiedStore::default());
 2363 |         let (handler, object_store, base_path, _) = identified_fixture(&store).await;
 2364 |         let stale = PredecessorIdentity {
 2365 |             version: 1,
 2366 |             identity: "identity-from-a-dropped-dataset".to_string(),
 2367 |         };
 2368 |         let err = commit_after_v2(&handler, &object_store, &base_path, &stale)
 2369 |             .await
 2370 |             .unwrap_err();
 2371 |         assert!(
 2372 |             matches!(
 2373 |                 err,
 2374 |                 CommitError::OtherError(Error::PrerequisiteFailed { .. })
 2375 |             ),
 2376 |             "{err:?}"
 2377 |         );
 2378 |         assert!(store.identity_of(2).is_none());
 2379 |         assert_eq!(
 2380 |             versions_dir_files(&object_store, &base_path).await,
 2381 |             v2_names(&[1])
 2382 |         );
 2383 |     }
 2384 | 
 2385 |     #[tokio::test]
 2386 |     async fn test_a_taken_version_is_a_conflict() {
 2387 |         let store = Arc::new(IdentifiedStore::default());
 2388 |         let (handler, object_store, base_path, predecessor) = identified_fixture(&store).await;
 2389 |         store
 2390 |             .put_if_not_exists("dataset", 2, &v2_path(2), 1, None)
 2391 |             .await
 2392 |             .unwrap();
 2393 |         let err = commit_after_v2(&handler, &object_store, &base_path, &predecessor)
 2394 |             .await
 2395 |             .unwrap_err();
 2396 |         assert!(matches!(err, CommitError::CommitConflict), "{err:?}");
 2397 |         assert_eq!(
 2398 |             versions_dir_files(&object_store, &base_path).await,
 2399 |             v2_names(&[1])
 2400 |         );
 2401 |     }
 2402 | 
 2403 |     /// A recreated dataset's records never carry the observed identity, so
 2404 |     /// the reservation refuses and nothing is published.
 2405 |     #[tokio::test]
 2406 |     async fn test_a_recreation_before_publication_is_refused() {
 2407 |         let store = Arc::new(IdentifiedStore::default());
 2408 |         let (handler, object_store, base_path, predecessor) = identified_fixture(&store).await;
 2409 |         store.recreate();
 2410 |         let err = commit_after_v2(&handler, &object_store, &base_path, &predecessor)
 2411 |             .await
 2412 |             .unwrap_err();
 2413 |         assert!(
 2414 |             matches!(
 2415 |                 err,
 2416 |                 CommitError::OtherError(Error::PrerequisiteFailed { .. })
 2417 |             ),
 2418 |             "{err:?}"
 2419 |         );
 2420 |         assert_eq!(
 2421 |             versions_dir_files(&object_store, &base_path).await,
 2422 |             v2_names(&[1])
 2423 |         );
 2424 |     }
 2425 |     async fn listed_versions(
 2426 |         handler: &ExternalManifestCommitHandler,
 2427 |         object_store: &ObjectStore,
 2428 |         base_path: &Path,
 2429 |     ) -> Vec<u64> {
 2430 |         handler
 2431 |             .list_manifest_locations(base_path, object_store, true)
 2432 |             .map_ok(|l| l.version)
 2433 |             .try_collect()
 2434 |             .await
 2435 |             .unwrap()
 2436 |     }
 2437 | 
 2438 |     /// A commit cancelled after its write but before the reservation leaves
 2439 |     /// an object nothing discovers: no record, and no listed version.
 2440 |     #[tokio::test(flavor = "multi_thread")]
 2441 |     async fn test_a_cancelled_reservation_publishes_nothing() {
 2442 |         let store = Arc::new(IdentifiedStore::default());
 2443 |         let (handler, object_store, base_path, predecessor) = identified_fixture(&store).await;
 2444 |         store.hold_next_reservation.store(true, Ordering::SeqCst);
 2445 |         let task = {
 2446 |             let (handler, object_store, base_path) =
 2447 |                 (store.handler(), object_store.clone(), base_path.clone());
 2448 |             tokio::spawn(async move {
 2449 |                 commit_after_v2(&handler, &object_store, &base_path, &predecessor).await
 2450 |             })
 2451 |         };
 2452 |         tokio::time::timeout(
 2453 |             std::time::Duration::from_secs(30),
 2454 |             store.reservation_held.notified(),
 2455 |         )
 2456 |         .await
 2457 |         .expect("the commit never reached its reservation");
 2458 |         task.abort();
 2459 |         assert!(task.await.unwrap_err().is_cancelled());
 2460 | 
 2461 |         assert!(store.identity_of(2).is_none());
 2462 |         assert_eq!(
 2463 |             listed_versions(&handler, &object_store, &base_path).await,
 2464 |             vec![1]
 2465 |         );
 2466 |         // The orphaned object is on the object store, but not as a version.
 2467 |         assert_eq!(versions_dir_files(&object_store, &base_path).await.len(), 2);
 2468 |         let raw: Vec<u64> = default_list_manifest_locations(&base_path, &object_store, true)
 2469 |             .map_ok(|l| l.version)
 2470 |             .try_collect()
 2471 |             .await
 2472 |             .unwrap();
 2473 |         assert_eq!(raw, vec![1]);
 2474 |     }
 2475 |     /// Forgetting retires exactly the record cleanup removed: a stale identity
 2476 |     /// leaves a recreated dataset's record alone, and repeats are no-ops.
 2477 |     #[tokio::test]
 2478 |     async fn test_forgetting_a_version_retires_only_that_record() {
 2479 |         let store = Arc::new(IdentifiedStore::default());
 2480 |         let (handler, object_store, base_path, predecessor) = identified_fixture(&store).await;
 2481 |         commit_after_v2(&handler, &object_store, &base_path, &predecessor)
 2482 |             .await
 2483 |             .unwrap();
 2484 |         handler
 2485 |             .forget_version(&base_path, 1, "identity-from-a-dropped-dataset")
 2486 |             .await
 2487 |             .unwrap();
 2488 |         assert_eq!(
 2489 |             listed_versions(&handler, &object_store, &base_path).await,
 2490 |             vec![2, 1]
 2491 |         );
 2492 |         let identity = store.identity_of(1).unwrap();
 2493 |         handler
 2494 |             .forget_version(&base_path, 1, &identity)
 2495 |             .await
 2496 |             .unwrap();
 2497 |         handler
 2498 |             .forget_version(&base_path, 1, &identity)
 2499 |             .await
 2500 |             .unwrap();
 2501 |         assert_eq!(
 2502 |             listed_versions(&handler, &object_store, &base_path).await,
 2503 |             vec![2]
 2504 |         );
 2505 |     }
 2506 |     /// A store that mints identities but cannot retire records fails cleanup
 2507 |     /// loudly instead of leaving rows behind.
 2508 |     #[tokio::test]
 2509 |     async fn test_retirement_is_refused_where_the_store_cannot_forget() {
 2510 |         #[derive(Debug)]
 2511 |         struct NoForget(Arc<IdentifiedStore>);
 2512 |         #[async_trait]
 2513 |         impl ExternalManifestStore for NoForget {
 2514 |             async fn get(&self, b: &str, v: u64) -> Result<String> {
 2515 |                 self.0.get(b, v).await
 2516 |             }
 2517 |             async fn get_latest_version(&self, b: &str) -> Result<Option<(u64, String)>> {
 2518 |                 self.0.get_latest_version(b).await
 2519 |             }
 2520 |             async fn put_if_not_exists(
 2521 |                 &self,
 2522 |                 b: &str,
 2523 |                 v: u64,
 2524 |                 p: &str,
 2525 |                 s: u64,
 2526 |                 e: Option<String>,
 2527 |             ) -> Result<()> {
 2528 |                 self.0.put_if_not_exists(b, v, p, s, e).await
 2529 |             }
 2530 |             async fn put_if_exists(
 2531 |                 &self,
 2532 |                 b: &str,
 2533 |                 v: u64,
 2534 |                 p: &str,
 2535 |                 s: u64,
 2536 |                 e: Option<String>,
 2537 |             ) -> Result<()> {
 2538 |                 self.0.put_if_exists(b, v, p, s, e).await
 2539 |             }
 2540 |             fn supports_predecessor_condition(&self) -> bool {
 2541 |                 true
 2542 |             }
 2543 |         }
 2544 |         let handler = ExternalManifestCommitHandler {
 2545 |             external_manifest_store: Arc::new(NoForget(Arc::new(IdentifiedStore::default()))),
 2546 |         };
 2547 |         let err = handler
 2548 |             .forget_version(&Path::from("dataset"), 1, "identity-0")
 2549 |             .await
 2550 |             .unwrap_err();
 2551 |         assert!(matches!(err, Error::NotSupported { .. }), "{err}");
 2552 |     }
 2553 | }
``````
