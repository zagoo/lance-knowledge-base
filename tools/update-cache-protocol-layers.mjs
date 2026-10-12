import fs from 'node:fs';import path from 'node:path';import {output}from './inventory.mjs';const read=f=>fs.readFileSync(path.join(output,f),'utf8'),write=(f,s)=>fs.writeFileSync(path.join(output,f),s.trimEnd()+'\n'),append=(f,s)=>fs.appendFileSync(path.join(output,f),'\n'+s.trim()+'\n');
const p='rust/lance-core/src/cache/',syms=JSON.parse(read('L3-symbols/symbols.json')).filter(s=>s.path.startsWith(p)&&/public declaration/.test(s.visibility));
write('L1-modules/rust-lance-core-cache.md',`# Core cache protocol and extension seams

**INCOMPLETE subsystem.** Four files are analyzed: canonical keys, backend trait, URI parsing and constructor registry. LanceCache, codecs/entry IO, Moka/quick backends, benchmarks and allocation tests remain pending. Public declarations below retain source visibility; parent-module export routing will be confirmed from cache/mod.rs.

[Core](rust-lance-core.md) · [Keys](../L2-files/${p}key.rs.md) · [Backend trait](../L2-files/${p}backend.rs.md) · [URI](../L2-files/${p}backend_uri.rs.md) · [Registry](../L2-files/${p}registry.rs.md) · [Format](../L3-symbols/format-spec.md)

## Architecture and ownership

The low-level trait stores Arc<dyn Any+Send+Sync> under16-byte InternalCacheKey. It delegates logical-key construction/type safety to LanceCache. Optional codecs allow persistence only for serializable entries; None requires memory retention. Codec implementations, runtime downcasts and actual backends are still pending. (rust/lance-core/src/cache/backend.rs:45-76)

The configuration path is synchronous: build_from_uri -> parse_backend_uri -> build_from_config -> chosen BackendBuildFn. A process-global OnceLock holds a mutex map of constructor function pointers; options are owned string maps cloned before dispatch. Construction happens after the registry guard is released. (rust/lance-core/src/cache/backend_uri.rs:51-54; rust/lance-core/src/cache/registry.rs:80-95; rust/lance-core/src/cache/registry.rs:153-171)

## Key identity

Root namespace is deterministic32-byte BLAKE3 derive_key output for a fixed context and empty material. Each child hashes one framed segment under the parent's keyed hash; nested dataset/index differs from a single dataset/index segment. Entry key hashes the entry domain, key-format version, stable value-type id, logical-key schema id/version, then typed fields, retaining the first16 digest bytes. Namespace32/key16 are asserted locally. (rust/lance-core/src/cache/key.rs:19-28; rust/lance-core/src/cache/key.rs:124-179; rust/lance-core/src/cache/key.rs:288-314; rust/lance-core/src/cache/key.rs:336-341; rust/lance-core/src/cache/key.rs:398-404)

CacheKeySchema::new does not enforce nonempty/unique ids or positive versions. Option/sequence/variant writers emit markers and counts without validating grammar or ordinals; callers must keep their logical schema unambiguous and update version when meanings change. No usize writer exists. Stable framing is a local cache protocol contract; it is not a data-file format version or an authentication boundary. (rust/lance-core/src/cache/key.rs:4-15; rust/lance-core/src/cache/key.rs:56-84; rust/lance-core/src/cache/key.rs:140-144; rust/lance-core/src/cache/key.rs:252-287)

## Backend contract

get is Option-only, insert returns unit, and get_or_insert accepts a pinned boxed Send future producing Result<(entry,size)> and returns Result<(entry,was_cached)>. Docs request concurrent-load deduplication except for disabled caches. Counts/bytes may flush pending work; approximate defaults0 can mean unavailable; capacity None can mean unknown. A custom deep traversal should include key footprints and reuse a Context to avoid counting shared buffers twice, falling back to declared entry weights for unregistered types. These are interface requirements, not proof any concrete backend meets them. (rust/lance-core/src/cache/backend.rs:56-145)

Physical persistence must namespace keys with blake3-128-v1 and store canonical16 bytes; one-way digests provide neither prefix invalidation nor inventory. Migration docs offer shared-backend clear or versioned namespace rotation. Rotation leaves old entries to age out rather than reclaiming them immediately. (rust/lance-core/src/cache/backend.rs:11-31; rust/lance-core/src/cache/key.rs:19-23)

## Configuration and registry behavior

Kind syntax is ASCII letter then zero or more ASCII alphanumeric/plus/minus/dot, lowercased without trimming. Config fields remain public; dispatch repeats validation to handle direct struct construction. with_option silently replaces same-key entries; URI query duplicates instead return InvalidInput after percent decoding. (rust/lance-core/src/cache/registry.rs:24-78; rust/lance-core/src/cache/registry.rs:153-159; rust/lance-core/src/cache/backend_uri.rs:70-104)

The URI parser splits first colon, then first question mark, strips exactly one initial// from hierarchy and stores nonempty remainder as path. Host:port/path remains intact; paths are not percent-decoded;# has no fragment role. Query skips empty ampersand-separated pairs and splits each at first=. Empty key/value are allowed. Percent escapes must decode to valid UTF-8; plus stays literal. A query path conflicts with a nonempty hierarchy path. Error messages may include the full supplied URI, including query values. (rust/lance-core/src/cache/backend_uri.rs:59-171)

Built-in discovery only recognizes MOKA_BACKEND_KIND; local docs/tests identify this as moka, and its actual constant/constructor still needs reading. register_backend permits replacement for built-ins and rejects other duplicates. ensure_builtin_backends inserts only missing defaults on every dispatch, preserving overrides; it runs before requested-kind validation. Registry poison becomes Internal error; test locks recover inner state without clearing poison. Constructor errors pass through directly. (rust/lance-core/src/cache/registry.rs:91-109; rust/lance-core/src/cache/registry.rs:126-193; rust/lance-core/src/cache/registry.rs:314-319)

## Exact public declarations

Signatures include opening braces for methods with bodies; complete bodies and private symbols are retained in linked L2/L3. Trait lifetime and generic bounds below are literal source declarations.

| Name | Declaration | Evidence |
|---|---|---|
${syms.map(s=>`| ${s.name.replace('lance_core::cache::','')} | \`${s.signature.replaceAll('|','\\|')}\` | ${s.path}:${s.line}-${s.end_line} |`).join('\n')}

