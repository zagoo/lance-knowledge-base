> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../V21-PROTOCOL.md).

# rust/AGENTS.md

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `1ea62e7fe9f973a2989f5e8f5bce39550f6a2608e866dd2b0df6f2715b703d88`. Reviewed physical lines: 1-90.

[Module](../../L1-modules/contributor-policy.md) · [Symbols](../../L3-symbols/symbol-index.md) · [Behavior contracts](../../L3-symbols/behavior-contracts.md) · [Format](../../L3-symbols/format-spec.md) · [Entry](../../README.md)

## Role and visibility

Rust-specific maintainer policy, including a critical pure-CPU closure contract, physical-versus-logical row identity rules, and encoding hot-path constraints. No executable runtime is implemented here. (rust/AGENTS.md:1-90)

## Complete range analysis

### Lines 1-6

The guide inherits root cross-language standards and introduces Rust code style. (rust/AGENTS.md:1-6)

### Lines 7-19

Prefer capacity reservation, Arc for expensive clones, one boxing/pinning operation, removing dead code, named production batch access, zero-copy Vec array construction, Default traits, bottom-only test modules, top-level imports, dedicated modules for substantial algorithms, and removing replaced internal methods. Public APIs instead use deprecation. Logging levels follow audience/frequency: debug routine, info operator events, warn unexpected conditions. (rust/AGENTS.md:7-19)

### Lines 20-23

spawn_cpu closures must compute and return without channel waits, IO, locks, block_on or blocking APIs. The guide warns that resource-constrained pools can have one worker and deadlock when blocked; keep waiting outside in async code and dispatch substantial (~100 microseconds+) CPU work. This is policy and a rule of thumb, not a measured threshold. Actual sizing includes an explicit thread override and configurable IO reservation, so the guide's <=3-CPU example is not universal under all settings. Implementation: rust/lance-core/src/utils/tokio.rs:23-76; rust/lance-core/src/utils/tokio.rs:135-208. (rust/AGENTS.md:20-23)

### Lines 24-40

Builder option methods use with_, APIs prefer Into/AsRef, internals prefer pub(crate), public re-exports define the surface, and enums/typed structs replace magic numbers/unstructured maps. Keep physical RowAddr and stable RowId distinct; use RowAddress helpers and Roaring/RowAddrTreeMap selections. User counts subtract deletions; traits stay minimal; schema introspection must not materialize rows. Persistent formats are stable/versioned; Arrow access uses typed accessors (optional variants unless type proven); local IO writes use single syscalls instead of cloud multipart machinery. (rust/AGENTS.md:24-40)

### Lines 41-56

Fallible library paths return contextual Result errors rather than panics/unwraps; use NotSupported instead of TODO/unimplemented, classify errors by cause, checked arithmetic for IDs/counters, debug assertions for non-safety invariants, and explicit handling of impossible states. A subsequent narrower rule permits expect with a reason only when unavoidable; this is not encouragement to bypass the earlier fallible-path prohibition. Warn for cleanup failures/silent no-ops, avoid duplicate warning-before-error, reject missing required config rather than defaulting, and advance/bind parallel iterators exactly once before skipping work. (rust/AGENTS.md:41-56)

### Lines 57-63

Only truly unused bindings use underscore prefixes; booleans use is_/has_ and choose a desired zero/default state (disable_* for default-enabled behavior). Names describe actual scope rather than a broader operation. (rust/AGENTS.md:57-63)

### Lines 64-71

Tests use record_batch! or gen_batch setup, try_into_batch for scans, plain memory:// storage, and assertions on both error variant and text. These rules specify meaningful tests without asserting any current suite passes. (rust/AGENTS.md:64-71)

### Lines 72-82

Public docs explain semantic constraints/effects, enum variants, magic constants and fallback conditions. Describe mutation versus returned values correctly, mark future work TODO/FIXME, explain both Option states and use precise domain terms. (rust/AGENTS.md:72-82)

### Lines 83-90

Encoding hot paths hoist invariant branches, preallocate contiguous zero-initialized buffers by default, restrict unsafe set_len to measured hot paths with a SAFETY justification that all bytes are initialized before reading, dispatch spawn_cpu only at the async/CPU boundary without nesting, and use existing next-item helpers. The rule does not prove any specific unsafe block is sound. (rust/AGENTS.md:83-90)

## Interaction and interpretation limits

