> **V2.1 navigation and contract layer.** Source reading is permitted. Production contracts retained from iteration 85 remain valid at the recorded snapshot. Historical line-count/test-coverage statements are provenance, not completeness requirements. Use [V2.1 protocol](../V21-PROTOCOL.md) and CORE-MANIFEST.json for current scope.

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

# Core cache protocol and extension seams

**Cross-subsystem contract/navigation coverage is pending.** All nine cache source files are analyzed, including the LanceCache facade and public export routing. The benchmark and allocation test are analyzed below; production value codecs and dataset/session consumers remain pending.

[Core](rust-lance-core.md) · [Keys](../L2-files/rust/lance-core/src/cache/key.rs.md) · [Backend trait](../L2-files/rust/lance-core/src/cache/backend.rs.md) · [URI](../L2-files/rust/lance-core/src/cache/backend_uri.rs.md) · [Registry](../L2-files/rust/lance-core/src/cache/registry.rs.md) · [Format](../L3-symbols/format-spec.md)

## Architecture and ownership

The low-level trait stores Arc<dyn Any+Send+Sync> under16-byte InternalCacheKey. It delegates logical-key construction/type safety to LanceCache. Optional codecs allow persistence only for serializable entries; None requires memory retention. The wrapper and its typed adapters are covered below; production type-specific bodies are still pending; typed downcasts and Moka/Quick wrappers are covered below. (rust/lance-core/src/cache/backend.rs:45-146)

The configuration path is synchronous: build_from_uri -> parse_backend_uri -> build_from_config -> chosen BackendBuildFn. A process-global OnceLock holds a mutex map of constructor function pointers; options are owned string maps cloned before dispatch. Construction happens after the registry guard is released. (rust/lance-core/src/cache/backend_uri.rs:51-54; rust/lance-core/src/cache/registry.rs:80-95; rust/lance-core/src/cache/registry.rs:153-171)

## Key identity

Root namespace is deterministic32-byte BLAKE3 derive_key output for a fixed context and empty material. Each child hashes one framed segment under the parent's keyed hash; nested dataset/index differs from a single dataset/index segment. Entry key hashes the entry domain, key-format version, stable value-type id, logical-key schema id/version, then typed fields, retaining the first16 digest bytes. Namespace32/key16 are asserted locally. (rust/lance-core/src/cache/key.rs:19-28; rust/lance-core/src/cache/key.rs:124-179; rust/lance-core/src/cache/key.rs:288-314; rust/lance-core/src/cache/key.rs:336-341; rust/lance-core/src/cache/key.rs:398-404)

CacheKeySchema::new does not enforce nonempty/unique ids or positive versions. Option/sequence/variant writers emit markers and counts without validating grammar or ordinals; callers must keep their logical schema unambiguous and update version when meanings change. No usize writer exists. Stable framing is a local cache protocol contract; it is not a data-file format version or an authentication boundary. (rust/lance-core/src/cache/key.rs:4-15; rust/lance-core/src/cache/key.rs:56-84; rust/lance-core/src/cache/key.rs:140-144; rust/lance-core/src/cache/key.rs:252-287)

## Backend contract

get is Option-only, insert returns unit, and get_or_insert accepts a pinned boxed Send future producing Result<(entry,size)> and returns Result<(entry,was_cached)>. Docs request concurrent-load deduplication except for disabled caches. Counts/bytes may flush pending work; approximate defaults0 can mean unavailable; capacity None can mean unknown. A custom deep traversal should include key footprints and reuse a Context to avoid counting shared buffers twice, falling back to declared entry weights for unregistered types. The interface requirements are compared with the concrete wrappers below; dependency internals remain outside reviewed source. (rust/lance-core/src/cache/backend.rs:126-215)

Physical persistence must namespace keys with blake3-128-v1 and store canonical16 bytes; one-way digests provide neither prefix invalidation nor inventory. Migration docs offer shared-backend clear or versioned namespace rotation. Rotation leaves old entries to age out rather than reclaiming them immediately. (rust/lance-core/src/cache/backend.rs:11-31; rust/lance-core/src/cache/key.rs:19-23)

## Configuration and registry behavior

Kind syntax is ASCII letter then zero or more ASCII alphanumeric/plus/minus/dot, lowercased without trimming. Config fields remain public; dispatch repeats validation to handle direct struct construction. with_option silently replaces same-key entries; URI query duplicates instead return InvalidInput after percent decoding. (rust/lance-core/src/cache/registry.rs:24-78; rust/lance-core/src/cache/registry.rs:153-159; rust/lance-core/src/cache/backend_uri.rs:70-104)

The URI parser splits first colon, then first question mark, strips exactly one initial// from hierarchy and stores nonempty remainder as path. Host:port/path remains intact; paths are not percent-decoded;# has no fragment role. Query skips empty ampersand-separated pairs and splits each at first=. Empty key/value are allowed. Percent escapes must decode to valid UTF-8; plus stays literal. A query path conflicts with a nonempty hierarchy path. Error messages may include the full supplied URI, including query values. (rust/lance-core/src/cache/backend_uri.rs:59-171)

Built-in discovery only recognizes MOKA_BACKEND_KIND; local docs/tests identify this as moka, and the constant and constructor are now analyzed below at rust/lance-core/src/cache/moka.rs:327-376. register_backend permits replacement for built-ins and rejects other duplicates. ensure_builtin_backends inserts only missing defaults on every dispatch, preserving overrides; it runs before requested-kind validation. Registry poison becomes Internal error; test locks recover inner state without clearing poison. Constructor errors pass through directly. (rust/lance-core/src/cache/registry.rs:91-109; rust/lance-core/src/cache/registry.rs:126-193; rust/lance-core/src/cache/registry.rs:314-319)

## Exact declarations (source visibility)

Signatures include opening braces for methods with bodies; complete bodies and private symbols are retained in linked L2/L3. Trait lifetime and generic bounds below are literal source declarations.

