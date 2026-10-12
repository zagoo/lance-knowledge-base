> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-file/src/datatypes.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `4def79eef44735831e74755cbe1b567b313d9769d013ecad4e3f9844e9860a28`. Reviewed physical lines: 1-565.

[Module](../../../../L1-modules/rust-lance-file-runtime.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Public wrappers and trait conversions between flat protobuf fields/dictionary metadata and Lance core field trees; arena reconstruction preserves historical duplicate-ID tie-breaking. No file IO is performed. (rust/lance-file/src/datatypes.rs:1-565)

## Complete range analysis

### Lines 1-10

SPDX and imports connect Arrow extension-name metadata, core Dictionary/Encoding/Field/LogicalType/Schema, Error/Result, HashMap and generated file protobuf. These conversions are shared schema boundaries, not an encoding implementation. (rust/lance-file/src/datatypes.rs:1-10)

### Lines 11-25

From<&pb::Field> is infallible despite the clippy allowance. Clone metadata keys and decode byte values with UTF-8 replacement, losing invalid original bytes. A nonempty dedicated extension_name overwrites the same metadata key; an empty dedicated name leaves an existing metadata extension intact. (rust/lance-file/src/datatypes.rs:11-25)

### Lines 26-41

Copy name/id/parent_id/nullability, wrap the logical type string, map numeric encodings 1 Plain,2 VarBinary,3 Dictionary,4 RLE and every other value to None. Start with no children and convert optional dictionary location; pb r#type is ignored. No logical-type, ID, encoding or dictionary-bound validation is performed here. (rust/lance-file/src/datatypes.rs:26-41)

### Lines 42-57

Primary-key position is Some(positive position), else Some(0) if the legacy primary-key boolean is true, else None. Clustering position is Some only for a positive position; its legacy boolean is ignored. These branches preserve primary-key legacy presence while clustering position zero decodes absent. Closing braces finish the field decoder. (rust/lance-file/src/datatypes.rs:42-57)

### Lines 58-79

From<&Field> for pb::Field copies IDs/name/logical-type/nullability, encodes string metadata as UTF-8 bytes and dictionary location, and maps the four Encoding variants to1..4, None to0. It does not recursively emit children; Fields handles flattening separately. (rust/lance-file/src/datatypes.rs:58-79)

### Lines 80-94

The protobuf field separately stores extension_name from core metadata or empty, forces r#type=0, sets legacy primary-key bool from Option presence and stores its position or0. It always writes legacy clustering bool=false and position or0. Core Some(0) primary survives via bool; Some(0) clustering would lose presence. No mutation of input. (rust/lance-file/src/datatypes.rs:80-94)

### Lines 95-101

Public tuple Fields owns Vec<pb::Field>. Private FieldNode owns one childless core Field plus child arena indices. No derives or validation occur in these declarations. (rust/lance-file/src/datatypes.rs:95-101)

### Lines 102-122

first_field_index_by_id iteratively traverses roots and children in pre-order using a LIFO stack populated in reverse order. Return first matching field ID, else None. Each call reserves up to all arena nodes and may scan all; it trusts internal indices. This reproduces the historical tree tie-break when duplicate IDs make a map lookup ambiguous. (rust/lance-file/src/datatypes.rs:102-122)

### Lines 123-130

From<&Field> for Fields recursively emits the parent followed by each child subtree in order, extending from newly built child Vecs. IDs/parent_id are retained, not reassigned or repaired. Deep trees still use recursive encoding and repeatedly move descendants through intermediate vectors; iterative decoding does not make all schema operations stack-safe. (rust/lance-file/src/datatypes.rs:123-130)

### Lines 131-159

TryFrom<&Fields> for Schema documents a flat pre-order list with parents before children, historical duplicates and legacy first-preorder matching. The compiling-style example reconstructs a single int32 root id0,parent-1 named value and asserts its name. Error associated type is core Error. The implementation actually requires earlier parents, not strictly contiguous pre-order input. (rust/lance-file/src/datatypes.rs:131-159)

### Lines 160-193

Preallocate nodes, root indices and HashMap<i32,Option<usize>> to input length. For each protobuf field, parent_id=-1 marks a root. Unique prior parent ID uses the constant-time map entry; duplicate marker None invokes DFS. Missing parent returns Schema with child name/id/parent and earlier-parent requirement. An impossible ambiguous-map/no-arena match returns Internal. Parent lookup happens before inserting this field, so no forward/self-new parent is accepted; referencing an earlier node with the same ID is possible. (rust/lance-file/src/datatypes.rs:160-193)

### Lines 194-210

Attach new arena index to parent or root list, convert the protobuf field, and insert its ID into the map. The second and every subsequent occurrence change the map entry to None, permanently marking ambiguity. Duplicate IDs are retained instead of rejected. Parent/root and child order are insertion order; valid unique-ID construction is expected linear hash-map work plus payload copies, while repeated ambiguous parents may make reconstruction quadratic. (rust/lance-file/src/datatypes.rs:194-210)

### Lines 211-228

Allocate Option<Field> slots and materialize nodes in reverse insertion order. Reserve each child list, take already built children in recorded order and set the parent slot. Missing/already-taken child is Internal with node index. Earlier-parent construction guarantees child indices are greater for normal inputs. No recursive reconstruction, but Field destruction and other consumers may still recurse. (rust/lance-file/src/datatypes.rs:211-228)

### Lines 229-246

Take root slots in recorded order, returning Internal if unexpectedly absent; collect through Result and return Schema with an empty metadata map. Empty field input yields an empty schema. No Schema::validate, uniqueness/type/nullability/key validation or parent-ID normalization follows reconstruction. Conversion errors discard temporary arena state without external effects. (rust/lance-file/src/datatypes.rs:229-246)

### Lines 247-272

Public FieldsWithMeta owns Fields plus HashMap<String,Vec<u8>> schema metadata, both public. TryFrom owned wrapper has core Error. Example supplies no fields and owner=lance bytes, then asserts decoded schema metadata; it does not validate a nonempty schema. (rust/lance-file/src/datatypes.rs:247-272)

### Lines 273-290

Owned schema metadata keys are moved and byte values lossily converted to strings before fallible field reconstruction. On success use its fields plus converted metadata, replacing the empty metadata map. Invalid UTF-8 is replacement-decoded; a later missing-parent error drops the converted metadata. (rust/lance-file/src/datatypes.rs:273-290)

### Lines 291-315

From<&Schema> for Fields flattens each top-level field subtree in order. From<&Schema> for FieldsWithMeta uses that flattening and clones the entire string metadata map before consuming values into bytes. Neither assigns IDs nor validates the input; there is no fallible result. (rust/lance-file/src/datatypes.rs:291-315)

### Lines 316-334

Dictionary protobuf i64 offset/length are cast directly to usize; values is always None. Reverse casts usize back to i64 and never serializes loaded dictionary values. Negative values/overflow/truncation are not rejected at this boundary; architecture width affects the cast. These are locations/counts, not loaded dictionaries. (rust/lance-file/src/datatypes.rs:316-334)

### Lines 335-345

Owned Encoding converts exhaustively to the matching protobuf enum, including RLE -> Rle. Unlike raw field encoding decode there is no unknown variant branch. (rust/lance-file/src/datatypes.rs:335-345)

### Lines 346-369

cfg(test) imports Arrow/core schema types and wrappers. Private proto_field helper sets id,parent_id,name,logical_type and leaves all other protobuf fields at Default. No historical fixture is loaded by this helper. (rust/lance-file/src/datatypes.rs:346-369)

### Lines 370-393

test_schema_set_ids constructs a,b-struct(f1,f2,f3),c Arrow fields, imports to core, flattens and asserts protobuf IDs exactly0..6. ID assignment comes from core import, not this flattening conversion. Does not assert parent IDs or roundtrip. (rust/lance-file/src/datatypes.rs:370-393)

### Lines 394-411

test_schema_metadata creates one int32 field plus k1/v1,k2/v2, imports core, encodes FieldsWithMeta, decodes and asserts Schema equality. Core Schema::PartialEq compares only fields (rust/lance-core/src/datatypes/schema.rs:874-878), so this test does not actually assert preservation of the top-level metadata map. Only valid UTF-8 values are exercised. (rust/lance-file/src/datatypes.rs:394-411)

### Lines 412-453

Wide reconstruction fixture builds4096 root structs, each with two int32 children and unique IDs (12288 fields total). It asserts root count, every root ID/name, two-child count and both child IDs/names in order. No timing, allocation or logical-type assertion; source intent does not prove a performance bound. (rust/lance-file/src/datatypes.rs:412-453)

### Lines 454-488

Deep reconstruction fixture builds1024 nodes in a single chain, struct except final int32. It asserts one root, each ID/name, exactly one child until the leaf and no leaf children. Iterative traversal tests construction depth; no measured stack bound or claim about recursive serialization/drop. (rust/lance-file/src/datatypes.rs:454-488)

### Lines 489-501

Missing-parent fixture supplies child id7,parent42 and asserts Error::Schema plus contextual message substring. It does not separately exercise a forward reference where that parent appears later. (rust/lance-file/src/datatypes.rs:489-501)

### Lines 502-521

Duplicate-ID fixture lists root_a1,root_b2,nested_duplicate2 under root_a,then child3 parent2. Decoding attaches child beneath the nested duplicate, which appears first in reconstructed pre-order even though root_b appeared earlier in the flat list. It asserts both root/child shapes, pinning the historical tie-break. (rust/lance-file/src/datatypes.rs:502-521)

### Lines 522-549

Clustering fixture gives region Utf8 metadata position1,date Int32 position2 and unmarked value Float64. Core import and unenforced_clustering_key must return two fields ordered region,date. Metadata keys are exactly lance-schema:unenforced-clustering-key:position. (rust/lance-file/src/datatypes.rs:522-549)

### Lines 550-565

Roundtrip through FieldsWithMeta preserves both clustering field names and Some(1)/Some(2); value remains not a clustering key. No local tests for invalid UTF-8, unknown encodings, extension-name precedence, dictionary negative casts or primary-key legacy-position combinations. Module ends; no tests were run. (rust/lance-file/src/datatypes.rs:550-565)

## Interaction and interpretation limits

All565 lines read and authored. Callers include the analyzed table format conversion and contextual reader decode_schema at rust/lance-file/src/reader.rs:942-952. Core Field conversion has already been analyzed. Shared current reader and exact current writers are analyzed, and the complete V1 reader is now covered. all six pinned binary fixtures are interpreted; local roundtrip tests were read only.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use lance_arrow::ARROW_EXT_NAME_KEY;
    5 | use lance_core::datatypes::{Dictionary, Encoding, Field, LogicalType, Schema};
    6 | use lance_core::{Error, Result};
    7 | use std::collections::HashMap;
    8 | 
    9 | use crate::format::pb;
   10 | 
   11 | #[allow(clippy::fallible_impl_from)]
   12 | impl From<&pb::Field> for Field {
   13 |     fn from(field: &pb::Field) -> Self {
   14 |         let lance_metadata: HashMap<String, String> = field
   15 |             .metadata
   16 |             .iter()
   17 |             .map(|(key, value)| {
   18 |                 let string_value = String::from_utf8_lossy(value).to_string();
   19 |                 (key.clone(), string_value)
   20 |             })
   21 |             .collect();
   22 |         let mut lance_metadata = lance_metadata;
   23 |         if !field.extension_name.is_empty() {
   24 |             lance_metadata.insert(ARROW_EXT_NAME_KEY.to_string(), field.extension_name.clone());
   25 |         }
   26 |         Self {
   27 |             name: field.name.clone(),
   28 |             id: field.id,
   29 |             parent_id: field.parent_id,
   30 |             logical_type: LogicalType::from(field.logical_type.as_str()),
   31 |             metadata: lance_metadata,
   32 |             encoding: match field.encoding {
   33 |                 1 => Some(Encoding::Plain),
   34 |                 2 => Some(Encoding::VarBinary),
   35 |                 3 => Some(Encoding::Dictionary),
   36 |                 4 => Some(Encoding::RLE),
   37 |                 _ => None,
   38 |             },
   39 |             nullable: field.nullable,
   40 |             children: vec![],
   41 |             dictionary: field.dictionary.as_ref().map(Dictionary::from),
   42 |             unenforced_primary_key_position: if field.unenforced_primary_key_position > 0 {
   43 |                 Some(field.unenforced_primary_key_position)
   44 |             } else if field.unenforced_primary_key {
   45 |                 Some(0)
   46 |             } else {
   47 |                 None
   48 |             },
   49 |             unenforced_clustering_key_position: if field.unenforced_clustering_key_position > 0 {
   50 |                 Some(field.unenforced_clustering_key_position)
   51 |             } else {
   52 |                 None
   53 |             },
   54 |         }
   55 |     }
   56 | }
   57 | 
   58 | impl From<&Field> for pb::Field {
   59 |     fn from(field: &Field) -> Self {
   60 |         let pb_metadata = field
   61 |             .metadata
   62 |             .iter()
   63 |             .map(|(key, value)| (key.clone(), value.clone().into_bytes()))
   64 |             .collect();
   65 |         Self {
   66 |             id: field.id,
   67 |             parent_id: field.parent_id,
   68 |             name: field.name.clone(),
   69 |             logical_type: field.logical_type.to_string(),
   70 |             encoding: match field.encoding {
   71 |                 Some(Encoding::Plain) => 1,
   72 |                 Some(Encoding::VarBinary) => 2,
   73 |                 Some(Encoding::Dictionary) => 3,
   74 |                 Some(Encoding::RLE) => 4,
   75 |                 _ => 0,
   76 |             },
   77 |             nullable: field.nullable,
   78 |             dictionary: field.dictionary.as_ref().map(pb::Dictionary::from),
   79 |             metadata: pb_metadata,
   80 |             extension_name: field
   81 |                 .extension_name()
   82 |                 .map(|name| name.to_owned())
   83 |                 .unwrap_or_default(),
   84 |             r#type: 0,
   85 |             unenforced_primary_key: field.unenforced_primary_key_position.is_some(),
   86 |             unenforced_primary_key_position: field.unenforced_primary_key_position.unwrap_or(0),
   87 |             unenforced_clustering_key: false,
   88 |             unenforced_clustering_key_position: field
   89 |                 .unenforced_clustering_key_position
   90 |                 .unwrap_or(0),
   91 |         }
   92 |     }
   93 | }
   94 | 
   95 | pub struct Fields(pub Vec<pb::Field>);
   96 | 
   97 | struct FieldNode {
   98 |     field: Field,
   99 |     child_indices: Vec<usize>,
  100 | }
  101 | 
  102 | /// Searches in pre-order depth-first order and returns the first matching node,
  103 | /// preserving the legacy parent tie-break for duplicate field IDs.
  104 | fn first_field_index_by_id(
  105 |     nodes: &[FieldNode],
  106 |     root_indices: &[usize],
  107 |     field_id: i32,
  108 | ) -> Option<usize> {
  109 |     let mut to_visit = Vec::with_capacity(nodes.len());
  110 |     to_visit.extend(root_indices.iter().rev().copied());
  111 | 
  112 |     while let Some(node_index) = to_visit.pop() {
  113 |         let node = &nodes[node_index];
  114 |         if node.field.id == field_id {
  115 |             return Some(node_index);
  116 |         }
  117 |         to_visit.extend(node.child_indices.iter().rev().copied());
  118 |     }
  119 | 
  120 |     None
  121 | }
  122 | 
  123 | impl From<&Field> for Fields {
  124 |     fn from(field: &Field) -> Self {
  125 |         let mut protos = vec![pb::Field::from(field)];
  126 |         protos.extend(field.children.iter().flat_map(|val| Self::from(val).0));
  127 |         Self(protos)
  128 |     }
  129 | }
  130 | 
  131 | /// Reconstruct a schema from a flat, pre-order protobuf field list.
  132 | ///
  133 | /// Parent fields must appear before their children. Historical manifests may
  134 | /// contain duplicate field IDs, so an ID may not identify a unique parent. For
  135 | /// those references, reconstruction preserves the legacy
  136 | /// [`Schema::mut_field_by_id`] tie-break by selecting the first matching field
  137 | /// in pre-order depth-first traversal.
  138 | ///
  139 | /// # Examples
  140 | ///
  141 | /// ```
  142 | /// use lance_core::datatypes::Schema;
  143 | /// use lance_file::{datatypes::Fields, format::pb};
  144 | ///
  145 | /// let field = pb::Field {
  146 | ///     id: 0,
  147 | ///     parent_id: -1,
  148 | ///     name: "value".to_owned(),
  149 | ///     logical_type: "int32".to_owned(),
  150 | ///     ..Default::default()
  151 | /// };
  152 | /// let fields = Fields(vec![field]);
  153 | /// let schema = Schema::try_from(&fields)?;
  154 | /// assert_eq!(schema.fields[0].name, "value");
  155 | /// # Ok::<(), lance_core::Error>(())
  156 | /// ```
  157 | impl TryFrom<&Fields> for Schema {
  158 |     type Error = Error;
  159 | 
  160 |     fn try_from(fields: &Fields) -> Result<Self> {
  161 |         let mut nodes: Vec<FieldNode> = Vec::with_capacity(fields.0.len());
  162 |         let mut root_indices = Vec::with_capacity(fields.0.len());
  163 |         let mut field_indices: HashMap<i32, Option<usize>> = HashMap::with_capacity(fields.0.len());
  164 | 
  165 |         for proto_field in &fields.0 {
  166 |             let parent_index = if proto_field.parent_id == -1 {
  167 |                 None
  168 |             } else {
  169 |                 let parent_index = match field_indices.get(&proto_field.parent_id) {
  170 |                     Some(Some(parent_index)) => *parent_index,
  171 |                     Some(None) => {
  172 |                         // Duplicate IDs are invalid but occur in historical
  173 |                         // manifests. Match the legacy tree traversal only for
  174 |                         // these ambiguous parent references so valid schemas
  175 |                         // retain the linear fast path.
  176 |                         first_field_index_by_id(&nodes, &root_indices, proto_field.parent_id)
  177 |                             .ok_or_else(|| {
  178 |                                 Error::internal(format!(
  179 |                                     "Duplicate field id {} has no existing arena node",
  180 |                                     proto_field.parent_id
  181 |                                 ))
  182 |                             })?
  183 |                     }
  184 |                     None => {
  185 |                         return Err(Error::schema(format!(
  186 |                             "Field '{}' (id={}) references parent id {}, which must appear earlier in the protobuf field list",
  187 |                             proto_field.name, proto_field.id, proto_field.parent_id
  188 |                         )));
  189 |                     }
  190 |                 };
  191 |                 Some(parent_index)
  192 |             };
  193 | 
  194 |             let node_index = nodes.len();
  195 |             if let Some(parent_index) = parent_index {
  196 |                 nodes[parent_index].child_indices.push(node_index);
  197 |             } else {
  198 |                 root_indices.push(node_index);
  199 |             }
  200 |             nodes.push(FieldNode {
  201 |                 field: Field::from(proto_field),
  202 |                 child_indices: Vec::new(),
  203 |             });
  204 | 
  205 |             field_indices
  206 |                 .entry(proto_field.id)
  207 |                 .and_modify(|field_index| *field_index = None)
  208 |                 .or_insert(Some(node_index));
  209 |         }
  210 | 
  211 |         let mut fields_by_node = Vec::with_capacity(nodes.len());
  212 |         fields_by_node.resize_with(nodes.len(), || None);
  213 |         for (node_index, mut node) in nodes.into_iter().enumerate().rev() {
  214 |             node.field.children.reserve(node.child_indices.len());
  215 |             for child_index in node.child_indices {
  216 |                 let child = fields_by_node
  217 |                     .get_mut(child_index)
  218 |                     .and_then(Option::take)
  219 |                     .ok_or_else(|| {
  220 |                         Error::internal(format!(
  221 |                             "Schema field arena node {child_index} was not materialized before its parent"
  222 |                         ))
  223 |                     })?;
  224 |                 node.field.children.push(child);
  225 |             }
  226 |             fields_by_node[node_index] = Some(node.field);
  227 |         }
  228 | 
  229 |         let fields = root_indices
  230 |             .into_iter()
  231 |             .map(|root_index| {
  232 |                 fields_by_node[root_index].take().ok_or_else(|| {
  233 |                     Error::internal(format!(
  234 |                         "Schema field arena root node {root_index} was not materialized"
  235 |                     ))
  236 |                 })
  237 |             })
  238 |             .collect::<Result<Vec<_>>>()?;
  239 | 
  240 |         Ok(Self {
  241 |             fields,
  242 |             metadata: HashMap::default(),
  243 |         })
  244 |     }
  245 | }
  246 | 
  247 | pub struct FieldsWithMeta {
  248 |     pub fields: Fields,
  249 |     pub metadata: HashMap<String, Vec<u8>>,
  250 | }
  251 | 
  252 | /// Reconstruct a schema from flat protobuf fields and schema metadata.
  253 | ///
  254 | /// # Examples
  255 | ///
  256 | /// ```
  257 | /// use std::collections::HashMap;
  258 | ///
  259 | /// use lance_core::datatypes::Schema;
  260 | /// use lance_file::datatypes::{Fields, FieldsWithMeta};
  261 | ///
  262 | /// let fields = FieldsWithMeta {
  263 | ///     fields: Fields(Vec::new()),
  264 | ///     metadata: HashMap::from([("owner".to_owned(), b"lance".to_vec())]),
  265 | /// };
  266 | /// let schema = Schema::try_from(fields)?;
  267 | /// assert_eq!(schema.metadata["owner"], "lance");
  268 | /// # Ok::<(), lance_core::Error>(())
  269 | /// ```
  270 | impl TryFrom<FieldsWithMeta> for Schema {
  271 |     type Error = Error;
  272 | 
  273 |     fn try_from(fields_with_meta: FieldsWithMeta) -> Result<Self> {
  274 |         let lance_metadata = fields_with_meta
  275 |             .metadata
  276 |             .into_iter()
  277 |             .map(|(key, value)| {
  278 |                 let string_value = String::from_utf8_lossy(&value).to_string();
  279 |                 (key, string_value)
  280 |             })
  281 |             .collect();
  282 | 
  283 |         let schema_with_fields = Self::try_from(&fields_with_meta.fields)?;
  284 |         Ok(Self {
  285 |             fields: schema_with_fields.fields,
  286 |             metadata: lance_metadata,
  287 |         })
  288 |     }
  289 | }
  290 | 
  291 | /// Convert a Schema to a list of protobuf Field.
  292 | impl From<&Schema> for Fields {
  293 |     fn from(schema: &Schema) -> Self {
  294 |         let mut protos = vec![];
  295 |         schema.fields.iter().for_each(|f| {
  296 |             protos.extend(Self::from(f).0);
  297 |         });
  298 |         Self(protos)
  299 |     }
  300 | }
  301 | 
  302 | /// Convert a Schema to a list of protobuf Field and Metadata
  303 | impl From<&Schema> for FieldsWithMeta {
  304 |     fn from(schema: &Schema) -> Self {
  305 |         let fields = schema.into();
  306 |         let metadata = schema
  307 |             .metadata
  308 |             .clone()
  309 |             .into_iter()
  310 |             .map(|(key, value)| (key, value.into_bytes()))
  311 |             .collect();
  312 |         Self { fields, metadata }
  313 |     }
  314 | }
  315 | 
  316 | impl From<&pb::Dictionary> for Dictionary {
  317 |     fn from(proto: &pb::Dictionary) -> Self {
  318 |         Self {
  319 |             offset: proto.offset as usize,
  320 |             length: proto.length as usize,
  321 |             values: None,
  322 |         }
  323 |     }
  324 | }
  325 | 
  326 | impl From<&Dictionary> for pb::Dictionary {
  327 |     fn from(d: &Dictionary) -> Self {
  328 |         Self {
  329 |             offset: d.offset as i64,
  330 |             length: d.length as i64,
  331 |         }
  332 |     }
  333 | }
  334 | 
  335 | impl From<Encoding> for pb::Encoding {
  336 |     fn from(e: Encoding) -> Self {
  337 |         match e {
  338 |             Encoding::Plain => Self::Plain,
  339 |             Encoding::VarBinary => Self::VarBinary,
  340 |             Encoding::Dictionary => Self::Dictionary,
  341 |             Encoding::RLE => Self::Rle,
  342 |         }
  343 |     }
  344 | }
  345 | 
  346 | #[cfg(test)]
  347 | mod tests {
  348 |     use std::collections::HashMap;
  349 | 
  350 |     use arrow_schema::DataType;
  351 |     use arrow_schema::Field as ArrowField;
  352 |     use arrow_schema::Fields as ArrowFields;
  353 |     use arrow_schema::Schema as ArrowSchema;
  354 |     use lance_core::Error;
  355 |     use lance_core::datatypes::Schema;
  356 | 
  357 |     use super::{Fields, FieldsWithMeta};
  358 |     use crate::format::pb;
  359 | 
  360 |     fn proto_field(id: i32, parent_id: i32, name: String, logical_type: &str) -> pb::Field {
  361 |         pb::Field {
  362 |             id,
  363 |             parent_id,
  364 |             name,
  365 |             logical_type: logical_type.to_owned(),
  366 |             ..Default::default()
  367 |         }
  368 |     }
  369 | 
  370 |     #[test]
  371 |     fn test_schema_set_ids() {
  372 |         let arrow_schema = ArrowSchema::new(vec![
  373 |             ArrowField::new("a", DataType::Int32, false),
  374 |             ArrowField::new(
  375 |                 "b",
  376 |                 DataType::Struct(ArrowFields::from(vec![
  377 |                     ArrowField::new("f1", DataType::Utf8, true),
  378 |                     ArrowField::new("f2", DataType::Boolean, false),
  379 |                     ArrowField::new("f3", DataType::Float32, false),
  380 |                 ])),
  381 |                 true,
  382 |             ),
  383 |             ArrowField::new("c", DataType::Float64, false),
  384 |         ]);
  385 |         let schema = Schema::try_from(&arrow_schema).unwrap();
  386 | 
  387 |         let protos: Fields = (&schema).into();
  388 |         assert_eq!(
  389 |             protos.0.iter().map(|p| p.id).collect::<Vec<_>>(),
  390 |             (0..6).collect::<Vec<_>>()
  391 |         );
  392 |     }
  393 | 
  394 |     #[test]
  395 |     fn test_schema_metadata() {
  396 |         let mut metadata: HashMap<String, String> = HashMap::new();
  397 |         metadata.insert(String::from("k1"), String::from("v1"));
  398 |         metadata.insert(String::from("k2"), String::from("v2"));
  399 | 
  400 |         let arrow_schema = ArrowSchema::new_with_metadata(
  401 |             vec![ArrowField::new("a", DataType::Int32, false)],
  402 |             metadata,
  403 |         );
  404 | 
  405 |         let expected_schema = Schema::try_from(&arrow_schema).unwrap();
  406 |         let fields_with_meta: FieldsWithMeta = (&expected_schema).into();
  407 | 
  408 |         let schema = Schema::try_from(fields_with_meta).unwrap();
  409 |         assert_eq!(expected_schema, schema);
  410 |     }
  411 | 
  412 |     #[test]
  413 |     fn test_reconstruct_wide_nested_schema() {
  414 |         const NUM_STRUCTS: usize = 4096;
  415 | 
  416 |         let mut proto_fields = Vec::with_capacity(NUM_STRUCTS * 3);
  417 |         for struct_index in 0..NUM_STRUCTS {
  418 |             let parent_id = (struct_index * 3) as i32;
  419 |             proto_fields.push(proto_field(
  420 |                 parent_id,
  421 |                 -1,
  422 |                 format!("struct_{struct_index}"),
  423 |                 "struct",
  424 |             ));
  425 |             proto_fields.push(proto_field(
  426 |                 parent_id + 1,
  427 |                 parent_id,
  428 |                 format!("left_{struct_index}"),
  429 |                 "int32",
  430 |             ));
  431 |             proto_fields.push(proto_field(
  432 |                 parent_id + 2,
  433 |                 parent_id,
  434 |                 format!("right_{struct_index}"),
  435 |                 "int32",
  436 |             ));
  437 |         }
  438 | 
  439 |         let fields = Fields(proto_fields);
  440 |         let schema = Schema::try_from(&fields).unwrap();
  441 |         assert_eq!(schema.fields.len(), NUM_STRUCTS);
  442 |         for (struct_index, field) in schema.fields.iter().enumerate() {
  443 |             let parent_id = (struct_index * 3) as i32;
  444 |             assert_eq!(field.id, parent_id);
  445 |             assert_eq!(field.name, format!("struct_{struct_index}"));
  446 |             assert_eq!(field.children.len(), 2);
  447 |             assert_eq!(field.children[0].id, parent_id + 1);
  448 |             assert_eq!(field.children[0].name, format!("left_{struct_index}"));
  449 |             assert_eq!(field.children[1].id, parent_id + 2);
  450 |             assert_eq!(field.children[1].name, format!("right_{struct_index}"));
  451 |         }
  452 |     }
  453 | 
  454 |     #[test]
  455 |     fn test_reconstruct_deep_nested_schema() {
  456 |         const DEPTH: usize = 1024;
  457 | 
  458 |         let proto_fields = (0..DEPTH)
  459 |             .map(|depth| {
  460 |                 proto_field(
  461 |                     depth as i32,
  462 |                     if depth == 0 { -1 } else { depth as i32 - 1 },
  463 |                     format!("level_{depth}"),
  464 |                     if depth + 1 == DEPTH {
  465 |                         "int32"
  466 |                     } else {
  467 |                         "struct"
  468 |                     },
  469 |                 )
  470 |             })
  471 |             .collect();
  472 | 
  473 |         let fields = Fields(proto_fields);
  474 |         let schema = Schema::try_from(&fields).unwrap();
  475 |         assert_eq!(schema.fields.len(), 1);
  476 |         let mut field = &schema.fields[0];
  477 |         for depth in 0..DEPTH {
  478 |             assert_eq!(field.id, depth as i32);
  479 |             assert_eq!(field.name, format!("level_{depth}"));
  480 |             if depth + 1 == DEPTH {
  481 |                 assert!(field.children.is_empty());
  482 |             } else {
  483 |                 assert_eq!(field.children.len(), 1);
  484 |                 field = &field.children[0];
  485 |             }
  486 |         }
  487 |     }
  488 | 
  489 |     #[test]
  490 |     fn test_reconstruct_schema_reports_missing_parent() {
  491 |         let fields = Fields(vec![proto_field(7, 42, "child".to_owned(), "int32")]);
  492 | 
  493 |         let error = Schema::try_from(&fields).unwrap_err();
  494 |         assert!(matches!(&error, Error::Schema { .. }));
  495 |         assert!(
  496 |             error.to_string().contains(
  497 |                 "Field 'child' (id=7) references parent id 42, which must appear earlier"
  498 |             )
  499 |         );
  500 |     }
  501 | 
  502 |     #[test]
  503 |     fn test_reconstruct_schema_preserves_legacy_duplicate_id_match() {
  504 |         let fields = Fields(vec![
  505 |             proto_field(1, -1, "root_a".to_owned(), "struct"),
  506 |             proto_field(2, -1, "root_b".to_owned(), "struct"),
  507 |             proto_field(2, 1, "nested_duplicate".to_owned(), "struct"),
  508 |             proto_field(3, 2, "child".to_owned(), "int32"),
  509 |         ]);
  510 | 
  511 |         let schema = Schema::try_from(&fields).unwrap();
  512 |         assert_eq!(schema.fields.len(), 2);
  513 |         assert_eq!(schema.fields[0].name, "root_a");
  514 |         assert_eq!(schema.fields[0].children.len(), 1);
  515 |         assert_eq!(schema.fields[0].children[0].name, "nested_duplicate");
  516 |         assert_eq!(schema.fields[0].children[0].children.len(), 1);
  517 |         assert_eq!(schema.fields[0].children[0].children[0].name, "child");
  518 |         assert_eq!(schema.fields[1].name, "root_b");
  519 |         assert!(schema.fields[1].children.is_empty());
  520 |     }
  521 | 
  522 |     #[test]
  523 |     fn test_clustering_key_roundtrip() {
  524 |         let arrow_schema = ArrowSchema::new(vec![
  525 |             ArrowField::new("region", DataType::Utf8, true).with_metadata(
  526 |                 vec![(
  527 |                     "lance-schema:unenforced-clustering-key:position".to_owned(),
  528 |                     "1".to_owned(),
  529 |                 )]
  530 |                 .into_iter()
  531 |                 .collect::<HashMap<_, _>>(),
  532 |             ),
  533 |             ArrowField::new("date", DataType::Int32, false).with_metadata(
  534 |                 vec![(
  535 |                     "lance-schema:unenforced-clustering-key:position".to_owned(),
  536 |                     "2".to_owned(),
  537 |                 )]
  538 |                 .into_iter()
  539 |                 .collect::<HashMap<_, _>>(),
  540 |             ),
  541 |             ArrowField::new("value", DataType::Float64, true),
  542 |         ]);
  543 | 
  544 |         let schema = Schema::try_from(&arrow_schema).unwrap();
  545 |         let ck = schema.unenforced_clustering_key();
  546 |         assert_eq!(ck.len(), 2);
  547 |         assert_eq!(ck[0].name, "region");
  548 |         assert_eq!(ck[1].name, "date");
  549 | 
  550 |         // Round-trip through protobuf
  551 |         let fields_with_meta: FieldsWithMeta = (&schema).into();
  552 |         let restored = Schema::try_from(fields_with_meta).unwrap();
  553 | 
  554 |         let ck2 = restored.unenforced_clustering_key();
  555 |         assert_eq!(ck2.len(), 2);
  556 |         assert_eq!(ck2[0].name, "region");
  557 |         assert_eq!(ck2[1].name, "date");
  558 |         assert_eq!(ck2[0].unenforced_clustering_key_position, Some(1));
  559 |         assert_eq!(ck2[1].unenforced_clustering_key_position, Some(2));
  560 | 
  561 |         // Non-clustering-key field should not have position
  562 |         let value_field = restored.field("value").unwrap();
  563 |         assert!(!value_field.is_unenforced_clustering_key());
  564 |     }
  565 | }
``````
