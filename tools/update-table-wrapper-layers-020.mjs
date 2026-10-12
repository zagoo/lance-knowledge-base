import fs from 'node:fs';import path from 'node:path';import{output}from './inventory.mjs';const read=f=>fs.readFileSync(path.join(output,f),'utf8'),write=(f,s)=>fs.writeFileSync(path.join(output,f),s.trimEnd()+'\n'),append=(f,s)=>fs.appendFileSync(path.join(output,f),'\n'+s.trim()+'\n');
let l1=read('L1-modules/rust-lance-table.md').replace('Ten of54 inventory entries are analyzed, covering1,113 physical lines','Twelve of54 inventory entries are analyzed, covering1,520 physical lines').replace('Core metadata implementations, row-ID structures, transaction algorithms','Most metadata implementations, row-ID sequence structures, transaction algorithms');write('L1-modules/rust-lance-table.md',l1);
append('L1-modules/rust-lance-table.md',`## Inline row identity and format Transaction wrappers

[Row-ID metadata L2](../L2-files/rust/lance-table/src/format/row_ids.rs.md) covers ExternalFile(path:String,offset:u64,size:u64), InlineRowIds and RowIdMeta. These public items are reexported at the format facade, though their defining module is private. ExternalFile describes FRI detail byte ranges; it is not a RowIdMeta variant. RowIdMeta has only Inline(InlineRowIds) and Column. Converting the generated oneof succeeds for both without decoding inline bytes or validating hidden-column presence. (rust/lance-table/src/format.rs:26-29; rust/lance-table/src/format/row_ids.rs:19-25; rust/lance-table/src/format/row_ids.rs:141-166)

InlineRowIds owns an Arc inner containing Bytes plus OnceLock<[u8;32]>. digest() borrows the memoized BLAKE3 digest of encoded bytes; bytes() borrows Bytes, and Deref exposes immutable [u8]. Clone shares memo and Bytes handle, while separately constructed equal contents use separate memos. Equality uses Arc identity or byte comparison, not the digest. Debug/serde show only bytes; Deserialize reconstructs from Vec and a fresh memo. This is encoded-content identity rather than guaranteed collision-free logical-sequence identity. (rust/lance-table/src/format/row_ids.rs:49-126)

Memory sizing deduplicates the inner Arc in a Context, counts inner inline storage (including OnceLock), then delegates to Bytes. Core Bytes charges visible length by start pointer, so a small slice can retain a larger fetched buffer than this estimate reports; Arc counters are not charged by the generic Arc implementation. (rust/lance-table/src/format/row_ids.rs:128-139; rust/lance-core/src/deepsize.rs:90-98; rust/lance-core/src/deepsize.rs:182-189)

[Transaction wrapper L2](../L2-files/rust/lance-table/src/format/transaction.rs.md) exposes format::Transaction with public inner:pb::Transaction, as_pb() and may_change_schema(). The comment's crate-local wording does not match pub facade visibility. Both From directions move the value; neither encodes bytes nor validates contents. This is distinct from the pending transaction-module builder type. (rust/lance-table/src/format.rs:30-30; rust/lance-table/src/format/transaction.rs:4-40; rust/lance-table/src/format/transaction.rs:71-82; rust/lance-table/src/transaction.rs:44-44)

| Classifier input | operation_may_change_schema result |
|---|---|
| UpdateConfig | Either field_metadata_updates or field_metadata nonempty |
| Append, Delete, CreateIndex, Rewrite, DataReplacement | false |
| ReserveFragments, Update, UpdateMemWalState, UpdateBases, DataOverlay | false |
| Every other variant or no recognized operation | true |

The classifier uses no encoded-size or inline-copy check and performs no actual schema/primary-key validation. One field-update entry with an empty UpdateMap is enough to return true; config-only updates are false. (rust/lance-table/src/format/transaction.rs:42-69; rust/lance-table/src/format/transaction.rs:125-145)

Tests assert selected digest/equality/pointer sharing, visible-length accounting, exact JSON Inline bytes and protobuf Fragment roundtrip, plus size-independent Delete classification, Overlay exemption, config/field distinction and Overwrite/None conservatism. They were not run. Actual row-sequence decoding/cache consumers and commit validation/inline selection remain pending. (rust/lance-table/src/format/row_ids.rs:168-244; rust/lance-table/src/format/transaction.rs:84-163)
`);
append('L0-orientation.md',`## Encoded row identity and operation disposition

InlineRowIds keeps byte content and a shared lazy digest memo together so clones reuse both and replacing the wrapper does not carry an old digest into new bytes. Its digest identifies encoded content, not decoded-row equivalence. RowIdMeta chooses inline bytes or hidden-column storage. (rust/lance-table/src/format/row_ids.rs:27-98; rust/lance-table/src/format/row_ids.rs:141-166)

The format-layer Transaction is a public protobuf wrapper; its schema-change classification is a conservative operation disposition used to decide where validation may be needed, not validation itself. It has no commit lifecycle in its local body. (rust/lance-table/src/format/transaction.rs:16-82)
`);
append('L3-symbols/behavior-contracts.md',`## Shared inline row-ID memo and transaction classification

InlineRowIds construction pairs immutable Bytes with empty OnceLock in an Arc. First digest() hashes exactly those bytes; clones share the completed memo, equality short-circuits Arc identity or compares bytes, and serialization ignores memo state. Deserialize creates a fresh memo. Deep-size accounting is deduplicated by Arc/data start pointers and is not a retained-allocation measurement. The source comment's one-allocation phrasing describes shared ownership of handle/memo; the Bytes backing buffer can be separate. (rust/lance-table/src/format/row_ids.rs:49-139; rust/lance-core/src/deepsize.rs:90-98; rust/lance-core/src/deepsize.rs:182-189)

RowIdMeta::try_from always succeeds for the two recognized generated arms, with no raw-byte decode or hidden-file validation. An absent oneof is outside its enum input and requires caller handling. (rust/lance-table/src/format/row_ids.rs:157-166)

format::Transaction classification ignores read_version/UUID/tag/properties and payload size. Only operation variant matters, with the UpdateConfig exception examining two field-metadata containers. Unknown/absent operation is conservative true; the ten explicit data/maintenance variants are false. This boolean does not certify payload validity, conflict freedom or successful commit. (rust/lance-table/src/format/transaction.rs:42-69)
`);
append('L3-symbols/format-spec.md',`## Inline row-ID wrapper wire boundary

The inline digest is runtime-only. Serialization delegates to Bytes, and the source JSON test requires {"Inline":[7,8,9]}; protobuf Fragment roundtrip also preserves metadata in that fixture. The RowIdMeta converter accepts generated InlineRowIds bytes or ColumnRowIds marker without validating encoding or feature flags. The marker references a hidden row-ID column by contract, but actual lookup/decoding remains pending. (rust/lance-table/src/format/row_ids.rs:100-126; rust/lance-table/src/format/row_ids.rs:141-166; rust/lance-table/src/format/row_ids.rs:228-244)

The format Transaction wrapper's From conversion is an ownership move, not protobuf encoding. Inline-vs-external transaction persistence policy cannot be derived from it; classification before size selection is the documented motivation for the standalone helper. (rust/lance-table/src/format/transaction.rs:42-82)
`);
append('L4-crosscutting/scenarios.md',`## Local row-ID metadata and transaction disposition traces

For an already available Bytes slice, construct InlineRowIds by moving the handle into Arc inner with empty memo. Cloning shares inner; first digest computes BLAKE3 and later calls reuse the reference. JSON/serde serialization presents only bytes; deserialization reconstructs a fresh memo. The local Fragment roundtrip test checks metadata preservation through generated protobuf conversion, but the converter implementation and dataset IO remain pending. (rust/lance-table/src/format/row_ids.rs:49-126; rust/lance-table/src/format/row_ids.rs:228-244)

For a protobuf Delete transaction, operation_may_change_schema returns false regardless of a4MiB tag; UpdateConfig returns true as soon as either field-metadata container is nonempty. Wrapping/unwrapping does not change classification or encode bytes. This supports a future commit trace, but does not identify the actual validation call sites, inline threshold, conflicts or atomic storage operations. (rust/lance-table/src/format/transaction.rs:37-108; rust/lance-table/src/format/transaction.rs:125-145)
`);
append('L4-crosscutting/build-and-test.md',`## Table wrapper test evidence

row_ids source tests check content-sensitive hashes, clone pointer sharing, separately allocated equal bytes, Bytes-slice reuse, length-based deep-size accounting and exact JSON/protobuf roundtrip. Transaction wrapper tests check a4MiB-tag Delete remains exempt, Overlay exemption, field-metadata update classification and conservative Overwrite/None. These tests are source evidence only; no Rust test execution or successful compilation is claimed. (rust/lance-table/src/format/row_ids.rs:168-244; rust/lance-table/src/format/transaction.rs:84-163)
`);
append('L4-crosscutting/cookbook.md',`## Reading row-ID and transaction metadata without conflating layers

Use InlineRowIds::bytes()/Deref for immutable encoded bytes and digest() for the shared encoded-content hash. Do not equate a fragment ID alone with one row sequence, and do not interpret a digest as canonical decoded-row equality. Use RowIdMeta to distinguish Inline versus Column; file selection and decoding require the still-pending Fragment/rowids implementation. (rust/lance-table/src/format/row_ids.rs:27-98; rust/lance-table/src/format/row_ids.rs:141-166)

For format::Transaction, operation_may_change_schema can classify the protobuf before wrapping or sizing. Its false result is an exemption category, not proof that a commit is valid. The direct From conversions only move the protobuf payload. (rust/lance-table/src/format/transaction.rs:30-82)
`);
append('L4-crosscutting/pitfalls.md',`## Wrapper interpretation pitfalls

- The row-ID memo shares an Arc with the Bytes handle, while payload backing storage may be a retained slice of a larger buffer. The visible-length deep-size estimate cannot establish retained heap bytes. (rust/lance-table/src/format/row_ids.rs:49-59; rust/lance-table/src/format/row_ids.rs:128-139; rust/lance-core/src/deepsize.rs:90-98)
- TryFrom<RowIdSequence> does not validate its bytes/column reference; its Result type does not imply an implemented error branch. (rust/lance-table/src/format/row_ids.rs:157-166)
- format::Transaction is publicly reexported despite crate-local doc wording, and From conversion does not serialize despite the write-boundary comment. (rust/lance-table/src/format.rs:30-30; rust/lance-table/src/format/transaction.rs:4-22; rust/lance-table/src/format/transaction.rs:71-82)
`);
let state=JSON.parse(read('iteration-state.json'));state.totals=JSON.parse(read('MANIFEST.json')).totals;state.next='VERIFY20 then continue format/fragment and format/manifest implementations.';write('iteration-state.json',JSON.stringify(state,null,2));console.log({added_layers:'row_ids and transaction wrappers'});
