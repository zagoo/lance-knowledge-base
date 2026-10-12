> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md).

# rust/lance-encoding/src/compression_config.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `31b784dbd74b17a47e8de37ea7a6ad6e6d8b0f670f07fb4a3c8765f23c366289`. Reviewed physical lines: 1-299.

[Module](../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Public compression policy records, field/type selection, partial merge and private wildcard matcher; four local tests define selected precedence cases. (rust/lance-encoding/src/compression_config.rs:1-299)

## Complete range analysis

### Lines 1-12

SPDX, module docs for per-column/per-type configuration, HashMap and Arrow DataType imports. No IO, environment access, metadata parsing or codec dispatch here. (rust/lance-encoding/src/compression_config.rs:1-12)

### Lines 13-23

Public BssMode enum derives Debug,Clone,Copy,PartialEq. Off,On,Auto are modes; comments describe floating-point intent, not local type enforcement. No Eq or Default derive. (rust/lance-encoding/src/compression_config.rs:13-23)

### Lines 24-33

Public to_sensitivity(&self)->f32 maps Off0.0,On1.0,Auto0.5 exactly; it does not inspect data or invoke an encoder. (rust/lance-encoding/src/compression_config.rs:24-33)

### Lines 34-44

Public parse(&str)->Option<Self> allocates a lowercase string and accepts only off,on,auto. No trimming: surrounding whitespace is invalid. Invalid input yields None, not an error or automatic Auto. (rust/lance-encoding/src/compression_config.rs:34-44)

### Lines 45-54

Public Debug+Clone+PartialEq CompressionParams contains public columns and types HashMap<String,CompressionFieldParams>. Keys are literal strings, not compiled patterns or Arrow type objects. HashMap iteration gives no configured wildcard priority. (rust/lance-encoding/src/compression_config.rs:45-54)

### Lines 55-74

Public Debug+Clone+PartialEq+Default CompressionFieldParams exposes optional rle_threshold:f64, compression:String, compression_level:i32, bss:BssMode, minichunk_size:i64. Default means all None. RLE docs give 0.0-1.0 and strict run_count<num_values*threshold; compression docs name lz4/zstd/none. No constructor validation rejects out-of-range/NaN thresholds, negative chunk sizes, unknown strings or level/scheme combinations here. (rust/lance-encoding/src/compression_config.rs:55-74)

### Lines 75-83

Public CompressionParams::new returns two empty maps, no default compression assignments or allocations for entries. (rust/lance-encoding/src/compression_config.rs:75-83)

### Lines 84-100

get_field_params borrows config, field name and DataType, creates default params, renders data_type.to_string() for exact type-key lookup and merges that record first. The exact display spelling matters. An exact columns key then merges and prevents the wildcard branch, even if the record has no Some fields. (rust/lance-encoding/src/compression_config.rs:84-100)

### Lines 101-115

Without an exact key, scan columns in HashMap iteration order, merge the first matching pattern and break. No sorting, specificity scoring or combination of several patterns. Overlapping wildcard results therefore have no stable precedence contract. Return owned merged record; input config is not mutated. (rust/lance-encoding/src/compression_config.rs:101-115)

### Lines 116-121

Default for CompressionParams forwards to new; both maps remain empty. (rust/lance-encoding/src/compression_config.rs:116-121)

### Lines 122-142

Public CompressionFieldParams::merge(&mut self,other:&Self) overwrites each field only when other has Some; compression String is cloned. None cannot clear inherited state. For example a scheme override with level=None retains a previously selected level. No cross-field or numeric validation occurs. (rust/lance-encoding/src/compression_config.rs:122-142)

### Lines 143-170

Private matches_pattern(name,pattern)->bool: exact * matches all; otherwise trailing * branch wins and uses literal prefix before one final star; otherwise leading * uses literal suffix after one first star; otherwise split at first embedded * and require prefix,suffix and name.len()>=pattern.len()-1; otherwise exact equality. Lengths are UTF-8 bytes. This is not a general glob: *foo* requires a literal *foo prefix; further stars remain literal. Empty expansion is possible; middle length guard prevents prefix/suffix overlap such as test_name matching test_*_name. (rust/lance-encoding/src/compression_config.rs:143-170)

### Lines 171-192

cfg(test) module and test_pattern_matching assert suffix, prefix, middle-star, universal and exact cases with positives/negatives. Tests include rejection of overlapping prefix/suffix in test_name. They do not cover multiple stars, Unicode, multiple matching map entries or trim behavior. (rust/lance-encoding/src/compression_config.rs:171-192)

### Lines 193-229

test_field_params_merge checks initial None for threshold,scheme,level,bss, then merges threshold0.3/lz4/On and a zstd/level3/Auto overlay with no threshold. It asserts retention of0.3 and replacement of the others; minichunk_size remains None in inputs but is not separately asserted. (rust/lance-encoding/src/compression_config.rs:193-229)

### Lines 230-272

test_get_field_params supplies Int32 default threshold0.5/lz4 and *_id override threshold0.3/zstd/level3. Float32 unmatched field stays unset, ordinary Int32 uses type defaults, and user_id Int32 uses the pattern. This tests only one wildcard candidate. (rust/lance-encoding/src/compression_config.rs:230-272)

### Lines 273-299

test_exact_match_priority gives *_id lz4 and exact user_id zstd, asserting zstd. No test in this file covers empty exact records suppressing wildcard defaults, BssMode parsing/sensitivity, malformed numeric values, inherited level mismatch or mini-chunk merge behavior. All tests were read, not executed. (rust/lance-encoding/src/compression_config.rs:273-299)

## Interaction and interpretation limits

All physical lines were read in bounded source outputs during ANALYZE72. Offline, read-only inspection; no Lance build, test, lint, benchmark, generator or dependency installation ran. Exact declarations are preserved below and in the symbol index. Other files are only covered at cited contextual ranges; no whole-crate completion or runtime validation is implied.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Configuration for compression parameters
    5 | //!
    6 | //! This module provides types for configuring compression strategies
    7 | //! on a per-column or per-type basis using a parameter-driven approach.
    8 | 
    9 | use std::collections::HashMap;
   10 | 
   11 | use arrow_schema::DataType;
   12 | 
   13 | /// Byte stream split encoding mode
   14 | #[derive(Debug, Clone, Copy, PartialEq)]
   15 | pub enum BssMode {
   16 |     /// Never use BSS
   17 |     Off,
   18 |     /// Always use BSS for floating point data
   19 |     On,
   20 |     /// Automatically decide based on data characteristics
   21 |     Auto,
   22 | }
   23 | 
   24 | impl BssMode {
   25 |     /// Convert to internal sensitivity value
   26 |     pub fn to_sensitivity(&self) -> f32 {
   27 |         match self {
   28 |             Self::Off => 0.0,
   29 |             Self::On => 1.0,
   30 |             Self::Auto => 0.5, // Default sensitivity for auto mode
   31 |         }
   32 |     }
   33 | 
   34 |     /// Parse from string
   35 |     pub fn parse(s: &str) -> Option<Self> {
   36 |         match s.to_lowercase().as_str() {
   37 |             "off" => Some(Self::Off),
   38 |             "on" => Some(Self::On),
   39 |             "auto" => Some(Self::Auto),
   40 |             _ => None,
   41 |         }
   42 |     }
   43 | }
   44 | 
   45 | /// Compression parameter configuration
   46 | #[derive(Debug, Clone, PartialEq)]
   47 | pub struct CompressionParams {
   48 |     /// Column-level parameters: column name/pattern -> parameters
   49 |     pub columns: HashMap<String, CompressionFieldParams>,
   50 | 
   51 |     /// Type-level parameters: data type name -> parameters
   52 |     pub types: HashMap<String, CompressionFieldParams>,
   53 | }
   54 | 
   55 | /// Field-level compression parameters
   56 | #[derive(Debug, Clone, PartialEq, Default)]
   57 | pub struct CompressionFieldParams {
   58 |     /// RLE threshold (0.0-1.0)
   59 |     /// When run_count < num_values * threshold, RLE will be used
   60 |     pub rle_threshold: Option<f64>,
   61 | 
   62 |     /// General compression scheme: "lz4", "zstd", "none"
   63 |     pub compression: Option<String>,
   64 | 
   65 |     /// Compression level (only for schemes that support it, e.g., zstd)
   66 |     pub compression_level: Option<i32>,
   67 | 
   68 |     /// Byte stream split mode for floating point data
   69 |     pub bss: Option<BssMode>,
   70 | 
   71 |     /// Minichunk size threshold for encoding
   72 |     pub minichunk_size: Option<i64>,
   73 | }
   74 | 
   75 | impl CompressionParams {
   76 |     /// Create empty compression parameters
   77 |     pub fn new() -> Self {
   78 |         Self {
   79 |             columns: HashMap::new(),
   80 |             types: HashMap::new(),
   81 |         }
   82 |     }
   83 | 
   84 |     /// Get effective parameters for a field (merging type params and column params)
   85 |     pub fn get_field_params(
   86 |         &self,
   87 |         field_name: &str,
   88 |         data_type: &DataType,
   89 |     ) -> CompressionFieldParams {
   90 |         let mut params = CompressionFieldParams::default();
   91 | 
   92 |         // Apply type-level parameters
   93 |         let type_name = data_type.to_string();
   94 |         if let Some(type_params) = self.types.get(&type_name) {
   95 |             params.merge(type_params);
   96 |         }
   97 | 
   98 |         // Apply column-level parameters (highest priority)
   99 |         // First check exact match
  100 |         if let Some(col_params) = self.columns.get(field_name) {
  101 |             params.merge(col_params);
  102 |         } else {
  103 |             // Check pattern matching
  104 |             for (pattern, col_params) in &self.columns {
  105 |                 if matches_pattern(field_name, pattern) {
  106 |                     params.merge(col_params);
  107 |                     break; // Use first matching pattern
  108 |                 }
  109 |             }
  110 |         }
  111 | 
  112 |         params
  113 |     }
  114 | }
  115 | 
  116 | impl Default for CompressionParams {
  117 |     fn default() -> Self {
  118 |         Self::new()
  119 |     }
  120 | }
  121 | 
  122 | impl CompressionFieldParams {
  123 |     /// Merge another CompressionFieldParams, non-None values will override
  124 |     pub fn merge(&mut self, other: &Self) {
  125 |         if other.rle_threshold.is_some() {
  126 |             self.rle_threshold = other.rle_threshold;
  127 |         }
  128 |         if other.compression.is_some() {
  129 |             self.compression = other.compression.clone();
  130 |         }
  131 |         if other.compression_level.is_some() {
  132 |             self.compression_level = other.compression_level;
  133 |         }
  134 |         if other.bss.is_some() {
  135 |             self.bss = other.bss;
  136 |         }
  137 |         if other.minichunk_size.is_some() {
  138 |             self.minichunk_size = other.minichunk_size;
  139 |         }
  140 |     }
  141 | }
  142 | 
  143 | /// Check if a name matches a pattern (supports wildcards)
  144 | fn matches_pattern(name: &str, pattern: &str) -> bool {
  145 |     if pattern == "*" {
  146 |         return true;
  147 |     }
  148 | 
  149 |     if let Some(prefix) = pattern.strip_suffix('*') {
  150 |         return name.starts_with(prefix);
  151 |     }
  152 | 
  153 |     if let Some(suffix) = pattern.strip_prefix('*') {
  154 |         return name.ends_with(suffix);
  155 |     }
  156 | 
  157 |     if pattern.contains('*') {
  158 |         // Simple glob pattern matching (only supports single * in middle)
  159 |         if let Some(pos) = pattern.find('*') {
  160 |             let prefix = &pattern[..pos];
  161 |             let suffix = &pattern[pos + 1..];
  162 |             return name.starts_with(prefix)
  163 |                 && name.ends_with(suffix)
  164 |                 && name.len() >= pattern.len() - 1;
  165 |         }
  166 |     }
  167 | 
  168 |     name == pattern
  169 | }
  170 | 
  171 | #[cfg(test)]
  172 | mod tests {
  173 |     use super::*;
  174 | 
  175 |     #[test]
  176 |     fn test_pattern_matching() {
  177 |         assert!(matches_pattern("user_id", "*_id"));
  178 |         assert!(matches_pattern("product_id", "*_id"));
  179 |         assert!(!matches_pattern("identity", "*_id"));
  180 | 
  181 |         assert!(matches_pattern("log_message", "log_*"));
  182 |         assert!(matches_pattern("log_level", "log_*"));
  183 |         assert!(!matches_pattern("message_log", "log_*"));
  184 | 
  185 |         assert!(matches_pattern("test_field_name", "test_*_name"));
  186 |         assert!(matches_pattern("test_column_name", "test_*_name"));
  187 |         assert!(!matches_pattern("test_name", "test_*_name"));
  188 | 
  189 |         assert!(matches_pattern("anything", "*"));
  190 |         assert!(matches_pattern("exact_match", "exact_match"));
  191 |     }
  192 | 
  193 |     #[test]
  194 |     fn test_field_params_merge() {
  195 |         let mut params = CompressionFieldParams::default();
  196 |         assert_eq!(params.rle_threshold, None);
  197 |         assert_eq!(params.compression, None);
  198 |         assert_eq!(params.compression_level, None);
  199 |         assert_eq!(params.bss, None);
  200 | 
  201 |         let other = CompressionFieldParams {
  202 |             rle_threshold: Some(0.3),
  203 |             compression: Some("lz4".to_string()),
  204 |             compression_level: None,
  205 |             bss: Some(BssMode::On),
  206 |             minichunk_size: None,
  207 |         };
  208 | 
  209 |         params.merge(&other);
  210 |         assert_eq!(params.rle_threshold, Some(0.3));
  211 |         assert_eq!(params.compression, Some("lz4".to_string()));
  212 |         assert_eq!(params.compression_level, None);
  213 |         assert_eq!(params.bss, Some(BssMode::On));
  214 | 
  215 |         let another = CompressionFieldParams {
  216 |             rle_threshold: None,
  217 |             compression: Some("zstd".to_string()),
  218 |             compression_level: Some(3),
  219 |             bss: Some(BssMode::Auto),
  220 |             minichunk_size: None,
  221 |         };
  222 | 
  223 |         params.merge(&another);
  224 |         assert_eq!(params.rle_threshold, Some(0.3)); // Not overridden
  225 |         assert_eq!(params.compression, Some("zstd".to_string())); // Overridden
  226 |         assert_eq!(params.compression_level, Some(3)); // New value
  227 |         assert_eq!(params.bss, Some(BssMode::Auto)); // Overridden
  228 |     }
  229 | 
  230 |     #[test]
  231 |     fn test_get_field_params() {
  232 |         let mut params = CompressionParams::new();
  233 | 
  234 |         // Set type-level params
  235 |         params.types.insert(
  236 |             "Int32".to_string(),
  237 |             CompressionFieldParams {
  238 |                 rle_threshold: Some(0.5),
  239 |                 compression: Some("lz4".to_string()),
  240 |                 ..Default::default()
  241 |             },
  242 |         );
  243 | 
  244 |         // Set column-level params
  245 |         params.columns.insert(
  246 |             "*_id".to_string(),
  247 |             CompressionFieldParams {
  248 |                 rle_threshold: Some(0.3),
  249 |                 compression: Some("zstd".to_string()),
  250 |                 compression_level: Some(3),
  251 |                 bss: None,
  252 |                 minichunk_size: None,
  253 |             },
  254 |         );
  255 | 
  256 |         // Test no match (should get default)
  257 |         let field_params = params.get_field_params("some_field", &DataType::Float32);
  258 |         assert_eq!(field_params.compression, None);
  259 |         assert_eq!(field_params.rle_threshold, None);
  260 | 
  261 |         // Test type match only
  262 |         let field_params = params.get_field_params("some_field", &DataType::Int32);
  263 |         assert_eq!(field_params.compression, Some("lz4".to_string())); // From type
  264 |         assert_eq!(field_params.rle_threshold, Some(0.5)); // From type
  265 | 
  266 |         // Test column override (pattern match)
  267 |         let field_params = params.get_field_params("user_id", &DataType::Int32);
  268 |         assert_eq!(field_params.compression, Some("zstd".to_string())); // From column
  269 |         assert_eq!(field_params.compression_level, Some(3)); // From column
  270 |         assert_eq!(field_params.rle_threshold, Some(0.3)); // From column (overrides type)
  271 |     }
  272 | 
  273 |     #[test]
  274 |     fn test_exact_match_priority() {
  275 |         let mut params = CompressionParams::new();
  276 | 
  277 |         // Add pattern
  278 |         params.columns.insert(
  279 |             "*_id".to_string(),
  280 |             CompressionFieldParams {
  281 |                 compression: Some("lz4".to_string()),
  282 |                 ..Default::default()
  283 |             },
  284 |         );
  285 | 
  286 |         // Add exact match
  287 |         params.columns.insert(
  288 |             "user_id".to_string(),
  289 |             CompressionFieldParams {
  290 |                 compression: Some("zstd".to_string()),
  291 |                 ..Default::default()
  292 |             },
  293 |         );
  294 | 
  295 |         // Exact match should win
  296 |         let field_params = params.get_field_params("user_id", &DataType::Int32);
  297 |         assert_eq!(field_params.compression, Some("zstd".to_string()));
  298 |     }
  299 | }
``````
