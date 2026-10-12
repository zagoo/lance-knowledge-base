"""Count the user-approved production scope without executing Lance or reading binaries."""
import bisect
import collections
import hashlib
import json
import re
from pathlib import Path

ROOT = Path('/Users/renshaobin/Workspace/Develop/GitHub/lance')
OUT = Path('/Users/renshaobin/Workspace/Develop/GitHub/lance-knowledge-base')
ENGINE = {'lance', 'lance-core', 'lance-table', 'lance-file', 'lance-encoding',
          'lance-io', 'lance-index', 'lance-index-core', 'lance-datafusion',
          'lance-arrow', 'lance-select', 'lance-linalg'}
TEST_PART = re.compile(r'^(?:tests?|test_data|testdata|test_utils?|testing|fixtures?|benches|benchmarks?|ci_benchmarks|memtest|lance-testing|lance-test-macros|lance-datagen)$')
TEST_FILE = re.compile(r'^(?:test_.*|.*_tests?|bench_.*|.*_bench|conftest|testing|test_utils?|datagen)(?:\.[^.]+)$')
MECHANICAL = {
    'java/lance-jni/src/ffi.rs', 'java/lance-jni/src/traits.rs',
    'java/lance-jni/src/storage_options.rs',
    'java/src/main/java/org/lance/JniLoader.java',
    'java/src/main/java/org/lance/Utils.java',
    'java/src/main/java/org/lance/util/JsonFields.java',
    'java/src/main/java/org/lance/util/JsonUtils.java',
    'python/src/arrow.rs',
    'rust/lance-io/src/ffi.rs',
}
MECHANICAL_RANGES = {
    'python/src/utils.rs': [[45, 59, 'PyJson JSON marshalling boilerplate']],
    'java/lance-jni/src/utils.rs': [[582, 711, 'mechanical collection and boxed-value JNI marshalling']],
}
PERIPHERAL_FILES = {
    'python/python/lance/debug.py', 'python/python/lance/dependencies.py',
    'python/python/lance/download.py', 'python/python/lance/hf.py',
    'python/python/lance/log.py', 'python/python/lance/otel.py',
    'python/python/lance/progress.py', 'python/python/lance/tracing.py',
    'python/python/lance/namespace.py', 'python/python/lance/sampler.py',
    'python/python/lance/pydantic.py',
    'python/src/debug.rs', 'python/src/namespace.rs', 'python/src/otel.rs',
    'python/src/tracing.rs', 'java/lance-jni/src/namespace.rs',
    'java/lance-jni/src/otel.rs', 'java/lance-jni/src/index_progress.rs',
}


def classify(f):
    p = f['path']; parts = p.split('/'); name = parts[-1]
    if f['representation'] != 'utf8':
        return 'excluded', 'binary or symlink; no content inspection'
    if any(TEST_PART.match(x) for x in parts) or TEST_FILE.match(name) or f['classification'] == 'test':
        return 'excluded', 'tests, benchmarks or fixture setup'
    if f['classification'] == 'generated' or any(x in ('generated', 'vendor', 'third_party', 'node_modules', 'target') for x in parts):
        return 'excluded', 'generated/dependency artifact'
    if f['classification'] not in ('source', 'proto'):
        return 'context', 'non-source supporting material; no exhaustive analysis requirement'
    if p in MECHANICAL:
        return 'excluded', 'mechanical FFI or serialization helper; retain boundary signatures only when needed'
    if name == 'build.rs' or 'examples' in parts or 'bin' in parts:
        return 'summary', 'build plumbing, example or CLI; brief context only'
    if p in PERIPHERAL_FILES or p.startswith(('python/python/lance/torch/', 'java/src/main/java/org/lance/namespace/', 'java/src/main/java/org/lance/otel/')):
        return 'summary', 'peripheral integration or observability; brief context only'
    if p.startswith('rust/lance-linalg/src/simd'):
        return 'summary', 'platform-specific SIMD implementation; preserve dispatch/contract context only'
    if p.endswith('.proto'):
        return 'core', 'handwritten on-disk/wire schema, not generated protobuf output'
    if len(parts) >= 4 and parts[0] == 'rust' and parts[1] in ENGINE and parts[2] == 'src':
        return 'core', 'core engine production implementation'
    if p.startswith(('python/python/lance/', 'python/src/', 'java/src/main/java/org/lance/', 'java/lance-jni/src/')):
        return 'core', 'public API or handwritten API-to-engine adapter'
    return 'summary', 'peripheral utility, integration or tooling; brief contract summary only'


