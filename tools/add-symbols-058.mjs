import fs from 'node:fs';
import {root,linesOf} from './inventory.mjs';
const read=p=>JSON.parse(fs.readFileSync(p)),f=read('analysis/iteration-058-batch.json').files[0],src=linesOf(fs.readFileSync(root+'/'+f.path,'utf8')),out=[];
const ns='lance_file::reader';
const scopes=[];
for(let i=0;i<src.length;i++){
 const s=src[i],m=s.match(/^(\s*)impl (.+) \{$/);
 if(m){let e=i+1;while(src[e]!==m[1]+'}')e++;scopes.push({start:i+1,end:e+1,owner:m[2].includes(' for ')?'<'+m[2].split(' for ')[1]+' as '+m[2].split(' for ')[0]+'>':m[2]});}
}
const ownerAt=line=>scopes.find(s=>line>s.start&&line<s.end)?.owner??(line>=2425?'tests':line>2335&&line<2343?'EncodedBatchReaderExt':line>409&&line<426?'ReadProjection':'');
function add(name,line,end,bodyEnd,kind,visibility){
 const ranges=f.ranges.filter(r=>r[0]<=bodyEnd&&r[1]>=line);
 const isTest=line>=2425||[1929,1944].includes(line);
 out.push({name:ns+(name?'::'+name:''),path:f.path,line,end_line:end,body_end_line:bodyEnd,kind,visibility:visibility+(isTest?' cfg(test)':''),cfg:isTest?'test':null,language:'Rust',behavior:ranges.map(r=>r[2]).join(' '),behavior_reference:ranges.map(r=>`${f.path}:${r[0]}-${r[1]}`).join('; '),callers:isTest?'Rust/Tokio/rstest discovery or local test helpers; exact matrices and lexical uses are retained in L2. No production caller.':line>=2335?'Encoded batch consumers; trait methods and exact constructors are retained in L2. Whole-repository consumers remain pending.':line>=1489&&line<1942?'Exact-version projection preparation, FileReader/ProjectedFileReader and their local scheduling/global-buffer entrypoints as traced in L2.':'Public reader consumers, exact-version dispatch/projection strategies and local metadata/read helpers as traced in L2. This is not a resolved whole-program caller graph.',callees:isTest?'Fixture writers, datagen, Arrow constructors, reader/encoder APIs, cache and IO statistics, plus local helpers specified in authored ranges. Tests were not executed.':'Local helper and exact-version/encoding/IO/cache calls are enumerated in authored behavior ranges; implementation ownership is distinguished from delegated algorithms. Data declarations do not themselves execute calls.'});
}
const structures=[];
for(let i=0;i<src.length;i++){
 const m=src[i].match(/^(\s*)(pub(?:\([^)]*\))?\s+)?(struct|enum|trait)\s+(\w+)/);
 if(m){let end=i+1;while(src[end]!==m[1]+'}')end++;const name=(i+1>=2425?'tests::':'')+m[4];add(name,i+1,i+1,i+1,m[3],m[2]?.trim()||'private');structures.push({name,start:i+1,end:end+1,indent:m[1],kind:m[3],visibility:m[2]?.trim()||'private'});}
 const fn=src[i].match(/^(\s*)(pub(?:\([^)]*\))?\s+)?(async\s+)?fn\s+(\w+)/);
 if(fn){let end=i;while(!/[{;]\s*$/.test(src[end]))end++;let bodyEnd=end;if(src[end].trimEnd().endsWith('{')){bodyEnd=end+1;while(src[bodyEnd]!==fn[1]+'}')bodyEnd++;}
 const owner=ownerAt(i+1);const isTrait=['ReadProjection','EncodedBatchReaderExt'].includes(owner);let vis=fn[2]?.trim()||(isTrait?'trait method':'private');if(owner.startsWith('<'))vis='trait implementation';
 add((owner?owner+'::':'')+fn[4],i+1,end+1,bodyEnd+1,(i+1>=2425&&(!['footer_version','create_some_file','create_wide_direct_file','create_wide_fixed_size_list_file','create_wide_structural_file','verify_expected','collect_read_tasks','read_file_with_mutated_bytes','assert_lazy_projection_matches_eager_and_reads_metadata_subset','write_file_with_global_buffer'].includes(fn[4])))?'test function':isTrait?'trait method':fn[3]?'async function':'function',vis);}
 const c=src[i].match(/^(\s*)(pub(?:\([^)]*\))?\s+)?(const|type|mod)\s+(\w+)/);if(c)add((c[3]==='mod'?'':ownerAt(i+1)?ownerAt(i+1)+'::':'')+c[4],i+1,i+1,i+1,c[3],c[2]?.trim()||'private');
}
for(const st of structures.filter(s=>s.kind==='struct'))for(let i=st.start;i<st.end-1;i++){
 const m=src[i].match(/^(\s*)(pub(?:\([^)]*\))?\s+)?(\w+):\s+(.+),$/);
 if(m&&m[1]===st.indent+'    ')add(st.name+'::'+m[3],i+1,i+1,i+1,'field',m[2]?.trim()||'private');
}
for(const [name,l,e]of [['FileMetadataProvider::Full',400,400],['FileMetadataProvider::Indexed',401,401],['RawFileMetadataOpen::Legacy',471,474],['RawFileMetadataOpen::Current',475,478],['tests::MetadataReadPath::Full',4411,4411],['tests::MetadataReadPath::Indexed',4412,4412],['tests::InvalidGboDescriptor::Unaligned',4417,4417],['tests::InvalidGboDescriptor::PastEof',4418,4418],['tests::InvalidGboDescriptor::Overflowing',4419,4419]])add(name,l,e,e,'enum variant','same as owning enum');
for(const [name,l,e]of [['FileReader::read_prepared_blocking::verify_bound',1428,1436],['DecodeEngine::read_prepared_tasks::verify_bound',1827,1835],['tests::verify_expected::expected_iter',2753,2759],['tests::test_lazy_reader_validates_unequal_length_projection::open_indexed',3874,3888],['tests::test_read_batches_page_reads_into_one_request::read_all',4074,4087],['tests::test_take_batches_column_reads_into_one_request::take',4140,4156],['tests::test_validate_struct_child_lengths::run',4682,4690],['tests::test_validate_struct_child_lengths::struct_ty',4692,4697],['tests::test_validate_length_list_and_empty_struct::validate',4741,4753]])add(name,l,l===4741?4745:l,e,'local closure','private');
out.sort((a,b)=>a.line-b.line);
for(const s of out){if(!src[s.line-1]||s.end_line<s.line)throw Error('Bad symbol');}
fs.writeFileSync('analysis/iteration-058-symbols.json',JSON.stringify(out,null,2)+'\n');
fs.writeFileSync('analysis/rust-symbols.json',JSON.stringify([...read('analysis/rust-symbols.json').filter(s=>s.path!==f.path),...out],null,2)+'\n');
console.log({new_symbols:out.length,kinds:Object.fromEntries([...new Set(out.map(s=>s.kind))].map(k=>[k,out.filter(s=>s.kind===k).length]))});
console.log(out.map(s=>`${s.line}-${s.end_line}/${s.body_end_line} ${s.name}`).join('\n'));
