# Query planning and execution integration

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-09, `db684d1f0726c00b6defb7963a604a7719e82b5a`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-09.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

**Trust: contract-verified planner/execution boundary; helper files mapped.** Source snapshot `c3c8d6fb505fb437b2b673c5195e1d4b74436b2f`. [Entry](../README.md) · [Scope](../V21-PROTOCOL.md) · [Format](../L3-symbols/format-spec.md).

Provides Lance-specific planning, expression, projection, stream, spill and execution support around DataFusion interfaces. Dataset TableProvider itself is in rust/lance/src/datafusion/dataframe.rs. External DataFusion code is not analyzed.

## Module Map

<a id="rust-lance-datafusion"></a>

### `rust/lance-datafusion/`

Handwritten build/schema integration; generated bindings excluded.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-datafusion/build.rs` | 1-27 | mapped |
<a id="rust-lance-datafusion-src"></a>

### `rust/lance-datafusion/src/`

Planner and SQL/expression conversion; logical expressions/projection; dataframe/aggregate/chunker; execution context, spill and optional Substrait integration. Choose the operation-named file and follow the module facade for feature gates.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-datafusion/src/aggregate.rs` | 1-41 | mapped |
| `rust/lance-datafusion/src/chunker.rs` | 1-566 | mapped |
| `rust/lance-datafusion/src/dataframe.rs` | 1-238 | mapped |
| `rust/lance-datafusion/src/exec.rs` | 1-1268 | Key File (checked ranges) |
| `rust/lance-datafusion/src/expr.rs` | 1-611 | mapped |
| `rust/lance-datafusion/src/lib.rs` | 1-31 | mapped |
| `rust/lance-datafusion/src/logical_expr.rs` | 1-287 | mapped |
| `rust/lance-datafusion/src/planner.rs` | 1-1176 | Key File (checked ranges) |
| `rust/lance-datafusion/src/projection.rs` | 1-529 | mapped |
| `rust/lance-datafusion/src/signed_zero.rs` | 1-396 | mapped |
| `rust/lance-datafusion/src/spill.rs` | 1-668 | mapped |
| `rust/lance-datafusion/src/sql.rs` | 1-111 | mapped |
| `rust/lance-datafusion/src/substrait.rs` | 1-731 | mapped |
| `rust/lance-datafusion/src/udf.rs` | 1-154 | mapped |
| `rust/lance-datafusion/src/utils.rs` | 1-257 | mapped |
<a id="rust-lance-datafusion-src-udf"></a>

### `rust/lance-datafusion/src/udf/`

Lance-specific function implementations registered through udf.rs. Coordinate parsing/type coercion and execution semantics when adding a function.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-datafusion/src/udf/json.rs` | 1-941 | mapped |
<a id="rust-lance-datafusion-src-utils"></a>

### `rust/lance-datafusion/src/utils/`

Shared query integration helpers, mapped by responsibility rather than copied into the KB.

| Source file | Production ranges | Coverage |
|---|---|---|
| `rust/lance-datafusion/src/utils/background_iterator.rs` | 1-120 | mapped |

## Key types and files

### Planner

`rust/lance-datafusion/src/planner.rs` — read `280-350`.

Parses expressions in a schema-aware Lance context.  
Relations are disabled by default; qualified names otherwise mean struct field access.  
Column lookup prefers an exact schema name before case-insensitive matching.  
Use this boundary for expression-name behavior; physical pushdown is a separate Dataset provider/scanner concern.

[Selected contract record](../L2-files/rust/lance-datafusion/src/planner.rs.md).

### execute_plan / LanceExecutionOptions

`rust/lance-datafusion/src/exec.rs` — read `721-761`.

Turns a physical ExecutionPlan into a RecordBatch stream.  
Single-partition plans execute directly; ordered multi-partition output uses SortPreservingMergeExec.  
Unordered multi-partition output uses CoalescePartitionsExec.  
The final stream reports plan metrics through its completion callback.

[Selected contract record](../L2-files/rust/lance-datafusion/src/exec.rs.md).

## Contracts and extension boundaries

**Provider pushdown.** LanceTableProvider combines supplied filters with AND, applies projection/system columns, limit and ordering to Scanner, then creates a plan with the caller session. It reports Exact filter pushdown. (rust/lance/src/datafusion/dataframe.rs:132-197)

**Output ordering.** execute_plan preserves known output ordering when merging multiple partitions; blindly coalescing them would scramble that ordering. (rust/lance-datafusion/src/exec.rs:721-761)

**Identifier resolution.** Planner defaults enable_relations=false. Exact field-name matching wins, then ASCII-insensitive matching; an unknown name is retained for later resolution. (rust/lance-datafusion/src/planner.rs:280-350)

M3 supplies the complete API-family/protocol decision tables and recipe navigation. This Module Map establishes ownership and the checked seams; it does not claim runtime qualification.


## Public API route

[Public API family contracts and declaration directories](../L3-symbols/public-api.md) distinguish source-declared interfaces from checked implementation behavior and provide binding-to-engine read sets.

## Source refresh — 2026-10-07

Pinned `84d1681e07af565837f2d97e72ff1b8b040cd15c`. The entries below have updated source ranges. Their directory responsibilities remain as mapped; behavior changes are governed by [current delta contracts](../L3-symbols/refresh-2026-10-07.md). Ordinary files remain mapped, and Java/peripherals remain mapped only.

- `rust/lance-datafusion/src/logical_expr.rs`
- `rust/lance-datafusion/src/planner.rs`
- `rust/lance-datafusion/src/projection.rs`

## Source refresh — 2026-10-09

Pin `db684d1f0726c00b6defb7963a604a7719e82b5a`. [Changed contracts](../L3-symbols/refresh-2026-10-09.md) cover affected behavior. The following entries have current production ranges; unchanged directory responsibilities and mapped-only limits remain.

- `rust/lance-datafusion/src/logical_expr.rs`
- `rust/lance-datafusion/src/planner.rs`

## Source refresh map — 2026-10-11

Current source `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`. [Changed contracts](../L3-symbols/refresh-2026-10-11.md). Existing directory responsibilities remain; declarations below locate changed boundaries.

### `rust/lance-datafusion/src/udf/json.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `JsonbType` (rust/lance-datafusion/src/udf/json.rs:19-19), `from_u8` (rust/lance-datafusion/src/udf/json.rs:31-31), `as_u8` (rust/lance-datafusion/src/udf/json.rs:45-45), `columnar_to_arrays` (rust/lance-datafusion/src/udf/json.rs:59-59), `execution_error` (rust/lance-datafusion/src/udf/json.rs:69-69), `validate_arg_count` (rust/lance-datafusion/src/udf/json.rs:74-74), `extract_jsonb_array` (rust/lance-datafusion/src/udf/json.rs:89-89), `extract_string_array` (rust/lance-datafusion/src/udf/json.rs:97-97).

