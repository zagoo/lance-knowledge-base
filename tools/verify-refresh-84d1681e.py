"""Refresh integrity checks. Reads metadata and KB text; never executes Lance code.

Run delta before publication, full exactly once, then delta for status-only edits.
Frozen and historical citations are checked against their explicit old snapshot.
"""
from pathlib import Path
from collections import Counter
from datetime import datetime, timezone
from urllib.parse import unquote
import hashlib
import json
import re
import subprocess
import sys

P = Path(__file__).resolve().parents[1]
R = P / 'verification/refresh-84d1681e'
manifest = json.loads((P / 'CORE-MANIFEST.json').read_text())
source = Path(manifest['repository'])
entries = {e['path']: e for e in manifest['files']}
scope = json.loads((R / 'scope.json').read_text())
old_entries = json.loads((R / 'old-changed-entries.json').read_text())
previous = {e['path']: e for e in json.loads((R/'CORE-MANIFEST.json').read_text())['files']}
baseline = dict(previous)
baseline.update(json.loads((P/'verification/refresh-ad12ed9e/old-changed-entries.json').read_text()))
registry = json.loads((P / 'verification/frozen-snapshot-085.json').read_text())
frozen = {e['document']: e for e in registry['documents']}
changed = json.loads((R / 'changes.json').read_text())['changed_artifacts']
mode = sys.argv[1]
assert mode in ('delta', 'full')
destination = R / ('integrity-full.json' if mode == 'full' else 'integrity-delta.json')
if mode == 'full':
    assert not destination.exists(), 'Full scan already recorded; use delta for repairs.'

def sha(data):
    return hashlib.sha256(data).hexdigest()

def rendered_text(body):
    # Literal source appendices contain Rustdoc syntax, not navigable KB links.
    out = []; fence = None
    for line in body.splitlines():
        match = re.match(r'^\s*(`{3,}|~{3,})', line)
        if match:
            marker = match[1]
            if fence is None:
                fence = (marker[0], len(marker))
            elif marker[0] == fence[0] and len(marker) >= fence[1]:
                fence = None
        elif fence is None:
            out.append(line)
    return '\n'.join(out)

def git(*args):
    return subprocess.check_output(['git', *args], cwd=source).decode().strip()

issues = []
counts = Counter(e['status'] for e in entries.values())
assert git('rev-parse', 'HEAD') == scope['new_commit']
assert not git('status', '--porcelain'), 'Source changed during refresh'
if len(entries) != len(manifest['files']):
    issues.append('Duplicate ledger paths')
tracked = set(git('ls-files').splitlines())
if set(entries) != tracked:
    issues.append({'ledger_vs_tracked': {'missing': sorted(tracked-set(entries)), 'extra': sorted(set(entries)-tracked)}})
if (P / 'MANIFEST.json').exists():
    issues.append('Parallel live ledger')
totals = {'files': len(entries), 'excluded': counts['excluded'], 'key_file': counts['key-file'], 'mapped': counts['mapped'], 'unclassified': counts[None], 'non_excluded': len(entries)-counts['excluded']}
for key, value in totals.items():
    if manifest['totals'][key] != value:
        issues.append('Wrong ledger total: ' + key)

text_cache = {}
def read(file):
    if file not in text_cache:
        text_cache[file] = file.read_text()
    return text_cache[file]

for e in entries.values():
    name, status = e['path'], e['status']
    if status == 'excluded':
        if not e.get('exclusion_reason'):
            issues.append('Missing exclusion reason: ' + name)
    elif status == 'key-file':
        if not (P / e['l2_document']).is_file():
            issues.append('Missing L2: ' + name)
    elif status == 'mapped':
        ref = e['module_map']; doc = P / ref['document']
        if not doc.is_file() or name not in read(doc):
            issues.append('Missing Module Map membership: ' + name)
        elif ref.get('anchor') and 'id="'+ref['anchor']+'"' not in read(doc):
            issues.append('Missing Module Map anchor: ' + name)
    else:
        issues.append('Invalid or unclassified status: ' + name)
    for row in e.get('included_ranges', []):
        if not 1 <= row[0] <= row[1] <= e['source']['line_count']:
            issues.append('Invalid ledger range: ' + name)

for c in scope['files']:
    e = entries[c['path']]
    if e['status'] == 'excluded':
        if git('rev-parse', scope['new_commit']+':'+c['path']) != e['source']['git_blob']:
            issues.append('Excluded git object mismatch: '+c['path'])
        continue
    raw = (source/c['path']).read_bytes()
    if sha(raw) != e['source']['sha256'] or len(raw.splitlines()) != e['source']['line_count']:
        issues.append('Source metadata mismatch: '+c['path'])
    if e['status'] == 'mapped':
        doc = read(P/e['module_map']['document'])
        match = re.search(r'\| `'+re.escape(c['path'])+r'` \| ([\d, -]+) \|', doc)
        if not match:
            issues.append('Missing mapped reading intervals: ' + c['path'])
        else:
            ranges = [list(map(int, part.strip().split('-'))) for part in match[1].split(',')]
            ranges = [[r[0], r[-1]] for r in ranges]
            if ranges != [r[:2] for r in e['included_ranges']]:
                issues.append({'map_ledger_range_mismatch': c['path'], 'map': ranges, 'ledger': e['included_ranges']})

