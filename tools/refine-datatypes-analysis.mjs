import fs from 'node:fs';
for(const [filename, substitutions] of [
 ['analysis/iteration-005-datatypes.json',[
 ['dictionary_with_values builds','dict builds'],
 ['test_schema_with_manifest_dictionary_metadata_is_reflexive','test_manifest_derived_dictionary_schemas_compare_equal'],
 ['returns Error::invalid_input with the unknown numeric value','returns Error::invalid_input_source wrapping the unknown numeric value in its message']]],
 ['analysis/iteration-005-field.json',[
 ['Private PACKED_STRUCT_KEYS','Private PACKED_KEYS'],
 ['Private tests import rstest-related support, arrays','Private tests import arrays']]]]) {
 const doc=JSON.parse(fs.readFileSync(filename,'utf8'));
 for(const [a,b]of substitutions)for(const r of doc.files[0].ranges)r[2]=r[2].replaceAll(a,b);
 if(filename.endsWith('field.json')){
  const rs=doc.files[0].ranges;
  rs.find(r=>r[0]===1204)[1]=1226;
  const map=rs.find(r=>r[0]===1232);map[0]=1227;map[1]=1257;
  rs.find(r=>r[0]===1265)[0]=1258;
  const at=rs.findIndex(r=>r[0]===1852);
  rs.splice(at,2,[1852,2028,rs[at][2]+' '+rs[at+1][2]]);
 }
 fs.writeFileSync(filename,JSON.stringify(doc,null,2)+'\n');
}
