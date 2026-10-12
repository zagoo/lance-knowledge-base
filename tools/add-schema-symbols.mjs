import fs from 'node:fs';
import path from 'node:path';
import {root,output,linesOf}from './inventory.mjs';
const p='rust/lance-core/src/datatypes/schema.rs',src=linesOf(fs.readFileSync(path.join(root,p),'utf8'));
const entry=JSON.parse(fs.readFileSync(path.join(output,'MANIFEST.json'),'utf8')).files.find(f=>f.path===p);
const a=JSON.parse(fs.readFileSync(path.join(output,entry.analysis_record),'utf8')).files.find(f=>f.path===p);
const prefix='lance_core::datatypes::',pub='public Rust API; re-exported through datatypes',priv='private schema implementation';
const added=[];
function add(n,l,e,k,v=pub,c='See authored range for exact local control flow; complete repository callers/callees pending.'){
 const r=a.ranges.find(([s,e])=>s<=l&&l<=e);if(!r)throw new Error('Missing authored range');
 added.push({name:n.startsWith('<')?n:prefix+n,path:p,line:l,end_line:e,kind:k,visibility:v,behavior:r[2],behavior_reference:`${p}:${r[0]}-${r[1]}`,callers:'Local relationships/tests retained in L2; complete external call graph pending.',callees:c});
}
function fn(n,l,v=pub,c){let e=l;while(!src[e-1].trimEnd().endsWith('{'))e++;add(n,l,e,'method/function',v,c);}
for(const[n,start,end,v]of [['Schema',26,31,pub],['FieldRef',35,40,pub],['schema::SchemaFieldIterPreOrder',83,85,priv],['OnMissing',1094,1097,pub],['BlobHandling',1112,1130,pub],['Projection',1196,1204,pub]]){
 add(n,start,start,src[start-1].includes('enum')?'enum':'struct',v);
 for(let i=start;i<end;i++){
  const f=src[i].match(/^    (pub )?(\w+): /),ev=src[i].match(/^    ([A-Z]\w*)(?:\([^)]*\))?,/);
  if(f)add(n+'::'+f[2],i+1,i+1,'field',f[1]?pub:priv);
  if(ev)add(n+'::'+ev[1],i+1,i+1,'variant',v);
 }
}
add('Projectable',1100,1100,'trait');add('Projectable::schema',1101,1101,'trait method');
for(const[n,l,v,c]of [
 ['FieldRef::into_id',44,pub,'Schema::field_by_id/field/field_paths; Error::invalid_input_source/field_not_found'],
 ['schema::SchemaFieldIterPreOrder::new',88,priv,'Vec::with_capacity; reversed field iteration'],
 ['validate_fixed_size_list_dimensions',124,pub,'Recursive self; Error::schema'],
 ['schema::compare_fields',930,'pub in private module; not publicly re-exported','HashSet/HashMap name mapping; Field::compare_with_options'],
 ['schema::explain_fields_difference',982,'pub in private module; not publicly re-exported','HashSet differences; Field::explain_differences; format!/join'],
 ['schema::explain_metadata_difference',1078,priv,'HashMap equality; Debug formatting'],
 ['parse_field_path',1581,pub,'Unicode chars/peekable; Error::schema; String/Vec accumulation'],
 ['format_field_path',1674,pub,'char::is_alphanumeric; String::replace; format!/join'],
 ['format_field_path_minimal',1720,pub,'str::contains/replace; format!/join'],
 ['escape_field_path_for_project',1745,pub,'parse_field_path; fallback whole-name segment; replace/format!/join']
])fn(n,l,v,c);
const traitMethods=[
 ['<lance_core::datatypes::FieldRef<\'_> as From<i32>>::from',65,pub],
 ["<lance_core::datatypes::FieldRef<'a> as From<&'a str>>::from",71,pub],
 ["<lance_core::datatypes::FieldRef<'a> as From<&'a String>>::from",77,pub],
 ["<lance_core::datatypes::schema::SchemaFieldIterPreOrder<'a> as Iterator>::next",101,priv],
 ['<lance_core::datatypes::Schema as PartialEq>::eq',875,pub],
 ['<lance_core::datatypes::Schema as std::fmt::Display>::fmt',881,pub],
 ['<lance_core::datatypes::Schema as TryFrom<&arrow_schema::Schema>>::try_from',893,pub],
 ['<arrow_schema::Schema as From<&lance_core::datatypes::Schema>>::from',913,pub],
 ['<lance_core::datatypes::Schema as TryFrom<&Self>>::try_from',925,pub],
 ['<lance_core::datatypes::Schema as lance_core::datatypes::Projectable>::schema',1105,pub],
 ['<lance_core::datatypes::Projection as std::fmt::Debug>::fmt',1207,pub]
];for(const[n,l,v]of traitMethods)fn(n,l,v);
for(const[n,l,v]of [["<lance_core::datatypes::schema::SchemaFieldIterPreOrder<'a> as Iterator>::Item",99,priv],['<lance_core::datatypes::Schema as TryFrom<&arrow_schema::Schema>>::Error',891,pub],['<lance_core::datatypes::Schema as TryFrom<&Self>>::Error',923,pub]])add(n,l,l,'associated type',v);
for(const[n,start,end]of [['Schema',136,872],['BlobHandling',1132,1189],['Projection',1225,1565]]){
 for(let i=start;i<end;i++){
  const m=src[i].match(/^    (pub )?fn (\w+)/);if(!m)continue;
  fn(n+'::'+m[2],i+1,m[1]?pub:priv);
 }
}
for(let i=1761;i<src.length;i++){
 const m=src[i].match(/^    fn (\w+)/);if(m)fn('schema::tests::'+m[1],i+1,'private cfg(test) module','Test fixture construction/assertions enumerated in authored range; not executed.');
}
const filename=path.join(output,'analysis/rust-symbols.json');const previous=JSON.parse(fs.readFileSync(filename,'utf8')).filter(s=>s.path!==p);
fs.writeFileSync(filename,JSON.stringify([...previous,...added],null,2)+'\n');
console.log(JSON.stringify({added:added.length,public:added.filter(s=>s.visibility===pub).length,total:previous.length+added.length}));