## Validation and remaining risks

Source tests cover17 distinct typed field sequences, hierarchical/type/schema/version separation, a manual u32 endian vector and the combined golden digest; no tests were run. Parser fixtures cover basic paths, lowercase schemes, literal plus, trailing separator and selected errors, but omit malformed percent/UTF-8, path conflict and decoded duplicate names. Registry tests cover custom construction, duplicates, built-in override, normalization and option forwarding; their Arc count checks alone do not prove which concrete backend was built in the override case. Poison/reentrant/concurrent replacement behavior lacks dedicated tests here. (rust/lance-core/src/cache/key.rs:356-476; rust/lance-core/src/cache/backend_uri.rs:173-265; rust/lance-core/src/cache/registry.rs:295-372)

The complete cache lifecycle, codec version/checksum envelope, actual deduplication/cancellation/eviction policy, memory bounds, binding integration and whole-repository caller graph are still acceptance gaps.
`);
append('L1-modules/rust-lance-core.md',`## Cache identities and backend configuration

The [cache supplement](rust-lance-core-cache.md) specifies the canonical key protocol, backend trait, URI subset and process-local constructor registry. Actual LanceCache behavior and concrete storage backends remain pending. (rust/lance-core/src/cache/key.rs:19-314; rust/lance-core/src/cache/backend.rs:45-145; rust/lance-core/src/cache/backend_uri.rs:44-171; rust/lance-core/src/cache/registry.rs:24-193)`);
append('L0-orientation.md',`## Cache terminology

| Term | Established local meaning | Evidence |
|---|---|---|
| Cache namespace | Deterministic32-byte hierarchical keyed-hash scope | rust/lance-core/src/cache/key.rs:120-138 |
| Cache schema | Author-assigned static id and u32 version for logical fields | rust/lance-core/src/cache/key.rs:56-84 |
| Internal cache key | Canonical16-byte truncated digest, no retained readable prefix | rust/lance-core/src/cache/key.rs:86-108; rust/lance-core/src/cache/key.rs:288-295 |
| Backend kind | Lowercase validated scheme name resolving to a synchronous constructor | rust/lance-core/src/cache/registry.rs:52-89; rust/lance-core/src/cache/registry.rs:153-171 |

See [the cache supplement](L1-modules/rust-lance-core-cache.md). These primitives do not establish dataset cache usage or full runtime backend behavior.`);
append('L3-symbols/format-spec.md',`## Canonical cache-key protocol blake3-128-v1

