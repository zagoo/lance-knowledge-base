> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-encoding/src/encodings/physical/rle.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `313e9fe585556946cfb094ed49117c8eb1c6f08f5f98e59d35742e48aea51501`. Reviewed physical lines: 1-3414.

[Module](../../../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Physical run-length encoding: raw/adaptive run widths, mini chunk construction and child candidates, framed whole blocks, strict and legacy-clamping eager readers, validated unexpanded u16 runs and38 test functions. (rust/lance-encoding/src/encodings/physical/rle.rs:1-3414)

## Complete range analysis

### Lines 1-28

SPDX and module docs introduce two RLE buffers: one value per physical run and its unsigned8/16/32 repeat count. Values are not globally unique: nonadjacent equal values or width/chunk splits repeat entries. Example i32[1,1,1,2,2,3,3,3,3] becomes values[1,2,3], lengths[3,2,4]. U8 splits runs at255; wider lengths reduce splitting. (rust/lance-encoding/src/encodings/physical/rle.rs:1-28)

### Lines 29-55

Docs list8/16/32/64 integer/float widths and claim automatic run count<50% plus2048-value mini cap. Those statements are stale: shared policy applies a fraction only if explicit and compares byte costs; current lazy cap defaults4096 and clamps environment override1..32768. Block frame is one u64LE value-buffer byte size followed by value bytes then length bytes. (rust/lance-encoding/src/compression.rs:174-267; rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:19-34) (rust/lance-encoding/src/encodings/physical/rle.rs:29-55)

### Lines 56-75

Imports connect ArrowNativeType/ScalarBuffer, trace logging, LanceBuffer/DataBlock, shared compression traits/payload guard, mini constants and metadata, general child compressor factory, protobuf helper and Lance errors. No production async, IO or local unsafe block; typed borrowing may share or copy depending alignment. (rust/lance-encoding/src/buffer.rs:145-172) (rust/lance-encoding/src/encodings/physical/rle.rs:56-75)

### Lines 76-120

Crate-internal Debug/Clone/Copy/PartialEq/Eq RunLengthWidth variants U8/U16/U32 represent literal repeat counts, maxima255/65535/4294967295. from_bits accepts8/16/32 elseNone; bits_per_value returns width; private bytes_per_value/max_run_length map to1/2/4 and native unsigned maxima. No zero-based length offset. (rust/lance-encoding/src/encodings/physical/rle.rs:76-120)

### Lines 121-141

Private write_length narrows to selected unsigned type without bounds check and writes LE; read_length indexes exactly1/2/4 bytes without checking available length. Callers must validate. Private RUN_LENGTH_WIDTHS order[U8,U16,U32] defines cost-tie preference. (rust/lance-encoding/src/encodings/physical/rle.rs:121-141)

### Lines 142-176

Crate-internal select_run_length_width_from_entries requires exactly3 entry counts and value width8/16/32/64, otherwise contextual InvalidInputSource. Starts U8, compares payload costs using strict less, retaining narrower width on equal cost. Does not validate whether entry counts are realizable/ordered or include headers/child compression. (rust/lance-encoding/src/encodings/physical/rle.rs:142-176)

### Lines 177-220

Crate-internal rle_encoded_size_from_entries multiplies u128 entry count by floor(valuebits/8)+lengthbytes without its own width validation. run_length_width_index maps widths to0/1/2. select_run_length_width and rle_encoded_size first collect counts from actual data/count/width/optional segmentation then select or index cost. These are scans/estimates, not encoded output. (rust/lance-encoding/src/encodings/physical/rle.rs:177-220)

### Lines 221-284

Private collection checked-converts count to usize, macro checked-multiplies by native value bytes, requires exact physical data length, borrows unsigned typed words and bounds-checks prefix. Width dispatch8/16/32/64 elseInvalidInput. Empty exact buffer returns all-zero counts through slice helper. Signed/floating values compare raw unsigned bit patterns. Typed borrowing can copy unaligned bytes; no statistic cache. (rust/lance-encoding/src/encodings/physical/rle.rs:221-284)

### Lines 285-310

Generic run scan returns[0;3] for empty; otherwise compares adjacent values, accumulates each maximal run and final run. current_length increment is ordinary u64 addition. Equality is raw unsigned for actual dispatch; the generic helper itself uses T PartialEq. No null bitmap or logical schema enters. (rust/lance-encoding/src/encodings/physical/rle.rs:285-310)

### Lines 311-328

Crate-internal accumulate_run_length_entries uses supplied segment cap or run_length, clamped to at least1, splits each run independently, and saturating-adds ceil(segment/width_max) to three counters. Zero run contributes nothing. This estimator segments each run, not a global chunk cursor, and ignores MAX_MINIBLOCK_BYTES/power-of-two boundaries, so it need not equal actual mini payload size. (rust/lance-encoding/src/encodings/physical/rle.rs:311-328)

### Lines 329-351

Public Debug RleEncoder stores private width, optional values/run-length general configs and child-bitpacking bool. Private Clone RleChildCandidate stores descriptor, LanceBuffer, per-chunk u32 sizes, aggregate usize size and external-count dependency. Encoder Default delegates public new. No shared mutable state or codec cache in encoder itself. (rust/lance-encoding/src/encodings/physical/rle.rs:329-351)

### Lines 352-384

Public new selects U8, no general children and no bitpacking. Crate-internal with_run_length_width changes width only; with_child_encoding accepts independent child configs and bitpacking flag unchecked. Their names are constructors, not consuming builders. Whole-block compression later ignores child configs/flag. (rust/lance-encoding/src/encodings/physical/rle.rs:352-384)

### Lines 385-419

Private encode_data handles declared0 immediately with empty buffer/chunk vectors, before checking input bytes or width. Otherwise checked usize count; estimate runs=count/10, reserve value/length capacities with unchecked products, then prepare global append buffers and offset/remaining cursor. Initial10:1 ratio is allocation guess, not threshold. (rust/lance-encoding/src/encodings/physical/rle.rs:385-419)

### Lines 420-473

Each mini iteration dispatches unsigned native chunk encoder, unsupported width InvalidInput. Zero progress yields Internal with remaining count, offset, physical length, width and cap, discarding partial local output through Result. Unlike block encoder no up-front exact byte-length check. Subsequent typed borrow can panic for non-divisible clipped buffers. (rust/lance-encoding/src/encodings/physical/rle.rs:420-473)

### Lines 474-501

Last chunk stores log_num_values0; nonlast asserts processed count power-of-two then stores ilog2 as u8. Append MiniBlockChunk with per-child new byte lengths cast to u32, update cursor/remaining and loop. Return exactly two global buffers for nonempty input. Global vectors own all chunks; consumers must slice using buffer_sizes rather than treat them as independently framed chunks. (rust/lance-encoding/src/encodings/physical/rle.rs:474-501)

### Lines 502-570

Whole-block dispatch validates width even for count0. Generic path checked-converts count, checked-multiplies byte size and requires exact input length. Empty valid input returns two present empty buffers. Nonempty borrows complete unsigned slice, reserves count/10 estimates then encodes all runs without mini count/byte splitting. Surplus input is rejected here, unlike mini encoding which only visits declared values. (rust/lance-encoding/src/encodings/physical/rle.rs:502-570)

### Lines 571-620

Rolling mini chunk bounds prefix by remaining count and lazy max values. Byte offset/end products are unchecked; clips end to data length, returns zero progress if start beyond data or typed slice empty. Computes encoded size for full available prefix. If all declared remaining values fit cap and payload<=8186, mark final; else choose largest valid power-of-two prefix. Then encode exactly that prefix, returning physical run count and consumed values. Clipped short input eventually errors when remaining values cannot progress. (rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:19-34) (rust/lance-encoding/src/encodings/physical/rle.rs:571-620)

### Lines 621-635

largest_power_of_two_prefix starts highest power<=min(actual typed length,cap) using ilog2, repeatedly halves until a prefix>1 fits payload budget, elseNone. Standalone empty input would panic at ilog2, but local caller returns early for empty typed data. One-value nonfinal chunks are forbidden because log0 is final sentinel; configured cap1 can make nontrivial input fail progress. (rust/lance-encoding/src/encodings/physical/rle.rs:621-635)

### Lines 636-669

encoded_size scans adjacent runs and sums run_size for each, using usize arithmetic. run_size=ceil(length/selected_max)*(sizeofT+lengthbytes). Zero slice costs0. Repeated prefix-size scans add CPU before final encode; no headers/structural levels/padding/child codec sizes included. (rust/lance-encoding/src/encodings/physical/rle.rs:636-669)

### Lines 670-726

encode_values scans maximal adjacent-equal runs and calls add_run. add_run borrows native value bytes with bytemuck, reserves full+remainder entries, emits repeated value plus max length for every full-width segment, then remainder ifpositive. Exact multiples emit no zero remainder. Values use host representation under crate little-endian gate; lengths explicitly LE. Returned combined bytes are unchecked usize products/sum. (rust/lance-encoding/src/lib.rs:27-31) (rust/lance-encoding/src/encodings/physical/rle.rs:670-726)

### Lines 727-744

flat_child_candidate creates Flat(bits,None), clones selected global LanceBuffer and collects matching per-chunk sizes; size is buffer len and count dependency false. Indexing assumes two valid buffers and corresponding chunk sizes; does not validate coverage or alignment. Buffer clone shares underlying Arrow allocation. (rust/lance-encoding/src/encodings/physical/rle.rs:727-744)

### Lines 745-814

General child candidate skips absent/empty selected buffer, constructs requested compressor or propagates error, then compresses each original chunk into one concatenated Vec. Checked offset addition/bounds and u32 compressed chunk size; total original size addition unchecked. Candidate only if aggregate compressed bytes strictly less than visited original bytes; individual chunks may expand. Retains selected config in General(Flat) descriptor and marks count-independent. No final offset==original len check, but normal encode_data sizes cover it. Codec/metadata failure propagates instead of ignoring optional candidate. (rust/lance-encoding/src/encodings/physical/rle.rs:745-814)

### Lines 815-864

Feature-gated bitpacked child rejects empty buffer, computes one required bit width across all runs and refuses width>=native. Creates OutOfLineBitpacking using this global compressed width, then prepares packed bytes/per-chunk sizes and checked conversion of nativebytewidth. Bit width minimum is1 even when every value is0. (rust/lance-encoding/src/encodings/physical/rle.rs:815-864)

### Lines 865-913

Per bitpacked child chunk checked-adds/bounds offset, rejects zero nativebytes or nonmultiple chunk size, derives physical run count from bytes, builds fixed block and calls OutOfLine blockcompressor. Missing payload Internal; oversized chunk u32 conversion InvalidInput. Appends payload and offsets; aggregate candidate must be strictly smaller than entire original buffer. Descriptor OutOfLine(native,Flat(packed,None)); requires external run count. No final coverage check local. (rust/lance-encoding/src/encodings/physical/rle.rs:865-913)

### Lines 914-952

Feature-gated required_bits reads unsigned LE8/16/32/64 words, uses max value or0, returns max(bitlength,1). as_chunks remainder is ignored here; per-chunk validity later catches normal malformed sizes. Unsupported valuebits InvalidInput. No signed-magnitude or float numerical interpretation. (rust/lance-encoding/src/encodings/physical/rle.rs:914-952)

### Lines 953-991

child_candidates always starts Flat, then optional General, then optional feature-enabled bitpacking. Without feature the flag is explicitly unused. No General-over-bitpacking candidate is written here although reader grammar accepts it. Candidate errors abort whole selection; configuration presence does not force General to win. (rust/lance-encoding/src/encodings/physical/rle.rs:953-991)

### Lines 992-1012

select_child_candidates enumerates value candidates outer and length candidates inner, excludes pairs where both need externalcount, minimizes unchecked usize sum strictly, so ties keep first ordering. Expects at least one viable pair (Flat invariant), then clones selected candidates; Arc-backed payload clones are cheap but per-chunk size Vec/descriptor clones can allocate. Other candidates live until function return. (rust/lance-encoding/src/encodings/physical/rle.rs:992-1012)

### Lines 1013-1048

Crate-internal selected_payload_size fully executes encode_data and both candidate generation paths, selects pair, returns saturating u128 combined size; empty returns0. It is not allocation-free estimation and excludes framing/padding/descriptors. Private with_size_from_data sets candidate size from actual owned buffer. Shared policy can invoke this then encode again. (rust/lance-encoding/src/compression.rs:235-267) (rust/lance-encoding/src/encodings/physical/rle.rs:1013-1048)

### Lines 1049-1083

MiniBlockCompressor impl ignores MiniBlockCompressionContext entirely and requires direct FixedWidth. encode_data empty shortcut returns empty data/chunks plus raw RLE(Flat originalbits,Flat lengthbits) descriptor, even if zero-count input has unsupported width or surplusbytes. No requested child config is used in empty path. (rust/lance-encoding/src/encodings/physical/rle.rs:1049-1083)

### Lines 1084-1118

Nonempty mini compression generates both candidate lists, selects globally compatible pair, substitutes candidate sizes into each chunk while retaining logs, returns two selected global buffers/originalcount and RLE childdescriptors. No second per-chunk byte-budget test after childcompression; aggregate savings can coexist with expansion of one chunk. Wrong DataBlock kind InvalidInputSource. (rust/lance-encoding/src/encodings/physical/rle.rs:1084-1118)

### Lines 1119-1151

BlockCompressor requires FixedWidth, calls strict raw whole-block encoder, stores values_size as u64LE in fresh Vec followed by all raw values and lengths; returns Some even for empty (8zero bytes). Descriptor children always Flat using selected widths. It does not use values_compression/run_lengths_compression/use_child_bitpacking. Other DataBlock kinds InvalidInput. CombinedVec grows without a precomputed capacity. (rust/lance-encoding/src/encodings/physical/rle.rs:1119-1151)

### Lines 1152-1174

Public Debug RleDecompressor stores private value width, run width and two RleChildDecompressors. The crate-internal child stores its width and a private Flat or Block enum. Block contains a boxed decoder and a requires_num_values flag. There is no version parameter or mutable cache. (rust/lance-encoding/src/encodings/physical/rle.rs:1152-1174)

### Lines 1175-1214

Crate-internal child constructors store unchecked widths and decoder/count dependencies. bits_per_value returns the stored width. Flat never requires a count; Block uses its flag. is_identity recognizes only the Flat enum arm. (rust/lance-encoding/src/encodings/physical/rle.rs:1175-1214)

### Lines 1215-1241

Private child decode returns Flat bytes unchanged, without validating width or count. A count-dependent Block requires Some count; other Block children receive the optional count or zero. Decoder errors propagate, then extract_fixed_width validates the result. Zero serves as an unknown-count sentinel. (rust/lance-encoding/src/encodings/physical/rle.rs:1215-1241)

### Lines 1242-1276

extract_fixed_width requires FixedWidth and the configured bit width. It checks block.num_values only when expected count is nonzero. It returns payload bytes without checking their length against the returned count. Errors include the child role and actual/expected values. Outer RLE checks paired physical sizes. General-wrapped Flat can deliberately return nonempty bytes with count zero. (rust/lance-encoding/src/encodings/physical/value.rs:601-619) (rust/lance-encoding/src/encodings/physical/rle.rs:1242-1276)

### Lines 1277-1312

Public new(valuebits) selects U8 lengths and raw children. Crate-internal constructors accept another run width or supplied children. Constructors do not validate widths or count dependencies; the shared factory normally does. Direct new can therefore retain an unsupported value width. (rust/lance-encoding/src/compression.rs:1238-1289) (rust/lance-encoding/src/encodings/physical/rle.rs:1277-1312)

### Lines 1313-1346

decode_data returns empty FixedWidth immediately for declared count zero, ignoring buffer count/content, configured width and child dependencies. Positive count requires exactly two buffers, then decodes children and expands runs. The strict unexpanded reader differs. The block entry point still parses its outer frame before this shortcut. (rust/lance-encoding/src/encodings/physical/rle.rs:1313-1346)

### Lines 1347-1397

decode_child_data dispatches eager expansion to unsigned u8/u16/u32/u64. Unsupported width returns InvalidInput. It wraps the expanded bytes with the configured width, external logical count and fresh BlockInfo. Original logical type and validity bitmap are not reconstructed here. (rust/lance-encoding/src/encodings/physical/rle.rs:1347-1397)

### Lines 1398-1435

sum_run_lengths validates native value width and paired buffer divisibility/count, then folds little-endian literal lengths. It rejects zero entries and checked-adds into u64. It neither reads value contents nor expands values. Empty valid children sum to zero. This supports the narrow legacy inference hook. (rust/lance-encoding/src/encodings/physical/rle.rs:1398-1435)

### Lines 1436-1470

validate_buffer_sizes requires values divisible by sizeof(T), lengths divisible by the selected length width, and equal numbers of physical entries. Errors describe both sizes/widths or both entry counts. It returns length bytes per entry without checking positivity, sum or expected logical count. (rust/lance-encoding/src/encodings/physical/rle.rs:1436-1470)

### Lines 1471-1513

decode_child_buffers rejects two count-dependent children. If values need a count, it decodes lengths first and derives run count from their byte length; the reverse applies when lengths need a count. If neither needs a count, values then lengths receive None. Error precedence follows this order. It does not call infer_num_values. (rust/lance-encoding/src/encodings/physical/rle.rs:1471-1513)

### Lines 1514-1532

num_child_values computes floor(bits/8), checked-converts to usize, rejects zero or a nondivisible buffer, and returns the quotient as u64. It does not independently require byte-aligned bits or a supported native width. Normal factory and outer checks establish those conditions. An empty child can yield the zero count sentinel. (rust/lance-encoding/src/encodings/physical/rle.rs:1514-1532)

### Lines 1533-1584

Generic eager expansion accepts an empty child only with expected count zero; positive count with either empty child errors. Nonempty input validates paired sizes, borrows typed values, checked-converts logical count to usize and try_reserve_exact allocates the expanded vector. Allocation failure becomes InvalidInput. Historical mini runs may cross checkpoints, so mini decoding clamps overflow while block decoding rejects it. No version tag gates this behavior. (rust/lance-encoding/src/encodings/physical/rle.rs:1533-1584)

### Lines 1585-1634

Every physical run rejects zero and checked-converts length. Strict overflow returns InvalidInput. Clamping overflow fills the remaining logical values and stops, ignoring subsequent entries. Final underflow errors. If exact coverage was already reached, a following zero still errors; a following positive entry triggers a zero-length clamp and stops. Trace logs count/type; initialized values are reinterpreted without unsafe set_len. (rust/lance-encoding/src/encodings/physical/rle.rs:1585-1634)

### Lines 1635-1670

Mini decoding uses clamp=true; decoded_size checked-multiplies count by bits and divides upward by eight without width validation. Block decoding requires a payload, parses the frame and uses clamp=false. The inherited requires_payload is true. infer_num_values accepts only raw identity value16/lengthU8; other configurations return None before frame validation. The accepted signature sums raw lengths without expansion. A comment attributes this to Pylance 6.0.1 compatibility. (rust/lance-encoding/src/encodings/physical/rle.rs:1635-1670)

### Lines 1671-1710

Private frame parsing requires at least eight bytes, reads u64 little-endian values_size, checked-converts it to usize, checked-adds the header and checks the result against total bytes. Returned slices are the value section and all remaining length bytes. Alignment, count, width and sums are checked elsewhere. Overflow wording depends on whether conversion or addition fails. (rust/lance-encoding/src/encodings/physical/rle.rs:1671-1710)

### Lines 1711-1737

Private Clone/Debug RleRunLengths holds ScalarBuffer<u8/u16/u32>. try_new checks byte divisibility and borrows the corresponding type. Unaligned storage may be copied; aligned storage can be shared. Empty input is allowed. This constructor does not validate positive lengths or logical coverage. (rust/lance-encoding/src/encodings/physical/rle.rs:1711-1737)

### Lines 1738-1778

Length access dispatches typed arrays; get directly indexes and casts to usize. owned_size counts visible scalar bytes. into_owned copies visible lengths to fresh storage. deep_size measures underlying buffer capacity. These measurements do not deduplicate shared allocations. (rust/lance-encoding/src/encodings/physical/rle.rs:1738-1778)

### Lines 1779-1829

Crate-internal Clone/Debug RleRuns retains u16 values, original-width lengths, logical usize count and coalesced run count. Private try_new checked-converts count, checks u16 byte divisibility, parses lengths, requires equal physical counts and rejects empty runs for nonzero expected count. It preserves physical entries without expansion or merging. (rust/lance-encoding/src/encodings/physical/rle.rs:1779-1829)

### Lines 1830-1877

RleRuns scans every entry, rejects zero, checked-adds coverage in usize and immediately rejects coverage beyond expected count. It counts adjacent value transitions, then requires exact final coverage. Declared zero does not bypass validation. Coalesced count groups adjacent equal values conceptually without changing buffers. (rust/lance-encoding/src/encodings/physical/rle.rs:1830-1877)

### Lines 1878-1920

Crate-internal accessors return logical count, physical count, coalesced count and visible payload size. into_owned copies both visible arrays while retaining counts. deep_size sums backing capacities without Arc deduplication. Value/length access indexes directly and can panic out of bounds. iter is ExactSizeIterator over physical entries. (rust/lance-encoding/src/encodings/physical/rle.rs:1878-1920)

### Lines 1921-1944

decode_u16_runs rejects non-16-bit values before parsing the frame, decoding children and strictly validating RleRuns. It accepts all run widths/children allowed by the supplied decoder. Primitive structural levels subsequently choose physical, coalesced or dense retention. That caller file is only partially reviewed and remains pending. (rust/lance-encoding/src/encodings/logical/primitive.rs:1302-1380; rust/lance-encoding/src/encodings/logical/primitive.rs:1796-1800) (rust/lance-encoding/src/encodings/physical/rle.rs:1921-1944)

### Lines 1945-1977

The private cfg(test) module imports shared strategies, Int32Array, rstest and general compression configuration. compress_miniblock supplies context(0,true,true). expand_u16_runs reserves logical count and repeats each physical run. These helpers do not perform IO or assert timing. (rust/lance-encoding/src/encodings/physical/rle.rs:1945-1977)

### Lines 1978-2022

The lazy/eager u16 test uses 1000 ones, 500 zeros and 300 twos. Raw U8 lengths split 1800 values into eight physical runs. Assertions check exact eager bytes, logical count, eight physical runs, three coalesced runs and complete lazy expansion. Ownership/capacity behavior is not tested. (rust/lance-encoding/src/encodings/physical/rle.rs:1978-2022)

### Lines 2023-2039

The empty lazy test accepts an eight-byte zero header and expected count zero, with all run counts zero. A zero-byte frame errors even for count zero. This tests frame validity before empty handling, unlike the mini shortcut. (rust/lance-encoding/src/encodings/physical/rle.rs:2023-2039)

### Lines 2040-2079

Legacy inference constructs raw value16/lengthU8 data for 65543 logical values and asserts Some(count). A newer U32-length fixture with u32::MAX yields None from inference and strict overflow for expected 65535. Tests do not measure allocation or cover every rejected inference signature. (rust/lance-encoding/src/encodings/physical/rle.rs:2040-2079)

### Lines 2080-2101

Four named rstest cases use value7 and one U8 length: zero/expected1, one/expected2, two/expected1, one/expected0. They assert InvalidInput and messages for zero, underflow and overflow, including strict validation of expected zero. (rust/lance-encoding/src/encodings/physical/rle.rs:2080-2101)

### Lines 2102-2146

The general-feature lazy test encodes 4096 u16 values as 1024 runs of four, cycling 0..7. It manually compresses only the values child and rewrites the frame header, then constructs General(Flat16)+Flat8 through the shared factory. Strict lazy decoding and complete expansion must match. This tests reader composition rather than child compression by the block writer. (rust/lance-encoding/src/encodings/physical/rle.rs:2102-2146)

### Lines 2147-2198

A constant 5000-value input has ceil(5000/255) physical runs and one coalesced run. A separate 200-value alternating input has 200 coalesced runs. Both assert exact expansion. A section comment introduces core tests. (rust/lance-encoding/src/encodings/physical/rle.rs:2147-2198)

### Lines 2199-2234

The basic nine-i32 mini test checks logical count, one chunk and child sizes 12/3 bytes, without exact contents. Runs of 1000 times42 and 300 times100 require six U8 length entries. These assertions assume the default cap is sufficiently large. (rust/lance-encoding/src/encodings/physical/rle.rs:2199-2234)

### Lines 2235-2274

The U16 mini test checks one i32 value entry, two length bytes equal to 1000 in little-endian order, and a Flat16 length descriptor. Direct decoding of the global buffers must produce all 1000 expected i32 values. U32 mini and selected chunks are not exercised here. (rust/lance-encoding/src/encodings/physical/rle.rs:2235-2274)

### Lines 2275-2345

Two general-feature tests compress either values or lengths for 1024 runs of four cycling 0..7. They assert the General/Flat descriptor arrangement and exact full output through the default mini reader. Global buffers are decoded without slicing; the default 4096 cap permits one chunk. A smaller environment cap can change these fixture assumptions. (rust/lance-encoding/src/encodings/physical/rle.rs:2275-2345)

### Lines 2346-2386

A bitpacking-gated reader test manually packs U8 lengths with OutOfLine(3,8), retains Flat32 values and builds the RLE descriptor. The default mini reader must reproduce all 4096 i32 values. Encoder candidate selection is not under test. (rust/lance-encoding/src/encodings/physical/rle.rs:2346-2386)

### Lines 2387-2437

A bitpacking-gated descriptor with two count-dependent children must fail factory construction. test_general_compression is a private helper, not a test; it prefers compiled zstd level3, otherwise LZ4 without a level. repeating_runs cycles 0..7, expect_rle unwraps the RLE arm, and assert_decoded_i32_eq checks FixedWidth plus full typed equality. (rust/lance-encoding/src/encodings/physical/rle.rs:2387-2437)

### Lines 2438-2474

A general-feature fixture of 8192 runs of four enables both child configurations. It asserts multiple chunks and General on both children, then slices/decompresses every chunk and checks complete values. Both children are count-independent, so this pair is permitted. (rust/lance-encoding/src/encodings/physical/rle.rs:2438-2474)

### Lines 2475-2534

Two bitpacking-gated fixtures of 2048 runs of four test pair selection. Monotonic values select packed values/raw lengths; deterministic high-entropy values select raw values/packed lengths. Both decode sliced chunks and assert complete values. Exact payload cost is not asserted. (rust/lance-encoding/src/encodings/physical/rle.rs:2475-2534)

### Lines 2535-2572

decompress_i32_chunks builds the default reader, tracks two buffer offsets and processed values, derives chunk counts from metadata, slices children and appends decoded i32 values. It asserts total logical count but not final consumption of both buffers. This is a test helper. (rust/lance-encoding/src/encodings/physical/rle.rs:2535-2572)

### Lines 2573-2604

Bitpacking fixtures use monotonic run IDs or an LCG seeded7 with wrapping multiplier6364136223846793005 and increment1442695040888963407; the upper32 bits become i32. A width-choice test accumulates run300 with the configured cap and expects U16 at value width32; caps below300 can change that assumption. No tie or invalid-entry-count test appears here. (rust/lance-encoding/src/encodings/physical/rle.rs:2573-2604)

### Lines 2605-2657

The all-types test invokes a generic helper for u8, u16, i32 including negatives, and u64. The helper copies native bytes, compresses/decompresses raw U8 RLE and checks only decoded byte length. Despite its name and PartialEq bound, it does not assert value equality. No float bit-pattern test is included. (rust/lance-encoding/src/encodings/physical/rle.rs:2605-2657)

### Lines 2658-2687

Power-of-two tests use 1000/2500/5000/10000 i32 values in runs of50. Every nonfinal log must be positive and represent a power-of-two count within the cap; final log must be zero. They do not check total counts, exact chunk counts, byte budget or roundtrip. (rust/lance-encoding/src/encodings/physical/rle.rs:2658-2687)

### Lines 2688-2740

Three rstest width cases U8/U16/U32 encode 4098 u16 values repeating1,0,0. Every chunk checks length alignment, paired entry count, summed run lengths versus declared chunk count, and total byte/logical consumption. The comment mentions a 2048 boundary, but the actual cap and byte budget determine splits. (rust/lance-encoding/src/encodings/physical/rle.rs:2688-2740)

### Lines 2741-2786

Encoding empty bytes with declared one u16 must return Internal with remaining-count context. A positive-count decoder given one buffer must report the two-buffer requirement. One i32 value with two lengths must report inconsistent entries. The latter tests assert error text rather than the variant. (rust/lance-encoding/src/encodings/physical/rle.rs:2741-2786)

### Lines 2787-2801

The U16 length-alignment test supplies one i32 value and a one-byte length buffer. It asserts InvalidInput and the divisibility-by-two message. No corresponding U32 remainder or native-value misalignment case appears here. (rust/lance-encoding/src/encodings/physical/rle.rs:2787-2801)

### Lines 2802-2867

For one i32 value and U16 lengths, run4/expected5 errors on underflow, run6/expected5 clamps to exactly five ones in mini decoding, and run0 errors. A whole-block frame containing the same overflowing run must return InvalidInput. This establishes interface-dependent overflow behavior without a version gate. (rust/lance-encoding/src/encodings/physical/rle.rs:2802-2867)

### Lines 2868-2899

The synthetic legacy checkpoint regression has i32 values7/8, U16 lengths2000/80 and expected2048. Mini decoding returns 2000 sevens and48 eights, ignoring the remaining32 repeats. It is a constructed regression input rather than a checked-in historical dataset. (rust/lance-encoding/src/encodings/physical/rle.rs:2868-2899)

### Lines 2900-2930

Empty mini encoding emits no buffers; decoding no buffers at count zero returns empty FixedWidth. Tests do not combine zero count with surplus input, unsupported width or invalid child descriptors, nor test the empty block writer frame. (rust/lance-encoding/src/encodings/physical/rle.rs:2900-2930)

### Lines 2931-2997

A 5000-i32 fixture contains 2000 times999, the sequence0..999 and2000 times777. It asserts two global buffers, manually slices chunks using sizes/logs, decodes each and checks full values. The Integration heading does not imply file IO or the production writer. (rust/lance-encoding/src/encodings/physical/rle.rs:2931-2997)

### Lines 2998-3054

Seven explicit 1024-value patterns cover paired runs, constant42, alternating values, four runs of255 plus4, unique values, and two variants with a repeated final value. Fixtures are deterministic. Every input must have length1024. (rust/lance-encoding/src/encodings/physical/rle.rs:2998-3054)

### Lines 3055-3097

Each boundary fixture compresses raw mini data and supplies whole global buffers to the reader, asserting1024 values,4096 bytes and exact contents. The error path distinguishes a4092-byte diagnostic. Default cap/budget permits one chunk for these fixtures; an environment override can change chunking. (rust/lance-encoding/src/encodings/physical/rle.rs:3055-3097)

### Lines 3098-3135

The large low-repetition regression allocates1048576 i32 values and copied little-endian bytes. Starting at12345, an LCG with multiplier1664525 and increment1013904223 increments the value when bit16 is set. It compresses raw mini data and starts a diagnostic loop over five chunks. The nominal50% repeat rate is a deterministic criterion, not a selection-policy threshold. (rust/lance-encoding/src/encodings/physical/rle.rs:3098-3135)

### Lines 3136-3175

The diagnostic loop computes unused chunk counts and prints nothing. The reader receives concatenated raw global buffers and total logical count rather than separate chunks. Only decoded byte count4*N is asserted, so it does not prove value equality or individual chunk correctness. No execution or timing is claimed. (rust/lance-encoding/src/encodings/physical/rle.rs:3136-3175)

### Lines 3176-3224

The async test_log/Tokio harness requests RLE across structural encodings with explicit ratio0.8 and BSS disabled. A custom generator repeats i32::MIN, MIN+1 and MIN+2 four times each and requests10000 rows. High-bit values prevent bitpacking savings. The harness is awaited. (rust/lance-encoding/src/encodings/physical/rle.rs:3176-3224)

### Lines 3225-3260

The automatic fixture has8000 i32::MIN values followed by a five-value sequence repeated400 times, with BSS disabled. The comment describes a default50% cutoff, while actual shared policy compares costs unless an explicit ratio is supplied. A feature-gated third case encodes2048 runs of four cycling i32::MIN+(run%8), with explicit ratio0.8, BSS disabled and zstd/LZ4 preference. (rust/lance-encoding/src/compression.rs:174-218) (rust/lance-encoding/src/encodings/physical/rle.rs:3225-3260)

### Lines 3261-3303

Private Debug RleDataGenerator stores pattern and cursor. Its unchecked constructor permits an empty pattern. ArrayGenerator::generate ignores requested RowCount and RNG, always emits10000 values cyclically, and advances the cursor; an empty pattern panics. The type is Int32 with element size Some(4). (rust/lance-encoding/src/encodings/physical/rle.rs:3261-3303)

### Lines 3304-3336

Block framing tests reject a u64::MAX values-size header and a three-byte payload. The first expects the checked-addition overflow message on64-bit targets; narrower usize conversion could fail earlier with different wording. Tests check error presence/text rather than the variant. Missing payload is not tested locally. (rust/lance-encoding/src/encodings/physical/rle.rs:3304-3336)

### Lines 3337-3360

For three i32 ones, the block-header test checks the eight-byte header, values_size4 in little-endian order and total13 bytes. It does not compare all payload bytes or the nested descriptor. (rust/lance-encoding/src/encodings/physical/rle.rs:3337-3360)

### Lines 3361-3382

The raw U8 whole-block nine-value test roundtrips and asserts the complete i32 slice via bytemuck. It does not exercise child configuration, empty input or invalid width. (rust/lance-encoding/src/encodings/physical/rle.rs:3361-3382)

### Lines 3383-3414

The10000-value block test contains3000 times999,3000 times777 and4000 times555, then asserts exact count and values. Its2048-chunk comments are stale: whole-block RLE only splits runs at the chosen length maximum. The file has38 test functions, including two rstest matrices of four and three cases and one async multi-scenario harness. None ran. Gaps include surplus mini input, zero-count malformed data, custom-child contracts, candidate errors, postcompression chunk budget, width ties and ownership metrics. (rust/lance-encoding/src/encodings/physical/rle.rs:3383-3414)

## Interaction and interpretation limits

All3414 source lines read in bounded untruncated outputs in ANALYZE78. No repository build/test/lint/benchmark/generator/install or network. Edge cases and performance costs are source deductions, not runtime reproduction. Partial primitive caller remains pending.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! # RLE (Run-Length Encoding)
    5 | //!
    6 | //! RLE compression for Lance, optimized for data with repeated values.
    7 | //!
    8 | //! ## Encoding Format
    9 | //!
   10 | //! RLE uses a dual-buffer format to store compressed data:
   11 | //!
   12 | //! - **Values Buffer**: Stores unique values in their original data type
   13 | //! - **Lengths Buffer**: Stores the repeat count for each value as u8, u16, or u32
   14 | //!
   15 | //! ### Example
   16 | //!
   17 | //! Input data: `[1, 1, 1, 2, 2, 3, 3, 3, 3]`
   18 | //!
   19 | //! Encoded as:
   20 | //! - Values buffer: `[1, 2, 3]` (3 × 4 bytes for i32)
   21 | //! - Lengths buffer: `[3, 2, 4]` (3 × 1 byte for u8 in compatibility mode)
   22 | //!
   23 | //! ### Long Run Handling
   24 | //!
   25 | //! In compatibility mode, when a run exceeds 255 values, it is split into multiple
   26 | //! runs of 255 followed by a final run with the remainder. RLE v2 can use u16 or
   27 | //! u32 run lengths to reduce this splitting.
   28 | //!
   29 | //! ## Supported Types
   30 | //!
   31 | //! RLE supports all fixed-width primitive types:
   32 | //! - 8-bit: u8, i8
   33 | //! - 16-bit: u16, i16
   34 | //! - 32-bit: u32, i32, f32
   35 | //! - 64-bit: u64, i64, f64
   36 | //!
   37 | //! ## Compression Strategy
   38 | //!
   39 | //! RLE is automatically selected when:
   40 | //! - The run count (number of value transitions) < 50% of total values
   41 | //! - This indicates sufficient repetition for RLE to be effective
   42 | //!
   43 | //! ## MiniBlock Chunk Handling
   44 | //!
   45 | //! When used in the miniblock path, all chunks share two global buffers (values and lengths).
   46 | //! Each chunk's `buffer_sizes` identifies its slice within those global buffers. Non-last chunks
   47 | //! contain a power-of-2 number of values.
   48 | //!
   49 | //! NOTE: The current encoder uses a 2048-value cap per chunk as a workaround for
   50 | //! <https://github.com/lancedb/lance/issues/4429>.
   51 | //!
   52 | //! ## Block Format
   53 | //!
   54 | //! When used in the block compression path, the encoded output is a single buffer:
   55 | //! `[8-byte header: values buffer size][values buffer][run_lengths buffer]`.
   56 | 
   57 | use arrow_buffer::{ArrowNativeType, ScalarBuffer};
   58 | use log::trace;
   59 | 
   60 | use crate::buffer::LanceBuffer;
   61 | use crate::compression::{
   62 |     BlockCompressor, BlockDecompressor, MiniBlockDecompressor, require_block_payload,
   63 | };
   64 | use crate::data::DataBlock;
   65 | use crate::data::{BlockInfo, FixedWidthDataBlock};
   66 | use crate::encodings::logical::primitive::miniblock::{
   67 |     MAX_MINIBLOCK_BYTES, MAX_MINIBLOCK_VALUES, MiniBlockChunk, MiniBlockCompressed,
   68 |     MiniBlockCompressionContext, MiniBlockCompressor,
   69 | };
   70 | use crate::encodings::physical::block::{CompressionConfig, GeneralBufferCompressor};
   71 | use crate::format::ProtobufUtils21;
   72 | use crate::format::pb21::CompressiveEncoding;
   73 | 
   74 | use lance_core::{Error, Result};
   75 | 
   76 | /// Width used to encode RLE run lengths.
   77 | #[derive(Debug, Clone, Copy, PartialEq, Eq)]
   78 | pub(crate) enum RunLengthWidth {
   79 |     /// Compatibility mode. Runs longer than 255 values are split.
   80 |     U8,
   81 |     /// RLE v2 mode for runs up to 65,535 values per entry.
   82 |     U16,
   83 |     /// RLE v2 mode for runs up to 4,294,967,295 values per entry.
   84 |     U32,
   85 | }
   86 | 
   87 | impl RunLengthWidth {
   88 |     pub(crate) fn from_bits(bits_per_value: u64) -> Option<Self> {
   89 |         match bits_per_value {
   90 |             8 => Some(Self::U8),
   91 |             16 => Some(Self::U16),
   92 |             32 => Some(Self::U32),
   93 |             _ => None,
   94 |         }
   95 |     }
   96 | 
   97 |     pub(crate) fn bits_per_value(self) -> u64 {
   98 |         match self {
   99 |             Self::U8 => 8,
  100 |             Self::U16 => 16,
  101 |             Self::U32 => 32,
  102 |         }
  103 |     }
  104 | 
  105 |     fn bytes_per_value(self) -> usize {
  106 |         match self {
  107 |             Self::U8 => 1,
  108 |             Self::U16 => 2,
  109 |             Self::U32 => 4,
  110 |         }
  111 |     }
  112 | 
  113 |     fn max_run_length(self) -> u64 {
  114 |         match self {
  115 |             Self::U8 => u8::MAX as u64,
  116 |             Self::U16 => u16::MAX as u64,
  117 |             Self::U32 => u32::MAX as u64,
  118 |         }
  119 |     }
  120 | 
  121 |     fn write_length(self, length: u64, dst: &mut Vec<u8>) {
  122 |         match self {
  123 |             Self::U8 => dst.push(length as u8),
  124 |             Self::U16 => dst.extend_from_slice(&(length as u16).to_le_bytes()),
  125 |             Self::U32 => dst.extend_from_slice(&(length as u32).to_le_bytes()),
  126 |         }
  127 |     }
  128 | 
  129 |     fn read_length(self, bytes: &[u8]) -> u64 {
  130 |         match self {
  131 |             Self::U8 => bytes[0] as u64,
  132 |             Self::U16 => u16::from_le_bytes([bytes[0], bytes[1]]) as u64,
  133 |             Self::U32 => u32::from_le_bytes([bytes[0], bytes[1], bytes[2], bytes[3]]) as u64,
  134 |         }
  135 |     }
  136 | }
  137 | 
  138 | const RUN_LENGTH_WIDTHS: [RunLengthWidth; 3] =
  139 |     [RunLengthWidth::U8, RunLengthWidth::U16, RunLengthWidth::U32];
  140 | 
  141 | /// Select the lowest-cost run length width from precomputed entry counts.
  142 | pub(crate) fn select_run_length_width_from_entries(
  143 |     entries: &[u64],
  144 |     bits_per_value: u64,
  145 | ) -> Result<(RunLengthWidth, u128)> {
  146 |     if entries.len() != RUN_LENGTH_WIDTHS.len() {
  147 |         return Err(Error::invalid_input_source(
  148 |             format!(
  149 |                 "RLE run length entry statistics must have {} values, got {}",
  150 |                 RUN_LENGTH_WIDTHS.len(),
  151 |                 entries.len()
  152 |             )
  153 |             .into(),
  154 |         ));
  155 |     }
  156 | 
  157 |     if !matches!(bits_per_value, 8 | 16 | 32 | 64) {
  158 |         return Err(Error::invalid_input_source(
  159 |             format!("RLE encoding bits_per_value must be 8, 16, 32, or 64, got {bits_per_value}")
  160 |                 .into(),
  161 |         ));
  162 |     }
  163 | 
  164 |     let mut best_width = RUN_LENGTH_WIDTHS[0];
  165 |     let mut best_cost = rle_encoded_size_from_entries(entries[0], bits_per_value, best_width);
  166 |     for (&width, &entry_count) in RUN_LENGTH_WIDTHS.iter().zip(entries.iter()).skip(1) {
  167 |         let cost = rle_encoded_size_from_entries(entry_count, bits_per_value, width);
  168 |         if cost < best_cost {
  169 |             best_width = width;
  170 |             best_cost = cost;
  171 |         }
  172 |     }
  173 | 
  174 |     Ok((best_width, best_cost))
  175 | }
  176 | 
  177 | pub(crate) fn rle_encoded_size_from_entries(
  178 |     entry_count: u64,
  179 |     bits_per_value: u64,
  180 |     run_length_width: RunLengthWidth,
  181 | ) -> u128 {
  182 |     let bytes_per_value = (bits_per_value / 8) as u128;
  183 |     let bytes_per_length = run_length_width.bytes_per_value() as u128;
  184 |     (entry_count as u128) * (bytes_per_value + bytes_per_length)
  185 | }
  186 | 
  187 | pub(crate) fn run_length_width_index(run_length_width: RunLengthWidth) -> usize {
  188 |     match run_length_width {
  189 |         RunLengthWidth::U8 => 0,
  190 |         RunLengthWidth::U16 => 1,
  191 |         RunLengthWidth::U32 => 2,
  192 |     }
  193 | }
  194 | 
  195 | pub(crate) fn select_run_length_width(
  196 |     data: &LanceBuffer,
  197 |     num_values: u64,
  198 |     bits_per_value: u64,
  199 |     max_segment_values: Option<u64>,
  200 | ) -> Result<(RunLengthWidth, u128)> {
  201 |     let entries = collect_run_length_entries(data, num_values, bits_per_value, max_segment_values)?;
  202 |     select_run_length_width_from_entries(&entries, bits_per_value)
  203 | }
  204 | 
  205 | pub(crate) fn rle_encoded_size(
  206 |     data: &LanceBuffer,
  207 |     num_values: u64,
  208 |     bits_per_value: u64,
  209 |     max_segment_values: Option<u64>,
  210 |     run_length_width: RunLengthWidth,
  211 | ) -> Result<u128> {
  212 |     let entries = collect_run_length_entries(data, num_values, bits_per_value, max_segment_values)?;
  213 |     let width_idx = run_length_width_index(run_length_width);
  214 |     Ok(rle_encoded_size_from_entries(
  215 |         entries[width_idx],
  216 |         bits_per_value,
  217 |         run_length_width,
  218 |     ))
  219 | }
  220 | 
  221 | fn collect_run_length_entries(
  222 |     data: &LanceBuffer,
  223 |     num_values: u64,
  224 |     bits_per_value: u64,
  225 |     max_segment_values: Option<u64>,
  226 | ) -> Result<[u64; 3]> {
  227 |     let num_values = usize::try_from(num_values).map_err(|_| {
  228 |         Error::invalid_input_source(
  229 |             format!("RLE num_values does not fit in usize: {num_values}").into(),
  230 |         )
  231 |     })?;
  232 | 
  233 |     macro_rules! collect_entries {
  234 |         ($ty:ty) => {{
  235 |             let type_size = std::mem::size_of::<$ty>();
  236 |             let expected_bytes = num_values.checked_mul(type_size).ok_or_else(|| {
  237 |                 Error::invalid_input_source(
  238 |                     format!(
  239 |                         "RLE input byte length overflow: {num_values} values of {type_size} bytes"
  240 |                     )
  241 |                     .into(),
  242 |                 )
  243 |             })?;
  244 |             if data.len() != expected_bytes {
  245 |                 return Err(Error::invalid_input_source(
  246 |                     format!(
  247 |                         "RLE input data size mismatch: {} bytes for {} values of {} bytes",
  248 |                         data.len(),
  249 |                         num_values,
  250 |                         type_size
  251 |                     )
  252 |                     .into(),
  253 |                 ));
  254 |             }
  255 |             let values = data.borrow_to_typed_slice::<$ty>();
  256 |             let values = values.get(..num_values).ok_or_else(|| {
  257 |                 Error::invalid_input_source(
  258 |                     format!(
  259 |                         "RLE data has {} values but {} were expected",
  260 |                         values.len(),
  261 |                         num_values
  262 |                     )
  263 |                     .into(),
  264 |                 )
  265 |             })?;
  266 |             Ok(collect_run_length_entries_from_slice(
  267 |                 values,
  268 |                 max_segment_values,
  269 |             ))
  270 |         }};
  271 |     }
  272 | 
  273 |     match bits_per_value {
  274 |         8 => collect_entries!(u8),
  275 |         16 => collect_entries!(u16),
  276 |         32 => collect_entries!(u32),
  277 |         64 => collect_entries!(u64),
  278 |         _ => Err(Error::invalid_input_source(
  279 |             format!("RLE encoding bits_per_value must be 8, 16, 32, or 64, got {bits_per_value}")
  280 |                 .into(),
  281 |         )),
  282 |     }
  283 | }
  284 | 
  285 | fn collect_run_length_entries_from_slice<T: PartialEq + Copy>(
  286 |     values: &[T],
  287 |     max_segment_values: Option<u64>,
  288 | ) -> [u64; 3] {
  289 |     if values.is_empty() {
  290 |         return [0; 3];
  291 |     }
  292 | 
  293 |     let mut entries = [0u64; 3];
  294 |     let mut prev = values[0];
  295 |     let mut current_length = 1u64;
  296 | 
  297 |     for &value in &values[1..] {
  298 |         if value != prev {
  299 |             accumulate_run_length_entries(current_length, max_segment_values, &mut entries);
  300 |             prev = value;
  301 |             current_length = 1;
  302 |         } else {
  303 |             current_length += 1;
  304 |         }
  305 |     }
  306 |     accumulate_run_length_entries(current_length, max_segment_values, &mut entries);
  307 | 
  308 |     entries
  309 | }
  310 | 
  311 | pub(crate) fn accumulate_run_length_entries(
  312 |     run_length: u64,
  313 |     max_segment_values: Option<u64>,
  314 |     entries: &mut [u64; 3],
  315 | ) {
  316 |     let max_segment_values = max_segment_values.unwrap_or(run_length).max(1);
  317 |     let mut remaining = run_length;
  318 |     while remaining > 0 {
  319 |         let segment = remaining.min(max_segment_values);
  320 |         for (idx, width) in RUN_LENGTH_WIDTHS.iter().enumerate() {
  321 |             let entry_count = segment.div_ceil(width.max_run_length());
  322 |             entries[idx] = entries[idx].saturating_add(entry_count);
  323 |         }
  324 |         remaining -= segment;
  325 |     }
  326 | }
  327 | 
  328 | /// RLE encoder for miniblock format
  329 | #[derive(Debug)]
  330 | pub struct RleEncoder {
  331 |     run_length_width: RunLengthWidth,
  332 |     values_compression: Option<CompressionConfig>,
  333 |     run_lengths_compression: Option<CompressionConfig>,
  334 |     use_child_bitpacking: bool,
  335 | }
  336 | 
  337 | #[derive(Clone)]
  338 | struct RleChildCandidate {
  339 |     encoding: CompressiveEncoding,
  340 |     data: LanceBuffer,
  341 |     chunk_sizes: Vec<u32>,
  342 |     size: usize,
  343 |     requires_num_values: bool,
  344 | }
  345 | 
  346 | impl Default for RleEncoder {
  347 |     fn default() -> Self {
  348 |         Self::new()
  349 |     }
  350 | }
  351 | 
  352 | impl RleEncoder {
  353 |     pub fn new() -> Self {
  354 |         Self {
  355 |             run_length_width: RunLengthWidth::U8,
  356 |             values_compression: None,
  357 |             run_lengths_compression: None,
  358 |             use_child_bitpacking: false,
  359 |         }
  360 |     }
  361 | 
  362 |     pub(crate) fn with_run_length_width(run_length_width: RunLengthWidth) -> Self {
  363 |         Self {
  364 |             run_length_width,
  365 |             values_compression: None,
  366 |             run_lengths_compression: None,
  367 |             use_child_bitpacking: false,
  368 |         }
  369 |     }
  370 | 
  371 |     pub(crate) fn with_child_encoding(
  372 |         run_length_width: RunLengthWidth,
  373 |         values_compression: Option<CompressionConfig>,
  374 |         run_lengths_compression: Option<CompressionConfig>,
  375 |         use_child_bitpacking: bool,
  376 |     ) -> Self {
  377 |         Self {
  378 |             run_length_width,
  379 |             values_compression,
  380 |             run_lengths_compression,
  381 |             use_child_bitpacking,
  382 |         }
  383 |     }
  384 | 
  385 |     fn encode_data(
  386 |         &self,
  387 |         data: &LanceBuffer,
  388 |         num_values: u64,
  389 |         bits_per_value: u64,
  390 |     ) -> Result<(Vec<LanceBuffer>, Vec<MiniBlockChunk>)> {
  391 |         if num_values == 0 {
  392 |             return Ok((Vec::new(), Vec::new()));
  393 |         }
  394 | 
  395 |         let num_values = usize::try_from(num_values).map_err(|_| {
  396 |             Error::invalid_input_source(
  397 |                 format!("RLE num_values does not fit in usize: {num_values}").into(),
  398 |             )
  399 |         })?;
  400 |         let bytes_per_value = (bits_per_value / 8) as usize;
  401 |         let bytes_per_length = self.run_length_width.bytes_per_value();
  402 | 
  403 |         // Pre-allocate global buffers with estimated capacity
  404 |         // Assume average compression ratio of ~10:1 (10 values per run)
  405 |         let estimated_runs = num_values / 10;
  406 |         let mut all_values = Vec::with_capacity(estimated_runs * bytes_per_value);
  407 |         let mut all_lengths = Vec::with_capacity(estimated_runs * bytes_per_length);
  408 |         let mut chunks = Vec::new();
  409 | 
  410 |         let mut offset = 0usize;
  411 |         let mut values_remaining = num_values;
  412 | 
  413 |         while values_remaining > 0 {
  414 |             let values_start = all_values.len();
  415 |             let lengths_start = all_lengths.len();
  416 | 
  417 |             let (_num_runs, values_processed, is_last_chunk) = match bits_per_value {
  418 |                 8 => self.encode_chunk_rolling::<u8>(
  419 |                     data,
  420 |                     offset,
  421 |                     values_remaining,
  422 |                     &mut all_values,
  423 |                     &mut all_lengths,
  424 |                 ),
  425 |                 16 => self.encode_chunk_rolling::<u16>(
  426 |                     data,
  427 |                     offset,
  428 |                     values_remaining,
  429 |                     &mut all_values,
  430 |                     &mut all_lengths,
  431 |                 ),
  432 |                 32 => self.encode_chunk_rolling::<u32>(
  433 |                     data,
  434 |                     offset,
  435 |                     values_remaining,
  436 |                     &mut all_values,
  437 |                     &mut all_lengths,
  438 |                 ),
  439 |                 64 => self.encode_chunk_rolling::<u64>(
  440 |                     data,
  441 |                     offset,
  442 |                     values_remaining,
  443 |                     &mut all_values,
  444 |                     &mut all_lengths,
  445 |                 ),
  446 |                 _ => {
  447 |                     return Err(Error::invalid_input_source(
  448 |                         format!(
  449 |                             "RLE encoding bits_per_value must be 8, 16, 32, or 64, got {bits_per_value}"
  450 |                         )
  451 |                         .into(),
  452 |                     ));
  453 |                 }
  454 |             };
  455 | 
  456 |             if values_processed == 0 {
  457 |                 // A non-final chunk needs at least two values because log_num_values == 0
  458 |                 // identifies the final chunk. Report an error instead of returning partial data.
  459 |                 return Err(Error::internal(format!(
  460 |                     "RLE encoder made no progress: values_remaining={values_remaining}, \
  461 |                      offset={offset}, data_len={}, bits_per_value={bits_per_value}, \
  462 |                      max_miniblock_values={}",
  463 |                     data.len(),
  464 |                     *MAX_MINIBLOCK_VALUES
  465 |                 )));
  466 |             }
  467 | 
  468 |             let log_num_values = if is_last_chunk {
  469 |                 0
  470 |             } else {
  471 |                 assert!(
  472 |                     values_processed.is_power_of_two(),
  473 |                     "Non-last chunk must have power-of-2 values"
  474 |                 );
  475 |                 values_processed.ilog2() as u8
  476 |             };
  477 | 
  478 |             let values_size = all_values.len() - values_start;
  479 |             let lengths_size = all_lengths.len() - lengths_start;
  480 | 
  481 |             let chunk = MiniBlockChunk {
  482 |                 buffer_sizes: vec![values_size as u32, lengths_size as u32],
  483 |                 log_num_values,
  484 |             };
  485 | 
  486 |             chunks.push(chunk);
  487 | 
  488 |             offset += values_processed;
  489 |             values_remaining -= values_processed;
  490 |         }
  491 | 
  492 |         // Return exactly two buffers: values and lengths
  493 |         Ok((
  494 |             vec![
  495 |                 LanceBuffer::from(all_values),
  496 |                 LanceBuffer::from(all_lengths),
  497 |             ],
  498 |             chunks,
  499 |         ))
  500 |     }
  501 | 
  502 |     fn encode_block_data(
  503 |         &self,
  504 |         data: &LanceBuffer,
  505 |         num_values: u64,
  506 |         bits_per_value: u64,
  507 |     ) -> Result<Vec<LanceBuffer>> {
  508 |         match bits_per_value {
  509 |             8 => self.encode_block_data_generic::<u8>(data, num_values),
  510 |             16 => self.encode_block_data_generic::<u16>(data, num_values),
  511 |             32 => self.encode_block_data_generic::<u32>(data, num_values),
  512 |             64 => self.encode_block_data_generic::<u64>(data, num_values),
  513 |             _ => Err(Error::invalid_input_source(
  514 |                 format!(
  515 |                     "RLE encoding bits_per_value must be 8, 16, 32, or 64, got {bits_per_value}"
  516 |                 )
  517 |                 .into(),
  518 |             )),
  519 |         }
  520 |     }
  521 | 
  522 |     fn encode_block_data_generic<T>(
  523 |         &self,
  524 |         data: &LanceBuffer,
  525 |         num_values: u64,
  526 |     ) -> Result<Vec<LanceBuffer>>
  527 |     where
  528 |         T: bytemuck::Pod + PartialEq + Copy + ArrowNativeType,
  529 |     {
  530 |         let num_values = usize::try_from(num_values).map_err(|_| {
  531 |             Error::invalid_input_source(
  532 |                 format!("RLE num_values does not fit in usize: {num_values}").into(),
  533 |             )
  534 |         })?;
  535 |         let type_size = std::mem::size_of::<T>();
  536 |         let expected_bytes = num_values.checked_mul(type_size).ok_or_else(|| {
  537 |             Error::invalid_input_source(
  538 |                 format!("RLE input byte length overflow: {num_values} values of {type_size} bytes")
  539 |                     .into(),
  540 |             )
  541 |         })?;
  542 |         if data.len() != expected_bytes {
  543 |             return Err(Error::invalid_input_source(
  544 |                 format!(
  545 |                     "RLE input data size mismatch: {} bytes for {} values of {} bytes",
  546 |                     data.len(),
  547 |                     num_values,
  548 |                     type_size
  549 |                 )
  550 |                 .into(),
  551 |             ));
  552 |         }
  553 |         if num_values == 0 {
  554 |             return Ok(vec![LanceBuffer::empty(), LanceBuffer::empty()]);
  555 |         }
  556 | 
  557 |         let values_ref = data.borrow_to_typed_slice::<T>();
  558 |         let values = values_ref.as_ref();
  559 |         let estimated_runs = num_values / 10;
  560 |         let mut all_values = Vec::with_capacity(estimated_runs * type_size);
  561 |         let mut all_lengths =
  562 |             Vec::with_capacity(estimated_runs * self.run_length_width.bytes_per_value());
  563 |         self.encode_values(values, &mut all_values, &mut all_lengths);
  564 |         Ok(vec![
  565 |             LanceBuffer::from(all_values),
  566 |             LanceBuffer::from(all_lengths),
  567 |         ])
  568 |     }
  569 | 
  570 |     /// Encodes the largest valid mini-block prefix from `offset`.
  571 |     fn encode_chunk_rolling<T>(
  572 |         &self,
  573 |         data: &LanceBuffer,
  574 |         offset: usize,
  575 |         values_remaining: usize,
  576 |         all_values: &mut Vec<u8>,
  577 |         all_lengths: &mut Vec<u8>,
  578 |     ) -> (usize, usize, bool)
  579 |     where
  580 |         T: bytemuck::Pod + PartialEq + Copy + std::fmt::Debug + ArrowNativeType,
  581 |     {
  582 |         let type_size = std::mem::size_of::<T>();
  583 |         let chunk_start = offset * type_size;
  584 |         let max_by_count = *MAX_MINIBLOCK_VALUES as usize;
  585 |         let max_values = values_remaining.min(max_by_count);
  586 |         let chunk_end = chunk_start + max_values * type_size;
  587 | 
  588 |         if chunk_start >= data.len() {
  589 |             return (0, 0, false);
  590 |         }
  591 | 
  592 |         let chunk_len = chunk_end.min(data.len()) - chunk_start;
  593 |         let chunk_buffer = data.slice_with_length(chunk_start, chunk_len);
  594 |         let typed_data_ref = chunk_buffer.borrow_to_typed_slice::<T>();
  595 |         let typed_data: &[T] = typed_data_ref.as_ref();
  596 |         let max_values = max_values.min(typed_data.len());
  597 | 
  598 |         if typed_data.is_empty() {
  599 |             return (0, 0, false);
  600 |         }
  601 | 
  602 |         let values_start = all_values.len();
  603 |         let all_remaining_values_fit = values_remaining <= max_by_count;
  604 |         let encoded_size = self.encoded_size(&typed_data[..max_values]);
  605 |         let (values_to_encode, is_last_chunk) = if all_remaining_values_fit
  606 |             && encoded_size <= MAX_MINIBLOCK_BYTES as usize
  607 |         {
  608 |             (max_values, true)
  609 |         } else if let Some(values_to_encode) = self.largest_power_of_two_prefix::<T>(typed_data) {
  610 |             (values_to_encode, false)
  611 |         } else {
  612 |             return (0, 0, false);
  613 |         };
  614 | 
  615 |         self.encode_values(&typed_data[..values_to_encode], all_values, all_lengths);
  616 | 
  617 |         let num_runs = (all_values.len() - values_start) / type_size;
  618 |         (num_runs, values_to_encode, is_last_chunk)
  619 |     }
  620 | 
  621 |     fn largest_power_of_two_prefix<T>(&self, values: &[T]) -> Option<usize>
  622 |     where
  623 |         T: bytemuck::Pod + PartialEq + Copy,
  624 |     {
  625 |         let max_prefix = values.len().min(*MAX_MINIBLOCK_VALUES as usize);
  626 |         let mut prefix = 1usize << max_prefix.ilog2();
  627 |         while prefix > 1 {
  628 |             if self.encoded_size(&values[..prefix]) <= MAX_MINIBLOCK_BYTES as usize {
  629 |                 return Some(prefix);
  630 |             }
  631 |             prefix >>= 1;
  632 |         }
  633 |         None
  634 |     }
  635 | 
  636 |     fn encoded_size<T>(&self, values: &[T]) -> usize
  637 |     where
  638 |         T: bytemuck::Pod + PartialEq + Copy,
  639 |     {
  640 |         if values.is_empty() {
  641 |             return 0;
  642 |         }
  643 | 
  644 |         let mut current_value = values[0];
  645 |         let mut current_length = 1u64;
  646 |         let mut encoded_size = 0usize;
  647 | 
  648 |         for &value in values.iter().skip(1) {
  649 |             if value == current_value {
  650 |                 current_length += 1;
  651 |             } else {
  652 |                 encoded_size += self.run_size::<T>(current_length);
  653 |                 current_value = value;
  654 |                 current_length = 1;
  655 |             }
  656 |         }
  657 |         encoded_size += self.run_size::<T>(current_length);
  658 |         encoded_size
  659 |     }
  660 | 
  661 |     fn run_size<T>(&self, length: u64) -> usize
  662 |     where
  663 |         T: bytemuck::Pod,
  664 |     {
  665 |         let type_size = std::mem::size_of::<T>();
  666 |         let run_chunks = length.div_ceil(self.run_length_width.max_run_length()) as usize;
  667 |         run_chunks * (type_size + self.run_length_width.bytes_per_value())
  668 |     }
  669 | 
  670 |     fn encode_values<T>(&self, values: &[T], all_values: &mut Vec<u8>, all_lengths: &mut Vec<u8>)
  671 |     where
  672 |         T: bytemuck::Pod + PartialEq + Copy,
  673 |     {
  674 |         if values.is_empty() {
  675 |             return;
  676 |         }
  677 | 
  678 |         let mut current_value = values[0];
  679 |         let mut current_length = 1u64;
  680 | 
  681 |         for &value in values.iter().skip(1) {
  682 |             if value == current_value {
  683 |                 current_length += 1;
  684 |             } else {
  685 |                 self.add_run(&current_value, current_length, all_values, all_lengths);
  686 |                 current_value = value;
  687 |                 current_length = 1;
  688 |             }
  689 |         }
  690 |         self.add_run(&current_value, current_length, all_values, all_lengths);
  691 |     }
  692 | 
  693 |     fn add_run<T>(
  694 |         &self,
  695 |         value: &T,
  696 |         length: u64,
  697 |         all_values: &mut Vec<u8>,
  698 |         all_lengths: &mut Vec<u8>,
  699 |     ) -> usize
  700 |     where
  701 |         T: bytemuck::Pod,
  702 |     {
  703 |         let value_bytes = bytemuck::bytes_of(value);
  704 |         let type_size = std::mem::size_of::<T>();
  705 |         let max_run_length = self.run_length_width.max_run_length();
  706 |         let num_full_chunks = (length / max_run_length) as usize;
  707 |         let remainder = length % max_run_length;
  708 | 
  709 |         let total_chunks = num_full_chunks + if remainder > 0 { 1 } else { 0 };
  710 |         all_values.reserve(total_chunks * type_size);
  711 |         all_lengths.reserve(total_chunks * self.run_length_width.bytes_per_value());
  712 | 
  713 |         for _ in 0..num_full_chunks {
  714 |             all_values.extend_from_slice(value_bytes);
  715 |             self.run_length_width
  716 |                 .write_length(max_run_length, all_lengths);
  717 |         }
  718 | 
  719 |         if remainder > 0 {
  720 |             all_values.extend_from_slice(value_bytes);
  721 |             self.run_length_width.write_length(remainder, all_lengths);
  722 |         }
  723 | 
  724 |         total_chunks * (type_size + self.run_length_width.bytes_per_value())
  725 |     }
  726 | 
  727 |     fn flat_child_candidate(
  728 |         buffers: &[LanceBuffer],
  729 |         chunks: &[MiniBlockChunk],
  730 |         buffer_index: usize,
  731 |         bits_per_value: u64,
  732 |     ) -> RleChildCandidate {
  733 |         RleChildCandidate {
  734 |             encoding: ProtobufUtils21::flat(bits_per_value, None),
  735 |             data: buffers[buffer_index].clone(),
  736 |             chunk_sizes: chunks
  737 |                 .iter()
  738 |                 .map(|chunk| chunk.buffer_sizes[buffer_index])
  739 |                 .collect(),
  740 |             size: buffers[buffer_index].len(),
  741 |             requires_num_values: false,
  742 |         }
  743 |     }
  744 | 
  745 |     fn general_child_candidate(
  746 |         buffers: &[LanceBuffer],
  747 |         chunks: &[MiniBlockChunk],
  748 |         buffer_index: usize,
  749 |         bits_per_value: u64,
  750 |         compression: CompressionConfig,
  751 |     ) -> Result<Option<RleChildCandidate>> {
  752 |         if buffers.is_empty() || buffers[buffer_index].is_empty() {
  753 |             return Ok(None);
  754 |         };
  755 | 
  756 |         let compressor = GeneralBufferCompressor::get_compressor(compression)?;
  757 |         let original = &buffers[buffer_index];
  758 |         let mut compressed = Vec::new();
  759 |         let mut offset = 0usize;
  760 |         let mut total_original_size = 0usize;
  761 |         let mut compressed_sizes = Vec::with_capacity(chunks.len());
  762 | 
  763 |         for chunk in chunks.iter() {
  764 |             let chunk_size = chunk.buffer_sizes[buffer_index] as usize;
  765 |             let end = offset.checked_add(chunk_size).ok_or_else(|| {
  766 |                 Error::invalid_input_source("RLE child buffer offset overflow".into())
  767 |             })?;
  768 |             if end > original.len() {
  769 |                 return Err(Error::invalid_input_source(
  770 |                     format!(
  771 |                         "RLE child buffer {} chunk size exceeds buffer length: end {}, len {}",
  772 |                         buffer_index,
  773 |                         end,
  774 |                         original.len()
  775 |                     )
  776 |                     .into(),
  777 |                 ));
  778 |             }
  779 | 
  780 |             let start = compressed.len();
  781 |             compressor.compress(&original.as_ref()[offset..end], &mut compressed)?;
  782 |             let compressed_size = compressed.len() - start;
  783 |             let compressed_size = u32::try_from(compressed_size).map_err(|_| {
  784 |                 Error::invalid_input_source(
  785 |                     format!(
  786 |                         "RLE child buffer {} compressed chunk is too large: {} bytes",
  787 |                         buffer_index, compressed_size
  788 |                     )
  789 |                     .into(),
  790 |                 )
  791 |             })?;
  792 |             compressed_sizes.push(compressed_size);
  793 |             total_original_size += chunk_size;
  794 |             offset = end;
  795 |         }
  796 | 
  797 |         if compressed.len() >= total_original_size {
  798 |             return Ok(None);
  799 |         }
  800 | 
  801 |         let encoding =
  802 |             ProtobufUtils21::wrapped(compression, ProtobufUtils21::flat(bits_per_value, None))?;
  803 |         Ok(Some(
  804 |             RleChildCandidate {
  805 |                 encoding,
  806 |                 data: LanceBuffer::from(compressed),
  807 |                 chunk_sizes: compressed_sizes,
  808 |                 size: 0,
  809 |                 requires_num_values: false,
  810 |             }
  811 |             .with_size_from_data(),
  812 |         ))
  813 |     }
  814 | 
  815 |     #[cfg(feature = "bitpacking")]
  816 |     fn bitpacked_child_candidate(
  817 |         buffers: &[LanceBuffer],
  818 |         chunks: &[MiniBlockChunk],
  819 |         buffer_index: usize,
  820 |         bits_per_value: u64,
  821 |     ) -> Result<Option<RleChildCandidate>> {
  822 |         let original = &buffers[buffer_index];
  823 |         if original.is_empty() {
  824 |             return Ok(None);
  825 |         }
  826 |         let packed_bits = Self::required_bits(original, bits_per_value)?;
  827 |         if packed_bits >= bits_per_value {
  828 |             return Ok(None);
  829 |         }
  830 | 
  831 |         let compressor = crate::encodings::physical::bitpacking::OutOfLineBitpacking::new(
  832 |             packed_bits,
  833 |             bits_per_value,
  834 |         );
  835 |         let mut packed = Vec::new();
  836 |         let mut offset = 0usize;
  837 |         let mut packed_sizes = Vec::with_capacity(chunks.len());
  838 |         let bytes_per_value = usize::try_from(bits_per_value / 8).map_err(|_| {
  839 |             Error::invalid_input_source(
  840 |                 format!("RLE child bit width is too large: {bits_per_value}").into(),
  841 |             )
  842 |         })?;
  843 | 
  844 |         for chunk in chunks {
  845 |             let chunk_size = chunk.buffer_sizes[buffer_index] as usize;
  846 |             let end = offset.checked_add(chunk_size).ok_or_else(|| {
  847 |                 Error::invalid_input_source("RLE child buffer offset overflow".into())
  848 |             })?;
  849 |             if end > original.len() {
  850 |                 return Err(Error::invalid_input_source(
  851 |                     format!(
  852 |                         "RLE child buffer {} chunk size exceeds buffer length: end {}, len {}",
  853 |                         buffer_index,
  854 |                         end,
  855 |                         original.len()
  856 |                     )
  857 |                     .into(),
  858 |                 ));
  859 |             }
  860 |             if bytes_per_value == 0 || !chunk_size.is_multiple_of(bytes_per_value) {
  861 |                 return Err(Error::invalid_input_source(
  862 |                     format!(
  863 |                         "RLE child buffer {} chunk has invalid size {} for {} bits per value",
  864 |                         buffer_index, chunk_size, bits_per_value
  865 |                     )
  866 |                     .into(),
  867 |                 ));
  868 |             }
  869 | 
  870 |             let child_values = (chunk_size / bytes_per_value) as u64;
  871 |             let block = DataBlock::FixedWidth(FixedWidthDataBlock {
  872 |                 bits_per_value,
  873 |                 data: original.slice_with_length(offset, chunk_size),
  874 |                 num_values: child_values,
  875 |                 block_info: BlockInfo::default(),
  876 |             });
  877 |             let (chunk_packed, _) = BlockCompressor::compress(&compressor, block)?;
  878 |             let chunk_packed = chunk_packed.ok_or_else(|| {
  879 |                 Error::internal("RLE bitpacking child returned no payload".to_string())
  880 |             })?;
  881 |             let packed_size = u32::try_from(chunk_packed.len()).map_err(|_| {
  882 |                 Error::invalid_input_source(
  883 |                     format!(
  884 |                         "RLE child buffer {} bitpacked chunk is too large: {} bytes",
  885 |                         buffer_index,
  886 |                         chunk_packed.len()
  887 |                     )
  888 |                     .into(),
  889 |                 )
  890 |             })?;
  891 |             packed_sizes.push(packed_size);
  892 |             packed.extend_from_slice(chunk_packed.as_ref());
  893 |             offset = end;
  894 |         }
  895 | 
  896 |         if packed.len() >= original.len() {
  897 |             return Ok(None);
  898 |         }
  899 | 
  900 |         Ok(Some(
  901 |             RleChildCandidate {
  902 |                 encoding: ProtobufUtils21::out_of_line_bitpacking(
  903 |                     bits_per_value,
  904 |                     ProtobufUtils21::flat(packed_bits, None),
  905 |                 ),
  906 |                 data: LanceBuffer::from(packed),
  907 |                 chunk_sizes: packed_sizes,
  908 |                 size: 0,
  909 |                 requires_num_values: true,
  910 |             }
  911 |             .with_size_from_data(),
  912 |         ))
  913 |     }
  914 | 
  915 |     #[cfg(feature = "bitpacking")]
  916 |     fn required_bits(buffer: &LanceBuffer, bits_per_value: u64) -> Result<u64> {
  917 |         let max_value = match bits_per_value {
  918 |             8 => buffer.as_ref().iter().map(|value| *value as u64).max(),
  919 |             16 => buffer
  920 |                 .as_ref()
  921 |                 .as_chunks::<2>()
  922 |                 .0
  923 |                 .iter()
  924 |                 .map(|value| u16::from_le_bytes(*value) as u64)
  925 |                 .max(),
  926 |             32 => buffer
  927 |                 .as_ref()
  928 |                 .as_chunks::<4>()
  929 |                 .0
  930 |                 .iter()
  931 |                 .map(|value| u32::from_le_bytes(*value) as u64)
  932 |                 .max(),
  933 |             64 => buffer
  934 |                 .as_ref()
  935 |                 .as_chunks::<8>()
  936 |                 .0
  937 |                 .iter()
  938 |                 .map(|value| u64::from_le_bytes(*value))
  939 |                 .max(),
  940 |             _ => {
  941 |                 return Err(Error::invalid_input_source(
  942 |                     format!(
  943 |                         "RLE child bitpacking only supports 8, 16, 32, or 64-bit values, got {bits_per_value}"
  944 |                     )
  945 |                     .into(),
  946 |                 ));
  947 |             }
  948 |         }
  949 |         .unwrap_or(0);
  950 |         Ok((u64::BITS - max_value.leading_zeros()).max(1) as u64)
  951 |     }
  952 | 
  953 |     fn child_candidates(
  954 |         buffers: &[LanceBuffer],
  955 |         chunks: &[MiniBlockChunk],
  956 |         buffer_index: usize,
  957 |         bits_per_value: u64,
  958 |         compression: Option<CompressionConfig>,
  959 |         use_child_bitpacking: bool,
  960 |     ) -> Result<Vec<RleChildCandidate>> {
  961 |         #[cfg(not(feature = "bitpacking"))]
  962 |         let _ = use_child_bitpacking;
  963 |         let mut candidates = vec![Self::flat_child_candidate(
  964 |             buffers,
  965 |             chunks,
  966 |             buffer_index,
  967 |             bits_per_value,
  968 |         )];
  969 |         if let Some(compression) = compression
  970 |             && let Some(candidate) = Self::general_child_candidate(
  971 |                 buffers,
  972 |                 chunks,
  973 |                 buffer_index,
  974 |                 bits_per_value,
  975 |                 compression,
  976 |             )?
  977 |         {
  978 |             candidates.push(candidate);
  979 |         }
  980 |         #[cfg(feature = "bitpacking")]
  981 |         {
  982 |             if use_child_bitpacking
  983 |                 && let Some(candidate) =
  984 |                     Self::bitpacked_child_candidate(buffers, chunks, buffer_index, bits_per_value)?
  985 |             {
  986 |                 candidates.push(candidate);
  987 |             }
  988 |         }
  989 |         Ok(candidates)
  990 |     }
  991 | 
  992 |     fn select_child_candidates(
  993 |         values: Vec<RleChildCandidate>,
  994 |         run_lengths: Vec<RleChildCandidate>,
  995 |     ) -> (RleChildCandidate, RleChildCandidate) {
  996 |         let mut best: Option<(usize, usize, usize)> = None;
  997 |         for (value_idx, value) in values.iter().enumerate() {
  998 |             for (length_idx, length) in run_lengths.iter().enumerate() {
  999 |                 if value.requires_num_values && length.requires_num_values {
 1000 |                     continue;
 1001 |                 }
 1002 |                 let size = value.size + length.size;
 1003 |                 if best.is_none_or(|(_, _, best_size)| size < best_size) {
 1004 |                     best = Some((value_idx, length_idx, size));
 1005 |                 }
 1006 |             }
 1007 |         }
 1008 |         let (value_idx, length_idx, _) =
 1009 |             best.expect("flat RLE child candidates should always be selectable");
 1010 |         (values[value_idx].clone(), run_lengths[length_idx].clone())
 1011 |     }
 1012 | 
 1013 |     pub(crate) fn selected_payload_size(&self, data: &FixedWidthDataBlock) -> Result<u128> {
 1014 |         let (all_buffers, chunks) =
 1015 |             self.encode_data(&data.data, data.num_values, data.bits_per_value)?;
 1016 |         if all_buffers.is_empty() {
 1017 |             return Ok(0);
 1018 |         }
 1019 | 
 1020 |         let values_candidates = Self::child_candidates(
 1021 |             &all_buffers,
 1022 |             &chunks,
 1023 |             0,
 1024 |             data.bits_per_value,
 1025 |             self.values_compression,
 1026 |             self.use_child_bitpacking,
 1027 |         )?;
 1028 |         let run_lengths_candidates = Self::child_candidates(
 1029 |             &all_buffers,
 1030 |             &chunks,
 1031 |             1,
 1032 |             self.run_length_width.bits_per_value(),
 1033 |             self.run_lengths_compression,
 1034 |             self.use_child_bitpacking,
 1035 |         )?;
 1036 |         let (values, run_lengths) =
 1037 |             Self::select_child_candidates(values_candidates, run_lengths_candidates);
 1038 |         Ok((values.size as u128).saturating_add(run_lengths.size as u128))
 1039 |     }
 1040 | }
 1041 | 
 1042 | impl RleChildCandidate {
 1043 |     fn with_size_from_data(mut self) -> Self {
 1044 |         self.size = self.data.len();
 1045 |         self
 1046 |     }
 1047 | }
 1048 | 
 1049 | impl MiniBlockCompressor for RleEncoder {
 1050 |     fn compress(
 1051 |         &self,
 1052 |         _context: MiniBlockCompressionContext,
 1053 |         data: DataBlock,
 1054 |     ) -> Result<(MiniBlockCompressed, CompressiveEncoding)> {
 1055 |         match data {
 1056 |             DataBlock::FixedWidth(fixed_width) => {
 1057 |                 let num_values = fixed_width.num_values;
 1058 |                 let bits_per_value = fixed_width.bits_per_value;
 1059 | 
 1060 |                 let (all_buffers, chunks) =
 1061 |                     self.encode_data(&fixed_width.data, num_values, bits_per_value)?;
 1062 |                 if all_buffers.is_empty() {
 1063 |                     let compressed = MiniBlockCompressed {
 1064 |                         data: all_buffers,
 1065 |                         chunks,
 1066 |                         num_values,
 1067 |                     };
 1068 |                     let encoding = ProtobufUtils21::rle(
 1069 |                         ProtobufUtils21::flat(bits_per_value, None),
 1070 |                         ProtobufUtils21::flat(self.run_length_width.bits_per_value(), None),
 1071 |                     );
 1072 |                     return Ok((compressed, encoding));
 1073 |                 }
 1074 | 
 1075 |                 let values_candidates = Self::child_candidates(
 1076 |                     &all_buffers,
 1077 |                     &chunks,
 1078 |                     0,
 1079 |                     bits_per_value,
 1080 |                     self.values_compression,
 1081 |                     self.use_child_bitpacking,
 1082 |                 )?;
 1083 |                 let run_lengths_candidates = Self::child_candidates(
 1084 |                     &all_buffers,
 1085 |                     &chunks,
 1086 |                     1,
 1087 |                     self.run_length_width.bits_per_value(),
 1088 |                     self.run_lengths_compression,
 1089 |                     self.use_child_bitpacking,
 1090 |                 )?;
 1091 |                 let (values, run_lengths) =
 1092 |                     Self::select_child_candidates(values_candidates, run_lengths_candidates);
 1093 |                 let chunks = chunks
 1094 |                     .into_iter()
 1095 |                     .enumerate()
 1096 |                     .map(|(idx, chunk)| MiniBlockChunk {
 1097 |                         buffer_sizes: vec![values.chunk_sizes[idx], run_lengths.chunk_sizes[idx]],
 1098 |                         log_num_values: chunk.log_num_values,
 1099 |                     })
 1100 |                     .collect();
 1101 | 
 1102 |                 let compressed = MiniBlockCompressed {
 1103 |                     data: vec![values.data, run_lengths.data],
 1104 |                     chunks,
 1105 |                     num_values,
 1106 |                 };
 1107 | 
 1108 |                 let encoding = ProtobufUtils21::rle(values.encoding, run_lengths.encoding);
 1109 | 
 1110 |                 Ok((compressed, encoding))
 1111 |             }
 1112 |             _ => Err(Error::invalid_input_source(
 1113 |                 "RLE encoding only supports FixedWidth data blocks".into(),
 1114 |             )),
 1115 |         }
 1116 |     }
 1117 | }
 1118 | 
 1119 | impl BlockCompressor for RleEncoder {
 1120 |     // Block format: [8-byte header: values buffer size][values buffer][run_lengths buffer]
 1121 |     fn compress(&self, data: DataBlock) -> Result<(Option<LanceBuffer>, CompressiveEncoding)> {
 1122 |         match data {
 1123 |             DataBlock::FixedWidth(fixed_width) => {
 1124 |                 let num_values = fixed_width.num_values;
 1125 |                 let bits_per_value = fixed_width.bits_per_value;
 1126 | 
 1127 |                 let all_buffers =
 1128 |                     self.encode_block_data(&fixed_width.data, num_values, bits_per_value)?;
 1129 | 
 1130 |                 let values_size = all_buffers[0].len() as u64;
 1131 | 
 1132 |                 let mut combined = Vec::new();
 1133 |                 combined.extend_from_slice(&values_size.to_le_bytes());
 1134 |                 combined.extend_from_slice(&all_buffers[0]);
 1135 |                 combined.extend_from_slice(&all_buffers[1]);
 1136 |                 Ok((
 1137 |                     Some(LanceBuffer::from(combined)),
 1138 |                     ProtobufUtils21::rle(
 1139 |                         ProtobufUtils21::flat(bits_per_value, None),
 1140 |                         ProtobufUtils21::flat(self.run_length_width.bits_per_value(), None),
 1141 |                     ),
 1142 |                 ))
 1143 |             }
 1144 |             _ => Err(Error::invalid_input_source(
 1145 |                 "RLE encoding only supports FixedWidth data blocks".into(),
 1146 |             )),
 1147 |         }
 1148 |     }
 1149 | }
 1150 | 
 1151 | /// RLE decompressor for miniblock format
 1152 | #[derive(Debug)]
 1153 | pub struct RleDecompressor {
 1154 |     bits_per_value: u64,
 1155 |     run_length_width: RunLengthWidth,
 1156 |     values: RleChildDecompressor,
 1157 |     run_lengths: RleChildDecompressor,
 1158 | }
 1159 | 
 1160 | #[derive(Debug)]
 1161 | pub(crate) struct RleChildDecompressor {
 1162 |     bits_per_value: u64,
 1163 |     inner: RleChildDecompressorInner,
 1164 | }
 1165 | 
 1166 | #[derive(Debug)]
 1167 | enum RleChildDecompressorInner {
 1168 |     Flat,
 1169 |     Block {
 1170 |         decompressor: Box<dyn BlockDecompressor>,
 1171 |         requires_num_values: bool,
 1172 |     },
 1173 | }
 1174 | 
 1175 | impl RleChildDecompressor {
 1176 |     pub(crate) fn flat(bits_per_value: u64) -> Self {
 1177 |         Self {
 1178 |             bits_per_value,
 1179 |             inner: RleChildDecompressorInner::Flat,
 1180 |         }
 1181 |     }
 1182 | 
 1183 |     pub(crate) fn block(
 1184 |         bits_per_value: u64,
 1185 |         decompressor: Box<dyn BlockDecompressor>,
 1186 |         requires_num_values: bool,
 1187 |     ) -> Self {
 1188 |         Self {
 1189 |             bits_per_value,
 1190 |             inner: RleChildDecompressorInner::Block {
 1191 |                 decompressor,
 1192 |                 requires_num_values,
 1193 |             },
 1194 |         }
 1195 |     }
 1196 | 
 1197 |     pub(crate) fn bits_per_value(&self) -> u64 {
 1198 |         self.bits_per_value
 1199 |     }
 1200 | 
 1201 |     pub(crate) fn requires_num_values(&self) -> bool {
 1202 |         match &self.inner {
 1203 |             RleChildDecompressorInner::Flat => false,
 1204 |             RleChildDecompressorInner::Block {
 1205 |                 requires_num_values,
 1206 |                 ..
 1207 |             } => *requires_num_values,
 1208 |         }
 1209 |     }
 1210 | 
 1211 |     pub(crate) fn is_identity(&self) -> bool {
 1212 |         matches!(self.inner, RleChildDecompressorInner::Flat)
 1213 |     }
 1214 | 
 1215 |     fn decode(
 1216 |         &self,
 1217 |         data: LanceBuffer,
 1218 |         num_values: Option<u64>,
 1219 |         label: &str,
 1220 |     ) -> Result<LanceBuffer> {
 1221 |         match &self.inner {
 1222 |             RleChildDecompressorInner::Flat => Ok(data),
 1223 |             RleChildDecompressorInner::Block {
 1224 |                 decompressor,
 1225 |                 requires_num_values,
 1226 |             } => {
 1227 |                 let num_values = if *requires_num_values {
 1228 |                     num_values.ok_or_else(|| {
 1229 |                         Error::invalid_input_source(
 1230 |                             format!("RLE {label} child compression requires the run count").into(),
 1231 |                         )
 1232 |                     })?
 1233 |                 } else {
 1234 |                     num_values.unwrap_or(0)
 1235 |                 };
 1236 |                 let decoded = decompressor.decompress(Some(data), num_values)?;
 1237 |                 self.extract_fixed_width(decoded, num_values, label)
 1238 |             }
 1239 |         }
 1240 |     }
 1241 | 
 1242 |     fn extract_fixed_width(
 1243 |         &self,
 1244 |         data: DataBlock,
 1245 |         expected_num_values: u64,
 1246 |         label: &str,
 1247 |     ) -> Result<LanceBuffer> {
 1248 |         match data {
 1249 |             DataBlock::FixedWidth(block) => {
 1250 |                 if block.bits_per_value != self.bits_per_value {
 1251 |                     return Err(Error::invalid_input_source(
 1252 |                         format!(
 1253 |                             "RLE {label} child decoded {}-bit values, expected {}",
 1254 |                             block.bits_per_value, self.bits_per_value
 1255 |                         )
 1256 |                         .into(),
 1257 |                     ));
 1258 |                 }
 1259 |                 if expected_num_values != 0 && block.num_values != expected_num_values {
 1260 |                     return Err(Error::invalid_input_source(
 1261 |                         format!(
 1262 |                             "RLE {label} child decoded {} values, expected {}",
 1263 |                             block.num_values, expected_num_values
 1264 |                         )
 1265 |                         .into(),
 1266 |                     ));
 1267 |                 }
 1268 |                 Ok(block.data)
 1269 |             }
 1270 |             _ => Err(Error::invalid_input_source(
 1271 |                 format!("RLE {label} child decoded to a non fixed-width block").into(),
 1272 |             )),
 1273 |         }
 1274 |     }
 1275 | }
 1276 | 
 1277 | impl RleDecompressor {
 1278 |     pub fn new(bits_per_value: u64) -> Self {
 1279 |         Self {
 1280 |             bits_per_value,
 1281 |             run_length_width: RunLengthWidth::U8,
 1282 |             values: RleChildDecompressor::flat(bits_per_value),
 1283 |             run_lengths: RleChildDecompressor::flat(RunLengthWidth::U8.bits_per_value()),
 1284 |         }
 1285 |     }
 1286 | 
 1287 |     pub(crate) fn with_run_length_width(
 1288 |         bits_per_value: u64,
 1289 |         run_length_width: RunLengthWidth,
 1290 |     ) -> Self {
 1291 |         Self {
 1292 |             bits_per_value,
 1293 |             run_length_width,
 1294 |             values: RleChildDecompressor::flat(bits_per_value),
 1295 |             run_lengths: RleChildDecompressor::flat(run_length_width.bits_per_value()),
 1296 |         }
 1297 |     }
 1298 | 
 1299 |     pub(crate) fn with_child_decompressors(
 1300 |         bits_per_value: u64,
 1301 |         run_length_width: RunLengthWidth,
 1302 |         values: RleChildDecompressor,
 1303 |         run_lengths: RleChildDecompressor,
 1304 |     ) -> Self {
 1305 |         Self {
 1306 |             bits_per_value,
 1307 |             run_length_width,
 1308 |             values,
 1309 |             run_lengths,
 1310 |         }
 1311 |     }
 1312 | 
 1313 |     fn decode_data(
 1314 |         &self,
 1315 |         data: Vec<LanceBuffer>,
 1316 |         num_values: u64,
 1317 |         clamp_overflow: bool,
 1318 |     ) -> Result<DataBlock> {
 1319 |         if num_values == 0 {
 1320 |             return Ok(DataBlock::FixedWidth(FixedWidthDataBlock {
 1321 |                 bits_per_value: self.bits_per_value,
 1322 |                 data: LanceBuffer::from(vec![]),
 1323 |                 num_values: 0,
 1324 |                 block_info: BlockInfo::default(),
 1325 |             }));
 1326 |         }
 1327 | 
 1328 |         if data.len() != 2 {
 1329 |             return Err(Error::invalid_input_source(
 1330 |                 format!(
 1331 |                     "RLE decompressor expects exactly 2 buffers, got {}",
 1332 |                     data.len()
 1333 |                 )
 1334 |                 .into(),
 1335 |             ));
 1336 |         }
 1337 | 
 1338 |         let mut data_iter = data.into_iter();
 1339 |         let values_buffer = data_iter.next().unwrap();
 1340 |         let lengths_buffer = data_iter.next().unwrap();
 1341 |         let (values_buffer, lengths_buffer) =
 1342 |             self.decode_child_buffers(values_buffer, lengths_buffer)?;
 1343 | 
 1344 |         self.decode_child_data(&values_buffer, &lengths_buffer, num_values, clamp_overflow)
 1345 |     }
 1346 | 
 1347 |     fn decode_child_data(
 1348 |         &self,
 1349 |         values_buffer: &LanceBuffer,
 1350 |         lengths_buffer: &LanceBuffer,
 1351 |         num_values: u64,
 1352 |         clamp_overflow: bool,
 1353 |     ) -> Result<DataBlock> {
 1354 |         let decoded_data = match self.bits_per_value {
 1355 |             8 => self.decode_generic::<u8>(
 1356 |                 values_buffer,
 1357 |                 lengths_buffer,
 1358 |                 num_values,
 1359 |                 clamp_overflow,
 1360 |             )?,
 1361 |             16 => self.decode_generic::<u16>(
 1362 |                 values_buffer,
 1363 |                 lengths_buffer,
 1364 |                 num_values,
 1365 |                 clamp_overflow,
 1366 |             )?,
 1367 |             32 => self.decode_generic::<u32>(
 1368 |                 values_buffer,
 1369 |                 lengths_buffer,
 1370 |                 num_values,
 1371 |                 clamp_overflow,
 1372 |             )?,
 1373 |             64 => self.decode_generic::<u64>(
 1374 |                 values_buffer,
 1375 |                 lengths_buffer,
 1376 |                 num_values,
 1377 |                 clamp_overflow,
 1378 |             )?,
 1379 |             _ => {
 1380 |                 return Err(Error::invalid_input_source(
 1381 |                     format!(
 1382 |                         "RLE decoding bits_per_value must be 8, 16, 32, or 64, got {}",
 1383 |                         self.bits_per_value
 1384 |                     )
 1385 |                     .into(),
 1386 |                 ));
 1387 |             }
 1388 |         };
 1389 | 
 1390 |         Ok(DataBlock::FixedWidth(FixedWidthDataBlock {
 1391 |             bits_per_value: self.bits_per_value,
 1392 |             data: decoded_data,
 1393 |             num_values,
 1394 |             block_info: BlockInfo::default(),
 1395 |         }))
 1396 |     }
 1397 | 
 1398 |     fn sum_run_lengths(
 1399 |         &self,
 1400 |         values_buffer: &LanceBuffer,
 1401 |         lengths_buffer: &LanceBuffer,
 1402 |     ) -> Result<u64> {
 1403 |         let (value_size, value_type) = match self.bits_per_value {
 1404 |             8 => (1, "u8"),
 1405 |             16 => (2, "u16"),
 1406 |             32 => (4, "u32"),
 1407 |             64 => (8, "u64"),
 1408 |             _ => {
 1409 |                 return Err(Error::invalid_input_source(
 1410 |                     format!(
 1411 |                         "RLE decoding bits_per_value must be 8, 16, 32, or 64, got {}",
 1412 |                         self.bits_per_value
 1413 |                     )
 1414 |                     .into(),
 1415 |                 ));
 1416 |             }
 1417 |         };
 1418 |         let length_size =
 1419 |             self.validate_buffer_sizes(values_buffer, lengths_buffer, value_size, value_type)?;
 1420 | 
 1421 |         lengths_buffer
 1422 |             .chunks_exact(length_size)
 1423 |             .try_fold(0_u64, |num_values, length_bytes| {
 1424 |                 let length = self.run_length_width.read_length(length_bytes);
 1425 |                 if length == 0 {
 1426 |                     return Err(Error::invalid_input_source(
 1427 |                         "RLE decoding encountered a zero run length".into(),
 1428 |                     ));
 1429 |                 }
 1430 |                 num_values.checked_add(length).ok_or_else(|| {
 1431 |                     Error::invalid_input_source("RLE run length sum overflowed u64".into())
 1432 |                 })
 1433 |             })
 1434 |     }
 1435 | 
 1436 |     fn validate_buffer_sizes(
 1437 |         &self,
 1438 |         values_buffer: &LanceBuffer,
 1439 |         lengths_buffer: &LanceBuffer,
 1440 |         value_size: usize,
 1441 |         value_type: &str,
 1442 |     ) -> Result<usize> {
 1443 |         let length_size = self.run_length_width.bytes_per_value();
 1444 |         if !values_buffer.len().is_multiple_of(value_size)
 1445 |             || !lengths_buffer.len().is_multiple_of(length_size)
 1446 |         {
 1447 |             return Err(Error::invalid_input_source(format!(
 1448 |                 "Invalid buffer sizes for RLE {value_type} decoding: values {} bytes (not divisible by {}), lengths {} bytes (not divisible by {})",
 1449 |                 values_buffer.len(),
 1450 |                 value_size,
 1451 |                 lengths_buffer.len(),
 1452 |                 length_size
 1453 |             )
 1454 |             .into()));
 1455 |         }
 1456 | 
 1457 |         let num_runs = values_buffer.len() / value_size;
 1458 |         let num_length_entries = lengths_buffer.len() / length_size;
 1459 |         if num_runs != num_length_entries {
 1460 |             return Err(Error::invalid_input_source(
 1461 |                 format!(
 1462 |                     "Inconsistent RLE buffers: {} runs but {} length entries",
 1463 |                     num_runs, num_length_entries
 1464 |                 )
 1465 |                 .into(),
 1466 |             ));
 1467 |         }
 1468 |         Ok(length_size)
 1469 |     }
 1470 | 
 1471 |     fn decode_child_buffers(
 1472 |         &self,
 1473 |         values_buffer: LanceBuffer,
 1474 |         lengths_buffer: LanceBuffer,
 1475 |     ) -> Result<(LanceBuffer, LanceBuffer)> {
 1476 |         let values_requires_num_runs = self.values.requires_num_values();
 1477 |         let lengths_requires_num_runs = self.run_lengths.requires_num_values();
 1478 |         if values_requires_num_runs && lengths_requires_num_runs {
 1479 |             return Err(Error::invalid_input_source(
 1480 |                 "RLE values and run lengths child compression both require the run count".into(),
 1481 |             ));
 1482 |         }
 1483 | 
 1484 |         if values_requires_num_runs {
 1485 |             let lengths_buffer = self
 1486 |                 .run_lengths
 1487 |                 .decode(lengths_buffer, None, "run lengths")?;
 1488 |             let num_runs = Self::num_child_values(
 1489 |                 &lengths_buffer,
 1490 |                 self.run_lengths.bits_per_value(),
 1491 |                 "run lengths",
 1492 |             )?;
 1493 |             let values_buffer = self
 1494 |                 .values
 1495 |                 .decode(values_buffer, Some(num_runs), "values")?;
 1496 |             Ok((values_buffer, lengths_buffer))
 1497 |         } else if lengths_requires_num_runs {
 1498 |             let values_buffer = self.values.decode(values_buffer, None, "values")?;
 1499 |             let num_runs =
 1500 |                 Self::num_child_values(&values_buffer, self.values.bits_per_value(), "values")?;
 1501 |             let lengths_buffer =
 1502 |                 self.run_lengths
 1503 |                     .decode(lengths_buffer, Some(num_runs), "run lengths")?;
 1504 |             Ok((values_buffer, lengths_buffer))
 1505 |         } else {
 1506 |             let values_buffer = self.values.decode(values_buffer, None, "values")?;
 1507 |             let lengths_buffer = self
 1508 |                 .run_lengths
 1509 |                 .decode(lengths_buffer, None, "run lengths")?;
 1510 |             Ok((values_buffer, lengths_buffer))
 1511 |         }
 1512 |     }
 1513 | 
 1514 |     fn num_child_values(buffer: &LanceBuffer, bits_per_value: u64, label: &str) -> Result<u64> {
 1515 |         let bytes_per_value = usize::try_from(bits_per_value / 8).map_err(|_| {
 1516 |             Error::invalid_input_source(
 1517 |                 format!("RLE {label} child bit width is too large: {bits_per_value}").into(),
 1518 |             )
 1519 |         })?;
 1520 |         if bytes_per_value == 0 || !buffer.len().is_multiple_of(bytes_per_value) {
 1521 |             return Err(Error::invalid_input_source(
 1522 |                 format!(
 1523 |                     "RLE {label} child decoded to {} bytes, not divisible by {}",
 1524 |                     buffer.len(),
 1525 |                     bytes_per_value
 1526 |                 )
 1527 |                 .into(),
 1528 |             ));
 1529 |         }
 1530 |         Ok((buffer.len() / bytes_per_value) as u64)
 1531 |     }
 1532 | 
 1533 |     fn decode_generic<T>(
 1534 |         &self,
 1535 |         values_buffer: &LanceBuffer,
 1536 |         lengths_buffer: &LanceBuffer,
 1537 |         num_values: u64,
 1538 |         clamp_overflow: bool,
 1539 |     ) -> Result<LanceBuffer>
 1540 |     where
 1541 |         T: bytemuck::Pod + Copy + std::fmt::Debug + ArrowNativeType,
 1542 |     {
 1543 |         let type_size = std::mem::size_of::<T>();
 1544 | 
 1545 |         if values_buffer.is_empty() || lengths_buffer.is_empty() {
 1546 |             if num_values == 0 {
 1547 |                 return Ok(LanceBuffer::empty());
 1548 |             } else {
 1549 |                 return Err(Error::invalid_input_source(
 1550 |                     format!("Empty buffers but expected {} values", num_values).into(),
 1551 |                 ));
 1552 |             }
 1553 |         }
 1554 | 
 1555 |         let length_size = self.validate_buffer_sizes(
 1556 |             values_buffer,
 1557 |             lengths_buffer,
 1558 |             type_size,
 1559 |             std::any::type_name::<T>(),
 1560 |         )?;
 1561 | 
 1562 |         let values_ref = values_buffer.borrow_to_typed_slice::<T>();
 1563 |         let values: &[T] = values_ref.as_ref();
 1564 |         let lengths = lengths_buffer.as_ref();
 1565 | 
 1566 |         let expected_value_count = usize::try_from(num_values).map_err(|_| {
 1567 |             Error::invalid_input_source(
 1568 |                 format!("RLE num_values does not fit in usize: {num_values}").into(),
 1569 |             )
 1570 |         })?;
 1571 |         // Legacy miniblock encoders rolled back to a power-of-2 checkpoint after a run
 1572 |         // had already crossed it, so a chunk's run lengths can sum past its declared
 1573 |         // value count (the excess values are re-encoded at the start of the next chunk).
 1574 |         // The pre-run-length-width decoder truncated the excess, so miniblock decoding
 1575 |         // clamps rather than rejects to keep those files readable. Block payloads never
 1576 |         // legitimately overflow, so they decode strictly.
 1577 |         let mut decoded: Vec<T> = Vec::new();
 1578 |         decoded
 1579 |             .try_reserve_exact(expected_value_count)
 1580 |             .map_err(|_| {
 1581 |                 Error::invalid_input_source(
 1582 |                     format!("RLE decoding cannot allocate {expected_value_count} values").into(),
 1583 |                 )
 1584 |             })?;
 1585 |         for (value, length_bytes) in values.iter().zip(lengths.chunks_exact(length_size)) {
 1586 |             let length = self.run_length_width.read_length(length_bytes);
 1587 |             if length == 0 {
 1588 |                 return Err(Error::invalid_input_source(
 1589 |                     "RLE decoding encountered a zero run length".into(),
 1590 |                 ));
 1591 |             }
 1592 |             let length = usize::try_from(length).map_err(|_| {
 1593 |                 Error::invalid_input_source(
 1594 |                     format!("RLE run length does not fit in usize: {length}").into(),
 1595 |                 )
 1596 |             })?;
 1597 |             let remaining = expected_value_count - decoded.len();
 1598 |             if length > remaining {
 1599 |                 if !clamp_overflow {
 1600 |                     return Err(Error::invalid_input_source(
 1601 |                         format!(
 1602 |                             "RLE decoding overflowed expected value count: produced at least {}, expected {}",
 1603 |                             decoded.len() + length,
 1604 |                             expected_value_count
 1605 |                         )
 1606 |                         .into(),
 1607 |                     ));
 1608 |                 }
 1609 |                 decoded.resize(expected_value_count, *value);
 1610 |                 break;
 1611 |             }
 1612 |             decoded.resize(decoded.len() + length, *value);
 1613 |         }
 1614 | 
 1615 |         if decoded.len() != expected_value_count {
 1616 |             return Err(Error::invalid_input_source(
 1617 |                 format!(
 1618 |                     "RLE decoding produced {} values, expected {}",
 1619 |                     decoded.len(),
 1620 |                     expected_value_count
 1621 |                 )
 1622 |                 .into(),
 1623 |             ));
 1624 |         }
 1625 | 
 1626 |         trace!(
 1627 |             "RLE decoded {} {} values",
 1628 |             num_values,
 1629 |             std::any::type_name::<T>()
 1630 |         );
 1631 |         Ok(LanceBuffer::reinterpret_vec(decoded))
 1632 |     }
 1633 | }
 1634 | 
 1635 | impl MiniBlockDecompressor for RleDecompressor {
 1636 |     fn decompress(&self, data: Vec<LanceBuffer>, num_values: u64) -> Result<DataBlock> {
 1637 |         self.decode_data(data, num_values, true)
 1638 |     }
 1639 | 
 1640 |     fn decoded_size_bytes(&self, num_values: u64) -> Option<u64> {
 1641 |         num_values
 1642 |             .checked_mul(self.bits_per_value)
 1643 |             .map(|bits| bits.div_ceil(8))
 1644 |     }
 1645 | }
 1646 | 
 1647 | impl BlockDecompressor for RleDecompressor {
 1648 |     fn decompress(&self, data: Option<LanceBuffer>, num_values: u64) -> Result<DataBlock> {
 1649 |         let data = require_block_payload(data, "RLE")?;
 1650 |         let (values_buffer, lengths_buffer) = parse_rle_block_frame(&data)?;
 1651 |         self.decode_data(vec![values_buffer, lengths_buffer], num_values, false)
 1652 |     }
 1653 | 
 1654 |     fn infer_num_values(&self, data: &LanceBuffer) -> Result<Option<u64>> {
 1655 |         // Pylance 6.0.1 used this exact RLE signature for structural levels. Newer RLE
 1656 |         // variants are not part of that compatibility case and may contain much wider,
 1657 |         // untrusted run lengths.
 1658 |         if self.bits_per_value != 16
 1659 |             || self.run_length_width != RunLengthWidth::U8
 1660 |             || !self.values.is_identity()
 1661 |             || !self.run_lengths.is_identity()
 1662 |         {
 1663 |             return Ok(None);
 1664 |         }
 1665 |         let (values_buffer, lengths_buffer) = parse_rle_block_frame(data)?;
 1666 |         self.sum_run_lengths(&values_buffer, &lengths_buffer)
 1667 |             .map(Some)
 1668 |     }
 1669 | }
 1670 | 
 1671 | /// Split an RLE block-format buffer into its `(values, lengths)` sub-buffers.
 1672 | /// Frame: `[values_size: u64-le][values bytes][run-length bytes]`.
 1673 | fn parse_rle_block_frame(data: &LanceBuffer) -> Result<(LanceBuffer, LanceBuffer)> {
 1674 |     // fetch the values_size
 1675 |     if data.len() < 8 {
 1676 |         return Err(Error::invalid_input_source(
 1677 |             format!("Insufficient data size: {}", data.len()).into(),
 1678 |         ));
 1679 |     }
 1680 | 
 1681 |     let values_size_bytes: [u8; 8] = data[..8].try_into().expect("slice length already checked");
 1682 |     let values_size: usize = u64::from_le_bytes(values_size_bytes)
 1683 |         .try_into()
 1684 |         .map_err(|_| {
 1685 |             Error::invalid_input_source(
 1686 |                 format!(
 1687 |                     "Invalid values buffer size: {}",
 1688 |                     u64::from_le_bytes(values_size_bytes)
 1689 |                 )
 1690 |                 .into(),
 1691 |             )
 1692 |         })?;
 1693 | 
 1694 |     // parse values
 1695 |     let values_start: usize = 8;
 1696 |     let lengths_start = values_start
 1697 |         .checked_add(values_size)
 1698 |         .ok_or_else(|| Error::invalid_input_source("Invalid RLE values buffer size".into()))?;
 1699 | 
 1700 |     if data.len() < lengths_start {
 1701 |         return Err(Error::invalid_input_source(
 1702 |             format!("Insufficient data size: {}", data.len()).into(),
 1703 |         ));
 1704 |     }
 1705 | 
 1706 |     let values_buffer = data.slice_with_length(values_start, values_size);
 1707 |     let lengths_buffer = data.slice_with_length(lengths_start, data.len() - lengths_start);
 1708 |     Ok((values_buffer, lengths_buffer))
 1709 | }
 1710 | 
 1711 | #[derive(Clone, Debug)]
 1712 | enum RleRunLengths {
 1713 |     U8(ScalarBuffer<u8>),
 1714 |     U16(ScalarBuffer<u16>),
 1715 |     U32(ScalarBuffer<u32>),
 1716 | }
 1717 | 
 1718 | impl RleRunLengths {
 1719 |     fn try_new(buffer: LanceBuffer, width: RunLengthWidth) -> Result<Self> {
 1720 |         let width_bytes = width.bytes_per_value();
 1721 |         if !buffer.len().is_multiple_of(width_bytes) {
 1722 |             return Err(Error::invalid_input_source(
 1723 |                 format!(
 1724 |                     "Invalid RLE run lengths buffer: {} bytes (not divisible by {})",
 1725 |                     buffer.len(),
 1726 |                     width_bytes
 1727 |                 )
 1728 |                 .into(),
 1729 |             ));
 1730 |         }
 1731 |         Ok(match width {
 1732 |             RunLengthWidth::U8 => Self::U8(buffer.borrow_to_typed_slice()),
 1733 |             RunLengthWidth::U16 => Self::U16(buffer.borrow_to_typed_slice()),
 1734 |             RunLengthWidth::U32 => Self::U32(buffer.borrow_to_typed_slice()),
 1735 |         })
 1736 |     }
 1737 | 
 1738 |     fn len(&self) -> usize {
 1739 |         match self {
 1740 |             Self::U8(lengths) => lengths.len(),
 1741 |             Self::U16(lengths) => lengths.len(),
 1742 |             Self::U32(lengths) => lengths.len(),
 1743 |         }
 1744 |     }
 1745 | 
 1746 |     fn get(&self, index: usize) -> usize {
 1747 |         match self {
 1748 |             Self::U8(lengths) => lengths[index] as usize,
 1749 |             Self::U16(lengths) => lengths[index] as usize,
 1750 |             Self::U32(lengths) => lengths[index] as usize,
 1751 |         }
 1752 |     }
 1753 | 
 1754 |     fn owned_size(&self) -> usize {
 1755 |         match self {
 1756 |             Self::U8(lengths) => std::mem::size_of_val(lengths.as_ref()),
 1757 |             Self::U16(lengths) => std::mem::size_of_val(lengths.as_ref()),
 1758 |             Self::U32(lengths) => std::mem::size_of_val(lengths.as_ref()),
 1759 |         }
 1760 |     }
 1761 | 
 1762 |     fn into_owned(self) -> Self {
 1763 |         match self {
 1764 |             Self::U8(lengths) => Self::U8(ScalarBuffer::from(lengths.as_ref().to_vec())),
 1765 |             Self::U16(lengths) => Self::U16(ScalarBuffer::from(lengths.as_ref().to_vec())),
 1766 |             Self::U32(lengths) => Self::U32(ScalarBuffer::from(lengths.as_ref().to_vec())),
 1767 |         }
 1768 |     }
 1769 | 
 1770 |     fn deep_size(&self) -> usize {
 1771 |         match self {
 1772 |             Self::U8(lengths) => lengths.inner().capacity(),
 1773 |             Self::U16(lengths) => lengths.inner().capacity(),
 1774 |             Self::U32(lengths) => lengths.inner().capacity(),
 1775 |         }
 1776 |     }
 1777 | }
 1778 | 
 1779 | /// Validated physical RLE runs for `u16` values.
 1780 | ///
 1781 | /// The values and original-width lengths remain unexpanded. The constructor
 1782 | /// verifies that every length is non-zero and that the runs cover exactly
 1783 | /// `num_values` logical values.
 1784 | #[derive(Clone, Debug)]
 1785 | pub(crate) struct RleRuns {
 1786 |     values: ScalarBuffer<u16>,
 1787 |     lengths: RleRunLengths,
 1788 |     num_values: usize,
 1789 |     coalesced_runs: usize,
 1790 | }
 1791 | 
 1792 | impl RleRuns {
 1793 |     fn try_new(
 1794 |         values_buffer: LanceBuffer,
 1795 |         lengths_buffer: LanceBuffer,
 1796 |         run_length_width: RunLengthWidth,
 1797 |         num_values: u64,
 1798 |     ) -> Result<Self> {
 1799 |         let num_values = usize::try_from(num_values).map_err(|_| {
 1800 |             Error::invalid_input_source(
 1801 |                 format!("RLE num_values does not fit in usize: {num_values}").into(),
 1802 |             )
 1803 |         })?;
 1804 |         let type_size = std::mem::size_of::<u16>();
 1805 |         if !values_buffer.len().is_multiple_of(type_size) {
 1806 |             return Err(Error::invalid_input_source(
 1807 |                 format!(
 1808 |                     "Invalid RLE u16 values buffer: {} bytes (not divisible by {})",
 1809 |                     values_buffer.len(),
 1810 |                     type_size
 1811 |                 )
 1812 |                 .into(),
 1813 |             ));
 1814 |         }
 1815 | 
 1816 |         let values = values_buffer.borrow_to_typed_slice::<u16>();
 1817 |         let lengths = RleRunLengths::try_new(lengths_buffer, run_length_width)?;
 1818 |         if values.len() != lengths.len() {
 1819 |             return Err(Error::invalid_input_source(
 1820 |                 format!(
 1821 |                     "Inconsistent RLE buffers: {} runs but {} length entries",
 1822 |                     values.len(),
 1823 |                     lengths.len()
 1824 |                 )
 1825 |                 .into(),
 1826 |             ));
 1827 |         }
 1828 |         if values.is_empty() && num_values != 0 {
 1829 |             return Err(Error::invalid_input_source(
 1830 |                 format!("Empty RLE buffers but expected {num_values} values").into(),
 1831 |             ));
 1832 |         }
 1833 | 
 1834 |         let mut decoded_values = 0usize;
 1835 |         let mut coalesced_runs = 0usize;
 1836 |         let mut previous_value = None;
 1837 |         for run in 0..values.len() {
 1838 |             let length = lengths.get(run);
 1839 |             if length == 0 {
 1840 |                 return Err(Error::invalid_input_source(
 1841 |                     "RLE decoding encountered a zero run length".into(),
 1842 |                 ));
 1843 |             }
 1844 |             decoded_values = decoded_values.checked_add(length).ok_or_else(|| {
 1845 |                 Error::invalid_input_source("RLE run length sum overflowed usize".into())
 1846 |             })?;
 1847 |             if decoded_values > num_values {
 1848 |                 return Err(Error::invalid_input_source(
 1849 |                     format!(
 1850 |                         "RLE decoding overflowed expected value count: produced at least {}, expected {}",
 1851 |                         decoded_values, num_values
 1852 |                     )
 1853 |                     .into(),
 1854 |                 ));
 1855 |             }
 1856 |             if previous_value != Some(values[run]) {
 1857 |                 coalesced_runs += 1;
 1858 |                 previous_value = Some(values[run]);
 1859 |             }
 1860 |         }
 1861 |         if decoded_values != num_values {
 1862 |             return Err(Error::invalid_input_source(
 1863 |                 format!(
 1864 |                     "RLE decoding produced {} values, expected {}",
 1865 |                     decoded_values, num_values
 1866 |                 )
 1867 |                 .into(),
 1868 |             ));
 1869 |         }
 1870 | 
 1871 |         Ok(Self {
 1872 |             values,
 1873 |             lengths,
 1874 |             num_values,
 1875 |             coalesced_runs,
 1876 |         })
 1877 |     }
 1878 | 
 1879 |     pub(crate) fn num_values(&self) -> usize {
 1880 |         self.num_values
 1881 |     }
 1882 | 
 1883 |     pub(crate) fn num_runs(&self) -> usize {
 1884 |         self.values.len()
 1885 |     }
 1886 | 
 1887 |     pub(crate) fn coalesced_runs(&self) -> usize {
 1888 |         self.coalesced_runs
 1889 |     }
 1890 | 
 1891 |     pub(crate) fn owned_size(&self) -> usize {
 1892 |         std::mem::size_of_val(self.values.as_ref()) + self.lengths.owned_size()
 1893 |     }
 1894 | 
 1895 |     pub(crate) fn into_owned(self) -> Self {
 1896 |         Self {
 1897 |             values: ScalarBuffer::from(self.values.as_ref().to_vec()),
 1898 |             lengths: self.lengths.into_owned(),
 1899 |             num_values: self.num_values,
 1900 |             coalesced_runs: self.coalesced_runs,
 1901 |         }
 1902 |     }
 1903 | 
 1904 |     pub(crate) fn deep_size(&self) -> usize {
 1905 |         self.values.inner().capacity() + self.lengths.deep_size()
 1906 |     }
 1907 | 
 1908 |     pub(crate) fn value(&self, run: usize) -> u16 {
 1909 |         self.values[run]
 1910 |     }
 1911 | 
 1912 |     pub(crate) fn length(&self, run: usize) -> usize {
 1913 |         self.lengths.get(run)
 1914 |     }
 1915 | 
 1916 |     pub(crate) fn iter(&self) -> impl ExactSizeIterator<Item = (u16, usize)> + '_ {
 1917 |         (0..self.num_runs()).map(|run| (self.value(run), self.length(run)))
 1918 |     }
 1919 | }
 1920 | 
 1921 | impl RleDecompressor {
 1922 |     /// Decode and validate a block frame while preserving its physical runs.
 1923 |     pub(crate) fn decode_u16_runs(&self, data: LanceBuffer, num_values: u64) -> Result<RleRuns> {
 1924 |         if self.bits_per_value != 16 {
 1925 |             return Err(Error::invalid_input_source(
 1926 |                 format!(
 1927 |                     "RLE level values must be 16 bits, got {}",
 1928 |                     self.bits_per_value
 1929 |                 )
 1930 |                 .into(),
 1931 |             ));
 1932 |         }
 1933 |         let (values_buffer, lengths_buffer) = parse_rle_block_frame(&data)?;
 1934 |         let (values_buffer, lengths_buffer) =
 1935 |             self.decode_child_buffers(values_buffer, lengths_buffer)?;
 1936 |         RleRuns::try_new(
 1937 |             values_buffer,
 1938 |             lengths_buffer,
 1939 |             self.run_length_width,
 1940 |             num_values,
 1941 |         )
 1942 |     }
 1943 | }
 1944 | 
 1945 | #[cfg(test)]
 1946 | mod tests {
 1947 |     use std::sync::Arc;
 1948 | 
 1949 |     use super::*;
 1950 |     use crate::compression::{
 1951 |         DecompressionStrategy, DefaultDecompressionStrategy, create_rle_decompressor,
 1952 |     };
 1953 |     use crate::data::DataBlock;
 1954 |     use crate::encodings::logical::primitive::miniblock::MAX_MINIBLOCK_VALUES;
 1955 |     use crate::encodings::physical::block::{CompressionConfig, CompressionScheme};
 1956 |     use crate::{
 1957 |         buffer::LanceBuffer,
 1958 |         compression::{BlockCompressor, BlockDecompressor},
 1959 |     };
 1960 |     use arrow_array::Int32Array;
 1961 |     use rstest::rstest;
 1962 | 
 1963 |     fn compress_miniblock(
 1964 |         compressor: &dyn MiniBlockCompressor,
 1965 |         data: DataBlock,
 1966 |     ) -> Result<(MiniBlockCompressed, CompressiveEncoding)> {
 1967 |         compressor.compress(MiniBlockCompressionContext::new(0, true, true), data)
 1968 |     }
 1969 | 
 1970 |     fn expand_u16_runs(runs: &RleRuns) -> Vec<u16> {
 1971 |         let mut expanded = Vec::with_capacity(runs.num_values());
 1972 |         for (value, length) in runs.iter() {
 1973 |             expanded.extend(std::iter::repeat_n(value, length));
 1974 |         }
 1975 |         expanded
 1976 |     }
 1977 | 
 1978 |     #[test]
 1979 |     fn decode_u16_runs_matches_eager() {
 1980 |         // Near-constant u16 levels (the all-null shape): a few long runs.
 1981 |         let mut levels: Vec<u16> = vec![1u16; 1000];
 1982 |         levels.extend(std::iter::repeat_n(0u16, 500));
 1983 |         levels.extend(std::iter::repeat_n(2u16, 300));
 1984 |         let num_values = levels.len() as u64;
 1985 | 
 1986 |         let block = DataBlock::FixedWidth(FixedWidthDataBlock {
 1987 |             data: LanceBuffer::reinterpret_slice(Arc::from(levels.clone())),
 1988 |             bits_per_value: 16,
 1989 |             num_values,
 1990 |             block_info: BlockInfo::new(),
 1991 |         });
 1992 |         let frame = BlockCompressor::compress(&RleEncoder::new(), block)
 1993 |             .unwrap()
 1994 |             .0
 1995 |             .unwrap();
 1996 | 
 1997 |         let eager = BlockDecompressor::decompress(
 1998 |             &RleDecompressor::new(16),
 1999 |             Some(frame.clone()),
 2000 |             num_values,
 2001 |         )
 2002 |         .unwrap();
 2003 |         let DataBlock::FixedWidth(eager) = eager else {
 2004 |             panic!("expected fixed-width block");
 2005 |         };
 2006 |         assert_eq!(
 2007 |             eager.data.borrow_to_typed_slice::<u16>().as_ref(),
 2008 |             levels.as_slice()
 2009 |         );
 2010 | 
 2011 |         // Lazy run form preserves boundaries and expands identically.
 2012 |         let runs = RleDecompressor::new(16)
 2013 |             .decode_u16_runs(frame, num_values)
 2014 |             .unwrap();
 2015 |         assert_eq!(runs.num_values(), num_values as usize);
 2016 |         // The encoder splits each value into <=255-length runs (4 + 2 + 2 = 8
 2017 |         // on-disk runs here); the scan identifies 3 coalesced logical runs.
 2018 |         assert_eq!(runs.num_runs(), 8);
 2019 |         assert_eq!(runs.coalesced_runs(), 3);
 2020 |         assert_eq!(expand_u16_runs(&runs), levels);
 2021 |     }
 2022 | 
 2023 |     #[test]
 2024 |     fn decode_u16_runs_empty() {
 2025 |         let mut empty_frame = Vec::new();
 2026 |         empty_frame.extend_from_slice(&0u64.to_le_bytes());
 2027 |         let runs = RleDecompressor::new(16)
 2028 |             .decode_u16_runs(LanceBuffer::from(empty_frame), 0)
 2029 |             .unwrap();
 2030 |         assert_eq!(runs.num_values(), 0);
 2031 |         assert_eq!(runs.num_runs(), 0);
 2032 |         assert_eq!(runs.coalesced_runs(), 0);
 2033 | 
 2034 |         let error = RleDecompressor::new(16)
 2035 |             .decode_u16_runs(LanceBuffer::empty(), 0)
 2036 |             .unwrap_err();
 2037 |         assert!(error.to_string().contains("Insufficient data size: 0"));
 2038 |     }
 2039 | 
 2040 |     #[test]
 2041 |     fn legacy_block_rle_infers_value_count_without_materializing() {
 2042 |         let num_values = u64::from(u16::MAX) + 8;
 2043 |         let full_runs = num_values / u64::from(u8::MAX);
 2044 |         let remainder = num_values % u64::from(u8::MAX);
 2045 |         let num_runs = full_runs + u64::from(remainder != 0);
 2046 |         let mut frame = Vec::new();
 2047 |         frame.extend_from_slice(&(num_runs * 2).to_le_bytes());
 2048 |         frame.extend(std::iter::repeat_n(7_u16, num_runs as usize).flat_map(u16::to_le_bytes));
 2049 |         frame.extend(std::iter::repeat_n(u8::MAX, full_runs as usize));
 2050 |         if remainder != 0 {
 2051 |             frame.push(remainder as u8);
 2052 |         }
 2053 | 
 2054 |         let inferred_num_values = RleDecompressor::new(16)
 2055 |             .infer_num_values(&LanceBuffer::from(frame))
 2056 |             .unwrap();
 2057 |         assert_eq!(inferred_num_values, Some(num_values));
 2058 |     }
 2059 | 
 2060 |     #[test]
 2061 |     fn newer_block_rle_does_not_infer_untrusted_run_sum() {
 2062 |         let mut frame = Vec::new();
 2063 |         frame.extend_from_slice(&2_u64.to_le_bytes());
 2064 |         frame.extend_from_slice(&7_u16.to_le_bytes());
 2065 |         frame.extend_from_slice(&u32::MAX.to_le_bytes());
 2066 |         let frame = LanceBuffer::from(frame);
 2067 |         let decompressor = RleDecompressor::with_run_length_width(16, RunLengthWidth::U32);
 2068 | 
 2069 |         assert_eq!(decompressor.infer_num_values(&frame).unwrap(), None);
 2070 |         let error = BlockDecompressor::decompress(&decompressor, Some(frame), u64::from(u16::MAX))
 2071 |             .unwrap_err();
 2072 |         assert!(matches!(error, lance_core::Error::InvalidInput { .. }));
 2073 |         assert!(
 2074 |             error
 2075 |                 .to_string()
 2076 |                 .contains("RLE decoding overflowed expected value count")
 2077 |         );
 2078 |     }
 2079 | 
 2080 |     #[rstest]
 2081 |     #[case::zero(0, 1, "zero run length")]
 2082 |     #[case::underflow(1, 2, "produced 1 values, expected 2")]
 2083 |     #[case::overflow(2, 1, "overflowed expected value count")]
 2084 |     #[case::nonempty_for_empty(1, 0, "overflowed expected value count")]
 2085 |     fn decode_u16_runs_rejects_invalid_coverage(
 2086 |         #[case] run_length: u8,
 2087 |         #[case] num_values: u64,
 2088 |         #[case] expected_message: &str,
 2089 |     ) {
 2090 |         let mut frame = Vec::new();
 2091 |         frame.extend_from_slice(&2u64.to_le_bytes());
 2092 |         frame.extend_from_slice(&7u16.to_le_bytes());
 2093 |         frame.push(run_length);
 2094 | 
 2095 |         let error = RleDecompressor::new(16)
 2096 |             .decode_u16_runs(LanceBuffer::from(frame), num_values)
 2097 |             .unwrap_err();
 2098 |         assert!(matches!(error, lance_core::Error::InvalidInput { .. }));
 2099 |         assert!(error.to_string().contains(expected_message));
 2100 |     }
 2101 | 
 2102 |     #[test]
 2103 |     #[cfg(any(feature = "lz4", feature = "zstd"))]
 2104 |     fn decode_u16_runs_supports_compressed_values_child() {
 2105 |         let levels: Vec<u16> = (0..1024)
 2106 |             .flat_map(|run| std::iter::repeat_n((run % 8) as u16, 4))
 2107 |             .collect();
 2108 |         let num_values = levels.len() as u64;
 2109 |         let block = DataBlock::FixedWidth(FixedWidthDataBlock {
 2110 |             data: LanceBuffer::reinterpret_slice(Arc::from(levels.clone())),
 2111 |             bits_per_value: 16,
 2112 |             num_values,
 2113 |             block_info: BlockInfo::new(),
 2114 |         });
 2115 |         let frame = BlockCompressor::compress(&RleEncoder::new(), block)
 2116 |             .unwrap()
 2117 |             .0
 2118 |             .unwrap();
 2119 |         let (values, lengths) = parse_rle_block_frame(&frame).unwrap();
 2120 | 
 2121 |         let compression = test_general_compression();
 2122 |         let compressor = GeneralBufferCompressor::get_compressor(compression).unwrap();
 2123 |         let mut compressed_values = Vec::new();
 2124 |         compressor
 2125 |             .compress(values.as_ref(), &mut compressed_values)
 2126 |             .unwrap();
 2127 |         let mut compressed_frame = Vec::new();
 2128 |         compressed_frame.extend_from_slice(&(compressed_values.len() as u64).to_le_bytes());
 2129 |         compressed_frame.extend_from_slice(&compressed_values);
 2130 |         compressed_frame.extend_from_slice(lengths.as_ref());
 2131 | 
 2132 |         let encoding = ProtobufUtils21::rle(
 2133 |             ProtobufUtils21::wrapped(compression, ProtobufUtils21::flat(16, None)).unwrap(),
 2134 |             ProtobufUtils21::flat(8, None),
 2135 |         );
 2136 |         let decompressor = create_rle_decompressor(
 2137 |             expect_rle(&encoding),
 2138 |             &DefaultDecompressionStrategy::default(),
 2139 |         )
 2140 |         .unwrap();
 2141 |         let runs = decompressor
 2142 |             .decode_u16_runs(LanceBuffer::from(compressed_frame), num_values)
 2143 |             .unwrap();
 2144 |         assert_eq!(expand_u16_runs(&runs), levels);
 2145 |     }
 2146 | 
 2147 |     #[test]
 2148 |     fn decode_u16_runs_counts_coalesced_runs() {
 2149 |         // A logically constant page is emitted as ceil(N / 255) equal-valued
 2150 |         // runs (the encoder caps run lengths at 255); the validated view records
 2151 |         // that they can collapse to a single logical run.
 2152 |         let num_values = 5000u64;
 2153 |         let constant: Vec<u16> = vec![7u16; num_values as usize];
 2154 |         let block = DataBlock::FixedWidth(FixedWidthDataBlock {
 2155 |             data: LanceBuffer::reinterpret_slice(Arc::from(constant)),
 2156 |             bits_per_value: 16,
 2157 |             num_values,
 2158 |             block_info: BlockInfo::new(),
 2159 |         });
 2160 |         let frame = BlockCompressor::compress(&RleEncoder::new(), block)
 2161 |             .unwrap()
 2162 |             .0
 2163 |             .unwrap();
 2164 |         let runs = RleDecompressor::new(16)
 2165 |             .decode_u16_runs(frame, num_values)
 2166 |             .unwrap();
 2167 |         assert_eq!(
 2168 |             runs.num_runs(),
 2169 |             num_values.div_ceil(u8::MAX as u64) as usize
 2170 |         );
 2171 |         assert_eq!(runs.coalesced_runs(), 1);
 2172 |         assert_eq!(expand_u16_runs(&runs), vec![7u16; num_values as usize]);
 2173 | 
 2174 |         // Distinct adjacent values must not be merged: alternating single-value
 2175 |         // runs stay separate and still expand to the original.
 2176 |         let alternating: Vec<u16> = (0..200u16).map(|i| i % 2).collect();
 2177 |         let n = alternating.len() as u64;
 2178 |         let block = DataBlock::FixedWidth(FixedWidthDataBlock {
 2179 |             data: LanceBuffer::reinterpret_slice(Arc::from(alternating.clone())),
 2180 |             bits_per_value: 16,
 2181 |             num_values: n,
 2182 |             block_info: BlockInfo::new(),
 2183 |         });
 2184 |         let frame = BlockCompressor::compress(&RleEncoder::new(), block)
 2185 |             .unwrap()
 2186 |             .0
 2187 |             .unwrap();
 2188 |         let runs = RleDecompressor::new(16).decode_u16_runs(frame, n).unwrap();
 2189 |         assert_eq!(
 2190 |             runs.coalesced_runs() as u64,
 2191 |             n,
 2192 |             "no two adjacent values are equal"
 2193 |         );
 2194 |         assert_eq!(expand_u16_runs(&runs), alternating);
 2195 |     }
 2196 | 
 2197 |     // ========== Core Functionality Tests ==========
 2198 | 
 2199 |     #[test]
 2200 |     fn test_basic_miniblock_rle_encoding() {
 2201 |         let encoder = RleEncoder::new();
 2202 | 
 2203 |         // Test basic RLE pattern: [1, 1, 1, 2, 2, 3, 3, 3, 3]
 2204 |         let array = Int32Array::from(vec![1, 1, 1, 2, 2, 3, 3, 3, 3]);
 2205 |         let data_block = DataBlock::from_array(array);
 2206 | 
 2207 |         let (compressed, _) = compress_miniblock(&encoder, data_block).unwrap();
 2208 | 
 2209 |         assert_eq!(compressed.num_values, 9);
 2210 |         assert_eq!(compressed.chunks.len(), 1);
 2211 | 
 2212 |         // Verify compression happened (3 runs instead of 9 values)
 2213 |         let values_buffer = &compressed.data[0];
 2214 |         let lengths_buffer = &compressed.data[1];
 2215 |         assert_eq!(values_buffer.len(), 12); // 3 i32 values
 2216 |         assert_eq!(lengths_buffer.len(), 3); // 3 u8 lengths
 2217 |     }
 2218 | 
 2219 |     #[test]
 2220 |     fn test_long_run_splitting() {
 2221 |         let encoder = RleEncoder::new();
 2222 | 
 2223 |         // Create a run longer than 255 to test splitting
 2224 |         let mut data = vec![42i32; 1000]; // Will be split into 255+255+255+235
 2225 |         data.extend(&[100i32; 300]); // Will be split into 255+45
 2226 | 
 2227 |         let array = Int32Array::from(data);
 2228 |         let (compressed, _) = compress_miniblock(&encoder, DataBlock::from_array(array)).unwrap();
 2229 | 
 2230 |         // Should have 6 runs total (4 for first value, 2 for second)
 2231 |         let lengths_buffer = &compressed.data[1];
 2232 |         assert_eq!(lengths_buffer.len(), 6);
 2233 |     }
 2234 | 
 2235 |     #[test]
 2236 |     fn test_rle_v2_u16_miniblock_encoding() {
 2237 |         let encoder = RleEncoder::with_run_length_width(RunLengthWidth::U16);
 2238 | 
 2239 |         let data = vec![42i32; 1000];
 2240 |         let array = Int32Array::from(data);
 2241 |         let (compressed, encoding) =
 2242 |             compress_miniblock(&encoder, DataBlock::from_array(array)).unwrap();
 2243 | 
 2244 |         assert_eq!(compressed.data[0].len(), 4);
 2245 |         assert_eq!(compressed.data[1].len(), 2);
 2246 |         assert_eq!(compressed.data[1].as_ref(), &1000u16.to_le_bytes());
 2247 | 
 2248 |         let rle = match encoding.compression.as_ref().unwrap() {
 2249 |             crate::format::pb21::compressive_encoding::Compression::Rle(rle) => rle,
 2250 |             other => panic!("expected RLE encoding, got {other:?}"),
 2251 |         };
 2252 |         let run_lengths = rle.run_lengths.as_ref().unwrap();
 2253 |         let flat = match run_lengths.compression.as_ref().unwrap() {
 2254 |             crate::format::pb21::compressive_encoding::Compression::Flat(flat) => flat,
 2255 |             other => panic!("expected flat run lengths, got {other:?}"),
 2256 |         };
 2257 |         assert_eq!(flat.bits_per_value, 16);
 2258 | 
 2259 |         let decompressor = RleDecompressor::with_run_length_width(32, RunLengthWidth::U16);
 2260 |         let decompressed = MiniBlockDecompressor::decompress(
 2261 |             &decompressor,
 2262 |             compressed.data,
 2263 |             compressed.num_values,
 2264 |         )
 2265 |         .unwrap();
 2266 |         match decompressed {
 2267 |             DataBlock::FixedWidth(block) => {
 2268 |                 let values = block.data.borrow_to_typed_slice::<i32>();
 2269 |                 assert_eq!(values.as_ref(), vec![42i32; 1000]);
 2270 |             }
 2271 |             _ => panic!("Expected FixedWidth block"),
 2272 |         }
 2273 |     }
 2274 | 
 2275 |     #[test]
 2276 |     #[cfg(any(feature = "lz4", feature = "zstd"))]
 2277 |     fn test_rle_miniblock_compressed_values_child() {
 2278 |         let compression = test_general_compression();
 2279 |         let encoder =
 2280 |             RleEncoder::with_child_encoding(RunLengthWidth::U8, Some(compression), None, false);
 2281 |         let array = Int32Array::from(repeating_runs(1024, 4));
 2282 |         let (compressed, encoding) =
 2283 |             compress_miniblock(&encoder, DataBlock::from_array(array)).unwrap();
 2284 | 
 2285 |         let rle = expect_rle(&encoding);
 2286 |         assert!(matches!(
 2287 |             rle.values.as_ref().unwrap().compression.as_ref().unwrap(),
 2288 |             crate::format::pb21::compressive_encoding::Compression::General(_)
 2289 |         ));
 2290 |         assert!(matches!(
 2291 |             rle.run_lengths
 2292 |                 .as_ref()
 2293 |                 .unwrap()
 2294 |                 .compression
 2295 |                 .as_ref()
 2296 |                 .unwrap(),
 2297 |             crate::format::pb21::compressive_encoding::Compression::Flat(_)
 2298 |         ));
 2299 | 
 2300 |         let decompressor = DefaultDecompressionStrategy::default()
 2301 |             .create_miniblock_decompressor(&encoding, &DefaultDecompressionStrategy::default())
 2302 |             .unwrap();
 2303 |         let decoded =
 2304 |             MiniBlockDecompressor::decompress(decompressor.as_ref(), compressed.data, 1024 * 4)
 2305 |                 .unwrap();
 2306 |         assert_decoded_i32_eq(decoded, &repeating_runs(1024, 4));
 2307 |     }
 2308 | 
 2309 |     #[test]
 2310 |     #[cfg(any(feature = "lz4", feature = "zstd"))]
 2311 |     fn test_rle_miniblock_compressed_run_lengths_child() {
 2312 |         let compression = test_general_compression();
 2313 |         let encoder =
 2314 |             RleEncoder::with_child_encoding(RunLengthWidth::U8, None, Some(compression), false);
 2315 |         let expected = repeating_runs(1024, 4);
 2316 |         let (compressed, encoding) = compress_miniblock(
 2317 |             &encoder,
 2318 |             DataBlock::from_array(Int32Array::from(expected.clone())),
 2319 |         )
 2320 |         .unwrap();
 2321 | 
 2322 |         let rle = expect_rle(&encoding);
 2323 |         assert!(matches!(
 2324 |             rle.values.as_ref().unwrap().compression.as_ref().unwrap(),
 2325 |             crate::format::pb21::compressive_encoding::Compression::Flat(_)
 2326 |         ));
 2327 |         assert!(matches!(
 2328 |             rle.run_lengths
 2329 |                 .as_ref()
 2330 |                 .unwrap()
 2331 |                 .compression
 2332 |                 .as_ref()
 2333 |                 .unwrap(),
 2334 |             crate::format::pb21::compressive_encoding::Compression::General(_)
 2335 |         ));
 2336 | 
 2337 |         let decompressor = DefaultDecompressionStrategy::default()
 2338 |             .create_miniblock_decompressor(&encoding, &DefaultDecompressionStrategy::default())
 2339 |             .unwrap();
 2340 |         let decoded =
 2341 |             MiniBlockDecompressor::decompress(decompressor.as_ref(), compressed.data, 1024 * 4)
 2342 |                 .unwrap();
 2343 |         assert_decoded_i32_eq(decoded, &expected);
 2344 |     }
 2345 | 
 2346 |     #[test]
 2347 |     #[cfg(feature = "bitpacking")]
 2348 |     fn test_rle_miniblock_bitpacked_run_lengths_child() {
 2349 |         use crate::encodings::physical::bitpacking::OutOfLineBitpacking;
 2350 | 
 2351 |         let expected = repeating_runs(1024, 4);
 2352 |         let (compressed, _) = compress_miniblock(
 2353 |             &RleEncoder::new(),
 2354 |             DataBlock::from_array(Int32Array::from(expected.clone())),
 2355 |         )
 2356 |         .unwrap();
 2357 |         let run_lengths = compressed.data[1].clone();
 2358 |         let num_runs = run_lengths.len() as u64;
 2359 |         let run_lengths_block = DataBlock::FixedWidth(FixedWidthDataBlock {
 2360 |             bits_per_value: 8,
 2361 |             data: run_lengths,
 2362 |             num_values: num_runs,
 2363 |             block_info: BlockInfo::default(),
 2364 |         });
 2365 |         let bitpacked_run_lengths =
 2366 |             BlockCompressor::compress(&OutOfLineBitpacking::new(3, 8), run_lengths_block)
 2367 |                 .unwrap()
 2368 |                 .0
 2369 |                 .unwrap();
 2370 |         let encoding = ProtobufUtils21::rle(
 2371 |             ProtobufUtils21::flat(32, None),
 2372 |             ProtobufUtils21::out_of_line_bitpacking(8, ProtobufUtils21::flat(3, None)),
 2373 |         );
 2374 | 
 2375 |         let decompressor = DefaultDecompressionStrategy::default()
 2376 |             .create_miniblock_decompressor(&encoding, &DefaultDecompressionStrategy::default())
 2377 |             .unwrap();
 2378 |         let decoded = MiniBlockDecompressor::decompress(
 2379 |             decompressor.as_ref(),
 2380 |             vec![compressed.data[0].clone(), bitpacked_run_lengths],
 2381 |             expected.len() as u64,
 2382 |         )
 2383 |         .unwrap();
 2384 |         assert_decoded_i32_eq(decoded, &expected);
 2385 |     }
 2386 | 
 2387 |     #[test]
 2388 |     #[cfg(feature = "bitpacking")]
 2389 |     fn test_rle_rejects_two_count_dependent_child_encodings() {
 2390 |         let encoding = ProtobufUtils21::rle(
 2391 |             ProtobufUtils21::out_of_line_bitpacking(32, ProtobufUtils21::flat(3, None)),
 2392 |             ProtobufUtils21::out_of_line_bitpacking(8, ProtobufUtils21::flat(3, None)),
 2393 |         );
 2394 | 
 2395 |         let err = DefaultDecompressionStrategy::default()
 2396 |             .create_miniblock_decompressor(&encoding, &DefaultDecompressionStrategy::default())
 2397 |             .unwrap_err();
 2398 |         assert!(
 2399 |             err.to_string()
 2400 |                 .contains("cannot both require the run count")
 2401 |         );
 2402 |     }
 2403 | 
 2404 |     #[cfg(any(feature = "lz4", feature = "zstd"))]
 2405 |     fn test_general_compression() -> CompressionConfig {
 2406 |         if cfg!(feature = "zstd") {
 2407 |             CompressionConfig::new(CompressionScheme::Zstd, Some(3))
 2408 |         } else {
 2409 |             CompressionConfig::new(CompressionScheme::Lz4, None)
 2410 |         }
 2411 |     }
 2412 | 
 2413 |     fn repeating_runs(num_runs: usize, run_length: usize) -> Vec<i32> {
 2414 |         let mut values = Vec::with_capacity(num_runs * run_length);
 2415 |         for run in 0..num_runs {
 2416 |             values.extend(std::iter::repeat_n((run % 8) as i32, run_length));
 2417 |         }
 2418 |         values
 2419 |     }
 2420 | 
 2421 |     fn expect_rle(encoding: &CompressiveEncoding) -> &crate::format::pb21::Rle {
 2422 |         match encoding.compression.as_ref().unwrap() {
 2423 |             crate::format::pb21::compressive_encoding::Compression::Rle(rle) => rle,
 2424 |             other => panic!("expected RLE encoding, got {other:?}"),
 2425 |         }
 2426 |     }
 2427 | 
 2428 |     fn assert_decoded_i32_eq(decoded: DataBlock, expected: &[i32]) {
 2429 |         match decoded {
 2430 |             DataBlock::FixedWidth(block) => {
 2431 |                 let values = block.data.borrow_to_typed_slice::<i32>();
 2432 |                 assert_eq!(values.as_ref(), expected);
 2433 |             }
 2434 |             _ => panic!("Expected FixedWidth block"),
 2435 |         }
 2436 |     }
 2437 | 
 2438 |     #[test]
 2439 |     #[cfg(any(feature = "lz4", feature = "zstd"))]
 2440 |     fn test_rle_miniblock_compressed_children_multiple_chunks() {
 2441 |         let compression = test_general_compression();
 2442 |         let encoder = RleEncoder::with_child_encoding(
 2443 |             RunLengthWidth::U8,
 2444 |             Some(compression),
 2445 |             Some(compression),
 2446 |             false,
 2447 |         );
 2448 |         let expected = repeating_runs(8192, 4);
 2449 |         let (compressed, encoding) = compress_miniblock(
 2450 |             &encoder,
 2451 |             DataBlock::from_array(Int32Array::from(expected.clone())),
 2452 |         )
 2453 |         .unwrap();
 2454 | 
 2455 |         assert!(compressed.chunks.len() > 1);
 2456 |         let rle = expect_rle(&encoding);
 2457 |         assert!(matches!(
 2458 |             rle.values.as_ref().unwrap().compression.as_ref().unwrap(),
 2459 |             crate::format::pb21::compressive_encoding::Compression::General(_)
 2460 |         ));
 2461 |         assert!(matches!(
 2462 |             rle.run_lengths
 2463 |                 .as_ref()
 2464 |                 .unwrap()
 2465 |                 .compression
 2466 |                 .as_ref()
 2467 |                 .unwrap(),
 2468 |             crate::format::pb21::compressive_encoding::Compression::General(_)
 2469 |         ));
 2470 | 
 2471 |         let decoded = decompress_i32_chunks(&compressed, &encoding);
 2472 |         assert_eq!(decoded, expected);
 2473 |     }
 2474 | 
 2475 |     #[test]
 2476 |     #[cfg(feature = "bitpacking")]
 2477 |     fn test_rle_miniblock_bitpacks_values_child_when_smaller() {
 2478 |         let encoder = RleEncoder::with_child_encoding(RunLengthWidth::U8, None, None, true);
 2479 |         let expected = monotonic_runs(2048, 4);
 2480 |         let (compressed, encoding) = compress_miniblock(
 2481 |             &encoder,
 2482 |             DataBlock::from_array(Int32Array::from(expected.clone())),
 2483 |         )
 2484 |         .unwrap();
 2485 | 
 2486 |         let rle = expect_rle(&encoding);
 2487 |         assert!(matches!(
 2488 |             rle.values.as_ref().unwrap().compression.as_ref().unwrap(),
 2489 |             crate::format::pb21::compressive_encoding::Compression::OutOfLineBitpacking(_)
 2490 |         ));
 2491 |         assert!(matches!(
 2492 |             rle.run_lengths
 2493 |                 .as_ref()
 2494 |                 .unwrap()
 2495 |                 .compression
 2496 |                 .as_ref()
 2497 |                 .unwrap(),
 2498 |             crate::format::pb21::compressive_encoding::Compression::Flat(_)
 2499 |         ));
 2500 | 
 2501 |         let decoded = decompress_i32_chunks(&compressed, &encoding);
 2502 |         assert_eq!(decoded, expected);
 2503 |     }
 2504 | 
 2505 |     #[test]
 2506 |     #[cfg(feature = "bitpacking")]
 2507 |     fn test_rle_miniblock_bitpacks_run_lengths_when_values_do_not_shrink() {
 2508 |         let encoder = RleEncoder::with_child_encoding(RunLengthWidth::U8, None, None, true);
 2509 |         let expected = high_entropy_runs(2048, 4);
 2510 |         let (compressed, encoding) = compress_miniblock(
 2511 |             &encoder,
 2512 |             DataBlock::from_array(Int32Array::from(expected.clone())),
 2513 |         )
 2514 |         .unwrap();
 2515 | 
 2516 |         let rle = expect_rle(&encoding);
 2517 |         assert!(matches!(
 2518 |             rle.values.as_ref().unwrap().compression.as_ref().unwrap(),
 2519 |             crate::format::pb21::compressive_encoding::Compression::Flat(_)
 2520 |         ));
 2521 |         assert!(matches!(
 2522 |             rle.run_lengths
 2523 |                 .as_ref()
 2524 |                 .unwrap()
 2525 |                 .compression
 2526 |                 .as_ref()
 2527 |                 .unwrap(),
 2528 |             crate::format::pb21::compressive_encoding::Compression::OutOfLineBitpacking(_)
 2529 |         ));
 2530 | 
 2531 |         let decoded = decompress_i32_chunks(&compressed, &encoding);
 2532 |         assert_eq!(decoded, expected);
 2533 |     }
 2534 | 
 2535 |     fn decompress_i32_chunks(
 2536 |         compressed: &MiniBlockCompressed,
 2537 |         encoding: &CompressiveEncoding,
 2538 |     ) -> Vec<i32> {
 2539 |         let strategy = DefaultDecompressionStrategy::default();
 2540 |         let decompressor = strategy
 2541 |             .create_miniblock_decompressor(encoding, &strategy)
 2542 |             .unwrap();
 2543 |         let mut offsets = vec![0usize; compressed.data.len()];
 2544 |         let mut values_processed = 0u64;
 2545 |         let mut decoded_values = Vec::new();
 2546 | 
 2547 |         for chunk in &compressed.chunks {
 2548 |             let chunk_values = chunk.num_values(values_processed, compressed.num_values);
 2549 |             let mut chunk_buffers = Vec::with_capacity(chunk.buffer_sizes.len());
 2550 |             for (idx, size) in chunk.buffer_sizes.iter().enumerate() {
 2551 |                 let size = *size as usize;
 2552 |                 chunk_buffers.push(compressed.data[idx].slice_with_length(offsets[idx], size));
 2553 |                 offsets[idx] += size;
 2554 |             }
 2555 | 
 2556 |             let decoded = decompressor
 2557 |                 .decompress(chunk_buffers, chunk_values)
 2558 |                 .unwrap();
 2559 |             match decoded {
 2560 |                 DataBlock::FixedWidth(block) => {
 2561 |                     let values = block.data.borrow_to_typed_slice::<i32>();
 2562 |                     decoded_values.extend_from_slice(values.as_ref());
 2563 |                 }
 2564 |                 _ => panic!("Expected FixedWidth block"),
 2565 |             }
 2566 |             values_processed += chunk_values;
 2567 |         }
 2568 | 
 2569 |         assert_eq!(values_processed, compressed.num_values);
 2570 |         decoded_values
 2571 |     }
 2572 | 
 2573 |     #[cfg(feature = "bitpacking")]
 2574 |     fn monotonic_runs(num_runs: usize, run_length: usize) -> Vec<i32> {
 2575 |         let mut values = Vec::with_capacity(num_runs * run_length);
 2576 |         for run in 0..num_runs {
 2577 |             values.extend(std::iter::repeat_n(run as i32, run_length));
 2578 |         }
 2579 |         values
 2580 |     }
 2581 | 
 2582 |     #[cfg(feature = "bitpacking")]
 2583 |     fn high_entropy_runs(num_runs: usize, run_length: usize) -> Vec<i32> {
 2584 |         let mut values = Vec::with_capacity(num_runs * run_length);
 2585 |         let mut state = 7u64;
 2586 |         for _ in 0..num_runs {
 2587 |             state = state
 2588 |                 .wrapping_mul(6364136223846793005)
 2589 |                 .wrapping_add(1442695040888963407);
 2590 |             values.extend(std::iter::repeat_n((state >> 32) as i32, run_length));
 2591 |         }
 2592 |         values
 2593 |     }
 2594 | 
 2595 |     #[test]
 2596 |     fn test_select_run_length_width_prefers_u16_for_long_runs() {
 2597 |         let mut entries = [0u64; 3];
 2598 |         accumulate_run_length_entries(300, Some(*MAX_MINIBLOCK_VALUES), &mut entries);
 2599 |         let (width, _) = select_run_length_width_from_entries(&entries, 32).unwrap();
 2600 |         assert_eq!(width, RunLengthWidth::U16);
 2601 |     }
 2602 | 
 2603 |     // ========== Round-trip Tests for Different Types ==========
 2604 | 
 2605 |     #[test]
 2606 |     fn test_round_trip_all_types() {
 2607 |         // Test u8
 2608 |         test_round_trip_helper(vec![42u8, 42, 42, 100, 100, 255, 255, 255, 255], 8);
 2609 | 
 2610 |         // Test u16
 2611 |         test_round_trip_helper(vec![1000u16, 1000, 2000, 2000, 2000, 3000], 16);
 2612 | 
 2613 |         // Test i32
 2614 |         test_round_trip_helper(vec![100i32, 100, 100, -200, -200, 300, 300, 300, 300], 32);
 2615 | 
 2616 |         // Test u64
 2617 |         test_round_trip_helper(vec![1_000_000_000u64; 5], 64);
 2618 |     }
 2619 | 
 2620 |     fn test_round_trip_helper<T>(data: Vec<T>, bits_per_value: u64)
 2621 |     where
 2622 |         T: bytemuck::Pod + PartialEq + std::fmt::Debug,
 2623 |     {
 2624 |         let encoder = RleEncoder::new();
 2625 |         let bytes: Vec<u8> = data
 2626 |             .iter()
 2627 |             .flat_map(|v| bytemuck::bytes_of(v))
 2628 |             .copied()
 2629 |             .collect();
 2630 | 
 2631 |         let block = DataBlock::FixedWidth(FixedWidthDataBlock {
 2632 |             bits_per_value,
 2633 |             data: LanceBuffer::from(bytes),
 2634 |             num_values: data.len() as u64,
 2635 |             block_info: BlockInfo::default(),
 2636 |         });
 2637 | 
 2638 |         let (compressed, _) = compress_miniblock(&encoder, block).unwrap();
 2639 |         let decompressor = RleDecompressor::new(bits_per_value);
 2640 |         let decompressed = MiniBlockDecompressor::decompress(
 2641 |             &decompressor,
 2642 |             compressed.data,
 2643 |             compressed.num_values,
 2644 |         )
 2645 |         .unwrap();
 2646 | 
 2647 |         match decompressed {
 2648 |             DataBlock::FixedWidth(ref block) => {
 2649 |                 // Verify the decompressed data length matches expected
 2650 |                 assert_eq!(block.data.len(), data.len() * std::mem::size_of::<T>());
 2651 |             }
 2652 |             _ => panic!("Expected FixedWidth block"),
 2653 |         }
 2654 |     }
 2655 | 
 2656 |     // ========== Chunk Boundary Tests ==========
 2657 | 
 2658 |     #[test]
 2659 |     fn test_power_of_two_chunking() {
 2660 |         let encoder = RleEncoder::new();
 2661 | 
 2662 |         // Create data that will require multiple chunks
 2663 |         let test_sizes = vec![1000, 2500, 5000, 10000];
 2664 | 
 2665 |         for size in test_sizes {
 2666 |             let data: Vec<i32> = (0..size)
 2667 |                 .map(|i| i / 50) // Create runs of 50
 2668 |                 .collect();
 2669 | 
 2670 |             let array = Int32Array::from(data);
 2671 |             let (compressed, _) =
 2672 |                 compress_miniblock(&encoder, DataBlock::from_array(array)).unwrap();
 2673 | 
 2674 |             // Verify all non-last chunks have power-of-2 values
 2675 |             for (i, chunk) in compressed.chunks.iter().enumerate() {
 2676 |                 if i < compressed.chunks.len() - 1 {
 2677 |                     assert!(chunk.log_num_values > 0);
 2678 |                     let chunk_values = 1u64 << chunk.log_num_values;
 2679 |                     assert!(chunk_values.is_power_of_two());
 2680 |                     assert!(chunk_values <= *MAX_MINIBLOCK_VALUES);
 2681 |                 } else {
 2682 |                     assert_eq!(chunk.log_num_values, 0);
 2683 |                 }
 2684 |             }
 2685 |         }
 2686 |     }
 2687 | 
 2688 |     #[rstest]
 2689 |     #[case::u8_lengths(RunLengthWidth::U8)]
 2690 |     #[case::u16_lengths(RunLengthWidth::U16)]
 2691 |     #[case::u32_lengths(RunLengthWidth::U32)]
 2692 |     fn test_miniblock_chunk_counts_match_encoded_runs(#[case] run_length_width: RunLengthWidth) {
 2693 |         // This pattern crosses the 2,048-value boundary in the middle of a two-value run.
 2694 |         let levels = (0..4098)
 2695 |             .map(|index| if index % 3 == 0 { 1u16 } else { 0u16 })
 2696 |             .collect::<Vec<_>>();
 2697 |         let num_values = levels.len() as u64;
 2698 |         let encoder = RleEncoder::with_run_length_width(run_length_width);
 2699 |         let (buffers, chunks) = encoder
 2700 |             .encode_data(
 2701 |                 &LanceBuffer::reinterpret_vec(levels),
 2702 |                 num_values,
 2703 |                 u16::BITS as u64,
 2704 |             )
 2705 |             .unwrap();
 2706 | 
 2707 |         assert_eq!(buffers.len(), 2);
 2708 |         let bytes_per_length = run_length_width.bytes_per_value();
 2709 |         let mut values_offset = 0usize;
 2710 |         let mut lengths_offset = 0usize;
 2711 |         let mut values_processed = 0u64;
 2712 | 
 2713 |         for chunk in &chunks {
 2714 |             let values_size = chunk.buffer_sizes[0] as usize;
 2715 |             let lengths_size = chunk.buffer_sizes[1] as usize;
 2716 |             let lengths_end = lengths_offset + lengths_size;
 2717 |             let chunk_lengths = &buffers[1].as_ref()[lengths_offset..lengths_end];
 2718 |             let length_chunks = chunk_lengths.chunks_exact(bytes_per_length);
 2719 |             assert!(length_chunks.remainder().is_empty());
 2720 |             let num_runs = length_chunks.len();
 2721 |             let encoded_values = length_chunks
 2722 |                 .map(|bytes| run_length_width.read_length(bytes))
 2723 |                 .sum::<u64>();
 2724 |             let declared_values = chunk.num_values(values_processed, num_values);
 2725 | 
 2726 |             assert_eq!(values_size, num_runs * size_of::<u16>());
 2727 |             assert_eq!(encoded_values, declared_values);
 2728 | 
 2729 |             values_offset += values_size;
 2730 |             lengths_offset = lengths_end;
 2731 |             values_processed += declared_values;
 2732 |         }
 2733 | 
 2734 |         assert_eq!(values_processed, num_values);
 2735 |         assert_eq!(values_offset, buffers[0].len());
 2736 |         assert_eq!(lengths_offset, buffers[1].len());
 2737 |     }
 2738 | 
 2739 |     // ========== Error Handling Tests ==========
 2740 | 
 2741 |     #[test]
 2742 |     fn test_encoder_rejects_zero_progress() {
 2743 |         let error = RleEncoder::new()
 2744 |             .encode_data(&LanceBuffer::empty(), 1, u16::BITS as u64)
 2745 |             .unwrap_err();
 2746 | 
 2747 |         assert!(
 2748 |             matches!(&error, Error::Internal { .. }),
 2749 |             "expected internal error, got: {error:?}"
 2750 |         );
 2751 |         assert!(error.to_string().contains("made no progress"));
 2752 |         assert!(error.to_string().contains("values_remaining=1"));
 2753 |     }
 2754 | 
 2755 |     #[test]
 2756 |     fn test_invalid_buffer_count() {
 2757 |         let decompressor = RleDecompressor::new(32);
 2758 |         let result = MiniBlockDecompressor::decompress(
 2759 |             &decompressor,
 2760 |             vec![LanceBuffer::from(vec![1, 2, 3, 4])],
 2761 |             10,
 2762 |         );
 2763 |         assert!(result.is_err());
 2764 |         assert!(
 2765 |             result
 2766 |                 .unwrap_err()
 2767 |                 .to_string()
 2768 |                 .contains("expects exactly 2 buffers")
 2769 |         );
 2770 |     }
 2771 | 
 2772 |     #[test]
 2773 |     fn test_buffer_consistency() {
 2774 |         let decompressor = RleDecompressor::new(32);
 2775 |         let values = LanceBuffer::from(vec![1, 0, 0, 0]); // 1 i32 value
 2776 |         let lengths = LanceBuffer::from(vec![5, 10]); // 2 lengths - mismatch!
 2777 |         let result = MiniBlockDecompressor::decompress(&decompressor, vec![values, lengths], 15);
 2778 |         assert!(result.is_err());
 2779 |         assert!(
 2780 |             result
 2781 |                 .unwrap_err()
 2782 |                 .to_string()
 2783 |                 .contains("Inconsistent RLE buffers")
 2784 |         );
 2785 |     }
 2786 | 
 2787 |     #[test]
 2788 |     fn test_u16_length_buffer_must_be_aligned() {
 2789 |         let decompressor = RleDecompressor::with_run_length_width(32, RunLengthWidth::U16);
 2790 |         let values = LanceBuffer::from(vec![1, 0, 0, 0]);
 2791 |         let lengths = LanceBuffer::from(vec![5]);
 2792 |         let result = MiniBlockDecompressor::decompress(&decompressor, vec![values, lengths], 5);
 2793 |         assert!(matches!(&result, Err(Error::InvalidInput { .. })));
 2794 |         assert!(
 2795 |             result
 2796 |                 .unwrap_err()
 2797 |                 .to_string()
 2798 |                 .contains("not divisible by 2")
 2799 |         );
 2800 |     }
 2801 | 
 2802 |     #[test]
 2803 |     fn test_rle_rejects_underflow_and_zero_lengths_and_clamps_overflow() {
 2804 |         let decompressor = RleDecompressor::with_run_length_width(32, RunLengthWidth::U16);
 2805 |         let value = LanceBuffer::from(1i32.to_le_bytes().to_vec());
 2806 | 
 2807 |         let underflow = MiniBlockDecompressor::decompress(
 2808 |             &decompressor,
 2809 |             vec![
 2810 |                 value.clone(),
 2811 |                 LanceBuffer::from(4u16.to_le_bytes().to_vec()),
 2812 |             ],
 2813 |             5,
 2814 |         )
 2815 |         .unwrap_err();
 2816 |         assert!(underflow.to_string().contains("produced 4 values"));
 2817 | 
 2818 |         let overflow = MiniBlockDecompressor::decompress(
 2819 |             &decompressor,
 2820 |             vec![
 2821 |                 value.clone(),
 2822 |                 LanceBuffer::from(6u16.to_le_bytes().to_vec()),
 2823 |             ],
 2824 |             5,
 2825 |         )
 2826 |         .unwrap();
 2827 |         match overflow {
 2828 |             DataBlock::FixedWidth(block) => {
 2829 |                 assert_eq!(block.num_values, 5);
 2830 |                 let decoded = block.data.borrow_to_typed_slice::<i32>();
 2831 |                 assert_eq!(decoded.as_ref(), &[1i32; 5]);
 2832 |             }
 2833 |             _ => panic!("Expected FixedWidth block"),
 2834 |         }
 2835 | 
 2836 |         let zero = MiniBlockDecompressor::decompress(
 2837 |             &decompressor,
 2838 |             vec![value, LanceBuffer::from(0u16.to_le_bytes().to_vec())],
 2839 |             5,
 2840 |         )
 2841 |         .unwrap_err();
 2842 |         assert!(zero.to_string().contains("zero run length"));
 2843 |     }
 2844 | 
 2845 |     #[test]
 2846 |     fn test_block_rle_rejects_overflow() {
 2847 |         // Block payloads have no chunk boundaries, so run lengths summing past
 2848 |         // num_values can only be corruption and must stay a hard error.
 2849 |         let decompressor = RleDecompressor::with_run_length_width(32, RunLengthWidth::U16);
 2850 |         let values = 1i32.to_le_bytes();
 2851 |         let lengths = 6u16.to_le_bytes();
 2852 |         let mut payload = Vec::new();
 2853 |         payload.extend_from_slice(&(values.len() as u64).to_le_bytes());
 2854 |         payload.extend_from_slice(&values);
 2855 |         payload.extend_from_slice(&lengths);
 2856 | 
 2857 |         let error =
 2858 |             BlockDecompressor::decompress(&decompressor, Some(LanceBuffer::from(payload)), 5)
 2859 |                 .unwrap_err();
 2860 |         assert!(matches!(&error, Error::InvalidInput { .. }));
 2861 |         assert!(
 2862 |             error
 2863 |                 .to_string()
 2864 |                 .contains("overflowed expected value count")
 2865 |         );
 2866 |     }
 2867 | 
 2868 |     #[test]
 2869 |     fn test_rle_truncates_legacy_chunk_boundary_overflow() {
 2870 |         // Legacy encoders emitted chunks declaring 2048 values whose final run crossed
 2871 |         // the checkpoint boundary (e.g. run lengths summing to 2080); the excess values
 2872 |         // are duplicated at the start of the next chunk and must be ignored here.
 2873 |         let decompressor = RleDecompressor::with_run_length_width(32, RunLengthWidth::U16);
 2874 |         let mut values = Vec::new();
 2875 |         values.extend_from_slice(&7i32.to_le_bytes());
 2876 |         values.extend_from_slice(&8i32.to_le_bytes());
 2877 |         let mut lengths = Vec::new();
 2878 |         lengths.extend_from_slice(&2000u16.to_le_bytes());
 2879 |         lengths.extend_from_slice(&80u16.to_le_bytes());
 2880 | 
 2881 |         let decoded = MiniBlockDecompressor::decompress(
 2882 |             &decompressor,
 2883 |             vec![LanceBuffer::from(values), LanceBuffer::from(lengths)],
 2884 |             2048,
 2885 |         )
 2886 |         .unwrap();
 2887 |         match decoded {
 2888 |             DataBlock::FixedWidth(block) => {
 2889 |                 assert_eq!(block.num_values, 2048);
 2890 |                 let decoded = block.data.borrow_to_typed_slice::<i32>();
 2891 |                 let decoded = decoded.as_ref();
 2892 |                 assert_eq!(decoded.len(), 2048);
 2893 |                 assert!(decoded[..2000].iter().all(|&v| v == 7));
 2894 |                 assert!(decoded[2000..].iter().all(|&v| v == 8));
 2895 |             }
 2896 |             _ => panic!("Expected FixedWidth block"),
 2897 |         }
 2898 |     }
 2899 | 
 2900 |     #[test]
 2901 |     fn test_empty_data_handling() {
 2902 |         let encoder = RleEncoder::new();
 2903 | 
 2904 |         // Test empty block
 2905 |         let empty_block = DataBlock::FixedWidth(FixedWidthDataBlock {
 2906 |             bits_per_value: 32,
 2907 |             data: LanceBuffer::from(vec![]),
 2908 |             num_values: 0,
 2909 |             block_info: BlockInfo::default(),
 2910 |         });
 2911 | 
 2912 |         let (compressed, _) = compress_miniblock(&encoder, empty_block).unwrap();
 2913 |         assert_eq!(compressed.num_values, 0);
 2914 |         assert!(compressed.data.is_empty());
 2915 | 
 2916 |         // Test decompression of empty data
 2917 |         let decompressor = RleDecompressor::new(32);
 2918 |         let decompressed = MiniBlockDecompressor::decompress(&decompressor, vec![], 0).unwrap();
 2919 | 
 2920 |         match decompressed {
 2921 |             DataBlock::FixedWidth(ref block) => {
 2922 |                 assert_eq!(block.num_values, 0);
 2923 |                 assert_eq!(block.data.len(), 0);
 2924 |             }
 2925 |             _ => panic!("Expected FixedWidth block"),
 2926 |         }
 2927 |     }
 2928 | 
 2929 |     // ========== Integration Test ==========
 2930 | 
 2931 |     #[test]
 2932 |     fn test_multi_chunk_round_trip() {
 2933 |         let encoder = RleEncoder::new();
 2934 | 
 2935 |         // Create data that spans multiple chunks with mixed patterns
 2936 |         let mut data = Vec::new();
 2937 | 
 2938 |         // High compression section
 2939 |         data.extend(vec![999i32; 2000]);
 2940 |         // Low compression section
 2941 |         data.extend(0..1000);
 2942 |         // Another high compression section
 2943 |         data.extend(vec![777i32; 2000]);
 2944 | 
 2945 |         let array = Int32Array::from(data.clone());
 2946 |         let (compressed, _) = compress_miniblock(&encoder, DataBlock::from_array(array)).unwrap();
 2947 | 
 2948 |         // Manually decompress all chunks
 2949 |         let mut reconstructed = Vec::new();
 2950 |         let mut values_offset = 0usize;
 2951 |         let mut lengths_offset = 0usize;
 2952 |         let mut values_processed = 0u64;
 2953 | 
 2954 |         // We now have exactly 2 global buffers
 2955 |         assert_eq!(compressed.data.len(), 2);
 2956 |         let global_values = &compressed.data[0];
 2957 |         let global_lengths = &compressed.data[1];
 2958 | 
 2959 |         for chunk in &compressed.chunks {
 2960 |             let chunk_values = if chunk.log_num_values > 0 {
 2961 |                 1u64 << chunk.log_num_values
 2962 |             } else {
 2963 |                 compressed.num_values - values_processed
 2964 |             };
 2965 | 
 2966 |             // Extract chunk buffers from global buffers using buffer_sizes
 2967 |             let values_size = chunk.buffer_sizes[0] as usize;
 2968 |             let lengths_size = chunk.buffer_sizes[1] as usize;
 2969 | 
 2970 |             let chunk_values_buffer = global_values.slice_with_length(values_offset, values_size);
 2971 |             let chunk_lengths_buffer =
 2972 |                 global_lengths.slice_with_length(lengths_offset, lengths_size);
 2973 | 
 2974 |             let decompressor = RleDecompressor::new(32);
 2975 |             let chunk_data = MiniBlockDecompressor::decompress(
 2976 |                 &decompressor,
 2977 |                 vec![chunk_values_buffer, chunk_lengths_buffer],
 2978 |                 chunk_values,
 2979 |             )
 2980 |             .unwrap();
 2981 | 
 2982 |             values_offset += values_size;
 2983 |             lengths_offset += lengths_size;
 2984 |             values_processed += chunk_values;
 2985 | 
 2986 |             match chunk_data {
 2987 |                 DataBlock::FixedWidth(ref block) => {
 2988 |                     let values: &[i32] = bytemuck::cast_slice(block.data.as_ref());
 2989 |                     reconstructed.extend_from_slice(values);
 2990 |                 }
 2991 |                 _ => panic!("Expected FixedWidth block"),
 2992 |             }
 2993 |         }
 2994 | 
 2995 |         assert_eq!(reconstructed, data);
 2996 |     }
 2997 | 
 2998 |     #[test]
 2999 |     fn test_1024_boundary_conditions() {
 3000 |         // Comprehensive test for various boundary conditions at 1024 values
 3001 |         // This consolidates multiple bug tests that were previously separate
 3002 |         let encoder = RleEncoder::new();
 3003 |         let decompressor = RleDecompressor::new(32);
 3004 | 
 3005 |         let test_cases = [
 3006 |             ("runs_of_2", {
 3007 |                 let mut data = Vec::new();
 3008 |                 for i in 0..512 {
 3009 |                     data.push(i);
 3010 |                     data.push(i);
 3011 |                 }
 3012 |                 data
 3013 |             }),
 3014 |             ("single_run_1024", vec![42i32; 1024]),
 3015 |             ("alternating_values", {
 3016 |                 let mut data = Vec::new();
 3017 |                 for i in 0..1024 {
 3018 |                     data.push(i % 2);
 3019 |                 }
 3020 |                 data
 3021 |             }),
 3022 |             ("run_boundary_255s", {
 3023 |                 let mut data = Vec::new();
 3024 |                 data.extend(vec![1i32; 255]);
 3025 |                 data.extend(vec![2i32; 255]);
 3026 |                 data.extend(vec![3i32; 255]);
 3027 |                 data.extend(vec![4i32; 255]);
 3028 |                 data.extend(vec![5i32; 4]);
 3029 |                 data
 3030 |             }),
 3031 |             ("unique_values_1024", (0..1024).collect::<Vec<_>>()),
 3032 |             ("unique_plus_duplicate", {
 3033 |                 // 1023 unique values followed by one duplicate (regression test)
 3034 |                 let mut data = Vec::new();
 3035 |                 for i in 0..1023 {
 3036 |                     data.push(i);
 3037 |                 }
 3038 |                 data.push(1022i32); // Last value same as second-to-last
 3039 |                 data
 3040 |             }),
 3041 |             ("bug_4092_pattern", {
 3042 |                 // Test exact scenario that produces 4092 bytes instead of 4096
 3043 |                 let mut data = Vec::new();
 3044 |                 for i in 0..1022 {
 3045 |                     data.push(i);
 3046 |                 }
 3047 |                 data.push(999999i32);
 3048 |                 data.push(999999i32);
 3049 |                 data
 3050 |             }),
 3051 |         ];
 3052 | 
 3053 |         for (test_name, data) in test_cases.iter() {
 3054 |             assert_eq!(data.len(), 1024, "Test case {} has wrong length", test_name);
 3055 | 
 3056 |             // Compress the data
 3057 |             let array = Int32Array::from(data.clone());
 3058 |             let (compressed, _) =
 3059 |                 compress_miniblock(&encoder, DataBlock::from_array(array)).unwrap();
 3060 | 
 3061 |             // Decompress and verify
 3062 |             match MiniBlockDecompressor::decompress(
 3063 |                 &decompressor,
 3064 |                 compressed.data,
 3065 |                 compressed.num_values,
 3066 |             ) {
 3067 |                 Ok(decompressed) => match decompressed {
 3068 |                     DataBlock::FixedWidth(ref block) => {
 3069 |                         let values: &[i32] = bytemuck::cast_slice(block.data.as_ref());
 3070 |                         assert_eq!(
 3071 |                             values.len(),
 3072 |                             1024,
 3073 |                             "Test case {} got {} values, expected 1024",
 3074 |                             test_name,
 3075 |                             values.len()
 3076 |                         );
 3077 |                         assert_eq!(
 3078 |                             block.data.len(),
 3079 |                             4096,
 3080 |                             "Test case {} got {} bytes, expected 4096",
 3081 |                             test_name,
 3082 |                             block.data.len()
 3083 |                         );
 3084 |                         assert_eq!(values, &data[..], "Test case {} data mismatch", test_name);
 3085 |                     }
 3086 |                     _ => panic!("Test case {} expected FixedWidth block", test_name),
 3087 |                 },
 3088 |                 Err(e) => {
 3089 |                     if e.to_string().contains("4092") {
 3090 |                         panic!("Test case {} found bug 4092: {}", test_name, e);
 3091 |                     }
 3092 |                     panic!("Test case {} failed with error: {}", test_name, e);
 3093 |                 }
 3094 |             }
 3095 |         }
 3096 |     }
 3097 | 
 3098 |     #[test]
 3099 |     fn test_low_repetition_50pct_bug() {
 3100 |         // Test case that reproduces the 4092 bytes bug with low repetition (50%)
 3101 |         // This simulates the 1M benchmark case
 3102 |         let encoder = RleEncoder::new();
 3103 | 
 3104 |         // Create 1M values with low repetition (50% chance of change)
 3105 |         let num_values = 1_048_576; // 1M values
 3106 |         let mut data = Vec::with_capacity(num_values);
 3107 |         let mut value = 0i32;
 3108 |         let mut rng = 12345u64; // Simple deterministic RNG
 3109 | 
 3110 |         for _ in 0..num_values {
 3111 |             data.push(value);
 3112 |             // Simple LCG for deterministic randomness
 3113 |             rng = rng.wrapping_mul(1664525).wrapping_add(1013904223);
 3114 |             // 50% chance to increment value
 3115 |             if (rng >> 16) & 1 == 1 {
 3116 |                 value += 1;
 3117 |             }
 3118 |         }
 3119 | 
 3120 |         let bytes: Vec<u8> = data.iter().flat_map(|v| v.to_le_bytes()).collect();
 3121 | 
 3122 |         let block = DataBlock::FixedWidth(FixedWidthDataBlock {
 3123 |             bits_per_value: 32,
 3124 |             data: LanceBuffer::from(bytes),
 3125 |             num_values: num_values as u64,
 3126 |             block_info: BlockInfo::default(),
 3127 |         });
 3128 | 
 3129 |         let (compressed, _) = compress_miniblock(&encoder, block).unwrap();
 3130 | 
 3131 |         // Debug first few chunks
 3132 |         for (i, chunk) in compressed.chunks.iter().take(5).enumerate() {
 3133 |             let _chunk_values = if chunk.log_num_values > 0 {
 3134 |                 1 << chunk.log_num_values
 3135 |             } else {
 3136 |                 // Last chunk - calculate remaining
 3137 |                 let prev_total: usize = compressed.chunks[..i]
 3138 |                     .iter()
 3139 |                     .map(|c| 1usize << c.log_num_values)
 3140 |                     .sum();
 3141 |                 num_values - prev_total
 3142 |             };
 3143 |         }
 3144 | 
 3145 |         // Try to decompress
 3146 |         let decompressor = RleDecompressor::new(32);
 3147 |         match MiniBlockDecompressor::decompress(
 3148 |             &decompressor,
 3149 |             compressed.data,
 3150 |             compressed.num_values,
 3151 |         ) {
 3152 |             Ok(decompressed) => match decompressed {
 3153 |                 DataBlock::FixedWidth(ref block) => {
 3154 |                     assert_eq!(
 3155 |                         block.data.len(),
 3156 |                         num_values * 4,
 3157 |                         "Expected {} bytes but got {}",
 3158 |                         num_values * 4,
 3159 |                         block.data.len()
 3160 |                     );
 3161 |                 }
 3162 |                 _ => panic!("Expected FixedWidth block"),
 3163 |             },
 3164 |             Err(e) => {
 3165 |                 if e.to_string().contains("4092") {
 3166 |                     panic!("Bug reproduced! {}", e);
 3167 |                 } else {
 3168 |                     panic!("Unexpected error: {}", e);
 3169 |                 }
 3170 |             }
 3171 |         }
 3172 |     }
 3173 | 
 3174 |     // ========== Encoding Verification Tests ==========
 3175 | 
 3176 |     #[test_log::test(tokio::test)]
 3177 |     async fn test_rle_encoding_verification() {
 3178 |         use crate::testing::{TestCases, check_round_trip_encoding_of_data};
 3179 |         use arrow_array::{Array, Int32Array};
 3180 |         use lance_datagen::{ArrayGenerator, RowCount};
 3181 |         use std::collections::HashMap;
 3182 |         use std::sync::Arc;
 3183 | 
 3184 |         let test_cases = TestCases::default()
 3185 |             .with_expected_encoding("rle")
 3186 |             .with_structural_encodings();
 3187 | 
 3188 |         // Test both explicit metadata and automatic selection
 3189 |         // 1. Test with explicit RLE threshold metadata (also disable BSS)
 3190 |         let mut metadata_explicit = HashMap::new();
 3191 |         metadata_explicit.insert(
 3192 |             "lance-encoding:rle-threshold".to_string(),
 3193 |             "0.8".to_string(),
 3194 |         );
 3195 |         metadata_explicit.insert("lance-encoding:bss".to_string(), "off".to_string());
 3196 | 
 3197 |         let mut generator = RleDataGenerator::new(vec![
 3198 |             i32::MIN,
 3199 |             i32::MIN,
 3200 |             i32::MIN,
 3201 |             i32::MIN,
 3202 |             i32::MIN + 1,
 3203 |             i32::MIN + 1,
 3204 |             i32::MIN + 1,
 3205 |             i32::MIN + 1,
 3206 |             i32::MIN + 2,
 3207 |             i32::MIN + 2,
 3208 |             i32::MIN + 2,
 3209 |             i32::MIN + 2,
 3210 |         ]);
 3211 |         let data_explicit = generator.generate_default(RowCount::from(10000)).unwrap();
 3212 |         check_round_trip_encoding_of_data(vec![data_explicit], &test_cases, metadata_explicit)
 3213 |             .await;
 3214 | 
 3215 |         // 2. Test automatic RLE selection based on data characteristics
 3216 |         // 80% repetition should trigger RLE (> default 50% threshold).
 3217 |         //
 3218 |         // Use values with the high bit set so bitpacking can't shrink the values.
 3219 |         // Explicitly disable BSS to ensure RLE is tested
 3220 |         let mut metadata = HashMap::new();
 3221 |         metadata.insert("lance-encoding:bss".to_string(), "off".to_string());
 3222 | 
 3223 |         let mut values = vec![i32::MIN; 8000]; // 80% repetition
 3224 |         values.extend(
 3225 |             [
 3226 |                 i32::MIN + 1,
 3227 |                 i32::MIN + 2,
 3228 |                 i32::MIN + 3,
 3229 |                 i32::MIN + 4,
 3230 |                 i32::MIN + 5,
 3231 |             ]
 3232 |             .repeat(400),
 3233 |         ); // 20% variety
 3234 |         let arr = Arc::new(Int32Array::from(values)) as Arc<dyn Array>;
 3235 |         check_round_trip_encoding_of_data(vec![arr], &test_cases, metadata).await;
 3236 | 
 3237 |         #[cfg(any(feature = "lz4", feature = "zstd"))]
 3238 |         {
 3239 |             let mut metadata = HashMap::new();
 3240 |             metadata.insert(
 3241 |                 "lance-encoding:rle-threshold".to_string(),
 3242 |                 "0.8".to_string(),
 3243 |             );
 3244 |             metadata.insert("lance-encoding:bss".to_string(), "off".to_string());
 3245 |             metadata.insert(
 3246 |                 "lance-encoding:compression".to_string(),
 3247 |                 if cfg!(feature = "zstd") {
 3248 |                     "zstd".to_string()
 3249 |                 } else {
 3250 |                     "lz4".to_string()
 3251 |                 },
 3252 |             );
 3253 |             let mut values = Vec::with_capacity(2048 * 4);
 3254 |             for run in 0..2048 {
 3255 |                 values.extend(std::iter::repeat_n(i32::MIN + (run % 8), 4));
 3256 |             }
 3257 |             let arr = Arc::new(Int32Array::from(values)) as Arc<dyn Array>;
 3258 |             check_round_trip_encoding_of_data(vec![arr], &test_cases, metadata).await;
 3259 |         }
 3260 |     }
 3261 | 
 3262 |     /// Generator that produces repetitive patterns suitable for RLE
 3263 |     #[derive(Debug)]
 3264 |     struct RleDataGenerator {
 3265 |         pattern: Vec<i32>,
 3266 |         idx: usize,
 3267 |     }
 3268 | 
 3269 |     impl RleDataGenerator {
 3270 |         fn new(pattern: Vec<i32>) -> Self {
 3271 |             Self { pattern, idx: 0 }
 3272 |         }
 3273 |     }
 3274 | 
 3275 |     impl lance_datagen::ArrayGenerator for RleDataGenerator {
 3276 |         fn generate(
 3277 |             &mut self,
 3278 |             _length: lance_datagen::RowCount,
 3279 |             _rng: &mut rand_xoshiro::Xoshiro256PlusPlus,
 3280 |         ) -> std::result::Result<std::sync::Arc<dyn arrow_array::Array>, arrow_schema::ArrowError>
 3281 |         {
 3282 |             use arrow_array::Int32Array;
 3283 |             use std::sync::Arc;
 3284 | 
 3285 |             // Generate enough repetitive data to trigger RLE
 3286 |             let mut values = Vec::new();
 3287 |             for _ in 0..10000 {
 3288 |                 values.push(self.pattern[self.idx]);
 3289 |                 self.idx = (self.idx + 1) % self.pattern.len();
 3290 |             }
 3291 |             Ok(Arc::new(Int32Array::from(values)))
 3292 |         }
 3293 | 
 3294 |         fn data_type(&self) -> &arrow_schema::DataType {
 3295 |             &arrow_schema::DataType::Int32
 3296 |         }
 3297 | 
 3298 |         fn element_size_bytes(&self) -> Option<lance_datagen::ByteCount> {
 3299 |             Some(lance_datagen::ByteCount::from(4))
 3300 |         }
 3301 |     }
 3302 | 
 3303 |     // ========== Block Related tests ==========
 3304 |     #[test]
 3305 |     fn test_block_decompressor_rejects_overflowing_values_size() {
 3306 |         let decompressor = RleDecompressor::new(32);
 3307 | 
 3308 |         let mut data = Vec::new();
 3309 |         data.extend_from_slice(&u64::MAX.to_le_bytes());
 3310 |         let result = BlockDecompressor::decompress(&decompressor, Some(LanceBuffer::from(data)), 1);
 3311 |         assert!(result.is_err());
 3312 |         assert!(
 3313 |             result
 3314 |                 .unwrap_err()
 3315 |                 .to_string()
 3316 |                 .contains("Invalid RLE values buffer size")
 3317 |         );
 3318 |     }
 3319 | 
 3320 |     #[test]
 3321 |     fn test_block_decompressor_too_small() {
 3322 |         let decompressor = RleDecompressor::new(32);
 3323 |         let result = BlockDecompressor::decompress(
 3324 |             &decompressor,
 3325 |             Some(LanceBuffer::from(vec![1, 2, 3])),
 3326 |             10,
 3327 |         );
 3328 |         assert!(result.is_err());
 3329 |         assert!(
 3330 |             result
 3331 |                 .unwrap_err()
 3332 |                 .to_string()
 3333 |                 .contains("Insufficient data size: 3")
 3334 |         );
 3335 |     }
 3336 | 
 3337 |     #[test]
 3338 |     fn test_block_compressor_header_format() {
 3339 |         let encoder = RleEncoder::new();
 3340 | 
 3341 |         let data = vec![1i32, 1, 1];
 3342 |         let array = Int32Array::from(data);
 3343 |         let compressed = BlockCompressor::compress(&encoder, DataBlock::from_array(array))
 3344 |             .unwrap()
 3345 |             .0
 3346 |             .unwrap();
 3347 | 
 3348 |         // Verify header format: first 8 bytes should be values_size as u64
 3349 |         assert!(compressed.len() >= 8);
 3350 |         let values_size_bytes: [u8; 8] = compressed.as_ref()[..8].try_into().unwrap();
 3351 |         let values_size = u64::from_le_bytes(values_size_bytes);
 3352 | 
 3353 |         // Values buffer should contain 1 i32 value (4 bytes)
 3354 |         assert_eq!(values_size, 4);
 3355 | 
 3356 |         // Total size should be: 8 (header) + 4 (values) + 1 (lengths)
 3357 |         assert_eq!(compressed.len(), 13);
 3358 |     }
 3359 | 
 3360 |     #[test]
 3361 |     fn test_block_compressor_round_trip() {
 3362 |         let encoder = RleEncoder::new();
 3363 |         let decompressor = RleDecompressor::new(32);
 3364 | 
 3365 |         // Test basic pattern
 3366 |         let data = vec![1i32, 1, 1, 2, 2, 3, 3, 3, 3];
 3367 |         let array = Int32Array::from(data.clone());
 3368 |         let data_block = DataBlock::from_array(array);
 3369 | 
 3370 |         let compressed = BlockCompressor::compress(&encoder, data_block).unwrap().0;
 3371 |         let decompressed =
 3372 |             BlockDecompressor::decompress(&decompressor, compressed, data.len() as u64).unwrap();
 3373 | 
 3374 |         match decompressed {
 3375 |             DataBlock::FixedWidth(block) => {
 3376 |                 let values: &[i32] = bytemuck::cast_slice(block.data.as_ref());
 3377 |                 assert_eq!(values, &data[..]);
 3378 |             }
 3379 |             _ => panic!("Expected FixedWidth block"),
 3380 |         }
 3381 |     }
 3382 | 
 3383 |     #[test]
 3384 |     fn test_block_compressor_large_data() {
 3385 |         let encoder = RleEncoder::new();
 3386 |         let decompressor = RleDecompressor::new(32);
 3387 | 
 3388 |         // Create data that will span multiple chunks
 3389 |         // Each chunks can handle ~2048 values, so use 10K values
 3390 |         let mut data = Vec::new();
 3391 |         data.extend(vec![999i32; 3000]); // First ~2 chunks
 3392 |         data.extend(vec![777i32; 3000]); // Next ~2 chunks
 3393 |         data.extend(vec![555i32; 4000]); // Final ~2 chunks
 3394 | 
 3395 |         let total_values = data.len();
 3396 |         assert_eq!(total_values, 10000);
 3397 | 
 3398 |         let array = Int32Array::from(data.clone());
 3399 |         let compressed = BlockCompressor::compress(&encoder, DataBlock::from_array(array))
 3400 |             .unwrap()
 3401 |             .0;
 3402 |         let decompressed =
 3403 |             BlockDecompressor::decompress(&decompressor, compressed, total_values as u64).unwrap();
 3404 | 
 3405 |         match decompressed {
 3406 |             DataBlock::FixedWidth(block) => {
 3407 |                 let values: &[i32] = bytemuck::cast_slice(block.data.as_ref());
 3408 |                 assert_eq!(values.len(), total_values);
 3409 |                 assert_eq!(values, &data[..]);
 3410 |             }
 3411 |             _ => panic!("Expected FixedWidth block"),
 3412 |         }
 3413 |     }
 3414 | }
``````
