> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-core/src/utils/backoff.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `9752f14a7e631b59b12651a9303a7364252e428e37e4f6c070a6fc55fc4fdb31`. Reviewed physical lines: 1-291.

[Module](../../../../../L1-modules/rust-lance-core-storage.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public configurable exponential-with-jitter and slotted retry-delay generators; they return Durations but do not perform sleeps or retry work. (rust/lance-core/src/utils/backoff.rs:1-291)

## Complete range analysis

### Lines 1-24

Imports rand::{Rng,SeedableRng} and Duration precede SPDX lines. Documentation describes base^attempt*unit plus jitter, with defaults base two, unit 50ms, symmetric jitter 50ms, min zero/max 5000ms and attempt zero. Public Backoff keeps private u32 base/unit/min/max/attempt and i32 jitter. A base of one gives a constant unjittered term; the comment calls this linear backoff. (rust/lance-core/src/utils/backoff.rs:1-24)

### Lines 25-38

Default materializes base=2, unit=50, jitter=50, min=0, max=5000, attempt=0. There is no external state, environment read or caller-selected RNG in Backoff. (rust/lance-core/src/utils/backoff.rs:25-38)

### Lines 39-58

Five consuming setters with_base/with_unit/with_jitter/with_min/with_max replace only the named field through struct update. They do not validate their values or mutual min/max consistency and do not reset attempt. Zero bases/units and negative jitter values are accepted at construction. (rust/lance-core/src/utils/backoff.rs:39-58)

### Lines 59-78

next_backoff saturates base.pow(attempt) and its u32 multiplication by unit, samples inclusive signed jitter -jitter..=jitter from rand::rng(), saturating-adds the signed result, clamps to [min,max], increments attempt with ordinary +=1, and returns milliseconds as Duration. min>max can panic in clamp; negative jitter yields an invalid range (and negating i32::MIN may overflow under checked arithmetic). attempt overflow is not saturated. The min/max bound is applied after jitter, not before. attempt returns the counter; reset sets it to zero and preserves settings. (rust/lance-core/src/utils/backoff.rs:59-78)

### Lines 79-87

Private MAX_SLOTS=128 bounds the slotted scheme. Comments justify that cap as enough for roughly 100 concurrent tasks while preventing unbounded waits at high attempts. This is a design rationale, not a measured fairness/latency guarantee. (rust/lance-core/src/utils/backoff.rs:79-87)

### Lines 88-126

SlotBackoff documentation models tasks with similar service time and random collision slots; the ten-task narrative is illustrative. The public struct stores private base, unit, starting_i, attempt (u32) and SmallRng. Discrete slot selection differs from Backoff additive jitter. (rust/lance-core/src/utils/backoff.rs:88-126)

### Lines 127-138

Default uses base=2, unit=50, starting_i=2, attempt=0 and SmallRng::from_os_rng(). It selects an OS-seeded private generator; it does not expose deterministic seed selection in the public API. (rust/lance-core/src/utils/backoff.rs:127-138)

### Lines 139-160

with_unit consumes/replaces only the unit; attempt reads the counter. next_backoff computes min(base.saturating_pow(attempt.saturating_add(starting_i)),128), samples slot in 0..num_slots, saturating-increments attempt, then multiplies slot and unit after widening both to u64. Default slot counts are 4,8,16,32,64,128 and then 128; zero delay is allowed and max is 127*unit milliseconds. Widening avoids u32 multiplication overflow even for unit=u32::MAX. There is no public reset or base/starting_i setter here. (rust/lance-core/src/utils/backoff.rs:139-160)

### Lines 161-178

The cfg(test) module imports Backoff/SlotBackoff/Duration. test_backoff disables jitter and checks 50,100,200,400ms and attempt counters one through four. This tests deterministic growth, not jitter distribution. (rust/lance-core/src/utils/backoff.rs:161-178)

### Lines 179-194

test_backoff_with_base sets base three/no jitter and expects 50,150,450ms. test_backoff_with_unit sets 100/no jitter and expects 100,200ms. Other settings retain defaults. (rust/lance-core/src/utils/backoff.rs:179-194)

### Lines 195-215

test_backoff_with_min raises minimum to 100 and expects the first result 100ms. test_backoff_with_max sets maximum 75/no jitter and expects 50 then 75. test_backoff_reset gets 50/counter one, resets to zero, then gets 50 again. These cover valid clamping/reset, not invalid min/max or negative jitter. (rust/lance-core/src/utils/backoff.rs:195-215)

### Lines 216-244

test_slot_backoff defines coverage-excluded assert_in, repeats ten independent generators with unit 100, and asserts each of the first three values is in the allowed 4/8/16-slot set while attempt advances 1/2/3. Membership checks do not establish uniform distribution or fairness among concurrent clients. (rust/lance-core/src/utils/backoff.rs:216-244)

### Lines 245-257

test_slot_backoff_high_attempt_is_bounded uses unit 100000 for forty draws, each <=127*unit, and then asserts attempt forty. The repeated draws cover growth beyond the slot cap. (rust/lance-core/src/utils/backoff.rs:245-257)

### Lines 258-278

test_slot_backoff_large_unit_does_not_overflow sets unit=u32::MAX and a seeded private SmallRng(0), draws 64 times, requires durations to be exact multiples of unit, and requires at least one slot >=2. The deterministic seed and final condition ensure the regression exercises a product that would overflow u32. (rust/lance-core/src/utils/backoff.rs:258-278)

### Lines 279-291

test_slot_backoff_attempt_saturates builds with attempt=u32::MAX using default other fields, calls next_backoff, and requires counter remains max. No equivalent saturation guarantee exists for Backoff. All tests were inspected, not executed; delay consumers/retry termination are outside this file. (rust/lance-core/src/utils/backoff.rs:279-291)

## Interaction and interpretation limits

Backoff and SlotBackoff return candidate wait durations; caller retry budgets, sleep mechanisms, cancellation and transaction conflict policies remain pending. Invalid Backoff configurations are accepted by builders and fail only in arithmetic/RNG/clamp use. (rust/lance-core/src/utils/backoff.rs:39-78; rust/lance-core/src/utils/backoff.rs:139-160)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | use rand::{Rng, SeedableRng};
    2 | use std::time::Duration;
    3 | 
    4 | // SPDX-License-Identifier: Apache-2.0
    5 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    6 | 
    7 | /// Computes backoff as
    8 | ///
    9 | /// ```text
   10 | /// backoff = base^attempt * unit + jitter
   11 | /// ```
   12 | ///
   13 | /// The defaults are base=2, unit=50ms, jitter=50ms, min=0ms, max=5s. This gives
   14 | /// a backoff of 50ms, 100ms, 200ms, 400ms, 800ms, 1.6s, 3.2s, 5s, (not including jitter).
   15 | ///
   16 | /// You can have non-exponential backoff by setting base=1.
   17 | pub struct Backoff {
   18 |     base: u32,
   19 |     unit: u32,
   20 |     jitter: i32,
   21 |     min: u32,
   22 |     max: u32,
   23 |     attempt: u32,
   24 | }
   25 | 
   26 | impl Default for Backoff {
   27 |     fn default() -> Self {
   28 |         Self {
   29 |             base: 2,
   30 |             unit: 50,
   31 |             jitter: 50,
   32 |             min: 0,
   33 |             max: 5000,
   34 |             attempt: 0,
   35 |         }
   36 |     }
   37 | }
   38 | 
   39 | impl Backoff {
   40 |     pub fn with_base(self, base: u32) -> Self {
   41 |         Self { base, ..self }
   42 |     }
   43 | 
   44 |     pub fn with_unit(self, unit: u32) -> Self {
   45 |         Self { unit, ..self }
   46 |     }
   47 | 
   48 |     pub fn with_jitter(self, jitter: i32) -> Self {
   49 |         Self { jitter, ..self }
   50 |     }
   51 | 
   52 |     pub fn with_min(self, min: u32) -> Self {
   53 |         Self { min, ..self }
   54 |     }
   55 | 
   56 |     pub fn with_max(self, max: u32) -> Self {
   57 |         Self { max, ..self }
   58 |     }
   59 | 
   60 |     pub fn next_backoff(&mut self) -> Duration {
   61 |         let backoff = self
   62 |             .base
   63 |             .saturating_pow(self.attempt)
   64 |             .saturating_mul(self.unit);
   65 |         let jitter = rand::rng().random_range(-self.jitter..=self.jitter);
   66 |         let backoff = (backoff.saturating_add_signed(jitter)).clamp(self.min, self.max);
   67 |         self.attempt += 1;
   68 |         Duration::from_millis(backoff as u64)
   69 |     }
   70 | 
   71 |     pub fn attempt(&self) -> u32 {
   72 |         self.attempt
   73 |     }
   74 | 
   75 |     pub fn reset(&mut self) {
   76 |         self.attempt = 0;
   77 |     }
   78 | }
   79 | 
   80 | /// Upper bound on the number of retry slots.
   81 | ///
   82 | /// Slots double each attempt to spread contending writers apart, but a hundred
   83 | /// or so already exceeds any realistic number of concurrent committers, so
   84 | /// further doubling only inflates the wait without reducing collisions. Capping
   85 | /// the count also bounds a single backoff to `(MAX_SLOTS - 1) * unit` instead of
   86 | /// letting it grow without limit as `attempt` climbs.
   87 | const MAX_SLOTS: u32 = 128;
   88 | 
   89 | /// SlotBackoff is a backoff strategy that randomly chooses a time slot to retry.
   90 | ///
   91 | /// This is useful when you have multiple tasks that can't overlap, and each
   92 | /// task takes roughly the same amount of time.
   93 | ///
   94 | /// The `unit` represents the time it takes to complete one attempt. Future attempts
   95 | /// are divided into time slots, and a random slot is chosen for the retry. The number
   96 | /// of slots increases exponentially with each attempt. Initially, there are 4 slots,
   97 | /// then 8, then 16, and so on, up to a fixed cap.
   98 | ///
   99 | /// Example:
  100 | /// Suppose you have 10 tasks that can't overlap, each taking 1 second. The tasks
  101 | /// don't know about each other and can't coordinate. Each task randomly picks a
  102 | /// time slot to retry. Here's how it might look:
  103 | ///
  104 | /// First round (4 slots):
  105 | /// ```text
  106 | /// task id   | 1, 2, 3 | 4, 5, 6 | 7, 8, 9 | 10 |
  107 | /// status    | x, x, ✓ | x, x, ✓ | x, x, ✓ | ✓  |
  108 | /// timeline  | 0s      | 1s      | 2s      | 3s |
  109 | /// ```
  110 | /// Each slot can have one success. Here, tasks 3, 6, 9, and 10 succeed.
  111 | /// In the next round, the number of slots doubles (8):
  112 | ///
  113 | /// Second round (8 slots):
  114 | /// ```text
  115 | /// task id   |  1 |  2 |    | 4, 5 |  7 |  8 |    |    |
  116 | /// status    |  ✓ |  ✓ |    | x, ✓ |  ✓ |  ✓ |    |    |
  117 | /// timeline  | 0s | 1s | 2s | 3s   | 4s | 5s | 6s | 7s |
  118 | /// ```
  119 | /// Most tasks are done now, except for task 4. It will succeed in the next round.
  120 | pub struct SlotBackoff {
  121 |     base: u32,
  122 |     unit: u32,
  123 |     starting_i: u32,
  124 |     attempt: u32,
  125 |     rng: rand::rngs::SmallRng,
  126 | }
  127 | 
  128 | impl Default for SlotBackoff {
  129 |     fn default() -> Self {
  130 |         Self {
  131 |             base: 2,
  132 |             unit: 50,
  133 |             starting_i: 2, // start with 4 slots
  134 |             attempt: 0,
  135 |             rng: rand::rngs::SmallRng::from_os_rng(),
  136 |         }
  137 |     }
  138 | }
  139 | 
  140 | impl SlotBackoff {
  141 |     pub fn with_unit(self, unit: u32) -> Self {
  142 |         Self { unit, ..self }
  143 |     }
  144 | 
  145 |     pub fn attempt(&self) -> u32 {
  146 |         self.attempt
  147 |     }
  148 | 
  149 |     pub fn next_backoff(&mut self) -> Duration {
  150 |         let num_slots = self
  151 |             .base
  152 |             .saturating_pow(self.attempt.saturating_add(self.starting_i))
  153 |             .min(MAX_SLOTS);
  154 |         let slot_i = self.rng.random_range(0..num_slots);
  155 |         self.attempt = self.attempt.saturating_add(1);
  156 |         // Widen before multiplying: `unit` is the first-attempt latency, which
  157 |         // can be large enough that a `u32` slot * unit product would overflow.
  158 |         Duration::from_millis(slot_i as u64 * self.unit as u64)
  159 |     }
  160 | }
  161 | 
  162 | #[cfg(test)]
  163 | mod tests {
  164 |     use super::*;
  165 | 
  166 |     #[test]
  167 |     fn test_backoff() {
  168 |         let mut backoff = Backoff::default().with_jitter(0);
  169 |         assert_eq!(backoff.next_backoff().as_millis(), 50);
  170 |         assert_eq!(backoff.attempt(), 1);
  171 |         assert_eq!(backoff.next_backoff().as_millis(), 100);
  172 |         assert_eq!(backoff.attempt(), 2);
  173 |         assert_eq!(backoff.next_backoff().as_millis(), 200);
  174 |         assert_eq!(backoff.attempt(), 3);
  175 |         assert_eq!(backoff.next_backoff().as_millis(), 400);
  176 |         assert_eq!(backoff.attempt(), 4);
  177 |     }
  178 | 
  179 |     #[test]
  180 |     fn test_backoff_with_base() {
  181 |         let mut backoff = Backoff::default().with_base(3).with_jitter(0);
  182 |         assert_eq!(backoff.next_backoff().as_millis(), 50); // 3^0 * 50
  183 |         assert_eq!(backoff.next_backoff().as_millis(), 150); // 3^1 * 50
  184 |         assert_eq!(backoff.next_backoff().as_millis(), 450); // 3^2 * 50
  185 |     }
  186 | 
  187 |     #[test]
  188 |     fn test_backoff_with_unit() {
  189 |         let mut backoff = Backoff::default().with_unit(100).with_jitter(0);
  190 |         assert_eq!(backoff.next_backoff().as_millis(), 100); // 2^0 * 100
  191 |         assert_eq!(backoff.next_backoff().as_millis(), 200); // 2^1 * 100
  192 |     }
  193 | 
  194 |     #[test]
  195 |     fn test_backoff_with_min() {
  196 |         let mut backoff = Backoff::default().with_min(100).with_jitter(0);
  197 |         assert_eq!(backoff.next_backoff().as_millis(), 100); // clamped to min
  198 |     }
  199 | 
  200 |     #[test]
  201 |     fn test_backoff_with_max() {
  202 |         let mut backoff = Backoff::default().with_max(75).with_jitter(0);
  203 |         assert_eq!(backoff.next_backoff().as_millis(), 50);
  204 |         assert_eq!(backoff.next_backoff().as_millis(), 75); // clamped to max
  205 |     }
  206 | 
  207 |     #[test]
  208 |     fn test_backoff_reset() {
  209 |         let mut backoff = Backoff::default().with_jitter(0);
  210 |         assert_eq!(backoff.next_backoff().as_millis(), 50);
  211 |         assert_eq!(backoff.attempt(), 1);
  212 |         backoff.reset();
  213 |         assert_eq!(backoff.attempt(), 0);
  214 |         assert_eq!(backoff.next_backoff().as_millis(), 50);
  215 |     }
  216 | 
  217 |     #[test]
  218 |     fn test_slot_backoff() {
  219 |         #[cfg_attr(coverage, coverage(off))]
  220 |         fn assert_in(value: u128, expected: &[u128]) {
  221 |             assert!(
  222 |                 expected.contains(&value),
  223 |                 "value {} not in {:?}",
  224 |                 value,
  225 |                 expected
  226 |             );
  227 |         }
  228 | 
  229 |         for _ in 0..10 {
  230 |             let mut backoff = SlotBackoff::default().with_unit(100);
  231 |             assert_in(backoff.next_backoff().as_millis(), &[0, 100, 200, 300]);
  232 |             assert_eq!(backoff.attempt(), 1);
  233 |             assert_in(
  234 |                 backoff.next_backoff().as_millis(),
  235 |                 &[0, 100, 200, 300, 400, 500, 600, 700],
  236 |             );
  237 |             assert_eq!(backoff.attempt(), 2);
  238 |             assert_in(
  239 |                 backoff.next_backoff().as_millis(),
  240 |                 &(0..16).map(|i| i * 100).collect::<Vec<_>>(),
  241 |             );
  242 |             assert_eq!(backoff.attempt(), 3);
  243 |         }
  244 |     }
  245 | 
  246 |     #[test]
  247 |     fn test_slot_backoff_high_attempt_is_bounded() {
  248 |         // Without the slot cap the wait grows unbounded with `attempt`. The cap
  249 |         // holds every backoff to `(MAX_SLOTS - 1) * unit`.
  250 |         let unit = 100_000; // 100s first attempt
  251 |         let mut backoff = SlotBackoff::default().with_unit(unit);
  252 |         let max_backoff = Duration::from_millis((MAX_SLOTS - 1) as u64 * unit as u64);
  253 |         for _ in 0..40 {
  254 |             assert!(backoff.next_backoff() <= max_backoff);
  255 |         }
  256 |         assert_eq!(backoff.attempt(), 40);
  257 |     }
  258 | 
  259 |     #[test]
  260 |     fn test_slot_backoff_large_unit_does_not_overflow() {
  261 |         // With unit = u32::MAX, any slot >= 2 makes the old u32 `slot_i * unit`
  262 |         // product overflow: a debug panic, or in release a wrap to a value that
  263 |         // is no longer a multiple of unit. The u64 widening keeps every backoff
  264 |         // an exact multiple of unit. Seed the RNG so the drawn slots — and thus
  265 |         // this check — are deterministic rather than dependent on random draws.
  266 |         let unit = u32::MAX;
  267 |         let mut backoff = SlotBackoff::default().with_unit(unit);
  268 |         backoff.rng = rand::rngs::SmallRng::seed_from_u64(0);
  269 |         let mut saw_high_slot = false;
  270 |         for _ in 0..64 {
  271 |             let backoff_ms = backoff.next_backoff().as_millis();
  272 |             // `slot_i * unit` is always a multiple of unit; a wrapped u32
  273 |             // product is not.
  274 |             assert_eq!(backoff_ms % unit as u128, 0, "{backoff_ms} wrapped");
  275 |             saw_high_slot |= backoff_ms >= 2 * unit as u128;
  276 |         }
  277 |         assert!(saw_high_slot, "expected a slot >= 2 in 64 seeded draws");
  278 |     }
  279 | 
  280 |     #[test]
  281 |     fn test_slot_backoff_attempt_saturates() {
  282 |         // At u32::MAX the counter must stay put rather than panic (debug) or
  283 |         // wrap to 0 (release), which would restart the low-slot distribution.
  284 |         let mut backoff = SlotBackoff {
  285 |             attempt: u32::MAX,
  286 |             ..Default::default()
  287 |         };
  288 |         let _ = backoff.next_backoff();
  289 |         assert_eq!(backoff.attempt(), u32::MAX);
  290 |     }
  291 | }
``````
