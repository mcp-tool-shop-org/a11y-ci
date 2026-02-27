<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.md">English</a> | <a href="README.pt-BR.md">Português (BR)</a>
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

## Perché

L'analisi dell'accessibilità è utile solo se impedisce regressioni. Molti team la ignorano perché non esiste un modo nativo per far fallire una build a causa di problemi di accessibilità senza generare un numero eccessivo di falsi positivi o perdere il contesto di ciò che è regredito.

**a11y-ci** colma questa lacuna:

- Elabora i report prodotti da [a11y-lint](https://pypi.org/project/a11y-lint/) (o qualsiasi file JSON compatibile).
- Valuta la gravità, il numero di regressioni e la rilevazione di nuove problematiche.
- Supporta liste di esclusione temporanee, in modo che le soppressioni non diventino permanenti.
- Visualizza ogni risultato nel formato **Cosa / Perché / Soluzione**, con priorità per le persone con problemi di vista.

Nessuna chiamata di rete. Completamente deterministico. Funziona in qualsiasi sistema CI che abbia Python.

## Installazione

```bash
pip install a11y-ci
```

Richiede Python 3.11 o versioni successive.

## Guida rapida

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

## Cosa fa

| Funzionalità | Descrizione |
|-----------|-------------|
| **Severity gate** | Fallisce se qualsiasi riscontro supera o raggiunge la gravità configurata (predefinito: grave). |
| **Baseline regression** | Confronta l'esecuzione corrente con una baseline salvata; fallisce se il numero di riscontri gravi aumenta o se compaiono nuovi ID di riscontri gravi. |
| **Allowlist with expiry** | Sopprime temporaneamente i riscontri noti; le voci scadute falliscono automaticamente la verifica. |
| **Low-vision-first output** | Ogni messaggio segue il contratto `[OK]/[AVVERTIMENTO]/[ERRORE]` + Cosa/Perché/Soluzione. |

## Riferimento della CLI

```
a11y-ci gate [OPTIONS]

Options:
  --current PATH       Path to the current scorecard JSON (required)
  --baseline PATH      Path to the baseline scorecard JSON (optional)
  --allowlist PATH     Path to the allowlist JSON (optional)
  --fail-on SEVERITY   Minimum severity to fail on (default: serious)
                       Choices: info | minor | moderate | serious | critical
```

### Livelli di gravità

| Livello | Quando utilizzarlo |
|-------|-------------|
| **critical** | Blocca solo i problemi critici. |
| **serious** | Predefinito. Blocca i problemi che influiscono sull'uso quotidiano. |
| **moderate** | Più rigoroso. Include problemi di usabilità. |
| **minor** | Il più rigoroso possibile. Rileva la maggior parte dei problemi. |
| **info** | Rileva tutto, comprese le note informative. |

## Codici di uscita

| Codice | Significato |
|------|---------|
| `0` | Tutti i controlli superati. |
| `2` | Errore di input o di convalida (JSON non valido, file mancante, incompatibilità dello schema). |
| `3` | La verifica non è stata superata (soglia di gravità, regressione o lista di esclusione scaduta). |

## Contratto di output

Ogni messaggio segue il contratto con priorità per le persone con problemi di vista. Nessun messaggio è semplicemente un codice di stato o una breve descrizione criptica.

### Verifica superata

```
[OK] Accessibility gate passed (ID: A11Y.CI.GATE.PASS)

What:
  No policy violations were detected.

Why:
  Current findings meet the configured threshold and baseline policy.

Fix:
  Proceed with merge/release.
```

### Verifica fallita

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

### Errori di input

```
[ERROR] Allowlist is invalid (ID: A11Y.CI.ALLOWLIST.INVALID)

What:
  The allowlist file failed schema validation.

Why:
  The allowlist must include finding_id, expires, and reason for each entry.

Fix:
  Fix the allowlist JSON and re-run the gate.
```

## Formato della lista di esclusione

Le voci della lista di esclusione sopprimono temporaneamente i riscontri noti. Ogni voce richiede:

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `finding_id` | stringa | L'ID della regola/del riscontro da sopprimere. |
| `expires` | stringa | Data in formato ISO (`aaaa-mm-gg`). Le voci scadute fanno fallire la verifica. |
| `reason` | stringa | Almeno 10 caratteri che spiegano la soppressione. |

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

Le voci scadute della lista di esclusione non vengono ignorate silenziosamente. Falliscono la verifica con un messaggio chiaro che spiega quale voce è scaduta e quando.

## Formato del report

a11y-ci accetta report con conteggi riassuntivi o riscontri dettagliati (o entrambi):

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

Gli ID dei riscontri vengono estratti in modo flessibile dai campi `id`, `rule_id`, `finding_id` o `code`.

## Esempio per GitHub Actions

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

### Aggiornamento della baseline

Quando si modifica intenzionalmente l'output della CLI, aggiornare la baseline:

```bash
a11y-lint scan output.txt --json > baseline/a11y.scorecard.json
git add baseline/a11y.scorecard.json
git commit -m "Update a11y baseline"
```

## Come funziona

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

## Strumenti complementari

| Strumento | Descrizione |
|------|-------------|
| [a11y-lint](https://pypi.org/project/a11y-lint/) | Analizzatore dell'accessibilità per l'output della CLI (genera report). |
| [a11y-assist](https://pypi.org/project/a11y-assist/) | Assistente per problemi di accessibilità con priorità per le persone con problemi di vista. |

## Sicurezza e ambito dei dati

- **Dati accessibili:** Legge i file di report JSON dal disco. Confronta i riscontri con le baseline e le liste di esclusione.
- **Dati NON accessibili:** Nessuna chiamata di rete. Nessuna telemetria. Nessun archivio di dati utente. Nessuna credenziale o token.
- **Autorizzazioni richieste:** Solo accesso in lettura ai file di report, baseline e lista di esclusione.

## Report

| Verifica | Stato |
|------|--------|
| A. Standard di sicurezza | PASS (Superato) |
| B. Gestione degli errori | PASS (Superato) |
| C. Documentazione per gli operatori | PASS (Superato) |
| D. Pratiche di sviluppo | PASS (Superato) |
| E. Identità | PASS (Superato) |

## Contributi

Consultare il file [CONTRIBUTING.md](CONTRIBUTING.md) per le linee guida.

## Licenza

MIT

---

Creato da <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a>
