import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {root} from './inventory.mjs';
import {wire} from './inspect-embedded-fixtures.mjs';
import {inspectStructural} from './inspect-structural-fixtures.mjs';
const v=JSON.parse(fs.readFileSync('verification/iteration-071.json'));
const v21=inspectStructural('v2_1'),v22=inspectStructural('v2_2'),records=[];
for(const s of v.checks.accuracy.samples.filter(s=>s.unit==='bytes')){
 const b=fs.readFileSync(path.join(root,s.path)),bytes=b.subarray(s.start,s.end);let decoded;
 if(s.id===1||s.id===5){
  assert.equal(bytes.length,62);assert(bytes.every(x=>x===0x48));
  const c=s.id===1?0:2,p=v21.columns[c].pages[4];assert.equal(p.offsets[0]+p.sizes[0],s.start);assert.equal(Math.ceil(s.start/64)*64,s.end);
  decoded={bytes:62,all:72,column:c,page:4,stored_buffer_position:p.offsets[0],stored_unpadded_size:p.sizes[0],next_alignment:s.end};
 }else if(s.id===4){
  assert.equal(s.start,v22.footer.B+16);assert.equal(s.end,s.start+16);
  const entries=v22.columns.map(c=>[c.position,c.size]);assert.deepEqual(entries,[[498375,409],[498784,455],[499239,570],[499809,531],[500340,511]]);
  assert.equal(v22.footer.C-v22.footer.B,80);assert.equal(bytes.readBigUInt64LE(0),498784n);assert.equal(bytes.readBigUInt64LE(8),455n);
  const g=v22.globals[0],descriptor=wire(b,g.position,g.position+g.size),schemaField=descriptor.find(f=>f.number===1),schema=wire(b,schemaField.data_start,schemaField.end);
  const names=schema.filter(f=>f.number===1).map(f=>{const field=wire(b,f.data_start,f.end);return Buffer.from(field.find(f=>f.number===2).hex,'hex').toString();});
  assert.deepEqual(names,['id','name','items','item','category','blob']);
  decoded={cmo_start:v22.footer.B,cmo_end:v22.footer.C,entries,schema_field_order:names,physical_order:['id','name','items','category','blob'],unframed:true};
 }else if(s.id===13){
  const p=v22.columns[2].pages[4];assert.deepEqual([p.metadata_start,p.metadata_end],[s.start,s.end]);assert.deepEqual(p.offsets,[497536,497600,497664]);assert.deepEqual(p.sizes,[4,48,16]);assert.equal(p.length,1);assert.equal(p.priority,4096);assert.equal(p.encoding.type_url,'/lance.encodings21.PageLayout');
  assert.deepEqual(JSON.parse(JSON.stringify(p.layout,(k,v)=>k==='wire'?undefined:v)),{kind:'MiniBlock',rep:{tag:1,kind:'Flat',bits:16,data:null},def:{tag:5,kind:'InlineBitpacking',bits:16,values:null},values:{tag:1,kind:'Flat',bits:32,data:null},dictionary:null,dictionary_items:0,layers:[1,4],num_buffers:1,repetition_index_depth:1,num_items:3,has_large_chunk:1});
  decoded={column:2,page:4,offsets:p.offsets,sizes:p.sizes,rows:p.length,priority:p.priority,type_url:p.encoding.type_url,layout:p.layout,wire:wire(b,s.start,s.end)};
 }else if(s.id===17){
  const positions=[Number(bytes.readBigInt64LE(0)),Number(bytes.readBigInt64LE(8))];assert.deepEqual(positions,[386525,386556]);assert.equal(positions[1]-positions[0],31);assert.equal(b.subarray(positions[0],positions[1]).toString(),'blob-4096-deterministic-payload');
  decoded={positions,spacing:31,logical_batch:4,row:4096,payload:b.subarray(positions[0],positions[1]).toString()};
 }else if(s.id===19){
  const p=v21.columns[2].pages[3],word=bytes.readUInt16LE(0);assert.equal(p.offsets[0],s.start);assert.equal(bytes.length,2);assert.equal(word,4666);assert.equal(word&15,10);assert.equal(2**(word&15),1024);const size=((word>>>4)+1)*8;assert.equal(size,2336);assert.deepEqual([p.offsets[1],p.offsets[1]+size],[473344,475680]);
  decoded={word,width:16,log:word&15,stored_values:1024,high_bits:word>>>4,size,chunk:[p.offsets[1],p.offsets[1]+size]};
 }else throw new Error('Unhandled sample '+s.id);
 records.push({id:s.id,path:s.path,start:s.start,end:s.end,claim:s.claim,read_at:new Date().toISOString(),hex:bytes.toString('hex'),decoded,pass:true});
 console.log(JSON.stringify({id:s.id,path:s.path,range:[s.start,s.end],decoded}));
}
assert.equal(records.length,6);
fs.writeFileSync('verification/iteration-071-binary-claim-reads.json',JSON.stringify(records,null,2)+'\n');
