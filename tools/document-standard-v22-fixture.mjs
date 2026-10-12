import fs from 'node:fs';
import path from 'node:path';
import {root,output,digest,totals} from './inventory.mjs';
import {checkBinary} from './binary-integrity.mjs';
const read=p=>JSON.parse(fs.readFileSync(path.join(output,p))),write=(p,v)=>fs.writeFileSync(path.join(output,p),JSON.stringify(v,null,2)+'\n');
const r=read('analysis/iteration-070-v2_2-fixture.json'),manifest=read('MANIFEST.json'),entry=manifest.files.find(e=>e.path===r.source),module='L1-modules/rust-lance-file-standard-v22-fixture.md';
if(entry.status!=='pending'||digest(fs.readFileSync(path.join(root,entry.path)))!==entry.sha256)throw Error('Expected unchanged pending V2.2 artifact');
const analysis={path:entry.path,module,reviewed:true,role:'Pinned standard V2_2 binary fixture: 4,097 rows, five physical columns,25 pages (23 mini-block pages and two constants),71 mini-blocks. Every scalar, packed bit, level/index, offset, dictionary, blob description/payload, padding, schema/metadata/table/footer byte is interpreted. No callable symbols.',limits:'Offline KB-side artifact interpretation only. No source build, test, writer, reader or generator executed. All six lance-file fixture binaries are now interpreted, but complete encoding/IO implementations and Dataset integration remain pending. Baseline pin/hash does not independently qualify released-package provenance.',byte_order:'zero-based half-open',byte_artifact:'evidence/binary/v2_2.lance',byte_evidence:'analysis/iteration-070-v2_2-fixture.json',decoded_artifact:'evidence/binary/v2_2-decoded-rows.json',ranges:[],byte_ranges:r.regions.map(x=>[x.start,x.end,x.note])};
const ref=`${entry.path}@bytes:0-500987`,dest=path.join(output,entry.l2_document),link=(label,target)=>`[${label}](${path.relative(path.dirname(dest),path.join(output,target))})`;
let doc=`# ${entry.path}

**Analyzed binary: all 500,987 bytes; line_count=null.** Byte intervals are zero-based and half-open. ${analysis.role}

${link('Module contract',module)} · ${link('Format specification','L3-symbols/format-spec.md')} · ${link('Behavior contracts','L3-symbols/behavior-contracts.md')} · ${link('Cookbook','L4-crosscutting/cookbook.md')} · ${link('Coverage ledger','MANIFEST.json')}

SHA-256: \`${entry.sha256}\`. ${analysis.limits}

${link('Preserved bytes',analysis.byte_artifact)}, ${link('decoded rows',analysis.decoded_artifact)}, ${link('all page/chunk/level/schema/wire details',analysis.byte_evidence)}, ${link('semantic decoder','tools/analyze-standard-v22-fixture.mjs')}, ${link('independent assembler','tools/verify-standard-v22-reconstruction.mjs')}.

## Complete logical contract

Rows r=0..4096: id=r; name=null for r%7=0 else value-NNNN-deterministic-fixture (32 ASCII bytes); items=null for r%11=0 else [r,(null if r%5=0 else2*r),3*r]; category=null for r%13=0 else [red,green,blue][r%3]; blob always blob-NNNN-deterministic-payload (31 ASCII bytes). NNNN is r padded to four decimal digits. Counts:586 null names,373 null lists,11172 physical children with745 nulls,316 null categories; no empty lists or null/empty blobs. Lists have11545 level entries because each null list adds one invisible marker. (rust/lance-file/test_data/exact_versions/datagen.rs:37-99; ${ref})

Each of five batches (1024,1024,1024,1024,1 rows) writes blob payloads first, then one page for id,name,items,category,blob. Every blob uses64 bytes:31 payload plus33 bytes0x48; batch bases0,123648,247936,372608,497408. Page buffers independently align to64 with0x48, excluded from stored sizes. Mini-block components align to8 with0xFE. The data region[0,498048) consists of233644 page-buffer bytes (including chunk framing/internal padding),2196 outer page-padding bytes,127007 blob bytes and135201 blob-padding bytes. (rust/lance-file/test_data/exact_versions/datagen.rs:102-131; rust/lance-encoding/src/encoder.rs:125-165; rust/lance-encoding/src/encodings/logical/primitive.rs:5751-5910; ${entry.path}@bytes:0-498048)

The final id page stores inline Int32 4096 with no buffers; final name page stores a52-byte nonnull Utf8 scalar buffer. Their ConstantLayout layers are AllValidItem. All other pages use MiniBlock (inside BlobLayout for blob) with has_large_chunk=true: UInt32 metadata words and value sizes, but UInt16 level count and rep/def sizes. Six flattened schema field identities map to five physical columns; items and child item share column2. Footer(2,2), A498375,B500851,C500931,globals1,columns5,LANC. (protos/encodings_v2_1.proto:104-161; protos/encodings_v2_1.proto:288-358; rust/lance-arrow/src/scalar.rs:61-136; ${entry.path}@bytes:498048-500987)

## Complete page catalog

Stored items refer to leaf-value slots for MiniBlock; constants do not store MiniBlock.num_items. All absent wire fields/defaults and exact nested messages are preserved in the linked JSON. Page priorities equal first global row. (rust/lance-encoding/src/encodings/logical/primitive.rs:6396-6465; protos/file2.proto:138-216; ${entry.path}@bytes:498375-500851)

| Column/page | Rows | Layout | Metadata | Buffer starts | Sizes | Stored items | Level entries | Chunks |
|---|---|---|---|---|---|---|---|---|
`;
for(const p of r.page_catalog){const e=p.layout.inner??p.layout;doc+=`| ${p.column}/${p.page} | [${p.row_start},${p.row_end}) | ${p.layout.kind} | [${p.metadata_start},${p.metadata_end}) | ${p.offsets.length?p.offsets:'none'} | ${p.sizes.length?p.sizes:'none'} | ${e.num_items??'not stored'} | ${p.chunks.reduce((s,c)=>s+c.num_levels,0)} | ${p.chunks.length} |\n`;}
doc+=`\n## Complete mini-block catalog

UInt32 metadata low4 bits hold log(values), with0 meaning the remaining physical slots. High28 bits store chunk_bytes/8-1, allowing up to2^31 chunk bytes. Full final chunks may keep a positive log; full blob chunks all use8. Each header has UInt16 num_levels, optional UInt16 rep_size and def_size, then one UInt32 value_buffer_size. Each component pads separately to8 bytes. Stored value slots and level entries differ for nullable lists. The two constant pages have no mini-block metadata/header. (rust/lance-encoding/src/encodings/logical/primitive.rs:5751-5910; rust/lance-encoding/src/encodings/physical/value.rs:83-111; ${ref})

| Column/page/chunk | Bytes | Metadata offset / word / log | Values | Levels | Rep / def / value bytes |
|---|---|---|---|---|---|
`;
for(const p of r.page_catalog)for(const c of p.chunks)doc+=`| ${p.column}/${p.page}/${c.index} | [${c.start},${c.end}) | ${c.metadata_offset} / ${c.metadata_word} / ${c.log_num_values} | ${c.num_values} | ${c.num_levels} | ${c.rep_size} / ${c.def_size} / ${c.value_size} |\n`;
doc+='\n## Every byte region\n';
for(const region of r.regions){let refs='protos/file2.proto:40-93; protos/file2.proto:138-216';
 if(region.kind.startsWith('constant scalar'))refs='rust/lance-arrow/src/scalar.rs:61-136; rust/lance-encoding/src/encodings/logical/primitive/constant.rs:31-80';
 else if(region.kind==='constant page metadata')refs='protos/encodings_v2_1.proto:288-322; rust/lance-encoding/src/encodings/logical/primitive/constant.rs:31-203; rust/lance-encoding/src/encodings/logical/primitive.rs:4541-4581';
 else if(['chunk metadata','chunk header','chunk padding'].includes(region.kind))refs='rust/lance-encoding/src/encodings/logical/primitive.rs:5751-5910';
 else if(region.kind==='levels')refs='rust/lance-encoding/src/repdef.rs:425-644; rust/lance-encoding/src/encodings/physical/bitpacking.rs:189-286; rust/lance-encoding/src/encodings/physical/bitpacking.rs:389-536';
 else if(region.kind==='values')refs='rust/compression/bitpacking/src/lib.rs:4-172; rust/lance-encoding/src/encodings/physical/binary.rs:30-154; rust/lance-encoding/src/encodings/logical/blob.rs:31-228';
 else if(region.kind==='dictionary')refs='rust/lance-encoding/src/encodings/physical/binary.rs:457-537; rust/lance-encoding/src/encodings/logical/primitive/dict.rs:30-111';
 else if(region.kind==='repetition index')refs='rust/lance-encoding/src/encodings/logical/primitive.rs:5916-6062';
 else if(['page metadata','column envelope'].includes(region.kind))refs='protos/file2.proto:138-216; protos/encodings_v2_1.proto:49-162; protos/encodings_v2_1.proto:288-358; protos/encodings_v2_1.proto:410-675';
 else if(region.kind==='blob payloads'||region.kind==='page buffer padding')refs='rust/lance-encoding/src/encoder.rs:125-165; rust/lance-encoding/src/encodings/logical/blob.rs:105-203';
 else if(region.kind.startsWith('descriptor')||region.kind==='schema field')refs='protos/file.proto:9-22; protos/file.proto:123-223';
 doc+=`\n### Bytes ${region.start}-${region.end}\n\n${region.note}\n\nEvidence: ${entry.path}@bytes:${region.start}-${region.end}. Interpretation: ${refs}. SHA-256: \`${region.sha256}\`.\n`;
}
fs.writeFileSync(dest,doc);
const supplement=`# Standard V2_2 fixture: complete byte contract

Scope: all **500,987 bytes**, 4,097 rows,25 pages,71 mini-blocks and544 contiguous authored regions. All six lance-file fixtures now have full byte analysis. [Crate](rust-lance-file.md), [L2 regions and complete catalogs](../${entry.l2_document}), [V2_1 comparison](rust-lance-file-standard-v21-fixture.md), [format](../L3-symbols/format-spec.md), [cookbook](../L4-crosscutting/cookbook.md), [orientation](../L0-orientation.md). Complete encoding/IO and Dataset integration remain pending; no Lance runtime executed.

## Schema and layout

The exact row formulas and all null counts are in L2. Six flattened schema Fields represent five logical roots: id0:Int32 nonnullable, name1:Utf8 nullable, items2:List nullable with item3:Int32 nullable, category4:Dictionary(Int8,Utf8) nullable, blob5:LargeBinary nullable. Parent IDs are -1 except item parent2. Name compression none, dictionary values compression none and blob true metadata persist. Field.type defaults0 and deprecated encoding tags1/2/3 persist; category retains an empty deprecated Dictionary message with default offset/length0. There is no schema-level metadata. These schema fields do not replace actual structural page encoding. (rust/lance-file/test_data/exact_versions/datagen.rs:37-99; protos/file.proto:123-223; ${entry.path}@bytes:498048-498375)

| Region | Half-open bytes | Meaning |
|---|---|---|
| Data/alignment | 0–498048 | Five blob-first batches; physical columns id,name,items,category,blob |
| FileDescriptor | 498048–498375 | Unframed Schema321 bytes and4097 rows |
| Column0 | 498375–498784 | 409 bytes; four mini-block pages and one inline constant |
| Column1 | 498784–499239 | 455 bytes; four mini-block pages and one buffered constant |
| Column2 | 499239–499809 | 570 bytes; five list mini-block pages |
| Column3 | 499809–500340 | 531 bytes; five dictionary mini-block pages |
| Column4 | 500340–500851 | 511 bytes; five BlobLayout pages with mini-block descriptions |
| CMO | 500851–500931 | Five UInt64(position,size) pairs |
| GBO | 500931–500947 | One UInt64 pair(498048,327) |
| Footer | 500947–500987 | A498375,B500851,C500931,globals1,columns5,major2,minor2,LANC |

All integers here are little-endian. Every column has a43-byte direct Any Values envelope; every page's Any type is /lance.encodings21.PageLayout. Batch lengths1024/1024/1024/1024/1 and priorities0/1024/2048/3072/4096 retain top-level row coordinates. Blob payloads have64-byte records at bases0,123648,247936,372608,497408, each31 ASCII bytes plus33 H bytes. The descriptor/schema/tables/footer are unpadded. (protos/file2.proto:40-93; protos/file2.proto:138-216; rust/lance-encoding/src/encoder.rs:125-165; ${ref})

## Large mini-block framing

All23 mini-block layouts set has_large_chunk=true, num_buffers1. Metadata buffer0 stores UInt32 words; buffer1 concatenates chunks. Low4 bits encode log_num_values,0 means remaining physical values; high28 encode chunk_bytes/8-1, with2^31-byte maximum. A final full chunk can retain nonzero log: full blob chunks use8. Header fields num_levels and optional rep_size/def_size remain UInt16; only value-buffer lengths widen to UInt32. Header and every stream then pad to8 with0xFE. Outer page buffers separately pad to64 with0x48. Do not widen all fields together. The current V2_2 composition orders reject_sparse, constant, dense_u32. (rust/lance-file/src/versions/v2_2/mod.rs:119-131; rust/lance-encoding/src/encodings/logical/primitive.rs:5751-5910; rust/lance-encoding/src/encodings/physical/value.rs:83-111; ${ref})

Because list chunks have both level streams, widening value size moves their header from8 to10 bytes, requiring16 bytes after padding. Each list chunk therefore grows8 bytes; the first four list data buffers grow24 bytes and final grows8. Other mini-block headers still fit8 bytes. Full-batch buffer starts happen to remain identical to V2.1 because 64-byte outer padding absorbs the growth; this is an observed fixture property, not a universal promise. The V2.2 metadata arrays double in size,23 layout messages add the has_large_chunk field, and final constants remove three physical page buffers in total. Relative to V2.1, data ends192 bytes earlier, column metadata is12 bytes longer, and the entire artifact is180 bytes shorter. (rust/lance-encoding/src/encodings/logical/primitive.rs:5751-5910; rust/lance-file/test_data/exact_versions/v2_1.lance@bytes:0-501167; ${ref})

## Both constant scalar representations

Column0's final page has row length1, priority4096, ConstantLayout layers[AllValidItem] and inline_value bytes00100000 (Int32 4096). It has no data buffers and no packed offset/size fields. Column1's final page has the same row coordinates and layers but no inline_value; its one52-byte scalar buffer is[497472,497524), followed by12 H bytes. This absence means out-of-line scalar, not all-null. Decoder dispatch identifies scalar presence from inline_value or1/3 buffers; all-null uses separate paths. (protos/encodings_v2_1.proto:288-322; rust/lance-encoding/src/encodings/logical/primitive.rs:4541-4581; rust/lance-encoding/src/encodings/logical/primitive/constant.rs:130-203; ${entry.path}@bytes:498727-498784; ${entry.path}@bytes:499180-499239)

The Utf8 scalar buffer is UInt32 num_buffers2, then UInt32 lengths8 and32, then an Arrow offsets buffer of two Int32s[0,32], then ASCII value-4096-deterministic-fixture. It has no validity bitmap, schema/type tag or child data. The schema supplies Utf8; framing describes a length1 nonnull Arrow value. This is neither the Variable mini-block offset layout nor the dictionary block framing. encode_scalar_value_buffer requires one nonnull scalar at offset0 without children; try_inline_value requires one value buffer, no children, length<=32. Utf8 has two buffers so uses the framed path even though its string payload is exactly32 bytes. (rust/lance-arrow/src/scalar.rs:14-24; rust/lance-arrow/src/scalar.rs:61-191; rust/lance-encoding/src/encodings/logical/primitive/constant.rs:31-80; ${entry.path}@bytes:497472-497524)

Neither constant page stores repetition/definition streams or counts. A singleton page is constant even if the whole column is not. Constant selection checks the page's visible values; final items has three distinct values so stays mini-block, category retains its dictionary representation, and blob descriptions remain PackedStruct mini-blocks. The observed choices do not prove every singleton or Arrow type is constant-eligible: selection can decline unsupported representation, empty/non-dense/all-null input and empty structs. (rust/lance-encoding/src/encodings/logical/primitive.rs:6196-6355; rust/lance-encoding/src/encodings/logical/primitive.rs:7929-7973; ${entry.path}@bytes:498375-500851)

## Value and level algorithms

For native width T and packed width W, FastLanes uses lanes=1024/T and order=[0,4,2,6,1,5,3,7]. Lane l,row k maps to input index order[floor(k/8)]*16+(k%8)*128+l. Its W bits occupy lane bit positions k*W..(k+1)*W, LSB first; packed native word j is stored at word index lanes*j+l. Packed payload is128*W bytes for1024 padded values. W0 has no payload; W=T still transposes. InlineBitpacking prepends W in a native-width word, with all padded decoded values zero. OutOfLineBitpacking takes W from the nested Flat metadata and packs full1024-level groups without headers; a tail n is padded/packed only if W*(1024-n)<(T-W)*n, otherwise stored raw. The decoder checks all bits and padding. (rust/compression/bitpacking/src/lib.rs:4-172; rust/lance-encoding/src/encodings/physical/bitpacking.rs:44-286; rust/lance-encoding/src/encodings/physical/bitpacking.rs:389-536; ${ref})

Full id pages use Inline32 widths10/11/12/12. Full name pages have eight128-row Variable chunks with Inline16 width1 definition levels; each value buffer has N+1 UInt32 offsets starting4*(N+1), relative to value-buffer start, then concatenated32-byte nonnull strings. Nulls repeat offsets and use def1. Category uses Inline8 width2 keys and Inline16 width1 definitions, except final raw8 key0 with no defs. Each page repeats36-byte dictionary framing: UInt32 bits32,payload_start24,offsets[0,5,9,12],greenbluered; these offsets are relative to payload. Null keys have physical0 and def1, not a fourth null dictionary item. (rust/lance-encoding/src/encodings/physical/binary.rs:30-154; rust/lance-encoding/src/encodings/physical/binary.rs:457-537; ${entry.path}@bytes:0-498048)

List pages have stored child counts2790/2793/2793/2793/3, but level counts2884/2886/2886/2886/3. Full layouts use layers[NullableItem,NullableList]: rep1 starts a row,rep0 continues; def0 valid leaf,def1 null child (physical backing0),def2 null list (no physical value). Final layers[AllValidItem,NullableList] retain rep[1,0,0], inline def width0 and raw Int32 values[4096,8192,12288]. The proto's generalized num_items terminology means level count, whereas this mini-block writer records data.num_values; preserve the distinction. (protos/encodings_v2_1.proto:19-40; rust/lance-encoding/src/repdef.rs:425-644; rust/lance-encoding/src/encodings/logical/primitive.rs:6396-6465; ${entry.path}@bytes:499239-499809)

List value chunks have1024,1024,742/745 slots. Child Inline32 widths are[11,12,12],[13,13,13],[13,14,14],[14,14,14]. Level chunks have1059/1058/767 entries for batch0 and1058/1058/770 for batches1–3. OutOfLine16 widths1(rep)/2(def) use raw tails35/34 after1024 entries in the first two chunks, and padded packed767/770-entry final chunks. Repetition-index UInt64 pairs are[(376,1),(375,2),(273,0)] for batch0,[(375,1),(375,2),(274,0)] for the next three,[(1,0)] for final. Pair means finished rows and leftover level entries in the last partial row; final pair includes the final row. (rust/lance-encoding/src/encodings/logical/primitive.rs:5916-6062; ${entry.path}@bytes:100416-106544; ${entry.path}@bytes:224192-230832; ${entry.path}@bytes:348608-355504; ${entry.path}@bytes:473280-480304; ${entry.path}@bytes:497536-497680)

Blob values remain PackedStruct bits[64,64] with Flat128, inside MiniBlock and outer BlobLayout, both layers[AllValidItem]. Full pages have four256-pair chunks,4096 value bytes plus8 header/padding; final has one24-byte chunk. Descriptions are UInt64(position,size),size31. Position0 is valid nonempty. No VariablePackedStruct, BlobV2, sparse layout, nonconstant general compression or RLE occurs in this fixture, although version2.2 permits additional grammar elsewhere. (rust/lance-encoding/src/encodings/logical/blob.rs:31-228; protos/encodings_v2_1.proto:568-603; ${entry.path}@bytes:500340-500851)

## Change impact and limits

Treat32-bit chunk words separately from16-bit rep/def fields; account for internal padding before comparing offsets. Classify a ConstantLayout by scalar presence and buffer shape, and recover type from schema. Preserve stable bytes as the oracle, even if another encoding produces equivalent values. The [decoder](../tools/analyze-standard-v22-fixture.mjs) and [independent assembler](../tools/verify-standard-v22-reconstruction.mjs) cover artifact content only. All six fixture byte contracts are now available, but source-level codec coverage, full end-to-end recipes and actual runtime compatibility qualification remain incomplete. (rust/lance-file/src/compatibility_tests.rs:232-295; rust/lance-file/src/compatibility_tests.rs:352-399; rust/lance-file/test_data/exact_versions/README.md:10-41)
`;
fs.writeFileSync(path.join(output,module),supplement);
Object.assign(entry,{status:'analyzed',read_ranges:[],analyzed_ranges:[],read_byte_ranges:[[0,entry.size]],analyzed_byte_ranges:analysis.byte_ranges.map(x=>x.slice(0,2)),analysis_record:'analysis/iteration-070-batch.json',analysis_iteration:70,byte_artifact:analysis.byte_artifact,byte_evidence:analysis.byte_evidence});const issues=checkBinary(entry,analysis,doc);if(issues.length)throw Error(JSON.stringify(issues));
write('analysis/iteration-070-batch.json',{iteration:70,previous_goal_turn_classification:'progress',files:[analysis]});manifest.totals=totals(manifest.files);write('MANIFEST.json',manifest);
write('analysis/iteration-070-read-evidence.json',{iteration:70,files:[{path:r.source,read_byte_ranges:[[0,r.size]],regions:r.regions.length,counts:r.counts}],review:'Complete25-page metadata catalog, all71 chunk widths/counts/stream lengths/metadata words and intervals, both constants including complete52-byte framing, six schema fields/tags, payload/null/offset/dictionary/blob meanings and all padding/tail zeros. Parser reads/checks every source byte and row before status update. No truncated source or metadata output accepted.',tooling_notes:['Adapted the already source-backed V2.1 KB decoder for actual V2.2 constant pages,32-bit metadata/value sizes and all observed positions; did not assume unchanged layouts.','No source runtime or generator executed.'],repository_runtime_executed:false});console.log({regions:r.regions.length,bytes:r.size,totals:manifest.totals});
