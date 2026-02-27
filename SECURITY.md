# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | Yes       |
| < 1.0   | No        |

## Reporting a Vulnerability

**Email:** 64996768+mcp-tool-shop@users.noreply.github.com

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact

**Response timeline:**
- Acknowledgment: within 48 hours
- Assessment: within 7 days
- Fix (if confirmed): within 30 days

## Scope

a11y-ci is a **CLI tool** that:
- **Reads:** JSON scorecard files from disk (local only)
- **Writes:** Gate pass/fail results to stdout/stderr
- **Does NOT:** make network requests, collect telemetry, store user data, or access credentials

### Security Properties

| Property | Implementation |
|----------|---------------|
| Input validation | JSON schema validation on all scorecard inputs |
| No network egress | Entirely local — no HTTP calls, no telemetry |
| No secrets | Does not read or process credentials, tokens, or keys |
| Structured errors | Exit codes (0 pass, 3 fail), no raw stack traces |
| File access | Read-only access to specified scorecard files only |
