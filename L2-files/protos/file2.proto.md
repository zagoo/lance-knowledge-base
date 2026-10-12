> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../V21-PROTOCOL.md).

# protos/file2.proto

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `d32eb04b744bde2c8524e6af16e72b882ef918469868013a3b41f5620ab171d0`. Reviewed physical lines: 1-223.

[Module](../../L1-modules/protos.md) · [Symbols](../../L3-symbols/symbol-index.md) · [Behavior contracts](../../L3-symbols/behavior-contracts.md) · [Format](../../L3-symbols/format-spec.md) · [Entry](../../README.md)

## Role and visibility

Public lance.file.v2 schema and inline specification for the minimal v2.X physical file envelope: byte buffers, column/page metadata, encoding locations, offset tables and footer. This base layer deliberately does not prescribe logical types or concrete encoding algorithms. (protos/file2.proto:1-223)

## Complete range analysis

### Lines 1-10

SPDX comments, proto3 syntax and lance.file.v2 package precede Any and Empty imports. Empty is used as the explicit no-encoding marker; Any is imported but no field in this file uses it. (protos/file2.proto:1-10)

### Lines 11-27

The minimal format describes 0..4Gi columns, 0..4Gi pages per column, and up to 2^64 items per page/column; page and column item counts may differ. These prose limits need comparison with actual integer representation and writer/reader checks before assuming the upper endpoint is inclusive. This envelope treats data as byte buffers with extensible metadata, leaving schema and logical types to higher layers. (protos/file2.proto:11-27)

### Lines 28-39

Data buffers are written first and can be referenced by page encoding, column encoding (such as statistics or dictionaries), or a global buffer table for shared data/file metadata such as a schema. A global schema is a higher-layer convention, not a mandatory type system in this minimal schema. (protos/file2.proto:28-39)

### Lines 40-57

Buffer count is independent of column/page counts. Writers may insert padding for alignment: 64-byte SIMD and 4096-byte direct IO alignment are examples. Asterisks in the diagram mark fields requiring sector alignment for direct IO, and readers must allow optional preceding padding. Footer integers are unsigned little-endian. These are format/documented IO layout expectations rather than proof a particular backend uses direct IO. (protos/file2.proto:40-57)

### Lines 58-96

Physical layout is data buffers, individual column metadata blocks, column metadata offset table, global buffer offset table, then footer. Offset tables list each metadata/global-buffer position and size. Footer fields in order are A u64 (first column metadata offset), B u64 (column-metadata-offset-table offset), C u64 (global-buffer-offset-table offset), u32 global-buffer count, u32 column count, u16 major version, u16 minor version, and ASCII LANC. The fixed footer width inferred from these declared widths is 40 bytes (3*8+2*4+2*2+4); verify the implementation before treating this arithmetic as an observed reader constant. The diagram marks the first table position and each metadata/data buffer as alignment points, but not every footer member. (protos/file2.proto:58-96)

### Lines 97-116

Page buffers need not be contiguous, though grouping is recommended for performance. Large pages mitigate seek/request overhead; the comment advises at least 8 MB and flushing when accumulated data is excessive, not a mandatory hard minimum. Concrete encodings are extensions. The ideal of adding plugins without recompilation is explicitly aspirational, not evidence of an implemented dynamic plugin registry. (protos/file2.proto:97-116)

### Lines 117-137

DeferredEncoding has uint64 buffer_location=1 and buffer_length=2, locating encoded metadata elsewhere. Its rationale is deduplicating identical encodings: global buffers can share across columns, column metadata buffers across pages, or an unusual page-local location can defer loading a large encoding until the page is needed. Reference bounds/cycles are not validated by this message. (protos/file2.proto:117-137)

### Lines 138-146

DirectEncoding stores bytes encoding=1 directly in metadata; the comment identifies this as the most common approach. It supplies no type URL or decoding algorithm by itself. (protos/file2.proto:138-146)

### Lines 147-166

