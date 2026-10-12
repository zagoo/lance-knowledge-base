> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-core/src/cache/backend_uri.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `88e25fdc46723ea2b3e20d08a0b7d9cdeaa305d7e981ce5835d9b10bd4c34d40`. Reviewed physical lines: 1-265.

[Module](../../../../../L1-modules/rust-lance-core-cache.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public compact URI parser into BackendConfig and synchronous registered-backend construction, with private framing and percent-decoding helpers. (rust/lance-core/src/cache/backend_uri.rs:1-265)

## Complete range analysis

### Lines 1-37

SPDX/docs motivate one-string config for bindings and give a subset grammar. Scheme maps to kind; nonempty hierarchy stripped of initial// becomes path option; query pairs percent-decode and reject duplicate keys. Doc phrase path wins means a conflicting query path errors, not successful precedence replacement. Host/port/path remains one backend-defined string. (rust/lance-core/src/cache/backend_uri.rs:1-37)

### Lines 38-55

Imports Arc, backend trait, BackendConfig/build_from_config/normalizer and core Error/Result. Public build_from_uri parses then builds synchronously using ?, returning Arc<dyn CacheBackend> or parse/unknown-constructor/constructor errors without another wrapper here. (rust/lance-core/src/cache/backend_uri.rs:38-55)

### Lines 56-69

parse_backend_uri splits scheme and first? then constructs a normalized BackendConfig. normalize_path result is inserted as path only if nonempty. Path bytes are not percent-decoded, canonicalized or validated here. Scheme normalization occurs once in split_scheme and again through BackendConfig::new. (rust/lance-core/src/cache/backend_uri.rs:56-69)

### Lines 70-80

If query exists, split on&, skipping every empty pair (including leading/trailing/repeated separators). Each nonempty pair requires first= delimiter; extra= bytes stay in value. Empty key and empty value are accepted when delimiter exists. Missing= returns InvalidInput including full URI and offending raw pair. (rust/lance-core/src/cache/backend_uri.rs:70-80)

### Lines 81-104

Percent-decode key then value, wrapping decoder failures as InvalidInput with full URI, raw component and decoder text. Reject duplicate decoded keys, including a nonempty hierarchy's reserved path key; no second value replaces first. Options are case-sensitive HashMap strings. Successful parse has no registry lookup; arbitrary valid schemes/options are retained. Error text can echo sensitive URI query values. (rust/lance-core/src/cache/backend_uri.rs:81-104)

### Lines 105-115

split_scheme finds first colon, errors if absent, normalizes prefix using registry syntax (ASCII-letter first, allowed subsequent ASCII alnum/+-.) and nests normalization errors with full URI. Remainder after colon is borrowed unchanged, including an empty remainder. No whitespace trimming occurs. (rust/lance-core/src/cache/backend_uri.rs:105-115)

### Lines 116-136

split_path_query uses first? only; later? stays in query. normalize_path removes exactly one leading//, returns empty when that consumes the whole hierarchy, otherwise copies rest. Despite helper comment saying strip authority boilerplate, authority itself is preserved: //host/x becomes host/x; ///tmp becomes /tmp. A hierarchy without// is copied unchanged. No# fragment parsing or path percent decoding occurs. (rust/lance-core/src/cache/backend_uri.rs:116-136)

### Lines 137-160

percent_decode preallocates up to input byte length, scans bytes; percent requires exactly two available hex digits, inserts decoded byte and advances3; all other bytes copy literally including+. Truncated escape reports byte offset; invalid UTF-8 after decoding errors via String::from_utf8. Multi-byte UTF-8 passes if final output valid; %00 can produce NUL. It does not recursively decode a resulting percent sign. (rust/lance-core/src/cache/backend_uri.rs:137-160)

### Lines 161-172

decode_hex_digit accepts0-9,a-f,A-F and reports invalid byte formatted as char otherwise. Invalid hex error lacks explicit numeric offset; the outer parser adds URI and raw key/value context. (rust/lance-core/src/cache/backend_uri.rs:161-172)

### Lines 173-198

cfg(test) imports parent. Authority-only moka URI yields kind moka/capacity raw decimal string and no path. example:///var/lance/cache retains absolute path and capacity10G string; parser does not establish acceptance of10G by any constructor. (rust/lance-core/src/cache/backend_uri.rs:173-198)

### Lines 199-221

Host-style fixture preserves localhost:6379/0 as one path and prefix=lance. Uppercase MOKA fixture lowercases kind. These are parse-only tests with no backend registration or construction. (rust/lance-core/src/cache/backend_uri.rs:199-221)

### Lines 222-239

Percent fixture decodes%2F and%20; a+b%2Bc becomes a+b+c, demonstrating literal+. Trailing& test leaves one capacity option. The implementation also skips interior empty pairs though only trailing case asserted here. (rust/lance-core/src/cache/backend_uri.rs:222-239)

### Lines 240-253

Missing-colon and digit-leading scheme tests assert diagnostic substrings. Empty/non-ASCII/whitespace schemes are not exercised by these tests. (rust/lance-core/src/cache/backend_uri.rs:240-253)

### Lines 254-265

Duplicate raw capacity key and a pair without= assert corresponding errors. No local tests cover percent-decoding failures, decoded-key collisions, path conflict, empty key/value, fragment-looking input or build_from_uri success/failure. These are coverage observations, not reproduced bugs. (rust/lance-core/src/cache/backend_uri.rs:254-265)

## Interaction and interpretation limits

The syntax is explicitly a URI subset, not a full URL parser. Registry implementation is analyzed alongside it; built-in Moka constructor validation is now documented at rust/lance-core/src/cache/moka.rs:328-366; binding consumers remain pending. Tests were read only. No external RFC was consulted. (rust/lance-core/src/cache/backend_uri.rs:4-36; rust/lance-core/src/cache/backend_uri.rs:44-171; rust/lance-core/src/cache/backend_uri.rs:173-265)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! URI-based configuration for cache backends.
    5 | //!
    6 | //! [`build_from_uri`] parses a compact string form such as
    7 | //! `moka://?capacity=1073741824` into a [`BackendConfig`] and hands it to
    8 | //! the registry. This gives Python/Java bindings and configuration files a
    9 | //! single-string representation of a backend without having to expose a
   10 | //! typed builder for every backend.
   11 | //!
   12 | //! Grammar (intentionally a subset of RFC 3986 — Lance only needs a
   13 | //! predictable, unambiguous form):
   14 | //!
   15 | //! ```text
   16 | //! uri     ::= scheme ":" hier ( "?" query )?
   17 | //! scheme  ::= ALPHA ( ALPHA | DIGIT | "+" | "-" | "." )*
   18 | //! hier    ::= "//" authority path?   -- e.g. moka://?..., other:///path?...
   19 | //!           | path                    -- e.g. moka:capacity=...  (rare)
   20 | //! authority ::= *( any char except "/" | "?" )
   21 | //! path    ::= *( any char except "?" )
   22 | //! query   ::= pair ( "&" pair )*
   23 | //! pair    ::= key "=" value          -- both percent-decoded
   24 | //! ```
   25 | //!
   26 | //! Mapping to [`BackendConfig`]:
   27 | //!
   28 | //! * `scheme` becomes `kind`.
   29 | //! * The joined `authority + path` (with any leading `//` stripped) is stored
   30 | //!   under the option key `path` when non-empty. Empty-authority absolute
   31 | //!   paths such as `backend:///tmp/cache` keep their leading `/`; host-style
   32 | //!   paths such as `backend://localhost:6379/0` are stored as
   33 | //!   `localhost:6379/0`. If the query already contains a `path` key, the
   34 | //!   URI-supplied path wins and the parser errors on the conflict.
   35 | //! * Each `key=value` pair from the query becomes an entry in `options`.
   36 | //!   Duplicate keys are rejected.
   37 | 
   38 | use std::sync::Arc;
   39 | 
   40 | use super::backend::CacheBackend;
   41 | use super::registry::{BackendConfig, build_from_config, normalize_backend_kind};
   42 | use crate::{Error, Result};
   43 | 
   44 | /// Parse `uri` into a [`BackendConfig`] and build the backend registered
   45 | /// under its `scheme`.
   46 | ///
   47 | /// Returns an error if:
   48 | /// * the URI cannot be parsed,
   49 | /// * no backend is registered for that scheme, or
   50 | /// * the constructor itself fails.
   51 | pub fn build_from_uri(uri: &str) -> Result<Arc<dyn CacheBackend>> {
   52 |     let config = parse_backend_uri(uri)?;
   53 |     build_from_config(&config)
   54 | }
   55 | 
   56 | /// Parse `uri` into a [`BackendConfig`] without touching the registry.
   57 | ///
   58 | /// See the module docs for the accepted grammar.
   59 | pub fn parse_backend_uri(uri: &str) -> Result<BackendConfig> {
   60 |     let (scheme, rest) = split_scheme(uri)?;
   61 |     let (path, query) = split_path_query(rest);
   62 | 
   63 |     let mut config = BackendConfig::new(&scheme)?;
   64 | 
   65 |     let normalized_path = normalize_path(path);
   66 |     if !normalized_path.is_empty() {
   67 |         config.options.insert("path".to_string(), normalized_path);
   68 |     }
   69 | 
   70 |     if let Some(query) = query {
   71 |         for raw_pair in query.split('&') {
   72 |             if raw_pair.is_empty() {
   73 |                 continue;
   74 |             }
   75 |             let (raw_key, raw_value) = raw_pair.split_once('=').ok_or_else(|| {
   76 |                 Error::invalid_input(format!(
   77 |                     "cache backend uri {:?}: query pair {:?} is missing '='",
   78 |                     uri, raw_pair
   79 |                 ))
   80 |             })?;
   81 |             let key = percent_decode(raw_key).map_err(|err| {
   82 |                 Error::invalid_input(format!(
   83 |                     "cache backend uri {:?}: cannot decode query key {:?}: {}",
   84 |                     uri, raw_key, err
   85 |                 ))
   86 |             })?;
   87 |             let value = percent_decode(raw_value).map_err(|err| {
   88 |                 Error::invalid_input(format!(
   89 |                     "cache backend uri {:?}: cannot decode query value {:?}: {}",
   90 |                     uri, raw_value, err
   91 |                 ))
   92 |             })?;
   93 |             if config.options.contains_key(&key) {
   94 |                 return Err(Error::invalid_input(format!(
   95 |                     "cache backend uri {:?}: option {:?} is set more than once",
   96 |                     uri, key
   97 |                 )));
   98 |             }
   99 |             config.options.insert(key, value);
  100 |         }
  101 |     }
  102 | 
  103 |     Ok(config)
  104 | }
  105 | 
  106 | fn split_scheme(uri: &str) -> Result<(String, &str)> {
  107 |     let colon = uri.find(':').ok_or_else(|| {
  108 |         Error::invalid_input(format!("cache backend uri {:?} is missing ':'", uri))
  109 |     })?;
  110 |     let scheme = &uri[..colon];
  111 |     let scheme = normalize_backend_kind(scheme)
  112 |         .map_err(|err| Error::invalid_input(format!("cache backend uri {:?}: {}", uri, err)))?;
  113 |     Ok((scheme, &uri[colon + 1..]))
  114 | }
  115 | 
  116 | fn split_path_query(rest: &str) -> (&str, Option<&str>) {
  117 |     match rest.split_once('?') {
  118 |         Some((path, query)) => (path, Some(query)),
  119 |         None => (rest, None),
  120 |     }
  121 | }
  122 | 
  123 | /// Strip leading `//authority/` boilerplate and return the useful path
  124 | /// component. Empty authorities (e.g. `moka://`) yield an empty path, while
  125 | /// empty-authority absolute paths (e.g. `disk:///tmp/cache`) retain their
  126 | /// leading slash.
  127 | fn normalize_path(raw: &str) -> String {
  128 |     let Some(without_marker) = raw.strip_prefix("//") else {
  129 |         return raw.to_string();
  130 |     };
  131 |     if without_marker.is_empty() {
  132 |         return String::new();
  133 |     }
  134 |     without_marker.to_string()
  135 | }
  136 | 
  137 | fn percent_decode(input: &str) -> std::result::Result<String, String> {
  138 |     let bytes = input.as_bytes();
  139 |     let mut out = Vec::with_capacity(bytes.len());
  140 |     let mut i = 0;
  141 |     while i < bytes.len() {
  142 |         match bytes[i] {
  143 |             b'%' => {
  144 |                 if i + 2 >= bytes.len() {
  145 |                     return Err(format!("truncated percent-escape at offset {}", i));
  146 |                 }
  147 |                 let hi = decode_hex_digit(bytes[i + 1])?;
  148 |                 let lo = decode_hex_digit(bytes[i + 2])?;
  149 |                 out.push((hi << 4) | lo);
  150 |                 i += 3;
  151 |             }
  152 |             b => {
  153 |                 out.push(b);
  154 |                 i += 1;
  155 |             }
  156 |         }
  157 |     }
  158 |     String::from_utf8(out).map_err(|err| err.to_string())
  159 | }
  160 | 
  161 | fn decode_hex_digit(b: u8) -> std::result::Result<u8, String> {
  162 |     match b {
  163 |         b'0'..=b'9' => Ok(b - b'0'),
  164 |         b'a'..=b'f' => Ok(10 + b - b'a'),
  165 |         b'A'..=b'F' => Ok(10 + b - b'A'),
  166 |         _ => Err(format!(
  167 |             "invalid hex digit {:?} in percent-escape",
  168 |             b as char
  169 |         )),
  170 |     }
  171 | }
  172 | 
  173 | #[cfg(test)]
  174 | mod tests {
  175 |     use super::*;
  176 | 
  177 |     #[test]
  178 |     fn test_parse_authority_only() {
  179 |         let cfg = parse_backend_uri("moka://?capacity=1073741824").unwrap();
  180 |         assert_eq!(cfg.kind, "moka");
  181 |         assert_eq!(
  182 |             cfg.options.get("capacity").map(String::as_str),
  183 |             Some("1073741824")
  184 |         );
  185 |         assert!(!cfg.options.contains_key("path"));
  186 |     }
  187 | 
  188 |     #[test]
  189 |     fn test_parse_path_and_query() {
  190 |         let cfg = parse_backend_uri("example:///var/lance/cache?capacity=10G").unwrap();
  191 |         assert_eq!(cfg.kind, "example");
  192 |         assert_eq!(
  193 |             cfg.options.get("path").map(String::as_str),
  194 |             Some("/var/lance/cache")
  195 |         );
  196 |         assert_eq!(cfg.options.get("capacity").map(String::as_str), Some("10G"));
  197 |     }
  198 | 
  199 |     #[test]
  200 |     fn test_parse_host_style() {
  201 |         // Redis-style URI with host:port + path segment. All of it lives
  202 |         // under the "path" option; the backend is responsible for
  203 |         // interpreting it.
  204 |         let cfg = parse_backend_uri("redis://localhost:6379/0?prefix=lance").unwrap();
  205 |         assert_eq!(cfg.kind, "redis");
  206 |         assert_eq!(
  207 |             cfg.options.get("path").map(String::as_str),
  208 |             Some("localhost:6379/0"),
  209 |         );
  210 |         assert_eq!(cfg.options.get("prefix").map(String::as_str), Some("lance"));
  211 |     }
  212 | 
  213 |     #[test]
  214 |     fn test_scheme_is_lowercased() {
  215 |         // Different upper/lower cases must resolve to the same registry
  216 |         // key, otherwise `Moka://` and `moka://` would look up different
  217 |         // backends.
  218 |         let cfg = parse_backend_uri("MOKA://?capacity=1").unwrap();
  219 |         assert_eq!(cfg.kind, "moka");
  220 |     }
  221 | 
  222 |     #[test]
  223 |     fn test_percent_decoding() {
  224 |         let cfg = parse_backend_uri("kv://?prefix=a%2Fb&name=hello%20world&token=a+b%2Bc").unwrap();
  225 |         assert_eq!(cfg.options.get("prefix").map(String::as_str), Some("a/b"));
  226 |         assert_eq!(
  227 |             cfg.options.get("name").map(String::as_str),
  228 |             Some("hello world")
  229 |         );
  230 |         assert_eq!(cfg.options.get("token").map(String::as_str), Some("a+b+c"));
  231 |     }
  232 | 
  233 |     #[test]
  234 |     fn test_empty_query_pair_is_skipped() {
  235 |         // A trailing "&" should not cause a spurious "" pair to appear.
  236 |         let cfg = parse_backend_uri("moka://?capacity=1&").unwrap();
  237 |         assert_eq!(cfg.options.len(), 1);
  238 |     }
  239 | 
  240 |     #[test]
  241 |     fn test_missing_scheme_errors() {
  242 |         let err = parse_backend_uri("no-scheme-here").unwrap_err();
  243 |         assert!(err.to_string().contains("missing ':'"));
  244 |     }
  245 | 
  246 |     #[test]
  247 |     fn test_invalid_scheme_errors() {
  248 |         // Digit-leading schemes are invalid per RFC 3986 and would clash
  249 |         // with URI-like values elsewhere in the config.
  250 |         let err = parse_backend_uri("1moka://").unwrap_err();
  251 |         assert!(err.to_string().contains("must start with an ASCII letter"));
  252 |     }
  253 | 
  254 |     #[test]
  255 |     fn test_duplicate_option_errors() {
  256 |         let err = parse_backend_uri("moka://?capacity=1&capacity=2").unwrap_err();
  257 |         assert!(err.to_string().contains("more than once"));
  258 |     }
  259 | 
  260 |     #[test]
  261 |     fn test_query_pair_without_equals_errors() {
  262 |         let err = parse_backend_uri("moka://?capacity").unwrap_err();
  263 |         assert!(err.to_string().contains("missing '='"));
  264 |     }
  265 | }
``````
