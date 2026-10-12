import fs from 'node:fs';import {root,linesOf}from './inventory.mjs';
const read=f=>fs.readFileSync(f,'utf8'),append=(f,s)=>fs.appendFileSync(f,'\n\n'+s+'\n'),write=(f,v)=>fs.writeFileSync(f,JSON.stringify(v,null,2)+'\n');
const a=JSON.parse(read('analysis/iteration-040-transaction-validation.json')).files[0],src=linesOf(read(root+'/'+a.path)),added=[];
const edges={
validate_operation:['CommitBuilder::execute_inner contextual calls at rust/lance/src/dataset/write/commit.rs:419-425; local overwrite test; manifest-build offset-key test3643-3693.','overwrite_fragments_valid; schema_fragments_valid; merge_fragments_valid; merge_schema_valid; Operation::name; HashSet membership.'],
overwrite_fragments_valid:['validate_operation absent/present Overwrite branches28/61.','relative_deletion_file_path; InvalidInput construction.'],
schema_fragments_valid:['validate_operation Append/Project/Merge/Overwrite/Update branches.','DataStorageFormat::lance_file_format; legacy/modern helper.'],
schema_fragments_modern_valid:['schema_fragments_valid.','Base files and fields emptiness; InvalidInput.'],
schema_fragments_legacy_valid:['schema_fragments_valid exactV1.','Schema::fields_pre_order; repeated base-file-ID scan.'],
merge_fragment_physically_rewritten:['Contextual Merge manifest builder at rust/lance-table/src/transaction/manifest_build.rs:1183-1213.','Ordered base-file identity comparisons, excluding cached size.'],
merge_fragments_valid:['validate_operation Merge; local preservation test.','Last-ID-wins HashMap; exact physical_rows comparison.'],
merge_schema_valid:['validate_operation Merge; six schema-related test functions in this module.','Schema field_by_id/field_path/preorder; Manifest::max_field_id; shared_field_binding_changes; is_field_binding_fully_rewritten.'],
is_field_binding_fully_rewritten:['merge_schema_valid.','Original-fragment iteration; base field membership; referenced_lance_files for old/new base and overlay files.'],
shared_field_binding_changes:['merge_schema_valid; dictionary regression assertions.','Field logical_type/nullable/encoding/dictionary PartialEq; format/join.'],
one_field_schema:['Four local schema tests: shared-ID, retained-overlay, fresh-ID and max-ID.','Arrow schema; Lance Schema::try_from.'],
fragment_with_file_fields:['Local fixture and schema tests.','Fragment::new; DataFile::new_legacy_from_fields.'],
manifest_with_file_fields:['Fresh-ID and max-ID tests.','Manifest::new; fragment_with_file_fields; exactV2_0.']
};
for(let i=0;i<src.length;i++){const m=src[i].match(/^\s*(pub(?:\(super\))? )?fn (\w+)/);if(!m)continue;const n=m[2],test=i>=418;let end=i+1;while(!/[{;]\s*$/.test(src[end-1]))end++;const range=a.ranges.find(([b,e])=>b<=i+1&&i+1<=e);const edge=edges[n]??['Rust test harness; source read only.','Local metadata fixtures, private validation helpers and assertions; exact source retained in L2.'];added.push({name:'lance_table::transaction::'+(n==='validate_operation'?n:'validate::'+(test?'tests::':'')+n),path:a.path,line:i+1,end_line:end,kind:'function',visibility:test?'private cfg(test)':n==='validate_operation'?'public reexport':m[1]?.includes('(super)')?'pub(super), transaction-internal':m[1]?'pub inside private nonreexported module':'private',behavior:range[2],behavior_reference:`${a.path}:${range[0]}-${range[1]}`,callers:edge[0],callees:edge[1]});}
added.push({name:'lance_table::transaction::validate::tests',path:a.path,line:419,end_line:419,kind:'module',visibility:'private cfg(test)',behavior:'Seven test functions, one parameterized into two cases, and three fixture helpers. Source read only.',behavior_reference:a.path+':418-755',callers:'Rust test harness.',callees:'Local private validation helpers; one public validate_operation overwrite case.'});
const prior=JSON.parse(read('analysis/rust-symbols.json')).filter(s=>s.path!==a.path);write('analysis/rust-symbols.json',[...prior,...added]);
const matrix=`| Dataset / operation | Checks in order |
|---|---|
| Absent / Overwrite | No deletion metadata, then modern base-file nonempty-fields check |
| Absent / Clone | Immediate success at this helper |
| Absent / all others | InvalidInput naming operation |
| Present / Append | Current schema + current manifest format helper |
| Present / Project | Proposed schema + existing fragments + current manifest format helper |
| Present / Merge | Fragment inclusion/counts, schema binding rules, format-selected schema helper |
| Present / Overwrite | No deletion metadata; modern helper independent of old manifest format |
| Present / Update | Updated then new fragments; RewriteColumns-only offset-key membership |
| Present / remaining variants | Success through wildcard |

This is the local dispatch matrix, not complete commit admissibility. InvalidInput errors stop at first failing stage and borrowed inputs remain unchanged. Clone can pass this helper yet fail an earlier caller guard: execute_inner rejects deep Clone unless deep_clone_files_copied is set. (rust/lance-table/src/transaction/validate.rs:18-99; rust/lance/src/dataset/write/commit.rs:320-334)
`;
append('L1-modules/rust-lance-table-transactions.md',`## Operation validation boundary

[Complete validation L2](../L2-files/rust/lance-table/src/transaction/validate.rs.md) retains all755 lines and seven tests. validate_operation is the only externally reexported function from this module. Both schema helpers have pub declarations inside a private module; merge_fragment_physically_rewritten is pub(super). (rust/lance-table/src/transaction.rs:39-55; rust/lance-table/src/transaction/validate.rs:19-19; rust/lance-table/src/transaction/validate.rs:137-184)

${matrix}

Modern schema validation ignores the schema and overlays, requiring only each existing base file to have at least one field ID. It accepts an empty fragment or arbitrary nonempty IDs at this boundary. Legacy validation instead requires every schema preorder ID, including nested parents, somewhere in base-file fields; extra masked IDs are allowed. ExactV1 selects legacy; all four exactV2 variants and no manifest select modern. Per-file version metadata is not the selector. (rust/lance-table/src/transaction/validate.rs:120-174)

Merge preserves inclusion of original fragment IDs and exact Option physical_rows; extra IDs are legal and duplicate proposed IDs collapse to last in maps. Shared schema IDs must retain paths. Changes to type/nullability/encoding/dictionary need base materialization and removal of all same-ID old base/overlay identities, comparing base_id+path. That proof visits originals only; additional proposed fragments are omitted despite broader prose. Fresh IDs exceed maximum across schema/base/overlay fields; reusing an old path at a fresh ID requires base materialization in every proposed fragment. Entirely new paths lack that requirement here. (rust/lance-table/src/transaction/validate.rs:202-416; rust/lance-table/src/format/manifest.rs:466-485)

The separate physical-rewrite detector compares ordered base-file identities, excluding mutable cached size and all deletion/overlay/lineage metadata. Contextual Merge application uses it to stamp latest version for existing fragments when next_row_id is Some; new IDs get latest then cloned creation metadata. Complete builder behavior remains pending. (rust/lance-table/src/transaction/validate.rs:176-200; rust/lance-table/src/transaction/manifest_build.rs:1183-1213)

### Exact validation declarations

| Symbol | Signature | Visibility | Evidence |
|---|---|---|---|
${added.filter(s=>s.kind==='function').map(s=>`| \`${s.name}\` | \`${src.slice(s.line-1,s.end_line).join(' ').trim().replaceAll('|','\\|')}\` | ${s.visibility} | [${s.path}:${s.line}-${s.end_line}](../L2-files/${s.path}.md) |`).join('\n')}
`);
let table=read('L1-modules/rust-lance-table.md').replace('Thirty-three of 54 inventory entries are analyzed, covering 17,488 physical lines','Thirty-four of 54 inventory entries are analyzed, covering 18,243 physical lines').replace('transaction definitions/equality/metadata overlap/map updates/attempt containers and row-version helpers','transaction definitions/validation/equality/metadata overlap/map updates/attempt containers and row-version helpers');fs.writeFileSync('L1-modules/rust-lance-table.md',table);
append('L0-orientation.md',`## Operation pre-validation

