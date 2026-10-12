import fs from 'node:fs';import assert from 'node:assert/strict';
const read=p=>JSON.parse(fs.readFileSync(p)),m=read('MANIFEST.json'),corrections=[
{path:'rust/lance-encoding/src/data.rs',start:2166,kind:'sampled claim4 test-input precision',old:'across null/empty values.',replacement:'across null and nonnull strings; this fixture has no empty-string input.'},
{path:'rust/lance-core/Cargo.toml',start:53,kind:'line-audit progress refresh',old:'This comment needs confirmation in error.rs before asserting measured overhead.',replacement:'The zero-sized no-backtrace field is confirmed by error.rs; it does not imply a zero-sized Error enum or measured overhead. (rust/lance-core/src/error.rs:33-56)'}
];const files=[];for(const c of corrections){const e=m.files.find(f=>f.path===c.path),f=structuredClone(read(e.analysis_record).files.find(f=>f.path===c.path)),r=f.ranges.find(r=>r[0]===c.start);assert(r[2].includes(c.old));c.previous_analysis=e.analysis_record;c.before=r[2];r[2]=r[2].replace(c.old,c.replacement);c.after=r[2];files.push(f);}
fs.writeFileSync('analysis/iteration-080-correction-batch.json',JSON.stringify({iteration:80,files},null,2)+'\n');
const symbols=read('analysis/rust-symbols.json');for(const s of symbols)for(const c of corrections)if(s.path===c.path&&s.behavior?.includes(c.old))s.behavior=s.behavior.replaceAll(c.old,c.replacement);fs.writeFileSync('analysis/rust-symbols.json',JSON.stringify(symbols,null,2)+'\n');
fs.writeFileSync('verification/iteration-080-corrections.json',JSON.stringify({iteration:80,random_claim_mismatches:1,progress_refreshes:1,unresolved:0,source_changes:0,corrections},null,2)+'\n');console.log({corrected:1,progress_refreshes:1});

