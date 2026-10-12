import fs from 'node:fs';
import path from 'node:path';
import {root, output, linesOf} from './inventory.mjs';

const filename=path.join(output,'analysis/rust-symbols.json');
const old=JSON.parse(fs.readFileSync(filename,'utf8'));
const added=[];
function add(file,name,line,end_line,kind,visibility,behavior,callees='None; data declaration.',callers='Local uses described in L2; complete repository callers pending.') {
  added.push({name:name.startsWith('lance_core::')?name:`lance_core::utils::${file}::${name}`,path:`rust/lance-core/src/utils/${file}.rs`,line,end_line,kind,visibility,behavior,callees,callers});
}
const pub='public Rust API', priv='private', test='private cfg(test)';
add('cpu','SimdSupport',13,13,'enum',pub,'Non-exhaustive SIMD dispatch tier; not an on-disk discriminant.');
for(const [n,l] of [['None',14],['Neon',15],['Sse',16],['Avx',22],['AvxFma',25],['Avx2',30],['Avx512',31],['Avx512FP16',32],['Lsx',33],['Lasx',34]])add('cpu',`SimdSupport::${n}`,l,l,'variant',pub,'Representable tier; exact detection and Display contracts in L2.');
add('cpu','SimdSupport::Display::fmt',40,40,'trait implementation method',pub,'Lowercase diagnostic tier labels.','Formatter::write_str');
add('cpu','SimdInfo',64,64,'struct',pub,'Owned diagnostic snapshot, distinct from process-global dispatch state.');
for(const [n,l,b] of [['tier',66,'Selected cached tier.'],['target_arch',68,'Compile target architecture string.'],['host_features',72,'Owned x86 feature-string subset; empty off x86.']])add('cpu',`SimdInfo::${n}`,l,l,'field',pub,b);
add('cpu','simd_info',90,90,'function',pub,'Report cached tier, architecture, and freshly constructed raw feature list.','detect_host_features; LazyLock dereference; std::env::consts::ARCH','Python binding lexical use python/src/lib.rs:393-393; complete callers pending.');
for(const [l,b] of [[99,'x86_64 cfg: inspect 17 named capabilities in fixed order.'],[159,'non-x86_64 cfg: empty vector.']])add('cpu','detect_host_features',l,l,'function',priv,b,'is_x86_feature_detected! or Vec::new','simd_info');
add('cpu','SIMD_SUPPORT',164,164,'static',pub,'Cached platform policy with explicit FMA gating and architecture fallbacks.','LazyLock::new; x86/aarch64/loongarch64 helpers; architecture detection macros','simd_info; tests; downstream dispatchers pending.');
add('cpu','x86::check_flag',232,232,'function','private in private x86 module','Test requested bit.','shift and bitwise AND','x86::has_avx512_f16_support');
add('cpu','x86::has_avx512_f16_support',236,236,'function','pub item inside private x86 module','Require AVX512F, then CPUID7 EDX bit23.','has_avx512; unsafe __cpuid; check_flag','SIMD_SUPPORT');
add('cpu','x86::has_avx512',251,251,'function','pub item inside private x86 module','Runtime avx512f detection.','is_x86_feature_detected!','SIMD_SUPPORT; has_avx512_f16_support');
for(const [l,b,c] of [[262,'aarch64 macOS cfg: assume support.','None; returns true.'],[270,'aarch64 Linux cfg: test HWCAP_FPHP.','unsafe libc::getauxval'],[279,'aarch64 Windows cfg: disabled.','None; returns false.'],[301,'aarch64 Android cfg: disabled.','None; returns false.']])add('cpu','aarch64::has_neon_f16_support',l,l,'function','pub item inside private platform module',b,c,'SIMD_SUPPORT under matching cfg');
for(const [n,l] of [['lsx',287],['lasx',292]])add('cpu',`loongarch64::has_${n}_support`,l,l,'function','pub item inside private module',`Test HWCAP_LOONGARCH_${n.toUpperCase()}.`,'unsafe libc::getauxval','SIMD_SUPPORT');
for(const [n,l,e,b] of [['simd_info_exposes_tier',312,312,'Tier and architecture identity.'],['simd_info_features_include_baseline',321,321,'x86 host includes sse2.'],['simd_info_features_empty_off_x86_64',330,330,'Other targets report empty raw list.'],['avx_fma_tiers_are_only_selected_when_fma_is_detected',342,342,'Selected FMA-requiring tiers imply detected FMA.'],['simd_support_display_matches_lowercase_convention',363,366,'Ten rstest cases pin lowercase Display.']])add('cpu',`tests::${n}`,l,e,'test',test,b,'simd_info/SIMD_SUPPORT; Display; assert!/assert_eq!','Rust test harness');

