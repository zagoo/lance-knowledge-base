> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-core/src/utils/futures.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `64277804f71e979183f32604c78f43d5fcbbaf7f0a4031bd213856591c1bf39f`. Reviewed physical lines: 1-701.

[Module](../../../../../L1-modules/rust-lance-core.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Two-consumer stream replay with bounded/unbounded buffering and drop recovery, plus distinct end-of-stream and destruction callback wrappers. Private synchronized state coordinates only the two returned sides, not an arbitrary subscriber set. (rust/lance-core/src/utils/futures.rs:1-701)

## Complete range analysis

### Lines 1-14

SPDX/imports provide VecDeque replay storage, Arc/Mutex, task Waker/Poll, futures Stream/BoxStream/StreamExt, pin_project/PinnedDrop, Tokio Semaphore and PollSemaphore. Mutex synchronization is synchronous; underlying stream polling is explicitly moved outside the lock below. (rust/lance-core/src/utils/futures.rs:1-14)

### Lines 15-27

Private Side is Left/Right and derives Clone/Copy/Debug/PartialEq. Public Capacity has Bounded(u32) and Unbounded variants with the same derives. Bounded capacity counts outstanding cloned items for the lagging consumer, not total bytes or upstream prefetch. (rust/lance-core/src/utils/futures.rs:15-27)

### Lines 28-46

Private InnerState<'a,T> stores optional boxed upstream, one VecDeque<T>, polling-side ownership, one waiting Waker, an exhausted flag, two u32 buffered counters, two dropped flags and optional PollSemaphore. Public SharedStream<'a,T:Clone> contains a private Arc<Mutex<InnerState>> and Side. Either side can lead; only the lagging side should own buffered items, an invariant asserted during Drop. No Clone implementation for SharedStream itself is declared. (rust/lance-core/src/utils/futures.rs:28-46)

### Lines 47-80

Public SharedStream::new(inner:BoxStream<'a,T>,capacity:Capacity)->(Self,Self) creates optional Semaphore with capacity as usize, empty counters/queue, no poller/waker, non-exhausted state and two live side flags; both returned handles share one Arc. There is no validation of Bounded(0). Zero capacity prevents acquiring the first permit and therefore prevents polling upstream, even after the peer is dropped because acquisition still precedes the peer-liveness check. (rust/lance-core/src/utils/futures.rs:47-80)

### Lines 81-99

Drop locks state but returns without cleanup if the mutex is poisoned. It marks its side dropped, takes its own buffered counter to zero and leaves the peer's pending items intact. The comments identify the deadlock risk when a dropped lagging consumer retains all permits. (rust/lance-core/src/utils/futures.rs:81-99)

### Lines 100-112

Drop debug-asserts that its unread count is zero or equals the whole queue length, pops those unread clones, and adds one permit per removed element when bounded. Values are removed/dropped while the mutex guard is held. The invariant depends on the single shared queue belonging only to the lagging side; changing to multiple consumers requires a new representation. (rust/lance-core/src/utils/futures.rs:100-112)

### Lines 113-126

If the dropped side owns polling, Drop clears polling ownership and takes the waiting peer waker. It releases the mutex before wake(), permitting callbacks that immediately repoll. When no explicit polling owner is relinquished, semaphore permit release may wake a capacity waiter through its own registration. Upstream is not explicitly polled or cancelled by this Drop path. (rust/lance-core/src/utils/futures.rs:113-126)

### Lines 127-154

Stream<Item=T>::poll_next locks with unwrap (poison panics). If its side has buffered items, it decrements that side's counter, pops the oldest element, releases one bounded permit, and returns Ready(item). This fast path drains already-buffered items before consulting exhausted, preserving replay after upstream EOF. A counter/queue inconsistency could yield Ready(None), so the private invariant is semantically significant. (rust/lance-core/src/utils/futures.rs:127-154)

### Lines 155-170

An exhausted stream returns Ready(None) repeatedly once its own buffer is empty. Otherwise bounded mode polls for one permit before claiming upstream ownership. Pending capacity returns Pending immediately; an acquired None is unwrapped because the private semaphore is never intentionally closed here. Unbounded mode carries no permit. Buffer-first control flow is at rust/lance-core/src/utils/futures.rs:127-157. (rust/lance-core/src/utils/futures.rs:155-170)

### Lines 171-183

If the other side already owns polling, replace the single waiting waker with this context's clone and return Pending. Any temporarily acquired permit is released by its normal drop. Only two handles exist, so one parked peer waker suffices; adding independently cloneable handles would invalidate that assumption. Two-handle construction and permit acquisition are at rust/lance-core/src/utils/futures.rs:47-80 and rust/lance-core/src/utils/futures.rs:159-170. (rust/lance-core/src/utils/futures.rs:171-183)

### Lines 184-195

The selected side records itself as polling, takes the boxed upstream from Option (expect explains a previous panic can lose it), releases the lock, polls upstream, then reacquires state. This avoids holding the mutex across arbitrary upstream polling and prevents simultaneous poll_next calls. On an upstream panic, restoration below is skipped; no unwind guard repairs inner/polling state. (rust/lance-core/src/utils/futures.rs:184-195)

### Lines 196-224

Ready(None) marks exhausted and clears polling. Ready(Some(item)) also clears polling, then checks whether the opposite side is alive: if alive, forget the acquired permit, increment the peer's u32 counter and enqueue item.clone(); if dropped, skip clone/counter/queue and let the permit release normally. The original item goes directly to the polling side. A clone panic happens while holding the state mutex after permit/counter updates, so poisoning/recovery is not handled here. Unbounded queued counts still use u32, so capacity-independent integer overflow is possible at extreme backlog; no runtime reproduction is claimed. Lock reacquisition before the match and returning the original poll result are at rust/lance-core/src/utils/futures.rs:184-195 and rust/lance-core/src/utils/futures.rs:225-246. (rust/lance-core/src/utils/futures.rs:196-224)

### Lines 225-247

Pending retains polling ownership and suppresses explicit peer wake. In every ordinary result path upstream is restored into state. A ready result takes the waiting waker, releases the mutex and wakes it, then returns the original Poll. A pending poll relies on upstream waking the owning task; if that handle is later dropped, its Drop hands ownership to the survivor. Stream cancellation behavior depends on dropping the handle as well as dropping a temporary next() future. Handle-drop ownership transfer is at rust/lance-core/src/utils/futures.rs:82-125. (rust/lance-core/src/utils/futures.rs:225-247)

### Lines 248-276

Public SharedStreamExt<'a>:Stream+Send where Self::Item:Clone declares share(self,Capacity)->(SharedStream<'a,Self::Item>,SharedStream<'a,Self::Item>). The only implementation here is for BoxStream<'a,T>, forwarding to new. Docs require bounded consumers to advance together or deadlock; unbounded sharing permits independent draining by retaining the entire backlog. The new API accepts exactly a boxed Send stream, not every bare Stream type. (rust/lance-core/src/utils/futures.rs:248-276)

### Lines 277-289

Public pin_project FinallyStream<S:Stream,F:FnOnce()> privately owns pinned stream and Option<F>. new(stream:S,f:F)->Self stores callback Some(f). There is no requirement that callback be Send or return Result, and no Drop callback implementation here. (rust/lance-core/src/utils/futures.rs:277-289)

### Lines 290-308

FinallyStream's Stream<Item=S::Item>::poll_next projects the pinned upstream, forwards the poll, and takes/invokes callback only on Ready(None). Callback executes synchronously at first observed EOF, at most once even on repeated EOF. Pending and Some(Err(...)) do not count as EOF. Early wrapper drop simply destroys the closure without calling it. Callback panics are not caught. (rust/lance-core/src/utils/futures.rs:290-308)

### Lines 309-323

Public FinallyStreamExt<S:Stream>:Stream+Sized exposes finally<F:FnOnce()>(self,f:F)->FinallyStream<Self,F>. Its default body directly constructs the wrapper fields; the blanket impl for S instead forwards through FinallyStream::new. The generic S is the underlying stream type; this is an extension method over owned self, not a callback registration on a borrowed stream. (rust/lance-core/src/utils/futures.rs:309-323)

### Lines 324-341

Docs explicitly contrast on-drop behavior with finally. Public #[pin_project(PinnedDrop)] OnDropStream<S:Stream,F:FnOnce()> stores pinned stream and Option<F>; new stores Some(f). The constructor performs no poll and does not execute the callback. (rust/lance-core/src/utils/futures.rs:324-341)

### Lines 342-362

OnDropStream's poll_next only forwards to the pinned stream and does not trigger cleanup at EOF. Its private PinnedDrop implementation takes f and invokes it when the wrapper is destroyed, including early drop and never-polled instances. The Option ensures single invocation; no panic catch or async cleanup exists. Calling user closure during drop can propagate a panic, with ordinary Rust unwind limitations. (rust/lance-core/src/utils/futures.rs:342-362)

### Lines 363-371

Public StreamOnDropExt:Stream+Sized defines on_drop<F:FnOnce()>(self,f:F)->OnDropStream<Self,F>; a blanket impl covers all S:Stream. Pin-project handles projection/destruction mechanics; no explicit unsafe block exists in this file, and the macro expansion is dependency behavior rather than analyzed local source. Local pin projection and pinned destruction definitions: rust/lance-core/src/utils/futures.rs:329-361. (rust/lance-core/src/utils/futures.rs:363-371)

### Lines 372-388

Private test module imports atomic booleans, Arc, Context/Poll, Duration, future polling/stream helpers, channel ReceiverStream and ArcWake. is_pending polls a mutable Unpin future once with a noop waker and returns whether Pending; this helper alone cannot prove a real executor will be awakened. (rust/lance-core/src/utils/futures.rs:372-388)

### Lines 389-441

test_shared_stream preloads channel items 0..3, shares bounded capacity 2, advances left until backpressure, consumes from right to release permits, and checks replay ordering, shared pending state, later item 3 and repeated EOF after sender drop. It verifies asymmetric consumer advancement and self-fusing exhausted behavior with a small fixture. Tests were not run. (rust/lance-core/src/utils/futures.rs:389-441)

### Lines 442-454

test_shared_stream_replaces_waiting_waker uses permanently pending upstream and polls left once/right twice. It asserts Pending, but does not assert waker identity or firing. Its name alone is not stronger coverage evidence than those assertions. (rust/lance-core/src/utils/futures.rs:442-454)

### Lines 455-480

test_unbounded_shared_stream preloads ten items, closes sender, drains left fully and then right fully, checking each item and EOF. It demonstrates independent draining with retained clones; it is not a memory-usage benchmark. (rust/lance-core/src/utils/futures.rs:455-480)

### Lines 481-512

stress_shared_stream repeats 100 times with bounded capacity 2, two spawned consumers and 1000 sent integers. Each consumer asserts consecutive values as received and the test joins both. It does not separately assert the final counters equal 1000, so an early EOF could evade the per-item order check; actual timeout/duration and robustness were not measured. (rust/lance-core/src/utils/futures.rs:481-512)

### Lines 513-529

test_on_drop_fires_on_early_drop checks callback remains false after consuming one item, then becomes true on dropping wrapper. The callback state is an atomic bool, testing destruction rather than upstream EOF. (rust/lance-core/src/utils/futures.rs:513-529)

### Lines 530-546

test_on_drop_fires_after_exhaustion consumes an item and observes None while callback remains false; explicit drop then sets it true. This pins the semantic distinction from FinallyStream. (rust/lance-core/src/utils/futures.rs:530-546)

### Lines 547-561

test_on_drop_fires_without_polling creates the wrapper, asserts false and drops it without any poll, then asserts true. Together the three tests cover normal/early/unpolled destruction but not callback panic behavior. (rust/lance-core/src/utils/futures.rs:547-561)

### Lines 562-600

test_shared_stream_survivor_progresses_after_drop fills a six-item channel, leads with right until bounded capacity 2 is exhausted, confirms Pending, drops lagging left, and requires survivor item 2 within five seconds before checking remaining 3..5. This targets releasing dead-side queued permits. Sender remains alive, so the test does not wait for EOF. (rust/lance-core/src/utils/futures.rs:562-600)

### Lines 601-621

test_shared_stream_dropped_poller_releases_inner_stream makes left own a Pending upstream poll, drops its next future then left handle, sends 42 and requires right to receive it within five seconds. Dropping only the next future is distinct from releasing stream ownership through handle Drop. (rust/lance-core/src/utils/futures.rs:601-621)

### Lines 622-629

Private FlagWaker wraps AtomicBool and implements ArcWake::wake_by_ref by setting true with SeqCst. This observes a wake rather than merely checking Pending. (rust/lance-core/src/utils/futures.rs:622-629)

### Lines 630-664

test_shared_stream_dropped_poller_wakes_parked_survivor parks left, registers right using FlagWaker, confirms no initial wake, drops left, asserts the flag, sends 42 and checks right progresses with timeout. It targets explicit ownership-transfer wake after mutex release. (rust/lance-core/src/utils/futures.rs:630-664)

### Lines 665-701

test_shared_stream_unbounded_stops_buffering_for_dropped_side leads right by two items, checks queue length 2, drops left, verifies queue cleared, consumes remaining values with timeouts, and asserts empty queue and zero left counter. It inspects private state to catch retained dead-consumer clones. The file contains no FinallyStream-specific unit test and no Bounded(0), upstream-panic, clone-panic or counter-overflow regression test. (rust/lance-core/src/utils/futures.rs:665-701)

## Interaction and interpretation limits

SharedStream local transitions and dependency call boundaries are fully described, but repository-wide share/finally/on_drop consumers remain pending. Backpressure is item-count based and clone cost may dominate memory, while lock poisoning/initialization panics are not recovered (rust/lance-core/src/utils/futures.rs:47-247). No concurrency stress run, macro expansion or Tokio dependency-source analysis has been performed.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::{
    5 |     collections::VecDeque,
    6 |     sync::{Arc, Mutex},
    7 |     task::Waker,
    8 | };
    9 | 
   10 | use futures::{Stream, StreamExt, stream::BoxStream};
   11 | use pin_project::{pin_project, pinned_drop};
   12 | use tokio::sync::Semaphore;
   13 | use tokio_util::sync::PollSemaphore;
   14 | 
   15 | #[derive(Clone, Copy, Debug, PartialEq)]
   16 | enum Side {
   17 |     Left,
   18 |     Right,
   19 | }
   20 | 
   21 | /// A potentially unbounded capacity
   22 | #[derive(Clone, Copy, Debug, PartialEq)]
   23 | pub enum Capacity {
   24 |     Bounded(u32),
   25 |     Unbounded,
   26 | }
   27 | 
   28 | struct InnerState<'a, T> {
   29 |     inner: Option<BoxStream<'a, T>>,
   30 |     buffer: VecDeque<T>,
   31 |     polling: Option<Side>,
   32 |     waker: Option<Waker>,
   33 |     exhausted: bool,
   34 |     left_buffered: u32,
   35 |     right_buffered: u32,
   36 |     left_dropped: bool,
   37 |     right_dropped: bool,
   38 |     available_buffer: Option<PollSemaphore>,
   39 | }
   40 | 
   41 | /// A stream that can be shared between two consumers.
   42 | pub struct SharedStream<'a, T: Clone> {
   43 |     state: Arc<Mutex<InnerState<'a, T>>>,
   44 |     side: Side,
   45 | }
   46 | 
   47 | impl<'a, T: Clone> SharedStream<'a, T> {
   48 |     pub fn new(inner: BoxStream<'a, T>, capacity: Capacity) -> (Self, Self) {
   49 |         let available_buffer = match capacity {
   50 |             Capacity::Unbounded => None,
   51 |             Capacity::Bounded(capacity) => Some(PollSemaphore::new(Arc::new(Semaphore::new(
   52 |                 capacity as usize,
   53 |             )))),
   54 |         };
   55 |         let state = InnerState {
   56 |             inner: Some(inner),
   57 |             buffer: VecDeque::new(),
   58 |             polling: None,
   59 |             waker: None,
   60 |             exhausted: false,
   61 |             left_buffered: 0,
   62 |             right_buffered: 0,
   63 |             left_dropped: false,
   64 |             right_dropped: false,
   65 |             available_buffer,
   66 |         };
   67 | 
   68 |         let state = Arc::new(Mutex::new(state));
   69 | 
   70 |         let left = Self {
   71 |             state: state.clone(),
   72 |             side: Side::Left,
   73 |         };
   74 |         let right = Self {
   75 |             state,
   76 |             side: Side::Right,
   77 |         };
   78 |         (left, right)
   79 |     }
   80 | }
   81 | 
   82 | impl<T: Clone> Drop for SharedStream<'_, T> {
   83 |     fn drop(&mut self) {
   84 |         let Ok(mut inner_state) = self.state.lock() else {
   85 |             return;
   86 |         };
   87 |         match self.side {
   88 |             Side::Left => inner_state.left_dropped = true,
   89 |             Side::Right => inner_state.right_dropped = true,
   90 |         }
   91 |         // The buffer only ever holds items destined for one side (a side
   92 |         // polls the inner stream only after draining its own share), so any
   93 |         // count still pending for this side sits at the front. Pop those
   94 |         // items and release their capacity permits, or a bounded survivor
   95 |         // deadlocks once the budget is exhausted.
   96 |         let pending_for_self = match self.side {
   97 |             Side::Left => std::mem::take(&mut inner_state.left_buffered),
   98 |             Side::Right => std::mem::take(&mut inner_state.right_buffered),
   99 |         };
  100 |         debug_assert!(
  101 |             pending_for_self == 0 || inner_state.buffer.len() as u32 == pending_for_self,
  102 |             "buffer holds items for both sides"
  103 |         );
  104 |         for _ in 0..pending_for_self {
  105 |             inner_state.buffer.pop_front();
  106 |             if let Some(available_buffer) = inner_state.available_buffer.as_mut() {
  107 |                 available_buffer.add_permits(1);
  108 |             }
  109 |         }
  110 |         // If this side was mid-poll when its task went away, the inner
  111 |         // stream holds a dead waker and the survivor would wait forever on
  112 |         // `polling`. Let the survivor take over.
  113 |         let was_polling = inner_state.polling == Some(self.side);
  114 |         let to_wake = if was_polling {
  115 |             inner_state.polling = None;
  116 |             inner_state.waker.take()
  117 |         } else {
  118 |             None
  119 |         };
  120 |         drop(inner_state);
  121 |         if let Some(waker) = to_wake {
  122 |             waker.wake();
  123 |         }
  124 |     }
  125 | }
  126 | 
  127 | impl<T: Clone> Stream for SharedStream<'_, T> {
  128 |     type Item = T;
  129 | 
  130 |     fn poll_next(
  131 |         self: std::pin::Pin<&mut Self>,
  132 |         cx: &mut std::task::Context<'_>,
  133 |     ) -> std::task::Poll<Option<Self::Item>> {
  134 |         let mut inner_state = self.state.lock().unwrap();
  135 |         let can_take_buffered = match self.side {
  136 |             Side::Left => inner_state.left_buffered > 0,
  137 |             Side::Right => inner_state.right_buffered > 0,
  138 |         };
  139 |         if can_take_buffered {
  140 |             // Easy case, there is an item in the buffer.  Grab it, decrement the count, and return it.
  141 |             let item = inner_state.buffer.pop_front();
  142 |             match self.side {
  143 |                 Side::Left => {
  144 |                     inner_state.left_buffered -= 1;
  145 |                 }
  146 |                 Side::Right => {
  147 |                     inner_state.right_buffered -= 1;
  148 |                 }
  149 |             }
  150 |             if let Some(available_buffer) = inner_state.available_buffer.as_mut() {
  151 |                 available_buffer.add_permits(1);
  152 |             }
  153 |             std::task::Poll::Ready(item)
  154 |         } else {
  155 |             if inner_state.exhausted {
  156 |                 return std::task::Poll::Ready(None);
  157 |             }
  158 |             // No buffered items, if we have room in the buffer, then try and poll for one
  159 |             let permit = if let Some(available_buffer) = inner_state.available_buffer.as_mut() {
  160 |                 match available_buffer.poll_acquire(cx) {
  161 |                     // Can return None if the semaphore is closed but we never close the semaphore
  162 |                     // so its safe to unwrap here
  163 |                     std::task::Poll::Ready(permit) => Some(permit.unwrap()),
  164 |                     std::task::Poll::Pending => {
  165 |                         return std::task::Poll::Pending;
  166 |                     }
  167 |                 }
  168 |             } else {
  169 |                 None
  170 |             };
  171 |             if let Some(polling_side) = inner_state.polling.as_ref()
  172 |                 && *polling_side != self.side
  173 |             {
  174 |                 // Another task is already polling the inner stream, so we don't need to do anything
  175 | 
  176 |                 // Per rust docs:
  177 |                 //   Note that on multiple calls to poll, only the Waker from the Context
  178 |                 //   passed to the most recent call should be scheduled to receive a wakeup.
  179 |                 //
  180 |                 // So it is safe to replace a potentially stale waker here.
  181 |                 inner_state.waker = Some(cx.waker().clone());
  182 |                 return std::task::Poll::Pending;
  183 |             }
  184 |             inner_state.polling = Some(self.side);
  185 |             // Release the mutex here as polling the inner stream is potentially expensive
  186 |             let mut to_poll = inner_state
  187 |                 .inner
  188 |                 .take()
  189 |                 .expect("Other half of shared stream panic'd while polling inner stream");
  190 |             drop(inner_state);
  191 |             let res = to_poll.poll_next_unpin(cx);
  192 |             let mut inner_state = self.state.lock().unwrap();
  193 | 
  194 |             let mut should_wake = true;
  195 |             match &res {
  196 |                 std::task::Poll::Ready(None) => {
  197 |                     inner_state.exhausted = true;
  198 |                     inner_state.polling = None;
  199 |                 }
  200 |                 std::task::Poll::Ready(Some(item)) => {
  201 |                     inner_state.polling = None;
  202 |                     // Let the other side know an item is available. A dropped
  203 |                     // side never will be: skip the clone so neither a buffer
  204 |                     // entry nor its capacity permit is stranded.
  205 |                     let other_alive = match self.side {
  206 |                         Side::Left => !inner_state.right_dropped,
  207 |                         Side::Right => !inner_state.left_dropped,
  208 |                     };
  209 |                     if other_alive {
  210 |                         // We got an item, forget the permit to mark that we can take one fewer items
  211 |                         if let Some(permit) = permit {
  212 |                             permit.forget();
  213 |                         }
  214 |                         match self.side {
  215 |                             Side::Left => {
  216 |                                 inner_state.right_buffered += 1;
  217 |                             }
  218 |                             Side::Right => {
  219 |                                 inner_state.left_buffered += 1;
  220 |                             }
  221 |                         };
  222 |                         inner_state.buffer.push_back(item.clone());
  223 |                     }
  224 |                 }
  225 |                 std::task::Poll::Pending => {
  226 |                     should_wake = false;
  227 |                 }
  228 |             };
  229 | 
  230 |             inner_state.inner = Some(to_poll);
  231 | 
  232 |             // If the other side was waiting for us to poll, wake them up, but only after we release the mutex
  233 |             let to_wake = if should_wake {
  234 |                 inner_state.waker.take()
  235 |             } else {
  236 |                 // If the inner stream is pending then the inner stream will wake us up and we will wake the
  237 |                 // other side up then.
  238 |                 None
  239 |             };
  240 |             drop(inner_state);
  241 |             if let Some(waker) = to_wake {
  242 |                 waker.wake();
  243 |             }
  244 |             res
  245 |         }
  246 |     }
  247 | }
  248 | 
  249 | pub trait SharedStreamExt<'a>: Stream + Send
  250 | where
  251 |     Self::Item: Clone,
  252 | {
  253 |     /// Split a stream into two shared streams
  254 |     ///
  255 |     /// Each shared stream will return the full set of items from the underlying stream.
  256 |     /// This works by buffering the items from the underlying stream and then replaying
  257 |     /// them to the other side.
  258 |     ///
  259 |     /// The capacity parameter controls how many items can be buffered at once.  Be careful
  260 |     /// with the capacity parameter as it can lead to deadlock if the two streams are not
  261 |     /// polled evenly.
  262 |     ///
  263 |     /// If the capacity is unbounded then the stream could potentially buffer the entire
  264 |     /// input stream in memory.
  265 |     fn share(
  266 |         self,
  267 |         capacity: Capacity,
  268 |     ) -> (SharedStream<'a, Self::Item>, SharedStream<'a, Self::Item>);
  269 | }
  270 | 
  271 | impl<'a, T: Clone> SharedStreamExt<'a> for BoxStream<'a, T> {
  272 |     fn share(self, capacity: Capacity) -> (SharedStream<'a, T>, SharedStream<'a, T>) {
  273 |         SharedStream::new(self, capacity)
  274 |     }
  275 | }
  276 | 
  277 | #[pin_project]
  278 | pub struct FinallyStream<S: Stream, F: FnOnce()> {
  279 |     #[pin]
  280 |     stream: S,
  281 |     f: Option<F>,
  282 | }
  283 | 
  284 | impl<S: Stream, F: FnOnce()> FinallyStream<S, F> {
  285 |     pub fn new(stream: S, f: F) -> Self {
  286 |         Self { stream, f: Some(f) }
  287 |     }
  288 | }
  289 | 
  290 | impl<S: Stream, F: FnOnce()> Stream for FinallyStream<S, F> {
  291 |     type Item = S::Item;
  292 | 
  293 |     fn poll_next(
  294 |         self: std::pin::Pin<&mut Self>,
  295 |         cx: &mut std::task::Context<'_>,
  296 |     ) -> std::task::Poll<Option<Self::Item>> {
  297 |         let this = self.project();
  298 |         let res = this.stream.poll_next(cx);
  299 |         if matches!(res, std::task::Poll::Ready(None)) {
  300 |             // It's possible that None is polled multiple times, but we only call the function once
  301 |             if let Some(f) = this.f.take() {
  302 |                 f();
  303 |             }
  304 |         }
  305 |         res
  306 |     }
  307 | }
  308 | 
  309 | pub trait FinallyStreamExt<S: Stream>: Stream + Sized {
  310 |     fn finally<F: FnOnce()>(self, f: F) -> FinallyStream<Self, F> {
  311 |         FinallyStream {
  312 |             stream: self,
  313 |             f: Some(f),
  314 |         }
  315 |     }
  316 | }
  317 | 
  318 | impl<S: Stream> FinallyStreamExt<S> for S {
  319 |     fn finally<F: FnOnce()>(self, f: F) -> FinallyStream<Self, F> {
  320 |         FinallyStream::new(self, f)
  321 |     }
  322 | }
  323 | 
  324 | /// A stream wrapper that calls a function when dropped.
  325 | ///
  326 | /// Unlike [`FinallyStream`], which fires when the inner stream yields `None`,
  327 | /// this fires when the wrapper is dropped — even if the stream was not fully
  328 | /// consumed.
  329 | #[pin_project(PinnedDrop)]
  330 | pub struct OnDropStream<S: Stream, F: FnOnce()> {
  331 |     #[pin]
  332 |     stream: S,
  333 |     f: Option<F>,
  334 | }
  335 | 
  336 | impl<S: Stream, F: FnOnce()> OnDropStream<S, F> {
  337 |     pub fn new(stream: S, f: F) -> Self {
  338 |         Self { stream, f: Some(f) }
  339 |     }
  340 | }
  341 | 
  342 | impl<S: Stream, F: FnOnce()> Stream for OnDropStream<S, F> {
  343 |     type Item = S::Item;
  344 | 
  345 |     fn poll_next(
  346 |         self: std::pin::Pin<&mut Self>,
  347 |         cx: &mut std::task::Context<'_>,
  348 |     ) -> std::task::Poll<Option<Self::Item>> {
  349 |         self.project().stream.poll_next(cx)
  350 |     }
  351 | }
  352 | 
  353 | #[pinned_drop]
  354 | impl<S: Stream, F: FnOnce()> PinnedDrop for OnDropStream<S, F> {
  355 |     fn drop(self: std::pin::Pin<&mut Self>) {
  356 |         let this = self.project();
  357 |         if let Some(f) = this.f.take() {
  358 |             f();
  359 |         }
  360 |     }
  361 | }
  362 | 
  363 | pub trait StreamOnDropExt: Stream + Sized {
  364 |     /// Wrap this stream so that `f` is called when the stream is dropped.
  365 |     fn on_drop<F: FnOnce()>(self, f: F) -> OnDropStream<Self, F> {
  366 |         OnDropStream::new(self, f)
  367 |     }
  368 | }
  369 | 
  370 | impl<S: Stream> StreamOnDropExt for S {}
  371 | 
  372 | #[cfg(test)]
  373 | mod tests {
  374 | 
  375 |     use std::sync::Arc;
  376 |     use std::sync::atomic::{AtomicBool, Ordering};
  377 | 
  378 |     use futures::{FutureExt, StreamExt};
  379 |     use tokio_stream::wrappers::ReceiverStream;
  380 | 
  381 |     use crate::utils::futures::{Capacity, SharedStreamExt, StreamOnDropExt};
  382 | 
  383 |     fn is_pending(fut: &mut (impl std::future::Future + Unpin)) -> bool {
  384 |         let noop_waker = futures::task::noop_waker();
  385 |         let mut context = std::task::Context::from_waker(&noop_waker);
  386 |         fut.poll_unpin(&mut context).is_pending()
  387 |     }
  388 | 
  389 |     #[tokio::test]
  390 |     async fn test_shared_stream() {
  391 |         let (tx, rx) = tokio::sync::mpsc::channel::<u32>(10);
  392 |         let inner_stream = ReceiverStream::new(rx);
  393 | 
  394 |         // Feed in a few items
  395 |         for i in 0..3 {
  396 |             tx.send(i).await.unwrap();
  397 |         }
  398 | 
  399 |         let (mut left, mut right) = inner_stream.boxed().share(Capacity::Bounded(2));
  400 | 
  401 |         // We should be able to immediately poll 2 items
  402 |         assert_eq!(left.next().await.unwrap(), 0);
  403 |         assert_eq!(left.next().await.unwrap(), 1);
  404 | 
  405 |         // Polling again should block because the right side has fallen behind
  406 |         let mut left_fut = left.next();
  407 | 
  408 |         assert!(is_pending(&mut left_fut));
  409 | 
  410 |         // Polling the right side should yield the first cached item and unblock the left
  411 |         assert_eq!(right.next().await.unwrap(), 0);
  412 |         assert_eq!(left_fut.await.unwrap(), 2);
  413 | 
  414 |         // Drain the rest of the stream from the right
  415 |         assert_eq!(right.next().await.unwrap(), 1);
  416 |         assert_eq!(right.next().await.unwrap(), 2);
  417 | 
  418 |         // The channel isn't closed yet so we should get pending on both sides
  419 |         let mut right_fut = right.next();
  420 |         let mut left_fut = left.next();
  421 |         assert!(is_pending(&mut right_fut));
  422 |         assert!(is_pending(&mut left_fut));
  423 | 
  424 |         // Send one more item
  425 |         tx.send(3).await.unwrap();
  426 | 
  427 |         // Should be received by both
  428 |         assert_eq!(right_fut.await.unwrap(), 3);
  429 |         assert_eq!(left_fut.await.unwrap(), 3);
  430 | 
  431 |         drop(tx);
  432 | 
  433 |         // Now we should be able to poll the end from either side
  434 |         assert_eq!(left.next().await, None);
  435 |         assert_eq!(right.next().await, None);
  436 | 
  437 |         // We should be self-fused
  438 |         assert_eq!(left.next().await, None);
  439 |         assert_eq!(right.next().await, None);
  440 |     }
  441 | 
  442 |     #[test]
  443 |     fn test_shared_stream_replaces_waiting_waker() {
  444 |         let inner_stream = futures::stream::pending::<u32>();
  445 |         let (mut left, mut right) = inner_stream.boxed().share(Capacity::Unbounded);
  446 | 
  447 |         let mut left_fut = left.next();
  448 |         assert!(is_pending(&mut left_fut));
  449 | 
  450 |         let mut right_fut = right.next();
  451 |         assert!(is_pending(&mut right_fut));
  452 |         assert!(is_pending(&mut right_fut));
  453 |     }
  454 | 
  455 |     #[tokio::test]
  456 |     async fn test_unbounded_shared_stream() {
  457 |         let (tx, rx) = tokio::sync::mpsc::channel::<u32>(10);
  458 |         let inner_stream = ReceiverStream::new(rx);
  459 | 
  460 |         // Feed in a few items
  461 |         for i in 0..10 {
  462 |             tx.send(i).await.unwrap();
  463 |         }
  464 |         drop(tx);
  465 | 
  466 |         let (mut left, mut right) = inner_stream.boxed().share(Capacity::Unbounded);
  467 | 
  468 |         // We should be able to completely drain one side
  469 |         for i in 0..10 {
  470 |             assert_eq!(left.next().await.unwrap(), i);
  471 |         }
  472 |         assert_eq!(left.next().await, None);
  473 | 
  474 |         // And still drain the other side from the buffer
  475 |         for i in 0..10 {
  476 |             assert_eq!(right.next().await.unwrap(), i);
  477 |         }
  478 |         assert_eq!(right.next().await, None);
  479 |     }
  480 | 
  481 |     #[tokio::test(flavor = "multi_thread")]
  482 |     async fn stress_shared_stream() {
  483 |         for _ in 0..100 {
  484 |             let (tx, rx) = tokio::sync::mpsc::channel::<u32>(10);
  485 |             let inner_stream = ReceiverStream::new(rx);
  486 |             let (mut left, mut right) = inner_stream.boxed().share(Capacity::Bounded(2));
  487 | 
  488 |             let left_handle = tokio::spawn(async move {
  489 |                 let mut counter = 0;
  490 |                 while let Some(item) = left.next().await {
  491 |                     assert_eq!(item, counter);
  492 |                     counter += 1;
  493 |                 }
  494 |             });
  495 | 
  496 |             let right_handle = tokio::spawn(async move {
  497 |                 let mut counter = 0;
  498 |                 while let Some(item) = right.next().await {
  499 |                     assert_eq!(item, counter);
  500 |                     counter += 1;
  501 |                 }
  502 |             });
  503 | 
  504 |             for i in 0..1000 {
  505 |                 tx.send(i).await.unwrap();
  506 |             }
  507 |             drop(tx);
  508 |             left_handle.await.unwrap();
  509 |             right_handle.await.unwrap();
  510 |         }
  511 |     }
  512 | 
  513 |     #[tokio::test]
  514 |     async fn test_on_drop_fires_on_early_drop() {
  515 |         let called = Arc::new(AtomicBool::new(false));
  516 |         let called_clone = called.clone();
  517 | 
  518 |         let stream = futures::stream::iter(vec![1, 2, 3]);
  519 |         let mut stream = stream.on_drop(move || {
  520 |             called_clone.store(true, Ordering::SeqCst);
  521 |         });
  522 | 
  523 |         // Consume only one item, then drop
  524 |         assert_eq!(stream.next().await, Some(1));
  525 |         assert!(!called.load(Ordering::SeqCst));
  526 |         drop(stream);
  527 |         assert!(called.load(Ordering::SeqCst));
  528 |     }
  529 | 
  530 |     #[tokio::test]
  531 |     async fn test_on_drop_fires_after_exhaustion() {
  532 |         let called = Arc::new(AtomicBool::new(false));
  533 |         let called_clone = called.clone();
  534 | 
  535 |         let stream = futures::stream::iter(vec![1]);
  536 |         let mut stream = stream.on_drop(move || {
  537 |             called_clone.store(true, Ordering::SeqCst);
  538 |         });
  539 | 
  540 |         assert_eq!(stream.next().await, Some(1));
  541 |         assert_eq!(stream.next().await, None);
  542 |         assert!(!called.load(Ordering::SeqCst));
  543 |         drop(stream);
  544 |         assert!(called.load(Ordering::SeqCst));
  545 |     }
  546 | 
  547 |     #[tokio::test]
  548 |     async fn test_on_drop_fires_without_polling() {
  549 |         let called = Arc::new(AtomicBool::new(false));
  550 |         let called_clone = called.clone();
  551 | 
  552 |         let stream = futures::stream::iter(vec![1, 2, 3]);
  553 |         let stream = stream.on_drop(move || {
  554 |             called_clone.store(true, Ordering::SeqCst);
  555 |         });
  556 | 
  557 |         assert!(!called.load(Ordering::SeqCst));
  558 |         drop(stream);
  559 |         assert!(called.load(Ordering::SeqCst));
  560 |     }
  561 | 
  562 |     /// If one side is dropped mid-stream, the survivor must still be able to
  563 |     /// make progress. Two mechanisms used to wedge a bounded stream: items
  564 |     /// buffered for the dropped side never released their capacity permits,
  565 |     /// and every later fetch kept spending a permit on a clone nobody would
  566 |     /// take, so the survivor stalled again one capacity later. The third
  567 |     /// mechanism, a dropped side left recorded as the current poller, is
  568 |     /// covered by the two tests below.
  569 |     #[tokio::test]
  570 |     async fn test_shared_stream_survivor_progresses_after_drop() {
  571 |         let (tx, rx) = tokio::sync::mpsc::channel::<u32>(10);
  572 |         for i in 0..6 {
  573 |             tx.send(i).await.unwrap();
  574 |         }
  575 |         let (left, mut right) = ReceiverStream::new(rx).boxed().share(Capacity::Bounded(2));
  576 | 
  577 |         // Right races ahead by the full capacity; the two buffered items are
  578 |         // destined for left and hold the only two permits.
  579 |         assert_eq!(right.next().await.unwrap(), 0);
  580 |         assert_eq!(right.next().await.unwrap(), 1);
  581 |         let mut right_fut = right.next();
  582 |         assert!(is_pending(&mut right_fut));
  583 | 
  584 |         drop(left);
  585 | 
  586 |         // The stranded permits must be released so right can keep reading,
  587 |         // including past the original capacity budget: later fetches must
  588 |         // stop buffering clones for the dropped side at all.
  589 |         let item = tokio::time::timeout(std::time::Duration::from_secs(5), right_fut).await;
  590 |         assert_eq!(item.expect("survivor wedged by dropped side").unwrap(), 2);
  591 |         for expected in 3..6 {
  592 |             let item = tokio::time::timeout(std::time::Duration::from_secs(5), right.next()).await;
  593 |             assert_eq!(
  594 |                 item.expect("survivor wedged after capacity re-spent")
  595 |                     .unwrap(),
  596 |                 expected
  597 |             );
  598 |         }
  599 |     }
  600 | 
  601 |     #[tokio::test]
  602 |     async fn test_shared_stream_dropped_poller_releases_inner_stream() {
  603 |         let (tx, rx) = tokio::sync::mpsc::channel::<u32>(10);
  604 |         let (mut left, mut right) = ReceiverStream::new(rx).boxed().share(Capacity::Unbounded);
  605 | 
  606 |         // Left polls while the channel is empty, so it stays recorded as the
  607 |         // poller and the inner stream keeps the waker it was polled with.
  608 |         let mut left_fut = left.next();
  609 |         assert!(is_pending(&mut left_fut));
  610 |         drop(left_fut);
  611 |         drop(left);
  612 | 
  613 |         // An item arriving for the survivor must not be lost to the dead
  614 |         // side's stale poll.
  615 |         tx.send(42).await.unwrap();
  616 |         let item = tokio::time::timeout(std::time::Duration::from_secs(5), right.next()).await;
  617 |         assert_eq!(
  618 |             item.expect("survivor wedged by dropped poller").unwrap(),
  619 |             42
  620 |         );
  621 |     }
  622 |     struct FlagWaker(AtomicBool);
  623 | 
  624 |     impl futures::task::ArcWake for FlagWaker {
  625 |         fn wake_by_ref(arc_self: &Arc<Self>) {
  626 |             arc_self.0.store(true, Ordering::SeqCst);
  627 |         }
  628 |     }
  629 | 
  630 |     /// A survivor already parked behind `polling` has to be woken when the
  631 |     /// recorded poller is dropped: the inner stream only holds the waker the
  632 |     /// dropped side polled with, so nothing else will re-poll the survivor.
  633 |     #[tokio::test]
  634 |     async fn test_shared_stream_dropped_poller_wakes_parked_survivor() {
  635 |         let (tx, rx) = tokio::sync::mpsc::channel::<u32>(10);
  636 |         let (mut left, mut right) = ReceiverStream::new(rx).boxed().share(Capacity::Unbounded);
  637 | 
  638 |         // Left becomes the recorded poller and parks on the empty channel.
  639 |         let mut left_fut = left.next();
  640 |         assert!(is_pending(&mut left_fut));
  641 |         drop(left_fut);
  642 | 
  643 |         // Right parks behind `polling == Some(Left)`, leaving its waker behind.
  644 |         let flag = Arc::new(FlagWaker(AtomicBool::new(false)));
  645 |         let flag_waker = futures::task::waker(flag.clone());
  646 |         let mut cx = std::task::Context::from_waker(&flag_waker);
  647 |         let mut right_fut = right.next();
  648 |         assert!(right_fut.poll_unpin(&mut cx).is_pending());
  649 |         assert!(!flag.0.load(Ordering::SeqCst));
  650 | 
  651 |         drop(left);
  652 |         assert!(
  653 |             flag.0.load(Ordering::SeqCst),
  654 |             "dropping the poller must wake the parked survivor"
  655 |         );
  656 | 
  657 |         tx.send(42).await.unwrap();
  658 |         let item = tokio::time::timeout(std::time::Duration::from_secs(5), right_fut).await;
  659 |         assert_eq!(
  660 |             item.expect("survivor wedged by dropped poller").unwrap(),
  661 |             42
  662 |         );
  663 |     }
  664 | 
  665 |     /// With an unbounded capacity nothing blocks, so the only observable effect
  666 |     /// of a drop is memory: the dropped side's buffered items must be freed and
  667 |     /// no further clone queued for it.
  668 |     #[tokio::test]
  669 |     async fn test_shared_stream_unbounded_stops_buffering_for_dropped_side() {
  670 |         let (tx, rx) = tokio::sync::mpsc::channel::<u32>(10);
  671 |         for i in 0..4 {
  672 |             tx.send(i).await.unwrap();
  673 |         }
  674 |         let (left, mut right) = ReceiverStream::new(rx).boxed().share(Capacity::Unbounded);
  675 | 
  676 |         // Right reads ahead, so every item is also cloned into the buffer for left.
  677 |         assert_eq!(right.next().await.unwrap(), 0);
  678 |         assert_eq!(right.next().await.unwrap(), 1);
  679 |         assert_eq!(right.state.lock().unwrap().buffer.len(), 2);
  680 | 
  681 |         drop(left);
  682 |         assert!(
  683 |             right.state.lock().unwrap().buffer.is_empty(),
  684 |             "the dropped side's buffered items must be released"
  685 |         );
  686 | 
  687 |         for expected in 2..4 {
  688 |             let item = tokio::time::timeout(std::time::Duration::from_secs(5), right.next()).await;
  689 |             assert_eq!(
  690 |                 item.expect("survivor wedged after peer drop").unwrap(),
  691 |                 expected
  692 |             );
  693 |         }
  694 |         let state = right.state.lock().unwrap();
  695 |         assert!(
  696 |             state.buffer.is_empty(),
  697 |             "no clone may be queued for a dropped side"
  698 |         );
  699 |         assert_eq!(state.left_buffered, 0);
  700 |     }
  701 | }
``````
