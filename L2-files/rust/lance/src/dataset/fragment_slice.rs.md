# Selected Key File: rust/lance/src/dataset/fragment_slice.rs

Current pin `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`, 2026-10-11. Focused contract ranges: `rust/lance/src/dataset/fragment_slice.rs:11-92`. Other implementation details require source reading.

FragmentSlice is a physical half-open range (fragment_id, row_offset, row_count), tied to the scanner snapshot. Checked end arithmetic rejects out-of-bounds selections, including invalid empty slices; overlaps union. Deletions do not compact physical offsets. Scan order determines output, not slice input order. Both logical row-ID masks and physical restrictions apply if supplied.

[Current contract](../../../../../L3-symbols/refresh-2026-10-11.md) supplies related constraints and ordered task routes. This is static interface verification, not runtime qualification.
