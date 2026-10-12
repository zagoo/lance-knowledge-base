> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../../V21-PROTOCOL.md).

# rust/lance-file/src/versions/v1/encoding/dictionary.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `79c25ddd5a145801d97c355b93373b396c8b931c1cdf9886269fd3f940aeaf24`. Reviewed physical lines: 1-253.

[Module](../../../../../../../L1-modules/rust-lance-file-v1-codecs.md) · [Symbols](../../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../../README.md)

## Role and visibility

Public frozen V1 dictionary key encoder and decoder. Keys use the plain codec; dictionary values are supplied separately as an ArrayRef. Contains one active test dispatching eight key types and one generic decoder fixture helper. (rust/lance-file/src/versions/v1/encoding/dictionary.rs:1-253)

## Complete range analysis

### Lines 1-25

SPDX/module header and imports establish Arrow dictionary/primitive arrays, all eight integer key types, core errors, Reader/Writer/ReadBatchParams and PlainEncoder/PlainDecoder. No dictionary values are persisted by this module, and it does not select a file version. (rust/lance-file/src/versions/v1/encoding/dictionary.rs:1-25)

### Lines 26-36

DictionaryEncoder privately borrows a mutable Writer and key DataType. Public new stores both without checking dictionary array shape, supported key type or correspondence with future inputs. (rust/lance-file/src/versions/v1/encoding/dictionary.rs:26-36)

### Lines 37-58

write_typed_array asserts nonempty inputs, records writer position, then downcasts every input using the chosen key type and collects borrowed key arrays. It constructs PlainEncoder using the first original dictionary DataType, but PlainEncoder's non-FSL branch selects actual primitive key type from the arrays. It writes only raw key values and returns the initial position. No check compares dictionaries across batches, remaps keys, writes values or preserves key validity; downcast mismatches panic. (rust/lance-file/src/versions/v1/encoding/dictionary.rs:37-58)

### Lines 59-79

encode dispatches from the configured key_type over unsigned/signed 8/16/32/64; unsupported types return Schema with Debug type. Supported type plus empty input reaches the assertion, whereas unsupported type returns its error without examining the slice. No per-array schema preflight or rollback is added. (rust/lance-file/src/versions/v1/encoding/dictionary.rs:59-79)

### Lines 80-103

Public DictionaryDecoder privately stores Reader, key-page position, logical row count, borrowed dictionary DataType and owned shared value_arr. Its Debug output includes position, length, declared type and full value_arr debug representation, but omits Reader. This can be large; no redaction or abbreviated dictionary is implemented. (rust/lance-file/src/versions/v1/encoding/dictionary.rs:80-103)

### Lines 104-121

new asserts only that data_type is Dictionary, then stores supplied state. It does not check the declared value type against value_arr.data_type, key validity, dictionary cardinality or file bounds. A non-dictionary input panics despite later decode_impl containing an Arrow error branch for that shape. (rust/lance-file/src/versions/v1/encoding/dictionary.rs:104-121)

### Lines 122-150

decode_impl extracts and asserts a dictionary key type, creates PlainDecoder over the key page, and awaits the requested selection. It dispatches the decoded key array over the eight integer types to make_dict_array; unsupported match fallback is Arrow error. Range and take behavior, lost stored validity and read failures inherit PlainDecoder. The expected value type is ignored after extracting the key type. (rust/lance-file/src/versions/v1/encoding/dictionary.rs:122-150)

### Lines 151-162

make_dict_array downcasts/clones the primitive keys and calls fallible DictionaryArray::try_new with a clone of the stored values Arc. This delegates key/value construction validation and shares the existing dictionary values. No values IO or schema-value-type comparison occurs; the resulting dictionary's value type follows the supplied value array. The async helper has no await in its body. (rust/lance-file/src/versions/v1/encoding/dictionary.rs:151-162)

### Lines 163-176

Public decode requests full range, take clones the UInt32Array selector and forwards it, and get forwards arbitrary convertible ReadBatchParams. All converge on decode_impl without another validation layer. No cache, value dictionary merge or independently optimized take is introduced. (rust/lance-file/src/versions/v1/encoding/dictionary.rs:163-176)

### Lines 177-208

cfg(test) imports local-file helpers. Generic test_dict_decoder_for_type builds shared string values [a,b,c,d] and two dictionary arrays with keys [0,1] and [1,3]. It then extracts their keys into the input list. These inputs contain no null keys or null dictionary values. (rust/lance-file/src/versions/v1/encoding/dictionary.rs:177-208)

