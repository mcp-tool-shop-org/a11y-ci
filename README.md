<p align="center">
  <img src="logo.png" alt="a11y-ci logo" width="140" />
</p>
<h1 align="center">a11y-ci</h1>
<p align="center">
  <strong>CI gate for accessibility scorecards. Low-vision-first output.</strong><br/>
  Part of <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a>
</p>
<p align="center">
  <a href="https://pypi.org/project/a11y-ci/"><img src="https://img.shields.io/pypi/v/a11y-ci?color=blue" alt="PyPI version" /></a>
  <img src="https://img.shields.io/badge/gate-strict-blue" alt="gate" />
  <img src="https://img.shields.io/badge/output-low--vision--first-green" alt="contract" />
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-black" alt="license" /></a>
</p>
---
## Why
Accessibility linting is only useful if it blocks regressions. Most teams skip it because there is no CI-native way to fail a build on accessibility findings without drowning in false positives or losing context on what regressed.
**a11y-ci** bridges that gap:
- Consumes scorecards produced by [a11y-lint](https://pypi.org/project/a11y-lint/) (or any compatible JSON)
- Gates on severity, count regression, and new-finding detection
- Supports time-boxed allowlists so suppressions never become permanent
- Outputs every result in the low-vision-first **What / Why / Fix** format
No network calls. Fully deterministic. Runs in any CI system that has Python.
## What It Does
| Capability | Description |
|-----------|-------------|
| **Severity gate** | Fails if any finding meets or exceeds the configured severity (default: serious) |
| **Baseline regression** | Compares current run against a saved baseline; fails if serious+ count increases or new serious+ IDs appear |
| **Allowlist with expiry** | Suppresses known findings temporarily; expired entries automatically fail the gate |
| **Low-vision-first output** | Every message follows the [OK]/[WARN]/[ERROR] + What/Why/Fix contract |
## Installation
`ash
pip install a11y-ci
`
Or install from source:
`ash
git clone https://github.com/mcp-tool-shop-org/a11y-ci.git
cd a11y-ci
pip install -e ".[dev]"
`
## Quick Start
`ash
# Generate a scorecard with a11y-lint
a11y-lint scan output.txt --json > a11y.scorecard.json
# Gate on the scorecard
a11y-ci gate --current a11y.scorecard.json
# Gate with baseline comparison
a11y-ci gate --current a11y.scorecard.json --baseline baseline/a11y.scorecard.json
# Gate with allowlist
a11y-ci gate --current a11y.scorecard.json --allowlist a11y-ci.allowlist.json
`
## CLI Reference
### gate - Run the CI gate
`ash
a11y-ci gate [OPTIONS]
Options:
  --current PATH       Path to the current scorecard JSON (required)
  --baseline PATH      Path to the baseline scorecard JSON (optional)
  --allowlist PATH     Path to the allowlist JSON (optional)
  --fail-on SEVERITY   Minimum severity to fail on: minor | moderate | serious | critical
                       (default: serious)
`
### Fail severity levels
| Level | When to use |
|-------|-------------|
| critical | Only block on show-stoppers |
| serious | Default. Blocks on barriers that affect daily use |
| moderate | Stricter. Includes usability issues |
| minor | Strictest. Catches everything |
## Exit Codes
| Code | Meaning |
|------|---------|
| 0 | All checks passed |
| 2 | Input or validation error (bad JSON, missing file, schema mismatch) |
| 3 | Policy gate failed (severity threshold, regression, or expired allowlist) |
## Output Contract
Every message follows the low-vision-first contract. No message is ever just a status code or cryptic one-liner.
`
[OK] No regression detected (ID: GATE.BASELINE.STABLE)
What:
  Serious+ finding count did not increase compared to baseline.
Why:
  Stable or improving accessibility posture.
Fix:
  No action required.
`
`
[ERROR] New serious finding detected (ID: GATE.BASELINE.NEW_FINDING)
What:
  Finding CLI.COLOR.ONLY appeared in the current run but not in the baseline.
Why:
  New accessibility barriers must be addressed before merge.
Fix:
  Fix the finding, or add a time-boxed entry to the allowlist with a reason.
`
## Allowlist Format
Allowlist entries suppress known findings temporarily. Every entry requires:
| Field | Type | Description |
|-------|------|-------------|
| inding_id | string | The rule/finding ID to suppress |
| expires | string | ISO date (yyyy-mm-dd). Expired entries fail the gate. |
| 
eason | string | Minimum 10 characters explaining the suppression |
`json
{
  "version": "1",
  "allow": [
    {
      "finding_id": "CLI.COLOR.ONLY",
      "expires": "2026-12-31",
      "reason": "Temporary suppression for legacy output. Tracked in issue #12."
    }
  ]
}
`
Expired allowlist entries are not silently ignored. They fail the gate with a clear message explaining which entry expired and when.
## GitHub Actions Example
`yaml
name: Accessibility Gate
on:
  pull_request:
    paths: ["src/**", "cli/**"]
jobs:
  a11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - name: Install tools
        run: pip install a11y-lint a11y-ci
      - name: Capture CLI output
        run: ./your-cli --help > cli_output.txt 2>&1 || true
      - name: Lint and gate
        run: |
          a11y-lint scan cli_output.txt --json > a11y.scorecard.json
          a11y-ci gate --current a11y.scorecard.json --baseline baseline/a11y.scorecard.json
`
### Updating the baseline
When you intentionally change CLI output, update the baseline:
`ash
a11y-lint scan output.txt --json > baseline/a11y.scorecard.json
git add baseline/a11y.scorecard.json
git commit -m "Update a11y baseline"
`
## How It Works
1. **Parse**: Reads the scorecard JSON (supports both summary and raw indings formats)
2. **Filter**: Applies severity threshold and allowlist suppressions
3. **Compare**: If a baseline is provided, detects count regressions and new finding IDs
4. **Report**: Outputs every check result in the What/Why/Fix format
5. **Exit**: Returns 0 (pass), 2 (input error), or 3 (gate failed)
## Companion Tools
| Tool | Description |
|------|-------------|
| [a11y-lint](https://pypi.org/project/a11y-lint/) | Accessibility linter for CLI output (produces scorecards) |
| [a11y-assist](https://pypi.org/project/a11y-assist/) | AI-powered accessibility suggestions |
## Development
`ash
# Install dev dependencies
pip install -e ".[dev]"
# Run tests
pytest
# Lint
ruff check .
`
## License
MIT
