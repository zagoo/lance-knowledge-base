import fs from 'node:fs';
import path from 'node:path';
import {output} from './inventory.mjs';
const batch=JSON.parse(fs.readFileSync(path.join(output,'analysis/iteration-007-core-storage.json'),'utf8'));
const symbols=JSON.parse(fs.readFileSync(path.join(output,'L3-symbols/symbols.json'),'utf8'));
const paths=new Set(batch.files.map(f=>f.path));
function write(file,value){fs.writeFileSync(path.join(output,file),value+'\n');}
function append(file,section){const existing=fs.readFileSync(path.join(output,file),'utf8');const marker='\n## Core containers, memory and small utilities\n';const pos=existing.indexOf(marker);write(file,(pos<0?existing.trimEnd():existing.slice(0,pos).trimEnd())+marker+'\n'+section.trim());}
const document=`# Core containers, memory and small utilities

**File-local analysis complete for this supplement; whole-crate and downstream integration remain INCOMPLETE.** Ten files contribute 1,750 lines. [Core overview](rust-lance-core.md) · [Orientation](../L0-orientation.md) · [Symbols](../L3-symbols/symbol-index.md) · [Contracts](../L3-symbols/behavior-contracts.md) · [Pitfalls](../L4-crosscutting/pitfalls.md).

## Responsibility and boundaries

The container facade exports a list of linked Vec blocks. Memory accounting exposes a trait/context and implementations for standard containers and Arrow buffers. Utility files provide borrowed byte keys, physical-request recording, object-store component joining, stream span propagation, arithmetic helpers, retry-delay generation and temporary resource ownership. These files do not implement dataset commit policy, actual IO scheduling, persistent cache eviction or retry execution. (rust/lance-core/src/container.rs:1-4; rust/lance-core/src/deepsize.rs:15-44; rust/lance-core/src/utils/hash.rs:23-35; rust/lance-core/src/utils/io_stats.rs:25-30; rust/lance-core/src/utils/path.rs:6-18; rust/lance-core/src/utils/tracing.rs:14-59; rust/lance-core/src/utils/bit.rs:15-110; rust/lance-core/src/utils/backoff.rs:59-78; rust/lance-core/src/utils/tempfile.rs:25-89)

## Linked-block behavior

ExpLinkedList<T> owns LinkedList<Vec<T>>, element count and u16 per-new-block limit. new has no blocks; with_capacity always installs a block. push creates capacity one initially or doubles a full last block, optionally capping new capacity; it then increments len. pop is LIFO and removes empty blocks on the next pop attempt. clear removes all blocks and preserves the configured limit. Iteration is insertion order. Existing blocks are not resized by setting a limit. (rust/lance-core/src/container/list.rs:8-108; rust/lance-core/src/container/list.rs:125-156)

Three surprising contracts require explicit attention: is_empty tests block presence; equality checks zipped prefixes without length comparison; iterator size_hint retains the initial count after yields. The first means with_capacity(1) can have len zero and is_empty false. The second makes empty compare equal to nonempty and can violate transitivity despite Eq. The third violates the remaining-count lower-bound expectation. These are source-derived findings with no runtime or downstream impact test performed. (rust/lance-core/src/container/list.rs:33-41; rust/lance-core/src/container/list.rs:101-108; rust/lance-core/src/container/list.rs:157-167; rust/lance-core/src/container/list.rs:184-242)

size estimates inline self + Vec headers + element bytes including last spare capacity, excluding linked-node overhead and nested T heaps. DeepSizeOf instead sums Vec child estimates, adding allocated element buffers and descendant heaps but omitting explicit Vec headers/linked nodes; the default trait counts inline self. Neither equals an allocator census. (rust/lance-core/src/container/list.rs:109-143; rust/lance-core/src/deepsize.rs:38-44; rust/lance-core/src/deepsize.rs:165-174)

## Memory accounting ownership rules

deep_size_of starts a fresh Context and adds inline size; deep_size_of_children reuses caller state. Context tracks usize identities. String charges capacity; Vec charges capacity times element size plus live descendants; arrays/slices/options/tuples charge descendants only. Box adds pointee bytes; Arc adds them once per data pointer and omits refcount-control overhead. Primitive/atomic children are zero. Tuple macro instances cover arities two through six. (rust/lance-core/src/deepsize.rs:15-199)

Bytes charges len once per start pointer. Arrow buffers and ScalarBuffer charge capacity once per start pointer; Arrow array data recursively includes null and child buffers. RecordBatch sums column Arc child estimates without explicit schema or column-vector allocation accounting. Different-offset views and identical-start views of different lengths are not allocation-identity deduplication. Hash/B-tree structures use approximate formulas documented in L2. Locks block for access and return zero children on poisoning. (rust/lance-core/src/deepsize.rs:89-98; rust/lance-core/src/deepsize.rs:130-145; rust/lance-core/src/deepsize.rs:200-299)

The derive macro is publicly re-exported, but its expansion source is unreviewed; the local nested-fixture test supplies only a lower-bound behavioral check. Implementing DeepSizeOf is the extension point for new memory-accounted types. Pass one Context across related children, count inline data at its owning boundary, and document approximation choices; cache weighting behavior must be checked when its consumer files are analyzed. (rust/lance-core/src/deepsize.rs:4-4; rust/lance-core/src/deepsize.rs:38-44; rust/lance-core/src/deepsize.rs:438-467)

## Utility contracts and failure modes

| Surface | Contract | Evidence |
|---|---|---|
| U8SliceKey | Public borrowed byte slice; content equality and delegated slice hashing, no specified persisted hash algorithm | rust/lance-core/src/utils/hash.rs:23-35 |
| IoStatsRecorder | Debug+Send+Sync trait receiving &[Range<u64>]; actual ranges after coalescing/splitting; integration timing remains unresolved because comments say both submitted and completed | rust/lance-core/src/utils/io_stats.rs:6-30 |
| LancePathExt | Clone base, append each object_store Path part using join, return owned Path; no OS path or IO implementation | rust/lance-core/src/utils/path.rs:4-18 |
| InstrumentedStream | Enter stored Span for one poll; blanket extension captures current Span at construction or accepts explicit one | rust/lance-core/src/utils/tracing.rs:7-59 |
| is_pwr_two | n&(n-1)==0 with no zero guard; zero depends on overflow checking | rust/lance-core/src/utils/bit.rs:15-17 |
| padding helpers | Bit-mask padding requires nonzero power-of-two alignment; only debug assertions validate this | rust/lance-core/src/utils/bit.rs:29-62 |
| log_2_ceil | Positive-u32 bit width, not mathematical ceiling at powers of two; unconditional zero assertion | rust/lance-core/src/utils/bit.rs:75-110 |
| Backoff | Saturating exponential/product, signed inclusive jitter, then clamp; unchecked configuration and ordinary attempt increment | rust/lance-core/src/utils/backoff.rs:17-78 |
| SlotBackoff | Default 4/8/16/32/64/128 slots then cap; random integer slot times unit; saturating attempt and widened product | rust/lance-core/src/utils/backoff.rs:79-160 |

Backoff defaults are base two, unit 50ms, jitter +/-50ms, min zero and max 5000ms; setters preserve attempts. SlotBackoff defaults to base two, starting exponent two, unit 50ms and a private OS-seeded SmallRng; only unit is publicly configurable here. Both can yield zero wait, and neither performs the sleep or decides retry termination. Backoff negative jitter and min>max can panic on use. (rust/lance-core/src/utils/backoff.rs:25-78; rust/lance-core/src/utils/backoff.rs:127-160)

Tracing names are all preserved as literal public constants in the API table below; changing labels affects filtering identity, but actual emitters/subscribers remain pending. There are no new feature flags or environment reads in these utility files. Windows normalization uses cfg!(windows) in temporary path conversion. (rust/lance-core/src/utils/tracing.rs:61-88; rust/lance-core/src/utils/tempfile.rs:55-65; rust/lance-core/src/utils/tempfile.rs:214-222)

## Temporary resource lifecycle

TempDir/TempFile retain dependency RAII handles; their Default creation paths unwrap errors. Only TempDir exposes try_new returning the core Result. path_str clones Unicode text and replaces backslashes on Windows; obj_path parses that text and unwraps. Conversion can panic and is not general URL encoding. std_path returns the native path borrow. Exact dependency cleanup behavior remains unreviewed and source docs qualify cleanup as generally/normally. (rust/lance-core/src/utils/tempfile.rs:25-89; rust/lance-core/src/utils/tempfile.rs:197-246)

| Wrapper | Retained owner and representation | Leaf created by construction? | Evidence |
|---|---|---|---|
| TempObjDir | TempDir plus cached ObjPath; Deref/AsRef | Directory created | rust/lance-core/src/utils/tempfile.rs:90-124 |
| TempStrDir | TempDir plus cached String; Display/Deref/AsRef and cloned as_into_string | Directory created | rust/lance-core/src/utils/tempfile.rs:125-172 |
| TempStdDir | TempDir; borrowed std Path via Deref/AsRef | Directory created | rust/lance-core/src/utils/tempfile.rs:173-196 |
| TempStdFile | TempFile; borrowed std Path via Deref/AsRef | Named file created | rust/lance-core/src/utils/tempfile.rs:197-213; rust/lance-core/src/utils/tempfile.rs:248-269 |
| TempObjFile | TempDir plus ObjPath parent/some_file | No; parent directory created | rust/lance-core/src/utils/tempfile.rs:270-305 |
| TempStdPath | TempDir plus PathBuf parent/some_file | No; parent directory created | rust/lance-core/src/utils/tempfile.rs:306-343 |

Cloning a returned string/path does not transfer resource ownership. Keep the wrapper alive for dependent IO. TempObjFile explicitly avoids opening the leaf so Windows atomic rename is not prevented by this wrapper's file handle; it is not simply a differently formatted TempFile. (rust/lance-core/src/utils/tempfile.rs:125-172; rust/lance-core/src/utils/tempfile.rs:270-343)

## Dependencies and extension boundaries

Standard collections supply list blocks and memory-estimate traversal; Arrow exposes buffer/data/array/RecordBatch representations; bytes supplies shared byte views; lance_derive supplies the derive macro; rand supplies jitter and slotted RNG; object_store supplies parsed paths; tempfile owns temporary resources; futures/pin_project/tracing supply projected poll/span wrapping. Exact imports and call relationships are preserved in the files below. Their dependency internals, resolved versions and complete external consumers are not inferred from these imports. (rust/lance-core/src/container/list.rs:4-6; rust/lance-core/src/deepsize.rs:4-14; rust/lance-core/src/deepsize.rs:89-98; rust/lance-core/src/utils/backoff.rs:1-2; rust/lance-core/src/utils/path.rs:4-18; rust/lance-core/src/utils/tempfile.rs:17-24; rust/lance-core/src/utils/tracing.rs:4-26)

IoStatsRecorder and DeepSizeOf are implementation seams; StreamTracingExt and LancePathExt extend existing stream/path types. Each currently defined implementation and its generic constraints appears below. The full crate API remains incomplete. (rust/lance-core/src/utils/io_stats.rs:25-30; rust/lance-core/src/deepsize.rs:38-44; rust/lance-core/src/utils/tracing.rs:28-59; rust/lance-core/src/utils/path.rs:6-18)

## Exact public declarations and implementations

The following table retains literal source declarations, including implementation headers that provide generic bounds for associated methods. Opening braces are retained as source delimiters; complete bodies and derivations are in each linked L2 appendix. Macro invocation rows describe generated implementations and are not fabricated expanded signatures. Private fields/helpers are in the full symbol index.

| Qualified symbol | Kind | Exact declaration | Analysis/evidence |
|---|---|---|---|
${symbols.filter(s=>paths.has(s.path)&&s.visibility.startsWith('public')).map(s=>`| \`${s.name}\` | ${s.kind} | \`${s.signature.replaceAll('|','\\|')}\` | [${s.path}:${s.line}-${s.end_line}](../${s.analysis}) |`).join('\n')}

