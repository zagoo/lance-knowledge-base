> **Historical test instrumentation — outside V2.1 scope.**

## Policy proxy behavior

The public testing utility module is not gated by cfg(test). PolicyFnT accepts (&str,&Path)->core Result<()> and ObjectMetaPolicyFnT accepts (&str,ObjectMeta)->core Result<ObjectMeta>, both Send+Sync with blanket closure implementations. Private aliases wrap each in Arc. Both dyn Debug implementations print PolicyFn. ProxyObjectStorePolicy stores named callbacks in private HashMaps, provides setters for both and removal only for before policies; same-name setting replaces the entry and ordering is unspecified. (rust/lance-core/src/utils.rs:22-22; rust/lance-core/src/utils/testing.rs:27-87)

ProxyObjectStore owns target Arc<dyn ObjectStore> and Arc<Mutex<ProxyObjectStorePolicy>>. Before and metadata callbacks execute while that synchronous lock is held. They can short-circuit with converted object_store errors; callbacks must not recursively acquire the same mutex, and panic can poison it. There is no rollback of earlier callback side effects. Target awaits occur after helper locks are released. (rust/lance-core/src/utils/testing.rs:89-120; rust/lance-core/src/utils/testing.rs:165-250)

| Overridden operation | Before-policy string/path | Metadata transform / boundary |
|---|---|---|
| put_opts | put / location | Delegate result |
| put_multipart_opts | put_multipart / location | Returned upload is unwrapped; later upload operations bypass this wrapper |
| get_opts | get_opts / location | Only options.head triggers transform with head; errors returned |
| get_ranges | get_ranges / location | No byte transformation |
| delete_stream | delete / each successful input Path when polled | Input errors pass through; delegate receives checked stream |
| list | No before policy | Each successful metadata item transformed with list; policy errors unwrap/panic |
| list_with_delimiter | No before policy | No transform |
| copy_opts | copy / source only | Destination/options forwarded |
| rename_opts | rename / source only | Destination/options forwarded |

This exact override matrix qualifies the broad all-calls doc wording. Defaults for other ObjectStore methods remain dependency behavior, not analyzed implementations. Streaming policies are evaluated as items are polled, so later policy changes can affect later items; underlying stream errors bypass and_then callbacks. (rust/lance-core/src/utils/testing.rs:89-98; rust/lance-core/src/utils/testing.rs:165-251)

## Counting wrapper and async lifetime

CountingObjectStore owns target and a caller-supplied Arc<AtomicUsize>, preserves its initial value and adds one with SeqCst per listing invocation. list increments synchronously before returning its delegated stream, even if that stream is never consumed or later fails. list_with_delimiter increments inside its async body before awaiting the target, so constructing but never polling that future does not increment. It counts attempts, not objects, completed requests or time. (rust/lance-core/src/utils/testing.rs:129-157; rust/lance-core/src/utils/testing.rs:287-295)

Explicit put/multipart/get/ranges/delete-stream/copy overrides forward unchanged. There is no explicit rename_opts override in this implementation; do not infer its dependency default without inspecting ObjectStore. Display for both wrappers includes the target display string. No local unit tests, reset operation or counter decrement is defined in this file. (rust/lance-core/src/utils/testing.rs:123-127; rust/lance-core/src/utils/testing.rs:159-163; rust/lance-core/src/utils/testing.rs:253-300)

