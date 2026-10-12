import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {root,output,digest} from './inventory.mjs';
import {inspectStructural} from './inspect-structural-fixtures.mjs';
import {wire} from './inspect-embedded-fixtures.mjs';

const r=inspectStructural('v2_2'),b=fs.readFileSync(path.join(root,r.source));
const regions=[],catalog=[],buffers=[],rows=Array.from({length:4097},(_,id)=>({id}));
const expectedName=i=>i%7===0?null:`value-${String(i).padStart(4,'0')}-deterministic-fixture`;
const expectedItems=i=>i%11===0?null:[i,i%5===0?null:i*2,i*3];
const expectedCategory=i=>i%13===0?null:['red','green','blue'][i%3];
const expectedBlob=i=>`blob-${String(i).padStart(4,'0')}-deterministic-payload`;
const align=(n,a=8)=>Math.ceil(n/a)*a;
function region(start,end,kind,note){if(start===end)return;assert(end>start);regions.push({start,end,kind,note,sha256:digest(b.subarray(start,end))});}
function pad(start,end,fill,kind='chunk padding'){assert(b.subarray(start,end).every(v=>v===fill),`padding ${start}-${end}`);region(start,end,kind,`${end-start} bytes all0x${fill.toString(16)}, alignment padding excluded from stored unpadded buffer size.`);}
const readWord=(buf,at,bits)=>bits===64?Number(buf.readBigUInt64LE(at)):buf.readUIntLE(at,bits/8);
function unpack(buf,T,W,count){
 assert.equal(buf.length,128*W);assert(W>=0&&W<=T);const all=Array(1024).fill(0),lanes=1024/T,order=[0,4,2,6,1,5,3,7],mask=(1n<<BigInt(W))-1n;
 for(let lane=0;lane<lanes;lane++)for(let row=0;row<T;row++){
  const bit=row*W,k=Math.floor(bit/T),shift=bit%T;let v=0n;
  if(W){v=BigInt(readWord(buf,(lanes*k+lane)*T/8,T))>>BigInt(shift);if(shift+W>T)v|=BigInt(readWord(buf,(lanes*(k+1)+lane)*T/8,T))<<BigInt(T-shift);}
  const index=order[Math.floor(row/8)]*16+(row%8)*128+lane;all[index]=Number(v&mask);
 }
 assert(all.slice(count).every(v=>v===0),'unused packed values must be zero');return all.slice(0,count);
}
function fixed(start,end,e,count){
 const buf=b.subarray(start,end),values=[],blocks=[];let pos=0;
 if(e.kind==='Flat'){
  assert.equal(e.data,null);assert.equal(buf.length,count*e.bits/8);
  for(let i=0;i<count;i++)values.push(readWord(buf,i*e.bits/8,e.bits));
  return {values,blocks:[{start,end,kind:'raw',bits:e.bits,count}]};
 }
 if(e.kind==='InlineBitpacking'){
  assert.equal(e.values,null);const T=e.bits;
  while(values.length<count){const at=pos,W=readWord(buf,pos,T);pos+=T/8;const n=Math.min(1024,count-values.length),bytes=128*W;values.push(...unpack(buf.subarray(pos,pos+bytes),T,W,n));pos+=bytes;blocks.push({start:start+at,end:start+pos,kind:'inline',bits:T,width:W,count:n,zero_tail_values:1024-n});}
 }else{
  assert.equal(e.kind,'OutOfLineBitpacking');assert.equal(e.values.kind,'Flat');assert.equal(e.values.data,null);const T=e.bits,W=e.values.bits,whole=Math.floor(count/1024),tail=count%1024,raw=tail>0&&buf.length===whole*128*W+tail*T/8;
  for(let i=0;i<whole+(tail?1:0);i++){
   const n=i<whole?1024:tail,at=pos;
   if(i===whole&&raw){for(let j=0;j<n;j++){values.push(readWord(buf,pos,T));pos+=T/8;}blocks.push({start:start+at,end:start+pos,kind:'raw-tail',bits:T,count:n});}
   else{values.push(...unpack(buf.subarray(pos,pos+128*W),T,W,n));pos+=128*W;blocks.push({start:start+at,end:start+pos,kind:'out-of-line',bits:T,width:W,count:n,zero_tail_values:1024-n});}
  }
 }
 assert.equal(pos,buf.length);return {values,blocks};
}
assert.deepEqual(r.footer,{start:500947,A:498375,B:500851,C:500931,global_buffers:1,columns:5,major:2,minor:2,magic:'LANC'});
assert.deepEqual(r.globals,[{table_offset:500931,position:498048,size:327}]);
const blobStarts=[0,123648,247936,372608,497408];
for(let batch=0;batch<5;batch++){
 const count=Math.min(1024,4097-batch*1024),start=blobStarts[batch];
 for(let n=0;n<count;n++){assert.equal(b.subarray(start+64*n,start+64*n+31).toString(),expectedBlob(batch*1024+n));assert(b.subarray(start+64*n+31,start+64*n+64).every(v=>v===0x48));}
 region(start,start+64*count,'blob payloads',`Batch${batch} rows[${batch*1024},${batch*1024+count}): ${count} records of64 bytes; each contains31 ASCII bytes blob-NNNN-deterministic-payload followed by33 bytes0x48. NNNN is the global row number padded to4 decimal digits. No prefix or compression; descriptions store position=${start}+64*local_row,size31.`);
}
for(const c of r.columns){
 assert.equal(c.column_encoding.type_url,'/lance.encodings.ColumnEncoding');assert.deepEqual(c.column_encoding.payload.map(f=>[f.number,f.hex]),[[1,'']]);assert.equal(c.pages.length,5);
 assert.deepEqual(c.wire.map(f=>f.number),[1,2,2,2,2,2]);
 region(c.position,c.pages[0].metadata_start,'column envelope',`Column${c.index}:43-byte ColumnMetadata tag1 Encoding -> tag2 DirectEncoding -> tag1 bytes -> Any(type_url=/lance.encodings.ColumnEncoding,value=0a00). ColumnEncoding Values is explicitly present and empty, including the blob column. No column buffers or unknown fields.`);
 for(const [batch,p]of c.pages.entries()){
  const base=batch*1024,count=Math.min(1024,4097-base),e=p.layout.kind==='Blob'?p.layout.inner:p.layout,pc={column:c.index,page:batch,row_start:base,row_end:base+count,metadata_start:p.metadata_start,metadata_end:p.metadata_end,offsets:p.offsets,sizes:p.sizes,priority:p.priority,layout:p.layout,chunks:[]};
  assert.equal(p.length,count);assert.equal(p.priority,base);assert.equal(p.encoding.type_url,'/lance.encodings21.PageLayout');if(e.kind==='Constant'){
   assert.equal(batch,4);assert([0,1].includes(c.index));assert.deepEqual(e.layers,[1]);assert.deepEqual(e.wire.map(f=>f.number),c.index===0?[5,6]:[5]);
   assert.deepEqual(p.wire.map(f=>f.number),c.index===0?[3,4,5]:[1,2,3,4,5]);
   if(c.index===0){assert.equal(e.value,'00100000');assert.deepEqual(p.offsets,[]);assert.deepEqual(p.sizes,[]);pc.scalar={source:'inline',data_type:'Int32',value:4096,hex:e.value};}
   else{
    assert.equal(e.value,null);assert.deepEqual(p.offsets,[497472]);assert.deepEqual(p.sizes,[52]);const start=p.offsets[0];
    assert.deepEqual([0,4,8,12,16].map(n=>b.readUInt32LE(start+n)),[2,8,32,0,32]);const value=b.subarray(start+20,start+52).toString();assert.equal(value,expectedName(4096));rows[4096].name=value;
    region(start,start+4,'constant scalar header','Name row4096 scalar buffer: little-endian UInt32 num_buffers=2; describes a length1 nonnull Utf8 Arrow value without a validity bitmap or child data. No embedded type tag; schema determines Utf8.');
    region(start+4,start+12,'constant scalar lengths','Two little-endian UInt32 Arrow buffer lengths [8,32]: eight offset bytes and32 UTF-8 payload bytes. These are buffer lengths, not values or offsets into this framing.');
    region(start+12,start+20,'constant scalar offsets','Two little-endian Int32 Arrow offsets [0,32] for the single Utf8 scalar; relative to the following payload, not the scalar framing start.');
    region(start+20,start+52,'constant scalar value','32 ASCII bytes value-4096-deterministic-fixture. Stored once; ConstantLayout repeats this scalar for the page length, here1.');
    pad(start+52,start+64,0x48,'page buffer padding');buffers.push({column:1,page:4,index:0,start,end:start+52,padded_end:start+64});pc.scalar={source:'value buffer',data_type:'Utf8',buffer_count:2,lengths:[8,32],offsets:[0,32],value};
   }
   region(p.metadata_start,p.metadata_end,'constant page metadata',`Column${c.index} final page: row length tag3=1, priority tag5=4096, direct Encoding Any /lance.encodings21.PageLayout containing ConstantLayout tag2. Layers tag5=[AllValidItem1]. ${c.index===0?'Inline_value tag6 contains00100000, little-endian Int32 4096; no page buffers or offset/size tags are stored.':'Inline_value is absent; exactly one buffer [497472,497524) stores the Utf8 scalar framing. Buffer offsets/sizes tags1/2 are present.'} No repetition/definition streams, compressed-level metadata or count fields. Absence of inline_value alone does not imply all-null.`);
   catalog.push(pc);continue;
  }
  assert.deepEqual(p.wire.map(f=>f.number),[1,2,3,4,...(base?[5]:[])]);assert.equal(e.kind,'MiniBlock');assert.equal(e.num_buffers,1);assert.equal(e.has_large_chunk,1);
  assert.equal(e.repetition_index_depth,c.index===2?1:0);assert.deepEqual(e.layers,c.index===2?(batch===4?[1,4]:[3,4]):(c.index===1||c.index===3)&&batch<4?[3]:[1]);
  if(c.index===4)assert.deepEqual(p.layout.layers,[1]);
  for(let j=0;j<p.offsets.length;j++){const start=p.offsets[j],end=start+p.sizes[j],padded=align(end,64);assert.equal(start%64,0);buffers.push({column:c.index,page:batch,index:j,start,end,padded_end:padded});pad(end,padded,0x48,'page buffer padding');}
  let used=0,at=p.offsets[1];const reps=[],defs=[],values=[];
  for(let j=0;j<p.sizes[0]/4;j++){
   const word=b.readUInt32LE(p.offsets[0]+4*j),log=word&15,size=((word>>>4)+1)*8,n=log?2**log:e.num_items-used,start=at,end=start+size;
   if(log===0)assert.equal(j,p.sizes[0]/4-1);let cursor=start;const num_levels=b.readUInt16LE(cursor);cursor+=2;
   const rep_size=e.rep?b.readUInt16LE(cursor):0;if(e.rep)cursor+=2;
   const def_size=e.def?b.readUInt16LE(cursor):0;if(e.def)cursor+=2;
   const value_size=b.readUInt32LE(cursor);cursor+=4;
   const chunk={index:j,metadata_offset:p.offsets[0]+4*j,metadata_word:word,log_num_values:log,start,end,values_start_index:used,num_values:n,num_levels,rep_size,def_size,value_size,segments:[]};
   region(chunk.metadata_offset,chunk.metadata_offset+4,'chunk metadata',`Column${c.index} page${batch} chunk${j}: little-endian UInt32 ${word}; low4 bits${log} ${log?'give2^log='+n+' stored values':'are the final-chunk sentinel; remaining page values='+n}; high28 bits encode${size}/8-1=${size/8-1}. This indexes chunk[${start},${end}).`);
   region(start,cursor,'chunk header',`Column${c.index} page${batch} chunk${j}: UInt16 num_levels=${num_levels}${e.rep?`,UInt16 rep_size=${rep_size}`:''}${e.def?`,UInt16 def_size=${def_size}`:''},UInt32 value_buffer_size=${value_size}, all little-endian. Stored values=${n}; num_levels0 means both level streams are absent in this fixture, not zero stored values. V2.2 uses32-bit value-buffer sizes and has_large_chunk=true; rep/def sizes and num_levels remain16-bit.`);
   pad(cursor,align(cursor),0xfe);cursor=align(cursor);
   for(const [kind,size,encoding]of [['rep',rep_size,e.rep],['def',def_size,e.def]])if(encoding){
    const decoded=fixed(cursor,cursor+size,encoding,num_levels);(kind==='rep'?reps:defs).push(...decoded.values);chunk[kind]=decoded.values;chunk.segments.push({kind,start:cursor,end:cursor+size,encoding,blocks:decoded.blocks});
    region(cursor,cursor+size,'levels',`Column${c.index} page${batch} chunk${j} ${kind}: ${num_levels} UInt16 logical levels using ${encoding.kind}${encoding.kind==='OutOfLineBitpacking'?` width${encoding.values.bits}`:''}. Blocks ${JSON.stringify(decoded.blocks)}. Full ordered values are in the catalog. ${kind==='rep'?'1 starts a top-level list,0 continues it.':'0 denotes a valid leaf;1 denotes null leaf when layers start NullableItem;2 then denotes a null list with no leaf. On the final list page layers[AllValidItem,NullableList] make1 the null-list level, although its three stored levels are all0.'}`);
    cursor+=size;pad(cursor,align(cursor),0xfe);cursor=align(cursor);
   }
   let decoded,note;
   if(e.values.kind==='Variable'){
    assert.equal(e.values.offsets.kind,'Flat');assert.equal(e.values.offsets.bits,32);assert.equal(e.values.values,null);const offsets=Array.from({length:n+1},(_,i)=>b.readUInt32LE(cursor+4*i));assert.equal(offsets[0],4*(n+1));assert(offsets.every((v,i)=>!i||v>=offsets[i-1]));assert.equal(align(offsets.at(-1),4),value_size);assert(b.subarray(cursor+offsets.at(-1),cursor+value_size).every(v=>v===0x48));
    decoded={values:offsets.slice(1).map((v,i)=>b.subarray(cursor+offsets[i],cursor+v).toString()),offsets,inner_padding:value_size-offsets.at(-1)};
    note=`Variable: ${n+1} UInt32 offsets (including first${offsets[0]}) relative to this value-buffer start; strings occupy consecutive offset intervals. Final offset${offsets.at(-1)}, ${decoded.inner_padding} trailing0x48 bytes to4-byte alignment. Null strings have repeated offsets and separate definition levels. Offsets are not relative to the string payload alone.`;
   }else if(e.values.kind==='PackedStruct'){
    assert.deepEqual(e.values.bits,[64,64]);assert.equal(e.values.values.kind,'Flat');assert.equal(e.values.values.bits,128);assert.equal(e.values.values.data,null);assert.equal(value_size,n*16);
    decoded={values:Array.from({length:n},(_,i)=>({position:Number(b.readBigUInt64LE(cursor+16*i)),size:Number(b.readBigUInt64LE(cursor+16*i+8))}))};note=`PackedStruct[64,64] backed by uncompressedFlat128; ${n} interleaved little-endian UInt64(position,size) descriptions. Position follows batch blob base${blobStarts[batch]}+64*local_row; size31. No definition stream or BlobV2 four-field description.`;
   }else{decoded=fixed(cursor,cursor+value_size,e.values,n);note=`${n} ${e.values.bits}-bit stored values, encoding${e.values.kind}; blocks ${JSON.stringify(decoded.blocks)}. Inline blocks store their bit width as a native-width little-endian header followed by128*width FastLanes bytes. Padded1024-value tails decode to zero. Null child/key backing values are0; logical validity comes from definition levels.`;}
   values.push(...decoded.values);chunk.values=decoded.values;if(decoded.offsets)chunk.offsets=decoded.offsets;chunk.segments.push({kind:'values',start:cursor,end:cursor+value_size,encoding:e.values,blocks:decoded.blocks??null});region(cursor,cursor+value_size,'values',`Column${c.index} page${batch} chunk${j}. ${note}`);cursor+=value_size;pad(cursor,align(cursor),0xfe);cursor=align(cursor);assert.equal(cursor,end);used+=n;at=end;pc.chunks.push(chunk);
  }
  assert.equal(used,e.num_items);assert.equal(at,p.offsets[1]+p.sizes[1]);
  if(c.index===0){assert.equal(e.num_items,count);assert.deepEqual(values,Array.from({length:count},(_,n)=>base+n));assert.equal(e.rep,null);assert.equal(e.def,null);}
  if(c.index===1){assert.equal(e.num_items,count);assert.equal(e.rep,null);for(let n=0;n<count;n++){const expected=expectedName(base+n);assert.equal(defs[n]??0,expected===null?1:0);assert.equal(values[n],expected??'');rows[base+n].name=expected;}}
  if(c.index===2){
   const expectedRep=[],expectedDef=[],expectedValues=[];for(let n=0;n<count;n++){const items=expectedItems(base+n);if(items===null){expectedRep.push(1);expectedDef.push(batch===4?1:2);}else{expectedRep.push(1,0,0);for(const x of items){expectedDef.push(x===null?1:0);expectedValues.push(x??0);}}rows[base+n].items=items;}
   assert.deepEqual(reps,expectedRep);assert.deepEqual(defs,expectedDef);assert.deepEqual(values,expectedValues);assert.equal(e.num_items,expectedValues.length);
   const index=Array.from({length:p.sizes[2]/16},(_,i)=>({rows_finished:Number(b.readBigUInt64LE(p.offsets[2]+16*i)),leftover:Number(b.readBigUInt64LE(p.offsets[2]+16*i+8))}));assert.equal(index.length,pc.chunks.length);
   const derived=pc.chunks.map((x,i)=>({rows_finished:x.rep.slice(1).filter(v=>v===1).length+(i===pc.chunks.length-1?1:0),leftover:i===pc.chunks.length-1?0:x.rep.length-x.rep.lastIndexOf(1)}));
   pc.chunks.forEach((x,i)=>{if(i&&x.rep[0]===1&&derived[i-1].leftover){derived[i-1].rows_finished++;derived[i-1].leftover=0;}});assert.deepEqual(index,derived);assert.equal(index.reduce((s,x)=>s+x.rows_finished,0),count);pc.repetition_index=index;pc.level_count=reps.length;
   region(p.offsets[2],p.offsets[2]+p.sizes[2],'repetition index',`Column2 page${batch}: ${index.length} little-endian UInt64(rows_finished,leftover_level_entries) pairs ${JSON.stringify(index)}. Finished rows sum${count}; nonfinal leftover counts levels belonging to the last partial row, including its start. If next chunk begins with a new row, previous leftover becomes0 and previous finished count increments. Final chunk includes the final row and has leftover0. This depth1 index follows the data buffer; it is not list offsets.`);
  }
  if(c.index===3){
   assert.equal(e.dictionary_items,3);assert.equal(e.dictionary.kind,'Variable');assert.equal(e.dictionary.offsets.bits,32);assert.equal(e.dictionary.values,null);const start=p.offsets[2];assert.equal(p.sizes[2],36);assert.equal(b.readUInt32LE(start),32);assert.equal(b.readUInt32LE(start+4),24);const offsets=[0,1,2,3].map(i=>b.readUInt32LE(start+8+4*i));assert.deepEqual(offsets,[0,5,9,12]);assert.equal(b.subarray(start+24,start+36).toString(),'greenbluered');const dict=['green','blue','red'];
   for(let n=0;n<count;n++){const expected=expectedCategory(base+n);assert.equal(defs[n]??0,expected===null?1:0);assert.equal(values[n],expected===null?0:dict.indexOf(expected));rows[base+n].category=expected;}
   pc.dictionary={offsets,values:dict};region(start,start+36,'dictionary',`Column3 page${batch}: UInt32 bits_per_offset32,UInt32 payload_start24; four UInt32 offsets[0,5,9,12] relative to payload; ASCII greenbluered. Three nonnull dictionary items[green,blue,red] are repeated on every page, including the final page. No fourth null item: definition levels mark null keys, whose physical backing is0. This block layout differs from Variable mini-block offsets.`);
  }else{assert.equal(e.dictionary,null);assert.equal(e.dictionary_items,0);}
  if(c.index===4)for(let n=0;n<count;n++){assert.deepEqual(values[n],{position:blobStarts[batch]+n*64,size:31});rows[base+n].blob=b.subarray(values[n].position,values[n].position+31).toString();}
  region(p.metadata_start,p.metadata_end,'page metadata',`Column${c.index} page${batch}: repeated ColumnMetadata Page tag2; packed absolute offsets tag1[${p.offsets}], packed unpadded sizes tag2[${p.sizes}], row length tag3=${count}, Encoding tag4 -> DirectEncoding -> Any(type_url=/lance.encodings21.PageLayout), priority tag5=${base}${base?'':' omitted/default'}. Layout ${JSON.stringify(p.layout,(k,v)=>k==='wire'?undefined:v)}. MiniBlock tags rep1,def2,values3,dictionary4,dictionary_items5,layers6,num_buffers7,repetition_index_depth8,num_items9,has_large_chunk10=true; absent scalars default0. Wire tree preserves every nested tag and interval.`);
  catalog.push(pc);
 }
}
const descriptor=r.globals[0],fd=wire(b,descriptor.position,descriptor.position+descriptor.size),schema=wire(b,fd[0].data_start,fd[0].end),fieldCatalog=[];
assert.deepEqual(fd.map(f=>f.number),[1,2]);assert.equal(fd[1].value,'4097');assert.equal(schema.length,6);
region(descriptor.position,fd[0].data_start,'descriptor envelope','FileDescriptor tag1/wire2 0a plus Schema length321 varint c102. Unframed global buffer0, with no size prefix.');
const expectedFields=[['id',0,-1,'int32',false,1,null],['name',1,-1,'string',true,2,['lance-encoding:compression','none']],['items',2,-1,'list',true,1,null],['item',3,2,'int32',true,1,null],['category',4,-1,'dict:string:int8:false',true,3,['lance-encoding:dict-values-compression','none']],['blob',5,-1,'large_binary',true,2,['lance-encoding:blob','true']]];
for(const [i,f]of schema.entries()){
 const fields=wire(b,f.data_start,f.end),get=n=>fields.find(x=>x.number===n),s=n=>b.subarray(get(n).data_start,get(n).end).toString(),num=n=>Number(get(n)?.value??0),parent=get(4).value==='18446744073709551615'?-1:num(4),metadata=get(10)?wire(b,get(10).data_start,get(10).end).map(x=>b.subarray(x.data_start,x.end).toString()):null;
 assert.deepEqual([s(2),num(3),parent,s(5),!!num(6),num(7),metadata],expectedFields[i]);assert.equal(get(8)?.hex,i===4?'':undefined);assert.deepEqual(fields.map(x=>x.number),[2,...(i?[3]:[]),4,5,...(i?[6]:[]),7,...(i===4?[8]:[]),...(metadata?[10]:[])]);
 fieldCatalog.push({start:f.start,end:f.end,payload_start:f.data_start,values:expectedFields[i],wire:fields});
 region(f.start,f.end,'schema field',`Schema Field tag1/wire2: name(tag2)=${s(2)},id(tag3)=${i}${i?'':' omitted/default'},parent_id(tag4)=${parent}${parent===-1?' ten-byte sign-extended varint':''},logical_type(tag5)=${s(5)},nullable(tag6)=${!!num(6)}${i?'':' omitted/default'},deprecated encoding(tag7)=${num(7)}. ${i===4?'Empty deprecated Dictionary tag8 is present with offset/length defaults0. ':''}${metadata?`Metadata tag10 entry key1=${metadata[0]},value2=${metadata[1]}. `:''}Field.type absent/default0; no extension/primary-key or unknown fields. Six schema identities map to five physical columns because items and item share the structural column.`);
}
region(fd[1].start,fd[1].end,'descriptor rows','FileDescriptor tag2/wire0 rows4097, bytes108120. No schema-level metadata or alignment before column metadata.');
for(const c of r.columns)region(c.table_offset,c.table_offset+16,'CMO entry',`CMO${c.index}: little-endian UInt64 column metadata position${c.position},size${c.size}. Physical order id,name,items,category,blob; all five table entries are contiguous and unframed.`);
region(500931,500947,'GBO entry','Global0 little-endian UInt64 descriptor position498048,size327; sole entry, unframed.');
for(const [a,z,note]of [[0,8,'UInt64 A498375 column metadata start'],[8,16,'UInt64 B500851 CMO start'],[16,24,'UInt64 C500931 GBO start'],[24,28,'UInt32 global buffers1'],[28,32,'UInt32 physical columns5'],[32,34,'UInt16 major2'],[34,36,'UInt16 minor2'],[36,40,'ASCII LANC, no trailing bytes or checksum']])region(500947+a,500947+z,'footer',note+'; integers little-endian.');
regions.sort((a,z)=>a.start-z.start);let at=0;for(const x of regions){assert.equal(x.start,at,`coverage at${at}`);at=x.end;}assert.equal(at,b.length);
const counts={rows:4097,pages:25,constant_pages:2,miniblock_pages:23,chunks:catalog.reduce((s,p)=>s+p.chunks.length,0),page_buffers:buffers.length,page_payload_bytes:buffers.reduce((s,x)=>s+x.end-x.start,0),page_padding_bytes:buffers.reduce((s,x)=>s+x.padded_end-x.end,0),blob_payload_bytes:4097*31,blob_padding_bytes:4097*33,child_values:rows.flatMap(x=>x.items??[]).length,child_nulls:rows.flatMap(x=>x.items??[]).filter(x=>x===null).length,list_level_entries:catalog.filter(x=>x.column===2).reduce((s,x)=>s+x.level_count,0),name_nulls:rows.filter(x=>x.name===null).length,list_nulls:rows.filter(x=>x.items===null).length,category_nulls:rows.filter(x=>x.category===null).length,regions:regions.length};
assert.equal(counts.page_payload_bytes+counts.page_padding_bytes+counts.blob_payload_bytes+counts.blob_padding_bytes,498048);
const report={...r,regions,page_catalog:catalog,buffers,blob_starts:blobStarts,descriptor_wire:fd,field_catalog:fieldCatalog,decoded_rows:rows,counts};
fs.writeFileSync(path.join(output,'analysis/iteration-070-v2_2-fixture.json'),JSON.stringify(report,null,2)+'\n');fs.writeFileSync(path.join(output,'evidence/binary/v2_2.lance'),b);fs.writeFileSync(path.join(output,'evidence/binary/v2_2-decoded-rows.json'),JSON.stringify(rows,null,2)+'\n');
console.log(JSON.stringify({counts,pages:catalog.map(p=>({column:p.column,page:p.page,chunks:p.chunks.map(c=>({n:c.num_values,levels:c.num_levels,bytes:c.end-c.start,rep:c.rep_size,def:c.def_size,values:c.value_size,widths:c.segments.flatMap(s=>(s.blocks??[]).map(b=>[s.kind,b.width??'raw',b.count]))})),repetition_index:p.repetition_index}))},null,2));
