> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md).

# rust/lance-encoding/src/lib.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `deea379f29a4fca758adaaad3bcf03b317e03f53e2df6bba5d42862f21da2923`. Reviewed physical lines: 1-134.

[Module](../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Public module facade, single-file EncodingsIo trait, eager in-memory BufferScheduler and little-endian-only compile gate. (rust/lance-encoding/src/lib.rs:1-134)

## Complete range analysis

### Lines 1-10

SPDX and imports: Range/Arc, Bytes, FutureExt/TryFutureExt/BoxFuture and lance_core::Result. Future helpers box ready results and map successful single requests. No runtime initialization occurs in these imports. (rust/lance-encoding/src/lib.rs:1-10)

### Lines 11-26

array_encoding module is private. Public modules are buffer,compression,compression_config,constants,data,decoder,encoder,encodings,format,repdef,statistics,utils. testing is public only under cfg(test). Public child visibility does not mean every inner implementation is public; exact child APIs remain pending. (rust/lance-encoding/src/lib.rs:11-26)

### Lines 27-32

Every non-little-endian target triggers compile_error with message Lance encodings only support little-endian systems. The comment describes big-endian support as future work requiring testing, not a supported portable byte-swap path. This is a compile-time gate, independent of optional compressor features. (rust/lance-encoding/src/lib.rs:27-32)

### Lines 33-62

Public EncodingsIo:Debug+Send+Sync supplies a single-file IO service without requiring lance-io. submit_request borrows self, owns Vec<Range<u64>> and u64 priority, and returns a static boxed future of Result<Vec<Bytes>>. Contract requires one returned Bytes per requested range even after coalescing, and an empty buffer for each empty range. Priority should be the lowest row delivered so late indirect reads can be prioritized. Trait declaration does not enforce range legality, response ordering/count, scheduling, cancellation or durability; implementations/callers own those obligations. (rust/lance-encoding/src/lib.rs:33-62)

### Lines 63-77

Default submit_single owns one range/priority, calls submit_request immediately, maps Ok through v.pop().unwrap(), then boxes. Upstream Err is preserved. An empty success vector panics while the mapped future is polled; surplus responses silently drop all but the last. No response-count validation or buffer-size check occurs. Correct one-response implementations return their sole Bytes. (rust/lance-encoding/src/lib.rs:63-77)

### Lines 78-88

Default with_bypass_backpressure returns None. Contract describes a derived IO service for indirect reads to avoid backpressure deadlock/latency; unsupported callers should fall back to self. This default neither clones a service nor changes scheduling. (rust/lance-encoding/src/lib.rs:78-88)

### Lines 89-105

Default with_io_stats accepts Arc<dyn IoStatsRecorder> but ignores/drops it and returns None. Docs describe additive per-scope accounting without reopening files; unsupported callers fall back to self without scope statistics. No counters, wrapper, global accounting or instrumentation are created here. (rust/lance-encoding/src/lib.rs:89-105)

### Lines 106-116

Public Debug BufferScheduler privately owns Bytes. new moves that buffer into Self without validating contents, file identity or size. No Clone implementation is declared, although callers can wrap it in Arc. (rust/lance-encoding/src/lib.rs:106-116)

### Lines 117-121

Private satisfy_request casts both u64 endpoints to usize and calls Bytes::slice on the requested half-open range. It does not validate ordering/bounds, use checked conversions or return Result. On narrower targets casts can truncate; invalid slice bounds reach dependency panic behavior instead of a Lance error. The underlying Bytes slice operation is delegated; the helper contains no explicit payload-copy or allocation loop. (rust/lance-encoding/src/lib.rs:117-121)

### Lines 122-134

BufferScheduler submit_request consumes ranges in input order, eagerly slices and collects a Vec before constructing future::ready(Ok(...)). Therefore slicing failure occurs at submission, not first future poll. Priority is ignored; empty input returns an empty Vec; valid empty ranges produce empty slices. Returned static future owns collected Bytes, so it does not borrow self. No IO, backpressure, task spawn, cancellation handling, coalescing, stats override or local tests exist; bypass/stats inherit None. Dropping a returned future releases its results, but cannot undo already performed slicing/collection. (rust/lance-encoding/src/lib.rs:122-134)

## Interaction and interpretation limits

All physical lines of this file were read in bounded, untruncated source outputs during ANALYZE71. Source is read-only and offline. No Lance build, test, lint, benchmark, generator, dependency installation or network access occurred. Crate coverage remains partial; generated Rust declarations are represented by their analyzed protobuf inputs and literal include paths, not fabricated compiler output. Contextual dependency reads establish only cited local behavior.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::{ops::Range, sync::Arc};
    5 | 
    6 | use bytes::Bytes;
    7 | use futures::{FutureExt, TryFutureExt, future::BoxFuture};
    8 | 
    9 | use lance_core::Result;
   10 | 
   11 | mod array_encoding;
   12 | pub mod buffer;
   13 | pub mod compression;
   14 | pub mod compression_config;
   15 | pub mod constants;
   16 | pub mod data;
   17 | pub mod decoder;
   18 | pub mod encoder;
   19 | pub mod encodings;
   20 | pub mod format;
   21 | pub mod repdef;
   22 | pub mod statistics;
   23 | #[cfg(test)]
   24 | pub mod testing;
   25 | pub mod utils;
   26 | 
   27 | // We can definitely add support for big-endian machines someday.  However, it's not a priority and
   28 | // would involve extensive testing (probably through emulation) to ensure that the encodings are
   29 | // correct.
   30 | #[cfg(not(target_endian = "little"))]
   31 | compile_error!("Lance encodings only support little-endian systems.");
   32 | 
   33 | /// A trait for an I/O service
   34 | ///
   35 | /// This represents the I/O API that the encoders and decoders need in order to operate.
   36 | /// We specify this as a trait so that lance-encodings does not need to depend on lance-io
   37 | ///
   38 | /// In general, it is assumed that this trait will be implemented by some kind of "file reader"
   39 | /// or "file scheduler".  The encodings here are all limited to accessing a single file.
   40 | pub trait EncodingsIo: std::fmt::Debug + Send + Sync {
   41 |     /// Submit an I/O request
   42 |     ///
   43 |     /// The response must contain a `Bytes` object for each range requested even if the underlying
   44 |     /// I/O was coalesced into fewer actual requests.
   45 |     ///
   46 |     /// # Arguments
   47 |     ///
   48 |     /// * `ranges` - the byte ranges to request
   49 |     /// * `priority` - the priority of the request
   50 |     ///
   51 |     /// Priority should be set to the lowest row number that this request is delivering data for.
   52 |     /// This is important in cases where indirect I/O causes high priority requests to be submitted
   53 |     /// after low priority requests.  We want to fulfill the indirect I/O more quickly so that we
   54 |     /// can decode as quickly as possible.
   55 |     ///
   56 |     /// The implementation should be able to handle empty ranges, and should return an empty
   57 |     /// byte buffer for each empty range.
   58 |     fn submit_request(
   59 |         &self,
   60 |         range: Vec<Range<u64>>,
   61 |         priority: u64,
   62 |     ) -> BoxFuture<'static, Result<Vec<Bytes>>>;
   63 | 
   64 |     /// Submit an I/O request with a single range
   65 |     ///
   66 |     /// This is just a utitliy function that wraps [`EncodingsIo::submit_request`] for the common
   67 |     /// case of a single range request.
   68 |     fn submit_single(
   69 |         &self,
   70 |         range: std::ops::Range<u64>,
   71 |         priority: u64,
   72 |     ) -> BoxFuture<'static, lance_core::Result<bytes::Bytes>> {
   73 |         self.submit_request(vec![range], priority)
   74 |             .map_ok(|mut v| v.pop().unwrap())
   75 |             .boxed()
   76 |     }
   77 | 
   78 |     /// Returns a version of this I/O service that bypasses backpressure for all requests.
   79 |     ///
   80 |     /// This is intended for indirect I/O (e.g. fetching items after decoding offsets) where
   81 |     /// blocking on backpressure could cause deadlocks or excessive latency.
   82 |     ///
   83 |     /// Returns `None` if this implementation does not support bypass (e.g. in-memory or test
   84 |     /// schedulers), in which case the caller should fall back to using self.
   85 |     fn with_bypass_backpressure(&self) -> Option<Arc<dyn EncodingsIo>> {
   86 |         None
   87 |     }
   88 | 
   89 |     /// Returns a version of this I/O service that additionally records the I/O it
   90 |     /// performs into `stats`, on top of any global accounting.  This is the seam
   91 |     /// used to measure exact per-scope (e.g. per-query) I/O without re-opening
   92 |     /// files: wrap a reader's I/O service, perform the reads, then inspect the
   93 |     /// recorder.
   94 |     ///
   95 |     /// Returns `None` if this implementation does not support per-scope I/O
   96 |     /// statistics (e.g. in-memory or test schedulers), in which case the caller
   97 |     /// should fall back to using self (and no statistics are recorded).
   98 |     fn with_io_stats(
   99 |         &self,
  100 |         _stats: Arc<dyn lance_core::utils::io_stats::IoStatsRecorder>,
  101 |     ) -> Option<Arc<dyn EncodingsIo>> {
  102 |         None
  103 |     }
  104 | }
  105 | 
  106 | /// An implementation of EncodingsIo that serves data from an in-memory buffer
  107 | #[derive(Debug)]
  108 | pub struct BufferScheduler {
  109 |     data: Bytes,
  110 | }
  111 | 
  112 | impl BufferScheduler {
  113 |     pub fn new(data: Bytes) -> Self {
  114 |         Self { data }
  115 |     }
  116 | 
  117 |     fn satisfy_request(&self, req: Range<u64>) -> Bytes {
  118 |         self.data.slice(req.start as usize..req.end as usize)
  119 |     }
  120 | }
  121 | 
  122 | impl EncodingsIo for BufferScheduler {
  123 |     fn submit_request(
  124 |         &self,
  125 |         ranges: Vec<Range<u64>>,
  126 |         _priority: u64,
  127 |     ) -> BoxFuture<'static, Result<Vec<Bytes>>> {
  128 |         std::future::ready(Ok(ranges
  129 |             .into_iter()
  130 |             .map(|range| self.satisfy_request(range))
  131 |             .collect::<Vec<_>>()))
  132 |         .boxed()
  133 |     }
  134 | }
``````
