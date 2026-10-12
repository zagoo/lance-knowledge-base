import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {root,output,digest} from './inventory.mjs';

// Assemble all expected bytes before opening either source bytes or decoder evidence.
const join=(...a)=>Buffer.concat(a.flat()),empty=Buffer.alloc(0);
function vint(v){let n=BigInt(v),out=[];do{out.push(Number(n&127n)|(n>=128n?128:0));n>>=7n;}while(n);return Buffer.from(out);}
const scalar=(t,v)=>join(vint(t*8),vint(v)),field=(t,b)=>join(vint(t*8+2),vint(b.length),b),str=(t,s)=>field(t,Buffer.from(s));
function le(v,n=8){const b=Buffer.alloc(n);if(n===8)b.writeBigUInt64LE(BigInt(v));else b.writeUIntLE(v,0,n);return b;}
const padded=(b,a,fill)=>join(b,Buffer.alloc((a-b.length%a)%a,fill));
const split=(a,n)=>Array.from({length:Math.ceil(a.length/n)},(_,i)=>a.slice(i*n,i*n+n));
const flat=n=>field(1,scalar(1,n)),inline=n=>field(5,scalar(1,n)),ool=(n,w)=>field(4,join(scalar(1,n),field(3,flat(w)))),variable=()=>field(2,field(1,flat(32))),packed=()=>field(12,join(field(1,join(vint(64),vint(64))),field(2,flat(128))));
function layout({rep,def,values,dictionary,layers,count,depth=0}){return field(1,join(rep?field(1,rep):empty,def?field(2,def):empty,field(3,values),dictionary?join(field(4,dictionary),scalar(5,3)):empty,field(6,join(layers.map(vint))),scalar(7,1),depth?scalar(8,depth):empty,scalar(9,count)));}
const direct=(url,payload)=>field(2,field(1,join(str(1,url),field(2,payload))));
function pack(values,T,W){
 const out=Buffer.alloc(128*W),order=[0,4,2,6,1,5,3,7],lanes=1024/T;
 // Write each source bit to its transposed lane/word position independently of the decoder.
 for(let lane=0;lane<lanes;lane++)for(let row=0;row<T;row++){
  const index=order[Math.floor(row/8)]*16+(row%8)*128+lane,v=values[index]??0;
  assert(v<2**W||W===0&&v===0);
  for(let bit=0;bit<W;bit++)if(Math.floor(v/2**bit)%2){const logical=row*W+bit,word=Math.floor(logical/T),within=logical%T,absolute=(word*lanes+lane)*T+within;out[absolute>>3]|=1<<(absolute%8);}
 }
 return out;
}
function inlineData(values,T){const W=Math.max(...values).toString(2).length*(values.some(v=>v!==0)?1:0);return join(le(W,T/8),pack(values,T,W));}
function oolData(values,T,W){return join(split(values,1024).map(a=>a.length===1024||W*(1024-a.length)<(T-W)*a.length?pack(a,T,W):join(a.map(v=>le(v,T/8)))));}
function chunk({rep=null,def=null,data,numLevels=0,n,log}){
 const header=join(le(numLevels,2),rep?le(rep.length,2):empty,def?le(def.length,2):empty,le(data.length,2));
 const bytes=join(padded(header,8,0xfe),rep?padded(rep,8,0xfe):empty,def?padded(def,8,0xfe):empty,padded(data,8,0xfe));
 return {bytes,meta:le(((bytes.length/8-1)<<4)|log,2),n};
}
const outputChunks=[],pages=Array.from({length:5},()=>[]),pageSummary=[];let cursor=0;
function append(b,pad=false){const position=cursor,out=pad?padded(b,64,0x48):b;outputChunks.push(out);cursor+=out.length;return position;}
function page(column,batch,chunkList,extra,encoding){const data=[join(chunkList.map(c=>c.meta)),join(chunkList.map(c=>c.bytes)),...extra],offsets=data.map(b=>append(b,true)),length=batch.length,priority=batch[0].id;
 pages[column].push(field(2,join(field(1,join(offsets.map(vint))),field(2,join(data.map(b=>vint(b.length)))),scalar(3,length),field(4,direct('/lance.encodings21.PageLayout',encoding)),priority?scalar(5,priority):empty)));pageSummary.push({column,priority,offsets,sizes:data.map(b=>b.length),chunks:chunkList.length});
}
const rows=Array.from({length:4097},(_,id)=>({id,name:id%7===0?null:`value-${String(id).padStart(4,'0')}-deterministic-fixture`,items:id%11===0?null:[id,id%5===0?null:id*2,id*3],category:id%13===0?null:['red','green','blue'][id%3],blob:`blob-${String(id).padStart(4,'0')}-deterministic-payload`}));
for(const batch of split(rows,1024)){
 const last=batch.length===1,positions=batch.map(r=>append(Buffer.from(r.blob),true));
 const ids=batch.map(r=>r.id);page(0,batch,[chunk({data:last?le(ids[0],4):inlineData(ids,32),n:ids.length,log:0})],[],layout({values:last?flat(32):inline(32),layers:[1],count:ids.length}));
 const names=split(batch,128).map((part,i,parts)=>{
  const offsets=[4*(part.length+1)];for(const r of part)offsets.push(offsets.at(-1)+(r.name?32:0));
  const data=padded(join(offsets.map(v=>le(v,4)),part.filter(r=>r.name!==null).map(r=>Buffer.from(r.name))),4,0x48);
  return chunk({def:last?null:inlineData(part.map(r=>r.name===null?1:0),16),data,numLevels:last?0:part.length,n:part.length,log:i===parts.length-1?0:7});
 });
 page(1,batch,names,[],layout({def:last?null:inline(16),values:variable(),layers:[last?1:3],count:batch.length}));
 const levels=[];for(const r of batch){if(r.items===null)levels.push({row:r.id,rep:1,def:last?1:2,value:undefined});else r.items.forEach((v,i)=>levels.push({row:r.id,rep:i===0?1:0,def:v===null?1:0,value:v??0}));}
 const childValues=levels.filter(v=>v.value!==undefined),parts=[];let levelAt=0;
 for(const [i,values]of split(childValues,1024).entries()){
  const first=levelAt;let visible=0;while(visible<values.length){if(levels[levelAt].value!==undefined)visible++;levelAt++;}if(i===Math.ceil(childValues.length/1024)-1)levelAt=levels.length;
  const part=levels.slice(first,levelAt),rep=part.map(v=>v.rep),def=part.map(v=>v.def),dataValues=values.map(v=>v.value);
  parts.push({levels:part,chunk:chunk({rep:last?join(rep.map(v=>le(v,2))):oolData(rep,16,1),def:last?inlineData(def,16):oolData(def,16,2),data:last?join(dataValues.map(v=>le(v,4))):inlineData(dataValues,32),numLevels:part.length,n:values.length,log:levelAt===levels.length?0:10})});
 }
 const repIndex=join(parts.map((p,i)=>{const first=p.levels[0].row,lastRow=p.levels.at(-1).row,continues=i<parts.length-1&&parts[i+1].levels[0].row===lastRow,finished=lastRow-first+(continues?0:1),leftover=continues?p.levels.filter(v=>v.row===lastRow).length:0;return join(le(finished),le(leftover));}));
 page(2,batch,parts.map(p=>p.chunk),[repIndex],layout({rep:last?flat(16):ool(16,1),def:last?inline(16):ool(16,2),values:last?flat(32):inline(32),layers:[last?1:3,4],count:childValues.length,depth:1}));
 const keys=batch.map(r=>r.category===null?0:{green:0,blue:1,red:2}[r.category]),dictionary=join(le(32,4),le(24,4),[0,5,9,12].map(v=>le(v,4)),Buffer.from('greenbluered'));
 page(3,batch,[chunk({def:last?null:inlineData(batch.map(r=>r.category===null?1:0),16),data:last?Buffer.from(keys):inlineData(keys,8),numLevels:last?0:batch.length,n:batch.length,log:0})],[dictionary],layout({def:last?null:inline(16),values:last?flat(8):inline(8),dictionary:variable(),layers:[last?1:3],count:batch.length}));
 const descriptions=split(positions,256).map(part=>chunk({data:join(part.map(pos=>join(le(pos),le(31)))),n:part.length,log:part.length===256?8:0}));
 const inner=layout({values:packed(),layers:[1],count:batch.length});
 page(4,batch,descriptions,[],field(4,join(field(1,inner),field(2,vint(1)))));
}
assert.equal(cursor,498240);
const schemaFields=[['id',0,-1,'int32',false,1,null],['name',1,-1,'string',true,2,['lance-encoding:compression','none']],['items',2,-1,'list',true,1,null],['item',3,2,'int32',true,1,null],['category',4,-1,'dict:string:int8:false',true,3,['lance-encoding:dict-values-compression','none']],['blob',5,-1,'large_binary',true,2,['lance-encoding:blob','true']]];
const schema=join(schemaFields.map(([name,id,parent,type,nullable,encoding,metadata])=>field(1,join(str(2,name),id?scalar(3,id):empty,scalar(4,parent===-1?(1n<<64n)-1n:parent),str(5,type),nullable?scalar(6,1):empty,scalar(7,encoding),id===4?field(8,empty):empty,metadata?field(10,join(str(1,metadata[0]),str(2,metadata[1]))):empty))));
const descriptor=join(field(1,schema),scalar(2,4097)),descriptorPosition=append(descriptor),A=cursor;
const columnBuffers=pages.map(p=>join(field(1,direct('/lance.encodings.ColumnEncoding',field(1,empty))),p)),columnPositions=columnBuffers.map(c=>append(c)),B=cursor;
append(join(columnBuffers.map((c,i)=>join(le(columnPositions[i]),le(c.length)))));const C=cursor;append(join(le(descriptorPosition),le(descriptor.length)));append(join(le(A),le(B),le(C),le(1,4),le(5,4),le(2,2),le(1,2),Buffer.from('LANC')));
const expected=join(outputChunks);assert.equal(expected.length,501167);assert.deepEqual(columnBuffers.map(c=>c.length),[417,465,560,521,501]);
// Only now obtain the independently decoded rows and actual source/preserved bytes.
const source='rust/lance-file/test_data/exact_versions/v2_1.lance';
assert.deepEqual(fs.readFileSync(path.join(root,source)),expected,'Source byte mismatch');assert.deepEqual(fs.readFileSync(path.join(output,'evidence/binary/v2_1.lance')),expected,'Preserved byte mismatch');assert.deepEqual(JSON.parse(fs.readFileSync(path.join(output,'evidence/binary/v2_1-decoded-rows.json'))),rows);
const report={iteration:79,at:new Date().toISOString(),source,pass:true,compared_bytes:expected.length,compared_rows:rows.length,sha256:digest(expected),page_summary:pageSummary,columns:columnPositions.map((position,i)=>({position,size:columnBuffers[i].length})),descriptor_position:descriptorPosition,descriptor_size:descriptor.length,A,B,C,method:'Independent full expected-byte construction from row formulas, documented partitions, bit-by-bit FastLanes packing, visibility-derived level slices, row-identity repetition-index counts, padding rules and protobuf fields. No source bytes, preserved artifact, decoder, parsed report or decoded rows are opened until the complete expected buffer exists. All bytes and4097 row objects compare exactly.',repository_runtime_executed:false};
fs.writeFileSync(path.join(output,'verification/iteration-079-standard-v21-reconstruction.json'),JSON.stringify(report,null,2)+'\n');console.log({pass:true,bytes:expected.length,rows:rows.length,sha256:report.sha256,A,B,C});
