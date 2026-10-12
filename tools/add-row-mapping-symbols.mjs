import fs from 'node:fs';
import path from 'node:path';
import {root,output,linesOf} from './inventory.mjs';
const record=path.join(output,'analysis/iteration-009-row-mapping.json');
const batch=JSON.parse(fs.readFileSync(record,'utf8'));
batch.files[1].ranges.find(r=>r[0]===484)[2]=batch.files[1].ranges.find(r=>r[0]===484)[2].replace('seeded StdRng, Random/RngExt helpers','seeded StdRng and Rng/SeedableRng traits');
fs.writeFileSync(record,JSON.stringify(batch,null,2)+'\n');
const added=[]; let a,src,pre;
const pub='public Rust API',priv='private implementation',test='private cfg(test)';
function select(n){a=batch.files.find(f=>f.path.endsWith('/'+n+'.rs'));src=linesOf(fs.readFileSync(path.join(root,a.path),'utf8'));pre='lance_core::utils::'+n+'::';}
function add(n,l,e,k,v=pub,callers='Observed local use sites are in the authored ranges and implementations; complete external callers pending.',callees='See the symbol-specific authored range and exact body; external dependency internals pending.'){
 const r=a.ranges.find(([s,e])=>s<=l&&l<=e); if(!r)throw new Error(n);
 added.push({name:n.startsWith('<')?n:pre+n,path:a.path,line:l,end_line:e,kind:k,visibility:v,behavior:r[2],behavior_reference:`${a.path}:${r[0]}-${r[1]}`,callers,callees});
}
function fn(n,l,v=pub,caller,callee){let e=l;while(!/[{;]\s*$/.test(src[e-1]))e++;add(n,l,e,'method/function',v,caller,callee);}
function imp(type,start,end,v=priv,caller,callee){
 const header=src[start-1];const m=header.match(/^impl (\w+) for (\w+)/);const q=m?`<${pre+m[2]} as ${m[1]}>`:type;
 add(q+'::<implementation>',start,start,'implementation',v,caller,callee);
 for(let i=start;i<end;i++){const f=src[i].match(/^    (pub )?fn (\w+)/);if(f)fn(q+'::'+f[2],i+1,m?v:f[1]&&v===pub?pub:priv,caller,callee);}
}
function fields(owner,items,v=priv){for(const [n,l]of items)add(owner+'::'+n,l,l,'field',v,'Owned state read/written by the containing implementation.','No call; exact field type retained.');}
select('row_addr_remap');
for(const[n,l,k,v]of [['RowAddrRemap',64,'enum',pub],['GroupInput',178,'struct',pub],['GroupInputWithLayout',189,'struct; doc(hidden)',pub],['RankedOffsets',203,'enum',priv],['DenseRankedOffsets',290,'struct',priv],['OldFragmentRemap',346,'struct',priv],['GroupRemap',360,'struct',priv],['IntHasher',506,'tuple struct',priv],['IntMap',553,'type alias',priv],['CompactRemapStep',556,'struct',priv],['RemapStep',655,'enum',priv],['CompactRowAddrRemap',707,'struct',pub],['tests::ExpectedRankedOffsets',805,'enum',test]])add(n,l,l,k,v);
for(const[o,items,v]of [['RowAddrRemap',[['Compact',67],['Direct',69]],pub],['RankedOffsets',[['Roaring',205],['Sparse',208],['Dense',210]],priv],['RemapStep',[['Compact',656],['Direct',657]],priv],['tests::ExpectedRankedOffsets',[['Sparse',806],['Dense',807],['Roaring',808]],test]])for(const[n,l]of items)add(o+'::'+n,l,l,'variant',v);
for(const[n,l]of [['ROARING_SIZE_ADVANTAGE_FOR_RANK',200],['FNV_OFFSET_BASIS',509]])add(n,l,l,'constant',priv);
fields('GroupInput',[['rewritten_old_row_addrs',180],['old_frag_ids',182],['new_frags',184]],pub);
fields('GroupInputWithLayout',[['rewritten_old_row_addrs',190],['old_frags',191],['new_frags',192]],pub);
fields('DenseRankedOffsets',[['words',291],['rank_before_word',292]]);fields('OldFragmentRemap',[['group_idx',347],['rewritten_offsets',348],['rewritten_rows_before',349],['physical_rows',350]]);fields('GroupRemap',[['new_frag_row_ranges',363]]);fields('CompactRemapStep',[['groups',557],['frags',560]]);fields('CompactRowAddrRemap',[['steps',708]]);
for(const [n,l,e,v,caller,callee]of [
 ['RowAddrRemap',72,165,pub,'Local tests; OrderedCompactionMapping uses get in rust/lance-core/src/utils/fragment_reuse.rs:47-73; external remap producers/consumers pending.','CompactRowAddrRemap construction/chaining/get/batch/proof; HashMap get/keys/is_empty; RoaringBitmap collection; RowAddress conversion.'],
 ['RowAddrRemap',167,174,pub,'DeepSizeOf traversal of RowAddrRemap; local deep-size consumers pending.','CompactRowAddrRemap or HashMap deep_size_of_children.'],
 ['RankedOffsets',213,275,priv,'GroupRemap::new_with_old_frags; CompactRemapStep::get/fully_deleted_fragments; local rank tests.','RoaringBitmap max/len/serialized_size/rank/contains; usize checked conversions; DenseRankedOffsets; Vec binary_search.'],
 ['RankedOffsets',277,287,priv,'OldFragmentRemap::deep_size_of_children.','Roaring serialized_size; Vec or DenseRankedOffsets deep_size_of_children.'],
 ['DenseRankedOffsets',295,336,priv,'RankedOffsets::try_new/rank_if_present.','Vec allocation/get_mut; count_ones; u32::try_from; Error::invalid_input.'],
 ['DenseRankedOffsets',338,343,priv,'RankedOffsets::deep_size_of_children.','Both owned Vec deep_size_of_children.'],
 ['OldFragmentRemap',353,357,priv,'IntMap child traversal through CompactRemapStep.','RankedOffsets::deep_size_of_children.'],
 ['GroupRemap',366,486,priv,'CompactRemapStep constructors/get.','RankedOffsets::try_new; RoaringTreemap bitmaps/len; HashSet insertion; IntMap removal; binary_search_by_key; RowAddress::new_from_parts.'],
 ['GroupRemap',488,492,priv,'CompactRemapStep group Vec traversal.','Vec::deep_size_of_children.'],
 ['IntHasher',511,516,priv,'BuildHasherDefault<IntHasher>.','FNV_OFFSET_BASIS constant.'],
 ['IntHasher',518,550,priv,'IntMap hash operations and local int_hash_of tests.','Wrapping u64 multiplication, byte loop, write_u64 for usize.'],
 ['CompactRemapStep',563,646,priv,'CompactRowAddrRemap constructors; RemapStep delegation; tests inspect fields.','GroupRemap constructors/compute_new_addr; RankedOffsets rank/is_empty; RowAddress extraction; IntMap get/insert/keys/values.'],
 ['CompactRemapStep',648,652,priv,'RemapStep::deep_size_of_children.','Group Vec and fragment IntMap child traversal.'],
 ['RemapStep',660,691,priv,'CompactRowAddrRemap sequential step operations.','CompactRemapStep delegates or Direct HashMap get/keys/is_empty.'],
 ['RemapStep',693,700,priv,'CompactRowAddrRemap steps Vec traversal.','CompactRemapStep or HashMap child traversal.'],
 ['CompactRowAddrRemap',711,787,pub,'RowAddrRemap methods and direct public get/is_empty consumers (external pending).','CompactRemapStep constructors; Vec extend/push; RemapStep methods in ordered loops; RoaringBitmap unions/try_fold.'],
 ['CompactRowAddrRemap',789,793,pub,'RowAddrRemap::deep_size_of_children.','Vec<RemapStep>::deep_size_of_children.']
])imp(n,l,e,v,caller,callee);
for(let i=794;i<src.length;i++){const m=src[i].match(/^    fn (\w+)/);if(m)fn('tests::'+m[1],i+1,test,'Local test harness or fixture helper calls; none in production.','See exact test assertions and authored fixture ranges.');}
add('tests::proptest!',1232,1232,'macro invocation',test);add('tests::test_compact_matches_direct_over_random_rewrites',1237,1244,'property test strategy declaration',test,'proptest generated test harness.','Generated strategies; RowAddrRemap compact/direct; HashMap independent oracle; prop_assert/prop_assert_eq/prop_assume.');
select('stable_partition');
for(const[n,l,v]of [['DEFAULT_BLOCK_ROWS',68,pub],['MAX_DESTINATIONS',72,pub],['COUNTS_MAGIC',74,priv],['COUNTS_VERSION',75,priv],['COUNTS_HEADER_BYTES',77,priv],['REPR_DENSE',82,priv]])add(n,l,l,'constant',v);
fn('corrupt',84,priv,'CountsMatrix decode/validate.','Error::corrupt_file_named("stable_partition_counts", message).');
for(const[n,l]of [['CountsMatrix',96],['CountsMatrixBuilder',326],['SweepTranslator',449]])add(n,l,l,'struct');
fields('CountsMatrix',[['num_destinations',98],['block_rows',100],['total_rows',102],['cumulative',104]]);
fields('CountsMatrixBuilder',[['num_destinations',327],['block_rows',328],['running',329],['cumulative',330],['total_rows',331],['rows_in_block',332]]);fields('SweepTranslator',[['counters',450]]);
imp('CountsMatrix',107,315,pub,'CountsMatrixBuilder shape validation; point/sweep translation; encode/decode/tests; external IO consumers pending.','Private block_row/check_shape/check_label; corrupt; Vec byte encoding/decoding; integer checked payload sizing; slice access.');
imp('CountsMatrix',317,321,pub,'DeepSizeOf consumers pending.','Vec capacity times size_of<u32>.');
imp('CountsMatrixBuilder',335,385,pub,'Local build test helper; external streaming producers pending.','CountsMatrix::check_shape; checked u32 counter increment; Vec extend_from_slice; Error::invalid_input.');
fn('rank_label_prefix',389,pub,'translate_in_block and external direct users pending.','Slice prefix iteration/filter/count; NullBuffer null_count/is_valid.');
fn('translate_in_block',416,pub,'Local point-translation tests; external mapping readers pending.','CountsMatrix block_range/check_label/count_before; rank_label_prefix; NullBuffer is_valid; Error::invalid_input.');
imp('SweepTranslator',453,482,pub,'Local sweep tests; external mapping readers pending.','CountsMatrix num_blocks/counters_at_block; Vec get_mut; Error::invalid_input.');
for(let i=483;i<src.length;i++){const m=src[i].match(/^    fn (\w+)/);if(m)fn('tests::'+m[1],i+1,test,'Local tests/harness.','Public builder/codec/translation APIs, seeded RNG and independent HashMap oracle; exact test bodies retained.');}
const target=path.join(output,'analysis/rust-symbols.json');const paths=new Set(batch.files.map(f=>f.path));const prior=JSON.parse(fs.readFileSync(target,'utf8')).filter(s=>!paths.has(s.path));
fs.writeFileSync(target,JSON.stringify([...prior,...added],null,2)+'\n');
console.log(JSON.stringify({added:added.length,rust_total:prior.length+added.length}));
