> **V2.1 navigation and contract layer.** Source reading is permitted. Production contracts retained from iteration 85 remain valid at the recorded snapshot. Historical line-count/test-coverage statements are provenance, not completeness requirements. Use [V2.1 protocol](../V21-PROTOCOL.md) and CORE-MANIFEST.json for current scope.

# lance-file: file versions and entry points

**Deep local coverage retained — no re-analysis planned.** All 38 currently selected production files have frozen verified L2 records. Historical tests, fixtures and benchmarks are archived. M1 synthesizes the format contract and points to implementation details.

[Orientation](../L0-orientation.md) · [Table metadata](rust-lance-table.md) · [Format](../L3-symbols/format-spec.md) · [Scenarios](../L4-crosscutting/scenarios.md) · [Build/test](../L4-crosscutting/build-and-test.md)

## Responsibility and routes

The crate declares readers/writers for the Lance file format. Its facade exports concat,datatypes,format,reader,testing,version,versions,writer; io is crate-visible with LanceEncodingsIo publicly reexported; compatibility_tests is private under cfg(test). The [runtime-boundary supplement](rust-lance-file-runtime.md) covers schema conversion, IO adaptation, exact dispatch and writer interfaces; the [structural writer supplement](rust-lance-file-structural-writer.md) covers current structural writer lifecycles, and the [V2_0/compatibility supplement](rust-lance-file-v20-compatibility.md) covers the separate array writer and fixture harness. Shared reader loading/cache/projection orchestration is covered in the [shared reader supplement](rust-lance-file-shared-reader.md); V1 foundations and concrete binary/plain/dictionary codecs are covered separately; the [full V1 reader](rust-lance-file-v1-reader.md) is covered. Delegated modern encoding/IO scheduling remain pending. (rust/lance-file/README.md:3-6; rust/lance-file/src/lib.rs:4-17)

```text
lance_file
|-- version: request policy -> exact identity -> metadata/footer codecs
|-- determine_file_version: size -> last8 bytes -> magic -> exact identity
|-- format: generated pb / pbfile, LANC magic and legacy0.2 constants
|-- io: range splitting, empty placeholders and ordered reassembly
|-- datatypes: flat protobuf fields <-> core schema trees
|-- versions: exact dispatch, composition/policies, current reader grammar and all exact V2 writers
|   `-- v1: projection/dictionary dispatch/metadata/page table, concrete codecs, reader/writer and statistics covered
|-- writer: facade/options/type checks and shared structural pipeline covered
|-- reader: full/indexed metadata, cache, projections, read dispatch and tests covered
|-- concat: compatibility, Blob part gates, page relocation and output lifecycle
|-- testing: public local-file/cache helpers, collecting IO
`-- compatibility_tests: private cfg(test), pinned stable bytes / current unstable determinism
```

Routes follow rust/lance-file/src/lib.rs:4-60 and rust/lance-file/src/version.rs:19-262. No capability is inferred from numeric release order.

See [current composition and structural projection](rust-lance-file-composition.md) for ordered version policies and shared metadata contracts.

See [exact reader grammar](rust-lance-file-readers.md) for metadata validation order and version-specific acceptance.

## Caller requests and persisted identities

LanceFileVersion is a caller selector with Legacy,V2_0,V2_1,Stable,V2_2,Next,V2_3. Default is exact V2_2. resolve() maps Stable->V2_2,Next->V2_3 and exact variants to themselves (Legacy->V1). is_unstable is true only after resolving to V2_3. Display/serde preserve stable/next as strings; they are request serialization, not strict persisted identity codecs. (rust/lance-file/src/version.rs:19-127)

FromStr lowercases but does not trim. Accepted aliases are0.1/legacy,2.0/0.3,2.1,2.2,2.3,stable,next. ConcreteFileVersion has only V1,V2_0,V2_1,V2_2,V2_3, derives Hash but no ordering, and has no Default/serde/FromStr implementation here. Strict from_manifest_string accepts canonical0.1/2.0/2.1/2.2/2.3 only. to_selector always produces exact variants, losing prior policy intent. (rust/lance-file/src/version.rs:92-107; rust/lance-file/src/version.rs:128-197)

| Exact identity | Manifest string | DataFile metadata(u32,u32) | Standard footer(u16,u16) | Embedded footer(u16,u16) |
|---|---|---|---|---|
| V1 |0.1 |(0,2) |(0,2) |(0,2) |
| V2_0 |2.0 |(2,0) |(0,3) |(2,0) |
| V2_1 |2.1 |(2,1) |(2,1) |(2,1) |
| V2_2 |2.2 |(2,2) |(2,2) |(2,2) |
| V2_3 |2.3 |(2,3) |(2,3) |(2,3) |

