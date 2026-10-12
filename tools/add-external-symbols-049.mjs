import fs from 'node:fs';
import {root, linesOf} from './inventory.mjs';
const read = p => JSON.parse(fs.readFileSync(p));
const write = (p, value) => fs.writeFileSync(p, JSON.stringify(value, null, 2) + '\n');
const file = 'rust/lance-table/src/io/commit/external_manifest.rs';
const source = linesOf(fs.readFileSync(root + '/' + file, 'utf8'));
const analysis = read('analysis/iteration-049-external.json').files[0];
const prefix = 'lance_table::io::commit::external_manifest::';
const symbols = [];
const scopes = [
  [163,368,'ExternalManifestStore','public trait'],
  [567,705,'ExternalManifestCommitHandler','private'],
  [708,1121,'<ExternalManifestCommitHandler as CommitHandler>','public'],
  [1123,1149,'ExternalManifestCommitHandler','private'],
  [1213,1239,'tests::TestExternalManifestStore','private cfg(test)'],
  [1242,1347,'tests::<TestExternalManifestStore as ExternalManifestStore>','private cfg(test)'],
  [2052,2084,'tests::IdentifiedStore','private cfg(test)'],
  [2087,2239,'tests::<IdentifiedStore as ExternalManifestStore>','private cfg(test)'],
  [2513,2543,'tests::test_retirement_is_refused_where_the_store_cannot_forget::<NoForget as ExternalManifestStore>','private cfg(test)']
];
const structs = [
  [563,565,'ExternalManifestCommitHandler'],[1196,1200,'tests::StoredManifest'],
  [1203,1211,'tests::TestExternalManifestStore'],[2044,2050,'tests::IdentifiedStore']
];
function add(name, line, end_line, kind, visibility) {
  const range = analysis.ranges.find(([a,b]) => a <= line && line <= b);
  if (!range) throw Error('Missing analysis: ' + line);
  symbols.push({name: prefix + name, path: file, line, end_line, kind, visibility,
    behavior: range[2], behavior_reference: `${file}:${range[0]}-${range[1]}`,
    callers: line >= 1178
      ? 'Local generic/identified-store fixtures and deterministic concurrency/failure tests, read but not run.'
      : 'ExternalManifestCommitHandler dispatches these local helpers and store hooks; parent handler factory constructs the external handler. Concrete DynamoDB/namespace and full Dataset consumers remain pending.',
    callees: 'Per-range L2 gives exact order. Local boundaries include external reservation/location/retirement hooks, ManifestWriter, parent naming/default resolvers/listing/hint, raw HEAD/COPY/GET/multipart/delete, and audit/logging. Full backend and dataset call graphs remain pending.'});
}
for (const [a,b,owner,visibility] of scopes) {
  if (source[a-1].trimStart().startsWith('impl')) {
    add(owner.includes('<') ? owner : owner + '::<inherent impl at ' + a + '>', a, a, 'implementation', visibility);
  }
}
for (let i = 0; i < source.length; i++) {
  const line = i + 1, text = source[i];
  const scope = scopes.find(([a,b]) => a < line && line <= b);
  const fn = text.match(/^\s*(pub(?:\([^)]*\))?\s+)?(async\s+)?fn\s+(\w+)/);
  if (fn) {
    let end = line;
    while (!/[{;]\s*$/.test(source[end-1])) end++;
    const owner = scope ? scope[2] + '::' : line >= 1178 ? 'tests::' : '';
    const visibility = line >= 1178 ? 'private cfg(test)' : fn[1]?.includes('crate') ? 'pub(crate)' : fn[1] ? 'public' : scope?.[3] ?? 'private';
    add(owner + fn[3], line, end, fn[2] ? 'async function' : 'function', visibility);
    continue;
  }
  const decl = text.match(/^\s*(pub(?:\([^)]*\))?\s+)?(struct|enum|trait|mod|const|static)\s+(\w+)/);
  if (decl) {
    const owner = line === 2511 ? 'tests::test_retirement_is_refused_where_the_store_cannot_forget::' : line >= 1195 ? 'tests::' : '';
    add(owner + decl[3], line, line, decl[2], decl[1] ? 'public' : line >= 1178 ? 'private cfg(test)' : 'private');
  }
  const st = structs.find(([a,b]) => a < line && line < b);
  const field = text.match(/^\s*(pub\s+)?(\w+):\s+.+,$/);
  if (st && field) add(st[2] + '::' + field[2], line, line, 'field', field[1] ? 'public' : 'private cfg(test)');
}
for (const [line,name] of [[109,'Reserved'],[111,'Taken'],[114,'PredecessorChanged']]) {
  add('Reservation::' + name, line, line, 'enum variant', 'public');
}
const duplicates = symbols.filter((s,i) => symbols.findIndex(x => x.name === s.name) !== i);
if (duplicates.length) throw Error(JSON.stringify(duplicates));
write('analysis/rust-symbols.json', [...read('analysis/rust-symbols.json').filter(s => s.path !== file), ...symbols]);
write('analysis/iteration-049-symbols.json', symbols);
console.log({added: symbols.length, duplicates: duplicates.length});
