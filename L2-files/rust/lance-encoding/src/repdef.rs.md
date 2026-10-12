> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-encoding/src/repdef.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `959b016490c5dc61331642bc62caeafc2fef061801542b74df18489a3534b68e`. Reviewed physical lines: 1-4083.

[Module](../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Structural repetition/definition normalization, dense serialization and row budgets, sparse delegation, slicing, Arrow structural reconstruction and full-zip control words. (rust/lance-encoding/src/repdef.rs:1-4083)

## Complete range analysis

### Lines 1-42

License and conceptual repetition example. Lance numbers from the leaf, unlike Parquet; these utilities do not promise Parquet compatibility. Dense entries include null/empty-list placeholders and can outnumber leaf values. The example final row says start of outermost list but prints repetition0, inconsistent with its own start rule and the actual serializer. (rust/lance-encoding/src/repdef.rs:1-42)

### Lines 43-83

Definition0 means valid; increasing levels indicate nulls farther outward. Parent nulls erase irrelevant child validity. RLE and byte zipping are motivations, not compression performed by this module, and claims of definition compactness assume the described nesting/bit representation. (rust/lance-encoding/src/repdef.rs:43-83)

### Lines 84-126

Module map identifies builder, serializer, composite reconstruction, slicer and full-zip words. Dependencies are Arrow buffers/offset traits, LanceBuffer, bit-width helper, core errors and sparse-plan/unraveler delegation. No IO or async work here. Public LevelBuffer aliases Vec<u16>. (rust/lance-encoding/src/repdef.rs:84-126)

### Lines 127-152

Crate-internal MiniBlockRepDefSplit records relative top-row start/count, dense level range and visible leaf start/count. Budget enum is WithinBudget, RequiresPageSplit(vector), or SingleRowOverBudget(level count); the last is a successful planning result, not an Error. (rust/lance-encoding/src/repdef.rs:127-152)

### Lines 153-165

Private SPECIAL_THRESHOLD is u16::MAX/2=32767, despite comment referring to a top bit. Construction tags invisible specials by adding32767 and recognizes strictly greater values; final normalization subtracts it. Nesting/cumulative definition counts must stay within arithmetic and sentinel assumptions; there is no checked depth validator here. (rust/lance-encoding/src/repdef.rs:153-165)

### Lines 166-194

OffsetDesc shares normalized i64 offsets via Arc and stores optional bitmap, empty flag, slot count and special count. ValidityDesc stores bitmap/count. FslDesc also stores dimension. Optional bitmap presence, not actual null count, determines has_nulls for these raw descriptors. (rust/lance-encoding/src/repdef.rs:166-194)

### Lines 195-223

Private cloned RawRepDef has Offsets/Validity/Fsl alternatives. Crate-internal borrowed NormalizedStructuralLayer exposes corresponding offsets/bitmap/dimension/num_slots views. FSL is a validity-like layer, not a repetition-producing list interpretation. (rust/lance-encoding/src/repdef.rs:195-223)

### Lines 224-265

NormalizedStructuralPlan privately owns concatenated raw layers plus dense_all_valid. layers returns an exact-size iterator borrowing descriptors and maps num_values to num_slots. This representation is shared with sparse planning, whose complete implementation remains pending. (rust/lance-encoding/src/repdef.rs:224-265)

### Lines 266-289

to_serializer fast path when every builder is empty preserves one AllValidItem per layer and emits no buffers/bits, zero cursors and no FSL flag. This fast path only applies to plain no-null Validity layers, not offsets or FSL. (rust/lance-encoding/src/repdef.rs:266-289)

### Lines 290-322

Otherwise reserve leaf-slot count plus all recorded specials, sum repetition/definition maxima as u16, derive inclusive bit widths from leading zeros and allocate SerializerContext. Visit normalized layers outer-to-inner. Arithmetic uses ordinary additions and assumes consistent counts/depth; no overflow Result boundary. (rust/lance-encoding/src/repdef.rs:290-322)

### Lines 323-341

Plan serialize builds dense output; serialize_with_miniblock_repdef_budget calls an FnOnce budget callback only if nonzero level bits exist, then returns dense output plus budget classification. num_rows and num_values are caller-supplied counts used only on eligible planning paths. (rust/lance-encoding/src/repdef.rs:323-341)

### Lines 342-368

RawRepDef helpers report bitmap presence, slot count, and offsets-only special count. These helpers are private and do not validate the bitmap or child lengths. (rust/lance-encoding/src/repdef.rs:342-368)

### Lines 369-400

max_def uses one level for present validity and one for valid empty lists; nonnullable item/FSL consumes0. Every variable-list offsets layer consumes one repetition level. Sums can exceed u16 assumptions without explicit validation. (rust/lance-encoding/src/repdef.rs:369-400)

### Lines 401-441

Public SerializedRepDefs exposes optional Arc-u16 rep/def buffers, leaf-first meanings and optional visibility threshold; private has_fsl records actual FSL processing. Free max_visible_level sums definition increments strictly before first variable-list meaning; no lists yields full max_def. Null items can own leaf slots; null/empty lists cannot. (rust/lance-encoding/src/repdef.rs:401-441)

### Lines 442-480

Associated visibility returns None without list meanings. Public new converts Vec buffers to Arc, computes threshold and assumes has_fsl=false; crate constructor accepts explicit FSL flag. Neither validates lengths, level bounds or meaning consistency. (rust/lance-encoding/src/repdef.rs:442-480)

### Lines 481-508

Public empty accepts any meanings but unconditionally sets both buffers and visibility to None and has_fsl=false. rep_slicer/def_slicer return independent borrowed-state cursors only for present buffers. Crate has_fixed_size_list_levels exposes private flag. (rust/lance-encoding/src/repdef.rs:481-508)

### Lines 509-545

RepDefSlicer borrows immutable serialized metadata, shares selected Arc via LanceBuffer reinterpretation and counts u16 levels by byte length/2. all_levels returns the whole buffer, not the remainder; no compressed-level representation supported. (rust/lance-encoding/src/repdef.rs:509-545)

### Lines 546-560

slice_rest returns all remaining bytes and exhausts cursor. Final slice must use it because slice_next stops at its last requested visible value and leaves following invisible entries for the next call. (rust/lance-encoding/src/repdef.rs:546-560)

### Lines 561-591

slice_next without list threshold or def buffer takes exactly N levels. Otherwise scan defs until N entries are <= visibility, including encountered invisible entries. It assumes enough values and aligned buffers, using unwrap/slice panics; zero request consumes nothing. Separate rep/def slicers must receive identical requests. (rust/lance-encoding/src/repdef.rs:561-591)

### Lines 592-625

Six public DefinitionInterpretation variants encode all-valid item/list, nullable item/list, emptyable list and combined nullable-emptyable list. Their definition increments are0,0,1,1,1,2 respectively; ordering of the meaning vector is leaf-first after normal serialization. (rust/lance-encoding/src/repdef.rs:592-625)

### Lines 626-646

is_all_valid returns true also for EmptyableList because absence of nulls differs from absence of definition levels. is_list recognizes the four variable-list variants only. FSL is represented as an item validity meaning. (rust/lance-encoding/src/repdef.rs:626-646)

### Lines 647-705

Private SerializerContext owns active/spare u16 rep and def vectors, cursors and FSL flag. Allocate two zeroed vectors of full planned length for each nonzero maximum: up to8 bytes per planned dense level before final Arc conversion, excluding inputs/metadata. Spare buffers avoid aliasing reads/writes. (rust/lance-encoding/src/repdef.rs:647-705)

### Lines 706-738

checkout_def returns current cumulative def, subtracts this layer increment and pushes outer-first meaning. record_offsets reserves current rep then decrements it. Combined list assigns null=current-1, empty=current; other list modes consume0 or1 def. Apply list validity before expanding offsets. (rust/lance-encoding/src/repdef.rs:706-738)

### Lines 739-776

record_offsets reads active and writes spare buffers. Empty normalized offsets0 set current_len0 and return. No-def path requires every list length positive, preserves incoming nonzero outer rep on the first child, sets other children rep0 and swaps rep buffers. It assumes exact normalized slot relationships. (rust/lance-encoding/src/repdef.rs:739-776)

### Lines 777-819

With defs, carry higher tagged specials unchanged; each ordinary list uses incoming outer rep or current rep. Valid nonempty list expands first entry plus zero/zero continuation entries, empty valid list inserts tagged empty level, any existing null promotes to tagged invisible special. (rust/lance-encoding/src/repdef.rs:777-819)

### Lines 820-835

Copy remaining parent specials at the tail, swap rep/def active and spare vectors, update current_len and add this offsets layer special count. The vectors retain allocated length; build later does not truncate them to current_len, relying on planned length consistency. (rust/lance-encoding/src/repdef.rs:820-835)

### Lines 836-870

do_record_validity asserts capacity and debug-checks slot count plus prior specials. Skip/copy special tags; replace only a zero definition with incoming null level, preserving higher parent nulls. Copy trailing specials and swap defs; rep is unchanged. (rust/lance-encoding/src/repdef.rs:836-870)

### Lines 871-906

multiply_levels expands current_len by dimension for non-special slots, keeping special count fixed. No buffers returns immediately; def-only repeats each ordinary def, rep-only repeats the same rep across each FSL element. No positivity/overflow guard here. (rust/lance-encoding/src/repdef.rs:871-906)

### Lines 907-929

Both-buffer multiplication carries tagged specials and repeats rep/def per dimension, then swaps active/spare vectors. Loops use old_len iterations even while consuming extra specials in inner loops, an implicit shape/count precondition; do not claim general mixed-list/FSL support from this helper. (rust/lance-encoding/src/repdef.rs:907-929)

### Lines 930-957

record_validity_buf chooses NullableItem only from Some bitmap, otherwise AllValidItem. record_validity forwards it. record_fsl sets has_fsl, records parent validity then broadcasts levels. normalize_specials scans full def vector and subtracts32767 for values greater than the threshold. (rust/lance-encoding/src/repdef.rs:930-957)

### Lines 958-1006

Split planner early exits: no defs, no rep, absent budget, zero visible values, any FSL, or no variable-list meaning. Existing defs are normalized on all exits except already-empty defs. If both buffers exist, unequal lengths returns Internal before budget checks. WithinBudget is conditional policy, not a universal byte-size guarantee. (rust/lance-encoding/src/repdef.rs:958-1006)

### Lines 1007-1067

Planner tracks row and page dense ranges and visible counts. A row has overhead iff dense entries exceed visible values. Record over-budget count only for rows with overhead; last offending row overwrites prior count. Greedily split before a row only if current page nonempty, either side has overhead and combined levels exceed budget. Dense-only long rows are exempt from this policy. (rust/lance-encoding/src/repdef.rs:1007-1067)

### Lines 1068-1108

Normalize each special while scanning equal buffers. Top row starts exactly when rep equals schema list count. Levels before a top-row start, absent starts, or a first discovered start after position0 return Internal. Count visible defs<=threshold and finish final row. Input state can already be normalized when error occurs; serializer is consumed by caller. (rust/lance-encoding/src/repdef.rs:1068-1108)

### Lines 1109-1145

Counted top rows and visible values must equal supplied counts or Internal includes expected/actual. No overhead returns WithinBudget; any offending row returns SingleRowOverBudget before page-split result. Otherwise append final split and require more than one split for RequiresPageSplit. Does not emit pages or choose fallback codec. (rust/lance-encoding/src/repdef.rs:1109-1145)

### Lines 1146-1179

build with current_len0 returns absent buffers and unreversed meanings. Nonzero path normalizes tags, returns each nonempty entire vector, reverses outer-first meanings to leaf-first and retains FSL flag. No length truncation/structural validation is performed. (rust/lance-encoding/src/repdef.rs:1146-1179)

### Lines 1180-1232

Budgeted build likewise has a zero-current-length fast path with unreversed meanings and WithinBudget; otherwise reverse meanings first, normalize/plan, then package existing nonempty vectors with budget. Error aborts this consumed context. (rust/lance-encoding/src/repdef.rs:1180-1232)

### Lines 1233-1276

Public Clone/Default RepDefBuilder keeps raw layers and optional current child length. check_validity_len initializes once then assert-equals. is_empty means every layer is plain all-valid Validity (vacuously true for no layers); is_simple_validity requires exactly one Validity layer, regardless of nulls. (rust/lance-encoding/src/repdef.rs:1233-1276)

### Lines 1277-1318

add_validity_bitmap drops all-valid bitmaps through add_no_null, preserving length assertions. add_fsl asserts parent count if initialized, sets child len=count*dimension and only debug-asserts bitmap length; Some all-valid bitmap is retained and dimension0 is not rejected here. check_offset_len expects slot count+1 and stores final normalized offset cast to usize. (rust/lance-encoding/src/repdef.rs:1277-1318)

### Lines 1319-1372

do_add_offsets accumulates lengths from zero; null slots contribute no child values and count as specials, returning true if they had garbage child values. Valid empty lists also count as specials and set empty flag. With validity, zip truncates to shorter input; mismatches may only be noticed by initialized parent-count assertion. Caller must remove discarded child values. (rust/lance-encoding/src/repdef.rs:1319-1372)

### Lines 1373-1397

Public generic add_offsets reconstructs i64 or i32 scalar views, uses adjacent differences and delegates normalized lengths. Nonzero base offsets therefore rebase automatically. Null garbage removal is only signaled, never performed on value arrays. Existing Arrow offset buffer validity and consistent child lengths are assumed. (rust/lance-encoding/src/repdef.rs:1373-1397)

### Lines 1398-1451

concat_layers gathers same-depth raw layers across batches, computing bitmap presence, cumulative slots/specials and empty flags. Layer kind and FSL dimension are taken from encountered inputs, effectively last input; homogeneous kinds/dimensions are documented assumptions, not validated. (rust/lance-encoding/src/repdef.rs:1398-1451)

### Lines 1452-1485

Without null bitmaps, plain validity and FSL return count-only descriptors. Otherwise allocate a bitmap; offsets allocate a vector starting0 even with no nulls. Capacity is a hint, not exact storage enforcement. (rust/lance-encoding/src/repdef.rs:1452-1485)

### Lines 1486-1537

Concatenate optional validity, filling true for missing bitmaps when needed. Offset vectors append all but initial0 after adding previous tail. FSL bitmap concatenation follows slot counts; no dimension consistency check. (rust/lance-encoding/src/repdef.rs:1486-1537)

### Lines 1538-1590

Finish normalized descriptor by selected kind. Public serialize consumes nonempty builder vector through normalize then dense serialization. normalize asserts nonempty, debug-asserts equal layer counts, indexes each builder at first-builder depths, concatenates once and marks all-valid only if every builder.is_empty. Fewer layers can panic; extra layers can be ignored in release. (rust/lance-encoding/src/repdef.rs:1538-1590)

### Lines 1591-1663

Public RepDefUnraveler carries either sparse delegate or dense vectors, leaf-first meanings, rep visibility map and consumption cursors. new maps def0 to rep0; NullableItem uses current counter and nullable/emptyable list increments it. Literal AllValidList branch adds nothing and does not increment counter. Inputs are not validated; num_items is caller-provided fallback count. (rust/lance-encoding/src/repdef.rs:1591-1663)

### Lines 1664-1715

Crate new_sparse initializes delegate with empty dense fields. ensure_exhausted checks only sparse state; dense state always succeeds. is_all_valid delegates or returns true for absent defs/current all-valid meaning. max_lists delegates or returns remaining rep-vector length, an upper bound, not exact list count; dense misuse can panic via meaning indexing. (rust/lance-encoding/src/repdef.rs:1664-1715)

### Lines 1716-1769

unravel_offsets delegates sparse first. Dense requires rep vector and list meaning, advances layer/def counters, identifies null/empty levels, then scans outward through adjacent item meanings to include null structs masking this list. This call handles list validity together with offsets. (rust/lance-encoding/src/repdef.rs:1716-1769)

### Lines 1770-1799

Append offsets after existing tail by reading tail then popping it, avoiding duplicate boundaries between pages. T::from_usize failure returns InvalidInput mentioning i32::MAX/large containers even though T is generic. State/counters and destination may already be mutated before failure; no rollback contract. (rust/lance-encoding/src/repdef.rs:1770-1799)

### Lines 1800-1843

Dense paired loop asserts equal lengths then uses unchecked reads/writes with read_idx<len and write_idx<=read_idx. Only nonzero rep starts survive, decremented by1. Invisible outer entries remain in compacted levels but emit no offsets. Valid starts add one child; null/empty/masked starts add zero and bitmap false/true; rep0 continues child count. Truncate both vectors to local surviving starts. (rust/lance-encoding/src/repdef.rs:1800-1843)

### Lines 1844-1877

Rep-only loop emits each nonzero start, compacts/decrements rep, counts every input as child, appends final tail and truncates to THIS unraveler write_idx, not cumulative destination lists. If another page required validity, append true for locally produced lists. This preserves nested multi-page reconstruction. (rust/lance-encoding/src/repdef.rs:1844-1877)

### Lines 1878-1916

skip_validity delegates or debug-asserts all-valid then advances only current_layer. unravel_validity fast path for AllValidItem or missing defs appends original num_items true; otherwise increments def comparison and emits only levels whose mapped rep visibility is reached. Dense num_items is not updated by decimation/list compaction; outer all-valid layers should normally use composite skip path. (rust/lance-encoding/src/repdef.rs:1878-1916)

### Lines 1917-1969

decimate rejects dimension0 as InvalidInput before sparse dispatch or buffer access. Dense with any rep vector hits todo panic for unsupported FSL/List combinations. Def-only compaction keeps indices0,dimension,2*dimension using unsafe bounds proof write<=read. No divisibility check and no num_items update; absent defs returns immediately. (rust/lance-encoding/src/repdef.rs:1917-1969)

### Lines 1970-2015

Public CompositeRepDefUnraveler owns pages/chunks independently because meanings may differ. Crate compatibility checks add other composite trees; has_sparse and ensure_exhausted recurse into both. Dense exhaustion is not checked. Empty composite is constructible. (rust/lance-encoding/src/repdef.rs:1970-2015)

### Lines 2016-2042

Private null_buffers_equal treats None as all-valid only against a present buffer of expected length with zero nulls; two present buffers require both expected lengths and bitwise logical equality. Two None compare true without length evidence. Composite decimate mutates each primary/comparison sequentially and propagates first error. (rust/lance-encoding/src/repdef.rs:2016-2042)

### Lines 2043-2086

Composite unravel_validity skips all primary layers and returns None if every unraveler says all-valid. Otherwise builds concatenated bitmap using num_values only as initial capacity; it does not independently validate final primary length or drop a now-all-valid Some bitmap. Comparisons are consumed too and mismatch returns InvalidInput. FSL wrapper decimates then unravels validity. (rust/lance-encoding/src/repdef.rs:2043-2086)

### Lines 2087-2142

Composite offsets checked-adds max list counts, optionally allocates bitmap, concatenates each unraveler and constructs Arrow OffsetBuffer. Capacity+1 remains unchecked; no-primary composite produces empty offsets and violates OffsetBuffer nonempty requirement. Comparison offsets and logical nulls must match or InvalidInput. Errors can follow partial mutation. (rust/lance-encoding/src/repdef.rs:2087-2142)

### Lines 2143-2196

Public generic BinaryControlWordIterator fields are private. Specialized u8/u16 append methods zip rep/def, mask and pack rep above def, write little-endian bytes, then report raw rep==max_rep, raw def<=max_visible_def and raw def==0. Exhaustion returns None. (rust/lance-encoding/src/repdef.rs:2143-2196)

### Lines 2197-2228

Binary u32 writes4 little-endian bytes with same flags. Public UnaryControlWordIterator privately holds one level iterator, mask, widths and max_rep. Semantic flags need consistent caller maxima/masks and source levels. (rust/lance-encoding/src/repdef.rs:2197-2228)

### Lines 2229-2259

Unary u8 masks byte output but computes flags from raw level, treating no-rep as new row and no-def as valid. Unary u16 instead unwraps next (PANICS at exhaustion), masks before flags and writes2 bytes. This differs from Option-returning behavior of other widths; local tests do not exercise unary16 exhaustion. (rust/lance-encoding/src/repdef.rs:2229-2259)

### Lines 2260-2305

Unary u32 uses ? for exhaustion, masks then writes4 bytes and flags; normally u16 maxima make unary32 unreachable with consistent absent-side max0. Nilary emits len all-true descriptors and no bytes. Private get_mask computes (1<<width)-1 in u16; width16 is not guarded and exceeds shift-width assumptions. (rust/lance-encoding/src/repdef.rs:2260-2305)

### Lines 2306-2341

Private SpecificBinary alias fixes zipped copied u16 slice iterators, avoiding boxing per value. Public ControlWordIterator contains binary/unary8/16/32 and Nilary variants. Public ControlWordDesc fields report row-start, visible-slot and valid-item separately. (rust/lance-encoding/src/repdef.rs:2306-2341)

### Lines 2342-2408

ControlWordIterator dispatches append and reports repetition presence, bytes0/1/2/4 and rep/def bits. append documentation says returns true but actual signature is Option<ControlWordDesc>. Binary variants report repetition present even if inconsistent supplied max_rep is0. (rust/lance-encoding/src/repdef.rs:2342-2408)

### Lines 2409-2441

build_control_word_iterator takes buffers, inclusive maxima, visibility threshold and nilary length. log_2_ceil here means inclusive bit length (e.g.256 needs9), not mathematical ceil(log2(256)). Zero total bits returns Nilary even when buffers contain all-zero entries, ensuring decoder and writer agree on zero bytes. (rust/lance-core/src/utils/bit.rs:78-109) (rust/lance-encoding/src/repdef.rs:2409-2441)

### Lines 2442-2483

Two present buffers select binary word by summed widths<=8,<=16,otherwise32. Zip stops at shorter slice; explicit len is unused and mismatched lengths are not rejected. Masks/maxima come from caller, not inferred or checked. (rust/lance-encoding/src/repdef.rs:2442-2483)

### Lines 2484-2514

Rep-only uses rep mask and records total supplied width as bits_rep with bits_def0. Caller must provide max_def0 when def absent; inconsistent maxima can choose unnecessarily wide or mismatching layout. Unary16 exhaustion remains panic. (rust/lance-encoding/src/repdef.rs:2484-2514)

### Lines 2515-2549

Def-only similarly uses def mask and total width as bits_def with max_rep forced0. Both absent always returns Nilary(len), even if supplied maxima nonzero. No validation of presence, count or maxima. (rust/lance-encoding/src/repdef.rs:2515-2549)

### Lines 2550-2602

Public Copy/Clone ControlWordParser has BOTH8/16/32(shift,mask), REP8/16/32, DEF8/16/32 and NIL. Private paired parse reads1/2/4 little-endian bytes, shifts/masks and appends u16s. Slice indexing requires sufficient bytes;32-bit results cast/truncate to u16. Parser does not advance source. (rust/lance-encoding/src/repdef.rs:2550-2602)

### Lines 2603-2653

Paired descriptor parsing computes row-start/visibility/validity without appending.32-bit branch casts rep/def for row/visibility comparisons but tests original def==0; malformed high bits can produce differences from parsed truncated levels. Width/shift/level consistency are caller preconditions. (rust/lance-encoding/src/repdef.rs:2603-2653)

### Lines 2654-2713

Single-side parsing appends whole byte/word cast to u16 without bit masking. Rep descriptors always visible/valid and compare max_rep; def descriptors always new-row/visible and test zero.32-bit unary descriptor comparisons truncate to u16. No corruption Result boundary. (rust/lance-encoding/src/repdef.rs:2654-2713)

### Lines 2714-2769

bytes_per_word is0/1/2/4. Public parse appends only sides represented by variant, NIL no-ops. has_rep matches BOTH or REP variants. Caller must advance byte position and enforce valid framing. (rust/lance-encoding/src/repdef.rs:2714-2769)

### Lines 2770-2807

Public parse_desc dispatches flag readers; NIL returns all flags true even with empty source. This interprets a single word and does not check level ranges or source consumption. (rust/lance-encoding/src/repdef.rs:2770-2807)

### Lines 2808-2842

Parser new sums u8 widths, chooses1/2/4 bytes and presence variant; both widths0 returns NIL. BOTH uses u16 get_mask cast to u32. No check for overflow of total_bits, widths exceeding16, shift>=word bits, or totals>32. Private local WordSize enum only selects byte group. (rust/lance-encoding/src/repdef.rs:2808-2842)

### Lines 2843-2899

Test imports include sparse planning. Three max-visible cases assert no-list full sum, nullable leaf under list and nullable struct above list. Small validity and i32/i64 offset helpers build Arrow fixtures. All tests in this file were read only, not executed. (rust/lance-encoding/src/repdef.rs:2843-2899)

### Lines 2900-2934

Sparse sibling mismatch fixture compares no nulls against null position0 and requires InvalidInput plus message. Empty offsets[0] must serialize with neither rep nor def buffer; test does not verify meaning order or decode zero-row list. (rust/lance-encoding/src/repdef.rs:2900-2934)

### Lines 2935-2982

Basic two-list test asserts exact11 rep/def entries, nine leaf validity bits and reconstructed inner/outer offsets and nulls. Parent masking can normalize child validity rather than preserving redundant input bitmap bits. (rust/lance-encoding/src/repdef.rs:2935-2982)

### Lines 2983-3020

Single null-list and empty-list fixtures yield identical levels with different meanings (NullableList versus EmptyableList). Assertion checks exact buffers and metadata, demonstrating meanings are essential to interpretation. (rust/lance-encoding/src/repdef.rs:2983-3020)

### Lines 3021-3073

Trailing-empty regression asserts special tail preserved. Abnormal nonempty-null offset fixture normalizes offsets and manually supplies reduced child count5 instead of8; test does not assert the boolean garbage return. (rust/lance-encoding/src/repdef.rs:3021-3073)

### Lines 3074-3119

Nested FSL dimensions2x2 with parent and leaf nulls assert eight defs, no reps, leaf mask and successive FSL validity reconstruction. Some parent-null child bitmap bits normalize false. (rust/lance-encoding/src/repdef.rs:3074-3119)

### Lines 3120-3188

Zero-dimension decoder regression expects InvalidInput and positive-integer message after consuming leaf layer. Second nested FSL test uses all-valid leaf and confirms composite skips those layers before recovering parent validity. (rust/lance-encoding/src/repdef.rs:3120-3188)

### Lines 3189-3238

Sliced offsets starting5 rebase to zero with five leaf values and expected rep/def. Two nested nullable/emptyable list fixture asserts exact8 entries spanning both list levels. (rust/lance-encoding/src/repdef.rs:3189-3238)

### Lines 3239-3296

Empty-but-nonnull list reconstruction yields None validity with required defs. Fully valid nested list case has rep-only buffer and reconstructs both offset layers. (rust/lance-encoding/src/repdef.rs:3239-3296)

### Lines 3297-3330

Single versus two-builder nested-list test compares repetition buffers for identical logical3-row data. This tests encoding concatenation, not decoding two independent nested unravelers. (rust/lance-encoding/src/repdef.rs:3297-3330)

### Lines 3331-3387

Tests named only_empty_lists and only_null_lists include six ordinary leaf values as well as zero-length slots; they are not all-empty/all-null datasets. They assert exact levels and offsets; list bitmap distinguishes null case. (rust/lance-encoding/src/repdef.rs:3331-3387)

### Lines 3388-3448

Combined null/empty slots require two list definition levels and separate bitmap states. Nullable struct inside null/empty list test verifies leaf masking, parent struct validity and list reconstruction. (rust/lance-encoding/src/repdef.rs:3388-3448)

### Lines 3449-3513

Manually constructed rep/def checks nullable struct+leaf inside all-valid list. Definition-only three-layer fixture asserts parent masking and all-valid outer layer omission. (rust/lance-encoding/src/repdef.rs:3449-3513)

### Lines 3514-3564

Composite page fixture concatenates a nullable-list page and an all-valid-list page, checking rebased8-list offsets and combined validity. Caller num_values9 differs from total14 on all-valid leaf skip path, illustrating capacity/count parameter is not always validated. (rust/lance-encoding/src/repdef.rs:3514-3564)

### Lines 3565-3609

Two input builders with different null presence produce same exact nested level vectors as basic fixture. All-valid NullBuffer canonicalization must match add_no_null in meanings and visibility, with absent buffers. (rust/lance-encoding/src/repdef.rs:3565-3609)

### Lines 3610-3639

Slicer test asserts12/40/12 bytes for5/20/rest visible values including boundary specials. Variable named def_slicer is accidentally created using rep_slicer, so this test checks repetition twice and does not directly instantiate def_slicer. (rust/lance-encoding/src/repdef.rs:3610-3639)

### Lines 3640-3692

Nested test_control_words::check derives maxima and presence, checks widths/bytes, appends num_vals then expects None, compares exact bytes and parser roundtrip. Uses expected byte length for nilary len; exercised positive-data cases use buffer iteration rather than that length. (rust/lance-encoding/src/repdef.rs:3640-3692)

### Lines 3693-3743

Control-word fixtures cover binary4+4bits→1byte,4+5→2bytes, unary4bit rep/def and empty nilary. No binary32/unary16/unary32 roundtrip case is present here. (rust/lance-encoding/src/repdef.rs:3693-3743)

### Lines 3744-3787

Def-only five all-zero levels must select NIL, emit five new/visible descriptors and no bytes, then stop; NIL parser appends no buffers from empty source. Regression avoids writer1-byte/reader0-byte divergence after page splitting. (rust/lance-encoding/src/repdef.rs:3744-3787)

### Lines 3788-3839

Rep-only and both-present five all-zero buffers also require zero-byte iterator with exact descriptor count/exhaustion. Tests are defensive for repetition normally beginning with nonzero schema maximum. (rust/lance-encoding/src/repdef.rs:3788-3839)

### Lines 3840-3919

Nested test_control_words_rep_index::check asserts row-start and visibility at max_visible_def2. Cases cover paired, rep-only, def-only and nilary; it does not compare parser.parse_desc results or is_valid_item. (rust/lance-encoding/src/repdef.rs:3840-3919)

### Lines 3920-3952

Null structs wrapping three null lists with zero leaf values serialize rep[1,1,1],def[1,2,1]; reconstruction verifies list bitmap and outer struct bitmap independently. (rust/lance-encoding/src/repdef.rs:3920-3952)

### Lines 3953-3985

Nested-list trailing null regression preserves both null levels while only one leaf is present; reconstructs both offsets and masks. (rust/lance-encoding/src/repdef.rs:3953-3985)

### Lines 3986-4056

Mixed-page tests combine def-present and absent pages for primitive validity, then combine nullable-item/emptyable-list with all-valid-item/nullable-list interpretations. Exact concatenated validity, offsets and list masks asserted. (rust/lance-encoding/src/repdef.rs:3986-4056)

### Lines 4057-4083

Last regression covers nullable metadata with absent def buffer on an all-valid page combined with a nullable page. No local budget-planner tests, boundary width16 masks, unary16 exhaustion, malformed dense buffers, empty composite offsets, mixed list/FSL decimation or transactional-error tests are present; broader caller test coverage remains pending. (rust/lance-encoding/src/repdef.rs:4057-4083)

## Interaction and interpretation limits

All4083 lines freshly read in bounded ANALYZE80 calls. Source deductions only; no network or repository execution. Full primitive/sparse/list/struct/encoder/decoder callers remain pending. Unsafe proofs, panic and unchecked-input preconditions retained.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Utilities for rep-def levels
    5 | //!
    6 | //! Repetition and definition levels are a way to encode multipile validity / offsets arrays
    7 | //! into a single buffer.  They are a form of "zipping" buffers together that takes advantage
    8 | //! of the fact that, if the outermost array is invalid, then the validity of the inner items
    9 | //! is irrelevant.
   10 | //!
   11 | //! Note: the concept of repetition & definition levels comes from the Dremel paper and has
   12 | //! been implemented in Apache Parquet.  However, the implementation here is not necessarily
   13 | //! compatible with Parquet.  For example, we use 0 to represent the "inner-most" item and
   14 | //! Parquet uses 0 to represent the "outer-most" item.
   15 | //!
   16 | //! # Repetition Levels
   17 | //!
   18 | //! With repetition levels we convert a sparse array of offsets into a dense array of levels.
   19 | //! These levels are marked non-zero whenever a new list begins.  In other words, given the
   20 | //! list array with 3 rows [{<0,1>, <>, <2>}, {<3>}, {}], [], [{<4>}] we would have three
   21 | //! offsets arrays:
   22 | //!
   23 | //! Outer-most ([]): [0, 3, 3, 4]
   24 | //! Middle     ({}): [0, 3, 4, 4, 5]
   25 | //! Inner      (<>): [0, 2, 2, 3, 4, 5]
   26 | //! Values         : [0, 1, 2, 3, 4]
   27 | //!
   28 | //! We can convert these into repetition levels as follows:
   29 | //!
   30 | //! | Values | Repetition |
   31 | //! | ------ | ---------- |
   32 | //! |      0 |          3 | // Start of outer-most list
   33 | //! |      1 |          0 | // Continues inner-most list (no new lists)
   34 | //! |      - |          1 | // Start of new inner-most list (empty list)
   35 | //! |      2 |          1 | // Start of new inner-most list
   36 | //! |      3 |          2 | // Start of new middle list
   37 | //! |      - |          2 | // Start of new inner-most list (empty list)
   38 | //! |      - |          3 | // Start of new outer-most list (empty list)
   39 | //! |      4 |          0 | // Start of new outer-most list
   40 | //!
   41 | //! Note: We actually have MORE repetition levels than values.  This is because the repetition
   42 | //! levels need to be able to represent empty lists.
   43 | //!
   44 | //! # Definition Levels
   45 | //!
   46 | //! Definition levels are simpler.  We can think of them as zipping together various validity bitmaps
   47 | //! (from different levels of nesting) into a single buffer.  For example, we could zip the arrays
   48 | //! [1, 1, 0, 0] and [1, 0, 1, 0] into [11, 10, 01, 00].  However, 00 and 01 are redundant.  If the
   49 | //! outer level is null then the validity of the inner levels is irrelevant.  To save space we instead
   50 | //! encode a "level" which is the "depth" of the null.  Let's look at a more complete example:
   51 | //!
   52 | //! Array: [{"middle": {"inner": 1]}}, NULL, {"middle": NULL}, {"middle": {"inner": NULL}}]
   53 | //!
   54 | //! In Arrow we would have the following validity arrays:
   55 | //! Outer validity : 1, 0, 1, 1
   56 | //! Middle validity: 1, ?, 0, 1
   57 | //! Inner validity : 1, ?, ?, 0
   58 | //! Values         : 1, ?, ?, ?
   59 | //!
   60 | //! The ? values are undefined in the Arrow format.  We can convert these into definition levels as follows:
   61 | //!
   62 | //! | Values | Definition |
   63 | //! | ------ | ---------- |
   64 | //! |      1 |          0 | // Valid at all levels
   65 | //! |      - |          3 | // Null at outer level
   66 | //! |      - |          2 | // Null at middle level
   67 | //! |      - |          1 | // Null at inner level
   68 | //!
   69 | //! # Compression
   70 | //!
   71 | //! Note that we only need 2 bits of definition levels to represent 3 levels of nesting.  Definition
   72 | //! levels are always more compact than the input validity arrays.  However, compressed levels are not
   73 | //! necessarily more compact than the compressed validity arrays.
   74 | //!
   75 | //! Repetition levels are more complex.  If there are very large lists then a sparse array of offsets
   76 | //! (which has one element per list) might be more compact than a dense array of repetition levels
   77 | //! (which has one element per list value, possibly even more if there are empty lists).
   78 | //!
   79 | //! However, both repetition levels and definition levels are typically very compressible with RLE.
   80 | //!
   81 | //! However, in Lance we don't always take advantage of that compression because we want to be able
   82 | //! to zip rep-def levels together with our values.  This gives us fewer IOPS when accessing row values.
   83 | //!
   84 | //! # Utilities in this Module
   85 | //!
   86 | //! - `RepDefBuilder` - Extracts validity and offset information from Arrow arrays.  We use this as we
   87 | //!   shred the incoming data into primitive leaf arrays.  We don't immediately convert into rep-def because
   88 | //!   we need to share and cheaply clone the builder when we have structs (each struct child shares some parent
   89 | //!   validity / offset information)  The `serialize` method is called once all data has been received to create
   90 | //!   the final rep-def levels.
   91 | //!
   92 | //! - `SerializerContext` - This is an internal utility that helps with serializing rep-def levels.
   93 | //!
   94 | //! - `CompositeRepDefUnraveler` - This structure is used to reverse the process.  It starts with a set of
   95 | //!   rep-def levels and then uses the `unravel_validity` and `unravel_offsets` methods to produce validity
   96 | //!   buffers and offset buffers.  It is "composite" because we may be combining sets of rep-def buffers from
   97 | //!   multiple locations (e.g. multiple blocks in a mini-block encoded file).
   98 | //!
   99 | //! - `RepDefSlicer` - This is a utility that helps with slicing rep-def buffers.  These buffers are "kind of"
  100 | //!   transparent (maps 1:1 with the values in the array) but not exactly because of the special (empty/null) lists.
  101 | //!   The slicer helps with this issue and is used when slicing a rep-def buffer into mini-blocks.
  102 | //!
  103 | //! - `build_control_word_iterator` - This takes in rep-def levels and returns an iterator that returns byte-padded
  104 | //!   "control words" which are used when creating full-zip encoded data.
  105 | //!
  106 | //! - `ControlWordParser` - This parser can parse the control words returned by `build_control_word_iterator` and is
  107 | //!   used when decoding full-zip encoded data.
  108 | 
  109 | use std::{
  110 |     iter::{Copied, Zip},
  111 |     ops::Range,
  112 |     sync::Arc,
  113 | };
  114 | 
  115 | use arrow_array::OffsetSizeTrait;
  116 | use arrow_buffer::{
  117 |     ArrowNativeType, BooleanBuffer, BooleanBufferBuilder, NullBuffer, OffsetBuffer, ScalarBuffer,
  118 | };
  119 | use lance_core::{Error, Result, utils::bit::log_2_ceil};
  120 | 
  121 | use crate::{
  122 |     buffer::LanceBuffer,
  123 |     encodings::logical::primitive::sparse::{SparseStructuralPlan, SparseStructuralUnraveler},
  124 | };
  125 | 
  126 | pub type LevelBuffer = Vec<u16>;
  127 | 
  128 | /// A top-level-row range whose dense rep/def stream fits one mini-block page.
  129 | #[derive(Debug, Clone, PartialEq, Eq)]
  130 | pub(crate) struct MiniBlockRepDefSplit {
  131 |     /// Top-level row offset, relative to the original unsplit page.
  132 |     pub(crate) row_start: u64,
  133 |     /// Number of top-level rows in this split.
  134 |     pub(crate) num_rows: u64,
  135 |     /// Rep/def level range, relative to the original unsplit page.
  136 |     pub(crate) level_range: Range<usize>,
  137 |     /// Visible value offset, relative to the original unsplit page.
  138 |     pub(crate) value_start: u64,
  139 |     /// Number of visible values in this split.
  140 |     pub(crate) num_values: u64,
  141 | }
  142 | 
  143 | /// Dense mini-block rep/def budget result for one accumulated page.
  144 | #[derive(Debug, Clone, PartialEq, Eq)]
  145 | pub(crate) enum MiniBlockRepDefBudget {
  146 |     /// The dense rep/def stream fits one mini-block structural page.
  147 |     WithinBudget,
  148 |     /// The dense rep/def stream fits after splitting on top-level row boundaries.
  149 |     RequiresPageSplit(Vec<MiniBlockRepDefSplit>),
  150 |     /// A single top-level row has this many rep/def levels and exceeds the budget.
  151 |     SingleRowOverBudget(u64),
  152 | }
  153 | 
  154 | // As we build def levels we add this to special values to indicate that they
  155 | // are special so that we can skip over them when processing lower levels.
  156 | //
  157 | // We assume 16 bits is good enough for rep-def levels.  This _would_ give
  158 | // us 65536 levels of struct nesting and list nesting.  However, we cut that
  159 | // in half for SPECIAL_THRESHOLD because we use the top bit to indicate if an
  160 | // item is a special value (null list / empty list) during construction.
  161 | //
  162 | // We subtract this off at the end of construction to get the actual definition
  163 | // levels.
  164 | const SPECIAL_THRESHOLD: u16 = u16::MAX / 2;
  165 | 
  166 | /// Represents information that we extract from a list array as we are
  167 | /// encoding
  168 | #[derive(Clone, Debug)]
  169 | struct OffsetDesc {
  170 |     offsets: Arc<[i64]>,
  171 |     validity: Option<BooleanBuffer>,
  172 |     has_empty_lists: bool,
  173 |     num_values: usize,
  174 |     num_specials: usize,
  175 | }
  176 | 
  177 | /// Represents validity information that we extract from non-list arrays (that
  178 | /// have nulls) as we are encoding
  179 | #[derive(Clone, Debug)]
  180 | struct ValidityDesc {
  181 |     validity: Option<BooleanBuffer>,
  182 |     num_values: usize,
  183 | }
  184 | 
  185 | /// Represents validity information that we extract from FSL arrays.  This is
  186 | /// just validity (no offsets) but we also record the dimension of the FSL array
  187 | /// as that will impact the next layer
  188 | #[derive(Clone, Debug)]
  189 | struct FslDesc {
  190 |     validity: Option<BooleanBuffer>,
  191 |     dimension: usize,
  192 |     num_values: usize,
  193 | }
  194 | 
  195 | // As we build up rep/def from arrow arrays we record a
  196 | // series of RawRepDef objects.  Each one corresponds to layer
  197 | // in the array structure
  198 | #[derive(Clone, Debug)]
  199 | enum RawRepDef {
  200 |     Offsets(OffsetDesc),
  201 |     Validity(ValidityDesc),
  202 |     Fsl(FslDesc),
  203 | }
  204 | 
  205 | /// A normalized Arrow structural layer shared by dense and sparse serializers.
  206 | #[derive(Clone, Copy, Debug)]
  207 | pub(crate) enum NormalizedStructuralLayer<'a> {
  208 |     List {
  209 |         offsets: &'a [i64],
  210 |         validity: Option<&'a BooleanBuffer>,
  211 |         num_slots: usize,
  212 |     },
  213 |     Validity {
  214 |         validity: Option<&'a BooleanBuffer>,
  215 |         num_slots: usize,
  216 |     },
  217 |     FixedSizeList {
  218 |         validity: Option<&'a BooleanBuffer>,
  219 |         dimension: usize,
  220 |         num_slots: usize,
  221 |     },
  222 | }
  223 | 
  224 | /// Structural layers concatenated across input batches exactly once.
  225 | ///
  226 | /// Dense rep/def serialization and sparse metadata planning both consume this
  227 | /// representation so the Arrow nesting is not independently reconstructed.
  228 | #[derive(Debug)]
  229 | pub(crate) struct NormalizedStructuralPlan {
  230 |     layers: Vec<RawRepDef>,
  231 |     dense_all_valid: bool,
  232 | }
  233 | 
  234 | impl NormalizedStructuralPlan {
  235 |     pub(crate) fn layers(&self) -> impl ExactSizeIterator<Item = NormalizedStructuralLayer<'_>> {
  236 |         self.layers.iter().map(|layer| match layer {
  237 |             RawRepDef::Offsets(OffsetDesc {
  238 |                 offsets,
  239 |                 validity,
  240 |                 num_values,
  241 |                 ..
  242 |             }) => NormalizedStructuralLayer::List {
  243 |                 offsets,
  244 |                 validity: validity.as_ref(),
  245 |                 num_slots: *num_values,
  246 |             },
  247 |             RawRepDef::Validity(ValidityDesc {
  248 |                 validity,
  249 |                 num_values,
  250 |             }) => NormalizedStructuralLayer::Validity {
  251 |                 validity: validity.as_ref(),
  252 |                 num_slots: *num_values,
  253 |             },
  254 |             RawRepDef::Fsl(FslDesc {
  255 |                 validity,
  256 |                 dimension,
  257 |                 num_values,
  258 |             }) => NormalizedStructuralLayer::FixedSizeList {
  259 |                 validity: validity.as_ref(),
  260 |                 dimension: *dimension,
  261 |                 num_slots: *num_values,
  262 |             },
  263 |         })
  264 |     }
  265 | 
  266 |     fn to_serializer(&self) -> (SerializerContext, Option<u64>) {
  267 |         if self.dense_all_valid {
  268 |             let def_meaning = self
  269 |                 .layers
  270 |                 .iter()
  271 |                 .map(|_| DefinitionInterpretation::AllValidItem)
  272 |                 .collect::<Vec<_>>();
  273 |             return (
  274 |                 SerializerContext {
  275 |                     def_meaning,
  276 |                     rep_levels: LevelBuffer::default(),
  277 |                     spare_rep: LevelBuffer::default(),
  278 |                     def_levels: LevelBuffer::default(),
  279 |                     spare_def: LevelBuffer::default(),
  280 |                     current_rep: 0,
  281 |                     current_def: 0,
  282 |                     current_len: 0,
  283 |                     current_num_specials: 0,
  284 |                     has_fsl: false,
  285 |                 },
  286 |                 None,
  287 |             );
  288 |         }
  289 | 
  290 |         let total_len = self.layers.last().map_or(0, RawRepDef::num_values)
  291 |             + self
  292 |                 .layers
  293 |                 .iter()
  294 |                 .map(RawRepDef::num_specials)
  295 |                 .sum::<usize>();
  296 |         let max_rep = self.layers.iter().map(RawRepDef::max_rep).sum::<u16>();
  297 |         let max_def = self.layers.iter().map(RawRepDef::max_def).sum::<u16>();
  298 |         let bits_per_rep = if max_rep > 0 {
  299 |             u64::from(u16::BITS - max_rep.leading_zeros())
  300 |         } else {
  301 |             0
  302 |         };
  303 |         let bits_per_def = if max_def > 0 {
  304 |             u64::from(u16::BITS - max_def.leading_zeros())
  305 |         } else {
  306 |             0
  307 |         };
  308 |         let bits_per_level =
  309 |             (bits_per_rep + bits_per_def > 0).then_some(bits_per_rep + bits_per_def);
  310 | 
  311 |         let num_layers = self.layers.len();
  312 |         let mut context = SerializerContext::new(total_len, num_layers, max_rep, max_def);
  313 |         for layer in &self.layers {
  314 |             match layer {
  315 |                 RawRepDef::Validity(def) => context.record_validity(def),
  316 |                 RawRepDef::Offsets(rep) => context.record_offsets(rep),
  317 |                 RawRepDef::Fsl(fsl) => context.record_fsl(fsl),
  318 |             }
  319 |         }
  320 |         (context, bits_per_level)
  321 |     }
  322 | 
  323 |     pub(crate) fn serialize(&self) -> SerializedRepDefs {
  324 |         self.to_serializer().0.build()
  325 |     }
  326 | 
  327 |     pub(crate) fn serialize_with_miniblock_repdef_budget(
  328 |         &self,
  329 |         max_levels_for_bits: impl FnOnce(u64) -> u64,
  330 |         num_rows: u64,
  331 |         num_values: u64,
  332 |     ) -> Result<(SerializedRepDefs, MiniBlockRepDefBudget)> {
  333 |         let (context, bits_per_level) = self.to_serializer();
  334 |         context.build_with_miniblock_repdef_budget(
  335 |             bits_per_level.map(max_levels_for_bits),
  336 |             num_rows,
  337 |             num_values,
  338 |         )
  339 |     }
  340 | }
  341 | 
  342 | impl RawRepDef {
  343 |     // Are there any nulls in this layer
  344 |     fn has_nulls(&self) -> bool {
  345 |         match self {
  346 |             Self::Offsets(OffsetDesc { validity, .. }) => validity.is_some(),
  347 |             Self::Validity(ValidityDesc { validity, .. }) => validity.is_some(),
  348 |             Self::Fsl(FslDesc { validity, .. }) => validity.is_some(),
  349 |         }
  350 |     }
  351 | 
  352 |     // How many values are in this layer
  353 |     fn num_values(&self) -> usize {
  354 |         match self {
  355 |             Self::Offsets(OffsetDesc { num_values, .. }) => *num_values,
  356 |             Self::Validity(ValidityDesc { num_values, .. }) => *num_values,
  357 |             Self::Fsl(FslDesc { num_values, .. }) => *num_values,
  358 |         }
  359 |     }
  360 | 
  361 |     /// How many empty/null lists are in this layer
  362 |     fn num_specials(&self) -> usize {
  363 |         match self {
  364 |             Self::Offsets(OffsetDesc { num_specials, .. }) => *num_specials,
  365 |             _ => 0,
  366 |         }
  367 |     }
  368 | 
  369 |     /// How many definition levels do we need for this layer
  370 |     fn max_def(&self) -> u16 {
  371 |         match self {
  372 |             Self::Offsets(OffsetDesc {
  373 |                 has_empty_lists,
  374 |                 validity,
  375 |                 ..
  376 |             }) => {
  377 |                 let mut max_def = 0;
  378 |                 if *has_empty_lists {
  379 |                     max_def += 1;
  380 |                 }
  381 |                 if validity.is_some() {
  382 |                     max_def += 1;
  383 |                 }
  384 |                 max_def
  385 |             }
  386 |             Self::Validity(ValidityDesc { validity: None, .. }) => 0,
  387 |             Self::Validity(ValidityDesc { .. }) => 1,
  388 |             Self::Fsl(FslDesc { validity: None, .. }) => 0,
  389 |             Self::Fsl(FslDesc { .. }) => 1,
  390 |         }
  391 |     }
  392 | 
  393 |     /// How many repetition levels do we need for this layer
  394 |     fn max_rep(&self) -> u16 {
  395 |         match self {
  396 |             Self::Offsets(_) => 1,
  397 |             _ => 0,
  398 |         }
  399 |     }
  400 | }
  401 | 
  402 | /// Represents repetition and definition levels that have been
  403 | /// serialized into a pair of (optional) level buffers
  404 | #[derive(Debug)]
  405 | pub struct SerializedRepDefs {
  406 |     /// The repetition levels, one per item
  407 |     ///
  408 |     /// If None, there are no lists
  409 |     pub repetition_levels: Option<Arc<[u16]>>,
  410 |     /// The definition levels, one per item
  411 |     ///
  412 |     /// If None, there are no nulls
  413 |     pub definition_levels: Option<Arc<[u16]>>,
  414 |     /// The meaning of each definition level
  415 |     pub def_meaning: Vec<DefinitionInterpretation>,
  416 |     /// The maximum level that is "visible" from the lowest level
  417 |     ///
  418 |     /// This is the last level before we encounter a list level of some kind.  Once we've
  419 |     /// hit a list level then nulls in any level beyond do not map to actual items.
  420 |     ///
  421 |     /// This is None if there are no lists
  422 |     pub max_visible_level: Option<u16>,
  423 |     has_fsl: bool,
  424 | }
  425 | 
  426 | /// The highest definition level whose items still map to a value in the leaf array
  427 | ///
  428 | /// `def_meaning` is ordered leaf-first, so every layer ahead of the first list layer sits
  429 | /// underneath that list.  Once a list boundary is crossed, a null (or empty) list at any
  430 | /// outer layer has no value in the leaf at all and its item is "invisible".
  431 | ///
  432 | /// Both the writer and every decoder decide whether an item owns a value by comparing
  433 | /// `def <= max_visible_level`, so the two sides must derive it the same way.  When there
  434 | /// are no lists this sums every layer, i.e. `max_def`, which makes all items visible.
  435 | pub fn max_visible_level(def_meaning: &[DefinitionInterpretation]) -> u16 {
  436 |     def_meaning
  437 |         .iter()
  438 |         .take_while(|level| !level.is_list())
  439 |         .map(|level| level.num_def_levels())
  440 |         .sum()
  441 | }
  442 | 
  443 | impl SerializedRepDefs {
  444 |     /// The same rule as [`max_visible_level`], but `None` when there are no lists and so
  445 |     /// no item can be invisible in the first place.
  446 |     fn max_visible_level(def_meaning: &[DefinitionInterpretation]) -> Option<u16> {
  447 |         def_meaning
  448 |             .iter()
  449 |             .any(|level| level.is_list())
  450 |             .then(|| max_visible_level(def_meaning))
  451 |     }
  452 | 
  453 |     pub fn new(
  454 |         repetition_levels: Option<LevelBuffer>,
  455 |         definition_levels: Option<LevelBuffer>,
  456 |         def_meaning: Vec<DefinitionInterpretation>,
  457 |     ) -> Self {
  458 |         Self::new_with_fixed_size_list_levels(
  459 |             repetition_levels,
  460 |             definition_levels,
  461 |             def_meaning,
  462 |             false,
  463 |         )
  464 |     }
  465 | 
  466 |     pub(crate) fn new_with_fixed_size_list_levels(
  467 |         repetition_levels: Option<LevelBuffer>,
  468 |         definition_levels: Option<LevelBuffer>,
  469 |         def_meaning: Vec<DefinitionInterpretation>,
  470 |         has_fsl: bool,
  471 |     ) -> Self {
  472 |         let max_visible_level = Self::max_visible_level(&def_meaning);
  473 |         Self {
  474 |             repetition_levels: repetition_levels.map(Arc::from),
  475 |             definition_levels: definition_levels.map(Arc::from),
  476 |             def_meaning,
  477 |             max_visible_level,
  478 |             has_fsl,
  479 |         }
  480 |     }
  481 | 
  482 |     /// Creates an empty SerializedRepDefs (no repetition, all valid)
  483 |     pub fn empty(def_meaning: Vec<DefinitionInterpretation>) -> Self {
  484 |         Self {
  485 |             repetition_levels: None,
  486 |             definition_levels: None,
  487 |             def_meaning,
  488 |             max_visible_level: None,
  489 |             has_fsl: false,
  490 |         }
  491 |     }
  492 | 
  493 |     pub fn rep_slicer(&self) -> Option<RepDefSlicer<'_>> {
  494 |         self.repetition_levels
  495 |             .as_ref()
  496 |             .map(|rep| RepDefSlicer::new(self, rep.clone()))
  497 |     }
  498 | 
  499 |     pub fn def_slicer(&self) -> Option<RepDefSlicer<'_>> {
  500 |         self.definition_levels
  501 |             .as_ref()
  502 |             .map(|def| RepDefSlicer::new(self, def.clone()))
  503 |     }
  504 | 
  505 |     pub(crate) fn has_fixed_size_list_levels(&self) -> bool {
  506 |         self.has_fsl
  507 |     }
  508 | }
  509 | 
  510 | /// Slices a level buffer into pieces
  511 | ///
  512 | /// This is needed to handle the fact that a level buffer may have more
  513 | /// levels than values due to special (empty/null) lists.
  514 | ///
  515 | /// As a result, a call to `slice_next(10)` may return 10 levels or it may
  516 | /// return more than 10 levels if any special values are encountered.
  517 | #[derive(Debug)]
  518 | pub struct RepDefSlicer<'a> {
  519 |     repdef: &'a SerializedRepDefs,
  520 |     to_slice: LanceBuffer,
  521 |     current: usize,
  522 | }
  523 | 
  524 | // TODO: All of this logic will need some changing when we compress rep/def levels.
  525 | impl<'a> RepDefSlicer<'a> {
  526 |     fn new(repdef: &'a SerializedRepDefs, levels: Arc<[u16]>) -> Self {
  527 |         Self {
  528 |             repdef,
  529 |             to_slice: LanceBuffer::reinterpret_slice(levels),
  530 |             current: 0,
  531 |         }
  532 |     }
  533 | 
  534 |     pub fn num_levels(&self) -> usize {
  535 |         self.to_slice.len() / 2
  536 |     }
  537 | 
  538 |     pub fn num_levels_remaining(&self) -> usize {
  539 |         self.num_levels() - self.current
  540 |     }
  541 | 
  542 |     pub fn all_levels(&self) -> &LanceBuffer {
  543 |         &self.to_slice
  544 |     }
  545 | 
  546 |     /// Returns the rest of the levels not yet sliced
  547 |     ///
  548 |     /// This must be called instead of `slice_next` on the final iteration.
  549 |     /// This is because anytime we slice there may be empty/null lists on the
  550 |     /// boundary that are "free" and the current behavior in `slice_next` is to
  551 |     /// leave them for the next call.
  552 |     ///
  553 |     /// `slice_rest` will slice all remaining levels and return them.
  554 |     pub fn slice_rest(&mut self) -> LanceBuffer {
  555 |         let start = self.current;
  556 |         let remaining = self.num_levels_remaining();
  557 |         self.current = self.num_levels();
  558 |         self.to_slice.slice_with_length(start * 2, remaining * 2)
  559 |     }
  560 | 
  561 |     /// Returns enough levels to satisfy the next `num_values` values
  562 |     pub fn slice_next(&mut self, num_values: usize) -> LanceBuffer {
  563 |         let start = self.current;
  564 |         let Some(max_visible_level) = self.repdef.max_visible_level else {
  565 |             // No lists, should be 1:1 mapping from levels to values
  566 |             self.current = start + num_values;
  567 |             return self.to_slice.slice_with_length(start * 2, num_values * 2);
  568 |         };
  569 |         if let Some(def) = self.repdef.definition_levels.as_ref() {
  570 |             // There are lists and there are def levels.  That means there may be
  571 |             // more rep/def levels than values.  We need to scan the def levels to figure
  572 |             // out which items are "invisible" and skip over them
  573 |             let mut def_itr = def[start..].iter();
  574 |             let mut num_taken = 0;
  575 |             let mut num_passed = 0;
  576 |             while num_taken < num_values {
  577 |                 let def_level = *def_itr.next().unwrap();
  578 |                 if def_level <= max_visible_level {
  579 |                     num_taken += 1;
  580 |                 }
  581 |                 num_passed += 1;
  582 |             }
  583 |             self.current = start + num_passed;
  584 |             self.to_slice.slice_with_length(start * 2, num_passed * 2)
  585 |         } else {
  586 |             // No def levels, should be 1:1 mapping from levels to values
  587 |             self.current = start + num_values;
  588 |             self.to_slice.slice_with_length(start * 2, num_values * 2)
  589 |         }
  590 |     }
  591 | }
  592 | 
  593 | /// This tells us how an array handles definition.  Given a stack of
  594 | /// these and a nested array and a set of definition levels we can calculate
  595 | /// how we should interpret the definition levels.
  596 | ///
  597 | /// For example, if the interpretation is [AllValidItem, NullableItem] then
  598 | /// a 0 means "valid item" and a 1 means "null struct".  If the interpretation
  599 | /// is [NullableItem, NullableItem] then a 0 means "valid item" and a 1 means
  600 | /// "null item" and a 2 means "null struct".
  601 | ///
  602 | /// Lists are tricky because we might use up to two definition levels for a
  603 | /// single layer of list nesting because we need one value to indicate "empty list"
  604 | /// and another value to indicate "null list".
  605 | #[derive(Debug, Copy, Clone, PartialEq, Eq)]
  606 | pub enum DefinitionInterpretation {
  607 |     AllValidItem,
  608 |     AllValidList,
  609 |     NullableItem,
  610 |     NullableList,
  611 |     EmptyableList,
  612 |     NullableAndEmptyableList,
  613 | }
  614 | 
  615 | impl DefinitionInterpretation {
  616 |     /// How many definition levels do we need for this layer
  617 |     pub fn num_def_levels(&self) -> u16 {
  618 |         match self {
  619 |             Self::AllValidItem => 0,
  620 |             Self::AllValidList => 0,
  621 |             Self::NullableItem => 1,
  622 |             Self::NullableList => 1,
  623 |             Self::EmptyableList => 1,
  624 |             Self::NullableAndEmptyableList => 2,
  625 |         }
  626 |     }
  627 | 
  628 |     /// Does this layer have nulls?
  629 |     pub fn is_all_valid(&self) -> bool {
  630 |         matches!(
  631 |             self,
  632 |             Self::AllValidItem | Self::AllValidList | Self::EmptyableList
  633 |         )
  634 |     }
  635 | 
  636 |     /// Does this layer represent a list?
  637 |     pub fn is_list(&self) -> bool {
  638 |         matches!(
  639 |             self,
  640 |             Self::AllValidList
  641 |                 | Self::NullableList
  642 |                 | Self::EmptyableList
  643 |                 | Self::NullableAndEmptyableList
  644 |         )
  645 |     }
  646 | }
  647 | 
  648 | /// The RepDefBuilder is used to collect offsets & validity buffers
  649 | /// from arrow structures.  Once we have those we use the SerializerContext
  650 | /// to build the actual repetition and definition levels.
  651 | ///
  652 | /// We know ahead of time how many rep/def levels we will need (number of items
  653 | /// in inner-most array + the number of empty/null lists in any parent arrays).
  654 | ///
  655 | /// As a result we try and avoid any re-allocations by pre-allocating the buffers
  656 | /// up front.  We allocate two copies of each buffer which allows us to avoid unsafe
  657 | /// code caused by reading and writing to the same buffer (also, it's unavoidable
  658 | /// because there are times we need to write 'faster' than we read)
  659 | #[derive(Debug)]
  660 | struct SerializerContext {
  661 |     // This is built from outer-to-inner and then reversed at the end
  662 |     def_meaning: Vec<DefinitionInterpretation>,
  663 |     rep_levels: LevelBuffer,
  664 |     spare_rep: LevelBuffer,
  665 |     def_levels: LevelBuffer,
  666 |     spare_def: LevelBuffer,
  667 |     current_rep: u16,
  668 |     current_def: u16,
  669 |     current_len: usize,
  670 |     current_num_specials: usize,
  671 |     has_fsl: bool,
  672 | }
  673 | 
  674 | impl SerializerContext {
  675 |     fn new(len: usize, num_layers: usize, max_rep: u16, max_def: u16) -> Self {
  676 |         let def_meaning = Vec::with_capacity(num_layers);
  677 |         Self {
  678 |             rep_levels: if max_rep > 0 {
  679 |                 vec![0; len]
  680 |             } else {
  681 |                 LevelBuffer::default()
  682 |             },
  683 |             spare_rep: if max_rep > 0 {
  684 |                 vec![0; len]
  685 |             } else {
  686 |                 LevelBuffer::default()
  687 |             },
  688 |             def_levels: if max_def > 0 {
  689 |                 vec![0; len]
  690 |             } else {
  691 |                 LevelBuffer::default()
  692 |             },
  693 |             spare_def: if max_def > 0 {
  694 |                 vec![0; len]
  695 |             } else {
  696 |                 LevelBuffer::default()
  697 |             },
  698 |             def_meaning,
  699 |             current_rep: max_rep,
  700 |             current_def: max_def,
  701 |             current_len: 0,
  702 |             current_num_specials: 0,
  703 |             has_fsl: false,
  704 |         }
  705 |     }
  706 | 
  707 |     fn checkout_def(&mut self, meaning: DefinitionInterpretation) -> u16 {
  708 |         let def = self.current_def;
  709 |         self.current_def -= meaning.num_def_levels();
  710 |         self.def_meaning.push(meaning);
  711 |         def
  712 |     }
  713 | 
  714 |     fn record_offsets(&mut self, offset_desc: &OffsetDesc) {
  715 |         let rep_level = self.current_rep;
  716 |         let (null_list_level, empty_list_level) =
  717 |             match (offset_desc.validity.is_some(), offset_desc.has_empty_lists) {
  718 |                 (true, true) => {
  719 |                     let level =
  720 |                         self.checkout_def(DefinitionInterpretation::NullableAndEmptyableList);
  721 |                     (level - 1, level)
  722 |                 }
  723 |                 (true, false) => (self.checkout_def(DefinitionInterpretation::NullableList), 0),
  724 |                 (false, true) => (
  725 |                     0,
  726 |                     self.checkout_def(DefinitionInterpretation::EmptyableList),
  727 |                 ),
  728 |                 (false, false) => {
  729 |                     self.checkout_def(DefinitionInterpretation::AllValidList);
  730 |                     (0, 0)
  731 |                 }
  732 |             };
  733 |         self.current_rep -= 1;
  734 | 
  735 |         if let Some(validity) = &offset_desc.validity {
  736 |             self.do_record_validity(validity, null_list_level);
  737 |         }
  738 | 
  739 |         // We write into the spare buffers and read from the active buffers
  740 |         // and then swap at the end.  This way we don't write over what we
  741 |         // are reading.
  742 | 
  743 |         let mut new_len = 0;
  744 |         let expected_len = offset_desc.num_values + self.current_num_specials;
  745 |         if expected_len == 0 {
  746 |             // Offsets [0] mean no list values, so no levels.
  747 |             self.current_len = 0;
  748 |             return;
  749 |         }
  750 |         assert!(self.rep_levels.len() >= expected_len - 1);
  751 |         if self.def_levels.is_empty() {
  752 |             let mut write_itr = self.spare_rep.iter_mut();
  753 |             let mut read_iter = self.rep_levels.iter().copied();
  754 |             for w in offset_desc.offsets.windows(2) {
  755 |                 let len = w[1] - w[0];
  756 |                 // len can't be 0 because then we'd have def levels
  757 |                 assert!(len > 0);
  758 |                 let rep = read_iter.next().unwrap();
  759 |                 let list_level = if rep == 0 { rep_level } else { rep };
  760 |                 *write_itr.next().unwrap() = list_level;
  761 | 
  762 |                 for _ in 1..len {
  763 |                     *write_itr.next().unwrap() = 0;
  764 |                 }
  765 |                 new_len += len as usize;
  766 |             }
  767 |             std::mem::swap(&mut self.rep_levels, &mut self.spare_rep);
  768 |         } else {
  769 |             assert!(self.def_levels.len() >= expected_len - 1);
  770 |             let mut def_write_itr = self.spare_def.iter_mut();
  771 |             let mut rep_write_itr = self.spare_rep.iter_mut();
  772 |             let mut rep_read_itr = self.rep_levels.iter().copied();
  773 |             let mut def_read_itr = self.def_levels.iter().copied();
  774 |             let specials_to_pass = self.current_num_specials;
  775 |             let mut specials_passed = 0;
  776 | 
  777 |             for w in offset_desc.offsets.windows(2) {
  778 |                 let mut def = def_read_itr.next().unwrap();
  779 |                 // Copy over any higher-level special values in place
  780 |                 while def > SPECIAL_THRESHOLD {
  781 |                     *def_write_itr.next().unwrap() = def;
  782 |                     *rep_write_itr.next().unwrap() = rep_read_itr.next().unwrap();
  783 |                     def = def_read_itr.next().unwrap();
  784 |                     new_len += 1;
  785 |                     specials_passed += 1;
  786 |                 }
  787 | 
  788 |                 let len = w[1] - w[0];
  789 |                 let rep = rep_read_itr.next().unwrap();
  790 | 
  791 |                 // If the rep_level is 0 then we are the first list level
  792 |                 // otherwise we are starting a higher level list so keep
  793 |                 // existing rep level
  794 |                 let list_level = if rep == 0 { rep_level } else { rep };
  795 | 
  796 |                 if def == 0 && len > 0 {
  797 |                     // New valid list, write a rep level and then add new 0/0 items
  798 |                     *def_write_itr.next().unwrap() = 0;
  799 |                     *rep_write_itr.next().unwrap() = list_level;
  800 | 
  801 |                     for _ in 1..len {
  802 |                         *def_write_itr.next().unwrap() = 0;
  803 |                         *rep_write_itr.next().unwrap() = 0;
  804 |                     }
  805 | 
  806 |                     new_len += len as usize;
  807 |                 } else if def == 0 {
  808 |                     // Empty list, insert new special
  809 |                     *def_write_itr.next().unwrap() = empty_list_level + SPECIAL_THRESHOLD;
  810 |                     *rep_write_itr.next().unwrap() = list_level;
  811 |                     new_len += 1;
  812 |                 } else {
  813 |                     // Either the list is null or one of its struct parents
  814 |                     // is null.  Promote it to a special value.
  815 |                     *def_write_itr.next().unwrap() = def + SPECIAL_THRESHOLD;
  816 |                     *rep_write_itr.next().unwrap() = list_level;
  817 |                     new_len += 1;
  818 |                 }
  819 |             }
  820 | 
  821 |             // If we have any special values at the end, we need to copy them over
  822 |             while specials_passed < specials_to_pass {
  823 |                 *def_write_itr.next().unwrap() = def_read_itr.next().unwrap();
  824 |                 *rep_write_itr.next().unwrap() = rep_read_itr.next().unwrap();
  825 |                 new_len += 1;
  826 |                 specials_passed += 1;
  827 |             }
  828 |             std::mem::swap(&mut self.def_levels, &mut self.spare_def);
  829 |             std::mem::swap(&mut self.rep_levels, &mut self.spare_rep);
  830 |         }
  831 | 
  832 |         self.current_len = new_len;
  833 |         self.current_num_specials += offset_desc.num_specials;
  834 |     }
  835 | 
  836 |     fn do_record_validity(&mut self, validity: &BooleanBuffer, null_level: u16) {
  837 |         assert!(self.def_levels.len() >= validity.len() + self.current_num_specials);
  838 |         debug_assert!(
  839 |             self.current_len == 0 || self.current_len == validity.len() + self.current_num_specials
  840 |         );
  841 |         self.current_len = validity.len() + self.current_num_specials;
  842 | 
  843 |         let mut def_read_itr = self.def_levels.iter().copied();
  844 |         let mut def_write_itr = self.spare_def.iter_mut();
  845 | 
  846 |         let specials_to_pass = self.current_num_specials;
  847 |         let mut specials_passed = 0;
  848 | 
  849 |         for incoming_validity in validity.iter() {
  850 |             let mut def = def_read_itr.next().unwrap();
  851 |             while def > SPECIAL_THRESHOLD {
  852 |                 *def_write_itr.next().unwrap() = def;
  853 |                 def = def_read_itr.next().unwrap();
  854 |                 specials_passed += 1;
  855 |             }
  856 |             if def == 0 && !incoming_validity {
  857 |                 *def_write_itr.next().unwrap() = null_level;
  858 |             } else {
  859 |                 *def_write_itr.next().unwrap() = def;
  860 |             }
  861 |         }
  862 | 
  863 |         while specials_passed < specials_to_pass {
  864 |             *def_write_itr.next().unwrap() = def_read_itr.next().unwrap();
  865 |             specials_passed += 1;
  866 |         }
  867 | 
  868 |         std::mem::swap(&mut self.def_levels, &mut self.spare_def);
  869 |     }
  870 | 
  871 |     fn multiply_levels(&mut self, multiplier: usize) {
  872 |         let old_len = self.current_len;
  873 |         // All non-special values will be broadcasted by the multiplier.  Special values are copied as-is.
  874 |         self.current_len =
  875 |             (self.current_len - self.current_num_specials) * multiplier + self.current_num_specials;
  876 | 
  877 |         if self.rep_levels.is_empty() && self.def_levels.is_empty() {
  878 |             // All valid with no rep/def levels, nothing to do
  879 |             return;
  880 |         } else if self.rep_levels.is_empty() {
  881 |             assert!(self.def_levels.len() >= self.current_len);
  882 |             // No rep levels, just multiply the def levels
  883 |             let mut def_read_itr = self.def_levels.iter().copied();
  884 |             let mut def_write_itr = self.spare_def.iter_mut();
  885 |             for _ in 0..old_len {
  886 |                 let mut def = def_read_itr.next().unwrap();
  887 |                 while def > SPECIAL_THRESHOLD {
  888 |                     *def_write_itr.next().unwrap() = def;
  889 |                     def = def_read_itr.next().unwrap();
  890 |                 }
  891 |                 for _ in 0..multiplier {
  892 |                     *def_write_itr.next().unwrap() = def;
  893 |                 }
  894 |             }
  895 |         } else if self.def_levels.is_empty() {
  896 |             assert!(self.rep_levels.len() >= self.current_len);
  897 |             // No def levels, just multiply the rep levels
  898 |             let mut rep_read_itr = self.rep_levels.iter().copied();
  899 |             let mut rep_write_itr = self.spare_rep.iter_mut();
  900 |             for _ in 0..old_len {
  901 |                 let rep = rep_read_itr.next().unwrap();
  902 |                 for _ in 0..multiplier {
  903 |                     *rep_write_itr.next().unwrap() = rep;
  904 |                 }
  905 |             }
  906 |         } else {
  907 |             assert!(self.rep_levels.len() >= self.current_len);
  908 |             assert!(self.def_levels.len() >= self.current_len);
  909 |             let mut rep_read_itr = self.rep_levels.iter().copied();
  910 |             let mut def_read_itr = self.def_levels.iter().copied();
  911 |             let mut rep_write_itr = self.spare_rep.iter_mut();
  912 |             let mut def_write_itr = self.spare_def.iter_mut();
  913 |             for _ in 0..old_len {
  914 |                 let mut def = def_read_itr.next().unwrap();
  915 |                 while def > SPECIAL_THRESHOLD {
  916 |                     *def_write_itr.next().unwrap() = def;
  917 |                     *rep_write_itr.next().unwrap() = rep_read_itr.next().unwrap();
  918 |                     def = def_read_itr.next().unwrap();
  919 |                 }
  920 |                 let rep = rep_read_itr.next().unwrap();
  921 |                 for _ in 0..multiplier {
  922 |                     *def_write_itr.next().unwrap() = def;
  923 |                     *rep_write_itr.next().unwrap() = rep;
  924 |                 }
  925 |             }
  926 |         }
  927 |         std::mem::swap(&mut self.def_levels, &mut self.spare_def);
  928 |         std::mem::swap(&mut self.rep_levels, &mut self.spare_rep);
  929 |     }
  930 | 
  931 |     fn record_validity_buf(&mut self, validity: &Option<BooleanBuffer>) {
  932 |         if let Some(validity) = validity {
  933 |             let def_level = self.checkout_def(DefinitionInterpretation::NullableItem);
  934 |             self.do_record_validity(validity, def_level);
  935 |         } else {
  936 |             self.checkout_def(DefinitionInterpretation::AllValidItem);
  937 |         }
  938 |     }
  939 | 
  940 |     fn record_validity(&mut self, validity_desc: &ValidityDesc) {
  941 |         self.record_validity_buf(&validity_desc.validity)
  942 |     }
  943 | 
  944 |     fn record_fsl(&mut self, fsl_desc: &FslDesc) {
  945 |         self.has_fsl = true;
  946 |         self.record_validity_buf(&fsl_desc.validity);
  947 |         self.multiply_levels(fsl_desc.dimension);
  948 |     }
  949 | 
  950 |     fn normalize_specials(&mut self) {
  951 |         for def in self.def_levels.iter_mut() {
  952 |             if *def > SPECIAL_THRESHOLD {
  953 |                 *def -= SPECIAL_THRESHOLD;
  954 |             }
  955 |         }
  956 |     }
  957 | 
  958 |     fn normalize_specials_and_plan_splits(
  959 |         &mut self,
  960 |         def_meaning: &[DefinitionInterpretation],
  961 |         max_levels_per_page: Option<u64>,
  962 |         num_rows: u64,
  963 |         num_values: u64,
  964 |     ) -> Result<MiniBlockRepDefBudget> {
  965 |         // Extremely sparse lists can have many rep/def levels for very few
  966 |         // visible leaf values.  If this ratio becomes too skewed then a
  967 |         // mini-block rep/def chunk can exceed its packed metadata budget even
  968 |         // though the value buffers are small.  We detect that case while
  969 |         // normalizing special def levels and split on top-level row boundaries
  970 |         // so each emitted dense mini-block page stays within the budget.
  971 |         if self.def_levels.is_empty() {
  972 |             return Ok(MiniBlockRepDefBudget::WithinBudget);
  973 |         }
  974 | 
  975 |         if self.rep_levels.is_empty() {
  976 |             self.normalize_specials();
  977 |             return Ok(MiniBlockRepDefBudget::WithinBudget);
  978 |         }
  979 | 
  980 |         if self.rep_levels.len() != self.def_levels.len() {
  981 |             return Err(Error::internal(format!(
  982 |                 "Cannot plan structural page splits with mismatched rep/def lengths: rep={}, def={}",
  983 |                 self.rep_levels.len(),
  984 |                 self.def_levels.len()
  985 |             )));
  986 |         }
  987 | 
  988 |         let Some(max_levels_per_page) = max_levels_per_page else {
  989 |             self.normalize_specials();
  990 |             return Ok(MiniBlockRepDefBudget::WithinBudget);
  991 |         };
  992 | 
  993 |         if num_values == 0 {
  994 |             self.normalize_specials();
  995 |             return Ok(MiniBlockRepDefBudget::WithinBudget);
  996 |         }
  997 | 
  998 |         let max_schema_rep = def_meaning.iter().filter(|level| level.is_list()).count() as u16;
  999 |         let max_visible_level = SerializedRepDefs::max_visible_level(def_meaning);
 1000 |         let should_plan = !self.has_fsl && max_schema_rep > 0 && max_visible_level.is_some();
 1001 | 
 1002 |         if !should_plan {
 1003 |             self.normalize_specials();
 1004 |             return Ok(MiniBlockRepDefBudget::WithinBudget);
 1005 |         }
 1006 | 
 1007 |         let max_visible_level = max_visible_level.unwrap();
 1008 |         let mut splits = Vec::new();
 1009 |         let mut counted_rows = 0u64;
 1010 |         let mut counted_values = 0u64;
 1011 |         let mut saw_structural_overhead = false;
 1012 |         let mut single_row_over_budget_levels = None;
 1013 | 
 1014 |         let mut current_row_level_start = None;
 1015 |         let mut current_row_num_values = 0u64;
 1016 | 
 1017 |         let mut current_page_row_start = 0u64;
 1018 |         let mut current_page_num_rows = 0u64;
 1019 |         let mut current_page_level_start = 0usize;
 1020 |         let mut current_page_level_end = 0usize;
 1021 |         let mut current_page_value_start = 0u64;
 1022 |         let mut current_page_num_values = 0u64;
 1023 |         let mut current_page_num_levels = 0u64;
 1024 |         let mut current_page_has_structural_overhead = false;
 1025 | 
 1026 |         let mut finish_row =
 1027 |             |row_level_start: usize, row_level_end: usize, row_num_values: u64| -> Result<()> {
 1028 |                 let row_num_levels = (row_level_end - row_level_start) as u64;
 1029 |                 let row_has_structural_overhead = row_num_levels > row_num_values;
 1030 |                 saw_structural_overhead |= row_has_structural_overhead;
 1031 | 
 1032 |                 if row_has_structural_overhead && row_num_levels > max_levels_per_page {
 1033 |                     single_row_over_budget_levels = Some(row_num_levels);
 1034 |                 }
 1035 | 
 1036 |                 if current_page_num_rows > 0
 1037 |                     && (current_page_has_structural_overhead || row_has_structural_overhead)
 1038 |                     && current_page_num_levels + row_num_levels > max_levels_per_page
 1039 |                 {
 1040 |                     splits.push(MiniBlockRepDefSplit {
 1041 |                         row_start: current_page_row_start,
 1042 |                         num_rows: current_page_num_rows,
 1043 |                         level_range: current_page_level_start..current_page_level_end,
 1044 |                         value_start: current_page_value_start,
 1045 |                         num_values: current_page_num_values,
 1046 |                     });
 1047 |                     current_page_row_start = counted_rows;
 1048 |                     current_page_num_rows = 0;
 1049 |                     current_page_level_start = row_level_start;
 1050 |                     current_page_value_start = counted_values;
 1051 |                     current_page_num_values = 0;
 1052 |                     current_page_num_levels = 0;
 1053 |                     current_page_has_structural_overhead = false;
 1054 |                 }
 1055 | 
 1056 |                 if current_page_num_rows == 0 {
 1057 |                     current_page_level_start = row_level_start;
 1058 |                 }
 1059 |                 current_page_num_rows += 1;
 1060 |                 current_page_level_end = row_level_end;
 1061 |                 current_page_num_values += row_num_values;
 1062 |                 current_page_num_levels += row_num_levels;
 1063 |                 current_page_has_structural_overhead |= row_has_structural_overhead;
 1064 |                 counted_rows += 1;
 1065 |                 counted_values += row_num_values;
 1066 |                 Ok(())
 1067 |             };
 1068 | 
 1069 |         for (idx, (rep_level, def_level)) in self
 1070 |             .rep_levels
 1071 |             .iter()
 1072 |             .copied()
 1073 |             .zip(self.def_levels.iter_mut())
 1074 |             .enumerate()
 1075 |         {
 1076 |             if *def_level > SPECIAL_THRESHOLD {
 1077 |                 *def_level -= SPECIAL_THRESHOLD;
 1078 |             }
 1079 | 
 1080 |             if rep_level == max_schema_rep {
 1081 |                 if let Some(level_start) = current_row_level_start {
 1082 |                     finish_row(level_start, idx, current_row_num_values)?;
 1083 |                     current_row_num_values = 0;
 1084 |                 } else if idx != 0 {
 1085 |                     return Err(Error::internal(format!(
 1086 |                         "Cannot plan structural page splits: first top-level row starts at level {}, expected 0",
 1087 |                         idx
 1088 |                     )));
 1089 |                 }
 1090 |                 current_row_level_start = Some(idx);
 1091 |             }
 1092 | 
 1093 |             if current_row_level_start.is_none() {
 1094 |                 return Err(Error::internal(
 1095 |                     "Cannot plan structural page splits: found levels before the first top-level row start",
 1096 |                 ));
 1097 |             }
 1098 |             if *def_level <= max_visible_level {
 1099 |                 current_row_num_values += 1;
 1100 |             }
 1101 |         }
 1102 | 
 1103 |         let Some(level_start) = current_row_level_start else {
 1104 |             return Err(Error::internal(
 1105 |                 "Cannot plan structural page splits: found no top-level row starts",
 1106 |             ));
 1107 |         };
 1108 |         finish_row(level_start, self.rep_levels.len(), current_row_num_values)?;
 1109 | 
 1110 |         if counted_rows != num_rows {
 1111 |             return Err(Error::internal(format!(
 1112 |                 "Cannot plan structural page splits: expected {} top-level row starts, found {}",
 1113 |                 num_rows, counted_rows
 1114 |             )));
 1115 |         }
 1116 |         if counted_values != num_values {
 1117 |             return Err(Error::internal(format!(
 1118 |                 "Cannot plan structural page splits: counted {} visible values, expected {}",
 1119 |                 counted_values, num_values
 1120 |             )));
 1121 |         }
 1122 |         if !saw_structural_overhead {
 1123 |             return Ok(MiniBlockRepDefBudget::WithinBudget);
 1124 |         }
 1125 |         if let Some(row_num_levels) = single_row_over_budget_levels {
 1126 |             return Ok(MiniBlockRepDefBudget::SingleRowOverBudget(row_num_levels));
 1127 |         }
 1128 | 
 1129 |         if current_page_num_rows > 0 {
 1130 |             splits.push(MiniBlockRepDefSplit {
 1131 |                 row_start: current_page_row_start,
 1132 |                 num_rows: current_page_num_rows,
 1133 |                 level_range: current_page_level_start..current_page_level_end,
 1134 |                 value_start: current_page_value_start,
 1135 |                 num_values: current_page_num_values,
 1136 |             });
 1137 |         }
 1138 | 
 1139 |         if splits.len() > 1 {
 1140 |             Ok(MiniBlockRepDefBudget::RequiresPageSplit(splits))
 1141 |         } else {
 1142 |             Ok(MiniBlockRepDefBudget::WithinBudget)
 1143 |         }
 1144 |     }
 1145 | 
 1146 |     fn build(mut self) -> SerializedRepDefs {
 1147 |         if self.current_len == 0 {
 1148 |             return SerializedRepDefs::new_with_fixed_size_list_levels(
 1149 |                 None,
 1150 |                 None,
 1151 |                 self.def_meaning,
 1152 |                 self.has_fsl,
 1153 |             );
 1154 |         }
 1155 | 
 1156 |         self.normalize_specials();
 1157 | 
 1158 |         let definition_levels = if self.def_levels.is_empty() {
 1159 |             None
 1160 |         } else {
 1161 |             Some(self.def_levels)
 1162 |         };
 1163 |         let repetition_levels = if self.rep_levels.is_empty() {
 1164 |             None
 1165 |         } else {
 1166 |             Some(self.rep_levels)
 1167 |         };
 1168 | 
 1169 |         // Need to reverse the def meaning since we build rep / def levels in reverse
 1170 |         let def_meaning = self.def_meaning.into_iter().rev().collect::<Vec<_>>();
 1171 | 
 1172 |         SerializedRepDefs::new_with_fixed_size_list_levels(
 1173 |             repetition_levels,
 1174 |             definition_levels,
 1175 |             def_meaning,
 1176 |             self.has_fsl,
 1177 |         )
 1178 |     }
 1179 | 
 1180 |     fn build_with_miniblock_repdef_budget(
 1181 |         mut self,
 1182 |         max_levels_per_page: Option<u64>,
 1183 |         num_rows: u64,
 1184 |         num_values: u64,
 1185 |     ) -> Result<(SerializedRepDefs, MiniBlockRepDefBudget)> {
 1186 |         if self.current_len == 0 {
 1187 |             return Ok((
 1188 |                 SerializedRepDefs::new_with_fixed_size_list_levels(
 1189 |                     None,
 1190 |                     None,
 1191 |                     self.def_meaning,
 1192 |                     self.has_fsl,
 1193 |                 ),
 1194 |                 MiniBlockRepDefBudget::WithinBudget,
 1195 |             ));
 1196 |         }
 1197 | 
 1198 |         // Need to reverse the def meaning since we build rep / def levels in reverse
 1199 |         let def_meaning = std::mem::take(&mut self.def_meaning)
 1200 |             .into_iter()
 1201 |             .rev()
 1202 |             .collect::<Vec<_>>();
 1203 |         let budget = self.normalize_specials_and_plan_splits(
 1204 |             &def_meaning,
 1205 |             max_levels_per_page,
 1206 |             num_rows,
 1207 |             num_values,
 1208 |         )?;
 1209 | 
 1210 |         let definition_levels = if self.def_levels.is_empty() {
 1211 |             None
 1212 |         } else {
 1213 |             Some(self.def_levels)
 1214 |         };
 1215 |         let repetition_levels = if self.rep_levels.is_empty() {
 1216 |             None
 1217 |         } else {
 1218 |             Some(self.rep_levels)
 1219 |         };
 1220 | 
 1221 |         Ok((
 1222 |             SerializedRepDefs::new_with_fixed_size_list_levels(
 1223 |                 repetition_levels,
 1224 |                 definition_levels,
 1225 |                 def_meaning,
 1226 |                 self.has_fsl,
 1227 |             ),
 1228 |             budget,
 1229 |         ))
 1230 |     }
 1231 | }
 1232 | 
 1233 | /// A structure used to collect validity buffers and offsets from arrow
 1234 | /// arrays and eventually create repetition and definition levels
 1235 | ///
 1236 | /// As we are encoding the structural encoders are given this struct and
 1237 | /// will record the arrow information into it.  Once we hit a leaf node we
 1238 | /// serialize the data into rep/def levels and write these into the page.
 1239 | #[derive(Clone, Default, Debug)]
 1240 | pub struct RepDefBuilder {
 1241 |     // The rep/def info we have collected so far
 1242 |     repdefs: Vec<RawRepDef>,
 1243 |     // The current length, can get larger as we traverse lists (e.g. an
 1244 |     // array might have 5 lists which results in 50 items)
 1245 |     //
 1246 |     // Starts uninitialized until we see the first rep/def item
 1247 |     len: Option<usize>,
 1248 | }
 1249 | 
 1250 | impl RepDefBuilder {
 1251 |     fn check_validity_len(&mut self, incoming_len: usize) {
 1252 |         if let Some(len) = self.len {
 1253 |             assert_eq!(incoming_len, len);
 1254 |         } else {
 1255 |             // First validity buffer we've seen
 1256 |             self.len = Some(incoming_len);
 1257 |         }
 1258 |     }
 1259 | 
 1260 |     fn num_layers(&self) -> usize {
 1261 |         self.repdefs.len()
 1262 |     }
 1263 | 
 1264 |     /// The builder is "empty" if there is no repetition and no nulls.  In this case we don't need
 1265 |     /// to store anything to disk (except the description)
 1266 |     pub fn is_empty(&self) -> bool {
 1267 |         self.repdefs
 1268 |             .iter()
 1269 |             .all(|r| matches!(r, RawRepDef::Validity(ValidityDesc { validity: None, .. })))
 1270 |     }
 1271 | 
 1272 |     /// Returns true if there is only a single layer of definition
 1273 |     pub fn is_simple_validity(&self) -> bool {
 1274 |         self.repdefs.len() == 1 && matches!(self.repdefs[0], RawRepDef::Validity(_))
 1275 |     }
 1276 | 
 1277 |     /// Registers a nullable validity bitmap
 1278 |     pub fn add_validity_bitmap(&mut self, validity: NullBuffer) {
 1279 |         self.check_validity_len(validity.len());
 1280 |         if validity.null_count() == 0 {
 1281 |             self.add_no_null(validity.len());
 1282 |             return;
 1283 |         }
 1284 |         self.repdefs.push(RawRepDef::Validity(ValidityDesc {
 1285 |             num_values: validity.len(),
 1286 |             validity: Some(validity.into_inner()),
 1287 |         }));
 1288 |     }
 1289 | 
 1290 |     /// Registers an all-valid validity layer
 1291 |     pub fn add_no_null(&mut self, len: usize) {
 1292 |         self.check_validity_len(len);
 1293 |         self.repdefs.push(RawRepDef::Validity(ValidityDesc {
 1294 |             validity: None,
 1295 |             num_values: len,
 1296 |         }));
 1297 |     }
 1298 | 
 1299 |     pub fn add_fsl(&mut self, validity: Option<NullBuffer>, dimension: usize, num_values: usize) {
 1300 |         if let Some(len) = self.len {
 1301 |             assert_eq!(num_values, len);
 1302 |         }
 1303 |         self.len = Some(num_values * dimension);
 1304 |         debug_assert!(validity.is_none() || validity.as_ref().unwrap().len() == num_values);
 1305 |         self.repdefs.push(RawRepDef::Fsl(FslDesc {
 1306 |             num_values,
 1307 |             validity: validity.map(|v| v.into_inner()),
 1308 |             dimension,
 1309 |         }))
 1310 |     }
 1311 | 
 1312 |     fn check_offset_len(&mut self, offsets: &[i64]) {
 1313 |         if let Some(len) = self.len {
 1314 |             assert!(offsets.len() == len + 1);
 1315 |         }
 1316 |         self.len = Some(offsets[offsets.len() - 1] as usize);
 1317 |     }
 1318 | 
 1319 |     fn do_add_offsets(
 1320 |         &mut self,
 1321 |         lengths: impl Iterator<Item = i64>,
 1322 |         validity: Option<NullBuffer>,
 1323 |         capacity: usize,
 1324 |     ) -> bool {
 1325 |         let mut num_specials = 0;
 1326 |         let mut has_empty_lists = false;
 1327 |         let mut has_garbage_values = false;
 1328 |         let mut last_off: i64 = 0;
 1329 | 
 1330 |         let mut normalized_offsets = Vec::with_capacity(capacity);
 1331 |         normalized_offsets.push(0);
 1332 | 
 1333 |         if let Some(ref validity) = validity {
 1334 |             for (len, is_valid) in lengths.zip(validity.iter()) {
 1335 |                 match (is_valid, len == 0) {
 1336 |                     (false, is_empty) => {
 1337 |                         num_specials += 1;
 1338 |                         has_garbage_values |= !is_empty;
 1339 |                     }
 1340 |                     (true, true) => {
 1341 |                         num_specials += 1;
 1342 |                         has_empty_lists = true;
 1343 |                     }
 1344 |                     _ => {
 1345 |                         last_off += len;
 1346 |                     }
 1347 |                 }
 1348 |                 normalized_offsets.push(last_off);
 1349 |             }
 1350 |         } else {
 1351 |             for len in lengths {
 1352 |                 if len == 0 {
 1353 |                     num_specials += 1;
 1354 |                     has_empty_lists = true;
 1355 |                 }
 1356 |                 last_off += len;
 1357 |                 normalized_offsets.push(last_off);
 1358 |             }
 1359 |         }
 1360 | 
 1361 |         self.check_offset_len(&normalized_offsets);
 1362 |         self.repdefs.push(RawRepDef::Offsets(OffsetDesc {
 1363 |             num_values: normalized_offsets.len() - 1,
 1364 |             offsets: normalized_offsets.into(),
 1365 |             validity: validity.map(|v| v.into_inner()),
 1366 |             has_empty_lists,
 1367 |             num_specials: num_specials as usize,
 1368 |         }));
 1369 | 
 1370 |         has_garbage_values
 1371 |     }
 1372 | 
 1373 |     /// Adds a layer of offsets
 1374 |     ///
 1375 |     /// Offsets are casted to a common type (i64) and also normalized.  Null lists are
 1376 |     /// always represented by a zero-length (identical) pair of offsets and so the caller
 1377 |     /// should filter out any garbage items before encoding them.  To assist with this the
 1378 |     /// method will return true if any non-empty null lists were found.
 1379 |     pub fn add_offsets<O: OffsetSizeTrait>(
 1380 |         &mut self,
 1381 |         offsets: OffsetBuffer<O>,
 1382 |         validity: Option<NullBuffer>,
 1383 |     ) -> bool {
 1384 |         let inner = offsets.into_inner();
 1385 |         let buffer_len = inner.len();
 1386 | 
 1387 |         if O::IS_LARGE {
 1388 |             let i64_buff = ScalarBuffer::<i64>::new(inner.into_inner(), 0, buffer_len);
 1389 |             let lengths = i64_buff.windows(2).map(|off| off[1] - off[0]);
 1390 |             self.do_add_offsets(lengths, validity, buffer_len)
 1391 |         } else {
 1392 |             let i32_buff = ScalarBuffer::<i32>::new(inner.into_inner(), 0, buffer_len);
 1393 |             let lengths = i32_buff.windows(2).map(|off| (off[1] - off[0]) as i64);
 1394 |             self.do_add_offsets(lengths, validity, buffer_len)
 1395 |         }
 1396 |     }
 1397 | 
 1398 |     // When we are encoding data it arrives in batches.  For each batch we create a RepDefBuilder and collect the
 1399 |     // various validity buffers and offset buffers from that batch.  Once we have enough batches to write a page we
 1400 |     // need to take this collection of RepDefBuilders and concatenate them and then serialize them into rep/def levels.
 1401 |     //
 1402 |     // TODO: In the future, we may concatenate and serialize at the same time?
 1403 |     //
 1404 |     // This method takes care of the concatenation part.  First we collect all of layer 0 from each builder, then we
 1405 |     // call this method.  Then we collect all of layer 1 from each builder and call this method.  And so on.
 1406 |     //
 1407 |     // That means this method should get a collection of `RawRepDef` where each item is the same kind (all validity or
 1408 |     // all offsets) though the nullability / lengths may be different in each layer.
 1409 |     fn concat_layers<'a>(
 1410 |         layers: impl Iterator<Item = &'a RawRepDef>,
 1411 |         num_layers: usize,
 1412 |     ) -> RawRepDef {
 1413 |         enum LayerKind {
 1414 |             Validity,
 1415 |             Fsl,
 1416 |             Offsets,
 1417 |         }
 1418 | 
 1419 |         // We make two passes through the layers.  The first determines if we need to pay the cost of allocating
 1420 |         // buffers.  The second pass actually adds the values.
 1421 |         let mut collected = Vec::with_capacity(num_layers);
 1422 |         let mut has_nulls = false;
 1423 |         let mut layer_kind = LayerKind::Validity;
 1424 |         let mut total_num_specials = 0;
 1425 |         let mut all_dimension = 0;
 1426 |         let mut all_has_empty_lists = false;
 1427 |         let mut all_num_values = 0;
 1428 |         for layer in layers {
 1429 |             has_nulls |= layer.has_nulls();
 1430 |             match layer {
 1431 |                 RawRepDef::Validity(_) => {
 1432 |                     layer_kind = LayerKind::Validity;
 1433 |                 }
 1434 |                 RawRepDef::Offsets(OffsetDesc {
 1435 |                     num_specials,
 1436 |                     has_empty_lists,
 1437 |                     ..
 1438 |                 }) => {
 1439 |                     all_has_empty_lists |= *has_empty_lists;
 1440 |                     layer_kind = LayerKind::Offsets;
 1441 |                     total_num_specials += num_specials;
 1442 |                 }
 1443 |                 RawRepDef::Fsl(FslDesc { dimension, .. }) => {
 1444 |                     layer_kind = LayerKind::Fsl;
 1445 |                     all_dimension = *dimension;
 1446 |                 }
 1447 |             }
 1448 |             collected.push(layer);
 1449 |             all_num_values += layer.num_values();
 1450 |         }
 1451 | 
 1452 |         // Shortcut if there are no nulls
 1453 |         if !has_nulls {
 1454 |             match layer_kind {
 1455 |                 LayerKind::Validity => {
 1456 |                     return RawRepDef::Validity(ValidityDesc {
 1457 |                         validity: None,
 1458 |                         num_values: all_num_values,
 1459 |                     });
 1460 |                 }
 1461 |                 LayerKind::Fsl => {
 1462 |                     return RawRepDef::Fsl(FslDesc {
 1463 |                         validity: None,
 1464 |                         num_values: all_num_values,
 1465 |                         dimension: all_dimension,
 1466 |                     });
 1467 |                 }
 1468 |                 LayerKind::Offsets => {}
 1469 |             }
 1470 |         }
 1471 | 
 1472 |         // Only allocate if needed
 1473 |         let mut validity_builder = if has_nulls {
 1474 |             BooleanBufferBuilder::new(all_num_values)
 1475 |         } else {
 1476 |             BooleanBufferBuilder::new(0)
 1477 |         };
 1478 |         let mut all_offsets = if matches!(layer_kind, LayerKind::Offsets) {
 1479 |             let mut all_offsets = Vec::with_capacity(all_num_values);
 1480 |             all_offsets.push(0);
 1481 |             all_offsets
 1482 |         } else {
 1483 |             Vec::new()
 1484 |         };
 1485 | 
 1486 |         for layer in collected {
 1487 |             match layer {
 1488 |                 RawRepDef::Validity(ValidityDesc {
 1489 |                     validity: Some(validity),
 1490 |                     ..
 1491 |                 }) => {
 1492 |                     validity_builder.append_buffer(validity);
 1493 |                 }
 1494 |                 RawRepDef::Validity(ValidityDesc {
 1495 |                     validity: None,
 1496 |                     num_values,
 1497 |                 }) => {
 1498 |                     validity_builder.append_n(*num_values, true);
 1499 |                 }
 1500 |                 RawRepDef::Fsl(FslDesc {
 1501 |                     validity,
 1502 |                     num_values,
 1503 |                     ..
 1504 |                 }) => {
 1505 |                     if let Some(validity) = validity {
 1506 |                         validity_builder.append_buffer(validity);
 1507 |                     } else {
 1508 |                         validity_builder.append_n(*num_values, true);
 1509 |                     }
 1510 |                 }
 1511 |                 RawRepDef::Offsets(OffsetDesc {
 1512 |                     offsets,
 1513 |                     validity: Some(validity),
 1514 |                     has_empty_lists,
 1515 |                     ..
 1516 |                 }) => {
 1517 |                     all_has_empty_lists |= has_empty_lists;
 1518 |                     validity_builder.append_buffer(validity);
 1519 |                     let last = *all_offsets.last().unwrap();
 1520 |                     all_offsets.extend(offsets.iter().skip(1).map(|off| *off + last));
 1521 |                 }
 1522 |                 RawRepDef::Offsets(OffsetDesc {
 1523 |                     offsets,
 1524 |                     validity: None,
 1525 |                     has_empty_lists,
 1526 |                     num_values,
 1527 |                     ..
 1528 |                 }) => {
 1529 |                     all_has_empty_lists |= has_empty_lists;
 1530 |                     if has_nulls {
 1531 |                         validity_builder.append_n(*num_values, true);
 1532 |                     }
 1533 |                     let last = *all_offsets.last().unwrap();
 1534 |                     all_offsets.extend(offsets.iter().skip(1).map(|off| *off + last));
 1535 |                 }
 1536 |             }
 1537 |         }
 1538 |         let validity = if has_nulls {
 1539 |             Some(validity_builder.finish())
 1540 |         } else {
 1541 |             None
 1542 |         };
 1543 |         match layer_kind {
 1544 |             LayerKind::Fsl => RawRepDef::Fsl(FslDesc {
 1545 |                 validity,
 1546 |                 num_values: all_num_values,
 1547 |                 dimension: all_dimension,
 1548 |             }),
 1549 |             LayerKind::Validity => RawRepDef::Validity(ValidityDesc {
 1550 |                 validity,
 1551 |                 num_values: all_num_values,
 1552 |             }),
 1553 |             LayerKind::Offsets => RawRepDef::Offsets(OffsetDesc {
 1554 |                 offsets: all_offsets.into(),
 1555 |                 validity,
 1556 |                 has_empty_lists: all_has_empty_lists,
 1557 |                 num_values: all_num_values,
 1558 |                 num_specials: total_num_specials,
 1559 |             }),
 1560 |         }
 1561 |     }
 1562 | 
 1563 |     /// Converts the validity / offsets buffers that have been gathered so far
 1564 |     /// into repetition and definition levels
 1565 |     pub fn serialize(builders: Vec<Self>) -> SerializedRepDefs {
 1566 |         Self::normalize(builders).serialize()
 1567 |     }
 1568 | 
 1569 |     pub(crate) fn normalize(builders: Vec<Self>) -> NormalizedStructuralPlan {
 1570 |         assert!(!builders.is_empty());
 1571 |         let num_layers = builders[0].num_layers();
 1572 |         debug_assert!(
 1573 |             builders
 1574 |                 .iter()
 1575 |                 .all(|builder| builder.num_layers() == num_layers)
 1576 |         );
 1577 |         let layers = (0..num_layers)
 1578 |             .map(|layer_index| {
 1579 |                 Self::concat_layers(
 1580 |                     builders.iter().map(|b| &b.repdefs[layer_index]),
 1581 |                     builders.len(),
 1582 |                 )
 1583 |             })
 1584 |             .collect::<Vec<_>>();
 1585 |         NormalizedStructuralPlan {
 1586 |             layers,
 1587 |             dense_all_valid: builders.iter().all(Self::is_empty),
 1588 |         }
 1589 |     }
 1590 | }
 1591 | 
 1592 | /// Starts with serialized repetition and definition levels and unravels
 1593 | /// them into validity buffers and offsets buffers
 1594 | ///
 1595 | /// This is used during decoding to create the necessary arrow structures
 1596 | #[derive(Debug)]
 1597 | pub struct RepDefUnraveler {
 1598 |     sparse: Option<SparseStructuralUnraveler>,
 1599 |     rep_levels: Option<LevelBuffer>,
 1600 |     def_levels: Option<LevelBuffer>,
 1601 |     // Maps from definition level to the rep level at which that definition level is visible
 1602 |     levels_to_rep: Vec<u16>,
 1603 |     def_meaning: Arc<[DefinitionInterpretation]>,
 1604 |     // Current definition level to compare to.
 1605 |     current_def_cmp: u16,
 1606 |     // Current rep level, determines which specials we can see
 1607 |     current_rep_cmp: u16,
 1608 |     // Current layer index, 0 means inner-most layer and it counts up from there.  Used to index
 1609 |     // into special_defs
 1610 |     current_layer: usize,
 1611 |     // Number of items in the inner-most layer (needed if the definition levels are not present)
 1612 |     num_items: u64,
 1613 | }
 1614 | 
 1615 | impl RepDefUnraveler {
 1616 |     /// Creates a new unraveler from serialized repetition and definition information
 1617 |     pub fn new(
 1618 |         rep_levels: Option<LevelBuffer>,
 1619 |         def_levels: Option<LevelBuffer>,
 1620 |         def_meaning: Arc<[DefinitionInterpretation]>,
 1621 |         num_items: u64,
 1622 |     ) -> Self {
 1623 |         let mut levels_to_rep = Vec::with_capacity(def_meaning.len());
 1624 |         let mut rep_counter = 0;
 1625 |         // Level=0 is always visible and means valid item
 1626 |         levels_to_rep.push(0);
 1627 |         for meaning in def_meaning.as_ref() {
 1628 |             match meaning {
 1629 |                 DefinitionInterpretation::AllValidItem | DefinitionInterpretation::AllValidList => {
 1630 |                     // There is no corresponding level, so nothing to put in levels_to_rep
 1631 |                 }
 1632 |                 DefinitionInterpretation::NullableItem => {
 1633 |                     // Some null structs are not visible at inner rep levels in cases like LIST<STRUCT<LIST<...>>>
 1634 |                     levels_to_rep.push(rep_counter);
 1635 |                 }
 1636 |                 DefinitionInterpretation::NullableList => {
 1637 |                     rep_counter += 1;
 1638 |                     levels_to_rep.push(rep_counter);
 1639 |                 }
 1640 |                 DefinitionInterpretation::EmptyableList => {
 1641 |                     rep_counter += 1;
 1642 |                     levels_to_rep.push(rep_counter);
 1643 |                 }
 1644 |                 DefinitionInterpretation::NullableAndEmptyableList => {
 1645 |                     rep_counter += 1;
 1646 |                     levels_to_rep.push(rep_counter);
 1647 |                     levels_to_rep.push(rep_counter);
 1648 |                 }
 1649 |             }
 1650 |         }
 1651 |         Self {
 1652 |             sparse: None,
 1653 |             rep_levels,
 1654 |             def_levels,
 1655 |             current_def_cmp: 0,
 1656 |             current_rep_cmp: 0,
 1657 |             levels_to_rep,
 1658 |             current_layer: 0,
 1659 |             def_meaning,
 1660 |             num_items,
 1661 |         }
 1662 |     }
 1663 | 
 1664 |     pub(crate) fn new_sparse(plan: SparseStructuralPlan) -> Self {
 1665 |         Self {
 1666 |             sparse: Some(SparseStructuralUnraveler::new(plan)),
 1667 |             rep_levels: None,
 1668 |             def_levels: None,
 1669 |             levels_to_rep: Vec::new(),
 1670 |             def_meaning: Arc::new([]),
 1671 |             current_def_cmp: 0,
 1672 |             current_rep_cmp: 0,
 1673 |             current_layer: 0,
 1674 |             num_items: 0,
 1675 |         }
 1676 |     }
 1677 | 
 1678 |     fn ensure_exhausted(&self) -> Result<()> {
 1679 |         if let Some(sparse) = &self.sparse {
 1680 |             sparse.ensure_exhausted()?;
 1681 |         }
 1682 |         Ok(())
 1683 |     }
 1684 | 
 1685 |     fn is_sparse(&self) -> bool {
 1686 |         self.sparse.is_some()
 1687 |     }
 1688 | 
 1689 |     pub fn is_all_valid(&self) -> bool {
 1690 |         if let Some(sparse) = &self.sparse {
 1691 |             return sparse.is_all_valid();
 1692 |         }
 1693 |         self.def_levels.is_none() || self.def_meaning[self.current_layer].is_all_valid()
 1694 |     }
 1695 | 
 1696 |     /// If the current level is a repetition layer then this returns the number of lists
 1697 |     /// at this level.
 1698 |     ///
 1699 |     /// This is not valid to call when the current level is a struct/primitive layer because
 1700 |     /// in some cases there may be no rep or def information to know this.
 1701 |     pub fn max_lists(&self) -> Result<usize> {
 1702 |         if let Some(sparse) = &self.sparse {
 1703 |             return sparse.max_lists();
 1704 |         }
 1705 |         debug_assert!(
 1706 |             self.def_meaning[self.current_layer] != DefinitionInterpretation::NullableItem
 1707 |         );
 1708 |         Ok(self
 1709 |             .rep_levels
 1710 |             .as_ref()
 1711 |             // Worst case every rep item is max_rep and a new list
 1712 |             .map(|levels| levels.len())
 1713 |             .unwrap_or(0))
 1714 |     }
 1715 | 
 1716 |     /// Unravels a layer of offsets from the unraveler into the given offset width
 1717 |     ///
 1718 |     /// When decoding a list the caller should first unravel the offsets and then
 1719 |     /// unravel the validity (this is the opposite order used during encoding)
 1720 |     pub fn unravel_offsets<T: ArrowNativeType>(
 1721 |         &mut self,
 1722 |         offsets: &mut Vec<T>,
 1723 |         validity: Option<&mut BooleanBufferBuilder>,
 1724 |     ) -> Result<()> {
 1725 |         if let Some(sparse) = self.sparse.as_mut() {
 1726 |             return sparse.unravel_offsets(offsets, validity);
 1727 |         }
 1728 |         let rep_levels = self
 1729 |             .rep_levels
 1730 |             .as_mut()
 1731 |             .expect("Expected repetition level but data didn't contain repetition");
 1732 |         let valid_level = self.current_def_cmp;
 1733 |         let (null_level, empty_level) = match self.def_meaning[self.current_layer] {
 1734 |             DefinitionInterpretation::NullableList => {
 1735 |                 self.current_def_cmp += 1;
 1736 |                 (valid_level + 1, 0)
 1737 |             }
 1738 |             DefinitionInterpretation::EmptyableList => {
 1739 |                 self.current_def_cmp += 1;
 1740 |                 (0, valid_level + 1)
 1741 |             }
 1742 |             DefinitionInterpretation::NullableAndEmptyableList => {
 1743 |                 self.current_def_cmp += 2;
 1744 |                 (valid_level + 1, valid_level + 2)
 1745 |             }
 1746 |             DefinitionInterpretation::AllValidList => (0, 0),
 1747 |             _ => unreachable!(),
 1748 |         };
 1749 |         self.current_layer += 1;
 1750 | 
 1751 |         // This is the highest def level that is still visible.  Once we hit a list then
 1752 |         // we stop looking because any null / empty list (or list masked by a higher level
 1753 |         // null) will not be visible
 1754 |         let mut max_level = null_level.max(empty_level).max(valid_level);
 1755 |         // Anything higher than this (but less than max_level) is a null struct masking our
 1756 |         // list.  We will materialize this is a null list.
 1757 |         let upper_null = max_level;
 1758 |         for level in self.def_meaning[self.current_layer..].iter() {
 1759 |             match level {
 1760 |                 DefinitionInterpretation::NullableItem => {
 1761 |                     max_level += 1;
 1762 |                 }
 1763 |                 DefinitionInterpretation::AllValidItem => {}
 1764 |                 _ => {
 1765 |                     break;
 1766 |                 }
 1767 |             }
 1768 |         }
 1769 | 
 1770 |         let mut curlen: usize = offsets.last().map(|o| o.as_usize()).unwrap_or(0);
 1771 | 
 1772 |         // If offsets is empty this is a no-op.  If offsets is not empty that means we already
 1773 |         // added a set of offsets.  For example, we might have added [0, 3, 5] (2 lists).  Now
 1774 |         // say we want to add [0, 1, 4] (2 lists).  We should get [0, 3, 5, 6, 9] (4 lists).  If
 1775 |         // we don't pop here we get [0, 3, 5, 5, 6, 9] which is wrong.
 1776 |         //
 1777 |         // Or, to think about it another way, if every unraveler adds the starting 0 and the trailing
 1778 |         // length then we have N + unravelers.len() values instead of N + 1.
 1779 |         offsets.pop();
 1780 | 
 1781 |         let to_offset = |val: usize| {
 1782 |             T::from_usize(val)
 1783 |             .ok_or_else(|| Error::invalid_input("A single batch had more than i32::MAX values and so a large container type is required"))
 1784 |         };
 1785 |         self.current_rep_cmp += 1;
 1786 |         if let Some(def_levels) = &mut self.def_levels {
 1787 |             assert!(rep_levels.len() == def_levels.len());
 1788 |             // It's possible validity is None even if we have def levels.  For example, we might have
 1789 |             // empty lists (which require def levels) but no nulls.
 1790 |             let mut push_validity: Box<dyn FnMut(bool)> = if let Some(validity) = validity {
 1791 |                 Box::new(|is_valid| validity.append(is_valid))
 1792 |             } else {
 1793 |                 Box::new(|_| {})
 1794 |             };
 1795 |             // This is a strange access pattern.  We are iterating over the rep/def levels and
 1796 |             // at the same time writing the rep/def levels.  This means we need both a mutable
 1797 |             // and immutable reference to the rep/def levels.
 1798 |             let mut read_idx = 0;
 1799 |             let mut write_idx = 0;
 1800 |             while read_idx < rep_levels.len() {
 1801 |                 // SAFETY: We assert that rep_levels and def_levels have the same
 1802 |                 // len and read_idx and write_idx can never go past the end.
 1803 |                 unsafe {
 1804 |                     let rep_val = *rep_levels.get_unchecked(read_idx);
 1805 |                     if rep_val != 0 {
 1806 |                         let def_val = *def_levels.get_unchecked(read_idx);
 1807 |                         // Copy over
 1808 |                         *rep_levels.get_unchecked_mut(write_idx) = rep_val - 1;
 1809 |                         *def_levels.get_unchecked_mut(write_idx) = def_val;
 1810 |                         write_idx += 1;
 1811 | 
 1812 |                         if def_val == 0 {
 1813 |                             // This is a valid list
 1814 |                             offsets.push(to_offset(curlen)?);
 1815 |                             curlen += 1;
 1816 |                             push_validity(true);
 1817 |                         } else if def_val > max_level {
 1818 |                             // This is not visible at this rep level, do not add to offsets, but keep in repdef
 1819 |                         } else if def_val == null_level || def_val > upper_null {
 1820 |                             // This is a null list (or a list masked by a null struct)
 1821 |                             offsets.push(to_offset(curlen)?);
 1822 |                             push_validity(false);
 1823 |                         } else if def_val == empty_level {
 1824 |                             // This is an empty list
 1825 |                             offsets.push(to_offset(curlen)?);
 1826 |                             push_validity(true);
 1827 |                         } else {
 1828 |                             // New valid list starting with null item
 1829 |                             offsets.push(to_offset(curlen)?);
 1830 |                             curlen += 1;
 1831 |                             push_validity(true);
 1832 |                         }
 1833 |                     } else {
 1834 |                         curlen += 1;
 1835 |                     }
 1836 |                     read_idx += 1;
 1837 |                 }
 1838 |             }
 1839 |             offsets.push(to_offset(curlen)?);
 1840 |             rep_levels.truncate(write_idx);
 1841 |             def_levels.truncate(write_idx);
 1842 |             Ok(())
 1843 |         } else {
 1844 |             // SAFETY: See above loop
 1845 |             let mut read_idx = 0;
 1846 |             let mut write_idx = 0;
 1847 |             let old_offsets_len = offsets.len();
 1848 |             while read_idx < rep_levels.len() {
 1849 |                 // SAFETY: read_idx / write_idx cannot go past rep_levels.len()
 1850 |                 unsafe {
 1851 |                     let rep_val = *rep_levels.get_unchecked(read_idx);
 1852 |                     if rep_val != 0 {
 1853 |                         // Finish the current list
 1854 |                         offsets.push(to_offset(curlen)?);
 1855 |                         *rep_levels.get_unchecked_mut(write_idx) = rep_val - 1;
 1856 |                         write_idx += 1;
 1857 |                     }
 1858 |                     curlen += 1;
 1859 |                     read_idx += 1;
 1860 |                 }
 1861 |             }
 1862 |             let num_new_lists = offsets.len() - old_offsets_len;
 1863 |             offsets.push(to_offset(curlen)?);
 1864 |             // Truncate to the number of lists THIS unraveler produced (write_idx),
 1865 |             // not `offsets.len() - 1` — the latter includes offsets contributed by
 1866 |             // earlier unravelers in a multi-page read, which would leave too many
 1867 |             // rep levels for the next (outer) layer and over-count its lists.
 1868 |             rep_levels.truncate(write_idx);
 1869 |             if let Some(validity) = validity {
 1870 |                 // Even though we don't have validity it is possible another unraveler did and so we need
 1871 |                 // to push all valids
 1872 |                 validity.append_n(num_new_lists, true);
 1873 |             }
 1874 |             Ok(())
 1875 |         }
 1876 |     }
 1877 | 
 1878 |     pub fn skip_validity(&mut self) -> Result<()> {
 1879 |         if let Some(sparse) = self.sparse.as_mut() {
 1880 |             return sparse.skip_validity();
 1881 |         }
 1882 |         debug_assert!(self.is_all_valid());
 1883 |         self.current_layer += 1;
 1884 |         Ok(())
 1885 |     }
 1886 | 
 1887 |     /// Unravels a layer of validity from the definition levels
 1888 |     pub fn unravel_validity(&mut self, validity: &mut BooleanBufferBuilder) -> Result<()> {
 1889 |         if let Some(sparse) = self.sparse.as_mut() {
 1890 |             return sparse.unravel_validity(validity);
 1891 |         }
 1892 |         let meaning = self.def_meaning[self.current_layer];
 1893 |         if meaning == DefinitionInterpretation::AllValidItem || self.def_levels.is_none() {
 1894 |             self.current_layer += 1;
 1895 |             validity.append_n(self.num_items as usize, true);
 1896 |             return Ok(());
 1897 |         }
 1898 | 
 1899 |         self.current_layer += 1;
 1900 |         let def_levels = &self.def_levels.as_ref().unwrap();
 1901 | 
 1902 |         let current_def_cmp = self.current_def_cmp;
 1903 |         self.current_def_cmp += 1;
 1904 | 
 1905 |         for is_valid in def_levels.iter().filter_map(|&level| {
 1906 |             if self.levels_to_rep[level as usize] <= self.current_rep_cmp {
 1907 |                 Some(level <= current_def_cmp)
 1908 |             } else {
 1909 |                 None
 1910 |             }
 1911 |         }) {
 1912 |             validity.append(is_valid);
 1913 |         }
 1914 |         Ok(())
 1915 |     }
 1916 | 
 1917 |     /// Removes all but the first definition level of each fixed-size-list slot
 1918 |     ///
 1919 |     /// The definition levels arrive with one entry per item.  A fixed-size-list
 1920 |     /// layer has a single definition level per slot (all `dimension` items in a
 1921 |     /// slot share it) so we keep every `dimension`-th level and drop the rest.
 1922 |     ///
 1923 |     /// `dimension` must be non-zero.  A zero dimension can only come from a
 1924 |     /// malformed schema (writers reject it, see
 1925 |     /// [`lance_core::datatypes::validate_fixed_size_list_dimensions`]) and is
 1926 |     /// rejected here rather than allowed to run off the end of the buffer.
 1927 |     pub fn decimate(&mut self, dimension: usize) -> Result<()> {
 1928 |         if dimension == 0 {
 1929 |             return Err(Error::invalid_input(
 1930 |                 "Cannot decimate repetition/definition levels with a fixed-size-list dimension of 0; dimension must be a positive integer",
 1931 |             ));
 1932 |         }
 1933 |         if let Some(sparse) = self.sparse.as_mut() {
 1934 |             return sparse.decimate(dimension);
 1935 |         }
 1936 |         if self.rep_levels.is_some() {
 1937 |             // If we need to support this then I think we need to walk through the rep def levels to find
 1938 |             // the spots at which we keep.  E.g. if we have:
 1939 |             //  rep: 1 0 0 1 0 1 0 0 0 1 0 0
 1940 |             //  def: 1 1 1 0 1 0 1 1 0 1 1 0
 1941 |             //  dimension: 2
 1942 |             //
 1943 |             // The output should be:
 1944 |             //  rep: 1 0 0 1 0 0 0
 1945 |             //  def: 1 1 1 0 1 1 0
 1946 |             //
 1947 |             // Maybe there's some special logic for empty/null lists?  I'll save the headache for future me.
 1948 |             todo!("Not yet supported FSL<...List<...>>");
 1949 |         }
 1950 |         let Some(def_levels) = self.def_levels.as_mut() else {
 1951 |             return Ok(());
 1952 |         };
 1953 |         let mut read_idx = 0;
 1954 |         let mut write_idx = 0;
 1955 |         while read_idx < def_levels.len() {
 1956 |             // SAFETY: `read_idx` is checked against the length by the loop condition and
 1957 |             // `dimension >= 1` (checked above) means `write_idx <= read_idx`, so both
 1958 |             // indices are in bounds.
 1959 |             unsafe {
 1960 |                 *def_levels.get_unchecked_mut(write_idx) = *def_levels.get_unchecked(read_idx);
 1961 |             }
 1962 |             write_idx += 1;
 1963 |             read_idx += dimension;
 1964 |         }
 1965 |         def_levels.truncate(write_idx);
 1966 |         Ok(())
 1967 |     }
 1968 | }
 1969 | 
 1970 | /// As we decode we may extract rep/def information from multiple pages (or multiple
 1971 | /// chunks within a page).
 1972 | ///
 1973 | /// For each chunk we create an unraveler.  Each unraveler can have a completely different
 1974 | /// interpretation (e.g. one page might contain null items but no null structs and the next
 1975 | /// page might have null structs but no null items).
 1976 | ///
 1977 | /// Concatenating these unravelers would be tricky and expensive so instead we have a
 1978 | /// composite unraveler which unravels across multiple unravelers.
 1979 | ///
 1980 | /// Note: this class should be used even if there is only one page / unraveler.  This is
 1981 | /// because the `RepDefUnraveler`'s API is more complex (it's meant to be called by this
 1982 | /// class)
 1983 | #[derive(Debug)]
 1984 | pub struct CompositeRepDefUnraveler {
 1985 |     unravelers: Vec<RepDefUnraveler>,
 1986 |     comparisons: Vec<Self>,
 1987 | }
 1988 | 
 1989 | impl CompositeRepDefUnraveler {
 1990 |     pub fn new(unravelers: Vec<RepDefUnraveler>) -> Self {
 1991 |         Self {
 1992 |             unravelers,
 1993 |             comparisons: Vec::new(),
 1994 |         }
 1995 |     }
 1996 | 
 1997 |     pub(crate) fn add_compatibility_check(&mut self, other: Self) {
 1998 |         self.comparisons.push(other);
 1999 |     }
 2000 | 
 2001 |     pub(crate) fn has_sparse(&self) -> bool {
 2002 |         self.unravelers.iter().any(RepDefUnraveler::is_sparse)
 2003 |             || self.comparisons.iter().any(Self::has_sparse)
 2004 |     }
 2005 | 
 2006 |     pub(crate) fn ensure_exhausted(&self) -> Result<()> {
 2007 |         for unraveler in &self.unravelers {
 2008 |             unraveler.ensure_exhausted()?;
 2009 |         }
 2010 |         for comparison in &self.comparisons {
 2011 |             comparison.ensure_exhausted()?;
 2012 |         }
 2013 |         Ok(())
 2014 |     }
 2015 | 
 2016 |     fn null_buffers_equal(
 2017 |         left: &Option<NullBuffer>,
 2018 |         right: &Option<NullBuffer>,
 2019 |         expected_len: usize,
 2020 |     ) -> bool {
 2021 |         match (left, right) {
 2022 |             (None, None) => true,
 2023 |             (Some(left), Some(right)) => {
 2024 |                 left.len() == expected_len
 2025 |                     && right.len() == expected_len
 2026 |                     && left.iter().eq(right.iter())
 2027 |             }
 2028 |             (None, Some(right)) => right.len() == expected_len && right.null_count() == 0,
 2029 |             (Some(left), None) => left.len() == expected_len && left.null_count() == 0,
 2030 |         }
 2031 |     }
 2032 | 
 2033 |     fn decimate(&mut self, dimension: usize) -> Result<()> {
 2034 |         for unraveler in &mut self.unravelers {
 2035 |             unraveler.decimate(dimension)?;
 2036 |         }
 2037 |         for comparison in &mut self.comparisons {
 2038 |             comparison.decimate(dimension)?;
 2039 |         }
 2040 |         Ok(())
 2041 |     }
 2042 | 
 2043 |     /// Unravels a layer of validity
 2044 |     ///
 2045 |     /// Returns None if there are no null items in this layer
 2046 |     pub fn unravel_validity(&mut self, num_values: usize) -> Result<Option<NullBuffer>> {
 2047 |         let is_all_valid = self
 2048 |             .unravelers
 2049 |             .iter()
 2050 |             .all(|unraveler| unraveler.is_all_valid());
 2051 | 
 2052 |         let validity = if is_all_valid {
 2053 |             for unraveler in self.unravelers.iter_mut() {
 2054 |                 unraveler.skip_validity()?;
 2055 |             }
 2056 |             None
 2057 |         } else {
 2058 |             let mut validity = BooleanBufferBuilder::new(num_values);
 2059 |             for unraveler in self.unravelers.iter_mut() {
 2060 |                 unraveler.unravel_validity(&mut validity)?;
 2061 |             }
 2062 |             Some(NullBuffer::new(validity.finish()))
 2063 |         };
 2064 |         for comparison in &mut self.comparisons {
 2065 |             let other = comparison.unravel_validity(num_values)?;
 2066 |             if !Self::null_buffers_equal(&validity, &other, num_values) {
 2067 |                 return Err(Error::invalid_input_source(
 2068 |                     format!(
 2069 |                         "Structural sibling fields have incompatible validity metadata for {num_values} values"
 2070 |                     )
 2071 |                     .into(),
 2072 |                 ));
 2073 |             }
 2074 |         }
 2075 |         Ok(validity)
 2076 |     }
 2077 | 
 2078 |     pub fn unravel_fsl_validity(
 2079 |         &mut self,
 2080 |         num_values: usize,
 2081 |         dimension: usize,
 2082 |     ) -> Result<Option<NullBuffer>> {
 2083 |         self.decimate(dimension)?;
 2084 |         self.unravel_validity(num_values)
 2085 |     }
 2086 | 
 2087 |     /// Unravels a layer of offsets (and the validity for that layer)
 2088 |     pub fn unravel_offsets<T: ArrowNativeType>(
 2089 |         &mut self,
 2090 |     ) -> Result<(OffsetBuffer<T>, Option<NullBuffer>)> {
 2091 |         let mut is_all_valid = true;
 2092 |         let mut max_num_lists: usize = 0;
 2093 |         for unraveler in self.unravelers.iter() {
 2094 |             is_all_valid &= unraveler.is_all_valid();
 2095 |             max_num_lists = max_num_lists
 2096 |                 .checked_add(unraveler.max_lists()?)
 2097 |                 .ok_or_else(|| {
 2098 |                     Error::invalid_input_source(
 2099 |                         "Combined repetition/definition list count exceeds usize::MAX".into(),
 2100 |                     )
 2101 |                 })?;
 2102 |         }
 2103 | 
 2104 |         let mut validity = if is_all_valid {
 2105 |             None
 2106 |         } else {
 2107 |             // Note: This is probably an over-estimate and potentially even an under-estimate.  We only know
 2108 |             // right now how many items we have and not how many rows.  (TODO: Shouldn't we know the # of rows?)
 2109 |             Some(BooleanBufferBuilder::new(max_num_lists))
 2110 |         };
 2111 | 
 2112 |         let mut offsets = Vec::with_capacity(max_num_lists + 1);
 2113 | 
 2114 |         for unraveler in self.unravelers.iter_mut() {
 2115 |             unraveler.unravel_offsets(&mut offsets, validity.as_mut())?;
 2116 |         }
 2117 | 
 2118 |         let offsets = OffsetBuffer::new(ScalarBuffer::from(offsets));
 2119 |         let validity = validity.map(|mut v| NullBuffer::new(v.finish()));
 2120 |         for comparison in &mut self.comparisons {
 2121 |             let (other_offsets, other_validity) = comparison.unravel_offsets::<T>()?;
 2122 |             if offsets.as_ref() != other_offsets.as_ref()
 2123 |                 || !Self::null_buffers_equal(
 2124 |                     &validity,
 2125 |                     &other_validity,
 2126 |                     offsets.len().saturating_sub(1),
 2127 |                 )
 2128 |             {
 2129 |                 return Err(Error::invalid_input_source(
 2130 |                     format!(
 2131 |                         "Structural sibling fields have incompatible list metadata for {} slots",
 2132 |                         offsets.len().saturating_sub(1)
 2133 |                     )
 2134 |                     .into(),
 2135 |                 ));
 2136 |             }
 2137 |         }
 2138 | 
 2139 |         Ok((offsets, validity))
 2140 |     }
 2141 | }
 2142 | 
 2143 | /// A [`ControlWordIterator`] when there are both repetition and definition levels
 2144 | ///
 2145 | /// The iterator will put the repetition level in the upper bits and the definition
 2146 | /// level in the lower bits.  The number of bits used for each level is determined
 2147 | /// by the width of the repetition and definition levels.
 2148 | #[derive(Debug)]
 2149 | pub struct BinaryControlWordIterator<I: Iterator<Item = (u16, u16)>, W> {
 2150 |     repdef: I,
 2151 |     def_width: usize,
 2152 |     max_rep: u16,
 2153 |     max_visible_def: u16,
 2154 |     rep_mask: u16,
 2155 |     def_mask: u16,
 2156 |     bits_rep: u8,
 2157 |     bits_def: u8,
 2158 |     phantom: std::marker::PhantomData<W>,
 2159 | }
 2160 | 
 2161 | impl<I: Iterator<Item = (u16, u16)>> BinaryControlWordIterator<I, u8> {
 2162 |     fn append_next(&mut self, buf: &mut Vec<u8>) -> Option<ControlWordDesc> {
 2163 |         let next = self.repdef.next()?;
 2164 |         let control_word: u8 =
 2165 |             (((next.0 & self.rep_mask) as u8) << self.def_width) + ((next.1 & self.def_mask) as u8);
 2166 |         buf.push(control_word);
 2167 |         let is_new_row = next.0 == self.max_rep;
 2168 |         let is_visible = next.1 <= self.max_visible_def;
 2169 |         let is_valid_item = next.1 == 0;
 2170 |         Some(ControlWordDesc {
 2171 |             is_new_row,
 2172 |             is_visible,
 2173 |             is_valid_item,
 2174 |         })
 2175 |     }
 2176 | }
 2177 | 
 2178 | impl<I: Iterator<Item = (u16, u16)>> BinaryControlWordIterator<I, u16> {
 2179 |     fn append_next(&mut self, buf: &mut Vec<u8>) -> Option<ControlWordDesc> {
 2180 |         let next = self.repdef.next()?;
 2181 |         let control_word: u16 =
 2182 |             ((next.0 & self.rep_mask) << self.def_width) + (next.1 & self.def_mask);
 2183 |         let control_word = control_word.to_le_bytes();
 2184 |         buf.push(control_word[0]);
 2185 |         buf.push(control_word[1]);
 2186 |         let is_new_row = next.0 == self.max_rep;
 2187 |         let is_visible = next.1 <= self.max_visible_def;
 2188 |         let is_valid_item = next.1 == 0;
 2189 |         Some(ControlWordDesc {
 2190 |             is_new_row,
 2191 |             is_visible,
 2192 |             is_valid_item,
 2193 |         })
 2194 |     }
 2195 | }
 2196 | 
 2197 | impl<I: Iterator<Item = (u16, u16)>> BinaryControlWordIterator<I, u32> {
 2198 |     fn append_next(&mut self, buf: &mut Vec<u8>) -> Option<ControlWordDesc> {
 2199 |         let next = self.repdef.next()?;
 2200 |         let control_word: u32 = (((next.0 & self.rep_mask) as u32) << self.def_width)
 2201 |             + ((next.1 & self.def_mask) as u32);
 2202 |         let control_word = control_word.to_le_bytes();
 2203 |         buf.push(control_word[0]);
 2204 |         buf.push(control_word[1]);
 2205 |         buf.push(control_word[2]);
 2206 |         buf.push(control_word[3]);
 2207 |         let is_new_row = next.0 == self.max_rep;
 2208 |         let is_visible = next.1 <= self.max_visible_def;
 2209 |         let is_valid_item = next.1 == 0;
 2210 |         Some(ControlWordDesc {
 2211 |             is_new_row,
 2212 |             is_visible,
 2213 |             is_valid_item,
 2214 |         })
 2215 |     }
 2216 | }
 2217 | 
 2218 | /// A [`ControlWordIterator`] when there are only definition levels or only repetition levels
 2219 | #[derive(Debug)]
 2220 | pub struct UnaryControlWordIterator<I: Iterator<Item = u16>, W> {
 2221 |     repdef: I,
 2222 |     level_mask: u16,
 2223 |     bits_rep: u8,
 2224 |     bits_def: u8,
 2225 |     max_rep: u16,
 2226 |     phantom: std::marker::PhantomData<W>,
 2227 | }
 2228 | 
 2229 | impl<I: Iterator<Item = u16>> UnaryControlWordIterator<I, u8> {
 2230 |     fn append_next(&mut self, buf: &mut Vec<u8>) -> Option<ControlWordDesc> {
 2231 |         let next = self.repdef.next()?;
 2232 |         buf.push((next & self.level_mask) as u8);
 2233 |         let is_new_row = self.max_rep == 0 || next == self.max_rep;
 2234 |         let is_valid_item = next == 0 || self.bits_def == 0;
 2235 |         Some(ControlWordDesc {
 2236 |             is_new_row,
 2237 |             // Either there is no rep, in which case there are no invisible items
 2238 |             // or there is no def, in which case there are no invisible items
 2239 |             is_visible: true,
 2240 |             is_valid_item,
 2241 |         })
 2242 |     }
 2243 | }
 2244 | 
 2245 | impl<I: Iterator<Item = u16>> UnaryControlWordIterator<I, u16> {
 2246 |     fn append_next(&mut self, buf: &mut Vec<u8>) -> Option<ControlWordDesc> {
 2247 |         let next = self.repdef.next().unwrap() & self.level_mask;
 2248 |         let control_word = next.to_le_bytes();
 2249 |         buf.push(control_word[0]);
 2250 |         buf.push(control_word[1]);
 2251 |         let is_new_row = self.max_rep == 0 || next == self.max_rep;
 2252 |         let is_valid_item = next == 0 || self.bits_def == 0;
 2253 |         Some(ControlWordDesc {
 2254 |             is_new_row,
 2255 |             is_visible: true,
 2256 |             is_valid_item,
 2257 |         })
 2258 |     }
 2259 | }
 2260 | 
 2261 | impl<I: Iterator<Item = u16>> UnaryControlWordIterator<I, u32> {
 2262 |     fn append_next(&mut self, buf: &mut Vec<u8>) -> Option<ControlWordDesc> {
 2263 |         let next = self.repdef.next()?;
 2264 |         let next = (next & self.level_mask) as u32;
 2265 |         let control_word = next.to_le_bytes();
 2266 |         buf.push(control_word[0]);
 2267 |         buf.push(control_word[1]);
 2268 |         buf.push(control_word[2]);
 2269 |         buf.push(control_word[3]);
 2270 |         let is_new_row = self.max_rep == 0 || next as u16 == self.max_rep;
 2271 |         let is_valid_item = next == 0 || self.bits_def == 0;
 2272 |         Some(ControlWordDesc {
 2273 |             is_new_row,
 2274 |             is_visible: true,
 2275 |             is_valid_item,
 2276 |         })
 2277 |     }
 2278 | }
 2279 | 
 2280 | /// A [`ControlWordIterator`] when there are no repetition or definition levels
 2281 | #[derive(Debug)]
 2282 | pub struct NilaryControlWordIterator {
 2283 |     len: usize,
 2284 |     idx: usize,
 2285 | }
 2286 | 
 2287 | impl NilaryControlWordIterator {
 2288 |     fn append_next(&mut self) -> Option<ControlWordDesc> {
 2289 |         if self.idx == self.len {
 2290 |             None
 2291 |         } else {
 2292 |             self.idx += 1;
 2293 |             Some(ControlWordDesc {
 2294 |                 is_new_row: true,
 2295 |                 is_visible: true,
 2296 |                 is_valid_item: true,
 2297 |             })
 2298 |         }
 2299 |     }
 2300 | }
 2301 | 
 2302 | /// Helper function to get a bit mask of the given width
 2303 | fn get_mask(width: u16) -> u16 {
 2304 |     (1 << width) - 1
 2305 | }
 2306 | 
 2307 | // We're really going out of our way to avoid boxing here but this will be called on a per-value basis
 2308 | // so it is in the critical path.
 2309 | type SpecificBinaryControlWordIterator<'a, T> = BinaryControlWordIterator<
 2310 |     Zip<Copied<std::slice::Iter<'a, u16>>, Copied<std::slice::Iter<'a, u16>>>,
 2311 |     T,
 2312 | >;
 2313 | 
 2314 | /// An iterator that generates control words from repetition and definition levels
 2315 | ///
 2316 | /// "Control word" is just a fancy term for a single u8/u16/u32 that contains both
 2317 | /// the repetition and definition in it.
 2318 | ///
 2319 | /// In the large majority of case we only need a single byte to represent both the
 2320 | /// repetition and definition levels.  However, if there is deep nesting then we may
 2321 | /// need two bytes.  In the worst case we need 4 bytes though this suggests hundreds of
 2322 | /// levels of nesting which seems unlikely to encounter in practice.
 2323 | #[derive(Debug)]
 2324 | pub enum ControlWordIterator<'a> {
 2325 |     Binary8(SpecificBinaryControlWordIterator<'a, u8>),
 2326 |     Binary16(SpecificBinaryControlWordIterator<'a, u16>),
 2327 |     Binary32(SpecificBinaryControlWordIterator<'a, u32>),
 2328 |     Unary8(UnaryControlWordIterator<Copied<std::slice::Iter<'a, u16>>, u8>),
 2329 |     Unary16(UnaryControlWordIterator<Copied<std::slice::Iter<'a, u16>>, u16>),
 2330 |     Unary32(UnaryControlWordIterator<Copied<std::slice::Iter<'a, u16>>, u32>),
 2331 |     Nilary(NilaryControlWordIterator),
 2332 | }
 2333 | 
 2334 | /// Describes the properties of a control word
 2335 | #[derive(Debug)]
 2336 | pub struct ControlWordDesc {
 2337 |     pub is_new_row: bool,
 2338 |     pub is_visible: bool,
 2339 |     pub is_valid_item: bool,
 2340 | }
 2341 | 
 2342 | impl ControlWordIterator<'_> {
 2343 |     /// Appends the next control word to the buffer
 2344 |     ///
 2345 |     /// Returns true if this is the start of a new item (i.e. the repetition level is maxed out)
 2346 |     pub fn append_next(&mut self, buf: &mut Vec<u8>) -> Option<ControlWordDesc> {
 2347 |         match self {
 2348 |             Self::Binary8(iter) => iter.append_next(buf),
 2349 |             Self::Binary16(iter) => iter.append_next(buf),
 2350 |             Self::Binary32(iter) => iter.append_next(buf),
 2351 |             Self::Unary8(iter) => iter.append_next(buf),
 2352 |             Self::Unary16(iter) => iter.append_next(buf),
 2353 |             Self::Unary32(iter) => iter.append_next(buf),
 2354 |             Self::Nilary(iter) => iter.append_next(),
 2355 |         }
 2356 |     }
 2357 | 
 2358 |     /// Return true if the control word iterator has repetition levels
 2359 |     pub fn has_repetition(&self) -> bool {
 2360 |         match self {
 2361 |             Self::Binary8(_) | Self::Binary16(_) | Self::Binary32(_) => true,
 2362 |             Self::Unary8(iter) => iter.bits_rep > 0,
 2363 |             Self::Unary16(iter) => iter.bits_rep > 0,
 2364 |             Self::Unary32(iter) => iter.bits_rep > 0,
 2365 |             Self::Nilary(_) => false,
 2366 |         }
 2367 |     }
 2368 | 
 2369 |     /// Returns the number of bytes per control word
 2370 |     pub fn bytes_per_word(&self) -> usize {
 2371 |         match self {
 2372 |             Self::Binary8(_) => 1,
 2373 |             Self::Binary16(_) => 2,
 2374 |             Self::Binary32(_) => 4,
 2375 |             Self::Unary8(_) => 1,
 2376 |             Self::Unary16(_) => 2,
 2377 |             Self::Unary32(_) => 4,
 2378 |             Self::Nilary(_) => 0,
 2379 |         }
 2380 |     }
 2381 | 
 2382 |     /// Returns the number of bits used for the repetition level
 2383 |     pub fn bits_rep(&self) -> u8 {
 2384 |         match self {
 2385 |             Self::Binary8(iter) => iter.bits_rep,
 2386 |             Self::Binary16(iter) => iter.bits_rep,
 2387 |             Self::Binary32(iter) => iter.bits_rep,
 2388 |             Self::Unary8(iter) => iter.bits_rep,
 2389 |             Self::Unary16(iter) => iter.bits_rep,
 2390 |             Self::Unary32(iter) => iter.bits_rep,
 2391 |             Self::Nilary(_) => 0,
 2392 |         }
 2393 |     }
 2394 | 
 2395 |     /// Returns the number of bits used for the definition level
 2396 |     pub fn bits_def(&self) -> u8 {
 2397 |         match self {
 2398 |             Self::Binary8(iter) => iter.bits_def,
 2399 |             Self::Binary16(iter) => iter.bits_def,
 2400 |             Self::Binary32(iter) => iter.bits_def,
 2401 |             Self::Unary8(iter) => iter.bits_def,
 2402 |             Self::Unary16(iter) => iter.bits_def,
 2403 |             Self::Unary32(iter) => iter.bits_def,
 2404 |             Self::Nilary(_) => 0,
 2405 |         }
 2406 |     }
 2407 | }
 2408 | 
 2409 | /// Builds a [`ControlWordIterator`] from repetition and definition levels
 2410 | /// by first calculating the width needed and then creating the iterator
 2411 | /// with the appropriate width
 2412 | pub fn build_control_word_iterator<'a>(
 2413 |     rep: Option<&'a [u16]>,
 2414 |     max_rep: u16,
 2415 |     def: Option<&'a [u16]>,
 2416 |     max_def: u16,
 2417 |     max_visible_def: u16,
 2418 |     len: usize,
 2419 | ) -> ControlWordIterator<'a> {
 2420 |     let rep_width = if max_rep == 0 {
 2421 |         0
 2422 |     } else {
 2423 |         log_2_ceil(max_rep as u32) as u16
 2424 |     };
 2425 |     let rep_mask = if max_rep == 0 { 0 } else { get_mask(rep_width) };
 2426 |     let def_width = if max_def == 0 {
 2427 |         0
 2428 |     } else {
 2429 |         log_2_ceil(max_def as u32) as u16
 2430 |     };
 2431 |     let def_mask = if max_def == 0 { 0 } else { get_mask(def_width) };
 2432 |     let total_width = rep_width + def_width;
 2433 |     // A levels array can be non-empty while the corresponding max level is 0:
 2434 |     // e.g. a page holding only valid rows after a page split has all zero
 2435 |     // definition levels.  With a zero total width the decoder reads a NIL
 2436 |     // layout (zero bytes per control word), so the writer must also emit the
 2437 |     // NIL writer instead of a Unary/Binary writer that would write one
 2438 |     // all-zero byte per word.
 2439 |     if total_width == 0 {
 2440 |         return ControlWordIterator::Nilary(NilaryControlWordIterator { len, idx: 0 });
 2441 |     }
 2442 |     match (rep, def) {
 2443 |         (Some(rep), Some(def)) => {
 2444 |             let iter = rep.iter().copied().zip(def.iter().copied());
 2445 |             let def_width = def_width as usize;
 2446 |             if total_width <= 8 {
 2447 |                 ControlWordIterator::Binary8(BinaryControlWordIterator {
 2448 |                     repdef: iter,
 2449 |                     rep_mask,
 2450 |                     def_mask,
 2451 |                     def_width,
 2452 |                     max_rep,
 2453 |                     max_visible_def,
 2454 |                     bits_rep: rep_width as u8,
 2455 |                     bits_def: def_width as u8,
 2456 |                     phantom: std::marker::PhantomData,
 2457 |                 })
 2458 |             } else if total_width <= 16 {
 2459 |                 ControlWordIterator::Binary16(BinaryControlWordIterator {
 2460 |                     repdef: iter,
 2461 |                     rep_mask,
 2462 |                     def_mask,
 2463 |                     def_width,
 2464 |                     max_rep,
 2465 |                     max_visible_def,
 2466 |                     bits_rep: rep_width as u8,
 2467 |                     bits_def: def_width as u8,
 2468 |                     phantom: std::marker::PhantomData,
 2469 |                 })
 2470 |             } else {
 2471 |                 ControlWordIterator::Binary32(BinaryControlWordIterator {
 2472 |                     repdef: iter,
 2473 |                     rep_mask,
 2474 |                     def_mask,
 2475 |                     def_width,
 2476 |                     max_rep,
 2477 |                     max_visible_def,
 2478 |                     bits_rep: rep_width as u8,
 2479 |                     bits_def: def_width as u8,
 2480 |                     phantom: std::marker::PhantomData,
 2481 |                 })
 2482 |             }
 2483 |         }
 2484 |         (Some(lev), None) => {
 2485 |             let iter = lev.iter().copied();
 2486 |             if total_width <= 8 {
 2487 |                 ControlWordIterator::Unary8(UnaryControlWordIterator {
 2488 |                     repdef: iter,
 2489 |                     level_mask: rep_mask,
 2490 |                     bits_rep: total_width as u8,
 2491 |                     bits_def: 0,
 2492 |                     max_rep,
 2493 |                     phantom: std::marker::PhantomData,
 2494 |                 })
 2495 |             } else if total_width <= 16 {
 2496 |                 ControlWordIterator::Unary16(UnaryControlWordIterator {
 2497 |                     repdef: iter,
 2498 |                     level_mask: rep_mask,
 2499 |                     bits_rep: total_width as u8,
 2500 |                     bits_def: 0,
 2501 |                     max_rep,
 2502 |                     phantom: std::marker::PhantomData,
 2503 |                 })
 2504 |             } else {
 2505 |                 ControlWordIterator::Unary32(UnaryControlWordIterator {
 2506 |                     repdef: iter,
 2507 |                     level_mask: rep_mask,
 2508 |                     bits_rep: total_width as u8,
 2509 |                     bits_def: 0,
 2510 |                     max_rep,
 2511 |                     phantom: std::marker::PhantomData,
 2512 |                 })
 2513 |             }
 2514 |         }
 2515 |         (None, Some(lev)) => {
 2516 |             let iter = lev.iter().copied();
 2517 |             if total_width <= 8 {
 2518 |                 ControlWordIterator::Unary8(UnaryControlWordIterator {
 2519 |                     repdef: iter,
 2520 |                     level_mask: def_mask,
 2521 |                     bits_rep: 0,
 2522 |                     bits_def: total_width as u8,
 2523 |                     max_rep: 0,
 2524 |                     phantom: std::marker::PhantomData,
 2525 |                 })
 2526 |             } else if total_width <= 16 {
 2527 |                 ControlWordIterator::Unary16(UnaryControlWordIterator {
 2528 |                     repdef: iter,
 2529 |                     level_mask: def_mask,
 2530 |                     bits_rep: 0,
 2531 |                     bits_def: total_width as u8,
 2532 |                     max_rep: 0,
 2533 |                     phantom: std::marker::PhantomData,
 2534 |                 })
 2535 |             } else {
 2536 |                 ControlWordIterator::Unary32(UnaryControlWordIterator {
 2537 |                     repdef: iter,
 2538 |                     level_mask: def_mask,
 2539 |                     bits_rep: 0,
 2540 |                     bits_def: total_width as u8,
 2541 |                     max_rep: 0,
 2542 |                     phantom: std::marker::PhantomData,
 2543 |                 })
 2544 |             }
 2545 |         }
 2546 |         (None, None) => ControlWordIterator::Nilary(NilaryControlWordIterator { len, idx: 0 }),
 2547 |     }
 2548 | }
 2549 | 
 2550 | /// A parser to unwrap control words into repetition and definition levels
 2551 | ///
 2552 | /// This is the inverse of the [`ControlWordIterator`].
 2553 | #[derive(Copy, Clone, Debug)]
 2554 | pub enum ControlWordParser {
 2555 |     // First item is the bits to shift, second is the mask to apply (the mask can be
 2556 |     // calculated from the bits to shift but we don't want to calculate it each time)
 2557 |     BOTH8(u8, u32),
 2558 |     BOTH16(u8, u32),
 2559 |     BOTH32(u8, u32),
 2560 |     REP8,
 2561 |     REP16,
 2562 |     REP32,
 2563 |     DEF8,
 2564 |     DEF16,
 2565 |     DEF32,
 2566 |     NIL,
 2567 | }
 2568 | 
 2569 | impl ControlWordParser {
 2570 |     fn parse_both<const WORD_SIZE: u8>(
 2571 |         src: &[u8],
 2572 |         dst_rep: &mut Vec<u16>,
 2573 |         dst_def: &mut Vec<u16>,
 2574 |         bits_to_shift: u8,
 2575 |         mask_to_apply: u32,
 2576 |     ) {
 2577 |         match WORD_SIZE {
 2578 |             1 => {
 2579 |                 let word = src[0];
 2580 |                 let rep = word >> bits_to_shift;
 2581 |                 let def = word & (mask_to_apply as u8);
 2582 |                 dst_rep.push(rep as u16);
 2583 |                 dst_def.push(def as u16);
 2584 |             }
 2585 |             2 => {
 2586 |                 let word = u16::from_le_bytes([src[0], src[1]]);
 2587 |                 let rep = word >> bits_to_shift;
 2588 |                 let def = word & mask_to_apply as u16;
 2589 |                 dst_rep.push(rep);
 2590 |                 dst_def.push(def);
 2591 |             }
 2592 |             4 => {
 2593 |                 let word = u32::from_le_bytes([src[0], src[1], src[2], src[3]]);
 2594 |                 let rep = word >> bits_to_shift;
 2595 |                 let def = word & mask_to_apply;
 2596 |                 dst_rep.push(rep as u16);
 2597 |                 dst_def.push(def as u16);
 2598 |             }
 2599 |             _ => unreachable!(),
 2600 |         }
 2601 |     }
 2602 | 
 2603 |     fn parse_desc_both<const WORD_SIZE: u8>(
 2604 |         src: &[u8],
 2605 |         bits_to_shift: u8,
 2606 |         mask_to_apply: u32,
 2607 |         max_rep: u16,
 2608 |         max_visible_def: u16,
 2609 |     ) -> ControlWordDesc {
 2610 |         match WORD_SIZE {
 2611 |             1 => {
 2612 |                 let word = src[0];
 2613 |                 let rep = word >> bits_to_shift;
 2614 |                 let def = word & (mask_to_apply as u8);
 2615 |                 let is_visible = def as u16 <= max_visible_def;
 2616 |                 let is_new_row = rep as u16 == max_rep;
 2617 |                 let is_valid_item = def == 0;
 2618 |                 ControlWordDesc {
 2619 |                     is_visible,
 2620 |                     is_new_row,
 2621 |                     is_valid_item,
 2622 |                 }
 2623 |             }
 2624 |             2 => {
 2625 |                 let word = u16::from_le_bytes([src[0], src[1]]);
 2626 |                 let rep = word >> bits_to_shift;
 2627 |                 let def = word & mask_to_apply as u16;
 2628 |                 let is_visible = def <= max_visible_def;
 2629 |                 let is_new_row = rep == max_rep;
 2630 |                 let is_valid_item = def == 0;
 2631 |                 ControlWordDesc {
 2632 |                     is_visible,
 2633 |                     is_new_row,
 2634 |                     is_valid_item,
 2635 |                 }
 2636 |             }
 2637 |             4 => {
 2638 |                 let word = u32::from_le_bytes([src[0], src[1], src[2], src[3]]);
 2639 |                 let rep = word >> bits_to_shift;
 2640 |                 let def = word & mask_to_apply;
 2641 |                 let is_visible = def as u16 <= max_visible_def;
 2642 |                 let is_new_row = rep as u16 == max_rep;
 2643 |                 let is_valid_item = def == 0;
 2644 |                 ControlWordDesc {
 2645 |                     is_visible,
 2646 |                     is_new_row,
 2647 |                     is_valid_item,
 2648 |                 }
 2649 |             }
 2650 |             _ => unreachable!(),
 2651 |         }
 2652 |     }
 2653 | 
 2654 |     fn parse_one<const WORD_SIZE: u8>(src: &[u8], dst: &mut Vec<u16>) {
 2655 |         match WORD_SIZE {
 2656 |             1 => {
 2657 |                 let word = src[0];
 2658 |                 dst.push(word as u16);
 2659 |             }
 2660 |             2 => {
 2661 |                 let word = u16::from_le_bytes([src[0], src[1]]);
 2662 |                 dst.push(word);
 2663 |             }
 2664 |             4 => {
 2665 |                 let word = u32::from_le_bytes([src[0], src[1], src[2], src[3]]);
 2666 |                 dst.push(word as u16);
 2667 |             }
 2668 |             _ => unreachable!(),
 2669 |         }
 2670 |     }
 2671 | 
 2672 |     fn parse_rep_desc_one<const WORD_SIZE: u8>(src: &[u8], max_rep: u16) -> ControlWordDesc {
 2673 |         match WORD_SIZE {
 2674 |             1 => ControlWordDesc {
 2675 |                 is_new_row: src[0] as u16 == max_rep,
 2676 |                 is_visible: true,
 2677 |                 is_valid_item: true,
 2678 |             },
 2679 |             2 => ControlWordDesc {
 2680 |                 is_new_row: u16::from_le_bytes([src[0], src[1]]) == max_rep,
 2681 |                 is_visible: true,
 2682 |                 is_valid_item: true,
 2683 |             },
 2684 |             4 => ControlWordDesc {
 2685 |                 is_new_row: u32::from_le_bytes([src[0], src[1], src[2], src[3]]) as u16 == max_rep,
 2686 |                 is_visible: true,
 2687 |                 is_valid_item: true,
 2688 |             },
 2689 |             _ => unreachable!(),
 2690 |         }
 2691 |     }
 2692 | 
 2693 |     fn parse_def_desc_one<const WORD_SIZE: u8>(src: &[u8]) -> ControlWordDesc {
 2694 |         match WORD_SIZE {
 2695 |             1 => ControlWordDesc {
 2696 |                 is_new_row: true,
 2697 |                 is_visible: true,
 2698 |                 is_valid_item: src[0] == 0,
 2699 |             },
 2700 |             2 => ControlWordDesc {
 2701 |                 is_new_row: true,
 2702 |                 is_visible: true,
 2703 |                 is_valid_item: u16::from_le_bytes([src[0], src[1]]) == 0,
 2704 |             },
 2705 |             4 => ControlWordDesc {
 2706 |                 is_new_row: true,
 2707 |                 is_visible: true,
 2708 |                 is_valid_item: u32::from_le_bytes([src[0], src[1], src[2], src[3]]) as u16 == 0,
 2709 |             },
 2710 |             _ => unreachable!(),
 2711 |         }
 2712 |     }
 2713 | 
 2714 |     /// Returns the number of bytes per control word
 2715 |     pub fn bytes_per_word(&self) -> usize {
 2716 |         match self {
 2717 |             Self::BOTH8(..) => 1,
 2718 |             Self::BOTH16(..) => 2,
 2719 |             Self::BOTH32(..) => 4,
 2720 |             Self::REP8 => 1,
 2721 |             Self::REP16 => 2,
 2722 |             Self::REP32 => 4,
 2723 |             Self::DEF8 => 1,
 2724 |             Self::DEF16 => 2,
 2725 |             Self::DEF32 => 4,
 2726 |             Self::NIL => 0,
 2727 |         }
 2728 |     }
 2729 | 
 2730 |     /// Appends the next control word to the rep & def buffers
 2731 |     ///
 2732 |     /// `src` should be pointing at the first byte (little endian) of the control word
 2733 |     ///
 2734 |     /// `dst_rep` and `dst_def` are the buffers to append the rep and def levels to.
 2735 |     /// They will not be appended to if not needed.
 2736 |     pub fn parse(&self, src: &[u8], dst_rep: &mut Vec<u16>, dst_def: &mut Vec<u16>) {
 2737 |         match self {
 2738 |             Self::BOTH8(bits_to_shift, mask_to_apply) => {
 2739 |                 Self::parse_both::<1>(src, dst_rep, dst_def, *bits_to_shift, *mask_to_apply)
 2740 |             }
 2741 |             Self::BOTH16(bits_to_shift, mask_to_apply) => {
 2742 |                 Self::parse_both::<2>(src, dst_rep, dst_def, *bits_to_shift, *mask_to_apply)
 2743 |             }
 2744 |             Self::BOTH32(bits_to_shift, mask_to_apply) => {
 2745 |                 Self::parse_both::<4>(src, dst_rep, dst_def, *bits_to_shift, *mask_to_apply)
 2746 |             }
 2747 |             Self::REP8 => Self::parse_one::<1>(src, dst_rep),
 2748 |             Self::REP16 => Self::parse_one::<2>(src, dst_rep),
 2749 |             Self::REP32 => Self::parse_one::<4>(src, dst_rep),
 2750 |             Self::DEF8 => Self::parse_one::<1>(src, dst_def),
 2751 |             Self::DEF16 => Self::parse_one::<2>(src, dst_def),
 2752 |             Self::DEF32 => Self::parse_one::<4>(src, dst_def),
 2753 |             Self::NIL => {}
 2754 |         }
 2755 |     }
 2756 | 
 2757 |     /// Return true if the control words contain repetition information
 2758 |     pub fn has_rep(&self) -> bool {
 2759 |         match self {
 2760 |             Self::BOTH8(..)
 2761 |             | Self::BOTH16(..)
 2762 |             | Self::BOTH32(..)
 2763 |             | Self::REP8
 2764 |             | Self::REP16
 2765 |             | Self::REP32 => true,
 2766 |             Self::DEF8 | Self::DEF16 | Self::DEF32 | Self::NIL => false,
 2767 |         }
 2768 |     }
 2769 | 
 2770 |     /// Temporarily parses the control word to inspect its properties but does not append to any buffers
 2771 |     pub fn parse_desc(&self, src: &[u8], max_rep: u16, max_visible_def: u16) -> ControlWordDesc {
 2772 |         match self {
 2773 |             Self::BOTH8(bits_to_shift, mask_to_apply) => Self::parse_desc_both::<1>(
 2774 |                 src,
 2775 |                 *bits_to_shift,
 2776 |                 *mask_to_apply,
 2777 |                 max_rep,
 2778 |                 max_visible_def,
 2779 |             ),
 2780 |             Self::BOTH16(bits_to_shift, mask_to_apply) => Self::parse_desc_both::<2>(
 2781 |                 src,
 2782 |                 *bits_to_shift,
 2783 |                 *mask_to_apply,
 2784 |                 max_rep,
 2785 |                 max_visible_def,
 2786 |             ),
 2787 |             Self::BOTH32(bits_to_shift, mask_to_apply) => Self::parse_desc_both::<4>(
 2788 |                 src,
 2789 |                 *bits_to_shift,
 2790 |                 *mask_to_apply,
 2791 |                 max_rep,
 2792 |                 max_visible_def,
 2793 |             ),
 2794 |             Self::REP8 => Self::parse_rep_desc_one::<1>(src, max_rep),
 2795 |             Self::REP16 => Self::parse_rep_desc_one::<2>(src, max_rep),
 2796 |             Self::REP32 => Self::parse_rep_desc_one::<4>(src, max_rep),
 2797 |             Self::DEF8 => Self::parse_def_desc_one::<1>(src),
 2798 |             Self::DEF16 => Self::parse_def_desc_one::<2>(src),
 2799 |             Self::DEF32 => Self::parse_def_desc_one::<4>(src),
 2800 |             Self::NIL => ControlWordDesc {
 2801 |                 is_new_row: true,
 2802 |                 is_valid_item: true,
 2803 |                 is_visible: true,
 2804 |             },
 2805 |         }
 2806 |     }
 2807 | 
 2808 |     /// Creates a new parser from the number of bits used for the repetition and definition levels
 2809 |     pub fn new(bits_rep: u8, bits_def: u8) -> Self {
 2810 |         let total_bits = bits_rep + bits_def;
 2811 | 
 2812 |         enum WordSize {
 2813 |             One,
 2814 |             Two,
 2815 |             Four,
 2816 |         }
 2817 | 
 2818 |         let word_size = if total_bits <= 8 {
 2819 |             WordSize::One
 2820 |         } else if total_bits <= 16 {
 2821 |             WordSize::Two
 2822 |         } else {
 2823 |             WordSize::Four
 2824 |         };
 2825 | 
 2826 |         match (bits_rep > 0, bits_def > 0, word_size) {
 2827 |             (false, false, _) => Self::NIL,
 2828 |             (false, true, WordSize::One) => Self::DEF8,
 2829 |             (false, true, WordSize::Two) => Self::DEF16,
 2830 |             (false, true, WordSize::Four) => Self::DEF32,
 2831 |             (true, false, WordSize::One) => Self::REP8,
 2832 |             (true, false, WordSize::Two) => Self::REP16,
 2833 |             (true, false, WordSize::Four) => Self::REP32,
 2834 |             (true, true, WordSize::One) => Self::BOTH8(bits_def, get_mask(bits_def as u16) as u32),
 2835 |             (true, true, WordSize::Two) => Self::BOTH16(bits_def, get_mask(bits_def as u16) as u32),
 2836 |             (true, true, WordSize::Four) => {
 2837 |                 Self::BOTH32(bits_def, get_mask(bits_def as u16) as u32)
 2838 |             }
 2839 |         }
 2840 |     }
 2841 | }
 2842 | 
 2843 | #[cfg(test)]
 2844 | mod tests {
 2845 |     use arrow_buffer::{NullBuffer, OffsetBuffer, ScalarBuffer};
 2846 | 
 2847 |     use crate::encodings::logical::primitive::sparse::{
 2848 |         SparsePositionSet, SparseStructuralLayerPlan, SparseStructuralPlan, SparseValidityMeaning,
 2849 |         SparseValiditySet,
 2850 |     };
 2851 |     use crate::repdef::{
 2852 |         CompositeRepDefUnraveler, DefinitionInterpretation, RepDefUnraveler, SerializedRepDefs,
 2853 |         max_visible_level,
 2854 |     };
 2855 | 
 2856 |     use super::RepDefBuilder;
 2857 | 
 2858 |     /// `def_meaning` is leaf-first, so only the layers ahead of the first list sit
 2859 |     /// underneath it.  Counting nullable layers *past* the list makes a decoder treat
 2860 |     /// invisible items as though they owned a leaf value.
 2861 |     #[rstest::rstest]
 2862 |     // No lists: nothing can be invisible, so every level is visible
 2863 |     #[case::no_lists(
 2864 |         &[DefinitionInterpretation::NullableItem, DefinitionInterpretation::NullableItem],
 2865 |         2
 2866 |     )]
 2867 |     // A nullable leaf under a list keeps its own level visible
 2868 |     #[case::nullable_leaf_under_list(
 2869 |         &[DefinitionInterpretation::NullableItem, DefinitionInterpretation::NullableList],
 2870 |         1
 2871 |     )]
 2872 |     // Regression: a nullable struct above the list must not raise the threshold
 2873 |     #[case::nullable_struct_above_list(
 2874 |         &[
 2875 |             DefinitionInterpretation::AllValidItem,
 2876 |             DefinitionInterpretation::NullableList,
 2877 |             DefinitionInterpretation::NullableItem,
 2878 |         ],
 2879 |         0
 2880 |     )]
 2881 |     fn test_max_visible_level(
 2882 |         #[case] def_meaning: &[DefinitionInterpretation],
 2883 |         #[case] expected: u16,
 2884 |     ) {
 2885 |         assert_eq!(max_visible_level(def_meaning), expected);
 2886 |     }
 2887 | 
 2888 |     fn validity(values: &[bool]) -> NullBuffer {
 2889 |         NullBuffer::from_iter(values.iter().copied())
 2890 |     }
 2891 | 
 2892 |     fn offsets_32(values: &[i32]) -> OffsetBuffer<i32> {
 2893 |         OffsetBuffer::<i32>::new(ScalarBuffer::from_iter(values.iter().copied()))
 2894 |     }
 2895 | 
 2896 |     fn offsets_64(values: &[i64]) -> OffsetBuffer<i64> {
 2897 |         OffsetBuffer::<i64>::new(ScalarBuffer::from_iter(values.iter().copied()))
 2898 |     }
 2899 | 
 2900 |     #[test]
 2901 |     fn sparse_sibling_validity_mismatch_is_invalid_input() {
 2902 |         let sparse = |positions| {
 2903 |             RepDefUnraveler::new_sparse(SparseStructuralPlan {
 2904 |                 layers: vec![SparseStructuralLayerPlan::Validity {
 2905 |                     num_slots: 2,
 2906 |                     validity: SparseValiditySet {
 2907 |                         meaning: SparseValidityMeaning::NullPositions,
 2908 |                         positions,
 2909 |                     },
 2910 |                 }],
 2911 |                 num_items: 2,
 2912 |                 num_visible_items: 2,
 2913 |             })
 2914 |         };
 2915 |         let mut repdef = CompositeRepDefUnraveler::new(vec![sparse(SparsePositionSet::Empty)]);
 2916 |         repdef.add_compatibility_check(CompositeRepDefUnraveler::new(vec![sparse(
 2917 |             SparsePositionSet::Explicit(vec![0]),
 2918 |         )]));
 2919 | 
 2920 |         let err = repdef.unravel_validity(2).unwrap_err();
 2921 |         assert!(matches!(err, lance_core::Error::InvalidInput { .. }));
 2922 |         assert!(err.to_string().contains("incompatible validity metadata"));
 2923 |     }
 2924 | 
 2925 |     #[test]
 2926 |     fn test_repdef_empty_offsets() {
 2927 |         // Empty offsets should serialize without panicking.
 2928 |         let mut builder = RepDefBuilder::default();
 2929 |         builder.add_offsets(offsets_32(&[0]), None);
 2930 |         let repdefs = RepDefBuilder::serialize(vec![builder]);
 2931 |         assert!(repdefs.repetition_levels.is_none());
 2932 |         assert!(repdefs.definition_levels.is_none());
 2933 |     }
 2934 | 
 2935 |     #[test]
 2936 |     fn test_repdef_basic() {
 2937 |         // Basic case, rep & def
 2938 |         let mut builder = RepDefBuilder::default();
 2939 |         builder.add_offsets(
 2940 |             offsets_64(&[0, 2, 2, 5]),
 2941 |             Some(validity(&[true, false, true])),
 2942 |         );
 2943 |         builder.add_offsets(
 2944 |             offsets_64(&[0, 1, 3, 5, 5, 9]),
 2945 |             Some(validity(&[true, true, true, false, true])),
 2946 |         );
 2947 |         builder.add_validity_bitmap(validity(&[
 2948 |             true, true, true, false, false, false, true, true, false,
 2949 |         ]));
 2950 | 
 2951 |         let repdefs = RepDefBuilder::serialize(vec![builder]);
 2952 |         let rep = repdefs.repetition_levels.unwrap();
 2953 |         let def = repdefs.definition_levels.unwrap();
 2954 | 
 2955 |         assert_eq!(vec![0, 0, 0, 3, 1, 1, 2, 1, 0, 0, 1], *def);
 2956 |         assert_eq!(vec![2, 1, 0, 2, 2, 0, 1, 1, 0, 0, 0], *rep);
 2957 | 
 2958 |         // [[I], [I, I]], NULL, [[NULL, NULL], NULL, [NULL, I, I, NULL]]
 2959 | 
 2960 |         let mut unraveler = CompositeRepDefUnraveler::new(vec![RepDefUnraveler::new(
 2961 |             Some(rep.as_ref().to_vec()),
 2962 |             Some(def.as_ref().to_vec()),
 2963 |             repdefs.def_meaning.into(),
 2964 |             9,
 2965 |         )]);
 2966 | 
 2967 |         // Note: validity doesn't exactly round-trip because repdef normalizes some of the
 2968 |         // redundant validity values
 2969 |         assert_eq!(
 2970 |             unraveler.unravel_validity(9).unwrap(),
 2971 |             Some(validity(&[
 2972 |                 true, true, true, false, false, false, true, true, false
 2973 |             ]))
 2974 |         );
 2975 |         let (off, val) = unraveler.unravel_offsets::<i32>().unwrap();
 2976 |         assert_eq!(off.inner(), offsets_32(&[0, 1, 3, 5, 5, 9]).inner());
 2977 |         assert_eq!(val, Some(validity(&[true, true, true, false, true])));
 2978 |         let (off, val) = unraveler.unravel_offsets::<i32>().unwrap();
 2979 |         assert_eq!(off.inner(), offsets_32(&[0, 2, 2, 5]).inner());
 2980 |         assert_eq!(val, Some(validity(&[true, false, true])));
 2981 |     }
 2982 | 
 2983 |     #[test]
 2984 |     fn test_repdef_simple_null_empty_list() {
 2985 |         let check = |repdefs: SerializedRepDefs, last_def: DefinitionInterpretation| {
 2986 |             let rep = repdefs.repetition_levels.unwrap();
 2987 |             let def = repdefs.definition_levels.unwrap();
 2988 | 
 2989 |             assert_eq!([1, 0, 1, 1, 0, 0], *rep);
 2990 |             assert_eq!([0, 0, 2, 0, 1, 0], *def);
 2991 |             assert_eq!(
 2992 |                 vec![DefinitionInterpretation::NullableItem, last_def,],
 2993 |                 repdefs.def_meaning
 2994 |             );
 2995 |         };
 2996 | 
 2997 |         // Null list and empty list should be serialized mostly the same
 2998 | 
 2999 |         // Null case
 3000 |         let mut builder = RepDefBuilder::default();
 3001 |         builder.add_offsets(
 3002 |             offsets_32(&[0, 2, 2, 5]),
 3003 |             Some(validity(&[true, false, true])),
 3004 |         );
 3005 |         builder.add_validity_bitmap(validity(&[true, true, true, false, true]));
 3006 | 
 3007 |         let repdefs = RepDefBuilder::serialize(vec![builder]);
 3008 | 
 3009 |         check(repdefs, DefinitionInterpretation::NullableList);
 3010 | 
 3011 |         // Empty case
 3012 |         let mut builder = RepDefBuilder::default();
 3013 |         builder.add_offsets(offsets_32(&[0, 2, 2, 5]), None);
 3014 |         builder.add_validity_bitmap(validity(&[true, true, true, false, true]));
 3015 | 
 3016 |         let repdefs = RepDefBuilder::serialize(vec![builder]);
 3017 | 
 3018 |         check(repdefs, DefinitionInterpretation::EmptyableList);
 3019 |     }
 3020 | 
 3021 |     #[test]
 3022 |     fn test_repdef_empty_list_at_end() {
 3023 |         // Regresses a failure we encountered when the last item was an empty list
 3024 |         let mut builder = RepDefBuilder::default();
 3025 |         builder.add_offsets(offsets_32(&[0, 2, 5, 5]), None);
 3026 |         builder.add_validity_bitmap(validity(&[true, true, true, false, true]));
 3027 | 
 3028 |         let repdefs = RepDefBuilder::serialize(vec![builder]);
 3029 | 
 3030 |         let rep = repdefs.repetition_levels.unwrap();
 3031 |         let def = repdefs.definition_levels.unwrap();
 3032 | 
 3033 |         assert_eq!([1, 0, 1, 0, 0, 1], *rep);
 3034 |         assert_eq!([0, 0, 0, 1, 0, 2], *def);
 3035 |         assert_eq!(
 3036 |             vec![
 3037 |                 DefinitionInterpretation::NullableItem,
 3038 |                 DefinitionInterpretation::EmptyableList,
 3039 |             ],
 3040 |             repdefs.def_meaning
 3041 |         );
 3042 |     }
 3043 | 
 3044 |     #[test]
 3045 |     fn test_repdef_abnormal_nulls() {
 3046 |         // List nulls are allowed to have non-empty offsets and garbage values
 3047 |         // and the add_offsets call should normalize this
 3048 |         let mut builder = RepDefBuilder::default();
 3049 |         builder.add_offsets(
 3050 |             offsets_32(&[0, 2, 5, 8]),
 3051 |             Some(validity(&[true, false, true])),
 3052 |         );
 3053 |         // Note: we pass 5 here and not 8.  If add_offsets tells us there is garbage nulls they
 3054 |         // should be removed before continuing
 3055 |         builder.add_no_null(5);
 3056 | 
 3057 |         let repdefs = RepDefBuilder::serialize(vec![builder]);
 3058 | 
 3059 |         let rep = repdefs.repetition_levels.unwrap();
 3060 |         let def = repdefs.definition_levels.unwrap();
 3061 | 
 3062 |         assert_eq!([1, 0, 1, 1, 0, 0], *rep);
 3063 |         assert_eq!([0, 0, 1, 0, 0, 0], *def);
 3064 | 
 3065 |         assert_eq!(
 3066 |             vec![
 3067 |                 DefinitionInterpretation::AllValidItem,
 3068 |                 DefinitionInterpretation::NullableList,
 3069 |             ],
 3070 |             repdefs.def_meaning
 3071 |         );
 3072 |     }
 3073 | 
 3074 |     #[test]
 3075 |     fn test_repdef_fsl() {
 3076 |         let mut builder = RepDefBuilder::default();
 3077 |         builder.add_fsl(Some(validity(&[true, false])), 2, 2);
 3078 |         builder.add_fsl(None, 2, 4);
 3079 |         builder.add_validity_bitmap(validity(&[
 3080 |             true, false, true, false, true, false, true, false,
 3081 |         ]));
 3082 | 
 3083 |         let repdefs = RepDefBuilder::serialize(vec![builder]);
 3084 | 
 3085 |         assert_eq!(
 3086 |             vec![
 3087 |                 DefinitionInterpretation::NullableItem,
 3088 |                 DefinitionInterpretation::AllValidItem,
 3089 |                 DefinitionInterpretation::NullableItem
 3090 |             ],
 3091 |             repdefs.def_meaning
 3092 |         );
 3093 | 
 3094 |         assert!(repdefs.repetition_levels.is_none());
 3095 | 
 3096 |         let def = repdefs.definition_levels.unwrap();
 3097 | 
 3098 |         assert_eq!([0, 1, 0, 1, 2, 2, 2, 2], *def);
 3099 | 
 3100 |         let mut unraveler = CompositeRepDefUnraveler::new(vec![RepDefUnraveler::new(
 3101 |             None,
 3102 |             Some(def.as_ref().to_vec()),
 3103 |             repdefs.def_meaning.into(),
 3104 |             8,
 3105 |         )]);
 3106 | 
 3107 |         assert_eq!(
 3108 |             unraveler.unravel_validity(8).unwrap(),
 3109 |             Some(validity(&[
 3110 |                 true, false, true, false, false, false, false, false
 3111 |             ]))
 3112 |         );
 3113 |         assert_eq!(unraveler.unravel_fsl_validity(4, 2).unwrap(), None);
 3114 |         assert_eq!(
 3115 |             unraveler.unravel_fsl_validity(2, 2).unwrap(),
 3116 |             Some(validity(&[true, false]))
 3117 |         );
 3118 |     }
 3119 | 
 3120 |     #[test]
 3121 |     fn test_repdef_fsl_zero_dimension_is_invalid_input() {
 3122 |         // A zero dimension can only reach us from a malformed schema.  Decimating with it
 3123 |         // used to loop forever, writing past the end of the definition levels buffer.
 3124 |         let mut builder = RepDefBuilder::default();
 3125 |         builder.add_fsl(Some(validity(&[true, false])), 2, 2);
 3126 |         builder.add_validity_bitmap(validity(&[true, false, true, false]));
 3127 | 
 3128 |         let repdefs = RepDefBuilder::serialize(vec![builder]);
 3129 |         let def = repdefs.definition_levels.unwrap();
 3130 | 
 3131 |         let mut unraveler = CompositeRepDefUnraveler::new(vec![RepDefUnraveler::new(
 3132 |             None,
 3133 |             Some(def.as_ref().to_vec()),
 3134 |             repdefs.def_meaning.into(),
 3135 |             4,
 3136 |         )]);
 3137 |         // Consume the item layer so the fixed-size-list layer is next
 3138 |         unraveler.unravel_validity(4).unwrap();
 3139 | 
 3140 |         let err = unraveler.unravel_fsl_validity(2, 0).unwrap_err();
 3141 |         assert!(matches!(err, lance_core::Error::InvalidInput { .. }));
 3142 |         assert!(
 3143 |             err.to_string()
 3144 |                 .contains("dimension must be a positive integer"),
 3145 |             "unexpected error: {}",
 3146 |             err
 3147 |         );
 3148 |     }
 3149 | 
 3150 |     #[test]
 3151 |     fn test_repdef_fsl_allvalid_item() {
 3152 |         let mut builder = RepDefBuilder::default();
 3153 |         builder.add_fsl(Some(validity(&[true, false])), 2, 2);
 3154 |         builder.add_fsl(None, 2, 4);
 3155 |         builder.add_no_null(8);
 3156 | 
 3157 |         let repdefs = RepDefBuilder::serialize(vec![builder]);
 3158 | 
 3159 |         assert_eq!(
 3160 |             vec![
 3161 |                 DefinitionInterpretation::AllValidItem,
 3162 |                 DefinitionInterpretation::AllValidItem,
 3163 |                 DefinitionInterpretation::NullableItem
 3164 |             ],
 3165 |             repdefs.def_meaning
 3166 |         );
 3167 | 
 3168 |         assert!(repdefs.repetition_levels.is_none());
 3169 | 
 3170 |         let def = repdefs.definition_levels.unwrap();
 3171 | 
 3172 |         assert_eq!([0, 0, 0, 0, 1, 1, 1, 1], *def);
 3173 | 
 3174 |         let mut unraveler = CompositeRepDefUnraveler::new(vec![RepDefUnraveler::new(
 3175 |             None,
 3176 |             Some(def.as_ref().to_vec()),
 3177 |             repdefs.def_meaning.into(),
 3178 |             8,
 3179 |         )]);
 3180 | 
 3181 |         assert_eq!(unraveler.unravel_validity(8).unwrap(), None);
 3182 |         assert_eq!(unraveler.unravel_fsl_validity(4, 2).unwrap(), None);
 3183 |         assert_eq!(
 3184 |             unraveler.unravel_fsl_validity(2, 2).unwrap(),
 3185 |             Some(validity(&[true, false]))
 3186 |         );
 3187 |     }
 3188 | 
 3189 |     #[test]
 3190 |     fn test_repdef_sliced_offsets() {
 3191 |         // Sliced lists may have offsets that don't start with zero.  The
 3192 |         // add_offsets call needs to normalize these to operate correctly.
 3193 |         let mut builder = RepDefBuilder::default();
 3194 |         builder.add_offsets(
 3195 |             offsets_32(&[5, 7, 7, 10]),
 3196 |             Some(validity(&[true, false, true])),
 3197 |         );
 3198 |         builder.add_no_null(5);
 3199 | 
 3200 |         let repdefs = RepDefBuilder::serialize(vec![builder]);
 3201 | 
 3202 |         let rep = repdefs.repetition_levels.unwrap();
 3203 |         let def = repdefs.definition_levels.unwrap();
 3204 | 
 3205 |         assert_eq!([1, 0, 1, 1, 0, 0], *rep);
 3206 |         assert_eq!([0, 0, 1, 0, 0, 0], *def);
 3207 | 
 3208 |         assert_eq!(
 3209 |             vec![
 3210 |                 DefinitionInterpretation::AllValidItem,
 3211 |                 DefinitionInterpretation::NullableList,
 3212 |             ],
 3213 |             repdefs.def_meaning
 3214 |         );
 3215 |     }
 3216 | 
 3217 |     #[test]
 3218 |     fn test_repdef_complex_null_empty() {
 3219 |         let mut builder = RepDefBuilder::default();
 3220 |         builder.add_offsets(
 3221 |             offsets_32(&[0, 4, 4, 4, 6]),
 3222 |             Some(validity(&[true, false, true, true])),
 3223 |         );
 3224 |         builder.add_offsets(
 3225 |             offsets_32(&[0, 1, 1, 2, 2, 2, 3]),
 3226 |             Some(validity(&[true, false, true, false, true, true])),
 3227 |         );
 3228 |         builder.add_no_null(3);
 3229 | 
 3230 |         let repdefs = RepDefBuilder::serialize(vec![builder]);
 3231 | 
 3232 |         let rep = repdefs.repetition_levels.unwrap();
 3233 |         let def = repdefs.definition_levels.unwrap();
 3234 | 
 3235 |         assert_eq!([2, 1, 1, 1, 2, 2, 2, 1], *rep);
 3236 |         assert_eq!([0, 1, 0, 1, 3, 4, 2, 0], *def);
 3237 |     }
 3238 | 
 3239 |     #[test]
 3240 |     fn test_repdef_empty_list_no_null() {
 3241 |         // Tests when we have some empty lists but no null lists.  This case
 3242 |         // caused some bugs because we have definition but no nulls
 3243 |         let mut builder = RepDefBuilder::default();
 3244 |         builder.add_offsets(offsets_32(&[0, 4, 4, 4, 6]), None);
 3245 |         builder.add_no_null(6);
 3246 | 
 3247 |         let repdefs = RepDefBuilder::serialize(vec![builder]);
 3248 | 
 3249 |         let rep = repdefs.repetition_levels.unwrap();
 3250 |         let def = repdefs.definition_levels.unwrap();
 3251 | 
 3252 |         assert_eq!([1, 0, 0, 0, 1, 1, 1, 0], *rep);
 3253 |         assert_eq!([0, 0, 0, 0, 1, 1, 0, 0], *def);
 3254 | 
 3255 |         let mut unraveler = CompositeRepDefUnraveler::new(vec![RepDefUnraveler::new(
 3256 |             Some(rep.as_ref().to_vec()),
 3257 |             Some(def.as_ref().to_vec()),
 3258 |             repdefs.def_meaning.into(),
 3259 |             8,
 3260 |         )]);
 3261 | 
 3262 |         assert_eq!(unraveler.unravel_validity(6).unwrap(), None);
 3263 |         let (off, val) = unraveler.unravel_offsets::<i32>().unwrap();
 3264 |         assert_eq!(off.inner(), offsets_32(&[0, 4, 4, 4, 6]).inner());
 3265 |         assert_eq!(val, None);
 3266 |     }
 3267 | 
 3268 |     #[test]
 3269 |     fn test_repdef_all_valid() {
 3270 |         let mut builder = RepDefBuilder::default();
 3271 |         builder.add_offsets(offsets_64(&[0, 2, 3, 5]), None);
 3272 |         builder.add_offsets(offsets_64(&[0, 1, 3, 5, 7, 9]), None);
 3273 |         builder.add_no_null(9);
 3274 | 
 3275 |         let repdefs = RepDefBuilder::serialize(vec![builder]);
 3276 |         let rep = repdefs.repetition_levels.unwrap();
 3277 |         assert!(repdefs.definition_levels.is_none());
 3278 | 
 3279 |         assert_eq!([2, 1, 0, 2, 0, 2, 0, 1, 0], *rep);
 3280 | 
 3281 |         let mut unraveler = CompositeRepDefUnraveler::new(vec![RepDefUnraveler::new(
 3282 |             Some(rep.as_ref().to_vec()),
 3283 |             None,
 3284 |             repdefs.def_meaning.into(),
 3285 |             9,
 3286 |         )]);
 3287 | 
 3288 |         assert_eq!(unraveler.unravel_validity(9).unwrap(), None);
 3289 |         let (off, val) = unraveler.unravel_offsets::<i32>().unwrap();
 3290 |         assert_eq!(off.inner(), offsets_32(&[0, 1, 3, 5, 7, 9]).inner());
 3291 |         assert_eq!(val, None);
 3292 |         let (off, val) = unraveler.unravel_offsets::<i32>().unwrap();
 3293 |         assert_eq!(off.inner(), offsets_32(&[0, 2, 3, 5]).inner());
 3294 |         assert_eq!(val, None);
 3295 |     }
 3296 | 
 3297 |     #[test]
 3298 |     fn test_repdef_nested_list_multibatch_matches_single() {
 3299 |         // Single builder: List<List<i32>>, 3 rows.
 3300 |         //   outer [0,2,3,5] -> rows have 2,1,2 inner lists
 3301 |         //   inner [0,1,3,5,7,9] -> 5 inner lists, lengths 1,2,2,2,2 (9 leaf)
 3302 |         let mut single = RepDefBuilder::default();
 3303 |         single.add_offsets(offsets_64(&[0, 2, 3, 5]), None);
 3304 |         single.add_offsets(offsets_64(&[0, 1, 3, 5, 7, 9]), None);
 3305 |         single.add_no_null(9);
 3306 |         let single_rep = RepDefBuilder::serialize(vec![single])
 3307 |             .repetition_levels
 3308 |             .unwrap();
 3309 | 
 3310 |         // Same logical data split into two batches:
 3311 |         //   batch0 = rows 0,1 : outer [0,2,3], inner [0,1,3,5] (3 inner, 5 leaf)
 3312 |         //   batch1 = row 2    : outer [0,2],   inner [0,2,4]   (2 inner, 4 leaf)
 3313 |         let mut b0 = RepDefBuilder::default();
 3314 |         b0.add_offsets(offsets_64(&[0, 2, 3]), None);
 3315 |         b0.add_offsets(offsets_64(&[0, 1, 3, 5]), None);
 3316 |         b0.add_no_null(5);
 3317 |         let mut b1 = RepDefBuilder::default();
 3318 |         b1.add_offsets(offsets_64(&[0, 2]), None);
 3319 |         b1.add_offsets(offsets_64(&[0, 2, 4]), None);
 3320 |         b1.add_no_null(4);
 3321 |         let multi_rep = RepDefBuilder::serialize(vec![b0, b1])
 3322 |             .repetition_levels
 3323 |             .unwrap();
 3324 | 
 3325 |         assert_eq!(
 3326 |             *single_rep, *multi_rep,
 3327 |             "multi-batch nested-list rep levels must equal single-batch"
 3328 |         );
 3329 |     }
 3330 | 
 3331 |     #[test]
 3332 |     fn test_only_empty_lists() {
 3333 |         let mut builder = RepDefBuilder::default();
 3334 |         builder.add_offsets(offsets_32(&[0, 4, 4, 4, 6]), None);
 3335 |         builder.add_no_null(6);
 3336 | 
 3337 |         let repdefs = RepDefBuilder::serialize(vec![builder]);
 3338 | 
 3339 |         let rep = repdefs.repetition_levels.unwrap();
 3340 |         let def = repdefs.definition_levels.unwrap();
 3341 | 
 3342 |         assert_eq!([1, 0, 0, 0, 1, 1, 1, 0], *rep);
 3343 |         assert_eq!([0, 0, 0, 0, 1, 1, 0, 0], *def);
 3344 | 
 3345 |         let mut unraveler = CompositeRepDefUnraveler::new(vec![RepDefUnraveler::new(
 3346 |             Some(rep.as_ref().to_vec()),
 3347 |             Some(def.as_ref().to_vec()),
 3348 |             repdefs.def_meaning.into(),
 3349 |             8,
 3350 |         )]);
 3351 | 
 3352 |         assert_eq!(unraveler.unravel_validity(6).unwrap(), None);
 3353 |         let (off, val) = unraveler.unravel_offsets::<i32>().unwrap();
 3354 |         assert_eq!(off.inner(), offsets_32(&[0, 4, 4, 4, 6]).inner());
 3355 |         assert_eq!(val, None);
 3356 |     }
 3357 | 
 3358 |     #[test]
 3359 |     fn test_only_null_lists() {
 3360 |         let mut builder = RepDefBuilder::default();
 3361 |         builder.add_offsets(
 3362 |             offsets_32(&[0, 4, 4, 4, 6]),
 3363 |             Some(validity(&[true, false, false, true])),
 3364 |         );
 3365 |         builder.add_no_null(6);
 3366 | 
 3367 |         let repdefs = RepDefBuilder::serialize(vec![builder]);
 3368 | 
 3369 |         let rep = repdefs.repetition_levels.unwrap();
 3370 |         let def = repdefs.definition_levels.unwrap();
 3371 | 
 3372 |         assert_eq!([1, 0, 0, 0, 1, 1, 1, 0], *rep);
 3373 |         assert_eq!([0, 0, 0, 0, 1, 1, 0, 0], *def);
 3374 | 
 3375 |         let mut unraveler = CompositeRepDefUnraveler::new(vec![RepDefUnraveler::new(
 3376 |             Some(rep.as_ref().to_vec()),
 3377 |             Some(def.as_ref().to_vec()),
 3378 |             repdefs.def_meaning.into(),
 3379 |             8,
 3380 |         )]);
 3381 | 
 3382 |         assert_eq!(unraveler.unravel_validity(6).unwrap(), None);
 3383 |         let (off, val) = unraveler.unravel_offsets::<i32>().unwrap();
 3384 |         assert_eq!(off.inner(), offsets_32(&[0, 4, 4, 4, 6]).inner());
 3385 |         assert_eq!(val, Some(validity(&[true, false, false, true])));
 3386 |     }
 3387 | 
 3388 |     #[test]
 3389 |     fn test_null_and_empty_lists() {
 3390 |         let mut builder = RepDefBuilder::default();
 3391 |         builder.add_offsets(
 3392 |             offsets_32(&[0, 4, 4, 4, 6]),
 3393 |             Some(validity(&[true, false, true, true])),
 3394 |         );
 3395 |         builder.add_no_null(6);
 3396 | 
 3397 |         let repdefs = RepDefBuilder::serialize(vec![builder]);
 3398 | 
 3399 |         let rep = repdefs.repetition_levels.unwrap();
 3400 |         let def = repdefs.definition_levels.unwrap();
 3401 | 
 3402 |         assert_eq!([1, 0, 0, 0, 1, 1, 1, 0], *rep);
 3403 |         assert_eq!([0, 0, 0, 0, 1, 2, 0, 0], *def);
 3404 | 
 3405 |         let mut unraveler = CompositeRepDefUnraveler::new(vec![RepDefUnraveler::new(
 3406 |             Some(rep.as_ref().to_vec()),
 3407 |             Some(def.as_ref().to_vec()),
 3408 |             repdefs.def_meaning.into(),
 3409 |             8,
 3410 |         )]);
 3411 | 
 3412 |         assert_eq!(unraveler.unravel_validity(6).unwrap(), None);
 3413 |         let (off, val) = unraveler.unravel_offsets::<i32>().unwrap();
 3414 |         assert_eq!(off.inner(), offsets_32(&[0, 4, 4, 4, 6]).inner());
 3415 |         assert_eq!(val, Some(validity(&[true, false, true, true])));
 3416 |     }
 3417 | 
 3418 |     #[test]
 3419 |     fn test_repdef_nullable_struct_in_null_and_empty_lists() {
 3420 |         let mut builder = RepDefBuilder::default();
 3421 |         builder.add_offsets(
 3422 |             offsets_32(&[0, 0, 3, 3]),
 3423 |             Some(validity(&[false, true, true])),
 3424 |         );
 3425 |         builder.add_validity_bitmap(validity(&[false, true, true]));
 3426 |         builder.add_validity_bitmap(validity(&[true, false, true]));
 3427 | 
 3428 |         let repdefs = RepDefBuilder::serialize(vec![builder]);
 3429 |         let mut unraveler = CompositeRepDefUnraveler::new(vec![RepDefUnraveler::new(
 3430 |             repdefs.repetition_levels.map(|levels| levels.to_vec()),
 3431 |             repdefs.definition_levels.map(|levels| levels.to_vec()),
 3432 |             repdefs.def_meaning.into(),
 3433 |             3,
 3434 |         )]);
 3435 | 
 3436 |         assert_eq!(
 3437 |             unraveler.unravel_validity(3).unwrap(),
 3438 |             Some(validity(&[false, false, true]))
 3439 |         );
 3440 |         assert_eq!(
 3441 |             unraveler.unravel_validity(3).unwrap(),
 3442 |             Some(validity(&[false, true, true]))
 3443 |         );
 3444 |         let (offsets, nulls) = unraveler.unravel_offsets::<i32>().unwrap();
 3445 |         assert_eq!(offsets.inner(), offsets_32(&[0, 0, 3, 3]).inner());
 3446 |         assert_eq!(nulls, Some(validity(&[false, true, true])));
 3447 |     }
 3448 | 
 3449 |     #[test]
 3450 |     fn test_repdef_null_struct_valid_list() {
 3451 |         // This regresses a bug
 3452 | 
 3453 |         let rep = vec![1, 0, 0, 0];
 3454 |         let def = vec![2, 0, 2, 2];
 3455 |         // AllValidList<NullableStruct<NullableItem>>
 3456 |         let def_meaning = vec![
 3457 |             DefinitionInterpretation::NullableItem,
 3458 |             DefinitionInterpretation::NullableItem,
 3459 |             DefinitionInterpretation::AllValidList,
 3460 |         ];
 3461 |         let num_items = 4;
 3462 | 
 3463 |         let mut unraveler = CompositeRepDefUnraveler::new(vec![RepDefUnraveler::new(
 3464 |             Some(rep),
 3465 |             Some(def),
 3466 |             def_meaning.into(),
 3467 |             num_items,
 3468 |         )]);
 3469 | 
 3470 |         assert_eq!(
 3471 |             unraveler.unravel_validity(4).unwrap(),
 3472 |             Some(validity(&[false, true, false, false]))
 3473 |         );
 3474 |         assert_eq!(
 3475 |             unraveler.unravel_validity(4).unwrap(),
 3476 |             Some(validity(&[false, true, false, false]))
 3477 |         );
 3478 |         let (off, val) = unraveler.unravel_offsets::<i32>().unwrap();
 3479 |         assert_eq!(off.inner(), offsets_32(&[0, 4]).inner());
 3480 |         assert_eq!(val, None);
 3481 |     }
 3482 | 
 3483 |     #[test]
 3484 |     fn test_repdef_no_rep() {
 3485 |         let mut builder = RepDefBuilder::default();
 3486 |         builder.add_no_null(5);
 3487 |         builder.add_validity_bitmap(validity(&[false, false, true, true, true]));
 3488 |         builder.add_validity_bitmap(validity(&[false, true, true, true, false]));
 3489 | 
 3490 |         let repdefs = RepDefBuilder::serialize(vec![builder]);
 3491 |         assert!(repdefs.repetition_levels.is_none());
 3492 |         let def = repdefs.definition_levels.unwrap();
 3493 | 
 3494 |         assert_eq!([2, 2, 0, 0, 1], *def);
 3495 | 
 3496 |         let mut unraveler = CompositeRepDefUnraveler::new(vec![RepDefUnraveler::new(
 3497 |             None,
 3498 |             Some(def.as_ref().to_vec()),
 3499 |             repdefs.def_meaning.into(),
 3500 |             5,
 3501 |         )]);
 3502 | 
 3503 |         assert_eq!(
 3504 |             unraveler.unravel_validity(5).unwrap(),
 3505 |             Some(validity(&[false, false, true, true, false]))
 3506 |         );
 3507 |         assert_eq!(
 3508 |             unraveler.unravel_validity(5).unwrap(),
 3509 |             Some(validity(&[false, false, true, true, true]))
 3510 |         );
 3511 |         assert_eq!(unraveler.unravel_validity(5).unwrap(), None);
 3512 |     }
 3513 | 
 3514 |     #[test]
 3515 |     fn test_composite_unravel() {
 3516 |         let mut builder = RepDefBuilder::default();
 3517 |         builder.add_offsets(
 3518 |             offsets_64(&[0, 2, 2, 5]),
 3519 |             Some(validity(&[true, false, true])),
 3520 |         );
 3521 |         builder.add_no_null(5);
 3522 |         let repdef1 = RepDefBuilder::serialize(vec![builder]);
 3523 | 
 3524 |         let mut builder = RepDefBuilder::default();
 3525 |         builder.add_offsets(offsets_64(&[0, 1, 3, 5, 7, 9]), None);
 3526 |         builder.add_no_null(9);
 3527 |         let repdef2 = RepDefBuilder::serialize(vec![builder]);
 3528 | 
 3529 |         let rep1 = repdef1.repetition_levels.clone().unwrap();
 3530 |         let def1 = repdef1.definition_levels.clone().unwrap();
 3531 |         let rep2 = repdef2.repetition_levels.clone().unwrap();
 3532 |         assert!(repdef2.definition_levels.is_none());
 3533 | 
 3534 |         assert_eq!([1, 0, 1, 1, 0, 0], *rep1);
 3535 |         assert_eq!([0, 0, 1, 0, 0, 0], *def1);
 3536 |         assert_eq!([1, 1, 0, 1, 0, 1, 0, 1, 0], *rep2);
 3537 | 
 3538 |         let unravel1 = RepDefUnraveler::new(
 3539 |             repdef1.repetition_levels.map(|l| l.to_vec()),
 3540 |             repdef1.definition_levels.map(|l| l.to_vec()),
 3541 |             repdef1.def_meaning.into(),
 3542 |             5,
 3543 |         );
 3544 |         let unravel2 = RepDefUnraveler::new(
 3545 |             repdef2.repetition_levels.map(|l| l.to_vec()),
 3546 |             repdef2.definition_levels.map(|l| l.to_vec()),
 3547 |             repdef2.def_meaning.into(),
 3548 |             9,
 3549 |         );
 3550 | 
 3551 |         let mut unraveler = CompositeRepDefUnraveler::new(vec![unravel1, unravel2]);
 3552 | 
 3553 |         assert!(unraveler.unravel_validity(9).unwrap().is_none());
 3554 |         let (off, val) = unraveler.unravel_offsets::<i32>().unwrap();
 3555 |         assert_eq!(
 3556 |             off.inner(),
 3557 |             offsets_32(&[0, 2, 2, 5, 6, 8, 10, 12, 14]).inner()
 3558 |         );
 3559 |         assert_eq!(
 3560 |             val,
 3561 |             Some(validity(&[true, false, true, true, true, true, true, true]))
 3562 |         );
 3563 |     }
 3564 | 
 3565 |     #[test]
 3566 |     fn test_repdef_multiple_builders() {
 3567 |         // Basic case, rep & def
 3568 |         let mut builder1 = RepDefBuilder::default();
 3569 |         builder1.add_offsets(offsets_64(&[0, 2]), None);
 3570 |         builder1.add_offsets(offsets_64(&[0, 1, 3]), None);
 3571 |         builder1.add_validity_bitmap(validity(&[true, true, true]));
 3572 | 
 3573 |         let mut builder2 = RepDefBuilder::default();
 3574 |         builder2.add_offsets(offsets_64(&[0, 0, 3]), Some(validity(&[false, true])));
 3575 |         builder2.add_offsets(
 3576 |             offsets_64(&[0, 2, 2, 6]),
 3577 |             Some(validity(&[true, false, true])),
 3578 |         );
 3579 |         builder2.add_validity_bitmap(validity(&[false, false, false, true, true, false]));
 3580 | 
 3581 |         let repdefs = RepDefBuilder::serialize(vec![builder1, builder2]);
 3582 | 
 3583 |         let rep = repdefs.repetition_levels.unwrap();
 3584 |         let def = repdefs.definition_levels.unwrap();
 3585 | 
 3586 |         assert_eq!([2, 1, 0, 2, 2, 0, 1, 1, 0, 0, 0], *rep);
 3587 |         assert_eq!([0, 0, 0, 3, 1, 1, 2, 1, 0, 0, 1], *def);
 3588 |     }
 3589 | 
 3590 |     #[test]
 3591 |     fn test_all_valid_validity_bitmap_serializes_as_no_null() {
 3592 |         let mut from_bitmap = RepDefBuilder::default();
 3593 |         from_bitmap.add_validity_bitmap(validity(&[true, true, true, true]));
 3594 | 
 3595 |         let mut from_no_null = RepDefBuilder::default();
 3596 |         from_no_null.add_no_null(4);
 3597 | 
 3598 |         let from_bitmap = RepDefBuilder::serialize(vec![from_bitmap]);
 3599 |         let from_no_null = RepDefBuilder::serialize(vec![from_no_null]);
 3600 | 
 3601 |         assert!(from_bitmap.repetition_levels.is_none());
 3602 |         assert!(from_bitmap.definition_levels.is_none());
 3603 |         assert_eq!(from_bitmap.def_meaning, from_no_null.def_meaning);
 3604 |         assert_eq!(
 3605 |             from_bitmap.max_visible_level,
 3606 |             from_no_null.max_visible_level
 3607 |         );
 3608 |     }
 3609 | 
 3610 |     #[test]
 3611 |     fn test_slicer() {
 3612 |         let mut builder = RepDefBuilder::default();
 3613 |         builder.add_offsets(
 3614 |             offsets_64(&[0, 2, 2, 30, 30]),
 3615 |             Some(validity(&[true, false, true, true])),
 3616 |         );
 3617 |         builder.add_no_null(30);
 3618 | 
 3619 |         let repdefs = RepDefBuilder::serialize(vec![builder]);
 3620 | 
 3621 |         let mut rep_slicer = repdefs.rep_slicer().unwrap();
 3622 | 
 3623 |         // First 5 items include a null list so we get 6 levels (12 bytes)
 3624 |         assert_eq!(rep_slicer.slice_next(5).len(), 12);
 3625 |         // Next 20 are all plain
 3626 |         assert_eq!(rep_slicer.slice_next(20).len(), 40);
 3627 |         // Last 5 include an empty list so we get 6 levels (12 bytes)
 3628 |         assert_eq!(rep_slicer.slice_rest().len(), 12);
 3629 | 
 3630 |         let mut def_slicer = repdefs.rep_slicer().unwrap();
 3631 | 
 3632 |         // First 5 items include a null list so we get 6 levels (12 bytes)
 3633 |         assert_eq!(def_slicer.slice_next(5).len(), 12);
 3634 |         // Next 20 are all plain
 3635 |         assert_eq!(def_slicer.slice_next(20).len(), 40);
 3636 |         // Last 5 include an empty list so we get 6 levels (12 bytes)
 3637 |         assert_eq!(def_slicer.slice_rest().len(), 12);
 3638 |     }
 3639 | 
 3640 |     #[test]
 3641 |     fn test_control_words() {
 3642 |         // Convert to control words, verify expected, convert back, verify same as original
 3643 |         fn check(
 3644 |             rep: &[u16],
 3645 |             def: &[u16],
 3646 |             expected_values: Vec<u8>,
 3647 |             expected_bytes_per_word: usize,
 3648 |             expected_bits_rep: u8,
 3649 |             expected_bits_def: u8,
 3650 |         ) {
 3651 |             let num_vals = rep.len().max(def.len());
 3652 |             let max_rep = rep.iter().max().copied().unwrap_or(0);
 3653 |             let max_def = def.iter().max().copied().unwrap_or(0);
 3654 | 
 3655 |             let in_rep = if rep.is_empty() { None } else { Some(rep) };
 3656 |             let in_def = if def.is_empty() { None } else { Some(def) };
 3657 | 
 3658 |             let mut iter = super::build_control_word_iterator(
 3659 |                 in_rep,
 3660 |                 max_rep,
 3661 |                 in_def,
 3662 |                 max_def,
 3663 |                 max_def + 1,
 3664 |                 expected_values.len(),
 3665 |             );
 3666 |             assert_eq!(iter.bytes_per_word(), expected_bytes_per_word);
 3667 |             assert_eq!(iter.bits_rep(), expected_bits_rep);
 3668 |             assert_eq!(iter.bits_def(), expected_bits_def);
 3669 |             let mut cw_vec = Vec::with_capacity(num_vals * iter.bytes_per_word());
 3670 | 
 3671 |             for _ in 0..num_vals {
 3672 |                 iter.append_next(&mut cw_vec);
 3673 |             }
 3674 |             assert!(iter.append_next(&mut cw_vec).is_none());
 3675 | 
 3676 |             assert_eq!(expected_values, cw_vec);
 3677 | 
 3678 |             let parser = super::ControlWordParser::new(expected_bits_rep, expected_bits_def);
 3679 | 
 3680 |             let mut rep_out = Vec::with_capacity(num_vals);
 3681 |             let mut def_out = Vec::with_capacity(num_vals);
 3682 | 
 3683 |             if expected_bytes_per_word > 0 {
 3684 |                 for slice in cw_vec.chunks_exact(expected_bytes_per_word) {
 3685 |                     parser.parse(slice, &mut rep_out, &mut def_out);
 3686 |                 }
 3687 |             }
 3688 | 
 3689 |             assert_eq!(rep, rep_out.as_slice());
 3690 |             assert_eq!(def, def_out.as_slice());
 3691 |         }
 3692 | 
 3693 |         // Each will need 4 bits and so we should get 1-byte control words
 3694 |         let rep = &[0_u16, 7, 3, 2, 9, 8, 12, 5];
 3695 |         let def = &[5_u16, 3, 1, 2, 12, 15, 0, 2];
 3696 |         let expected = vec![
 3697 |             0b00000101, // 0, 5
 3698 |             0b01110011, // 7, 3
 3699 |             0b00110001, // 3, 1
 3700 |             0b00100010, // 2, 2
 3701 |             0b10011100, // 9, 12
 3702 |             0b10001111, // 8, 15
 3703 |             0b11000000, // 12, 0
 3704 |             0b01010010, // 5, 2
 3705 |         ];
 3706 |         check(rep, def, expected, 1, 4, 4);
 3707 | 
 3708 |         // Now we need 5 bits for def so we get 2-byte control words
 3709 |         let rep = &[0_u16, 7, 3, 2, 9, 8, 12, 5];
 3710 |         let def = &[5_u16, 3, 1, 2, 12, 22, 0, 2];
 3711 |         let expected = vec![
 3712 |             0b00000101, 0b00000000, // 0, 5
 3713 |             0b11100011, 0b00000000, // 7, 3
 3714 |             0b01100001, 0b00000000, // 3, 1
 3715 |             0b01000010, 0b00000000, // 2, 2
 3716 |             0b00101100, 0b00000001, // 9, 12
 3717 |             0b00010110, 0b00000001, // 8, 22
 3718 |             0b10000000, 0b00000001, // 12, 0
 3719 |             0b10100010, 0b00000000, // 5, 2
 3720 |         ];
 3721 |         check(rep, def, expected, 2, 4, 5);
 3722 | 
 3723 |         // Just rep, 4 bits so 1 byte each
 3724 |         let levels = &[0_u16, 7, 3, 2, 9, 8, 12, 5];
 3725 |         let expected = vec![
 3726 |             0b00000000, // 0
 3727 |             0b00000111, // 7
 3728 |             0b00000011, // 3
 3729 |             0b00000010, // 2
 3730 |             0b00001001, // 9
 3731 |             0b00001000, // 8
 3732 |             0b00001100, // 12
 3733 |             0b00000101, // 5
 3734 |         ];
 3735 |         check(levels, &[], expected.clone(), 1, 4, 0);
 3736 | 
 3737 |         // Just def
 3738 |         check(&[], levels, expected, 1, 0, 4);
 3739 | 
 3740 |         // No rep, no def, no bytes
 3741 |         check(&[], &[], Vec::default(), 0, 0, 0);
 3742 |     }
 3743 | 
 3744 |     #[test]
 3745 |     fn test_control_words_def_only_all_zero_levels() {
 3746 |         // A page split can produce a page whose rows are all valid, so its
 3747 |         // definition levels are all zero and the max value in the (non-empty)
 3748 |         // buffer is 0.  The decoder reads a zero-bit layout as NIL (zero bytes
 3749 |         // per control word), so the writer must emit the NIL iterator too:
 3750 |         // zero bytes per word, no writes, one new-row/visible item per level.
 3751 |         // Writing one all-zero byte per word (the pre-fix Unary behavior)
 3752 |         // would disagree with the decoder and corrupt the stream.
 3753 |         let def = [0_u16; 5];
 3754 | 
 3755 |         let mut iter = super::build_control_word_iterator(
 3756 |             None,
 3757 |             0,
 3758 |             Some(&def),
 3759 |             /*max_def=*/ 0,
 3760 |             /*max_visible_def=*/ u16::MAX,
 3761 |             def.len(),
 3762 |         );
 3763 |         assert_eq!(iter.bytes_per_word(), 0);
 3764 |         assert_eq!(iter.bits_rep(), 0);
 3765 |         assert_eq!(iter.bits_def(), 0);
 3766 | 
 3767 |         let mut cw_vec = Vec::new();
 3768 |         for _ in 0..def.len() {
 3769 |             let word_desc = iter.append_next(&mut cw_vec).unwrap();
 3770 |             assert!(word_desc.is_new_row);
 3771 |             assert!(word_desc.is_visible);
 3772 |         }
 3773 |         assert!(iter.append_next(&mut cw_vec).is_none());
 3774 |         // The NIL layout writes nothing, matching what ControlWordParser::new(0, 0)
 3775 |         // reads back (Self::NIL parses nothing).
 3776 |         assert!(cw_vec.is_empty());
 3777 | 
 3778 |         // The parser side of the same layout must also be NIL: zero bits on
 3779 |         // both levels parse zero bytes and yield nothing.
 3780 |         let parser = super::ControlWordParser::new(0, 0);
 3781 |         let mut rep_out = Vec::new();
 3782 |         let mut def_out = Vec::new();
 3783 |         parser.parse(&[], &mut rep_out, &mut def_out);
 3784 |         assert!(rep_out.is_empty());
 3785 |         assert!(def_out.is_empty());
 3786 |     }
 3787 | 
 3788 |     #[test]
 3789 |     fn test_control_words_rep_only_all_zero_levels() {
 3790 |         // Same NIL-layout requirement as the definition-only case, for the
 3791 |         // repetition-only branches.  Repetition levels are normally never all
 3792 |         // zero (the first entry of every list row is the schema max rep), so
 3793 |         // this is a defensive check that the writer matches the decoder if a
 3794 |         // zero-width rep buffer is ever produced.
 3795 |         let rep = [0_u16; 5];
 3796 |         let mut iter = super::build_control_word_iterator(
 3797 |             Some(&rep),
 3798 |             /*max_rep=*/ 0,
 3799 |             None,
 3800 |             0,
 3801 |             /*max_visible_def=*/ u16::MAX,
 3802 |             rep.len(),
 3803 |         );
 3804 |         assert_eq!(iter.bytes_per_word(), 0);
 3805 |         let mut cw_vec = Vec::new();
 3806 |         for _ in 0..rep.len() {
 3807 |             assert!(iter.append_next(&mut cw_vec).unwrap().is_new_row);
 3808 |         }
 3809 |         assert!(iter.append_next(&mut cw_vec).is_none());
 3810 |         assert!(cw_vec.is_empty());
 3811 |     }
 3812 | 
 3813 |     #[test]
 3814 |     fn test_control_words_both_levels_all_zero() {
 3815 |         // Both levels non-empty but all zero: the Binary writer would emit one
 3816 |         // zero byte per word while the decoder reads a NIL layout (zero bytes
 3817 |         // per word).  The unified zero-width early return avoids that
 3818 |         // write/read asymmetry.
 3819 |         let rep = [0_u16; 5];
 3820 |         let def = [0_u16; 5];
 3821 |         let mut iter = super::build_control_word_iterator(
 3822 |             Some(&rep),
 3823 |             /*max_rep=*/ 0,
 3824 |             Some(&def),
 3825 |             /*max_def=*/ 0,
 3826 |             /*max_visible_def=*/ u16::MAX,
 3827 |             rep.len(),
 3828 |         );
 3829 |         assert_eq!(iter.bytes_per_word(), 0);
 3830 |         assert_eq!(iter.bits_rep(), 0);
 3831 |         assert_eq!(iter.bits_def(), 0);
 3832 |         let mut cw_vec = Vec::new();
 3833 |         for _ in 0..rep.len() {
 3834 |             assert!(iter.append_next(&mut cw_vec).unwrap().is_new_row);
 3835 |         }
 3836 |         assert!(iter.append_next(&mut cw_vec).is_none());
 3837 |         assert!(cw_vec.is_empty());
 3838 |     }
 3839 | 
 3840 |     #[test]
 3841 |     fn test_control_words_rep_index() {
 3842 |         fn check(
 3843 |             rep: &[u16],
 3844 |             def: &[u16],
 3845 |             expected_new_rows: Vec<bool>,
 3846 |             expected_is_visible: Vec<bool>,
 3847 |         ) {
 3848 |             let num_vals = rep.len().max(def.len());
 3849 |             let max_rep = rep.iter().max().copied().unwrap_or(0);
 3850 |             let max_def = def.iter().max().copied().unwrap_or(0);
 3851 | 
 3852 |             let in_rep = if rep.is_empty() { None } else { Some(rep) };
 3853 |             let in_def = if def.is_empty() { None } else { Some(def) };
 3854 | 
 3855 |             let mut iter = super::build_control_word_iterator(
 3856 |                 in_rep,
 3857 |                 max_rep,
 3858 |                 in_def,
 3859 |                 max_def,
 3860 |                 /*max_visible_def=*/ 2,
 3861 |                 expected_new_rows.len(),
 3862 |             );
 3863 | 
 3864 |             let mut cw_vec = Vec::with_capacity(num_vals * iter.bytes_per_word());
 3865 |             let mut expected_new_rows = expected_new_rows.iter().copied();
 3866 |             let mut expected_is_visible = expected_is_visible.iter().copied();
 3867 |             for _ in 0..expected_new_rows.len() {
 3868 |                 let word_desc = iter.append_next(&mut cw_vec).unwrap();
 3869 |                 assert_eq!(word_desc.is_new_row, expected_new_rows.next().unwrap());
 3870 |                 assert_eq!(word_desc.is_visible, expected_is_visible.next().unwrap());
 3871 |             }
 3872 |             assert!(iter.append_next(&mut cw_vec).is_none());
 3873 |         }
 3874 | 
 3875 |         // 2 means new list
 3876 |         let rep = &[2_u16, 1, 0, 2, 2, 0, 1, 1, 0, 2, 0];
 3877 |         // These values don't matter for this test
 3878 |         let def = &[0_u16, 0, 0, 3, 1, 1, 2, 1, 0, 0, 1];
 3879 | 
 3880 |         // Rep & def
 3881 |         check(
 3882 |             rep,
 3883 |             def,
 3884 |             vec![
 3885 |                 true, false, false, true, true, false, false, false, false, true, false,
 3886 |             ],
 3887 |             vec![
 3888 |                 true, true, true, false, true, true, true, true, true, true, true,
 3889 |             ],
 3890 |         );
 3891 |         // Rep only
 3892 |         check(
 3893 |             rep,
 3894 |             &[],
 3895 |             vec![
 3896 |                 true, false, false, true, true, false, false, false, false, true, false,
 3897 |             ],
 3898 |             vec![true; 11],
 3899 |         );
 3900 |         // No repetition
 3901 |         check(
 3902 |             &[],
 3903 |             def,
 3904 |             vec![
 3905 |                 true, true, true, true, true, true, true, true, true, true, true,
 3906 |             ],
 3907 |             vec![true; 11],
 3908 |         );
 3909 |         // No repetition, no definition
 3910 |         check(
 3911 |             &[],
 3912 |             &[],
 3913 |             vec![
 3914 |                 true, true, true, true, true, true, true, true, true, true, true,
 3915 |             ],
 3916 |             vec![true; 11],
 3917 |         );
 3918 |     }
 3919 | 
 3920 |     #[test]
 3921 |     fn regress_empty_list_case() {
 3922 |         // This regresses a case where we had 3 null lists inside a struct
 3923 |         let mut builder = RepDefBuilder::default();
 3924 |         builder.add_validity_bitmap(validity(&[true, false, true]));
 3925 |         builder.add_offsets(
 3926 |             offsets_32(&[0, 0, 0, 0]),
 3927 |             Some(validity(&[false, false, false])),
 3928 |         );
 3929 |         builder.add_no_null(0);
 3930 | 
 3931 |         let repdefs = RepDefBuilder::serialize(vec![builder]);
 3932 |         let rep = repdefs.repetition_levels.unwrap();
 3933 |         let def = repdefs.definition_levels.unwrap();
 3934 | 
 3935 |         assert_eq!([1, 1, 1], *rep);
 3936 |         assert_eq!([1, 2, 1], *def);
 3937 | 
 3938 |         let mut unraveler = CompositeRepDefUnraveler::new(vec![RepDefUnraveler::new(
 3939 |             Some(rep.as_ref().to_vec()),
 3940 |             Some(def.as_ref().to_vec()),
 3941 |             repdefs.def_meaning.into(),
 3942 |             0,
 3943 |         )]);
 3944 | 
 3945 |         assert_eq!(unraveler.unravel_validity(0).unwrap(), None);
 3946 |         let (off, val) = unraveler.unravel_offsets::<i32>().unwrap();
 3947 |         assert_eq!(off.inner(), offsets_32(&[0, 0, 0, 0]).inner());
 3948 |         assert_eq!(val, Some(validity(&[false, false, false])));
 3949 |         let val = unraveler.unravel_validity(3).unwrap().unwrap();
 3950 |         assert_eq!(val.inner(), validity(&[true, false, true]).inner());
 3951 |     }
 3952 | 
 3953 |     #[test]
 3954 |     fn regress_list_ends_null_case() {
 3955 |         let mut builder = RepDefBuilder::default();
 3956 |         builder.add_offsets(
 3957 |             offsets_64(&[0, 1, 2, 2]),
 3958 |             Some(validity(&[true, true, false])),
 3959 |         );
 3960 |         builder.add_offsets(offsets_64(&[0, 1, 1]), Some(validity(&[true, false])));
 3961 |         builder.add_no_null(1);
 3962 | 
 3963 |         let repdefs = RepDefBuilder::serialize(vec![builder]);
 3964 |         let rep = repdefs.repetition_levels.unwrap();
 3965 |         let def = repdefs.definition_levels.unwrap();
 3966 | 
 3967 |         assert_eq!([2, 2, 2], *rep);
 3968 |         assert_eq!([0, 1, 2], *def);
 3969 | 
 3970 |         let mut unraveler = CompositeRepDefUnraveler::new(vec![RepDefUnraveler::new(
 3971 |             Some(rep.as_ref().to_vec()),
 3972 |             Some(def.as_ref().to_vec()),
 3973 |             repdefs.def_meaning.into(),
 3974 |             1,
 3975 |         )]);
 3976 | 
 3977 |         assert_eq!(unraveler.unravel_validity(1).unwrap(), None);
 3978 |         let (off, val) = unraveler.unravel_offsets::<i32>().unwrap();
 3979 |         assert_eq!(off.inner(), offsets_32(&[0, 1, 1]).inner());
 3980 |         assert_eq!(val, Some(validity(&[true, false])));
 3981 |         let (off, val) = unraveler.unravel_offsets::<i32>().unwrap();
 3982 |         assert_eq!(off.inner(), offsets_32(&[0, 1, 2, 2]).inner());
 3983 |         assert_eq!(val, Some(validity(&[true, true, false])));
 3984 |     }
 3985 | 
 3986 |     #[test]
 3987 |     fn test_mixed_unraveler() {
 3988 |         // This tests cases where the validity is different between two different pages
 3989 |         // because one page has nulls and the other doesn't.
 3990 | 
 3991 |         // Simple case with one layer of validity and no repetition
 3992 |         let mut unraveler = CompositeRepDefUnraveler::new(vec![
 3993 |             RepDefUnraveler::new(
 3994 |                 None,
 3995 |                 Some(vec![0, 1, 0, 1]),
 3996 |                 vec![DefinitionInterpretation::NullableItem].into(),
 3997 |                 4,
 3998 |             ),
 3999 |             RepDefUnraveler::new(
 4000 |                 None,
 4001 |                 None,
 4002 |                 vec![DefinitionInterpretation::AllValidItem].into(),
 4003 |                 4,
 4004 |             ),
 4005 |         ]);
 4006 | 
 4007 |         assert_eq!(
 4008 |             unraveler.unravel_validity(8).unwrap(),
 4009 |             Some(validity(&[
 4010 |                 true, false, true, false, true, true, true, true
 4011 |             ]))
 4012 |         );
 4013 | 
 4014 |         // More complex case with two layers of validity and repetition
 4015 |         let def1 = Some(vec![0, 1, 2]);
 4016 |         let rep1 = Some(vec![1, 0, 1]);
 4017 | 
 4018 |         let def2 = Some(vec![1, 0, 0]);
 4019 |         let rep2 = Some(vec![1, 1, 0]);
 4020 | 
 4021 |         let mut unraveler = CompositeRepDefUnraveler::new(vec![
 4022 |             RepDefUnraveler::new(
 4023 |                 rep1,
 4024 |                 def1,
 4025 |                 vec![
 4026 |                     DefinitionInterpretation::NullableItem,
 4027 |                     DefinitionInterpretation::EmptyableList,
 4028 |                 ]
 4029 |                 .into(),
 4030 |                 2,
 4031 |             ),
 4032 |             RepDefUnraveler::new(
 4033 |                 rep2,
 4034 |                 def2,
 4035 |                 vec![
 4036 |                     DefinitionInterpretation::AllValidItem,
 4037 |                     DefinitionInterpretation::NullableList,
 4038 |                 ]
 4039 |                 .into(),
 4040 |                 2,
 4041 |             ),
 4042 |         ]);
 4043 | 
 4044 |         assert_eq!(
 4045 |             unraveler.unravel_validity(4).unwrap(),
 4046 |             Some(validity(&[true, false, true, true]))
 4047 |         );
 4048 |         assert_eq!(
 4049 |             unraveler.unravel_offsets::<i32>().unwrap(),
 4050 |             (
 4051 |                 offsets_32(&[0, 2, 2, 2, 4]),
 4052 |                 Some(validity(&[true, true, false, true]))
 4053 |             )
 4054 |         );
 4055 |     }
 4056 | 
 4057 |     #[test]
 4058 |     fn test_mixed_unraveler_nullable_without_def_levels() {
 4059 |         // A page can keep nullable layer metadata even when all definition levels are 0
 4060 |         // and no definition buffer needs to be materialized. This should decode as all-valid.
 4061 |         let mut unraveler = CompositeRepDefUnraveler::new(vec![
 4062 |             RepDefUnraveler::new(
 4063 |                 None,
 4064 |                 Some(vec![0, 1, 0, 1]),
 4065 |                 vec![DefinitionInterpretation::NullableItem].into(),
 4066 |                 4,
 4067 |             ),
 4068 |             RepDefUnraveler::new(
 4069 |                 None,
 4070 |                 None,
 4071 |                 vec![DefinitionInterpretation::NullableItem].into(),
 4072 |                 4,
 4073 |             ),
 4074 |         ]);
 4075 | 
 4076 |         assert_eq!(
 4077 |             unraveler.unravel_validity(8).unwrap(),
 4078 |             Some(validity(&[
 4079 |                 true, false, true, false, true, true, true, true
 4080 |             ]))
 4081 |         );
 4082 |     }
 4083 | }
``````
