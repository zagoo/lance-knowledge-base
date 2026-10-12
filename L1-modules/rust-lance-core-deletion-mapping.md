> **V2.1 navigation and contract layer.** Source reading is permitted. Production contracts retained from iteration 85 remain valid at the recorded snapshot. Historical line-count/test-coverage statements are provenance, not completeness requirements. Use [V2.1 protocol](../V21-PROTOCOL.md) and CORE-MANIFEST.json for current scope.

# Deletion vectors and single-rewrite mapping

**Two files analyzed; full deletion IO, FRI graph traversal and dataset compaction remain INCOMPLETE.** [Core overview](rust-lance-core.md) · [Orientation](../L0-orientation.md) · [Symbols](../L3-symbols/symbol-index.md) · [Scenarios](../L4-crosscutting/scenarios.md).

RowAddrRemap and stable-partition primitives are now documented in the [row-mapping supplement](rust-lance-core-row-mapping.md); their local validation is distinct from persisted IO. (rust/lance-core/src/utils/row_addr_remap.rs:72-89; rust/lance-core/src/utils/stable_partition.rs:49-60)

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
| `<lance_core::utils::deletion::DeletionVector as DeepSizeOf>::<implementation>` | implementation | `impl DeepSizeOf for DeletionVector {` | [rust/lance-core/src/utils/deletion.rs:23-23](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `<lance_core::utils::deletion::DeletionVector as DeepSizeOf>::deep_size_of_children` | method/function | `fn deep_size_of_children(&self, context: &mut Context) -> usize {` | [rust/lance-core/src/utils/deletion.rs:24-24](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `<lance_core::utils::deletion::DeletionVector as Extend<u32>>::<implementation>` | implementation | `impl Extend<u32> for DeletionVector {` | [rust/lance-core/src/utils/deletion.rs:210-210](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `<lance_core::utils::deletion::DeletionVector as Extend<u32>>::extend` | method/function | `fn extend<T: IntoIterator<Item = u32>>(&mut self, iter: T) {` | [rust/lance-core/src/utils/deletion.rs:211-211](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `<lance_core::utils::deletion::DeletionVector as From<RoaringBitmap>>::<implementation>` | implementation | `impl From<RoaringBitmap> for DeletionVector {` | [rust/lance-core/src/utils/deletion.rs:285-285](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `<lance_core::utils::deletion::DeletionVector as From<RoaringBitmap>>::from` | method/function | `fn from(bitmap: RoaringBitmap) -> Self {` | [rust/lance-core/src/utils/deletion.rs:286-286](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `<lance_core::utils::deletion::DeletionVector as FromIterator<u32>>::<implementation>` | implementation | `impl FromIterator<u32> for DeletionVector {` | [rust/lance-core/src/utils/deletion.rs:277-277](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `<lance_core::utils::deletion::DeletionVector as FromIterator<u32>>::from_iter` | method/function | `fn from_iter<T: IntoIterator<Item = u32>>(iter: T) -> Self {` | [rust/lance-core/src/utils/deletion.rs:278-278](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `<lance_core::utils::deletion::DeletionVector as IntoIterator>::<implementation>` | implementation | `impl IntoIterator for DeletionVector {` | [rust/lance-core/src/utils/deletion.rs:258-258](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `<lance_core::utils::deletion::DeletionVector as IntoIterator>::into_iter` | method/function | `fn into_iter(self) -> Self::IntoIter {` | [rust/lance-core/src/utils/deletion.rs:262-262](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `<lance_core::utils::deletion::DeletionVector as IntoIterator>::IntoIter` | associated type | `type IntoIter = Box<dyn Iterator<Item = Self::Item> + Send>;` | [rust/lance-core/src/utils/deletion.rs:259-259](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `<lance_core::utils::deletion::DeletionVector as IntoIterator>::Item` | associated type | `type Item = u32;` | [rust/lance-core/src/utils/deletion.rs:260-260](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `<lance_core::utils::deletion::DeletionVector as PartialEq>::<implementation>` | implementation | `impl PartialEq for DeletionVector {` | [rust/lance-core/src/utils/deletion.rs:195-195](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `<lance_core::utils::deletion::DeletionVector as PartialEq>::eq` | method/function | `fn eq(&self, other: &Self) -> bool {` | [rust/lance-core/src/utils/deletion.rs:196-196](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `<lance_core::utils::fragment_reuse::OrderedCompactionMapping as DeepSizeOf>::<implementation>` | implementation | `impl DeepSizeOf for OrderedCompactionMapping {` | [rust/lance-core/src/utils/fragment_reuse.rs:55-55](../L2-files/rust/lance-core/src/utils/fragment_reuse.rs.md) |
| `<lance_core::utils::fragment_reuse::OrderedCompactionMapping as DeepSizeOf>::deep_size_of_children` | method/function | `fn deep_size_of_children(&self, context: &mut Context) -> usize {` | [rust/lance-core/src/utils/fragment_reuse.rs:56-56](../L2-files/rust/lance-core/src/utils/fragment_reuse.rs.md) |
| `<lance_core::utils::fragment_reuse::OrderedCompactionMapping as MappingReader>::<implementation>` | implementation; async_trait | `impl MappingReader for OrderedCompactionMapping {` | [rust/lance-core/src/utils/fragment_reuse.rs:62-62](../L2-files/rust/lance-core/src/utils/fragment_reuse.rs.md) |
| `<lance_core::utils::fragment_reuse::OrderedCompactionMapping as MappingReader>::remap_row_id` | method/function | `async fn remap_row_id(&self, row_id: u64) -> Result<Option<u64>> {` | [rust/lance-core/src/utils/fragment_reuse.rs:63-63](../L2-files/rust/lance-core/src/utils/fragment_reuse.rs.md) |
| `<lance_core::utils::fragment_reuse::OrderedCompactionMapping as MappingReader>::remap_row_ids` | method/function | `async fn remap_row_ids(&self, row_ids: &[u64]) -> Result<Vec<Option<u64>>> {` | [rust/lance-core/src/utils/fragment_reuse.rs:67-67](../L2-files/rust/lance-core/src/utils/fragment_reuse.rs.md) |
| `<RoaringBitmap as From<&lance_core::utils::deletion::DeletionVector>>::<implementation>` | implementation | `impl From<&DeletionVector> for RoaringBitmap {` | [rust/lance-core/src/utils/deletion.rs:185-185](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `<RoaringBitmap as From<&lance_core::utils::deletion::DeletionVector>>::from` | method/function | `fn from(value: &DeletionVector) -> Self {` | [rust/lance-core/src/utils/deletion.rs:186-186](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `lance_core::utils::deletion::DeletionVector` | enum | `pub enum DeletionVector {` | [rust/lance-core/src/utils/deletion.rs:16-16](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `lance_core::utils::deletion::DeletionVector::Bitmap` | variant | `Bitmap(RoaringBitmap),` | [rust/lance-core/src/utils/deletion.rs:20-20](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `lance_core::utils::deletion::DeletionVector::build_predicate` | method/function | `pub fn build_predicate(&self, row_addrs: std::slice::Iter<u64>) -> Option<BooleanArray> {` | [rust/lance-core/src/utils/deletion.rs:108-108](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `lance_core::utils::deletion::DeletionVector::contains` | method/function | `pub fn contains(&self, i: u32) -> bool {` | [rust/lance-core/src/utils/deletion.rs:47-47](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `lance_core::utils::deletion::DeletionVector::contains_range` | method/function | `pub fn contains_range(&self, mut range: Range<u32>) -> bool {` | [rust/lance-core/src/utils/deletion.rs:55-55](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `lance_core::utils::deletion::DeletionVector::into_sorted_iter` | method/function | `pub fn into_sorted_iter(self) -> Box<dyn Iterator<Item = u32> + Send + 'static> {` | [rust/lance-core/src/utils/deletion.rs:79-79](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `lance_core::utils::deletion::DeletionVector::is_empty` | method/function | `pub fn is_empty(&self) -> bool {` | [rust/lance-core/src/utils/deletion.rs:43-43](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `lance_core::utils::deletion::DeletionVector::iter` | method/function | `pub fn iter(&self) -> Box<dyn Iterator<Item = u32> + Send + '_> {` | [rust/lance-core/src/utils/deletion.rs:71-71](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `lance_core::utils::deletion::DeletionVector::len` | method/function | `pub fn len(&self) -> usize {` | [rust/lance-core/src/utils/deletion.rs:35-35](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `lance_core::utils::deletion::DeletionVector::NoDeletions` | variant | `NoDeletions,` | [rust/lance-core/src/utils/deletion.rs:18-18](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `lance_core::utils::deletion::DeletionVector::Set` | variant | `Set(HashSet<u32>),` | [rust/lance-core/src/utils/deletion.rs:19-19](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `lance_core::utils::deletion::DeletionVector::to_sorted_iter` | method/function | `pub fn to_sorted_iter<'a>(&'a self) -> Box<dyn Iterator<Item = u32> + Send + 'a> {` | [rust/lance-core/src/utils/deletion.rs:95-95](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `lance_core::utils::deletion::OffsetMapper` | struct | `pub struct OffsetMapper {` | [rust/lance-core/src/utils/deletion.rs:140-140](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `lance_core::utils::deletion::OffsetMapper::map_offset` | method/function | `pub fn map_offset(&mut self, offset: u32) -> u32 {` | [rust/lance-core/src/utils/deletion.rs:155-155](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `lance_core::utils::deletion::OffsetMapper::new` | method/function | `pub fn new(dv: Arc<DeletionVector>) -> Self {` | [rust/lance-core/src/utils/deletion.rs:147-147](../L2-files/rust/lance-core/src/utils/deletion.rs.md) |
| `lance_core::utils::fragment_reuse::MappingReader` | trait; async_trait | `pub trait MappingReader: Send + Sync + std::fmt::Debug + DeepSizeOf {` | [rust/lance-core/src/utils/fragment_reuse.rs:21-21](../L2-files/rust/lance-core/src/utils/fragment_reuse.rs.md) |
| `lance_core::utils::fragment_reuse::MappingReader::remap_row_id` | method/function | `async fn remap_row_id(&self, row_id: u64) -> Result<Option<u64>>;` | [rust/lance-core/src/utils/fragment_reuse.rs:23-23](../L2-files/rust/lance-core/src/utils/fragment_reuse.rs.md) |
| `lance_core::utils::fragment_reuse::MappingReader::remap_row_ids` | method/function | `async fn remap_row_ids(&self, row_ids: &[u64]) -> Result<Vec<Option<u64>>> {` | [rust/lance-core/src/utils/fragment_reuse.rs:26-26](../L2-files/rust/lance-core/src/utils/fragment_reuse.rs.md) |
| `lance_core::utils::fragment_reuse::OrderedCompactionMapping` | struct | `pub struct OrderedCompactionMapping {` | [rust/lance-core/src/utils/fragment_reuse.rs:38-38](../L2-files/rust/lance-core/src/utils/fragment_reuse.rs.md) |
| `lance_core::utils::fragment_reuse::OrderedCompactionMapping::new` | method/function | `pub fn new(remap: Arc<RowAddrRemap>) -> Self {` | [rust/lance-core/src/utils/fragment_reuse.rs:44-44](../L2-files/rust/lance-core/src/utils/fragment_reuse.rs.md) |

## Files

- [deletion.rs](../L2-files/rust/lance-core/src/utils/deletion.rs.md), rust/lance-core/src/utils/deletion.rs:1-522.
- [fragment_reuse.rs](../L2-files/rust/lance-core/src/utils/fragment_reuse.rs.md), rust/lance-core/src/utils/fragment_reuse.rs:1-144.
