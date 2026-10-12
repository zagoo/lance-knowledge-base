"""One-time impact-led pointer refresh. Source is read-only; frozen bodies are not edited."""
import json,re,subprocess,hashlib,copy,os
from pathlib import Path
from datetime import datetime,timezone
P=Path(__file__).resolve().parents[1]
S=Path('/Users/renshaobin/Workspace/Develop/GitHub/lance')
OLD='c3c8d6fb505fb437b2b673c5195e1d4b74436b2f'
NEW='ad12ed9e15e0046688b00568d0ac1a347fb2d328'
R=P/'verification/refresh-ad12ed9e';R.mkdir(exist_ok=True)
def git(*args):return subprocess.check_output(['git',*args],cwd=S)
def sha(b):return hashlib.sha256(b).hexdigest()
def dump(f,o):f.write_text(json.dumps(o,indent=2)+'\n')
assert git('rev-parse','HEAD').decode().strip()==NEW
assert not git('status','--porcelain')
m=json.loads((P/'CORE-MANIFEST.json').read_text());assert m['snapshot']['commit']==OLD,'Already applied; do not rerun.'
by={e['path']:e for e in m['files']}
names=git('diff','--name-status',OLD+'..'+NEW).decode();stat=git('diff','--stat',OLD+'..'+NEW).decode()
(R/'name-status.txt').write_text(names);(R/'diff-stat.txt').write_text(stat)
changes=[];maps={};before_entries={}
for line in names.splitlines():
 code,path=line.split('\t');assert code in ('M','A')
 old_entry=by.get(path);before_entries[path]=copy.deepcopy(old_entry)
 old_bytes=git('show',OLD+':'+path) if old_entry else b'';new_bytes=(S/path).read_bytes()
 old_lines=old_bytes.splitlines();new_lines=new_bytes.splitlines()
 hunks=[]
 for a,ac,b,bc in re.findall(r'^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@',git('diff','--unified=0',OLD+'..'+NEW,'--',path).decode(),re.M):
  a,ac,b,bc=int(a),int(ac or 1),int(b),int(bc or 1)
  production=bool(old_entry and old_entry['status']!='excluded' and any((lo<=a<=hi if ac==0 else max(a,lo)<=min(a+ac-1,hi)) for lo,hi in old_entry['included_ranges']))
  hunks.append({'old_start':a,'old_count':ac,'new_start':b,'new_count':bc,'intersects_old_production':production})
 maps[path]={'old_lines':len(old_lines),'new_lines':len(new_lines),'hunks':hunks}
 status=old_entry['status'] if old_entry else 'excluded'
 assert old_entry or '/src/test/' in path
 changes.append({'git_status':code,'path':path,'classification':status,'newly_classified':old_entry is None,'production_hunks':sum(h['intersects_old_production'] for h in hunks),'old_sha256':sha(old_bytes) if old_entry else None,'new_sha256':sha(new_bytes)})
# 1-based positions, preserving unchanged lines exactly and enclosing replacements.
def position(path,x,end=False):
 delta=0
 for h in maps[path]['hunks']:
  a,n,b,k=h['old_start'],h['old_count'],h['new_start'],h['new_count']
  if n==0:
   if x<=a:return x+delta
   delta+=k;continue
  if x<a:return x+delta
  if x<a+n:return (b+k-1 if end and k else b) if k else max(1,b)
  delta+=k-n
 return x+delta
def ranges(path,rs):
 out=[]
 for part in rs.split(','):
  nums=list(map(int,part.strip().split('-')));a=position(path,nums[0]);b=position(path,nums[-1],True)
  out.append(str(a) if len(nums)==1 and a==b else f'{a}-{max(a,b)}')
 return ','.join(out)