Encoding supplies information to decode a page or interpret column metadata (for example bit width, dictionaries, statistics). Its location oneof uses DeferredEncoding indirect=1, DirectEncoding direct=2, or google.protobuf.Empty none=3. Explicit none is a declared alternative distinct from an unset oneof; the file does not define how an absent arm is handled. (protos/file2.proto:147-166)

### Lines 167-197

ColumnMetadata is stored near file end and can be read independently for projection. Nested Page has repeated uint64 buffer_offsets=1 and buffer_sizes=2 with equal lengths, possibly empty for constant encoding; uint64 length=3 is logical item count; Encoding encoding=4 describes page representation; uint64 priority=5 is, for tabular data, the first top-level row number. The comment says top-level rows should not split across pages. No scheduler or ordering implementation exists here. (protos/file2.proto:167-197)

### Lines 198-217

ColumnMetadata.encoding=1 typically describes column metadata buffers; repeated Page pages=2 lists data pages; repeated uint64 buffer_offsets=3 and buffer_sizes=4 identify column metadata buffers with matching lengths, including zero-length lists. Page and column buffer vectors are different address spaces whose interpretation comes from their encodings. (protos/file2.proto:198-217)

### Lines 218-223

The closing prose reiterates that this minimal file is only a building block and other protobufs provide useful extensions. The footer carries version integers but this file does not enumerate supported major/minor combinations or stable/unstable policies. Footer version integers are specified separately (protos/file2.proto:84-92). (protos/file2.proto:218-223)

## Interaction and interpretation limits