### Lines 209-240

The decoder fixture writes those extracted keys with PlainEncoder directly, shuts down, supplies the same values Arc to DictionaryDecoder and compares full decoded dictionary contents with [a,b,b,d]. It never instantiates DictionaryEncoder, and it does not assert raw key layout, dictionary Arc identity or error behavior. (rust/lance-file/src/versions/v1/encoding/dictionary.rs:209-240)

### Lines 241-253

The sole active test invokes the helper sequentially for Int8/16/32/64 and UInt8/16/32/64. It supplies eight full-decode oracles, not dictionary-encoder, take/range, null-key, mismatched-value-type, invalid-key or incompatible-dictionary coverage. File ends here without unsafe blocks. (rust/lance-file/src/versions/v1/encoding/dictionary.rs:241-253)

## Interaction and interpretation limits

Every physical line was read during ANALYZE61, including disabled test bodies. Tests were inspected, not run. Source remains offline and read-only: no build, test, benchmark, generator or installation was executed. These frozen V1 codecs are historical compatibility surfaces, not extension points for new format capabilities. Full V1 reader is now analyzed; backend lifecycle remains pending; narrow helper/caller reads are separately recorded. Malformed-input consequences and the repeated-leading-index trace are source deductions, not executed reproductions. No local feature flag, environment variable, global mutable state, task spawning, shutdown or cancellation cleanup is introduced by these codec implementations.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Dictionary encoding.
    5 | //!
    6 | 
    7 | use std::fmt;
    8 | use std::sync::Arc;
    9 | 
   10 | use arrow_array::cast::{as_dictionary_array, as_primitive_array};
   11 | use arrow_array::types::{
   12 |     ArrowDictionaryKeyType, Int8Type, Int16Type, Int32Type, Int64Type, UInt8Type, UInt16Type,
   13 |     UInt32Type, UInt64Type,
   14 | };
   15 | use arrow_array::{Array, ArrayRef, DictionaryArray, PrimitiveArray, UInt32Array};
   16 | use arrow_schema::DataType;
   17 | 
   18 | use lance_core::{Error, Result};
   19 | use lance_io::{
   20 |     ReadBatchParams,
   21 |     traits::{Reader, Writer},
   22 | };
   23 | 
   24 | use super::plain::{PlainDecoder, PlainEncoder};
   25 | 
   26 | /// Encoder for Dictionary encoding.
   27 | pub struct DictionaryEncoder<'a> {
   28 |     writer: &'a mut dyn Writer,
   29 |     key_type: &'a DataType,
   30 | }
   31 | 
   32 | impl<'a> DictionaryEncoder<'a> {
   33 |     pub fn new(writer: &'a mut dyn Writer, key_type: &'a DataType) -> Self {
   34 |         Self { writer, key_type }
   35 |     }
   36 | 
   37 |     async fn write_typed_array<T: ArrowDictionaryKeyType>(
   38 |         &mut self,
   39 |         arrs: &[&dyn Array],
   40 |     ) -> Result<usize> {
   41 |         assert!(!arrs.is_empty());
   42 |         let data_type = arrs[0].data_type();
   43 |         let pos = self.writer.tell().await?;
   44 |         let mut plain_encoder = PlainEncoder::new(self.writer, data_type);
   45 | 
   46 |         let keys = arrs
   47 |             .iter()
   48 |             .map(|a| {
   49 |                 let dict_arr = as_dictionary_array::<T>(*a);
   50 |                 dict_arr.keys() as &dyn Array
   51 |             })
   52 |             .collect::<Vec<_>>();
   53 | 
   54 |         plain_encoder.encode(keys.as_slice()).await?;
   55 |         Ok(pos)
   56 |     }
   57 | }
   58 | 
   59 | impl DictionaryEncoder<'_> {
   60 |     pub async fn encode(&mut self, array: &[&dyn Array]) -> Result<usize> {
   61 |         use DataType::*;
   62 | 
   63 |         match self.key_type {
   64 |             UInt8 => self.write_typed_array::<UInt8Type>(array).await,
   65 |             UInt16 => self.write_typed_array::<UInt16Type>(array).await,
   66 |             UInt32 => self.write_typed_array::<UInt32Type>(array).await,
   67 |             UInt64 => self.write_typed_array::<UInt64Type>(array).await,
   68 |             Int8 => self.write_typed_array::<Int8Type>(array).await,
   69 |             Int16 => self.write_typed_array::<Int16Type>(array).await,
   70 |             Int32 => self.write_typed_array::<Int32Type>(array).await,
   71 |             Int64 => self.write_typed_array::<Int64Type>(array).await,
   72 |             _ => Err(Error::schema(format!(
   73 |                 "DictionaryEncoder: unsupported key type: {:?}",
   74 |                 self.key_type
   75 |             ))),
   76 |         }
   77 |     }
   78 | }
   79 | 
   80 | /// Decoder for Dictionary encoding.
   81 | pub struct DictionaryDecoder<'a> {
   82 |     reader: &'a dyn Reader,
   83 |     /// The start position of the key array in the file.
   84 |     position: usize,
   85 |     /// Number of the rows in this batch.
   86 |     length: usize,
   87 |     /// The dictionary data type
   88 |     data_type: &'a DataType,
   89 |     /// Value array,
   90 |     value_arr: ArrayRef,
   91 | }
   92 | 
   93 | impl fmt::Debug for DictionaryDecoder<'_> {
   94 |     fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
   95 |         f.debug_struct("DictionaryDecoder")
   96 |             .field("position", &self.position)
   97 |             .field("length", &self.length)
   98 |             .field("data_type", &self.data_type)
   99 |             .field("value_arr", &self.value_arr)
  100 |             .finish()
  101 |     }
  102 | }
  103 | 
  104 | impl<'a> DictionaryDecoder<'a> {
  105 |     pub fn new(
  106 |         reader: &'a dyn Reader,
  107 |         position: usize,
  108 |         length: usize,
  109 |         data_type: &'a DataType,
  110 |         value_arr: ArrayRef,
  111 |     ) -> Self {
  112 |         assert!(matches!(data_type, DataType::Dictionary(_, _)));
  113 |         Self {
  114 |             reader,
  115 |             position,
  116 |             length,
  117 |             data_type,
  118 |             value_arr,
  119 |         }
  120 |     }
  121 | 
  122 |     async fn decode_impl(&self, params: impl Into<ReadBatchParams>) -> Result<ArrayRef> {
  123 |         let index_type = if let DataType::Dictionary(key_type, _) = &self.data_type {
  124 |             assert!(key_type.as_ref().is_dictionary_key_type());
  125 |             key_type.as_ref()
  126 |         } else {
  127 |             return Err(Error::arrow(format!(
  128 |                 "Not a dictionary type: {}",
  129 |                 self.data_type
  130 |             )));
  131 |         };
  132 | 
  133 |         let decoder = PlainDecoder::new(self.reader, index_type, self.position, self.length)?;
  134 |         let keys = decoder.get(params.into()).await?;
  135 | 
  136 |         match index_type {
  137 |             DataType::Int8 => self.make_dict_array::<Int8Type>(keys).await,
  138 |             DataType::Int16 => self.make_dict_array::<Int16Type>(keys).await,
  139 |             DataType::Int32 => self.make_dict_array::<Int32Type>(keys).await,
  140 |             DataType::Int64 => self.make_dict_array::<Int64Type>(keys).await,
  141 |             DataType::UInt8 => self.make_dict_array::<UInt8Type>(keys).await,
  142 |             DataType::UInt16 => self.make_dict_array::<UInt16Type>(keys).await,
  143 |             DataType::UInt32 => self.make_dict_array::<UInt32Type>(keys).await,
  144 |             DataType::UInt64 => self.make_dict_array::<UInt64Type>(keys).await,
  145 |             _ => Err(Error::arrow(format!(
  146 |                 "Dictionary encoding does not support index type: {index_type}",
  147 |             ))),
  148 |         }
  149 |     }
  150 | 
  151 |     async fn make_dict_array<T: ArrowDictionaryKeyType + Sync + Send>(
  152 |         &self,
  153 |         index_array: ArrayRef,
  154 |     ) -> Result<ArrayRef> {
  155 |         let keys: PrimitiveArray<T> = as_primitive_array(index_array.as_ref()).clone();
  156 |         Ok(Arc::new(DictionaryArray::try_new(
  157 |             keys,
  158 |             self.value_arr.clone(),
  159 |         )?))
  160 |     }
  161 | }
  162 | 
  163 | impl DictionaryDecoder<'_> {
  164 |     pub async fn decode(&self) -> Result<ArrayRef> {
  165 |         self.decode_impl(..).await
  166 |     }
  167 | 
  168 |     pub async fn take(&self, indices: &UInt32Array) -> Result<ArrayRef> {
  169 |         self.decode_impl(indices.clone()).await
  170 |     }
  171 | 
  172 |     pub async fn get(&self, params: impl Into<ReadBatchParams>) -> Result<ArrayRef> {
  173 |         self.decode_impl(params).await
  174 |     }
  175 | }
  176 | 
  177 | #[cfg(test)]
  178 | mod tests {
  179 |     use super::*;
  180 | 
  181 |     use arrow_array::StringArray;
  182 |     use arrow_buffer::ArrowNativeType;
  183 |     use lance_core::utils::tempfile::TempStdFile;
  184 |     use lance_io::local::LocalObjectReader;
  185 |     use tokio::io::AsyncWriteExt;
  186 | 
  187 |     async fn test_dict_decoder_for_type<T: ArrowDictionaryKeyType>() {
  188 |         let value_array: StringArray = vec![Some("a"), Some("b"), Some("c"), Some("d")]
  189 |             .into_iter()
  190 |             .collect();
  191 |         let value_array_ref = Arc::new(value_array) as ArrayRef;
  192 | 
  193 |         let keys1: PrimitiveArray<T> = vec![T::Native::from_usize(0), T::Native::from_usize(1)]
  194 |             .into_iter()
  195 |             .collect();
  196 |         let arr1: DictionaryArray<T> =
  197 |             DictionaryArray::try_new(keys1, value_array_ref.clone()).unwrap();
  198 | 
  199 |         let keys2: PrimitiveArray<T> = vec![T::Native::from_usize(1), T::Native::from_usize(3)]
  200 |             .into_iter()
  201 |             .collect();
  202 |         let arr2: DictionaryArray<T> =
  203 |             DictionaryArray::try_new(keys2, value_array_ref.clone()).unwrap();
  204 | 
  205 |         let keys1_ref = arr1.keys() as &dyn Array;
  206 |         let keys2_ref = arr2.keys() as &dyn Array;
  207 |         let arrs: Vec<&dyn Array> = vec![keys1_ref, keys2_ref];
  208 | 
  209 |         let path = TempStdFile::default();
  210 | 
  211 |         let pos;
  212 |         {
  213 |             let mut object_writer = tokio::fs::File::create(&path).await.unwrap();
  214 |             let mut encoder = PlainEncoder::new(&mut object_writer, arr1.keys().data_type());
  215 |             pos = encoder.encode(arrs.as_slice()).await.unwrap();
  216 |             AsyncWriteExt::shutdown(&mut object_writer).await.unwrap();
  217 |         }
  218 | 
  219 |         let reader = LocalObjectReader::open_local_path(&path, 2048, None)
  220 |             .await
  221 |             .unwrap();
  222 |         let decoder = DictionaryDecoder::new(
  223 |             reader.as_ref(),
  224 |             pos,
  225 |             arr1.len() + arr2.len(),
  226 |             arr1.data_type(),
  227 |             value_array_ref.clone(),
  228 |         );
  229 | 
  230 |         let decoded_data = decoder.decode().await.unwrap();
  231 |         let expected_data: DictionaryArray<T> = vec!["a", "b", "b", "d"].into_iter().collect();
  232 |         assert_eq!(
  233 |             &expected_data,
  234 |             decoded_data
  235 |                 .as_any()
  236 |                 .downcast_ref::<DictionaryArray<T>>()
  237 |                 .unwrap()
  238 |         );
  239 |     }
  240 | 
  241 |     #[tokio::test]
  242 |     async fn test_dict_decoder() {
  243 |         test_dict_decoder_for_type::<Int8Type>().await;
  244 |         test_dict_decoder_for_type::<Int16Type>().await;
  245 |         test_dict_decoder_for_type::<Int32Type>().await;
  246 |         test_dict_decoder_for_type::<Int64Type>().await;
  247 | 
  248 |         test_dict_decoder_for_type::<UInt8Type>().await;
  249 |         test_dict_decoder_for_type::<UInt16Type>().await;
  250 |         test_dict_decoder_for_type::<UInt32Type>().await;
  251 |         test_dict_decoder_for_type::<UInt64Type>().await;
  252 |     }
  253 | }
``````
