import fs from 'node:fs';import path from 'node:path';import{root,output,linesOf}from './inventory.mjs';const read=f=>fs.readFileSync(path.join(output,f),'utf8'),write=(f,s)=>fs.writeFileSync(path.join(output,f),s.trimEnd()+'\n'),append=(f,s)=>fs.appendFileSync(path.join(output,f),'\n'+s.trim()+'\n');
write('L1-modules/rust-lance-file.md',`# lance-file: file versions and entry points

**INCOMPLETE.** Seven of56 inventory entries are analyzed (631 physical text/symlink lines). Reader/writer implementations, encoding IO, schema adapters, compatibility fixtures and benches remain pending. README describes an internal crate not intended for external use, despite public Rust modules. (rust/lance-file/README.md:1-6)

[Orientation](../L0-orientation.md) · [Table metadata](rust-lance-table.md) · [Format](../L3-symbols/format-spec.md) · [Scenarios](../L4-crosscutting/scenarios.md) · [Build/test](../L4-crosscutting/build-and-test.md)

## Responsibility and routes

The crate declares readers/writers for the Lance file format. Its facade exports concat,datatypes,format,reader,testing,version,versions,writer; io is crate-visible with LanceEncodingsIo publicly reexported; compatibility_tests is private under cfg(test). Actual reader/writer behavior and all unreviewed APIs remain unknown. (rust/lance-file/README.md:3-6; rust/lance-file/src/lib.rs:4-17)

\
\`\`\`text
lance_file
|-- version: request policy -> exact identity -> metadata/footer codecs
|-- determine_file_version: size -> last8 bytes -> magic -> exact identity
|-- format: generated pb / pbfile, LANC magic and legacy0.2 constants
|-- io: crate-visible, LanceEncodingsIo reexport (implementation pending)
|-- reader / writer / concat / datatypes / versions (pending)
|-- testing (pending)
\`-- compatibility_tests (private cfg(test), pending)
\`\`\`

Routes follow rust/lance-file/src/lib.rs:4-60 and rust/lance-file/src/version.rs:19-262. No capability is inferred from numeric release order.

## Caller requests and persisted identities

LanceFileVersion is a caller selector with Legacy,V2_0,V2_1,Stable,V2_2,Next,V2_3. Default is exact V2_2. resolve() maps Stable->V2_2,Next->V2_3 and exact variants to themselves (Legacy->V1). is_unstable is true only after resolving to V2_3. Display/serde preserve stable/next as strings; they are request serialization, not strict persisted identity codecs. (rust/lance-file/src/version.rs:19-127)

FromStr lowercases but does not trim. Accepted aliases are0.1/legacy,2.0/0.3,2.1,2.2,2.3,stable,next. ConcreteFileVersion has only V1,V2_0,V2_1,V2_2,V2_3, derives Hash but no ordering, and has no Default/serde/FromStr implementation here. Strict from_manifest_string accepts canonical0.1/2.0/2.1/2.2/2.3 only. to_selector always produces exact variants, losing prior policy intent. (rust/lance-file/src/version.rs:92-107; rust/lance-file/src/version.rs:128-197)

| Exact identity | Manifest string | DataFile metadata(u32,u32) | Standard footer(u16,u16) | Embedded footer(u16,u16) |
|---|---|---|---|---|
| V1 |0.1 |(0,2) |(0,2) |(0,2) |
| V2_0 |2.0 |(2,0) |(0,3) |(2,0) |
| V2_1 |2.1 |(2,1) |(2,1) |(2,1) |
| V2_2 |2.2 |(2,2) |(2,2) |(2,2) |
| V2_3 |2.3 |(2,3) |(2,3) |(2,3) |

Both numeric decoders accept(0,0..=2) as V1 and(0,3)/(2,0) as V2_0, plus the other listed exact pairs. They reject everything else with InvalidInput Unknown Lance storage version: value. Strict string decoding rejects0.3 even though request parsing and numeric footer alias handling accept their respective historical forms. The table describes mapping functions, not proof every writer calls them. (rust/lance-file/src/version.rs:172-272)

## Footer detection and errors

determine_file_version takes ObjectStore,Path,optional known usize size. If unknown, await store.size and checked-convert; if known, trust it. Reject size<8, await open_with_size and get_range(size-8..size), require footer[4..]==LANC, decode first four bytes as LEu16 major/minor and dispatch exact parser. IO errors propagate; size/magic/version errors are InvalidInput. Fewer than4 returned bytes could panic because no explicit received-length check precedes slicing. (rust/lance-file/src/lib.rs:25-60; rust/lance-file/src/format.rs:30-33)

This reads only the final8 bytes and does not verify pages, schema, full footer structure or data validity. The local async fixture uses synthetic8-byte legacy footers with no data. Known size avoids the explicit size call, but underlying store.open behavior and total request count remain pending. (rust/lance-file/src/lib.rs:30-59; rust/lance-file/src/version.rs:411-430)

## Dependencies, features and build

Package metadata/toolchain/lints inherit workspace. Runtime dependencies declare Lance Arrow/core/encoding/IO, Arrow arithmetic/array/buffer/cast/data/schema/select, async-recursion/async-trait, byteorder/bytes, datafusion-common, futures/log/num-traits, object_store,prost/prost-types,serde,tokio,tracing. Exact dependency versions, transitive features and exhaustive use-site reasons remain pending root/dependency analysis; reviewed code uses core errors/deepsize, serde and store/path types. (rust/lance-file/Cargo.toml:1-40; rust/lance-file/src/version.rs:4-11; rust/lance-file/src/lib.rs:19-23)

Dev dependencies are lance-datagen,lance-testing,criterion,rstest,proptest,pretty_assertions,rand,test-log,libc. Build dependencies prost-build and optional protobuf-src support protoc feature. docs.rs requests that feature; its Ubuntu rationale is a source comment, not a live service check. Reader/schema benches disable the standard harness. (rust/lance-file/Cargo.toml:41-72)

build.rs optionally sets PROTOC through unsafe process-environment mutation, enables proto3 optional, maps .lance.encodings to lance_encoding::format::pb and compiles shared file/file2/encodings_v2_0/encodings_v2_1 schemas. The protos symlink targets ../../protos/. format::pb and pbfile include generated lance.file.rs and lance.file.v2.rs. No build/install was performed. (rust/lance-file/build.rs:1-29; rust/lance-file/protos:1-1; rust/lance-file/src/format.rs:4-28)

## Extension boundary

Keep caller selectors distinct from exact storage identities; a new exact version needs explicit string/data-metadata/standard-footer/embedded-footer mapping and explicit capabilities elsewhere. Do not infer support by ordering, persist Stable/Next in manifests, or collapse the v2.0 footer alias distinction. The local tests pin these mappings but do not establish full historical reader/writer compatibility. Reader/writer extension traits and registrations remain pending. (rust/lance-file/src/version.rs:29-50; rust/lance-file/src/version.rs:128-262; rust/lance-file/src/version.rs:291-430)
`);
const records=JSON.parse(read('analysis/rust-symbols.json'));function api(p,selector,title){const selected=records.filter(s=>selector(s)&&s.kind==='function/method');append(p,'## '+title+'\n\n| Symbol | Exact declaration | Visibility | Evidence |\n|---|---|---|---|\n'+selected.map(s=>{const src=linesOf(fs.readFileSync(path.join(root,s.path),'utf8'));return '| `'+s.name+'` | `'+src.slice(s.line-1,s.end_line).join(' ').replaceAll('|','&#124;')+'` | '+s.visibility+' | ['+s.path+':'+s.line+'-'+s.end_line+'](../L2-files/'+s.path+'.md) |';}).join('\n'));return selected.length;}
const fileApis=api('L1-modules/rust-lance-file.md',s=>s.path.startsWith('rust/lance-file/'),'Exact reviewed callable declarations');
let t=read('L1-modules/rust-lance-table.md').replace('Seventeen of 54 inventory entries are analyzed, covering 6,497 physical lines','Eighteen of 54 inventory entries are analyzed, covering 6,912 physical lines').replace('Overlay staleness, row-ID sequence structures','Row-ID sequence structures').replace('DataStorageFormat default delegates to stable_file_version, whose current resolved value remains pending.','DataStorageFormat default delegates to stable_file_version, now resolved as exact V2_2 (rust/lance-file/src/version.rs:19-22).');write('L1-modules/rust-lance-table.md',t);
append('L1-modules/rust-lance-table.md',`## Overlay-induced index staleness

[Staleness L2](../L2-files/rust/lance-table/src/format/overlay/staleness.rs.md) calculates exclusion sets using metadata only. Newer means overlay.committed_version > segment.dataset_version, not > index_version algorithm revision. Fields are segment.fields including covering dependencies. For each changed field it matches exact ID, indexed ancestor or indexed descendant using Schema ancestry; siblings alone do not match. Union only that field position's coverage. No deleted-row removal or actual flat-path query occurs here. (rust/lance-table/src/format/overlay/staleness.rs:24-85; rust/lance-table/src/format/overlay/staleness.rs:113-157; rust/lance-core/src/datatypes/schema.rs:633-648)

overlaid_fragments scans all fragments into borrowed HashMap keyed by truncating id as u32; duplicates overwrite. Missing segment.fragment_bitmap is conservatively all-covered, while Some excludes absent IDs. Fragment collector skips already-stale IDs and adds only nonempty exclusions; row collector unions nonempty offset bitmaps into existing map entries. Errors can leave earlier fragments mutated, with no rollback; map keys are trusted independently of Fragment.id. Both collectors return Result, not a complete query plan. (rust/lance-table/src/format/overlay/staleness.rs:88-158)

The version-only early return avoids schema work when all overlays are old/equal. Otherwise field-ancestry traversal may repeat and allocate inside nested loops; O(overlaid fragments) in comments is only the outer traversal bound. No sorted-order requirement, global latest-write elimination or value equality comparison changes the union. (rust/lance-table/src/format/overlay/staleness.rs:42-85; rust/lance-table/src/format/overlay/staleness.rs:96-158; rust/lance-core/src/datatypes/schema.rs:634-647)

Exact version delegation is now resolved in [lance-file](rust-lance-file.md): DataFile metadata writes V2_0 as(2,0), while standard file footer writes(0,3); both decode as V2_0. Manifest strict version string is2.0 and stable fallback/default is2.2. Capability support remains separate from identity recognition. (rust/lance-file/src/version.rs:19-27; rust/lance-file/src/version.rs:172-261; rust/lance-table/src/format/manifest.rs:708-722)
`);const tableApis=api('L1-modules/rust-lance-table.md',s=>s.path.endsWith('/overlay/staleness.rs'),'Exact reviewed staleness callable declarations');
append('L0-orientation.md',`## File-version request, identity and footer

Caller Stable/Next selectors resolve to exact2.2/2.3 in this snapshot. Persisted identities have no ordering; use explicit capabilities instead of comparing release numbers. V2.0 standard footer is(0,3), embedded footer and DataFile metadata are(2,0), while manifest string is2.0. These spellings describe the same exact identity. Footer-only detection reads8 bytes and does not certify a valid complete file. (rust/lance-file/src/version.rs:19-27; rust/lance-file/src/version.rs:128-262; rust/lance-file/src/lib.rs:25-60)

Overlay staleness is a metadata-derived conservative exclusion set: union newer changes to indexed dependency fields or their ancestors/descendants, then consumers must re-evaluate affected rows. This differs from resolving the newest value and from deleting rows; the helper only returns/accumulates physical offset sets. (rust/lance-table/src/format/overlay/staleness.rs:4-13; rust/lance-table/src/format/overlay/staleness.rs:35-158)
`);
append('L3-symbols/format-spec.md',`## Exact file-version codecs

| Exact | Canonical manifest | DataFile pair | Standard footer | Embedded footer | Unstable predicate |
|---|---|---|---|---|---|
|V1|0.1|(0,2)|(0,2)|(0,2)|false|
|V2_0|2.0|(2,0)|(0,3)|(2,0)|false|
|V2_1|2.1|(2,1)|(2,1)|(2,1)|false|
|V2_2|2.2|(2,2)|(2,2)|(2,2)|false|
|V2_3|2.3|(2,3)|(2,3)|(2,3)|true|

Both numeric readers also accept historical(0,0)/(0,1) as V1 and both listed V2_0 pairs; metadata takes u32, footer takes u16. Strict manifest decoder accepts only canonical strings. Public selector parser is separate: lowercase without trim, with legacy/0.3/stable/next aliases. stable/next are2.2/2.3 code policy and default selector is exactV2_2. (rust/lance-file/src/version.rs:13-50; rust/lance-file/src/version.rs:92-107; rust/lance-file/src/version.rs:167-262)

Footer recognition expects final8 bytes = major LEu16, minor LEu16, LANC. Legacy format module constants are0.2, whereas table manifest constants are0.1; accepted identity alone cannot distinguish a valid data file from another byte stream with a matching suffix. Full v2 footer offsets/pages/encoding semantics and release fixtures remain pending. (rust/lance-file/src/lib.rs:36-60; rust/lance-file/src/format.rs:30-33; rust/lance-table/src/format.rs:51-55)
`);
append('L3-symbols/behavior-contracts.md',`## File-version and staleness boundaries

Changing stable policy changes selector resolution and table default/no-file fallback, but default LanceFileVersion is separately fixed by its #[default] attribute. Serde of a selector preserves stable/next; ConcreteFileVersion cannot represent either and strict manifest decoding rejects aliases. Numeric decoders normalize historical V1 and V2_0 pairs. There is no release-order comparison capability. (rust/lance-file/src/version.rs:19-75; rust/lance-file/src/version.rs:109-262; rust/lance-table/src/format/manifest.rs:708-722; rust/lance-table/src/format/manifest.rs:1006-1021)

determine_file_version trusts known_size, otherwise checked-converts store size; size<8/magic mismatch are InvalidInput. It awaits a tail read and does not validate the full file. Unknown pair errors identify only numbers, not path. Fewer than4 returned bytes would panic at slicing; correctness assumes the reader fulfills its range contract. (rust/lance-file/src/lib.rs:25-60; rust/lance-file/src/version.rs:230-239; rust/lance-file/src/version.rs:270-272)

Overlay staleness is monotonic union into caller state, with partial mutation possible before error. Unknown coverage means all candidates; full dependency fields include carried values. Exact field-ID equality bypasses schema existence, and no explicit tombstone exclusion exists. The map builder truncates u64 IDs to u32 and later collectors trust map keys. Validated upstream metadata is needed to exclude those malformed cases; caller validation has not yet been traced. (rust/lance-table/src/format/overlay/staleness.rs:46-158)
`);
append('L4-crosscutting/scenarios.md',`## Exact version and stale-index metadata traces

Given request stable, resolve yields ConcreteFileVersion::V2_2. DataFile::new emits metadata(2,2); DataStorageFormat encoding emits manifest2.2. For exactV2_0, metadata emits(2,0), but to_standard_footer_numbers returns(0,3); determine_file_version parses tail LEu16 fields then accepts either(0,3) or(2,0). Actual complete writer dispatch remains pending, so these are connected metadata/recognition calls only. (rust/lance-file/src/version.rs:19-75; rust/lance-file/src/version.rs:187-261; rust/lance-file/src/lib.rs:45-59; rust/lance-table/src/format/fragment.rs:109-144; rust/lance-table/src/format/manifest.rs:1091-1124)

For fragment3 with overlay dataset-version9 on field3 offsets[1,2], an index segment built at1 and unknown fragment coverage yields stale fragment{3} or row map3->{1,2}. Present coverage{0} yields nothing; equal/older overlay versions contribute nothing. For outer.middle.{a,b}, an overlay on a invalidates an outer-field index but not b; overlay on middle invalidates a. Existing stale entries are unioned, and query fallback must consume these sets elsewhere. (rust/lance-table/src/format/overlay/staleness.rs:216-277; rust/lance-table/src/format/overlay/staleness.rs:341-415; rust/lance-table/src/format/overlay/staleness.rs:113-158)

All five complete acceptance questions still fail: this closes local version-mapping and stale-set rules, not full v2 bytes, Dataset write/compaction, index registration, Python API or transaction commit protocols.
`);
append('L4-crosscutting/cookbook.md',`## File-version and overlay-staleness extension seams

When extending an exact format, account for request enum/default/resolution, strict manifest codec, both numeric readers and three numeric writers in version.rs. Keep historical stable aliases and avoid treating ordering as capabilities. Update the mapping matrices and recognizer fixtures, then trace actual reader/writer dispatch and released fixtures before claiming compatibility. This local recipe remains incomplete until those consumers are analyzed. (rust/lance-file/src/version.rs:13-272; rust/lance-file/src/version.rs:291-430)

For index freshness, use segment.dataset_version and full segment.fields, preserve unknown-coverage conservatism and bidirectional ancestry. Keep fragment-level and row-level accumulation semantics distinct; failures are not atomic. Existing tests cover field/version/sparse/ancestry/unknown coverage, but multi-fragment partial failures and retained output unions lack direct local fixtures. End-to-end prefilter/flat-path integration still needs inspection. (rust/lance-table/src/format/overlay/staleness.rs:35-158; rust/lance-table/src/format/overlay/staleness.rs:216-415)
`);
append('L4-crosscutting/build-and-test.md',`## lance-file build and reviewed tests

protoc optionally selects vendored protobuf-src; build.rs sets PROTOC, enables proto3 optional, maps encoding types externally and compiles four shared schemas. Generated modules are included from OUT_DIR. docs.rs enables protoc; reader/schema benches disable harness. Full crate dependencies are listed in the [module guide](../L1-modules/rust-lance-file.md). No build/compiler invocation was performed. (rust/lance-file/Cargo.toml:14-72; rust/lance-file/build.rs:1-29; rust/lance-file/src/format.rs:4-28)

Version tests pin selector/default/alias, canonical manifest rejection, numeric metadata/footer mapping and8-byte synthetic legacy recognition. Staleness tests pin version thresholds, unrelated/nested fields, sparse per-field offsets, unions and missing/present coverage. These source fixtures do not establish real file compatibility, actual query fallback or exhaustive error behavior. Tests were read only. (rust/lance-file/src/version.rs:274-430; rust/lance-table/src/format/overlay/staleness.rs:160-415)
`);
append('L4-crosscutting/pitfalls.md',`## Exact identity and stale-set traps

Do not serialize a caller selector directly as a manifest format string: stable/next are valid selector serde but rejected persisted identities. V2_0 metadata(2,0) and standard footer(0,3) intentionally differ; identity decoding is not a complete file-integrity check. (rust/lance-file/src/version.rs:109-127; rust/lance-file/src/version.rs:172-261; rust/lance-file/src/lib.rs:25-60)

IndexMetadata.index_version is not the build snapshot used by staleness; use dataset_version. Ancestor changes can invalidate child-field indices and child changes can invalidate ancestor-field indices. None coverage must remain conservative. The helper returns physical offsets including deleted rows and performs no query/value comparison; dropping those distinctions can leave stale index values visible. (rust/lance-table/src/format/overlay/staleness.rs:24-94; rust/lance-table/src/format/overlay/staleness.rs:113-158)
`);
let r=read('README.md').replace('[lance-table](L1-modules/rust-lance-table.md), and','[lance-table](L1-modules/rust-lance-table.md), [lance-file](L1-modules/rust-lance-file.md), and');write('README.md',r);
// Refresh previous file-local status notes now that delegated implementations are covered.
const manifest=JSON.parse(read('MANIFEST.json')),batch=JSON.parse(read('analysis/iteration-027-file-version-staleness.json')),changes=[
['rust/lance-table/src/format/fragment.rs','That external mapping remains pending.','Exact mapping is now covered at rust/lance-file/src/version.rs:198-224.'],
['rust/lance-table/src/format/manifest.rs','Selector acceptance/exact supported-version mapping is delegated, not defined here.','Exact mappings are now covered at rust/lance-file/src/version.rs:19-27 and rust/lance-file/src/version.rs:172-261; selector acceptance remains distinct from persisted strings.'],
['rust/lance-table/src/format/overlay.rs','Exports child staleness module (implementation pending)','Exports child staleness module (now analyzed at rust/lance-table/src/format/overlay/staleness.rs:1-415)']
];for(const[p,from,to]of changes){const entry=manifest.files.find(e=>e.path===p),f=JSON.parse(read(entry.analysis_record)).files.find(f=>f.path===p);f.ranges=f.ranges.map(([b,e,n])=>[b,e,n.replace(from,to)]);batch.files.push(f);for(const s of records.filter(s=>s.path===p)){const range=f.ranges.find(([b,e])=>b<=s.line&&s.line<=e);s.behavior=range[2];}}write('analysis/iteration-027-file-version-staleness.json',JSON.stringify(batch,null,2));write('analysis/rust-symbols.json',JSON.stringify(records,null,2));console.log({fileApis,tableApis,refreshed:changes.length});
