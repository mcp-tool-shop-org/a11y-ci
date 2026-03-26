---
title: For Beginners
description: New to a11y-ci? Start here for a gentle introduction.
sidebar:
  order: 99
---

## What is a11y-ci?

a11y-ci is a command-line tool that blocks accessibility regressions in your CI pipeline. It reads a JSON scorecard (produced by [a11y-lint](https://pypi.org/project/a11y-lint/) or any compatible tool), checks the findings against your policy, and either passes (exit 0) or fails (exit 3) the build.

Think of it as a linter gate — but instead of checking code style, it checks whether your software's accessibility has gotten worse since the last build.

## Who is this for?

- **Developers** who want to catch accessibility regressions before they ship
- **CI/CD engineers** setting up quality gates for teams
- **Accessibility leads** enforcing standards across projects
- **Anyone** who uses a11y-lint and wants to prevent regressions automatically

No accessibility expertise is required to use a11y-ci. It tells you exactly what failed, why it failed, and how to fix it.

## Prerequisites

- **Python 3.10 or later** — check with `python --version`
- **pip** — Python's package manager (included with Python)
- **a11y-lint** — the linter that produces scorecards (`pip install a11y-lint`)
- **Basic terminal skills** — you'll run commands in a terminal/shell

## Your First 5 Minutes

### 1. Install a11y-ci

```bash
pip install a11y-ci
```

Verify:

```bash
a11y-ci --version
```

### 2. Create a sample scorecard

Save this as `sample.scorecard.json`:

```json
{
  "findings": [
    {
      "id": "CLI.COLOR.ONLY",
      "severity": "serious",
      "title": "Color is the only visual indicator",
      "message": "Success/failure communicated only via color"
    }
  ]
}
```

### 3. Run the gate

```bash
a11y-ci gate --current sample.scorecard.json
```

You'll see a structured failure message because the scorecard contains a "serious" finding:

```
[ERROR] Accessibility gate failed (ID: A11Y.CI.GATE.FAIL)

What:
  Accessibility policy violations were detected.

Why:
  Current run has 1 finding(s) at or above 'serious'.

Fix:
  Review the current scorecard and address the listed findings.
  ...
```

### 4. Try a passing gate

Save this as `clean.scorecard.json`:

```json
{
  "findings": []
}
```

```bash
a11y-ci gate --current clean.scorecard.json
```

You'll see:

```
[OK] Accessibility gate passed (ID: A11Y.CI.GATE.PASS)
```

### 5. Validate your files

Before running the full gate, you can check that your files are well-formed:

```bash
a11y-ci validate --scorecard sample.scorecard.json
```

## Common Mistakes

1. **Wrong Python version** — a11y-ci requires Python 3.10+. If you see syntax errors on import, check `python --version`.

2. **Malformed scorecard JSON** — The scorecard must have a `findings` array. Each finding needs at least an `id` (or `rule_id`, `finding_id`, `code`) and a `severity`. If the JSON is invalid, you'll get exit code 2 with a clear error message.

3. **Expired allowlist entries** — If you suppress a finding with an allowlist and the expiry date passes, the gate will *fail* (not silently ignore it). This is intentional — check your allowlist dates.

4. **Confusing exit codes** — Exit 0 = passed, exit 2 = bad input, exit 3 = policy failure. If you're scripting around a11y-ci, check for these specific codes rather than just "non-zero."

5. **Forgetting the baseline** — Without `--baseline`, a11y-ci only checks absolute severity. Add a baseline to also catch *regressions* (new findings that weren't there before).

## Next Steps

- **[Getting Started](/a11y-ci/handbook/getting-started/)** — Full installation and first-gate walkthrough
- **[CLI Reference](/a11y-ci/handbook/cli-reference/)** — All commands, options, and exit codes
- **[Allowlists](/a11y-ci/handbook/allowlists/)** — Suppress known findings temporarily
- **[CI Integration](/a11y-ci/handbook/ci-integration/)** — Add a11y-ci to your GitHub Actions workflow

## Glossary

| Term | Definition |
|------|-----------|
| **Scorecard** | A JSON file listing accessibility findings, produced by a11y-lint or a compatible tool |
| **Finding** | A single accessibility issue detected by a linter (e.g., "color is the only indicator") |
| **Severity** | How serious a finding is: info, minor, moderate, serious, or critical |
| **Gate** | A pass/fail check that blocks or allows a CI build based on policy |
| **Baseline** | A saved scorecard from a previous build, used to detect regressions |
| **Allowlist** | A list of known findings to temporarily suppress, each with an expiry date |
| **Regression** | When the current build has more (or new) serious findings compared to the baseline |
| **Low-vision-first** | An output format designed for readability: every message has What, Why, and Fix sections |
