"""One-time citation migration. Frozen bodies are never modified."""
from pathlib import Path
import json,re,os,subprocess,hashlib,collections
P=Path(__file__).resolve().parents[1];S=Path('/Users/renshaobin/Workspace/Develop/GitHub/lance');R=P/'verification/refresh-84d1681e';OLD='ad12ed9e15e0046688b00568d0ac1a347fb2d328';NEW='84d1681e07af565837f2d97e72ff1b8b040cd15c'
m=json.loads((P/'CORE-MANIFEST.json').read_text());assert m['snapshot']['commit']==OLD
scope=json.loads((R/'scope.json').read_text());maps=json.loads((R/'line-map.json').read_text())['files'];rr=json.loads((R/'new-ranges.json').read_text());by={e['path']:e for e in m['files']};registry=json.loads((P/'verification/frozen-snapshot-085.json').read_text());frozen={x['document'] for x in registry['documents']};backup={};changed=[];rewrites=[];frozenrefs=[]
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
contract='L3-symbols/refresh-2026-10-07.md';addendum='refresh-addenda/2026-10-07-84d1681e.md'
for f in sorted(P.rglob('*.md')):
 name=str(f.relative_to(P));body=f.read_text()
 if name.startswith(('archive/','verification/','refresh-addenda/')) or '/archive/' in name or body.startswith('> **Historical archive') or name in ['verification-log.md','COMPLETION-REPORT.md','REFRESH-REPORT.md','README.md']:continue
 orig=body;affected={x[1] for x in pat.finditer(body)}
 if name in frozen:
  for x in pat.finditer(body):
   new=translate(x[1],x[2])
   if new!=x[2]:frozenrefs.append({'document':name,'path':x[1],'old_ranges':x[2],'new_ranges':new})
  own=next((c['path'] for c in scope['files'] if c['classification']=='key-file' and by[c['path']]['l2_document']==name),None)
  if affected or own:
   head,rest=body.split('\n\n',1);rel=os.path.relpath(P/addendum,f.parent);save(name,head+f' Refresh 2026-10-07: [current coordinates and changed contracts]({rel}) at `{NEW}` supersede affected historical statements; body remains frozen.\n\n'+rest)
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
  rel=os.path.relpath(P/contract,f.parent);first,rest=body.split('\n',1);body=first+f'\n\n> Refresh 2026-10-07, `{NEW}`: source coordinates updated. [Changed contracts]({rel}) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.\n'+rest;save(name,body)
# New production helper promoted after complete focused read.
newpath='rust/lance/src/dataset/blob/clone.rs';l2='L2-files/'+newpath+'.md';mapref={'document':'L1-modules/rust-lance.md','anchor':'rust-lance-src-dataset-blob','directory':'rust/lance/src/dataset/blob/'}
for c in scope['files']:
 path=c['path'];e=by.get(path)
 if e is None:
  e={'path':path,'status':'key-file' if path==newpath else 'excluded','coverage_mode':'contract-verified-key-ranges' if path==newpath else 'excluded','module_map':mapref if path==newpath else None,'l2_document':l2 if path==newpath else None,'exclusion_reason':None if path==newpath else 'tests, benchmarks or fixture setup','source':{},'included_ranges':[],'excluded_ranges':[],'prior_tier':'core' if path==newpath else 'excluded'};m['files'].append(e)
 if path in rr:
  e['source'].update({k:v for k,v in rr[path].items() if k not in ['included_ranges','excluded_ranges']});e['source'].setdefault('classification','source');e['source'].setdefault('representation','utf8');e['included_ranges']=rr[path]['included_ranges'];e['excluded_ranges']=rr[path]['excluded_ranges']
  if e.get('verified_ranges'):e['verified_ranges']=translate(path,e['verified_ranges'])
  if e['status']=='key-file' and e['l2_document'] in frozen:e['frozen_addendum']=addendum
 else:
  # Git object identity and stat only for excluded material; no binary content read.
  e['source']['size']=(S/path).stat().st_size;e['source']['git_blob']=subprocess.check_output(['git','rev-parse',NEW+':'+path],cwd=S).decode().strip();e['source'].pop('sha256',None);e['source']['line_count']=None;e['source'].setdefault('classification','test');e['source'].setdefault('representation','not-inspected');e['source']['metadata_note']='Excluded material: git object identity/stat only; content and line count not inspected in this refresh.'
 e['refresh']={'commit':NEW,'previous_commit':OLD,'status':'excluded-metadata-only' if e['status']=='excluded' else 'pending-scoped-verification','production_hunks':c.get('production_hunks',0)}
 if path==newpath:e['verified_ranges']='1-259'