add('tokio','NUM_COMPUTE_INTENSIVE_CPUS',16,17,'static',priv,'Once-initialized compute count.','LazyLock::new; calculate_num_compute_intensive_cpus','get_num_compute_intensive_cpus');
add('tokio','get_num_compute_intensive_cpus',19,19,'function',pub,'Read cached count, initialize on first access.','NUM_COMPUTE_INTENSIVE_CPUS','create_runtime; complete external callers pending.');
add('tokio','calculate_num_compute_intensive_cpus',23,23,'function',priv,'Explicit positive CPU override, else CPUs minus IO reservation with minimum one.','std::env::var; parse_env_usize; num_cpus::get; IO_CORE_RESERVATION; log::warn!','NUM_COMPUTE_INTENSIVE_CPUS initializer');
add('tokio','parse_env_usize',50,50,'function',priv,'Trim and parse usize, reject values below minimum with contextual String error.','str::trim; parse; format!','CPU count and IO reservation initializers; tests');
add('tokio','IO_CORE_RESERVATION',70,70,'static',pub,'Cached LANCE_IO_CORE_RESERVATION, minimum zero, default two.','LazyLock::new; std::env::var; parse_env_usize','calculate_num_compute_intensive_cpus; complete external callers pending.');
add('tokio','create_runtime',78,78,'function',priv,'One async worker plus configured max blocking workers, very long keepalive.','Builder::new_multi_thread; get_num_compute_intensive_cpus; build; unwrap','global_cpu_runtime');
for(const [n,l,b] of [['CPU_RUNTIME',89,'Null or leaked published Runtime pointer.'],['RUNTIME_INSTALLED',91,'Initializer election flag, reset in child.'],['ATFORK_INSTALLED',93,'Atfork registration election flag, retained in child.']])add('tokio',n,l,l,'static',priv,b,'AtomicPtr/AtomicBool::new','global_cpu_runtime; atfork_tokio_child for first two');
add('tokio','global_cpu_runtime',95,95,'function',priv,'SeqCst publication; yield while another initializes; leaks Runtime for static lifetime. Initialization panic has no election reset guard.','AtomicPtr/AtomicBool load/fetch_or/store; yield_now; install_atfork; create_runtime; Box::into_raw','spawn_cpu');
add('tokio','atfork_tokio_child',122,122,'extern C function',priv,'Reset pointer and runtime-election flag in child without dropping inherited runtime.','AtomicPtr/AtomicBool::store','pthread_atfork callback');
for(const [l,b,c] of [[128,'non-Windows cfg: register child callback; ignore error code.','unsafe libc::pthread_atfork'],[133,'Windows cfg: no-op.','None.']])add('tokio','install_atfork',l,l,'function',priv,b,c,'global_cpu_runtime');
add('tokio','spawn_cpu',180,186,'function',pub,'Eager submission, traced closure, return Result unchanged or resume original panic through mapped join future.','Span::current/enter; global_cpu_runtime; Runtime::spawn_blocking; FutureExt::map; JoinError::try_into_panic; resume_unwind; panic!','Observed lexical uses include rust/lance-index/src/vector/storage.rs:74-74; rust/lance-encoding/src/encodings/logical/primitive.rs:7630-7630. Complete closure lifecycles pending.');
for(const [n,l,b] of [['spawn_cpu_reraises_the_closure_panic',220,'Original &str payload survives; temporarily mutates global panic hook.'],['parses_valid_value_and_trims_surrounding_whitespace',247,'Whitespace-trimmed positive integer.'],['rejects_non_integer_naming_the_variable',253,'Parse error names variable.'],['rejects_value_below_minimum',260,'Zero rejected for min1.'],['allows_zero_when_minimum_is_zero',268,'Zero allowed for min0.']])add('tokio',`tests::${n}`,l,l,'test',test,b,l===220?'spawn_cpu; tokio::spawn; panic hook and payload APIs; asserts':'parse_env_usize; asserts','Rust/Tokio test harness');

