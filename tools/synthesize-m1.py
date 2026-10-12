from pathlib import Path
import re,json
P=Path('/Users/renshaobin/Workspace/Develop/GitHub/lance-knowledge-base')
archive=P/'archive/synthesis-087';archive.mkdir(parents=True,exist_ok=True)
old=(P/'L0-orientation.md').read_text()
# Retain chronology without making it the reader's entry point.
def relocate(s, olddir, newdir):
 def link(m):
  label,target=m[1],m[2]
  if target.startswith(('https:','http:','mailto:','#')):return m[0]
  path,sep,anchor=target.partition('#')
  import os
  return '['+label+']('+os.path.relpath((olddir/path).resolve(),newdir)+ (sep+anchor if sep else '')+')'
 return re.sub(r'\[([^\]]+)\]\(([^)]+)\)',link,s)
(archive/'orientation-chronology.md').write_text('> Historical orientation before M1 synthesis; current entry is [L0](../../L0-orientation.md).\n\n'+relocate(old,P,archive))
# Keep all established glossary content, removing only excluded evidence/status paragraphs.
parts=re.split(r'(?m)(?=^## )',old)
skip=('Writer test evidence','Reading benchmark results','Binary evidence','Embedded V2_0: mini','Standard V2_0 fixture','Standard V2_1:','Standard V2_2 and','Core analysis checkpoint','Contract relationships established')
parts=[s for s in parts[1:] if not any(s.startswith('## '+x) for x in skip)]
gloss='\n'.join(parts).replace('## Initial glossary','## Storage and query vocabulary')
gloss=gloss.replace('Unknown or not-yet-reviewed terms are not silently filled from external knowledge. This glossary will expand with implementation coverage.','The glossary describes terms used by this KB; source-specific helper names are found through the frozen symbol catalog.')
gloss=re.sub(r'The initial facade slice covered 7 files; current coverage is 32 of 74; complete encoding and IO lifecycles remain pending\.','Encoding implementation detail is located through the module and frozen L2 records.',gloss)
gloss=gloss.replace('now has 32 of 74 files covered','retains its verified encoding contracts')
gloss=gloss.replace('## AIMD control and object-store test instrumentation','## AIMD control')
gloss='\n\n'.join(x for x in gloss.split('\n\n') if not ('CountingObjectStore' in x or 'IoTrackingStore' in x or 'test instrumentation' in x))
(P/'L0-glossary.md').write_text('# Engine glossary\n\n[Architecture and four paths](L0-orientation.md) · [Format contract](L3-symbols/format-spec.md)\n\nScope: production terminology of the navigation/contract KB. Frozen names remain searchable in the [symbol snapshot](L3-symbols/symbol-index.md); this is not a catalogue of external-library internals.\n\n'+gloss+'\n')
(P/'L0-orientation.md').write_text('''# Lance engine orientation

**Navigation and contracts; source access is expected.** Start here, choose a path, and open its ordered source set. Deep format details live in the [format contract](L3-symbols/format-spec.md), terminology in the [engine glossary](L0-glossary.md), and exact retained declarations in the [frozen symbol snapshot](L3-symbols/symbol-index.md). [Scope and trust](V21-PROTOCOL.md).

## Architecture and state ownership

Lance presents a versioned Dataset over immutable data files and versioned metadata. A fragment groups physical columns for the same rows; its manifest entry carries deletion, overlay and lineage metadata. A Dataset handle owns a manifest snapshot plus stores, commit handler and session/cache handles. Publishing a new manifest makes a mutation visible; finishing a data file alone does not publish a dataset. (protos/fragment_metadata.proto:8-87; rust/lance/src/dataset/write/commit.rs:460-571; rust/lance-table/src/transaction/operation.rs:1-250)

```mermaid
flowchart TD
  API[Dataset / Scanner / write and index builders] --> Plan[Scan planning and execution nodes]
  API --> Tx[Transaction preparation and commit]
  Plan --> Index[Scalar / vector / full-text indices]
  Plan --> Fragment[Fragment reads and row identity]
  Fragment --> File[lance-file exact-version readers]
  API --> Writer[Fragment / file writers]
  Writer --> File
  File --> Encoding[lance-encoding page and buffer mechanisms]
  File --> IO[lance-io stores and scheduled reads]
  Tx --> Table[lance-table manifests, operations and conflicts]
  Table --> Publish[CommitHandler publication]
  Publish --> IO
  Index --> IO
  Core[lance-core schemas, errors and common data structures] --> API
  Core --> Table
  Protos[Handwritten protobuf schemas] --> Table
  Protos --> File
```

The arrows identify ownership/call boundaries rather than a claim that every request crosses every box. Scanner creates a physical plan; the DataFusion adapter executes it and returns a RecordBatch stream. Encoding describes pages and schedules their bytes through an I/O seam; it does not commit Dataset versions. Index creation writes index state before committing CreateIndex metadata. (rust/lance/src/dataset/scanner.rs:2632-2648; rust/lance-datafusion/src/exec.rs:721-761; rust/lance-encoding/src/lib.rs:33-134; rust/lance/src/index/create.rs:688-735)

## Read path

**Entry:** `dataset.scan().try_into_stream().await?`. The stream must be consumed to execute reads. This is a trace of the public Rust path; it is not a command that was run during KB work.

1. `Dataset::scan` clones the snapshot into `Scanner`. Configure projection/filter/vector/limit before planning. (rust/lance/src/dataset.rs:1687-1704)
2. `Scanner::create_plan_impl` validates options, resolves full-text/query filters, chooses vector, full-text, MinHash or filtered read source, and adds filtering, ordering, limit and final projection. Scalar index use is conditioned on prefiltering or absence of nearest search. Conflicting search modes error. (rust/lance/src/dataset/scanner.rs:3210-3375)
3. `try_into_stream` passes the plan, batch size and statistics callback to `execute_plan`. Multiple output partitions are merged with order preservation when ordering exists; execution starts at partition 0 of that final plan. (rust/lance/src/dataset/scanner.rs:2632-2648; rust/lance-datafusion/src/exec.rs:721-761)
4. The selected source reads fragment metadata/deletions/lineage and reaches exact-version file readers. File open loads footer/global/column metadata; prepared reads schedule pages, decode selected values and materialize batches. The local contract is in the [frozen shared-reader record](L2-files/rust/lance-file/src/reader.rs.md); source ranges are rust/lance-file/src/reader.rs:740-1028. No guarantee is made that every query reads every column or uses an index.

**Ordered initial read set (4 files):** `rust/lance/src/dataset.rs:1687-1704` → `rust/lance/src/dataset/scanner.rs:2632-2675,3210-3375` → `rust/lance-datafusion/src/exec.rs:721-761` → `rust/lance-file/src/reader.rs:740-1028`. For a particular scan operator, follow the scanner's selected source rather than opening all execution nodes.

## Write path

**Entry:** `Dataset::write(reader, destination, Some(params)).await?`.

1. `Dataset::write` constructs `InsertBuilder`, applies params and calls `execute_stream`; the input reader is converted into stream/schema. (rust/lance/src/dataset.rs:950-979; rust/lance/src/dataset/write/insert.rs:98-120)
2. Resolve destination/store/version, validate the write, resolve target bases and write fragments. A fixed data filename combined with target bases is rejected. `execute_uncommitted` stops after building a transaction: data objects may exist, but no manifest has been published. (rust/lance/src/dataset/write/insert.rs:144-265)
3. Create and overwrite produce `Operation::Overwrite`; append produces `Operation::Append`. The transaction's read version comes from the destination snapshot or 0 for a new destination. File assembly/flush belongs to the fragment writer, and its exact bytes to the selected file-version writer. (rust/lance/src/dataset/write/insert.rs:267-315; rust/lance/src/dataset/write.rs:1724-1830)
4. `do_commit` configures `CommitBuilder`. Existing datasets use the retrying transaction path (or the explicitly selected detached path); new datasets use `commit_new_dataset`. Detached new-dataset creation is rejected; detached commit cannot use V1 manifest naming. (rust/lance/src/dataset/write/insert.rs:148-166; rust/lance/src/dataset/write/commit.rs:460-513)
5. Successful publication returns a Dataset carrying the committed manifest/location and caches. Data-file existence is not commit evidence; error/outcome recovery belongs to `io/commit.rs`. (rust/lance/src/dataset/write/commit.rs:515-571; rust/lance/src/io/commit.rs:258-283)

**Ordered initial read set (5 files):** `rust/lance/src/dataset.rs:950-979` → `rust/lance/src/dataset/write/insert.rs:98-315` → `rust/lance/src/dataset/write.rs:1724-1830` → `rust/lance/src/dataset/write/commit.rs:294-571` → `rust/lance/src/io/commit.rs:1581-1800`. The exact persisted manifest contract is already available through the [frozen table I/O record](L2-files/rust/lance-table/src/io/manifest.rs.md).

## Compaction path

**Entry:** `compact_files(&mut dataset, options, remap_options).await?`.

1. Construct and run the compaction planner. Reject eager index remapping on a tagged fragment-reuse history. No planned tasks means no new committed version. Execute planned rewrites with bounded concurrency and collect successful results. (rust/lance/src/dataset/optimize.rs:1034-1158)
2. Each rewrite validates its target exact file version, refreshes required fragment statistics and chooses binary-copy or scan/re-encode. A forced binary-copy request cannot silently fall back. Capture old physical row addresses only when a consumer needs remapping; stable row IDs use their own lineage. (rust/lance/src/dataset/optimize.rs:2443-2514; rust/lance/src/dataset/optimize.rs:2634-2730)
3. `commit_compaction` validates tagged-history/remap requirements and takes the **minimum RewriteResult.read_version**, so conflicts since task planning remain visible even if the caller opened a newer Dataset handle. Address-style outputs reserve fragment IDs; remap indices now or produce deferred fragment-reuse metadata according to the selected protocol. (rust/lance/src/dataset/optimize.rs:3156-3260)
4. Commit a Rewrite operation through Dataset's normal commit boundary. Old files are not made safe to delete merely by writing replacements; retain manifest/version retention policy. (rust/lance/src/dataset/optimize.rs:3574-3605; rust/lance-table/src/transaction/operation.rs:74-119)

**Ordered initial read set (4 files):** `rust/lance/src/dataset/optimize.rs:1034-1158,2443-2730,3156-3260,3574-3605` → `rust/lance/src/io/commit.rs:1581-1800` → [frozen operation contract](L2-files/rust/lance-table/src/transaction/operation.rs.md) → [frozen conflict contract](L2-files/rust/lance-table/src/transaction/conflicts.rs.md). Split copy mechanics or a specific index remapper into a separate task instead of expanding this read set without bound.

## Index build and query path

**Entry:** `DatasetIndexExt::create_index` / `create_index_builder`; query through Scanner.

1. The Dataset extension constructs `CreateIndexBuilder`; optional name and replace settings are applied before awaiting it. The builder validates one-column admission and reserves names against all stored indices, including unsupported ones. (rust/lance/src/index.rs:1858-1892; rust/lance/src/index/create.rs:161-210)
2. Build/train through the selected scalar/vector index implementation; `execute_uncommitted` yields metadata without publication. Multi-segment FM-Index construction has a separate atomic multi-index path. (rust/lance/src/index/create.rs:161-210; rust/lance/src/index/create.rs:688-705)
3. On replacement, collect same-name metadata to remove, then commit CreateIndex with newly built metadata. Reload the committed index by UUID so the return value reflects commit-time changes; missing UUID after commit errors. (rust/lance/src/index/create.rs:698-735)
4. Scanner later selects index-backed or scan-backed sources from query/filter options. Data not covered by an index must be accounted for by that query path; never equate a stored index bitmap with all current rows. The distinctions are in the [frozen index metadata contract](L2-files/rust/lance-table/src/format/index.rs.md). (rust/lance/src/dataset/scanner.rs:3290-3375)

**Ordered initial read set (4 files):** `rust/lance/src/index.rs:1858-1892` → `rust/lance/src/index/create.rs:161-210,688-735` → `rust/lance/src/dataset/scanner.rs:3290-3375` → [frozen index metadata](L2-files/rust/lance-table/src/format/index.rs.md). Concrete scalar/IVF-PQ implementation choices belong to the M2 index Module Map, not an assumed universal build pipeline.

## Essential distinctions

- File format version, Dataset manifest version, per-row creation/update version and index version are different domains. Never compare them interchangeably. [Exact version matrix](L3-symbols/format-spec.md); [glossary](L0-glossary.md).
- Stable logical row IDs differ from physical `(fragment_id, offset)` addresses; compaction changes physical addresses. (rust/lance-core/src/utils/address.rs:6-79; protos/fragment_metadata.proto:34-81)
- Declaration in a protobuf union does not establish acceptance in every exact file version. Reader grammar and writer selection are independent checks. (rust/lance-file/src/versions/v2_1/reader.rs:93-110; rust/lance-file/src/versions/v2_2/reader.rs:93-118)
- Stable format compatibility is durable; unstable formats may change; frozen legacy paths are not new-feature extension points. (AGENTS.md:5-20)

This orientation completes M1's architecture and four public paths. Detailed subsystem/API contracts and navigation tests remain independently tracked in M2–M4; no build or runtime execution is claimed.
''')
f=P/'L3-symbols/format-spec.md';s=f.read_text();(archive/'format-before-synthesis.md').write_text('> Historical chronology before M1 synthesis. [Current contract](../../L3-symbols/format-spec.md).\n\n'+relocate(s,f.parent,archive))
# Test and binary sections are retained only in the historical copy.
blocks=re.split(r'(?m)(?=^## )',s)
remove=('Writer-test evidence','Benchmark evidence','Fully interpreted V1 compatibility artifact','Embedded V2_0 compatibility artifacts','Standard V2_0 compatibility artifact','Standard V2_1 compatibility artifact','Standard V2_2 compatibility artifact')
body='\n'.join(b for b in blocks[1:] if not any(b.startswith('## '+x) for x in remove))
replacements={
 'Those widths imply 40 bytes by arithmetic, pending comparison to reader constants.':'The shared reader consumes exactly 40 bytes (rust/lance-file/src/reader.rs:740-861).',
 'Read/write implementation, byte packing, feature/version gates and historical fixture validation remain pending.':'Blob storage representations and writer/version boundaries are specified in the Blob sections below; binary qualification is excluded.',
 'complete reader/writer dispatch remains pending.':'exact reader/writer dispatch is documented in the runtime and footer sections below.',
 'Full v2 footer offsets/pages/encoding semantics and release fixtures remain pending.':'The full footer, page metadata and exact-version acceptance are specified below; released-fixture execution is outside this KB scope.',
 'existing contracts and pending full writers/readers':'the file and manifest contracts in this document',
 'while complete byte framing and outcome recovery remain pending.':'while retry/outcome decisions belong to the commit protocol contract.',
 'Full released-version qualification and file framing remain pending;':'The transaction body codec is separate from publication; released-version execution is not claimed;',
 'Complete V2 specification acceptance still fails pending concrete versions, encoding runtimes and historical fixtures.':'Concrete version gates, framing and codec contracts follow. Binary fixtures are excluded, not a completion obligation.',
 'exact reader grammar is covered below, while encoder/decoder byte algorithms remain pending.':'exact reader grammar and retained codec byte contracts are covered below; implementation details remain navigable through the cited files.',
 'Complete byte algorithms and backend reader/writer execution remain missing; this is still not a full v2 format qualification.':'This contract describes source behavior; it does not claim runtime qualification against external storage backends.',
 'Binary fixture content and full decoder byte algorithms remain pending.':'Binary fixture inspection is excluded. Use the retained production codec contracts below for decoder behavior.',
 '; historical binary payload inspection remains pending.':'; historical binary payload inspection is excluded.',
 'separate codec remains pending.':'the separate FSST codec contract appears below.',
 'complete specialized implementation and tests remain pending.':'the specialized crate is mapped-only and tests are excluded.',
 'Full kernel format/unsafe analysis remains pending.':'The compression helper crate is mapped-only; source inspection is required before changing its unsafe kernels.',
 'but its full wire specification remains pending.':'and the unstable sparse wire grammar is defined by the complete schema record linked in the field directory.',
 'require pending lance_arrow analysis':'are delegated to the mapped-only lance-arrow boundary',
}
for a,b in replacements.items():body=body.replace(a,b)
body='\n\n'.join(x for x in body.split('\n\n') if not x.startswith('Update transaction object conversion tests assert'))
front='''# Lance persisted and wire-format contract

**M1 synthesis, source snapshot c3c8d6fb505fb437b2b673c5195e1d4b74436b2f.** This document is the authoritative format navigation/contract layer. Exact field declarations and enum/oneof values are incorporated through the thirteen frozen schema records below; implementation claims below carry source ranges. It does not require generated protobuf output, binaries, fixtures, external codec implementations or exhaustive source transcription. [Protocol](../V21-PROTOCOL.md) · [Architecture](../L0-orientation.md) · [Behavior contracts](behavior-contracts.md).

## How to use this contract

For a persisted change, select the owning schema in the field directory, then read its cited runtime gate. That is at most two KB hops. A schema arm's existence is not permission to emit it in every stable version. Preserve stable backward/forward contracts and frozen legacy read behavior; design new features in current writers. Unstable V2_3 does not impose compatibility with earlier unstable revisions. (AGENTS.md:5-20; rust/lance-file/src/version.rs:25-89)

### Exact file identity and acceptance

| Exact identity | Manifest canonical string | Ordinary footer | Embedded footer | Policy and structural gate |
|---|---|---|---|---|
| V1 | 0.1 | (0,2) | (0,2) | Stable frozen legacy implementation; numeric legacy aliases accepted by parser |
| V2_0 | 2.0 | (0,3) | (2,0) | Stable array/column encoding tree, structural headers |
| V2_1 | 2.1 | (2,1) | (2,1) | Stable dense-u16 mini-block framing; no constant/sparse page acceptance |
| V2_2 | 2.2 | (2,2) | (2,2) | Stable/current default; dense-u32 large mini-block framing, constant pages |
| V2_3 | 2.3 | (2,3) | (2,3) | Unstable/next; sparse mechanisms and recursive newer encoding grammar |

Identity/source: rust/lance-file/src/version.rs:25-89; rust/lance-file/src/version.rs:200-262. Runtime mechanisms: rust/lance-file/src/versions/v2_1/mod.rs:125-134; rust/lance-file/src/versions/v2_2/mod.rs:121-131; rust/lance-file/src/versions/v2_3/mod.rs:129-139. The detailed exact-reader section below narrows individual grammar nodes; this matrix is not a blanket admission rule.

Public selectors accept aliases such as stable/next/legacy and 0.3 after lowercasing without whitespace trimming; persisted manifest strings use the strict canonical parser. File-format selection is independent of Dataset version numbering. Table mixed-version bit8 and tagged-FRI bit10 are paired sticky flags. Unknown/unsupported reader flags block reads; writer flags block writes. Debug/environment-gated bits and reserved bits require the explicit [feature-flag contract](../L2-files/rust/lance-table/src/feature_flags.rs.md), not a numeric less-than check. (rust/lance-file/src/version.rs:91-198; rust/lance-table/src/feature_flags.rs:100-378)

### Complete field directory

Every persisted/wire message, field number, optional/repeated distinction, reserved range, enum and union arm in the root schemas is present in these frozen records. Generated serialization code is intentionally unnecessary. Field descriptions are declarations; runtime validation is stated separately in this contract.

| Surface | Exact fields and source range | Runtime/contract route |
|---|---|---|
| Logical Field/Schema, descriptor, V1 metadata | [file.proto](../L2-files/protos/file.proto.md), protos/file.proto:8-223 | Field conversion; V1 compatibility sections below |
| V2 envelope, columns/pages, buffers | [file2.proto](../L2-files/protos/file2.proto.md), protos/file2.proto:11-223 | Forty-byte footer and shared-reader sections below |
| V2_0 array/column grammar | [encodings_v2_0.proto](../L2-files/protos/encodings_v2_0.proto.md), protos/encodings_v2_0.proto:10-358 | Exact V2_0 acceptance; legacy array codec routes |
| Structural page and compression grammar | [encodings_v2_1.proto](../L2-files/protos/encodings_v2_1.proto.md), protos/encodings_v2_1.proto:8-675 | Exact V2_1/V2_2/V2_3 gates; mini/full-zip/sparse, compression sections |
| Manifest, index lists, FRI, MemWAL, sharding | [table.proto](../L2-files/protos/table.proto.md), protos/table.proto:31-769 | Manifest framing, capability words, FRI/MemWAL sections |
| Fragments, files, overlays, deletions, lineage/tree | [fragment_metadata.proto](../L2-files/protos/fragment_metadata.proto.md), protos/fragment_metadata.proto:8-455 | Row identity, deletions, overlay and tree sections |
| Row-ID segments and version runs | [rowids.proto](../L2-files/protos/rowids.proto.md), protos/rowids.proto:11-120 | Segment/sequence and positional lineage codecs |
| Transaction and operation variants | [transaction.proto](../L2-files/protos/transaction.proto.md), protos/transaction.proto:12-433 | Transaction conversion, intent, manifest assembly |
| New index details, vector quantization | [index.proto](../L2-files/protos/index.proto.md), protos/index.proto:6-311 | Index type identity and Any detail boundary |
| Retained historical index type identities | [index_old.proto](../L2-files/protos/index_old.proto.md), protos/index_old.proto:6-118 | Preserve serialized type URLs; do not relocate existing messages |
| ANN execution wire | [ann.proto](../L2-files/protos/ann.proto.md), protos/ann.proto:12-98 | Execution-wire contract, separate from file-format stability |
| Filtered-read execution wire | [filtered_read.proto](../L2-files/protos/filtered_read.proto.md), protos/filtered_read.proto:10-116 | Read options, projections and serialized plans |
| Remote dataset identity wire | [table_identifier.proto](../L2-files/protos/table_identifier.proto.md), protos/table_identifier.proto:8-20 | URI/version/optional manifest reconstruction identity |

### Physical V2 envelope

```text
file
  data buffers and applicable padding
  global payloads (including descriptor where present)
  column metadata protobuf payloads
  column metadata offset table: (position:u64, size:u64) entries
  global buffer offset table: (position:u64, size:u64) entries
  footer: column_metadata_start:u64
          column_table_start:u64
          global_table_start:u64
          global_buffer_count:u32
          column_count:u32
          major:u16, minor:u16, magic:[u8;4] = LANC
```

All footer/table integers are little-endian; footer length is 40 bytes. The tables contain raw offset/size entries, not length-prefixed protobuf messages. A self-described file identifies its schema through the descriptor/global metadata; an embedded mini representation can require an externally supplied schema. Alignment, column mapping and accepted page grammar depend on the exact runtime. Corruption checks are not universally exhaustive: preserve the explicit validation limits in the reader section. (protos/file2.proto:11-115; rust/lance-file/src/reader.rs:740-1028; rust/lance-file/src/writer/structural.rs:834-921)

The remaining sections retain the verified contracts for every storage family, metadata wrapper, compatibility branch and analyzed codec. Where a component is mapped-only or an implementation detail belongs to M3 (for example retrying publication), the boundary is stated rather than expanded into a new per-file analysis obligation.

'''
f.write_text(front+body+'\n')
changed=['L0-orientation.md','L0-glossary.md','L3-symbols/format-spec.md','archive/synthesis-087/orientation-chronology.md','archive/synthesis-087/format-before-synthesis.md','tools/synthesize-m1.py']
(P/'verification/iteration-087-changes.json').write_text(json.dumps({'changed_artifacts':changed},indent=2)+'\n')
print('Wrote M1 synthesis:',changed)