| Name | Declaration | Evidence |
|---|---|---|
| <key::InternalCacheKey as fmt::Debug>::<implementation> | `impl fmt::Debug for InternalCacheKey {` | rust/lance-core/src/cache/key.rs:110-110 |
| <key::InternalCacheKey as fmt::Debug>::fmt | `fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {` | rust/lance-core/src/cache/key.rs:111-111 |
| backend_uri::build_from_uri | `pub fn build_from_uri(uri: &str) -> Result<Arc<dyn CacheBackend>> {` | rust/lance-core/src/cache/backend_uri.rs:51-51 |
| backend_uri::parse_backend_uri | `pub fn parse_backend_uri(uri: &str) -> Result<BackendConfig> {` | rust/lance-core/src/cache/backend_uri.rs:59-59 |
| backend::CacheBackend | `pub trait CacheBackend: Send + Sync + std::fmt::Debug {` | rust/lance-core/src/cache/backend.rs:69-69 |
| backend::CacheBackend::approx_num_entries | `fn approx_num_entries(&self) -> usize {` | rust/lance-core/src/cache/backend.rs:176-176 |
| backend::CacheBackend::approx_size_bytes | `fn approx_size_bytes(&self) -> usize {` | rust/lance-core/src/cache/backend.rs:186-186 |
| backend::CacheBackend::capacity_bytes | `fn capacity_bytes(&self) -> Option<usize> {` | rust/lance-core/src/cache/backend.rs:193-193 |
| backend::CacheBackend::clear | `async fn clear(&self);` | rust/lance-core/src/cache/backend.rs:166-166 |
| backend::CacheBackend::deep_size_of_entries | `fn deep_size_of_entries(         &self,         _context: &mut Context,         _size_of_entry: &dyn Fn(&CacheEntry, &mut Context) -> Option<usize>,     ) -> Option<usize> {` | rust/lance-core/src/cache/backend.rs:208-212 |
| backend::CacheBackend::get | `async fn get(&self, key: &InternalCacheKey, codec: Option<CacheCodec>) -> Option<CacheEntry>;` | rust/lance-core/src/cache/backend.rs:135-135 |
| backend::CacheBackend::get_or_insert | `async fn get_or_insert<'a>(         &self,         key: &InternalCacheKey,         loader: Pin<Box<dyn Future<Output = Result<(CacheEntry, usize)>> + Send + 'a>>,         codec: Option<CacheCodec>,     ) -> Result<(CacheEntry, bool)>;` | rust/lance-core/src/cache/backend.rs:158-163 |
| backend::CacheBackend::insert | `async fn insert(         &self,         key: &InternalCacheKey,         entry: CacheEntry,         size_bytes: usize,         codec: Option<CacheCodec>,     );` | rust/lance-core/src/cache/backend.rs:140-146 |
| backend::CacheBackend::num_entries | `async fn num_entries(&self) -> usize;` | rust/lance-core/src/cache/backend.rs:169-169 |
| backend::CacheBackend::size_bytes | `async fn size_bytes(&self) -> usize;` | rust/lance-core/src/cache/backend.rs:172-172 |
| backend::CacheEntry | `pub type CacheEntry = Arc<dyn Any + Send + Sync>;` | rust/lance-core/src/cache/backend.rs:46-46 |
| key::CACHE_KEY_FORMAT | `pub const CACHE_KEY_FORMAT: &str = "blake3-128-v1";` | rust/lance-core/src/cache/key.rs:23-23 |
| key::CacheKeySchema | `pub struct CacheKeySchema {` | rust/lance-core/src/cache/key.rs:61-61 |
| key::CacheKeySchema::<implementation> | `impl CacheKeySchema {` | rust/lance-core/src/cache/key.rs:66-66 |
| key::CacheKeySchema::id | `pub const fn id(self) -> &'static str {` | rust/lance-core/src/cache/key.rs:76-76 |
| key::CacheKeySchema::LEGACY_TEXT | `pub const LEGACY_TEXT: Self = Self::new("lance.cache.legacy-text", 1);` | rust/lance-core/src/cache/key.rs:68-68 |
| key::CacheKeySchema::new | `pub const fn new(id: &'static str, version: u32) -> Self {` | rust/lance-core/src/cache/key.rs:71-71 |
| key::CacheKeySchema::version | `pub const fn version(self) -> u32 {` | rust/lance-core/src/cache/key.rs:81-81 |
| key::CacheNamespace | `pub struct CacheNamespace([u8; 32]);` | rust/lance-core/src/cache/key.rs:122-122 |
| key::CacheNamespace::<implementation> | `impl CacheNamespace {` | rust/lance-core/src/cache/key.rs:124-124 |
| key::CacheNamespace::child | `pub fn child(self, segment: &str) -> Self {` | rust/lance-core/src/cache/key.rs:131-131 |
| key::CacheNamespace::root | `pub fn root() -> Self {` | rust/lance-core/src/cache/key.rs:126-126 |
| key::InternalCacheKey | `pub struct InternalCacheKey([u8; 16]);` | rust/lance-core/src/cache/key.rs:91-91 |
| key::InternalCacheKey::<implementation> | `impl InternalCacheKey {` | rust/lance-core/src/cache/key.rs:93-93 |
| key::InternalCacheKey::as_bytes | `pub const fn as_bytes(&self) -> &[u8; 16] {` | rust/lance-core/src/cache/key.rs:100-100 |
| key::InternalCacheKey::from_bytes | `pub const fn from_bytes(bytes: [u8; 16]) -> Self {` | rust/lance-core/src/cache/key.rs:95-95 |
| key::InternalCacheKey::into_bytes | `pub const fn into_bytes(self) -> [u8; 16] {` | rust/lance-core/src/cache/key.rs:105-105 |
| key::KeyBuilder | `pub struct KeyBuilder {` | rust/lance-core/src/cache/key.rs:162-162 |
| key::KeyBuilder::<implementation> | `impl KeyBuilder {` | rust/lance-core/src/cache/key.rs:166-166 |
| key::KeyBuilder::finish | `pub fn finish(self) -> InternalCacheKey {` | rust/lance-core/src/cache/key.rs:290-290 |
| key::KeyBuilder::new | `pub fn new(         namespace: CacheNamespace,         stable_type_id: &'static str,         schema: CacheKeySchema,     ) -> Self {` | rust/lance-core/src/cache/key.rs:168-172 |
| key::KeyBuilder::write_bool | `pub fn write_bool(&mut self, value: bool) {` | rust/lance-core/src/cache/key.rs:235-235 |
| key::KeyBuilder::write_bytes | `pub fn write_bytes(&mut self, value: &[u8]) {` | rust/lance-core/src/cache/key.rs:248-248 |
| key::KeyBuilder::write_fixed_bytes | `pub fn write_fixed_bytes<const N: usize>(&mut self, value: &[u8; N]) {` | rust/lance-core/src/cache/key.rs:254-254 |
| key::KeyBuilder::write_i32 | `pub fn write_i32(&mut self, value: i32) {` | rust/lance-core/src/cache/key.rs:217-217 |
| key::KeyBuilder::write_i64 | `pub fn write_i64(&mut self, value: i64) {` | rust/lance-core/src/cache/key.rs:226-226 |
| key::KeyBuilder::write_none | `pub fn write_none(&mut self) {` | rust/lance-core/src/cache/key.rs:260-260 |
| key::KeyBuilder::write_sequence_len | `pub fn write_sequence_len(&mut self, len: u64) {` | rust/lance-core/src/cache/key.rs:281-281 |
| key::KeyBuilder::write_some | `pub fn write_some(&mut self) {` | rust/lance-core/src/cache/key.rs:266-266 |
| key::KeyBuilder::write_str | `pub fn write_str(&mut self, value: &str) {` | rust/lance-core/src/cache/key.rs:242-242 |
| key::KeyBuilder::write_u16 | `pub fn write_u16(&mut self, value: u16) {` | rust/lance-core/src/cache/key.rs:190-190 |
| key::KeyBuilder::write_u32 | `pub fn write_u32(&mut self, value: u32) {` | rust/lance-core/src/cache/key.rs:199-199 |
| key::KeyBuilder::write_u64 | `pub fn write_u64(&mut self, value: u64) {` | rust/lance-core/src/cache/key.rs:208-208 |
| key::KeyBuilder::write_u8 | `pub fn write_u8(&mut self, value: u8) {` | rust/lance-core/src/cache/key.rs:184-184 |
| key::KeyBuilder::write_variant | `pub fn write_variant(&mut self, variant: u32) {` | rust/lance-core/src/cache/key.rs:272-272 |
| registry::BackendBuildFn | `pub type BackendBuildFn = fn(&BackendConfig) -> Result<Arc<dyn CacheBackend>>;` | rust/lance-core/src/cache/registry.rs:84-84 |
| registry::BackendConfig | `pub struct BackendConfig {` | rust/lance-core/src/cache/registry.rs:29-29 |
| registry::BackendConfig::<implementation> | `impl BackendConfig {` | rust/lance-core/src/cache/registry.rs:36-36 |
| registry::BackendConfig::kind | `pub kind: String,` | rust/lance-core/src/cache/registry.rs:31-31 |
| registry::BackendConfig::new | `pub fn new(kind: impl AsRef<str>) -> Result<Self> {` | rust/lance-core/src/cache/registry.rs:38-38 |
| registry::BackendConfig::options | `pub options: HashMap<String, String>,` | rust/lance-core/src/cache/registry.rs:33-33 |
| registry::BackendConfig::with_option | `pub fn with_option(mut self, key: impl Into<String>, value: impl Into<String>) -> Self {` | rust/lance-core/src/cache/registry.rs:46-46 |
| registry::build_from_config | `pub fn build_from_config(config: &BackendConfig) -> Result<Arc<dyn CacheBackend>> {` | rust/lance-core/src/cache/registry.rs:153-153 |
| registry::normalize_backend_kind | `pub fn normalize_backend_kind(kind: &str) -> Result<String> {` | rust/lance-core/src/cache/registry.rs:57-57 |
| registry::register_backend | `pub fn register_backend(kind: &str, build: BackendBuildFn) -> Result<()> {` | rust/lance-core/src/cache/registry.rs:126-126 |

