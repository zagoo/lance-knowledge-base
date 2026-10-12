import fs from 'node:fs';
import {root, linesOf} from './inventory.mjs';
const read = p => fs.readFileSync(p, 'utf8');
const json = p => JSON.parse(read(p));
const append = (p,s) => fs.appendFileSync(p, '\n\n' + s + '\n');
const symbols = json('analysis/iteration-049-symbols.json');
const file = 'rust/lance-table/src/io/commit/external_manifest.rs';
const source = linesOf(read(root + '/' + file));
const api = symbols.filter(s => s.visibility.startsWith('public')).sort((a,b) => a.line-b.line).map(s => `| \`${s.name.replace('lance_table::io::commit::external_manifest::','')}\` | ${s.kind} | \`${source.slice(s.line-1,s.end_line).join(' ').trim().replaceAll('|','\\|')}\` | [${file}:${s.line}-${s.end_line}](../L2-files/${file}.md) |`).join('\n');
fs.writeFileSync('L1-modules/rust-lance-table-external-commit.md', `# External manifest authority and publication

Complete local scope: all 2,553 lines of external_manifest.rs. Concrete DynamoDB and namespace stores, underlying multipart implementations and the full Dataset conflict/retry/cleanup loop remain pending. [Table](rust-lance-table.md) · [Parent commit layer](rust-lance-table-commit.md) · [Exact source and range analysis](../L2-files/${file}.md) · [Contracts](../L3-symbols/behavior-contracts.md) · [Scenarios](../L4-crosscutting/scenarios.md).

The public ExternalManifestStore trait supplies atomic external record operations and lookup hooks. ExternalManifestCommitHandler adapts those hooks to the parent CommitHandler and coordinates object writes, lookup, repair and history. It does not validate row/index candidates, allocate transaction retries, prove backend atomicity or decode manifest bytes during location resolution. (rust/lance-table/src/io/commit/external_manifest.rs:162-368; rust/lance-table/src/io/commit/external_manifest.rs:559-1121)

## Public declarations

Signatures below are literal source declarations. Trait methods without an implementation are required; default behavior and additional contracts follow. No local feature flag or environment variable is declared in this module; the parent external_manifest module is unconditional, while DynamoDB is separately gated. (rust/lance-table/src/io/commit.rs:48-68; rust/lance-table/src/io/commit/external_manifest.rs:162-368)

| Symbol relative to lance_table::io::commit::external_manifest | Kind | Exact declaration | Evidence |
|---|---|---|---|
${api}

## Two publication protocols

| Property | Generic put/finalize | Predecessor-conditioned commit_after |
|---|---|---|
| Initial object | Unique staging path, fully written first | Unique staging-shaped path, fully written first |
| Atomic store operation | put_if_not_exists selects one path | put_if_predecessor checks a record token and reserves target atomically |
| Final object | Selected bytes copied to deterministic canonical path | The selected unique path itself |
| Publication authority | Canonical object is durable before optional index repair | Successful reservation publishes the already written unique object |
| Later index work | Replace staging path with canonical path; clear ETag | No canonicalization or finalize hook |
| Successful cleanup | Delete staging after successful index update | Keep unique final object |
| Record identity | Generic finalizer returns None | Return minted identity |
| Discovery | Canonical names are physically discoverable | External list_versions is required |

Protocol evidence: rust/lance-table/src/io/commit/external_manifest.rs:35-102; rust/lance-table/src/io/commit/external_manifest.rs:216-284; rust/lance-table/src/io/commit/external_manifest.rs:963-1121. Parent name filtering: rust/lance-table/src/io/commit.rs:138-164; rust/lance-table/src/io/commit.rs:723-737.

The generic contract assumes one dataset incarnation owns the prefix. Concurrent helpers may copy only the same selected immutable bytes, so an ETag is a transient physical generation rather than logical identity. put/finalizers/onboarding pass ETag None to external records; generic readers ignore legacy indexed ETags and HEAD the current object. A missing staging copy can be recovered only by HEADing canonical storage and matching selected size; same size is not a general content proof. (rust/lance-table/src/io/commit/external_manifest.rs:117-161; rust/lance-table/src/io/commit/external_manifest.rs:434-485; rust/lance-table/src/io/commit/external_manifest.rs:568-622; rust/lance-table/src/io/commit/external_manifest.rs:804-867)

Finalizers return canonical success even if subsequent index update or staging deletion fails. Failed index publication keeps staging for repair. COPY followed by a failing HEAD is different: the helper propagates the error even if bytes landed. Public finalize_staged and the handler's private finalize_manifest implement similar generic logic, but reader helping calls the private implementation rather than an overridable store finalize hook. (rust/lance-table/src/io/commit/external_manifest.rs:35-102; rust/lance-table/src/io/commit/external_manifest.rs:434-485; rust/lance-table/src/io/commit/external_manifest.rs:623-705)

## Read and history behavior

| Read path | Exact behavior and limits |
|---|---|
| version_exists | Any indexed location is true without object validation; only external NotFound falls back to canonical HEAD |
| Identity-bearing location | recorded_as_final returns known-size location without IO; unknown size triggers HEAD only to fill size, preserving ETag |
| Generic canonical location | HEAD validates known size, supplies unknown size, refreshes ETag; NotFound uses parent exact resolver without repairing the row |
| Generic staging location | Reader copies selected bytes, publishes canonical record and cleans staging best effort |
| Latest with no external row | Ok(None) falls back to current_manifest_path; external errors propagate |
| Latest unknown-size missing staging | Refetches and directly returns external location, without another verification |
| Exact version absent externally | Resolve/HEAD physical path and best-effort backfill; return actual ETag but identity None |
| Exact indexed unknown-size missing staging | HEAD error propagates; no latest-style refetch |
| External list Some(Vec) | Authoritative, no physical merge/HEAD/deduplication/identity validation; Some(empty) means empty history |
| External list None | Parent object-listing fallback; since listing may use hints |

Resolver evidence: rust/lance-table/src/io/commit/external_manifest.rs:568-622; rust/lance-table/src/io/commit/external_manifest.rs:707-893; rust/lance-table/src/io/commit/external_manifest.rs:1151-1162. Listing evidence: rust/lance-table/src/io/commit/external_manifest.rs:907-962. Parent exact fallback can return an unchecked V1/detached location: rust/lance-table/src/io/commit.rs:1057-1102.

Latest staging lookup uses the recorded naming scheme; exact-version staging lookup recomputes the filename heuristic. detect_naming_scheme_from_path classifies every present filename through normal detection or an unconditional staging fallback. Neither classification nor a returned location proves valid manifest bytes. External latest and list methods must define their own version filtering; the handler does not remove detached versions from a supplied Vec and inherits the parent's separate detached-list implementation. (rust/lance-table/src/io/commit/external_manifest.rs:370-382; rust/lance-table/src/io/commit/external_manifest.rs:734-962; rust/lance-table/src/io/commit.rs:930-948)

## Required extension contracts and defaults

Implement get, get_latest_version, put_if_not_exists and put_if_exists with consistent keying and atomic target reservation. Default location adapters parse paths but leave size/ETag/identity unknown. Default put ignores the supplied ETag and runs reserve then finalize; overriding these hooks can change that protocol. delete defaults to successful no-op. (rust/lance-table/src/io/commit/external_manifest.rs:162-285; rust/lance-table/src/io/commit/external_manifest.rs:337-368)

Predecessor support defaults false, identity lookup None, external listing None and conditioned reservation NotSupported. A supporting store must mint never-reused record identities, return them on all relevant locations, atomically check predecessor identity while reserving a target, supply authoritative identified history, and implement identity-conditional idempotent forget_version. Default forget fails loudly with NotSupported. The handler does not enforce adjacency or latest-head equality; resolve_latest_identity reads latest version and identity in separate awaits, so reservation is the decisive recheck. (rust/lance-table/src/io/commit/external_manifest.rs:286-335; rust/lance-table/src/io/commit/external_manifest.rs:894-961; rust/lance-table/src/io/commit/external_manifest.rs:1019-1121)

## Failure classification and cancellation

Ordinary put errors and conditioned Taken/Err outcomes enter lose_or_retain. A different indexed path proves a loser for this helper and triggers best-effort deletion; same path or lookup failure retains staging. Every branch returns CommitConflict, including ambiguous IO outcomes. PredecessorChanged instead deletes the refused object best effort and returns OtherError(PrerequisiteFailed). Initial writer failure has no local cleanup, and no handler cancellation guard reclaims unique objects. (rust/lance-table/src/io/commit/external_manifest.rs:963-1011; rust/lance-table/src/io/commit/external_manifest.rs:1049-1149; rust/lance-table/src/io/commit/external_manifest.rs:1163-1177)

The external handler does not override parent definitive-NotFound or propagate-after-readback policy, inheriting false and true. A CommitConflict from this handler therefore must not be interpreted as proof that no selected/durable write exists; complete Dataset interpretation remains pending. Cancelling a conditioned commit after object write but before reservation can leave an undiscoverable-as-version orphan. (rust/lance-table/src/io/commit.rs:878-929; rust/lance-table/src/io/commit/external_manifest.rs:707-1121; rust/lance-table/src/io/commit/external_manifest.rs:2438-2474)

## Copy memory and async lifecycle

copy_size_aware uses raw COPY only for expected size < 5 GiB. At exactly 5 GiB and above, it GET-streams and sequentially writes multipart parts of 100 MiB. Comments saying above 5 GiB or 100 MB are approximate; the constants and strict comparison are authoritative. A small-copy error does not retry through streaming. (rust/lance-table/src/io/commit/external_manifest.rs:384-433)

Each full part swaps in a fresh Vec before awaited upload; the current input chunk, uploaded part and replacement buffer can coexist. This is not a 100 MiB total-memory bound. Stream, part and completion errors explicitly attempt abort and ignore abort failure. Cancellation has no Drop abort guard. Empty input completes a zero-part upload; there is no local part-count/checksum/actual-byte counter. Final HEAD verifies only size. Provider support/limits must be established in separately analyzed implementations. (rust/lance-table/src/io/commit/external_manifest.rs:434-558)

## Tests and remaining evidence

Read-only source coverage includes ETag refresh/clearing, same-length replacement acceptance, size corruption, canonical success before index repair, a deterministic two-finalizer generation race, lost reservation response, missing-source recovery and retained staging after a failed copy. Identity fixtures cover unique-path discovery, stale/recreated predecessors, taken versions, cancelled reservation orphans and conditional/idempotent retirement. They use memory stores/proxy policies and do not prove cloud atomicity or large multipart behavior. (rust/lance-table/src/io/commit/external_manifest.rs:1178-2040; rust/lance-table/src/io/commit/external_manifest.rs:2041-2553)

No repository tests, builds or services were run. Large-object threshold, streaming error/cancellation branches and complete Dataset outcomes remain unqualified by this file's local fixtures. This supplement completes this source file, not the full commit subsystem.
`);
append('L0-orientation.md', `## External manifest authority

An external manifest store coordinates a version record separately from object bytes. Generic publication selects unique staging bytes then copies to a canonical path; predecessor-conditioned publication instead makes the unique path final through an identity-bearing record. Record identity protects a particular incarnation and is distinct from physical ETag. See [external commit](L1-modules/rust-lance-table-external-commit.md). (rust/lance-table/src/io/commit/external_manifest.rs:117-161; rust/lance-table/src/io/commit/external_manifest.rs:286-335; rust/lance-table/src/io/commit/external_manifest.rs:1049-1121)

**Helping finalizer**: a reader that materializes selected staging bytes and repairs the generic external index. **Reservation**: Reserved with a minted identity, Taken, or PredecessorChanged for conditioned publication. **Authoritative external history**: Some(Vec) of identified final locations, including unique filenames excluded by ordinary manifest parsing. (rust/lance-table/src/io/commit/external_manifest.rs:104-115; rust/lance-table/src/io/commit/external_manifest.rs:623-705; rust/lance-table/src/io/commit/external_manifest.rs:907-961)`);
append('L3-symbols/behavior-contracts.md', `## External manifest commit contracts

Generic reserve/copy and identity-conditioned publication are distinct protocols. Only selected immutable staging bytes may reach a generic canonical path; post-copy index update/deletion failures cannot undo canonical success. Conditioned reservation publishes its unique already-written object without COPY or finalization. Mixing those rules can expose an unselected object or overwrite a reused deterministic prefix. (rust/lance-table/src/io/commit/external_manifest.rs:35-102; rust/lance-table/src/io/commit/external_manifest.rs:117-161; rust/lance-table/src/io/commit/external_manifest.rs:1049-1121)

Generic final verification HEADs, rejects known-size mismatch and refreshes ETag, but record identity routes through recorded_as_final, which can skip IO entirely. Never promise that every returned location has just passed size/existence/ETag validation. Unknown-size missing staging also differs between latest refetch and exact-version failure. (rust/lance-table/src/io/commit/external_manifest.rs:568-622; rust/lance-table/src/io/commit/external_manifest.rs:734-893; rust/lance-table/src/io/commit/external_manifest.rs:1151-1162)

lose_or_retain always returns CommitConflict. Same-path reservation or readback error retains staging; a different path deletes it best effort. This classification includes lost successful reservation responses and failed copies, not only proven arbitration loss. PredecessorChanged uniquely maps to PrerequisiteFailed. The full Dataset retry/outcome layer must preserve these distinctions. (rust/lance-table/src/io/commit/external_manifest.rs:1091-1149; rust/lance-table/src/io/commit/external_manifest.rs:1780-1817; rust/lance-table/src/io/commit/external_manifest.rs:1934-2040)

Identity support requires never-reused record tokens, identified locations, atomic prerequisite check plus insertion, authoritative listing and conditional retirement. Support=true alone enforces none of them; default retirement refuses. Some(empty) external history must not merge stale physical manifests back in. (rust/lance-table/src/io/commit/external_manifest.rs:286-335; rust/lance-table/src/io/commit/external_manifest.rs:907-961; rust/lance-table/src/io/commit/external_manifest.rs:2475-2553)`);
append('L3-symbols/format-spec.md', `## External record and physical-object identity boundaries

This trait specifies logical record fields (base URI/version/path/size/optional ETag) and optional incarnation identity, but no universal serialized external schema. Generic writes clear indexed ETags; returned ETags describe a HEAD/PUT observation. Identity-conditioned final objects retain the normal staging suffix, so filename shape alone cannot classify all committed versions. Changing object naming or record layout therefore requires concrete backend and listing analysis. (rust/lance-table/src/io/commit/external_manifest.rs:162-368; rust/lance-table/src/io/commit/external_manifest.rs:1049-1090; rust/lance-table/src/io/commit.rs:772-775)

The existing equal-size replacement test deliberately accepts a new object generation without byte validation. Size is the only generic finalization check here; no checksum or Manifest decode establishes content identity. Do not infer a persisted format integrity guarantee from this resolver. (rust/lance-table/src/io/commit/external_manifest.rs:434-485; rust/lance-table/src/io/commit/external_manifest.rs:1438-1487)`);
append('L4-crosscutting/scenarios.md', `## External publication, repair and conditioned history

1. Ordinary commit writes a unique staging object through ManifestWriter, then default put atomically reserves its path with ETag None. A lost response can still leave a selected row. (rust/lance-table/src/io/commit/external_manifest.rs:216-261; rust/lance-table/src/io/commit/external_manifest.rs:963-1011)
2. Finalization copies those selected bytes to canonical storage, HEADs to check size/obtain ETag, updates the external row and deletes staging. Index-update failure returns success while retaining staging; a later reader can repeat the selected immutable copy and repair the row. (rust/lance-table/src/io/commit/external_manifest.rs:35-102; rust/lance-table/src/io/commit/external_manifest.rs:434-485; rust/lance-table/src/io/commit/external_manifest.rs:1604-1779)
3. An ordinary publication error becomes CommitConflict after path-based loser cleanup or retention. A later read may finish the selected write. Complete transaction readback/rebase/retry remains pending. (rust/lance-table/src/io/commit/external_manifest.rs:1123-1149; rust/lance-table/src/io/commit/external_manifest.rs:1780-1817)
4. For conditioned publication, read predecessor token, write a unique object, then atomically verify that token while inserting the new record. Success leaves the unique object as final; no shared canonical path is written. Changed predecessor refuses publication and attempts object deletion. (rust/lance-table/src/io/commit/external_manifest.rs:1030-1121)
5. Identified readers/history use external records. Record retirement compares the token so stale cleanup cannot remove a replacement record. Cancellation before reservation can leave an unlisted-as-version orphan; listing all raw objects still sees it. (rust/lance-table/src/io/commit/external_manifest.rs:907-961; rust/lance-table/src/io/commit/external_manifest.rs:1151-1162; rust/lance-table/src/io/commit/external_manifest.rs:2438-2505)

See [external commit module](../L1-modules/rust-lance-table-external-commit.md) for exact APIs and branch-specific errors. These traces do not yet establish the full Dataset write/compact or operation-pair conflict acceptance answers.`);
append('L4-crosscutting/cookbook.md', `## Implement an external manifest store

Implement the four required ExternalManifestStore lookup/conditional-write methods with stable dataset keying and atomic target insertion. Preserve ETag None clearing for generic callers. Choose whether to retain default put/finalize; if overriding, account for reader-side generic helping, which does not call the override. Implement location methods to retain any required metadata. (rust/lance-table/src/io/commit/external_manifest.rs:162-368; rust/lance-table/src/io/commit/external_manifest.rs:623-705)

For predecessor support, implement never-reused identity generation, both identified location paths, get_identity, atomic put_if_predecessor, list_versions and identity-conditional forget_version together. Return unique committed paths in external history; do not depend on physical canonical-name listing. Decide how missing/retired records are distinguished from fallback history and verify concurrent replacement behavior. Concrete backend schema and Dataset integration are still pending. (rust/lance-table/src/io/commit/external_manifest.rs:286-335; rust/lance-table/src/io/commit/external_manifest.rs:734-961; rust/lance-table/src/io/commit/external_manifest.rs:1019-1121)

Extend existing tests for lost responses, post-copy index failures, generation races, changed/taken predecessors, cancellation orphans and conditional retirement. Add focused provider/large-copy evidence for threshold equality, part/stream/complete errors, cancellation and abort failures; current local tests do not cover those paths. Preserve stable format contracts without extending frozen legacy writers. (rust/lance-table/src/io/commit/external_manifest.rs:384-558; rust/lance-table/src/io/commit/external_manifest.rs:1178-2553; AGENTS.md:7-18)`);
append('L4-crosscutting/pitfalls.md', `## External-store pitfalls

- ETag is neither a record incarnation nor content hash. Equivalent finalizer copies can change it; generic index updates clear it. (rust/lance-table/src/io/commit/external_manifest.rs:144-161; rust/lance-table/src/io/commit/external_manifest.rs:1677-1779)
- An identity-bearing known-size location can be returned without HEAD; generic location validation is stronger but also has an unchecked parent fallback. (rust/lance-table/src/io/commit/external_manifest.rs:568-622; rust/lance-table/src/io/commit/external_manifest.rs:1151-1162)
- CommitConflict can follow successful reservation or a failed copy of a selected winner. Retention preserves repairability; it does not prove the caller lost. (rust/lance-table/src/io/commit/external_manifest.rs:1123-1149; rust/lance-table/src/io/commit/external_manifest.rs:1780-1817; rust/lance-table/src/io/commit/external_manifest.rs:1934-2040)
- The 100 MiB part buffer is not a total-memory ceiling, and explicit abort-on-error does not handle cancellation. Exact 5 GiB dispatches to streaming rewrite. (rust/lance-table/src/io/commit/external_manifest.rs:384-558)
- Unique final objects and cancelled orphans share staging-shaped names; external records determine identified history. Raw object listing and valid manifest listing are different. (rust/lance-table/src/io/commit/external_manifest.rs:1049-1090; rust/lance-table/src/io/commit/external_manifest.rs:2324-2359; rust/lance-table/src/io/commit/external_manifest.rs:2438-2474)`);
append('L4-crosscutting/build-and-test.md', `## External manifest source-test coverage

The generic mock keys by (base URI, version), supports error-after-insertion and failed/paused index update, and uses memory objects plus a named proxy COPY failure. The identified mock keys only by version, mints counter strings, preserves token across path compaction and changes tokens in a record-only recreation. Neither is a production distributed backend. Generation-race wait is five seconds; cancelled-reservation wait is thirty seconds. These are declared test bounds, not measured runtimes. (rust/lance-table/src/io/commit/external_manifest.rs:1195-1347; rust/lance-table/src/io/commit/external_manifest.rs:1677-1779; rust/lance-table/src/io/commit/external_manifest.rs:1934-2040; rust/lance-table/src/io/commit/external_manifest.rs:2041-2239; rust/lance-table/src/io/commit/external_manifest.rs:2438-2474)

All local tests were read, not executed. The full test matrix and untested copy/cancellation boundaries are recorded in [external commit](../L1-modules/rust-lance-table-external-commit.md).`);
const changes=[];
function replace(p,a,b) {
  const text=read(p);
  if (!text.includes(a)) throw Error('Missing replacement in ' + p + ': ' + a);
  fs.writeFileSync(p,text.replace(a,b)); changes.push({path:p,before:a,after:b});
}
replace('L1-modules/rust-lance-table.md','Forty-six of 54 inventory entries are analyzed, covering 32,930 physical lines','Forty-seven of 54 inventory entries are analyzed, covering 35,483 physical lines');
replace('L1-modules/rust-lance-table-commit.md','External-manifest and DynamoDB children, underlying object stores and complete Dataset conflict/retry/cleanup are pending.','External-manifest authority is covered in the [external commit supplement](rust-lance-table-external-commit.md). DynamoDB, underlying object stores and complete Dataset conflict/retry/cleanup remain pending.');
append('L1-modules/rust-lance-table.md', `## External commit authority

The [external commit supplement](rust-lance-table-external-commit.md) covers both generic canonical publication and identity-conditioned unique-path publication, reader helping, authoritative listings, multipart-copy lifecycle and all local fixtures. Concrete DynamoDB/namespace implementations and full Dataset integration remain pending. (rust/lance-table/src/io/commit/external_manifest.rs:1-2553)`);
append('L1-modules/rust-lance-table-io.md', `## External authority coverage

The [external commit supplement](rust-lance-table-external-commit.md) now completes the generic external handler/store interface, including identified publication and record retirement. Concrete backends and full Dataset integration remain pending. (rust/lance-table/src/io/commit/external_manifest.rs:1-2553)`);
fs.writeFileSync('analysis/iteration-049-status-refresh.json',JSON.stringify(changes,null,2)+'\n');
console.log({public_api_rows:api.split('\n').length,status_refreshes:changes.length});
