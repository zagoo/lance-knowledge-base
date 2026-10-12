import fs from 'node:fs';import{root,linesOf}from'./inventory.mjs';
const read=p=>JSON.parse(fs.readFileSync(p)),f=read('analysis/iteration-064-batch.json').files[0],src=linesOf(fs.readFileSync(root+'/'+f.path,'utf8')),ns='lance_file::versions::v1::writer::statistics',out=[];
const relations={
compute_primitive_statistics:['get_statistics and get_decimal_statistics.','Arrow primitive casts/iterators, null_count and Native bounds/partial_cmp.'],
get_statistics:['collect_statistics integer arms and get_temporal_statistics.','compute_primitive_statistics; ScalarValue::new_primitive with first DataType.'],
compute_float_statistics:['get_float_statistics.','Arrow primitive casts/iterators, Float infinities/partial_cmp.'],
get_float_statistics:['collect_statistics Float32/64 arms.','compute_float_statistics; zero sign normalization; ScalarValue::from.'],
get_decimal_statistics:['collect_statistics Decimal128 arm.','compute_primitive_statistics<Decimal128Type>; first-array precision/scale.'],
truncate_utf8:['get_string_statistics.','str::char_indices reverse iteration and byte slicing.'],
increment_utf8:['get_string_statistics.','u8::overflowing_add; str::from_utf8 repeated validation.'],
truncate_binary:['get_binary_statistics and get_fixed_size_binary_statistics.','Byte slicing after assertion.'],
increment:['get_binary_statistics and get_fixed_size_binary_statistics.','u8::overflowing_add right-to-left carry.'],
get_string_statistics:['collect_statistics UTF8 arms.','Arrow string casts, truncate_utf8, increment_utf8, owned scalar conversion.'],
get_binary_statistics:['collect_statistics Binary arms.','Arrow generic binary casts, truncate_binary, increment.'],
get_fixed_size_binary_statistics:['collect_statistics FixedSizeBinary arm; excluded from automatic collector.','Fixed-size binary cast, truncate_binary, increment, original-width scalar constructors.'],
get_boolean_statistics:['collect_statistics Boolean arm.','Boolean casts/iteration; physical null count; presence flags.'],
cast_dictionary_arrays:['get_dictionary_statistics.','Dictionary casts and full values() references.'],
get_dictionary_statistics:['collect_statistics Dictionary arm; excluded from automatic collector.','cast_dictionary_arrays for eight key widths then recursive collect_statistics.'],
get_temporal_statistics:['collect_statistics temporal arms.','get_statistics with selected temporal marker and first dtype parameters.'],
collect_statistics:['FileWriter::write per selected builder; recursive dictionary reduction and tests.','All typed reducer helpers; panic/unreachable for empty or unsupported inputs.'],
supports_stats_collection:['StatisticsCollector::try_new.','DataType matches whitelist.'],
'StatisticsCollector::try_new':['FileWriter::with_object_writer and tests.','visit_fields; supports_stats_collection; Field clone; StatisticsBuilder::new; BTreeMap collection.'],
'StatisticsCollector::get_builder':['FileWriter::write and tests.','BTreeMap::get_mut.'],
'StatisticsCollector::finish':['FileWriter::write_statistics and tests.','ArrayBuilder::finish; StructArray::new; Arrow fields/schema; RecordBatch::try_new and SchemaError replacement.'],
visit_fields:['StatisticsCollector::try_new.','Reversed root/struct-child stack and DataTypeExt::is_struct.'],
'StatisticsBuilder::new':['StatisticsCollector::try_new.','PrimitiveBuilder::new and make_builder(dtype,1).'],
'StatisticsBuilder::string_statistics_appender':['StatisticsBuilder::append UTF8 arms.','Builder downcasts; append_value/append_null.'],
'StatisticsBuilder::binary_statistics_appender':['StatisticsBuilder::append binary arms.','Builder downcasts; append_value/append_null.'],
'StatisticsBuilder::statistics_appender':['StatisticsBuilder::append primitive/temporal/decimal arms.','Builder downcasts; ScalarValue::to_array; PrimitiveArray::value(0); nonnull append.'],
'StatisticsBuilder::boolean_appender':['StatisticsBuilder::append Boolean arm.','BooleanBuilder downcasts and false/true fallback.'],
'StatisticsBuilder::append':['FileWriter::write and local tests.','Type-selected primitive, Boolean, string or binary appender; todo! for unsupported dtype.'],
'<StatisticsBuilder as Debug>::fmt':['Collector Debug formatting or direct builder debug.','Formatter::debug_struct fields null_count and dt.']
};
function add(name,line,end,bodyEnd,kind,visibility,test=false){const rs=f.ranges.filter(r=>r[0]<=bodyEnd&&r[1]>=line),rel=relations[name];out.push({name:ns+'::'+name,path:f.path,line,end_line:end,body_end_line:bodyEnd,kind,visibility:visibility+(test?' cfg(test)':' (private enclosing module)'),cfg:test?'test':null,language:'Rust',behavior:rs.map(r=>r[2]).join(' '),behavior_reference:rs.map(r=>`${f.path}:${r[0]}-${r[1]}`).join('; '),callers:test?(kind==='test function'?'Rust/proptest test discovery; read, not executed.':'Local test fixture/property calls; exact usage in L2.'):rel?.[0]??'Containing statistics implementation; module is private to V1 writer.',callees:test?'Concrete Arrow fixtures, collect_statistics/collector methods, and exact assertions in cited ranges.':rel?.[1]??'Declaration/stored data; related behavior in cited ranges.'});}
add('BINARY_PREFIX_LENGTH',34,34,34,'constant','private');
const structs=[['StatisticsRow',38,45,false],['StatisticsCollector',612,614,false],['StatisticsBuilder',688,693,false],['tests::test_collect_primitive_stats::TestCase',1035,1040,true],['tests::test_collect_binary_stats::TestCase',1386,1389,true]];
for(const [name,start,end,test]of structs){add(name,start,start,start,'struct',test?'private':'pub',test);for(let i=start;i<end-1;i++){const m=src[i].match(/^\s+(?:(pub(?:\([^)]*\))?)\s+)?(\w+):\s+.+,$/);if(m)add(name+'::'+m[2],i+1,i+1,i+1,'field',m[1]??'private',test);}}
for(let i=0;i<src.length;i++){const m=src[i].match(/^(\s*)(pub\s+)?fn\s+(\w+)/);if(!m)continue;let e=i;while(!src[e].trimEnd().endsWith('{'))e++;let b=e+1;while(src[b]!==m[1]+'}')b++;const test=i>=932;const name=test?'tests::'+m[3]:i>=618&&i<=634?'StatisticsCollector::'+m[3]:i===695?'<StatisticsBuilder as Debug>::fmt':i>=704&&i<=868?'StatisticsBuilder::'+m[3]:m[3];const testFn=test&&m[3].startsWith('test_');add(name,i+1,e+1,b+1,test?(testFn?'test function':'test helper'):'function',i===695?'trait implementation':m[2]?.trim()??'private',test);}
add('tests',933,933,933,'module','private',true);out.sort((a,b)=>a.line-b.line||a.name.localeCompare(b.name));
if(new Set(out.map(s=>s.name+'|'+s.kind)).size!==out.length||out.filter(s=>s.kind==='test function').length!==14)throw Error('Symbol count/duplicate');
fs.writeFileSync('analysis/iteration-064-symbols.json',JSON.stringify(out,null,2)+'\n');fs.writeFileSync('analysis/rust-symbols.json',JSON.stringify([...read('analysis/rust-symbols.json').filter(s=>s.path!==f.path),...out],null,2)+'\n');
fs.writeFileSync('analysis/iteration-064-symbol-declaration-review.txt',out.map(s=>`${s.line}-${s.end_line}/${s.body_end_line} ${s.kind} ${s.visibility} ${s.name}\n  ${src.slice(s.line-1,s.end_line).join(' ').trim()}`).join('\n')+'\n');
console.log({symbols:out.length,production:out.filter(s=>!s.cfg).length,tests:14,test_declarations:out.filter(s=>s.cfg).length});
