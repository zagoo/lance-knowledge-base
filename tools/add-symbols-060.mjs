import fs from 'node:fs';
import{root,linesOf}from'./inventory.mjs';
const read=p=>JSON.parse(fs.readFileSync(p));const files=read('analysis/iteration-060-batch.json').files,out=[];
const contexts={
 append_field_ids:['projection_from_field_ids; recursive child walk.','Field::is_blob,is_packed_struct; BTreeMap::get; recursive self.'],
 projection_from_field_ids:['V1 whole-schema/column-name helpers and versions::projection_from_field_ids.','append_field_ids; schema clone; Arc construction.'],
 projection_from_whole_schema:['versions exact-version dispatch.','field_id_to_column_index; projection_from_field_ids.'],
 projection_from_column_names:['versions exact-version dispatch.','field_id_to_column_index; Schema::project; projection_from_field_ids.'],
 physical_column_count:['versions::physical_column_count and recursive self.','Field Blob/packed checks; recursive child counts.'],
 data_file_columns:['versions::data_file_columns and private ID map construction.','append_physical_fields.'],
 field_id_to_column_index:['V1 whole-schema and column-name projection.','data_file_columns; BTreeMap collection.'],
 append_physical_fields:['data_file_columns and recursive self.','Field Blob/packed checks; recursive child walk.'],
 read_binary_array:['V1 reader binary adapter and populate_field_dictionary.','Four concrete BinaryDecoder instantiations and get; ReadBatchParams conversion.'],
 read_fixed_stride_array:['V1 reader fixed-stride adapter, Blob position path locator and populate_field_dictionary.','DataTypeExt::is_fixed_stride; PlainDecoder::new/get. Complete decoder pending.'],
 write_schema_dictionaries:['V1 writer::write_footer and lance_table::io::manifest::write_manifest under V1 gate.','Schema::max_field_id/mut_field_by_id; Field::data_type; numeric/binary predicates; PlainEncoder/BinaryEncoder::encode.'],
 populate_field_dictionary:['populate_schema_dictionaries and recursive child traversal.','Field::data_type; read_binary_array/read_fixed_stride_array; recursive self.'],
 populate_schema_dictionaries:['lance_table::format::manifest::populate_manifest_schema_dictionaries under V1 gate.','populate_field_dictionary sequentially per root.'],
 group_indices_to_batches:['V1 FileReader::take plus local test.','num_batches; sort_unstable; BTreeMap grouping; vector offset subtraction.'],
 range_to_batches:['V1 FileReader::read_range after an empty-range guard, plus local test.','binary_search; num_batches; min/max and relative range construction.'],
 load:['V1 reader ordinary/stats page-table paths and local tests.','PlainDecoder::new/decode; Arrow downcast/index access; BTreeMap insertion.'],
 write:['V1 writer footer/stats page-table emission and local tests.','Writer::tell; PageTable::get; Int64Builder; AsyncWriteExt::write_all.'],
 set:['V1 writer null/fixed/binary/dictionary page setters, other pending writer branches and local tests.','BTreeMap entry/or_default/insert.'],
 get:['PageTable::write, V1 reader page lookup and local tests.','Two BTreeMap lookups.']
};
for(const f of files){
 const src=linesOf(fs.readFileSync(root+'/'+f.path,'utf8'));
 const suffix=f.path.split('/versions/v1/')[1].replace(/\.rs$/,'').replace(/\/mod$/,'').replaceAll('/','::');
 const ns='lance_file::versions::v1'+(suffix==='mod'?'':'::'+suffix);
 const scopes=[],structs=[];
 for(let i=0;i<src.length;i++){
  const m=src[i].match(/^(\s*)impl (.+) \{$/);
  if(m){let end=i+1;while(src[end]!==m[1]+'}')end++;const parts=m[2].split(' for ');scopes.push({start:i+1,end:end+1,owner:parts.length===2?'<'+parts[1]+' as '+parts[0]+'>':m[2]});}
 }
 const testStart=src.findIndex(l=>l==='mod tests {')+1;
 const ownerAt=line=>scopes.find(s=>line>s.start&&line<s.end)?.owner??(testStart&&line>testStart?'tests':'');
 function add(name,line,end,bodyEnd,kind,visibility){
  const rs=f.ranges.filter(r=>r[0]<=bodyEnd&&r[1]>=line);const isTest=testStart&&line>=testStart;const leaf=name.split('::').at(-1);const relation=contexts[leaf];
  out.push({name:ns+'::'+name,path:f.path,line,end_line:end,body_end_line:bodyEnd,kind,visibility:visibility+(isTest?' cfg(test)':''),cfg:isTest?'test':null,language:'Rust',behavior:rs.map(r=>r[2]).join(' '),behavior_reference:rs.map(r=>`${f.path}:${r[0]}-${r[1]}`).join('; '),callers:isTest?'Rust/Tokio discovery for test functions; test module contains local fixtures. Tests read, not run.':relation?.[0]??(kind==='function'?'Metadata/field/page consumers and local methods are retained in full L2 evidence; whole-program callers remain incomplete.':'Public V1 containers/modules and their field or associated-type users; literal local references are retained in L2. Not a resolved whole-program graph.'),callees:isTest?'Fixture constructors, metadata/page-table methods, assertion macros and local IO for page-table tests. Exact assertions and limits are documented.':relation?.[1]??(kind==='function'?'Exact local conversion/container/arithmetic calls are described in behavior ranges and retained implementation.':'No call occurs merely by declaring this item; associated types name a trait boundary.')});
 }
 for(let i=0;i<src.length;i++){
  const st=src[i].match(/^(\s*)(pub(?:\([^)]*\))?\s+)?struct\s+(\w+)\s*\{$/);
  if(st){let end=i+1;while(src[end]!==st[1]+'}')end++;add(st[3],i+1,i+1,i+1,'struct',st[2]?.trim()||'private');structs.push({name:st[3],start:i+1,end:end+1,indent:st[1]});}
  const md=src[i].match(/^(\s*)(pub(?:\([^)]*\))?\s+)?mod\s+(\w+)[; {]/);
  if(md)add(md[3],i+1,i+1,i+1,'module',md[2]?.trim()||'private');
  const fn=src[i].match(/^(\s*)(pub(?:\([^)]*\))?\s+)?(async\s+)?fn\s+(\w+)/);
  if(fn){let end=i;while(!src[end].trimEnd().endsWith('{'))end++;let bodyEnd=end+1;while(src[bodyEnd]!==fn[1]+'}')bodyEnd++;const owner=ownerAt(i+1);add((owner?owner+'::':'')+fn[4],i+1,end+1,bodyEnd+1,testStart&&i+1>testStart?'test function':fn[3]?'async function':'function',owner.startsWith('<')?'trait implementation':fn[2]?.trim()||'private');}
  const at=src[i].match(/^    type (\w+) =/);if(at)add(ownerAt(i+1)+'::'+at[1],i+1,i+1,i+1,'associated type','trait implementation');
 }
 for(const st of structs)for(let i=st.start;i<st.end-1;i++){const m=src[i].match(/^(\s*)(pub(?:\([^)]*\))?\s+)?(\w+):\s+(.+),$/);if(m&&m[1]===st.indent+'    ')add(st.name+'::'+m[3],i+1,i+1,i+1,'field',m[2]?.trim()||'private');}
}
out.sort((a,b)=>a.path.localeCompare(b.path)||a.line-b.line||a.name.localeCompare(b.name));
if(new Set(out.map(s=>s.name+'|'+s.kind)).size!==out.length)throw Error('Duplicate name/kind');
fs.writeFileSync('analysis/iteration-060-symbols.json',JSON.stringify(out,null,2)+'\n');
fs.writeFileSync('analysis/rust-symbols.json',JSON.stringify([...read('analysis/rust-symbols.json').filter(s=>!files.some(f=>f.path===s.path)),...out],null,2)+'\n');
const review=out.map(s=>{const src=linesOf(fs.readFileSync(root+'/'+s.path,'utf8'));return `${s.path}:${s.line}-${s.end_line}/${s.body_end_line} ${s.kind} ${s.visibility} ${s.name}\n  ${src.slice(s.line-1,s.end_line).join(' ').trim()}`;}).join('\n');
fs.writeFileSync('analysis/iteration-060-symbol-declaration-review.txt',review+'\n');
console.log({new_symbols:out.length,files:files.length,kinds:Object.fromEntries([...new Set(out.map(s=>s.kind))].map(k=>[k,out.filter(s=>s.kind===k).length]))});
