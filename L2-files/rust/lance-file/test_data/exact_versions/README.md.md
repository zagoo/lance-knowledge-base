> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-file/test_data/exact_versions/README.md

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `0f3995238d5c0bb56509f2cbc8041264b7bb5130e0a93955c45e339d758c485d`. Reviewed physical lines: 1-41.

[Module](../../../../../L1-modules/rust-lance-file-v20-compatibility.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Fixture provenance, regeneration workflow, SHA-256 table and stable/unstable compatibility boundary. This documentation pins a commit, not a released package version. (rust/lance-file/test_data/exact_versions/README.md:1-41)

## Complete range analysis

### Lines 1-9

Claims generation at commit3a72f8a61e14613f517dded6816d4bfc77817c93 and names deterministic compatibility_fixture_batch. Lists primitive/nullable UTF8/list/dictionary/blob, multiple inputs/pages; embeddedV2_0 uses first257 id/name rows. The generator/test source independently specifies these inputs, but provenance is a documented claim until regeneration is actually executed. (rust/lance-file/test_data/exact_versions/README.md:1-9)

### Lines 10-24

Documents copying baseline-compatible datagen.rs into a clean detached worktree, invoking datagen.py with --source and removing worktree. Explains two separate processes and isolated Cargo target directory. --write is intended only to restore locked-baseline files. Commands are documentation and were not executed during this analysis. (rust/lance-file/test_data/exact_versions/README.md:10-24)

### Lines 25-33

Exact SHA-256 table names six files: v1,v2_0,v2_1,v2_2,v2_0_self_described,v2_0_mini. Full literal digests are retained in source appendix and MANIFEST. These hashes match inventory bytes but are not a substitute for per-file payload analysis. (rust/lance-file/test_data/exact_versions/README.md:25-33)

### Lines 34-41

Requires stable writers byte-identical and readers able to consume baseline. Explicit V2_0 standard footer(0,3), embedded(2,0); V2_3 unstable gets same-revision deterministic checks only. Warns regenerating from implementation under test is not independent compatibility evidence. No new feature support is prescribed for legacyV1. (rust/lance-file/test_data/exact_versions/README.md:34-41)

## Interaction and interpretation limits

All41 lines read. Baseline commit exists in local Git metadata; six declared hashes match the inventory snapshot. No generator or test was executed. V1, all three standard V2 and both embedded V2_0 fixture contents are now fully decoded in the binary supplements; standard V2_2 payload is now fully interpreted. Matching hashes alone do not prove semantics or reproducibility.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | # Exact File-Version Compatibility Fixtures
    2 | 
    3 | These files were generated with the writers at baseline commit
    4 | `3a72f8a61e14613f517dded6816d4bfc77817c93`. The deterministic input batch is
    5 | defined by `compatibility_fixture_batch` in `src/compatibility_tests.rs` and
    6 | covers primitive, nullable UTF-8, nullable list, nullable dictionary, blob,
    7 | multiple input batches, and multiple pages. The V2.0 embedded fixtures use the
    8 | primitive and nullable UTF-8 columns from the first 257 rows of the same batch.
    9 | 
   10 | `datagen.py` copies the baseline-compatible `datagen.rs` into a clean checkout
   11 | of that commit, runs it twice in separate processes with an isolated Cargo
   12 | target directory, and verifies that both runs produce identical bytes:
   13 | 
   14 | ```shell
   15 | git worktree add --detach /tmp/lance-exact-version-baseline \
   16 |     3a72f8a61e14613f517dded6816d4bfc77817c93
   17 | python3 rust/lance-file/test_data/exact_versions/datagen.py \
   18 |     --source /tmp/lance-exact-version-baseline
   19 | git worktree remove /tmp/lance-exact-version-baseline
   20 | ```
   21 | 
   22 | Pass `--write` only when intentionally restoring these files from the locked
   23 | baseline.
   24 | 
   25 | | File | SHA-256 |
   26 | | --- | --- |
   27 | | `v1.lance` | `fa8b3d81b9d4fd4ade5a7c3d077ebf2155664e12b9335e26fac1c0d0774e916c` |
   28 | | `v2_0.lance` | `073c8c24eb4433b83d0dda95bf7a731a9f5d8f32d78440f2f391474e99b9c49a` |
   29 | | `v2_1.lance` | `3af97ba176b72c7e00a248b4a270a53402a72e594631950f76eb3daab45c50ce` |
   30 | | `v2_2.lance` | `8298cd9301e657417b0725461345c27cf46515529d2a8b35824be139e3466a14` |
   31 | | `v2_0_self_described.lance` | `6a3a9ce8ef56f058d1d105e7f4494ce35a9026479e2f76fc6f26c04b3201a406` |
   32 | | `v2_0_mini.lance` | `5e3fc99b01a4d2f5d16a2fb051dacb49b4a736428b1494715cd83633ad142a63` |
   33 | 
   34 | The compatibility tests require each stable writer to reproduce its fixture
   35 | byte-for-byte and each reader to open and read the baseline file. The V2.0
   36 | standard fixture preserves footer `(0, 3)` while its self-described and
   37 | mini-Lance fixtures preserve `(2, 0)`. V2.3 is unstable, so it has deterministic
   38 | current-revision tests instead of a checked-in compatibility fixture.
   39 | 
   40 | Regenerate these fixtures only from the baseline writer APIs. Files generated
   41 | with the implementation under test are not independent compatibility evidence.
``````
