> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-core/src/utils/testing.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `3846241a280eda17bb5ee27fc24efc810220d0bf86ae7703b30f0509b63672ea`. Reviewed physical lines: 1-300.

[Module](../../../../../L1-modules/rust-lance-core-control-testing.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public test-support ObjectStore wrappers: named before-operation and metadata-transform policies, plus atomic listing-call counts. Despite testing name, the module is exported without a cfg(test) gate. Synchronous policy closures can inject core errors or transform metadata around delegated async/stream operations. (rust/lance-core/src/utils/testing.rs:1-300)

## Complete range analysis

### Lines 1-26

SPDX/testing module docs precede core Result, async_trait, Bytes, boxed streams/stream combinators, object-store options/results/payload/path/metadata interfaces, HashMap/Debug/future/Range/Pin and shared Mutex/AtomicUsize imports. These imports expose external IO abstractions; this file does not implement a storage backend. (rust/lance-core/src/utils/testing.rs:1-26)

### Lines 27-48

Public PolicyFnT is Fn(&str,&Path)->core Result<()> plus Send+Sync, with blanket implementation for matching closures. Its dyn Debug prints literal PolicyFn. Private PolicyFn alias is Arc<dyn PolicyFnT>. Public ObjectMetaPolicyFnT similarly consumes ObjectMeta and returns transformed metadata in core Result, with its own blanket implementation/private Arc alias and the same Debug text. Neither trait adds a named method beyond Fn invocation. (rust/lance-core/src/utils/testing.rs:27-48)

### Lines 49-67

Public ProxyObjectStorePolicy derives Debug/Default and owns two private HashMaps keyed by user-assigned policy name: before-operation closures and metadata transformations. Before closures can block a delegated operation by returning an error; metadata closures can alter a returned ObjectMeta. Documentation says source path is passed for copy-like operations. Map iteration does not guarantee policy execution order. (rust/lance-core/src/utils/testing.rs:49-67)

### Lines 68-88

new returns Default empty maps. set_before_policy and set_obj_meta_policy replace any same-name entry; clear_before_policy silently removes if present. There is no corresponding public clear metadata-policy method here. These methods require &mut self, ordinarily obtained through the shared external Mutex. Public signatures use private Arc aliases whose underlying public trait bounds define closure compatibility. (rust/lance-core/src/utils/testing.rs:68-88)

### Lines 89-112

ProxyObjectStore derives Debug and owns target Arc<dyn ObjectStore> plus shared Arc<Mutex<ProxyObjectStorePolicy>>; public new merely stores both. Private before_method locks with unwrap, iterates all before policies in unspecified HashMap order, converts core Error to object_store Error and short-circuits on first error. Closures run synchronously while the lock is held; recursive access can deadlock, panic can poison, and no target await occurs under this helper's guard. The all-calls documentation must be read against actual overrides below. (rust/lance-core/src/utils/testing.rs:89-112)

### Lines 113-128

transform_meta takes ownership of metadata, locks the shared policy mutex, and chains each transform in unspecified map order, converting/returning the first error. Earlier transforms may already have side effects; no rollback exists. Display emits ProxyObjectStore(target-display), while derived Debug also includes policy state through dyn closure Debug text. (rust/lance-core/src/utils/testing.rs:113-128)

### Lines 129-158

CountingObjectStore derives Debug and owns target plus shared Arc<AtomicUsize>. new preserves the caller's counter value rather than resetting it. record_listing adds one with SeqCst. Private delegate_list forwards target.list with an explicit pinned Send stream type; it does not itself increment. Counting concerns call attempts, not returned objects or completed listings. (rust/lance-core/src/utils/testing.rs:129-158)

### Lines 159-185

Counting wrapper Display formats CountingObjectStore(target-display). async_trait Proxy ObjectStore implementation intercepts put_opts as policy operation string put and put_multipart_opts as put_multipart; a policy error returns before delegating. Successful multipart setup returns the target upload object directly, so subsequent part/complete/abort calls are not individually proxied here. (rust/lance-core/src/utils/testing.rs:159-185)

### Lines 186-200

Proxy get_opts first invokes before policy with get_opts regardless of options.head. It awaits target get_opts; only when head was true does it transform result.meta using operation string head, propagating transform errors. Non-head GetResult metadata is unchanged. get_ranges applies before string get_ranges then forwards ranges and result. Returned payload streams/bytes are not transformed. (rust/lance-core/src/utils/testing.rs:186-200)

### Lines 201-220

delete_stream clones the policy Arc and wraps each successful input Path with an and_then closure. At stream polling time it locks policy, invokes every before closure with delete/location using try_for_each, releases the lock and returns a ready result carrying the unchanged Path or first error. Existing input errors bypass the closure. The transformed stream is handed to target.delete_stream immediately; whether a target stops after a stream error is dependency behavior, not established here. (rust/lance-core/src/utils/testing.rs:201-220)

### Lines 221-237

list clones target/policy and immediately obtains target.list(prefix), with no before policy for listing/prefix. As successful ObjectMeta items arrive, and_then locks policy, sequentially applies metadata policies with string list and unwraps each converted result. A metadata-policy error therefore panics while holding the lock, unlike transform_meta for head. Underlying list errors pass through without transformation. Successful transforms return ready Ok metadata; the stream owns cloned Arcs. (rust/lance-core/src/utils/testing.rs:221-237)

### Lines 238-251

list_with_delimiter forwards directly with no before or metadata policies. copy_opts and rename_opts run before_method with strings copy/rename and source path only, then forward original source/destination/options. Destination-specific policy enforcement is not implemented; a failure prevents the target call but does not roll back side effects inside earlier policies. (rust/lance-core/src/utils/testing.rs:238-251)

### Lines 252-279

CountingObjectStore async_trait implementation directly delegates put_opts, multipart creation, get_opts and get_ranges with unchanged arguments/results. No policy layer or count increment is added for these operations. (rust/lance-core/src/utils/testing.rs:252-279)

### Lines 280-300

Counting delete_stream forwards directly. list increments the shared SeqCst counter synchronously before creating/delegating its stream, so an unpolled/failed list attempt still counts. list_with_delimiter increments when its async body is polled before awaiting target, so a never-polled future does not count. copy_opts forwards directly. No explicit rename_opts or other extra override, reset, decrement, object count, elapsed-time metric or local tests exist in this file; defaults are delegated to the external trait contract. (rust/lance-core/src/utils/testing.rs:280-300)

## Interaction and interpretation limits

All300 lines were read; this file defines no local test module. Dependency ObjectStore default-method behavior, concrete store IO and whole-repository test consumers remain pending. The blanket all-calls wording overstates policy coverage: list bypasses before policies, list_with_delimiter bypasses both policy types, returned MultipartUpload is not wrapped, and CountingObjectStore does not explicitly override rename_opts. Policies execute under a synchronous Mutex and must not recursively acquire it; transformed-list errors panic through unwrap while head transforms return errors. (rust/lance-core/src/utils.rs:22-22; rust/lance-core/src/utils/testing.rs:89-120; rust/lance-core/src/utils/testing.rs:165-300)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Testing utilities
    5 | 
    6 | use crate::Result;
    7 | use async_trait::async_trait;
    8 | use bytes::Bytes;
    9 | use futures::stream::BoxStream;
   10 | use futures::{StreamExt, TryStreamExt};
   11 | use object_store::path::Path;
   12 | use object_store::{
   13 |     CopyOptions, Error as OSError, GetOptions, GetResult, ListResult, MultipartUpload, ObjectMeta,
   14 |     ObjectStore, PutMultipartOptions, PutOptions, PutPayload, PutResult, RenameOptions,
   15 |     Result as OSResult,
   16 | };
   17 | use std::collections::HashMap;
   18 | use std::fmt::Debug;
   19 | use std::future;
   20 | use std::ops::Range;
   21 | use std::pin::Pin;
   22 | use std::sync::{
   23 |     Arc, Mutex,
   24 |     atomic::{AtomicUsize, Ordering},
   25 | };
   26 | 
   27 | // A policy function takes in the name of the operation (e.g. "put") and the location
   28 | // that is being accessed / modified and returns an optional error.
   29 | pub trait PolicyFnT: Fn(&str, &Path) -> Result<()> + Send + Sync {}
   30 | impl<F> PolicyFnT for F where F: Fn(&str, &Path) -> Result<()> + Send + Sync {}
   31 | impl Debug for dyn PolicyFnT {
   32 |     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
   33 |         write!(f, "PolicyFn")
   34 |     }
   35 | }
   36 | type PolicyFn = Arc<dyn PolicyFnT>;
   37 | 
   38 | // These policy functions receive (and optionally transform) an ObjectMeta
   39 | // They apply to functions that list file info
   40 | pub trait ObjectMetaPolicyFnT: Fn(&str, ObjectMeta) -> Result<ObjectMeta> + Send + Sync {}
   41 | impl<F> ObjectMetaPolicyFnT for F where F: Fn(&str, ObjectMeta) -> Result<ObjectMeta> + Send + Sync {}
   42 | impl Debug for dyn ObjectMetaPolicyFnT {
   43 |     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
   44 |         write!(f, "PolicyFn")
   45 |     }
   46 | }
   47 | type ObjectMetaPolicyFn = Arc<dyn ObjectMetaPolicyFnT>;
   48 | 
   49 | /// A policy container, meant to be shared between test code and the proxy object store.
   50 | ///
   51 | /// This container allows you to configure policies that should apply to the proxied calls.
   52 | ///
   53 | /// Typically, you would use this to simulate I/O errors or mock out data.
   54 | ///
   55 | /// Currently, for simplicity, we only proxy calls that involve some kind of path.  Calls
   56 | /// to copy functions, which have a src and dst, will provide the source to the policy
   57 | #[derive(Debug, Default)]
   58 | pub struct ProxyObjectStorePolicy {
   59 |     /// Policies which run before a method is invoked.  If the policy returns
   60 |     /// an error then the target method will not be invoked and the error will
   61 |     /// be returned instead.
   62 |     before_policies: HashMap<String, PolicyFn>,
   63 |     /// Policies which run after calls that return ObjectMeta.  The policy can
   64 |     /// transform the returned ObjectMeta to mock out file listing results.
   65 |     object_meta_policies: HashMap<String, ObjectMetaPolicyFn>,
   66 | }
   67 | 
   68 | impl ProxyObjectStorePolicy {
   69 |     pub fn new() -> Self {
   70 |         Default::default()
   71 |     }
   72 | 
   73 |     /// Set a new policy with the given name
   74 |     ///
   75 |     /// The name can be used to later remove this policy
   76 |     pub fn set_before_policy(&mut self, name: &str, policy: PolicyFn) {
   77 |         self.before_policies.insert(name.to_string(), policy);
   78 |     }
   79 | 
   80 |     pub fn clear_before_policy(&mut self, name: &str) {
   81 |         self.before_policies.remove(name);
   82 |     }
   83 | 
   84 |     pub fn set_obj_meta_policy(&mut self, name: &str, policy: ObjectMetaPolicyFn) {
   85 |         self.object_meta_policies.insert(name.to_string(), policy);
   86 |     }
   87 | }
   88 | 
   89 | /// A proxy object store
   90 | ///
   91 | /// This store wraps another object store and applies the given policy to all calls
   92 | /// made to the underlying store.  This can be used to simulate failures or, perhaps
   93 | /// in the future, to mock out results or provide other fine-grained control.
   94 | #[derive(Debug)]
   95 | pub struct ProxyObjectStore {
   96 |     target: Arc<dyn ObjectStore>,
   97 |     policy: Arc<Mutex<ProxyObjectStorePolicy>>,
   98 | }
   99 | 
  100 | impl ProxyObjectStore {
  101 |     pub fn new(target: Arc<dyn ObjectStore>, policy: Arc<Mutex<ProxyObjectStorePolicy>>) -> Self {
  102 |         Self { target, policy }
  103 |     }
  104 | 
  105 |     fn before_method(&self, method: &str, location: &Path) -> OSResult<()> {
  106 |         let policy = self.policy.lock().unwrap();
  107 |         for policy in policy.before_policies.values() {
  108 |             policy(method, location).map_err(OSError::from)?;
  109 |         }
  110 |         Ok(())
  111 |     }
  112 | 
  113 |     fn transform_meta(&self, method: &str, meta: ObjectMeta) -> OSResult<ObjectMeta> {
  114 |         let policy = self.policy.lock().unwrap();
  115 |         let mut meta = meta;
  116 |         for policy in policy.object_meta_policies.values() {
  117 |             meta = policy(method, meta).map_err(OSError::from)?;
  118 |         }
  119 |         Ok(meta)
  120 |     }
  121 | }
  122 | 
  123 | impl std::fmt::Display for ProxyObjectStore {
  124 |     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
  125 |         write!(f, "ProxyObjectStore({})", self.target)
  126 |     }
  127 | }
  128 | 
  129 | /// An object store wrapper that counts listing operations.
  130 | ///
  131 | /// This increments the shared counter for both `list` and `list_with_delimiter`
  132 | /// so tests can observe all listing-based directory and version discovery calls.
  133 | #[derive(Debug)]
  134 | pub struct CountingObjectStore {
  135 |     target: Arc<dyn ObjectStore>,
  136 |     listing_count: Arc<AtomicUsize>,
  137 | }
  138 | 
  139 | impl CountingObjectStore {
  140 |     pub fn new(target: Arc<dyn ObjectStore>, listing_count: Arc<AtomicUsize>) -> Self {
  141 |         Self {
  142 |             target,
  143 |             listing_count,
  144 |         }
  145 |     }
  146 | 
  147 |     fn record_listing(&self) {
  148 |         self.listing_count.fetch_add(1, Ordering::SeqCst);
  149 |     }
  150 | 
  151 |     fn delegate_list(
  152 |         &self,
  153 |         prefix: Option<&Path>,
  154 |     ) -> Pin<Box<dyn futures::Stream<Item = OSResult<ObjectMeta>> + Send>> {
  155 |         self.target.list(prefix)
  156 |     }
  157 | }
  158 | 
  159 | impl std::fmt::Display for CountingObjectStore {
  160 |     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
  161 |         write!(f, "CountingObjectStore({})", self.target)
  162 |     }
  163 | }
  164 | 
  165 | #[async_trait]
  166 | impl ObjectStore for ProxyObjectStore {
  167 |     async fn put_opts(
  168 |         &self,
  169 |         location: &Path,
  170 |         bytes: PutPayload,
  171 |         opts: PutOptions,
  172 |     ) -> OSResult<PutResult> {
  173 |         self.before_method("put", location)?;
  174 |         self.target.put_opts(location, bytes, opts).await
  175 |     }
  176 | 
  177 |     async fn put_multipart_opts(
  178 |         &self,
  179 |         location: &Path,
  180 |         opts: PutMultipartOptions,
  181 |     ) -> OSResult<Box<dyn MultipartUpload>> {
  182 |         self.before_method("put_multipart", location)?;
  183 |         self.target.put_multipart_opts(location, opts).await
  184 |     }
  185 | 
  186 |     async fn get_opts(&self, location: &Path, options: GetOptions) -> OSResult<GetResult> {
  187 |         self.before_method("get_opts", location)?;
  188 |         let is_head = options.head;
  189 |         let mut result = self.target.get_opts(location, options).await?;
  190 |         if is_head {
  191 |             result.meta = self.transform_meta("head", result.meta)?;
  192 |         }
  193 |         Ok(result)
  194 |     }
  195 | 
  196 |     async fn get_ranges(&self, location: &Path, ranges: &[Range<u64>]) -> OSResult<Vec<Bytes>> {
  197 |         self.before_method("get_ranges", location)?;
  198 |         self.target.get_ranges(location, ranges).await
  199 |     }
  200 | 
  201 |     fn delete_stream(
  202 |         &self,
  203 |         locations: BoxStream<'static, OSResult<Path>>,
  204 |     ) -> BoxStream<'static, OSResult<Path>> {
  205 |         let policy = Arc::clone(&self.policy);
  206 |         let checked = locations
  207 |             .and_then(move |location| {
  208 |                 let result = {
  209 |                     let policy = policy.lock().unwrap();
  210 |                     policy
  211 |                         .before_policies
  212 |                         .values()
  213 |                         .try_for_each(|policy| policy("delete", &location).map_err(OSError::from))
  214 |                 };
  215 |                 future::ready(result.map(|_| location))
  216 |             })
  217 |             .boxed();
  218 |         self.target.delete_stream(checked)
  219 |     }
  220 | 
  221 |     fn list(&self, prefix: Option<&Path>) -> BoxStream<'static, OSResult<ObjectMeta>> {
  222 |         let target = self.target.clone();
  223 |         let policy = Arc::clone(&self.policy);
  224 | 
  225 |         target
  226 |             .list(prefix)
  227 |             .and_then(move |meta| {
  228 |                 let policy = policy.lock().unwrap();
  229 |                 let mut meta = meta;
  230 |                 for p in policy.object_meta_policies.values() {
  231 |                     meta = p("list", meta).map_err(OSError::from).unwrap();
  232 |                 }
  233 |                 future::ready(Ok(meta))
  234 |             })
  235 |             .boxed()
  236 |     }
  237 | 
  238 |     async fn list_with_delimiter(&self, prefix: Option<&Path>) -> OSResult<ListResult> {
  239 |         self.target.list_with_delimiter(prefix).await
  240 |     }
  241 | 
  242 |     async fn copy_opts(&self, from: &Path, to: &Path, opts: CopyOptions) -> OSResult<()> {
  243 |         self.before_method("copy", from)?;
  244 |         self.target.copy_opts(from, to, opts).await
  245 |     }
  246 | 
  247 |     async fn rename_opts(&self, from: &Path, to: &Path, opts: RenameOptions) -> OSResult<()> {
  248 |         self.before_method("rename", from)?;
  249 |         self.target.rename_opts(from, to, opts).await
  250 |     }
  251 | }
  252 | 
  253 | #[async_trait]
  254 | impl ObjectStore for CountingObjectStore {
  255 |     async fn put_opts(
  256 |         &self,
  257 |         location: &Path,
  258 |         bytes: PutPayload,
  259 |         opts: PutOptions,
  260 |     ) -> OSResult<PutResult> {
  261 |         self.target.put_opts(location, bytes, opts).await
  262 |     }
  263 | 
  264 |     async fn put_multipart_opts(
  265 |         &self,
  266 |         location: &Path,
  267 |         opts: PutMultipartOptions,
  268 |     ) -> OSResult<Box<dyn MultipartUpload>> {
  269 |         self.target.put_multipart_opts(location, opts).await
  270 |     }
  271 | 
  272 |     async fn get_opts(&self, location: &Path, options: GetOptions) -> OSResult<GetResult> {
  273 |         self.target.get_opts(location, options).await
  274 |     }
  275 | 
  276 |     async fn get_ranges(&self, location: &Path, ranges: &[Range<u64>]) -> OSResult<Vec<Bytes>> {
  277 |         self.target.get_ranges(location, ranges).await
  278 |     }
  279 | 
  280 |     fn delete_stream(
  281 |         &self,
  282 |         locations: BoxStream<'static, OSResult<Path>>,
  283 |     ) -> BoxStream<'static, OSResult<Path>> {
  284 |         self.target.delete_stream(locations)
  285 |     }
  286 | 
  287 |     fn list(&self, prefix: Option<&Path>) -> BoxStream<'static, OSResult<ObjectMeta>> {
  288 |         self.record_listing();
  289 |         self.delegate_list(prefix).boxed()
  290 |     }
  291 | 
  292 |     async fn list_with_delimiter(&self, prefix: Option<&Path>) -> OSResult<ListResult> {
  293 |         self.record_listing();
  294 |         self.target.list_with_delimiter(prefix).await
  295 |     }
  296 | 
  297 |     async fn copy_opts(&self, from: &Path, to: &Path, opts: CopyOptions) -> OSResult<()> {
  298 |         self.target.copy_opts(from, to, opts).await
  299 |     }
  300 | }
``````
