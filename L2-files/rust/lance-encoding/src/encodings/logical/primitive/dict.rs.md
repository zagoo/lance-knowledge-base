> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../../V21-PROTOCOL.md).

# rust/lance-encoding/src/encodings/logical/primitive/dict.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `6d7685d96a2f2eb9db247e5f7cf5268d79c3842cba6978ea514202b30c425318`. Reviewed physical lines: 1-632.

[Module](../../../../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../../README.md)

## Role and visibility

Dictionary-null normalization, invalid physical null-key repair and opportunistic structural dictionary encoding for fixed/variable-width value blocks. (rust/lance-encoding/src/encodings/logical/primitive/dict.rs:1-632)

## Complete range analysis

### Lines 1-29

Imports support eight Arrow dictionary key families, borrowed-byte keys, typed buffers, block statistics and take. Public constants specify128-bit dictionary fixed-width branch and32-bit signed indices. The constant128 is not a restriction on all encoding:64-bit values are also supported. (rust/lance-encoding/src/encodings/logical/primitive/dict.rs:1-29)

### Lines 30-53

normalize_dict_nulls_impl downcasts to DictionaryArray<K> or Internal. If dictionary values contain no nulls it returns original ArrayRef without examining keys. Otherwise build old-to-new optional key mapping, removing null dictionary entries while retaining order and every valid entry, including unused entries. (rust/lance-encoding/src/encodings/logical/primitive/dict.rs:30-53)

### Lines 54-84

For each valid dictionary value, old_idx-skipped converts to K::Native or Internal. High unused entries can fail narrow-key conversion. Logical null keys stay null; nonnull keys convert to usize or Internal then directly index mapping, potentially panicking on invalid positive index. Entries pointing to removed values become null keys. Arrow take uses generated valid u64 indices with bounds checks disabled; DictionaryArray::new constructs normalized output. No deduplication of equal values. All-null values produce empty dictionary with null keys. (rust/lance-encoding/src/encodings/logical/primitive/dict.rs:54-84)

### Lines 85-112

Public normalize_dict_nulls dispatches Int8/16/32/64 and UInt8/16/32/64. Unsupported dictionary key type returns NotSupported including type; nondictionary returns Internal including data type. (rust/lance-encoding/src/encodings/logical/primitive/dict.rs:85-112)

### Lines 113-144

clear_out_of_range_null_keys_impl returns original when no key null buffer or empty dictionary (there is no valid replacement index). It checks physical null slots for negative/unrepresentable or >=dictionary-length keys. If any are bad, rebuild logical keys: all null slots become physical zero while validity is preserved and values Arc is shared; otherwise return original. try_new may reject other invalid keys. This protects later null-bitmap removal for nonempty dictionaries. (rust/lance-encoding/src/encodings/logical/primitive/dict.rs:113-144)

### Lines 145-171

Parent-module-visible clear_out_of_range_null_keys dispatches the same eight key families and uses contextual NotSupported/Internal errors for unsupported/nondictionary input. It is not a public crate entry point. (rust/lance-encoding/src/encodings/logical/primitive/dict.rs:145-171)

### Lines 172-207

Generic variable-width dictionary helper borrows block bytes, typed offsets and U8SliceKey map entries. Stat MaxLength must exist and be a UInt64 array; expect panics otherwise. Initial payload capacity is saturating32*max_length, at least1024, then bounded by source data and target budget. Indices reserve declared num_values. No complete offset-count/first-zero/final-end validation. (rust/lance-encoding/src/encodings/logical/primitive/dict.rs:172-207)

### Lines 208-235

Iterate every physical adjacent offset pair; conversion to usize, descending offsets or end beyond data return None. Nonzero first offset or unused trailing data are accepted. Exact byte strings map to first-seen signed i32 IDs. New entry requires positive max_entries, current unique count below it and below i32::MAX. Payload is extended before output-offset conversion and size checks, so rejected attempts still allocate transiently. (rust/lance-encoding/src/encodings/logical/primitive/dict.rs:208-235)

### Lines 236-252

After each index, estimated encoded size is saturating payload bytes +4*index count +offset-width*(unique count+1). Return None only when greater than max_encoded_size, allowing equality. This is an output-size filter, not peak-memory bound: map, preallocation, stats and allocations before checks are excluded. No loop iterations bypasses this in-loop size check. (rust/lance-encoding/src/encodings/logical/primitive/dict.rs:236-252)

### Lines 253-272

Successful variable-width result has dictionary offsets/data and unique count with matching32/64 offset width, plus FixedWidth indices with32 bits and declared input num_values. Statistics are recomputed for both. Physical window count is not compared with declared num_values, so malformed blocks can yield inconsistent counts. (rust/lance-encoding/src/encodings/logical/primitive/dict.rs:253-272)

### Lines 273-310

