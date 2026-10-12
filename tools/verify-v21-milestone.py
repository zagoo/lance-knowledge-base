"""Milestone-only static checks and reproducible human/model semantic sample selection.
Never marks semantic/navigation checks passed automatically and never opens binary payloads.
"""
import argparse,json,re,random,hashlib,importlib.util
from urllib.parse import unquote
from pathlib import Path
from datetime import datetime,timezone
P=Path('/Users/renshaobin/Workspace/Develop/GitHub/lance-knowledge-base')
spec=importlib.util.spec_from_file_location('delta',P/'tools/verify-v21.py');delta=importlib.util.module_from_spec(spec);spec.loader.exec_module(delta)
ref=re.compile(r'(?<![\w/])((?:rust|python|java|protos|docs)/[\w.\/-]+\.(?:rs|proto|md|toml|py|java|txt|yml|yaml|json|sh)|AGENTS\.md):(\d+)(?:-(\d+))?')
def main():
 ap=argparse.ArgumentParser();ap.add_argument('milestone');ap.add_argument('iteration',type=int);ap.add_argument('--sample-only',action='store_true');args=ap.parse_args()
 m=json.loads((P/'CORE-MANIFEST.json').read_text());by={e['path']:e for e in m['files']};issues=[];links=0;citations=0;docs=list(P.rglob('*.md'));counts={}
 for e in by.values():counts[e['status'] or 'unclassified']=counts.get(e['status'] or 'unclassified',0)+1
 for f in ([] if args.sample_only else docs):
  s=delta.unfenced(f.read_text());name=str(f.relative_to(P))
  for x in re.finditer(r'(?<!!)\[[^\]]+\]\(([^)]+)\)',s):
   target=x[1]
   if target.startswith(('http:','https:','mailto:','app:','codex:')):continue
   pathname=target.split('#')[0]
   links+=1
   destination=(f.parent/pathname).resolve() if pathname else f.resolve()
   if not destination.exists():issues.append({'doc':name,'broken_link':target})
   elif '#' in target and destination.suffix=='.md':
    frag=unquote(target.split('#',1)[1]);dt=destination.read_text();anchors=set(re.findall(r'id=[\"\']([^\"\']+)',dt));seen={}
    for heading in re.findall(r'^#{1,6} (.+)$',dt,re.M):
     slug=re.sub(r'[^\w -]','',heading.lower()).replace(' ','-');n=seen.get(slug,0);seen[slug]=n+1;anchors.add(slug+('-'+str(n) if n else ''))
    if frag and frag not in anchors:issues.append({'doc':name,'broken_anchor':target})
  for x in ref.finditer(s):
   citations+=1;e=by.get(x[1]);a=int(x[2]);b=int(x[3] or x[2]);limit=e.get('source',{}).get('line_count') if e else None
   if not e or limit is None or a<1 or b<a or b>limit:issues.append({'doc':name,'citation':x[0]})
 pool=[]
 for f in docs:
  name=str(f.relative_to(P))
  if not (name.startswith(('L0-','L1-modules/','L3-symbols/','L4-crosscutting/'))) or '/archive/' in name or '/api-reference/' in name or 'symbol-index' in name:continue
  for n,line in enumerate(f.read_text().splitlines(),1):
   if len(line)<65 or len(line)>1200:continue
   if (line.startswith('|') and '`' in line) or line.startswith('Historical '):continue
   if name == 'L4-crosscutting/navigation-index.md':continue
   if re.fullmatch(r'\[[^]]+\]\([^)]+\)',line.strip()):continue
   if '::' in line and (line.startswith('| `') or line.startswith('- **')):continue
   if 'implementation block' in line:continue
   rs=list(ref.finditer(line))
   if len(rs)!=1:continue
   x=rs[0];a=int(x[2]);b=int(x[3] or x[2]);e=by.get(x[1]);
   if not e or e['status']=='excluded' or b-a>45:continue
   if not any(a>=r[0] and b<=r[1] for r in e.get('included_ranges',[])):continue
   if any(k in line.lower() for k in ['test','fixture','benchmark','pending','historical evidence','not yet']):continue
   pool.append({'document':name,'kb_line':n,'claim':line,'source':x[1],'start':a,'end':b})
 pool.sort(key=lambda x:(x['document'],x['kb_line']))
 pool=list({c['claim']:c for c in pool}.values())
 seed=2026100400+args.iteration;rng=random.Random(seed)
 sample=rng.sample(pool,min(20,len(pool)))
 for i,c in enumerate(sample,1):c['id']=i;c['verdict']='unreviewed'
 frozen_issues=[]
 registry=json.loads((P/'verification/frozen-snapshot-085.json').read_text())
 for item in ([] if args.sample_only else registry['documents']):
  raw=(P/item['document']).read_bytes();body=raw.split(b'\n\n',1)[1]
  if hashlib.sha256(body).hexdigest()!=item['body_sha256']:frozen_issues.append(item['document'])
 idx=registry['machine_symbol_index']
 if not args.sample_only and hashlib.sha256((P/idx['path']).read_bytes()).hexdigest()!=idx['sha256']:frozen_issues.append(idx['path'])
 report={'milestone':args.milestone,'iteration':args.iteration,'at':datetime.now(timezone.utc).isoformat(),'ledger':{'counts':counts,'pass':counts.get('unclassified',0)==0},'frozen_snapshot':{'documents_checked':0 if args.sample_only else len(registry['documents']),'machine_catalog_checked':not args.sample_only,'issues':frozen_issues,'pass':None if args.sample_only else not frozen_issues},'full_cross_links':{'documents':0 if args.sample_only else len(docs),'links':links,'citation_ranges':citations,'issues':issues,'pass':None if args.sample_only else not issues},'random_accuracy':{'seed':seed,'eligible_claims':len(pool),'sampling_scope':'Current short production claims; excludes declaration-only directories, bare signatures, tests, binaries and archives.','claims':sample,'pass':None},'navigation':{'pass':None},'contracts':{'pass':None},'overall_pass':False}
 dest=P/'verification'/f'milestone-{args.milestone.lower()}-{args.iteration:03}.json';
 if dest.exists():
  previous=json.loads(dest.read_text())
  for section in ['random_accuracy','navigation','contracts','repairs','open_failures','milestone_content_complete']:
   if section in previous:report[section]=previous[section]
 dest.write_text(json.dumps(report,indent=2)+'\n')
 print(json.dumps({k:(v.get('pass') if k in ['navigation','contracts'] else v) for k,v in report.items() if k not in ['random_accuracy','repairs']},indent=2));print('Random sample saved:',dest)
if __name__=='__main__':main()
