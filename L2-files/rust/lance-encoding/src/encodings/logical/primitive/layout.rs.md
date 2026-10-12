> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-encoding/src/encodings/logical/primitive/layout.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `1949beffb6520d06887f1c83c27945e331851713937a8bff883c098445406014`. Reviewed physical lines: 1-72.

[Module](../../../../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../../README.md)

## Role and visibility

Parent-module-visible lazy automatic sparse-candidate selector. Eligibility is based on an optional explicit setting and dense rep/def budget, not directly on format version. (rust/lance-encoding/src/encodings/logical/primitive/layout.rs:1-72)

## Complete range analysis

### Lines 1-7

SPDX plus Result and MiniBlockRepDefBudget imports. No state or IO. (rust/lance-encoding/src/encodings/logical/primitive/layout.rs:1-7)

### Lines 8-25

pub(super) select_automatic_sparse<T> takes Option<&str>, a borrowed budget enum, and FnOnce()->Result<Option<T>>. Any Some string, including empty/unknown, suppresses candidate evaluation. With no explicit setting, only RequiresPageSplit or SingleRowOverBudget permits one invocation; WithinBudget returns None. Eligible closure Some/None/Error passes through unchanged. The helper does not inspect enum payloads, choose a version, perform planning or allocate by itself. Budget enum describes dense page fit, row splits or one over-budget row. (rust/lance-encoding/src/repdef.rs:142-152) (rust/lance-encoding/src/encodings/logical/primitive/layout.rs:8-25)

### Lines 26-42

cfg(test) within-budget test supplies panic closure to prove it is never evaluated and expects None. (rust/lance-encoding/src/encodings/logical/primitive/layout.rs:26-42)

### Lines 43-56

Budget-exceeded test accepts Some42 and None for RequiresPageSplit(empty Vec), and Some7 for SingleRowOverBudget(70000). Empty split payload is deliberately not validated by this selector. No closure-error propagation test. (rust/lance-encoding/src/encodings/logical/primitive/layout.rs:43-56)

### Lines 57-72

Test named explicit_modes_and_lance_2_2_do_not_auto_select loops miniblock/fullzip/sparse strings with panic closures. It passes no version and therefore does not independently prove the2.2 gate. Actual v2.2 composition installs reject_sparse/constant/dense_u32; v2.3 installs sparse/constant/dense_u32. Sparse behavior calls this helper after budget calculation, skips unsupported value blocks, converts preparation errors to logged dense fallback, but propagates planning errors. Explicit sparse is handled in a prior branch and can propagate its own plan error. (rust/lance-file/src/versions/v2_2/mod.rs:121-131; rust/lance-file/src/versions/v2_3/mod.rs:129-139; rust/lance-encoding/src/encodings/logical/primitive.rs:7802-7877) (rust/lance-encoding/src/encodings/logical/primitive/layout.rs:57-72)

## Interaction and interpretation limits

Every physical line was read during ANALYZE73 in bounded outputs. Offline read-only source inspection only: no repository build, test, lint, benchmark, generator or dependency installation. Exact declarations and source are retained below. Contextual caller snippets do not claim whole-file coverage; lexical references do not establish a resolved call graph.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use lance_core::Result;
    5 | 
    6 | use crate::repdef::MiniBlockRepDefBudget;
    7 | 
    8 | /// Runs automatic sparse planning only after the dense mini-block budget makes it useful.
    9 | pub(super) fn select_automatic_sparse<T>(
   10 |     requested_encoding: Option<&str>,
   11 |     dense_budget: &MiniBlockRepDefBudget,
   12 |     candidate: impl FnOnce() -> Result<Option<T>>,
   13 | ) -> Result<Option<T>> {
   14 |     if requested_encoding.is_some()
   15 |         || !matches!(
   16 |             dense_budget,
   17 |             MiniBlockRepDefBudget::RequiresPageSplit(_)
   18 |                 | MiniBlockRepDefBudget::SingleRowOverBudget(_)
   19 |         )
   20 |     {
   21 |         return Ok(None);
   22 |     }
   23 |     candidate()
   24 | }
   25 | 
   26 | #[cfg(test)]
   27 | mod tests {
   28 |     use super::*;
   29 |     use crate::constants::{
   30 |         STRUCTURAL_ENCODING_FULLZIP, STRUCTURAL_ENCODING_MINIBLOCK, STRUCTURAL_ENCODING_SPARSE,
   31 |     };
   32 | 
   33 |     #[test]
   34 |     fn within_budget_does_not_construct_sparse_candidate() {
   35 |         let selected =
   36 |             select_automatic_sparse::<()>(None, &MiniBlockRepDefBudget::WithinBudget, || {
   37 |                 panic!("within-budget pages must not construct sparse candidates")
   38 |             })
   39 |             .unwrap();
   40 |         assert!(selected.is_none());
   41 |     }
   42 | 
   43 |     #[test]
   44 |     fn over_budget_selects_only_eligible_candidates() {
   45 |         let split = MiniBlockRepDefBudget::RequiresPageSplit(Vec::new());
   46 |         let selected = select_automatic_sparse(None, &split, || Ok(Some(42))).unwrap();
   47 |         assert_eq!(selected, Some(42));
   48 | 
   49 |         let ineligible = select_automatic_sparse::<()>(None, &split, || Ok(None)).unwrap();
   50 |         assert!(ineligible.is_none());
   51 | 
   52 |         let unsplittable = MiniBlockRepDefBudget::SingleRowOverBudget(70_000);
   53 |         let selected = select_automatic_sparse(None, &unsplittable, || Ok(Some(7))).unwrap();
   54 |         assert_eq!(selected, Some(7));
   55 |     }
   56 | 
   57 |     #[test]
   58 |     fn explicit_modes_and_lance_2_2_do_not_auto_select() {
   59 |         let split = MiniBlockRepDefBudget::RequiresPageSplit(Vec::new());
   60 |         for requested in [
   61 |             STRUCTURAL_ENCODING_MINIBLOCK,
   62 |             STRUCTURAL_ENCODING_FULLZIP,
   63 |             STRUCTURAL_ENCODING_SPARSE,
   64 |         ] {
   65 |             let selected = select_automatic_sparse::<()>(Some(requested), &split, || {
   66 |                 panic!("explicit modes must not invoke automatic sparse planning")
   67 |             })
   68 |             .unwrap();
   69 |             assert!(selected.is_none());
   70 |         }
   71 |     }
   72 | }
``````
