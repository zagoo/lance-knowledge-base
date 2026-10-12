import fs from'node:fs';import{root,linesOf}from'./inventory.mjs';
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p)),append=(p,s)=>fs.appendFileSync(p,'\n\n'+s+'\n');
const symbols=json('analysis/iteration-048-symbols.json'),src=linesOf(read(root+'/rust/lance-table/src/io/commit.rs'));
const api=symbols.filter(s=>s.visibility.startsWith('public')).sort((a,b)=>a.line-b.line).map(s=>`| \`${s.name.replace('lance_table::io::commit::','')}\` | ${s.kind} | \`${src.slice(s.line-1,s.end_line).join(' ').trim().replaceAll('|','\\|')}\` | [${s.path}:${s.line}-${s.end_line}](../L2-files/${s.path}.md) |`).join('\n');
fs.writeFileSync('L1-modules/rust-lance-table-commit.md',`# Table commit publication and manifest resolution

Complete local scope: all 2,490 lines of io/commit.rs. External-manifest and DynamoDB children, underlying object stores and complete Dataset conflict/retry/cleanup are pending. [Table](rust-lance-table.md) · [Metadata IO](rust-lance-table-io.md) · [L2 source and ranges](../L2-files/rust/lance-table/src/io/commit.rs.md) · [Contracts](../L3-symbols/behavior-contracts.md) · [Scenarios](../L4-crosscutting/scenarios.md).

CommitHandler controls manifest locations and a single publication attempt. It does not build row/index candidates, resolve operation-pair conflicts, allocate retries or establish every backend's atomicity. All participating writers must use the same effective handler. CommitConfig only declares num_retries=20 and skip_auto_cleanup=false here. (rust/lance-table/src/io/commit.rs:868-1055; rust/lance-table/src/io/commit.rs:1733-1747)

## Public declarations

Exact declarations, fields, variants, trait hooks and implementations follow. Trait defaults are specified below; complete method bodies and tests are in L2. Public dynamodb module is feature-gated, external_manifest is unconditional. (rust/lance-table/src/io/commit.rs:48-68)

| Symbol relative to lance_table::io::commit | Kind | Exact declaration | Evidence |
|---|---|---|---|
${api}

## Naming and identity

Both naming schemes use base/_versions. Attached V1 is decimal version.manifest; V2 is (u64::MAX-version) padded to 20 digits. Detached versions use d plus the full masked number under either scheme. V2's _manifests documentation is stale. These are manifest naming schemes, not Lance data-file format versions. (rust/lance-table/src/io/commit.rs:70-112)

Parsing and detection are deliberately different: numeric parsers stop at the first dot and ignore the suffix; detached parsing does not check or set the mask. Scheme detection treats every leading d as V2, otherwise checks an ending manifest and filename length. Staging detection checks character 20 for a dot. Public detached listings can therefore accept a d-number with an unexpected extension or unmasked number. (rust/lance-table/src/io/commit.rs:114-164; rust/lance-table/src/io/commit.rs:739-770; rust/lance-table/src/io/commit.rs:2090-2116)

ManifestLocation keeps opaque physical e_tag separate from external-store identity. ETags may change for equal content, and None proves no incarnation equivalence. Local handlers here return identity=None. PredecessorIdentity stores a version and record token; uniqueness is a handler contract. Default exact resolution probes only V2, then returns an unverified V1 path on NotFound; detached paths return without HEAD. A location is not an existence certificate. (rust/lance-table/src/io/commit.rs:232-287; rust/lance-table/src/io/commit.rs:1057-1102; rust/lance-table/src/io/commit.rs:1724-1731)

## Latest and history lookup

Direct local paths first run a synchronous directory scan, selecting the largest parsed version and fetching only its metadata. Errors or no result fall through to listing, bypassing the hint branch. The local scan checks scheme consistency before numeric parsing, while ordinary listing filters invalid/detached entries first. It reconstructs the selected path and does not check entry file type. (rust/lance-table/src/io/commit.rs:298-313; rust/lance-table/src/io/commit.rs:659-721)

Other nonlexical stores may use a JSON hint. LANCE_USE_VERSION_HINT is parsed once: trimmed ASCII-insensitive 0/false/off disable; anything else or an environment error enables. Writers skip detached versions and lexical stores. Hint writes are unconditional, best effort and nonmonotonic; failures warn without failing commits. Reads suppress GET/body/JSON errors into None. (rust/lance-table/src/io/commit.rs:315-385)

Upward probing HEADs V2 at the start, tries V1 only on NotFound, then probes consecutive versions in that fixed scheme until first missing. It assumes no gaps and retains all successful metadata. There is no upward-distance cap, checked increment or attached-mask guard. A transient error triggers listing fallback. The 1,000 threshold only limits hint-minus-since before history probing; missing intervening versions during parallel gap fill also trigger fallback. Returned newer locations are sorted descending. (rust/lance-table/src/io/commit.rs:387-571)

Lexical latest lookup stops at the first valid V2 entry and intentionally does not validate later schemes. Otherwise it scans all valid entries, rejecting mixed schemes and choosing maximum version. Sorted history listing passes through lexical V2, but collects/sorts V1 or nonlexical streams. Unsorted listing drops invalid metadata conversions while preserving storage errors. These differing validation boundaries must not be generalized into one universal listing rule. (rust/lance-table/src/io/commit.rs:573-737; rust/lance-table/src/io/commit.rs:781-866)

## Backend routing and publication

| Input/handler | Publication behavior | Failure and identity |
|---|---|---|
| Local path, file, file-object-store | Windows Rename; otherwise ConditionalPut | Routing is platform-based, not capability probing |
| s3, gs, az, abfss, memory, oss, tos, shared-memory, goosefs | ConditionalPut | Contradicts old module comment claiming S3 Unsafe |
| cos | Read-capable Tencent handler; default writes rejected | NotSupported requests distributed lock/custom handler |
| s3+ddb | Feature-gated external handler | Exact single borrowed ddbTableName query required |
| Other parsed scheme | Unsafe | Writes final path without conflict protection |

Routing evidence: rust/lance-table/src/io/commit.rs:1171-1263. COS rationale and implementation: rust/lance-table/src/io/commit.rs:1685-1722.

ConditionalPut serializes through a fresh memory store at dummy, reads all bytes, then publishes with PutMode::Create. AlreadyExists and Precondition become CommitConflict. Returned size is payload length, ETag comes from final put. No predecessor/incarnation condition is attached. Memory includes a full serialized manifest before remote publication. (rust/lance-table/src/io/commit.rs:1612-1683)

Rename writes a UUID staging path, then rename_if_not_exists. Only AlreadyExists triggers best-effort staging deletion; writer failure, other rename errors and cancellation have no cleanup guard. Success discards ETag because rename may change it. Unsafe writes final directly and has a relaxed load/store warning guard that can log multiple times on concurrent first calls. Both update the hint only after successful publication. (rust/lance-table/src/io/commit.rs:1298-1357; rust/lance-table/src/io/commit.rs:1541-1610)

Canonical ManifestWriter constructs ObjectWriter, writes dictionaries/sections/body through metadata IO, writes the lance-file footer, awaits shutdown, then audits creation. It returns WriteResult. An injected writer is trusted; it can fail after mutating offsets or even mutate version after the handler computed its path. The callback alone does not establish an atomic claim. (rust/lance-table/src/io/commit.rs:199-230; rust/lance-table/src/io/manifest.rs:177-230)

## Lease lifecycle and outcome policy

CommitLock supplies a lease per version. Blanket handling acquires it, HEADs the final path, writes under the lease, then releases before hint publication. Existing-path and HEAD-error branches release(false); writer completion releases(res.is_ok()). Release error takes precedence over conflict, HEAD or writer error. The adapter has no renewal/fencing implementation. (rust/lance-table/src/io/commit.rs:1359-1387; rust/lance-table/src/io/commit.rs:1440-1502)

LeaseGuard retains ownership across the explicit release await. Cancellation there or during writing triggers a Tokio background release(false). Completed release errors clear ownership and get no retry. Drop ignores background errors; without a runtime there is no spawned release. TTL recovery is a recommended external property, not enforced. Cancellation before lock acquisition returns cannot use this guard. (rust/lance-table/src/io/commit.rs:1389-1438; rust/lance-table/src/io/commit.rs:1464-1487)

Default CommitHandler is conservative: definitive NotFound=false, propagate error after successful readback=true, predecessor support=false, identity queries=None, conditional publication=NotSupported, retirement/delete=no-op. Unsafe/Rename/Conditional override the first two to true/false; the lock adapter overrides only definitive NotFound, retaining propagation. Tencent overrides definitive only. Dataset callers must apply these hooks; this file does not perform outcome verification. (rust/lance-table/src/io/commit.rs:879-1055; rust/lance-table/src/io/commit.rs:1308-1315; rust/lance-table/src/io/commit.rs:1440-1458; rust/lance-table/src/io/commit.rs:1547-1554; rust/lance-table/src/io/commit.rs:1615-1622; rust/lance-table/src/io/commit.rs:1694-1715)

## Configuration and boundaries

DynamoDB feature imports AWS adapters and exposes its child. Endpoint raw option dynamodb_endpoint wins over DYNAMODB_ENDPOINT; credentials are supplied through the object-store provider with artificial ten-minute SDK expiry. SDK identity cache is disabled and retry max attempts is five. s3+ddb query parsing accepts borrowed key/value strings only; decoded owned strings fail the pattern. Child initialization is awaited with app name lancedb. These are construction semantics, not qualification of DynamoDB authority/transactions. (rust/lance-table/src/io/commit.rs:1103-1272)

Migration lists V1-classified names and concurrently renames to V2 using unconditional rename. Docs require quiescence and completion; malformed numeric names can panic at unwrap, and errors leave partial progress. It does not update an external index or hint. Keep stable naming compatibility separate from unstable data-format design. (rust/lance-table/src/io/commit.rs:166-197; AGENTS.md:7-18)

## Test evidence and limits

Local fixtures cover naming/parsing, one migration, sorted/current lookup matrices, hint writes/probes/fallback, detached listing, nine URL routes, COS rejection, two lease cancellation stages and lexical early termination with/without staging junk. Cancellation tests use fake writers and tracking leases; they do not prove durable commit. The early-stop test counts metadata entries, not billed cloud requests. No source tests were executed; full external-store and dataset concurrency evidence is pending. (rust/lance-table/src/io/commit.rs:1749-2490)
`);
append('L0-orientation.md',`## Manifest publication vocabulary

- ManifestNamingScheme: decimal V1 or inverted/padded V2 naming under _versions; independent of data-file encoding version. Detached names carry a d prefix. (rust/lance-table/src/io/commit.rs:70-164)
- VersionHint: best-effort JSON version used by nonlexical listings; verified through HEAD probes under contiguous-history assumptions. (rust/lance-table/src/io/commit.rs:315-571)
- ManifestLocation: version/path/optional size, physical ETag and distinct optional external record identity. A returned fallback path can be unverified. (rust/lance-table/src/io/commit.rs:232-287; rust/lance-table/src/io/commit.rs:1057-1102)
- CommitLock / CommitLease / LeaseGuard: external lock seam, async release contract and cancellation guard; the guard does not implement fencing or TTL. (rust/lance-table/src/io/commit.rs:1359-1502)
- PredecessorIdentity: version plus external incarnation token used by optional reservation-conditioned publication; defaults do not support it. (rust/lance-table/src/io/commit.rs:994-1049; rust/lance-table/src/io/commit.rs:1724-1731)

See [commit supplement](L1-modules/rust-lance-table-commit.md) for complete local APIs and failure ordering. Whole-dataset retry/conflict and external authority remain pending.`);
append('L3-symbols/behavior-contracts.md',`## Commit visibility, failure and cancellation contracts

CommitHandler separates finding a candidate path, probing existence, publishing a version and interpreting an uncertain outcome. Default exact resolution can return a nonexistent V1/detached path; version_exists performs a separate HEAD. Defaults preserve custom errors after successful readback and treat NotFound conservatively. Those hooks do not implement verification themselves. (rust/lance-table/src/io/commit.rs:879-935; rust/lance-table/src/io/commit.rs:1057-1102)

ConditionalPut publishes serialized bytes with Create and maps AlreadyExists/Precondition to conflict. Rename maps only AlreadyExists and only that branch tries staging cleanup. Unsafe has no conflict check. Changing these mappings affects dataset retry/cleanup decisions; converting CommitConflict into core Error instead loses its discriminant as Internal. (rust/lance-table/src/io/commit.rs:1274-1296; rust/lance-table/src/io/commit.rs:1317-1350; rust/lance-table/src/io/commit.rs:1556-1603; rust/lance-table/src/io/commit.rs:1624-1676)

Lease release occurs before returning the original writer result, so release errors can dominate successful publication or failed writing. Retaining the lease across release await is necessary for cancellation recovery; clearing it earlier leaks that fallback. Background release(false) is best effort and must be tolerated after a partly completed explicit release. (rust/lance-table/src/io/commit.rs:1379-1438; rust/lance-table/src/io/commit.rs:1459-1491)

Hint correctness depends on contiguous attached history, not hint freshness alone. The hint can move backward, and upward probing stops on the first missing version. The 1,000 threshold does not cap all probes. Naming heuristics and scheme-specific fast paths do not uniformly reject malformed/mixed history. (rust/lance-table/src/io/commit.rs:355-571; rust/lance-table/src/io/commit.rs:573-721; rust/lance-table/src/io/commit.rs:781-866)`);
append('L3-symbols/format-spec.md',`## Manifest directory names and hint payload

The directory is _versions for V1 and V2. Attached names encode decimal version or zero-padded 20-digit u64MAX-version; detached names are d plus the full number and .manifest. Staging appends hyphen UUIDv4 to the final path. A migration changes names through unconditional rename under a documented quiescence requirement; it does not rewrite manifest bytes. (rust/lance-table/src/io/commit.rs:70-197; rust/lance-table/src/io/commit.rs:772-775)

latest_version_hint.json contains a serde object with u64 version. It is a nonauthoritative accelerator, not a commit record, schema version or monotonic CAS. Its generation token is not retained. ManifestLocation ETag is also separate from external record identity. (rust/lance-table/src/io/commit.rs:232-264; rust/lance-table/src/io/commit.rs:315-385)

Detached parser documentation overstates mask validation: it accepts d12345.manifest unchanged, as its test explicitly requires. Suffix validation is separate and detached listing does not add it. Do not infer persisted record validity from filename detection alone. (rust/lance-table/src/io/commit.rs:114-164; rust/lance-table/src/io/commit.rs:739-770; rust/lance-table/src/io/commit.rs:2090-2116)`);
append('L4-crosscutting/scenarios.md',`## Single-attempt conditional and locked commit traces

1. A caller supplies a candidate Manifest, optional indices/inline transaction and writer callback. The handler computes a final manifest path before callback execution. (rust/lance-table/src/io/commit.rs:983-992; rust/lance-table/src/io/commit.rs:1634-1644)
2. ConditionalPut creates a fresh memory store, serializes through the callback at dummy, reads all bytes and calculates size. Manifest offset mutations may already have happened. (rust/lance-table/src/io/commit.rs:1634-1647; rust/lance-table/src/io/manifest.rs:177-209)
3. It issues Create at the real path. Two conflict errors return CommitConflict; other errors remain ambiguous to the caller. Success writes the best-effort hint and returns put ETag with no external identity. (rust/lance-table/src/io/commit.rs:1648-1676)
4. The lock alternative acquires a lease, HEADs under it, writes directly if missing, releases with writer success, then writes the hint. Any release failure can replace the preceding result. Cancellation with a held lease spawns release(false) if a runtime is available. (rust/lance-table/src/io/commit.rs:1389-1502)
5. A later reader resolves through local directory scan, verified hint or listing, then reads metadata bytes. Exact-version fallback locations themselves do not prove existence. (rust/lance-table/src/io/commit.rs:298-313; rust/lance-table/src/io/commit.rs:1057-1102; rust/lance-table/src/io/manifest.rs:32-128)

This establishes local publication and resolver mechanics. Dataset conflict rebasing, retries, uncertain-outcome interpretation, cleanup and predecessor-capable external authority still prevent a complete transaction acceptance answer.`);
append('L4-crosscutting/cookbook.md',`## Add or change a commit handler

Implement CommitHandler::commit with precise conflict mapping and a real atomic claim; override location/list/existence methods if the authority differs from object-store paths. Decide definitive-not-found and post-readback error policy explicitly. For predecessor-conditioned operations implement support, both identity lookups, commit_after and conditional retirement together; default methods cannot provide this guarantee. Extend routing only after backend capability evidence. (rust/lance-table/src/io/commit.rs:868-1055; rust/lance-table/src/io/commit.rs:1171-1263)

CommitLock is a smaller seam, but its lease must handle repeated release, cancellation during acquisition/release, TTL/fencing and mixed-writer coordination. Add release-error precedence, no-runtime/background-error, conflicting publication and uncertain-put cases to the existing test module; current fake writers cover only two cancellation stages. Preserve frozen V1 naming/read paths and use released fixtures for compatibility work. Complete integration still requires the pending dataset retry/cleanup and external handler analysis. (rust/lance-table/src/io/commit.rs:1359-1502; rust/lance-table/src/io/commit.rs:2187-2427; AGENTS.md:13-18)`);
append('L4-crosscutting/pitfalls.md',`## Commit and listing pitfalls

- Module-level default-handler comments are stale: S3 routes to ConditionalPut, and local Windows differs from other platforms. COS rejects default writes. (rust/lance-table/src/io/commit.rs:12-19; rust/lance-table/src/io/commit.rs:1171-1263; rust/lance-table/src/io/commit.rs:1685-1715)
- Returned ManifestLocation may be only a guessed fallback path; ETag and external identity have different meanings. (rust/lance-table/src/io/commit.rs:232-264; rust/lance-table/src/io/commit.rs:1057-1102)
- ConditionalPut buffers the full manifest. Rename cleanup is narrower than its comment, and lease release failure can follow a landed write. (rust/lance-table/src/io/commit.rs:1484-1489; rust/lance-table/src/io/commit.rs:1566-1601; rust/lance-table/src/io/commit.rs:1636-1664)
- Hints are nonmonotonic, assume gap-free upward history and use a process-cached environment setting. A lexical V2 fast path skips later scheme validation. (rust/lance-table/src/io/commit.rs:321-571; rust/lance-table/src/io/commit.rs:594-618)`);
append('L4-crosscutting/build-and-test.md',`## Commit source test coverage

The commit module tests naming, migration, sorted/current lookup, hint cases, detached listing, routing and COS rejection with current memory/local fixtures. Lease cancellation tests use a writer that hangs or returns a default result without IO and release trackers; 50 ms timeouts trigger cancellation, followed by up to 100 sleeps of 10 ms. The early-stop fixture counts list metadata callbacks and expects one clean entry or two with staging junk. These are source assertions, not executed or timed results. Full remote atomicity, external identity, corruption, mixed-scheme, release-error and runtime-shutdown qualification remains absent here. (rust/lance-table/src/io/commit.rs:1749-2490)`);
const changes=[];function replace(p,a,b){let s=read(p);if(!s.includes(a))throw Error('Missing '+a);fs.writeFileSync(p,s.replace(a,b));changes.push({path:p,before:a,after:b});}
replace('L1-modules/rust-lance-table.md','Forty-five of 54 inventory entries are analyzed, covering 30,440 physical lines','Forty-six of 54 inventory entries are analyzed, covering 32,930 physical lines');
replace('L1-modules/rust-lance-table.md','complete dataset transaction orchestration, row-ID index contents and IO remain pending.','complete dataset transaction orchestration, row-ID index contents, external commit backends and stream IO remain pending.');
replace('L1-modules/rust-lance-table-io.md','Commit arbitration and backends remain pending.','Parent commit publication/resolution is now covered in the [commit supplement](rust-lance-table-commit.md); external backends and full dataset retry/conflict remain pending.');
replace('L1-modules/rust-lance-table-io.md','Commit handler selection/arbitration lies outside this excerpt.','Commit handler selection and local publication are now covered in the [commit supplement](rust-lance-table-commit.md).');
replace('L1-modules/rust-lance-table-io.md','These public io submodules read/write metadata objects and return errors.','The manifest and deletion submodules read/write metadata objects and return errors.');
append('L1-modules/rust-lance-table.md',`## Commit publication and resolution

The [complete commit supplement](rust-lance-table-commit.md) now documents naming, hints, all trait defaults, URL routing, local publication handlers, leases/cancellation, configuration and tests. External authority and full dataset conflict/retry/cleanup remain pending. (rust/lance-table/src/io/commit.rs:1-2490)`);
fs.writeFileSync('analysis/iteration-048-status-refresh.json',JSON.stringify(changes,null,2)+'\n');console.log({api_rows:api.split('\n').length,status_refreshes:changes.length});
