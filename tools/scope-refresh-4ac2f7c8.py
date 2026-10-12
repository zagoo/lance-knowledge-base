"""Read-only source diff inventory and production-only hunk extraction."""
from pathlib import Path
import json,re,subprocess,hashlib,importlib.util,collections
P=Path(__file__).resolve().parents[1];S=Path('/Users/renshaobin/Workspace/Develop/GitHub/lance');R=P/'verification/refresh-4ac2f7c8';R.mkdir(exist_ok=True)
OLD='db684d1f0726c00b6defb7963a604a7719e82b5a';NEW='4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9'
def git(*a):return subprocess.check_output(['git',*a],cwd=S)
def dump(n,v):(R/n).write_text(json.dumps(v,indent=2)+'\n')
spec=importlib.util.spec_from_file_location('scope',P/'tools/core-scope.py');helper=importlib.util.module_from_spec(spec);spec.loader.exec_module(helper)
m=json.loads((P/'CORE-MANIFEST.json').read_text());by={e['path']:e for e in m['files']};assert m['snapshot']['commit']==OLD;assert git('rev-parse','HEAD').decode().strip()==NEW;assert not git('status','--porcelain')
ns=git('diff','--name-status',OLD+'..'+NEW).decode();(R/'name-status.txt').write_text(ns);(R/'diff-stat.txt').write_bytes(git('diff','--stat',OLD+'..'+NEW));(R/'commits.txt').write_bytes(git('log','--oneline',OLD+'..'+NEW))
changes=[];maps={};old_entries={};ranges={};prod=R/'production-diffs';prod.mkdir(exist_ok=True)
for row in ns.splitlines():
 code,path=row.split('\t');assert code in ('A','M','D');e=by.get(path);old_entries[path]=e
 status=e['status'] if e else ('excluded' if (any(helper.TEST_PART.match(x) for x in path.split('/')) or path.split('/')[-1] in ('tests.rs','test.rs') or helper.TEST_FILE.match(path.split('/')[-1]) or not path.endswith(('.rs','.java','.py','.proto','.pyi'))) else 'mapped')
 c={'path':path,'git_status':code,'classification':status,'new':e is None,'key_file_candidate':e is None and status!='excluded'}
 # Excluded fixtures and binaries: inventory only, never open content.
 if status=='excluded' or code=='D':changes.append(c);continue
 old=git('show',OLD+':'+path).decode() if e else '';new=(S/path).read_text();nl=len(new.splitlines());ex=helper.excluded_rust_ranges(new) if path.endswith('.rs') else []
 excluded={n for a,b,*_ in ex for n in range(a,b+1)};inc=helper.runs(set(range(1,nl+1))-excluded);ranges[path]={'included_ranges':inc,'excluded_ranges':ex,'line_count':nl,'size':(S/path).stat().st_size,'sha256':hashlib.sha256(new.encode()).hexdigest()}
 diff=git('diff','--unified=3',OLD+'..'+NEW,'--',path).decode();chunks=re.split(r'(?=^@@ )',diff,flags=re.M);kept=[]
 oldinc=e['included_ranges'] if e else []
 for chunk in chunks:
  match=re.match(r'@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@',chunk)
  if not match:continue
  a=int(match[1]);b=int(match[3]);out=[];interesting=False
  for line in chunk.splitlines()[1:]:
   if line.startswith('\\'):continue
   isinold=any(lo<=a<=hi for lo,hi in oldinc);isinnew=b not in excluded and 1<=b<=nl
   show=(line.startswith('-') and isinold) or (line.startswith('+') and isinnew) or (line.startswith(' ') and isinnew)
   if show:out.append(f'{a if line.startswith("-") else b:5d} '+line)
   if line[:1] in '+-' and show:interesting=True
   if not line.startswith('+'):a+=1
   if not line.startswith('-'):b+=1
  if interesting:kept.append(chunk.splitlines()[0]+'\n'+'\n'.join(out))
 hs=[]
 for a,ac,b,bc in re.findall(r'^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@',git('diff','--unified=0',OLD+'..'+NEW,'--',path).decode(),re.M):hs.append({'old_start':int(a),'old_count':int(ac or 1),'new_start':int(b),'new_count':int(bc or 1)})
 maps[path]={'old_lines':len(old.splitlines()),'new_lines':nl,'hunks':hs};c['production_hunks']=len(kept);c['production_diff_lines']=sum(len(x.splitlines()) for x in kept);c['diff_evidence']='production-diffs/'+path.replace('/','__')+'.txt';(R/c['diff_evidence']).write_text('\n\n'.join(kept)+'\n');changes.append(c)
dump('scope.json',{'date':'2026-10-11','old_commit':OLD,'new_commit':NEW,'files':changes,'counts':dict(collections.Counter(c['classification'] for c in changes)),'source_clean':True});dump('line-map.json',{'files':maps});dump('new-ranges.json',ranges);dump('old-changed-entries.json',old_entries)
print('Counts',collections.Counter(c['classification'] for c in changes),'production diff lines',sum(c.get('production_diff_lines',0) for c in changes))
for c in changes:
 if c['classification']!='excluded':print(c['classification'],c.get('production_hunks'),c.get('production_diff_lines'),c['path'])
