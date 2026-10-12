> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../V21-PROTOCOL.md).

# python/AGENTS.md

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `58fbd72a27d66ffe7ecc12365a8e7a07c77838d8a4ba786dcdad2ba13786b225`. Reviewed physical lines: 1-40.

[Module](../../L1-modules/contributor-policy.md) · [Symbols](../../L3-symbols/symbol-index.md) · [Behavior contracts](../../L3-symbols/behavior-contracts.md) · [Format](../../L3-symbols/format-spec.md) · [Entry](../../README.md)

## Role and visibility

Python contributor environment, build/test/lint, release, binding design and test placement contract. It specifies how to work on the package rather than defining Python runtime APIs. (python/AGENTS.md:1-40)

## Complete range analysis

### Lines 1-6

The Python guide links root standards and introduces command requirements. (python/AGENTS.md:1-6)

### Lines 7-20

Use uv for setup. In a fresh checkout/worktree first run make install from python/, which performs uv sync, includes default dev/test groups, builds the Rust extension and installs pre-commit hooks. Add optional groups/extras only as needed; do not interrupt a slow build or switch managers. Resync only after dependency changes. Repository Python commands run via uv run; bare python/pytest/pip/maturin and bare test/doctest/lint/format Make targets are prohibited. Correct an out-of-workflow invocation before declaring a failure. Listed build target is make build after Rust changes; tests, a targeted pytest selection, doctest, lint and format use the exact uv commands preserved below. No such command ran during this read-only extraction. (python/AGENTS.md:7-20)

### Lines 21-30

RC/beta wheel policy includes Fury, with an example disposable uv venv and uv pip install --pre against the Lance Fury index for pylance==7.2.0b4. This is a repository-provided example, not verified current package availability or a request to access the network. (python/AGENTS.md:21-30)

### Lines 31-37

Keep validation in Rust, expose optional behavior through named Python arguments rather than mirroring Rust config builders, pass every dataclass field via PyO3 (Rust None becomes py.None rather than omission), use parameterized type hints, and keep docstrings aligned. (python/AGENTS.md:31-37)

### Lines 38-40

Extend the existing test_{module}.py for a module instead of creating a parallel test file. (python/AGENTS.md:38-40)

## Interaction and interpretation limits

Environment commands are preserved as policy only; no install/build/network action was performed (python/AGENTS.md:7-29). Python API and PyO3 implementations remain separate pending files.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | # Python Guidelines
    2 | 
    3 | Also see [root AGENTS.md](../AGENTS.md) for cross-language standards.
    4 | 
    5 | ## Commands
    6 | 
    7 | * Environment: use `uv` for all local Python environment setup in this repository.
    8 | * First step in every new worktree or fresh checkout: run `make install` from `python/` before any Python command. This runs `uv sync` (dev and test dependencies are included by default via `[tool.uv] default-groups`) and sets up pre-commit hooks. Add `--group benchmarks`, `--extra torch`, or `--extra geo` only when needed.
    9 | * `uv sync` builds the local `pylance` Rust extension as part of environment setup. This can take a long time. Start it early, let it finish, and do not interrupt it or switch to a different setup path just because the build is slow.
   10 | * Only run `uv sync` again when dependencies change (e.g., after pulling new commits that update `pyproject.toml` or `uv.lock`).
   11 | * Command execution: always use `uv run ...` for Python-related repository commands. Do not rely on a globally activated environment.
   12 | * Never invoke bare `python`, `pytest`, `pip`, `maturin`, `make test`, `make doctest`, `make lint`, or `make format` for repository work.
   13 | * If a Python command fails outside `uv run`, that does not count as a dependency or test failure. Fix the environment usage first and rerun correctly.
   14 | * Build: `make build` (required after Rust changes)
   15 | * Test: `uv run make test`
   16 | * Run single test: `uv run pytest python/tests/<test_file>.py::<test_name>`
   17 | * Doctest: `uv run make doctest`
   18 | * Lint: `uv run make lint`
   19 | * Format: `uv run make format`
   20 | 
   21 | ## Beta Releases
   22 | 
   23 | - Python RC and beta preview wheels are published on fury.io, not only PyPI. When a task needs a beta version such as `7.2.0b4`, use a disposable venv and install with `--pre` and the Lance fury indices:
   24 |   ```shell
   25 |   uv venv /path/to/venv
   26 |   uv pip install --python /path/to/venv/bin/python --pre \
   27 |       --extra-index-url https://pypi.fury.io/lance-format/ \
   28 |       "pylance==7.2.0b4"
   29 |   ```
   30 | 
   31 | ## API Design
   32 | 
   33 | - Keep bindings as thin wrappers — centralize validation and logic in Rust core.
   34 | - Extend existing methods with named arguments instead of adding new methods that accept policy/config objects — the Python API should feel Pythonic (e.g., `cleanup_old_versions(..., retain_versions=N)`), not mirror Rust builder patterns.
   35 | - Pass all fields to Python dataclass constructors via PyO3, converting Rust `None` to `py.None()` instead of omitting args — dataclass constructors require all positional params.
   36 | - Use parameterized type hints (e.g., `list[DatasetBasePath]`, `Optional[Dict[str, str]]`) — never bare generics. Keep docstring type descriptions in sync with hints.
   37 | 
   38 | ## Testing
   39 | 
   40 | - Add tests to existing `test_{module}.py` files rather than creating new test files for the same module.
``````
