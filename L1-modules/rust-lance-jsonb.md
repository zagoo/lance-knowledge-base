# rust-lance-jsonb Module Map

New local production source; mapped implementation unless linked as a selected Key File.

<a id="rust-lance-jsonb-src"></a>

### `rust/lance-jsonb/src/`

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/constants.rs` | 1-25 | mapped |

<a id="rust-lance-jsonb-src-core"></a>

### `rust/lance-jsonb/src/core/`

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/core/builder.rs` | 1-139 | mapped |

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/core/constants.rs` | 1-44 | mapped |

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/core/de.rs` | 1-897 | mapped |

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/core/item.rs` | 1-295 | mapped |

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/core/iterator.rs` | 1-266 | mapped |

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/core/jentry.rs` | 1-73 | mapped |

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/core/mod.rs` | 1-19 | mapped |

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/core/ser.rs` | 1-409 | mapped |

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/core/util.rs` | 1-561 | mapped |

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/error.rs` | 1-148 | mapped |

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/extension.rs` | 1-280 | mapped |

<a id="rust-lance-jsonb-src-functions"></a>

### `rust/lance-jsonb/src/functions/`

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/functions/mod.rs` | 1-7 | mapped |

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/functions/path.rs` | 1-137 | mapped |

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/functions/scalar.rs` | 1-917 | mapped |

<a id="rust-lance-jsonb-src-jsonpath"></a>

### `rust/lance-jsonb/src/jsonpath/`

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/jsonpath/mod.rs` | 1-12 | mapped |

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/jsonpath/parser.rs` | 1-542 | mapped |

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/jsonpath/path.rs` | 1-536 | mapped |

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/jsonpath/selector.rs` | 1-893 | mapped |

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/lib.rs` | 1-103 | key-file |

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/number.rs` | 1-1319 | mapped |

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/owned.rs` | 1-146 | mapped |

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/parser.rs` | 1-926 | mapped |

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/raw.rs` | 1-308 | mapped |

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/util.rs` | 1-224 | mapped |

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/value.rs` | 1-257 | mapped |

## Source refresh map — 2026-10-11

Current source `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`. [Changed contracts](../L3-symbols/refresh-2026-10-11.md). Existing directory responsibilities remain; declarations below locate changed boundaries.

### `rust/lance-jsonb/src/constants.rs`

Public parse/owned/raw/value/number/error and extension boundaries for Lance-owned persisted JSONB values. File role: constants.

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/constants.rs` | 1-25 | mapped |

### `rust/lance-jsonb/src/core/builder.rs`

Binary JSONB item, container, JEntry, serialization, deserialization and traversal primitives. These locally owned format helpers are mapped; modify only after reading their exact implementation and compatibility contract. File role: builder.

Key declarations: `ArrayBuilder` (rust/lance-jsonb/src/core/builder.rs:20-20), `with_capacity` (rust/lance-jsonb/src/core/builder.rs:25-25), `push_jsonb_item` (rust/lance-jsonb/src/core/builder.rs:31-31), `build` (rust/lance-jsonb/src/core/builder.rs:35-35).

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/core/builder.rs` | 1-139 | mapped |

### `rust/lance-jsonb/src/core/constants.rs`

Binary JSONB item, container, JEntry, serialization, deserialization and traversal primitives. These locally owned format helpers are mapped; modify only after reading their exact implementation and compatibility contract. File role: constants.

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/core/constants.rs` | 1-44 | mapped |

### `rust/lance-jsonb/src/core/de.rs`

Binary JSONB item, container, JEntry, serialization, deserialization and traversal primitives. These locally owned format helpers are mapped; modify only after reading their exact implementation and compatibility contract. File role: de.

Key declarations: `Deserializer` (rust/lance-jsonb/src/core/de.rs:27-27), `new` (rust/lance-jsonb/src/core/de.rs:41-41), `end` (rust/lance-jsonb/src/core/de.rs:53-53).

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/core/de.rs` | 1-897 | mapped |

### `rust/lance-jsonb/src/core/item.rs`

Binary JSONB item, container, JEntry, serialization, deserialization and traversal primitives. These locally owned format helpers are mapped; modify only after reading their exact implementation and compatibility contract. File role: item.

