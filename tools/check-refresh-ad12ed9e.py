"""Scoped refresh navigation/accuracy evidence. Never executes Lance code."""
from pathlib import Path
import json,re,hashlib,sys
P=Path(__file__).resolve().parents[1];R=P/'verification/refresh-ad12ed9e';m=json.loads((P/'CORE-MANIFEST.json').read_text());by={e['path']:e for e in m['files']};S=Path(m['repository'])
def open_ranges(path,spans):
 e=by[path];assert e['status']!='excluded';lines=(S/path).read_text().splitlines();out=[]
 for a,b in spans:
  assert 1<=a<=b<=len(lines),(path,a,b,len(lines))
  for n in range(a,b+1):
   if any(lo<=n<=hi for lo,hi in e['included_ranges']):out.append((n,lines[n-1]))
 assert out
 return out
def spans(s):return [(int(x.split('-')[0]),int(x.split('-')[-1])) for x in s.split(',')]
if sys.argv[1]=='navigation':
 plan=json.loads((R/'navigation-plan.json').read_text());seen={}
 for t in plan['tasks']:
  print('\nTASK',t['id'],t['task'])
  for group in t['ordered_read_sets']:
   assert len({x.rsplit(':',1)[0] for x in group})<=5
   for ref in group:
    if ref in seen:print('Already confirmed source span',ref);continue
    path,rs=ref.rsplit(':',1);rows=open_ranges(path,spans(rs));heads=[]
    for a,b in spans(rs):
     chunk=[x for x in rows if a<=x[0]<=b];matches=[x for x in chunk if re.search(r'\b(fn |pub |public |class |need_delay_checkout|load_version|checkout_version|collect_statistics|getRef|setRef|reference =|self\.version)',x[1])]
     heads.extend((matches or chunk)[:4])
    seen[ref]={'source':ref,'opened_lines':len(rows),'range_sha256':hashlib.sha256(str(rows).encode()).hexdigest(),'anchors':heads}
    print(ref)
    for n,s in heads:print(f' {n}: {s}')
 (R/'navigation-source.json').write_text(json.dumps({'plan_sha256':hashlib.sha256((R/'navigation-plan.json').read_bytes()).hexdigest(),'source_opened_after_plan':True,'entries':list(seen.values()),'manual_verdict_required':True},indent=2)+'\n')
elif sys.argv[1]=='accuracy':
 f=R/'accuracy.json';j=json.loads(f.read_text());lo=int(sys.argv[2]);hi=int(sys.argv[3])
 for c in j['claims']:
  if not lo<=c['id']<=hi:continue
  # Recover all same-path comma-separated ranges from the selected claim.
  pat=re.escape(c['source'])+r':(\d+(?:-\d+)?(?:,\d+(?:-\d+)?)*)';rs=re.search(pat,c['claim'])[1];rows=open_ranges(c['source'],spans(rs));print('\nCLAIM',c['id'],c['claim'])
  for n,s in rows:print(f'{n}: {s}')
  c['source_opened']=True;c['opened_ranges']=spans(rs);c['range_sha256']=hashlib.sha256(str(rows).encode()).hexdigest()
 f.write_text(json.dumps(j,indent=2)+'\n')
