import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const root = '/Users/renshaobin/Workspace/Develop/GitHub/lance';
export const output = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
export const linesOf = text => text === '' ? [] : text.replace(/\n$/, '').split('\n');

function classify(relative, isText) {
  if (/\.proto$/.test(relative)) return 'proto';
  if (/lock$|(?:^|\/)uv\.lock$|generated/.test(relative)) return 'generated';
  if (/\.(md|rst|txt)$/.test(relative) || /^(LICENSE|NOTICE)/.test(relative)) return 'doc';
  if (!isText || /^(test_data|notebooks)\//.test(relative)) return 'data';
  if (/(?:^|\/)(tests?|test_[^/]+)(?:\/|\.)|_test\./.test(relative)) return 'test';
  if (/\.(rs|py|java|c|h|cc|cpp|sh|js|ts|sql)$/.test(relative)) return 'source';
  if (/\.(toml|ya?ml|json|xml|ini|cfg)$/.test(relative) || /(?:Makefile|Dockerfile|ignore|attributes)$/.test(relative)) return 'config';
  return 'data';
}

export function scan() {
  const ledger = path.join(output, 'CORE-MANIFEST.json');
  if (fs.existsSync(ledger) && JSON.parse(fs.readFileSync(ledger, 'utf8')).schema_version === '2.1') {
    throw new Error('V2.1 uses a single navigation ledger. Historical full-source inventory/transcription scans are disabled.');
  }
  const entries = [];
  const directories = [];
  function walk(dir, relative = '') {
    for (const name of fs.readdirSync(dir).sort()) {
      const rel = relative ? `${relative}/${name}` : name;
      const absolute = path.join(dir, name);
      const stat = fs.lstatSync(absolute);
      if (rel === '.git') {
        directories.push({path: rel, status: 'excluded', reason: 'Git object database and administrative metadata; commit/status recorded separately.'});
        continue;
      }
      if (stat.isDirectory()) { walk(absolute, rel); continue; }
      const excluded = /(?:^|\/)(target|node_modules|\.venv|__pycache__|\.pytest_cache)(?:\/|$)/.test(rel);
      const bytes = stat.isSymbolicLink() ? Buffer.from(fs.readlinkSync(absolute)) : fs.readFileSync(absolute);
      let text = null;
      try { if (!bytes.includes(0)) text = new TextDecoder('utf-8', {fatal: true}).decode(bytes); } catch {}
      entries.push({
        path: rel, size: bytes.length, line_count: text === null ? null : linesOf(text).length,
        classification: excluded ? 'generated' : classify(rel, text !== null),
        representation: stat.isSymbolicLink() ? 'symlink-target' : text === null ? 'binary' : 'utf8',
        sha256: digest(bytes), status: excluded ? 'excluded' : 'pending',
        ...(excluded ? {exclusion_reason: 'Local build/dependency/cache artifact, not repository implementation.'} : {}),
        l2_document: `L2-files/${rel}.md`, read_ranges: [], analyzed_ranges: []
      });
    }
  }
  walk(root);
  return {entries, directories};
}

export function totals(entries) {
  const included = entries.filter(e => e.status !== 'excluded');
  return {
    files: entries.length, included_files: included.length,
    excluded_files: entries.length - included.length,
    analyzed_files: included.filter(e => e.status === 'analyzed').length,
    text_lines: included.reduce((n, e) => n + (e.line_count ?? 0), 0),
    analyzed_lines: included.filter(e => e.status === 'analyzed').reduce((n, e) => n + (e.line_count ?? 0), 0),
    binary_files: included.filter(e => e.representation === 'binary').length,
    analyzed_binary_files: included.filter(e => e.representation === 'binary' && e.status === 'analyzed').length,
    analyzed_binary_bytes: included.filter(e => e.representation === 'binary' && e.status === 'analyzed').reduce((n,e)=>n+e.size,0),
    bytes: included.reduce((n, e) => n + e.size, 0)
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const destination = process.argv[2] || path.join(output, 'MANIFEST.json');
  if (fs.existsSync(destination)) throw new Error(`Refusing to overwrite ledger: ${destination}`);
  const {entries, directories} = scan();
  const git = args => execFileSync('git', ['-C', root, ...args], {encoding: 'utf8'}).trimEnd();
  const manifest = {
    schema_version: 1, repository: root, output, created_at: new Date().toISOString(),
    snapshot: {commit: git(['rev-parse', 'HEAD']), branch: git(['branch', '--show-current']), status: git(['status', '--porcelain=v1', '--untracked-files=all'])},
    method: {line_count: 'UTF-8 LF-delimited physical lines, including a final unterminated line; binary files use null, not zero.', analysis: 'Only reviewed contiguous range annotations permit analyzed status; hashes or text copying do not constitute analysis.', binary: 'Binary files remain pending until content/structure and fixture purpose have been inspected; they are not implicitly excluded.'},
    excluded_directories: directories, totals: totals(entries), files: entries
  };
  fs.writeFileSync(destination, JSON.stringify(manifest, null, 2) + '\n');
  console.log(JSON.stringify({destination, snapshot: manifest.snapshot, totals: manifest.totals}, null, 2));
}
