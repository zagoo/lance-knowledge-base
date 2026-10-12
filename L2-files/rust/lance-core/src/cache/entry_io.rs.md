> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-core/src/cache/entry_io.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `797b60dc9fc3851c5926ebb6872493a373efb6ddcf439945227de200cb997edb`. Reviewed physical lines: 1-392.

[Module](../../../../../L1-modules/rust-lance-core-cache.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Streaming body writer and cursor-based cache reader with protobuf header framing, discriminant bytes, raw blobs and delegated aligned Arrow IPC sections. (rust/lance-core/src/cache/entry_io.rs:1-392)

## Complete range analysis

### Lines 1-27

SPDX/docs describe streaming without full-entry buffering and section borrowing from Bytes, with64-byte absolute IPC alignment. Body grammar is LEu32-length protobuf HEADER, aligned self-delimiting ARROW_IPC, and LEu64-length RAW_BLOB. Imports Write,RecordBatch,Bytes,prost Message and core Error/Result. Actual IPC byte machinery resides in lance_arrow, not this file. (rust/lance-core/src/cache/entry_io.rs:1-27)

### Lines 28-54

Public CacheEntryWriter stores private mutable dyn Write reference and absolute usize pos. Public new starts0 for standalone/nested buffers; crate-visible with_pos trusts caller-supplied preceding-byte count (normally envelope). Neither inspects actual writer length or seeks. Incorrect supplied pos can misalign subsequent IPC. (rust/lance-core/src/cache/entry_io.rs:28-54)

### Lines 55-61

write_u8 uses write_all of exactly one untagged byte, advances pos by1 only after success and returns Ok. This is a body discriminant, not the typed tag+payload key encoding. Position increment is unchecked usize arithmetic. (rust/lance-core/src/cache/entry_io.rs:55-61)

### Lines 62-72

write_header<P:Message> encodes entire header into a Vec, then checks length fitsu32; excessive size yields IO-category error after allocation. Writes LEu32 length then full encoded payload, advancing pos by4+len only after both succeed. Thus it buffers each header though not the entire entry; partial IO errors may leave bytes written with old pos. No rollback or flush occurs. (rust/lance-core/src/cache/entry_io.rs:62-72)

### Lines 73-88

write_ipc delegates one RecordBatch plus &mut pos to lance_arrow::ipc::write_ipc_section, converting external error to Error::io(display). write_ipc_batches accepts IntoIterator<Item=RecordBatch>, delegates analogous multi-batch helper, with docs requiring at least one batch. Empty-iterator enforcement, IPC framing and allocation behavior remain dependency analysis tasks. (rust/lance-core/src/cache/entry_io.rs:73-88)

### Lines 89-99

write_raw delegates a borrowed byte slice to write_len_prefixed_bytes and, only on success, advances pos by8+payload length. Docs require payload's own stable portable encoding; no validation of that requirement occurs. Error is stringified into IO category, losing typed original source at this wrapper boundary. (rust/lance-core/src/cache/entry_io.rs:89-99)

### Lines 100-116

raw_writer exposes mutable underlying writer for already self-delimiting or whole-body formats. It does not track any bytes written through it; documented restriction forbids interleaving those writes with write_ipc alignment. Nothing in the type system enforces this or resynchronizes pos. It can avoid buffering a whole raw body just to measure length. (rust/lance-core/src/cache/entry_io.rs:100-116)

### Lines 117-138

Public CacheEntryReader owns borrowed Bytes reference,usize offset,u32 version. new accepts all values without offset<=len validation and stores them; it neither copies body bytes nor parses envelope. Zero-copy documentation applies to returned Bytes/buffer backing, not absence of all metadata/object allocations. Public body() later can panic for invalid offset. (rust/lance-core/src/cache/entry_io.rs:117-138)

### Lines 139-153

version returns stored body-version number with no validation. read_u8 safely get's current index or IO missing-tag error, advancing offset by1 only on success. EOF/error leaves cursor unchanged; caller-created out-of-range offset also errors without indexing panic on this path. (rust/lance-core/src/cache/entry_io.rs:139-153)

### Lines 154-172

read_header<P:Message+Default> checks offset+4 with checked_add and upper bound, interprets exact4 LE bytes, checks len_end+declared_length and bound, then prost-decodes that exact slice. Truncated prefix/body and malformed protobuf yield distinct IO messages. Slice-to-array unwrap is justified by successful4-byte range check. Offset advances only after successful decode; no explicit size cap below available input is imposed and P may allocate owned fields. (rust/lance-core/src/cache/entry_io.rs:154-172)

### Lines 173-191

read_ipc/read_ipc_batches/read_raw delegate whole data plus mutable offset to lance_arrow helpers and stringify errors into Error::io. Multi-batch API returns Vec<RecordBatch>, collecting decoded batch handles by its signature. Cursor state after delegated error and buffer alignment/zero-copy guarantees cannot be proved by these forwarding bodies alone. (rust/lance-core/src/cache/entry_io.rs:173-191)

### Lines 192-203

body returns data.slice(offset..) as a cheap shared Bytes view without advancing cursor. Valid offset at end yields empty; arbitrary out-of-range offset allowed by new can make slice panic. Repeated calls expose same remaining range; no EOF assertion or consumption method is added. (rust/lance-core/src/cache/entry_io.rs:192-203)

### Lines 204-229

cfg(test) imports parent,Arc,Int32Array/UInt64Array,Arrow schema and IPC_SECTION_ALIGNMENT. write_body uses Vec plus with_pos; it changes logical starting position only, not preprending actual prefix bytes. int_batch builds one nonnull Int32 column i and unwraps RecordBatch validity. (rust/lance-core/src/cache/entry_io.rs:204-229)

### Lines 230-246

Byte roundtrip writes7,255, compares exact2 bytes, reads both and asserts third read diagnostic contains missing tag byte. It exercises EOF rather than usize-max offset or mutation on error. (rust/lance-core/src/cache/entry_io.rs:230-246)

### Lines 247-265

Header roundtrip uses prost's u64 message implementation for1234 (comment calls it UInt64Value), compares LEu32 prefix with encoded_len, checks total4+encoded length, decodes same number and requires empty remaining body. Dependency protobuf encoding bytes are not independently specified by this test. (rust/lance-core/src/cache/entry_io.rs:247-265)

### Lines 266-289

Header rejection tests use only2 prefix bytes and declared payload16 with3 actual bytes, asserting truncated length prefix/body text respectively. They do not assert error variant or cursor preservation. (rust/lance-core/src/cache/entry_io.rs:266-289)

### Lines 290-306

Malformed protobuf fixture uses field1 varint tag08 followed by three FF continuation bytes with correct outer length; read_header<u64> must return text containing decode failed. This checks one invalid varint, not all protobuf malformations or resource limits. (rust/lance-core/src/cache/entry_io.rs:290-306)

### Lines 307-326

Raw fixture writes length-prefixed[1,2,3] followed by untracked raw_writer[9,9], asserts total13 bytes, reads raw and sees2 remaining bytes. Reader version test directly supplies7 and expects7. Neither validates codec version gating or interleaved IPC after untracked writes. (rust/lance-core/src/cache/entry_io.rs:307-326)

### Lines 327-355

Alignment test actually prepends13 AA envelope-model bytes, starts pos13, writes header1234 then Int32 batch[1,2,3]. Computes expected next multiple of imported IPC alignment, requires nonempty all-zero padding, decodes header/batch from offset13 and requires EOF. This is a source assertion of absolute-entry alignment, not a direct full-byte IPC specification or executed test. (rust/lance-core/src/cache/entry_io.rs:327-355)

### Lines 356-364

Multi-batch roundtrip writes two Int32 batches[1,2] and[3] as one section, then compares decoded Vec exactly. Empty iterator, differing schemas, malformed IPC, input buffer address alignment and explicit allocation counts are not covered. (rust/lance-core/src/cache/entry_io.rs:356-364)

### Lines 365-392

Mixed-section test creates nonnull UInt64 column u=[MAX,0], emits discriminant2,header99,IPC batch,raw[7,7,7], then consumes in same order and requires empty body. It proves intended local sequencing through assertions in source only. There are no failing-writer, huge-header, invalid-constructor-offset or zero-copy pointer-identity tests in this module. (rust/lance-core/src/cache/entry_io.rs:365-392)

## Interaction and interpretation limits

Local header/tag/cursor mechanics are fully established. Arrow IPC alignment, self-delimitation, malformed-input behavior and zero-copy details delegate to lance_arrow::ipc, which remains pending. The module's all reads zero-copy prose cannot mean no allocations: protobuf decode produces owned messages and read_ipc_batches returns an owned vector. No runtime tests executed. (rust/lance-core/src/cache/entry_io.rs:4-18; rust/lance-core/src/cache/entry_io.rs:117-202)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Streaming readers/writers for cache entry bodies.
    5 | //!
    6 | //! [`CacheCodecImpl`](super::CacheCodecImpl) bodies are written and read
    7 | //! through these wrappers. They keep serialization streaming (no buffering of
    8 | //! the whole entry) and reads zero-copy (sections borrow from the input
    9 | //! [`Bytes`]), while tracking the byte position needed to keep Arrow IPC
   10 | //! sections 64-byte aligned (see [`lance_arrow::ipc`]).
   11 | //!
   12 | //! Body layout primitives:
   13 | //!
   14 | //! ```text
   15 | //! HEADER    : [header_len: u32 LE][header proto bytes]
   16 | //! ARROW_IPC : [pad to 64B][self-delimiting IPC stream]
   17 | //! RAW_BLOB  : [len: u64 LE][bytes]
   18 | //! ```
   19 | 
   20 | use std::io::Write;
   21 | 
   22 | use arrow_array::RecordBatch;
   23 | use bytes::Bytes;
   24 | use prost::Message;
   25 | 
   26 | use crate::{Error, Result};
   27 | 
   28 | /// Writes a cache entry body: a header followed by sections, streaming
   29 | /// directly to the underlying writer.
   30 | ///
   31 | /// The envelope is written by the [`CacheCodec`](super::CacheCodec) wrapper
   32 | /// before this writer is handed to
   33 | /// [`CacheCodecImpl::serialize`](super::CacheCodecImpl::serialize).
   34 | pub struct CacheEntryWriter<'a> {
   35 |     writer: &'a mut dyn Write,
   36 |     /// Absolute byte offset within the entry, used to align IPC sections.
   37 |     pos: usize,
   38 | }
   39 | 
   40 | impl<'a> CacheEntryWriter<'a> {
   41 |     /// Create a writer positioned at the start of an entry (offset 0).
   42 |     ///
   43 |     /// Use this for nested serialization into a standalone buffer. The
   44 |     /// envelope-aware entry point is [`CacheCodec::serialize`](super::CacheCodec::serialize).
   45 |     pub fn new(writer: &'a mut dyn Write) -> Self {
   46 |         Self { writer, pos: 0 }
   47 |     }
   48 | 
   49 |     /// Create a writer whose section alignment accounts for `pos` bytes
   50 |     /// already written ahead of the body (i.e. the envelope).
   51 |     pub(crate) fn with_pos(writer: &'a mut dyn Write, pos: usize) -> Self {
   52 |         Self { writer, pos }
   53 |     }
   54 | 
   55 |     /// Write a single discriminant byte (e.g. a variant tag).
   56 |     pub fn write_u8(&mut self, value: u8) -> Result<()> {
   57 |         self.writer.write_all(&[value])?;
   58 |         self.pos += 1;
   59 |         Ok(())
   60 |     }
   61 | 
   62 |     /// Write a protobuf header as `[len: u32 LE][bytes]`.
   63 |     pub fn write_header<P: Message>(&mut self, header: &P) -> Result<()> {
   64 |         let bytes = header.encode_to_vec();
   65 |         let len = u32::try_from(bytes.len())
   66 |             .map_err(|_| Error::io(format!("cache header too large: {} bytes", bytes.len())))?;
   67 |         self.writer.write_all(&len.to_le_bytes())?;
   68 |         self.writer.write_all(&bytes)?;
   69 |         self.pos += 4 + bytes.len();
   70 |         Ok(())
   71 |     }
   72 | 
   73 |     /// Write `batch` as a 64-byte-aligned Arrow IPC section.
   74 |     pub fn write_ipc(&mut self, batch: &RecordBatch) -> Result<()> {
   75 |         lance_arrow::ipc::write_ipc_section(self.writer, &mut self.pos, batch)
   76 |             .map_err(|e| Error::io(e.to_string()))
   77 |     }
   78 | 
   79 |     /// Write `batches` as a single 64-byte-aligned multi-batch Arrow IPC
   80 |     /// section. The iterator must yield at least one batch.
   81 |     pub fn write_ipc_batches<I>(&mut self, batches: I) -> Result<()>
   82 |     where
   83 |         I: IntoIterator<Item = RecordBatch>,
   84 |     {
   85 |         lance_arrow::ipc::write_ipc_section_batches(self.writer, &mut self.pos, batches)
   86 |             .map_err(|e| Error::io(e.to_string()))
   87 |     }
   88 | 
   89 |     /// Write a raw blob as `[len: u64 LE][bytes]`.
   90 |     ///
   91 |     /// Only for byte payloads that already have their own stable, portable
   92 |     /// encoding (e.g. a roaring bitmap, a varint-packed stream).
   93 |     pub fn write_raw(&mut self, bytes: &[u8]) -> Result<()> {
   94 |         lance_arrow::ipc::write_len_prefixed_bytes(self.writer, bytes)
   95 |             .map_err(|e| Error::io(e.to_string()))?;
   96 |         self.pos += 8 + bytes.len();
   97 |         Ok(())
   98 |     }
   99 | 
  100 |     /// The underlying writer, for a payload that carries its own framing.
  101 |     ///
  102 |     /// Use this only when the codec writes a self-delimiting or whole-body
  103 |     /// payload — e.g. streaming a roaring bitmap as the entire body, where the
  104 |     /// length prefix of [`write_raw`](Self::write_raw) would be redundant and
  105 |     /// buffering to measure that length would force an extra copy. For
  106 |     /// structured bodies prefer [`write_header`](Self::write_header) /
  107 |     /// [`write_ipc`](Self::write_ipc) / [`write_raw`](Self::write_raw), which
  108 |     /// give you versioning and 64-byte IPC alignment.
  109 |     ///
  110 |     /// Bytes written through this do **not** advance the section-alignment
  111 |     /// position, so it must not be interleaved with [`write_ipc`](Self::write_ipc).
  112 |     pub fn raw_writer(&mut self) -> &mut dyn Write {
  113 |         self.writer
  114 |     }
  115 | }
  116 | 
  117 | /// Reads a cache entry body, tracking an offset into the input and exposing
  118 | /// the entry's `type_version` so implementors can branch for backward compat.
  119 | ///
  120 | /// All reads are zero-copy: returned [`Bytes`] and the buffers behind decoded
  121 | /// [`RecordBatch`]es borrow from the input allocation.
  122 | pub struct CacheEntryReader<'a> {
  123 |     data: &'a Bytes,
  124 |     offset: usize,
  125 |     version: u32,
  126 | }
  127 | 
  128 | impl<'a> CacheEntryReader<'a> {
  129 |     /// Create a reader over `data`, starting at body byte `offset`, for an
  130 |     /// entry written at `version`.
  131 |     pub fn new(data: &'a Bytes, offset: usize, version: u32) -> Self {
  132 |         Self {
  133 |             data,
  134 |             offset,
  135 |             version,
  136 |         }
  137 |     }
  138 | 
  139 |     /// The `type_version` from the envelope. Branch on this for backward compat.
  140 |     pub fn version(&self) -> u32 {
  141 |         self.version
  142 |     }
  143 | 
  144 |     /// Read a single discriminant byte written by [`CacheEntryWriter::write_u8`].
  145 |     pub fn read_u8(&mut self) -> Result<u8> {
  146 |         let bytes = self.data.as_ref();
  147 |         let v = *bytes
  148 |             .get(self.offset)
  149 |             .ok_or_else(|| Error::io("cache entry: truncated, missing tag byte".to_string()))?;
  150 |         self.offset += 1;
  151 |         Ok(v)
  152 |     }
  153 | 
  154 |     /// Read a protobuf header written by [`CacheEntryWriter::write_header`].
  155 |     pub fn read_header<P: Message + Default>(&mut self) -> Result<P> {
  156 |         let bytes = self.data.as_ref();
  157 |         let len_end = self
  158 |             .offset
  159 |             .checked_add(4)
  160 |             .filter(|&e| e <= bytes.len())
  161 |             .ok_or_else(|| Error::io("cache header: truncated length prefix".to_string()))?;
  162 |         let len = u32::from_le_bytes(bytes[self.offset..len_end].try_into().unwrap()) as usize;
  163 |         let data_end = len_end
  164 |             .checked_add(len)
  165 |             .filter(|&e| e <= bytes.len())
  166 |             .ok_or_else(|| Error::io("cache header: truncated body".to_string()))?;
  167 |         let msg = P::decode(&bytes[len_end..data_end])
  168 |             .map_err(|e| Error::io(format!("cache header decode failed: {e}")))?;
  169 |         self.offset = data_end;
  170 |         Ok(msg)
  171 |     }
  172 | 
  173 |     /// Read one [`RecordBatch`] from a 64-byte-aligned IPC section.
  174 |     pub fn read_ipc(&mut self) -> Result<RecordBatch> {
  175 |         lance_arrow::ipc::read_ipc_section_at(self.data, &mut self.offset)
  176 |             .map_err(|e| Error::io(e.to_string()))
  177 |     }
  178 | 
  179 |     /// Read all [`RecordBatch`]es from a 64-byte-aligned multi-batch IPC
  180 |     /// section written by [`CacheEntryWriter::write_ipc_batches`].
  181 |     pub fn read_ipc_batches(&mut self) -> Result<Vec<RecordBatch>> {
  182 |         lance_arrow::ipc::read_ipc_section_batches_at(self.data, &mut self.offset)
  183 |             .map_err(|e| Error::io(e.to_string()))
  184 |     }
  185 | 
  186 |     /// Read a raw blob written by [`CacheEntryWriter::write_raw`], zero-copy.
  187 |     pub fn read_raw(&mut self) -> Result<Bytes> {
  188 |         lance_arrow::ipc::read_len_prefixed_bytes_at(self.data, &mut self.offset)
  189 |             .map_err(|e| Error::io(e.to_string()))
  190 |     }
  191 | 
  192 |     /// The not-yet-consumed body bytes as a zero-copy slice.
  193 |     ///
  194 |     /// For a payload that carries its own framing and is parsed with the
  195 |     /// codec's own cursor — the read counterpart of
  196 |     /// [`CacheEntryWriter::raw_writer`]. For structured bodies prefer
  197 |     /// [`read_header`](Self::read_header) / [`read_ipc`](Self::read_ipc) /
  198 |     /// [`read_raw`](Self::read_raw).
  199 |     pub fn body(&self) -> Bytes {
  200 |         self.data.slice(self.offset..)
  201 |     }
  202 | }
  203 | 
  204 | #[cfg(test)]
  205 | mod tests {
  206 |     use super::*;
  207 | 
  208 |     use std::sync::Arc;
  209 | 
  210 |     use arrow_array::{Int32Array, UInt64Array};
  211 |     use arrow_schema::{DataType, Field, Schema};
  212 |     use lance_arrow::ipc::IPC_SECTION_ALIGNMENT;
  213 | 
  214 |     /// Write a body starting at entry offset `pos` and return the bytes.
  215 |     ///
  216 |     /// `pos` models the envelope the [`CacheCodec`](super::CacheCodec) wrapper
  217 |     /// writes ahead of the body; it only affects section alignment.
  218 |     fn write_body(pos: usize, f: impl FnOnce(&mut CacheEntryWriter<'_>)) -> Bytes {
  219 |         let mut buf = Vec::new();
  220 |         let mut writer = CacheEntryWriter::with_pos(&mut buf, pos);
  221 |         f(&mut writer);
  222 |         Bytes::from(buf)
  223 |     }
  224 | 
  225 |     fn int_batch(values: Vec<i32>) -> RecordBatch {
  226 |         let schema = Schema::new(vec![Field::new("i", DataType::Int32, false)]);
  227 |         RecordBatch::try_new(schema.into(), vec![Arc::new(Int32Array::from(values))]).unwrap()
  228 |     }
  229 | 
  230 |     #[test]
  231 |     fn test_u8_roundtrip_and_truncation() {
  232 |         let data = write_body(0, |w| {
  233 |             w.write_u8(7).unwrap();
  234 |             w.write_u8(255).unwrap();
  235 |         });
  236 |         assert_eq!(data.as_ref(), &[7, 255]);
  237 | 
  238 |         let mut reader = CacheEntryReader::new(&data, 0, 1);
  239 |         assert_eq!(reader.read_u8().unwrap(), 7);
  240 |         assert_eq!(reader.read_u8().unwrap(), 255);
  241 | 
  242 |         // A third read has nothing left and must say so rather than wrap around.
  243 |         let message = reader.read_u8().unwrap_err().to_string();
  244 |         assert!(message.contains("missing tag byte"), "{message}");
  245 |     }
  246 | 
  247 |     /// Headers are framed as `[len: u32 LE][bytes]`; `u64` stands in for a real
  248 |     /// header proto here (prost encodes it as `google.protobuf.UInt64Value`).
  249 |     #[test]
  250 |     fn test_header_roundtrip_is_length_prefixed() {
  251 |         let data = write_body(0, |w| w.write_header(&1234u64).unwrap());
  252 | 
  253 |         let encoded_len = 1234u64.encoded_len();
  254 |         assert_eq!(
  255 |             u32::from_le_bytes(data[..4].try_into().unwrap()) as usize,
  256 |             encoded_len
  257 |         );
  258 |         assert_eq!(data.len(), 4 + encoded_len);
  259 | 
  260 |         let mut reader = CacheEntryReader::new(&data, 0, 1);
  261 |         assert_eq!(reader.read_header::<u64>().unwrap(), 1234);
  262 |         // The reader consumed exactly the prefix plus the payload.
  263 |         assert!(reader.body().is_empty());
  264 |     }
  265 | 
  266 |     #[test]
  267 |     fn test_read_header_rejects_truncated_length_prefix() {
  268 |         let data = Bytes::from_static(&[0, 0]);
  269 |         let message = CacheEntryReader::new(&data, 0, 1)
  270 |             .read_header::<u64>()
  271 |             .unwrap_err()
  272 |             .to_string();
  273 |         assert!(message.contains("truncated length prefix"), "{message}");
  274 |     }
  275 | 
  276 |     #[test]
  277 |     fn test_read_header_rejects_truncated_body() {
  278 |         // Prefix claims 16 payload bytes; only 3 follow.
  279 |         let mut data = 16u32.to_le_bytes().to_vec();
  280 |         data.extend_from_slice(&[1, 2, 3]);
  281 |         let data = Bytes::from(data);
  282 | 
  283 |         let message = CacheEntryReader::new(&data, 0, 1)
  284 |             .read_header::<u64>()
  285 |             .unwrap_err()
  286 |             .to_string();
  287 |         assert!(message.contains("truncated body"), "{message}");
  288 |     }
  289 | 
  290 |     /// A length prefix that is in range but whose payload is not valid protobuf
  291 |     /// must surface as a decode error, not a panic inside prost.
  292 |     #[test]
  293 |     fn test_read_header_rejects_undecodable_payload() {
  294 |         // Field 1 tagged as a varint, then a varint that never terminates.
  295 |         let payload = [0x08u8, 0xFF, 0xFF, 0xFF];
  296 |         let mut data = (payload.len() as u32).to_le_bytes().to_vec();
  297 |         data.extend_from_slice(&payload);
  298 |         let data = Bytes::from(data);
  299 | 
  300 |         let message = CacheEntryReader::new(&data, 0, 1)
  301 |             .read_header::<u64>()
  302 |             .unwrap_err()
  303 |             .to_string();
  304 |         assert!(message.contains("decode failed"), "{message}");
  305 |     }
  306 | 
  307 |     #[test]
  308 |     fn test_raw_roundtrip_leaves_the_rest_as_body() {
  309 |         let data = write_body(0, |w| {
  310 |             w.write_raw(&[1, 2, 3]).unwrap();
  311 |             w.raw_writer().write_all(&[9, 9]).unwrap();
  312 |         });
  313 |         // 8-byte length prefix + 3 payload + 2 trailing.
  314 |         assert_eq!(data.len(), 13);
  315 | 
  316 |         let mut reader = CacheEntryReader::new(&data, 0, 1);
  317 |         assert_eq!(reader.read_raw().unwrap().as_ref(), &[1, 2, 3]);
  318 |         assert_eq!(reader.body().as_ref(), &[9, 9]);
  319 |     }
  320 | 
  321 |     #[test]
  322 |     fn test_reader_exposes_the_entry_version() {
  323 |         let data = Bytes::from_static(&[0]);
  324 |         assert_eq!(CacheEntryReader::new(&data, 0, 7).version(), 7);
  325 |     }
  326 | 
  327 |     /// The reason `pos` is tracked at all: an IPC section must begin on a
  328 |     /// 64-byte boundary *of the whole entry*, so the envelope bytes ahead of the
  329 |     /// body count toward the padding. Writer and reader have to agree on that,
  330 |     /// and only a non-multiple-of-64 prefix makes a disagreement visible.
  331 |     #[test]
  332 |     fn test_ipc_section_is_aligned_against_the_envelope() {
  333 |         const ENVELOPE: usize = 13;
  334 |         let batch = int_batch(vec![1, 2, 3]);
  335 | 
  336 |         let mut buf = vec![0xAAu8; ENVELOPE];
  337 |         let mut writer = CacheEntryWriter::with_pos(&mut buf, ENVELOPE);
  338 |         writer.write_header(&1234u64).unwrap();
  339 |         writer.write_ipc(&batch).unwrap();
  340 |         let data = Bytes::from(buf);
  341 | 
  342 |         let header_end = ENVELOPE + 4 + 1234u64.encoded_len();
  343 |         let stream_start = header_end.next_multiple_of(IPC_SECTION_ALIGNMENT);
  344 |         assert!(stream_start > header_end, "padding should be non-empty");
  345 |         assert!(
  346 |             data[header_end..stream_start].iter().all(|b| *b == 0),
  347 |             "the gap must be zero padding"
  348 |         );
  349 | 
  350 |         let mut reader = CacheEntryReader::new(&data, ENVELOPE, 1);
  351 |         assert_eq!(reader.read_header::<u64>().unwrap(), 1234);
  352 |         assert_eq!(reader.read_ipc().unwrap(), batch);
  353 |         assert!(reader.body().is_empty());
  354 |     }
  355 | 
  356 |     #[test]
  357 |     fn test_ipc_batches_roundtrip() {
  358 |         let batches = vec![int_batch(vec![1, 2]), int_batch(vec![3])];
  359 |         let data = write_body(0, |w| w.write_ipc_batches(batches.clone()).unwrap());
  360 | 
  361 |         let mut reader = CacheEntryReader::new(&data, 0, 1);
  362 |         assert_eq!(reader.read_ipc_batches().unwrap(), batches);
  363 |     }
  364 | 
  365 |     /// The shape a real codec writes: a discriminant, a header, an arrow section
  366 |     /// and a blob. Each reader step has to pick up exactly where the previous one
  367 |     /// stopped, and the arrow section still has to land on its boundary even
  368 |     /// though a `write_u8` moved the position by one.
  369 |     #[test]
  370 |     fn test_mixed_sections_stay_in_sync() {
  371 |         let schema = Schema::new(vec![Field::new("u", DataType::UInt64, false)]);
  372 |         let batch = RecordBatch::try_new(
  373 |             schema.into(),
  374 |             vec![Arc::new(UInt64Array::from(vec![u64::MAX, 0]))],
  375 |         )
  376 |         .unwrap();
  377 | 
  378 |         let data = write_body(0, |w| {
  379 |             w.write_u8(2).unwrap();
  380 |             w.write_header(&99u64).unwrap();
  381 |             w.write_ipc(&batch).unwrap();
  382 |             w.write_raw(&[7, 7, 7]).unwrap();
  383 |         });
  384 | 
  385 |         let mut reader = CacheEntryReader::new(&data, 0, 1);
  386 |         assert_eq!(reader.read_u8().unwrap(), 2);
  387 |         assert_eq!(reader.read_header::<u64>().unwrap(), 99);
  388 |         assert_eq!(reader.read_ipc().unwrap(), batch);
  389 |         assert_eq!(reader.read_raw().unwrap().as_ref(), &[7, 7, 7]);
  390 |         assert!(reader.body().is_empty());
  391 |     }
  392 | }
``````
