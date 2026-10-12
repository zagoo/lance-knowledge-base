"""One-time citation migration. Frozen bodies are never modified."""
from pathlib import Path
import json,re,os,subprocess,hashlib,collections
P=Path(__file__).resolve().parents[1];S=Path('/Users/renshaobin/Workspace/Develop/GitHub/lance');R=P/'verification/refresh-011953c2';OLD='4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9';NEW='011953c22097b67b699595adbe99e7f0155d83e4'
m=json.loads((P/'CORE-MANIFEST.json').read_text());assert m['snapshot']['commit']==OLD
scope=json.loads((R/'scope.json').read_text());maps=json.loads((R/'line-map.json').read_text())['files'];rr=json.loads((R/'new-ranges.json').read_text());by={e['path']:e for e in m['files']};registry=json.loads((P/'verification/frozen-snapshot-085.json').read_text());frozen={x['document'] for x in registry['documents']};backup={};changed=[];rewrites=[];frozenrefs=[]
for n in ['CORE-MANIFEST.json','COMPLETION-REPORT.md','REFRESH-REPORT.md','README.md','iteration-state.json']:
 (R/(n if n.endswith('.json') else n.replace('.md','.txt'))).write_text((P/n).read_text())
# Compose frozen coordinates directly from the original snapshot, not the previous refresh.
frozenmaps={}
for path in maps:
 hs=[]
 for a,ac,b,bc in re.findall(r'^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@',subprocess.check_output(['git','diff','--unified=0',registry['source_snapshot']+'..'+NEW,'--',path],cwd=S).decode(),re.M):
  hs.append({'old_start':int(a),'old_count':int(ac or 1),'new_start':int(b),'new_count':int(bc or 1)})
 frozenmaps[path]={'hunks':hs}
def save(n,s):
 f=P/n;old=f.read_text() if f.exists() else None
 if old==s:return
 if old is not None:backup.setdefault(n,old)
 f.parent.mkdir(parents=True,exist_ok=True);f.write_text(s);changed.append(n)
 (R/'before-documents.json').write_text(json.dumps(backup)+'\n')
def position(path,x,end=False):
 delta=0
 for h in maps[path]['hunks']:
  a,n,b,k=h['old_start'],h['old_count'],h['new_start'],h['new_count']
  if n==0:
   if x<=a:return x+delta
   delta+=k;continue
  if x<a:return x+delta
  if x<a+n:return max(1,b+k-1 if end and k else b)
  delta+=k-n
 return x+delta
def translate(path,ranges):
 out=[]
 for rs in ranges.split(','):
  a,b=int(rs.split('-')[0]),int(rs.split('-')[-1]);aa=position(path,a);bb=max(aa,position(path,b,True));out.append(str(aa) if '-' not in rs and aa==bb else f'{aa}-{bb}')
 return ','.join(out)
