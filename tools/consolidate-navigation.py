"""One-time M3 navigation synthesis from retained KB evidence, not source analysis."""
import json
import os
import re
from pathlib import Path

P = Path('/Users/renshaobin/Workspace/Develop/GitHub/lance-knowledge-base')
A = P / 'archive' / 'crosscutting-093'
if A.exists():
    raise SystemExit('One-time synthesis already archived; edit resulting navigation directly.')
A.mkdir(parents=True)
m = json.loads((P / 'CORE-MANIFEST.json').read_text())
by = {e['path']: e for e in m['files']}
ref = re.compile(r'((?:rust|python|java|protos)/[\w./-]+\.(?:rs|py|proto|java)):(\d+)(?:-(\d+))?')
old = {}


def slug(s):
    return re.sub(r'[^\w -]', '', s.lower()).replace(' ', '-')


def relocate(text, source, dest):
    def sub(match):
        target = match[2]
        if target.startswith(('http:', 'https:', 'mailto:', 'app:', 'codex:', '#')):
            return match[0]
        base, sep, anchor = target.partition('#')
        new = os.path.relpath((source.parent / base).resolve(), dest.parent)
        return '[' + match[1] + '](' + new + (sep + anchor if sep else '') + ')'
    return re.sub(r'\[([^\]]+)\]\(([^)]+)\)', sub, text)


for name in ['cookbook', 'scenarios', 'build-and-test', 'pitfalls']:
    p = P / 'L4-crosscutting' / (name + '.md')
    old[name] = p.read_text()
    dst = A / (name + '.md')
    dst.write_text('> Historical pre-V2.1 cross-layer notes. Not current scope, progress or acceptance criteria. Tests/binaries are excluded; retained production details are canonical in frozen L2/current contracts.\n\n' + relocate(old[name], p, dst))


def current_title(h):
    h = re.sub(r'^(Partial scenario: |Partial |Local recipe: |Local trace: |Local extension seam: |Local change map: )', '', h)
    h = h.replace(' (incomplete whole-system recipe)', '').replace(': incomplete end-to-end recipe', '')
    h = h.replace(' (local, not complete Dataset write)', '').replace('and stable-fixture subtraces', 'subtraces')
    h = h.replace('and compatibility oracles', 'persistence contract').replace('and object-store test instrumentation', '')
    h = h.replace(': established first steps', '').replace(': known definition-side touch points', ': definition and application')
    return h.strip()[0].upper() + h.strip()[1:]


def contract(paths):
    if any('/io/commit' in p or '/transaction' in p for p in paths):
        return '../L3-symbols/protocol-commit.md'
    if any('lance-encoding/' in p for p in paths):
        return '../L3-symbols/protocol-encoding.md'
    if any('lance-index' in p for p in paths):
        return '../L3-symbols/protocol-index.md'
    if any('lance-io/' in p for p in paths):
        return '../L3-symbols/protocol-io.md'
    return '../L3-symbols/behavior-contracts.md'


nav = ['# Ordered development navigation', '',
       'Use one task/read set at a time. Each set contains at most five unique source files, ordered from contract/definition toward mechanism. A broad change spanning multiple mechanisms is split into named subtasks. These are implementation reading routes, not guarantees that a future patch touches only these files. Source ranges refer to the pinned ledger snapshot. Completed crates link directly to frozen L2; ordinary files remain mapped.', '',
       '[Public APIs](../L3-symbols/public-api.md) · [Format](../L3-symbols/format-spec.md) · [Cookbook](cookbook.md) · [Scenarios](scenarios.md) · [Trust/scope](../V21-PROTOCOL.md)', '',
       '## Primary task routes', '',
       'The explicit engine/API routes above the retained local mechanisms are supplied in the task table below. Read a route\'s canonical contract before opening its listed files.', '',
       '<!-- PRIMARY-ROUTES -->', '', '## Retained production recipe and scenario routes', '']
