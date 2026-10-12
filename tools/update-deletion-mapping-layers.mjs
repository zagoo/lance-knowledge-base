import fs from 'node:fs';
import path from 'node:path';
import {output}from './inventory.mjs';
const read=f=>fs.readFileSync(path.join(output,f),'utf8');const write=(f,s)=>fs.writeFileSync(path.join(output,f),s+'\n');
const symbols=JSON.parse(read('L3-symbols/symbols.json')),paths=new Set(['rust/lance-core/src/utils/deletion.rs','rust/lance-core/src/utils/fragment_reuse.rs']);
const marker='\n## Deletion vectors and single-rewrite mapping\n';
function append(f,t){const s=read(f),i=s.indexOf(marker);write(f,(i<0?s.trimEnd():s.slice(0,i).trimEnd())+marker+'\n'+t.trim());}
write('L1-modules/rust-lance-core-deletion-mapping.md',`# Deletion vectors and single-rewrite mapping

**Two files analyzed; full deletion IO, RowAddrRemap, FRI graph traversal and dataset compaction remain INCOMPLETE.** [Core overview](rust-lance-core.md) · [Orientation](../L0-orientation.md) · [Symbols](../L3-symbols/symbol-index.md) · [Scenarios](../L4-crosscutting/scenarios.md).

## Deletion state and representation

DeletionVector is a public enum of NoDeletions, Set(HashSet<u32>) and Bitmap(RoaringBitmap), deriving Debug/Clone/Default with NoDeletions as default. Values are deleted offsets within a single fragment, not stable row IDs or a persisted-file discriminator. Public variants permit bypassing normalization and threshold assumptions. len/is_empty count unique stored offsets; contains tests membership. (rust/lance-core/src/utils/deletion.rs:14-53)

The private threshold is 5,000 and has an unresolved benchmark TODO. Construction through FromIterator uses Extend, whose representation choice depends on iterator size bounds as well as eventual distinct cardinality. NoDeletions plus known-empty stays NoDeletions; lower>=5000 selects Bitmap; known upper<5000 selects Set; otherwise collect Set and promote only when len>5000. Existing Set promotes strictly above 5000; Bitmap never demotes. Exactly 5000 values can therefore produce different variants, and a duplicate-heavy lower bound can create a small Bitmap. From<RoaringBitmap> normalizes only empty to NoDeletions. (rust/lance-core/src/utils/deletion.rs:10-12; rust/lance-core/src/utils/deletion.rs:209-251; rust/lance-core/src/utils/deletion.rs:276-293)

Set and Bitmap compare by contents across representations, with temporary bitmap allocation for the cross-case. NoDeletions compares unequal to empty Set/Bitmap, though len/is_empty agree. Set iteration is unspecified order in iter; both consuming iteration APIs sort Set values, and borrowed to_sorted_iter clones the Set first. Comments assuming small sets do not constrain directly constructed public variants. (rust/lance-core/src/utils/deletion.rs:71-103; rust/lance-core/src/utils/deletion.rs:194-208; rust/lance-core/src/utils/deletion.rs:252-275)

Memory sizing delegates Set to approximate HashSet accounting and uses serialized bitmap bytes as an explicitly inexact estimate. There is no allocator measurement, file serialization or storage read here. (rust/lance-core/src/utils/deletion.rs:22-32; rust/lance-core/src/deepsize.rs:213-220)

## Predicate and visible-offset mapping

build_predicate receives an iterator over u64 row addresses and casts each to u32, discarding fragment identity. It returns Some(non-null BooleanArray) with true for undeleted rows for Set/Bitmap; only NoDeletions returns None. Applying it to addresses from a different fragment silently uses that other row's low offset, so caller partitioning is essential. Empty stored variants are not optimized to None. (rust/lance-core/src/utils/deletion.rs:104-124)

OffsetMapper owns Arc<DeletionVector>, a persistent left bound and last successful physical-minus-visible offset difference. It expects monotonically increasing visible ordinals; new initializes both cached numbers to zero. map_offset starts at offset+last_diff, bounds the right side by offset+number of deletions and binary-searches using the count of deleted offsets through mid. Success requires mid==offset+deleted_count and mid itself undeleted. It updates last_diff on success and left when moving right. (rust/lance-core/src/utils/deletion.rs:125-183)

No fragment physical length or fallible Result boundary exists in OffsetMapper. Arithmetic uses unchecked-in-source u32 addition/subtraction and mid+1, which may panic with overflow checks or wrap without them; ascending-input requirements are not validated. Set range_cardinality scans the entire queried offset interval, so a small Set with a large requested row offset can perform expensive scans on each binary-search step. (rust/lance-core/src/utils/deletion.rs:63-69; rust/lance-core/src/utils/deletion.rs:140-183)

Extend takes self to default before collecting the new state. If iteration or another operation panics after that take, previous deletion state is not restored. This is a panic-path observation, not a claim about normal Result failure or concurrent visibility. (rust/lance-core/src/utils/deletion.rs:209-251)

## MappingReader boundary

MappingReader:Send+Sync+Debug+DeepSizeOf uses async_trait and names its inputs row IDs, but explicitly requires physical addresses. Single lookup returns Result<Option<u64>>; None means deleted within the valid source domain, while an absent fragment/out-of-range offset must be InvalidInput. Invalid persisted mapping contents must produce CorruptFile and storage errors propagate. The default batch implementation reserves input size, sequentially awaits single lookups, preserves order/duplicates and stops at the first error without returning partial output. (rust/lance-core/src/utils/fragment_reuse.rs:14-33)

OrderedCompactionMapping owns Arc<RowAddrRemap> and assumes construction already validated the remap layout. new does not revalidate. Its helper turns outer remap.get absence into InvalidInput with the row ID, preserving inner None for deletion; its batch override synchronously maps/collects instead of awaiting each single operation. DeepSizeOf forwards through the Arc with shared Context. The adapter does not replace legacy FRI reader/writer and does not traverse mapping graphs. (rust/lance-core/src/utils/fragment_reuse.rs:4-4; rust/lance-core/src/utils/fragment_reuse.rs:34-73)

## Extension and test boundaries

Implementing MappingReader requires single lookup; the default batch is a sequential correctness baseline, and an override must retain result cardinality/order/duplicates/None positions and input-error behavior. Persisted validation and storage integration cannot be designed from this trait alone. The default test uses a unit mock, while the adapter test compares results to RowAddrRemap itself with two source and two destination fragments. It verifies adaptation/equivalence and invalid addresses, not an independent proof of the remap algorithm. (rust/lance-core/src/utils/fragment_reuse.rs:14-33; rust/lance-core/src/utils/fragment_reuse.rs:74-144)

Deletion tests exercise conversions, threshold promotion, range membership, predicate polarity, iterator ordering, estimates and several ascending offset maps. Missing local cases include representation equality for empty stored variants, hint-dependent exactly5000, duplicate-heavy hints, unwind preservation, mixed-fragment predicates, descending ordinals and u32 boundaries. Tests were inspected, not executed. (rust/lance-core/src/utils/deletion.rs:294-522)

## Exact public declarations and implementations

Implementation headers preserve associated method constraints. Full bodies and private state are in the linked L2 documents; async_trait macro-generated future signatures are not invented here.

| Qualified symbol | Kind | Exact declaration | Analysis/evidence |
|---|---|---|---|
${symbols.filter(s=>paths.has(s.path)&&s.visibility==='public Rust API').map(s=>`| \`${s.name}\` | ${s.kind} | \`${s.signature.replaceAll('|','\\|')}\` | [${s.path}:${s.line}-${s.end_line}](../${s.analysis}) |`).join('\n')}

