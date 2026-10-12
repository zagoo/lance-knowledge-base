"""Delta checks for V2.1; never reads source implementation or binary contents."""
import argparse
import hashlib
import json
import re
from urllib.parse import unquote
from pathlib import Path
from datetime import datetime, timezone

P=Path('/Users/renshaobin/Workspace/Develop/GitHub/lance-knowledge-base')


def unfenced(text):
    out=[];fence=None
    for line in text.splitlines():
        m=re.match(r'^\s*(`{3,}|~{3,})',line)
        if m:
            if fence is None:fence=(m[1][0],len(m[1]))
            elif m[1][0]==fence[0] and len(m[1])>=fence[1]:fence=None
        elif fence is None:out.append(line)
    return '\n'.join(out)


def sha(data):return hashlib.sha256(data).hexdigest()


def main():
    ap=argparse.ArgumentParser();ap.add_argument('iteration',type=int);ap.add_argument('--changes',required=True);args=ap.parse_args()
    manifest=json.loads((P/'CORE-MANIFEST.json').read_text())
    assert manifest['schema_version']=='2.1'
    record=json.loads((P/args.changes).read_text());changed=set(record['changed_artifacts'])
    issues=[];links=0;citations=0;checked=[]
    by={f['path']:f for f in manifest['files']}
    if len(by)!=len(manifest['files']):issues.append('duplicate ledger paths')
    status_counts={'excluded':0,'key-file':0,'mapped':0,'unclassified':0}
    for e in manifest['files']:
        status=e['status'];status_counts[status or 'unclassified']+=1
        if status=='excluded' and not e.get('exclusion_reason'):issues.append('missing exclusion reason: '+e['path'])
        if status=='key-file' and not (P/e['l2_document']).is_file():issues.append('missing deep L2: '+e['path'])
        if status=='mapped':
            ref=e.get('module_map')
            doc=ref.get('document') if isinstance(ref,dict) else ref
            if not doc or not (P/doc).is_file():issues.append('missing Module Map: '+e['path'])
            elif isinstance(ref,dict):
                map_body=(P/doc).read_text()
                if e['path'] not in map_body:issues.append('file absent from Module Map: '+e['path'])
                if ref.get('anchor') and 'id="'+ref['anchor']+'"' not in map_body:issues.append('missing map anchor: '+e['path'])
                if not e['path'].startswith(ref.get('directory','')):issues.append('map directory mismatch: '+e['path'])
        if status not in (None,'excluded','key-file','mapped'):issues.append('invalid status: '+e['path'])
    if (P/'MANIFEST.json').exists():issues.append('parallel live MANIFEST.json still exists')
    expected_totals={'files':len(by),'excluded':status_counts['excluded'],'key_file':status_counts['key-file'],'mapped':status_counts['mapped'],'unclassified':status_counts['unclassified'],'non_excluded':len(by)-status_counts['excluded']}
    for key,value in expected_totals.items():
        if manifest['totals'].get(key)!=value:issues.append('stored ledger total mismatch: '+key)
    source_ref=re.compile(r'(?<![\w/])((?:rust|python|java|protos|docs)/[\w.\/-]+\.(?:rs|proto|md|toml|py|java|txt|yml|yaml|json|sh)|AGENTS\.md):(\d+)(?:-(\d+))?')
    for name in sorted(changed):
        file=P/name
        if not file.is_file():issues.append('changed artifact missing: '+name);continue
        if file.suffix!='.md':continue
        checked.append(name);text=unfenced(file.read_text())
        for m in re.finditer(r'(?<!!)\[[^\]]+\]\(([^)]+)\)',text):
            target=m[1]
            if target.startswith(('http:','https:','mailto:','app:','codex:')):continue
            pathname=target.split('#')[0]
            links+=1
            destination=(file.parent/pathname).resolve() if pathname else file.resolve()
            if not destination.exists():issues.append({'document':name,'broken_link':target})
            elif '#' in target and destination.suffix=='.md':
                fragment=unquote(target.split('#',1)[1]);body=destination.read_text();anchors=set(re.findall(r'id=["\']([^"\']+)',body));seen={}
                for heading in re.findall(r'^#{1,6} (.+)$',body,re.M):
                    slug=re.sub(r'[^\w -]','',heading.lower()).replace(' ','-');count=seen.get(slug,0);seen[slug]=count+1;anchors.add(slug+('-'+str(count) if count else ''))
                if fragment and fragment not in anchors:issues.append({'document':name,'broken_anchor':target})
        for m in source_ref.finditer(text):
            citations+=1;e=by.get(m[1]);a=int(m[2]);b=int(m[3] or m[2]);limit=e.get('source',{}).get('line_count') if e else None
            if e is None or limit is None or a<1 or b<a or b>limit:issues.append({'document':name,'invalid_citation':m[0]})
    registry=json.loads((P/'verification/frozen-snapshot-085.json').read_text());frozen_checked=0
    for item in registry['documents']:
        if item['document'] not in changed:continue
        raw=(P/item['document']).read_bytes();body=raw.split(b'\n\n',1)[1]
        if sha(body)!=item['body_sha256']:issues.append('frozen body changed: '+item['document'])
        frozen_checked+=1
    if args.iteration==86:
        idx=registry['machine_symbol_index']
        if sha((P/idx['path']).read_bytes())!=idx['sha256']:issues.append('frozen machine symbol catalog changed')
    nonexcluded=len(by)-status_counts['excluded'];covered=status_counts['key-file']+status_counts['mapped']
    result={'iteration':args.iteration,'protocol':'2.1','phase':'VERIFY','kind':'delta','at':datetime.now(timezone.utc).isoformat(),'changed_markdown_documents_checked':len(checked),'links_checked':links,'citation_ranges_checked_against_ledger':citations,'source_claims_reaudited':0,'frozen_bodies_checked_because_marked_this_iteration':frozen_checked,'ledger_status_counts':status_counts,'ledger_100_percent':status_counts['unclassified']==0,'non_excluded_coverage_percent':100*covered/nonexcluded,'issues':issues,'delta_pass':not issues,'full_milestone_verification_performed':False,'scope':'Changed artifacts only. Citation checks use stored source metadata; no source implementations or binary content reopened.'}
    destination=P/'verification'/f'iteration-{args.iteration:03}-delta-v21.json';destination.write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps(result,indent=2))
    if issues:raise SystemExit(1)


if __name__=='__main__':main()
