# Selected Key File: rust/lance-encoding/src/encodings/physical/sequence.rs

Current pin `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`, 2026-10-11. Focused contract ranges: `rust/lance-encoding/src/encodings/physical/sequence.rs:44-277`. Other implementation details require source reading.

SequenceBlockCodec verifies a common descriptor and unchanged payload arity for each chunk. Selection rejects mixed empty/nonempty families, chooses common Constant/Range before comparing other candidates, and ranks candidates by serialized bytes, transform depth, CPU rank and stable rank. Generic binary offsets are used only when their serialized cost beats legacy framing; readers validate buffer counts, zero start, monotonic offsets and exact final byte length.

[Current contract](../../../../../../L3-symbols/refresh-2026-10-11.md) supplies related constraints and ordered task routes. This is static interface verification, not runtime qualification.
