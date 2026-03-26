---
title: Getting Started
description: Install a11y-ci and gate your first build.
sidebar:
  order: 1
---

## Prerequisites

- Python 3.10+
- [a11y-lint](https://pypi.org/project/a11y-lint/) for generating scorecards

## Install

```bash
pip install a11y-ci
```

## Generate a scorecard

a11y-ci consumes JSON scorecards produced by a11y-lint:

```bash
a11y-lint scan output.txt --json > a11y.scorecard.json
```

## Gate on the scorecard

```bash
# Fail on serious+ findings (default)
a11y-ci gate --current a11y.scorecard.json

# Fail on moderate+ findings
a11y-ci gate --current a11y.scorecard.json --fail-on moderate
```

## Detect regressions with a baseline

```bash
a11y-ci gate \
  --current a11y.scorecard.json \
  --baseline baseline/a11y.scorecard.json
```

The gate fails if the serious+ count increases or new serious+ finding IDs appear.

## Suppress known issues temporarily

```bash
a11y-ci gate \
  --current a11y.scorecard.json \
  --allowlist a11y-ci.allowlist.json
```

Expired allowlist entries automatically fail the gate.
