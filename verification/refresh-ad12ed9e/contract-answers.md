# Scoped contract test — KB-only answers

Prepared from the refreshed KB before this test's source confirmation. Only Q4's open/reference family is affected among the original five contract questions. Q1 write/compact, Q2 scalar extension, Q3 exact file-format gates and Q5 transaction/conflicts retain their prior evidence: their relevant production behavior did not change.

## Q4 — Python public APIs and shared DatasetBuilder mapping

The Python local public declarations and facade/native interfaces are unchanged by this diff; only excluded Cargo metadata changed under python. The existing root export/declaration directory and facade→PyO3→Rust family maps remain applicable. Dataset opening uses the shared DatasetBuilder boundary. The changed contract is conditional: when reference loading requires delayed checkout, first load the URI chain's latest manifest (None version), then resolve and check out the target branch/version. A version present only on the target branch must not be required on the initial chain. Non-delayed loading continues to use the requested numeric version. Delayed tag lookup resolves branch/version after the initial load. File-format admission and commit/conflict rules are unaffected.

KB evidence: [public contract](../../L3-symbols/public-api.md#dataset-open-reference-resolution), [Python API directory](../../L3-symbols/api-reference/python.md), [Dataset map](../../L1-modules/rust-lance.md).

## Changed Java interface notes — mapped-only boundary confirmation

ReadOptions accepts an optional Ref, rejects null, and rejects Ref with either a numeric version or a serialized manifest. OpenDatasetBuilder and Dataset forward the new option. JNI combines the decoded optional Ref with version.map(Ref::from) using Option::or: a present Ref wins, without implying lazy numeric conversion. The resulting reference routes to with_version/with_branch/with_tag. Default-chain references at open are URI-relative and must not be conflated with checkout semantics. Java DataFile and DeletionFile equality/hash now include baseId; DataOverlayFile hashes the DataFile object consistently with its equality inputs. These are changed-interface notes, not deep Java/JNI qualification.

KB evidence: [Java refresh notes](../../L1-modules/java.md#refresh-reference-based-opening-and-value-identity--mapped-only). Source confirmation checked only the changed Rust loading/Java boundary ranges. Q4 and the mapped Java boundary notes pass; unchanged contract answers retain baseline evidence. The accuracy check corrected the initial JNI evaluation-order wording before acceptance.
