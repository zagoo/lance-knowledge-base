> **V2.1 navigation and contract layer.** Source reading is permitted. Production contracts retained from iteration 85 remain valid at the recorded snapshot. Historical line-count/test-coverage statements are provenance, not completeness requirements. Use [V2.1 protocol](../V21-PROTOCOL.md) and CORE-MANIFEST.json for current scope.

# Core AIMD rate control

**Retained AIMD production contract.** Historical test instrumentation and seed corpora are archived; production consumer navigation is addressed in M2/M3. [Core](rust-lance-core.md) · [Orientation](../L0-orientation.md) · [Symbols](../L3-symbols/symbol-index.md) · [Tests](../L4-crosscutting/build-and-test.md).

## AIMD configuration and rate contract

AimdConfig exposes public fields and consuming with_* methods. Builders merely replace values; validate and AimdController::new reject bad configurations with InvalidInput. All six floating values must be finite. Positive initial/min/increment,0<decrease<1,nonzero duration,threshold in[0,1],initial>=min and (when max>0) min<=max and initial<=max are required. max0 disables the ceiling, including signed negative zero; a negative nonzero max fails. Error precedence follows that validation order. (rust/lance-core/src/utils/aimd.rs:20-185)

| Setting | Default | Meaning |
|---|---|---|
| initial_rate | 2000 | Initial returned rate |
| min_rate | 1 | Floor after decrease |
| max_rate | 5000 | Ceiling after increase;0 disables |
| decrease_factor | 0.5 | Multiply on a throttled window |
| additive_increment | 300 | Add per evaluated successful window |
| window_duration | 1 second | Minimum duration before evaluating previous outcomes |
| throttle_threshold | 0 | Decrease only when prior-window throttle fraction is strictly greater |

All defaults and their request-per-second units are declared locally; the40%-to-full-in10seconds description assumes nonempty successful windows and timely boundary-triggering calls. (rust/lance-core/src/utils/aimd.rs:20-55; rust/lance-core/src/utils/aimd.rs:238-289)

RequestOutcome is Success or Throttled. Its docs instruct treating non-throttle failures such as404/timeouts as Success for this capacity signal; the module supplies no classifier. Controller holds immutable config plus Mutex-protected rate/start/counts. new validates, initializes rate and current Instant, and zeroes counts. record_outcome takes the lock, observes now and first evaluates the preceding window when elapsed>=duration. A nonempty window with ratio>threshold sets max(rate*factor,min); otherwise adds increment and applies the optional ceiling. Empty expired windows do not adjust. (rust/lance-core/src/utils/aimd.rs:187-275)

After expiration it sets start=now and zeroes both counts, then records the incoming outcome in the new window. Long idle gaps cause at most one evaluation, with no catch-up loop. current_rate only reads; it cannot advance a window. Thus no background timer, token acquisition, sleep or IO enforces the returned rate. Threshold equality follows additive increase; the test comment saying >=50% should decrease is broader than the actual > implementation and its2/3 fixture. (rust/lance-core/src/utils/aimd.rs:238-290; rust/lance-core/src/utils/aimd.rs:595-621)

Mutex poison panics through unwrap in record_outcome/current_rate; Debug calls current_rate and shares that risk. u64 counts/addition have no checked arithmetic. Even finite validated values can overflow unlimited f64 additive growth to infinity; enabled finite ceiling caps the increased result. There is no post-update finiteness check. These are source-level boundaries, not measured runtime failures. (rust/lance-core/src/utils/aimd.rs:213-289)

## Exact public declarations

