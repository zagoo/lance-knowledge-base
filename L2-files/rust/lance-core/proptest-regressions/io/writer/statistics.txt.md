> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../../../../../V21-PROTOCOL.md).

# rust/lance-core/proptest-regressions/io/writer/statistics.txt

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `f4acde649eda7e4476a2e8e58392c72c35c8d3b06b527fe4f45b27ee294473c7`. Reviewed physical lines: 1-12.

[Module](../../../../../../L1-modules/rust-lance-core-control-testing.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Checked-in property-test regression seed corpus with historical shrunk input comments. This text is test data, not executable code or a current test result. Full seed strings and literal shrunk examples are retained in the numbered appendix. (rust/lance-core/proptest-regressions/io/writer/statistics.txt:1-12)

## Complete range analysis

### Lines 1-6

Header describes saved prior failure seeds, replay before novel generated cases, and advice to commit them so other test runs benefit. This is the corpus format's own operational description, not verification that a particular current harness consumes this file. (rust/lance-core/proptest-regressions/io/writer/statistics.txt:1-6)

### Lines 7-8

Two cc seed records preserve shrunk values consisting of one empty string and an empty collection, respectively. Exact64-hex identifiers in the appendix must remain unchanged for reproducibility; the comments give no assertion or root cause. (rust/lance-core/proptest-regressions/io/writer/statistics.txt:7-8)

### Lines 9-10

Two distinct cc seed IDs each annotate values as a single inner collection of65 zeros. Identical displayed shrunk inputs can arise from different generator seeds; they are not duplicate IDs. Width/cardinality observations come from the literal comments, not inferred data types or executed failures. (rust/lance-core/proptest-regressions/io/writer/statistics.txt:9-10)

### Lines 11-12

Final two cc seeds annotate Unicode/control-rich strings. The first has one string; the second two, beginning with escaped U+007F. Comments retain literal supplementary/BMP glyphs, escaped U+0080/U+000B and null escapes, spaces and ASCII text. Do not normalize or reinterpret these comments as a decoded byte encoding; they document shrunk shapes, while replay identity is the seed. The exact text is preserved below. (rust/lance-core/proptest-regressions/io/writer/statistics.txt:11-12)

## Interaction and interpretation limits

Only this corpus content is established. Current proptest persistence configuration and test consumer paths remain unverified; the directory name does not prove the same historical test still exists or that the seeds are loaded by current CI. No property tests were executed. (rust/lance-core/proptest-regressions/io/writer/statistics.txt:1-12)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | # Seeds for failure cases proptest has generated in the past. It is
    2 | # automatically read and these particular cases re-run before any
    3 | # novel cases are generated.
    4 | #
    5 | # It is recommended to check this file in to source control so that
    6 | # everyone who runs the test benefits from these saved cases.
    7 | cc d036403fe9f78dbff2c0719e2319e043d9fa1e95aeecd63f8e69593a22c10ea4 # shrinks to values = [""]
    8 | cc e7d31563fa5d35fe809e639d776be444b6042700b05fe695a0f6adc14fb171f7 # shrinks to values = []
    9 | cc 6c525cb87c8a699c192a10bb4064837f4e91ca609cac82e3615da4776227b613 # shrinks to values = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
   10 | cc 6a1991927899b890de6623bf046ebd7e6fd512c73c854a21be5a947bf15f98dd # shrinks to values = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
   11 | cc 1436aa3ba65a78849c52480e744e8ed37a6eb64e793319f36f28e0ffd30c0f34 # shrinks to values = ["𐀀 𐀀aA  \u{80}aA\u{b}A \u{b}\00  0𐀀0 A𐀀\0ࠀaࠀAA0¡ 𐀀𐀀¡ 𐀀"]
   12 | cc f1974dc3e72ef3d23ce7fd5a983f188a3f26bf9247f43dc25e7e71f46e0bedd9 # shrinks to values = ["\u{7f}", " \u{80}𐀀𐀀\0\0  \u{b}¡𐀀𐀀ࠀ\0 a\u{b} ¡𐀀𐀀0Aa𐀀a00 𐀀a𐀀A"]
``````
