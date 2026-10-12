import fs from 'node:fs';
import path from 'node:path';
import {output} from './inventory.mjs';
const read=f=>fs.readFileSync(path.join(output,f),'utf8'),write=(f,s)=>fs.writeFileSync(path.join(output,f),s.trimEnd()+'\n');
const marker='\n## Ordered and stable-partition row mapping\n';
function append(f,t){let s=read(f),i=s.indexOf(marker);write(f,(i<0?s.trimEnd():s.slice(0,i).trimEnd())+marker+'\n'+t.trim());}
const symbols=JSON.parse(read('L3-symbols/symbols.json'));const paths=new Set(['rust/lance-core/src/utils/row_addr_remap.rs','rust/lance-core/src/utils/stable_partition.rs']);
write('L1-modules/rust-lance-core-row-mapping.md',`# Ordered and stable-partition row mapping

**Local primitives analyzed; persisted FRI IO, caller graph, rewrite selection and dataset integration remain INCOMPLETE.** [Core](rust-lance-core.md) · [Orientation](../L0-orientation.md) · [Symbols](../L3-symbols/symbol-index.md) · [Format](../L3-symbols/format-spec.md) · [Scenarios](../L4-crosscutting/scenarios.md).

## Ordering models and boundaries

RowAddrRemap reconstructs an order-preserving rewrite by concatenating retained old rows in caller-provided fragment order and ascending offsets, then assigning them to new fragments in caller-provided write order. Stable-partition primitives instead allow those rows to interleave among destination labels, provided relative source order within each destination remains unchanged. Arbitrary permutations within a destination need a different mapping representation with final offsets. Neither implementation verifies the external writer's ordering. (rust/lance-core/src/utils/row_addr_remap.rs:4-48; rust/lance-core/src/utils/stable_partition.rs:4-60)

Both are synchronous in-memory primitives. RowAddrRemap has no production serialization. stable_partition serializes only a cumulative count matrix; the module comments assign label-column IO/cache to lance-index. Do not infer complete persisted mapping reader/writer behavior from this module boundary. Dependencies used here are core RowAddress/Error/Result/DeepSizeOf, Roaring bitmaps/treemaps, standard HashMap/HashSet/vectors/hash traits, and Arrow NullBuffer for label validity; proptest and seeded rand are local test dependencies. (rust/lance-core/src/utils/row_addr_remap.rs:49-55; rust/lance-core/src/utils/row_addr_remap.rs:795-1325; rust/lance-core/src/utils/stable_partition.rs:49-64; rust/lance-core/src/utils/stable_partition.rs:484-697)

## RowAddrRemap API contracts

The public enum has Compact and Direct variants. get(addr) returns Option<Option<u64>>: outer None means unaffected, Some(None) deleted, Some(Some(new_addr)) mapped. remap_in_place leaves unaffected inputs and existing None unchanged. The MappingReader adapter instead turns outer None into InvalidInput, retaining inner deletion; its valid-source-domain promise needs the physical-layout-aware remap. (rust/lance-core/src/utils/row_addr_remap.rs:57-138; rust/lance-core/src/utils/fragment_reuse.rs:14-73)

compact takes GroupInput containing retained old addresses, old IDs in scan order and new (ID,row-count) tuples in write order. compact_with_layout is public but doc(hidden); its GroupInputWithLayout also records old physical counts. Each group rejects duplicate old IDs, retained offsets outside supplied physical counts, retained fragments absent from the old list and unequal total retained/new rows. The step constructor rejects old IDs repeated across groups. Direct accepts arbitrary maps without these checks. No constructor here rejects duplicate destination IDs or reserved RowAddress values. (rust/lance-core/src/utils/row_addr_remap.rs:72-89; rust/lance-core/src/utils/row_addr_remap.rs:175-193; rust/lance-core/src/utils/row_addr_remap.rs:391-470; rust/lance-core/src/utils/row_addr_remap.rs:563-605)

For a covered old fragment, layout-aware get returns outer None at offset>=physical_rows; plain compact cannot bound offsets and classifies every unretained offset in that fragment as deleted. A retained offset gives k=preceding_retained_rows+zero_based_rank. Binary search selects the destination whose start rank is the greatest <=k and returns offset k-start. Zero-row destinations are skipped. Cardinality checks make private predecessor lookup safe for valid retained inputs; its helper has no independent out-of-range check. (rust/lance-core/src/utils/row_addr_remap.rs:391-485; rust/lance-core/src/utils/row_addr_remap.rs:606-625)

chained filters structurally empty inputs, preserves order and flattens existing compact step vectors. Each matched address feeds the next step; deletion terminates lookup and cannot be resurrected. An identity match still marks the input affected. Batch translation loops steps first, then rows, with equivalent optional-result semantics. affected_fragments unions all step source IDs, including intermediate-version IDs. fully_deleted_fragments produces a union only when every step proves all its affected fragments deleted; it is not a partial set or complete proof procedure for arbitrary chains. A nonempty Direct map cannot prove full-fragment deletion. (rust/lance-core/src/utils/row_addr_remap.rs:91-165; rust/lance-core/src/utils/row_addr_remap.rs:627-691; rust/lance-core/src/utils/row_addr_remap.rs:702-787)

is_empty is structural: a compact group with zero old/new rows still makes groups nonempty. Derived equality compares representation, not only observable get results. Public CompactRowAddrRemap exposes get/is_empty while construction and step storage are private; there is no public mutation or new chained enum arm. (rust/lance-core/src/utils/row_addr_remap.rs:63-70; rust/lance-core/src/utils/row_addr_remap.rs:563-605; rust/lance-core/src/utils/row_addr_remap.rs:627-629; rust/lance-core/src/utils/row_addr_remap.rs:702-768)

## Rank representation, cost and memory

For universe U (physical count if known, else max offset+1) and N retained offsets, estimates are sparse=4N and dense=12*ceil(U/64). Keep Roaring only when 4*serialized_size is strictly smaller than both estimates; else sparse wins ties, otherwise dense. Selection-size overflow yields InvalidInput, except overflow of the Roaring comparison merely prevents selecting Roaring. Sparse rank is binary search; Dense uses membership bit plus a stored u32 word-prefix and lower-bit popcount; Roaring delegates contains/rank. Empty inputs select Sparse. These are algorithmic/estimated costs, not benchmarks. (rust/lance-core/src/utils/row_addr_remap.rs:195-336)

A compact lookup does one old-fragment hash lookup, rank lookup and destination binary search per matched step. Metadata scales with fragment count, but retained-offset payload is additionally O(N) for sparse or O(U/64) for dense, with variable compressed size for Roaring. Construction clones per-fragment bitmaps and allocates representation/layout vectors. DeepSizeOf delegates owned children and uses serialized Roaring size as an approximation. (rust/lance-core/src/utils/row_addr_remap.rs:213-343; rust/lance-core/src/utils/row_addr_remap.rs:391-446; rust/lance-core/src/utils/row_addr_remap.rs:606-625; rust/lance-core/src/utils/row_addr_remap.rs:648-700; rust/lance-core/src/utils/row_addr_remap.rs:738-764)

The private IntHasher accelerates internal integer keys with wrapping multiplication and high/low bit folding; a byte FNV-1a fallback is also supplied. Integer writes overwrite previous state, so composite keys collide on their last integer component. Equality still preserves HashMap correctness, as the local test demonstrates; this is not an appropriate general composite-key performance assumption or an adversarial-input guarantee. (rust/lance-core/src/utils/row_addr_remap.rs:494-553; rust/lance-core/src/utils/row_addr_remap.rs:1142-1200)

## Stable-partition counts and translation

CountsMatrix's private fields are destination count m, positive block_rows, total physical rows including NULL/deleted rows, and a dense row-major grid of u32 counts through each block end. Builder accepts 1<=m<=65536 and any positive u32 block size. Constants advertise default65536 rows/block and maximum65536 destinations. push(None) advances only physical position; push(Some(label)) checks label and per-destination overflow before changing physical counters. Full blocks append the entire counter vector; finish adds a partial final block once and no extra row for exact multiples/empty input. (rust/lance-core/src/utils/stable_partition.rs:66-104; rust/lance-core/src/utils/stable_partition.rs:292-304; rust/lance-core/src/utils/stable_partition.rs:323-385)

A count is u32, so the builder permits at most u32::MAX rows per destination, whose last valid offset is u32::MAX-1. total_rows is u64 with ordinary addition. Grid payload bytes are ceil(total_rows/block_rows)*m*4, excluding the28-byte header and allocation capacity. encode/decode exact layout is in the [format specification](../L3-symbols/format-spec.md). decode checks header and exact payload shape but deliberately does not call validate; callers must separately reject decreasing counts or live-row increments exceeding physical block lengths. Shape errors during decode return InvalidInput; malformed magic/version/tag/length and semantic validate errors return CorruptFile named stable_partition_counts. (rust/lance-core/src/utils/stable_partition.rs:74-86; rust/lance-core/src/utils/stable_partition.rs:191-321; rust/lance-core/src/utils/stable_partition.rs:348-371)

Point translation returns (destination label,zero-based offset), not fragment ID. It checks values length and requested position, returns None for a NULL position before validating payload label, otherwise computes count_before(block,label)+exclusive matching-label prefix rank. rank_label_prefix ignores null payload values and uses a no-null fast path. Supplied block index/validity length and matrix-to-label consistency are not fully validated. Direct accessors and prefix slicing can panic; malformed counts or ordinary arithmetic overflow can also fail according to overflow-check settings. (rust/lance-core/src/utils/stable_partition.rs:107-190; rust/lance-core/src/utils/stable_partition.rs:387-444)

SweepTranslator::new seeds the per-label counters before start_block. Empty matrix allows start0; nonempty matrices reject start at or beyond num_blocks. advance emits the current counter then increments for a present label, emits None unchanged for NULL and errors for out-of-range label. It does not track consumed rows or prevent excess input; increment is not checked like the builder. Correct source order, starting position and input length remain caller responsibilities. (rust/lance-core/src/utils/stable_partition.rs:446-482)

## Tests and change boundaries

Inspected tests cover rank variants/boundaries, multiple old/new fragments, zero-row destination omission, explicit destination order, independent direct-map property comparisons, conservative deletion proofs, chain batch semantics and integer-hash collision correctness. The property test excludes zero survivors and uses plain compact, so layout limits and error categories are not proved by it. Local tests omit several duplicate/count/layout constructor failures and duplicate destination alias cases. (rust/lance-core/src/utils/row_addr_remap.rs:795-1325)

Stable-partition tests cover a ten-row hand example, empty/exact/partial blocks, round-trip structural corruption, separately validated decreasing counts, builder shape errors, and point/sweep results against an independent per-label oracle with garbage NULL payloads. Input error tests use is_err rather than exact error categories. Wrong codec version, excess live budgets, upper limits, short validity and excess/empty sweep behavior are not covered locally. Tests were read, not executed. (rust/lance-core/src/utils/stable_partition.rs:484-697)

Changes to ordering, tri-state results, matrix inclusivity, label validity or chain step sequencing can silently move an index reference to a wrong physical row. Preserve independent expected-address tests before changing these semantics. Full downstream index/commit compatibility and released-format classification must be established from still-pending callers/readers; do not add historical unstable-format fallbacks speculatively. (rust/lance-core/src/utils/row_addr_remap.rs:4-48; rust/lance-core/src/utils/row_addr_remap.rs:1232-1325; rust/lance-core/src/utils/stable_partition.rs:4-60; AGENTS.md:5-17)

## Exact public declarations

| Qualified symbol | Kind | Exact declaration | Evidence and complete body |
|---|---|---|---|
${symbols.filter(s=>paths.has(s.path)&&s.visibility==='public Rust API').map(s=>`| \`${s.name}\` | ${s.kind} | \`${s.signature.replaceAll('|','\\|')}\` | [${s.path}:${s.line}-${s.end_line}](../${s.analysis}) |`).join('\n')}

