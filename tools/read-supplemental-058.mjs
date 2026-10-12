import fs from 'node:fs';
import path from 'node:path';
import {root, linesOf} from './inventory.mjs';
const groups = {
 h:[['rust/lance-table/src/transaction/row_version.rs',20,24],['protos/transaction.proto',293,305]],
 g:[['rust/lance-table/src/transaction/row_version.rs',39,75],['rust/lance-table/src/transaction/validate.rs',120,192],['rust/lance-core/src/utils/bloomfilter/sbbf.rs',213,218],['rust/lance-table/src/transaction/proto.rs',547,578]],
 a:[['rust/lance-file/src/compatibility_tests.rs',27,52],['rust/lance-table/src/transaction/proto.rs',145,182],['rust/lance-table/src/io/commit/dynamodb.rs',184,242],['rust/lance-table/src/feature_flags.rs',220,251],['rust/lance-table/src/feature_flags.rs',286,304],['rust/lance-table/src/io/commit.rs',65,90],['rust/lance-table/src/format/manifest.rs',104,118],['rust/lance-core/src/cache/codec.rs',104,132]],
 b:[['rust/lance-core/src/utils/row_addr_remap.rs',376,471],['rust/lance-core/src/utils/row_addr_remap.rs',606,630],['rust/lance-file/src/writer/structural.rs',159,168],['rust/lance-file/src/writer/structural.rs',396,413],['rust/lance-table/src/transaction/validate.rs',280,390]],
 c:[['rust/lance-table/src/transaction/row_version.rs',90,275],['rust/lance-core/src/utils/bloomfilter/sbbf.rs',38,76],['rust/lance-core/src/utils/bloomfilter/sbbf.rs',219,289]],
 d:[['rust/lance-table/src/transaction/validate.rs',1,105],['rust/lance-table/src/transaction/validate.rs',418,755]],
 e:[['rust/lance-file/src/version.rs',19,27],['rust/lance-file/src/version.rs',172,261],['rust/lance-table/src/transaction/manifest_build.rs',3643,3693],['rust/lance-core/src/utils/futures.rs',373,570]],
 f:[['rust/lance-core/src/utils/futures.rs',571,701]]
};
const dest='verification/iteration-058-supplemental-source.json';
const current=fs.existsSync(dest)?JSON.parse(fs.readFileSync(dest)):[];
const group=process.argv[2];if(!groups[group])throw Error('Unknown group');
for(const [p,start,end] of groups[group]){
 const lines=linesOf(fs.readFileSync(path.join(root,p),'utf8'));
 if(end>lines.length)throw Error('Out of bounds '+p);
 const evidence=lines.slice(start-1,end).map((s,i)=>`${start+i} | ${s}`).join('\n');
 console.log(`${p}:${start}-${end}\n${evidence}\n`);
 current.push({path:p,start,end,evidence,read_at:new Date().toISOString()});
}
fs.writeFileSync(dest,JSON.stringify(current,null,2)+'\n');
