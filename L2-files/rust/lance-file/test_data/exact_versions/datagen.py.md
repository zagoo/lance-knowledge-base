> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-file/test_data/exact_versions/datagen.py

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `c679ed626673a13af4e6c09df8db944efb9033ef64298027cde2b223e49c29a8`. Reviewed physical lines: 1-129.

[Module](../../../../../L1-modules/rust-lance-file-v20-compatibility.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Standalone Python baseline-fixture orchestrator using only standard-library modules. It checks exact Git HEAD/cleanliness, temporarily installs a Rust example in the baseline checkout, runs two generators, compares output and optionally overwrites the six checked fixtures. This is not a Python binding API. (rust/lance-file/test_data/exact_versions/datagen.py:1-129)

## Complete range analysis

### Lines 1-22

SPDX and standard argparse/hashlib/os/shutil/subprocess/tempfile/Path imports. BASELINE_COMMIT exact40hex and FIXTURE_NAMES six entries in V1,V20,V21,V22,self-described,mini order. No Lance package version import/assertion; reproducibility guard is Git commit. (rust/lance-file/test_data/exact_versions/datagen.py:1-22)

### Lines 23-31

git_output runs argv git -C source with check=True,captured text, strips stdout; subprocess errors propagate with no local catch. No shell interpolation. (rust/lance-file/test_data/exact_versions/datagen.py:23-31)

### Lines 32-40

generate builds rust/lance-file/examples path and exact_version_fixture_generator.rs, remembers whether examples existed, creates directory, refuses replacing an existing target, then copies generator. Refusal/copy errors occur before try/finally, so a newly created directory or partial copy is not guaranteed cleanup on those paths. (rust/lance-file/test_data/exact_versions/datagen.py:32-40)

### Lines 41-64

Copy environment, override only CARGO_TARGET_DIR, run cargo run -p lance-file --example exact_version_fixture_generator -- output in baseline source with check=True. No --locked,--offline,profile override or toolchain pin in argv. finally unlinks target and removes examples if newly created; rmdir/unlink errors can mask Cargo error, concurrent contents can prevent rmdir. Other build modifications are not explicitly restored or checked afterward. (rust/lance-file/test_data/exact_versions/datagen.py:41-64)

### Lines 65-85

digest reads whole file and computes SHA256 hex. main parser requires Path --source, optional boolean --write; help promises replacement after runs agree. argparse rejects invalid CLI shape through its normal behavior. (rust/lance-file/test_data/exact_versions/datagen.py:65-85)

### Lines 86-95

Resolve source, demand exact git HEAD and empty porcelain status before generation; otherwise RuntimeError includes source/baseline. Fixture dir derives from resolved __file__, generator is sibling datagen.rs. No post-generation clean check or checksum validation of the generator itself. (rust/lance-file/test_data/exact_versions/datagen.py:86-95)

### Lines 96-108

Create two temporary output directories and one temporary Cargo target directory; both generate calls are sequential separate cargo-run processes sharing that target directory. Context managers clean temporary directories on unwind. It does not create separate target dirs per run or concurrent processes. (rust/lance-file/test_data/exact_versions/datagen.py:96-108)

### Lines 109-125

For each fixed name, read both whole outputs and compare bytes; mismatch errors immediately. With --write copy first output to checked fixture immediately; otherwise require existing checked fixture equal. Print name/digest after each success. This is per-file validation/publication, not all-six atomic replacement: an earlier fixture may be replaced before a later mismatch/failure. Missing output read errors propagate; no README-hash table comparison. (rust/lance-file/test_data/exact_versions/datagen.py:109-125)

### Lines 126-129

Only script entry __name__==__main__ invokes main. No catch/rollback/retry layer, imported library side effects beyond declarations, or embedded test case. (rust/lance-file/test_data/exact_versions/datagen.py:126-129)

## Interaction and interpretation limits

All129 lines read without executing/importing the script. Its workflow writes into the supplied baseline checkout and may run Cargo/network/build side effects; none was authorized or needed for this read-only KB analysis. Pinning commit is observed; dependency/environment reproducibility and runtime success remain unverified.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | # SPDX-License-Identifier: Apache-2.0
    2 | # SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | import argparse
    5 | import hashlib
    6 | import os
    7 | import shutil
    8 | import subprocess
    9 | import tempfile
   10 | from pathlib import Path
   11 | 
   12 | BASELINE_COMMIT = "3a72f8a61e14613f517dded6816d4bfc77817c93"
   13 | FIXTURE_NAMES = (
   14 |     "v1.lance",
   15 |     "v2_0.lance",
   16 |     "v2_1.lance",
   17 |     "v2_2.lance",
   18 |     "v2_0_self_described.lance",
   19 |     "v2_0_mini.lance",
   20 | )
   21 | 
   22 | 
   23 | def git_output(source: Path, *args: str) -> str:
   24 |     return subprocess.run(
   25 |         ["git", "-C", source, *args],
   26 |         check=True,
   27 |         capture_output=True,
   28 |         text=True,
   29 |     ).stdout.strip()
   30 | 
   31 | 
   32 | def generate(source: Path, generator: Path, output: Path, target: Path) -> None:
   33 |     examples = source / "rust/lance-file/examples"
   34 |     target_generator = examples / "exact_version_fixture_generator.rs"
   35 |     created_examples = not examples.exists()
   36 |     examples.mkdir(parents=True, exist_ok=True)
   37 |     if target_generator.exists():
   38 |         raise RuntimeError(f"refusing to replace existing {target_generator}")
   39 | 
   40 |     shutil.copyfile(generator, target_generator)
   41 |     try:
   42 |         env = os.environ.copy()
   43 |         env["CARGO_TARGET_DIR"] = str(target)
   44 |         subprocess.run(
   45 |             [
   46 |                 "cargo",
   47 |                 "run",
   48 |                 "-p",
   49 |                 "lance-file",
   50 |                 "--example",
   51 |                 "exact_version_fixture_generator",
   52 |                 "--",
   53 |                 str(output),
   54 |             ],
   55 |             cwd=source,
   56 |             env=env,
   57 |             check=True,
   58 |         )
   59 |     finally:
   60 |         target_generator.unlink(missing_ok=True)
   61 |         if created_examples:
   62 |             examples.rmdir()
   63 | 
   64 | 
   65 | def digest(path: Path) -> str:
   66 |     return hashlib.sha256(path.read_bytes()).hexdigest()
   67 | 
   68 | 
   69 | def main() -> None:
   70 |     parser = argparse.ArgumentParser(
   71 |         description="Reproduce exact-version fixtures with the locked baseline writers."
   72 |     )
   73 |     parser.add_argument(
   74 |         "--source",
   75 |         type=Path,
   76 |         required=True,
   77 |         help=f"clean Lance checkout at {BASELINE_COMMIT}",
   78 |     )
   79 |     parser.add_argument(
   80 |         "--write",
   81 |         action="store_true",
   82 |         help="replace the checked-in fixtures after both baseline runs agree",
   83 |     )
   84 |     args = parser.parse_args()
   85 | 
   86 |     source = args.source.resolve()
   87 |     if git_output(source, "rev-parse", "HEAD") != BASELINE_COMMIT:
   88 |         raise RuntimeError(
   89 |             f"{source} must be checked out at baseline commit {BASELINE_COMMIT}"
   90 |         )
   91 |     if git_output(source, "status", "--porcelain"):
   92 |         raise RuntimeError(f"{source} must be clean before fixture generation")
   93 | 
   94 |     fixture_dir = Path(__file__).resolve().parent
   95 |     generator = fixture_dir / "datagen.rs"
   96 |     with (
   97 |         tempfile.TemporaryDirectory(prefix="lance-exact-fixtures-a-") as first_dir,
   98 |         tempfile.TemporaryDirectory(prefix="lance-exact-fixtures-b-") as second_dir,
   99 |         tempfile.TemporaryDirectory(
  100 |             prefix="lance-exact-fixtures-target-"
  101 |         ) as target_dir,
  102 |     ):
  103 |         first = Path(first_dir)
  104 |         second = Path(second_dir)
  105 |         target = Path(target_dir)
  106 |         generate(source, generator, first, target)
  107 |         generate(source, generator, second, target)
  108 | 
  109 |         for name in FIXTURE_NAMES:
  110 |             first_path = first / name
  111 |             second_path = second / name
  112 |             if first_path.read_bytes() != second_path.read_bytes():
  113 |                 raise RuntimeError(f"separate baseline runs disagree for {name}")
  114 | 
  115 |             checked_path = fixture_dir / name
  116 |             if args.write:
  117 |                 shutil.copyfile(first_path, checked_path)
  118 |             elif (
  119 |                 not checked_path.exists()
  120 |                 or checked_path.read_bytes() != first_path.read_bytes()
  121 |             ):
  122 |                 raise RuntimeError(
  123 |                     f"{name} differs from the reproducible baseline; rerun with --write"
  124 |                 )
  125 |             print(f"{name}: {digest(first_path)}")
  126 | 
  127 | 
  128 | if __name__ == "__main__":
  129 |     main()
``````