## Files

- [deletion.rs](../L2-files/rust/lance-core/src/utils/deletion.rs.md), rust/lance-core/src/utils/deletion.rs:1-522.
- [fragment_reuse.rs](../L2-files/rust/lance-core/src/utils/fragment_reuse.rs.md), rust/lance-core/src/utils/fragment_reuse.rs:1-144.
`);
let core=read('L1-modules/rust-lance-core.md').replace('twenty-six files','twenty-eight files').replace('retry delays and temporary resources.','retry delays, temporary resources, deletion vectors and the single-rewrite mapping adapter.');write('L1-modules/rust-lance-core.md',core.trimEnd());
append('L1-modules/rust-lance-core.md','The [deletion/mapping supplement](rust-lance-core-deletion-mapping.md) documents local offset filtering, stateful visible-to-physical mapping and the MappingReader contract, with exact declarations. It does not complete deletion-file IO or FRI graph traversal. (rust/lance-core/src/utils/deletion.rs:14-183; rust/lance-core/src/utils/fragment_reuse.rs:4-73)');
append('L0-orientation.md',`| Term | Local meaning | Evidence |
|---|---|---|
| DeletionVector | Set of deleted u32 offsets within one fragment; three in-memory representations | rust/lance-core/src/utils/deletion.rs:14-21 |
| Visible ordinal | Position among nondeleted rows, mapped by OffsetMapper to a physical local offset | rust/lance-core/src/utils/deletion.rs:125-183 |
| MappingReader | One rewrite's physical-address mapping with position-preserving optional results | rust/lance-core/src/utils/fragment_reuse.rs:14-33 |
| OrderedCompactionMapping | Adapter around one RowAddrRemap, not the FRI graph reader | rust/lance-core/src/utils/fragment_reuse.rs:34-73 |

