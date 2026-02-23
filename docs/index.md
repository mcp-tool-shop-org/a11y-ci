# a11y-ci

CI gate for accessibility scorecards. Low-vision-first output.

## Key Features

- **Severity Gate** — Fails builds if any finding meets or exceeds configured severity
- **Baseline Regression Detection** — Compares current run against saved baseline
- **Time-Bounded Allowlists** — Suppress known findings temporarily; expired entries auto-fail
- **Low-Vision-First Output** — Every message follows the What / Why / Fix contract
- **Deterministic** — No network calls, fully deterministic, runs in any CI system

## Install / Quick Start

```bash
pip install a11y-ci
a11y-ci gate --current a11y.scorecard.json
```

## Links

- [GitHub Repository](https://github.com/mcp-tool-shop-org/a11y-ci)
- [a11y-ci on PyPI](https://pypi.org/project/a11y-ci/)
- [MCP Tool Shop](https://github.com/mcp-tool-shop-org)
