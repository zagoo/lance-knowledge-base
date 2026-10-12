import fs from 'node:fs';import {root,linesOf}from './inventory.mjs';
const read=f=>fs.readFileSync(f,'utf8'),append=(f,s)=>fs.appendFileSync(f,'\n\n'+s+'\n'),write=(f,v)=>fs.writeFileSync(f,JSON.stringify(v,null,2)+'\n');
const a=JSON.parse(read('analysis/iteration-039-transaction-conflicts.json')).files[0],src=linesOf(read(root+'/'+a.path)),added=[];
const edges={eq:['Transaction derived PartialEq(builder.rs16); local overlay equality test. Durable commit outcome instead compares protobuf(commit.rs246-283).','Nested compare_vec; payload PartialEq; std::mem::discriminant.'],compare_vec:['Operation::eq vector payload arms.','Slice length; iter/all/contains; element PartialEq.'],get_upsert_config_keys:['Operation::upsert_key_conflict at conflicts.rs977-978.','HashMap keys; cloned Strings; filtered ordered Vec collection.'],get_delete_config_keys:['Operation::upsert_key_conflict at conflicts.rs980-981.','Filter None entries; cloned Strings; Vec collection.'],modifies_same_metadata:['Local metadata test1018-1020; contextual lance/src/io/commit/conflict_resolver.rs2047.','update_maps_conflict; option presence; HashMap field-ID intersection.'],update_maps_conflict:['Operation::modifies_same_metadata at conflicts.rs935.','Option match; replace bool; HashSet<&str> collection and membership.'],upsert_key_conflict:['Contextual lance/src/io/commit/conflict_resolver.rs1546/1559/2032/2043.','Both key extractors; four Vecs; symmetric upsert-involving overlap via contains.'],table_metadata_update:['Local test_table_metadata_conflicts_on_same_key.','UpdateMapEntry::from; Vec collect; Operation::UpdateConfig.'],test_table_metadata_conflicts_on_same_key:['Rust test harness; source read only.','table_metadata_update; modifies_same_metadata; three assertions.'],test_data_overlay_operation_eq:['Rust test harness; source read only.','Local overlay closure; shared overlay_with_field; Operation::PartialEq; assertions.']};
function add(name,line,end_line,kind,visibility,callers,callees){const r=a.ranges.find(([b,e])=>b<=line&&line<=e);added.push({name:'lance_table::transaction::'+name,path:a.path,line,end_line,kind,visibility,behavior:r[2],behavior_reference:`${a.path}:${r[0]}-${r[1]}`,callers,callees});}
add('<Operation as PartialEq>',18,18,'implementation','public trait implementation','Transaction equality and explicit Operation comparisons.','Operation::eq.');
add('Operation::<conflicts implementation@869>',869,869,'implementation','public methods plus private helpers','Commit conflict resolver.','Metadata/config overlap predicates.');
add('conflicts::tests',993,993,'module','private cfg(test)','Rust harness.','Two local tests and fixture helper.');
for(let i=0;i<src.length;i++){const m=src[i].match(/^\s*(pub )?fn (\w+)/);if(!m)continue;const n=m[2],test=i>=992;let end=i+1;while(!/[{;]\s*$/.test(src[end-1]))end++;const name=test?'conflicts::tests::'+n:n==='eq'?'<Operation as PartialEq>::eq':n==='compare_vec'?'<Operation as PartialEq>::eq::compare_vec':'Operation::'+n;add(name,i+1,end,'function/method',test?'private cfg(test)':n==='eq'?'public via PartialEq':m[1]?'public':'private to conflicts implementation',...edges[n]);}
add('conflicts::tests::test_data_overlay_operation_eq::overlay',1025,1025,'local closure','private cfg(test)','test_data_overlay_operation_eq.','DataOverlayGroup; shared overlay_with_field.');
const prior=JSON.parse(read('analysis/rust-symbols.json')).filter(s=>s.path!==a.path);write('analysis/rust-symbols.json',[...prior,...added]);
const eqtable=`| Variant | Same-kind equality |
|---|---|
| Append | Unordered-membership fragment comparison |
| Delete | Unordered updated fragments/deleted IDs; exact predicate |
| Overwrite | Unordered fragments; exact Schema/config; ordered optional initial_bases |
| CreateIndex | Unordered new/removed complete index entries |
| Rewrite | Unordered groups/rewritten indices; exact optional in-memory reuse entry |
| Merge | Unordered fragments; exact Schema/nullability assertion |
| Restore / ReserveFragments | Version / reserved count respectively |
| Update | Six vectors unordered; exact mode, inserted filter, offset map |
| Project | Exact Schema/nullability assertion |
| UpdateConfig | Exact three optional UpdateMaps and field map, including entry order/replace |
| DataReplacement | Unordered tuple membership |
| UpdateMemWalState / UpdateBases | Unordered compacted pointers / bases respectively |
| Clone | All five fields exact |
| DataOverlay | Unordered groups, but inner overlay list remains ordered |

This table follows rust/lance-table/src/transaction/conflicts.rs:18-203, rust/lance-table/src/transaction/conflicts.rs:726-777 and rust/lance-table/src/transaction/conflicts.rs:863-867. Every different-kind pair is false (rust/lance-table/src/transaction/conflicts.rs:207-725; rust/lance-table/src/transaction/conflicts.rs:734-864). Unordered-membership means equal length plus every left value contained in right, not a multiset comparison; duplicates can break symmetry. The16x16 kind matrix is equality, not commit compatibility.
`;
append('L1-modules/rust-lance-table-transactions.md',`## Equality and overlap predicates

[Complete conflicts L2](../L2-files/rust/lance-table/src/transaction/conflicts.rs.md) covers all1,042 lines. The in-memory equality implementation is now fully reviewed. The full commit conflict resolver remains pending.

${eqtable}

Operation::modifies_same_metadata handles only two UpdateConfig values. Table maps conflict when both exist and either replaces, or when their explicit keys intersect; values and delete/insert distinction do not matter. Schema metadata conflicts on mere Some/Some, even with disjoint/empty edits. Field metadata conflicts on any common field ID, even with disjoint/empty inner maps. Config is excluded from this method. (rust/lance-table/src/transaction/conflicts.rs:919-974)

Operation::upsert_key_conflict checks config edits only. Overwrite contributes explicit upsert keys; UpdateConfig contributes Some-valued upserts and None-valued deletes. It clones four key vectors, then reports a shared key when at least one side upserts. Delete/delete is false; replacement flags and implicit clears are ignored. Identical values still conflict, duplicates are retained, and edit ordering is not normalized. Worst-case Vec membership is quadratic in key counts. These local bools do not classify retryability or prove complete transaction compatibility. (rust/lance-table/src/transaction/conflicts.rs:869-989)

Contextual overwrite consumer makes overlapping config keys incompatible and nonoverlapping concurrent overwrites retryable; overwrite versus nonoverlapping UpdateConfig is accepted by that method. Contextual UpdateConfig consumer rejects schema/field edits versus any Overwrite, or either overlap predicate versus another UpdateConfig. Earlier/global checks may impose more rules, so these snippets are not the full matrix. (rust/lance/src/io/commit/conflict_resolver.rs:1536-1583; rust/lance/src/io/commit/conflict_resolver.rs:2012-2072)

The conflicts module comment associates equality with retry identity, but an inspected commit-outcome path explicitly converts to protobuf and compares durable forms, to avoid transient reuse-entry differences. Complete codec/outcome handling remains pending. (rust/lance-table/src/transaction/conflicts.rs:4-13; rust/lance/src/io/commit.rs:246-283)

### Exact callable declarations

| Symbol | Signature | Visibility | Evidence |
|---|---|---|---|
${added.filter(s=>s.kind==='function/method').map(s=>`| \`${s.name}\` | \`${src.slice(s.line-1,s.end_line).join(' ').trim().replaceAll('|','\\|')}\` | ${s.visibility} | [${s.path}:${s.line}-${s.end_line}](../L2-files/${s.path}.md) |`).join('\n')}
`);
let table=read('L1-modules/rust-lance-table.md').replace('Thirty-two of 54 inventory entries are analyzed, covering 16,446 physical lines','Thirty-three of 54 inventory entries are analyzed, covering 17,488 physical lines').replace('transaction definitions/map updates/attempt containers and row-version helpers','transaction definitions/equality/metadata overlap/map updates/attempt containers and row-version helpers');fs.writeFileSync('L1-modules/rust-lance-table.md',table);
append('L0-orientation.md',`## Equality versus conflict compatibility

