import fs from 'node:fs';
import {root,linesOf} from './inventory.mjs';
const read=p=>JSON.parse(fs.readFileSync(p)),batch=read('analysis/iteration-055-batch.json'),out=[];
for(const f of batch.files){
  const wrapper=/versions\//.test(f.path),v=f.path.match(/v2_(\d)/)?.[1];
  const ns=wrapper?`lance_file::versions::v2_${v}::writer::`:'lance_file::writer::structural::';
  const src=linesOf(fs.readFileSync(root+'/'+f.path,'utf8'));
  const structs=wrapper?[[32,36,'Writer']]:[[50,58,'PageMetadataSpill'],[151,157,'StructuralFileSink'],[385,394,'EncodingPipeline'],[825,832,'EncodedBatchBody']];
  const impls=wrapper?[[38,202,'Writer']]:[[60,113,'PageMetadataSpill'],[159,379,'StructuralFileSink'],[396,811,'EncodingPipeline']];
  const methodEnds=wrapper?{40:46,49:58,61:63,66:76,78:86,88:93,96:99,102:110,113:116,119:124,126:129,131:134,136:145,148:150,153:186,189:191,194:196,199:201,205:224}:{61:73,75:91,93:104,106:112,115:130,137:144,160:168,170:172,174:177,179:185,187:195,197:199,201:204,206:245,248:260,262:273,275:277,279:285,287:299,301:311,312:341,343:350,352:361,363:365,367:369,371:373,375:378,397:408,410:412,414:440,442:455,457:459,461:464,480:533,535:545,546:569,570:597,599:650,652:704,705:724,725:778,779:782,783:789,790:803,804:807,808:810,813:823,834:923,938:956,958:968,970:982,987:1014,1016:1024};
  const add=(name,line,end,kind,visibility,bodyEnd=line)=>{
    const ranges=f.ranges.filter(([a,b])=>a<=bodyEnd&&b>=line);
    out.push({name:ns+name,path:f.path,line,end_line:end,body_end_line:bodyEnd,kind,visibility,
      behavior:ranges.map(r=>r[2]).join(' '),behavior_reference:ranges.map(r=>`${f.path}:${r[0]}-${r[1]}`).join('; '),
      callers:wrapper?'Parent exact version factories and root FileWriter facade route calls to this concrete Writer. concat_lance_footer is called by parent self-described/mini helpers. Local initialization and finish helpers are called by methods documented in this file. Full repository call graph remains pending.':'Exact V2_1/V2_2/V2_3 writer modules compose these mechanisms. Local sink/pipeline/spill helpers call one another as documented in complete L2 ranges; four cfg(test) nullability fixtures invoke the private validation entry. Full backend and Dataset caller graph remains pending.',
      callees:wrapper?'Exact parent encoding_strategy, Schema conversion/validation, BatchEncoder::try_new and shared StructuralFileSink/EncodingPipeline/body helpers. Footer uses direct little-endian writes and LANC magic.':'Arrow logical null masks/child arrays, ExpectedTypes, FieldEncoder maybe_encode/flush/finish, OutOfLineBuffers, prost Any/protobuf conversion, FuturesOrdered and ObjectWriter IO. Backend durability/cancellation and encoder algorithms remain pending.',
      ...(!wrapper&&line>=924?{cfg:'test'}:{})});
  };
  for(let i=0;i<src.length;i++){
    const line=i+1,t=src[i],impl=impls.find(([a,b])=>line>=a&&line<=b),struct=structs.find(([a,b])=>line>a&&line<b);
    const fn=t.match(/^\s*(pub(?:\([^)]*\))?\s+)?(async\s+)?fn\s+(\w+)/);
    if(fn){let end=line;while(!/[{;]\s*$/.test(src[end-1]))end++;if(!methodEnds[line])throw Error('Missing body end '+f.path+':'+line);const name=(impl?impl[2]+'::':!wrapper&&line>=924?'tests::':'')+fn[3];const visibility=fn[1]?(wrapper&&impl?'public through Writer reexport':'crate-internal effective'): 'private';add(name,line,end,fn[2]?'async function':'function',visibility,methodEnds[line]);continue;}
    const d=t.match(/^(pub\s+)?(struct|enum|const|mod)\s+(\w+)/);
    if(d){add(d[3],line,line,d[2],d[1]?(wrapper?'public through parent reexport':'crate-internal effective'):'private',structs.find(e=>e[0]===line)?.[1]??line);continue;}
    if(impl&&line===impl[0]){add(impl[2]+'::<inherent impl>',line,line,'implementation',wrapper?'public type implementation':impl[2]==='PageMetadataSpill'?'private':'crate-internal');continue;}
    const field=struct&&t.match(/^    (pub\s+)?(\w+):/);if(field){add(struct[2]+'::'+field[2],line,line,'field',field[1]?'public on crate-internal type':'private');continue;}
    if(!wrapper&&[133,134].includes(line))add('PageSpillState::'+(line===133?'Pending':'Active'),line,line,'variant','private');
  }
}
const paths=new Set(batch.files.map(f=>f.path));
fs.writeFileSync('analysis/rust-symbols.json',JSON.stringify([...read('analysis/rust-symbols.json').filter(s=>!paths.has(s.path)),...out],null,2)+'\n');
fs.writeFileSync('analysis/iteration-055-symbols.json',JSON.stringify(out,null,2)+'\n');
console.log({symbols:out.length,files:batch.files.map(f=>({path:f.path,count:out.filter(s=>s.path===f.path).length}))});
