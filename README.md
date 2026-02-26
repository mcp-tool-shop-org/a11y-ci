<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/a11y-ci/readme.png" alt="a11y-ci logo" width="400" />
</p>
<p align="center">
  <strong>CI gate for accessibility scorecards. Low-vision-first output.</strong>
</p>
<p align="center">
  <a href="https://github.com/mcp-tool-shop-org/a11y-ci/actions/workflows/ci.yml"><img src="https://github.com/mcp-tool-shop-org/a11y-ci/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://pypi.org/project/a11y-ci/"><img src="https://img.shields.io/pypi/v/a11y-ci" alt="PyPI" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
  <a href="https://mcp-tool-shop-org.github.io/a11y-ci/"><img src="https://img.shields.io/badge/Landing_Page-live-blue" alt="Landing Page" /></a>
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

## Install

```bash
pip install a11y-ci
```

Requires Python 3.11 or later.

## Quick Start

```bash
# Generate a scorecard with a11y-lint
a11y-lint scan output.txt --json > a11y.scorecard.json

# Gate on the scorecard (fails on serious+ findings)
a11y-ci gate --current a11y.scorecard.json

# Gate with baseline comparison (detect regressions)
a11y-ci gate --current a11y.scorecard.json --baseline baseline/a11y.scorecard.json

# Gate with allowlist (suppress known findings temporarily)
a11y-ci gate --current a11y.scorecard.json --allowlist a11y-ci.allowlist.json

# Combine all three
a11y-ci gate \
  --current a11y.scorecard.json \
  --baseline baseline/a11y.scorecard.json \
  --allowlist a11y-ci.allowlist.json \
  --fail-on moderate
```

## What It Does

| Capability | Description |
|-----------|-------------|
| **Severity gate** | Fails if any finding meets or exceeds the configured severity (default: serious) |
| **Baseline regression** | Compares current run against a saved baseline; fails if serious+ count increases or new serious+ IDs appear |
| **Allowlist with expiry** | Suppresses known findings temporarily; expired entries automatically fail the gate |
| **Low-vision-first output** | Every message follows the `[OK]`/`[WARN]`/`[ERROR]` + What/Why/Fix contract |

## CLI Reference

```
a11y-ci gate [OPTIONS]

Options:
  --current PATH       Path to the current scorecard JSON (required)
  --baseline PATH      Path to the baseline scorecard JSON (optional)
  --allowlist PATH     Path to the allowlist JSON (optional)
  --fail-on SEVERITY   Minimum severity to fail on (default: serious)
                       Choices: info | minor | moderate | serious | critical
```

### Severity Levels

| Level | When to use |
|-------|-------------|
| **critical** | Only block on show-stoppers |
| **serious** | Default. Blocks on barriers that affect daily use |
| **moderate** | Stricter. Includes usability issues |
| **minor** | Strictest practical. Catches most issues |
| **info** | Catches everything, including informational notes |

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | All checks passed |
| `2` | Input or validation error (bad JSON, missing file, schema mismatch) |
| `3` | Policy gate failed (severity threshold, regression, or expired allowlist) |

## Output Contract

Every message follows the low-vision-first contract. No message is ever just a status code or cryptic one-liner.

### Gate passes

```
[OK] Accessibility gate passed (ID: A11Y.CI.GATE.PASS)

What:
  No policy violations were detected.

Why:
  Current findings meet the configured threshold and baseline policy.

Fix:
  Proceed with merge/release.
```

### Gate fails

```
[ERROR] Accessibility gate failed (ID: A11Y.CI.GATE.FAIL)

What:
  Accessibility policy violations were detected.

Why:
  Current run has 3 finding(s) at or above 'serious'.
  New finding(s) at/above 'serious' not present in baseline: CLI.COLOR.ONLY, CLI.EXIT.SILENT

Fix:
  Review the current scorecard and address the listed findings.
  If this is intentional, add a time-bounded allowlist entry with justification.
  Re-run: a11y-ci gate --current a11y.scorecard.json --baseline baseline.json
  Blocking IDs (current): CLI.COLOR.ONLY, CLI.EXIT.SILENT, CLI.STACK.RAW
```

### Input errors

```
[ERROR] Allowlist is invalid (ID: A11Y.CI.ALLOWLIST.INVALID)

What:
  The allowlist file failed schema validation.

Why:
  The allowlist must include finding_id, expires, and reason for each entry.

Fix:
  Fix the allowlist JSON and re-run the gate.
```

## Allowlist Format

Allowlist entries suppress known findings temporarily. Every entry requires:

| Field | Type | Description |
|-------|------|-------------|
| `finding_id` | string | The rule/finding ID to suppress |
| `expires` | string | ISO date (`yyyy-mm-dd`). Expired entries fail the gate. |
| `reason` | string | Minimum 10 characters explaining the suppression |

```json
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
```

Expired allowlist entries are not silently ignored. They fail the gate with a clear message explaining which entry expired and when.

## Scorecard Format

a11y-ci accepts scorecards with either summary counts or raw findings (or both):

```json
{
  "findings": [
    {
      "id": "CLI.COLOR.ONLY",
      "severity": "serious",
      "title": "Color is the only visual indicator",
      "message": "Success/failure communicated only via color"
    },
    {
      "id": "CLI.EXIT.SILENT",
      "severity": "serious",
      "title": "Silent non-zero exit",
      "message": "Process exits with code 1 but no stderr output"
    }
  ]
}
```

Finding IDs are extracted flexibly from `id`, `rule_id`, `finding_id`, or `code` fields.

## GitHub Actions Example

```yaml
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
```

### Updating the baseline

When you intentionally change CLI output, update the baseline:

```bash
a11y-lint scan output.txt --json > baseline/a11y.scorecard.json
git add baseline/a11y.scorecard.json
git commit -m "Update a11y baseline"
```

## How It Works

```
Scorecard JSON ──► Parse findings + normalize severities
                       │
Allowlist JSON ──► Suppress matching IDs, flag expired entries
                       │
Baseline JSON  ──► Compare counts + detect new IDs
                       │
                   ┌───┴───┐
                   │ Gate  │  severity threshold + regression + expiry
                   └───┬───┘
                       │
                   PASS (exit 0) or FAIL (exit 3)
                       │
                   What / Why / Fix output
```

## Companion Tools

| Tool | Description |
|------|-------------|
| [a11y-lint](https://pypi.org/project/a11y-lint/) | Accessibility linter for CLI output (produces scorecards) |
| [a11y-assist](https://pypi.org/project/a11y-assist/) | Low-vision-first assistant for CLI failures |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT
