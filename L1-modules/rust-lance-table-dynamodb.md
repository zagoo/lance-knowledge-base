> **V2.1 navigation and contract layer.** Source reading is permitted. Production contracts retained from iteration 85 remain valid at the recorded snapshot. Historical line-count/test-coverage statements are provenance, not completeness requirements. Use [V2.1 protocol](../V21-PROTOCOL.md) and CORE-MANIFEST.json for current scope.

# DynamoDB external manifest store

All 586 lines are covered. [Table](rust-lance-table.md) · [Commit factory](rust-lance-table-commit.md) · [Generic external protocol](rust-lance-table-external-commit.md) · [Exact source](../L2-files/rust/lance-table/src/io/commit/dynamodb.rs.md) · [Contracts](../L3-symbols/behavior-contracts.md).

DynamoDBExternalManifestStore implements the generic external-manifest record protocol. It issues conditional writes and strongly consistent lookups, while ExternalManifestCommitHandler performs object staging, copying, repair and error classification. It supplies no predecessor identities or authoritative custom history listing: default support=false, identity=None, list_versions=None and forget_version=NotSupported remain inherited. It does not write/delete manifest objects itself. (rust/lance-table/src/io/commit/dynamodb.rs:267-513; rust/lance-table/src/io/commit/external_manifest.rs:216-368)

## API and configuration

| Symbol relative to lance_table::io::commit::dynamodb | Kind | Exact declaration | Evidence |
|---|---|---|---|
| `DynamoDBExternalManifestStore` | struct | `pub struct DynamoDBExternalManifestStore {` | [rust/lance-table/src/io/commit/dynamodb.rs:111-111](../L2-files/rust/lance-table/src/io/commit/dynamodb.rs.md) |
| `DynamoDBExternalManifestStore::new_external_store` | async function | `pub async fn new_external_store(         client: Arc<Client>,         table_name: &str,         committer_name: &str,     ) -> Result<Arc<dyn ExternalManifestStore>> {` | [rust/lance-table/src/io/commit/dynamodb.rs:163-167](../L2-files/rust/lance-table/src/io/commit/dynamodb.rs.md) |
| `<DynamoDBExternalManifestStore as ExternalManifestStore>` | implementation | `impl ExternalManifestStore for DynamoDBExternalManifestStore {` | [rust/lance-table/src/io/commit/dynamodb.rs:268-268](../L2-files/rust/lance-table/src/io/commit/dynamodb.rs.md) |
| `<DynamoDBExternalManifestStore as ExternalManifestStore>::get` | async function | `async fn get(&self, base_uri: &str, version: u64) -> Result<String> {` | [rust/lance-table/src/io/commit/dynamodb.rs:270-270](../L2-files/rust/lance-table/src/io/commit/dynamodb.rs.md) |
| `<DynamoDBExternalManifestStore as ExternalManifestStore>::get_manifest_location` | async function | `async fn get_manifest_location(         &self,         base_uri: &str,         version: u64,     ) -> Result<ManifestLocation> {` | [rust/lance-table/src/io/commit/dynamodb.rs:299-303](../L2-files/rust/lance-table/src/io/commit/dynamodb.rs.md) |
| `<DynamoDBExternalManifestStore as ExternalManifestStore>::get_latest_version` | async function | `async fn get_latest_version(&self, base_uri: &str) -> Result<Option<(u64, String)>> {` | [rust/lance-table/src/io/commit/dynamodb.rs:346-346](../L2-files/rust/lance-table/src/io/commit/dynamodb.rs.md) |
| `<DynamoDBExternalManifestStore as ExternalManifestStore>::get_latest_manifest_location` | async function | `async fn get_latest_manifest_location(         &self,         base_uri: &str,     ) -> Result<Option<ManifestLocation>> {` | [rust/lance-table/src/io/commit/dynamodb.rs:352-355](../L2-files/rust/lance-table/src/io/commit/dynamodb.rs.md) |
| `<DynamoDBExternalManifestStore as ExternalManifestStore>::put_if_not_exists` | async function | `async fn put_if_not_exists(         &self,         base_uri: &str,         version: u64,         path: &str,         size: u64,         _e_tag: Option<String>,     ) -> Result<()> {` | [rust/lance-table/src/io/commit/dynamodb.rs:424-431](../L2-files/rust/lance-table/src/io/commit/dynamodb.rs.md) |
| `<DynamoDBExternalManifestStore as ExternalManifestStore>::put_if_exists` | async function | `async fn put_if_exists(         &self,         base_uri: &str,         version: u64,         path: &str,         size: u64,         _e_tag: Option<String>,     ) -> Result<()> {` | [rust/lance-table/src/io/commit/dynamodb.rs:457-464](../L2-files/rust/lance-table/src/io/commit/dynamodb.rs.md) |
| `<DynamoDBExternalManifestStore as ExternalManifestStore>::delete` | async function | `async fn delete(&self, base_uri: &str) -> Result<()> {` | [rust/lance-table/src/io/commit/dynamodb.rs:487-487](../L2-files/rust/lance-table/src/io/commit/dynamodb.rs.md) |