The complete physical envelope is specified here, but exact supported versions, integer limits, corruption handling, padding enforcement, IO behavior, and encoding dispatch require Rust and encoding-schema evidence (protos/file2.proto:11-115; protos/file2.proto:167-223). The claimed dynamic plugin extensibility is a design wish, not verified runtime behavior (protos/file2.proto:109-114).

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 |  
    4 | syntax = "proto3";
    5 | 
    6 | package lance.file.v2;
    7 | 
    8 | import "google/protobuf/any.proto";
    9 | import "google/protobuf/empty.proto";
   10 | 
   11 | /* # Lance v2.X File Format
   12 |  *
   13 |  * The Lance file format is a barebones format for serializing columnar data
   14 |  * into a file.
   15 |  *
   16 |  * * Each Lance file contains between 0 and 4Gi columns
   17 |  * * Each column contains between 0 and 4Gi pages
   18 |  * * Each page contains between 0 and 2^64 items
   19 |  * * Different pages within a column can have different items counts
   20 |  * * Columns may have up to 2^64 items
   21 |  * * Different columns within a file can have different item counts
   22 |  *
   23 |  * The Lance file format does not have any notion of a type system or schemas.
   24 |  * From the perspective of the file format all data is arbitrary buffers of
   25 |  * bytes with an extensible metadata block to describe the data.  It is up to
   26 |  * the user to interpret these bytes meaningfully.
   27 |  *
   28 |  * Data buffers are written to the file first.  These data buffers can be
   29 |  * referenced from three different places in the file:
   30 |  *
   31 |  * * Page encodings can reference data buffers.  This is the most common way
   32 |  *   that actual data is stored.
   33 |  * * Column encodings can reference data buffers.  For example, a column encoding
   34 |  *   may reference data buffer(s) containing statistics or dictionaries.
   35 |  * * Finally, the global buffer offset table can reference data buffers.  This
   36 |  *   is useful for storing data that is shared across multiple columns.
   37 |  *   This is also useful for global file metadata (e.g. a schema that describes
   38 |  *   the file)
   39 |  *
   40 |  * ## File Layout
   41 |  *
   42 |  * Note: the number of buffers (BN) is independent of the number of columns (CN)
   43 |  *       and pages.
   44 |  *
   45 |  *       Buffers often need to be aligned.  64-byte alignment is common when
   46 |  *       working with SIMD operations.  4096-byte alignment is common when
   47 |  *       working with direct I/O.  In order to ensure these buffers are aligned
   48 |  *       writers may need to insert padding before the buffers.
   49 |  *
   50 |  *       If direct I/O is required then most (but not all) fields described
   51 |  *       below must be sector aligned.  We have marked these fields with an
   52 |  *       asterisk for clarity.  Readers should assume there will be optional
   53 |  *       padding inserted before these fields.
   54 |  *
   55 |  *       All footer fields are unsigned integers written with  little endian
   56 |  *       byte order.
   57 |  *
   58 |  * ├──────────────────────────────────┤
   59 |  * | Data Pages                       |
   60 |  * |   Data Buffer 0*                 |
   61 |  * |   ...                            |
   62 |  * |   Data Buffer BN*                |
   63 |  * ├──────────────────────────────────┤
   64 |  * | Column Metadatas                 |
   65 |  * | |A| Column 0 Metadata*           |
   66 |  * |     Column 1 Metadata*           |
   67 |  * |     ...                          |
   68 |  * |     Column CN Metadata*          |
   69 |  * ├──────────────────────────────────┤
   70 |  * | Column Metadata Offset Table     |
   71 |  * | |B| Column 0 Metadata Position*  |
   72 |  * |     Column 0 Metadata Size       |
   73 |  * |     ...                          |
   74 |  * |     Column CN Metadata Position  |
   75 |  * |     Column CN Metadata Size      |
   76 |  * ├──────────────────────────────────┤
   77 |  * | Global Buffers Offset Table      |
   78 |  * | |C| Global Buffer 0 Position*    |
   79 |  * |     Global Buffer 0 Size         |
   80 |  * |     ...                          |
   81 |  * |     Global Buffer GN Position    |
   82 |  * |     Global Buffer GN Size        |
   83 |  * ├──────────────────────────────────┤
   84 |  * | Footer                           |
   85 |  * | A u64: Offset to column meta 0   |
   86 |  * | B u64: Offset to CMO table       |
   87 |  * | C u64: Offset to GBO table       |
   88 |  * |   u32: Number of global bufs     |
   89 |  * |   u32: Number of columns         |
   90 |  * |   u16: Major version             |
   91 |  * |   u16: Minor version             |
   92 |  * |   "LANC"                         |
   93 |  * ├──────────────────────────────────┤
   94 |  *
   95 |  * File Layout-End
   96 |  *
   97 |  * ## Data Pages
   98 |  *
   99 |  * A lot of flexibility is provided in how data is stored.  A page's buffers do
  100 |  * not strictly need to be contiguous on the disk.  However, it is recommended
  101 |  * that buffers within a page be grouped together for best performance.
  102 |  *
  103 |  * Data pages should be large.  The only time a page should be written to disk
  104 |  * is when the writer needs to flush the page to disk because it has accumulated
  105 |  * too much data.  Pages are not read in sequential order and if pages are too
  106 |  * small then the seek overhead (or request overhead) will be problematic.  We
  107 |  * generally advise that pages be at least 8MB or larger.
  108 |  *
  109 |  * ## Encodings
  110 |  *
  111 |  * Specific encodings are not part of this minimal format.  They are provided
  112 |  * by extensions. Readers and writers should be designed so that encodings can
  113 |  * be easily added and removed. Ideally, they should allow for this without
  114 |  * requiring recompilation through some kind of plugin system.
  115 |  */
  116 | 
  117 | /* The deferred encoding is used to place the encoding itself in a different
  118 |  * part of the file.  This is most commonly used to allow encodings to be shared
  119 |  * across different columns.  For example, when writing a file with thousands of
  120 |  * columns, where many pages have the exact same encoding, it can be useful
  121 |  * to cut down on the size of the metadata by using a deferred encoding.
  122 |  */
  123 | message DeferredEncoding {
  124 |    /* Location of the buffer containing the encoding.
  125 |     *
  126 |     * * If sharing encodings across columns then this will be in a global buffer
  127 |     * * If sharing encodings across pages within a column this could be in a
  128 |     *   column metadata buffer.
  129 |     * * This could also be a page buffer if the encoding is not shared, needs
  130 |     *   to be written before the file ends, and the encoding is too large to load
  131 |     *   unless we first determine the page needs to be read.  This combination
  132 |     *   seems unusual.
  133 |     */
  134 |    uint64 buffer_location = 1;
  135 |    uint64 buffer_length = 2;
  136 | }
  137 | 
  138 | // The encoding is placed directly in the metadata section
  139 | message DirectEncoding {
  140 |     /* The bytes that make up the encoding embedded directly in the metadata
  141 |      *
  142 |      * This is the most common approach.
  143 |      */
  144 |     bytes encoding = 1;
  145 | }
  146 | 
  147 | /* An encoding stores the information needed to decode a column or page
  148 |  *
  149 |  * For example, it could describe if the page is using bit packing, and how many bits
  150 |  * there are in each individual value.
  151 |  *
  152 |  * At the column level it can be used to wrap columns with dictionaries or statistics.
  153 |  */
  154 | message Encoding {
  155 |     oneof location {
  156 |         // The encoding is stored elsewhere and not part of this protobuf message
  157 |         DeferredEncoding indirect = 1;
  158 |         // The encoding is stored within this protobuf message
  159 |         DirectEncoding direct = 2;
  160 |         // There is no encoding information
  161 |         google.protobuf.Empty none = 3;
  162 |     }
  163 | }
  164 | 
  165 | // ## Metadata
  166 | 
  167 | /* Each column has a metadata block that is placed at the end of the file.
  168 |  * These may be read individually to allow for column projection.
  169 |  */
  170 | message ColumnMetadata {
  171 | 
  172 |   // This describes a page of column data.
  173 |   message Page {
  174 |     /* The file offsets for each of the page buffers
  175 |      *
  176 |      * The number of buffers is variable and depends on the encoding.  There
  177 |      * may be zero buffers (e.g. constant encoded data) in which case this
  178 |      * could be empty.
  179 |      */
  180 |     repeated uint64 buffer_offsets = 1;
  181 |     /* The size (in bytes) of each of the page buffers
  182 |      *
  183 |      * This field will have the same length as `buffer_offsets` and
  184 |      * may be empty.
  185 |      */
  186 |     repeated uint64 buffer_sizes = 2;
  187 |     // Logical length (e.g. # rows) of the page
  188 |     uint64 length = 3;
  189 |     // The encoding used to encode the page
  190 |     Encoding encoding = 4;
  191 |     /* The priority of the page
  192 |      *
  193 |      * For tabular data this will be the top-level row number of the first row
  194 |      * in the page (and top-level rows should not split across pages).
  195 |      */
  196 |     uint64 priority = 5;
  197 |   }
  198 |   /* Encoding information about the column itself.  This typically describes
  199 |    * how to interpret the column metadata buffers.  For example, it could
  200 |    * describe how statistics or dictionaries are stored in the column metadata.
  201 |    */
  202 |   Encoding encoding = 1;
  203 |   // The pages in the column
  204 |   repeated Page pages = 2;   
  205 |   /* The file offsets of each of the column metadata buffers
  206 |    *
  207 |    * There may be zero buffers.
  208 |    */
  209 |   repeated uint64 buffer_offsets = 3;
  210 |   /* The size (in bytes) of each of the column metadata buffers
  211 |    *
  212 |    * This field will have the same length as `buffer_offsets` and
  213 |    * may be empty.
  214 |    */
  215 |   repeated uint64 buffer_sizes = 4;
  216 | } // Metadata-End
  217 | 
  218 | /* ## Where is the rest?
  219 |  *
  220 |  * This file format is extremely minimal.  It is a building block for
  221 |  * creating more useful readers and writers and not terribly useful by itself.
  222 |  * Other protobuf files will describe how this can be extended.
  223 |  */
``````
