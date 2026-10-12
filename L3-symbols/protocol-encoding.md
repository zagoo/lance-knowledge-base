# Encoding selection and version admission

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

**Trust: synthesized from frozen deep records plus selected primitive dispatch ranges.** This is the decision contract; [format-spec](format-spec.md) owns persisted grammar and exact version matrices. [Encoding Module Map](../L1-modules/rust-lance-encoding.md) owns type/file navigation. Uncovered implementation details remain source-readable, not a transcription backlog.

## The four decisions must stay separate

1. **Choose exact file version.** Public selectors and strict persisted-version parsing differ. Current stable default is V2_2; next is unstable V2_3. File footer identity, dataset version, blob representation version and index version are different domains. Use the [exact identity table](format-spec.md#exact-file-identity-and-acceptance). (rust/lance-file/src/version.rs:25-262)
2. **Choose structural field behavior.** Version composition supplies ordered field/page behaviors to the version-free mechanism. Primitive, blob, list, FSL, map and struct factories decide logical shape/column allocation. A metadata tag alone does not make every shape legal in every format. (rust/lance-encoding/src/encoder/structural.rs:24-288; rust/lance-file/src/versions/v2_1/mod.rs:95-134; rust/lance-file/src/versions/v2_2/mod.rs:95-131; rust/lance-file/src/versions/v2_3/mod.rs:103-139)
3. **Choose page layout.** Dense-u16/u32, constant and sparse mechanisms interpret normalized rep/def structure and the selected version's behavior sequence. Sparse automatic selection is a lazy fallback when dense rep/def planning requires page splitting or one row exceeds budget, and any explicit setting suppresses that automatic path. (rust/lance-encoding/src/encodings/logical/primitive/layout.rs:8-24; rust/lance-encoding/src/encodings/logical/primitive.rs:7695-7879)
4. **Choose physical compression inside that layout.** `CompressionStrategy` has distinct block, mini-block and per-value factories. Production version modules compose helper selectors. A codec offered by one interface or generic decoder is not proof of admission in another interface or exact file reader. (rust/lance-encoding/src/compression.rs:92-158; rust/lance-encoding/src/compression.rs:936-1372; rust/lance-file/src/versions/v2_2/compression.rs:27-93)

### Stable and unstable gates

V2_1 selects dense-u16, raw complex-null levels and a fixed-width dictionary policy excluding 64-bit values. It allows an all-null ConstantLayout without an inline scalar or compressed levels, but rejects scalar constants and sparse pages. V2_2 adds dense-u32 framing, compressed levels, scalar constants and the 64-bit dictionary policy, but still rejects sparse pages. V2_3 composes sparse planning before constant/dense-u32 fallbacks. The exact reader grammar remains the authority: enabling a writer mechanism without admitting its exact metadata on read creates unreadable output. (rust/lance-encoding/src/encodings/logical/primitive.rs:7730-7799; rust/lance-file/src/versions/v2_1/mod.rs:125-134; rust/lance-file/src/versions/v2_2/mod.rs:121-131; rust/lance-file/src/versions/v2_3/mod.rs:129-139; rust/lance-file/src/versions/v2_1/reader.rs:99-171; rust/lance-file/src/versions/v2_2/reader.rs:99-169)

Explicit sparse requests are case-insensitive. A format without sparse behavior rejects them. In sparse-capable composition, explicit sparse planning can defer constant-layout cases to later behavior. Automatic sparse checks supported value blocks, treats unavailable value preparation as dense fallback, but propagates actual sparse planning errors. A field marked sparse is therefore not a guarantee that every page is physically sparse. (rust/lance-encoding/src/encodings/logical/primitive.rs:7690-7705; rust/lance-encoding/src/encodings/logical/primitive.rs:7802-7876)

Stable formats preserve backward/forward contracts; no compatibility obligation attaches to earlier unstable V2_3 revisions. Frozen legacy readers retain existing behavior and do not become foundations for new writers. Capability flags are an additional gate independent of the numeric file version; paired sticky mixed-version/tagged-FRI flags and unknown reader/writer flag checks are specified in the [frozen feature-flag contract](../L2-files/rust/lance-table/src/feature_flags.rs.md). (AGENTS.md:5-20; rust/lance-table/src/feature_flags.rs:108-432)

## Configuration and codec policy

Compression parameter precedence is exact dtype key → exact column key, otherwise first matching wildcard in HashMap iteration order → version strategy's field metadata overlay. An exact empty column entry suppresses wildcard selection; None cannot clear an inherited value. Multiple wildcard matches have no specificity ordering. Numeric metadata parse failures can be ignored, and BSS/chunk-size failures warn; do not describe this parser as strict validation. (rust/lance-encoding/src/compression_config.rs:45-169; rust/lance-encoding/src/compression.rs:560-591; rust/lance-file/src/versions/v2_2/compression.rs:27-38)

The existing [shared compression contract](behavior-contracts.md#shared-compression-selection-and-decoder-dispatch) supplies exact RLE/bitpacking benefit comparisons and reader dispatch; [variable/FSST/BSS contract](behavior-contracts.md#variable-fsst-and-bss-behavior-contracts) supplies thresholds. Key decision hazards are:

- Mini-block and per-value `compression=none` shortcuts occur at different stages of validation. Explicit codec names are interpreted differently by the two factories. A named codec is not a universal promise of that output. (rust/lance-encoding/src/compression.rs:661-736; rust/lance-encoding/src/compression.rs:837-881)
- Automatic FSST requires eligible non-binary values, maximum length at least 5 and data size at least 32,768 bytes. Large per-value compression can take precedence even over explicit FSST. BSS needs a non-none outer compression parameter; forced BSS alone is insufficient. (rust/lance-encoding/src/compression.rs:154-191; rust/lance-encoding/src/compression.rs:661-736; rust/lance-encoding/src/compression.rs:837-881)
- RLE must strictly beat raw payload size; equal comparison against bitpacking can prefer RLE. An absent ratio threshold is not the named 0.5 threshold. Estimation and actual encoding can both perform work. (rust/lance-encoding/src/compression.rs:180-516)
- Metadata-only output (`None`) differs from an empty payload (`Some(empty)`). Some compressor factories are feature-gated; successful construction can still defer failure to lazy codec initialization. Do not replace these states with one “empty” case. (rust/lance-encoding/src/compression.rs:936-1033; rust/lance-encoding/src/encodings/physical/block.rs:141-576)
- Statistics are shared/cached and can include physical null slots or unused values. Mutating a payload without invalidating/rebuilding its statistics can select the wrong codec. They are not uniformly logical-valid-row statistics. (rust/lance-encoding/src/statistics.rs:52-216; rust/lance-encoding/src/statistics.rs:232-594)

## Lifecycle and extension obligations

Field lifecycle is construct → prepare all roots → maybe_encode/optional flush → final flush → await page tasks → finish. Preserve per-column page order, complete top-level rows and original top-row counts through nested flattening. `FieldEncoder` is Send, while strategies are Send+Sync; the traits do not enforce a complete state machine for callers. [Frozen encoder](../L2-files/rust/lance-encoding/src/encoder.rs.md) contains exact signatures and failure/mutation details. (rust/lance-encoding/src/encoder.rs:39-234)

An encoding extension must choose whether it changes logical structure, page layout, compression, or only policy. Add the mechanism at that seam, descriptor fields where needed, exact-version writer composition **and** reader grammar/decoder dispatch. Keep metadata/data counts, buffer order/alignment, rep/def coordinates, null meaning and optional payload distinctions consistent. Existing unsafe buffer/codec preconditions and corruption-check limits are documented in [behavior contracts](behavior-contracts.md); a new selector does not validate them automatically. (rust/lance-encoding/src/encoder.rs:117-254; rust/lance-encoding/src/compression.rs:1034-1372; protos/encodings_v2_1.proto:8-659)

## Ordered read sets

**New structural mechanism, five files:**

1. [Frozen structural builder record](../L2-files/rust/lance-encoding/src/encoder/structural.rs.md) → `rust/lance-encoding/src/encoder/structural.rs:24-288` for field recognition/allocation.
2. `rust/lance-encoding/src/encodings/logical/primitive.rs:5410-5480,7690-7928` for behavior interfaces and planning/encoding dispatch.
3. [Frozen V2_3 composition](../L2-files/rust/lance-file/src/versions/v2_3/mod.rs.md) → `rust/lance-file/src/versions/v2_3/mod.rs:103-139` to opt an unstable writer into the mechanism.
4. [Frozen V2_3 reader](../L2-files/rust/lance-file/src/versions/v2_3/reader.rs.md) for exact reader grammar before changing admission.
5. [Frozen structural schema](../L2-files/protos/encodings_v2_1.proto.md) for persisted tags/descriptor contract.

**Physical compression/policy subtask, five files:** [compression helpers](../L2-files/rust/lance-encoding/src/compression.rs.md), [parameters](../L2-files/rust/lance-encoding/src/compression_config.rs.md), [V2_3 compression composition](../L2-files/rust/lance-file/src/versions/v2_3/compression.rs.md), [statistics](../L2-files/rust/lance-encoding/src/statistics.rs.md), and the one codec file selected through the [Module Map](../L1-modules/rust-lance-encoding.md). Each frozen record supplies exact implementation ranges. Do not include every codec in a routine task.

## Current delta — 2026-10-11

[Current refresh contracts](refresh-2026-10-11.md) supersede changed field-ID/transaction, unstable encoding, cache, API, MemWAL and index-coverage statements at the new pin. Follow the task index for bounded source reading.
