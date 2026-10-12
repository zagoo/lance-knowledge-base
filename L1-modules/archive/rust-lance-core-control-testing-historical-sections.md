> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../V21-PROTOCOL.md).

# Historical sections from rust-lance-core-control-testing.md

## Tests and saved seeds

AIMD tests parameterize invalid configuration and assert both InvalidInput and message substrings, accept defaults/unlimited ceiling, and inspect additive/decrease/floor/ceiling/empty-window/threshold/recovery transitions. Most use the private explicit-time helper under a lock without sleeping; the within-window test calls the real-time public method100 times with a10second window. Exact threshold equality, poisoned mutexes, concurrent callers and arithmetic extremes are not locally tested. Tests were read, not executed. (rust/lance-core/src/utils/aimd.rs:292-679)

Two checked-in proptest corpora retain historical failure seeds. statistics has six cc records: empty string/collection, two distinct seeds with one65-zero inner collection each, and Unicode/control-rich strings. mask has two seeds, one documenting empty full-fragment lists, one left row and344 distinct right rows; one right row shares the left fragment ID but differs in offset. These are literal input-shape facts and exact seed text, not evidence that current CI loads them or that the historical bug remains. Current consumers and persistence configuration are pending. (rust/lance-core/proptest-regressions/io/writer/statistics.txt:1-12; rust/lance-core/proptest-regressions/utils/mask.txt:1-9)

