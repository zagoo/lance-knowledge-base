> **V2.1 navigation and contract layer.** Source reading is permitted. Production contracts retained from iteration 85 remain valid at the recorded snapshot. Historical line-count/test-coverage statements are provenance, not completeness requirements. Use [V2.1 protocol](../V21-PROTOCOL.md) and CORE-MANIFEST.json for current scope.

# Contributor policy

All six AGENTS.md files are accounted for. They prescribe development behavior; they are not proof the current source complies or that documented commands pass.

[Orientation](../L0-orientation.md) · [Build/test](../L4-crosscutting/build-and-test.md) · [Cookbook](../L4-crosscutting/cookbook.md)

| Guide | Coverage and key boundary |
|---|---|
| [Root](../L2-files/AGENTS.md.md) | Stable backward/forward compatibility; disposable unstable revisions; frozen legacy readers; bindings, test and PR standards. AGENTS.md:7-129 |
| [Rust](../L2-files/rust/AGENTS.md.md) | CPU closures must never wait, physical/stable IDs remain distinct, contextual errors and encoding safety rules. rust/AGENTS.md:7-90 |
| [Python](../L2-files/python/AGENTS.md.md) | Fresh-checkout make install, uv environment/commands, thin bindings and existing test files. python/AGENTS.md:7-40 |
| [Java](../L2-files/java/AGENTS.md.md) | Maven wrapper, JNI tooling, typed options/enums/opaque handles and Javadoc. java/AGENTS.md:7-35 |
| [Protobuf](../L2-files/protos/AGENTS.md.md) | Persisted-format versus wire change process, tag stability and presence semantics. protos/AGENTS.md:5-27 |
| [Format docs](../L2-files/docs/src/format/AGENTS.md.md) | Vote and implementation separation; exact schemas, evolution mechanics and complete algorithms. docs/src/format/AGENTS.md:5-20 |

Legacy read behavior must be preserved, but new feature design belongs in current writers/formats. A shared legacy edit requires isolation and released historical fixtures. This must be evaluated per path's actual emission/support state, not by a filename alone. (AGENTS.md:13-17)

All feature/bug fixes need tests. Dataset operations need multiple fragments; index tests need null/empty cases; vector tests assert recall >=0.5. Tests target short local cases without weakening assertions. These are development gates, not outcomes of this KB task. (AGENTS.md:80-102)

Public API signatures are preserved through deprecation and new APIs; validation stays in Rust, names remain consistent across language bindings, and mutually exclusive flags should become modes. Exact existing signatures still require implementation analysis. (AGENTS.md:52-57)
