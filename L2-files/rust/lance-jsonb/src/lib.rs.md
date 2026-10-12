# Selected Key File: rust/lance-jsonb/src/lib.rs

Current pin `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`, 2026-10-11. Focused contract ranges: `rust/lance-jsonb/src/lib.rs:6-103`. Other implementation details require source reading.

The new local lance-jsonb crate owns the persisted JSONB interface: parse_value, OwnedJsonb, RawJsonb, from_raw_jsonb and JSONPath. It is adapted upstream code now checked into Lance; only this local surface is mapped here. The declared layout uses container/JEntry headers and requires released-byte compatibility. No external upstream implementation or exhaustive JSONB algorithm review is implied.

[Current contract](../../../../L3-symbols/refresh-2026-10-11.md) supplies related constraints and ordered task routes. This is static interface verification, not runtime qualification.
