import fs from 'node:fs';import {root,linesOf} from './inventory.mjs';
const read=f=>fs.readFileSync(f,'utf8'),json=f=>JSON.parse(read(f)),write=(f,v)=>fs.writeFileSync(f,JSON.stringify(v,null,2)+'\n'),append=(f,s)=>fs.appendFileSync(f,'\n\n'+s+'\n');
const batch=json('analysis/iteration-047-manifest-deletion-io.json'),added=[];
for(const a of batch.files.slice(0,2)){
 const src=linesOf(read(root+'/'+a.path)),mod=a.path.split('/').at(-1).slice(0,-3),prefix='lance_table::io::'+mod;let owner='';
 function add(name,line,end_line,kind,visibility){const r=a.ranges.find(([b,e])=>b<=line&&line<=e);added.push({name:prefix+'::'+name,path:a.path,line,end_line,kind,visibility,behavior:r[2],behavior_reference:`${a.path}:${r[0]}-${r[1]}`,callers:line>=(mod==='manifest'?253:218)?'Local memory-store tests; read but not executed.':mod==='manifest'?'Sibling restore/FRI metadata readers; contextual io/commit.rs213-230 canonical writer, dataset IO commit and cleanup; exact local calls retained in L2. Full caller graph pending.':'Contextual Dataset fragment write_deletions3004-3035 and dataset io/deletion.rs11-43 cache wrapper; transaction validation uses relative path. Full caller graph pending.',callees:mod==='manifest'?'ObjectStore head/get_range/open; generic read_message and chunk stream; Prost decode/metadata converters; detach_sparse_inline_row_ids; WriteExt protobuf/struct write; legacy dictionary writer for V1. Exact branches in L2.':'DeletionVector variant dispatch; Arrow IPC ZSTD one-batch writer/reader or Roaring codec; ObjectStore put/read_one_all; path/suffix construction and audit tracing. No manifest commit.'});}
 for(let i=0;i<src.length;i++){
  const m=src[i].match(/^mod (\w+)/);if(m){owner='test';add(m[1],i+1,i+1,'module','private cfg(test)');}
  const im=src[i].match(/^impl V1ManifestProvider for ManifestDescribing/);if(im){owner='<ManifestDescribing as V1ManifestProvider>';add(owner,i+1,i+1,'implementation','public trait implementation');}
  if(src[i]==='}'&&i<253)owner='';
  const c=src[i].match(/^(pub )?(const|static) (\w+)/);if(c){let end=i+1;if(c[2]==='static')while(!/^\}\);$/.test(src[end-1]))end++;add(c[3],i+1,end,c[2],c[1]?'public':'private');}
  if(src[i].includes('const PREFETCH_SIZE:'))add('read_manifest::PREFETCH_SIZE',i+1,i+1,'constant','private local');
  if(/^pub struct ManifestDescribing/.test(src[i]))add('ManifestDescribing',i+1,i+1,'struct','public');
  const fn=src[i].match(/^\s*(pub )?(async )?fn (\w+)/);if(!fn)continue;let end=i+1;while(!/[{;]\s*$/.test(src[end-1]))end++;
  const test=i>=(mod==='manifest'?253:218);add((test?'test::':owner?owner+'::':'')+fn[3],i+1,end,fn[2]?'async function':'function',test?'private cfg(test)':fn[1]?'public':owner?'public trait method':'private');
 }
}
const paths=new Set(batch.files.slice(0,2).map(a=>a.path));const prior=json('analysis/rust-symbols.json').filter(s=>!paths.has(s.path));for(const s of prior)if(s.path===batch.files[2].path)s.behavior=batch.files[2].ranges[0][2];write('analysis/rust-symbols.json',[...prior,...added]);
const api=added.filter(s=>s.visibility==='public'||s.visibility==='public trait method'||s.visibility==='public trait implementation').map(s=>{const src=linesOf(read(root+'/'+s.path));return`| \`${s.name}\` | \`${src.slice(s.line-1,s.end_line).join(' ').trim().replaceAll('|','\\|')}\` | ${s.visibility} | [${s.path}:${s.line}-${s.end_line}](../L2-files/${s.path}.md) |`;}).join('\n');
fs.writeFileSync('L1-modules/rust-lance-table-io.md',`# Table metadata IO

Complete scope: manifest.rs392 lines and deletion.rs370 lines, plus io.rs facade. Commit arbitration and backends remain pending. [Table](rust-lance-table.md) · [Candidate assembly](rust-lance-table-manifest-build.md) · [Manifest L2](../L2-files/rust/lance-table/src/io/manifest.rs.md) · [Deletion L2](../L2-files/rust/lance-table/src/io/deletion.rs.md) · [Contracts](../L3-symbols/behavior-contracts.md) · [Scenarios](../L4-crosscutting/scenarios.md).

These public io submodules read/write metadata objects and return errors. Manifest serialization mutates offsets in a borrowed Manifest and appends bytes to a caller Writer; it does not close the file. Deletion serialization builds an entire payload then puts one object and returns metadata. Neither establishes concurrent dataset commit success. (rust/lance-table/src/io.rs:1-6; rust/lance-table/src/io/manifest.rs:177-230; rust/lance-table/src/io/deletion.rs:61-134)

## Public API

| Symbol | Exact declaration | Visibility | Evidence |
|---|---|---|---|
${api}

## Manifest read lifecycle

read_manifest trusts optional size or HEADs for it, requests last64KiB, retries once without known size only after successful bytes fail minimum16/magic checks, then uses signed LE footer offset as usize. It does not inspect footer version bytes or invoke feature capability gates. Bounds arithmetic is unchecked: malformed offsets or a trimmed body too short for prefix+footer can panic via arithmetic/slices. Length mismatch after trimming is InvalidInput; short-tail/wrong-magic and slow-path minimum20 are CorruptFile(path). GET errors and decode errors do not trigger cached-size retry. (rust/lance-table/src/io/manifest.rs:32-128)

For a larger body it opens a sized reader and accumulates16MiB chunks in file order under bounded concurrency, appends tail and decodes through ChunkedBuf without one full concatenation. All body chunks are retained before Prost decoding, so this is not bounded-memory streaming parsing. Within-chunk Bytes fields can share backing; cross-boundary copy_to_bytes allocates. After conversion detach_sparse_inline_row_ids copies nonzero inline total when less than one quarter of recorded message length, reducing retained backing at a transient copy cost. Performance numbers in source comments are not measurements here. (rust/lance-table/src/io/manifest.rs:75-127; rust/lance-io/src/utils.rs:19-159; rust/lance-table/src/format/manifest.rs:391-419)

read_manifest_indexes has a different retry: only a known size plus exact error-text substring file size is too small causes a second read without hint. Missing index_section returns empty without IO. It converts every metadata entry but does not verify uniqueness or dataset feature compatibility. Private read_index_section opens the selected view and invokes length-prefixed generic read_message. (rust/lance-table/src/io/manifest.rs:129-175; rust/lance-io/src/utils.rs:161-199)

## Manifest write lifecycle

V1 default format first writes schema dictionaries; exact V2 variants skip that step. do_write_manifest writes Some index vector even if empty, or clears inherited offset for None; then does the same for optional inline transaction; finally writes manifest. Successful earlier writes and offset mutations are not rolled back by later error/cancellation. The returned position is where the manifest length prefix begins. (rust/lance-table/src/io/manifest.rs:177-230; rust/lance-io/src/traits.rs:53-63; rust/lance-io/src/traits.rs:84-92)

Contextual canonical writer creates ObjectWriter, calls this body writer, appends footer via WriteExt, shuts down and only then logs create. It uses lance-file footer constants0/2/LANC, whereas table format facade declares0/1/LANC; read_manifest checks neither pair. Commit handler selection/arbitration lies outside this excerpt. ManifestDescribing is a legacy V1 schema-only provider and directly calls do_write_manifest on a fresh V1 envelope. (rust/lance-table/src/io/commit.rs:31-40; rust/lance-table/src/io/commit.rs:199-230; rust/lance-io/src/traits.rs:95-107; rust/lance-file/src/format.rs:30-33; rust/lance-table/src/format.rs:51-56; rust/lance-table/src/io/manifest.rs:232-251)

## Deletion path and representation

Paths combine supplied base with _deletions/{fragment_id}-{read_version}-{random_id}.arrow or .bin. base_id is ignored locally; caller must select directory/store. NoDeletions returns None; explicit Set(empty) and Bitmap(empty) still write. Representation is chosen by enum arm, not density at IO time. Set serialization uses unspecified HashSet order and a single Arrow IPC ZSTD batch with nonnullable row_id:UInt32. Bitmap serializes Roaring as-is with no explicit run optimization. Every payload is built in Vec before one put. (rust/lance-table/src/io/deletion.rs:25-134)

Array reader loads full object and all batches before checking exactly one batch and exact schema equality. It deduplicates offsets into HashSet, rejects nulls, and returns Set without normalization. Bitmap reader wraps Roaring errors with path and returns Bitmap. Neither validates physical bounds or num_deleted_rows, resolves base_id, or explicitly checks trailing bytes after Roaring decode. A malformed Arrow iterator error becomes CorruptFile(path), while constructor error uses generic conversion. Guarded unwraps rely on count/schema checks. (rust/lance-table/src/io/deletion.rs:135-216)

Contextual dataset reader resolves directory before cache lookup, uses DeletionFileKey, and on miss resolves store, reads and inserts Arc vector. It is get-then-read-then-insert, with no explicit single-flight in that wrapper. Fragment write_deletions drops a fully deleted fragment; when count>=physical but coverage differs it errors; otherwise writes metadata. That count-conditional check does not locally reject every out-of-range offset in a smaller set. These callers are contextual and remain pending whole-file analysis. (rust/lance/src/io/deletion.rs:11-43; rust/lance/src/dataset/fragment.rs:3004-3035)

## Dependencies, extensibility and verification limits

Manifest depends on ObjectStore/Writer/CommitHandler location metadata, Prost and table codecs; chunk concurrency follows Reader::io_parallelism with minimum1. Deletion depends on Arrow IPC ZSTD and Roaring formats, core DeletionVector and audit tracing. Object-store implementations and Writer trait are storage extension boundaries; neither reviewed file declares environment settings or an index/encoding registry. Legacy ManifestProvider adapts the old writer and remains frozen compatibility scope. (rust/lance-table/src/io/manifest.rs:4-30; rust/lance-table/src/io/manifest.rs:232-251; rust/lance-table/src/io/deletion.rs:4-23; rust/lance-io/src/utils.rs:27-44; AGENTS.md:13-18)

Tests use fresh memory stores and current writer APIs. Large manifests vary payload and prefix size; stale index offset clearing is asserted; legacy schema metadata crosses writer/reader. Deletion tests cover NoDeletions plus Array/Bitmap raw-file and public roundtrips. No tests were run and no historical fixtures, malformed footer recovery, write cancellation or dataset concurrency result is established. (rust/lance-table/src/io/manifest.rs:253-392; rust/lance-table/src/io/deletion.rs:218-370)
`);
append('L1-modules/rust-lance-table.md',`## Manifest and deletion IO

[Table IO supplement](rust-lance-table-io.md) covers all callable declarations and762 new physical lines: manifest tail/body/index reads, offset mutation on serialization, legacy provider, deletion file paths, Arrow/Roaring payloads, async boundaries and error cases. The six-line IO facade now points to covered manifest/deletion implementations; commit arbitration and backends remain pending. (rust/lance-table/src/io.rs:1-6; rust/lance-table/src/io/manifest.rs:1-392; rust/lance-table/src/io/deletion.rs:1-370)`);
append('L0-orientation.md',`## Metadata IO vocabulary

- **Manifest tail prefetch** reads the last64KiB, discovers a length-prefixed manifest body from footer offset, then fetches missing leading chunks when necessary. It is not a data-file read or feature capability check. (rust/lance-table/src/io/manifest.rs:32-128)
- **Manifest section offset** points to separately length-prefixed index or inline-transaction metadata earlier in the same file; unwritten sections must clear inherited offsets. (rust/lance-table/src/io/manifest.rs:129-210)
- **Deletion object** stores physical u32 row offsets in one Arrow IPC batch or Roaring bitmap; the field name row_id does not imply stable u64 identity. Path uses fragment/read-version/random-id and external base resolution belongs to caller. (rust/lance-table/src/io/deletion.rs:25-134; rust/lance/src/io/deletion.rs:11-43)`);
append('L3-symbols/behavior-contracts.md',`## Low-level manifest IO boundaries

Known-size fallback is narrow: read_manifest retries without size only on returned short/magic-invalid tail; index read retries only when known size and error text contains file size is too small. Do not broaden these descriptions to every corruption/IO error. Main reader ignores footer version pair, trusts unchecked offset arithmetic and only validates decoded-body length after slicing. Capability gates belong above it. (rust/lance-table/src/io/manifest.rs:32-175)

write_manifest mutates borrowed state as writes complete. It clears missing sections, emits present empty index section, and returns offset without footer/shutdown. Error or cancellation can leave output partially written and manifest offsets already changed; caller must manage retry/object lifetime. Canonical writer adds footer and shutdown before audit, but publication arbitration remains outside that local helper. (rust/lance-table/src/io/manifest.rs:177-230; rust/lance-table/src/io/commit.rs:213-230)

## Deletion object contracts

NoDeletions is the only no-write case. Set/Bitmap representation, including emptiness, determines encoding without normalization; random IDs avoid deterministic same-name writing by intent but have no collision check here. Reader returns deduplicated Set or Bitmap, with physical-row/count/base identity validation delegated. Whole Arrow file/batches and output serialization bytes may coexist in memory; this is not a streaming RecordBatch pipeline. (rust/lance-table/src/io/deletion.rs:61-216)

Arrow deletion schema equality is strict row_id:UInt32 nonnullable with matching metadata. Iteration rejects nulls even after schema check. Bitmap decode has no local trailing-byte exhaustion check. Successful object put precedes audit and returned metadata; a returned error does not prove the remote object was never created. Store guarantees and cancellation recovery remain separate unreviewed dependencies. (rust/lance-table/src/io/deletion.rs:85-129; rust/lance-table/src/io/deletion.rs:151-216)`);
append('L3-symbols/format-spec.md',`## Actual manifest byte framing and deletion payloads

Contextual WriteExt emits u32 little-endian encoded_len followed by Prost bytes, returning prefix offset. Length uses unchecked usize->u32. Manifest writer places optional index section, optional inline transaction and manifest in that order, preceded by dictionaries only for V1. Footer writer emits i64 LE manifest offset, i16 LE major, i16 LE minor and magic bytes. Body writer alone does not emit footer. (rust/lance-io/src/traits.rs:84-107; rust/lance-table/src/io/manifest.rs:177-230)

Canonical table commit writer imports lance-file's0/2/LANC, while table format facade exposes0/1/LANC. Current read_manifest checks trailing LANC and offset/length, not the version pair. This is observed call-boundary behavior, not a proposed format migration or proof every writer emits the same footer. (rust/lance-table/src/io/commit.rs:31-40; rust/lance-table/src/io/commit.rs:213-230; rust/lance-file/src/format.rs:30-33; rust/lance-table/src/format.rs:51-56; rust/lance-table/src/io/manifest.rs:54-128)

Deletion schema discrepancy: protobuf comments specify Int32Array; the current writer and reader use a single nonnullable row_id:UInt32 Arrow IPC column with ZSTD. Reader exact schema equality would reject signed Int32. Bitmap files use Roaring serialize/deserialize with no added wrapper here. Both are physical offsets and extension comes from metadata kind, not content sniffing. Historical compatibility cannot be inferred without released fixtures. (protos/fragment_metadata.proto:251-287; rust/lance-table/src/io/deletion.rs:25-34; rust/lance-table/src/io/deletion.rs:85-134; rust/lance-table/src/io/deletion.rs:162-216)`);
append('L4-crosscutting/scenarios.md',`## Manifest body write/read and deletion-object trace

1. Candidate assembly returns Manifest/indices; low-level write_manifest first handles V1 dictionaries, writes index and inline transaction sections (or clears offsets), then writes length-prefixed manifest. (rust/lance-table/src/transaction/manifest_build.rs:1904-1919; rust/lance-table/src/io/manifest.rs:177-230)
2. Contextual canonical writer appends footer, awaits shutdown and logs create. Commit ownership/CAS/retries are not established by this function alone. (rust/lance-table/src/io/commit.rs:213-230)
3. Reader obtains size, tail and body chunks; verifies body length, decodes/interns metadata, then copies sparse inline row IDs out of shared backing when below threshold. Separate index read follows recorded offset and narrowly retries cached size. (rust/lance-table/src/io/manifest.rs:32-175; rust/lance-table/src/format/manifest.rs:391-419)
4. Deletion write serializes caller vector to one object and returns metadata. Contextual fragment mutation stores that metadata; a later transaction/manifest must make it durable to readers. Dataset cache wrapper resolves external directory/store and caches Arc vector after full-object read. (rust/lance-table/src/io/deletion.rs:61-216; rust/lance/src/dataset/fragment.rs:3004-3035; rust/lance/src/io/deletion.rs:11-43)

Full Dataset::write/compact_files traces still require writer scheduling, commit handlers/recovery, index mutation/query and cleanup. These IO traces add real byte boundaries but do not complete any of the five acceptance questions.`);
append('L4-crosscutting/cookbook.md',`## Modify manifest or deletion IO

Preserve body/section/footer ownership: changing optional sections must clear old offsets when absent and keep length-prefix positions consistent. Any bounds-hardening work needs malformed short body/negative/oversized offset and stale-size cases in existing test module; changing size retry should test the two distinct predicates. Cancellation/partial-write handling belongs with caller object lifecycle. Keep legacy dictionary/provider paths frozen unless explicitly in scope. (rust/lance-table/src/io/manifest.rs:32-251; rust/lance-table/src/io/manifest.rs:314-392; AGENTS.md:13-18)

For deletion changes, distinguish physical offsets from stable IDs, decide whether normalization belongs in core DeletionVector or IO, and preserve released Arrow/Roaring contracts after resolving schema-comment mismatch with historical evidence. Add meaningful existing-file tests for empty variants, schema/null/duplicate/trailing input, mismatched count and base/store resolution; caller physical-row validation and manifest publication must be analyzed before altering guarantees. (rust/lance-table/src/io/deletion.rs:25-216; rust/lance-table/src/io/deletion.rs:218-370; rust/lance/src/io/deletion.rs:11-43; rust/lance/src/dataset/fragment.rs:3004-3035)`);
append('L4-crosscutting/pitfalls.md',`## Metadata IO pitfalls

- A64KiB prefetch and chunked Buf avoid full concatenation but still accumulate the complete body; cross-chunk fields and sparse row-ID detachment may copy. Source throughput claims are not measurements from this KB run. (rust/lance-table/src/io/manifest.rs:46-127; rust/lance-io/src/utils.rs:47-159)
- Corrupt footer pointers are not fully guarded by the short-tail check. Known-size retry is neither a catch-all decode fallback nor generic retry for GET failures. (rust/lance-table/src/io/manifest.rs:52-128)
- Serialization is stateful: an index write can update the borrowed manifest before a later transaction/body write fails. Footer and close are caller work. (rust/lance-table/src/io/manifest.rs:177-230)
- Empty Set/Bitmap is not NoDeletions; path functions ignore base_id and local read does not verify num_deleted_rows. The row_id Arrow column is UInt32 physical offsets. (rust/lance-table/src/io/deletion.rs:25-216)`);
append('L4-crosscutting/build-and-test.md',`## Manifest/deletion IO source tests

Manifest roundtrip fixtures vary random ignored prefix and deterministic field-name length, including20MiB to cross16MiB chunks. They assert full metadata equality after body/footer/shutdown. A separate fixture verifies absent index section clears inherited42; legacy provider fixture checks schema metadata. A created config map in roundtrip helper is unused, so config persistence is not covered there. Known-size retry, transaction-section clearing, malformed footer and failure atomicity are not directly tested in this file. (rust/lance-table/src/io/manifest.rs:253-392; rust/lance-io/src/utils.rs:27-27)

Five deletion tests cover NoDeletions returnNone, raw Arrow/bitmap write inspection and public read roundtrips for0..100 offsets. They use one fragment and current memory-store writers, not historical fixtures or dataset delete/scan/commit. All source tests were read, not executed. (rust/lance-table/src/io/deletion.rs:218-370)`);
const edits=[];function replace(f,old,value){const s=read(f);if(!s.includes(old))throw Error('Missing '+old);fs.writeFileSync(f,s.replace(old,value));edits.push({file:f,old,value});}
replace('L1-modules/rust-lance-table.md','Forty-three of 54 inventory entries are analyzed, covering 29,678 physical lines','Forty-five of 54 inventory entries are analyzed, covering 30,440 physical lines');
replace('L3-symbols/format-spec.md','Deletion paths combine fragment ID, read version, and opaque concurrent-write ID; Arrow IPC uses one Int32Array column/batch and .arrow, Roaring uses .bin.','Deletion paths combine fragment ID, read version, and opaque concurrent-write ID; protobuf comments describe one Int32Array Arrow IPC column/batch and .arrow, Roaring .bin. The current implementation uses UInt32 instead, as documented in the actual-payload section below.');
write('analysis/iteration-047-status-refresh.json',edits);
const c=json('analysis/iteration-046-contextual-reads.json');c.iteration=47;c.partial_only=c.partial_only.filter(e=>!paths.has(e.path));function context(path,ranges,note){let e=c.partial_only.find(e=>e.path===path);if(e)e.ranges.push(...ranges);else c.partial_only.push({path,ranges,note});}
context('rust/lance-io/src/utils.rs',[[19,205]],'Chunk utility and complete read_message context; whole file pending.');context('rust/lance-io/src/traits.rs',[[32,113]],'WriteExt framing and footer context; whole file pending.');context('rust/lance-table/src/io/commit.rs',[[15,49],[185,239]],'Canonical body/footer/shutdown writer and imports; rest of commit file pending.');context('rust/lance/src/dataset/fragment.rs',[[3004,3043]],'Complete write_deletions caller plus next helper prefix only; whole file pending.');context('rust/lance/src/io/deletion.rs',[[1,43]],'Entire43-line adapter read as contextual dependency; L0-L4 full subsystem/catalog authoring deferred, file remains pending.');write('analysis/iteration-047-contextual-reads.json',c);
console.log({added_symbols:added.length,rust_total:prior.length+added.length,status_refreshes:edits.length});
