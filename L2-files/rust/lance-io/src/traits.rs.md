# Key File: rust/lance-io/src/traits.rs

**V2.1 selected contract record.** Verified entry/protocol ranges: `24-43,136-177`. The rest of this file has Module Map coverage; this is not a claim of line-by-line analysis. Tests/generated code are excluded. [Module Map](../../../../L1-modules/rust-lance-io.md).

## Responsibility and interfaces

Defines asynchronous range/stream reads and writer finalization.

Reader promises object bytes; higher layers interpret formats.

Default get_stream/get_range_stream materialize through get_all/get_range before wrapping a stream.

Writer shutdown finalizes bytes and returns WriteResult, not a Dataset version.

## Behavior and change boundaries

### Streams

Default Reader stream methods first obtain complete Bytes via get_all or get_range. A stream-shaped return type alone does not guarantee bounded-memory streaming. (rust/lance-io/src/traits.rs:153-175)

## Read next

Use the owning Module Map for callers/callees and the L0 trace for publication/query ordering. Exact implementation details outside the verified ranges require source reading; do not infer stronger validation or rollback guarantees from this record.