## Complete files

- [row_addr_remap.rs](../L2-files/rust/lance-core/src/utils/row_addr_remap.rs.md), rust/lance-core/src/utils/row_addr_remap.rs:1-1325.
- [stable_partition.rs](../L2-files/rust/lance-core/src/utils/stable_partition.rs.md), rust/lance-core/src/utils/stable_partition.rs:1-697.
`);
let core=read('L1-modules/rust-lance-core.md').replace('twenty-eight files','thirty files').replace('deletion vectors and the single-rewrite mapping adapter.','deletion vectors, the single-rewrite mapping adapter, ordered address remapping and stable-partition primitives.');write('L1-modules/rust-lance-core.md',core);
append('L1-modules/rust-lance-core.md','The [row-mapping supplement](rust-lance-core-row-mapping.md) documents tri-state ordered remapping, representation selection, chained rewrite behavior, nullable destination-label ranking and the local dense count-matrix codec. External remap production/selection and persisted FRI traversal remain pending. (rust/lance-core/src/utils/row_addr_remap.rs:57-193; rust/lance-core/src/utils/stable_partition.rs:4-60)');
let dm=read('L1-modules/rust-lance-core-deletion-mapping.md').replace('full deletion IO, RowAddrRemap, FRI graph traversal','full deletion IO, FRI graph traversal');dm=dm.replace('## Deletion state and representation','RowAddrRemap and stable-partition primitives are now documented in the [row-mapping supplement](rust-lance-core-row-mapping.md); their local validation is distinct from persisted IO. (rust/lance-core/src/utils/row_addr_remap.rs:72-89; rust/lance-core/src/utils/stable_partition.rs:49-60)\n\n## Deletion state and representation');write('L1-modules/rust-lance-core-deletion-mapping.md',dm);
append('L0-orientation.md',`| Term | Local meaning | Evidence |
|---|---|---|
| RowAddrRemap | Ordered compact/direct physical-address lookup with unaffected/deleted/mapped states | rust/lance-core/src/utils/row_addr_remap.rs:57-138 |
| Retained rank | Zero-based position of a surviving offset within its old fragment | rust/lance-core/src/utils/row_addr_remap.rs:258-266 |
| Stable partition | Each destination retains relative source order while rows may interleave between labels | rust/lance-core/src/utils/stable_partition.rs:4-32 |
| Destination label | Nullable u16 index into a destination list; NULL deletes a source physical row | rust/lance-core/src/utils/stable_partition.rs:8-17 |
| CountsMatrix | Dense per-destination cumulative counts through each physical block end | rust/lance-core/src/utils/stable_partition.rs:88-104 |
| SweepTranslator | Sequential per-label counters seeded at a physical block boundary | rust/lance-core/src/utils/stable_partition.rs:446-482 |

