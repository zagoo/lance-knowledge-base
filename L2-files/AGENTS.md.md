> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../V21-PROTOCOL.md).

# AGENTS.md

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `3eed300bc61792c7566d99e351c0c8510a30ffe9fd5ea3eee7ca3938650a58e9`. Reviewed physical lines: 1-129.

[Module](../L1-modules/contributor-policy.md) · [Symbols](../L3-symbols/symbol-index.md) · [Behavior contracts](../L3-symbols/behavior-contracts.md) · [Format](../L3-symbols/format-spec.md) · [Entry](../README.md)

## Role and visibility

Repository-wide maintainer intent and contributor policy, not executable implementation. It defines stability, legacy boundaries, environment contracts, code/test/documentation standards and PR procedures. (AGENTS.md:1-129)

## Complete range analysis

### Lines 1-6

The project description identifies an ML-oriented columnar format emphasizing random access, vector search, versioning and integrations, with an aspirational de facto standard goal. Links delegate additional rules to Rust, Python, Java, protobuf and format-documentation guides. This description is not a benchmark or service guarantee. (AGENTS.md:1-6)

### Lines 7-18

Stable formats require backward and forward compatibility against released stable contracts. Exclusively unstable revisions are disposable and must not accumulate compatibility migrations/tests for prior unstable layouts. Intermediate branch/main states are not released compatibility constraints. Legacy paths no current writer emits are frozen: preserve reading, build new features in current paths, and avoid unrelated legacy refactors. Unavoidable shared-boundary edits must be isolated and covered by released historical fixtures. (AGENTS.md:7-18)

### Lines 19-33

Prescribed Rust commands include workspace check with tests/benches; workspace or targeted package tests; clippy --all --tests --benches with warnings denied; cargo fmt --all; nightly llvm-cov branch coverage (optionally HTML); and ci/coverage.py. Use repository profiles, release-with-debug for benchmarks/profiling, and release-no-lto only when appropriate for local debugging, IO-bound or compile-sensitive investigations. These are documented commands, not confirmed successful invocations or proof every named profile is defined in this checkout. (AGENTS.md:19-33)

### Lines 34-39

Language-specific environment instructions must precede tooling. Do not switch managers/toolchains merely because tooling is missing or slow. A command run outside the documented workflow is first an environment usage error; correct usage and rerun before reporting a dependency/tool failure. (AGENTS.md:34-39)

### Lines 40-51

Code/examples/comments use English and prioritize readability; comments explain non-obvious reasons. Remove stdout/debug prints in favor of logging. Add helpers only for real cognitive/duplication benefit, keep PRs focused, avoid collecting RecordBatch streams, and prefer RoaringBitmap to HashSet<u32>. These are maintainer rules, not claims that every existing file complies. (AGENTS.md:40-51)

### Lines 52-58

Keep Python/Java bindings thin and core validation in Rust. Maintain parameter names across languages. Preserve public signatures using deprecation plus new APIs. Replace mutually exclusive booleans with one mode/enum. (AGENTS.md:52-58)

### Lines 59-72

Names describe the value, avoid redundant domain prefixes, consistently use indices, use storage-neutral base terminology, and update every reference when renaming. Validate invalid/mutually exclusive options at boundaries without clamping; errors include relevant names, values, sizes and types. (AGENTS.md:59-72)

### Lines 73-79

Prefer standard/existing dependencies, intentional lock changes, documented pins for broken dependencies and optional feature gates/domain crates. Workspace dependency edits must update root, Python and JNI lockfiles, including cargo check against the excluded Python/JNI manifests; cargo-lock-sync is the stated offline enforcement hook. Actual hook implementation is pending analysis. (AGENTS.md:73-79)

### Lines 80-91

Every feature/bugfix requires tests. Local cases target under one second with small fixtures and split matrices, never weakened assertions/recall. Parameterize input-only differences with named rstest cases or pytest.parametrize; assert rather than print; extend existing tests; skipped tests require issue URLs. Dataset tests include multiple fragments; index cases cover null items/all-null/empty/null columns; vector creation must assert recall >=0.5. Compatibility fixtures live in test_data with datagen.py asserting writer version and copy_test_data_to_tmp for reads. (AGENTS.md:80-91)

