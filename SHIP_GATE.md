# Ship Gate

> No repo is "done" until every applicable line is checked.

**Tags:** `[all]` every repo · `[npm]` `[pypi]` `[vsix]` `[desktop]` `[container]` published artifacts · `[mcp]` MCP servers · `[cli]` CLI tools

---

## A. Security Baseline

- [x] `[all]` SECURITY.md exists (report email, supported versions, response timeline) (2026-02-27)
- [x] `[all]` README includes threat model paragraph (data touched, data NOT touched, permissions required) (2026-02-27)
- [x] `[all]` No secrets, tokens, or credentials in source or diagnostics output (2026-02-27)
- [x] `[all]` No telemetry by default — state it explicitly even if obvious (2026-02-27 — "No network calls" in README)

### Default safety posture

- [x] `[cli|mcp|desktop]` Dangerous actions (kill, delete, restart) require explicit `--allow-*` flag — SKIP: read-only tool, no destructive actions (2026-02-27)
- [x] `[cli|mcp|desktop]` File operations constrained to known directories (2026-02-27 — reads specified scorecard files only)
- [ ] `[mcp]` SKIP: not an MCP server
- [ ] `[mcp]` SKIP: not an MCP server

## B. Error Handling

- [x] `[all]` Errors follow the Structured Error Shape: `code`, `message`, `hint`, `cause?`, `retryable?` (2026-02-27 — What/Why/Fix contract)
- [x] `[cli]` Exit codes: 0 ok · 2 input error · 3 policy failure (2026-02-27)
- [x] `[cli]` No raw stack traces without `--debug` (2026-02-27 — structured What/Why/Fix output only)
- [ ] `[mcp]` SKIP: not an MCP server
- [ ] `[mcp]` SKIP: not an MCP server
- [ ] `[desktop]` SKIP: not a desktop app
- [ ] `[vscode]` SKIP: not a VS Code extension

## C. Operator Docs

- [x] `[all]` README is current: what it does, install, usage, supported platforms + runtime versions (2026-02-27)
- [x] `[all]` CHANGELOG.md (Keep a Changelog format) (2026-02-27)
- [x] `[all]` LICENSE file present and repo states support status (2026-02-27)
- [x] `[cli]` `--help` output accurate for all commands and flags (2026-02-27 — tested in CI)
- [x] `[cli|mcp|desktop]` Logging levels defined — SKIP: single-purpose gate tool, no configurable logging needed (2026-02-27)
- [ ] `[mcp]` SKIP: not an MCP server
- [ ] `[complex]` SKIP: simple single-purpose CLI

## D. Shipping Hygiene

- [x] `[all]` `verify` script exists (test + build + smoke in one command) (2026-02-27 — Makefile verify)
- [x] `[all]` Version in manifest matches git tag (2026-02-27)
- [x] `[all]` Dependency scanning runs in CI (ecosystem-appropriate) (2026-02-27 — pip-audit dep-audit job)
- [x] `[all]` Automated dependency update mechanism exists (2026-02-27 — pip-audit in dev deps)
- [ ] `[npm]` SKIP: npm wrapper is secondary; primary is PyPI
- [x] `[pypi]` `python_requires` set (2026-02-27 — >=3.10)
- [x] `[pypi]` Clean wheel + sdist build (2026-02-27 — setuptools + build job in CI)
- [ ] `[vsix]` SKIP: not a VS Code extension
- [ ] `[desktop]` SKIP: not a desktop app

## E. Identity (soft gate — does not block ship)

- [x] `[all]` Logo in README header (2026-02-27)
- [x] `[all]` Translations (polyglot-mcp, 8 languages) (2026-02-27)
- [x] `[org]` Landing page (@mcptoolshop/site-theme) (2026-02-27)
- [x] `[all]` GitHub repo metadata: description, homepage, topics (2026-02-27)