[Detailed API supplement](L1-modules/rust-lance-core-deletion-mapping.md).`);
append('L3-symbols/behavior-contracts.md',`[Exact declarations and local contracts](../L1-modules/rust-lance-core-deletion-mapping.md).

| Surface | Preserved behavior / modification concern | Evidence |
|---|---|---|
| Representation threshold | Iterator count bounds and unique cardinality use different >=5000 versus >5000 branches; do not assume one canonical representation per set | rust/lance-core/src/utils/deletion.rs:209-251 |
| Empty equality | NoDeletions differs from empty stored variants; From<RoaringBitmap> may normalize first | rust/lance-core/src/utils/deletion.rs:194-208; rust/lance-core/src/utils/deletion.rs:285-293 |
| Predicate | true retains rows; high32 ignored; None only for NoDeletions | rust/lance-core/src/utils/deletion.rs:104-124 |
| OffsetMapper | Cached bounds/difference expect ascending ordinals; no row-count/error boundary; Set cardinality scans ranges | rust/lance-core/src/utils/deletion.rs:63-69; rust/lance-core/src/utils/deletion.rs:125-183 |
| MappingReader | Deleted result is Ok(None); out-of-domain input is Err(InvalidInput); valid batch preserves duplicates/order | rust/lance-core/src/utils/fragment_reuse.rs:14-33 |
| Adapter | Preserve nested Option meaning and error-message row ID; batch override has no internal awaits | rust/lance-core/src/utils/fragment_reuse.rs:47-73 |