[Detailed contracts and exact APIs](L1-modules/rust-lance-core-row-mapping.md).`);
append('L3-symbols/behavior-contracts.md',`[Full API supplement](../L1-modules/rust-lance-core-row-mapping.md).

| Contract | Change hazard | Evidence |
|---|---|---|
| Caller fragment order is load-bearing | Sorting old/new IDs can silently change mapped row identities | rust/lance-core/src/utils/row_addr_remap.rs:391-485; rust/lance-core/src/utils/row_addr_remap.rs:1074-1084 |
| Three lookup states | Unaffected differs from deleted; MappingReader converts only unaffected into input error | rust/lance-core/src/utils/row_addr_remap.rs:606-625; rust/lance-core/src/utils/fragment_reuse.rs:47-73 |
| Physical bounds require layout | Plain compact reports any unretained offset in a covered fragment as deleted | rust/lance-core/src/utils/row_addr_remap.rs:367-389; rust/lance-core/src/utils/row_addr_remap.rs:606-625 |
| Fixed sequential chain | Deletion terminates; mapped address feeds later steps; affected sets include intermediate sources | rust/lance-core/src/utils/row_addr_remap.rs:738-787 |
| Stable per-label order | Counts cannot express arbitrary order changes within one destination | rust/lance-core/src/utils/stable_partition.rs:18-32 |
| End-inclusive stored counts | Point/sweep seeds use the preceding block, then exclusive within-block rank | rust/lance-core/src/utils/stable_partition.rs:88-159; rust/lance-core/src/utils/stable_partition.rs:387-482 |
| Decode and validate are separate | A structurally decoded grid can still violate monotonicity or row budgets | rust/lance-core/src/utils/stable_partition.rs:191-290; rust/lance-core/src/utils/stable_partition.rs:624-631 |
| Caller-owned translation bounds | Block/validity/matrix-label correspondence and sweep stream length are not fully checked | rust/lance-core/src/utils/stable_partition.rs:125-190; rust/lance-core/src/utils/stable_partition.rs:387-482 |

