import fs from 'node:fs';
import path from 'node:path';
import {output} from './inventory.mjs';
const file=path.join(output,'verification/iteration-007.json');const v=JSON.parse(fs.readFileSync(file,'utf8'));
if(v.checks.accuracy.manual_pass!==null)throw new Error('Already manually recorded');
const notes=[
 'Matches three no-jitter tests: min100, max75, and reset attempt/value behavior.',
 'Matches recursive Struct/List merging and equal-width fixed list/binary fast paths; mutation precedes possible later error.',
 'Both tracked constructors and direct-only fence_reason match the code.',
 'Exact borrowed Schema/row IDs/Result batch signature and absence of implementation match. Core Result import is in the same complete file.',
 'Matches waker replacement/Pending; additionally inspected two-handle construction at 47-80 and acquired permit lifetime at 159-170.',
 'Matches exact-set/Bloom fields and comment-vs-proto-default distinction; no threshold is invented.',
 'Matches three buffer/null/child loops and capacity dedup; no ArrayData metadata charge appears.',
 'Matches Backpressure constructor/direct accessor and IOSnafu source retention.',
 'Matches Option::take on Ready(None); inspected wrapper at 277-289 for callback ownership and no Drop implementation.',
 'Matches projection branches; additionally checked parse_field_path at 1581-1663, field at 527-531 and Field::project at 697-725. Reparsing through resolve and missing-child success are distinguished.',
 'Matches independent lifetimes, char count, empty early return and integer threshold.',
 'Matches enum meanings, marker messages and range start/length fields.',
 'Matches all policy bullets and appropriately distinguishes the narrower expect qualification.',
 'Matches selection order and FMA rationale; additionally checked LazyLock at 164, fresh report at 90-95 and AVX512 helpers at 236-253.',
 'Matches three option-enabled inequality checks and explicit set_id; Field derive is separately established at 134-161.',
 'Matches debug assertion, popped values and permit increments; additionally checked lock acquisition and pending counter at 82-99.',
 'Matches source documentation and already-cited actual implementation/sizing corrections. No benchmark claim is made.',
 'Faithfully reports the repository guide presence/design rules rather than claiming runtime generated-accessor inspection.',
 'FAIL: first two sentences match the test, but the last says it distinguishes resolution in a manually constructed schema. This test creates both candidates through Schema::try_from(&ArrowSchema), and does not exercise manually built invalid core Schema. Narrow the sentence to imported nested names versus rejected top-level names.',
 'Matches sorted-map rejection, Struct/type/length/null-key guards and recursive entries conversion; exactly-two/name/entries-null checks are absent here.'
];
for(const s of v.checks.accuracy.samples){s.manual_review=s.id===19?'fail':'pass';s.review_note=notes[s.id-1];}
v.checks.accuracy.manual_pass=false;v.checks.accuracy.reviewed_count=20;v.checks.accuracy.passed_count=19;
v.checks.accuracy.supplemental=[{pass:false,source:'rust/AGENTS.md:20-23',issue:'The policy L2 says compare spawn_cpu guidance with cpu.rs, but the runtime implementation is utils/tokio.rs. Correct the module pointer and attach exact implementation citations.'},{pass:true,source:'rust/lance-core/src/datatypes/field.rs:467-522',issue:'VERIFY6 set_dictionary callee correction confirmed: children.iter_mut().find/unwrap is used, not child_mut.'}];
for(const s of v.checks.line_accountability.samples){s.manual_review='pass';s.review_note='Inspected lexical top-level candidates mapped to authored L2 ranges in iteration-007-top-level-audit.json; each item has an authored description, and structural scan confirmed the complete numbered source and contiguous full-file ranges. Nested behavior is not established solely by lexical detection.';}
v.checks.line_accountability.manual_pass=true;v.checks.line_accountability.top_level_items_reviewed=v.checks.line_accountability.samples.reduce((n,s)=>n+s.top_level_items.length,0);
v.checks.line_accountability.mapping_evidence='verification/iteration-007-top-level-audit.json';
v.checks.self_sufficiency.kb_only_documents=['L4-crosscutting/scenarios.md','L3-symbols/format-spec.md','L4-crosscutting/cookbook.md','L1-modules/rust-lance-core-storage.md'];
v.checks.self_sufficiency.answers={
 write_then_compact:'FAIL: KB can trace Arrow import, Field ID assignment and projection materialization, plus schema-level overlay ordering. It cannot identify the exact Dataset::write/compact_files entry flow, IO/encoder scheduling, atomic commit, index remapping or cleanup.',
 new_scalar_index:'FAIL: KB has protobuf kind/detail envelopes and generic memory/IO-accounting seams. It lacks scalar index traits, factory/registry, planner registration, load/write/update implementation and binding/test recipe.',
 v2_format:'FAIL: KB reconstructs declared file2 envelope/footer, layout/compression union tags and schema gates for 2.2/2.3 extensions. It still lacks full byte algorithms, executable version acceptance/emission gates and released compatibility fixture evidence.',
 python_api:'FAIL: only Python contributor guide is analyzed; no complete Python public API inventory or PyO3-to-Rust mapping exists.',
 transaction_commit:'FAIL: transaction protobuf operations, overlay restamping and error signal constructors are known. Runtime Operation dispatch, conflict-resolution matrix, retries and commit storage protocol remain absent. Backoff duration generators do not establish transaction policy.'
};
v.reviewed_at=new Date().toISOString();v.overall_pass=false;
fs.writeFileSync(file,JSON.stringify(v,null,2)+'\n');
fs.appendFileSync(path.join(output,'verification-log.md'),`\n## Iteration 7 — VERIFY — FAIL\n\n- Evidence: [machine record](verification/iteration-007.json), [top-level mappings](verification/iteration-007-top-level-audit.json). Random seed: ${v.seed}. No source modification or runtime tests.\n- Full scan: 2,059 included files, 1,166,813 text lines, 294 binary files; clean unchanged source and no inventory drift. All 46 claimed analyzed files / 16,167 lines have exact numbered evidence and contiguous authored coverage. Repository coverage fails: 2,013 files pending.\n- Line accountability: 25 sampled files, including ten proto files, ten core files and all smaller policy groups; ${v.checks.line_accountability.top_level_items_reviewed} lexical top-level candidates reviewed against authored ranges. PASS for sampled item coverage; this is not a semantic parser or proof of whole-repository completeness.\n- Accuracy: 19/20 random claims pass. Sample 19 overstates what the quoted-field test demonstrates: both schemas are Arrow imports, not direct core Schema construction (rust/lance-core/src/datatypes/schema.rs:1985-2043). Supplemental review found the Rust concurrency policy annotation points at the wrong implementation module; actual pool code is rust/lance-core/src/utils/tokio.rs:12-208. Previous set_dictionary callee correction is confirmed against rust/lance-core/src/datatypes/field.rs:467-522.\n- Cross-links: FAIL. 4,282 source citations and 2,923 local links checked; one citation extends past the 90-line Rust guide. The invalid text is retained in JSON evidence; correct the new build/test paragraph in ANALYZE8.\n- KB-only self-sufficiency: all five FAIL. New core utility contracts do not supply dataset write/compaction, scalar registration, full runtime v2 encoding/gates, Python APIs or transaction conflict/commit algorithms. Detailed answers are in the machine record.\n- Decision: return to ANALYZE8; fix all three findings, retain failures as historical evidence and continue remaining core files before another verification cycle. No completion report is authorized by this result.\n`);
fs.writeFileSync(path.join(output,'iteration-state.json'),JSON.stringify({iteration:8,phase:'ANALYZE',completed:false,previous_verification:'verification/iteration-007.json',totals:v.totals,read_not_analyzed:[],next:'Fix sample19 schema-test wording, Rust concurrency module pointer and build/test guide citation; then continue remaining lance-core files.',acceptance_gaps:['2013 files pending','294 binary files pending','all five complete self-sufficiency answers fail','VERIFY7 three corrections required','whole-repository callers/callees pending']},null,2)+'\n');
console.log(JSON.stringify({seed:v.seed,manual_accuracy:'19/20',top_level_items:v.checks.line_accountability.top_level_items_reviewed,phase:'ANALYZE',next_iteration:8}));
