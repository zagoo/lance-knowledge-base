import fs from 'node:fs';import path from 'node:path';import {output}from './inventory.mjs';
const read=f=>fs.readFileSync(path.join(output,f),'utf8'),write=(f,s)=>fs.writeFileSync(path.join(output,f),s.trimEnd()+'\n');
const marker='\n## AIMD control and object-store test instrumentation\n';function append(f,t){let s=read(f),i=s.indexOf(marker);write(f,(i<0?s.trimEnd():s.slice(0,i).trimEnd())+marker+'\n'+t.trim());}
const symbols=JSON.parse(read('L3-symbols/symbols.json')),paths=new Set(['rust/lance-core/src/utils/aimd.rs','rust/lance-core/src/utils/testing.rs']);
write('L1-modules/rust-lance-core-control-testing.md',`# AIMD rate control and object-store test instrumentation

**Local utilities and seed corpora analyzed; production integrations, dependency defaults and runtime verification remain INCOMPLETE.** [Core](rust-lance-core.md) · [Orientation](../L0-orientation.md) · [Symbols](../L3-symbols/symbol-index.md) · [Tests](../L4-crosscutting/build-and-test.md).

## AIMD configuration and rate contract

AimdConfig exposes public fields and consuming with_* methods. Builders merely replace values; validate and AimdController::new reject bad configurations with InvalidInput. All six floating values must be finite. Positive initial/min/increment,0<decrease<1,nonzero duration,threshold in[0,1],initial>=min and (when max>0) min<=max and initial<=max are required. max0 disables the ceiling, including signed negative zero; a negative nonzero max fails. Error precedence follows that validation order. (rust/lance-core/src/utils/aimd.rs:20-185)

| Setting | Default | Meaning |
|---|---|---|
| initial_rate | 2000 | Initial returned rate |
| min_rate | 1 | Floor after decrease |
| max_rate | 5000 | Ceiling after increase;0 disables |
| decrease_factor | 0.5 | Multiply on a throttled window |
| additive_increment | 300 | Add per evaluated successful window |
| window_duration | 1 second | Minimum duration before evaluating previous outcomes |
| throttle_threshold | 0 | Decrease only when prior-window throttle fraction is strictly greater |

All defaults and their request-per-second units are declared locally; the40%-to-full-in10seconds description assumes nonempty successful windows and timely boundary-triggering calls. (rust/lance-core/src/utils/aimd.rs:20-55; rust/lance-core/src/utils/aimd.rs:238-289)

RequestOutcome is Success or Throttled. Its docs instruct treating non-throttle failures such as404/timeouts as Success for this capacity signal; the module supplies no classifier. Controller holds immutable config plus Mutex-protected rate/start/counts. new validates, initializes rate and current Instant, and zeroes counts. record_outcome takes the lock, observes now and first evaluates the preceding window when elapsed>=duration. A nonempty window with ratio>threshold sets max(rate*factor,min); otherwise adds increment and applies the optional ceiling. Empty expired windows do not adjust. (rust/lance-core/src/utils/aimd.rs:187-275)

After expiration it sets start=now and zeroes both counts, then records the incoming outcome in the new window. Long idle gaps cause at most one evaluation, with no catch-up loop. current_rate only reads; it cannot advance a window. Thus no background timer, token acquisition, sleep or IO enforces the returned rate. Threshold equality follows additive increase; the test comment saying >=50% should decrease is broader than the actual > implementation and its2/3 fixture. (rust/lance-core/src/utils/aimd.rs:238-290; rust/lance-core/src/utils/aimd.rs:595-621)

Mutex poison panics through unwrap in record_outcome/current_rate; Debug calls current_rate and shares that risk. u64 counts/addition have no checked arithmetic. Even finite validated values can overflow unlimited f64 additive growth to infinity; enabled finite ceiling caps the increased result. There is no post-update finiteness check. These are source-level boundaries, not measured runtime failures. (rust/lance-core/src/utils/aimd.rs:213-289)

## Policy proxy behavior

The public testing utility module is not gated by cfg(test). PolicyFnT accepts (&str,&Path)->core Result<()> and ObjectMetaPolicyFnT accepts (&str,ObjectMeta)->core Result<ObjectMeta>, both Send+Sync with blanket closure implementations. Private aliases wrap each in Arc. Both dyn Debug implementations print PolicyFn. ProxyObjectStorePolicy stores named callbacks in private HashMaps, provides setters for both and removal only for before policies; same-name setting replaces the entry and ordering is unspecified. (rust/lance-core/src/utils.rs:22-22; rust/lance-core/src/utils/testing.rs:27-87)

ProxyObjectStore owns target Arc<dyn ObjectStore> and Arc<Mutex<ProxyObjectStorePolicy>>. Before and metadata callbacks execute while that synchronous lock is held. They can short-circuit with converted object_store errors; callbacks must not recursively acquire the same mutex, and panic can poison it. There is no rollback of earlier callback side effects. Target awaits occur after helper locks are released. (rust/lance-core/src/utils/testing.rs:89-120; rust/lance-core/src/utils/testing.rs:165-250)

| Overridden operation | Before-policy string/path | Metadata transform / boundary |
|---|---|---|
| put_opts | put / location | Delegate result |
| put_multipart_opts | put_multipart / location | Returned upload is unwrapped; later upload operations bypass this wrapper |
| get_opts | get_opts / location | Only options.head triggers transform with head; errors returned |
| get_ranges | get_ranges / location | No byte transformation |
| delete_stream | delete / each successful input Path when polled | Input errors pass through; delegate receives checked stream |
| list | No before policy | Each successful metadata item transformed with list; policy errors unwrap/panic |
| list_with_delimiter | No before policy | No transform |
| copy_opts | copy / source only | Destination/options forwarded |
| rename_opts | rename / source only | Destination/options forwarded |

This exact override matrix qualifies the broad all-calls doc wording. Defaults for other ObjectStore methods remain dependency behavior, not analyzed implementations. Streaming policies are evaluated as items are polled, so later policy changes can affect later items; underlying stream errors bypass and_then callbacks. (rust/lance-core/src/utils/testing.rs:89-98; rust/lance-core/src/utils/testing.rs:165-251)

## Counting wrapper and async lifetime

CountingObjectStore owns target and a caller-supplied Arc<AtomicUsize>, preserves its initial value and adds one with SeqCst per listing invocation. list increments synchronously before returning its delegated stream, even if that stream is never consumed or later fails. list_with_delimiter increments inside its async body before awaiting the target, so constructing but never polling that future does not increment. It counts attempts, not objects, completed requests or time. (rust/lance-core/src/utils/testing.rs:129-157; rust/lance-core/src/utils/testing.rs:287-295)

Explicit put/multipart/get/ranges/delete-stream/copy overrides forward unchanged. There is no explicit rename_opts override in this implementation; do not infer its dependency default without inspecting ObjectStore. Display for both wrappers includes the target display string. No local unit tests, reset operation or counter decrement is defined in this file. (rust/lance-core/src/utils/testing.rs:123-127; rust/lance-core/src/utils/testing.rs:159-163; rust/lance-core/src/utils/testing.rs:253-300)

## Tests and saved seeds

AIMD tests parameterize invalid configuration and assert both InvalidInput and message substrings, accept defaults/unlimited ceiling, and inspect additive/decrease/floor/ceiling/empty-window/threshold/recovery transitions. Most use the private explicit-time helper under a lock without sleeping; the within-window test calls the real-time public method100 times with a10second window. Exact threshold equality, poisoned mutexes, concurrent callers and arithmetic extremes are not locally tested. Tests were read, not executed. (rust/lance-core/src/utils/aimd.rs:292-679)

Two checked-in proptest corpora retain historical failure seeds. statistics has six cc records: empty string/collection, two distinct seeds with one65-zero inner collection each, and Unicode/control-rich strings. mask has two seeds, one documenting empty full-fragment lists, one left row and344 distinct right rows; one right row shares the left fragment ID but differs in offset. These are literal input-shape facts and exact seed text, not evidence that current CI loads them or that the historical bug remains. Current consumers and persistence configuration are pending. (rust/lance-core/proptest-regressions/io/writer/statistics.txt:1-12; rust/lance-core/proptest-regressions/utils/mask.txt:1-9)

## Exact public declarations

| Qualified symbol | Kind | Exact declaration | Evidence and full body |
|---|---|---|---|
${symbols.filter(s=>paths.has(s.path)&&s.visibility==='public Rust API').map(s=>`| \`${s.name}\` | ${s.kind} | \`${s.signature.replaceAll('|','\\|')}\` | [${s.path}:${s.line}-${s.end_line}](../${s.analysis}) |`).join('\n')}

