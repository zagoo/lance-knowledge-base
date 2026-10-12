import fs from 'node:fs';
import path from 'node:path';
import {root,output,linesOf} from './inventory.mjs';
const prefix='lance_core::datatypes::';
const files=[['rust/lance-core/src/datatypes.rs','analysis/iteration-005-datatypes.json'],['rust/lance-core/src/datatypes/field.rs','analysis/iteration-005-field.json']];
const all=[];
for(const [relative,record]of files){
 const source=linesOf(fs.readFileSync(path.join(root,relative),'utf8'));
 const analysis=JSON.parse(fs.readFileSync(path.join(output,record),'utf8')).files[0];
 const field=relative.endsWith('/field.rs');
 const pub='public Rust API; exported through lance_core::datatypes';
 const priv='private implementation';
 function add(name,line,end_line,kind,visibility=pub,callees='See authored range for exact local flow; complete external callee implementation review pending.',callers='Observed local use sites and tests are documented in L2; complete repository callers pending.'){
  const r=analysis.ranges.find(([a,b])=>a<=line&&line<=b);if(!r)throw new Error('Missing authored range');
  all.push({name:name.startsWith('<')?name:prefix+name,path:relative,line,end_line,kind,visibility,behavior:r[2],behavior_reference:`${relative}:${r[0]}-${r[1]}`,callers,callees});
 }
 function fn(name,line,visibility=pub,callees,callers){let end=line;while(!source[end-1].trimEnd().endsWith('{'))end++;add(name,line,end,'method/function',visibility,callees,callers);}
 for(let i=0;i<source.length;i++){
  const m=source[i].match(/^(pub )?(static|const) (\w+)/);if(!m)continue;
  let end=i+1;if(source[i].trimEnd().endsWith('='))end++;
  add((!m[1]&&field?'field::':'')+m[3],i+1,end,m[2],m[1]?pub:priv,'LazyLock field/type construction or literal declaration, as preserved in L2.');
 }
 if(!field){
  for(const [n,l,e,k,v]of [
   ['BlobV2Layout',155,155,'enum',pub],['BlobV2Layout::Logical',160,160,'variant',pub],['BlobV2Layout::Prepared',162,162,'variant',pub],['BlobV2Layout::Descriptor',164,164,'variant',pub],
   ['BLOB_V2_USER_FIELDS',236,236,'deprecated re-export',pub],['BLOB_V2_USER_TYPE',240,240,'deprecated re-export',pub],['LogicalType',247,247,'tuple struct',pub],
   ['LogicalType::0',247,247,'private tuple field',priv],['Dictionary',562,562,'struct',pub],['Dictionary::offset',563,563,'field',pub],['Dictionary::length',565,565,'field',pub],['Dictionary::values',567,567,'field',pub],
   ['BlobKind',598,598,'repr(u8) enum',pub],['BlobKind::Inline',600,600,'variant',pub],['BlobKind::Packed',602,602,'variant',pub],['BlobKind::Dedicated',604,604,'variant',pub],['BlobKind::External',613,613,'variant',pub]
  ])add(n,l,e,k,v);
  for(const [n,l,v,c]of [
   ['BlobV2Layout::classify',177,pub,'logical_blob_v2_fields_match; blob_v2_fields_match'],
   ['<lance_core::datatypes::BlobV2Layout as std::fmt::Display>::fmt',191,pub,'write!'],
   ['blob_v2_field_matches',200,priv,'ArrowField::name/data_type/is_nullable'],['blob_v2_fields_match',210,priv,'blob_v2_field_matches; ordered zip/all'],['logical_blob_v2_fields_match',220,priv,'blob_v2_fields_match; blob_v2_field_matches; enumerate/all'],
   ['<lance_core::datatypes::LogicalType as std::fmt::Display>::fmt',250,pub,'write!'],
   ['LogicalType::is_list',256,priv,'String::as_str; literal match'],['LogicalType::is_large_list',260,priv,'String::as_str; literal match'],['LogicalType::is_fixed_size_list_struct',264,priv,'str::starts_with'],['LogicalType::is_struct',268,pub,'String equality'],['LogicalType::is_blob',272,priv,'String equality'],['LogicalType::is_map',276,priv,'String equality'],
   ['<lance_core::datatypes::LogicalType as From<&str>>::from',282,pub,'str::to_string'],['timeunit_to_str',287,priv,'TimeUnit match'],['is_supported_fixed_size_list_child',296,priv,'Self-recursion; ArrowField::data_type'],['parse_timeunit',307,priv,'Error::arrow for unsupported unit'],
   ['<lance_core::datatypes::LogicalType as TryFrom<&arrow_schema::DataType>>::try_from',320,pub,'Recursive LogicalType::try_from; DataType::try_from dictionary guard; timeunit_to_str; is_bfloat16_field; is_supported_fixed_size_list_child; Error::schema'],
   ['<arrow_schema::DataType as TryFrom<&lance_core::datatypes::LogicalType>>::try_from',419,pub,'split/join; parse integers; recursive DataType::try_from; ArrowField::new/with_metadata; parse_timeunit; Error::schema'],
   ['<lance_core::datatypes::Dictionary as lance_core::deepsize::DeepSizeOf>::deep_size_of_children',571,pub,'dyn arrow_array::Array DeepSizeOf children with shared context'],
   ['<lance_core::datatypes::Dictionary as PartialEq>::eq',580,pub,'ArrayRef equality or offset/length equality'],
   ['<lance_core::datatypes::BlobKind as TryFrom<u8>>::try_from',619,pub,'Error::invalid_input_source; format!/Into for unknown byte']
  ])fn(n,l,v,c);
  for(const[n,l]of [['<lance_core::datatypes::LogicalType as TryFrom<&arrow_schema::DataType>>::Error',318],['<arrow_schema::DataType as TryFrom<&lance_core::datatypes::LogicalType>>::Error',417],['<lance_core::datatypes::BlobKind as TryFrom<u8>>::Error',617]])add(n,l,l,'associated type');
 }else{
  for(const[n,start,end]of [['NullabilityComparison',73,81],['SchemaCompareOptions',84,103],['BlobVersion',107,113],['Encoding',116,125],['OnTypeMismatch',129,132],['Field',137,161]]){
   add(n,start,start,source[start-1].includes('enum')?'enum':'struct');
   for(let i=start;i<end;i++){
    const member=source[i].match(/^    pub (\w+):/);const variant=source[i].match(/^    ([A-Z]\w*),/);
    if(member||variant)add(n+'::'+(member||variant)[1],i+1,i+1,member?'field':'variant');
   }
  }
  fn('field::has_blob_v2_extension',64,priv,'ArrowField::metadata; HashMap::get; Option::map/unwrap_or');
  const callees={
   new_arrow:'ArrowField::new; Field::try_from',data_type:'LogicalType predicates; ArrowField::from; DataType::try_from/unwrap; split/parse/expect',has_dictionary_types:'Field::data_type; recursive children any',merge_with_reference:'peekable child iterators; name cmp; recursive merge_with_reference; clone',apply_projection:'LogicalType::is_map; Field::is_blob; Projection::contains_field_id; recursive apply_projection; assert!; BlobHandling::unload_if_needed',
   explain_differences:'compare_nullability; blob_v2_logical_shared_child_count; explain_fields_difference; format!/join; dictionary/metadata equality',explain_difference:'explain_differences; join',compare_nullability:'NullabilityComparison match',compare_with_options:'blob_v2_logical_shared_child_count; compare_fields; compare_nullability; optional dictionary/metadata equality',extension_name:'HashMap::get; String::as_str',child:'children.iter().find',child_mut:'children.iter_mut().find',
   set_dictionary_values:'data_type; assert!; Arc::clone; Dictionary construction',set_dictionary:'data_type; AsArray dictionary/struct/list casts; set_dictionary_values; children.iter_mut().find/unwrap; recursive set_dictionary; panic! unsupported key',sub_field:'children.iter().find; recursive sub_field',sub_field_mut:'children.iter_mut().find; recursive sub_field_mut',is_blob:'HashMap::contains_key/get; Option::map/unwrap_or',is_blob_v2:'HashMap::get; Option::map/unwrap_or; is_blob_v2_descriptor',promote_blob_v2:'is_blob/is_blob_v2; recursive promote_blob_v2; LogicalType::from; Field::try_from; metadata remove/insert',
   blob_v2_layout:'extension_name; data_type; BlobV2Layout::classify',blob_v2_logical_shared_child_count:'blob_v2_layout on both; usize::min',is_blob_v2_descriptor:'metadata contains_key; child data_type equality against canonical descriptor',is_compatible_blob_projection:'is_blob and is_blob_v2 on both',unloaded_mut:'is_blob_v2/is_blob; canonical descriptor clones',binary_blob_mut:'is_blob/is_blob_v2; LogicalType::try_from/expect; children clear; metadata remove/insert',unload_blobs_recursive:'is_blob_v2; unloaded_mut; recursive unload_blobs_recursive',
   project:'recursive project; clone; exact child name match',project_by_filter:'recursive project_by_filter; short-circuit predicate',project_by_ids:'recursive project_by_ids; slice contains; clone',project_by_field:'is_compatible_blob_projection; data_type; DataTypeExt predicates; child; recursive project_by_field; Error::schema',resolve:'Vec::push; VecDeque::pop_front/unwrap; recursive resolve',resolve_case_insensitive:'Vec::push; pop_front/unwrap; eq_ignore_ascii_case; recursive resolve_case_insensitive',
   do_intersection:'is_blob/is_compatible_blob_projection; data_type; child; recursive do_intersection with .ok()? suppression; Error::arrow',intersection:'do_intersection(false)',intersection_ignore_types:'do_intersection(true)',exclude:'data_type; DataTypeExt::is_nested; child; recursive exclude',merge:'data_type; child_mut; recursive merge; Error::schema',max_id:'recursive max_id; max; unwrap_or(-1)',set_id:'recursive set_id; integer increment',reset_id:'recursive reset_id',field_by_id_mut:'Into<i32>; recursive field_by_id_mut',field_by_id:'Into<i32>; recursive field_by_id',mut_field_by_id:'Into<i32>; recursive mut_field_by_id',is_packed_struct:'PACKED_KEYS iter; metadata get; str_is_truthy',is_leaf:'Vec::is_empty',is_unenforced_primary_key:'Option::is_some',is_unenforced_clustering_key:'Option::is_some'
  };
  for(let i=163;i<1178;i++){
   const m=source[i].match(/^    (pub(?:\(([^)]*)\))? )?fn (\w+)/);if(!m)continue;
   const name=m[3];const visibility=m[2]?`Rust pub(${m[2]})`:m[1]?pub:priv;
   fn('Field::'+name,i+1,visibility,callees[name]);
  }
  for(const[n,l,c]of [
   ['<lance_core::datatypes::Field as std::fmt::Display>::fmt',1181,'write!; child Display; dictionary Debug'],
   ['<lance_core::datatypes::Field as TryFrom<&arrow_schema::Field>>::try_from',1207,'metadata parsing; recursive Field::try_from; LogicalType::try_from; has_blob_v2_extension; JSON helpers; DataTypeExt; Error constructors'],
   ['<lance_core::datatypes::Field as TryFrom<arrow_schema::Field>>::try_from',1322,'Borrowed Field::try_from'],
   ['<arrow_schema::Field as From<&lance_core::datatypes::Field>>::from',1328,'Field::data_type; ArrowField::new/with_metadata; logical blob/json checks']
  ])fn(n,l,pub,c);
  for(const[n,l]of [['<lance_core::datatypes::Field as TryFrom<&arrow_schema::Field>>::Error',1205],['<lance_core::datatypes::Field as TryFrom<arrow_schema::Field>>::Error',1320]])add(n,l,l,'associated type');
 }
 const testStart=field?1350:632;
 for(let i=testStart;i<source.length;i++){
  const m=source[i].match(/^    (?:pub )?fn (\w+)/);if(!m)continue;
  fn((field?'field::':'')+'tests::'+m[1],i+1,'private cfg(test) module, regardless of nested pub','Fixture construction, conversions and assertions enumerated in the authored range.','Rust test harness or same-module test helper calls; not executed.');
 }
}
const filename=path.join(output,'analysis/rust-symbols.json');
const existing=JSON.parse(fs.readFileSync(filename,'utf8')).filter(s=>!files.some(([p])=>s.path===p));
fs.writeFileSync(filename,JSON.stringify([...existing,...all],null,2)+'\n');
console.log(JSON.stringify({added:all.length,by_file:Object.fromEntries(files.map(([p])=>[p,all.filter(s=>s.path===p).length])),total:existing.length+all.length}));