## Files and tests

${batch.files.map(f=>`- [${f.path}](../L2-files/${f.path}.md), ${f.path}:1-${f.ranges.at(-1)[1]}.`).join('\n')}

Local tests cover standard list order/growth, memory lower bounds and repeated-pointer cases, byte-key lookups, arithmetic positive cases and retry delay bounds. Four small helper files (container facade, request-recorder trait, path extension, tracing) and tempfile define no local test module. Detailed test fixtures and missing cases are in the per-file annotations. No tests or doctests were executed. (rust/lance-core/src/container/list.rs:252-306; rust/lance-core/src/deepsize.rs:300-467; rust/lance-core/src/utils/hash.rs:5-50; rust/lance-core/src/utils/bit.rs:111-153; rust/lance-core/src/utils/backoff.rs:161-291; rust/lance-core/src/container.rs:1-4; rust/lance-core/src/utils/io_stats.rs:1-30; rust/lance-core/src/utils/path.rs:1-18; rust/lance-core/src/utils/tracing.rs:1-88; rust/lance-core/src/utils/tempfile.rs:1-343)
`;
write('L1-modules/rust-lance-core-storage.md',document);
let core=fs.readFileSync(path.join(output,'L1-modules/rust-lance-core.md'),'utf8');
core=core.replace('Coverage includes sixteen files:', 'Coverage includes twenty-six files:').replace('and Schema/Projection.','Schema/Projection, containers, deep-memory estimates, byte keys, IO accounting trait, path/tracing, bit arithmetic, retry delays and temporary resources.').replace('Caches and most remaining utility algorithms remain pending.','Caches and the remaining utility algorithms remain pending.');
write('L1-modules/rust-lance-core.md',core.trimEnd());
append('L1-modules/rust-lance-core.md','The [container/memory/utility supplement](rust-lance-core-storage.md) contains exact public declarations and implementation headers, local failure modes and tests for ten additional files. It records current edge cases without claiming downstream impact or runtime validation. (rust/lance-core/src/container/list.rs:1-306; rust/lance-core/src/deepsize.rs:1-467; rust/lance-core/src/utils/backoff.rs:1-291; rust/lance-core/src/utils/tempfile.rs:1-343)');
append('L0-orientation.md',`| Term | Local meaning | Evidence |
|---|---|---|
| ExpLinkedList | Linked Vec blocks with doubled/capped new block capacity, separately stored element count | rust/lance-core/src/container/list.rs:8-75 |
| DeepSizeOf | Inline size plus estimated descendant allocation; shared Context deduplicates selected pointers | rust/lance-core/src/deepsize.rs:15-44 |
| Context seen identity | usize key, usually exact data-buffer/pointee start address; not general backing-allocation identity | rust/lance-core/src/deepsize.rs:33-35; rust/lance-core/src/deepsize.rs:89-98; rust/lance-core/src/deepsize.rs:182-190 |
| Physical IO recorder | Debug+Send+Sync trait receiving submitted range slices; concrete request timing/counters pending | rust/lance-core/src/utils/io_stats.rs:6-30 |
| Slotted backoff | Random integer slot times unit, with exponentially growing capped slot count | rust/lance-core/src/utils/backoff.rs:79-160 |
| Instrumented stream | Wrapper entering a saved span during each inner poll | rust/lance-core/src/utils/tracing.rs:7-26 |
| Temporary leaf path | A retained unique parent directory and fixed some_file leaf, without opening the leaf | rust/lance-core/src/utils/tempfile.rs:270-343 |