def list_ranges(path,rr):return [[position(path,row[0]),position(path,row[1],True),*row[2:]] for row in rr]
# Snapshot the old records as refresh evidence, never a second maintained ledger.
dump(R/'old-changed-entries.json',before_entries)
dump(R/'line-map.json',{'old_commit':OLD,'new_commit':NEW,'files':maps})
dump(R/'scope.json',{'old_commit':OLD,'new_commit':NEW,'at':datetime.now(timezone.utc).isoformat(),'files':changes,'no_renames_or_deletions':True,'source_status':'clean'})
registry=json.loads((P/'verification/frozen-snapshot-085.json').read_text());frozen={e['document'] for e in registry['documents']}
backups={};rewrites=[];frozen_refs=[];updated=[]
def save(name,body):
 f=P/name;old=f.read_text() if f.exists() else None
 if old==body:return
 if old is not None:
  backups.setdefault(name,old)
  dump(R/'before-documents.json',backups)
 f.write_text(body);updated.append(name)
nonexcluded=[c['path'] for c in changes if c['classification']!='excluded']
for f in sorted(P.rglob('*.md')):
 name=str(f.relative_to(P));body=f.read_text()
 historical=name.startswith(('archive/','verification/')) or '/archive/' in name or body.startswith('> **Historical archive') or name=='verification-log.md'
 if historical:continue
 original=body
 for path in nonexcluded:
  pat=re.compile(r'(?<![\w/])'+re.escape(path)+r':(\d+(?:-\d+)?(?:,\d+(?:-\d+)?)*)')
  def fix(match):
   old=match[1];new=ranges(path,old)
   if old!=new:
    record={'document':name,'path':path,'old_ranges':old,'new_ranges':new}
    if name in frozen:frozen_refs.append(record);return match[0]
    rewrites.append(record)
   return path+':'+new
  body=pat.sub(fix,body)
  if name not in frozen:
   # Module membership rows and prose Key Files ranges are not colon citations.
   table=re.compile(r'(\| `'+re.escape(path)+r'` \| )([\d, -]+)( \|)')
   body=table.sub(lambda x:x[1]+', '.join(ranges(path,q.strip()) for q in x[2].split(','))+x[3],body)
   prose=re.compile(r'(`'+re.escape(path)+r'` — read `)([\d,-]+)(`)')
   body=prose.sub(lambda x:x[1]+ranges(path,x[2])+x[3],body)
 if name in frozen:continue
 if body!=original:
  body=body.replace(OLD,NEW)
  parts=body.split('\n',1);body=parts[0]+'\n\n> Refreshed 2026-10-04 against `'+NEW+'`; changed-source pointers re-anchored. Unchanged analysis retained.\n'+parts[1]
  save(name,body)
# Refresh source metadata/ranges, preserving classifications and trust limits.
for c in changes:
 path=c['path'];old=by.get(path);raw=(S/path).read_bytes()
 if old is None:
  old={'path':path,'status':'excluded','coverage_mode':'excluded','module_map':None,'l2_document':None,'exclusion_reason':'tests, benchmarks or fixture setup','source':{'classification':'test','representation':'utf8'},'included_ranges':[],'excluded_ranges':[],'prior_tier':'excluded'};m['files'].append(old)
 else:
  old['included_ranges']=list_ranges(path,old['included_ranges'])
  if old.get('excluded_ranges') and isinstance(old['excluded_ranges'][0],list):old['excluded_ranges']=list_ranges(path,old['excluded_ranges'])
  elif old.get('excluded_ranges'):
   for rr in old['excluded_ranges']:
    # Legacy range records use inclusive start/end.
    if 'start' in rr:rr['start']=position(path,rr['start']);rr['end']=position(path,rr['end'],True)
 old['source'].update(size=len(raw),line_count=len(raw.splitlines()),sha256=sha(raw))
 old['refresh']={'commit':NEW,'previous_commit':OLD,'production_hunks':c['production_hunks'],'status':'pending-scoped-verification' if old['status']!='excluded' else 'excluded-metadata-only'}
 if old['status']=='key-file':old['frozen_addendum']='refresh-addenda/2026-10-04-ad12ed9e.md#statistics'
