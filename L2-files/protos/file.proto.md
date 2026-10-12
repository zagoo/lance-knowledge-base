> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../V21-PROTOCOL.md).

# protos/file.proto

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `bc30d3cededd38bc7f718106e33d17f3f0298fe24854715ab88e2426bf1a0f43`. Reviewed physical lines: 1-223.

[Module](../../L1-modules/protos.md) · [Symbols](../../L3-symbols/symbol-index.md) · [Behavior contracts](../../L3-symbols/behavior-contracts.md) · [Format](../../L3-symbols/format-spec.md) · [Entry](../../README.md)

## Role and visibility

Public lance.file schema for logical fields/schema/file descriptors and historical file/page/statistics metadata. Some field-level encoding metadata is explicitly v1-only; logical schema types must not all be dismissed as legacy solely because they share this file. (protos/file.proto:1-223)

## Complete range analysis

### Lines 1-15

License, proto3, and lance.file package precede FileDescriptor(schema=1,length uint64=2). Schema describes contents and length counts file rows. This message does not embed actual column buffers. (protos/file.proto:1-15)

### Lines 16-23

Schema has repeated lance.file.Field fields=1 including nested fields, and string-to-bytes metadata map=5. Its field list is not limited to top-level columns and its metadata values need not be UTF-8 strings. (protos/file.proto:16-23)

### Lines 24-40

Metadata reserves tag 4 because StatisticsMetadata previously used it and older readers had a bug. manifest_position uint64=1 uses zero to indicate externally stored manifest. batch_offsets repeated int32=2 is described as logical offsets of chunk groups, with a parenthetical about rows in each chunk; exact offset-versus-count conversion is an implementation question rather than a reason to reinterpret the declaration. (protos/file.proto:24-40)

### Lines 41-60

page_table_position uint64=3 points to a num_fields by num_batches by 2 matrix of signed int64 position/length pairs. Pages in the same column are stored contiguously in this table. Every file field, including struct fields with zero-length runs because they store no data, has a table run. The example accesses column 5, batch 4, selecting position slot 0 or length slot 1. This specification is distinct from v2's independent page metadata. (protos/file.proto:41-60)

### Lines 61-94

Nested StatisticsMetadata stores repeated Field schema=1, repeated int32 leaf-field IDs fields=2, and uint64 page_table_position=3. Statistics schema can be empty or cover only some fields. Each fields entry identifies a stats-schema field and corresponds to one statistics page-table column; the table is N by 2 because there is always one batch. Metadata.statistics uses tag 5, deliberately not the reserved historical tag 4. Historical reservation rationale is at protos/file.proto:25-29. (protos/file.proto:61-94)

### Lines 95-121

Encoding enum assigns NONE=0 invalid, PLAIN=1, VAR_BINARY=2, DICTIONARY=3, RLE=4. Dictionary stores signed int64 offset=1 and length=2 for dictionary values; offset is meaningful only with DICTIONARY and logical_type describes the values' type. These declarations do not prove all enum alternatives have active implementations. (protos/file.proto:95-121)

### Lines 122-140

Field.Type distinguishes PARENT=0, REPEATED=1, LEAF=2. Fields are Type type=1, fully qualified name string=2, signed id=3, and signed parent_id=4. ID assignment refers to DataFile.fields. The parent comment says not-set means top-level, but parent_id is a bare proto3 int32 without presence; the actual sentinel/default convention must come from conversion code. Do not assume Option semantics. (protos/file.proto:122-140)

### Lines 141-173

logical_type string=5 encodes parameterized Arrow logical type names. Parent is struct; repeated permits list, large_list, list.struct, large_list.struct (the latter pair also imply parenthood). Leaf names listed are null, bool, signed/unsigned 8/16/32/64 integers, halffloat/float/double, string/large_string, binary/large_binary, date32:day, date64:ms, decimal:128 or :256 with precision/scale, time/timestamp/duration with s/ms/us/ns units, and dict:{value_type}:{index_type}:false. nullable bool=6 is separate. This comment's list requires validation against parser code before being called exhaustive runtime support. (protos/file.proto:141-173)

### Lines 174-192

metadata string-to-bytes map=10 carries extension type names/parameters. unenforced_primary_key bool=12 marks membership; unenforced_primary_key_position uint32=13 uses positive one-based order or zero to fall back to schema field-ID ordering for a primary-key member. unenforced_clustering_key bool=14 is an ordinary declared field whose comment reserves it for future use; use unenforced_clustering_key_position uint32=15, where positive is one-based position and zero means not a clustering key. This semantic reservation is not a protobuf reserved tag statement. (protos/file.proto:174-192)

### Lines 193-216