## Files

- [aimd.rs](../L2-files/rust/lance-core/src/utils/aimd.rs.md), rust/lance-core/src/utils/aimd.rs:1-679.
- [testing.rs](../L2-files/rust/lance-core/src/utils/testing.rs.md), rust/lance-core/src/utils/testing.rs:1-300.
- [statistics corpus](../L2-files/rust/lance-core/proptest-regressions/io/writer/statistics.txt.md), rust/lance-core/proptest-regressions/io/writer/statistics.txt:1-12.
- [mask corpus](../L2-files/rust/lance-core/proptest-regressions/utils/mask.txt.md), rust/lance-core/proptest-regressions/utils/mask.txt:1-9.
`);
write('L1-modules/rust-lance-core.md',read('L1-modules/rust-lance-core.md').replace('thirty files','thirty-four files').replace('ordered address remapping and stable-partition primitives.','ordered address remapping, stable-partition primitives, AIMD control, object-store test instrumentation and saved property-test seeds.'));
append('L1-modules/rust-lance-core.md','The [control/testing supplement](rust-lance-core-control-testing.md) documents lazy AIMD window evaluation, complete config validation, operation-specific proxy policy coverage, listing-count timing and saved seed evidence. Production rate-limiter integration and current regression-seed consumers remain pending. (rust/lance-core/src/utils/aimd.rs:102-290; rust/lance-core/src/utils/testing.rs:165-300)');
append('L0-orientation.md',`| Term | Meaning | Evidence |
|---|---|---|
| AIMD | Additive increase for successful windows, multiplicative decrease only above throttle ratio threshold | rust/lance-core/src/utils/aimd.rs:4-13; rust/lance-core/src/utils/aimd.rs:253-284 |
| RequestOutcome | Capacity signal; Success includes documented non-throttle errors | rust/lance-core/src/utils/aimd.rs:187-195 |
| ProxyObjectStorePolicy | Named path-error and metadata-transform callbacks shared with tests | rust/lance-core/src/utils/testing.rs:49-87 |
| CountingObjectStore | Wrapper counting list attempts through a shared atomic | rust/lance-core/src/utils/testing.rs:129-157; rust/lance-core/src/utils/testing.rs:287-295 |

