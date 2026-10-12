import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {root,output,digest} from './inventory.mjs';
import {inspect,wire} from './inspect-embedded-fixtures.mjs';

const r=inspect('v2_0'),b=fs.readFileSync(path.join(root,r.source));
const regions=[],catalog=[],buffers=[],batches=[],rows=Array.from({length:4097},(_,id)=>({id})),children=[];
const align=n=>Math.ceil(n/64)*64;
const flat=(bits,index=0)=>({kind:'Flat',bits,buffer_index:index,buffer_type:0,compression:null});
const noNull=(bits,index=0)=>({kind:'Nullable',mode:1,children:[{field:1,encoding:flat(bits,index)}]});
const expectedItems=id=>id%11===0?null:[id,id%5===0?null:id*2,id*3];
const expectedName=id=>id%7===0?null:`value-${String(id).padStart(4,'0')}-deterministic-fixture`;
const expectedCategory=id=>id%13===0?null:['red','green','blue'][id%3];
const expectedBlob=id=>`blob-${String(id).padStart(4,'0')}-deterministic-payload`;
const expectedChildren=rows.flatMap(x=>expectedItems(x.id)??[]);
let pagePadding=0,blobPadding=0,unusedBits=0;
function region(start,end,kind,note){assert(end>start);regions.push({start,end,kind,note,sha256:digest(b.subarray(start,end))});}
function padding(start,end){assert(b.subarray(start,end).every(v=>v===0x48),`Non-H padding at ${start}-${end}`);}
function binaryValues(p,indices,bytes,count,adjustment){
 const raw=[],ends=[],values=[];let previous=0;
 for(let i=0;i<count;i++){
  const value=Number(b.readBigUInt64LE(p.offsets[indices]+i*8)),isNull=value>=adjustment,end=isNull?value-adjustment:value;
  assert(end>=previous&&end<=p.sizes[bytes]);if(isNull)assert.equal(end,previous);
  raw.push(value);ends.push(end);values.push(isNull?null:b.subarray(p.offsets[bytes]+previous,p.offsets[bytes]+end).toString());previous=end;
 }
 assert.equal(previous,p.sizes[bytes]);return {raw,ends,values};
}
assert.deepEqual(r.footer,{start:706117,column_metadata_start:619655,cmo_start:706005,gbo_start:706101,global_buffers:1,columns:6,major:0,minor:3,magic:'LANC'});
assert.deepEqual(r.globals,[{table_offset:706101,position:619328,size:327}]);
const blobStarts=[0,154560,309184,463808,618368];
for(let batch=0;batch<5;batch++){
 const first=batch*1024,count=Math.min(1024,4097-first),start=blobStarts[batch],end=start+count*64;
 for(let i=0;i<count;i++){const off=start+64*i;assert.equal(b.subarray(off,off+31).toString(),expectedBlob(first+i));padding(off+31,off+64);}
 blobPadding+=count*33;
 batches.push({batch,row_start:first,row_end:first+count,blob_start:start,blob_end:end,columns:[]});
 region(start,end,'blob payloads',`Batch${batch} out-of-line blob payloads for rows[${first},${first+count}). Each 64-byte record at ${start}+64*(r-${first}) contains exactly31 ASCII bytes blob-NNNN-deterministic-payload (NNNN=r padded to4 digits), then33 bytes 0x48 alignment padding. The ${count} payloads precede this batch's physical column pages. Blob descriptors point at these record starts with size31, excluding padding. No null or empty blob is present; no length prefix or compression.`);
}
for(const c of r.columns){
 assert.equal(c.column_encoding.type_url,'/lance.encodings.ColumnEncoding');
 assert.deepEqual(c.column_encoding.payload.map(f=>[f.number,f.hex]),c.index===5?[[3,'0a020a00']]:[[1,'']]);
 assert.deepEqual(c.wire.map(f=>f.number),[1,...Array(c.pages.length).fill(2)]);
 let at=0;
 for(const [i,p]of c.pages.entries()){
  assert.equal(p.priority,0);assert.equal(p.encoding_type,'/lance.encodings.ArrayEncoding');assert.deepEqual(p.wire.map(f=>f.number),[1,2,3,4]);
  let batch=c.index===3?(i<260?Math.floor(i/65):4):Math.floor(at/1024),batchInfo=batches[batch];
  const pc={column:c.index,page:i,batch,row_start:at,row_end:at+p.length,metadata_start:p.metadata_start,metadata_end:p.metadata_end,offsets:p.offsets,sizes:p.sizes,priority:p.priority};
  for(let j=0;j<p.offsets.length;j++){
   const start=p.offsets[j],end=start+p.sizes[j],paddedEnd=align(end);
   assert.equal(start%64,0);if(j)assert.equal(start,align(p.offsets[j-1]+p.sizes[j-1]));padding(end,paddedEnd);pagePadding+=paddedEnd-end;
   buffers.push({column:c.index,page:i,buffer:j,start,end,padded_end:paddedEnd});
  }
  let note='';
  if(c.index===0){
   assert.deepEqual(p.encoding,noNull(32));assert.equal(p.length,batch===4?1:i%17===16?48:61);assert.deepEqual(p.sizes,[p.length*4]);
   for(let n=0;n<p.length;n++)assert.equal(b.readInt32LE(p.offsets[0]+4*n),at+n);
   note=`id values ${at}..${at+p.length-1}: ${p.length} little-endian Int32 values in buffer0; no validity or compression. Encoding Nullable/NoNull/Flat32.`;
  }else if(c.index===1){
   assert.equal(p.encoding.kind,'Binary');assert.deepEqual(p.encoding.indices,noNull(64));assert.deepEqual({...p.encoding.bytes,compression:null},flat(8,1));assert.equal(p.encoding.bytes.compression.hex,'0a046e6f6e65');
   assert.equal(p.length,batch===4?1:8);assert.equal(p.sizes[0],p.length*8);assert.equal(p.encoding.null_adjustment,p.sizes[1]+1);
   Object.assign(pc,binaryValues(p,0,1,p.length,p.encoding.null_adjustment),{null_adjustment:p.encoding.null_adjustment});
   pc.values.forEach((value,n)=>{assert.equal(value,expectedName(at+n));rows[at+n].name=value;});
   note=`name binary values: buffer0 contains ${p.length} little-endian UInt64 cumulative ends [${pc.raw.join(',')}], with A=${pc.null_adjustment}; raw>=A means null and subtracting A yields the end. Buffer1 concatenates the nonnull32-byte ASCII value-NNNN-deterministic-fixture strings; null rows r%7=0 consume zero bytes. No leading zero or bitmap. Encoding Binary(NoNull/Flat64/page0,Flat8/page1,explicit compression none).`;
  }else if(c.index===2){
   assert.equal(p.encoding.kind,'List');assert.deepEqual(p.encoding.offsets,noNull(64));assert.equal(p.length,batch===4?1:1024);assert.equal(p.sizes[0],p.length*8);
   assert.equal(p.encoding.null_offset_adjustment,p.encoding.num_items+1);
   const raw=[],ends=[];let prev=0;
   for(let n=0;n<p.length;n++){
    const v=Number(b.readBigUInt64LE(p.offsets[0]+8*n)),isNull=v>=p.encoding.null_offset_adjustment,end=isNull?v-p.encoding.null_offset_adjustment:v;
    assert.equal(isNull,(at+n)%11===0);assert.equal(end-prev,isNull?0:3);rows[at+n].items=isNull?null:{child_start:(batch===0?0:2790+(batch-1)*2793)+prev,child_end:(batch===0?0:2790+(batch-1)*2793)+end};raw.push(v);ends.push(end);prev=end;
   }
   assert.equal(prev,p.encoding.num_items);Object.assign(pc,{raw,ends,num_items:prev,null_adjustment:p.encoding.null_offset_adjustment});
   note=`items list offsets: ${p.length} little-endian UInt64 cumulative child ends, no leading zero. A=${pc.null_adjustment}=num_items${prev}+1; raw>=A marks null and subtracting A yields the end. Rows r%11=0 have null lists and zero children; every other row advances by3. Offsets restart at zero for this batch and refer to the following column3 child pages, whose global child base is ${batch===0?0:2790+(batch-1)*2793}. Encoding List(NoNull/Flat64/page0,A,num_items). Full raw/end arrays appear in the linked catalog.`;
  }else if(c.index===3){
   assert.deepEqual(p.encoding,{kind:'Nullable',mode:2,children:[{field:1,encoding:flat(1)},{field:2,encoding:flat(32,1)}]});
   assert.equal(p.length,batch===4?1:i%65===64?(batch===0?38:41):43);assert.deepEqual(p.sizes,[Math.ceil(p.length/8),p.length*4]);
   const values=[],backing=[];
   for(let n=0;n<p.length;n++){
    const valid=!!(b[p.offsets[0]+(n>>3)]&(1<<(n%8))),v=b.readInt32LE(p.offsets[1]+n*4),expected=expectedChildren[at+n];
    assert.equal(valid,expected!==null);assert.equal(v,expected??0);values.push(valid?v:null);backing.push(v);children.push(valid?v:null);
   }
   for(let n=p.length;n<p.sizes[0]*8;n++){assert.equal((b[p.offsets[0]+(n>>3)]>>(n%8))&1,0);unusedBits++;}
   Object.assign(pc,{values,backing_values:backing,validity_hex:b.subarray(p.offsets[0],p.offsets[0]+p.sizes[0]).toString('hex')});
   note=`items.item child positions[${at},${at+p.length}): buffer0 is ${p.sizes[0]} bytes of least-significant-bit-first validity (${pc.validity_hex}); unused high bits in its final byte are zero. Buffer1 stores ${p.length} little-endian Int32 values. For each nonnull list row r, children are r, (null if r%5=0 else2*r), 3*r; invalid child backing is0. Encoding Nullable/SomeNull(validity Flat1/page0,values Flat32/page1), including pages where every bit is valid. These are child positions, not Dataset row positions.`;
  }else if(c.index===4){
   assert.deepEqual(p.encoding,{kind:'Dictionary',indices:noNull(8),items:{kind:'Binary',indices:noNull(64,1),bytes:flat(8,2),null_adjustment:13},num_dictionary_items:4});
   assert.equal(p.length,batch===4?1:i%15===14?58:69);assert.deepEqual(p.sizes,[p.length,32,12]);
   const dict=binaryValues(p,1,2,4,13);assert.deepEqual(dict,{raw:[5,9,12,25],ends:[5,9,12,12],values:['green','blue','red',null]});
   const keys=Array.from(b.subarray(p.offsets[0],p.offsets[0]+p.length));keys.forEach((k,n)=>{assert(k<4);const v=dict.values[k];assert.equal(v,expectedCategory(at+n));rows[at+n].category=v;});Object.assign(pc,{keys,dictionary:dict});
   note=`category dictionary: buffer0 has ${p.length} one-byte keys (0 green,1 blue,2 red,3 null). Buffer1 has four little-endian UInt64 ends [5,9,12,25], A13 normalizes them to [5,9,12,12]; buffer2 is ASCII greenbluered (12 bytes). Each page repeats all four dictionary items, even the final nonnull-only page. Null keys r%13=0 become ordinary key3 addressing a null dictionary item; no key validity bitmap. Encoding Dictionary(NoNull/Flat8/page0,Binary(NoNull/Flat64/page1,Flat8/page2,A13),4); payload Flat8 compression metadata is absent, although schema requests dict-values-compression=none.`;
  }else{
   assert.deepEqual(p.encoding,{kind:'PackedStruct',inner:[noNull(64),noNull(64)],buffer:[]});assert.equal(p.length,batch===4?1:64);assert.deepEqual(p.sizes,[p.length*16]);
   const descriptors=[];
   for(let n=0;n<p.length;n++){
    const position=Number(b.readBigUInt64LE(p.offsets[0]+n*16)),size=Number(b.readBigUInt64LE(p.offsets[0]+n*16+8));
    assert.equal(position,blobStarts[batch]+(at+n-batch*1024)*64);assert.equal(size,31);const value=b.subarray(position,position+size).toString();assert.equal(value,expectedBlob(at+n));rows[at+n].blob=value;descriptors.push({position,size});
   }
   pc.descriptors=descriptors;
   note=`blob descriptions: ${p.length} interleaved little-endian UInt64(position,size) pairs; position=${blobStarts[batch]}+64*(r-${batch*1024}) and size31. Encoding PackedStruct with two NoNull/Flat64 children, whose page0 references are local to each child, and one packed page0 buffer. Column envelope Blob(inner Values) restores LargeBinary semantics. No separate validity, null/empty blobs, four-field BlobV2 descriptions or external file references occur.`;
  }
  const start=p.offsets[0],end=align(p.offsets.at(-1)+p.sizes.at(-1));
  const pad=p.offsets.reduce((sum,v,j)=>sum+align(v+p.sizes[j])-v-p.sizes[j],0);
  region(start,end,'page',`Column${c.index} page${i}, batch${batch}, ${c.index===3?'child':'row'} interval[${at},${at+p.length}). Buffers start[${p.offsets}] with unpadded byte sizes[${p.sizes}]; each buffer is followed by enough 0x48 bytes to align its end to64 (${pad} padding bytes total). ${note} Page metadata occupies[${p.metadata_start},${p.metadata_end}); stored priority is omitted/default0, so cumulative lengths define order.`);
  catalog.push(pc);at+=p.length;batchInfo.columns.push({column:c.index,page:i,start,end,length:p.length});
 }
 assert.equal(at,c.index===3?11172:4097);
}
assert.deepEqual(children,expectedChildren);
for(const row of rows){if(row.items!==null)row.items=children.slice(row.items.child_start,row.items.child_end);assert.deepEqual(row.items,expectedItems(row.id));}
const fd=wire(b,619328,619655),schema=wire(b,fd[0].data_start,fd[0].end);
assert.deepEqual(fd.map(f=>f.number),[1,2]);assert.equal(fd[1].value,'4097');assert.equal(schema.length,6);assert(schema.every(f=>f.number===1));
region(619328,619331,'descriptor envelope','FileDescriptor tag1/wire2 (0a) followed by varint Schema length321 (c1 02). Unframed global buffer0 begins here; no u32 size prefix. Schema spans[619331,619652).');
const expectedFields=[['id',0,-1,'int32',false,1,null],['name',1,-1,'string',true,2,['lance-encoding:compression','none']],['items',2,-1,'list',true,1,null],['item',3,2,'int32',true,1,null],['category',4,-1,'dict:string:int8:false',true,3,['lance-encoding:dict-values-compression','none']],['blob',5,-1,'large_binary',true,2,['lance-encoding:blob','true']]];
const fieldCatalog=[];
for(const [i,f]of schema.entries()){
 const fields=wire(b,f.data_start,f.end),get=n=>fields.find(x=>x.number===n),s=n=>b.subarray(get(n).data_start,get(n).end).toString(),n=k=>Number(get(k)?.value??0),e=expectedFields[i];
 const metadata=get(10)?wire(b,get(10).data_start,get(10).end).map(x=>b.subarray(x.data_start,x.end).toString()):null;
 const parent=get(4).value==='18446744073709551615'?-1:n(4);
 assert.deepEqual([s(2),n(3),parent,s(5),!!n(6),n(7),metadata],e);assert.equal(get(8)?.hex,i===4?'':undefined);
 assert.deepEqual(fields.map(x=>x.number),[2,...(i?[3]:[]),4,5,...(i?[6]:[]),7,...(i===4?[8]:[]),...(metadata?[10]:[])]);
 fieldCatalog.push({start:f.start,end:f.end,payload_start:f.data_start,name:e[0],id:e[1],parent_id:parent,logical_type:e[3],nullable:e[4],legacy_encoding:e[5],metadata,wire:fields});
 region(f.start,f.end,'schema field',`Schema repeated Field tag1/wire2, payload${f.end-f.data_start} bytes: name=${e[0]} (tag2), id=${i}${i?' (tag3)':' (omitted/default)'}, parent_id=${parent} (tag4${parent===-1?', ten-byte sign-extended varint':''}), logical_type=${e[3]} (tag5), nullable=${e[4]}${i?' (tag6)':' (omitted/default)'}, legacy encoding=${e[5]} (tag7; 1 Plain,2 VarBinary,3 Dictionary).${i===4?' Empty Dictionary tag8 is present: offset and length default0 in the serialized schema.':''}${metadata?` Metadata tag10 entry has key(tag1)=${metadata[0]} and value(tag2)=${metadata[1]}.`:''} Field type defaults0, extension/primary-key metadata absent; no unknown fields. This is flattened field identity, not a one-to-one column map: items/id2 owns child item/id3.`);
}
region(619652,619655,'descriptor rows','FileDescriptor tag2/wire0 length4097 encoded 10 81 20. Schema carries no schema-level metadata; the descriptor ends without alignment padding immediately before column0 metadata.');
for(const c of r.columns){
 const extra=c.index===5?'ColumnEncoding tag3 Blob contains tag1 inner ColumnEncoding Values (hex1a040a020a00); leading wrapper47 bytes.':'ColumnEncoding tag1 Values is an explicitly empty message (hex0a00); leading wrapper43 bytes.';
 const tree=['Nullable/NoNull/Flat32/page0','Binary(NoNull/Flat64/page0,Flat8/page1 with compression none,A)','List(NoNull/Flat64/page0,A,num_items)','Nullable/SomeNull(Flat1/page0,Flat32/page1)','Dictionary(NoNull/Flat8/page0,Binary(NoNull/Flat64/page1,Flat8/page2,A13),4)','PackedStruct(two NoNull/Flat64 child-local page0 encodings,packed page0)'][c.index];
 region(c.position,c.position+c.size,'column metadata',`Column${c.index} metadata, ${c.size} bytes: tag1 Encoding->tag2 DirectEncoding->tag1 bytes holding google.protobuf.Any(type_url=/lance.encodings.ColumnEncoding,value=column encoding). ${extra} Follow ${c.pages.length} repeated tag2 Pages. Each page stores packed tag1 absolute buffer_offsets, packed tag2 unpadded buffer_sizes, tag3 logical length and tag4 Encoding->DirectEncoding->Any(type_url=/lance.encodings.ArrayEncoding). Its encoding tree is ${tree}. Page priority tag5 is absent/default0; no column buffer offsets/sizes, deferred encodings, unknown fields, framing prefixes or padding. Complete wire trees and all page intervals/buffer tuples are in the catalog. Tags/length varints delimit each nested message; trailing metadata ends exactly at the next column/table.`);
}
for(const c of r.columns)region(c.table_offset,c.table_offset+16,'CMO entry',`CMO entry${c.index}: little-endian UInt64 metadata position${c.position}, then UInt64 size${c.size}; no framing or padding. Six contiguous entries preserve physical column order id,name,items offsets,items.item,category,blob descriptions.`);
region(706101,706117,'GBO entry','GBO entry0: little-endian UInt64 descriptor position619328, then UInt64 size327; the only global buffer. This table follows all six CMO entries without padding.');
for(const [a,z,note]of [[0,8,'UInt64 A=619655, start of column metadata'],[8,16,'UInt64 B=706005, start of six-entry CMO table'],[16,24,'UInt64 C=706101, start of one-entry GBO table'],[24,28,'UInt32 global buffer count1'],[28,32,'UInt32 physical column count6'],[32,34,'UInt16 major0'],[34,36,'UInt16 minor3, completing standard V2_0 pair(0,3), distinct from embedded pair(2,0)'],[36,40,'ASCII LANC (4c414e43), final magic; no trailing bytes or checksum']])region(706117+a,706117+z,'footer',`${note}. Integer fields are little-endian; complete footer has40 bytes.`);
regions.sort((a,z)=>a.start-z.start);let end=0;for(const x of regions){assert.equal(x.start,end,`Coverage gap at ${end}`);end=x.end;}assert.equal(end,b.length);
const counts={rows:rows.length,children:children.length,name_nulls:rows.filter(x=>x.name===null).length,list_nulls:rows.filter(x=>x.items===null).length,child_nulls:children.filter(x=>x===null).length,category_nulls:rows.filter(x=>x.category===null).length,blob_nulls:0,pages:catalog.length,page_buffers:buffers.length,page_payload_bytes:buffers.reduce((n,x)=>n+x.end-x.start,0),page_padding_bytes:pagePadding,blob_payload_bytes:4097*31,blob_padding_bytes:blobPadding,unused_bitmap_bits:unusedBits,descriptor_bytes:327,column_metadata_bytes:86350,cmo_bytes:96,gbo_bytes:16,footer_bytes:40,regions:regions.length};
assert.deepEqual([counts.name_nulls,counts.list_nulls,counts.child_nulls,counts.category_nulls],[586,373,745,316]);
assert.equal(counts.page_payload_bytes+pagePadding+counts.blob_payload_bytes+blobPadding,619328);
const report={...r,regions,page_catalog:catalog,buffers,batches,descriptor_wire:fd,field_catalog:fieldCatalog,decoded_rows:rows,counts};
fs.writeFileSync(path.join(output,'analysis/iteration-068-v2_0-fixture.json'),JSON.stringify(report,null,2)+'\n');
fs.writeFileSync(path.join(output,'evidence/binary/v2_0.lance'),b);
fs.writeFileSync(path.join(output,'evidence/binary/v2_0-decoded-rows.json'),JSON.stringify(rows,null,2)+'\n');
console.log(JSON.stringify({counts,batches:batches.map(x=>({...x,columns:[0,1,2,3,4,5].map(c=>{const p=x.columns.filter(p=>p.column===c);return {column:c,start:p[0].start,end:p.at(-1).end,pages:p.length,values:p.reduce((s,p)=>s+p.length,0)}})}))},null,2));