## Validation and remaining risks

Source tests cover17 distinct typed field sequences, hierarchical/type/schema/version separation, a manual u32 endian vector and the combined golden digest; no tests were run. Parser fixtures cover basic paths, lowercase schemes, literal plus, trailing separator and selected errors, but omit malformed percent/UTF-8, path conflict and decoded duplicate names. Registry tests cover custom construction, duplicates, built-in override, normalization and option forwarding; their Arc count checks alone do not prove which concrete backend was built in the override case. Poison/reentrant/concurrent replacement behavior lacks dedicated tests here. (rust/lance-core/src/cache/key.rs:356-476; rust/lance-core/src/cache/backend_uri.rs:173-265; rust/lance-core/src/cache/registry.rs:295-372)

The local typed cache lifecycle is now documented below. Production body codecs, dependency-level deduplication/cancellation/eviction algorithms, physical memory bounds, binding integration and whole-repository caller graph remain acceptance gaps. The wrapper envelope and its lack of checksum are documented below.

## Codec wrapper and body IO

[Codec evidence](../L2-files/rust/lance-core/src/cache/codec.rs.md) · [Entry IO evidence](../L2-files/rust/lance-core/src/cache/entry_io.rs.md). A Copy codec descriptor holds static type id,u32 version and two plain function pointers. from_impl binds concrete CacheCodecImpl callbacks; serialization downcasts with expect and can panic for the wrong erased type. Custom new adapters are accepted without checking type coherence. Deserializing through a typed adapter allocates Arc<T>. (rust/lance-core/src/cache/codec.rs:280-383)

Serialize writes LCE1 envelope first then invokes body writer with absolute entry position; failures can leave partial output. Decode checks framing, exact type id, then input version<=current version before calling body decoder. InvalidEnvelope/TypeMismatch/VersionTooNew/BodyError all become Miss; success becomes Hit without EOF or type revalidation. No panic catch, checksum or authentication exists here. Backend eviction/recomputation is documented intent, not executed by this wrapper. (rust/lance-core/src/cache/codec.rs:120-138; rust/lance-core/src/cache/codec.rs:144-175; rust/lance-core/src/cache/codec.rs:415-524)

The outer envelope is called stabilized and stability-critical, while CacheCodecImpl docs explicitly call its serialized format experimental, describe future stability rules, and also say TYPE_ID must not change once shipped. These statements do not establish a latest-released stable contract by themselves. Existing synthetic old-shape rejection tests are recorded as current source; they do not authorize designing migrations for earlier unstable revisions. (rust/lance-core/src/cache/codec.rs:22-36; rust/lance-core/src/cache/codec.rs:51-60; rust/lance-core/src/cache/codec.rs:202-270; rust/lance-core/src/cache/codec.rs:613-630; AGENTS.md:7-18)

Body writer tracks absolute offset for IPC64-byte alignment, buffers each protobuf header using encode_to_vec, and streams other operations through supplied Write/delegated helpers. raw_writer does not advance position and must not interleave with aligned IPC. Reader stores unchecked offset/version; read_header performs checked prefix/payload bounds and advances only after successful decode; body() slices without advancing and can panic if public new was given invalid offset. IPC/raw implementations delegate to lance_arrow and still need exact algorithm/zero-copy verification. All-read-zero-copy prose does not mean allocation-free protobuf decoding or an allocation-free Vec<RecordBatch> result. (rust/lance-core/src/cache/entry_io.rs:28-114; rust/lance-core/src/cache/entry_io.rs:117-202)

