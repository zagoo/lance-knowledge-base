import fs from 'node:fs';import {root,linesOf}from './inventory.mjs';
const read=p=>JSON.parse(fs.readFileSync(p));const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const batch=read('analysis/iteration-052-batch.json');const f=batch.files.find(f=>f.path.endsWith('/datatypes.rs'));const r=f.ranges.find(r=>r[0]===394);const old=r[2];r[2]='test_schema_metadata creates one int32 field plus k1/v1,k2/v2, imports core, encodes FieldsWithMeta, decodes and asserts Schema equality. Core Schema::PartialEq compares only fields (rust/lance-core/src/datatypes/schema.rs:874-878), so this test does not actually assert preservation of the top-level metadata map. Only valid UTF-8 values are exercised.';write('analysis/iteration-052-batch.json',batch);
const changes=[{path:f.path,range:[394,411],before:old,after:r[2],reason:'During ANALYZE, inspected Schema::PartialEq to avoid overstating the test oracle.'}];
let module=fs.readFileSync('L1-modules/rust-lance-file.md','utf8');
function rep(before,after){if(!module.includes(before))throw Error('Missing expected prose '+before);module=module.replace(before,after);changes.push({path:'L1-modules/rust-lance-file.md',before,after});}
rep('Seven of56 inventory entries are analyzed (631 physical text/symlink lines). Reader/writer implementations, encoding IO, schema adapters, compatibility fixtures and benches remain pending.','Twelve of56 inventory entries are analyzed (2,259 physical text/symlink lines). Schema conversion, encoding IO adapter, exact dispatch, writer facade and shared type checks are covered. Concrete reader/writer/encoding implementations, compatibility fixtures and benches remain pending.');
rep('Actual reader/writer behavior and all unreviewed APIs remain unknown.','The [runtime-boundary supplement](rust-lance-file-runtime.md) covers schema conversion, IO adaptation, exact dispatch and writer interfaces; full concrete reader/writer behavior remains pending.');
rep('|-- io: crate-visible, LanceEncodingsIo reexport (implementation pending)\n|-- reader / writer / concat / datatypes / versions (pending)','|-- io: range splitting, empty placeholders and ordered reassembly\n|-- datatypes: flat protobuf fields <-> core schema trees\n|-- versions: exact dispatch; concrete submodules pending\n|-- writer: facade/options/type checks; concrete pipelines pending\n|-- reader / concat (pending)');
rep('Reader/writer extension traits and registrations remain pending.','Exact reader/writer dispatch and shared type checks are now covered in the runtime-boundary supplement; concrete mechanisms and historical fixtures remain pending.');fs.writeFileSync('L1-modules/rust-lance-file.md',module);
let table=fs.readFileSync('L1-modules/rust-lance-table.md','utf8');const before='This is distinct from the pending transaction-module builder type.',after='This is distinct from the transaction-module builder type, now covered in the transaction supplement.';if(table.includes(before)){table=table.replace(before,after);changes.push({path:'L1-modules/rust-lance-table.md',before,after});fs.writeFileSync('L1-modules/rust-lance-table.md',table);}
write('analysis/iteration-052-status-refresh.json',{iteration:52,changes});
let text=`# lance-file runtime boundaries: schema, IO, exact dispatch and writer checks

**PARTIAL CRATE COVERAGE.** This supplement fully covers five local files (1,628 lines): datatypes.rs, io.rs, versions/mod.rs, writer.rs and writer/field_types.rs. Concrete version readers/writers, shared structural pipelines, full reader and historical fixtures remain pending. Source tests are described, not executed.

[File module](rust-lance-file.md) · [Orientation](../L0-orientation.md) · [Contracts](../L3-symbols/behavior-contracts.md) · [Format](../L3-symbols/format-spec.md) · [Scenarios](../L4-crosscutting/scenarios.md) · [Cookbook](../L4-crosscutting/cookbook.md)

## Schema reconstruction and persistence conversion

Fields(pub Vec<pb::Field>) and FieldsWithMeta{fields:Fields,metadata:HashMap<String,Vec<u8>>} are public. From<&Field> recursively flattens parent then children; From<&Schema> concatenates root subtrees. They preserve supplied IDs/parent IDs and do not validate or assign them. TryFrom<&Fields> for Schema reconstructs iteratively and supplies empty schema metadata; TryFrom<FieldsWithMeta> adds lossily decoded metadata. (rust/lance-file/src/datatypes.rs:95-129; rust/lance-file/src/datatypes.rs:157-314)

\`\`\`text
protobuf list, parents before children
|-- arena: childless Field + child node indices
|-- ID map: unique ID -> node; duplicate ID -> ambiguous
|   '-- ambiguous parent -> first pre-order DFS match
|-- reverse arena order: take children into parent
'-- roots in input order -> Schema(fields, empty metadata)
    '-- FieldsWithMeta adds the converted schema metadata
\`\`\`

Unique IDs use expected-linear hash lookups; ambiguous references allocate a DFS stack and may lead to quadratic work. Parent-before-child is enforced, strict flat pre-order is not. Historical duplicates are intentionally retained: a nested duplicate under an earlier root can win over a root encountered earlier in the flat list. Missing parents produce Schema errors with name/IDs; internal arena failures are Internal. No Schema::validate or key/type check follows. Iterative reconstruction does not make recursive flattening or Field destruction stack-safe. (rust/lance-file/src/datatypes.rs:102-245; rust/lance-file/src/datatypes.rs:502-520)

Field metadata bytes are decoded with UTF-8 replacement; nonempty dedicated extension_name overrides its metadata key. Unknown numeric encodings become None; encoding numbers1..4 map Plain/VarBinary/Dictionary/RLE, and encoding writes None as0. The legacy field-kind number is ignored on read and forced0 on write. Primary presence uses positive position or legacy bool->Some(0); clustering uses positive position only and writes its legacy bool=false. Dictionary i64 locations cast unchecked to usize and back; loaded dictionary values are discarded. (rust/lance-file/src/datatypes.rs:11-94; rust/lance-file/src/datatypes.rs:316-344)

Minimal local conversion example, derived from the source doctest (not compiled here):

\`\`\`rust
use lance_core::datatypes::Schema;
use lance_file::{datatypes::Fields, format::pb};
fn decode_root() -> lance_core::Result<Schema> {
    Schema::try_from(&Fields(vec![pb::Field {
        id: 0,
        parent_id: -1,
        name: "value".to_owned(),
        logical_type: "int32".to_owned(),
        ..Default::default()
    }]))
}
\`\`\`

The example only establishes reconstruction; it does not validate a complete dataset schema. The source metadata roundtrip unit test uses Schema equality, which ignores top-level metadata, so that test alone cannot prove metadata preservation. (rust/lance-file/src/datatypes.rs:139-156; rust/lance-file/src/datatypes.rs:394-410; rust/lance-core/src/datatypes/schema.rs:874-878)

## Encoding IO and retained memory

LanceEncodingsIo is public through the crate reexport. It owns a FileScheduler and starts with an8MiB read chunk target; the consuming setter accepts zero without validation. EncodingsIo promises one Bytes per input range including empties. This adapter preserves empty positions and original order, delegates priority unchanged to FileScheduler and always returns Some for optional bypass/stats handles. Stats replaces the extra recorder on a cloned scheduler; it does not reopen the file. (rust/lance-file/src/lib.rs:16-17; rust/lance-file/src/io.rs:12-50; rust/lance-file/src/reader.rs:56-58; rust/lance-encoding/src/lib.rs:40-104; rust/lance-io/src/scheduler.rs:1336-1352)

For a range of length n>limit, generate k=ceil(n/limit) chunks: k-1 chunks of floor(n/k), then a final remainder. This is a target, not a strict cap: n=10,limit=3 yields2,2,2,4. Zero limit divides by zero for nonempty requests; reversed bounds subtract unchecked. No sort/dedup occurs. FileScheduler checks actual split start order, coalesces nearby requests and can split again, so this adapter does not determine physical IOP size. (rust/lance-file/src/io.rs:51-98; rust/lance-io/src/scheduler.rs:1195-1264)

Scheduler submission occurs before returning the adapter's boxed async block, including for an empty split list. Await errors propagate; result-count mismatch is Internal. Unsplit requests return the scheduler Vec directly. Reassembly groups returned Bytes per original request, inserts empty Bytes, cheaply clones single chunks and allocates/copies multiple chunks. It does not verify individual result lengths; retained source chunks overlap the combined allocation. Scheduler queue/cancellation lifetime remains pending. (rust/lance-file/src/io.rs:98-148)

## Exact-version dispatch matrix

Every dispatch takes ConcreteFileVersion; callers resolve Stable/Next separately. There is no ordered comparison or implicit nearest-version fallback. (rust/lance-file/src/versions/mod.rs:4-48)

| Operation family | V1 | V2_0 | V2_1, V2_2, V2_3 |
|---|---|---|---|
| Field/name/whole-schema projections, physical counts and data-file column mapping | Own v1 module | Own module | Each own module |
| Current read projection / finish raw metadata | Internal | Own module | Each own module |
| Finish metadata index | VersionConflict(0,2) | Own module | Each own module |
| Decode embedded column metadata | NotSupported | Own module | Each own module |
| Validate global buffers | Successful no-op | Own module | Each own module |
| Copy external column | NotSupported, closure unused | Conditional callback | Always await callback |
| Finalize copied pages | NotSupported | Normalize pages | Successful no-op |
| Open projected reader | NotSupported | Full opener only | Eligible indexed attempt, then full on None |
| Create current/lazy writer; encode embedded/mini batch | NotSupported | Own module | Each own module |

Matrix evidence: rust/lance-file/src/versions/mod.rs:38-277; rust/lance-file/src/versions/mod.rs:285-401. Per-version byte grammars and concrete mechanisms are not inferred from this routing table.

External metadata validation checks whole-schema physical count, projection validity, sequential column.index values, then delegates rectangularity/normalized row count to the exact read projection. Indexed reader opening requires preference plus structural eligibility; an indexed error propagates, while None falls back. V2_0 never invokes the indexed closure. Self-described opening delegates optimistic-tail detection; OpenedFileReader::V1 only retains footer numbers, while Current owns FileReader. (rust/lance-file/src/versions/mod.rs:50-107; rust/lance-file/src/versions/mod.rs:279-326; rust/lance-file/src/reader.rs:1117-1144; rust/lance-file/src/reader.rs:1542-1555)

## Writer facade and diagnostics

FileWriter stores one boxed exact V2 writer. FileWriterOptions defaults all three Option fields to None; its local validator rejects only max_page_bytes=Some(0). The8MiB-per-column budget and Arrow C-interface retention warning are documentation; concrete default/environment resolution remains pending. PAGE_BUFFER_ALIGNMENT=64 and LANCE_FILE_WRITER_MAX_PAGE_BYTES are declared here but used by concrete writers. (rust/lance-file/src/writer.rs:17-77)

write_batches awaits batches sequentially, stops at first error and does not roll back earlier effects. External-column initialization converts every ColumnInfo to protobuf first: both page encoding forms and column encoding become serialized prost Any in DirectEncoding; descriptor pairs unzip in order, page row counts/priorities persist, ColumnInfo.index is omitted. Only then is the concrete initializer called. The facade does not establish schema/column or state consistency. finish returns FileWriteSummary{num_rows,size_bytes}; abort returns unit; tell reports delegated position. Their durability/cleanup guarantees require concrete analysis. (rust/lance-file/src/writer.rs:79-115; rust/lance-file/src/writer.rs:160-289)

ExpectedTypes is effectively crate-internal despite pub declarations in its private module. It converts expected core fields to Arrow once, remembers the last successful SchemaRef, and compares schemas by value equality. It matches expected columns by name (same-position fast path, name-search fallback); absent fields and extras are outside this checker. It does not inspect array values/nulls. A failed check leaves the prior accepted schema cached. (rust/lance-file/src/writer.rs:17-21; rust/lance-file/src/writer/field_types.rs:67-114)

The recursive checker compares extension name/metadata when enabled, pairs Struct/List/LargeList/Map/FixedSizeList children by position, ignores names/nullability in those arms and ignores Map sortedness. Blob-v2 Struct/Struct short-circuits child validation after the extension gate; the blob encoder is responsible for descriptor checks. Utf8<-Utf8View and Binary<-BinaryView are directional exceptions. Other types use exact DataType equality, potentially including stricter embedded-field equality. Bare column writes skip only the top-level extension comparison; nested children still compare extensions. (rust/lance-file/src/writer/field_types.rs:115-193)

FieldTypeMismatch is publicly reexported and downcastable through Error::InvalidInput source. It retains expected/actual FieldRef and a path constructed from expected names. Dot separators are unescaped. Display prints type plus extension; metadata without an extension name prints as no extension even though comparison can reject it. Contextual concrete writers call type checks before encoder preparation/nullability checks; invalid bare column indices are guarded there rather than in ExpectedTypes::check_column. (rust/lance-file/src/writer/field_types.rs:21-65; rust/lance-file/src/writer/field_types.rs:120-193; rust/lance-file/src/writer/structural.rs:610-630; rust/lance-file/src/writer/structural.rs:663-689; rust/lance-file/src/versions/v2_0/writer.rs:458-477; rust/lance-file/src/versions/v2_0/writer.rs:544-572)

## Local files and exact callable catalog

`;
for(const file of batch.files)text+=`- [${file.path}](../L2-files/${file.path}.md): ${file.role}\n`;
text+='\nSignatures below are literal declarations; visibility accounts for the private field_types module. Trait conversions are public wherever their participating public types are accessible.\n\n| Symbol | Declaration | Visibility | Evidence |\n|---|---|---|---|\n';
for(const s of read('analysis/iteration-052-symbols.json').filter(s=>s.kind.includes('function'))){const src=linesOf(fs.readFileSync(root+'/'+s.path,'utf8'));text+=`| \`${s.name}\` | \`${src.slice(s.line-1,s.end_line).join(' ').trim().replaceAll('|','\\|')}\` | ${s.visibility} | [${s.path}:${s.line}-${s.end_line}](../L2-files/${s.path}.md) |\n`;}
fs.writeFileSync('L1-modules/rust-lance-file-runtime.md',text);
function append(p,t){fs.appendFileSync(p,'\n\n'+t+'\n');}
append('L0-orientation.md',`## File runtime vocabulary and boundaries

- **Fields / FieldsWithMeta**: public flat protobuf wrappers used to reconstruct core schema trees, with optional schema metadata; parents precede children and historical duplicate-ID parents use first pre-order match. (rust/lance-file/src/datatypes.rs:95-314)
- **LanceEncodingsIo**: single-file range adapter preserving one result per request through splitting, empty placeholders and reassembly. **Read chunk size** is a balancing target, not a strict last-chunk cap. (rust/lance-file/src/io.rs:12-148)
- **OpenedFileReader**: dispatch result with either raw legacy footer numbers or a current FileReader. **FileWriter**: runtime enum over four boxed exact V2 writers. (rust/lance-file/src/versions/mod.rs:50-61; rust/lance-file/src/writer.rs:67-77)
- **ExpectedTypes / FieldTypeMismatch**: cached schema/type gate and public diagnostic; missing-column, nullability and actual encoding checks are separate responsibilities. (rust/lance-file/src/writer/field_types.rs:21-193)

See [file runtime boundaries](L1-modules/rust-lance-file-runtime.md). These contracts fill local schema/IO/write-interface gaps; the complete data-file runtime and Dataset trace remain pending.`);
append('L3-symbols/behavior-contracts.md',`## File schema, IO and writer interface contracts

Preserve schema duplicate-ID reconstruction tie-breaking independently of field validation: unique ID map lookup and ambiguous pre-order DFS intentionally differ from first occurrence in flat input. New parent references must point backward; field flattening preserves IDs rather than repairing them. Schema metadata conversion is lossy UTF-8 and Schema equality is not a metadata oracle. (rust/lance-file/src/datatypes.rs:11-25; rust/lance-file/src/datatypes.rs:123-245; rust/lance-file/src/datatypes.rs:273-314; rust/lance-core/src/datatypes/schema.rs:874-878)

The IO adapter must retain one output per original range, including empties, in order. A strict per-read size cap is not its current algorithm: balanced final chunks can exceed the target and scheduler coalescing can alter IOPs again. Count validation is explicit; byte-length validation is absent locally. Changing reassembly affects transient copies and buffer retention. (rust/lance-file/src/io.rs:51-148; rust/lance-io/src/scheduler.rs:1195-1313)

Exact dispatch has intentional asymmetries: V1 global-buffer validation succeeds while most current operations reject it; V2_0 skips indexed open and conditionally skips external-copy callback; V2_1/2/3 propagate indexed error rather than falling back. Preserve error category and callback invocation counts when changing this root. (rust/lance-file/src/versions/mod.rs:109-313)

ExpectedTypes validates schema-represented types/extensions before encoding, not presence or actual values. Batch-schema equality bypasses repeat traversal; bare columns omit top-level extension comparison; Blob-v2 structures delegate children to the blob encoder. Rejecting currently accepted nested names/nullability/Map-sortedness or directional view layouts changes a concrete admission contract. Full caller tests remain pending. (rust/lance-file/src/writer/field_types.rs:87-193)

[Runtime module](../L1-modules/rust-lance-file-runtime.md) contains exact APIs and limits.`);
append('L3-symbols/format-spec.md',`## File field conversion and exact runtime composition

Persisted protobuf Field decoding ignores r#type, treats unknown encoding numbers as None, lossily decodes byte metadata, and lets a nonempty dedicated extension name override metadata. Writes force r#type=0 and encode None as0. Primary key position0 requires the legacy bool for presence; clustering position0 decodes absent and its old bool is not emitted true. Dictionary locations/counts cast i64<->usize unchecked; loaded values do not cross this converter. (rust/lance-file/src/datatypes.rs:11-94; rust/lance-file/src/datatypes.rs:316-344)

Flat field lists require earlier parents, tolerate historical duplicate IDs and choose the first reconstructed pre-order match on ambiguity. Both field order and parent tie-breaking affect schema interpretation; the decoder does not validate unique IDs or logical types. (rust/lance-file/src/datatypes.rs:131-245; rust/lance-file/src/datatypes.rs:502-520)

External ColumnInfo serialization writes DirectEncoding containing prost Any bytes for each page and column, preserving ordered descriptors, page rows and priority. The in-memory column.index is not emitted by this converter. Exact dispatch selects concrete modules for metadata finishing and embedded batch framing; it does not imply their byte layouts are already covered. (rust/lance-file/src/writer.rs:79-115; rust/lance-file/src/versions/mod.rs:63-149; rust/lance-file/src/versions/mod.rs:374-401)

See [runtime matrix](../L1-modules/rust-lance-file-runtime.md). Complete V2 specification acceptance still fails pending concrete versions, encoding runtimes and historical fixtures.`);
append('L4-crosscutting/scenarios.md',`## File runtime entry paths (local, not complete Dataset write)

1. Caller resolves policy to ConcreteFileVersion; versions::create_writer routes schema/options/object writer to one exact V2 module, returning boxed FileWriter. V1 requires its separate manifest-provider writer. (rust/lance-file/src/version.rs:59-75; rust/lance-file/src/versions/mod.rs:328-372)
2. The runtime facade awaits write_batch per input in order. Contextual concrete pipelines invoke ExpectedTypes; it compares schema field types/extensions and retains the last accepted schema. Encoding, page IO and durability remain delegated and incompletely analyzed. (rust/lance-file/src/writer.rs:160-189; rust/lance-file/src/writer/field_types.rs:87-128; rust/lance-file/src/writer/structural.rs:610-630; rust/lance-file/src/versions/v2_0/writer.rs:458-477)
3. On reading, decode_schema reconstructs FieldsWithMeta from protobuf; exact projection dispatch selects per-version layout. Eligible V2_1/2/3 projected opening may use an indexed opener; V2_0 uses full metadata. (rust/lance-file/src/reader.rs:942-952; rust/lance-file/src/versions/mod.rs:151-198; rust/lance-file/src/versions/mod.rs:279-326)
4. Encoding IO splits and submits requests, awaits scheduler bytes, restores empties and copies multi-chunk results. This does not complete scheduler cancellation, decoder lifetime or Dataset scan orchestration. (rust/lance-file/src/io.rs:51-148)

All five full acceptance questions remain open. [Runtime supplement](../L1-modules/rust-lance-file-runtime.md) provides exact local contracts.`);
append('L4-crosscutting/build-and-test.md',`## File runtime boundary tests read in iteration52

Seven datatype tests cover assigned flattened IDs, schema equality roundtrip,4096 wide roots,1024 deep nesting,missing parent,duplicate-ID tie-break and clustering metadata positions. The metadata roundtrip equality ignores schema-level metadata; its name overstates that oracle. Two source doctests assert a reconstructed root name and an owner metadata value. (rust/lance-file/src/datatypes.rs:139-156; rust/lance-file/src/datatypes.rs:254-269; rust/lance-file/src/datatypes.rs:370-565; rust/lance-core/src/datatypes/schema.rs:874-878)

The dispatch module locally tests only V1 rejection by both embedded batch encoders. IO and field_types have no local test modules; writer.rs points to the still-pending writer_tests.rs. No builds, tests, benchmarks or toolchain installations were run. Therefore these are coverage observations, not runtime qualification. (rust/lance-file/src/versions/mod.rs:403-428; rust/lance-file/src/io.rs:1-148; rust/lance-file/src/writer/field_types.rs:1-193; rust/lance-file/src/writer.rs:292-294)`);
append('L4-crosscutting/cookbook.md',`## File-level extension prerequisites

For an exact-format change, extend version identity mappings and every affected exhaustive dispatch in versions/mod.rs, then the matching concrete version mechanisms and FileWriter variant/conversions if introducing a new version. Decide external-copy, projected-metadata and embedded-batch support explicitly rather than assuming all V2 branches are equivalent. Preserve V1 frozen boundaries. This is still a partial touch set until concrete readers/writers and compatibility fixtures are analyzed. (rust/lance-file/src/version.rs:128-262; rust/lance-file/src/versions/mod.rs:38-401; rust/lance-file/src/writer.rs:67-289; AGENTS.md:13-18)

For schema-type admission changes, coordinate core-to-Arrow conversion with ExpectedTypes::check_field and the actual encoder. Extend existing writer tests after their complete analysis, including nested extension mismatch, reordered/missing/extra fields, view direction, bare-column extension absence and Blob descriptor handling. Keep a separate metadata oracle instead of relying on Schema equality. (rust/lance-core/src/datatypes/field.rs:1327-1347; rust/lance-file/src/writer/field_types.rs:87-193; rust/lance-file/src/writer.rs:292-294; rust/lance-core/src/datatypes/schema.rs:874-878)

For IO-adapter changes, preserve output cardinality/order and empty ranges; include zero limit, reversed bounds, overlapping/split requests, result-count/length mismatches and multi-chunk memory behavior. Full scheduler/backend and cancellation analysis is still required; this is not a complete object-store backend recipe. (rust/lance-file/src/io.rs:19-148; rust/lance-encoding/src/lib.rs:40-104; rust/lance-io/src/scheduler.rs:1195-1313)`);
append('L4-crosscutting/pitfalls.md',`## File runtime boundary pitfalls

- A metadata roundtrip test can pass after losing all top-level schema metadata because Schema::PartialEq compares only fields. Assert the metadata map separately. (rust/lance-file/src/datatypes.rs:394-410; rust/lance-core/src/datatypes/schema.rs:874-878)
- Valid unique-ID reconstruction is fast; duplicate parent references trigger whole-arena DFS. Iterative decoding does not remove recursive serialization or destruction depth. (rust/lance-file/src/datatypes.rs:102-245)
- A read chunk target is not a hard maximum. Zero may panic, reversed bounds subtract unchecked, and splitting overlapping ranges can produce descending chunk starts that the scheduler rejects. These are source-derived edge cases, not reproduced failures. (rust/lance-file/src/io.rs:67-98; rust/lance-io/src/scheduler.rs:1204-1215)
- Missing input columns are intentionally skipped by ExpectedTypes. Its accepted cache records schema equality, not pointer identity or values; nullability, encoder presence checks and completion are separate. (rust/lance-file/src/writer/field_types.rs:87-128)
- Indexed-open errors propagate; only None falls back. V1 success in validate_global_buffers is a no-op and does not establish current-format support. (rust/lance-file/src/versions/mod.rs:138-149; rust/lance-file/src/versions/mod.rs:285-313)
- Expected Blob-v2 Struct/Struct skips recursive type checks after extension handling. Bare arrays suppress the outer extension check, and Map sortedness is ignored; other datatype equality can be stricter. (rust/lance-file/src/writer/field_types.rs:115-193)`);
console.log({status_refreshes:changes.length,new_module:'L1-modules/rust-lance-file-runtime.md'});