Key declarations: `JsonbItemType` (rust/lance-jsonb/src/core/item.rs:17-17), `NumberItem` (rust/lance-jsonb/src/core/item.rs:75-75), `as_number` (rust/lance-jsonb/src/core/item.rs:84-84), `ExtensionItem` (rust/lance-jsonb/src/core/item.rs:96-96), `as_extension_value` (rust/lance-jsonb/src/core/item.rs:105-105), `JsonbItem` (rust/lance-jsonb/src/core/item.rs:126-126), `jsonb_item_type` (rust/lance-jsonb/src/core/item.rs:144-144).

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/core/item.rs` | 1-295 | mapped |

### `rust/lance-jsonb/src/core/iterator.rs`

Binary JSONB item, container, JEntry, serialization, deserialization and traversal primitives. These locally owned format helpers are mapped; modify only after reading their exact implementation and compatibility contract. File role: iterator.

Key declarations: `ArrayIterator` (rust/lance-jsonb/src/core/iterator.rs:14-14), `new` (rust/lance-jsonb/src/core/iterator.rs:23-23), `new_with_len` (rust/lance-jsonb/src/core/iterator.rs:32-32), `ObjectValueIterator` (rust/lance-jsonb/src/core/iterator.rs:85-85), `new` (rust/lance-jsonb/src/core/iterator.rs:94-94), `len` (rust/lance-jsonb/src/core/iterator.rs:118-118), `ObjectIterator` (rust/lance-jsonb/src/core/iterator.rs:165-165), `new` (rust/lance-jsonb/src/core/iterator.rs:176-176).

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/core/iterator.rs` | 1-266 | mapped |

### `rust/lance-jsonb/src/core/jentry.rs`

Binary JSONB item, container, JEntry, serialization, deserialization and traversal primitives. These locally owned format helpers are mapped; modify only after reading their exact implementation and compatibility contract. File role: jentry.

Key declarations: `JEntry` (rust/lance-jsonb/src/core/jentry.rs:9-9), `decode_jentry` (rust/lance-jsonb/src/core/jentry.rs:15-15), `make_null_jentry` (rust/lance-jsonb/src/core/jentry.rs:21-21), `make_true_jentry` (rust/lance-jsonb/src/core/jentry.rs:28-28), `make_false_jentry` (rust/lance-jsonb/src/core/jentry.rs:35-35), `make_string_jentry` (rust/lance-jsonb/src/core/jentry.rs:42-42), `make_number_jentry` (rust/lance-jsonb/src/core/jentry.rs:49-49), `make_container_jentry` (rust/lance-jsonb/src/core/jentry.rs:56-56).

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/core/jentry.rs` | 1-73 | mapped |

### `rust/lance-jsonb/src/core/mod.rs`

Binary JSONB item, container, JEntry, serialization, deserialization and traversal primitives. These locally owned format helpers are mapped; modify only after reading their exact implementation and compatibility contract. File role: mod.

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/core/mod.rs` | 1-19 | mapped |

### `rust/lance-jsonb/src/core/ser.rs`

Binary JSONB item, container, JEntry, serialization, deserialization and traversal primitives. These locally owned format helpers are mapped; modify only after reading their exact implementation and compatibility contract. File role: ser.

Key declarations: `Encoder` (rust/lance-jsonb/src/core/ser.rs:271-271), `new` (rust/lance-jsonb/src/core/ser.rs:277-277), `encode` (rust/lance-jsonb/src/core/ser.rs:284-284).

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/core/ser.rs` | 1-409 | mapped |

### `rust/lance-jsonb/src/core/util.rs`

Binary JSONB item, container, JEntry, serialization, deserialization and traversal primitives. These locally owned format helpers are mapped; modify only after reading their exact implementation and compatibility contract. File role: util.

Key declarations: `from_raw_jsonb` (rust/lance-jsonb/src/core/util.rs:34-34), `jsonb_item_type` (rust/lance-jsonb/src/core/util.rs:78-78), `get_object_value_by_key_name` (rust/lance-jsonb/src/core/util.rs:100-100), `read_header` (rust/lance-jsonb/src/core/util.rs:163-163), `read_jentry` (rust/lance-jsonb/src/core/util.rs:176-176), `read_jentry_and_data` (rust/lance-jsonb/src/core/util.rs:182-182), `read_u32` (rust/lance-jsonb/src/core/util.rs:196-196), `slice` (rust/lance-jsonb/src/core/util.rs:206-206).

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/core/util.rs` | 1-561 | mapped |

### `rust/lance-jsonb/src/error.rs`