See [the supplement](L1-modules/rust-lance-core-storage.md) for the complete local API and distinctions between intended abstractions and actual edge behavior.`);
append('L3-symbols/behavior-contracts.md',`[API and exact declarations](../L1-modules/rust-lance-core-storage.md) · [File analyses](../L2-files/rust/lance-core/src/container/list.rs.md).

| Operation | Current invariant/edge behavior | Change impact or required review | Evidence |
|---|---|---|---|
| List push/pop | Stored len counts values; empty Vec can remain after last pop | Do not infer len==0 implies no blocks; consumers pending | rust/lance-core/src/container/list.rs:50-108 |
| List equality | all(zip(left,right)) without length check | Adding length check changes equality for all unequal-length equal-prefix inputs; existing tests lack regression | rust/lance-core/src/container/list.rs:157-167; rust/lance-core/src/container/list.rs:252-306 |
| Iterator hint | Fixed initial len in borrowed and owned iterators | A remaining-count correction must cover both types and EOF; not tested here | rust/lance-core/src/container/list.rs:168-242 |
| Memory estimate | Inline bytes and children are separate ownership boundaries | Double-counting inline members or resetting Context per child changes totals/dedup | rust/lance-core/src/deepsize.rs:38-44; rust/lance-core/src/deepsize.rs:111-199 |
| Pointer dedup | Exact start address; first visit wins | Allocation-owner dedup would change shared/sliced view accounting and needs dependency evidence | rust/lance-core/src/deepsize.rs:89-98; rust/lance-core/src/deepsize.rs:243-299 |
| Locked estimate | Blocking read/lock; poison returns zero | Replacing zero with failure requires an API design change because trait returns usize | rust/lance-core/src/deepsize.rs:38-44; rust/lance-core/src/deepsize.rs:130-145 |
| Padding/width | Nonzero power-of-two alignment prerequisite; log_2_ceil is positive bit width | Preserve call-site meaning before renaming or substituting mathematical ceil | rust/lance-core/src/utils/bit.rs:15-110 |
| Retry delay | Duration generation only; Backoff config unvalidated, SlotBackoff counter saturated | Retry termination/cancellation are caller responsibilities and remain unreviewed | rust/lance-core/src/utils/backoff.rs:39-78; rust/lance-core/src/utils/backoff.rs:139-160 |
| Span propagation | Per-poll guard entered then dropped | Holding the guard across Pending would alter context lifetime | rust/lance-core/src/utils/tracing.rs:14-26 |
| TempObjFile | No opened leaf; parent handle retained | Substituting TempFile introduces an open file and changes Windows rename constraints | rust/lance-core/src/utils/tempfile.rs:197-213; rust/lance-core/src/utils/tempfile.rs:270-305 |

