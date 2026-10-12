import fs from 'node:fs';
import path from 'node:path';
import {root,linesOf} from './inventory.mjs';
const read=p=>JSON.parse(fs.readFileSync(p)),write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const replace=s=>s.replaceAll('two standard V2_1/V2_2 fixtures','standard V2_2 fixture').replaceAll('V2_1/V2_2 fixtures remain pending','V2_2 fixture remains pending').replaceAll('V2_1/V2_2 binary contents','V2_2 binary contents').replaceAll('V1, standard V2_0 and both embedded V2_0','V1, standard V2_0/V2_1 and both embedded V2_0');
const changes=[];
for(const file of ['L1-modules/rust-lance-file.md','L1-modules/rust-lance-file-binary-fixtures.md','L1-modules/rust-lance-file-v1-foundation.md','L1-modules/rust-lance-file-v20-compatibility.md','L1-modules/rust-lance-file-standard-v20-fixture.md']){
 const before=fs.readFileSync(file,'utf8');let after=replace(before).replace('Fifty-four of 56 inventory entries are analyzed (25,581 physical text/symlink lines plus 1,139,328 binary bytes).','Fifty-five of 56 inventory entries are analyzed (25,581 physical text/symlink lines plus 1,640,495 binary bytes).');
 after+='\nThe [standard V2_1 fixture](rust-lance-file-standard-v21-fixture.md) is now fully interpreted, including structural levels, FastLanes bits, all 73 mini-blocks and 575 byte regions; only V2_2 fixture bytes remain pending in lance-file.\n';fs.writeFileSync(file,after);changes.push({file,before,after});
}
const manifest=read('MANIFEST.json'),files=[],symbols=read('analysis/rust-symbols.json');let synchronized=0;
for(const source of ['rust/lance-file/src/lib.rs','rust/lance-file/test_data/exact_versions/README.md','rust/lance-file/src/compatibility_tests.rs']){
 const e=manifest.files.find(e=>e.path===source),f=structuredClone(read(e.analysis_record).files.find(f=>f.path===source));f.limits=replace(f.limits);for(const r of f.ranges)r[2]=replace(r[2]);files.push(f);
 for(const s of symbols)if(s.path===source&&s.behavior){const next=replace(s.behavior);if(next!==s.behavior){s.behavior=next;synchronized++;}}
}
write('analysis/rust-symbols.json',symbols);write('analysis/iteration-069-status-refresh.json',{iteration:69,changes,canonical_files:files.length,derived_symbols_synchronized:synchronized,files});
const append=(p,s)=>fs.appendFileSync(p,'\n'+s+'\n'),ref='rust/lance-file/test_data/exact_versions/v2_1.lance@bytes:0-501167',module='../L1-modules/rust-lance-file-standard-v21-fixture.md';
append('L0-orientation.md',`## Standard V2_1: structural levels inside one list column

The [complete V2_1 artifact](L1-modules/rust-lance-file-standard-v21-fixture.md) maps five fields to five physical columns and 25 pages. List offsets become repetition/definition levels beside the leaf data: 4,097 rows produce 11,172 child slots and 11,545 level entries because null lists add markers without child values. Compression acts on mini-blocks with separate level/value streams; blobs retain out-of-line payloads and page-level description wrapping. Complete decoding covers all 501,167 bytes; it does not establish full Dataset behavior. (rust/lance-encoding/src/repdef.rs:425-644; rust/lance-encoding/src/encodings/logical/primitive.rs:6396-6465; ${ref})`);
append('L3-symbols/format-spec.md',`## Fully interpreted V2_1 structural artifact

The [575-region contract](${module}) specifies 501,167 bytes: data/alignment498240, descriptor327, column metadata2464, CMO80, GBO16, footer40. Footer(2,1), five Values columns, structural PageLayout Any wrappers, priorities0/1024/2048/3072/4096. There are25 pages,73 mini-blocks and60 page buffers. Stored list items differ from level counts; each chunk supplies its own UInt16 num_levels. Mini-block data uses8-byte0xFE padding, outer buffers64-byte0x48 padding. (protos/file2.proto:40-93; rust/lance-encoding/src/encodings/logical/primitive.rs:5751-5910; ${ref})

FastLanes transposes native-word lanes before packing; InlineBitpacking stores a native-word width header, while OutOfLineBitpacking gets width from metadata and may use raw16-bit tails. Name offsets include their own offset-array size; dictionary-block offsets instead start at zero relative to a separately marked payload. Final full blob chunks have log8, showing that a final log0 sentinel is optional for full chunks despite the struct comment. [Exact lane equations, partitions and per-buffer meaning](${module}). (rust/compression/bitpacking/src/lib.rs:4-172; rust/lance-encoding/src/encodings/physical/bitpacking.rs:389-536; rust/lance-encoding/src/encodings/physical/value.rs:83-111; ${ref})`);
append('L3-symbols/behavior-contracts.md',`## V2_1 fixture count and null contracts

MiniBlock.num_items is data.num_values() here, despite the proto introduction defining num_items as level-vector length. Null children own zero-backed physical slots; null lists own only invisible rep/def markers. Slice streams by visible-slot quotas and decode by their actual per-chunk level count. All 373 null lists,745 null children,586 null strings and316 null categories survive decoding. Category nulls reside in definition levels rather than a fourth dictionary item; BlobLayout wraps a nonnull packed(position,size) stream at page level. Changing these units or null locations breaks structural reconstruction even if integer decompression succeeds. [Complete contract](${module}). (protos/encodings_v2_1.proto:19-40; rust/lance-encoding/src/repdef.rs:518-591; rust/lance-encoding/src/encodings/logical/primitive.rs:6396-6465; ${ref})`);
append('L4-crosscutting/scenarios.md',`## Decode the pinned standard V2_1 artifact

1. Resolve footer(2,1), five CMO entries and descriptor global0. Map six schema IDs into five physical columns; use page row lengths and priorities for the five batches. (protos/file2.proto:40-93; rust/lance-file/test_data/exact_versions/v2_1.lance@bytes:498240-501167)
2. Parse UInt16 chunk words, conditional headers and 8-byte component padding. Decode FastLanes values and levels, use visible-slot chunk counts and repetition indices, then rebuild null lists/children. [All73 chunks](${module}) retain actual stream lengths and widths. (rust/lance-encoding/src/encodings/logical/primitive.rs:704-803; rust/lance-encoding/src/encodings/logical/primitive.rs:5751-6062; ${ref})
3. Resolve Variable name offsets and dictionary key/null semantics; fetch each31-byte blob through its packed position/size pair. The KB-side parser compares every resulting row with the documented deterministic input. Lance runtime and full write/compaction lifecycle remain unverified. (rust/lance-encoding/src/encodings/physical/binary.rs:30-154; rust/lance-encoding/src/encodings/physical/binary.rs:457-537; rust/lance-encoding/src/encodings/logical/blob.rs:105-203; ${ref})`);
append('L4-crosscutting/build-and-test.md',`## V2_1 artifact validation

The [semantic decoder](../tools/analyze-standard-v21-fixture.mjs) checks all501,167 bytes and4097 rows against exact layouts, formulas and padding/tail rules. The independent [expected-byte assembler](../tools/verify-standard-v21-reconstruction.mjs) constructs all bytes without reading decoder output or source until final comparison; it uses bit-by-bit lane packing and row identities to derive repetition-index entries. [Full contract](${module}). These are KB JavaScript checks; current Rust compatibility tests remain unexecuted. (rust/lance-file/src/compatibility_tests.rs:232-295; rust/lance-file/src/compatibility_tests.rs:352-399; ${ref})`);
append('L4-crosscutting/cookbook.md',`## Diagnose a V2_1 structural fixture mismatch

Locate the differing byte in the [complete map](${module}), then distinguish metadata word, header, rep/def/value payload, padding, dictionary, repetition index, blob payload or protobuf envelope. Check physical versus level counts, FastLanes transpose, raw-tail choice, positive final full-chunk logs, and the two offset bases before changing row assembly. Preserve the stable pinned artifact. No complete new-encoding recipe is implied until remaining encoder/decoder implementations are analyzed. (rust/lance-encoding/src/encodings/logical/primitive.rs:5751-6062; rust/lance-file/test_data/exact_versions/README.md:10-41; ${ref})`);
append('L4-crosscutting/pitfalls.md',`## V2_1 mini-block traps

Do not interpret num_levels0 as zero values, require final log0, equate MiniBlock.num_items with invisible-marker-inclusive level length, read FastLanes as sequential input-order bits, or treat every short packed tail as raw. Dictionary and name offset bases differ. Null-key backing0 is a real key whose validity comes from def levels; blob position0 with size31 is nonempty. The final list page retains a two-byte inline width0 definition header and NullableList interpretation despite containing one valid list. [Exact examples](${module}). (rust/lance-encoding/src/encodings/physical/value.rs:83-111; rust/lance-encoding/src/encodings/physical/bitpacking.rs:389-536; rust/lance-encoding/src/repdef.rs:518-644; ${ref})`);
const context=read('analysis/iteration-068-contextual-reads.json');context.iteration=69;context.resolved_this_iteration=[{path:'rust/lance-file/test_data/exact_versions/v2_1.lance',byte_ranges:[[0,501167]],note:'Complete semantic byte interpretation and authored L0-L4 coverage;25 pages,73 chunks,575 regions.'}];
const reads=[
 ['protos/encodings_v2_1.proto',[[1,162],[288,358],[410,675]],'Fresh framing/compression/layer declarations; proto already fully analyzed.'],
 ['rust/lance-encoding/src/encodings/logical/primitive.rs',[[95,113],[704,815],[2669,2780],[5383,5405],[5751,6098],[6396,6538]],'Selected decoder, index, framing and encoder functions; other regions and complete file remain pending.'],
 ['rust/lance-encoding/src/encodings/physical/bitpacking.rs',[[1,286],[317,388],[389,584]],'Selected inline/out-of-line compression and decoder context;ranges317-341 and344-388 were read;342-343 were not included; full file pending.'],
 ['rust/lance-encoding/src/encodings/physical/binary.rs',[[30,267],[457,537]],'Complete local mini-block Variable and dictionary block layout functions; full file pending.'],
 ['rust/compression/bitpacking/src/lib.rs',[[4,172],[251,315],[373,424],[559,610]],'FastLanes packing/unpacking macro core and selected dispatch boundaries; full file pending.'],
 ['rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs',[[4,132]],'Constants/context/chunk definition and count resolution; trait begins only, file pending.'],
 ['rust/lance-encoding/src/repdef.rs',[[410,650],[790,1014]],'Visible-level interpretation, slicer, list expansion/validity, planning prefix; full file pending.'],
 ['rust/lance-encoding/src/encodings/logical/primitive/dict.rs',[[1,113]],'Dictionary-null normalization and following function signature; full file pending.'],
 ['rust/lance-encoding/src/encodings/physical/value.rs',[[1,195]],'Raw value chunk sizing, full/tail handling and FSL helper prefix; full file pending.'],
 ['rust/lance-encoding/src/encodings/logical/blob.rs',[[31,228]],'Complete local two-field structural blob encoder/wrapping methods; whole file pending.']
];
// Keep only ranges actually visible in bounded reads: the one-line gap342-343 was not read.
reads.find(x=>x[0].endsWith('/physical/bitpacking.rs'))[1]=[[1,286],[317,341],[344,388],[389,584]];
for(const [source,ranges,note]of reads){let current=context.partial_only.find(x=>x.path===source);if(current){current.ranges.push(...ranges);current.note+=' '+note;}else context.partial_only.push({path:source,ranges,note});}
write('analysis/iteration-069-contextual-reads.json',context);
write('analysis/iteration-069-context-source.json',{iteration:69,partial_only:true,files:reads.map(([source,ranges,note])=>{const lines=linesOf(fs.readFileSync(path.join(root,source),'utf8'));for(const [a,z]of ranges)if(z>lines.length)throw Error(source);return {path:source,note,ranges:ranges.map(([a,z])=>({start:a,end:z,text:lines.slice(a-1,z).map((l,i)=>`${a+i} | ${l}`).join('\n')}))};})});
console.log({status_documents:changes.length,canonical_files:files.length,symbols_synchronized:synchronized,context_files:reads.length});