The parent dynamodb feature enables aws-sdk-dynamodb, aws-credential-types and lance-io/aws; the SDK dependency disables default features and enables default-https-client/rt-tokio. Parent s3+ddb routing constructs the external handler. Its SDK builder uses region, supplied credential adapter, no SDK identity cache, standard retry configuration with five total attempts, and optional endpoint. Storage option dynamodb_endpoint takes priority over DYNAMODB_ENDPOINT; the constructed committer is lancedb. Credential adaptation supplies an expiry ten minutes from observation. These are configured values, not measured service guarantees. (rust/lance-table/Cargo.toml:26-28; rust/lance-table/Cargo.toml:63-63; rust/lance-table/src/io/commit.rs:1103-1169; rust/lance-table/src/io/commit.rs:1210-1272)

new_external_store accepts an already configured Arc<Client>, table name and committer name, returning Arc<dyn ExternalManifestStore>. It creates no table. A process-static successful-schema-check cache is keyed ONLY by table-name string, with no client/endpoint/account/region component, expiration or invalidation. A cache hit skips DescribeTable, including after same-named table recreation; concurrent misses can issue duplicate describes. (rust/lance-table/src/io/commit/dynamodb.rs:162-242)

The constructor pops two key-schema elements, requires HASH/base_uri and RANGE/version and rejects unknown/missing roles. It neither inspects leftover elements nor checks AttributeDefinitions scalar types. Thus the documented string/numeric schema is an operational contract beyond this local check. No cache lock spans network IO. (rust/lance-table/src/io/commit/dynamodb.rs:93-109; rust/lance-table/src/io/commit/dynamodb.rs:184-242)

## External row contract

| Attribute | Request/reader contract |
|---|---|
| base_uri | String partition key, caller supplied verbatim |
| version | Numeric sort key containing decimal u64 |
| path | String selected staging or canonical object path |
| committer | String from store construction, overwritten by each put helper |
| size | Numeric u64; absent old rows return unknown, malformed present values fail |
| e_tag | Never emitted by these writers; legacy stored values ignored |
| identity | No field/token produced by this implementation |

Exact keys and write/read evidence: rust/lance-table/src/io/commit/dynamodb.rs:117-160; rust/lance-table/src/io/commit/dynamodb.rs:267-343; rust/lance-table/src/io/commit/dynamodb.rs:423-484. This is a DynamoDB attribute contract, not a new Lance data-file encoding.

Both put helpers send a five-field PutItem. New reservation requires attribute_not_exists(base_uri) AND attribute_not_exists(version); compaction requires both exist. The latter has no old-path, committer, ETag or incarnation condition. Omitting ETag from a replacement item intentionally clears legacy generations under PutItem semantics. Coordination correctness relies on all generic helpers copying the same selected immutable staging bytes and one dataset incarnation owning the prefix. (rust/lance-table/src/io/commit/dynamodb.rs:423-484; rust/lance-table/src/io/commit/external_manifest.rs:117-161)

## Reads, errors and deletion

GetItem and Query builders always request consistent_read(true). Exact get returns path alone without size validation; get_manifest_location validates optional size and classifies path, returning requested version with ETag/identity None. Missing item/path is NotFound; wrong attribute type or malformed numeric text is InvalidInput. No HEAD or manifest decode is performed here. Parent generic resolver supplies current physical metadata and repair. (rust/lance-table/src/io/commit/dynamodb.rs:244-343; rust/lance-table/src/io/commit/external_manifest.rs:568-893)

Latest lookup queries one partition in descending sort-key order with limit 1. Absent/empty items return None; more than one is rejected. Missing version/path is NotFound, malformed size fails before version/path type matching, and version must parse as u64. No attached/detached filter is applied. get_latest_version delegates to the richer method, so even path/version-only callers encounter malformed size errors. (rust/lance-table/src/io/commit/dynamodb.rs:345-421)

Every SDK failure, including conditional-check failure, is warned with request ID and wrapped as core IO. The wrapper keeps the SDK source chain, and Display includes request ID/raw response or no service error. This module does not directly produce CommitConflict from failed conditional requests; ExternalManifestCommitHandler's put-error path does that later and may retain selected staging after an ambiguous error. (rust/lance-table/src/io/commit/dynamodb.rs:33-91; rust/lance-table/src/io/commit/dynamodb.rs:423-484; rust/lance-table/src/io/commit/external_manifest.rs:990-1011; rust/lance-table/src/io/commit/external_manifest.rs:1123-1149)

delete issues ONE query, then sequential unconditional DeleteItem calls for rows whose version attribute is numeric. It ignores pagination and silently skips missing/wrong-type version attributes. Failure can leave a partially deleted set; concurrent replacement is not identity-fenced. It does not remove physical files or invalidate schema-check cache. Consequently this function alone does not establish complete atomic deletion of an arbitrarily large dataset partition. (rust/lance-table/src/io/commit/dynamodb.rs:486-513)

## Evidence and extension limits

Local tests cover only size parsing: absent, 0/1/4096/u64::MAX, malformed numeric strings and wrong S/Bool/Null attributes. They assert message substrings, not SDK behavior or actual service calls. Schema-cache keys, conditions, pagination, cloud retries and recreation races have no local tests here. No tests or network requests were run. (rust/lance-table/src/io/commit/dynamodb.rs:515-586)

Changes to this backend must coordinate the five-field request schema and inherited generic publication/repair semantics. Adding predecessor support requires the entire identity/location/history/retirement contract, not just one conditional expression. Full Dataset retry/cleanup orchestration and namespace-backed stores remain pending. (rust/lance-table/src/io/commit/external_manifest.rs:286-335; rust/lance-table/src/io/commit/dynamodb.rs:267-513)
