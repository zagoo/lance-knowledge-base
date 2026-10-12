import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {root,output,digest} from './inventory.mjs';
import {inspect,wire} from './inspect-embedded-fixtures.mjs';

const reports=[];
for(const name of ['v2_0_mini','v2_0_self_described']){
 const r=inspect(name),b=fs.readFileSync(path.join(root,r.source)),regions=[],rows=[],catalog=[];
 function region(start,end,kind,note){assert(end>start);regions.push({start,end,kind,note,sha256:digest(b.subarray(start,end))});}
 assert.deepEqual([r.footer.major,r.footer.minor,r.footer.columns],[2,0,2]);
 const noNullFlat=bits=>({kind:'Nullable',mode:1,children:[{field:1,encoding:{kind:'Flat',bits,buffer_index:0,buffer_type:0,compression:null}}]});
 let row=0;
 for(const [i,p]of r.columns[0].pages.entries()){
  assert.equal(p.priority,0);assert.equal(p.encoding_type,'/lance.encodings.ArrayEncoding');assert.deepEqual(p.encoding,noNullFlat(32));
  assert.equal(p.length,i===16?1:16);assert.deepEqual(p.offsets,[row*4]);assert.deepEqual(p.sizes,[p.length*4]);
  const values=[];
  for(let n=0;n<p.length;n++){const v=b.readInt32LE(p.offsets[0]+n*4);assert.equal(v,row+n);values.push(v);rows.push({id:v});}
  region(p.offsets[0],p.offsets[0]+p.sizes[0],'id page',`Column0 id page${i}: ${p.length} contiguous little-endian Int32 values ${row}..${row+p.length-1}, exactly ${p.sizes[0]} bytes. Nullable(NoNull(Flat32)) uses page buffer0 and no validity, compression or padding. Logical row interval [${row},${row+p.length}); stored priority0 is unused by this V2_0 encoder, not the row start.`);
  catalog.push({column:0,page:i,row_start:row,row_end:row+p.length,metadata_start:p.metadata_start,metadata_end:p.metadata_end,offsets:p.offsets,sizes:p.sizes,priority:p.priority,values});row+=p.length;
 }
 assert.equal(row,257);row=0;
 for(const [i,p]of r.columns[1].pages.entries()){
  assert.equal(p.priority,0);assert.equal(p.encoding_type,'/lance.encodings.ArrayEncoding');assert.equal(p.encoding.kind,'Binary');assert.deepEqual(p.encoding.indices,noNullFlat(64));
  const flat=p.encoding.bytes;assert.deepEqual([flat.kind,flat.bits,flat.buffer_index,flat.buffer_type,flat.compression.hex],['Flat',8,1,0,'0a046e6f6e65']);
  assert.equal(p.length,i===128?1:2);assert.equal(p.offsets.length,2);assert.equal(p.sizes.length,2);assert.equal(p.sizes[0],8*p.length);assert.equal(p.offsets[1],p.offsets[0]+p.sizes[0]);
  assert.equal(p.encoding.null_adjustment,p.sizes[1]+1);
  const raw=[],normalized=[],values=[];let previous=0;
  for(let n=0;n<p.length;n++){
   const value=Number(b.readBigUInt64LE(p.offsets[0]+8*n));raw.push(value);
   const isNull=value>=p.encoding.null_adjustment,end=isNull?value-p.encoding.null_adjustment:value;
   assert(end>=previous&&end<=p.sizes[1]);normalized.push(end);
   const text=b.subarray(p.offsets[1]+previous,p.offsets[1]+end).toString('utf8');
   const actual=isNull?null:text,expected=(row+n)%7===0?null:`value-${String(row+n).padStart(4,'0')}-deterministic-fixture`;
   assert.equal(actual,expected);if(isNull)assert.equal(end,previous);else assert.equal(end-previous,32);
   rows[row+n].name=actual;values.push(actual);previous=end;
  }
  assert.equal(previous,p.sizes[1]);
  region(p.offsets[0],p.offsets[1]+p.sizes[1],'name page',`Column1 name page${i}, rows[${row},${row+p.length}): ${p.sizes[0]} bytes at${p.offsets[0]} store ${p.length} little-endian UInt64 cumulative end offsets [${raw.join(',')}]. Binary null_adjustment=${p.encoding.null_adjustment}; subtract it from raw values >=${p.encoding.null_adjustment}, yielding [${normalized.join(',')}]. Buffer1 at${p.offsets[1]} contains ${p.sizes[1]} concatenated ASCII bytes for ${values.map(x=>x===null?'null':JSON.stringify(x)).join(' / ')}; nulls consume zero bytes. Index encoding is Nullable(NoNull(Flat64,page0)); bytes are Flat8/page1 with explicit compression scheme none. No leading zero offset, separate validity, compression transform or padding.`);
  catalog.push({column:1,page:i,row_start:row,row_end:row+p.length,metadata_start:p.metadata_start,metadata_end:p.metadata_end,offsets:p.offsets,sizes:p.sizes,priority:p.priority,null_adjustment:p.encoding.null_adjustment,raw_indices:raw,normalized_ends:normalized,values});row+=p.length;
 }
 assert.equal(row,257);assert.equal(rows.filter(x=>x.name===null).length,37);
 assert.equal(regions.at(-1).end,10124);
 if(r.globals.length){
  assert.deepEqual(r.globals,[{table_offset:23021,position:10124,size:100}]);
  region(10124,10224,'file descriptor','Unframed 100-byte lance.file.FileDescriptor protobuf: tag1/wire2 has 95-byte Schema, then tag2/wire0 length257 (10 81 02). Schema has two tag1 Fields and no schema metadata. Field0 payload24 bytes: name=id (tag2), omitted id=0, parent_id=-1 (tag4, ten-byte sign-extended varint), logical_type=int32 (tag5), legacy encoding=Plain1 (tag7); nullable/type default false/0 are omitted. Field1 payload67 bytes: name=name, id1, parent_id=-1, logical_type=string, nullable=true, legacy encoding=VarBinary2, and one tag10 metadata entry lance-encoding:compression -> none. Both fields omit rtype and extension/key/dictionary metadata. Names/types/nullability require this descriptor or an external schema; page metadata alone does not supply them. No u32 size prefix or alignment padding.');
  r.descriptor_wire=wire(b,10124,10224);
 }else assert.equal(r.footer.global_buffers,0);
 for(const c of r.columns){
  assert.equal(c.column_encoding.type_url,'/lance.encodings.ColumnEncoding');assert.equal(c.column_encoding.payload.length,1);assert.equal(c.column_encoding.payload[0].number,1);assert.equal(c.column_encoding.payload[0].hex,'');
  assert.deepEqual(c.wire.map(x=>x.number),[1,...Array(c.pages.length).fill(2)]);
  const detail=c.index===0
   ? 'ArrayEncoding tag2 Nullable -> tag1 NoNull -> tag1 values -> ArrayEncoding tag1 Flat; Flat bits_per_value32 and an explicitly present empty Buffer (page0 by defaults). First two page records occupy62 bytes each, remaining15 occupy63 because offset varints grow. The final page length1 has four data bytes.'
   : 'ArrayEncoding tag6 Binary: tag1 indices is Nullable/NoNull/Flat64/page0; tag2 bytes is Flat8/page1 with Compression scheme none; tag3 null_adjustment is33 or65 according to page byte payload. Each of129 page records occupies90 bytes including its outer page tag/length; final page length1 uses one8-byte offset and32 data bytes.';
  region(c.position,c.position+c.size,'column metadata',`Column${c.index} metadata protobuf, ${c.size} bytes. Leading43 bytes: tag1 Encoding -> tag2 DirectEncoding -> tag1 bytes containing google.protobuf.Any; Any type_url=/lance.encodings.ColumnEncoding and value=0a00 (ColumnEncoding.values present empty). Follow ${c.pages.length} tag2 Page messages in column order. Each page has packed tag1 absolute buffer_offsets, packed tag2 byte buffer_sizes, tag3 logical length, tag4 direct Any type_url=/lance.encodings.ArrayEncoding and nested encoding. Priority tag5 is omitted/default0; column buffer offsets/sizes are absent. ${detail} The complete page catalog records every page's byte interval, row range, buffer offsets/sizes and values. No schema, per-column framing prefix, deferred encoding, extra field or padding.`);
 }
 for(const c of r.columns)region(c.table_offset,c.table_offset+16,'column metadata table',`CMO entry${c.index}: unsigned little-endian u64 metadata position${c.position}, then u64 byte size${c.size}; selects column${c.index} only. The two entries are contiguous, with no count prefix or padding.`);
 for(const g of r.globals)region(g.table_offset,g.table_offset+16,'global buffer table',`GBO entry0: unsigned little-endian u64 position${g.position}, then u64 size${g.size}; references the unframed FileDescriptor. Exactly one global buffer; no extra count prefix or padding.`);
 const f=r.footer;
 for(const [a,z,n,note]of [
  [0,8,'column metadata start',`Unsigned little-endian u64 A=${f.column_metadata_start}: first column metadata position, after data${r.globals.length?' and descriptor':''}.`],
  [8,16,'CMO start',`Unsigned little-endian u64 B=${f.cmo_start}: two-entry column metadata offset table.`],
  [16,24,'GBO start',`Unsigned little-endian u64 C=${f.gbo_start}: ${f.global_buffers?'one-entry global-buffer table':'empty GBO table, coincident with footer start'}.`],
  [24,28,'global buffer count',`Unsigned little-endian u32 global-buffer count=${f.global_buffers}. ${f.global_buffers?'Self-described mode stores schema and row count through descriptor0.':'Mini mode has no embedded schema/row-count descriptor; caller must supply the matching schema.'}`],
  [28,32,'column count','Unsigned little-endian u32 physical column count=2; file has id and name columns only.'],
  [32,34,'major version','Unsigned little-endian u16 major=2. This belongs to embedded V2_0 footer pair(2,0), distinct from standard V2_0 pair(0,3).'],
  [34,36,'minor version','Unsigned little-endian u16 minor=0. Exact version dispatch treats pair(2,0) as V2_0.'],
  [36,40,'magic','ASCII bytes 4c414e43 (LANC), closing the 40-byte footer and the complete file. No checksum or trailing bytes.']
 ])region(f.start+a,f.start+z,n,note);
 regions.sort((a,z)=>a.start-z.start);let end=0;for(const x of regions){assert.equal(x.start,end);end=x.end;}assert.equal(end,b.length);
 const report={...r,regions,page_catalog:catalog,decoded_rows:rows,counts:{id_pages:17,name_pages:129,rows:257,name_nulls:37,name_values:220,id_bytes:1028,name_index_bytes:2056,name_value_bytes:7040,data_bytes:10124,metadata_bytes:12765,padding_bytes:0,regions:regions.length}};
 fs.writeFileSync(path.join(output,`analysis/iteration-067-${name}-fixture.json`),JSON.stringify(report,null,2)+'\n');
 fs.writeFileSync(path.join(output,`evidence/binary/${name}.lance`),b);
 fs.writeFileSync(path.join(output,`evidence/binary/${name}-decoded-rows.json`),JSON.stringify(rows,null,2)+'\n');
 reports.push(report);
 console.log(JSON.stringify({source:r.source,size:r.size,sha256:r.sha256,counts:report.counts,footer:r.footer,regions:regions.slice(-12)},null,2));
}
assert.deepEqual(reports[0].decoded_rows,reports[1].decoded_rows);
const mini=fs.readFileSync(path.join(root,reports[0].source)),self=fs.readFileSync(path.join(root,reports[1].source));
assert.deepEqual(mini.subarray(0,10124),self.subarray(0,10124));
assert.deepEqual(mini.subarray(10124,22889),self.subarray(10224,22989));
fs.writeFileSync(path.join(output,'analysis/iteration-067-shared-bytes.json'),JSON.stringify({iteration:67,pass:true,data_range:[0,10124],metadata_ranges:[[10124,22889],[10224,22989]],metadata_bytes_identical:true,decoded_rows_identical:true,extra_descriptor_bytes:100,extra_gbo_bytes:16,total_size_difference:116,repository_runtime_executed:false},null,2)+'\n');