| Qualified symbol | Kind | Exact declaration | Evidence and full body |
|---|---|---|---|
| `<lance_core::utils::aimd::AimdConfig as Default>::<implementation>` | implementation | `impl Default for AimdConfig {` | [rust/lance-core/src/utils/aimd.rs:44-44](../L2-files/rust/lance-core/src/utils/aimd.rs.md) |
| `<lance_core::utils::aimd::AimdConfig as Default>::default` | method/function | `fn default() -> Self {` | [rust/lance-core/src/utils/aimd.rs:45-45](../L2-files/rust/lance-core/src/utils/aimd.rs.md) |
| `<lance_core::utils::aimd::AimdController as std::fmt::Debug>::<implementation>` | implementation | `impl std::fmt::Debug for AimdController {` | [rust/lance-core/src/utils/aimd.rs:213-213](../L2-files/rust/lance-core/src/utils/aimd.rs.md) |
| `<lance_core::utils::aimd::AimdController as std::fmt::Debug>::fmt` | method/function | `fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {` | [rust/lance-core/src/utils/aimd.rs:214-214](../L2-files/rust/lance-core/src/utils/aimd.rs.md) |
| `lance_core::utils::aimd::AimdConfig` | struct | `pub struct AimdConfig {` | [rust/lance-core/src/utils/aimd.rs:34-34](../L2-files/rust/lance-core/src/utils/aimd.rs.md) |
| `lance_core::utils::aimd::AimdConfig::<implementation>` | implementation | `impl AimdConfig {` | [rust/lance-core/src/utils/aimd.rs:58-58](../L2-files/rust/lance-core/src/utils/aimd.rs.md) |
| `lance_core::utils::aimd::AimdConfig::additive_increment` | field | `pub additive_increment: f64,` | [rust/lance-core/src/utils/aimd.rs:39-39](../L2-files/rust/lance-core/src/utils/aimd.rs.md) |
| `lance_core::utils::aimd::AimdConfig::decrease_factor` | field | `pub decrease_factor: f64,` | [rust/lance-core/src/utils/aimd.rs:38-38](../L2-files/rust/lance-core/src/utils/aimd.rs.md) |
| `lance_core::utils::aimd::AimdConfig::initial_rate` | field | `pub initial_rate: f64,` | [rust/lance-core/src/utils/aimd.rs:35-35](../L2-files/rust/lance-core/src/utils/aimd.rs.md) |
| `lance_core::utils::aimd::AimdConfig::max_rate` | field | `pub max_rate: f64,` | [rust/lance-core/src/utils/aimd.rs:37-37](../L2-files/rust/lance-core/src/utils/aimd.rs.md) |
| `lance_core::utils::aimd::AimdConfig::min_rate` | field | `pub min_rate: f64,` | [rust/lance-core/src/utils/aimd.rs:36-36](../L2-files/rust/lance-core/src/utils/aimd.rs.md) |
| `lance_core::utils::aimd::AimdConfig::throttle_threshold` | field | `pub throttle_threshold: f64,` | [rust/lance-core/src/utils/aimd.rs:41-41](../L2-files/rust/lance-core/src/utils/aimd.rs.md) |
| `lance_core::utils::aimd::AimdConfig::validate` | method/function | `pub fn validate(&self) -> Result<()> {` | [rust/lance-core/src/utils/aimd.rs:103-103](../L2-files/rust/lance-core/src/utils/aimd.rs.md) |
| `lance_core::utils::aimd::AimdConfig::window_duration` | field | `pub window_duration: Duration,` | [rust/lance-core/src/utils/aimd.rs:40-40](../L2-files/rust/lance-core/src/utils/aimd.rs.md) |
| `lance_core::utils::aimd::AimdConfig::with_additive_increment` | method/function | `pub fn with_additive_increment(self, additive_increment: f64) -> Self {` | [rust/lance-core/src/utils/aimd.rs:81-81](../L2-files/rust/lance-core/src/utils/aimd.rs.md) |
| `lance_core::utils::aimd::AimdConfig::with_decrease_factor` | method/function | `pub fn with_decrease_factor(self, decrease_factor: f64) -> Self {` | [rust/lance-core/src/utils/aimd.rs:74-74](../L2-files/rust/lance-core/src/utils/aimd.rs.md) |
| `lance_core::utils::aimd::AimdConfig::with_initial_rate` | method/function | `pub fn with_initial_rate(self, initial_rate: f64) -> Self {` | [rust/lance-core/src/utils/aimd.rs:59-59](../L2-files/rust/lance-core/src/utils/aimd.rs.md) |
| `lance_core::utils::aimd::AimdConfig::with_max_rate` | method/function | `pub fn with_max_rate(self, max_rate: f64) -> Self {` | [rust/lance-core/src/utils/aimd.rs:70-70](../L2-files/rust/lance-core/src/utils/aimd.rs.md) |
| `lance_core::utils::aimd::AimdConfig::with_min_rate` | method/function | `pub fn with_min_rate(self, min_rate: f64) -> Self {` | [rust/lance-core/src/utils/aimd.rs:66-66](../L2-files/rust/lance-core/src/utils/aimd.rs.md) |
| `lance_core::utils::aimd::AimdConfig::with_throttle_threshold` | method/function | `pub fn with_throttle_threshold(self, throttle_threshold: f64) -> Self {` | [rust/lance-core/src/utils/aimd.rs:95-95](../L2-files/rust/lance-core/src/utils/aimd.rs.md) |
| `lance_core::utils::aimd::AimdConfig::with_window_duration` | method/function | `pub fn with_window_duration(self, window_duration: Duration) -> Self {` | [rust/lance-core/src/utils/aimd.rs:88-88](../L2-files/rust/lance-core/src/utils/aimd.rs.md) |
| `lance_core::utils::aimd::AimdController` | struct | `pub struct AimdController {` | [rust/lance-core/src/utils/aimd.rs:208-208](../L2-files/rust/lance-core/src/utils/aimd.rs.md) |
| `lance_core::utils::aimd::AimdController::<implementation>` | implementation | `impl AimdController {` | [rust/lance-core/src/utils/aimd.rs:222-222](../L2-files/rust/lance-core/src/utils/aimd.rs.md) |
| `lance_core::utils::aimd::AimdController::current_rate` | method/function | `pub fn current_rate(&self) -> f64 {` | [rust/lance-core/src/utils/aimd.rs:287-287](../L2-files/rust/lance-core/src/utils/aimd.rs.md) |
| `lance_core::utils::aimd::AimdController::new` | method/function | `pub fn new(config: AimdConfig) -> Result<Self> {` | [rust/lance-core/src/utils/aimd.rs:224-224](../L2-files/rust/lance-core/src/utils/aimd.rs.md) |
| `lance_core::utils::aimd::AimdController::record_outcome` | method/function | `pub fn record_outcome(&self, outcome: RequestOutcome) -> f64 {` | [rust/lance-core/src/utils/aimd.rs:242-242](../L2-files/rust/lance-core/src/utils/aimd.rs.md) |
| `lance_core::utils::aimd::RequestOutcome` | enum | `pub enum RequestOutcome {` | [rust/lance-core/src/utils/aimd.rs:192-192](../L2-files/rust/lance-core/src/utils/aimd.rs.md) |
| `lance_core::utils::aimd::RequestOutcome::Success` | variant | `Success,` | [rust/lance-core/src/utils/aimd.rs:193-193](../L2-files/rust/lance-core/src/utils/aimd.rs.md) |
| `lance_core::utils::aimd::RequestOutcome::Throttled` | variant | `Throttled,` | [rust/lance-core/src/utils/aimd.rs:194-194](../L2-files/rust/lance-core/src/utils/aimd.rs.md) |

## Files

- [aimd.rs](../L2-files/rust/lance-core/src/utils/aimd.rs.md), rust/lance-core/src/utils/aimd.rs:1-679.
- [testing.rs](../L2-files/rust/lance-core/src/utils/testing.rs.md), rust/lance-core/src/utils/testing.rs:1-300.
- [statistics corpus](../L2-files/rust/lance-core/proptest-regressions/io/writer/statistics.txt.md), rust/lance-core/proptest-regressions/io/writer/statistics.txt:1-12.
- [mask corpus](../L2-files/rust/lance-core/proptest-regressions/utils/mask.txt.md), rust/lance-core/proptest-regressions/utils/mask.txt:1-9.

Historical test catalogs from this supplement are retained in the [archive](archive/rust-lance-core-control-testing-historical-sections.md); they are outside current coverage.

Excluded test declarations are retained in the [historical catalog](archive/rust-lance-core-control-testing-excluded-declarations.md).

[Historical test instrumentation](archive/rust-lance-core-test-instrumentation.md) is excluded from current coverage.
