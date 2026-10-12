import fs from 'node:fs';import{root,linesOf}from './inventory.mjs';
const read=f=>fs.readFileSync(f,'utf8'),write=(f,v)=>fs.writeFileSync(f,JSON.stringify(v,null,2)+'\n'),append=(f,s)=>fs.appendFileSync(f,'\n\n'+s+'\n'),batch=JSON.parse(read('analysis/iteration-043-frag-reuse-gate.json')),added=[];
for(const a of batch.files){const src=linesOf(read(root+'/'+a.path)),module=a.path.endsWith('/gate.rs')?'gate':'metadata',prefix='lance_table::system_index::frag_reuse::'+module;let test=false,owner='';
function add(name,line,end_line,kind,visibility){const r=a.ranges.find(([b,e])=>b<=line&&line<=e);added.push({name:prefix+'::'+name,path:a.path,line,end_line,kind,visibility,behavior:r[2],behavior_reference:`${a.path}:${r[0]}-${r[1]}`,callers:test?'Local tests/fixtures; no execution.':module==='gate'?'Contextual Transaction::prepare_indices and manifest builder: rust/lance-table/src/transaction/manifest_build.rs:474-522 and rust/lance-table/src/transaction/manifest_build.rs:593-610; full global entrance proof pending.':'is_tagged/uses_tagged_fri consumed by gate/lineage/retention; validate_flags contextual restore188; clone guard contextual dataset3339 and commit449. Complete callers pending.',callees:module==='gate'?'is_tagged; uses_tagged_fri; RoaringBitmap disjointness; Error constructors. No assembly/IO.':'Predicates use name/version/flags; clone guard awaits read_manifest_indexes; Error constructors. Exact bodies in L2.'});}
for(let i=0;i<src.length;i++){if(/^mod tests/.test(src[i])){test=true;add('tests',i+1,i+1,'module','private cfg(test)');}const en=src[i].match(/^\s*(pub )?enum (\w+)/);if(en){owner=en[2];add((test?'tests::':'')+owner,i+1,i+1,'enum',test?'private cfg(test)':'public');continue;}if(owner){if(/^\s*}/.test(src[i]))owner='';else if(src[i].match(/^\s*\w+(?:\([^)]*\))?,\s*$/)){const name=src[i].trim().match(/^\w+/)[0];add((test?'tests::':'')+owner+'::'+name,i+1,i+1,'variant',test?'private cfg(test)':'public');}}
const fn=src[i].match(/^\s*(pub )?(async )?fn (\w+)/);if(fn){let end=i+1;while(!/[{;]\s*$/.test(src[end-1]))end++;add((test?'tests::':'')+fn[3],i+1,end,'function',test?'private cfg(test)':'public');}}
}
const paths=new Set(batch.files.map(f=>f.path)),prior=JSON.parse(read('analysis/rust-symbols.json')).filter(s=>!paths.has(s.path));write('analysis/rust-symbols.json',[...prior,...added]);
const api=added.filter(s=>s.visibility==='public').map(s=>{const src=linesOf(read(root+'/'+s.path));return `| \`${s.name}\` | \`${src.slice(s.line-1,s.end_line).join(' ').trim().replaceAll('|','\\|')}\` | [${s.path}:${s.line}-${s.end_line}](../L2-files/${s.path}.md) |`;}).join('\n');
append('L1-modules/rust-lance-table-transactions.md',`## Tagged-history gate and metadata guards

[Gate L2](../L2-files/rust/lance-table/src/system_index/frag_reuse/gate.rs.md) covers the complete ordered classifier and its45-case matrix plus migration test; [metadata L2](../L2-files/rust/lance-table/src/system_index/frag_reuse/metadata.rs.md) covers four public guards and two predicate tests. Parent modules are public. Classification does not assemble/validate history or mutate metadata. (rust/lance-table/src/system_index/frag_reuse.rs:4-7; rust/lance-table/src/system_index/frag_reuse/gate.rs:46-224)

| Symbol | Exact declaration | Evidence |
|---|---|---|
${api}

Read classification in order: reject unassembled tagged transient snapshot anywhere; if no current tagged entry reject flagged v0 replacement, otherwise return Untagged; accept assembled rewrite; accept nonempty outer-group bare uncovered rewrite under known versions; reject remaining migration-marked operations; accept ordinary user-index maintenance; apply exhaustive final operation match. Admission is a gate reason, not complete validation or a guarantee that data columns are unchanged. (rust/lance-table/src/system_index/frag_reuse/gate.rs:61-224)
`);
append('L1-modules/rust-lance-table.md',`## Tagged-history capability guards

The [transaction supplement](rust-lance-table-transactions.md) includes exact public Admission/classify and metadata-guard declarations. is_tagged checks reserved name and nonzero signed index_version; uses_tagged_fri additionally treats reader bit10 as sticky. validate_flags requires paired reader/writer bit10 only when tagged metadata exists. Clone guard avoids all index IO without reader bit, otherwise reads metadata and rejects a remaining tagged entry. These are distinct policies with separate preconditions. (rust/lance-table/src/system_index/frag_reuse/metadata.rs:15-69; rust/lance-table/src/feature_flags.rs:65-65)
`);
append('L0-orientation.md',`## Tagged format state and operation admission

A sticky manifest reader flag can keep the tagged format contract active after the entry is removed. Entry recognition, format recognition, paired-flag validation and operation admission are separate predicates: an Untagged admission does not imply the sticky bit is absent. MovesNoRows is also a reason name, while its admitted operations include in-place column rewrites. Use the exact gate branches for development decisions. (rust/lance-table/src/system_index/frag_reuse/metadata.rs:15-49; rust/lance-table/src/system_index/frag_reuse/gate.rs:77-224)
`);
append('L3-symbols/behavior-contracts.md',`## Ordered tagged-history admission

The following order is semantically significant; later rules do not constrain an earlier return. All inputs are borrowed and no history is modified. (rust/lance-table/src/system_index/frag_reuse/gate.rs:46-224)

| Order | Condition | Result |
|---|---|---|
| 1 | Rewrite carries tagged transient entry without Rewrite assembly marker | InvalidInput, even without a current tagged entry |
| 2 | No current tagged entry | InvalidInput for replacement on sticky-tagged manifest; otherwise Untagged |
| 3 | Current tagged entry and Rewrite assembly marker | AppendsTransitions |
| 4 | Bare rewrite, no rewritten indices, nonempty groups, reserved-entry versions0/1, all known bitmaps disjoint from representable old IDs | RewritesUncoveredFragments |
| 5 | Remaining operation with migration marker Some | NotSupported |
| 6 | CreateIndex whose new/removed entries all avoid reserved name | MaintainsUserIndices |
| 7 | Append/Reserve/Delete/Update/Config/Overwrite/Project/Merge/Replacement | MovesNoRows |
| 8 | Restore | RestoresManifest |
| 9 | Remaining Rewrite/CreateIndex/MemWAL/Overlay/Clone/Bases | NotSupported |

Source for rows1-3: rust/lance-table/src/system_index/frag_reuse/gate.rs:61-115; row4: rust/lance-table/src/system_index/frag_reuse/gate.rs:128-154; rows5-9: rust/lance-table/src/system_index/frag_reuse/gate.rs:157-224.

The bare-rewrite escape rejects any unknown bitmap, including when collected IDs are empty. It drops overflowing u64 old IDs from the u32 bitmap, and tests only outer groups nonempty; empty old lists inside groups can therefore pass the gate if all bitmaps are known. The fragment-replacement helper separately assumes nonempty old lists and can panic. This is an input-contract gap between local helpers; complete callers may constrain it and no runtime exploit/failure is claimed. (rust/lance-table/src/system_index/frag_reuse/gate.rs:128-154; rust/lance-table/src/transaction/index_maintenance.rs:732-769)

is_tagged accepts any nonzero version by exact name, while is_frag_reuse_index_entry checks name plus Any type suffix. The gate never validates assembled ledger content. validate_flags enforces both bit10s only for tagged entries, while uses_tagged_fri and clone guard inspect reader bit only. Keep these distinct in tests and error precedence. (rust/lance-table/src/system_index/frag_reuse/metadata.rs:15-69; rust/lance-table/src/system_index/frag_reuse.rs:29-41; rust/lance-table/src/system_index/frag_reuse/gate.rs:61-115)
`);
append('L3-symbols/format-spec.md',`## Sticky tagged-history format policy

Capability bit is 1<<10. uses_tagged_fri checks reader bit or supplied nonzero-version reserved entry; validate_flags requires both reader/writer bits when any tagged entry exists. Entry absence with retained flag is allowed locally. Comments specify append-transition record form and no v0 replacement after activation; the classifier rejects unassembled tagged snapshots and flagged v0 replacements, while actual byte-verbatim lifting/assembly remains pending. (rust/lance-table/src/feature_flags.rs:65-65; rust/lance-table/src/system_index/frag_reuse/metadata.rs:20-49; rust/lance-table/src/system_index/frag_reuse/gate.rs:61-110)

A future or negative entry version is still tagged by recognition but cannot use the bare-uncovered rewrite escape, whose reserved-name version list must be0/1. Other admission branches do not prove version decoding support; separate capability/ledger checks remain necessary. (rust/lance-table/src/system_index/frag_reuse/metadata.rs:16-18; rust/lance-table/src/system_index/frag_reuse/gate.rs:113-224)
`);
append('L4-crosscutting/scenarios.md',`## Gate and clone-guard boundaries

prepare_indices runs classify before cloning/withdrawing index metadata. The reviewed builder rejects stale prepared manifest version then rechecks classify on original indices and settled reuse update before destructuring prepared state. This confirms two local choke points; full entrance/retry coverage is pending. (rust/lance-table/src/transaction/manifest_build.rs:474-522; rust/lance-table/src/transaction/manifest_build.rs:593-611)

ensure_clone_supported returns immediately without reader bit10; otherwise awaits index list and rejects any name/nonzero-version tagged entry. Contextual dataset clone calls it after source checkout/write-capability check and before path collection; contextual commit Clone calls it after loading/checking source manifest. A sticky flag with no tagged entry passes this helper. Source-store selection, complete clone lifecycle and physical relocation are not fully analyzed. (rust/lance-table/src/system_index/frag_reuse/metadata.rs:54-69; rust/lance/src/dataset.rs:3336-3345; rust/lance/src/io/commit.rs:435-455)
`);
append('L4-crosscutting/cookbook.md',`## Extend tagged-history operation policy

A new Operation requires an explicit classify match decision and fixture/matrix cases, plus preparation/invalidation/assembly and reader handling. Decide table state by the appropriate predicate: sticky format state differs from current tagged-entry presence. Preserve malformed-snapshot precedence and consciously place any migration or future-version guard relative to early admission branches. Do not infer safety from Admission names; Update/Merge/Replacement return MovesNoRows while requiring later coverage withdrawal. Full transaction recipe remains incomplete until ledger, manifest, resolver and publication paths are covered. (rust/lance-table/src/system_index/frag_reuse/gate.rs:21-224; rust/lance-table/src/system_index/frag_reuse/gate.rs:333-622)

Extend existing tests for flag-only state, unknown/empty bitmaps, all-empty old lists, overflow IDs, unsupported versions, reserved-name CreateIndex and migration-marker branch ordering. The current45-case matrix covers every variant in selected states, not the full Cartesian product claimed by its comment. Also distinguish metadata validate_flags from broader manifest capability checks and test the clone guard's no-read fast path. These are proposed coverage obligations, not source modifications. (rust/lance-table/src/system_index/frag_reuse/gate.rs:452-622; rust/lance-table/src/system_index/frag_reuse/metadata.rs:37-123; rust/lance/src/index/frag_reuse_reader.rs:1011-1023)
`);
append('L4-crosscutting/pitfalls.md',`## Gate reasons are narrower than lifecycle guarantees

MovesNoRows prose says no column rewrite, yet its match accepts Update/Merge/DataReplacement. Untagged can be returned on sticky-flag-only tables. Appended-transition and bare-uncovered rewrite acceptance precede migration rejection; empty inner old lists can satisfy the nonempty-outer-group gate. No assembly payload validation occurs here. These source-level distinctions must survive any refactor of branch order. (rust/lance-table/src/system_index/frag_reuse/gate.rs:21-224)
`);
append('L4-crosscutting/build-and-test.md',`## Tagged gate and metadata tests

Gate has45 parameterized cases plus one migration test. They assert Admission/error category across selected operation/state pairs; only migration separately checks message content. Fixture transition assembly is constructed directly and does not exercise binding/conservation/ledger validation. Metadata file has two predicate tests; no local flag validator/clone IO test. A contextual consumer test verifies unflagged clone guard accepts a missing manifest path without read. No tests executed. (rust/lance-table/src/system_index/frag_reuse/gate.rs:308-332; rust/lance-table/src/system_index/frag_reuse/gate.rs:436-622; rust/lance-table/src/system_index/frag_reuse/metadata.rs:71-123; rust/lance/src/index/frag_reuse_reader.rs:1011-1023)
`);
const edits=[];function replace(f,old,value){let s=read(f);if(!s.includes(old))throw Error('Missing '+old);fs.writeFileSync(f,s.replace(old,value));edits.push({file:f,old,value});}
replace('L1-modules/rust-lance-table.md','Thirty-seven of 54 inventory entries are analyzed, covering 20,907 physical lines','Thirty-nine of 54 inventory entries are analyzed, covering 21,652 physical lines');
replace('L4-crosscutting/cookbook.md','Finish codec, manifest, conflict and IO analysis before claiming an end-to-end new-operation recipe.','The object codec and tagged gate are covered below; finish manifest, ledger, conflict and IO analysis before claiming an end-to-end new-operation recipe.');
write('analysis/iteration-043-status-refresh.json',edits);
const context=JSON.parse(read('analysis/iteration-042-contextual-reads.json'));context.iteration=43;context.partial_only=context.partial_only.filter(x=>!paths.has(x.path));function extra(p,rs,note){let e=context.partial_only.find(x=>x.path===p);if(!e){e={path:p,ranges:[]};context.partial_only.push(e);}const all=[...e.ranges,...rs].sort((a,b)=>a[0]-b[0]),merged=[];for(const r of all){let last=merged.at(-1);if(last&&r[0]<=last[1]+1)last[1]=Math.max(last[1],r[1]);else merged.push([...r]);}e.ranges=merged;if(note)e.note=note;}
extra('rust/lance-table/src/transaction/manifest_build.rs',[[164,201],[593,616]]);
extra('rust/lance/src/io/commit.rs',[[429,460]],'Narrow Clone source-store/read/guard context and prior outcome identity; rest pending.');
extra('rust/lance/src/dataset.rs',[[3330,3352]],'Clone guard and target setup prefix only; complete caller pending.');
extra('rust/lance/src/index/frag_reuse_reader.rs',[[1003,1030]],'No-read clone guard test plus neighboring assertion/setup fragments only; fixture and reader pending.');
write('analysis/iteration-043-contextual-reads.json',context);console.log({added_symbols:added.length,rust_total:prior.length+added.length,status_refreshes:edits.length});