Both numeric decoders accept(0,0..=2) as V1 and(0,3)/(2,0) as V2_0, plus the other listed exact pairs. They reject everything else with InvalidInput Unknown Lance storage version: value. Strict string decoding rejects0.3 even though request parsing and numeric footer alias handling accept their respective historical forms. The table describes mapping functions, not proof every writer calls them. (rust/lance-file/src/version.rs:172-272)

## Footer detection and errors

determine_file_version takes ObjectStore,Path,optional known usize size. If unknown, await store.size and checked-convert; if known, trust it. Reject size<8, await open_with_size and get_range(size-8..size), require footer[4..]==LANC, decode first four bytes as LEu16 major/minor and dispatch exact parser. IO errors propagate; size/magic/version errors are InvalidInput. Fewer than4 returned bytes could panic because no explicit received-length check precedes slicing. (rust/lance-file/src/lib.rs:25-60; rust/lance-file/src/format.rs:30-33)

This reads only the final8 bytes and does not verify pages, schema, full footer structure or data validity. The local async fixture uses synthetic8-byte legacy footers with no data. Known size avoids the explicit size call, but underlying store.open behavior and total request count remain pending. (rust/lance-file/src/lib.rs:30-59; rust/lance-file/src/version.rs:411-430)

## Dependencies, features and build

Package metadata/toolchain/lints inherit workspace. Runtime dependencies declare Lance Arrow/core/encoding/IO, Arrow arithmetic/array/buffer/cast/data/schema/select, async-recursion/async-trait, byteorder/bytes, datafusion-common, futures/log/num-traits, object_store,prost/prost-types,serde,tokio,tracing. Exact dependency versions, transitive features and exhaustive use-site reasons remain pending root/dependency analysis; reviewed code uses core errors/deepsize, serde and store/path types. (rust/lance-file/Cargo.toml:1-40; rust/lance-file/src/version.rs:4-11; rust/lance-file/src/lib.rs:19-23)

Dev dependencies are lance-datagen,lance-testing,criterion,rstest,proptest,pretty_assertions,rand,test-log,libc. Build dependencies prost-build and optional protobuf-src support protoc feature. docs.rs requests that feature; its Ubuntu rationale is a source comment, not a live service check. Reader/schema benches disable the standard harness. (rust/lance-file/Cargo.toml:41-72)

build.rs optionally sets PROTOC through unsafe process-environment mutation, enables proto3 optional, maps .lance.encodings to lance_encoding::format::pb and compiles shared file/file2/encodings_v2_0/encodings_v2_1 schemas. The protos symlink targets ../../protos/. format::pb and pbfile include generated lance.file.rs and lance.file.v2.rs. No build/install was performed. (rust/lance-file/build.rs:1-29; rust/lance-file/protos:1-1; rust/lance-file/src/format.rs:4-28)

## Extension boundary

Keep caller selectors distinct from exact storage identities; a new exact version needs explicit string/data-metadata/standard-footer/embedded-footer mapping and explicit capabilities elsewhere. Do not infer support by ordering, persist Stable/Next in manifests, or collapse the v2.0 footer alias distinction. The local tests pin these mappings but do not establish full historical reader/writer compatibility. Exact reader/writer dispatch and shared type checks are now covered in the runtime-boundary supplement; all exact V2 writer mechanisms and compatibility test/generator sources are now covered. Shared reader orchestration and tests are covered; encoding byte algorithms, delegated IO/decoder scheduling, all six binary fixture payloads are now interpreted; other delegated behavior remains pending. (rust/lance-file/src/version.rs:29-50; rust/lance-file/src/version.rs:128-262; rust/lance-file/src/version.rs:291-430)

## Exact reviewed callable declarations

