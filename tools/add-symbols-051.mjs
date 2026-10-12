import fs from 'node:fs';
import {root,linesOf} from './inventory.mjs';
const read=p=>JSON.parse(fs.readFileSync(p));
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const batch=read('analysis/iteration-051-batch.json');
const symbols=[];
for(const file of batch.files){
 const isStream=file.path.endsWith('/utils/stream.rs');
 const src=linesOf(fs.readFileSync(root+'/'+file.path,'utf8'));
 const stem=file.path.split('/').at(-1).replace('.rs','');
 const prefix=isStream?'lance_table::utils::stream::':'lance_table::benches::'+stem+'::';
 const scopes=isStream?[[45,49,'<SharedReadError as Display>'],[51,55,'<SharedReadError as Error>'],[64,118,'PendingReadBatch'],[126,160,'MergeStream'],[162,193,'<MergeStream as Stream>'],[346,353,'RowIdAndDeletesConfig'],[390,405,'PrecomputedRowIdChunk']]:[];
 const structs=isStream?[[33,36,'ReadBatchTask'],[57,62,'PendingReadBatch'],[120,124,'MergeStream'],[319,344,'RowIdAndDeletesConfig'],[372,376,'PrecomputedSystemColumns'],[380,383,'PrecomputedRowIdChunk'],[385,388,'CachedOutputSchema']]:[];
 function add(name,line,end_line,kind,visibility){const r=file.ranges.find(([a,b])=>a<=line&&line<=b);if(!r)throw Error('No annotation');symbols.push({name:prefix+name,path:file.path,line,end_line,kind,visibility,behavior:r[2],behavior_reference:file.path+':'+r[0]+'-'+r[1],callers:isStream?'Fragment read call sites merge file task streams and overlays before wrapping system columns (rust/lance/src/dataset/fragment.rs:3680-3719; rust/lance/src/dataset/fragment.rs:3872-3916). Local tests and analyzed row_id_index/system_columns/version_columns benchmarks call public adapters. Complete FragmentReader orchestration remains pending.':'Criterion registrations in this file call benchmark functions; private fixture helpers are local. These qualified names describe the benchmark source namespace, not exported library API.',callees:isStream?'Local pending/shared/merge/chunk/schema helpers, RowIdSequence and version cursors, ReadBatchParams slice/ranges, RowAddress, DeletionVector predicate, Arrow arrays/filter and RecordBatchExt; exact branch order and contextual helper contracts in L2.':stem==='manifest_intern'?'Fragment::try_from, DataFileFieldInterner::intern_fragment, generated protobuf/prost and DeepSizeOf; env parsing, stderr reports and Criterion.':'RowIdAndDeletesConfig, apply_row_id_and_deletes and/or wrap_with_row_id_and_delete, row/version sequence constructors, lazy ready task streams, current-thread Tokio runtime, Arrow and Criterion.',...(isStream&&line>=850?{cfg:'test'}:{})});}
 for(const[a,b,owner]of scopes){let end=a;while(!src[end-1].trimEnd().endsWith('{'))end++;add(owner.includes('<')?owner:owner+'::<inherent impl>',a,end,'implementation','private');}
 for(let i=0;i<src.length;i++){
  const line=i+1,s=src[i],scope=scopes.find(([a,b])=>a<line&&line<=b);
  const fn=s.match(/^\s*(pub(?:\([^)]*\))?\s+)?(async\s+)?fn\s+(\w+)/);
  if(fn){let end=line;while(!/[{;]\s*$/.test(src[end-1]))end++;let owner=scope?scope[2]+'::':isStream&&line>=850?'tests::':'';if(line===1131&&isStream)owner='tests::test_stable_row_id_read_ahead_range_boundary_and_tail::';add(owner+fn[3],line,end,fn[2]?'async function':'function',fn[1]?'public':isStream&&line>=850?'private cfg(test)':'private');continue;}
  const d=s.match(/^(pub(?:\([^)]*\))?\s+)?(struct|enum|trait|type|const|static|mod)\s+(\w+)/);if(d){let end=line;if(d[2]==='type')while(!src[end-1].trimEnd().endsWith(';'))end++;add(d[3],line,end,d[2],d[1]?'public':'private');}
  const st=structs.find(([a,b])=>a<line&&line<b),field=s.match(/^\s*(pub\s+)?(\w+):\s+.+,$/);if(st&&field)add(st[2]+'::'+field[2],line,line,'field',field[1]?'public':'private');
 }
 if(isStream)add('<MergeStream as Stream>::Item',163,163,'associated type','private');
 if(!isStream){for(const[i,s]of src.entries())if(s.startsWith('criterion_group!')||s.startsWith('criterion_main!')){let end=i+1;while(!src[end-1].trimEnd().endsWith(';'))end++;const name=s.startsWith('criterion_main!')?'main::<criterion entry>':'benches::<registration at '+(i+1)+'>';add(name,i+1,end,'benchmark registration','private');}}
}
const duplicates=symbols.filter((s,i)=>symbols.findIndex(x=>x.name===s.name)!==i);if(duplicates.length)throw Error(JSON.stringify(duplicates));
const paths=new Set(batch.files.map(f=>f.path));write('analysis/rust-symbols.json',[...read('analysis/rust-symbols.json').filter(s=>!paths.has(s.path)),...symbols]);write('analysis/iteration-051-symbols.json',symbols);console.log({added:symbols.length,files:batch.files.map(f=>({path:f.path,count:symbols.filter(s=>s.path===f.path).length}))});