| Name | Exact declaration | Evidence |
|---|---|---|
| <codec::CacheCodec as std::fmt::Debug>::<implementation> | `impl std::fmt::Debug for CacheCodec {` | rust/lance-core/src/cache/codec.rs:310-310 |
| <codec::CacheCodec as std::fmt::Debug>::fmt | `fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {` | rust/lance-core/src/cache/codec.rs:311-311 |
| codec::CacheCodec | `pub struct CacheCodec {` | rust/lance-core/src/cache/codec.rs:299-299 |
| codec::CacheCodec::<implementation> | `impl CacheCodec {` | rust/lance-core/src/cache/codec.rs:336-336 |
| codec::CacheCodec::deserialize | `pub fn deserialize(&self, data: &Bytes) -> CacheDecode<ArcAny> {` | rust/lance-core/src/cache/codec.rs:484-484 |
| codec::CacheCodec::from_impl | `pub fn from_impl<T: CacheCodecImpl + 'static>() -> Self {` | rust/lance-core/src/cache/codec.rs:362-362 |
| codec::CacheCodec::new | `pub fn new(         type_id: &'static str,         version: u32,         serialize_body: fn(&ArcAny, &mut CacheEntryWriter<'_>) -> Result<()>,         deserialize_body: fn(&mut CacheEntryReader<'_>) -> Result<ArcAny>,     ) -> Self {` | rust/lance-core/src/cache/codec.rs:343-348 |
| codec::CacheCodec::serialize | `pub fn serialize(&self, value: &ArcAny, writer: &mut dyn Write) -> Result<()> {` | rust/lance-core/src/cache/codec.rs:416-416 |
| codec::CacheCodec::type_id | `pub const fn type_id(&self) -> &'static str {` | rust/lance-core/src/cache/codec.rs:411-411 |
| codec::CacheCodecImpl | `pub trait CacheCodecImpl: Send + Sync {` | rust/lance-core/src/cache/codec.rs:220-220 |
| codec::CacheCodecImpl::CURRENT_VERSION | `const CURRENT_VERSION: u32;` | rust/lance-core/src/cache/codec.rs:263-263 |
| codec::CacheCodecImpl::deserialize | `fn deserialize(reader: &mut CacheEntryReader<'_>) -> Result<Self>     where         Self: Sized;` | rust/lance-core/src/cache/codec.rs:271-273 |
| codec::CacheCodecImpl::serialize | `fn serialize(&self, writer: &mut CacheEntryWriter<'_>) -> Result<()>;` | rust/lance-core/src/cache/codec.rs:266-266 |
| codec::CacheCodecImpl::TYPE_ID | `const TYPE_ID: &'static str;` | rust/lance-core/src/cache/codec.rs:258-258 |
| codec::CacheDecode | `pub enum CacheDecode<T> {` | rust/lance-core/src/cache/codec.rs:173-173 |
| codec::CacheDecode::<implementation> | `impl<T> CacheDecode<T> {` | rust/lance-core/src/cache/codec.rs:178-178 |
| codec::CacheDecode::hit | `pub fn hit(self) -> Option<T> {` | rust/lance-core/src/cache/codec.rs:179-179 |
| codec::CacheDecode::Hit | `Hit(T),` | rust/lance-core/src/cache/codec.rs:174-174 |
| codec::CacheDecode::Miss | `Miss(CacheMissReason),` | rust/lance-core/src/cache/codec.rs:175-175 |
| codec::CacheMissReason | `pub enum CacheMissReason {` | rust/lance-core/src/cache/codec.rs:151-151 |
| codec::CacheMissReason::BodyError | `BodyError,` | rust/lance-core/src/cache/codec.rs:164-164 |
| codec::CacheMissReason::InvalidEnvelope | `InvalidEnvelope,` | rust/lance-core/src/cache/codec.rs:155-155 |
| codec::CacheMissReason::TypeMismatch | `TypeMismatch,` | rust/lance-core/src/cache/codec.rs:158-158 |
| codec::CacheMissReason::VersionTooNew | `VersionTooNew,` | rust/lance-core/src/cache/codec.rs:161-161 |
| codec::has_cache_envelope | `pub fn has_cache_envelope(data: &[u8]) -> bool {` | rust/lance-core/src/cache/codec.rs:68-68 |
| codec::MAGIC | `pub const MAGIC: [u8; 4] = *b"LCE1";` | rust/lance-core/src/cache/codec.rs:60-60 |
| entry_io::CacheEntryReader | `pub struct CacheEntryReader<'a> {` | rust/lance-core/src/cache/entry_io.rs:122-122 |
| entry_io::CacheEntryReader::<implementation> | `impl<'a> CacheEntryReader<'a> {` | rust/lance-core/src/cache/entry_io.rs:128-128 |
| entry_io::CacheEntryReader::body | `pub fn body(&self) -> Bytes {` | rust/lance-core/src/cache/entry_io.rs:199-199 |
| entry_io::CacheEntryReader::new | `pub fn new(data: &'a Bytes, offset: usize, version: u32) -> Self {` | rust/lance-core/src/cache/entry_io.rs:131-131 |
| entry_io::CacheEntryReader::read_header | `pub fn read_header<P: Message + Default>(&mut self) -> Result<P> {` | rust/lance-core/src/cache/entry_io.rs:155-155 |
| entry_io::CacheEntryReader::read_ipc | `pub fn read_ipc(&mut self) -> Result<RecordBatch> {` | rust/lance-core/src/cache/entry_io.rs:174-174 |
| entry_io::CacheEntryReader::read_ipc_batches | `pub fn read_ipc_batches(&mut self) -> Result<Vec<RecordBatch>> {` | rust/lance-core/src/cache/entry_io.rs:181-181 |
| entry_io::CacheEntryReader::read_raw | `pub fn read_raw(&mut self) -> Result<Bytes> {` | rust/lance-core/src/cache/entry_io.rs:187-187 |
| entry_io::CacheEntryReader::read_u8 | `pub fn read_u8(&mut self) -> Result<u8> {` | rust/lance-core/src/cache/entry_io.rs:145-145 |
| entry_io::CacheEntryReader::version | `pub fn version(&self) -> u32 {` | rust/lance-core/src/cache/entry_io.rs:140-140 |
| entry_io::CacheEntryWriter | `pub struct CacheEntryWriter<'a> {` | rust/lance-core/src/cache/entry_io.rs:34-34 |
| entry_io::CacheEntryWriter::<implementation> | `impl<'a> CacheEntryWriter<'a> {` | rust/lance-core/src/cache/entry_io.rs:40-40 |
| entry_io::CacheEntryWriter::new | `pub fn new(writer: &'a mut dyn Write) -> Self {` | rust/lance-core/src/cache/entry_io.rs:45-45 |
| entry_io::CacheEntryWriter::raw_writer | `pub fn raw_writer(&mut self) -> &mut dyn Write {` | rust/lance-core/src/cache/entry_io.rs:112-112 |
| entry_io::CacheEntryWriter::write_header | `pub fn write_header<P: Message>(&mut self, header: &P) -> Result<()> {` | rust/lance-core/src/cache/entry_io.rs:63-63 |
| entry_io::CacheEntryWriter::write_ipc | `pub fn write_ipc(&mut self, batch: &RecordBatch) -> Result<()> {` | rust/lance-core/src/cache/entry_io.rs:74-74 |
| entry_io::CacheEntryWriter::write_ipc_batches | `pub fn write_ipc_batches<I>(&mut self, batches: I) -> Result<()>     where         I: IntoIterator<Item = RecordBatch>,     {` | rust/lance-core/src/cache/entry_io.rs:81-84 |
| entry_io::CacheEntryWriter::write_raw | `pub fn write_raw(&mut self, bytes: &[u8]) -> Result<()> {` | rust/lance-core/src/cache/entry_io.rs:93-93 |
| entry_io::CacheEntryWriter::write_u8 | `pub fn write_u8(&mut self, value: u8) -> Result<()> {` | rust/lance-core/src/cache/entry_io.rs:56-56 |

Tests cover wrapper hit and four miss categories plus selected truncations; direct reader-version7 test bypasses the version1 codec gate. IO tests cover tag/header/raw, invalid header framing/varint,13-byte prefix alignment, two IPC batches and mixed-section sequencing. No runtime test results, invalid UTF-8 envelope coverage, writer-failure recovery, trailing-byte rejection or zero-copy pointer assertions are claimed. (rust/lance-core/src/cache/codec.rs:584-792; rust/lance-core/src/cache/entry_io.rs:230-392)

## Concrete memory backends

[Moka](../L2-files/rust/lance-core/src/cache/moka.rs.md) and [Quick](../L2-files/rust/lance-core/src/cache/quick.rs.md) both ignore optional codecs, store erased Arc entries plus declared weights and include16-byte key footprint in eviction accounting. Neither performs disk serialization. Their shared-Context traversal counts key plus callback-estimated value, falling back to declared bytes; it excludes explicit backend metadata and need not represent an atomic concurrent snapshot. (rust/lance-core/src/cache/moka.rs:18-32; rust/lance-core/src/cache/moka.rs:106-211; rust/lance-core/src/cache/quick.rs:22-36; rust/lance-core/src/cache/quick.rs:207-379)

