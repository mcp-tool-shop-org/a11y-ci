---
title: Allowlists
description: Time-boxed suppressions with expiry enforcement.
sidebar:
  order: 3
---

## What are allowlists?

Allowlists suppress known findings temporarily. Every entry requires a finding ID, an expiry date, and a reason. Expired entries automatically fail the gate — they never become permanent silencers.

## Format

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

## Required fields

| Field | Type | Description |
|-------|------|-------------|
| `finding_id` | string | The rule/finding ID to suppress |
| `expires` | string | ISO date (`yyyy-mm-dd`). Expired entries fail the gate |
| `reason` | string | Minimum 10 characters explaining the suppression |

## Behavior

- Active entries: matching findings are suppressed during gating
- Expired entries: the gate fails with a clear message explaining which entry expired and when
- Invalid entries: missing fields cause an input error (exit code 2)

## Best practices

- Keep expiry dates short (30-90 days)
- Link to a tracking issue in the reason field
- Review allowlists during sprint planning
- Never use allowlists as a permanent bypass
