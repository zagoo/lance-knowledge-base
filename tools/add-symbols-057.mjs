import fs from 'node:fs';
import {root,linesOf} from './inventory.mjs';
const read=p=>JSON.parse(fs.readFileSync(p)),f=read('analysis/iteration-057-batch.json').files[0],src=linesOf(fs.readFileSync(root+'/'+f.path,'utf8')),out=[];
const ends={45:52,54:62,64:70,73:100,107:124,127:153,159:188,195:295,306:448,457:552,558:610,612:620,628:688,692:718,720:729,734:815,825:882,891:952,960:1049,1052:1082,1089:1176,1181:1224,1227:1296,1298:1308,1314:1342,1345:1364,1367:1380,1383:1446,1449:1618,1621:1714,1717:1792,1795:1890,1892:1895,1897:1914,1916:1945,1951:1963,1966:1975};
const ns='lance_file::writer::writer_tests::tests';
function add(name,line,end,bodyEnd,kind){const ranges=f.ranges.filter(r=>r[0]<=bodyEnd&&r[1]>=line);out.push({name:ns+(name?'::'+name:''),path:f.path,line,end_line:end,body_end_line:bodyEnd,kind,visibility:'private cfg(test)',cfg:'test',language:'Rust',behavior:ranges.map(r=>r[2]).join(' '),behavior_reference:ranges.map(r=>`${f.path}:${r[0]}-${r[1]}`).join('; '),callers:kind==='test function'?'Tokio/Rust/rstest test discovery; each exact case matrix is recorded in L2. No production caller.':'Private local test functions; parent writer module includes writer_tests.rs under cfg(test). The source appendix shows all lexical use sites.',callees:'Exact-version writer/projection factories, FileWriter methods, FileReader async/blocking APIs, Arrow constructors, encoding strategy/BatchEncoder/encode_batch, local test helpers and object-store operations as specified in the complete authored ranges. No test result or full underlying implementation coverage is implied.'});}
add('',5,5,5,'module');
for(let i=0;i<src.length;i++){
 const m=src[i].match(/^    (async\s+)?fn\s+(\w+)/);if(!m)continue;
 const line=i+1;let end=line;while(!/\{\s*$/.test(src[end-1]))end++;
 if(!ends[line])throw Error('Missing function end '+line);
 add(m[2],line,end,ends[line],m[2].startsWith('test_')?'test function':m[1]?'async helper':'helper function');
}
for(const [name,line,end]of [['test_read_unequal_length_projection::read',358,376],['test_read_unequal_length_projection::col_values',377,389],['test_writer_rejects_unconverted_arrow_json::in_struct',644,650],['test_writer_rejects_unconverted_arrow_json::batch_of',652,661]])add(name,line,line,end,'local closure');
fs.writeFileSync('analysis/iteration-057-symbols.json',JSON.stringify(out,null,2)+'\n');
fs.writeFileSync('analysis/rust-symbols.json',JSON.stringify([...read('analysis/rust-symbols.json').filter(s=>s.path!==f.path),...out],null,2)+'\n');
console.log({new_symbols:out.length,functions:Object.keys(ends).length,tests:out.filter(s=>s.kind==='test function').length,helpers:out.filter(s=>s.kind.includes('helper')).length,closures:4});