Pre-validation checks operation shape against an optional current manifest. It is synchronous metadata inspection with no storage IO; its success does not certify physical files, schema completeness in modern formats or transaction compatibility. Merge field-binding protection and a separate base-file rewrite detector serve different purposes: binding safety versus latest-version stamping. (rust/lance-table/src/transaction/validate.rs:18-200; rust/lance-table/src/transaction/validate.rs:257-416; rust/lance-table/src/transaction/manifest_build.rs:1183-1213)
`);
append('L3-symbols/behavior-contracts.md',`## Validation is a staged metadata contract

${matrix}

Overwrite rejects any attached deletion descriptor before schema checks because deletion names embed fragment IDs, which overwrite reassigns by documented intent. Formatting produces _deletions/{fragment_id}-{read_version}-{id}.{suffix}; this guard neither reads nor relocates the file. RewriteColumns offsets may name only updated_fragments, but bitmap values, completeness and row bounds are not checked here. Other Update modes skip that membership check. (rust/lance-table/src/transaction/validate.rs:67-118; rust/lance-table/src/io/deletion.rs:25-25; rust/lance-table/src/io/deletion.rs:50-59)

Merge rejection precedence is proposed fragment count, existing physical-row equality/missing IDs, shared-ID path or semantic rewrite, new-ID maximum, fresh-ID existing-path materialization, then format helper. Proposed-ID maps take last duplicate; physical_rows compares Option exactly. The shared semantic proof only visits original fragments and compares field-bearing old/new base/overlay identities by base_id+path. Empty original manifest makes that proof vacuous; metadata-only identity does not verify bytes. Field metadata changes are excluded from the four semantic comparisons. (rust/lance-table/src/transaction/validate.rs:51-56; rust/lance-table/src/transaction/validate.rs:202-416)
`);
append('L3-symbols/format-spec.md',`## Pre-validation does not verify file formats

