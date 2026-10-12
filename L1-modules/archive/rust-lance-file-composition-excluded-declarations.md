> **Historical declarations — excluded from V2.1 production scope.** Retained from iteration 85.

# Excluded declarations from rust-lance-file-composition.md

| `lance_file::reader::structural::test_projection_length` | pub(crate) effective | `pub fn test_projection_length(     schema: &Schema,     column_indices: &[u32],     column_lengths: &[u64], ) -> Result<u64> {` | [rust/lance-file/src/reader/structural.rs:435-439](../../L2-files/rust/lance-file/src/reader/structural.rs.md) |
| `lance_file::versions::v2_0::test_projection_length` | pub(crate) | `pub(crate) use reader::test_projection_length;` | [rust/lance-file/src/versions/v2_0/mod.rs:25-25](../../L2-files/rust/lance-file/src/versions/v2_0/mod.rs.md) |
| `lance_file::versions::v2_1::test_projection_length` | pub(crate) | `pub(crate) use reader::test_projection_length;` | [rust/lance-file/src/versions/v2_1/mod.rs:41-41](../../L2-files/rust/lance-file/src/versions/v2_1/mod.rs.md) |
