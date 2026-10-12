import fs from 'node:fs';import path from 'node:path';import {output}from './inventory.mjs';const read=f=>fs.readFileSync(path.join(output,f),'utf8'),write=(f,s)=>fs.writeFileSync(path.join(output,f),s.trimEnd()+'\n');const marker='\n## Generic split-block Bloom filters\n';function append(f,t){let s=read(f),i=s.indexOf(marker);write(f,(i<0?s.trimEnd():s.slice(0,i).trimEnd())+marker+'\n'+t.trim());}
const symbols=JSON.parse(read('L3-symbols/symbols.json')),paths=new Set(['rust/lance-core/src/utils/bloomfilter.rs','rust/lance-core/src/utils/bloomfilter/as_bytes.rs','rust/lance-core/src/utils/bloomfilter/sbbf.rs']);
write('L1-modules/rust-lance-core-bloom.md',`# Generic split-block Bloom filters

**All three local files analyzed. Scalar-index integration, null semantics, released-format classification and runtime validation remain INCOMPLETE.** [Core](rust-lance-core.md) · [Orientation](../L0-orientation.md) · [Symbols](../L3-symbols/symbol-index.md) · [Raw format](../L3-symbols/format-spec.md).

## Boundary and byte identity

The public bloomfilter directory exports as_bytes and sbbf as storage-agnostic primitives with no Lance semantics; lance-index scalar Bloom is the named higher-level consumer. External Parquet/spec/paper references in comments were not fetched or independently verified. Local SBBF uses AsBytes, twox_hash::XxHash64, libm::lgamma and standard synchronous Write; no Arrow array, null bitmap, object-store, dataset or async behavior is implemented. (rust/lance-core/src/utils/bloomfilter.rs:4-10; rust/lance-core/src/utils/bloomfilter/sbbf.rs:21-36; rust/lance-core/src/utils/bloomfilter/sbbf.rs:170-212; rust/lance-core/src/utils/bloomfilter/sbbf.rs:320-328)

AsBytes::as_bytes(&self)->impl AsRef<[u8]> supports i8/i16/i32/i64,u8/u16/u32/u64,f32/f64,bool,str and[u8]. Numeric widths use explicit little-endian arrays, i8 casts to one u8, bool uses0/1, str borrows UTF-8 and byte slices borrow unchanged. No type tag, terminator or Unicode/float normalization is added. Equal byte patterns across types hash identically; +0.0/-0.0 or different NaN payloads retain distinct bytes. Generic SBBF methods accept T:AsBytes+?Sized, permitting str/slices; no explicit owned String implementation exists here. Caller logical equality/canonicalization must be established separately. (rust/lance-core/src/utils/bloomfilter/as_bytes.rs:9-92; rust/lance-core/src/utils/bloomfilter/sbbf.rs:296-317; rust/lance-core/src/utils/bloomfilter/sbbf.rs:419-425)

## Membership algorithm and raw format

A private Block contains eight u32 lanes (256bits/32bytes). hash_as_bytes computes xxHash64(seed0). Upper32 hash bits choose floor(high32*block_count/2^32), with saturating u64 multiplication; lower32 hash bits x choose one bit per lane: bit_i=1<<((x*SALT[i] wrapping u32)>>27). insert ORs all eight bits; check requires every bit to be present. The exact salts, order and endian codec are retained in the [format specification](../L3-symbols/format-spec.md). Source contains scalar loops, not explicit SIMD intrinsics; SIMD/performance descriptions are design claims rather than measured results. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:76-168; rust/lance-core/src/utils/bloomfilter/sbbf.rs:234-237; rust/lance-core/src/utils/bloomfilter/sbbf.rs:290-317; rust/lance-core/src/utils/bloomfilter/sbbf.rs:419-425)

Raw new accepts any byte length divisible by32, including zero, arbitrary positive block counts and values beyond the sizing constructor's maximum. It copies little-endian u32 words into Vec<Block>. Empty raw filters have no block: insert/check panic by indexing0; serialization emits empty bytes and equal-size intersection returns false. There is no magic/version/hash seed/config/type header in to_bytes/write_bitset. The check_hash doc incorrectly says uninserted hashes always return false despite also allowing false positives; actual bit membership can return false positives and preserves inserted hashes under the same representation. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:243-269; rust/lance-core/src/utils/bloomfilter/sbbf.rs:290-378)

Endianness is explicit. Little-endian targets transmute a copied[u32;8] into[u8;32]; non-little-endian targets first swap every word. The unsafe value transmute has equal sizes and no invalid bit patterns and does not expose borrowed alignment/lifetime issues. Parsing uses from_le_bytes with no unsafe block. Cross-architecture execution has not been tested here. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:109-132; rust/lance-core/src/utils/bloomfilter/sbbf.rs:255-266)

## Sizing and builder behavior

with_log2_num_bytes takes a u8 exponent, clamps to[5,27] and allocates32B through128MiB. It first creates a zero byte buffer, then copies through new into blocks, temporarily retaining both allocations. with_ndv_fpp accepts fpp in[0,1), including0, and rejects negative nonzero,1,NaN/infinity. It estimates a minimum exponent then invokes the same clamp, so the requested false-positive target can exceed available sizing limits. Deserialization does not enforce these min/max bounds. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:214-287)

The private estimate uses a Poisson bucket occupancy approximation. With b=2^log bytes and n distinct values, n=0 returns0; n/(8b)>2 returns1. Otherwise lambda=256/((8b)/n) and sum i=749..0 of exp(i*ln(lambda)-lambda-lgamma(i+1)+8*ln(1-(31/32)^i)), capped at1. Binary search low0/high64 returns the first retained high exponent; midpoints are<64 and the result is not yet allocation-clamped. Comments justify descending summation/numerical stability and750 terms for tested values, not universal numerical guarantees. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:170-232)

SbbfBuilder has optional ndv/fpp/explicit log2 size and consuming setters without validation. build prioritizes explicit size, ignoring simultaneous ndv/fpp and even invalid fpp. Otherwise both ndv and fpp are required; missing options return InvalidData. Default starts all None, so default.build fails. This existing behavior conflicts with the general rule to reject mutually exclusive builder options; documentation records it without changing the source. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:427-480; AGENTS.md:67-72)

## Errors, memory and intersection

SbbfError has InvalidFpp, InvalidData and WriteError; its own Result<T> differs from core Result. Only WriteError exposes a source error. write_bitset writes32-byte blocks with write_all, may leave a partially written output on error and does not flush. to_bytes allocates live-byte storage. size_bytes uses len*32, whereas estimated_memory_size uses capacity*sizeof(Block), excluding the filter/Vec header and temporary allocations despite a total-memory doc. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:38-74; rust/lance-core/src/utils/bloomfilter/sbbf.rs:320-352)

might_intersect rejects unequal block counts, then accepts as soon as any word AND is nonzero. This is much weaker than checking an entire element's eight-bit mask. bytes_might_intersect rejects only unequal byte lengths, accepts equal empty/non32-multiple slices and checks any overlapping bit. might_intersect_bytes first serializes self, allocating a full copy. A false result proves disjoint represented elements only when canonicalization/hash/layout are compatible; length equality cannot establish that provenance. No intersection false-positive target is enforced. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:354-416)

Insertion/query after hashing touch eight lanes in one block; builtin byte conversion uses fixed arrays or borrows, and hashing cost depends on input length. Construction/serialization scale with raw size; intersections scan with early exit. Probability sizing invokes bounded binary search with up to750 terms per estimate. These are source-derived operation costs, not benchmarks or exact allocator measurements. (rust/lance-core/src/utils/bloomfilter/as_bytes.rs:15-92; rust/lance-core/src/utils/bloomfilter/sbbf.rs:98-151; rust/lance-core/src/utils/bloomfilter/sbbf.rs:173-232; rust/lance-core/src/utils/bloomfilter/sbbf.rs:255-416)

## Tests and extension boundary

AsBytes tests cover representative signed integers,1.0 floats,str,slice and both bool values. SBBF tests pin the empty-string hash, one-bit-per-lane masks for1000 values, positive membership, a few negative samples, builder nonempty result, nine estimator outputs and serialization preserving50 inserted values. They do not measure empirical FPP, validate upstream golden bitsets, test malformed/empty raw filters, intersections, writer errors or conflicting builder settings. No tests were executed. (rust/lance-core/src/utils/bloomfilter/as_bytes.rs:94-164; rust/lance-core/src/utils/bloomfilter/sbbf.rs:482-622)

AsBytes is the local type-extension seam; maintain identical insertion/query bytes and explicitly resolve logical equality/null/type semantics in the eventual scalar-index consumer. Changing hash,seed,salts,lane order or endian interpretation changes raw persisted membership. Determine current writer/readers and released contract status before a format change; this helper carries no version gate. (rust/lance-core/src/utils/bloomfilter/as_bytes.rs:9-14; rust/lance-core/src/utils/bloomfilter/sbbf.rs:76-151; rust/lance-core/src/utils/bloomfilter/sbbf.rs:320-337; rust/lance-core/src/utils/bloomfilter/sbbf.rs:419-425; AGENTS.md:5-17)

## Exact public declarations

| Qualified symbol | Kind | Exact declaration | Evidence and full body |
|---|---|---|---|
${symbols.filter(s=>paths.has(s.path)&&s.visibility==='public Rust API').map(s=>`| \`${s.name}\` | ${s.kind} | \`${s.signature.replaceAll('|','\\|')}\` | [${s.path}:${s.line}-${s.end_line}](../${s.analysis}) |`).join('\n')}