| Property | Moka wrapper | Quick wrapper | Evidence |
|---|---|---|---|
| Entry weight | ceil(saturating(16+declared)/unit), cappedu32 | saturating(16+declared), max1, castu64 | rust/lance-core/src/cache/moka.rs:25-47; rust/lance-core/src/cache/quick.rs:31-36 |
| Budget | unit=max(ceil(cap/u32::MAX),1), internal cap=ceil(cap/unit) | independent shard shares; actual admission delegated | rust/lance-core/src/cache/moka.rs:38-81; rust/lance-core/src/cache/quick.rs:107-194 |
| Miss loader | nonzero try_get_with; per-call flag identifies whether this initializer ran | async value-or-guard; guard owner runs loader | rust/lance-core/src/cache/moka.rs:134-165; rust/lance-core/src/cache/quick.rs:263-296 |
| Failure | unwrap unique error or selectively clone shared CloneableError | return own loader error and drop guard; contender may retry | rust/lance-core/src/cache/moka.rs:149-164; rust/lance-core/src/cache/quick.rs:280-293; rust/lance-core/src/cache/quick.rs:727-779 |
| Zero capacity | direct independent loader branch for both constructors | no local special branch; dependency guard behavior applies | rust/lance-core/src/cache/moka.rs:140-143; rust/lance-core/src/cache/quick.rs:263-296 |
| Exact-ish count/weight query | await pending tasks then report; weight rounded | synchronous len/weight through async method | rust/lance-core/src/cache/moka.rs:167-194; rust/lance-core/src/cache/quick.rs:298-349 |

Moka coarse-unit capacity can round upward and saturated per-entry weights are not exact byte accounting. capacity_bytes reports requested capacity, not guaranteed resident heap or even an unsaturated raw payload bound. Quick's Single policy avoids inter-shard fragmentation but retains admission cutoff and eviction. Source tests show970-byte weight accepted and971 rejected at one-shard1000-byte budget; the approximately97% rule comes from dependency defaults as documented here. (rust/lance-core/src/cache/moka.rs:34-47; rust/lance-core/src/cache/moka.rs:67-103; rust/lance-core/src/cache/moka.rs:182-184; rust/lance-core/src/cache/quick.rs:107-112; rust/lance-core/src/cache/quick.rs:702-725)

Quick Recommended picks max(1,min(floor(capacity/4GiB),floor(available_parallelism/2))), rounds down to a power of two and clamps at1024; available_parallelism errors use2. A cache below4GiB still uses one shard. Estimated item count is clamp(capacity/64KiB,shards*32,1000000), separately from eviction bytes. No environment override, arbitrary public shard-count constructor or registry kind is defined by quick.rs. (rust/lance-core/src/cache/quick.rs:67-205)

Built-in registry kind is exactly moka. Its only accepted option is nonempty capacity parsed as usize without trimming or unit-suffix conversion. Missing, malformed or unknown options return InvalidInput; capacity0 is accepted. A URI hierarchy creates path and is therefore rejected by this constructor. No default capacity exists at this registry boundary. (rust/lance-core/src/cache/moka.rs:327-376; rust/lance-core/src/cache/backend_uri.rs:59-68)

## Backend exact declarations (source visibility)

| Name | Declaration | Evidence |
|---|---|---|
| <moka::MokaCacheBackend as CacheBackend>::<implementation> | `impl CacheBackend for MokaCacheBackend {` | rust/lance-core/src/cache/moka.rs:107-107 |
| <moka::MokaCacheBackend as CacheBackend>::approx_num_entries | `fn approx_num_entries(&self) -> usize {` | rust/lance-core/src/cache/moka.rs:186-186 |
| <moka::MokaCacheBackend as CacheBackend>::approx_size_bytes | `fn approx_size_bytes(&self) -> usize {` | rust/lance-core/src/cache/moka.rs:190-190 |
| <moka::MokaCacheBackend as CacheBackend>::capacity_bytes | `fn capacity_bytes(&self) -> Option<usize> {` | rust/lance-core/src/cache/moka.rs:182-182 |
| <moka::MokaCacheBackend as CacheBackend>::clear | `async fn clear(&self) {` | rust/lance-core/src/cache/moka.rs:167-167 |
| <moka::MokaCacheBackend as CacheBackend>::deep_size_of_entries | `fn deep_size_of_entries(         &self,         context: &mut Context,         size_of_entry: &dyn Fn(&CacheEntry, &mut Context) -> Option<usize>,     ) -> Option<usize> {` | rust/lance-core/src/cache/moka.rs:196-200 |
| <moka::MokaCacheBackend as CacheBackend>::get | `async fn get(&self, key: &InternalCacheKey, _codec: Option<CacheCodec>) -> Option<CacheEntry> {` | rust/lance-core/src/cache/moka.rs:118-118 |
| <moka::MokaCacheBackend as CacheBackend>::get_or_insert | `async fn get_or_insert<'a>(         &self,         key: &InternalCacheKey,         loader: Pin<Box<dyn Future<Output = Result<(CacheEntry, usize)>> + Send + 'a>>,         _codec: Option<CacheCodec>,     ) -> Result<(CacheEntry, bool)> {` | rust/lance-core/src/cache/moka.rs:134-139 |
| <moka::MokaCacheBackend as CacheBackend>::insert | `async fn insert(         &self,         key: &InternalCacheKey,         entry: CacheEntry,         size_bytes: usize,         _codec: Option<CacheCodec>,     ) {` | rust/lance-core/src/cache/moka.rs:122-128 |
| <moka::MokaCacheBackend as CacheBackend>::num_entries | `async fn num_entries(&self) -> usize {` | rust/lance-core/src/cache/moka.rs:172-172 |
| <moka::MokaCacheBackend as CacheBackend>::size_bytes | `async fn size_bytes(&self) -> usize {` | rust/lance-core/src/cache/moka.rs:177-177 |
| <moka::MokaCacheBackend as std::fmt::Debug>::<implementation> | `impl std::fmt::Debug for MokaCacheBackend {` | rust/lance-core/src/cache/moka.rs:59-59 |
| <moka::MokaCacheBackend as std::fmt::Debug>::fmt | `fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {` | rust/lance-core/src/cache/moka.rs:60-60 |
| <quick::QuickCacheBackend as CacheBackend>::<implementation> | `impl CacheBackend for QuickCacheBackend {` | rust/lance-core/src/cache/quick.rs:208-208 |
| <quick::QuickCacheBackend as CacheBackend>::approx_num_entries | `fn approx_num_entries(&self) -> usize {` | rust/lance-core/src/cache/quick.rs:333-333 |
| <quick::QuickCacheBackend as CacheBackend>::approx_size_bytes | `fn approx_size_bytes(&self) -> usize {` | rust/lance-core/src/cache/quick.rs:342-342 |
| <quick::QuickCacheBackend as CacheBackend>::capacity_bytes | `fn capacity_bytes(&self) -> Option<usize> {` | rust/lance-core/src/cache/quick.rs:329-329 |
| <quick::QuickCacheBackend as CacheBackend>::clear | `async fn clear(&self) {` | rust/lance-core/src/cache/quick.rs:298-298 |
| <quick::QuickCacheBackend as CacheBackend>::deep_size_of_entries | `fn deep_size_of_entries(         &self,         context: &mut Context,         size_of_entry: &dyn Fn(&CacheEntry, &mut Context) -> Option<usize>,     ) -> Option<usize> {` | rust/lance-core/src/cache/quick.rs:351-355 |
| <quick::QuickCacheBackend as CacheBackend>::get | `async fn get(&self, key: &InternalCacheKey, _codec: Option<CacheCodec>) -> Option<CacheEntry> {` | rust/lance-core/src/cache/quick.rs:209-238 |
| <quick::QuickCacheBackend as CacheBackend>::get_or_insert | `async fn get_or_insert<'a>(         &self,         key: &InternalCacheKey,         loader: Pin<Box<dyn Future<Output = Result<(CacheEntry, usize)>> + Send + 'a>>,         _codec: Option<CacheCodec>,     ) -> Result<(CacheEntry, bool)> {` | rust/lance-core/src/cache/quick.rs:263-268 |
| <quick::QuickCacheBackend as CacheBackend>::insert | `async fn insert(         &self,         key: &InternalCacheKey,         entry: CacheEntry,         size_bytes: usize,         _codec: Option<CacheCodec>,     ) {` | rust/lance-core/src/cache/quick.rs:242-248 |
| <quick::QuickCacheBackend as CacheBackend>::num_entries | `async fn num_entries(&self) -> usize {` | rust/lance-core/src/cache/quick.rs:311-311 |
| <quick::QuickCacheBackend as CacheBackend>::size_bytes | `async fn size_bytes(&self) -> usize {` | rust/lance-core/src/cache/quick.rs:320-320 |
| <quick::QuickCacheBackend as std::fmt::Debug>::<implementation> | `impl std::fmt::Debug for QuickCacheBackend {` | rust/lance-core/src/cache/quick.rs:59-59 |
| <quick::QuickCacheBackend as std::fmt::Debug>::fmt | `fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {` | rust/lance-core/src/cache/quick.rs:60-60 |
| moka::MOKA_BACKEND_KIND | `pub const MOKA_BACKEND_KIND: &str = "moka";` | rust/lance-core/src/cache/moka.rs:328-328 |
| moka::MokaCacheBackend | `pub struct MokaCacheBackend {` | rust/lance-core/src/cache/moka.rs:53-53 |
| moka::MokaCacheBackend::<implementation> | `impl MokaCacheBackend {` | rust/lance-core/src/cache/moka.rs:67-67 |
| moka::MokaCacheBackend::capacity | `pub fn capacity(&self) -> usize {` | rust/lance-core/src/cache/moka.rs:93-93 |
| moka::MokaCacheBackend::no_cache | `pub fn no_cache() -> Self {` | rust/lance-core/src/cache/moka.rs:84-84 |
| moka::MokaCacheBackend::with_capacity | `pub fn with_capacity(capacity: usize) -> Self {` | rust/lance-core/src/cache/moka.rs:68-68 |
| quick::QuickCacheBackend | `pub struct QuickCacheBackend {` | rust/lance-core/src/cache/quick.rs:38-38 |
| quick::QuickCacheBackend::<implementation> | `impl QuickCacheBackend {` | rust/lance-core/src/cache/quick.rs:99-99 |
| quick::QuickCacheBackend::with_capacity | `pub fn with_capacity(capacity: usize) -> Self {` | rust/lance-core/src/cache/quick.rs:103-103 |
| quick::QuickCacheBackend::with_shard_policy | `pub fn with_shard_policy(capacity: usize, shard_policy: QuickCacheShardPolicy) -> Self {` | rust/lance-core/src/cache/quick.rs:124-124 |
| quick::QuickCacheShardPolicy | `pub enum QuickCacheShardPolicy {` | rust/lance-core/src/cache/quick.rs:48-48 |
| quick::QuickCacheShardPolicy::Recommended | `Recommended,` | rust/lance-core/src/cache/quick.rs:51-51 |
| quick::QuickCacheShardPolicy::Single | `Single,` | rust/lance-core/src/cache/quick.rs:56-56 |
| quick::recommended_cache_shards | `pub fn recommended_cache_shards(capacity: usize) -> usize {` | rust/lance-core/src/cache/quick.rs:75-75 |

