import fs from 'node:fs';
import path from 'node:path';
import {root,output,digest,totals} from './inventory.mjs';
import {checkBinary} from './binary-integrity.mjs';
const read=p=>JSON.parse(fs.readFileSync(path.join(output,p))),write=(p,v)=>fs.writeFileSync(path.join(output,p),JSON.stringify(v,null,2)+'\n');
const r=read('analysis/iteration-069-v2_1-fixture.json'),manifest=read('MANIFEST.json'),entry=manifest.files.find(e=>e.path===r.source),module='L1-modules/rust-lance-file-standard-v21-fixture.md';
if(entry.status!=='pending'||digest(fs.readFileSync(path.join(root,entry.path)))!==entry.sha256)throw Error('Expected unchanged pending V2.1 artifact');
const analysis={path:entry.path,module,reviewed:true,role:'Pinned standard V2_1 binary fixture: 4,097 rows, five physical columns, 25 pages and 73 mini-blocks. All payloads, FastLanes packed bits and zero tails, repetition/definition levels, indices, offsets, dictionary keys, blob descriptions, schema/metadata tags, alignment and footer bytes are interpreted. No callable symbols.',limits:'Offline KB-side interpretation only. No Lance runtime, build or generator was executed. Complete encoding-crate analysis and standard V2_2 fixture remain pending. This analysis does not independently qualify the historical baseline provenance.',byte_order:'zero-based half-open',byte_artifact:'evidence/binary/v2_1.lance',byte_evidence:'analysis/iteration-069-v2_1-fixture.json',decoded_artifact:'evidence/binary/v2_1-decoded-rows.json',ranges:[],byte_ranges:r.regions.map(x=>[x.start,x.end,x.note])};
const cite=`${entry.path}@bytes:0-501167`,dest=path.join(output,entry.l2_document),link=(label,target)=>`[${label}](${path.relative(path.dirname(dest),path.join(output,target))})`;
let doc=`# ${entry.path}

**Analyzed binary: all 501,167 bytes; line_count=null.** Intervals are zero-based and half-open. ${analysis.role}

${link('Module contract',module)} · ${link('Format specification','L3-symbols/format-spec.md')} · ${link('Behavior contracts','L3-symbols/behavior-contracts.md')} · ${link('Cookbook','L4-crosscutting/cookbook.md')} · ${link('Coverage ledger','MANIFEST.json')}

SHA-256: \`${entry.sha256}\`. ${analysis.limits}

${link('Preserved original bytes',analysis.byte_artifact)}, ${link('all decoded rows',analysis.decoded_artifact)}, ${link('full page/chunk/level/wire catalog',analysis.byte_evidence)}, ${link('semantic decoder','tools/analyze-standard-v21-fixture.mjs')}, ${link('independent expected-byte assembler','tools/verify-standard-v21-reconstruction.mjs')}.

## Whole-file semantics

For rows r=0..4096: id=r; name=null when r%7=0, otherwise value-NNNN-deterministic-fixture (32 ASCII bytes); items=null when r%11=0, otherwise [r,(null if r%5=0 else 2*r),3*r]; category=null when r%13=0, otherwise [red,green,blue][r%3]; blob is always blob-NNNN-deterministic-payload (31 ASCII bytes). NNNN is r padded to four decimal digits. Null counts: name 586, list 373, child 745, category 316; 11,172 physical children and 11,545 list level entries. No empty lists or null/empty blobs occur. (rust/lance-file/test_data/exact_versions/datagen.rs:37-99; ${cite})

Five batches contain 1024/1024/1024/1024/1 rows. Each writes out-of-line blobs first, then one page per physical column in id/name/items/category/blob order. Blob bases are 0,123648,247936,372608,497408; every 31-byte payload has 33 H (0x48) alignment bytes. Page buffers likewise align separately to 64 bytes with H padding; metadata sizes exclude padding. Mini-block components align to 8 with 0xFE. Data region [0,498240) consists of 233414 page-buffer bytes, 2618 page-buffer padding bytes, 127007 blob bytes and 135201 blob padding bytes. Page-buffer bytes include the mini-block internal headers/padding, dictionary blocks and repetition indices. (rust/lance-file/test_data/exact_versions/datagen.rs:102-131; rust/lance-encoding/src/encoder.rs:125-165; rust/lance-encoding/src/encodings/logical/primitive.rs:5751-5910; ${entry.path}@bytes:0-498240)

The unframed descriptor [498240,498567) has six flattened field IDs but only five physical columns: parent items and child item share column2. Column metadata [498567,501031), CMO [501031,501111), GBO [501111,501127), footer [501127,501167). Footer is A498567,B501031,C501111,global_count1,column_count5,major2,minor1,LANC. Every column uses ColumnEncoding Values; page Any type is /lance.encodings21.PageLayout. Blob wrapping occurs in PageLayout. Priorities are global batch row starts 0/1024/2048/3072/4096. (protos/file2.proto:40-93; protos/file2.proto:138-216; protos/encodings_v2_1.proto:288-358; ${entry.path}@bytes:498240-501167)

## Complete page catalog

Metadata and buffer intervals below plus the chunk table and authored regions account for every byte. Each page's exact nested protobuf fields, all rep/def arrays, stored values, string offsets and description pairs are retained in the JSON catalog. (protos/encodings_v2_1.proto:49-162; ${entry.path}@bytes:498567-501031})

| Column/page | Rows | Metadata | Buffer starts | Unpadded sizes | Stored items | Level entries | Chunks |
|---|---|---|---|---|---|---|---|
`;
for(const p of r.page_catalog){const e=p.layout.inner??p.layout;doc+=`| ${p.column}/${p.page} | [${p.row_start},${p.row_end}) | [${p.metadata_start},${p.metadata_end}) | ${p.offsets} | ${p.sizes} | ${e.num_items} | ${p.chunks.reduce((s,c)=>s+c.num_levels,0)} | ${p.chunks.length} |\n`;}
doc+=`\n## Complete mini-block catalog

Packed word low four bits give log2(values), except 0 means the remaining page values. A full final chunk may keep a nonzero log (all full blob chunks use 8); do not require a sentinel on the final chunk. High 12 bits store chunk_bytes/8-1. Headers contain UInt16 num_levels, optional rep_size, optional def_size and one value-buffer size, all little-endian. Each component then pads to 8 bytes. Chunk values count visible physical slots, including null child backing; level counts also include invisible null-list markers. (rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:95-126; rust/lance-encoding/src/encodings/physical/value.rs:83-111; rust/lance-encoding/src/encodings/logical/primitive.rs:5751-5910; ${cite})

| Column/page/chunk | Bytes | Metadata offset / word / log | Values | Levels | Rep / def / value bytes |
|---|---|---|---|---|---|
`;
for(const p of r.page_catalog)for(const c of p.chunks)doc+=`| ${p.column}/${p.page}/${c.index} | [${c.start},${c.end}) | ${c.metadata_offset} / ${c.metadata_word} / ${c.log_num_values} | ${c.num_values} | ${c.num_levels} | ${c.rep_size} / ${c.def_size} / ${c.value_size} |\n`;
doc+='\n## Every byte region\n';
for(const region of r.regions){let refs='protos/file2.proto:40-93; protos/file2.proto:138-216';
 if(['chunk metadata','chunk header','chunk padding'].includes(region.kind))refs='rust/lance-encoding/src/encodings/logical/primitive.rs:5751-5910';
 else if(region.kind==='levels')refs='rust/lance-encoding/src/repdef.rs:425-644; rust/lance-encoding/src/encodings/physical/bitpacking.rs:189-286; rust/lance-encoding/src/encodings/physical/bitpacking.rs:389-536';
 else if(region.kind==='values')refs='rust/compression/bitpacking/src/lib.rs:4-172; rust/lance-encoding/src/encodings/physical/binary.rs:30-154; rust/lance-encoding/src/encodings/logical/blob.rs:31-228';
 else if(region.kind==='dictionary')refs='rust/lance-encoding/src/encodings/physical/binary.rs:457-537; rust/lance-encoding/src/encodings/logical/primitive/dict.rs:30-111';
 else if(region.kind==='repetition index')refs='rust/lance-encoding/src/encodings/logical/primitive.rs:5916-6062';
 else if(['page metadata','column envelope'].includes(region.kind))refs='protos/file2.proto:138-216; protos/encodings_v2_1.proto:49-162; protos/encodings_v2_1.proto:288-358; protos/encodings_v2_1.proto:410-675';
 else if(region.kind==='blob payloads'||region.kind==='page buffer padding')refs='rust/lance-encoding/src/encoder.rs:125-165; rust/lance-encoding/src/encodings/logical/blob.rs:105-203';
 else if(region.kind.startsWith('descriptor')||region.kind==='schema field')refs='protos/file.proto:9-22; protos/file.proto:123-223';
 doc+=`\n### Bytes ${region.start}-${region.end}\n\n${region.note}\n\nEvidence: ${entry.path}@bytes:${region.start}-${region.end}. Interpretation: ${refs}. SHA-256: \`${region.sha256}\`.\n`;
}
doc=doc.replace('@bytes:498567-501031})','@bytes:498567-501031)');fs.writeFileSync(dest,doc);
const supplement=`# Standard V2_1 fixture: complete structural byte contract

Scope: all **501,167 bytes**, 4,097 rows, 25 pages, 73 mini-blocks and 575 contiguous authored regions. [Crate](rust-lance-file.md), [complete L2 map](../${entry.l2_document}), [format specification](../L3-symbols/format-spec.md), [cookbook](../L4-crosscutting/cookbook.md), [orientation](../L0-orientation.md). Standard V2_2 and complete encoding implementations remain pending. No Lance runtime was executed.

## Schema and physical layout

The deterministic row formulas and all null counts are preserved in L2. Six flattened schema Fields describe five logical roots: id0:Int32 nonnullable, name1:Utf8 nullable, items2:List nullable with item3:Int32 nullable, category4:Dictionary(Int8,Utf8) nullable, blob5:LargeBinary nullable. Parent IDs are -1 except item parent2. Metadata requests name compression none, dictionary values compression none and blob true. Field.type is absent/default0; deprecated encoding tags Plain1/VarBinary2/Dictionary3 persist. Category has an empty deprecated Dictionary message. Page layout, not these deprecated fields, controls decoding. All dictionary items are nonnull; null keys have separate definition levels. (rust/lance-file/test_data/exact_versions/datagen.rs:37-99; protos/file.proto:123-223; ${entry.path}@bytes:498240-498567)

| Region | Half-open bytes | Contract |
|---|---|---|
| Data and alignment | 0–498240 | Five blob-first batches, then columns0..4 |
| FileDescriptor | 498240–498567 | Schema321 bytes plus row count4097 |
| Column0 id | 498567–498984 | 417 bytes, five pages |
| Column1 name | 498984–499449 | 465 bytes, five pages |
| Column2 items | 499449–500009 | 560 bytes, five pages |
| Column3 category | 500009–500530 | 521 bytes, five pages |
| Column4 blob | 500530–501031 | 501 bytes, five pages |
| CMO | 501031–501111 | Five little-endian UInt64(position,size) pairs |
| GBO | 501111–501127 | One pair(498240,327) |
| Footer | 501127–501167 | A498567,B501031,C501111,globals1,columns5,version(2,1),LANC |

All column envelopes are Values, with a 43-byte direct Any wrapper. Every page uses /lance.encodings21.PageLayout; blob nesting is page-level Blob(inner MiniBlock,layers[AllValidItem]). Priorities are global row starts 0,1024,2048,3072,4096. Each batch emits 1024 rows except the last one. Buffer positions are absolute and 64-byte aligned; size excludes trailing 0x48. Blob bases0,123648,247936,372608,497408 each contain fixed64-byte records:31 payload bytes plus33 padding bytes. (protos/file2.proto:138-216; protos/encodings_v2_1.proto:288-358; rust/lance-encoding/src/encodings/logical/blob.rs:74-103; ${cite})

## Mini-block framing and count semantics

Buffer0 is a UInt16 chunk-metadata array, buffer1 concatenates chunks. Each metadata word stores log_num_values in low4 bits and chunk_bytes/8-1 in high12. Nonzero log gives2^log physical slots; log0 gives remaining physical slots. The last chunk need not use0: each full blob page has four256-value chunks whose codes all equal8. The comment in MiniBlockChunk says the final chunk should use0, but ValueEncoder permits all-full partitions with no special remainder. Do not reject valid final full chunks. V2.1 has_large_chunk is absent/false, so metadata and value sizes use UInt16. Chunk size includes internal alignment; maximum representable size is32768. (rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:95-126; rust/lance-encoding/src/encodings/physical/value.rs:83-111; rust/lance-encoding/src/encodings/logical/primitive.rs:5751-5910; ${entry.path}@bytes:107136-123616)

A chunk header has num_levels UInt16, rep_size UInt16 if rep encoding exists, def_size UInt16 if def encoding exists, then one value-buffer-size UInt16. Header, rep, def and values each independently pad to8 with0xFE. num_buffers=1 excludes rep/def buffers. num_levels=0 when both streams are absent in this fixture; it does not mean zero data. Dictionary and repetition-index buffers follow buffer1 when present. (rust/lance-encoding/src/encodings/logical/primitive.rs:704-803; rust/lance-encoding/src/encodings/logical/primitive.rs:5751-5910; ${cite})

The proto introduction defines num_items as the rep/def vector length, but encode_miniblock sets it to data.num_values(). Here list pages declare2790/2793/2793/2793/3 stored child slots while their level counts are2884/2886/2886/2886/3. Null lists add373 invisible markers; null children still own physical zero-backed slots. Use per-chunk num_levels for level decoding and MiniBlock.num_items for stored-value accounting in this fixture. Layers are leaf-first; [NullableItem,NullableList] makes def0 valid leaf,1 null leaf,2 null list. rep1 starts a list and rep0 continues it. The final page uses [AllValidItem,NullableList], raw rep[1,0,0], three def0 levels encoded with an inline width0 header, and values[4096,8192,12288]. (protos/encodings_v2_1.proto:19-40; rust/lance-encoding/src/repdef.rs:425-644; rust/lance-encoding/src/encodings/logical/primitive.rs:6396-6465; ${entry.path}@bytes:499449-500009; ${entry.path}@bytes:497728-497872)

## Compression and every packed bit

FastLanes is not simple consecutive LSB packing of input values. For native width T and compressed width W, define lanes=1024/T and order=[0,4,2,6,1,5,3,7]. For lane l and row k=0..T-1, input index=order[floor(k/8)]*16+(k%8)*128+l. Pack its W bits into lane-stream position k*W, least significant bit first; packed native word j for that lane is stored at word index lanes*j+l. Native words are little-endian in this fixture. Output is128*W bytes for1024 padded values; W0 has no packed payload, W=T still applies the transpose. The decoder checks every unused padded value is zero. (rust/compression/bitpacking/src/lib.rs:4-172; rust/lance-encoding/src/encodings/physical/bitpacking.rs:44-286; ${cite})

InlineBitpacking prepends W as a native-width word (1/2/4 bytes here) to the packed block. id pages use widths10/11/12/12, then a raw32-bit final value. List child chunks use widths [11,12,12], [13,13,13], [13,14,14], [14,14,14], then raw32 values. Category uses inline native8 width2 plus a separate inline native16 width1 definition stream; final key is raw8 and has no def stream. Name definition chunks use inline native16 width1 and pad128 actual levels to1024 values. The final list def stream consists only of a two-byte width0 header. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:44-189; ${entry.path}@bytes:0-498240)

List repetition uses OutOfLineBitpacking(native16,width1), definition uses(native16,width2). Complete groups pack1024 levels without inline headers. A tail of n levels is padded and packed only when W*(1024-n)<(16-W)*n; otherwise it stores raw UInt16s. First two chunks of each full list page have1058 levels (first chunk of batch0 has1059):1024 packed levels plus34/35 raw levels. Third chunks have767/770 levels and use padded packed blocks. Decoder infers raw tail from exact byte length. Null children have zero physical backing, with def1 retaining null semantics. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:389-536; ${entry.path}@bytes:100480-106448; ${entry.path}@bytes:224256-230736; ${entry.path}@bytes:348672-355408; ${entry.path}@bytes:473344-480208)

## Strings, dictionaries, lists and blobs

Names use eight128-row Variable chunks per full page and one1-row final chunk. Each value buffer stores N+1 UInt32 offsets including first4*(N+1), relative to the value buffer start, followed by the concatenated nonnull32-byte strings. A null string has equal adjacent offsets plus def1. Payload padding is to4 bytes using0x48 (zero bytes of such padding in this fixture); the outer mini-block uses0xFE to8. Full value buffers are4004 or4036 bytes and whole chunks4152 or4184 bytes. (rust/lance-encoding/src/encodings/physical/binary.rs:30-154; ${entry.path}@bytes:66944-100384)

Category buffer2 repeats the same36-byte dictionary on every page: UInt32 bits_per_offset32,UInt32 payload_start24,UInt32 offsets[0,5,9,12],ASCII greenbluered. These offsets are relative to payload, unlike Variable mini-block offsets. Dictionary keys map0 green,1 blue,2 red; a null key uses physical0 and separate def1. No fourth null dictionary item exists. normalize_dict_nulls places dictionary-value nulls into key validity when needed; this fixture's dictionary values are already nonnull. (rust/lance-encoding/src/encodings/physical/binary.rs:457-537; rust/lance-encoding/src/encodings/logical/primitive/dict.rs:30-111; ${entry.path}@bytes:106560-107108; ${entry.path}@bytes:497920-498084)

List buffer2 is a depth1 repetition index of UInt64(rows_finished,leftover_levels) pairs. Batch0 stores[(376,1),(375,2),(273,0)]; batches1–3 store[(375,1),(375,2),(274,0)]; final stores[(1,0)]. Values chunks have1024,1024,742/745 stored children. A leftover counts level entries in the last partial row, including its start; a row starting at the next chunk transfers the previous leftover into a completed row. Final chunk counts its last row and has zero leftover. The index counts top-level rows, not leaf values or list offsets. (rust/lance-encoding/src/encodings/logical/primitive.rs:5916-6062; ${entry.path}@bytes:106496-106544; ${entry.path}@bytes:230784-230832; ${entry.path}@bytes:355456-355504; ${entry.path}@bytes:480256-480304; ${entry.path}@bytes:497856-497872)

Blob inner values use PackedStruct bits[64,64] with Flat128, storing little-endian(position,size) pairs. Full pages have four256-description chunks (4096 value bytes plus8 header/padding bytes); the last page has one24-byte chunk with a16-byte description. Outer BlobLayout retains original definition interpretation while descriptor layout is AllValidItem. All descriptions have size31; first position0 is valid. General null/empty blob conventions in the structural encoder are not exercised by this fixture and differ from legacy position1 null conventions. This file does not use BlobV2. (rust/lance-encoding/src/encodings/logical/blob.rs:31-228; ${entry.path}@bytes:107136-123616; ${entry.path}@bytes:498112-498200)

## Change impact and validation boundary

Use the L2 page/chunk/region catalogs to classify exact-byte differences before changing a codec: native lane transpose, count units, level slicing, raw-tail heuristic, sentinel handling, two string offset bases, padding scope, dictionary null placement and page-level blob wrapping are all observable. The pinned stable fixture remains an oracle; do not regenerate it to mask a writer mismatch. The [semantic decoder](../tools/analyze-standard-v21-fixture.mjs) and independent [assembler](../tools/verify-standard-v21-reconstruction.mjs) run only on the KB side. Full current/historical compatibility harness execution and complete encoding extension recipes remain unverified. (rust/lance-file/src/compatibility_tests.rs:232-295; rust/lance-file/src/compatibility_tests.rs:352-399; rust/lance-file/test_data/exact_versions/README.md:10-41)
`;
fs.writeFileSync(path.join(output,module),supplement);
Object.assign(entry,{status:'analyzed',read_ranges:[],analyzed_ranges:[],read_byte_ranges:[[0,entry.size]],analyzed_byte_ranges:analysis.byte_ranges.map(x=>x.slice(0,2)),analysis_record:'analysis/iteration-069-batch.json',analysis_iteration:69,byte_artifact:analysis.byte_artifact,byte_evidence:analysis.byte_evidence});
const issues=checkBinary(entry,analysis,doc);if(issues.length)throw Error(JSON.stringify(issues));write('analysis/iteration-069-batch.json',{iteration:69,previous_goal_turn_classification:'progress',files:[analysis]});manifest.totals=totals(manifest.files);write('MANIFEST.json',manifest);
write('analysis/iteration-069-read-evidence.json',{iteration:69,files:[{path:r.source,read_byte_ranges:[[0,r.size]],semantic_regions:r.regions.length,counts:r.counts}],manually_reviewed:'Complete compact25-page metadata table, all73 chunk widths/counts/stream lengths, all six schema fields and tags, all family semantics, decoding algorithms and row/count formulas. Parser examines every byte, validates all rows, all rep/def/keys/offsets/descriptors and all padding/tail zeros; complete575-region authored map retained.',tooling_notes:['Initial broad proto/search and verbose metadata output were truncated; bounded proto reads and complete compact25-page table recovered omitted material.','One combined resumed source/tooling output was truncated; bitpacking465-584 and kernel96-172 were immediately reread completely in bounded output. Earlier repdef410-650 and primitive excerpts were fully visible.','KB tooling/state outputs were sometimes truncated; no source read coverage was inferred from those.','Incorrect tentative path physical/basic.rs was absent; located and read physical/value.rs.','Parser initially required log0 on the last chunk; actual full blob chunks and ValueEncoder83-111 show positive final log is valid. Corrected parser before ledger status update; all73 chunks now pass.'],repository_runtime_executed:false});
console.log({regions:r.regions.length,bytes:r.size,totals:manifest.totals});