def mask_rust(s):
    """Preserve offsets/newlines; mask comments and literals before balancing delimiters."""
    a = list(s); n = len(s); i = 0
    def erase(lo, hi):
        for j in range(lo, hi):
            if a[j] != '\n': a[j] = ' '
    while i < n:
        if s.startswith('//', i):
            j = s.find('\n', i); j = n if j < 0 else j
            erase(i, j); i = j; continue
        if s.startswith('/*', i):
            j = i + 2; depth = 1
            while j < n and depth:
                if s.startswith('/*', j): depth += 1; j += 2
                elif s.startswith('*/', j): depth -= 1; j += 2
                else: j += 1
            if depth: raise ValueError('unclosed block comment')
            erase(i, j); i = j; continue
        raw = re.match(r'(?:br|cr|r)(#+)?"', s[i:]) if s[i] in 'bcr' else None
        if raw and (i == 0 or not (s[i-1].isalnum() or s[i-1] == '_')):
            terminator = '"' + (raw[1] or '')
            j = s.find(terminator, i + len(raw[0]))
            if j < 0: raise ValueError('unclosed raw string')
            j += len(terminator); erase(i, j); i = j; continue
        if s[i] == '"':
            j = i + 1
            while j < n:
                if s[j] == '\\': j += 2
                elif s[j] == '"': j += 1; break
                else: j += 1
            erase(i, j); i = j; continue
        if s[i] == "'":
            char = re.match(r"'(?:\\(?:u\{[0-9a-fA-F_]+\}|x[0-9a-fA-F]{2}|.)|[^'\\\n])'", s[i:])
            if char:
                j = i + len(char[0]); erase(i, j); i = j; continue
        i += 1
    return ''.join(a)


def cfg_without_tests(expr):
    """Three-valued cfg evaluation: only definitely test-only items are removed."""
    tokens = re.findall(r'"(?:\\.|[^"\\])*"|[A-Za-z_]\w*|[(),=]', expr)
    pos = 0
    def parse():
        nonlocal pos
        if pos >= len(tokens): return None
        name = tokens[pos]; pos += 1
        if pos < len(tokens) and tokens[pos] == '(':
            pos += 1; vals = []
            while pos < len(tokens) and tokens[pos] != ')':
                vals.append(parse())
                if pos < len(tokens) and tokens[pos] == ',': pos += 1
            pos += 1
            if name == 'not': return None if not vals or vals[0] is None else not vals[0]
            if name == 'all': return False if False in vals else (True if all(x is True for x in vals) else None)
            if name == 'any': return True if True in vals else (False if all(x is False for x in vals) else None)
            return None
        if pos < len(tokens) and tokens[pos] == '=':
            pos += 1; value = tokens[pos] if pos < len(tokens) else ''; pos += 1
            if name == 'feature' and value.strip('"') in ('test', 'test-utils', 'test_utils', 'testing', 'benches', 'benchmarks'):
                return False
            return None
        return False if name in ('test', 'bench') else None
    return parse()


def excluded_rust_ranges(s):
    masked = mask_rust(s)
    pairs = {}; stack = []; expected = {')': '(', ']': '[', '}': '{'}
    for i, c in enumerate(masked):
        if c in '([{': stack.append((c, i))
        elif c in ')]}':
            if not stack or stack[-1][0] != expected[c]:
                raise ValueError(f'unbalanced delimiter at offset {i}')
            _, lo = stack.pop(); pairs[lo] = i
    if stack: raise ValueError(f'unclosed delimiter at offset {stack[-1][1]}')
    line_starts = [0] + [m.end() for m in re.finditer('\n', s)]
    def line(p): return bisect.bisect_right(line_starts, p)
    def whitespace(p):
        while p < len(masked) and masked[p].isspace(): p += 1
        return p
    ranges = []; cursor = 0
    for m in re.finditer(r'#\s*!?\[', masked):
        if m.start() < cursor: continue
        start = m.start(); attrs = []; i = start
        while True:
            attr = re.match(r'#\s*(!?)\[', masked[i:])
            if not attr: break
            lo = i + len(attr[0]) - 1; hi = pairs[lo]
            attrs.append((s[lo+1:hi], bool(attr[1]))); i = whitespace(hi+1)
        cursor = i
        is_test = False
        for text, inner in attrs:
            compact = re.sub(r'\s+', '', text)
            cfg = re.fullmatch(r'cfg\((.*)\)', text.strip(), re.S)
            test_attr = re.match(r'(?:(?:tokio|async_std)::)?(?:test|bench)(?:\(|$)', compact) or compact.startswith(('rstest', 'test_case', 'test_matrix'))
            if (cfg and cfg_without_tests(cfg[1]) is False) or test_attr:
                is_test = True
        if not is_test: continue
        if any(inner for _, inner in attrs):
            ranges.append([1, len(s.splitlines()), 'file-level test-only cfg']); break
        end = None; j = i
        while j < len(masked):
            c = masked[j]
            if c in '([': j = pairs[j] + 1; continue
            if c == '{':
                end = pairs[j] + 1
                if end < len(masked) and masked[end] == ';': end += 1
                break
            if c == ';': end = j + 1; break
            j += 1
        if end is None: raise ValueError(f'cannot bound test item at line {line(start)}')
        ranges.append([line(start), line(end-1), 'test-only cfg or test/benchmark attribute'])
        cursor = end
    return ranges