Public parse/owned/raw/value/number/error and extension boundaries for Lance-owned persisted JSONB values. File role: error.

Key declarations: `ParseErrorCode` (rust/lance-jsonb/src/error.rs:12-12), `Result` (rust/lance-jsonb/src/error.rs:34-34), `Error` (rust/lance-jsonb/src/error.rs:78-78).

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/error.rs` | 1-148 | mapped |

### `rust/lance-jsonb/src/extension.rs`

Public parse/owned/raw/value/number/error and extension boundaries for Lance-owned persisted JSONB values. File role: extension.

Key declarations: `ExtensionValue` (rust/lance-jsonb/src/extension.rs:30-30), `Date` (rust/lance-jsonb/src/extension.rs:50-50), `Timestamp` (rust/lance-jsonb/src/extension.rs:62-62), `TimestampTz` (rust/lance-jsonb/src/extension.rs:74-74), `Interval` (rust/lance-jsonb/src/extension.rs:88-88).

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/extension.rs` | 1-280 | mapped |

### `rust/lance-jsonb/src/functions/mod.rs`

Scalar conversion/access and path-selection operations used by Lance JSON adapters. File role: mod.

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/functions/mod.rs` | 1-7 | mapped |

### `rust/lance-jsonb/src/functions/path.rs`

Scalar conversion/access and path-selection operations used by Lance JSON adapters. File role: path.

Key declarations: `get_by_index` (rust/lance-jsonb/src/functions/path.rs:58-58), `get_by_name` (rust/lance-jsonb/src/functions/path.rs:119-119).

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/functions/path.rs` | 1-137 | mapped |

### `rust/lance-jsonb/src/functions/scalar.rs`

Scalar conversion/access and path-selection operations used by Lance JSON adapters. File role: scalar.

Key declarations: `is_null` (rust/lance-jsonb/src/functions/scalar.rs:45-45), `is_boolean` (rust/lance-jsonb/src/functions/scalar.rs:101-101), `as_bool` (rust/lance-jsonb/src/functions/scalar.rs:121-121), `to_bool` (rust/lance-jsonb/src/functions/scalar.rs:194-194), `is_number` (rust/lance-jsonb/src/functions/scalar.rs:271-271), `as_number` (rust/lance-jsonb/src/functions/scalar.rs:340-340), `is_i64` (rust/lance-jsonb/src/functions/scalar.rs:398-398), `as_i64` (rust/lance-jsonb/src/functions/scalar.rs:416-416).

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/functions/scalar.rs` | 1-917 | mapped |

### `rust/lance-jsonb/src/jsonpath/mod.rs`

Parses and evaluates JSONPath against local binary values; path AST and selector execution share the local JSONB representation. File role: mod.

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/jsonpath/mod.rs` | 1-12 | mapped |

### `rust/lance-jsonb/src/jsonpath/parser.rs`

Parses and evaluates JSONPath against local binary values; path AST and selector execution share the local JSONB representation. File role: parser.

Key declarations: `parse_json_path` (rust/lance-jsonb/src/jsonpath/parser.rs:42-42), `raw_string` (rust/lance-jsonb/src/jsonpath/parser.rs:85-85), `string` (rust/lance-jsonb/src/jsonpath/parser.rs:124-124).

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/jsonpath/parser.rs` | 1-542 | mapped |

### `rust/lance-jsonb/src/jsonpath/path.rs`

Parses and evaluates JSONPath against local binary values; path AST and selector execution share the local JSONB representation. File role: path.

Key declarations: `JsonPath` (rust/lance-jsonb/src/jsonpath/path.rs:17-17), `Path` (rust/lance-jsonb/src/jsonpath/path.rs:25-25), `Index` (rust/lance-jsonb/src/jsonpath/path.rs:66-66), `ArrayIndex` (rust/lance-jsonb/src/jsonpath/path.rs:75-75), `to_indices` (rust/lance-jsonb/src/jsonpath/path.rs:92-92), `RecursiveLevelEnd` (rust/lance-jsonb/src/jsonpath/path.rs:131-131), `RecursiveLevel` (rust/lance-jsonb/src/jsonpath/path.rs:140-140), `check_recursive_level` (rust/lance-jsonb/src/jsonpath/path.rs:159-159).

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/jsonpath/path.rs` | 1-536 | mapped |

### `rust/lance-jsonb/src/jsonpath/selector.rs`

