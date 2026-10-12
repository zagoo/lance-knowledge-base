# lance-datafusion: public declaration and documented-contract directory

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-09, `db684d1f0726c00b6defb7963a604a7719e82b5a`: source coordinates updated. [Changed contracts](../refresh-2026-10-09.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

**Trust: declared source interface; body behavior is verified only where the linked family/protocol contract says so.** This catalog supplies exact argument/type entry points and the source author's first documentation paragraph. It is not an inferred call graph or a second symbol ledger. Rust `pub` can occur under a private/feature-gated module; confirm re-export and cfg boundaries before changing an external API. Trait method contracts and enum variants are reached through the trait/type entry. Python inherited external-library APIs are outside direct-source scope.

[Family contracts](../public-api.md) · [Module Map](../../L1-modules/rust-lance-datafusion.md) · [Scope](../../V21-PROTOCOL.md)

<a id="source-rust-lance-datafusion-src-aggregate-rs"></a>

## `rust/lance-datafusion/src/aggregate.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct Aggregate` | rust/lance-datafusion/src/aggregate.rs:12-12 | Aggregate specification with group by and aggregate expressions. |
| `pub group_by: Vec&lt;Expr&gt;,` | rust/lance-datafusion/src/aggregate.rs:14-14 | Expressions to group by (e.g., column references). |
| `pub aggregates: Vec&lt;Expr&gt;,` | rust/lance-datafusion/src/aggregate.rs:17-17 | Aggregate function expressions (e.g., SUM, COUNT, AVG). Use `.alias()` on the expression to set output column names. |
| `pub fn new(group_by: Vec&lt;Expr&gt;, aggregates: Vec&lt;Expr&gt;) -&gt; Self` | rust/lance-datafusion/src/aggregate.rs:22-22 | Create a new Aggregate. |
| `pub fn required_columns(&self) -&gt; Vec&lt;String&gt;` | rust/lance-datafusion/src/aggregate.rs:32-32 | Compute column names required by this aggregate. |

<a id="source-rust-lance-datafusion-src-chunker-rs"></a>

## `rust/lance-datafusion/src/chunker.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn break_stream( stream: SendableRecordBatchStream, max_chunk_size: usize, ) -&gt; Pin&lt;Box&lt;dyn Stream&lt;Item = Result&lt;RecordBatch&gt;&gt; + Send&gt;&gt;` | rust/lance-datafusion/src/chunker.rs:196-199 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn chunk_stream( stream: SendableRecordBatchStream, chunk_size: usize, ) -&gt; Pin&lt;Box&lt;dyn Stream&lt;Item = Result&lt;Vec&lt;RecordBatch&gt;&gt;&gt; + Send&gt;&gt;` | rust/lance-datafusion/src/chunker.rs:224-227 | Given a stream of record batches, this will yield batches of a fixed size. |
| `pub fn break_stream_with_sizes&lt;I&gt;( stream: SendableRecordBatchStream, output_sizes: I, ) -&gt; Pin&lt;Box&lt;dyn Stream&lt;Item = Result&lt;Vec&lt;RecordBatch&gt;&gt;&gt; + Send&gt;&gt; where I: IntoIterator&lt;Item = usize&gt;, I::IntoIter: Send + 'static,` | rust/lance-datafusion/src/chunker.rs:256-263 | Preserve input batch boundaries while inserting the requested row boundaries. |
| `pub fn chunk_stream_with_sizes&lt;I&gt;( stream: SendableRecordBatchStream, output_sizes: I, ) -&gt; Pin&lt;Box&lt;dyn Stream&lt;Item = Result&lt;Vec&lt;RecordBatch&gt;&gt;&gt; + Send&gt;&gt; where I: IntoIterator&lt;Item = usize&gt;, I::IntoIter: Send + 'static,` | rust/lance-datafusion/src/chunker.rs:364-371 | Given a stream of record batches, yield chunks with the requested row counts. |
| `pub fn chunk_concat_stream( stream: SendableRecordBatchStream, chunk_size: usize, ) -&gt; SendableRecordBatchStream` | rust/lance-datafusion/src/chunker.rs:449-452 | Given a stream of record batches, this will yield batches of a fixed size. |
| `pub struct StrictBatchSizeStream&lt;S&gt;` | rust/lance-datafusion/src/chunker.rs:474-474 | Given a stream of record batches, this will yield batches of a fixed size. |
| `pub fn new(inner: S, batch_size: usize) -&gt; Self` | rust/lance-datafusion/src/chunker.rs:481-481 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-datafusion-src-dataframe-rs"></a>

## `rust/lance-datafusion/src/dataframe.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub trait DataFrameExt` | rust/lance-datafusion/src/dataframe.rs:22-22 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct BatchStreamGrouper` | rust/lance-datafusion/src/dataframe.rs:68-68 | A stream of record batch groups. |
| `pub fn new(input: SendableRecordBatchStream, partition_column: String) -&gt; Self` | rust/lance-datafusion/src/dataframe.rs:98-98 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn schema(&self) -&gt; &Arc&lt;Schema&gt;` | rust/lance-datafusion/src/dataframe.rs:119-119 | Get the output schema of the stream. |

<a id="source-rust-lance-datafusion-src-exec-rs"></a>

## `rust/lance-datafusion/src/exec.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct OneShotExec` | rust/lance-datafusion/src/exec.rs:74-74 | An source execution node created from an existing stream |
| `pub fn new(stream: SendableRecordBatchStream) -&gt; Self` | rust/lance-datafusion/src/exec.rs:84-84 | Create a new instance from a given stream |
| `pub fn from_batch(batch: RecordBatch) -&gt; Self` | rust/lance-datafusion/src/exec.rs:98-98 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(input: Arc&lt;dyn ExecutionPlan&gt;, span: Span) -&gt; Self` | rust/lance-datafusion/src/exec.rs:211-211 | No standalone documentation summary; use the family contract and source entry. |
| `pub type ExecutionStatsCallback = Arc&lt;dyn Fn(&ExecutionSummaryCounts) + Send + Sync&gt;;` | rust/lance-datafusion/src/exec.rs:279-279 | Callback for reporting statistics after a scan |
| `pub struct LanceExecutionOptions` | rust/lance-datafusion/src/exec.rs:282-282 | No standalone documentation summary; use the family contract and source entry. |
| `pub use_spilling: bool,` | rust/lance-datafusion/src/exec.rs:283-283 | No standalone documentation summary; use the family contract and source entry. |
| `pub mem_pool_size: Option&lt;u64&gt;,` | rust/lance-datafusion/src/exec.rs:284-284 | No standalone documentation summary; use the family contract and source entry. |
| `pub max_temp_directory_size: Option&lt;u64&gt;,` | rust/lance-datafusion/src/exec.rs:285-285 | No standalone documentation summary; use the family contract and source entry. |
| `pub batch_size: Option&lt;usize&gt;,` | rust/lance-datafusion/src/exec.rs:286-286 | No standalone documentation summary; use the family contract and source entry. |
| `pub target_partition: Option&lt;usize&gt;,` | rust/lance-datafusion/src/exec.rs:287-287 | No standalone documentation summary; use the family contract and source entry. |
| `pub execution_stats_callback: Option&lt;ExecutionStatsCallback&gt;,` | rust/lance-datafusion/src/exec.rs:288-288 | No standalone documentation summary; use the family contract and source entry. |
| `pub skip_logging: bool,` | rust/lance-datafusion/src/exec.rs:289-289 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn mem_pool_size(&self) -&gt; u64` | rust/lance-datafusion/src/exec.rs:327-327 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn max_temp_directory_size(&self) -&gt; u64` | rust/lance-datafusion/src/exec.rs:342-342 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn use_spilling(&self) -&gt; bool` | rust/lance-datafusion/src/exec.rs:359-359 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new_session_context(options: &LanceExecutionOptions) -&gt; SessionContext` | rust/lance-datafusion/src/exec.rs:373-373 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn get_session_context(options: &LanceExecutionOptions) -&gt; SessionContext` | rust/lance-datafusion/src/exec.rs:449-449 | Reuses unbounded sessions, while giving each spilling caller a fresh bounded memory pool so concurrent sorts cannot consume each other's headroom. |
| `pub struct ExecutionSummaryCounts` | rust/lance-datafusion/src/exec.rs:508-508 | No standalone documentation summary; use the family contract and source entry. |
| `pub iops: usize,` | rust/lance-datafusion/src/exec.rs:510-510 | The number of I/O operations performed |
| `pub requests: usize,` | rust/lance-datafusion/src/exec.rs:513-513 | The number of requests made to the storage layer (may be larger or smaller than iops depending on coalescing configuration) |
| `pub bytes_read: usize,` | rust/lance-datafusion/src/exec.rs:515-515 | The number of bytes read during the execution of the plan |
| `pub indices_loaded: usize,` | rust/lance-datafusion/src/exec.rs:517-517 | The number of top-level indices loaded |
| `pub parts_loaded: usize,` | rust/lance-datafusion/src/exec.rs:519-519 | The number of index partitions loaded |
| `pub index_comparisons: usize,` | rust/lance-datafusion/src/exec.rs:521-521 | The number of index comparisons performed (the exact meaning depends on the index type) |
| `pub all_counts: HashMap&lt;String, usize&gt;,` | rust/lance-datafusion/src/exec.rs:528-528 | Additional metrics for more detailed statistics. These are subject to change in the future and should only be used for debugging purposes. |
| `pub all_times: HashMap&lt;String, usize&gt;,` | rust/lance-datafusion/src/exec.rs:534-534 | Additional time metrics for more detailed statistics, stored in nanoseconds. Operator baseline times use `&lt;ExecutionPlan::name()&gt;_elapsed_compute` keys. Timings may be nested and accumulate across concurrent work; they are not exclusive stages that can be added to recover query wall time. These are subject to change in the future and should only be used for debugging purposes. |
| `pub fn index_cache_hits(&self) -&gt; usize` | rust/lance-datafusion/src/exec.rs:565-565 | Number of index cache page lookups where the loader was not executed (per-page granularity). |
| `pub fn index_cache_misses(&self) -&gt; usize` | rust/lance-datafusion/src/exec.rs:580-580 | Number of index cache page lookups that had to execute the loader (per-page granularity). |
| `pub fn index_cache_hit_ratio(&self) -&gt; f32` | rust/lance-datafusion/src/exec.rs:596-596 | Ratio of index cache hits to total lookups. Returns `0.0` when no lookups were recorded in this scan. |
| `pub fn collect_execution_metrics(node: &dyn ExecutionPlan, counts: &mut ExecutionSummaryCounts)` | rust/lance-datafusion/src/exec.rs:609-609 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn execute_plan( plan: Arc&lt;dyn ExecutionPlan&gt;, options: LanceExecutionOptions, ) -&gt; Result&lt;SendableRecordBatchStream&gt;` | rust/lance-datafusion/src/exec.rs:721-724 | Executes a plan using default session & runtime configuration |
| `pub async fn analyze_plan( plan: Arc&lt;dyn ExecutionPlan&gt;, options: LanceExecutionOptions, ) -&gt; Result&lt;String&gt;` | rust/lance-datafusion/src/exec.rs:763-766 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn analyze_plan_with_context( plan: Arc&lt;dyn ExecutionPlan&gt;, options: LanceExecutionOptions, task_context: Option&lt;Arc&lt;TaskContext&gt;&gt;, ) -&gt; Result&lt;String&gt;` | rust/lance-datafusion/src/exec.rs:778-782 | Analyze a plan, optionally under a caller-provided [`TaskContext`]. |
| `pub fn format_plan(plan: Arc&lt;dyn ExecutionPlan&gt;) -&gt; String` | rust/lance-datafusion/src/exec.rs:812-812 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait SessionContextExt` | rust/lance-datafusion/src/exec.rs:961-961 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct OneShotPartitionStream` | rust/lance-datafusion/src/exec.rs:971-971 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(data: SendableRecordBatchStream) -&gt; Self` | rust/lance-datafusion/src/exec.rs:987-987 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn provider_to_stream( provider: Arc&lt;dyn TableProvider&gt;, ) -&gt; Result&lt;SendableRecordBatchStream&gt;` | rust/lance-datafusion/src/exec.rs:1050-1052 | Scan a [`TableProvider`] into a single-partition [`SendableRecordBatchStream`]. |
| `pub struct StrictBatchSizeExec` | rust/lance-datafusion/src/exec.rs:1065-1065 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(input: Arc&lt;dyn ExecutionPlan&gt;, batch_size: usize) -&gt; Self` | rust/lance-datafusion/src/exec.rs:1071-1071 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct HardCapBatchSizeExec` | rust/lance-datafusion/src/exec.rs:1169-1169 | Exec node that rechunks batches so no output batch exceeds `max_bytes`. |
| `pub fn new(input: Arc&lt;dyn ExecutionPlan&gt;, max_bytes: usize) -&gt; Self` | rust/lance-datafusion/src/exec.rs:1175-1175 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-datafusion-src-expr-rs"></a>

## `rust/lance-datafusion/src/expr.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn safe_coerce_scalar(value: &ScalarValue, ty: &DataType) -&gt; Option&lt;ScalarValue&gt;` | rust/lance-datafusion/src/expr.rs:108-108 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-datafusion-src-lib-rs"></a>

## `rust/lance-datafusion/src/lib.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod aggregate;` | rust/lance-datafusion/src/lib.rs:4-4 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod chunker;` | rust/lance-datafusion/src/lib.rs:5-5 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod dataframe;` | rust/lance-datafusion/src/lib.rs:6-6 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod datagen;` | rust/lance-datafusion/src/lib.rs:8-8 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod exec;` | rust/lance-datafusion/src/lib.rs:9-9 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod expr;` | rust/lance-datafusion/src/lib.rs:10-10 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod logical_expr;` | rust/lance-datafusion/src/lib.rs:11-11 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod planner;` | rust/lance-datafusion/src/lib.rs:12-12 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod projection;` | rust/lance-datafusion/src/lib.rs:13-13 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod pb` | rust/lance-datafusion/src/lib.rs:14-14 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod spill;` | rust/lance-datafusion/src/lib.rs:26-26 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod sql;` | rust/lance-datafusion/src/lib.rs:27-27 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod substrait;` | rust/lance-datafusion/src/lib.rs:29-29 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod udf;` | rust/lance-datafusion/src/lib.rs:30-30 | No standalone documentation summary; use the family contract and source entry. |
| `pub mod utils;` | rust/lance-datafusion/src/lib.rs:31-31 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-datafusion-src-logical-expr-rs"></a>

## `rust/lance-datafusion/src/logical_expr.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn get_as_string_scalar_opt(expr: &Expr) -&gt; Option&lt;&str&gt;` | rust/lance-datafusion/src/logical_expr.rs:31-31 | A simple helper function that interprets an Expr as a string scalar or returns None if it is not. |
| `pub fn resolve_column_type(expr: &Expr, schema: &Schema) -&gt; Option&lt;DataType&gt;` | rust/lance-datafusion/src/logical_expr.rs:43-43 | Given a column or nested `get_field` expression, get the data type of the referenced field in the schema. |
| `pub fn resolve_expr(expr: &Expr, schema: &Schema) -&gt; Result&lt;Expr&gt;` | rust/lance-datafusion/src/logical_expr.rs:98-98 | Resolve logical expression `expr`. |
| `pub fn coerce_expr(expr: &Expr, dtype: &DataType) -&gt; Result&lt;Expr&gt;` | rust/lance-datafusion/src/logical_expr.rs:190-190 | Coerce expression of literals to column type. |
| `pub fn coerce_filter_type_to_boolean(expr: Expr) -&gt; Expr` | rust/lance-datafusion/src/logical_expr.rs:207-207 | Coerce logical expression for filters to boolean. |
| `pub fn field_path_to_expr(field_path: &str) -&gt; Result&lt;Expr&gt;` | rust/lance-datafusion/src/logical_expr.rs:266-266 | Convert a field path string into a DataFusion expression. |

<a id="source-rust-lance-datafusion-src-planner-rs"></a>

## `rust/lance-datafusion/src/planner.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn new() -&gt; Self` | rust/lance-datafusion/src/planner.rs:94-94 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct Planner` | rust/lance-datafusion/src/planner.rs:280-280 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn new(schema: SchemaRef) -&gt; Self` | rust/lance-datafusion/src/planner.rs:287-287 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn with_enable_relations(mut self, enable_relations: bool) -&gt; Self` | rust/lance-datafusion/src/planner.rs:300-300 | If passed with `true`, then the first identifier in column reference is parsed as the relation. For example, `table.field.inner` will be read as the nested field `field.inner` (`inner` on struct field `field`) on the `table` relation. If `false` (the default), then no relations are used and all identifiers are assumed to be a nested column path. |
| `pub fn parse_filter(&self, filter: &str) -&gt; Result&lt;Expr&gt;` | rust/lance-datafusion/src/planner.rs:951-951 | Create Logical [Expr] from a SQL filter clause. |
| `pub fn parse_expr(&self, expr: &str) -&gt; Result&lt;Expr&gt;` | rust/lance-datafusion/src/planner.rs:967-967 | Create Logical [Expr] from a SQL expression. |
| `pub fn optimize_expr(&self, expr: Expr) -&gt; Result&lt;Expr&gt;` | rust/lance-datafusion/src/planner.rs:1020-1020 | Optimize the filter expression and coerce data types. |
| `pub fn create_physical_expr(&self, expr: &Expr) -&gt; Result&lt;Arc&lt;dyn PhysicalExpr&gt;&gt;` | rust/lance-datafusion/src/planner.rs:1094-1094 | Create the [`PhysicalExpr`] from a logical [`Expr`] |
| `pub fn create_physical_expr_with_session( &self, expr: &Expr, session: &dyn Session, ) -&gt; Result&lt;Arc&lt;dyn PhysicalExpr&gt;&gt;` | rust/lance-datafusion/src/planner.rs:1104-1108 | Create a [`PhysicalExpr`] using the caller's DataFusion session. |
| `pub fn column_names_in_expr(expr: &Expr) -&gt; Vec&lt;String&gt;` | rust/lance-datafusion/src/planner.rs:1119-1119 | Collect the columns in the expression. |

<a id="source-rust-lance-datafusion-src-projection-rs"></a>

## `rust/lance-datafusion/src/projection.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct OutputColumn` | rust/lance-datafusion/src/projection.rs:204-204 | No standalone documentation summary; use the family contract and source entry. |
| `pub expr: Expr,` | rust/lance-datafusion/src/projection.rs:206-206 | The expression that represents the output column |
| `pub name: String,` | rust/lance-datafusion/src/projection.rs:208-208 | The name of the output column |
| `pub struct ProjectionPlan` | rust/lance-datafusion/src/projection.rs:212-212 | No standalone documentation summary; use the family contract and source entry. |
| `pub physical_projection: Projection,` | rust/lance-datafusion/src/projection.rs:214-214 | The physical schema that must be loaded from the dataset |
| `pub must_add_row_offset: bool,` | rust/lance-datafusion/src/projection.rs:217-217 | Needs the row address converted into a row offset |
| `pub requested_output_expr: Vec&lt;OutputColumn&gt;,` | rust/lance-datafusion/src/projection.rs:220-220 | The desired output columns |
| `pub fn from_expressions( base: Arc&lt;dyn Projectable&gt;, columns: &[(impl AsRef&lt;str&gt;, impl AsRef&lt;str&gt;)], ) -&gt; Result&lt;Self&gt;` | rust/lance-datafusion/src/projection.rs:254-257 | Set the projection from SQL expressions |
| `pub fn from_schema(base: Arc&lt;dyn Projectable&gt;, projection: &Schema) -&gt; Result&lt;Self&gt;` | rust/lance-datafusion/src/projection.rs:297-297 | Set the projection from a schema |
| `pub fn full(base: Arc&lt;dyn Projectable&gt;) -&gt; Result&lt;Self&gt;` | rust/lance-datafusion/src/projection.rs:382-382 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn to_physical_exprs( &self, current_schema: &ArrowSchema, ) -&gt; Result&lt;Vec&lt;(Arc&lt;dyn PhysicalExpr&gt;, String)&gt;&gt;` | rust/lance-datafusion/src/projection.rs:412-415 | Convert the projection to a list of physical expressions |
| `pub fn include_row_id(&mut self)` | rust/lance-datafusion/src/projection.rs:440-440 | Include the row id in the output |
| `pub fn include_row_addr(&mut self)` | rust/lance-datafusion/src/projection.rs:455-455 | Include the row address in the output |
| `pub fn has_output_cols(&self) -&gt; bool` | rust/lance-datafusion/src/projection.rs:473-473 | Check if the projection has any output columns |
| `pub fn output_schema(&self) -&gt; Result&lt;ArrowSchema&gt;` | rust/lance-datafusion/src/projection.rs:477-477 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn project_batch(&self, batch: RecordBatch) -&gt; Result&lt;RecordBatch&gt;` | rust/lance-datafusion/src/projection.rs:499-499 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-datafusion-src-signed-zero-rs"></a>

## `rust/lance-datafusion/src/signed_zero.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn rewrite_signed_zero_comparisons(expr: Expr) -&gt; Result&lt;Expr&gt;` | rust/lance-datafusion/src/signed_zero.rs:45-45 | Rewrite every comparison against a floating point zero literal into the form that Arrow's total-order kernels answer the way IEEE 754 and SQL define it. |
| `pub fn normalize_zero_comparisons( expr: Expr, simplify: &dyn Fn(Expr) -&gt; DFResult&lt;Expr&gt;, ) -&gt; Result&lt;Expr&gt;` | rust/lance-datafusion/src/signed_zero.rs:86-89 | Fold each zero-sensitive comparison's own operands and rewrite it, bottom-up, before anything above it has a chance to fold. |

<a id="source-rust-lance-datafusion-src-spill-rs"></a>

## `rust/lance-datafusion/src/spill.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn create_replay_spill( path: std::path::PathBuf, schema: Arc&lt;Schema&gt;, memory_limit: usize, ) -&gt; (SpillSender, SpillReceiver)` | rust/lance-datafusion/src/spill.rs:43-47 | Start a spill of Arrow data to a file that can be read later multiple times. |
| `pub async fn spilling_table_provider( mut source: SendableRecordBatchStream, memory_limit: usize, ) -&gt; Result&lt;Arc&lt;dyn TableProvider&gt;, DataFusionError&gt;` | rust/lance-datafusion/src/spill.rs:117-120 | Wrap a one-shot [`SendableRecordBatchStream`] in a re-scannable [`TableProvider`]. |
| `pub struct SpillReceiver` | rust/lance-datafusion/src/spill.rs:203-203 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn read(&self) -&gt; SendableRecordBatchStream` | rust/lance-datafusion/src/spill.rs:217-217 | Returns a stream of batches from the spill. The stream will emit batches as they are written to the spill. If the spill has already been finished, the stream will emit all batches in the spill. |
| `pub batches_read: usize,` | rust/lance-datafusion/src/spill.rs:234-234 | No standalone documentation summary; use the family contract and source entry. |
| `pub struct SpillSender` | rust/lance-datafusion/src/spill.rs:325-325 | The sender side of the spill. This is used to write batches to the spill. |
| `pub async fn write(&mut self, batch: RecordBatch) -&gt; Result&lt;(), DataFusionError&gt;` | rust/lance-datafusion/src/spill.rs:480-480 | Write a batch to the spill. |
| `pub fn send_error(&mut self, err: DataFusionError)` | rust/lance-datafusion/src/spill.rs:544-544 | Send an error to the spill. This will be sent to all readers of the spill. |
| `pub async fn finish(&mut self) -&gt; Result&lt;(), DataFusionError&gt;` | rust/lance-datafusion/src/spill.rs:553-553 | Complete the spill write. This will finalize the Arrow IPC stream file. The file will remain available for reading until the spill is dropped. |
| `pub async fn open(path: PathBuf, schema: Arc&lt;Schema&gt;) -&gt; Result&lt;Self, ArrowError&gt;` | rust/lance-datafusion/src/spill.rs:606-606 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn write(&self, batch: RecordBatch) -&gt; Result&lt;(), ArrowError&gt;` | rust/lance-datafusion/src/spill.rs:618-618 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn finish(self) -&gt; Result&lt;(), ArrowError&gt;` | rust/lance-datafusion/src/spill.rs:629-629 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn open(path: PathBuf) -&gt; Result&lt;Self, ArrowError&gt;` | rust/lance-datafusion/src/spill.rs:645-645 | No standalone documentation summary; use the family contract and source entry. |
| `pub async fn read(&self) -&gt; Result&lt;Option&lt;RecordBatch&gt;, ArrowError&gt;` | rust/lance-datafusion/src/spill.rs:657-657 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-datafusion-src-substrait-rs"></a>

## `rust/lance-datafusion/src/substrait.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub fn prune_schema_for_substrait(schema: &ArrowSchema) -&gt; ArrowSchema` | rust/lance-datafusion/src/substrait.rs:47-47 | Removes top-level fields that contain data types that the Substrait producer cannot encode (currently only FixedSizeList). |
| `pub fn encode_substrait( expr: Expr, schema: Arc&lt;ArrowSchema&gt;, state: &SessionState, ) -&gt; Result&lt;Vec&lt;u8&gt;&gt;` | rust/lance-datafusion/src/substrait.rs:67-71 | Convert a DF Expr into a Substrait ExtendedExpressions message |
| `pub async fn parse_substrait( expr: &[u8], input_schema: Arc&lt;ArrowSchema&gt;, state: &SessionState, ) -&gt; Result&lt;Expr&gt;` | rust/lance-datafusion/src/substrait.rs:473-477 | Convert a Substrait ExtendedExpressions message into a DF Expr |
| `pub async fn parse_substrait_aggregate( bytes: &[u8], input_schema: Arc&lt;ArrowSchema&gt;, state: &SessionState, ) -&gt; Result&lt;Aggregate&gt;` | rust/lance-datafusion/src/substrait.rs:552-556 | Parse Substrait Plan bytes containing an AggregateRel. |
| `pub async fn parse_aggregate_rel_with_extensions( aggregate_rel: &AggregateRel, input_schema: Arc&lt;ArrowSchema&gt;, state: &SessionState, extensions: &Extensions, ) -&gt; Result&lt;Aggregate&gt;` | rust/lance-datafusion/src/substrait.rs:613-618 | Parse an AggregateRel proto with provided extensions. |
| `pub async fn parse_aggregate_rel( aggregate_rel: &AggregateRel, input_schema: Arc&lt;ArrowSchema&gt;, state: &SessionState, ) -&gt; Result&lt;Aggregate&gt;` | rust/lance-datafusion/src/substrait.rs:628-632 | Parse an AggregateRel proto with default extensions. |

<a id="source-rust-lance-datafusion-src-udf-rs"></a>

## `rust/lance-datafusion/src/udf.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod json;` | rust/lance-datafusion/src/udf.rs:13-13 | No standalone documentation summary; use the family contract and source entry. |
| `pub fn register_functions(ctx: &SessionContext)` | rust/lance-datafusion/src/udf.rs:16-16 | Register UDF functions to datafusion context. |
| `pub static CONTAINS_TOKENS_UDF: LazyLock&lt;ScalarUDF&gt; = LazyLock::new(contains_tokens);` | rust/lance-datafusion/src/udf.rs:153-153 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-datafusion-src-udf-json-rs"></a>

## `rust/lance-datafusion/src/udf/json.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub enum JsonbType` | rust/lance-datafusion/src/udf/json.rs:19-19 | Represents the type of a JSONB value |
| `pub fn from_u8(value: u8) -&gt; Option&lt;Self&gt;` | rust/lance-datafusion/src/udf/json.rs:31-31 | Convert from u8 value |
| `pub fn as_u8(self) -&gt; u8` | rust/lance-datafusion/src/udf/json.rs:45-45 | Convert to u8 value for storage in Arrow arrays |
| `pub fn columnar_to_arrays(args: &[ColumnarValue]) -&gt; Vec&lt;ArrayRef&gt;` | rust/lance-datafusion/src/udf/json.rs:59-59 | Convert ColumnarValue arguments to ArrayRef vector |
| `pub fn execution_error(msg: impl Into&lt;String&gt;) -&gt; DataFusionError` | rust/lance-datafusion/src/udf/json.rs:69-69 | Create DataFusionError for execution failures (simplified error wrapping) |
| `pub fn validate_arg_count( args: &[ArrayRef], expected: usize, function_name: &str, ) -&gt; Result&lt;()&gt;` | rust/lance-datafusion/src/udf/json.rs:74-78 | Validate argument count for UDF |
| `pub fn extract_jsonb_array(args: &[ArrayRef]) -&gt; Result&lt;&LargeBinaryArray&gt;` | rust/lance-datafusion/src/udf/json.rs:89-89 | Extract and validate LargeBinaryArray from first argument |
| `pub fn extract_string_array(args: &[ArrayRef], arg_index: usize) -&gt; Result&lt;&StringArray&gt;` | rust/lance-datafusion/src/udf/json.rs:97-97 | Extract and validate StringArray from specified argument |
| `pub fn get_string_value_at(string_array: &StringArray, index: usize) -&gt; Option&lt;&str&gt;` | rust/lance-datafusion/src/udf/json.rs:107-107 | Get string value at index, handling scalar broadcast case When a scalar is converted to an array, it becomes a single-element array This function handles accessing that value repeatedly for all rows |
| `pub fn get_json_value_by_key( raw_jsonb: &lance_jsonb::RawJsonb, key: &str, ) -&gt; Result&lt;Option&lt;lance_jsonb::OwnedJsonb&gt;&gt;` | rust/lance-datafusion/src/udf/json.rs:119-122 | Get a JSON field or array element by key. |
| `pub fn parse_json_path(path: &str) -&gt; Result&lt;lance_jsonb::jsonpath::JsonPath&lt;'_&gt;&gt;` | rust/lance-datafusion/src/udf/json.rs:140-140 | Parse JSONPath with proper error handling (no false returns) |
| `pub fn json_extract_udf() -&gt; ScalarUDF` | rust/lance-datafusion/src/udf/json.rs:229-229 | Create the json_extract UDF for extracting JSONPath from JSON data |
| `pub fn json_extract_with_type_udf() -&gt; ScalarUDF` | rust/lance-datafusion/src/udf/json.rs:249-249 | Create the json_extract_with_type UDF that returns JSONB bytes with type information |
| `pub fn json_exists_udf() -&gt; ScalarUDF` | rust/lance-datafusion/src/udf/json.rs:429-429 | Create the json_exists UDF for checking if a JSONPath exists |
| `pub fn json_get_udf() -&gt; ScalarUDF` | rust/lance-datafusion/src/udf/json.rs:491-491 | Create the json_get UDF for getting a field value as JSON string |
| `pub fn json_get_string_udf() -&gt; ScalarUDF` | rust/lance-datafusion/src/udf/json.rs:544-544 | Create the json_get_string UDF for getting a string value |
| `pub fn json_get_int_udf() -&gt; ScalarUDF` | rust/lance-datafusion/src/udf/json.rs:600-600 | Create the json_get_int UDF for getting an integer value |
| `pub fn json_get_float_udf() -&gt; ScalarUDF` | rust/lance-datafusion/src/udf/json.rs:656-656 | Create the json_get_float UDF for getting a float value |
| `pub fn json_get_bool_udf() -&gt; ScalarUDF` | rust/lance-datafusion/src/udf/json.rs:712-712 | Create the json_get_bool UDF for getting a boolean value |
| `pub fn json_array_contains_udf() -&gt; ScalarUDF` | rust/lance-datafusion/src/udf/json.rs:769-769 | Create the json_array_contains UDF for checking if array contains a value |
| `pub fn json_array_length_udf() -&gt; ScalarUDF` | rust/lance-datafusion/src/udf/json.rs:860-860 | Create the json_array_length UDF for getting array length |


<a id="source-rust-lance-datafusion-src-utils-rs"></a>

## `rust/lance-datafusion/src/utils.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub mod background_iterator;` | rust/lance-datafusion/src/utils.rs:27-27 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait StreamingWriteSource: Send` | rust/lance-datafusion/src/utils.rs:35-35 | A trait for [`RecordBatch`] iterators, readers and streams that can be converted to a concrete stream type [`SendableRecordBatchStream`]. |
| `pub fn reader_to_stream(batches: Box&lt;dyn RecordBatchReader + Send&gt;) -&gt; SendableRecordBatchStream` | rust/lance-datafusion/src/utils.rs:144-144 | Convert reader to a stream. |
| `pub trait MetricsExt` | rust/lance-datafusion/src/utils.rs:155-155 | No standalone documentation summary; use the family contract and source entry. |
| `pub trait ExecutionPlanMetricsSetExt` | rust/lance-datafusion/src/utils.rs:198-198 | No standalone documentation summary; use the family contract and source entry. |
| `pub const IOPS_METRIC: &str = "iops";` | rust/lance-datafusion/src/utils.rs:240-240 | No standalone documentation summary; use the family contract and source entry. |
| `pub const REQUESTS_METRIC: &str = "requests";` | rust/lance-datafusion/src/utils.rs:241-241 | No standalone documentation summary; use the family contract and source entry. |
| `pub const BYTES_READ_METRIC: &str = "bytes_read";` | rust/lance-datafusion/src/utils.rs:242-242 | No standalone documentation summary; use the family contract and source entry. |
| `pub const INDICES_LOADED_METRIC: &str = "indices_loaded";` | rust/lance-datafusion/src/utils.rs:243-243 | No standalone documentation summary; use the family contract and source entry. |
| `pub const PARTS_LOADED_METRIC: &str = "parts_loaded";` | rust/lance-datafusion/src/utils.rs:244-244 | No standalone documentation summary; use the family contract and source entry. |
| `pub const PARTITIONS_RANKED_METRIC: &str = "partitions_ranked";` | rust/lance-datafusion/src/utils.rs:245-245 | No standalone documentation summary; use the family contract and source entry. |
| `pub const INDEX_COMPARISONS_METRIC: &str = "index_comparisons";` | rust/lance-datafusion/src/utils.rs:246-246 | No standalone documentation summary; use the family contract and source entry. |
| `pub const INDEX_CACHE_HITS_METRIC: &str = "index_cache_hits";` | rust/lance-datafusion/src/utils.rs:247-247 | No standalone documentation summary; use the family contract and source entry. |
| `pub const INDEX_CACHE_MISSES_METRIC: &str = "index_cache_misses";` | rust/lance-datafusion/src/utils.rs:248-248 | No standalone documentation summary; use the family contract and source entry. |
| `pub const FRAGMENTS_SCANNED_METRIC: &str = "fragments_scanned";` | rust/lance-datafusion/src/utils.rs:249-249 | No standalone documentation summary; use the family contract and source entry. |
| `pub const RANGES_SCANNED_METRIC: &str = "ranges_scanned";` | rust/lance-datafusion/src/utils.rs:250-250 | No standalone documentation summary; use the family contract and source entry. |
| `pub const ROWS_SCANNED_METRIC: &str = "rows_scanned";` | rust/lance-datafusion/src/utils.rs:251-251 | No standalone documentation summary; use the family contract and source entry. |
| `pub const TASK_WAIT_TIME_METRIC: &str = "task_wait_time";` | rust/lance-datafusion/src/utils.rs:252-252 | No standalone documentation summary; use the family contract and source entry. |
| `pub const DELTAS_SEARCHED_METRIC: &str = "deltas_searched";` | rust/lance-datafusion/src/utils.rs:253-253 | No standalone documentation summary; use the family contract and source entry. |
| `pub const PARTITIONS_SEARCHED_METRIC: &str = "partitions_searched";` | rust/lance-datafusion/src/utils.rs:254-254 | No standalone documentation summary; use the family contract and source entry. |
| `pub const FIND_PARTITIONS_ELAPSED_METRIC: &str = "find_partitions_elapsed";` | rust/lance-datafusion/src/utils.rs:255-255 | No standalone documentation summary; use the family contract and source entry. |
| `pub const SCALAR_INDEX_SEARCH_TIME_METRIC: &str = "search_time";` | rust/lance-datafusion/src/utils.rs:256-256 | No standalone documentation summary; use the family contract and source entry. |
| `pub const SCALAR_INDEX_SER_TIME_METRIC: &str = "serialization_time";` | rust/lance-datafusion/src/utils.rs:257-257 | No standalone documentation summary; use the family contract and source entry. |

<a id="source-rust-lance-datafusion-src-utils-background-iterator-rs"></a>

## `rust/lance-datafusion/src/utils/background_iterator.rs`

| Declaration / normalized Python signature | Source range | Declared contract summary |
|---|---|---|
| `pub struct BackgroundIterator&lt;I: Iterator + Send + 'static&gt;` | rust/lance-datafusion/src/utils/background_iterator.rs:19-19 | Wrap an iterator as a stream that executes the iterator in a background blocking thread. |
| `pub fn new(iter: I) -&gt; Self` | rust/lance-datafusion/src/utils/background_iterator.rs:25-25 | No standalone documentation summary; use the family contract and source entry. |

