import fs from 'node:fs';import assert from 'node:assert/strict';import {root}from './inventory.mjs';
import{inspect}from './inspect-embedded-fixtures.mjs';import{inspectStructural}from './inspect-structural-fixtures.mjs';
const read=p=>JSON.parse(fs.readFileSync(p)),v=read('verification/iteration-074.json'),a=inspectStructural('v2_1'),old=inspect('v2_0'),data=fs.readFileSync(root+'/'+a.source),out=[],pages=[];
const align=(x,n=8)=>Math.ceil(x/n)*n;
for(const col of a.columns)for(const[page,p]of col.pages.entries()){
 const layout=p.layout.inner??p.layout,chunks=[],padding=[];let at=p.offsets[1],used=0,levelsUsed=0;
 for(let j=0;j<p.sizes[0]/2;j++){
  const word=data.readUInt16LE(p.offsets[0]+2*j),log=word&15,size=((word>>>4)+1)*8,start=at,end=start+size,n=log?2**log:layout.num_items-used;
  let pos=start;const num_levels=data.readUInt16LE(pos);pos+=2;const rep_size=layout.rep?data.readUInt16LE(pos):0;if(layout.rep)pos+=2;const def_size=layout.def?data.readUInt16LE(pos):0;if(layout.def)pos+=2;const value_size=data.readUInt16LE(pos);pos+=2;
  const seg=[];padding.push({start:pos,end:align(pos),kind:'header',fill:254});pos=align(pos);
  for(const[kind,sz]of[['rep',rep_size],['def',def_size],['values',value_size]]){if(sz){seg.push({kind,start:pos,end:pos+sz});pos+=sz;padding.push({start:pos,end:align(pos),kind,fill:254});pos=align(pos);}}
  assert.equal(pos,end);chunks.push({index:j,start,end,word,log,num_values:n,num_levels,level_start:levelsUsed,segments:seg});at=end;used+=n;levelsUsed+=num_levels;
 }
 assert.equal(at,p.offsets[1]+p.sizes[1]);assert.equal(used,layout.num_items);
 for(let j=0;j<p.offsets.length;j++)padding.push({start:p.offsets[j]+p.sizes[j],end:align(p.offsets[j]+p.sizes[j],64),kind:'page buffer'+j,fill:72});
 pages.push({column:col.index,page,p,layout,chunks,padding});
}
const flat=(bits,index=0)=>({kind:'Flat',bits,buffer_index:index,buffer_type:0,compression:null}),nn=(bits,index=0)=>({kind:'Nullable',mode:1,children:[{field:1,encoding:flat(bits,index)}]});
const clean=x=>JSON.parse(JSON.stringify(x,(k,v)=>k==='wire'?undefined:v));
const mini=inspect('v2_0_mini');
const children=Array.from({length:4097},(_,r)=>r%11===0?[]:[r,r%5===0?null:2*r,3*r]).flat();
for(const s of v.checks.accuracy.samples.filter(s=>s.unit==='bytes')){
 const b=fs.readFileSync(root+'/'+s.path),bytes=b.subarray(s.start,s.end);let decoded;
 if([2,16].includes(s.id)){
  const col=s.id===2?2:1,p=a.columns[col].pages[0];assert.deepEqual([p.metadata_start,p.metadata_end],[s.start,s.end]);assert.equal(p.length,1024);assert.equal(p.priority,0);assert(!p.wire.some(x=>x.number===5));
  assert.deepEqual(p.offsets,col===2?[100416,100480,106496]:[66944,67008]);assert.deepEqual(p.sizes,col===2?[6,5968,48]:[16,33376]);assert.equal(p.encoding.type_url,'/lance.encodings21.PageLayout');
  const expected=JSON.parse(s.claim.match(/Layout (\{.+\})\. MiniBlock/)[1]);assert.deepEqual(clean(p.layout),expected);decoded={column:col,page:0,metadata:[p.metadata_start,p.metadata_end],length:p.length,priority:p.priority,offsets:p.offsets,sizes:p.sizes,type_url:p.encoding.type_url,layout:clean(p.layout),wire:p.wire};
 }else if(s.id===15){
  const pad=pages.flatMap(p=>p.padding.map(x=>({...x,column:p.column,page:p.page}))).find(x=>x.start===s.start&&x.end===s.end);assert(pad);assert.equal(pad.fill,254);assert.equal(bytes.length,4);assert(bytes.every(x=>x===254));decoded=pad;
 }else if(s.id===5){
  const p=pages.find(p=>p.column===1&&p.page===2),c=p.chunks[2],seg=c.segments.find(x=>x.kind==='values');assert.deepEqual([seg.start,seg.end],[s.start,s.end]);assert.equal(c.num_values,128);assert.equal(p.layout.values.kind,'Variable');assert.equal(p.layout.values.offsets.bits,32);assert.equal(p.layout.values.values,null);
  const offsets=Array.from({length:129},(_,i)=>bytes.readUInt32LE(4*i)),first=2048+256;assert.equal(offsets[0],516);assert.equal(offsets.at(-1),4036);assert.equal(bytes.length,4036);const values=[];
  for(let i=0;i<128;i++){const r=first+i,expected=r%7===0?'':`value-${String(r).padStart(4,'0')}-deterministic-fixture`;assert.equal(bytes.subarray(offsets[i],offsets[i+1]).toString(),expected);assert.equal(offsets[i+1]-offsets[i],expected.length);values.push(expected||null);}
  decoded={column:1,page:2,chunk:2,first_row:first,rows:128,offsets,values,trailing_padding:0};
 }else{
  const embedded=s.id===4,ci=[3,18].includes(s.id)?3:1,pi=({3:57,4:62,8:450,11:371,12:95,18:226,20:123})[s.id],dataset=embedded?mini:old,p=dataset.columns[ci].pages[pi],first=dataset.columns[ci].pages.slice(0,pi).reduce((n,x)=>n+x.length,0);
  assert.equal(p.offsets[0],s.start);const finish=p.offsets.at(-1)+p.sizes.at(-1);assert.equal(embedded?finish:align(finish,64),s.end);assert.equal(p.priority,0);assert(!p.wire.some(x=>x.number===5));
  const expectedMeta=({3:[677410,677489],8:[666525,666619],11:[659099,659193],12:[633155,633249],18:[690761,690840],20:[635787,635881]})[s.id];if(expectedMeta)assert.deepEqual([p.metadata_start,p.metadata_end],expectedMeta);
  let padding=0;if(!embedded)for(let i=0;i<p.sizes.length;i++){const end=p.offsets[i]+p.sizes[i],next=align(end,64);assert(b.subarray(end,next).every(x=>x===72));padding+=next-end;}
  assert.equal(padding,({3:78,4:0,8:32,11:0,12:32,18:78,20:32})[s.id]);decoded={column:ci,page:pi,first,count:p.length,offsets:p.offsets,sizes:p.sizes,metadata:[p.metadata_start,p.metadata_end],priority:0,padding,encoding:p.encoding};
  if(ci===3){
   assert.equal(first,s.id===3?2451:9709);assert.equal(p.length,43);assert.deepEqual(p.sizes,[6,172]);assert.deepEqual(p.encoding,{kind:'Nullable',mode:2,children:[{field:1,encoding:flat(1)},{field:2,encoding:flat(32,1)}]});
   const validity=b.subarray(p.offsets[0],p.offsets[0]+6),values=Array.from({length:43},(_,i)=>b.readInt32LE(p.offsets[1]+4*i)),expected=children.slice(first,first+43);assert.equal(validity.toString('hex'),s.id===3?'effffe7fff07':'feeffff7ff07');assert.equal(validity[5]>>>3,0);
   assert.deepEqual(values,expected.map(x=>x??0));assert.deepEqual(expected.map(x=>x!==null),Array.from({length:43},(_,i)=>Boolean(validity[i>>3]&(1<<(i%8)))));decoded={...decoded,validity:validity.toString('hex'),values,decoded_values:expected};
  }else{
   assert.equal(first,({4:124,8:3600,11:2968,12:760,20:984})[s.id]);assert.equal(p.length,embedded?2:8);const A=p.sizes[1]+1,raw=Array.from({length:p.length},(_,i)=>Number(b.readBigUInt64LE(p.offsets[0]+8*i)));assert.deepEqual(raw,({4:[32,64],8:[32,64,96,128,160,385,192,224],11:[193,32,64,96,128,160,192,385],12:[32,64,96,321,128,160,192,224],20:[32,64,96,321,128,160,192,224]})[s.id]);
   assert.equal(p.encoding.kind,'Binary');assert.equal(p.encoding.null_adjustment,A);assert.deepEqual(p.encoding.indices,nn(64));assert.deepEqual({...p.encoding.bytes,compression:null},flat(8,1));assert.equal(p.encoding.bytes.compression.hex,'0a046e6f6e65');let previous=0;
   const values=raw.map((x,i)=>{const isnull=x>=A,end=isnull?x-A:x;assert(end>=previous);const value=b.subarray(p.offsets[1]+previous,p.offsets[1]+end).toString();assert.equal(isnull,(first+i)%7===0);assert.equal(value,isnull?'':`value-${String(first+i).padStart(4,'0')}-deterministic-fixture`);if(isnull)assert.equal(end,previous);previous=end;return isnull?null:value;});assert.equal(previous,p.sizes[1]);decoded={...decoded,adjustment:A,raw_ends:raw,values};
  }
 }
 out.push({id:s.id,path:s.path,start:s.start,end:s.end,claim:s.claim,read_at:new Date().toISOString(),hex:bytes.toString('hex'),decoded,pass:true});console.log(JSON.stringify({id:s.id,decoded:{...decoded,wire:decoded.wire?.map(x=>({tag:x.number,start:x.start,end:x.end,value:x.value}))}}));
}
assert.equal(out.length,11);fs.writeFileSync('verification/iteration-074-binary-claim-reads.json',JSON.stringify(out,null,2)+'\n');
