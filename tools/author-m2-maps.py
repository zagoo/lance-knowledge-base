from pathlib import Path
import json,re,collections
P=Path('/Users/renshaobin/Workspace/Develop/GitHub/lance-knowledge-base')
M=json.loads((P/'CORE-MANIFEST.json').read_text());ROOT=Path(M['repository']);by={e['path']:e for e in M['files']};changed=[]
# Each description is a navigation responsibility, not an assertion of full body analysis.
configs={
'rust-lance':{
 'title':'Dataset engine and public Rust API','prefixes':['rust/lance/'],'trust':'contract-verified entry paths; ordinary implementation files mapped',
 'intro':'Owns Dataset snapshots, scans, mutations, compaction and index lifecycle orchestration. Delegates schemas/identity to lance-core, manifest and operation rules to lance-table, bytes to lance-file/encoding/IO, and index algorithms to lance-index. Finishing a file and committing a dataset are distinct boundaries. The four checked entry traces are in [L0](../L0-orientation.md).',
 'dirs':{
 'rust/lance/src/io/commit/':'Commit support for conflict resolution, retry preparation and operation-specific publication context. This is the extension route for a new operation after the table-level intent/codec changes; read io/commit.rs first.',
 'rust/lance/src/io/exec/':'Dataset physical execution nodes consume planned projections, filters, row selections and vector candidates. Choose the node named by Scanner planning; do not change all nodes for a single pushdown task.',
 'rust/lance/src/io/':'Dataset-aware commit, deletion, execution and object-store composition. This layer supplies dataset context to lower-level I/O and publication contracts.',
 'rust/lance/src/index/vector/':'Dataset-owned vector build/open/update integration, including IVF partition handling. Numerical compression/storage mechanisms are in lance-index; manifest publication stays here.',
 'rust/lance/src/index/scalar/':'Dataset scalar adapters and index lifecycle integration. These connect plugin queries/training and index metadata to scans, row domains and fragment coverage.',
 'rust/lance/src/index/':'Create/append/open/remap index state, query prefilters, scalar logical planning, and system-index integration. create.rs is the public build-to-commit route; api.rs/index.rs define caller-facing interfaces.',
 'rust/lance/src/dataset/mem_wal/':'MemWAL shard, memtable and scanner integration. Descendant hnsw/index directories supply in-memory search; memtable/scanner/exec and scanner/exec own execution operators. These are mapped for navigation; protocol decisions must use the M3 contract and cited implementation.',
 'rust/lance/src/dataset/write/merge_insert/':'Merge-insert planning and execution substeps. The exec directory contains physical processing stages; start with the merge-insert builder before editing a stage in isolation.',
 'rust/lance/src/dataset/write/':'Mutation builders and commit destination/options. Insert writes data then constructs transaction intent; CommitBuilder publishes; merge/update paths have their own planning and conflict context.',
 'rust/lance/src/dataset/fragment/':'Fragment write and read composition. A fragment is a logical row group with files/deletions/lineage; keep physical-file and fragment identity separate.',
 'rust/lance/src/dataset/files/':'Dataset file management and data-file composition helpers. These operate below logical Dataset mutation and above object/file primitives; follow files.rs to the selected operation.',
 'rust/lance/src/dataset/optimize/':'Compaction helpers selected by optimize.rs. Planning/rewrite results carry source read versions; final publication remains the parent commit_compaction path.',
 'rust/lance/src/dataset/overlay/':'Overlay read/write helpers use physical-offset coverage and field identity. Preserve precedence and deletion semantics described in frozen fragment/overlay contracts.',
 'rust/lance/src/dataset/rowids/':'Dataset-level lookup/translation between stable IDs and physical row addresses. These require fragment context unavailable to the core row-address type.',
 'rust/lance/src/dataset/versions/':'Version-specific dataset rewrite support. The parent version policy chooses exact file versions; stable legacy paths remain compatibility surfaces.',
 'rust/lance/src/dataset/schema_evolution/':'Schema-evolution helpers coordinate schema changes with existing files and indices. Field identity and nullability are contracts, not cosmetic names.',
 'rust/lance/src/dataset/':'Dataset builders, scanner, fragments, writes, compaction, cleanup, refs/branches, deltas, schema evolution and row/blob access. Start at the operation-named file, then use its subdirectory only if needed.',
 'rust/lance/src/datafusion/':'Dataset TableProvider/DataFrame integration. Converts provider projection/filter/limit requests to Scanner plans and declares filter pushdown behavior.',
 'rust/lance/src/session/':'Session registries and cache configuration shared by Dataset handles. Treat cache identity and store reuse separately from persisted Dataset state.',
 'rust/lance/src/bin/':'Mapped-only executable entry points; not the engine API contract.',
 'rust/lance/src/arrow/':'Mapped-only Arrow interoperation helpers used by the engine; external Arrow implementation is excluded.',
 'rust/lance/src/utils/':'Mapped-only local helpers; callers own higher-level Dataset policy.',
 'rust/lance/src/':'Public Dataset/index/session facade and module declarations. Choose a named API before descending to implementation directories.',
 'rust/lance/':'Handwritten build entry; generated output is excluded. This file has navigation coverage only.'},
 'keys':[
 ('rust/lance/src/dataset.rs','Dataset','950-979,1687-1704','Owns the public Dataset write and scan entry points.\nWrite delegates to InsertBuilder and returns the committed Dataset.\nScan creates a Scanner over a cloned snapshot.\nRead these entry ranges before following the four paths in L0.'),
 ('rust/lance/src/dataset/scanner.rs','Scanner','2632-2675,3210-3375','Turns configured requests into physical plans and batch streams.\nValidate options before choosing vector, full-text, MinHash or filtered read sources.\nPlanning separates source/filter/order/limit/projection stages.\nRead this file for query behavior; physical execution support lives in lance-datafusion.'),
 ('rust/lance/src/dataset/write/insert.rs','InsertBuilder','98-315','Converts inputs to a stream/schema and writes uncommitted fragments.\nBuilds Overwrite or Append transaction intent from write mode.\nThe committed path configures CommitBuilder; uncommitted methods stop before publication.\nUse this boundary when changing ingestion parameters or commit timing.'),
 ('rust/lance/src/dataset/optimize.rs','CompactionPlanner / RewriteResult','1034-1158,2443-2514,3156-3260,3574-3605','Coordinates planner tasks, rewrite work and compaction publication.\nCarries original read versions through distributed RewriteResults.\nUses the minimum task read version for conflict coverage.\nTagged fragment-reuse histories require deferred remapping in the checked path.')],
 'contracts':[
 ('Public mutation boundary','Dataset::write → InsertBuilder::execute_stream → CommitBuilder. Uncommitted insert methods deliberately omit manifest publication.','rust/lance/src/dataset.rs:950-979; rust/lance/src/dataset/write/insert.rs:98-166'),
 ('Query planning','Scalar index use requires prefiltering or no nearest search. Nearest/full-text/MinHash modes cannot be combined indiscriminately.','rust/lance/src/dataset/scanner.rs:3290-3375'),
 ('Compaction conflicts','A refreshed Dataset handle must not replace the original task read version; doing so would skip intervening writes during conflict checks.','rust/lance/src/dataset/optimize.rs:3202-3225; rust/lance/src/dataset/optimize.rs:3574-3605')]},
'rust-lance-index':{
 'title':'Index engine and plugin contracts','prefixes':['rust/lance-index/','rust/lance-index-core/'],'trust':'contract-verified extension seams; algorithm implementation files mapped',
 'intro':'lance-index-core defines common index/search/store/remapping interfaces. lance-index implements scalar/vector mechanisms, registries and cache integration. Dataset orchestration and manifest publication are in rust/lance. The low-level plugin interface does not own a Dataset. No external library implementation is analyzed.',
 'dirs':{
 'rust/lance-index-core/src/':'Shared Index/IndexType/IndexParams, scalar storage/search/result/training interfaces, remapping and metrics. Plugins and the Dataset layer use these types to agree on row domain and exactness.',
 'rust/lance-index/src/scalar/inverted/':'Full-text inverted-index tokenization, postings/index construction and query combination. Subdirectories separate combined/compound query logic, storage/index mechanics and tokenizer adapters; use the query-specific implementation named by the facade.',
 'rust/lance-index/src/scalar/minhash_lsh/':'MinHash/LSH scalar index implementation and related persisted/query configuration. Signature-version compatibility is defined by index.proto.',
 'rust/lance-index/src/scalar/rtree/':'Optional geo R-tree implementation and sorting support; feature-gated integration, with geo helpers mapped only.',
 'rust/lance-index/src/scalar/':'Scalar index plugins, query parsers and storage mechanisms, including B-tree, bitmap, label-list, ngram, zone-map, Bloom, full-text and other registered kinds. registry.rs defines plugin training/load contracts; the crate registry connects concrete plugins.',
 'rust/lance-index/src/vector/ivf/':'IVF partition building, shuffling and storage. Partition assignment and storage are separate from quantizer codebook semantics; begin with vector/ivf.rs.',
 'rust/lance-index/src/vector/pq/':'Product-quantization builder, distance, storage and transform mechanisms. Preserve dimension/subvector/codebook compatibility and the selected distance convention.',
 'rust/lance-index/src/vector/hnsw/':'HNSW graph build/search mechanisms used by selected vector pipelines. It is not the universal IVF implementation.',
 'rust/lance-index/src/vector/bq/':'Binary/Rabit quantization mechanisms used by the corresponding vector path; follow quantization dispatch rather than treating them as PQ.',
 'rust/lance-index/src/vector/sq/':'Scalar quantizer storage/build/distance support for vector indices.',
 'rust/lance-index/src/vector/flat/':'Unquantized vector storage/build/query support; Flat and FlatBin dispatch are distinct from product quantization.',
 'rust/lance-index/src/vector/distributed/':'Distributed vector training/build coordination helpers; dataset publication stays outside this low-level module.',
 'rust/lance-index/src/vector/graph/':'Graph primitives used by vector implementations.',
 'rust/lance-index/src/vector/shared/':'Shared vector implementation helpers; callers select the concrete index and persisted layout.',
 'rust/lance-index/src/vector/v3/':'Vector format-generation-specific support; do not infer Lance data-file version from this directory name.',
 'rust/lance-index/src/vector/':'Vector query interface, quantization and IVF/HNSW families. vector.rs carries the search interface; quantizer and concrete storage modules hold mechanics.',
 'rust/lance-index/src/frag_reuse/':'Index-side deferred row translation adapters; persisted FRI schema/gates are owned by lance-table.',
 'rust/lance-index/src/':'Index facade, default plugin registry, system-index adapters, metrics, prefilter, optimization/progress and trait exports.',
 'rust/lance-index/protos-cache/':'Handwritten cache protobuf schema. Generated serializer code is excluded; cache entry identity is not Dataset file-version identity.',
 'rust/lance-index/examples/':'Mapped-only usage examples, not additional acceptance obligations.',
 'rust/lance-index/':'Handwritten build integration only; generated output excluded.'},
 'keys':[
 ('rust/lance-index/src/registry.rs','IndexPluginRegistry','26-177','Connects persisted detail type names and friendly plugin names to concrete scalar plugins.\nRegistration derives a lowercase name and records full protobuf identities.\nDefault registration adds only explicit historical aliases.\nUse supports_details for supported identity checks; lookup by name has a different purpose.'),
 ('rust/lance-index-core/src/scalar.rs','ScalarIndex / SearchResult / IndexStore','397-479,627-711','Defines query exactness, row-domain, update and remap obligations.\nAtMost is a candidate superset requiring recheck; AtLeast is an incomplete guaranteed subset.\nAddress-domain results need dataset-level translation on stable-row-ID datasets.\nUpdate/remap write to a destination store and return CreatedIndex metadata for caller publication.'),
 ('rust/lance-index/src/scalar/registry.rs','ScalarIndexPlugin / BasicTrainer','29-190','Separates training request/criteria from prepared training data.\nPlugins supply load/query-parser/version/exactness behavior.\nThe caller must satisfy training criteria and persist returned details.\nAsynchronous batch remapping is an additive capability, not automatic legacy fallback.')],
 'contracts':[
 ('Registration identity','add_plugin derives the plugin key from the detail message name; supports_details checks a registered full protobuf name after the final slash, case-insensitively. Friendly-name lookup alone is not that identity guard.','rust/lance-index/src/registry.rs:26-177'),
 ('Training','new_training_request returns criteria; the caller prepares the stream before train_index and stores the returned details for load_index. A plugin may have no BasicTrainer.','rust/lance-index/src/scalar/registry.rs:29-167'),
 ('Search','Exact, AtMost and AtLeast encode different set guarantees; scalar results are not necessarily ordered. Default results_are_row_addresses is false.','rust/lance-index-core/src/scalar.rs:414-461; rust/lance-index-core/src/scalar.rs:627-662'),
 ('IVF/PQ boundary','IVF transformer dispatch selects Flat/FlatBin, Product, Scalar or Rabit quantizers. ProductQuantizer carries subvector count, bit count, dimension, codebook and distance type; it is not the Dataset commit object.','rust/lance-index/src/vector/ivf.rs:46-85; rust/lance-index/src/vector/pq.rs:44-54')]},
'rust-lance-io':{
 'title':'Object storage and I/O scheduling','prefixes':['rust/lance-io/'],'trust':'contract-verified I/O seams; providers/platform helpers mapped only',
 'intro':'Wraps object storage with Lance reader/writer traits, URI/provider resolution, scheduling, streaming and spill support. Dataset commits use these primitives but own their own publication policy. Cloud SDK and operating-system implementations are external boundaries, not KB analysis targets.',
 'dirs':{
 'rust/lance-io/src/object_store/providers/':'Mapped-only storage-specific provider constructors. Select by registered URI scheme through ObjectStoreRegistry; do not duplicate scheme-specific code in Dataset callers.',
 'rust/lance-io/src/object_store/':'Registry/provider integration, dynamic credentials/storage options, tracing, metrics, retry/throttle and directory helpers. These adapt stores; manifest conflict policy is outside this layer.',
 'rust/lance-io/src/scheduler/':'Lite scheduler implementation selected by SchedulerConfig/store preference. The standard scheduler remains in scheduler.rs; their admission/lifetime differences are M3 protocol concerns.',
 'rust/lance-io/src/uring/':'Mapped-only Linux io_uring integration and supporting workers/resources; platform-specific implementation requires source reading before changes.',
 'rust/lance-io/src/utils/':'Mapped-only I/O utility support including cached file-size metadata.',
 'rust/lance-io/src/':'Reader/Writer interfaces, object reader/writer, local and scheduled access, stream/spill and facade types. Select traits.rs for interface changes and scheduler.rs for request lifecycle.'},
 'keys':[
 ('rust/lance-io/src/traits.rs','Reader / Writer','24-43,136-177','Defines asynchronous range/stream reads and writer finalization.\nReader promises object bytes; higher layers interpret formats.\nDefault get_stream/get_range_stream materialize through get_all/get_range before wrapping a stream.\nWriter shutdown finalizes bytes and returns WriteResult, not a Dataset version.'),
 ('rust/lance-io/src/scheduler.rs','ScanScheduler / FileScheduler / SchedulerConfig','795-859,889-930,1315-1352','Owns scheduled requests, buffer budget and shared I/O statistics.\nSchedulerConfig can force lite/standard behavior or defer to store preference.\nResponse drop refunds the standard queue reservation, including undelivered cancelled responses.\nIndirect reads have an explicit bypass-backpressure handle to avoid dependency deadlock.')],
 'contracts':[
 ('Buffer policy','io_buffer_size_bytes controls queued/unconsumed buffering. use_lite_scheduler Some(true/false) forces a choice; None uses the store preference. The environment is read when constructing config.','rust/lance-io/src/scheduler.rs:836-859; rust/lance-io/src/scheduler.rs:889-920'),
 ('Cancellation accounting','Standard Response::drop refunds its byte/request reservation; direct ScanScheduler users must retain the scheduler through outstanding I/O.','rust/lance-io/src/scheduler.rs:795-834'),
 ('Indirect reads','with_bypass_backpressure clones a FileScheduler with bypass enabled; it is intended for dependent reads after decoding offsets. It is not the default for arbitrary bulk scans.','rust/lance-io/src/scheduler.rs:1343-1352'),
 ('Streams','Default Reader stream methods first obtain complete Bytes via get_all or get_range. A stream-shaped return type alone does not guarantee bounded-memory streaming.','rust/lance-io/src/traits.rs:153-175')]},
'rust-lance-datafusion':{
 'title':'Query planning and execution integration','prefixes':['rust/lance-datafusion/'],'trust':'contract-verified planner/execution boundary; helper files mapped',
 'intro':'Provides Lance-specific planning, expression, projection, stream, spill and execution support around DataFusion interfaces. Dataset TableProvider itself is in rust/lance/src/datafusion/dataframe.rs. External DataFusion code is not analyzed.',
 'dirs':{
 'rust/lance-datafusion/src/udf/':'Lance-specific function implementations registered through udf.rs. Coordinate parsing/type coercion and execution semantics when adding a function.',
 'rust/lance-datafusion/src/utils/':'Shared query integration helpers, mapped by responsibility rather than copied into the KB.',
 'rust/lance-datafusion/src/':'Planner and SQL/expression conversion; logical expressions/projection; dataframe/aggregate/chunker; execution context, spill and optional Substrait integration. Choose the operation-named file and follow the module facade for feature gates.',
 'rust/lance-datafusion/':'Handwritten build/schema integration; generated bindings excluded.'},
 'keys':[
 ('rust/lance-datafusion/src/planner.rs','Planner','280-350','Parses expressions in a schema-aware Lance context.\nRelations are disabled by default; qualified names otherwise mean struct field access.\nColumn lookup prefers an exact schema name before case-insensitive matching.\nUse this boundary for expression-name behavior; physical pushdown is a separate Dataset provider/scanner concern.'),
 ('rust/lance-datafusion/src/exec.rs','execute_plan / LanceExecutionOptions','721-761','Turns a physical ExecutionPlan into a RecordBatch stream.\nSingle-partition plans execute directly; ordered multi-partition output uses SortPreservingMergeExec.\nUnordered multi-partition output uses CoalescePartitionsExec.\nThe final stream reports plan metrics through its completion callback.')],
 'contracts':[
 ('Provider pushdown','LanceTableProvider combines supplied filters with AND, applies projection/system columns, limit and ordering to Scanner, then creates a plan with the caller session. It reports Exact filter pushdown.','rust/lance/src/datafusion/dataframe.rs:132-197'),
 ('Output ordering','execute_plan preserves known output ordering when merging multiple partitions; blindly coalescing them would scramble that ordering.','rust/lance-datafusion/src/exec.rs:721-761'),
 ('Identifier resolution','Planner defaults enable_relations=false. Exact field-name matching wins, then ASCII-insensitive matching; an unknown name is retained for later resolution.','rust/lance-datafusion/src/planner.rs:280-350')]},
'python':{
 'title':'Python public API and Rust boundary','prefixes':['python/'],'trust':'contract-verified primary API mapping; optional integrations mapped only',
 'intro':'The Python package shapes public arguments and Arrow interoperability; PyO3 Rust methods map to Dataset/Scanner/builders. Keep business validation in Rust core and parameter names aligned. Python commands in a development checkout must use the documented uv workflow; none are run for this read-only KB. See python/AGENTS.md:5-23 and python/AGENTS.md:38-44.',
 'dirs':{
 'python/python/lance/torch/':'Mapped-only PyTorch training/data-loader integration. External torch internals and performance behavior are excluded.',
 'python/python/lance/indices/':'Python index configuration/training/query helpers; core persisted/index correctness stays in Rust. Accelerator-specific behavior is an optional integration boundary.',
 'python/python/lance/_dataset/':'Dataset Python support modules, selected from the public dataset facade. Use them for argument/result shaping rather than duplicating Rust transaction logic.',
 'python/python/lance/_arrow/':'Mapped-only Arrow interoperability helpers; external PyArrow internals are excluded.',
 'python/python/lance/':'Public dataset/scanner/fragment/file/blob/schema/query/vector/MemWAL APIs and optional integrations (namespace, HF, pydantic, sampling, telemetry). __init__.py is the package export list; dataset.py supplies the primary facade.',
 'python/src/dataset/':'PyO3 dataset operation adapters for commit, optimization, cleanup, blobs and statistics. They bridge Python values/results to the existing Rust engine.',
 'python/src/':'PyO3 classes, runtime/executor, Arrow stream conversion, Dataset/Scanner and operation adapters. lib.rs registers exported extension classes/functions; dataset.rs maps primary operations.'},
 'keys':[
 ('python/python/lance/dataset.py','LanceDataset / LanceScanner / ScannerBuilder / DatasetOptimizer','1496-1565,2938-2943,3147-3158,4575-4606,7735-7756,8350-8377','Primary Python operation and query facade.\nScanner applies defaults first and forwards only non-None option overrides, with separate column-default handling.\nDelete/update serialize Arrow expressions before calling the Rust extension.\nCommitted create_index returns self; write_dataset wraps the returned extension Dataset in a new Python facade.'),
 ('python/src/dataset.rs','Dataset / write_dataset','4849-4888','Primary PyO3 Dataset bridge, including write stream conversion.\nA native Scanner obtains a reader; other inputs use ArrowArrayStreamReader.\nBoth branches await Rust LanceDataset::write on the shared runtime.\nWrite-mode parsing accepts lowercase-normalized create/append/overwrite and rejects other strings.')],
 'contracts':[
 ('Export mapping','Package exports include Dataset/Scanner/fragment/write, blob/file/schema, query/indices, diagnostics and MemWAL objects. PyO3 lib.rs registers the underlying extension classes/functions.','python/python/lance/__init__.py:10-134; python/src/lib.rs:264-330'),
 ('Scanner defaults','Non-None arguments override default scan options; columns=None uses special default-column logic. Full-text and nearest/MinHash requests are converted to builder calls before to_scanner.','python/python/lance/dataset.py:1496-1565'),
 ('Write mapping','Python write_dataset calls _write_dataset, stores the returned handle and URI, and clears per-instance default scan/read params. The Rust shim invokes LanceDataset::write and maps engine errors to PyIOError.','python/python/lance/dataset.py:8350-8377; python/src/dataset.rs:4849-4878'),
 ('Mutations','delete/update serialize Arrow expressions when supplied, forward conflict retry/timeout parameters, and leave engine transaction behavior to the Rust adapter/core.','python/python/lance/dataset.py:2938-2943; python/python/lance/dataset.py:3147-3158')]}}

