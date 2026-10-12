# Key File: rust/lance-index/src/registry.rs

**V2.1 selected contract record.** Verified entry/protocol ranges: `26-177`. The rest of this file has Module Map coverage; this is not a claim of line-by-line analysis. Tests/generated code are excluded. [Module Map](../../../../L1-modules/rust-lance-index.md).

## Responsibility and interfaces

Connects persisted detail type names and friendly plugin names to concrete scalar plugins.

Registration derives a lowercase name and records full protobuf identities.

Default registration adds only explicit historical aliases.

Use supports_details for supported identity checks; lookup by name has a different purpose.

## Behavior and change boundaries

### Registration identity

add_plugin derives the plugin key from the detail message name; supports_details checks a registered full protobuf name after the final slash, case-insensitively. Friendly-name lookup alone is not that identity guard. (rust/lance-index/src/registry.rs:26-177)

## Read next

Use the owning Module Map for callers/callees and the L0 trace for publication/query ordering. Exact implementation details outside the verified ranges require source reading; do not infer stronger validation or rollback guarantees from this record.
