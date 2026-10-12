import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {root,output,digest} from './inventory.mjs';
import {wire,varint} from './inspect-embedded-fixtures.mjs';

export function inspectStructural(name){
 const source=`rust/lance-file/test_data/exact_versions/${name}.lance`,b=fs.readFileSync(path.join(root,source)),u64=at=>Number(b.readBigUInt64LE(at));
 const by=(f,n)=>f.find(x=>x.number===n),num=(f,n)=>Number(by(f,n)?.value??0),sub=f=>wire(b,f.data_start,f.end);
 const packed=f=>{if(!f)return [];const out=[];let at=f.data_start;while(at<f.end){const v=varint(b,at,f.end);out.push(Number(v.value));at=v.end;}return out;};
 function any(f){const wrapper=sub(f),direct=sub(by(wrapper,2)),a=sub(by(direct,1));return {type_url:Buffer.from(by(a,1).hex,'hex').toString(),payload:sub(by(a,2)),wrapper,any:a};}
 function compression(f){if(!f)return null;const fs=sub(f);assert.equal(fs.length,1);const arm=fs[0],c=sub(arm),base={tag:arm.number};
  switch(arm.number){
   case 1:return {...base,kind:'Flat',bits:num(c,1),data:by(c,2)?sub(by(c,2)):null};
   case 2:return {...base,kind:'Variable',offsets:compression(by(c,1)),values:by(c,2)?sub(by(c,2)):null};
   case 3:return {...base,kind:'Constant',value:by(c,1)?.hex??null};
   case 4:return {...base,kind:'OutOfLineBitpacking',bits:num(c,1),values:compression(by(c,3))};
   case 5:return {...base,kind:'InlineBitpacking',bits:num(c,1),values:by(c,2)?sub(by(c,2)):null};
   case 7:return {...base,kind:'Dictionary',indices:compression(by(c,1)),items:compression(by(c,2)),count:num(c,3)};
   case 8:return {...base,kind:'Rle',values:compression(by(c,1)),run_lengths:compression(by(c,2))};
   case 12:return {...base,kind:'PackedStruct',bits:packed(by(c,1)),values:compression(by(c,2))};
   default:return {...base,kind:'Uninterpreted',wire:c};
  }
 }
 function layout(fs){assert.equal(fs.length,1);const arm=fs[0],c=sub(arm);
  if(arm.number===1)return {kind:'MiniBlock',rep:compression(by(c,1)),def:compression(by(c,2)),values:compression(by(c,3)),dictionary:compression(by(c,4)),dictionary_items:num(c,5),layers:packed(by(c,6)),num_buffers:num(c,7),repetition_index_depth:num(c,8),num_items:num(c,9),has_large_chunk:num(c,10),wire:c};
  if(arm.number===2)return {kind:'Constant',layers:packed(by(c,5)),value:by(c,6)?.hex??null,wire:c};
  if(arm.number===3)return {kind:'FullZip',bits_rep:num(c,1),bits_def:num(c,2),bits_per_value:by(c,3)?num(c,3):null,bits_per_offset:by(c,4)?num(c,4):null,num_items:num(c,5),num_visible_items:num(c,6),values:compression(by(c,7)),layers:packed(by(c,8)),wire:c};
  if(arm.number===4)return {kind:'Blob',inner:layout(sub(by(c,1))),layers:packed(by(c,2)),wire:c};
  return {kind:'Uninterpreted',tag:arm.number,wire:c};
 }
 const at=b.length-40,footer={start:at,A:u64(at),B:u64(at+8),C:u64(at+16),global_buffers:b.readUInt32LE(at+24),columns:b.readUInt32LE(at+28),major:b.readUInt16LE(at+32),minor:b.readUInt16LE(at+34),magic:b.subarray(at+36).toString()};assert.equal(footer.magic,'LANC');
 const globals=Array.from({length:footer.global_buffers},(_,i)=>({table_offset:footer.C+i*16,position:u64(footer.C+i*16),size:u64(footer.C+i*16+8)}));
 const columns=Array.from({length:footer.columns},(_,i)=>{const table=footer.B+i*16,position=u64(table),size=u64(table+8),fields=wire(b,position,position+size),column_encoding=any(by(fields,1));
  const pages=fields.filter(f=>f.number===2).map(f=>{const p=sub(f),encoding=any(by(p,4));return {metadata_start:f.start,metadata_end:f.end,length:num(p,3),priority:num(p,5),offsets:packed(by(p,1)),sizes:packed(by(p,2)),layout:layout(encoding.payload),encoding,wire:p};});return {index:i,table_offset:table,position,size,column_encoding,pages,wire:fields};});
 return {name,source,size:b.length,sha256:digest(b),footer,globals,columns};
}
if(process.argv[1]===new URL(import.meta.url).pathname){const name=process.argv[2]??'v2_1',r=inspectStructural(name);fs.writeFileSync(path.join(output,`analysis/iteration-069-${name}-inspection.json`),JSON.stringify(r,null,2)+'\n');const clean=x=>JSON.parse(JSON.stringify(x,(k,v)=>k==='wire'?undefined:v));console.log(JSON.stringify({...r,columns:r.columns.map(c=>({index:c.index,position:c.position,size:c.size,column_type:c.column_encoding.type_url,column_payload:c.column_encoding.payload.map(x=>[x.number,x.hex]),pages:c.pages.map(p=>({metadata:[p.metadata_start,p.metadata_end],rows:p.length,priority:p.priority,offsets:p.offsets,sizes:p.sizes,type:p.encoding.type_url,layout:clean(p.layout)}))}))},null,2));}