These modification implications are deductions from current code, not patches, executed regressions or a complete consumer audit. The five repository-wide self-sufficiency questions remain unanswered.`);
append('L4-crosscutting/pitfalls.md',`- A list can have zero values while is_empty returns false because it checks LinkedList blocks. FromIterator of an empty sequence creates a block too. Its equality treats empty as equal to any list, and both iterator hints stop reflecting remaining values after the first yield. Treat these as source-derived edge findings; runtime impact is unverified. (rust/lance-core/src/container/list.rs:33-41; rust/lance-core/src/container/list.rs:101-108; rust/lance-core/src/container/list.rs:144-242)
- DeepSizeOf is approximate: lock poisoning hides children; hash/B-tree overhead uses formulas; Arc/Bytes/Arrow dedup depends on pointer identity; separate top-level calls have separate Contexts. Do not use these values as exact allocator measurements without additional instrumentation. (rust/lance-core/src/deepsize.rs:38-44; rust/lance-core/src/deepsize.rs:89-98; rust/lance-core/src/deepsize.rs:130-145; rust/lance-core/src/deepsize.rs:175-299)
- is_pwr_two(0) is not safely false; padding helpers only debug-assert alignment, and log_2_ceil is bit width. Do not replace it with mathematical ceiling based on its name. (rust/lance-core/src/utils/bit.rs:15-110)
- Backoff builders accept negative jitter and inconsistent min/max, then use arithmetic/RNG/clamp paths that can panic. Its attempt increment is ordinary arithmetic; only SlotBackoff saturates the counter. No sleep is performed by either generator. (rust/lance-core/src/utils/backoff.rs:39-78; rust/lance-core/src/utils/backoff.rs:139-160)
- TempObjFile and TempStdPath reserve a unique parent and unopened leaf, whereas TempFile owns a NamedTempFile. Keep the wrapper alive; cloning a path or String does not retain the resource. Windows slash replacement is a temporary-path workaround, not URL encoding. (rust/lance-core/src/utils/tempfile.rs:4-15; rust/lance-core/src/utils/tempfile.rs:55-89; rust/lance-core/src/utils/tempfile.rs:125-172; rust/lance-core/src/utils/tempfile.rs:197-343)`);
append('L4-crosscutting/build-and-test.md',`The additional unit/doctest cases were read, not run. They should not be reported as passing tests merely because assertions appear in source.