m['files'].sort(key=lambda e:e['path']);m['snapshot'].update(commit=NEW,previous_commit=OLD,status='',refresh_date='2026-10-04')
m['refresh']={'status':'STALE affected areas until scoped verification passes','evidence':'verification/refresh-ad12ed9e/scope.json'}
m['totals'].update(files=len(m['files']),excluded=sum(e['status']=='excluded' for e in m['files']))
save('CORE-MANIFEST.json',json.dumps(m,indent=2)+'\n')
# Separate addendum preserves every frozen body. Cross-file citations receive explicit translations.
(P/'refresh-addenda').mkdir(exist_ok=True)
add='''# Frozen snapshot addendum — 2026-10-04

Current source: `'''+NEW+'''`. Original frozen body/source snapshot: `'''+OLD+'''`. Frozen bodies and machine symbols remain unchanged. Use the translations below for current source access; historical body coordinates remain anchored to the original commit.

<a id="statistics"></a>
## V1 statistics Key File

The changed file is `rust/lance-file/src/versions/v1/writer/statistics.rs`. All diff hunks are after the included production interval 1–931, inside excluded test code. Old and new production intervals are byte-identical; no production citation drift or behavior change occurred. File length changed from 3,117 to 3,120 lines (see recorded metadata for authoritative counts). No test behavior was analyzed. The deep production contract remains verified; there is no semantic re-verification requirement for this file.

[Original frozen L2](../L2-files/rust/lance-file/src/versions/v1/writer/statistics.rs.md). The old body includes historical test observations and old whole-file metadata; those are not current-scope claims.

## Frozen cross-reference translations

The Arrow helper file changed only a documentation example before later production functions (minus four lines) and an excluded test. The referenced implementation hunks themselves did not change. Apply these exact translations when following frozen references; this addendum does not rewrite or expand the frozen symbol catalog.

| Frozen document | Old source coordinate | Current source coordinate |
|---|---|---|
'''
for row in sorted({(r['document'],r['path'],r['old_ranges'],r['new_ranges']) for r in frozen_refs}):
 n,path,a,b=row;add+=f'| [{n}](../{n}) | `{OLD[:12]}` / `{path}` lines {a} | {path}:{b} |\n'
add+='\nSource-equivalence and hunk metadata: [refresh scope](../verification/refresh-ad12ed9e/scope.json), [line map](../verification/refresh-ad12ed9e/line-map.json).\n'
# Exact counts are metadata, not inferred from the diff line delta.
sp='rust/lance-file/src/versions/v1/writer/statistics.rs'
add=add.replace('3,117 to 3,120',f"{maps[sp]['old_lines']:,} to {maps[sp]['new_lines']:,}")
save('refresh-addenda/2026-10-04-ad12ed9e.md',add)
needs_notice={r['document'] for r in frozen_refs}|{by[sp]['l2_document'],'L3-symbols/symbol-index.md'}
for name in sorted(needs_notice):
 f=P/name;header,body=f.read_text().split('\n\n',1);rel=os.path.relpath(P/'refresh-addenda/2026-10-04-ad12ed9e.md',f.parent)
 save(name,header+f' Refresh 2026-10-04: [current-source addendum]({rel}) for `{NEW}`.\n\n'+body)
# Assert production identity for the test-only changed files.
equivalence=[]
for path in [sp,'rust/lance-namespace-datafusion/src/session_builder.rs']:
 entry=before_entries[path];a,b=entry['included_ranges'][0];old=git('show',OLD+':'+path).splitlines(keepends=True)[a-1:b];new=(S/path).read_bytes().splitlines(keepends=True)[a-1:b];assert old==new
 equivalence.append({'path':path,'range':[a,b],'old_and_new_production_equal':True,'sha256':sha(b''.join(old))})
dump(R/'production-equivalence.json',equivalence)
dump(R/'pointer-rewrites.json',{'current_rewrites':rewrites,'frozen_overlays':frozen_refs})
dump(R/'before-documents.json',backups)
dump(R/'changes.json',{'changed_artifacts':sorted(set(updated))})
f=P/'iteration-state.json';state=json.loads(f.read_text());state['refresh']={'old_commit':OLD,'new_commit':NEW,'status':'in_progress','affected_areas_stale':True,'evidence':'verification/refresh-ad12ed9e/scope.json'};dump(f,state)
print(json.dumps({'files_changed':len(changes),'classification':{x:sum(c['classification']==x for c in changes) for x in ['excluded','mapped','key-file']},'current_citation_rewrites':len(rewrites),'frozen_citation_overlays':len(frozen_refs),'updated_documents':sorted(set(updated)),'production_equivalence':equivalence},indent=2))
