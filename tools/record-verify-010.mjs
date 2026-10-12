import fs from 'node:fs';import path from 'node:path';import {output}from './inventory.mjs';
const file=path.join(output,'verification/iteration-010.json'),v=JSON.parse(fs.readFileSync(file,'utf8'));if(v.checks.accuracy.manual_pass!==null)throw new Error('Already recorded');
const notes=[
 'Matches trait default construction and blanket forwarding; owned self and generic S are retained.',
 'Matches ten preloaded items, dropped sender, sequential full drain of both consumers and EOF checks.',
 'Matches every ASCII edit-distance case and missing Unicode coverage qualification.',
 'Matches variant shapes and transparent source rules; cross-range constructor/test citations were rechecked this turn.',
 'Matches contiguous run range, Roaring selection, excluded neighbors and exact endpoint ranks.',
 'Matches public constants,28-byte arithmetic, local version/tag and named corruption helper; format stability remains unasserted.',
 'Matches documentation rule and named checker/workflow as guide claims, without claiming execution.',
 'FAIL: actual working variable is new_path and each step calls new_path.clone().join(part), not full_path.clone().child(part). L1 storage table repeats wrong child callee. Correct current L2/L1/L3 and generator references.',
 'Matches ordinal example, monotonic-input requirement, private state and constructor zeroing.',
 'Matches all structural blob fixtures and UInt32-width rejection.',
 'Matches fixed-list fields/tags and open-ended scheme/optional signed level declaration.',
 'Matches constructor state; additionally read poll155-224 to confirm permit acquisition precedes peer-liveness handling, so zero bounded capacity does not recover when peer drops.',
 'Matches structural layer meaning and all numeric enum values; null/empty distinction retained.',
 'Matches all tri-state get branches and optional physical bound.',
 'Matches Display fields, recursive child formatting and omission list.',
 'Matches lower size hint, capacity fallback and iteration. Additionally read with_capacity and is_empty to confirm allocated-empty block means is_empty false.',
 'FAIL: panic-test behavior matches, but no PanicHookInfo import exists. Module imports only super::*; FutureExt is available through the parent import atline8 and Tokio paths are qualified. Remove invented import and keep actual panic-hook lifecycle.',
 'Matches cfg!(windows), backslash replacement, Unicode unwrap and unchanged non-Windows text; URI encoding is not performed.',
 'Matches page-wide symbol table, variable input/output, transparent description and exact fields.',
 'Matches pinned forwarding, take-on-EOF and synchronous at-most-once callback; no Drop callback or panic catch.'
];
for(const s of v.checks.accuracy.samples){s.manual_review=[8,17].includes(s.id)?'fail':'pass';s.review_note=notes[s.id-1];}
v.checks.accuracy.manual_pass=false;v.checks.accuracy.reviewed_count=20;v.checks.accuracy.passed_count=18;
v.checks.accuracy.prior_corrections={pass:true,details:['Compact variant signature now line67 declaration, not line66 comment','LSPC header-table decode references point to exact version/repr/shape/total lines','Decode authored ranges split237-263 and264-291 with dimensions in correct range','Adapter memory/validation status now links newly analyzed local remap; full integration remains pending']};
const audit=JSON.parse(fs.readFileSync(path.join(output,'verification/iteration-010-top-level-audit.json'),'utf8'));
for(const s of v.checks.line_accountability.samples){const a=audit.find(f=>f.path===s.path);s.manual_review='pass';s.review_note=a.unchanged_from_verify9?'Exact declaration/annotation mapping unchanged from VERIFY9 reviewed earlier this turn; fresh scan revalidated full source/ranges.':'All displayed top-level candidate mappings reviewed in grouped authored ranges. Path callee accuracy failure recorded separately; every declaration is covered.';}
v.checks.line_accountability.manual_pass=true;v.checks.line_accountability.top_level_items_reviewed=v.checks.line_accountability.samples.reduce((n,s)=>n+s.top_level_items.length,0);v.checks.line_accountability.mapping_evidence='verification/iteration-010-top-level-audit.json';
v.checks.self_sufficiency.kb_only_documents=['L4-crosscutting/scenarios.md','L4-crosscutting/cookbook.md','L3-symbols/format-spec.md','L1-modules/rust-lance-core-control-testing.md'];
v.checks.self_sufficiency.answers={
 write_then_compact:'FAIL: local schema/deletion/remap traces and rate/instrumentation primitives exist; executable Dataset write/compact orchestration, encoding/IO, FRI persistence, commits and cleanup are missing.',
 new_scalar_index:'FAIL: complete scalar index implementation traits, factory/query registration, bindings, tests and compatibility recipe remain missing; core mock stores are only test infrastructure.',
 v2_format:'FAIL: protobuf layouts and local LSPC codec cannot supply complete runtime encoders/decoders and version gate matrix.',
 python_api:'FAIL: Python public signatures/defaults and PyO3/Rust mapping remain unanalyzed.',
 transaction_commit:'FAIL: no exact operation dispatch/conflict matrix or commit/storage protocol; rate feedback and mock stores do not establish it.'
};v.reviewed_at=new Date().toISOString();v.overall_pass=false;fs.writeFileSync(file,JSON.stringify(v,null,2)+'\n');
fs.appendFileSync(path.join(output,'verification-log.md'),`\n## Iteration 10 — VERIFY — FAIL (coverage, two claim mismatches, self-sufficiency)\n\n- Evidence: [machine record](verification/iteration-010.json), [top-level mappings](verification/iteration-010-top-level-audit.json). Seed ${v.seed}; source clean and unchanged after full rescan.\n- Claimed scope PASS:54 files /19,855 lines with full contiguous annotations and exact source evidence. Repository acceptance FAIL:2,005 pending files, including294 binary files.\n- Line accountability:25 sampled files, ten proto and ten core plus all smaller guide groups;268 top-level candidates mapped. Changed/new mappings reviewed; exact unchanged mappings reused from VERIFY9 earlier this turn.\n- Accuracy:18/20 random claims PASS. Sample8 incorrectly names Path::child/full_path where code uses join/new_path; sample17 invents a PanicHookInfo import. Correct both in ANALYZE11. All four VERIFY9 corrections confirmed.\n- Cross-links: structural PASS;5,292 source citations and3,545 local links resolve. Semantic mistakes remain distinct from link resolution.\n- All five KB-only self-sufficiency answers still FAIL. AIMD/test wrappers/seed corpora add local infrastructure knowledge without completing repository-wide scenarios.\n- Decision: continue ANALYZE11, fix both inaccuracies and then read Bloom filters/cache. No completion report; goal remains active.\n`);
fs.writeFileSync(path.join(output,'iteration-state.json'),JSON.stringify({iteration:11,phase:'ANALYZE',completed:false,previous_verification:'verification/iteration-010.json',totals:v.totals,read_not_analyzed:[],next:'Fix VERIFY10 path helper callee and panic-test import inaccuracies, then analyze Bloom filters and cache files.',acceptance_gaps:['2005 files pending','294 binary files pending','two VERIFY10 mismatches','all five complete self-sufficiency answers fail','whole-repository callers/callees pending']},null,2)+'\n');console.log(JSON.stringify({claims:'18/20 pass',top_items:268,source_unchanged:true,next_iteration:11}));
