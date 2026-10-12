> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-core/src/utils/tokio.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `ea46fa966a9ff7224121e191f32c29ae84a82ce75ac8422e9be5e27bfc6d5f8d`. Reviewed physical lines: 1-272.

[Module](../../../../../L1-modules/rust-lance-core.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Process-global CPU blocking pool, environment-driven sizing, child-after-fork reset, and spawn_cpu future/error/panic propagation. Public configuration is lazy and process-wide, not a per-dataset setting. (rust/lance-core/src/utils/tokio.rs:1-272)

## Complete range analysis

### Lines 1-11

SPDX and imports for AtomicBool/AtomicPtr/SeqCst, LazyLock, Duration, FutureExt, Tokio runtime builder and tracing Span. The atomics implement runtime publication rather than dataset synchronization. (rust/lance-core/src/utils/tokio.rs:1-11)

### Lines 12-22

Private NUM_COMPUTE_INTENSIVE_CPUS is a LazyLock<usize> initialized by calculate_num_compute_intensive_cpus; public get_num_compute_intensive_cpus()->usize dereferences it. Its first observation fixes the value for later calls. Environment changes after initialization are not reread. (rust/lance-core/src/utils/tokio.rs:12-22)

### Lines 23-43

A successful LANCE_CPU_THREADS env read is trimmed/parsed with minimum 1 and panics on invalid input, bypassing automatic IO reservation. Otherwise compute CPU count from num_cpus: if count <= cached IO_CORE_RESERVATION return 1, warning only when CPU count >2; else call num_cpus::get again and subtract reservation. The two num_cpus calls are distinct. The warning comment describes a custom-reservation situation, but the branch checks only count>2, not whether reservation was explicitly configured. Env read errors, including non-Unicode, take the automatic path. (rust/lance-core/src/utils/tokio.rs:23-43)

### Lines 44-62

Private parse_env_usize(name:&str,raw:&str,min:usize)->Result<usize,String> trims then parses usize, returning an error naming the variable, raw value and parse error if malformed, or variable/minimum/value if below min. It does not silently clamp. Accepted values return Ok. Its callers choose whether to panic, so the parser itself is independently testable without process-environment mutation. (rust/lance-core/src/utils/tokio.rs:44-62)

### Lines 63-77

Public IO_CORE_RESERVATION:LazyLock<usize> reads LANCE_IO_CORE_RESERVATION once, accepts zero (minimum 0), panics on malformed numeric input, and defaults to 2 on any env read error. Reserving more than available CPUs still leaves one compute thread through the automatic branch; an explicit CPU-thread override is independent of this reservation. Automatic minimum and explicit override control flow: rust/lance-core/src/utils/tokio.rs:23-46. (rust/lance-core/src/utils/tokio.rs:63-77)

### Lines 78-88

Private create_runtime()->Runtime uses a multi-thread Tokio builder named lance-cpu, max_blocking_threads equal to the computed count, one async worker thread, and Duration::from_secs(u64::MAX) keepalive, then build().unwrap(). No enable_all, timer or IO driver call appears here. Runtime build failure panics. One worker is separate from the bounded blocking-worker limit. (rust/lance-core/src/utils/tokio.rs:78-88)

### Lines 89-94

CPU_RUNTIME starts as a null AtomicPtr<Runtime>; RUNTIME_INSTALLED and ATFORK_INSTALLED start false. They are private process-global state. Published runtimes are boxed and intentionally leaked; no shutdown/drop path is provided here. (rust/lance-core/src/utils/tokio.rs:89-94)

### Lines 95-109

global_cpu_runtime()->&'static Runtime loops: SeqCst load pointer, return unsafe shared reference when non-null, otherwise fetch_or(true) on installation flag to elect one initializer; other callers yield their OS thread and retry. The comments justify pointer lifetime by heap allocation/leak and resetting in fork children. No lock or async suspension is used; waiting callers spin/yield. (rust/lance-core/src/utils/tokio.rs:95-109)

### Lines 110-119

The elected initializer installs the fork hook once, creates/boxes runtime, publishes pointer with SeqCst, and returns an unsafe shared reference. A panic during hook/runtime initialization occurs after RUNTIME_INSTALLED=true but before pointer publication; there is no reset guard in this file. If such a panic is caught and execution continues, a later call can loop indefinitely on a null pointer with flag set. This is a source-derived failure path, not a reproduced test result. The election flag and waiting loop are at rust/lance-core/src/utils/tokio.rs:89-109. (rust/lance-core/src/utils/tokio.rs:110-119)

### Lines 120-126

extern C child-after-fork callback resets CPU_RUNTIME to null and RUNTIME_INSTALLED to false with SeqCst. It leaves ATFORK_INSTALLED true and does not drop the inherited runtime, avoiding arbitrary destructor execution in that callback. Next pool access in the child initializes a fresh runtime. The implementation does not install a parent/before-fork callback or prove safety of arbitrary forking application code. Publication and hook registration are at rust/lance-core/src/utils/tokio.rs:95-134. (rust/lance-core/src/utils/tokio.rs:120-126)

### Lines 127-134

On non-Windows, install_atfork invokes unsafe libc::pthread_atfork(None,None,Some(callback)); its return status is ignored. On Windows the same private name is a no-op. Registration failure is therefore not surfaced, and this implementation is platform-dependent. (rust/lance-core/src/utils/tokio.rs:127-134)

### Lines 135-160

spawn_cpu documentation describes isolating CPU-heavy work, suggests roughly 100 microseconds as a cost threshold, and describes thread-count defaults. These are guidance, not measured guarantees. Prose mentions spawn_blocking plus a oneshot round trip, but executable code below returns a mapped JoinHandle and has no result oneshot. The simple CPU-count formula must be read with LANCE_CPU_THREADS override and configurable IO reservation above. Executable join handling is at rust/lance-core/src/utils/tokio.rs:180-208; sizing override/reservation are at rust/lance-core/src/utils/tokio.rs:23-43 and rust/lance-core/src/utils/tokio.rs:63-76. (rust/lance-core/src/utils/tokio.rs:135-160)

### Lines 161-179

The warning explains that blocking IO, synchronous channels, contended locks or block_on inside closures can deadlock, especially when only one compute worker exists. The function does not enforce CPU purity through its type system. The docs prohibit these operations transitively in callees, so callers must inspect closure behavior, not merely its immediate body. (rust/lance-core/src/utils/tokio.rs:161-179)

### Lines 180-193

pub fn spawn_cpu<E:std::error::Error+Send+'static,F:FnOnce()->Result<R,E>+Send+'static,R:Send+'static>(func:F)->impl Future<Output=Result<R,E>> captures Span::current, immediately submits to global_cpu_runtime().spawn_blocking, enters that span in the closure, then calls func. This is a regular function returning a future, not async fn: submission happens at call time, before awaiting. The closure result type and error E are preserved, not converted to Lance Error. (rust/lance-core/src/utils/tokio.rs:180-193)

### Lines 194-208

The returned mapped JoinHandle produces the original closure Result on a successful join. For JoinError, try_into_panic recovers and resume_unwind rethrows the original panic payload; non-panic join errors trigger a new explanatory panic. The closure may outlive the returned handle; this wrapper contains no explicit cancellation/abort API or cancellation token. Exact Tokio detach/shutdown semantics belong to the dependency and are not reconstructed here. Span entry is scoped to closure execution. (rust/lance-core/src/utils/tokio.rs:194-208)

### Lines 209-241

Private cfg(test) module imports super::*. FutureExt is imported by the parent module at rust/lance-core/src/utils/tokio.rs:8-8; Tokio calls here use qualified paths, and no PanicHookInfo import exists. spawn_cpu_reraises_the_closure_panic temporarily replaces the global panic hook, triggers an &str panic inside spawn_cpu, awaits through tokio::spawn, restores the hook, and checks the original payload. This confirms the intended contract in test source; there is no serial guard around the process-wide hook manipulation in this file. Test runtime execution was not performed. (rust/lance-core/src/utils/tokio.rs:209-241)

### Lines 242-259

A comment explains why tests exercise parse_env_usize rather than mutate env after process-wide LazyLock initialization. One test accepts whitespace-surrounded 8; another rejects a noninteger and asserts the error names LANCE_CPU_THREADS and explains integer parsing. (rust/lance-core/src/utils/tokio.rs:242-259)

### Lines 260-272

Remaining parser tests reject zero for min 1 and accept zero for min 0. The file has no full child-fork lifecycle test, environment-cache reset test or initializer-panic recovery test. Tests preserve validation semantics rather than silently adjusting input. (rust/lance-core/src/utils/tokio.rs:260-272)

## Interaction and interpretation limits

Local call chain is spawn_cpu -> global_cpu_runtime -> install_atfork/create_runtime -> get_num_compute_intensive_cpus -> calculation/parser; explicit pool configuration and fork callback state are captured above (rust/lance-core/src/utils/tokio.rs:12-208). Full repository closure callers and dependency runtime implementation remain pending. No CPU benchmark, fork experiment or task runtime test was run.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::sync::atomic::Ordering;
    5 | use std::sync::{LazyLock, atomic};
    6 | use std::time::Duration;
    7 | 
    8 | use futures::{Future, FutureExt};
    9 | use tokio::runtime::{Builder, Runtime};
   10 | use tracing::Span;
   11 | 
   12 | /// We cache the call to num_cpus::get() because:
   13 | ///
   14 | /// 1. It shouldn't change during the lifetime of the program
   15 | /// 2. It's a relatively expensive call (requires opening several files and examining them)
   16 | static NUM_COMPUTE_INTENSIVE_CPUS: LazyLock<usize> =
   17 |     LazyLock::new(calculate_num_compute_intensive_cpus);
   18 | 
   19 | pub fn get_num_compute_intensive_cpus() -> usize {
   20 |     *NUM_COMPUTE_INTENSIVE_CPUS
   21 | }
   22 | 
   23 | fn calculate_num_compute_intensive_cpus() -> usize {
   24 |     if let Ok(raw) = std::env::var("LANCE_CPU_THREADS") {
   25 |         return parse_env_usize("LANCE_CPU_THREADS", &raw, 1).unwrap_or_else(|e| panic!("{e}"));
   26 |     }
   27 | 
   28 |     let cpus = num_cpus::get();
   29 | 
   30 |     if cpus <= *IO_CORE_RESERVATION {
   31 |         // If the user is not setting a custom value for LANCE_IO_CORE_RESERVATION then we don't emit
   32 |         // a warning because they're just on a small machine and there isn't much they can do about it.
   33 |         if cpus > 2 {
   34 |             log::warn!(
   35 |                 "Number of CPUs is less than or equal to the number of IO core reservations. \
   36 |                 This is not a supported configuration. using 1 CPU for compute intensive tasks."
   37 |             );
   38 |         }
   39 |         return 1;
   40 |     }
   41 | 
   42 |     num_cpus::get() - *IO_CORE_RESERVATION
   43 | }
   44 | 
   45 | /// Parse an integer environment variable, rejecting values below `min`.
   46 | ///
   47 | /// The error names the variable, so a bad value is diagnosable instead of
   48 | /// surfacing as a bare `ParseIntError` or, for `LANCE_CPU_THREADS=0`, a panic
   49 | /// deep inside tokio's `max_blocking_threads`.
   50 | fn parse_env_usize(name: &str, raw: &str, min: usize) -> Result<usize, String> {
   51 |     let value: usize = raw
   52 |         .trim()
   53 |         .parse()
   54 |         .map_err(|e| format!("environment variable {name} must be an integer, got {raw:?}: {e}"))?;
   55 |     if value < min {
   56 |         return Err(format!(
   57 |             "environment variable {name} must be at least {min}, got {value}"
   58 |         ));
   59 |     }
   60 |     Ok(value)
   61 | }
   62 | 
   63 | /// Number of CPU cores held back for I/O and control tasks.
   64 | ///
   65 | /// Overridable via the `LANCE_IO_CORE_RESERVATION` environment variable;
   66 | /// defaults to `2` when unset. `0` is allowed (reserve nothing);
   67 | /// [`get_num_compute_intensive_cpus`] subtracts this from the core count to
   68 | /// size the compute pool. A non-integer value panics on first access with an
   69 | /// error naming the variable.
   70 | pub static IO_CORE_RESERVATION: LazyLock<usize> =
   71 |     LazyLock::new(|| match std::env::var("LANCE_IO_CORE_RESERVATION") {
   72 |         Ok(raw) => {
   73 |             parse_env_usize("LANCE_IO_CORE_RESERVATION", &raw, 0).unwrap_or_else(|e| panic!("{e}"))
   74 |         }
   75 |         Err(_) => 2,
   76 |     });
   77 | 
   78 | fn create_runtime() -> Runtime {
   79 |     Builder::new_multi_thread()
   80 |         .thread_name("lance-cpu")
   81 |         .max_blocking_threads(get_num_compute_intensive_cpus())
   82 |         .worker_threads(1)
   83 |         // keep the thread alive "forever"
   84 |         .thread_keep_alive(Duration::from_secs(u64::MAX))
   85 |         .build()
   86 |         .unwrap()
   87 | }
   88 | 
   89 | static CPU_RUNTIME: atomic::AtomicPtr<Runtime> = atomic::AtomicPtr::new(std::ptr::null_mut());
   90 | 
   91 | static RUNTIME_INSTALLED: atomic::AtomicBool = atomic::AtomicBool::new(false);
   92 | 
   93 | static ATFORK_INSTALLED: atomic::AtomicBool = atomic::AtomicBool::new(false);
   94 | 
   95 | fn global_cpu_runtime() -> &'static Runtime {
   96 |     loop {
   97 |         let ptr = CPU_RUNTIME.load(Ordering::SeqCst);
   98 |         if !ptr.is_null() {
   99 |             // SAFETY: `ptr` was produced by `Box::into_raw` below and is only ever
  100 |             // reset to null by `atfork_tokio_child` in the forked child (single-
  101 |             // threaded, async-signal context). The `Box` is never reclaimed, so the
  102 |             // `Runtime` lives for the rest of the process.
  103 |             return unsafe { &*ptr };
  104 |         }
  105 |         if !RUNTIME_INSTALLED.fetch_or(true, Ordering::SeqCst) {
  106 |             break;
  107 |         }
  108 |         std::thread::yield_now();
  109 |     }
  110 |     if !ATFORK_INSTALLED.fetch_or(true, Ordering::SeqCst) {
  111 |         install_atfork();
  112 |     }
  113 |     let new_ptr = Box::into_raw(Box::new(create_runtime()));
  114 |     CPU_RUNTIME.store(new_ptr, Ordering::SeqCst);
  115 |     // SAFETY: `new_ptr` was just obtained from `Box::into_raw`, so it is non-null,
  116 |     // aligned, and points to a live `Runtime` that is never reclaimed.
  117 |     unsafe { &*new_ptr }
  118 | }
  119 | 
  120 | /// After a fork() operation, force re-creation of the BackgroundExecutor. Note: this function
  121 | /// runs in "async-signal context" which means that we can't (safely) do much here.
  122 | extern "C" fn atfork_tokio_child() {
  123 |     CPU_RUNTIME.store(std::ptr::null_mut(), Ordering::SeqCst);
  124 |     RUNTIME_INSTALLED.store(false, Ordering::SeqCst);
  125 | }
  126 | 
  127 | #[cfg(not(windows))]
  128 | fn install_atfork() {
  129 |     unsafe { libc::pthread_atfork(None, None, Some(atfork_tokio_child)) };
  130 | }
  131 | 
  132 | #[cfg(windows)]
  133 | fn install_atfork() {}
  134 | 
  135 | /// Spawn a CPU intensive task
  136 | ///
  137 | /// This task will be put onto a thread pool dedicated for CPU-intensive work
  138 | /// This keeps the tokio thread pool free so that we can always be ready to service
  139 | /// cheap I/O & control requests.
  140 | ///
  141 | /// This can also be used to convert a big chunk of synchronous work into a future
  142 | /// so that it can be run in parallel with something like StreamExt::buffered()
  143 | ///
  144 | /// # Only hand over substantial CPU work
  145 | ///
  146 | /// Dispatching to the pool has real overhead (a `spawn_blocking` hop plus a oneshot
  147 | /// channel round trip). As a rule of thumb the closure should be expected to do at
  148 | /// least ~100µs of CPU work; below that the thread-pool overhead is likely to
  149 | /// outweigh any parallelism benefit, and the work is better left inline.
  150 | ///
  151 | /// # The task must never wait on anything
  152 | ///
  153 | /// The CPU pool is sized to [`get_num_compute_intensive_cpus`], which is
  154 | /// `max(1, num_cpus - LANCE_IO_CORE_RESERVATION)`. On a big host that is plenty of
  155 | /// workers (e.g. 62 on a 64-core box), but in resource-constrained environments it can
  156 | /// collapse to a **single blocking thread** — on machines with `<= 3` visible CPUs
  157 | /// (1-vCPU VMs, CI runners, CPU-limited Kubernetes pods) the pool has exactly one
  158 | /// worker. A closure passed to `spawn_cpu` occupies one of these threads for its entire
  159 | /// lifetime, including any time it spends *parked*. So the closure must only consume
  160 | /// CPU and return; it must
  161 | /// **never** block, wait, or park. Concretely, the closure must not, directly or
  162 | /// transitively:
  163 | ///
  164 | /// * **No channels** — no blocking send/recv (`send_blocking`, blocking `recv`, etc.).
  165 | ///   A full/empty channel parks the thread, and whatever would drain/fill the channel
  166 | ///   may need the same pool to run.
  167 | /// * **No I/O** — no file, network, or object-store reads/writes, and no disk spills.
  168 | ///   I/O parks the thread while making no progress on CPU work.
  169 | /// * **No locks** — no acquiring a contended lock (or any lock that is held across an
  170 | ///   `.await` elsewhere). Waiting for the lock parks the thread.
  171 | /// * **No `block_on` / `.blocking_*`** — never drive or wait on another async task
  172 | ///   from inside the closure.
  173 | ///
  174 | /// If any of these hold, the parked thread can starve the exact work that would
  175 | /// unblock it, deadlocking the whole pool with no timeout and no error — a silent
  176 | /// hang at 0% CPU. (See <https://github.com/lancedb/lance/pull/7423>.) When work
  177 | /// needs to wait on a channel/lock/I/O, keep the waiting in an async task and only
  178 | /// hand the pure-CPU portion to `spawn_cpu`, e.g. build each batch with `spawn_cpu`
  179 | /// and dispatch it with `tx.send(batch).await` in the surrounding async code.
  180 | pub fn spawn_cpu<
  181 |     E: std::error::Error + Send + 'static,
  182 |     F: FnOnce() -> std::result::Result<R, E> + Send + 'static,
  183 |     R: Send + 'static,
  184 | >(
  185 |     func: F,
  186 | ) -> impl Future<Output = std::result::Result<R, E>> {
  187 |     // Propagate the current span into the task
  188 |     let span = Span::current();
  189 |     let handle = global_cpu_runtime().spawn_blocking(move || {
  190 |         let _span_guard = span.enter();
  191 |         func()
  192 |     });
  193 |     // Awaited through the join handle, not a result channel: a panic in `func`
  194 |     // arrives as a `JoinError` still carrying its payload, so resuming it
  195 |     // re-raises the original panic in the caller. Reporting the closure's
  196 |     // outcome over a channel instead loses that -- the sender drops unsent and
  197 |     // every panic in any `spawn_cpu` closure surfaces identically as an opaque
  198 |     // `RecvError`, pointing here rather than at the fault.
  199 |     handle.map(|res| match res {
  200 |         Ok(result) => result,
  201 |         Err(join_error) => match join_error.try_into_panic() {
  202 |             Ok(panic) => std::panic::resume_unwind(panic),
  203 |             // The CPU runtime outlives every caller, so its tasks are not
  204 |             // cancelled out from under one.
  205 |             Err(join_error) => panic!("spawn_cpu task failed: {join_error}"),
  206 |         },
  207 |     })
  208 | }
  209 | 
  210 | #[cfg(test)]
  211 | mod tests {
  212 |     use super::*;
  213 | 
  214 |     /// A panic in the closure must reach the caller intact.
  215 |     ///
  216 |     /// Reporting the closure's outcome over a channel loses it: the sender
  217 |     /// drops unsent and the caller can only see an opaque receive error, so
  218 |     /// every panic in every `spawn_cpu` closure looks the same.
  219 |     #[tokio::test]
  220 |     async fn spawn_cpu_reraises_the_closure_panic() {
  221 |         let hook = std::panic::take_hook();
  222 |         std::panic::set_hook(Box::new(|_| {}));
  223 |         let joined = tokio::spawn(async {
  224 |             spawn_cpu(|| -> std::result::Result<(), std::io::Error> {
  225 |                 panic!("the original message")
  226 |             })
  227 |             .await
  228 |         })
  229 |         .await;
  230 |         std::panic::set_hook(hook);
  231 | 
  232 |         let payload = joined
  233 |             .expect_err("the closure's panic propagates to the caller")
  234 |             .into_panic();
  235 |         let message = payload
  236 |             .downcast_ref::<&str>()
  237 |             .copied()
  238 |             .expect("the original payload survives");
  239 |         assert_eq!(message, "the original message");
  240 |     }
  241 | 
  242 |     // The env vars feed process-global `LazyLock`s that read once and are read
  243 |     // in parallel by other tests, so the pure parser is tested directly rather
  244 |     // than by mutating the environment.
  245 | 
  246 |     #[test]
  247 |     fn parses_valid_value_and_trims_surrounding_whitespace() {
  248 |         assert_eq!(parse_env_usize("VAR", "8", 1).unwrap(), 8);
  249 |         assert_eq!(parse_env_usize("VAR", " 8 ", 1).unwrap(), 8);
  250 |     }
  251 | 
  252 |     #[test]
  253 |     fn rejects_non_integer_naming_the_variable() {
  254 |         let err = parse_env_usize("LANCE_CPU_THREADS", "abc", 1).unwrap_err();
  255 |         assert!(err.contains("LANCE_CPU_THREADS"), "{err}");
  256 |         assert!(err.contains("must be an integer"), "{err}");
  257 |     }
  258 | 
  259 |     #[test]
  260 |     fn rejects_value_below_minimum() {
  261 |         // LANCE_CPU_THREADS=0 parses fine but would panic in tokio's
  262 |         // max_blocking_threads(0); the minimum stops it at the boundary.
  263 |         let err = parse_env_usize("LANCE_CPU_THREADS", "0", 1).unwrap_err();
  264 |         assert!(err.contains("at least 1"), "{err}");
  265 |     }
  266 | 
  267 |     #[test]
  268 |     fn allows_zero_when_minimum_is_zero() {
  269 |         // LANCE_IO_CORE_RESERVATION=0 is valid: no cores reserved for IO.
  270 |         assert_eq!(parse_env_usize("VAR", "0", 0).unwrap(), 0);
  271 |     }
  272 | }
``````
