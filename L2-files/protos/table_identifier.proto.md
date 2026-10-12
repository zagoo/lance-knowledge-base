> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../V21-PROTOCOL.md).

# protos/table_identifier.proto

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `100eae3e0aa20e72d6b467c7e3b8570c5d06422d05fa84b84cbb42e74dd95f55`. Reviewed physical lines: 1-20.

[Module](../../L1-modules/protos.md) · [Symbols](../../L3-symbols/symbol-index.md) · [Behavior contracts](../../L3-symbols/behavior-contracts.md) · [Format](../../L3-symbols/format-spec.md) · [Entry](../../README.md)

## Role and visibility

Public execution-wire schema in package lance.datafusion, representing dataset identity and reconstruction inputs. It has one message and no executable functions, private implementation, or validation code. (protos/table_identifier.proto:1-20)

## Complete range analysis

### Lines 1-7

Apache-2.0 SPDX license and author ownership precede the proto3 syntax declaration and lance.datafusion namespace; blank separators carry no wire fields. (protos/table_identifier.proto:1-7)

### Lines 8-20

TableIdentifier has string uri tag 1, uint64 version tag 2, optional string manifest_etag tag 3, optional bytes serialized_manifest tag 4, and string-to-string storage_options map tag 5. The documented fast mode supplies URI plus serialized manifest so the executor can skip reading a manifest; the lightweight mode supplies URI, version, and ETag so the executor loads it. Presence distinguishes absent optional ETag/manifest from an explicitly present empty value. The schema does not encode mode exclusivity or precedence when both reconstruction forms are supplied; it declares no validation of URI or storage options. Changing tags or presence loses wire meaning. (protos/table_identifier.proto:8-20)

## Interaction and interpretation limits

Consumers are execution plan serialization/deserialization, as the message's reconstruction comments establish (protos/table_identifier.proto:8-20). Exact fast-path precedence, ETag verification, authentication handling, and Rust entry points require implementation tracing and are not established by this schema. Schema fields are public wire fields, not proof of a public Rust or Python method.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | syntax = "proto3";
    5 | 
    6 | package lance.datafusion;
    7 | 
    8 | /* Identifies a Lance dataset for remote reconstruction.
    9 |  *
   10 |  * Two modes:
   11 |  *   1. uri + serialized_manifest (fast): remote executor skips manifest read.
   12 |  *   2. uri + version + etag (lightweight): remote executor loads manifest from storage.
   13 |  */
   14 | message TableIdentifier {
   15 |   string uri = 1;
   16 |   uint64 version = 2;
   17 |   optional string manifest_etag = 3;
   18 |   optional bytes serialized_manifest = 4;
   19 |   map<string, string> storage_options = 5;
   20 | }
``````
