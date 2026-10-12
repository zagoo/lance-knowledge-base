> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md).

# rust/lance-core/src/utils.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `9f4ba7150967d560c80ae490ce0eb0ce1bcbe2b507d54701e80dd55428520684`. Reviewed physical lines: 1-24.

[Module](../../../../L1-modules/rust-lance-core.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Public utility-module directory. It has no executable functions, values, private helper state, errors, tests or async lifecycle. (rust/lance-core/src/utils.rs:1-24)

## Complete range analysis

### Lines 1-3

SPDX license and copyright header plus a blank separator. (rust/lance-core/src/utils.rs:1-3)

### Lines 4-24

Unconditionally public utility submodules are address, aimd, assume, backoff, bit, blob, bloomfilter, cpu, deletion, fragment_reuse, futures, hash, io_stats, parse, path, row_addr_remap, stable_partition, tempfile, testing, tokio, tracing. No cfg gates are attached here; in particular testing is publicly declared outside cfg(test), though its contents may have their own conditions. Module names alone are not behavioral contracts for their implementation. (rust/lance-core/src/utils.rs:4-24)

## Interaction and interpretation limits

Each submodule needs independent analysis. This file only establishes visibility/module paths (rust/lance-core/src/utils.rs:4-24).

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | pub mod address;
    5 | pub mod aimd;
    6 | pub mod assume;
    7 | pub mod backoff;
    8 | pub mod bit;
    9 | pub mod blob;
   10 | pub mod bloomfilter;
   11 | pub mod cpu;
   12 | pub mod deletion;
   13 | pub mod fragment_reuse;
   14 | pub mod futures;
   15 | pub mod hash;
   16 | pub mod io_stats;
   17 | pub mod parse;
   18 | pub mod path;
   19 | pub mod row_addr_remap;
   20 | pub mod stable_partition;
   21 | pub mod tempfile;
   22 | pub mod testing;
   23 | pub mod tokio;
   24 | pub mod tracing;
``````
