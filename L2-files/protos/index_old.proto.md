> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../V21-PROTOCOL.md). Refresh 2026-10-09: [current coordinates and changed contracts](../../refresh-addenda/2026-10-09-db684d1f.md) at `db684d1f0726c00b6defb7963a604a7719e82b5a` supersede affected historical statements; body remains frozen.

# protos/index_old.proto

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `dab3d40d7a376be7f095083a6807fc2652ef0de30548acddc144b0f25ba19d5f`. Reviewed physical lines: 1-118.

[Module](../../L1-modules/protos.md) · [Symbols](../../L3-symbols/symbol-index.md) · [Behavior contracts](../../L3-symbols/behavior-contracts.md) · [Format](../../L3-symbols/format-spec.md) · [Entry](../../README.md)

## Role and visibility

Public persisted index-detail protobuf types intentionally retained in the historical lance.table namespace. The filename does not mean every field is unused; this file still contains evolving details for existing index kinds. (protos/index_old.proto:1-118)

## Complete range analysis

### Lines 1-7

License, proto3 syntax, and lance.table package define the namespace which participates in serialized type identity. (protos/index_old.proto:1-7)

### Lines 8-24

The instruction prohibits adding new index detail kinds here: use index.proto. Existing messages can be extended here, because older readers expect historical lance.table BTree identities. Empty details mean properties are hard-coded or stored inside index files, with future query-planning metadata anticipated. The comment calls index.proto's namespace lance.index, while its actual declaration is lance.index.pb; exact package declarations take precedence over this abbreviated comment. Supporting package declaration: protos/index.proto:6-6. (protos/index_old.proto:8-24)

### Lines 25-34

BTreeIndexDetails, BitmapIndexDetails, LabelListIndexDetails, and NGramIndexDetails are empty type markers. ZoneMapIndexDetails.rows_per_zone is optional uint64 tag 1; absent represents old datasets and prevents seed-writer creation, not an implicit numeric zone size. (protos/index_old.proto:25-34)

### Lines 35-45

ZoneMap use_seeds optional bool tag 2 distinguishes absent historical disabled, explicit false, and true enabling per-fragment seed buffers in data files harvested for incremental updates to avoid full column scans. The creation-time comment says variable-length and fixed-width wider than eight bytes default true, narrow fixed-width false. On-disk absence must not be interpreted using that creation-time default. (protos/index_old.proto:35-45)

### Lines 46-54

ZoneMap has_null_bitmap optional bool tag 3 enables exact null-row address tracking. Absent/false use legacy approximate zone statistics for IS NULL; true makes IS NULL exact and supports IS NOT NULL without a full scan. The closing brace ends ZoneMap and the next declaration begins InvertedIndexDetails. (protos/index_old.proto:46-54)

### Lines 55-80

InvertedIndexDetails.DocumentGranularity enum is ROW=0, LIST_ELEMENT=1. CodeTokenizerConfig has bool split_identifiers=1 (camel-case subwords), optional split_on_numerics=2 (letter/number boundaries) and preserve_original=3 (full lexical identifier alongside subwords), and bool index_operators=4. Absent optional options use tokenizer defaults; their concrete default booleans are not provided here. Operators such as ::, ->, != are documented off by default due to frequency noise. (protos/index_old.proto:55-80)

### Lines 81-98

base_tokenizer optional string=1 identifies concrete lexical tokenizer after document extraction; analyzer profiles expand into it plus concrete options before persistence. Presence detects older blank details. Remaining fields are language string=2, with_position bool=3, max_token_length optional uint32=4, lower_case=5, stem=6, remove_stop_words=7, ascii_folding=8 booleans, min_ngram_length=9 and max_ngram_length=10 uint32, prefix_only bool=11. These names specify configuration choices but not processing order, language validation, or numeric bounds. (protos/index_old.proto:81-98)

### Lines 99-118

block_size optional uint32=12 counts documents per compressed posting block: absence mandates legacy 128; present 256 is valid with formats 3/4. code_config message=13 records explicit code-tokenizer configuration when present and no code-specific configuration when absent. document_granularity enum=14 defaults to row behavior for absent wire values. posting_format_version optional uint32=15 identifies posting payload separately from overall inverted index_version; do not conflate these version axes. (protos/index_old.proto:99-118)

## Interaction and interpretation limits

