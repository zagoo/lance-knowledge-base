> **V2.1 navigation and contract layer.** Source reading is permitted. Production contracts retained from iteration 85 remain valid at the recorded snapshot. Historical line-count/test-coverage statements are provenance, not completeness requirements. Use [V2.1 protocol](../V21-PROTOCOL.md) and CORE-MANIFEST.json for current scope.

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

# Stable row-ID address index and benchmarks

Complete local scope: index.rs (1,641 lines) and benches/row_id_index.rs (626 lines). [Table](rust-lance-table.md) · [Index source](../L2-files/rust/lance-table/src/rowids/index.rs.md) · [Benchmark source](../L2-files/rust/lance-table/benches/row_id_index.rs.md) · [Contracts](../L3-symbols/behavior-contracts.md) · [Testing](../L4-crosscutting/build-and-test.md).

RowIdIndex maps stable u64 row IDs to physical RowAddress using caller-supplied Arc sequences and deletion vectors. It performs no IO, refresh, dataset validation, locking or async scheduling. Public RowIdIndex and FragmentRowIdIndex are reexported from the private index module through lance_table::rowids. Current implementation filters supplied deletions despite stale type documentation saying tombstoned addresses may be returned. (rust/lance-table/src/rowids.rs:18-30; rust/lance-table/src/rowids/index.rs:29-61; rust/lance-table/src/rowids/index.rs:391-408; rust/lance-table/src/rowids/index.rs:502-602)

## Public declarations

| Symbol relative to lance_table::rowids::index | Kind | Exact declaration | Evidence |
|---|---|---|---|
| `RowIdIndex` | struct | `pub struct RowIdIndex {` | [rust/lance-table/src/rowids/index.rs:45-45](../L2-files/rust/lance-table/src/rowids/index.rs.md) |
| `FragmentRowIdIndex` | struct | `pub struct FragmentRowIdIndex {` | [rust/lance-table/src/rowids/index.rs:56-56](../L2-files/rust/lance-table/src/rowids/index.rs.md) |
| `FragmentRowIdIndex::fragment_id` | field | `pub fragment_id: u32,` | [rust/lance-table/src/rowids/index.rs:57-57](../L2-files/rust/lance-table/src/rowids/index.rs.md) |
| `FragmentRowIdIndex::row_id_sequence` | field | `pub row_id_sequence: Arc<RowIdSequence>,` | [rust/lance-table/src/rowids/index.rs:58-58](../L2-files/rust/lance-table/src/rowids/index.rs.md) |
| `FragmentRowIdIndex::deletion_vector` | field | `pub deletion_vector: Arc<DeletionVector>,` | [rust/lance-table/src/rowids/index.rs:59-59](../L2-files/rust/lance-table/src/rowids/index.rs.md) |
| `RowIdIndex::new` | function | `pub fn new(fragment_indices: &[FragmentRowIdIndex]) -> Result<Self> {` | [rust/lance-table/src/rowids/index.rs:64-64](../L2-files/rust/lance-table/src/rowids/index.rs.md) |
| `RowIdIndex::get` | function | `pub fn get(&self, row_id: u64) -> Result<Option<RowAddress>> {` | [rust/lance-table/src/rowids/index.rs:124-124](../L2-files/rust/lance-table/src/rowids/index.rs.md) |
| `RowIdIndex::get_many` | function | `pub fn get_many(&self, row_ids: &[u64]) -> Result<Vec<Option<RowAddress>>> {` | [rust/lance-table/src/rowids/index.rs:142-142](../L2-files/rust/lance-table/src/rowids/index.rs.md) |
| `<RowIdIndex as DeepSizeOf>` | implementation | `impl DeepSizeOf for RowIdIndex {` | [rust/lance-table/src/rowids/index.rs:454-454](../L2-files/rust/lance-table/src/rowids/index.rs.md) |
| `<RowIdIndex as DeepSizeOf>::deep_size_of_children` | function | `fn deep_size_of_children(&self, context: &mut lance_core::deepsize::Context) -> usize {` | [rust/lance-table/src/rowids/index.rs:457-457](../L2-files/rust/lance-table/src/rowids/index.rs.md) |

FragmentRowIdIndex's three public fields permit arbitrary fragment IDs, sequence representations and deletion metadata. There is no constructor validation at this boundary. RowIdIndex::new drops sources with no held IDs, creates per-segment lookup accelerators, sorts fragment envelopes and builds a max-end tree. It then optionally adds a merged range map, retaining the original Arcs/sidecars/tree in either mode. (rust/lance-table/src/rowids/index.rs:56-114; rust/lance-table/src/rowids/index.rs:352-390)

