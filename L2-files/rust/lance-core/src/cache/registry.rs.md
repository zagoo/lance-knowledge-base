> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-core/src/cache/registry.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `b01560e7a8bf6553129ad0707fa272e22fa0768c3c2730004e5b5010ce42392f`. Reviewed physical lines: 1-372.

[Module](../../../../../L1-modules/rust-lance-core-cache.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Global process-local registry of synchronous backend constructor function pointers, validated BackendConfig, lazy built-in Moka installation, override rules and isolated registry tests. (rust/lance-core/src/cache/registry.rs:1-372)

## Complete range analysis

### Lines 1-23

SPDX/module overview assigns kind/options and startup registration to extensions, with HashMap<String,String> chosen for FFI representation. Imports global synchronization primitives, Moka built-in identifiers/constructor and Error/Result. Actual Python/Java bindings are not in this file. (rust/lance-core/src/cache/registry.rs:1-23)

### Lines 24-35

Public BackendConfig derives Debug/Clone/PartialEq/Eq with mutable public kind:String and options:HashMap<String,String>. Direct struct construction bypasses new validation, so build_from_config normalizes again. HashMap order is unspecified. (rust/lance-core/src/cache/registry.rs:24-35)

### Lines 36-51

new accepts impl AsRef<str>, validates/normalizes kind and creates empty map. with_option consumes self, converts key/value Into<String>, inserts and returns it; repeated keys overwrite unlike URI parser duplicate rejection. No option name/value validation or error return exists in this builder method. (rust/lance-core/src/cache/registry.rs:36-51)

### Lines 52-79

normalize_backend_kind iterates chars; empty or non-ASCII-letter first errors with supplied kind. Subsequent chars must ASCII alphanumeric or+,-,.; anything else reports kind and invalid char. Returns lowercase ASCII without trimming. Thus case-insensitive registrations/config/URI converge while options remain untouched. Although declared pub, this helper is inside private registry and is not facade-reexported. (rust/lance-core/src/cache/mod.rs:48-66) (rust/lance-core/src/cache/registry.rs:52-79)

### Lines 80-90

BackendBuildFn is a plain synchronous fn(&BackendConfig)->Result<Arc<dyn CacheBackend>>, not a capturing closure/async future. Docs suggest blocking shim for async initialization but no runtime shim is implemented. Private registry uses local-static OnceLock<Mutex<HashMap<String,BackendBuildFn>>> initialized empty. (rust/lance-core/src/cache/registry.rs:80-90)

### Lines 91-103

Production registry_lock converts mutex poison to Error::internal with fixed message. Test-only lock helper recovers inner guard from poison instead; that does not clear the mutex poison flag. Global state and poisoning effects are process-wide. (rust/lance-core/src/cache/registry.rs:91-103)

### Lines 104-130

Public register_backend normalizes kind then calls insert_backend with allow_replace determined by builtin_backend existence. Non-built-in duplicate names error; built-in moka may be repeatedly replaced even before lazy registration. Doc example wraps a1024-byte Moka backend under my-backend; constructor behavior is now documented at rust/lance-core/src/cache/moka.rs:67-83. (rust/lance-core/src/cache/registry.rs:104-130)

### Lines 131-142

insert_backend holds registry mutex only while checking duplicate policy and inserting owned kind/function pointer. Disallowed replacement errors InvalidInput with kind, preserves existing registration; allowed insert replaces old pointer. Lock acquisition can return poison Internal error first. (rust/lance-core/src/cache/registry.rs:131-142)

### Lines 143-149

builtin_backend recognizes only MOKA_BACKEND_KIND and returns build_moka; all other kinds None. No dynamic plugin scan, aliases or additional built-ins are declared here. Literal identifier value is supplied by the sibling Moka module, while local docs/tests call it moka. (rust/lance-core/src/cache/registry.rs:143-149)

### Lines 150-172

build_from_config first ensures built-ins (so even an invalid requested kind may have the side effect of populating registry), then normalizes public kind again and clones whole option map into a new config. Copies constructor pointer under a short mutex guard, drops guard before invocation, returns constructor Result unchanged or InvalidInput unknown kind. Constructors may reenter registry without this lookup guard causing self-deadlock; concurrent replacement can race but copied pointer remains the selected constructor. (rust/lance-core/src/cache/registry.rs:150-172)

### Lines 173-194

ensure_builtin_backends checks current map on every call, inserts built-in only if absent, preserving overrides. It intentionally uses no process-once installed flag so test snapshot/restore remains valid. Initialization of the registry itself remains OnceLock. No constructors run while this helper holds mutex. (rust/lance-core/src/cache/registry.rs:173-194)

### Lines 195-209

cfg(test) parent-visible take_registry_for_test swaps map with empty; restore replaces map with supplied saved state. Both recover poisoned lock through test helper. These mutate global state and require separate test serialization discipline. (rust/lance-core/src/cache/registry.rs:195-209)

### Lines 210-218

cfg(test) parent-visible registry_test_lock uses an independent OnceLock<Mutex<()>> and recovers poisoned inner guard. Returned static guard serializes tests for its holding lifetime. It does not automatically wrap production APIs. (rust/lance-core/src/cache/registry.rs:210-218)

### Lines 219-243

Test module imports async_trait/Pin/Future and cache entry/key/codec. Private Debug/Default NullBackend get always returns None. It provides an operational dummy for registry construction, not a stored cache. (rust/lance-core/src/cache/registry.rs:219-243)

### Lines 244-271

NullBackend insert/clear no-op, get_or_insert awaits caller loader, discards declared size, returns(entry,false) and propagates loader errors; num_entries/size_bytes return0. Approximation/capacity/deep-size use trait defaults. Contrary to the broad no-op comment, loader can have effects or fail. (rust/lance-core/src/cache/registry.rs:244-271)

### Lines 272-294

build_null returns new Arc<NullBackend>. RegistryGuard holds serialization guard plus saved map; new acquires serialization lock before taking registry. Drop restores saved state via mem::take. Lock remains held through drop body then releases with fields. This is test isolation, not public state rollback. (rust/lance-core/src/cache/registry.rs:272-294)

### Lines 295-320

Tests register/build custom null, reject duplicate dup, and register moka override before building. Success assertions only check Arc strong_count1, so the built-in override case does not independently distinguish NullBackend from another single-owner backend. They do not invoke cache methods. (rust/lance-core/src/cache/registry.rs:295-320)

### Lines 321-350

Unknown-kind test checks message. Mixed-case registration then lowercase lookup tests normalization. Direct BackendConfig ECHO.Backend is passed to an inner constructor that asserts normalized echo.backend, proving normalization despite bypassing new. RegistryGuard scopes each state-changing test. (rust/lance-core/src/cache/registry.rs:321-350)

### Lines 351-372

Invalid-kind test rejects a space-containing registration before insertion and digit-leading config; it needs no guard because these fail before mutation. Final test registers local build_echo that checks capacity string42 reaches it unchanged. No poison, recursive constructor, concurrent replacement or repeated built-in override test is present. (rust/lance-core/src/cache/registry.rs:351-372)

## Interaction and interpretation limits

Constructor discovery/locking is established; build_moka option parsing and concrete backend operations are now documented. (rust/lance-core/src/cache/moka.rs:108-201; rust/lance-core/src/cache/moka.rs:328-366; rust/lance-core/src/cache/quick.rs:158-231) Public functions contain no unregister/enumerate API. Tests show source assertions only and were not run. The registry permits deliberate replacement of built-in moka independently of the root repository guidance for public API evolution. (rust/lance-core/src/cache/registry.rs:24-193; rust/lance-core/src/cache/registry.rs:218-372)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Pluggable cache-backend registry.
    5 | //!
    6 | //! A [`BackendConfig`] identifies which backend to build (`kind`) and carries
    7 | //! backend-specific string options. Backends are constructed through a
    8 | //! [`BackendBuildFn`] registered under a unique `kind`. Third-party crates
    9 | //! integrate by calling [`register_backend`] once at application startup;
   10 | //! [`build_from_config`] then locates the constructor and hands it the
   11 | //! config.
   12 | //!
   13 | //! The registry uses `HashMap<String, String>` for options so it can be
   14 | //! represented naturally across FFI (Python `dict[str, str]`, Java
   15 | //! `Map<String, String>`, etc.).
   16 | 
   17 | use std::collections::HashMap;
   18 | use std::sync::{Arc, Mutex, MutexGuard, OnceLock};
   19 | 
   20 | use super::backend::CacheBackend;
   21 | use super::moka::{MOKA_BACKEND_KIND, build_moka};
   22 | use crate::{Error, Result};
   23 | 
   24 | /// Backend-independent configuration passed to a [`BackendBuildFn`].
   25 | ///
   26 | /// `kind` selects which registered backend to construct; `options` carries
   27 | /// backend-specific key/value settings (e.g. `capacity`, `path`).
   28 | #[derive(Debug, Clone, PartialEq, Eq)]
   29 | pub struct BackendConfig {
   30 |     /// Registered backend identifier, e.g. `"moka"`.
   31 |     pub kind: String,
   32 |     /// Backend-specific string options.
   33 |     pub options: HashMap<String, String>,
   34 | }
   35 | 
   36 | impl BackendConfig {
   37 |     /// Build a config with no options.
   38 |     pub fn new(kind: impl AsRef<str>) -> Result<Self> {
   39 |         Ok(Self {
   40 |             kind: normalize_backend_kind(kind.as_ref())?,
   41 |             options: HashMap::new(),
   42 |         })
   43 |     }
   44 | 
   45 |     /// Insert a single option and return `self`, enabling chaining.
   46 |     pub fn with_option(mut self, key: impl Into<String>, value: impl Into<String>) -> Self {
   47 |         self.options.insert(key.into(), value.into());
   48 |         self
   49 |     }
   50 | }
   51 | 
   52 | /// Normalize and validate a cache backend kind.
   53 | ///
   54 | /// Backend kinds share the same syntax as URI schemes. They are matched
   55 | /// case-insensitively and stored as lowercase ASCII so registry lookups,
   56 | /// config dictionaries, and URI parsing all address the same key.
   57 | pub fn normalize_backend_kind(kind: &str) -> Result<String> {
   58 |     let mut chars = kind.chars();
   59 |     match chars.next() {
   60 |         Some(c) if c.is_ascii_alphabetic() => {}
   61 |         _ => {
   62 |             return Err(Error::invalid_input(format!(
   63 |                 "cache backend kind {:?}: must start with an ASCII letter",
   64 |                 kind
   65 |             )));
   66 |         }
   67 |     }
   68 |     for c in chars {
   69 |         let ok = c.is_ascii_alphanumeric() || matches!(c, '+' | '-' | '.');
   70 |         if !ok {
   71 |             return Err(Error::invalid_input(format!(
   72 |                 "cache backend kind {:?}: invalid character {:?}",
   73 |                 kind, c
   74 |             )));
   75 |         }
   76 |     }
   77 |     Ok(kind.to_ascii_lowercase())
   78 | }
   79 | 
   80 | /// Constructor signature for a cache backend.
   81 | ///
   82 | /// Constructors are synchronous. Backends that need async initialization
   83 | /// should surface a `try_new_blocking` shim (or equivalent) and call it here.
   84 | pub type BackendBuildFn = fn(&BackendConfig) -> Result<Arc<dyn CacheBackend>>;
   85 | 
   86 | fn registry() -> &'static Mutex<HashMap<String, BackendBuildFn>> {
   87 |     static REGISTRY: OnceLock<Mutex<HashMap<String, BackendBuildFn>>> = OnceLock::new();
   88 |     REGISTRY.get_or_init(|| Mutex::new(HashMap::new()))
   89 | }
   90 | 
   91 | fn registry_lock() -> Result<MutexGuard<'static, HashMap<String, BackendBuildFn>>> {
   92 |     registry()
   93 |         .lock()
   94 |         .map_err(|_| Error::internal("cache backend registry mutex is poisoned"))
   95 | }
   96 | 
   97 | #[cfg(test)]
   98 | fn registry_lock_for_test() -> MutexGuard<'static, HashMap<String, BackendBuildFn>> {
   99 |     registry()
  100 |         .lock()
  101 |         .unwrap_or_else(|poisoned| poisoned.into_inner())
  102 | }
  103 | 
  104 | /// Register a constructor for a cache backend under `kind`.
  105 | ///
  106 | /// Returns `Err` if a non-built-in `kind` is already registered. Built-in
  107 | /// backends may be replaced so callers can mask a built-in implementation
  108 | /// (for example, a patched `"moka"` backend) without changing URI/config
  109 | /// strings elsewhere.
  110 | ///
  111 | /// Typical usage from a backend crate:
  112 | ///
  113 | /// ```
  114 | /// # use std::sync::Arc;
  115 | /// # use lance_core::Result;
  116 | /// # use lance_core::cache::{BackendConfig, CacheBackend, MokaCacheBackend, register_backend};
  117 | /// fn build_my_backend(_config: &BackendConfig) -> Result<Arc<dyn CacheBackend>> {
  118 | ///     Ok(Arc::new(MokaCacheBackend::with_capacity(1024)))
  119 | /// }
  120 | ///
  121 | /// # fn main() -> Result<()> {
  122 | /// register_backend("my-backend", build_my_backend)?;
  123 | /// # Ok(())
  124 | /// # }
  125 | /// ```
  126 | pub fn register_backend(kind: &str, build: BackendBuildFn) -> Result<()> {
  127 |     let kind = normalize_backend_kind(kind)?;
  128 |     insert_backend(&kind, build, builtin_backend(&kind).is_some())
  129 | }
  130 | 
  131 | fn insert_backend(kind: &str, build: BackendBuildFn, allow_replace: bool) -> Result<()> {
  132 |     let mut map = registry_lock()?;
  133 |     if map.contains_key(kind) && !allow_replace {
  134 |         return Err(Error::invalid_input(format!(
  135 |             "cache backend {:?} is already registered",
  136 |             kind
  137 |         )));
  138 |     }
  139 |     map.insert(kind.to_string(), build);
  140 |     Ok(())
  141 | }
  142 | 
  143 | fn builtin_backend(kind: &str) -> Option<BackendBuildFn> {
  144 |     match kind {
  145 |         MOKA_BACKEND_KIND => Some(build_moka),
  146 |         _ => None,
  147 |     }
  148 | }
  149 | 
  150 | /// Look up the constructor for `config.kind` and build a backend.
  151 | ///
  152 | /// Returns `Err` if no backend has been registered under that identifier.
  153 | pub fn build_from_config(config: &BackendConfig) -> Result<Arc<dyn CacheBackend>> {
  154 |     ensure_builtin_backends()?;
  155 |     let kind = normalize_backend_kind(&config.kind)?;
  156 |     let config = BackendConfig {
  157 |         kind: kind.clone(),
  158 |         options: config.options.clone(),
  159 |     };
  160 |     let build = {
  161 |         let map = registry_lock()?;
  162 |         map.get(&kind).copied()
  163 |     };
  164 |     match build {
  165 |         Some(build) => build(&config),
  166 |         None => Err(Error::invalid_input(format!(
  167 |             "unknown cache backend kind: {:?}",
  168 |             kind
  169 |         ))),
  170 |     }
  171 | }
  172 | 
  173 | /// Idempotently register the backends that ship with `lance-core`.
  174 | ///
  175 | /// Called by [`build_from_config`] (and, transitively, by
  176 | /// [`build_from_uri`](super::backend_uri::build_from_uri)) so a bare Lance
  177 | /// installation can build a Moka backend without the caller having to
  178 | /// register it. Third-party backends still have to opt in with their own
  179 | /// `register()` call.
  180 | ///
  181 | /// The check is against the current registry contents rather than a
  182 | /// process-once flag so that `#[cfg(test)]` helpers which snapshot and
  183 | /// restore the registry still see the built-in backend after they take
  184 | /// ownership.
  185 | fn ensure_builtin_backends() -> Result<()> {
  186 |     let mut map = registry_lock()?;
  187 |     if !map.contains_key(MOKA_BACKEND_KIND)
  188 |         && let Some(build) = builtin_backend(MOKA_BACKEND_KIND)
  189 |     {
  190 |         map.insert(MOKA_BACKEND_KIND.to_string(), build);
  191 |     }
  192 |     Ok(())
  193 | }
  194 | 
  195 | /// Test-only helper: replace the registry with an empty map so tests can
  196 | /// exercise duplicate-registration logic without polluting the global one.
  197 | #[cfg(test)]
  198 | pub(super) fn take_registry_for_test() -> HashMap<String, BackendBuildFn> {
  199 |     let mut map = registry_lock_for_test();
  200 |     std::mem::take(&mut *map)
  201 | }
  202 | 
  203 | /// Test-only helper: restore a previously captured registry state.
  204 | #[cfg(test)]
  205 | pub(super) fn restore_registry_for_test(saved: HashMap<String, BackendBuildFn>) {
  206 |     let mut map = registry_lock_for_test();
  207 |     *map = saved;
  208 | }
  209 | 
  210 | #[cfg(test)]
  211 | pub(super) fn registry_test_lock() -> std::sync::MutexGuard<'static, ()> {
  212 |     static M: OnceLock<std::sync::Mutex<()>> = OnceLock::new();
  213 |     M.get_or_init(|| std::sync::Mutex::new(()))
  214 |         .lock()
  215 |         .unwrap_or_else(|poisoned| poisoned.into_inner())
  216 | }
  217 | 
  218 | #[cfg(test)]
  219 | mod tests {
  220 |     use super::*;
  221 |     use async_trait::async_trait;
  222 |     use std::pin::Pin;
  223 | 
  224 |     use crate::cache::InternalCacheKey;
  225 |     use crate::cache::backend::CacheEntry;
  226 |     use crate::cache::codec::CacheCodec;
  227 |     use futures::Future;
  228 | 
  229 |     // A trivial no-op backend so tests do not depend on Moka or any other
  230 |     // real backend. Every method returns "empty" / does nothing.
  231 |     #[derive(Debug, Default)]
  232 |     struct NullBackend;
  233 | 
  234 |     #[async_trait]
  235 |     impl CacheBackend for NullBackend {
  236 |         async fn get(
  237 |             &self,
  238 |             _key: &InternalCacheKey,
  239 |             _codec: Option<CacheCodec>,
  240 |         ) -> Option<CacheEntry> {
  241 |             None
  242 |         }
  243 | 
  244 |         async fn insert(
  245 |             &self,
  246 |             _key: &InternalCacheKey,
  247 |             _entry: CacheEntry,
  248 |             _size_bytes: usize,
  249 |             _codec: Option<CacheCodec>,
  250 |         ) {
  251 |         }
  252 | 
  253 |         async fn get_or_insert<'a>(
  254 |             &self,
  255 |             _key: &InternalCacheKey,
  256 |             loader: Pin<Box<dyn Future<Output = crate::Result<(CacheEntry, usize)>> + Send + 'a>>,
  257 |             _codec: Option<CacheCodec>,
  258 |         ) -> crate::Result<(CacheEntry, bool)> {
  259 |             let (entry, _size) = loader.await?;
  260 |             Ok((entry, false))
  261 |         }
  262 | 
  263 |         async fn clear(&self) {}
  264 |         async fn num_entries(&self) -> usize {
  265 |             0
  266 |         }
  267 |         async fn size_bytes(&self) -> usize {
  268 |             0
  269 |         }
  270 |     }
  271 | 
  272 |     fn build_null(_cfg: &BackendConfig) -> Result<Arc<dyn CacheBackend>> {
  273 |         Ok(Arc::new(NullBackend))
  274 |     }
  275 | 
  276 |     struct RegistryGuard {
  277 |         // Hold the serialization lock for the full test.
  278 |         _lock: std::sync::MutexGuard<'static, ()>,
  279 |         saved: HashMap<String, BackendBuildFn>,
  280 |     }
  281 |     impl RegistryGuard {
  282 |         fn new() -> Self {
  283 |             Self {
  284 |                 _lock: registry_test_lock(),
  285 |                 saved: take_registry_for_test(),
  286 |             }
  287 |         }
  288 |     }
  289 |     impl Drop for RegistryGuard {
  290 |         fn drop(&mut self) {
  291 |             restore_registry_for_test(std::mem::take(&mut self.saved));
  292 |         }
  293 |     }
  294 | 
  295 |     #[test]
  296 |     fn test_register_and_build() {
  297 |         let _guard = RegistryGuard::new();
  298 |         register_backend("null", build_null).unwrap();
  299 |         let backend = build_from_config(&BackendConfig::new("null").unwrap()).unwrap();
  300 |         // Backend is opaque; we just check that the constructor ran and
  301 |         // gave us an Arc<dyn CacheBackend>.
  302 |         assert_eq!(Arc::strong_count(&backend), 1);
  303 |     }
  304 | 
  305 |     #[test]
  306 |     fn test_duplicate_registration_errors() {
  307 |         let _guard = RegistryGuard::new();
  308 |         register_backend("dup", build_null).unwrap();
  309 |         let err = register_backend("dup", build_null).unwrap_err();
  310 |         assert!(err.to_string().contains("already registered"));
  311 |     }
  312 | 
  313 |     #[test]
  314 |     fn test_builtin_kind_can_be_overridden() {
  315 |         let _guard = RegistryGuard::new();
  316 |         register_backend("moka", build_null).unwrap();
  317 |         let backend = build_from_config(&BackendConfig::new("moka").unwrap()).unwrap();
  318 |         assert_eq!(Arc::strong_count(&backend), 1);
  319 |     }
  320 | 
  321 |     #[test]
  322 |     fn test_unknown_kind_errors() {
  323 |         let _guard = RegistryGuard::new();
  324 |         let err = build_from_config(&BackendConfig::new("missing").unwrap()).unwrap_err();
  325 |         assert!(err.to_string().contains("unknown cache backend kind"));
  326 |     }
  327 | 
  328 |     #[test]
  329 |     fn test_backend_kind_is_normalized() {
  330 |         let _guard = RegistryGuard::new();
  331 |         register_backend("Echo.Backend", build_null).unwrap();
  332 |         let backend = build_from_config(&BackendConfig::new("echo.backend").unwrap()).unwrap();
  333 |         assert_eq!(Arc::strong_count(&backend), 1);
  334 |     }
  335 | 
  336 |     #[test]
  337 |     fn test_config_lookup_normalizes_direct_config() {
  338 |         let _guard = RegistryGuard::new();
  339 |         fn build_echo(cfg: &BackendConfig) -> Result<Arc<dyn CacheBackend>> {
  340 |             assert_eq!(cfg.kind, "echo.backend");
  341 |             Ok(Arc::new(NullBackend))
  342 |         }
  343 |         register_backend("echo.backend", build_echo).unwrap();
  344 |         let cfg = BackendConfig {
  345 |             kind: "ECHO.Backend".to_string(),
  346 |             options: HashMap::new(),
  347 |         };
  348 |         build_from_config(&cfg).unwrap();
  349 |     }
  350 | 
  351 |     #[test]
  352 |     fn test_invalid_backend_kind_errors() {
  353 |         let err = register_backend("not a scheme", build_null).unwrap_err();
  354 |         assert!(err.to_string().contains("invalid character"));
  355 |         let err = BackendConfig::new("1moka").unwrap_err();
  356 |         assert!(err.to_string().contains("must start with an ASCII letter"));
  357 |     }
  358 | 
  359 |     #[test]
  360 |     fn test_options_are_passed_through() {
  361 |         let _guard = RegistryGuard::new();
  362 |         fn build_echo(cfg: &BackendConfig) -> Result<Arc<dyn CacheBackend>> {
  363 |             assert_eq!(cfg.options.get("capacity").map(String::as_str), Some("42"));
  364 |             Ok(Arc::new(NullBackend))
  365 |         }
  366 |         register_backend("echo", build_echo).unwrap();
  367 |         let cfg = BackendConfig::new("echo")
  368 |             .unwrap()
  369 |             .with_option("capacity", "42");
  370 |         build_from_config(&cfg).unwrap();
  371 |     }
  372 | }
``````
