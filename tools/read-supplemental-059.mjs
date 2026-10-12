import fs from 'node:fs';
import {root,linesOf} from './inventory.mjs';
const ranges=[
 ['rust/lance-table/src/system_index/frag_reuse/gate.rs',282,398],
 ['rust/lance-table/src/transaction/operation.rs',39,248],
 ['rust/lance-table/src/transaction/conflicts.rs',821,869],
 ['rust/lance-core/src/cache/key.rs',305,316],
 ['rust/lance-table/src/feature_flags.rs',128,206],
 ['rust/lance-table/src/transaction/manifest_build.rs',1700,1728],
 ['rust/lance-table/src/transaction/manifest_build.rs',1890,1943],
 ['rust/lance-core/src/utils/cpu.rs',99,156],
 ['rust/lance-core/src/utils/cpu.rs',211,306],
 ['rust/lance-core/src/error.rs',602,620],
 ['rust/lance-core/src/error.rs',751,774],
 ['rust/lance-core/src/utils/bloomfilter/sbbf.rs',262,291],
 ['rust/lance-core/src/deepsize.rs',1,45],
 ['rust/lance-table/src/transaction/test_support.rs',47,72],
 ['rust/lance-core/src/utils/deletion.rs',1,42],
 ['rust/lance-core/src/utils/futures.rs',371,515],
 ['rust/lance-core/src/utils/futures.rs',516,664],
 ['rust/lance-core/src/cache/mod.rs',281,324],
 ['rust/lance-core/benches/cache_keys.rs',15,100]
];
const dest='verification/iteration-059-supplemental-source.json';
const records=fs.existsSync(dest)?JSON.parse(fs.readFileSync(dest)):[];
for(let i=Number(process.argv[2]);i<Number(process.argv[3]);i++){
 const [path,start,end]=ranges[i];
 const source=linesOf(fs.readFileSync(root+'/'+path,'utf8'));
 if(end>source.length)throw Error('out of range '+path);
 const evidence=source.slice(start-1,end).map((line,j)=>`${start+j} | ${line}`).join('\n');
 console.log(`\nSUPPLEMENT ${i} ${path}:${start}-${end}\n${evidence}`);
 const item={path,start,end,evidence,read_at:new Date().toISOString()};
 const old=records.findIndex(r=>r.path===path&&r.start===start&&r.end===end);
 if(old<0)records.push(item);else records[old]=item;
}
fs.writeFileSync(dest,JSON.stringify(records,null,2)+'\n');