def runs(values):
    result = []
    for n in sorted(values):
        if result and n == result[-1][1] + 1: result[-1][1] = n
        else: result.append([n, n])
    return result


def main():
    current = OUT / 'CORE-MANIFEST.json'
    if current.exists() and json.loads(current.read_text()).get('schema_version') == '2.1':
        raise SystemExit('V2.1 supersedes line-count scope rebuilding. Use the single navigation ledger; do not regenerate MANIFEST.json.')
    old = json.loads((OUT / 'MANIFEST.json').read_text())
    entries = []; errors = []; drift = []; removed = 0
    for f in old['files']:
        level, reason = classify(f)
        e = {'path': f['path'], 'tier': level, 'reason': reason,
             'original_lines': f['line_count'], 'original_classification': f['classification'],
             'historical_status': f['status'], 'included_lines': 0,
             'included_ranges': [], 'excluded_ranges': [], 'completed_lines': 0}
        if level in ('core', 'summary'):
            raw = (ROOT / f['path']).read_bytes()
            digest = hashlib.sha256(raw).hexdigest()
            if digest != f['sha256']: drift.append(f['path'])
            s = raw.decode('utf8'); e['sha256'] = digest
            # Only explicit file-header generation markers count, never incidental prose.
            header = '\n'.join(s.splitlines()[:12])
            if re.search(r'(?im)^\s*(?://|#|/\*|\*)\s*(?:@generated\b|.*(?:automatically generated|generated (?:by|with).*(?:protoc|prost|bindgen)|DO NOT EDIT))', header):
                e.update(tier='excluded', reason='explicit generated-file header')
                entries.append(e); continue
            ex = []
            if f['path'].endswith('.rs'):
                try: ex = excluded_rust_ranges(s)
                except ValueError as err: errors.append({'path': f['path'], 'error': str(err)})
            test_lines = {n for a, b, _ in ex for n in range(a, b+1)}
            ex += MECHANICAL_RANGES.get(f['path'], [])
            excluded = {n for a, b, _ in ex for n in range(a, b+1)}
            included = set(range(1, (f['line_count'] or 0)+1)) - excluded
            e['excluded_ranges'] = ex
            e['included_ranges'] = runs(included)
            e['included_lines'] = len(included)
            e['completed_lines'] = len(included) if f['status'] == 'analyzed' else 0
            e['core_status'] = 'analyzed' if f['status'] == 'analyzed' else 'pending'
            if level == 'core': removed += len(test_lines)
            if not included: e.update(tier='excluded', reason='entire file is test-only')
        entries.append(e)
    groups = collections.defaultdict(lambda: {'files': 0, 'lines': 0, 'completed_files': 0, 'completed_lines': 0})
    for e in entries:
        if e['tier'] != 'core': continue
        p = e['path']; k = '/'.join(p.split('/')[:2]) if p.startswith('rust/') else ('python' if p.startswith('python/') else 'java' if p.startswith('java/') else 'protos')
        g = groups[k]; g['files'] += 1; g['lines'] += e['included_lines']
        g['completed_lines'] += e['completed_lines']
        g['completed_files'] += e['core_status'] == 'analyzed'
    totals = {k: sum(v[k] for v in groups.values()) for k in ('files', 'lines', 'completed_files', 'completed_lines')}
    totals['remaining_files'] = totals['files'] - totals['completed_files']
    totals['remaining_lines'] = totals['lines'] - totals['completed_lines']
    totals['embedded_test_lines_removed_from_core_candidates'] = removed
    totals['tiers'] = dict(collections.Counter(e['tier'] for e in entries))
    totals['source_classified_core_lines'] = sum(e['included_lines'] for e in entries if e['tier']=='core' and e['original_classification']=='source')
    report = {'schema_version': 1, 'scope': 'core-only-production-v1', 'authority': 'User scope revision, 2026-10-04',
              'snapshot': old['snapshot'], 'method': 'Original physical line numbers retained; test-only Rust items removed by comment/literal-aware delimiter scan and three-valued cfg evaluation. Comments, blank lines and API documentation remain. This is scope counting, not semantic analysis.',
              'rules': {'engine_crates': sorted(ENGINE), 'mechanical_helpers_excluded': sorted(MECHANICAL), 'mechanical_ranges_excluded': MECHANICAL_RANGES, 'peripheral_files_summary_only': sorted(PERIPHERAL_FILES)},
              'totals': totals, 'groups': dict(sorted(groups.items())), 'parser_errors': errors, 'source_drift': drift, 'files': entries}
    (OUT / 'CORE-MANIFEST.json').write_text(json.dumps(report, indent=2)+'\n')
    print(json.dumps({k: report[k] for k in ('totals', 'groups', 'parser_errors', 'source_drift')}, indent=2))
    if errors or drift: raise SystemExit(1)


if __name__ == '__main__': main()