Schema-fragment dispatch trusts manifest exact format (V1 versus V2_0 throughV2_3); Overwrite bypasses prior format and uses modern checks. Modern checks do not validate per-file versions, schema membership, overlay coverage or byte layout. Merge binding identity uses base_id+path for files carrying a changed field, while physical-rewrite detection additionally compares ordered fields/column mappings/raw versions but ignores cached size. Neither opens files. (rust/lance-table/src/transaction/validate.rs:58-65; rust/lance-table/src/transaction/validate.rs:120-200; rust/lance-table/src/transaction/validate.rs:360-389)
`);
append('L4-crosscutting/scenarios.md',`## Local pre-commit validation trace

1. Contextual CommitBuilder::execute wraps execute_inner with optional timeout; execute_inner has a deep-clone guard before the reviewed destination/validation section. Dataset loading can occur before validation. Full intervening setup remains pending. (rust/lance/src/dataset/write/commit.rs:294-334; rust/lance/src/dataset/write/commit.rs:395-425)
2. Pass current manifest when a dataset exists, otherwise None. Overwrite rejects deletion descriptors and checks nonempty base-file field lists; Merge protects old fragment inclusion/counts and field bindings before format-specific validation. No file is opened inside these helpers. (rust/lance/src/dataset/write/commit.rs:419-425; rust/lance-table/src/transaction/validate.rs:18-174; rust/lance-table/src/transaction/validate.rs:202-416)
3. For RewriteColumns Update, after updated/new fragment schema checks, reject any offset-map key outside updated IDs. A contextual test builds fragments1/2, updates only1 but supplies offsets for2, and requires key-presence error. Bitmap bound checks and final stamping are later concerns. (rust/lance-table/src/transaction/validate.rs:67-95; rust/lance-table/src/transaction/manifest_build.rs:3643-3693)

This supplies the local validator and contextual caller boundary; complete publication, conflict retry and cleanup still prevent all five complete KB-only acceptance answers.
`);
append('L4-crosscutting/cookbook.md',`## Change validation or add an operation guard

