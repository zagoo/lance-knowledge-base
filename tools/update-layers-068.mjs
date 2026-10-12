import fs from 'node:fs';
import path from 'node:path';
import {root,linesOf} from './inventory.mjs';
const read=p=>JSON.parse(fs.readFileSync(p)),write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const changes=[],replace=s=>s.replaceAll('three standard V2','two standard V2_1/V2_2').replaceAll('V1 and both embedded V2_0','V1, standard V2_0 and both embedded V2_0');
for(const file of ['L1-modules/rust-lance-file.md','L1-modules/rust-lance-file-binary-fixtures.md','L1-modules/rust-lance-file-v1-foundation.md','L1-modules/rust-lance-file-v20-compatibility.md']){
 const before=fs.readFileSync(file,'utf8');let after=replace(before);
 if(file.endsWith('/rust-lance-file.md'))after=after.replace('Fifty-three of 56 inventory entries are analyzed (25,581 physical text/symlink lines plus 433,171 binary bytes).','Fifty-four of 56 inventory entries are analyzed (25,581 physical text/symlink lines plus 1,139,328 binary bytes).');
 after+='\nThe [standard V2_0 fixture](rust-lance-file-standard-v20-fixture.md) now has a complete byte/schema/page contract; V2_1/V2_2 fixtures remain pending.\n';
 fs.writeFileSync(file,after);changes.push({file,before,after});
}
const manifest=read('MANIFEST.json'),files=[],symbols=read('analysis/rust-symbols.json');let synchronized=0;
for(const source of ['rust/lance-file/src/lib.rs','rust/lance-file/test_data/exact_versions/README.md','rust/lance-file/src/compatibility_tests.rs']){
 const e=manifest.files.find(e=>e.path===source),f=structuredClone(read(e.analysis_record).files.find(f=>f.path===source));
 f.limits=replace(f.limits);for(const r of f.ranges)r[2]=replace(r[2]);files.push(f);
 for(const s of symbols)if(s.path===source&&s.behavior){const next=replace(s.behavior);if(next!==s.behavior){s.behavior=next;synchronized++;}}
}
write('analysis/rust-symbols.json',symbols);write('analysis/iteration-068-status-refresh.json',{iteration:68,changes,canonical_files:files.length,derived_symbols_synchronized:synchronized,files});
const append=(p,s)=>fs.appendFileSync(p,'\n'+s+'\n'),ref='rust/lance-file/test_data/exact_versions/v2_0.lance@bytes:0-706157',module='../L1-modules/rust-lance-file-standard-v20-fixture.md';
append('L0-orientation.md',`## Standard V2_0 fixture: five fields across six columns

The [standard V2_0 byte map](L1-modules/rust-lance-file-standard-v20-fixture.md) covers4097 rows and976 pages. A nullable list consumes separate parent-offset and child-value columns; strings, lists, child integers and dictionary keys represent nulls differently. Blob payloads are written out-of-line before each batch's pages and selected by packed(position,size) descriptions. This standard writer pads every buffer to64 bytes with0x48 and emits footer(0,3), distinct from the unpadded embedded(2,0) representation. These local artifacts do not establish complete Dataset or encoding-crate behavior. (rust/lance-file/test_data/exact_versions/datagen.rs:37-131; rust/lance-file/src/versions/v2_0/writer.rs:451-506; ${ref})`);
append('L3-symbols/format-spec.md',`## Fully interpreted standard V2_0 artifact

The [1010-region contract](${module}) covers706157 bytes:619328 data/alignment,327 unframed FileDescriptor,86350 column metadata,96 CMO,16 GBO and40 footer. The six columns have69/513/5/263/61/65 pages respectively. Data includes127007 blob-payload bytes,312875 page-payload bytes and179446 padding bytes; all padding equals0x48. Nested Any wrappers, all protobuf tags/defaults and every physical buffer offset/size are cataloged. (protos/file2.proto:40-93; protos/file2.proto:138-216; ${ref})

Name/list nulls add a page-local A to cumulative end offsets; raw>=A signals null. The first list's raw2791 equals A2791 and is null, exposing the proto comment's strict-greater-than wording. Child nulls use LSB-first validity bits with zero invalid backing; dictionary nulls use ordinary key3 pointing to dictionary item null. Every dictionary page stores[green,blue,red,null] with ends[5,9,12,25],A13. Blob descriptions are two interleaved UInt64 values and ColumnEncoding Blob(inner Values), not BlobV2. Field.type defaults0; deprecated encoding tags remain but do not select page codecs. (protos/encodings_v2_0.proto:82-155; rust/lance-encoding/src/array_encoding/logical/list.rs:1116-1243; rust/lance-encoding/src/data.rs:1703-1778; rust/lance-encoding/src/array_encoding/logical/blob.rs:308-399; ${ref})`);
append('L3-symbols/behavior-contracts.md',`## Standard V2_0 fixture behavior and change impact

Five batch writes emit blob payloads before ordered column pages. The memory-size-based primitive splitter yields61-row integer pages,8-row name pages,43-value child pages,69-row dictionary pages and64-row blob-description pages, with documented batch tails; list offsets use one page per batch. Altering buffer memory estimation, batching, encoding metadata, dictionary normalization or padding can change stable pinned bytes even if decoded rows agree. Do not infer logical row starts from priority0. Exact physical partitions are artifact facts, not universal fixed page sizes. [Complete contract](${module}). (rust/lance-file/test_data/exact_versions/datagen.rs:102-131; rust/lance-file/src/versions/v2_0/writer.rs:451-506; rust/lance-encoding/src/array_encoding/logical/primitive.rs:479-549; ${ref})`);
append('L4-crosscutting/scenarios.md',`## Decode the pinned standard V2_0 file

1. Read40-byte footer(0,3), six CMO entries and one GBO. Decode327-byte FileDescriptor with4097 rows and flattened field IDs0..5; reconstruct List(item) using parent_id2. (rust/lance-file/src/version.rs:200-262; rust/lance-file/test_data/exact_versions/v2_0.lance@bytes:619328-706157)
2. Decode each direct Any page tree. Use metadata unpadded buffer sizes and cumulative lengths; skip0x48 alignment. Normalize name/list ends by A; decode child validity and connect11172 children to3724 valid lists; map dictionary key3 to null. (rust/lance-encoding/src/array_encoding/logical/list.rs:1116-1243; rust/lance-encoding/src/data.rs:1703-1778; ${ref})
3. Unpack4097 blob(position,size) pairs and fetch31 bytes per payload from batch-relative64-byte records. Compare all five logical fields with the [documented deterministic input](${module}). Offline comparison is complete; actual Lance reader execution remains untested and the end-to-end Dataset/compaction question remains open. (rust/lance-encoding/src/array_encoding/logical/blob.rs:308-399; rust/lance-file/test_data/exact_versions/datagen.rs:37-99; ${ref})`);
append('L4-crosscutting/build-and-test.md',`## Standard V2_0 fixture evidence

The [full fixture map](${module}) documents976 pages,1010 regions and4097 rows. The [semantic decoder](../tools/analyze-standard-v20-fixture.mjs) checks all payloads, offsets, keys, validity and padding. A separate [expected-byte assembler](../tools/verify-standard-v20-reconstruction.mjs) builds the entire file from formulas/partitions/protobuf tags before opening source evidence during VERIFY. These checks execute KB JavaScript only. The existing Rust stable-file compatibility test requires current-writer byte equality, footer identity and decoded batch equality; it has not run in this goal. (rust/lance-file/src/compatibility_tests.rs:232-295; rust/lance-file/src/compatibility_tests.rs:352-399; ${ref})`);
append('L4-crosscutting/cookbook.md',`## Diagnose a standard V2_0 fixture mismatch

Locate the first differing byte in the [1010-region map](${module}), identify its batch/column/page or schema/metadata/footer role, and compare raw data versus normalized null semantics. Check memory-size page splitting, separate list offsets, key-null dictionary normalization, two-field packed blob descriptions,64-byte H padding and standard footer(0,3). Preserve historical fixture bytes as the stable oracle. Changes to legacy read surfaces should be isolated and tested against released fixtures; this artifact analysis alone does not authorize replacing the baseline or claim complete encoding implementation coverage. (rust/lance-file/test_data/exact_versions/README.md:10-41; rust/lance-file/src/compatibility_tests.rs:352-399; rust/lance-encoding/src/array_encoding/logical/primitive.rs:479-549; ${ref})`);
append('L4-crosscutting/pitfalls.md',`## Standard V2_0 traps

Physical column3 counts children, not Dataset rows. Raw list/name offsets can decrease after a null marker; normalize before subtraction. Dictionary nulls have no key bitmap and the last nonnull-only page still stores a null dictionary item. The nullable child envelope remains SomeNull even on all-valid pages. Name payload compression is explicit none, while dictionary payload compression metadata is absent. Blob descriptor sizes exclude padding, and position0 is a valid nonempty blob, distinct from empty(0,0) and null(1,0). Schema type0 and deprecated encoding tags must not replace actual page encodings. [Byte evidence](${module}). (rust/lance-encoding/src/data.rs:1703-1778; rust/lance-encoding/src/array_encoding/logical/blob.rs:308-350; ${ref})`);
const context=read('analysis/iteration-067-contextual-reads.json');context.iteration=68;
context.resolved_this_iteration=[{path:'rust/lance-file/test_data/exact_versions/v2_0.lance',byte_ranges:[[0,706157]],note:'Complete byte interpretation and authored L0-L4 coverage;4097 rows and1010 regions.'}];
const contextual=[
 {path:'rust/lance-encoding/src/encoder.rs',ranges:[[125,165]],note:'Complete local OutOfLineBuffers allocation/alignment context; full file pending.'},
 {path:'rust/lance-encoding/src/array_encoding/logical/blob.rs',ranges:[[294,414]],note:'V2_0 BlobFieldEncoder position/size generation, forwarding and finish wrapper; broader logical blob implementation pending.'},
 {path:'rust/lance-encoding/src/array_encoding/physical/dictionary.rs',ranges:[[250,344]],note:'AlreadyDictionaryEncoder definition/encoding validation and buffer allocation; full file pending.'},
 {path:'rust/lance-encoding/src/array_encoding/physical/packed_struct.rs',ranges:[[154,259]],note:'Local packed-struct encoder complete logic and boundary; full file pending.'},
 {path:'rust/lance-encoding/src/array_encoding/logical/list.rs',ranges:[[1080,1379]],note:'Offset normalization, span calculation, encode_u64 and ListFieldEncoder interactions; surrounding scheduler/decoder and full file pending.'},
 {path:'rust/lance-encoding/src/data.rs',ranges:[[1630,1785]],note:'Dictionary concatenation/overflow handling, max key value, key-null normalization and Nullability declaration; full DataBlock file pending.'}
];
for(const item of contextual){const old=context.partial_only.find(x=>x.path===item.path);if(old){old.ranges.push(...item.ranges);old.note+=' '+item.note;}else context.partial_only.push(item);}
context.fresh_already_analyzed_context=[{path:'rust/lance-file/test_data/exact_versions/datagen.rs',ranges:[[20,132]]},{path:'rust/lance-file/src/compatibility_tests.rs',ranges:[[232,295]]},{path:'rust/lance-file/src/versions/v2_0/writer.rs',ranges:[[222,298],[353,510],[647,692]]},{path:'protos/encodings_v2_0.proto',ranges:[[1,160],[230,280]]},{path:'protos/file.proto',ranges:[[120,223]]}];
write('analysis/iteration-068-contextual-reads.json',context);
write('analysis/iteration-068-context-source.json',[...contextual,...context.fresh_already_analyzed_context].map(item=>({...item,source:item.ranges.map(([a,b])=>({start:a,end:b,numbered:linesOf(fs.readFileSync(path.join(root,item.path),'utf8')).slice(a-1,b).map((line,i)=>`${a+i} | ${line}`).join('\n')}))})));
console.log({status_files:changes.length,canonical_files:files.length,symbols_synchronized:synchronized,context_files:contextual.length});