[Detailed API and limits](L1-modules/rust-lance-core-control-testing.md).`);
append('L3-symbols/behavior-contracts.md',`| Surface | Required interpretation | Evidence |
|---|---|---|
| AIMD boundary | Evaluate old nonempty window before adding the incoming outcome; equality with threshold increases | rust/lance-core/src/utils/aimd.rs:238-284 |
| AIMD idle/read | No catch-up per missed window; current_rate has no update side effect | rust/lance-core/src/utils/aimd.rs:253-289 |
| AIMD config | Builders do not validate; new rejects nonfinite/out-of-range values rather than clamping configuration | rust/lance-core/src/utils/aimd.rs:58-185; rust/lance-core/src/utils/aimd.rs:222-236 |
| Proxy policies | HashMap ordering unspecified; callback runs under synchronous lock; source-only copy/rename policy | rust/lance-core/src/utils/testing.rs:105-120; rust/lance-core/src/utils/testing.rs:242-250 |
| Metadata failures | Head transform returns error; list transform unwraps and panics | rust/lance-core/src/utils/testing.rs:186-194; rust/lance-core/src/utils/testing.rs:221-235 |
| Listing counts | list counts at call; async delimiter counts when polled; neither counts returned objects | rust/lance-core/src/utils/testing.rs:287-295 |

[Exact declarations](../L1-modules/rust-lance-core-control-testing.md).`);
append('L4-crosscutting/scenarios.md',`A local rate-feedback trace starts at100 with factor0.5,increment10,window100ms. Record a throttle at t0; at t0+150ms a Success first closes that throttle window and returns50, then seeds the next window. Two further successful window closures yield60 then70. current_rate between calls only reads the stored value. These outcomes are derived from the implementation and recovery test, with no claim that a request is delayed by the controller itself. (rust/lance-core/src/utils/aimd.rs:238-290; rust/lance-core/src/utils/aimd.rs:623-661)

For a proxy head call, invoke before policies with get_opts/location; after they succeed release the policy lock and await target.get_opts. If options.head is true, transform metadata under the lock with head, returning the first transformed error. list follows a different path: no before callback, then per-item list metadata transforms with unwrap while the stream is polled. The different failure behavior matters when injecting faults into readers. (rust/lance-core/src/utils/testing.rs:105-120; rust/lance-core/src/utils/testing.rs:186-194; rust/lance-core/src/utils/testing.rs:221-235)

These local instrumentation traces do not complete dataset write/index/transaction acceptance scenarios.`);
append('L4-crosscutting/build-and-test.md',`AIMD's rstest cases assert InvalidInput and text, while most transition tests inject explicit Instant values into a private helper rather than sleeping. The real-time within-window test assumes100 calls finish within10seconds. testing.rs has no local tests and is a publicly exported utility module. Its wrappers can inject path failures, transform metadata or count listing attempts with operation-specific limitations. (rust/lance-core/src/utils/aimd.rs:292-679; rust/lance-core/src/utils/testing.rs:27-300; rust/lance-core/src/utils.rs:22-22)

