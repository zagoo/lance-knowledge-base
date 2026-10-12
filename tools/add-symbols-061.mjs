import fs from 'node:fs';
import {root,linesOf} from './inventory.mjs';
const read=p=>JSON.parse(fs.readFileSync(p));
const files=read('analysis/iteration-061-batch.json').files,out=[];
const relationships={
 binary:{
  'BinaryEncoder::new':['V1 writer binary adapter, schema dictionary value writer and local fixtures.','Stores Writer reference only.'],
  'BinaryEncoder::encode_typed_arr':['BinaryEncoder::encode four-type dispatch.','Writer::tell/write_all; Arrow typed downcast, offsets and Int64 builder.'],
  'BinaryEncoder::encode':['V1 writer binary adapter, write_schema_dictionaries and local fixtures.','encode_typed_arr; first-array type dispatch.'],
  'BinaryDecoder::new':['read_binary_array facade and local fixtures.','Stores reader, position, length, nullable and PhantomData only.'],
  'BinaryDecoder::get_positions':['BinaryDecoder::take and local planning fixtures.','PlainDecoder::new/get; Arrow primitive cast/clone.'],
  'BinaryDecoder::count_nulls':['BinaryDecoder::get_range and take.','Offset windows and validity bit operations.'],
  'BinaryDecoder::get_range':['decode_range and each take chunk.','Arrow sub/cast; Reader::get_range; count_nulls; BufferExt; ArrayDataBuilder::build.'],
  'plan_take_chunks':['BinaryDecoder::take and sparse/dense plan fixtures.','Arrow sub; position/value access; slice/clone; Vec collection.'],
  'BinaryDecoder::decode':['Local roundtrip and range fixtures; public codec API.','get with RangeFull.'],
  'BinaryDecoder::take':['get Indices and local fixtures; public codec API.','get_positions; plan_take_chunks; get_range; ordered buffered IO; count_nulls; Arrow array construction.'],
  'BinaryDecoder::decode_range':['get range variants.','PlainDecoder::new/get; get_range; typed empty array construction.'],
  'BinaryDecoder::get':['read_binary_array facade and local fixtures.','decode_range or take; ReadBatchParams conversion.']
 },
 dictionary:{
  'DictionaryEncoder::new':['V1 writer::write_dictionary_arr.','Stores Writer and key DataType references only.'],
  'DictionaryEncoder::write_typed_array':['DictionaryEncoder::encode eight-key-type dispatch.','Writer::tell; dictionary downcast/keys; PlainEncoder::new/encode.'],
  'DictionaryEncoder::encode':['V1 writer::write_dictionary_arr; public codec API.','write_typed_array; Schema error for unsupported key type.'],
  '<DictionaryDecoder as fmt::Debug>::fmt':['Debug formatting.','Formatter debug_struct with position, length, data_type and value_arr.'],
  'DictionaryDecoder::new':['V1 reader::read_dictionary_array and local decoder helper.','Dictionary-shape assertion and field construction.'],
  'DictionaryDecoder::decode_impl':['decode, take and get.','PlainDecoder::new/get; make_dict_array; key-type assertion.'],
  'DictionaryDecoder::make_dict_array':['decode_impl eight-key-type dispatch.','Primitive downcast/clone; value Arc clone; DictionaryArray::try_new.'],
  'DictionaryDecoder::decode':['Local generic decoder fixture; public codec API.','decode_impl full range.'],
  'DictionaryDecoder::take':['Public codec API; no local direct take test.','Selector clone and decode_impl.'],
  'DictionaryDecoder::get':['V1 reader::read_dictionary_array.','decode_impl.']
 },
 plain:{
  'PlainEncoder::new':['V1 fixed-stride writer, dictionary key/value encoders and local fixtures.','Stores Writer/DataType references.'],
  'PlainEncoder::write':['Public convenience API; complete external call graph pending.','Writer::tell; new/encode for nonempty input.'],
  'PlainEncoder::encode':['V1 fixed-stride writer, dictionary key/value writers and local fixtures.','encode_internal.'],
  'PlainEncoder::encode_internal':['encode and recursive fixed-size-list encoding.','encode_fixed_size_list or encode_primitive.'],
  'PlainEncoder::encode_boolean':['encode_primitive Boolean branch.','BooleanBuilder and Writer::write_all.'],
  'PlainEncoder::encode_primitive':['encode_internal non-FSL branch.','Writer::tell/write_all; encode_boolean; DataTypeExt::byte_width; unsafe raw slices.'],
  'PlainEncoder::encode_fixed_size_list':['encode_internal FixedSizeList branch.','Arrow downcast, value slice; recursive encode_internal.'],
  'get_byte_range':['PlainDecoder::decode_primitive.','bit_util::ceil or DataTypeExt::byte_width.'],
  'bytes_to_array':['decode_primitive and padding fixture.','Arrow layout; BufferExt copy/alignment adaptation; ArrayDataBuilder::build; make_array.'],
  'PlainDecoder::new':['V1 fixed-stride facade, binary positions, dictionary keys, page-table loader and recursive decoders.','Unconditional Ok field construction.'],
  'PlainDecoder::decode_primitive':['decode_range primitive branch.','get_byte_range; Reader::get_range; bytes_to_array.'],
  'PlainDecoder::decode_fixed_size_list':['decode_range FSL branch.','DataTypeExt::is_fixed_stride; nested PlainDecoder::new/get; FixedSizeListArray::new.'],
  'PlainDecoder::decode_fixed_size_binary':['decode_range FixedSizeBinary branch.','UInt8 PlainDecoder::new/get; FixedSizeBinaryArrayExt::try_new_from_values.'],
  'PlainDecoder::take_boolean':['take Boolean branch.','Reader block/parallelism; get; Arrow sub/take/concat and ordered buffered collection.'],
  'make_chunked_requests':['PlainDecoder::take and chunk fixture.','Raw index/byte arithmetic and Vec ranges.'],
  'PlainDecoder::decode':['V1 page-table loader and local roundtrip helper.','get full logical range.'],
  'PlainDecoder::take':['get Indices and local Int32 fixture.','take_boolean or make_chunked_requests; get; Arrow sub/take/concat; buffered collection.'],
  'PlainDecoder::decode_range':['get range variants and recursive child requests.','new_empty_array or fixed-list/fixed-binary/primitive helper.'],
  'PlainDecoder::get':['V1 fixed-stride facade, binary positions, dictionary keys and recursive decoders.','decode_range or take; parameter conversion.']
 }
};
for(const f of files){
 const src=linesOf(fs.readFileSync(root+'/'+f.path,'utf8'));
 const leaf=f.path.split('/').at(-1).replace('.rs','');
 const ns='lance_file::versions::v1::encoding::'+leaf;
 const scopes=[],structs=[];
 for(let i=0;i<src.length;i++){
  const m=src[i].match(/^(\s*)impl(?:<.*>)? (.+) \{$/);
  if(m){let end=i+1;while(src[end]!==m[1]+'}')end++;const p=m[2].split(' for '),clean=s=>s.replace(/<.*>$/,'');scopes.push({start:i+1,end:end+1,owner:p.length===2?'<'+clean(p[1])+' as '+p[0]+'>':clean(m[2])});}
 }
 const testStart=src.findIndex(l=>l==='mod tests {')+1;
 const ownerAt=line=>scopes.find(s=>line>s.start&&line<s.end)?.owner??(testStart&&line>testStart?'tests':'');
 function add(name,line,end,bodyEnd,kind,visibility){
  const rs=f.ranges.filter(r=>r[0]<=bodyEnd&&r[1]>=line),isTest=testStart&&line>=testStart,relation=relationships[leaf][name];
  out.push({name:ns+'::'+name,path:f.path,line,end_line:end,body_end_line:bodyEnd,kind,visibility:visibility+(isTest?' cfg(test)':''),cfg:isTest?'test':null,language:'Rust',behavior:rs.map(r=>r[2]).join(' '),behavior_reference:rs.map(r=>`${f.path}:${r[0]}-${r[1]}`).join('; '),callers:isTest?(kind==='test helper'?'Local test functions; exact fixture call sites retained in L2.':'Rust/Tokio test discovery or module containment; tests read, not run.'):relation?.[0]??'Containing codec and its public/private methods; literal local references retained in L2, not a resolved whole-program graph.',callees:isTest?'Fixture construction, codec calls and assertions described in the complete authored ranges.':relation?.[1]??'No call occurs merely by declaring this container or field.'});
 }
 for(let i=0;i<src.length;i++){
  const st=src[i].match(/^(\s*)(pub(?:\([^)]*\))?\s+)?struct\s+(\w+)(?:<.*>)?\s*\{$/);
  if(st){let end=i+1;while(src[end]!==st[1]+'}')end++;add(st[3],i+1,i+1,i+1,'struct',st[2]?.trim()||'private');structs.push({name:st[3],start:i+1,end:end+1,indent:st[1]});}
  const md=src[i].match(/^(\s*)(pub(?:\([^)]*\))?\s+)?mod\s+(\w+)[; {]/);
  if(md)add(md[3],i+1,i+1,i+1,'module',md[2]?.trim()||'private');
  const cn=src[i].match(/^\s+const (MIN_IO_SIZE):/);
  if(cn)add('BinaryDecoder::take::'+cn[1],i+1,i+1,i+1,'constant','private function-local');
  const fn=src[i].match(/^(\s*)(pub(?:\([^)]*\))?\s+)?(async\s+)?fn\s+(\w+)/);
  if(fn){let end=i;while(!src[end].trimEnd().endsWith('{'))end++;let bodyEnd=end+1;while(src[bodyEnd]!==fn[1]+'}')bodyEnd++;const owner=ownerAt(i+1),test=testStart&&i+1>testStart,attr=src.slice(Math.max(0,i-3),i).join('\n');const kind=test?(/#\[(?:tokio::)?test\]/.test(attr)?'test function':'test helper'):fn[3]?'async function':'function';add((owner?owner+'::':'')+fn[4],i+1,end+1,bodyEnd+1,kind,owner.startsWith('<')?'trait implementation':fn[2]?.trim()||'private');}
 }
 for(const st of structs)for(let i=st.start;i<st.end-1;i++){const m=src[i].match(/^(\s*)(pub(?:\([^)]*\))?\s+)?(\w+):\s+(.+),$/);if(m&&m[1]===st.indent+'    ')add(st.name+'::'+m[3],i+1,i+1,i+1,'field',m[2]?.trim()||'private');}
}
out.sort((a,b)=>a.path.localeCompare(b.path)||a.line-b.line||a.name.localeCompare(b.name));
if(new Set(out.map(s=>s.name+'|'+s.kind)).size!==out.length)throw Error('Duplicate name/kind');
if(out.length!==96||out.filter(s=>s.kind==='test function').length!==18||out.filter(s=>s.kind==='test helper').length!==5)throw Error('Unexpected declaration counts '+out.length);
fs.writeFileSync('analysis/iteration-061-symbols.json',JSON.stringify(out,null,2)+'\n');
fs.writeFileSync('analysis/rust-symbols.json',JSON.stringify([...read('analysis/rust-symbols.json').filter(s=>!files.some(f=>f.path===s.path)),...out],null,2)+'\n');
const review=out.map(s=>{const src=linesOf(fs.readFileSync(root+'/'+s.path,'utf8'));return `${s.path}:${s.line}-${s.end_line}/${s.body_end_line} ${s.kind} ${s.visibility} ${s.name}\n  ${src.slice(s.line-1,s.end_line).join(' ').trim()}`;}).join('\n');
fs.writeFileSync('analysis/iteration-061-symbol-declaration-review.txt',review+'\n');
console.log({new_symbols:out.length,files:files.length,kinds:Object.fromEntries([...new Set(out.map(s=>s.kind))].map(k=>[k,out.filter(s=>s.kind===k).length]))});