Moka disabled-loader tests explicitly poll one Pending future then require a second same-key success/error to complete immediately. Quick tests cover targeted shard collisions, sequential reuse, retry after failure and after owner abort; contender-start timing uses yield rather than a handshake. No external dependency algorithm audit or runtime/performance results are implied. (rust/lance-core/src/cache/moka.rs:213-325; rust/lance-core/src/cache/quick.rs:603-921)

## Typed facade and ownership

[Complete facade source and annotations](../L2-files/rust/lance-core/src/cache/mod.rs.md). Public child modules are backend and codec. Other implementation modules are private; selected names are re-exported directly from lance_core::cache. Context/DeepSizeOf are also re-exported. MOKA_BACKEND_KIND and normalize_backend_kind remain inaccessible through the public facade despite pub declarations inside private moka/registry. The symbol index records declarations separately from re-export sites. (rust/lance-core/src/cache/mod.rs:48-83; rust/lance-core/src/cache/moka.rs:327-328)

~~~text
LanceCache (inline namespace + Arc state)
+-- CacheState shared by clones and child namespaces
|   +-- Arc<dyn CacheBackend> -> opaque key -> erased Arc value
|   +-- AtomicU64 hits, misses
|   +-- RwLock<TypeId -> memory accessor>
+-- WeakLanceCache keeps Weak state + copied/derived namespace
~~~

with_backend creates fresh state and root namespace each time. Cloning or prefixing shares state. Wrapping the same backend twice shares entries/root key identities but keeps separate counters/accessor registrations. Size/clear cover the complete backend across namespaces. Weak upgrade temporarily retains state through an operation; it is not just a check before an unowned await. (rust/lance-core/src/cache/mod.rs:220-271; rust/lance-core/src/cache/mod.rs:305-366; rust/lance-core/src/cache/mod.rs:652-828)

CacheKey requires sized static ValueType,key,type_name; UnsizedCacheKey permits ?Sized. Operation methods additionally require DeepSizeOf+Send+Sync. Both default stable_type_id to type_name, schema to LEGACY_TEXT and write_key to one framed string; typed overrides bypass string allocation but must still define key. Sized keys alone have optional codec. Both key builders use identical namespace/type/schema/fields framing, with no independent sized/unsized discriminator or Rust TypeId. Identity uniqueness and codec type coherence are caller contracts. (rust/lance-core/src/cache/mod.rs:107-191; rust/lance-core/src/cache/mod.rs:370-455; rust/lance-core/src/cache/mod.rs:556-559; rust/lance-core/src/cache/mod.rs:635-645)

| Operation/result | Metric | Observable result | Evidence |
|---|---|---|---|
| insert | unchanged | unit; no retention promise | rust/lance-core/src/cache/mod.rs:370-381; rust/lance-core/src/cache/mod.rs:556-565 |
| get absent | miss+1 | None | rust/lance-core/src/cache/mod.rs:452-466; rust/lance-core/src/cache/mod.rs:606-615 |
| get correct type | hit+1 | Arc<T> | rust/lance-core/src/cache/mod.rs:467-471; rust/lance-core/src/cache/mod.rs:616-620 |
| get wrong type | miss+1 | warn and None; no eviction | rust/lance-core/src/cache/mod.rs:472-483; rust/lance-core/src/cache/mod.rs:621-632 |
| get_or_insert backend/loader Err | unchanged | error propagated | rust/lance-core/src/cache/mod.rs:528-540; rust/lance-core/src/cache/mod.rs:578-590 |
| get_or_insert wrong type | miss+1 | contextual IO error | rust/lance-core/src/cache/mod.rs:541-547; rust/lance-core/src/cache/mod.rs:591-597 |
| get_or_insert success | backend bool true=>hit, false=>miss | value; sized hit variant also bool | rust/lance-core/src/cache/mod.rs:548-553; rust/lance-core/src/cache/mod.rs:598-603 |