The [statistics seed corpus](../L2-files/rust/lance-core/proptest-regressions/io/writer/statistics.txt.md) retains six records and the [mask corpus](../L2-files/rust/lance-core/proptest-regressions/utils/mask.txt.md) two. Their standard headers describe replay-before-new-cases, but current persistence wiring/harness consumers have not been identified. Never report source seed presence as passing a regression test. (rust/lance-core/proptest-regressions/io/writer/statistics.txt:1-12; rust/lance-core/proptest-regressions/utils/mask.txt:1-9)`);
append('L4-crosscutting/pitfalls.md',`- An AIMD rate read cannot close a window; the next recorded outcome does so, and the new outcome belongs to the next window. The strict > threshold rule differs from one test comment's >= wording. (rust/lance-core/src/utils/aimd.rs:238-290; rust/lance-core/src/utils/aimd.rs:595-621)
- Finite config validation does not guarantee unbounded subsequent rate arithmetic stays finite or counts cannot overflow. Mutex poison can also panic during Debug because it reads current_rate. (rust/lance-core/src/utils/aimd.rs:102-123; rust/lance-core/src/utils/aimd.rs:213-289)
- Proxy callbacks run under a synchronous mutex in unspecified map order. Recursive policy mutation can deadlock; listing transform errors panic and can poison the mutex, while head transforms return errors. (rust/lance-core/src/utils/testing.rs:105-120; rust/lance-core/src/utils/testing.rs:186-194; rust/lance-core/src/utils/testing.rs:221-235)
- list_with_delimiter bypasses proxy policies; multipart's returned handle is unwrapped; copy/rename expose only the source to before callbacks. Counted list attempts need not have completed or yielded any object. (rust/lance-core/src/utils/testing.rs:177-184; rust/lance-core/src/utils/testing.rs:238-250; rust/lance-core/src/utils/testing.rs:287-295)`);
append('L4-crosscutting/cookbook.md',`When changing rate feedback, preserve validated config boundaries, strict threshold comparison and old-window/new-outcome ordering. Add exact-equality, idle-gap and arithmetic-limit cases to the existing AIMD tests using their explicit-time helper; inspect external admission/token-bucket callers before claiming throughput behavior. (rust/lance-core/src/utils/aimd.rs:102-184; rust/lance-core/src/utils/aimd.rs:247-289; rust/lance-core/src/utils/aimd.rs:410-679)

For fault-injection tests, wrap a target ObjectStore and share ProxyObjectStorePolicy through Arc<Mutex<_>>. Select the actual operation string from the [override matrix](../L1-modules/rust-lance-core-control-testing.md); policy names identify replacement/removal slots, not automatic operation filters. Each callback itself must check the operation/path as appropriate. Avoid requiring before policies on list/list_with_delimiter or metadata errors to behave identically across list/head. For listing-count tests supply an Arc<AtomicUsize> and distinguish stream creation from polling the async delimiter method. Concrete test consumers and dependency default methods still require analysis before a complete backend-extension recipe can be written. (rust/lance-core/src/utils/testing.rs:27-87; rust/lance-core/src/utils/testing.rs:100-120; rust/lance-core/src/utils/testing.rs:165-300)`);
const manifest=JSON.parse(read('MANIFEST.json')),state=JSON.parse(read('iteration-state.json'));state.totals=manifest.totals;state.read_not_analyzed=[];state.next='VERIFY10 confirms four prior corrections plus AIMD, test wrappers and seed corpora. Then analyze Bloom filters and cache files.';state.acceptance_gaps=['2005 files pending','294 binary files pending','VERIFY10 pending','all five complete self-sufficiency answers fail','whole-repository callers/callees pending'];write('iteration-state.json',JSON.stringify(state,null,2));
let entry=read('README.md');entry=entry.slice(0,entry.indexOf('## Current checkpoint'))+`## Current checkpoint

54 of2,059 files and19,855 of1,166,813 text lines are analyzed. Coverage includes all15 protobuf-subsystem files, thirty-four lance-core files and five other contributor guides. The symbol index contains2,426 records:971 protobuf and1,455 Rust declarations. All294 binary files remain pending.

Nine VERIFY cycles are recorded. VERIFY9 confirmed20/20 random claims and structural validity of4,981 citations/3,332 links, but identified four supplemental precision issues. ANALYZE10 corrected those and documented AIMD, object-store test instrumentation and two seed corpora. VERIFY10 is next. Global acceptance still fails:2,005 files and all five complete self-sufficiency answers are pending. See [iteration state](iteration-state.json) and [verification log](verification-log.md).

Analysis records may retain superseded drafts for provenance. Follow each file's current analysis_record in MANIFEST and its current L2 document; verification snapshots intentionally retain the claims as they were sampled.
`;write('README.md',entry);
console.log(JSON.stringify({symbols:symbols.length,totals:manifest.totals}));
