import fs from 'node:fs';
import {root,linesOf} from './inventory.mjs';
const read=p=>JSON.parse(fs.readFileSync(p)),write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const module='L1-modules/rust-lance-file-v1-codecs.md';
const prefix='rust/lance-file/src/versions/v1/encoding/';
const cite=(file,a,b)=>`${prefix}${file}.rs:${a}-${b}`;
let doc=`# Frozen V1 concrete codecs

Complete local scope: binary.rs, dictionary.rs and plain.rs, all 1,815 physical lines. The 18 active test functions and five helpers were read, not run; three commented-out tests provide historical context only. Full V1 reader/writer/statistics and backend lifecycle remain pending. Preserve these frozen compatibility surfaces rather than extending them for new format features. (AGENTS.md:13-18)

[Crate](rust-lance-file.md) · [V1 foundations](rust-lance-file-v1-foundation.md) · [Orientation](../L0-orientation.md) · [Symbols](../L3-symbols/symbol-index.md) · [Contracts](../L3-symbols/behavior-contracts.md) · [Format](../L3-symbols/format-spec.md) · [Scenarios](../L4-crosscutting/scenarios.md)

## Ownership and integration

Each encoder exclusively borrows Writer; each decoder borrows Reader. Plain and dictionary codecs also borrow DataType, while BinaryDecoder selects the Arrow byte-array type through its generic parameter and stores nullable. DictionaryDecoder owns an ArrayRef for already loaded values. Constructors store state without general file-bound or schema validation; DictionaryDecoder::new asserts the outer dictionary shape, and PlainDecoder::new unconditionally returns Ok. (${cite('binary',38,47)}; ${cite('binary',107,151)}; ${cite('plain',32,42)}; ${cite('plain',211,224)}; ${cite('dictionary',26,36)}; ${cite('dictionary',80,120)})

~~~text
V1 writer page adapter
|-- PlainEncoder: primitive bytes / joined Boolean bits / recursive FSL values
|-- BinaryEncoder: payload bytes -> absolute Int64 position table
\x60-- DictionaryEncoder: PlainEncoder for keys only

V1 reader page adapter
|-- PlainDecoder: range IO -> array reconstruction
|-- BinaryDecoder: PlainDecoder positions -> payload range(s)
\x60-- DictionaryDecoder: PlainDecoder keys + supplied dictionary values
~~~

The page adapters store the encoder return as PageInfo.position and summed logical rows as length. Dictionary values travel separately through schema dictionary hydration; the reader adapter unwraps both dictionary metadata and loaded values before constructing its decoder. Complete caller lifecycle is not established by these narrow functions. (rust/lance-file/src/versions/v1/writer/mod.rs:406-459; rust/lance-file/src/versions/v1/reader.rs:625-668; rust/lance-file/src/versions/v1/encoding.rs:92-192)

## Binary layout and null semantics

For N rows, write the sliced payload spans in order, then N+1 absolute Int64 byte positions. Return the position-table start, not the first payload byte. The first position is Writer::tell before payloads; later array offsets are rebased to the current absolute end. The raw Int64 buffer is written without explicit endian conversion or framing. A nonempty list of empty arrays writes one endpoint; an empty input slice asserts. Exactly Utf8, Binary, LargeUtf8 and LargeBinary are supported; views return InvalidInput. (${cite('binary',48,105)})

The encoder ignores original validity. Decoder nullable=true marks equal adjacent positions null, so valid empty values become null and null slots retaining nonempty payload cannot be distinguished from valid values. nullable=false returns all values valid, including empty spans. This is a frozen representation rule, not a universal null-preserving binary codec. (${cite('binary',61,86)}; ${cite('binary',165,232)})

Range reads first fetch N+1 Int64 positions through PlainDecoder, subtract the first absolute position and cast offsets to Int32 for small byte arrays. Payload IO is skipped when start>=end; otherwise request that absolute byte range. Array construction is fallible, but negative/nonmonotone offsets and exact response size have no dedicated local checks. The internal endpoint assertion is weaker than the subsequent endpoint access. (${cite('binary',153,233)}; ${cite('binary',394,415)})

## Selection rules and IO cost

| Behavior | BinaryDecoder | PlainDecoder and dictionary key reads |
|---|---|---|
| Empty range beyond logical length | Reject if end exceeds length before empty check | Return empty before bounds/type checks |
| Reversed range with end in bounds | Return empty | Return empty |
| RangeFrom starting beyond length | Return empty reversed range | Return empty reversed range |
| Multiple Ranges | InvalidInput | InvalidInput |
| Empty Indices | Typed empty, no IO | Typed empty, no IO |
| Take planning | Full first-to-last position span; fixed 64KiB byte-distance threshold | Reader block size; Boolean-specific block arithmetic |
| Ordering validation | Sorted-input assumption, no sorting; null index unwraps during sizing | Raw selector values drive planning without sorting or null preflight |

Selection evidence: ${cite('binary',286,328)}; ${cite('binary',394,428)}; ${cite('plain',306,343)}; ${cite('plain',374,439)}; ${cite('dictionary',122,174)}.

Binary takes precompute the sum of selected value lengths, allocate payload and N+1 offsets, read planned chunks with ordered buffered(reader.io_parallelism), then copy a contiguous chunk once or gather each requested value. The position span can be large for two far-apart rows; a contiguous value run can exceed the nominal 64KiB threshold. Output is materialized even when the range-reader payload can share Bytes storage. (${cite('binary',246,390)})

Plain takes keep consecutive rows in the same chunk regardless of block_size, and otherwise split by distance from the chunk's first row. Boolean takes split on row/(block_size*8). Both read enclosing ranges, apply Arrow take and retain all decoded chunk arrays before concat. The IO threshold is not a maximum request size; zero/truncated Boolean block sizes and unchecked arithmetic remain assumptions. FixedSizeList<Boolean> range decoding can recurse, while take calls byte_width, which is unavailable for its Boolean child. (${cite('plain',306,408)}; rust/lance-arrow/src/lib.rs:144-182)

## Repeated-leading-index discrepancy

The binary planner's condition is current==start_idx OR current-last_idx==1, where current is a relative row index and start_idx is a selector ordinal. For a nonempty value of length L and sorted indices [k,k], subtraction gives [0,0]; both iterations satisfy current==start_idx, leaving is_contiguous=true. The chunk reads/copies one value span L, but the output offsets and capacity count two values, reaching the debug assertion L==2L. Release execution reaches fallible array building with inconsistent offsets. This is an explicit source trace, not an executed reproduction. (${cite('binary',251,284)}; ${cite('binary',309,388)})

The dense test includes a repeated later index and checks correct output; it does not include a repeated first index. Its standalone planner uses a 1024-byte threshold, whereas decoder.take uses 64KiB. Do not generalize that passing fixture into all-duplicate correctness or assume the tested standalone plan is the actual take plan. (${cite('binary',616,662)})

## Plain bytes, recursive arrays and unsafe boundaries

Plain primitives write values only. Boolean inputs are joined bit by bit and None becomes false; other types use first-array byte_width and each array's offset/length to form an unsafe raw buffer slice. The configured DataType only selects FixedSizeList recursion; the primitive branch otherwise uses the actual first array type. It never validates that every later array has that type or enough bytes for the resulting span. Homogeneous valid Arrow arrays are a safety precondition: mixed narrower arrays can make the computed raw slice exceed its allocation. (${cite('plain',60,152)})

Fixed lists recursively write sliced child values, discarding parent and eventual primitive validity. Read reconstructs them with parent validity None; fixed binary reads UInt8 values then builds a width-based array. Signed dimensions are cast and multiplied without local validation. Null primitive payloads are whatever the input values buffer contains, except Boolean's explicit false substitution; the compatibility fixture's zero/null-key expectations do not prove every possible null backing value is zero. (${cite('plain',73,152)}; ${cite('plain',252,304)}; rust/lance-file/src/compatibility_tests.rs:100-135)

bytes_to_array requires one value buffer. For FixedWidth, a short response is copied and zero-filled to (len+offset)*width; otherwise aligned Bytes can be retained and misaligned Bytes are copied. The resulting array has null_count0. This means truncated fixed-width input is not necessarily rejected: the active test supplies five bytes for three UInt16 values and expects the missing sixth byte to be zero. Bit-packed Boolean uses its separate buffer branch and starting bit offset. (${cite('plain',174,249)}; ${cite('plain',575,592)}; rust/lance-arrow/src/lib.rs:1536-1600)

These codecs perform unchecked pointer/offset/capacity arithmetic and have assertions/downcasts in public-call paths. No local transaction, rollback, flush/shutdown, abort guard or cancellation cleanup appears. Buffered futures preserve order and limit polling concurrency but do not prove backend cancellation; complete IO ownership remains pending. (${cite('binary',48,105)}; ${cite('binary',309,390)}; ${cite('plain',90,152)}; ${cite('plain',325,408)}; ${cite('dictionary',37,77)})

## Dictionary keys and values

DictionaryEncoder supports all eight signed/unsigned integer key widths. It extracts each array's keys and writes them with PlainEncoder; no value comparison, dictionary merge/remap, value persistence or key-validity bitmap occurs. Supplying different dictionaries with the same key width therefore requires the caller to have already established compatible key meaning. The constructor's configured key type controls downcasts; unsupported types return Schema and supported types with an empty slice assert. (${cite('dictionary',26,77)})

DictionaryDecoder reads keys using PlainDecoder, clones the shared values Arc and calls DictionaryArray::try_new. Its declared dictionary value type is never compared with the supplied array; result value type follows that array. Keys lose stored validity through plain reconstruction, but dictionary values can independently be null. The one local test writes keys directly using PlainEncoder and never invokes DictionaryEncoder. (${cite('dictionary',104,174)}; ${cite('dictionary',187,252)})

The foundation's binary-like predicate includes views, but both concrete binary encode and facade decode reject them. PlainEncoder can write fixed-width numeric buffers beyond integer widths, whereas schema dictionary hydration explicitly accepts only eight integer value types or the four binary families. These are different boundaries; do not infer symmetric hydration from write dispatch. (${cite('binary',91,105)}; ${cite('plain',90,115)}; rust/lance-arrow/src/lib.rs:144-182; rust/lance-file/src/versions/v1/encoding.rs:116-175)

## Test map and dependencies

Eight binary tests cover Utf8/LargeUtf8 multi-array/null roundtrips, one sliced offset, range variants, a simple take, million-row sparse/dense takes, repeated-write table positions and Binary null takes. Nine plain tests cover primitive raw-buffer roundtrips, Boolean joining, FSL/FSB and nested shapes, zero-padding, Int32 ranges/takes and usize chunk arithmetic. One dictionary test invokes eight key widths with supplied string values. Three disabled plain tests describe Boolean slices/nulls, FSL slices and Boolean takes; they are not executable coverage. (${cite('binary',431,710)}; ${cite('plain',442,852)}; ${cite('dictionary',177,253)})

Untested local cases include leading duplicate binary indices, empty-vs-null binary values, mixed-array unsafe spans, null dictionary keys, inconsistent dictionaries/value types, invalid dimensions, all selector variants and error timing, and partial-write/cancellation behavior. Primitive test inputs reinterpret raw i64/f64 buffers for narrower types rather than numerically casting values; random float inputs are not pinned portable fixtures. (${cite('binary',485,710)}; ${cite('plain',456,490)}; ${cite('plain',717,851)}; ${cite('dictionary',187,252)})

Dependencies are Arrow arrays/layout/casts/arithmetic/take/concat, Bytes and local BufferExt for ownership/alignment, Reader/Writer for IO policy, Tokio write extensions, ordered futures streams and async-recursion. Generic ByteArrayType and ArrowDictionaryKeyType select existing Arrow representations, not runtime codec registries. No local Cargo feature, environment variable or codec plugin hook is declared. Full Arrow and IO implementations remain outside this completed slice. (${cite('binary',7,36)}; ${cite('plain',9,29)}; ${cite('dictionary',7,24)})

## Exact production declarations

All 70 non-test declarations are retained below, including the function-local MIN_IO_SIZE constant. Full bodies, disabled test text and contiguous annotations are in the linked L2 documents.

| Qualified suffix within lance_file::versions::v1::encoding | Visibility / kind | Exact declaration | Evidence |
|---|---|---|---|
`;
const symbols=read('analysis/iteration-061-symbols.json');
for(const s of symbols.filter(s=>!s.cfg)){
 const src=linesOf(fs.readFileSync(root+'/'+s.path,'utf8'));
 const sig=src.slice(s.line-1,s.end_line).join(' ').trim().replaceAll('|','\\|');
 doc+=`| \`${s.name.replace('lance_file::versions::v1::encoding::','')}\` | ${s.visibility} / ${s.kind} | \`${sig}\` | [${s.path}:${s.line}-${s.end_line}](../L2-files/${s.path}.md) |\n`;
}
fs.writeFileSync(module,doc);
const append=(p,s)=>fs.appendFileSync(p,'\n'+s+'\n');
append('L0-orientation.md',`## Frozen V1 codec terms

- **Absolute binary position table**: N+1 Int64 file offsets written after N rows' payload; PageInfo points to that table. Equal adjacent positions become null only when the decoder's nullable flag is true. (${cite('binary',48,105)}; ${cite('binary',165,232)})
- **Plain validity loss**: fixed-stride values persist without a validity buffer; Boolean None becomes false and decoded primitive rows are all valid. This is a historical V1 constraint. (${cite('plain',73,115)}; ${cite('plain',202,208)})
- **Shared dictionary values**: V1 key pages contain plain integer keys, while a supplied ArrayRef provides the values and is shared by decoded dictionary arrays. (${cite('dictionary',37,55)}; ${cite('dictionary',151,159)})

[Concrete codec contracts](L1-modules/rust-lance-file-v1-codecs.md) explain range/take IO and test limits. Full repository acceptance remains incomplete.`);
append('L3-symbols/behavior-contracts.md',`## Frozen V1 codec selection and safety

PlainDecoder returns empty before checking bounds/type; BinaryDecoder checks end against logical length first. Both reject ReadBatchParams::Ranges. Their public constructors do not establish all downstream invariants. (${cite('plain',211,224)}; ${cite('plain',410,439)}; ${cite('binary',143,151)}; ${cite('binary',394,428)})

Binary take's normalized [0,0] leading-repeat plan can remain contiguous, copying one nonempty payload while accumulating two offsets. The capacity assertion then fails in debug; release reaches fallible array building. The existing later-repeat test does not cover this path. This is a source-derived edge case, not an executed failure. (${cite('binary',251,284)}; ${cite('binary',309,388)}; ${cite('binary',616,662)})

Plain encoding's unsafe raw spans assume every input uses the first array's fixed byte width and valid offset/buffer bounds. No per-array compatibility check enforces that. Decoding short fixed-width buffers zero-pads them; this can hide missing bytes. Dictionary key validity is not persisted and supplied value type is not checked against declared dictionary value type. Preserve historical contracts during unrelated current-format work. (${cite('plain',90,115)}; ${cite('plain',174,208)}; ${cite('dictionary',37,55)}; ${cite('dictionary',104,159)}; AGENTS.md:13-18)

[Complete API, error and allocation map](../L1-modules/rust-lance-file-v1-codecs.md).`);
append('L3-symbols/format-spec.md',`## Concrete V1 value layouts

| Codec | Stored region / returned position | Validity and reconstruction |
|---|---|---|
| Plain primitive / FixedSizeBinary | Raw values buffer spans; return start | No validity or explicit endian conversion |
| Plain Boolean | One packed value bitmap across all input arrays | None encoded false; no validity bitmap |
| Plain FixedSizeList | Recursively flattened child values | Parent validity omitted; dimensions supplied externally |
| Binary four byte-array families | Payload bytes followed by N+1 absolute Int64 positions; return positions start | Equal positions imply null when nullable=true; empty and null are conflated |
| Dictionary | Plain integer key page; return keys start | Values supplied separately; key validity omitted |

Layout evidence: ${cite('plain',44,152)}; ${cite('binary',48,105)}; ${cite('dictionary',37,77)}. None of these regions independently stores logical length/type or a page header. Surrounding V1 schema/page metadata supplies those inputs. (rust/lance-file/src/versions/v1/writer/mod.rs:406-459; rust/lance-file/src/versions/v1/reader.rs:625-668)

Range byte addressing is floor/ceil over bits for Boolean, width multiplication for other plain values, and two absolute endpoints for Binary. Short fixed-width reads may be zero-filled; no new corruption-rejection guarantee is inferred. (${cite('plain',165,249)}; ${cite('binary',190,232)}) [Codec detail](../L1-modules/rust-lance-file-v1-codecs.md).`);
append('L4-crosscutting/scenarios.md',`## Frozen V1 value roundtrip subtrace

1. A page adapter selects the legacy codec and stores returned position plus logical row count. Binary position means the table after payload; plain/dictionary position means value/key bytes. (rust/lance-file/src/versions/v1/writer/mod.rs:406-459; ${cite('binary',48,105)}; ${cite('plain',90,115)})
2. The binary reader uses field.nullable, fetches positions through PlainDecoder and reads the enclosing payload range. Equal endpoints reconstruct null; original validity was not stored. (rust/lance-file/src/versions/v1/reader.rs:625-642; ${cite('binary',153,232)})
3. Dictionary reading unwraps loaded schema values, reads plain keys and combines them with the shared ArrayRef. This does not merge dictionaries or load values at the key-decoder layer. (rust/lance-file/src/versions/v1/reader.rs:645-668; ${cite('dictionary',122,159)})

This closes concrete codec subtraces only. Full V1 lifecycle, modern codec algorithms, Dataset write/compaction, index registration, bindings and commit retry/conflict handling still prevent all five complete KB-only acceptance answers. [Codec supplement](../L1-modules/rust-lance-file-v1-codecs.md).`);
append('L4-crosscutting/build-and-test.md',`## V1 concrete codec test coverage

The three codec files contain 18 active tests and five helpers: eight binary, nine plain and one dictionary test dispatching eight key types. Three plain test bodies are entirely commented out. Tests were read, not executed. Binary sparse/dense fixtures allocate a million strings; no runtime-duration claim is made. (${cite('binary',431,710)}; ${cite('plain',442,852)}; ${cite('dictionary',177,253)})

The dictionary fixture uses PlainEncoder directly and therefore supplies no DictionaryEncoder regression. Plain padding intentionally expects zero extension; narrow primitive/float fixtures reinterpret raw wider buffers. Leading binary repeats, disabled Boolean take/slice paths, mixed-type unsafe spans and failure/cancellation remain local test gaps. (${cite('dictionary',209,238)}; ${cite('plain',456,490)}; ${cite('plain',575,592)}; ${cite('plain',717,832)}; ${cite('binary',616,662)}) [Detailed oracles](../L1-modules/rust-lance-file-v1-codecs.md).`);
append('L4-crosscutting/cookbook.md',`## Separately authorized V1 codec repair

Treat concrete legacy codecs as frozen compatibility surfaces. If a legacy bug repair is explicitly requested, inspect the exact binary/plain/dictionary method plus page adapter, schema hydration and released fixture expectations. Add independent oracles for the specific edge case; leading binary repeats require a distinct case from the existing later-repeat test, and dictionary encoder coverage cannot rely on the decoder fixture's direct PlainEncoder write. Preserve old persisted layout and null conventions unless the task explicitly requires a compatible migration plan. Current-format features belong in current encoders. (AGENTS.md:13-18; ${cite('binary',251,284)}; ${cite('binary',616,662)}; ${cite('dictionary',209,238)}; rust/lance-file/src/versions/v1/encoding.rs:92-192)

Full reader/writer/backend and historical binary fixture analysis remains necessary before qualifying such a repair. [Exact codec APIs](../L1-modules/rust-lance-file-v1-codecs.md).`);
append('L4-crosscutting/pitfalls.md',`## V1 codec assumptions that are not general guarantees

- Do not assume nullable binary preserves empty values, or that null primitive/key slots always reconstruct zero independently of their input backing bytes. (${cite('binary',65,86)}; ${cite('binary',165,181)}; ${cite('plain',90,115)})
- Do not equate sorted indices with safe contiguous classification: leading repeats can hit the binary fast-path discrepancy. (${cite('binary',251,284)}; ${cite('binary',329,388)})
- Reader block size is not a hard cap for continuous plain runs; the binary positions span remains unchunked. (${cite('plain',346,372)}; ${cite('binary',300,308)})
- A Result-returning PlainDecoder constructor does not validate, and its fixed-width byte adapter can pad truncation instead of rejecting it. (${cite('plain',174,224)})
- Disabled historical tests and decoder-only dictionary fixtures do not prove the corresponding live writer/take paths. (${cite('plain',717,832)}; ${cite('dictionary',209,252)})

[Full caveats and unsafe preconditions](../L1-modules/rust-lance-file-v1-codecs.md).`);
console.log({module,production_declarations:symbols.filter(s=>!s.cfg).length,layers_updated:7});
