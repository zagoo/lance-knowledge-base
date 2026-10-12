> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-core/src/utils/parse.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `4c04aa2fb2b4c5098142f35edec6bb817920e5c0c88336068198a28b2f01b423`. Reviewed physical lines: 1-83.

[Module](../../../../../L1-modules/rust-lance-core.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public permissive boolean-string and environment parsing helpers. The strict Option parser and defaulted environment parser deliberately have different handling of unknown strings and whitespace. (rust/lance-core/src/utils/parse.rs:1-83)

## Complete range analysis

### Lines 1-12

SPDX and public str_is_truthy(val:&str)->bool: ASCII-case-insensitive matches for 1, true, on, yes and y. Comparisons use boolean bitwise OR, so all five are evaluated, not short-circuited. Input is not trimmed here; every unrecognized string, including recognized words with surrounding whitespace, returns false. (rust/lance-core/src/utils/parse.rs:1-12)

### Lines 13-32

Public str_to_bool(val:&str)->Option<bool> returns Some(true) through str_is_truthy; otherwise recognizes 0, false, off, no, n case-insensitively via short-circuit OR and returns Some(false). Any other value returns None. No whitespace trimming, locale-specific comparison, error allocation or environment read occurs in this function. (rust/lance-core/src/utils/parse.rs:13-32)

### Lines 33-44

Public parse_env_as_bool(env_var_name:&str,default_value:bool)->bool calls std::env::var().ok(); a successful value is trimmed then passed to str_is_truthy, and only an env read error uses default_value. A set-but-unrecognized string or empty/whitespace-only string returns false even when the default is true. Missing or non-Unicode env values use the default. This helper does not call str_to_bool and does not reject invalid settings. (rust/lance-core/src/utils/parse.rs:33-44)

### Lines 45-62

Private test_str_to_bool_truthy loops over ten numeric/lowercase/uppercase/titlecase true spellings, checking Some(true). It exercises the helper indirectly through str_to_bool and does not test direct whitespace behavior. (rust/lance-core/src/utils/parse.rs:45-62)

### Lines 63-76

test_str_to_bool_falsy loops over ten 0/false/off/no/n case variants and checks Some(false). These tests establish source intent for accepted negative words rather than treating any unknown as an explicit false token. (rust/lance-core/src/utils/parse.rs:63-76)

### Lines 77-83

test_str_to_bool_unknown checks empty string, 2, maybe, truthy and nonsense yield None. No test here mutates process environment or checks parse_env_as_bool default/non-Unicode/trim behavior. Tests were read but not run. (rust/lance-core/src/utils/parse.rs:77-83)

## Interaction and interpretation limits

Local call edges are str_to_bool -> str_is_truthy and parse_env_as_bool -> std::env::var/trim/str_is_truthy (rust/lance-core/src/utils/parse.rs:5-42). Do not substitute the Option parser into the env helper without deciding whether invalid-but-present values must keep returning false. Whole-repository callers remain pending.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | /// Parse a string into a boolean value.
    5 | pub fn str_is_truthy(val: &str) -> bool {
    6 |     val.eq_ignore_ascii_case("1")
    7 |         | val.eq_ignore_ascii_case("true")
    8 |         | val.eq_ignore_ascii_case("on")
    9 |         | val.eq_ignore_ascii_case("yes")
   10 |         | val.eq_ignore_ascii_case("y")
   11 | }
   12 | 
   13 | /// Parse a string into an optional boolean value.
   14 | ///
   15 | /// Returns `Some(true)` for truthy values (1/true/on/yes/y, case-insensitive).
   16 | /// Returns `Some(false)` for falsy values (0/false/off/no/n, case-insensitive).
   17 | /// Returns `None` for unrecognized values.
   18 | pub fn str_to_bool(val: &str) -> Option<bool> {
   19 |     if str_is_truthy(val) {
   20 |         Some(true)
   21 |     } else if val.eq_ignore_ascii_case("0")
   22 |         || val.eq_ignore_ascii_case("false")
   23 |         || val.eq_ignore_ascii_case("off")
   24 |         || val.eq_ignore_ascii_case("no")
   25 |         || val.eq_ignore_ascii_case("n")
   26 |     {
   27 |         Some(false)
   28 |     } else {
   29 |         None
   30 |     }
   31 | }
   32 | 
   33 | /// Parse an environment variable as a truthy-only boolean.
   34 | ///
   35 | /// Returns `default_value` if the env var is not set.
   36 | /// Returns `true` only for truthy values (1/true/on/yes/y, case-insensitive).
   37 | /// Returns `false` for all other set values.
   38 | pub fn parse_env_as_bool(env_var_name: &str, default_value: bool) -> bool {
   39 |     std::env::var(env_var_name)
   40 |         .ok()
   41 |         .map(|value| str_is_truthy(value.trim()))
   42 |         .unwrap_or(default_value)
   43 | }
   44 | 
   45 | #[cfg(test)]
   46 | mod tests {
   47 |     use super::*;
   48 | 
   49 |     #[test]
   50 |     fn test_str_to_bool_truthy() {
   51 |         for val in [
   52 |             "1", "true", "True", "TRUE", "on", "ON", "yes", "YES", "y", "Y",
   53 |         ] {
   54 |             assert_eq!(
   55 |                 str_to_bool(val),
   56 |                 Some(true),
   57 |                 "expected Some(true) for {:?}",
   58 |                 val
   59 |             );
   60 |         }
   61 |     }
   62 | 
   63 |     #[test]
   64 |     fn test_str_to_bool_falsy() {
   65 |         for val in [
   66 |             "0", "false", "False", "FALSE", "off", "OFF", "no", "NO", "n", "N",
   67 |         ] {
   68 |             assert_eq!(
   69 |                 str_to_bool(val),
   70 |                 Some(false),
   71 |                 "expected Some(false) for {:?}",
   72 |                 val
   73 |             );
   74 |         }
   75 |     }
   76 | 
   77 |     #[test]
   78 |     fn test_str_to_bool_unknown() {
   79 |         for val in ["", "2", "maybe", "truthy", "nonsense"] {
   80 |             assert_eq!(str_to_bool(val), None, "expected None for {:?}", val);
   81 |         }
   82 |     }
   83 | }
``````
