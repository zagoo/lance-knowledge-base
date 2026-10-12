import fs from 'node:fs';
import {root,linesOf} from './inventory.mjs';
const specs=[
 [1,'rust/lance-core/src/cache/codec.rs',55,108],
 [2,'rust/lance-table/src/utils/stream.rs',1424,1473],
 [3,'rust/lance-table/src/transaction/manifest_build.rs',940,965],
 [3,'rust/lance-table/src/transaction/row_version.rs',275,297],
 [4,'rust/lance-table/src/transaction/manifest_build.rs',89,127],
 [8,'rust/lance-core/src/datatypes/field.rs',130,168],
 [8,'rust/lance-core/src/datatypes/schema.rs',8,19],
 [10,'protos/fragment_metadata.proto',423,455],
 [12,'rust/lance-table/src/utils/stream.rs',900,945],
 [13,'rust/lance-core/src/cache/key.rs',8,29],
 [13,'rust/lance-core/src/cache/key.rs',298,311],
 [14,'rust/lance-table/src/io/commit.rs',298,338],
 [14,'rust/lance-table/src/io/commit.rs',1057,1136],
 [17,'rust/lance-table/src/system_index/frag_reuse/metadata.rs',9,35],
 [18,'rust/lance-table/src/rowids/segment.rs',368,402],
 [18,'rust/lance-table/src/rowids.rs',300,330],
 [3,'rust/lance-table/src/rowids/version.rs',654,680],
 [13,'rust/lance-core/src/cache/key.rs',56,92],
 [13,'rust/lance-core/src/cache/key.rs',311,315]
];
const p='verification/iteration-056-supplemental-source.json';
const old=fs.existsSync(p)?JSON.parse(fs.readFileSync(p)):[];
for(const [id,path,start,end] of specs.slice(Number(process.argv[2]),Number(process.argv[3]))){
 const source=linesOf(fs.readFileSync(root+'/'+path,'utf8'));
 const evidence=source.slice(start-1,end).map((s,i)=>`${start+i} | ${s}`).join('\n');
 console.log(`\nCLAIM ${id} ${path}:${start}-${end}\n${evidence}`);
 const entry={id,path,start,end,read_at:new Date().toISOString(),evidence};
 const i=old.findIndex(e=>e.id===id&&e.path===path&&e.start===start);
 if(i<0)old.push(entry);else old[i]=entry;
}
fs.writeFileSync(p,JSON.stringify(old,null,2)+'\n');
