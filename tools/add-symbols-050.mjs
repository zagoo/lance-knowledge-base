import fs from 'node:fs';
import {root,linesOf} from './inventory.mjs';
const read=p=>JSON.parse(fs.readFileSync(p));
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const batch=read('analysis/iteration-050-batch.json');
const specs=[
 {file:batch.files[0],prefix:'lance_table::io::commit::dynamodb::',test:515,
 scopes:[[36,43,'<Error as From<WrappedSdkError<E>>>'],[45,59,'<WrappedSdkError<E> as Display>'],[61,71,'<WrappedSdkError<E> as Error>'],[73,75,'SdkResultExt'],[77,91,'<Result<T,SdkError<E>> as SdkResultExt<T>>'],[162,265,'DynamoDBExternalManifestStore'],[268,513,'<DynamoDBExternalManifestStore as ExternalManifestStore>']],
 structs:[[111,115,'DynamoDBExternalManifestStore']],extra:[],feature:'dynamodb'},
 {file:batch.files[1],prefix:'lance_table::rowids::index::',test:762,
 scopes:[[62,244,'RowIdIndex'],[276,304,'SegmentEntry'],[352,409,'FragmentEntry'],[454,500,'<RowIdIndex as DeepSizeOf>'],[603,610,'RawIndexChunk'],[746,760,'RowIdIndex']],
 structs:[[45,52,'RowIdIndex'],[56,60,'FragmentRowIdIndex'],[255,260,'SegmentEntry'],[341,350,'FragmentEntry']],
 extra:[[266,'SegmentLookup::Native'],[269,'SegmentLookup::Positions'],[273,'SegmentLookup::BitmapRank'],[599,'RawIndexChunk::NonOverlapping'],[600,'RawIndexChunk::Overlapping']]},
 {file:batch.files[2],prefix:'lance_table::benches::row_id_index::',test:Infinity,
 scopes:[[92,114,'SizeStatsFile']],structs:[[82,86,'SizeStats'],[88,90,'SizeStatsFile']],extra:[[612,'benches::<linux registration>'],[617,'benches::<non-linux registration>'],[626,'main::<criterion entry>']],benchmark:true}
];
const symbols=[];
for(const spec of specs){
 const {file,prefix,test,scopes,structs}=spec,src=linesOf(fs.readFileSync(root+'/'+file.path,'utf8'));
 function add(name,line,end_line,kind,visibility){
  const r=file.ranges.find(([a,b])=>a<=line&&line<=b);if(!r)throw Error('Missing range');
  symbols.push({name:prefix+name,path:file.path,line,end_line,kind,visibility,behavior:r[2],behavior_reference:`${file.path}:${r[0]}-${r[1]}`,
   callers:spec.benchmark?'Criterion registration invokes the six benchmark workloads; helper callers are local setup functions. These names describe the benchmark source namespace, not a public library module.':spec.feature?'Parent commit factory constructs the store; ExternalManifestCommitHandler dispatches its trait methods. Local tests call only the size parser. Full Dataset consumers remain pending.':'Public RowIdIndex and FragmentRowIdIndex are reexported through lance_table::rowids. Local get/get_many/build paths, unit/property fixtures and the analyzed row_id_index benchmark call these helpers; full Dataset loading/caching callers remain pending.',
   callees:spec.feature?'AWS SDK DescribeTable/GetItem/Query/PutItem/DeleteItem builders, local parse_size_attribute and WrappedSdkError, parent naming helper; generic external trait defaults remain in external_manifest.rs.':spec.benchmark?'RowIdIndex constructor/get/get_many; RowIdSequence delete/mask/codec; protobuf and random fixture builders; Criterion and optional CSV writes. Stream adapter implementation pending.':'RowIdSequence/U64Segment iteration/position/get/range, Bitmap popcount, DeletionVector contains, RowAddress constructors, RangeInclusiveMap, Arc and DeepSizeOf Context; exact local order in L2.',
   ...(spec.feature?{feature:spec.feature}:{}),...(line>=745&&line<=760?{cfg:'test'}:{})});
 }
 for(const[a,b,owner]of scopes){if(src[a-1].trimStart().startsWith('impl')){let end=a;while(!src[end-1].trimEnd().endsWith('{'))end++;add(owner.includes('<')?owner:owner+`::<inherent impl at ${a}>`,a,end,'implementation',owner.includes('as ExternalManifestStore')||owner.includes('as DeepSizeOf')?'public trait implementation':'private');}}
 for(let i=0;i<src.length;i++){
  const line=i+1,s=src[i],scope=scopes.find(([a,b])=>a<line&&line<=b);
  const fn=s.match(/^\s*(pub(?:\([^)]*\))?\s+)?(async\s+)?fn\s+(\w+)/);
  if(fn){let end=line;while(!/[{;]\s*$/.test(src[end-1]))end++;const owner=scope?scope[2]+'::':line>=test?'tests::':'';add(owner+fn[3],line,end,fn[2]?'async function':'function',fn[1]?'public':line>=test?'private cfg(test)':scope?.[2].includes('as ExternalManifestStore')||scope?.[2].includes('as DeepSizeOf')?'public trait implementation':'private');continue;}
  const decl=s.match(/^(pub(?:\([^)]*\))?\s+)?(struct|enum|trait|type|const|static|mod)\s+(\w+)/);
  if(decl){let end=line;if(decl[2]==='type')while(!src[end-1].trimEnd().endsWith(';'))end++;add(decl[3],line,end,decl[2],decl[1]?'public':'private');}
  const macro=s.match(/^macro_rules!\s+(\w+)/);if(macro)add(macro[1],line,line,'macro','private');
  const st=structs.find(([a,b])=>a<line&&line<b),field=s.match(/^\s*(pub\s+)?(\w+):\s+.+,$/);if(st&&field)add(st[2]+'::'+field[2],line,line,'field',field[1]?'public':'private');
 }
 for(const[line,name]of spec.extra)add(name,line,line,'variant or benchmark registration','private');
 if(spec.feature)add('DynamoDBExternalManifestStore::new_external_store::SANITY_CHECK_CACHE',168,169,'static','private');
 if(spec.benchmark)add('shot_table_like::GROUP',438,438,'constant','private');
}
const duplicates=symbols.filter((s,i)=>symbols.findIndex(x=>x.name===s.name)!==i);if(duplicates.length)throw Error(JSON.stringify(duplicates));
const paths=new Set(specs.map(s=>s.file.path));
write('analysis/rust-symbols.json',[...read('analysis/rust-symbols.json').filter(s=>!paths.has(s.path)),...symbols]);
write('analysis/iteration-050-symbols.json',symbols);
console.log({added:symbols.length,files:specs.map(s=>({path:s.file.path,count:symbols.filter(x=>x.path===s.file.path).length}))});
