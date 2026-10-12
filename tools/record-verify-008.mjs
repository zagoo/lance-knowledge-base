import fs from 'node:fs';
import path from 'node:path';
import {output} from './inventory.mjs';
const file=path.join(output,'verification/iteration-008.json'),v=JSON.parse(fs.readFileSync(file,'utf8'));
if(v.checks.accuracy.manual_pass!==null)throw new Error('Already recorded');
const notes=[
 'Matches consuming Vec sort and borrowed Set clone; public enum variants at 14-21 establish absence of an enforced global small-set bound.',
 'Matches default-hasher HashSet implementation and capacity/child formula; adjacent HashMap generic-S contrast was reviewed.',
 'Matches architecture cfg, private module, AVX512 prerequisite, CPUID EDX bit23 and safety-compatibility annotation.',
 'Matches file-layout comments exactly; examples are not promoted to backend guarantees.',
 'Matches replacement group fields and repeated operation payload, with unknown selection semantics retained.',
 'Matches all PQ fields/tags and both dimension-times-power-of-two descriptions.',
 'Matches owned handle/string fields and cloned String result; clone does not contain a TempDir owner.',
 'Matches metric numbers, ordered stage list and IVF/PQ example; distance formula remains unspecified.',
 'Matches adapter scope, Debug/Arc state and validation precondition without constructor checks.',
 'Matches sequential await, order/duplicates/None preservation and ? short-circuit; cancellation/rollback limits are explicit deductions.',
 'Matches five boxed-IO conversions; additionally inspected spawn_cpu at 194-208 for distinct panic resumption.',
 'Matches config/table-metadata distinction and reserved former blob field number/name.',
 'Matches OPQ, matrix position/shape/type and Flat empty marker.',
 'Matches exact signatures and documented internal row-ID meaning; no implementation policy is invented.',
 'Matches all error-policy bullets, preserving the narrower expect qualification.',
 'Matches readiness/peer/permit/counter/clone order; additionally read lock reacquisition at 184-195 and original-result return at 225-246. Add these cross-range citations for tighter claim traceability.',
 'Matches variant fields/transparent sources. Additionally inspected disk_cap_exceeded at 768-775 and recovery test at 1311-1327 to verify unvalidated cap100/used50. Add those exact cross-range citations.',
 'Matches node/mutation fields and signed after-minus-before contract with validation distinguished from code.',
 'Matches writer-version fields, semver component separation, absent-field behavior and diagnostic intent.',
 'Matches all ten literal labels and write_str; no intermediate String allocation appears.'
];
for(const s of v.checks.accuracy.samples){s.manual_review='pass';s.review_note=notes[s.id-1];}
v.checks.accuracy.manual_pass=true;v.checks.accuracy.reviewed_count=20;v.checks.accuracy.passed_count=20;
v.checks.accuracy.follow_up_precision=['Attach exact lock/return cross-range citations to sample16','Attach exact constructor/test cross-range citations to sample17'];
v.checks.accuracy.prior_corrections={pass:true,details:['Quoted-field test statement now describes both Arrow import attempts, not direct invalid core Schema construction','Rust concurrency policy references tokio.rs and qualifies configurable sizing','Build/test citation corrected to the 90-line Rust guide; full link/citation scan passes','Verifier now samples only each MANIFEST entry current analysis_record']};
const audit=JSON.parse(fs.readFileSync(path.join(output,'verification/iteration-008-top-level-audit.json'),'utf8'));
for(const s of v.checks.line_accountability.samples){const a=audit.find(a=>a.path===s.path);s.manual_review='pass';s.review_note=a.unchanged_from_verify7?'Authored top-level mapping unchanged from this turn VERIFY7 review; complete source/range structure revalidated in this scan.':'Authored top-level ranges reviewed this turn; declarations are covered. License header has no top-level declarations and both literal lines were reviewed. Current new-source annotations and changed policy were read in full.';}
v.checks.line_accountability.manual_pass=true;v.checks.line_accountability.top_level_items_reviewed=v.checks.line_accountability.samples.reduce((n,s)=>n+s.top_level_items.length,0);v.checks.line_accountability.mapping_evidence='verification/iteration-008-top-level-audit.json';
v.checks.self_sufficiency.kb_only_documents=['L4-crosscutting/scenarios.md','L3-symbols/format-spec.md','L4-crosscutting/cookbook.md','L1-modules/rust-lance-core-deletion-mapping.md'];
v.checks.self_sufficiency.answers={
 write_then_compact:'FAIL: local deletion predicate, visible-offset mapper and one-rewrite adapter are now described, in addition to schema projection. The KB still lacks Dataset::write/compact_files orchestration, encoder/IO scheduling, atomic commits, remap generation/graph traversal and cleanup.',
 new_scalar_index:'FAIL: protobuf details plus generic memory/IO traits are covered; scalar index implementation traits, registry/factory/planner/binding/test recipe remain missing.',
 v2_format:'FAIL: schema envelope/footer and declared 2.2/2.3 gates are documented. Runtime accepted/emitted versions, full byte algorithms, decoder validation and historical fixture evidence are still absent.',
 python_api:'FAIL: contributor guidance is present, but Python public signatures and PyO3 mappings remain unanalyzed.',
 transaction_commit:'FAIL: protobuf operations, typed error signals and pure delay generators are known. Commit dispatch/conflict matrix, retries and storage protocol remain absent; a physical-address mapping adapter does not establish commit integration.'
};
v.reviewed_at=new Date().toISOString();v.overall_pass=false;fs.writeFileSync(file,JSON.stringify(v,null,2)+'\n');
fs.appendFileSync(path.join(output,'verification-log.md'),`\n## Iteration 8 — VERIFY — FAIL (global coverage and self-sufficiency)\n\n- Evidence: [machine record](verification/iteration-008.json), [top-level mappings](verification/iteration-008-top-level-audit.json). Random seed ${v.seed}; source remains clean and unchanged.\n- Coverage: all 48 claimed files / 16,833 lines have complete contiguous annotations and exact evidence. Full scan still finds 2,011 pending files, including all 294 binary files. Repository acceptance FAIL.\n- Line accountability: 25 sampled files, ten each for proto/core and all smaller guide groups; ${v.checks.line_accountability.top_level_items_reviewed} top-level candidates reviewed. Unchanged mappings from VERIFY7 were compared exactly; new/changed mappings inspected. Sampled coverage PASS.\n- Accuracy: 20/20 random claims confirmed. Supplemental source reads confirmed the SharedStream lock/return flow and disk-cap constructor/test examples; attach their exact cross-range citations in ANALYZE9 for more direct traceability. The previous three corrections are confirmed.\n- Cross-links: PASS, 4,499 source citations and 3,056 local links resolve; no broken references. This is structural validity, not independent semantic confirmation of every claim.\n- Self-sufficiency: all five full questions still FAIL using only the KB. New deletion/mapping local traces do not complete write/compaction, scalar extension, executable v2 formats, Python API mappings or transaction conflict/commit protocol.\n- Decision: continue ANALYZE9 with citation precision and RowAddrRemap/remaining core files. No completion report; the goal remains active and incomplete.\n`);
fs.writeFileSync(path.join(output,'iteration-state.json'),JSON.stringify({iteration:9,phase:'ANALYZE',completed:false,previous_verification:'verification/iteration-008.json',totals:v.totals,read_not_analyzed:[],next:'Attach two verified cross-range citations, then analyze RowAddrRemap and remaining core utilities/cache.',acceptance_gaps:['2011 files pending','294 binary files pending','all five complete self-sufficiency answers fail','whole-repository callers/callees pending']},null,2)+'\n');
console.log(JSON.stringify({seed:v.seed,accuracy:'20/20 pass',top_level_items:v.checks.line_accountability.top_level_items_reviewed,next_iteration:9,overall_pass:false}));
