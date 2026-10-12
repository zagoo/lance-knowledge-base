import fs from 'node:fs';import{root,linesOf}from'./inventory.mjs';
const read=p=>JSON.parse(fs.readFileSync(p)),f=read('analysis/iteration-063-batch.json').files[0],src=linesOf(fs.readFileSync(root+'/'+f.path,'utf8')),ns='lance_file::versions::v1::writer',out=[];
const relations={
'ManifestProvider::store_schema':['FileWriter::write_footer.','Implementor-provided schema serialization; table ManifestDescribing::store_schema calls do_write_manifest.'],
'FileWriter::try_new':['Dataset open_v1_writer; table and file tests; frozen public API.','ObjectStore::create then with_object_writer.'],
'FileWriter::with_object_writer':['try_new or caller-supplied Writer.','Schema::field_ids/project_by_ids; StatisticsCollector::try_new; default PageTable/Metadata.'],
'FileWriter::schema':['Dataset V1WriterAdapter::finish and public API.','Borrow stored schema.'],
'FileWriter::verify_field_nullability':['verify_nullability_constraints and recursive child visits.','ArrayData::null_count/child_data; recursive self; InvalidInput.'],
'FileWriter::verify_nullability_constraints':['write preflight.','Array::to_data; verify_field_nullability.'],
'FileWriter::write':['Dataset V1WriterAdapter::write and local/reader/compatibility fixtures.','Schema::try_from/check_compatible; nullability verification; fields_in_batches; collect_statistics/append; write_array; Metadata::push_batch_length; AsyncWriteExt::flush.'],
'FileWriter::add_metadata':['Public legacy writer API; no call in this file. Dataset GenericWriter default metadata hook is a separate no-op.','Schema HashMap::insert.'],
'FileWriter::finish_with_metadata':['Public legacy writer API; complete external call graph pending.','HashMap::extend then finish.'],
'FileWriter::finish':['finish_with_metadata; Dataset V1WriterAdapter::finish and fixtures.','write_footer; Writer::shutdown; construct FileWriteSummary.'],
'FileWriter::len':['is_empty and public API.','Metadata::len.'],
'FileWriter::tell':['Dataset V1WriterAdapter::tell and public API.','Writer::tell.'],
'FileWriter::next_batch_id':['write_statistics debug assertion and public API.','Stored counter read.'],
'FileWriter::is_empty':['Public legacy writer API.','len.'],
'FileWriter::write_array':['write, write_struct_array, list writers and write_statistics.','Type predicates and all seven page adapters; Schema error for unsupported types.'],
'FileWriter::write_null_array':['write_array Null branch.','Writer::tell; PageInfo::new; PageTable::set.'],
'FileWriter::write_fixed_stride_array':['write_array fixed stride and list position writers.','PlainEncoder::new/encode; PageInfo::new; PageTable::set.'],
'FileWriter::write_binary_array':['write_array binary-like branch.','BinaryEncoder::new/encode; PageInfo::new; PageTable::set.'],
'FileWriter::write_dictionary_arr':['write_array Dictionary branch.','DictionaryEncoder::new/encode; PageInfo::new; PageTable::set.'],
'FileWriter::write_struct_array':['write_array Struct branch.','Column-count assertions; StructArray::column_by_name; recursive write_array.'],
'FileWriter::write_list_array':['write_array List branch.','Arrow list casts/offset/value slices; i32 PrimitiveBuilder; write_fixed_stride_array then recursive child write_array.'],
'FileWriter::write_large_list_array':['write_array LargeList branch.','Arrow large-list casts/offset/value slices; i64 PrimitiveBuilder; write_fixed_stride_array then recursive child write_array.'],
'FileWriter::write_statistics':['write_footer.','StatisticsCollector::finish; Schema::try_from/field_ids; write_array at batch0; PageTable::write.'],
'FileWriter::write_footer':['finish.','Schema::field_ids; ordinary PageTable::write; write_statistics; write_schema_dictionaries; M::store_schema; WriteExt::write_struct/write_magics.'],
'fields_in_batches':['write statistics collection.','Column-position indexing; LIFO traversal; struct cast/child indexing; DataType::is_nested.']
};
function add(name,line,end,bodyEnd,kind,visibility,test=false){const rs=f.ranges.filter(r=>r[0]<=bodyEnd&&r[1]>=line),rel=relations[name];out.push({name:ns+'::'+name,path:f.path,line,end_line:end,body_end_line:bodyEnd,kind,visibility:visibility+(test?' cfg(test)':''),cfg:test?'test':null,language:'Rust',behavior:rs.map(r=>r[2]).join(' '),behavior_reference:rs.map(r=>`${f.path}:${r[0]}-${r[1]}`).join('; '),callers:test?(kind==='test function'?'Tokio test discovery; source read, not executed.':'Local test fixture construction/format assertions; exact usages retained in L2.'):rel?.[0]??'Containing V1 writer declarations and described local consumers; full external call graph remains pending.',callees:test?'Fixture construction, writer/reader calls and exact assertions documented in authored ranges.':rel?.[1]??'Declaration or stored field; concrete operations documented in cited ranges.'});}
add('statistics',4,4,4,'module','private');add('ManifestProvider',43,43,43,'trait','public');add('ManifestProvider::store_schema',50,51,51,'async trait method','public');add('NotSelfDescribing',56,56,56,'struct','pub(crate)',true);
const structs=[];
for(let i=0;i<src.length;i++){
const st=src[i].match(/^(\s*)(pub\s+)?struct\s+(\w+)(?:<.*>)?\s*\{$/);
if(st){let e=i+1;while(src[e]!==st[1]+'}')e++;const test=i>=694;const name=(test?'tests::':'')+st[3];add(name,i+1,i+1,i+1,'struct',st[2]?.trim()||'private',test);structs.push({name,start:i+1,end:e+1,indent:st[1],test});}
const fn=src[i].match(/^(\s*)(pub(?:\([^)]*\))?\s+)?(async\s+)?fn\s+(\w+)/);
if(fn&&i!==49){let e=i;while(!src[e].trimEnd().endsWith('{'))e++;let b=e+1;while(src[b]!==fn[1]+'}')b++;const test=i===60||i>=694;const name=i===60?'<NotSelfDescribing as ManifestProvider>::store_schema':i>=694?'tests::'+fn[4]:i>=98&&i<653?'FileWriter::'+fn[4]:fn[4];const attrs=src.slice(Math.max(0,i-2),i).join('\n');add(name,i+1,e+1,b+1,test?(/#\[tokio::test\]/.test(attrs)?'test function':'test helper'):fn[3]?'async function':'function',i===60?'trait implementation':fn[2]?.trim()||'private',test);}
}
for(const st of structs)for(let i=st.start;i<st.end-1;i++){const m=src[i].match(/^(\s*)(pub\s+)?(\w+):\s+(.+),$/);if(m&&m[1]===st.indent+'    ')add(st.name+'::'+m[3],i+1,i+1,i+1,'field',m[2]?.trim()||'private',st.test);}
add('tests',695,695,695,'module','private',true);out.sort((a,b)=>a.line-b.line||a.name.localeCompare(b.name));
if(new Set(out.map(s=>s.name+'|'+s.kind)).size!==out.length||out.filter(s=>s.kind==='test function').length!==7)throw Error('Symbol count/duplicate');
fs.writeFileSync('analysis/iteration-063-symbols.json',JSON.stringify(out,null,2)+'\n');fs.writeFileSync('analysis/rust-symbols.json',JSON.stringify([...read('analysis/rust-symbols.json').filter(s=>s.path!==f.path),...out],null,2)+'\n');
fs.writeFileSync('analysis/iteration-063-symbol-declaration-review.txt',out.map(s=>`${s.line}-${s.end_line}/${s.body_end_line} ${s.kind} ${s.visibility} ${s.name}\n  ${src.slice(s.line-1,s.end_line).join(' ').trim()}`).join('\n')+'\n');
console.log({symbols:out.length,production:out.filter(s=>!s.cfg).length,tests:7,test_declarations:out.filter(s=>s.cfg).length});
