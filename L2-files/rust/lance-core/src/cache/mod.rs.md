> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-core/src/cache/mod.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `3d5ab8fb0dac365803114249b79530165440d94fd31f81ecb9c7f252014505f7`. Reviewed physical lines: 1-1485.

[Module](../../../../../L1-modules/rust-lance-core-cache.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Cache public facade, typed and unsized logical-key traits, shared-state LanceCache and WeakLanceCache handles, type-aware memory sizing, hit statistics and backend integration tests. (rust/lance-core/src/cache/mod.rs:1-1485)

## Complete range analysis

### Lines 1-30

SPDX and module overview introduce typed cache users and serializable values. The ignored CacheCodecImpl example is stale: it supplies serialize(&mut dyn Write) and deserialize(&Bytes) and omits required TYPE_ID/CURRENT_VERSION; actual trait takes CacheEntryWriter/Reader and those constants. Treat this as documentation mismatch, not a supported alternate API. The key example itself sets ValueType/key/type_name/codec but elides application bodies. (rust/lance-core/src/cache/codec.rs:209-228) (rust/lance-core/src/cache/mod.rs:1-30)

### Lines 31-47

Backend overview identifies opaque InternalCacheKey and erased CacheEntry. Serialization flow describes wrapper passing an optional codec and memory backends ignoring it. Its prose deserialize(reader) is schematic and does not establish actual CacheCodec::deserialize signature, persistent implementation or disk IO. LanceCache passes Copy descriptors directly, not a newly allocated wrapper per call. (rust/lance-core/src/cache/mod.rs:31-47)

### Lines 48-67

Only backend and codec are public child modules. backend_uri,entry_io,key,moka,quick,registry are private modules with selected re-exports: backend trait/entry; URI build/parse; CacheCodec/Impl/Decode/MissReason/MAGIC/has_cache_envelope; reader/writer; format/schema/namespace/internalkey/builder; Moka backend; Quick backend/policy/recommended count; registry function type/config/build/register. MOKA_BACKEND_KIND, though pub inside private moka, is not publicly re-exported. (rust/lance-core/src/cache/mod.rs:48-67)

### Lines 68-85

Private imports include TypeId,Cow,HashMap,Arc/RwLock/Weak,AtomicU64/Ordering,Future and crate Error/Result. Context and DeepSizeOf are publicly re-exported from core deepsize for cache users. Section separators add no runtime behavior. (rust/lance-core/src/cache/mod.rs:68-85)

### Lines 86-118

Public CacheKey requires associated ValueType:static (sized implicitly), key(&self)->Cow<str> and static type_name. Send/Sync/DeepSizeOf are not trait-level ValueType bounds; operations add them. Docs require differing value types to have different short stable names, avoiding std::any::type_name across builds. This uniqueness is not dynamically validated. Ignored example constructs owned string from u64. (rust/lance-core/src/cache/mod.rs:86-118)

### Lines 119-151

Default stable_type_id calls type_name; default schema is LEGACY_TEXT; default write_key writes the logical key as one framed string. Typed implementations may override write_key to avoid creating key(), but required key method remains. codec defaultsNone, and docs require codec-less values remain memory-only in persistence-capable backends. No check ties codec TYPE_ID/concrete type to stable_type_id; these are caller contracts. (rust/lance-core/src/cache/mod.rs:119-151)

### Lines 152-183

Public UnsizedCacheKey has ValueType:static+?Sized, required key/type_name and the same stable_type_id/schema/write_key defaults. It has no codec method: high-level unsized APIs always passNone and wrap Arc<T> in an extra sized Arc for erasure. The trait itself adds no Send/Sync/DeepSizeOf bound; operations enforce them. (rust/lance-core/src/cache/mod.rs:152-183)

### Lines 184-210

Private cache_entry_size computes DeepSizeOf::deep_size_of plus two AtomicUsize counters as outer Arc overhead using ordinary usize arithmetic. CacheEntrySizeAccessor is a plain function pointer returning Option<usize> with mutable Context. Generic contextual accessor first downcasts entry toT; wrong type returnsNone. It then marks erased Arc allocation address; an already-seen pointer returnsSome0, otherwise counts size_of_val(T), child allocations using the shared context and two outer counters. Allocator padding/alignment overhead is not independently measured. (rust/lance-core/src/cache/mod.rs:184-210)

### Lines 211-229

Private Debug CacheState owns Arc<dyn CacheBackend>, Relaxed-used atomic hits/misses and RwLock<HashMap<TypeId,fn accessor>>. new sets both counters0 and empty accessor map. State ownership and per-Rust-TypeId memory callbacks are separate from stable serialized string IDs. (rust/lance-core/src/cache/mod.rs:211-229)

### Lines 230-254

entry_size<T> checks TypeId under read lock, recovers poisoned guards with into_inner, then conditionally writes entry.or_insert(contextual accessor). Race-safe insertion does not require holding read and write locks together. All guards are dropped before cache_entry_size(value), permitting custom DeepSizeOf to reenter cache APIs. Registry persists for state lifetime and is not bounded/cleared here. Poison recovery does not clear the poison flag. (rust/lance-core/src/cache/mod.rs:230-254)

### Lines 255-272

Public Clone LanceCache has private shared Arc<CacheState> and by-value32-byte namespace. Debug shows backend only and marks struct nonexhaustive; it does not expose counters/prefix. Documentation defaults to Moka via with_capacity/no_cache, with custom backend accepted explicitly; no Default impl appears. (rust/lance-core/src/cache/mod.rs:255-272)

### Lines 273-296

DeepSizeOf marks CacheState allocation address first and returns0 for subsequent handles/cycles in the same Context. It clones the TypeId-accessor map while read-locked, releases lock, then asks backend to traverse entries with runtime Any TypeId dispatch. Backend None falls back to approx_size_bytes. Neither CacheState/Arc allocation, accessor-map heap nor backend internals are independently added; the inherited deep_size_of includes only inline LanceCache plus this estimate. Values loaded directly by custom backend without prior typed insertion/load registration can fall back to declared weights. (rust/lance-core/src/deepsize.rs:38-44) (rust/lance-core/src/cache/mod.rs:273-296)

### Lines 297-313

with_capacity builds a new Moka backend; with_backend creates a new CacheState and deterministic root namespace; no_cache builds the disabled Moka form. Passing the same backend Arc to separate with_backend calls gives distinct counters/accessor maps but identical root key namespaces and shared stored values/clear effects; this differs from clone/prefix sharing one state. No uniqueness isolation is added. (rust/lance-core/src/cache/mod.rs:297-313)

### Lines 314-342

with_key_prefix clones state and derives one child hash segment, so nested a thenb differs from a/b. size awaits backend num_entries; approx_size delegates approximate count; size_bytes awaits weighted byte report; capacity_bytes forwards optional requested capacity. These measurements cover entire shared backend, not this namespace. (rust/lance-core/src/cache/mod.rs:314-342)

### Lines 343-359

stats loads hits then misses with Relaxed before separately awaiting backend count and bytes; it is not an atomic multi-field snapshot. clear awaits backend clear then stores both counters0 Relaxed. Concurrent calls may race/reset counts; clear operates on all backend entries and does not reset namespace or size-accessor registrations. Cancellation while awaiting backend clear can prevent subsequent counter resets. (rust/lance-core/src/cache/mod.rs:343-359)

### Lines 360-374

insert_with_key borrows a sized key and takes Arc<ValueType>, requiring ValueType DeepSizeOf+Send+Sync+static. It registers/measures value first, constructs canonical key, then awaits backend insert with K::codec. It returns unit, does not verify retention or update hit/miss counts, and performs no serialization itself. (rust/lance-core/src/cache/mod.rs:360-374)

### Lines 375-403

get_with_key builds canonical key and awaits backend get with codec. None increments misses once; successful downcast increments hits once and returns Arc<T>. Wrong concrete type warns with stable type ID, increments misses and returnsNone; it does not evict/retry/recompute. A pure get does not register a memory-size accessor forT. Cancellation before a backend result records neither counter. (rust/lance-core/src/cache/mod.rs:375-403)

### Lines 404-419

get_or_insert_with_key delegates to the hit-returning variant and strips bool while preserving Result. It ownsK and accepts Send FnOnce producing Send Future<Result<T>>; no explicit K:Send bound or static loader requirement is written. Values are created by loader asT then wrapped by the delegated method. (rust/lance-core/src/cache/mod.rs:404-419)

### Lines 420-445

get_or_insert_with_key_hit documents bool as whether this caller skipped its loader; true includes waiting for another concurrent load, false means its loader ran. The boolean alone cannot distinguish an already-present value from a coalesced load. Exact generic signature adds operation-level ValueType bounds and Send closure/future, not Send onK. (rust/lance-core/src/cache/mod.rs:420-445)

### Lines 446-458

The hit-returning implementation computes key, clones state, builds a pinned erased loader future; polling that future invokes loader, awaits Result, wrapsT inArc, registers/measuresT and returns(entry,size). Backend receives key/future/codec. Backend or loader Err propagates through await? before any hit/miss update, so failed loads are absent from these counters. Actual coalescing/cancellation comes from selected backend. (rust/lance-core/src/cache/mod.rs:446-458)

### Lines 459-473

Returned entry is downcast toT. Failure increments misses and returns Error::io naming stable type ID, irrespective of backend was_cached; no recovery loader is rerun. Success increments hits if backend bool true, otherwise misses, then returns Arc/bool. The wrapper trusts backend bool and does not independently observe loader execution. (rust/lance-core/src/cache/mod.rs:459-473)

### Lines 474-484

insert_unsized_with_key wraps incoming Arc<?Sized T> in outer Arc, registers/measures the sized inner Arc<T>, builds unsized key and calls backend insert withNone codec. Declared size includes inner Arc inline representation, pointee deep size and outer counters; generic DeepSizeOf for Arc does not add inner Arc counters itself. No insertion metric or admission signal is returned. (rust/lance-core/src/deepsize.rs:182-189) (rust/lance-core/src/cache/mod.rs:474-484)

### Lines 485-508

get_or_insert_unsized_with_key owns key and Send loader returning Result<Arc<T>>. Its lazy future awaits loader, registers/measures Arc<T>, wraps it into an outer erased Arc and passesNone codec to backend. Backend/loader errors propagate before metrics; trait-object sizing invokes dynamic DeepSizeOf through Arc. (rust/lance-core/src/cache/mod.rs:485-508)

### Lines 509-523

Unsized load result downcasts to Arc<T> inside erased outer Arc; mismatch increments miss and returns contextual IO error. Successful backend bool updates hit/miss exactly once; returned inner Arc is cloned, then outer local Arc may drop. There is no public unsized hit-returning variant in this file. (rust/lance-core/src/cache/mod.rs:509-523)

### Lines 524-552

get_unsized_with_key builds key, passesNone codec and counts absent as miss. It downcasts outer entry to Arc<T>, clones inner Arc and counts hit; wrong type warns with unsized stable ID, counts miss and returnsNone without invalidation. As with sized get, it does not registerT or Arc<T> accessors. (rust/lance-core/src/cache/mod.rs:524-552)

### Lines 553-569

Private sized_key and unsized_key perform identical builder pipeline: namespace,stable_type_id,schema; call respective trait write_key; finish16-byte digest. There is no independent sized/unsized discriminator, runtime TypeId or codec identity in this pipeline. Users must use distinct stable identity/schema/fields where stored concrete layouts differ; collisions become downcast misses/errors. (rust/lance-core/src/cache/mod.rs:553-569)

### Lines 570-592

Public Clone/Debug WeakLanceCache stores Weak<CacheState> and namespace. Inherent from(&LanceCache) downgrades state and copies namespace; it is not a std From trait impl. with_key_prefix clones weak state and derives one child segment without retaining a strong state. Docs say indices use it to avoid cycles; production index consumers are still unreviewed. (rust/lance-core/src/cache/mod.rs:570-592)

### Lines 593-619

Weak capacity_bytes upgrades and returnsNone if expired or backend unknown. Weak sized get upgrades or returnsNone silently; a successful upgrade keeps state alive through await. Sized insert warns/returnsfalse on expiry, otherwise delegates and returnstrue. True means a live-cache insertion call finished, not proof backend admitted or retained the value. (rust/lance-core/src/cache/mod.rs:593-619)

### Lines 620-659

Weak sized get_or_insert strips bool from hit variant. Hit variant upgrades once; if expired it warns, directly awaits its own loader and wraps success into(Arc<T>,false), with no cache/state/metrics/dedup. If live, forwards to strong method while holding upgraded state. Loader error remains Result error in either branch. (rust/lance-core/src/cache/mod.rs:620-659)

### Lines 660-688

Weak unsized get returnsNone on failed upgrade; unsized insert warns and returns unit on expiry, otherwise delegates. There is no weak unsized get_or_insert method. Private upgrade combines upgraded state with preserved namespace into a temporary LanceCache, returningNone only if Weak upgrade fails. (rust/lance-core/src/cache/mod.rs:660-688)

### Lines 689-722

Public Debug/Clone CacheStats exposes hits/misses u64 and num_entries/size_bytes usize. hit_ratio/miss_ratio return f32 zero when integer hits+misses==0, otherwise ratio using f32 casts. Sum uses ordinary u64 addition (debug overflow panic/release wrap under ordinary profiles), conversions lose precision for large counts. Counter descriptions are approximate prose: implementation excludes loader errors and treats coalesced results as hits. (rust/lance-core/src/cache/mod.rs:689-722)

### Lines 723-757

cfg(test) module imports sync/thread/time and Poll utilities. report_first_pending pins any Future, polls it through poll_fn and sends a oneshot only at its first Poll::Pending, ignoring send error; Ready forwards output and drops unsent sender. This supports explicit contender-pending handshakes instead of a simple scheduling yield, but does not expose dependency waiter internals. (rust/lance-core/src/cache/mod.rs:723-757)

### Lines 758-791

Clone const-generic VersionedTestKey storesu64 id; TestKey/TestKeyV2 alias versions1/2. CacheKey value is Vec<u32>, required string key allocates id text, stable type name test.VecU32, schema test.vec-u32-key/version parameter, typed writer emitsu64. Hot key construction calls typed writer rather than allocating string. (rust/lance-core/src/cache/mod.rs:758-791)

### Lines 792-823

SharedTestValue owns Arc<Vec<u8>> and forwards child sizing using same Context. SharedTestKey tupleu64 uses value type SharedTestValue, required decimal string, stable type test.SharedValue, schema test.shared-value-key/v1 and typedu64 writer. This fixture distinguishes per-entry eviction weights from shared-allocation traversal. (rust/lance-core/src/cache/mod.rs:792-823)

### Lines 824-845

ReentrantValue holds a strong LanceCache clone and delegates child sizing to that cache. ReentrantKey uses borrowed reentrant string, test.ReentrantValue type and default schema/writer. Once retained, this strong cache-in-entry can form an ownership cycle; the later test checks deadlock-free insertion, not leak-free teardown. (rust/lance-core/src/cache/mod.rs:824-845)

### Lines 846-875

Private Clone/Copy/Debug TestBackendKind selects Moka via LanceCache::with_capacity or Quick via with_backend(Arc). LegacyBridgeKey borrowed static string stores Vec<u32> under test.LegacyBridge with default string bridge/schema; this is cache-key compatibility terminology, not a legacy data-file writer. (rust/lance-core/src/cache/mod.rs:846-875)

### Lines 876-904

ExplicitBridgeKey uses same value/name/schema as LegacyBridgeKey but explicitly write_strs its borrowed field, setting up identical digest expectation. Private TestDynValue:DeepSizeOf+Send+Sync exposes values()->&[u32]; Vec<u32> returns itself as slice. (rust/lance-core/src/cache/mod.rs:876-904)

### Lines 905-936

LegacyUnsizedBridgeKey/ExplicitUnsizedBridgeKey store dyn TestDynValue and use shared test.LegacyUnsizedBridge identity. Both borrowstatic string; explicit version overrides write_key with write_str while other uses default. No codec or altered schema is defined. (rust/lance-core/src/cache/mod.rs:905-936)

### Lines 937-965

Test-only Default/Debug HashMapBackend owns tokio Mutex<HashMap<InternalCacheKey,(CacheEntry,usize)>>. get clones matching Arc under lock; insert copies opaque key and replaces tuple under lock. Both ignore codec and count only declared payload bytes later, without fixed key overhead. (rust/lance-core/src/cache/mod.rs:937-965)

### Lines 966-997

Test HashMapBackend get_or_insert first separately awaits get, then on miss awaits loader outside lock and inserts. It does not coalesce concurrent misses; this fixture is not a conforming production single-flight reference. clear/count/size lock map and clear/len/sum declared sizes; default approximate/deep/capacity trait methods remain. (rust/lance-core/src/cache/mod.rs:966-997)

### Lines 998-1039

Test WrongTypeBackend always returns new Arc<String> from get and(entry,true) from get_or_insert without polling supplied loader. insert/clear are no-ops,count/size0. It deliberately violates requested type to exercise defensive downcasts, not real storage. (rust/lance-core/src/cache/mod.rs:998-1039)

### Lines 1040-1060

Moka typed-roundtrip test inserts key7 underleft, hitsleft/missesright and checks root sharedstats(1,1,1); root clear then leftstats(0,0,0). It validates namespace key separation but global metrics/clear. No concurrent reset behavior asserted. (rust/lance-core/src/cache/mod.rs:1040-1060)

### Lines 1061-1084

Strong/weak test derives child, weakfromchild, inserts throughweak thenstrong, reads through opposite handles and checks root hits2/count2. It confirms shared state and preserved namespace while original strong handles remain alive. (rust/lance-core/src/cache/mod.rs:1061-1084)

### Lines 1085-1104

Nested namespace test inserts under segmentsa,b and expects miss under singlea/b. Schema-change test inserts version1key and expects sameid version2 miss. They do not assert raw digest bytes or physical removal of older namespace/schema entries. (rust/lance-core/src/cache/mod.rs:1085-1104)

### Lines 1105-1127

Hit-reporting test first loads vector1,2,3 andfalse, then requests samekey with panic loader and expectstrue/value. It verifies sequential skip/execution semantics, not concurrent bool discrimination. (rust/lance-core/src/cache/mod.rs:1105-1127)

### Lines 1128-1157

Sized bridge test inserts with default string-key encoding and retrieves via explicitwrite_str; unsized analogue stores dyn Vec values10,20 and retrieves via explicit key. These assert defaults preserve identical logical encoding, not earlier on-disk cache revision compatibility. (rust/lance-core/src/cache/mod.rs:1128-1157)

### Lines 1158-1178

Custom HashMap backend fixture inserts under child, checks typed value/rawmaplen1 and backend weighted bytes equal cache_entry_size only, then rootclear emptiesmap and childhits0. It demonstrates weight policies differ because this fixture excludes key cost and is not production cache accounting. (rust/lance-core/src/cache/mod.rs:1158-1178)

### Lines 1179-1192

Wrong-type fixture checks sized get yieldsNone, sizedget_or_insert returns error containingtest.VecU32 and stats0hits/2misses. It does not assert error category or unsized collision paths, nor check supplied loader counter explicitly. (rust/lance-core/src/cache/mod.rs:1179-1192)

### Lines 1193-1203

Moka physical-key weight test computes cache_entry_size(value)=value.deep_size_of()+2*size_of::<AtomicUsize>(), then checked_adds size_of::<InternalCacheKey>(), chooses twice expected capacity, inserts and asserts weighted bytes equal expected. Only the key addition is checked; the helper adds Arc counter overhead with ordinary arithmetic. Small capacity gives weight_unit1, avoiding coarse Moka units. Supporting helpers: rust/lance-core/src/cache/mod.rs:189-192; rust/lance-core/src/cache/moka.rs:34-46. (rust/lance-core/src/cache/mod.rs:1193-1203)

### Lines 1204-1223

Parameterized Moka/Quick deep-memory test loads two distinct SharedTestValue entries that reference same1024-byte Vec allocation under1MiB capacity. Successful loads register concrete memory accessors and create two outer entries. (rust/lance-core/src/cache/mod.rs:1204-1223)

### Lines 1224-1246

Expected unique memory is two key footprints plus two SharedTestValue inline sizes/outer-counter pairs plus one Vec inline/capacity allocation. Weighted bytes equal that plus another shared allocation, showing independent per-entry weights double count it. deep_size_of adds inline LanceCache; sharedContext firstchildren gives expectedentries and secondprefixhandle0. This is the chosen estimator contract, excluding CacheState/accessor-map and nested Arc counter metadata. (rust/lance-core/src/cache/mod.rs:1224-1246)

### Lines 1247-1269

Reentrant sizing test spawns OSthread with current-thread Tokio runtime, inserts ReentrantValue(cacheclone), sends completion, requires receive within1second, then joins. It targets lock reentry deadlock during initial sizing; it does not traverse the retained cycle afterward or assert eventual deallocation. (rust/lance-core/src/cache/mod.rs:1247-1269)

### Lines 1270-1288

No-cache fixture calls samekey loader twice sequentially, checks each[42],counter2 and retainedcount0. Concurrent independence is covered separately in moka.rs, not by this sequential test. (rust/lance-core/src/cache/mod.rs:1270-1288)

### Lines 1289-1314

Two-worker Tokio success single-flight fixture uses four contenders, Moka capacity4096, SeqCst loader count,Notify release and oneshot ownerstarted. Owner increments/signals then waits before returning[10]; test awaits start before spawning contenders. (rust/lance-core/src/cache/mod.rs:1289-1314)

### Lines 1315-1349

Each success contender is wrapped in report_first_pending and would load[99]. Test waits every pending signal, asserts onlyone loader and all unfinished, then releases owner. Owner/allcontenders yield[10] and finalstats(4hits,1miss). No timeout surrounds start/parking/joins here; this is source coverage, not an executed liveness proof. (rust/lance-core/src/cache/mod.rs:1315-1349)

### Lines 1350-1375

Error single-flight fixture similarly starts owner withfour contenders and2threads; owner eventually returns Timeout(owner loader timed out), requiring Vec<u32> value through key. It waits ownerstarted before constructing contenders. (rust/lance-core/src/cache/mod.rs:1350-1375)

### Lines 1376-1412

Error contenders would produce their own Timeout text but are handshakenPending before release; test asserts loadercount1/unfinished, releasesowner, requires ownerandallcontenders Timeout variants and finalcount1. It does not assert error text identity, stats after errors or timing bound. Moka selective CloneableError must preserve Timeout for shared results. (rust/lance-core/src/cache/mod.rs:1376-1412)

### Lines 1413-1434

Cancellation single-flight fixture starts Moka owner forkey30, signalsafterincrement, then awaits permanentlyPending before hypothetical[30]. Test waits ownerstarted before spawning one contender. (rust/lance-core/src/cache/mod.rs:1413-1434)

### Lines 1435-1466

Contender wrapped with pending handshake would return[31]; test awaits parked, checkscount1/unfinished, abortsowner and checks cancelled JoinError. Contender must finishwithin5seconds with[31] andtotalcount2. Timeout starts only after ownerabort; earlier ownerstart/park waits are unbounded. No stats assertion here. (rust/lance-core/src/cache/mod.rs:1435-1466)

### Lines 1467-1485

Expired weak-cache fixture createsweak, dropsonlystrong cache, checks getNone andinsertfalse, then uncached get_or_insert yields[7]. It does not explicitly check hitflag, capacity, unsized expiry or concurrent expired-load independence. Testmodule andfileend; no production runtime or benchmark executed. (rust/lance-core/src/cache/mod.rs:1467-1485)

## Interaction and interpretation limits

All1485 lines and local APIs/tests are analyzed. This does not reconstruct external Moka/quick_cache scheduling internals, production value codecs, dataset/session consumers or performance measurements. The ignored codec example disagrees with the current trait; exact declarations below and codec.rs govern the extracted API. Tests were read, not run. (rust/lance-core/src/cache/mod.rs:15-29; rust/lance-core/src/cache/codec.rs:209-228; rust/lance-core/src/cache/mod.rs:723-1485)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Lance cache system.
    5 | //!
    6 | //! ## For cache users
    7 | //!
    8 | //! Use [`LanceCache`] (or [`WeakLanceCache`]) to store and retrieve typed
    9 | //! values. Define a [`CacheKey`] (or [`UnsizedCacheKey`] for trait objects) to
   10 | //! describe what you're caching and its type.
   11 | //!
   12 | //! To make a value type serializable (so persistent backends can store it),
   13 | //! implement [`CacheCodecImpl`] on the type, then override [`CacheKey::codec`]:
   14 | //!
   15 | //! ```ignore
   16 | //! impl CacheCodecImpl for MyData {
   17 | //!     fn serialize(&self, w: &mut dyn Write) -> Result<()> { /* ... */ }
   18 | //!     fn deserialize(data: &Bytes) -> Result<Self> { /* ... */ }
   19 | //! }
   20 | //!
   21 | //! impl CacheKey for MyDataKey {
   22 | //!     type ValueType = MyData;
   23 | //!     fn key(&self) -> Cow<'_, str> { /* ... */ }
   24 | //!     fn type_name() -> &'static str { "MyData" }
   25 | //!     fn codec() -> Option<CacheCodec> {
   26 | //!         Some(CacheCodec::from_impl::<MyData>())
   27 | //!     }
   28 | //! }
   29 | //! ```
   30 | //!
   31 | //! ## For backend implementors
   32 | //!
   33 | //! Implement [`CacheBackend`] to provide a custom storage layer (disk, Redis,
   34 | //! etc.). Backends receive opaque, fixed-size [`InternalCacheKey`] values and
   35 | //! type-erased [`CacheEntry`] values. The typed wrapping is handled by
   36 | //! [`LanceCache`]. See the [`backend`] module for migration details.
   37 | //!
   38 | //! ## Serialization flow
   39 | //!
   40 | //! When a [`CacheKey`] provides a codec via [`CacheKey::codec`]:
   41 | //!
   42 | //! 1. [`LanceCache`] wraps the [`CacheCodec`] and passes it to the backend
   43 | //!    alongside the entry on `insert` and `get` calls.
   44 | //! 2. In-memory backends (like [`MokaCacheBackend`]) ignore the codec.
   45 | //! 3. Persistent backends use `codec.serialize(entry, writer)` on insert and
   46 | //!    `codec.deserialize(reader)` on get to persist entries across restarts.
   47 | 
   48 | pub mod backend;
   49 | mod backend_uri;
   50 | pub mod codec;
   51 | mod entry_io;
   52 | mod key;
   53 | mod moka;
   54 | mod quick;
   55 | mod registry;
   56 | 
   57 | pub use backend::{CacheBackend, CacheEntry};
   58 | pub use backend_uri::{build_from_uri, parse_backend_uri};
   59 | pub use codec::{
   60 |     CacheCodec, CacheCodecImpl, CacheDecode, CacheMissReason, MAGIC, has_cache_envelope,
   61 | };
   62 | pub use entry_io::{CacheEntryReader, CacheEntryWriter};
   63 | pub use key::{CACHE_KEY_FORMAT, CacheKeySchema, CacheNamespace, InternalCacheKey, KeyBuilder};
   64 | pub use moka::MokaCacheBackend;
   65 | pub use quick::{QuickCacheBackend, QuickCacheShardPolicy, recommended_cache_shards};
   66 | pub use registry::{BackendBuildFn, BackendConfig, build_from_config, register_backend};
   67 | 
   68 | use std::any::TypeId;
   69 | use std::borrow::Cow;
   70 | use std::collections::HashMap;
   71 | use std::sync::{
   72 |     Arc, RwLock, Weak,
   73 |     atomic::{AtomicU64, Ordering},
   74 | };
   75 | 
   76 | use futures::Future;
   77 | 
   78 | use crate::{Error, Result};
   79 | 
   80 | pub use crate::deepsize::{Context, DeepSizeOf};
   81 | 
   82 | // ---------------------------------------------------------------------------
   83 | // CacheKey / UnsizedCacheKey — typed key traits for cache users
   84 | // ---------------------------------------------------------------------------
   85 | 
   86 | /// Typed cache key for sized value types.
   87 | ///
   88 | /// Existing implementations can continue returning a logical string from
   89 | /// [`key`](Self::key). Performance-sensitive implementations should also
   90 | /// provide a stable schema and stream typed fields through
   91 | /// [`write_key`](Self::write_key), avoiding construction of that string.
   92 | ///
   93 | /// # Example
   94 | ///
   95 | /// ```ignore
   96 | /// struct MyKey { id: u64 }
   97 | ///
   98 | /// impl CacheKey for MyKey {
   99 | ///     type ValueType = MyData;
  100 | ///     fn key(&self) -> Cow<'_, str> { self.id.to_string().into() }
  101 | ///     fn type_name() -> &'static str { "MyData" }
  102 | /// }
  103 | /// ```
  104 | pub trait CacheKey {
  105 |     type ValueType: 'static;
  106 | 
  107 |     fn key(&self) -> Cow<'_, str>;
  108 | 
  109 |     /// Short, stable string identifying this value type.
  110 |     ///
  111 |     /// Two `CacheKey` impls that store different `ValueType`s **must** return
  112 |     /// different type names.
  113 |     ///
  114 |     /// Use a short literal (e.g. `"Vec<IndexMetadata>"`), not
  115 |     /// `std::any::type_name` — the latter is not guaranteed stable across
  116 |     /// compiler versions or build configurations.
  117 |     fn type_name() -> &'static str;
  118 | 
  119 |     /// Stable identity included in the physical key.
  120 |     ///
  121 |     /// The compatibility default preserves existing implementations by using
  122 |     /// their author-assigned [`type_name`](Self::type_name).
  123 |     fn stable_type_id() -> &'static str {
  124 |         Self::type_name()
  125 |     }
  126 | 
  127 |     /// Versioned schema for the logical key fields.
  128 |     fn schema() -> CacheKeySchema {
  129 |         CacheKeySchema::LEGACY_TEXT
  130 |     }
  131 | 
  132 |     /// Stream the logical key fields into the canonical key builder.
  133 |     ///
  134 |     /// The compatibility default hashes the existing string key. In-tree hot
  135 |     /// paths override this with typed, allocation-free field encoding.
  136 |     fn write_key(&self, builder: &mut KeyBuilder) {
  137 |         builder.write_str(self.key().as_ref());
  138 |     }
  139 | 
  140 |     /// Optional codec for serializing/deserializing this key's value type.
  141 |     ///
  142 |     /// Returns `None` by default. Cache backends that support persistence
  143 |     /// (e.g. disk-backed caches) use this to serialize entries on insert and
  144 |     /// deserialize on get. Types without a codec will only be stored in-memory.
  145 |     ///
  146 |     /// [`CacheCodec`] is `Copy` (two plain function pointers), so returning it
  147 |     /// by value is cheap — no allocation needed.
  148 |     fn codec() -> Option<CacheCodec> {
  149 |         None
  150 |     }
  151 | }
  152 | 
  153 | /// Like [`CacheKey`] but for unsized value types (e.g. `dyn Trait`).
  154 | ///
  155 | /// The cache wraps values in an extra `Arc` layer internally; callers pass
  156 | /// and receive `Arc<T>` where `T: ?Sized`.
  157 | ///
  158 | /// Unsized cache entries are always in-memory only (no serialization codec).
  159 | /// For serializable entries, use a sized [`CacheKey`] instead.
  160 | pub trait UnsizedCacheKey {
  161 |     type ValueType: 'static + ?Sized;
  162 | 
  163 |     fn key(&self) -> Cow<'_, str>;
  164 | 
  165 |     /// Short, stable string identifying this value type.
  166 |     /// See [`CacheKey::type_name`] for requirements.
  167 |     fn type_name() -> &'static str;
  168 | 
  169 |     /// Stable identity included in the physical key.
  170 |     fn stable_type_id() -> &'static str {
  171 |         Self::type_name()
  172 |     }
  173 | 
  174 |     /// Versioned schema for the logical key fields.
  175 |     fn schema() -> CacheKeySchema {
  176 |         CacheKeySchema::LEGACY_TEXT
  177 |     }
  178 | 
  179 |     /// Stream the logical key fields into the canonical key builder.
  180 |     fn write_key(&self, builder: &mut KeyBuilder) {
  181 |         builder.write_str(self.key().as_ref());
  182 |     }
  183 | }
  184 | 
  185 | // ---------------------------------------------------------------------------
  186 | // Internal helpers
  187 | // ---------------------------------------------------------------------------
  188 | 
  189 | /// Size of a cached `Arc<T>`, accounting for the Arc overhead (two atomic counters).
  190 | fn cache_entry_size<T: DeepSizeOf + ?Sized>(value: &T) -> usize {
  191 |     value.deep_size_of() + std::mem::size_of::<std::sync::atomic::AtomicUsize>() * 2
  192 | }
  193 | 
  194 | type CacheEntrySizeAccessor = fn(&CacheEntry, &mut Context) -> Option<usize>;
  195 | 
  196 | fn cache_entry_size_with_context<T>(entry: &CacheEntry, context: &mut Context) -> Option<usize>
  197 | where
  198 |     T: DeepSizeOf + Send + Sync + 'static,
  199 | {
  200 |     let value = entry.downcast_ref::<T>()?;
  201 |     let entry_ptr = Arc::as_ptr(entry) as *const () as usize;
  202 |     if !context.mark_seen(entry_ptr) {
  203 |         return Some(0);
  204 |     }
  205 |     Some(
  206 |         std::mem::size_of_val(value)
  207 |             + value.deep_size_of_children(context)
  208 |             + std::mem::size_of::<std::sync::atomic::AtomicUsize>() * 2,
  209 |     )
  210 | }
  211 | 
  212 | #[derive(Debug)]
  213 | struct CacheState {
  214 |     backend: Arc<dyn CacheBackend>,
  215 |     hits: AtomicU64,
  216 |     misses: AtomicU64,
  217 |     entry_size_accessors: RwLock<HashMap<TypeId, CacheEntrySizeAccessor>>,
  218 | }
  219 | 
  220 | impl CacheState {
  221 |     fn new(backend: Arc<dyn CacheBackend>) -> Self {
  222 |         Self {
  223 |             backend,
  224 |             hits: AtomicU64::new(0),
  225 |             misses: AtomicU64::new(0),
  226 |             entry_size_accessors: RwLock::new(HashMap::new()),
  227 |         }
  228 |     }
  229 | 
  230 |     fn entry_size<T>(&self, value: &T) -> usize
  231 |     where
  232 |         T: DeepSizeOf + Send + Sync + 'static,
  233 |     {
  234 |         let type_id = TypeId::of::<T>();
  235 |         let is_registered = self
  236 |             .entry_size_accessors
  237 |             .read()
  238 |             .unwrap_or_else(|poisoned| poisoned.into_inner())
  239 |             .contains_key(&type_id);
  240 |         if !is_registered {
  241 |             self.entry_size_accessors
  242 |                 .write()
  243 |                 .unwrap_or_else(|poisoned| poisoned.into_inner())
  244 |                 .entry(type_id)
  245 |                 .or_insert(cache_entry_size_with_context::<T>);
  246 |         }
  247 |         cache_entry_size(value)
  248 |     }
  249 | }
  250 | 
  251 | // ---------------------------------------------------------------------------
  252 | // LanceCache — typed wrapper around dyn CacheBackend
  253 | // ---------------------------------------------------------------------------
  254 | 
  255 | /// Typed cache wrapper that handles key construction and type safety.
  256 | ///
  257 | /// Internally delegates to a [`CacheBackend`]. The default backend is
  258 | /// [`MokaCacheBackend`]; pass a custom backend via [`LanceCache::with_backend`].
  259 | #[derive(Clone)]
  260 | pub struct LanceCache {
  261 |     state: Arc<CacheState>,
  262 |     namespace: key::CacheNamespace,
  263 | }
  264 | 
  265 | impl std::fmt::Debug for LanceCache {
  266 |     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
  267 |         f.debug_struct("LanceCache")
  268 |             .field("backend", &self.state.backend)
  269 |             .finish_non_exhaustive()
  270 |     }
  271 | }
  272 | 
  273 | impl DeepSizeOf for LanceCache {
  274 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  275 |         let state_ptr = Arc::as_ptr(&self.state) as usize;
  276 |         if !context.mark_seen(state_ptr) {
  277 |             return 0;
  278 |         }
  279 | 
  280 |         let accessors = self
  281 |             .state
  282 |             .entry_size_accessors
  283 |             .read()
  284 |             .unwrap_or_else(|poisoned| poisoned.into_inner())
  285 |             .clone();
  286 |         self.state
  287 |             .backend
  288 |             .deep_size_of_entries(context, &|entry, context| {
  289 |                 accessors
  290 |                     .get(&entry.as_ref().type_id())
  291 |                     .and_then(|size_of_entry| size_of_entry(entry, context))
  292 |             })
  293 |             .unwrap_or_else(|| self.state.backend.approx_size_bytes())
  294 |     }
  295 | }
  296 | 
  297 | impl LanceCache {
  298 |     pub fn with_capacity(capacity: usize) -> Self {
  299 |         Self::with_backend(Arc::new(MokaCacheBackend::with_capacity(capacity)))
  300 |     }
  301 | 
  302 |     /// Create a cache backed by a custom [`CacheBackend`].
  303 |     pub fn with_backend(backend: Arc<dyn CacheBackend>) -> Self {
  304 |         Self {
  305 |             state: Arc::new(CacheState::new(backend)),
  306 |             namespace: key::CacheNamespace::root(),
  307 |         }
  308 |     }
  309 | 
  310 |     pub fn no_cache() -> Self {
  311 |         Self::with_backend(Arc::new(MokaCacheBackend::no_cache()))
  312 |     }
  313 | 
  314 |     /// Derive a child namespace for all keys in the returned cache handle.
  315 |     ///
  316 |     /// Each call adds one framed hierarchy segment. Consequently,
  317 |     /// `cache.with_key_prefix("a").with_key_prefix("b")` is deliberately
  318 |     /// distinct from `cache.with_key_prefix("a/b")`.
  319 |     pub fn with_key_prefix(&self, prefix: &str) -> Self {
  320 |         Self {
  321 |             state: self.state.clone(),
  322 |             namespace: self.namespace.child(prefix),
  323 |         }
  324 |     }
  325 | 
  326 |     pub async fn size(&self) -> usize {
  327 |         self.state.backend.num_entries().await
  328 |     }
  329 | 
  330 |     pub fn approx_size(&self) -> usize {
  331 |         self.state.backend.approx_num_entries()
  332 |     }
  333 | 
  334 |     pub async fn size_bytes(&self) -> usize {
  335 |         self.state.backend.size_bytes().await
  336 |     }
  337 | 
  338 |     /// Weighted capacity in bytes, if the backend reports one.
  339 |     pub fn capacity_bytes(&self) -> Option<usize> {
  340 |         self.state.backend.capacity_bytes()
  341 |     }
  342 | 
  343 |     // -- Stats / clear --------------------------------------------------------
  344 | 
  345 |     pub async fn stats(&self) -> CacheStats {
  346 |         CacheStats {
  347 |             hits: self.state.hits.load(Ordering::Relaxed),
  348 |             misses: self.state.misses.load(Ordering::Relaxed),
  349 |             num_entries: self.state.backend.num_entries().await,
  350 |             size_bytes: self.state.backend.size_bytes().await,
  351 |         }
  352 |     }
  353 | 
  354 |     pub async fn clear(&self) {
  355 |         self.state.backend.clear().await;
  356 |         self.state.hits.store(0, Ordering::Relaxed);
  357 |         self.state.misses.store(0, Ordering::Relaxed);
  358 |     }
  359 | 
  360 |     // -- CacheKey-based methods -----------------------------------------------
  361 | 
  362 |     pub async fn insert_with_key<K>(&self, cache_key: &K, metadata: Arc<K::ValueType>)
  363 |     where
  364 |         K: CacheKey,
  365 |         K::ValueType: DeepSizeOf + Send + Sync + 'static,
  366 |     {
  367 |         let size = self.state.entry_size(metadata.as_ref());
  368 |         let key = self.sized_key(cache_key);
  369 |         self.state
  370 |             .backend
  371 |             .insert(&key, metadata, size, K::codec())
  372 |             .await;
  373 |     }
  374 | 
  375 |     pub async fn get_with_key<K>(&self, cache_key: &K) -> Option<Arc<K::ValueType>>
  376 |     where
  377 |         K: CacheKey,
  378 |         K::ValueType: DeepSizeOf + Send + Sync + 'static,
  379 |     {
  380 |         let key = self.sized_key(cache_key);
  381 |         let Some(entry) = self.state.backend.get(&key, K::codec()).await else {
  382 |             self.state.misses.fetch_add(1, Ordering::Relaxed);
  383 |             return None;
  384 |         };
  385 |         match entry.downcast::<K::ValueType>() {
  386 |             Ok(value) => {
  387 |                 self.state.hits.fetch_add(1, Ordering::Relaxed);
  388 |                 Some(value)
  389 |             }
  390 |             Err(_) => {
  391 |                 // Type mismatch: the backend returned a different concrete
  392 |                 // type than expected (e.g. a disk cache may store
  393 |                 // intermediate state). Treat as a miss.
  394 |                 log::warn!(
  395 |                     "cache backend returned a value with the wrong concrete type for key type {:?}",
  396 |                     K::stable_type_id()
  397 |                 );
  398 |                 self.state.misses.fetch_add(1, Ordering::Relaxed);
  399 |                 None
  400 |             }
  401 |         }
  402 |     }
  403 | 
  404 |     pub async fn get_or_insert_with_key<K, F, Fut>(
  405 |         &self,
  406 |         cache_key: K,
  407 |         loader: F,
  408 |     ) -> Result<Arc<K::ValueType>>
  409 |     where
  410 |         K: CacheKey,
  411 |         K::ValueType: DeepSizeOf + Send + Sync + 'static,
  412 |         F: FnOnce() -> Fut + Send,
  413 |         Fut: Future<Output = Result<K::ValueType>> + Send,
  414 |     {
  415 |         self.get_or_insert_with_key_hit(cache_key, loader)
  416 |             .await
  417 |             .map(|(value, _)| value)
  418 |     }
  419 | 
  420 |     /// Same as [`get_or_insert_with_key`](Self::get_or_insert_with_key), but
  421 |     /// also returns a boolean indicating whether the loader was skipped for
  422 |     /// this call.
  423 |     ///
  424 |     /// - `true` means this call did **not** execute the loader. That covers
  425 |     ///   both a true cache hit on an already-populated entry and a coalesced
  426 |     ///   concurrent load where an in-flight loader started by a different
  427 |     ///   caller produced the value.
  428 |     /// - `false` means the loader ran on this call (a real cache miss).
  429 |     ///
  430 |     /// Callers that want strict "served from cache" semantics should treat
  431 |     /// coalesced loads as misses; the current backend does not distinguish the
  432 |     /// two cases. Prefer this over rolling a caller-side `Arc<AtomicBool>`
  433 |     /// when the caller needs per-query hit/miss counters — the backend already
  434 |     /// tracks this bit internally and this method just exposes it.
  435 |     pub async fn get_or_insert_with_key_hit<K, F, Fut>(
  436 |         &self,
  437 |         cache_key: K,
  438 |         loader: F,
  439 |     ) -> Result<(Arc<K::ValueType>, bool)>
  440 |     where
  441 |         K: CacheKey,
  442 |         K::ValueType: DeepSizeOf + Send + Sync + 'static,
  443 |         F: FnOnce() -> Fut + Send,
  444 |         Fut: Future<Output = Result<K::ValueType>> + Send,
  445 |     {
  446 |         let key = self.sized_key(&cache_key);
  447 |         let state = self.state.clone();
  448 |         let typed_loader = Box::pin(async move {
  449 |             let value = Arc::new(loader().await?);
  450 |             let size = state.entry_size(value.as_ref());
  451 |             Ok((value as CacheEntry, size))
  452 |         });
  453 | 
  454 |         let (entry, was_cached) = self
  455 |             .state
  456 |             .backend
  457 |             .get_or_insert(&key, typed_loader, K::codec())
  458 |             .await?;
  459 |         let entry = entry.downcast::<K::ValueType>().map_err(|_| {
  460 |             self.state.misses.fetch_add(1, Ordering::Relaxed);
  461 |             Error::io(format!(
  462 |                 "cache backend returned a value with the wrong concrete type for key type {:?}",
  463 |                 K::stable_type_id()
  464 |             ))
  465 |         })?;
  466 |         if was_cached {
  467 |             self.state.hits.fetch_add(1, Ordering::Relaxed);
  468 |         } else {
  469 |             self.state.misses.fetch_add(1, Ordering::Relaxed);
  470 |         }
  471 |         Ok((entry, was_cached))
  472 |     }
  473 | 
  474 |     pub async fn insert_unsized_with_key<K>(&self, cache_key: &K, metadata: Arc<K::ValueType>)
  475 |     where
  476 |         K: UnsizedCacheKey,
  477 |         K::ValueType: DeepSizeOf + Send + Sync + 'static,
  478 |     {
  479 |         let metadata = Arc::new(metadata);
  480 |         let size = self.state.entry_size(metadata.as_ref());
  481 |         let key = self.unsized_key(cache_key);
  482 |         self.state.backend.insert(&key, metadata, size, None).await;
  483 |     }
  484 | 
  485 |     pub async fn get_or_insert_unsized_with_key<K, F, Fut>(
  486 |         &self,
  487 |         cache_key: K,
  488 |         loader: F,
  489 |     ) -> Result<Arc<K::ValueType>>
  490 |     where
  491 |         K: UnsizedCacheKey,
  492 |         K::ValueType: DeepSizeOf + Send + Sync + 'static,
  493 |         F: FnOnce() -> Fut + Send,
  494 |         Fut: Future<Output = Result<Arc<K::ValueType>>> + Send,
  495 |     {
  496 |         let key = self.unsized_key(&cache_key);
  497 |         let state = self.state.clone();
  498 |         let typed_loader = Box::pin(async move {
  499 |             let value = loader().await?;
  500 |             let size = state.entry_size(&value);
  501 |             Ok((Arc::new(value) as CacheEntry, size))
  502 |         });
  503 | 
  504 |         let (entry, was_cached) = self
  505 |             .state
  506 |             .backend
  507 |             .get_or_insert(&key, typed_loader, None)
  508 |             .await?;
  509 |         let entry = entry.downcast::<Arc<K::ValueType>>().map_err(|_| {
  510 |             self.state.misses.fetch_add(1, Ordering::Relaxed);
  511 |             Error::io(format!(
  512 |                 "cache backend returned a value with the wrong concrete type for unsized key type {:?}",
  513 |                 K::stable_type_id()
  514 |             ))
  515 |         })?;
  516 |         if was_cached {
  517 |             self.state.hits.fetch_add(1, Ordering::Relaxed);
  518 |         } else {
  519 |             self.state.misses.fetch_add(1, Ordering::Relaxed);
  520 |         }
  521 |         Ok(entry.as_ref().clone())
  522 |     }
  523 | 
  524 |     pub async fn get_unsized_with_key<K>(&self, cache_key: &K) -> Option<Arc<K::ValueType>>
  525 |     where
  526 |         K: UnsizedCacheKey,
  527 |         K::ValueType: DeepSizeOf + Send + Sync + 'static,
  528 |     {
  529 |         let key = self.unsized_key(cache_key);
  530 |         let Some(entry) = self.state.backend.get(&key, None).await else {
  531 |             self.state.misses.fetch_add(1, Ordering::Relaxed);
  532 |             return None;
  533 |         };
  534 |         match entry.downcast::<Arc<K::ValueType>>() {
  535 |             Ok(value) => {
  536 |                 self.state.hits.fetch_add(1, Ordering::Relaxed);
  537 |                 Some(value.as_ref().clone())
  538 |             }
  539 |             Err(_) => {
  540 |                 // Type mismatch: the backend returned a different concrete
  541 |                 // type than expected (e.g. a disk cache may store
  542 |                 // intermediate state). Treat as a miss.
  543 |                 log::warn!(
  544 |                     "cache backend returned a value with the wrong concrete type for unsized key type {:?}",
  545 |                     K::stable_type_id()
  546 |                 );
  547 |                 self.state.misses.fetch_add(1, Ordering::Relaxed);
  548 |                 None
  549 |             }
  550 |         }
  551 |     }
  552 | 
  553 |     fn sized_key<K: CacheKey>(&self, cache_key: &K) -> InternalCacheKey {
  554 |         let mut builder = KeyBuilder::new(self.namespace, K::stable_type_id(), K::schema());
  555 |         cache_key.write_key(&mut builder);
  556 |         builder.finish()
  557 |     }
  558 | 
  559 |     fn unsized_key<K: UnsizedCacheKey>(&self, cache_key: &K) -> InternalCacheKey {
  560 |         let mut builder = KeyBuilder::new(self.namespace, K::stable_type_id(), K::schema());
  561 |         cache_key.write_key(&mut builder);
  562 |         builder.finish()
  563 |     }
  564 | }
  565 | 
  566 | // ---------------------------------------------------------------------------
  567 | // WeakLanceCache
  568 | // ---------------------------------------------------------------------------
  569 | 
  570 | /// A weak reference to a LanceCache, used by indices to avoid circular references.
  571 | /// When the original cache is dropped, operations on this will gracefully no-op.
  572 | #[derive(Clone, Debug)]
  573 | pub struct WeakLanceCache {
  574 |     state: Weak<CacheState>,
  575 |     namespace: key::CacheNamespace,
  576 | }
  577 | 
  578 | impl WeakLanceCache {
  579 |     pub fn from(cache: &LanceCache) -> Self {
  580 |         Self {
  581 |             state: Arc::downgrade(&cache.state),
  582 |             namespace: cache.namespace,
  583 |         }
  584 |     }
  585 | 
  586 |     pub fn with_key_prefix(&self, prefix: &str) -> Self {
  587 |         Self {
  588 |             state: self.state.clone(),
  589 |             namespace: self.namespace.child(prefix),
  590 |         }
  591 |     }
  592 | 
  593 |     /// Weighted capacity in bytes, if the cache is alive and its backend
  594 |     /// reports one.
  595 |     pub fn capacity_bytes(&self) -> Option<usize> {
  596 |         self.upgrade()?.capacity_bytes()
  597 |     }
  598 | 
  599 |     pub async fn get_with_key<K>(&self, cache_key: &K) -> Option<Arc<K::ValueType>>
  600 |     where
  601 |         K: CacheKey,
  602 |         K::ValueType: DeepSizeOf + Send + Sync + 'static,
  603 |     {
  604 |         self.upgrade()?.get_with_key(cache_key).await
  605 |     }
  606 | 
  607 |     pub async fn insert_with_key<K>(&self, cache_key: &K, value: Arc<K::ValueType>) -> bool
  608 |     where
  609 |         K: CacheKey,
  610 |         K::ValueType: DeepSizeOf + Send + Sync + 'static,
  611 |     {
  612 |         let Some(cache) = self.upgrade() else {
  613 |             log::warn!("WeakLanceCache: cache no longer available, unable to insert item");
  614 |             return false;
  615 |         };
  616 |         cache.insert_with_key(cache_key, value).await;
  617 |         true
  618 |     }
  619 | 
  620 |     /// Get or insert an item, computing it if necessary.
  621 |     ///
  622 |     /// Deduplication of concurrent loads is handled by the backend.
  623 |     pub async fn get_or_insert_with_key<K, F, Fut>(
  624 |         &self,
  625 |         cache_key: K,
  626 |         loader: F,
  627 |     ) -> Result<Arc<K::ValueType>>
  628 |     where
  629 |         K: CacheKey,
  630 |         K::ValueType: DeepSizeOf + Send + Sync + 'static,
  631 |         F: FnOnce() -> Fut + Send,
  632 |         Fut: Future<Output = Result<K::ValueType>> + Send,
  633 |     {
  634 |         self.get_or_insert_with_key_hit(cache_key, loader)
  635 |             .await
  636 |             .map(|(value, _)| value)
  637 |     }
  638 | 
  639 |     /// Same as [`get_or_insert_with_key`](Self::get_or_insert_with_key), but
  640 |     /// also returns a boolean indicating whether the loader was skipped for
  641 |     /// this call. See [`LanceCache::get_or_insert_with_key_hit`] for the
  642 |     /// coalesced-load caveat.
  643 |     pub async fn get_or_insert_with_key_hit<K, F, Fut>(
  644 |         &self,
  645 |         cache_key: K,
  646 |         loader: F,
  647 |     ) -> Result<(Arc<K::ValueType>, bool)>
  648 |     where
  649 |         K: CacheKey,
  650 |         K::ValueType: DeepSizeOf + Send + Sync + 'static,
  651 |         F: FnOnce() -> Fut + Send,
  652 |         Fut: Future<Output = Result<K::ValueType>> + Send,
  653 |     {
  654 |         let Some(cache) = self.upgrade() else {
  655 |             log::warn!("WeakLanceCache: cache no longer available, computing without caching");
  656 |             return loader().await.map(|value| (Arc::new(value), false));
  657 |         };
  658 |         cache.get_or_insert_with_key_hit(cache_key, loader).await
  659 |     }
  660 | 
  661 |     pub async fn get_unsized_with_key<K>(&self, cache_key: &K) -> Option<Arc<K::ValueType>>
  662 |     where
  663 |         K: UnsizedCacheKey,
  664 |         K::ValueType: DeepSizeOf + Send + Sync + 'static,
  665 |     {
  666 |         self.upgrade()?.get_unsized_with_key(cache_key).await
  667 |     }
  668 | 
  669 |     pub async fn insert_unsized_with_key<K>(&self, cache_key: &K, value: Arc<K::ValueType>)
  670 |     where
  671 |         K: UnsizedCacheKey,
  672 |         K::ValueType: DeepSizeOf + Send + Sync + 'static,
  673 |     {
  674 |         let Some(cache) = self.upgrade() else {
  675 |             log::warn!("WeakLanceCache: cache no longer available, unable to insert unsized item");
  676 |             return;
  677 |         };
  678 |         cache.insert_unsized_with_key(cache_key, value).await;
  679 |     }
  680 | 
  681 |     fn upgrade(&self) -> Option<LanceCache> {
  682 |         Some(LanceCache {
  683 |             state: self.state.upgrade()?,
  684 |             namespace: self.namespace,
  685 |         })
  686 |     }
  687 | }
  688 | 
  689 | // ---------------------------------------------------------------------------
  690 | // CacheStats
  691 | // ---------------------------------------------------------------------------
  692 | 
  693 | #[derive(Debug, Clone)]
  694 | pub struct CacheStats {
  695 |     /// Number of times `get`, `get_unsized`, or `get_or_insert` found an item in the cache.
  696 |     pub hits: u64,
  697 |     /// Number of times `get`, `get_unsized`, or `get_or_insert` did not find an item in the cache.
  698 |     pub misses: u64,
  699 |     /// Number of entries currently in the cache.
  700 |     pub num_entries: usize,
  701 |     /// Total size in bytes of all entries in the cache.
  702 |     pub size_bytes: usize,
  703 | }
  704 | 
  705 | impl CacheStats {
  706 |     pub fn hit_ratio(&self) -> f32 {
  707 |         if self.hits + self.misses == 0 {
  708 |             0.0
  709 |         } else {
  710 |             self.hits as f32 / (self.hits + self.misses) as f32
  711 |         }
  712 |     }
  713 | 
  714 |     pub fn miss_ratio(&self) -> f32 {
  715 |         if self.hits + self.misses == 0 {
  716 |             0.0
  717 |         } else {
  718 |             self.misses as f32 / (self.hits + self.misses) as f32
  719 |         }
  720 |     }
  721 | }
  722 | 
  723 | #[cfg(test)]
  724 | mod tests {
  725 |     use std::collections::HashMap;
  726 |     use std::pin::Pin;
  727 |     use std::sync::{
  728 |         atomic::{AtomicUsize, Ordering},
  729 |         mpsc,
  730 |     };
  731 |     use std::task::Poll;
  732 |     use std::thread;
  733 |     use std::time::Duration;
  734 | 
  735 |     use super::*;
  736 | 
  737 |     async fn report_first_pending<F>(
  738 |         future: F,
  739 |         parked: tokio::sync::oneshot::Sender<()>,
  740 |     ) -> F::Output
  741 |     where
  742 |         F: Future,
  743 |     {
  744 |         tokio::pin!(future);
  745 |         let mut parked = Some(parked);
  746 |         futures::future::poll_fn(|cx| match future.as_mut().poll(cx) {
  747 |             Poll::Pending => {
  748 |                 if let Some(parked) = parked.take() {
  749 |                     let _ = parked.send(());
  750 |                 }
  751 |                 Poll::Pending
  752 |             }
  753 |             Poll::Ready(output) => Poll::Ready(output),
  754 |         })
  755 |         .await
  756 |     }
  757 | 
  758 |     #[derive(Clone)]
  759 |     struct VersionedTestKey<const SCHEMA_VERSION: u32> {
  760 |         id: u64,
  761 |     }
  762 | 
  763 |     type TestKey = VersionedTestKey<1>;
  764 |     type TestKeyV2 = VersionedTestKey<2>;
  765 | 
  766 |     impl<const SCHEMA_VERSION: u32> VersionedTestKey<SCHEMA_VERSION> {
  767 |         fn new(id: u64) -> Self {
  768 |             Self { id }
  769 |         }
  770 |     }
  771 | 
  772 |     impl<const SCHEMA_VERSION: u32> CacheKey for VersionedTestKey<SCHEMA_VERSION> {
  773 |         type ValueType = Vec<u32>;
  774 | 
  775 |         fn key(&self) -> Cow<'_, str> {
  776 |             self.id.to_string().into()
  777 |         }
  778 | 
  779 |         fn type_name() -> &'static str {
  780 |             "test.VecU32"
  781 |         }
  782 | 
  783 |         fn schema() -> CacheKeySchema {
  784 |             CacheKeySchema::new("test.vec-u32-key", SCHEMA_VERSION)
  785 |         }
  786 | 
  787 |         fn write_key(&self, builder: &mut KeyBuilder) {
  788 |             builder.write_u64(self.id);
  789 |         }
  790 |     }
  791 | 
  792 |     struct SharedTestValue {
  793 |         data: Arc<Vec<u8>>,
  794 |     }
  795 | 
  796 |     impl DeepSizeOf for SharedTestValue {
  797 |         fn deep_size_of_children(&self, context: &mut Context) -> usize {
  798 |             self.data.deep_size_of_children(context)
  799 |         }
  800 |     }
  801 | 
  802 |     struct SharedTestKey(u64);
  803 | 
  804 |     impl CacheKey for SharedTestKey {
  805 |         type ValueType = SharedTestValue;
  806 | 
  807 |         fn key(&self) -> Cow<'_, str> {
  808 |             self.0.to_string().into()
  809 |         }
  810 | 
  811 |         fn type_name() -> &'static str {
  812 |             "test.SharedValue"
  813 |         }
  814 | 
  815 |         fn schema() -> CacheKeySchema {
  816 |             CacheKeySchema::new("test.shared-value-key", 1)
  817 |         }
  818 | 
  819 |         fn write_key(&self, builder: &mut KeyBuilder) {
  820 |             builder.write_u64(self.0);
  821 |         }
  822 |     }
  823 | 
  824 |     struct ReentrantValue(LanceCache);
  825 | 
  826 |     impl DeepSizeOf for ReentrantValue {
  827 |         fn deep_size_of_children(&self, context: &mut Context) -> usize {
  828 |             self.0.deep_size_of_children(context)
  829 |         }
  830 |     }
  831 | 
  832 |     struct ReentrantKey;
  833 | 
  834 |     impl CacheKey for ReentrantKey {
  835 |         type ValueType = ReentrantValue;
  836 | 
  837 |         fn key(&self) -> Cow<'_, str> {
  838 |             Cow::Borrowed("reentrant")
  839 |         }
  840 | 
  841 |         fn type_name() -> &'static str {
  842 |             "test.ReentrantValue"
  843 |         }
  844 |     }
  845 | 
  846 |     #[derive(Clone, Copy, Debug)]
  847 |     enum TestBackendKind {
  848 |         Moka,
  849 |         Quick,
  850 |     }
  851 | 
  852 |     impl TestBackendKind {
  853 |         fn cache(self, capacity: usize) -> LanceCache {
  854 |             match self {
  855 |                 Self::Moka => LanceCache::with_capacity(capacity),
  856 |                 Self::Quick => {
  857 |                     LanceCache::with_backend(Arc::new(QuickCacheBackend::with_capacity(capacity)))
  858 |                 }
  859 |             }
  860 |         }
  861 |     }
  862 | 
  863 |     struct LegacyBridgeKey(&'static str);
  864 | 
  865 |     impl CacheKey for LegacyBridgeKey {
  866 |         type ValueType = Vec<u32>;
  867 | 
  868 |         fn key(&self) -> Cow<'_, str> {
  869 |             Cow::Borrowed(self.0)
  870 |         }
  871 | 
  872 |         fn type_name() -> &'static str {
  873 |             "test.LegacyBridge"
  874 |         }
  875 |     }
  876 | 
  877 |     struct ExplicitBridgeKey(&'static str);
  878 | 
  879 |     impl CacheKey for ExplicitBridgeKey {
  880 |         type ValueType = Vec<u32>;
  881 | 
  882 |         fn key(&self) -> Cow<'_, str> {
  883 |             Cow::Borrowed(self.0)
  884 |         }
  885 | 
  886 |         fn type_name() -> &'static str {
  887 |             "test.LegacyBridge"
  888 |         }
  889 | 
  890 |         fn write_key(&self, builder: &mut KeyBuilder) {
  891 |             builder.write_str(self.0);
  892 |         }
  893 |     }
  894 | 
  895 |     trait TestDynValue: DeepSizeOf + Send + Sync {
  896 |         fn values(&self) -> &[u32];
  897 |     }
  898 | 
  899 |     impl TestDynValue for Vec<u32> {
  900 |         fn values(&self) -> &[u32] {
  901 |             self
  902 |         }
  903 |     }
  904 | 
  905 |     struct LegacyUnsizedBridgeKey(&'static str);
  906 | 
  907 |     impl UnsizedCacheKey for LegacyUnsizedBridgeKey {
  908 |         type ValueType = dyn TestDynValue;
  909 | 
  910 |         fn key(&self) -> Cow<'_, str> {
  911 |             Cow::Borrowed(self.0)
  912 |         }
  913 | 
  914 |         fn type_name() -> &'static str {
  915 |             "test.LegacyUnsizedBridge"
  916 |         }
  917 |     }
  918 | 
  919 |     struct ExplicitUnsizedBridgeKey(&'static str);
  920 | 
  921 |     impl UnsizedCacheKey for ExplicitUnsizedBridgeKey {
  922 |         type ValueType = dyn TestDynValue;
  923 | 
  924 |         fn key(&self) -> Cow<'_, str> {
  925 |             Cow::Borrowed(self.0)
  926 |         }
  927 | 
  928 |         fn type_name() -> &'static str {
  929 |             "test.LegacyUnsizedBridge"
  930 |         }
  931 | 
  932 |         fn write_key(&self, builder: &mut KeyBuilder) {
  933 |             builder.write_str(self.0);
  934 |         }
  935 |     }
  936 | 
  937 |     #[derive(Debug, Default)]
  938 |     struct HashMapBackend {
  939 |         entries: tokio::sync::Mutex<HashMap<InternalCacheKey, (CacheEntry, usize)>>,
  940 |     }
  941 | 
  942 |     #[async_trait::async_trait]
  943 |     impl CacheBackend for HashMapBackend {
  944 |         async fn get(
  945 |             &self,
  946 |             key: &InternalCacheKey,
  947 |             _codec: Option<CacheCodec>,
  948 |         ) -> Option<CacheEntry> {
  949 |             self.entries
  950 |                 .lock()
  951 |                 .await
  952 |                 .get(key)
  953 |                 .map(|(entry, _)| entry.clone())
  954 |         }
  955 | 
  956 |         async fn insert(
  957 |             &self,
  958 |             key: &InternalCacheKey,
  959 |             entry: CacheEntry,
  960 |             size_bytes: usize,
  961 |             _codec: Option<CacheCodec>,
  962 |         ) {
  963 |             self.entries.lock().await.insert(*key, (entry, size_bytes));
  964 |         }
  965 | 
  966 |         async fn get_or_insert<'a>(
  967 |             &self,
  968 |             key: &InternalCacheKey,
  969 |             loader: Pin<Box<dyn Future<Output = Result<(CacheEntry, usize)>> + Send + 'a>>,
  970 |             codec: Option<CacheCodec>,
  971 |         ) -> Result<(CacheEntry, bool)> {
  972 |             if let Some(entry) = self.get(key, codec).await {
  973 |                 return Ok((entry, true));
  974 |             }
  975 |             let (entry, size_bytes) = loader.await?;
  976 |             self.insert(key, entry.clone(), size_bytes, codec).await;
  977 |             Ok((entry, false))
  978 |         }
  979 | 
  980 |         async fn clear(&self) {
  981 |             self.entries.lock().await.clear();
  982 |         }
  983 | 
  984 |         async fn num_entries(&self) -> usize {
  985 |             self.entries.lock().await.len()
  986 |         }
  987 | 
  988 |         async fn size_bytes(&self) -> usize {
  989 |             self.entries
  990 |                 .lock()
  991 |                 .await
  992 |                 .values()
  993 |                 .map(|(_, size_bytes)| size_bytes)
  994 |                 .sum()
  995 |         }
  996 |     }
  997 | 
  998 |     #[derive(Debug)]
  999 |     struct WrongTypeBackend;
 1000 | 
 1001 |     #[async_trait::async_trait]
 1002 |     impl CacheBackend for WrongTypeBackend {
 1003 |         async fn get(
 1004 |             &self,
 1005 |             _key: &InternalCacheKey,
 1006 |             _codec: Option<CacheCodec>,
 1007 |         ) -> Option<CacheEntry> {
 1008 |             Some(Arc::new(String::from("wrong type")))
 1009 |         }
 1010 | 
 1011 |         async fn insert(
 1012 |             &self,
 1013 |             _key: &InternalCacheKey,
 1014 |             _entry: CacheEntry,
 1015 |             _size_bytes: usize,
 1016 |             _codec: Option<CacheCodec>,
 1017 |         ) {
 1018 |         }
 1019 | 
 1020 |         async fn get_or_insert<'a>(
 1021 |             &self,
 1022 |             _key: &InternalCacheKey,
 1023 |             _loader: Pin<Box<dyn Future<Output = Result<(CacheEntry, usize)>> + Send + 'a>>,
 1024 |             _codec: Option<CacheCodec>,
 1025 |         ) -> Result<(CacheEntry, bool)> {
 1026 |             Ok((Arc::new(String::from("wrong type")), true))
 1027 |         }
 1028 | 
 1029 |         async fn clear(&self) {}
 1030 | 
 1031 |         async fn num_entries(&self) -> usize {
 1032 |             0
 1033 |         }
 1034 | 
 1035 |         async fn size_bytes(&self) -> usize {
 1036 |             0
 1037 |         }
 1038 |     }
 1039 | 
 1040 |     #[tokio::test]
 1041 |     async fn typed_roundtrip_stats_clear_and_namespace_isolation() {
 1042 |         let cache = LanceCache::with_capacity(4096);
 1043 |         let left = cache.with_key_prefix("left");
 1044 |         let right = cache.with_key_prefix("right");
 1045 |         left.insert_with_key(&TestKey::new(7), Arc::new(vec![1, 2, 3]))
 1046 |             .await;
 1047 | 
 1048 |         assert_eq!(
 1049 |             left.get_with_key(&TestKey::new(7)).await.as_deref(),
 1050 |             Some(&vec![1, 2, 3])
 1051 |         );
 1052 |         assert!(right.get_with_key(&TestKey::new(7)).await.is_none());
 1053 |         let stats = cache.stats().await;
 1054 |         assert_eq!((stats.hits, stats.misses, stats.num_entries), (1, 1, 1));
 1055 | 
 1056 |         cache.clear().await;
 1057 |         let stats = left.stats().await;
 1058 |         assert_eq!((stats.hits, stats.misses, stats.num_entries), (0, 0, 0));
 1059 |     }
 1060 | 
 1061 |     #[tokio::test]
 1062 |     async fn strong_and_weak_handles_share_state_and_namespace() {
 1063 |         let cache = LanceCache::with_capacity(4096);
 1064 |         let child = cache.with_key_prefix("child");
 1065 |         let weak = WeakLanceCache::from(&child);
 1066 | 
 1067 |         assert!(
 1068 |             weak.insert_with_key(&TestKey::new(1), Arc::new(vec![1]))
 1069 |                 .await
 1070 |         );
 1071 |         assert_eq!(
 1072 |             child.get_with_key(&TestKey::new(1)).await.as_deref(),
 1073 |             Some(&vec![1])
 1074 |         );
 1075 |         child
 1076 |             .insert_with_key(&TestKey::new(2), Arc::new(vec![2]))
 1077 |             .await;
 1078 |         assert_eq!(
 1079 |             weak.get_with_key(&TestKey::new(2)).await.as_deref(),
 1080 |             Some(&vec![2])
 1081 |         );
 1082 |         assert_eq!((cache.stats().await.hits, cache.size().await), (2, 2));
 1083 |     }
 1084 | 
 1085 |     #[tokio::test]
 1086 |     async fn nested_namespace_segments_do_not_alias_combined_segments() {
 1087 |         let cache = LanceCache::with_capacity(4096);
 1088 |         let nested = cache.with_key_prefix("a").with_key_prefix("b");
 1089 |         let combined = cache.with_key_prefix("a/b");
 1090 |         nested
 1091 |             .insert_with_key(&TestKey::new(1), Arc::new(vec![10]))
 1092 |             .await;
 1093 |         assert!(combined.get_with_key(&TestKey::new(1)).await.is_none());
 1094 |     }
 1095 | 
 1096 |     #[tokio::test]
 1097 |     async fn schema_change_produces_a_cold_miss() {
 1098 |         let cache = LanceCache::with_capacity(4096);
 1099 |         cache
 1100 |             .insert_with_key(&TestKey::new(1), Arc::new(vec![10]))
 1101 |             .await;
 1102 |         assert!(cache.get_with_key(&TestKeyV2::new(1)).await.is_none());
 1103 |     }
 1104 | 
 1105 |     #[tokio::test]
 1106 |     async fn get_or_insert_with_key_hit_reports_loader_execution() {
 1107 |         let cache = LanceCache::with_capacity(4096);
 1108 | 
 1109 |         // Cold: loader runs, was_cached = false.
 1110 |         let (value, was_cached) = cache
 1111 |             .get_or_insert_with_key_hit(TestKey::new(1), || async { Ok(vec![1, 2, 3]) })
 1112 |             .await
 1113 |             .unwrap();
 1114 |         assert_eq!(*value, vec![1, 2, 3]);
 1115 |         assert!(!was_cached);
 1116 | 
 1117 |         // Warm: loader must not run and was_cached = true.
 1118 |         let (value, was_cached) = cache
 1119 |             .get_or_insert_with_key_hit(TestKey::new(1), || async {
 1120 |                 panic!("should not be called")
 1121 |             })
 1122 |             .await
 1123 |             .unwrap();
 1124 |         assert_eq!(*value, vec![1, 2, 3]);
 1125 |         assert!(was_cached);
 1126 |     }
 1127 | 
 1128 |     #[tokio::test]
 1129 |     async fn default_string_bridge_matches_explicit_legacy_encoding() {
 1130 |         let cache = LanceCache::with_capacity(4096);
 1131 |         cache
 1132 |             .insert_with_key(&LegacyBridgeKey("same"), Arc::new(vec![10]))
 1133 |             .await;
 1134 |         assert_eq!(
 1135 |             cache
 1136 |                 .get_with_key(&ExplicitBridgeKey("same"))
 1137 |                 .await
 1138 |                 .as_deref(),
 1139 |             Some(&vec![10])
 1140 |         );
 1141 |     }
 1142 | 
 1143 |     #[tokio::test]
 1144 |     async fn unsized_default_string_bridge_matches_explicit_legacy_encoding() {
 1145 |         let cache = LanceCache::with_capacity(4096);
 1146 |         let value: Arc<dyn TestDynValue> = Arc::new(vec![10, 20]);
 1147 |         cache
 1148 |             .insert_unsized_with_key(&LegacyUnsizedBridgeKey("same"), value)
 1149 |             .await;
 1150 | 
 1151 |         let cached = cache
 1152 |             .get_unsized_with_key(&ExplicitUnsizedBridgeKey("same"))
 1153 |             .await
 1154 |             .unwrap();
 1155 |         assert_eq!(cached.values(), &[10, 20]);
 1156 |     }
 1157 | 
 1158 |     #[tokio::test]
 1159 |     async fn custom_backend_receives_opaque_keys_and_shared_clear() {
 1160 |         let backend = Arc::new(HashMapBackend::default());
 1161 |         let cache = LanceCache::with_backend(backend.clone());
 1162 |         let child = cache.with_key_prefix("child");
 1163 |         let value = Arc::new(vec![1, 2, 3]);
 1164 |         let value_size = cache_entry_size(value.as_ref());
 1165 | 
 1166 |         child.insert_with_key(&TestKey::new(7), value).await;
 1167 |         assert_eq!(
 1168 |             child.get_with_key(&TestKey::new(7)).await.as_deref(),
 1169 |             Some(&vec![1, 2, 3])
 1170 |         );
 1171 |         assert_eq!(backend.entries.lock().await.len(), 1);
 1172 |         assert_eq!(cache.size_bytes().await, value_size);
 1173 | 
 1174 |         cache.clear().await;
 1175 |         assert!(backend.entries.lock().await.is_empty());
 1176 |         assert_eq!(child.stats().await.hits, 0);
 1177 |     }
 1178 | 
 1179 |     #[tokio::test]
 1180 |     async fn backend_type_collisions_are_contextual_misses_or_errors() {
 1181 |         let cache = LanceCache::with_backend(Arc::new(WrongTypeBackend));
 1182 | 
 1183 |         assert!(cache.get_with_key(&TestKey::new(1)).await.is_none());
 1184 |         let error = cache
 1185 |             .get_or_insert_with_key(TestKey::new(2), || async { Ok(vec![2]) })
 1186 |             .await
 1187 |             .unwrap_err();
 1188 |         assert!(error.to_string().contains("test.VecU32"));
 1189 |         let stats = cache.stats().await;
 1190 |         assert_eq!((stats.hits, stats.misses), (0, 2));
 1191 |     }
 1192 | 
 1193 |     #[tokio::test]
 1194 |     async fn moka_weight_includes_the_fixed_physical_key() {
 1195 |         let value = Arc::new(vec![0_u32; 3]);
 1196 |         let expected = cache_entry_size(value.as_ref())
 1197 |             .checked_add(std::mem::size_of::<InternalCacheKey>())
 1198 |             .unwrap();
 1199 |         let cache = LanceCache::with_capacity(expected * 2);
 1200 |         cache.insert_with_key(&TestKey::new(1), value).await;
 1201 |         assert_eq!(cache.size_bytes().await, expected);
 1202 |     }
 1203 | 
 1204 |     #[rstest::rstest]
 1205 |     #[case::moka(TestBackendKind::Moka)]
 1206 |     #[case::quick(TestBackendKind::Quick)]
 1207 |     #[tokio::test]
 1208 |     async fn deep_size_deduplicates_shared_entry_allocations(
 1209 |         #[case] backend_kind: TestBackendKind,
 1210 |     ) {
 1211 |         let cache = backend_kind.cache(1 << 20);
 1212 |         let shared_data = Arc::new(vec![0_u8; 1024]);
 1213 | 
 1214 |         for id in 0..2 {
 1215 |             let data = shared_data.clone();
 1216 |             cache
 1217 |                 .get_or_insert_with_key(SharedTestKey(id), || async move {
 1218 |                     Ok(SharedTestValue { data })
 1219 |                 })
 1220 |                 .await
 1221 |                 .unwrap();
 1222 |         }
 1223 | 
 1224 |         let arc_overhead = std::mem::size_of::<AtomicUsize>() * 2;
 1225 |         let shared_allocation = std::mem::size_of::<Vec<u8>>() + shared_data.capacity();
 1226 |         let expected_entries = 2 * std::mem::size_of::<InternalCacheKey>()
 1227 |             + 2 * (std::mem::size_of::<SharedTestValue>() + arc_overhead)
 1228 |             + shared_allocation;
 1229 | 
 1230 |         let weighted_size = cache.size_bytes().await;
 1231 |         assert_eq!(weighted_size, expected_entries + shared_allocation);
 1232 |         assert_eq!(
 1233 |             cache.deep_size_of(),
 1234 |             std::mem::size_of::<LanceCache>() + expected_entries
 1235 |         );
 1236 | 
 1237 |         let mut context = Context::new();
 1238 |         assert_eq!(cache.deep_size_of_children(&mut context), expected_entries);
 1239 |         assert_eq!(
 1240 |             cache
 1241 |                 .with_key_prefix("another-handle")
 1242 |                 .deep_size_of_children(&mut context),
 1243 |             0
 1244 |         );
 1245 |     }
 1246 | 
 1247 |     #[test]
 1248 |     fn sizing_can_reenter_the_same_cache() {
 1249 |         let (done_tx, done_rx) = mpsc::channel();
 1250 |         let worker = thread::spawn(move || {
 1251 |             let runtime = tokio::runtime::Builder::new_current_thread()
 1252 |                 .enable_all()
 1253 |                 .build()
 1254 |                 .unwrap();
 1255 |             runtime.block_on(async move {
 1256 |                 let cache = LanceCache::with_capacity(4096);
 1257 |                 cache
 1258 |                     .insert_with_key(&ReentrantKey, Arc::new(ReentrantValue(cache.clone())))
 1259 |                     .await;
 1260 |                 done_tx.send(()).unwrap();
 1261 |             });
 1262 |         });
 1263 | 
 1264 |         done_rx
 1265 |             .recv_timeout(Duration::from_secs(1))
 1266 |             .expect("cache insertion deadlocked during sizing");
 1267 |         worker.join().unwrap();
 1268 |     }
 1269 | 
 1270 |     #[tokio::test]
 1271 |     async fn no_cache_computes_each_time() {
 1272 |         let cache = LanceCache::no_cache();
 1273 |         let loads = Arc::new(AtomicUsize::new(0));
 1274 |         for _ in 0..2 {
 1275 |             let loads = loads.clone();
 1276 |             let value = cache
 1277 |                 .get_or_insert_with_key(TestKey::new(1), move || async move {
 1278 |                     loads.fetch_add(1, Ordering::SeqCst);
 1279 |                     Ok(vec![42])
 1280 |                 })
 1281 |                 .await
 1282 |                 .unwrap();
 1283 |             assert_eq!(value.as_slice(), &[42]);
 1284 |         }
 1285 |         assert_eq!(loads.load(Ordering::SeqCst), 2);
 1286 |         assert_eq!(cache.size().await, 0);
 1287 |     }
 1288 | 
 1289 |     #[tokio::test(flavor = "multi_thread", worker_threads = 2)]
 1290 |     async fn single_flight_coalesces_success_after_contenders_are_parked() {
 1291 |         const CONTENDERS: usize = 4;
 1292 | 
 1293 |         let cache = Arc::new(LanceCache::with_capacity(4096));
 1294 |         let loader_calls = Arc::new(AtomicUsize::new(0));
 1295 |         let release = Arc::new(tokio::sync::Notify::new());
 1296 |         let (started_tx, started_rx) = tokio::sync::oneshot::channel();
 1297 | 
 1298 |         let owner = {
 1299 |             let cache = cache.clone();
 1300 |             let loader_calls = loader_calls.clone();
 1301 |             let release = release.clone();
 1302 |             tokio::spawn(async move {
 1303 |                 cache
 1304 |                     .get_or_insert_with_key(TestKey::new(10), move || async move {
 1305 |                         loader_calls.fetch_add(1, Ordering::SeqCst);
 1306 |                         let _ = started_tx.send(());
 1307 |                         release.notified().await;
 1308 |                         Ok(vec![10])
 1309 |                     })
 1310 |                     .await
 1311 |             })
 1312 |         };
 1313 |         started_rx.await.unwrap();
 1314 | 
 1315 |         let mut contenders = Vec::new();
 1316 |         let mut parked = Vec::new();
 1317 |         for _ in 0..CONTENDERS {
 1318 |             let cache = cache.clone();
 1319 |             let loader_calls = loader_calls.clone();
 1320 |             let (parked_tx, parked_rx) = tokio::sync::oneshot::channel();
 1321 |             parked.push(parked_rx);
 1322 |             contenders.push(tokio::spawn(async move {
 1323 |                 report_first_pending(
 1324 |                     cache.get_or_insert_with_key(TestKey::new(10), move || async move {
 1325 |                         loader_calls.fetch_add(1, Ordering::SeqCst);
 1326 |                         Ok(vec![99])
 1327 |                     }),
 1328 |                     parked_tx,
 1329 |                 )
 1330 |                 .await
 1331 |             }));
 1332 |         }
 1333 |         for parked in parked {
 1334 |             parked
 1335 |                 .await
 1336 |                 .expect("contender completed instead of parking behind owner");
 1337 |         }
 1338 |         assert_eq!(loader_calls.load(Ordering::SeqCst), 1);
 1339 |         assert!(contenders.iter().all(|handle| !handle.is_finished()));
 1340 | 
 1341 |         release.notify_one();
 1342 |         assert_eq!(owner.await.unwrap().unwrap().as_slice(), &[10]);
 1343 |         for contender in contenders {
 1344 |             assert_eq!(contender.await.unwrap().unwrap().as_slice(), &[10]);
 1345 |         }
 1346 |         let stats = cache.stats().await;
 1347 |         assert_eq!((stats.hits, stats.misses), (CONTENDERS as u64, 1),);
 1348 |     }
 1349 | 
 1350 |     #[tokio::test(flavor = "multi_thread", worker_threads = 2)]
 1351 |     async fn single_flight_coalesces_errors_after_contenders_are_parked() {
 1352 |         const CONTENDERS: usize = 4;
 1353 | 
 1354 |         let cache = Arc::new(LanceCache::with_capacity(4096));
 1355 |         let loader_calls = Arc::new(AtomicUsize::new(0));
 1356 |         let release = Arc::new(tokio::sync::Notify::new());
 1357 |         let (started_tx, started_rx) = tokio::sync::oneshot::channel();
 1358 | 
 1359 |         let owner = {
 1360 |             let cache = cache.clone();
 1361 |             let loader_calls = loader_calls.clone();
 1362 |             let release = release.clone();
 1363 |             tokio::spawn(async move {
 1364 |                 cache
 1365 |                     .get_or_insert_with_key(TestKey::new(20), move || async move {
 1366 |                         loader_calls.fetch_add(1, Ordering::SeqCst);
 1367 |                         let _ = started_tx.send(());
 1368 |                         release.notified().await;
 1369 |                         Err(Error::timeout("owner loader timed out"))
 1370 |                     })
 1371 |                     .await
 1372 |             })
 1373 |         };
 1374 |         started_rx.await.unwrap();
 1375 | 
 1376 |         let mut contenders = Vec::new();
 1377 |         let mut parked = Vec::new();
 1378 |         for _ in 0..CONTENDERS {
 1379 |             let cache = cache.clone();
 1380 |             let loader_calls = loader_calls.clone();
 1381 |             let (parked_tx, parked_rx) = tokio::sync::oneshot::channel();
 1382 |             parked.push(parked_rx);
 1383 |             contenders.push(tokio::spawn(async move {
 1384 |                 report_first_pending(
 1385 |                     cache.get_or_insert_with_key(TestKey::new(20), move || async move {
 1386 |                         loader_calls.fetch_add(1, Ordering::SeqCst);
 1387 |                         Err(Error::timeout("contender loader timed out"))
 1388 |                     }),
 1389 |                     parked_tx,
 1390 |                 )
 1391 |                 .await
 1392 |             }));
 1393 |         }
 1394 |         for parked in parked {
 1395 |             parked
 1396 |                 .await
 1397 |                 .expect("contender completed instead of parking behind owner");
 1398 |         }
 1399 |         assert_eq!(loader_calls.load(Ordering::SeqCst), 1);
 1400 |         assert!(contenders.iter().all(|handle| !handle.is_finished()));
 1401 | 
 1402 |         release.notify_one();
 1403 |         assert!(matches!(owner.await.unwrap(), Err(Error::Timeout { .. })));
 1404 |         for contender in contenders {
 1405 |             assert!(matches!(
 1406 |                 contender.await.unwrap(),
 1407 |                 Err(Error::Timeout { .. })
 1408 |             ));
 1409 |         }
 1410 |         assert_eq!(loader_calls.load(Ordering::SeqCst), 1);
 1411 |     }
 1412 | 
 1413 |     #[tokio::test(flavor = "multi_thread", worker_threads = 2)]
 1414 |     async fn single_flight_retries_after_the_owner_is_cancelled() {
 1415 |         let cache = Arc::new(LanceCache::with_capacity(4096));
 1416 |         let loader_calls = Arc::new(AtomicUsize::new(0));
 1417 |         let (started_tx, started_rx) = tokio::sync::oneshot::channel();
 1418 | 
 1419 |         let owner = {
 1420 |             let cache = cache.clone();
 1421 |             let loader_calls = loader_calls.clone();
 1422 |             tokio::spawn(async move {
 1423 |                 cache
 1424 |                     .get_or_insert_with_key(TestKey::new(30), move || async move {
 1425 |                         loader_calls.fetch_add(1, Ordering::SeqCst);
 1426 |                         let _ = started_tx.send(());
 1427 |                         std::future::pending::<()>().await;
 1428 |                         Ok(vec![30])
 1429 |                     })
 1430 |                     .await
 1431 |             })
 1432 |         };
 1433 |         started_rx.await.unwrap();
 1434 | 
 1435 |         let (parked_tx, parked_rx) = tokio::sync::oneshot::channel();
 1436 |         let contender = {
 1437 |             let cache = cache.clone();
 1438 |             let loader_calls = loader_calls.clone();
 1439 |             tokio::spawn(async move {
 1440 |                 report_first_pending(
 1441 |                     cache.get_or_insert_with_key(TestKey::new(30), move || async move {
 1442 |                         loader_calls.fetch_add(1, Ordering::SeqCst);
 1443 |                         Ok(vec![31])
 1444 |                     }),
 1445 |                     parked_tx,
 1446 |                 )
 1447 |                 .await
 1448 |             })
 1449 |         };
 1450 |         parked_rx
 1451 |             .await
 1452 |             .expect("contender completed instead of parking behind owner");
 1453 |         assert_eq!(loader_calls.load(Ordering::SeqCst), 1);
 1454 |         assert!(!contender.is_finished());
 1455 | 
 1456 |         owner.abort();
 1457 |         assert!(owner.await.unwrap_err().is_cancelled());
 1458 |         let value = tokio::time::timeout(std::time::Duration::from_secs(5), contender)
 1459 |             .await
 1460 |             .expect("contender remained parked after owner cancellation")
 1461 |             .unwrap()
 1462 |             .unwrap();
 1463 |         assert_eq!(value.as_slice(), &[31]);
 1464 |         assert_eq!(loader_calls.load(Ordering::SeqCst), 2);
 1465 |     }
 1466 | 
 1467 |     #[tokio::test]
 1468 |     async fn expired_weak_cache_degrades_without_retaining_state() {
 1469 |         let cache = LanceCache::with_capacity(4096);
 1470 |         let weak = WeakLanceCache::from(&cache);
 1471 |         drop(cache);
 1472 | 
 1473 |         assert!(weak.get_with_key(&TestKey::new(1)).await.is_none());
 1474 |         assert!(
 1475 |             !weak
 1476 |                 .insert_with_key(&TestKey::new(1), Arc::new(vec![1]))
 1477 |                 .await
 1478 |         );
 1479 |         let value = weak
 1480 |             .get_or_insert_with_key(TestKey::new(1), || async { Ok(vec![7]) })
 1481 |             .await
 1482 |             .unwrap();
 1483 |         assert_eq!(value.as_slice(), &[7]);
 1484 |     }
 1485 | }
``````