Legacy FRI reader/writer behavior is expressly outside this adapter's change scope; a new implementation must not infer permission to retrofit that frozen path from the adapter name. (rust/lance-core/src/utils/fragment_reuse.rs:35-36; AGENTS.md:13-17)`);
append('L4-crosscutting/scenarios.md',`This local trace stops before storage IO or dataset compaction:

1. Collect u32 deleted offsets into DeletionVector; Extend picks Set/Bitmap using count hints and threshold rules. (rust/lance-core/src/utils/deletion.rs:209-251; rust/lance-core/src/utils/deletion.rs:277-283)
2. Given addresses already belonging to that fragment, build_predicate strips the high32 and computes undeleted flags. Alternatively, OffsetMapper translates ascending visible ordinals to local physical offsets using deletion cardinality. (rust/lance-core/src/utils/deletion.rs:104-183)
3. For an already constructed rewrite remap, OrderedCompactionMapping retains its Arc and maps each physical address. Missing outer lookup becomes InvalidInput; inner None remains deletion. (rust/lance-core/src/utils/fragment_reuse.rs:34-73)
4. The fixture compares this adapter with its underlying remap across two old/two new fragments and checks duplicate/deleted/out-of-domain cases. It provides no independent expected-address oracle or end-to-end persisted compaction trace. (rust/lance-core/src/utils/fragment_reuse.rs:107-144)

All five complete KB-only acceptance questions remain failures; the next missing local dependency is RowAddrRemap, followed by FRI selection/traversal and dataset orchestration.`);
append('L4-crosscutting/pitfalls.md',`- Set range-cardinality loops over every candidate offset, so small deletion cardinality does not imply cheap OffsetMapper queries at large physical offsets. (rust/lance-core/src/utils/deletion.rs:63-69; rust/lance-core/src/utils/deletion.rs:155-181)
- Empty variants have different equality and predicate outcomes. Exact-size and unknown-size streams at 5000 can produce different variants, and Extend does not restore old state after an unwind past mem::take. (rust/lance-core/src/utils/deletion.rs:104-124; rust/lance-core/src/utils/deletion.rs:194-251)
- MappingReader's row_id names refer to physical addresses. Preserve the difference between a deleted in-domain row and invalid input; a batch failure returns no partial Vec. (rust/lance-core/src/utils/fragment_reuse.rs:14-33; rust/lance-core/src/utils/fragment_reuse.rs:47-73)
- The adapter test uses the remap implementation as its expected-result oracle. Passing that test alone would not establish remap rank/layout correctness. (rust/lance-core/src/utils/fragment_reuse.rs:107-129)`);
append('L4-crosscutting/build-and-test.md',`Deletion tests use rstest and a coverage-excluded module; the densest mapper fixture has 1,000 physical rows but asserts four selected outputs. Adapter Tokio tests cover default batch behavior and two-source/two-destination layout adaptation, checking error variant and text. These tests were read and not executed. (rust/lance-core/src/utils/deletion.rs:294-522; rust/lance-core/src/utils/fragment_reuse.rs:74-144)

No static source finding in this slice is reported as a runtime regression. Validation for future changes must retain the existing assertions and add the missing boundary cases called out in the [supplement](../L1-modules/rust-lance-core-deletion-mapping.md).`);
append('L4-crosscutting/cookbook.md',`For a new one-rewrite mapping implementation, use MappingReader as the local seam, preserve physical-address/None/error semantics and derive or implement DeepSizeOf. Default batch offers ordered sequential behavior; a batched override must preserve every input position and duplicate. Extend the existing tests with independent expected mapping values and malformed persisted-input cases once the concrete storage/RowAddrRemap paths have been analyzed. This is a partial local recipe, not the full index/compaction extension plan. (rust/lance-core/src/utils/fragment_reuse.rs:14-73; rust/lance-core/src/utils/fragment_reuse.rs:94-144)

For deletion changes, examine representation-dependent empty/equality/iteration behavior and preserve predicate polarity and fragment assumptions. Add explicit iterator-hint threshold and u32-boundary cases to the current test module; inspect callers before changing OffsetMapper's state/input-order contract. (rust/lance-core/src/utils/deletion.rs:63-124; rust/lance-core/src/utils/deletion.rs:125-293; rust/lance-core/src/utils/deletion.rs:294-522)`);
const manifest=JSON.parse(read('MANIFEST.json')),state=JSON.parse(read('iteration-state.json'));state.totals=manifest.totals;state.read_not_analyzed=[];state.next='VERIFY8 must confirm corrections, deletion/mapping slice and updated claim selection. Then analyze RowAddrRemap and remaining core utilities/cache.';state.acceptance_gaps=['2011 files pending','294 binary files pending','all five complete self-sufficiency answers fail','VERIFY8 pending','whole-repository callers/callees pending'];write('iteration-state.json',JSON.stringify(state,null,2));
let entry=read('README.md');const checkpoint=entry.indexOf('## Current checkpoint');entry=entry.slice(0,checkpoint)+`## Current checkpoint

48 of 2,059 files and 16,833 of 1,166,813 text lines are analyzed. Coverage includes all 15 protobuf-subsystem files, twenty-eight lance-core files and five other contributor guides. Seven VERIFY cycles are recorded. VERIFY7 found one sampled test-description overstatement, one supplemental wrong-module pointer and one invalid citation; all three are corrected in ANALYZE8 and await VERIFY8. The symbol index contains ${symbols.length} records (${symbols.filter(s=>s.path.endsWith('.proto')).length} protobuf and ${symbols.filter(s=>!s.path.endsWith('.proto')).length} Rust). All 294 binary files and all five full self-sufficiency answers remain pending. Next: VERIFY8, then RowAddrRemap and remaining core utilities/cache. See [iteration state](iteration-state.json) and [verification log](verification-log.md).
`;write('README.md',entry.trimEnd());
console.log(JSON.stringify({supplement:'L1-modules/rust-lance-core-deletion-mapping.md',totals:manifest.totals,symbols:symbols.length}));
