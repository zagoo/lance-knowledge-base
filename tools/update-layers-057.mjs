import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p)),write=(p,s)=>fs.writeFileSync(p,s),changes=[];
const base='rust/lance-file/src/writer_tests.rs',cite=(a,b)=>`${base}:${a}-${b}`;
const symbols=read('analysis/iteration-057-symbols.json');
const rows=symbols.map(s=>`| \`${s.name}\` | ${s.kind} | \`${fs.readFileSync('/Users/renshaobin/Workspace/Develop/GitHub/lance/'+s.path,'utf8').split('\n').slice(s.line-1,s.end_line).join(' ').trim().replaceAll('|','\\|')}\` | [${s.line}-${s.end_line}](../L2-files/${s.path}.md) |`).join('\n');
write('L1-modules/rust-lance-file-writer-tests.md',`# File writer test contracts and their limits

All 1,976 physical lines of writer_tests.rs are analyzed: 27 named tests, 10 function helpers, four significant local closures and the private nested module. Tests were read, not run. This is a test-contract catalog, not runtime qualification or complete file-reader/encoder analysis. Parent writer.rs loads this file as writer_tests, and the file adds its own cfg(test) tests module. (${cite(1,44)}; rust/lance-file/src/writer.rs:292-294)

[Crate](rust-lance-file.md) · [V2_0 writer and compatibility](rust-lance-file-v20-compatibility.md) · [Structural writers](rust-lance-file-structural-writer.md) · [Reader grammar](rust-lance-file-readers.md) · [Full L2](../L2-files/${base}.md) · [Orientation](../L0-orientation.md) · [Contracts](../L3-symbols/behavior-contracts.md) · [Tests](../L4-crosscutting/build-and-test.md)

## Local dependencies and execution shape

Private factory wrappers choose exact writers/projections and V2_1 compression construction. FsFixture supplies local paths/stores/schedulers; most reopens use unknown size, no cache, default plugins and options. read_int32_column fully collects a projected stream at batch size 1,024 and readahead 16, then allocates nullable value vectors. The spill helper retains all input and decoded output, so these utilities are not streaming memory-bound examples. (${cite(45,71)}; ${cite(155,188)}; ${cite(1916,1945)})

Tokio tests run async IO; the blocking projection test explicitly uses spawn_blocking around the blocking reader. rstest expands only the declared matrices. Panics/unwraps are test failure mechanisms. FieldTypeMismatch helper checks InvalidInput plus a downcast source; many other rejection tests inspect only strings or is_err. No production extension trait is declared in this file. (${cite(554,621)}; ${cite(1084,1176)})

## Per-test matrix

| Named test | Exact versions or cases | Actual oracle |
|---|---|---|
| basic_write | V2_1 | Ten 1,000-row score batches, metadata added, finish succeeds; no read assertion |
| negative_dictionary_values_with_runt_tail | V2_1, V2_2, V2_3 | 9,216 deterministic signed values roundtrip exactly; chosen encoding not asserted |
| write_empty | V2_1 | Explicit schema and zero generated batches finish; no read or row-count check |
| write_columns_unequal_lengths | V2_0, V2_1 | a=5,b=1,c=0; empty append no-op; max summary5; exact separate reads/take |
| read_unequal_length_projection | V2_0, V2_1 | Equal roots scan; unequal roots reject even common prefix; bounds use selected root |
| read_nested_columns_under_validation | V2_0, V2_1 | Three nested projections each return3 rows; no value check |
| write_column_validation_errors | V2_1 | Uninitialized lazy, index5 of2, nonnullable null produce matching error text |
| writer_rejects_unconverted_arrow_json | Four V2 versions x top-level/struct | Structured type/extension mismatch, field path, finish retains one accepted row |
| write_column_rejects_mismatched_type | Four V2 versions | Bare Utf8 rejected against JSONB, with no actual extension |
| v2_0_writer_atomically_rejects_reordered_null_structs | V2_0 | InvalidInput and message; recovered id read contains only4,5,6 |
| v2_0_writer_validates_logical_list_structs | Four slice/null cases | Three acceptance cases finish; selected null struct rejects |
| v2_0_writer_validates_logical_fixed_size_list_structs | Three mask/nullability cases | Masked nulls accepted, selected null struct rejected; width1 only |
| v2_0_encoding_strategy_rejects_null_structs | Ordinary/packed x three entry paths | Direct BatchEncoder/factory and encode_batch all reject |
| v2_0_primitive_fsl_preparation_reuses_array | Float32 width2 with parent null | prepare_array returns pointer-identical Arc |
| blocking_read_unequal_length | V2_0, V2_1 | Short projection yields one row; unequal constructor returns error |
| write_batch_keeps_equal_lengths | V2_1 | Summary3 and both metadata column counts3; no value decode |
| max_page_bytes_enforced | V2_0, explicit1MiB | Every page buffer-size sum<=1MiB; exactly8 pages |
| zero_max_page_bytes_rejected | V2_0 generic eager/lazy | InvalidInput with exact zero-limit message; lazy failure on first batch |
| v2_0_writer_rejects_zero_max_page_bytes | Direct V2_0 eager | Same structured zero-limit oracle |
| v2_1_lazy_writer_rejects_zero_max_page_bytes | Direct V2_1 lazy | Same oracle on first batch |
| max_page_bytes_env_var | V2_1, env2MiB | Existing page sums<=2MiB; no page-count assertion |
| compression_overrides_end_to_end | V2_1 wildcard *_id | Metadata/version and first-page RLE descriptions; no data decode or baseline comparison |
| field_metadata_compression | V2_1, text zstd6/data none | First-page Zstd and Flat/compression: None descriptions; level6 not asserted |
| field_metadata_rle_threshold | V2_1, threshold0.9/lz4/BSS off | First-page RLE description only |
| large_page_split_on_read | V2_1,128MiB cap/10MiB read chunk | Two values, one batch, full40MiB byte check and actual file-size equality |
| page_metadata_spill_roundtrip | V2_1,20 or50 batches x2 columns x100 rows | Decoded output equals a separate current-code unspilled baseline |
| page_metadata_spill_many_columns | V2_1,10x500x100 | Same baseline equality; no flush-threshold instrumentation |

Matrix evidence: smoke/dictionary ${cite(72,154)}; unequal/nested ${cite(190,553)}; validation/JSON ${cite(554,719)}; V2_0 null/preparation ${cite(731,1083)}; blocking/rectangular ${cite(1084,1225)}; limits ${cite(1226,1447)}; compression ${cite(1448,1793)}; large reads/spill ${cite(1794,1976)}. RowCount in the smoke generator is per batch, confirmed by rust/lance-datagen/src/generator.rs:2360-2373.

## Projection semantics and contradictory prose

The unequal projection fixture has a/b length5 and c length1. [a,b] full scan returns exact values; [a,c] rejects both RangeFull and Range(0..1), while single-root full/open-ended ranges use that root's own length. The introductory comment that a common bounded range is valid contradicts the explicit assertion. The async helper merges opening and collection errors, so it cannot prove the comment's before-any-batch timing. The blocking test calls is_err on the reader constructor directly and does establish constructor rejection for its full-scan case. (${cite(297,448)}; ${cite(1136,1176)})

Nested fixture a/s/list has three roots rows, while list values contain six items. Three projections assert only total row count3. This protects against one physical-column partition error but is not a nested value/null roundtrip. The ordinary write_batch test similarly observes equal metadata counts, not released-file compatibility despite its comment. (${cite(450,553)}; ${cite(1178,1225)})

## Preflight and error-state contracts

JSON tests deliberately write a valid JSONB batch before rejecting an Arrow-JSON text batch, exercising a changed schema after cache acceptance. Structured mismatch includes j or s.j, LargeBinary/Lance JSON versus Utf8/Arrow JSON; a bare array carries no extension. Remaining summary length1 is a state oracle, not direct observation of every encoder. (${cite(622,719)})

The reordered V2_0 fixture uses writer order[id,s] and batch order[s,id]. A null struct rejects before later valid data is written; the persisted id column must contain only4,5,6. Separate list/FSL cases distinguish selected null structs from unreachable backing slots or children under null parents. These cases check rejection/finish, not successful decoded list values. Direct encoder/factory and encode_batch cases protect access outside FileWriter for both packed and ordinary structs. Primitive Float32 FSL preparation separately requires Arc pointer reuse. (${cite(731,1083)})

These narrow recovery oracles do not establish transactional rollback after page IO failure, repeated finish, abort, external metadata initialization, late spill setup or cancellation. No such injected case occurs among the complete tests cataloged above. (${cite(1,1976)})

## Resource limits and unsafe environment mutation

Explicit1MiB V2_0 test writes one million UInt64 values and requires exactly8 metadata pages with recorded buffer-size sums<=1MiB. This sum does not include padding/metadata/global buffers and is not a universal cap across arbitrary indivisible values. Zero option rejection covers generic V2_0 eager/lazy, direct V2_0 eager and direct V2_1 lazy; environment zero is absent. (${cite(1226,1381)})

The environment fixture uses two unsafe set_var calls under a current-thread runtime. It saves no original value, has no process-wide lock or safety rationale, and resets to an empty string only after all awaits/assertions succeed. Runtime flavor alone does not serialize other tests in the same process; panic/cancellation can leave the configured value. The final empty string is not restoration/removal. This is a source-derived test-isolation concern, not an observed failure. Raw input sizes labeled8MiB/4MiB in comments are actually8,000,000/4,000,000 bytes. (${cite(1226,1241)}; ${cite(1382,1447)})

The40MiB binary test verifies every byte after a10MiB read-chunk configuration, but never counts IO requests. Its one output batch must not be confused with one IO chunk. Spill cases use default writer cache/page budgets and do not assert a mid-write sidecar flush; many-column comments state intent only. Baseline equality can miss bugs shared by both write modes. (${cite(1794,1976)})

## Compression evidence boundaries

Override test contains deterministic quantity values and short repetitive descriptions despite comments describing random/long input. Only *_id receives RLE threshold0.5/BSS Off. A file called no_compression actually uses default compression policy and is never read/compared. Both ID first pages must describe RLE; metadata and version are checked, but decoded values, compression ratios and all-page choices are not. (${cite(1448,1619)})

Field metadata tests inspect first-page description strings for Zstd, Flat/compression: None and RLE. They do not assert level6, Lz4 payload use, threshold boundaries or decompressed value equality. Keep those distinct from negative-dictionary and large-binary tests, which compare values. (${cite(1620,1793)}; ${cite(101,125)}; ${cite(1877,1890)})

## Exact private declarations

All entries below are cfg(test) private declarations; no public API is added by this file. Complete behavior and local calls are in the linked L2 and machine-readable symbol catalog.

| Symbol | Kind | Literal declaration | L2 evidence |
|---|---|---|---|
${rows}
`);
const additions={
'L0-orientation.md':`\n## Writer test evidence\n\nThe [writer-test catalog](L1-modules/rust-lance-file-writer-tests.md) separates metadata/success-only assertions from actual value, size and pointer-identity oracles across27 named tests. Unequal projected root lengths reject even a common-prefix range; V2_0 null-struct validation depends on logical parent selection. These are source-derived test contracts, not executed results. (${cite(297,448)}; ${cite(817,1083)})\n`,
'L3-symbols/behavior-contracts.md':`\n## Writer test oracles and validation boundaries\n\nAll four V2 versions reject Arrow-JSON text against JSONB with structured FieldTypeMismatch; the batch case preserves one previously accepted row. V2_0 reordered-root recovery reads only post-rejection IDs4,5,6, while direct encoder and packed cases require immediate null-struct errors. These are the tested preflight boundaries, not a general IO rollback contract. (${cite(622,815)}; ${cite(954,1049)}) [Test catalog](../L1-modules/rust-lance-file-writer-tests.md).\n\nUnequal projections reject common-prefix ranges despite introductory prose. Async test helper conflates opening and collection errors; blocking fixture observes constructor error directly. Page-cap checks sum metadata buffer lengths, excluding padding/other regions. Compression-description tests do not decode values or assert sizes. (${cite(297,448)}; ${cite(1156,1176)}; ${cite(1274,1296)}; ${cite(1570,1792)})\n`,
'L3-symbols/format-spec.md':`\n## Writer-test evidence is not a byte-format proof\n\nThe explicit V2_0 page fixture asserts eight pages whose raw buffer-size sums do not exceed1MiB. Structural large-value test verifies a40MiB Binary payload with128MiB write cap and10MiB read-chunk option; it does not inspect exact page bytes or IO request counts. Compression tests match first-page description strings rather than reconstruct bit layouts. These supplement exact-version historical-byte tests without replacing pending encoder/reader/binary-fixture analysis. (${cite(1226,1296)}; ${cite(1598,1792)}; ${cite(1794,1890)}) [Full oracles](../L1-modules/rust-lance-file-writer-tests.md).\n`,
'L4-crosscutting/scenarios.md':`\n## Test-derived unequal-root and rejection-recovery traces\n\n1. Write roots independently to lengths5,1,0; finish reports max5 and metadata preserves each length. Read each populated root independently or take increasing indices from the long root. (${cite(190,295)})\n2. Project roots with equal lengths for a rectangular stream. Even a shared prefix of unequal roots rejects; open-ended single-root selections resolve against its own length. The async collecting test does not isolate failure timing. (${cite(297,448)})\n3. For V2_0 reordered input, reject a selected null struct, then write a valid batch on the same writer. The reopened id projection contains only the valid batch's4,5,6. This does not establish rollback for arbitrary encoding/IO errors. (${cite(731,815)})\n\nAll five complete KB-only acceptance questions remain FAIL: these file-local oracles do not fill Dataset/compaction/retry, complete encoding algorithms, scalar registry or language bindings. [Test catalog](../L1-modules/rust-lance-file-writer-tests.md).\n`,
'L4-crosscutting/build-and-test.md':`\n## Complete writer_tests.rs landscape\n\nThe file defines27 named tests and10 function helpers inside writer::writer_tests::tests, plus four significant local closures. Unequal-length/nested/blocking cases use only V2_0/V2_1; JSON/type mismatches span all four V2 versions; spill/compression/large-read cases use V2_1. [Exact matrix and signatures](../L1-modules/rust-lance-file-writer-tests.md). (${cite(1,1976)}; rust/lance-file/src/writer.rs:292-294)\n\nSuccess-only smoke/empty and metadata-only compression tests must not be reported as decoded-value coverage. Spill baseline equality does not prove threshold crossing or fault cleanup. Environment test globally mutates the cap unsafely without restoring prior state or serializing the process.40MiB payload and10x500x100 spill fixtures have no runtime measurement here. Tests were read, not run. (${cite(72,154)}; ${cite(1382,1792)}; ${cite(1794,1976)})\n`,
'L4-crosscutting/cookbook.md':`\n## Writer regression selection\n\nWhen changing preparation or name selection, extend the reordered V2_0 rejection/recovery, nested JSON mismatch and logical list/FSL parent-mask matrices. Preserve direct factory/BatchEncoder entry validation as well as FileWriter validation; distinguish pointer reuse from allocation-free execution. (${cite(622,1083)})\n\nFor projection changes, use the equal/unequal/nested async fixtures and blocking constructor fixture; add explicit opening-versus-stream-failure assertions if timing is the contract. For compression changes, existing display-string checks need actual decode/size/encoding assertions appropriate to the change. For spill changes, existing equality fixtures do not prove mid-write flush, failure recovery or cleanup. These are local test-selection steps; complete reader/encoder/backend/caller work remains pending. (${cite(297,553)}; ${cite(1084,1176)}; ${cite(1448,1792)}; ${cite(1892,1976)}) [All existing tests](../L1-modules/rust-lance-file-writer-tests.md).\n`,
'L4-crosscutting/pitfalls.md':`\n## Writer test comments and assertions differ\n\nDo not infer common-prefix reads of unequal roots from the test's introductory comment: its explicit assertion rejects them. Do not infer compression data integrity or file-size improvement from end_to_end naming: only metadata and first-page descriptions are checked there. The baseline called no_compression uses defaults and is not compared. (${cite(297,420)}; ${cite(1448,1618)})\n\nCurrent-thread Tokio does not prove process-wide safety for environment mutation. The cap test resets to empty only on normal completion, preserving neither the old value nor absence. Many-column spill fixture comments also do not prove a mid-write flush because no threshold event is asserted. These are source observations, not executed failures. (${cite(1382,1446)}; ${cite(1965,1976)}) [Limits](../L1-modules/rust-lance-file-writer-tests.md).\n`
};
for(const [p,s]of Object.entries(additions))fs.appendFileSync(p,s);
function replace(p,before,after){let s=fs.readFileSync(p,'utf8');if(!s.includes(before))throw Error('Missing status '+before);s=s.replace(before,after);write(p,s);changes.push({path:p,before,after});}
replace('L1-modules/rust-lance-file.md','Thirty-four of 56 inventory entries are analyzed (8,873 physical text/symlink lines).','Thirty-five of 56 inventory entries are analyzed (10,849 physical text/symlink lines).');
replace('L1-modules/rust-lance-file.md','Full reader IO, V1 internals, encoding implementations, binary fixture payloads and benches remain pending.','The complete [writer-test catalog](rust-lance-file-writer-tests.md) is also covered. Full reader IO, concat, V1 internals, encoding implementations, binary fixture payloads and benches remain pending.');
replace('L1-modules/rust-lance-file-structural-writer.md','writer_tests.rs remains only contextually read.','writer_tests.rs is now fully analyzed in the [writer-test catalog](rust-lance-file-writer-tests.md), with its distinct integration oracles and limits.');
replace('L4-crosscutting/build-and-test.md','writer.rs points to the still-pending writer_tests.rs.','writer.rs points to writer_tests.rs, now fully analyzed in the later complete test catalog.');
replace('L4-crosscutting/build-and-test.md','A contextual writer_tests case for V2_0/V2_1 writes unequal field lengths, checks a one-row single-column read and rejection of the joint projection. The rest of that test file is pending; none of these tests was run.','The now fully analyzed writer_tests.rs includes V2_0/V2_1 unequal-length integration cases, plus separate JSON/preparation, compression, large-value and spill fixtures cataloged below; none of these tests was run.');
const m=read('MANIFEST.json'),files=[];
for(const p of ['rust/lance-file/src/lib.rs','rust/lance-file/src/writer.rs']){
 const e=m.files.find(e=>e.path===p),f=structuredClone(read(e.analysis_record).files.find(f=>f.path===p));
 if(p.endsWith('/lib.rs')){const r=f.ranges[0],before=r[2];r[2]=r[2].replace('Full reader IO, writer_tests.rs, V1 writer and individual binary fixtures remain pending.','writer_tests.rs is also fully analyzed. Full reader IO, V1 writer and individual binary fixtures remain pending.');changes.push({path:p,before,after:r[2]});}
 else{
  const r=f.ranges.find(r=>r[0]===281),before=r[2];r[2]=r[2].replace('The separate test file remains pending.','The separate writer_tests.rs is now fully analyzed; it adds a nested private tests module and no production API.');changes.push({path:p,before,after:r[2]});
  const limits=f.limits;f.limits=f.limits.replace('Underlying object-store completion/cleanup and writer_tests.rs remain pending.','writer_tests.rs test oracles are fully analyzed. Underlying object-store completion/cleanup remains pending.');changes.push({path:p,before:limits,after:f.limits});
 }
 files.push(f);
}
write('analysis/iteration-057-status-refresh.json',JSON.stringify({iteration:57,files,changes},null,2)+'\n');
const all=read('analysis/rust-symbols.json');let synchronized=0;
for(const s of all){let changed=false;const f=files.find(f=>f.path===s.path);if(f){const r=f.ranges.find(r=>s.behavior_reference===`${f.path}:${r[0]}-${r[1]}`);if(r&&s.behavior!==r[2]){s.behavior=r[2];changed=true;}}
 const before=s.callers;s.callers=s.callers.replace('downstream file/Dataset callers and writer_tests.rs remain pending.','writer_tests.rs test callers are fully analyzed; downstream file/Dataset callers remain pending.');if(before!==s.callers)changed=true;if(changed)synchronized++;
}
write('analysis/rust-symbols.json',JSON.stringify(all,null,2)+'\n');
console.log({layer_additions:Object.keys(additions).length,new_supplement:1,status_changes:changes.length,synchronized});