## Files

- [directory](../L2-files/rust/lance-core/src/utils/bloomfilter.rs.md), rust/lance-core/src/utils/bloomfilter.rs:1-10.
- [AsBytes](../L2-files/rust/lance-core/src/utils/bloomfilter/as_bytes.rs.md), rust/lance-core/src/utils/bloomfilter/as_bytes.rs:1-164.
- [SBBF](../L2-files/rust/lance-core/src/utils/bloomfilter/sbbf.rs.md), rust/lance-core/src/utils/bloomfilter/sbbf.rs:1-622.
`);
write('L1-modules/rust-lance-core.md',read('L1-modules/rust-lance-core.md').replace('thirty-four files','thirty-seven files').replace('and saved property-test seeds.','saved property-test seeds and generic Bloom-filter primitives.').replace('Caches and the remaining utility algorithms remain pending.','Cache implementations, their benchmark and allocation test remain pending.'));
append('L1-modules/rust-lance-core.md','The [Bloom supplement](rust-lance-core-bloom.md) documents canonical byte inputs, exact split-block membership/serialization, sizing estimates, builder precedence and intersection limits. Higher-level scalar-index registration, persistence metadata and query semantics are not established by these primitives. (rust/lance-core/src/utils/bloomfilter.rs:4-10; rust/lance-core/src/utils/bloomfilter/sbbf.rs:243-480)');
append('L0-orientation.md',`| Term | Local meaning | Evidence |
|---|---|---|
| SBBF | Split-block Bloom filter: one selected256-bit block, one bit in each of eight32-bit lanes | rust/lance-core/src/utils/bloomfilter/sbbf.rs:76-151; rust/lance-core/src/utils/bloomfilter/sbbf.rs:290-317 |
| AsBytes | Local generic value-to-canonical-byte input trait | rust/lance-core/src/utils/bloomfilter/as_bytes.rs:9-92 |
| NDV | Expected number of distinct inserted values used for sizing | rust/lance-core/src/utils/bloomfilter/sbbf.rs:281-287; rust/lance-core/src/utils/bloomfilter/sbbf.rs:444-447 |
| FPP | False-positive-probability target supplied to analytical sizing, subject to clamp/approximation | rust/lance-core/src/utils/bloomfilter/sbbf.rs:170-287 |