Public dictionary_encode returns Option, not Result. FixedWidth64 interprets physical bytes as u64, allocates map, up to1024 initial dictionary values and declared-count indices, then processes every physical value. Raw-bit equality preserves float NaN payload and signed-zero distinctions rather than numeric equality. Entry caps match variable helper. (rust/lance-encoding/src/encodings/logical/primitive/dict.rs:273-310)

### Lines 311-348

64-bit branch assigns first-seen IDs, checks saturating unique*8 +indices*4 against target after append and permits equality. Builds dictionary width64/countunique and indices width32/countdeclared, computing stats. Physical buffer count versus declared count is assumed, not checked. (rust/lance-encoding/src/encodings/logical/primitive/dict.rs:311-348)

### Lines 349-405

128-bit branch mirrors64-bit using u128 and16 bytes per unique, constant DICT_FIXED_WIDTH_BITS_PER_VALUE=128 and32-bit signed indices. TODO for256 bits is unsupported behavior, not implemented capability. Random HashMap iteration does not determine output order; first insertion does. (rust/lance-encoding/src/encodings/logical/primitive/dict.rs:349-405)

### Lines 406-428

Other fixed widths return None. VariableWidth supports bits_per_offset32 via u32 and64 via u64; other widths return None. Other DataBlock variants, including nullable/all-null/dictionary blocks, return None. No built-in ratio threshold/version gate/I/O: caller chooses whether to attempt and supplies caps. (rust/lance-encoding/src/encodings/logical/primitive/dict.rs:406-428)

### Lines 429-469

High-cardinality u128 test creates120 unique values with ample entry cap1000 and original-byte budget, expecting None. It checks rejection only, not exact allocation or threshold equality. (rust/lance-encoding/src/encodings/logical/primitive/dict.rs:429-469)

### Lines 470-518

Low-cardinality u128 test creates120 values with three distinct values, expects Some and asserts block kind, widths and counts. It does not assert exact dictionary order, indices or decoded roundtrip. (rust/lance-encoding/src/encodings/logical/primitive/dict.rs:470-518)

### Lines 519-540

High-cardinality string test uses120 unique strings and max_entries10, expecting None. Despite naming/comment about benefit, entry cap can be the rejection reason; do not attribute it solely to byte savings. (rust/lance-encoding/src/encodings/logical/primitive/dict.rs:519-540)

### Lines 541-580

Low-cardinality string test uses120 entries/three distinct strings and entry cap100; asserts Some and kind/counts only, not exact offsets/bytes/indices or roundtrip. (rust/lance-encoding/src/encodings/logical/primitive/dict.rs:541-580)

### Lines 581-614

Invalid variable-width16-bit offset block returns None. String budget test uses10000 rows/50 unique values, asserting None at one-tenth original size and Some at full original size. These assertions are source evidence, not executed results. (rust/lance-encoding/src/encodings/logical/primitive/dict.rs:581-614)

### Lines 615-632

String max-entry test uses10000 rows/200 unique values, rejecting cap10 and accepting500. Seven local test functions total; no local normalization, null-key repair,64-bit encoding, all-null/empty, exact-budget equality or malformed-count coverage. No unsafe, async or environment configuration in this file. (rust/lance-encoding/src/encodings/logical/primitive/dict.rs:615-632)

## Interaction and interpretation limits