These local contracts do not establish which on-disk mapping formats current dataset writers emit.`);
append('L3-symbols/format-spec.md',`The local counts codec is implemented, unlike the still-pending full FRI label-column format. All integers here are little-endian. LSPC/version1/repr0 belong to this helper; released stability and enclosing dataset version gates are not established. (rust/lance-core/src/utils/stable_partition.rs:74-82; rust/lance-core/src/utils/stable_partition.rs:220-290)

| Byte offset | Width | Value | Evidence |
|---|---|---|---|
| 0 | 4 bytes | ASCII LSPC magic | rust/lance-core/src/utils/stable_partition.rs:74-77; rust/lance-core/src/utils/stable_partition.rs:223-225 |
| 4 | u32 | version=1; only1 accepted | rust/lance-core/src/utils/stable_partition.rs:226-226; rust/lance-core/src/utils/stable_partition.rs:254-257 |
| 8 | u32 | representation=0 (dense); unknown tags rejected | rust/lance-core/src/utils/stable_partition.rs:227-227; rust/lance-core/src/utils/stable_partition.rs:258-263 |
| 12 | u32 | num_destinations m, 1..=65536 | rust/lance-core/src/utils/stable_partition.rs:228-228; rust/lance-core/src/utils/stable_partition.rs:264-267; rust/lance-core/src/utils/stable_partition.rs:292-298 |
| 16 | u32 | positive block_rows | rust/lance-core/src/utils/stable_partition.rs:229-229; rust/lance-core/src/utils/stable_partition.rs:264-267; rust/lance-core/src/utils/stable_partition.rs:299-304 |
| 20 | u64 | total_rows, including deleted physical rows | rust/lance-core/src/utils/stable_partition.rs:101-102; rust/lance-core/src/utils/stable_partition.rs:230-230; rust/lance-core/src/utils/stable_partition.rs:266-266 |
| 28 | u32 cells | B*m cumulative counts, block-major then label-major; B=ceil(total_rows/block_rows) | rust/lance-core/src/utils/stable_partition.rs:103-104; rust/lance-core/src/utils/stable_partition.rs:231-234; rust/lance-core/src/utils/stable_partition.rs:267-289 |

