> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-core/src/utils/fragment_reuse.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `a25ddd1c61292e6c55a77300a99da2ee1552bdb464f7734da9bb2a7ab85230b9`. Reviewed physical lines: 1-144.

[Module](../../../../../L1-modules/rust-lance-core-deletion-mapping.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public MappingReader contract and OrderedCompactionMapping adapter for one rewrite group. Graph traversal and index/manifest orchestration are explicitly outside this file. (rust/lance-core/src/utils/fragment_reuse.rs:1-144)

## Complete range analysis

### Lines 1-13

SPDX and module docs place graph traversal in the FRI reader. Imports bring shared Arc ownership, async_trait expansion, RowAddrRemap, core deep-size context/trait and Error/Result. FRI expansion and RowAddrRemap algorithm are not defined by these imports. (rust/lance-core/src/utils/fragment_reuse.rs:1-13)

### Lines 14-24

Public async-trait MappingReader requires Send+Sync+Debug+DeepSizeOf. Despite row_id names, the contract explicitly says physical addresses. remap_row_id(&self,u64)->Result<Option<u64>> returns mapped address or None for deleted source row; addresses outside source fragments or outside their valid offset ranges must return InvalidInput. Persisted invalid mappings should produce CorruptFile and storage errors propagate. These error requirements are an interface contract; the trait cannot enforce every implementation. (rust/lance-core/src/utils/fragment_reuse.rs:14-24)

### Lines 25-33

Default remap_row_ids(&self,&[u64])->Result<Vec<Option<u64>>> reserves input length, iterates in input order and sequentially awaits remap_row_id, pushing one result per input. Duplicates and None positions are preserved, empty input gives empty Vec, and the first Err stops iteration and discards the partial result. There is no concurrent buffering or aggregation. Cancellation can interrupt an in-flight single-row future; the trait makes no rollback promise for implementation side effects. (rust/lance-core/src/utils/fragment_reuse.rs:25-33)

### Lines 34-46

OrderedCompactionMapping derives Debug and privately owns Arc<RowAddrRemap>. Documentation calls it an adapter for one group's existing bitmap/rank remap, explicitly not replacing the legacy FRI reader or writer. Public new simply stores the Arc; its documentation presumes fragment layout validation happened when the remap was constructed, and no additional validation is performed here. (rust/lance-core/src/utils/fragment_reuse.rs:34-46)

### Lines 47-59

Private map_row_id invokes remap.get(row_id).ok_or_else with an InvalidInput message containing the full u64 row ID when the outer Option is absent. Present inner None passes through as deleted; present Some(address) passes through as mapped. DeepSizeOf delegates to the Arc remap children with the same Context, inheriting Arc dedup (rust/lance-core/src/deepsize.rs:182-190). The remap's local memory calculation and layout validation are now analyzed at rust/lance-core/src/utils/row_addr_remap.rs:167-174, rust/lance-core/src/utils/row_addr_remap.rs:391-470 and rust/lance-core/src/utils/row_addr_remap.rs:563-625; persisted IO and caller integration remain pending. (rust/lance-core/src/utils/fragment_reuse.rs:47-59)

### Lines 60-73

The async-trait implementation overrides both operations. Single maps synchronously through map_row_id; batch maps the borrowed slice through that helper and collects Result<Vec<Option<u64>>>. It avoids per-item async awaits and preserves order/duplicates; collect short-circuits on the first error. There is no internal await/yield or IO in these adapter bodies, though the interface is async. (rust/lance-core/src/utils/fragment_reuse.rs:60-73)

### Lines 74-93

Private cfg(test) imports RowAddress, GroupInputWithLayout and RoaringTreemap. Unit SingleRowReader derives Debug/DeepSizeOf and implements only single-row mapping: u64::MAX returns InvalidInput, zero gives None, others echo Some(row_id). It therefore exercises the trait default batch implementation rather than the adapter override. (rust/lance-core/src/utils/fragment_reuse.rs:74-93)

### Lines 94-106

Tokio test default_batch_preserves_positions_and_propagates_errors expects [2,0,1,2] -> [Some(2),None,Some(1),Some(2)], checks empty input, then [1,u64::MAX] produces InvalidInput with the precise test-message substring. It checks error category/text, not cancellation or post-error side effects. (rust/lance-core/src/utils/fragment_reuse.rs:94-106)

### Lines 107-129

The ordered-compaction test constructs a real RowAddrRemap through compact_with_layout: source fragments (1,3 rows),(2,1 row), surviving addresses (1,0),(1,2),(2,0), destination fragments (3,2 rows),(4,1 row). Its input is (2,0),(1,1),(1,0),(1,0), covering out-of-source-order requests, deletion and duplicate. Expected results are computed from remap.get and both batch and singles must equal them. This is an adapter-equivalence test, not an independent expected-address oracle for the underlying remap algorithm. (rust/lance-core/src/utils/fragment_reuse.rs:107-129)

### Lines 130-144

The same test checks empty batch and both absent fragment (99,0) and out-of-range offset (1,3). Each must error through single and batch calls with InvalidInput and message containing outside compaction mapping. No CorruptFile/storage-error path is exercised by this adapter fixture. Tests were read, not run. (rust/lance-core/src/utils/fragment_reuse.rs:130-144)

## Interaction and interpretation limits

This public interface reads a single rewrite mapping and explicitly excludes FRI graph traversal/legacy replacement. The adapter's RowAddrRemap dependency and how callers select mapping chains remain pending; do not use this file alone to claim full compaction or stable-ID semantics. (rust/lance-core/src/utils/fragment_reuse.rs:4-4; rust/lance-core/src/utils/fragment_reuse.rs:14-73)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Readers for a single fragment rewrite. Graph traversal belongs to the FRI reader.
    5 | 
    6 | use std::sync::Arc;
    7 | 
    8 | use async_trait::async_trait;
    9 | 
   10 | use super::row_addr_remap::RowAddrRemap;
   11 | use crate::deepsize::{Context, DeepSizeOf};
   12 | use crate::{Error, Result};
   13 | 
   14 | /// The read contract for one mapping, independent of index types and manifests.
   15 | ///
   16 | /// Row IDs are physical addresses. Results preserve input positions and `None`
   17 | /// denotes a deleted source row. Addresses outside the source fragments, including
   18 | /// out-of-range offsets, return [`Error::InvalidInput`]. Invalid persisted mapping
   19 | /// contents return [`Error::CorruptFile`]; storage errors propagate to the caller.
   20 | #[async_trait]
   21 | pub trait MappingReader: Send + Sync + std::fmt::Debug + DeepSizeOf {
   22 |     /// Remap one physical row ID, or return `None` if the row was deleted.
   23 |     async fn remap_row_id(&self, row_id: u64) -> Result<Option<u64>>;
   24 | 
   25 |     /// Remap a batch, preserving input order and duplicates, with one result per input.
   26 |     async fn remap_row_ids(&self, row_ids: &[u64]) -> Result<Vec<Option<u64>>> {
   27 |         let mut mapped = Vec::with_capacity(row_ids.len());
   28 |         for &row_id in row_ids {
   29 |             mapped.push(self.remap_row_id(row_id).await?);
   30 |         }
   31 |         Ok(mapped)
   32 |     }
   33 | }
   34 | 
   35 | /// Ordered-compaction adapter for one rewrite group's existing bitmap/rank remap.
   36 | /// This adapter does not replace the legacy FRI reader or writer.
   37 | #[derive(Debug)]
   38 | pub struct OrderedCompactionMapping {
   39 |     remap: Arc<RowAddrRemap>,
   40 | }
   41 | 
   42 | impl OrderedCompactionMapping {
   43 |     /// Use a remap whose fragment layout was validated when it was constructed.
   44 |     pub fn new(remap: Arc<RowAddrRemap>) -> Self {
   45 |         Self { remap }
   46 |     }
   47 | 
   48 |     fn map_row_id(&self, row_id: u64) -> Result<Option<u64>> {
   49 |         self.remap.get(row_id).ok_or_else(|| {
   50 |             Error::invalid_input(format!("row ID {row_id} is outside compaction mapping"))
   51 |         })
   52 |     }
   53 | }
   54 | 
   55 | impl DeepSizeOf for OrderedCompactionMapping {
   56 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
   57 |         self.remap.deep_size_of_children(context)
   58 |     }
   59 | }
   60 | 
   61 | #[async_trait]
   62 | impl MappingReader for OrderedCompactionMapping {
   63 |     async fn remap_row_id(&self, row_id: u64) -> Result<Option<u64>> {
   64 |         self.map_row_id(row_id)
   65 |     }
   66 | 
   67 |     async fn remap_row_ids(&self, row_ids: &[u64]) -> Result<Vec<Option<u64>>> {
   68 |         row_ids
   69 |             .iter()
   70 |             .map(|&row_id| self.map_row_id(row_id))
   71 |             .collect()
   72 |     }
   73 | }
   74 | 
   75 | #[cfg(test)]
   76 | mod tests {
   77 |     use super::*;
   78 |     use crate::utils::address::RowAddress;
   79 |     use crate::utils::row_addr_remap::GroupInputWithLayout;
   80 |     use roaring::RoaringTreemap;
   81 | 
   82 |     #[derive(Debug, DeepSizeOf)]
   83 |     struct SingleRowReader;
   84 | 
   85 |     #[async_trait]
   86 |     impl MappingReader for SingleRowReader {
   87 |         async fn remap_row_id(&self, row_id: u64) -> Result<Option<u64>> {
   88 |             if row_id == u64::MAX {
   89 |                 return Err(Error::invalid_input("invalid test row ID"));
   90 |             }
   91 |             Ok((row_id != 0).then_some(row_id))
   92 |         }
   93 |     }
   94 | 
   95 |     #[tokio::test]
   96 |     async fn default_batch_preserves_positions_and_propagates_errors() {
   97 |         let reader = SingleRowReader;
   98 |         assert_eq!(
   99 |             reader.remap_row_ids(&[2, 0, 1, 2]).await.unwrap(),
  100 |             vec![Some(2), None, Some(1), Some(2)],
  101 |         );
  102 |         assert!(reader.remap_row_ids(&[]).await.unwrap().is_empty());
  103 |         let error = reader.remap_row_ids(&[1, u64::MAX]).await.unwrap_err();
  104 |         assert!(matches!(error, Error::InvalidInput { .. }));
  105 |         assert!(error.to_string().contains("invalid test row ID"));
  106 |     }
  107 | 
  108 |     #[tokio::test]
  109 |     async fn compaction_reader_preserves_legacy_mapping_semantics() {
  110 |         let address = |fragment, offset| u64::from(RowAddress::new_from_parts(fragment, offset));
  111 |         let remap = Arc::new(
  112 |             RowAddrRemap::compact_with_layout([GroupInputWithLayout {
  113 |                 rewritten_old_row_addrs: RoaringTreemap::from_iter([
  114 |                     address(1, 0),
  115 |                     address(1, 2),
  116 |                     address(2, 0),
  117 |                 ]),
  118 |                 old_frags: vec![(1, 3), (2, 1)],
  119 |                 new_frags: vec![(3, 2), (4, 1)],
  120 |             }])
  121 |             .unwrap(),
  122 |         );
  123 |         let reader = OrderedCompactionMapping::new(remap.clone());
  124 |         let input = [address(2, 0), address(1, 1), address(1, 0), address(1, 0)];
  125 |         let expected: Vec<_> = input.iter().map(|&a| remap.get(a).unwrap()).collect();
  126 |         assert_eq!(reader.remap_row_ids(&input).await.unwrap(), expected);
  127 |         for (&row_id, &mapped) in input.iter().zip(&expected) {
  128 |             assert_eq!(reader.remap_row_id(row_id).await.unwrap(), mapped);
  129 |         }
  130 |         assert!(reader.remap_row_ids(&[]).await.unwrap().is_empty());
  131 |         for invalid in [address(99, 0), address(1, 3)] {
  132 |             for error in [
  133 |                 reader.remap_row_id(invalid).await.unwrap_err(),
  134 |                 reader
  135 |                     .remap_row_ids(&[input[0], invalid])
  136 |                     .await
  137 |                     .unwrap_err(),
  138 |             ] {
  139 |                 assert!(matches!(error, Error::InvalidInput { .. }));
  140 |                 assert!(error.to_string().contains("outside compaction mapping"));
  141 |             }
  142 |         }
  143 |     }
  144 | }
``````
