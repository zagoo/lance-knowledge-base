// KB-side offline inspection only. No repository code, dependency or generator is executed.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {root,output,digest} from './inventory.mjs';
const source='rust/lance-file/test_data/exact_versions/v1.lance';
const bytes=fs.readFileSync(path.join(root,source));
assert.equal(digest(bytes),'fa8b3d81b9d4fd4ade5a7c3d077ebf2155664e12b9335e26fac1c0d0774e916c');
const regions=[],pages=[],rows=[],batchReports=[];
const integer=(offset,width)=>width===1?bytes.readInt8(offset):width===4?bytes.readInt32LE(offset):Number(bytes.readBigInt64LE(offset));
const region=(start,end,kind,description,details={})=>{
 assert(Number.isSafeInteger(start)&&Number.isSafeInteger(end)&&end>start&&start>=0&&end<=bytes.length);
 regions.push({start,end,length:end-start,kind,description,sha256:digest(bytes.subarray(start,end)),...details});
};
const vector=(offset,n,width)=>Array.from({length:n},(_,i)=>integer(offset+i*width,width));
const footer=bytes.length-16,metadata=Number(bytes.readBigUInt64LE(footer));
assert.equal(bytes.subarray(-4).toString('ascii'),'LANC');
assert.equal(bytes.readUInt16LE(footer+8),0);assert.equal(bytes.readUInt16LE(footer+10),2);
const metadataSize=bytes.readUInt32LE(metadata);assert.equal(metadata+4+metadataSize,footer);
let cursor=metadata+4;
const varint=()=>{let value=0n,shift=0n;for(;;){assert(cursor<footer);const b=bytes[cursor++];value|=BigInt(b&127)<<shift;if(b<128){assert(value<=BigInt(Number.MAX_SAFE_INTEGER));return Number(value);}shift+=7n;assert(shift<70n);}};
assert.equal(varint(),18);const packedLength=varint(),packedEnd=cursor+packedLength;
const batchOffsets=[];while(cursor<packedEnd)batchOffsets.push(varint());assert.equal(cursor,packedEnd);
assert.deepEqual(batchOffsets,[0,1024,2048,3072,4096,4097]);
assert.equal(varint(),24);const table=varint();assert.equal(cursor,footer);
const fieldNames=['id','name','items','items.item','category','blob'];
for(let field=0;field<6;field++)for(let batch=0;batch<5;batch++){
 const cell=table+(field*5+batch)*16;
 pages.push({field_id:field,field_name:fieldNames[field],batch,cell,position:integer(cell,8),logical_length:integer(cell+8,8)});
}
let next=0;
const dictionary=['green','blue','red'];
for(let batch=0;batch<5;batch++){
 const first=batchOffsets[batch],last=batchOffsets[batch+1],n=last-first;
 const page=field=>pages.find(p=>p.field_id===field&&p.batch===batch);
 const p0=page(0),p1=page(1),p2=page(2),p3=page(3),p4=page(4),p5=page(5);
 const context={batch,rows:[first,last]};
 assert.equal(p0.position,next);assert.equal(p0.logical_length,n);
 const ids=vector(next,n,4);assert.deepEqual(ids,Array.from({length:n},(_,i)=>first+i));
 region(next,next+4*n,'int32-values',`Batch ${batch}: id is every integer from ${first} through ${last-1}, in signed little-endian Int32.`,{...context,field_id:0,elements:n,formula:'id[i] = first_row + i'});next+=4*n;
 assert.equal(p1.logical_length,n);const namesPos=vector(p1.position,n+1,8);
 assert.equal(namesPos[0],next);assert.equal(namesPos[n],p1.position);
 const names=[];let nullNames=0;
 for(let i=0;i<n;i++){
  const global=first+i,expected=global%7===0?null:`value-${String(global).padStart(4,'0')}-deterministic-fixture`;
  assert(namesPos[i+1]>=namesPos[i]);
  const actual=bytes.subarray(namesPos[i],namesPos[i+1]);
  assert.deepEqual(actual,Buffer.from(expected??''));
  assert.equal(namesPos[i+1]-namesPos[i],expected===null?0:32);
  names.push(expected);if(expected===null)nullNames++;
 }
 region(next,p1.position,'utf8-values',`Batch ${batch}: concatenated non-null 32-byte name strings; rows divisible by7 contribute no bytes.`,{...context,field_id:1,nonnull:n-nullNames,nulls:nullNames});
 region(p1.position,p1.position+8*(n+1),'absolute-int64-offsets',`Batch ${batch}: ${n+1} signed little-endian absolute name positions; equal neighboring values identify null in this nullable schema.`,{...context,field_id:1,values:namesPos});next=p1.position+8*(n+1);
 assert.equal(p2.position,next);assert.equal(p2.logical_length,n+1);
 const listPos=vector(p2.position,n+1,4),expectedListPos=[0],expectedChildren=[],listInput=[],listDecoded=[];
 for(let i=0;i<n;i++){
  const global=first+i;
  const original=global%11===0?null:[global,global%5===0?null:global*2,global*3];
  const decoded=original?.map(x=>x??0)??[];
  listInput.push(original);listDecoded.push(decoded);expectedChildren.push(...decoded);expectedListPos.push(expectedChildren.length);
 }
 assert.deepEqual(listPos,expectedListPos);
 region(next,next+4*(n+1),'relative-int32-list-offsets',`Batch ${batch}: ${n+1} relative child offsets starting at0, incrementing0 for rows divisible by11 and3 otherwise. No parent validity bytes exist.`,{...context,field_id:2,values:listPos});next+=4*(n+1);
 assert.equal(p3.position,next);assert.equal(p3.logical_length,expectedChildren.length);
 const children=vector(next,p3.logical_length,4);assert.deepEqual(children,expectedChildren);
 region(next,next+4*children.length,'int32-list-child-values',`Batch ${batch}: triples [row, row%5==0 ? 0 : 2*row, 3*row] for rows not divisible by11. Null child payloads are zero and no child validity bytes exist.`,{...context,field_id:3,elements:children.length,zeroed_null_children:listInput.filter(a=>a&&a[1]===null).length});next+=4*children.length;
 assert.equal(p4.position,next);assert.equal(p4.logical_length,n);
 const keys=vector(next,n,1),expectedKeys=Array.from({length:n},(_,i)=>{const r=first+i;return r%13===0?0:[2,0,1][r%3];});assert.deepEqual(keys,expectedKeys);
 region(next,next+n,'int8-dictionary-keys',`Batch ${batch}: signed Int8 keys into [green,blue,red]. Original null category keys (row%13==0) store0; no validity bytes exist. Other keys map row%3 of0/1/2 to2/0/1.`,{...context,field_id:4,elements:n,original_null_keys:expectedKeys.filter((_,i)=>(first+i)%13===0).length});next+=n;
 assert.equal(p5.logical_length,n);const blobPos=vector(p5.position,n+1,8);assert.equal(blobPos[0],next);assert.equal(blobPos[n],p5.position);
 const blobs=[];
 for(let i=0;i<n;i++){
  const expected=`blob-${String(first+i).padStart(4,'0')}-deterministic-payload`;
  assert.deepEqual(bytes.subarray(blobPos[i],blobPos[i+1]),Buffer.from(expected));assert.equal(blobPos[i+1]-blobPos[i],31);blobs.push(expected);
 }
 region(next,p5.position,'binary-values',`Batch ${batch}: ${n} non-null 31-byte blob payloads stored inline as ASCII/UTF-8, despite the supplied field's blob metadata.`,{...context,field_id:5,elements:n});
 region(p5.position,p5.position+8*(n+1),'absolute-int64-offsets',`Batch ${batch}: ${n+1} signed little-endian absolute blob positions, uniformly31 bytes apart.`,{...context,field_id:5,values:blobPos});next=p5.position+8*(n+1);
 for(let i=0;i<n;i++)rows.push({row:first+i,id:ids[i],name:names[i],items_input:listInput[i],items_v1:listDecoded[i],category_key:keys[i],category_input:(first+i)%13===0?null:dictionary[keys[i]],category_v1:dictionary[keys[i]],blob:blobs[i]});
 batchReports.push({batch,rows:[first,last],row_count:n,start:p0.position,end:next,name_nulls:nullNames,list_nulls:listInput.filter(x=>x===null).length,list_child_nulls:listInput.filter(x=>x?.[1]===null).length,child_count:children.length,category_nulls:rows.slice(-n).filter(r=>r.category_input===null).length});
}
assert.equal(next,table);
for(const p of pages)region(p.cell,p.cell+16,'page-table-cell',`Field ${p.field_id} (${p.field_name}), batch ${p.batch}: signed Int64 pair (${p.position}, ${p.logical_length}); length counts logical elements, not bytes.`,p);
next=table+480;
assert.deepEqual(bytes.subarray(next,next+12),Buffer.from('greenbluered'));
region(next,next+12,'dictionary-utf8-values','Dictionary entries in first-seen order: green (5 bytes), blue (4), red (3). These bytes follow the page table, outside batch data.',{values:dictionary});
const dictionaryPositions=vector(next+12,4,8);assert.deepEqual(dictionaryPositions,[next,next+5,next+9,next+12]);
region(next+12,next+44,'dictionary-absolute-offsets','Four signed Int64 absolute positions frame three UTF-8 dictionary values. External schema dictionary.offset is387064 and dictionary.length is3 for loading this block.',{values:dictionaryPositions});
assert.equal(next+44,metadata);
region(metadata,metadata+4,'protobuf-frame-length','Unsigned little-endian32 length17 framing the following Metadata protobuf, excluding this prefix.',{value:metadataSize});
region(metadata+4,footer,'metadata-protobuf','Exactly two fields: packed batch_offsets tag2 with [0,1024,2048,3072,4096,4097], then page_table_position tag3=386572. No manifest_position or statistics field is encoded.',{hex:bytes.subarray(metadata+4,footer).toString('hex'),batch_offsets:batchOffsets,page_table_position:table,manifest_position_default:0,statistics_present:false});
region(footer,footer+8,'footer-metadata-pointer','Signed little-endian64 metadata frame start387096, a nonnegative stored value.',{value:metadata});
region(footer+8,footer+10,'footer-major','Signed little-endian16 major0.',{value:0});
region(footer+10,footer+12,'footer-minor','Signed little-endian16 minor2: the V1 footer identity.',{value:2});
region(footer+12,footer+16,'footer-magic','Four exact ASCII bytes LANC, hex4c414e43.',{value:'LANC'});
regions.sort((a,b)=>a.start-b.start);let covered=0;for(const r of regions){assert.equal(r.start,covered);covered=r.end;}assert.equal(covered,bytes.length);
const report={source,sha256:digest(bytes),size:bytes.length,interval_convention:'zero-based half-open [start,end)',inspected_at:new Date().toISOString(),method:'KB-only Node parser reads every byte, decodes all30 table cells and4097 rows, and asserts every payload/offset against deterministic generator formulas. No source build/test/generator or Lance runtime invoked.',coverage:{regions:regions.length,bytes:covered,gaps:[],overlaps:[],uninterpreted_bytes:0},footer:{start:footer,metadata_start:metadata,major:0,minor:2,magic:'LANC'},metadata:{frame_size:metadataSize,batch_offsets:batchOffsets,page_table_position:table,manifest_position_default:0,statistics_present:false},dictionary:{values:dictionary,data_start:table+480,positions_start:table+492,positions:dictionaryPositions},batches:batchReports,pages,regions,logical_row_count:rows.length,totals:{name_nulls:batchReports.reduce((n,b)=>n+b.name_nulls,0),original_list_nulls:batchReports.reduce((n,b)=>n+b.list_nulls,0),original_child_nulls:batchReports.reduce((n,b)=>n+b.list_child_nulls,0),original_category_nulls:batchReports.reduce((n,b)=>n+b.category_nulls,0),child_values:batchReports.reduce((n,b)=>n+b.child_count,0)}};
fs.mkdirSync(path.join(output,'evidence/binary'),{recursive:true});
fs.writeFileSync(path.join(output,'evidence/binary/v1.lance'),bytes);
fs.writeFileSync(path.join(output,'analysis/iteration-066-v1-fixture.json'),JSON.stringify(report,null,2)+'\n');
fs.writeFileSync(path.join(output,'evidence/binary/v1-decoded-rows.json'),JSON.stringify({source,sha256:report.sha256,semantics:'Input null intent comes from generator formulas. V1 values are decoded from checked bytes under the supplied external schema. Full Lance runtime was not executed.',rows},null,2)+'\n');
console.log(JSON.stringify({source,size:bytes.length,coverage:report.coverage,footer:report.footer,metadata:report.metadata,dictionary:report.dictionary,batches:batchReports,totals:report.totals},null,2));
