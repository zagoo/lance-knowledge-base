import fs from 'node:fs';import{root,linesOf}from './inventory.mjs';
const read=f=>fs.readFileSync(f,'utf8'),write=(f,v)=>fs.writeFileSync(f,JSON.stringify(v,null,2)+'\n'),append=(f,s)=>fs.appendFileSync(f,'\n\n'+s+'\n'),batch=JSON.parse(read('analysis/iteration-045-mem-wal.json')),a=batch.files[0],src=linesOf(read(root+'/'+a.path)),prefix='lance_table::system_index::mem_wal',added=[];let test=false,owner='',structure='',enumOwner='';
function add(name,line,end_line,kind,visibility){const r=a.ranges.find(([b,e])=>b<=line&&line<=e);added.push({name:prefix+'::'+name,path:a.path,line,end_line,kind,visibility,behavior:r[2],behavior_reference:`${a.path}:${r[0]}-${r[1]}`,callers:test?'Local unit harness; tests were not run.':'Sibling transaction codec; contextual manifest builder Update/UpdateMemWalState; contextual dataset open/cache. See L1/L4 for exact ranges. Full writer/recovery/commit callers pending.',callees:'Protobuf converters, UUID, serde/deep-size derives, Any::to_msg/from_msg, Vec/HashMap/HashSet operations, local loaders and metadata constructor as shown in exact body; no storage IO.'});}
for(let i=0;i<src.length;i++){
if(src[i]==='}'){owner='';structure='';enumOwner='';}
const mod=src[i].match(/^mod (\w+)/);if(mod){test=true;add(mod[1],i+1,i+1,'module','private cfg(test)');}
const ty=src[i].match(/^pub (struct|enum|type) (\w+)/);if(ty){structure=ty[1]==='type'?'':ty[2];enumOwner=ty[1]==='enum'?ty[2]:'';add(ty[2],i+1,i+1,ty[1],'public');continue;}
if(structure){const field=src[i].match(/^    pub (\w+):\s/);if(field)add(structure+'::'+field[1],i+1,i+1,'field','public');if(enumOwner){const v=src[i].match(/^    (\w+),$/);if(v)add(enumOwner+'::'+v[1],i+1,i+1,'variant','public');}}
const im=src[i].match(/^impl (.+) \{$/);if(im){owner=im[1].includes(' for ')?'<'+im[1].split(' for ')[1]+' as '+im[1].split(' for ')[0]+'>':im[1];add(owner,i+1,i+1,'implementation',owner.startsWith('<')?'public trait implementation':'inherent implementation');}
if(/^    type Error = Error;/.test(src[i]))add(owner+'::Error',i+1,i+1,'associated type','public trait associated type');
const c=src[i].match(/^pub const (\w+)/);if(c)add(c[1],i+1,i+1,'constant','public');
const fn=src[i].match(/^\s*(pub )?fn (\w+)/);if(fn){let end=i+1;while(!/[{;]\s*$/.test(src[end-1]))end++;add((test?'tests::':owner?owner+'::':'')+fn[2],i+1,end,'function',test?'private cfg(test)':fn[1]?'public':owner.startsWith('<')?'public trait method':'private');}}
const prior=JSON.parse(read('analysis/rust-symbols.json')).filter(s=>s.path!==a.path);for(const x of prior){if(x.path===batch.files[1].path&&x.line>=14&&x.line<=20)x.behavior=batch.files[1].ranges[1][2];}write('analysis/rust-symbols.json',[...prior,...added]);
const api=added.filter(s=>s.visibility.startsWith('public')).map(s=>`| \`${s.name}\` | \`${src.slice(s.line-1,s.end_line).join(' ').trim().replaceAll('|','\\|')}\` | ${s.visibility} | [${s.path}:${s.line}-${s.end_line}](../L2-files/${s.path}.md) |`).join('\n');
append('L1-modules/rust-lance-table.md',`## MemWAL metadata models and local update surface

[Complete file analysis](../L2-files/rust/lance-table/src/system_index/mem_wal.rs.md) covers660 lines. This module owns typed metadata and in-memory conversion/update rules. Its synchronous open method does not read storage; shard ownership, WAL replay, CAS manifest allocation and atomic base-table publication remain caller responsibilities. (rust/lance-table/src/system_index/mem_wal.rs:4-14; rust/lance-table/src/system_index/mem_wal.rs:194-327; rust/lance-table/src/system_index/mem_wal.rs:493-618)

| Symbol | Exact declaration | Visibility | Evidence |
|---|---|---|---|
${api}

All models are publicly mutable; constructors/codecs generally preserve values rather than validating domain relationships. Sharding transform/expression exclusivity, field types/config parsing, shard-count consistency and generation ordering are not established by deserialization. Compaction-progress update is the explicit local strict-generation boundary. (rust/lance-table/src/system_index/mem_wal.rs:329-489; rust/lance-table/src/system_index/mem_wal.rs:531-590)
`);
append('L1-modules/rust-lance-table-transactions.md',`## MemWAL progress mutation dependency

The complete MemWAL metadata module is now covered in the [crate API catalog](rust-lance-table.md). update_mem_wal_index_compacted_sstables returns immediately for empty input; otherwise rejects duplicate proposed shard UUIDs, requires an existing reserved-name index, decodes a copy and requires each existing shard generation to increase strictly. All Result errors preserve the input slice; success replaces one entry in place with fresh UUID/timestamp/inline details. (rust/lance-table/src/system_index/mem_wal.rs:518-618)

Contextual manifest builder calls it in Update and UpdateMemWalState. The latter preserves fragments; the former puts rows and generation in the same candidate manifest by intent. Complete builder publication/retry ordering remains pending. (rust/lance-table/src/transaction/manifest_build.rs:1009-1017; rust/lance-table/src/transaction/manifest_build.rs:1554-1564)
`);
append('L0-orientation.md',`## MemWAL vocabulary

- **SSTable**: immutable flushed MemTable result stored as a Lance dataset, identified by generation/path. Optional payload/row/key measurements describe writer accounting; missing means unmeasured, and payload bytes exclude reader array overhead. (rust/lance-table/src/system_index/mem_wal.rs:31-68)
- **CompactedSsTable**: shard UUID plus latest compacted generation marker. **IndexCatchupProgress** tracks generation per index/shard; absent lookup is documented as fully caught up, not generation zero. (rust/lance-table/src/system_index/mem_wal.rs:94-165)
- **ShardManifest**: shard identity/spec/values, fencing epoch, version, WAL positions, SSTables and lifecycle state. Sealed is the reversible drop-table in-doubt state; enforcement and recovery are external. (rust/lance-table/src/system_index/mem_wal.rs:194-267)
- **MemWalIndexDetails**: configuration, snapshots, compacted markers, index catchup and writer defaults stored in system-index Any metadata. Ordinary mutation here is synchronous; it does not itself write WAL or publish a commit. (rust/lance-table/src/system_index/mem_wal.rs:391-618)
`);
append('L3-symbols/behavior-contracts.md',`## MemWAL compaction-progress transaction boundary

Preserve validation order: empty update no-op; duplicate proposed shard rejection; first reserved-name index lookup; decode current metadata; strict greater-than validation for every existing marker; fresh metadata construction; one final in-place assignment. Earlier proposed advances stay local until all checks succeed. Equal generation is stale too, preventing a retry from attaching a second mutation to the same recorded generation. No-index input does not invent default MemWAL state. (rust/lance-table/src/system_index/mem_wal.rs:518-590)

Existing duplicate stored shard markers are not checked and first match wins. New shard markers including generation0 are accepted without verifying shard existence in snapshots/specs; num_shards and catchup do not change automatically. All other decoded details fields persist, but the outer metadata is regenerated: UUID, created_at and dataset_version change; fields/coverage/base/files become the constructor defaults. It is semantic known-field preservation, not byte-verbatim Any preservation. (rust/lance-table/src/system_index/mem_wal.rs:431-458; rust/lance-table/src/system_index/mem_wal.rs:569-618)

The local function is failure-atomic for returned errors over the caller slice. It provides no global concurrency synchronization or disk publication guarantee. Temporary metadata clone, decoded vectors/maps and encoded replacement bytes can coexist; stored-marker scanning costs grow with both existing/proposed counts. Cache identity rationale is supported by the contextual dataset key using MemWAL UUID plus optional fragment-reuse UUID. (rust/lance-table/src/system_index/mem_wal.rs:540-618; rust/lance/src/index.rs:3802-3832)

## MemWAL lookup and lifecycle limitations

All progress lookups select first exact name/UUID matches and return Option without sorting, max reduction or duplicate checks. ShardManifest next_version adds1 with unchecked ordinary arithmetic; gap-free CAS rationale is documentation, not allocation logic. Unknown protobuf ShardStatus values map to Active and reencode as0, while Sealed is exactly1. Treating unknown as rejected or preserved would misdescribe this decoder. (rust/lance-table/src/system_index/mem_wal.rs:157-164; rust/lance-table/src/system_index/mem_wal.rs:209-266; rust/lance-table/src/system_index/mem_wal.rs:472-488)
`);
append('L3-symbols/format-spec.md',`## MemWAL object-to-protobuf semantics

SsTable optional measurements preserve None versus Some(0); unmeasured flush metadata cannot be charged as zero reader memory. ShardManifest requires a16-byte UUID, folds duplicate repeated shard-field entries last-wins into HashMap, and reencodes fields in unspecified HashMap order. The converter checks no WAL-position relation or field-byte type. Status discriminator1 is Sealed; all others decode Active and reencode0. (rust/lance-table/src/system_index/mem_wal.rs:31-92; rust/lance-table/src/system_index/mem_wal.rs:125-138; rust/lance-table/src/system_index/mem_wal.rs:209-327; rust/lance-table/src/format.rs:57-68)

MemWalIndexDetails missing maintain_all_indexes becomes false; writing always emits Some(bool). Snapshot bytes remain opaque. Structured compaction/catchup UUIDs are validated, but config strings, transform/expression combinations and duplicate IDs are not. new_mem_wal_index_meta emits index_version0, no files and inline Any; that metadata version is distinct from shard generation, writer epoch and manifest version. These object codecs do not define WAL file framing or store commit protocol. (rust/lance-table/src/system_index/mem_wal.rs:329-458; rust/lance-table/src/system_index/mem_wal.rs:598-618)
`);
append('L4-crosscutting/scenarios.md',`## Local MemWAL generation publication preparation

1. A manifest-builder Update or UpdateMemWalState supplies progress and candidate dataset version to the helper. Empty progress leaves metadata untouched. (rust/lance-table/src/transaction/manifest_build.rs:1009-1017; rust/lance-table/src/transaction/manifest_build.rs:1554-1564; rust/lance-table/src/system_index/mem_wal.rs:531-538)
2. Reject duplicate proposed shards and missing system index, then decode a copy. For each shard, require strict advancement from the first stored marker or append a new one. A later failure discards earlier local updates. (rust/lance-table/src/system_index/mem_wal.rs:540-585)
3. Serialize new details into a fresh index UUID and replace the same position. The dataset opening path later builds a cache key from that UUID and optional FRI UUID, checks cache, loads metadata on miss and invokes synchronous open; actual metadata-load/store commit lifecycle remains pending. (rust/lance-table/src/system_index/mem_wal.rs:587-618; rust/lance/src/index.rs:3802-3832)

This traces an in-memory dependency, not atomic storage publication, shard claim/replay or the complete Dataset::write/compact_files lifecycle. All five full KB-only acceptance questions remain FAIL.
`);
append('L4-crosscutting/cookbook.md',`## Modify MemWAL metadata or progress rules

Coordinate public structs, both protobuf converters, Any loader and metadata constructor; retain optional-measurement presence and explicit maintain_all_indexes normalization. Define validation at the Rust boundary rather than relying on freely mutable structs or serde. New generation behavior must preserve rejection before caller mutation and fresh UUID replacement for cache identity. Inspect contextual Update/UpdateMemWalState callers and complete remaining builder/conflict/store paths before calling the recipe complete. (rust/lance-table/src/system_index/mem_wal.rs:31-193; rust/lance-table/src/system_index/mem_wal.rs:391-618; rust/lance-table/src/transaction/manifest_build.rs:1009-1017; rust/lance-table/src/transaction/manifest_build.rs:1554-1564)

Extend existing conversion and generation-rejection fixtures rather than overlapping test files. The current source tests include lower/equal generations, duplicate proposed shards, missing index, position preservation and selected unrelated-state preservation. Released compatibility still needs checked-in historical fixtures; current protobuf object construction is not that evidence. (rust/lance-table/src/system_index/mem_wal.rs:620-660; rust/lance/src/index/mem_wal.rs:684-861; AGENTS.md:80-91)
`);
append('L4-crosscutting/pitfalls.md',`## MemWAL metadata traps

- Payload bytes exclude reader array overhead; absent measurement means unknown. Do not budget an unmeasured SSTable as zero, or interpret total primary-key bytes as bytes per row. (rust/lance-table/src/system_index/mem_wal.rs:36-54)
- Returning the maximum stored generation while accepting stale row mutations breaks the documented rows/progress pairing. Existing-marker comparison is strictly greater; all proposals validate before replacement. (rust/lance-table/src/system_index/mem_wal.rs:518-590)
- Opening details is synchronous metadata parsing, whereas the dataset's open path performs async cache/metadata work. The explicit type-url suffix check is followed by dependency Any::to_msg validation; it is not proof every suffix match is accepted. (rust/lance-table/src/system_index/mem_wal.rs:493-516; rust/lance/src/index.rs:3802-3832)
- ShardStatus unknown values become Active; next_version does ordinary+1. Neither helper proves safe future-state handling, gap-free allocation or actual writer fencing. (rust/lance-table/src/system_index/mem_wal.rs:194-266)
`);
append('L4-crosscutting/build-and-test.md',`## MemWAL metadata tests and contextual progress tests

Two local unit tests verify missing measurements stay None and measured4096/10/80 values roundtrip completely. They construct current protobuf objects; no historical files or runtime memory measurements are involved. (rust/lance-table/src/system_index/mem_wal.rs:620-660)

Selected contextual tests in the still-partial dataset adapter file verify adding/advancing two shards, lower/equal rejection, duplicate proposals, missing index, index-list position and selected unrelated fields. The lower-generation case checks UUID unchanged and generation10 retained; it does not compare the entire metadata list. These tests were read, not run, and the surrounding file remains pending. (rust/lance/src/index/mem_wal.rs:670-861)
`);
const edits=[];function replace(f,old,value){let s=read(f);if(!s.includes(old))throw Error('Missing '+old);fs.writeFileSync(f,s.replace(old,value));edits.push({file:f,old,value});}
replace('L1-modules/rust-lance-table.md','Forty-one of 54 inventory entries are analyzed, covering 23,550 physical lines','Forty-two of 54 inventory entries are analyzed, covering 24,210 physical lines');
write('analysis/iteration-045-status-refresh.json',edits);
const context=JSON.parse(read('analysis/iteration-044-contextual-reads.json'));context.iteration=45;context.partial_only=context.partial_only.filter(e=>e.path!==a.path);context.partial_only.find(e=>e.path.endsWith('/transaction/manifest_build.rs')).ranges.push([1545,1569]);context.partial_only.push({path:'rust/lance/src/index.rs',ranges:[[3798,3835]],note:'Complete local open_mem_wal_index method and neighboring boundary only; full dataset index module pending.'},{path:'rust/lance/src/index/mem_wal.rs',ranges:[[670,868]],note:'Selected complete local generation helper tests; next test documentation begins. Whole file remains pending.'});write('analysis/iteration-045-contextual-reads.json',context);console.log({added_symbols:added.length,rust_total:prior.length+added.length,status_refreshes:edits.length});
