> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md).

# rust/lance-file/src/version.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `37f1d54d63b30ae97b1b94b1907264205146693fc7dcfdba3a407cdd12d1e5ff`. Reviewed physical lines: 1-430.

[Module](../../../../L1-modules/rust-lance-file.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Public file-version request selectors, exact persisted identities, numeric/string codecs and local alias tests. (rust/lance-file/src/version.rs:1-430)

## Complete range analysis

### Lines 1-18

SPDX and Display/Formatter/FromStr, core DeepSizeOf/Error/Result and serde imports. Public canonical string constants are LEGACY_FORMAT_VERSION=0.1, V2_FORMAT_2_0=2.0, V2_FORMAT_2_1=2.1, V2_FORMAT_2_2=2.2 and V2_FORMAT_2_3=2.3. These string identities are distinct from footer numeric aliases. (rust/lance-file/src/version.rs:1-18)

### Lines 19-28

Public const policy functions resolve stable_file_version to exact V2_2 and next_file_version to exact V2_3. This is the checked-out code policy, not external release verification or a complete list of format capabilities. No environment/configuration input changes these results. (rust/lance-file/src/version.rs:19-28)

### Lines 29-51

LanceFileVersion is caller-facing Debug/Default/Clone/Copy/PartialEq/Eq enum: Legacy,V2_0,V2_1,Stable,V2_2,Next,V2_3. Default attribute is on exact V2_2, not Stable. Stable/Next are release selectors documented to resolve before dispatch and never enter persisted identities; this enum alone does not enforce all callers. No ordering or Hash derive. (rust/lance-file/src/version.rs:29-51)

### Lines 52-57

DeepSizeOf for selector returns0 children because it owns no heap. Outer trait accounts inline enum storage. (rust/lance-file/src/version.rs:52-57)

### Lines 58-77

resolve maps every exact selector directly, Legacy to V1 and policy selectors through stable/next helpers. is_unstable delegates to resolved ConcreteFileVersion. Both methods are const, consume Copy self and perform no IO or mutation. (rust/lance-file/src/version.rs:58-77)

### Lines 78-91

Display writes canonical exact string for Legacy/V2 variants, but literal stable/next for policy selectors. It preserves selector intent rather than resolving it; formatter errors propagate. (rust/lance-file/src/version.rs:78-91)

### Lines 92-108

FromStr lowercases the complete input without trimming. Accepts0.1 or legacy -> Legacy,2.0 or0.3 ->V2_0,2.1/2.2/2.3 exact, stable/next selectors. Other input returns unknown_version using original value. Thus mixed-case textual aliases work, whitespace and0.2 are not accepted; allocated lowercase String is transient. (rust/lance-file/src/version.rs:92-108)

### Lines 109-127

Serialize uses Display text through serialize_str; Deserialize first requires a String then FromStr, mapping Error through serde custom. Selector serde can therefore retain stable/next and canonicalize legacy/0.3 aliases; it is not the strict manifest identity codec. Serializer/deserializer failures propagate. (rust/lance-file/src/version.rs:109-127)

### Lines 128-146

ConcreteFileVersion is exact Debug/Clone/Copy/PartialEq/Eq/Hash enum V1,V2_0,V2_1,V2_2,V2_3. No Stable/Next, Default, ordering, serde or FromStr implementation is defined for this enum here. Documentation deliberately rejects ordering as a capability proxy. Hash derives enum identity, not a specified persisted wire encoding. (rust/lance-file/src/version.rs:128-146)

### Lines 147-166

Concrete DeepSizeOf returns0 heap children. const to_selector maps V1 to Legacy and each V2 to its exact public variant, never Stable/Next. Converting resolve(Stable) back to_selector yields V2_2 and loses policy intent. (rust/lance-file/src/version.rs:147-166)

### Lines 167-186

is_unstable is true only for V2_3. from_manifest_string matches canonical0.1/2.0/2.1/2.2/2.3 exactly, without case-fold/trim, rejecting caller aliases legacy,0.3,stable,next and all other strings. Error is InvalidInput via unknown_version, not CorruptFile. (rust/lance-file/src/version.rs:167-186)

### Lines 187-197

to_manifest_string returns canonical static string for each exact enum. Paired with strict decoder it roundtrips exact identity, not original accepted numeric/footer spelling. (rust/lance-file/src/version.rs:187-197)

### Lines 198-214

from_data_file_numbers accepts u32 pairs(0,0),(0,1),(0,2)->V1; (0,3) or(2,0)->V2_0; (2,1),(2,2),(2,3)->matching V2. Other pairs reject with formatted major.minor. Comments retain historical omitted/default metadata and v2.0 aliases; successful parse is identity recognition, not a per-file content/capability check. (rust/lance-file/src/version.rs:198-214)

### Lines 215-225

to_data_file_numbers emits canonical u32 pairs: V1(0,2), V2_0(2,0), V2_1(2,1), V2_2(2,2), V2_3(2,3). Legacy numeric input aliases normalize when re-encoded. This is metadata encoding rather than standard v2.0 footer encoding. (rust/lance-file/src/version.rs:215-225)

### Lines 226-240

from_footer_numbers accepts the same pair set as metadata parser but takes u16. V2.0 accepts standard writer(0,3) and embedded/self-described/mini writer(2,0) by documented roles. Rejects unsupported pairs with InvalidInput containing numeric text. No magic, length, page or encoding validation occurs here. (rust/lance-file/src/version.rs:226-240)

### Lines 241-251

to_standard_footer_numbers emits u16 V1(0,2), V2_0(0,3), and remaining V2(2,minor). The v2.0 special case deliberately differs from canonical DataFile metadata. Actual writer invocation paths are not proven by this mapping alone. (rust/lance-file/src/version.rs:241-251)

### Lines 252-263

to_embedded_footer_numbers emits u16 V1(0,2), V2_0(2,0), and V2_1/2/3(2,minor). Only V2_0 differs from standard footer function. No bytes/endian conversion happens until caller serializes these numbers. (rust/lance-file/src/version.rs:252-263)

### Lines 264-273

Concrete Display delegates to to_manifest_string. Private unknown_version accepts impl Display and creates Error::invalid_input_source with Unknown Lance storage version: followed by value. It adds no reader path unless the supplied display value contains one. (rust/lance-file/src/version.rs:264-273)

### Lines 274-290

cfg(test) imports FromStr,ObjectStore,Path,parent items and declares EXACT_VERSIONS array of all five exact variants. It drives codec test loops without claiming externally released fixtures. (rust/lance-file/src/version.rs:274-290)

### Lines 291-308

selector_resolution_is_exact asserts all seven variant mappings and defaultV2_2. It pins current policy explicitly, not relative ordering or semantic capabilities. (rust/lance-file/src/version.rs:291-308)

### Lines 309-327

public_selector_aliases_remain_unchanged asserts nine accepted strings including legacy and0.3 plus selectors. It does not test uppercase/whitespace/invalid input despite FromStr behavior. (rust/lance-file/src/version.rs:309-327)

### Lines 328-342

Manifest codec fixture roundtrips all five exact identities and rejects legacy,0.3,stable,next via is_err only. No exact error variant/text assertions or corrupt file fixture here. (rust/lance-file/src/version.rs:328-342)

### Lines 343-371

DataFile numeric fixture pins canonical output for five variants, decoder roundtrip, all three legacy(0,minor<=2) aliases and(0,3)->V2_0. No unknown/u32 boundary pair case. (rust/lance-file/src/version.rs:343-371)

### Lines 372-410

Footer fixture separately asserts five standard and five embedded output pairs, decodes each, and accepts all legacy footer aliases. It verifies dual v2.0 representations locally without reading actual writer output or historical complete data files. (rust/lance-file/src/version.rs:372-410)

### Lines 411-430

Async version-detection fixture writes8-byte synthetic footers to in-memory ObjectStore: little-endian major0, minors0..2, shared MAGIC, then calls determine_file_version with known size and expects V1. It checks recognizer acceptance only; those files have no pages/schema. Tests were inspected, not executed. (rust/lance-file/src/version.rs:411-430)

## Interaction and interpretation limits

Complete bounded read and authored physical-line coverage. No build, test, benchmark or network execution; delegated implementations remain pending unless separately analyzed.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::{
    5 |     fmt::{Display, Formatter},
    6 |     str::FromStr,
    7 | };
    8 | 
    9 | use lance_core::deepsize::{Context, DeepSizeOf};
   10 | use lance_core::{Error, Result};
   11 | use serde::{Deserialize, Deserializer, Serialize, Serializer};
   12 | 
   13 | pub const LEGACY_FORMAT_VERSION: &str = "0.1";
   14 | pub const V2_FORMAT_2_0: &str = "2.0";
   15 | pub const V2_FORMAT_2_1: &str = "2.1";
   16 | pub const V2_FORMAT_2_2: &str = "2.2";
   17 | pub const V2_FORMAT_2_3: &str = "2.3";
   18 | 
   19 | /// Resolve the current stable release policy to an exact file version.
   20 | pub const fn stable_file_version() -> ConcreteFileVersion {
   21 |     ConcreteFileVersion::V2_2
   22 | }
   23 | 
   24 | /// Resolve the current next release policy to an exact file version.
   25 | pub const fn next_file_version() -> ConcreteFileVersion {
   26 |     ConcreteFileVersion::V2_3
   27 | }
   28 | 
   29 | /// A caller-facing Lance file-version request.
   30 | ///
   31 | /// `Stable` and `Next` are release selectors. They resolve to an exact
   32 | /// [`ConcreteFileVersion`] before file or dataset dispatch and are never persisted.
   33 | #[derive(Debug, Default, Clone, Copy, PartialEq, Eq)]
   34 | pub enum LanceFileVersion {
   35 |     /// The legacy v1 format.
   36 |     Legacy,
   37 |     /// Exact v2.0.
   38 |     V2_0,
   39 |     /// Exact v2.1.
   40 |     V2_1,
   41 |     /// The latest stable release.
   42 |     Stable,
   43 |     /// Exact v2.2 and the current default.
   44 |     #[default]
   45 |     V2_2,
   46 |     /// The latest unstable release.
   47 |     Next,
   48 |     /// Exact v2.3.
   49 |     V2_3,
   50 | }
   51 | 
   52 | impl DeepSizeOf for LanceFileVersion {
   53 |     fn deep_size_of_children(&self, _context: &mut Context) -> usize {
   54 |         0
   55 |     }
   56 | }
   57 | 
   58 | impl LanceFileVersion {
   59 |     /// Resolve this request through the current release policy.
   60 |     pub const fn resolve(self) -> ConcreteFileVersion {
   61 |         match self {
   62 |             Self::Legacy => ConcreteFileVersion::V1,
   63 |             Self::V2_0 => ConcreteFileVersion::V2_0,
   64 |             Self::V2_1 => ConcreteFileVersion::V2_1,
   65 |             Self::Stable => stable_file_version(),
   66 |             Self::V2_2 => ConcreteFileVersion::V2_2,
   67 |             Self::Next => next_file_version(),
   68 |             Self::V2_3 => ConcreteFileVersion::V2_3,
   69 |         }
   70 |     }
   71 | 
   72 |     /// Whether this request resolves to an unstable exact format.
   73 |     pub const fn is_unstable(self) -> bool {
   74 |         self.resolve().is_unstable()
   75 |     }
   76 | }
   77 | 
   78 | impl Display for LanceFileVersion {
   79 |     fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
   80 |         f.write_str(match self {
   81 |             Self::Legacy => LEGACY_FORMAT_VERSION,
   82 |             Self::V2_0 => V2_FORMAT_2_0,
   83 |             Self::V2_1 => V2_FORMAT_2_1,
   84 |             Self::V2_2 => V2_FORMAT_2_2,
   85 |             Self::V2_3 => V2_FORMAT_2_3,
   86 |             Self::Stable => "stable",
   87 |             Self::Next => "next",
   88 |         })
   89 |     }
   90 | }
   91 | 
   92 | impl FromStr for LanceFileVersion {
   93 |     type Err = Error;
   94 | 
   95 |     fn from_str(value: &str) -> Result<Self> {
   96 |         match value.to_lowercase().as_str() {
   97 |             LEGACY_FORMAT_VERSION | "legacy" => Ok(Self::Legacy),
   98 |             V2_FORMAT_2_0 | "0.3" => Ok(Self::V2_0),
   99 |             V2_FORMAT_2_1 => Ok(Self::V2_1),
  100 |             V2_FORMAT_2_2 => Ok(Self::V2_2),
  101 |             V2_FORMAT_2_3 => Ok(Self::V2_3),
  102 |             "stable" => Ok(Self::Stable),
  103 |             "next" => Ok(Self::Next),
  104 |             _ => Err(unknown_version(value)),
  105 |         }
  106 |     }
  107 | }
  108 | 
  109 | impl Serialize for LanceFileVersion {
  110 |     fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
  111 |     where
  112 |         S: Serializer,
  113 |     {
  114 |         serializer.serialize_str(&self.to_string())
  115 |     }
  116 | }
  117 | 
  118 | impl<'de> Deserialize<'de> for LanceFileVersion {
  119 |     fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>
  120 |     where
  121 |         D: Deserializer<'de>,
  122 |     {
  123 |         let value = String::deserialize(deserializer)?;
  124 |         Self::from_str(&value).map_err(serde::de::Error::custom)
  125 |     }
  126 | }
  127 | 
  128 | /// The exact persisted identity of a Lance file format.
  129 | ///
  130 | /// Unlike [`LanceFileVersion`], this type cannot represent release selectors such as
  131 | /// `stable` or `next`. Exact versions deliberately have no ordering because format
  132 | /// capabilities are not implied by release order.
  133 | #[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
  134 | pub enum ConcreteFileVersion {
  135 |     /// The legacy v1 file format.
  136 |     V1,
  137 |     /// The v2.0 file format.
  138 |     V2_0,
  139 |     /// The v2.1 file format.
  140 |     V2_1,
  141 |     /// The v2.2 file format.
  142 |     V2_2,
  143 |     /// The v2.3 file format.
  144 |     V2_3,
  145 | }
  146 | 
  147 | impl DeepSizeOf for ConcreteFileVersion {
  148 |     fn deep_size_of_children(&self, _context: &mut Context) -> usize {
  149 |         0
  150 |     }
  151 | }
  152 | 
  153 | impl ConcreteFileVersion {
  154 |     /// Convert this exact identity to the corresponding exact public selector.
  155 |     ///
  156 |     /// This never produces the release selectors `stable` or `next`.
  157 |     pub const fn to_selector(self) -> LanceFileVersion {
  158 |         match self {
  159 |             Self::V1 => LanceFileVersion::Legacy,
  160 |             Self::V2_0 => LanceFileVersion::V2_0,
  161 |             Self::V2_1 => LanceFileVersion::V2_1,
  162 |             Self::V2_2 => LanceFileVersion::V2_2,
  163 |             Self::V2_3 => LanceFileVersion::V2_3,
  164 |         }
  165 |     }
  166 | 
  167 |     /// Whether this exact format is covered only by the unstable release policy.
  168 |     pub const fn is_unstable(self) -> bool {
  169 |         matches!(self, Self::V2_3)
  170 |     }
  171 | 
  172 |     /// Decode the exact version string stored in a dataset manifest.
  173 |     ///
  174 |     /// Public selector aliases such as `legacy`, `0.3`, `stable`, and `next` are
  175 |     /// intentionally rejected because manifests only store canonical exact versions.
  176 |     pub fn from_manifest_string(value: &str) -> Result<Self> {
  177 |         match value {
  178 |             LEGACY_FORMAT_VERSION => Ok(Self::V1),
  179 |             V2_FORMAT_2_0 => Ok(Self::V2_0),
  180 |             V2_FORMAT_2_1 => Ok(Self::V2_1),
  181 |             V2_FORMAT_2_2 => Ok(Self::V2_2),
  182 |             V2_FORMAT_2_3 => Ok(Self::V2_3),
  183 |             _ => Err(unknown_version(value)),
  184 |         }
  185 |     }
  186 | 
  187 |     /// Encode this exact version as the canonical string stored in a dataset manifest.
  188 |     pub const fn to_manifest_string(self) -> &'static str {
  189 |         match self {
  190 |             Self::V1 => LEGACY_FORMAT_VERSION,
  191 |             Self::V2_0 => V2_FORMAT_2_0,
  192 |             Self::V2_1 => V2_FORMAT_2_1,
  193 |             Self::V2_2 => V2_FORMAT_2_2,
  194 |             Self::V2_3 => V2_FORMAT_2_3,
  195 |         }
  196 |     }
  197 | 
  198 |     /// Decode the major/minor version stored in `DataFile` metadata.
  199 |     ///
  200 |     /// Legacy manifests may omit these fields and decode to `(0, 0)`, so all legacy
  201 |     /// v1 number pairs accepted by the historical decoder remain valid inputs. The
  202 |     /// historical generic decoder also accepted the standard v2.0 footer pair `(0, 3)`;
  203 |     /// decoding retains that compatibility while encoding always emits `(2, 0)`.
  204 |     pub fn from_data_file_numbers(major: u32, minor: u32) -> Result<Self> {
  205 |         match (major, minor) {
  206 |             (0, 0..=2) => Ok(Self::V1),
  207 |             (0, 3) | (2, 0) => Ok(Self::V2_0),
  208 |             (2, 1) => Ok(Self::V2_1),
  209 |             (2, 2) => Ok(Self::V2_2),
  210 |             (2, 3) => Ok(Self::V2_3),
  211 |             _ => Err(unknown_version(format_args!("{}.{}", major, minor))),
  212 |         }
  213 |     }
  214 | 
  215 |     /// Encode the canonical major/minor pair stored in `DataFile` metadata.
  216 |     pub const fn to_data_file_numbers(self) -> (u32, u32) {
  217 |         match self {
  218 |             Self::V1 => (0, 2),
  219 |             Self::V2_0 => (2, 0),
  220 |             Self::V2_1 => (2, 1),
  221 |             Self::V2_2 => (2, 2),
  222 |             Self::V2_3 => (2, 3),
  223 |         }
  224 |     }
  225 | 
  226 |     /// Decode the major/minor version stored in a Lance file footer.
  227 |     ///
  228 |     /// V2.0 has two accepted representations: `(0, 3)` from the standard file writer
  229 |     /// and `(2, 0)` from self-described and mini-lance writers.
  230 |     pub fn from_footer_numbers(major: u16, minor: u16) -> Result<Self> {
  231 |         match (major, minor) {
  232 |             (0, 0..=2) => Ok(Self::V1),
  233 |             (0, 3) | (2, 0) => Ok(Self::V2_0),
  234 |             (2, 1) => Ok(Self::V2_1),
  235 |             (2, 2) => Ok(Self::V2_2),
  236 |             (2, 3) => Ok(Self::V2_3),
  237 |             _ => Err(unknown_version(format_args!("{}.{}", major, minor))),
  238 |         }
  239 |     }
  240 | 
  241 |     /// Encode the footer numbers emitted by the standard Lance file writer.
  242 |     pub const fn to_standard_footer_numbers(self) -> (u16, u16) {
  243 |         match self {
  244 |             Self::V1 => (0, 2),
  245 |             Self::V2_0 => (0, 3),
  246 |             Self::V2_1 => (2, 1),
  247 |             Self::V2_2 => (2, 2),
  248 |             Self::V2_3 => (2, 3),
  249 |         }
  250 |     }
  251 | 
  252 |     /// Encode the footer numbers emitted by self-described and mini-lance writers.
  253 |     pub const fn to_embedded_footer_numbers(self) -> (u16, u16) {
  254 |         match self {
  255 |             Self::V1 => (0, 2),
  256 |             Self::V2_0 => (2, 0),
  257 |             Self::V2_1 => (2, 1),
  258 |             Self::V2_2 => (2, 2),
  259 |             Self::V2_3 => (2, 3),
  260 |         }
  261 |     }
  262 | }
  263 | 
  264 | impl Display for ConcreteFileVersion {
  265 |     fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
  266 |         f.write_str(self.to_manifest_string())
  267 |     }
  268 | }
  269 | 
  270 | fn unknown_version(value: impl Display) -> Error {
  271 |     Error::invalid_input_source(format!("Unknown Lance storage version: {}", value).into())
  272 | }
  273 | 
  274 | #[cfg(test)]
  275 | mod tests {
  276 |     use std::str::FromStr;
  277 | 
  278 |     use lance_io::object_store::ObjectStore;
  279 |     use object_store::path::Path;
  280 | 
  281 |     use super::*;
  282 | 
  283 |     const EXACT_VERSIONS: [ConcreteFileVersion; 5] = [
  284 |         ConcreteFileVersion::V1,
  285 |         ConcreteFileVersion::V2_0,
  286 |         ConcreteFileVersion::V2_1,
  287 |         ConcreteFileVersion::V2_2,
  288 |         ConcreteFileVersion::V2_3,
  289 |     ];
  290 | 
  291 |     #[test]
  292 |     fn selector_resolution_is_exact() {
  293 |         let cases = [
  294 |             (LanceFileVersion::Legacy, ConcreteFileVersion::V1),
  295 |             (LanceFileVersion::V2_0, ConcreteFileVersion::V2_0),
  296 |             (LanceFileVersion::V2_1, ConcreteFileVersion::V2_1),
  297 |             (LanceFileVersion::Stable, ConcreteFileVersion::V2_2),
  298 |             (LanceFileVersion::V2_2, ConcreteFileVersion::V2_2),
  299 |             (LanceFileVersion::Next, ConcreteFileVersion::V2_3),
  300 |             (LanceFileVersion::V2_3, ConcreteFileVersion::V2_3),
  301 |         ];
  302 | 
  303 |         for (selector, expected) in cases {
  304 |             assert_eq!(selector.resolve(), expected);
  305 |         }
  306 |         assert_eq!(LanceFileVersion::default(), LanceFileVersion::V2_2);
  307 |     }
  308 | 
  309 |     #[test]
  310 |     fn public_selector_aliases_remain_unchanged() {
  311 |         let cases = [
  312 |             ("0.1", LanceFileVersion::Legacy),
  313 |             ("legacy", LanceFileVersion::Legacy),
  314 |             ("2.0", LanceFileVersion::V2_0),
  315 |             ("0.3", LanceFileVersion::V2_0),
  316 |             ("2.1", LanceFileVersion::V2_1),
  317 |             ("stable", LanceFileVersion::Stable),
  318 |             ("2.2", LanceFileVersion::V2_2),
  319 |             ("next", LanceFileVersion::Next),
  320 |             ("2.3", LanceFileVersion::V2_3),
  321 |         ];
  322 | 
  323 |         for (value, expected) in cases {
  324 |             assert_eq!(LanceFileVersion::from_str(value).unwrap(), expected);
  325 |         }
  326 |     }
  327 | 
  328 |     #[test]
  329 |     fn manifest_codec_only_accepts_canonical_exact_versions() {
  330 |         for version in EXACT_VERSIONS {
  331 |             let encoded = version.to_manifest_string();
  332 |             assert_eq!(
  333 |                 ConcreteFileVersion::from_manifest_string(encoded).unwrap(),
  334 |                 version
  335 |             );
  336 |         }
  337 | 
  338 |         for selector_or_alias in ["legacy", "0.3", "stable", "next"] {
  339 |             assert!(ConcreteFileVersion::from_manifest_string(selector_or_alias).is_err());
  340 |         }
  341 |     }
  342 | 
  343 |     #[test]
  344 |     fn data_file_codec_preserves_wire_numbers() {
  345 |         let cases = [
  346 |             (ConcreteFileVersion::V1, (0, 2)),
  347 |             (ConcreteFileVersion::V2_0, (2, 0)),
  348 |             (ConcreteFileVersion::V2_1, (2, 1)),
  349 |             (ConcreteFileVersion::V2_2, (2, 2)),
  350 |             (ConcreteFileVersion::V2_3, (2, 3)),
  351 |         ];
  352 | 
  353 |         for (version, encoded) in cases {
  354 |             assert_eq!(version.to_data_file_numbers(), encoded);
  355 |             assert_eq!(
  356 |                 ConcreteFileVersion::from_data_file_numbers(encoded.0, encoded.1).unwrap(),
  357 |                 version
  358 |             );
  359 |         }
  360 |         for minor in 0..=2 {
  361 |             assert_eq!(
  362 |                 ConcreteFileVersion::from_data_file_numbers(0, minor).unwrap(),
  363 |                 ConcreteFileVersion::V1
  364 |             );
  365 |         }
  366 |         assert_eq!(
  367 |             ConcreteFileVersion::from_data_file_numbers(0, 3).unwrap(),
  368 |             ConcreteFileVersion::V2_0
  369 |         );
  370 |     }
  371 | 
  372 |     #[test]
  373 |     fn footer_codec_preserves_both_v2_0_writer_representations() {
  374 |         let standard_cases = [
  375 |             (ConcreteFileVersion::V1, (0, 2)),
  376 |             (ConcreteFileVersion::V2_0, (0, 3)),
  377 |             (ConcreteFileVersion::V2_1, (2, 1)),
  378 |             (ConcreteFileVersion::V2_2, (2, 2)),
  379 |             (ConcreteFileVersion::V2_3, (2, 3)),
  380 |         ];
  381 |         let embedded_cases = [
  382 |             (ConcreteFileVersion::V1, (0, 2)),
  383 |             (ConcreteFileVersion::V2_0, (2, 0)),
  384 |             (ConcreteFileVersion::V2_1, (2, 1)),
  385 |             (ConcreteFileVersion::V2_2, (2, 2)),
  386 |             (ConcreteFileVersion::V2_3, (2, 3)),
  387 |         ];
  388 | 
  389 |         for (version, encoded) in standard_cases {
  390 |             assert_eq!(version.to_standard_footer_numbers(), encoded);
  391 |             assert_eq!(
  392 |                 ConcreteFileVersion::from_footer_numbers(encoded.0, encoded.1).unwrap(),
  393 |                 version
  394 |             );
  395 |         }
  396 |         for (version, encoded) in embedded_cases {
  397 |             assert_eq!(version.to_embedded_footer_numbers(), encoded);
  398 |             assert_eq!(
  399 |                 ConcreteFileVersion::from_footer_numbers(encoded.0, encoded.1).unwrap(),
  400 |                 version
  401 |             );
  402 |         }
  403 |         for minor in 0..=2 {
  404 |             assert_eq!(
  405 |                 ConcreteFileVersion::from_footer_numbers(0, minor).unwrap(),
  406 |                 ConcreteFileVersion::V1
  407 |             );
  408 |         }
  409 |     }
  410 | 
  411 |     #[tokio::test]
  412 |     async fn file_version_detection_accepts_all_legacy_footer_aliases() {
  413 |         let object_store = ObjectStore::memory();
  414 |         for minor in 0u16..=2 {
  415 |             let path = Path::from(format!("legacy-{minor}.lance"));
  416 |             let mut footer = Vec::with_capacity(8);
  417 |             footer.extend_from_slice(&0u16.to_le_bytes());
  418 |             footer.extend_from_slice(&minor.to_le_bytes());
  419 |             footer.extend_from_slice(crate::format::MAGIC);
  420 |             object_store.put(&path, &footer).await.unwrap();
  421 | 
  422 |             assert_eq!(
  423 |                 crate::determine_file_version(&object_store, &path, Some(footer.len()))
  424 |                     .await
  425 |                     .unwrap(),
  426 |                 ConcreteFileVersion::V1
  427 |             );
  428 |         }
  429 |     }
  430 | }
``````
