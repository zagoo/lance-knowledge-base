> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md).

# rust/lance-table/src/io/commit/dynamodb.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `a8cf88d3ca9e4ef1940ce988bf4bfd0e432e69053bd517b3c70ade8dd759ca3f`. Reviewed physical lines: 1-586.

[Module](../../../../../../L1-modules/rust-lance-table-dynamodb.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Feature-gated DynamoDB implementation of ExternalManifestStore, with SDK error adaptation, cached key-schema checks, strongly consistent manifest lookups, conditional full-item publication, dataset-record deletion and size-attribute unit fixtures. (rust/lance-table/src/io/commit/dynamodb.rs:1-586)

## Complete range analysis

### Lines 1-32

SPDX/module introduction and imports connect HashMap/HashSet, Arc/LazyLock, async_trait, DynamoDB SDK client/errors/request IDs/fluent builders/attribute types, Path, Snafu OptionExt, Tokio RwLock, warnings and parent external-manifest types. The dynamodb feature gate is on the parent module declaration; there is no local network client creation in this file. (rust/lance-table/src/io/commit/dynamodb.rs:1-32)

### Lines 33-71

Private Debug WrappedSdkError<E> wraps SdkError<E>. From converts it to core IO with boxed source for E: Error + Send + Sync + static. Display reports request ID or unknown and raw response Debug or no service error; it does not directly display the inner typed service-error message. Error::source preserves the underlying SDK error. Formatter errors propagate. Placeholder explanatory comments have no execution effect. (rust/lance-table/src/io/commit/dynamodb.rs:33-71)

### Lines 72-92

Private SdkResultExt<T>::wrap_err maps any SDK error into WrappedSdkError/core IO after warning at tracing target lance::dynamodb with request ID and full Debug SDK error. Success passes through. There is no conditional-check-failure-to-CommitConflict specialization here; the higher external handler later classifies all put errors. This adapter logs and returns the same failure, without an explicit local retry. (rust/lance-table/src/io/commit/dynamodb.rs:72-92)

### Lines 93-116

Public Debug DynamoDBExternalManifestStore privately holds Arc<Client>, owned table_name and committer_name strings. Docs require base_uri string HASH key, version numeric RANGE key, path/committer strings and strongly consistent reads. They describe conditional-write single-winner intent. Actual constructor checks key names/roles only, not declared attribute scalar types or full schema cardinality; the size column is used below but omitted from this introductory schema list. (rust/lance-table/src/io/commit/dynamodb.rs:93-116)

### Lines 117-138

Private zero-argument macros expand to exact attribute names base_uri, version, path and committer, enabling literal match patterns in schema validation. These strings are persistent key/row identities, not configurable field names. No macro performs IO or runtime initialization. (rust/lance-table/src/io/commit/dynamodb.rs:117-138)

### Lines 139-161

Private parse_size_attribute borrows an attribute map. Absent size returns Ok(None) for older rows; present size must be AttributeValue::N, whose string must parse as u64. Wrong attribute type or malformed/negative/fractional/overflow numeric text returns InvalidInput including value and parse context. Zero and u64::MAX are accepted. This helper does not HEAD storage, validate path/version or silently turn malformed present values into unknown size. (rust/lance-table/src/io/commit/dynamodb.rs:139-161)

### Lines 162-183

Public async new_external_store(client: Arc<Client>, table_name: &str, committer_name: &str) returns Arc<dyn ExternalManifestStore>. It constructs the store first. Function-static LazyLock<RwLock<HashSet<String>>> caches successful checks process-wide using only table_name: a hit returns immediately without DescribeTable. Client, endpoint, account and region are not in the key; there is no expiry/invalidation. Concurrent misses may both describe because read lock is released before the request. (rust/lance-table/src/io/commit/dynamodb.rs:162-183)

### Lines 184-225

On cache miss, constructor issues DescribeTable through the supplied client and wraps SDK failures as IO. Missing table metadata or key schema returns contextual IO. It pops exactly two schema elements, requiring each be Hash/base_uri or Range/version, otherwise IO with table/key name. Missing either popped element errors. Remaining schema elements are not inspected and AttributeDefinitions are not checked, so docs about string/number types exceed the local validation. (rust/lance-table/src/io/commit/dynamodb.rs:184-225)

### Lines 226-243

After the two entries, constructor requires both expected roles to have appeared, preventing duplicate-role acceptance. Success obtains the async write lock, inserts table_name, then returns the store; failed checks are not cached. It does not create or repair a table and has no cache invalidation when a table is recreated. No lock spans the DescribeTable await. (rust/lance-table/src/io/commit/dynamodb.rs:226-243)

### Lines 244-266

Private ddb_put, ddb_get, ddb_query and ddb_delete construct SDK fluent builders prefilled with table_name. Both get and query explicitly set consistent_read(true); writes/deletes do not set conditions here. These methods do not send requests themselves. Strong reads apply per request, not an atomic multi-request snapshot. (rust/lance-table/src/io/commit/dynamodb.rs:244-266)

### Lines 267-298

ExternalManifestStore::get sends a strongly consistent GetItem using base_uri as S and version as decimal N. Absent item becomes core NotFound with dataset/version; missing path also becomes NotFound, wrong path type InvalidInput, and string path is cloned. It does not parse size, inspect row version, read objects or ignore a wrong path type. SDK failures remain wrapped IO. (rust/lance-table/src/io/commit/dynamodb.rs:267-298)

### Lines 299-344

get_manifest_location repeats the keyed strongly consistent GET, checks item/path presence and string type, constructs Path::from, parses optional size, and classifies naming through the parent heuristic. It returns the requested version, row path/size, ETag None and identity None. Legacy e_tag attributes are deliberately ignored. Path::from is delegated conversion rather than a local fallible Path::parse check. No object existence/content/size HEAD occurs here. (rust/lance-table/src/io/commit/dynamodb.rs:299-344)

### Lines 345-368

get_latest_version calls the overridden get_latest_manifest_location and strips metadata to (version,path string); it therefore also rejects malformed size. Latest-location query conditions only base_uri equality, uses strongly consistent Query, descending sort-key order and limit 1. No detached-version predicate, pagination loop or object-store validation is added. (rust/lance-table/src/io/commit/dynamodb.rs:345-368)

### Lines 369-395

Latest lookup returns None for absent/empty items and InvalidInput if the response contains more than one item despite limit 1. A checked pop uses expect. Missing version/path columns are NotFound with base URI and column context. parse_size_attribute runs before checking the version/path attribute type pair, establishing error precedence for malformed rows. (rust/lance-table/src/io/commit/dynamodb.rs:369-395)

### Lines 396-422

Latest row requires version N and path S, parses version to the ManifestLocation u64 type, builds/classifies Path and returns row size with ETag/identity None. Either wrong attribute type produces a broad not number type message, even if path alone is wrong. Numeric overflow or malformed version is InvalidInput. Maximum numeric record wins, including a detached-bit number if stored under the same partition; no payload/file consistency check is made. (rust/lance-table/src/io/commit/dynamodb.rs:396-422)

### Lines 423-455

put_if_not_exists ignores its ETag argument and sends PutItem with exactly base_uri S, version decimal N, path S, committer S and size decimal N. Condition requires both key attributes absent for the target item. It never writes an ETag or identity. Any SDK condition/transport/service error is warned and wrapped as IO, not directly a core commit conflict. Success returns unit; there is no readback here. Atomicity relies on the service honoring the conditional request. (rust/lance-table/src/io/commit/dynamodb.rs:423-455)

### Lines 456-485

put_if_exists also sends a complete five-attribute PutItem, conditioned only on both key attributes existing. It supplies no expected old path, ETag, committer or record incarnation condition. The request intentionally omits legacy ETags rather than using a separate REMOVE update; clearing relies on PutItem replacement semantics. It refreshes committer to this store's name even for reader helping. All errors use the same IO wrapper; generic finalization decides whether to swallow a failed repair. (rust/lance-table/src/io/commit/dynamodb.rs:456-485)

### Lines 486-514

delete queries matching base_uri once with strong reads, then sequentially sends unconditional DeleteItem for each returned numeric version attribute. Missing/wrong-type version is silently skipped; numeric strings are forwarded without parsing. It ignores any last-evaluated key, so this function processes only one query response/page. Errors stop after prior deletions may have succeeded. Concurrent inserts/replacements are not fenced; there is no batch transaction, identity condition or physical-object deletion. The impl ends without overriding predecessor/identity/list/forget hooks, retaining false/None/None/NotSupported trait defaults and generic put/finalize. (rust/lance-table/src/io/commit/dynamodb.rs:486-514)

### Lines 515-536

The cfg(test) module imports parent definitions. Private item fixture constructs base_uri s3://bucket/table, version N(7), path _versions/7.manifest and optionally inserts the supplied size attribute. It creates no client or external table; all local tests exercise only parse_size_attribute. (rust/lance-table/src/io/commit/dynamodb.rs:515-536)

### Lines 537-555

test_absent_size_is_not_an_error asserts None for missing size. test_size_roundtrips_through_the_attribute checks exact Some values for 0, 1, 4096 and u64::MAX represented as N strings. These fixtures validate parsing, not an SDK write/read roundtrip or object HEAD fallback. (rust/lance-table/src/io/commit/dynamodb.rs:537-555)

### Lines 556-570

test_unreadable_size_is_reported supplies empty, abc, -1, 1.5 and an overflowing integer string and asserts each error contains could not parse the size. The comment calls the row corrupt, but the helper's actual variant is InvalidInput; the test checks message rather than variant. (rust/lance-table/src/io/commit/dynamodb.rs:556-570)

### Lines 571-586

test_non_numeric_size_attribute_is_reported supplies string 4096, Bool(true) and Null(true), requires errors containing expected a number, and closes the test module. No local fixtures cover SDK errors, cached schema validation, conditions, pagination, dataset recreation, deletion races or actual service consistency. All tests were read, not run. (rust/lance-table/src/io/commit/dynamodb.rs:571-586)

## Interaction and interpretation limits

All 586 physical lines are read and annotated. DynamoDB requests are reconstructed offline from this implementation and its already analyzed parent factory; no service, SDK test, network request or benchmark ran. Conditional request semantics and SDK retries are expressed by the builders, not empirically qualified. Full Dataset outcome handling and namespace-backed stores remain pending. Full public signatures and all source lines follow.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! DynamoDB based external manifest store
    5 | //!
    6 | 
    7 | use std::collections::{HashMap, HashSet};
    8 | use std::sync::{Arc, LazyLock};
    9 | 
   10 | use async_trait::async_trait;
   11 | use aws_sdk_dynamodb::Client;
   12 | use aws_sdk_dynamodb::error::SdkError;
   13 | use aws_sdk_dynamodb::operation::RequestId;
   14 | use aws_sdk_dynamodb::operation::delete_item::builders::DeleteItemFluentBuilder;
   15 | use aws_sdk_dynamodb::operation::{
   16 |     get_item::builders::GetItemFluentBuilder, put_item::builders::PutItemFluentBuilder,
   17 |     query::builders::QueryFluentBuilder,
   18 | };
   19 | use aws_sdk_dynamodb::types::{AttributeValue, KeyType};
   20 | use object_store::path::Path;
   21 | use snafu::OptionExt;
   22 | use tokio::sync::RwLock;
   23 | use tracing::warn;
   24 | 
   25 | use crate::io::commit::external_manifest::ExternalManifestStore;
   26 | use lance_core::error::NotFoundSnafu;
   27 | use lance_core::error::box_error;
   28 | use lance_core::{Error, Result};
   29 | 
   30 | use super::ManifestLocation;
   31 | use super::external_manifest::detect_naming_scheme_from_path;
   32 | 
   33 | #[derive(Debug)]
   34 | struct WrappedSdkError<E>(SdkError<E>);
   35 | 
   36 | impl<E> From<WrappedSdkError<E>> for Error
   37 | where
   38 |     E: std::error::Error + Send + Sync + 'static,
   39 | {
   40 |     fn from(e: WrappedSdkError<E>) -> Self {
   41 |         Self::io_source(box_error(e))
   42 |     }
   43 | }
   44 | 
   45 | impl<E> std::fmt::Display for WrappedSdkError<E>
   46 | where
   47 |     E: std::error::Error + Send + Sync + 'static,
   48 | {
   49 |     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
   50 |         let request_id = self.0.request_id().unwrap_or("unknown");
   51 |         let service_err = &self.0.raw_response();
   52 |         write!(f, "WrappedSdkError: request_id: {}", request_id)?;
   53 |         if let Some(err) = service_err {
   54 |             write!(f, ", service_error: {:?}", err)
   55 |         } else {
   56 |             write!(f, ", no service error")
   57 |         }
   58 |     }
   59 | }
   60 | 
   61 | impl<E> std::error::Error for WrappedSdkError<E>
   62 | where
   63 |     E: std::error::Error + Send + Sync + 'static,
   64 | {
   65 |     // Implement the necessary methods for the Error trait here.
   66 |     // For example, you can delegate to the inner SdkError:
   67 | 
   68 |     fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
   69 |         Some(&self.0)
   70 |     }
   71 | }
   72 | 
   73 | trait SdkResultExt<T> {
   74 |     fn wrap_err(self) -> Result<T>;
   75 | }
   76 | 
   77 | impl<T, E> SdkResultExt<T> for std::result::Result<T, SdkError<E>>
   78 | where
   79 |     E: std::error::Error + Send + Sync + 'static,
   80 | {
   81 |     fn wrap_err(self) -> Result<T> {
   82 |         self.map_err(|err| {
   83 |             warn!(
   84 |                 target: "lance::dynamodb",
   85 |                 request_id = err.request_id().unwrap_or("unknown"),
   86 |                 "DynamoDB SDK error: {err:?}",
   87 |             );
   88 |             Error::from(WrappedSdkError(err))
   89 |         })
   90 |     }
   91 | }
   92 | 
   93 | /// An external manifest store backed by DynamoDB
   94 | ///
   95 | /// When calling DynamoDBExternalManifestStore::new_external_store()
   96 | /// the key schema, (PK, SK), is checked. If the table does not exist,
   97 | /// or the key schema is not as expected, an error is returned.
   98 | ///
   99 | /// The table schema is expected as follows:
  100 | /// PK: base_uri -- string
  101 | /// SK: version -- number
  102 | /// path -- string
  103 | /// committer -- string
  104 | ///
  105 | /// Consistency: This store is expected to have read-after-write consistency
  106 | /// consistent_read should always be set to true
  107 | ///
  108 | /// Transaction Safety: This store uses DynamoDB conditional write to ensure
  109 | /// only one writer can win per version.
  110 | #[derive(Debug)]
  111 | pub struct DynamoDBExternalManifestStore {
  112 |     client: Arc<Client>,
  113 |     table_name: String,
  114 |     committer_name: String,
  115 | }
  116 | 
  117 | // these are in macro because I want to use them in a match statement
  118 | macro_rules! base_uri {
  119 |     () => {
  120 |         "base_uri"
  121 |     };
  122 | }
  123 | macro_rules! version {
  124 |     () => {
  125 |         "version"
  126 |     };
  127 | }
  128 | macro_rules! path {
  129 |     () => {
  130 |         "path"
  131 |     };
  132 | }
  133 | macro_rules! committer {
  134 |     () => {
  135 |         "committer"
  136 |     };
  137 | }
  138 | 
  139 | /// Read the `size` attribute of a manifest row.
  140 | ///
  141 | /// Rows written before the column existed omit it, so an absent attribute is not
  142 | /// an error: the reader falls back to a `HEAD` request for the manifest length.
  143 | /// A present value is a different case - both writers store it as
  144 | /// [`AttributeValue::N`] alongside `path` - so report a malformed one instead of
  145 | /// dropping the hint and paying for that `HEAD` on every read of the row.
  146 | fn parse_size_attribute(item: &HashMap<String, AttributeValue>) -> Result<Option<u64>> {
  147 |     let Some(attribute) = item.get("size") else {
  148 |         return Ok(None);
  149 |     };
  150 |     let AttributeValue::N(size) = attribute else {
  151 |         return Err(Error::invalid_input(format!(
  152 |             "dynamodb error: the size column is {attribute:?}, expected a number"
  153 |         )));
  154 |     };
  155 |     size.parse().map(Some).map_err(|e| {
  156 |         Error::invalid_input(format!(
  157 |             "dynamodb error: could not parse the size returned {size}, error: {e}"
  158 |         ))
  159 |     })
  160 | }
  161 | 
  162 | impl DynamoDBExternalManifestStore {
  163 |     pub async fn new_external_store(
  164 |         client: Arc<Client>,
  165 |         table_name: &str,
  166 |         committer_name: &str,
  167 |     ) -> Result<Arc<dyn ExternalManifestStore>> {
  168 |         static SANITY_CHECK_CACHE: LazyLock<RwLock<HashSet<String>>> =
  169 |             LazyLock::new(|| RwLock::new(HashSet::new()));
  170 | 
  171 |         let store = Arc::new(Self {
  172 |             client: client.clone(),
  173 |             table_name: table_name.to_string(),
  174 |             committer_name: committer_name.to_string(),
  175 |         });
  176 | 
  177 |         // already checked this table before, skip
  178 |         // this is to avoid checking the table schema every time
  179 |         // because it's expensive to call DescribeTable
  180 |         if SANITY_CHECK_CACHE.read().await.contains(table_name) {
  181 |             return Ok(store);
  182 |         }
  183 | 
  184 |         // Check if the table schema is correct
  185 |         let describe_result = client
  186 |             .describe_table()
  187 |             .table_name(table_name)
  188 |             .send()
  189 |             .await
  190 |             .wrap_err()?;
  191 |         let table = describe_result
  192 |             .table
  193 |             .ok_or_else(|| Error::io(format!("dynamodb table: {table_name} does not exist")))?;
  194 |         let mut schema = table.key_schema.ok_or_else(|| {
  195 |             Error::io(format!(
  196 |                 "dynamodb table: {table_name} does not have a key schema"
  197 |             ))
  198 |         })?;
  199 | 
  200 |         let mut has_hash_key = false;
  201 |         let mut has_range_key = false;
  202 | 
  203 |         // there should be two keys, HASH(base_uri) and RANGE(version)
  204 |         for _ in 0..2 {
  205 |             let key = schema.pop().ok_or_else(|| {
  206 |                 Error::io(format!(
  207 |                     "dynamodb table: {table_name} must have HASH and RANGE keys"
  208 |                 ))
  209 |             })?;
  210 |             match (key.key_type, key.attribute_name.as_str()) {
  211 |                 (KeyType::Hash, base_uri!()) => {
  212 |                     has_hash_key = true;
  213 |                 }
  214 |                 (KeyType::Range, version!()) => {
  215 |                     has_range_key = true;
  216 |                 }
  217 |                 _ => {
  218 |                     return Err(Error::io(format!(
  219 |                         "dynamodb table: {} unknown key type encountered name:{}",
  220 |                         table_name, key.attribute_name
  221 |                     )));
  222 |                 }
  223 |             }
  224 |         }
  225 | 
  226 |         // Both keys must be present
  227 |         if !(has_hash_key && has_range_key) {
  228 |             return Err(Error::io(format!(
  229 |                 "dynamodb table: {} must have HASH and RANGE keys, named `{}` and `{}` respectively",
  230 |                 table_name,
  231 |                 base_uri!(),
  232 |                 version!()
  233 |             )));
  234 |         }
  235 | 
  236 |         SANITY_CHECK_CACHE
  237 |             .write()
  238 |             .await
  239 |             .insert(table_name.to_string());
  240 | 
  241 |         Ok(store)
  242 |     }
  243 | 
  244 |     fn ddb_put(&self) -> PutItemFluentBuilder {
  245 |         self.client.put_item().table_name(&self.table_name)
  246 |     }
  247 | 
  248 |     fn ddb_get(&self) -> GetItemFluentBuilder {
  249 |         self.client
  250 |             .get_item()
  251 |             .table_name(&self.table_name)
  252 |             .consistent_read(true)
  253 |     }
  254 | 
  255 |     fn ddb_query(&self) -> QueryFluentBuilder {
  256 |         self.client
  257 |             .query()
  258 |             .table_name(&self.table_name)
  259 |             .consistent_read(true)
  260 |     }
  261 | 
  262 |     fn ddb_delete(&self) -> DeleteItemFluentBuilder {
  263 |         self.client.delete_item().table_name(&self.table_name)
  264 |     }
  265 | }
  266 | 
  267 | #[async_trait]
  268 | impl ExternalManifestStore for DynamoDBExternalManifestStore {
  269 |     /// Get the manifest path for a given base_uri and version
  270 |     async fn get(&self, base_uri: &str, version: u64) -> Result<String> {
  271 |         let get_item_result = self
  272 |             .ddb_get()
  273 |             .key(base_uri!(), AttributeValue::S(base_uri.into()))
  274 |             .key(version!(), AttributeValue::N(version.to_string()))
  275 |             .send()
  276 |             .await
  277 |             .wrap_err()?;
  278 | 
  279 |         let item = get_item_result.item.context(NotFoundSnafu {
  280 |             uri: format!(
  281 |                 "dynamodb not found: base_uri: {}; version: {}",
  282 |                 base_uri, version
  283 |             ),
  284 |         })?;
  285 | 
  286 |         let path = item
  287 |             .get(path!())
  288 |             .ok_or_else(|| Error::not_found(format!("key {} is not present", path!())))?;
  289 | 
  290 |         match path {
  291 |             AttributeValue::S(path) => Ok(path.clone()),
  292 |             _ => Err(Error::invalid_input(format!(
  293 |                 "key {} is not a string",
  294 |                 path!()
  295 |             ))),
  296 |         }
  297 |     }
  298 | 
  299 |     async fn get_manifest_location(
  300 |         &self,
  301 |         base_uri: &str,
  302 |         version: u64,
  303 |     ) -> Result<ManifestLocation> {
  304 |         let get_item_result = self
  305 |             .ddb_get()
  306 |             .key(base_uri!(), AttributeValue::S(base_uri.into()))
  307 |             .key(version!(), AttributeValue::N(version.to_string()))
  308 |             .send()
  309 |             .await
  310 |             .wrap_err()?;
  311 | 
  312 |         let item = get_item_result.item.context(NotFoundSnafu {
  313 |             uri: format!(
  314 |                 "dynamodb not found: base_uri: {}; version: {}",
  315 |                 base_uri, version
  316 |             ),
  317 |         })?;
  318 | 
  319 |         let path = item
  320 |             .get(path!())
  321 |             .ok_or_else(|| Error::not_found(format!("key {} is not present", path!())))?
  322 |             .as_s()
  323 |             .map_err(|_| Error::invalid_input(format!("key {} is not a string", path!())))?
  324 |             .as_str();
  325 |         let path = Path::from(path);
  326 | 
  327 |         let size = parse_size_attribute(&item)?;
  328 | 
  329 |         let naming_scheme = detect_naming_scheme_from_path(&path)?;
  330 | 
  331 |         Ok(ManifestLocation {
  332 |             version,
  333 |             path,
  334 |             size,
  335 |             naming_scheme,
  336 |             // DynamoDB coordinates the logical version but does not own an
  337 |             // object generation. Older rows may still contain `e_tag`; ignore
  338 |             // it and let the commit handler obtain the current token from the
  339 |             // authoritative object store when it validates the final path.
  340 |             e_tag: None,
  341 |             identity: None,
  342 |         })
  343 |     }
  344 | 
  345 |     /// Get the latest version of a dataset at the base_uri
  346 |     async fn get_latest_version(&self, base_uri: &str) -> Result<Option<(u64, String)>> {
  347 |         self.get_latest_manifest_location(base_uri)
  348 |             .await
  349 |             .map(|location| location.map(|loc| (loc.version, loc.path.to_string())))
  350 |     }
  351 | 
  352 |     async fn get_latest_manifest_location(
  353 |         &self,
  354 |         base_uri: &str,
  355 |     ) -> Result<Option<ManifestLocation>> {
  356 |         let query_result = self
  357 |             .ddb_query()
  358 |             .key_condition_expression(format!("{} = :{}", base_uri!(), base_uri!()))
  359 |             .expression_attribute_values(
  360 |                 format!(":{}", base_uri!()),
  361 |                 AttributeValue::S(base_uri.into()),
  362 |             )
  363 |             .scan_index_forward(false)
  364 |             .limit(1)
  365 |             .send()
  366 |             .await
  367 |             .wrap_err()?;
  368 | 
  369 |         match query_result.items {
  370 |             Some(mut items) => {
  371 |                 if items.is_empty() {
  372 |                     return Ok(None);
  373 |                 }
  374 |                 if items.len() > 1 {
  375 |                     return Err(Error::invalid_input(format!(
  376 |                         "dynamodb table: {} returned unexpected number of items",
  377 |                         self.table_name
  378 |                     )));
  379 |                 }
  380 | 
  381 |                 let item = items.pop().expect("length checked");
  382 |                 let version_attribute = item
  383 |                     .get(version!())
  384 |                     .ok_or_else(|| Error::not_found(
  385 |                         format!("dynamodb error: found entries for {} but the returned data does not contain {} column", base_uri, version!())
  386 |                     ))?;
  387 | 
  388 |                 let path_attribute = item
  389 |                     .get(path!())
  390 |                     .ok_or_else(|| Error::not_found(
  391 |                         format!("dynamodb error: found entries for {} but the returned data does not contain {} column", base_uri, path!())
  392 |                     ))?;
  393 | 
  394 |                 let size = parse_size_attribute(&item)?;
  395 | 
  396 |                 match (version_attribute, path_attribute) {
  397 |                     (AttributeValue::N(version), AttributeValue::S(path)) => {
  398 |                         let version = version.parse().map_err(|e| Error::invalid_input(format!("dynamodb error: could not parse the version number returned {}, error: {}", version, e)))?;
  399 |                         let path = Path::from(path.as_str());
  400 |                         let naming_scheme = detect_naming_scheme_from_path(&path)?;
  401 |                         let location = ManifestLocation {
  402 |                             version,
  403 |                             path,
  404 |                             size,
  405 |                             naming_scheme,
  406 |                             // See `get_manifest_location`: legacy DDB ETags
  407 |                             // are physical-generation observations, not
  408 |                             // version identity, and are intentionally ignored.
  409 |                             e_tag: None,
  410 |                             identity: None,
  411 |                         };
  412 |                         Ok(Some(location))
  413 |                     }
  414 |                     _ => Err(Error::invalid_input(format!(
  415 |                         "dynamodb error: found entries for {base_uri} but the returned data is not number type"
  416 |                     ))),
  417 |                 }
  418 |             }
  419 |             _ => Ok(None),
  420 |         }
  421 |     }
  422 | 
  423 |     /// Put the manifest path for a given base_uri and version, should fail if the version already exists
  424 |     async fn put_if_not_exists(
  425 |         &self,
  426 |         base_uri: &str,
  427 |         version: u64,
  428 |         path: &str,
  429 |         size: u64,
  430 |         _e_tag: Option<String>,
  431 |     ) -> Result<()> {
  432 |         // Do not persist an object-store ETag. Staging paths are immutable and
  433 |         // uniquely selected by this conditional write; finalized paths are
  434 |         // validated against object storage. Persisting an ETag adds no DDB
  435 |         // concurrency or content-integrity guarantee and can make the row stale
  436 |         // after an identical copy. The commit handler returns the destination
  437 |         // ETag separately as an ephemeral runtime cache discriminator.
  438 |         self.ddb_put()
  439 |             .item(base_uri!(), AttributeValue::S(base_uri.into()))
  440 |             .item(version!(), AttributeValue::N(version.to_string()))
  441 |             .item(path!(), AttributeValue::S(path.to_string()))
  442 |             .item(committer!(), AttributeValue::S(self.committer_name.clone()))
  443 |             .item("size", AttributeValue::N(size.to_string()))
  444 |             .condition_expression(format!(
  445 |                 "attribute_not_exists({}) AND attribute_not_exists({})",
  446 |                 base_uri!(),
  447 |                 version!(),
  448 |             ))
  449 |             .send()
  450 |             .await
  451 |             .wrap_err()?;
  452 | 
  453 |         Ok(())
  454 |     }
  455 | 
  456 |     /// Put the manifest path for a given base_uri and version, should fail if the version **does not** already exist
  457 |     async fn put_if_exists(
  458 |         &self,
  459 |         base_uri: &str,
  460 |         version: u64,
  461 |         path: &str,
  462 |         size: u64,
  463 |         _e_tag: Option<String>,
  464 |     ) -> Result<()> {
  465 |         // Replacing the staging pointer with the canonical path publishes the
  466 |         // same generation-independent `(path, size)` tuple from every helper.
  467 |         // Each helper still returns the canonical ETag it observed to its caller.
  468 |         self.ddb_put()
  469 |             .item(base_uri!(), AttributeValue::S(base_uri.into()))
  470 |             .item(version!(), AttributeValue::N(version.to_string()))
  471 |             .item(path!(), AttributeValue::S(path.to_string()))
  472 |             .item(committer!(), AttributeValue::S(self.committer_name.clone()))
  473 |             .item("size", AttributeValue::N(size.to_string()))
  474 |             .condition_expression(format!(
  475 |                 "attribute_exists({}) AND attribute_exists({})",
  476 |                 base_uri!(),
  477 |                 version!(),
  478 |             ))
  479 |             .send()
  480 |             .await
  481 |             .wrap_err()?;
  482 | 
  483 |         Ok(())
  484 |     }
  485 | 
  486 |     /// Delete the manifest information for the given base_uri in dynamodb
  487 |     async fn delete(&self, base_uri: &str) -> Result<()> {
  488 |         let query_result = self
  489 |             .ddb_query()
  490 |             .key_condition_expression(format!("{} = :{}", base_uri!(), base_uri!()))
  491 |             .expression_attribute_values(
  492 |                 format!(":{}", base_uri!()),
  493 |                 AttributeValue::S(base_uri.into()),
  494 |             )
  495 |             .send()
  496 |             .await
  497 |             .wrap_err()?;
  498 | 
  499 |         if let Some(items) = query_result.items {
  500 |             for item in items {
  501 |                 if let Some(AttributeValue::N(version)) = item.get("version") {
  502 |                     self.ddb_delete()
  503 |                         .key(base_uri!(), AttributeValue::S(base_uri.to_string()))
  504 |                         .key(version!(), AttributeValue::N(version.clone()))
  505 |                         .send()
  506 |                         .await
  507 |                         .wrap_err()?;
  508 |                 }
  509 |             }
  510 |         }
  511 |         Ok(())
  512 |     }
  513 | }
  514 | 
  515 | #[cfg(test)]
  516 | mod tests {
  517 |     use super::*;
  518 | 
  519 |     fn item(size: Option<AttributeValue>) -> HashMap<String, AttributeValue> {
  520 |         let mut item = HashMap::from([
  521 |             (
  522 |                 base_uri!().to_string(),
  523 |                 AttributeValue::S("s3://bucket/table".into()),
  524 |             ),
  525 |             (version!().to_string(), AttributeValue::N("7".into())),
  526 |             (
  527 |                 path!().to_string(),
  528 |                 AttributeValue::S("_versions/7.manifest".into()),
  529 |             ),
  530 |         ]);
  531 |         if let Some(size) = size {
  532 |             item.insert("size".to_string(), size);
  533 |         }
  534 |         item
  535 |     }
  536 | 
  537 |     /// Rows predate the column, so an absent value keeps the `HEAD` fallback
  538 |     /// rather than becoming an error.
  539 |     #[test]
  540 |     fn test_absent_size_is_not_an_error() {
  541 |         assert_eq!(parse_size_attribute(&item(None)).unwrap(), None);
  542 |     }
  543 | 
  544 |     #[test]
  545 |     fn test_size_roundtrips_through_the_attribute() {
  546 |         for size in [0u64, 1, 4096, u64::MAX] {
  547 |             let attribute = AttributeValue::N(size.to_string());
  548 |             assert_eq!(
  549 |                 parse_size_attribute(&item(Some(attribute))).unwrap(),
  550 |                 Some(size),
  551 |                 "size {size}"
  552 |             );
  553 |         }
  554 |     }
  555 | 
  556 |     /// A present value is written by both put helpers, so a malformed one means a
  557 |     /// corrupt row: report it instead of silently dropping the length hint.
  558 |     #[test]
  559 |     fn test_unreadable_size_is_reported() {
  560 |         for raw in ["", "abc", "-1", "1.5", "99999999999999999999999"] {
  561 |             let attribute = AttributeValue::N(raw.to_string());
  562 |             let err = parse_size_attribute(&item(Some(attribute)))
  563 |                 .expect_err(&format!("size {raw:?} should be rejected"));
  564 |             assert!(
  565 |                 err.to_string().contains("could not parse the size"),
  566 |                 "size {raw:?}: unexpected message {err}"
  567 |             );
  568 |         }
  569 |     }
  570 | 
  571 |     #[test]
  572 |     fn test_non_numeric_size_attribute_is_reported() {
  573 |         for attribute in [
  574 |             AttributeValue::S("4096".into()),
  575 |             AttributeValue::Bool(true),
  576 |             AttributeValue::Null(true),
  577 |         ] {
  578 |             let err = parse_size_attribute(&item(Some(attribute.clone())))
  579 |                 .expect_err(&format!("{attribute:?} should be rejected"));
  580 |             assert!(
  581 |                 err.to_string().contains("expected a number"),
  582 |                 "{attribute:?}: unexpected message {err}"
  583 |             );
  584 |         }
  585 |     }
  586 | }
``````
