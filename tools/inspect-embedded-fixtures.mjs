import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {root,output,digest} from './inventory.mjs';

export function varint(buffer, start, stop=buffer.length) {
 let value=0n,shift=0n,offset=start;
 do {
  assert(offset<stop,'Truncated varint');const byte=buffer[offset++];
  value|=BigInt(byte&127)<<shift;
  if(!(byte&128))return {value,end:offset};
  shift+=7n;assert(shift<70n,'Oversized varint');
 }while(true);
}
export function wire(buffer,start=0,end=buffer.length) {
 const fields=[];let cursor=start;
 while(cursor<end){
  const begin=cursor,tag=varint(buffer,cursor,end);cursor=tag.end;
  const number=Number(tag.value>>3n),type=Number(tag.value&7n);assert(number>0);
  if(type===0){const item=varint(buffer,cursor,end);cursor=item.end;fields.push({number,type,start:begin,end:cursor,value:item.value.toString()});}
  else if(type===2){const length=varint(buffer,cursor,end);cursor=length.end;const dataStart=cursor;cursor+=Number(length.value);assert(cursor<=end);fields.push({number,type,start:begin,data_start:dataStart,end:cursor,hex:buffer.subarray(dataStart,cursor).toString('hex')});}
  else throw Error(`Unsupported wire type ${type} at ${begin}`);
 }
 assert.equal(cursor,end);return fields;
}
function nested(buffer,field){assert(field&&field.type===2);return wire(buffer,field.data_start,field.end);}
function by(fields,n){return fields.find(f=>f.number===n);}
function packed(buffer,field){if(!field)return [];let at=field.data_start;const values=[];while(at<field.end){const v=varint(buffer,at,field.end);values.push(Number(v.value));at=v.end;}return values;}
function val(fields,n){return Number(by(fields,n)?.value??0);}
function directAny(buffer,field){
 const encoding=nested(buffer,field),direct=nested(buffer,by(encoding,2)),any=nested(buffer,by(direct,1));
 const url=by(any,1),payload=by(any,2);
 return {type_url:buffer.subarray(url.data_start,url.end).toString(),payload:nested(buffer,payload),wrapper:encoding,any};
}
function array(buffer,fields){
 assert.equal(fields.length,1);const f=fields[0],child=nested(buffer,f);
 if(f.number===1){const ref=nested(buffer,by(child,2));return {kind:'Flat',bits:val(child,1),buffer_index:val(ref,1),buffer_type:val(ref,2),compression:by(child,3)??null};}
 if(f.number===2){assert.equal(child.length,1);const mode=child[0],body=nested(buffer,mode);return {kind:'Nullable',mode:mode.number,children:body.map(x=>({field:x.number,encoding:array(buffer,nested(buffer,x))}))};}
 if(f.number===6)return {kind:'Binary',indices:array(buffer,nested(buffer,by(child,1))),bytes:array(buffer,nested(buffer,by(child,2))),null_adjustment:val(child,3)};
 if(f.number===4)return {kind:'List',offsets:array(buffer,nested(buffer,by(child,1))),null_offset_adjustment:val(child,2),num_items:val(child,3)};
 if(f.number===7)return {kind:'Dictionary',indices:array(buffer,nested(buffer,by(child,1))),items:array(buffer,nested(buffer,by(child,2))),num_dictionary_items:val(child,3)};
 if(f.number===3)return {kind:'FixedSizeList',dimension:val(child,1),items:array(buffer,nested(buffer,by(child,2))),has_validity:val(child,3)};
 if(f.number===5)return {kind:'SimpleStruct'};
 if(f.number===9)return {kind:'PackedStruct',inner:child.filter(x=>x.number===1).map(x=>array(buffer,nested(buffer,x))),buffer:nested(buffer,by(child,2))};
 if(f.number===10){const ref=nested(buffer,by(child,3));return {kind:'Bitpacked',compressed_bits:val(child,1),uncompressed_bits:val(child,2),buffer_index:val(ref,1),buffer_type:val(ref,2),signed:val(child,4)};}
 throw Error(`Unsupported array encoding ${f.number}`);
}
export function inspect(name){
 const source=`rust/lance-file/test_data/exact_versions/${name}.lance`,buffer=fs.readFileSync(path.join(root,source));
 const start=buffer.length-40,u64=at=>Number(buffer.readBigUInt64LE(at));
 const footer={start,column_metadata_start:u64(start),cmo_start:u64(start+8),gbo_start:u64(start+16),global_buffers:buffer.readUInt32LE(start+24),columns:buffer.readUInt32LE(start+28),major:buffer.readUInt16LE(start+32),minor:buffer.readUInt16LE(start+34),magic:buffer.subarray(start+36).toString()};
 assert.equal(footer.magic,'LANC');
 const globals=Array.from({length:footer.global_buffers},(_,i)=>{const p=footer.gbo_start+i*16;return {table_offset:p,position:u64(p),size:u64(p+8)};});
 const columns=Array.from({length:footer.columns},(_,i)=>{
  const table=footer.cmo_start+i*16,position=u64(table),size=u64(table+8),fields=wire(buffer,position,position+size);
  const encoding=directAny(buffer,by(fields,1));
  const pages=fields.filter(f=>f.number===2).map(f=>{
   const p=nested(buffer,f),e=directAny(buffer,by(p,4));
   return {metadata_start:f.start,metadata_end:f.end,offsets:packed(buffer,by(p,1)),sizes:packed(buffer,by(p,2)),length:val(p,3),priority:val(p,5),encoding_type:e.type_url,encoding:array(buffer,e.payload),wire:p,encoding_wire:e};
  });
  return {index:i,table_offset:table,position,size,column_encoding:encoding,pages,wire:fields};
 });
 return {source,name,size:buffer.length,sha256:digest(buffer),footer,globals,columns};
}
if(process.argv[1]===new URL(import.meta.url).pathname){
 for(const name of ['v2_0_mini','v2_0_self_described']){
  const report=inspect(name);fs.writeFileSync(path.join(output,`analysis/iteration-067-${name}-inspection.json`),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({name,size:report.size,footer:report.footer,globals:report.globals,columns:report.columns.map(c=>({index:c.index,position:c.position,size:c.size,type:c.column_encoding.type_url,pages:c.pages.length}))},null,2));
 }
}
