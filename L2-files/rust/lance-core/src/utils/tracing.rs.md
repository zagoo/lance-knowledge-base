> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-core/src/utils/tracing.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `9a43bb74b59cb53623027b8fa4eb66dcf23c0dcc1463e9355adad0953b161d5e`. Reviewed physical lines: 1-88.

[Module](../../../../../L1-modules/rust-lance-core-storage.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public stream/span adapter and exact tracing target/event-name constants, with no local event emitter or tests. (rust/lance-core/src/utils/tracing.rs:1-88)

## Complete range analysis

### Lines 1-6

SPDX metadata and futures::Stream, pin_project::pin_project and tracing::Span imports establish dependencies for stream projection and scoped span entry. (rust/lance-core/src/utils/tracing.rs:1-6)

### Lines 7-13

InstrumentedStream<I:Stream> is public, with private #[pin] stream and unpinned Span; #[pin_project] supplies safe field projections. Callers normally construct it through the extension trait because fields are private. (rust/lance-core/src/utils/tracing.rs:7-13)

### Lines 14-26

The Stream implementation has Item=I::Item. poll_next projects the pinned wrapper, enters the stored span with a local guard, and delegates one poll to the inner stream. The guard ends on return, including Pending; it does not keep a span entered across the whole asynchronous wait. No custom size_hint or Drop behavior is implemented. (rust/lance-core/src/utils/tracing.rs:14-26)

### Lines 27-41

StreamTracingExt is a public trait without a supertrait; its two consuming methods each require Self:Stream+Sized. stream_in_current_span chooses context implicitly; stream_in_span accepts an explicit Span. The comment gives the naming reason as avoiding ambiguity with a similarly named instrumentation trait; no dependency trait implementation is changed. (rust/lance-core/src/utils/tracing.rs:27-41)

### Lines 42-59

The blanket implementation applies to every S:Stream. stream_in_current_span captures Span::current at wrapper construction and forwards to stream_in_span; the explicit form stores self and the supplied span. Construction does not poll the stream or enter the span. (rust/lance-core/src/utils/tracing.rs:42-59)

### Lines 60-70

File audit constants: TRACE_FILE_AUDIT="lance::file_audit"; AUDIT_MODE_CREATE="create", DELETE="delete", DELETE_UNVERIFIED="delete_unverified"; AUDIT_TYPE_DELETION="deletion", MANIFEST="manifest", INDEX="index", DATA="data", TRANSACTION="transaction"; TRACE_FILE_CREATE="create". All are public &str values; sharing the string "create" does not mean sharing one semantic field. (rust/lance-core/src/utils/tracing.rs:60-70)

### Lines 71-77

IO constants: TRACE_IO_EVENTS="lance::io_events"; IO_TYPE_OPEN_SCALAR="open_scalar_index", VECTOR="open_vector_index", FRAG_REUSE="open_frag_reuse_index", MEM_WAL="open_mem_wal_index"; IO_TYPE_LOAD_VECTOR_PART="load_vector_part", SCALAR_PART="load_scalar_part". These declarations identify labels only; they do not prove when a corresponding event fires. (rust/lance-core/src/utils/tracing.rs:71-77)

### Lines 78-88

Execution constants are TRACE_EXECUTION="lance::execution" and EXECUTION_PLAN_RUN="plan_run". Dataset target is TRACE_DATASET_EVENTS="lance::dataset_events"; DATASET_WRITING_EVENT/COMMITTED_EVENT/DROPPING_COLUMN_EVENT/DELETING_EVENT/COMPACTING_EVENT/CLEANING_EVENT/LOADING_EVENT have values writing/committed/dropping_column/deleting/compacting/cleaning/loading respectively. TRACE_OBJECT_STORE_THROTTLE="lance::object_store::throttle". No actual event emission or tests follow. (rust/lance-core/src/utils/tracing.rs:78-88)

## Interaction and interpretation limits

Changing these string values can change downstream filtering identity, but exact subscribers/emission sites remain pending. The established runtime behavior is scoped entry around each poll, not automatic instrumentation of construction/destruction. (rust/lance-core/src/utils/tracing.rs:14-59; rust/lance-core/src/utils/tracing.rs:61-88)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use futures::Stream;
    5 | use pin_project::pin_project;
    6 | use tracing::Span;
    7 | 
    8 | #[pin_project]
    9 | pub struct InstrumentedStream<I: Stream> {
   10 |     #[pin]
   11 |     stream: I,
   12 |     span: Span,
   13 | }
   14 | 
   15 | impl<I: Stream> Stream for InstrumentedStream<I> {
   16 |     type Item = I::Item;
   17 | 
   18 |     fn poll_next(
   19 |         self: std::pin::Pin<&mut Self>,
   20 |         cx: &mut std::task::Context<'_>,
   21 |     ) -> std::task::Poll<Option<Self::Item>> {
   22 |         let this = self.project();
   23 |         let _guard = this.span.enter();
   24 |         this.stream.poll_next(cx)
   25 |     }
   26 | }
   27 | 
   28 | // It would be nice to call the method in_current_span but sadly the Instrumented trait in
   29 | // the tracing crate already stole the name for all Sized types
   30 | pub trait StreamTracingExt {
   31 |     /// All calls to poll the stream will be done in the context of the current span (when this method is called)
   32 |     fn stream_in_current_span(self) -> InstrumentedStream<Self>
   33 |     where
   34 |         Self: Stream,
   35 |         Self: Sized;
   36 | 
   37 |     fn stream_in_span(self, span: Span) -> InstrumentedStream<Self>
   38 |     where
   39 |         Self: Stream,
   40 |         Self: Sized;
   41 | }
   42 | 
   43 | impl<S: Stream> StreamTracingExt for S {
   44 |     fn stream_in_current_span(self) -> InstrumentedStream<Self>
   45 |     where
   46 |         Self: Stream,
   47 |         Self: Sized,
   48 |     {
   49 |         self.stream_in_span(Span::current())
   50 |     }
   51 | 
   52 |     fn stream_in_span(self, span: Span) -> InstrumentedStream<Self>
   53 |     where
   54 |         Self: Stream,
   55 |         Self: Sized,
   56 |     {
   57 |         InstrumentedStream { stream: self, span }
   58 |     }
   59 | }
   60 | 
   61 | pub const TRACE_FILE_AUDIT: &str = "lance::file_audit";
   62 | pub const AUDIT_MODE_CREATE: &str = "create";
   63 | pub const AUDIT_MODE_DELETE: &str = "delete";
   64 | pub const AUDIT_MODE_DELETE_UNVERIFIED: &str = "delete_unverified";
   65 | pub const AUDIT_TYPE_DELETION: &str = "deletion";
   66 | pub const AUDIT_TYPE_MANIFEST: &str = "manifest";
   67 | pub const AUDIT_TYPE_INDEX: &str = "index";
   68 | pub const AUDIT_TYPE_DATA: &str = "data";
   69 | pub const AUDIT_TYPE_TRANSACTION: &str = "transaction";
   70 | pub const TRACE_FILE_CREATE: &str = "create";
   71 | pub const TRACE_IO_EVENTS: &str = "lance::io_events";
   72 | pub const IO_TYPE_OPEN_SCALAR: &str = "open_scalar_index";
   73 | pub const IO_TYPE_OPEN_VECTOR: &str = "open_vector_index";
   74 | pub const IO_TYPE_OPEN_FRAG_REUSE: &str = "open_frag_reuse_index";
   75 | pub const IO_TYPE_OPEN_MEM_WAL: &str = "open_mem_wal_index";
   76 | pub const IO_TYPE_LOAD_VECTOR_PART: &str = "load_vector_part";
   77 | pub const IO_TYPE_LOAD_SCALAR_PART: &str = "load_scalar_part";
   78 | pub const TRACE_EXECUTION: &str = "lance::execution";
   79 | pub const EXECUTION_PLAN_RUN: &str = "plan_run";
   80 | pub const TRACE_DATASET_EVENTS: &str = "lance::dataset_events";
   81 | pub const DATASET_WRITING_EVENT: &str = "writing";
   82 | pub const DATASET_COMMITTED_EVENT: &str = "committed";
   83 | pub const DATASET_DROPPING_COLUMN_EVENT: &str = "dropping_column";
   84 | pub const DATASET_DELETING_EVENT: &str = "deleting";
   85 | pub const DATASET_COMPACTING_EVENT: &str = "compacting";
   86 | pub const DATASET_CLEANING_EVENT: &str = "cleaning";
   87 | pub const DATASET_LOADING_EVENT: &str = "loading";
   88 | pub const TRACE_OBJECT_STORE_THROTTLE: &str = "lance::object_store::throttle";
``````