This protocol names cache identities, independently of Lance file-version numbers. Source declares stable framing and recommends putting CACHE_KEY_FORMAT in persistent physical namespaces. It uses deterministic non-secret namespaces and explicitly disclaims authentication/access-control purpose. BLAKE3 dependency internals were not inspected. (rust/lance-core/src/cache/key.rs:4-28; rust/lance-core/src/cache/backend.rs:11-22)

Define frame(x)=LEu64(byte_length(x)) || x. Root R=derive_key(context="lance-format/lance 2026-07-17 cache namespace v1", material=empty). Child(N,s)=32-byte keyed BLAKE3 under N of frame("lance-cache-namespace" plus terminal NUL) || LEu32(1) || frame(UTF8(s)). Entry preamble under namespace N is frame("lance-cache-entry" plus terminal NUL) || LEu32(1) || frame(UTF8(stable_type_id)) || frame(UTF8(schema.id)) || LEu32(schema.version). Entry result is first16 bytes of keyed BLAKE3(preamble || emitted fields), in digest byte order. (rust/lance-core/src/cache/key.rs:25-28; rust/lance-core/src/cache/key.rs:124-138; rust/lance-core/src/cache/key.rs:168-179; rust/lance-core/src/cache/key.rs:288-314)

| Tag byte | Field | Following payload | Evidence |
|---|---|---|---|
| 1 | u8 | one byte | rust/lance-core/src/cache/key.rs:182-186 |
| 2,3,4 | u16,u32,u64 | fixed2/4/8-byte LE | rust/lance-core/src/cache/key.rs:188-213 |
| 5,6 | i32,i64 | fixed4/8-byte signed LE | rust/lance-core/src/cache/key.rs:215-231 |
| 7 | bool |0 or1 byte | rust/lance-core/src/cache/key.rs:233-238 |
| 8,9,10 | str,bytes,fixed bytes | LEu64 length then UTF-8/raw bytes, even fixed arrays | rust/lance-core/src/cache/key.rs:240-256; rust/lance-core/src/cache/key.rs:297-302 |
| 11,12 | None,Some | no payload in marker method | rust/lance-core/src/cache/key.rs:258-268 |
| 13 | variant ordinal | LEu32 | rust/lance-core/src/cache/key.rs:270-277 |
| 14 | sequence length | LEu64 | rust/lance-core/src/cache/key.rs:279-286 |

Grammar correctness is caller-owned: a sequence marker does not consume elements and Some does not require a following payload. Schema constructors do not validate ids/versions. Golden fixture: root.child("s3://bucket/dataset"), value type test.Value, schema test.key/v1, fields u32(7),str(page),Some,fixed[AB;16] -> c438ff22305530fc741638e97d45a568. This is a source fixture, not a freshly executed hash computation. (rust/lance-core/src/cache/key.rs:70-84; rust/lance-core/src/cache/key.rs:252-287; rust/lance-core/src/cache/key.rs:320-328; rust/lance-core/src/cache/key.rs:461-475)

No codec payload envelope has yet been reconstructed; key identity alone is insufficient to restore persistent entries.`);
append('L3-symbols/behavior-contracts.md',`## Cache configuration and interface contracts

| Operation | Local contract | Evidence |
|---|---|---|
| Register custom kind | Normalize; reject duplicate non-built-ins, allow built-in replacement | rust/lance-core/src/cache/registry.rs:126-148 |
| Build configured backend | Ensure defaults, normalize kind, clone options, copy constructor under lock, invoke after unlock | rust/lance-core/src/cache/registry.rs:153-193 |
| Parse URI options | Decode key/value UTF-8, preserve plus, reject duplicates including path conflict | rust/lance-core/src/cache/backend_uri.rs:59-104; rust/lance-core/src/cache/backend_uri.rs:137-171 |
| Build config fluently | Same key overwrites; no option validation | rust/lance-core/src/cache/registry.rs:45-49 |
| Compute key | Type-tagged fields, schema/type/domain separation, first16 digest bytes | rust/lance-core/src/cache/key.rs:168-314 |
| Backend loading | Trait expects deduplication except disabled cache; actual backend behavior still pending | rust/lance-core/src/cache/backend.rs:78-93 |
| Deep memory traversal | Shared Context and key footprint; callback None uses declared size; default unavailable | rust/lance-core/src/cache/backend.rs:127-145 |

