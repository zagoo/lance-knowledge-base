> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-core/src/utils/io_stats.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `677e1e431824f802ce8fd74ff147fd813b109c79b7ae0a328c9e6b5817e646d1`. Reviewed physical lines: 1-30.

[Module](../../../../../L1-modules/rust-lance-core-storage.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public object-safe request-accounting seam, located in core to avoid an encoding/IO dependency cycle. (rust/lance-core/src/utils/io_stats.rs:1-30)

## Complete range analysis

### Lines 1-4

SPDX metadata and std::ops::Range import; the recorded range endpoints are u64. (rust/lance-core/src/utils/io_stats.rs:1-4)

### Lines 5-24

Comments describe per-bounded-operation physical IO accounting attached to readers, contrasted with process-wide IO scheduler counters and a test IOTracker. They name index constructors accepting &mut IoStats, with_io_stats wiring, existing metadata-load accounting and preserving global counters. These are stated integration intent; the concrete constructors, recorder implementation and call timing require separate file analysis. Placement in core is explicitly justified by avoiding an encoding/IO cyclic dependency. (rust/lance-core/src/utils/io_stats.rs:5-24)

### Lines 25-30

IoStatsRecorder:Debug+Send+Sync exposes `record_request(&self,ranges:&[Range<u64>])` returning unit. Method documentation says completed IO request and actual submitted ranges after coalescing/splitting. The trait defines no counter storage, validation, range ordering, overlap policy or error propagation. Shared &self and Send+Sync permit shared implementations, whose synchronization/accounting must be supplied elsewhere. No local tests or concrete recorder are defined. (rust/lance-core/src/utils/io_stats.rs:25-30)

## Interaction and interpretation limits

The introduction says requests are recorded as submitted, while the method says completed requests; actual invocation timing cannot be settled from this trait alone. Preserve that distinction until callers are reviewed. (rust/lance-core/src/utils/io_stats.rs:6-30)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::ops::Range;
    5 | 
    6 | /// A sink that records I/O requests as they are submitted to storage.
    7 | ///
    8 | /// This lives in `lance-core` so that the encoding layer (`lance-encoding`) and
    9 | /// the I/O layer (`lance-io`) can both refer to it without depending on one
   10 | /// another.  It lets a caller attach a lightweight counter to a file reader and
   11 | /// measure the exact bytes/IOPS performed for a bounded scope (e.g. a single
   12 | /// query); see `lance_io::scheduler::IoStats` for the concrete implementation.
   13 | ///
   14 | /// # When to use this
   15 | ///
   16 | /// Lance also exposes two *process-wide, cumulative* I/O accounting facilities:
   17 | /// the global scheduler counters (`lance_io::scheduler::iops_counter` /
   18 | /// `bytes_read_counter`) and the object-store `IOTracker` wrapper used in tests.
   19 | /// Both aggregate every read in the process and cannot attribute I/O to a single
   20 | /// bounded scope.  Prefer an `IoStatsRecorder` when you need the *exact* I/O of
   21 | /// one operation (e.g. a single query): attach it to a reader with
   22 | /// `with_io_stats`, then read the snapshot when the scope ends.  It re-uses the
   23 | /// reader's cached metadata, so measuring costs no extra file opens and does not
   24 | /// disturb the global counters.
   25 | pub trait IoStatsRecorder: std::fmt::Debug + Send + Sync {
   26 |     /// Record one completed request, given the byte ranges as actually
   27 |     /// submitted to storage (i.e. after any coalescing/splitting), so the
   28 |     /// counts reflect physical I/O.
   29 |     fn record_request(&self, ranges: &[Range<u64>]);
   30 | }
``````