[Exact APIs and limits](L1-modules/rust-lance-core-bloom.md).`);
append('L3-symbols/format-spec.md',`Local SBBF raw bytes contain only concatenated32-byte blocks; each is eight little-endian u32 words. new accepts any multiple of32, including0, and no power-of-two/minimum/maximum check is imposed. There is no magic,version,seed,type,NDV orFPP header. to_bytes and write_bitset preserve block then lane order. Empty input is structurally accepted but membership methods panic because no block exists. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:243-269; rust/lance-core/src/utils/bloomfilter/sbbf.rs:290-352)

Membership identity is xxHash64(seed0) over the exact AsBytes representation. high32 selects floor(high32*block_count/2^32) via saturating multiplication; low32 x sets bit ((x*salt_i wrapping u32)>>27) in each lane. All eight selected bits are required for a positive membership result. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:98-151; rust/lance-core/src/utils/bloomfilter/sbbf.rs:290-317; rust/lance-core/src/utils/bloomfilter/sbbf.rs:419-425)

| Lane | Salt |
|---|---|
| 0 | 0x47b6137b |
| 1 | 0x44974d91 |
| 2 | 0x8824ad5b |
| 3 | 0xa2b7289d |
| 4 | 0x705495c7 |
| 5 | 0x2df1424b |
| 6 | 0x9efc4947 |
| 7 | 0x5c6bfb31 |

