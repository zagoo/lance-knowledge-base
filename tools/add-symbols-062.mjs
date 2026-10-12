import fs from 'node:fs';import{root,linesOf}from'./inventory.mjs';
const read=p=>JSON.parse(fs.readFileSync(p)),f=read('analysis/iteration-062-batch.json').files[0],src=linesOf(fs.readFileSync(root+'/'+f.path,'utf8')),ns='lance_file::versions::v1::reader',out=[];
const relations={
 'FileReader::try_new_with_fragment_id':['FileReader::try_new; Dataset fragment legacy open and local projection fixture.','ObjectStore::open; read_metadata; try_new_from_reader.'],
 'FileReader::try_new_from_reader':['try_new_with_fragment_id; table SelfDescribingFileReader implementation; Dataset write fixture.','read_metadata optionally; load_from_cache; PageTable::load; read_stats_page_table; futures::try_join.'],
 'FileReader::read_metadata':['Constructors, statistics loader, table SelfDescribingFileReader.','load_from_cache; Reader::size/block_size/get_range; read_metadata_offset; read_struct/read_struct_from_buf.'],
 'FileReader::read_stats_page_table':['try_new_from_reader.','load_from_cache; read_metadata; max leaf ID; PageTable::load.'],
 'FileReader::load_from_cache':['Metadata and both page-table loading paths.','StringCacheKey::new; LanceCache::get_or_insert_with_key or direct loader await.'],
 'FileReader::try_new':['Local reader/writer/compatibility fixtures and public frozen reader API.','Schema::max_field_id; try_new_with_fragment_id with zero IDs and no cache.'],
 'FileReader::io_parallelism':['Read ranges, takes, fields and statistics.','Reader::io_parallelism.'],
 'FileReader::schema':['Local fixtures and Dataset fragment projection initialization.','Borrow stored schema only.'],
 'FileReader::num_batches':['take, batches_stream and Dataset task splitting.','Metadata::num_batches.'],
 'FileReader::num_rows_in_batch':['Dataset V1Reader task splitting.','Metadata::get_batch_length; missing defaults to0.'],
 'FileReader::len':['take and public frozen reader API.','Metadata::len.'],
 'FileReader::is_empty':['Public frozen reader API.','Metadata::is_empty.'],
 'FileReader::read_batch':['read_range, take, batches_stream and fixtures.','Free read_batch after parameter conversion.'],
 'FileReader::read_range':['Public reader API and local range fixture.','Metadata::range_to_batches; method read_batch; ordered buffered collection; spawn_blocking concat_batches.'],
 'FileReader::take':['Public reader API and numeric/list/Boolean fixtures.','Metadata::group_indices_to_batches; method read_batch; ordered buffered collection; spawn_blocking concat_batches.'],
 'FileReader::page_stats_schema':['read_page_stats and public reader API.','Parse statistics root names; Schema::project_by_ids.'],
 'FileReader::read_page_stats':['Public statistics API; complete Dataset/statistics consumer graph pending.','page_stats_schema; read_array with statistics table and batch0; RecordBatch::try_new.'],
 'batches_stream':['Local even-batch stream fixture and public frozen API.','FileReader::num_batches/read_batch; predicate; buffered(2); RecordBatchStreamAdapter.'],
 'read_batch':['FileReader method; Dataset fragment ranges_to_tasks.','read_array over roots; ordered buffered collection; RecordBatch::try_new or InvalidInput.'],
 'read_array':['Free read_batch, statistics reads, struct/list recursion and null fixture helper.','DataTypeExt::is_fixed_stride; fixed/null/binary/dictionary/struct/list adapters.'],
 'get_page_info':['Fixed/null/binary/dictionary/list adapters.','PageTable::get; contextual InvalidInput.'],
 '_read_fixed_stride_array':['read_array fixed-stride branch.','get_page_info; encoding::read_fixed_stride_array.'],
 'read_null_array':['read_array Null branch.','get_page_info; selector bounds; NullArray::new.'],
 'read_binary_array':['read_array four byte-array branches.','get_page_info; encoding::read_binary_array with field.nullable.'],
 'read_dictionary_array':['read_array Dictionary branch.','get_page_info; dictionary/value unwraps; DictionaryDecoder::new/get.'],
 'read_struct_array':['read_array Struct branch.','Sequential recursive read_array; StructArray::from.'],
 'take_list_array':['read_list_array Indices branch.','Per-selector child ranges; sequential read_array; concat; primitive offset builder; try_new_generic_list_array.'],
 'read_list_array':['read_array List/LargeList branch.','get_page_info on reader ordinary table; fixed-stride positions; take_list_array or recursive read_array; Arrow sub; try_new_generic_list_array.']
};
const scopes=[];for(let i=0;i<src.length;i++){const m=src[i].match(/^(\s*)impl(?:<.*>)? (.+) \{$/);if(m){let end=i+1;while(src[end]!==m[1]+'}')end++;const p=m[2].split(' for '),clean=s=>s.replace(/<.*>$/,'');scopes.push({start:i+1,end:end+1,owner:p.length===2?'<'+clean(p[1])+' as '+p[0]+'>':clean(m[2])});}}
function add(name,line,end,bodyEnd,kind,visibility){const test=line>=810,rs=f.ranges.filter(r=>r[0]<=bodyEnd&&r[1]>=line),rel=relations[name];out.push({name:ns+'::'+name,path:f.path,line,end_line:end,body_end_line:bodyEnd,kind,visibility:visibility+(test?' cfg(test)':''),cfg:test?'test':null,language:'Rust',behavior:rs.map(r=>r[2]).join(' '),behavior_reference:rs.map(r=>`${f.path}:${r[0]}-${r[1]}`).join('; '),callers:test?(kind==='test helper'?'Local fixture callers, with complete source evidence in L2.':'Rust/Tokio test discovery or module containment; read, not run.'):rel?.[0]??'Containing legacy reader/cache declarations; local uses are preserved in L2. Whole-program call graph outside documented callers remains pending.',callees:test?'Fixture construction, read/write calls and exact assertions described in authored ranges.':rel?.[1]??'Declaration or cache/debug protocol operations explained by the cited range; no automatic IO merely by declaring a type/field.'});}
const structs=[];for(let i=0;i<src.length;i++){
const st=src[i].match(/^(\s*)(pub\s+)?struct\s+(\w+)(?:<.*>)?\s*\{$/);if(st){let end=i+1;while(src[end]!==st[1]+'}')end++;add(st[3],i+1,i+1,i+1,'struct',st[2]?.trim()||'private');structs.push({name:st[3],start:i+1,end:end+1,indent:st[1]});}
const fn=src[i].match(/^(\s*)(pub(?:\([^)]*\))?\s+)?(async\s+)?fn\s+(\w+)/);if(fn){let end=i;while(!src[end].trimEnd().endsWith('{'))end++;let body=end+1;while(src[body]!==fn[1]+'}')body++;const owner=scopes.find(s=>i+1>s.start&&i+1<s.end)?.owner??(i>=810?(fn[4]==='read_array_w_params'?'tests::test_read_nullable_arrays':'tests'):''),test=i>=810,attrs=src.slice(Math.max(0,i-2),i).join('\n');add((owner?owner+'::':'')+fn[4],i+1,end+1,body+1,test?(/#\[(?:tokio::)?test\]/.test(attrs)?'test function':'test helper'):fn[3]?'async function':'function',owner.startsWith('<')?'trait implementation':fn[2]?.trim()||'private');}
}
for(const st of structs)for(let i=st.start;i<st.end-1;i++){const m=src[i].match(/^(\s*)(pub\s+)?(\w+):\s+(.+),$/);if(m&&m[1]===st.indent+'    ')add(st.name+'::'+m[3],i+1,i+1,i+1,'field',m[2]?.trim()||'private');}
add('StableStringCacheValue',83,83,85,'trait','private');
for(const[line,name]of[[84,'StableStringCacheValue::STABLE_TYPE_ID'],[88,'<Metadata as StableStringCacheValue>::STABLE_TYPE_ID'],[92,'<PageTable as StableStringCacheValue>::STABLE_TYPE_ID'],[96,'<Option<PageTable> as StableStringCacheValue>::STABLE_TYPE_ID']])add(name,line,line,line,'associated constant','private trait contract');
add('<StringCacheKey as CacheKey>::ValueType',100,100,100,'associated type','trait implementation');add('tests',811,811,811,'module','private');
out.sort((a,b)=>a.line-b.line||a.name.localeCompare(b.name));if(new Set(out.map(s=>s.name+'|'+s.kind)).size!==out.length)throw Error('Duplicate');
if(out.length!==68||out.filter(s=>s.kind==='test function').length!==12||out.filter(s=>s.kind==='test helper').length!==4)throw Error('Count '+out.length);
fs.writeFileSync('analysis/iteration-062-symbols.json',JSON.stringify(out,null,2)+'\n');fs.writeFileSync('analysis/rust-symbols.json',JSON.stringify([...read('analysis/rust-symbols.json').filter(s=>s.path!==f.path),...out],null,2)+'\n');
fs.writeFileSync('analysis/iteration-062-symbol-declaration-review.txt',out.map(s=>`${s.line}-${s.end_line}/${s.body_end_line} ${s.kind} ${s.visibility} ${s.name}\n  ${src.slice(s.line-1,s.end_line).join(' ').trim()}`).join('\n')+'\n');
console.log({symbols:out.length,production:out.filter(s=>!s.cfg).length,tests:12,helpers:4});