| Symbol | Exact declaration | Visibility | Evidence |
|---|---|---|---|
| `lance_file::version::stable_file_version` | `pub const fn stable_file_version() -> ConcreteFileVersion {` | public | [rust/lance-file/src/version.rs:20-20](../L2-files/rust/lance-file/src/version.rs.md) |
| `lance_file::version::next_file_version` | `pub const fn next_file_version() -> ConcreteFileVersion {` | public | [rust/lance-file/src/version.rs:25-25](../L2-files/rust/lance-file/src/version.rs.md) |
| `lance_file::version::<LanceFileVersion as DeepSizeOf>::deep_size_of_children` | `    fn deep_size_of_children(&self, _context: &mut Context) -> usize {` | public | [rust/lance-file/src/version.rs:53-53](../L2-files/rust/lance-file/src/version.rs.md) |
| `lance_file::version::LanceFileVersion::resolve` | `    pub const fn resolve(self) -> ConcreteFileVersion {` | public | [rust/lance-file/src/version.rs:60-60](../L2-files/rust/lance-file/src/version.rs.md) |
| `lance_file::version::LanceFileVersion::is_unstable` | `    pub const fn is_unstable(self) -> bool {` | public | [rust/lance-file/src/version.rs:73-73](../L2-files/rust/lance-file/src/version.rs.md) |
| `lance_file::version::<LanceFileVersion as Display>::fmt` | `    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {` | public | [rust/lance-file/src/version.rs:79-79](../L2-files/rust/lance-file/src/version.rs.md) |
| `lance_file::version::<LanceFileVersion as FromStr>::from_str` | `    fn from_str(value: &str) -> Result<Self> {` | public | [rust/lance-file/src/version.rs:95-95](../L2-files/rust/lance-file/src/version.rs.md) |
| `lance_file::version::<LanceFileVersion as Serialize>::serialize` | `    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>     where         S: Serializer,     {` | public | [rust/lance-file/src/version.rs:110-113](../L2-files/rust/lance-file/src/version.rs.md) |
| `lance_file::version::<LanceFileVersion as Deserialize<'de>>::deserialize` | `    fn deserialize<D>(deserializer: D) -> std::result::Result<Self, D::Error>     where         D: Deserializer<'de>,     {` | public | [rust/lance-file/src/version.rs:119-122](../L2-files/rust/lance-file/src/version.rs.md) |
| `lance_file::version::<ConcreteFileVersion as DeepSizeOf>::deep_size_of_children` | `    fn deep_size_of_children(&self, _context: &mut Context) -> usize {` | public | [rust/lance-file/src/version.rs:148-148](../L2-files/rust/lance-file/src/version.rs.md) |
| `lance_file::version::ConcreteFileVersion::to_selector` | `    pub const fn to_selector(self) -> LanceFileVersion {` | public | [rust/lance-file/src/version.rs:157-157](../L2-files/rust/lance-file/src/version.rs.md) |
| `lance_file::version::ConcreteFileVersion::is_unstable` | `    pub const fn is_unstable(self) -> bool {` | public | [rust/lance-file/src/version.rs:168-168](../L2-files/rust/lance-file/src/version.rs.md) |
| `lance_file::version::ConcreteFileVersion::from_manifest_string` | `    pub fn from_manifest_string(value: &str) -> Result<Self> {` | public | [rust/lance-file/src/version.rs:176-176](../L2-files/rust/lance-file/src/version.rs.md) |
| `lance_file::version::ConcreteFileVersion::to_manifest_string` | `    pub const fn to_manifest_string(self) -> &'static str {` | public | [rust/lance-file/src/version.rs:188-188](../L2-files/rust/lance-file/src/version.rs.md) |
| `lance_file::version::ConcreteFileVersion::from_data_file_numbers` | `    pub fn from_data_file_numbers(major: u32, minor: u32) -> Result<Self> {` | public | [rust/lance-file/src/version.rs:204-204](../L2-files/rust/lance-file/src/version.rs.md) |
| `lance_file::version::ConcreteFileVersion::to_data_file_numbers` | `    pub const fn to_data_file_numbers(self) -> (u32, u32) {` | public | [rust/lance-file/src/version.rs:216-216](../L2-files/rust/lance-file/src/version.rs.md) |
| `lance_file::version::ConcreteFileVersion::from_footer_numbers` | `    pub fn from_footer_numbers(major: u16, minor: u16) -> Result<Self> {` | public | [rust/lance-file/src/version.rs:230-230](../L2-files/rust/lance-file/src/version.rs.md) |
| `lance_file::version::ConcreteFileVersion::to_standard_footer_numbers` | `    pub const fn to_standard_footer_numbers(self) -> (u16, u16) {` | public | [rust/lance-file/src/version.rs:242-242](../L2-files/rust/lance-file/src/version.rs.md) |
| `lance_file::version::ConcreteFileVersion::to_embedded_footer_numbers` | `    pub const fn to_embedded_footer_numbers(self) -> (u16, u16) {` | public | [rust/lance-file/src/version.rs:253-253](../L2-files/rust/lance-file/src/version.rs.md) |
| `lance_file::version::<ConcreteFileVersion as Display>::fmt` | `    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {` | public | [rust/lance-file/src/version.rs:265-265](../L2-files/rust/lance-file/src/version.rs.md) |
| `lance_file::version::unknown_version` | `fn unknown_version(value: impl Display) -> Error {` | private | [rust/lance-file/src/version.rs:270-270](../L2-files/rust/lance-file/src/version.rs.md) |
| `lance_file::determine_file_version` | `pub async fn determine_file_version(     store: &ObjectStore,     path: &Path,     known_size: Option<usize>, ) -> Result<ConcreteFileVersion> {` | public | [rust/lance-file/src/lib.rs:25-29](../L2-files/rust/lance-file/src/lib.rs.md) |
| `lance_file::build_script::main` | `fn main() -> Result<()> {` | private | [rust/lance-file/build.rs:6-6](../L2-files/rust/lance-file/build.rs.md) |

