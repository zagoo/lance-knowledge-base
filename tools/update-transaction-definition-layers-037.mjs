import fs from 'node:fs';
import {root,linesOf} from './inventory.mjs';
const read=f=>fs.readFileSync(f,'utf8'),write=(f,s)=>fs.writeFileSync(f,s),append=(f,s)=>fs.appendFileSync(f,'\n\n'+s+'\n');
const batch=JSON.parse(read('analysis/iteration-037-transaction-definitions.json')),symbols=JSON.parse(read('L3-symbols/symbols.json')).filter(s=>batch.files.some(f=>f.path===s.path));
const chapter=`# Transaction definitions and attempt containers

**INCOMPLETE commit coverage.** The facade, builder, operation vocabulary, map edits, preparation containers and shared test fixtures are fully read. Full validation, conflicts, protobuf conversion, index maintenance, manifest assembly and commit IO remain pending.

[Table module](rust-lance-table.md) · [Contracts](../L3-symbols/behavior-contracts.md) · [Scenarios](../L4-crosscutting/scenarios.md) · [Symbols](../L3-symbols/symbol-index.md)

Public types/functions are reexported through lance_table::transaction; implementation child modules are private and test_support is crate-visible only in tests. Transaction's public fields permit arbitrary state construction. Builder setters consume self; build preserves supplied UUID verbatim or lazily generates a hyphenated v4 UUID, moves tag/properties and performs no operation validation. read_version0 for initial creation is documentation, not a constructor check. (rust/lance-table/src/transaction.rs:30-55; rust/lance-table/src/transaction/builder.rs:12-90)

The16 Operation variants carry intent, not execution. Their declaration comments describe overwrite-ID/deletion restrictions, rewrite history rebasing, schema nullability assertions, inserted-key filters and shallow-only commit behavior. Enforcement must be traced through pending modules. Operation::name and Display return the same exact variant names; Operation equality is a separate handwritten implementation. (rust/lance-table/src/transaction/operation.rs:37-248; rust/lance-table/src/transaction/operation.rs:279-300; rust/lance-table/src/transaction/operation.rs:399-420; rust/lance-table/src/transaction/conflicts.rs:18-29)

PreparedIndices privately owns optional manifest version, original and prepared index lists, and FragReuseUpdate. Its crate constructor stores unchecked inputs; getters borrow and into_parts consumes, omitting version. FragReuseUpdate is non_exhaustive, default None, Rewrite(Arc<TaggedRewriteAssembly>) or Trim. Contextual prepare_indices invokes a gate, clones current indices and optionally withdraws in-place rewrite coverage; contextual build_manifest_prepared rejects a different optional numeric version, repeats the gate, then consumes parts. Full lineage/gate behavior is not yet in this KB. (rust/lance-table/src/transaction/prepare.rs:24-100; rust/lance-table/src/transaction/manifest_build.rs:474-522; rust/lance-table/src/transaction/manifest_build.rs:593-611)

CoverageIdentity compares UUID and optional bitmap, deliberately excluding other metadata that migrations may fill. LogicalIndexSegments is a BTreeMap of logical names to vectors; sorting/filtering are producer obligations. ReadVersionState borrows manifest and indices but does not check that they come from the same version. TaggedRewriteAssembly public fields are not a proof token; its constructor only unions transition source IDs with checked u32 conversion. Empty transitions yield empty bitmap; duplicates deduplicate, out-of-range IDs return InvalidInput. Destination/mapping/conservation/entry consistency checks are elsewhere. (rust/lance-table/src/transaction.rs:62-102; rust/lance-table/src/transaction/operation.rs:302-361)

UpdateMap replacement clears first and inserts only Some entries, ignoring None even after an earlier insertion of the same key. Incremental mode applies every entry in order, including removal. Config translation emits all upserts before deletes with replace=false; schema translation emits all-Some entries with replace=true. HashMap iteration order is unspecified, and derived entry-vector equality observes order even for equivalent effects. (rust/lance-table/src/transaction/update_map.rs:13-128)

RewriteGroup equality ignores order using equal length plus left-membership in right. Duplicate multiplicities can make equality asymmetric: [A,A] versus [A,B] passes only in the former direction for distinct A,B. This is source arithmetic, not a reproduced valid-transaction failure. UpdatedFragmentOffsets DeepSizeOf approximates bitmap cardinality and omits map/container costs; RewrittenIndex sizing omits new_index_files children. No file in this six-file slice contains a test function; shared fixtures support tests in other modules. (rust/lance-table/src/transaction/operation.rs:270-277; rust/lance-table/src/transaction/operation.rs:374-397; rust/lance-table/src/transaction/test_support.rs:1-199)

## Exact public type declarations

The following excerpts preserve source declarations. The Operation excerpt includes every variant payload; callable signatures follow below. Implementation details and all physical source lines remain in the linked L2 documents.
`;
let out=chapter;
const spans={
'transaction.rs':[[68,68],[80,84],[98,102]],
'builder.rs':[[16,25],[28,35]],
'prepare.rs':[[26,42],[52,58]],
'operation.rs':[[23,35],[38,248],[250,261],[267,268],[309,321],[363,372],[383,387]],
'update_map.rs':[[14,20],[50,56]]};
for(const a of batch.files){const f=a.path.split('/').at(-1);if(!spans[f])continue;const src=linesOf(read(root+'/'+a.path));for(const[b,e]of spans[f])out+=`\n### ${a.path}:${b}-${e}\n\n\`\`\`rust\n${src.slice(b-1,e).join('\n')}\n\`\`\`\n\n[${a.path}:${b}-${e}](../L2-files/${a.path}.md)\n`;}
out+='\n## Exact reviewed callable declarations\n\n| Symbol | Signature | Visibility | Evidence |\n|---|---|---|---|\n';
for(const s of symbols.filter(s=>s.kind==='function/method'))out+=`| \`${s.name}\` | \`${s.signature.replaceAll('|','\\|')}\` | ${s.visibility} | [${s.path}:${s.line}-${s.end_line}](../${s.analysis}) |\n`;
write('L1-modules/rust-lance-table-transactions.md',out);
let table=read('L1-modules/rust-lance-table.md').replace('Twenty-six of 54 inventory entries are analyzed, covering 15,407 physical lines','Thirty-two of 54 inventory entries are analyzed, covering 16,446 physical lines').replace('Row-ID sequence and transaction row-version helpers are covered;','Row-ID sequence, transaction definitions/map updates/attempt containers and row-version helpers are covered;').replace('|-- transaction: row-ID assignment/creation-version resolution; full operation/commit orchestration pending','|-- transaction: operation vocabulary, construction, map edits, attempt containers and row lineage; full commit orchestration pending');
write('L1-modules/rust-lance-table.md',table);append('L1-modules/rust-lance-table.md',`## Transaction vocabulary and attempt boundaries

The [transaction supplement](rust-lance-table-transactions.md) supplies exact complete type/variant payload declarations, callable signatures and contracts for six additional files. Public Transaction and builder construct intent without validation; private implementation modules perform application elsewhere. PreparedIndices encapsulates two index lists and optional manifest version, while its constructor and accessors do not derive or validate coverage. (rust/lance-table/src/transaction.rs:30-102; rust/lance-table/src/transaction/builder.rs:12-90; rust/lance-table/src/transaction/prepare.rs:44-100)
`);
append('L0-orientation.md',`## Transaction intent and one-attempt preparation

A Transaction stores read_version,UUID,Operation,optional tag and shared string properties. An Operation names one of16 change kinds with typed payloads. PreparedIndices separately carries current-attempt original/prepared index metadata and fragment-reuse intent; it is not persisted by these containers. Full retry/conflict/publication behavior remains pending. [Transaction API](L1-modules/rust-lance-table-transactions.md). (rust/lance-table/src/transaction/builder.rs:12-25; rust/lance-table/src/transaction/operation.rs:37-248; rust/lance-table/src/transaction/prepare.rs:4-18; rust/lance-table/src/transaction/prepare.rs:44-100)

CoverageIdentity means UUID plus optional fragment bitmap, with other index metadata excluded from equality. ReadVersionState means borrowed manifest/index evidence from a transaction's fixed read version; it carries no runtime check that the pair matches. UpdatedFragmentOffsets means per-fragment physical offset bitmaps for partial column-update lineage. (rust/lance-table/src/transaction.rs:62-102; rust/lance-table/src/transaction/operation.rs:263-268)
`);
append('L3-symbols/behavior-contracts.md',`## Transaction definition contracts

- Builder is unchecked: supplied UUID strings survive verbatim, absent UUID generates lazily, setters replace options and public Transaction fields can be changed afterward. Constructors do not validate or commit. (rust/lance-table/src/transaction/builder.rs:12-90)
- PreparedIndices stores version/original/prepared/reuse data. Its accessors do not mutate; into_parts drops version from returned values. Contextually build_manifest_prepared checks optional version equality before consuming, then repeats the tagged gate. Same numeric version is not a dataset identity proof. (rust/lance-table/src/transaction/prepare.rs:60-100; rust/lance-table/src/transaction/manifest_build.rs:593-611)
- reordered_sources accepts every mapping kind, unions source IDs only, rejects u64 IDs above u32MAX and otherwise deduplicates. TaggedRewriteAssembly::new performs this limited validation; its public fields permit direct bypass. (rust/lance-table/src/transaction/operation.rs:302-361)
- Replacement map updates clear then ignore None; incremental updates apply None as deletion in sequence. Changing that distinction changes duplicate-key behavior and legacy translator effects. Config translation deliberately appends deletes after all upserts. (rust/lance-table/src/transaction/update_map.rs:58-128)
- RewriteGroup equality uses length+left membership, not sorted vectors or multiplicity counts. It is quadratic and can be asymmetric for duplicate-bearing inputs; complete producer validation must be inspected before classifying production impact. (rust/lance-table/src/transaction/operation.rs:383-397)
`);
append('L3-symbols/format-spec.md',`## Transaction intent versus persisted representation

Operation declarations document frag_reuse_index as in-memory only: conflict decisions need groups, while the manifest records history. PreparedIndices and FragReuseUpdate are also attempt metadata. This slice does not inspect the transaction encoder/decoder, so serialization omission is a documented contract awaiting codec verification. UpdateMap models ordered edits and a replace flag; exact field/tag conversion remains pending proto.rs. (rust/lance-table/src/transaction/operation.rs:89-111; rust/lance-table/src/transaction/prepare.rs:4-18; rust/lance-table/src/transaction/prepare.rs:24-58; rust/lance-table/src/transaction/update_map.rs:13-56)

Test-only tagged_entry encodes FragmentReuseIndexDetails into Any with type_url /lance.table.FragmentReuseIndexDetails, inline transitions and empty legacy_versions. It uses OrderedCompaction address bitmaps, casts lineage IDs to u32 unchecked and assumes evenly divisible destination counts. Fixture bytes are not a production writer-validation guarantee. (rust/lance-table/src/transaction/test_support.rs:127-199)
`);
let scenarios=read('L4-crosscutting/scenarios.md').replace('Rust operation enum, conflict matrix, commit retries and storage protocol remain missing','Rust operation payloads and preparation containers are now documented; full conflict matrix, commit retries and storage protocol remain missing');write('L4-crosscutting/scenarios.md',scenarios);
append('L4-crosscutting/scenarios.md',`## Partial transaction-attempt trace

1. Construct typed Operation and TransactionBuilder; optionally set UUID/tag/properties; build moves intent into Transaction and generates UUID only if absent. No store access. (rust/lance-table/src/transaction/builder.rs:37-90)
2. Contextual prepare_indices calls the tagged gate, clones current index metadata, derives physical-column rewrites and optionally withdraws their coverage via lineage, then stores current optional manifest version and both lists. The called algorithms remain pending. (rust/lance-table/src/transaction/manifest_build.rs:474-522)
3. Contextual build_manifest_prepared first requires the stored optional version equal current_manifest.version, repeats the gate, then consumes original/prepared/reuse parts. This is only a locally observed preparation boundary, not the atomic commit/retry protocol. (rust/lance-table/src/transaction/manifest_build.rs:593-611)

All five complete KB-only acceptance answers remain FAIL. The operation enum is now available; full validation, conflict decisions, manifest application, protobuf persistence and store publication remain gaps.
`);
append('L4-crosscutting/cookbook.md',`## New operation: known definition-side touch points

Add payload to Operation and matching Display/name arms; review Transaction's derived equality dependency and the separate handwritten operation equality, then coordinate facade reexports for any new helper types. Use UpdateMap for existing string-map edit semantics only after choosing replacement versus incremental None behavior. These are definition-side steps, not a complete operation recipe. (rust/lance-table/src/transaction/operation.rs:37-248; rust/lance-table/src/transaction/operation.rs:279-300; rust/lance-table/src/transaction/operation.rs:399-420; rust/lance-table/src/transaction/builder.rs:16-25; rust/lance-table/src/transaction/conflicts.rs:18-29; rust/lance-table/src/transaction.rs:44-55; rust/lance-table/src/transaction/update_map.rs:58-81)

Before implementation, finish validate/proto/conflicts/manifest/index-maintenance and commit integration. Preserve per-attempt index preparation and fixed read-version evidence; a new public container alone does not enforce these policies. Extend actual consumer tests, considering duplicate equality inputs, map-key insert/delete collisions, u32 source bounds and retrying against a new manifest. No tests were added or executed in this read-only analysis. (rust/lance-table/src/transaction.rs:15-27; rust/lance-table/src/transaction.rs:86-102; rust/lance-table/src/transaction/prepare.rs:44-100; rust/lance-table/src/transaction/operation.rs:338-397)
`);
append('L4-crosscutting/pitfalls.md',`## Definition and fixture traps

- FragReuseUpdate is non_exhaustive; Operation/UpdateMode are exhaustive. PreparedIndices private fields restrict external construction but crate new performs no validation; TaggedRewriteAssembly public fields allow bypassing its limited u32 source check. (rust/lance-table/src/transaction/prepare.rs:26-73; rust/lance-table/src/transaction/operation.rs:37-39; rust/lance-table/src/transaction/operation.rs:250-261; rust/lance-table/src/transaction/operation.rs:309-360)
- Replacement edits skip deletions after clearing, so insert-then-delete of one key leaves the insertion. Incremental mode removes it. Entry equality is order-sensitive despite HashMap translators having unspecified iteration order. (rust/lance-table/src/transaction/update_map.rs:49-128)
- RewriteGroup duplicate-bearing equality can be asymmetric; UpdatedFragmentOffsets sizing omits container costs and RewrittenIndex sizing omits new_index_files. These source-level findings are not executed regressions. (rust/lance-table/src/transaction/operation.rs:270-277; rust/lance-table/src/transaction/operation.rs:374-397)
- tagged_entry divides by destination count, drops a remainder, materializes every moved row address and narrows lineage IDs unchecked. Empty destinations or invalid IDs are not robust fixture inputs. It generates dataset_version0/index_version1 metadata; callers must adapt it to the tested attempt. (rust/lance-table/src/transaction/test_support.rs:47-60; rust/lance-table/src/transaction/test_support.rs:127-199)
`);
append('L4-crosscutting/build-and-test.md',`## Shared transaction fixture interpretation

test_support is cfg(test) and supplies metadata-only helpers. sample_manifest uses id:Int32nonnull/V2_0/fragment0; stable fixture sets reader flag, nextID1000 and version4. update_txn uses read4/modeNone with empty changed-field/index fields. default config uses current clock, stableIDsfalse and empty preloads; sample index adds random UUID/current timestamp. created/latest version helpers unwrap every lookup/load and materialize Vecs. Tagged histories assume valid even splits and bounded IDs. No storage, retry or index-query success follows from constructing them. (rust/lance-table/src/transaction.rs:41-42; rust/lance-table/src/transaction/test_support.rs:20-199)
`);
const previous=JSON.parse(read('analysis/iteration-036-contextual-reads.json'));
write('analysis/iteration-037-contextual-reads.json',JSON.stringify({iteration:37,partial_only:[{path:'rust/lance-table/src/transaction/manifest_build.rs',ranges:[[70,140],[208,225],[463,524],[580,615],[736,785],[910,1045]]},{path:'rust/lance-table/src/transaction/conflicts.rs',ranges:[[1,102]]},{path:'rust/lance-table/src/system_index/frag_reuse.rs',ranges:[[26,26]],note:'Lexical constant only.'}],previous_partial_reads:previous.previous_partial_reads.filter(x=>!x.path.endsWith('/manifest_build.rs'))},null,2)+'\n');
console.log({layers:'L0-L4',supplement:'L1-modules/rust-lance-table-transactions.md',symbols:symbols.length});
