import fs from 'node:fs';
import path from 'node:path';
import {root,output,linesOf} from './inventory.mjs';
const batch=JSON.parse(fs.readFileSync(path.join(output,'analysis/iteration-007-core-storage.json'),'utf8'));
const added=[];
let source,analysis,prefix;
const publicApi='public Rust API',privateApi='private implementation';
function add(name,line,end_line,kind,visibility=publicApi,callees='Exact local flow is described in the authored range; complete external call graph remains pending.'){
 const r=analysis.ranges.find(([a,b])=>a<=line&&line<=b);if(!r)throw new Error('Missing analysis range');
 added.push({name:name.startsWith('<')?name:prefix+name,path:analysis.path,line,end_line,kind,visibility,behavior:r[2],behavior_reference:`${analysis.path}:${r[0]}-${r[1]}`,callers:'Local construction, delegation and tests are documented in L2; whole-repository callers not yet resolved.',callees});
}
function endSig(line){let end=line;while(!/[{;]\s*$/.test(source[end-1])&&!source[end-1].trimEnd().endsWith('{}'))end++;return end;}
function fn(name,line,visibility=publicApi){add(name,line,endSig(line),'method/function',visibility);}
function structure(name,start,end){add(name,start,start,'struct');for(let i=start;i<end;i++){const m=source[i].match(/^\s+(pub )?(\w+): /);if(m)add(name+'::'+m[2],i+1,i+1,'field',m[1]?publicApi:privateApi);}}
function impl(name,line,visibility=publicApi){const sigEnd=endSig(line);let end=sigEnd;if(!source[sigEnd-1].trimEnd().endsWith('{}')){while(source[end-1]!=='}')end++;}
 add(name+'::<implementation>',line,sigEnd,'implementation',visibility);
 for(let i=sigEnd;i<end;i++){
  const method=source[i].match(/^    (pub )?fn (\w+)/);
  if(method)fn(name+'::'+method[2],i+1,name.startsWith('<')?visibility:method[1]?publicApi:privateApi);
  const ty=source[i].match(/^    type (\w+)\s*=/);if(ty)add(name+'::'+ty[1],i+1,i+1,'associated type',visibility);
 }
}
function tests(start){for(let i=start-1;i<source.length;i++){const m=source[i].match(/^    fn (\w+)/);if(m)fn('tests::'+m[1],i+1,'private cfg(test)');}}
function useFile(suffix,namespace){analysis=batch.files.find(f=>f.path.endsWith('/'+suffix));source=linesOf(fs.readFileSync(path.join(root,analysis.path),'utf8'));prefix=namespace;}

useFile('container.rs','lance_core::container::');add('list',4,4,'module');
useFile('container/list.rs','lance_core::container::list::');
for(const [n,a,b]of [['ExpLinkedList',13,21],['ExpLinkedListIter',169,173],['ExpLinkedListIntoIter',206,210]])structure(n,a,b);
for(const[n,l,v]of [
 ['ExpLinkedList',23],['<lance_core::container::list::ExpLinkedList<T> as DeepSizeOf>',136],['<lance_core::container::list::ExpLinkedList<T> as FromIterator<T>>',145],['<lance_core::container::list::ExpLinkedList<T> as PartialEq>',158],['<lance_core::container::list::ExpLinkedList<T> as Eq>',167],['ExpLinkedListIter',175],["<lance_core::container::list::ExpLinkedListIter<'a, T> as Iterator>",185],['ExpLinkedListIntoIter',212],['<lance_core::container::list::ExpLinkedListIntoIter<T> as Iterator>',223],['<lance_core::container::list::ExpLinkedList<T> as IntoIterator>',244]
])impl(n,l,v);tests(253);

useFile('deepsize.rs','lance_core::deepsize::');
add('DeepSizeOf::<derive-reexport>',4,4,'macro re-export');structure('Context',15,17);impl('<lance_core::deepsize::Context as Default>',19);impl('Context',25);
add('DeepSizeOf',38,38,'trait');fn('DeepSizeOf::deep_size_of',39);fn('DeepSizeOf::deep_size_of_children',43);
add('impl_deep_size_primitive',47,57,'private macro template',privateApi);
add('impl_deep_size_primitive::<supported-types>',59,76,'macro invocation; generated implementations','public trait implementations from private macro');
add('impl_deep_size_tuple',148,158,'private macro template',privateApi);
for(let l=160;l<=164;l++)add('impl_deep_size_tuple::<arity-'+(l-158)+'>',l,l,'macro invocation; generated implementation','public trait implementation from private macro');
for(const[t,l]of [['str',78],['String',84],['bytes::Bytes',90],['AtomicU64',100],['AtomicUsize',106],['[T; N]',112],['[T]',120],['RwLock<T>',131],['Mutex<T>',139],['Vec<T>',166],['Box<T>',176],['Arc<T>',182],['Option<T>',192],['HashMap<K, V, S>',201],['HashSet<K>',214],['BTreeMap<K, V>',222],['BTreeSet<K>',235],['dyn Array',265],['RecordBatch',275],['arrow_buffer::ScalarBuffer<T>',284]])impl('<'+t+' as lance_core::deepsize::DeepSizeOf>',l);
fn('record_array_data',246,privateApi);tests(300);structure('tests::test_derive_macro::Outer',444,449);structure('tests::test_derive_macro::Inner',451,453);
for(const x of added.filter(s=>s.path===analysis.path&&s.name.includes('test_derive_macro::')))x.visibility='private function-local cfg(test) fixture';

useFile('utils/hash.rs','lance_core::utils::hash::');add('U8SliceKey',23,23,'tuple struct; public field 0');
impl("<lance_core::utils::hash::U8SliceKey<'_> as PartialEq>",25);impl("<lance_core::utils::hash::U8SliceKey<'_> as std::hash::Hash>",31);tests(37);
useFile('utils/io_stats.rs','lance_core::utils::io_stats::');add('IoStatsRecorder',25,25,'trait');fn('IoStatsRecorder::record_request',29);
useFile('utils/path.rs','lance_core::utils::path::');add('LancePathExt',6,6,'trait');fn('LancePathExt::child_path',7);impl('<object_store::path::Path as lance_core::utils::path::LancePathExt>',10);
useFile('utils/tracing.rs','lance_core::utils::tracing::');structure('InstrumentedStream',9,13);impl('<lance_core::utils::tracing::InstrumentedStream<I> as futures::Stream>',15);
add('StreamTracingExt',30,30,'trait');fn('StreamTracingExt::stream_in_current_span',32);fn('StreamTracingExt::stream_in_span',37);impl('<S as lance_core::utils::tracing::StreamTracingExt>',43);
for(let i=60;i<88;i++){const m=source[i].match(/^pub const (\w+)/);if(m)add(m[1],i+1,i+1,'constant');}
useFile('utils/bit.rs','lance_core::utils::bit::');for(const[n,l]of [['is_pwr_two',15],['pad_bytes',29],['pad_bytes_to',44],['pad_bytes_u64',59],['log_2_ceil',88]])fn(n,l);add('LOG_TABLE_256',65,74,'constant',privateApi);tests(112);fn('tests::test_log_2_ceil::classic_approach',132,'private cfg(test), coverage excluded helper');
useFile('utils/backoff.rs','lance_core::utils::backoff::');structure('Backoff',17,24);structure('SlotBackoff',120,126);impl('<lance_core::utils::backoff::Backoff as Default>',26);impl('Backoff',39);add('MAX_SLOTS',87,87,'constant',privateApi);impl('<lance_core::utils::backoff::SlotBackoff as Default>',128);impl('SlotBackoff',140);tests(162);fn('tests::test_slot_backoff::assert_in',220,'private cfg(test), coverage excluded helper');
useFile('utils/tempfile.rs','lance_core::utils::tempfile::');for(const[n,a,b]of [['TempDir',36,38],['TempObjDir',96,99],['TempStrDir',131,134],['TempStdDir',180,182],['TempFile',205,207],['TempStdFile',253,255],['TempObjFile',277,280],['TempStdPath',314,317]])structure(n,a,b);
for(const[n,l]of [['TempDir',40],['<lance_core::utils::tempfile::TempDir as Default>',85],['<lance_core::utils::tempfile::TempObjDir as Deref>',101],['<lance_core::utils::tempfile::TempObjDir as AsRef<ObjPath>>',109],['<lance_core::utils::tempfile::TempObjDir as Default>',115],['<lance_core::utils::tempfile::TempStrDir as std::fmt::Display>',136],['TempStrDir',142],['<lance_core::utils::tempfile::TempStrDir as Default>',149],['<lance_core::utils::tempfile::TempStrDir as Deref>',160],['<lance_core::utils::tempfile::TempStrDir as AsRef<str>>',168],['<lance_core::utils::tempfile::TempStdDir as AsRef<StdPath>>',184],['<lance_core::utils::tempfile::TempStdDir as Deref>',190],['TempFile',209],['<lance_core::utils::tempfile::TempFile as Default>',242],['<lance_core::utils::tempfile::TempStdFile as AsRef<StdPath>>',257],['<lance_core::utils::tempfile::TempStdFile as Deref>',263],['<lance_core::utils::tempfile::TempObjFile as AsRef<ObjPath>>',282],['<lance_core::utils::tempfile::TempObjFile as std::ops::Deref>',288],['<lance_core::utils::tempfile::TempObjFile as Default>',296],['<lance_core::utils::tempfile::TempStdPath as Default>',319],['<lance_core::utils::tempfile::TempStdPath as Deref>',331],['<lance_core::utils::tempfile::TempStdPath as AsRef<StdPath>>',339]])impl(n,l);
const paths=new Set(batch.files.map(f=>f.path)),file=path.join(output,'analysis/rust-symbols.json');
const prior=JSON.parse(fs.readFileSync(file,'utf8')).filter(s=>!paths.has(s.path));
if(new Set(added.map(s=>`${s.name}:${s.kind}:${s.line}`)).size!==added.length)throw new Error('Duplicate new symbol record');
fs.writeFileSync(file,JSON.stringify([...prior,...added],null,2)+'\n');
console.log(JSON.stringify({added:added.length,rust_total:prior.length+added.length,files:paths.size}));
