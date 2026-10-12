import fs from 'node:fs';
const document='L1-modules/rust-lance-table-transactions.md',before=fs.readFileSync(document,'utf8'),changes=[];
let after=before.replace(/^### (transaction\.rs|builder\.rs|prepare\.rs|operation\.rs|update_map\.rs):(\d+-\d+)$/gm,(heading,file,range)=>{
 const full='rust/lance-table/src/'+(file==='transaction.rs'?file:'transaction/'+file);
 const replacement=`### ${full}:${range}`;changes.push({before:heading,after:replacement});return replacement;
});
if(changes.length!==16)throw Error('Expected16 heading corrections');
after=after.replace('Public operation variant payloads are listed separately to keep their scope explicit; methods follow below.','The Operation excerpt includes every variant payload; callable signatures follow below.');
fs.writeFileSync(document,after);
const tool='tools/update-transaction-definition-layers-037.mjs';let script=fs.readFileSync(tool,'utf8');script=script.replace('### ${f}:${b}-${e}','### ${a.path}:${b}-${e}').replace('Public operation variant payloads are listed separately to keep their scope explicit; methods follow below.','The Operation excerpt includes every variant payload; callable signatures follow below.');fs.writeFileSync(tool,script);
fs.writeFileSync('analysis/iteration-038-heading-corrections.json',JSON.stringify({iteration:38,document,changes,scope:'Reference-only headings and excerpt-description precision; source/L2/symbol coverage unchanged.',generator:tool},null,2)+'\n');
console.log({corrected:changes.length});
