> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-table/src/format/row_ids.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `d9e0e1e5b6c1ae69866f09fcdb8e243d88353fd9ab218b182db5f87ed0bff261`. Reviewed physical lines: 1-244.

[Module](../../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Row-ID location metadata, immutable shared inline bytes with lazy digest, and file-range descriptor. Public items are reexported by format although row_ids is a private child module. (rust/lance-table/src/format/row_ids.rs:1-244)

## Complete range analysis

### Lines 1-18

SPDX plus Deref, Arc/OnceLock, Bytes, core DeepSizeOf/Error/Result, serde traits and generated pb imports. Reexports the three canonical core lineage field-ID constants rather than redefining their values. (rust/lance-table/src/format/row_ids.rs:1-18)

### Lines 19-26

Public ExternalFile has path:String, offset:u64 and size:u64 with Debug/Clone/PartialEq/Eq/Serialize/Deserialize/DeepSizeOf derives. Docs assign it to fragment-reuse index details. It is a descriptor only: construction here does not validate paths/ranges/overflow or perform IO, and RowIdMeta has no External variant. (rust/lance-table/src/format/row_ids.rs:19-26)

### Lines 27-59

Public Clone InlineRowIds privately holds Arc<InlineRowIdsInner>; inner stores Bytes and OnceLock<[u8;32]>. Comments motivate content identity because fragment IDs can be reused and scans clone fragments. The Arc shares the Bytes handle and digest memo; actual byte backing can be a separately retained fetched-buffer slice, not necessarily bytes embedded in the same Arc allocation. Statements about count_from_mask and scan frequency are caller rationale, pending consumer inspection. (rust/lance-table/src/format/row_ids.rs:27-59)

### Lines 60-74

digest returns a reference to32-byte BLAKE3 hash of the exact encoded byte sequence, initialized lazily by shared OnceLock; cloned wrappers share initialization/result. bytes returns &Bytes without mutation. This identifies encoded content, not a canonical decoded sequence; equal logical rows with different encodings may hash differently, and finite hashes are not a mathematical uniqueness guarantee. Hash work scales with encoded length on first use and is reused thereafter. (rust/lance-table/src/format/row_ids.rs:60-74)

### Lines 75-91

From<Bytes> allocates a new Arc inner with moved Bytes and empty OnceLock, without an explicit payload copy. From<Vec<u8>> first delegates to Bytes::from then the same constructor. Separate constructions get separate memos even when bytes are equal; payload-allocation details of Bytes are external dependency behavior. (rust/lance-table/src/format/row_ids.rs:75-91)

### Lines 92-115

Deref exposes immutable [u8]. Debug delegates to Bytes formatting. PartialEq first accepts shared-Arc pointer identity, otherwise compares byte contents; Eq is marker implementation. Digest is neither inspected nor initialized by equality/Debug. No DerefMut or direct mutable byte access is exposed. (rust/lance-table/src/format/row_ids.rs:92-115)

### Lines 116-127

Serialize delegates to Bytes only; Deserialize obtains Vec<u8> from the deserializer and maps through constructor, producing a fresh empty digest memo. Memo state does not enter serialized data. The generic serde format is chosen by the caller; JSON representation is pinned by the local test. (rust/lance-table/src/format/row_ids.rs:116-127)

### Lines 128-140

Wrapper DeepSizeOf delegates to Arc for identity deduplication; inner delegates heap children only to Bytes. Core Arc adds size_of inner once per Context and excludes Arc counters, while Bytes charges visible length once per starting pointer, not the retained backing-buffer allocation; OnceLock inline storage is included via inner size. This is an estimate, not retained RSS. Supporting implementations: rust/lance-core/src/deepsize.rs:90-98; rust/lance-core/src/deepsize.rs:182-189. (rust/lance-table/src/format/row_ids.rs:128-140)

### Lines 141-156

Public RowIdMeta derives Debug/Clone/PartialEq/Eq/Serialize/Deserialize/DeepSizeOf and has Inline(InlineRowIds) or Column. Column docs specify hidden ROW_ID_FIELD_ID in a fragment data-file entry, one ID per physical row in offset order, enabling page-level reads. Base-file carrier lookup and metadata-only validation are now covered at rust/lance-table/src/format/fragment.rs:649-725; actual column decoding remains pending. (rust/lance-table/src/format/row_ids.rs:141-156)

### Lines 157-167

TryFrom generated RowIdSequence returns Result but both known arms succeed: InlineRowIds(data) wraps raw encoded bytes, ColumnRowIds payload is ignored and becomes Column. It does not decode sequences, validate column presence or test feature flags. An absent protobuf oneof cannot be represented by this input enum; handling None belongs to its caller. (rust/lance-table/src/format/row_ids.rs:157-167)

### Lines 168-190

cfg(test) imports super and Fragment. Digest fixture compares equal bytes from separate wrappers, changed final byte, byte equality and repeated digest contents. Assertions show selected examples, not collision freedom or initialization count. (rust/lance-table/src/format/row_ids.rs:168-190)

### Lines 191-215

Clone-sharing fixture checks identical byte and digest pointers for clones; separately constructed equal bytes have distinct byte pointers. A fresh clone initializes a memo then original returns equal digest contents. No concurrent stress or counted hash invocation is performed. (rust/lance-table/src/format/row_ids.rs:191-215)

### Lines 216-227

Bytes-sharing fixture slices16..48 from64-byte buffer, wraps a clone, asserts contents and same start pointer. A second8-byte slice differs in deep_size_of by24; this pins length-based accounting, not total retained backing capacity. (rust/lance-table/src/format/row_ids.rs:216-227)

### Lines 228-244

Serialization fixture requires exact JSON {"Inline":[7,8,9]}, roundtrips through serde, then embeds metadata into Fragment and roundtrips via protobuf conversion. Digest is absent from output. Fragment conversion is covered at rust/lance-table/src/format/fragment.rs:831-909; this test reads/writes no disk file or historical fixture. Tests were read, not executed. (rust/lance-table/src/format/row_ids.rs:228-244)

## Interaction and interpretation limits

Facade visibility is established by rust/lance-table/src/format.rs:26-29. Build Bytes configuration is at rust/lance-table/build.rs:19-21; actual fetched-buffer decoder and content-key consumers remain pending. The active Column metadata is separate from the legacy-frozen behavior boundary; no source was changed.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::ops::Deref;
    5 | use std::sync::{Arc, OnceLock};
    6 | 
    7 | use bytes::Bytes;
    8 | 
    9 | use lance_core::deepsize::{Context, DeepSizeOf};
   10 | use lance_core::{Error, Result};
   11 | use serde::{Deserialize, Deserializer, Serialize, Serializer};
   12 | 
   13 | use super::pb;
   14 | 
   15 | pub use lance_core::{
   16 |     ROW_CREATED_AT_VERSION_FIELD_ID, ROW_ID_FIELD_ID, ROW_LAST_UPDATED_AT_VERSION_FIELD_ID,
   17 | };
   18 | 
   19 | /// A reference to a part of a file, used by the fragment reuse index details.
   20 | #[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, DeepSizeOf)]
   21 | pub struct ExternalFile {
   22 |     pub path: String,
   23 |     pub offset: u64,
   24 |     pub size: u64,
   25 | }
   26 | 
   27 | /// A fragment's row id sequence, encoded inline in the manifest.
   28 | ///
   29 | /// Carries a memoized [`digest`](Self::digest) of the encoded bytes. The digest
   30 | /// identifies *which* sequence these bytes are, which is what the row id
   31 | /// sequence cache keys on: a fragment id alone does not identify a sequence,
   32 | /// because fragment ids are reused across dataset generations.
   33 | ///
   34 | /// The digest is memoized because computing it is proportional to the encoded
   35 | /// size. A run-encoded sequence is a handful of bytes per run, but a heavily
   36 | /// fragmented one is array-encoded at 8 bytes per row, and the cache is
   37 | /// consulted on every scan, count, prefilter and index load.
   38 | ///
   39 | /// Bytes and memo share one immutable allocation, so cloning shares both. That
   40 | /// is what makes the memo worth having: callers clone `Fragment` before loading
   41 | /// its sequence (see `count_from_mask`), and a memo held per clone would be
   42 | /// filled and dropped by each scan, rehashing the whole sequence every time.
   43 | /// Sharing also keeps a cloned fragment from duplicating the encoded bytes.
   44 | ///
   45 | /// The digest lives *with* the bytes rather than beside them so the two cannot
   46 | /// drift: several write paths replace a fragment's `row_id_meta` after the
   47 | /// fragment is built, and a digest that outlived its bytes would silently
   48 | /// resolve to another generation's sequence.
   49 | #[derive(Clone)]
   50 | pub struct InlineRowIds {
   51 |     inner: Arc<InlineRowIdsInner>,
   52 | }
   53 | 
   54 | struct InlineRowIdsInner {
   55 |     /// `Bytes` rather than `Vec<u8>`: when the manifest is decoded from the
   56 |     /// fetched buffer this is a slice of that buffer, not a copy of it.
   57 |     data: Bytes,
   58 |     digest: OnceLock<[u8; 32]>,
   59 | }
   60 | 
   61 | impl InlineRowIds {
   62 |     /// Digest of the encoded bytes, computed on first use and shared by clones.
   63 |     pub fn digest(&self) -> &[u8; 32] {
   64 |         self.inner
   65 |             .digest
   66 |             .get_or_init(|| blake3::hash(&self.inner.data).into())
   67 |     }
   68 | 
   69 |     /// The encoded bytes, sharing the underlying allocation.
   70 |     pub fn bytes(&self) -> &Bytes {
   71 |         &self.inner.data
   72 |     }
   73 | }
   74 | 
   75 | impl From<Bytes> for InlineRowIds {
   76 |     fn from(data: Bytes) -> Self {
   77 |         Self {
   78 |             inner: Arc::new(InlineRowIdsInner {
   79 |                 data,
   80 |                 digest: OnceLock::new(),
   81 |             }),
   82 |         }
   83 |     }
   84 | }
   85 | 
   86 | impl From<Vec<u8>> for InlineRowIds {
   87 |     fn from(data: Vec<u8>) -> Self {
   88 |         Self::from(Bytes::from(data))
   89 |     }
   90 | }
   91 | 
   92 | impl Deref for InlineRowIds {
   93 |     type Target = [u8];
   94 | 
   95 |     fn deref(&self) -> &Self::Target {
   96 |         &self.inner.data
   97 |     }
   98 | }
   99 | 
  100 | // Debug, equality and serialization all present the bytes alone: the memo is a
  101 | // derived value and must not show up in output, comparisons or the manifest.
  102 | impl std::fmt::Debug for InlineRowIds {
  103 |     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
  104 |         self.inner.data.fmt(f)
  105 |     }
  106 | }
  107 | 
  108 | impl PartialEq for InlineRowIds {
  109 |     fn eq(&self, other: &Self) -> bool {
  110 |         Arc::ptr_eq(&self.inner, &other.inner) || self.inner.data == other.inner.data
  111 |     }
  112 | }
  113 | 
  114 | impl Eq for InlineRowIds {}
  115 | 
  116 | impl Serialize for InlineRowIds {
  117 |     fn serialize<S: Serializer>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error> {
  118 |         self.inner.data.serialize(serializer)
  119 |     }
  120 | }
  121 | 
  122 | impl<'de> Deserialize<'de> for InlineRowIds {
  123 |     fn deserialize<D: Deserializer<'de>>(deserializer: D) -> std::result::Result<Self, D::Error> {
  124 |         Vec::<u8>::deserialize(deserializer).map(Self::from)
  125 |     }
  126 | }
  127 | 
  128 | impl DeepSizeOf for InlineRowIds {
  129 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  130 |         // Delegate to the `Arc` so clones sharing one allocation are counted once.
  131 |         self.inner.deep_size_of_children(context)
  132 |     }
  133 | }
  134 | 
  135 | impl DeepSizeOf for InlineRowIdsInner {
  136 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  137 |         self.data.deep_size_of_children(context)
  138 |     }
  139 | }
  140 | 
  141 | /// Metadata about location of the row id sequence.
  142 | #[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, DeepSizeOf)]
  143 | pub enum RowIdMeta {
  144 |     Inline(InlineRowIds),
  145 |     /// The sequence is spilled to a hidden [`ROW_ID_FIELD_ID`] column of one of
  146 |     /// the fragment's data files, one row id per physical row, in offset order.
  147 |     /// The file is the entry of [`Fragment::files`](super::Fragment::files)
  148 |     /// whose fields carry that id; see
  149 |     /// [`Fragment::row_lineage_file`](super::Fragment::row_lineage_file).
  150 |     ///
  151 |     /// An ordinary column rather than an opaque byte range: it carries the
  152 |     /// file's encodings and page layout, so it can be read back a page at a
  153 |     /// time instead of whole.
  154 |     Column,
  155 | }
  156 | 
  157 | impl TryFrom<pb::data_fragment::RowIdSequence> for RowIdMeta {
  158 |     type Error = Error;
  159 | 
  160 |     fn try_from(value: pb::data_fragment::RowIdSequence) -> Result<Self> {
  161 |         match value {
  162 |             pb::data_fragment::RowIdSequence::InlineRowIds(data) => Ok(Self::Inline(data.into())),
  163 |             pb::data_fragment::RowIdSequence::ColumnRowIds(_) => Ok(Self::Column),
  164 |         }
  165 |     }
  166 | }
  167 | 
  168 | #[cfg(test)]
  169 | mod tests {
  170 |     use super::*;
  171 |     use crate::format::Fragment;
  172 | 
  173 |     #[test]
  174 |     fn inline_row_ids_digest_identifies_contents() {
  175 |         let first = InlineRowIds::from(vec![1, 2, 3]);
  176 |         let same = InlineRowIds::from(vec![1, 2, 3]);
  177 |         let other = InlineRowIds::from(vec![1, 2, 4]);
  178 | 
  179 |         // The digest is what the row id sequence cache keys on, so it must
  180 |         // follow the bytes exactly: same bytes, same key; any change, new key.
  181 |         assert_eq!(first.digest(), same.digest());
  182 |         assert_ne!(first.digest(), other.digest());
  183 |         assert_eq!(first, same);
  184 |         assert_ne!(first, other);
  185 | 
  186 |         // Memoized on first use, so repeat use must return the same digest.
  187 |         let memoized = *first.digest();
  188 |         assert_eq!(first.digest(), &memoized);
  189 |     }
  190 | 
  191 |     #[test]
  192 |     fn inline_row_ids_clones_share_bytes_and_memo() {
  193 |         let first = InlineRowIds::from(vec![1, 2, 3]);
  194 |         let cloned = first.clone();
  195 | 
  196 |         // Callers clone `Fragment` before loading its row id sequence, so a memo
  197 |         // held per clone would be filled and dropped by each scan and rehash the
  198 |         // whole sequence every time. Sharing one allocation is what makes the
  199 |         // memo pay off, and it keeps clones from duplicating the bytes.
  200 |         assert!(std::ptr::eq(first.as_ptr(), cloned.as_ptr()));
  201 |         assert!(std::ptr::eq(first.digest(), cloned.digest()));
  202 | 
  203 |         // Guard against the assertions above passing vacuously: only clones
  204 |         // share storage, equal bytes built separately do not.
  205 |         let separate = InlineRowIds::from(vec![1, 2, 3]);
  206 |         assert_eq!(first, separate);
  207 |         assert!(!std::ptr::eq(first.as_ptr(), separate.as_ptr()));
  208 | 
  209 |         // Computing through one clone must be visible from the other.
  210 |         let fresh = InlineRowIds::from(vec![4, 5, 6]);
  211 |         let fresh_clone = fresh.clone();
  212 |         let via_clone = *fresh_clone.digest();
  213 |         assert_eq!(fresh.digest(), &via_clone);
  214 |     }
  215 | 
  216 |     #[test]
  217 |     fn inline_row_ids_from_bytes_shares_the_allocation() {
  218 |         let buffer = Bytes::from((0..64u8).collect::<Vec<u8>>());
  219 |         let slice = buffer.slice(16..48);
  220 |         let inline = InlineRowIds::from(slice.clone());
  221 |         assert_eq!(&*inline, &buffer[16..48]);
  222 |         assert_eq!(inline.bytes().as_ptr(), slice.as_ptr());
  223 |         // The bytes are charged by length, whatever buffer they slice.
  224 |         let shorter = InlineRowIds::from(buffer.slice(0..8));
  225 |         assert_eq!(inline.deep_size_of() - shorter.deep_size_of(), 32 - 8);
  226 |     }
  227 | 
  228 |     #[test]
  229 |     fn inline_row_ids_serializes_as_bare_bytes() {
  230 |         // The manifest is a stable format: the memo must not reach the wire.
  231 |         let meta = RowIdMeta::Inline(InlineRowIds::from(vec![7, 8, 9]));
  232 |         let json = serde_json::to_string(&meta).unwrap();
  233 |         assert_eq!(json, r#"{"Inline":[7,8,9]}"#);
  234 |         assert_eq!(serde_json::from_str::<RowIdMeta>(&json).unwrap(), meta);
  235 | 
  236 |         // ...and round-trips through protobuf unchanged.
  237 |         let fragment = Fragment {
  238 |             row_id_meta: Some(meta.clone()),
  239 |             ..Fragment::new(0)
  240 |         };
  241 |         let restored = Fragment::try_from(pb::DataFragment::from(&fragment)).unwrap();
  242 |         assert_eq!(restored.row_id_meta, Some(meta));
  243 |     }
  244 | }
``````
