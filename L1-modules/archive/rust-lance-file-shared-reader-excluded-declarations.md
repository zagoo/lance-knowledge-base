> **Historical declarations — excluded from V2.1 production scope.** Retained from iteration 85.

# Excluded declarations from rust-lance-file-shared-reader.md

| `lance_file::reader::ProjectedFileReader::metadata_index` | pub(crate) cfg(test) | `pub(crate) fn metadata_index(&self) -> Option<&Arc<FileMetadataIndex>> {` | [rust/lance-file/src/reader.rs:1929-1929](../../L2-files/rust/lance-file/src/reader.rs.md) |
| `lance_file::reader::FileReader::scheduler` | private cfg(test) | `fn scheduler(&self) -> Arc<dyn EncodingsIo> {` | [rust/lance-file/src/reader.rs:1944-1944](../../L2-files/rust/lance-file/src/reader.rs.md) |
