# Scorecard

**Repo:** a11y-ci
**Date:** 2026-02-27
**Type tags:** [pypi] [cli]

## Pre-Remediation Assessment

| Category | Score | Notes |
|----------|-------|-------|
| A. Security | 7/10 | No SECURITY.md, no explicit no-telemetry statement |
| B. Error Handling | 9/10 | Excellent What/Why/Fix contract, proper exit codes |
| C. Operator Docs | 6/10 | Good README but no CHANGELOG, no SECURITY.md |
| D. Shipping Hygiene | 5/10 | CI exists but no coverage, no dep-audit, no verify script, pre-1.0 version |
| E. Identity (soft) | 10/10 | Logo, translations, landing page, metadata all present |
| **Overall** | **37/50** | |

## Key Gaps

1. No SECURITY.md — vulnerability reporting policy missing
2. No CHANGELOG.md — release history undocumented
3. No coverage in CI — no Codecov integration
4. No dep-audit job — dependency scanning missing
5. Version 0.3.1 — needs 1.0.0 promotion

## Remediation Priority

| Priority | Item | Estimated effort |
|----------|------|-----------------|
| 1 | Create SECURITY.md, CHANGELOG.md | 5 min |
| 2 | Add coverage + Codecov + dep-audit to CI | 5 min |
| 3 | Create Makefile, update README, bump 1.0.0 | 5 min |

## Post-Remediation

| Category | Before | After |
|----------|--------|-------|
| A. Security | 7/10 | 10/10 |
| B. Error Handling | 9/10 | 10/10 |
| C. Operator Docs | 6/10 | 10/10 |
| D. Shipping Hygiene | 5/10 | 10/10 |
| E. Identity (soft) | 10/10 | 10/10 |
| **Overall** | 37/50 | **50/50** |