True means this caller skipped its loader and includes coalesced misses; the bool cannot independently identify a preexisting value. Stats reads Relaxed counters before two separate async backend measurements, so it is not a consistent snapshot. Clear awaits backend then resets counters; cancellation/races can leave partial observation. Ratios use f32 and ordinary u64 count sums. (rust/lance-core/src/cache/mod.rs:351-366; rust/lance-core/src/cache/mod.rs:502-516; rust/lance-core/src/cache/mod.rs:834-862)

Unsized values add an outer Arc around Arc<T> and always pass None codec. Successful gets downcast to Arc<T> inside the erased outer Arc and clone the inner pointer. Weak expiry gives None for reads/capacity, false for sized insertion and unit for unsized insertion; sized get_or_insert still runs its own loader and returns false flag. A live weak insert returning true does not guarantee admission. There is no weak unsized get_or_insert or strong unsized hit-returning API here. (rust/lance-core/src/cache/mod.rs:556-633; rust/lance-core/src/cache/mod.rs:734-828)

## Memory estimator boundary

Insert and executed loaders register a callback keyed by concrete Rust TypeId. Fresh hits do not register one. Registration recovers poisoned lock guards and releases them before user DeepSizeOf runs. Declared eviction weight uses a new deep-size context plus two outer Arc counters for each entry independently. Whole-cache deep traversal marks state once, clones the accessor table outside callback execution and traverses with one shared Context; missing callbacks fall back to backend-declared bytes. It excludes separately counted CacheState/backend/accessor-map metadata, and nested Arc sizing excludes its own counter overhead. This is an explicit estimator, not a resident heap measurement. (rust/lance-core/src/cache/mod.rs:197-256; rust/lance-core/src/cache/mod.rs:281-302; rust/lance-core/src/cache/mod.rs:370-484; rust/lance-core/src/deepsize.rs:38-44; rust/lance-core/src/deepsize.rs:182-189)

The shared1024-byte fixture expects eviction weights to count shared storage twice but deep traversal only once; a second prefixed handle in the same Context adds0 children. Reentrant insertion checks a one-second deadlock bound, but its strongly referenced cache value can form a retention cycle and no leak assertion exists. Use the weak handle deliberately where ownership should not retain cache state. (rust/lance-core/src/cache/mod.rs:965-985; rust/lance-core/src/cache/mod.rs:1423-1487; rust/lance-core/src/cache/mod.rs:652-665)

## Facade exact public declarations

