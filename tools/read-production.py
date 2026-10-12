"""Read only requested production ranges from the V2.1 ledger; refuse excluded files."""
import json,sys
from pathlib import Path
P=Path('/Users/renshaobin/Workspace/Develop/GitHub/lance-knowledge-base')
m=json.loads((P/'CORE-MANIFEST.json').read_text());by={e['path']:e for e in m['files']};root=Path(m['repository'])
for request in sys.argv[1:]:
 path,rs=request.rsplit(':',1);e=by[path]
 if e['status']=='excluded':raise SystemExit('Refusing excluded path '+path)
 ls=(root/path).read_text().splitlines();ranges=[tuple(map(int,x.split('-'))) if '-' in x else (int(x),int(x)) for x in rs.split(',')]
 print('\nSOURCE',request)
 for a,b in ranges:
  for i in range(a,min(b,len(ls))+1):
   if any(x[0]<=i<=x[1] for x in e['included_ranges']):print(f'{i}: {ls[i-1]}')
