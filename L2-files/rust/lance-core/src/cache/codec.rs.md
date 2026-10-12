> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-core/src/cache/codec.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `7a39579e8986a9994b254c1f9dbee92ea22b769f66bfbd036a105b22cca4114f`. Reviewed physical lines: 1-553.

[Module](../../../../../L1-modules/rust-lance-core-cache.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Cache-entry LCE1 envelope parser/writer, explicit hit/miss reasons, serializable-type trait and allocation-free type-erased codec descriptor with function-pointer adapters. (rust/lance-core/src/cache/codec.rs:1-553)

## Complete range analysis

### Lines 1-37

SPDX/module docs describe concrete CacheCodecImpl -> type-erased CacheCodec. The declared envelope is LCE1 magic4, envelope_version u8, type-id byte length LEu16 plus UTF-8, body-version LEu32, then body. Hand framing is called stability-critical/unchanging, while bodies use protobuf headers by convention. Parse/identity/version/body Result failures become cache misses; historical shape self-healing is current documentation, not a mandate to add old-unstable migrations. (rust/lance-core/src/cache/codec.rs:1-37)

### Lines 38-61

Imports Write,Arc,Bytes,core Error/Result and sibling entry IO. Public MAGIC=[L,C,E,1] with hex4C434531. Comments claim this avoids earlier small-length/tag shapes, but no arbitrary-payload collision proof or released-fixture verification is present. Public exposure allows backends to inspect prefixes. (rust/lance-core/src/cache/codec.rs:38-61)

### Lines 62-75

has_cache_envelope checks only first4 bytes equal MAGIC using get; returns false for length<4 and true for exactly4 magic bytes even though no complete envelope exists. Private ENVELOPE_VERSION=u8=1 is the only accepted outer version. (rust/lance-core/src/cache/codec.rs:62-75)

### Lines 76-103

Private ParsedEnvelope borrows type_id and owns type_version/body_offset. parse_envelope starts offset0, safely gets4 magic bytes then version byte; mismatch/truncation returns None. Offset additions here are bounded small constants. No allocation, IO, logging or error object is made by the parser itself. (rust/lance-core/src/cache/codec.rs:76-103)

### Lines 104-119

Parser gets LEu16 id byte length, borrows that many bytes, validates UTF-8, then reads LEu32 body version. Returns body_offset=11+id_byte_length, bounded at65546 by u16 length. Empty/NUL-containing type IDs and version0 are accepted. It does not check body availability/content, trailing bytes, checksum, type identity or version support; The wrapper checks exact type identity and rejects body versions newer than its current version; older/equal body-version handling is delegated to the body decoder. (rust/lance-core/src/cache/codec.rs:330-361) (rust/lance-core/src/cache/codec.rs:104-119)

### Lines 120-139

write_envelope first checks UTF-8 byte length fitsu16, otherwise Error::io includes actual length and65535 limit with no writes yet. It then write_all's magic/version/length/id/body-version in order and returns11+id.len(). IO failures propagate and can leave a partial envelope; there is no rollback, buffering, flush or checksum. (rust/lance-core/src/cache/codec.rs:120-139)

### Lines 140-166

Section separator and public Debug/Clone/Copy/PartialEq/Eq CacheMissReason enumerate InvalidEnvelope (bad/unknown/truncated/non-UTF8 framing), TypeMismatch, VersionTooNew and BodyError. Docs assign all reasons recomputation by the backend and allow distinct metrics; this enum itself neither evicts nor invokes a loader. (rust/lance-core/src/cache/codec.rs:140-166)

### Lines 167-186

Public Debug CacheDecode<T> is Hit(T) or Miss(CacheMissReason). Consuming hit() returns Some(value) or None, discarding any reason. There is no Result error channel or automatic retry in this helper. (rust/lance-core/src/cache/codec.rs:167-186)

### Lines 187-208

CacheCodecImpl documentation explicitly marks serialized format experimental/no stability guarantee between releases, then describes future append-only TYPE_ID/protobuf field/enum rules and version bumps. Separate TYPE_ID docs below say must not change once shipped. Record this tension rather than inferring a released guarantee. Body serialization order and version-aware matching read order are implementor obligations; wrapper owns envelope only. (rust/lance-core/src/cache/codec.rs:187-208)

### Lines 209-230

Public CacheCodecImpl:Send+Sync requires TYPE_ID:static str, CURRENT_VERSION:u32, serialize(&self,&mut CacheEntryWriter)->Result<()> and deserialize(&mut CacheEntryReader)->Result<Self> where Self:Sized. Constants and deserialize return make this a concrete implementation trait, not the erased backend object. It does not require Any,DeepSizeOf or Debug; from_impl later adds static lifetime. No mandated protobuf header is type-enforced. (rust/lance-core/src/cache/codec.rs:209-230)

### Lines 231-251

pub(crate) ArcAny aliases Arc<dyn Any+Send+Sync>. Public Copy/Clone CacheCodec contains static type id,u32 version and two plain function pointers for erased-body write/read. Descriptor construction itself allocates no heap state; function-pointer execution can allocate or fail. Private fields prevent outside direct mutation. (rust/lance-core/src/cache/codec.rs:231-251)

### Lines 252-260

Custom Debug prints CacheCodec with type_id and version and finish_non_exhaustive, omitting function-pointer fields. It does not serialize bytes or invoke codecs. (rust/lance-core/src/cache/codec.rs:252-260)

### Lines 261-277

serialize_via_impl<T:CacheCodecImpl+static> downcast_ref expects exact concrete T and panics with cache-layer-bug message if wrong, then calls T::serialize. deserialize_via_impl delegates T::deserialize with ?, allocates Arc<T> on success and erases it. Panic/allocation failures are not caught here. (rust/lance-core/src/cache/codec.rs:261-277)

### Lines 278-298

Public CacheCodec::new accepts explicit static type id,u32 version and write/read function pointers, supporting orphan-rule custom adapters. It simply stores fields without checking identity uniqueness/nonemptiness/id length, version range, concrete type coherence, or roundtrip compatibility. Length validation happens when writing envelope. (rust/lance-core/src/cache/codec.rs:278-298)

### Lines 299-316

from_impl<T> copies associated TYPE_ID/CURRENT_VERSION and monomorphized adapter pointers. Const type_id(&self) returns static identity for backend routing. No public version accessor appears in this implementation; readers get stored input version from CacheEntryReader. (rust/lance-core/src/cache/codec.rs:299-316)

### Lines 317-323

serialize writes the full envelope first, constructs CacheEntryWriter::with_pos at body offset, then calls erased serializer directly. A body error or adapter wrong-type panic can leave envelope/partial body in the underlying writer. No temporary full-entry buffer or transactional write is provided by this wrapper. (rust/lance-core/src/cache/codec.rs:317-323)

### Lines 324-344

deserialize returns CacheDecode<ArcAny>; parser failure logs debug and returns InvalidEnvelope, then exact type-id mismatch logs actual/expected and returns TypeMismatch. Order matters: malformed framing is rejected before identity, and identity before body-version gate. The never fails doc concerns Result parse failures, not a panic-catching guarantee. (rust/lance-core/src/cache/codec.rs:324-344)

### Lines 345-357

If input body version>codec version, logs and returns VersionTooNew without calling body decoder. Older/equal values, including0, are passed to implementation; there is no minimum supported version registry or backward migration here. Wrapper numeric ordering alone does not prove body can read every older version. (rust/lance-core/src/cache/codec.rs:345-357)

### Lines 358-372

Constructs reader over original whole Bytes at envelope.body_offset with input type_version. Decoder Ok is Hit without checking reader consumed all bytes; Err logs full Display and becomes BodyError with original detailed error discarded from outcome. Panics are not caught and custom callbacks can perform arbitrary effects despite local in-memory parsing. No checksum/authentication or postdecode concrete-type validation is present. (rust/lance-core/src/cache/codec.rs:358-372)

### Lines 373-403

cfg(test) Widget stores n:u32, uses TYPE_ID=test.Widget/v1. Its body writes a raw length-prefixed four-byte LE n, with no protobuf header; decoder reads raw then requires exactly4 payload bytes, otherwise Error::io bad widget. This demonstrates body primitive choice is implementor-defined. (rust/lance-core/src/cache/codec.rs:373-403)

### Lines 404-429

serialize_widget makes fresh Arc Widget, serializes into Vec and converts Bytes, unwrapping errors. miss_reason converts Hit to None/Miss to reason. deserialize_widget uses wrapper then downcasts and try_unwrap's Arc, assuming test codec returns sole-owned Widget. These are private test helpers with no production panic guarantee. (rust/lance-core/src/cache/codec.rs:404-429)

### Lines 430-448

Roundtrip test asserts LCE1 prefix and DEADBEEF Widget equality; magic helper test includes valid bytes, exactly MAGIC alone(true), short LCE,false foreign/empty. It explicitly separates prefix recognition from full envelope validation. (rust/lance-core/src/cache/codec.rs:430-448)

### Lines 449-477

Wrong-first-byte fixture expects InvalidEnvelope. Historical-shape test synthesizes LEu64 length42 plus42 zeros, and a small tag-byte vector, both misses. These are in-source synthetic cases, not checked-in released fixtures or implemented legacy decoders. (rust/lance-core/src/cache/codec.rs:449-477)

### Lines 478-500

Unknown envelope byteFF returns InvalidEnvelope. Manually framed some.OtherType plus otherwise plausible raw widget body returns TypeMismatch. Tests do not verify combined-invalid precedence beyond these one-cause fixtures. (rust/lance-core/src/cache/codec.rs:478-500)

### Lines 501-525

CURRENT_VERSION+1 with matching type/raw body yields VersionTooNew. Truncation test cuts valid entry at0,1,4,5,7,9 and expects InvalidEnvelope; it samples positions rather than every envelope boundary and does not cover invalid UTF-8 id. (rust/lance-core/src/cache/codec.rs:501-525)

### Lines 526-553

One-byte raw Widget payload under valid envelope yields BodyError. reader_exposes_envelope_version writes body-version7 and constructs CacheEntryReader directly at recorded offset, confirming version7/raw value5; it bypasses CacheCodec's version1 gate and does not prove wrapper reads future versions. No tests here cover writer failures/overlong id, older-version branching, trailing-byte acceptance, wrong-type serialize panic or custom decoder panic. (rust/lance-core/src/cache/codec.rs:526-553)

## Interaction and interpretation limits

The source calls the outer envelope stabilized/stability-critical while the CacheCodecImpl format documentation explicitly remains experimental. This file alone does not resolve a released stable-format guarantee; repository compatibility rules take precedence over speculative preservation of intermediate unstable builds. Exact wrapper behavior is established, but concrete production body codecs, backend Miss handling and lance_arrow IPC implementation remain pending. No tests executed or external specifications fetched. (rust/lance-core/src/cache/codec.rs:22-36; rust/lance-core/src/cache/codec.rs:51-60; rust/lance-core/src/cache/codec.rs:191-228; rust/lance-core/src/cache/codec.rs:317-370)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Serialization codecs for cache entries.
    5 | //!
    6 | //! Implement [`CacheCodecImpl`] on concrete types, then use
    7 | //! [`CacheCodec::from_impl`] to produce a type-erased codec for the cache.
    8 | //!
    9 | //! # Wire format
   10 | //!
   11 | //! Every serialized entry begins with a small hand-framed **envelope** so the
   12 | //! reader can validate it before trusting the body:
   13 | //!
   14 | //! ```text
   15 | //! [magic: 4B = b"LCE1"]
   16 | //! [envelope_version: u8]
   17 | //! [type_id_len: u16 LE][type_id: utf8]   # stable, author-assigned
   18 | //! [type_version: u32 LE]                 # per-type body schema version
   19 | //! <body, written by the type's CacheCodecImpl::serialize>
   20 | //! ```
   21 | //!
   22 | //! The envelope is deliberately *not* protobuf: it is the most
   23 | //! stability-critical part, must parse robustly against arbitrary bytes
   24 | //! (including data written by older, pre-stabilization builds), and never
   25 | //! changes shape. Bodies use protobuf headers, where field-number evolution
   26 | //! pays off.
   27 | //!
   28 | //! # Decode outcome
   29 | //!
   30 | //! Deserialization never propagates a parse failure as a hard error into the
   31 | //! cache path. Anything the reader cannot confidently interpret — absent or
   32 | //! wrong magic, an unknown `envelope_version`, a `type_id` mismatch, an
   33 | //! unsupported `type_version`, or a body decode error — becomes
   34 | //! [`CacheDecode::Miss`]. A backend turns `Miss` into a normal cache miss and
   35 | //! recomputes the value. This is what lets data written by an older format
   36 | //! self-heal: it simply fails the magic check and is regenerated.
   37 | 
   38 | use std::io::Write;
   39 | use std::sync::Arc;
   40 | 
   41 | use bytes::Bytes;
   42 | 
   43 | use crate::{Error, Result};
   44 | 
   45 | use super::{CacheEntryReader, CacheEntryWriter};
   46 | 
   47 | // ---------------------------------------------------------------------------
   48 | // Envelope
   49 | // ---------------------------------------------------------------------------
   50 | 
   51 | /// Magic bytes that prefix every stabilized cache entry.
   52 | ///
   53 | /// An ASCII tag (`0x4C 0x43 0x45 0x31`) chosen so it cannot collide with any
   54 | /// pre-stabilization blob: those began with either a small little-endian
   55 | /// length (tens of bytes) or a small tag byte, never these values.
   56 | ///
   57 | /// Exported so backends can cheaply identify Lance cache entries (e.g. when
   58 | /// scanning a persistent store at startup) without hardcoding the bytes —
   59 | /// prefer [`has_cache_envelope`] over comparing against this directly.
   60 | pub const MAGIC: [u8; 4] = *b"LCE1";
   61 | 
   62 | /// Returns `true` if `data` begins with the cache-entry [`MAGIC`].
   63 | ///
   64 | /// A cheap prefix check for backends that need to recognize Lance cache
   65 | /// entries without fully [`deserialize`](CacheCodec::deserialize)-ing them. A
   66 | /// `true` result only means the framing looks like ours; the entry can still
   67 | /// decode to a [`Miss`](CacheDecode::Miss) (e.g. wrong `type_id`).
   68 | pub fn has_cache_envelope(data: &[u8]) -> bool {
   69 |     data.get(..MAGIC.len()) == Some(&MAGIC[..])
   70 | }
   71 | 
   72 | /// Version of the envelope framing itself. Bumped only if the outer frame
   73 | /// (magic/version/type_id/type_version layout) ever changes — expected never.
   74 | const ENVELOPE_VERSION: u8 = 1;
   75 | 
   76 | /// Parsed envelope borrowed from the input bytes.
   77 | struct ParsedEnvelope<'a> {
   78 |     type_id: &'a str,
   79 |     type_version: u32,
   80 |     /// Offset of the first body byte within the input.
   81 |     body_offset: usize,
   82 | }
   83 | 
   84 | /// Parse and validate the envelope at the start of `data`.
   85 | ///
   86 | /// Returns `None` for anything that is not a well-formed envelope this build
   87 | /// understands (wrong/absent magic, unknown `envelope_version`, truncation,
   88 | /// non-utf8 `type_id`). Callers translate `None` into [`CacheDecode::Miss`].
   89 | fn parse_envelope(data: &Bytes) -> Option<ParsedEnvelope<'_>> {
   90 |     let bytes = data.as_ref();
   91 |     let mut off = 0usize;
   92 | 
   93 |     let magic = bytes.get(off..off + 4)?;
   94 |     if magic != MAGIC {
   95 |         return None;
   96 |     }
   97 |     off += 4;
   98 | 
   99 |     if *bytes.get(off)? != ENVELOPE_VERSION {
  100 |         return None;
  101 |     }
  102 |     off += 1;
  103 | 
  104 |     let type_id_len = u16::from_le_bytes(bytes.get(off..off + 2)?.try_into().ok()?) as usize;
  105 |     off += 2;
  106 | 
  107 |     let type_id = std::str::from_utf8(bytes.get(off..off + type_id_len)?).ok()?;
  108 |     off += type_id_len;
  109 | 
  110 |     let type_version = u32::from_le_bytes(bytes.get(off..off + 4)?.try_into().ok()?);
  111 |     off += 4;
  112 | 
  113 |     Some(ParsedEnvelope {
  114 |         type_id,
  115 |         type_version,
  116 |         body_offset: off,
  117 |     })
  118 | }
  119 | 
  120 | /// Write the envelope for `type_id`/`type_version`, returning the number of
  121 | /// bytes written (the body's starting offset).
  122 | fn write_envelope(writer: &mut dyn Write, type_id: &str, type_version: u32) -> Result<usize> {
  123 |     let type_id_len = u16::try_from(type_id.len()).map_err(|_| {
  124 |         Error::io(format!(
  125 |             "cache codec type_id too long ({} bytes, max {})",
  126 |             type_id.len(),
  127 |             u16::MAX
  128 |         ))
  129 |     })?;
  130 | 
  131 |     writer.write_all(&MAGIC)?;
  132 |     writer.write_all(&[ENVELOPE_VERSION])?;
  133 |     writer.write_all(&type_id_len.to_le_bytes())?;
  134 |     writer.write_all(type_id.as_bytes())?;
  135 |     writer.write_all(&type_version.to_le_bytes())?;
  136 | 
  137 |     Ok(4 + 1 + 2 + type_id.len() + 4)
  138 | }
  139 | 
  140 | // ---------------------------------------------------------------------------
  141 | // CacheDecode — first-class cache-miss outcome
  142 | // ---------------------------------------------------------------------------
  143 | 
  144 | /// Why a cache entry could not be decoded into the expected type.
  145 | ///
  146 | /// Carried by [`CacheDecode::Miss`] so backends can emit targeted metrics
  147 | /// (e.g. distinguish "evicting due to a stale format" from "type collision")
  148 | /// without re-parsing. Every reason maps to the same behavior — recompute via
  149 | /// the loader — so callers that don't care can ignore it.
  150 | #[derive(Debug, Clone, Copy, PartialEq, Eq)]
  151 | pub enum CacheMissReason {
  152 |     /// Absent or wrong magic, unknown `envelope_version`, truncated framing, or
  153 |     /// a non-utf8 `type_id`. Typically an entry written by a pre-stabilization
  154 |     /// or otherwise foreign build.
  155 |     InvalidEnvelope,
  156 |     /// Well-formed envelope, but its `type_id` names a different entry type than
  157 |     /// the codec reading it.
  158 |     TypeMismatch,
  159 |     /// Written by a newer build whose `type_version` this build does not
  160 |     /// understand and must not attempt to interpret.
  161 |     VersionTooNew,
  162 |     /// Envelope validated, but the body failed to decode (truncation, a
  163 |     /// malformed protobuf header, an IPC error, etc.).
  164 |     BodyError,
  165 | }
  166 | 
  167 | /// Outcome of deserializing a cache entry.
  168 | ///
  169 | /// `Miss` means the bytes could not be confidently decoded into `T`; the
  170 | /// [`CacheMissReason`] says why. A backend treats any `Miss` exactly like a key
  171 | /// that was never present: recompute via the loader.
  172 | #[derive(Debug)]
  173 | pub enum CacheDecode<T> {
  174 |     Hit(T),
  175 |     Miss(CacheMissReason),
  176 | }
  177 | 
  178 | impl<T> CacheDecode<T> {
  179 |     pub fn hit(self) -> Option<T> {
  180 |         match self {
  181 |             Self::Hit(v) => Some(v),
  182 |             Self::Miss(_) => None,
  183 |         }
  184 |     }
  185 | }
  186 | 
  187 | // ---------------------------------------------------------------------------
  188 | // CacheCodecImpl — trait for serializable cache entry types
  189 | // ---------------------------------------------------------------------------
  190 | 
  191 | /// Serialization trait for cache entries.
  192 | ///
  193 | /// **Experimental**: the serialized format is not yet covered by a stability
  194 | /// guarantee and may change between releases. When it does stabilize, the
  195 | /// rules are: `TYPE_ID`, protobuf field numbers, and enum values are
  196 | /// append-only forever; format changes that protobuf cannot express
  197 | /// transparently bump [`CURRENT_VERSION`](Self::CURRENT_VERSION).
  198 | ///
  199 | /// Implement this on concrete types that need to survive serialization through
  200 | /// a persistent cache backend, then wire it into a
  201 | /// [`CacheKey`](super::CacheKey) via [`CacheCodec::from_impl`].
  202 | ///
  203 | /// The envelope (magic/version/type_id/type_version) is written and validated
  204 | /// by the [`CacheCodec`] wrapper. [`serialize`](Self::serialize) writes only
  205 | /// the body — a header followed by sections in a fixed, version-keyed order —
  206 | /// and [`deserialize`](Self::deserialize) reads them back in that same order.
  207 | /// The read sequence mirroring the write sequence for each `type_version` is
  208 | /// the invariant the implementor owns.
  209 | pub trait CacheCodecImpl: Send + Sync {
  210 |     /// Stable identity for this entry type. **Must not change once shipped.**
  211 |     /// This is a deliberate author-assigned string, not `std::any::type_name`
  212 |     /// (which is not stable across compiler versions).
  213 |     const TYPE_ID: &'static str;
  214 | 
  215 |     /// Body schema version this build writes. Bump when the body layout
  216 |     /// changes in a way protobuf field additions cannot express transparently
  217 |     /// (adding/removing/reordering sections, a raw-blob encoding change, etc.).
  218 |     const CURRENT_VERSION: u32;
  219 | 
  220 |     /// Write the body: a header, then sections in a fixed order.
  221 |     fn serialize(&self, writer: &mut CacheEntryWriter<'_>) -> Result<()>;
  222 | 
  223 |     /// Reconstruct from the body. Branch on
  224 |     /// [`reader.version()`](CacheEntryReader::version) for backward compat;
  225 |     /// sections are read in write order.
  226 |     fn deserialize(reader: &mut CacheEntryReader<'_>) -> Result<Self>
  227 |     where
  228 |         Self: Sized;
  229 | }
  230 | 
  231 | // ---------------------------------------------------------------------------
  232 | // CacheCodec — type-erased codec passed to backends
  233 | // ---------------------------------------------------------------------------
  234 | 
  235 | pub(crate) type ArcAny = Arc<dyn std::any::Any + Send + Sync>;
  236 | 
  237 | /// Type-erased codec for serializing and deserializing cache entries.
  238 | ///
  239 | /// `CacheCodec` carries the entry's stable `type_id`/`version` plus two plain
  240 | /// function pointers — it is `Copy` and has no heap allocation. Construct one
  241 | /// via [`CacheCodec::from_impl`] for types that implement [`CacheCodecImpl`],
  242 | /// or [`CacheCodec::new`] for custom cases (e.g. when the orphan rule prevents
  243 | /// a direct impl).
  244 | #[derive(Copy, Clone)]
  245 | pub struct CacheCodec {
  246 |     type_id: &'static str,
  247 |     version: u32,
  248 |     serialize_body: fn(&ArcAny, &mut CacheEntryWriter<'_>) -> Result<()>,
  249 |     deserialize_body: fn(&mut CacheEntryReader<'_>) -> Result<ArcAny>,
  250 | }
  251 | 
  252 | impl std::fmt::Debug for CacheCodec {
  253 |     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
  254 |         f.debug_struct("CacheCodec")
  255 |             .field("type_id", &self.type_id)
  256 |             .field("version", &self.version)
  257 |             .finish_non_exhaustive()
  258 |     }
  259 | }
  260 | 
  261 | fn serialize_via_impl<T: CacheCodecImpl + 'static>(
  262 |     any: &ArcAny,
  263 |     writer: &mut CacheEntryWriter<'_>,
  264 | ) -> Result<()> {
  265 |     let val = any
  266 |         .downcast_ref::<T>()
  267 |         .expect("CacheCodec::serialize called with wrong type (this is a bug in the cache layer)");
  268 |     val.serialize(writer)
  269 | }
  270 | 
  271 | fn deserialize_via_impl<T: CacheCodecImpl + 'static>(
  272 |     reader: &mut CacheEntryReader<'_>,
  273 | ) -> Result<ArcAny> {
  274 |     let val = T::deserialize(reader)?;
  275 |     Ok(Arc::new(val) as ArcAny)
  276 | }
  277 | 
  278 | impl CacheCodec {
  279 |     /// Create a `CacheCodec` from explicit body function pointers.
  280 |     ///
  281 |     /// Prefer [`from_impl`](Self::from_impl) when the value type implements
  282 |     /// [`CacheCodecImpl`]. Use this for types where a direct impl isn't
  283 |     /// possible (e.g. the orphan rule prevents it). `type_id` and `version`
  284 |     /// play the same role as the corresponding [`CacheCodecImpl`] constants.
  285 |     pub fn new(
  286 |         type_id: &'static str,
  287 |         version: u32,
  288 |         serialize_body: fn(&ArcAny, &mut CacheEntryWriter<'_>) -> Result<()>,
  289 |         deserialize_body: fn(&mut CacheEntryReader<'_>) -> Result<ArcAny>,
  290 |     ) -> Self {
  291 |         Self {
  292 |             type_id,
  293 |             version,
  294 |             serialize_body,
  295 |             deserialize_body,
  296 |         }
  297 |     }
  298 | 
  299 |     /// Create a `CacheCodec` from a [`CacheCodecImpl`] implementation.
  300 |     pub fn from_impl<T: CacheCodecImpl + 'static>() -> Self {
  301 |         Self {
  302 |             type_id: T::TYPE_ID,
  303 |             version: T::CURRENT_VERSION,
  304 |             serialize_body: serialize_via_impl::<T>,
  305 |             deserialize_body: deserialize_via_impl::<T>,
  306 |         }
  307 |     }
  308 | 
  309 |     /// Return the stable entry type identity.
  310 |     ///
  311 |     /// Persistent and tiered backends can use this metadata to route encoded
  312 |     /// values without retaining a readable logical cache key.
  313 |     pub const fn type_id(&self) -> &'static str {
  314 |         self.type_id
  315 |     }
  316 | 
  317 |     /// Serialize `value` into `writer`: envelope first, then the body.
  318 |     pub fn serialize(&self, value: &ArcAny, writer: &mut dyn Write) -> Result<()> {
  319 |         let body_offset = write_envelope(writer, self.type_id, self.version)?;
  320 |         let mut entry_writer = CacheEntryWriter::with_pos(writer, body_offset);
  321 |         (self.serialize_body)(value, &mut entry_writer)
  322 |     }
  323 | 
  324 |     /// Deserialize an entry from `data`.
  325 |     ///
  326 |     /// Never fails: any non-fatal failure to interpret the bytes becomes a
  327 |     /// [`CacheDecode::Miss`] with the reason why (see [`CacheMissReason`]).
  328 |     /// Reading from an in-memory [`Bytes`] cannot do I/O, so there is no fault
  329 |     /// channel — a miss is the only non-`Hit` outcome.
  330 |     pub fn deserialize(&self, data: &Bytes) -> CacheDecode<ArcAny> {
  331 |         let Some(envelope) = parse_envelope(data) else {
  332 |             log::debug!("cache entry rejected: missing or invalid envelope");
  333 |             return CacheDecode::Miss(CacheMissReason::InvalidEnvelope);
  334 |         };
  335 | 
  336 |         if envelope.type_id != self.type_id {
  337 |             log::debug!(
  338 |                 "cache entry type_id mismatch: got {:?}, expected {:?}",
  339 |                 envelope.type_id,
  340 |                 self.type_id
  341 |             );
  342 |             return CacheDecode::Miss(CacheMissReason::TypeMismatch);
  343 |         }
  344 | 
  345 |         // A version newer than this build writes was produced by a newer build
  346 |         // whose body layout we cannot assume to understand. Older/equal versions
  347 |         // are the impl's responsibility to handle (branching on reader.version()).
  348 |         if envelope.type_version > self.version {
  349 |             log::debug!(
  350 |                 "cache entry {:?} has unsupported type_version {} (this build writes {})",
  351 |                 self.type_id,
  352 |                 envelope.type_version,
  353 |                 self.version
  354 |             );
  355 |             return CacheDecode::Miss(CacheMissReason::VersionTooNew);
  356 |         }
  357 | 
  358 |         let mut reader = CacheEntryReader::new(data, envelope.body_offset, envelope.type_version);
  359 |         match (self.deserialize_body)(&mut reader) {
  360 |             Ok(value) => CacheDecode::Hit(value),
  361 |             Err(e) => {
  362 |                 log::debug!(
  363 |                     "cache entry {:?} v{} failed to decode: {e}",
  364 |                     self.type_id,
  365 |                     envelope.type_version
  366 |                 );
  367 |                 CacheDecode::Miss(CacheMissReason::BodyError)
  368 |             }
  369 |         }
  370 |     }
  371 | }
  372 | 
  373 | #[cfg(test)]
  374 | mod tests {
  375 |     use super::*;
  376 | 
  377 |     /// A trivial codec used to exercise the envelope and miss semantics
  378 |     /// without pulling in arrow-backed payloads.
  379 |     #[derive(Debug, PartialEq)]
  380 |     struct Widget {
  381 |         n: u32,
  382 |     }
  383 | 
  384 |     impl CacheCodecImpl for Widget {
  385 |         const TYPE_ID: &'static str = "test.Widget";
  386 |         const CURRENT_VERSION: u32 = 1;
  387 | 
  388 |         fn serialize(&self, writer: &mut CacheEntryWriter<'_>) -> Result<()> {
  389 |             writer.write_raw(&self.n.to_le_bytes())
  390 |         }
  391 | 
  392 |         fn deserialize(reader: &mut CacheEntryReader<'_>) -> Result<Self> {
  393 |             let bytes = reader.read_raw()?;
  394 |             let n = u32::from_le_bytes(
  395 |                 bytes
  396 |                     .as_ref()
  397 |                     .try_into()
  398 |                     .map_err(|_| Error::io("bad widget".to_string()))?,
  399 |             );
  400 |             Ok(Self { n })
  401 |         }
  402 |     }
  403 | 
  404 |     fn serialize_widget(widget: &Widget) -> Bytes {
  405 |         let codec = CacheCodec::from_impl::<Widget>();
  406 |         let any: ArcAny = Arc::new(Widget { n: widget.n });
  407 |         let mut buf = Vec::new();
  408 |         codec.serialize(&any, &mut buf).unwrap();
  409 |         Bytes::from(buf)
  410 |     }
  411 | 
  412 |     /// The miss reason, or `None` if the decode was a hit.
  413 |     fn miss_reason(data: &Bytes) -> Option<CacheMissReason> {
  414 |         match deserialize_widget(data) {
  415 |             CacheDecode::Hit(_) => None,
  416 |             CacheDecode::Miss(reason) => Some(reason),
  417 |         }
  418 |     }
  419 | 
  420 |     fn deserialize_widget(data: &Bytes) -> CacheDecode<Widget> {
  421 |         let codec = CacheCodec::from_impl::<Widget>();
  422 |         match codec.deserialize(data) {
  423 |             CacheDecode::Hit(any) => {
  424 |                 CacheDecode::Hit(Arc::try_unwrap(any.downcast::<Widget>().unwrap()).unwrap())
  425 |             }
  426 |             CacheDecode::Miss(reason) => CacheDecode::Miss(reason),
  427 |         }
  428 |     }
  429 | 
  430 |     #[test]
  431 |     fn envelope_roundtrip_hits() {
  432 |         let bytes = serialize_widget(&Widget { n: 0xDEADBEEF });
  433 |         // Sanity: the entry starts with the magic.
  434 |         assert_eq!(&bytes[..4], b"LCE1");
  435 |         let decoded = deserialize_widget(&bytes).hit().unwrap();
  436 |         assert_eq!(decoded, Widget { n: 0xDEADBEEF });
  437 |     }
  438 | 
  439 |     #[test]
  440 |     fn has_cache_envelope_detects_magic() {
  441 |         let bytes = serialize_widget(&Widget { n: 1 });
  442 |         assert!(has_cache_envelope(&bytes));
  443 |         assert!(has_cache_envelope(&MAGIC)); // exactly the magic, nothing after
  444 |         assert!(!has_cache_envelope(b"LCE")); // too short
  445 |         assert!(!has_cache_envelope(b"JUNK and more"));
  446 |         assert!(!has_cache_envelope(&[]));
  447 |     }
  448 | 
  449 |     #[test]
  450 |     fn wrong_magic_is_miss() {
  451 |         let mut bytes = serialize_widget(&Widget { n: 7 }).to_vec();
  452 |         bytes[0] = b'X';
  453 |         assert_eq!(
  454 |             miss_reason(&Bytes::from(bytes)),
  455 |             Some(CacheMissReason::InvalidEnvelope)
  456 |         );
  457 |     }
  458 | 
  459 |     #[test]
  460 |     fn pre_stabilization_blob_is_miss() {
  461 |         // An old unstable blob led with a small u64 LE length prefix (a JSON
  462 |         // header of tens of bytes) — no magic. It must self-heal to a miss.
  463 |         let mut blob = Vec::new();
  464 |         blob.extend_from_slice(&(42u64).to_le_bytes());
  465 |         blob.extend_from_slice(&[0u8; 42]);
  466 |         assert_eq!(
  467 |             miss_reason(&Bytes::from(blob)),
  468 |             Some(CacheMissReason::InvalidEnvelope)
  469 |         );
  470 | 
  471 |         // A different unstable shape led with a small u8 tag (0/1/2).
  472 |         assert_eq!(
  473 |             miss_reason(&Bytes::from(vec![0u8, 1, 2, 3])),
  474 |             Some(CacheMissReason::InvalidEnvelope)
  475 |         );
  476 |     }
  477 | 
  478 |     #[test]
  479 |     fn unknown_envelope_version_is_miss() {
  480 |         let mut bytes = serialize_widget(&Widget { n: 7 }).to_vec();
  481 |         bytes[4] = 0xFF; // envelope_version byte
  482 |         assert_eq!(
  483 |             miss_reason(&Bytes::from(bytes)),
  484 |             Some(CacheMissReason::InvalidEnvelope)
  485 |         );
  486 |     }
  487 | 
  488 |     #[test]
  489 |     fn type_id_mismatch_is_miss() {
  490 |         // Hand-build an envelope with a foreign type_id but valid framing.
  491 |         let mut buf = Vec::new();
  492 |         write_envelope(&mut buf, "some.OtherType", 1).unwrap();
  493 |         buf.extend_from_slice(&(4u64).to_le_bytes());
  494 |         buf.extend_from_slice(&99u32.to_le_bytes());
  495 |         assert_eq!(
  496 |             miss_reason(&Bytes::from(buf)),
  497 |             Some(CacheMissReason::TypeMismatch)
  498 |         );
  499 |     }
  500 | 
  501 |     #[test]
  502 |     fn unsupported_future_type_version_is_miss() {
  503 |         // An entry written by a newer build (higher type_version) must miss
  504 |         // rather than be misread by this build.
  505 |         let mut buf = Vec::new();
  506 |         write_envelope(&mut buf, Widget::TYPE_ID, Widget::CURRENT_VERSION + 1).unwrap();
  507 |         lance_arrow::ipc::write_len_prefixed_bytes(&mut buf, &9u32.to_le_bytes()).unwrap();
  508 |         assert_eq!(
  509 |             miss_reason(&Bytes::from(buf)),
  510 |             Some(CacheMissReason::VersionTooNew)
  511 |         );
  512 |     }
  513 | 
  514 |     #[test]
  515 |     fn truncated_envelope_is_miss() {
  516 |         let bytes = serialize_widget(&Widget { n: 7 });
  517 |         for cut in [0, 1, 4, 5, 7, 9] {
  518 |             assert_eq!(
  519 |                 miss_reason(&bytes.slice(..cut.min(bytes.len()))),
  520 |                 Some(CacheMissReason::InvalidEnvelope),
  521 |                 "truncating to {cut} bytes should miss as InvalidEnvelope"
  522 |             );
  523 |         }
  524 |     }
  525 | 
  526 |     #[test]
  527 |     fn body_decode_error_is_miss() {
  528 |         // Valid envelope, but the body is too short for the widget.
  529 |         let mut buf = Vec::new();
  530 |         write_envelope(&mut buf, Widget::TYPE_ID, Widget::CURRENT_VERSION).unwrap();
  531 |         buf.extend_from_slice(&(1u64).to_le_bytes());
  532 |         buf.push(0u8);
  533 |         assert_eq!(
  534 |             miss_reason(&Bytes::from(buf)),
  535 |             Some(CacheMissReason::BodyError)
  536 |         );
  537 |     }
  538 | 
  539 |     #[test]
  540 |     fn reader_exposes_envelope_version() {
  541 |         // type_version travels through the envelope to reader.version().
  542 |         let mut buf = Vec::new();
  543 |         write_envelope(&mut buf, Widget::TYPE_ID, 7).unwrap();
  544 |         let body_off = buf.len();
  545 |         // A widget body so the codec can decode it.
  546 |         lance_arrow::ipc::write_len_prefixed_bytes(&mut buf, &5u32.to_le_bytes()).unwrap();
  547 |         let data = Bytes::from(buf);
  548 | 
  549 |         let mut r = CacheEntryReader::new(&data, body_off, 7);
  550 |         assert_eq!(r.version(), 7);
  551 |         assert_eq!(r.read_raw().unwrap().as_ref(), 5u32.to_le_bytes());
  552 |     }
  553 | }
``````