add('futures','Side',16,16,'enum',priv,'Exactly two owners, Left and Right.');
add('futures','Side::Left',17,17,'variant',priv,'First returned consumer.');
add('futures','Side::Right',18,18,'variant',priv,'Second returned consumer.');
add('futures','Capacity',23,23,'enum',pub,'Item-count capacity policy.');
add('futures','Capacity::Bounded',24,24,'variant',pub,'u32 permits; zero accepted and cannot advance.');
add('futures','Capacity::Unbounded',25,25,'variant',pub,'No semaphore; full backlog can remain in memory.');
add('futures','InnerState',28,28,'struct',priv,'Shared queue/ownership/liveness state protected by one Mutex.');
for(const [n,l,b] of [['inner',29,'Taken while being polled outside mutex; restored on ordinary return.'],['buffer',30,'FIFO cloned items for lagging side.'],['polling',31,'Exclusive underlying poll owner until Ready or owner drop.'],['waker',32,'Latest waiting peer waker.'],['exhausted',33,'Underlying EOF observed.'],['left_buffered',34,'Unread clones belonging to left.'],['right_buffered',35,'Unread clones belonging to right.'],['left_dropped',36,'Left handle destroyed.'],['right_dropped',37,'Right handle destroyed.'],['available_buffer',38,'Optional bounded replay permits.']])add('futures',`InnerState::${n}`,l,l,'field',priv,b);
add('futures','SharedStream',42,42,'struct',pub,'One of two independently pollable handles sharing replay state.');
add('futures','SharedStream::state',43,43,'field',priv,'Shared synchronized InnerState.');
add('futures','SharedStream::side',44,44,'field',priv,'Left or right identity.');
add('futures','SharedStream::new',48,48,'associated function',pub,'Initialize shared state and return two handles.','Semaphore/PollSemaphore::new; Arc/Mutex::new; VecDeque::new','BoxStream SharedStreamExt::share; direct callers pending.');
add('futures','SharedStream::Drop::drop',83,83,'trait implementation method',pub,'Discard own buffered clones, release permits, relinquish pending ownership and wake peer outside lock.','Mutex::lock; VecDeque::pop_front; Semaphore::add_permits; Waker::wake','Rust drop glue');
add('futures','SharedStream::Stream::Item',128,128,'associated type',pub,'T, requiring Clone on owner.');
add('futures','SharedStream::Stream::poll_next',130,133,'trait implementation method',pub,'Drain backlog; acquire permit; arbitrate polling; poll outside lock; clone for live peer; restore/wake.','Mutex::lock; PollSemaphore::poll_acquire; Option::take/expect; Stream::poll_next_unpin; T::clone; Waker::wake','Stream consumers; local tests');
add('futures','SharedStreamExt',249,252,'trait',pub,'Stream+Send extension requiring Clone items.');
add('futures','SharedStreamExt::share',265,268,'trait method',pub,'Consume boxed-compatible stream into two replay consumers.','Implementor supplied; local BoxStream implementation','Consumers and tests; complete external callers pending.');
add('futures','BoxStream::SharedStreamExt::share',272,272,'trait implementation method',pub,'Delegate boxed stream sharing to SharedStream::new.','SharedStream::new');
for(const [n,l,newLine,itemLine,pollLine,endLine] of [['FinallyStream',278,285,291,293,296],['OnDropStream',330,337,343,345,348]]) {
  add('futures',n,l,l,'struct',pub,n==='FinallyStream'?'Synchronous FnOnce at first observed EOF.':'Synchronous FnOnce at destruction, even unpolled.');
  add('futures',`${n}::stream`,l+2,l+2,'field',priv,'Pinned owned inner stream.');
  add('futures',`${n}::f`,l+3,l+3,'field',priv,'Optional callback consumed at most once.');
  add('futures',`${n}::new`,newLine,newLine,'associated function',pub,'Store stream and Some(callback).');
  add('futures',`${n}::Stream::Item`,itemLine,itemLine,'associated type',pub,'Preserve S::Item.');
  add('futures',`${n}::Stream::poll_next`,pollLine,endLine,'trait implementation method',pub,n==='FinallyStream'?'Forward poll and execute callback on first None.':'Only forward poll; EOF does not execute callback.',n==='FinallyStream'?'pin projection; Stream::poll_next; Option::take; F::call_once':'pin projection; Stream::poll_next');
}
add('futures','FinallyStreamExt',309,309,'trait',pub,'Owned stream EOF callback extension.');
add('futures','FinallyStreamExt::finally',310,310,'trait method',pub,'Default method constructs FinallyStream directly.','FinallyStream struct construction');
add('futures','S::FinallyStreamExt::finally',319,319,'trait implementation method',pub,'Blanket implementation constructs wrapper via new.','FinallyStream::new');
add('futures','OnDropStream::PinnedDrop::drop',355,355,'trait implementation method','private generated drop protocol','Take callback and execute once when wrapper drops.','pin projection; Option::take; F::call_once','pin_project generated drop glue');
add('futures','StreamOnDropExt',363,363,'trait',pub,'Drop callback extension, blanket implemented for all Stream.');
add('futures','StreamOnDropExt::on_drop',365,365,'trait method',pub,'Construct drop callback wrapper.','OnDropStream::new');
add('futures','tests::is_pending',383,383,'function',test,'One poll using noop waker.','noop_waker; Context::from_waker; FutureExt::poll_unpin','Local sharing tests');
add('futures','tests::FlagWaker',622,622,'struct',test,'Atomic wake observation.');
add('futures','tests::FlagWaker::ArcWake::wake_by_ref',625,625,'trait implementation method',test,'Set flag true SeqCst.','AtomicBool::store','Test waker');
for(const [n,l,b] of [['test_shared_stream',390,'Bounded backpressure/replay and repeated EOF.'],['test_shared_stream_replaces_waiting_waker',443,'Repeated peer polls Pending; no identity assertion.'],['test_unbounded_shared_stream',456,'Sequential independent full drains.'],['stress_shared_stream',482,'100 iterations, 1000 sends, order per item; no final count assertion.'],['test_on_drop_fires_on_early_drop',514,'Drop before EOF invokes callback.'],['test_on_drop_fires_after_exhaustion',531,'EOF alone does not invoke drop callback.'],['test_on_drop_fires_without_polling',548,'Unpolled destruction invokes callback.'],['test_shared_stream_survivor_progresses_after_drop',570,'Lagging-side drop releases bounded permits.'],['test_shared_stream_dropped_poller_releases_inner_stream',602,'Pending owner drop releases ownership.'],['test_shared_stream_dropped_poller_wakes_parked_survivor',634,'Parked peer woken on owner drop.'],['test_shared_stream_unbounded_stops_buffering_for_dropped_side',669,'Dead peer retains no clones.']])add('futures',`tests::${n}`,l,l,'test',test,b,'SharedStream/on_drop; futures and channel helpers; assertions/timeouts as detailed in L2','Rust/Tokio test harness');

