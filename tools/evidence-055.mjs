import fs from 'node:fs';
import {root,linesOf} from './inventory.mjs';
const ranges=[
 ['rust/lance-table/src/system_index/frag_reuse/lineage.rs',23,43,'Claim3: new filters unsupported ledger transitions.'],
 ['rust/lance-table/src/system_index/frag_reuse/metadata.rs',15,18,'Claim3: name and nonzero index version define tagged.'],
 ['rust/lance-table/src/transaction/manifest_build.rs',741,753,'Claim6: new version is based on current manifest.'],
 ['rust/lance-table/src/transaction/manifest_build.rs',1750,1845,'Claim7: reserved key guards and primary-key-only validator.'],
 ['rust/lance-table/src/transaction/manifest_build.rs',89,124,'Claim7: candidate range-segment option controls conversion.'],
 ['rust/lance-select/src/mask.rs',545,588,'Claim9: inclusive bitmap insertion at u32 boundary.'],
 ['rust/lance-select/src/mask.rs',801,811,'Claim9: inclusive runs; this helper file remains contextual only.'],
 ['rust/lance-core/src/cache/mod.rs',440,472,'Claim10: loader wraps value in Arc; cache Result and hit flag.'],
 ['rust/lance-core/src/utils/stable_partition.rs',62,65,'Claim13: parent NullBuffer import.'],
 ['rust/lance-core/src/utils/stable_partition.rs',598,605,'Claim13: seeded m5 caller.'],
 ['rust/lance-core/src/utils/stable_partition.rs',644,652,'Claim13: second seeded m5 caller.'],
 ['rust/lance-core/src/datatypes/schema.rs',874,878,'Claim17: equality compares fields only.'],
 ['rust/lance-core/src/datatypes/schema.rs',2415,2443,'Claim17: metadata-specific merge oracle.'],
 ['rust/lance-file/src/writer/structural.rs',352,360,'Claim15: leading alignment and payload-only external write.'],
 ['rust/lance-file/src/writer/structural.rs',778,788,'Claim15: map insertion and external initialization have no byte-reference checks.'],
 ['rust/lance-table/src/utils/stream.rs',716,848,'Claim18: metadata prepared while task stream polled, then futures boxed.']
];
const data=ranges.map(([path,start,end,note])=>({path,start,end,note,reviewed:true,reviewed_in_goal_turn:55,evidence:linesOf(fs.readFileSync(root+'/'+path,'utf8')).slice(start-1,end).map((l,i)=>`${start+i} | ${l}`).join('\n')}));
fs.writeFileSync('verification/iteration-055-supplemental-source.json',JSON.stringify(data,null,2)+'\n');
const license=linesOf(fs.readFileSync(root+'/protos/license_header.txt','utf8'));
fs.writeFileSync('verification/iteration-055-no-items.json',JSON.stringify([{path:'protos/license_header.txt',representation:'text',evidence:license,reviewed:true,reviewed_in_goal_turn:55}],null,2)+'\n');
console.log({supplemental_ranges:data.length,nondeclaration_files:1});