Deprecated field encoding=7 is v1-only; v2 chooses variable encodings per page. Deprecated Dictionary dictionary=8 is v1-only; v2 selects dictionaries dynamically and stores them in data files. Deprecated extension_name string=9 is superseded by metadata key ARROW:extension:name. The declarations remain present for old readers; deprecation comments do not erase their wire tags. (protos/file.proto:193-216)

### Lines 217-223

Former string storage_class tag 11 and its name are explicitly reserved to retain old-manifest compatibility and prohibit reuse. This is a real protobuf reservation, unlike the still-declared clustering-key bool's future-use comment. (protos/file.proto:217-223)

## Interaction and interpretation limits

V1-only encoding/dictionary fields are explicitly labeled (protos/file.proto:193-215); schema and file-descriptor usage still need consumer tracing. Parent-ID absence wording and batch-offset wording are unresolved converter questions (protos/file.proto:36-39; protos/file.proto:138-139). No executable API, panic, unsafe block, or concurrency behavior is implemented in this schema.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | syntax = "proto3";
    5 | 
    6 | package lance.file;
    7 | 
    8 | // A file descriptor that describes the contents of a Lance file
    9 | message FileDescriptor {
   10 |   // The schema of the file
   11 |   Schema schema = 1;
   12 |   // The number of rows in the file
   13 |   uint64 length = 2;
   14 | }
   15 | 
   16 | // A schema which describes the data type of each of the columns
   17 | message Schema {
   18 |   // All fields in this file, including the nested fields.
   19 |   repeated lance.file.Field fields = 1;
   20 |   // Schema metadata.
   21 |   map<string, bytes> metadata = 5;
   22 | }
   23 | 
   24 | // Metadata of one Lance file.
   25 | message Metadata {
   26 |   /* 4 was used for StatisticsMetadata in the past, but has been moved to
   27 |    * prevent a bug in older readers.
   28 |    */
   29 |   reserved 4;
   30 | 
   31 |   /* Position of the manifest in the file. If it is zero, the manifest is stored
   32 |    * externally.
   33 |    */
   34 |   uint64 manifest_position = 1;
   35 | 
   36 |   /* Logical offsets of each chunk group, i.e., number of the rows in each
   37 |    * chunk.
   38 |    */
   39 |   repeated int32 batch_offsets = 2;
   40 | 
   41 |   /* The file position that page table is stored.
   42 |    *
   43 |    * A page table is a matrix of N x M x 2, where N = num_fields, and M =
   44 |    * num_batches. Each cell in the table is a pair of <position:int64,
   45 |    * length:int64> of the page. Both position and length are int64 values. The
   46 |    * <position, length> of all the pages in the same column are then
   47 |    * contiguously stored.
   48 |    *
   49 |    * Every field that is a part of the file will have a run in the page table.
   50 |    * This includes struct columns, which will have a run of length 0 since
   51 |    * they don't store any actual data.
   52 |    *
   53 |    * For example, for the column 5 and batch 4, we have:
   54 |    * ```text
   55 |    *   position = page_table[5][4][0];
   56 |    *   length = page_table[5][4][1];
   57 |    * ```
   58 |    */
   59 |   uint64 page_table_position = 3;
   60 | 
   61 |   message StatisticsMetadata {
   62 |     /* The schema of the statistics.
   63 |      *
   64 |      * This might be empty, meaning there are no statistics. It also might not
   65 |      * contain statistics for every field.
   66 |      */
   67 |     repeated Field schema = 1;
   68 | 
   69 |     /* The field ids of the statistics leaf fields.
   70 |      *
   71 |      * This plays a similar role to the `fields` field in the DataFile message.
   72 |      * Each of these field ids corresponds to a field in the stats_schema. There
   73 |      * is one per column in the stats page table.
   74 |      */
   75 |     repeated int32 fields = 2;
   76 | 
   77 |     /* The file position of the statistics page table
   78 |      *
   79 |      * The page table is a matrix of N x 2, where N = length of stats_fields.
   80 |      * This is the same layout as the main page table, except there is always
   81 |      * only one batch.
   82 |      *
   83 |      * For example, to get the stats column 5, we have:
   84 |      * ```text
   85 |      *   position = stats_page_table[5][0];
   86 |      *   length = stats_page_table[5][1];
   87 |      * ```
   88 |      */
   89 |     uint64 page_table_position = 3;
   90 |   }
   91 | 
   92 |   StatisticsMetadata statistics = 5;
   93 | }  // Metadata
   94 | 
   95 | // Supported encodings.
   96 | enum Encoding {
   97 |   // Invalid encoding.
   98 |   NONE = 0;
   99 |   // Plain encoding.
  100 |   PLAIN = 1;
  101 |   // Var-length binary encoding.
  102 |   VAR_BINARY = 2;
  103 |   // Dictionary encoding.
  104 |   DICTIONARY = 3;
  105 |   // Run-length encoding.
  106 |   RLE = 4;
  107 | }
  108 | 
  109 | // Dictionary field metadata
  110 | message Dictionary {
  111 |   /* The file offset for storing the dictionary value.
  112 |    * It is only valid if encoding is DICTIONARY.
  113 |    *
  114 |    * The logic type presents the value type of the column, i.e., string value.
  115 |    */
  116 |   int64 offset = 1;
  117 | 
  118 |   /// The length of dictionary values.
  119 |   int64 length = 2;
  120 | }
  121 | 
  122 | // Field metadata for a column.
  123 | message Field {
  124 |   enum Type {
  125 |     PARENT = 0;
  126 |     REPEATED = 1;
  127 |     LEAF = 2;
  128 |   }
  129 |   Type type = 1;
  130 | 
  131 |   // Fully qualified name.
  132 |   string name = 2;
  133 |   /* Field Id.
  134 |    *
  135 |    * See the comment in `DataFile.fields` for how field ids are assigned.
  136 |    */
  137 |   int32 id = 3;
  138 |   /// Parent Field ID. If not set, this is a top-level column.
  139 |   int32 parent_id = 4;
  140 | 
  141 |   /* Logical types, support parameterized Arrow Type.
  142 |    *
  143 |    * PARENT types will always have logical type "struct".
  144 |    *
  145 |    * REPEATED types may have logical types:
  146 |    * * "list"
  147 |    * * "large_list"
  148 |    * * "list.struct"
  149 |    * * "large_list.struct"
  150 |    * The final two are used if the list values are structs, and therefore the
  151 |    * field is both implicitly REPEATED and PARENT.
  152 |    *
  153 |    * LEAF types may have logical types:
  154 |    * * "null"
  155 |    * * "bool"
  156 |    * * "int8" / "uint8"
  157 |    * * "int16" / "uint16"
  158 |    * * "int32" / "uint32"
  159 |    * * "int64" / "uint64"
  160 |    * * "halffloat" / "float" / "double"
  161 |    * * "string" / "large_string"
  162 |    * * "binary" / "large_binary"
  163 |    * * "date32:day"
  164 |    * * "date64:ms"
  165 |    * * "decimal:128:{precision}:{scale}" / "decimal:256:{precision}:{scale}"
  166 |    * * "time:{unit}" / "timestamp:{unit}" / "duration:{unit}", where unit is
  167 |    * "s", "ms", "us", "ns"
  168 |    * * "dict:{value_type}:{index_type}:false"
  169 |    */
  170 |   string logical_type = 5;
  171 |   // If this field is nullable.
  172 |   bool nullable = 6;
  173 | 
  174 |   // optional field metadata (e.g. extension type name/parameters)
  175 |   map<string, bytes> metadata = 10;  
  176 | 
  177 |   bool unenforced_primary_key = 12;
  178 | 
  179 |   /* Position of this field in the primary key (1-based).
  180 |    * 0 means the field is part of the primary key but uses schema field id for ordering.
  181 |    * When set to a positive value, primary key fields are ordered by this position.
  182 |    */
  183 |   uint32 unenforced_primary_key_position = 13;
  184 | 
  185 |   // Reserved for future use. Use unenforced_clustering_key_position instead.
  186 |   bool unenforced_clustering_key = 14;
  187 | 
  188 |   /* Position of this field in the clustering key (1-based).
  189 |    * 0 means the field is not part of the clustering key.
  190 |    */
  191 |   uint32 unenforced_clustering_key_position = 15;
  192 | 
  193 |   // DEPRECATED ----------------------------------------------------------------
  194 | 
  195 |   /* Deprecated: Only used in V1 file format. V2 uses variable encodings defined
  196 |    * per page.
  197 |    *
  198 |    * The global encoding to use for this field.
  199 |    */
  200 |   Encoding encoding = 7;
  201 | 
  202 |   /* Deprecated: Only used in V1 file format. V2 dynamically chooses when to
  203 |    * do dictionary encoding and keeps the dictionary in the data files.
  204 |    *
  205 |    * The file offset for storing the dictionary value.
  206 |    * It is only valid if encoding is DICTIONARY.
  207 |    *
  208 |    * The logic type presents the value type of the column, i.e., string value.
  209 |    */
  210 |   Dictionary dictionary = 8;
  211 | 
  212 |   /* Deprecated: optional extension type name, use metadata field
  213 |    * ARROW:extension:name
  214 |    */
  215 |   string extension_name = 9;
  216 | 
  217 |   /* Field number 11 was previously `string storage_class`.
  218 |    * Keep it reserved so older manifests remain compatible while new writers
  219 |    * avoid reusing the slot.
  220 |    */
  221 |   reserved 11;
  222 |   reserved "storage_class";
  223 | }
``````
