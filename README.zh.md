<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
</p>

<p align="center">
  
            <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/a11y-ci/readme.png"
           alt="a11y-ci logo" width="400" />
</p>
<h1 align="center">a11y-ci</h1>
<p align="center">
  <strong>CI gate for accessibility scorecards. Low-vision-first output.</strong><br/>
  Part of <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a>
</p>
<p align="center">
  <a href="https://github.com/mcp-tool-shop-org/a11y-ci/actions/workflows/ci.yml"><img src="https://github.com/mcp-tool-shop-org/a11y-ci/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://pypi.org/project/a11y-ci/"><img src="https://img.shields.io/pypi/v/a11y-ci" alt="PyPI" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
  <a href="https://mcp-tool-shop-org.github.io/a11y-ci/"><img src="https://img.shields.io/badge/Landing_Page-live-blue" alt="Landing Page" /></a>
</p>

---

## 为什么？

可访问性代码检查（linting）只有在能够阻止代码回退（regression）时才有用。大多数团队会跳过它，因为没有一种原生 CI（持续集成）方式，可以在不产生大量误报或丢失回退信息的情况下，根据可访问性检查结果失败构建。

**a11y-ci** 弥补了这一差距：

- 它可以处理由 [a11y-lint](https://pypi.org/project/a11y-lint/)（或任何兼容的 JSON 格式）生成的评分卡。
- 它会根据严重程度、回退数量和新发现的检测结果进行判断。
- 它支持时间限制的允许列表，以防止抑制（suppressions）永久生效。
- 它以易于理解的 **问题/原因/解决方案** 格式输出所有结果。

它不需要网络连接，完全可预测，可以在任何安装了 Python 的 CI 系统中运行。

## 安装

```bash
pip install a11y-ci
```

需要 Python 3.11 或更高版本。

## 快速入门

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

## 它能做什么

| 功能 | 描述 |
| ----------- | ------------- |
| **Severity gate** | 如果任何发现的严重程度达到或超过配置的级别（默认：严重），则会失败。 |
| **Baseline regression** | 将当前运行的结果与保存的基线进行比较；如果严重程度+ 的数量增加或出现新的严重程度+ ID，则会失败。 |
| **Allowlist with expiry** | 暂时抑制已知的发现；到期的条目会自动导致检查失败。 |
| **Low-vision-first output** | 每个消息都遵循 `[OK]` / `[WARN]` / `[ERROR]` + 问题/原因/解决方案 的格式。 |

## 命令行参考

```
a11y-ci gate [OPTIONS]

Options:
  --current PATH       Path to the current scorecard JSON (required)
  --baseline PATH      Path to the baseline scorecard JSON (optional)
  --allowlist PATH     Path to the allowlist JSON (optional)
  --fail-on SEVERITY   Minimum severity to fail on (default: serious)
                       Choices: info | minor | moderate | serious | critical
```

### 严重程度级别

| Level | 使用场景 |
| ------- | ------------- |
| **critical（严重）** | 仅在出现会完全阻止用户使用的严重问题时才触发。 |
| **serious（严重）** | 默认级别。阻止影响日常使用的障碍。 |
| **moderate（中等）** | 更严格。包括可用性问题。 |
| **minor（轻微）** | 最严格的实用级别。可以发现大多数问题。 |
| **info（信息）** | 可以发现所有问题，包括信息性注释。 |

## 退出码

| Code | 含义 |
| ------ | --------- |
| `0` | 所有检查都通过 |
| `2` | 输入或验证错误（无效的 JSON、缺少文件、模式不匹配） |
| `3` | 策略检查失败（严重程度阈值、回退或到期的允许列表） |

## 输出格式

每个消息都遵循易于理解的格式。任何消息都不会仅仅是状态码或晦涩的简短说明。

### 检查通过

```
[OK] Accessibility gate passed (ID: A11Y.CI.GATE.PASS)

What:
  No policy violations were detected.

Why:
  Current findings meet the configured threshold and baseline policy.

Fix:
  Proceed with merge/release.
```

### 检查失败

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

### 输入错误

```
[ERROR] Allowlist is invalid (ID: A11Y.CI.ALLOWLIST.INVALID)

What:
  The allowlist file failed schema validation.

Why:
  The allowlist must include finding_id, expires, and reason for each entry.

Fix:
  Fix the allowlist JSON and re-run the gate.
```

## 允许列表格式

允许列表条目可以暂时抑制已知的发现。每个条目都需要：

| Field | Type | 描述 |
| ------- | ------ | ------------- |
| `finding_id` | 字符串 | 要抑制的规则/发现 ID。 |
| `expires` | 字符串 | ISO 日期（yyyy-mm-dd）。到期的条目会导致检查失败。 |
| `reason` | 字符串 | 至少 10 个字符，用于解释抑制的原因。 |

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

到期的允许列表条目不会被静默忽略。它们会失败，并显示一条明确的消息，说明哪个条目已过期以及过期时间。

## 评分卡格式

a11y-ci 可以接受包含汇总计数或原始发现（或两者）的评分卡。

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

发现 ID 可以灵活地从 `id`、`rule_id`、`finding_id` 或 `code` 字段中提取。

## GitHub Actions 示例

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

### 更新基线

当您有意更改命令行输出时，请更新基线：

```bash
a11y-lint scan output.txt --json > baseline/a11y.scorecard.json
git add baseline/a11y.scorecard.json
git commit -m "Update a11y baseline"
```

## 工作原理

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

## 相关工具

| Tool | 描述 |
| ------ | ------------- |
| [a11y-lint](https://pypi.org/project/a11y-lint/) | 用于命令行输出的可访问性代码检查器（生成评分卡）。 |
| [a11y-assist](https://pypi.org/project/a11y-assist/) | 针对 CLI 故障的低视力辅助工具。 |

## 贡献

请参考 [CONTRIBUTING.md](CONTRIBUTING.md) 了解贡献指南。

## 许可证

MIT
