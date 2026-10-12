> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../V21-PROTOCOL.md).

# java/AGENTS.md

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `405aad9586d50c690de173e5c656a1bd2bc15fad1133abb45bb2761daea984e6`. Reviewed physical lines: 1-35.

[Module](../../L1-modules/contributor-policy.md) · [Symbols](../../L3-symbols/symbol-index.md) · [Behavior contracts](../../L3-symbols/behavior-contracts.md) · [Format](../../L3-symbols/format-spec.md) · [Entry](../../README.md)

## Role and visibility

Java/JNI contributor toolchain, formatting, API and documentation policy. (java/AGENTS.md:1-35)

## Complete range analysis

### Lines 1-8

The guide inherits root standards and requires the ./mvnw wrapper rather than system mvn so Maven version selection is controlled. (java/AGENTS.md:1-8)

### Lines 9-16

Formatting combines wrapper spotless:apply and Cargo fmt for lance-jni; check-only uses spotless:check. JNI lint uses cargo clippy --tests with that manifest. Compile/test use ./mvnw compile/test. The guide says pom.xml targets Java 11 and Rust should align with rust-toolchain.toml. Actual pom/toolchain contents and command success require separate verification. (java/AGENTS.md:9-16)

### Lines 17-27

Java sources live under java/src/main/java and Rust JNI under java/lance-jni. Group related options in Options/Params objects or builders; use typed enums with explicit Rust serialization rather than Java enum toString spelling and test each enum crossing. Public/IPC handles should be opaque protobuf-backed bytes rather than exposing internal data structures. (java/AGENTS.md:17-27)

### Lines 28-35

Prefer imports except ambiguity, JavaBean getXXX accessors for ecosystem compatibility, and Javadoc that repeats relevant Rust defaults/constraints/invariants so callers need no Rust source. (java/AGENTS.md:28-35)

## Interaction and interpretation limits

This is policy, not build evidence or complete binding signatures (java/AGENTS.md:7-35). The wrapper is not executed by this task.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | # Java Guidelines
    2 | 
    3 | Also see [root AGENTS.md](../AGENTS.md) for cross-language standards.
    4 | 
    5 | ## Commands
    6 | 
    7 | Use `./mvnw` instead of `mvn` to ensure the correct version of Maven is used.
    8 | 
    9 | * Format: `./mvnw spotless:apply && cargo fmt --manifest-path ./lance-jni/Cargo.toml --all`
   10 | * Format (check only): `./mvnw spotless:check`
   11 | * Lint Rust: `cargo clippy --tests --manifest-path ./lance-jni/Cargo.toml`
   12 | * Compile: `./mvnw compile`
   13 | * Test: `./mvnw test`
   14 | 
   15 | JDK: pom.xml targets Java 11 (`maven.compiler.release` 11); align Rust toolchain with repository `rust-toolchain.toml`.
   16 | 
   17 | ## Structure
   18 | 
   19 | * Java code: `java/src/main/java`
   20 | * Rust JNI bindings: `java/lance-jni`
   21 | 
   22 | ## API Design
   23 | 
   24 | - Encapsulate related/optional params in `XxxOptions`/`XxxParams` objects or use the builder pattern instead of growing argument lists.
   25 | - Use strongly-typed enums (not raw `String`s) for version/config values. Serialize via explicit fields (e.g., `toRustString()`) matching Rust-expected formats, not Java `SCREAMING_SNAKE_CASE` `toString()`. Test all enum values across the JNI boundary.
   26 | - Return protobuf-backed opaque handles (e.g., serialized `bytes`) from public APIs and IPC interfaces instead of exposing internal data structures.
   27 | 
   28 | ## Code Style
   29 | 
   30 | - Prefer top-level imports over fully qualified class names — only use fully qualified names to resolve ambiguity.
   31 | - Use JavaBean-style `getXXX()` for getter methods, not bare accessor style — serialization frameworks and IDE tooling rely on this convention.
   32 | 
   33 | ## Documentation
   34 | 
   35 | - Copy Rust docs (defaults, constraints, invariants) into Javadoc for binding classes — users shouldn't need to read Rust source to understand API behavior.
``````
