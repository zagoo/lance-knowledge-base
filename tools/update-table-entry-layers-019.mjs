import fs from 'node:fs';import path from 'node:path';import{output}from './inventory.mjs';
const read=f=>fs.readFileSync(path.join(output,f),'utf8'),write=(f,s)=>fs.writeFileSync(path.join(output,f),s.trimEnd()+'\n'),append=(f,s)=>fs.appendFileSync(path.join(output,f),'\n'+s.trim()+'\n');
const symbols=JSON.parse(read('L3-symbols/symbols.json')).filter(s=>s.path.startsWith('rust/lance-table/'));
const methods=symbols.filter(s=>s.kind==='function/method'&&!s.name.includes('::tests::'));
write('L1-modules/rust-lance-table.md',`# lance-table — entry points and capability policy

**INCOMPLETE.** Ten of54 inventory entries are analyzed, covering1,113 physical lines including the one-line symlink target. Core metadata implementations, row-ID structures, transaction algorithms, system-index contents and IO remain pending. Public declarations coexist with README's internal-use policy. (rust/lance-table/README.md:1-6)

[Entry](../README.md) · [Orientation](../L0-orientation.md) · [Symbols](../L3-symbols/symbol-index.md) · [Behavior](../L3-symbols/behavior-contracts.md) · [Format](../L3-symbols/format-spec.md) · [Scenarios](../L4-crosscutting/scenarios.md)

## Module and build boundaries

The public root exposes feature_flags, format, io, rowids, system_index, transaction and utils. io exposes commit, deletion and manifest. The format facade keeps fragment/index/manifest/row_ids/transaction child paths private and reexports their selected public items, while key_existence and overlay remain public child paths. The exact reexport list, deprecated Index alias and generated pb inclusion are preserved in [format L2](../L2-files/rust/lance-table/src/format.rs.md). (rust/lance-table/src/lib.rs:4-10; rust/lance-table/src/io.rs:4-6; rust/lance-table/src/format.rs:7-50)

~~~text
lance_table (internal-use crate)
|-- feature_flags: capability derivation, support and paired validation
|-- format: metadata facade and generated pb
|-- io: commit / deletion / manifest
|-- rowids: pending implementations
|-- system_index: frag_reuse / mem_wal
|-- transaction: pending implementations
\x60-- utils: ExactSize adapter / pending stream implementation
~~~

The tree is module routing, not a traced execution graph. Its declarations are at rust/lance-table/src/lib.rs:4-10, rust/lance-table/src/system_index.rs:14-15 and rust/lance-table/src/utils.rs:4-10.

Cargo inherits workspace package/dependency versions. Feature dynamodb enables optional AWS DynamoDB/credentials plus lance-io/aws. Feature protoc selects vendored protobuf-src, including docs.rs builds. Four harness-free benchmarks are declared. The build script maps .lance.file to lance_file bindings, enables type names/proto3 optional, selects Bytes for inline row IDs, and compiles table/transaction/rowids schemas. [The symlink](../L2-files/rust/lance-table/protos.md) resolves ./protos to root protos. No build was run. (rust/lance-table/Cargo.toml:1-87; rust/lance-table/build.rs:6-32; rust/lance-table/protos:1-1)

## Exact local callable surface

Rows below preserve declarations and source visibility; trait methods are callable through their implementations. Full external consumers remain pending. All members, constants and test helpers are also in the machine-readable symbol index.

| Symbol | Declaration | Visibility | Evidence |
|---|---|---|---|
${methods.map(s=>`| \x60${s.name}\x60 | \x60${s.signature.replaceAll('|','\\|')}\x60 | ${s.visibility} | [${s.path}:${s.line}-${s.end_line}](../${s.analysis}) |`).join('\n')}

## Capability matrix

Current support is a bit mask. The lower14 bits start enabled, then unstable gates and two reserved bits are cleared. Both word-level predicates use the same mask; manifest-level predicates additionally reject inconsistent bits8/10. This table does not claim that corresponding features are complete or that every producer has been reviewed. (rust/lance-table/src/feature_flags.rs:263-341; rust/lance-table/src/feature_flags.rs:347-378)

| Bit / value | Name suffix after FLAG_ | Current acceptance and derivation |
|---|---|---|
| 0 /1 | DELETION_FILES | Supported; any deletion_file derives both words |
| 1 /2 | STABLE_ROW_IDS | Supported; any row metadata or enable option requires all fragments, then derives both |
| 2 /4 | USE_V2_FORMAT_DEPRECATED | Supported and separately detectable; apply does not restore it |
| 3 /8 | TABLE_CONFIG | Supported; nonempty config derives writer word only |
| 4 /16 | BASE_PATHS | Supported; nonempty map derives both words |
| 5 /32 | DISABLE_TRANSACTION_FILE | Supported; caller option derives writer word only |
| 6 /64 | UNSTABLE_DATA_OVERLAY_FILES | Debug assertions or opt-in env presence; any overlays derive both even when disabled |
| 7 /128 | COVERED_INDEX_METADATA | Supported; apply unions incoming bit from either word and restores both |
| 8 /256 | MIXED_DATA_FILE_VERSIONS | Supported; must be paired; sticky across apply/inherit |
| 9 /512 | FRAG_REUSE_WITH_STABLE_ROW_IDS | Debug assertions only; apply does not preserve or derive this bit |
| 10 /1024 | FRAGMENT_REUSE_INDEX | Supported; must be paired; sticky across apply/inherit |
| 11 /2048 | UNSTABLE_SPILLED_ROW_LINEAGE | Debug assertions or opt-in env presence; fragment detector derives both |
| 12 /4096 | FRAGMENT_TREE | Always rejected; reserved |
| 13 /8192 | INDEPENDENT_COVERING_FIELDS | Always rejected; reserved, dependency-on-bit7 contract documented but not implemented here |
| 14 /16384 and higher | UNKNOWN boundary | Rejected |

Definitions and historical rationale: rust/lance-table/src/feature_flags.rs:9-126. Actual reconstruction: rust/lance-table/src/feature_flags.rs:127-215. Support gating: rust/lance-table/src/feature_flags.rs:234-307. Historical release statements are source comments, not independently verified artifacts.

## State, errors and allocation boundaries

apply validates sticky pairing before mutation, then resets both words and derives content flags. Missing row IDs can fail after reset/deletion writes. Covered metadata is normalized from either word into both, whereas mismatched mixed/tagged-FRI bits fail. inherit validates only source paired bits and ORs8/10 into destination; it neither clears destination nor validates its other bits. ensure validates pairing before returning NotSupported for the selected unsupported word. (rust/lance-table/src/feature_flags.rs:127-232; rust/lance-table/src/feature_flags.rs:309-378)

The gates perform synchronous predicates over existing metadata and environment; apply repeatedly scans fragment lists and does not perform IO. UUID decode checks byte length16, uses a stack array, then Uuid::from_bytes; encode allocates a Vec copy. ExactSize stores a caller count without checking it; an incorrect count invalidates its size promise and can underflow on next. is_system_index recognizes only names, not payload validity. (rust/lance-table/src/feature_flags.rs:146-203; rust/lance-table/src/feature_flags.rs:234-307; rust/lance-table/src/format.rs:57-78; rust/lance-table/src/utils.rs:12-49; rust/lance-table/src/system_index.rs:21-24)

## Source tests and open boundaries

The flag tests cover support masks, pairing, sticky inheritance, overlays, spilled metadata and single-entry base paths. They use in-memory fixtures and assertions; no historical dataset is opened and no environment/build profile is changed by these policy tests. They were read, not executed. (rust/lance-table/src/feature_flags.rs:380-820)

Next analysis must establish metadata parsing/serialization, exact per-file versions, hidden-column semantics, covering emission, caller ordering around apply/ensure and writer atomicity. Comment references to build_manifest/write_manifest_file are leads, not a completed call graph. The five full KB-only acceptance questions remain FAIL.
`);
append('L0-orientation.md',`## Table capability terminology

The [table module](L1-modules/rust-lance-table.md) now documents entry-point routing and capability checks. These are local implementation facts; table IO and transaction behavior remain pending.

| Term | Local meaning | Evidence |
|---|---|---|
| Required feature word | Reader/writer u64 tested against identical build-dependent support mask | rust/lance-table/src/feature_flags.rs:263-307 |
| Sticky paired capability | Exactly mixed-file bit8 or tagged-FRI bit10, preserved after source pairing validation | rust/lance-table/src/feature_flags.rs:114-115; rust/lance-table/src/feature_flags.rs:217-232; rust/lance-table/src/feature_flags.rs:347-378 |
| Experimental opt-in | Environment presence (any value) OR debug_assertions for overlays/spilled lineage; stable-ID FRI only debug_assertions | rust/lance-table/src/feature_flags.rs:117-125; rust/lance-table/src/feature_flags.rs:234-252 |
| Manifest footer identifiers | Table-level0.1 and LANC constants, distinct from unreviewed data-file version selection | rust/lance-table/src/format.rs:52-55 |
| System-index recognition | Exact name equality with FRI or MemWAL name constants, without payload checks | rust/lance-table/src/system_index.rs:21-24 |
| Tagged exact iterator size | Caller-supplied remaining count trusted by Iterator/ExactSizeIterator | rust/lance-table/src/utils.rs:6-49 |
`);
append('L3-symbols/behavior-contracts.md',`## Table capability state transitions

[Detailed module matrix](../L1-modules/rust-lance-table.md) and [full flag source analysis](../L2-files/rust/lance-table/src/feature_flags.rs.md) are authoritative for this slice.

1. apply_feature_flags captures covered bit7 from reader OR writer, validates paired8/10, then resets both words. Invalid pairing returns CorruptFile before writes. (rust/lance-table/src/feature_flags.rs:127-145; rust/lance-table/src/feature_flags.rs:353-378)
2. Derive deletion and stable identity; all fragments must carry row IDs if any does or caller enables them. Empty fragments satisfy all. Missing IDs return InvalidInput after mutation may have occurred. Derive config writer-only, nonempty base-map both, overlays both, spilled-lineage both and disable-transaction writer-only. (rust/lance-table/src/feature_flags.rs:146-207)
3. Restore covered bit into both and sticky8/10 into both. This is not general incoming-bit preservation and does not enforce the current support mask. (rust/lance-table/src/feature_flags.rs:209-215)
4. ensure_can_read_manifest / ensure_can_write_manifest validate paired10 then8, then reject unsupported bits in only their selected word. A raw can_read/write_dataset call lacks pairing validation. Unsupported error text includes the decimal word; inconsistent pairing takes CorruptFile precedence. (rust/lance-table/src/feature_flags.rs:301-378)

There are no async operations or storage writes in these bodies. Importing the Manifest type does not establish thread-safe commit behavior. External caller order remains pending. (rust/lance-table/src/feature_flags.rs:127-378)

ExactSize correctness depends on the supplied size matching the underlying remaining length; None leaves it unchanged and Some decrements. The wrapper does not repair a bad count. UUID decoding has only the16-byte length guard. Neither utility substitutes for higher-level metadata validation. (rust/lance-table/src/utils.rs:12-49; rust/lance-table/src/format.rs:57-78)
`);
append('L3-symbols/format-spec.md',`## Reviewed table entry-point format gates

The generated table protobuf module is included from OUT_DIR; .lance.file fields map to lance_file's generated module, while inline_row_ids is configured as Bytes. Generation consumes shared root schemas through the protos symlink; generated output was not built. (rust/lance-table/src/format.rs:39-50; rust/lance-table/build.rs:15-29; rust/lance-table/protos:1-1)

Manifest footer identifiers are signed16-bit constants major0/minor1 and four-byte ASCII LANC. Actual writer byte order/footer layout is pending IO analysis. pb::Uuid must contain16 bytes; conversion preserves raw ordering without validating version or variant. (rust/lance-table/src/format.rs:52-78)

The feature support gate accepts deprecated v2 bit2; a helper can detect it, but apply_feature_flags does not derive or preserve it. Mixed recognized v2 file-version capability is bit8, validated as paired reader/writer state and retained across apply/inherit. This does not specify exact legal per-file versions or parser behavior. (rust/lance-table/src/feature_flags.rs:15-16; rust/lance-table/src/feature_flags.rs:53-56; rust/lance-table/src/feature_flags.rs:127-232; rust/lance-table/src/feature_flags.rs:343-378)

Fragment-tree bit12 and independent-covering bit13 are declared by schemas but explicitly rejected by this implementation, even with all experimental gates enabled. Bit13's documented dependent bit7/migration contract is therefore not currently writable support in this module. Overlay bit6/spilled-lineage bit11 require debug assertions or named environment presence; stable-ID FRI bit9 requires debug assertions only. (rust/lance-table/src/feature_flags.rs:82-99; rust/lance-table/src/feature_flags.rs:234-291)
`);
append('L4-crosscutting/scenarios.md',`## Local manifest capability walkthrough

This is a complete local gate trace, not the still-missing dataset commit flow. Begin with existing Manifest metadata. apply checks paired8/10 before reset; content determines deletion/stable/config/base/overlay/spill flags. A row-ID inconsistency may leave reset/partial words on error. After success, covered bit7 and sticky8/10 are restored. A later explicit ensure call checks pairing and selected-word support; apply alone can mark an experimental feature unsupported by the current build. No exact external ordering is inferred here. (rust/lance-table/src/feature_flags.rs:127-215; rust/lance-table/src/feature_flags.rs:309-378)

For example, a manifest with overlays but no other requirements receives overlay64 in both words. The read/write capability masks reject64 when debug assertions are disabled and LANCE_ENABLE_UNSTABLE_DATA_OVERLAY_FILES is absent; an empty value still enables the gate. The in-memory source test covers setting the bit, and pure-policy tests cover enabled/disabled masks, not actual disk IO. (rust/lance-table/src/feature_flags.rs:184-194; rust/lance-table/src/feature_flags.rs:234-238; rust/lance-table/src/feature_flags.rs:263-307; rust/lance-table/src/feature_flags.rs:489-555)

KB-only result remains FAIL for all five full questions. These documents now explain some manifest gates, but still lack Dataset::write/compaction entry points and on-disk lifecycle, scalar traits/registration, exact v2 encoders/readers, all Python mappings, and transaction conflict/atomic-commit algorithms.
`);
append('L4-crosscutting/build-and-test.md',`## lance-table package setup (source-only)

Cargo manifest inherits workspace pins/lints; do not infer concrete versions from it. Feature protoc adds protobuf-src and sets build-process PROTOC; docs.rs requests it. Feature dynamodb enables optional AWS dependencies and lance-io/aws. Build script compiles table/transaction/rowids schemas and maps inline row IDs to Bytes. No build, install, test or benchmark was executed. (rust/lance-table/Cargo.toml:1-87; rust/lance-table/build.rs:6-32)

The source flag tests exercise masks via supported_flags_when arguments, metadata-derived flags and pairing errors. Their presence does not establish historical release compatibility or current test success. (rust/lance-table/src/feature_flags.rs:380-820)
`);
append('L4-crosscutting/cookbook.md',`## Interpreting an existing manifest feature word

Use the [capability matrix](../L1-modules/rust-lance-table.md) to decode bits. Word support and paired-manifest validation are separate: the ensure helpers perform both, in pairing-first order. A single known word cannot reveal the counterpart's inconsistency. Do not infer exact v2 data-file versions from deprecated bit2 or table-manifest footer0.1. (rust/lance-table/src/feature_flags.rs:301-378; rust/lance-table/src/format.rs:52-55)

When reading apply_feature_flags callers, track error ownership carefully: the mutable input can already be reset if stable-row-ID validation fails. Caller rollback/discard behavior is not yet analyzed. (rust/lance-table/src/feature_flags.rs:138-171)
`);
append('L4-crosscutting/pitfalls.md',`## Table entry-point pitfalls

- An empty/0-valued environment variable enables overlays or spilled lineage because only presence is tested; stable-ID FRI has no override. (rust/lance-table/src/feature_flags.rs:234-252)
- Flag derivation is not support checking, and failure can leave partial mutation. Only mixed8/tagged-FRI10 are validated as paired; covered7 can be normalized from one word. (rust/lance-table/src/feature_flags.rs:127-215; rust/lance-table/src/feature_flags.rs:353-378)
- A nonempty base-path map, even one entry, derives bit4; the name/comment does not imply a length>1 condition. (rust/lance-table/src/feature_flags.rs:178-182; rust/lance-table/src/feature_flags.rs:650-700)
- Public format types may come through reexports of private modules; the deprecated Index alias is retained. README still disclaims external crate use. (rust/lance-table/src/format.rs:7-37; rust/lance-table/README.md:3-6)
- ExactSize trusts size and does not clear it on early None; do not use it to validate iterator cardinality. (rust/lance-table/src/utils.rs:12-49)
`);
let r=read('README.md').replace('[lance-core](L1-modules/rust-lance-core.md), and','[lance-core](L1-modules/rust-lance-core.md), [lance-table](L1-modules/rust-lance-table.md), and');write('README.md',r);
let state=JSON.parse(read('iteration-state.json'));state.totals=JSON.parse(read('MANIFEST.json')).totals;state.read_not_analyzed=[{path:'rust/lance-table/src/utils/stream.rs',note:'An oversized read was truncated. Partial fragments viewed; file remains pending and must be fully reread in bounded chunks before analysis.'}];state.next='Run VERIFY19 for ten table entry-point files, then continue metadata in objective order.';write('iteration-state.json',JSON.stringify(state,null,2));
console.log({module:'L1-modules/rust-lance-table.md',callables:methods.length,symbols:symbols.length});