def anchor(s):return re.sub(r'[^a-z0-9-]','-',s.lower()).strip('-')
def write(name,text):
 f=P/name;f.parent.mkdir(parents=True,exist_ok=True);f.write_text(text);changed.append(name)
def source_ranges(e):return ', '.join(f"{a}-{b}" for a,b in e['included_ranges'])
def map_doc(key,c,files,deep=True):
 name='L1-modules/'+key+'.md'
 out=f"# {c['title']}\n\n**Trust: {c['trust']}.** Source snapshot `{M['snapshot']['commit']}`. [Entry](../README.md) · [Scope](../V21-PROTOCOL.md) · [Format](../L3-symbols/format-spec.md).\n\n{c['intro']}\n\n## Module Map\n\n"
 groups=collections.defaultdict(list)
 for e in files:
  matches=[x for x in c['dirs'] if e['path'].startswith(x)]
  if not matches:raise ValueError('unmapped '+e['path'])
  owner=max(matches,key=len);groups[owner].append(e)
 for d,es in sorted(groups.items()):
  ident=anchor(d);out+=f'<a id="{ident}"></a>\n\n### `{d}`\n\n{c["dirs"][d]}\n\n'
  out+='| Source file | Production ranges | Coverage |\n|---|---|---|\n'
  for e in sorted(es,key=lambda x:x['path']):
   state='frozen Key File' if e['status']=='key-file' else 'mapped'
   out+=f"| `{e['path']}` | {source_ranges(e)} | {state} |\n"
   e['module_map']={'document':name,'anchor':ident,'directory':d}
   if e['status'] is None:e['status']='mapped';e['coverage_mode']='mapped-only' if not deep else 'mapped'
 out+='\n## Key types and files\n\n'
 for path,typ,ranges,role in c.get('keys',[]):
  out+=f'### {typ}\n\n`{path}` — read `{ranges}`.\n\n'+role.replace('\n','  \n')+'\n\n'
  if deep:
   l2='L2-files/'+path+'.md'
   if (P/l2).exists():raise ValueError('Will not overwrite a frozen file '+l2)
   body=f"# Key File: {path}\n\n**V2.1 selected contract record.** Verified entry/protocol ranges: `{ranges}`. The rest of this file has Module Map coverage; this is not a claim of line-by-line analysis. Tests/generated code are excluded. [Module Map]("+('../'*len(Path(l2).parent.parts))+name+").\n\n## Responsibility and interfaces\n\n"+role.replace('\n','\n\n')+'\n\n## Behavior and change boundaries\n\n'
   for title,contract,cite in c['contracts']:
    if path in cite:body+=f'### {title}\n\n{contract} ({cite})\n\n'
   body+='## Read next\n\nUse the owning Module Map for callers/callees and the L0 trace for publication/query ordering. Exact implementation details outside the verified ranges require source reading; do not infer stronger validation or rollback guarantees from this record.\n'
   write(l2,body);by[path]['status']='key-file';by[path]['coverage_mode']='contract-verified-key-ranges';by[path]['l2_document']=l2;by[path]['verified_ranges']=ranges
   out+=f'[Selected contract record](../{l2}).\n\n'
 out+='## Contracts and extension boundaries\n\n'
 for title,contract,cite in c.get('contracts',[]):out+=f'**{title}.** {contract} ({cite})\n\n'
 if deep:out+='M3 supplies the complete API-family/protocol decision tables and recipe navigation. This Module Map establishes ownership and the checked seams; it does not claim runtime qualification.\n'
 write(name,out)
