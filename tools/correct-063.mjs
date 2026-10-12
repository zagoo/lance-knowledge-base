import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p)),write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const path='rust/lance-file/src/reader.rs',m=read('MANIFEST.json'),e=m.files.find(f=>f.path===path),f=structuredClone(read(e.analysis_record).files.find(f=>f.path===path));
const r=f.ranges.find(r=>r[0]===3562&&r[1]===3617),before=r[2];
if(!before.includes('opens eager baseline full projection with127-row batches'))throw Error('Unexpected old claim');
r[2]='assert_lazy_projection_matches_eager_and_reads_metadata_subset opens an eager reader with full metadata, then reads the supplied column projection over RangeFull in127-row batches. It next opens a fresh-cache indexed reader for the same supplied projection. Computes all/selected CMO bytes and requires total>8*selected. Open cost is excluded from the subsequent measured zero-row read by resetting incremental IO statistics after both opens (rust/lance-file/src/reader.rs:3618-3649). Full metadata loading does not mean the baseline data read selects all file columns.';
const syms=read('analysis/rust-symbols.json');let derived=0;for(const s of syms)if(s.path===path&&s.behavior.includes(before)){s.behavior=s.behavior.replace(before,r[2]);derived++;}
write('analysis/rust-symbols.json',syms);write('analysis/iteration-063-verify-corrections.json',{iteration:63,files:[f],changes:[{path,start:3562,end:3617,claim_id:15,kind:'projection versus metadata scope clarification',before,after:r[2],reason:'The eager open loads full metadata, but read_stream_projected explicitly receives the supplied projection; the old wording conflated these scopes.'}],derived_symbol_descriptions_synchronized:derived});
console.log({changes:1,derived_symbols:derived});