Exact length is28+4*B*m. decode uses checked payload multiplication and rejects both truncation and trailing bytes. Empty input rows produce no grid cells but still require valid shape and a28-byte header. decode checks shape with InvalidInput, while magic/version/tag/length use CorruptFile. It does not check count contents. (rust/lance-core/src/utils/stable_partition.rs:237-304; rust/lance-core/src/utils/stable_partition.rs:374-385)

Call validate separately: every label must be nondecreasing and each block's increase in total live count must be <=that block's physical length. Counts are u32 and totals are summed as u64. It does not cross-check actual labels or destination metadata. encode does not validate first. The test deliberately encodes a decreasing grid that decodes successfully and fails validate. (rust/lance-core/src/utils/stable_partition.rs:191-235; rust/lance-core/src/utils/stable_partition.rs:624-631)

The matrix owns no validity bitmap; NULL/deleted positions belong to the separate label stream and contribute no destination counts. Point translation ignores null payload values. The precise persisted storage for that label stream remains pending. (rust/lance-core/src/utils/stable_partition.rs:8-17; rust/lance-core/src/utils/stable_partition.rs:348-385; rust/lance-core/src/utils/stable_partition.rs:387-444)

[Exact codec/body](../L2-files/rust/lance-core/src/utils/stable_partition.rs.md) · [API supplement](../L1-modules/rust-lance-core-row-mapping.md).`);
let scenarios=read('L4-crosscutting/scenarios.md').replace('the next missing local dependency is RowAddrRemap, followed by FRI selection/traversal and dataset orchestration.','RowAddrRemap local behavior is now documented below; FRI selection/traversal and dataset orchestration remain missing.');write('L4-crosscutting/scenarios.md',scenarios);
append('L4-crosscutting/scenarios.md',`Ordered compaction fixture: scan fragments4 then3, retain offsets4:{0,2,4} and3:{0,1}, write destinations10(2),11(0),12(3). Fragment11 contributes no range. Retained ranks0..4 map respectively to10:0,10:1,12:0,12:1,12:2. A listed all-deleted fragment7 maps each unretained offset to deletion; an uncovered fragment remains unaffected. Plain construction cannot tell that offset4:5 exceeds an imagined physical size, so it also reports deletion. (rust/lance-core/src/utils/row_addr_remap.rs:391-485; rust/lance-core/src/utils/row_addr_remap.rs:953-993)

