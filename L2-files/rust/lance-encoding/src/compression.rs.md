> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-encoding/src/compression.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `dd95b0d8d5f16ba6f68a1fa3051e27276e90732c1ec6dc7f8396f988af2ccf5a`. Reviewed physical lines: 1-2821.

[Module](../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Shared structural compression contracts, statistic-driven selection helpers, metadata parsing, decoder dispatch and 40 local test functions. Production version policy is composed outside this module. (rust/lance-encoding/src/compression.rs:1-2821)

## Complete range analysis

### Lines 1-18

SPDX/module docs describe structural compression after validity/offset shredding, transparent independent per-value access, opaque atomic mini-block chunks and whole-block compression with least random access. Documentation says2.1, but helpers are also composed by later version strategies. This module has no concrete default CompressionStrategy implementation or file-version argument. (rust/lance-encoding/src/compression.rs:1-18)

### Lines 19-74

Imports connect Arc, Arrow UInt64 statistics/DataType, Field, LanceBuffer, error helpers, compression parameters, miniblock/per-value interfaces, protobuf21, all physical codecs and FSST constants. InlineBitpacking/OutOfLineBitpacking imports alone are cfg(bitpacking); many other imports are unconditional. No async, IO, unsafe or local environment read in this file. (rust/lance-encoding/src/compression.rs:19-74)

### Lines 75-85

Private constants: default RLE threshold0.5, general block size32768 bytes, RLE block header size_of u64=8. Despite default-threshold naming/comment, the ratio check runs only when params.rle_threshold is Some; no0.5 rejection applies in automatic mode. Header cost is added to RLE block payload estimate, not mini estimate. (rust/lance-encoding/src/compression.rs:174-198; rust/lance-encoding/src/compression.rs:278-322) (rust/lance-encoding/src/compression.rs:75-85)

### Lines 86-105

Public BlockCompressor:Debug+Send+Sync requires compress(DataBlock)->Result<(Option<LanceBuffer>,CompressiveEncoding)>. None means metadata-only, while Some(empty) is an actual payload. Whole-block opaque/self-described contract is stated; trait itself enforces no metadata/count/shape invariant. (rust/lance-encoding/src/compression.rs:86-105)

### Lines 106-140

Public CompressionStrategy:Send+Sync+Debug requires block, per-value and mini-block factory methods accepting Field and borrowed DataBlock, returning boxed codecs. Selection can inspect initialized statistics. Comment describes mini chunks0..16KiB; this trait does not enforce size. Concrete version policies live in lance-file. (rust/lance-encoding/src/compression.rs:106-140)

### Lines 141-153

Crate-internal compress_required_block creates selected block compressor then compresses owned data. Propagates factory/codec errors and rejects None payload with Internal; Some(empty) accepted. It returns payload plus descriptor and performs no IO or additional count validation. (rust/lance-encoding/src/compression.rs:141-153)

### Lines 154-173

Private try_bss_for_mini_block refuses missing compression and exact none before considering BssMode(defaultAuto). If should_use_bss returns true, constructs ByteStreamSplitEncoder using bits cast to usize. It does not parse codec name: fsst or unknown non-none strings satisfy this initial prerequisite; downstream wrapping differs. (rust/lance-encoding/src/compression.rs:154-173)

### Lines 174-199

rle_is_applicable permits fixed widths8/16/32/64 only, expects scalar RunCount (panic if absent/type/shape invalid), and applies strict runs<num_values*threshold only when explicitly configured. No finite/range validation: NaN fails comparison, negative/zero normally reject, >1 allowed locally. Return logical raw bytes as u128 num_values*(bits/8), not physical buffer length. (rust/lance-encoding/src/compression.rs:174-199)

### Lines 200-219

rle_beats_raw_and_bitpacking requires encoded<raw; with bitpacking feature compares estimated inline bytes and rejects only when bitpacking strictly smaller. A tie with raw loses, a tie with bitpacking favors RLE. Unknown/unavailable bitpacking estimate adds no restriction. (rust/lance-encoding/src/compression.rs:200-219)

### Lines 220-234

Fixed-u8 mini RLE first applies width/ratio gate, estimates payload with MAX_MINIBLOCK_VALUES segmentation and U8 run lengths, suppresses estimator errors into None via ok?, and selects RleEncoder only if estimate beats raw/bitpacking. No actual trial compression here. (rust/lance-encoding/src/compression.rs:220-234)

### Lines 235-268

Child-aware mini RLE selects adaptive run width/estimated bytes and optional child compression config; constructs encoder with same config for values/lengths and child bitpacking enabled. Measure selected_payload_size only if child compression exists or bitpacking compiled AND initial estimate is >=raw or worse than estimated inline. Otherwise trust estimate. Measurement/estimator errors become None fallback. Final raw/bitpacking comparison repeats; selection may allocate/compress children then actual encode repeats work. (rust/lance-encoding/src/encodings/physical/rle.rs:1013-1039) (rust/lance-encoding/src/compression.rs:235-268)

### Lines 269-277

rle_child_compression_config returns None for missing/exact none/fsst. Other strings parse via case-sensitive CompressionScheme; unknown parse error silently becomes None here. Valid codec plus optional level retained, without invoking compressor feature validation in this helper. (rust/lance-encoding/src/encodings/physical/block.rs:124-138) (rust/lance-encoding/src/compression.rs:269-277)

### Lines 278-323

try_rle_for_block_with_width rechecks widths, requires initialized RunCount and optional strict explicit threshold, adds8-byte header with saturating u128 addition, requires total<logical raw size and rejects if block-bitpacking estimate strictly smaller. Creates raw-child RleEncoder with selected run width; tie with bitpacking favors RLE. Params compression/level/BSS are not used here. (rust/lance-encoding/src/compression.rs:278-323)

### Lines 324-345

Fixed-u8 and adaptive block wrappers return Ok(None) for unsupported widths, then estimate using no segment bound before invoking common ratio/size gate. Estimation errors propagate via Result, unlike mini selection. Adaptive chooses run width; fixed forcesU8. (rust/lance-encoding/src/compression.rs:324-345)

### Lines 346-371

Private estimate adapters pass actual LanceBuffer, declared count, fixed width and optional max segment to physical RLE estimators. Adaptive estimator chooses cheapest among8/16/32 run-length widths; equal cost retains earlier narrower width. Cost is entries*(value bytes+length bytes), without block header. Full entry collection and payload behavior are now covered in the physical RLE analysis. (rust/lance-encoding/src/encodings/physical/rle.rs:221-328; rust/lance-encoding/src/encodings/physical/rle.rs:385-1944) (rust/lance-encoding/src/encodings/physical/rle.rs:138-218) (rust/lance-encoding/src/compression.rs:346-371)

### Lines 372-386

Private mini bitpacking with feature enabled requires successful inline size estimate, which accepts only native widths, then returns InlineBitpacking. Feature disabled returnsNone. No statistical scan performed here beyond borrowed estimate inputs. (rust/lance-encoding/src/compression.rs:372-386)

### Lines 387-420

Feature-gated inline estimator rejects unsupported width or zero declared count. Expects UInt64 BitWidth array; for every statistic entry, counts one native header word plus floor(1024*maxbits/nativebits) words, sums/multiplies saturating u128, and requires estimate strictly smaller than actual physical data_size. Tail treated as padded1024. Converts total to u64 orNone; no validation of stat length/nulls/width range or physical/logical count consistency. (rust/lance-encoding/src/compression.rs:387-420)

### Lines 421-449

Private block bitpacking requires8/16/32/64 and initialized BitWidth, max unwrap panics for empty stats. max>=native skips. Single stat segment with min_size_bytes(max)>=actual data_size skips. Declared count<=1024 selects Inline, otherwise OutOfLine(max,native). Function and public wrapper are ungated despite references to cfg-imported types: no-bitpacking compile concern, not compiled here. (rust/lance-encoding/src/compression.rs:421-449)

### Lines 450-474

Feature-gated block bitpacking cost rejects unsupported widths/zero count, gets statistic max optionally (empty=>None), estimates inline padded1024+header for count<=1024 or out-of-line words otherwise, converts to bytes with saturation and requires strictly smaller physical data_size. Eligibility and estimate are separate logic; do not assume the private selection helper performs this exact full-cost check. (rust/lance-encoding/src/compression.rs:450-474)

### Lines 475-510

Feature-gated out-of-line word estimate checked-converts count/widths to usize, rejects compressed>=native, computes ceil(count/1024) chunks and ceil(1024*compressed/native) words/chunk. Whole chunks return product; a runt tail is padded/compressed only if padding-bit cost strictly less than saved bits, otherwise raw tail words. Tie uses raw tail. Some usize products remain unchecked; no positive-native-width guard for standalone helper. (rust/lance-encoding/src/compression.rs:475-510)

### Lines 511-525

maybe_wrap_general_for_mini_block leaves inner unchanged for missing/exact none/fsst. Other strings must parse, with Unknown compression scheme InvalidInput on failure. Wraps GeneralMiniBlockCompressor with chosen level; no trial ratio check and no local feature validation at construction. (rust/lance-encoding/src/compression.rs:511-525)

### Lines 526-554

try_general_compression returnsNone for exact none. Any other explicit scheme parses and uses CompressedBufferEncoder::try_new, propagating unsupported/config errors, returning codec and original config. Automatic selection occurs only if physical data_size>32768 (strict), using default encoder/config. Comment says currently unused but try_general_block below calls it. Default encoder prefers compiled zstd(level0), else lz4(levelNone), else none. (rust/lance-encoding/src/encodings/physical/block.rs:471-489) (rust/lance-encoding/src/compression.rs:526-554)

### Lines 555-587

Public field_metadata_params copies compression verbatim, parses i32 level/f64 RLE threshold with ok() silently ignoring malformed strings, parses BssMode with warning on invalid, and parses signed i64 minichunk with warning on invalid. Negative/zero chunk sizes and nonfinite/out-of-range f64 parse successfully; semantic checks not here. Defaults leave all fields None. No column/type merge or version filter here. (rust/lance-encoding/src/compression.rs:555-587)

### Lines 588-600

Public finalize_miniblock_compressor applies general wrapper only for direct FixedWidth; all other block kinds return selected codec unchanged. Variable-width helpers perform their own wrapping. Packed structs/fixed-size lists do not acquire a wrapper through this function. (rust/lance-encoding/src/compression.rs:588-600)

### Lines 601-619

Public try_uncompressed_fixed_width_miniblock picks raw ValueEncoder for directFixedWidth plus exactnone without reading stats. Public try_byte_stream_split_miniblock type-guards directFixedWidth then delegates BSS prerequisite/heuristic. Nonmatching kinds returnNone. (rust/lance-encoding/src/compression.rs:601-619)

### Lines 620-641

Public try_fixed_u8_rle_miniblock and try_child_rle_miniblock are directFixedWidth guards around respective policies; former preserves original u8 raw-child grammar, latter adaptive width and child selection. They do not accept nullable/list/struct wrappers as fixed data. Version gating belongs to callers. (rust/lance-encoding/src/compression.rs:620-641)

### Lines 642-655

Public try_bitpacking_miniblock directFixedWidth delegates optional feature-gated choice; public try_raw_fixed_width_miniblock returns rawValueEncoder for direct fixed only, no stat or parameter checks. (rust/lance-encoding/src/compression.rs:642-655)

### Lines 656-698

Public try_variable_width_miniblock returnsOk(None) for other kinds, rejects offset width except32/64, then reads DataSize and MaxLength before exactnone raw shortcut. FSST selected if explicitfsst OR missing compression and non-Binary/non-LargeBinary field and max length>=FSST minimum and data size>=FSST minimum. Choose FSST or BinaryMini(minichunk). Explicit non-fsst/non-none scheme parses and wraps GeneralMini; no automatic general wrapper. Explicit zstd/lz4 bypass autoFSST. Invalid strings error; absent stats panic even withnone. (rust/lance-encoding/src/compression.rs:656-698)

### Lines 699-725

Public fixed-packed mini helper accepts Struct only, rejects has_variable_width_child (any direct non-FixedWidth child) withInvalidInput, otherwise FixedMini. Empty struct passes this gate and fails deeper encoder assumptions. Raw fixed-size-list mini helper usesValueEncoder. Raw per-value acceptsFixedWidth orFixedSizeList only. (rust/lance-encoding/src/data.rs:1037-1041; rust/lance-encoding/src/encodings/physical/packed.rs:40-68) (rust/lance-encoding/src/compression.rs:699-725)

### Lines 726-738

Private validate_packed_struct returnsNone for nonStruct, rejects child count differing from schema field children, then reports has_variable_width_child. Does not check nonempty children, row counts, actual schema type agreement, validity or buffers. Deeper packed encoders validate additional invariants. (rust/lance-encoding/src/compression.rs:726-738)

### Lines 739-756

Public reject_packed_struct_per_value uses that validation. Variable child returnsNotSupported with file-format message; fixed-only returnsInvalidInput saying per-value should not be used. For nonstruct returnsOk(None). No version argument; productionV2.1 selects this helper. (rust/lance-file/src/versions/v2_1/compression.rs:85-104) (rust/lance-encoding/src/compression.rs:739-756)

### Lines 757-776

Public try_variable_packed_struct_per_value validates and returnsNone nonstruct, errorsInvalidInput for fixed-only, otherwise builds variable packed encoder from injected Arc strategy and cloned field children. ProductionV2.2 uses this; decoder support does not imply writers select it in every version. (rust/lance-file/src/versions/v2_2/compression.rs:77-99) (rust/lance-encoding/src/compression.rs:757-776)

### Lines 777-798

Public try_packed_struct_per_value supports either variable or fixed-only Struct after count validation; clones children and retains strategy only for variable encoder. ProductionV2.3 and test StructuralU32 use this general helper, so test mode differs from productionV2.2 fixed-packed restriction. (rust/lance-file/src/versions/v2_3/compression.rs:77-99; rust/lance-encoding/src/testing.rs:162-181) (rust/lance-encoding/src/compression.rs:777-798)

### Lines 799-823

Public variable per-value returnsNone nonvariable and rawVariableEncoder immediately for exactnone, before stat/offset validation. Otherwise reads MaxLength/DataSize. If (max_length>32768 OR any explicit nonfsst scheme) AND size>=32768, returns exactzstd with configuredlevel via try_new, or defaultCompressedBufferEncoder for every other case. Thus explicitlz4/unknown can select defaultcodec; explicitfsst with sufficiently large max length can be superseded. This branch bypasses offset-width validation. (rust/lance-encoding/src/compression.rs:799-823)

### Lines 824-842

Remaining variable per-value path validates offsets32/64 and buildsrawVariableEncoder. FSST only explicitfsst or automaticmissingcompression with nonbinary field and max/data thresholds; else raw. Consequently explicit general requests on payloads smaller than32768 fall back raw without parsing, including unknown names; configured levels affect only exactzstd large branch. Default encoder choice is feature-dependent, not alwayszstd. (rust/lance-encoding/src/encodings/physical/block.rs:471-489) (rust/lance-encoding/src/compression.rs:824-842)

### Lines 843-871

Public fixed-u8/adaptive RLE block wrappers type-guardFixedWidth and propagate Result; public bitpacking block type-guards and calls ungated helper. No version or compression=none bypass inside these entry points. Version strategy ordering determines whether they run. (rust/lance-encoding/src/compression.rs:843-871)

### Lines 872-895

Public try_general_block drops config half of private return while boxedencoder retains it. Public try_raw_block supports FixedWidth->ValueEncoder and VariableWidth->VariableEncoder only; unlike rawpervalue it does not acceptFixedSizeList. NonmatchingkindNone. (rust/lance-encoding/src/compression.rs:872-895)

### Lines 896-909

Public MiniBlockDecompressor:Debug+Send+Sync requires decompress(&self, data: Vec<LanceBuffer>, num_values: u64) -> Result<DataBlock>. Optional decoded_size_bytes defaultsNone; documentation requires exact aggregate data_size for a single FixedWidth allocation and says multibuffer/layout-dependent outputs shouldNone. This is a contract, not enforced by trait. (rust/lance-encoding/src/compression.rs:896-909)

### Lines 910-933

Public FixedPerValueDecompressor requires decompress(&self, data: FixedWidthDataBlock, num_values: u64) -> Result<DataBlock> and bits_per_value, with exact optional decoded_size defaultNone; comment requires byte-multiplewidth but trait has no check. Public VariablePerValueDecompressor requires decompress(&self, data: VariableWidthBlock) -> Result<DataBlock>, with no separatecount orsize estimator. All requireDebug+Send+Sync. (rust/lance-encoding/src/compression.rs:910-933)

### Lines 934-950

Public BlockDecompressor requires decompress(&self, data: Option<LanceBuffer>, num_values: u64) -> Result<DataBlock>. requires_payload defaulttrue; infer_num_values(payload) defaultsOk(None), documented to avoid materializing decoded payload. These hooks support metadata-only and recoverable-count child codecs; no automatic enforcement at trait level. (rust/lance-encoding/src/compression.rs:934-950)

### Lines 951-961

Crate-internal require_block_payload rejectsNone asInvalidInput namingcodec, acceptsSomeempty. require_no_block_payload rejects everySome includingempty with metadata-only message, acceptsNone. They distinguish payload presence from byte length. (rust/lance-encoding/src/compression.rs:951-961)

### Lines 962-987

Public DecompressionStrategy requires mini,fixedpervalue,variablepervalue,block factories. Mini receives an extra dyn DecompressionStrategy for nested dispatch; other methods onlyself. Public empty DefaultDecompressionStrategy derivesDebug/Default; no state/cache/config/version fields. (rust/lance-encoding/src/compression.rs:962-987)

### Lines 988-1030

Default mini factory unwraps outer compression (missing panics). Flat->ValueDecompressor. Inline bitpacking uses feature if enabled elseNotSupported. Variable unwraps offsets descriptor/inner compression, requiresFlat orpanics, casts bits to u8 before BinaryMini constructor validation; values subdescriptor ignored here. FSST recursively invokes suppliedstrategy for nestedvalues then wraps table. (rust/lance-encoding/src/compression.rs:988-1030)

### Lines 1031-1079

Default mini supports FixedPacked, rejectsVariablePacked asNotSupported, handlesFSL fallibly, buildsRLE using suppliedstrategy and BSS only with nestedFlat (unwrap/panic; castswidth). General requires values/configInvalidInput, recurses through self mini factory while passing suppliedstrategy onward, converts scheme/level and wraps GeneralMini. Other tags todo! panic, includingConstant/Dictionary/OutOfLine. No version/recursion-depth gate. (rust/lance-encoding/src/compression.rs:1031-1079)

### Lines 1080-1100

Default fixed per-value supportsConstant(optionalbytes copied to LanceBuffer alignment1),Flat,FSL andPackedStructFixed. Missing outer descriptor unwraps, unsupported tags todo! panic withdebug. No generic General/FSST/RLE fixed per-value support. (rust/lance-encoding/src/compression.rs:1080-1100)

### Lines 1101-1126

Default variable per-value Variable unwraps offsetsFlat, asserts width<255 rather than validating32/64, then returns passthroughVariableDecoder; valuesdescriptor ignored. FSST wraps cloned symbol table around hardcodedVariableDecoder, ignoring nestedFSSTvalues. General requires compressionconfig and chooses CompressedBufferEncoder::from_scheme, ignoring descriptorvalues andlevel for read. (rust/lance-encoding/src/compression.rs:1101-1126)

### Lines 1127-1170

VariablePacked variable factory loops descriptors requiring values andlayout, recursively uses self fixed/variable factory per BitsPerValue/BitsPerLength, retains configuredwidth and Arc decoder, then creates packedvariable decoder. No nonempty/layout-width agreement/recursion-depth validation here. Unsupportedtags todo! panic. Child factory errors propagate. (rust/lance-encoding/src/compression.rs:1127-1170)

### Lines 1171-1237

Blockfactory supportsInline,Flat,Constant,Variable(header-drivenBinaryBlock),FSL,OutOfLine,General,RLE. OutOfLine requires nestedFlat but unwraps missingvalue/compression, uses compressedinnerwidth anduncompressedouterwidth. General requires values/config, recurses selfblock, convertsconfig and invokes fallibleGeneralBlockconstructor. Others todo! panic. Inline/OutOfLine arms reference cfg-imported types without cfg; no-feature build remains unverified. Variabledescriptorcontents unused. (rust/lance-encoding/src/compression.rs:1171-1237)

### Lines 1238-1290

Crate-internal create_rle_decompressor requires values/run_lengths descriptors, constructs both child readers before width/dependency checks, requires valuebits8/16/32/64 and run-lengthbits8/16/32, and rejects both children requiringnum_values because neither could infer run count. Bothidentity ->rawRleDecompressor; otherwise child-aware. Errors InvalidInput with contextual widths/roles; errors from childfactory propagate first. (rust/lance-encoding/src/compression.rs:1238-1290)

### Lines 1291-1313

Private create_rle_child_decompressor requires compression, validates grammar to(bits,requirescount,needsdecoder), uses suppliedstrategy.create_block_decompressor only for nonflatchildren, else buildsidentityflat. Flat child descriptor optionaldata compression is not inspected by thisvalidator. (rust/lance-encoding/src/compression.rs:1291-1313)

### Lines 1314-1362

RLE child grammar acceptsFlat(bits,false,false),General(config required,values and innercompression required) with allowedinner checked below, andOutOfLine with mandatory nestedFlat. OutOfLine requires external run count and returns uncompressedwidth; General needsblockdecoder and inherits innercountneed. Othertags includingInline rejected with named InvalidInput. Flatcompressedwidth/optionaldata not validated here. (rust/lance-encoding/src/compression.rs:1314-1362)

### Lines 1363-1390

General RLE inner grammar permits onlyFlat (count-independent) orOutOfLine->Flat (count-dependent). NestedGeneral/RLE/Inline/Constant/etc rejected. Custom strategy cannot bypass this syntactic gate. Width validity checked by outerRLE after child construction; no versioncapability check. (rust/lance-encoding/src/compression.rs:1363-1390)

### Lines 1391-1408

Private compression_name maps all13 protobuf compression variants to stable human-readable labels for errors: flat,variable,fsst,out-of-line bitpacking,inline bitpacking,general,constant,dictionary,byte stream split,packed struct,fixed-size list,variable packed struct,rle. No payload/descriptor introspection. (rust/lance-encoding/src/compression.rs:1391-1408)

### Lines 1409-1449

cfg(test) module importsHashMap,Arc,Arrowfields,parameters,physicalBssMode/ComputeStat/TestEncoding/extractchain. Helpers strategy delegates toTestEncoding; baseline alwaysStructuralU16; selected_block_codec creates/compressesclone and returnscodec+descriptor discardingpayload; context is new(0,true,true) regardlessmode; testfield nullabletrue/id=-1. None are runtime evidence. (rust/lance-encoding/src/compression.rs:1409-1449)

### Lines 1450-1490

Fixed-run fixture allocates count*floor(width/8), sets values_per_run=max(count/run_count,1), increments byte by17 everygroup and writes byte+j per word; computes realstats. run_count0 dividesbyzero; requestedrun_count can differ from realized transitions due integerdivision. No manualstat injection despite helpername/comment. (rust/lance-encoding/src/compression.rs:1450-1490)

### Lines 1491-1549

Ordinary fixedfixture zeroallocates and writes only first byte i%256 pervalue, leaves higherbyteszero, computesstats. rle_run_length_bits unwraps directRLE/runlengthFlat; expect_rle_encoding acceptsdirectRLE oroneGeneralwrapper containingRLE and panicsotherwise. Not recursive arbitrarywrapper support. (rust/lance-encoding/src/compression.rs:1491-1549)

### Lines 1550-1614

Variablefixture creates offsets from varying lengths: avg0->1, else max(avg+i%8-4,1) capped2*avg. Fills everybyte with rowindex+j wrapping, casts offsets to signed32 or keeps64, unsupportedwidthpanics; initializesstats. Capacity/casts unchecked. FSSTcandidate is4096values,width32,average FSSTleastmax+16. No actual NULL payload despite nullablefieldmetadata. (rust/lance-encoding/src/compression.rs:1550-1614)

### Lines 1615-1673

Two tests configure columnpattern *_id or typeInt32, disableBSS, set lowrunthreshold and lz4/zstd; fixture1000rows with100/50runs. AssertdebugGeneral+RLE orRLE respectively, not roundtrip or exactratio/codecbytes. baselineStructuralU16 policy. (rust/lance-encoding/src/compression.rs:1615-1673)

### Lines 1674-1716

Bitpacking-gated regression #6626 uses1024zeros then1024ones u16, assertsOutOfLine debug. Parameterized full-width rejection uses1600(runt) and2048(whole) signed64 -1values, asserts try_bitpacking_blockNone. Tests coverzero statsegment andfullbitwidthskip, no direct malformedstatcase. (rust/lance-encoding/src/compression.rs:1674-1716)

### Lines 1717-1771

Sparse RLE block header test uses two i32 repeated42, expectsrawValueEncoder/Flat since8-byteheader defeats savings. Bitpacking-gated sparse test uses2048u16 alternatingruns length2 and assertsOutOfLine selected/descriptor. Both create actualcompressed data but discardpayload; no decoding. (rust/lance-encoding/src/compression.rs:1717-1771)

### Lines 1772-1823

Bitpacking-gated mini test uses256u64,64runs each4 alternating3/4/5 and assertsInline, notRLE. check_uncompressed_encoding requires chain variable->flat oflength2 orflat length1; it examines descriptors, not payload equality. (rust/lance-encoding/src/compression.rs:1772-1823)

### Lines 1824-1866

test_none_compression configures embeddings columnnone and tests fixed32/1000 plus variable32/10 average32768 for bothmini andpervalue. Compresses and assertsraw descriptorchains only; no roundtrip/count/bytecomparison orwholeblockcase. (rust/lance-encoding/src/compression.rs:1824-1866)

### Lines 1867-1907

Metadata-none test repeats bothinterfaces forBinaryfield metadata exactnone andsamefixed/variablefixtures. Verifies strategy metadata path throughdescriptornames; mismatchedfielddatatype/fixedpayload accepted bytest. (rust/lance-encoding/src/compression.rs:1867-1907)

### Lines 1908-1961

AutomaticFSST tests same4096-rowcandidate: Binaryfield selectsBinaryMini+VariableEncoder and excludesFSSTdebug, Utf8 selectsFsstMini+FsstPerValue. They inspect factories only, do not compress/decode orcoverLargeBinary/thresholdboundaries. (rust/lance-encoding/src/compression.rs:1908-1961)

### Lines 1962-2017

ExplicitFSST Binaryfield test overridesexclusion andexpectsFSSTbothfactories. zstd-gated largepervalue test uses64values average40KiB andlevel19, assertsdebugZstdBufferCompressor andcompression_level19; no actualpayloadroundtrip orlz4/unknownrequestcase. (rust/lance-encoding/src/compression.rs:1962-2017)

### Lines 2018-2082

Parameter merge test setsInt32type lz4/threshold.5 anduser_idcolumn zstd/level6/threshold.2; assertscolumnwins plusotherfieldtypefallback. Pattern test log_* matcheslog_messages but notmessages_log. These test parameter APIs, not metadata invalidvaluebehavior orfullpatternprecedence. (rust/lance-encoding/src/compression.rs:2018-2082)

### Lines 2083-2116

Legacy_metadata_support name means fieldmetadata exactnone, not legacyfileformat; assertsValueEncoder. Defaultbehavior fixture requests600runs/1000 but integer helperrealizes1000runs; acceptsrawValue orInline. Comments naming600runs are inaccurate for fixturealgorithm. (rust/lance-encoding/src/compression.rs:2083-2116)

### Lines 2117-2159

Metadata compression zstdlevel6 test assertsGeneralMini only, notlevelorinnercodec. MetadataRLEthreshold.8 withBSSoff and100runs/1000 assertsRLEdebug. No malformedmetadata/rangevalidation tests. (rust/lance-encoding/src/compression.rs:2117-2159)

### Lines 2160-2210

Sparse mini1000repeated7 i32 withthreshold1/BSSoff encodesu16runlength. Samefixture underStructuralU16/U32 preservesu8. These tests inspect directRLE descriptorFlat child width without roundtrip. (rust/lance-encoding/src/compression.rs:2160-2210)

### Lines 2211-2260

Sparse4096zeroi32 fixture assertsRLE andu16width, exercising selectedwidthcost beforebitpacking. Sparse sorted dictionaryindices four300-value runs likewiseexpectu16. No explicitraw bytecostassertion. (rust/lance-encoding/src/compression.rs:2211-2260)

### Lines 2261-2340

Sparse10runs each128values keepsu8. Feature-gated lz4-or-zstd request over8192 distinctu32 runs of4 withBSSoff/threshold1 underStructuralU16/U32 assertsbothRLEchildrenFlat; helper toleratesGeneralouterwrapper. Confirms released-mode childgrammar, notabsenceofoutergeneralcompression. (rust/lance-encoding/src/compression.rs:2261-2340)

### Lines 2341-2382

Bitpacking-gated sparse8192i32 runs of4 assertsRLE, valueschildOutOfLine andrunlengthchildFlat. Doesnotdecode, anddoesnotassertallchildmetadatawidths/payloadcost. (rust/lance-encoding/src/compression.rs:2341-2382)

### Lines 2383-2430

Bitpacking-gated sparse8192u64 runs of8 cycling3/4/5 assertsRLE survivescomparisonwithInline afterchildselection; valuesOutOfLine andlengthsFlat. No actualroundtrip orprecisesizethresholdassertion. (rust/lance-encoding/src/compression.rs:2383-2430)

### Lines 2431-2490

Metadata override test replaces columnlz4/threshold.3 withmetadata none andexpectsValueEncoder. Mixedconfiguration leaves typelz4/threshold.5, addsmetadatalevel3, assertsGeneralMini only; despitecomment it doesnotassertlevel3. (rust/lance-encoding/src/compression.rs:2431-2490)

### Lines 2491-2533

BSSmetadata testsFloat32/100 andFloat64/100 withon+lz4; assertBSS orGeneralMini+BSS debug. Fixtures are bytepatterns, not numerictemperature/distribution. No automaticheuristicboundaryoractualroundtrip here. (rust/lance-encoding/src/compression.rs:2491-2533)

### Lines 2534-2586

Feature-gated generalblockStructuralU32 test FixedSizeBinary3 =>24bits/1024values requests availablelz4preferelsezstd, assertGeneraldescriptor,defaultdecode andexactbits,count,allpayloadbytes. This isactualtestcode forroundtrip butnotexecuted inKBtask. (rust/lance-encoding/src/compression.rs:2534-2586)

### Lines 2587-2640

Private gated assert_general_block_preserves_compression_level builds24-bit1024fixture andcomparesentireBufferCompression descriptor againstrequested scheme/Optionlevel. zstdcaseassertsNone retained; lz4caseassertsSome7 retained. Testsdescriptorconfiguration, not runtimecodec honoring of level. (rust/lance-encoding/src/compression.rs:2587-2640)

### Lines 2641-2698

Feature-gated StructuralU16 explicitgeneralrequest test assertsnoGeneralblockdescriptor. StructuralU32 none over24bits/20000 (>32768bytes) confirmsautomaticgeneraldisabled. Neither assertswhichalternativecodec exceptnonGeneral. (rust/lance-encoding/src/compression.rs:2641-2698)

### Lines 2699-2750

Sparse70000repeated42 i32 block choosesu32runlength, defaultdecoderroundtripsallvalues. StructuralU32 samefixturekeepsu8 andchecksdescriptoronly. No directu16blockcasehere. Testmodegatesmustbecrosscheckedagainstproductionstrategies. (rust/lance-encoding/src/compression.rs:2699-2750)

### Lines 2751-2821

Two blockpolicytests create1000u16values as10runs of100: StructuralU32 assertsRLEdebug; StructuralU16 assertsnotRLE. File ends 40 test functions (oneparameterizedtwocases), helpers andmodulebrace. Local gaps: decoder malformed/missingmetadata,customnestedstrategy,negative/nonfiniteparams,invalidstatmaps,per-valuefallback edgecases,no-bitpacking builds andstrictthresholdboundary. Alltestsread,noneexecuted. (rust/lance-encoding/src/compression.rs:2751-2821)

## Interaction and interpretation limits

Every line read in bounded primary outputs in ANALYZE77. No source build, test, lint, benchmark, generator, installation or network. Runtime effects and no-bitpacking concern are source deductions, not reproductions. Partial dependencies are not promoted.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Compression traits and definitions for Lance 2.1
    5 | //!
    6 | //! In 2.1 the first step of encoding is structural encoding, where we shred inputs into
    7 | //! leaf arrays and take care of the validity / offsets structure.  Then we pick a structural
    8 | //! encoding (mini-block or full-zip) and then we compress the data.
    9 | //!
   10 | //! This module defines the traits for the compression step.  Each structural encoding has its
   11 | //! own compression strategy.
   12 | //!
   13 | //! Miniblock compression is a block based approach for small data.  Since we introduce some read
   14 | //! amplification and decompress entire blocks we are able to use opaque compression.
   15 | //!
   16 | //! Fullzip compression is a per-value approach where we require that values are transparently
   17 | //! compressed so that we can locate them later.
   18 | 
   19 | #[cfg(feature = "bitpacking")]
   20 | use crate::encodings::physical::bitpacking::{InlineBitpacking, OutOfLineBitpacking};
   21 | use crate::{
   22 |     buffer::LanceBuffer,
   23 |     compression_config::{BssMode, CompressionFieldParams},
   24 |     constants::{
   25 |         BSS_META_KEY, COMPRESSION_LEVEL_META_KEY, COMPRESSION_META_KEY, RLE_THRESHOLD_META_KEY,
   26 |     },
   27 |     data::{DataBlock, FixedWidthDataBlock, VariableWidthBlock},
   28 |     encodings::{
   29 |         logical::primitive::{
   30 |             fullzip::PerValueCompressor,
   31 |             miniblock::{MAX_MINIBLOCK_VALUES, MiniBlockCompressor},
   32 |         },
   33 |         physical::{
   34 |             binary::{
   35 |                 BinaryBlockDecompressor, BinaryMiniBlockDecompressor, BinaryMiniBlockEncoder,
   36 |                 VariableDecoder, VariableEncoder,
   37 |             },
   38 |             block::{
   39 |                 CompressedBufferEncoder, CompressionConfig, CompressionScheme,
   40 |                 GeneralBlockDecompressor,
   41 |             },
   42 |             byte_stream_split::{
   43 |                 ByteStreamSplitDecompressor, ByteStreamSplitEncoder, should_use_bss,
   44 |             },
   45 |             constant::ConstantDecompressor,
   46 |             fsst::{
   47 |                 FsstMiniBlockDecompressor, FsstMiniBlockEncoder, FsstPerValueDecompressor,
   48 |                 FsstPerValueEncoder,
   49 |             },
   50 |             general::{GeneralMiniBlockCompressor, GeneralMiniBlockDecompressor},
   51 |             packed::{
   52 |                 PackedStructFixedPerValueDecompressor, PackedStructFixedPerValueEncoder,
   53 |                 PackedStructFixedWidthMiniBlockDecompressor,
   54 |                 PackedStructFixedWidthMiniBlockEncoder, PackedStructVariablePerValueDecompressor,
   55 |                 PackedStructVariablePerValueEncoder, VariablePackedStructFieldDecoder,
   56 |                 VariablePackedStructFieldKind,
   57 |             },
   58 |             rle::{
   59 |                 RleChildDecompressor, RleDecompressor, RleEncoder, RunLengthWidth,
   60 |                 rle_encoded_size, select_run_length_width,
   61 |             },
   62 |             value::{ValueDecompressor, ValueEncoder},
   63 |         },
   64 |     },
   65 |     format::pb21::{CompressiveEncoding, compressive_encoding::Compression},
   66 |     statistics::{GetStat, Stat},
   67 | };
   68 | 
   69 | use arrow_array::{cast::AsArray, types::UInt64Type};
   70 | use arrow_schema::DataType;
   71 | use fsst::fsst::{FSST_LEAST_INPUT_MAX_LENGTH, FSST_LEAST_INPUT_SIZE};
   72 | use lance_core::{Error, Result, datatypes::Field, error::LanceOptionExt};
   73 | use std::{str::FromStr, sync::Arc};
   74 | 
   75 | /// Default threshold for RLE compression selection when the user explicitly provides a threshold.
   76 | ///
   77 | /// If no threshold is provided, we use a size model instead of a fixed run ratio.
   78 | /// This preserves existing behavior for users relying on the default, while making
   79 | /// the default selection more type-aware.
   80 | const DEFAULT_RLE_COMPRESSION_THRESHOLD: f64 = 0.5;
   81 | 
   82 | // Minimum block size (32kb) to trigger general block compression
   83 | const MIN_BLOCK_SIZE_FOR_GENERAL_COMPRESSION: u64 = 32 * 1024;
   84 | const RLE_BLOCK_HEADER_BYTES: u128 = std::mem::size_of::<u64>() as u128;
   85 | 
   86 | /// Trait for compression algorithms that compress an entire block of data into one opaque
   87 | /// and self-described chunk.
   88 | ///
   89 | /// This is actually a _third_ compression strategy used in a few corner cases today (TODO: remove?)
   90 | ///
   91 | /// This is the most general type of compression.  There are no constraints on the method
   92 | /// of compression it is assumed that the entire block of data will be present at decompression.
   93 | ///
   94 | /// This is the least appropriate strategy for random access because we must load the entire
   95 | /// block to access any single value.  This should only be used for cases where random access is never
   96 | /// required (e.g. when encoding metadata buffers like a dictionary or for encoding rep/def
   97 | /// mini-block chunks)
   98 | pub trait BlockCompressor: std::fmt::Debug + Send + Sync {
   99 |     /// Compress the data into zero or one buffers and describe the codec used.
  100 |     ///
  101 |     /// `None` represents a metadata-only codec. `Some` represents a physical
  102 |     /// payload, including a zero-byte payload.
  103 |     fn compress(&self, data: DataBlock) -> Result<(Option<LanceBuffer>, CompressiveEncoding)>;
  104 | }
  105 | 
  106 | /// A trait to pick which compression to use for given data
  107 | ///
  108 | /// There are several different kinds of compression.
  109 | ///
  110 | /// - Block compression is the most generic, but most difficult to use efficiently
  111 | /// - Per-value compression results in either a fixed width data block or a variable
  112 | ///   width data block.  In other words, there is some number of bits per value.
  113 | ///   In addition, each value should be independently decompressible.
  114 | /// - Mini-block compression results in a small block of opaque data for chunks
  115 | ///   of rows.  Each block is somewhere between 0 and 16KiB in size.  This is
  116 | ///   used for narrow data types (both fixed and variable length) where we can
  117 | ///   fit many values into an 16KiB block.
  118 | pub trait CompressionStrategy: Send + Sync + std::fmt::Debug {
  119 |     /// Create a block compressor for the given data.
  120 |     fn create_block_compressor(
  121 |         &self,
  122 |         field: &Field,
  123 |         data: &DataBlock,
  124 |     ) -> Result<Box<dyn BlockCompressor>>;
  125 | 
  126 |     /// Create a per-value compressor for the given data
  127 |     fn create_per_value(
  128 |         &self,
  129 |         field: &Field,
  130 |         data: &DataBlock,
  131 |     ) -> Result<Box<dyn PerValueCompressor>>;
  132 | 
  133 |     /// Create a mini-block compressor for the given data
  134 |     fn create_miniblock_compressor(
  135 |         &self,
  136 |         field: &Field,
  137 |         data: &DataBlock,
  138 |     ) -> Result<Box<dyn MiniBlockCompressor>>;
  139 | }
  140 | 
  141 | pub(crate) fn compress_required_block(
  142 |     strategy: &dyn CompressionStrategy,
  143 |     field: &Field,
  144 |     data: DataBlock,
  145 | ) -> Result<(LanceBuffer, CompressiveEncoding)> {
  146 |     let compressor = strategy.create_block_compressor(field, &data)?;
  147 |     let (payload, encoding) = compressor.compress(data)?;
  148 |     let payload = payload.ok_or_else(|| {
  149 |         Error::internal("Required block compressor selected a metadata-only codec".to_string())
  150 |     })?;
  151 |     Ok((payload, encoding))
  152 | }
  153 | 
  154 | fn try_bss_for_mini_block(
  155 |     data: &FixedWidthDataBlock,
  156 |     params: &CompressionFieldParams,
  157 | ) -> Option<Box<dyn MiniBlockCompressor>> {
  158 |     // BSS requires general compression to be effective
  159 |     // If compression is not set or explicitly disabled, skip BSS
  160 |     if params.compression.is_none() || params.compression.as_deref() == Some("none") {
  161 |         return None;
  162 |     }
  163 | 
  164 |     let mode = params.bss.unwrap_or(BssMode::Auto);
  165 |     // should_use_bss already checks for supported bit widths (32/64)
  166 |     if should_use_bss(data, mode) {
  167 |         return Some(Box::new(ByteStreamSplitEncoder::new(
  168 |             data.bits_per_value as usize,
  169 |         )));
  170 |     }
  171 |     None
  172 | }
  173 | 
  174 | fn rle_is_applicable(data: &FixedWidthDataBlock, params: &CompressionFieldParams) -> Option<u128> {
  175 |     let bits = data.bits_per_value;
  176 |     if !matches!(bits, 8 | 16 | 32 | 64) {
  177 |         return None;
  178 |     }
  179 | 
  180 |     let type_size = bits / 8;
  181 |     let run_count = data.expect_single_stat::<UInt64Type>(Stat::RunCount);
  182 |     let threshold = params
  183 |         .rle_threshold
  184 |         .unwrap_or(DEFAULT_RLE_COMPRESSION_THRESHOLD);
  185 | 
  186 |     // If the user explicitly provided a threshold then honor it as an additional guard.
  187 |     // A lower threshold makes RLE harder to trigger and can be used to avoid CPU overhead.
  188 |     let passes_threshold = match params.rle_threshold {
  189 |         Some(_) => (run_count as f64) < (data.num_values as f64) * threshold,
  190 |         None => true,
  191 |     };
  192 | 
  193 |     if !passes_threshold {
  194 |         return None;
  195 |     }
  196 | 
  197 |     Some((data.num_values as u128) * (type_size as u128))
  198 | }
  199 | 
  200 | fn rle_beats_raw_and_bitpacking(
  201 |     data: &FixedWidthDataBlock,
  202 |     encoded_bytes: u128,
  203 |     raw_bytes: u128,
  204 | ) -> bool {
  205 |     if encoded_bytes >= raw_bytes {
  206 |         return false;
  207 |     }
  208 | 
  209 |     #[cfg(feature = "bitpacking")]
  210 |     {
  211 |         if let Some(bitpack_bytes) = estimate_inline_bitpacking_bytes(data).map(u128::from)
  212 |             && bitpack_bytes < encoded_bytes
  213 |         {
  214 |             return false;
  215 |         }
  216 |     }
  217 |     true
  218 | }
  219 | 
  220 | fn try_fixed_u8_rle_for_mini_block(
  221 |     data: &FixedWidthDataBlock,
  222 |     params: &CompressionFieldParams,
  223 | ) -> Option<Box<dyn MiniBlockCompressor>> {
  224 |     let raw_bytes = rle_is_applicable(data, params)?;
  225 |     let rle_bytes = estimate_rle_size_for_width_from_data(
  226 |         data,
  227 |         Some(*MAX_MINIBLOCK_VALUES),
  228 |         RunLengthWidth::U8,
  229 |     )
  230 |     .ok()?;
  231 |     rle_beats_raw_and_bitpacking(data, rle_bytes, raw_bytes)
  232 |         .then(|| Box::new(RleEncoder::with_run_length_width(RunLengthWidth::U8)) as _)
  233 | }
  234 | 
  235 | fn try_child_rle_for_mini_block(
  236 |     data: &FixedWidthDataBlock,
  237 |     params: &CompressionFieldParams,
  238 | ) -> Option<Box<dyn MiniBlockCompressor>> {
  239 |     let raw_bytes = rle_is_applicable(data, params)?;
  240 |     let (run_length_width, estimated_bytes) =
  241 |         estimate_rle_width_and_size_from_data(data, Some(*MAX_MINIBLOCK_VALUES)).ok()?;
  242 |     let child_compression = rle_child_compression_config(params);
  243 |     let encoder = || {
  244 |         RleEncoder::with_child_encoding(
  245 |             run_length_width,
  246 |             child_compression,
  247 |             child_compression,
  248 |             true,
  249 |         )
  250 |     };
  251 | 
  252 |     #[cfg(feature = "bitpacking")]
  253 |     let bitpack_bytes = estimate_inline_bitpacking_bytes(data).map(u128::from);
  254 |     #[cfg(not(feature = "bitpacking"))]
  255 |     let bitpack_bytes = None::<u128>;
  256 | 
  257 |     let should_measure_children = (child_compression.is_some() || cfg!(feature = "bitpacking"))
  258 |         && (estimated_bytes >= raw_bytes
  259 |             || bitpack_bytes.is_some_and(|bytes| bytes < estimated_bytes));
  260 |     let selected_bytes = if should_measure_children {
  261 |         encoder().selected_payload_size(data).ok()?
  262 |     } else {
  263 |         estimated_bytes
  264 |     };
  265 | 
  266 |     rle_beats_raw_and_bitpacking(data, selected_bytes, raw_bytes).then(|| Box::new(encoder()) as _)
  267 | }
  268 | 
  269 | fn rle_child_compression_config(params: &CompressionFieldParams) -> Option<CompressionConfig> {
  270 |     let raw = params.compression.as_deref()?;
  271 |     if matches!(raw, "none" | "fsst") {
  272 |         return None;
  273 |     }
  274 |     let scheme = CompressionScheme::from_str(raw).ok()?;
  275 |     Some(CompressionConfig::new(scheme, params.compression_level))
  276 | }
  277 | 
  278 | fn try_rle_for_block_with_width(
  279 |     data: &FixedWidthDataBlock,
  280 |     params: &CompressionFieldParams,
  281 |     run_length_width: RunLengthWidth,
  282 |     rle_payload_bytes: u128,
  283 | ) -> Result<Option<Box<dyn BlockCompressor>>> {
  284 |     let bits = data.bits_per_value;
  285 |     if !matches!(bits, 8 | 16 | 32 | 64) {
  286 |         return Ok(None);
  287 |     }
  288 | 
  289 |     let run_count = data.expect_single_stat::<UInt64Type>(Stat::RunCount);
  290 |     let threshold = params
  291 |         .rle_threshold
  292 |         .unwrap_or(DEFAULT_RLE_COMPRESSION_THRESHOLD);
  293 | 
  294 |     let passes_threshold = match params.rle_threshold {
  295 |         Some(_) => (run_count as f64) < (data.num_values as f64) * threshold,
  296 |         None => true,
  297 |     };
  298 | 
  299 |     if !passes_threshold {
  300 |         return Ok(None);
  301 |     }
  302 | 
  303 |     let raw_bytes = (data.num_values as u128) * ((bits / 8) as u128);
  304 |     let rle_bytes = rle_payload_bytes.saturating_add(RLE_BLOCK_HEADER_BYTES);
  305 | 
  306 |     if rle_bytes >= raw_bytes {
  307 |         return Ok(None);
  308 |     }
  309 | 
  310 |     #[cfg(feature = "bitpacking")]
  311 |     {
  312 |         if let Some(bitpack_bytes) = estimate_block_bitpacking_bytes(data)
  313 |             && bitpack_bytes < rle_bytes
  314 |         {
  315 |             return Ok(None);
  316 |         }
  317 |     }
  318 | 
  319 |     Ok(Some(Box::new(RleEncoder::with_run_length_width(
  320 |         run_length_width,
  321 |     ))))
  322 | }
  323 | 
  324 | fn try_fixed_u8_rle_for_block(
  325 |     data: &FixedWidthDataBlock,
  326 |     params: &CompressionFieldParams,
  327 | ) -> Result<Option<Box<dyn BlockCompressor>>> {
  328 |     if !matches!(data.bits_per_value, 8 | 16 | 32 | 64) {
  329 |         return Ok(None);
  330 |     }
  331 |     let encoded_bytes = estimate_rle_size_for_width_from_data(data, None, RunLengthWidth::U8)?;
  332 |     try_rle_for_block_with_width(data, params, RunLengthWidth::U8, encoded_bytes)
  333 | }
  334 | 
  335 | fn try_variable_rle_for_block(
  336 |     data: &FixedWidthDataBlock,
  337 |     params: &CompressionFieldParams,
  338 | ) -> Result<Option<Box<dyn BlockCompressor>>> {
  339 |     if !matches!(data.bits_per_value, 8 | 16 | 32 | 64) {
  340 |         return Ok(None);
  341 |     }
  342 |     let (width, encoded_bytes) = estimate_rle_width_and_size_from_data(data, None)?;
  343 |     try_rle_for_block_with_width(data, params, width, encoded_bytes)
  344 | }
  345 | 
  346 | fn estimate_rle_width_and_size_from_data(
  347 |     data: &FixedWidthDataBlock,
  348 |     max_segment_values: Option<u64>,
  349 | ) -> Result<(RunLengthWidth, u128)> {
  350 |     select_run_length_width(
  351 |         &data.data,
  352 |         data.num_values,
  353 |         data.bits_per_value,
  354 |         max_segment_values,
  355 |     )
  356 | }
  357 | 
  358 | fn estimate_rle_size_for_width_from_data(
  359 |     data: &FixedWidthDataBlock,
  360 |     max_segment_values: Option<u64>,
  361 |     run_length_width: RunLengthWidth,
  362 | ) -> Result<u128> {
  363 |     rle_encoded_size(
  364 |         &data.data,
  365 |         data.num_values,
  366 |         data.bits_per_value,
  367 |         max_segment_values,
  368 |         run_length_width,
  369 |     )
  370 | }
  371 | 
  372 | fn try_bitpack_for_mini_block(_data: &FixedWidthDataBlock) -> Option<Box<dyn MiniBlockCompressor>> {
  373 |     #[cfg(feature = "bitpacking")]
  374 |     {
  375 |         let bits = _data.bits_per_value;
  376 |         if estimate_inline_bitpacking_bytes(_data).is_some() {
  377 |             return Some(Box::new(InlineBitpacking::new(bits)));
  378 |         }
  379 |         None
  380 |     }
  381 |     #[cfg(not(feature = "bitpacking"))]
  382 |     {
  383 |         None
  384 |     }
  385 | }
  386 | 
  387 | #[cfg(feature = "bitpacking")]
  388 | fn estimate_inline_bitpacking_bytes(data: &FixedWidthDataBlock) -> Option<u64> {
  389 |     use arrow_array::cast::AsArray;
  390 | 
  391 |     let bits = data.bits_per_value;
  392 |     if !matches!(bits, 8 | 16 | 32 | 64) {
  393 |         return None;
  394 |     }
  395 |     if data.num_values == 0 {
  396 |         return None;
  397 |     }
  398 | 
  399 |     let bit_widths = data.expect_stat(Stat::BitWidth);
  400 |     let widths = bit_widths.as_primitive::<UInt64Type>();
  401 | 
  402 |     let words_per_chunk: u128 = 1;
  403 |     let word_bytes: u128 = (bits / 8) as u128;
  404 |     let mut total_words: u128 = 0;
  405 |     for i in 0..widths.len() {
  406 |         let bit_width = widths.value(i) as u128;
  407 |         let packed_words = (1024u128 * bit_width) / (bits as u128);
  408 |         total_words = total_words.saturating_add(words_per_chunk.saturating_add(packed_words));
  409 |     }
  410 | 
  411 |     let estimated_bytes = total_words.saturating_mul(word_bytes);
  412 |     let raw_bytes = data.data_size() as u128;
  413 | 
  414 |     if estimated_bytes >= raw_bytes {
  415 |         return None;
  416 |     }
  417 | 
  418 |     u64::try_from(estimated_bytes).ok()
  419 | }
  420 | 
  421 | fn try_bitpack_for_block(data: &FixedWidthDataBlock) -> Option<Box<dyn BlockCompressor>> {
  422 |     let bits = data.bits_per_value;
  423 |     if !matches!(bits, 8 | 16 | 32 | 64) {
  424 |         return None;
  425 |     }
  426 | 
  427 |     let bit_widths = data.expect_stat(Stat::BitWidth);
  428 |     let widths = bit_widths.as_primitive::<UInt64Type>();
  429 |     let max_bit_width = *widths.values().iter().max().unwrap();
  430 | 
  431 |     // Full-width values save no space and leave no bit savings for a runt tail.
  432 |     if max_bit_width >= bits {
  433 |         return None;
  434 |     }
  435 | 
  436 |     let too_small =
  437 |         widths.len() == 1 && InlineBitpacking::min_size_bytes(widths.value(0)) >= data.data_size();
  438 | 
  439 |     if too_small {
  440 |         return None;
  441 |     }
  442 | 
  443 |     if data.num_values <= 1024 {
  444 |         Some(Box::new(InlineBitpacking::new(bits)))
  445 |     } else {
  446 |         Some(Box::new(OutOfLineBitpacking::new(max_bit_width, bits)))
  447 |     }
  448 | }
  449 | 
  450 | #[cfg(feature = "bitpacking")]
  451 | fn estimate_block_bitpacking_bytes(data: &FixedWidthDataBlock) -> Option<u128> {
  452 |     let bits = data.bits_per_value;
  453 |     if !matches!(bits, 8 | 16 | 32 | 64) || data.num_values == 0 {
  454 |         return None;
  455 |     }
  456 | 
  457 |     let bit_widths = data.expect_stat(Stat::BitWidth);
  458 |     let widths = bit_widths.as_primitive::<UInt64Type>();
  459 |     let max_bit_width = *widths.values().iter().max()?;
  460 |     let word_bytes = (bits / 8) as u128;
  461 | 
  462 |     let bitpacked_words = if data.num_values <= 1024 {
  463 |         1 + (1024u128 * (max_bit_width as u128)) / (bits as u128)
  464 |     } else {
  465 |         estimate_out_of_line_bitpacking_words(data.num_values, max_bit_width, bits)?
  466 |     };
  467 |     let bitpacked_bytes = bitpacked_words.saturating_mul(word_bytes);
  468 |     if bitpacked_bytes >= data.data_size() as u128 {
  469 |         return None;
  470 |     }
  471 | 
  472 |     Some(bitpacked_bytes)
  473 | }
  474 | 
  475 | #[cfg(feature = "bitpacking")]
  476 | fn estimate_out_of_line_bitpacking_words(
  477 |     num_values: u64,
  478 |     compressed_bits_per_value: u64,
  479 |     bits_per_value: u64,
  480 | ) -> Option<u128> {
  481 |     let num_values = usize::try_from(num_values).ok()?;
  482 |     let compressed_bits_per_value = usize::try_from(compressed_bits_per_value).ok()?;
  483 |     let bits_per_value = usize::try_from(bits_per_value).ok()?;
  484 |     if compressed_bits_per_value >= bits_per_value {
  485 |         return None;
  486 |     }
  487 | 
  488 |     let elems_per_chunk = 1024usize;
  489 |     let num_chunks = num_values.div_ceil(elems_per_chunk);
  490 |     let words_per_chunk = (elems_per_chunk * compressed_bits_per_value).div_ceil(bits_per_value);
  491 |     let last_chunk_is_runt = !num_values.is_multiple_of(elems_per_chunk);
  492 | 
  493 |     if !last_chunk_is_runt {
  494 |         return Some((num_chunks * words_per_chunk) as u128);
  495 |     }
  496 | 
  497 |     let num_whole_chunks = num_chunks - 1;
  498 |     let remaining_items = num_values - num_whole_chunks * elems_per_chunk;
  499 |     let tail_bit_savings = bits_per_value - compressed_bits_per_value;
  500 |     let padding_cost = compressed_bits_per_value * (elems_per_chunk - remaining_items);
  501 |     let tail_pack_savings = tail_bit_savings * remaining_items;
  502 |     let tail_words = if padding_cost < tail_pack_savings {
  503 |         words_per_chunk
  504 |     } else {
  505 |         remaining_items
  506 |     };
  507 | 
  508 |     Some((num_whole_chunks * words_per_chunk + tail_words) as u128)
  509 | }
  510 | 
  511 | fn maybe_wrap_general_for_mini_block(
  512 |     inner: Box<dyn MiniBlockCompressor>,
  513 |     params: &CompressionFieldParams,
  514 | ) -> Result<Box<dyn MiniBlockCompressor>> {
  515 |     match params.compression.as_deref() {
  516 |         None | Some("none") | Some("fsst") => Ok(inner),
  517 |         Some(raw) => {
  518 |             let scheme = CompressionScheme::from_str(raw)
  519 |                 .map_err(|_| Error::invalid_input(format!("Unknown compression scheme: {raw}")))?;
  520 |             let cfg = CompressionConfig::new(scheme, params.compression_level);
  521 |             Ok(Box::new(GeneralMiniBlockCompressor::new(inner, cfg)))
  522 |         }
  523 |     }
  524 | }
  525 | 
  526 | fn try_general_compression(
  527 |     field_params: &CompressionFieldParams,
  528 |     data: &DataBlock,
  529 | ) -> Result<Option<(Box<dyn BlockCompressor>, CompressionConfig)>> {
  530 |     // Explicitly disable general compression.
  531 |     if field_params.compression.as_deref() == Some("none") {
  532 |         return Ok(None);
  533 |     }
  534 | 
  535 |     // User-requested compression (unused today but perhaps still used
  536 |     // in the future someday)
  537 |     if let Some(compression_scheme) = &field_params.compression {
  538 |         let scheme: CompressionScheme = compression_scheme.parse()?;
  539 |         let config = CompressionConfig::new(scheme, field_params.compression_level);
  540 |         let compressor = Box::new(CompressedBufferEncoder::try_new(config)?);
  541 |         return Ok(Some((compressor, config)));
  542 |     }
  543 | 
  544 |     // Automatic compression for large blocks
  545 |     if data.data_size() > MIN_BLOCK_SIZE_FOR_GENERAL_COMPRESSION {
  546 |         let compressor = Box::new(CompressedBufferEncoder::default());
  547 |         let config = compressor.compressor.config();
  548 |         return Ok(Some((compressor, config)));
  549 |     }
  550 | 
  551 |     Ok(None)
  552 | }
  553 | 
  554 | /// Parse field-level compression metadata without applying format-specific constraints.
  555 | pub fn field_metadata_params(field: &Field) -> CompressionFieldParams {
  556 |     let mut params = CompressionFieldParams::default();
  557 | 
  558 |     if let Some(compression) = field.metadata.get(COMPRESSION_META_KEY) {
  559 |         params.compression = Some(compression.clone());
  560 |     }
  561 |     if let Some(level) = field.metadata.get(COMPRESSION_LEVEL_META_KEY) {
  562 |         params.compression_level = level.parse().ok();
  563 |     }
  564 |     if let Some(threshold) = field.metadata.get(RLE_THRESHOLD_META_KEY) {
  565 |         params.rle_threshold = threshold.parse().ok();
  566 |     }
  567 |     if let Some(bss_str) = field.metadata.get(BSS_META_KEY) {
  568 |         match BssMode::parse(bss_str) {
  569 |             Some(mode) => params.bss = Some(mode),
  570 |             None => log::warn!("Invalid BSS mode '{}', using default", bss_str),
  571 |         }
  572 |     }
  573 |     if let Some(minichunk_size_str) = field
  574 |         .metadata
  575 |         .get(super::constants::MINICHUNK_SIZE_META_KEY)
  576 |     {
  577 |         if let Ok(minichunk_size) = minichunk_size_str.parse::<i64>() {
  578 |             params.minichunk_size = Some(minichunk_size);
  579 |         } else {
  580 |             log::warn!("Invalid minichunk_size '{}', skipping", minichunk_size_str);
  581 |         }
  582 |     }
  583 | 
  584 |     params
  585 | }
  586 | 
  587 | /// Apply general-purpose compression requested for a fixed-width miniblock.
  588 | pub fn finalize_miniblock_compressor(
  589 |     data: &DataBlock,
  590 |     compressor: Box<dyn MiniBlockCompressor>,
  591 |     params: &CompressionFieldParams,
  592 | ) -> Result<Box<dyn MiniBlockCompressor>> {
  593 |     if matches!(data, DataBlock::FixedWidth(_)) {
  594 |         maybe_wrap_general_for_mini_block(compressor, params)
  595 |     } else {
  596 |         Ok(compressor)
  597 |     }
  598 | }
  599 | 
  600 | /// Honor an explicit `compression = none` request for fixed-width miniblocks.
  601 | pub fn try_uncompressed_fixed_width_miniblock(
  602 |     data: &DataBlock,
  603 |     params: &CompressionFieldParams,
  604 | ) -> Option<Box<dyn MiniBlockCompressor>> {
  605 |     (matches!(data, DataBlock::FixedWidth(_)) && params.compression.as_deref() == Some("none"))
  606 |         .then(|| Box::new(ValueEncoder::default()) as _)
  607 | }
  608 | 
  609 | /// Select byte-stream-split compression for an applicable fixed-width miniblock.
  610 | pub fn try_byte_stream_split_miniblock(
  611 |     data: &DataBlock,
  612 |     params: &CompressionFieldParams,
  613 | ) -> Option<Box<dyn MiniBlockCompressor>> {
  614 |     let DataBlock::FixedWidth(data) = data else {
  615 |         return None;
  616 |     };
  617 |     try_bss_for_mini_block(data, params)
  618 | }
  619 | 
  620 | /// Select the original fixed-u8 RLE miniblock grammar.
  621 | pub fn try_fixed_u8_rle_miniblock(
  622 |     data: &DataBlock,
  623 |     params: &CompressionFieldParams,
  624 | ) -> Option<Box<dyn MiniBlockCompressor>> {
  625 |     let DataBlock::FixedWidth(data) = data else {
  626 |         return None;
  627 |     };
  628 |     try_fixed_u8_rle_for_mini_block(data, params)
  629 | }
  630 | 
  631 | /// Select variable-width RLE with independently encoded children.
  632 | pub fn try_child_rle_miniblock(
  633 |     data: &DataBlock,
  634 |     params: &CompressionFieldParams,
  635 | ) -> Option<Box<dyn MiniBlockCompressor>> {
  636 |     let DataBlock::FixedWidth(data) = data else {
  637 |         return None;
  638 |     };
  639 |     try_child_rle_for_mini_block(data, params)
  640 | }
  641 | 
  642 | /// Select inline bitpacking for applicable fixed-width miniblocks.
  643 | pub fn try_bitpacking_miniblock(data: &DataBlock) -> Option<Box<dyn MiniBlockCompressor>> {
  644 |     let DataBlock::FixedWidth(data) = data else {
  645 |         return None;
  646 |     };
  647 |     try_bitpack_for_mini_block(data)
  648 | }
  649 | 
  650 | /// Store fixed-width miniblock values without a value codec.
  651 | pub fn try_raw_fixed_width_miniblock(data: &DataBlock) -> Option<Box<dyn MiniBlockCompressor>> {
  652 |     matches!(data, DataBlock::FixedWidth(_)).then(|| Box::new(ValueEncoder::default()) as _)
  653 | }
  654 | 
  655 | /// Encode variable-width miniblocks with binary or FSST encoding.
  656 | pub fn try_variable_width_miniblock(
  657 |     field: &Field,
  658 |     data: &DataBlock,
  659 |     params: &CompressionFieldParams,
  660 | ) -> Result<Option<Box<dyn MiniBlockCompressor>>> {
  661 |     let DataBlock::VariableWidth(data) = data else {
  662 |         return Ok(None);
  663 |     };
  664 |     if data.bits_per_offset != 32 && data.bits_per_offset != 64 {
  665 |         return Err(Error::invalid_input(format!(
  666 |             "Variable width compression not supported for {} bit offsets",
  667 |             data.bits_per_offset
  668 |         )));
  669 |     }
  670 | 
  671 |     let compression = params.compression.as_deref();
  672 |     let data_size = data.expect_single_stat::<UInt64Type>(Stat::DataSize);
  673 |     let max_len = data.expect_single_stat::<UInt64Type>(Stat::MaxLength);
  674 |     if compression == Some("none") {
  675 |         return Ok(Some(Box::new(BinaryMiniBlockEncoder::new(
  676 |             params.minichunk_size,
  677 |         ))));
  678 |     }
  679 | 
  680 |     let use_fsst = compression == Some("fsst")
  681 |         || (compression.is_none()
  682 |             && !matches!(field.data_type(), DataType::Binary | DataType::LargeBinary)
  683 |             && max_len >= FSST_LEAST_INPUT_MAX_LENGTH
  684 |             && data_size >= FSST_LEAST_INPUT_SIZE as u64);
  685 |     let mut encoder: Box<dyn MiniBlockCompressor> = if use_fsst {
  686 |         Box::new(FsstMiniBlockEncoder::new(params.minichunk_size))
  687 |     } else {
  688 |         Box::new(BinaryMiniBlockEncoder::new(params.minichunk_size))
  689 |     };
  690 |     if let Some(compression_scheme) = compression.filter(|scheme| *scheme != "fsst") {
  691 |         let scheme: CompressionScheme = compression_scheme.parse()?;
  692 |         let config = CompressionConfig::new(scheme, params.compression_level);
  693 |         encoder = Box::new(GeneralMiniBlockCompressor::new(encoder, config));
  694 |     }
  695 |     Ok(Some(encoder))
  696 | }
  697 | 
  698 | /// Encode fixed-width packed structs as miniblocks.
  699 | pub fn try_fixed_packed_struct_miniblock(
  700 |     data: &DataBlock,
  701 | ) -> Result<Option<Box<dyn MiniBlockCompressor>>> {
  702 |     let DataBlock::Struct(data) = data else {
  703 |         return Ok(None);
  704 |     };
  705 |     if data.has_variable_width_child() {
  706 |         return Err(Error::invalid_input(
  707 |             "Packed struct mini-block encoding supports only fixed-width children",
  708 |         ));
  709 |     }
  710 |     Ok(Some(Box::new(
  711 |         PackedStructFixedWidthMiniBlockEncoder::default(),
  712 |     )))
  713 | }
  714 | 
  715 | /// Store fixed-size-list miniblocks without a value codec.
  716 | pub fn try_raw_fixed_size_list_miniblock(data: &DataBlock) -> Option<Box<dyn MiniBlockCompressor>> {
  717 |     matches!(data, DataBlock::FixedSizeList(_)).then(|| Box::new(ValueEncoder::default()) as _)
  718 | }
  719 | 
  720 | /// Store fixed-width and fixed-size-list values directly in full-zip pages.
  721 | pub fn try_raw_per_value(data: &DataBlock) -> Option<Box<dyn PerValueCompressor>> {
  722 |     matches!(data, DataBlock::FixedWidth(_) | DataBlock::FixedSizeList(_))
  723 |         .then(|| Box::new(ValueEncoder::default()) as _)
  724 | }
  725 | 
  726 | fn validate_packed_struct(field: &Field, data: &DataBlock) -> Result<Option<bool>> {
  727 |     let DataBlock::Struct(data) = data else {
  728 |         return Ok(None);
  729 |     };
  730 |     if field.children.len() != data.children.len() {
  731 |         return Err(Error::invalid_input(
  732 |             "Struct field metadata does not match data block children",
  733 |         ));
  734 |     }
  735 |     Ok(Some(data.has_variable_width_child()))
  736 | }
  737 | 
  738 | /// Reject variable-width packed structs while preserving the fixed-width error.
  739 | pub fn reject_packed_struct_per_value(
  740 |     field: &Field,
  741 |     data: &DataBlock,
  742 | ) -> Result<Option<Box<dyn PerValueCompressor>>> {
  743 |     let Some(has_variable_child) = validate_packed_struct(field, data)? else {
  744 |         return Ok(None);
  745 |     };
  746 |     if has_variable_child {
  747 |         return Err(Error::not_supported_source(
  748 |             "Variable packed struct encoding is not enabled by the selected file format".into(),
  749 |         ));
  750 |     }
  751 |     Err(Error::invalid_input(
  752 |         "Packed struct per-value compression should not be used for fixed-width-only structs",
  753 |     ))
  754 | }
  755 | 
  756 | /// Encode variable-width packed structs with the exact strategy recursively.
  757 | pub fn try_variable_packed_struct_per_value(
  758 |     strategy: Arc<dyn CompressionStrategy>,
  759 |     field: &Field,
  760 |     data: &DataBlock,
  761 | ) -> Result<Option<Box<dyn PerValueCompressor>>> {
  762 |     let Some(has_variable_child) = validate_packed_struct(field, data)? else {
  763 |         return Ok(None);
  764 |     };
  765 |     if !has_variable_child {
  766 |         return Err(Error::invalid_input(
  767 |             "Packed struct per-value compression should not be used for fixed-width-only structs",
  768 |         ));
  769 |     }
  770 |     Ok(Some(Box::new(PackedStructVariablePerValueEncoder::new(
  771 |         strategy,
  772 |         field.children.clone(),
  773 |     ))))
  774 | }
  775 | 
  776 | /// Encode all packed structs with the exact strategy recursively.
  777 | pub fn try_packed_struct_per_value(
  778 |     strategy: Arc<dyn CompressionStrategy>,
  779 |     field: &Field,
  780 |     data: &DataBlock,
  781 | ) -> Result<Option<Box<dyn PerValueCompressor>>> {
  782 |     let Some(has_variable_child) = validate_packed_struct(field, data)? else {
  783 |         return Ok(None);
  784 |     };
  785 |     if has_variable_child {
  786 |         return Ok(Some(Box::new(PackedStructVariablePerValueEncoder::new(
  787 |             strategy,
  788 |             field.children.clone(),
  789 |         ))));
  790 |     }
  791 | 
  792 |     Ok(Some(Box::new(PackedStructFixedPerValueEncoder::new(
  793 |         field.children.clone(),
  794 |     ))))
  795 | }
  796 | 
  797 | /// Encode variable-width values directly, with FSST or per-value compression
  798 | /// when applicable.
  799 | pub fn try_variable_width_per_value(
  800 |     field: &Field,
  801 |     data: &DataBlock,
  802 |     params: &CompressionFieldParams,
  803 | ) -> Result<Option<Box<dyn PerValueCompressor>>> {
  804 |     let DataBlock::VariableWidth(data) = data else {
  805 |         return Ok(None);
  806 |     };
  807 |     let compression = params.compression.as_deref();
  808 |     if compression == Some("none") {
  809 |         return Ok(Some(Box::new(VariableEncoder::default())));
  810 |     }
  811 | 
  812 |     let max_len = data.expect_single_stat::<UInt64Type>(Stat::MaxLength);
  813 |     let data_size = data.expect_single_stat::<UInt64Type>(Stat::DataSize);
  814 |     let per_value_requested = compression.is_some_and(|compression| compression != "fsst");
  815 |     if (max_len > 32 * 1024 || per_value_requested) && data_size >= FSST_LEAST_INPUT_SIZE as u64 {
  816 |         if compression == Some("zstd") {
  817 |             let config = CompressionConfig::new(CompressionScheme::Zstd, params.compression_level);
  818 |             return Ok(Some(Box::new(CompressedBufferEncoder::try_new(config)?)));
  819 |         }
  820 |         return Ok(Some(Box::new(CompressedBufferEncoder::default())));
  821 |     }
  822 | 
  823 |     if data.bits_per_offset != 32 && data.bits_per_offset != 64 {
  824 |         return Err(Error::invalid_input(format!(
  825 |             "Per-value compression does not support variable-width data with {}-bit offsets",
  826 |             data.bits_per_offset
  827 |         )));
  828 |     }
  829 |     let encoder = Box::new(VariableEncoder::default());
  830 |     let use_fsst = compression == Some("fsst")
  831 |         || (compression.is_none()
  832 |             && !matches!(field.data_type(), DataType::Binary | DataType::LargeBinary)
  833 |             && max_len >= FSST_LEAST_INPUT_MAX_LENGTH
  834 |             && data_size >= FSST_LEAST_INPUT_SIZE as u64);
  835 |     Ok(Some(if use_fsst {
  836 |         Box::new(FsstPerValueEncoder::new(encoder))
  837 |     } else {
  838 |         encoder
  839 |     }))
  840 | }
  841 | 
  842 | /// Select fixed-u8 RLE for block compression.
  843 | pub fn try_fixed_u8_rle_block(
  844 |     data: &DataBlock,
  845 |     params: &CompressionFieldParams,
  846 | ) -> Result<Option<Box<dyn BlockCompressor>>> {
  847 |     let DataBlock::FixedWidth(data) = data else {
  848 |         return Ok(None);
  849 |     };
  850 |     try_fixed_u8_rle_for_block(data, params)
  851 | }
  852 | 
  853 | /// Select variable-width RLE for block compression.
  854 | pub fn try_variable_rle_block(
  855 |     data: &DataBlock,
  856 |     params: &CompressionFieldParams,
  857 | ) -> Result<Option<Box<dyn BlockCompressor>>> {
  858 |     let DataBlock::FixedWidth(data) = data else {
  859 |         return Ok(None);
  860 |     };
  861 |     try_variable_rle_for_block(data, params)
  862 | }
  863 | 
  864 | /// Select block bitpacking for applicable fixed-width values.
  865 | pub fn try_bitpacking_block(data: &DataBlock) -> Option<Box<dyn BlockCompressor>> {
  866 |     let DataBlock::FixedWidth(data) = data else {
  867 |         return None;
  868 |     };
  869 |     try_bitpack_for_block(data)
  870 | }
  871 | 
  872 | /// Select explicitly requested or automatic general-purpose block compression.
  873 | pub fn try_general_block(
  874 |     data: &DataBlock,
  875 |     params: &CompressionFieldParams,
  876 | ) -> Result<Option<Box<dyn BlockCompressor>>> {
  877 |     let Some((compressor, _config)) = try_general_compression(params, data)? else {
  878 |         return Ok(None);
  879 |     };
  880 |     Ok(Some(compressor))
  881 | }
  882 | 
  883 | /// Store fixed- and variable-width block values without block compression.
  884 | pub fn try_raw_block(data: &DataBlock) -> Option<Box<dyn BlockCompressor>> {
  885 |     match data {
  886 |         DataBlock::FixedWidth(_) => {
  887 |             Some(Box::new(ValueEncoder::default()) as Box<dyn BlockCompressor>)
  888 |         }
  889 |         DataBlock::VariableWidth(_) => {
  890 |             Some(Box::new(VariableEncoder::default()) as Box<dyn BlockCompressor>)
  891 |         }
  892 |         _ => None,
  893 |     }
  894 | }
  895 | 
  896 | pub trait MiniBlockDecompressor: std::fmt::Debug + Send + Sync {
  897 |     fn decompress(&self, data: Vec<LanceBuffer>, num_values: u64) -> Result<DataBlock>;
  898 | 
  899 |     /// Returns the exact aggregate decoded size when it is determined solely by the value count.
  900 |     ///
  901 |     /// Implementations should only return `Some` when this aggregate estimate can be used by
  902 |     /// [`DataBlockBuilder`](crate::data::DataBlockBuilder) to preallocate the decoded output
  903 |     /// exactly. Outputs with multiple buffers or whose layout-dependent allocation cannot be
  904 |     /// represented by one aggregate estimate should return `None`.
  905 |     fn decoded_size_bytes(&self, _num_values: u64) -> Option<u64> {
  906 |         None
  907 |     }
  908 | }
  909 | 
  910 | pub trait FixedPerValueDecompressor: std::fmt::Debug + Send + Sync {
  911 |     /// Decompress one or more values
  912 |     fn decompress(&self, data: FixedWidthDataBlock, num_values: u64) -> Result<DataBlock>;
  913 |     /// The number of bits in each value
  914 |     ///
  915 |     /// Currently (and probably long term) this must be a multiple of 8
  916 |     fn bits_per_value(&self) -> u64;
  917 | 
  918 |     /// Returns the exact aggregate decoded size when it is determined solely by the value count.
  919 |     ///
  920 |     /// Implementations should only return `Some` when this aggregate estimate can be used by
  921 |     /// [`DataBlockBuilder`](crate::data::DataBlockBuilder) to preallocate the decoded output
  922 |     /// exactly. Outputs with multiple buffers or whose layout-dependent allocation cannot be
  923 |     /// represented by one aggregate estimate should return `None`.
  924 |     fn decoded_size_bytes(&self, _num_values: u64) -> Option<u64> {
  925 |         None
  926 |     }
  927 | }
  928 | 
  929 | pub trait VariablePerValueDecompressor: std::fmt::Debug + Send + Sync {
  930 |     /// Decompress one or more values
  931 |     fn decompress(&self, data: VariableWidthBlock) -> Result<DataBlock>;
  932 | }
  933 | 
  934 | pub trait BlockDecompressor: std::fmt::Debug + Send + Sync {
  935 |     fn decompress(&self, data: Option<LanceBuffer>, num_values: u64) -> Result<DataBlock>;
  936 | 
  937 |     /// Whether this codec consumes one payload buffer.
  938 |     fn requires_payload(&self) -> bool {
  939 |         true
  940 |     }
  941 | 
  942 |     /// Inspect a block for an exact payload-derived value count when supported.
  943 |     ///
  944 |     /// This must not materialize the decoded values. `None` means the encoding requires an
  945 |     /// external count or cannot safely prove one from this payload.
  946 |     fn infer_num_values(&self, _data: &LanceBuffer) -> Result<Option<u64>> {
  947 |         Ok(None)
  948 |     }
  949 | }
  950 | 
  951 | pub(crate) fn require_block_payload(data: Option<LanceBuffer>, codec: &str) -> Result<LanceBuffer> {
  952 |     data.ok_or_else(|| Error::invalid_input(format!("{codec} requires one payload")))
  953 | }
  954 | 
  955 | pub(crate) fn require_no_block_payload(data: Option<LanceBuffer>, codec: &str) -> Result<()> {
  956 |     if data.is_some() {
  957 |         return Err(Error::invalid_input(format!("{codec} expects no payload")));
  958 |     }
  959 |     Ok(())
  960 | }
  961 | 
  962 | pub trait DecompressionStrategy: std::fmt::Debug + Send + Sync {
  963 |     fn create_miniblock_decompressor(
  964 |         &self,
  965 |         description: &CompressiveEncoding,
  966 |         decompression_strategy: &dyn DecompressionStrategy,
  967 |     ) -> Result<Box<dyn MiniBlockDecompressor>>;
  968 | 
  969 |     fn create_fixed_per_value_decompressor(
  970 |         &self,
  971 |         description: &CompressiveEncoding,
  972 |     ) -> Result<Box<dyn FixedPerValueDecompressor>>;
  973 | 
  974 |     fn create_variable_per_value_decompressor(
  975 |         &self,
  976 |         description: &CompressiveEncoding,
  977 |     ) -> Result<Box<dyn VariablePerValueDecompressor>>;
  978 | 
  979 |     fn create_block_decompressor(
  980 |         &self,
  981 |         description: &CompressiveEncoding,
  982 |     ) -> Result<Box<dyn BlockDecompressor>>;
  983 | }
  984 | 
  985 | #[derive(Debug, Default)]
  986 | pub struct DefaultDecompressionStrategy {}
  987 | 
  988 | impl DecompressionStrategy for DefaultDecompressionStrategy {
  989 |     fn create_miniblock_decompressor(
  990 |         &self,
  991 |         description: &CompressiveEncoding,
  992 |         decompression_strategy: &dyn DecompressionStrategy,
  993 |     ) -> Result<Box<dyn MiniBlockDecompressor>> {
  994 |         match description.compression.as_ref().unwrap() {
  995 |             Compression::Flat(flat) => Ok(Box::new(ValueDecompressor::from_flat(flat))),
  996 |             #[cfg(feature = "bitpacking")]
  997 |             Compression::InlineBitpacking(description) => {
  998 |                 Ok(Box::new(InlineBitpacking::from_description(description)))
  999 |             }
 1000 |             #[cfg(not(feature = "bitpacking"))]
 1001 |             Compression::InlineBitpacking(_) => Err(Error::not_supported_source(
 1002 |                 "this runtime was not built with bitpacking support".into(),
 1003 |             )),
 1004 |             Compression::Variable(variable) => {
 1005 |                 let Compression::Flat(offsets) = variable
 1006 |                     .offsets
 1007 |                     .as_ref()
 1008 |                     .unwrap()
 1009 |                     .compression
 1010 |                     .as_ref()
 1011 |                     .unwrap()
 1012 |                 else {
 1013 |                     panic!("Variable compression only supports flat offsets")
 1014 |                 };
 1015 |                 Ok(Box::new(BinaryMiniBlockDecompressor::new(
 1016 |                     offsets.bits_per_value as u8,
 1017 |                 )))
 1018 |             }
 1019 |             Compression::Fsst(description) => {
 1020 |                 let inner_decompressor = decompression_strategy.create_miniblock_decompressor(
 1021 |                     description.values.as_ref().unwrap(),
 1022 |                     decompression_strategy,
 1023 |                 )?;
 1024 |                 Ok(Box::new(FsstMiniBlockDecompressor::new(
 1025 |                     description,
 1026 |                     inner_decompressor,
 1027 |                 )))
 1028 |             }
 1029 |             Compression::PackedStruct(description) => Ok(Box::new(
 1030 |                 PackedStructFixedWidthMiniBlockDecompressor::new(description),
 1031 |             )),
 1032 |             Compression::VariablePackedStruct(_) => Err(Error::not_supported_source(
 1033 |                 "variable packed struct decoding is not yet implemented".into(),
 1034 |             )),
 1035 |             Compression::FixedSizeList(fsl) => {
 1036 |                 // In the future, we might need to do something more complex here if FSL supports
 1037 |                 // compression.
 1038 |                 Ok(Box::new(ValueDecompressor::from_fsl(fsl)?))
 1039 |             }
 1040 |             Compression::Rle(rle) => Ok(Box::new(create_rle_decompressor(
 1041 |                 rle,
 1042 |                 decompression_strategy,
 1043 |             )?)),
 1044 |             Compression::ByteStreamSplit(bss) => {
 1045 |                 let Compression::Flat(values) =
 1046 |                     bss.values.as_ref().unwrap().compression.as_ref().unwrap()
 1047 |                 else {
 1048 |                     panic!("ByteStreamSplit compression only supports flat values")
 1049 |                 };
 1050 |                 Ok(Box::new(ByteStreamSplitDecompressor::new(
 1051 |                     values.bits_per_value as usize,
 1052 |                 )))
 1053 |             }
 1054 |             Compression::General(general) => {
 1055 |                 // Create inner decompressor
 1056 |                 let inner_decompressor = self.create_miniblock_decompressor(
 1057 |                     general.values.as_ref().ok_or_else(|| {
 1058 |                         Error::invalid_input("GeneralMiniBlock missing inner encoding")
 1059 |                     })?,
 1060 |                     decompression_strategy,
 1061 |                 )?;
 1062 | 
 1063 |                 // Parse compression config
 1064 |                 let compression = general.compression.as_ref().ok_or_else(|| {
 1065 |                     Error::invalid_input("GeneralMiniBlock missing compression config")
 1066 |                 })?;
 1067 | 
 1068 |                 let scheme = compression.scheme().try_into()?;
 1069 | 
 1070 |                 let compression_config = CompressionConfig::new(scheme, compression.level);
 1071 | 
 1072 |                 Ok(Box::new(GeneralMiniBlockDecompressor::new(
 1073 |                     inner_decompressor,
 1074 |                     compression_config,
 1075 |                 )))
 1076 |             }
 1077 |             _ => todo!(),
 1078 |         }
 1079 |     }
 1080 | 
 1081 |     fn create_fixed_per_value_decompressor(
 1082 |         &self,
 1083 |         description: &CompressiveEncoding,
 1084 |     ) -> Result<Box<dyn FixedPerValueDecompressor>> {
 1085 |         match description.compression.as_ref().unwrap() {
 1086 |             Compression::Constant(constant) => Ok(Box::new(ConstantDecompressor::new(
 1087 |                 constant
 1088 |                     .value
 1089 |                     .as_ref()
 1090 |                     .map(|v| LanceBuffer::from_bytes(v.clone(), 1)),
 1091 |             ))),
 1092 |             Compression::Flat(flat) => Ok(Box::new(ValueDecompressor::from_flat(flat))),
 1093 |             Compression::FixedSizeList(fsl) => Ok(Box::new(ValueDecompressor::from_fsl(fsl)?)),
 1094 |             Compression::PackedStruct(description) => Ok(Box::new(
 1095 |                 PackedStructFixedPerValueDecompressor::new(description)?,
 1096 |             )),
 1097 |             _ => todo!("fixed-per-value decompressor for {:?}", description),
 1098 |         }
 1099 |     }
 1100 | 
 1101 |     fn create_variable_per_value_decompressor(
 1102 |         &self,
 1103 |         description: &CompressiveEncoding,
 1104 |     ) -> Result<Box<dyn VariablePerValueDecompressor>> {
 1105 |         match description.compression.as_ref().unwrap() {
 1106 |             Compression::Variable(variable) => {
 1107 |                 let Compression::Flat(offsets) = variable
 1108 |                     .offsets
 1109 |                     .as_ref()
 1110 |                     .unwrap()
 1111 |                     .compression
 1112 |                     .as_ref()
 1113 |                     .unwrap()
 1114 |                 else {
 1115 |                     panic!("Variable compression only supports flat offsets")
 1116 |                 };
 1117 |                 assert!(offsets.bits_per_value < u8::MAX as u64);
 1118 |                 Ok(Box::new(VariableDecoder::default()))
 1119 |             }
 1120 |             Compression::Fsst(fsst) => Ok(Box::new(FsstPerValueDecompressor::new(
 1121 |                 LanceBuffer::from_bytes(fsst.symbol_table.clone(), 1),
 1122 |                 Box::new(VariableDecoder::default()),
 1123 |             ))),
 1124 |             Compression::General(general) => Ok(Box::new(CompressedBufferEncoder::from_scheme(
 1125 |                 general.compression.as_ref().expect_ok()?.scheme(),
 1126 |             )?)),
 1127 |             Compression::VariablePackedStruct(description) => {
 1128 |                 let mut fields = Vec::with_capacity(description.fields.len());
 1129 |                 for field in &description.fields {
 1130 |                     let value_encoding = field.value.as_ref().ok_or_else(|| {
 1131 |                         Error::invalid_input("VariablePackedStruct field is missing value encoding")
 1132 |                     })?;
 1133 |                     let decoder = match field.layout.as_ref().ok_or_else(|| {
 1134 |                         Error::invalid_input("VariablePackedStruct field is missing layout details")
 1135 |                     })? {
 1136 |                         crate::format::pb21::variable_packed_struct::field_encoding::Layout::BitsPerValue(
 1137 |                             bits_per_value,
 1138 |                         ) => {
 1139 |                             let decompressor =
 1140 |                                 self.create_fixed_per_value_decompressor(value_encoding)?;
 1141 |                             VariablePackedStructFieldDecoder {
 1142 |                                 kind: VariablePackedStructFieldKind::Fixed {
 1143 |                                     bits_per_value: *bits_per_value,
 1144 |                                     decompressor: Arc::from(decompressor),
 1145 |                                 },
 1146 |                             }
 1147 |                         }
 1148 |                         crate::format::pb21::variable_packed_struct::field_encoding::Layout::BitsPerLength(
 1149 |                             bits_per_length,
 1150 |                         ) => {
 1151 |                             let decompressor =
 1152 |                                 self.create_variable_per_value_decompressor(value_encoding)?;
 1153 |                             VariablePackedStructFieldDecoder {
 1154 |                                 kind: VariablePackedStructFieldKind::Variable {
 1155 |                                     bits_per_length: *bits_per_length,
 1156 |                                     decompressor: Arc::from(decompressor),
 1157 |                                 },
 1158 |                             }
 1159 |                         }
 1160 |                     };
 1161 |                     fields.push(decoder);
 1162 |                 }
 1163 |                 Ok(Box::new(PackedStructVariablePerValueDecompressor::new(
 1164 |                     fields,
 1165 |                 )))
 1166 |             }
 1167 |             _ => todo!("variable-per-value decompressor for {:?}", description),
 1168 |         }
 1169 |     }
 1170 | 
 1171 |     fn create_block_decompressor(
 1172 |         &self,
 1173 |         description: &CompressiveEncoding,
 1174 |     ) -> Result<Box<dyn BlockDecompressor>> {
 1175 |         match description.compression.as_ref().unwrap() {
 1176 |             Compression::InlineBitpacking(inline_bitpacking) => Ok(Box::new(
 1177 |                 InlineBitpacking::from_description(inline_bitpacking),
 1178 |             )),
 1179 |             Compression::Flat(flat) => Ok(Box::new(ValueDecompressor::from_flat(flat))),
 1180 |             Compression::Constant(constant) => {
 1181 |                 let scalar = constant
 1182 |                     .value
 1183 |                     .as_ref()
 1184 |                     .map(|v| LanceBuffer::from_bytes(v.clone(), 1));
 1185 |                 Ok(Box::new(ConstantDecompressor::new(scalar)))
 1186 |             }
 1187 |             Compression::Variable(_) => Ok(Box::new(BinaryBlockDecompressor::default())),
 1188 |             Compression::FixedSizeList(fsl) => {
 1189 |                 Ok(Box::new(ValueDecompressor::from_fsl(fsl.as_ref())?))
 1190 |             }
 1191 |             Compression::OutOfLineBitpacking(out_of_line) => {
 1192 |                 // Extract the compressed bit width from the values encoding
 1193 |                 let compressed_bit_width = match out_of_line
 1194 |                     .values
 1195 |                     .as_ref()
 1196 |                     .unwrap()
 1197 |                     .compression
 1198 |                     .as_ref()
 1199 |                     .unwrap()
 1200 |                 {
 1201 |                     Compression::Flat(flat) => flat.bits_per_value,
 1202 |                     _ => {
 1203 |                         return Err(Error::invalid_input_source(
 1204 |                             "OutOfLineBitpacking values must use Flat encoding".into(),
 1205 |                         ));
 1206 |                     }
 1207 |                 };
 1208 |                 Ok(Box::new(OutOfLineBitpacking::new(
 1209 |                     compressed_bit_width,
 1210 |                     out_of_line.uncompressed_bits_per_value,
 1211 |                 )))
 1212 |             }
 1213 |             Compression::General(general) => {
 1214 |                 let inner_desc = general
 1215 |                     .values
 1216 |                     .as_ref()
 1217 |                     .ok_or_else(|| {
 1218 |                         Error::invalid_input("General compression missing inner encoding")
 1219 |                     })?
 1220 |                     .as_ref();
 1221 |                 let inner_decompressor = self.create_block_decompressor(inner_desc)?;
 1222 | 
 1223 |                 let compression = general.compression.as_ref().ok_or_else(|| {
 1224 |                     Error::invalid_input("General compression missing compression config")
 1225 |                 })?;
 1226 |                 let scheme = compression.scheme().try_into()?;
 1227 |                 let config = CompressionConfig::new(scheme, compression.level);
 1228 |                 let general_decompressor =
 1229 |                     GeneralBlockDecompressor::try_new(inner_decompressor, config)?;
 1230 | 
 1231 |                 Ok(Box::new(general_decompressor))
 1232 |             }
 1233 |             Compression::Rle(rle) => Ok(Box::new(create_rle_decompressor(rle, self)?)),
 1234 |             _ => todo!(),
 1235 |         }
 1236 |     }
 1237 | }
 1238 | pub(crate) fn create_rle_decompressor(
 1239 |     rle: &crate::format::pb21::Rle,
 1240 |     decompression_strategy: &dyn DecompressionStrategy,
 1241 | ) -> Result<RleDecompressor> {
 1242 |     let values = rle
 1243 |         .values
 1244 |         .as_ref()
 1245 |         .ok_or_else(|| Error::invalid_input("RLE compression missing values encoding"))?;
 1246 |     let run_lengths = rle
 1247 |         .run_lengths
 1248 |         .as_ref()
 1249 |         .ok_or_else(|| Error::invalid_input("RLE compression missing run lengths encoding"))?;
 1250 | 
 1251 |     let values = create_rle_child_decompressor(values, "values", decompression_strategy)?;
 1252 |     let run_lengths =
 1253 |         create_rle_child_decompressor(run_lengths, "run lengths", decompression_strategy)?;
 1254 | 
 1255 |     if !matches!(values.bits_per_value(), 8 | 16 | 32 | 64) {
 1256 |         return Err(Error::invalid_input(format!(
 1257 |             "RLE compression only supports 8, 16, 32, or 64-bit values, got {}",
 1258 |             values.bits_per_value()
 1259 |         )));
 1260 |     }
 1261 | 
 1262 |     let run_length_width =
 1263 |         RunLengthWidth::from_bits(run_lengths.bits_per_value()).ok_or_else(|| {
 1264 |             Error::invalid_input(format!(
 1265 |                 "RLE compression only supports 8, 16, or 32-bit run lengths, got {}",
 1266 |                 run_lengths.bits_per_value()
 1267 |             ))
 1268 |         })?;
 1269 | 
 1270 |     if values.requires_num_values() && run_lengths.requires_num_values() {
 1271 |         return Err(Error::invalid_input(
 1272 |             "RLE values and run lengths child encodings cannot both require the run count",
 1273 |         ));
 1274 |     }
 1275 | 
 1276 |     if values.is_identity() && run_lengths.is_identity() {
 1277 |         return Ok(RleDecompressor::with_run_length_width(
 1278 |             values.bits_per_value(),
 1279 |             run_length_width,
 1280 |         ));
 1281 |     }
 1282 | 
 1283 |     Ok(RleDecompressor::with_child_decompressors(
 1284 |         values.bits_per_value(),
 1285 |         run_length_width,
 1286 |         values,
 1287 |         run_lengths,
 1288 |     ))
 1289 | }
 1290 | 
 1291 | fn create_rle_child_decompressor(
 1292 |     encoding: &CompressiveEncoding,
 1293 |     role: &str,
 1294 |     decompression_strategy: &dyn DecompressionStrategy,
 1295 | ) -> Result<RleChildDecompressor> {
 1296 |     let compression = encoding
 1297 |         .compression
 1298 |         .as_ref()
 1299 |         .ok_or_else(|| Error::invalid_input(format!("RLE {role} missing child compression")))?;
 1300 |     let (bits_per_value, requires_num_values, needs_decompressor) =
 1301 |         validate_rle_child_compression(compression, role)?;
 1302 | 
 1303 |     if needs_decompressor {
 1304 |         Ok(RleChildDecompressor::block(
 1305 |             bits_per_value,
 1306 |             decompression_strategy.create_block_decompressor(encoding)?,
 1307 |             requires_num_values,
 1308 |         ))
 1309 |     } else {
 1310 |         Ok(RleChildDecompressor::flat(bits_per_value))
 1311 |     }
 1312 | }
 1313 | 
 1314 | fn validate_rle_child_compression(
 1315 |     compression: &Compression,
 1316 |     role: &str,
 1317 | ) -> Result<(u64, bool, bool)> {
 1318 |     match compression {
 1319 |         Compression::Flat(flat) => Ok((flat.bits_per_value, false, false)),
 1320 |         Compression::General(general) => {
 1321 |             general.compression.as_ref().ok_or_else(|| {
 1322 |                 Error::invalid_input(format!(
 1323 |                     "RLE {role} general child missing compression config"
 1324 |                 ))
 1325 |             })?;
 1326 |             let values = general.values.as_ref().ok_or_else(|| {
 1327 |                 Error::invalid_input(format!("RLE {role} general child missing inner encoding"))
 1328 |             })?;
 1329 |             let inner = values.compression.as_ref().ok_or_else(|| {
 1330 |                 Error::invalid_input(format!(
 1331 |                     "RLE {role} general child missing inner compression"
 1332 |                 ))
 1333 |             })?;
 1334 |             let (bits_per_value, requires_num_values) =
 1335 |                 validate_rle_block_child_inner(inner, role)?;
 1336 |             Ok((bits_per_value, requires_num_values, true))
 1337 |         }
 1338 |         Compression::OutOfLineBitpacking(out_of_line) => {
 1339 |             let values = out_of_line.values.as_ref().ok_or_else(|| {
 1340 |                 Error::invalid_input(format!(
 1341 |                     "RLE {role} bitpacking child missing values encoding"
 1342 |                 ))
 1343 |             })?;
 1344 |             let Compression::Flat(_) = values.compression.as_ref().ok_or_else(|| {
 1345 |                 Error::invalid_input(format!(
 1346 |                     "RLE {role} bitpacking child missing values compression"
 1347 |                 ))
 1348 |             })?
 1349 |             else {
 1350 |                 return Err(Error::invalid_input(format!(
 1351 |                     "RLE {role} bitpacking child only supports flat values"
 1352 |                 )));
 1353 |             };
 1354 |             Ok((out_of_line.uncompressed_bits_per_value, true, true))
 1355 |         }
 1356 |         other => Err(Error::invalid_input(format!(
 1357 |             "RLE {role} only supports flat, general, or out-of-line bitpacking child encodings, got {}",
 1358 |             compression_name(other)
 1359 |         ))),
 1360 |     }
 1361 | }
 1362 | 
 1363 | fn validate_rle_block_child_inner(compression: &Compression, role: &str) -> Result<(u64, bool)> {
 1364 |     match compression {
 1365 |         Compression::Flat(flat) => Ok((flat.bits_per_value, false)),
 1366 |         Compression::OutOfLineBitpacking(out_of_line) => {
 1367 |             let values = out_of_line.values.as_ref().ok_or_else(|| {
 1368 |                 Error::invalid_input(format!(
 1369 |                     "RLE {role} bitpacking child missing values encoding"
 1370 |                 ))
 1371 |             })?;
 1372 |             let Compression::Flat(_) = values.compression.as_ref().ok_or_else(|| {
 1373 |                 Error::invalid_input(format!(
 1374 |                     "RLE {role} bitpacking child missing values compression"
 1375 |                 ))
 1376 |             })?
 1377 |             else {
 1378 |                 return Err(Error::invalid_input(format!(
 1379 |                     "RLE {role} bitpacking child only supports flat values"
 1380 |                 )));
 1381 |             };
 1382 |             Ok((out_of_line.uncompressed_bits_per_value, true))
 1383 |         }
 1384 |         other => Err(Error::invalid_input(format!(
 1385 |             "RLE {role} general child only supports flat or out-of-line bitpacking inner encodings, got {}",
 1386 |             compression_name(other)
 1387 |         ))),
 1388 |     }
 1389 | }
 1390 | 
 1391 | fn compression_name(compression: &Compression) -> &'static str {
 1392 |     match compression {
 1393 |         Compression::Flat(_) => "flat",
 1394 |         Compression::Variable(_) => "variable",
 1395 |         Compression::Fsst(_) => "fsst",
 1396 |         Compression::OutOfLineBitpacking(_) => "out-of-line bitpacking",
 1397 |         Compression::InlineBitpacking(_) => "inline bitpacking",
 1398 |         Compression::General(_) => "general",
 1399 |         Compression::Constant(_) => "constant",
 1400 |         Compression::Dictionary(_) => "dictionary",
 1401 |         Compression::ByteStreamSplit(_) => "byte stream split",
 1402 |         Compression::PackedStruct(_) => "packed struct",
 1403 |         Compression::FixedSizeList(_) => "fixed-size list",
 1404 |         Compression::VariablePackedStruct(_) => "variable packed struct",
 1405 |         Compression::Rle(_) => "rle",
 1406 |     }
 1407 | }
 1408 | 
 1409 | #[cfg(test)]
 1410 | mod tests {
 1411 |     use super::*;
 1412 |     use crate::buffer::LanceBuffer;
 1413 |     use crate::compression_config::CompressionParams;
 1414 |     use crate::data::{BlockInfo, DataBlock, FixedWidthDataBlock};
 1415 |     use crate::encodings::logical::primitive::miniblock::MiniBlockCompressionContext;
 1416 |     use crate::statistics::ComputeStat;
 1417 |     use crate::testing::{TestEncoding, extract_array_encoding_chain, test_compression_strategy};
 1418 |     use arrow_schema::{DataType, Field as ArrowField};
 1419 |     use std::collections::HashMap;
 1420 | 
 1421 |     fn strategy(encoding: TestEncoding, params: CompressionParams) -> Arc<dyn CompressionStrategy> {
 1422 |         test_compression_strategy(encoding, params)
 1423 |     }
 1424 | 
 1425 |     fn baseline_strategy(params: CompressionParams) -> Arc<dyn CompressionStrategy> {
 1426 |         strategy(TestEncoding::StructuralU16, params)
 1427 |     }
 1428 | 
 1429 |     fn selected_block_codec(
 1430 |         strategy: &Arc<dyn CompressionStrategy>,
 1431 |         field: &Field,
 1432 |         data: &DataBlock,
 1433 |     ) -> (Box<dyn BlockCompressor>, CompressiveEncoding) {
 1434 |         let compressor = strategy.create_block_compressor(field, data).unwrap();
 1435 |         let (_, encoding) = compressor.compress(data.clone()).unwrap();
 1436 |         (compressor, encoding)
 1437 |     }
 1438 | 
 1439 |     fn miniblock_context() -> MiniBlockCompressionContext {
 1440 |         MiniBlockCompressionContext::new(0, true, true)
 1441 |     }
 1442 | 
 1443 |     fn create_test_field(name: &str, data_type: DataType) -> Field {
 1444 |         let arrow_field = ArrowField::new(name, data_type, true);
 1445 |         let mut field = Field::try_from(&arrow_field).unwrap();
 1446 |         field.id = -1;
 1447 |         field
 1448 |     }
 1449 | 
 1450 |     fn create_fixed_width_block_with_stats(
 1451 |         bits_per_value: u64,
 1452 |         num_values: u64,
 1453 |         run_count: u64,
 1454 |     ) -> DataBlock {
 1455 |         // Create varied data to avoid low entropy
 1456 |         let bytes_per_value = (bits_per_value / 8) as usize;
 1457 |         let total_bytes = bytes_per_value * num_values as usize;
 1458 |         let mut data = vec![0u8; total_bytes];
 1459 | 
 1460 |         // Create data with specified run count
 1461 |         let values_per_run = (num_values / run_count).max(1);
 1462 |         let mut run_value = 0u8;
 1463 | 
 1464 |         for i in 0..num_values as usize {
 1465 |             if i % values_per_run as usize == 0 {
 1466 |                 run_value = run_value.wrapping_add(17); // Use prime to get varied values
 1467 |             }
 1468 |             // Fill all bytes of the value to create high entropy
 1469 |             for j in 0..bytes_per_value {
 1470 |                 let byte_offset = i * bytes_per_value + j;
 1471 |                 if byte_offset < data.len() {
 1472 |                     data[byte_offset] = run_value.wrapping_add(j as u8);
 1473 |                 }
 1474 |             }
 1475 |         }
 1476 | 
 1477 |         let mut block = FixedWidthDataBlock {
 1478 |             bits_per_value,
 1479 |             data: LanceBuffer::reinterpret_vec(data),
 1480 |             num_values,
 1481 |             block_info: BlockInfo::default(),
 1482 |         };
 1483 | 
 1484 |         // Compute all statistics including BytePositionEntropy
 1485 |         use crate::statistics::ComputeStat;
 1486 |         block.compute_stat();
 1487 | 
 1488 |         DataBlock::FixedWidth(block)
 1489 |     }
 1490 | 
 1491 |     fn create_fixed_width_block(bits_per_value: u64, num_values: u64) -> DataBlock {
 1492 |         // Create data with some variety to avoid always triggering BSS
 1493 |         let bytes_per_value = (bits_per_value / 8) as usize;
 1494 |         let total_bytes = bytes_per_value * num_values as usize;
 1495 |         let mut data = vec![0u8; total_bytes];
 1496 | 
 1497 |         // Add some variation to the data to make it more realistic
 1498 |         for i in 0..num_values as usize {
 1499 |             let byte_offset = i * bytes_per_value;
 1500 |             if byte_offset < data.len() {
 1501 |                 data[byte_offset] = (i % 256) as u8;
 1502 |             }
 1503 |         }
 1504 | 
 1505 |         let mut block = FixedWidthDataBlock {
 1506 |             bits_per_value,
 1507 |             data: LanceBuffer::reinterpret_vec(data),
 1508 |             num_values,
 1509 |             block_info: BlockInfo::default(),
 1510 |         };
 1511 | 
 1512 |         // Compute all statistics including BytePositionEntropy
 1513 |         use crate::statistics::ComputeStat;
 1514 |         block.compute_stat();
 1515 | 
 1516 |         DataBlock::FixedWidth(block)
 1517 |     }
 1518 | 
 1519 |     fn rle_run_length_bits(encoding: &CompressiveEncoding) -> u64 {
 1520 |         let Compression::Rle(rle) = encoding.compression.as_ref().unwrap() else {
 1521 |             panic!("expected RLE encoding");
 1522 |         };
 1523 |         let Compression::Flat(run_lengths) = rle
 1524 |             .run_lengths
 1525 |             .as_ref()
 1526 |             .unwrap()
 1527 |             .compression
 1528 |             .as_ref()
 1529 |             .unwrap()
 1530 |         else {
 1531 |             panic!("expected flat run lengths");
 1532 |         };
 1533 |         run_lengths.bits_per_value
 1534 |     }
 1535 | 
 1536 |     fn expect_rle_encoding(encoding: &CompressiveEncoding) -> &crate::format::pb21::Rle {
 1537 |         match encoding.compression.as_ref().unwrap() {
 1538 |             Compression::Rle(rle) => rle,
 1539 |             Compression::General(general) => {
 1540 |                 let inner = general.values.as_ref().unwrap();
 1541 |                 let Compression::Rle(rle) = inner.compression.as_ref().unwrap() else {
 1542 |                     panic!("expected wrapped RLE encoding");
 1543 |                 };
 1544 |                 rle
 1545 |             }
 1546 |             other => panic!("expected RLE encoding, got {}", compression_name(other)),
 1547 |         }
 1548 |     }
 1549 | 
 1550 |     fn create_variable_width_block(
 1551 |         bits_per_offset: u8,
 1552 |         num_values: u64,
 1553 |         avg_value_size: usize,
 1554 |     ) -> DataBlock {
 1555 |         use crate::statistics::ComputeStat;
 1556 | 
 1557 |         // Create offsets buffer (num_values + 1 offsets)
 1558 |         let mut offsets = Vec::with_capacity((num_values + 1) as usize);
 1559 |         let mut current_offset = 0i64;
 1560 |         offsets.push(current_offset);
 1561 | 
 1562 |         // Generate offsets with varying value sizes
 1563 |         for i in 0..num_values {
 1564 |             let value_size = if avg_value_size == 0 {
 1565 |                 1
 1566 |             } else {
 1567 |                 ((avg_value_size as i64 + (i as i64 % 8) - 4).max(1) as usize)
 1568 |                     .min(avg_value_size * 2)
 1569 |             };
 1570 |             current_offset += value_size as i64;
 1571 |             offsets.push(current_offset);
 1572 |         }
 1573 | 
 1574 |         // Create data buffer with realistic content
 1575 |         let total_data_size = current_offset as usize;
 1576 |         let mut data = vec![0u8; total_data_size];
 1577 | 
 1578 |         // Fill data with varied content
 1579 |         for i in 0..num_values {
 1580 |             let start_offset = offsets[i as usize] as usize;
 1581 |             let end_offset = offsets[(i + 1) as usize] as usize;
 1582 | 
 1583 |             let content = (i % 256) as u8;
 1584 |             for j in 0..end_offset - start_offset {
 1585 |                 data[start_offset + j] = content.wrapping_add(j as u8);
 1586 |             }
 1587 |         }
 1588 | 
 1589 |         // Convert offsets to appropriate lance buffer
 1590 |         let offsets_buffer = match bits_per_offset {
 1591 |             32 => {
 1592 |                 let offsets_32: Vec<i32> = offsets.iter().map(|&o| o as i32).collect();
 1593 |                 LanceBuffer::reinterpret_vec(offsets_32)
 1594 |             }
 1595 |             64 => LanceBuffer::reinterpret_vec(offsets),
 1596 |             _ => panic!("Unsupported bits_per_offset: {}", bits_per_offset),
 1597 |         };
 1598 | 
 1599 |         let mut block = VariableWidthBlock {
 1600 |             data: LanceBuffer::from(data),
 1601 |             offsets: offsets_buffer,
 1602 |             bits_per_offset,
 1603 |             num_values,
 1604 |             block_info: BlockInfo::default(),
 1605 |         };
 1606 | 
 1607 |         block.compute_stat();
 1608 |         DataBlock::VariableWidth(block)
 1609 |     }
 1610 | 
 1611 |     fn create_fsst_candidate_variable_width_block() -> DataBlock {
 1612 |         create_variable_width_block(32, 4096, FSST_LEAST_INPUT_MAX_LENGTH as usize + 16)
 1613 |     }
 1614 | 
 1615 |     #[test]
 1616 |     fn test_parameter_based_compression() {
 1617 |         let mut params = CompressionParams::new();
 1618 | 
 1619 |         // Configure RLE for ID columns with BSS explicitly disabled
 1620 |         params.columns.insert(
 1621 |             "*_id".to_string(),
 1622 |             CompressionFieldParams {
 1623 |                 rle_threshold: Some(0.3),
 1624 |                 compression: Some("lz4".to_string()),
 1625 |                 compression_level: None,
 1626 |                 bss: Some(BssMode::Off), // Explicitly disable BSS to test RLE
 1627 |                 minichunk_size: None,
 1628 |             },
 1629 |         );
 1630 | 
 1631 |         let strategy = baseline_strategy(params);
 1632 |         let field = create_test_field("user_id", DataType::Int32);
 1633 | 
 1634 |         // Create data with low run count for RLE
 1635 |         // Use create_fixed_width_block_with_stats which properly sets run count
 1636 |         let data = create_fixed_width_block_with_stats(32, 1000, 100); // 100 runs out of 1000 values
 1637 | 
 1638 |         let compressor = strategy.create_miniblock_compressor(&field, &data).unwrap();
 1639 |         // Should use RLE due to low threshold (0.3) and low run count (100/1000 = 0.1)
 1640 |         let debug_str = format!("{:?}", compressor);
 1641 | 
 1642 |         // The compressor should be RLE wrapped in general compression
 1643 |         assert!(debug_str.contains("GeneralMiniBlockCompressor"));
 1644 |         assert!(debug_str.contains("RleEncoder"));
 1645 |     }
 1646 | 
 1647 |     #[test]
 1648 |     fn test_type_level_parameters() {
 1649 |         let mut params = CompressionParams::new();
 1650 | 
 1651 |         // Configure all Int32 to use specific settings
 1652 |         params.types.insert(
 1653 |             "Int32".to_string(),
 1654 |             CompressionFieldParams {
 1655 |                 rle_threshold: Some(0.1), // Very low threshold
 1656 |                 compression: Some("zstd".to_string()),
 1657 |                 compression_level: Some(3),
 1658 |                 bss: Some(BssMode::Off), // Disable BSS to test RLE
 1659 |                 minichunk_size: None,
 1660 |             },
 1661 |         );
 1662 | 
 1663 |         let strategy = baseline_strategy(params);
 1664 |         let field = create_test_field("some_column", DataType::Int32);
 1665 |         // Create data with very low run count (50 runs for 1000 values = 0.05 ratio)
 1666 |         let data = create_fixed_width_block_with_stats(32, 1000, 50);
 1667 | 
 1668 |         let compressor = strategy.create_miniblock_compressor(&field, &data).unwrap();
 1669 |         // Should use RLE due to very low threshold
 1670 |         assert!(format!("{:?}", compressor).contains("RleEncoder"));
 1671 |     }
 1672 | 
 1673 |     // Regression for #6626: an all-zero stat segment (e.g. rep/def for a long
 1674 |     // run of empty lists) used to disable block bitpacking entirely.
 1675 |     #[test]
 1676 |     #[cfg(feature = "bitpacking")]
 1677 |     fn test_block_bitpacks_with_zero_segment() {
 1678 |         let strategy = baseline_strategy(CompressionParams::default());
 1679 |         let field = create_test_field("levels", DataType::UInt16);
 1680 | 
 1681 |         // First 1024 zeros, then 1024 ones; max bit width is 1.
 1682 |         let mut values: Vec<u16> = vec![0; 1024];
 1683 |         values.extend(std::iter::repeat_n(1u16, 1024));
 1684 |         let mut block = FixedWidthDataBlock {
 1685 |             bits_per_value: 16,
 1686 |             data: LanceBuffer::reinterpret_vec(values),
 1687 |             num_values: 2048,
 1688 |             block_info: BlockInfo::default(),
 1689 |         };
 1690 |         block.compute_stat();
 1691 |         let data = DataBlock::FixedWidth(block);
 1692 | 
 1693 |         let compressor = strategy.create_block_compressor(&field, &data).unwrap();
 1694 |         let debug_str = format!("{:?}", compressor);
 1695 |         assert!(
 1696 |             debug_str.contains("OutOfLineBitpacking"),
 1697 |             "expected OutOfLineBitpacking, got: {debug_str}"
 1698 |         );
 1699 |     }
 1700 | 
 1701 |     #[rstest::rstest]
 1702 |     #[case::runt_tail(1600)]
 1703 |     #[case::whole_chunks(2048)]
 1704 |     #[cfg(feature = "bitpacking")]
 1705 |     fn test_block_skips_full_width_bitpacking(#[case] num_values: usize) {
 1706 |         let mut block = FixedWidthDataBlock {
 1707 |             bits_per_value: 64,
 1708 |             data: LanceBuffer::reinterpret_vec(vec![-1_i64; num_values]),
 1709 |             num_values: num_values as u64,
 1710 |             block_info: BlockInfo::default(),
 1711 |         };
 1712 |         block.compute_stat();
 1713 | 
 1714 |         assert!(try_bitpacking_block(&DataBlock::FixedWidth(block)).is_none());
 1715 |     }
 1716 | 
 1717 |     #[test]
 1718 |     fn test_rle_block_accounts_for_header_before_selecting() {
 1719 |         let strategy = strategy(TestEncoding::StructuralSparse, CompressionParams::default());
 1720 |         let field = create_test_field("small_constant", DataType::Int32);
 1721 |         let values = vec![42i32; 2];
 1722 |         let mut block = FixedWidthDataBlock {
 1723 |             bits_per_value: 32,
 1724 |             data: LanceBuffer::reinterpret_vec(values),
 1725 |             num_values: 2,
 1726 |             block_info: BlockInfo::default(),
 1727 |         };
 1728 |         block.compute_stat();
 1729 |         let data = DataBlock::FixedWidth(block);
 1730 | 
 1731 |         let (compressor, encoding) = selected_block_codec(&strategy, &field, &data);
 1732 | 
 1733 |         assert!(format!("{compressor:?}").contains("ValueEncoder"));
 1734 |         assert!(matches!(
 1735 |             encoding.compression.as_ref(),
 1736 |             Some(Compression::Flat(_))
 1737 |         ));
 1738 |     }
 1739 | 
 1740 |     #[test]
 1741 |     #[cfg(feature = "bitpacking")]
 1742 |     fn test_rle_block_prefers_bitpacking_when_smaller() {
 1743 |         let strategy = strategy(TestEncoding::StructuralSparse, CompressionParams::default());
 1744 |         let field = create_test_field("levels", DataType::UInt16);
 1745 | 
 1746 |         let mut values = Vec::with_capacity(2048);
 1747 |         for run_idx in 0..1024 {
 1748 |             values.extend(std::iter::repeat_n((run_idx % 2) as u16, 2));
 1749 |         }
 1750 |         let mut block = FixedWidthDataBlock {
 1751 |             bits_per_value: 16,
 1752 |             data: LanceBuffer::reinterpret_vec(values),
 1753 |             num_values: 2048,
 1754 |             block_info: BlockInfo::default(),
 1755 |         };
 1756 |         block.compute_stat();
 1757 |         let data = DataBlock::FixedWidth(block);
 1758 | 
 1759 |         let (compressor, encoding) = selected_block_codec(&strategy, &field, &data);
 1760 |         let debug_str = format!("{compressor:?}");
 1761 |         assert!(
 1762 |             debug_str.contains("OutOfLineBitpacking"),
 1763 |             "expected OutOfLineBitpacking, got: {debug_str}"
 1764 |         );
 1765 |         assert!(matches!(
 1766 |             encoding.compression.as_ref(),
 1767 |             Some(Compression::OutOfLineBitpacking(_))
 1768 |         ));
 1769 |     }
 1770 | 
 1771 |     #[test]
 1772 |     #[cfg(feature = "bitpacking")]
 1773 |     fn test_low_cardinality_prefers_bitpacking_over_rle() {
 1774 |         let strategy = baseline_strategy(CompressionParams::default());
 1775 |         let field = create_test_field("int_score", DataType::Int64);
 1776 | 
 1777 |         // Low cardinality values (3/4/5) but with moderate run count:
 1778 |         // RLE compresses vs raw, yet bitpacking should be smaller.
 1779 |         let mut values: Vec<u64> = Vec::with_capacity(256);
 1780 |         for run_idx in 0..64 {
 1781 |             let value = match run_idx % 3 {
 1782 |                 0 => 3u64,
 1783 |                 1 => 4u64,
 1784 |                 _ => 5u64,
 1785 |             };
 1786 |             values.extend(std::iter::repeat_n(value, 4));
 1787 |         }
 1788 | 
 1789 |         let mut block = FixedWidthDataBlock {
 1790 |             bits_per_value: 64,
 1791 |             data: LanceBuffer::reinterpret_vec(values),
 1792 |             num_values: 256,
 1793 |             block_info: BlockInfo::default(),
 1794 |         };
 1795 | 
 1796 |         use crate::statistics::ComputeStat;
 1797 |         block.compute_stat();
 1798 | 
 1799 |         let data = DataBlock::FixedWidth(block);
 1800 |         let compressor = strategy.create_miniblock_compressor(&field, &data).unwrap();
 1801 |         let debug_str = format!("{:?}", compressor);
 1802 |         assert!(
 1803 |             debug_str.contains("InlineBitpacking"),
 1804 |             "expected InlineBitpacking, got: {debug_str}"
 1805 |         );
 1806 |         assert!(
 1807 |             !debug_str.contains("RleEncoder"),
 1808 |             "expected RLE to be skipped when bitpacking is smaller, got: {debug_str}"
 1809 |         );
 1810 |     }
 1811 | 
 1812 |     fn check_uncompressed_encoding(encoding: &CompressiveEncoding, variable: bool) {
 1813 |         let chain = extract_array_encoding_chain(encoding);
 1814 |         if variable {
 1815 |             assert_eq!(chain.len(), 2);
 1816 |             assert_eq!(chain.first().unwrap().as_str(), "variable");
 1817 |             assert_eq!(chain.get(1).unwrap().as_str(), "flat");
 1818 |         } else {
 1819 |             assert_eq!(chain.len(), 1);
 1820 |             assert_eq!(chain.first().unwrap().as_str(), "flat");
 1821 |         }
 1822 |     }
 1823 | 
 1824 |     #[test]
 1825 |     fn test_none_compression() {
 1826 |         let mut params = CompressionParams::new();
 1827 | 
 1828 |         // Disable compression for embeddings
 1829 |         params.columns.insert(
 1830 |             "embeddings".to_string(),
 1831 |             CompressionFieldParams {
 1832 |                 compression: Some("none".to_string()),
 1833 |                 ..Default::default()
 1834 |             },
 1835 |         );
 1836 | 
 1837 |         let strategy = baseline_strategy(params);
 1838 |         let field = create_test_field("embeddings", DataType::Float32);
 1839 |         let fixed_data = create_fixed_width_block(32, 1000);
 1840 |         let variable_data = create_variable_width_block(32, 10, 32 * 1024);
 1841 | 
 1842 |         // Test miniblock
 1843 |         let compressor = strategy
 1844 |             .create_miniblock_compressor(&field, &fixed_data)
 1845 |             .unwrap();
 1846 |         let (_block, encoding) = compressor
 1847 |             .compress(miniblock_context(), fixed_data.clone())
 1848 |             .unwrap();
 1849 |         check_uncompressed_encoding(&encoding, false);
 1850 |         let compressor = strategy
 1851 |             .create_miniblock_compressor(&field, &variable_data)
 1852 |             .unwrap();
 1853 |         let (_block, encoding) = compressor
 1854 |             .compress(miniblock_context(), variable_data.clone())
 1855 |             .unwrap();
 1856 |         check_uncompressed_encoding(&encoding, true);
 1857 | 
 1858 |         // Test pervalue
 1859 |         let compressor = strategy.create_per_value(&field, &fixed_data).unwrap();
 1860 |         let (_block, encoding) = compressor.compress(fixed_data).unwrap();
 1861 |         check_uncompressed_encoding(&encoding, false);
 1862 |         let compressor = strategy.create_per_value(&field, &variable_data).unwrap();
 1863 |         let (_block, encoding) = compressor.compress(variable_data).unwrap();
 1864 |         check_uncompressed_encoding(&encoding, true);
 1865 |     }
 1866 | 
 1867 |     #[test]
 1868 |     fn test_field_metadata_none_compression() {
 1869 |         // Prepare field with metadata for none compression
 1870 |         let mut arrow_field = ArrowField::new("simple_col", DataType::Binary, true);
 1871 |         let mut metadata = HashMap::new();
 1872 |         metadata.insert(COMPRESSION_META_KEY.to_string(), "none".to_string());
 1873 |         arrow_field = arrow_field.with_metadata(metadata);
 1874 |         let field = Field::try_from(&arrow_field).unwrap();
 1875 | 
 1876 |         let strategy = baseline_strategy(CompressionParams::new());
 1877 | 
 1878 |         // Test miniblock
 1879 |         let fixed_data = create_fixed_width_block(32, 1000);
 1880 |         let variable_data = create_variable_width_block(32, 10, 32 * 1024);
 1881 | 
 1882 |         let compressor = strategy
 1883 |             .create_miniblock_compressor(&field, &fixed_data)
 1884 |             .unwrap();
 1885 |         let (_block, encoding) = compressor
 1886 |             .compress(miniblock_context(), fixed_data.clone())
 1887 |             .unwrap();
 1888 |         check_uncompressed_encoding(&encoding, false);
 1889 | 
 1890 |         let compressor = strategy
 1891 |             .create_miniblock_compressor(&field, &variable_data)
 1892 |             .unwrap();
 1893 |         let (_block, encoding) = compressor
 1894 |             .compress(miniblock_context(), variable_data.clone())
 1895 |             .unwrap();
 1896 |         check_uncompressed_encoding(&encoding, true);
 1897 | 
 1898 |         // Test pervalue
 1899 |         let compressor = strategy.create_per_value(&field, &fixed_data).unwrap();
 1900 |         let (_block, encoding) = compressor.compress(fixed_data).unwrap();
 1901 |         check_uncompressed_encoding(&encoding, false);
 1902 | 
 1903 |         let compressor = strategy.create_per_value(&field, &variable_data).unwrap();
 1904 |         let (_block, encoding) = compressor.compress(variable_data).unwrap();
 1905 |         check_uncompressed_encoding(&encoding, true);
 1906 |     }
 1907 | 
 1908 |     #[test]
 1909 |     fn test_auto_fsst_disabled_for_binary_fields() {
 1910 |         let strategy = baseline_strategy(CompressionParams::default());
 1911 |         let field = create_test_field("bytes", DataType::Binary);
 1912 |         let variable_data = create_fsst_candidate_variable_width_block();
 1913 | 
 1914 |         let miniblock = strategy
 1915 |             .create_miniblock_compressor(&field, &variable_data)
 1916 |             .unwrap();
 1917 |         let miniblock_debug = format!("{:?}", miniblock);
 1918 |         assert!(
 1919 |             miniblock_debug.contains("BinaryMiniBlockEncoder"),
 1920 |             "expected BinaryMiniBlockEncoder, got: {miniblock_debug}"
 1921 |         );
 1922 |         assert!(
 1923 |             !miniblock_debug.contains("FsstMiniBlockEncoder"),
 1924 |             "did not expect FsstMiniBlockEncoder, got: {miniblock_debug}"
 1925 |         );
 1926 | 
 1927 |         let per_value = strategy.create_per_value(&field, &variable_data).unwrap();
 1928 |         let per_value_debug = format!("{:?}", per_value);
 1929 |         assert!(
 1930 |             per_value_debug.contains("VariableEncoder"),
 1931 |             "expected VariableEncoder, got: {per_value_debug}"
 1932 |         );
 1933 |         assert!(
 1934 |             !per_value_debug.contains("FsstPerValueEncoder"),
 1935 |             "did not expect FsstPerValueEncoder, got: {per_value_debug}"
 1936 |         );
 1937 |     }
 1938 | 
 1939 |     #[test]
 1940 |     fn test_auto_fsst_still_enabled_for_utf8_fields() {
 1941 |         let strategy = baseline_strategy(CompressionParams::default());
 1942 |         let field = create_test_field("text", DataType::Utf8);
 1943 |         let variable_data = create_fsst_candidate_variable_width_block();
 1944 | 
 1945 |         let miniblock = strategy
 1946 |             .create_miniblock_compressor(&field, &variable_data)
 1947 |             .unwrap();
 1948 |         let miniblock_debug = format!("{:?}", miniblock);
 1949 |         assert!(
 1950 |             miniblock_debug.contains("FsstMiniBlockEncoder"),
 1951 |             "expected FsstMiniBlockEncoder, got: {miniblock_debug}"
 1952 |         );
 1953 | 
 1954 |         let per_value = strategy.create_per_value(&field, &variable_data).unwrap();
 1955 |         let per_value_debug = format!("{:?}", per_value);
 1956 |         assert!(
 1957 |             per_value_debug.contains("FsstPerValueEncoder"),
 1958 |             "expected FsstPerValueEncoder, got: {per_value_debug}"
 1959 |         );
 1960 |     }
 1961 | 
 1962 |     #[test]
 1963 |     fn test_explicit_fsst_still_supported_for_binary_fields() {
 1964 |         let mut params = CompressionParams::new();
 1965 |         params.columns.insert(
 1966 |             "bytes".to_string(),
 1967 |             CompressionFieldParams {
 1968 |                 compression: Some("fsst".to_string()),
 1969 |                 ..Default::default()
 1970 |             },
 1971 |         );
 1972 | 
 1973 |         let strategy = baseline_strategy(params);
 1974 |         let field = create_test_field("bytes", DataType::Binary);
 1975 |         let variable_data = create_fsst_candidate_variable_width_block();
 1976 | 
 1977 |         let miniblock = strategy
 1978 |             .create_miniblock_compressor(&field, &variable_data)
 1979 |             .unwrap();
 1980 |         let miniblock_debug = format!("{:?}", miniblock);
 1981 |         assert!(
 1982 |             miniblock_debug.contains("FsstMiniBlockEncoder"),
 1983 |             "expected FsstMiniBlockEncoder, got: {miniblock_debug}"
 1984 |         );
 1985 | 
 1986 |         let per_value = strategy.create_per_value(&field, &variable_data).unwrap();
 1987 |         let per_value_debug = format!("{:?}", per_value);
 1988 |         assert!(
 1989 |             per_value_debug.contains("FsstPerValueEncoder"),
 1990 |             "expected FsstPerValueEncoder, got: {per_value_debug}"
 1991 |         );
 1992 |     }
 1993 | 
 1994 |     #[test]
 1995 |     #[cfg(feature = "zstd")]
 1996 |     fn test_compression_level_honored_for_large_per_value() {
 1997 |         let mut params = CompressionParams::new();
 1998 |         params.columns.insert(
 1999 |             "html".to_string(),
 2000 |             CompressionFieldParams {
 2001 |                 compression: Some("zstd".to_string()),
 2002 |                 compression_level: Some(19),
 2003 |                 ..Default::default()
 2004 |             },
 2005 |         );
 2006 |         let strategy = baseline_strategy(params);
 2007 |         let field = create_test_field("html", DataType::Utf8);
 2008 |         let large = create_variable_width_block(32, 64, 40 * 1024);
 2009 | 
 2010 |         let per_value = strategy.create_per_value(&field, &large).unwrap();
 2011 |         let debug = format!("{per_value:?}");
 2012 |         assert!(
 2013 |             debug.contains("ZstdBufferCompressor") && debug.contains("compression_level: 19"),
 2014 |             "expected zstd level 19 to reach the per-value compressor, got: {debug}"
 2015 |         );
 2016 |     }
 2017 | 
 2018 |     #[test]
 2019 |     fn test_parameter_merge_priority() {
 2020 |         let mut params = CompressionParams::new();
 2021 | 
 2022 |         // Set type-level
 2023 |         params.types.insert(
 2024 |             "Int32".to_string(),
 2025 |             CompressionFieldParams {
 2026 |                 rle_threshold: Some(0.5),
 2027 |                 compression: Some("lz4".to_string()),
 2028 |                 ..Default::default()
 2029 |             },
 2030 |         );
 2031 | 
 2032 |         // Set column-level (highest priority)
 2033 |         params.columns.insert(
 2034 |             "user_id".to_string(),
 2035 |             CompressionFieldParams {
 2036 |                 rle_threshold: Some(0.2),
 2037 |                 compression: Some("zstd".to_string()),
 2038 |                 compression_level: Some(6),
 2039 |                 bss: None,
 2040 |                 minichunk_size: None,
 2041 |             },
 2042 |         );
 2043 | 
 2044 |         // Get merged params
 2045 |         let merged = params.get_field_params("user_id", &DataType::Int32);
 2046 | 
 2047 |         // Column params should override type params
 2048 |         assert_eq!(merged.rle_threshold, Some(0.2));
 2049 |         assert_eq!(merged.compression, Some("zstd".to_string()));
 2050 |         assert_eq!(merged.compression_level, Some(6));
 2051 | 
 2052 |         // Test field with only type params
 2053 |         let merged = params.get_field_params("other_field", &DataType::Int32);
 2054 |         assert_eq!(merged.rle_threshold, Some(0.5));
 2055 |         assert_eq!(merged.compression, Some("lz4".to_string()));
 2056 |         assert_eq!(merged.compression_level, None);
 2057 |     }
 2058 | 
 2059 |     #[test]
 2060 |     fn test_pattern_matching() {
 2061 |         let mut params = CompressionParams::new();
 2062 | 
 2063 |         // Configure pattern for log files
 2064 |         params.columns.insert(
 2065 |             "log_*".to_string(),
 2066 |             CompressionFieldParams {
 2067 |                 compression: Some("zstd".to_string()),
 2068 |                 compression_level: Some(6),
 2069 |                 ..Default::default()
 2070 |             },
 2071 |         );
 2072 | 
 2073 |         // Should match pattern
 2074 |         let merged = params.get_field_params("log_messages", &DataType::Utf8);
 2075 |         assert_eq!(merged.compression, Some("zstd".to_string()));
 2076 |         assert_eq!(merged.compression_level, Some(6));
 2077 | 
 2078 |         // Should not match
 2079 |         let merged = params.get_field_params("messages_log", &DataType::Utf8);
 2080 |         assert_eq!(merged.compression, None);
 2081 |     }
 2082 | 
 2083 |     #[test]
 2084 |     fn test_legacy_metadata_support() {
 2085 |         let params = CompressionParams::new();
 2086 |         let strategy = baseline_strategy(params);
 2087 | 
 2088 |         // Test field with "none" compression metadata
 2089 |         let mut metadata = HashMap::new();
 2090 |         metadata.insert(COMPRESSION_META_KEY.to_string(), "none".to_string());
 2091 |         let mut field = create_test_field("some_column", DataType::Int32);
 2092 |         field.metadata = metadata;
 2093 | 
 2094 |         let data = create_fixed_width_block(32, 1000);
 2095 |         let compressor = strategy.create_miniblock_compressor(&field, &data).unwrap();
 2096 | 
 2097 |         // Should respect metadata and use ValueEncoder
 2098 |         assert!(format!("{:?}", compressor).contains("ValueEncoder"));
 2099 |     }
 2100 | 
 2101 |     #[test]
 2102 |     fn test_default_behavior() {
 2103 |         // Empty params should fall back to default behavior
 2104 |         let params = CompressionParams::new();
 2105 |         let strategy = baseline_strategy(params);
 2106 | 
 2107 |         let field = create_test_field("random_column", DataType::Int32);
 2108 |         // Create data with high run count that won't trigger RLE (600 runs for 1000 values = 0.6 ratio)
 2109 |         let data = create_fixed_width_block_with_stats(32, 1000, 600);
 2110 | 
 2111 |         let compressor = strategy.create_miniblock_compressor(&field, &data).unwrap();
 2112 |         // Should use default strategy's decision
 2113 |         let debug_str = format!("{:?}", compressor);
 2114 |         assert!(debug_str.contains("ValueEncoder") || debug_str.contains("InlineBitpacking"));
 2115 |     }
 2116 | 
 2117 |     #[test]
 2118 |     fn test_field_metadata_compression() {
 2119 |         let params = CompressionParams::new();
 2120 |         let strategy = baseline_strategy(params);
 2121 | 
 2122 |         // Test field with compression metadata
 2123 |         let mut metadata = HashMap::new();
 2124 |         metadata.insert(COMPRESSION_META_KEY.to_string(), "zstd".to_string());
 2125 |         metadata.insert(COMPRESSION_LEVEL_META_KEY.to_string(), "6".to_string());
 2126 |         let mut field = create_test_field("test_column", DataType::Int32);
 2127 |         field.metadata = metadata;
 2128 | 
 2129 |         let data = create_fixed_width_block(32, 1000);
 2130 |         let compressor = strategy.create_miniblock_compressor(&field, &data).unwrap();
 2131 | 
 2132 |         // Should use zstd with level 6
 2133 |         let debug_str = format!("{:?}", compressor);
 2134 |         assert!(debug_str.contains("GeneralMiniBlockCompressor"));
 2135 |     }
 2136 | 
 2137 |     #[test]
 2138 |     fn test_field_metadata_rle_threshold() {
 2139 |         let params = CompressionParams::new();
 2140 |         let strategy = baseline_strategy(params);
 2141 | 
 2142 |         // Test field with RLE threshold metadata
 2143 |         let mut metadata = HashMap::new();
 2144 |         metadata.insert(RLE_THRESHOLD_META_KEY.to_string(), "0.8".to_string());
 2145 |         metadata.insert(BSS_META_KEY.to_string(), "off".to_string()); // Disable BSS to test RLE
 2146 |         let mut field = create_test_field("test_column", DataType::Int32);
 2147 |         field.metadata = metadata;
 2148 | 
 2149 |         // Create data with low run count (e.g., 100 runs for 1000 values = 0.1 ratio)
 2150 |         // This ensures run_count (100) < num_values * threshold (1000 * 0.8 = 800)
 2151 |         let data = create_fixed_width_block_with_stats(32, 1000, 100);
 2152 | 
 2153 |         let compressor = strategy.create_miniblock_compressor(&field, &data).unwrap();
 2154 | 
 2155 |         // Should use RLE because run_count (100) < num_values * threshold (800)
 2156 |         let debug_str = format!("{:?}", compressor);
 2157 |         assert!(debug_str.contains("RleEncoder"));
 2158 |     }
 2159 | 
 2160 |     #[test]
 2161 |     fn test_rle_v2_miniblock_selects_u16_run_lengths() {
 2162 |         let mut metadata = HashMap::new();
 2163 |         metadata.insert(RLE_THRESHOLD_META_KEY.to_string(), "1.0".to_string());
 2164 |         metadata.insert(BSS_META_KEY.to_string(), "off".to_string());
 2165 |         let mut field = create_test_field("test_column", DataType::Int32);
 2166 |         field.metadata = metadata;
 2167 | 
 2168 |         let values = vec![7i32; 1000];
 2169 |         let mut data = FixedWidthDataBlock {
 2170 |             bits_per_value: 32,
 2171 |             data: LanceBuffer::reinterpret_vec(values),
 2172 |             num_values: 1000,
 2173 |             block_info: BlockInfo::default(),
 2174 |         };
 2175 |         data.compute_stat();
 2176 |         let data = DataBlock::FixedWidth(data);
 2177 | 
 2178 |         let strategy = strategy(TestEncoding::StructuralSparse, CompressionParams::default());
 2179 |         let compressor = strategy.create_miniblock_compressor(&field, &data).unwrap();
 2180 |         let (_compressed, encoding) = compressor.compress(miniblock_context(), data).unwrap();
 2181 |         assert_eq!(rle_run_length_bits(&encoding), 16);
 2182 |     }
 2183 | 
 2184 |     #[test]
 2185 |     fn test_rle_v2_miniblock_keeps_u8_run_lengths_before_v2_3() {
 2186 |         for version in [TestEncoding::StructuralU16, TestEncoding::StructuralU32] {
 2187 |             let mut metadata = HashMap::new();
 2188 |             metadata.insert(RLE_THRESHOLD_META_KEY.to_string(), "1.0".to_string());
 2189 |             metadata.insert(BSS_META_KEY.to_string(), "off".to_string());
 2190 |             let mut field = create_test_field("test_column", DataType::Int32);
 2191 |             field.metadata = metadata;
 2192 | 
 2193 |             let values = vec![7i32; 1000];
 2194 |             let mut data = FixedWidthDataBlock {
 2195 |                 bits_per_value: 32,
 2196 |                 data: LanceBuffer::reinterpret_vec(values),
 2197 |                 num_values: 1000,
 2198 |                 block_info: BlockInfo::default(),
 2199 |             };
 2200 |             data.compute_stat();
 2201 |             let data = DataBlock::FixedWidth(data);
 2202 | 
 2203 |             let strategy = strategy(version, CompressionParams::default());
 2204 |             let compressor = strategy.create_miniblock_compressor(&field, &data).unwrap();
 2205 |             let (_compressed, encoding) = compressor.compress(miniblock_context(), data).unwrap();
 2206 |             assert_eq!(rle_run_length_bits(&encoding), 8, "version={version}");
 2207 |         }
 2208 |     }
 2209 | 
 2210 |     #[test]
 2211 |     fn test_rle_v2_uses_selected_width_cost_before_bitpacking() {
 2212 |         let mut metadata = HashMap::new();
 2213 |         metadata.insert(RLE_THRESHOLD_META_KEY.to_string(), "1.0".to_string());
 2214 |         metadata.insert(BSS_META_KEY.to_string(), "off".to_string());
 2215 |         let mut field = create_test_field("test_column", DataType::Int32);
 2216 |         field.metadata = metadata;
 2217 | 
 2218 |         let values = vec![0i32; 4096];
 2219 |         let mut data = FixedWidthDataBlock {
 2220 |             bits_per_value: 32,
 2221 |             data: LanceBuffer::reinterpret_vec(values),
 2222 |             num_values: 4096,
 2223 |             block_info: BlockInfo::default(),
 2224 |         };
 2225 |         data.compute_stat();
 2226 |         let data = DataBlock::FixedWidth(data);
 2227 | 
 2228 |         let strategy = strategy(TestEncoding::StructuralSparse, CompressionParams::default());
 2229 |         let compressor = strategy.create_miniblock_compressor(&field, &data).unwrap();
 2230 |         let debug_str = format!("{compressor:?}");
 2231 |         assert!(debug_str.contains("RleEncoder"));
 2232 | 
 2233 |         let (_compressed, encoding) = compressor.compress(miniblock_context(), data).unwrap();
 2234 |         assert_eq!(rle_run_length_bits(&encoding), 16);
 2235 |     }
 2236 | 
 2237 |     #[test]
 2238 |     fn test_rle_v2_sorted_dictionary_indices_select_u16_run_lengths() {
 2239 |         let field = create_test_field("dict_indices", DataType::Int32);
 2240 | 
 2241 |         let mut values = Vec::with_capacity(1_200);
 2242 |         for value in 0..4 {
 2243 |             values.extend(std::iter::repeat_n(value, 300));
 2244 |         }
 2245 |         let mut data = FixedWidthDataBlock {
 2246 |             bits_per_value: 32,
 2247 |             data: LanceBuffer::reinterpret_vec(values),
 2248 |             num_values: 1_200,
 2249 |             block_info: BlockInfo::default(),
 2250 |         };
 2251 |         data.compute_stat();
 2252 |         let data = DataBlock::FixedWidth(data);
 2253 | 
 2254 |         let strategy = strategy(TestEncoding::StructuralSparse, CompressionParams::default());
 2255 |         let compressor = strategy.create_miniblock_compressor(&field, &data).unwrap();
 2256 |         let (_compressed, encoding) = compressor.compress(miniblock_context(), data).unwrap();
 2257 |         assert_eq!(rle_run_length_bits(&encoding), 16);
 2258 |     }
 2259 | 
 2260 |     #[test]
 2261 |     fn test_rle_v2_short_runs_keep_u8_run_lengths() {
 2262 |         let field = create_test_field("dict_indices", DataType::Int32);
 2263 | 
 2264 |         let mut values = Vec::with_capacity(1_280);
 2265 |         for value in 0..10 {
 2266 |             values.extend(std::iter::repeat_n(value, 128));
 2267 |         }
 2268 |         let mut data = FixedWidthDataBlock {
 2269 |             bits_per_value: 32,
 2270 |             data: LanceBuffer::reinterpret_vec(values),
 2271 |             num_values: 1_280,
 2272 |             block_info: BlockInfo::default(),
 2273 |         };
 2274 |         data.compute_stat();
 2275 |         let data = DataBlock::FixedWidth(data);
 2276 | 
 2277 |         let strategy = strategy(TestEncoding::StructuralSparse, CompressionParams::default());
 2278 |         let compressor = strategy.create_miniblock_compressor(&field, &data).unwrap();
 2279 |         let (_compressed, encoding) = compressor.compress(miniblock_context(), data).unwrap();
 2280 |         assert_eq!(rle_run_length_bits(&encoding), 8);
 2281 |     }
 2282 | 
 2283 |     #[test]
 2284 |     #[cfg(any(feature = "lz4", feature = "zstd"))]
 2285 |     fn test_rle_miniblock_released_versions_keep_flat_children_when_compression_requested() {
 2286 |         for version in [TestEncoding::StructuralU16, TestEncoding::StructuralU32] {
 2287 |             let mut params = CompressionParams::new();
 2288 |             params.columns.insert(
 2289 |                 "dict_indices".to_string(),
 2290 |                 CompressionFieldParams {
 2291 |                     compression: Some(
 2292 |                         if cfg!(feature = "lz4") { "lz4" } else { "zstd" }.to_string(),
 2293 |                     ),
 2294 |                     rle_threshold: Some(1.0),
 2295 |                     bss: Some(BssMode::Off),
 2296 |                     ..Default::default()
 2297 |                 },
 2298 |             );
 2299 |             let strategy = strategy(version, params);
 2300 |             let field = create_test_field("dict_indices", DataType::UInt32);
 2301 | 
 2302 |             let mut values = Vec::with_capacity(8192 * 4);
 2303 |             for value in 0..8192u32 {
 2304 |                 values.extend(std::iter::repeat_n(value, 4));
 2305 |             }
 2306 |             let mut data = FixedWidthDataBlock {
 2307 |                 bits_per_value: 32,
 2308 |                 data: LanceBuffer::reinterpret_vec(values),
 2309 |                 num_values: 8192 * 4,
 2310 |                 block_info: BlockInfo::default(),
 2311 |             };
 2312 |             data.compute_stat();
 2313 |             let data = DataBlock::FixedWidth(data);
 2314 | 
 2315 |             let compressor = strategy.create_miniblock_compressor(&field, &data).unwrap();
 2316 |             let (_compressed, encoding) = compressor.compress(miniblock_context(), data).unwrap();
 2317 |             let rle = expect_rle_encoding(&encoding);
 2318 | 
 2319 |             assert!(
 2320 |                 matches!(
 2321 |                     rle.values.as_ref().unwrap().compression.as_ref().unwrap(),
 2322 |                     Compression::Flat(_)
 2323 |                 ),
 2324 |                 "version={version}"
 2325 |             );
 2326 |             assert!(
 2327 |                 matches!(
 2328 |                     rle.run_lengths
 2329 |                         .as_ref()
 2330 |                         .unwrap()
 2331 |                         .compression
 2332 |                         .as_ref()
 2333 |                         .unwrap(),
 2334 |                     Compression::Flat(_)
 2335 |                 ),
 2336 |                 "version={version}"
 2337 |             );
 2338 |         }
 2339 |     }
 2340 | 
 2341 |     #[test]
 2342 |     #[cfg(feature = "bitpacking")]
 2343 |     fn test_rle_miniblock_strategy_bitpacks_child_values_when_smaller() {
 2344 |         let field = create_test_field("dict_indices", DataType::Int32);
 2345 | 
 2346 |         let mut values = Vec::with_capacity(8192 * 4);
 2347 |         for value in 0..8192 {
 2348 |             values.extend(std::iter::repeat_n(value, 4));
 2349 |         }
 2350 |         let mut data = FixedWidthDataBlock {
 2351 |             bits_per_value: 32,
 2352 |             data: LanceBuffer::reinterpret_vec(values),
 2353 |             num_values: 8192 * 4,
 2354 |             block_info: BlockInfo::default(),
 2355 |         };
 2356 |         data.compute_stat();
 2357 |         let data = DataBlock::FixedWidth(data);
 2358 | 
 2359 |         let strategy = strategy(TestEncoding::StructuralSparse, CompressionParams::default());
 2360 |         let compressor = strategy.create_miniblock_compressor(&field, &data).unwrap();
 2361 |         let debug_str = format!("{compressor:?}");
 2362 |         assert!(debug_str.contains("RleEncoder"));
 2363 | 
 2364 |         let (_compressed, encoding) = compressor.compress(miniblock_context(), data).unwrap();
 2365 |         let Compression::Rle(rle) = encoding.compression.as_ref().unwrap() else {
 2366 |             panic!("expected RLE encoding");
 2367 |         };
 2368 |         assert!(matches!(
 2369 |             rle.values.as_ref().unwrap().compression.as_ref().unwrap(),
 2370 |             Compression::OutOfLineBitpacking(_)
 2371 |         ));
 2372 |         assert!(matches!(
 2373 |             rle.run_lengths
 2374 |                 .as_ref()
 2375 |                 .unwrap()
 2376 |                 .compression
 2377 |                 .as_ref()
 2378 |                 .unwrap(),
 2379 |             Compression::Flat(_)
 2380 |         ));
 2381 |     }
 2382 | 
 2383 |     #[test]
 2384 |     #[cfg(feature = "bitpacking")]
 2385 |     fn test_rle_miniblock_keeps_child_bitpacked_rle_when_smaller_than_inline_bitpacking() {
 2386 |         let field = create_test_field("int_score", DataType::UInt64);
 2387 | 
 2388 |         let mut values = Vec::with_capacity(8192 * 8);
 2389 |         for run_idx in 0..8192 {
 2390 |             let value = match run_idx % 3 {
 2391 |                 0 => 3u64,
 2392 |                 1 => 4u64,
 2393 |                 _ => 5u64,
 2394 |             };
 2395 |             values.extend(std::iter::repeat_n(value, 8));
 2396 |         }
 2397 |         let mut data = FixedWidthDataBlock {
 2398 |             bits_per_value: 64,
 2399 |             data: LanceBuffer::reinterpret_vec(values),
 2400 |             num_values: 8192 * 8,
 2401 |             block_info: BlockInfo::default(),
 2402 |         };
 2403 |         data.compute_stat();
 2404 |         let data = DataBlock::FixedWidth(data);
 2405 | 
 2406 |         let strategy = strategy(TestEncoding::StructuralSparse, CompressionParams::default());
 2407 |         let compressor = strategy.create_miniblock_compressor(&field, &data).unwrap();
 2408 |         let debug_str = format!("{compressor:?}");
 2409 |         assert!(
 2410 |             debug_str.contains("RleEncoder"),
 2411 |             "expected RLE to beat inline bitpacking after child selection, got: {debug_str}"
 2412 |         );
 2413 | 
 2414 |         let (_compressed, encoding) = compressor.compress(miniblock_context(), data).unwrap();
 2415 |         let rle = expect_rle_encoding(&encoding);
 2416 |         assert!(matches!(
 2417 |             rle.values.as_ref().unwrap().compression.as_ref().unwrap(),
 2418 |             Compression::OutOfLineBitpacking(_)
 2419 |         ));
 2420 |         assert!(matches!(
 2421 |             rle.run_lengths
 2422 |                 .as_ref()
 2423 |                 .unwrap()
 2424 |                 .compression
 2425 |                 .as_ref()
 2426 |                 .unwrap(),
 2427 |             Compression::Flat(_)
 2428 |         ));
 2429 |     }
 2430 | 
 2431 |     #[test]
 2432 |     fn test_field_metadata_override_params() {
 2433 |         // Set up params with one configuration
 2434 |         let mut params = CompressionParams::new();
 2435 |         params.columns.insert(
 2436 |             "test_column".to_string(),
 2437 |             CompressionFieldParams {
 2438 |                 rle_threshold: Some(0.3),
 2439 |                 compression: Some("lz4".to_string()),
 2440 |                 compression_level: None,
 2441 |                 bss: None,
 2442 |                 minichunk_size: None,
 2443 |             },
 2444 |         );
 2445 | 
 2446 |         let strategy = baseline_strategy(params);
 2447 | 
 2448 |         // Field metadata should override params
 2449 |         let mut metadata = HashMap::new();
 2450 |         metadata.insert(COMPRESSION_META_KEY.to_string(), "none".to_string());
 2451 |         let mut field = create_test_field("test_column", DataType::Int32);
 2452 |         field.metadata = metadata;
 2453 | 
 2454 |         let data = create_fixed_width_block(32, 1000);
 2455 |         let compressor = strategy.create_miniblock_compressor(&field, &data).unwrap();
 2456 | 
 2457 |         // Should use none compression (from metadata) instead of lz4 (from params)
 2458 |         assert!(format!("{:?}", compressor).contains("ValueEncoder"));
 2459 |     }
 2460 | 
 2461 |     #[test]
 2462 |     fn test_field_metadata_mixed_configuration() {
 2463 |         // Configure type-level params
 2464 |         let mut params = CompressionParams::new();
 2465 |         params.types.insert(
 2466 |             "Int32".to_string(),
 2467 |             CompressionFieldParams {
 2468 |                 rle_threshold: Some(0.5),
 2469 |                 compression: Some("lz4".to_string()),
 2470 |                 ..Default::default()
 2471 |             },
 2472 |         );
 2473 | 
 2474 |         let strategy = baseline_strategy(params);
 2475 | 
 2476 |         // Field metadata provides partial override
 2477 |         let mut metadata = HashMap::new();
 2478 |         metadata.insert(COMPRESSION_LEVEL_META_KEY.to_string(), "3".to_string());
 2479 |         let mut field = create_test_field("test_column", DataType::Int32);
 2480 |         field.metadata = metadata;
 2481 | 
 2482 |         let data = create_fixed_width_block(32, 1000);
 2483 |         let compressor = strategy.create_miniblock_compressor(&field, &data).unwrap();
 2484 | 
 2485 |         // Should use lz4 (from type params) with level 3 (from metadata)
 2486 |         let debug_str = format!("{:?}", compressor);
 2487 |         assert!(debug_str.contains("GeneralMiniBlockCompressor"));
 2488 |     }
 2489 | 
 2490 |     #[test]
 2491 |     fn test_bss_field_metadata() {
 2492 |         let params = CompressionParams::new();
 2493 |         let strategy = baseline_strategy(params);
 2494 | 
 2495 |         // Test BSS "on" mode with compression enabled (BSS requires compression to be effective)
 2496 |         let mut metadata = HashMap::new();
 2497 |         metadata.insert(BSS_META_KEY.to_string(), "on".to_string());
 2498 |         metadata.insert(COMPRESSION_META_KEY.to_string(), "lz4".to_string());
 2499 |         let arrow_field =
 2500 |             ArrowField::new("temperature", DataType::Float32, false).with_metadata(metadata);
 2501 |         let field = Field::try_from(&arrow_field).unwrap();
 2502 | 
 2503 |         // Create float data
 2504 |         let data = create_fixed_width_block(32, 100);
 2505 | 
 2506 |         let compressor = strategy.create_miniblock_compressor(&field, &data).unwrap();
 2507 |         let debug_str = format!("{:?}", compressor);
 2508 |         assert!(debug_str.contains("ByteStreamSplitEncoder"));
 2509 |     }
 2510 | 
 2511 |     #[test]
 2512 |     fn test_bss_with_compression() {
 2513 |         let params = CompressionParams::new();
 2514 |         let strategy = baseline_strategy(params);
 2515 | 
 2516 |         // Test BSS with LZ4 compression
 2517 |         let mut metadata = HashMap::new();
 2518 |         metadata.insert(BSS_META_KEY.to_string(), "on".to_string());
 2519 |         metadata.insert(COMPRESSION_META_KEY.to_string(), "lz4".to_string());
 2520 |         let arrow_field =
 2521 |             ArrowField::new("sensor_data", DataType::Float64, false).with_metadata(metadata);
 2522 |         let field = Field::try_from(&arrow_field).unwrap();
 2523 | 
 2524 |         // Create double data
 2525 |         let data = create_fixed_width_block(64, 100);
 2526 | 
 2527 |         let compressor = strategy.create_miniblock_compressor(&field, &data).unwrap();
 2528 |         let debug_str = format!("{:?}", compressor);
 2529 |         // Should have BSS wrapped in general compression
 2530 |         assert!(debug_str.contains("GeneralMiniBlockCompressor"));
 2531 |         assert!(debug_str.contains("ByteStreamSplitEncoder"));
 2532 |     }
 2533 | 
 2534 |     #[test]
 2535 |     #[cfg(any(feature = "lz4", feature = "zstd"))]
 2536 |     fn test_general_block_decompression_fixed_width_v2_2() {
 2537 |         // Request general compression via the write path (2.2 requirement) and ensure the read path mirrors it.
 2538 |         let mut params = CompressionParams::new();
 2539 |         params.columns.insert(
 2540 |             "dict_values".to_string(),
 2541 |             CompressionFieldParams {
 2542 |                 compression: Some(if cfg!(feature = "lz4") { "lz4" } else { "zstd" }.to_string()),
 2543 |                 ..Default::default()
 2544 |             },
 2545 |         );
 2546 | 
 2547 |         let strategy = strategy(TestEncoding::StructuralU32, params);
 2548 | 
 2549 |         let field = create_test_field("dict_values", DataType::FixedSizeBinary(3));
 2550 |         let data = create_fixed_width_block(24, 1024);
 2551 |         let DataBlock::FixedWidth(expected_block) = &data else {
 2552 |             panic!("expected fixed width block");
 2553 |         };
 2554 |         let expected_bits = expected_block.bits_per_value;
 2555 |         let expected_num_values = expected_block.num_values;
 2556 |         let num_values = expected_num_values;
 2557 | 
 2558 |         let compressor = strategy
 2559 |             .create_block_compressor(&field, &data)
 2560 |             .expect("general compression should be selected");
 2561 |         let (compressed_buffer, encoding) = compressor
 2562 |             .compress(data.clone())
 2563 |             .expect("write path general compression should succeed");
 2564 |         match encoding.compression.as_ref() {
 2565 |             Some(Compression::General(_)) => {}
 2566 |             other => panic!("expected general compression, got {:?}", other),
 2567 |         }
 2568 | 
 2569 |         let decompressor = DefaultDecompressionStrategy::default()
 2570 |             .create_block_decompressor(&encoding)
 2571 |             .expect("general block decompressor should be created");
 2572 | 
 2573 |         let decoded = decompressor
 2574 |             .decompress(compressed_buffer, num_values)
 2575 |             .expect("decompression should succeed");
 2576 | 
 2577 |         match decoded {
 2578 |             DataBlock::FixedWidth(block) => {
 2579 |                 assert_eq!(block.bits_per_value, expected_bits);
 2580 |                 assert_eq!(block.num_values, expected_num_values);
 2581 |                 assert_eq!(block.data.as_ref(), expected_block.data.as_ref());
 2582 |             }
 2583 |             _ => panic!("expected fixed width block"),
 2584 |         }
 2585 |     }
 2586 | 
 2587 |     #[cfg(any(feature = "lz4", feature = "zstd"))]
 2588 |     fn assert_general_block_preserves_compression_level(
 2589 |         compression: &str,
 2590 |         expected_scheme: crate::format::pb21::CompressionScheme,
 2591 |         compression_level: Option<i32>,
 2592 |     ) {
 2593 |         let mut params = CompressionParams::new();
 2594 |         params.columns.insert(
 2595 |             "dict_values".to_string(),
 2596 |             CompressionFieldParams {
 2597 |                 compression: Some(compression.to_string()),
 2598 |                 compression_level,
 2599 |                 ..Default::default()
 2600 |             },
 2601 |         );
 2602 |         let strategy = strategy(TestEncoding::StructuralU32, params);
 2603 |         let field = create_test_field("dict_values", DataType::FixedSizeBinary(3));
 2604 |         let data = create_fixed_width_block(24, 1024);
 2605 | 
 2606 |         let compressor = strategy.create_block_compressor(&field, &data).unwrap();
 2607 |         let (_, encoding) = compressor.compress(data).unwrap();
 2608 |         let Some(Compression::General(general)) = encoding.compression.as_ref() else {
 2609 |             panic!("expected general compression");
 2610 |         };
 2611 | 
 2612 |         assert_eq!(
 2613 |             general.compression.as_ref(),
 2614 |             Some(&crate::format::pb21::BufferCompression {
 2615 |                 scheme: expected_scheme as i32,
 2616 |                 level: compression_level,
 2617 |             })
 2618 |         );
 2619 |     }
 2620 | 
 2621 |     #[test]
 2622 |     #[cfg(feature = "zstd")]
 2623 |     fn test_general_block_preserves_absent_zstd_level() {
 2624 |         assert_general_block_preserves_compression_level(
 2625 |             "zstd",
 2626 |             crate::format::pb21::CompressionScheme::CompressionAlgorithmZstd,
 2627 |             None,
 2628 |         );
 2629 |     }
 2630 | 
 2631 |     #[test]
 2632 |     #[cfg(feature = "lz4")]
 2633 |     fn test_general_block_preserves_explicit_lz4_level() {
 2634 |         assert_general_block_preserves_compression_level(
 2635 |             "lz4",
 2636 |             crate::format::pb21::CompressionScheme::CompressionAlgorithmLz4,
 2637 |             Some(7),
 2638 |         );
 2639 |     }
 2640 | 
 2641 |     #[test]
 2642 |     #[cfg(any(feature = "lz4", feature = "zstd"))]
 2643 |     fn test_general_compression_not_selected_for_v2_1_even_if_requested() {
 2644 |         let mut params = CompressionParams::new();
 2645 |         params.columns.insert(
 2646 |             "dict_values".to_string(),
 2647 |             CompressionFieldParams {
 2648 |                 compression: Some(if cfg!(feature = "lz4") { "lz4" } else { "zstd" }.to_string()),
 2649 |                 ..Default::default()
 2650 |             },
 2651 |         );
 2652 | 
 2653 |         let strategy = strategy(TestEncoding::StructuralU16, params);
 2654 |         let field = create_test_field("dict_values", DataType::FixedSizeBinary(3));
 2655 |         let data = create_fixed_width_block(24, 1024);
 2656 | 
 2657 |         let compressor = strategy
 2658 |             .create_block_compressor(&field, &data)
 2659 |             .expect("block compressor selection should succeed");
 2660 |         let (_, encoding) = compressor.compress(data).unwrap();
 2661 | 
 2662 |         assert!(
 2663 |             !matches!(encoding.compression.as_ref(), Some(Compression::General(_))),
 2664 |             "general compression should not be selected for V2.1"
 2665 |         );
 2666 |     }
 2667 | 
 2668 |     #[test]
 2669 |     fn test_none_compression_disables_auto_general_block_compression() {
 2670 |         let mut params = CompressionParams::new();
 2671 |         params.columns.insert(
 2672 |             "dict_values".to_string(),
 2673 |             CompressionFieldParams {
 2674 |                 compression: Some("none".to_string()),
 2675 |                 ..Default::default()
 2676 |             },
 2677 |         );
 2678 | 
 2679 |         let strategy = strategy(TestEncoding::StructuralU32, params);
 2680 |         let field = create_test_field("dict_values", DataType::FixedSizeBinary(3));
 2681 |         let data = create_fixed_width_block(24, 20_000);
 2682 | 
 2683 |         assert!(
 2684 |             data.data_size() > MIN_BLOCK_SIZE_FOR_GENERAL_COMPRESSION,
 2685 |             "test requires block size above automatic general compression threshold"
 2686 |         );
 2687 | 
 2688 |         let compressor = strategy
 2689 |             .create_block_compressor(&field, &data)
 2690 |             .expect("block compressor selection should succeed");
 2691 |         let (_, encoding) = compressor.compress(data).unwrap();
 2692 | 
 2693 |         assert!(
 2694 |             !matches!(encoding.compression.as_ref(), Some(Compression::General(_))),
 2695 |             "compression=none should disable automatic block general compression"
 2696 |         );
 2697 |     }
 2698 | 
 2699 |     #[test]
 2700 |     fn test_rle_v2_block_selects_u32_run_lengths() {
 2701 |         let field = create_test_field("dict_indices", DataType::Int32);
 2702 |         let expected_values = vec![42i32; 70_000];
 2703 |         let mut block = FixedWidthDataBlock {
 2704 |             bits_per_value: 32,
 2705 |             data: LanceBuffer::reinterpret_vec(expected_values.clone()),
 2706 |             num_values: expected_values.len() as u64,
 2707 |             block_info: BlockInfo::default(),
 2708 |         };
 2709 |         block.compute_stat();
 2710 |         let data = DataBlock::FixedWidth(block);
 2711 | 
 2712 |         let strategy = strategy(TestEncoding::StructuralSparse, CompressionParams::new());
 2713 |         let compressor = strategy.create_block_compressor(&field, &data).unwrap();
 2714 |         let (compressed, encoding) = compressor.compress(data).unwrap();
 2715 |         assert_eq!(rle_run_length_bits(&encoding), 32);
 2716 |         let decompressor = DefaultDecompressionStrategy::default()
 2717 |             .create_block_decompressor(&encoding)
 2718 |             .unwrap();
 2719 |         let decoded = decompressor
 2720 |             .decompress(compressed, expected_values.len() as u64)
 2721 |             .unwrap();
 2722 | 
 2723 |         match decoded {
 2724 |             DataBlock::FixedWidth(block) => {
 2725 |                 let values = block.data.borrow_to_typed_slice::<i32>();
 2726 |                 assert_eq!(values.as_ref(), expected_values);
 2727 |             }
 2728 |             _ => panic!("expected fixed-width block"),
 2729 |         }
 2730 |     }
 2731 | 
 2732 |     #[test]
 2733 |     fn test_rle_v2_block_keeps_u8_run_lengths_for_v2_2() {
 2734 |         let field = create_test_field("dict_indices", DataType::Int32);
 2735 |         let values = vec![42i32; 70_000];
 2736 |         let mut block = FixedWidthDataBlock {
 2737 |             bits_per_value: 32,
 2738 |             data: LanceBuffer::reinterpret_vec(values),
 2739 |             num_values: 70_000,
 2740 |             block_info: BlockInfo::default(),
 2741 |         };
 2742 |         block.compute_stat();
 2743 |         let data = DataBlock::FixedWidth(block);
 2744 | 
 2745 |         let strategy = strategy(TestEncoding::StructuralU32, CompressionParams::new());
 2746 |         let compressor = strategy.create_block_compressor(&field, &data).unwrap();
 2747 |         let (_, encoding) = compressor.compress(data).unwrap();
 2748 |         assert_eq!(rle_run_length_bits(&encoding), 8);
 2749 |     }
 2750 | 
 2751 |     #[test]
 2752 |     fn test_rle_block_used_for_version_v2_2() {
 2753 |         let field = create_test_field("test_repdef", DataType::UInt16);
 2754 | 
 2755 |         // Create highly repetitive data
 2756 |         let num_values = 1000u64;
 2757 |         let mut data = Vec::with_capacity(num_values as usize);
 2758 |         for i in 0..10 {
 2759 |             for _ in 0..100 {
 2760 |                 data.push(i as u16);
 2761 |             }
 2762 |         }
 2763 | 
 2764 |         let mut block = FixedWidthDataBlock {
 2765 |             bits_per_value: 16,
 2766 |             data: LanceBuffer::reinterpret_vec(data),
 2767 |             num_values,
 2768 |             block_info: BlockInfo::default(),
 2769 |         };
 2770 | 
 2771 |         block.compute_stat();
 2772 | 
 2773 |         let data_block = DataBlock::FixedWidth(block);
 2774 | 
 2775 |         let strategy = strategy(TestEncoding::StructuralU32, CompressionParams::new());
 2776 | 
 2777 |         let compressor = strategy
 2778 |             .create_block_compressor(&field, &data_block)
 2779 |             .unwrap();
 2780 | 
 2781 |         let debug_str = format!("{:?}", compressor);
 2782 |         assert!(debug_str.contains("RleEncoder"));
 2783 |     }
 2784 | 
 2785 |     #[test]
 2786 |     fn test_rle_block_not_used_for_version_v2_1() {
 2787 |         let field = create_test_field("test_repdef", DataType::UInt16);
 2788 | 
 2789 |         // Create highly repetitive data
 2790 |         let num_values = 1000u64;
 2791 |         let mut data = Vec::with_capacity(num_values as usize);
 2792 |         for i in 0..10 {
 2793 |             for _ in 0..100 {
 2794 |                 data.push(i as u16);
 2795 |             }
 2796 |         }
 2797 | 
 2798 |         let mut block = FixedWidthDataBlock {
 2799 |             bits_per_value: 16,
 2800 |             data: LanceBuffer::reinterpret_vec(data),
 2801 |             num_values,
 2802 |             block_info: BlockInfo::default(),
 2803 |         };
 2804 | 
 2805 |         block.compute_stat();
 2806 | 
 2807 |         let data_block = DataBlock::FixedWidth(block);
 2808 | 
 2809 |         let strategy = strategy(TestEncoding::StructuralU16, CompressionParams::new());
 2810 | 
 2811 |         let compressor = strategy
 2812 |             .create_block_compressor(&field, &data_block)
 2813 |             .unwrap();
 2814 | 
 2815 |         let debug_str = format!("{:?}", compressor);
 2816 |         assert!(
 2817 |             !debug_str.contains("RleEncoder"),
 2818 |             "RLE should not be used for V2.1"
 2819 |         );
 2820 |     }
 2821 | }
``````