| File | Existing assertions | Uncovered local edge cases identified by inspection | Evidence |
|---|---|---|---|
| list | 100 pushes, 50 reverse pops, forward iteration, clear, collect, cap ten | Unequal-length prefix equality; size_hint after next; preallocated emptiness; zero/oversized capacity limits | rust/lance-core/src/container/list.rs:252-306 |
| deepsize | Primitive exact inline size; heap lower bounds; repeated batch/Arc/shared-column dedup; nested structs/derive | Poisoned locks, offset-alias accounting, exact metadata/control overhead | rust/lance-core/src/deepsize.rs:300-467 |
| hash | Doctest matching/missing retrieval and inequality; unit negative cases | No asserted persisted hash algorithm | rust/lance-core/src/utils/hash.rs:5-50 |
| bit | Positive power checks, valid alignments, bit-width comparisons over 1..16384 and large values | Zero power predicate, invalid alignment, zero width panic | rust/lance-core/src/utils/bit.rs:4-153 |
| backoff | No-jitter sequences, min/max/reset, slot membership/cap, widened product, saturated slot counter | Negative jitter, min>max, ordinary Backoff counter overflow, distribution fairness | rust/lance-core/src/utils/backoff.rs:161-291 |

For actual future Rust execution, follow the existing [Rust environment/build guidance](../L2-files/rust/AGENTS.md.md); this analysis adds no environment setup or test command evidence. (rust/AGENTS.md:1-90)`);
append('L4-crosscutting/cookbook.md',`This is a local review checklist, not a completed end-to-end extension recipe. Consult [the core utility supplement](../L1-modules/rust-lance-core-storage.md) before editing these surfaces.

