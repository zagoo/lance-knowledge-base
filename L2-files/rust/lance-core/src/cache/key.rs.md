> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-core/src/cache/key.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `8793a7c002d3aaaf7c031a83aec7e238c13fa0ac9650e27f5171bd08a06ebd79`. Reviewed physical lines: 1-476.

[Module](../../../../../L1-modules/rust-lance-core-cache.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Canonical cache identity primitives: deterministic hierarchical namespaces, versioned logical schemas, typed streaming key construction and opaque128-bit backend keys. (rust/lance-core/src/cache/key.rs:1-476)

## Complete range analysis

### Lines 1-18

SPDX, module contract and fmt import. Fields use explicit tags, fixed-width little-endian integers and length framing for cross-process/platform/build stability. Namespace derivation keys are deterministic and public in effect, not secrets; docs state generic birthday resistance about64 bits for128-bit truncated digest and no FIPS mode. This is a design contract, not a cryptographic proof or external compliance assessment. (rust/lance-core/src/cache/key.rs:1-18)

### Lines 19-29

Public CACHE_KEY_FORMAT is exactly blake3-128-v1; persistent physical namespaces should include it so future protocols cold-miss. Private key-format version is u32=1. Root derivation context is exactly lance-format/lance 2026-07-17 cache namespace v1. Namespace and entry domains are the bytes lance-cache-namespace\0 and lance-cache-entry\0, including terminal NUL. (rust/lance-core/src/cache/key.rs:19-29)

### Lines 30-55

Private repr(u8), Clone/Copy FieldTag has exact tags U8=1,U16=2,U32=3,U64=4,I32=5,I64=6,Bool=7,Str=8,Bytes=9,FixedBytes=10,None=11,Some=12,Variant=13,Sequence=14. as_u8 is a direct cast. Changing these discriminants changes canonical hash input. (rust/lance-core/src/cache/key.rs:30-55)

### Lines 56-69

Public Clone/Copy/Debug/Eq/PartialEq CacheKeySchema stores private static id string and u32 version. The contract requires a stable globally unique logical-layout id and a version bump when emitted fields or meaning change. LEGACY_TEXT is id lance.cache.legacy-text/version1 for the documented default string bridge; the implemented defaults use this schema and write one framed string. (rust/lance-core/src/cache/mod.rs:128-138; rust/lance-core/src/cache/mod.rs:175-182) (rust/lance-core/src/cache/key.rs:56-69)

### Lines 70-85

CacheKeySchema::new is const and stores id/version without validation; empty ids or version0 are accepted here and uniqueness is not enforced. Const by-value id() and version() return the two fields. No allocation is performed by these methods. (rust/lance-core/src/cache/key.rs:70-85)

### Lines 86-109

Public InternalCacheKey wraps private[16]u8 and derives Clone/Copy/Eq/Hash/Ord/PartialEq/PartialOrd. Canonical bytes are independent of integer endianness. Const from_bytes accepts arbitrary16 bytes without verification, as_bytes borrows the array and into_bytes consumes the copyable wrapper. No digest-to-logical-field decoder exists. (rust/lance-core/src/cache/key.rs:86-109)

### Lines 110-119

Manual Debug writes InternalCacheKey( followed by each byte as two lowercase hexadecimal digits, then ). Formatter errors propagate through ?. It exposes the entire digest, with no alternate formatting or redaction. (rust/lance-core/src/cache/key.rs:110-119)

### Lines 120-129

Public Clone/Copy/Debug CacheNamespace wraps private32 bytes; root recomputes blake3::derive_key with the fixed context and empty material on each call. No process randomness, secret input, memoization or raw-byte public constructor is declared here. (rust/lance-core/src/cache/key.rs:120-129)

### Lines 130-139

child consumes copyable namespace, initializes a keyed BLAKE3 hasher with its32 bytes, appends framed namespace domain, raw little-endian u32 key version, and framed UTF-8 segment, then retains all32 output bytes. A hierarchy is repeated keyed derivation, not slash concatenation. Empty segments are accepted and create a derived child rather than explicitly returning the parent. (rust/lance-core/src/cache/key.rs:130-139)

### Lines 140-165

KeyBuilder docs specify fixed-width LE integers and type-tagged length-prefixed variable fields, deliberately excluding usize to avoid target-width identity. The public example derives dataset namespace, uses type ID example.Page and CacheKeySchema::new("example.page-key",1), with name and version separate, writes7u32 and values string, and asserts16-byte output. Struct contains a private BLAKE3 Hasher; example was read, not compiled. (rust/lance-core/src/cache/key.rs:140-165)

### Lines 166-181

KeyBuilder::new(namespace, stable_type_id:static str, schema) creates a keyed hasher, writes framed entry domain, raw LEu32 format version, framed UTF-8 stable value type id, framed schema id, then raw LEu32 schema version. It accepts empty or duplicate type/schema identifiers without validation; callers own logical uniqueness and field meanings. (rust/lance-core/src/cache/key.rs:166-181)

### Lines 182-205

write_u8 emits tag1 then one raw value byte. write_u16/write_u32 construct stack arrays3/5 bytes: tag2/3 plus fixed-width LE integer. These methods update the streaming hasher immediately and return unit. No textual formatting, payload-length prefix or heap buffer is introduced by these bodies. (rust/lance-core/src/cache/key.rs:182-205)

### Lines 206-232

write_u64/write_i32/write_i64 use stack arrays9/5/9 bytes, tags4/5/6 and respective to_le_bytes. Signed values preserve fixed-width signed bit representation; widths and signedness are distinguished by tags even if payload bytes match. (rust/lance-core/src/cache/key.rs:206-232)

### Lines 233-251

write_bool emits tag7 then u8::from(bool), i.e.0/1. write_str uses tag8 and UTF-8 bytes; write_bytes uses tag9. The latter two delegate to the shared variable writer whose framing is defined at298-302, so equal payloads have distinct types. No Unicode normalization occurs. (rust/lance-core/src/cache/key.rs:233-251)

### Lines 252-269

write_fixed_bytes<const N:usize> accepts a borrowed[u8;N], uses tag10 and the same length-prefix routine despite compile-time width. N=0 is valid. write_none/write_some emit only tag11/12; they do not enforce that a following value exists, that None has no payload, or that option nesting balances. (rust/lance-core/src/cache/key.rs:252-269)

### Lines 270-287

write_variant emits tag13 plus LEu32 ordinal in5 bytes; write_sequence_len emits tag14 plus LEu64 length in9 bytes. They do not inspect variant schema or count subsequent fields; sequence/option/enum grammar consistency is the caller's obligation. (rust/lance-core/src/cache/key.rs:270-287)

### Lines 288-304

finish consumes builder, finalizes BLAKE3, copies its first16 bytes into InternalCacheKey, discarding remaining hash bytes. Private write_variable appends one tag byte, encoded_len and payload in order. Digest collisions remain possible; no collision-resolution logical payload is retained here. (rust/lance-core/src/cache/key.rs:288-304)

### Lines 305-315

write_framed appends untagged8-byte length then bytes. encoded_len casts slice length to u64 and writes LE; it contains no checked conversion for a hypothetical wider-than64-bit usize. All current protocol fields must match exact UTF-8/raw payload bytes and order. (rust/lance-core/src/cache/key.rs:305-315)

### Lines 316-341

cfg(test) imports parent definitions, defines SCHEMA test.key/v1, builds namespace root.child(s3://bucket/dataset) and stable value type test.Value. key_with takes FnOnce(&mut KeyBuilder), writes fields and finishes. Fixed-size test asserts key16/namespace32/tag1 bytes. (rust/lance-core/src/cache/key.rs:316-341)

### Lines 342-355

Keyed-empty-hash fixture uses the32-byte key whats the Elvish word for friend and compares all32 bytes against92b2b75604ed3c761f9d6f62392c8a9227ad0ea3f09573e783f1498a4ed60d26. It is labeled official in source but no external vector was fetched. (rust/lance-core/src/cache/key.rs:342-355)

### Lines 356-397

A BTreeSet cardinality assertion distinguishes17 emitted sequences: ab+c versus a+bc strings; empty string/bytes/fixed bytes; six integer forms of1; both booleans; None/Some markers; variants0/1. Separate assertion distinguishes an explicit two-element sequence prefix from the same two u32 values without a sequence prefix. This checks examples, not injectivity of a finite digest or validation of caller grammar. (rust/lance-core/src/cache/key.rs:356-397)

### Lines 398-440

Domain-separation tests distinguish nested dataset/index from one dataset/index segment; stable value type, schema id and schema version changes; tenant-a versus tenant-b memory namespace; and same tenant memory versus persistent namespace. No path normalization or access-control assertion is made. (rust/lance-core/src/cache/key.rs:398-440)

### Lines 441-460

Little-endian test manually rebuilds a key preamble using the same framing helpers and a literal u32 payload04,03,02,01 after tag3; compares first16 reference hash bytes with KeyBuilder output. Shared helper use means it does not independently prove those helpers' framing. (rust/lance-core/src/cache/key.rs:441-460)

### Lines 461-476

Golden key fixture writes7u32,page string,Some marker,16 AB bytes under the test builder and expects c438ff22305530fc741638e97d45a568. This freezes the combined current protocol for one complete vector; no tests were run during extraction. (rust/lance-core/src/cache/key.rs:461-476)

## Interaction and interpretation limits

This is the local cache-key protocol, not a Lance data-file-format version. Its source explicitly describes stable framing and a cache identity rather than authentication. LanceCache namespace/type/schema selection is documented at rust/lance-core/src/cache/mod.rs:553-563; production persistence consumers remain pending. Tests are source evidence only, not executed. BLAKE3 dependency implementation is outside this file. (rust/lance-core/src/cache/key.rs:4-15; rust/lance-core/src/cache/key.rs:19-28; rust/lance-core/src/cache/key.rs:316-476)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Canonical fixed-size cache key construction.
    5 | //!
    6 | //! Cache keys are BLAKE3 digests truncated to 128 bits. Logical key fields are
    7 | //! encoded with explicit type tags, fixed-width little-endian integers, and
    8 | //! length framing for variable-width values. This makes the pre-hash encoding
    9 | //! unambiguous and stable across processes, platforms, and builds.
   10 | //!
   11 | //! The digest is a cache identity, not an authentication or access-control
   12 | //! primitive: namespace derivation keys are deterministic and not secret.
   13 | //! Truncating to 128 bits gives generic birthday resistance of approximately
   14 | //! 64 bits. This protocol does not introduce a FIPS mode; BLAKE3 is the
   15 | //! repository's selected cache-key algorithm.
   16 | 
   17 | use std::fmt;
   18 | 
   19 | /// Storage namespace identifier for canonical cache keys.
   20 | ///
   21 | /// Persistent backends should include this identifier in their physical
   22 | /// namespace so future algorithm or framing changes produce cold misses.
   23 | pub const CACHE_KEY_FORMAT: &str = "blake3-128-v1";
   24 | 
   25 | const KEY_FORMAT_VERSION: u32 = 1;
   26 | const NAMESPACE_CONTEXT: &str = "lance-format/lance 2026-07-17 cache namespace v1";
   27 | const NAMESPACE_DOMAIN: &[u8] = b"lance-cache-namespace\0";
   28 | const ENTRY_DOMAIN: &[u8] = b"lance-cache-entry\0";
   29 | 
   30 | /// One-byte type discriminants in the stable key encoding.
   31 | #[derive(Clone, Copy)]
   32 | #[repr(u8)]
   33 | enum FieldTag {
   34 |     U8 = 1,
   35 |     U16 = 2,
   36 |     U32 = 3,
   37 |     U64 = 4,
   38 |     I32 = 5,
   39 |     I64 = 6,
   40 |     Bool = 7,
   41 |     Str = 8,
   42 |     Bytes = 9,
   43 |     FixedBytes = 10,
   44 |     None = 11,
   45 |     Some = 12,
   46 |     Variant = 13,
   47 |     Sequence = 14,
   48 | }
   49 | 
   50 | impl FieldTag {
   51 |     const fn as_u8(self) -> u8 {
   52 |         self as u8
   53 |     }
   54 | }
   55 | 
   56 | /// Versioned schema identity for fields emitted by a cache key.
   57 | ///
   58 | /// Change the version whenever the encoded fields or their meaning changes.
   59 | /// The identifier must be stable and globally unique to the logical layout.
   60 | #[derive(Clone, Copy, Debug, Eq, PartialEq)]
   61 | pub struct CacheKeySchema {
   62 |     id: &'static str,
   63 |     version: u32,
   64 | }
   65 | 
   66 | impl CacheKeySchema {
   67 |     /// Compatibility schema used by the default string-key bridge.
   68 |     pub const LEGACY_TEXT: Self = Self::new("lance.cache.legacy-text", 1);
   69 | 
   70 |     /// Create a stable schema identifier and encoding version.
   71 |     pub const fn new(id: &'static str, version: u32) -> Self {
   72 |         Self { id, version }
   73 |     }
   74 | 
   75 |     /// Return the author-assigned schema identifier.
   76 |     pub const fn id(self) -> &'static str {
   77 |         self.id
   78 |     }
   79 | 
   80 |     /// Return the schema encoding version.
   81 |     pub const fn version(self) -> u32 {
   82 |         self.version
   83 |     }
   84 | }
   85 | 
   86 | /// Opaque 128-bit key passed to cache backends.
   87 | ///
   88 | /// The byte representation is canonical. It can be persisted directly and is
   89 | /// independent of the host's native integer endianness.
   90 | #[derive(Clone, Copy, Eq, Hash, Ord, PartialEq, PartialOrd)]
   91 | pub struct InternalCacheKey([u8; 16]);
   92 | 
   93 | impl InternalCacheKey {
   94 |     /// Reconstruct a key from its canonical bytes.
   95 |     pub const fn from_bytes(bytes: [u8; 16]) -> Self {
   96 |         Self(bytes)
   97 |     }
   98 | 
   99 |     /// Borrow the canonical byte representation.
  100 |     pub const fn as_bytes(&self) -> &[u8; 16] {
  101 |         &self.0
  102 |     }
  103 | 
  104 |     /// Consume the key and return its canonical bytes.
  105 |     pub const fn into_bytes(self) -> [u8; 16] {
  106 |         self.0
  107 |     }
  108 | }
  109 | 
  110 | impl fmt::Debug for InternalCacheKey {
  111 |     fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
  112 |         f.write_str("InternalCacheKey(")?;
  113 |         for byte in self.0 {
  114 |             write!(f, "{byte:02x}")?;
  115 |         }
  116 |         f.write_str(")")
  117 |     }
  118 | }
  119 | 
  120 | /// Pre-derived namespace key shared by entries in one logical cache scope.
  121 | #[derive(Clone, Copy, Debug)]
  122 | pub struct CacheNamespace([u8; 32]);
  123 | 
  124 | impl CacheNamespace {
  125 |     /// Construct the stable root namespace.
  126 |     pub fn root() -> Self {
  127 |         Self(blake3::derive_key(NAMESPACE_CONTEXT, b""))
  128 |     }
  129 | 
  130 |     /// Derive a child namespace from one framed hierarchy segment.
  131 |     pub fn child(self, segment: &str) -> Self {
  132 |         let mut hasher = blake3::Hasher::new_keyed(&self.0);
  133 |         write_framed(&mut hasher, NAMESPACE_DOMAIN);
  134 |         hasher.update(&KEY_FORMAT_VERSION.to_le_bytes());
  135 |         write_framed(&mut hasher, segment.as_bytes());
  136 |         Self(hasher.finalize().into())
  137 |     }
  138 | }
  139 | 
  140 | /// Streams typed logical fields into a canonical cache key.
  141 | ///
  142 | /// Integer methods use little-endian fixed-width encoding. Variable-width
  143 | /// strings and bytes are type-tagged and length-prefixed. There is deliberately
  144 | /// no `usize` method because cache identities must not depend on target width.
  145 | ///
  146 | /// # Examples
  147 | ///
  148 | /// ```
  149 | /// use lance_core::cache::{CacheKeySchema, CacheNamespace, KeyBuilder};
  150 | ///
  151 | /// let namespace = CacheNamespace::root().child("dataset");
  152 | /// let mut builder = KeyBuilder::new(
  153 | ///     namespace,
  154 | ///     "example.Page",
  155 | ///     CacheKeySchema::new("example.page-key", 1),
  156 | /// );
  157 | /// builder.write_u32(7);
  158 | /// builder.write_str("values");
  159 | /// let key = builder.finish();
  160 | /// assert_eq!(key.as_bytes().len(), 16);
  161 | /// ```
  162 | pub struct KeyBuilder {
  163 |     hasher: blake3::Hasher,
  164 | }
  165 | 
  166 | impl KeyBuilder {
  167 |     /// Start a key in a namespace with a stable value type and key schema.
  168 |     pub fn new(
  169 |         namespace: CacheNamespace,
  170 |         stable_type_id: &'static str,
  171 |         schema: CacheKeySchema,
  172 |     ) -> Self {
  173 |         let mut hasher = blake3::Hasher::new_keyed(&namespace.0);
  174 |         write_framed(&mut hasher, ENTRY_DOMAIN);
  175 |         hasher.update(&KEY_FORMAT_VERSION.to_le_bytes());
  176 |         write_framed(&mut hasher, stable_type_id.as_bytes());
  177 |         write_framed(&mut hasher, schema.id().as_bytes());
  178 |         hasher.update(&schema.version().to_le_bytes());
  179 |         Self { hasher }
  180 |     }
  181 | 
  182 |     /// Append a tagged, fixed-width `u8`.
  183 |     #[inline]
  184 |     pub fn write_u8(&mut self, value: u8) {
  185 |         self.hasher.update(&[FieldTag::U8.as_u8(), value]);
  186 |     }
  187 | 
  188 |     /// Append a tagged, little-endian `u16`.
  189 |     #[inline]
  190 |     pub fn write_u16(&mut self, value: u16) {
  191 |         let mut encoded = [0; 3];
  192 |         encoded[0] = FieldTag::U16.as_u8();
  193 |         encoded[1..].copy_from_slice(&value.to_le_bytes());
  194 |         self.hasher.update(&encoded);
  195 |     }
  196 | 
  197 |     /// Append a tagged, little-endian `u32`.
  198 |     #[inline]
  199 |     pub fn write_u32(&mut self, value: u32) {
  200 |         let mut encoded = [0; 5];
  201 |         encoded[0] = FieldTag::U32.as_u8();
  202 |         encoded[1..].copy_from_slice(&value.to_le_bytes());
  203 |         self.hasher.update(&encoded);
  204 |     }
  205 | 
  206 |     /// Append a tagged, little-endian `u64`.
  207 |     #[inline]
  208 |     pub fn write_u64(&mut self, value: u64) {
  209 |         let mut encoded = [0; 9];
  210 |         encoded[0] = FieldTag::U64.as_u8();
  211 |         encoded[1..].copy_from_slice(&value.to_le_bytes());
  212 |         self.hasher.update(&encoded);
  213 |     }
  214 | 
  215 |     /// Append a tagged, little-endian `i32`.
  216 |     #[inline]
  217 |     pub fn write_i32(&mut self, value: i32) {
  218 |         let mut encoded = [0; 5];
  219 |         encoded[0] = FieldTag::I32.as_u8();
  220 |         encoded[1..].copy_from_slice(&value.to_le_bytes());
  221 |         self.hasher.update(&encoded);
  222 |     }
  223 | 
  224 |     /// Append a tagged, little-endian `i64`.
  225 |     #[inline]
  226 |     pub fn write_i64(&mut self, value: i64) {
  227 |         let mut encoded = [0; 9];
  228 |         encoded[0] = FieldTag::I64.as_u8();
  229 |         encoded[1..].copy_from_slice(&value.to_le_bytes());
  230 |         self.hasher.update(&encoded);
  231 |     }
  232 | 
  233 |     /// Append a tagged boolean.
  234 |     #[inline]
  235 |     pub fn write_bool(&mut self, value: bool) {
  236 |         self.hasher
  237 |             .update(&[FieldTag::Bool.as_u8(), u8::from(value)]);
  238 |     }
  239 | 
  240 |     /// Append a tagged, length-prefixed UTF-8 string.
  241 |     #[inline]
  242 |     pub fn write_str(&mut self, value: &str) {
  243 |         self.write_variable(FieldTag::Str, value.as_bytes());
  244 |     }
  245 | 
  246 |     /// Append tagged, length-prefixed bytes.
  247 |     #[inline]
  248 |     pub fn write_bytes(&mut self, value: &[u8]) {
  249 |         self.write_variable(FieldTag::Bytes, value);
  250 |     }
  251 | 
  252 |     /// Append a tagged fixed-size byte array, including its length.
  253 |     #[inline]
  254 |     pub fn write_fixed_bytes<const N: usize>(&mut self, value: &[u8; N]) {
  255 |         self.write_variable(FieldTag::FixedBytes, value);
  256 |     }
  257 | 
  258 |     /// Append the canonical marker for an absent optional value.
  259 |     #[inline]
  260 |     pub fn write_none(&mut self) {
  261 |         self.hasher.update(&[FieldTag::None.as_u8()]);
  262 |     }
  263 | 
  264 |     /// Append the canonical marker for a present optional value.
  265 |     #[inline]
  266 |     pub fn write_some(&mut self) {
  267 |         self.hasher.update(&[FieldTag::Some.as_u8()]);
  268 |     }
  269 | 
  270 |     /// Append a tagged enum variant ordinal.
  271 |     #[inline]
  272 |     pub fn write_variant(&mut self, variant: u32) {
  273 |         let mut encoded = [0; 5];
  274 |         encoded[0] = FieldTag::Variant.as_u8();
  275 |         encoded[1..].copy_from_slice(&variant.to_le_bytes());
  276 |         self.hasher.update(&encoded);
  277 |     }
  278 | 
  279 |     /// Append the length of a following sequence.
  280 |     #[inline]
  281 |     pub fn write_sequence_len(&mut self, len: u64) {
  282 |         let mut encoded = [0; 9];
  283 |         encoded[0] = FieldTag::Sequence.as_u8();
  284 |         encoded[1..].copy_from_slice(&len.to_le_bytes());
  285 |         self.hasher.update(&encoded);
  286 |     }
  287 | 
  288 |     /// Finalize and return the canonical 128-bit key.
  289 |     #[inline]
  290 |     pub fn finish(self) -> InternalCacheKey {
  291 |         let hash = self.hasher.finalize();
  292 |         let mut bytes = [0; 16];
  293 |         bytes.copy_from_slice(&hash.as_bytes()[..16]);
  294 |         InternalCacheKey(bytes)
  295 |     }
  296 | 
  297 |     #[inline]
  298 |     fn write_variable(&mut self, tag: FieldTag, value: &[u8]) {
  299 |         self.hasher.update(&[tag.as_u8()]);
  300 |         self.hasher.update(&encoded_len(value));
  301 |         self.hasher.update(value);
  302 |     }
  303 | }
  304 | 
  305 | #[inline]
  306 | fn write_framed(hasher: &mut blake3::Hasher, value: &[u8]) {
  307 |     hasher.update(&encoded_len(value));
  308 |     hasher.update(value);
  309 | }
  310 | 
  311 | #[inline]
  312 | fn encoded_len(value: &[u8]) -> [u8; 8] {
  313 |     (value.len() as u64).to_le_bytes()
  314 | }
  315 | 
  316 | #[cfg(test)]
  317 | mod tests {
  318 |     use super::*;
  319 | 
  320 |     const SCHEMA: CacheKeySchema = CacheKeySchema::new("test.key", 1);
  321 | 
  322 |     fn builder() -> KeyBuilder {
  323 |         KeyBuilder::new(
  324 |             CacheNamespace::root().child("s3://bucket/dataset"),
  325 |             "test.Value",
  326 |             SCHEMA,
  327 |         )
  328 |     }
  329 | 
  330 |     fn key_with(write: impl FnOnce(&mut KeyBuilder)) -> InternalCacheKey {
  331 |         let mut key = builder();
  332 |         write(&mut key);
  333 |         key.finish()
  334 |     }
  335 | 
  336 |     #[test]
  337 |     fn key_and_namespace_have_fixed_sizes() {
  338 |         assert_eq!(std::mem::size_of::<InternalCacheKey>(), 16);
  339 |         assert_eq!(std::mem::size_of::<CacheNamespace>(), 32);
  340 |         assert_eq!(std::mem::size_of::<FieldTag>(), 1);
  341 |     }
  342 | 
  343 |     #[test]
  344 |     fn blake3_matches_official_empty_keyed_hash_vector() {
  345 |         let key = *b"whats the Elvish word for friend";
  346 |         assert_eq!(
  347 |             blake3::keyed_hash(&key, b"").as_bytes(),
  348 |             &[
  349 |                 0x92, 0xb2, 0xb7, 0x56, 0x04, 0xed, 0x3c, 0x76, 0x1f, 0x9d, 0x6f, 0x62, 0x39, 0x2c,
  350 |                 0x8a, 0x92, 0x27, 0xad, 0x0e, 0xa3, 0xf0, 0x95, 0x73, 0xe7, 0x83, 0xf1, 0x49, 0x8a,
  351 |                 0x4e, 0xd6, 0x0d, 0x26,
  352 |             ]
  353 |         );
  354 |     }
  355 | 
  356 |     #[test]
  357 |     fn typed_fields_and_boundaries_are_unambiguous() {
  358 |         let cases = [
  359 |             key_with(|key| {
  360 |                 key.write_str("ab");
  361 |                 key.write_str("c");
  362 |             }),
  363 |             key_with(|key| {
  364 |                 key.write_str("a");
  365 |                 key.write_str("bc");
  366 |             }),
  367 |             key_with(|key| key.write_str("")),
  368 |             key_with(|key| key.write_bytes(b"")),
  369 |             key_with(|key| key.write_fixed_bytes(b"")),
  370 |             key_with(|key| key.write_u8(1)),
  371 |             key_with(|key| key.write_u16(1)),
  372 |             key_with(|key| key.write_u32(1)),
  373 |             key_with(|key| key.write_u64(1)),
  374 |             key_with(|key| key.write_i32(1)),
  375 |             key_with(|key| key.write_i64(1)),
  376 |             key_with(|key| key.write_bool(false)),
  377 |             key_with(|key| key.write_bool(true)),
  378 |             key_with(KeyBuilder::write_none),
  379 |             key_with(KeyBuilder::write_some),
  380 |             key_with(|key| key.write_variant(0)),
  381 |             key_with(|key| key.write_variant(1)),
  382 |         ];
  383 |         assert_eq!(std::collections::BTreeSet::from(cases).len(), cases.len());
  384 | 
  385 |         assert_ne!(
  386 |             key_with(|key| {
  387 |                 key.write_sequence_len(2);
  388 |                 key.write_u32(1);
  389 |                 key.write_u32(2);
  390 |             }),
  391 |             key_with(|key| {
  392 |                 key.write_u32(1);
  393 |                 key.write_u32(2);
  394 |             })
  395 |         );
  396 |     }
  397 | 
  398 |     #[test]
  399 |     fn namespace_type_schema_and_version_are_domain_separated() {
  400 |         let root = CacheNamespace::root();
  401 |         let namespace = root.child("dataset").child("index");
  402 |         let nested = KeyBuilder::new(namespace, "test.Value", SCHEMA).finish();
  403 |         let combined = KeyBuilder::new(root.child("dataset/index"), "test.Value", SCHEMA).finish();
  404 |         assert_ne!(nested, combined);
  405 | 
  406 |         assert_ne!(
  407 |             nested,
  408 |             KeyBuilder::new(namespace, "test.OtherValue", SCHEMA).finish()
  409 |         );
  410 |         assert_ne!(
  411 |             nested,
  412 |             KeyBuilder::new(
  413 |                 namespace,
  414 |                 "test.Value",
  415 |                 CacheKeySchema::new("test.other-key", 1),
  416 |             )
  417 |             .finish()
  418 |         );
  419 |         assert_ne!(
  420 |             nested,
  421 |             KeyBuilder::new(namespace, "test.Value", CacheKeySchema::new("test.key", 2),).finish()
  422 |         );
  423 | 
  424 |         let tenant_a_memory =
  425 |             KeyBuilder::new(root.child("tenant-a").child("memory"), "test.Value", SCHEMA).finish();
  426 |         assert_ne!(
  427 |             tenant_a_memory,
  428 |             KeyBuilder::new(root.child("tenant-b").child("memory"), "test.Value", SCHEMA,).finish()
  429 |         );
  430 |         assert_ne!(
  431 |             tenant_a_memory,
  432 |             KeyBuilder::new(
  433 |                 root.child("tenant-a").child("persistent"),
  434 |                 "test.Value",
  435 |                 SCHEMA,
  436 |             )
  437 |             .finish()
  438 |         );
  439 |     }
  440 | 
  441 |     #[test]
  442 |     fn integers_use_fixed_width_little_endian_encoding() {
  443 |         let namespace = CacheNamespace::root().child("endianness");
  444 |         let mut key = KeyBuilder::new(namespace, "test.Value", SCHEMA);
  445 |         key.write_u32(0x0102_0304);
  446 |         let actual = key.finish();
  447 | 
  448 |         let mut reference = blake3::Hasher::new_keyed(&namespace.0);
  449 |         write_framed(&mut reference, ENTRY_DOMAIN);
  450 |         reference.update(&KEY_FORMAT_VERSION.to_le_bytes());
  451 |         write_framed(&mut reference, b"test.Value");
  452 |         write_framed(&mut reference, SCHEMA.id().as_bytes());
  453 |         reference.update(&SCHEMA.version().to_le_bytes());
  454 |         reference.update(&[FieldTag::U32.as_u8(), 0x04, 0x03, 0x02, 0x01]);
  455 |         let mut expected = [0; 16];
  456 |         expected.copy_from_slice(&reference.finalize().as_bytes()[..16]);
  457 | 
  458 |         assert_eq!(actual, InternalCacheKey::from_bytes(expected));
  459 |     }
  460 | 
  461 |     #[test]
  462 |     fn key_has_stable_golden_vector() {
  463 |         let mut key = builder();
  464 |         key.write_u32(7);
  465 |         key.write_str("page");
  466 |         key.write_some();
  467 |         key.write_fixed_bytes(&[0xAB; 16]);
  468 |         assert_eq!(
  469 |             key.finish().into_bytes(),
  470 |             [
  471 |                 0xc4, 0x38, 0xff, 0x22, 0x30, 0x55, 0x30, 0xfc, 0x74, 0x16, 0x38, 0xe9, 0x7d, 0x45,
  472 |                 0xa5, 0x68,
  473 |             ]
  474 |         );
  475 |     }
  476 | }
``````
