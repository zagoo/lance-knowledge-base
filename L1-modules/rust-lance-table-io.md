> **V2.1 navigation and contract layer.** Source reading is permitted. Production contracts retained from iteration 85 remain valid at the recorded snapshot. Historical line-count/test-coverage statements are provenance, not completeness requirements. Use [V2.1 protocol](../V21-PROTOCOL.md) and CORE-MANIFEST.json for current scope.

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-09, `db684d1f0726c00b6defb7963a604a7719e82b5a`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-09.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

# Table metadata IO

Complete scope: manifest.rs392 lines and deletion.rs370 lines, plus io.rs facade. Parent commit publication/resolution is now covered in the [commit supplement](rust-lance-table-commit.md); the generic external handler is covered in the external commit supplement, and the concrete DynamoDB store is covered in its supplement; namespace stores and full Dataset retry/conflict remain pending. [Table](rust-lance-table.md) · [Candidate assembly](rust-lance-table-manifest-build.md) · [Manifest L2](../L2-files/rust/lance-table/src/io/manifest.rs.md) · [Deletion L2](../L2-files/rust/lance-table/src/io/deletion.rs.md) · [Contracts](../L3-symbols/behavior-contracts.md) · [Scenarios](../L4-crosscutting/scenarios.md).

The manifest and deletion submodules read/write metadata objects and return errors. Manifest serialization mutates offsets in a borrowed Manifest and appends bytes to a caller Writer; it does not close the file. Deletion serialization builds an entire payload then puts one object and returns metadata. Neither establishes concurrent dataset commit success. (rust/lance-table/src/io.rs:1-6; rust/lance-table/src/io/manifest.rs:177-230; rust/lance-table/src/io/deletion.rs:61-134)

## Public API

| Symbol | Exact declaration | Visibility | Evidence |
|---|---|---|---|
| `lance_table::io::manifest::read_manifest` | `pub async fn read_manifest(     object_store: &ObjectStore,     path: &Path,     known_size: Option<u64>, ) -> Result<Manifest> {` | public | [rust/lance-table/src/io/manifest.rs:36-40](../L2-files/rust/lance-table/src/io/manifest.rs.md) |
| `lance_table::io::manifest::read_manifest_indexes` | `pub async fn read_manifest_indexes(     object_store: &ObjectStore,     location: &ManifestLocation,     manifest: &Manifest, ) -> Result<Vec<IndexMetadata>> {` | public | [rust/lance-table/src/io/manifest.rs:131-135](../L2-files/rust/lance-table/src/io/manifest.rs.md) |
| `lance_table::io::manifest::write_manifest` | `pub async fn write_manifest(     writer: &mut dyn Writer,     manifest: &mut Manifest,     indices: Option<Vec<IndexMetadata>>,     transaction: Option<Transaction>, ) -> Result<usize> {` | public | [rust/lance-table/src/io/manifest.rs:213-218](../L2-files/rust/lance-table/src/io/manifest.rs.md) |
| `lance_table::io::manifest::ManifestDescribing` | `pub struct ManifestDescribing {}` | public | [rust/lance-table/src/io/manifest.rs:234-234](../L2-files/rust/lance-table/src/io/manifest.rs.md) |
| `lance_table::io::manifest::<ManifestDescribing as V1ManifestProvider>` | `impl V1ManifestProvider for ManifestDescribing {` | public trait implementation | [rust/lance-table/src/io/manifest.rs:237-237](../L2-files/rust/lance-table/src/io/manifest.rs.md) |
| `lance_table::io::manifest::<ManifestDescribing as V1ManifestProvider>::store_schema` | `async fn store_schema(         object_writer: &mut dyn Writer,         schema: &Schema,     ) -> Result<Option<usize>> {` | public trait method | [rust/lance-table/src/io/manifest.rs:238-241](../L2-files/rust/lance-table/src/io/manifest.rs.md) |
| `lance_table::io::deletion::DELETIONS_DIR` | `pub const DELETIONS_DIR: &str = "_deletions";` | public | [rust/lance-table/src/io/deletion.rs:25-25](../L2-files/rust/lance-table/src/io/deletion.rs.md) |
| `lance_table::io::deletion::deletion_file_path` | `pub fn deletion_file_path(base: &Path, fragment_id: u64, deletion_file: &DeletionFile) -> Path {` | public | [rust/lance-table/src/io/deletion.rs:37-37](../L2-files/rust/lance-table/src/io/deletion.rs.md) |
| `lance_table::io::deletion::relative_deletion_file_path` | `pub fn relative_deletion_file_path(fragment_id: u64, deletion_file: &DeletionFile) -> String {` | public | [rust/lance-table/src/io/deletion.rs:50-50](../L2-files/rust/lance-table/src/io/deletion.rs.md) |
| `lance_table::io::deletion::write_deletion_file` | `pub async fn write_deletion_file(     base: &Path,     fragment_id: u64,     read_version: u64,     removed_rows: &DeletionVector,     object_store: &ObjectStore, ) -> Result<Option<DeletionFile>> {` | public | [rust/lance-table/src/io/deletion.rs:65-71](../L2-files/rust/lance-table/src/io/deletion.rs.md) |
| `lance_table::io::deletion::read_deletion_file` | `pub async fn read_deletion_file(     fragment_id: u64,     deletion_file: &DeletionFile,     base: &Path,     object_store: &ObjectStore, ) -> Result<DeletionVector> {` | public | [rust/lance-table/src/io/deletion.rs:143-148](../L2-files/rust/lance-table/src/io/deletion.rs.md) |

