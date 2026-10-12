import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {root,output,digest} from './inventory.mjs';

// This expected-byte assembler does not import the parser or consult its report.
// It reconstructs the documented fixture layout from row formulas and protobuf tags.
const join=(...chunks)=>Buffer.concat(chunks.flat());
function uvar(value){let n=BigInt(value);const out=[];do{const low=Number(n&127n);n>>=7n;out.push(low|(n?128:0));}while(n);return Buffer.from(out);}
const scalar=(tag,value)=>join(uvar(tag*8),uvar(value));
const bytes=(tag,payload)=>join(uvar(tag*8+2),uvar(payload.length),payload);
const text=(tag,value)=>bytes(tag,Buffer.from(value));
function little(value,size){const b=Buffer.alloc(size);if(size===8)b.writeBigUInt64LE(BigInt(value));else if(size===4)b.writeUInt32LE(value);else b.writeUInt16LE(value);return b;}
const flat=(bits,index=0,compression=false)=>bytes(1,join(scalar(1,bits),bytes(2,index?scalar(1,index):Buffer.alloc(0)),compression?bytes(3,text(1,'none')):Buffer.alloc(0)));
const noNull=bits=>bytes(2,bytes(1,bytes(1,flat(bits))));
const direct=(type,payload)=>bytes(2,bytes(1,join(text(1,`/lance.encodings.${type}`),bytes(2,payload))));
const page=(offsets,sizes,length,encoding)=>bytes(2,join(bytes(1,join(offsets.map(uvar))),bytes(2,join(sizes.map(uvar))),scalar(3,length),bytes(4,direct('ArrayEncoding',encoding))));
const column=pages=>join(bytes(1,direct('ColumnEncoding',bytes(1,Buffer.alloc(0)))),pages);
const rows=Array.from({length:257},(_,id)=>({id,name:id%7===0?null:`value-${String(id).padStart(4,'0')}-deterministic-fixture`}));
const dataChunks=[],idPages=[],namePages=[];let offset=0;
for(let first=0;first<257;first+=16){
 const n=Math.min(16,257-first),data=join(rows.slice(first,first+n).map(r=>little(r.id,4)));
 idPages.push(page([offset],[data.length],n,noNull(32)));dataChunks.push(data);offset+=data.length;
}
for(let first=0;first<257;first+=2){
 const selected=rows.slice(first,first+2),strings=join(selected.filter(r=>r.name!==null).map(r=>Buffer.from(r.name)));
 const adjustment=strings.length+1;let end=0;
 const indices=join(selected.map(r=>{if(r.name!==null)end+=32;return little(end+(r.name===null?adjustment:0),8);}));
 const encoding=bytes(6,join(bytes(1,noNull(64)),bytes(2,flat(8,1,true)),scalar(3,adjustment)));
 namePages.push(page([offset,offset+indices.length],[indices.length,strings.length],selected.length,encoding));
 dataChunks.push(indices,strings);offset+=indices.length+strings.length;
}
const data=join(dataChunks),columns=[column(idPages),column(namePages)];
const parent=scalar(4,(1n<<64n)-1n);
const idField=join(text(2,'id'),parent,text(5,'int32'),scalar(7,1));
const nameField=join(text(2,'name'),scalar(3,1),parent,text(5,'string'),scalar(6,1),scalar(7,2),bytes(10,join(text(1,'lance-encoding:compression'),text(2,'none'))));
const descriptor=join(bytes(1,join(bytes(1,idField),bytes(1,nameField))),scalar(2,257));
assert.equal(data.length,10124);assert.deepEqual(columns.map(x=>x.length),[1112,11653]);assert.equal(descriptor.length,100);
const assembled=[];
for(const selfDescribed of [false,true]){
 const name=selfDescribed?'v2_0_self_described':'v2_0_mini';
 const first=data.length+(selfDescribed?descriptor.length:0),second=first+columns[0].length;
 const cmo=second+columns[1].length,gbo=cmo+32;
 const table=join(little(first,8),little(columns[0].length,8),little(second,8),little(columns[1].length,8));
 const global=selfDescribed?join(little(data.length,8),little(descriptor.length,8)):Buffer.alloc(0);
 const footer=join(little(first,8),little(cmo,8),little(gbo,8),little(Number(selfDescribed),4),little(2,4),little(2,2),little(0,2),Buffer.from('LANC'));
 const expected=join(data,selfDescribed?descriptor:Buffer.alloc(0),columns,table,global,footer);
 assembled.push({name,expected,first,second,cmo,gbo});
}
// Only now open source/preserved/decoded evidence to compare independent output.
const results=[];
for(const a of assembled){
 const source=`rust/lance-file/test_data/exact_versions/${a.name}.lance`;
 assert.deepEqual(fs.readFileSync(path.join(root,source)),a.expected,`${a.name}: source bytes differ`);
 assert.deepEqual(fs.readFileSync(path.join(output,`evidence/binary/${a.name}.lance`)),a.expected,`${a.name}: preserved bytes differ`);
 assert.deepEqual(JSON.parse(fs.readFileSync(path.join(output,`evidence/binary/${a.name}-decoded-rows.json`))),rows,`${a.name}: decoded rows differ`);
 results.push({source,pass:true,compared_bytes:a.expected.length,compared_rows:rows.length,sha256:digest(a.expected),column_metadata_positions:[a.first,a.second],cmo:a.cmo,gbo:a.gbo});
}
const report={iteration:84,at:new Date().toISOString(),pass:true,method:'Independent expected-byte assembly from documented page partitions, row formulas and protobuf tags. No parser, parser report, source offsets or source bytes consulted until complete expected buffers were assembled. All source/preserved bytes and all decoded rows compared.',data_bytes:10124,id_pages:17,name_pages:129,name_nulls:37,files:results,compared_bytes:results.reduce((n,r)=>n+r.compared_bytes,0),compared_rows:514,repository_runtime_executed:false};
fs.writeFileSync(path.join(output,'verification/iteration-084-embedded-reconstruction.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
