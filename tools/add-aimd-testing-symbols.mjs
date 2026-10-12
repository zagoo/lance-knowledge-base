import fs from 'node:fs';import path from 'node:path';import {root,output,linesOf}from './inventory.mjs';
const batch=JSON.parse(fs.readFileSync(path.join(output,'analysis/iteration-010-aimd-testing.json'),'utf8')),added=[];let a,src,pre;
const pub='public Rust API',priv='private implementation',test='private cfg(test)';
function select(n){a=batch.files.find(f=>f.path.endsWith('/'+n+'.rs'));src=linesOf(fs.readFileSync(path.join(root,a.path),'utf8'));pre='lance_core::utils::'+n+'::';}
function add(n,l,e,k,v=pub,callers='See local implementation and tests; complete external callers pending.',callees='See authored range and exact body for local calls; dependency internals remain pending.'){
 const r=a.ranges.find(([b,e])=>b<=l&&l<=e);if(!r)throw new Error(n);if(src[l-1].trim().startsWith('//'))throw new Error('Signature starts with comment: '+n);
 added.push({name:n.startsWith('<')?n:pre+n,path:a.path,line:l,end_line:e,kind:k,visibility:v,behavior:r[2],behavior_reference:`${a.path}:${r[0]}-${r[1]}`,callers,callees});}
function fn(n,l,v=pub,c,d){let e=l;while(!/[{;]\s*$/.test(src[e-1]))e++;add(n,l,e,'method/function',v,c,d);}
function imp(n,start,end,v,caller,callee){add(n+'::<implementation>',start,start,'implementation',v,caller,callee);for(let i=start;i<end;i++){const m=src[i].match(/^    (pub )?(?:async )?fn (\w+)/);if(m)fn(n+'::'+m[2],i+1,m[1]||n.startsWith('<')?v:priv,caller,callee);}}
function fields(n,items,v=priv){for(const[f,l]of items)add(n+'::'+f,l,l,'field',v,'Owned by containing state/config/wrapper.','No call; exact field type retained.');}
select('aimd');for(const[n,l,k,v]of [['AimdConfig',34,'struct',pub],['RequestOutcome',192,'enum',pub],['AimdState',197,'struct',priv],['AimdController',208,'struct',pub],['RequestOutcome::Success',193,'variant',pub],['RequestOutcome::Throttled',194,'variant',pub]])add(n,l,l,k,v);
fields('AimdConfig',[['initial_rate',35],['min_rate',36],['max_rate',37],['decrease_factor',38],['additive_increment',39],['window_duration',40],['throttle_threshold',41]],pub);fields('AimdState',[['rate',198],['window_start',199],['success_count',200],['throttle_count',201]]);fields('AimdController',[['config',209],['state',210]]);
imp('<lance_core::utils::aimd::AimdConfig as Default>',44,56,pub,'Tests and external configuration consumers pending.','Duration::from_secs and literal defaults.');
imp('AimdConfig',58,185,pub,'AimdController::new invokes validate; tests and external builders pending.','f64::is_finite; Duration::is_zero; range contains; Error::invalid_input; consuming field replacement.');
imp('<lance_core::utils::aimd::AimdController as std::fmt::Debug>',213,220,pub,'Debug formatting.','Formatter debug_struct; current_rate (locks Mutex).');
imp('AimdController',222,290,pub,'Local tests; external object-store rate limit callers pending.','AimdConfig::validate; Mutex new/lock/unwrap; Instant now/duration_since; private record_outcome_inner; f64 floor/ceiling arithmetic.');
for(let i=292;i<src.length;i++){const m=src[i].match(/^    fn (\w+)/);if(m)fn('tests::'+m[1],i+1,test,'Test harness and rstest cases.','Config builders/validate; controller state lock and explicit-time helper; assertions.');}
select('testing');for(const[n,l,k,v]of [['PolicyFnT',29,'trait',pub],['PolicyFn',36,'type alias',priv],['ObjectMetaPolicyFnT',40,'trait',pub],['ObjectMetaPolicyFn',47,'type alias',priv],['ProxyObjectStorePolicy',58,'struct',pub],['ProxyObjectStore',95,'struct',pub],['CountingObjectStore',134,'struct',pub]])add(n,l,l,k,v);
fields('ProxyObjectStorePolicy',[['before_policies',62],['object_meta_policies',65]]);fields('ProxyObjectStore',[['target',96],['policy',97]]);fields('CountingObjectStore',[['target',135],['listing_count',136]]);
add('<F as lance_core::utils::testing::PolicyFnT>::<implementation>',30,30,'blanket implementation',pub);add('<F as lance_core::utils::testing::ObjectMetaPolicyFnT>::<implementation>',41,41,'blanket implementation',pub);
for(const[n,l,e,v,c,d]of [
 ['<dyn lance_core::utils::testing::PolicyFnT as Debug>',31,35,pub,'Debug of policy Arc/maps.','write! literal PolicyFn.'],
 ['<dyn lance_core::utils::testing::ObjectMetaPolicyFnT as Debug>',42,46,pub,'Debug of metadata policy Arc/maps.','write! literal PolicyFn.'],
 ['ProxyObjectStorePolicy',68,87,pub,'Test consumers with mutable policy access (external pending).','Default; HashMap insert/remove; name to_string.'],
 ['ProxyObjectStore',100,121,pub,'Public constructor; ObjectStore overrides call before_method/transform_meta.','Mutex lock/unwrap; policy Fn invocation; core-to-object-store Error conversion.'],
 ['<lance_core::utils::testing::ProxyObjectStore as std::fmt::Display>',123,127,pub,'ObjectStore trait/display consumers.','write! target Display.'],
 ['CountingObjectStore',139,157,pub,'Public constructor; list/list_with_delimiter overrides.','AtomicUsize fetch_add SeqCst; target.list.'],
 ['<lance_core::utils::testing::CountingObjectStore as std::fmt::Display>',159,163,pub,'ObjectStore trait/display consumers.','write! target Display.'],
 ['<lance_core::utils::testing::ProxyObjectStore as ObjectStore>',166,251,pub,'ObjectStore trait calls; concrete test consumers pending.','before_method/transform_meta; target methods; stream and_then/boxed; future::ready; Mutex; policy Fn invocation.'],
 ['<lance_core::utils::testing::CountingObjectStore as ObjectStore>',254,300,pub,'ObjectStore trait calls; concrete listing assertions pending.','record_listing/delegate_list; target ObjectStore methods; boxed stream.']
])imp(n,l,e,v,c,d);
const file=path.join(output,'analysis/rust-symbols.json'),paths=new Set(batch.files.map(f=>f.path));const prior=JSON.parse(fs.readFileSync(file,'utf8')).filter(s=>!paths.has(s.path));fs.writeFileSync(file,JSON.stringify([...prior,...added],null,2)+'\n');console.log(JSON.stringify({added:added.length,rust_total:prior.length+added.length}));
