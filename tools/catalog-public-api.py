"""Build declaration navigation for contracts; never modify the frozen symbol catalog.

Python uses AST declarations, not execution. Rust is a declaration locator, not a
reachability/type checker. Source documentation is labeled separately from verified
behavior. All inputs are production ranges from the authoritative ledger.
"""
import ast
import json
import re
from pathlib import Path

P = Path('/Users/renshaobin/Workspace/Develop/GitHub/lance-knowledge-base')
M = json.loads((P / 'CORE-MANIFEST.json').read_text())
ROOT = Path(M['repository'])
OUT = P / 'L3-symbols' / 'api-reference'
OUT.mkdir(exist_ok=True)


def cell(s):
    s = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', s)
    s = s.replace('|', '\\|').replace('<', '&lt;').replace('>', '&gt;')
    return re.sub(r'\s+', ' ', s).strip()


def included(e, line):
    return any(a <= line <= b for a, b in e['included_ranges'])


def paragraph(doc):
    if not doc:
        return 'No standalone documentation summary; use the family contract and source entry.'
    first = re.split(r'\n\s*\n', doc.strip())[0]
    return cell(first)


def rust_doc(lines, pos):
    collected = []
    for s in reversed(lines[:pos]):
        t = s.strip()
        if t.startswith('///'):
            collected.append(t[3:].lstrip())
        elif not t or t.startswith('#['):
            if collected:
                break
        else:
            break
    return paragraph('\n'.join(reversed(collected)))


def rust_rows(e, text):
    lines = text.splitlines()
    # Public declarations, re-exports and fields. Restricted pub(crate/super)
    # items are intentionally omitted from the public declaration catalog.
    pattern = re.compile(r'^\s*pub\s+(?:(?:async|unsafe|const|extern\s+"[^\"]*")\s+)*(?:(?:fn|struct|enum|trait|type|mod|use|static)\b|(?:const)\b|[A-Za-z_]\w*\s*:)')
    for i, s in enumerate(lines):
        if not included(e, i + 1) or not pattern.search(s):
            continue
        sig = s.strip()
        end = i + 1
        # Capture the declaration header only, not implementation. Its source
        # entry remains authoritative for body and multi-line type details.
        while not any(c in sig for c in ['{', ';']) and not re.match(r'^pub\s+\w+\s*:', sig) and end < len(lines) and end < i + 35:
            if not included(e, end + 1):
                break
            sig += ' ' + lines[end].strip()
            end += 1
        sig = sig.split('{', 1)[0].rstrip()
        yield cell(sig), i + 1, end, rust_doc(lines, i)


def python_rows(e, text):
    tree = ast.parse(text)

    def walk(body, parent=''):
        for n in body:
            if not isinstance(n, (ast.ClassDef, ast.FunctionDef, ast.AsyncFunctionDef)):
                continue
            if (n.name.startswith('_') and n.name != '__init__') or not included(e, n.lineno):
                continue
            name = parent + n.name
            if isinstance(n, ast.ClassDef):
                sig = 'class ' + name + '(' + ', '.join(ast.unparse(x) for x in n.bases) + ')'
            else:
                sig = name + '(' + ast.unparse(n.args) + ')'
                if n.returns:
                    sig += ' -> ' + ast.unparse(n.returns)
            yield cell(sig), n.lineno, n.end_lineno, paragraph(ast.get_docstring(n))
            if isinstance(n, ast.ClassDef):
                yield from walk(n.body, name + '.')
    yield from walk(tree.body)


groups = {n: [] for n in ['lance', 'lance-index', 'lance-index-core', 'lance-io', 'lance-datafusion', 'python']}
stats = {}
for e in M['files']:
    path = e['path']
    if e['status'] == 'excluded':
        continue
    group = None
    for name in groups:
        if name != 'python' and path.startswith('rust/' + name + '/src/') and path.endswith('.rs'):
            group = name
    if path.startswith('python/python/lance/') and path.endswith('.py'):
        group = 'python'
    if not group:
        continue
    text = (ROOT / path).read_text()
    rows = list(python_rows(e, text) if group == 'python' else rust_rows(e, text))
    if rows:
        groups[group].append((e, rows))

for name, files in groups.items():
    module = 'python' if name == 'python' else 'rust-lance-index' if name == 'lance-index-core' else 'rust-' + name
    out = [f'# {name}: public declaration and documented-contract directory', '',
           '**Trust: declared source interface; body behavior is verified only where the linked family/protocol contract says so.** This catalog supplies exact argument/type entry points and the source author\'s first documentation paragraph. It is not an inferred call graph or a second symbol ledger. Rust `pub` can occur under a private/feature-gated module; confirm re-export and cfg boundaries before changing an external API. Trait method contracts and enum variants are reached through the trait/type entry. Python inherited external-library APIs are outside direct-source scope.', '',
           f'[Family contracts](../public-api.md) · [Module Map](../../L1-modules/{module}.md) · [Scope](../../V21-PROTOCOL.md)', '']
    if name == 'python':
        root_path = 'python/python/lance/__init__.py'
        root_ast = ast.parse((ROOT / root_path).read_text())
        exports = next(ast.literal_eval(n.value) for n in root_ast.body if isinstance(n, ast.Assign) and any(isinstance(t, ast.Name) and t.id == '__all__' for t in n.targets))
        out += ['## Explicit root exports', '', ', '.join('`' + x + '`' for x in exports) + '.', '', root_path + ':81-134. Imported root attributes not in __all__ can also be reachable; this is the explicit export list, not Python runtime introspection.', '']
    count = 0
    for e, rows in sorted(files, key=lambda v: v[0]['path']):
        path = e['path']
        anchor = 'source-' + re.sub(r'[^a-z0-9]+', '-', path.lower()).strip('-')
        out += [f'<a id="{anchor}"></a>', '', f'## `{path}`', '',
                '| Declaration / normalized Python signature | Source range | Declared contract summary |', '|---|---|---|']
        for sig, a, b, doc in rows:
            sig = sig.replace('`', '\\`')
            out.append(f'| `{sig}` | {path}:{a}-{b} | {doc} |')
            count += 1
        out.append('')
    stats[name] = {'source_files_with_declarations': len(files), 'declaration_entries': count}
    (OUT / (name + '.md')).write_text('\n'.join(out) + '\n')
(P / 'verification' / 'iteration-092-api-directory.json').write_text(json.dumps({
    'iteration': 92, 'mode': 'production declaration navigation', 'groups': stats,
    'frozen_symbol_catalog_changed': False, 'body_analysis_claimed': False,
    'rust_limit': 'lexical public entries, not compiler export reachability; trait members/enum variants live at owner entry',
    'python_limit': 'local public classes/functions/methods plus constructors; not inherited external APIs',
}, indent=2) + '\n')
print(json.dumps(stats, indent=2))
