from pathlib import Path
import json,re,hashlib
P=Path('/Users/renshaobin/Workspace/Develop/GitHub/lance-knowledge-base');R=P/'verification/refresh-db684d1f';S=P.parent/'lance'
entries={e['path']:e for e in json.loads((P/'CORE-MANIFEST.json').read_text())['files']};cache={}
def lines(p):
 if p not in cache:cache[p]=(S/p).read_text().splitlines()
 return cache[p]
def readref(ref):
 p,r=ref.split(':');a=[]
 for part in r.split(','):
  lo,hi=int(part.split('-')[0]),int(part.split('-')[-1]);assert 1<=lo<=hi<=len(lines(p)),ref
  # Tests are never part of source confirmation; preserve only included production intervals.
  inc=entries[p]['included_ranges']
  for i in range(lo,hi+1):
   if any(x<=i<=y for x,y,*_ in inc):a.append(f'{i}: {lines(p)[i-1]}')
 return '\n'.join(a)
plan=json.loads((R/'navigation-plan.json').read_text());out=[]
for task in plan['tasks']:
 checks=[]
 for rs in task['ordered_read_sets']:
  for ref in rs:
   text=readref(ref);decls=[l for l in text.splitlines() if re.search(r'\b(?:fn|class|def|trait|struct|enum|message)\s+\w+',l)][:12]
   checks.append({'citation':ref,'production_excerpt_sha256':hashlib.sha256(text.encode()).hexdigest(),'declarations':decls,'first_production_lines':text.splitlines()[:3],'range_valid':True})
 out.append({'id':task['id'],'task':task['task'],'checks':checks,'semantic_confirmation':'pending'})
(R/'navigation-source.json').write_text(json.dumps({'method':'Source opened after KB-only plan; test blocks omitted using ledger production intervals. Declaration and range evidence stored per read set.','tasks':out},indent=2)+'\n')
sel=json.loads((R/'accuracy-selection.json').read_text());claims=[]
for c in sel['claims']:
 evidence=[{'citation':r,'production_source':readref(r)} for r in c['citations']]
 claims.append({**c,'source_evidence':evidence,'pass':None})
(R/'accuracy.json').write_text(json.dumps({'seed':sel['seed'],'claims':claims,'repairs':[]},indent=2)+'\n')
# Open all source ranges supporting current contract answers, without feeding tests to the review.
body=(P/'L3-symbols/refresh-2026-10-09.md').read_text();pat=re.compile(r'(?:rust|python|java|protos)/[\w./-]+\.(?:rs|py|java|proto):\d+(?:-\d+)?(?:,\d+(?:-\d+)?)*')
refs=list(dict.fromkeys(pat.findall(body)))
(R/'contract-source.json').write_text(json.dumps({'opened_after':'contract-answers.md','citations':[{'citation':r,'production_source':readref(r)} for r in refs],'pass':None},indent=2)+'\n')
print('Opened',sum(len(t['checks']) for t in out),'navigation pointers;',len(claims),'sample claims;',len(refs),'contract references')
# Compact route declaration audit. Missing declarations are acceptable for short expression/call-site routes, reviewed below.
for t in out:
 print(t['id'],t['task'])
 for x in t['checks']:
  if x['citation'].split(':')[0] in plan['tasks'][out.index(t)]['affected_paths']:
   print(' ',x['citation'],' | '.join(x['declarations'][:3] or x['first_production_lines'][:1]))