### Lines 92-103

Rust doctests must compile an async helper rather than use ignore; the embedded example imports Dataset/Result and invokes dataset.delete with an ID predicate. The hidden function wrapper demonstrates compile-checking async APIs without executing them. Test utilities use cfg_attr(coverage, coverage(off)). Code fences and blank lines delimit the literal example. (AGENTS.md:92-103)

### Lines 104-111

Public APIs need documentation/examples and links; hierarchical diagrams use ASCII; examples follow current signatures; MkDocs admonition bodies use four-space indentation; proofread comments/docs. The KB itself is external documentation, so these describe future repository editing obligations. (AGENTS.md:104-111)

### Lines 112-116

CLI/API-created issues require explicit bug/feature/performance labels because forms are bypassed. Titles use bug:/feature:/perf: with a workflow labeler as fallback, not a replacement for labels. (AGENTS.md:112-116)

### Lines 117-122

Before PR creation search for duplicates and inspect linked PR state/scope. Conventional Commit titles are enforced by commitlint workflow. Before PR creation/update run every touched language's prescribed lint, including full Rust fmt/clippy and Python uv-run lint; if blocked, state the reason in the PR summary. This KB task creates no PR and its no-network/read-only constraints remain in force. (AGENTS.md:117-122)

### Lines 123-129

Reviews prioritize scarce maintainer attention: concise P0/P1 severe correctness/performance/security findings, avoid repeating praise/change descriptions, and check naming/errors/tests. This review policy does not reduce the user's exhaustive KB scope. (AGENTS.md:123-129)

## Interaction and interpretation limits