Operation equality compares represented intent; different operation kinds always differ. Separate metadata predicates compare config upserts/deletes or table/schema/field metadata scopes. Their bool results are consumed by the commit conflict resolver, whose complete matrix remains pending. Durable commit-outcome identity uses protobuf forms in the inspected path, not these in-memory payload comparisons. (rust/lance-table/src/transaction/conflicts.rs:18-29; rust/lance-table/src/transaction/conflicts.rs:863-989; rust/lance/src/io/commit/conflict_resolver.rs:2039-2052; rust/lance/src/io/commit.rs:246-283)
`);
append('L3-symbols/behavior-contracts.md',`## Operation equality and metadata collision rules

${eqtable}

| Local predicate | True condition | Not considered |
|---|---|---|
| modifies_same_metadata: table maps | Both Some and either replace, or explicit key overlap | Values, prior actual map |
| modifies_same_metadata: schema maps | Both Some | Entries, replace flags, disjointness |
| modifies_same_metadata: fields | Common field ID | Inner map contents |
| upsert_key_conflict: config | Shared explicit key with an upsert on at least one side | Delete/delete, implicit replacement clears, values, metadata categories |

Metadata predicate returns false for non-UpdateConfig pairs; config extraction supports Overwrite and UpdateConfig. Config tests allocate owned key vectors; table conflict uses a borrowed-key HashSet. Neither is a complete commit decision. Changing replacement/key-extraction semantics must be coordinated with apply_update_map, which ignores None in replacement mode even though the conflict extractor labels it a delete. (rust/lance-table/src/transaction/conflicts.rs:869-989; rust/lance-table/src/transaction/update_map.rs:58-81)
`);
append('L3-symbols/format-spec.md',`## Durable versus in-memory transaction equality

