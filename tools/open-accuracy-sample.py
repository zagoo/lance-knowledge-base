"""Open one already-selected milestone sample; no source outside cited production spans."""
from pathlib import Path
import json,sys,hashlib
p=Path(__file__).resolve().parents[1];report=p/sys.argv[1];lo=int(sys.argv[2]);hi=int(sys.argv[3]);j=json.loads(report.read_text());m=json.loads((p/'CORE-MANIFEST.json').read_text());by={e['path']:e for e in m['files']};root=Path(m['repository'])
for c in j['random_accuracy']['claims']:
 if not lo<=c['id']<=hi:continue
 e=by[c['source']];assert e['status']!='excluded';assert any(a<=c['start']<=c['end']<=b for a,b in e['included_ranges'])
 text=(root/c['source']).read_text().splitlines();rows=text[c['start']-1:c['end']]
 print('\nCLAIM',c['id'],c['claim']);print(c['source'])
 for n,line in enumerate(rows,c['start']):print(f'{n}: {line}')
 c['source_opened']=True;c['opened_range_sha256']=hashlib.sha256('\n'.join(rows).encode()).hexdigest()
report.write_text(json.dumps(j,indent=2)+'\n')
