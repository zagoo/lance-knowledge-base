import fs from 'node:fs';
import {root,linesOf} from './inventory.mjs';
const read=p=>fs.readFileSync(p,'utf8'), json=p=>JSON.parse(read(p));
const append=(p,s)=>fs.appendFileSync(p,'\n\n'+s+'\n');
const symbols=json('analysis/iteration-050-symbols.json');
function api(file,prefix){const src=linesOf(read(root+'/'+file));return symbols.filter(s=>s.path===file&&s.visibility.startsWith('public')).sort((a,b)=>a.line-b.line).map(s=>`| \`${s.name.replace(prefix,'')}\` | ${s.kind} | \`${src.slice(s.line-1,s.end_line).join(' ').trim().replaceAll('|','\\|')}\` | [${file}:${s.line}-${s.end_line}](../L2-files/${file}.md) |`).join('\n');}
fs.writeFileSync('L1-modules/rust-lance-table-dynamodb.md',`# DynamoDB external manifest store

All 586 lines are covered. [Table](rust-lance-table.md) · [Commit factory](rust-lance-table-commit.md) · [Generic external protocol](rust-lance-table-external-commit.md) · [Exact source](../L2-files/rust/lance-table/src/io/commit/dynamodb.rs.md) · [Contracts](../L3-symbols/behavior-contracts.md).

DynamoDBExternalManifestStore implements the generic external-manifest record protocol. It issues conditional writes and strongly consistent lookups, while ExternalManifestCommitHandler performs object staging, copying, repair and error classification. It supplies no predecessor identities or authoritative custom history listing: default support=false, identity=None, list_versions=None and forget_version=NotSupported remain inherited. It does not write/delete manifest objects itself. (rust/lance-table/src/io/commit/dynamodb.rs:267-513; rust/lance-table/src/io/commit/external_manifest.rs:216-368)

## API and configuration

| Symbol relative to lance_table::io::commit::dynamodb | Kind | Exact declaration | Evidence |
|---|---|---|---|
${api('rust/lance-table/src/io/commit/dynamodb.rs','lance_table::io::commit::dynamodb::')}

The parent dynamodb feature enables aws-sdk-dynamodb, aws-credential-types and lance-io/aws; the SDK dependency disables default features and enables default-https-client/rt-tokio. Parent s3+ddb routing constructs the external handler. Its SDK builder uses region, supplied credential adapter, no SDK identity cache, standard retry configuration with five total attempts, and optional endpoint. Storage option dynamodb_endpoint takes priority over DYNAMODB_ENDPOINT; the constructed committer is lancedb. Credential adaptation supplies an expiry ten minutes from observation. These are configured values, not measured service guarantees. (rust/lance-table/Cargo.toml:26-28; rust/lance-table/Cargo.toml:63-63; rust/lance-table/src/io/commit.rs:1103-1169; rust/lance-table/src/io/commit.rs:1210-1272)

new_external_store accepts an already configured Arc<Client>, table name and committer name, returning Arc<dyn ExternalManifestStore>. It creates no table. A process-static successful-schema-check cache is keyed ONLY by table-name string, with no client/endpoint/account/region component, expiration or invalidation. A cache hit skips DescribeTable, including after same-named table recreation; concurrent misses can issue duplicate describes. (rust/lance-table/src/io/commit/dynamodb.rs:162-242)

The constructor pops two key-schema elements, requires HASH/base_uri and RANGE/version and rejects unknown/missing roles. It neither inspects leftover elements nor checks AttributeDefinitions scalar types. Thus the documented string/numeric schema is an operational contract beyond this local check. No cache lock spans network IO. (rust/lance-table/src/io/commit/dynamodb.rs:93-109; rust/lance-table/src/io/commit/dynamodb.rs:184-242)

## External row contract

| Attribute | Request/reader contract |
|---|---|
| base_uri | String partition key, caller supplied verbatim |
| version | Numeric sort key containing decimal u64 |
| path | String selected staging or canonical object path |
| committer | String from store construction, overwritten by each put helper |
| size | Numeric u64; absent old rows return unknown, malformed present values fail |
| e_tag | Never emitted by these writers; legacy stored values ignored |
| identity | No field/token produced by this implementation |

Exact keys and write/read evidence: rust/lance-table/src/io/commit/dynamodb.rs:117-160; rust/lance-table/src/io/commit/dynamodb.rs:267-343; rust/lance-table/src/io/commit/dynamodb.rs:423-484. This is a DynamoDB attribute contract, not a new Lance data-file encoding.

Both put helpers send a five-field PutItem. New reservation requires attribute_not_exists(base_uri) AND attribute_not_exists(version); compaction requires both exist. The latter has no old-path, committer, ETag or incarnation condition. Omitting ETag from a replacement item intentionally clears legacy generations under PutItem semantics. Coordination correctness relies on all generic helpers copying the same selected immutable staging bytes and one dataset incarnation owning the prefix. (rust/lance-table/src/io/commit/dynamodb.rs:423-484; rust/lance-table/src/io/commit/external_manifest.rs:117-161)

## Reads, errors and deletion

GetItem and Query builders always request consistent_read(true). Exact get returns path alone without size validation; get_manifest_location validates optional size and classifies path, returning requested version with ETag/identity None. Missing item/path is NotFound; wrong attribute type or malformed numeric text is InvalidInput. No HEAD or manifest decode is performed here. Parent generic resolver supplies current physical metadata and repair. (rust/lance-table/src/io/commit/dynamodb.rs:244-343; rust/lance-table/src/io/commit/external_manifest.rs:568-893)

Latest lookup queries one partition in descending sort-key order with limit 1. Absent/empty items return None; more than one is rejected. Missing version/path is NotFound, malformed size fails before version/path type matching, and version must parse as u64. No attached/detached filter is applied. get_latest_version delegates to the richer method, so even path/version-only callers encounter malformed size errors. (rust/lance-table/src/io/commit/dynamodb.rs:345-421)

Every SDK failure, including conditional-check failure, is warned with request ID and wrapped as core IO. The wrapper keeps the SDK source chain, and Display includes request ID/raw response or no service error. This module does not directly produce CommitConflict from failed conditional requests; ExternalManifestCommitHandler's put-error path does that later and may retain selected staging after an ambiguous error. (rust/lance-table/src/io/commit/dynamodb.rs:33-91; rust/lance-table/src/io/commit/dynamodb.rs:423-484; rust/lance-table/src/io/commit/external_manifest.rs:990-1011; rust/lance-table/src/io/commit/external_manifest.rs:1123-1149)

delete issues ONE query, then sequential unconditional DeleteItem calls for rows whose version attribute is numeric. It ignores pagination and silently skips missing/wrong-type version attributes. Failure can leave a partially deleted set; concurrent replacement is not identity-fenced. It does not remove physical files or invalidate schema-check cache. Consequently this function alone does not establish complete atomic deletion of an arbitrarily large dataset partition. (rust/lance-table/src/io/commit/dynamodb.rs:486-513)

## Evidence and extension limits

Local tests cover only size parsing: absent, 0/1/4096/u64::MAX, malformed numeric strings and wrong S/Bool/Null attributes. They assert message substrings, not SDK behavior or actual service calls. Schema-cache keys, conditions, pagination, cloud retries and recreation races have no local tests here. No tests or network requests were run. (rust/lance-table/src/io/commit/dynamodb.rs:515-586)

Changes to this backend must coordinate the five-field request schema and inherited generic publication/repair semantics. Adding predecessor support requires the entire identity/location/history/retirement contract, not just one conditional expression. Full Dataset retry/cleanup orchestration and namespace-backed stores remain pending. (rust/lance-table/src/io/commit/external_manifest.rs:286-335; rust/lance-table/src/io/commit/dynamodb.rs:267-513)
`);
fs.writeFileSync('L1-modules/rust-lance-table-row-index.md',`# Stable row-ID address index and benchmarks

Complete local scope: index.rs (1,641 lines) and benches/row_id_index.rs (626 lines). [Table](rust-lance-table.md) · [Index source](../L2-files/rust/lance-table/src/rowids/index.rs.md) · [Benchmark source](../L2-files/rust/lance-table/benches/row_id_index.rs.md) · [Contracts](../L3-symbols/behavior-contracts.md) · [Testing](../L4-crosscutting/build-and-test.md).

RowIdIndex maps stable u64 row IDs to physical RowAddress using caller-supplied Arc sequences and deletion vectors. It performs no IO, refresh, dataset validation, locking or async scheduling. Public RowIdIndex and FragmentRowIdIndex are reexported from the private index module through lance_table::rowids. Current implementation filters supplied deletions despite stale type documentation saying tombstoned addresses may be returned. (rust/lance-table/src/rowids.rs:18-30; rust/lance-table/src/rowids/index.rs:29-61; rust/lance-table/src/rowids/index.rs:391-408; rust/lance-table/src/rowids/index.rs:502-593)

## Public declarations

| Symbol relative to lance_table::rowids::index | Kind | Exact declaration | Evidence |
|---|---|---|---|
${api('rust/lance-table/src/rowids/index.rs','lance_table::rowids::index::')}

FragmentRowIdIndex's three public fields permit arbitrary fragment IDs, sequence representations and deletion metadata. There is no constructor validation at this boundary. RowIdIndex::new drops sources with no held IDs, creates per-segment lookup accelerators, sorts fragment envelopes and builds a max-end tree. It then optionally adds a merged range map, retaining the original Arcs/sidecars/tree in either mode. (rust/lance-table/src/rowids/index.rs:56-114; rust/lance-table/src/rowids/index.rs:352-390)

## Representation selection and memory

Choose probing only if estimated merge rows > 1,048,576 and maximum inclusive fragment-envelope overlap <= 64. Plain Range segments in a fragment with no deletions contribute zero to merge rows; any fragment deletion makes every segment's physical length count. Sparse/holed segments count their stored rows. The depth sweep counts overlapping envelopes, not live-ID intersection. Exact row budget or depth 65 chooses merging. These constants express a heuristic, not a measured crossover guarantee. (rust/lance-table/src/rowids/index.rs:15-27; rust/lance-table/src/rowids/index.rs:352-376; rust/lance-table/src/rowids/index.rs:411-435)

Construction is not merely a bounds scan: unsorted Array segments build a sorted/deduplicated (ID,u32 position) directory; bitmap segments scan bytes into u32 prefix ranks every 256 bytes. Array duplicate IDs retain the first physical position in that accelerator, while sequence length remains unchanged. Bitmap ranks count backing bytes, relying on zeroed padding and valid logical shape. Native segment lookups delegate to the encoding. (rust/lance-table/src/rowids/index.rs:253-338)

The end tree pads to a power of two, stores maximum ends and keeps index zero unused. DeepSizeOf accounts for retained Arc contents, sidecar capacities, tree/fragment capacities and an estimated per-merged-entry footprint; it does not measure range-map node allocation overhead or process RSS. Building a merged map adds eager chunk/pair/sort vectors and keeps probe structures too. Physical offsets and rank prefixes use unchecked casts/additions, so valid fragment-size/storage invariants remain caller obligations. (rust/lance-table/src/rowids/index.rs:352-390; rust/lance-table/src/rowids/index.rs:437-548)

## Single and batch lookup

Merged get locates an inclusive range, finds the exact row-ID position and obtains the paired address. Envelopes may contain absent IDs. Probe get bounds candidate starts with partition_point, then walks the max-end tree without a stack, skipping subtrees whose ends cannot cover the ID. Each candidate scans its segments and checks deletion offsets; the traversal continues after a hit to detect a second live fragment entry. (rust/lance-table/src/rowids/index.rs:116-129; rust/lance-table/src/rowids/index.rs:185-304; rust/lance-table/src/rowids/index.rs:391-408)

get_many allocates output in input order, sorts (ID,original position), and preserves duplicate requests. In merged mode a forward chunk walk amortizes range traversal; in probe mode it still performs a separate probe for each sorted ID with no explicit cross-ID cursor. Therefore the doc's O(F+N) statement describes only part of the merged path: total cost includes O(N log N) sorting and segment-specific lookup. Empty input immediately returns an empty Vec. (rust/lance-table/src/rowids/index.rs:131-183)

Cross-chunk duplicates produce Internal during merged construction; probe mode reports Internal only when querying an ID with two surviving fragment-entry hits. Neither path is a complete within-fragment uniqueness validator. FragmentEntry::resolve stops at its first live segment hit, and single nonoverlapping chunk construction has no explicit duplicate check. Supplied deletion vectors allow a moved row to remain physically in an old fragment while only its new live location resolves. (rust/lance-table/src/rowids/index.rs:185-243; rust/lance-table/src/rowids/index.rs:308-319; rust/lance-table/src/rowids/index.rs:391-408; rust/lance-table/src/rowids/index.rs:535-548; rust/lance-table/src/rowids/index.rs:719-743; rust/lance-table/src/rowids/index.rs:1554-1610)

## Building the merged map

For each fragment, track physical offsets across every sequence segment. A no-deletion plain Range maps to arithmetic ID/address ranges without enumerating rows. Other encodings enumerate and sort pairs; deletion-aware decomposition filters entries but advances original physical offsets, retaining holes. Adjacent sequence holes are already absent physical positions, whereas deletion offsets remain physical positions. (rust/lance-table/src/rowids/index.rs:502-593; rust/lance-table/src/rowids/index.rs:1101-1231)

Sort chunks by start, group transitively overlapping inclusive envelopes and preserve nonoverlapping chunks. For an overlapping group, enumerate ID/address pairs, sort by ID, reject duplicates and rebuild compressed segments. Do not infer corruption from envelope overlap or failure to tile its span: sparse live sets and deletion holes are valid. Pair cardinality/nonempty assumptions justify local zip and unwrap; they are not independently checked at every helper. (rust/lance-table/src/rowids/index.rs:612-743)

## Tests and benchmark interpretation

Unit/property fixtures cover heuristic choices, deep overlap, merged/probe duplicate behavior, multi-block bitmap ranks, unsorted physical pairing, sparse/deleted/moved rows, empty inputs and compact Ranges batch ordering. A 25-million-row Range fixture times construction and asserts under one second; its typically<1ms comment was not measured here. All tests were read, not executed. (rust/lance-table/src/rowids/index.rs:745-1641)

The benchmark's environment knobs are BENCH_NUM_ROWS (default 1,000,000), BENCH_SHOT_FRAGMENTS (default 2,000) and optional BENCH_SIZE_STATS_FILE (created/truncated CSV). Numeric parse failures panic; zero/too-small values are not generally validated. Basic setup uses100 equal fragments, discards division remainder, and removes at most every other ID from sequences. Empty deletion vectors mean these are compacted sequence gaps, not physical tombstones; an80% label therefore removes at most roughly50%. (rust/lance-table/benches/row_id_index.rs:40-115; rust/lance-table/benches/row_id_index.rs:205-229; rust/lance-table/benches/row_id_index.rs:317-323)

GetIndex times one get per iteration, but GetHashMap scans every ID0..num_rows per iteration. There is no common throughput normalization, and results are discarded. These raw per-iteration values cannot support a single-lookup performance comparison. CSV RowIdIndex size is serialized sequence bytes; FlatData is16 bytes per live row, neither being exact retained index/HashMap memory. Creation setup is outside timing, constructors/destruction inside. (rust/lance-table/benches/row_id_index.rs:116-277)

Shot-table fixtures use870,000 nominal slots per fragment, groups of16 with a44% compaction draw, shuffled half-span pairs and nominal82% bitmap or1% hole thresholds. Byte modulo100 introduces possible density bias; pairs are not guaranteed to come from different originals. A100,000-query pool samples fragment/segment then rejects holes, not uniformly across all live rows. Build and get/get_many workloads assert Some and normalize lookup throughput. Mask workloads separately compare density and local versus dataset-wide allow sets with black_box. No measurements were run. (rust/lance-table/benches/row_id_index.rs:325-610)

Linux adds PProfProfiler(100, Flamegraph); other platforms run the same six targets without it. The row_id_index Cargo bench disables the test harness. Repository policy requires release-with-debug for actual performance work. Full scan adapter, Dataset cache lifecycle and production caller behavior remain pending. (rust/lance-table/benches/row_id_index.rs:611-626; rust/lance-table/Cargo.toml:70-72; AGENTS.md:27-31)
`);
append('L0-orientation.md',`## Row-ID address lookup and DynamoDB authority

RowIdIndex maps stable IDs to surviving physical addresses through either merged ID/address segments or bounded-overlap fragment probing. It incorporates the supplied deletion vectors; physical row IDs and addresses remain different coordinate systems. [Row-ID index](L1-modules/rust-lance-table-row-index.md). (rust/lance-table/src/rowids/index.rs:29-79; rust/lance-table/src/rowids/index.rs:391-419)

DynamoDBExternalManifestStore is a concrete generic external coordinator with strong GetItem/Query reads and conditional target-row PutItem. It does not implement predecessor record identities. [DynamoDB](L1-modules/rust-lance-table-dynamodb.md). (rust/lance-table/src/io/commit/dynamodb.rs:244-513)

**Bitmap rank directory**: cumulative set-bit counts every256 bitmap bytes, allowing local prefix counting for ID-to-position lookup. **Fragment envelope**: inclusive minimum/maximum ID bounds that can cover holes and do not imply live ownership throughout. (rust/lance-table/src/rowids/index.rs:253-338; rust/lance-table/src/rowids/index.rs:352-435)`);
append('L3-symbols/behavior-contracts.md',`## DynamoDB and row-ID index contracts

DynamoDB conditional failures are core IO at the SDK adapter and become CommitConflict only through the generic handler. Schema-check caching is by table name alone; local validation checks two key names/roles, not scalar types. Dataset-record delete processes one query response without pagination or identity conditions. Do not infer atomic complete cleanup from that function's successful return. (rust/lance-table/src/io/commit/dynamodb.rs:33-91; rust/lance-table/src/io/commit/dynamodb.rs:162-242; rust/lance-table/src/io/commit/dynamodb.rs:486-513; rust/lance-table/src/io/commit/external_manifest.rs:990-1011)

RowIdIndex filters supplied deletion offsets in both representations, preserves physical positions of survivors and allows an ID deleted in an old fragment to resolve in a new one. Duplicate-live detection timing differs: merged build versus requested probe lookup. Within-fragment duplicate validation is incomplete and must not be inferred from the cross-fragment error wording. (rust/lance-table/src/rowids/index.rs:185-243; rust/lance-table/src/rowids/index.rs:391-408; rust/lance-table/src/rowids/index.rs:535-593; rust/lance-table/src/rowids/index.rs:719-743; rust/lance-table/src/rowids/index.rs:1554-1610)

Changing the probe heuristic can move corruption detection from construction to lookup and change retained memory/latency. Sidecars are built before the choice; merged mode retains them. get_many must preserve input order and duplicates and fail on a requested duplicate-live ID, while its sorting cost remains explicit. (rust/lance-table/src/rowids/index.rs:62-183; rust/lance-table/src/rowids/index.rs:306-338; rust/lance-table/src/rowids/index.rs:411-500)`);
append('L3-symbols/format-spec.md',`## DynamoDB rows and nonpersistent row-index structures

DynamoDB requests use base_uri/path/committer strings and numeric version/size. Missing old size means unknown; malformed present size fails. ETag is omitted/ignored and record identity is unsupported. This external attribute schema is separate from manifest bytes. (rust/lance-table/src/io/commit/dynamodb.rs:117-160; rust/lance-table/src/io/commit/dynamodb.rs:299-343; rust/lance-table/src/io/commit/dynamodb.rs:423-484)

RowIdIndex's envelope tree, position arrays, rank directory and merged ID/address map are in-memory derived structures; this file defines no serialization for them. The benchmark's size labeled RowIdIndex serializes input RowIdSequences, not these structures. Preserve persisted sequence contracts separately from freely derived cache representation changes. (rust/lance-table/src/rowids/index.rs:29-60; rust/lance-table/src/rowids/index.rs:253-350; rust/lance-table/benches/row_id_index.rs:142-154)`);
append('L4-crosscutting/scenarios.md',`## DynamoDB generic commit and stable-ID lookup traces

The parent factory builds a configured DynamoDB client/store, whose name-only cache may skip schema validation. Generic external commit writes staging, conditionally inserts its five-field row, copies selected bytes to canonical storage, then conditionally replaces the existing row and cleans staging. SDK failures first become IO; generic put handling/repair then decides conflict or successful canonical recovery. DynamoDB adds no predecessor-conditioned protocol. (rust/lance-table/src/io/commit.rs:1139-1169; rust/lance-table/src/io/commit/dynamodb.rs:162-265; rust/lance-table/src/io/commit/dynamodb.rs:423-484; rust/lance-table/src/io/commit/external_manifest.rs:35-102; rust/lance-table/src/io/commit/external_manifest.rs:963-1011)

Given already loaded fragment ID sequences/deletions, RowIdIndex builds sidecars and envelopes, sorts fragments and selects merged or probe representation. Merged decomposition keeps original physical offsets while filtering tombstones; probe resolves position then checks the deletion vector. get_many sorts a working input copy and restores requested order. This closes the local ID-to-address lookup, not data-file reads or cache invalidation across Dataset versions. (rust/lance-table/src/rowids/index.rs:62-183; rust/lance-table/src/rowids/index.rs:276-435; rust/lance-table/src/rowids/index.rs:502-743)

All five complete KB-only acceptance questions remain FAIL; these additions do not replace pending Dataset writer/compaction, index registration, full format or binding analysis.`);
append('L4-crosscutting/cookbook.md',`## Modify DynamoDB coordination or row-ID lookup

For DynamoDB changes, inspect both the concrete request builders and generic handler recovery. Test schema-cache identity/validation, conditional errors, pagination/partial deletion and table recreation in addition to existing size-parser tests. Predecessor support requires coordinated identity, location, list and retirement hooks; this backend currently inherits unsupported defaults. (rust/lance-table/src/io/commit/dynamodb.rs:162-513; rust/lance-table/src/io/commit/dynamodb.rs:515-586; rust/lance-table/src/io/commit/external_manifest.rs:286-335)

For RowIdIndex changes, maintain two-path parity for sparse/unsorted/bitmap/range inputs, deletion-preserved physical offsets, moved IDs, duplicate-live errors, empty input and get_many order. Account for Array/rank sidecar build cost before comparing heuristics and for retained structures after merging. Extend existing unit/proptest fixtures; benchmark construction, hit/miss and batch lookup with equal units. The existing basic HashMap/get benchmark does not provide equal units. (rust/lance-table/src/rowids/index.rs:62-183; rust/lance-table/src/rowids/index.rs:306-500; rust/lance-table/src/rowids/index.rs:745-1641; rust/lance-table/benches/row_id_index.rs:205-277)`);
append('L4-crosscutting/pitfalls.md',`## Coordinator and lookup pitfalls

- DynamoDB schema-cache hits are name-only and can skip validation for another same-named endpoint/account/table incarnation. Schema validation checks roles/names but not string/number types. (rust/lance-table/src/io/commit/dynamodb.rs:162-242)
- DynamoDB delete is one query plus sequential unconditional deletes; success is not proof all pages/concurrent rows were removed. (rust/lance-table/src/io/commit/dynamodb.rs:486-513)
- RowIdIndex's tombstone-return comment is stale. Actual lookup filters supplied deletions; physical sequence holes and tombstoned offsets have different address effects. (rust/lance-table/src/rowids/index.rs:29-36; rust/lance-table/src/rowids/index.rs:391-408; rust/lance-table/src/rowids/index.rs:1101-1231)
- get_many's O(F+N) wording excludes sorting/segment work and does not describe the probe-mode loop. Probe setup also scans arrays/bitmap bytes. (rust/lance-table/src/rowids/index.rs:131-183; rust/lance-table/src/rowids/index.rs:306-338)
- Benchmark labels80% and RowIdIndex size do not mean80% tombstones or retained index bytes. Basic GetHashMap and GetIndex time different operation counts per iteration. (rust/lance-table/benches/row_id_index.rs:40-70; rust/lance-table/benches/row_id_index.rs:142-186; rust/lance-table/benches/row_id_index.rs:205-277)`);
append('L4-crosscutting/build-and-test.md',`## DynamoDB and row-ID index source evidence

DynamoDB local tests are pure size-attribute parsing; no SDK integration or pagination fixture is present. Row-ID index fixtures cover representation choice and functional parity, including random live/deleted/moved/duplicate rows; one large Range test asserts construction under one second without being executed here. Full performance evidence requires actual prescribed benchmark execution, which this read-only task did not perform. (rust/lance-table/src/io/commit/dynamodb.rs:515-586; rust/lance-table/src/rowids/index.rs:745-1641)

row_id_index benchmark registers six workloads, optional Linux flamegraph profiling, CSV output and environment-controlled synthetic sizes. Its shot-table and bitmap-mask cases have explicit sample/warmup/measurement settings, while basic lookup comparisons use unequal units. Consult the [complete benchmark analysis](../L2-files/rust/lance-table/benches/row_id_index.rs.md) before interpreting output. (rust/lance-table/benches/row_id_index.rs:76-115; rust/lance-table/benches/row_id_index.rs:205-277; rust/lance-table/benches/row_id_index.rs:504-626)`);
const changes=[];
function replace(p,a,b){const s=read(p);if(!s.includes(a))throw Error('Missing '+a);fs.writeFileSync(p,s.replace(a,b));changes.push({path:p,before:a,after:b});}
replace('L1-modules/rust-lance-table.md','Forty-seven of 54 inventory entries are analyzed, covering 35,483 physical lines','Fifty of 54 inventory entries are analyzed, covering 38,336 physical lines');
replace('L1-modules/rust-lance-table.md','complete dataset transaction orchestration, row-ID index contents, external commit backends and stream IO remain pending.','complete Dataset transaction orchestration, namespace commit implementations, stream utilities and three table benchmarks remain pending. Row-ID lookup, its benchmark and DynamoDB are now covered.');
replace('L1-modules/rust-lance-table.md','Concrete DynamoDB/namespace implementations and full Dataset integration remain pending.','DynamoDB is covered in its supplement; namespace implementations and full Dataset integration remain pending.');
replace('L1-modules/rust-lance-table-commit.md','DynamoDB, underlying object stores and complete Dataset conflict/retry/cleanup remain pending.','DynamoDB is covered in its supplement; underlying object stores and complete Dataset conflict/retry/cleanup remain pending.');
replace('L1-modules/rust-lance-table-external-commit.md','Concrete DynamoDB and namespace stores, underlying multipart implementations and the full Dataset conflict/retry/cleanup loop remain pending.','DynamoDB is now covered in its supplement. Namespace stores, underlying multipart implementations and the full Dataset conflict/retry/cleanup loop remain pending.');
append('L1-modules/rust-lance-table.md',`## Concrete coordination and row-ID address lookup

The [DynamoDB supplement](rust-lance-table-dynamodb.md) completes its request/schema/error/cleanup contract. The [row-ID index supplement](rust-lance-table-row-index.md) completes both lookup representations and the related benchmark, including deletion filtering, heuristic costs and comparison limitations. (rust/lance-table/src/io/commit/dynamodb.rs:1-586; rust/lance-table/src/rowids/index.rs:1-1641; rust/lance-table/benches/row_id_index.rs:1-626)`);
fs.writeFileSync('analysis/iteration-050-status-refresh.json',JSON.stringify(changes,null,2)+'\n');
console.log({status_refreshes:changes.length});