add('assume','lance_core::assume!',10,17,'macro',pub,'Both invocation arms use checked assert!, including release builds.','assert!');
add('assume','lance_core::assume_eq!',21,28,'macro',pub,'Both invocation arms use checked assert_eq!.','assert_eq!');
for(const [n,l] of [['assume_rejects_false_conditions',33],['assume_eq_rejects_unequal_values',39]])add('assume',`tests::${n}`,l,l,'test',test,'Both ordinary and custom-message failure arms panic.','catch_unwind; assume!/assume_eq!; assert!','Rust test harness');
add('parse','str_is_truthy',5,5,'function',pub,'Case-insensitive 1/true/on/yes/y only; no trim.','str::eq_ignore_ascii_case','str_to_bool; parse_env_as_bool; external callers pending.');
add('parse','str_to_bool',18,18,'function',pub,'Recognized true/false tokens -> Some; unknown -> None; no trim.','str_is_truthy; str::eq_ignore_ascii_case','Local tests; complete external callers pending.');
add('parse','parse_env_as_bool',38,38,'function',pub,'Trim present env and truth-test; any read error uses default; invalid present value is false.','std::env::var; str::trim; str_is_truthy','Observed lexical uses rust/lance-io/src/object_store.rs:1154-1154; rust/lance-encoding/src/decoder.rs:404-404; rust/lance/src/index.rs:1256-1256. Complete caller semantics pending.');
for(const [n,l,b] of [['test_str_to_bool_truthy',50,'Ten true variants.'],['test_str_to_bool_falsy',64,'Ten false variants.'],['test_str_to_bool_unknown',78,'Five unrecognized strings yield None.']])add('parse',`tests::${n}`,l,l,'test',test,b,'str_to_bool; assert_eq!','Rust test harness');

