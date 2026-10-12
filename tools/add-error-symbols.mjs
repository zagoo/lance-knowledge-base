import fs from 'node:fs';
import path from 'node:path';
import {root,output,linesOf} from './inventory.mjs';
const relative='rust/lance-core/src/error.rs';
const src=linesOf(fs.readFileSync(path.join(root,relative),'utf8'));
const entry=JSON.parse(fs.readFileSync(path.join(output,'MANIFEST.json'),'utf8')).files.find(f=>f.path===relative);
const analysis=JSON.parse(fs.readFileSync(path.join(output,entry.analysis_record),'utf8')).files.find(f=>f.path===relative);
const prefix='lance_core::error::';
const symbols=[];
function add(name,line,end_line,kind,visibility,callees='See authored L2 interval; no complete external call graph.',callers='Local constructor/conversion/test relationships are described in L2; complete external callers pending.'){
 const r=analysis.ranges.find(([a,b])=>a<=line&&line<=b);
 if(!r)throw new Error('Missing authored range '+line);
 symbols.push({name:name.startsWith('<')?name:prefix+name,path:relative,line,end_line,kind,visibility,behavior:r[2],callees,callers,behavior_reference:`${relative}:${r[0]}-${r[1]}`});
}
const pub='public Rust API',priv='private',test='private cfg(test)';
for(const [n,l,e,k,v] of [
 ['BoxedError',9,9,'type alias',priv],['backtrace_support::MaybeBacktrace',18,18,'struct','pub type inside private module; cfg(backtrace)'],['backtrace_support::MaybeBacktrace',40,40,'struct','pub type inside private module; cfg(not(backtrace))'],
 ['FieldNotFoundError',62,62,'struct',pub],['FieldNotFoundError::field_name',63,63,'field',pub],['FieldNotFoundError::candidates',64,64,'field',pub],
 ['CommitStatusUnknownError',100,100,'struct',pub],['CommitStatusUnknownError::version',101,101,'field',priv],['CommitStatusUnknownError::source',102,102,'field',priv],
 ['box_error',131,131,'function',pub],['FenceReason',138,138,'enum',pub],['FenceReason::PeerClaimedEpoch',140,140,'variant',pub],['FenceReason::PersistenceFailure',143,143,'variant',pub],
 ['Error',159,159,'enum',pub],['error_source_is_not_found',813,813,'function',priv],['LanceOptionExt',824,824,'trait',pub],['LanceOptionExt::expect_ok',828,828,'trait method',pub],
 ['Result',838,838,'type alias',pub],['ArrowResult',839,839,'type alias',pub],['DataFusionResult',841,841,'type alias','public Rust API; cfg(datafusion)'],
 ['get_caller_location',1054,1054,'function',pub],['CloneableError',1074,1074,'struct',pub],['DisplayError',1076,1076,'struct',priv],['CloneableResult',1141,1141,'struct',pub],
 ['test::MyCustomError',1298,1301,'struct',test],['test::MyCustomError::code',1299,1299,'field',test],['test::MyCustomError::message',1300,1300,'field',test]
])add(n,l,e,k,v);

// Explicitly reviewed trait implementations, including cfg-duplicate helpers.
for(const [n,l,e,v,c] of [
 ['<lance_core::error::backtrace_support::MaybeBacktrace as snafu::GenerateImplicitData>::generate',21,21,priv,'Option<Backtrace>::generate; cfg(backtrace)'],
 ['<lance_core::error::backtrace_support::MaybeBacktrace as snafu::AsBacktrace>::as_backtrace',27,27,priv,'Option::as_ref; cfg(backtrace)'],
 ['<lance_core::error::backtrace_support::MaybeBacktrace as snafu::GenerateImplicitData>::generate',43,43,priv,'Unit construction; cfg(not(backtrace))'],
 ['<lance_core::error::backtrace_support::MaybeBacktrace as snafu::AsBacktrace>::as_backtrace',49,49,priv,'None; cfg(not(backtrace))'],
 ['<lance_core::error::FieldNotFoundError as std::fmt::Display>::fmt',68,68,pub,'write!; levenshtein::find_best_suggestion; candidate iteration'],
 ['CommitStatusUnknownError::version',107,107,pub,'None; field access'],
 ['<lance_core::error::CommitStatusUnknownError as std::fmt::Display>::fmt',113,113,pub,'write!; source Display'],
 ['<lance_core::error::CommitStatusUnknownError as std::error::Error>::source',124,124,pub,'Box::as_ref'],
 ['<lance_core::error::FenceReason as std::fmt::Display>::fmt',147,147,pub,'Formatter::write_str'],
 ['<Option<T> as lance_core::error::LanceOptionExt<T>>::expect_ok',833,833,pub,'Option::ok_or_else; Error::internal'],
 ['<lance_core::error::DisplayError as std::fmt::Debug>::fmt',1079,1079,priv,'Own Display::fmt'],
 ['<lance_core::error::DisplayError as std::fmt::Display>::fmt',1085,1085,priv,'Inner Error Display::fmt'],
 ['<lance_core::error::DisplayError as std::error::Error>::source',1091,1091,priv,'Some(&self.0)'],
 ['<lance_core::error::CloneableError as Clone>::clone',1098,1098,pub,'downcast_ref; source; to_string; Error constructors; FencedSnafu::build'],
 ['<lance_core::error::CloneableResult<T> as From<lance_core::error::Result<T>>>::from',1144,1144,pub,'Result::map_err(CloneableError)'],
 ['<lance_core::error::test::MyCustomError as std::fmt::Display>::fmt',1304,1304,test,'write!']
])add(n,l,e,'method',v,c);