Every physical line read in bounded untruncated outputs. Source-only analysis; no repository build/test/runtime. Parent primitive and Arrow scalar modules read only in specified contextual ranges. Caller invariants and possible panics are source deductions, not reproduced failures.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::{collections::HashMap, sync::Arc};
    5 | 
    6 | /// Bits per value for FixedWidth dictionary values (legacy default for 128-bit values)
    7 | pub const DICT_FIXED_WIDTH_BITS_PER_VALUE: u64 = 128;
    8 | /// Bits per index for dictionary indices (always i32)
    9 | pub const DICT_INDICES_BITS_PER_VALUE: u64 = 32;
   10 | 
   11 | use arrow_array::{
   12 |     Array, DictionaryArray, PrimitiveArray, UInt64Array,
   13 |     cast::AsArray,
   14 |     types::{
   15 |         ArrowDictionaryKeyType, Int8Type, Int16Type, Int32Type, Int64Type, UInt8Type, UInt16Type,
   16 |         UInt32Type, UInt64Type,
   17 |     },
   18 | };
   19 | use arrow_buffer::ArrowNativeType;
   20 | use arrow_schema::DataType;
   21 | use arrow_select::take::TakeOptions;
   22 | use lance_core::{Error, Result, error::LanceOptionExt, utils::hash::U8SliceKey};
   23 | 
   24 | use crate::{
   25 |     buffer::LanceBuffer,
   26 |     data::{BlockInfo, DataBlock, FixedWidthDataBlock, VariableWidthBlock},
   27 |     statistics::{ComputeStat, GetStat, Stat},
   28 | };
   29 | 
   30 | // Helper function for normalize_dict_nulls
   31 | fn normalize_dict_nulls_impl<K: ArrowDictionaryKeyType>(
   32 |     array: Arc<dyn Array>,
   33 | ) -> Result<Arc<dyn Array>> {
   34 |     // TODO: Fast path when there is only one null index? (common case)
   35 | 
   36 |     let dict_array = array.as_dictionary_opt::<K>().expect_ok()?;
   37 | 
   38 |     if dict_array.values().null_count() == 0 {
   39 |         return Ok(array);
   40 |     }
   41 | 
   42 |     let mut mapping = vec![None; dict_array.values().len()];
   43 |     let mut skipped = 0;
   44 |     let mut valid_indices = Vec::with_capacity(dict_array.values().len());
   45 |     for (old_idx, is_valid) in dict_array.values().nulls().expect_ok()?.iter().enumerate() {
   46 |         if is_valid {
   47 |             // Should be safe since we are only decreasing K values (e.g. won't overflow u8 keys into u16)
   48 |             mapping[old_idx] = Some(K::Native::from_usize(old_idx - skipped).expect_ok()?);
   49 |             valid_indices.push(old_idx as u64);
   50 |         } else {
   51 |             skipped += 1;
   52 |             mapping[old_idx] = None;
   53 |         }
   54 |     }
   55 | 
   56 |     let mut keys_builder = PrimitiveArray::<K>::builder(dict_array.keys().len());
   57 |     for key in dict_array.keys().iter() {
   58 |         if let Some(key) = key {
   59 |             if let Some(mapped) = mapping[key.to_usize().expect_ok()?] {
   60 |                 // Valid item
   61 |                 keys_builder.append_value(mapped);
   62 |             } else {
   63 |                 // Null via values
   64 |                 keys_builder.append_null();
   65 |             }
   66 |         } else {
   67 |             // Null via keys
   68 |             keys_builder.append_null();
   69 |         }
   70 |     }
   71 |     let keys = keys_builder.finish();
   72 | 
   73 |     let valid_indices = UInt64Array::from(valid_indices);
   74 |     let values = arrow_select::take::take(
   75 |         dict_array.values(),
   76 |         &valid_indices,
   77 |         Some(TakeOptions {
   78 |             check_bounds: false,
   79 |         }),
   80 |     )?;
   81 | 
   82 |     Ok(Arc::new(DictionaryArray::new(keys, values)) as Arc<dyn Array>)
   83 | }
   84 | 
   85 | /// In Arrow a dictionary array can have nulls in two different places:
   86 | /// 1. The keys can be null
   87 | /// 2. The values can be null
   88 | ///
   89 | /// We want to normalize this so that all nulls are in the keys.  This way we can store
   90 | /// the nulls with the keys as rep-def values the same as any other array.
   91 | pub fn normalize_dict_nulls(array: Arc<dyn Array>) -> Result<Arc<dyn Array>> {
   92 |     match array.data_type() {
   93 |         DataType::Dictionary(key_type, _) => match key_type.as_ref() {
   94 |             DataType::UInt8 => normalize_dict_nulls_impl::<UInt8Type>(array),
   95 |             DataType::UInt16 => normalize_dict_nulls_impl::<UInt16Type>(array),
   96 |             DataType::UInt32 => normalize_dict_nulls_impl::<UInt32Type>(array),
   97 |             DataType::UInt64 => normalize_dict_nulls_impl::<UInt64Type>(array),
   98 |             DataType::Int8 => normalize_dict_nulls_impl::<Int8Type>(array),
   99 |             DataType::Int16 => normalize_dict_nulls_impl::<Int16Type>(array),
  100 |             DataType::Int32 => normalize_dict_nulls_impl::<Int32Type>(array),
  101 |             DataType::Int64 => normalize_dict_nulls_impl::<Int64Type>(array),
  102 |             _ => Err(Error::not_supported_source(
  103 |                 format!("Unsupported dictionary key type: {}", key_type).into(),
  104 |             )),
  105 |         },
  106 |         _ => Err(Error::internal(format!(
  107 |             "Data type is not a dictionary: {}",
  108 |             array.data_type()
  109 |         ))),
  110 |     }
  111 | }
  112 | 
  113 | fn clear_out_of_range_null_keys_impl<K: ArrowDictionaryKeyType>(
  114 |     array: Arc<dyn Array>,
  115 | ) -> Result<Arc<dyn Array>> {
  116 |     let dict_array = array.as_dictionary_opt::<K>().expect_ok()?;
  117 |     let num_values = dict_array.values().len();
  118 |     let Some(nulls) = dict_array.keys().nulls() else {
  119 |         return Ok(array);
  120 |     };
  121 | 
  122 |     // There is no valid replacement key for an empty dictionary, so that case
  123 |     // requires separate handling and must remain unchanged here.
  124 |     if num_values == 0 {
  125 |         return Ok(array);
  126 |     }
  127 | 
  128 |     let has_out_of_range_null_key = dict_array
  129 |         .keys()
  130 |         .values()
  131 |         .iter()
  132 |         .zip(nulls.iter())
  133 |         .any(|(key, is_valid)| !is_valid && key.to_usize().is_none_or(|key| key >= num_values));
  134 |     if !has_out_of_range_null_key {
  135 |         return Ok(array);
  136 |     }
  137 | 
  138 |     // Building from the logical iterator writes the default physical key into
  139 |     // every null slot while preserving the original validity bitmap.
  140 |     let keys = PrimitiveArray::<K>::from_iter(dict_array.keys().iter());
  141 |     let values = dict_array.values().clone();
  142 |     Ok(Arc::new(DictionaryArray::<K>::try_new(keys, values)?) as Arc<dyn Array>)
  143 | }
  144 | 
  145 | /// Replaces out-of-range physical keys in null dictionary slots with a valid key.
  146 | ///
  147 | /// Arrow permits arbitrary keys in null slots, but the structural encoder removes
  148 | /// key validity after recording it as rep-def. The replacement keeps the array
  149 | /// valid when that null buffer is removed without changing its logical values.
  150 | pub(super) fn clear_out_of_range_null_keys(array: Arc<dyn Array>) -> Result<Arc<dyn Array>> {
  151 |     match array.data_type() {
  152 |         DataType::Dictionary(key_type, _) => match key_type.as_ref() {
  153 |             DataType::UInt8 => clear_out_of_range_null_keys_impl::<UInt8Type>(array),
  154 |             DataType::UInt16 => clear_out_of_range_null_keys_impl::<UInt16Type>(array),
  155 |             DataType::UInt32 => clear_out_of_range_null_keys_impl::<UInt32Type>(array),
  156 |             DataType::UInt64 => clear_out_of_range_null_keys_impl::<UInt64Type>(array),
  157 |             DataType::Int8 => clear_out_of_range_null_keys_impl::<Int8Type>(array),
  158 |             DataType::Int16 => clear_out_of_range_null_keys_impl::<Int16Type>(array),
  159 |             DataType::Int32 => clear_out_of_range_null_keys_impl::<Int32Type>(array),
  160 |             DataType::Int64 => clear_out_of_range_null_keys_impl::<Int64Type>(array),
  161 |             _ => Err(Error::not_supported_source(
  162 |                 format!("Unsupported dictionary key type: {}", key_type).into(),
  163 |             )),
  164 |         },
  165 |         _ => Err(Error::internal(format!(
  166 |             "Data type is not a dictionary: {}",
  167 |             array.data_type()
  168 |         ))),
  169 |     }
  170 | }
  171 | 
  172 | fn dict_encode_variable_width<T>(
  173 |     variable_width_data_block: &VariableWidthBlock,
  174 |     bits_per_offset: u8,
  175 |     max_dict_entries: u32,
  176 |     max_encoded_size: usize,
  177 | ) -> Option<(DataBlock, DataBlock)>
  178 | where
  179 |     T: ArrowNativeType,
  180 |     usize: TryFrom<T>,
  181 | {
  182 |     use std::collections::hash_map::Entry;
  183 |     let mut map = HashMap::new();
  184 |     let offsets = variable_width_data_block
  185 |         .offsets
  186 |         .borrow_to_typed_slice::<T>();
  187 |     let offsets = offsets.as_ref();
  188 | 
  189 |     let max_len = variable_width_data_block
  190 |         .get_stat(Stat::MaxLength)
  191 |         .expect("VariableWidth DataBlock should have valid `Stat::MaxLength` statistics");
  192 |     let max_len = max_len.as_primitive::<UInt64Type>().value(0);
  193 | 
  194 |     let max_dict_data_len = variable_width_data_block.data.len();
  195 |     let max_len: usize = max_len.try_into().unwrap_or(usize::MAX);
  196 |     let dict_data_capacity = max_len
  197 |         .saturating_mul(32)
  198 |         .max(1024)
  199 |         .min(max_dict_data_len)
  200 |         .min(max_encoded_size);
  201 | 
  202 |     let mut dictionary_buffer: Vec<u8> = Vec::with_capacity(dict_data_capacity);
  203 |     let mut dictionary_offsets_buffer = vec![T::default()];
  204 |     let mut curr_idx = 0;
  205 |     let mut indices_buffer = Vec::with_capacity(variable_width_data_block.num_values as usize);
  206 |     let bytes_per_offset = (bits_per_offset / 8) as usize;
  207 | 
  208 |     for window in offsets.windows(2) {
  209 |         let start = usize::try_from(window[0]).ok()?;
  210 |         let end = usize::try_from(window[1]).ok()?;
  211 |         if start > end || end > variable_width_data_block.data.len() {
  212 |             return None;
  213 |         }
  214 | 
  215 |         let key = &variable_width_data_block.data[start..end];
  216 | 
  217 |         let idx = match map.entry(U8SliceKey(key)) {
  218 |             Entry::Occupied(entry) => *entry.get(),
  219 |             Entry::Vacant(entry) => {
  220 |                 if max_dict_entries == 0 || curr_idx as u32 >= max_dict_entries {
  221 |                     return None;
  222 |                 }
  223 |                 if curr_idx == i32::MAX {
  224 |                     return None;
  225 |                 }
  226 |                 dictionary_buffer.extend_from_slice(key);
  227 |                 let dict_offset = T::from_usize(dictionary_buffer.len())?;
  228 |                 dictionary_offsets_buffer.push(dict_offset);
  229 |                 let idx = curr_idx;
  230 |                 entry.insert(idx);
  231 |                 curr_idx += 1;
  232 |                 idx
  233 |             }
  234 |         };
  235 | 
  236 |         indices_buffer.push(idx);
  237 | 
  238 |         let indices_bytes = indices_buffer
  239 |             .len()
  240 |             .saturating_mul(DICT_INDICES_BITS_PER_VALUE as usize / 8);
  241 |         let offsets_bytes = dictionary_offsets_buffer
  242 |             .len()
  243 |             .saturating_mul(bytes_per_offset);
  244 |         let encoded_size = dictionary_buffer
  245 |             .len()
  246 |             .saturating_add(indices_bytes)
  247 |             .saturating_add(offsets_bytes);
  248 |         if encoded_size > max_encoded_size {
  249 |             return None;
  250 |         }
  251 |     }
  252 | 
  253 |     let mut dictionary_data_block = DataBlock::VariableWidth(VariableWidthBlock {
  254 |         data: LanceBuffer::reinterpret_vec(dictionary_buffer),
  255 |         offsets: LanceBuffer::reinterpret_vec(dictionary_offsets_buffer),
  256 |         bits_per_offset,
  257 |         num_values: curr_idx as u64,
  258 |         block_info: BlockInfo::default(),
  259 |     });
  260 |     dictionary_data_block.compute_stat();
  261 | 
  262 |     let mut indices_data_block = DataBlock::FixedWidth(FixedWidthDataBlock {
  263 |         data: LanceBuffer::reinterpret_vec(indices_buffer),
  264 |         bits_per_value: DICT_INDICES_BITS_PER_VALUE,
  265 |         num_values: variable_width_data_block.num_values,
  266 |         block_info: BlockInfo::default(),
  267 |     });
  268 |     indices_data_block.compute_stat();
  269 | 
  270 |     Some((indices_data_block, dictionary_data_block))
  271 | }
  272 | 
  273 | /// Dictionary encodes a data block
  274 | ///
  275 | /// Currently only supported for some common cases (string / binary / 64-bit / 128-bit)
  276 | ///
  277 | /// Returns a block of indices (will always be a fixed width data block) and a block of dictionary
  278 | pub fn dictionary_encode(
  279 |     data_block: &DataBlock,
  280 |     max_dict_entries: u32,
  281 |     max_encoded_size: usize,
  282 | ) -> Option<(DataBlock, DataBlock)> {
  283 |     match data_block {
  284 |         DataBlock::FixedWidth(fixed_width_data_block) => {
  285 |             use std::collections::hash_map::Entry;
  286 | 
  287 |             let bytes_per_value = match fixed_width_data_block.bits_per_value {
  288 |                 64 => 8usize,
  289 |                 128 => 16usize,
  290 |                 _ => return None,
  291 |             };
  292 | 
  293 |             match fixed_width_data_block.bits_per_value {
  294 |                 64 => {
  295 |                     let mut map = HashMap::new();
  296 |                     let u64_slice = fixed_width_data_block.data.borrow_to_typed_slice::<u64>();
  297 |                     let u64_slice = u64_slice.as_ref();
  298 |                     let mut dictionary_buffer =
  299 |                         Vec::with_capacity((fixed_width_data_block.num_values as usize).min(1024));
  300 |                     let mut indices_buffer =
  301 |                         Vec::with_capacity(fixed_width_data_block.num_values as usize);
  302 |                     let mut curr_idx: i32 = 0;
  303 | 
  304 |                     for &value in u64_slice.iter() {
  305 |                         let idx = match map.entry(value) {
  306 |                             Entry::Occupied(entry) => *entry.get(),
  307 |                             Entry::Vacant(entry) => {
  308 |                                 if max_dict_entries == 0 || curr_idx as u32 >= max_dict_entries {
  309 |                                     return None;
  310 |                                 }
  311 |                                 if curr_idx == i32::MAX {
  312 |                                     return None;
  313 |                                 }
  314 |                                 dictionary_buffer.push(value);
  315 |                                 let idx = curr_idx;
  316 |                                 entry.insert(idx);
  317 |                                 curr_idx += 1;
  318 |                                 idx
  319 |                             }
  320 |                         };
  321 |                         indices_buffer.push(idx);
  322 |                         let dict_bytes = dictionary_buffer.len().saturating_mul(bytes_per_value);
  323 |                         let indices_bytes = indices_buffer
  324 |                             .len()
  325 |                             .saturating_mul(DICT_INDICES_BITS_PER_VALUE as usize / 8);
  326 |                         let encoded_size = dict_bytes.saturating_add(indices_bytes);
  327 |                         if encoded_size > max_encoded_size {
  328 |                             return None;
  329 |                         }
  330 |                     }
  331 | 
  332 |                     let mut dictionary_data_block = DataBlock::FixedWidth(FixedWidthDataBlock {
  333 |                         data: LanceBuffer::reinterpret_vec(dictionary_buffer),
  334 |                         bits_per_value: 64,
  335 |                         num_values: curr_idx as u64,
  336 |                         block_info: BlockInfo::default(),
  337 |                     });
  338 |                     dictionary_data_block.compute_stat();
  339 |                     let mut indices_data_block = DataBlock::FixedWidth(FixedWidthDataBlock {
  340 |                         data: LanceBuffer::reinterpret_vec(indices_buffer),
  341 |                         bits_per_value: DICT_INDICES_BITS_PER_VALUE,
  342 |                         num_values: fixed_width_data_block.num_values,
  343 |                         block_info: BlockInfo::default(),
  344 |                     });
  345 |                     indices_data_block.compute_stat();
  346 | 
  347 |                     Some((indices_data_block, dictionary_data_block))
  348 |                 }
  349 |                 128 => {
  350 |                     // TODO: a follow up PR to support `FixedWidth DataBlock with bits_per_value == 256`.
  351 |                     let mut map = HashMap::new();
  352 |                     let u128_slice = fixed_width_data_block.data.borrow_to_typed_slice::<u128>();
  353 |                     let u128_slice = u128_slice.as_ref();
  354 |                     let mut dictionary_buffer =
  355 |                         Vec::with_capacity((fixed_width_data_block.num_values as usize).min(1024));
  356 |                     let mut indices_buffer =
  357 |                         Vec::with_capacity(fixed_width_data_block.num_values as usize);
  358 |                     let mut curr_idx: i32 = 0;
  359 | 
  360 |                     for &value in u128_slice.iter() {
  361 |                         let idx = match map.entry(value) {
  362 |                             Entry::Occupied(entry) => *entry.get(),
  363 |                             Entry::Vacant(entry) => {
  364 |                                 if max_dict_entries == 0 || curr_idx as u32 >= max_dict_entries {
  365 |                                     return None;
  366 |                                 }
  367 |                                 if curr_idx == i32::MAX {
  368 |                                     return None;
  369 |                                 }
  370 |                                 dictionary_buffer.push(value);
  371 |                                 let idx = curr_idx;
  372 |                                 entry.insert(idx);
  373 |                                 curr_idx += 1;
  374 |                                 idx
  375 |                             }
  376 |                         };
  377 |                         indices_buffer.push(idx);
  378 |                         let dict_bytes = dictionary_buffer.len().saturating_mul(bytes_per_value);
  379 |                         let indices_bytes = indices_buffer
  380 |                             .len()
  381 |                             .saturating_mul(DICT_INDICES_BITS_PER_VALUE as usize / 8);
  382 |                         let encoded_size = dict_bytes.saturating_add(indices_bytes);
  383 |                         if encoded_size > max_encoded_size {
  384 |                             return None;
  385 |                         }
  386 |                     }
  387 | 
  388 |                     let mut dictionary_data_block = DataBlock::FixedWidth(FixedWidthDataBlock {
  389 |                         data: LanceBuffer::reinterpret_vec(dictionary_buffer),
  390 |                         bits_per_value: DICT_FIXED_WIDTH_BITS_PER_VALUE,
  391 |                         num_values: curr_idx as u64,
  392 |                         block_info: BlockInfo::default(),
  393 |                     });
  394 |                     dictionary_data_block.compute_stat();
  395 |                     let mut indices_data_block = DataBlock::FixedWidth(FixedWidthDataBlock {
  396 |                         data: LanceBuffer::reinterpret_vec(indices_buffer),
  397 |                         bits_per_value: DICT_INDICES_BITS_PER_VALUE,
  398 |                         num_values: fixed_width_data_block.num_values,
  399 |                         block_info: BlockInfo::default(),
  400 |                     });
  401 |                     indices_data_block.compute_stat();
  402 | 
  403 |                     Some((indices_data_block, dictionary_data_block))
  404 |                 }
  405 |                 _ => None,
  406 |             }
  407 |         }
  408 |         DataBlock::VariableWidth(variable_width_data_block) => {
  409 |             match variable_width_data_block.bits_per_offset {
  410 |                 32 => dict_encode_variable_width::<u32>(
  411 |                     variable_width_data_block,
  412 |                     32,
  413 |                     max_dict_entries,
  414 |                     max_encoded_size,
  415 |                 ),
  416 |                 64 => dict_encode_variable_width::<u64>(
  417 |                     variable_width_data_block,
  418 |                     64,
  419 |                     max_dict_entries,
  420 |                     max_encoded_size,
  421 |                 ),
  422 |                 _ => None,
  423 |             }
  424 |         }
  425 |         _ => None,
  426 |     }
  427 | }
  428 | 
  429 | #[cfg(test)]
  430 | mod tests {
  431 |     use super::*;
  432 |     use crate::{
  433 |         buffer::LanceBuffer,
  434 |         data::{BlockInfo, FixedWidthDataBlock},
  435 |     };
  436 |     use arrow_array::{Array, StringArray};
  437 |     use std::sync::Arc;
  438 | 
  439 |     #[test]
  440 |     fn test_dictionary_encode_abort_fixed_width() {
  441 |         // Create a u128 block with very high cardinality where dict encoding
  442 |         // would result in larger data (dictionary overhead + indices > original)
  443 |         let num_values = 120u64;
  444 | 
  445 |         // Create actual data: each value is unique u128 so dictionary encode will not be helpful
  446 |         let mut data = Vec::with_capacity(num_values as usize);
  447 |         for i in 0..num_values {
  448 |             data.push(i as u128);
  449 |         }
  450 | 
  451 |         let mut data_block = DataBlock::FixedWidth(FixedWidthDataBlock {
  452 |             bits_per_value: DICT_FIXED_WIDTH_BITS_PER_VALUE,
  453 |             data: LanceBuffer::reinterpret_vec(data),
  454 |             num_values,
  455 |             block_info: BlockInfo::default(),
  456 |         });
  457 | 
  458 |         // Compute stats naturally
  459 |         data_block.compute_stat();
  460 | 
  461 |         // Dictionary encoding should abort and return None
  462 |         let max_encoded_size = usize::try_from(data_block.data_size()).unwrap_or(usize::MAX);
  463 |         let result = dictionary_encode(&data_block, 1000, max_encoded_size);
  464 |         assert!(
  465 |             result.is_none(),
  466 |             "Dictionary encoding should abort for high cardinality u128 data"
  467 |         );
  468 |     }
  469 | 
  470 |     #[test]
  471 |     fn test_dictionary_encode_success_fixed_width() {
  472 |         // Create a u128 block with low cardinality where dict encoding helps
  473 |         let num_values = 120u64;
  474 |         let cardinality = 3u64;
  475 | 
  476 |         // Create data with few unique u128 values
  477 |         let mut data = Vec::with_capacity(num_values as usize);
  478 |         for i in 0..num_values {
  479 |             data.push((i % cardinality) as u128);
  480 |         }
  481 | 
  482 |         let mut data_block = DataBlock::FixedWidth(FixedWidthDataBlock {
  483 |             bits_per_value: DICT_FIXED_WIDTH_BITS_PER_VALUE,
  484 |             data: LanceBuffer::reinterpret_vec(data),
  485 |             num_values,
  486 |             block_info: BlockInfo::default(),
  487 |         });
  488 | 
  489 |         // Compute stats naturally
  490 |         data_block.compute_stat();
  491 | 
  492 |         // Dictionary encoding should succeed and return Some
  493 |         let max_encoded_size = usize::try_from(data_block.data_size()).unwrap_or(usize::MAX);
  494 |         let result = dictionary_encode(&data_block, 1000, max_encoded_size);
  495 |         assert!(
  496 |             result.is_some(),
  497 |             "Dictionary encoding should succeed for low cardinality u128 data"
  498 |         );
  499 | 
  500 |         if let Some((indices, dictionary)) = result {
  501 |             // Verify indices block
  502 |             if let DataBlock::FixedWidth(indices_block) = indices {
  503 |                 assert_eq!(indices_block.num_values, num_values);
  504 |                 assert_eq!(indices_block.bits_per_value, DICT_INDICES_BITS_PER_VALUE);
  505 |             } else {
  506 |                 panic!("Expected FixedWidth indices block");
  507 |             }
  508 | 
  509 |             // Verify dictionary block
  510 |             if let DataBlock::FixedWidth(dict_block) = dictionary {
  511 |                 assert_eq!(dict_block.num_values, cardinality);
  512 |                 assert_eq!(dict_block.bits_per_value, DICT_FIXED_WIDTH_BITS_PER_VALUE);
  513 |             } else {
  514 |                 panic!("Expected FixedWidth dictionary block");
  515 |             }
  516 |         }
  517 |     }
  518 | 
  519 |     #[test]
  520 |     fn test_dictionary_encode_abort_variable_width() {
  521 |         // Create a variable-width block with high cardinality where dict encoding
  522 |         // won't provide sufficient benefit
  523 |         let num_values = 120u64;
  524 |         let mut values = Vec::with_capacity(num_values as usize);
  525 |         for i in 0..num_values {
  526 |             values.push(format!("unique_value_{:04}", i));
  527 |         }
  528 |         let array = StringArray::from(values);
  529 |         // from_array already computes stats
  530 |         let data_block = DataBlock::from_array(Arc::new(array) as Arc<dyn Array>);
  531 | 
  532 |         // Dictionary encoding should abort and return None
  533 |         let max_encoded_size = usize::try_from(data_block.data_size()).unwrap_or(usize::MAX);
  534 |         let result = dictionary_encode(&data_block, 10, max_encoded_size);
  535 |         assert!(
  536 |             result.is_none(),
  537 |             "Dictionary encoding should abort for high cardinality string data"
  538 |         );
  539 |     }
  540 | 
  541 |     #[test]
  542 |     fn test_dictionary_encode_success_low_cardinality() {
  543 |         // Create a variable-width block with low cardinality where dict encoding helps
  544 |         let num_values = 120u64;
  545 |         let cardinality = 3u64;
  546 | 
  547 |         let mut values = Vec::with_capacity(num_values as usize);
  548 |         for i in 0..num_values {
  549 |             values.push(format!("value_{}", i % cardinality));
  550 |         }
  551 | 
  552 |         let array = StringArray::from(values);
  553 |         let data_block = DataBlock::from_array(Arc::new(array) as Arc<dyn Array>);
  554 | 
  555 |         // Dictionary encoding should succeed and return Some
  556 |         let max_encoded_size = usize::try_from(data_block.data_size()).unwrap_or(usize::MAX);
  557 |         let result = dictionary_encode(&data_block, 100, max_encoded_size);
  558 |         assert!(
  559 |             result.is_some(),
  560 |             "Dictionary encoding should succeed for low cardinality data"
  561 |         );
  562 | 
  563 |         if let Some((indices, dictionary)) = result {
  564 |             // Verify indices block
  565 |             if let DataBlock::FixedWidth(indices_block) = indices {
  566 |                 assert_eq!(indices_block.num_values, num_values);
  567 |                 assert_eq!(indices_block.bits_per_value, DICT_INDICES_BITS_PER_VALUE);
  568 |             } else {
  569 |                 panic!("Expected FixedWidth indices block");
  570 |             }
  571 | 
  572 |             // Verify dictionary block
  573 |             if let DataBlock::VariableWidth(dict_block) = dictionary {
  574 |                 assert_eq!(dict_block.num_values, cardinality);
  575 |             } else {
  576 |                 panic!("Expected VariableWidth dictionary block");
  577 |             }
  578 |         }
  579 |     }
  580 | 
  581 |     #[test]
  582 |     fn test_dictionary_encode_invalid_offset_width_returns_none() {
  583 |         let array = StringArray::from(vec!["a", "b", "c", "a"]);
  584 |         let data_block = DataBlock::from_array(Arc::new(array) as Arc<dyn Array>);
  585 |         let invalid_block = match data_block {
  586 |             DataBlock::VariableWidth(mut var) => {
  587 |                 var.bits_per_offset = 16;
  588 |                 DataBlock::VariableWidth(var)
  589 |             }
  590 |             other => panic!("Expected VariableWidth data block, got {:?}", other),
  591 |         };
  592 |         let max_encoded_size = usize::try_from(invalid_block.data_size()).unwrap_or(usize::MAX);
  593 |         assert!(dictionary_encode(&invalid_block, 100, max_encoded_size).is_none());
  594 |     }
  595 | 
  596 |     #[test]
  597 |     fn test_dictionary_encode_respects_size_limit() {
  598 |         let num_values = 10_000u64;
  599 |         let cardinality = 50u64;
  600 | 
  601 |         let mut values = Vec::with_capacity(num_values as usize);
  602 |         for i in 0..num_values {
  603 |             values.push(format!("value_{:08}", i % cardinality));
  604 |         }
  605 | 
  606 |         let array = StringArray::from(values);
  607 |         let data_block = DataBlock::from_array(Arc::new(array) as Arc<dyn Array>);
  608 | 
  609 |         let full_size = usize::try_from(data_block.data_size()).unwrap_or(usize::MAX);
  610 |         let too_small_limit = full_size / 10;
  611 |         assert!(dictionary_encode(&data_block, 1000, too_small_limit).is_none());
  612 |         assert!(dictionary_encode(&data_block, 1000, full_size).is_some());
  613 |     }
  614 | 
  615 |     #[test]
  616 |     fn test_dictionary_encode_respects_entry_limit() {
  617 |         let num_values = 10_000u64;
  618 |         let cardinality = 200u64;
  619 | 
  620 |         let mut values = Vec::with_capacity(num_values as usize);
  621 |         for i in 0..num_values {
  622 |             values.push(format!("value_{:08}", i % cardinality));
  623 |         }
  624 | 
  625 |         let array = StringArray::from(values);
  626 |         let data_block = DataBlock::from_array(Arc::new(array) as Arc<dyn Array>);
  627 | 
  628 |         let max_encoded_size = usize::try_from(data_block.data_size()).unwrap_or(usize::MAX);
  629 |         assert!(dictionary_encode(&data_block, 10, max_encoded_size).is_none());
  630 |         assert!(dictionary_encode(&data_block, 500, max_encoded_size).is_some());
  631 |     }
  632 | }
``````
