> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-encoding/src/encodings/logical/map.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `2615e24b4d408e49ca48aeabbdedfc548c780f54308b0a0ad7fa6943629b7edd`. Reviewed physical lines: 1-801.

[Module](../../../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Structural Map wrapper: list-style rep/def offsets, entry-array delegation, unchanged top-level scheduling and validated Arrow reconstruction. (rust/lance-encoding/src/encodings/logical/map.rs:1-801)

## Complete range analysis

### Lines 1-22

License/imports combine Arrow Map/Struct/List, ListArrayExt, null deepcopy, structural encode/decode traits and composite rep/def. No separate map physical layout is declared here. (rust/lance-encoding/src/encodings/logical/map.rs:1-22)

### Lines 23-41

Public MapStructuralEncoder stores private keep_original_array and boxed child encoder. Public constructor only stores fields. Comment describes Arrow Map as List of Struct entries. (rust/lance-encoding/src/encodings/logical/map.rs:23-41)

### Lines 42-62

maybe_encode downcasts via expect, so wrong runtime array type panics. add_offsets records cloned map offsets and either cloned or deeply copied nulls. Returned garbage flag identifies physical values under own null maps. Null-copy policy affects bitmap ownership, not all entries storage. (rust/lance-encoding/src/encodings/logical/map.rs:42-62)

### Lines 63-74

Convert Map clone into ListArray. When garbage flag true, filter_garbage_nulls then trimmed_values; otherwise trimmed_values only. Forward entries, same collector/repdef and unchanged row_number/num_rows metadata (outer-row coordinate, not entry count). Filtering may allocate and panic in Arrow helpers. (rust/lance-encoding/src/encodings/logical/map.rs:63-74)

### Lines 75-90

flush, num_columns and finish delegate unchanged; no dedicated offset page/column, independent I/O, version check or asynchronous worker here. Child error behavior propagates. (rust/lance-encoding/src/encodings/logical/map.rs:75-90)

### Lines 91-124

Public Debug StructuralMapScheduler has private boxed child and unchecked constructor. schedule_ranges passes exactly supplied ranges/filter and wraps job. initialize directly forwards optional ranges/filter/context and borrowed future. Unlike FSL it scales no coordinates. (rust/lance-encoding/src/encodings/logical/map.rs:91-124)

### Lines 125-145

Private Debug StructuralMapSchedulingJob wraps child job and delegates schedule_next with all decoder messages and rows_scheduled unchanged. Documentation says child encoder but field is scheduling job. (rust/lance-encoding/src/encodings/logical/map.rs:125-145)

### Lines 146-175

Public Debug StructuralMapDecoder stores child and dtype unchecked. accept_page delegates; drain passes same row count to child then wraps task with cloned dtype. data_type borrows stored dtype. Wrong dtype is not rejected until task decode. (rust/lance-encoding/src/encodings/logical/map.rs:146-175)

### Lines 176-190

Private Debug StructuralMapDecodeTask holds owned child task and dtype. Constructor stores both without validating map shape or keys_sorted. (rust/lance-encoding/src/encodings/logical/map.rs:176-190)

### Lines 191-220

decode consumes child first, then unravels i32 offsets before checking dtype. Map with keys_sorted=true returns NotSupported; non-Map returns Schema. Failures follow child/repdef consumption with no rollback. Entry field is cloned for Arrow reconstruction; no key sorting or wider offset alternative is implemented. (rust/lance-encoding/src/encodings/logical/map.rs:191-220)

### Lines 221-239

Child output must downcast to StructArray or Schema error. Clone Struct wrapper and call MapArray::try_new with reconstructed offsets/nulls. Arrow constructor errors are converted to InvalidInput using displayed error text. Return Arc<Map>, remaining repdef and unchanged child data_size. No extra validation for key uniqueness or map ordering local. (rust/lance-encoding/src/encodings/logical/map.rs:221-239)

### Lines 240-265

Test module imports builders, sparse plan representations and source harness. Test-only structures exercise malformed decoded entries as well as roundtrips. None of these tests were executed for the KB. (rust/lance-encoding/src/encodings/logical/map.rs:240-265)

### Lines 266-295

make_map_type uses entry Struct with keys/values field names, nonnullable key, nullable value, nonnullable entries and keys_sorted=false. StaticMapEntriesTask owns entries and CompositeRepDef; decode returns Arc entries, repdef and data_size0. (rust/lance-encoding/src/encodings/logical/map.rs:266-295)

### Lines 296-325

Malformed sparse-map test constructs one entry with key1/value2 but null Struct entry validity. Sparse list plan describes one valid nonempty map slot with one child; isolates Arrow Map entry validation from rep/def malformedness. (rust/lance-encoding/src/encodings/logical/map.rs:296-325)

### Lines 326-342

Complete malformed sparse plan has item/visible count1; task decode must return Error::InvalidInput. Does not inspect error text or test all malformed Map shapes. (rust/lance-encoding/src/encodings/logical/map.rs:326-342)

### Lines 343-371

Simple roundtrip builds two maps with key1:10,key2:20 and key3:30; requests range0..2 in U32/Sparse harness. It tests logical Arrow equivalence through harness rather than exact serialized bytes. (rust/lance-encoding/src/encodings/logical/map.rs:343-371)

### Lines 372-404

Empty-map test has [{a:1},{},null,{}], requests range0..4 and indices1 and2. Covers valid empty versus null distinction. (rust/lance-encoding/src/encodings/logical/map.rs:372-404)

### Lines 405-435

Null-value test keeps valid keys and nullable values in [{key1:10,key2:null},{key3:null}]; full range plus each row individually. Map-null and value-null are separate cases. (rust/lance-encoding/src/encodings/logical/map.rs:405-435)

### Lines 436-459

Struct roundtrip fixture builds ids1,2,3 and string maps including Alice/NYC and Bob, with nullable map child schema. Outer Struct setup continues in next range. (rust/lance-encoding/src/encodings/logical/map.rs:436-459)

### Lines 460-488

Finish Struct fixture with null third map and no outer Struct null bitmap; range0..3 and indices0,2 in U32/Sparse harness. It does not test parent Struct null behavior, addressed separately. (rust/lance-encoding/src/encodings/logical/map.rs:460-488)

### Lines 489-518

Null-Struct garbage test builds map entries a1,garbage999,b2 with offsets0,1,2,3 and no own map nulls. Garbage exists because enclosing Struct middle row is null, not because map own bitmap is null. (rust/lance-encoding/src/encodings/logical/map.rs:489-518)

### Lines 519-542

Outer Struct validity is [true,false,true], ids1,2,3 and map child as above; range0..3 roundtrip. Upstream Struct handling must supply the null context; Map maybe_encode alone detects only own map nulls. Test success has not been executed here. (rust/lance-encoding/src/encodings/logical/map.rs:519-542)

### Lines 543-584

List<Map> test builds [[{a:1},{b:2}],[{c:3}],[]]; range0..3 and indices0,2. This is variable-list parent nesting, not direct FSL<Map> schema support. (rust/lance-encoding/src/encodings/logical/map.rs:543-584)

### Lines 585-611

Nested Map test builds inner string/int maps {x:10} and {y:20,z:30}, then begins outer entry Struct. Entry field names in inner helper are plural keys/values. (rust/lance-encoding/src/encodings/logical/map.rs:585-611)

### Lines 612-644

Outer single map has key1/key2 pointing to those inner maps, offsets0,2 and singular key/value entry field names. Range0..1 exercises nested Map values without imposing fixed entry field names. (rust/lance-encoding/src/encodings/logical/map.rs:612-644)

### Lines 645-674

Different-key-type test builds Int32 keys with string values [{1:one,2:two},{3:three}], range0..2 and indices0,1. It does not establish every Arrow key type is accepted. (rust/lance-encoding/src/encodings/logical/map.rs:645-674)

### Lines 675-701

Extreme-cases name uses only100 entries key0..99 plus one empty map and range0..2. No i32 offset limit or huge allocation boundary is tested. (rust/lance-encoding/src/encodings/logical/map.rs:675-701)

### Lines 702-722

All-null test appends two null parent maps and requests0..2. Comment about all entries null actually refers to parent map rows; it does not construct invalid null Struct entries. (rust/lance-encoding/src/encodings/logical/map.rs:702-722)

### Lines 723-759

keep_original_scenarios fixture includes valid map with nullable value, null parent and another valid map; requests all rows and each index. It never toggles keep_original_array. Reviewed harness always sets true, so name/comment does not prove false branch coverage. (rust/lance-encoding/src/encodings/logical/map.rs:723-759)

### Lines 760-801

V2.1 unsupported test builds core Map field, StructuralU16 strategy, default column index/options and calls create_test_field_encoder. Asserts error message contains selected file format and Map data type; does not assert variant or reader rejection. Thirteen test functions total: eleven async roundtrips plus malformed reconstruction and version-gate tests. (rust/lance-encoding/src/encodings/logical/map.rs:760-801)

## Interaction and interpretation limits

All physical lines read in bounded untruncated primary-source outputs; no repository tests/builds executed. Local assumptions and factory validation are distinguished. Contextual snippets remain partial coverage.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::{ops::Range, sync::Arc};
    5 | 
    6 | use arrow_array::{Array, ArrayRef, ListArray, MapArray};
    7 | use arrow_schema::DataType;
    8 | use futures::future::BoxFuture;
    9 | use lance_arrow::deepcopy::deep_copy_nulls;
   10 | use lance_arrow::list::ListArrayExt;
   11 | use lance_core::{Error, Result};
   12 | 
   13 | use crate::{
   14 |     decoder::{
   15 |         DecodedArray, FilterExpression, ScheduledScanLine, SchedulerContext,
   16 |         StructuralDecodeArrayTask, StructuralFieldDecoder, StructuralFieldScheduler,
   17 |         StructuralSchedulingJob,
   18 |     },
   19 |     encoder::{EncodeTask, FieldEncoder, OutOfLineBuffers},
   20 |     repdef::RepDefBuilder,
   21 | };
   22 | 
   23 | /// A structural encoder for map fields
   24 | ///
   25 | /// Map in Arrow is represented as List<Struct<key, value>>
   26 | /// The map's offsets are added to the rep/def builder
   27 | /// and the map's entries (struct array) are passed to the child encoder
   28 | pub struct MapStructuralEncoder {
   29 |     keep_original_array: bool,
   30 |     child: Box<dyn FieldEncoder>,
   31 | }
   32 | 
   33 | impl MapStructuralEncoder {
   34 |     pub fn new(keep_original_array: bool, child: Box<dyn FieldEncoder>) -> Self {
   35 |         Self {
   36 |             keep_original_array,
   37 |             child,
   38 |         }
   39 |     }
   40 | }
   41 | 
   42 | impl FieldEncoder for MapStructuralEncoder {
   43 |     fn maybe_encode(
   44 |         &mut self,
   45 |         array: ArrayRef,
   46 |         external_buffers: &mut OutOfLineBuffers,
   47 |         mut repdef: RepDefBuilder,
   48 |         row_number: u64,
   49 |         num_rows: u64,
   50 |     ) -> Result<Vec<EncodeTask>> {
   51 |         let map_array = array
   52 |             .as_any()
   53 |             .downcast_ref::<MapArray>()
   54 |             .expect("MapEncoder used for non-map data");
   55 | 
   56 |         // Add offsets to RepDefBuilder to handle nullability and list structure
   57 |         let has_garbage_values = if self.keep_original_array {
   58 |             repdef.add_offsets(map_array.offsets().clone(), array.nulls().cloned())
   59 |         } else {
   60 |             repdef.add_offsets(map_array.offsets().clone(), deep_copy_nulls(array.nulls()))
   61 |         };
   62 | 
   63 |         // MapArray is physically a ListArray, so convert and use ListArrayExt
   64 |         let list_array: ListArray = map_array.clone().into();
   65 |         let entries = if has_garbage_values {
   66 |             list_array.filter_garbage_nulls().trimmed_values()
   67 |         } else {
   68 |             list_array.trimmed_values()
   69 |         };
   70 | 
   71 |         self.child
   72 |             .maybe_encode(entries, external_buffers, repdef, row_number, num_rows)
   73 |     }
   74 | 
   75 |     fn flush(&mut self, external_buffers: &mut OutOfLineBuffers) -> Result<Vec<EncodeTask>> {
   76 |         self.child.flush(external_buffers)
   77 |     }
   78 | 
   79 |     fn num_columns(&self) -> u32 {
   80 |         self.child.num_columns()
   81 |     }
   82 | 
   83 |     fn finish(
   84 |         &mut self,
   85 |         external_buffers: &mut OutOfLineBuffers,
   86 |     ) -> BoxFuture<'_, Result<Vec<crate::encoder::EncodedColumn>>> {
   87 |         self.child.finish(external_buffers)
   88 |     }
   89 | }
   90 | 
   91 | #[derive(Debug)]
   92 | pub struct StructuralMapScheduler {
   93 |     child: Box<dyn StructuralFieldScheduler>,
   94 | }
   95 | 
   96 | impl StructuralMapScheduler {
   97 |     pub fn new(child: Box<dyn StructuralFieldScheduler>) -> Self {
   98 |         Self { child }
   99 |     }
  100 | }
  101 | 
  102 | impl StructuralFieldScheduler for StructuralMapScheduler {
  103 |     fn schedule_ranges<'a>(
  104 |         &'a self,
  105 |         ranges: &[Range<u64>],
  106 |         filter: &FilterExpression,
  107 |     ) -> Result<Box<dyn StructuralSchedulingJob + 'a>> {
  108 |         let child = self.child.schedule_ranges(ranges, filter)?;
  109 | 
  110 |         Ok(Box::new(StructuralMapSchedulingJob::new(child)))
  111 |     }
  112 | 
  113 |     fn initialize<'a>(
  114 |         &'a mut self,
  115 |         requested_ranges: Option<&'a [Range<u64>]>,
  116 |         filter: &'a FilterExpression,
  117 |         context: &'a SchedulerContext,
  118 |     ) -> BoxFuture<'a, Result<()>> {
  119 |         // Like lists, the child (entries) column is scheduled with the same
  120 |         // top-level row ranges, so forward them unchanged.
  121 |         self.child.initialize(requested_ranges, filter, context)
  122 |     }
  123 | }
  124 | 
  125 | /// Scheduling job for map data
  126 | ///
  127 | /// Scheduling is handled by the child encoder (struct) and nothing special
  128 | /// happens here, similar to list.
  129 | #[derive(Debug)]
  130 | struct StructuralMapSchedulingJob<'a> {
  131 |     child: Box<dyn StructuralSchedulingJob + 'a>,
  132 | }
  133 | 
  134 | impl<'a> StructuralMapSchedulingJob<'a> {
  135 |     fn new(child: Box<dyn StructuralSchedulingJob + 'a>) -> Self {
  136 |         Self { child }
  137 |     }
  138 | }
  139 | 
  140 | impl StructuralSchedulingJob for StructuralMapSchedulingJob<'_> {
  141 |     fn schedule_next(&mut self, context: &mut SchedulerContext) -> Result<Vec<ScheduledScanLine>> {
  142 |         self.child.schedule_next(context)
  143 |     }
  144 | }
  145 | 
  146 | #[derive(Debug)]
  147 | pub struct StructuralMapDecoder {
  148 |     child: Box<dyn StructuralFieldDecoder>,
  149 |     data_type: DataType,
  150 | }
  151 | 
  152 | impl StructuralMapDecoder {
  153 |     pub fn new(child: Box<dyn StructuralFieldDecoder>, data_type: DataType) -> Self {
  154 |         Self { child, data_type }
  155 |     }
  156 | }
  157 | 
  158 | impl StructuralFieldDecoder for StructuralMapDecoder {
  159 |     fn accept_page(&mut self, child: crate::decoder::LoadedPageShard) -> Result<()> {
  160 |         self.child.accept_page(child)
  161 |     }
  162 | 
  163 |     fn drain(&mut self, num_rows: u64) -> Result<Box<dyn StructuralDecodeArrayTask>> {
  164 |         let child_task = self.child.drain(num_rows)?;
  165 |         Ok(Box::new(StructuralMapDecodeTask::new(
  166 |             child_task,
  167 |             self.data_type.clone(),
  168 |         )))
  169 |     }
  170 | 
  171 |     fn data_type(&self) -> &DataType {
  172 |         &self.data_type
  173 |     }
  174 | }
  175 | 
  176 | #[derive(Debug)]
  177 | struct StructuralMapDecodeTask {
  178 |     child_task: Box<dyn StructuralDecodeArrayTask>,
  179 |     data_type: DataType,
  180 | }
  181 | 
  182 | impl StructuralMapDecodeTask {
  183 |     fn new(child_task: Box<dyn StructuralDecodeArrayTask>, data_type: DataType) -> Self {
  184 |         Self {
  185 |             child_task,
  186 |             data_type,
  187 |         }
  188 |     }
  189 | }
  190 | 
  191 | impl StructuralDecodeArrayTask for StructuralMapDecodeTask {
  192 |     fn decode(self: Box<Self>) -> Result<DecodedArray> {
  193 |         let DecodedArray {
  194 |             array,
  195 |             mut repdef,
  196 |             data_size,
  197 |         } = self.child_task.decode()?;
  198 | 
  199 |         // Decode the offsets from RepDef
  200 |         let (offsets, validity) = repdef.unravel_offsets::<i32>()?;
  201 | 
  202 |         // Extract the entries field and keys_sorted from the map data type
  203 |         let (entries_field, keys_sorted) = match &self.data_type {
  204 |             DataType::Map(field, keys_sorted) => {
  205 |                 if *keys_sorted {
  206 |                     return Err(Error::not_supported_source(
  207 |                         "Map type decoder does not support keys_sorted=true now"
  208 |                             .to_string()
  209 |                             .into(),
  210 |                     ));
  211 |                 }
  212 |                 (field.clone(), *keys_sorted)
  213 |             }
  214 |             _ => {
  215 |                 return Err(Error::schema(
  216 |                     "Map decoder did not have a map field".to_string(),
  217 |                 ));
  218 |             }
  219 |         };
  220 | 
  221 |         // Convert the decoded array to StructArray
  222 |         let entries = array
  223 |             .as_any()
  224 |             .downcast_ref::<arrow_array::StructArray>()
  225 |             .ok_or_else(|| Error::schema("Map entries should be a StructArray".to_string()))?
  226 |             .clone();
  227 | 
  228 |         // Build the MapArray from offsets, entries, validity, and keys_sorted
  229 |         let map_array = MapArray::try_new(entries_field, offsets, entries, validity, keys_sorted)
  230 |             .map_err(|error| Error::invalid_input_source(error.to_string().into()))?;
  231 | 
  232 |         Ok(DecodedArray {
  233 |             array: Arc::new(map_array),
  234 |             repdef,
  235 |             data_size,
  236 |         })
  237 |     }
  238 | }
  239 | 
  240 | #[cfg(test)]
  241 | mod tests {
  242 |     use std::{collections::HashMap, sync::Arc};
  243 | 
  244 |     use arrow_array::{
  245 |         Array, Int32Array, MapArray, StringArray, StructArray,
  246 |         builder::{Int32Builder, MapBuilder, StringBuilder},
  247 |     };
  248 |     use arrow_buffer::{NullBuffer, OffsetBuffer, ScalarBuffer};
  249 |     use arrow_schema::{DataType, Field, Fields};
  250 | 
  251 |     use crate::decoder::{DecodedArray, StructuralDecodeArrayTask};
  252 |     use crate::encoder::{ColumnIndexSequence, EncodingOptions};
  253 |     use crate::encodings::logical::primitive::sparse::{
  254 |         SparseCountSet, SparsePositionSet, SparseStructuralLayerPlan, SparseStructuralPlan,
  255 |         SparseValidityMeaning, SparseValiditySet,
  256 |     };
  257 |     use crate::repdef::{CompositeRepDefUnraveler, RepDefUnraveler};
  258 |     use crate::testing::{
  259 |         TestCases, TestEncoding, check_round_trip_encoding_of_data, test_encoding_strategy,
  260 |     };
  261 |     use arrow_schema::Field as ArrowField;
  262 |     use lance_core::datatypes::Field as LanceField;
  263 | 
  264 |     use super::StructuralMapDecodeTask;
  265 | 
  266 |     fn make_map_type(key_type: DataType, value_type: DataType) -> DataType {
  267 |         // Note: Arrow MapBuilder uses "keys" and "values" as field names (plural)
  268 |         let entries = Field::new(
  269 |             "entries",
  270 |             DataType::Struct(Fields::from(vec![
  271 |                 Field::new("keys", key_type, false),
  272 |                 Field::new("values", value_type, true),
  273 |             ])),
  274 |             false,
  275 |         );
  276 |         DataType::Map(Arc::new(entries), false)
  277 |     }
  278 | 
  279 |     #[derive(Debug)]
  280 |     struct StaticMapEntriesTask {
  281 |         entries: StructArray,
  282 |         repdef: CompositeRepDefUnraveler,
  283 |     }
  284 | 
  285 |     impl StructuralDecodeArrayTask for StaticMapEntriesTask {
  286 |         fn decode(self: Box<Self>) -> lance_core::Result<DecodedArray> {
  287 |             let Self { entries, repdef } = *self;
  288 |             Ok(DecodedArray {
  289 |                 array: Arc::new(entries),
  290 |                 repdef,
  291 |                 data_size: 0,
  292 |             })
  293 |         }
  294 |     }
  295 | 
  296 |     #[test]
  297 |     fn malformed_sparse_map_entries_return_invalid_input() {
  298 |         let entry_fields = Fields::from(vec![
  299 |             Field::new("keys", DataType::Int32, false),
  300 |             Field::new("values", DataType::Int32, true),
  301 |         ]);
  302 |         let entries = StructArray::try_new(
  303 |             entry_fields.clone(),
  304 |             vec![
  305 |                 Arc::new(Int32Array::from(vec![1])),
  306 |                 Arc::new(Int32Array::from(vec![2])),
  307 |             ],
  308 |             Some(NullBuffer::from(vec![false])),
  309 |         )
  310 |         .unwrap();
  311 |         let validity = SparseValiditySet {
  312 |             meaning: SparseValidityMeaning::NullPositions,
  313 |             positions: SparsePositionSet::Empty,
  314 |         };
  315 |         let plan = SparseStructuralPlan {
  316 |             layers: vec![SparseStructuralLayerPlan::List {
  317 |                 num_slots: 1,
  318 |                 num_child_slots: 1,
  319 |                 non_empty_positions: SparsePositionSet::All { len: 1 },
  320 |                 counts: SparseCountSet::Constant { value: 1, len: 1 },
  321 |                 validity,
  322 |             }],
  323 |             num_items: 1,
  324 |             num_visible_items: 1,
  325 |         };
  326 |         let child_task = StaticMapEntriesTask {
  327 |             entries,
  328 |             repdef: CompositeRepDefUnraveler::new(vec![RepDefUnraveler::new_sparse(plan)]),
  329 |         };
  330 |         let map_type = DataType::Map(
  331 |             Arc::new(Field::new("entries", DataType::Struct(entry_fields), false)),
  332 |             false,
  333 |         );
  334 | 
  335 |         let Err(err) =
  336 |             Box::new(StructuralMapDecodeTask::new(Box::new(child_task), map_type)).decode()
  337 |         else {
  338 |             panic!("expected malformed map entries to be rejected");
  339 |         };
  340 |         assert!(matches!(err, lance_core::Error::InvalidInput { .. }));
  341 |     }
  342 | 
  343 |     #[test_log::test(tokio::test)]
  344 |     async fn test_simple_map() {
  345 |         // Create a simple Map<String, Int32>
  346 |         let string_builder = StringBuilder::new();
  347 |         let int_builder = Int32Builder::new();
  348 |         let mut map_builder = MapBuilder::new(None, string_builder, int_builder);
  349 | 
  350 |         // Map 1: {"key1": 10, "key2": 20}
  351 |         map_builder.keys().append_value("key1");
  352 |         map_builder.values().append_value(10);
  353 |         map_builder.keys().append_value("key2");
  354 |         map_builder.values().append_value(20);
  355 |         map_builder.append(true).unwrap();
  356 | 
  357 |         // Map 2: {"key3": 30}
  358 |         map_builder.keys().append_value("key3");
  359 |         map_builder.values().append_value(30);
  360 |         map_builder.append(true).unwrap();
  361 | 
  362 |         let map_array = map_builder.finish();
  363 | 
  364 |         let test_cases = TestCases::default()
  365 |             .with_range(0..2)
  366 |             .with_u32_structural_encodings();
  367 | 
  368 |         check_round_trip_encoding_of_data(vec![Arc::new(map_array)], &test_cases, HashMap::new())
  369 |             .await;
  370 |     }
  371 | 
  372 |     #[test_log::test(tokio::test)]
  373 |     async fn test_empty_maps() {
  374 |         // Test maps with empty entries
  375 |         let string_builder = StringBuilder::new();
  376 |         let int_builder = Int32Builder::new();
  377 |         let mut map_builder = MapBuilder::new(None, string_builder, int_builder);
  378 | 
  379 |         // Map 1: {"a": 1}
  380 |         map_builder.keys().append_value("a");
  381 |         map_builder.values().append_value(1);
  382 |         map_builder.append(true).unwrap();
  383 | 
  384 |         // Map 2: {} (empty)
  385 |         map_builder.append(true).unwrap();
  386 | 
  387 |         // Map 3: null
  388 |         map_builder.append(false).unwrap();
  389 | 
  390 |         // Map 4: {} (empty)
  391 |         map_builder.append(true).unwrap();
  392 | 
  393 |         let map_array = map_builder.finish();
  394 | 
  395 |         let test_cases = TestCases::default()
  396 |             .with_range(0..4)
  397 |             .with_indices(vec![1])
  398 |             .with_indices(vec![2])
  399 |             .with_u32_structural_encodings();
  400 | 
  401 |         check_round_trip_encoding_of_data(vec![Arc::new(map_array)], &test_cases, HashMap::new())
  402 |             .await;
  403 |     }
  404 | 
  405 |     #[test_log::test(tokio::test)]
  406 |     async fn test_map_with_null_values() {
  407 |         // Test Map<String, Int32> with null values
  408 |         let string_builder = StringBuilder::new();
  409 |         let int_builder = Int32Builder::new();
  410 |         let mut map_builder = MapBuilder::new(None, string_builder, int_builder);
  411 | 
  412 |         // Map 1: {"key1": 10, "key2": null}
  413 |         map_builder.keys().append_value("key1");
  414 |         map_builder.values().append_value(10);
  415 |         map_builder.keys().append_value("key2");
  416 |         map_builder.values().append_null();
  417 |         map_builder.append(true).unwrap();
  418 | 
  419 |         // Map 2: {"key3": null}
  420 |         map_builder.keys().append_value("key3");
  421 |         map_builder.values().append_null();
  422 |         map_builder.append(true).unwrap();
  423 | 
  424 |         let map_array = map_builder.finish();
  425 | 
  426 |         let test_cases = TestCases::default()
  427 |             .with_range(0..2)
  428 |             .with_indices(vec![0])
  429 |             .with_indices(vec![1])
  430 |             .with_u32_structural_encodings();
  431 | 
  432 |         check_round_trip_encoding_of_data(vec![Arc::new(map_array)], &test_cases, HashMap::new())
  433 |             .await;
  434 |     }
  435 | 
  436 |     #[test_log::test(tokio::test)]
  437 |     async fn test_map_in_struct() {
  438 |         // Test Struct containing Map
  439 |         // Struct<id: Int32, properties: Map<String, String>>
  440 | 
  441 |         let string_key_builder = StringBuilder::new();
  442 |         let string_val_builder = StringBuilder::new();
  443 |         let mut map_builder = MapBuilder::new(None, string_key_builder, string_val_builder);
  444 | 
  445 |         // First struct: id=1, properties={"name": "Alice", "city": "NYC"}
  446 |         map_builder.keys().append_value("name");
  447 |         map_builder.values().append_value("Alice");
  448 |         map_builder.keys().append_value("city");
  449 |         map_builder.values().append_value("NYC");
  450 |         map_builder.append(true).unwrap();
  451 | 
  452 |         // Second struct: id=2, properties={"name": "Bob"}
  453 |         map_builder.keys().append_value("name");
  454 |         map_builder.values().append_value("Bob");
  455 |         map_builder.append(true).unwrap();
  456 | 
  457 |         // Third struct: id=3, properties=null
  458 |         map_builder.append(false).unwrap();
  459 | 
  460 |         let map_array = Arc::new(map_builder.finish());
  461 |         let id_array = Arc::new(Int32Array::from(vec![1, 2, 3]));
  462 | 
  463 |         let struct_array = StructArray::new(
  464 |             Fields::from(vec![
  465 |                 Field::new("id", DataType::Int32, false),
  466 |                 Field::new(
  467 |                     "properties",
  468 |                     make_map_type(DataType::Utf8, DataType::Utf8),
  469 |                     true,
  470 |                 ),
  471 |             ]),
  472 |             vec![id_array, map_array],
  473 |             None,
  474 |         );
  475 | 
  476 |         let test_cases = TestCases::default()
  477 |             .with_range(0..3)
  478 |             .with_indices(vec![0, 2])
  479 |             .with_u32_structural_encodings();
  480 | 
  481 |         check_round_trip_encoding_of_data(
  482 |             vec![Arc::new(struct_array)],
  483 |             &test_cases,
  484 |             HashMap::new(),
  485 |         )
  486 |         .await;
  487 |     }
  488 | 
  489 |     #[test_log::test(tokio::test)]
  490 |     async fn test_map_in_nullable_struct() {
  491 |         // Test Struct<Map> where null struct rows have garbage map entries.
  492 |         // The encoder must filter these garbage entries before encoding.
  493 |         let entries_fields = Fields::from(vec![
  494 |             Field::new("keys", DataType::Utf8, false),
  495 |             Field::new("values", DataType::Int32, true),
  496 |         ]);
  497 |         let entries_field = Arc::new(Field::new(
  498 |             "entries",
  499 |             DataType::Struct(entries_fields.clone()),
  500 |             false,
  501 |         ));
  502 |         let map_entries = StructArray::new(
  503 |             entries_fields,
  504 |             vec![
  505 |                 Arc::new(StringArray::from(vec!["a", "garbage", "b"])),
  506 |                 Arc::new(Int32Array::from(vec![1, 999, 2])),
  507 |             ],
  508 |             None,
  509 |         );
  510 |         // map0: {"a": 1}, map1 (garbage): {"garbage": 999}, map2: {"b": 2}
  511 |         let map_array: Arc<dyn Array> = Arc::new(MapArray::new(
  512 |             entries_field,
  513 |             OffsetBuffer::new(ScalarBuffer::from(vec![0, 1, 2, 3])),
  514 |             map_entries,
  515 |             None, // No nulls at map level - nulls come from struct
  516 |             false,
  517 |         ));
  518 | 
  519 |         let struct_array = StructArray::new(
  520 |             Fields::from(vec![
  521 |                 Field::new("id", DataType::Int32, true),
  522 |                 Field::new("props", map_array.data_type().clone(), true),
  523 |             ]),
  524 |             vec![
  525 |                 Arc::new(Int32Array::from(vec![Some(1), Some(2), Some(3)])),
  526 |                 map_array,
  527 |             ],
  528 |             Some(NullBuffer::from(vec![true, false, true])), // Middle row is null
  529 |         );
  530 | 
  531 |         let test_cases = TestCases::default()
  532 |             .with_range(0..3)
  533 |             .with_u32_structural_encodings();
  534 | 
  535 |         check_round_trip_encoding_of_data(
  536 |             vec![Arc::new(struct_array)],
  537 |             &test_cases,
  538 |             HashMap::new(),
  539 |         )
  540 |         .await;
  541 |     }
  542 | 
  543 |     #[test_log::test(tokio::test)]
  544 |     async fn test_list_of_maps() {
  545 |         // Test List<Map<String, Int32>>
  546 |         use arrow_array::builder::ListBuilder;
  547 | 
  548 |         let string_builder = StringBuilder::new();
  549 |         let int_builder = Int32Builder::new();
  550 |         let map_builder = MapBuilder::new(None, string_builder, int_builder);
  551 |         let mut list_builder = ListBuilder::new(map_builder);
  552 | 
  553 |         // List 1: [{"a": 1}, {"b": 2}]
  554 |         list_builder.values().keys().append_value("a");
  555 |         list_builder.values().values().append_value(1);
  556 |         list_builder.values().append(true).unwrap();
  557 | 
  558 |         list_builder.values().keys().append_value("b");
  559 |         list_builder.values().values().append_value(2);
  560 |         list_builder.values().append(true).unwrap();
  561 | 
  562 |         list_builder.append(true);
  563 | 
  564 |         // List 2: [{"c": 3}]
  565 |         list_builder.values().keys().append_value("c");
  566 |         list_builder.values().values().append_value(3);
  567 |         list_builder.values().append(true).unwrap();
  568 | 
  569 |         list_builder.append(true);
  570 | 
  571 |         // List 3: [] (empty list)
  572 |         list_builder.append(true);
  573 | 
  574 |         let list_array = list_builder.finish();
  575 | 
  576 |         let test_cases = TestCases::default()
  577 |             .with_range(0..3)
  578 |             .with_indices(vec![0, 2])
  579 |             .with_u32_structural_encodings();
  580 | 
  581 |         check_round_trip_encoding_of_data(vec![Arc::new(list_array)], &test_cases, HashMap::new())
  582 |             .await;
  583 |     }
  584 | 
  585 |     #[test_log::test(tokio::test)]
  586 |     async fn test_nested_map() {
  587 |         // Test Map<String, Map<String, Int32>>
  588 |         // This is more complex as we need to build nested maps manually
  589 | 
  590 |         // Build inner maps first
  591 |         let inner_string_builder = StringBuilder::new();
  592 |         let inner_int_builder = Int32Builder::new();
  593 |         let mut inner_map_builder1 = MapBuilder::new(None, inner_string_builder, inner_int_builder);
  594 | 
  595 |         // Inner map 1: {"x": 10}
  596 |         inner_map_builder1.keys().append_value("x");
  597 |         inner_map_builder1.values().append_value(10);
  598 |         inner_map_builder1.append(true).unwrap();
  599 | 
  600 |         // Inner map 2: {"y": 20, "z": 30}
  601 |         inner_map_builder1.keys().append_value("y");
  602 |         inner_map_builder1.values().append_value(20);
  603 |         inner_map_builder1.keys().append_value("z");
  604 |         inner_map_builder1.values().append_value(30);
  605 |         inner_map_builder1.append(true).unwrap();
  606 | 
  607 |         let inner_maps = Arc::new(inner_map_builder1.finish());
  608 | 
  609 |         // Build outer map keys
  610 |         let outer_keys = Arc::new(StringArray::from(vec!["key1", "key2"]));
  611 | 
  612 |         // Build outer map structure
  613 |         let entries_struct = StructArray::new(
  614 |             Fields::from(vec![
  615 |                 Field::new("key", DataType::Utf8, false),
  616 |                 Field::new(
  617 |                     "value",
  618 |                     make_map_type(DataType::Utf8, DataType::Int32),
  619 |                     true,
  620 |                 ),
  621 |             ]),
  622 |             vec![outer_keys, inner_maps],
  623 |             None,
  624 |         );
  625 | 
  626 |         let offsets = OffsetBuffer::new(ScalarBuffer::<i32>::from(vec![0, 2]));
  627 |         let entries_field = Field::new("entries", entries_struct.data_type().clone(), false);
  628 | 
  629 |         let outer_map = MapArray::new(
  630 |             Arc::new(entries_field),
  631 |             offsets,
  632 |             entries_struct,
  633 |             None,
  634 |             false,
  635 |         );
  636 | 
  637 |         let test_cases = TestCases::default()
  638 |             .with_range(0..1)
  639 |             .with_u32_structural_encodings();
  640 | 
  641 |         check_round_trip_encoding_of_data(vec![Arc::new(outer_map)], &test_cases, HashMap::new())
  642 |             .await;
  643 |     }
  644 | 
  645 |     #[test_log::test(tokio::test)]
  646 |     async fn test_map_different_key_types() {
  647 |         // Test Map<Int32, String> (integer keys)
  648 |         let int_builder = Int32Builder::new();
  649 |         let string_builder = StringBuilder::new();
  650 |         let mut map_builder = MapBuilder::new(None, int_builder, string_builder);
  651 | 
  652 |         // Map 1: {1: "one", 2: "two"}
  653 |         map_builder.keys().append_value(1);
  654 |         map_builder.values().append_value("one");
  655 |         map_builder.keys().append_value(2);
  656 |         map_builder.values().append_value("two");
  657 |         map_builder.append(true).unwrap();
  658 | 
  659 |         // Map 2: {3: "three"}
  660 |         map_builder.keys().append_value(3);
  661 |         map_builder.values().append_value("three");
  662 |         map_builder.append(true).unwrap();
  663 | 
  664 |         let map_array = map_builder.finish();
  665 | 
  666 |         let test_cases = TestCases::default()
  667 |             .with_range(0..2)
  668 |             .with_indices(vec![0, 1])
  669 |             .with_u32_structural_encodings();
  670 | 
  671 |         check_round_trip_encoding_of_data(vec![Arc::new(map_array)], &test_cases, HashMap::new())
  672 |             .await;
  673 |     }
  674 | 
  675 |     #[test_log::test(tokio::test)]
  676 |     async fn test_map_with_extreme_sizes() {
  677 |         // Test maps with large number of entries
  678 |         let string_builder = StringBuilder::new();
  679 |         let int_builder = Int32Builder::new();
  680 |         let mut map_builder = MapBuilder::new(None, string_builder, int_builder);
  681 | 
  682 |         // Create a map with many entries
  683 |         for i in 0..100 {
  684 |             map_builder.keys().append_value(format!("key{}", i));
  685 |             map_builder.values().append_value(i);
  686 |         }
  687 |         map_builder.append(true).unwrap();
  688 | 
  689 |         // Create a second map with no entries
  690 |         map_builder.append(true).unwrap();
  691 | 
  692 |         let map_array = map_builder.finish();
  693 | 
  694 |         let test_cases = TestCases::default()
  695 |             .with_range(0..2)
  696 |             .with_u32_structural_encodings();
  697 | 
  698 |         check_round_trip_encoding_of_data(vec![Arc::new(map_array)], &test_cases, HashMap::new())
  699 |             .await;
  700 |     }
  701 | 
  702 |     #[test_log::test(tokio::test)]
  703 |     async fn test_map_all_null() {
  704 |         // Test map where all entries are null
  705 |         let string_builder = StringBuilder::new();
  706 |         let int_builder = Int32Builder::new();
  707 |         let mut map_builder = MapBuilder::new(None, string_builder, int_builder);
  708 | 
  709 |         // All null maps
  710 |         map_builder.append(false).unwrap(); // null
  711 |         map_builder.append(false).unwrap(); // null
  712 | 
  713 |         let map_array = map_builder.finish();
  714 | 
  715 |         let test_cases = TestCases::default()
  716 |             .with_range(0..2)
  717 |             .with_u32_structural_encodings();
  718 | 
  719 |         check_round_trip_encoding_of_data(vec![Arc::new(map_array)], &test_cases, HashMap::new())
  720 |             .await;
  721 |     }
  722 | 
  723 |     #[test_log::test(tokio::test)]
  724 |     async fn test_map_encoder_keep_original_array_scenarios() {
  725 |         // Test scenarios that highlight the difference between keep_original_array=true/false
  726 |         // This test focuses on round-trip behavior which should be equivalent in both cases
  727 |         let string_builder = StringBuilder::new();
  728 |         let int_builder = Int32Builder::new();
  729 |         let mut map_builder = MapBuilder::new(None, string_builder, int_builder);
  730 | 
  731 |         // Create a map with mixed null and non-null values to test both scenarios
  732 |         // Map 1: {"key1": 10, "key2": null}
  733 |         map_builder.keys().append_value("key1");
  734 |         map_builder.values().append_value(10);
  735 |         map_builder.keys().append_value("key2");
  736 |         map_builder.values().append_null();
  737 |         map_builder.append(true).unwrap();
  738 | 
  739 |         // Map 2: null
  740 |         map_builder.append(false).unwrap();
  741 | 
  742 |         // Map 3: {"key3": 30}
  743 |         map_builder.keys().append_value("key3");
  744 |         map_builder.values().append_value(30);
  745 |         map_builder.append(true).unwrap();
  746 | 
  747 |         let map_array = map_builder.finish();
  748 | 
  749 |         let test_cases = TestCases::default()
  750 |             .with_range(0..3)
  751 |             .with_indices(vec![0, 1, 2])
  752 |             .with_u32_structural_encodings();
  753 | 
  754 |         // This test ensures that regardless of the internal keep_original_array setting,
  755 |         // the end-to-end behavior produces equivalent results
  756 |         check_round_trip_encoding_of_data(vec![Arc::new(map_array)], &test_cases, HashMap::new())
  757 |             .await;
  758 |     }
  759 | 
  760 |     #[test]
  761 |     fn test_map_not_supported_write_in_v2_1() {
  762 |         // Create a map field using Arrow Field first, then convert to Lance Field
  763 |         let map_arrow_field = ArrowField::new(
  764 |             "map_field",
  765 |             make_map_type(DataType::Utf8, DataType::Int32),
  766 |             true,
  767 |         );
  768 |         let map_field = LanceField::try_from(&map_arrow_field).unwrap();
  769 | 
  770 |         // Test encoder: Try to create encoder with V2_1 version - should fail
  771 |         let encoder_strategy = test_encoding_strategy(TestEncoding::StructuralU16);
  772 |         let mut column_index = ColumnIndexSequence::default();
  773 |         let options = EncodingOptions::default();
  774 | 
  775 |         let encoder_result = crate::testing::create_test_field_encoder(
  776 |             encoder_strategy.as_ref(),
  777 |             &map_field,
  778 |             &mut column_index,
  779 |             &options,
  780 |         );
  781 | 
  782 |         assert!(
  783 |             encoder_result.is_err(),
  784 |             "Map type should not be supported in V2_1 for encoder"
  785 |         );
  786 |         let Err(encoder_err) = encoder_result else {
  787 |             panic!("Expected error but got Ok")
  788 |         };
  789 | 
  790 |         let encoder_err_msg = format!("{}", encoder_err);
  791 |         assert!(
  792 |             encoder_err_msg.contains("not enabled by the selected file format"),
  793 |             "unexpected encoder error: {encoder_err_msg}"
  794 |         );
  795 |         assert!(
  796 |             encoder_err_msg.contains("Map data type"),
  797 |             "Encoder error message should mention Map data type, got: {}",
  798 |             encoder_err_msg
  799 |         );
  800 |     }
  801 | }
``````