Contributor requirements are authoritative policy, not evidence that the current build passes or every file follows them (AGENTS.md:7-129). Referenced scripts, profiles, workflows and fixtures require separate source coverage.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | # AGENTS.md
    2 | 
    3 | Lance is a modern columnar data format optimized for ML workflows and datasets, providing high-performance random access, vector search, zero-copy automatic versioning, and ecosystem integrations. The vision is to become the de facto standard columnar data format for machine learning and large language models.
    4 | 
    5 | Also see directory-specific guidelines: [rust/](rust/AGENTS.md) | [python/](python/AGENTS.md) | [java/](java/AGENTS.md) | [protos/](protos/AGENTS.md) | [docs/src/format/](docs/src/format/AGENTS.md)
    6 | 
    7 | ## File Format Stability and Compatibility
    8 | 
    9 | - Treat every file format marked stable as a durable compatibility contract. All changes to a stable format must preserve both backward and forward compatibility.
   10 | - Treat every file format marked unstable as disposable. It may change freely; do not add compatibility code, migrations, fallbacks, or tests for files written by earlier unstable revisions.
   11 | - Evaluate compatibility against the latest released stable version while continuing to honor all stable format contracts. Changes that exist only on the current branch or `main` are not compatibility constraints; do not compromise a cleaner or more complete design to preserve those intermediate states.
   12 | 
   13 | ### Legacy Compatibility Boundaries
   14 | 
   15 | - Treat formats and code paths that current writers no longer emit as frozen compatibility surfaces. Preserve their existing read behavior, but exclude them from new feature design unless legacy support is explicitly required.
   16 | - Implement new features in the current format and write paths. Do not extend legacy writers, retrofit new capabilities into legacy readers, or reuse legacy implementations as the foundation for new code.
   17 | - Avoid refactoring or otherwise modifying legacy code during feature work. If a shared boundary makes a legacy change unavoidable, isolate the change, preserve existing behavior, and add targeted regression coverage using released historical fixtures.
   18 | 
   19 | ## Development Commands
   20 | 
   21 | ### Rust
   22 | 
   23 | * Check: `cargo check --workspace --tests --benches`
   24 | * Test: `cargo test --workspace` or `cargo test -p <package> <test_name>`
   25 | * Lint: `cargo clippy --all --tests --benches -- -D warnings`
   26 | * Format: `cargo fmt --all`
   27 | * Coverage: `cargo +nightly llvm-cov -q -p <crate> --branch`
   28 | * Coverage HTML: `cargo +nightly llvm-cov -q -p <crate> --branch --html`
   29 | * Coverage for file: `python ci/coverage.py -p <crate> -f <file_path>`
   30 | * Use repository-defined Cargo profiles instead of ad hoc LTO overrides.
   31 | * Use `release-with-debug` for benchmarks and profiling so optimized builds keep debug symbols without a rebuild.
   32 | * Use `release-no-lto` only for local debugging, IO-bound benchmarks, or compile-time-sensitive performance investigation where LTO would not affect the measured bottleneck.
   33 | 
   34 | ## Language-Specific Environment Contract
   35 | 
   36 | - For language-specific tasks, always follow the environment and command rules in the corresponding subdirectory guide before running build, test, lint, format, or tooling commands.
   37 | - Do not substitute a different environment manager or toolchain just because a command appears missing, unavailable, or slow.
   38 | - If a language-specific command fails outside the documented workflow, treat that as an environment usage mistake first. Fix the environment usage, rerun with the prescribed commands, and only then conclude that a dependency or tool is unavailable.
   39 | 
   40 | ## Coding Standards
   41 | 
   42 | ### General
   43 | 
   44 | - Always use English in code, examples, and comments.
   45 | - Code is for readability, not just execution. Only add meaningful comments and tests.
   46 | - Comments should explain non-obvious "why" reasoning, not restate what the code does.
   47 | - Remove debug prints (`println!`, `dbg!`, `print()`) before merging — use `tracing` or logging frameworks.
   48 | - Think carefully before adding a helper: only introduce one when it materially reduces cognitive load or eliminates substantial duplication, and do not add thin wrappers that only rename or forward existing calls.
   49 | - Keep PRs focused — no drive-by refactors, reformatting, or cosmetic changes.
   50 | - Be mindful of memory use: avoid collecting streams of `RecordBatch` into memory; use `RoaringBitmap` instead of `HashSet<u32>`.
   51 | 
   52 | ### Cross-Language Bindings
   53 | 
   54 | - Keep Python and Java bindings as thin wrappers — centralize validation and logic in the Rust core.
   55 | - Keep parameter names consistent across all bindings (Rust, Python, Java) — rename everywhere or nowhere.
   56 | - Never break public API signatures — deprecate with `#[deprecated]`/`@deprecated` and add a new method.
   57 | - Replace mutually exclusive boolean flags with a single enum/mode parameter.
   58 | 
   59 | ### Naming
   60 | 
   61 | - Name variables after what the value *is* (e.g., `partition_id` not `mask`) — precise names act as inline docs.
   62 | - Drop redundant prefixes when the struct/module already implies the domain.
   63 | - Use `indices` (not `indexes`) consistently in all APIs and docs.
   64 | - Use storage-agnostic terms in API names (e.g., `base` not `bucket`).
   65 | - When renaming a type/struct/enum, update all references (methods, fields, variables, test names).
   66 | 
   67 | ### Error Handling
   68 | 
   69 | - Validate inputs and reject invalid values with descriptive errors at API boundaries — never silently clamp or adjust.
   70 | - Validate mutually exclusive options in builders/configs — throw a clear error if both are set.
   71 | - Include full context in error messages: variable names, values, sizes, types.
   72 | 
   73 | ### Dependencies
   74 | 
   75 | - Prefer implementing functionality with the standard library or existing workspace dependencies before adding new external crates.
   76 | - Keep `Cargo.lock` changes intentional; revert unrelated dependency bumps. Pin broken deps with a comment linking the upstream issue.
   77 | - The repo has three lockfiles: the root `Cargo.lock`, `python/Cargo.lock`, and `java/lance-jni/Cargo.lock` (the latter two are excluded from the workspace). A `workspace.dependencies` change must be reflected in all three — refresh the excluded ones with `cargo check --manifest-path python/Cargo.toml` and `cargo check --manifest-path java/lance-jni/Cargo.toml`, then commit the updated lockfiles. The `cargo-lock-sync` pre-commit hook catches a miss offline.
   78 | - Gate optional/domain-specific deps behind Cargo feature flags. Prefer separate crates for domain functionality (geo, NLP).
   79 | 
   80 | ## Testing Standards
   81 | 
   82 | - **All bugfixes and features must have corresponding tests. We do not merge code without tests.**
   83 | - Keep local unit tests lightweight: each test case should finish within one second on typical developer hardware. Split independent parameter matrices and use the smallest fixture or model that preserves the asserted behavior; do not relax assertions, coverage, or recall thresholds to meet the budget.
   84 | - Use `rstest` (Rust) or `@pytest.mark.parametrize` (Python) for tests that differ only in inputs. Use `#[case::{name}(...)]` for readable case names.
   85 | - Replace `print()` in tests with `assert` — prints don't catch regressions.
   86 | - Extend existing tests instead of adding overlapping new ones. Add to existing test files.
   87 | - Link a GitHub issue when skipping a test — never bare `@pytest.mark.skip` or `@Ignore` without a tracking URL.
   88 | - Include multi-fragment scenarios for dataset operations (reads, indexes, scans).
   89 | - Cover NULL edge cases in index tests: null items, all-null collections, empty collections, null columns.
   90 | - Vector index tests must assert recall metrics (>=0.5 threshold), not just verify creation succeeds.
   91 | - For backwards compatibility, use the `test_data` directory with checked-in datasets from older versions. Include a `datagen.py` that asserts the Lance version used. Use `copy_test_data_to_tmp` to read this data.
   92 | - Avoid `ignore` in doctests — write Rust doctests that compile a function instead:
   93 |   ```
   94 |   /// ```
   95 |   /// # use lance::{Dataset, Result};
   96 |   /// # async fn test(dataset: &Dataset) -> Result<()> {
   97 |   /// dataset.delete("id = 25").await?;
   98 |   /// # Ok(())
   99 |   /// # }
  100 |   /// ```
  101 |   ```
  102 | - Skip coverage for test utilities using `#[cfg_attr(coverage, coverage(off))]`.
  103 | 
  104 | ## Documentation Standards
  105 | 
  106 | - All public APIs must have documentation with examples. Link to relevant structs and methods.
  107 | - Use ASCII tree diagrams for hierarchical structures (encoding layers, file formats, storage layouts).
  108 | - Keep doc examples in sync with actual API signatures — update when refactoring.
  109 | - Indent content under MkDocs admonition directives (`!!! note`, etc.) with 4 spaces.
  110 | - Proofread comments and docs for typos before committing.
  111 | 
  112 | ## Filing Issues
  113 | 
  114 | - When opening an issue with `gh issue create` or the API, classify it and pass the matching label: `--label bug`, `--label feature`, or `--label performance`. These paths bypass the `.github/ISSUE_TEMPLATE` forms, so the label is not applied automatically.
  115 | - Prefix the title to match, e.g. `bug: ...`, `feature: ...`, or `perf: ...`. A content-based labeler (`.github/workflows/issue-labeler.yml`) uses this as a fallback signal, but an explicit `--label` is the reliable path.
  116 | 
  117 | ## Pull Requests
  118 | 
  119 | - Before creating a PR, search for similar PRs and inspect any PRs linked to the issue being addressed. If a matching PR exists, verify its current status and scope before proceeding to avoid creating duplicate work.
  120 | - PR titles must follow the Conventional Commits specification because `.github/workflows/pr-title.yml` validates the PR title and body with commitlint. Use prefixes like `feat:`, `fix:`, `docs:`, `perf:`, `ci:`, `test:`, `build:`, `style:`, or `chore:`; add a scope when useful.
  121 | - Before creating or updating a PR, run the lint checks for every touched language surface, even when they are expensive. For Rust changes, run `cargo fmt --all` and `cargo clippy --all --tests --benches -- -D warnings`. For Python changes, follow the environment workflow in `python/AGENTS.md` and run `uv run make lint` from `python/`. If a required lint check cannot be run, state the blocker explicitly in the PR summary.
  122 | 
  123 | ## Review Guidelines
  124 | 
  125 | Contributor and maintainer attention is the most valuable resource. Less is more.
  126 | 
  127 | - Be concise and clear. Focus on P0/P1 issues: severe bugs, performance degradation, security concerns.
  128 | - Do not reiterate detailed changes or repeat what's already well done.
  129 | - Check naming consistency, error handling patterns, and test coverage.
``````