The [standard V2_0 fixture](archive/rust-lance-file-standard-v20-fixture.md) now has a complete byte/schema/page contract; V2_2 fixture is now fully interpreted.

The [standard V2_1 fixture](archive/rust-lance-file-standard-v21-fixture.md) is now fully interpreted, including structural levels, FastLanes bits, all 73 mini-blocks and 575 byte regions; V2_2 is now fully interpreted as well; no lance-file inventory entry remains pending.

The [V2_2 complete byte contract](archive/rust-lance-file-standard-v22-fixture.md) closes local lance-file file/line/byte coverage. This does not close delegated encoding/IO, Dataset integration, runtime compatibility qualification or whole-repository acceptance.

Excluded test declarations are retained in the [historical catalog](archive/rust-lance-file-excluded-declarations.md).

## Source refresh map — 2026-10-11

Current source `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`. [Changed contracts](../L3-symbols/refresh-2026-10-11.md). Existing directory responsibilities remain; declarations below locate changed boundaries.

### `rust/lance-file/src/reader.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `BufferDescriptor` (rust/lance-file/src/reader.rs:65-65), `FileStatistics` (rust/lance-file/src/reader.rs:105-105), `ColumnStatistics` (rust/lance-file/src/reader.rs:112-112), `CachedFileMetadata` (rust/lance-file/src/reader.rs:123-123), `file_size` (rust/lance-file/src/reader.rs:165-165), `FileMetadataIndex` (rust/lance-file/src/reader.rs:217-217), `file_size` (rust/lance-file/src/reader.rs:230-230), `num_columns` (rust/lance-file/src/reader.rs:235-235).

### `rust/lance-file/src/versions/v2_1/reader.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `decode_column` (rust/lance-file/src/versions/v2_1/reader.rs:170-170), `decode_column_metadata` (rust/lance-file/src/versions/v2_1/reader.rs:187-187), `projection_from_field_ids` (rust/lance-file/src/versions/v2_1/reader.rs:202-202), `projection_from_whole_schema` (rust/lance-file/src/versions/v2_1/reader.rs:209-209), `projection_from_column_names` (rust/lance-file/src/versions/v2_1/reader.rs:213-213), `finish_metadata` (rust/lance-file/src/versions/v2_1/reader.rs:224-224), `validate_global_buffers` (rust/lance-file/src/versions/v2_1/reader.rs:252-252), `finish_metadata_index` (rust/lance-file/src/versions/v2_1/reader.rs:256-256).

### `rust/lance-file/src/versions/v2_2/reader.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `decode_column` (rust/lance-file/src/versions/v2_2/reader.rs:172-172), `decode_column_metadata` (rust/lance-file/src/versions/v2_2/reader.rs:189-189), `projection_from_field_ids` (rust/lance-file/src/versions/v2_2/reader.rs:204-204), `projection_from_whole_schema` (rust/lance-file/src/versions/v2_2/reader.rs:211-211), `projection_from_column_names` (rust/lance-file/src/versions/v2_2/reader.rs:215-215), `finish_metadata` (rust/lance-file/src/versions/v2_2/reader.rs:226-226), `validate_global_buffers` (rust/lance-file/src/versions/v2_2/reader.rs:254-254), `finish_metadata_index` (rust/lance-file/src/versions/v2_2/reader.rs:258-258).

### `rust/lance-file/src/versions/v2_3/compression.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `Strategy` (rust/lance-file/src/versions/v2_3/compression.rs:23-23), `new` (rust/lance-file/src/versions/v2_3/compression.rs:28-28).

### `rust/lance-file/src/versions/v2_3/reader.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `decode_column` (rust/lance-file/src/versions/v2_3/reader.rs:249-249), `decode_column_metadata` (rust/lance-file/src/versions/v2_3/reader.rs:266-266), `projection_from_field_ids` (rust/lance-file/src/versions/v2_3/reader.rs:281-281), `projection_from_whole_schema` (rust/lance-file/src/versions/v2_3/reader.rs:288-288), `projection_from_column_names` (rust/lance-file/src/versions/v2_3/reader.rs:292-292), `finish_metadata` (rust/lance-file/src/versions/v2_3/reader.rs:303-303), `validate_global_buffers` (rust/lance-file/src/versions/v2_3/reader.rs:331-331), `finish_metadata_index` (rust/lance-file/src/versions/v2_3/reader.rs:335-335).

### `rust/lance-file/src/writer/field_types.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `FieldTypeMismatch` (rust/lance-file/src/writer/field_types.rs:26-26), `ExpectedTypes` (rust/lance-file/src/writer/field_types.rs:68-68), `new` (rust/lance-file/src/writer/field_types.rs:76-76), `check_batch` (rust/lance-file/src/writer/field_types.rs:91-91), `check_column` (rust/lance-file/src/writer/field_types.rs:120-120).