A later remap consumes those destinations as its source addresses. The chain fixture maps source0:2 through10:1 to20:0, deletes source0:0 in the second step and source0:1 in the first, and preserves an uncovered fragment. Batch applies each step to all rows, retaining NULL positions. This is a local in-memory chain, not a verified commit/version traversal. (rust/lance-core/src/utils/row_addr_remap.rs:738-764; rust/lance-core/src/utils/row_addr_remap.rs:1107-1140)

Stable-partition example labels[0,2,NULL,2,1,1,0,2,NULL,0], m3, block4:

| Block | Physical range | Stored cumulative counts |
|---|---|---|
| 0 | [0,4) | [1,0,2] |
| 1 | [4,8) | [2,2,3] |
| 2 | [8,10) | [3,2,3] |

These cells follow the builder and the hand fixture; live total8, deleted2. For row7 (label2), previous-block count2 plus zero same-label rows in that block's exclusive prefix gives destination offset2. For row9 (label0), previous count2 plus a NULL prefix gives offset2. A sweep from block1 seeds [1,0,2] and emits (1,0),(1,1),(0,1),(2,2),NULL,(0,2). These are arithmetic deductions from the documented algorithms/fixture, not newly executed tests. (rust/lance-core/src/utils/stable_partition.rs:348-385; rust/lance-core/src/utils/stable_partition.rs:387-482; rust/lance-core/src/utils/stable_partition.rs:546-594)

Serialize the count grid as the LSPC28-byte header plus little-endian row-major counts; decode structurally, then validate cumulative budgets. Loading labels, mapping labels to fragment IDs, selecting current FRI records and committing rewritten files remain outside this analyzed trace. (rust/lance-core/src/utils/stable_partition.rs:49-60; rust/lance-core/src/utils/stable_partition.rs:191-290)`);
append('L4-crosscutting/pitfalls.md',`- Do not sort fragment IDs to normalize a RowAddrRemap: caller old/new order determines exact new row identity. The insertion-order test checks only fragment sets/proofs, not equivalent mappings. (rust/lance-core/src/utils/row_addr_remap.rs:391-485; rust/lance-core/src/utils/row_addr_remap.rs:1202-1230)
- Compact metadata is not all of compact memory; sparse/dense rank payloads scale with retained count/universe. A four-times-smaller Roaring heuristic is a selection policy, not a benchmark guarantee. (rust/lance-core/src/utils/row_addr_remap.rs:195-287)
- Fully deleted proofs are conservative. Direct partial maps with only None entries still cannot prove an entire fragment deleted; chained affected sets may contain intermediate fragments. (rust/lance-core/src/utils/row_addr_remap.rs:158-163; rust/lance-core/src/utils/row_addr_remap.rs:770-787; rust/lance-core/src/utils/row_addr_remap.rs:1041-1060)
- Stable partition requires relative source order within every label. Parallel output arrival order is insufficient unless restored to that order. (rust/lance-core/src/utils/stable_partition.rs:18-32)
- decode success is not semantic matrix validity. validate is separate; accessors and point translation otherwise assume valid count arithmetic. Validity buffer length and label/count correspondence are caller responsibilities. (rust/lance-core/src/utils/stable_partition.rs:185-218; rust/lance-core/src/utils/stable_partition.rs:237-290; rust/lance-core/src/utils/stable_partition.rs:387-444)
- Builder checks per-destination overflow, but SweepTranslator does not check increment overflow or remaining input length. An empty matrix still permits a start0 sweep. (rust/lance-core/src/utils/stable_partition.rs:348-371; rust/lance-core/src/utils/stable_partition.rs:453-482)`);
append('L4-crosscutting/build-and-test.md',`Row remap tests include representation-specific ranks, explicit old/new order, chains and a proptest against an independent Direct oracle; the property discards all-deleted cases and exercises plain compact. Hash tests assert limited low-bit distribution and composite-key equality correctness. Stable-partition tests use deterministic seeds7/42 and compare point/sweep translation to a per-label HashMap oracle, with0xBEEF at NULL positions. These are inspected coverage facts; no tests were run. (rust/lance-core/src/utils/row_addr_remap.rs:795-1325; rust/lance-core/src/utils/stable_partition.rs:484-697)

