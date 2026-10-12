import fs from 'node:fs';
import path from 'node:path';
import {root,output,totals,digest} from './inventory.mjs';
import {checkBinary} from './binary-integrity.mjs';
const read=p=>JSON.parse(fs.readFileSync(path.join(output,p))),write=(p,v)=>fs.writeFileSync(path.join(output,p),JSON.stringify(v,null,2)+'\n');
const report=read('analysis/iteration-066-v1-fixture.json'),m=read('MANIFEST.json'),e=m.files.find(e=>e.path===report.source);
if(e.status!=='pending'||digest(fs.readFileSync(path.join(root,e.path)))!==e.sha256)throw Error('Expected unchanged pending fixture');
const references={
 'int32-values':'rust/lance-file/test_data/exact_versions/datagen.rs:37-42; rust/lance-file/src/versions/v1/encoding/plain.rs:91-117',
 'utf8-values':'rust/lance-file/test_data/exact_versions/datagen.rs:37-42; rust/lance-file/src/versions/v1/encoding/binary.rs:49-89',
 'absolute-int64-offsets':'rust/lance-file/src/versions/v1/encoding/binary.rs:49-89; rust/lance-file/src/versions/v1/encoding/binary.rs:165-178; rust/lance-file/test_data/exact_versions/datagen.rs:37-100',
 'relative-int32-list-offsets':'rust/lance-file/src/versions/v1/writer/mod.rs:491-537; rust/lance-file/src/compatibility_tests.rs:100-115',
 'int32-list-child-values':'rust/lance-file/src/versions/v1/encoding/plain.rs:91-117; rust/lance-file/src/compatibility_tests.rs:100-115',
 'int8-dictionary-keys':'rust/lance-file/src/versions/v1/encoding/dictionary.rs:36-57; rust/lance-file/src/compatibility_tests.rs:115-135',
 'binary-values':'rust/lance-file/test_data/exact_versions/datagen.rs:69-100; rust/lance-file/src/versions/v1/encoding/binary.rs:49-89',
 'page-table-cell':'protos/file.proto:41-61; rust/lance-file/src/versions/v1/page_table.rs:36-144',
 'dictionary-utf8-values':'rust/lance-file/test_data/exact_versions/datagen.rs:54-68; rust/lance-file/src/versions/v1/encoding.rs:93-130',
 'dictionary-absolute-offsets':'rust/lance-file/src/versions/v1/encoding.rs:93-130; rust/lance-file/src/versions/v1/encoding/binary.rs:49-89',
 'protobuf-frame-length':'rust/lance-io/src/traits.rs:83-93',
 'metadata-protobuf':'protos/file.proto:24-93; rust/lance-file/src/versions/v1/writer/mod.rs:627-651',
 'footer-metadata-pointer':'rust/lance-io/src/traits.rs:95-106; rust/lance-file/src/versions/v1/writer/mod.rs:643-651',
 'footer-major':'rust/lance-io/src/traits.rs:95-106',
 'footer-minor':'rust/lance-io/src/traits.rs:95-106',
 'footer-magic':'rust/lance-io/src/traits.rs:95-106'
};
const analysis={path:e.path,module:'L1-modules/rust-lance-file-binary-fixtures.md',reviewed:true,role:'Pinned non-self-describing V1 compatibility artifact; five batches, six physical fields, dictionary block, metadata and footer. Entire byte sequence decoded and checked offline.',limits:'No source runtime/test/generator executed. External input/schema and null intent derive from reviewed generator/test source. Byte inspection is not runtime qualification or proof that the pinned commit was a released version.',byte_order:'zero-based half-open',byte_artifact:'evidence/binary/v1.lance',byte_evidence:'analysis/iteration-066-v1-fixture.json',decoded_artifact:'evidence/binary/v1-decoded-rows.json',ranges:[],byte_ranges:report.regions.map(r=>[r.start,r.end,r.description])};
write('analysis/iteration-066-batch.json',{iteration:66,previous_goal_turn_classification:'progress',files:[analysis]});
const destination=path.join(output,e.l2_document);fs.mkdirSync(path.dirname(destination),{recursive:true});
const link=(label,target)=>`[${label}](${path.relative(path.dirname(destination),path.join(output,target))})`;
let doc=`# ${e.path}\n\n**Analyzed binary: all ${e.size.toLocaleString('en-US')} bytes; line count is null.** Coordinates are zero-based half-open [start,end). ${analysis.role}\n\n${link('Module contracts',analysis.module)} | ${link('Format specification','L3-symbols/format-spec.md')} | ${link('Development workflow','L4-crosscutting/build-and-test.md')} | ${link('Inventory','MANIFEST.json')}\n\nSHA-256: \`${e.sha256}\`. ${analysis.limits}\n\n${link('Original bytes',analysis.byte_artifact)}, ${link('all decoded rows',analysis.decoded_artifact)}, ${link('complete offsets, cells, counts and region hashes',analysis.byte_evidence)}, ${link('offline parser','tools/inspect-v1-fixture.mjs')}. The source appendix for this binary is the exact preserved byte artifact, not an invented text conversion.\n\n## Contract and full layout\n\nThe generator writes4097 rows in batches1024/1024/1024/1024/1, with no embedded schema and no statistics. The six physical field IDs are id0, name1, items2, items.item3, category4 and blob5; types and field names are external. The file has no callable symbols. Producer, consumer, exact formulas, null-loss rules and extension constraints are fully documented in the linked module. (rust/lance-file/test_data/exact_versions/datagen.rs:25-100; rust/lance-file/test_data/exact_versions/datagen.rs:133-157; rust/lance-file/src/compatibility_tests.rs:467-524)\n\nThe complete physical partition has78 contiguous regions:40 batch buffers,30 page-table cells,2 dictionary regions,2 framed-protobuf regions and4 footer fields. There are no unexplained/padding bytes. Table dimensions are6x5; metadata has batch offsets[0,1024,2048,3072,4096,4097], page-table position386572, absent manifest_position(default0) and absent statistics. Footer(0,2,LANC) points to frame387096. (${e.path}@bytes:0-${e.size})\n\n## Page table\n\n| Field | Batch | Cell byte interval | Stored position | Logical length |\n|---|---|---|---|---|\n`;
for(const p of report.pages)doc+=`| ${p.field_id} (${p.field_name}) | ${p.batch} | [${p.cell},${p.cell+16}) | ${p.position} | ${p.logical_length} |\n`;
doc+=`\nCells are field-major pairs of signed Int64, little-endian in this fixture. Length is not a byte count; list offsets have N+1 entries. (${e.path}@bytes:386572-387052; rust/lance-file/src/versions/v1/page_table.rs:36-144)\n\n## Every byte region\n`;
for(const r of report.regions){
 doc+=`\n### Bytes ${r.start}-${r.end}\n\n${r.description}\n\nEvidence: ${e.path}@bytes:${r.start}-${r.end}. Interpretation: ${references[r.kind]}. Region length: ${r.length} bytes; SHA-256: \`${r.sha256}\`.\n`;
 if(r.values&&r.values.length<=6)doc+=`\nDecoded values: \`${JSON.stringify(r.values)}\`.\n`;
 if(r.hex)doc+=`\nComplete payload hex: \`${r.hex}\`.\n`;
}
fs.writeFileSync(destination,doc);
Object.assign(e,{status:'analyzed',read_ranges:[],analyzed_ranges:[],read_byte_ranges:[[0,e.size]],analyzed_byte_ranges:analysis.byte_ranges.map(r=>r.slice(0,2)),analysis_record:'analysis/iteration-066-batch.json',analysis_iteration:66,byte_artifact:analysis.byte_artifact,byte_evidence:analysis.byte_evidence});
const issues=checkBinary(e,analysis,doc);if(issues.length)throw Error(JSON.stringify(issues));
m.totals=totals(m.files);m.method.binary='Binary files retain null line counts. Analyzed binaries require authored contiguous zero-based half-open byte annotations, semantic inspection evidence and an identical preserved byte artifact; hash equality alone is insufficient.';write('MANIFEST.json',m);
write('analysis/iteration-066-read-evidence.json',{iteration:66,source:e.path,representation:'binary',read_byte_ranges:[[0,e.size]],semantic_regions:report.regions.length,semantic_bytes:report.coverage.bytes,source_sha256:e.sha256,evidence:analysis.byte_evidence,decoded_rows:analysis.decoded_artifact,full_region_descriptions_manually_reviewed:true,limits:analysis.limits,tooling_notes:['Initial workflow path lookup used the skill directory; the existing KB workflow was then read fully.','Initial writer.rs lookup was corrected to versions/v1/writer/mod.rs.','A carried-state output and broad KB-status search were truncated and supplied no new source coverage.','The second parser stdout was truncated after a one-word signedness correction; the first full report and all78 descriptions had already been read, and the correction was inspected directly.']});
console.log({document:e.l2_document,bytes:e.size,regions:report.regions.length,totals:m.totals});
