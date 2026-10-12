import fs from 'node:fs';
import path from 'node:path';
import {output} from './inventory.mjs';
const file=path.join(output,'verification/iteration-009.json'),v=JSON.parse(fs.readFileSync(file,'utf8'));
if(v.checks.accuracy.manual_pass!==null)throw new Error('Already recorded');
const notes=[
 'Both private structs, field types, derives and heap delegation match. Zero-row omission is explicitly a later construction step and was inspected at391-407.',
 'All metadata fields/tags and oneof match; distinction from generic detail messages is maintained.',
 'Enum values/polarities, empty/all markers and start/length fields match exactly.',
 'Matches public TODO, fixed Schema error text, root inclusion and field_ids iteration. Additionally inspected Field descendant-only search at1113-1139 and Schema pre-order stack at82-112.',
 'Matches top-level names/reserved IDs/duplicate checks and dimension call. Additionally inspected Field::data_type at171-193 for panic paths; primary-key validation remains separate.',
 'Matches both backoff test builders and every asserted millisecond value.',
 'Matches optional value and replace contract; present empty differs from absence. Converter ordering remains explicitly pending.',
 'Matches every get branch, physical bound and nested Option result exactly.',
 'Matches three child-size branches. Also read trait default38-44 and HashSet formula213-220 for the cited cross-file explanation.',
 'Matches clone/merge/append/metadata order and lack of ID assignment. Additionally read reset_id and test_merge_schemas_and_assign_field_ids at2371-2413 for imported -1 and explicit reassignment.',
 'Matches documented wrapper, Cargo manifest commands and Java11 claim; command success and actual build files remain unverified.',
 'Matches stack allocation, reversed pushes and forward pre-order traversal; no recursive iterator call.',
 'Matches debug assertion, bit formula and all four doctest examples; invalid alignment is not a Result path.',
 'Matches per-field bitmap order and distinction between covered NULL and absent offset.',
 'Matches non-leaf/nullable/List/LargeList/Map checks. Additionally inspected ancestry634-648 and is_leaf1166-1168; primitive fixed-size-list representation is covered in the reviewed Arrow conversion.',
 'Matches both B-tree formulas and approximate three-pointer rationale, with allocator/occupancy limitations retained.',
 'Matches adapter scope, private Arc state and constructor validation precondition without a validator call.',
 'Matches swallowed conversion reason, nested exclusion, metadata clone and parsed-path accessors; no new mutable input state.',
 'Matches inline/lower-bound assertions and shared Arc context four-byte then zero child accounting. Clarify three element bytes wording to three element sizes for readability.',
 'Matches parked ownership/drop/wake/send/timeout test. Additionally read Drop83-125 to verify wake after mutex release.'
];
for(const s of v.checks.accuracy.samples){s.manual_review='pass';s.review_note=notes[s.id-1];}
v.checks.accuracy.reviewed_count=20;v.checks.accuracy.passed_count=20;
v.checks.accuracy.manual_pass=false;
v.checks.accuracy.supplemental_findings=[
 {kind:'citation precision',document:'L3-symbols/format-spec.md',finding:'Several LSPC decode header table citations point to neighboring magic/version/field lines. Correct to version254-257, repr258-263, dimensions264-267, total266.'},
 {kind:'symbol declaration mismatch',symbol:'lance_core::utils::row_addr_remap::RowAddrRemap::Compact',finding:'Manual symbol points at documentation line66 instead of variant declaration67, so its signature is a comment. Correct record/generator and regenerate L1/L3.'},
 {kind:'range precision',document:'L2-files/rust/lance-core/src/utils/stable_partition.rs.md',finding:'237-262 note mentions decoded dimensions whose actual reads are264-266. Move that statement to the following range and make header range end263.'},
 {kind:'stale status',document:'L2-files/rust/lance-core/src/utils/fragment_reuse.rs.md',finding:'47-59 says remap memory/validation remain pending although this iteration analyzes them. Replace with exact current local references; full external integration remains pending.'}
];
v.checks.accuracy.prior_corrections={pass:true,details:['SharedStream lock/return references184-195 and225-246 confirmed','Error disk-cap constructor768-775 and cap100/used50 recovery test1311-1327 confirmed']};
for(const s of v.checks.line_accountability.samples){s.manual_review='pass';s.review_note='Reviewed grouped authored annotations against every listed top-level declaration/heading. Full contiguous ranges and exact numbered source validated by fresh scan; two-line license read literally. This is analyzed-scope sampling, not whole-repository coverage.';}
v.checks.line_accountability.manual_pass=true;v.checks.line_accountability.top_level_items_reviewed=v.checks.line_accountability.samples.reduce((n,s)=>n+s.top_level_items.length,0);v.checks.line_accountability.mapping_evidence='verification/iteration-009-top-level-audit.json';
v.checks.self_sufficiency.kb_only_documents=['L4-crosscutting/scenarios.md','L4-crosscutting/cookbook.md','L3-symbols/format-spec.md','L1-modules/rust-lance-core-row-mapping.md'];
v.checks.self_sufficiency.answers={
 write_then_compact:'FAIL: KB can compute local retained-rank and nullable-label row remaps and describe adapter semantics. Dataset::write/compact_files orchestration, encoder/IO scheduling, persisted FRI traversal/selection, manifest commit and cleanup are still absent.',
 new_scalar_index:'FAIL: protobuf schemas, generic core traits and local mapping primitives do not supply the complete scalar index traits, factories, query registration, bindings, testing and compatibility recipe.',
 v2_format:'FAIL: protobuf envelope/layout declarations and one LSPC helper codec are documented, but complete runtime file2/encoding bit layouts, accepted/emitted gates and fixture evidence remain absent.',
 python_api:'FAIL: only contributor guidance is covered; complete Python public signatures, defaults and Rust/PyO3 mapping are missing.',
 transaction_commit:'FAIL: operation protobuf and core errors/backoff/remap semantics exist; commit dispatch, concurrency/conflict rules and persisted storage protocol are still missing.'
};
v.reviewed_at=new Date().toISOString();v.overall_pass=false;fs.writeFileSync(file,JSON.stringify(v,null,2)+'\n');
fs.appendFileSync(path.join(output,'verification-log.md'),`\n## Iteration 9 — VERIFY — FAIL (coverage, supplemental precision, self-sufficiency)\n\n- Evidence: [machine record](verification/iteration-009.json), [top-level mappings](verification/iteration-009-top-level-audit.json). Seed ${v.seed}; full rescan found no source drift and the checkout remains clean.\n- Claimed scope: 50 files / 18,855 lines, all exact source lines and contiguous authored ranges present. Repository acceptance FAIL: 2,009 files including all294 binary files still pending.\n- Line accountability: 25 sampled files, ten each for proto/core and all smaller guide groups; ${v.checks.line_accountability.top_level_items_reviewed} lexical top-level candidates checked against authored notes. Sampled coverage PASS.\n- Accuracy:20/20 random claims confirmed with supplemental callee/test reads. Supplemental audit found four maintenance issues: one variant signature indexed its preceding comment, counts-header citations use nearby lines, a decode note crosses its assigned range, and adapter text still calls newly analyzed remap behavior pending. Accuracy acceptance FAIL until corrected in ANALYZE10. Prior two citation corrections confirmed.\n- Cross-links: structural PASS; all4,981 source references and3,332 local links resolve. Resolution alone did not catch the nearby-line precision issues.\n- KB-only self-sufficiency: all five questions remain FAIL. New local ordered/stable-partition traces and counts codec do not complete any repository-wide question.\n- Decision: ANALYZE10 corrects the four supplemental issues and continues remaining core files. No completion report; active goal remains incomplete.\n`);
fs.writeFileSync(path.join(output,'iteration-state.json'),JSON.stringify({iteration:10,phase:'ANALYZE',completed:false,previous_verification:'verification/iteration-009.json',totals:v.totals,read_not_analyzed:[],next:'Correct four VERIFY9 supplemental issues, then analyze remaining core algorithms/cache.',acceptance_gaps:['2009 files pending','294 binary files pending','four VERIFY9 supplemental corrections','all five complete self-sufficiency answers fail','whole-repository callers/callees pending']},null,2)+'\n');
console.log(JSON.stringify({seed:v.seed,claims:'20/20 pass',supplemental_findings:4,top_level_items:v.checks.line_accountability.top_level_items_reviewed,next_iteration:10}));
