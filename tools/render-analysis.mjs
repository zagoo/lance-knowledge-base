import fs from 'node:fs';
import path from 'node:path';
import {root, output, digest, linesOf, totals} from './inventory.mjs';

const ledgerPath = path.join(output, 'MANIFEST.json');
const manifest = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
const batch = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
for (const analysis of batch.files) {
  const entry = manifest.files.find(e => e.path === analysis.path);
  if (!entry || !['utf8', 'symlink-target'].includes(entry.representation)) throw new Error(`Not a text inventory entry: ${analysis.path}`);
  const bytes = entry.representation === 'symlink-target'
    ? Buffer.from(fs.readlinkSync(path.join(root, entry.path)))
    : fs.readFileSync(path.join(root, entry.path));
  if (digest(bytes) !== entry.sha256) throw new Error(`Source drift: ${entry.path}`);
  const lines = linesOf(bytes.toString('utf8'));
  let next = 1;
  for (const [start, end, note] of analysis.ranges) {
    if (start !== next || end < start || end > lines.length || !note.trim()) throw new Error(`Coverage gap/invalid note: ${entry.path}:${start}-${end}`);
    next = end + 1;
  }
  if (next !== lines.length + 1 || analysis.reviewed !== true) throw new Error(`Incomplete review: ${entry.path}`);
  const destination = path.join(output, entry.l2_document);
  fs.mkdirSync(path.dirname(destination), {recursive: true});
  const relative = target => path.relative(path.dirname(destination), path.join(output, target));
  const cite = (a, b) => `${entry.path}:${a}-${b}`;
  const sections = [
    `# ${entry.path}`,
    `Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: \`${entry.sha256}\`. Reviewed physical lines: 1-${lines.length}.`,
    `[Module](${relative(analysis.module || 'L1-modules/protos.md')}) · [Symbols](${relative('L3-symbols/symbol-index.md')}) · [Behavior contracts](${relative('L3-symbols/behavior-contracts.md')}) · [Format](${relative('L3-symbols/format-spec.md')}) · [Entry](${relative('README.md')})`,
    '## Role and visibility',
    `${analysis.role} (${cite(1, lines.length)})`,
    '## Complete range analysis',
    ...analysis.ranges.map(([start, end, note]) => `### Lines ${start}-${end}\n\n${note} (${cite(start, end)})`),
    '## Interaction and interpretation limits',
    analysis.limits,
    '## Exact declarations and numbered evidence',
    'This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.',
    '``````text\n' + lines.map((line, i) => `${String(i + 1).padStart(5)} | ${line}`).join('\n') + '\n``````'
  ];
  fs.writeFileSync(destination, sections.join('\n\n') + '\n');
  entry.status = 'analyzed';
  entry.read_ranges = [[1, lines.length]];
  entry.analyzed_ranges = analysis.ranges.map(([start, end]) => [start, end]);
  entry.analysis_record = path.relative(output, path.resolve(process.argv[2]));
  entry.analysis_iteration = batch.iteration;
}
manifest.totals = totals(manifest.files);
manifest.updated_at = new Date().toISOString();
fs.writeFileSync(ledgerPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({written: batch.files.map(x => x.path), totals: manifest.totals}, null, 2));
