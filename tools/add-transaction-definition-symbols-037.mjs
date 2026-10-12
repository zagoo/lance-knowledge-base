import fs from 'node:fs';
import {root,linesOf} from './inventory.mjs';
const batch=JSON.parse(fs.readFileSync('analysis/iteration-037-transaction-definitions.json')),added=[],base='lance_table::transaction::';
function add(a,name,line,end_line,kind,visibility,callers,callees){const r=a.ranges.find(([s,e])=>s<=line&&line<=e);if(!r)throw Error('Range '+line);added.push({name:base+name,path:a.path,line,end_line,kind,visibility,behavior:r[2],behavior_reference:`${a.path}:${r[0]}-${r[1]}`,callers:callers??'Transaction consumers; full external caller graph pending.',callees:callees??'Data declaration; referenced field types are dependencies, not executable calls.'});}
const types={
'transaction.rs':[['LogicalIndexSegments',68,68],['CoverageIdentity',81,84],['ReadVersionState',99,102]],
'builder.rs':[['Transaction',17,25],['TransactionBuilder',28,35]],
'prepare.rs':[['FragReuseUpdate',28,42],['PreparedIndices',53,58]],
'operation.rs':[['DataReplacementGroup',24,24],['DataOverlayGroup',32,35],['Operation',39,248],['UpdateMode',251,261],['UpdatedFragmentOffsets',268,268],['TaggedRewriteAssembly',310,321],['RewrittenIndex',364,372],['RewriteGroup',384,387]],
'update_map.rs':[['UpdateMapEntry',15,20],['UpdateMap',51,56]],'test_support.rs':[]};
const variants=[['Append',42,42],['Delete',46,50],['Overwrite',63,68],['CreateIndex',70,76],['Rewrite',84,112],['DataReplacement',129,131],['DataOverlay',136,136],['Merge',140,149],['Restore',151,151],['ReserveFragments',156,156],['Update',174,196],['Project',199,207],['UpdateConfig',215,220],['UpdateMemWalState',225,227],['Clone',235,241],['UpdateBases',244,247]];
const owners={
'builder.rs':[[37,78,'TransactionBuilder'],[80,90,'Transaction']],
'prepare.rs':[[60,100,'PreparedIndices']],
'operation.rs':[[270,277,'<UpdatedFragmentOffsets as DeepSizeOf>'],[279,300,'<Operation as Display>'],[323,336,'TaggedRewriteAssembly'],[374,381,'<RewrittenIndex as DeepSizeOf>'],[389,397,'<RewriteGroup as PartialEq>'],[399,420,'Operation']],
'update_map.rs':[[22,26,'<UpdateMapEntry as From<(String, Option<String>)>>'],[28,32,'<UpdateMapEntry as From<(String, String)>>'],[34,41,'<UpdateMapEntry as From<(&str, Option<&str>)>>'],[43,47,'<UpdateMapEntry as From<(&str, &str)>>']],
'test_support.rs':[],'transaction.rs':[]};
const edges={
'new_from_version':['Public constructors.','TransactionBuilder::new/build.'],
'build':['Transaction constructors or direct consuming builder users.','Option::unwrap_or_else; Uuid::new_v4/hyphenated/to_string; moves fields.'],
'reordered_sources':['TaggedRewriteAssembly::new(operation.rs333); contextual index_maintenance.rs822 and manifest_build.rs2664 test sites.','Transition.sources flatten; u32::try_from; Error::invalid_input; Result<RoaringBitmap> collection.'],
'apply_update_map':['Lexical manifest_build.rs1745/1750/1755/1792 consumers; full operation integration pending.','HashMap::clear/insert/remove; String::clone.'],
'translate_config_updates':['Public helper and lexical proto.rs320.','HashMap iteration; clone strings; Vec push.'],
'translate_schema_metadata_updates':['Public helper and lexical proto.rs329/342.','HashMap iteration; string clone; Vec collect.'],
'into_parts':['Contextual manifest_build.rs611 after version check and gate.','Moves original/prepared/frag_reuse, drops version.'],
'tagged_entry':['Shared cfg(test) transaction fixtures; full caller matrix pending.','RoaringTreemap insert/serialize; protobuf Transition/digests; sample_index_metadata; prost encode_to_vec; Arc.']};
for(const a of batch.files){const src=linesOf(fs.readFileSync(root+'/'+a.path,'utf8')),file=a.path.split('/').at(-1),test=file==='test_support.rs';
 for(const[n,l,e]of types[file]){add(a,n,l,l,'type',n==='TransactionBuilder'?'public; private fields':'public');if(l!==e)for(let i=l;i<e;i++){const m=src[i].match(/^\s*(pub )?(\w+):\s/);if(m&&!(file==='operation.rs'&&n==='Operation'))add(a,n+'::'+m[2],i+1,i+1,'field',m[1]?'public':'private to transaction descendants');}}
 if(file==='transaction.rs'){
  for(let i=29;i<43;i++){const m=src[i].match(/^(pub\(crate\) )?mod (\w+);/);if(m)add(a,m[2],i+1,i+1,'module',m[1]?'pub(crate), cfg(test)':'private');}
  for(const[l,e,n]of [[44,44,'builder'],[45,45,'manifest_build'],[46,49,'operation'],[50,50,'prepare'],[51,51,'row_version'],[52,54,'update_map'],[55,55,'validate']])add(a,'<reexports from '+n+'>',l,e,'public reexport group','public','External transaction API users.','Forwarded symbols retain underlying contracts; no wrapper.');
 }
 if(file==='prepare.rs')for(const[n,l]of [['None',34],['Rewrite',38],['Trim',41]])add(a,'FragReuseUpdate::'+n,l,l,'variant','public non_exhaustive enum');
 if(file==='operation.rs'){
  for(const[n,l,e]of variants){add(a,'Operation::'+n,l,e,'variant','public exhaustive enum');if(l===e){const re=/{ (\w+):/;const m=src[l-1].match(re);if(m)add(a,'Operation::'+n+'::'+m[1],l,l,'field','public via variant');}else for(let i=l;i<e;i++){const m=src[i].match(/^\s*(\w+):/);if(m)add(a,'Operation::'+n+'::'+m[1],i+1,i+1,'field','public via variant');}}
  for(const[n,l]of [['RewriteRows',255],['RewriteColumns',260]])add(a,'UpdateMode::'+n,l,l,'variant','public');
  for(const[n,l]of [['DataReplacementGroup::0',24],['DataReplacementGroup::1',24],['UpdatedFragmentOffsets::0',268]])add(a,n,l,l,'tuple field','public');
 }
 for(let i=0;i<src.length;i++){
  const line=i+1,owner=owners[file].find(([l,e])=>l<=line&&line<=e)?.[2];
  if(/^impl\b/.test(src[i]))add(a,`${owner??file}::<implementation@${line}>`,line,line,'implementation',test?'cfg(test)':'type/trait implementation');
  const m=src[i].match(/^\s*(pub(?:\((?:crate|super)\))? )?fn (\w+)/);if(!m)continue;
  let end=line;while(!/[{;]\s*$/.test(src[end-1]))end++;
  let n=(test?'test_support::':owner?owner+'::':'')+m[2];if(m[2]==='compare_vec')n='<RewriteGroup as PartialEq>::eq::compare_vec';
  let vis=test?'pub in pub(crate) cfg(test) module':m[1]?.includes('(crate)')?'pub(crate)':m[1]?.includes('(super)')?'pub(super), transaction-internal':m[1]?'public':m[2]==='compare_vec'?'private local function':'trait method';
  const edge=edges[m[2]];
  let calls=edge?.[1]??(m[2]==='name'||m[2]==='fmt'?'Exhaustive variant match; formatter write for Display.':m[2]==='eq'?'Local compare_vec and Fragment::PartialEq through slice contains.':m[2]==='deep_size_of_children'?'Selected field DeepSizeOf calls; see authored exclusions.':test?'In-memory fixture construction; see exact authored range.':'Field moves/borrows; see authored range for constructor/delegate exceptions.');
  if(m[2]==='new'&&file==='builder.rs')calls=owner==='Transaction'?'TransactionBuilder::new/tag/build.':'Stores arguments and None option defaults.';
  if(m[2]==='new'&&file==='operation.rs')calls='reordered_sources(transitions), propagating InvalidInput; moves entry/base version.';
  add(a,n,line,end,'function/method',vis,edge?.[0],calls);
 }
}
const paths=new Set(batch.files.map(f=>f.path));const prior=JSON.parse(fs.readFileSync('analysis/rust-symbols.json')).filter(s=>!paths.has(s.path));
fs.writeFileSync('analysis/rust-symbols.json',JSON.stringify([...prior,...added],null,2)+'\n');
console.log({added:added.length,functions:added.filter(s=>s.kind==='function/method').length,rust_total:prior.length+added.length});
