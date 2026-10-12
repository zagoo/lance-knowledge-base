import fs from 'node:fs';import{root,linesOf}from'./inventory.mjs';
const read=p=>JSON.parse(fs.readFileSync(p)),symbols=read('analysis/iteration-065-symbols.json'),r='rust/lance-file/benches/reader.rs',s='rust/lance-file/benches/schema.rs',rc=(a,b)=>`(${r}:${a}-${b})`,sc=(a,b)=>`(${s}:${a}-${b})`,append=(p,s)=>fs.appendFileSync(p,s);
let doc=`# File reader and schema benchmark contracts

Complete source scope: reader.rs477 lines and schema.rs73 lines. Both are separate Criterion executables with harness=false, not public lance_file API modules. Twenty-eight declarations include platform alternatives and macro invocations; macro-expanded code is not fabricated. No benchmark, source build/test, cache eviction or fixture creation was executed. (rust/lance-file/Cargo.toml:41-69) ${rc(1,477)} ${sc(1,73)}

[File crate](rust-lance-file.md) · [Reader L2](../L2-files/${r}.md) · [Schema L2](../L2-files/${s}.md) · [Reader runtime](rust-lance-file-shared-reader.md) · [Symbols](../L3-symbols/symbol-index.md) · [Build/test](../L4-crosscutting/build-and-test.md) · [Pitfalls](../L4-crosscutting/pitfalls.md)

## What is measured

| Workload | Untimed construction / setup closure | Timed operation | Advertised unit |
|---|---|---|---|
| reader_{version}/decode, three exact versions | Generate2097152 random Int32 rows; create runtime/temp store; write/finish foo.lance | New scheduler, unknown-size file open, reader metadata/cache setup, full scan in16384-row tasks,16 unordered consumers, row count and raw value sum | Input Arrow batch get_array_memory_size bytes |
| take, nominal32 cases | Per store/version generate524288000 nullable Int32 rows; write file; create/warm T readers. iter_batched setup optionally advises page-cache eviction | spawn_blocking/join, cached reader indexed reads in1- or100-row chunks, up to64 chunk futures per worker, count assertions and raw value sums | T*floor(100000/T) elements |
| schema_from_flat_fields, four cases | Build flat parent/left/right protobuf Field messages | Schema::try_from on borrowed black_box Fields, with new schema returned to Criterion | ALL flat root+leaf entries, not physical leaf count |

Sources: ${rc(30,126)} ${rc(173,477)} ${sc(20,73)}. The decode label includes opening and result consumption. The take selectors are a deterministic stride5120, not sampled random positions. No workload asserts returned values against expected data; reader workloads assert row counts and black_box their sums. They read raw Int32 values without validity checks, which matters for the0.1 requested random-null fixture. ${rc(95,121)} ${rc(207,228)} ${rc(300,350)}

## Version and case matrix

Reader workloads use exact V2_0,V2_1,V2_2, excluding V1 and V2_3. Random-access dimensions are mem/disk, single/multi worker, group size1/100 and cached/nocache. Nocache is skipped for every mem case and every V2_0 case:12 nominal mem registrations plus20 disk. Names encode computed thread count rather than the Boolean mode; T=1 makes the two mode names identical, with Criterion handling unverified. ${rc(31,35)} ${rc(354,402)}

Constants are TOTAL_ROWS100000, ROW_GAP5120, MAX_PARALLELISM64. Selected offsets0..511994880 fit the524288000-row source. Cached worker selectors split using q=floor(100000/T). The read helper further splits by g=rows_at_a_time with no tail handling. Actual parallel decoded rows are T*g*floor(q/g); advertised throughput is T*q. Single-worker mode instead passes all100000 selectors through reader0 and therefore processes the full selector list for either active g. The row-count assertion checks each full chunk only and cannot detect omitted tail selectors. ${rc(151,165)} ${rc(225,247)} ${rc(292,352)} ${rc(384,448)}

## Runtime, cache and lifetime

~~~text
bench_random_access owns TempDir and global current-thread Runtime
  +-- static cache key = filesystem label + version string
  |     +-- all100000 UInt32 selectors
  |     +-- T entries: Arc<FileReader>, selector slice, Arc<current-thread Runtime>
  +-- setup: optional platform cache advice
  +-- timed global block_on
        +-- spawn_blocking per worker (one for single mode)
        +-- worker Runtime::block_on -> <=64 indexed chunk futures
              +-- each chunk sequentially awaits its decoder batch tasks
~~~

The function-local LazyLock cache is protected only during lookup and insertion; concurrent misses are not deduplicated. Key excludes temporary directory, options and CPU count. Cached entries own readers/stores/runtimes but not TempDir, so a later invocation with a new directory can reuse paths whose prior directory was cleaned up. These are source lifecycle risks, not reproduced failures. File name is bench_{version}.lance; the comment saying filesystem is encoded in the name is inaccurate. ${rc(156,263)} ${rc(354,462)}

Each reader opens with a fresh test_cache requesting128MiB and a testing scheduler configured for256MiB buffered IO and use_lite_scheduler=None. That testing constructor does not read the LANCE_USE_LITE_SCHEDULER environment variable; SchedulerConfig::new has that separate behavior. The benchmarks never clear the retained Lance caches. Current-thread runtime builders do not call enable_all/enable_io/enable_time; whether delegated IO needs those drivers is not established by this benchmark source. ${rc(235,290)} ${rc(354,359)} (rust/lance-file/src/testing.rs:78-80; rust/lance-io/src/scheduler.rs:850-865)

T comes from the core cached compute-count helper: explicit LANCE_CPU_THREADS must be at least1; otherwise CPU count minus LANCE_IO_CORE_RESERVATION (default2), falling back to1 when reservation consumes available CPUs. Invalid numeric environment text panics on first relevant initialization. The benchmark does not configure the Tokio blocking pool size or pin threads. ${rc(193,193)} ${rc(384,388)} ${rc(414,448)} (rust/lance-core/src/utils/tokio.rs:12-76)

## Cache-advice semantics and unsafe boundary

On non-Linux, drop_file_from_cache returns Ok without using the path. On Linux it opens the file and calls unsafe posix_fadvise with live fd, offset0,length0 and POSIX_FADV_DONTNEED; nonzero return becomes a direct OS error. No pointer buffer is passed, but the code contains no SAFETY comment or residency verification. This is advisory and preserves the already-open reader/Lance cache. The nocache label is not a verified cold-cache or disk-read guarantee. It runs in iter_batched setup, whose local source is distinct from the timed routine. ${rc(128,149)} ${rc(403,454)}

## Schema fixture and denominator

Each schema root is struct_i with id3*i,parent-1, followed by left_i/right_i Int32 leaves IDs3*i+1/+2. Other protobuf fields use Default. Even leaf count is asserted; huge-count overflow/truncation is not guarded, though active sizes fit. No protobuf bytes are decoded by this workload. ${sc(10,52)}

| Label leaf count | Roots | Throughput flat entries |
|---|---|---|
|1024|512|1536|
|4096|2048|6144|
|16384|8192|24576|
|65536|32768|98304|

The prebuilt Fields are outside the timed closure; reconstruction and resulting allocations occur inside. There is no shape/equality or measured-performance threshold assertion. ${sc(54,70)}

## Configuration, commands and measurement limits

Reader Criterion config sets significance_level0.1 and sample_size10; Linux adds PProfProfiler::new(100,Flamegraph(None)). The profiler implementation remains pending, so100 is recorded as a supplied parameter rather than asserted frequency. Schema uses Criterion defaults. Neither file specifies a warmup/measurement duration. The reader comment asserting at least0.1s per iteration is unmeasured rationale. ${rc(451,477)} ${sc(72,73)}

Repository policy selects release-with-debug for benchmark work. Once running benchmarks is separately intended, command forms are cargo bench -p lance-file --bench reader --profile release-with-debug and the corresponding --bench schema. These are command constructions from Cargo targets and policy, not commands run or validated here; the root profile/toolchain files remain separately pending. (AGENTS.md:19-31; rust/lance-file/Cargo.toml:63-69)

The random-access fixture requests2000MiB of raw Int32 values plus up to62.5MiB validity bitmap before writer/read/scheduler overhead. This is arithmetic, not RSS or encoded-size measurement. Input generation is eager and occurs outside timing; multiple store/version cached readers persist. No timing, throughput, hardware comparability, cloud IO or overall scalability claim follows from this analysis. ${rc(173,263)}

## Exact declarations

Qualified names in the index use a benches/reader or benches/schema documentation namespace; they identify separate executables, not exported Rust library paths. Conditional alternatives retain the same declared name and their cfg. Macro calls are preserved without inventing expansion signatures.

| Declaration | Visibility / condition | Exact source | Location |
|---|---|---|---|
`;
for(const x of symbols){const src=linesOf(fs.readFileSync(root+'/'+x.path,'utf8'));doc+=`| ${x.name.split('::benches::')[1]} | ${x.visibility}; ${x.cfg??'all targets'} | \`${src.slice(x.line-1,x.end_line).join(' ').trim().replaceAll('|','\\|')}\` | ${x.path}:${x.line}-${x.end_line} |\n`;}
fs.writeFileSync('L1-modules/rust-lance-file-benchmarks.md',doc);
append('L0-orientation.md',`\n## Reading benchmark results\n\nThe [file benchmark guide](L1-modules/rust-lance-file-benchmarks.md) distinguishes input-memory bytes, selected-row elements and flat schema-entry throughput. A decode label can include opening and result consumption; a nocache label is only platform-dependent page-cache advice. No measured result is supplied by this KB. ${rc(60,124)} ${rc(128,149)} ${rc(384,454)} ${sc(54,69)}\n`);
append('L3-symbols/behavior-contracts.md',`\n## File benchmark accounting contracts\n\nFull-scan timing includes scheduler/reader/cache opening plus task consumption, and bytes mean input Arrow memory size. Indexed timing retains opened readers, uses deterministic5120-row stride and can drop remainder selectors twice. For T workers and group g, actual rows are T*g*floor(floor(100000/T)/g), while reported throughput omits the second rounding. Single-thread mode passes all selectors. The sum reads physical values under nulls and is not checked against expected values. [Complete benchmark map](../L1-modules/rust-lance-file-benchmarks.md). ${rc(30,126)} ${rc(225,247)} ${rc(292,352)} ${rc(384,448)}\n`);
append('L3-symbols/format-spec.md',`\n## Benchmark evidence is not a format guarantee\n\nThe reader benchmarks generate exact V2_0,V2_1,V2_2 files with default writer options; they omit V1/V2_3 and do not inspect on-disk encodings or compare decoded values. Schema reconstruction starts from parsed protobuf Field messages. These workloads therefore supply no new byte-layout/version compatibility proof. [Benchmark guide](../L1-modules/rust-lance-file-benchmarks.md). ${rc(30,62)} ${rc(365,369)} ${rc(311,334)} ${sc(10,70)}\n`);
append('L4-crosscutting/scenarios.md',`\n## Benchmark-only read scenario\n\nUntimed fixture creation writes and finishes one exact-version file. Full-scan iterations reopen scheduler/reader and consume tasks; indexed iterations reuse warmed readers and dispatch blocking worker calls that run local async reads. Optional cache advice touches only the OS path on Linux and does nothing on other platforms. This is a local synthetic workload, not the Dataset write/compaction scenario required for full acceptance. [Trace and denominators](../L1-modules/rust-lance-file-benchmarks.md). ${rc(30,149)} ${rc(173,290)} ${rc(354,477)}\n`);
append('L4-crosscutting/build-and-test.md',`\n## Lance-file benchmark executables\n\nThe [complete benchmark catalog](../L1-modules/rust-lance-file-benchmarks.md) covers reader.rs477 and schema.rs73 lines. Cargo registers both with harness=false. Reader has three scan cases and nominal32 take cases, sample_size10/significance0.1 and Linux-only profiler; schema has four wide-schema sizes and Criterion defaults. Exact symbols, fixture sizes, timed/setup boundaries and runtime/cache settings are retained. Nothing was executed. ${rc(30,477)} ${sc(1,73)} (rust/lance-file/Cargo.toml:63-69)\n\nUse the repository release-with-debug profile when benchmark execution is intended: cargo bench -p lance-file --bench reader --profile release-with-debug or --bench schema. These command forms are derived, not validated invocations here. Random-access source requests a2000MiB Int32 payload plus validity/encoding overhead. Nocache does not establish actual cache residency, and throughput can exceed rows really consumed because remainder chunks are discarded. (AGENTS.md:19-31) ${rc(207,247)} ${rc(337,352)} ${rc(384,454)}\n`);
append('L4-crosscutting/cookbook.md',`\n## Interpreting a file-read performance regression\n\nMatch version, store, CPU-helper configuration, thread mode, selected grouping and cache state using the [benchmark guide](../L1-modules/rust-lance-file-benchmarks.md). Distinguish scan reopen costs from cached indexed reads, calculate actual consumed rows rather than assuming the Criterion denominator, and use correctness tests to establish value/null accuracy. For schema work distinguish physical leaves in the label from root+leaf throughput entries. Bench source alone cannot qualify a performance improvement. ${rc(30,126)} ${rc(173,352)} ${rc(371,477)} ${sc(54,70)}\n`);
append('L4-crosscutting/pitfalls.md',`\n## File benchmark interpretation pitfalls\n\n- Nocache is a non-Linux no-op and Linux advisory eviction, while Lance caches/readers remain. ${rc(128,149)} ${rc(403,448)}\n- Strided selectors are split with floor division;100-row groups can drop another tail, and per-chunk row assertions do not detect that loss. ${rc(225,247)} ${rc(292,352)}\n- Static cached readers do not own TempDir, key omits directory/options, and filename includes only version despite its comment. ${rc(156,205)} ${rc(255,263)}\n- Raw Int32 sums ignore validity and are only black_boxed. No decoded-value equality is asserted. ${rc(95,121)} ${rc(311,334)}\n- Schema throughput counts root+leaf protobuf entries, whereas labels count leaves. [Full denominator table](../L1-modules/rust-lance-file-benchmarks.md). ${sc(20,69)}\n`);
const p='L1-modules/rust-lance-file.md',before=fs.readFileSync(p,'utf8'),after=before.replace('Forty-eight of 56 inventory entries are analyzed (25,031 physical text/symlink lines).','Fifty of 56 inventory entries are analyzed (25,581 physical text/symlink lines).').replace('modern encoding/IO scheduler implementations, binary fixture payloads and benches remain pending.','The [complete benchmark catalog](rust-lance-file-benchmarks.md) is covered; modern encoding/IO scheduler implementations and six binary fixture payloads remain pending.');fs.writeFileSync(p,after);fs.writeFileSync('analysis/iteration-065-status-refresh.json',JSON.stringify({iteration:65,files:[],changes:[{document:p,kind:'coverage status',before,after}]},null,2)+'\n');console.log('Authored benchmark L1 and updated L0/L3/L4 and crate status.');