This policy guides subsequent analysis and development; source can still violate it. In particular the CPU deadlock rationale needs implementation tracing (rust/AGENTS.md:20-22).

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | # Rust Guidelines
    2 | 
    3 | Also see [root AGENTS.md](../AGENTS.md) for cross-language standards.
    4 | 
    5 | ## Code Style
    6 | 
    7 | - Use `Vec::with_capacity()` when size is known or estimable — prefer over-estimating capacity to multiple reallocations.
    8 | - Wrap large or expensive-to-clone struct fields (maps, protobuf metadata, schemas) in `Arc<T>` to avoid deep copies.
    9 | - Use `Box::pin(...)` or `.boxed()` but never both — `.boxed()` already returns `Pin<Box<...>>`.
   10 | - Remove dead code instead of adding `#[allow(dead_code)]`. Delete unused constants instead of reducing visibility.
   11 | - Use `column_by_name()` for `RecordBatch` column access in production code; use `batch["column_name"]` in tests.
   12 | - Use `PrimitiveArray::<T>::from(vec)` (zero-copy) instead of `from_iter_values(vec)` for Vec-to-PrimitiveArray conversion.
   13 | - Implement `Default` trait on config/options structs instead of standalone `default_*()` helpers.
   14 | - Place `#[cfg(test)] mod tests` as a single block at the bottom of each file — no production code after it.
   15 | - Place `use` imports at the top of the file, not inline within function bodies.
   16 | - Extract substantial new logic (bin packing, scheduling) into dedicated submodules instead of inlining into large files.
   17 | - Delete obsolete internal (`pub(crate)` / private) methods in the same PR that introduces their replacements. For public API methods, follow the deprecation path in root AGENTS.md instead.
   18 | - Choose log levels by audience: `debug!` for routine/high-frequency ops, `info!` for infrequent operator-visible state changes, `warn!` for unexpected conditions.
   19 | 
   20 | ## Concurrency
   21 | 
   22 | - The closure passed to `spawn_cpu()` must only consume CPU and return — it must **never** wait on anything: **no channels** (blocking send/recv), **no I/O**, **no locks**, and no `block_on`/`.blocking_*`. The CPU pool can collapse to a single worker in resource-constrained environments (`<= 3` CPUs), so a parked closure can deadlock the whole pool with a silent 0% hang. Keep the waiting in surrounding async code and hand only the pure-CPU work to `spawn_cpu()`. Only dispatch substantial work (rule of thumb: ~100µs+ of CPU); below that the pool overhead outweighs the benefit and the work is better left inline. See the doc comment on `spawn_cpu` for the rationale.
   23 | 
   24 | ## API Design
   25 | 
   26 | - Use `with_`-prefixed builder methods for optional config (e.g., `MyStruct::new(required).with_option(v)`) — don't create separate constructor variants.
   27 | - For public APIs, prefer `Into<T>` or `AsRef<T>` trait bounds for flexible inputs.
   28 | - Prefer `pub(crate)` over `pub` for crate-internal items. Use `pub use` re-exports for the actual public API surface.
   29 | - Use enums instead of magic numbers for format versions, variant types, and discriminators — leverage exhaustive `match`.
   30 | - Use strongly-typed structs instead of `HashMap<String, String>` in APIs — convert to strings only at serialization boundaries.
   31 | - Keep `RowAddr` (physical fragment+offset) and `RowId` (stable logical identifier) as distinct types — never raw `u64` for both.
   32 | - Use `RowAddress` from `lance-core/src/utils/address.rs` instead of raw bitwise operations on row addresses.
   33 | - Use `RowAddrTreeMap`/`RoaringBitmap` instead of `Vec<Range<u64>>` for physical row selections.
   34 | - Use logical row counts (`num_rows()`) instead of `physical_rows` for user-facing metrics — subtract deletions.
   35 | - Keep traits minimal — only core abstraction methods. Move helpers to standalone functions and config to struct fields.
   36 | - Get column/field types from schema metadata — never materialize data rows just to inspect types.
   37 | - Use stable, versioned serialization formats for persistent storage (e.g., index files) — avoid unstable cross-version formats.
   38 | - Use Arrow's type-safe access (`ArrayAccessor` trait bounds, `as_*_array` helpers) instead of `arrow::compute::cast` + `downcast_ref`. Prefer `_opt` variants (e.g., `as_string_opt`) unless the data type has already been verified.
   39 | - In `lance-io/`, use single-syscall writes for local filesystem I/O — don't reuse cloud multipart upload machinery.
   40 | 
   41 | ## Error Handling
   42 | 
   43 | - Never use `.unwrap()`, `.expect()`, `panic!()`, or `assert!()` in library code for fallible operations — use `?` with `Result` and proper error types. Reserve `.unwrap()` for tests only.
   44 | - Avoid bare `.unwrap()`; use `if let`, `match`, `let ... else`, `?`, or combinators. Never `.is_none()` followed by `.unwrap()`. If unavoidable, use `.expect("reason")`.
   45 | - Return `LanceError::NotSupported` instead of `todo!()` or `unimplemented!()` for unsupported code paths. Test with `Result::Err` assertions, not `#[should_panic]`.
   46 | - Match `Error` variant to root cause: `Error::invalid_input` for caller data issues, `Error::corrupt_file` for format/integrity issues, `Error::not_found` for missing resources, `Error::io` for I/O failures.
   47 | - Include full context in error messages — variable names, values, sizes, types, indices. Not generic messages like `"Invalid chunk size"`.
   48 | - Use `checked_add`/`checked_mul` instead of `wrapping_add`/`wrapping_mul` for counters and IDs — return an error on overflow.
   49 | - Prefer `debug_assert!` over `assert!` for non-safety invariants; reserve `assert!` for conditions preventing data corruption. Always include descriptive messages.
   50 | - Don't silently guard against impossible conditions — use `debug_assert!`, return an explicit error, or remove the check.
   51 | - Log warnings on best-effort/cleanup failures instead of silently swallowing or propagating errors.
   52 | - Log warnings for silent no-ops (skipped operations); omit warnings before errors since the error message is sufficient.
   53 | - Avoid `unwrap_or(default)` on map lookups for required config params — use `.ok_or_else(|| Error::...)` and verify key names match between serialization and deserialization.
   54 | - Advance all parallel iterators before any `continue` branches — early exits that skip `.next()` calls cause misalignment.
   55 | - Bind `iter.next()` with `let Some(x) = iter.next() else { ... }` — never call `.next()` twice to check-then-use.
   56 | 
   57 | ## Naming
   58 | 
   59 | - Reserve `_`-prefixed names for truly unused bindings — if a variable is read, drop the underscore.
   60 | - Prefix boolean variables with `is_` or `has_` instead of ambiguous `with_` or bare adjectives.
   61 | - Name booleans so `false` (zero/`Default::default()`) is the desired default — use `disable_*` instead of `enable_*` when the feature should be on by default.
   62 | - Name functions to match their actual scope — e.g., `handle_partition_system_columns` not `handle_system_columns` if only a subset is handled.
   63 | 
   64 | ## Testing
   65 | 
   66 | - Use `record_batch!()` from `arrow_array` to construct `RecordBatch` in tests instead of manual Schema/Arc/try_new boilerplate.
   67 | - Use `gen_batch()` builder API (`.col()`, `.into_reader_rows()`) for test data setup instead of manual Arrow construction.
   68 | - Use `.try_into_batch()` instead of `.try_into_stream().try_collect()` for scanner results in tests.
   69 | - Use plain `"memory://"` URIs in tests — no atomic counters or unique suffixes needed.
   70 | - Assert on both error variant (`assert!(matches!(error, ErrorType::Variant { .. }))`) and message content — don't just check `is_err()`.
   71 | 
   72 | ## Documentation
   73 | 
   74 | - Add doc comments to public API elements that convey semantic meaning, valid values, and effects — don't restate type signatures.
   75 | - Document enum variant doc comments with behavioral semantics, not just labels. For numeric parameters, state whether it's an id, count, index, etc.
   76 | - Add doc comments to magic constants, thresholds, and non-obvious transformation functions — explain what the value represents and why it was chosen.
   77 | - Comment fallback/guard code paths with when they trigger and why they exist.
   78 | - Ensure doc comments match actual semantics — distinguish mutates-in-place (`&mut self`) from returns-new-value.
   79 | - Use explicit forward-looking language (`TODO`, `FIXME`) in comments to distinguish current behavior from planned changes.
   80 | - Document the semantic meaning of both present and absent states for `Option<T>` fields.
   81 | - Use precise domain terminology — avoid ambiguous abbreviations (e.g., "FIXED" vs "fixed-width") or incorrect terms (e.g., "fields" when meaning "fragments").
   82 | 
   83 | ## lance-encoding
   84 | 
   85 | Performance-critical encoding/decoding paths have additional requirements:
   86 | 
   87 | - Hoist loop-invariant conditionals out of hot loops — branch once outside, then use separate loop bodies or monomorphized variants.
   88 | - Pre-allocate single contiguous buffers. Default to `buf.resize(len, 0)` for safe initialization; reserve `Vec::with_capacity` + `unsafe { set_len() }` for measured hot paths only, with a `// SAFETY:` comment explaining why the buffer will be fully initialized before read (e.g., immediately followed by `read_exact`).
   89 | - Use `spawn_cpu()` only at the async-to-CPU boundary (e.g., FSST, decompression, batch materialization) — never nest redundant `spawn_cpu()` calls.
   90 | - Use `expect_next()` and similar utility methods instead of inlining `None`-checks with error returns.
``````