records = []
archived = []
for name in ['cookbook', 'scenarios']:
    parts = re.split(r'(?m)^## (.+)\n', old[name])
    out = ['# ' + ('Secondary development cookbook' if name == 'cookbook' else 'Engine and storage scenarios'), '',
           '**Current V2.1 navigation guidance.** Choose a task, read its canonical contract, then follow the ordered source set. The source remains available. Frozen compatibility mechanisms are maintenance references, not foundations for new format features. Historical test/fixture/binary walkthroughs are archived and do not create new obligations.', '',
           '[Primary tasks and all reading routes](navigation-index.md) · [Public APIs](../L3-symbols/public-api.md) · [Build policy](build-and-test.md) · [Pitfalls](pitfalls.md)', '',
           '<!-- PRIMARY-SUMMARY -->', '']
    redirects = []
    for i in range(1, len(parts), 2):
        h, body = parts[i:i+2]
        selected = {}
        for path, aa, bb in ref.findall(body):
            e = by.get(path)
            if not e or e['status'] == 'excluded':
                continue
            a, b = int(aa), int(bb or aa)
            for lo, hi in e['included_ranges']:
                x, y = max(a, lo), min(b, hi)
                if x <= y:
                    ranges = selected.setdefault(path, [])
                    if (x, y) not in ranges:
                        ranges.append((x, y))
        excluded_title = re.search(r'fixture|benchmark|artifact|test-derived|historical acceptance|compatibility-byte|cache performance investigation|writer regression selection|file-read performance', h, re.I)
        if h == 'Recipe backlog':
            out += ['<a id="' + slug(h) + '"></a>', '', '## Core extension routes', '', 'The former backlog is now the primary task table in [navigation](navigation-index.md#primary-task-routes): encoding, index, operation, expression/pushdown, Python, Java, object-store and namespace changes.', '']
            records.append({'document': name, 'original_title': h, 'status': 'replaced by explicit primary routes'})
            continue
        if excluded_title or not selected:
            archived.append({'document': name, 'title': h, 'reason': 'historical test/fixture/binary/performance evidence, or no production source route'})
            redirects += ['<a id="' + slug(h) + '"></a>', 'Historical reference moved to [archive](../archive/crosscutting-093/' + name + '.md#' + slug(h) + ').', '']
            continue
        title = current_title(h)
        ident = ('recipe-' if name == 'cookbook' else 'scenario-') + str(i // 2 + 1).zfill(2)
        paths = list(selected)
        route_contract = contract(paths)
        out += ['<a id="' + slug(h) + '"></a>', '', '## ' + title, '',
                'Use the [ordered read set](navigation-index.md#' + ident + ') and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.', '']
        nav += ['<a id="' + ident + '"></a>', '', '### ' + title, '',
                '[' + ('Recipe' if name == 'cookbook' else 'Scenario') + '](' + name + '.md#' + slug(h) + ') · [Decision contract](' + route_contract + ')', '']
        sets = []
        for start in range(0, len(paths), 5):
            group = paths[start:start+5]
            if len(paths) > 5:
                nav += ['**Local subtask ' + str(start // 5 + 1) + ': ' + ', '.join(Path(p).stem for p in group) + '.** Select this set only when changing those mechanisms; the other sets are separate subproblems.', '']
            entries = []
            for j, path in enumerate(group, 1):
                e = by[path]
                # Consolidate overlapping citations but retain every distinct
                # production range; never include excluded inline tests.
                merged = []
                for a, b in sorted(selected[path]):
                    if merged and a <= merged[-1][1] + 1:
                        merged[-1][1] = max(b, merged[-1][1])
                    else:
                        merged.append([a, b])
                rs = ', '.join(f'{path}:{a}-{b}' for a, b in merged)
                l2 = e.get('l2_document')
                link = f'[frozen/Key File contract](../{l2})' if l2 and (P/l2).exists() else '[Module Map](../' + e['module_map']['document'] + '#' + e['module_map']['anchor'] + ')'
                nav.append(f'{j}. {link} → {rs}.')
                entries.append({'path': path, 'ranges': merged, 'evidence': l2 or e.get('module_map')})
            nav.append('')
            sets.append(entries)
        records.append({'document': name, 'original_title': h, 'current_title': title, 'anchor': ident, 'status': 'active', 'read_sets': sets})
    if redirects:
        out += ['## Historical link redirects', '', 'These links preserve old citations without treating excluded evidence as current guidance.', ''] + redirects
    (P / 'L4-crosscutting' / (name + '.md')).write_text('\n'.join(out) + '\n')

(P / 'L4-crosscutting/navigation-index.md').write_text('\n'.join(nav) + '\n')
(P / 'verification/iteration-093-navigation-coverage.json').write_text(json.dumps({'iteration': 93, 'source': 'retained KB source citations clipped to current production ranges', 'active_or_replaced': records, 'archived_excluded': archived, 'max_files_per_read_set': max(len(s) for r in records for s in r.get('read_sets', [])), 'semantic_source_reanalysis': False}, indent=2) + '\n')
print(json.dumps({'active_or_replaced': len(records), 'archived_excluded': len(archived)}, indent=2))
