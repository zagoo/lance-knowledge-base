> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-core/src/utils/cpu.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `b3197b4ed7a100662abc2aa5d5ff3687bf7ff468cb1ec9abfad0727ee0015373`. Reviewed physical lines: 1-369.

[Module](../../../../../L1-modules/rust-lance-core.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Architecture-conditioned SIMD capability detection and diagnostic reporting. This file selects a cached tier; it does not itself execute vector kernels or implement the CPU task pool. (rust/lance-core/src/utils/cpu.rs:1-369)

## Complete range analysis

### Lines 1-6

SPDX header and fmt/LazyLock imports. No IO runtime is imported. (rust/lance-core/src/utils/cpu.rs:1-6)

### Lines 7-35

Public non-exhaustive SimdSupport enum derives Debug, Clone, Copy, PartialEq and Eq. Variants are None, Neon, Sse, Avx, AvxFma, Avx2, Avx512, Avx512FP16, Lsx and Lasx. Comments separate AVX without FMA, AVX plus FMA without AVX2, and AVX2 plus FMA. AVX2 hardware lacking FMA falls back to Avx. External exhaustive matches must account for the non_exhaustive contract. Sse is representable but no initializer branch below selects it. (rust/lance-core/src/utils/cpu.rs:7-35)

### Lines 36-55

Display::fmt emits exact stable-looking diagnostic spellings none, neon, sse, avx, avx_fma, avx2, avx512, avx512_fp16, lsx and lasx through Formatter::write_str. The implementation returns fmt::Result and allocates no intermediate String; these are diagnostic labels, not serialized file-format discriminants. (rust/lance-core/src/utils/cpu.rs:36-55)

### Lines 56-73

Public SimdInfo derives Debug/Clone and exposes tier:SimdSupport, target_arch:&'static str, host_features:Vec<&'static str>. Documentation distinguishes selected Lance dispatch tier from raw host capabilities, with a Python-facing diagnostic motivation. host_features is x86-only; an empty list on other architectures does not mean no SIMD. (rust/lance-core/src/utils/cpu.rs:56-73)

### Lines 74-96

pub fn simd_info() -> SimdInfo reads the cached SIMD_SUPPORT, reports std::env::consts::ARCH and calls detect_host_features for each report. The example prints diagnostics but is documentation, not runtime logging. The structure is an owned snapshot; modifying its public fields does not change the cached dispatcher tier. (rust/lance-core/src/utils/cpu.rs:74-96)

### Lines 97-126

On x86_64, private detect_host_features allocates capacity 17 and tests sse2, sse3, ssse3, sse4.1, sse4.2, popcnt, avx and avx2, appending each detected string in that order. These per-feature checks use std architecture detection macros rather than assuming tier membership. The order is deterministic for a fixed host. The comment explains each detection call must stay inline because some toolchains reject feature names forwarded through a macro_rules :literal metavariable (rust/lance-core/src/utils/cpu.rs:100-102). (rust/lance-core/src/utils/cpu.rs:97-126)

### Lines 127-156

The x86 feature list continues fma, f16c, bmi1, bmi2, avx512f, avx512bw, avx512cd, avx512dq, avx512vl, then returns the vector. This is a selected diagnostic list, not a complete CPUID dump: AVX512 FP16 is not listed here despite its separate tier detector. (rust/lance-core/src/utils/cpu.rs:127-156)

### Lines 157-162

The cfg(not(x86_64)) implementation of detect_host_features returns an empty vector. The duplicate function names are mutually exclusive compile configurations, not overloads. (rust/lance-core/src/utils/cpu.rs:157-162)

### Lines 163-181

Public static SIMD_SUPPORT:LazyLock<SimdSupport> performs detection once at first access. aarch64 iOS/tvOS selects Neon unconditionally. Other aarch64 targets call aarch64::has_neon_f16_support, selecting Neon if true and None otherwise; the helper's platform assumptions below determine support. These branches do not query individual kernel requirements. (rust/lance-core/src/utils/cpu.rs:163-181)

### Lines 182-206

x86_64 selection priority is AVX512F (then FP16 bit distinguishes Avx512FP16/Avx512), AVX2 AND FMA -> Avx2, AVX AND FMA -> AvxFma, AVX -> Avx, else None. FMA gating is explicit because kernels may execute FMA even with AVX2 host support. The last fallback does not select Sse. Feature checks are cached by this LazyLock independently of simd_info's fresh vector construction. (rust/lance-core/src/utils/cpu.rs:182-206)

### Lines 207-225

loongarch64 selects Lasx first, otherwise Lsx, otherwise None. Architectures outside aarch64/x86_64/loongarch64 return None. No user environment override or fallible Result is exposed by this initializer. (rust/lance-core/src/utils/cpu.rs:207-225)

### Lines 226-254

Private x86 module contains check_flag(x:usize,position:u32)->bool and pub-in-private-module has_avx512_f16_support()/has_avx512(). FP16 detection first requires has_avx512(), then uses unsafe __cpuid(7) and tests EDX bit 23; has_avx512 uses is_x86_feature_detected!(avx512f). The CPUID instruction is architecture-gated and the feature gate precedes the raw bit test; downstream kernel safety still depends on callers. allow(unused_unsafe) accommodates toolchains differing on intrinsic safety. External links are comments, not fetched evidence. These helpers are not publicly reachable through the private module. (rust/lance-core/src/utils/cpu.rs:226-254)

### Lines 255-266

Provenance comments cite a third-party implementation. On aarch64 macOS the private module's has_neon_f16_support returns true with a platform-support assumption; no runtime auxiliary-vector query occurs. (rust/lance-core/src/utils/cpu.rs:255-266)

### Lines 267-275

On aarch64 Linux, the helper calls unsafe libc::getauxval(AT_HWCAP) and tests libc::HWCAP_FPHP. It does not return or inspect errno; a false bit produces false. This is a platform capability query, not an unsafe memory dereference in this source. (rust/lance-core/src/utils/cpu.rs:267-275)

### Lines 276-283

On aarch64 Windows the helper returns false and includes an issue URL without an inline explanation or TODO. The linked issue was not accessed, so the reason for disabling this helper is not established here. The aarch64 initializer consequently selects None on this target (rust/lance-core/src/utils/cpu.rs:171-180); selected tier is Lance dispatch policy rather than a hardware inventory. (rust/lance-core/src/utils/cpu.rs:276-283)

### Lines 284-297

The private loongarch64 module exposes internally reachable has_lsx_support and has_lasx_support, each using unsafe getauxval(AT_HWCAP) and its respective libc feature bit. The module has an architecture cfg, not an additional OS cfg; this file alone does not prove every loongarch operating system compiles. (rust/lance-core/src/utils/cpu.rs:284-297)

### Lines 298-305

On aarch64 Android the helper returns false. Only the explicit platform combinations above supply aarch64 helper modules; support for other operating systems must not be inferred from the broad aarch64 call site. (rust/lance-core/src/utils/cpu.rs:298-305)

### Lines 306-333

Private test module imports the API and rstest. simd_info_exposes_tier checks ARCH and cached tier identity. x86-only simd_info_features_include_baseline checks sse2; the complementary non-x86 test checks an empty raw feature vector. These are host-conditioned tests, not simulated cross-platform coverage. (rust/lance-core/src/utils/cpu.rs:306-333)

### Lines 334-350

x86-only avx_fma_tiers_are_only_selected_when_fma_is_detected checks the implication selected Avx2/AvxFma => hardware FMA. It does not force each dispatcher branch or require FMA on unrelated tiers; the comments explain avoiding illegal instructions. (rust/lance-core/src/utils/cpu.rs:334-350)

### Lines 351-369

A ten-case rstest matrix covers Display for every currently declared variant against its expected lowercase label. No kernel is run. Tests and doctest were read, not executed; CPU-dependent branches remain unmeasured on other hosts. (rust/lance-core/src/utils/cpu.rs:351-369)

## Interaction and interpretation limits

Local call edges are simd_info -> detect_host_features/SIMD_SUPPORT and SIMD_SUPPORT -> platform helpers (rust/lance-core/src/utils/cpu.rs:90-304). Complete external callers, feature-to-kernel requirement matching and all-target compilation remain pending. This analysis distinguishes represented enum variants, runtime-selected tiers and raw feature strings.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::fmt;
    5 | use std::sync::LazyLock;
    6 | 
    7 | /// A level of SIMD support for some feature.
    8 | ///
    9 | /// `#[non_exhaustive]` so future tiers (e.g. AVX-512 BF16, AMX) can be added
   10 | /// without breaking external `match` consumers.
   11 | #[derive(Debug, Clone, Copy, PartialEq, Eq)]
   12 | #[non_exhaustive]
   13 | pub enum SimdSupport {
   14 |     None,
   15 |     Neon,
   16 |     Sse,
   17 |     /// AVX (256-bit float ops) without FMA.
   18 |     ///
   19 |     /// This tier does not imply that AVX2 is absent: selecting [`Self::Avx2`]
   20 |     /// requires both AVX2 and FMA, so a host with AVX2 but no FMA selects this
   21 |     /// tier. Intel Sandy Bridge / Ivy Bridge are the typical hosts.
   22 |     Avx,
   23 |     /// AVX + FMA but no AVX2.
   24 |     /// AMD Piledriver / Steamroller / FX-7500.
   25 |     AvxFma,
   26 |     /// AVX2 + FMA. Intel Haswell / AMD Excavator and later.
   27 |     ///
   28 |     /// Selecting this tier asserts FMA is present: the kernels it dispatches to
   29 |     /// are `#[target_feature(enable = "avx,fma")]`.
   30 |     Avx2,
   31 |     Avx512,
   32 |     Avx512FP16,
   33 |     Lsx,
   34 |     Lasx,
   35 | }
   36 | 
   37 | impl fmt::Display for SimdSupport {
   38 |     /// Formats the tier name in lowercase, matching pyarrow's
   39 |     /// `runtime_info().simd_level` convention.
   40 |     fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
   41 |         let name = match self {
   42 |             Self::None => "none",
   43 |             Self::Neon => "neon",
   44 |             Self::Sse => "sse",
   45 |             Self::Avx => "avx",
   46 |             Self::AvxFma => "avx_fma",
   47 |             Self::Avx2 => "avx2",
   48 |             Self::Avx512 => "avx512",
   49 |             Self::Avx512FP16 => "avx512_fp16",
   50 |             Self::Lsx => "lsx",
   51 |             Self::Lasx => "lasx",
   52 |         };
   53 |         f.write_str(name)
   54 |     }
   55 | }
   56 | 
   57 | /// Snapshot of the SIMD tier lance dispatches to on the current host, plus the
   58 | /// raw CPU features detected for diagnostic purposes.
   59 | ///
   60 | /// Mirrors the role of `pyarrow.runtime_info()`: a single, cheap call users can
   61 | /// make to verify which SIMD tier the runtime selected and what underlying
   62 | /// features the host advertises. Obtain one with [`simd_info()`].
   63 | #[derive(Debug, Clone)]
   64 | pub struct SimdInfo {
   65 |     /// The SIMD tier lance dispatches to at runtime on this host.
   66 |     pub tier: SimdSupport,
   67 |     /// The architecture name (e.g. "x86_64", "aarch64", "loongarch64").
   68 |     pub target_arch: &'static str,
   69 |     /// Raw CPU feature flags detected on this host (x86_64 only; empty on
   70 |     /// other architectures). Each entry is a feature name like "avx2",
   71 |     /// "fma", "avx512f", "popcnt", etc.
   72 |     pub host_features: Vec<&'static str>,
   73 | }
   74 | 
   75 | /// Returns a snapshot of the SIMD tier lance is using on this host along with
   76 | /// the raw CPU feature flags that drove the decision.
   77 | ///
   78 | /// Useful for performance debugging and giving users a way to verify which
   79 | /// dispatch tier they are hitting without rebuilding lance. See [`SimdInfo`]
   80 | /// for the meaning of each field and [`SimdSupport`] for the tier values.
   81 | ///
   82 | /// # Examples
   83 | ///
   84 | /// ```
   85 | /// use lance_core::utils::cpu::simd_info;
   86 | ///
   87 | /// let info = simd_info();
   88 | /// println!("dispatching to {} on {}", info.tier, info.target_arch);
   89 | /// ```
   90 | pub fn simd_info() -> SimdInfo {
   91 |     SimdInfo {
   92 |         tier: *SIMD_SUPPORT,
   93 |         target_arch: std::env::consts::ARCH,
   94 |         host_features: detect_host_features(),
   95 |     }
   96 | }
   97 | 
   98 | #[cfg(target_arch = "x86_64")]
   99 | fn detect_host_features() -> Vec<&'static str> {
  100 |     // Each call must be inline: `is_x86_feature_detected!` does its own custom
  101 |     // input parsing and rejects feature names received via a `macro_rules!`
  102 |     // `:literal` metavariable on some toolchains.
  103 |     let mut features = Vec::with_capacity(17);
  104 |     if is_x86_feature_detected!("sse2") {
  105 |         features.push("sse2");
  106 |     }
  107 |     if is_x86_feature_detected!("sse3") {
  108 |         features.push("sse3");
  109 |     }
  110 |     if is_x86_feature_detected!("ssse3") {
  111 |         features.push("ssse3");
  112 |     }
  113 |     if is_x86_feature_detected!("sse4.1") {
  114 |         features.push("sse4.1");
  115 |     }
  116 |     if is_x86_feature_detected!("sse4.2") {
  117 |         features.push("sse4.2");
  118 |     }
  119 |     if is_x86_feature_detected!("popcnt") {
  120 |         features.push("popcnt");
  121 |     }
  122 |     if is_x86_feature_detected!("avx") {
  123 |         features.push("avx");
  124 |     }
  125 |     if is_x86_feature_detected!("avx2") {
  126 |         features.push("avx2");
  127 |     }
  128 |     if is_x86_feature_detected!("fma") {
  129 |         features.push("fma");
  130 |     }
  131 |     if is_x86_feature_detected!("f16c") {
  132 |         features.push("f16c");
  133 |     }
  134 |     if is_x86_feature_detected!("bmi1") {
  135 |         features.push("bmi1");
  136 |     }
  137 |     if is_x86_feature_detected!("bmi2") {
  138 |         features.push("bmi2");
  139 |     }
  140 |     if is_x86_feature_detected!("avx512f") {
  141 |         features.push("avx512f");
  142 |     }
  143 |     if is_x86_feature_detected!("avx512bw") {
  144 |         features.push("avx512bw");
  145 |     }
  146 |     if is_x86_feature_detected!("avx512cd") {
  147 |         features.push("avx512cd");
  148 |     }
  149 |     if is_x86_feature_detected!("avx512dq") {
  150 |         features.push("avx512dq");
  151 |     }
  152 |     if is_x86_feature_detected!("avx512vl") {
  153 |         features.push("avx512vl");
  154 |     }
  155 |     features
  156 | }
  157 | 
  158 | #[cfg(not(target_arch = "x86_64"))]
  159 | fn detect_host_features() -> Vec<&'static str> {
  160 |     Vec::new()
  161 | }
  162 | 
  163 | /// Support for SIMD operations
  164 | pub static SIMD_SUPPORT: LazyLock<SimdSupport> = LazyLock::new(|| {
  165 |     #[cfg(all(target_arch = "aarch64", any(target_os = "ios", target_os = "tvos")))]
  166 |     {
  167 |         // AArch64 iOS/tvOS has NEON; fp16 arithmetic is available on modern targets.
  168 |         SimdSupport::Neon
  169 |     }
  170 |     #[cfg(all(
  171 |         target_arch = "aarch64",
  172 |         not(any(target_os = "ios", target_os = "tvos"))
  173 |     ))]
  174 |     {
  175 |         if aarch64::has_neon_f16_support() {
  176 |             SimdSupport::Neon
  177 |         } else {
  178 |             SimdSupport::None
  179 |         }
  180 |     }
  181 |     #[cfg(target_arch = "x86_64")]
  182 |     {
  183 |         if x86::has_avx512() {
  184 |             if x86::has_avx512_f16_support() {
  185 |                 SimdSupport::Avx512FP16
  186 |             } else {
  187 |                 SimdSupport::Avx512
  188 |             }
  189 |         } else if is_x86_feature_detected!("avx2") && is_x86_feature_detected!("fma") {
  190 |             // FMA is checked explicitly: every kernel selected for this tier is
  191 |             // `#[target_feature(enable = "avx,fma")]`, and AVX2 does not imply
  192 |             // FMA in the ISA. Every shipping AVX2 part has FMA, so this only
  193 |             // guards against a host that would otherwise take an FMA kernel
  194 |             // without FMA.
  195 |             SimdSupport::Avx2
  196 |         } else if is_x86_feature_detected!("avx") && is_x86_feature_detected!("fma") {
  197 |             // AMD Piledriver / Steamroller / FX-7500: 256-bit float ops + FMA but no AVX2.
  198 |             SimdSupport::AvxFma
  199 |         } else if is_x86_feature_detected!("avx") {
  200 |             // This includes a possible AVX2 host without FMA because the Avx2
  201 |             // tier above requires both features.
  202 |             SimdSupport::Avx
  203 |         } else {
  204 |             SimdSupport::None
  205 |         }
  206 |     }
  207 |     #[cfg(target_arch = "loongarch64")]
  208 |     {
  209 |         if loongarch64::has_lasx_support() {
  210 |             SimdSupport::Lasx
  211 |         } else if loongarch64::has_lsx_support() {
  212 |             SimdSupport::Lsx
  213 |         } else {
  214 |             SimdSupport::None
  215 |         }
  216 |     }
  217 |     #[cfg(not(any(
  218 |         target_arch = "aarch64",
  219 |         target_arch = "x86_64",
  220 |         target_arch = "loongarch64"
  221 |     )))]
  222 |     {
  223 |         SimdSupport::None
  224 |     }
  225 | });
  226 | 
  227 | #[cfg(target_arch = "x86_64")]
  228 | mod x86 {
  229 |     use core::arch::x86_64::__cpuid;
  230 | 
  231 |     #[inline]
  232 |     fn check_flag(x: usize, position: u32) -> bool {
  233 |         x & (1 << position) != 0
  234 |     }
  235 | 
  236 |     pub fn has_avx512_f16_support() -> bool {
  237 |         // this macro does many OS checks/etc. to determine if allowed to use AVX512
  238 |         if !has_avx512() {
  239 |             return false;
  240 |         }
  241 | 
  242 |         // EAX=7, ECX=0: Extended Features (includes AVX512)
  243 |         // More info on calling CPUID can be found here (section 1.4)
  244 |         // https://www.intel.com/content/dam/develop/external/us/en/documents/architecture-instruction-set-extensions-programming-reference.pdf
  245 |         // __cpuid is safe in nightly but unsafe in stable, allow both
  246 |         #[allow(unused_unsafe)]
  247 |         let ext_cpuid_result = unsafe { __cpuid(7) };
  248 |         check_flag(ext_cpuid_result.edx as usize, 23)
  249 |     }
  250 | 
  251 |     pub fn has_avx512() -> bool {
  252 |         is_x86_feature_detected!("avx512f")
  253 |     }
  254 | }
  255 | 
  256 | // Inspired by https://github.com/RustCrypto/utils/blob/master/cpufeatures/src/aarch64.rs
  257 | // aarch64 doesn't have userspace feature detection built in, so we have to call
  258 | // into OS-specific functions to check for features.
  259 | 
  260 | #[cfg(all(target_arch = "aarch64", target_os = "macos"))]
  261 | mod aarch64 {
  262 |     pub fn has_neon_f16_support() -> bool {
  263 |         // Maybe we can assume it's there?
  264 |         true
  265 |     }
  266 | }
  267 | 
  268 | #[cfg(all(target_arch = "aarch64", target_os = "linux"))]
  269 | mod aarch64 {
  270 |     pub fn has_neon_f16_support() -> bool {
  271 |         // See: https://github.com/rust-lang/libc/blob/7ce81ca7aeb56aae7ca0237ef9353d58f3d7d2f1/src/unix/linux_like/linux/gnu/b64/aarch64/mod.rs#L533
  272 |         let flags = unsafe { libc::getauxval(libc::AT_HWCAP) };
  273 |         flags & libc::HWCAP_FPHP != 0
  274 |     }
  275 | }
  276 | 
  277 | #[cfg(all(target_arch = "aarch64", target_os = "windows"))]
  278 | mod aarch64 {
  279 |     pub fn has_neon_f16_support() -> bool {
  280 |         // https://github.com/lance-format/lance/issues/2411
  281 |         false
  282 |     }
  283 | }
  284 | 
  285 | #[cfg(target_arch = "loongarch64")]
  286 | mod loongarch64 {
  287 |     pub fn has_lsx_support() -> bool {
  288 |         // See: https://github.com/rust-lang/libc/blob/7ce81ca7aeb56aae7ca0237ef9353d58f3d7d2f1/src/unix/linux_like/linux/gnu/b64/loongarch64/mod.rs#L263
  289 |         let flags = unsafe { libc::getauxval(libc::AT_HWCAP) };
  290 |         flags & libc::HWCAP_LOONGARCH_LSX != 0
  291 |     }
  292 |     pub fn has_lasx_support() -> bool {
  293 |         // See: https://github.com/rust-lang/libc/blob/7ce81ca7aeb56aae7ca0237ef9353d58f3d7d2f1/src/unix/linux_like/linux/gnu/b64/loongarch64/mod.rs#L264
  294 |         let flags = unsafe { libc::getauxval(libc::AT_HWCAP) };
  295 |         flags & libc::HWCAP_LOONGARCH_LASX != 0
  296 |     }
  297 | }
  298 | 
  299 | #[cfg(all(target_arch = "aarch64", target_os = "android"))]
  300 | mod aarch64 {
  301 |     pub fn has_neon_f16_support() -> bool {
  302 |         false
  303 |     }
  304 | }
  305 | 
  306 | #[cfg(test)]
  307 | mod tests {
  308 |     use super::*;
  309 |     use rstest::rstest;
  310 | 
  311 |     #[test]
  312 |     fn simd_info_exposes_tier() {
  313 |         let info = simd_info();
  314 |         assert_eq!(info.target_arch, std::env::consts::ARCH);
  315 |         // Tier should match the detected SIMD support.
  316 |         assert_eq!(info.tier, *SIMD_SUPPORT);
  317 |     }
  318 | 
  319 |     #[cfg(target_arch = "x86_64")]
  320 |     #[test]
  321 |     fn simd_info_features_include_baseline() {
  322 |         let info = simd_info();
  323 |         // The x86_64 ABI mandates SSE2, so it must always be present on this
  324 |         // architecture.
  325 |         assert!(info.host_features.contains(&"sse2"));
  326 |     }
  327 | 
  328 |     #[cfg(not(target_arch = "x86_64"))]
  329 |     #[test]
  330 |     fn simd_info_features_empty_off_x86_64() {
  331 |         let info = simd_info();
  332 |         assert!(info.host_features.is_empty());
  333 |     }
  334 | 
  335 |     /// The `Avx2` and `AvxFma` tiers both dispatch to kernels declared
  336 |     /// `#[target_feature(enable = "avx,fma")]`, so neither may be selected on a
  337 |     /// host without FMA. AVX2 does not imply FMA in the ISA, so the detection
  338 |     /// checks it explicitly. (`Avx512*` is excluded: its kernels declare
  339 |     /// `avx512f`, which is what `has_avx512` verifies.)
  340 |     #[cfg(target_arch = "x86_64")]
  341 |     #[test]
  342 |     fn avx_fma_tiers_are_only_selected_when_fma_is_detected() {
  343 |         if matches!(*SIMD_SUPPORT, SimdSupport::Avx2 | SimdSupport::AvxFma) {
  344 |             assert!(
  345 |                 is_x86_feature_detected!("fma"),
  346 |                 "tier {} dispatches to avx,fma kernels but the host has no FMA",
  347 |                 *SIMD_SUPPORT
  348 |             );
  349 |         }
  350 |     }
  351 | 
  352 |     #[rstest]
  353 |     #[case::none(SimdSupport::None, "none")]
  354 |     #[case::neon(SimdSupport::Neon, "neon")]
  355 |     #[case::sse(SimdSupport::Sse, "sse")]
  356 |     #[case::avx(SimdSupport::Avx, "avx")]
  357 |     #[case::avx_fma(SimdSupport::AvxFma, "avx_fma")]
  358 |     #[case::avx2(SimdSupport::Avx2, "avx2")]
  359 |     #[case::avx512(SimdSupport::Avx512, "avx512")]
  360 |     #[case::avx512_fp16(SimdSupport::Avx512FP16, "avx512_fp16")]
  361 |     #[case::lsx(SimdSupport::Lsx, "lsx")]
  362 |     #[case::lasx(SimdSupport::Lasx, "lasx")]
  363 |     fn simd_support_display_matches_lowercase_convention(
  364 |         #[case] tier: SimdSupport,
  365 |         #[case] expected: &str,
  366 |     ) {
  367 |         assert_eq!(tier.to_string(), expected);
  368 |     }
  369 | }
``````