Exact constants: rust/lance-core/src/utils/bloomfilter/sbbf.rs:76-86. Numeric input is little-endian without type tags; strings are raw UTF-8, bool0/1, byte slices unchanged. Floating bit patterns are not normalized. (rust/lance-core/src/utils/bloomfilter/as_bytes.rs:15-92)

The source claims Parquet compatibility, but no external spec was fetched and no upstream fixture was executed. Full xxHash64 algorithm internals and enclosing Lance scalar-index schema/version selection remain unreviewed dependencies, so the KB cannot yet independently implement the complete persisted index solely from this local raw-bitset description. [Detailed APIs](../L1-modules/rust-lance-core-bloom.md). (rust/lance-core/src/utils/bloomfilter/sbbf.rs:21-36; rust/lance-core/src/utils/bloomfilter/sbbf.rs:419-425)`);
append('L3-symbols/behavior-contracts.md',`| Surface | Contract/edge | Evidence |
|---|---|---|
| Canonical bytes | No float/Unicode normalization or type tag; insertion and query must agree | rust/lance-core/src/utils/bloomfilter/as_bytes.rs:15-92 |
| Raw parse | Accepts empty/multiple32 sizes; empty membership panics | rust/lance-core/src/utils/bloomfilter/sbbf.rs:243-269; rust/lance-core/src/utils/bloomfilter/sbbf.rs:290-317 |
| Sizing | Explicit exponent clamps5..27; probability accepts0 but cannot guarantee arbitrarily low target at cap | rust/lance-core/src/utils/bloomfilter/sbbf.rs:271-287 |
| Builder | Explicit size takes precedence, ignoring simultaneous/invalid probability settings | rust/lance-core/src/utils/bloomfilter/sbbf.rs:462-473 |
| Intersection | Any one overlapping bit suffices; raw comparison only checks equal length | rust/lance-core/src/utils/bloomfilter/sbbf.rs:354-416 |
| Output error | Writer can be partially written before WriteError; no flush/rollback | rust/lance-core/src/utils/bloomfilter/sbbf.rs:320-328 |

