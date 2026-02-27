<p align="center">
  <a href="README.md">English</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/a11y-ci/readme.png" alt="a11y-ci logo" width="400" />
</p>
<p align="center">
  <strong>CI gate for accessibility scorecards. Low-vision-first output.</strong>
</p>
<p align="center">
  <a href="https://github.com/mcp-tool-shop-org/a11y-ci/actions/workflows/ci.yml"><img src="https://github.com/mcp-tool-shop-org/a11y-ci/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://codecov.io/gh/mcp-tool-shop-org/a11y-ci"><img src="https://codecov.io/gh/mcp-tool-shop-org/a11y-ci/branch/main/graph/badge.svg" alt="Coverage" /></a>
  <a href="https://pypi.org/project/a11y-ci/"><img src="https://img.shields.io/pypi/v/a11y-ci" alt="PyPI" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
  <a href="https://mcp-tool-shop-org.github.io/a11y-ci/"><img src="https://img.shields.io/badge/Landing_Page-live-blue" alt="Landing Page" /></a>
</p>

---

## なぜですか

アクセシビリティに関するコードチェックは、問題の再発を防ぐ場合にのみ有効です。多くのチームがこのチェックを省略する理由は、CI環境でアクセシビリティの問題を検出した場合に、誤検出が多すぎたり、問題の具体的な内容が分からなくなったりするためです。ビルドを失敗させるための、CI環境に組み込み可能な方法がないためです。

**a11y-ci** は、その隔たりを埋めるためのツールです。

