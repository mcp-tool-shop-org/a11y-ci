# Changelog

## 1.0.1 — 2026-03-25

### Added

- `a11y-ci validate` subcommand — validates scorecard and allowlist JSON without running the gate
- 8 new tests for the validate command (22 total)

### Fixed

- `__version__` in `__init__.py` was stuck at 0.3.0, now synced to match pyproject.toml
- README Python requirement corrected from 3.11+ to 3.10+ (matches pyproject.toml)

## 1.0.0 — 2026-02-27

### Overview

**First stable release.** Shipcheck audit, CI coverage, dependency audit, product standards.

### Added

- SECURITY.md with threat model and vulnerability reporting
- CHANGELOG.md (this file)
- Makefile with `verify` target (lint + test + audit)
- SHIP_GATE.md and SCORECARD.md for product standards
- pytest-cov and pip-audit in dev dependencies
- Codecov integration in CI
- Dependency audit job in CI
- Security & Data Scope section in README

### Changed

- Bumped version from 0.3.1 to 1.0.0
- Updated README with Codecov badge, scorecard, and standard footer

## 0.3.1 — 2026-02-18

- Brand logo centralized to brand repo
- README translations (8 languages)
- Landing page via @mcptoolshop/site-theme

## 0.3.0 — 2026-02-12

- Initial public release
- CI gate with severity thresholds, count regression, and new-finding detection
- Time-boxed allowlists
- Low-vision-first What / Why / Fix output format