## Manifest read lifecycle

read_manifest trusts optional size or HEADs for it, requests last64KiB, retries once without known size only after successful bytes fail minimum16/magic checks, then uses signed LE footer offset as usize. It does not inspect footer version bytes or invoke feature capability gates. Bounds arithmetic is unchecked: malformed offsets or a trimmed body too short for prefix+footer can panic via arithmetic/slices. Length mismatch after trimming is InvalidInput; short-tail/wrong-magic and slow-path minimum20 are CorruptFile(path). GET errors and decode errors do not trigger cached-size retry. (rust/lance-table/src/io/manifest.rs:32-128)

For a larger body it opens a sized reader and accumulates16MiB chunks in file order under bounded concurrency, appends tail and decodes through ChunkedBuf without one full concatenation. All body chunks are retained before Prost decoding, so this is not bounded-memory streaming parsing. Within-chunk Bytes fields can share backing; cross-boundary copy_to_bytes allocates. After conversion detach_sparse_inline_row_ids copies nonzero inline total when less than one quarter of recorded message length, reducing retained backing at a transient copy cost. Performance numbers in source comments are not measurements here. (rust/lance-table/src/io/manifest.rs:75-127; rust/lance-io/src/utils.rs:19-159; rust/lance-table/src/format/manifest.rs:403-431)

read_manifest_indexes has a different retry: only a known size plus exact error-text substring file size is too small causes a second read without hint. Missing index_section returns empty without IO. It converts every metadata entry but does not verify uniqueness or dataset feature compatibility. Private read_index_section opens the selected view and invokes length-prefixed generic read_message. (rust/lance-table/src/io/manifest.rs:129-175; rust/lance-io/src/utils.rs:161-199)

## Manifest write lifecycle

V1 default format first writes schema dictionaries; exact V2 variants skip that step. do_write_manifest writes Some index vector even if empty, or clears inherited offset for None; then does the same for optional inline transaction; finally writes manifest. Successful earlier writes and offset mutations are not rolled back by later error/cancellation. The returned position is where the manifest length prefix begins. (rust/lance-table/src/io/manifest.rs:177-230; rust/lance-io/src/traits.rs:53-63; rust/lance-io/src/traits.rs:84-92)

