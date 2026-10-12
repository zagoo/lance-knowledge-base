import fs from 'node:fs';import path from 'node:path';import{root,output,linesOf}from './inventory.mjs';const read=f=>fs.readFileSync(path.join(output,f),'utf8'),write=(f,s)=>fs.writeFileSync(path.join(output,f),s.trimEnd()+'\n'),append=(f,s)=>fs.appendFileSync(path.join(output,f),'\n'+s.trim()+'\n');let t=read('L1-modules/rust-lance-table.md').replace('Twenty-three of 54 inventory entries are analyzed, covering 10,013 physical lines','Twenty-four of 54 inventory entries are analyzed, covering 11,637 physical lines').replace('Full Row-ID sequence/segment operations, transaction algorithms','Full Row-ID sequence operations, transaction algorithms').replace('sequence/segment operations pending','full sequence operations pending').replace('Exact compact-selection eligibility remains in unanalyzed segment.rs.','Compact grouping accepts at least two ranges whose enclosing span fits u32 and gap validation succeeds; it does not compare wire cost. (rust/lance-table/src/rowids/segment.rs:245-266)');write('L1-modules/rust-lance-table.md',t);
append('L1-modules/rust-lance-table.md',`## U64Segment: encoding choices and positional operations

[Segment L2](../L2-files/rust/lance-table/src/rowids/segment.rs.md) covers public rowids::segment, including U64Segment and a borrowing SegmentCursor; SegmentCursorState is crate-visible. The nearby parent comment calls structures private, but segment is declared pub. Variants expose bounds and bitmap/array/runs values without an invariant-checking constructor barrier. (rust/lance-table/src/rowids.rs:17-24; rust/lance-table/src/rowids/segment.rs:40-82; rust/lance-table/src/rowids/segment.rs:749-768)

from_slice/FromIterator collect values and scan min/max/count/nondecreasing order. Unsorted chooses Array. Sorted empty becomes Range0..0, contiguous distinct values become Range when max+1 fits, and values ending at u64MAX always use SortedArray. Other sorted values select the minimum estimated cost below, with ties favoring holes then bitmap then array. The estimate is heuristic: actual compressed array widths and protobuf overhead differ. (rust/lance-table/src/rowids/segment.rs:144-243; rust/lance-table/src/rowids/segment.rs:293-299)

| Candidate | Cost estimate | Construction |
|---|---|---|
| RangeWithHoles |24 +4 × missing slots | Scan every inclusive slot; collect/sort missing absolute values and encode array |
| RangeWithBitmap |24 +ceil(inclusive span /8) | Allocate full bitmap then scan/clear missing slots |
| SortedArray |24 +2 × value count | Encode collected values using actual U16/U32/U64 choice |

Cost arithmetic uses u128 and saturates to usizeMAX; it does not validate duplicates, cap allocations or ensure32-bit span fit. Distinctness is a documented precondition. For example sorted[0,0,2] is counted as three contiguous slots and becomes0..3; this is a source-derived counterexample, not an executed test. (rust/lance-table/src/rowids/segment.rs:97-239)

from_sorted_ranges creates Ranges for at least two intervals with u32 enclosing span and validated hole runs, without a cost threshold. Arithmetic before validation is unchecked for malformed intervals. as_ranges instead converts only bitmaps with logical length<=u32MAX when16 × (missing runs+1) is strictly smaller than bitmap byte length. It allocates HoleRuns even when rejected and has no table opt-in parameter; caller policy remains pending. (rust/lance-table/src/rowids/segment.rs:245-289)

| Operation | Observed contract |
|---|---|
| len/is_empty | Range span minus hole count or bitmap zero count; Ranges uses present count; arrays use length. Public malformed state can underflow or disagree with iteration |
| range | Stored bounding interval for range-backed arms, even if no values remain; sorted array endpoints; arbitrary array extrema |
| slice | Positional skip/take, silently short at EOF, retains numeric values, copies and reselects; zero request ignores offset |
| position/get | Translate value↔present ordinal; holes and Ranges use searches; bitmap position counts prefix bits, bitmap get uses select1 scan |
| contains | Hole membership scans holes linearly; sorted arrays search, arbitrary arrays scan |
| with_new_high | Consumes self, requires value above reported bound; range-backed val+1 unchecked; gaps can allocate proportional to distance |
| delete/mask | Assumed ordered existing values or ordered unique valid positions; rebuild/reselect, no Result validation |

These contracts follow rust/lance-table/src/rowids/segment.rs:301-747. The doc claim that range excludes tombstones is broader than implementation: all-zero bitmap with bounds0..8 reports Some0..=7 despite len0. mask also clears everything whenever the supplied list length equals segment length, regardless of duplicate/invalid entries. Constructor max protection does not extend to range-backed with_new_high. (rust/lance-table/src/rowids/segment.rs:330-376; rust/lance-table/src/rowids/segment.rs:520-580; rust/lance-table/src/rowids/segment.rs:694-710)

## Segment cursors and dense byte expansion

Cursor state is byte index plus count of set bits in preceding bytes. Backward requests reset only when requested ordinal precedes that count; an early return in a target byte keeps state at its beginning. Ordinary extension walks set bits; dense extension uses whole-byte or contiguous-one-run expansion when a fully selected byte has at least six set bits. Both rely on zero padding and can emit malformed padding past logical end. Requests past EOF silently truncate. (rust/lance-table/src/rowids/segment.rs:749-954)

The density advisory uses caller-supplied segment_len>=logical_len-floor(logical_len/4). It is separate from dense extension, which never checks density itself. SegmentCursor binds a shared borrow to one segment; SegmentCursorState accepts a new source on every call without resetting by identity, and nonbitmap operations leave old bitmap state intact. Complete RowIdSequence ownership/reset policy remains pending. (rust/lance-table/src/rowids/segment.rs:346-354; rust/lance-table/src/rowids/segment.rs:749-855; rust/lance-table/src/rowids/segment.rs:925-954)
`);
const syms=JSON.parse(read('analysis/rust-symbols.json')),chosen=syms.filter(s=>s.path.endsWith('/rowids/segment.rs'));append('L1-modules/rust-lance-table.md','## Exact reviewed segment declarations\n\n| Symbol | Exact declaration | Visibility | Evidence |\n|---|---|---|---|\n'+chosen.map(s=>{const src=linesOf(fs.readFileSync(path.join(root,s.path),'utf8'));return '| `'+s.name+'` | `'+src.slice(s.line-1,s.end_line).join(' ').replaceAll('|','\\|')+'` | '+s.visibility+' | ['+s.path+':'+s.line+'-'+s.end_line+'](../L2-files/'+s.path+'.md) |';}).join('\n'));
append('L0-orientation.md',`## Segment coordinates and scan state

- **U64Segment:** one of six in-memory representations of an intended distinct u64 sequence. Numeric values, present ordinals and enclosing numeric bounds are separate coordinates. Selection chooses five forms; compact Ranges comes from explicit range grouping/bitmap conversion. [Module](L1-modules/rust-lance-table.md). (rust/lance-table/src/rowids/segment.rs:16-82; rust/lance-table/src/rowids/segment.rs:196-299)
- **SegmentCursor / SegmentCursorState:** a public borrowed segment reader and its crate-visible bitmap byte/rank state. The wrapper fixes the source; reusable state alone does not. Dense expansion batches contiguous set-bit runs, while selection indices count present values. (rust/lance-table/src/rowids/segment.rs:749-954)
`);
append('L3-symbols/behavior-contracts.md',`## Segment invariants, mutation and complexity

U64Segment assumes distinct values but compute_stats only detects descent. Equal values can produce incorrect contiguous reconstruction or hole-count underflow; there is no error-returning distinctness validator in from_slice. Direct variants also permit inconsistent bounds/bitmap lengths, unsorted holes or noncanonical arrays. Wire validation establishes many payload invariants but general Array and cross-segment uniqueness remain unchecked. (rust/lance-table/src/rowids/segment.rs:97-239; rust/lance-table/src/rowids/serde.rs:98-230)

range reports enclosing bounds for Range/holes/bitmap/Ranges, rather than present extrema. Thus an empty-presence nonempty-bounds segment can be is_empty while range is Some. with_new_high tests against those bounds and consumes self on error. Its range-backed append computes val+1 unchecked; its array/Ranges reconstruction paths can represent u64MAX. Do not infer append safety from constructor boundary tests. (rust/lance-table/src/rowids/segment.rs:330-376; rust/lance-table/src/rowids/segment.rs:507-668; rust/lance-table/src/rowids/segment.rs:1137-1194)

| Query | Cost from source for valid state |
|---|---|
| Holes len | Constant backing length arithmetic |
| Holes get/position | Binary search in hole array |
| Holes contains | Linear scan of holes |
| Holes full iter | Numeric span visited, binary search per slot |
| Bitmap len | Byte popcount scan |
| Bitmap position | Prefix-byte popcount after bit check |
| Bitmap get | New select cursor each call; scans bytes to ordinal |
| Ranges get/position | HoleRuns prefix binary search |
| Slice | Iterates skipped/emitted values and copies selected values again for reconstruction |

These are algorithmic observations, not timings or allocation benchmarks. Array searches/iteration use the corresponding encoded-array methods. (rust/lance-table/src/rowids/segment.rs:301-505; rust/lance-table/src/rowids/encoded_array.rs:29-191; rust/lance-table/src/rowids/runs.rs:132-215)

delete filters by ordered requested values twice, with debug-only bounding checks. mask trusts list cardinality and ordered unique positions; cardinality equal to len clears all without checking entries. Successful rebuilding changes representation and drops Ranges. A mask mutation assigns only after reconstruction, but no panic-recovery contract is provided. Version masking delegates here, so its own Result does not supply validation for these invariants. (rust/lance-table/src/rowids/segment.rs:670-746; rust/lance-table/src/rowids/version.rs:314-341)

Bitmap cursor state counts only completed bytes. Requests within the current byte rescan its bits; requests before ones_before rewind. Nonbitmap calls do not clear it, so reusing state across distinct bitmaps requires caller reset. Dense full-byte expansion and sparse per-set-bit selection both trust zero padding; direct public mutation can violate it despite decoder checks. (rust/lance-table/src/rowids/segment.rs:749-954; rust/lance-table/src/rowids/serde.rs:132-155)
`);
append('L3-symbols/format-spec.md',`## Segment selection versus wire representation

The selector's24+4*holes,24+ceil(span/8),24+2*count costs are heuristic byte estimates, saturated through u128→usize. They do not equal actual protobuf lengths or adapt to the eventual array width. Range exclusivity prevents constructors from using a range-backed form when maximum is u64MAX; SortedArray handles that case. No Ranges variant is selected by from_slice. (rust/lance-table/src/rowids/segment.rs:176-243)

Decoder folding calls from_sorted_ranges: at least two inputs, u32 enclosing span and valid maximal gaps produce Ranges, independently of as_ranges cost policy. The explicit bitmap optimization uses16 bytes per estimated present interval and strict less-than against bitmap payload length. No feature flag check exists in either helper. Actual sequence/commit opt-in must be traced before claiming a dataset-format gate. Both forms serialize through existing Range wire arms only at RowIdSequence level. (rust/lance-table/src/rowids/segment.rs:245-289; rust/lance-table/src/rowids/serde.rs:60-96; rust/lance-table/src/rowids/serde.rs:232-299)

On32-bit targets, segment.len casts a potentially larger u64 span to usize; the row-ID decoder fast path does not call validate_range, unlike protobuf conversion fallback. Aggregate checked u64 summation occurs after these segment lengths, so it does not independently establish that no earlier truncation happened. This is source-derived portability analysis; no32-bit build/test was run. (rust/lance-table/src/rowids/segment.rs:330-344; rust/lance-table/src/rowids/serde.rs:19-30; rust/lance-table/src/rowids/serde.rs:376-426)
`);
append('L4-crosscutting/scenarios.md',`## Local trace: construct, select and mutate a segment

1. Collect distinct input IDs, compute min/max/count/nondecreasing order, choose Range/holes/bitmap/sorted array/general array using representability and estimated cost. Holes/bitmap construction scans numeric span; sparse arrays avoid that expansion. (rust/lance-table/src/rowids/segment.rs:126-299)
2. Translate ID to present ordinal through position, then get/select through variant-specific logic. Bitmap cursor retains byte/rank state for subsequent calls; full-range expansion can batch dense bytes if the caller selects that method. (rust/lance-table/src/rowids/segment.rs:389-479; rust/lance-table/src/rowids/segment.rs:770-954)
3. Slice preserves numeric IDs, while delete/mask rebuild surviving values using assumed-valid ordered inputs. Append retains/widens several representations and may allocate a full numeric gap; range-backed end arithmetic differs from constructor boundary handling. (rust/lance-table/src/rowids/segment.rs:378-387; rust/lance-table/src/rowids/segment.rs:507-746)
4. Optional bitmap-to-Ranges conversion may reduce estimated serialized range bytes. Sequence serialization expands it back to ordinary Range arms. Full sequence concatenation, cursor reset, opt-in, transaction triggers and on-disk placement remain untraced. (rust/lance-table/src/rowids/segment.rs:268-289; rust/lance-table/src/rowids/serde.rs:232-255)
`);
append('L4-crosscutting/cookbook.md',`## Local extension seam: segment representation or cursor behavior

Changing U64Segment requires exhaustive dispatch in size accounting, selection, iteration, len/range/slice, position/get/contains, append/delete/mask and cursor extension; coordinate with array/bitmap/HoleRuns and protobuf conversions. If a new in-memory form has no standalone wire form, explicitly cover version-run serialization as well as sequence serialization. Ranges currently panics in the standalone converter. This is a local touch map; full rowids.rs and dataset/transaction consumers remain prerequisites. (rust/lance-table/src/rowids/segment.rs:40-954; rust/lance-table/src/rowids/serde.rs:232-338; rust/lance-table/src/rowids/version.rs:520-559)

Extend existing segment tests with independently expected survivors, duplicate/unsorted/out-of-bounds masks, all-missing ranges, absent endpoint values, appendu64MAX, compressed-width widening, invalid from_sorted_ranges and state rewind/source-reset cases. Cover numeric span versus present ordinal explicitly. Preserve stable released wire contracts after inspecting historical fixtures; current heuristic/equality tests alone are not compatibility qualification. (rust/lance-table/src/rowids/segment.rs:957-1624; AGENTS.md:7-18)

For performance work distinguish span scans from present-value scans and boxed iterator/copy costs. Compare density threshold and per-byte six-bit threshold only with controlled benchmarks after callers are known; these values are source policies, not measured optimal constants. Respect u32 compact-span and usize platform boundaries. (rust/lance-table/src/rowids/segment.rs:245-354; rust/lance-table/src/rowids/segment.rs:378-387; rust/lance-table/src/rowids/segment.rs:804-954)
`);
append('L4-crosscutting/pitfalls.md',`## Segment pitfalls

- Sorted does not establish distinctness: constructor[0,0,2] can become Range0..3. This source-only example violates the documented distinct-input precondition. (rust/lance-table/src/rowids/segment.rs:16-19; rust/lance-table/src/rowids/segment.rs:115-121; rust/lance-table/src/rowids/segment.rs:144-209)
- An all-zero bitmap with bounds0..8 has len0 but rangeSome0..=7; bounds are not present extrema despite doc wording. (rust/lance-table/src/rowids/segment.rs:330-376)
- Equal mask cardinality clears all even for duplicate indices; partial masks also assume ordered unique in-bounds positions. (rust/lance-table/src/rowids/segment.rs:694-745)
- from_slice safely handles u64MAX by choosing an array, but range-backed with_new_high still uses val+1 unchecked. (rust/lance-table/src/rowids/segment.rs:196-235; rust/lance-table/src/rowids/segment.rs:520-580)
- Grouping decoded ranges and optimizing a bitmap use different admission rules; neither checks dataset opt-in here. (rust/lance-table/src/rowids/segment.rs:245-289; rust/lance-table/src/rowids/serde.rs:79-96)
`);
append('L4-crosscutting/build-and-test.md',`## Segment source tests and gaps

Local tests cover bitmap public mutation, dense/partial expansion, five constructor forms, iterator direction/interleaving and get/position inverses, zero-span empty extrema, u64 boundary construction, large hole counts, synthetic cost saturation, append/contains and Ranges equivalence/size rejection. Several delete/mask checks compare two forms using the same implementation rather than an independent survivor oracle. (rust/lance-table/src/rowids/segment.rs:957-1624)

The hole-count test comment says every width, but its actual arrays select U32 and U16; no forced U64 holes occur in that fixture. Full-span bitmap cost test assumes64-bit usize without cfg guard. Empty-extrema fixture omits nonempty bounds with zero presence and Ranges. No local duplicate-construction, malformed masks, compressed append widening or u64MAX append test exists. Source tests were read, not executed. (rust/lance-table/src/rowids/segment.rs:1113-1135; rust/lance-table/src/rowids/segment.rs:1222-1294; rust/lance-table/src/rowids/segment.rs:1296-1624; rust/lance-table/src/rowids/encoded_array.rs:193-212)
`);
const record='analysis/iteration-032-rowid-segment.json',batch=JSON.parse(read(record)),m=JSON.parse(read('MANIFEST.json'));
for(const p of ['rust/lance-table/src/rowids/serde.rs','rust/lance-table/src/rowids/version.rs','rust/lance-table/src/rowids/runs.rs','rust/lance-table/src/rowids/bitmap.rs','rust/lance-table/src/rowids/encoded_array.rs','rust/lance-table/src/format.rs','rust/lance-table/src/format/fragment.rs','rust/lance-table/src/format/manifest.rs']){
 const e=m.files.find(e=>e.path===p),a=JSON.parse(read(e.analysis_record)).files.find(f=>f.path===p);
 if(p.endsWith('/serde.rs')){a.ranges.find(r=>r[0]===79)[2]=a.ranges.find(r=>r[0]===79)[2].replace('Exact compaction eligibility and segment storage cost require segment.rs, still pending; comments mention a lone range and overly wide span.','Eligibility is at least two ranges, enclosing span fitting u32 and valid HoleRuns gaps; no cost threshold is used (rust/lance-table/src/rowids/segment.rs:245-266).');a.ranges.find(r=>r[0]===257)[2]=a.ranges.find(r=>r[0]===257)[2].replace('Comments about which constructors produce Ranges await segment analysis.','from_slice/slice/mask indeed do not emit Ranges (rust/lance-table/src/rowids/segment.rs:196-243; rust/lance-table/src/rowids/segment.rs:378-387; rust/lance-table/src/rowids/segment.rs:694-746).');a.ranges.find(r=>r[0]===376)[2]=a.ranges.find(r=>r[0]===376)[2].replace('exact per-segment length behavior still depends on pending segment.rs.','segment.len casts range spans to usize before aggregate summation, so32-bit truncation is not prevented here (rust/lance-table/src/rowids/segment.rs:330-344).');a.limits='All884 physical lines read in bounded chunks. Segment/array/bitmap/HoleRuns operations are now covered; full RowIdSequence and dataset integration remain pending. Tests were read, not run; released interoperability and32-bit concerns remain unverified. Source remained read-only.';}
 if(p.endsWith('/version.rs')){a.ranges.find(r=>r[0]===285)[2]=a.ranges.find(r=>r[0]===285)[2].replace('Segment range/position details remain pending;','Segment range supplies stored bounds and position then checks actual presence (rust/lance-table/src/rowids/segment.rs:360-431);');a.ranges.find(r=>r[0]===314)[2]=a.ranges.find(r=>r[0]===314)[2].replace('Segment masking semantics remain delegated.','Segment mask is now covered: list cardinality equal to segment length clears all regardless of entries, and other paths assume ordered unique in-bounds positions (rust/lance-table/src/rowids/segment.rs:694-746).');a.ranges.find(r=>r[0]===613)[2]+=' Segment slicing retains numeric values through skip/take and reconstruction, silently truncates excess selection and never selects Ranges (rust/lance-table/src/rowids/segment.rs:378-387).';a.limits=a.limits.replace('Segment/RowIdSequence,','Full RowIdSequence,');}
 if(p.endsWith('/runs.rs'))a.limits=a.limits.replace('Segment selection and integration callers remain pending.','Segment selection is now covered at rust/lance-table/src/rowids/segment.rs:245-289; full sequence/transaction integration remains pending.');
 if(p.endsWith('/bitmap.rs'))a.limits=a.limits.replace('Enclosing segment selection/masking remains pending full analysis.','Enclosing segment selection/masking is now covered at rust/lance-table/src/rowids/segment.rs:126-299 and rust/lance-table/src/rowids/segment.rs:694-746; full sequence callers remain pending.');
 if(p.endsWith('/encoded_array.rs'))a.limits=a.limits.replace('enclosing row-ID segment selection and public sequence contracts remain pending.','enclosing segment selection is covered at rust/lance-table/src/rowids/segment.rs:126-299; complete public sequence contracts remain pending.');
 a.ranges=a.ranges.map(([b,e,n])=>[b,e,n.replace('transaction consumers and segment operations remain pending.','segment operations are now covered at rust/lance-table/src/rowids/segment.rs:1-1624; full sequence and transaction consumers remain pending.')]);a.limits=a.limits.replace('row-ID segment operations and dataset consumers remain pending;','full RowIdSequence and dataset consumers remain pending;');batch.files.push(a);for(const s of syms.filter(s=>s.path===p)){const r=a.ranges.find(([b,e])=>b<=s.line&&s.line<=e);s.behavior=r[2];s.behavior_reference=`${p}:${r[0]}-${r[1]}`;}
}
write(record,JSON.stringify(batch,null,2));write('analysis/rust-symbols.json',JSON.stringify(syms,null,2));console.log({new_file:1,new_symbols:83,refreshed_existing:8,table_files:24,table_lines:11637});