paths=set(maps);pat=re.compile(r'(?<![\w/])('+ '|'.join(re.escape(p) for p in sorted(paths,key=len,reverse=True))+r'):(\d+(?:-\d+)?(?:,\d+(?:-\d+)?)*)')
contract='L3-symbols/refresh-2026-10-12.md';addendum='refresh-addenda/2026-10-12-011953c2.md'
for f in sorted(P.rglob('*.md')):
 name=str(f.relative_to(P));body=f.read_text()
 if name.startswith(('archive/','verification/','refresh-addenda/')) or '/archive/' in name or body.startswith('> **Historical archive') or name in ['verification-log.md','COMPLETION-REPORT.md','REFRESH-REPORT.md','README.md']:continue
 orig=body;affected={x[1] for x in pat.finditer(body)}
 if name in frozen:
  currentmaps=maps;maps=frozenmaps
  for x in pat.finditer(body):
   new=translate(x[1],x[2])
   if new!=x[2]:frozenrefs.append({'document':name,'path':x[1],'old_ranges':x[2],'new_ranges':new})
  maps=currentmaps
  own=next((c['path'] for c in scope['files'] if c['classification']=='key-file' and by[c['path']]['l2_document']==name),None)
  if affected or own:
   head,rest=body.split('\n\n',1);rel=os.path.relpath(P/addendum,f.parent);save(name,head+f' Refresh 2026-10-12: [current coordinates and changed contracts]({rel}) at `{NEW}` supersede affected historical statements; body remains frozen.\n\n'+rest)
  continue
 def fix(x):
  new=translate(x[1],x[2])
  if new!=x[2]:rewrites.append({'document':name,'path':x[1],'old_ranges':x[2],'new_ranges':new})
  return x[1]+':'+new
 body=pat.sub(fix,body)
 for path in paths:
  table=re.compile(r'(\| `'+re.escape(path)+r'` \| )([\d, -]+)( \|)')
  if table.search(body):affected.add(path);body=table.sub(lambda x:x[1]+', '.join(f'{a}-{b}' for a,b in rr[path]['included_ranges'])+x[3],body)
  prose=re.compile(r'(`'+re.escape(path)+r'` — read `)([\d,-]+)(`)');body=prose.sub(lambda x:x[1]+translate(path,x[2])+x[3],body)
  if name==by.get(path,{}).get('l2_document'):
   body=re.sub(r'(Verified entry/protocol ranges: `)([\d,-]+)(`)',lambda x:x[1]+translate(path,x[2])+x[3],body);affected.add(path)
 if affected:
  rel=os.path.relpath(P/contract,f.parent);first,rest=body.split('\n',1);body=first+f'\n\n> Refresh 2026-10-12, `{NEW}`: source coordinates updated. [Changed contracts]({rel}) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.\n'+rest;save(name,body)

newkeys=set()
numstat={}
for row in subprocess.check_output(['git','diff','--numstat',OLD+'..'+NEW],cwd=S,text=True).splitlines():
 a,d,p=row.split('\t');numstat[p]=(a,d)
newfiles=[]
for c in scope['files']:
 path=c['path'];e=by.get(path)
 if c['git_status']=='D':
  m['files'].remove(e);by.pop(path);c['final_classification']=e['status'];c['disposition']='removed from current ledger; historical pointers remain commit-pinned';continue
 if e is None:
  status='key-file' if path in newkeys else c['classification']
  parent=path.rsplit('/',1)[0];anchor=parent.replace('/','-').replace('_','-')
  e={'path':path,'status':status,'coverage_mode':'contract-verified-key-ranges' if status=='key-file' else status,'module_map':None if status=='excluded' else {'document':('L1-modules/java.md' if path.startswith('java/') else 'L1-modules/'+ '-'.join(path.split('/')[:2])+'.md'),'anchor':anchor,'directory':parent+'/'},'l2_document':'L2-files/'+path+'.md' if status=='key-file' else None,'exclusion_reason':('non-source supporting material; no exhaustive analysis requirement' if path.startswith('docs/') else ('non-source supporting material; no exhaustive analysis requirement' if path.endswith(('.toml','.md')) else 'tests, benchmarks or fixture setup')) if status=='excluded' else None,'source':{},'included_ranges':[],'excluded_ranges':[],'prior_tier':'excluded' if status=='excluded' else 'core'}
  if status!='excluded':newfiles.append(e)
  m['files'].append(e);by[path]=e
 if path in rr:
  e['source'].update({k:v for k,v in rr[path].items() if k not in ['included_ranges','excluded_ranges']});e['source'].setdefault('classification','source');e['source'].setdefault('representation','utf8');e['included_ranges']=rr[path]['included_ranges'];e['excluded_ranges']=rr[path]['excluded_ranges']
  if e.get('verified_ranges'):e['verified_ranges']=translate(path,e['verified_ranges'])
  if e.get('l2_document') in frozen:e['frozen_addendum']=addendum
 else:
  a,d=numstat[path];base=e['source'].get('line_count',0)
  e['source'].update(size=(S/path).stat().st_size,git_blob=subprocess.check_output(['git','rev-parse',NEW+':'+path],cwd=S,text=True).strip(),line_count=(base+int(a)-int(d) if base is not None and a!='-' else None),metadata_note='Excluded content not inspected; counts derived from old metadata and git numstat.')
  e['source'].pop('sha256',None)
 e['refresh']={'commit':NEW,'previous_commit':OLD,'status':'excluded-metadata-only' if e['status']=='excluded' else 'pending-scoped-verification'}
 if path in newkeys:e['verified_ranges']=','.join(f'{a}-{b}' for a,b in e['included_ranges'])
 c['final_classification']=e['status']
 if c['new'] and e['status']=='mapped':c['candidate_disposition']='Mapped implementation helper; no standalone public entry or new persisted grammar. Core behavior is routed through current contracts.'
