# Clarifications to the frozen iteration-85 snapshot

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](L3-symbols/refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

The 176 L2 bodies and 9,717-record catalog remain byte-for-byte frozen. Current contracts and this small correction overlay take precedence over ambiguous historical wording. This is not a new symbol ledger or renewed per-file analysis.

## PackedStructVariablePerValueEncoder row count

Historical wording “retains original child count” means **the row/value count taken from the first child**, not the number of child fields. The source sets `num_values = struct_block.children[0].num_values()` after checking struct validity. The active L1 explanation is corrected. This clarification applies to the [frozen packed codec record](L2-files/rust/lance-encoding/src/encodings/physical/packed.rs.md) and matching entries in the frozen symbol catalog. (rust/lance-encoding/src/encodings/physical/packed.rs:371-379)

Found and resolved during M3 random accuracy verification, iteration 94. No implementation change or frozen-body rewrite.