for k,c in configs.items():
 es=[e for e in M['files'] if e['status']!='excluded' and any(e['path'].startswith(x) for x in c['prefixes'])]
 map_doc(k,c,es)
# Java has maps only: no new L2 records, no semantic reinterpretation of JNI internals.
java={'title':'Java and JNI Module Map','trust':'mapped only — no deep Java/JNI contracts',
'intro':'Java API wrappers live in java/src/main/java/org/lance; JNI adapters live in java/lance-jni/src. Match public option objects and native signatures through the corresponding operation-named file before changing the Rust API. Follow java/AGENTS.md for Java 11, ./mvnw and option/enum conventions. No Java builds or tests were run.',
'dirs':{'java/lance-jni/src/':'Mapped-only JNI boundary: blocking/async Dataset/scanner, fragment/file/blob/index/transaction/update/MemWAL and runtime/error helpers. This maps ownership, not native memory/lifetime correctness.', 'java/src/main/java/org/lance/':'Mapped-only public Java API and supporting option/result types. Child packages identify cleanup, compaction, delta, file/fragment, index variants, IPC, MemWAL, merge, namespace, operations, telemetry, schema and update responsibilities. Keep option serialization aligned with JNI and Rust.'},
'keys':[('java/src/main/java/org/lance/Dataset.java','Dataset','1-'+str(by['java/src/main/java/org/lance/Dataset.java']['source']['line_count']),'Start at the Java Dataset facade for caller-visible signatures.\nFollow the operation-named JNI adapter for native linkage.\nRead option/result classes in the same package when changing arguments.\nMapped only: verify lifetime and error details in source before implementation.'),('java/lance-jni/src/blocking_dataset.rs','Dataset JNI adapter','1-'+str(by['java/lance-jni/src/blocking_dataset.rs']['source']['line_count']),'Maps blocking Java Dataset operations into the Rust boundary.\nCoordinate Java declarations and JNI entry names as one change.\nUse dedicated scanner/file/index modules for those API families.\nMapped only: this record makes no deep binding or unsafe-code claim.')], 'contracts':[]}
map_doc('java',java,[e for e in M['files'] if e['status']!='excluded' and e['path'].startswith('java/')],False)
# Existing deep crates are not rewritten. Map remaining encoding and build/support files separately.
peripheral_roles={
'rust/arrow-scalar/':'Arrow scalar-value helpers used by engine/index code; external Arrow internals excluded.',
'rust/arrow-stats/':'Arrow statistics utilities; choose the consuming index/encoding contract before changing representation.',
'rust/compression/fsst/':'FSST compression kernel support; mapped only, unsafe/kernel changes require source review.',
'rust/compression/bitpacking/':'Bitpacking kernel support; mapped only, specialized SIMD/layout implementation requires source review.',
'rust/examples/':'Usage examples, summarized only; not engine acceptance coverage.',
'rust/lance-arrow/':'Arrow type/buffer/stream interoperability and local serialization helpers; mapped only.',
'rust/lance-derive/':'Procedural derive support; mapped only, not an engine mutation policy.',
'rust/lance-geo/':'Optional geometry/domain helpers; mapped only and feature-specific.',
'rust/lance-linalg/':'Distance, quantization, clustering and numerical helpers; mapped only, no numerical performance qualification.',
'rust/lance-namespace/':'Namespace interfaces and model boundary; mapped only.',
'rust/lance-namespace-impls/':'Directory/REST namespace implementations, credentials and connection support; mapped only.',
'rust/lance-namespace-datafusion/':'Namespace-to-DataFusion integration; mapped only.',
'rust/lance-select/':'Row-selection set/bitmap representations used by queries; mapped only.',
'rust/lance-tokenizer/':'Text tokenization support and optional tokenizer integrations; mapped only.',
'rust/lance-tools/':'Command-line utilities; mapped only, not a second engine API.',
'rust/lance-encoding/src/array_encoding/':'Retained legacy array-encoding path for V2_0. Ordinary files are mapped; completed structural/core codec contracts are frozen elsewhere. Preserve existing stable read behavior and avoid designing new features on legacy writers.',
'rust/lance-encoding/src/encodings/logical/primitive/sparse/':'Unstable sparse structural page support. Fields/version gates are in the format contract; detailed sparse algorithm work requires source reading.',
'rust/lance-encoding/':'Remaining encoding helpers and build integration. Use the existing encoding guide and format contract first; no completed file is re-analyzed.',
'rust/lance-file/':'Remaining handwritten build integration only; file runtime contracts remain frozen and complete.',
'rust/lance-table/':'Remaining handwritten build integration only; table runtime contracts remain frozen and complete.',
'.github/':'Repository automation support only; no engine behavior claim.',
'ci/':'Repository CI/development utility scripts only; not analyzed as engine code.',
'docs/':'Documentation-support source scripts/examples only; mapped for navigation.',
'skills/':'Repository development workflow helper source only; mapped for navigation.'}
remaining=[e for e in M['files'] if e['status'] is None]
pc={'title':'Peripheral and retained-crate support Module Maps','trust':'mapped only; existing deep records unchanged','intro':'This page supplies navigation coverage for intentionally summarized utilities, optional integrations and residual handwritten support files. It does not claim deep contracts, external dependency analysis or benchmark/test analysis. Ordinary mapping is successful V2.1 coverage.','dirs':peripheral_roles,'keys':[],'contracts':[]}
map_doc('peripheral-maps',pc,remaining,False)
counts=collections.Counter(e['status'] or 'unclassified' for e in M['files']);n=len(M['files']);non=n-counts['excluded']
M['totals']={'files':n,'excluded':counts['excluded'],'key_file':counts['key-file'],'mapped':counts['mapped'],'unclassified':counts['unclassified'],'classified_percent':100*(n-counts['unclassified'])/n,'non_excluded':non,'non_excluded_covered_percent':100*(counts['key-file']+counts['mapped'])/non}
M['module_map_policy']='Mapped files have explicit membership under a responsibility paragraph. Key File records state verified ranges; frozen through-85 records remain unchanged. Java/peripherals are mapped only.'
(P/'CORE-MANIFEST.json').write_text(json.dumps(M,indent=2)+'\n');changed.append('CORE-MANIFEST.json');changed+=['tools/author-m2-maps.py','tools/read-production.py']
(P/'verification/iteration-088-changes.json').write_text(json.dumps({'changed_artifacts':changed},indent=2)+'\n')
print(json.dumps(M['totals'],indent=2));print('Created',len(changed),'artifacts')
