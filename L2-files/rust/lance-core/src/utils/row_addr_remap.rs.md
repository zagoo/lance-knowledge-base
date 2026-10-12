> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-core/src/utils/row_addr_remap.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `f6bb8859b2f5771a44f2ad5ebcb056d15adcdeb8ba761d5ca69dd1aea043ecbf`. Reviewed physical lines: 1-1325.

[Module](../../../../../L1-modules/rust-lance-core-row-mapping.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public in-memory physical-row-address remapping with compact ordered compaction groups, arbitrary direct maps and ordered chains. Private rank representations and integer hashing reduce per-row map storage/lookup work. This module performs no production IO or asynchronous work; tests serialize bitmap data. Public enum/struct declarations and methods are distinguished from private implementation in the symbol supplement. (rust/lance-core/src/utils/row_addr_remap.rs:1-1325)

## Complete range analysis

### Lines 1-48

License and module design: avoid materializing a full old-to-new HashMap for stream-order-preserving compaction. Each old fragment stores retained offsets and the number retained in preceding caller-ordered fragments; each destination stores its caller-ordered start rank and physical row count. Lookup combines zero-based retained rank with the old prefix and locates the destination range. Fragment IDs are not sorted to choose scan/write order; offsets within each fragment are ascending. The documented out-of-range distinction is enforced only when physical row counts are supplied; compact without layout cannot establish that bound (rust/lance-core/src/utils/row_addr_remap.rs:367-389; rust/lance-core/src/utils/row_addr_remap.rs:606-625). Preserve the caller ordering precondition; this file does not verify external writer order. (rust/lance-core/src/utils/row_addr_remap.rs:1-48)

### Lines 49-70

Imports connect DeepSizeOf, RowAddress, core errors, Roaring containers and standard maps/hashers. Public RowAddrRemap derives Clone/Debug/PartialEq/Eq and has Compact and Direct(HashMap<u64,Option<u64>>) variants. The tri-state lookup contract is outer None=unaffected, Some(None)=deleted, Some(Some(addr))=mapped. Derived equality is representation-sensitive. The compact O(number-of-fragments) comment describes layout metadata, not total retained-offset storage; sparse vectors, dense words and compressed bitmaps add payload memory (rust/lance-core/src/utils/row_addr_remap.rs:202-287). (rust/lance-core/src/utils/row_addr_remap.rs:49-70)

### Lines 71-89

Public compact delegates to CompactRowAddrRemap::new and propagates validation errors. Hidden-but-public compact_with_layout delegates with old fragment row counts. direct accepts an arbitrary map without validating source/destination address values or completeness. The two constructors are distinct public APIs; doc(hidden) does not make the layout constructor private. (rust/lance-core/src/utils/row_addr_remap.rs:71-89)

### Lines 90-103

chained filters structurally empty remaps, collects them in input order, returns empty Direct for zero, the sole original remap for one, and CompactRowAddrRemap::chained for two or more. The one-element unwrap is guarded by the vector length. Chains apply version steps in order; they do not flatten address pairs into one HashMap. (rust/lance-core/src/utils/row_addr_remap.rs:90-103)

### Lines 104-138

empty constructs an empty direct map. get delegates without converting absent entries to identity addresses. remap_in_place mutates each optional address; preexisting None stays None, absent lookup leaves the current address unchanged, and present lookup can replace it or delete it. Compact uses its step-major batch method, Direct performs one map lookup per Some input. The operation returns no Result and allocates no output vector. (rust/lance-core/src/utils/row_addr_remap.rs:104-138)

### Lines 139-165

is_empty delegates structural emptiness. affected_fragments collects all Direct key high32 fragment IDs or the compact union. fully_deleted_fragments returns Some(empty bitmap) for an empty Direct map and None for any nonempty Direct map, even if every value is None: partial address coverage cannot prove a whole fragment deleted. Compact supplies its conservative proof. These sets describe mapping coverage, not necessarily only original-version fragment IDs in a chain. (rust/lance-core/src/utils/row_addr_remap.rs:139-165)

### Lines 166-174

DeepSizeOf dispatches to the chosen representation with the shared accounting Context. The enum inline storage is accounted by the enclosing DeepSizeOf convention, and this method measures owned children. (rust/lance-core/src/utils/row_addr_remap.rs:166-174)

### Lines 175-193

Public GroupInput derives Clone/Debug and exposes rewritten_old_row_addrs:RoaringTreemap, old_frag_ids:Vec<u32> in scan order and new_frags:Vec<(u32,u32)> in write order. Hidden public GroupInputWithLayout replaces IDs with (old fragment ID, physical rows) tuples. Both own all inputs. A retained-address set alone omits deleted offsets; the ordered old fragment list establishes which fragments are completely covered. (rust/lance-core/src/utils/row_addr_remap.rs:175-193)

### Lines 194-211

Private threshold ROARING_SIZE_ADVANTAGE_FOR_RANK is 4. Comment favors rank-friendly sparse/dense forms unless compressed Roaring is over four times smaller; this is a design rationale, not a measured benchmark here. Private RankedOffsets derives Clone/Debug/Eq and holds RoaringBitmap, ascending Vec<u32>, or DenseRankedOffsets. Run-preserving insert_range/persisted representations motivate retaining the compressed alternative. (rust/lance-core/src/utils/row_addr_remap.rs:194-211)

### Lines 212-241

RankedOffsets::try_new chooses the offset universe from supplied physical rows, else maximum present offset plus one, else zero. Word count is ceil(universe/64), checked for usize conversion. Sparse estimate is retained count times sizeof(u32); dense estimate is word count times sizeof(u64)+sizeof(u32). Checked conversion/multiplication failures produce contextual InvalidInput. These are selection estimates, not allocator-resident byte measurements. (rust/lance-core/src/utils/row_addr_remap.rs:212-241)

### Lines 242-257

If serialized Roaring bytes times four fits and is strictly less than the smaller rank-friendly estimate, retain Roaring. Otherwise choose Sparse when its estimate is <= dense, including ties and empty input; else build Dense. Overflow in the Roaring comparison only disables that selection, whereas size-estimate overflow earlier returns an error. Physical-offset validation belongs to group construction; this private helper does not independently validate every bitmap offset for the Sparse/Roaring paths (rust/lance-core/src/utils/row_addr_remap.rs:417-441). (rust/lance-core/src/utils/row_addr_remap.rs:242-257)

### Lines 258-287

rank_if_present returns zero-based rank only for a present offset: Roaring contains then inclusive rank minus one, Sparse binary_search index, Dense specialized rank. is_empty tests container emptiness; Dense uses words.is_empty rather than a bit population check, but empty bitmap inputs select Sparse in the constructor. DeepSizeOf estimates Roaring with serialized_size and delegates vectors/dense owned children. (rust/lance-core/src/utils/row_addr_remap.rs:258-287)

### Lines 288-322

DenseRankedOffsets stores bit words and a u32 rank prefix per word. try_new allocates zeroed words, sets each offset bit, errors if its word index is outside the allocated words, then scans words collecting each preceding population count with checked u32 conversion. Prefix accumulation itself uses u64. The word bound alone would not reject an offset in unused bits of a final partial word; the group layout validator provides the exact physical bound. (rust/lance-core/src/utils/row_addr_remap.rs:288-322)

### Lines 323-343

Dense rank finds the containing word, rejects missing word or bit, and returns prefix + popcount(word & (bit-1)). There is no per-query scan or allocation. bit is a single nonzero u64 bit so bit-1 is defined, including bit63. Internal vectors must remain aligned. DeepSizeOf sums the two vectors with the same Context. (rust/lance-core/src/utils/row_addr_remap.rs:323-343)

### Lines 344-365

OldFragmentRemap is private group index, chosen retained-offset representation, preceding-retained-row count and optional physical row count. Only the rank representation has heap children. GroupRemap holds caller-ordered destination tuples (fragment ID, start rank u64, row count u32), with zero-row destinations omitted later. These structs derive Clone/Debug/PartialEq/Eq. (rust/lance-core/src/utils/row_addr_remap.rs:344-365)

### Lines 366-390

GroupRemap::new converts plain old IDs to (ID,None); new_with_layout converts physical counts to Some. Both delegate to the same shared constructor with group index, retained treemap and destination tuples. The plain path intentionally has no source offset bound. (rust/lance-core/src/utils/row_addr_remap.rs:366-390)

### Lines 391-416

new_with_old_frags walks destination tuples in caller order, skips zero-row destinations, appends (ID,current prefix,row count), and adds to total destination rows using ordinary u64 arithmetic. It clones the treemap bitmaps into an IntMap, collects old fragment metadata and creates a seen-fragment set. No destination-ID uniqueness or reserved-ID check occurs here; destination ranges are positional, so duplicate destination IDs can alias resulting physical addresses. (rust/lance-core/src/utils/row_addr_remap.rs:391-416)

### Lines 417-448

For each old fragment, reject duplicate IDs within the group, remove its retained bitmap or substitute empty, and if a physical count exists reject max retained offset >= physical rows. Build RankedOffsets with that bound, record group index/current retained prefix/count metadata and add retained length to the group prefix. Old fragment scan order is the input vector order, independent of IntMap iteration. Constructor failures discard local partially built state. (rust/lance-core/src/utils/row_addr_remap.rs:417-448)

### Lines 449-470

Reject retained addresses whose fragments were never listed (leftover per-fragment map), then require total new physical rows to equal treemap retained cardinality. Error messages include group/fragment or count context; leftover map key ordering is not a promised stable string order. Successful construction returns destination ranges and all old-fragment records, including fragments with no surviving rows. No separate validation proves destination address uniqueness. (rust/lance-core/src/utils/row_addr_remap.rs:449-470)

### Lines 471-492

compute_new_addr binary-searches destination start ranks, selecting the exact start or predecessor insertion index, then packs fragment ID and (rank-start) cast to u32 through RowAddress. No end check is performed here; construction cardinality plus a valid retained rank guarantees a destination exists and the offset fits that destination. Direct misuse of this private helper with an invalid rank could panic or truncate. GroupRemap DeepSizeOf measures the destination tuple vector. (rust/lance-core/src/utils/row_addr_remap.rs:471-492)

### Lines 493-517

Private IntHasher holds u64 state and derives Clone/Copy. Comments justify faster integer hashing for hot internal fragment IDs and explicitly warn that integer writes replace state, so composite keys can collide on their last integer field. The claim that production IDs are internal is an assumption here, not an input validation boundary. Default initializes FNV_OFFSET_BASIS=0xcbf2_9ce4_8422_2325 so the byte fallback distinguishes leading zero bytes. (rust/lance-core/src/utils/row_addr_remap.rs:493-517)

### Lines 518-553

Hasher::finish xors state with state>>32 to spread high bits down. Byte write performs wrapping FNV-1a multiplication by 0x0000_0100_0000_01b3. write_u32/write_u64 overwrite state with value times wrapping golden-ratio constant 0x9E37_79B9_7F4A_7C15; write_usize casts and delegates. IntMap<K,V> aliases HashMap with BuildHasherDefault<IntHasher>; generic composite keys remain equality-correct but may collide heavily. HashMap iteration is not a source ordering contract. (rust/lance-core/src/utils/row_addr_remap.rs:518-553)

### Lines 554-584

CompactRemapStep privately owns group vector and integer-keyed old-fragment map. new creates each GroupRemap, inserts its old-fragment records and rejects any fragment appearing in multiple groups, then appends the group. Validation happens in local owned state before returning. Empty group input yields no groups; an explicitly supplied group with no old/new/retained rows still contributes one structural group. (rust/lance-core/src/utils/row_addr_remap.rs:554-584)

### Lines 585-605

new_with_layout repeats the group-build and cross-group duplicate check using physical row counts. It retains every successfully built group, including a wholly empty group with no old fragments and no retained or destination rows; that case changes structural is_empty without matching any address. A zero-survivor group that lists old fragments is different: known in-bounds offsets return Some(None) (deleted), while offsets outside known physical_rows return None. Errors identify the duplicate fragment and current group. Supporting group construction and lookup: rust/lance-core/src/utils/row_addr_remap.rs:391-470 and rust/lance-core/src/utils/row_addr_remap.rs:606-628. (rust/lance-core/src/utils/row_addr_remap.rs:585-605)

### Lines 606-626

CompactRemapStep::get extracts high32 fragment and low32 offset. Missing fragment returns outer None; an offset >= supplied physical rows also returns None. Missing retained offset inside a covered fragment returns Some(None). A present offset produces preceding-retained-count + zero-based rank, uses group_idx to locate its destination layout, and returns Some(Some(new address)). Without physical counts, every absent offset in a listed fragment is treated as deleted. (rust/lance-core/src/utils/row_addr_remap.rs:606-626)

### Lines 627-653

is_empty checks whether the group vector is empty. fully_deleted_fragments returns None if any old-fragment rank representation is nonempty; otherwise returns every old fragment ID. It proves all affected fragments deleted or gives no proof, never a partial subset. affected_fragments always returns all map keys. DeepSizeOf adds group vector and old-fragment map children. (rust/lance-core/src/utils/row_addr_remap.rs:627-653)

### Lines 654-701

Private RemapStep permits CompactRemapStep and Direct map inside a chain without adding a public RowAddrRemap variant. It derives Clone/Debug/PartialEq/Eq and delegates get/is_empty/affected/proof/DeepSizeOf. Direct get copies the stored optional value; only an empty Direct map can supply a fully-deleted proof, and all its key fragment IDs count as affected. (rust/lance-core/src/utils/row_addr_remap.rs:654-701)

### Lines 702-735

Public CompactRowAddrRemap has a private Vec<RemapStep>. Private new/new_with_layout each wrap one compact step, even if no groups exist. Private chained consumes remaps and flattens existing compact steps in sequence while wrapping each Direct map as a step. Top-level RowAddrRemap::chained already filters structurally empty inputs (rust/lance-core/src/utils/row_addr_remap.rs:91-103). This internal representation preserves the public enum shape. (rust/lance-core/src/utils/row_addr_remap.rs:702-735)

### Lines 736-753

Public CompactRowAddrRemap::get applies steps once in order to the current address. Missing lookup keeps the address and affected flag unchanged; deletion immediately returns Some(None); mapping updates current address and marks affected, even for an identity mapping. Final outer None means no step matched; otherwise Some(Some(final address)). A later step sees an earlier step's destination, and no earlier step is revisited. Address cycles cannot cause an unbounded loop because traversal is over the fixed step vector. (rust/lance-core/src/utils/row_addr_remap.rs:736-753)

### Lines 754-765

Private batch remapping loops over steps first, then mutable row positions. It skips None and absent lookups and writes present optional results. Terminal deletion remains None in later steps. This version-major ordering retains the same address semantics as individual chained get while keeping each step hot across the whole batch; no measured cache/performance guarantee is asserted. (rust/lance-core/src/utils/row_addr_remap.rs:754-765)

### Lines 766-793

Public is_empty requires every internal step structurally empty. affected_fragments unions every step's source fragment IDs, which can include intermediate rewrite versions. fully_deleted_fragments try-folds unions only while every step can prove all its affected fragments deleted; any step containing survivors or a nonempty Direct map returns None, even if the full chain ultimately deletes all original rows. DeepSizeOf delegates the steps vector. (rust/lance-core/src/utils/row_addr_remap.rs:766-793)

### Lines 794-817

The cfg(test) module imports proptest, and addr helper packs fragment/offset through RowAddress. Private ExpectedRankedOffsets distinguishes Sparse/Dense/Roaring. assert_layout_matches_legacy takes one source fragment's bitmap/physical count, destination tuples and expected rank representation; its oracle and checks follow below. (rust/lance-core/src/utils/row_addr_remap.rs:794-817)

### Lines 818-860

The helper collects old retained addresses in treemap order, flattens destination offsets in given order, zips them into an expected HashMap, constructs layout-aware compact remapping and inspects its private rank variant. It compares every physical source offset to expected retained/deleted behavior and checks the physical end offset and adjacent fragment are unaffected. This is a one-source-fragment oracle; it does not establish arbitrary multi-source scan ordering. (rust/lance-core/src/utils/row_addr_remap.rs:818-860)

### Lines 861-876

Sparse rank test uses offsets 1,63,511,9999 in a 10000-row universe, asserts Sparse, rejects missing zero and checks ranks 0 through 3. It crosses word boundaries without invoking dense representation. (rust/lance-core/src/utils/row_addr_remap.rs:861-876)

### Lines 877-896

Dense rank test inserts all offsets below 1024 except multiples of ten, asserts Dense, and compares every offset against expected presence and incrementing rank across words. Final rank equals retained cardinality. (rust/lance-core/src/utils/row_addr_remap.rs:877-896)

### Lines 897-908

Run-compressed test inserts range 100..9900 in a 10000-row universe, asserts Roaring and checks both excluded boundaries plus rank0/rank9799 endpoints. This verifies the representation decision for a contiguous run fixture, not all bitmap container types. (rust/lance-core/src/utils/row_addr_remap.rs:897-908)

### Lines 909-952

Three layout helper cases select Sparse (four offsets split across two destinations), Dense (1024-offset pattern with holes split at 400 retained rows), and Roaring (source offset run100..9900). The Roaring case serializes/deserializes a treemap without explicit optimize and uses destinations31 then30, preserving descending caller order. Each helper checks all source physical offsets and outside-boundary behavior. (rust/lance-core/src/utils/row_addr_remap.rs:909-952)

### Lines 953-994

Compact lookup fixture lists old fragments4 then3, with retained offsets4:{0,2,4},3:{0,1}; destinations10(2),11(0),12(3). A second group lists fragment7 with no survivors. Assertions cover five exact destinations, deleted holes, the all-deleted fragment and an uncovered fragment. Because plain compact has no physical layout, offset5 of fragment4 is also classified deleted; the fixture explicitly demonstrates this difference. (rust/lance-core/src/utils/row_addr_remap.rs:953-994)

### Lines 995-1040

Fragment-set tests chain two wholly deleted fragment groups and expect both affected/proven-deleted unions. A group containing one surviving row plus another all-deleted source returns None for the full-deletion proof while affected_fragments retains both IDs. Chaining it with a deletion group still yields no all-deleted proof. The proof API is conservative and all-or-nothing. (rust/lance-core/src/utils/row_addr_remap.rs:995-1040)

### Lines 1041-1061

A nonempty Direct map containing only one deletion cannot prove the whole source fragment deleted. Chaining two such partial Direct maps remains unable to prove full deletion and must leave unspecified source offsets unaffected; the tests explicitly check those missing entries. (rust/lance-core/src/utils/row_addr_remap.rs:1041-1061)

### Lines 1062-1085

An unknown retained fragment, even with balanced destination row count, is rejected by compact construction; the assertion checks is_err without error category/text. A separate ordering test sends two retained offsets to destinations12 then11 and asserts that exact caller-provided destination order. (rust/lance-core/src/utils/row_addr_remap.rs:1062-1085)

### Lines 1086-1106

Direct-map test includes arbitrary moved offset9,9, an explicit deletion and an unaffected neighboring offset, checks affected fragment IDs; it does not assert nonempty remap status; empty() is structurally empty and returns outer None. No layout or count validation is expected from Direct. (rust/lance-core/src/utils/row_addr_remap.rs:1086-1106)

### Lines 1107-1141

Chained fixture first rewrites source0 offsets0/2 to fragment10 and deletes hole1, then keeps only fragment10 offset1 into fragment20. Source0 offset0 is deleted by the second step; offset1 by the first; offset2 reaches20. Uncovered fragment1 is unchanged. Batch assertions preserve existing None, delete both affected rows, map the survivor and keep an unaffected input. (rust/lance-core/src/utils/row_addr_remap.rs:1107-1141)

### Lines 1142-1177

int_hash_of builds a fresh default IntHasher. The hash test checks repeated scalar values and equal borrowed values hash equally, and requires >512 distinct low-11-bit buckets for each 1024-value strided/dense sample. This is a limited distribution assertion, not a benchmark or adversarial collision guarantee. (rust/lance-core/src/utils/row_addr_remap.rs:1142-1177)

### Lines 1178-1201

Composite-key test explicitly demonstrates equal hashes for integer tuples with identical last fields and for string/integer tuples ending in4. An IntMap of 48x48 integer pairs still stores and retrieves every distinct key and rejects absent keys, confirming equality resolves collisions. It does not establish acceptable performance for composite keys. (rust/lance-core/src/utils/row_addr_remap.rs:1178-1201)

### Lines 1202-1231

Forward/reverse insertion-order fixtures use seven source fragment IDs and one retained row each. They compare affected_fragments and fully_deleted_fragments only. They deliberately do not require row mappings to be independent of old fragment order: old order determines the concatenated scan stream. Preserve this narrow test claim when interpreting its broad test name. (rust/lance-core/src/utils/row_addr_remap.rs:1202-1231)

### Lines 1232-1256

Proptest generates 1–6 candidate fragment descriptors with dense, strided or wrapping-multiplied IDs, 1–23 physical rows each, a 144-element keep bitmap with probability0.75, and 1–4 positive destination gaps. Deduplication preserves first-seen old fragment order. The macro function uses proptest input strategies, not an ordinary callable public signature. (rust/lance-core/src/utils/row_addr_remap.rs:1232-1256)

### Lines 1257-1286

The property fixture walks old fragments in retained caller order and physical offsets ascending, records every covered address and the kept-address sequence, and excludes zero-survivor cases with prop_assume. It creates up to min(gaps,kept rows) destinations, distributes rows by quotient/remainder with earlier extra rows, and assigns IDs starting10000 with positive gaps. Every destination here has positive row count. (rust/lance-core/src/utils/row_addr_remap.rs:1257-1286)

### Lines 1287-1325

An independent Direct oracle maps the kept sequence into destination offsets, checks the sequence is exhausted and inserts explicit deletions for all other covered source rows. Plain compact lookup is compared against it for every covered address, two uncovered fragment IDs and affected-fragment sets. The property does not exercise compact_with_layout, out-of-physical-range offsets in affected fragments, all-deleted inputs, constructor errors or duplicate destination IDs. Module and macro close with no additional production definitions. (rust/lance-core/src/utils/row_addr_remap.rs:1287-1325)

## Interaction and interpretation limits

The complete local implementation and tests were read; tests were not run. Caller graph, compaction stream ordering, persisted mapping selection and FRI traversal remain pending. The documented assumption that compaction preserves stream order is not evidence that every current caller does. The MappingReader adapter treats an absent lookup as invalid input, whereas the remap itself treats it as unaffected; layout-aware construction is necessary to distinguish out-of-physical-range offsets. (rust/lance-core/src/utils/row_addr_remap.rs:4-48; rust/lance-core/src/utils/row_addr_remap.rs:606-625; rust/lance-core/src/utils/fragment_reuse.rs:14-73) Local tests do not cover every constructor failure, maximum address/reserved fragment values, duplicate destination IDs, arbitrary nested chains or allocation bounds. (rust/lance-core/src/utils/row_addr_remap.rs:795-1325)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Compact row-address remapping for compaction.
    5 | //!
    6 | //! Compaction rewrites rows into new fragments, so indices that store physical
    7 | //! row addresses need an old-address to new-address mapping without building an
    8 | //! O(total rows) `HashMap<u64, Option<u64>>`.
    9 | //!
   10 | //! Layout:
   11 | //!
   12 | //! * Old rows: `old_fragment_id -> (old_offsets, old_rows_before)`
   13 | //!     * `old_offsets`: rewritten old row offsets in this old fragment.
   14 | //!     * `old_rows_before`: rewritten row count before this old fragment.
   15 | //! * New rows: ordered new-fragment ranges
   16 | //!   `(fragment_id, new_rows_before, physical_rows)`
   17 | //!     * `new_rows_before`: rewritten row count before this new fragment.
   18 | //!
   19 | //! Lookup:
   20 | //!
   21 | //! * An address whose fragment was not rewritten returns `None`.
   22 | //! * For an address whose fragment was rewritten:
   23 | //!     * Read `(old_offsets, old_rows_before)` from the old-row layout.
   24 | //!     * If `offset` is outside the old fragment's physical row range, return
   25 | //!       `None`; the direct-map representation would not contain that address.
   26 | //!     * If a valid `offset` is not in `old_offsets`, return `Some(None)`
   27 | //!       because the row was deleted.
   28 | //!     * Otherwise, `old_offsets.rank(offset) - 1` is this row's 0-based
   29 | //!       position among rewritten old rows in this old fragment. Add
   30 | //!       `old_rows_before` to get `k`, the row's 0-based position among all
   31 | //!       rewritten old rows.
   32 | //!     * In the new-row layout, find the range
   33 | //!       `(fragment_id, new_rows_before, physical_rows)` where
   34 | //!       `new_rows_before <= k < new_rows_before + physical_rows`.
   35 | //!     * The new address is `(fragment_id, k - new_rows_before)`.
   36 | //!
   37 | //! Ordering:
   38 | //!
   39 | //! Compact remap does not store each old-to-new row mapping. It computes `k`
   40 | //! from the old-row layout, then maps it to the k-th row written to the new
   41 | //! fragments. This requires the reader-to-writer pipeline to preserve row order.
   42 | //!
   43 | //! * `old_frag_ids` must match the order old fragments are read. Within each
   44 | //!   old fragment, rewritten rows are interpreted by ascending old row offset.
   45 | //! * `new_frags` must match the order new rows are written.
   46 | //! * Current compaction satisfies this because it scans selected fragments in
   47 | //!   order and writes the resulting stream without reordering rows.
   48 | 
   49 | use crate::deepsize::{Context, DeepSizeOf};
   50 | use crate::utils::address::RowAddress;
   51 | use crate::{Error, Result};
   52 | use roaring::{RoaringBitmap, RoaringTreemap};
   53 | use std::collections::{HashMap, HashSet};
   54 | use std::hash::{BuildHasherDefault, Hasher};
   55 | use std::mem::size_of;
   56 | 
   57 | /// A queryable row-address remapping with the exact semantics of
   58 | /// `HashMap<u64, Option<u64>>::get(&addr).copied()`:
   59 | ///
   60 | /// * `None` — the address is not affected by this remap (keep it unchanged)
   61 | /// * `Some(None)` — the row was deleted
   62 | /// * `Some(Some(addr))` — the row moved to `addr`
   63 | #[derive(Clone, Debug, PartialEq, Eq)]
   64 | pub enum RowAddrRemap {
   65 |     /// Compact, `O(#fragments)` remap built from per-group rewritten-row
   66 |     /// bitmaps and new-fragment layouts.
   67 |     Compact(CompactRowAddrRemap),
   68 |     /// Full materialized old-to-new address map. Uses `O(#rows)` memory.
   69 |     Direct(HashMap<u64, Option<u64>>),
   70 | }
   71 | 
   72 | impl RowAddrRemap {
   73 |     pub fn compact(groups: impl IntoIterator<Item = GroupInput>) -> Result<Self> {
   74 |         Ok(Self::Compact(CompactRowAddrRemap::new(groups)?))
   75 |     }
   76 | 
   77 |     /// Build a compact remap with physical row counts for exact validation of
   78 |     /// addresses loaded from persisted fragment layouts.
   79 |     #[doc(hidden)]
   80 |     pub fn compact_with_layout(
   81 |         groups: impl IntoIterator<Item = GroupInputWithLayout>,
   82 |     ) -> Result<Self> {
   83 |         Ok(Self::Compact(CompactRowAddrRemap::new_with_layout(groups)?))
   84 |     }
   85 | 
   86 |     /// Build a remap from a fully materialized old-to-new address map.
   87 |     pub fn direct(map: HashMap<u64, Option<u64>>) -> Self {
   88 |         Self::Direct(map)
   89 |     }
   90 | 
   91 |     /// Build an ordered remap chain, flattening nested chains and omitting
   92 |     /// empty remaps.
   93 |     pub fn chained(remaps: impl IntoIterator<Item = Self>) -> Self {
   94 |         let mut remaps = remaps
   95 |             .into_iter()
   96 |             .filter(|remap| !remap.is_empty())
   97 |             .collect::<Vec<_>>();
   98 |         match remaps.len() {
   99 |             0 => Self::empty(),
  100 |             1 => remaps.pop().unwrap(),
  101 |             _ => Self::Compact(CompactRowAddrRemap::chained(remaps)),
  102 |         }
  103 |     }
  104 | 
  105 |     /// An empty remap that leaves every address unchanged.
  106 |     pub fn empty() -> Self {
  107 |         Self::Direct(HashMap::new())
  108 |     }
  109 | 
  110 |     /// Look up `addr`. See [`RowAddrRemap`] for the tri-state return semantics.
  111 |     #[inline]
  112 |     pub fn get(&self, addr: u64) -> Option<Option<u64>> {
  113 |         match self {
  114 |             Self::Compact(c) => c.get(addr),
  115 |             Self::Direct(m) => m.get(&addr).copied(),
  116 |         }
  117 |     }
  118 | 
  119 |     /// Apply this remap to a batch in place.
  120 |     ///
  121 |     /// A `None` input remains deleted. An address missing from a remap remains
  122 |     /// unchanged. Chained remaps are applied version-by-version so this path is
  123 |     /// suitable for bulk index and transaction remapping without materializing
  124 |     /// a composed per-row map.
  125 |     pub fn remap_in_place(&self, row_addrs: &mut [Option<u64>]) {
  126 |         match self {
  127 |             Self::Compact(compact) => compact.remap_in_place(row_addrs),
  128 |             Self::Direct(_) => {
  129 |                 for row_addr in row_addrs {
  130 |                     if let Some(addr) = *row_addr
  131 |                         && let Some(mapped) = self.get(addr)
  132 |                     {
  133 |                         *row_addr = mapped;
  134 |                     }
  135 |                 }
  136 |             }
  137 |         }
  138 |     }
  139 | 
  140 |     pub fn is_empty(&self) -> bool {
  141 |         match self {
  142 |             Self::Compact(c) => c.is_empty(),
  143 |             Self::Direct(m) => m.is_empty(),
  144 |         }
  145 |     }
  146 | 
  147 |     pub fn affected_fragments(&self) -> RoaringBitmap {
  148 |         match self {
  149 |             Self::Compact(c) => c.affected_fragments(),
  150 |             Self::Direct(m) => RoaringBitmap::from_iter(m.keys().map(|addr| (addr >> 32) as u32)),
  151 |         }
  152 |     }
  153 | 
  154 |     /// Returns fragments this remap can prove have no surviving physical rows.
  155 |     ///
  156 |     /// A non-empty direct map cannot provide this proof because it does not
  157 |     /// record the physical row count of each fragment.
  158 |     pub fn fully_deleted_fragments(&self) -> Option<RoaringBitmap> {
  159 |         match self {
  160 |             Self::Compact(c) => c.fully_deleted_fragments(),
  161 |             Self::Direct(m) if m.is_empty() => Some(RoaringBitmap::new()),
  162 |             Self::Direct(_) => None,
  163 |         }
  164 |     }
  165 | }
  166 | 
  167 | impl DeepSizeOf for RowAddrRemap {
  168 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  169 |         match self {
  170 |             Self::Compact(compact) => compact.deep_size_of_children(context),
  171 |             Self::Direct(map) => map.deep_size_of_children(context),
  172 |         }
  173 |     }
  174 | }
  175 | 
  176 | /// Input describing one rewrite group: the old row addresses that were
  177 | /// rewritten plus the fragment layout before/after the rewrite.
  178 | pub struct GroupInput {
  179 |     /// Old row addresses that were read and re-written into the new fragments.
  180 |     pub rewritten_old_row_addrs: RoaringTreemap,
  181 |     /// Old fragment ids covered by this group.
  182 |     pub old_frag_ids: Vec<u32>,
  183 |     /// New fragments produced by this group, as `(fragment_id, physical_rows)`,
  184 |     pub new_frags: Vec<(u32, u32)>,
  185 | }
  186 | 
  187 | /// Internal compact-remap input that includes old-fragment physical row counts.
  188 | #[doc(hidden)]
  189 | pub struct GroupInputWithLayout {
  190 |     pub rewritten_old_row_addrs: RoaringTreemap,
  191 |     pub old_frags: Vec<(u32, u32)>,
  192 |     pub new_frags: Vec<(u32, u32)>,
  193 | }
  194 | 
  195 | /// Keep Roaring only when its serialized representation is substantially
  196 | /// smaller than either rank-friendly representation. This preserves compact
  197 | /// run containers while avoiding Roaring's linear word scan for dense rank.
  198 | /// Binary-copy compaction creates these runs with `RoaringTreemap::insert_range`,
  199 | /// and serialization preserves them without an explicit `optimize()` call.
  200 | const ROARING_SIZE_ADVANTAGE_FOR_RANK: usize = 4;
  201 | 
  202 | #[derive(Clone, Debug, PartialEq, Eq)]
  203 | enum RankedOffsets {
  204 |     /// Retained for highly compressible run layouts.
  205 |     Roaring(RoaringBitmap),
  206 |     /// Sorted rewritten offsets. Binary search returns membership and rank in
  207 |     /// one operation.
  208 |     Sparse(Vec<u32>),
  209 |     /// Dense bits with the number of rewritten rows before every word.
  210 |     Dense(DenseRankedOffsets),
  211 | }
  212 | 
  213 | impl RankedOffsets {
  214 |     fn try_new(offsets: RoaringBitmap, physical_rows: Option<u32>) -> Result<Self> {
  215 |         let universe_rows = physical_rows.map(u64::from).unwrap_or_else(|| {
  216 |             offsets
  217 |                 .max()
  218 |                 .map(|offset| u64::from(offset) + 1)
  219 |                 .unwrap_or(0)
  220 |         });
  221 |         let word_count = usize::try_from(universe_rows.div_ceil(64)).map_err(|_| {
  222 |             Error::invalid_input(format!(
  223 |                 "fragment row range {universe_rows} is too large for compact rank lookup"
  224 |             ))
  225 |         })?;
  226 |         let sparse_bytes = usize::try_from(offsets.len())
  227 |             .ok()
  228 |             .and_then(|len| len.checked_mul(size_of::<u32>()))
  229 |             .ok_or_else(|| {
  230 |                 Error::invalid_input(format!(
  231 |                     "rewritten row count {} is too large for sparse rank lookup",
  232 |                     offsets.len()
  233 |                 ))
  234 |             })?;
  235 |         let dense_bytes = word_count
  236 |             .checked_mul(size_of::<u64>() + size_of::<u32>())
  237 |             .ok_or_else(|| {
  238 |                 Error::invalid_input(format!(
  239 |                     "fragment row range {universe_rows} is too large for dense rank lookup"
  240 |                 ))
  241 |             })?;
  242 |         let rank_friendly_bytes = sparse_bytes.min(dense_bytes);
  243 |         if offsets
  244 |             .serialized_size()
  245 |             .checked_mul(ROARING_SIZE_ADVANTAGE_FOR_RANK)
  246 |             .is_some_and(|roaring_bytes| roaring_bytes < rank_friendly_bytes)
  247 |         {
  248 |             return Ok(Self::Roaring(offsets));
  249 |         }
  250 |         if sparse_bytes <= dense_bytes {
  251 |             return Ok(Self::Sparse(offsets.into_iter().collect()));
  252 |         }
  253 |         Ok(Self::Dense(DenseRankedOffsets::try_new(
  254 |             offsets, word_count,
  255 |         )?))
  256 |     }
  257 | 
  258 |     /// Return the zero-based rank when `offset` was rewritten.
  259 |     #[inline]
  260 |     fn rank_if_present(&self, offset: u32) -> Option<u64> {
  261 |         match self {
  262 |             Self::Roaring(offsets) => offsets.contains(offset).then(|| offsets.rank(offset) - 1),
  263 |             Self::Sparse(offsets) => offsets.binary_search(&offset).ok().map(|rank| rank as u64),
  264 |             Self::Dense(offsets) => offsets.rank_if_present(offset),
  265 |         }
  266 |     }
  267 | 
  268 |     fn is_empty(&self) -> bool {
  269 |         match self {
  270 |             Self::Roaring(offsets) => offsets.is_empty(),
  271 |             Self::Sparse(offsets) => offsets.is_empty(),
  272 |             Self::Dense(offsets) => offsets.words.is_empty(),
  273 |         }
  274 |     }
  275 | }
  276 | 
  277 | impl DeepSizeOf for RankedOffsets {
  278 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  279 |         match self {
  280 |             // Roaring does not expose its allocation capacity. Its serialized
  281 |             // size is a stable proxy for the retained containers.
  282 |             Self::Roaring(offsets) => offsets.serialized_size(),
  283 |             Self::Sparse(offsets) => offsets.deep_size_of_children(context),
  284 |             Self::Dense(offsets) => offsets.deep_size_of_children(context),
  285 |         }
  286 |     }
  287 | }
  288 | 
  289 | #[derive(Clone, Debug, PartialEq, Eq)]
  290 | struct DenseRankedOffsets {
  291 |     words: Vec<u64>,
  292 |     rank_before_word: Vec<u32>,
  293 | }
  294 | 
  295 | impl DenseRankedOffsets {
  296 |     fn try_new(offsets: RoaringBitmap, word_count: usize) -> Result<Self> {
  297 |         let mut words = vec![0u64; word_count];
  298 |         for offset in offsets {
  299 |             let word_idx = (offset / 64) as usize;
  300 |             let Some(word) = words.get_mut(word_idx) else {
  301 |                 return Err(Error::invalid_input(format!(
  302 |                     "rewritten row offset {offset} is outside dense rank word_count={word_count}"
  303 |                 )));
  304 |             };
  305 |             *word |= 1u64 << (offset % 64);
  306 |         }
  307 | 
  308 |         let mut rank_before_word = Vec::with_capacity(word_count);
  309 |         let mut rewritten_rows_before = 0u64;
  310 |         for word in &words {
  311 |             rank_before_word.push(u32::try_from(rewritten_rows_before).map_err(|_| {
  312 |                 Error::invalid_input(format!(
  313 |                     "rewritten row count {rewritten_rows_before} exceeds the row-address offset range"
  314 |                 ))
  315 |             })?);
  316 |             rewritten_rows_before += u64::from(word.count_ones());
  317 |         }
  318 |         Ok(Self {
  319 |             words,
  320 |             rank_before_word,
  321 |         })
  322 |     }
  323 | 
  324 |     #[inline]
  325 |     fn rank_if_present(&self, offset: u32) -> Option<u64> {
  326 |         let word_idx = (offset / 64) as usize;
  327 |         let word = *self.words.get(word_idx)?;
  328 |         let bit = 1u64 << (offset % 64);
  329 |         if word & bit == 0 {
  330 |             return None;
  331 |         }
  332 |         Some(
  333 |             u64::from(self.rank_before_word[word_idx]) + u64::from((word & (bit - 1)).count_ones()),
  334 |         )
  335 |     }
  336 | }
  337 | 
  338 | impl DeepSizeOf for DenseRankedOffsets {
  339 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  340 |         self.words.deep_size_of_children(context)
  341 |             + self.rank_before_word.deep_size_of_children(context)
  342 |     }
  343 | }
  344 | 
  345 | #[derive(Clone, Debug, PartialEq, Eq)]
  346 | struct OldFragmentRemap {
  347 |     group_idx: usize,
  348 |     rewritten_offsets: RankedOffsets,
  349 |     rewritten_rows_before: u64,
  350 |     physical_rows: Option<u32>,
  351 | }
  352 | 
  353 | impl DeepSizeOf for OldFragmentRemap {
  354 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  355 |         self.rewritten_offsets.deep_size_of_children(context)
  356 |     }
  357 | }
  358 | 
  359 | #[derive(Clone, Debug, PartialEq, Eq)]
  360 | struct GroupRemap {
  361 |     /// New fragment ranges as `(fragment_id, rewritten_rows_before, physical_rows)`,
  362 |     /// used to map a rewritten row's group-local index to its new address via binary search.
  363 |     new_frag_row_ranges: Vec<(u32, u64, u32)>,
  364 | }
  365 | 
  366 | impl GroupRemap {
  367 |     fn new(input: GroupInput, group_idx: usize) -> Result<(Self, Vec<(u32, OldFragmentRemap)>)> {
  368 |         Self::new_with_old_frags(
  369 |             input.rewritten_old_row_addrs,
  370 |             input.old_frag_ids.into_iter().map(|id| (id, None)),
  371 |             input.new_frags,
  372 |             group_idx,
  373 |         )
  374 |     }
  375 | 
  376 |     fn new_with_layout(
  377 |         input: GroupInputWithLayout,
  378 |         group_idx: usize,
  379 |     ) -> Result<(Self, Vec<(u32, OldFragmentRemap)>)> {
  380 |         Self::new_with_old_frags(
  381 |             input.rewritten_old_row_addrs,
  382 |             input
  383 |                 .old_frags
  384 |                 .into_iter()
  385 |                 .map(|(id, rows)| (id, Some(rows))),
  386 |             input.new_frags,
  387 |             group_idx,
  388 |         )
  389 |     }
  390 | 
  391 |     fn new_with_old_frags(
  392 |         rewritten_old_row_addrs: RoaringTreemap,
  393 |         old_frags: impl IntoIterator<Item = (u32, Option<u32>)>,
  394 |         new_frags: Vec<(u32, u32)>,
  395 |         group_idx: usize,
  396 |     ) -> Result<(Self, Vec<(u32, OldFragmentRemap)>)> {
  397 |         // `compute_new_addr` maps a rewritten row's group-local index by
  398 |         // accumulating `physical_rows` in the caller-provided write order.
  399 |         let mut new_frag_row_ranges = Vec::with_capacity(new_frags.len());
  400 |         let mut rewritten_rows_before = 0u64;
  401 |         for (frag_id, physical_rows) in new_frags {
  402 |             if physical_rows == 0 {
  403 |                 continue;
  404 |             }
  405 |             new_frag_row_ranges.push((frag_id, rewritten_rows_before, physical_rows));
  406 |             rewritten_rows_before += physical_rows as u64;
  407 |         }
  408 |         let total_new_rows = rewritten_rows_before;
  409 | 
  410 |         let mut per_frag: IntMap<u32, RoaringBitmap> = rewritten_old_row_addrs
  411 |             .bitmaps()
  412 |             .map(|(frag_id, bitmap)| (frag_id, bitmap.clone()))
  413 |             .collect();
  414 |         let old_frags = old_frags.into_iter().collect::<Vec<_>>();
  415 |         let mut frags = Vec::with_capacity(old_frags.len());
  416 |         let mut seen_frag_ids = HashSet::with_capacity(old_frags.len());
  417 |         let mut rewritten_rows_before = 0u64;
  418 |         for &(frag_id, physical_rows) in &old_frags {
  419 |             if !seen_frag_ids.insert(frag_id) {
  420 |                 return Err(Error::invalid_input(format!(
  421 |                     "rewrite group {group_idx} contains old fragment {frag_id} more than once"
  422 |                 )));
  423 |             }
  424 |             let bitmap = per_frag.remove(&frag_id).unwrap_or_default();
  425 |             if let Some(physical_rows) = physical_rows
  426 |                 && bitmap.max().is_some_and(|offset| offset >= physical_rows)
  427 |             {
  428 |                 return Err(Error::invalid_input(format!(
  429 |                     "rewrite group {group_idx} contains a row offset outside old fragment {frag_id} with physical_rows={physical_rows}"
  430 |                 )));
  431 |             }
  432 |             let num_rewritten_rows = bitmap.len();
  433 |             let rewritten_offsets = RankedOffsets::try_new(bitmap, physical_rows)?;
  434 |             frags.push((
  435 |                 frag_id,
  436 |                 OldFragmentRemap {
  437 |                     group_idx,
  438 |                     rewritten_offsets,
  439 |                     rewritten_rows_before,
  440 |                     physical_rows,
  441 |                 },
  442 |             ));
  443 |             rewritten_rows_before += num_rewritten_rows;
  444 |         }
  445 |         // Rewritten old row addresses must reference only listed old fragments.
  446 |         if !per_frag.is_empty() {
  447 |             return Err(Error::invalid_input(format!(
  448 |                 "compaction rewrite group {group_idx} references rewritten old row addresses from fragments {:?} not in its old fragments {:?}",
  449 |                 per_frag.keys().collect::<Vec<_>>(),
  450 |                 old_frags,
  451 |             )));
  452 |         }
  453 | 
  454 |         // Rewritten old rows are mapped positionally onto the new rows, so the
  455 |         // two counts must match exactly
  456 |         let total_rewritten_old_rows = rewritten_old_row_addrs.len();
  457 |         if total_new_rows != total_rewritten_old_rows {
  458 |             return Err(Error::invalid_input(format!(
  459 |                 "compaction rewrite group {group_idx} rewrote {total_rewritten_old_rows} old rows from fragments {:?} but the new fragments hold {total_new_rows} rows",
  460 |                 old_frags,
  461 |             )));
  462 |         }
  463 | 
  464 |         Ok((
  465 |             Self {
  466 |                 new_frag_row_ranges,
  467 |             },
  468 |             frags,
  469 |         ))
  470 |     }
  471 | 
  472 |     fn compute_new_addr(&self, rewritten_row_index: u64) -> u64 {
  473 |         let idx =
  474 |             match self
  475 |                 .new_frag_row_ranges
  476 |                 .binary_search_by(|(_, rewritten_rows_before, _)| {
  477 |                     rewritten_rows_before.cmp(&rewritten_row_index)
  478 |                 }) {
  479 |                 Ok(i) => i,
  480 |                 Err(i) => i - 1,
  481 |             };
  482 |         let (frag_id, rewritten_rows_before, _rows) = self.new_frag_row_ranges[idx];
  483 |         let offset = (rewritten_row_index - rewritten_rows_before) as u32;
  484 |         u64::from(RowAddress::new_from_parts(frag_id, offset))
  485 |     }
  486 | }
  487 | 
  488 | impl DeepSizeOf for GroupRemap {
  489 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  490 |         self.new_frag_row_ranges.deep_size_of_children(context)
  491 |     }
  492 | }
  493 | 
  494 | /// Hasher for this module's integer-keyed maps.
  495 | ///
  496 | /// `remap_row_id` probes `CompactRemapStep::frags` once per remap step per row
  497 | /// address, so at hundreds of millions of rows the default SipHash is a large
  498 | /// share of consolidation CPU. The keys are internal fragment ids, never
  499 | /// attacker-supplied, so the hash-flooding resistance it buys is worth nothing here.
  500 | ///
  501 | /// Only single-integer keys are hashed well: `write_u32`/`write_u64`/`write_usize`
  502 | /// replace the state rather than mixing into it, so a composite key would collide on
  503 | /// its last field alone. Correct either way — `Eq` still decides — but keep these maps
  504 | /// keyed by one integer.
  505 | #[derive(Clone, Copy)]
  506 | struct IntHasher(u64);
  507 | 
  508 | /// FNV-1a offset basis, so the byte fallback does not absorb leading zero bytes.
  509 | const FNV_OFFSET_BASIS: u64 = 0xcbf2_9ce4_8422_2325;
  510 | 
  511 | impl Default for IntHasher {
  512 |     #[inline]
  513 |     fn default() -> Self {
  514 |         Self(FNV_OFFSET_BASIS)
  515 |     }
  516 | }
  517 | 
  518 | impl Hasher for IntHasher {
  519 |     /// Folds the high half down: multiplication only carries upward, so without this
  520 |     /// the low bits — which hashbrown uses to pick the bucket — would ignore the high
  521 |     /// bits of the key, and fragment ids strided by a power of two would all land in
  522 |     /// one bucket.
  523 |     #[inline]
  524 |     fn finish(&self) -> u64 {
  525 |         self.0 ^ (self.0 >> 32)
  526 |     }
  527 | 
  528 |     #[inline]
  529 |     fn write(&mut self, bytes: &[u8]) {
  530 |         // Fallback for key types this module does not use.
  531 |         for &b in bytes {
  532 |             self.0 = (self.0 ^ u64::from(b)).wrapping_mul(0x0000_0100_0000_01b3);
  533 |         }
  534 |     }
  535 | 
  536 |     #[inline]
  537 |     fn write_u32(&mut self, value: u32) {
  538 |         self.0 = u64::from(value).wrapping_mul(0x9E37_79B9_7F4A_7C15);
  539 |     }
  540 | 
  541 |     #[inline]
  542 |     fn write_u64(&mut self, value: u64) {
  543 |         self.0 = value.wrapping_mul(0x9E37_79B9_7F4A_7C15);
  544 |     }
  545 | 
  546 |     #[inline]
  547 |     fn write_usize(&mut self, value: usize) {
  548 |         self.write_u64(value as u64);
  549 |     }
  550 | }
  551 | 
  552 | /// `HashMap` over single-integer keys, hashed with [`IntHasher`].
  553 | type IntMap<K, V> = HashMap<K, V, BuildHasherDefault<IntHasher>>;
  554 | 
  555 | #[derive(Clone, Debug, PartialEq, Eq)]
  556 | struct CompactRemapStep {
  557 |     groups: Vec<GroupRemap>,
  558 |     /// Old fragment id -> its bitmap/rank layout and rewrite group. Size is
  559 |     /// O(#fragments), not rows.
  560 |     frags: IntMap<u32, OldFragmentRemap>,
  561 | }
  562 | 
  563 | impl CompactRemapStep {
  564 |     fn new(groups: impl IntoIterator<Item = GroupInput>) -> Result<Self> {
  565 |         let mut frags = IntMap::default();
  566 |         let mut group_remaps = Vec::new();
  567 |         for input in groups {
  568 |             let gi = group_remaps.len();
  569 |             let (group_remap, group_frags) = GroupRemap::new(input, gi)?;
  570 |             for (frag_id, frag) in group_frags {
  571 |                 if frags.insert(frag_id, frag).is_some() {
  572 |                     return Err(Error::invalid_input(format!(
  573 |                         "old fragment {frag_id} appears in more than one rewrite group, including group {gi}"
  574 |                     )));
  575 |                 }
  576 |             }
  577 |             group_remaps.push(group_remap);
  578 |         }
  579 |         Ok(Self {
  580 |             groups: group_remaps,
  581 |             frags,
  582 |         })
  583 |     }
  584 | 
  585 |     fn new_with_layout(groups: impl IntoIterator<Item = GroupInputWithLayout>) -> Result<Self> {
  586 |         let mut frags = IntMap::default();
  587 |         let mut group_remaps = Vec::new();
  588 |         for input in groups {
  589 |             let gi = group_remaps.len();
  590 |             let (group_remap, group_frags) = GroupRemap::new_with_layout(input, gi)?;
  591 |             for (frag_id, frag) in group_frags {
  592 |                 if frags.insert(frag_id, frag).is_some() {
  593 |                     return Err(Error::invalid_input(format!(
  594 |                         "old fragment {frag_id} appears in more than one rewrite group, including group {gi}"
  595 |                     )));
  596 |                 }
  597 |             }
  598 |             group_remaps.push(group_remap);
  599 |         }
  600 |         Ok(Self {
  601 |             groups: group_remaps,
  602 |             frags,
  603 |         })
  604 |     }
  605 | 
  606 |     #[inline]
  607 |     pub fn get(&self, addr: u64) -> Option<Option<u64>> {
  608 |         let frag = (addr >> 32) as u32;
  609 |         // Not in any rewrite group -> unaffected by this remap.
  610 |         let old_frag = self.frags.get(&frag)?;
  611 |         let offset = addr as u32;
  612 |         if old_frag
  613 |             .physical_rows
  614 |             .is_some_and(|physical_rows| offset >= physical_rows)
  615 |         {
  616 |             return None;
  617 |         }
  618 |         let Some(rewritten_rank) = old_frag.rewritten_offsets.rank_if_present(offset) else {
  619 |             return Some(None);
  620 |         };
  621 |         let rewritten_row_index = old_frag.rewritten_rows_before + rewritten_rank;
  622 |         Some(Some(
  623 |             self.groups[old_frag.group_idx].compute_new_addr(rewritten_row_index),
  624 |         ))
  625 |     }
  626 | 
  627 |     pub fn is_empty(&self) -> bool {
  628 |         self.groups.is_empty()
  629 |     }
  630 | 
  631 |     fn fully_deleted_fragments(&self) -> Option<RoaringBitmap> {
  632 |         // A group with any rewritten row moved at least one row.
  633 |         if self
  634 |             .frags
  635 |             .values()
  636 |             .any(|frag| !frag.rewritten_offsets.is_empty())
  637 |         {
  638 |             return None;
  639 |         }
  640 |         Some(RoaringBitmap::from_iter(self.frags.keys().copied()))
  641 |     }
  642 | 
  643 |     fn affected_fragments(&self) -> RoaringBitmap {
  644 |         RoaringBitmap::from_iter(self.frags.keys().copied())
  645 |     }
  646 | }
  647 | 
  648 | impl DeepSizeOf for CompactRemapStep {
  649 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  650 |         self.groups.deep_size_of_children(context) + self.frags.deep_size_of_children(context)
  651 |     }
  652 | }
  653 | 
  654 | #[derive(Clone, Debug, PartialEq, Eq)]
  655 | enum RemapStep {
  656 |     Compact(CompactRemapStep),
  657 |     Direct(HashMap<u64, Option<u64>>),
  658 | }
  659 | 
  660 | impl RemapStep {
  661 |     fn get(&self, addr: u64) -> Option<Option<u64>> {
  662 |         match self {
  663 |             Self::Compact(compact) => compact.get(addr),
  664 |             Self::Direct(direct) => direct.get(&addr).copied(),
  665 |         }
  666 |     }
  667 | 
  668 |     fn is_empty(&self) -> bool {
  669 |         match self {
  670 |             Self::Compact(compact) => compact.is_empty(),
  671 |             Self::Direct(direct) => direct.is_empty(),
  672 |         }
  673 |     }
  674 | 
  675 |     fn affected_fragments(&self) -> RoaringBitmap {
  676 |         match self {
  677 |             Self::Compact(compact) => compact.affected_fragments(),
  678 |             Self::Direct(direct) => {
  679 |                 RoaringBitmap::from_iter(direct.keys().map(|addr| (addr >> 32) as u32))
  680 |             }
  681 |         }
  682 |     }
  683 | 
  684 |     fn fully_deleted_fragments(&self) -> Option<RoaringBitmap> {
  685 |         match self {
  686 |             Self::Compact(compact) => compact.fully_deleted_fragments(),
  687 |             Self::Direct(direct) if direct.is_empty() => Some(RoaringBitmap::new()),
  688 |             Self::Direct(_) => None,
  689 |         }
  690 |     }
  691 | }
  692 | 
  693 | impl DeepSizeOf for RemapStep {
  694 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  695 |         match self {
  696 |             Self::Compact(compact) => compact.deep_size_of_children(context),
  697 |             Self::Direct(direct) => direct.deep_size_of_children(context),
  698 |         }
  699 |     }
  700 | }
  701 | 
  702 | /// Compact remap backed by per-group rewritten row bitmaps + new-fragment layouts.
  703 | ///
  704 | /// Multiple remaps are retained as ordered private steps so a version chain
  705 | /// does not require another public [`RowAddrRemap`] variant.
  706 | #[derive(Clone, Debug, PartialEq, Eq)]
  707 | pub struct CompactRowAddrRemap {
  708 |     steps: Vec<RemapStep>,
  709 | }
  710 | 
  711 | impl CompactRowAddrRemap {
  712 |     fn new(groups: impl IntoIterator<Item = GroupInput>) -> Result<Self> {
  713 |         Ok(Self {
  714 |             steps: vec![RemapStep::Compact(CompactRemapStep::new(groups)?)],
  715 |         })
  716 |     }
  717 | 
  718 |     fn new_with_layout(groups: impl IntoIterator<Item = GroupInputWithLayout>) -> Result<Self> {
  719 |         Ok(Self {
  720 |             steps: vec![RemapStep::Compact(CompactRemapStep::new_with_layout(
  721 |                 groups,
  722 |             )?)],
  723 |         })
  724 |     }
  725 | 
  726 |     fn chained(remaps: Vec<RowAddrRemap>) -> Self {
  727 |         let mut steps = Vec::with_capacity(remaps.len());
  728 |         for remap in remaps {
  729 |             match remap {
  730 |                 RowAddrRemap::Compact(compact) => steps.extend(compact.steps),
  731 |                 RowAddrRemap::Direct(direct) => steps.push(RemapStep::Direct(direct)),
  732 |             }
  733 |         }
  734 |         Self { steps }
  735 |     }
  736 | 
  737 |     #[inline]
  738 |     pub fn get(&self, addr: u64) -> Option<Option<u64>> {
  739 |         let mut current = addr;
  740 |         let mut was_affected = false;
  741 |         for step in &self.steps {
  742 |             match step.get(current) {
  743 |                 None => {}
  744 |                 Some(None) => return Some(None),
  745 |                 Some(Some(mapped)) => {
  746 |                     current = mapped;
  747 |                     was_affected = true;
  748 |                 }
  749 |             }
  750 |         }
  751 |         was_affected.then_some(Some(current))
  752 |     }
  753 | 
  754 |     fn remap_in_place(&self, row_addrs: &mut [Option<u64>]) {
  755 |         for step in &self.steps {
  756 |             for row_addr in row_addrs.iter_mut() {
  757 |                 if let Some(addr) = *row_addr
  758 |                     && let Some(mapped) = step.get(addr)
  759 |                 {
  760 |                     *row_addr = mapped;
  761 |                 }
  762 |             }
  763 |         }
  764 |     }
  765 | 
  766 |     pub fn is_empty(&self) -> bool {
  767 |         self.steps.iter().all(RemapStep::is_empty)
  768 |     }
  769 | 
  770 |     fn affected_fragments(&self) -> RoaringBitmap {
  771 |         self.steps
  772 |             .iter()
  773 |             .fold(RoaringBitmap::new(), |mut affected, step| {
  774 |                 affected |= step.affected_fragments();
  775 |                 affected
  776 |             })
  777 |     }
  778 | 
  779 |     fn fully_deleted_fragments(&self) -> Option<RoaringBitmap> {
  780 |         self.steps
  781 |             .iter()
  782 |             .try_fold(RoaringBitmap::new(), |mut deleted, step| {
  783 |                 deleted |= step.fully_deleted_fragments()?;
  784 |                 Some(deleted)
  785 |             })
  786 |     }
  787 | }
  788 | 
  789 | impl DeepSizeOf for CompactRowAddrRemap {
  790 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  791 |         self.steps.deep_size_of_children(context)
  792 |     }
  793 | }
  794 | 
  795 | #[cfg(test)]
  796 | mod tests {
  797 |     use super::*;
  798 |     use proptest::{prop_assert, prop_assert_eq};
  799 | 
  800 |     fn addr(frag: u32, offset: u32) -> u64 {
  801 |         u64::from(RowAddress::new_from_parts(frag, offset))
  802 |     }
  803 | 
  804 |     #[derive(Clone, Copy)]
  805 |     enum ExpectedRankedOffsets {
  806 |         Sparse,
  807 |         Dense,
  808 |         Roaring,
  809 |     }
  810 | 
  811 |     fn assert_layout_matches_legacy(
  812 |         frag_id: u32,
  813 |         physical_rows: u32,
  814 |         rewritten_old_row_addrs: RoaringTreemap,
  815 |         new_frags: Vec<(u32, u32)>,
  816 |         expected_representation: ExpectedRankedOffsets,
  817 |     ) {
  818 |         let rewritten_addrs = rewritten_old_row_addrs.iter().collect::<Vec<_>>();
  819 |         let new_addrs = new_frags
  820 |             .iter()
  821 |             .flat_map(|(new_frag_id, rows)| (0..*rows).map(|offset| addr(*new_frag_id, offset)))
  822 |             .collect::<Vec<_>>();
  823 |         assert_eq!(rewritten_addrs.len(), new_addrs.len());
  824 |         let expected_moved = rewritten_addrs
  825 |             .iter()
  826 |             .copied()
  827 |             .zip(new_addrs)
  828 |             .collect::<HashMap<_, _>>();
  829 | 
  830 |         let remap = RowAddrRemap::compact_with_layout([GroupInputWithLayout {
  831 |             rewritten_old_row_addrs,
  832 |             old_frags: vec![(frag_id, physical_rows)],
  833 |             new_frags,
  834 |         }])
  835 |         .unwrap();
  836 | 
  837 |         let RowAddrRemap::Compact(compact) = &remap else {
  838 |             panic!("compact_with_layout must produce a compact remap");
  839 |         };
  840 |         let RemapStep::Compact(step) = &compact.steps[0] else {
  841 |             panic!("compact_with_layout must produce a compact step");
  842 |         };
  843 |         let offsets = &step.frags[&frag_id].rewritten_offsets;
  844 |         assert!(match expected_representation {
  845 |             ExpectedRankedOffsets::Sparse => matches!(offsets, RankedOffsets::Sparse(_)),
  846 |             ExpectedRankedOffsets::Dense => matches!(offsets, RankedOffsets::Dense(_)),
  847 |             ExpectedRankedOffsets::Roaring => matches!(offsets, RankedOffsets::Roaring(_)),
  848 |         });
  849 | 
  850 |         for offset in 0..physical_rows {
  851 |             let old_addr = addr(frag_id, offset);
  852 |             assert_eq!(
  853 |                 remap.get(old_addr),
  854 |                 Some(expected_moved.get(&old_addr).copied()),
  855 |                 "mismatch at ({frag_id}, {offset})"
  856 |             );
  857 |         }
  858 |         assert_eq!(remap.get(addr(frag_id, physical_rows)), None);
  859 |         assert_eq!(remap.get(addr(frag_id + 1, 0)), None);
  860 |     }
  861 | 
  862 |     #[test]
  863 |     fn test_sparse_ranked_offsets() {
  864 |         let offsets = RankedOffsets::try_new(
  865 |             RoaringBitmap::from_iter([1u32, 63, 511, 9_999]),
  866 |             Some(10_000),
  867 |         )
  868 |         .unwrap();
  869 |         assert!(matches!(offsets, RankedOffsets::Sparse(_)));
  870 |         assert_eq!(offsets.rank_if_present(0), None);
  871 |         assert_eq!(offsets.rank_if_present(1), Some(0));
  872 |         assert_eq!(offsets.rank_if_present(63), Some(1));
  873 |         assert_eq!(offsets.rank_if_present(511), Some(2));
  874 |         assert_eq!(offsets.rank_if_present(9_999), Some(3));
  875 |     }
  876 | 
  877 |     #[test]
  878 |     fn test_dense_ranked_offsets_across_words() {
  879 |         let rewritten = (0..1_024u32)
  880 |             .filter(|offset| offset % 10 != 0)
  881 |             .collect::<RoaringBitmap>();
  882 |         let offsets = RankedOffsets::try_new(rewritten.clone(), Some(1_024)).unwrap();
  883 |         assert!(matches!(offsets, RankedOffsets::Dense(_)));
  884 | 
  885 |         let mut expected_rank = 0u64;
  886 |         for offset in 0..1_024 {
  887 |             if rewritten.contains(offset) {
  888 |                 assert_eq!(offsets.rank_if_present(offset), Some(expected_rank));
  889 |                 expected_rank += 1;
  890 |             } else {
  891 |                 assert_eq!(offsets.rank_if_present(offset), None);
  892 |             }
  893 |         }
  894 |         assert_eq!(expected_rank, rewritten.len());
  895 |     }
  896 | 
  897 |     #[test]
  898 |     fn test_run_compressed_ranked_offsets() {
  899 |         let mut rewritten = RoaringBitmap::new();
  900 |         rewritten.insert_range(100..9_900);
  901 |         let offsets = RankedOffsets::try_new(rewritten, Some(10_000)).unwrap();
  902 |         assert!(matches!(offsets, RankedOffsets::Roaring(_)));
  903 |         assert_eq!(offsets.rank_if_present(99), None);
  904 |         assert_eq!(offsets.rank_if_present(100), Some(0));
  905 |         assert_eq!(offsets.rank_if_present(9_899), Some(9_799));
  906 |         assert_eq!(offsets.rank_if_present(9_900), None);
  907 |     }
  908 | 
  909 |     #[test]
  910 |     fn test_compact_with_layout_matches_legacy_across_rank_representations() {
  911 |         assert_layout_matches_legacy(
  912 |             1,
  913 |             10_000,
  914 |             RoaringTreemap::from_iter(
  915 |                 [1u32, 63, 511, 9_999]
  916 |                     .into_iter()
  917 |                     .map(|offset| addr(1, offset)),
  918 |             ),
  919 |             vec![(10, 2), (11, 2)],
  920 |             ExpectedRankedOffsets::Sparse,
  921 |         );
  922 | 
  923 |         let dense = (0..1_024u32)
  924 |             .filter(|offset| offset % 10 != 0)
  925 |             .map(|offset| addr(2, offset))
  926 |             .collect::<RoaringTreemap>();
  927 |         let dense_rows = u32::try_from(dense.len()).unwrap();
  928 |         assert_layout_matches_legacy(
  929 |             2,
  930 |             1_024,
  931 |             dense,
  932 |             vec![(20, 400), (21, dense_rows - 400)],
  933 |             ExpectedRankedOffsets::Dense,
  934 |         );
  935 | 
  936 |         // Binary-copy compaction captures complete fragment ranges with
  937 |         // `RoaringTreemap::insert_range`, then persists that bitmap. The
  938 |         // serialized round trip retains run containers without `optimize()`.
  939 |         let mut captured = RoaringTreemap::new();
  940 |         captured.insert_range(addr(3, 100)..addr(3, 9_900));
  941 |         let mut serialized = Vec::with_capacity(captured.serialized_size());
  942 |         captured.serialize_into(&mut serialized).unwrap();
  943 |         let persisted = RoaringTreemap::deserialize_from(std::io::Cursor::new(serialized)).unwrap();
  944 |         assert_layout_matches_legacy(
  945 |             3,
  946 |             10_000,
  947 |             persisted,
  948 |             vec![(31, 5_000), (30, 4_800)],
  949 |             ExpectedRankedOffsets::Roaring,
  950 |         );
  951 |     }
  952 | 
  953 |     #[test]
  954 |     fn test_compact_lookup() {
  955 |         // Group A: out-of-order old frags [4, 3], split new frags (11 empty),
  956 |         // some deletions. frag 4 (5 rows) keeps 0,2,4; frag 3 keeps 0,1, so the
  957 |         // rewritten rows (4,0)(4,2)(4,4)(3,0)(3,1) go to new frags 10(2), 12(3).
  958 |         // Group B is a fully-deleted fragment.
  959 |         let group_a = GroupInput {
  960 |             rewritten_old_row_addrs: RoaringTreemap::from_iter([
  961 |                 addr(4, 0),
  962 |                 addr(4, 2),
  963 |                 addr(4, 4),
  964 |                 addr(3, 0),
  965 |                 addr(3, 1),
  966 |             ]),
  967 |             old_frag_ids: vec![4, 3],
  968 |             new_frags: vec![(10, 2), (11, 0), (12, 3)],
  969 |         };
  970 |         let group_b = GroupInput {
  971 |             rewritten_old_row_addrs: RoaringTreemap::new(),
  972 |             old_frag_ids: vec![7],
  973 |             new_frags: vec![],
  974 |         };
  975 |         let remap = RowAddrRemap::compact([group_a, group_b]).unwrap();
  976 | 
  977 |         // Moves, in rewrite order; frag 4 comes first despite the larger id.
  978 |         assert_eq!(remap.get(addr(4, 0)), Some(Some(addr(10, 0))));
  979 |         assert_eq!(remap.get(addr(4, 2)), Some(Some(addr(10, 1))));
  980 |         // Rank 2 skips the zero-row new fragment 11 and lands in fragment 12.
  981 |         assert_eq!(remap.get(addr(4, 4)), Some(Some(addr(12, 0))));
  982 |         assert_eq!(remap.get(addr(3, 0)), Some(Some(addr(12, 1))));
  983 |         assert_eq!(remap.get(addr(3, 1)), Some(Some(addr(12, 2))));
  984 |         // Deleted offsets inside a rewritten fragment.
  985 |         assert_eq!(remap.get(addr(4, 1)), Some(None));
  986 |         assert_eq!(remap.get(addr(4, 3)), Some(None));
  987 |         // Covered but fully-deleted fragment -> Some(None), not None.
  988 |         assert_eq!(remap.get(addr(7, 0)), Some(None));
  989 |         // Fragment in no group -> unaffected.
  990 |         assert_eq!(remap.get(addr(9, 0)), None);
  991 |         assert_eq!(remap.get(addr(4, 5)), Some(None));
  992 |         assert!(!remap.is_empty());
  993 |     }
  994 | 
  995 |     #[test]
  996 |     fn test_fragment_sets() {
  997 |         // Each deferred version deletes a different covered fragment. The
  998 |         // chain must retain the flat direct map's union semantics.
  999 |         let first_dead = RowAddrRemap::compact([GroupInput {
 1000 |             rewritten_old_row_addrs: RoaringTreemap::new(),
 1001 |             old_frag_ids: vec![3],
 1002 |             new_frags: vec![],
 1003 |         }])
 1004 |         .unwrap();
 1005 |         let second_dead = RowAddrRemap::compact([GroupInput {
 1006 |             rewritten_old_row_addrs: RoaringTreemap::new(),
 1007 |             old_frag_ids: vec![7],
 1008 |             new_frags: vec![],
 1009 |         }])
 1010 |         .unwrap();
 1011 |         let dead = RowAddrRemap::chained([first_dead.clone(), second_dead]);
 1012 |         assert_eq!(
 1013 |             dead.fully_deleted_fragments(),
 1014 |             Some(RoaringBitmap::from_iter([3u32, 7u32]))
 1015 |         );
 1016 |         assert_eq!(
 1017 |             dead.affected_fragments(),
 1018 |             RoaringBitmap::from_iter([3u32, 7u32])
 1019 |         );
 1020 | 
 1021 |         // At least one rewritten row -> not fully deleted, but both covered
 1022 |         // fragments (including the fully-deleted frag 1) are still affected.
 1023 |         let alive = RowAddrRemap::compact([GroupInput {
 1024 |             rewritten_old_row_addrs: RoaringTreemap::from_iter([addr(0, 0)]),
 1025 |             old_frag_ids: vec![0, 1],
 1026 |             new_frags: vec![(10, 1)],
 1027 |         }])
 1028 |         .unwrap();
 1029 |         assert!(alive.fully_deleted_fragments().is_none());
 1030 |         assert_eq!(
 1031 |             alive.affected_fragments(),
 1032 |             RoaringBitmap::from_iter([0u32, 1u32])
 1033 |         );
 1034 |         assert!(
 1035 |             RowAddrRemap::chained([first_dead, alive])
 1036 |                 .fully_deleted_fragments()
 1037 |                 .is_none()
 1038 |         );
 1039 |     }
 1040 | 
 1041 |     #[test]
 1042 |     fn test_direct_partial_map_is_not_fully_deleted() {
 1043 |         let remap = RowAddrRemap::direct(HashMap::from([(addr(5, 1), None)]));
 1044 | 
 1045 |         assert_eq!(remap.get(addr(5, 0)), None);
 1046 |         assert_eq!(remap.fully_deleted_fragments(), None);
 1047 |     }
 1048 | 
 1049 |     #[test]
 1050 |     fn test_chained_partial_direct_maps_are_not_fully_deleted() {
 1051 |         let remap = RowAddrRemap::chained([
 1052 |             RowAddrRemap::direct(HashMap::from([(addr(5, 1), None)])),
 1053 |             RowAddrRemap::direct(HashMap::from([(addr(6, 1), None)])),
 1054 |         ]);
 1055 | 
 1056 |         assert!(matches!(remap, RowAddrRemap::Compact(_)));
 1057 |         assert_eq!(remap.get(addr(5, 0)), None);
 1058 |         assert_eq!(remap.get(addr(6, 0)), None);
 1059 |         assert_eq!(remap.fully_deleted_fragments(), None);
 1060 |     }
 1061 | 
 1062 |     #[test]
 1063 |     fn test_compact_rejects_rewritten_addrs_outside_old_frags() {
 1064 |         // Rewritten addresses reference frag 5, not in old_frags. The count
 1065 |         // still matches (2 == 2), so only the per-fragment split catches it.
 1066 |         let input = GroupInput {
 1067 |             rewritten_old_row_addrs: RoaringTreemap::from_iter([addr(0, 0), addr(5, 0)]),
 1068 |             old_frag_ids: vec![0],
 1069 |             new_frags: vec![(10, 2)],
 1070 |         };
 1071 |         assert!(RowAddrRemap::compact([input]).is_err());
 1072 |     }
 1073 | 
 1074 |     #[test]
 1075 |     fn test_compact_preserves_explicit_fragment_order() {
 1076 |         let remap = RowAddrRemap::compact([GroupInput {
 1077 |             rewritten_old_row_addrs: RoaringTreemap::from_iter([addr(0, 0), addr(0, 1)]),
 1078 |             old_frag_ids: vec![0],
 1079 |             new_frags: vec![(12, 1), (11, 1)],
 1080 |         }])
 1081 |         .unwrap();
 1082 |         assert_eq!(remap.get(addr(0, 0)), Some(Some(addr(12, 0))));
 1083 |         assert_eq!(remap.get(addr(0, 1)), Some(Some(addr(11, 0))));
 1084 |     }
 1085 | 
 1086 |     #[test]
 1087 |     fn test_direct_and_empty() {
 1088 |         // Direct covers arbitrary maps the compact form can't express.
 1089 |         let mut map = HashMap::new();
 1090 |         map.insert(addr(2, 0), Some(addr(9, 9)));
 1091 |         map.insert(addr(5, 1), None);
 1092 |         let remap = RowAddrRemap::direct(map);
 1093 |         assert_eq!(remap.get(addr(2, 0)), Some(Some(addr(9, 9))));
 1094 |         assert_eq!(remap.get(addr(5, 1)), Some(None));
 1095 |         assert_eq!(remap.get(addr(2, 1)), None);
 1096 |         // affected_fragments over an explicit map: the fragment of every key.
 1097 |         assert_eq!(
 1098 |             remap.affected_fragments(),
 1099 |             RoaringBitmap::from_iter([2u32, 5u32])
 1100 |         );
 1101 | 
 1102 |         let empty = RowAddrRemap::empty();
 1103 |         assert!(empty.is_empty());
 1104 |         assert_eq!(empty.get(addr(0, 0)), None);
 1105 |     }
 1106 | 
 1107 |     #[test]
 1108 |     fn test_chained_lookup_and_batch() {
 1109 |         let first = RowAddrRemap::compact([GroupInput {
 1110 |             rewritten_old_row_addrs: RoaringTreemap::from_iter([addr(0, 0), addr(0, 2)]),
 1111 |             old_frag_ids: vec![0],
 1112 |             new_frags: vec![(10, 2)],
 1113 |         }])
 1114 |         .unwrap();
 1115 |         let second = RowAddrRemap::compact([GroupInput {
 1116 |             rewritten_old_row_addrs: RoaringTreemap::from_iter([addr(10, 1)]),
 1117 |             old_frag_ids: vec![10],
 1118 |             new_frags: vec![(20, 1)],
 1119 |         }])
 1120 |         .unwrap();
 1121 |         let chain = RowAddrRemap::chained([first, second]);
 1122 | 
 1123 |         assert_eq!(chain.get(addr(0, 0)), Some(None));
 1124 |         assert_eq!(chain.get(addr(0, 1)), Some(None));
 1125 |         assert_eq!(chain.get(addr(0, 2)), Some(Some(addr(20, 0))));
 1126 |         assert_eq!(chain.get(addr(1, 0)), None);
 1127 | 
 1128 |         let mut batch = vec![
 1129 |             Some(addr(0, 0)),
 1130 |             Some(addr(0, 1)),
 1131 |             Some(addr(0, 2)),
 1132 |             Some(addr(1, 0)),
 1133 |             None,
 1134 |         ];
 1135 |         chain.remap_in_place(&mut batch);
 1136 |         assert_eq!(
 1137 |             batch,
 1138 |             vec![None, None, Some(addr(20, 0)), Some(addr(1, 0)), None]
 1139 |         );
 1140 |     }
 1141 | 
 1142 |     fn int_hash_of<K: std::hash::Hash>(key: &K) -> u64 {
 1143 |         use std::hash::BuildHasher;
 1144 |         BuildHasherDefault::<IntHasher>::default().hash_one(key)
 1145 |     }
 1146 | 
 1147 |     #[test]
 1148 |     fn test_int_hasher_is_stateless_and_spreads_low_bits() {
 1149 |         // A `BuildHasherDefault` carries no seed, so a key must hash the same at insert,
 1150 |         // at lookup and after a resize; if it did not, a key could become unreachable.
 1151 |         for value in [0u32, 1, 7, 12345, 1 << 31, u32::MAX] {
 1152 |             assert_eq!(int_hash_of(&value), int_hash_of(&value));
 1153 |         }
 1154 |         // `get` borrows the key, so the borrowed form has to agree with the owned one.
 1155 |         let key = 424242u32;
 1156 |         assert_eq!(int_hash_of(&key), int_hash_of(&&key));
 1157 | 
 1158 |         // Multiplication only carries upward, so without the fold in `finish` the low
 1159 |         // bits would ignore the high bits of the key and every fragment id below would
 1160 |         // land in the same bucket.
 1161 |         let buckets = |ids: &[u32]| -> usize {
 1162 |             let table_mask = 2048 - 1;
 1163 |             ids.iter()
 1164 |                 .map(|id| int_hash_of(id) & table_mask)
 1165 |                 .collect::<std::collections::HashSet<_>>()
 1166 |                 .len()
 1167 |         };
 1168 |         let strided: Vec<u32> = (0..1024).map(|i| i << 20).collect();
 1169 |         let dense: Vec<u32> = (0..1024).collect();
 1170 |         assert!(
 1171 |             buckets(&strided) > 512,
 1172 |             "power-of-two-strided fragment ids clustered into {} of 2048 buckets",
 1173 |             buckets(&strided)
 1174 |         );
 1175 |         assert!(buckets(&dense) > 512, "dense fragment ids clustered");
 1176 |     }
 1177 | 
 1178 |     #[test]
 1179 |     fn test_int_hasher_composite_keys_collide_on_last_field() {
 1180 |         // `write_u32`/`write_u64` replace the state instead of mixing into it, so a
 1181 |         // composite key keeps only its last integer field. Pinned because it is the
 1182 |         // documented reason these maps are single-integer-keyed: the map still answers
 1183 |         // correctly, it just degenerates to one bucket.
 1184 |         assert_eq!(int_hash_of(&(1u32, 5u32)), int_hash_of(&(999u32, 5u32)));
 1185 |         assert_eq!(int_hash_of(&("abc", 4u32)), int_hash_of(&("zzzzzz", 4u32)));
 1186 | 
 1187 |         let mut map: IntMap<(u32, u32), u32> = IntMap::default();
 1188 |         for a in 0..48u32 {
 1189 |             for b in 0..48u32 {
 1190 |                 map.insert((a, b), a * 1000 + b);
 1191 |             }
 1192 |         }
 1193 |         assert_eq!(map.len(), 48 * 48);
 1194 |         for a in 0..48u32 {
 1195 |             for b in 0..48u32 {
 1196 |                 assert_eq!(map.get(&(a, b)), Some(&(a * 1000 + b)));
 1197 |             }
 1198 |         }
 1199 |         assert_eq!(map.get(&(48, 0)), None);
 1200 |     }
 1201 | 
 1202 |     #[test]
 1203 |     fn test_outputs_do_not_depend_on_fragment_insertion_order() {
 1204 |         // The maps are hashed with a fixed seed, so their iteration order is stable but
 1205 |         // different from the default hasher's. Nothing observable may depend on it.
 1206 |         let remap_over = |old_frag_ids: Vec<u32>| {
 1207 |             let rewritten = RoaringTreemap::from_iter(old_frag_ids.iter().map(|f| addr(*f, 0)));
 1208 |             let num_rows = old_frag_ids.len() as u32;
 1209 |             RowAddrRemap::compact([GroupInput {
 1210 |                 rewritten_old_row_addrs: rewritten,
 1211 |                 old_frag_ids,
 1212 |                 new_frags: vec![(1000, num_rows)],
 1213 |             }])
 1214 |             .unwrap()
 1215 |         };
 1216 |         let forward = remap_over(vec![3, 1, 4, 1 << 20, 2 << 20, 9, 700_000]);
 1217 |         let reverse = remap_over(vec![700_000, 9, 2 << 20, 1 << 20, 4, 1, 3]);
 1218 | 
 1219 |         // `old_frag_ids` order is load-bearing for the row-to-row mapping, so only the
 1220 |         // set-shaped outputs are comparable across the two.
 1221 |         assert_eq!(
 1222 |             forward.affected_fragments(),
 1223 |             reverse.affected_fragments(),
 1224 |             "affected fragments must not depend on insertion order"
 1225 |         );
 1226 |         assert_eq!(
 1227 |             forward.fully_deleted_fragments(),
 1228 |             reverse.fully_deleted_fragments()
 1229 |         );
 1230 |     }
 1231 | 
 1232 |     proptest::proptest! {
 1233 |         /// The compact remap must answer exactly like a materialized old-to-new map. A
 1234 |         /// wrong answer here silently points an index at the wrong physical row, so this
 1235 |         /// compares the two forms address by address over randomized rewrites.
 1236 |         #[test]
 1237 |         fn test_compact_matches_direct_over_random_rewrites(
 1238 |             // Fragment id shapes: dense, strided by a power of two (the integer hasher's
 1239 |             // worst case), and sparse.
 1240 |             frag_seeds in proptest::collection::vec((0..3usize, 0..64u32), 1..7),
 1241 |             rows_per_frag in 1..24u32,
 1242 |             keep in proptest::collection::vec(proptest::bool::weighted(0.75), 6 * 24),
 1243 |             gaps in proptest::collection::vec(1..4u32, 1..5),
 1244 |         ) {
 1245 |             let mut old_frag_ids: Vec<u32> = Vec::new();
 1246 |             for (shape, seed) in &frag_seeds {
 1247 |                 let frag_id = match shape {
 1248 |                     0 => *seed,
 1249 |                     1 => (*seed + 1) << 20,
 1250 |                     _ => seed.wrapping_mul(7919),
 1251 |                 };
 1252 |                 if !old_frag_ids.contains(&frag_id) {
 1253 |                     old_frag_ids.push(frag_id);
 1254 |                 }
 1255 |             }
 1256 | 
 1257 |             // Rewritten rows are read fragment by fragment in `old_frag_ids` order, and
 1258 |             // by ascending offset within each fragment.
 1259 |             let mut rewritten = RoaringTreemap::new();
 1260 |             let mut read_order: Vec<u64> = Vec::new();
 1261 |             let mut covered: Vec<u64> = Vec::new();
 1262 |             for (frag_index, frag_id) in old_frag_ids.iter().enumerate() {
 1263 |                 for offset in 0..rows_per_frag {
 1264 |                     covered.push(addr(*frag_id, offset));
 1265 |                     if keep[frag_index * rows_per_frag as usize + offset as usize] {
 1266 |                         rewritten.insert(addr(*frag_id, offset));
 1267 |                         read_order.push(addr(*frag_id, offset));
 1268 |                     }
 1269 |                 }
 1270 |             }
 1271 |             let total_rewritten = read_order.len() as u32;
 1272 |             proptest::prop_assume!(total_rewritten > 0);
 1273 | 
 1274 |             // Spread the rewritten rows over ascending new fragment ids, every fragment
 1275 |             // non-empty so the row counts still add up.
 1276 |             let parts = gaps.len().min(total_rewritten as usize);
 1277 |             let base = total_rewritten / parts as u32;
 1278 |             let remainder = total_rewritten % parts as u32;
 1279 |             let mut new_frags: Vec<(u32, u32)> = Vec::with_capacity(parts);
 1280 |             let mut new_frag_id = 10_000u32;
 1281 |             for (part, gap) in gaps.iter().take(parts).enumerate() {
 1282 |                 let rows = base + u32::from((part as u32) < remainder);
 1283 |                 new_frags.push((new_frag_id, rows));
 1284 |                 new_frag_id += gap;
 1285 |             }
 1286 | 
 1287 |             // The same mapping, materialized one address at a time.
 1288 |             let mut direct: HashMap<u64, Option<u64>> = HashMap::new();
 1289 |             let mut read_order_iter = read_order.iter();
 1290 |             for (new_frag_id, rows) in &new_frags {
 1291 |                 for offset in 0..*rows {
 1292 |                     let old = read_order_iter.next().unwrap();
 1293 |                     direct.insert(*old, Some(addr(*new_frag_id, offset)));
 1294 |                 }
 1295 |             }
 1296 |             prop_assert!(read_order_iter.next().is_none());
 1297 |             for old in &covered {
 1298 |                 direct.entry(*old).or_insert(None);
 1299 |             }
 1300 | 
 1301 |             let compact = RowAddrRemap::compact([GroupInput {
 1302 |                 rewritten_old_row_addrs: rewritten,
 1303 |                 old_frag_ids: old_frag_ids.clone(),
 1304 |                 new_frags,
 1305 |             }])
 1306 |             .unwrap();
 1307 |             let direct = RowAddrRemap::direct(direct);
 1308 | 
 1309 |             for old in &covered {
 1310 |                 prop_assert_eq!(
 1311 |                     compact.get(*old),
 1312 |                     direct.get(*old),
 1313 |                     "address {:#x} in fragments {:?}",
 1314 |                     old,
 1315 |                     old_frag_ids
 1316 |                 );
 1317 |             }
 1318 |             // Fragments no group covers are left alone.
 1319 |             for frag_id in [0xFFFF_FFF0u32, 0x7EEE_EEEE] {
 1320 |                 prop_assert_eq!(compact.get(addr(frag_id, 0)), None);
 1321 |             }
 1322 |             prop_assert_eq!(compact.affected_fragments(), direct.affected_fragments());
 1323 |         }
 1324 |     }
 1325 | }
``````