Contextual canonical writer creates ObjectWriter, calls this body writer, appends footer via WriteExt, shuts down and only then logs create. It uses lance-file footer constants0/2/LANC, whereas table format facade declares0/1/LANC; read_manifest checks neither pair. Commit handler selection and local publication are now covered in the [commit supplement](rust-lance-table-commit.md). ManifestDescribing is a legacy V1 schema-only provider and directly calls do_write_manifest on a fresh V1 envelope. (rust/lance-table/src/io/commit.rs:31-40; rust/lance-table/src/io/commit.rs:199-230; rust/lance-io/src/traits.rs:95-107; rust/lance-file/src/format.rs:30-33; rust/lance-table/src/format.rs:51-56; rust/lance-table/src/io/manifest.rs:232-251)

## Deletion path and representation

Paths combine supplied base with _deletions/{fragment_id}-{read_version}-{random_id}.arrow or .bin. base_id is ignored locally; caller must select directory/store. NoDeletions returns None; explicit Set(empty) and Bitmap(empty) still write. Representation is chosen by enum arm, not density at IO time. Set serialization uses unspecified HashSet order and a single Arrow IPC ZSTD batch with nonnullable row_id:UInt32. Bitmap serializes Roaring as-is with no explicit run optimization. Every payload is built in Vec before one put. (rust/lance-table/src/io/deletion.rs:25-134)

Array reader loads full object and all batches before checking exactly one batch and exact schema equality. It deduplicates offsets into HashSet, rejects nulls, and returns Set without normalization. Bitmap reader wraps Roaring errors with path and returns Bitmap. Neither validates physical bounds or num_deleted_rows, resolves base_id, or explicitly checks trailing bytes after Roaring decode. A malformed Arrow iterator error becomes CorruptFile(path), while constructor error uses generic conversion. Guarded unwraps rely on count/schema checks. (rust/lance-table/src/io/deletion.rs:135-216)

Contextual dataset reader resolves directory before cache lookup, uses DeletionFileKey, and on miss resolves store, reads and inserts Arc vector. It is get-then-read-then-insert, with no explicit single-flight in that wrapper. Fragment write_deletions drops a fully deleted fragment; when count>=physical but coverage differs it errors; otherwise writes metadata. That count-conditional check does not locally reject every out-of-range offset in a smaller set. These callers are contextual and remain pending whole-file analysis. (rust/lance/src/io/deletion.rs:11-43; rust/lance/src/dataset/fragment.rs:3005-3036)

## Dependencies, extensibility and verification limits

Manifest depends on ObjectStore/Writer/CommitHandler location metadata, Prost and table codecs; chunk concurrency follows Reader::io_parallelism with minimum1. Deletion depends on Arrow IPC ZSTD and Roaring formats, core DeletionVector and audit tracing. Object-store implementations and Writer trait are storage extension boundaries; neither reviewed file declares environment settings or an index/encoding registry. Legacy ManifestProvider adapts the old writer and remains frozen compatibility scope. (rust/lance-table/src/io/manifest.rs:4-30; rust/lance-table/src/io/manifest.rs:232-251; rust/lance-table/src/io/deletion.rs:4-23; rust/lance-io/src/utils.rs:27-44; AGENTS.md:13-18)

Tests use fresh memory stores and current writer APIs. Large manifests vary payload and prefix size; stale index offset clearing is asserted; legacy schema metadata crosses writer/reader. Deletion tests cover NoDeletions plus Array/Bitmap raw-file and public roundtrips. No tests were run and no historical fixtures, malformed footer recovery, write cancellation or dataset concurrency result is established. (rust/lance-table/src/io/manifest.rs:253-392; rust/lance-table/src/io/deletion.rs:218-370)


## External authority coverage

The [external commit supplement](rust-lance-table-external-commit.md) now completes the generic external handler/store interface, including identified publication and record retirement. DynamoDB is covered in its supplement; namespace stores and full Dataset integration remain pending. (rust/lance-table/src/io/commit/external_manifest.rs:1-2553)