Changing key framing under the same physical namespace risks stale-cache interpretation; the documented format identifier/versioning is the intended cold-miss boundary. This consequence follows from identity construction, not a reproduced runtime failure. (rust/lance-core/src/cache/key.rs:19-28; rust/lance-core/src/cache/key.rs:168-179)`);
append('L4-crosscutting/scenarios.md',`## Local trace: configuring a cache backend

build_from_uri parses a compact string without registry access during parse, then build_from_config lazily installs missing built-ins, revalidates/normalizes kind and clones options. It copies the selected function pointer under the global lock, unlocks and invokes the constructor. A failed unknown kind yields InvalidInput; poisoned production registry yields Internal; constructor Result propagates. This trace ends at the constructor boundary, with built-in implementation and dataset/session integration still pending. (rust/lance-core/src/cache/backend_uri.rs:51-104; rust/lance-core/src/cache/registry.rs:91-95; rust/lance-core/src/cache/registry.rs:153-193)

The backend trait uses opaque keys and Arc-erased entries; absence of prefix/key inventory is explicit. Logical type validation and cache loader orchestration in LanceCache must still be read before this KB can explain a complete dataset cache hit/miss path. (rust/lance-core/src/cache/backend.rs:20-31; rust/lance-core/src/cache/backend.rs:45-93)`);
append('L4-crosscutting/cookbook.md',`## Local extension seam: custom cache backend

Choose a valid normalized kind, implement CacheBackend's required async get/insert/get_or_insert/clear/count/size methods and provide a synchronous BackendBuildFn returning Arc<dyn CacheBackend>. Register once at startup; non-built-in repeated registration errors. Constructors run outside registry lock and must interpret/validate their own string options. URI hierarchy becomes raw path and query values remain strings. This is a local seam, with LanceCache integration, codec persistence and concrete test recipes still pending. (rust/lance-core/src/cache/backend.rs:48-103; rust/lance-core/src/cache/registry.rs:80-84; rust/lance-core/src/cache/registry.rs:104-171; rust/lance-core/src/cache/backend_uri.rs:59-104)

For persistent storage use canonical key bytes and include CACHE_KEY_FORMAT in the physical namespace, route codecs by their declared type identity, and retain codec-less entries in memory. Implement concurrent load deduplication except explicitly disabled caching, accurate eviction weighting and optional shared-Context deep traversal. Extend existing tests with decoded URI duplicate/path conflicts and malformed escapes if changing parsing. Codec mechanics and deduplication examples must be filled from pending sources before calling this a complete backend implementation recipe. (rust/lance-core/src/cache/backend.rs:11-18; rust/lance-core/src/cache/backend.rs:56-93; rust/lance-core/src/cache/backend.rs:127-145; rust/lance-core/src/cache/backend_uri.rs:173-265)`);
append('L4-crosscutting/pitfalls.md',`## Cache key/configuration boundaries

Do not interpret approximate count0 as proof of emptiness; default means unavailable. Do not rely on prefix invalidation or enumerate logical keys from opaque digests. Do not assume URI options and fluent options share duplicate policy, or that plus becomes space. Avoid leaking full supplied URI errors into public logs without considering embedded credentials. These are direct local interface/parser consequences; no application logging path has been reviewed yet. (rust/lance-core/src/cache/backend.rs:20-31; rust/lance-core/src/cache/backend.rs:104-118; rust/lance-core/src/cache/registry.rs:45-49; rust/lance-core/src/cache/backend_uri.rs:70-104; rust/lance-core/src/cache/backend_uri.rs:137-159)`);
append('L4-crosscutting/build-and-test.md',`## Cache protocol source tests

key.rs includes size, keyed-hash vector,17-field-sequence separation, namespace/type/schema/version separation, endian reference and full golden vector tests. backend_uri.rs covers basic parsing and selected error messages; registry.rs uses global serialization plus save/restore guards. These tests were read only; no cargo command was run. Concrete backend, allocation and benchmark validation is still pending. (rust/lance-core/src/cache/key.rs:316-476; rust/lance-core/src/cache/backend_uri.rs:173-265; rust/lance-core/src/cache/registry.rs:195-372)`);
const m=JSON.parse(read('MANIFEST.json')),s=JSON.parse(read('iteration-state.json'));s.totals=m.totals;s.read_not_analyzed=[];s.next='VERIFY12 cache protocol/configuration slice; then analyze remaining seven core cache implementation/benchmark/test files.';write('iteration-state.json',JSON.stringify(s,null,2));console.log({public_declarations:syms.length,totals:m.totals});