## Representation selection and memory

Choose probing only if estimated merge rows > 1,048,576 and maximum inclusive fragment-envelope overlap <= 64. Plain Range segments in a fragment with no deletions contribute zero to merge rows; any fragment deletion makes every segment's physical length count. Sparse/holed segments count their stored rows. The depth sweep counts overlapping envelopes, not live-ID intersection. Exact row budget or depth 65 chooses merging. These constants express a heuristic, not a measured crossover guarantee. (rust/lance-table/src/rowids/index.rs:15-27; rust/lance-table/src/rowids/index.rs:352-376; rust/lance-table/src/rowids/index.rs:411-435)

Construction is not merely a bounds scan: unsorted Array segments build a sorted/deduplicated (ID,u32 position) directory; bitmap segments scan bytes into u32 prefix ranks every 256 bytes. Array duplicate IDs retain the first physical position in that accelerator, while sequence length remains unchanged. Bitmap ranks count backing bytes, relying on zeroed padding and valid logical shape. Native segment lookups delegate to the encoding. (rust/lance-table/src/rowids/index.rs:253-338)

The end tree pads to a power of two, stores maximum ends and keeps index zero unused. DeepSizeOf accounts for retained Arc contents, sidecar capacities, tree/fragment capacities and an estimated per-merged-entry footprint; it does not measure range-map node allocation overhead or process RSS. Building a merged map adds eager chunk/pair/sort vectors and keeps probe structures too. Physical offsets and rank prefixes use unchecked casts/additions, so valid fragment-size/storage invariants remain caller obligations. (rust/lance-table/src/rowids/index.rs:352-390; rust/lance-table/src/rowids/index.rs:437-548)

## Single and batch lookup

Merged get locates an inclusive range, finds the exact row-ID position and obtains the paired address. Envelopes may contain absent IDs. Probe get bounds candidate starts with partition_point, then walks the max-end tree without a stack, skipping subtrees whose ends cannot cover the ID. Each candidate scans its segments and checks deletion offsets; the traversal continues after a hit to detect a second live fragment entry. (rust/lance-table/src/rowids/index.rs:116-129; rust/lance-table/src/rowids/index.rs:185-304; rust/lance-table/src/rowids/index.rs:391-408)

get_many allocates output in input order, sorts (ID,original position), and preserves duplicate requests. In merged mode a forward chunk walk amortizes range traversal; in probe mode it still performs a separate probe for each sorted ID with no explicit cross-ID cursor. Therefore the doc's O(F+N) statement describes only part of the merged path: total cost includes O(N log N) sorting and segment-specific lookup. Empty input immediately returns an empty Vec. (rust/lance-table/src/rowids/index.rs:131-183)

Cross-chunk duplicates produce Internal during merged construction; probe mode reports Internal only when querying an ID with two surviving fragment-entry hits. Neither path is a complete within-fragment uniqueness validator. FragmentEntry::resolve stops at its first live segment hit, and single nonoverlapping chunk construction has no explicit duplicate check. Supplied deletion vectors allow a moved row to remain physically in an old fragment while only its new live location resolves. (rust/lance-table/src/rowids/index.rs:185-243; rust/lance-table/src/rowids/index.rs:308-319; rust/lance-table/src/rowids/index.rs:391-408; rust/lance-table/src/rowids/index.rs:535-548; rust/lance-table/src/rowids/index.rs:728-752; rust/lance-table/src/rowids/index.rs:1657-1713)

## Building the merged map

For each fragment, track physical offsets across every sequence segment. A no-deletion plain Range maps to arithmetic ID/address ranges without enumerating rows. Other encodings enumerate and sort pairs; deletion-aware decomposition filters entries but advances original physical offsets, retaining holes. Adjacent sequence holes are already absent physical positions, whereas deletion offsets remain physical positions. (rust/lance-table/src/rowids/index.rs:502-602; rust/lance-table/src/rowids/index.rs:1204-1334)

Sort chunks by start, group transitively overlapping inclusive envelopes and preserve nonoverlapping chunks. For an overlapping group, enumerate ID/address pairs, sort by ID, reject duplicates and rebuild compressed segments. Do not infer corruption from envelope overlap or failure to tile its span: sparse live sets and deletion holes are valid. Pair cardinality/nonempty assumptions justify local zip and unwrap; they are not independently checked at every helper. (rust/lance-table/src/rowids/index.rs:621-752)


Historical test catalogs from this supplement are retained in the [archive](archive/rust-lance-table-row-index-historical-sections.md); they are outside current coverage.
