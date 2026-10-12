import fs from 'node:fs';import path from 'node:path';import{output}from './inventory.mjs';
const read=f=>JSON.parse(fs.readFileSync(path.join(output,f),'utf8')),write=(f,v)=>fs.writeFileSync(path.join(output,f),JSON.stringify(v,null,2)+'\n');
const file='verification/iteration-028.json',v=read(file);if(v.checks.accuracy.manual_pass!==null)throw new Error('Already recorded');
const notes=[
'Matches pending handshake, abort/cancel check, five-second post-abort timeout and result/count assertions; supplemental1413-1434 confirms earlier unbounded owner-start wait.',
'Matches derives/private fields and legacy schema constants; supplemental cache/mod.rs128-138,175-182 confirms both default bridges.',
'Matches binary-search boundaries and exponent range. Supplemental173-183 confirms1u64 shift; midpoint cannot reach64.',
'Matches replacing/removing policy maps and signatures. Supplemental29-66,89-121 confirms Default maps, private aliases/public bounds and external Mutex.',
'Matches inline/column arms, physical ordering and flag2048 comment contract. Supplemental288-305 confirms empty marker and v2-only carrier contract.',
'Matches documented OffsetMapper order requirement, example and zero cached state; no total-row field.',
'Matches one-success/two-throttle fixture and strict greater-than discrepancy. Actual algorithm238-290 was re-read in this active turn.',
'Matches Some options/version and delegated file conversion; supplemental97-104 confirms clone/optimize/serialization.',
'Matches malformed covering prefix rejection through TryFrom and InvalidInput/message assertions.',
'Matches double-Arc unsized insertion and no codec/metric. Supplemental cache helpers189-248 and deepsize182-189 confirm sizing/accessor registration and omitted inner refcounts.',
'Matches production/test defaults. Supplemental split_version786-816 and bump769-783,893-908 confirm clean strings and preserved pre/build.',
'Matches reported-capacity heuristic and recursive live children; no exact-allocation claim.',
'Matches SimdInfo public fields/derives and x86-only diagnostic feature list.',
'Matches mutation order and preserved outer fields; supplemental minimal fields55-60 and Arrow conversion1204-1215,1294-1305 confirm data/uri children with unassigned IDs.',
'Matches derive fixture lower bound; supplemental full local test section301-438 confirms stated absent cases. Source tests were not executed.',
'Matches four contenders/two workers and owner-start handshake; supplemental298-300 confirms Moka selection.',
'Matches length-only conversion and equality assertions, including absence of empty Set/Bitmap versus NoDeletions comparisons.',
'Matches approximation/projection tags and schema-width rationale; supplemental ann.proto28-41 confirms three presence states.',
'Matches raw string/path URI parsing assertions without claiming constructor interpretation.',
'Matches exact identity roundtrip and four alias rejection checks; supplemental283-289 confirms the five exact variants.'
];for(const s of v.checks.accuracy.samples){s.manual_review='pass';s.review_note=notes[s.id-1];}v.checks.accuracy.manual_pass=true;v.checks.accuracy.reviewed_count=20;v.checks.accuracy.passed_count=20;
const a=read('verification/iteration-028-top-level-audit.json');for(const s of v.checks.line_accountability.samples){const f=a.find(f=>f.path===s.path);s.manual_review='pass';s.review_note=f.unchanged_from_current_turn_review?'Identical declaration-to-range mapping manually reviewed in VERIFY27 earlier in this same active turn.':'Fresh declaration-to-authored-range review in VERIFY28; full physical ranges accounted for.';}
v.checks.line_accountability.manual_pass=true;v.checks.line_accountability.top_level_items_reviewed=568;v.checks.line_accountability.mapping_evidence='verification/iteration-028-top-level-audit.json';v.checks.line_accountability.fresh_files_reviewed=14;v.checks.line_accountability.same_active_turn_reused_files=28;
v.checks.self_sufficiency=read('verification/iteration-027.json').checks.self_sufficiency;v.checks.self_sufficiency.review_note='Reattempted all five KB-only questions: the only analysis change since VERIFY27 corrects AIMD fixture chronology. It supplies none of the missing end-to-end implementations; the five known/missing answers remain accurate.';
v.corrections_reviewed=[{path:'rust/lance-core/src/utils/aimd.rs',range:[516,545],result:'PASS: five nonempty evaluations total across five loop records plus the final record; source algorithm and fixture were both re-read this turn.',analysis_record:'analysis/iteration-028-aimd-correction.json'}];
v.overall_pass=false;v.reviewed_at=new Date().toISOString();write(file,v);
fs.appendFileSync(path.join(output,'verification-log.md'),`\n## Iteration 28 — ANALYZE then VERIFY — FAIL (global coverage and self-sufficiency)\n\n- Corrected AIMD no-ceiling test chronology: five loop records followed by one final record evaluate five nonempty windows total. Updated current L2 analysis and derived symbol behavior; old drafts and failed snapshot retained for provenance. No new file coverage claimed.\n- [Verification](verification/iteration-028.json), [top-level audit](verification/iteration-028-top-level-audit.json); seed ${v.seed}. Full source/hash scan unchanged. Claimed-scope structure PASS:93 files /33,451 lines,3,822 symbols.\n- Line accountability PASS:568 lexical candidates across42 files;14 newly sampled files reviewed and28 identical reviews reused from VERIFY27 in this same active turn. Declaration-free content was read in this turn. Accuracy PASS:20/20 fresh random claims plus targeted review of the AIMD correction.\n- Cross-links PASS:8,685 citations and5,549 links. Global FAIL:1,966 files including294 binary pending and all five complete self-sufficiency answers unavailable. No source edits, network, build/test/benchmark execution.\n- Decision: ANALYZE29 continues row-ID version/sequence structures before transaction/IO. Goal active; no completion report.\n`);
write('iteration-state.json',{iteration:29,phase:'ANALYZE',completed:false,previous_verification:file,totals:v.totals,read_not_analyzed:[{path:'rust/lance-table/src/utils/stream.rs',note:'Prior truncated read; reread all1887 lines before analysis.'}],next:'Fully read and analyze rowids/version.rs and related row-ID sequence structures; connect metadata wrappers/feature flags. Then transaction builder/conflicts and IO. Update all layers before VERIFY29.',acceptance_gaps:['1966 files pending','294 binary files pending','all five self-sufficiency answers fail','full runtime format and call graph pending']});
let r=fs.readFileSync(path.join(output,'README.md'),'utf8');r=r.slice(0,r.indexOf('## Current checkpoint'))+`## Current checkpoint

93 of 2,059 files and 33,451 of 1,166,813 inventory text lines are analyzed. Coverage includes all 15 protobuf-subsystem files, all 48 lance-core files, 18 lance-table entries, seven lance-file entries and five other contributor guides. The symbol index contains 3,822 records: 971 protobuf and 2,851 Rust. All 294 binary files remain pending.

Twenty-eight VERIFY cycles are recorded. After an AIMD annotation correction, VERIFY28 passed 20/20 fresh sampled claims, 568 declaration mappings across 42 sampled files, and checks of 8,685 citations plus 5,549 links. Source remains clean and unchanged. Global acceptance still fails: 1,966 files and all five complete self-sufficiency answers remain pending. ANALYZE29 continues row-ID version/sequence analysis. See [iteration state](iteration-state.json) and [verification log](verification-log.md).

Analysis records retain superseded drafts for provenance. Follow each file's current analysis_record in MANIFEST and its current L2 document; verification snapshots intentionally retain sampled claims. Source tests and benchmarks were read, not executed.
`;fs.writeFileSync(path.join(output,'README.md'),r);console.log({claims:'20/20',top_items:568,next:29});