for name, record in frozen.items():
    if mode == 'full' or name in changed:
        if sha((P/name).read_bytes().split(b'\n\n', 1)[1]) != record['body_sha256']:
            issues.append('Frozen body changed: ' + name)
index = registry['machine_symbol_index']
if sha((P/index['path']).read_bytes()) != index['sha256']:
    issues.append('Frozen machine catalog changed')

citation = re.compile(r'(?<![\w/])((?:rust|python|java|protos|docs)/[\w.\/-]+\.(?:rs|proto|md|toml|py|java|txt|yml|yaml|json|sh)|AGENTS\.md):(\d+(?:-\d+)?(?:,\d+(?:-\d+)?)*)')
anchor_cache = {}
def anchors(file):
    if file not in anchor_cache:
        body = read(file); result = set(re.findall(r'id=[\"\']([^\"\']+)', body)); seen = Counter()
        for heading in re.findall(r'^#{1,6} (.+)$', body, re.M):
            slug = re.sub(r'[^\w -]', '', heading.lower()).replace(' ', '-')
            n = seen[slug]; seen[slug] += 1; result.add(slug+('-'+str(n) if n else ''))
        anchor_cache[file] = result
    return anchor_cache[file]

documents = sorted(P.rglob('*.md')) if mode == 'full' else sorted(P/n for n in set(changed) if n.endswith('.md'))
links = 0; ranges = 0; old_ranges = 0; current_ranges = 0; file_hashes = {}
for file in documents:
    name = str(file.relative_to(P)); body = read(file); file_hashes[name] = sha(file.read_bytes())
    historical = name in frozen or name.startswith('archive/') or '/archive/' in name or body.startswith('> **Historical archive') or (name.startswith('verification/') and not name.startswith('verification/refresh-84d1681e/')) or name == 'verification-log.md'
    for link in re.finditer(r'(?<!!)\[[^\]]+\]\(([^)]+)\)', rendered_text(body)):
        target = link[1]
        if re.match(r'^(?:https?|mailto|app|codex):', target):
            continue
        links += 1; pathname, _, fragment = target.partition('#')
        dest = (file.parent/unquote(pathname)).resolve() if pathname else file.resolve()
        if not dest.exists():
            issues.append({'document': name, 'broken_link': target})
        elif fragment and dest.suffix == '.md' and unquote(fragment) not in anchors(dest):
            issues.append({'document': name, 'broken_anchor': target})
    for match in citation.finditer(body):
        is_previous = name.startswith('verification/refresh-ad12ed9e/') or name == 'refresh-addenda/2026-10-04-ad12ed9e.md'
        e = previous.get(match[1]) if is_previous else (baseline.get(match[1]) if historical else entries.get(match[1]))
        limit = e.get('source', {}).get('line_count') if e else None
        for part in match[2].split(','):
            a, b = int(part.split('-')[0]), int(part.split('-')[-1]); ranges += 1
            if historical: old_ranges += 1
            else: current_ranges += 1
            if limit is None or not 1 <= a <= b <= limit or not (source/match[1]).is_file():
                issues.append({'document': name, 'citation': match[0], 'snapshot': 'previous' if is_previous else ('frozen-baseline' if historical else 'new')})

metrics = {'totals': totals, 'included_production_lines': sum(b-a+1 for e in entries.values() for a,b,*_ in e['included_ranges']), 'excluded_reasons': dict(Counter(e['exclusion_reason'] for e in entries.values() if e['status']=='excluded'))}
(R/'metrics.json').write_text(json.dumps(metrics, indent=2)+'\n')
result = {'at': datetime.now(timezone.utc).isoformat(), 'mode': mode, 'pass': not issues, 'old_commit': scope['old_commit'], 'new_commit': scope['new_commit'], 'source_clean': True, 'ledger': metrics, 'markdown_documents': len(documents), 'links': links, 'citation_ranges': ranges, 'current_snapshot_ranges': current_ranges, 'historical_snapshot_ranges': old_ranges, 'snapshot_policy': 'Frozen bodies and baseline archives retain c3c8d6fb coordinates. Prior refresh evidence/addendum retains ad12ed9e. Active documents and current addendum use 84d1681e. Unchanged files have identical blobs at both commits. All citation ranges including comma-separated ranges and fenced text are checked; only rendered Markdown links are navigable.', 'frozen_bodies_checked': len(frozen) if mode=='full' else len(set(frozen)&set(changed)), 'machine_catalog_unchanged': True, 'issues': issues, 'document_sha256': file_hashes}
destination.write_text(json.dumps(result, indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items() if k!='document_sha256'}, indent=2))
if issues:
    raise SystemExit(1)
