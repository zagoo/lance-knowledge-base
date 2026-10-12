import fs from 'node:fs';import{root,linesOf}from'./inventory.mjs';
const read=p=>JSON.parse(fs.readFileSync(p)),files=read('analysis/iteration-065-batch.json').files,out=[];
const specs=[[
['bench_reader',30,30,126,'benchmark function','private',null,'Criterion benches group.','Datagen; Runtime; ObjectStore; versions::create_writer; ScanScheduler; FileReader::read_tasks; buffered task consumption; Criterion.'],
['drop_file_from_cache',129,129,131,'function','pub in benchmark executable','not(target_os = "linux")','bench_random_access iter_batched setup for nocache.','Immediate Ok, no IO.'],
['drop_file_from_cache',134,134,149,'function','pub in benchmark executable','target_os = "linux"','bench_random_access iter_batched setup for nocache.','File::open; AsRawFd; unsafe libc::posix_fadvise; from_raw_os_error.'],
['MAX_PARALLELISM',151,151,151,'constant','private'],['ROW_GAP',153,153,153,'constant','private'],['TOTAL_ROWS',154,154,154,'constant','private'],
['CachedReader',156,156,156,'struct','private'],['CachedReader::reader',157,157,157,'field','private'],['CachedReader::indices',158,158,158,'field','private'],['CachedReader::runtime',159,159,159,'field','private'],
['CachedReaders',162,162,162,'struct','private'],['CachedReaders::all_indices',163,163,163,'field','private'],['CachedReaders::readers',164,164,164,'field','private'],
['FileCache',167,167,167,'type alias','private'],
['get_cached_readers',173,178,263,'function','private',null,'bench_random_access before each store/version case registration.','Static cache lock; CPU sizing; ObjectStore; datagen; versioned writer; UInt32 selectors; current-thread Runtime; open_reader; read_task warmup.'],
['get_cached_readers::FILE_CACHE',181,181,181,'static','function-local private',null,'get_cached_readers lookup/insert.','LazyLock initialization; Mutex<HashMap>.'],
['open_reader',265,265,290,'function','private',null,'get_cached_readers for each worker.','Runtime::block_on; testing ScanScheduler; FileReader::try_open; test_cache.'],
['read_task',292,297,352,'function','private',null,'get_cached_readers warmup and both timed random-access thread modes.','Local read_batch closure; Runtime::block_on; selector slicing; buffer_unordered64.'],
['read_task::read_batch',300,300,335,'closure binding','function-local private',null,'read_task chunk stream.','FileReader::read_tasks Indices; sequential task awaits; raw Int32 sum; row-count assertion.'],
['bench_random_access',354,354,462,'benchmark function','private',null,'Criterion benches group.','get_cached_readers; CPU sizing; Criterion iter_batched; drop_file_from_cache; global runtime spawn_blocking/read_task.'],
['benches',465,469,469,'criterion group invocation','macro-generated','target_os = "linux"','criterion_main.','Criterion default significance0.1/sample10; PProfProfiler new100/Flamegraph(None); both benchmarks.'],
['benches',473,476,476,'criterion group invocation','macro-generated','not(target_os = "linux")','criterion_main.','Criterion default significance0.1/sample10; both benchmarks without profiler.'],
['main',477,477,477,'criterion main invocation','macro-generated',null,'Benchmark executable entry.','benches.']
],[
['proto_field',10,10,18,'function','private',null,'wide_two_leaf_structs.','Construct default-filled pb::Field with owned logical type.'],
['wide_two_leaf_structs',24,24,52,'function','private',null,'bench_schema_reconstruction setup.','Even-count assertion; Vec allocation; proto_field three times per root.'],
['bench_schema_reconstruction',54,54,70,'benchmark function','private',null,'Criterion benches group.','wide_two_leaf_structs; Criterion::bench_with_input; black_box; Schema::try_from.'],
['benches',72,72,72,'criterion group invocation','macro-generated',null,'criterion_main.','Default Criterion config; bench_schema_reconstruction.'],
['main',73,73,73,'criterion main invocation','macro-generated',null,'Benchmark executable entry.','benches.']
]];
for(let j=0;j<files.length;j++){const f=files[j],src=linesOf(fs.readFileSync(root+'/'+f.path,'utf8')),ns='lance_file::benches::'+(j?'schema':'reader');for(const[name,line,end,bodyEnd,kind,visibility,cfg=null,callers,callees]of specs[j]){const rs=f.ranges.filter(r=>r[0]<=bodyEnd&&r[1]>=line);out.push({name:ns+'::'+name,path:f.path,line,end_line:end,body_end_line:bodyEnd,kind,visibility,cfg,language:'Rust',behavior:rs.map(r=>r[2]).join(' '),behavior_reference:rs.map(r=>`${f.path}:${r[0]}-${r[1]}`).join('; '),callers:callers??'Containing benchmark setup/read workload; not library API.',callees:callees??'Declaration/stored value; local uses in cited ranges.'});}}
fs.writeFileSync('analysis/iteration-065-symbols.json',JSON.stringify(out,null,2)+'\n');fs.writeFileSync('analysis/rust-symbols.json',JSON.stringify([...read('analysis/rust-symbols.json').filter(s=>!files.some(f=>f.path===s.path)),...out],null,2)+'\n');
fs.writeFileSync('analysis/iteration-065-symbol-declaration-review.txt',out.map(s=>{const src=linesOf(fs.readFileSync(root+'/'+s.path,'utf8'));return `${s.path}:${s.line}-${s.end_line}/${s.body_end_line} ${s.kind} ${s.visibility} cfg=${s.cfg??'none'} ${s.name}\n  ${src.slice(s.line-1,s.end_line).join(' ').trim()}`;}).join('\n')+'\n');console.log({symbols:out.length,files:files.length});
