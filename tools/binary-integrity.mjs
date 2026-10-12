import fs from 'node:fs';
import path from 'node:path';
import {root,output,digest} from './inventory.mjs';

// Structural verification supplements, but does not replace, semantic byte review.
export function checkBinary(entry,analysis,doc) {
 const issues=[],bad=error=>issues.push({path:entry.path,error});
 const source=fs.readFileSync(path.join(root,entry.path));
 if(entry.line_count!==null||entry.representation!=='binary')bad('Binary entry must retain null line count');
 if(analysis.reviewed!==true||analysis.byte_order!=='zero-based half-open')bad('Missing reviewed byte convention');
 const ranges=analysis.byte_ranges??[];let end=0;
 for(const [start,stop,note]of ranges){
  if(start!==end||stop<=start||stop>source.length||!note?.trim())bad(`Invalid byte interval ${start}-${stop}`);
  if(!doc.includes(`### Bytes ${start}-${stop}`)||!doc.includes(note))bad(`Missing byte annotation ${start}-${stop}`);
  end=stop;
 }
 if(end!==source.length)bad('Unaccounted binary ending');
 if(JSON.stringify(entry.analyzed_byte_ranges)!==JSON.stringify(ranges.map(r=>r.slice(0,2))))bad('Ledger byte ranges disagree');
 if(JSON.stringify(entry.read_byte_ranges)!==JSON.stringify([[0,source.length]]))bad('Incomplete recorded byte read');
 if(entry.analyzed_ranges?.length||entry.read_ranges?.length)bad('Binary entry has fabricated line ranges');
 const artifact=path.join(output,analysis.byte_artifact??'missing');
 if(!fs.existsSync(artifact)||digest(fs.readFileSync(artifact))!==entry.sha256)bad('Preserved bytes differ');
 const reportPath=path.join(output,analysis.byte_evidence??'missing');
 if(!fs.existsSync(reportPath)){bad('Missing byte evidence');return issues;}
 const report=JSON.parse(fs.readFileSync(reportPath));
 if(report.source!==entry.path||report.sha256!==entry.sha256||report.size!==source.length)bad('Byte evidence identity differs');
 if(report.regions?.length!==ranges.length)bad('Byte evidence region count differs');
 for(let i=0;i<ranges.length;i++){
  const [a,b]=ranges[i],r=report.regions?.[i];
  if(!r||r.start!==a||r.end!==b||r.sha256!==digest(source.subarray(a,b)))bad(`Byte region evidence differs ${a}-${b}`);
 }
 return issues;
}

export function binaryCitations(text,baseline,document) {
 let count=0;const broken=[];
 for(const m of text.matchAll(/([\w./-]+)@bytes:(\d+)-(\d+)/g)){
  count++;const e=baseline.get(m[1]),start=Number(m[2]),end=Number(m[3]);
  if(!e||e.representation!=='binary'||start<0||end<=start||end>e.size)broken.push({document,citation:m[0]});
 }
 return {count,broken};
}