| Name | Declaration | Evidence |
|---|---|---|
| <LanceCache as DeepSizeOf>::<implementation> | `impl DeepSizeOf for LanceCache {` | rust/lance-core/src/cache/mod.rs:281-281 |
| <LanceCache as DeepSizeOf>::deep_size_of_children | `fn deep_size_of_children(&self, context: &mut Context) -> usize {` | rust/lance-core/src/cache/mod.rs:282-282 |
| <LanceCache as std::fmt::Debug>::<implementation> | `impl std::fmt::Debug for LanceCache {` | rust/lance-core/src/cache/mod.rs:273-273 |
| <LanceCache as std::fmt::Debug>::fmt | `fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {` | rust/lance-core/src/cache/mod.rs:274-274 |
| backend | `pub mod backend;` | rust/lance-core/src/cache/mod.rs:48-48 |
| CacheKey | `pub trait CacheKey {` | rust/lance-core/src/cache/mod.rs:107-107 |
| CacheKey::codec | `fn codec() -> Option<CacheCodec> {` | rust/lance-core/src/cache/mod.rs:156-156 |
| CacheKey::key | `fn key(&self) -> Cow<'_, str>;` | rust/lance-core/src/cache/mod.rs:110-110 |
| CacheKey::schema | `fn schema() -> CacheKeySchema {` | rust/lance-core/src/cache/mod.rs:131-131 |
| CacheKey::stable_type_id | `fn stable_type_id() -> &'static str {` | rust/lance-core/src/cache/mod.rs:126-126 |
| CacheKey::type_name | `fn type_name() -> &'static str;` | rust/lance-core/src/cache/mod.rs:120-120 |
| CacheKey::ValueType | `type ValueType: 'static;` | rust/lance-core/src/cache/mod.rs:108-108 |
| CacheKey::write_key | `fn write_key(&self, builder: &mut KeyBuilder) {` | rust/lance-core/src/cache/mod.rs:139-139 |
| CacheStats | `pub struct CacheStats {` | rust/lance-core/src/cache/mod.rs:835-835 |
| CacheStats::<implementation> | `impl CacheStats {` | rust/lance-core/src/cache/mod.rs:846-846 |
| CacheStats::hit_ratio | `pub fn hit_ratio(&self) -> f32 {` | rust/lance-core/src/cache/mod.rs:847-847 |
| CacheStats::hits | `pub hits: u64,` | rust/lance-core/src/cache/mod.rs:837-837 |
| CacheStats::miss_ratio | `pub fn miss_ratio(&self) -> f32 {` | rust/lance-core/src/cache/mod.rs:855-855 |
| CacheStats::misses | `pub misses: u64,` | rust/lance-core/src/cache/mod.rs:839-839 |
| CacheStats::num_entries | `pub num_entries: usize,` | rust/lance-core/src/cache/mod.rs:841-841 |
| CacheStats::size_bytes | `pub size_bytes: usize,` | rust/lance-core/src/cache/mod.rs:843-843 |
| codec | `pub mod codec;` | rust/lance-core/src/cache/mod.rs:50-50 |
| LanceCache | `pub struct LanceCache {` | rust/lance-core/src/cache/mod.rs:268-268 |
| LanceCache::<implementation> | `impl LanceCache {` | rust/lance-core/src/cache/mod.rs:305-305 |
| LanceCache::approx_size | `pub fn approx_size(&self) -> usize {` | rust/lance-core/src/cache/mod.rs:338-338 |
| LanceCache::capacity_bytes | `pub fn capacity_bytes(&self) -> Option<usize> {` | rust/lance-core/src/cache/mod.rs:347-347 |
| LanceCache::clear | `pub async fn clear(&self) {` | rust/lance-core/src/cache/mod.rs:362-362 |
| LanceCache::get_or_insert_unsized_with_key | `pub async fn get_or_insert_unsized_with_key<K, F, Fut>(         &self,         cache_key: K,         loader: F,     ) -> Result<Arc<K::ValueType>>     where         K: UnsizedCacheKey,         K::ValueType: DeepSizeOf + Send + Sync + 'static,         F: FnOnce() -> Fut + Send,         Fut: Future<Output = Result<Arc<K::ValueType>>> + Send,     {` | rust/lance-core/src/cache/mod.rs:567-577 |
| LanceCache::get_or_insert_with_key | `pub async fn get_or_insert_with_key<K, F, Fut>(         &self,         cache_key: K,         loader: F,     ) -> Result<Arc<K::ValueType>>     where         K: CacheKey,         K::ValueType: DeepSizeOf + Send + Sync + 'static,         F: FnOnce() -> Fut + Send,         Fut: Future<Output = Result<K::ValueType>> + Send,     {` | rust/lance-core/src/cache/mod.rs:486-496 |
| LanceCache::get_or_insert_with_key_hit | `pub async fn get_or_insert_with_key_hit<K, F, Fut>(         &self,         cache_key: K,         loader: F,     ) -> Result<(Arc<K::ValueType>, bool)>     where         K: CacheKey,         K::ValueType: DeepSizeOf + Send + Sync + 'static,         F: FnOnce() -> Fut + Send,         Fut: Future<Output = Result<K::ValueType>> + Send,     {` | rust/lance-core/src/cache/mod.rs:517-527 |
| LanceCache::get_unsized_with_key | `pub async fn get_unsized_with_key<K>(&self, cache_key: &K) -> Option<Arc<K::ValueType>>     where         K: UnsizedCacheKey,         K::ValueType: DeepSizeOf + Send + Sync + 'static,     {` | rust/lance-core/src/cache/mod.rs:606-610 |
| LanceCache::get_with_key | `pub async fn get_with_key<K>(&self, cache_key: &K) -> Option<Arc<K::ValueType>>     where         K: CacheKey,         K::ValueType: DeepSizeOf + Send + Sync + 'static,     {` | rust/lance-core/src/cache/mod.rs:452-456 |
| LanceCache::insert_unsized_with_key | `pub async fn insert_unsized_with_key<K>(&self, cache_key: &K, metadata: Arc<K::ValueType>)     where         K: UnsizedCacheKey,         K::ValueType: DeepSizeOf + Send + Sync + 'static,     {` | rust/lance-core/src/cache/mod.rs:556-560 |
| LanceCache::insert_with_key | `pub async fn insert_with_key<K>(&self, cache_key: &K, metadata: Arc<K::ValueType>)     where         K: CacheKey,         K::ValueType: DeepSizeOf + Send + Sync + 'static,     {` | rust/lance-core/src/cache/mod.rs:370-374 |
| LanceCache::no_cache | `pub fn no_cache() -> Self {` | rust/lance-core/src/cache/mod.rs:318-318 |
| LanceCache::size | `pub async fn size(&self) -> usize {` | rust/lance-core/src/cache/mod.rs:334-334 |
| LanceCache::size_bytes | `pub async fn size_bytes(&self) -> usize {` | rust/lance-core/src/cache/mod.rs:342-342 |
| LanceCache::stats | `pub async fn stats(&self) -> CacheStats {` | rust/lance-core/src/cache/mod.rs:353-353 |
| LanceCache::with_backend | `pub fn with_backend(backend: Arc<dyn CacheBackend>) -> Self {` | rust/lance-core/src/cache/mod.rs:311-311 |
| LanceCache::with_capacity | `pub fn with_capacity(capacity: usize) -> Self {` | rust/lance-core/src/cache/mod.rs:306-306 |
| LanceCache::with_key_prefix | `pub fn with_key_prefix(&self, prefix: &str) -> Self {` | rust/lance-core/src/cache/mod.rs:327-327 |
| UnsizedCacheKey | `pub trait UnsizedCacheKey {` | rust/lance-core/src/cache/mod.rs:168-168 |
| UnsizedCacheKey::key | `fn key(&self) -> Cow<'_, str>;` | rust/lance-core/src/cache/mod.rs:171-171 |
| UnsizedCacheKey::schema | `fn schema() -> CacheKeySchema {` | rust/lance-core/src/cache/mod.rs:183-183 |
| UnsizedCacheKey::stable_type_id | `fn stable_type_id() -> &'static str {` | rust/lance-core/src/cache/mod.rs:178-178 |
| UnsizedCacheKey::type_name | `fn type_name() -> &'static str;` | rust/lance-core/src/cache/mod.rs:175-175 |
| UnsizedCacheKey::ValueType | `type ValueType: 'static + ?Sized;` | rust/lance-core/src/cache/mod.rs:169-169 |
| UnsizedCacheKey::write_key | `fn write_key(&self, builder: &mut KeyBuilder) {` | rust/lance-core/src/cache/mod.rs:188-188 |
| WeakLanceCache | `pub struct WeakLanceCache {` | rust/lance-core/src/cache/mod.rs:655-655 |
| WeakLanceCache::<implementation> | `impl WeakLanceCache {` | rust/lance-core/src/cache/mod.rs:660-660 |
| WeakLanceCache::capacity_bytes | `pub fn capacity_bytes(&self) -> Option<usize> {` | rust/lance-core/src/cache/mod.rs:736-736 |
| WeakLanceCache::from | `pub fn from(cache: &LanceCache) -> Self {` | rust/lance-core/src/cache/mod.rs:661-661 |
| WeakLanceCache::get_or_insert_with_key | `pub async fn get_or_insert_with_key<K, F, Fut>(         &self,         cache_key: K,         loader: F,     ) -> Result<Arc<K::ValueType>>     where         K: CacheKey,         K::ValueType: DeepSizeOf + Send + Sync + 'static,         F: FnOnce() -> Fut + Send,         Fut: Future<Output = Result<K::ValueType>> + Send,     {` | rust/lance-core/src/cache/mod.rs:764-774 |
| WeakLanceCache::get_or_insert_with_key_hit | `pub async fn get_or_insert_with_key_hit<K, F, Fut>(         &self,         cache_key: K,         loader: F,     ) -> Result<(Arc<K::ValueType>, bool)>     where         K: CacheKey,         K::ValueType: DeepSizeOf + Send + Sync + 'static,         F: FnOnce() -> Fut + Send,         Fut: Future<Output = Result<K::ValueType>> + Send,     {` | rust/lance-core/src/cache/mod.rs:784-794 |
| WeakLanceCache::get_unsized_with_key | `pub async fn get_unsized_with_key<K>(&self, cache_key: &K) -> Option<Arc<K::ValueType>>     where         K: UnsizedCacheKey,         K::ValueType: DeepSizeOf + Send + Sync + 'static,     {` | rust/lance-core/src/cache/mod.rs:802-806 |
| WeakLanceCache::get_with_key | `pub async fn get_with_key<K>(&self, cache_key: &K) -> Option<Arc<K::ValueType>>     where         K: CacheKey,         K::ValueType: DeepSizeOf + Send + Sync + 'static,     {` | rust/lance-core/src/cache/mod.rs:740-744 |
| WeakLanceCache::insert_unsized_with_key | `pub async fn insert_unsized_with_key<K>(&self, cache_key: &K, value: Arc<K::ValueType>)     where         K: UnsizedCacheKey,         K::ValueType: DeepSizeOf + Send + Sync + 'static,     {` | rust/lance-core/src/cache/mod.rs:810-814 |
| WeakLanceCache::insert_with_key | `pub async fn insert_with_key<K>(&self, cache_key: &K, value: Arc<K::ValueType>) -> bool     where         K: CacheKey,         K::ValueType: DeepSizeOf + Send + Sync + 'static,     {` | rust/lance-core/src/cache/mod.rs:748-752 |
| WeakLanceCache::with_key_prefix | `pub fn with_key_prefix(&self, prefix: &str) -> Self {` | rust/lance-core/src/cache/mod.rs:668-668 |


Historical test catalogs from this supplement are retained in the [archive](archive/rust-lance-core-cache-historical-sections.md); they are outside current coverage.