In-memory Rewrite equality includes frag_reuse_index. Operation docs designate that payload transient; inspected verify_commit_outcome converts the attempt to pb::Transaction and compares it to the persisted form to avoid misclassifying a landed commit. This distinction is verified locally; full transaction serialization and outcome recovery remain pending. (rust/lance-table/src/transaction/conflicts.rs:97-112; rust/lance-table/src/transaction/operation.rs:108-111; rust/lance/src/io/commit.rs:246-283)
`);
append('L4-crosscutting/scenarios.md',`## Local config and metadata overlap examples

For UpdateConfig config edits deleting k on both sides, upsert_key_conflict is false. Replacing either deletion with an upsert makes it true regardless of value; one side replacing with an empty entry list still produces no keys and therefore no overlap here. These are deductions from the local predicate, not complete commit outcomes. (rust/lance-table/src/transaction/conflicts.rs:869-917; rust/lance-table/src/transaction/conflicts.rs:975-989)

For table metadata instead, two explicit deletes of k conflict, either Some replacement conflicts with any other Some map including empty, and either None prevents that category from conflicting. Two Some schema maps always conflict; a shared field ID conflicts even if inner keys differ. The local test proves only same/different table upsert keys and one replacement case in source assertions. (rust/lance-table/src/transaction/conflicts.rs:919-974; rust/lance-table/src/transaction/conflicts.rs:999-1021)

All five complete KB-only acceptance questions remain FAIL. Operation equality and these helper rules are now complete, while full cross-operation conflict handling, manifest validation, retries and publication remain pending.
`);
append('L4-crosscutting/cookbook.md',`## Extend transaction equality and metadata predicates

