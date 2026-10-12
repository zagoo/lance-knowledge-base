# Selected Key File: rust/lance/src/dataset/mem_wal/index/plugin.rs

Current pin `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`, 2026-10-11. Focused contract ranges: `rust/lance/src/dataset/mem_wal/index/plugin.rs:38-706`. Other implementation details require source reading.

MemIndexPlugin resolves base-index settings, validates before writer admission and creates per-memtable instances. Identity compares name, columns, field IDs, plugin type/version/details and params. Registry details names must be bare; add rejects duplicate claims, replace is explicit. IO belongs in resolve; create must succeed for a validated spec.

[Current contract](../../../../../../../L3-symbols/refresh-2026-10-11.md) supplies related constraints and ordered task routes. This is static interface verification, not runtime qualification.
