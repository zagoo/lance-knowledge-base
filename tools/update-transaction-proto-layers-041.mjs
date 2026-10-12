import fs from 'node:fs';import {root,linesOf}from './inventory.mjs';
const read=f=>fs.readFileSync(f,'utf8'),append=(f,s)=>fs.appendFileSync(f,'\n\n'+s+'\n'),write=(f,v)=>fs.writeFileSync(f,JSON.stringify(v,null,2)+'\n');
const a=JSON.parse(read('analysis/iteration-041-transaction-proto.json')).files[0],src=linesOf(read(root+'/'+a.path)),added=[];let owner='';
function add(name,line,end_line,kind,visibility,callers,callees){const r=a.ranges.find(([b,e])=>b<=line&&line<=e);added.push({name:'lance_table::transaction::proto::'+name,path:a.path,line,end_line,kind,visibility,behavior:r[2],behavior_reference:`${a.path}:${r[0]}-${r[1]}`,callers,callees});}
for(let i=0;i<src.length;i++){
const im=src[i].match(/^impl (.+) for (.+) \{$/);if(im){owner=`<${im[2]} as ${im[1]}>`;add(owner,i+1,i+1,'implementation','public trait implementation through public types','Transaction conversion paths; local tests; complete global call graph pending.','Trait method below.');continue;}
if(src[i].match(/^\s+type Error = Error;/))add(owner+'::Error',i+1,i+1,'associated type','public trait associated type','TryFrom caller.','lance_core::Error.');
const fn=src[i].match(/^\s+fn (\w+)/);if(fn){let end=i+1;while(!/[{;]\s*$/.test(src[end-1]))end++;const test=i>=808;add(test?'tests::'+fn[1]:owner+'::'+fn[1],i+1,end,'function',test?'private cfg(test)':'public trait method',test?'Rust test harness; source read only.':owner.includes('Transaction')?'Transaction persistence/outcome paths; contextual rust/lance/src/io/commit.rs:272-283; local conversion tests.':'Transaction converter in this file; nested group/map/index conversion.','Nested metadata trait converters, ordered collection and explicit field/default handling; exact body and failures in L2.');}
}
add('tests',809,809,'module','private cfg(test)','Rust harness.','Two conversion tests.');
const prior=JSON.parse(read('analysis/rust-symbols.json')).filter(s=>s.path!==a.path);write('analysis/rust-symbols.json',[...prior,...added]);
const normalization=`| Rust/protobuf input | Conversion result |
|---|---|
| Empty tag / properties / Overwrite config or bases / RewrittenIndex file list | Decode None |
| Rewrite groups empty | Decode one group from old flat lists, even both empty |
| Rewrite transient frag_reuse_index | Never encoded; decode None |
| Update mode None | Encode0; decode Some(RewriteRows) |
| Unknown update mode integer | Decode Some(RewriteRows) |
| Update empty bitmap entries | Encoder omits them; resulting empty map decodes None |
| Nonempty field10 map with only zero-byte values | Select field10, discard entries, decode None; field9 ignored |
| Valid encoded empty Roaring bitmap in field10 | Decode retains keyed empty bitmap, unlike encoder |
| Overwrite/Merge schema_metadata | Encoder emits empty; decoder ignores supplied map |
| UpdateMap | Entry order, duplicates, optional values and replace preserved |

These are object-conversion rules, not a claim of byte-canonical protobuf encoding or complete operation identity. Their source is rust/lance-table/src/transaction/proto.rs:121-184, rust/lance-table/src/transaction/proto.rs:244-283, rust/lance-table/src/transaction/proto.rs:410-469, rust/lance-table/src/transaction/proto.rs:525-640 and rust/lance-table/src/transaction/proto.rs:711-797. Fields excludes schema-level metadata for Project as well (rust/lance-file/src/datatypes.rs:240-243; rust/lance-file/src/datatypes.rs:292-300; rust/lance-table/src/transaction/proto.rs:285-293; rust/lance-table/src/transaction/proto.rs:642-647).
`;
append('L1-modules/rust-lance-table-transactions.md',`## Protobuf conversion contracts

[Complete proto L2](../L2-files/rust/lance-table/src/transaction/proto.rs.md) covers all885 lines,13 trait implementations and two local tests. These convert generated protobuf objects, with nested Roaring bytes; complete transaction byte framing and IO are elsewhere. validate_operation is not invoked by these converters. (rust/lance-table/src/transaction/proto.rs:28-806)

${normalization}

UpdateConfig reads old style only when legacy data is nonempty and no new-style presence exists. Mixing any Some new map (even empty) or nonempty new field map with legacy data errors. Old config edits become incremental; old schema and field maps become replacement; high unsigned old field IDs cast to signed without validation. Writers emit only new-style fields. Preserve these existing read paths under the legacy boundary; no extra migration behavior was introduced. (rust/lance-table/src/transaction/proto.rs:295-374; rust/lance-table/src/transaction/proto.rs:649-675)

Errors differ by path: missing operation is Internal; missing replacement file and rewritten-index required IDs/details are InvalidInput; malformed field10 bitmap is InvalidInput with fragment ID. Update compacted-SSTable conversion unwraps a fallible UUID conversion, while UpdateMemWalState propagates it. Nested Fragment/Schema/Index/Overlay/filter errors propagate unless that explicit unwrap applies. No format/feature gate or validation of UUID strings/versions occurs in transaction envelope conversion. (rust/lance-table/src/transaction/proto.rs:39-53; rust/lance-table/src/transaction/proto.rs:83-284; rust/lance-table/src/transaction/proto.rs:383-470; rust/lance-table/src/system_index/mem_wal.rs:125-139)

### Exact protobuf conversion declarations

| Symbol | Signature | Visibility | Evidence |
|---|---|---|---|
${added.filter(s=>s.kind==='function').map(s=>`| \`${s.name}\` | \`${src.slice(s.line-1,s.end_line).join(' ').trim().replaceAll('|','\\|')}\` | ${s.visibility} | [${s.path}:${s.line}-${s.end_line}](../L2-files/${s.path}.md) |`).join('\n')}
`);
append('L0-orientation.md',`## Durable transaction representation

Operation intent converts to a generated protobuf transaction before storage. Rust optional-empty states and transient rewrite metadata may disappear; unknown update-mode values decode as row rewrite, and empty rewrite groups take a legacy fallback. Therefore in-memory equality, decoded operation equality and persisted protobuf identity are distinct contracts. Complete byte storage/outcome recovery remains pending. (rust/lance-table/src/transaction/proto.rs:151-184; rust/lance-table/src/transaction/proto.rs:244-283; rust/lance-table/src/transaction/proto.rs:410-424; rust/lance-table/src/transaction/proto.rs:555-569; rust/lance/src/io/commit.rs:246-283)
`);
append('L3-symbols/behavior-contracts.md',`## Transaction object codec normalizations

${normalization}

Field10 offsets are selected by outer map presence, not successful decoded contents; old field9 is an all-or-nothing fallback. Old config data cannot coexist with new-style presence. Group/entry/vector order generally survives conversion, while HashMap iteration order is unspecified; converters allocate owned nested collections and clone borrowed strings/Any payloads. No commit, validation or canonicalization of equivalent edit effects occurs. (rust/lance-table/src/transaction/proto.rs:252-374; rust/lance-table/src/transaction/proto.rs:492-797)
`);
append('L3-symbols/format-spec.md',`## Transaction object conversion and legacy reads

The16 operation oneof tags100-115 are declared in the transaction schema; exhaustive Rust conversion covers all16. Current writers use Rewrite.groups, Update offset bitmap field10 and new UpdateConfig maps only. Existing readers retain old flat Rewrite lists, field9 lists and old config-map translation. Full released-version qualification and file framing remain pending; current-branch intermediate states do not create compatibility obligations. (protos/transaction.proto:410-429; rust/lance-table/src/transaction/proto.rs:151-184; rust/lance-table/src/transaction/proto.rs:252-374; rust/lance-table/src/transaction/proto.rs:555-675; AGENTS.md:7-18)

${normalization}

The in-memory rewrite test checks only dropped transient entry, allowing empty groups to normalize unnoticed. The overlay test decodes a hand-built transaction protobuf after encoding only the nested overlay, and checks group/coverage/version. Neither test writes complete transaction bytes. (rust/lance-table/src/transaction/proto.rs:814-885)
`);
append('L4-crosscutting/scenarios.md',`## Local transaction protobuf trace

1. Borrow Transaction and match all16 Operation variants, cloning/converting owned protobuf fields. Strip transient rewrite reuse metadata, leave old writer fields empty, preserve ordered UpdateMap edits. This constructs a protobuf object without publishing bytes. (rust/lance-table/src/transaction/proto.rs:492-806)
2. Decode an owned protobuf by operation, applying legacy fallbacks and optional-empty normalization. Decode nested fragment/schema/index/bitmap payloads; report missing operation as Internal. Update SSTable conversion can panic on missing shard UUID because it unwraps, whereas UpdateMemWalState returns the error. (rust/lance-table/src/transaction/proto.rs:83-426; rust/lance-table/src/system_index/mem_wal.rs:125-139)
3. A valid field10 bitmap-map presence suppresses all old field9 data; zero-byte values disappear but encoded empty bitmaps remain. New writes filter all empty bitmap values, so repeated decode/encode can change map presence. No runtime regression was executed. (rust/lance-table/src/transaction/proto.rs:252-283; rust/lance-table/src/transaction/proto.rs:624-640)

Local codec and validation are covered. Full write/compaction, scalar-index registration, all v2 behavior, Python mapping and end-to-end commit questions still fail because their consumer/lifecycle paths remain missing.
`);
append('L4-crosscutting/cookbook.md',`## Extend a transaction payload through its codec

Update both exhaustive operation matches and any group converters, then decide presence/default/ordering semantics explicitly. Preserve stable released tags and frozen legacy read behavior; current writers emit only modern group/map forms. Coordinate new fields with equality, validate_operation, manifest/index effects and full resolver/IO before calling the recipe complete. (rust/lance-table/src/transaction/proto.rs:83-426; rust/lance-table/src/transaction/proto.rs:492-724; protos/transaction.proto:410-429; AGENTS.md:7-18)

Extend existing conversion tests with independent expectations for all affected fields, None/empty states, schema metadata, unknown modes, malformed compacted shard IDs, field10 precedence/zero-byte/corrupt/empty bitmaps, mixed config styles and empty rewrite groups. Do not infer a full byte roundtrip from tests that only construct generated messages. Existing legacy read behavior is documented, not proposed for extension. (rust/lance-table/src/transaction/proto.rs:121-184; rust/lance-table/src/transaction/proto.rs:217-374; rust/lance-table/src/transaction/proto.rs:814-885)
`);
append('L4-crosscutting/pitfalls.md',`## Transaction codec edge cases

- Update unwraps malformed CompactedSsTable errors; UpdateMemWalState propagates the same converter. The public outer TryFrom Result does not guarantee panic-free malformed input. (rust/lance-table/src/transaction/proto.rs:239-242; rust/lance-table/src/transaction/proto.rs:383-390; rust/lance-table/src/system_index/mem_wal.rs:125-139)
- Empty Rewrite groups decode as one empty legacy group; the transient-entry test does not assert this shape. Unknown update modes silently become row rewrites. (rust/lance-table/src/transaction/proto.rs:151-184; rust/lance-table/src/transaction/proto.rs:244-248; rust/lance-table/src/transaction/proto.rs:814-840)
- Field10 map presence suppresses field9 even when every new value is empty bytes. Valid encoded empty bitmaps are retained on read but removed on write. (rust/lance-table/src/transaction/proto.rs:252-283; rust/lance-table/src/transaction/proto.rs:624-640)
- Overwrite/Merge schema metadata is ignored/empty, and Fields reconstruction also leaves Project schema-level metadata empty. Field-level metadata has its own converter contract; do not conflate both levels. (rust/lance-table/src/transaction/proto.rs:121-147; rust/lance-table/src/transaction/proto.rs:198-213; rust/lance-table/src/transaction/proto.rs:285-293; rust/lance-file/src/datatypes.rs:240-243; rust/lance-file/src/datatypes.rs:292-300)
`);
append('L4-crosscutting/build-and-test.md',`## Transaction protobuf tests

Two local tests: transient rewrite metadata disappears; a hand-built overlay transaction decodes group7,coverage{1,4},version6. They exercise generated objects and nested bitmap serialization, without complete transaction byte IO. The transient test starts with empty groups but asserts only reuse entry None; the overlay test never encodes the outer Rust Transaction. Other modules contain lexical roundtrip call sites still pending full analysis. No source tests executed. (rust/lance-table/src/transaction/proto.rs:808-885)
`);
const edits=[];
function replace(file,old,value){let s=read(file);if(!s.includes(old))throw Error('Missing target '+file+' '+old);s=s.replace(old,value);fs.writeFileSync(file,s);edits.push({file,old,value});}
replace('L1-modules/rust-lance-table.md','Thirty-four of 54 inventory entries are analyzed, covering 18,243 physical lines','Thirty-five of 54 inventory entries are analyzed, covering 19,128 physical lines');
replace('L1-modules/rust-lance-table.md','transaction definitions/validation/equality/metadata overlap/map updates/attempt containers and row-version helpers','transaction definitions/protobuf conversion/validation/equality/metadata overlap/map updates/attempt containers and row-version helpers');
replace('L1-modules/rust-lance-table-transactions.md','Full validation, conflicts, protobuf conversion, index maintenance, manifest assembly and commit IO remain pending.','Local validation, equality/metadata predicates and protobuf conversion are covered below. Full conflict resolver, index maintenance, manifest assembly and commit IO remain pending.');
replace('L1-modules/rust-lance-table-transactions.md','Complete codec/outcome handling remains pending.','The complete object codec is documented below; full outcome recovery remains pending.');
replace('L3-symbols/format-spec.md','This slice does not inspect the transaction encoder/decoder, so serialization omission is a documented contract awaiting codec verification. UpdateMap models ordered edits and a replace flag; exact field/tag conversion remains pending proto.rs.','The complete object codec below confirms transient omission. UpdateMap models ordered edits and a replace flag; bidirectional conversion preserves them. (rust/lance-table/src/transaction/proto.rs:151-184; rust/lance-table/src/transaction/proto.rs:555-569; rust/lance-table/src/transaction/proto.rs:767-797)');
replace('L3-symbols/format-spec.md','full transaction serialization and outcome recovery remain pending.','the object codec is now covered below, while complete byte framing and outcome recovery remain pending.');
replace('L4-crosscutting/scenarios.md','Full operation validation, index effects, conflict rebasing, publication, disk allocation and cleanup remain pending.','Local operation validation is covered below; full index effects, conflict rebasing, publication, disk allocation and cleanup remain pending.');
replace('L4-crosscutting/scenarios.md','The operation enum is now available; full validation, conflict decisions, manifest application, protobuf persistence and store publication remain gaps.','The operation enum, local validator and object codec are now covered; full conflict decisions, manifest application, byte persistence and store publication remain gaps.');
replace('L4-crosscutting/cookbook.md','still requires operation/proto/validate/conflicts/prepare/manifest/IO analysis.','still requires complete manifest/index/conflict-resolver/IO analysis; operation definitions, local validation/equality and object codec are now covered.');
replace('L4-crosscutting/cookbook.md','Before implementation, finish validate/proto/conflicts/manifest/index-maintenance and commit integration.','Before implementation, finish full conflict-resolver/manifest/index-maintenance and commit integration; local validation, equality and codec are covered below.');
replace('L4-crosscutting/cookbook.md','column decoding requires the still-pending rowids implementation.','column decoding requires pending stream/reader integration; the local row-ID sequence and codec are covered.');
write('analysis/iteration-041-status-refresh.json',edits);
const context=JSON.parse(read('analysis/iteration-040-contextual-reads.json'));context.iteration=41;context.partial_only.find(x=>x.path.endsWith('system_index/mem_wal.rs')).ranges=[[83,139]];context.partial_only.push({path:'rust/lance-file/src/datatypes.rs',ranges:[[89,246],[292,317]],note:'Fields wrapper/reconstruction and schema flattening context; complete field converters and rest of file pending.'});write('analysis/iteration-041-contextual-reads.json',context);
console.log({added_symbols:added.length,rust_total:prior.length+added.length,status_refreshes:edits.length,layers:'L0-L4'});