For a new Operation payload, choose whether equality observes order, representation and transient metadata. Update the exhaustive PartialEq match as well as Display/name and codec/validation/build consumers. Equal-length membership does not correctly count duplicates; test both argument orders, multiplicities and empty vectors if preserving or repairing that behavior. Durable verification must use its own persisted-form contract. (rust/lance-table/src/transaction/conflicts.rs:18-29; rust/lance-table/src/transaction/conflicts.rs:200-867; rust/lance-table/src/transaction/operation.rs:279-300; rust/lance-table/src/transaction/operation.rs:399-420; rust/lance/src/io/commit.rs:246-283)

For config/metadata changes, keep category-specific rules explicit: delete/delete config differs from delete/delete table metadata; whole-map replacement currently affects only table-map overlap logic. Extend existing metadata tests for None/empty/disjoint/replacement/order/duplicate cases and then inspect full conflict_resolver consumers before claiming retry or compatibility correctness. This completes only a local recipe; the new-operation end-to-end recipe still fails. (rust/lance-table/src/transaction/conflicts.rs:869-1021; rust/lance/src/io/commit/conflict_resolver.rs:1536-1583; rust/lance/src/io/commit/conflict_resolver.rs:2012-2072)
`);
append('L4-crosscutting/pitfalls.md',`## Conflict helper interpretation

- Operation equality is not commit compatibility. Different kinds compare false even when the resolver can rebase them. Most vectors ignore order by membership, but Overwrite.initial_bases and UpdateMap entries remain ordered; overlay group order and inner overlay order differ. (rust/lance-table/src/transaction/conflicts.rs:18-203; rust/lance-table/src/transaction/conflicts.rs:774-777; rust/lance-table/src/transaction/conflicts.rs:863-864; rust/lance-table/src/transaction/operation.rs:31-35)
- Config key extraction ignores replace and includes every syntactic edit, even overwritten ones; implicit clears are invisible. Metadata categories use different presence/ID/key rules. No complete production conflict bug is asserted without full caller/global-check analysis. (rust/lance-table/src/transaction/conflicts.rs:869-989)
- Retry-identity module prose is broader than the inspected outcome implementation, which compares protobuf forms. Transient frag-reuse entries can make in-memory operations unequal while durable forms agree. (rust/lance-table/src/transaction/conflicts.rs:4-13; rust/lance-table/src/transaction/conflicts.rs:97-112; rust/lance/src/io/commit.rs:246-283)
`);
append('L4-crosscutting/build-and-test.md',`## Local transaction equality tests

conflicts.rs has two tests: table metadata same/different key plus one replacement case, and DataOverlay same/different field plus overlay-left versus Rewrite inequality. There is no local full16-kind matrix, duplicate symmetry/permutation, upsert-key predicate, empty/schema/field overlap or durable-outcome test. Other test modules may cover these; full resolver/test analysis remains pending. Shared overlay fixture uses a legacy DataFile and version1; it validates metadata comparisons only. No tests were executed. (rust/lance-table/src/transaction/conflicts.rs:992-1042; rust/lance-table/src/transaction/test_support.rs:63-69)
`);
const context=JSON.parse(read('analysis/iteration-037-contextual-reads.json'));context.iteration=39;context.partial_only=context.partial_only.filter(x=>x.path!==a.path);context.partial_only.push({path:'rust/lance/src/io/commit/conflict_resolver.rs',ranges:[[1510,1598],[2000,2088]],note:'Narrow predicate consumer context; global preconditions and complete resolver pending.'},{path:'rust/lance/src/io/commit.rs',ranges:[[239,306]],note:'Outcome identity prefix only; rest pending.'},{path:'rust/lance-table/src/system_index/mem_wal.rs',ranges:[[83,126]],note:'CompactedSsTable type context only.'});write('analysis/iteration-039-contextual-reads.json',context);
console.log({symbols:added.length,rust_total:prior.length+added.length,layers:'L0-L4'});