// Enum member ranges retain exact field types and implicit Snafu annotations.
for(let i=159;i<425;i++){
 const m=src[i].match(/^    ([A-Z]\w*)(?:\s*\{|,)/);
 if(!m)continue;
 let end=i;
 if(src[i].trimEnd().endsWith('{')){while(!/^    },/.test(src[end]))end++;}
 add('Error::'+m[1],i+1,end+1,'variant',pub,'Snafu derives display/source/context behavior from retained attributes.');
 for(let j=i+1;j<end;j++){
  const field=src[j].match(/^        (\w+): /);
  if(field)add(`Error::${m[1]}::${field[1]}`,j+1,j+1,'variant field',pub,'Implicit generation only for fields annotated snafu(implicit).');
 }
}

// Every explicit public Error method, with full multiline signature.
for(let i=427;i<811;i++){
 const m=src[i].match(/^    pub fn (\w+)/);if(!m)continue;
 let end=i;while(!src[end].trimEnd().endsWith('{'))end++;
 let close=end+1;while(!/^    }$/.test(src[close]))close++;
 const body=src.slice(end+1,close).join('\n');
 const selectors=[...new Set([...body.matchAll(/\b([A-Z]\w*Snafu)\b/g)].map(m=>m[1]))];
 const local=[...new Set([...body.matchAll(/\bSelf::(\w+)\(/g)].map(m=>'Error::'+m[1]))];
 const callees=[...selectors.map(n=>n+'::build/into_error (as written)'),...local];
 if(m[1]==='is_not_found')callees.push('downcast_ref; error_source_is_not_found');
 if(m[1]==='backtrace')callees.push(i+1===433?'AsBacktrace::as_backtrace':'None');
 if(m[1]==='commit_status_unknown_source')callees.push('box_error; CommitStatusUnknownError construction');
 const refs=src.flatMap((s,j)=>j!==i&&new RegExp(`(?:Self|Error)::${m[1]}\\(`).test(s)?[j+1]:[]);
 add('Error::'+m[1],i+1,end+1,'method',pub,callees.join('; ')||'Field matching/construction; Option/Result operations as described in L2.',refs.length?`Observed same-file lexical references at lines ${refs.join(', ')}; complete repository callers pending.`:undefined);
}

for(const [from,to,l]of [
 ['arrow_schema::ArrowError','lance_core::error::Error',845],['&arrow_schema::ArrowError','lance_core::error::Error',861],['std::io::Error','lance_core::error::Error',868],['object_store::Error','lance_core::error::Error',886],
 ['prost::DecodeError','lance_core::error::Error',897],['prost::EncodeError','lance_core::error::Error',904],['prost::UnknownEnumValue','lance_core::error::Error',911],['tokio::task::JoinError','lance_core::error::Error',918],['object_store::path::Error','lance_core::error::Error',925],['url::ParseError','lance_core::error::Error',932],['serde_json::Error','lance_core::error::Error',939],['lance_core::error::Error','arrow_schema::ArrowError',945],
 ['datafusion_sql::sqlparser::parser::ParserError','lance_core::error::Error',960],['datafusion_sql::sqlparser::tokenizer::TokenizerError','lance_core::error::Error',968],['lance_core::error::Error','datafusion_common::DataFusionError',976],['datafusion_common::DataFusionError','lance_core::error::Error',984],['lance_core::error::Error','object_store::Error',1045]
])add(`<${to} as From<${from}>>::from`,l,l,'conversion',l>=960&&l<=984?'public Rust API; cfg(datafusion)':pub,'Exact classification/downcast/stringification callees are enumerated in the authored interval.');

for(let i=1149;i<src.length;i++){
 const m=src[i].match(/^    fn (\w+)/);if(!m)continue;
 let end=i;while(!src[end].trimEnd().endsWith('{'))end++;
 add('test::'+m[1],i+1,end+1,'test',test,'Error constructors/conversions/accessors and assertions listed in L2.','Rust test harness; some tests cfg(datafusion/backtrace).');
}
const filename=path.join(output,'analysis/rust-symbols.json');
const existing=JSON.parse(fs.readFileSync(filename,'utf8')).filter(s=>s.path!==relative);
fs.writeFileSync(filename,JSON.stringify([...existing,...symbols],null,2)+'\n');
console.log(JSON.stringify({added:symbols.length,variants:symbols.filter(s=>s.kind==='variant'&&s.name.startsWith(prefix+'Error::')).length,total:existing.length+symbols.length}));
