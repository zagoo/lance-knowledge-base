> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md). Refresh 2026-10-07: [current coordinates and changed contracts](../../../../refresh-addenda/2026-10-07-84d1681e.md) at `84d1681e07af565837f2d97e72ff1b8b040cd15c` supersede affected historical statements; body remains frozen.

# rust/lance-file/src/concat.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `e14262a657b3135b6e5296ca8224f37a7cb83bc14884d1d462542d16c19f56d1`. Reviewed physical lines: 1-1587.

[Module](../../../../L1-modules/rust-lance-file-concat.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Public encoded-file concatenation and validated data-file-part API. Owns local compatibility, Blob descriptor/lease gates, page-buffer relocation, exact-version structural hooks and output factory/abort sequencing. Dataset authority, transaction/retry, fallback implementation and source-object immutability are caller boundaries. (rust/lance-file/src/concat.rs:1-1587)

## Complete range analysis

### Lines 1-38

SPDX and module contract: copy complete encoded files, owning compatibility and metadata relocation while callers own Dataset grouping, transactions and fallback. Imports provide ordered maps/sets, descriptor queues, Arrow inspection, Blob schema handling, decoder metadata, FileScheduler/ObjectWriter, protobuf Any serialization, version dispatch and writer options. No process configuration, global mutable state, unsafe block or explicit task spawn is introduced. (rust/lance-file/src/concat.rs:1-38)

### Lines 39-58

Public BlobTargetId is a private-field Arc<str> newtype with Clone/Debug/value equality. new accepts Into<Arc<str>> without nonempty/namespace validation; as_str borrows its contents. It is caller-defined runtime equality only, with no persistence, storage authority, recovery or Dataset identity guarantee. (rust/lance-file/src/concat.rs:39-58)

### Lines 59-92

Public Clone EncodedFileInput privately owns a clonable FileScheduler and optional expected u64 row count. new defaults the expectation to None; with_expected_num_rows consumes self and stores any value, including zero. path borrows the scheduler reader path; private scheduler clones the handle. Neither construction nor setting the expectation performs IO or validates immutability. (rust/lance-file/src/concat.rs:59-92)

### Lines 93-139

Public Clone DataFilePart owns EncodedFileInput, Arc cached metadata, Arc normalized schema, optional half-open Blob lease and optional BlobTargetId. Documentation says complete independently readable runtime file, not persisted Manifest fragment/checkpoint. Caller owns storage and Blob association; caller order is physical row order. Example awaits open with no lease/target and prints rows. Custom Debug exposes path, exact version, footer row count, lease and target, omitting complete schema/metadata. (rust/lance-file/src/concat.rs:93-139)

### Lines 140-169

DataFilePart::open first validates any supplied Blob range before IO, then reads all metadata, normalizes anonymous Blob descriptor children and checks optional expected rows against footer count. A mismatch is InvalidInput naming path, actual and expected, before Blob checks. Stored scheduler/metadata have no local ETag/content-hash binding or later immutability recheck. (rust/lance-file/src/concat.rs:140-169)

### Lines 170-200

Open rejects any normalized schema field with is_blob&&!is_blob_v2 as NotSupported. It projects descriptor form and delegates exact-version complete-column/uniform-length validation; every delegated error is wrapped as CorruptFile with the input path and incomplete metadata context. Returned normalized length must equal footer rows, otherwise CorruptFile. This validates encoded metadata, not all non-Blob data values. (rust/lance-file/src/concat.rs:170-200)

### Lines 201-231

If any schema field is Blob v2, open awaits descriptor validation before checking that target ID is Some. Thus missing target may be reported only after descriptor IO or a descriptor error. A Blob schema needs a target even if every descriptor is null/empty/external; a lease is required by managed values, not by schema alone. Successful open retains all inputs/Arcs/options unchanged; public num_rows returns metadata footer count. (rust/lance-file/src/concat.rs:201-231)

### Lines 232-250

descriptor_projection_schema clones Schema and applies BlobHandling::BlobsDescriptions.unload_if_needed to each root, preserving the cloned outer schema. descriptor_child_matches requires id=-1,parent_id=-1,matching name/logical type and no children. It does not compare nullability, metadata, dictionary, encoding or other Field attributes. (rust/lance-file/src/concat.rs:232-250)

### Lines 251-265

attach_blob_descriptor_children traverses fields in preorder. A childless is_blob field consumes the next queued child vector if present; when the queue is empty it remains childless. Other fields recurse. Matching is positional, not by a persisted parent ID, and there is no Result or leftover/missing-queue check. (rust/lance-file/src/concat.rs:251-265)

### Lines 266-302

normalize_blob_footer_schema counts every childless is_blob field, not only v2. With none it returns a schema clone. Otherwise it scans only top-level fields for contiguous runs matching the five descriptor children from BLOB_V2_DESC_LANCE_FIELD, drains up to the missing count into a queue, and attaches those runs to missing Blob parents in preorder. Draining holds the current index; unmatched roots advance it. Partial reconstruction silently returns, and child attribute mismatches outside the narrow matcher do not prevent reassociation. This reads the existing anonymous-ID footer representation without writing a new format. (rust/lance-file/src/concat.rs:266-302)

### Lines 303-315

validate_blob_id_range accepts None; Some requires start>=1 and start<end. InvalidInput includes start..end. The u32 half-open endpoint means a lease cannot contain u32::MAX. This function validates declared range shape only, without reserving IDs or examining descriptors. (rust/lance-file/src/concat.rs:303-315)

### Lines 316-353

Descriptor validation builds a descriptor-projected schema, collects Blob v2 field IDs and BTreeSet uniqueness. Duplicate IDs or a negative minimum produce CorruptFile. project_by_ids(...,true) keeps structural context. Exact data_file_columns maps IDs to physical columns; zipped pairs with either negative value are dropped and remaining u32 pairs collect into BTreeMap, with later duplicate keys replacing earlier ones. Exact reader_projection_from_field_ids may fail. (rust/lance-file/src/concat.rs:316-353)

### Lines 354-378

Descriptor validator reopens FileReader with selected projection, default DecoderPlugins/options and no cache; this is another metadata open after DataFilePart::open read_all_metadata. It streams RangeFull with8192 row batches,readahead4,no filter. Each batch allocates an all-true selection vector and recursively validates zipped Arrow fields/arrays. It decodes descriptor arrays rather than Blob payload content and does not collect the whole stream. (rust/lance-file/src/concat.rs:354-378)

### Lines 379-407

validate_blob_field handles Arrow field.is_blob first, assuming a Struct array and named primitive kind(UInt8),position/size(UInt64),blob_id(UInt32) columns. Missing names are CorruptFile; AsArray type mismatches can panic. It enumerates the supplied selection and skips unselected or null descriptor rows. No independent selection-length or child-validity check exists here; schema/Arrow construction are trusted. blob_uri is not fetched or validated. (rust/lance-file/src/concat.rs:379-407)

### Lines 408-444

BlobKind conversion can reject unknown byte kinds. Inline with size>0 is InvalidInput; zero-size Inline is accepted without position/ID checks. Packed/Dedicated require Some lease and ID membership; Dedicated additionally requires position0 or CorruptFile. Packed offsets/sizes and managed payload existence/length are not checked, and repeated IDs within a lease are allowed. External passes without URI/base/offset/size validation. Return after handling a Blob field, without recursively validating descriptor children as ordinary fields. (rust/lance-file/src/concat.rs:408-444)

### Lines 445-458

For ordinary Struct, intersect selected rows with parent validity, allocate a child-selection Vec<bool> and recurse through zipped children/columns. Invalid parent rows suppress checks of otherwise populated descendants. There is no explicit child-count equality check in this helper. (rust/lance-file/src/concat.rs:445-458)

### Lines 459-476

For List(i32), allocate false flags for the complete child value array; each selected valid parent marks its offset interval true, then recurse into the values. Offset casts/range slicing trust valid Arrow invariants and can panic on inconsistent arrays or selection lengths. Null/unselected parent items remain unvalidated. (rust/lance-file/src/concat.rs:459-476)

### Lines 477-499

LargeList repeats List propagation with i64 offsets cast to usize. All other Arrow data types take an empty branch, including FixedSizeList/Map/ListView-style containers at this local boundary. The function returns Ok after recursive validation; it has no direct tests in this file for container nulls or those unhandled shapes. (rust/lance-file/src/concat.rs:477-499)

### Lines 500-526

Public Clone/Debug FileConcatTarget exposes exact ConcreteFileVersion and Arc<Schema>, with private optional Blob target. new stores version/schema and None without validation; with_blob_target_id consumes self and sets Some. Release aliases must already be resolved; the type itself does not enforce target/source storage separation. (rust/lance-file/src/concat.rs:500-526)

### Lines 527-544

Public FileConcatOptions exposes read_batch_bytes:usize and writer_options:FileWriterOptions. Default threshold is16*1024*1024 bytes plus writer defaults. Despite the maximum wording, batching never splits one page, so a single oversized page can exceed the threshold. Zero is rejected only in concat_prepared, after entrypoint metadata reads. (rust/lance-file/src/concat.rs:527-544)

### Lines 545-555

Public Copy/Clone/Debug/Eq FileConcatOutput contains exact version,u64 total physical rows,u64 object size. Written uses writer summary; Reused uses loaded input metadata file_size_bytes. No path, Dataset fragment ID or Blob ID lease is returned. (rust/lance-file/src/concat.rs:545-555)

### Lines 556-588

Public FileConcatReason starts with LegacyVersion, VersionMismatch(input_index,actual,expected), SchemaMismatch(input_index), ColumnLayoutMismatch(input_index,optional physical column) and ColumnEncodingMismatch(input_index,column_index). These are structured compatibility outcomes, not necessarily errors; indices are zero-based. (rust/lance-file/src/concat.rs:556-588)

### Lines 589-608

Remaining compatibility variants are ColumnBuffers(input/column/count), ExtraGlobalBuffers(input/count including schema) and BlobColumns. Column/global buffers lack relocation support at this layer. BlobColumns applies to the ordinary concat target schema; the validated-part path explicitly permits Blob schemas. (rust/lance-file/src/concat.rs:589-608)

### Lines 609-643

Display formats legacy/version/schema/layout/encoding reasons. Layout None denotes different physical-column count, Some identifies a physical column. Version display uses ConcreteFileVersion Display; messages do not include source paths here. (rust/lance-file/src/concat.rs:609-643)

### Lines 644-662

Display reports exact unsupported column/global buffer counts and a general Blob rejection string. It implements fmt::Display only; FileConcatReason is not declared an Error. These strings are used by higher-level callers to choose error/fallback presentation. (rust/lance-file/src/concat.rs:644-662)

### Lines 663-683

Public Eq FileConcatResult distinguishes Written(output), Reused(input index,output) and Unsupported(reason); Unsupported promises no output factory call. Private PreparedInput borrows input,metadata,schema for one attempt. encoded_column_encoding serializes ColumnInfo.encoding through protobuf Any into owned bytes; comparison is serialized column encoding equality, not page encoding equality. (rust/lance-file/src/concat.rs:663-683)

### Lines 684-713

check_compatibility first rejects any Blob in the ordinary target schema, then requires a first prepared input. It derives the baseline physical columns from the first input, descriptor-projects the target only for part mode, and serializes all baseline column encodings before checking input row/version/schema. It does not itself reject target V1; public ordinary dispatch handles legacy earlier. (rust/lance-file/src/concat.rs:684-713)

### Lines 714-752

Per-input check order is expected footer rows(InvalidInput), exact version(Unsupported VersionMismatch), complete Schema equality(Unsupported SchemaMismatch), exact external-metadata validation(CorruptFile wrapping any delegated error), then normalized/footer row equality(CorruptFile). No coercion, alias equivalence, column reordering or semantic encoding comparison is attempted. (rust/lance-file/src/concat.rs:714-752)

### Lines 753-764

After metadata validation, more than one global buffer gives Unsupported ExtraGlobalBuffers; schema buffer0 is regenerated. Different column count versus the first input gives ColumnLayoutMismatch(None), although prior schema/metadata checks may reject first. A zero-global buffer case has no local rejection here; valid readers normally require schema storage upstream. (rust/lance-file/src/concat.rs:753-764)

### Lines 765-794

Each physical column must have no column-level buffers, the same index as baseline and identical serialized column-level encoding. Error order is ColumnBuffers then index layout then encoding mismatch. Different page encodings/page counts are allowed if preceding validation succeeds. Returns None after every input; it never reads page payloads or validates their absolute ranges against EOF. (rust/lance-file/src/concat.rs:765-794)

### Lines 795-833

copy_page_buffers allocates output PageInfo capacity equal to page count and groups consecutive complete pages. For each page, checked offset+size rejects u64 range overflow and checked sum(size) rejects page byte-count overflow as contextual CorruptFile with path,input,column,page. There is no local offset+size<=file_size check; subsequent scheduler IO determines out-of-file behavior. (rust/lance-file/src/concat.rs:795-833)

### Lines 834-856

A page after the first in a batch is deferred when checked cumulative bytes overflow or exceed read_batch_bytes. The first page is always admitted, even oversized. The aggregate addition is then checked. Buffer counts include zero lengths but read ranges omit them; positive offset+size arithmetic is safe only because the earlier checked pass succeeded. Page boundaries/order are preserved, with no sorting/coalescing here. (rust/lance-file/src/concat.rs:834-856)

### Lines 857-892

One scheduler request at priority0 returns all positive-length ranges in the batch, or no IO occurs if none. Consume one returned Bytes per nonempty buffer; missing response or unequal byte length is contextual IO error, including overlong results under the short-read wording. Zero buffers consume no result but still call writer.write_external_buffer(empty). Each buffer is written sequentially and its new offset/size retained. (rust/lance-file/src/concat.rs:857-892)

### Lines 893-915

After writing all buffers of each page, clone its encoding, preserve num_rows and checked-add whole-input row_offset to priority. Priority overflow is InvalidInput after possible output writes. Extra returned buffers are rejected only after the batch writes. Retain relocated PageInfo for all pages; no page decoding, retry, checksum or rollback occurs in this helper. (rust/lance-file/src/concat.rs:893-915)

### Lines 916-951

concat_prepared is generic over a FnOnce async output factory. Reject zero read threshold, run compatibility, checked-sum footer row counts, and return Reused(0,metadata size) for exactly one ordinary input. This path never calls the factory or validates/uses writer_options. Part mode passes reuse_single_input=false and always creates output after checks, even for one part. (rust/lance-file/src/concat.rs:916-951)

### Lines 952-961

After all compatibility and total-row checks, await output factory and exact create_lazy_writer. Both calls are outside the write_result async block, so an error here does not invoke the explicit writer.abort branch below. Allocate one Vec<PageInfo> per first-input physical column and row_offset0. No metadata/page count memory budget or streaming footer builder exists here. (rust/lance-file/src/concat.rs:952-961)

### Lines 962-995

Traverse inputs in caller order and columns in metadata order, invoking exact copy_external_metadata_column with whether that output column already has pages. Its closure copies buffers and appends relocated pages. Checked row_offset advances once per input after all its columns. V2_0 dispatch may skip later structural header columns; V2_1/2/3 invoke every copy. This loop is sequential across files/columns and retains all output page metadata. (rust/lance-file/src/concat.rs:962-995)

### Lines 996-1012

Finalize each output column through exact-version hook, then create ColumnInfo with baseline index/encoding, moved accumulated pages and an empty column-buffer vector. V2_0 structural header finalization reduces to one page with total rows/priority0; other current versions leave pages unchanged. Output page encodings can remain heterogeneous. (rust/lance-file/src/concat.rs:996-1012)

### Lines 1013-1037

An empty external-buffer write aligns the upcoming schema descriptor. initialize_with_external_columns receives target schema clone, constructed columns and total rows; finish writes normal metadata/footer and shuts down. Success returns Written with exact target version and writer summary counts/size. Any error inside write_result awaits writer.abort then returns the original error; abort returns no Result here. There is no cancellation Drop guard, and cancellation before reaching the match does not execute this explicit abort. (rust/lance-file/src/concat.rs:1013-1037)

### Lines 1038-1077

Public concat_files documentation promises one metadata-read pass per input, pre-factory compatibility, no Arrow page decoding and regenerated offsets/priorities/structural metadata/footer. Doctest supplies a store.create async factory. Exact generic signature accepts borrowed target and ordered input slice, an owned FnOnce()->Future<Result<Box<dyn ObjectWriter>>> and owned options; no Send bound is imposed on that factory in this entrypoint. (rust/lance-file/src/concat.rs:1038-1077)

### Lines 1078-1097

concat_files rejects empty input before IO. try_join_all concurrently reads raw metadata for every input, retaining ordered results and propagating any read error. Only afterward, target V1 or any raw Legacy result returns Unsupported LegacyVersion, before expected-row/read-batch/ordinary Blob checks. Even a V1 target causes source metadata reads; invalid source may therefore return Err instead of Unsupported. (rust/lance-file/src/concat.rs:1078-1097)

### Lines 1098-1120

Finalize all current raw metadata through exact-version finish_metadata before borrowing it into PreparedInput; encountering Legacy here is an Internal defensive error after the earlier guard. Prepared schema is the actual file_schema, with no Blob normalization on ordinary path. Invoke concat_prepared with Blob disabled and single-input reuse enabled. Payload copying happens later and assumes caller-preserved immutable inputs. (rust/lance-file/src/concat.rs:1098-1120)

### Lines 1121-1151

Public concat_data_file_parts accepts validated DataFilePart slice with the same generic factory contract. It rejects empty parts, then compares every part optional BlobTargetId to the target optional ID, even if the schema is not Blob-bearing. None versus Some or different strings is InvalidInput before lease/compatibility/options checks. It does not validate Dataset/base authority from the opaque ID. (rust/lance-file/src/concat.rs:1121-1151)

### Lines 1152-1171

Clone every supplied lease together with original part index, sort by range start, and reject adjacent overlap when right.start<left.end, reporting both original indices/ranges. Touching endpoints are legal. This compares whole declared leases, even if no managed values used them or inputs are non-Blob; no per-value ID set is computed. None leases do not participate. (rust/lance-file/src/concat.rs:1152-1171)

### Lines 1172-1182

Build PreparedInput borrowing cached part metadata and normalized part schema, then concat_prepared allows Blob columns and disables reuse. No input metadata refresh or Blob revalidation occurs at assembly. DataFilePart::open is the capability boundary, while input immutability and target storage identity remain caller obligations. (rust/lance-file/src/concat.rs:1172-1182)

### Lines 1183-1217

Private cfg(test) module imports local ObjectStore,scheduler,CachedFileSize,temp paths,Atomics and AsyncWriteExt. write_file makes one Int32 value root from supplied i32 values, constructs a current exact writer with default options, writes once,finishes and returns schema. All fallible operations unwrap; helper is not a historical fixture generator. (rust/lance-file/src/concat.rs:1183-1217)

### Lines 1218-1230

input helper creates a testing ScanScheduler, opens the path with unknown size and attaches caller expected rows. The helper itself never compares the row count; only concat/open validation uses that option. (rust/lance-file/src/concat.rs:1218-1230)

### Lines 1231-1276

V2_1 concat success writes input values[1,2,3] and[4,5]. Atomic factory must run once; result must be Written with5rows; reopened metadata must report5rows,two pages and strictly increasing page priority. No payload RecordBatch is read, no exact offsets/sizes or byte equality are asserted despite the test name mentioning relocated metadata. (rust/lance-file/src/concat.rs:1231-1276)

### Lines 1277-1295

Same test concatenates the first input alone, supplies an error-returning counted factory, and requires Reused(0,_) plus zero calls. It does not assert reused output version/rows/size or compare input bytes. (rust/lance-file/src/concat.rs:1277-1295)

### Lines 1296-1324

Schema-metadata rstest runs V2_0,V2_1,V2_2,V2_3. Each fixture writes two identical[1,2] batches in separate files with schema key review-key=review-value. Defaults select all other writer policies; no nested type or Blob fixture. (rust/lance-file/src/concat.rs:1296-1324)

### Lines 1325-1352

Concat both metadata-tagged inputs and require Written. Reopen output metadata and assert schema key preserved. Expected4rows is merely stored in helper input then bypassed by direct read_all_metadata; no row-count assertion or decoded-value equality exists here. (rust/lance-file/src/concat.rs:1325-1352)

### Lines 1353-1385

Mixed-version test suppliesV2_1 thenV2_2 againstV2_1 target. Require Unsupported VersionMismatch at input1 and factory count0. Wildcard does not assert exact actual/expected fields and does not test target/schema/column incompatibility combinations. (rust/lance-file/src/concat.rs:1353-1385)

### Lines 1386-1421

Legacy test obtains target schema from a newly writtenV2_1 file, copies checked-in exact_versions/v1.lance bytes to a local object and shuts it down. It supplies expected rows0 for the legacy input, yet requires Unsupported LegacyVersion and factory0, illustrating legacy precedence before expected-row comparison. All six binary fixture contents are now fully interpreted in dedicated supplements. (rust/lance-file/src/concat.rs:1386-1421)

### Lines 1422-1453

White-box compatibility test loads a2rowV2_1 input and replaces its first ColumnInfo with one column-level buffer(0,1). Direct check_compatibility must return ColumnBuffers(input0,column0,count1). No serialized malformed file or output factory is involved. (rust/lance-file/src/concat.rs:1422-1453)

### Lines 1454-1470

Same white-box test clears normalized column_infos while preserving schema/footer, calls compatibility and asserts CorruptFile plus schema requires1physical columns substring. This tests external metadata validation before baseline column-count reasoning. (rust/lance-file/src/concat.rs:1454-1470)

### Lines 1471-1505

Same test clones normalized pages, decrements first num_rows by1 and rebuilds ColumnInfo. check_compatibility must return CorruptFile containing descriptor reports2physical rows. It mutates only in-memory normalized metadata, not file protobuf bytes, and does not exercise copy_page_buffers. (rust/lance-file/src/concat.rs:1471-1505)

### Lines 1506-1524

Overlap test uses ordinary Int32 non-BlobV2_1 files opened as DataFilePart with declared leases1..10 and5..20 and targetIDNone. Open accepts unused leases; both valid row expectations are1. No managed Blob descriptors or payloads are created. (rust/lance-file/src/concat.rs:1506-1524)

### Lines 1525-1544

Part concat overlap must produce an error naming both part0range1..10 and part1range5..20, and factory count remains0. Error variant is not asserted. This proves whole-declared-range overlap rejection even without Blob columns; not Blob-ID content validation. (rust/lance-file/src/concat.rs:1525-1544)

### Lines 1545-1573

Missing-input test writes valid and soon-deleted2rowV2_1 files, opens scheduler before deleting the latter, then concatenates both. Requires only is_err and factory0; no error type/message or missing-source recovery assertion. (rust/lance-file/src/concat.rs:1545-1573)

### Lines 1574-1587

Corrupt-input test writes literal not a Lance file, shuts down and concatenates with a valid input. It asserts only is_err. Its factory itself returns Err and has no call counter, so this oracle alone does not prove the factory was never called. File ends with seven tests(one four-version matrix) and two helpers. No local decoded-payload equality, Blob descriptor/null/container, zero-threshold, single-part-write, short/extra IO, abort/cancellation or overflow tests. (rust/lance-file/src/concat.rs:1574-1587)

## Interaction and interpretation limits

All1,587 physical lines read in six complete bounded source outputs during ANALYZE59. Tests were inspected, not run. No network, source edits, builds, benchmarks, generator execution or dependency installation. Seven tests and two helpers are cataloged; test names/comments are not treated as stronger oracles than assertions. Current exact-version dependencies are already analyzed and were reread in narrow context. Narrow Dataset caller reads locate integration only; all six lance-file binary payloads are interpreted; full Dataset modules and encoding/IO algorithms remain pending. Runtime malformed-array panics, cancellation cleanup and memory/performance implications are source-derived, not reproduced.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Concatenation of complete encoded Lance files.
    5 | //!
    6 | //! This module owns compatibility checks and metadata relocation for copying
    7 | //! already-encoded pages into a new ordinary Lance file. Callers retain
    8 | //! responsibility for dataset-level grouping, transactions, and fallbacks.
    9 | 
   10 | use std::{
   11 |     collections::{BTreeMap, BTreeSet, VecDeque},
   12 |     fmt,
   13 |     future::Future,
   14 |     ops::Range,
   15 |     sync::Arc,
   16 | };
   17 | 
   18 | use arrow_array::{Array, ArrayRef, cast::AsArray, types::UInt8Type};
   19 | use arrow_schema::{DataType as ArrowDataType, Field as ArrowField};
   20 | use futures::TryStreamExt;
   21 | use lance_arrow::FieldExt;
   22 | use lance_core::{
   23 |     Error, Result,
   24 |     cache::LanceCache,
   25 |     datatypes::{BLOB_V2_DESC_LANCE_FIELD, BlobHandling, BlobKind, Field, Schema},
   26 | };
   27 | use lance_encoding::decoder::{ColumnInfo, DecoderPlugins, FilterExpression, PageInfo};
   28 | use lance_io::{ReadBatchParams, scheduler::FileScheduler, traits::Writer as ObjectWriter};
   29 | use prost::Message;
   30 | use prost_types::Any;
   31 | 
   32 | use crate::{
   33 |     reader::{CachedFileMetadata, FileReader, RawFileMetadataOpen},
   34 |     version::ConcreteFileVersion,
   35 |     versions,
   36 |     writer::{FileWriteSummary, FileWriterOptions},
   37 | };
   38 | 
   39 | /// Caller-defined runtime identity of the final target for Blob-bearing parts.
   40 | ///
   41 | /// Lance only compares this value when assembling data-file parts. It does not
   42 | /// interpret it as a dataset, base, or object-store identity, persist it, or
   43 | /// define a recovery protocol for it. The caller must provide the same identity
   44 | /// for every part and target that belong to one assembly operation.
   45 | #[derive(Clone, Debug, PartialEq, Eq)]
   46 | pub struct BlobTargetId(Arc<str>);
   47 | 
   48 | impl BlobTargetId {
   49 |     /// Create an opaque Blob target identity.
   50 |     pub fn new(identity: impl Into<Arc<str>>) -> Self {
   51 |         Self(identity.into())
   52 |     }
   53 | 
   54 |     /// Return the caller-defined target identity.
   55 |     pub fn as_str(&self) -> &str {
   56 |         self.0.as_ref()
   57 |     }
   58 | }
   59 | 
   60 | /// One complete immutable Lance file supplied to [`concat_files`].
   61 | #[derive(Clone)]
   62 | pub struct EncodedFileInput {
   63 |     scheduler: FileScheduler,
   64 |     expected_num_rows: Option<u64>,
   65 | }
   66 | 
   67 | impl EncodedFileInput {
   68 |     /// Create an input from an already-open file scheduler.
   69 |     pub fn new(scheduler: FileScheduler) -> Self {
   70 |         Self {
   71 |             scheduler,
   72 |             expected_num_rows: None,
   73 |         }
   74 |     }
   75 | 
   76 |     /// Require the file metadata to report this physical row count.
   77 |     ///
   78 |     /// A mismatch is an input error, not a compatibility result.
   79 |     pub fn with_expected_num_rows(mut self, expected_num_rows: u64) -> Self {
   80 |         self.expected_num_rows = Some(expected_num_rows);
   81 |         self
   82 |     }
   83 | 
   84 |     /// The path used to read this input.
   85 |     pub fn path(&self) -> &object_store::path::Path {
   86 |         self.scheduler.reader().path()
   87 |     }
   88 | 
   89 |     fn scheduler(&self) -> FileScheduler {
   90 |         self.scheduler.clone()
   91 |     }
   92 | }
   93 | 
   94 | /// A complete ordinary Lance file validated for data-file concatenation.
   95 | ///
   96 | /// A part is independently readable and is not an incomplete file-format
   97 | /// fragment or a persisted Manifest entity. Opening one reads its real footer,
   98 | /// verifies that its physical columns form a complete rectangular file, and
   99 | /// checks Blob v2 descriptors against the caller-provided ID lease. Parts with
  100 | /// Blob v2 columns are also bound to the caller-provided [`BlobTargetId`].
  101 | ///
  102 | /// This runtime value has no fragment, source-row, range, dataset, or storage
  103 | /// identity. Lance defines no serialization or recovery contract for it. The
  104 | /// caller owns the input storage and must keep every Blob-bearing part associated
  105 | /// with the dataset and base where its managed payloads were written. The order
  106 | /// passed to [`concat_data_file_parts`] determines final physical row order.
  107 | ///
  108 | /// # Example
  109 | ///
  110 | /// ```
  111 | /// use lance_file::concat::{DataFilePart, EncodedFileInput};
  112 | /// use lance_io::scheduler::FileScheduler;
  113 | ///
  114 | /// # async fn open_part(file: FileScheduler) -> lance_core::Result<()> {
  115 | /// let part = DataFilePart::open(EncodedFileInput::new(file), None, None).await?;
  116 | /// println!("part rows: {}", part.num_rows());
  117 | /// # Ok(())
  118 | /// # }
  119 | /// ```
  120 | #[derive(Clone)]
  121 | pub struct DataFilePart {
  122 |     input: EncodedFileInput,
  123 |     metadata: Arc<CachedFileMetadata>,
  124 |     schema: Arc<Schema>,
  125 |     blob_ids: Option<Range<u32>>,
  126 |     blob_target_id: Option<BlobTargetId>,
  127 | }
  128 | 
  129 | impl fmt::Debug for DataFilePart {
  130 |     fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
  131 |         f.debug_struct("DataFilePart")
  132 |             .field("path", &self.input.path())
  133 |             .field("version", &self.metadata.version)
  134 |             .field("num_rows", &self.metadata.num_rows)
  135 |             .field("blob_ids", &self.blob_ids)
  136 |             .field("blob_target_id", &self.blob_target_id)
  137 |             .finish()
  138 |     }
  139 | }
  140 | 
  141 | impl DataFilePart {
  142 |     /// Open and validate one complete encoded file.
  143 |     ///
  144 |     /// `blob_ids` is the half-open ID range leased to this part. Managed
  145 |     /// Packed and Dedicated descriptors must fall inside it. `blob_target_id`
  146 |     /// associates the part with one final target for runtime equality checks and
  147 |     /// is required whenever the part contains Blob v2 columns. It does not prove
  148 |     /// that the target belongs to a particular dataset or storage namespace.
  149 |     /// Non-empty Inline Blob v2 descriptors and legacy Blob v1 columns are
  150 |     /// rejected because their payload locations cannot be reused in a different
  151 |     /// data file.
  152 |     pub async fn open(
  153 |         input: EncodedFileInput,
  154 |         blob_ids: Option<Range<u32>>,
  155 |         blob_target_id: Option<BlobTargetId>,
  156 |     ) -> Result<Self> {
  157 |         validate_blob_id_range(blob_ids.as_ref())?;
  158 |         let metadata = Arc::new(FileReader::read_all_metadata(&input.scheduler()).await?);
  159 |         let schema = Arc::new(normalize_blob_footer_schema(metadata.file_schema.as_ref()));
  160 |         if let Some(expected_num_rows) = input.expected_num_rows
  161 |             && metadata.num_rows != expected_num_rows
  162 |         {
  163 |             return Err(Error::invalid_input(format!(
  164 |                 "part at '{}' has {} physical rows but {} were expected",
  165 |                 input.path(),
  166 |                 metadata.num_rows,
  167 |                 expected_num_rows
  168 |             )));
  169 |         }
  170 |         let has_blob_v1 = schema
  171 |             .fields_pre_order()
  172 |             .any(|field| field.is_blob() && !field.is_blob_v2());
  173 |         if has_blob_v1 {
  174 |             return Err(Error::not_supported(format!(
  175 |                 "part at '{}' contains legacy Blob v1 columns",
  176 |                 input.path()
  177 |             )));
  178 |         }
  179 |         let validation_schema = descriptor_projection_schema(schema.as_ref());
  180 |         let normalized_rows = versions::validate_external_metadata(
  181 |             metadata.version,
  182 |             &validation_schema,
  183 |             metadata.as_ref(),
  184 |         )
  185 |         .map_err(|error| {
  186 |             Error::corrupt_file(
  187 |                 input.path().clone(),
  188 |                 format!("part has incomplete file metadata: {error}"),
  189 |             )
  190 |         })?;
  191 |         if normalized_rows != metadata.num_rows {
  192 |             return Err(Error::corrupt_file(
  193 |                 input.path().clone(),
  194 |                 format!(
  195 |                     "part descriptor reports {} physical rows but its columns normalize to {normalized_rows}",
  196 |                     metadata.num_rows
  197 |                 ),
  198 |             ));
  199 |         }
  200 | 
  201 |         let has_blob_v2 = schema.fields_pre_order().any(|field| field.is_blob_v2());
  202 |         if has_blob_v2 {
  203 |             validate_blob_descriptors(
  204 |                 &input,
  205 |                 metadata.as_ref(),
  206 |                 schema.as_ref(),
  207 |                 blob_ids.as_ref(),
  208 |             )
  209 |             .await?;
  210 |             if blob_target_id.is_none() {
  211 |                 return Err(Error::invalid_input(format!(
  212 |                     "part at '{}' contains Blob v2 columns but no Blob target ID was provided",
  213 |                     input.path()
  214 |                 )));
  215 |             }
  216 |         }
  217 | 
  218 |         Ok(Self {
  219 |             input,
  220 |             metadata,
  221 |             schema,
  222 |             blob_ids,
  223 |             blob_target_id,
  224 |         })
  225 |     }
  226 | 
  227 |     /// Number of physical rows described by the part footer.
  228 |     pub fn num_rows(&self) -> u64 {
  229 |         self.metadata.num_rows
  230 |     }
  231 | }
  232 | 
  233 | fn descriptor_projection_schema(schema: &Schema) -> Schema {
  234 |     let mut projected = schema.clone();
  235 |     projected.fields = projected
  236 |         .fields
  237 |         .into_iter()
  238 |         .map(|field| BlobHandling::BlobsDescriptions.unload_if_needed(field))
  239 |         .collect();
  240 |     projected
  241 | }
  242 | 
  243 | fn descriptor_child_matches(field: &Field, expected: &Field) -> bool {
  244 |     field.id == -1
  245 |         && field.parent_id == -1
  246 |         && field.name == expected.name
  247 |         && field.logical_type == expected.logical_type
  248 |         && field.children.is_empty()
  249 | }
  250 | 
  251 | fn attach_blob_descriptor_children(
  252 |     fields: &mut [Field],
  253 |     descriptor_children: &mut VecDeque<Vec<Field>>,
  254 | ) {
  255 |     for field in fields {
  256 |         if field.is_blob() && field.children.is_empty() {
  257 |             if let Some(children) = descriptor_children.pop_front() {
  258 |                 field.children = children;
  259 |             }
  260 |         } else {
  261 |             attach_blob_descriptor_children(&mut field.children, descriptor_children);
  262 |         }
  263 |     }
  264 | }
  265 | 
  266 | /// Blob descriptor children historically use anonymous field IDs in the file
  267 | /// descriptor. Reconstruct their tree shape before applying ordinary schema
  268 | /// projection rules. This interprets the existing footer representation and
  269 | /// does not add persisted metadata or alter the file grammar.
  270 | fn normalize_blob_footer_schema(schema: &Schema) -> Schema {
  271 |     let expected = &BLOB_V2_DESC_LANCE_FIELD.children;
  272 |     let missing_descriptor_count = schema
  273 |         .fields_pre_order()
  274 |         .filter(|field| field.is_blob() && field.children.is_empty())
  275 |         .count();
  276 |     if missing_descriptor_count == 0 {
  277 |         return schema.clone();
  278 |     }
  279 |     let mut normalized = schema.clone();
  280 |     let mut descriptor_children = VecDeque::new();
  281 |     let mut field_index = 0;
  282 |     while descriptor_children.len() < missing_descriptor_count
  283 |         && field_index + expected.len() <= normalized.fields.len()
  284 |     {
  285 |         if normalized.fields[field_index..field_index + expected.len()]
  286 |             .iter()
  287 |             .zip(expected)
  288 |             .all(|(field, expected)| descriptor_child_matches(field, expected))
  289 |         {
  290 |             descriptor_children.push_back(
  291 |                 normalized
  292 |                     .fields
  293 |                     .drain(field_index..field_index + expected.len())
  294 |                     .collect(),
  295 |             );
  296 |         } else {
  297 |             field_index += 1;
  298 |         }
  299 |     }
  300 |     attach_blob_descriptor_children(&mut normalized.fields, &mut descriptor_children);
  301 |     normalized
  302 | }
  303 | 
  304 | fn validate_blob_id_range(blob_ids: Option<&Range<u32>>) -> Result<()> {
  305 |     if let Some(blob_ids) = blob_ids
  306 |         && (blob_ids.start == 0 || blob_ids.start >= blob_ids.end)
  307 |     {
  308 |         return Err(Error::invalid_input(format!(
  309 |             "part Blob ID range must be non-empty and start at 1 or greater, got {}..{}",
  310 |             blob_ids.start, blob_ids.end
  311 |         )));
  312 |     }
  313 |     Ok(())
  314 | }
  315 | 
  316 | async fn validate_blob_descriptors(
  317 |     input: &EncodedFileInput,
  318 |     metadata: &CachedFileMetadata,
  319 |     schema: &Schema,
  320 |     blob_ids: Option<&Range<u32>>,
  321 | ) -> Result<()> {
  322 |     let projected_schema = descriptor_projection_schema(schema);
  323 |     let blob_field_ids = projected_schema
  324 |         .fields_pre_order()
  325 |         .filter(|field| field.is_blob_v2())
  326 |         .map(|field| field.id)
  327 |         .collect::<Vec<_>>();
  328 |     let unique_blob_field_ids = blob_field_ids.iter().copied().collect::<BTreeSet<_>>();
  329 |     if unique_blob_field_ids.len() != blob_field_ids.len()
  330 |         || unique_blob_field_ids
  331 |             .first()
  332 |             .is_some_and(|field_id| *field_id < 0)
  333 |     {
  334 |         return Err(Error::corrupt_file(
  335 |             input.path().clone(),
  336 |             "Blob v2 fields in a data-file part must have unique non-negative field IDs",
  337 |         ));
  338 |     }
  339 |     let blob_schema = projected_schema.project_by_ids(&blob_field_ids, true);
  340 |     let (field_ids, column_indices) =
  341 |         versions::data_file_columns(metadata.version, &projected_schema);
  342 |     let field_id_to_column_index = field_ids
  343 |         .into_iter()
  344 |         .zip(column_indices)
  345 |         .filter_map(|(field_id, column_index)| {
  346 |             (field_id >= 0 && column_index >= 0).then_some((field_id as u32, column_index as u32))
  347 |         })
  348 |         .collect::<BTreeMap<_, _>>();
  349 |     let projection = versions::reader_projection_from_field_ids(
  350 |         metadata.version,
  351 |         &blob_schema,
  352 |         &field_id_to_column_index,
  353 |     )?;
  354 |     let reader = FileReader::try_open(
  355 |         input.scheduler(),
  356 |         Some(projection),
  357 |         Arc::<DecoderPlugins>::default(),
  358 |         &LanceCache::no_cache(),
  359 |         Default::default(),
  360 |     )
  361 |     .await?;
  362 |     let mut batches = reader
  363 |         .read_stream(
  364 |             ReadBatchParams::RangeFull,
  365 |             8192,
  366 |             4,
  367 |             FilterExpression::no_filter(),
  368 |         )
  369 |         .await?;
  370 |     while let Some(batch) = batches.try_next().await? {
  371 |         let selected = vec![true; batch.num_rows()];
  372 |         for (field, array) in batch.schema().fields().iter().zip(batch.columns()) {
  373 |             validate_blob_field(field.as_ref(), array, &selected, blob_ids, input.path())?;
  374 |         }
  375 |     }
  376 |     Ok(())
  377 | }
  378 | 
  379 | fn validate_blob_field(
  380 |     field: &ArrowField,
  381 |     array: &ArrayRef,
  382 |     selected: &[bool],
  383 |     blob_ids: Option<&Range<u32>>,
  384 |     path: &object_store::path::Path,
  385 | ) -> Result<()> {
  386 |     if field.is_blob() {
  387 |         let descriptors = array.as_struct();
  388 |         let kinds = descriptors
  389 |             .column_by_name("kind")
  390 |             .ok_or_else(|| Error::corrupt_file(path.clone(), "Blob v2 descriptor has no kind"))?
  391 |             .as_primitive::<UInt8Type>();
  392 |         let positions = descriptors
  393 |             .column_by_name("position")
  394 |             .ok_or_else(|| Error::corrupt_file(path.clone(), "Blob v2 descriptor has no position"))?
  395 |             .as_primitive::<arrow_array::types::UInt64Type>();
  396 |         let sizes = descriptors
  397 |             .column_by_name("size")
  398 |             .ok_or_else(|| Error::corrupt_file(path.clone(), "Blob v2 descriptor has no size"))?
  399 |             .as_primitive::<arrow_array::types::UInt64Type>();
  400 |         let ids = descriptors
  401 |             .column_by_name("blob_id")
  402 |             .ok_or_else(|| Error::corrupt_file(path.clone(), "Blob v2 descriptor has no blob_id"))?
  403 |             .as_primitive::<arrow_array::types::UInt32Type>();
  404 |         for (row, is_selected) in selected.iter().copied().enumerate() {
  405 |             if !is_selected || descriptors.is_null(row) {
  406 |                 continue;
  407 |             }
  408 |             let kind = BlobKind::try_from(kinds.value(row))?;
  409 |             match kind {
  410 |                 BlobKind::Inline if sizes.value(row) > 0 => {
  411 |                     return Err(Error::invalid_input(format!(
  412 |                         "part at '{}' contains a non-empty Inline Blob v2 descriptor at row {row}; data-file part concatenation requires Packed or Dedicated storage",
  413 |                         path
  414 |                     )));
  415 |                 }
  416 |                 BlobKind::Packed | BlobKind::Dedicated => {
  417 |                     let blob_id = ids.value(row);
  418 |                     let Some(blob_ids) = blob_ids else {
  419 |                         return Err(Error::invalid_input(format!(
  420 |                             "part at '{}' contains managed Blob ID {blob_id} at row {row} but no Blob ID range was provided",
  421 |                             path
  422 |                         )));
  423 |                     };
  424 |                     if !blob_ids.contains(&blob_id) {
  425 |                         return Err(Error::invalid_input(format!(
  426 |                             "part at '{}' contains managed Blob ID {blob_id} at row {row}, outside declared range {}..{}",
  427 |                             path, blob_ids.start, blob_ids.end
  428 |                         )));
  429 |                     }
  430 |                     if kind == BlobKind::Dedicated && positions.value(row) != 0 {
  431 |                         return Err(Error::corrupt_file(
  432 |                             path.clone(),
  433 |                             format!(
  434 |                                 "Dedicated Blob descriptor at row {row} has non-zero position {}",
  435 |                                 positions.value(row)
  436 |                             ),
  437 |                         ));
  438 |                     }
  439 |                 }
  440 |                 BlobKind::Inline | BlobKind::External => {}
  441 |             }
  442 |         }
  443 |         return Ok(());
  444 |     }
  445 | 
  446 |     match field.data_type() {
  447 |         ArrowDataType::Struct(children) => {
  448 |             let struct_array = array.as_struct();
  449 |             let child_selected = selected
  450 |                 .iter()
  451 |                 .copied()
  452 |                 .enumerate()
  453 |                 .map(|(row, is_selected)| is_selected && struct_array.is_valid(row))
  454 |                 .collect::<Vec<_>>();
  455 |             for (child, child_array) in children.iter().zip(struct_array.columns()) {
  456 |                 validate_blob_field(child.as_ref(), child_array, &child_selected, blob_ids, path)?;
  457 |             }
  458 |         }
  459 |         ArrowDataType::List(child) => {
  460 |             let list = array.as_list::<i32>();
  461 |             let mut child_selected = vec![false; list.values().len()];
  462 |             for (row, is_selected) in selected.iter().copied().enumerate() {
  463 |                 if is_selected && list.is_valid(row) {
  464 |                     let start = list.value_offsets()[row] as usize;
  465 |                     let end = list.value_offsets()[row + 1] as usize;
  466 |                     child_selected[start..end].fill(true);
  467 |                 }
  468 |             }
  469 |             validate_blob_field(
  470 |                 child.as_ref(),
  471 |                 list.values(),
  472 |                 &child_selected,
  473 |                 blob_ids,
  474 |                 path,
  475 |             )?;
  476 |         }
  477 |         ArrowDataType::LargeList(child) => {
  478 |             let list = array.as_list::<i64>();
  479 |             let mut child_selected = vec![false; list.values().len()];
  480 |             for (row, is_selected) in selected.iter().copied().enumerate() {
  481 |                 if is_selected && list.is_valid(row) {
  482 |                     let start = list.value_offsets()[row] as usize;
  483 |                     let end = list.value_offsets()[row + 1] as usize;
  484 |                     child_selected[start..end].fill(true);
  485 |                 }
  486 |             }
  487 |             validate_blob_field(
  488 |                 child.as_ref(),
  489 |                 list.values(),
  490 |                 &child_selected,
  491 |                 blob_ids,
  492 |                 path,
  493 |             )?;
  494 |         }
  495 |         _ => {}
  496 |     }
  497 |     Ok(())
  498 | }
  499 | 
  500 | /// The exact file grammar and schema required for concatenated output.
  501 | #[derive(Debug, Clone)]
  502 | pub struct FileConcatTarget {
  503 |     /// Exact output grammar. Release aliases are resolved before this boundary.
  504 |     pub version: ConcreteFileVersion,
  505 |     /// Complete schema stored in every input and regenerated in the output.
  506 |     pub schema: Arc<Schema>,
  507 |     blob_target_id: Option<BlobTargetId>,
  508 | }
  509 | 
  510 | impl FileConcatTarget {
  511 |     /// Create a concatenation target.
  512 |     pub fn new(version: ConcreteFileVersion, schema: Arc<Schema>) -> Self {
  513 |         Self {
  514 |             version,
  515 |             schema,
  516 |             blob_target_id: None,
  517 |         }
  518 |     }
  519 | 
  520 |     /// Bind Blob-bearing parts to one caller-defined final target.
  521 |     pub fn with_blob_target_id(mut self, blob_target_id: BlobTargetId) -> Self {
  522 |         self.blob_target_id = Some(blob_target_id);
  523 |         self
  524 |     }
  525 | }
  526 | 
  527 | /// Runtime controls for encoded-file concatenation.
  528 | #[derive(Debug, Clone)]
  529 | pub struct FileConcatOptions {
  530 |     /// Maximum page-buffer bytes requested in one read batch.
  531 |     pub read_batch_bytes: usize,
  532 |     /// Options passed to the exact-version footer writer.
  533 |     pub writer_options: FileWriterOptions,
  534 | }
  535 | 
  536 | impl Default for FileConcatOptions {
  537 |     fn default() -> Self {
  538 |         Self {
  539 |             read_batch_bytes: 16 * 1024 * 1024,
  540 |             writer_options: FileWriterOptions::default(),
  541 |         }
  542 |     }
  543 | }
  544 | 
  545 | /// Metadata describing the complete file represented by a concat result.
  546 | #[derive(Debug, Clone, Copy, PartialEq, Eq)]
  547 | pub struct FileConcatOutput {
  548 |     /// Exact grammar of the completed or reused file.
  549 |     pub version: ConcreteFileVersion,
  550 |     /// Total physical rows in input order.
  551 |     pub num_rows: u64,
  552 |     /// Size of the completed or reused object.
  553 |     pub size_bytes: u64,
  554 | }
  555 | 
  556 | /// A compatibility reason that requires a caller-controlled decode/re-encode fallback.
  557 | #[derive(Debug, Clone, PartialEq, Eq)]
  558 | pub enum FileConcatReason {
  559 |     /// Lance v1 does not support encoded-file concatenation.
  560 |     LegacyVersion,
  561 |     /// An input uses a different exact grammar than the target.
  562 |     VersionMismatch {
  563 |         /// Zero-based input position.
  564 |         input_index: usize,
  565 |         /// Version found in the file footer.
  566 |         actual: ConcreteFileVersion,
  567 |         /// Version requested by the target.
  568 |         expected: ConcreteFileVersion,
  569 |     },
  570 |     /// An input's persisted schema differs from the target schema.
  571 |     SchemaMismatch {
  572 |         /// Zero-based input position.
  573 |         input_index: usize,
  574 |     },
  575 |     /// Inputs do not describe the same physical columns.
  576 |     ColumnLayoutMismatch {
  577 |         /// Zero-based input position.
  578 |         input_index: usize,
  579 |         /// Zero-based physical column when one could be identified.
  580 |         column_index: Option<usize>,
  581 |     },
  582 |     /// A column-level encoding cannot safely combine its buffers.
  583 |     ColumnEncodingMismatch {
  584 |         /// Zero-based input position.
  585 |         input_index: usize,
  586 |         /// Zero-based physical column.
  587 |         column_index: usize,
  588 |     },
  589 |     /// A column uses file-level buffers whose page references cannot be relocated.
  590 |     ColumnBuffers {
  591 |         /// Zero-based input position.
  592 |         input_index: usize,
  593 |         /// Zero-based physical column.
  594 |         column_index: usize,
  595 |         /// Number of column buffers referenced by the column metadata.
  596 |         count: usize,
  597 |     },
  598 |     /// A file contains global buffers whose relocation semantics are not defined.
  599 |     ExtraGlobalBuffers {
  600 |         /// Zero-based input position.
  601 |         input_index: usize,
  602 |         /// Number of global buffers, including the schema descriptor.
  603 |         count: usize,
  604 |     },
  605 |     /// The schema contains offsets into external blob storage.
  606 |     BlobColumns,
  607 | }
  608 | 
  609 | impl fmt::Display for FileConcatReason {
  610 |     fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
  611 |         match self {
  612 |             Self::LegacyVersion => f.write_str("Lance v1 files cannot be concatenated"),
  613 |             Self::VersionMismatch {
  614 |                 input_index,
  615 |                 actual,
  616 |                 expected,
  617 |             } => write!(
  618 |                 f,
  619 |                 "input {input_index} has file version {actual}, expected {expected}"
  620 |             ),
  621 |             Self::SchemaMismatch { input_index } => {
  622 |                 write!(f, "input {input_index} has a different file schema")
  623 |             }
  624 |             Self::ColumnLayoutMismatch {
  625 |                 input_index,
  626 |                 column_index,
  627 |             } => match column_index {
  628 |                 Some(column_index) => write!(
  629 |                     f,
  630 |                     "input {input_index} has a different layout for physical column {column_index}"
  631 |                 ),
  632 |                 None => write!(
  633 |                     f,
  634 |                     "input {input_index} has a different physical column count"
  635 |                 ),
  636 |             },
  637 |             Self::ColumnEncodingMismatch {
  638 |                 input_index,
  639 |                 column_index,
  640 |             } => write!(
  641 |                 f,
  642 |                 "input {input_index} has an incompatible encoding for physical column {column_index}"
  643 |             ),
  644 |             Self::ColumnBuffers {
  645 |                 input_index,
  646 |                 column_index,
  647 |                 count,
  648 |             } => write!(
  649 |                 f,
  650 |                 "input {input_index} physical column {column_index} has {count} column buffers whose references cannot be relocated"
  651 |             ),
  652 |             Self::ExtraGlobalBuffers { input_index, count } => write!(
  653 |                 f,
  654 |                 "input {input_index} has {count} global buffers; only the schema descriptor is supported"
  655 |             ),
  656 |             Self::BlobColumns => {
  657 |                 f.write_str("schemas containing blob columns cannot be concatenated")
  658 |             }
  659 |         }
  660 |     }
  661 | }
  662 | 
  663 | /// Result of one encoded-file concatenation attempt.
  664 | #[derive(Debug, Clone, PartialEq, Eq)]
  665 | pub enum FileConcatResult {
  666 |     /// A new ordinary Lance file was written.
  667 |     Written(FileConcatOutput),
  668 |     /// One compatible complete input already is the requested output.
  669 |     Reused(usize, FileConcatOutput),
  670 |     /// Compatibility was rejected before the output factory was called.
  671 |     Unsupported(FileConcatReason),
  672 | }
  673 | 
  674 | struct PreparedInput<'a> {
  675 |     input: &'a EncodedFileInput,
  676 |     metadata: &'a CachedFileMetadata,
  677 |     schema: &'a Schema,
  678 | }
  679 | 
  680 | fn encoded_column_encoding(column: &ColumnInfo) -> Result<Vec<u8>> {
  681 |     Ok(Any::from_msg(&column.encoding)?.encode_to_vec())
  682 | }
  683 | 
  684 | fn check_compatibility(
  685 |     target: &FileConcatTarget,
  686 |     inputs: &[PreparedInput<'_>],
  687 |     allow_blob_columns: bool,
  688 | ) -> Result<Option<FileConcatReason>> {
  689 |     if !allow_blob_columns
  690 |         && target
  691 |             .schema
  692 |             .fields_pre_order()
  693 |             .any(|field| field.is_blob())
  694 |     {
  695 |         return Ok(Some(FileConcatReason::BlobColumns));
  696 |     }
  697 | 
  698 |     let Some(first) = inputs.first() else {
  699 |         return Err(Error::invalid_input(
  700 |             "concat_files requires at least one complete input file",
  701 |         ));
  702 |     };
  703 |     let baseline_columns = &first.metadata.column_infos;
  704 |     let expected_schema = if allow_blob_columns {
  705 |         descriptor_projection_schema(target.schema.as_ref())
  706 |     } else {
  707 |         target.schema.as_ref().clone()
  708 |     };
  709 |     let baseline_encodings = baseline_columns
  710 |         .iter()
  711 |         .map(|column| encoded_column_encoding(column))
  712 |         .collect::<Result<Vec<_>>>()?;
  713 | 
  714 |     for (input_index, prepared) in inputs.iter().enumerate() {
  715 |         let metadata = &prepared.metadata;
  716 |         if let Some(expected_num_rows) = prepared.input.expected_num_rows
  717 |             && metadata.num_rows != expected_num_rows
  718 |         {
  719 |             return Err(Error::invalid_input(format!(
  720 |                 "input {input_index} at '{}' has {} physical rows but {} were expected",
  721 |                 prepared.input.path(),
  722 |                 metadata.num_rows,
  723 |                 expected_num_rows
  724 |             )));
  725 |         }
  726 |         if metadata.version != target.version {
  727 |             return Ok(Some(FileConcatReason::VersionMismatch {
  728 |                 input_index,
  729 |                 actual: metadata.version,
  730 |                 expected: target.version,
  731 |             }));
  732 |         }
  733 |         if prepared.schema != &expected_schema {
  734 |             return Ok(Some(FileConcatReason::SchemaMismatch { input_index }));
  735 |         }
  736 |         let normalized_rows =
  737 |             versions::validate_external_metadata(metadata.version, prepared.schema, metadata)
  738 |                 .map_err(|error| {
  739 |                     Error::corrupt_file(
  740 |                         prepared.input.path().clone(),
  741 |                         format!("input {input_index} has incomplete file metadata: {error}"),
  742 |                     )
  743 |                 })?;
  744 |         if normalized_rows != metadata.num_rows {
  745 |             return Err(Error::corrupt_file(
  746 |                 prepared.input.path().clone(),
  747 |                 format!(
  748 |                     "input {input_index} descriptor reports {} physical rows but its columns normalize to {normalized_rows}",
  749 |                     metadata.num_rows
  750 |                 ),
  751 |             ));
  752 |         }
  753 |         if metadata.file_buffers.len() > 1 {
  754 |             return Ok(Some(FileConcatReason::ExtraGlobalBuffers {
  755 |                 input_index,
  756 |                 count: metadata.file_buffers.len(),
  757 |             }));
  758 |         }
  759 |         if metadata.column_infos.len() != baseline_columns.len() {
  760 |             return Ok(Some(FileConcatReason::ColumnLayoutMismatch {
  761 |                 input_index,
  762 |                 column_index: None,
  763 |             }));
  764 |         }
  765 |         for (column_index, (column, baseline)) in metadata
  766 |             .column_infos
  767 |             .iter()
  768 |             .zip(baseline_columns)
  769 |             .enumerate()
  770 |         {
  771 |             if !column.buffer_offsets_and_sizes.is_empty() {
  772 |                 return Ok(Some(FileConcatReason::ColumnBuffers {
  773 |                     input_index,
  774 |                     column_index,
  775 |                     count: column.buffer_offsets_and_sizes.len(),
  776 |                 }));
  777 |             }
  778 |             if column.index != baseline.index {
  779 |                 return Ok(Some(FileConcatReason::ColumnLayoutMismatch {
  780 |                     input_index,
  781 |                     column_index: Some(column_index),
  782 |                 }));
  783 |             }
  784 |             if encoded_column_encoding(column)? != baseline_encodings[column_index] {
  785 |                 return Ok(Some(FileConcatReason::ColumnEncodingMismatch {
  786 |                     input_index,
  787 |                     column_index,
  788 |                 }));
  789 |             }
  790 |         }
  791 |     }
  792 |     Ok(None)
  793 | }
  794 | 
  795 | async fn copy_page_buffers(
  796 |     writer: &mut crate::writer::FileWriter,
  797 |     scheduler: &FileScheduler,
  798 |     pages: &[PageInfo],
  799 |     read_batch_bytes: u64,
  800 |     input_index: usize,
  801 |     column_index: usize,
  802 |     row_offset: u64,
  803 | ) -> Result<Vec<PageInfo>> {
  804 |     let mut copied = Vec::with_capacity(pages.len());
  805 |     let mut page_index = 0;
  806 |     while page_index < pages.len() {
  807 |         let batch_start = page_index;
  808 |         let mut batch_bytes = 0u64;
  809 |         let mut batch_ranges = Vec::new();
  810 |         let mut batch_buffer_counts = Vec::new();
  811 |         while page_index < pages.len() {
  812 |             let page = &pages[page_index];
  813 |             let page_bytes = page.buffer_offsets_and_sizes.iter().try_fold(
  814 |                 0u64,
  815 |                 |total, (offset, size)| {
  816 |                     offset.checked_add(*size).ok_or_else(|| {
  817 |                         Error::corrupt_file(
  818 |                             scheduler.reader().path().clone(),
  819 |                             format!(
  820 |                                 "input {input_index} column {column_index} page {page_index} buffer range overflows"
  821 |                             ),
  822 |                         )
  823 |                     })?;
  824 |                     total.checked_add(*size).ok_or_else(|| {
  825 |                         Error::corrupt_file(
  826 |                             scheduler.reader().path().clone(),
  827 |                             format!(
  828 |                                 "input {input_index} column {column_index} page {page_index} buffer sizes overflow"
  829 |                             ),
  830 |                         )
  831 |                     })
  832 |                 },
  833 |             )?;
  834 |             if page_index > batch_start
  835 |                 && batch_bytes
  836 |                     .checked_add(page_bytes)
  837 |                     .is_none_or(|total| total > read_batch_bytes)
  838 |             {
  839 |                 break;
  840 |             }
  841 |             batch_bytes = batch_bytes.checked_add(page_bytes).ok_or_else(|| {
  842 |                 Error::corrupt_file(
  843 |                     scheduler.reader().path().clone(),
  844 |                     format!("input {input_index} column {column_index} read batch size overflows"),
  845 |                 )
  846 |             })?;
  847 |             batch_buffer_counts.push(page.buffer_offsets_and_sizes.len());
  848 |             batch_ranges.extend(
  849 |                 page.buffer_offsets_and_sizes
  850 |                     .iter()
  851 |                     .filter(|(_, size)| *size > 0)
  852 |                     .map(|(offset, size)| *offset..(*offset + *size)),
  853 |             );
  854 |             page_index += 1;
  855 |         }
  856 | 
  857 |         let batch_data = if batch_ranges.is_empty() {
  858 |             Vec::new()
  859 |         } else {
  860 |             scheduler.submit_request(batch_ranges, 0).await?
  861 |         };
  862 |         let mut batch_data = batch_data.into_iter();
  863 |         for (relative_page_index, (page, buffer_count)) in pages[batch_start..page_index]
  864 |             .iter()
  865 |             .zip(batch_buffer_counts)
  866 |             .enumerate()
  867 |         {
  868 |             let source_page_index = batch_start + relative_page_index;
  869 |             let mut relocated_buffers = Vec::with_capacity(buffer_count);
  870 |             for (buffer_index, (_, size)) in page.buffer_offsets_and_sizes.iter().enumerate() {
  871 |                 let data = if *size == 0 {
  872 |                     None
  873 |                 } else {
  874 |                     let data = batch_data.next().ok_or_else(|| {
  875 |                         Error::io(format!(
  876 |                             "short read for input {input_index} column {column_index} page {source_page_index} buffer {buffer_index}: expected {size} bytes"
  877 |                         ))
  878 |                     })?;
  879 |                     if data.len() as u64 != *size {
  880 |                         return Err(Error::io(format!(
  881 |                             "short read for input {input_index} column {column_index} page {source_page_index} buffer {buffer_index}: expected {size} bytes, got {}",
  882 |                             data.len()
  883 |                         )));
  884 |                     }
  885 |                     Some(data)
  886 |                 };
  887 |                 relocated_buffers.push(
  888 |                     writer
  889 |                         .write_external_buffer(data.as_deref().unwrap_or_default())
  890 |                         .await?,
  891 |                 );
  892 |             }
  893 |             copied.push(PageInfo {
  894 |                 num_rows: page.num_rows,
  895 |                 priority: page.priority.checked_add(row_offset).ok_or_else(|| {
  896 |                     Error::invalid_input_source(
  897 |                         format!(
  898 |                             "input {input_index} column {column_index} page {source_page_index} priority overflows after row relocation"
  899 |                         )
  900 |                         .into(),
  901 |                     )
  902 |                 })?,
  903 |                 encoding: page.encoding.clone(),
  904 |                 buffer_offsets_and_sizes: Arc::from(relocated_buffers),
  905 |             });
  906 |         }
  907 |         if batch_data.next().is_some() {
  908 |             return Err(Error::io(format!(
  909 |                 "read for input {input_index} column {column_index} returned more buffers than requested"
  910 |             )));
  911 |         }
  912 |     }
  913 |     Ok(copied)
  914 | }
  915 | 
  916 | async fn concat_prepared<Factory, FactoryFuture>(
  917 |     target: &FileConcatTarget,
  918 |     prepared: &[PreparedInput<'_>],
  919 |     allow_blob_columns: bool,
  920 |     reuse_single_input: bool,
  921 |     output_factory: Factory,
  922 |     options: FileConcatOptions,
  923 | ) -> Result<FileConcatResult>
  924 | where
  925 |     Factory: FnOnce() -> FactoryFuture,
  926 |     FactoryFuture: Future<Output = Result<Box<dyn ObjectWriter>>>,
  927 | {
  928 |     if options.read_batch_bytes == 0 {
  929 |         return Err(Error::invalid_input(
  930 |             "FileConcatOptions.read_batch_bytes must be greater than zero",
  931 |         ));
  932 |     }
  933 |     if let Some(reason) = check_compatibility(target, prepared, allow_blob_columns)? {
  934 |         return Ok(FileConcatResult::Unsupported(reason));
  935 |     }
  936 | 
  937 |     let total_rows = prepared.iter().try_fold(0u64, |total, input| {
  938 |         total.checked_add(input.metadata.num_rows).ok_or_else(|| {
  939 |             Error::invalid_input_source("concat_files total physical row count overflows".into())
  940 |         })
  941 |     })?;
  942 |     if prepared.len() == 1 && reuse_single_input {
  943 |         return Ok(FileConcatResult::Reused(
  944 |             0,
  945 |             FileConcatOutput {
  946 |                 version: target.version,
  947 |                 num_rows: total_rows,
  948 |                 size_bytes: prepared[0].metadata.file_size_bytes,
  949 |             },
  950 |         ));
  951 |     }
  952 | 
  953 |     let object_writer = output_factory().await?;
  954 |     let mut writer =
  955 |         versions::create_lazy_writer(target.version, object_writer, options.writer_options)?;
  956 |     let write_result: Result<FileWriteSummary> = async {
  957 |         let column_count = prepared[0].metadata.column_infos.len();
  958 |         let mut output_pages = std::iter::repeat_with(Vec::new)
  959 |             .take(column_count)
  960 |             .collect::<Vec<Vec<PageInfo>>>();
  961 |         let mut row_offset = 0u64;
  962 | 
  963 |         for (input_index, prepared_input) in prepared.iter().enumerate() {
  964 |             for (column_index, column) in prepared_input.metadata.column_infos.iter().enumerate() {
  965 |                 let has_existing_pages = !output_pages[column_index].is_empty();
  966 |                 versions::copy_external_metadata_column(
  967 |                     target.version,
  968 |                     target.schema.as_ref(),
  969 |                     column_index,
  970 |                     has_existing_pages,
  971 |                     || async {
  972 |                         let pages = copy_page_buffers(
  973 |                             &mut writer,
  974 |                             &prepared_input.input.scheduler,
  975 |                             &column.page_infos,
  976 |                             options.read_batch_bytes as u64,
  977 |                             input_index,
  978 |                             column_index,
  979 |                             row_offset,
  980 |                         )
  981 |                         .await?;
  982 |                         output_pages[column_index].extend(pages);
  983 | 
  984 |                         Ok(())
  985 |                     },
  986 |                 )
  987 |                 .await?;
  988 |             }
  989 |             row_offset = row_offset
  990 |                 .checked_add(prepared_input.metadata.num_rows)
  991 |                 .ok_or_else(|| {
  992 |                     Error::invalid_input_source("concat_files physical row offset overflows".into())
  993 |                 })?;
  994 |         }
  995 | 
  996 |         let mut columns = Vec::with_capacity(column_count);
  997 |         for (column_index, pages) in output_pages.iter_mut().enumerate() {
  998 |             versions::finalize_external_metadata_column(
  999 |                 target.version,
 1000 |                 target.schema.as_ref(),
 1001 |                 column_index,
 1002 |                 pages,
 1003 |                 total_rows,
 1004 |             )?;
 1005 |             let baseline = &prepared[0].metadata.column_infos[column_index];
 1006 |             columns.push(Arc::new(ColumnInfo::new(
 1007 |                 baseline.index,
 1008 |                 Arc::from(std::mem::take(pages)),
 1009 |                 Vec::new(),
 1010 |                 baseline.encoding.clone(),
 1011 |             )));
 1012 |         }
 1013 |         // The schema descriptor is the first global buffer and must start at
 1014 |         // the page-buffer alignment required by the reader.
 1015 |         writer.write_external_buffer(&[]).await?;
 1016 |         writer.initialize_with_external_columns(
 1017 |             target.schema.as_ref().clone(),
 1018 |             &columns,
 1019 |             total_rows,
 1020 |         )?;
 1021 |         writer.finish().await
 1022 |     }
 1023 |     .await;
 1024 | 
 1025 |     match write_result {
 1026 |         Ok(summary) => Ok(FileConcatResult::Written(FileConcatOutput {
 1027 |             version: target.version,
 1028 |             num_rows: summary.num_rows,
 1029 |             size_bytes: summary.size_bytes,
 1030 |         })),
 1031 |         Err(error) => {
 1032 |             writer.abort().await;
 1033 |             Err(error)
 1034 |         }
 1035 |     }
 1036 | }
 1037 | 
 1038 | /// Concatenate complete compatible encoded files in the supplied order.
 1039 | ///
 1040 | /// Metadata is read exactly once per input. The factory is invoked only after
 1041 | /// all compatibility checks succeed and is never invoked for [`FileConcatResult::Reused`]
 1042 | /// or [`FileConcatResult::Unsupported`]. Page payloads are copied without Arrow
 1043 | /// decoding; offsets, priorities, exact-version structural metadata, and the
 1044 | /// footer are regenerated.
 1045 | ///
 1046 | /// ```
 1047 | /// # use std::sync::Arc;
 1048 | /// # use lance_core::Result;
 1049 | /// # use lance_file::concat::{concat_files, EncodedFileInput, FileConcatOptions, FileConcatResult, FileConcatTarget};
 1050 | /// # use lance_io::object_store::ObjectStore;
 1051 | /// # use object_store::path::Path;
 1052 | /// # async fn stitch(
 1053 | /// #     target: &FileConcatTarget,
 1054 | /// #     inputs: &[EncodedFileInput],
 1055 | /// #     output_store: Arc<ObjectStore>,
 1056 | /// #     output_path: Path,
 1057 | /// # ) -> Result<FileConcatResult> {
 1058 | /// let store = output_store.clone();
 1059 | /// concat_files(
 1060 | ///     target,
 1061 | ///     inputs,
 1062 | ///     move || async move { store.create(&output_path).await },
 1063 | ///     FileConcatOptions::default(),
 1064 | /// )
 1065 | /// .await
 1066 | /// # }
 1067 | /// ```
 1068 | pub async fn concat_files<Factory, FactoryFuture>(
 1069 |     target: &FileConcatTarget,
 1070 |     ordered_inputs: &[EncodedFileInput],
 1071 |     output_factory: Factory,
 1072 |     options: FileConcatOptions,
 1073 | ) -> Result<FileConcatResult>
 1074 | where
 1075 |     Factory: FnOnce() -> FactoryFuture,
 1076 |     FactoryFuture: Future<Output = Result<Box<dyn ObjectWriter>>>,
 1077 | {
 1078 |     if ordered_inputs.is_empty() {
 1079 |         return Err(Error::invalid_input(
 1080 |             "concat_files requires at least one complete input file",
 1081 |         ));
 1082 |     }
 1083 |     let raw_metadata = futures::future::try_join_all(
 1084 |         ordered_inputs
 1085 |             .iter()
 1086 |             .map(|input| FileReader::read_raw_metadata_for_dispatch(&input.scheduler)),
 1087 |     )
 1088 |     .await?;
 1089 |     if target.version == ConcreteFileVersion::V1
 1090 |         || raw_metadata
 1091 |             .iter()
 1092 |             .any(|metadata| matches!(metadata, RawFileMetadataOpen::Legacy { .. }))
 1093 |     {
 1094 |         return Ok(FileConcatResult::Unsupported(
 1095 |             FileConcatReason::LegacyVersion,
 1096 |         ));
 1097 |     }
 1098 |     let metadata = raw_metadata
 1099 |         .into_iter()
 1100 |         .map(|metadata| match metadata {
 1101 |             RawFileMetadataOpen::Current { version, metadata } => {
 1102 |                 versions::finish_metadata(version, metadata)
 1103 |             }
 1104 |             RawFileMetadataOpen::Legacy { .. } => Err(Error::internal(
 1105 |                 "legacy concat input reached current metadata finalization".to_string(),
 1106 |             )),
 1107 |         })
 1108 |         .collect::<Result<Vec<_>>>()?;
 1109 |     let prepared = ordered_inputs
 1110 |         .iter()
 1111 |         .zip(metadata.iter())
 1112 |         .map(|(input, metadata)| PreparedInput {
 1113 |             input,
 1114 |             metadata,
 1115 |             schema: metadata.file_schema.as_ref(),
 1116 |         })
 1117 |         .collect::<Vec<_>>();
 1118 |     concat_prepared(target, &prepared, false, true, output_factory, options).await
 1119 | }
 1120 | 
 1121 | /// Concatenate validated data-file parts in caller-supplied row order.
 1122 | ///
 1123 | /// Unlike [`concat_files`], this entry point accepts Blob v2 columns because
 1124 | /// every [`DataFilePart`] has already rejected file-relative Inline payloads
 1125 | /// and validated managed descriptors against an explicit ID lease. Leases from
 1126 | /// different parts must not overlap. No logical values or Blob payloads are
 1127 | /// decoded and re-encoded during concatenation.
 1128 | pub async fn concat_data_file_parts<Factory, FactoryFuture>(
 1129 |     target: &FileConcatTarget,
 1130 |     ordered_parts: &[DataFilePart],
 1131 |     output_factory: Factory,
 1132 |     options: FileConcatOptions,
 1133 | ) -> Result<FileConcatResult>
 1134 | where
 1135 |     Factory: FnOnce() -> FactoryFuture,
 1136 |     FactoryFuture: Future<Output = Result<Box<dyn ObjectWriter>>>,
 1137 | {
 1138 |     if ordered_parts.is_empty() {
 1139 |         return Err(Error::invalid_input(
 1140 |             "concat_data_file_parts requires at least one data-file part",
 1141 |         ));
 1142 |     }
 1143 |     for (part_index, part) in ordered_parts.iter().enumerate() {
 1144 |         if part.blob_target_id != target.blob_target_id {
 1145 |             return Err(Error::invalid_input(format!(
 1146 |                 "part {part_index} Blob target ID {:?} does not match target ID {:?}",
 1147 |                 part.blob_target_id.as_ref().map(BlobTargetId::as_str),
 1148 |                 target.blob_target_id.as_ref().map(BlobTargetId::as_str)
 1149 |             )));
 1150 |         }
 1151 |     }
 1152 |     let mut ranges = ordered_parts
 1153 |         .iter()
 1154 |         .enumerate()
 1155 |         .filter_map(|(part_index, part)| {
 1156 |             part.blob_ids
 1157 |                 .clone()
 1158 |                 .map(|range| (range.start, range.end, part_index))
 1159 |         })
 1160 |         .collect::<Vec<_>>();
 1161 |     ranges.sort_unstable_by_key(|(start, _, _)| *start);
 1162 |     for pair in ranges.windows(2) {
 1163 |         let (left_start, left_end, left_index) = pair[0];
 1164 |         let (right_start, right_end, right_index) = pair[1];
 1165 |         if right_start < left_end {
 1166 |             return Err(Error::invalid_input(format!(
 1167 |                 "part Blob ID ranges overlap: part {left_index} uses {left_start}..{left_end}, part {right_index} uses {right_start}..{right_end}"
 1168 |             )));
 1169 |         }
 1170 |     }
 1171 | 
 1172 |     let prepared = ordered_parts
 1173 |         .iter()
 1174 |         .map(|part| PreparedInput {
 1175 |             input: &part.input,
 1176 |             metadata: part.metadata.as_ref(),
 1177 |             schema: part.schema.as_ref(),
 1178 |         })
 1179 |         .collect::<Vec<_>>();
 1180 |     concat_prepared(target, &prepared, true, false, output_factory, options).await
 1181 | }
 1182 | 
 1183 | #[cfg(test)]
 1184 | mod tests {
 1185 |     use std::sync::atomic::{AtomicUsize, Ordering};
 1186 | 
 1187 |     use lance_core::utils::tempfile::TempObjFile;
 1188 |     use lance_io::{
 1189 |         object_store::ObjectStore,
 1190 |         scheduler::{ScanScheduler, SchedulerConfig},
 1191 |         traits::Writer,
 1192 |         utils::CachedFileSize,
 1193 |     };
 1194 |     use tokio::io::AsyncWriteExt;
 1195 | 
 1196 |     use super::*;
 1197 | 
 1198 |     async fn write_file(
 1199 |         store: &Arc<ObjectStore>,
 1200 |         path: &object_store::path::Path,
 1201 |         version: ConcreteFileVersion,
 1202 |         values: &[i32],
 1203 |     ) -> Arc<Schema> {
 1204 |         let batch = arrow_array::record_batch!(("value", Int32, values.to_vec())).unwrap();
 1205 |         let schema = Arc::new(Schema::try_from(batch.schema_ref().as_ref()).unwrap());
 1206 |         let mut writer = versions::create_writer(
 1207 |             version,
 1208 |             store.create(path).await.unwrap(),
 1209 |             schema.as_ref().clone(),
 1210 |             FileWriterOptions::default(),
 1211 |         )
 1212 |         .unwrap();
 1213 |         writer.write_batch(&batch).await.unwrap();
 1214 |         writer.finish().await.unwrap();
 1215 |         schema
 1216 |     }
 1217 | 
 1218 |     async fn input(
 1219 |         store: Arc<ObjectStore>,
 1220 |         path: &object_store::path::Path,
 1221 |         expected_num_rows: u64,
 1222 |     ) -> EncodedFileInput {
 1223 |         let scheduler = ScanScheduler::new(store, SchedulerConfig::default_for_testing());
 1224 |         let file = scheduler
 1225 |             .open_file(path, &CachedFileSize::unknown())
 1226 |             .await
 1227 |             .unwrap();
 1228 |         EncodedFileInput::new(file).with_expected_num_rows(expected_num_rows)
 1229 |     }
 1230 | 
 1231 |     #[tokio::test]
 1232 |     async fn concat_writes_relocated_metadata_and_reuses_single_input() {
 1233 |         let store = Arc::new(ObjectStore::local());
 1234 |         let first_path = TempObjFile::default();
 1235 |         let second_path = TempObjFile::default();
 1236 |         let output_path = TempObjFile::default();
 1237 |         let schema = write_file(&store, &first_path, ConcreteFileVersion::V2_1, &[1, 2, 3]).await;
 1238 |         write_file(&store, &second_path, ConcreteFileVersion::V2_1, &[4, 5]).await;
 1239 |         let inputs = vec![
 1240 |             input(store.clone(), &first_path, 3).await,
 1241 |             input(store.clone(), &second_path, 2).await,
 1242 |         ];
 1243 |         let target = FileConcatTarget::new(ConcreteFileVersion::V2_1, schema);
 1244 |         let factory_calls = Arc::new(AtomicUsize::new(0));
 1245 |         let result = concat_files(
 1246 |             &target,
 1247 |             &inputs,
 1248 |             {
 1249 |                 let store = store.clone();
 1250 |                 let output_path = output_path.clone();
 1251 |                 let factory_calls = factory_calls.clone();
 1252 |                 move || async move {
 1253 |                     factory_calls.fetch_add(1, Ordering::SeqCst);
 1254 |                     store.create(&output_path).await
 1255 |                 }
 1256 |             },
 1257 |             FileConcatOptions::default(),
 1258 |         )
 1259 |         .await
 1260 |         .unwrap();
 1261 |         assert!(matches!(
 1262 |             result,
 1263 |             FileConcatResult::Written(FileConcatOutput { num_rows: 5, .. })
 1264 |         ));
 1265 |         assert_eq!(factory_calls.load(Ordering::SeqCst), 1);
 1266 |         let output = input(store.clone(), &output_path, 5).await;
 1267 |         let metadata = FileReader::read_all_metadata(&output.scheduler)
 1268 |             .await
 1269 |             .unwrap();
 1270 |         assert_eq!(metadata.num_rows, 5);
 1271 |         assert_eq!(metadata.column_infos[0].page_infos.len(), 2);
 1272 |         assert!(
 1273 |             metadata.column_infos[0].page_infos[0].priority
 1274 |                 < metadata.column_infos[0].page_infos[1].priority
 1275 |         );
 1276 | 
 1277 |         let reuse_calls = Arc::new(AtomicUsize::new(0));
 1278 |         let result = concat_files(
 1279 |             &target,
 1280 |             &inputs[..1],
 1281 |             {
 1282 |                 let reuse_calls = reuse_calls.clone();
 1283 |                 move || async move {
 1284 |                     reuse_calls.fetch_add(1, Ordering::SeqCst);
 1285 |                     Err(Error::internal("reuse factory must not be called"))
 1286 |                 }
 1287 |             },
 1288 |             FileConcatOptions::default(),
 1289 |         )
 1290 |         .await
 1291 |         .unwrap();
 1292 |         assert!(matches!(result, FileConcatResult::Reused(0, _)));
 1293 |         assert_eq!(reuse_calls.load(Ordering::SeqCst), 0);
 1294 |     }
 1295 | 
 1296 |     #[rstest::rstest]
 1297 |     #[case(ConcreteFileVersion::V2_0)]
 1298 |     #[case(ConcreteFileVersion::V2_1)]
 1299 |     #[case(ConcreteFileVersion::V2_2)]
 1300 |     #[case(ConcreteFileVersion::V2_3)]
 1301 |     #[tokio::test]
 1302 |     async fn concat_preserves_schema_metadata(#[case] version: ConcreteFileVersion) {
 1303 |         let store = Arc::new(ObjectStore::local());
 1304 |         let first_path = TempObjFile::default();
 1305 |         let second_path = TempObjFile::default();
 1306 |         let output_path = TempObjFile::default();
 1307 |         let batch = arrow_array::record_batch!(("value", Int32, [1, 2])).unwrap();
 1308 |         let mut schema = Schema::try_from(batch.schema_ref().as_ref()).unwrap();
 1309 |         schema
 1310 |             .metadata
 1311 |             .insert("review-key".into(), "review-value".into());
 1312 |         let schema = Arc::new(schema);
 1313 | 
 1314 |         for path in [&first_path, &second_path] {
 1315 |             let mut writer = versions::create_writer(
 1316 |                 version,
 1317 |                 store.create(path).await.unwrap(),
 1318 |                 schema.as_ref().clone(),
 1319 |                 FileWriterOptions::default(),
 1320 |             )
 1321 |             .unwrap();
 1322 |             writer.write_batch(&batch).await.unwrap();
 1323 |             writer.finish().await.unwrap();
 1324 |         }
 1325 |         let inputs = vec![
 1326 |             input(store.clone(), &first_path, 2).await,
 1327 |             input(store.clone(), &second_path, 2).await,
 1328 |         ];
 1329 |         let result = concat_files(
 1330 |             &FileConcatTarget::new(version, schema),
 1331 |             &inputs,
 1332 |             {
 1333 |                 let store = store.clone();
 1334 |                 let output_path = output_path.clone();
 1335 |                 move || async move { store.create(&output_path).await }
 1336 |             },
 1337 |             FileConcatOptions::default(),
 1338 |         )
 1339 |         .await
 1340 |         .unwrap();
 1341 |         assert!(matches!(result, FileConcatResult::Written(_)));
 1342 | 
 1343 |         let output = input(store, &output_path, 4).await;
 1344 |         let metadata = FileReader::read_all_metadata(&output.scheduler)
 1345 |             .await
 1346 |             .unwrap();
 1347 |         assert_eq!(
 1348 |             metadata.file_schema.metadata.get("review-key"),
 1349 |             Some(&"review-value".to_string())
 1350 |         );
 1351 |     }
 1352 | 
 1353 |     #[tokio::test]
 1354 |     async fn unsupported_does_not_create_output() {
 1355 |         let store = Arc::new(ObjectStore::local());
 1356 |         let first_path = TempObjFile::default();
 1357 |         let second_path = TempObjFile::default();
 1358 |         let schema = write_file(&store, &first_path, ConcreteFileVersion::V2_1, &[1]).await;
 1359 |         write_file(&store, &second_path, ConcreteFileVersion::V2_2, &[2]).await;
 1360 |         let inputs = vec![
 1361 |             input(store.clone(), &first_path, 1).await,
 1362 |             input(store, &second_path, 1).await,
 1363 |         ];
 1364 |         let factory_calls = Arc::new(AtomicUsize::new(0));
 1365 |         let result = concat_files(
 1366 |             &FileConcatTarget::new(ConcreteFileVersion::V2_1, schema),
 1367 |             &inputs,
 1368 |             {
 1369 |                 let factory_calls = factory_calls.clone();
 1370 |                 move || async move {
 1371 |                     factory_calls.fetch_add(1, Ordering::SeqCst);
 1372 |                     Err(Error::internal("unsupported factory must not be called"))
 1373 |                 }
 1374 |             },
 1375 |             FileConcatOptions::default(),
 1376 |         )
 1377 |         .await
 1378 |         .unwrap();
 1379 |         assert!(matches!(
 1380 |             result,
 1381 |             FileConcatResult::Unsupported(FileConcatReason::VersionMismatch { input_index: 1, .. })
 1382 |         ));
 1383 |         assert_eq!(factory_calls.load(Ordering::SeqCst), 0);
 1384 |     }
 1385 | 
 1386 |     #[tokio::test]
 1387 |     async fn legacy_input_is_unsupported_without_creating_output() {
 1388 |         let store = Arc::new(ObjectStore::local());
 1389 |         let current_path = TempObjFile::default();
 1390 |         let legacy_path = TempObjFile::default();
 1391 |         let schema = write_file(&store, &current_path, ConcreteFileVersion::V2_1, &[1]).await;
 1392 |         let mut legacy_writer = store.create(&legacy_path).await.unwrap();
 1393 |         legacy_writer
 1394 |             .write_all(include_bytes!("../test_data/exact_versions/v1.lance"))
 1395 |             .await
 1396 |             .unwrap();
 1397 |         Writer::shutdown(&mut legacy_writer).await.unwrap();
 1398 |         let factory_calls = Arc::new(AtomicUsize::new(0));
 1399 | 
 1400 |         let result = concat_files(
 1401 |             &FileConcatTarget::new(ConcreteFileVersion::V2_1, schema),
 1402 |             &[input(store, &legacy_path, 0).await],
 1403 |             {
 1404 |                 let factory_calls = factory_calls.clone();
 1405 |                 move || async move {
 1406 |                     factory_calls.fetch_add(1, Ordering::SeqCst);
 1407 |                     Err(Error::internal("legacy factory must not be called"))
 1408 |                 }
 1409 |             },
 1410 |             FileConcatOptions::default(),
 1411 |         )
 1412 |         .await
 1413 |         .unwrap();
 1414 | 
 1415 |         assert!(matches!(
 1416 |             result,
 1417 |             FileConcatResult::Unsupported(FileConcatReason::LegacyVersion)
 1418 |         ));
 1419 |         assert_eq!(factory_calls.load(Ordering::SeqCst), 0);
 1420 |     }
 1421 | 
 1422 |     #[tokio::test]
 1423 |     async fn incompatible_column_buffers_and_incomplete_metadata_are_rejected() {
 1424 |         let store = Arc::new(ObjectStore::local());
 1425 |         let path = TempObjFile::default();
 1426 |         let schema = write_file(&store, &path, ConcreteFileVersion::V2_1, &[1, 2]).await;
 1427 |         let encoded_input = input(store, &path, 2).await;
 1428 |         let target = FileConcatTarget::new(ConcreteFileVersion::V2_1, schema);
 1429 | 
 1430 |         let mut with_column_buffer = FileReader::read_all_metadata(&encoded_input.scheduler)
 1431 |             .await
 1432 |             .unwrap();
 1433 |         let column = with_column_buffer.column_infos[0].as_ref();
 1434 |         with_column_buffer.column_infos[0] = Arc::new(ColumnInfo::new(
 1435 |             column.index,
 1436 |             column.page_infos.clone(),
 1437 |             vec![(0, 1)],
 1438 |             column.encoding.clone(),
 1439 |         ));
 1440 |         let prepared = [PreparedInput {
 1441 |             input: &encoded_input,
 1442 |             metadata: &with_column_buffer,
 1443 |             schema: with_column_buffer.file_schema.as_ref(),
 1444 |         }];
 1445 |         assert!(matches!(
 1446 |             check_compatibility(&target, &prepared, false).unwrap(),
 1447 |             Some(FileConcatReason::ColumnBuffers {
 1448 |                 input_index: 0,
 1449 |                 column_index: 0,
 1450 |                 count: 1
 1451 |             })
 1452 |         ));
 1453 | 
 1454 |         let mut missing_column = FileReader::read_all_metadata(&encoded_input.scheduler)
 1455 |             .await
 1456 |             .unwrap();
 1457 |         missing_column.column_infos.clear();
 1458 |         let prepared = [PreparedInput {
 1459 |             input: &encoded_input,
 1460 |             metadata: &missing_column,
 1461 |             schema: missing_column.file_schema.as_ref(),
 1462 |         }];
 1463 |         let error = check_compatibility(&target, &prepared, false).unwrap_err();
 1464 |         assert!(matches!(error, Error::CorruptFile { .. }));
 1465 |         assert!(
 1466 |             error
 1467 |                 .to_string()
 1468 |                 .contains("schema requires 1 physical columns")
 1469 |         );
 1470 | 
 1471 |         let mut wrong_rows = FileReader::read_all_metadata(&encoded_input.scheduler)
 1472 |             .await
 1473 |             .unwrap();
 1474 |         let column = wrong_rows.column_infos[0].as_ref();
 1475 |         let mut pages = column
 1476 |             .page_infos
 1477 |             .iter()
 1478 |             .map(|page| PageInfo {
 1479 |                 num_rows: page.num_rows,
 1480 |                 priority: page.priority,
 1481 |                 encoding: page.encoding.clone(),
 1482 |                 buffer_offsets_and_sizes: page.buffer_offsets_and_sizes.clone(),
 1483 |             })
 1484 |             .collect::<Vec<_>>();
 1485 |         pages[0].num_rows -= 1;
 1486 |         wrong_rows.column_infos[0] = Arc::new(ColumnInfo::new(
 1487 |             column.index,
 1488 |             Arc::from(pages),
 1489 |             Vec::new(),
 1490 |             column.encoding.clone(),
 1491 |         ));
 1492 |         let prepared = [PreparedInput {
 1493 |             input: &encoded_input,
 1494 |             metadata: &wrong_rows,
 1495 |             schema: wrong_rows.file_schema.as_ref(),
 1496 |         }];
 1497 |         let error = check_compatibility(&target, &prepared, false).unwrap_err();
 1498 |         assert!(matches!(error, Error::CorruptFile { .. }));
 1499 |         assert!(
 1500 |             error
 1501 |                 .to_string()
 1502 |                 .contains("descriptor reports 2 physical rows")
 1503 |         );
 1504 |     }
 1505 | 
 1506 |     #[tokio::test]
 1507 |     async fn data_file_parts_reject_overlapping_blob_leases_before_output() {
 1508 |         let store = Arc::new(ObjectStore::local());
 1509 |         let first_path = TempObjFile::default();
 1510 |         let second_path = TempObjFile::default();
 1511 |         let schema = write_file(&store, &first_path, ConcreteFileVersion::V2_1, &[1]).await;
 1512 |         write_file(&store, &second_path, ConcreteFileVersion::V2_1, &[2]).await;
 1513 |         let first = DataFilePart::open(
 1514 |             input(store.clone(), &first_path, 1).await,
 1515 |             Some(1..10),
 1516 |             None,
 1517 |         )
 1518 |         .await
 1519 |         .unwrap();
 1520 |         let second = DataFilePart::open(input(store, &second_path, 1).await, Some(5..20), None)
 1521 |             .await
 1522 |             .unwrap();
 1523 |         let factory_calls = Arc::new(AtomicUsize::new(0));
 1524 | 
 1525 |         let error = concat_data_file_parts(
 1526 |             &FileConcatTarget::new(ConcreteFileVersion::V2_1, schema),
 1527 |             &[first, second],
 1528 |             {
 1529 |                 let factory_calls = factory_calls.clone();
 1530 |                 move || async move {
 1531 |                     factory_calls.fetch_add(1, Ordering::SeqCst);
 1532 |                     Err(Error::internal("overlap factory must not be called"))
 1533 |                 }
 1534 |             },
 1535 |             FileConcatOptions::default(),
 1536 |         )
 1537 |         .await
 1538 |         .unwrap_err();
 1539 | 
 1540 |         assert!(error.to_string().contains("part 0 uses 1..10"), "{error}");
 1541 |         assert!(error.to_string().contains("part 1 uses 5..20"), "{error}");
 1542 |         assert_eq!(factory_calls.load(Ordering::SeqCst), 0);
 1543 |     }
 1544 | 
 1545 |     #[tokio::test]
 1546 |     async fn missing_and_corrupt_inputs_are_errors_without_output() {
 1547 |         let store = Arc::new(ObjectStore::local());
 1548 |         let valid_path = TempObjFile::default();
 1549 |         let missing_path = TempObjFile::default();
 1550 |         let corrupt_path = TempObjFile::default();
 1551 |         let schema = write_file(&store, &valid_path, ConcreteFileVersion::V2_1, &[1, 2]).await;
 1552 |         write_file(&store, &missing_path, ConcreteFileVersion::V2_1, &[3, 4]).await;
 1553 |         let missing_input = input(store.clone(), &missing_path, 2).await;
 1554 |         store.delete(&missing_path).await.unwrap();
 1555 | 
 1556 |         let target = FileConcatTarget::new(ConcreteFileVersion::V2_1, schema.clone());
 1557 |         let factory_calls = Arc::new(AtomicUsize::new(0));
 1558 |         let result = concat_files(
 1559 |             &target,
 1560 |             &[input(store.clone(), &valid_path, 2).await, missing_input],
 1561 |             {
 1562 |                 let factory_calls = factory_calls.clone();
 1563 |                 move || async move {
 1564 |                     factory_calls.fetch_add(1, Ordering::SeqCst);
 1565 |                     Err(Error::internal("error factory must not be called"))
 1566 |                 }
 1567 |             },
 1568 |             FileConcatOptions::default(),
 1569 |         )
 1570 |         .await;
 1571 |         assert!(result.is_err());
 1572 |         assert_eq!(factory_calls.load(Ordering::SeqCst), 0);
 1573 | 
 1574 |         let mut corrupt_writer = store.create(&corrupt_path).await.unwrap();
 1575 |         corrupt_writer.write_all(b"not a Lance file").await.unwrap();
 1576 |         Writer::shutdown(&mut corrupt_writer).await.unwrap();
 1577 |         let corrupt_input = input(store.clone(), &corrupt_path, 2).await;
 1578 |         let result = concat_files(
 1579 |             &target,
 1580 |             &[input(store, &valid_path, 2).await, corrupt_input],
 1581 |             || async { Err(Error::internal("error factory must not be called")) },
 1582 |             FileConcatOptions::default(),
 1583 |         )
 1584 |         .await;
 1585 |         assert!(result.is_err());
 1586 |     }
 1587 | }
``````
