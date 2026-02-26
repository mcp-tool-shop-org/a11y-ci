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

## Por que

A análise de acessibilidade é útil apenas se impede regressões. A maioria das equipes a ignora porque não existe uma maneira nativa de falhar uma compilação devido a problemas de acessibilidade, sem gerar muitos falsos positivos ou perder o contexto do que foi alterado.

O **a11y-ci** preenche essa lacuna:

- Lê os relatórios gerados por [a11y-lint](https://pypi.org/project/a11y-lint/) (ou qualquer arquivo JSON compatível).
- Avalia a gravidade, a regressão no número de ocorrências e a detecção de novas ocorrências.
- Suporta listas de permissão temporárias para que as supressões nunca se tornem permanentes.
- Exibe todos os resultados no formato **O que / Por que / Solução**, priorizando a experiência de usuários com baixa visão.

Não faz chamadas de rede. É totalmente determinístico. Funciona em qualquer sistema de integração contínua que tenha Python.

## Instalação

```bash
pip install a11y-ci
```

Requer Python 3.11 ou superior.

## Início Rápido

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

## O que ele faz

| Funcionalidade | Descrição |
| ----------- | ------------- |
| **Severity gate** | Falha se alguma ocorrência atinge ou excede a severidade configurada (padrão: grave). |
| **Baseline regression** | Compara a execução atual com uma linha de base salva; falha se o número de ocorrências graves aumenta ou se novas ocorrências graves aparecem. |
| **Allowlist with expiry** | Suprime ocorrências conhecidas temporariamente; as entradas expiradas falham automaticamente na verificação. |
| **Low-vision-first output** | Cada mensagem segue o contrato `[OK]`/`[AVISO]`/`[ERRO]` + O que/Por que/Solução. |

## Referência da Linha de Comando

```
a11y-ci gate [OPTIONS]

Options:
  --current PATH       Path to the current scorecard JSON (required)
  --baseline PATH      Path to the baseline scorecard JSON (optional)
  --allowlist PATH     Path to the allowlist JSON (optional)
  --fail-on SEVERITY   Minimum severity to fail on (default: serious)
                       Choices: info | minor | moderate | serious | critical
```

### Níveis de Severidade

| Level | Quando usar |
| ------- | ------------- |
| **crítica** | Bloqueia apenas problemas críticos que impedem o uso. |
| **grave** | Padrão. Bloqueia problemas que afetam o uso diário. |
| **moderada** | Mais rigorosa. Inclui problemas de usabilidade. |
| **menor** | Mais rigorosa na prática. Detecta a maioria dos problemas. |
| **informativa** | Detecta tudo, incluindo notas informativas. |

## Códigos de Saída

| Code | Significado |
| ------ | --------- |
| `0` | Todas as verificações passaram. |
| `2` | Erro de entrada ou validação (JSON inválido, arquivo ausente, incompatibilidade de esquema). |
| `3` | Falha na verificação (limite de severidade, regressão ou lista de permissão expirada). |

## Contrato de Saída

Cada mensagem segue o contrato de priorização da experiência de usuários com baixa visão. Nenhuma mensagem é apenas um código de status ou uma frase enigmática.

### Verificação aprovada

```
[OK] Accessibility gate passed (ID: A11Y.CI.GATE.PASS)

What:
  No policy violations were detected.

Why:
  Current findings meet the configured threshold and baseline policy.

Fix:
  Proceed with merge/release.
```

### Verificação falhou

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

### Erros de entrada

```
[ERROR] Allowlist is invalid (ID: A11Y.CI.ALLOWLIST.INVALID)

What:
  The allowlist file failed schema validation.

Why:
  The allowlist must include finding_id, expires, and reason for each entry.

Fix:
  Fix the allowlist JSON and re-run the gate.
```

## Formato da Lista de Permissões

As entradas da lista de permissões suprimem temporariamente ocorrências conhecidas. Cada entrada requer:

| Field | Type | Descrição |
| ------- | ------ | ------------- |
| `finding_id` | string | O ID da regra/ocorrência a ser suprimida. |
| `expires` | string | Data no formato ISO (`aaaa-mm-dd`). As entradas expiradas falham na verificação. |
| `reason` | string | Explicação da supressão com no mínimo 10 caracteres. |

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

As entradas expiradas da lista de permissões não são ignoradas silenciosamente. Elas falham na verificação com uma mensagem clara explicando qual entrada expirou e quando.

## Formato do Relatório

O a11y-ci aceita relatórios com contagens resumidas ou ocorrências brutas (ou ambos):

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

Os IDs das ocorrências são extraídos de forma flexível dos campos `id`, `rule_id`, `finding_id` ou `code`.

## Exemplo para GitHub Actions

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

### Atualizando a linha de base

Sempre que você alterar a saída da linha de comando, atualize a linha de base:

```bash
a11y-lint scan output.txt --json > baseline/a11y.scorecard.json
git add baseline/a11y.scorecard.json
git commit -m "Update a11y baseline"
```

## Como funciona

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

## Ferramentas Complementares

| Tool | Descrição |
| ------ | ------------- |
| [a11y-lint](https://pypi.org/project/a11y-lint/) | Analisador de acessibilidade para a saída da linha de comando (gera relatórios). |
| [a11y-assist](https://pypi.org/project/a11y-assist/) | Assistente para auxiliar usuários com baixa visão em casos de falhas no CLI. |

## Contribuições

Consulte o arquivo [CONTRIBUTING.md](CONTRIBUTING.md) para obter as diretrizes.

## Licença

MIT
