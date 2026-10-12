import fs from 'node:fs';
import {root,linesOf} from './inventory.mjs';
const read=p=>JSON.parse(fs.readFileSync(p));
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const batch=read('analysis/iteration-051-batch.json'), symbols=read('analysis/iteration-051-symbols.json');
function api(file,publicOnly){
 const src=linesOf(fs.readFileSync(root+'/'+file,'utf8'));
 return ['| Symbol | Visibility | Exact declaration | Evidence |','|---|---|---|---|',...symbols.filter(s=>s.path===file&&(!publicOnly||s.visibility==='public')).map(s=>'| `'+s.name.replace('lance_table::utils::stream::','').replace('lance_table::benches::','')+'` | '+s.visibility+' | `'+src.slice(s.line-1,s.end_line).join(' ').trim().replaceAll('|','\\|')+'` | ['+file+':'+s.line+'-'+s.end_line+'](../L2-files/'+file+'.md) |')].join('\n');
}
fs.writeFileSync('L1-modules/rust-lance-table-stream.md',`# Batch task alignment and system columns

Complete local scope: all 1,887 lines of utils/stream.rs. [Table](rust-lance-table.md) · [Exact file and ranges](../L2-files/rust/lance-table/src/utils/stream.rs.md) · [Benchmarks](rust-lance-table-benchmarks.md) · [Contracts](../L3-symbols/behavior-contracts.md) · [Scenarios](../L4-crosscutting/scenarios.md).

This public utils::stream module aligns column streams and attaches row IDs, physical addresses and version arrays to already scheduled batches. It applies physical deletions by filtering or by nulling ID/address columns. It opens no files, spawns no tasks and chooses no downstream concurrency limit. Two fragment call sites merge reader streams, merge overlays, construct the configuration, wrap system columns, then begin projection reordering; complete FragmentReader orchestration remains pending. (rust/lance-table/src/utils.rs:1-4; rust/lance-table/src/utils/stream.rs:195-216; rust/lance-table/src/utils/stream.rs:643-848; rust/lance/src/dataset/fragment.rs:3680-3719; rust/lance/src/dataset/fragment.rs:3872-3916)

## Public API

${api(batch.files[0].path,true)}

ReadBatchTask.num_rows is the promised physical/selected batch length before deletion. The wrapper advances a u32 selected-position offset using this declaration; actual future results are not comprehensively compared with it. Configuration fields are publicly mutable and no constructor validates combinations, row limits or selection shape. Missing stable IDs mean physical addresses serve as IDs; missing requested versions become 1. The default-value rule is independent of current manifest version. (rust/lance-table/src/utils/stream.rs:30-40; rust/lance-table/src/utils/stream.rs:317-369; rust/lance-table/src/utils/stream.rs:489-591; rust/lance-table/src/utils/stream.rs:692-719)

## Alignment and shared future lifecycle

MergeStream keeps one pending chunk from each input. It emits the minimum remaining count, splitting bigger chunks with shared futures and Arrow slices. A whole unsplit task moves its original future directly. Split errors become Wrapped with the original Error reachable through SharedReadError::source. Input task order determines column merge order; FuturesOrdered yields component results in that order. Any input stream ending stops the merge without checking remaining totals. Zero-row tasks are allowed. (rust/lance-table/src/utils/stream.rs:41-216)

The outer stream does not await batch data; emitted futures perform the actual merge. Dropping one split future does not itself invalidate another shared handle, and retained slices can retain the whole source batch. Declared sizes must match actual data or slicing can panic; equal actual lengths are checked by RecordBatchExt::merge. Matching field names are not simple concatenation: nested structures may merge and other conflicts keep the left column. Left schema metadata survives. Certain nested-list merge branches can panic; those dependency internals are only contextually read, not fully analyzed. (rust/lance-table/src/utils/stream.rs:90-159; rust/lance-arrow/src/lib.rs:657-677; rust/lance-arrow/src/lib.rs:1231-1332)

## Ordered expansion, read-ahead and schema reuse

The wrapper chooses dense versus ordinary row-ID cursor expansion once, then expands IDs and multi-run versions while pulling tasks in order. Batch futures may complete concurrently without sharing mutable cursors. Metadata Results are captured in those futures: an input batch error propagates first and can mask a precomputed metadata error. Work done while pulling can be discarded if a future is never consumed. (rust/lance-table/src/utils/stream.rs:648-691; rust/lance-table/src/utils/stream.rs:692-848)

Uniform nonzero task sizes enable a 65,536-row read-ahead target and shared output-schema cache. Chunks are aligned to whole batches, capped by selected rows left; a larger task can exceed the target. A nonfinal size change permanently disables both fast paths after draining any usable cached ID chunk. Zero-size tasks do not alter the inferred size; a different final size is allowed. A batch straddling chunks copies its prefix and suffix; fitting slices share storage. Retained output futures/batches can hold multiple old buffers, so the current chunk is not a global memory cap. (rust/lance-table/src/utils/stream.rs:378-405; rust/lance-table/src/utils/stream.rs:692-798)

The OnceLock caches the first completing batch's input/output schemas. Pointer-identical or structurally equal later schemas reuse its output Arc; differing schemas receive a fresh schema without replacing the cache. This path appends fields directly. The incremental fallback instead calls try_with_column repeatedly, which explicitly rejects duplicate names. Do not assume identical malformed-input behavior for both assembly paths. (rust/lance-table/src/utils/stream.rs:592-634; rust/lance-arrow/src/lib.rs:643-648; rust/lance-arrow/src/schema.rs:146-157)

## Selection, errors and deletion semantics

Selection offsets count rows in the requested selection, while ranges/indices identify physical positions in the sequence. Helpers slice params then often unwrap Results, so invalid selection can panic despite a Result-returning public transformer. ReadBatchParams materializers use raw index values and unchecked u32 endpoint conversions; the local total count is primarily a read-ahead estimate. The wrapper checks decoded stable-ID count and returns named CorruptFile on truncation. The direct fallback lacks that exact chunk check. (rust/lance-table/src/utils/stream.rs:266-315; rust/lance-table/src/utils/stream.rs:407-545; rust/lance-io/src/lib.rs:156-219; rust/lance-io/src/lib.rs:248-277)

A one-run version sequence repeats its value without validating the run length against selection. Its O(1) comment concerns locating a version, not allocating/filling the output vector. Multi-run streaming reuses version cursors; direct calls create a new cursor and repeat selection construction. System columns appear in ID, address, last-updated, created order after payload. (rust/lance-table/src/utils/stream.rs:266-315; rust/lance-table/src/utils/stream.rs:553-591; rust/lance-table/src/utils/stream.rs:681-690)

Deletion predicates use physical addresses regardless of stable IDs. Some(NoDeletions) is normalized away. Filter mode removes rows from every column; null mode keeps physical length and combines existing validity with deletion validity only for _rowid/_rowaddr. Payload and version values remain present under deleted rows. If no ID/address field is present, null mode has no identifying null output; test code treats that as an upstream-invalid configuration, but production code does not reject it. Empty filtered batches are returned. (rust/lance-table/src/utils/stream.rs:218-264; rust/lance-table/src/utils/stream.rs:479-551; rust/lance-table/src/utils/stream.rs:636-640; rust/lance-table/src/utils/stream.rs:1517-1526)

## Tests and boundaries

Fixtures cover aligned and differing-boundary merges, sparse IDs with deletion-preserved addresses, unsorted/repeated selection, shared read-ahead buffers, zero tasks, truncated IDs, variable-size fallback, equivalent-schema reuse, physical selection forms, a deletion matrix, one/many-run versions, backwards version selections and direct fallback. They use in-memory ready tasks and buffered consumers; no actual IO or forced delayed completion is present. They do not cover unequal total streams, split-error fanout, declared/actual length mismatches, duplicate system names, malformed uniform version length, or null-only deletion with version columns. Tests were read, not run. (rust/lance-table/src/utils/stream.rs:850-1887)
`);
fs.writeFileSync('L1-modules/rust-lance-table-benchmarks.md',`# Table metadata and system-column benchmarks

Complete local scope: manifest_intern.rs (263 lines), system_columns.rs (172), version_columns.rs (160). [Table](rust-lance-table.md) · [Stream implementation](rust-lance-table-stream.md) · [Row-ID index benchmark](rust-lance-table-row-index.md) · [Build and testing](../L4-crosscutting/build-and-test.md). These files expose no library public API; their helpers and Criterion registrations are cataloged below. None was executed.

## Fragment interning workload

BENCH_NUM_FRAGMENTS defaults to 100,000; successful malformed text panics. Uniform fixtures contain 10 or 50 fields, 1,000 physical rows per fragment and identical creation/update payloads at version 42. Diverse fixtures use ten fields and 10/100/500 version groups. Both measured conversion paths clone already-decoded protobuf messages; one directly converts Fragment, the other creates a new interner per iteration. They do not measure byte decoding or object-store IO. Positive fragment counts below the number of version groups trigger division by zero in fixture construction. (rust/lance-table/benches/manifest_intern.rs:20-205)

The memory group holds baseline and interned outputs, reports separate DeepSizeOf estimates in units of 1,048,576 bytes despite an MB label, and times only interned deep_size_of traversal. It does not measure process RSS, transient interner/protobuf allocation peaks or assert savings. Linux adds a 100 Hz flamegraph profiler; other systems use default Criterion. (rust/lance-table/benches/manifest_intern.rs:206-263)

${api(batch.files[1].path,false)}

## Row-ID/system-column workload

BENCH_SYSTEM_ROWS defaults to 100,000 and BENCH_SYSTEM_BATCH_SIZE to 1,024 capped at total rows. BENCH_SYSTEM_VARIABLE_BATCHES enables only for exact string 1. The eight shapes cross hole stride 2/17, payload absent/present and row-ID-only/all-system columns. All-system versions have absent sequences and therefore materialize 1; no deletions are present. Zero batch size with positive rows can produce endless zero tasks or an invalid slice. (rust/lance-table/benches/system_columns.rs:18-130; rust/lance-table/src/utils/stream.rs:560-591)

SmallInput setup creates config and a lazy stream. Timed work includes producing ready tasks, wrapping them, buffering eight, running a current-thread runtime and collecting the full output Vec. Bulk ID encoding is outside timing. Ten samples, one-second warmup and three-second measurement are configured, with no result oracle or throughput normalization. Retaining all outputs also retains their shared buffers. (rust/lance-table/benches/system_columns.rs:107-172)

${api(batch.files[2].path,false)}

## Version-column workload

BENCH_VERSION_ROWS defaults to 100,000 and BENCH_VERSION_BATCH_SIZE to 1,024 capped at total. Four run lengths are total rows, 1,024, 32 and 1. Only last-updated is requested. Direct timing processes one fixed-size batch per iteration, creates fresh cursor state and skips a nondivisible short tail; stream timing processes all rows including tail, with reusable cursors within that stream and retained output Vec. Their raw durations have different units. Zero total causes zero-step fixture panic; zero batch is also invalid for stream step_by. Small totals can produce duplicate run-count labels; dependency handling is unverified. (rust/lance-table/benches/version_columns.rs:22-157)

Both groups request ten samples, one-second warmup and three-second measurement, black-box outputs and assert no value oracle. There is no disk read, deletion, creation-version or address workload here. Repository benchmark policy selects release-with-debug; these configured workloads supply no measured performance claim. (rust/lance-table/benches/version_columns.rs:46-60; rust/lance-table/benches/version_columns.rs:80-160; AGENTS.md:19-31)

${api(batch.files[3].path,false)}
`);
const append=(p,t)=>fs.appendFileSync(p,'\n\n'+t+'\n');
append('L0-orientation.md',`## Task-stream and system-column boundary

ReadBatchTask combines a future batch and its declared pre-deletion row count. MergeStream aligns different per-file batch boundaries; system-column wrapping then assigns selection offsets before concurrent future completion. Read-ahead targets 65,536 IDs, while downstream retained batches can keep older buffers alive. A system column is a requested ID/address/version array appended to payload; null-deletion mode nulls only ID/address fields. See the [stream supplement](L1-modules/rust-lance-table-stream.md). (rust/lance-table/src/utils/stream.rs:30-40; rust/lance-table/src/utils/stream.rs:126-216; rust/lance-table/src/utils/stream.rs:218-264; rust/lance-table/src/utils/stream.rs:648-848)`);
append('L3-symbols/behavior-contracts.md',`## Aligned task streams and materialized system columns

Preserve declared physical task counts until system-column assignment; filtering changes output lengths afterward. All column streams must share physical order, and merge stops at the shortest without equality validation. Split futures share one underlying result and wrap shared errors while unsplit whole tasks return original errors. (rust/lance-table/src/utils/stream.rs:64-216)

Cursor state advances during ordered stream pull, not future completion. Uniform-size read-ahead and schema reuse permanently stop at a nonfinal task-size change, with cached ID data drained first. A fitting slice is shared; a straddling output copies. Eager metadata errors are delivered only after successful input futures. Do not move mutable cursor advancement into concurrently polled futures. (rust/lance-table/src/utils/stream.rs:669-848)

One-run versions are repeated without run-bound validation, absent requested versions become 1, and deletion filtering acts after all requested arrays are built. Null mode affects only ID/address validity; it preserves payload/version values and physical row count. Direct and cached schema assembly have different explicit duplicate-name checks. (rust/lance-table/src/utils/stream.rs:218-315; rust/lance-table/src/utils/stream.rs:560-641; rust/lance-arrow/src/schema.rs:146-157)`);
append('L3-symbols/format-spec.md',`## Materialization does not add a wire format

System-column wrapping consumes decoded row-ID/version sequences and physical selection metadata. Missing requested version sequences produce value 1; this is a runtime fallback, not a newly persisted field default or file-format version. The one-run fast path trusts its sequence span, so it is not a byte-decoder validation boundary. (rust/lance-table/src/utils/stream.rs:266-315; rust/lance-table/src/utils/stream.rs:560-591)`);
append('L4-crosscutting/scenarios.md',`## Scheduled batches to visible rows

1. Fragment call sites obtain per-file task streams, align them with merge_streams, then merge overlays before configuring system-column wrapping. Only these local call sites are inspected; complete fragment scheduling and overlay IO remain pending. (rust/lance/src/dataset/fragment.rs:3680-3719; rust/lance/src/dataset/fragment.rs:3872-3916)
2. Pulling each wrapped task assigns its selected-position offset and eagerly expands stable IDs/multi-run versions with private cursors. Returned futures hold those arrays/Results while payload reads can proceed concurrently. (rust/lance-table/src/utils/stream.rs:692-848)
3. On successful payload completion, build missing address/version arrays, append requested fields and use physical-address deletion predicates. Filter mode drops rows across all columns; null mode preserves row alignment and only nulls ID/address. Projection reordering follows in the contextual caller. (rust/lance-table/src/utils/stream.rs:489-641; rust/lance/src/dataset/fragment.rs:3709-3719)

This closes the local table stream boundary. Full write/compaction disk effects, scalar registration, V2 encoding layout, bindings and operation-pair commit rules still fail the five complete acceptance questions.`);
append('L4-crosscutting/build-and-test.md',`## Table stream tests and final three benchmarks

The stream tests assert column alignment, sparse/unsorted/repeated IDs, physical deletion offsets, read-ahead pointer sharing, zero/truncated tasks, variable-size fallback, structural schema reuse and version RLE alignment. They use ready in-memory tasks; delayed IO, unequal totals, shared-error fanout and malformed public config remain local coverage gaps. None was run. (rust/lance-table/src/utils/stream.rs:850-1887)

[Benchmark contracts](../L1-modules/rust-lance-table-benchmarks.md) document BENCH_NUM_FRAGMENTS, BENCH_SYSTEM_ROWS/BATCH_SIZE/VARIABLE_BATCHES and BENCH_VERSION_ROWS/BATCH_SIZE. Fragment benchmarks measure conversion of decoded messages and graph estimates; direct version timing covers one batch while stream timing covers all rows. System/version groups collect all outputs and request ten samples, one-second warmup and three-second measurement. No timing or RSS result is claimed. Use repository release-with-debug policy for actual benchmark work. (rust/lance-table/benches/manifest_intern.rs:20-263; rust/lance-table/benches/system_columns.rs:92-172; rust/lance-table/benches/version_columns.rs:80-160; AGENTS.md:19-31)`);
append('L4-crosscutting/cookbook.md',`## Change task alignment or system-column materialization

Coordinate ReadBatchTask declared counts, MergeStream splitting, ordered cursor expansion and apply_row_id_and_deletes assembly. Preserve physical selection offsets through deletion, both ID representations, output field order and shared-schema behavior. Extend the existing tests with split errors, unequal totals, declared/actual mismatches, duplicate field names and malformed single-run metadata when changing those contracts; do not infer runtime validation from debug assertions. (rust/lance-table/src/utils/stream.rs:30-216; rust/lance-table/src/utils/stream.rs:266-848; rust/lance-table/src/utils/stream.rs:850-1887)

Compare benchmark units explicitly: one batch versus full stream, decoded protobuf conversion versus byte decoding, graph estimates versus RSS. Keep bulk setup outside the intended timed region while remembering task generators are lazy. Environment overrides need valid positive step sizes and enough fragments for diverse groups. These are future implementation/measurement instructions, not executed qualification. (rust/lance-table/benches/manifest_intern.rs:97-244; rust/lance-table/benches/system_columns.rs:39-162; rust/lance-table/benches/version_columns.rs:62-157)`);
append('L4-crosscutting/pitfalls.md',`## Stream metadata trust and benchmark units

A 65,536-row read-ahead target is not a global retained-memory bound. One-run version lookup still allocates output and does not validate its span. Null-deletion mode preserves version/payload values, and a caller omitting ID/address fields receives no tombstone marker. Unwrapped selection errors and unchecked advertised counts remain preconditions despite Result-returning APIs. (rust/lance-table/src/utils/stream.rs:218-315; rust/lance-table/src/utils/stream.rs:407-463; rust/lance-table/src/utils/stream.rs:692-798)

Never compare direct and stream version durations as equal work: one times one batch and skips a short tail; the other includes the full stream and tail. Interning memory output is a DeepSizeOf estimate labeled MB with a MiB divisor, not peak process allocation. (rust/lance-table/benches/version_columns.rs:99-157; rust/lance-table/benches/manifest_intern.rs:206-244)`);
append('L1-modules/rust-lance-table.md',`## Complete local inventory and stream boundary

All 54 lance-table entries now have full line accountability. The [stream supplement](rust-lance-table-stream.md) covers all public task/config APIs, shared merge lifecycle, cursor/read-ahead/schema behavior and deletion/version edge cases. The [benchmark supplement](rust-lance-table-benchmarks.md) completes the remaining three workloads and their measurement limits. This closes local source coverage, not full Dataset integration or the whole-repository acceptance questions. (rust/lance-table/src/utils/stream.rs:1-1887; rust/lance-table/benches/manifest_intern.rs:1-263; rust/lance-table/benches/system_columns.rs:1-172; rust/lance-table/benches/version_columns.rs:1-160)`);
console.log({modules:2,layer_updates:7});