- [a11y-lint](https://pypi.org/project/a11y-lint/) (または互換性のあるJSON形式) によって生成された評価レポートを読み込みます。
- 深刻度、件数増加、および新規検出に関するチェック項目を設定します。
- 一定期間のみ有効な許可リストをサポートしており、抑制設定が永続化されることはありません。
- すべての結果を、視覚障碍者向けの「何が問題か / なぜ問題なのか / 修正方法」という形式で出力します。

ネットワーク接続は不要です。完全に決定論的な動作をします。Pythonが利用可能なCI環境であれば、どの環境でも動作します。

## インストールする

```bash
pip install a11y-ci
```

Python 3.11以降のバージョンが必要です。

## クイックスタートガイド

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

## その機能・役割

| 能力 | 説明. |
|-----------|-------------|
| **Severity gate** | 設定された重大度（デフォルト：深刻）に達する、またはそれ以上の結果が見つかった場合、エラーが発生します。 |
| **Baseline regression** | 現在の実行結果を、保存された基準値と比較します。もし、重大なエラーの件数が増加した場合、または新しい重大なエラーIDが検出された場合は、エラーとなります。 |
| **Allowlist with expiry** | 既知の検出結果を一時的に抑制します。また、有効期限が切れたエントリは自動的に無効になります。 |
| **Low-vision-first output** | すべてのメッセージは、`[OK]`、`[WARN]`、または`[ERROR]`に続いて、何が起こったのか、なぜ起こったのか、そしてどのように修正できるのかという情報が記載されています。 |

## コマンドラインインターフェース（CLI）のリファレンス

```
a11y-ci gate [OPTIONS]

Options:
  --current PATH       Path to the current scorecard JSON (required)
  --baseline PATH      Path to the baseline scorecard JSON (optional)
  --allowlist PATH     Path to the allowlist JSON (optional)
  --fail-on SEVERITY   Minimum severity to fail on (default: serious)
                       Choices: info | minor | moderate | serious | critical
```

### 重要度レベル

| レベル | 使用するタイミング。 |
|-------|-------------|
| **critical** | ショーを止めるような問題に対してのみ対応します。 |
| **serious** | デフォルト設定。日常的な利用に影響を与える障壁に対する制限を設けます。 |
| **moderate** | より厳格な基準。使いやすさに関する問題も含まれます。 |
| **minor** | 最も厳格な設定で、多くの問題を検出します。 |
| **info** | あらゆる情報をキャッチします。情報メモなども含まれます。 |

## 終了コード

| コード | 意味。 |
|------|---------|
| `0` | すべての検査に合格しました。 |
| `2` | 入力エラーまたは検証エラー（不正なJSON形式、ファイルが見つからない、スキーマの不一致）。 |
| `3` | ポリシー適用に失敗しました（重大度基準、リグレッション、または有効期限切れの許可リスト）。 |

## 成果型契約

すべてのメッセージは、視覚障碍者の方にとって使いやすいように設計されています。メッセージは、単なるステータスコードや意味不明な短いメッセージとは決してなりません。

### ゲート通過許可証

```
[OK] Accessibility gate passed (ID: A11Y.CI.GATE.PASS)

What:
  No policy violations were detected.

Why:
  Current findings meet the configured threshold and baseline policy.

Fix:
  Proceed with merge/release.
```

### ゲートが故障しました

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

### 入力エラー

```
[ERROR] Allowlist is invalid (ID: A11Y.CI.ALLOWLIST.INVALID)

What:
  The allowlist file failed schema validation.

Why:
  The allowlist must include finding_id, expires, and reason for each entry.

Fix:
  Fix the allowlist JSON and re-run the gate.
```

## 許可リストの形式

許可リストのエントリは、既知の検出結果を一時的に抑制します。各エントリには、以下の情報が必要です。

| 分野 | 種類. | 説明. |
|-------|------|-------------|
| `finding_id` | 文字列 | 抑制対象となるルールまたは検出結果のID。 |
| `expires` | 文字列 | ISOの日付形式（`yyyy-mm-dd`）。有効期限が切れたエントリは、検証プロセスに合格しません。 |
| `reason` | 文字列 | 抑圧に関する説明を、最低10文字で記述してください。 |

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

許可リストに登録された情報が期限切れになった場合、システムはそれを黙って無視することはありません。代わりに、エラーメッセージが表示され、どのエントリがいつ期限切れになったのかが明確に示されます。

## スコアカードの形式

`a11y-ci`は、概要の数値データまたは詳細な調査結果（またはその両方）を含むレポートを受け付けます。

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

IDは、`id`、`rule_id`、`finding_id`、または`code`のいずれかのフィールドから、柔軟に抽出されます。

## GitHub Actions のサンプルコード

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

### 基準値の更新

CLI（コマンドラインインターフェース）の出力内容を意図的に変更した場合は、基準値を更新してください。

```bash
a11y-lint scan output.txt --json > baseline/a11y.scorecard.json
git add baseline/a11y.scorecard.json
git commit -m "Update a11y baseline"
```

## 動作原理

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

## 関連ツール

| 道具。 | 説明. |
|------|-------------|
| [a11y-lint](https://pypi.org/project/a11y-lint/) | CLI（コマンドラインインターフェース）の出力におけるアクセシビリティをチェックするツール（評価レポートを作成します）。 |
| [a11y-assist](https://pypi.org/project/a11y-assist/) | 視覚障害者向けの、CLI（コマンドラインインターフェース）エラー対応アシスタント。 |

## セキュリティとデータ範囲について

- **アクセスされるデータ:** ディスクからJSON形式のスコアカードファイルを読み込みます。検出結果を基準値や許可リストと比較します。
- **アクセスされないデータ:** ネットワークへのリクエストは一切ありません。テレメトリー機能も使用しません。ユーザーデータの保存も行いません。認証情報やトークンも使用しません。
- **必要な権限:** スコアカード、基準値、および許可リストファイルへの読み取りアクセスのみが必要です。

## スコアカード

| 門 | ステータス |
|------|--------|
| A. セキュリティ基準 | 合格 |
| B. エラー処理 | 合格 |
| C. 運用者向けドキュメント | 合格 |
| D. 納品時の衛生管理 | 合格 |
| E. 認証 | 合格 |

## 貢献について

ガイドラインについては、[CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。

## ライセンス

MIT

---

作成者: <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a>