Namespace preservation and new-kind placement are explicit (protos/index_old.proto:8-17); the actual new namespace is lance.index.pb (protos/index.proto:6-6). Runtime implementation and historical fixture compatibility remain separate obligations. Code-level defaults must be compared to the comment-specified creation and decoding rules (protos/index_old.proto:29-52; protos/index_old.proto:99-118).

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | syntax = "proto3";
    5 | 
    6 | package lance.table;
    7 | 
    8 | /* NOTE: Do *NOT* add new index details here.  Add them to the index.proto file instead.
    9 |  * This file is in the lance.table package namespace while the index.proto file is in the
   10 |  * lance.index package namespace.
   11 |  *
   12 |  * These are only here for forward compatibility.  Older versions of Lance expect btree indexes
   13 |  * to have lance.table in the package namespace.
   14 |  *
   15 |  * If you need to modify these messages (e.g. to add new fields to btree or bitmap) then
   16 |  * it is ok to modify them here.
   17 |  */
   18 | 
   19 | /* Currently many of these are empty messages because all needed details are either hard-coded (e.g.
   20 |  * filenames) or stored in the index itself.  However, we may want to add more details in the
   21 |  * future, in particular we can add details that may be useful for planning queries (e.g. don't
   22 |  * force us to load the index until we know we can make use of it)
   23 |  */
   24 | 
   25 | message BTreeIndexDetails {}
   26 | message BitmapIndexDetails {}
   27 | message LabelListIndexDetails {}
   28 | message NGramIndexDetails {}
   29 | message ZoneMapIndexDetails {
   30 |   /* Number of rows per zone. Optional for backwards compatibility: absent on
   31 |    * datasets written before this field was added. When absent, no seed writer
   32 |    * is created for the index.
   33 |    */
   34 |   optional uint64 rows_per_zone = 1;
   35 |   /* Whether seed-based incremental updates are enabled for this index.
   36 |    * On-disk semantics: absent means seeds are disabled (old datasets written
   37 |    * before this field was added). Present false means explicitly disabled.
   38 |    * Present true means seeds are enabled: the index will embed per-fragment
   39 |    * seed buffers in data files and harvest them during incremental updates
   40 |    * to skip full column scans.
   41 |    * Creation-time default: index creation code sets this to true for
   42 |    * variable-length types (strings, binary) and fixed-width types wider than
   43 |    * 8 bytes, and to false for narrow fixed-width types (e.g. Int64, Float64).
   44 |    */
   45 |   optional bool use_seeds = 2;
   46 |   /* Whether this index tracks exact null row addresses in a separate bitmap.
   47 |    * Absent or false means legacy format: null positions are not tracked and
   48 |    * IS NULL searches fall back to approximate zone-level statistics. Present
   49 |    * true means IS NULL is exact and IS NOT NULL can be answered without a
   50 |    * full scan.
   51 |    */
   52 |   optional bool has_null_bitmap = 3;
   53 | }
   54 | message InvertedIndexDetails {
   55 |   enum DocumentGranularity {
   56 |     ROW = 0;
   57 |     LIST_ELEMENT = 1;
   58 |   }
   59 | 
   60 |   message CodeTokenizerConfig {
   61 |     /* Split one lexical identifier into subwords, e.g. getUserName ->
   62 |      * get/user/name.
   63 |      */
   64 |     bool split_identifiers = 1;
   65 |     /* Split identifier subwords across letter/number boundaries, e.g.
   66 |      * HTML2JSON -> html/2/json. An absent value uses the code tokenizer default;
   67 |      * a present value records the explicit index-time choice.
   68 |      */
   69 |     optional bool split_on_numerics = 2;
   70 |     /* Keep the complete lexical identifier in addition to subwords, e.g.
   71 |      * user_name plus user/name. An absent value uses the code tokenizer default;
   72 |      * a present value records the explicit index-time choice.
   73 |      */
   74 |     optional bool preserve_original = 3;
   75 |     /* Index operator tokens such as "::", "->", and "!=". Operators are not
   76 |      * indexed by default because they are often high-frequency noise.
   77 |      */
   78 |     bool index_operators = 4;
   79 |   }
   80 | 
   81 |   /* Lexical tokenizer used after document-level text extraction. This is an
   82 |    * implementation component such as "simple", "icu", "ngram", or "code".
   83 |    * Input-time analyzer profiles are expanded into this field and the concrete
   84 |    * options below before these details are persisted.
   85 |    * Marking this field as optional as old versions of the index store blank details and we
   86 |    * need to make sure we have a proper optional field to detect this.
   87 |    */
   88 |   optional string base_tokenizer = 1;
   89 |   string language = 2;
   90 |   bool with_position = 3;
   91 |   optional uint32 max_token_length = 4;
   92 |   bool lower_case = 5;
   93 |   bool stem = 6;
   94 |   bool remove_stop_words = 7;
   95 |   bool ascii_folding = 8;
   96 |   uint32 min_ngram_length = 9;
   97 |   uint32 max_ngram_length = 10;
   98 |   bool prefix_only = 11;
   99 |   /* Number of documents per compressed posting block. An absent value means
  100 |    * the index predates this field and must use the legacy block size of 128.
  101 |    * A present value records the block size used by the index; 256 is valid
  102 |    * with format versions 3 and 4.
  103 |    */
  104 |   optional uint32 block_size = 12;
  105 |   /* Options for base_tokenizer = "code". Presence records the code tokenizer
  106 |    * configuration used to build the index; absence means there is no
  107 |    * code-specific configuration to apply.
  108 |    */
  109 |   CodeTokenizerConfig code_config = 13;
  110 |   /* The logical FTS document boundary. The protobuf default preserves the
  111 |    * legacy row-document behavior when this field is absent.
  112 |    */
  113 |   DocumentGranularity document_granularity = 14;
  114 |   /* The posting-list payload format. This is separate from index_version,
  115 |    * which identifies the overall inverted-index layout.
  116 |    */
  117 |   optional uint32 posting_format_version = 15;
  118 | }
``````
