import fs from 'node:fs';
import {root,linesOf} from './inventory.mjs';
const v=JSON.parse(fs.readFileSync('verification/iteration-077.json')),destination='verification/iteration-077-fresh-claim-reads.json';
const previous=fs.existsSync(destination)?JSON.parse(fs.readFileSync(destination)):[];
for(const sample of v.checks.accuracy.samples.filter(s=>s.unit!=='bytes'&&s.id>=Number(process.argv[2])&&s.id<=Number(process.argv[3]))){
 const source=fs.readFileSync(root+'/'+sample.path);
 const evidence=sample.unit==='bytes'?source.subarray(sample.start,sample.end).toString('hex'):linesOf(source.toString('utf8')).slice(sample.start-1,sample.end).map((line,i)=>`${sample.start+i} | ${line}`).join('\n');
 console.log(`\nCLAIM ${sample.id} ${sample.path} ${sample.unit??'lines'}:${sample.start}-${sample.end}\n${sample.claim}\n${evidence}`);
 const entry={id:sample.id,path:sample.path,start:sample.start,end:sample.end,unit:sample.unit??'lines',read_at:new Date().toISOString(),evidence};
 const index=previous.findIndex(e=>e.id===sample.id);if(index<0)previous.push(entry);else previous[index]=entry;
}
fs.writeFileSync(destination,JSON.stringify(previous.sort((a,b)=>a.id-b.id),null,2)+'\n');
