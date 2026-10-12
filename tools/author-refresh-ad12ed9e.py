"""Scoped contract/map synthesis for the recorded changed hunks; no source execution."""
from pathlib import Path
import json,re
P=Path(__file__).resolve().parents[1];R=P/'verification/refresh-ad12ed9e';NEW='ad12ed9e15e0046688b00568d0ac1a347fb2d328';OLD='c3c8d6fb505fb437b2b673c5195e1d4b74436b2f'
before=json.loads((R/'before-documents.json').read_text());changes=json.loads((R/'changes.json').read_text())
def save(n,s):
 f=P/n
 if f.exists():before.setdefault(n,f.read_text())
 f.write_text(s)
 if n not in changes['changed_artifacts']:changes['changed_artifacts'].append(n)
def refresh_note(s):
 if '> Refreshed 2026-10-04 against' in s:return s
 a,b=s.split('\n',1);return a+'\n\n> Refreshed 2026-10-04 against `'+NEW+'`; changed-source pointers and contracts checked in this refresh.\n'+b
f='L1-modules/java.md';s=(P/f).read_text().replace('`java/lance-jni/src/blocking_dataset.rs` — read `1-4344`.','`java/lance-jni/src/blocking_dataset.rs` — read `1-4325`.')
s+='''
## Refresh: reference-based opening and value identity — mapped only

These notes summarize changed interface hunks only. Java remains mapped only; they do not certify native lifetimes, the whole binding or runtime execution.

- ReadOptions carries an optional Ref and exposes it through getRef, alongside the existing optional numeric version. (java/src/main/java/org/lance/ReadOptions.java:24-60)
- Builder.setRef rejects null before storing the reference. (java/src/main/java/org/lance/ReadOptions.java:170-173)
- Builder.build rejects simultaneous version and ref with IllegalArgumentException. (java/src/main/java/org/lance/ReadOptions.java:308-316)
- Builder.build also rejects serializedManifest together with ref; the manifest already chooses the opened version. (java/src/main/java/org/lance/ReadOptions.java:317-323)
- OpenDatasetBuilder copies getRef into the options it forwards, just as it copies the existing numeric version. (java/src/main/java/org/lance/OpenDatasetBuilder.java:231-247)
- Dataset.openNative's Java call and native declaration both now include Optional<Ref> after Optional<Long> version. Update these boundary arguments together. (java/src/main/java/org/lance/Dataset.java:457-498)
- The JNI conversion extracts Ref first and falls back to converting the numeric version only when no Ref is present; mutual exclusion is enforced by ReadOptions.Builder. (java/lance-jni/src/blocking_dataset.rs:1743-1748)
- BlockingDataset.open dispatches numeric/default-chain versions to with_version, a named branch to with_branch, and a tag to with_tag; no reference keeps the ordinary builder. (java/lance-jni/src/blocking_dataset.rs:255-267)
- Default-branch references at open are documented as URI-chain-relative. Opening a branch-directory URI can therefore differ from Dataset.checkout's default-branch interpretation; start from the dataset root for explicit branch selection. (java/src/main/java/org/lance/ReadOptions.java:137-153)
- DataFile equality now includes baseId; hashCode combines path, major/minor version, size, baseId and both array contents. (java/src/main/java/org/lance/fragment/DataFile.java:78-98)
- DeletionFile equality includes baseId, and hashCode uses id, readVersion, numDeletedRows, fileType and baseId. (java/src/main/java/org/lance/fragment/DeletionFile.java:90-105)
- DataOverlayFile.hashCode now delegates through its DataFile object together with coverage and committedVersion, matching the fields compared by equals. (java/src/main/java/org/lance/operation/DataOverlay.java:152-165)

[Ordered Java open route](../L4-crosscutting/navigation-index.md#java-open) · [Rust delayed-checkout contract](../L3-symbols/public-api.md#dataset-open-reference-resolution).
''';save(f,s)
f='L3-symbols/public-api.md';s=refresh_note((P/f).read_text());at=s.index('## Read/query contracts')
s=s[:at]+'''## Dataset open reference resolution

When a named branch is requested through an unmanaged store, DatasetBuilder marks checkout as delayed. Numeric-only version references remain relative to the URI chain. (rust/lance/src/dataset/builder.rs:734-744)

For delayed checkout, the initial load_by_uri now receives None and loads the URI chain's latest version; it must not require the target branch's requested version number to exist on that initial chain. Non-delayed loading still passes the requested version number. This is a source-verified behavior change in the refresh. (rust/lance/src/dataset/builder.rs:807-828)

After that initial load, delayed tag lookup resolves its branch/version on the loaded Dataset, and differing branch/version triggers checkout_version. The new initial-load rule preserves this later checkout stage rather than changing file-format gates or transaction conflict rules. (rust/lance/src/dataset/builder.rs:844-866)

[Ordered reference-open route](../L4-crosscutting/navigation-index.md#dataset-open) · [Java mapped interface notes](../L1-modules/java.md#refresh-reference-based-opening-and-value-identity--mapped-only). Python declarations themselves did not change; its open/version family uses the shared DatasetBuilder boundary.

'''+s[at:];save(f,s)
f='L1-modules/rust-lance.md';s=(P/f).read_text();s+='''
## Refresh: DatasetBuilder reference loading

The mapped builder entry now spans production lines 1–951. Its changed delayed-checkout branch first loads the URI chain's latest manifest, then resolves the requested branch/version; it no longer asks the initial chain for the target branch's version. Read the canonical [reference-resolution contract](../L3-symbols/public-api.md#dataset-open-reference-resolution), then rust/lance/src/dataset/builder.rs:734-866. The existing builder remains mapped; no new per-file L2 is required for this focused refresh.
''';save(f,s)
f='L1-modules/peripheral-maps.md';s=(P/f).read_text();s+='''
## Refresh notes — unchanged peripheral implementation

The lance-arrow lib.rs edit before later production helpers is confined to a documentation example; later helper pointers shift by four lines. The namespace-datafusion session_builder.rs change is entirely after its production range 1–135. These peripherals remain mapped only, with no production behavior re-analysis. [Diff scope and production-equivalence evidence](../verification/refresh-ad12ed9e/scope.json).
''';save(f,s)
f='L4-crosscutting/navigation-index.md';s=(P/f).read_text();at=s.index('## Retained production recipe and scenario routes');s=s[:at]+'''<a id="dataset-open"></a>
### Open a named branch or tag

[Reference-resolution contract](../L3-symbols/public-api.md#dataset-open-reference-resolution). Source order:

1. `rust/lance/src/dataset/builder.rs:240-255,734-866` — reference selection, initial load and delayed checkout.
2. `rust/lance/src/dataset.rs:520-588` — Dataset open/checkout facade and snapshot ownership.

<a id="java-open"></a>
### Open a Java dataset at a reference — mapped only

[Changed Java interfaces](../L1-modules/java.md#refresh-reference-based-opening-and-value-identity--mapped-only). Keep Java boundary and Rust resolution as separate bounded subtasks.

**Java forwarding (four files):** `java/src/main/java/org/lance/ReadOptions.java:137-173,308-324` → `java/src/main/java/org/lance/OpenDatasetBuilder.java:231-247` → `java/src/main/java/org/lance/Dataset.java:457-498` → `java/lance-jni/src/blocking_dataset.rs:205-279,1727-1788`.

**Shared reference resolution (two files):** `java/lance-jni/src/blocking_dataset.rs:255-267` → `rust/lance/src/dataset/builder.rs:734-866`. Main/default-chain open semantics are URI-relative; use the canonical contract before treating open as equivalent to checkout.

'''+s[at:];save(f,s)
f='refresh-addenda/2026-10-04-ad12ed9e.md';s=(P/f).read_text().replace('The referenced implementation hunks themselves did not change.','The referenced Arrow implementation hunks themselves did not change. Statistics rows beyond line 931 are mechanically relocated historical test coordinates only; they do not establish current test coverage or claim unchanged test behavior.');save(f,s)
# Make stale status explicit until all scoped checks pass.
f='COMPLETION-REPORT.md';s=(P/f).read_text();(R/'completion-report-before.txt').write_text(s);s=s.replace('**COMPLETE — Definition of Done V2.1 satisfied at iteration 95.** M1–M4 are complete and all five final verification gates pass.','**Refresh in progress — affected areas are STALE until scoped verification passes.** The V2.1 baseline completed at iteration 95. Current refresh status is recorded in the refresh report.');s=s.replace('Snapshot: `'+OLD+'`','Snapshot target: `'+NEW+'`');save(f,s)
f='README.md';s=(P/f).read_text().replace('**V2.1 complete — iteration 95.**','**V2.1 baseline complete; refresh in progress — affected areas STALE.**');s=s.replace('Source snapshot: `'+OLD+'`.','Source target: `'+NEW+'` (refresh verification pending). Frozen bodies remain pinned to `'+OLD+'`; the dated addendum translates affected references.');s+='\n[Source refresh report](REFRESH-REPORT.md) · [Frozen refresh addendum](refresh-addenda/2026-10-04-ad12ed9e.md).\n';save(f,s)
save('REFRESH-REPORT.md','''# Lance KB refresh — 2026-10-04

**IN PROGRESS — affected areas STALE until scoped verification passes.**

OLD: `'''+OLD+'''` → NEW: `'''+NEW+'''`.

Diff: 20 files, 376 insertions and 46 deletions. Classification: 1 frozen Key File, 10 mapped, 9 excluded (including one newly added test). No renamed or removed files; no new non-trivial source file or Key File candidate. [Complete classification](verification/refresh-ad12ed9e/scope.json) · [Git diff stat](verification/refresh-ad12ed9e/diff-stat.txt).

The Key File's production code is unchanged. Java interface/reference and identity changes, the Rust delayed-checkout fix, and line drift are covered by scoped updates. Frozen bodies/catalog are preserved through [dated addenda](refresh-addenda/2026-10-04-ad12ed9e.md). Java/peripherals remain mapped only.

Verification: navigation pending; contract answers pending; random accuracy pending; one full cross-link/citation scan pending. No current-source reliability claim is made before those checks pass.
''')
(R/'before-documents.json').write_text(json.dumps(before,indent=2)+'\n');(R/'changes.json').write_text(json.dumps(changes,indent=2)+'\n')
print('Scoped map/contract additions complete; documents affected:',len(changes['changed_artifacts']))
