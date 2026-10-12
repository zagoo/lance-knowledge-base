import fs from 'node:fs';import {root,linesOf} from './inventory.mjs';
const specs=[
 [1,'protos/fragment_metadata.proto',34,53],
 [2,'rust/lance-file/src/versions/v2_1/reader.rs',161,192],
 [2,'rust/lance-file/src/versions/v2_1/reader.rs',215,224],
 [3,'rust/lance-table/src/transaction/operation.rs',37,220],
 [5,'rust/lance-core/src/datatypes/schema.rs',624,663],
 [5,'rust/lance-core/src/datatypes/field.rs',768,806],
 [5,'rust/lance-core/src/datatypes/field.rs',267,310],
 [8,'rust/lance-core/src/cache/mod.rs',184,202],
 [8,'rust/lance-core/src/cache/moka.rs',23,47],
 [9,'rust/lance-core/src/utils/bloomfilter/sbbf.rs',166,192],
 [11,'rust/lance-core/src/utils/row_addr_remap.rs',99,130],
 [12,'rust/lance-file/src/datatypes.rs',9,23],
 [14,'rust/lance-table/src/transaction/manifest_build.rs',4419,4465],
 [17,'rust/lance-core/src/utils/tempfile.rs',240,248],
 [18,'rust/lance-table/src/format/key_existence.rs',282,310],
 [18,'rust/lance-table/src/format/key_existence.rs',345,390],
 [20,'rust/lance-core/src/deepsize.rs',37,45],
 [11,'rust/lance-core/src/utils/row_addr_remap.rs',125,140],
 [12,'rust/lance-file/src/datatypes.rs',1,8],
 [14,'rust/lance-table/src/transaction/manifest_build.rs',4370,4418]
];
const p='verification/iteration-057-supplemental-source.json',old=fs.existsSync(p)?JSON.parse(fs.readFileSync(p)):[];
for(const [id,path,start,end]of specs.slice(Number(process.argv[2]),Number(process.argv[3]))){const src=linesOf(fs.readFileSync(root+'/'+path,'utf8')),evidence=src.slice(start-1,end).map((l,i)=>`${start+i} | ${l}`).join('\n');console.log(`\nCLAIM ${id} ${path}:${start}-${end}\n${evidence}`);const e={id,path,start,end,read_at:new Date().toISOString(),evidence};const i=old.findIndex(s=>s.id===id&&s.path===path&&s.start===start);if(i<0)old.push(e);else old[i]=e;}
fs.writeFileSync(p,JSON.stringify(old,null,2)+'\n');
