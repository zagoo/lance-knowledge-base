import fs from 'node:fs';
import path from 'node:path';
import {root,output,linesOf}from './inventory.mjs';
const batch=JSON.parse(fs.readFileSync(path.join(output,'analysis/iteration-008-deletion-mapping.json'),'utf8'));
const added=[];let a,src,pre;
const pub='public Rust API',priv='private implementation',test='private cfg(test)';
function select(name){a=batch.files.find(f=>f.path.endsWith('/'+name+'.rs'));src=linesOf(fs.readFileSync(path.join(root,a.path),'utf8'));pre='lance_core::utils::'+name+'::';}
function add(n,l,e,k,v=pub,c='See authored range for exact local calls; complete external consumers pending.'){
 const r=a.ranges.find(([s,e])=>s<=l&&l<=e);
 added.push({name:n.startsWith('<')?n:pre+n,path:a.path,line:l,end_line:e,kind:k,visibility:v,behavior:r[2],behavior_reference:`${a.path}:${r[0]}-${r[1]}`,callers:'Local tests and delegation in L2; whole-repository call graph pending.',callees:c});
}
function fn(n,l,v=pub,c){let e=l;while(!/[{;]\s*$/.test(src[e-1]))e++;add(n,l,e,'method/function',v,c);}
select('deletion');
add('BITMAP_THRESDHOLD',11,11,'constant',priv);add('DeletionVector',16,16,'enum');for(const[n,l]of [['NoDeletions',18],['Set',19],['Bitmap',20]])add('DeletionVector::'+n,l,l,'variant');
add('OffsetMapper',140,140,'struct');for(const[n,l]of [['dv',141],['left',142],['last_diff',143]])add('OffsetMapper::'+n,l,l,'field',priv);
for(const[n,l]of [['len',35],['is_empty',43],['contains',47],['contains_range',55],['range_cardinality',63],['iter',71],['into_sorted_iter',79],['to_sorted_iter',95],['build_predicate',108]])fn('DeletionVector::'+n,l,n==='range_cardinality'?priv:pub);
fn('OffsetMapper::new',147);fn('OffsetMapper::map_offset',155,pub,'DeletionVector::len/range_cardinality/contains; u32 arithmetic/cmp; assert_ne!; binary search state mutation');
for(const[n,l,m,ml]of [
 ['<lance_core::utils::deletion::DeletionVector as DeepSizeOf>',23,'deep_size_of_children',24],
 ['<RoaringBitmap as From<&lance_core::utils::deletion::DeletionVector>>',185,'from',186],
 ['<lance_core::utils::deletion::DeletionVector as PartialEq>',195,'eq',196],
 ['<lance_core::utils::deletion::DeletionVector as Extend<u32>>',210,'extend',211],
 ['<lance_core::utils::deletion::DeletionVector as IntoIterator>',258,'into_iter',262],
 ['<lance_core::utils::deletion::DeletionVector as FromIterator<u32>>',277,'from_iter',278],
 ['<lance_core::utils::deletion::DeletionVector as From<RoaringBitmap>>',285,'from',286]
]){add(n+'::<implementation>',l,l,'implementation');fn(n+'::'+m,ml);}
add('<lance_core::utils::deletion::DeletionVector as IntoIterator>::IntoIter',259,259,'associated type');add('<lance_core::utils::deletion::DeletionVector as IntoIterator>::Item',260,260,'associated type');
for(let i=301;i<src.length;i++){const m=src[i].match(/^    fn (\w+)/);if(m)fn('test::'+m[1],i+1,test+'; module coverage excluded');}
select('fragment_reuse');add('MappingReader',21,21,'trait; async_trait');fn('MappingReader::remap_row_id',23);fn('MappingReader::remap_row_ids',26,pub,'Vec::with_capacity; sequential awaited remap_row_id; ? short-circuit');
add('OrderedCompactionMapping',38,38,'struct');add('OrderedCompactionMapping::remap',39,39,'field',priv);fn('OrderedCompactionMapping::new',44);fn('OrderedCompactionMapping::map_row_id',48,priv,'RowAddrRemap::get; Option::ok_or_else; Error::invalid_input; format!');
add('<lance_core::utils::fragment_reuse::OrderedCompactionMapping as DeepSizeOf>::<implementation>',55,55,'implementation');fn('<lance_core::utils::fragment_reuse::OrderedCompactionMapping as DeepSizeOf>::deep_size_of_children',56,pub,'Arc<RowAddrRemap>::deep_size_of_children with shared Context');
add('<lance_core::utils::fragment_reuse::OrderedCompactionMapping as MappingReader>::<implementation>',62,62,'implementation; async_trait');fn('<lance_core::utils::fragment_reuse::OrderedCompactionMapping as MappingReader>::remap_row_id',63,pub,'OrderedCompactionMapping::map_row_id');fn('<lance_core::utils::fragment_reuse::OrderedCompactionMapping as MappingReader>::remap_row_ids',67,pub,'slice::iter/map; OrderedCompactionMapping::map_row_id; collect<Result<Vec<_>>>');
add('tests::SingleRowReader',83,83,'unit struct',test);add('<lance_core::utils::fragment_reuse::tests::SingleRowReader as MappingReader>::<implementation>',86,86,'implementation',test);fn('<lance_core::utils::fragment_reuse::tests::SingleRowReader as MappingReader>::remap_row_id',87,test);fn('tests::default_batch_preserves_positions_and_propagates_errors',96,test);fn('tests::compaction_reader_preserves_legacy_mapping_semantics',109,test);
const file=path.join(output,'analysis/rust-symbols.json'),paths=new Set(batch.files.map(f=>f.path));const prior=JSON.parse(fs.readFileSync(file,'utf8')).filter(s=>!paths.has(s.path));
fs.writeFileSync(file,JSON.stringify([...prior,...added],null,2)+'\n');console.log(JSON.stringify({added:added.length,rust_total:prior.length+added.length}));
