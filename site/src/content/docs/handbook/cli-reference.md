---
title: CLI Reference
description: Severity levels, exit codes, and CLI options.
sidebar:
  order: 2
---

## Commands

a11y-ci has two subcommands: `gate` (evaluate policy) and `validate` (check file structure).

### gate

```bash
a11y-ci gate [OPTIONS]
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--current` | PATH | required | Path to the current scorecard JSON |
| `--baseline` | PATH | optional | Path to the baseline scorecard JSON |
| `--allowlist` | PATH | optional | Path to the allowlist JSON |
| `--fail-on` | SEVERITY | `serious` | Minimum severity to fail on |

### validate

Check that scorecard and/or allowlist files are well-formed without running the gate:

```bash
a11y-ci validate [OPTIONS]
```

| Option | Type | Description |
|--------|------|-------------|
| `--scorecard` | PATH | Path to a scorecard JSON to validate |
| `--allowlist` | PATH | Path to an allowlist JSON to validate |

At least one of `--scorecard` or `--allowlist` is required. Reports finding counts, severity breakdown, and expired allowlist entries.

```bash
# Validate a scorecard
a11y-ci validate --scorecard a11y.scorecard.json

# Validate an allowlist
a11y-ci validate --allowlist a11y-ci.allowlist.json

# Validate both
a11y-ci validate --scorecard a11y.scorecard.json --allowlist a11y-ci.allowlist.json
```

## Severity levels

| Level | When to use |
|-------|-------------|
| `critical` | Only block on show-stoppers |
| `serious` | Default — blocks on barriers that affect daily use |
| `moderate` | Stricter — includes usability issues |
| `minor` | Strictest practical — catches most issues |
| `info` | Catches everything, including informational notes |

## Exit codes

| Code | Meaning |
|------|---------|
| `0` | All checks passed |
| `2` | Input or validation error (bad JSON, missing file, schema mismatch) |
| `3` | Policy gate failed (severity threshold, regression, or expired allowlist) |

## Output contract

Every message follows the low-vision-first contract: `[OK]`/`[WARN]`/`[ERROR]` + What/Why/Fix. No message is ever just a status code or cryptic one-liner.