For future behavioral changes, extend existing modules with constructor failure categories, layout endpoints, destination duplicates, corrupted count budgets, validity lengths and sweep boundaries as appropriate. Follow the established Rust environment guide before invoking repository tooling. (rust/lance-core/src/utils/row_addr_remap.rs:391-470; rust/lance-core/src/utils/row_addr_remap.rs:563-605; rust/lance-core/src/utils/stable_partition.rs:191-218; rust/lance-core/src/utils/stable_partition.rs:387-482; rust/AGENTS.md:1-90)`);
append('L4-crosscutting/cookbook.md',`Local remap changes: read the [mapping supplement](../L1-modules/rust-lance-core-row-mapping.md), preserve the caller-order/tri-state contract, and choose GroupInputWithLayout when a bounded MappingReader domain is required. Add independent expected-address cases in the existing row_addr_remap test module; do not use only an adapter that compares against the same remap implementation. Inspect downstream producers/FRI selectors before altering public types or ordering assumptions; those call paths remain missing from this KB. (rust/lance-core/src/utils/row_addr_remap.rs:175-193; rust/lance-core/src/utils/row_addr_remap.rs:606-625; rust/lance-core/src/utils/row_addr_remap.rs:795-1325; rust/lance-core/src/utils/fragment_reuse.rs:107-144)

Stable-partition changes: keep stored block counts inclusive and point rank exclusive, honor NULL validity, and test point and sweep against an independent final-offset oracle. For persisted counts, preserve or intentionally revise exact magic/version/tag/shape rules only after establishing released format classification and actual readers. Callers need explicit decode-then-validate discipline and consistent labels; arbitrary within-destination reorder requires another format, not merely a new label assignment. This is a local recipe, not the complete scalar-index/compaction extension procedure. (rust/lance-core/src/utils/stable_partition.rs:18-32; rust/lance-core/src/utils/stable_partition.rs:88-159; rust/lance-core/src/utils/stable_partition.rs:191-290; rust/lance-core/src/utils/stable_partition.rs:387-482; rust/lance-core/src/utils/stable_partition.rs:644-681; AGENTS.md:5-17)`);
const manifest=JSON.parse(read('MANIFEST.json')),state=JSON.parse(read('iteration-state.json'));state.totals=manifest.totals;state.read_not_analyzed=[];state.next='VERIFY9: confirm precision corrections and new row-mapping slice. Then remaining core algorithms and cache.';state.acceptance_gaps=['2009 files pending','294 binary files pending','all five complete self-sufficiency answers fail','VERIFY9 pending','whole-repository callers/callees pending'];write('iteration-state.json',JSON.stringify(state,null,2));
let entry=read('README.md');entry=entry.slice(0,entry.indexOf('## Current checkpoint'))+`## Current checkpoint

50 of 2,059 files and 18,855 of 1,166,813 text lines are analyzed. Coverage includes all 15 protobuf-subsystem files, thirty lance-core files and five other contributor guides. The symbol index contains ${symbols.length} records: 971 protobuf and ${symbols.length-971} Rust declarations. All 294 binary files remain pending.

Eight VERIFY cycles are recorded. VERIFY8 confirmed20/20 random claims and all checked references; ANALYZE9 clarified two exact cross-range citations and documented RowAddrRemap plus stable-partition counts. VERIFY9 is next. Global acceptance still fails: 2,009 files and all five complete self-sufficiency answers are pending. See [iteration state](iteration-state.json) and [verification log](verification-log.md).

Analysis records may retain superseded drafts for provenance. Follow each file's current analysis_record in MANIFEST and its current L2 document; verification snapshots intentionally retain the claims as they were sampled.
`;write('README.md',entry);
console.log(JSON.stringify({module:'L1-modules/rust-lance-core-row-mapping.md',symbols:symbols.length,totals:manifest.totals}));