Parses and evaluates JSONPath against local binary values; path AST and selector execution share the local JSONB representation. File role: selector.

Key declarations: `Selector` (rust/lance-jsonb/src/jsonpath/selector.rs:81-81), `new` (rust/lance-jsonb/src/jsonpath/selector.rs:94-94), `select_values` (rust/lance-jsonb/src/jsonpath/selector.rs:137-137), `select_value` (rust/lance-jsonb/src/jsonpath/selector.rs:191-191), `exists` (rust/lance-jsonb/src/jsonpath/selector.rs:248-248).

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/jsonpath/selector.rs` | 1-893 | mapped |

### `rust/lance-jsonb/src/lib.rs`

Public parse/owned/raw/value/number/error and extension boundaries for Lance-owned persisted JSONB values. File role: lib.

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/lib.rs` | 1-103 | key-file |

[Focused Key File](../L2-files/rust/lance-jsonb/src/lib.rs.md).
Owns the interface described above.
Callers must enforce its contract before modifying helper implementations.
Verified ranges are explicit in the focused record; other bodies remain mapped.

### `rust/lance-jsonb/src/number.rs`

Public parse/owned/raw/value/number/error and extension boundaries for Lance-owned persisted JSONB values. File role: number.

Key declarations: `Decimal64` (rust/lance-jsonb/src/number.rs:123-123), `to_float64` (rust/lance-jsonb/src/number.rs:135-135), `Decimal128` (rust/lance-jsonb/src/number.rs:147-147), `to_float64` (rust/lance-jsonb/src/number.rs:159-159), `Decimal256` (rust/lance-jsonb/src/number.rs:172-172), `to_float64` (rust/lance-jsonb/src/number.rs:184-184), `Number` (rust/lance-jsonb/src/number.rs:201-201), `as_i64` (rust/lance-jsonb/src/number.rs:297-297).

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/number.rs` | 1-1319 | mapped |

### `rust/lance-jsonb/src/owned.rs`

Public parse/owned/raw/value/number/error and extension boundaries for Lance-owned persisted JSONB values. File role: owned.

Key declarations: `OwnedJsonb` (rust/lance-jsonb/src/owned.rs:21-21), `new` (rust/lance-jsonb/src/owned.rs:36-36), `as_raw` (rust/lance-jsonb/src/owned.rs:47-47), `to_vec` (rust/lance-jsonb/src/owned.rs:56-56).

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/owned.rs` | 1-146 | mapped |

### `rust/lance-jsonb/src/parser.rs`

Public parse/owned/raw/value/number/error and extension boundaries for Lance-owned persisted JSONB values. File role: parser.

Key declarations: `JsonAst` (rust/lance-jsonb/src/parser.rs:63-63), `parse_value` (rust/lance-jsonb/src/parser.rs:110-110).

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/parser.rs` | 1-926 | mapped |

### `rust/lance-jsonb/src/raw.rs`

Public parse/owned/raw/value/number/error and extension boundaries for Lance-owned persisted JSONB values. File role: raw.

Key declarations: `RawJsonb` (rust/lance-jsonb/src/raw.rs:23-23), `new` (rust/lance-jsonb/src/raw.rs:38-38), `len` (rust/lance-jsonb/src/raw.rs:47-47), `to_owned` (rust/lance-jsonb/src/raw.rs:60-60), `to_string` (rust/lance-jsonb/src/raw.rs:107-107), `from_raw_jsonb` (rust/lance-jsonb/src/raw.rs:296-296).

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/raw.rs` | 1-308 | mapped |

### `rust/lance-jsonb/src/util.rs`

Public parse/owned/raw/value/number/error and extension boundaries for Lance-owned persisted JSONB values. File role: util.

Key declarations: `parse_string` (rust/lance-jsonb/src/util.rs:34-34).

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/util.rs` | 1-224 | mapped |

### `rust/lance-jsonb/src/value.rs`

Public parse/owned/raw/value/number/error and extension boundaries for Lance-owned persisted JSONB values. File role: value.

Key declarations: `Object` (rust/lance-jsonb/src/value.rs:23-23), `Value` (rust/lance-jsonb/src/value.rs:33-33), `write_to_vec` (rust/lance-jsonb/src/value.rs:219-219), `to_vec` (rust/lance-jsonb/src/value.rs:225-225).

| Source | Production reading ranges | Status |
|---|---|---|
| `rust/lance-jsonb/src/value.rs` | 1-257 | mapped |