m['files'].sort(key=lambda e:e['path']);counts=collections.Counter(e['status'] for e in m['files']);m['totals']={'files':len(m['files']),'excluded':counts['excluded'],'key_file':counts['key-file'],'mapped':counts['mapped'],'unclassified':0,'classified_percent':100.0,'non_excluded':counts['key-file']+counts['mapped'],'non_excluded_covered_percent':100.0};m['snapshot'].update(commit=NEW,previous_commit=OLD,refresh_date='2026-10-07');m['refresh']={'status':'STALE affected areas until scoped verification passes','evidence':'verification/refresh-84d1681e/scope.json'};save('CORE-MANIFEST.json',json.dumps(m,indent=2)+'\n')
mapfile=mapref['document'];s=(P/mapfile).read_text();s+='\n<a id="rust-lance-src-dataset-blob"></a>\n## `rust/lance/src/dataset/blob/` — managed object cloning\n\nCopies Managed payloads for an independent deep clone and rebinds nested descriptors to destination-local objects. The entry point is `copy_blob_columns`; descriptor recursion and targeted column rewrites preserve fragment identity and unrelated column files.\n\n| Source | Production reading ranges | Status |\n|---|---|---|\n| `'+newpath+'` | 1-259 | key-file |\n\n### Key File: managed blob clone\n\n['+newpath+'](../'+l2+') — read `1-259`.\nCopies each discovered managed object once, keeping local relative paths and allocating fresh `_blobs` names for registered-base objects.\nRecursively replaces the latter descriptors in structs/lists while preserving nulls and byte ranges.\nRewrites blob-containing columns, prunes replaced file fields, and substitutes resulting fragments before the clone manifest is published.\n';save(mapfile,s)
s='# Frozen refresh addendum — 2026-10-07\n\nCurrent source: `'+NEW+'`. Frozen bodies remain at `'+registry['source_snapshot']+'`; no bodies or machine symbols are rewritten.\n\n[Current changed contracts](../'+contract+') govern the changed behavior. They are pending scoped verification until the [refresh report](../REFRESH-REPORT.md) passes. Historical tests are excluded; translations of their coordinates confer no current coverage. For unchanged paths already moved in the prior refresh, retain the [2026-10-04 translations](2026-10-04-ad12ed9e.md).\n\n## Changed frozen Key Files\n\n'
for c in scope['files']:
 e=by.get(c['path'],{})
 if e.get('l2_document') in frozen:s+='- ['+c['path']+'](../'+e['l2_document']+') — '+str(c['production_hunks'])+' production diff hunks; [current contract overlay](../'+contract+').\n'
s+='\n## Coordinate translations\n\nOld coordinates below belong to frozen bodies; current coordinates are for implementation reading. Replaced/deleted regions map to the containing changed span, so the changed contract must be read before interpreting old prose.\n\n| Source | Frozen ranges | Current ranges |\n|---|---|---|\n'
for path,a,b in sorted({(x['path'],x['old_ranges'],x['new_ranges']) for x in frozenrefs}):s+=f'| `{path}` | `{a}` | {path}:{b} |\n'
s+='\n[Per-document translation evidence](../verification/refresh-84d1681e/pointer-rewrites.json).\n';save(addendum,s)
for n in [contract,l2]:
 if not (P/n).exists():save(n,'# '+('Changed contracts — 2026-10-07' if n==contract else 'Key File: '+newpath)+'\n\n**Refresh verification pending.**\n')
(R/'pointer-rewrites.json').write_text(json.dumps({'current_rewrites':rewrites,'frozen_overlays':frozenrefs},indent=2)+'\n');(R/'changes.json').write_text(json.dumps({'changed_artifacts':sorted(set(changed)|{'COMPLETION-REPORT.md','README.md','REFRESH-REPORT.md'})},indent=2)+'\n');print(json.dumps({'artifacts':len(set(changed)),'current_rewrites':len(rewrites),'frozen_overlays':len(frozenrefs),'totals':m['totals']},indent=2))
