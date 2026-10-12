> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-core/src/utils/aimd.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `5146995d23b1e28492efbbcb9a13f24dd5d0bb520d884745c74d26d59c5c1ad0`. Reviewed physical lines: 1-679.

[Module](../../../../../L1-modules/rust-lance-core-control-testing.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public validated configuration and thread-safe additive-increase/multiplicative-decrease rate estimator. The controller aggregates request outcomes in lazy time windows and returns a rate; it does not acquire tokens, delay requests, perform IO or classify external errors. Private state and deterministic-time unit helpers implement the update policy. (rust/lance-core/src/utils/aimd.rs:1-679)

## Complete range analysis

### Lines 1-19

SPDX/module docs define discrete-window AIMD: strict throttle_ratio>threshold decreases with a minimum floor; at/below increases with an optional maximum ceiling. Imports are std Mutex/Duration and core Result. Documentation describes rate adjustment, not an implemented request-admission mechanism. (rust/lance-core/src/utils/aimd.rs:1-19)

### Lines 20-57

Public AimdConfig derives Debug/Clone and exposes seven mutable fields. Default is initial2000,min1,max5000 requests/second,decrease0.5,additive300 per successful window,window1second,threshold0. The about40%-of-max and10seconds ramp comments assume active successful windows reaching evaluation boundaries; elapsed time alone does not update the rate (rust/lance-core/src/utils/aimd.rs:238-289). (rust/lance-core/src/utils/aimd.rs:20-57)

### Lines 58-101

Seven consuming with_* builders replace exactly one field using struct update, returning Self without validation: initial/min/max rates, decrease factor, increment, duration and threshold. Invalid intermediate or directly constructed configs are possible; explicit validate or controller new establishes legality. (rust/lance-core/src/utils/aimd.rs:58-101)

### Lines 102-123

validate first rejects every nonfinite f64 field, in order initial,min,max,decrease,increment,threshold, with InvalidInput naming field/value. Comments explain that NaN evades comparisons and can disable a downstream token bucket or panic duration conversion; those downstream behaviors are rationale, not code implemented here. NaN and infinities are rejected even for the optional maximum ceiling; finite zero disables it. (rust/lance-core/src/utils/aimd.rs:102-123)

### Lines 124-147

Validation requires initial_rate>0, min_rate>0, max_rate>=0, and when max>0 requires min<=max. Each failure returns descriptive InvalidInput. Both signed floating zero values satisfy max>=0 and max>0 is false, so either represents no ceiling; initial/min zero fail. No clamping occurs during validation. (rust/lance-core/src/utils/aimd.rs:124-147)

### Lines 148-170

decrease_factor must be strictly between0 and1, additive_increment strictly positive, window_duration nonzero, and throttle_threshold within inclusive[0,1]. Errors identify invalid values except the fixed zero-duration message. Finiteness has already been checked. (rust/lance-core/src/utils/aimd.rs:148-170)

### Lines 171-185

Finally require initial<=max if the ceiling is enabled and initial>=min, then return Ok. This ordering selects which error appears for multiply invalid configs; controller construction delegates rather than repairing values. (rust/lance-core/src/utils/aimd.rs:171-185)

### Lines 186-203

Public RequestOutcome derives Debug/Clone/Copy/PartialEq/Eq with Success and Throttled. Docs instruct callers to map non-throttle errors such as404/timeouts to Success because they do not indicate capacity trouble; no classifier is implemented. Private AimdState holds rate f64, window_start std::time::Instant and separate u64 success/throttle counts. (rust/lance-core/src/utils/aimd.rs:186-203)

### Lines 204-221

Public AimdController owns private config and Mutex<AimdState>. Docs promise thread-safe short critical sections; no measured latency is established. Custom Debug formats config and current_rate, which acquires the same mutex and unwraps poisoning. No Clone implementation, mutable config accessor or async lock appears. (rust/lance-core/src/utils/aimd.rs:204-221)

### Lines 222-237

new validates the entire config, starts rate at initial_rate, stores config immutably within the controller, initializes window_start to Instant::now and zeroes both counters. Invalid config returns before state construction. Mutex protects only state, while config can be read through shared self. (rust/lance-core/src/utils/aimd.rs:222-237)

### Lines 238-252

record_outcome locks the mutex with unwrap and invokes private record_outcome_inner using Instant::now after the lock is acquired. Private helper receives explicit mutable state/outcome/time so tests advance windows without sleeping. Poisoned mutex therefore panics in the public method rather than returning Result. The lock covers time comparison, arithmetic and count update. (rust/lance-core/src/utils/aimd.rs:238-252)

### Lines 253-270

On elapsed>=window_duration, compute total=success_count+throttle_count with ordinary u64 arithmetic. If nonzero, ratio=throttles as f64/total as f64. Strict ratio>threshold sets max(rate*decrease_factor,min_rate); equality/below adds increment and, only when max_rate>0, caps via min(max_rate). Threshold1 never decreases for ordinary nonoverflowed counts, even for an all-throttle window. Finite validated settings can still overflow unlimited additive growth to infinity; no runtime finiteness recheck occurs. (rust/lance-core/src/utils/aimd.rs:253-270)

### Lines 271-290

An expired window resets its start to now and both counters to zero, even if it contained no outcomes; only one adjustment occurs regardless of how many durations elapsed. Then increment the incoming outcome in the fresh/current window and return the rate. The boundary-triggering outcome does not affect the window just evaluated. current_rate only reads under mutex and does not advance time or adjust rate. Counter increments/sums use unchecked-in-source u64 arithmetic. There is no background timer or sleep. (rust/lance-core/src/utils/aimd.rs:271-290)

### Lines 291-349

The private cfg(test) module imports rstest. Named invalid-config cases cover zero initial,negative min/max,min>max,decrease0/1/>1,zero increment,zero duration,threshold>1/<0,initial>max andinitial<min. Each parameter changes defaults through the same nonvalidating builders. Error-category/text assertions appear after the remaining cases (rust/lance-core/src/utils/aimd.rs:382-398). (rust/lance-core/src/utils/aimd.rs:291-349)

### Lines 350-399

Additional invalid-config cases supply NaN to every floating field and positive infinity to initial/max. The parameterized test calls validate, asserts InvalidInput and requires the expected message substring. It does not enumerate negative infinity or positive infinity for every field, although the common finiteness loop handles them. (rust/lance-core/src/utils/aimd.rs:350-399)

### Lines 400-409

Two tests accept the unchanged defaults and max_rate0 unlimited configuration. They verify validation success only, not sustained throughput or rate enforcement. (rust/lance-core/src/utils/aimd.rs:400-409)

### Lines 410-435

Additive test uses initial100,increment10,window100ms. It records one success at a captured start through the private helper, then another150ms later and asserts current_rate110. New outcome triggers evaluation of the previous success window. No real sleep occurs. (rust/lance-core/src/utils/aimd.rs:410-435)

### Lines 436-459

Decrease test starts100,factor0.5,window100ms, records one throttle then a success150ms later and expects50. The success is placed in the new window rather than canceling the prior throttle. (rust/lance-core/src/utils/aimd.rs:436-459)

### Lines 460-491

Floor test starts2,min1,factor0.5. Two successive closed throttle windows move2→1 and stay1; a success at the second boundary triggers evaluation of the second throttle window. Each helper call occurs under the controller state mutex with explicit simulated time. (rust/lance-core/src/utils/aimd.rs:460-491)

### Lines 492-515

Ceiling fixture starts4990,max5000,increment20. A closed success window computes5010 then caps to5000. This tests rate-update clamping with a valid config, not silent adjustment of invalid input configuration. (rust/lance-core/src/utils/aimd.rs:492-515)

### Lines 516-545

Unlimited fixture starts100,max0,increment50. It records five successes at150ms intervals, then a sixth success triggers the final pending window evaluation: five nonempty windows are evaluated in total, yielding100+5*50=350. This demonstrates no finite configured ceiling for these small values, not safe infinite-duration or f64-maximum growth. (rust/lance-core/src/utils/aimd.rs:516-545)

### Lines 546-564

Empty-window test advances150ms before the first outcome, leaving the expired window total zero. Rate remains100; the incoming success seeds the new window. This explicitly confirms idle elapsed time alone does not add an increment. (rust/lance-core/src/utils/aimd.rs:546-564)

### Lines 565-594

Threshold0.5 fixture records two successes and one throttle in a100ms window. A later success closes it and rate100 becomes110 because1/3<=0.5. The test does not use exact threshold equality. (rust/lance-core/src/utils/aimd.rs:565-594)

### Lines 595-622

A second threshold0.5 fixture records one success/two throttles and expects100→50 after a boundary trigger. The leading comment says >=50%, but actual algorithm uses strict > and this fixture has2/3, so it does not support decrease at equality. Keep the implementation rule rather than repeating the overbroad comment. (rust/lance-core/src/utils/aimd.rs:595-622)

### Lines 623-663

Recovery fixture begins100,halves after a throttle window to50, then adds10 for each of two success windows, ultimately70. Comments name the window to be evaluated by the following call; only the final current_rate70 is asserted. (rust/lance-core/src/utils/aimd.rs:623-663)

### Lines 664-679

Within-window test calls the public record_outcome100 times with Throttled and a10second window, then expects unchanged100. This assumes the test completes before the real window expires; unlike prior tests it uses actual Instant::now per call. It proves intended within-window holding, not concurrent fairness, poisoned-lock behavior or rate enforcement. Module ends. (rust/lance-core/src/utils/aimd.rs:664-679)

## Interaction and interpretation limits

All679 lines were read; tests were not executed. Actual object-store integration, token-bucket behavior mentioned by comments, external classification of throttling and callers remain pending. Public current_rate does not expire windows. Mutex poison handling, u64 counter overflow, unlimited f64 growth overflow, threshold equality and multiple idle-window catch-up are not explicitly tested locally. (rust/lance-core/src/utils/aimd.rs:102-184; rust/lance-core/src/utils/aimd.rs:187-290; rust/lance-core/src/utils/aimd.rs:292-679)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! AIMD (Additive Increase / Multiplicative Decrease) rate controller.
    5 | //!
    6 | //! This module provides a reusable AIMD algorithm for dynamically adjusting
    7 | //! request rates. On success windows, the rate increases additively. On
    8 | //! windows with throttle signals, the rate decreases multiplicatively.
    9 | //!
   10 | //! The algorithm operates in discrete time windows. At the end of each window,
   11 | //! the throttle ratio (throttled / total) is compared against a threshold:
   12 | //! - Above threshold: `rate = max(rate * decrease_factor, min_rate)`
   13 | //! - At or below threshold: `rate = min(rate + additive_increment, max_rate)`
   14 | 
   15 | use std::sync::Mutex;
   16 | use std::time::Duration;
   17 | 
   18 | use crate::Result;
   19 | 
   20 | /// Configuration for the AIMD rate controller.
   21 | ///
   22 | /// Use builder methods to customize. Defaults are tuned for cloud object stores
   23 | /// and will start at about 40% of the max rate and require 10 seconds to reach
   24 | /// the max rate.
   25 | ///
   26 | /// - initial_rate: 2000 req/s
   27 | /// - min_rate: 1 req/s
   28 | /// - max_rate: 5000 req/s (0.0 disables the ceiling; must be finite otherwise)
   29 | /// - decrease_factor: 0.5 (halve on throttle)
   30 | /// - additive_increment: 300 req/s per success window
   31 | /// - window_duration: 1 second
   32 | /// - throttle_threshold: 0.0 (any throttle triggers decrease)
   33 | #[derive(Debug, Clone)]
   34 | pub struct AimdConfig {
   35 |     pub initial_rate: f64,
   36 |     pub min_rate: f64,
   37 |     pub max_rate: f64,
   38 |     pub decrease_factor: f64,
   39 |     pub additive_increment: f64,
   40 |     pub window_duration: Duration,
   41 |     pub throttle_threshold: f64,
   42 | }
   43 | 
   44 | impl Default for AimdConfig {
   45 |     fn default() -> Self {
   46 |         Self {
   47 |             initial_rate: 2000.0,
   48 |             min_rate: 1.0,
   49 |             max_rate: 5000.0,
   50 |             decrease_factor: 0.5,
   51 |             additive_increment: 300.0,
   52 |             window_duration: Duration::from_secs(1),
   53 |             throttle_threshold: 0.0,
   54 |         }
   55 |     }
   56 | }
   57 | 
   58 | impl AimdConfig {
   59 |     pub fn with_initial_rate(self, initial_rate: f64) -> Self {
   60 |         Self {
   61 |             initial_rate,
   62 |             ..self
   63 |         }
   64 |     }
   65 | 
   66 |     pub fn with_min_rate(self, min_rate: f64) -> Self {
   67 |         Self { min_rate, ..self }
   68 |     }
   69 | 
   70 |     pub fn with_max_rate(self, max_rate: f64) -> Self {
   71 |         Self { max_rate, ..self }
   72 |     }
   73 | 
   74 |     pub fn with_decrease_factor(self, decrease_factor: f64) -> Self {
   75 |         Self {
   76 |             decrease_factor,
   77 |             ..self
   78 |         }
   79 |     }
   80 | 
   81 |     pub fn with_additive_increment(self, additive_increment: f64) -> Self {
   82 |         Self {
   83 |             additive_increment,
   84 |             ..self
   85 |         }
   86 |     }
   87 | 
   88 |     pub fn with_window_duration(self, window_duration: Duration) -> Self {
   89 |         Self {
   90 |             window_duration,
   91 |             ..self
   92 |         }
   93 |     }
   94 | 
   95 |     pub fn with_throttle_threshold(self, throttle_threshold: f64) -> Self {
   96 |         Self {
   97 |             throttle_threshold,
   98 |             ..self
   99 |         }
  100 |     }
  101 | 
  102 |     /// Validate that the configuration values are sensible.
  103 |     pub fn validate(&self) -> Result<()> {
  104 |         // Reject NaN and infinity first. The sign and ordering checks below
  105 |         // compare with `<`/`>`, which are `false` for NaN and for a `+inf` on
  106 |         // a field with no opposing bound, so a non-finite rate would otherwise
  107 |         // slip through and silently disable throttling (a NaN rate makes the
  108 |         // token bucket refill to full on every acquire) or, with a zero burst
  109 |         // capacity, panic in `Duration::from_secs_f64`.
  110 |         for (name, value) in [
  111 |             ("initial_rate", self.initial_rate),
  112 |             ("min_rate", self.min_rate),
  113 |             ("max_rate", self.max_rate),
  114 |             ("decrease_factor", self.decrease_factor),
  115 |             ("additive_increment", self.additive_increment),
  116 |             ("throttle_threshold", self.throttle_threshold),
  117 |         ] {
  118 |             if !value.is_finite() {
  119 |                 return Err(crate::Error::invalid_input(format!(
  120 |                     "{name} must be finite, got {value}"
  121 |                 )));
  122 |             }
  123 |         }
  124 |         if self.initial_rate <= 0.0 {
  125 |             return Err(crate::Error::invalid_input(format!(
  126 |                 "initial_rate must be positive, got {}",
  127 |                 self.initial_rate
  128 |             )));
  129 |         }
  130 |         if self.min_rate <= 0.0 {
  131 |             return Err(crate::Error::invalid_input(format!(
  132 |                 "min_rate must be positive, got {}",
  133 |                 self.min_rate
  134 |             )));
  135 |         }
  136 |         if self.max_rate < 0.0 {
  137 |             return Err(crate::Error::invalid_input(format!(
  138 |                 "max_rate must be non-negative (0.0 = no ceiling), got {}",
  139 |                 self.max_rate
  140 |             )));
  141 |         }
  142 |         if self.max_rate > 0.0 && self.min_rate > self.max_rate {
  143 |             return Err(crate::Error::invalid_input(format!(
  144 |                 "min_rate ({}) must not exceed max_rate ({})",
  145 |                 self.min_rate, self.max_rate
  146 |             )));
  147 |         }
  148 |         if self.decrease_factor <= 0.0 || self.decrease_factor >= 1.0 {
  149 |             return Err(crate::Error::invalid_input(format!(
  150 |                 "decrease_factor must be in (0, 1), got {}",
  151 |                 self.decrease_factor
  152 |             )));
  153 |         }
  154 |         if self.additive_increment <= 0.0 {
  155 |             return Err(crate::Error::invalid_input(format!(
  156 |                 "additive_increment must be positive, got {}",
  157 |                 self.additive_increment
  158 |             )));
  159 |         }
  160 |         if self.window_duration.is_zero() {
  161 |             return Err(crate::Error::invalid_input(
  162 |                 "window_duration must be non-zero",
  163 |             ));
  164 |         }
  165 |         if !(0.0..=1.0).contains(&self.throttle_threshold) {
  166 |             return Err(crate::Error::invalid_input(format!(
  167 |                 "throttle_threshold must be in [0.0, 1.0], got {}",
  168 |                 self.throttle_threshold
  169 |             )));
  170 |         }
  171 |         if self.max_rate > 0.0 && self.initial_rate > self.max_rate {
  172 |             return Err(crate::Error::invalid_input(format!(
  173 |                 "initial_rate ({}) must not exceed max_rate ({})",
  174 |                 self.initial_rate, self.max_rate
  175 |             )));
  176 |         }
  177 |         if self.initial_rate < self.min_rate {
  178 |             return Err(crate::Error::invalid_input(format!(
  179 |                 "initial_rate ({}) must not be below min_rate ({})",
  180 |                 self.initial_rate, self.min_rate
  181 |             )));
  182 |         }
  183 |         Ok(())
  184 |     }
  185 | }
  186 | 
  187 | /// Outcome of a single request, used to feed the AIMD controller.
  188 | ///
  189 | /// Non-throttle errors (e.g. 404, network timeout) should be mapped to
  190 | /// `Success` since they don't indicate capacity problems.
  191 | #[derive(Debug, Clone, Copy, PartialEq, Eq)]
  192 | pub enum RequestOutcome {
  193 |     Success,
  194 |     Throttled,
  195 | }
  196 | 
  197 | struct AimdState {
  198 |     rate: f64,
  199 |     window_start: std::time::Instant,
  200 |     success_count: u64,
  201 |     throttle_count: u64,
  202 | }
  203 | 
  204 | /// AIMD rate controller.
  205 | ///
  206 | /// Thread-safe: uses an internal `Mutex` to protect state. The lock is held
  207 | /// only briefly during `record_outcome` and `current_rate`.
  208 | pub struct AimdController {
  209 |     config: AimdConfig,
  210 |     state: Mutex<AimdState>,
  211 | }
  212 | 
  213 | impl std::fmt::Debug for AimdController {
  214 |     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
  215 |         f.debug_struct("AimdController")
  216 |             .field("config", &self.config)
  217 |             .field("rate", &self.current_rate())
  218 |             .finish()
  219 |     }
  220 | }
  221 | 
  222 | impl AimdController {
  223 |     /// Create a new AIMD controller with the given configuration.
  224 |     pub fn new(config: AimdConfig) -> Result<Self> {
  225 |         config.validate()?;
  226 |         let rate = config.initial_rate;
  227 |         Ok(Self {
  228 |             config,
  229 |             state: Mutex::new(AimdState {
  230 |                 rate,
  231 |                 window_start: std::time::Instant::now(),
  232 |                 success_count: 0,
  233 |                 throttle_count: 0,
  234 |             }),
  235 |         })
  236 |     }
  237 | 
  238 |     /// Record a request outcome and return the current rate.
  239 |     ///
  240 |     /// If the current time window has expired, the rate is adjusted before
  241 |     /// recording the new outcome in a fresh window.
  242 |     pub fn record_outcome(&self, outcome: RequestOutcome) -> f64 {
  243 |         let mut state = self.state.lock().unwrap();
  244 |         self.record_outcome_inner(&mut state, outcome, std::time::Instant::now())
  245 |     }
  246 | 
  247 |     fn record_outcome_inner(
  248 |         &self,
  249 |         state: &mut AimdState,
  250 |         outcome: RequestOutcome,
  251 |         now: std::time::Instant,
  252 |     ) -> f64 {
  253 |         // Check if the window has expired
  254 |         let elapsed = now.duration_since(state.window_start);
  255 |         if elapsed >= self.config.window_duration {
  256 |             let total = state.success_count + state.throttle_count;
  257 |             if total > 0 {
  258 |                 let throttle_ratio = state.throttle_count as f64 / total as f64;
  259 |                 if throttle_ratio > self.config.throttle_threshold {
  260 |                     // Multiplicative decrease
  261 |                     state.rate =
  262 |                         (state.rate * self.config.decrease_factor).max(self.config.min_rate);
  263 |                 } else {
  264 |                     // Additive increase
  265 |                     state.rate += self.config.additive_increment;
  266 |                     if self.config.max_rate > 0.0 {
  267 |                         state.rate = state.rate.min(self.config.max_rate);
  268 |                     }
  269 |                 }
  270 |             }
  271 |             // Reset window
  272 |             state.window_start = now;
  273 |             state.success_count = 0;
  274 |             state.throttle_count = 0;
  275 |         }
  276 | 
  277 |         // Record this outcome
  278 |         match outcome {
  279 |             RequestOutcome::Success => state.success_count += 1,
  280 |             RequestOutcome::Throttled => state.throttle_count += 1,
  281 |         }
  282 | 
  283 |         state.rate
  284 |     }
  285 | 
  286 |     /// Get the current rate without recording an outcome.
  287 |     pub fn current_rate(&self) -> f64 {
  288 |         self.state.lock().unwrap().rate
  289 |     }
  290 | }
  291 | 
  292 | #[cfg(test)]
  293 | mod tests {
  294 |     use super::*;
  295 |     use rstest::rstest;
  296 | 
  297 |     #[rstest]
  298 |     #[case::zero_initial_rate(
  299 |         AimdConfig::default().with_initial_rate(0.0),
  300 |         "initial_rate must be positive"
  301 |     )]
  302 |     #[case::negative_min_rate(
  303 |         AimdConfig::default().with_min_rate(-1.0),
  304 |         "min_rate must be positive"
  305 |     )]
  306 |     #[case::negative_max_rate(
  307 |         AimdConfig::default().with_max_rate(-1.0),
  308 |         "max_rate must be non-negative"
  309 |     )]
  310 |     #[case::min_exceeds_max(
  311 |         AimdConfig::default().with_min_rate(100.0).with_max_rate(10.0),
  312 |         "min_rate (100) must not exceed max_rate (10)"
  313 |     )]
  314 |     #[case::decrease_factor_zero(
  315 |         AimdConfig::default().with_decrease_factor(0.0),
  316 |         "decrease_factor must be in (0, 1)"
  317 |     )]
  318 |     #[case::decrease_factor_one(
  319 |         AimdConfig::default().with_decrease_factor(1.0),
  320 |         "decrease_factor must be in (0, 1)"
  321 |     )]
  322 |     #[case::decrease_factor_over_one(
  323 |         AimdConfig::default().with_decrease_factor(1.5),
  324 |         "decrease_factor must be in (0, 1)"
  325 |     )]
  326 |     #[case::zero_additive_increment(
  327 |         AimdConfig::default().with_additive_increment(0.0),
  328 |         "additive_increment must be positive"
  329 |     )]
  330 |     #[case::zero_window_duration(
  331 |         AimdConfig::default().with_window_duration(Duration::ZERO),
  332 |         "window_duration must be non-zero"
  333 |     )]
  334 |     #[case::threshold_over_one(
  335 |         AimdConfig::default().with_throttle_threshold(1.1),
  336 |         "throttle_threshold must be in [0.0, 1.0]"
  337 |     )]
  338 |     #[case::threshold_negative(
  339 |         AimdConfig::default().with_throttle_threshold(-0.1),
  340 |         "throttle_threshold must be in [0.0, 1.0]"
  341 |     )]
  342 |     #[case::initial_exceeds_max(
  343 |         AimdConfig::default().with_initial_rate(6000.0),
  344 |         "initial_rate (6000) must not exceed max_rate (5000)"
  345 |     )]
  346 |     #[case::initial_below_min(
  347 |         AimdConfig::default().with_initial_rate(0.5).with_min_rate(1.0),
  348 |         "initial_rate (0.5) must not be below min_rate (1)"
  349 |     )]
  350 |     #[case::nan_initial_rate(
  351 |         AimdConfig::default().with_initial_rate(f64::NAN),
  352 |         "initial_rate must be finite"
  353 |     )]
  354 |     #[case::inf_initial_rate(
  355 |         AimdConfig::default().with_initial_rate(f64::INFINITY),
  356 |         "initial_rate must be finite"
  357 |     )]
  358 |     #[case::nan_min_rate(
  359 |         AimdConfig::default().with_min_rate(f64::NAN),
  360 |         "min_rate must be finite"
  361 |     )]
  362 |     #[case::nan_max_rate(
  363 |         AimdConfig::default().with_max_rate(f64::NAN),
  364 |         "max_rate must be finite"
  365 |     )]
  366 |     #[case::inf_max_rate(
  367 |         AimdConfig::default().with_max_rate(f64::INFINITY),
  368 |         "max_rate must be finite"
  369 |     )]
  370 |     #[case::nan_decrease_factor(
  371 |         AimdConfig::default().with_decrease_factor(f64::NAN),
  372 |         "decrease_factor must be finite"
  373 |     )]
  374 |     #[case::nan_additive_increment(
  375 |         AimdConfig::default().with_additive_increment(f64::NAN),
  376 |         "additive_increment must be finite"
  377 |     )]
  378 |     #[case::nan_throttle_threshold(
  379 |         AimdConfig::default().with_throttle_threshold(f64::NAN),
  380 |         "throttle_threshold must be finite"
  381 |     )]
  382 |     fn test_config_validation_rejects_invalid(
  383 |         #[case] config: AimdConfig,
  384 |         #[case] expected_msg: &str,
  385 |     ) {
  386 |         let err = config.validate().unwrap_err();
  387 |         assert!(
  388 |             matches!(&err, crate::Error::InvalidInput { .. }),
  389 |             "expected InvalidInput, got: {err:?}"
  390 |         );
  391 |         let msg = err.to_string();
  392 |         assert!(
  393 |             msg.contains(expected_msg),
  394 |             "Expected error containing '{}', got: {}",
  395 |             expected_msg,
  396 |             msg
  397 |         );
  398 |     }
  399 | 
  400 |     #[test]
  401 |     fn test_default_config_is_valid() {
  402 |         AimdConfig::default().validate().unwrap();
  403 |     }
  404 | 
  405 |     #[test]
  406 |     fn test_no_ceiling_config_is_valid() {
  407 |         AimdConfig::default().with_max_rate(0.0).validate().unwrap();
  408 |     }
  409 | 
  410 |     #[test]
  411 |     fn test_additive_increase_on_success_window() {
  412 |         let config = AimdConfig::default()
  413 |             .with_initial_rate(100.0)
  414 |             .with_additive_increment(10.0)
  415 |             .with_window_duration(Duration::from_millis(100));
  416 |         let controller = AimdController::new(config).unwrap();
  417 | 
  418 |         // Record some successes in the first window
  419 |         let start = std::time::Instant::now();
  420 |         {
  421 |             let mut state = controller.state.lock().unwrap();
  422 |             controller.record_outcome_inner(&mut state, RequestOutcome::Success, start);
  423 |         }
  424 | 
  425 |         // Advance past the window boundary and record another success
  426 |         let after_window = start + Duration::from_millis(150);
  427 |         {
  428 |             let mut state = controller.state.lock().unwrap();
  429 |             controller.record_outcome_inner(&mut state, RequestOutcome::Success, after_window);
  430 |         }
  431 | 
  432 |         // Rate should have increased by additive_increment
  433 |         assert_eq!(controller.current_rate(), 110.0);
  434 |     }
  435 | 
  436 |     #[test]
  437 |     fn test_multiplicative_decrease_on_throttle_window() {
  438 |         let config = AimdConfig::default()
  439 |             .with_initial_rate(100.0)
  440 |             .with_decrease_factor(0.5)
  441 |             .with_window_duration(Duration::from_millis(100));
  442 |         let controller = AimdController::new(config).unwrap();
  443 | 
  444 |         let start = std::time::Instant::now();
  445 |         {
  446 |             let mut state = controller.state.lock().unwrap();
  447 |             controller.record_outcome_inner(&mut state, RequestOutcome::Throttled, start);
  448 |         }
  449 | 
  450 |         // Advance past window
  451 |         let after_window = start + Duration::from_millis(150);
  452 |         {
  453 |             let mut state = controller.state.lock().unwrap();
  454 |             controller.record_outcome_inner(&mut state, RequestOutcome::Success, after_window);
  455 |         }
  456 | 
  457 |         assert_eq!(controller.current_rate(), 50.0);
  458 |     }
  459 | 
  460 |     #[test]
  461 |     fn test_floor_enforcement() {
  462 |         let config = AimdConfig::default()
  463 |             .with_initial_rate(2.0)
  464 |             .with_min_rate(1.0)
  465 |             .with_decrease_factor(0.5)
  466 |             .with_window_duration(Duration::from_millis(100));
  467 |         let controller = AimdController::new(config).unwrap();
  468 | 
  469 |         let start = std::time::Instant::now();
  470 |         {
  471 |             let mut state = controller.state.lock().unwrap();
  472 |             controller.record_outcome_inner(&mut state, RequestOutcome::Throttled, start);
  473 |         }
  474 | 
  475 |         // After decrease: 2.0 * 0.5 = 1.0 (at floor)
  476 |         let t1 = start + Duration::from_millis(150);
  477 |         {
  478 |             let mut state = controller.state.lock().unwrap();
  479 |             controller.record_outcome_inner(&mut state, RequestOutcome::Throttled, t1);
  480 |         }
  481 |         assert_eq!(controller.current_rate(), 1.0);
  482 | 
  483 |         // Another decrease should stay at floor
  484 |         let t2 = t1 + Duration::from_millis(150);
  485 |         {
  486 |             let mut state = controller.state.lock().unwrap();
  487 |             controller.record_outcome_inner(&mut state, RequestOutcome::Success, t2);
  488 |         }
  489 |         assert_eq!(controller.current_rate(), 1.0);
  490 |     }
  491 | 
  492 |     #[test]
  493 |     fn test_ceiling_enforcement() {
  494 |         let config = AimdConfig::default()
  495 |             .with_initial_rate(4990.0)
  496 |             .with_max_rate(5000.0)
  497 |             .with_additive_increment(20.0)
  498 |             .with_window_duration(Duration::from_millis(100));
  499 |         let controller = AimdController::new(config).unwrap();
  500 | 
  501 |         let start = std::time::Instant::now();
  502 |         {
  503 |             let mut state = controller.state.lock().unwrap();
  504 |             controller.record_outcome_inner(&mut state, RequestOutcome::Success, start);
  505 |         }
  506 | 
  507 |         let t1 = start + Duration::from_millis(150);
  508 |         {
  509 |             let mut state = controller.state.lock().unwrap();
  510 |             controller.record_outcome_inner(&mut state, RequestOutcome::Success, t1);
  511 |         }
  512 |         // 4990 + 20 = 5010, clamped to 5000
  513 |         assert_eq!(controller.current_rate(), 5000.0);
  514 |     }
  515 | 
  516 |     #[test]
  517 |     fn test_no_ceiling_allows_unbounded_growth() {
  518 |         let config = AimdConfig::default()
  519 |             .with_initial_rate(100.0)
  520 |             .with_max_rate(0.0)
  521 |             .with_additive_increment(50.0)
  522 |             .with_window_duration(Duration::from_millis(100));
  523 |         let controller = AimdController::new(config).unwrap();
  524 | 
  525 |         let start = std::time::Instant::now();
  526 |         let mut t = start;
  527 | 
  528 |         for _ in 0..5 {
  529 |             {
  530 |                 let mut state = controller.state.lock().unwrap();
  531 |                 controller.record_outcome_inner(&mut state, RequestOutcome::Success, t);
  532 |             }
  533 |             t += Duration::from_millis(150);
  534 |         }
  535 | 
  536 |         // Trigger final window evaluation
  537 |         {
  538 |             let mut state = controller.state.lock().unwrap();
  539 |             controller.record_outcome_inner(&mut state, RequestOutcome::Success, t);
  540 |         }
  541 | 
  542 |         // 100 + 50*5 = 350
  543 |         assert_eq!(controller.current_rate(), 350.0);
  544 |     }
  545 | 
  546 |     #[test]
  547 |     fn test_empty_window_no_adjustment() {
  548 |         let config = AimdConfig::default()
  549 |             .with_initial_rate(100.0)
  550 |             .with_window_duration(Duration::from_millis(100));
  551 |         let controller = AimdController::new(config).unwrap();
  552 | 
  553 |         // Don't record anything in the first window, just advance time
  554 |         let start = std::time::Instant::now();
  555 |         let after = start + Duration::from_millis(150);
  556 |         {
  557 |             let mut state = controller.state.lock().unwrap();
  558 |             // First outcome in a new window after empty window
  559 |             controller.record_outcome_inner(&mut state, RequestOutcome::Success, after);
  560 |         }
  561 |         // No adjustment because the expired window had 0 total
  562 |         assert_eq!(controller.current_rate(), 100.0);
  563 |     }
  564 | 
  565 |     #[test]
  566 |     fn test_throttle_threshold_filtering() {
  567 |         // With threshold 0.5, less than 50% throttles should still increase
  568 |         let config = AimdConfig::default()
  569 |             .with_initial_rate(100.0)
  570 |             .with_throttle_threshold(0.5)
  571 |             .with_additive_increment(10.0)
  572 |             .with_window_duration(Duration::from_millis(100));
  573 |         let controller = AimdController::new(config).unwrap();
  574 | 
  575 |         let start = std::time::Instant::now();
  576 |         {
  577 |             let mut state = controller.state.lock().unwrap();
  578 |             // 1 throttle out of 3 = 33% < 50% threshold
  579 |             controller.record_outcome_inner(&mut state, RequestOutcome::Success, start);
  580 |             controller.record_outcome_inner(&mut state, RequestOutcome::Success, start);
  581 |             controller.record_outcome_inner(&mut state, RequestOutcome::Throttled, start);
  582 |         }
  583 | 
  584 |         // Advance past window
  585 |         let t1 = start + Duration::from_millis(150);
  586 |         {
  587 |             let mut state = controller.state.lock().unwrap();
  588 |             controller.record_outcome_inner(&mut state, RequestOutcome::Success, t1);
  589 |         }
  590 | 
  591 |         // Should have increased because 33% <= 50%
  592 |         assert_eq!(controller.current_rate(), 110.0);
  593 |     }
  594 | 
  595 |     #[test]
  596 |     fn test_throttle_threshold_triggers_decrease() {
  597 |         // With threshold 0.5, >= 50% throttles should decrease
  598 |         let config = AimdConfig::default()
  599 |             .with_initial_rate(100.0)
  600 |             .with_throttle_threshold(0.5)
  601 |             .with_decrease_factor(0.5)
  602 |             .with_window_duration(Duration::from_millis(100));
  603 |         let controller = AimdController::new(config).unwrap();
  604 | 
  605 |         let start = std::time::Instant::now();
  606 |         {
  607 |             let mut state = controller.state.lock().unwrap();
  608 |             // 2 throttle out of 3 = 67% > 50% threshold
  609 |             controller.record_outcome_inner(&mut state, RequestOutcome::Success, start);
  610 |             controller.record_outcome_inner(&mut state, RequestOutcome::Throttled, start);
  611 |             controller.record_outcome_inner(&mut state, RequestOutcome::Throttled, start);
  612 |         }
  613 | 
  614 |         let t1 = start + Duration::from_millis(150);
  615 |         {
  616 |             let mut state = controller.state.lock().unwrap();
  617 |             controller.record_outcome_inner(&mut state, RequestOutcome::Success, t1);
  618 |         }
  619 | 
  620 |         assert_eq!(controller.current_rate(), 50.0);
  621 |     }
  622 | 
  623 |     #[test]
  624 |     fn test_recovery_after_decrease() {
  625 |         let config = AimdConfig::default()
  626 |             .with_initial_rate(100.0)
  627 |             .with_decrease_factor(0.5)
  628 |             .with_additive_increment(10.0)
  629 |             .with_window_duration(Duration::from_millis(100));
  630 |         let controller = AimdController::new(config).unwrap();
  631 | 
  632 |         let start = std::time::Instant::now();
  633 | 
  634 |         // Window 1: throttle → decrease to 50
  635 |         {
  636 |             let mut state = controller.state.lock().unwrap();
  637 |             controller.record_outcome_inner(&mut state, RequestOutcome::Throttled, start);
  638 |         }
  639 |         let t1 = start + Duration::from_millis(150);
  640 | 
  641 |         // Window 2: success → increase to 60
  642 |         {
  643 |             let mut state = controller.state.lock().unwrap();
  644 |             controller.record_outcome_inner(&mut state, RequestOutcome::Success, t1);
  645 |         }
  646 |         let t2 = t1 + Duration::from_millis(150);
  647 | 
  648 |         // Window 3: success → increase to 70
  649 |         {
  650 |             let mut state = controller.state.lock().unwrap();
  651 |             controller.record_outcome_inner(&mut state, RequestOutcome::Success, t2);
  652 |         }
  653 |         let t3 = t2 + Duration::from_millis(150);
  654 | 
  655 |         // Trigger final evaluation
  656 |         {
  657 |             let mut state = controller.state.lock().unwrap();
  658 |             controller.record_outcome_inner(&mut state, RequestOutcome::Success, t3);
  659 |         }
  660 | 
  661 |         assert_eq!(controller.current_rate(), 70.0);
  662 |     }
  663 | 
  664 |     #[test]
  665 |     fn test_within_window_no_adjustment() {
  666 |         let config = AimdConfig::default()
  667 |             .with_initial_rate(100.0)
  668 |             .with_window_duration(Duration::from_secs(10));
  669 |         let controller = AimdController::new(config).unwrap();
  670 | 
  671 |         // Record many outcomes but all within the same window
  672 |         for _ in 0..100 {
  673 |             controller.record_outcome(RequestOutcome::Throttled);
  674 |         }
  675 | 
  676 |         // Rate should still be initial since window hasn't expired
  677 |         assert_eq!(controller.current_rate(), 100.0);
  678 |     }
  679 | }
``````