// Idempotent replacement is restricted to this explicitly authored five-file slice.
const qualifiedMethods = new Map([
  ['lance_core::utils::cpu::SimdSupport::Display::fmt', '<lance_core::utils::cpu::SimdSupport as std::fmt::Display>::fmt'],
  ['lance_core::utils::futures::BoxStream::SharedStreamExt::share', "<futures::stream::BoxStream<'a, T> as lance_core::utils::futures::SharedStreamExt<'a>>::share"],
  ['lance_core::utils::futures::S::FinallyStreamExt::finally', '<S as lance_core::utils::futures::FinallyStreamExt<S>>::finally'],
  ['lance_core::utils::futures::tests::FlagWaker::ArcWake::wake_by_ref', '<lance_core::utils::futures::tests::FlagWaker as futures::task::ArcWake>::wake_by_ref']
]);
for (const s of added) {
  const m = s.name.match(/^lance_core::utils::futures::(SharedStream|FinallyStream|OnDropStream)::(Drop|Stream|PinnedDrop)::(\w+)$/);
  if (m) {
    const owner=m[1]==='SharedStream'?"SharedStream<'_, T>":`${m[1]}<S, F>`;
    const trait=m[2]==='Stream'?'futures::Stream':m[2]==='Drop'?'std::ops::Drop':'PinnedDrop';
    s.name=`<lance_core::utils::futures::${owner} as ${trait}>::${m[3]}`;
  } else if (qualifiedMethods.has(s.name)) s.name=qualifiedMethods.get(s.name);
}
const paths=new Set(added.map(s=>s.path));
for(const s of added){const src=linesOf(fs.readFileSync(path.join(root,s.path),'utf8'));if(s.line<1||s.end_line>src.length)throw new Error(`Bad range ${s.name}`);}
fs.writeFileSync(filename,JSON.stringify([...old.filter(s=>!paths.has(s.path)),...added],null,2)+'\n');
console.log(JSON.stringify({added:added.length,total:old.filter(s=>!paths.has(s.path)).length+added.length}));
