// Independently assemble expected bytes from documented fixture rules, without reading
// parsed offsets/cells or invoking Lance. Compare the full buffer only after assembly.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {root,output,digest} from './inventory.mjs';
const source='rust/lance-file/test_data/exact_versions/v1.lance',parts=[],cells=Array.from({length:6},()=>[]),expectedRows=[];
let position=0;
const emit=b=>{const start=position;parts.push(b);position+=b.length;return start;};
const ints=(values,width)=>{const b=Buffer.alloc(values.length*width);values.forEach((v,i)=>width===1?b.writeInt8(v,i):width===4?b.writeInt32LE(v,4*i):b.writeBigInt64LE(BigInt(v),8*i));return b;};
const binary=values=>{const offsets=[position];for(const value of values){emit(Buffer.from(value??''));offsets.push(position);}return emit(ints(offsets,8));};
const dictionary=[],keyOf=name=>{let key=dictionary.indexOf(name);if(key===-1){key=dictionary.length;dictionary.push(name);}return key;};
const batchOffsets=[0];
for(let first=0;first<4097;first+=1024){
 const n=Math.min(1024,4097-first),ids=[],names=[],offsets=[0],children=[],keys=[],blobs=[];
 for(let i=0;i<n;i++){
  const row=first+i,name=row%7===0?null:`value-${String(row).padStart(4,'0')}-deterministic-fixture`;
  const inputItems=row%11===0?null:[row,row%5===0?null:2*row,3*row],items=inputItems?.map(v=>v??0)??[];
  const inputCategory=row%13===0?null:['red','green','blue'][row%3];
  const key=inputCategory===null?0:keyOf(inputCategory),blob=`blob-${String(row).padStart(4,'0')}-deterministic-payload`;
  ids.push(row);names.push(name);children.push(...items);offsets.push(children.length);keys.push(key);blobs.push(blob);
  // Null row0 precedes dictionary insertion; assign its resolved value after all rows.
  expectedRows.push({row,id:row,name,items_input:inputItems,items_v1:items,category_key:key,category_input:inputCategory,category_v1:null,blob});
 }
 cells[0].push([emit(ints(ids,4)),n]);
 cells[1].push([binary(names),n]);
 cells[2].push([emit(ints(offsets,4)),n+1]);
 cells[3].push([emit(ints(children,4)),children.length]);
 cells[4].push([emit(ints(keys,1)),n]);
 cells[5].push([binary(blobs),n]);batchOffsets.push(first+n);
}
for(const r of expectedRows)r.category_v1=dictionary[r.category_key];
const pageTablePosition=emit(ints(cells.flat(2),8));
const dictionaryPosition=binary(dictionary);
const varint=n=>{let v=BigInt(n);const bytes=[];do{let x=Number(v&127n);v>>=7n;if(v)x|=128;bytes.push(x);}while(v);return Buffer.from(bytes);};
const packed=Buffer.concat(batchOffsets.map(varint));
const metadata=Buffer.concat([Buffer.from([18]),varint(packed.length),packed,Buffer.from([24]),varint(pageTablePosition)]);
const metadataPosition=position;const length=Buffer.alloc(4);length.writeUInt32LE(metadata.length);emit(length);emit(metadata);
const footerPosition=position,footer=Buffer.alloc(16);footer.writeBigInt64LE(BigInt(metadataPosition));footer.writeInt16LE(0,8);footer.writeInt16LE(2,10);footer.write('LANC',12,'ascii');emit(footer);
const expected=Buffer.concat(parts),actual=fs.readFileSync(path.join(root,source)),preserved=fs.readFileSync(path.join(output,'evidence/binary/v1.lance'));
assert.deepEqual(actual,expected);assert.deepEqual(preserved,expected);
const decoded=JSON.parse(fs.readFileSync(path.join(output,'evidence/binary/v1-decoded-rows.json')));assert.deepEqual(decoded.rows,expectedRows);
const result={iteration:76,pass:true,source,at:new Date().toISOString(),method:'Independent KB-side expected-byte assembly using generator formulas and documented V1 encoders; does not read parser report/table positions before construction. Whole expected buffer compared byte-for-byte with source and preserved artifact. All4097 decoded rows independently compared.',size:actual.length,sha256:digest(actual),assembled_sha256:digest(expected),compared_bytes:actual.length,compared_rows:expectedRows.length,page_table_position:pageTablePosition,dictionary_positions_start:dictionaryPosition,metadata_start:metadataPosition,footer_start:footerPosition,batch_offsets:batchOffsets,dictionary,repository_runtime_executed:false};
fs.writeFileSync(path.join(output,'verification/iteration-076-v1-reconstruction.json'),JSON.stringify(result,null,2)+'\n');console.log(result);
