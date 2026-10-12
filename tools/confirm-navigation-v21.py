"""Milestone-only source pointer confirmation, with production-range clipping.
The ordered KB-only plan must already exist. Output is evidence for manual review,
not an automatic claim that arbitrary future implementation work is complete.
"""
import json,re,hashlib,sys
from pathlib import Path
from datetime import datetime,timezone
p=Path(__file__).resolve().parents[1];iteration=int(sys.argv[1]);stage=sys.argv[2] if len(sys.argv)>2 else 'all'
plan=p/'verification'/f'iteration-{iteration:03}-navigation-plan.json';j=json.loads(plan.read_text())
m=json.loads((p/'CORE-MANIFEST.json').read_text());by={e['path']:e for e in m['files']};root=Path(m['repository']);seen={}
for task in j['tasks']:
 if stage!='all' and (int(re.sub(r'\D','',task['id']))<=5)!=(stage=='first'):continue
 print('\nTASK',task['id'],task['task'])
 for group in task['ordered_read_sets']:
  assert len({r.rsplit(':',1)[0] for r in group})<=5
  for request in group:
   path,rs=request.rsplit(':',1);e=by[path];assert e['status']!='excluded'
   if request in seen:print('Already opened this run:',request);continue
   lines=(root/path).read_text().splitlines();picked=[];segments=[]
   for span in rs.split(','):
    v=list(map(int,span.split('-')));a=v[0];b=v[-1];assert 1<=a<=b<=len(lines)
    segment=[(n,lines[n-1]) for n in range(a,b+1) if any(lo<=n<=hi for lo,hi in e['included_ranges'])]
    assert segment,'excluded-only pointer '+request
    segments.extend(segment)
    # Preserve declaration/dispatch anchors plus start of each range for review.
    heads=[x for x in segment if re.search(r'\b(fn |trait |struct |enum |message |public |case |Operation::|check_txn|read_version|large|sparse|Constant|commit_transaction|InsertBuilder|CreateIndexBuilder|ScalarIndexPlugin|register|try_into_stream|create_plan_impl|supports_filters_pushdown|new_training_request|write_fragments|with_batch_size)',x[1])]
    picked.extend((heads[:5] if heads else segment[:4]))
   evidence={'request':request,'opened_production_lines':len(segments),'sha256_of_opened_lines':hashlib.sha256('\n'.join(f'{n}:{s}' for n,s in segments).encode()).hexdigest(),'anchors':[{'line':n,'text':s} for n,s in picked]}
   seen[request]=evidence
   print(request)
   for n,s in picked:print(f' {n}: {s}')
output=p/'verification'/f'iteration-{iteration:03}-navigation-source-{stage}.json'
output.write_text(json.dumps({'plan_sha256':hashlib.sha256(plan.read_bytes()).hexdigest(),'at':datetime.now(timezone.utc).isoformat(),'source_opened_after_plan':True,'evidence':list(seen.values()),'manual_verdict_required':True},indent=2)+'\n')