m['files'].sort(key=lambda e:e['path']);counts=collections.Counter(e['status'] for e in m['files']);m['totals']={'files':len(m['files']),'excluded':counts['excluded'],'key_file':counts['key-file'],'mapped':counts['mapped'],'unclassified':0,'classified_percent':100.0,'non_excluded':counts['key-file']+counts['mapped'],'non_excluded_covered_percent':100.0};m['snapshot'].update(commit=NEW,previous_commit=OLD,refresh_date='2026-10-12');m['refresh']={'status':'STALE affected areas; verification pending','evidence':'verification/refresh-011953c2/scope.json'};save('CORE-MANIFEST.json',json.dumps(m,indent=2)+'\n')
# Explicit directory maps for all new production identities. Roles are refined after declaration review.
newmap_records=[]
for e in newfiles:
 doc=e['module_map']['document'];f=P/doc
 if not f.exists():save(doc,'# '+doc.rsplit('/',1)[1].replace('.md','')+' Module Map\n\nNew local production source; mapped implementation unless linked as a selected Key File.\n')
 text=f.read_text();anchor=e['module_map']['anchor'];parent=e['module_map']['directory']
 if 'id="'+anchor+'"' not in text:text+='\n<a id="'+anchor+'"></a>\n\n### `'+parent+'`\n'
 text+='\n| Source | Production reading ranges | Status |\n|---|---|---|\n| `'+e['path']+'` | '+', '.join(f'{a}-{b}' for a,b in e['included_ranges'])+' | '+e['status']+' |\n'
 save(doc,text);newmap_records.append(e['path'])
text='# Frozen refresh addendum — 2026-10-12\n\nCurrent source `'+NEW+'`; frozen bodies retain `'+registry['source_snapshot']+'`. [Changed contracts](../'+contract+') govern affected behavior. Earlier translations remain in [October 11](2026-10-11-4ac2f7c8.md), [October 9](2026-10-09-db684d1f.md), [October 7](2026-10-07-84d1681e.md), and [October 4](2026-10-04-ad12ed9e.md). Changed paths below are translated directly from the frozen baseline. Behavior changes require scoped re-verification; pending.\n\n## Coordinate translations\n\n| Source | Frozen ranges | Current ranges |\n|---|---|---|\n'
for path,a,b in sorted({(x['path'],x['old_ranges'],x['new_ranges']) for x in frozenrefs}):text+=f'| `{path}` | `{a}` | {path}:{b} |\n'
save(addendum,text)
for n in ['README.md','COMPLETION-REPORT.md','REFRESH-REPORT.md']:
 t=(P/n).read_text();first,rest=t.split('\n',1);save(n,first+'\n\n**2026-10-12 refresh pending: affected areas are STALE until scoped VERIFY passes.**\n'+rest)
state=json.loads((P/'iteration-state.json').read_text());state['refresh']={'old_commit':OLD,'new_commit':NEW,'status':'pending','affected_areas_stale':True};save('iteration-state.json',json.dumps(state,indent=2)+'\n')
(R/'scope.json').write_text(json.dumps(scope,indent=2)+'\n');(R/'pointer-rewrites.json').write_text(json.dumps({'current_rewrites':rewrites,'frozen_overlays':frozenrefs},indent=2)+'\n');(R/'changes.json').write_text(json.dumps({'changed_artifacts':sorted(set(changed))},indent=2)+'\n');print(m['totals'],len(rewrites),len(frozenrefs))