Choose explicit handling in validate_operation: its existing-dataset wildcard otherwise accepts new variants. Preserve no-manifest Overwrite/Clone special cases, error precedence and modern-versus-legacy distinction. For new offset semantics, specify key subset, bitmap bounds and mode gating separately; current validator checks only RewriteColumns key subset. Finish codec, manifest, conflict and IO analysis before claiming an end-to-end new-operation recipe. (rust/lance-table/src/transaction/validate.rs:18-99)

For Merge schema changes, account for shared-ID paths, four compared semantic attributes, field-ID exhaustion and base/overlay identity. Cover duplicate proposed IDs, additional proposed fragments, missing base materialization, retained overlays, nested paths, empty manifests and metadata-only changes with independent assertions. Existing tests cover two semantic categories, dictionary offset, retained overlay, fresh-ID success and max-ID exhaustion. Avoid extending the frozen legacy validator when implementing new-format features. (rust/lance-table/src/transaction/validate.rs:152-174; rust/lance-table/src/transaction/validate.rs:202-416; rust/lance-table/src/transaction/validate.rs:533-689; AGENTS.md:13-18)
`);
append('L4-crosscutting/pitfalls.md',`## Validation wording versus enforced checks

- The modern schema helper ignores schema and overlays, so empty fragment files or nonempty arbitrary field IDs can pass locally. Append's all-fields comment does not describe modern enforcement. (rust/lance-table/src/transaction/validate.rs:44-46; rust/lance-table/src/transaction/validate.rs:120-174)
- Merge fragment docs say one-to-one, but extras are accepted and duplicate IDs collapse. Shared-field rewrite docs say every proposed fragment, while the proof visits only originals; fresh-ID remaps do check every proposed fragment. These are local discrepancies, not established end-to-end corruption cases without all callers. (rust/lance-table/src/transaction/validate.rs:202-279; rust/lance-table/src/transaction/validate.rs:329-389)
- The legacy-to-stable regression fixture explicitly constructs V1 metadata despite its stable name/comments. Its assertion establishes old-manifest bypass, not actual modern-file compatibility. (rust/lance-table/src/transaction/validate.rs:691-755)
- Base-file ordering changes count as physical rewrite; cache-size, overlay and deletion changes alone do not. Schema-binding rewrite proof uses a different base_id+path identity. Keep both predicates distinct. (rust/lance-table/src/transaction/validate.rs:176-200; rust/lance-table/src/transaction/validate.rs:360-389)
`);
append('L4-crosscutting/build-and-test.md',`## Transaction validation source tests

validate.rs defines seven test functions, one with two rstest cases. They cover original fragment count/inclusion and accepted extras; two-fragment type/nullability full versus partial rewrite; unchanged/moved-offset dictionaries; retained overlays; fresh field-ID success; i32 ID exhaustion; and Overwrite bypass of an old legacy manifest. Fixtures mix legacy DataFile metadata with V2_0 manifest labels; none creates physical data files. The stable-named overwrite fixture actually uses V1. No tests executed. (rust/lance-table/src/transaction/validate.rs:418-755)

The contextual manifest-build offset-key test updates fragment1, supplies offsets for unrelated existing fragment2, and asserts validation error. Local validate.rs lacks direct cases for absent datasets/Clone, overwrite deletions, generic modern/legacy checks, physical detector/cache sizes, duplicate IDs and extra-fragment shared-binding materialization. This is a local coverage inventory, not a claim those cases are absent from all repository tests. (rust/lance-table/src/transaction/manifest_build.rs:3643-3693; rust/lance-table/src/transaction/validate.rs:418-755)
`);
const context=JSON.parse(read('analysis/iteration-039-contextual-reads.json'));context.iteration=40;context.partial_only.find(x=>x.path.endsWith('transaction/manifest_build.rs')).ranges.push([1155,1215],[3640,3705]);context.partial_only.push({path:'rust/lance/src/dataset/write/commit.rs',ranges:[[286,350],[395,451]],note:'execute timeout/deep-clone prefix and validation call context only; complete execute_inner pending.'},{path:'rust/lance-table/src/io/deletion.rs',ranges:[[19,68]],note:'Constant/path formatter and write function declaration prefix only.'});write('analysis/iteration-040-contextual-reads.json',context);
console.log({added_symbols:added.length,rust_total:prior.length+added.length,layers:'L0-L4'});