[Complete API](../L1-modules/rust-lance-core-bloom.md).`);
append('L4-crosscutting/scenarios.md',`A local membership path converts a value through AsBytes, hashes with xxHash64(seed0), selects one block using upper32 bits and ORs eight salt-derived low32 mask bits. A query repeats the same conversion/hash and returns false if any required bit is absent. Serialization emits the block words little-endian; reparsing reconstructs them and reuses the same hash rules. This ends at the generic primitive: row/value extraction, null policy, scalar-index storage and query registration remain pending. (rust/lance-core/src/utils/bloomfilter/as_bytes.rs:15-92; rust/lance-core/src/utils/bloomfilter/sbbf.rs:98-151; rust/lance-core/src/utils/bloomfilter/sbbf.rs:243-337; rust/lance-core/src/utils/bloomfilter/sbbf.rs:419-425)`);
append('L4-crosscutting/build-and-test.md',`AsBytes assertions pin representative little-endian integer/float bytes, UTF-8/slice passthrough and bool0/1. SBBF assertions pin empty-string hash17241709254077376921, mask shape and positive membership, nine analytical sizing examples and a50-item serialization round trip. Tests provide a few deterministic negative samples but no empirical FPP/recall benchmark, upstream golden fixture, malformed-empty handling, intersection test, conflicting-config test or write-error injection. All tests were read only. (rust/lance-core/src/utils/bloomfilter/as_bytes.rs:94-164; rust/lance-core/src/utils/bloomfilter/sbbf.rs:482-622)`);
append('L4-crosscutting/pitfalls.md',`- Raw Sbbf::new accepts zero bytes; querying/inserting then panics. Public sizing constructors always allocate at least32bytes, so their behavior does not establish raw-parser safety. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:243-317)
- Explicit builder size ignores simultaneous ndv/fpp, including invalid fpp; exponent clamping means requested probability is not an unconditional guarantee. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:271-287; rust/lance-core/src/utils/bloomfilter/sbbf.rs:462-473)
- Float signed zero/NaN payloads and cross-type raw bytes need caller-level canonicalization rules; this generic helper supplies none. Changing seed/salts/endian rules changes persisted membership. (rust/lance-core/src/utils/bloomfilter/as_bytes.rs:15-92; rust/lance-core/src/utils/bloomfilter/sbbf.rs:76-151; rust/lance-core/src/utils/bloomfilter/sbbf.rs:419-425)
- Intersection uses any common bit, while element membership requires all eight lane bits. Raw byte intersection validates only equal lengths and may allocate a full filter copy through might_intersect_bytes. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:143-151; rust/lance-core/src/utils/bloomfilter/sbbf.rs:354-416)`);
append('L4-crosscutting/cookbook.md',`For a new scalar byte type, AsBytes is the local extension seam. Define deterministic bytes, test edge values and equivalence rules, then ensure insertion/query consumers use the identical representation. Extend the existing as_bytes/sbbf test modules with exact expected bytes and membership/serialization cases. A complete new scalar-index recipe still requires lance-index factories, planners, persistence/null policy and bindings, none supplied by this generic trait alone. (rust/lance-core/src/utils/bloomfilter/as_bytes.rs:9-164; rust/lance-core/src/utils/bloomfilter/sbbf.rs:296-317; rust/lance-core/src/utils/bloomfilter/sbbf.rs:482-622)

For raw filter format or hash changes, inspect current index metadata/readers and released compatibility before changing seed,salts,word order or input canonicalization. The raw payload has no internal version discriminator. Preserve legacy reading and implement new behavior only in current paths under the repository policy once consumers are established. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:76-151; rust/lance-core/src/utils/bloomfilter/sbbf.rs:320-337; rust/lance-core/src/utils/bloomfilter/sbbf.rs:419-425; AGENTS.md:5-17)`);
const manifest=JSON.parse(read('MANIFEST.json')),state=JSON.parse(read('iteration-state.json'));state.totals=manifest.totals;state.read_not_analyzed=[];state.next='VERIFY11 confirms path/tokio corrections and three Bloom files; remaining core files are cache implementations, benchmark and allocation test.';state.acceptance_gaps=['2002 files pending','294 binary files pending','VERIFY11 pending','all five complete self-sufficiency answers fail','whole-repository callers/callees pending'];write('iteration-state.json',JSON.stringify(state,null,2));
let entry=read('README.md');entry=entry.slice(0,entry.indexOf('## Current checkpoint'))+`## Current checkpoint

57 of 2,059 files and 20,651 of 1,166,813 text lines are analyzed. Coverage includes all 15 protobuf-subsystem files, thirty-seven lance-core files and five other contributor guides. The index contains 2,537 records: 971 protobuf and 1,566 Rust declarations. All 294 binary files remain pending.

Ten VERIFY cycles are recorded. ANALYZE11 corrected both VERIFY10 claim mismatches and documented all three generic Bloom-filter files; VERIFY11 is next. Source remains unchanged. Global acceptance still fails: 2,002 files and all five complete self-sufficiency answers are pending. See [iteration state](iteration-state.json) and [verification log](verification-log.md).

Analysis records may retain superseded drafts for provenance. Follow each file's current analysis_record in MANIFEST and its current L2 document; verification snapshots intentionally retain the claims as they were sampled.
`;write('README.md',entry);console.log(JSON.stringify({symbols:symbols.length,totals:manifest.totals}));
