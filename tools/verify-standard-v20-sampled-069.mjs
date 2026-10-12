import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {root,output,digest} from './inventory.mjs';

// Independent construction: no parser, inspection report, or source bytes feed assembly.
const join=(...chunks)=>Buffer.concat(chunks.flat());
function varint(value){let n=BigInt(value),a=[];do{let low=Number(n&127n);n>>=7n;a.push(low|(n?128:0));}while(n);return Buffer.from(a);}
const scalar=(tag,n)=>join(varint(tag*8),varint(n));
const field=(tag,data)=>join(varint(tag*8+2),varint(data.length),data);
const text=(tag,s)=>field(tag,Buffer.from(s));
function le(value,size=8){let a=Buffer.alloc(size);if(size===8)a.writeBigUInt64LE(BigInt(value));else if(size===4)a.writeUInt32LE(value);else a.writeUInt16LE(value);return a;}
const empty=Buffer.alloc(0);
const flat=(bits,index=0,none=false)=>field(1,join(scalar(1,bits),field(2,index?scalar(1,index):empty),none?field(3,text(1,'none')):empty));
const noNull=(bits,index=0)=>field(2,field(1,field(1,flat(bits,index))));
const binary=(a,index=0,none=false)=>field(6,join(field(1,noNull(64,index)),field(2,flat(8,index+1,none)),scalar(3,a)));
const direct=(type,data)=>field(2,field(1,join(text(1,`/lance.encodings.${type}`),field(2,data))));
const chunks=[],pages=Array.from({length:6},()=>[]);let cursor=0;
function append(data,pad=false){const start=cursor;chunks.push(data);cursor+=data.length;if(pad){const n=(64-data.length%64)%64;chunks.push(Buffer.alloc(n,0x48));cursor+=n;}return start;}
function page(column,data,length,encoding){const offsets=data.map(a=>append(a,true));pages[column].push(field(2,join(field(1,join(offsets.map(varint))),field(2,join(data.map(a=>varint(a.length)))),scalar(3,length),field(4,direct('ArrayEncoding',encoding)))));}
function split(a,size){return Array.from({length:Math.ceil(a.length/size)},(_,i)=>a.slice(i*size,(i+1)*size));}
const rows=Array.from({length:4097},(_,id)=>({id,name:id%7===0?null:`value-${String(id).padStart(4,'0')}-deterministic-fixture`,items:id%11===0?null:[id,id%5===0?null:id*2,id*3],category:id%13===0?null:['red','green','blue'][id%3],blob:`blob-${String(id).padStart(4,'0')}-deterministic-payload`}));
for(const batch of split(rows,1024)){
 const positions=batch.map(r=>append(Buffer.from(r.blob),true));
 for(const part of split(batch,61))page(0,[join(part.map(r=>le(r.id,4)))],part.length,noNull(32));
 for(const part of split(batch,8)){
  const strings=join(part.filter(r=>r.name!==null).map(r=>Buffer.from(r.name))),a=strings.length+1;let end=0;
  const indices=join(part.map(r=>{if(r.name!==null)end+=32;return le(end+(r.name===null?a:0));}));page(1,[indices,strings],part.length,binary(a,0,true));
 }
 const children=batch.flatMap(r=>r.items??[]),a=children.length+1;let end=0;
 const list=join(batch.map(r=>{if(r.items)end+=r.items.length;return le(end+(r.items===null?a:0));}));
 page(2,[list],batch.length,field(4,join(field(1,noNull(64)),scalar(2,a),scalar(3,children.length))));
 for(const part of split(children,batch.length===1?1:43)){
  const validity=Buffer.alloc(Math.ceil(part.length/8));part.forEach((v,i)=>{if(v!==null)validity[i>>3]|=1<<(i%8);});
  page(3,[validity,join(part.map(v=>le(v??0,4)))],part.length,field(2,field(2,join(field(1,flat(1)),field(2,flat(32,1))))));
 }
 for(const part of split(batch,69)){
  const keys=Buffer.from(part.map(r=>r.category===null?3:{green:0,blue:1,red:2}[r.category]));
  page(4,[keys,join([5,9,12,25].map(n=>le(n))),Buffer.from('greenbluered')],part.length,field(7,join(field(1,noNull(8)),field(2,binary(13,1)),scalar(3,4))));
 }
 for(let start=0;start<batch.length;start+=64){const part=positions.slice(start,start+64);page(5,[join(part.map(pos=>join(le(pos),le(31))))],part.length,field(9,join(field(1,noNull(64)),field(1,noNull(64)),field(2,empty))));}
}
const dataSize=cursor;assert.equal(dataSize,619328);
const schemaFields=[['id',0,-1,'int32',false,1,null],['name',1,-1,'string',true,2,['lance-encoding:compression','none']],['items',2,-1,'list',true,1,null],['item',3,2,'int32',true,1,null],['category',4,-1,'dict:string:int8:false',true,3,['lance-encoding:dict-values-compression','none']],['blob',5,-1,'large_binary',true,2,['lance-encoding:blob','true']]];
const schema=join(schemaFields.map(([name,id,parent,type,nullable,encoding,metadata])=>field(1,join(text(2,name),id?scalar(3,id):empty,scalar(4,parent===-1?(1n<<64n)-1n:parent),text(5,type),nullable?scalar(6,1):empty,scalar(7,encoding),id===4?field(8,empty):empty,metadata?field(10,join(text(1,metadata[0]),text(2,metadata[1]))):empty))));
const descriptor=join(field(1,schema),scalar(2,4097)),descriptorPosition=append(descriptor),metadataStart=cursor;
const columns=pages.map((p,i)=>join(field(1,direct('ColumnEncoding',i===5?field(3,field(1,field(1,empty))):field(1,empty))),p));
const columnPositions=columns.map(c=>append(c)),cmo=cursor;
append(join(columns.map((c,i)=>join(le(columnPositions[i]),le(c.length)))));const gbo=cursor;
append(join(le(descriptorPosition),le(descriptor.length)));
append(join(le(metadataStart),le(cmo),le(gbo),le(1,4),le(6,4),le(0,2),le(3,2),Buffer.from('LANC')));
const expected=join(chunks);
assert.equal(expected.length,706157);assert.deepEqual(columns.map(c=>c.length),[4527,48263,419,20817,6753,5571]);
// Read actual evidence only after the full expected byte sequence is complete.
const source='rust/lance-file/test_data/exact_versions/v2_0.lance';
assert.deepEqual(fs.readFileSync(path.join(root,source)),expected,'Source byte mismatch');
assert.deepEqual(fs.readFileSync(path.join(output,'evidence/binary/v2_0.lance')),expected,'Preserved byte mismatch');
assert.deepEqual(JSON.parse(fs.readFileSync(path.join(output,'evidence/binary/v2_0-decoded-rows.json'))),rows,'Decoded row mismatch');
const report={iteration:69,at:new Date().toISOString(),source,pass:true,compared_bytes:expected.length,compared_rows:rows.length,sha256:digest(expected),pages:pages.map(p=>p.length),column_metadata_positions:columnPositions,column_metadata_sizes:columns.map(c=>c.length),descriptor_position:descriptorPosition,descriptor_size:descriptor.length,cmo,gbo,method:'Independent full expected-byte assembly using documented row formulas, batch/page partitions, alignment bytes and protobuf tags. No parser/report/source bytes or offsets used before full expected assembly; compares every source and preserved byte plus all decoded rows.',repository_runtime_executed:false};
fs.writeFileSync(path.join(output,'verification/iteration-069-sampled-v20-reconstruction.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
