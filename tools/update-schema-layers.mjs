import fs from 'node:fs';
const append=(p,s)=>fs.appendFileSync(p,'\n'+s.trim()+'\n');
const symbols=JSON.parse(fs.readFileSync('L3-symbols/symbols.json','utf8')).filter(s=>s.path==='rust/lance-core/src/datatypes/schema.rs'&&s.visibility.startsWith('public Rust'));
const rows=symbols.map(s=>`| \`${s.name}\` | \`${s.signature.replaceAll('|','\\|')}\` | [${s.path}:${s.line}-${s.end_line}](../${s.analysis}) |`);
let p='L1-modules/rust-lance-core-schema.md',s=fs.readFileSync(p,'utf8').split('<!-- schema-api-table -->')[0];fs.writeFileSync(p,s+'<!-- schema-api-table -->\n\n'+symbols.length+' explicit public records.\n\n| Name | Exact declaration | Contract and evidence |\n|---|---|---|\n'+rows.join('\n')+'\n');
p='L1-modules/rust-lance-core.md';s=fs.readFileSync(p,'utf8').replace('Coverage includes fifteen files:','Coverage includes sixteen files:').replace('logical datatypes and Field trees.','logical datatypes, Field trees and Schema/Projection.').replace('Schema/Projection implementations, caches and most algorithms remain pending.','Caches and most remaining utility algorithms remain pending.').replace('Schema module exports remain pending implementation analysis.','Schema module exports and their implementation are covered in the [schema supplement](rust-lance-core-schema.md).');fs.writeFileSync(p,s);
p='L1-modules/rust-lance-core-datatypes.md';s=fs.readFileSync(p,'utf8').replace('Schema, Projection, field-path parsing, dimension validation and other schema helpers are exported here but their implementation remains pending.','Schema, Projection, field-path parsing and validation are now analyzed separately in the [schema supplement](rust-lance-core-schema.md). Earlier two-file scope limits below identify boundaries supplied by that supplement.');s=s.replace('Schema-module re-exports are deliberately not certified by this two-file catalog.','Schema-module re-exports have a separate exact catalog in the linked schema supplement.');fs.writeFileSync(p,s);
append('L0-orientation.md',`
## Schema selection terminology

Schema holds Field roots and metadata; its equality ignores schema metadata, while configurable comparison can include it. Projectable exposes a borrowed Schema, and Projection selects field IDs plus four metadata-column flags and a blob policy. These are in-memory schemas/selections, not executed read plans. (rust/lance-core/src/datatypes/schema.rs:24-31; rust/lance-core/src/datatypes/schema.rs:174-177; rust/lance-core/src/datatypes/schema.rs:874-878; rust/lance-core/src/datatypes/schema.rs:1099-1108; rust/lance-core/src/datatypes/schema.rs:1191-1204)

Field paths use backticks/doubled backticks; minimal path formatting quotes literal dots/backticks, while expression-oriented formatting quotes other punctuation too. See the [schema API supplement](L1-modules/rust-lance-core-schema.md) for edge cases, validation and exact signatures. (rust/lance-core/src/datatypes/schema.rs:1567-1735)
`);
append('L3-symbols/behavior-contracts.md',`
## Schema import, IDs and Projection

Arrow Schema import converts fields, assigns missing IDs, validates top-level names/all IDs/fixed-list dimensions, then verifies primary-key structure. Cloning an existing Schema through TryFrom<&Self> skips these checks. validate alone does not verify primary keys or all Field invariants. merge returns new fields with unassigned IDs; extend mutates before its duplicate-name error and does not assign IDs. (rust/lance-core/src/datatypes/schema.rs:328-383; rust/lance-core/src/datatypes/schema.rs:688-766; rust/lance-core/src/datatypes/schema.rs:835-928)

Projection's raw set operations do not check base compatibility or repair parent/child closure. Schema union/subtraction accepts nonnegative IDs without the membership checks promised by its docs. to_schema appends metadata fields through extend().unwrap(), exposing duplicate-name panic and unassigned appended IDs. These local contracts constrain changes to planner selection and schema materialization; actual callers remain to be traced. (rust/lance-core/src/datatypes/schema.rs:1333-1402; rust/lance-core/src/datatypes/schema.rs:1458-1564)

BlobHandling::returns_description can report true for ordinary binary under AllDescriptions while Field::unloaded_mut leaves it unchanged. Preserve this distinction between policy predicate and actual transformation in any materialization analysis; downstream reader behavior is not inferred here. (rust/lance-core/src/datatypes/schema.rs:1144-1188; rust/lance-core/src/datatypes/field.rs:648-658)
`);
append('L4-crosscutting/pitfalls.md',`
## Schema and path pitfalls

- Schema equality ignores top-level metadata. Configurable comparison/explanation can disagree on malformed duplicate-name inputs because slow comparison maps the last occurrence and explanation maps the first. Missing-name diagnostic order comes from HashSet iteration. (rust/lance-core/src/datatypes/schema.rs:874-878; rust/lance-core/src/datatypes/schema.rs:930-1076)
- Schema::merge does not actually assign the new IDs its summary prose anticipates; tests call set_field_id afterward. extend leaves appended fields in place on duplicate-name error. validate and verify_primary_key are distinct operations. (rust/lance-core/src/datatypes/schema.rs:711-766; rust/lance-core/src/datatypes/schema.rs:835-905; rust/lance-core/src/datatypes/schema.rs:2370-2413)
- Resolver doc examples using double quotes do not match its backtick-only parser. field_paths is unescaped diagnostic text, while field_path_minimal is intended for valid segment roundtrips. Empty formatter inputs and SQL reserved words need separate caller consideration. (rust/lance-core/src/datatypes/schema.rs:224-257; rust/lance-core/src/datatypes/schema.rs:417-436; rust/lance-core/src/datatypes/schema.rs:1567-1758)
- Primary-key ordering casts positive u32 positions to i32; structural validation does not check ordering position ranges or uniqueness. Primitive-element FixedSizeList can be a leaf and has no explicit primary-key rejection arm. (rust/lance-core/src/datatypes/schema.rs:136-158; rust/lance-core/src/datatypes/schema.rs:835-871; rust/lance-core/src/datatypes/field.rs:1163-1168)
`);
append('L4-crosscutting/scenarios.md',`
## Local Arrow-schema import and projection trace

1. Schema::try_from(&ArrowSchema) invokes Field conversion for every root, copies metadata, then set_field_id(None) allocates after the current maximum and rebuilds ancestry IDs. (rust/lance-core/src/datatypes/schema.rs:889-902; rust/lance-core/src/datatypes/schema.rs:688-705)
2. validate checks root names, ID uniqueness/reserved negatives and every reconstructed fixed-list dimension; verify_primary_key separately enforces leaf/non-null/non-list/non-map ancestry. No dataset values are checked for uniqueness. (rust/lance-core/src/datatypes/schema.rs:328-383; rust/lance-core/src/datatypes/schema.rs:835-871; rust/lance-core/src/datatypes/schema.rs:903-907)
3. Projection::union_column adds the selected path ancestry and descendants, or toggles a recognized exact metadata flag. to_bare_schema filters the base with Field::apply_projection. That helper applies BlobHandling::unload_if_needed; the earlier partial blob trace's missing local policy implementation is now resolved. (rust/lance-core/src/datatypes/schema.rs:1276-1309; rust/lance-core/src/datatypes/schema.rs:1524-1527; rust/lance-core/src/datatypes/schema.rs:458-468; rust/lance-core/src/datatypes/field.rs:274-310; rust/lance-core/src/datatypes/schema.rs:1173-1188)
4. to_schema appends selected metadata fields in its fixed order; to_arrow_schema reconstructs Arrow fields from the resulting schema. This does not execute storage reads. (rust/lance-core/src/datatypes/schema.rs:1529-1564; rust/lance-core/src/datatypes/schema.rs:911-919)

All five required end-to-end self-sufficiency answers remain incomplete: this trace supplies core validation/materialization, not Dataset writing/compaction, index registration, complete v2 gates, Python APIs or transaction conflicts.
`);
append('L4-crosscutting/build-and-test.md',`
## Reviewed Schema tests

The full schema test block was read without execution. Existing targets cover quoted paths, reserved lineage IDs, schema projection/intersection/exclusion, merge-ID assignment and metadata precedence, comparison, key structure/order and zero-dimensional nested fixed-size lists. test_schema_difference_subschema never enables allow_subschema and has one reordered diagnostic assertion against the earlier variable; the fixed_l fixture in test_schema_project_by_schema is a variable List. Record these limits when selecting regression tests rather than inferring coverage from names. (rust/lance-core/src/datatypes/schema.rs:1760-3225; rust/lance-core/src/datatypes/schema.rs:2180-2245; rust/lance-core/src/datatypes/schema.rs:2610-2710)
`);
append('L4-crosscutting/cookbook.md',`
## Extend schema validation or selection

Use Schema::try_from to locate the normal Arrow-import validation sequence; decide explicitly whether a new rule belongs in validate, verify_primary_key or a separate policy, and cover direct public Schema construction/mutation where relevant. A new projection selection path must preserve or deliberately repair parent/child closure before Field::apply_projection; use union_column's ancestry/descendant behavior as a reference, and inspect raw set methods' weaker guarantees. Keep system-column flags and blob transformations consistent with to_schema's materialization. (rust/lance-core/src/datatypes/schema.rs:889-908; rust/lance-core/src/datatypes/schema.rs:328-383; rust/lance-core/src/datatypes/schema.rs:835-871; rust/lance-core/src/datatypes/schema.rs:1276-1497; rust/lance-core/src/datatypes/schema.rs:1529-1564; rust/lance-core/src/datatypes/field.rs:274-310)

Whole-system qualification still requires the unreviewed planner/writer/reader callers and regression fixtures. This is a core API recipe, not a completed dataset feature or a production-qualified design.
`);
const m=JSON.parse(fs.readFileSync('MANIFEST.json','utf8'));
p='iteration-state.json';const state=JSON.parse(fs.readFileSync(p,'utf8'));state.totals=m.totals;state.read_not_analyzed=[];state.next='Run VERIFY6 including previous corrections and Schema/Projection contracts; continue remaining lance-core files after findings.';state.acceptance_gaps[0]='2023 files pending';fs.writeFileSync(p,JSON.stringify(state,null,2)+'\n');
p='README.md';s=fs.readFileSync(p,'utf8').replace('35 of 2,059 files and 11,192 of 1,166,813 text lines','36 of 2,059 files and 14,417 of 1,166,813 text lines').replace('fifteen lance-core files','sixteen lance-core files').replace('633 reviewed Rust declarations','786 reviewed Rust declarations').replace('Next: core schema/Projection implementation.','Schema/Projection analysis is saved and entering VERIFY6.');fs.writeFileSync(p,s);
console.log(JSON.stringify({public_schema_records:symbols.length,totals:m.totals}));