1. For list behavior fixes, change list.rs and extend its current test module: compare differing lengths, advance both iterator types through EOF before checking hints, and distinguish retained empty blocks from element count. Then inspect all consumers before changing block-lifetime policy. Those missing cases are inferred from current implementations and tests. (rust/lance-core/src/container/list.rs:33-108; rust/lance-core/src/container/list.rs:157-251; rust/lance-core/src/container/list.rs:252-306)
2. For a new DeepSizeOf implementation, decide the inline ownership boundary, recurse with one Context and document pointer/overhead approximation. Extend current tests with both unique/shared allocations rather than only a weak lower bound. Derive macro and cache consumer analysis remains a prerequisite for a complete change recipe. (rust/lance-core/src/deepsize.rs:38-44; rust/lance-core/src/deepsize.rs:111-199; rust/lance-core/src/deepsize.rs:300-467)
3. For temporary path work, choose whether the leaf must already be open, retain the RAII owner for the IO lifetime, and use TempDir::try_new where creation failure should become Result. Platform path parsing and cleanup must be validated separately; no production/device verification was performed here. (rust/lance-core/src/utils/tempfile.rs:45-89; rust/lance-core/src/utils/tempfile.rs:197-343)

This does not fill the pending new-index/encoding/operation/binding/backend recipes from the objective.`);
const manifest=JSON.parse(fs.readFileSync(path.join(output,'MANIFEST.json'),'utf8'));
const state=JSON.parse(fs.readFileSync(path.join(output,'iteration-state.json'),'utf8'));
state.totals=manifest.totals;state.read_not_analyzed=[];state.next='VERIFY7: confirm prior corrections, audit random claims and all sampled top-level items, then continue remaining core files.';state.acceptance_gaps=['2013 files pending','294 binary files pending','all five complete self-sufficiency answers incomplete','complete external callers/callees and generated APIs pending','VERIFY7 pending'];write('iteration-state.json',JSON.stringify(state,null,2));
console.log(JSON.stringify({supplement:'L1-modules/rust-lance-core-storage.md',public_records:symbols.filter(s=>paths.has(s.path)&&s.visibility.startsWith('public')).length,totals:manifest.totals}));
