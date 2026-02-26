<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/a11y-ci/main/logo.png" alt="a11y-ci logo" width="400" />
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

## Pourquoi

L'analyse de l'accessibilité n'est utile que si elle permet d'éviter les régressions. La plupart des équipes l'ignorent car il n'existe pas de moyen natif dans les systèmes d'intégration continue (CI) pour signaler un échec de la compilation en raison de problèmes d'accessibilité, sans être submergé par de faux positifs ou sans perdre le contexte de ce qui a changé.

**a11y-ci** comble cette lacune :

- Il utilise les rapports produits par [a11y-lint](https://pypi.org/project/a11y-lint/) (ou tout fichier JSON compatible).
- Il vérifie la gravité, le nombre de régressions et la détection de nouvelles anomalies.
- Il prend en charge des listes d'exceptions temporaires pour éviter que les suppressions ne deviennent permanentes.
- Il affiche chaque résultat dans le format **Quoi / Pourquoi / Solution** axé sur les personnes ayant une déficience visuelle.

Aucun appel réseau. Entièrement déterministe. Fonctionne dans tout système CI qui dispose de Python.

## Installation

```bash
pip install a11y-ci
```

Nécessite Python 3.11 ou une version ultérieure.

## Démarrage rapide

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

## Ce que cela fait

| Capacité | Description |
| ----------- | ------------- |
| **Severity gate** | Échec si une anomalie atteint ou dépasse la gravité configurée (par défaut : grave). |
| **Baseline regression** | Compare l'exécution actuelle à une référence sauvegardée ; échec si le nombre d'anomalies graves augmente ou si de nouvelles anomalies graves apparaissent. |
| **Allowlist with expiry** | Supprime temporairement les anomalies connues ; les entrées expirées échouent automatiquement la vérification. |
| **Low-vision-first output** | Chaque message suit le contrat `[OK]/[WARN]/[ERROR]` + Quoi/Pourquoi/Solution. |

## Référence de l'interface en ligne de commande (CLI)

```
a11y-ci gate [OPTIONS]

Options:
  --current PATH       Path to the current scorecard JSON (required)
  --baseline PATH      Path to the baseline scorecard JSON (optional)
  --allowlist PATH     Path to the allowlist JSON (optional)
  --fail-on SEVERITY   Minimum severity to fail on (default: serious)
                       Choices: info | minor | moderate | serious | critical
```

### Niveaux de gravité

| Level | Quand utiliser |
| ------- | ------------- |
| **critique** | Ne bloque que les problèmes bloquants. |
| **grave** | Par défaut. Bloque les problèmes qui affectent l'utilisation quotidienne. |
| **modéré** | Plus strict. Inclut les problèmes d'utilisabilité. |
| **mineur** | Le plus strict possible. Détecte la plupart des problèmes. |
| **information** | Détecte tout, y compris les notes d'information. |

## Codes de sortie

| Code | Signification |
| ------ | --------- |
| `0` | Toutes les vérifications ont réussi. |
| `2` | Erreur d'entrée ou de validation (JSON incorrect, fichier manquant, incompatibilité de schéma). |
| `3` | La vérification a échoué (seuil de gravité, régressions ou liste d'exceptions expirée). |

## Contrat de sortie

Chaque message suit le contrat axé sur les personnes ayant une déficience visuelle. Aucun message n'est simplement un code de statut ou une phrase énigmatique.

### La vérification réussit

```
[OK] Accessibility gate passed (ID: A11Y.CI.GATE.PASS)

What:
  No policy violations were detected.

Why:
  Current findings meet the configured threshold and baseline policy.

Fix:
  Proceed with merge/release.
```

### La vérification échoue

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

### Erreurs d'entrée

```
[ERROR] Allowlist is invalid (ID: A11Y.CI.ALLOWLIST.INVALID)

What:
  The allowlist file failed schema validation.

Why:
  The allowlist must include finding_id, expires, and reason for each entry.

Fix:
  Fix the allowlist JSON and re-run the gate.
```

## Format de la liste d'exceptions

Les entrées de la liste d'exceptions suppriment temporairement les anomalies connues. Chaque entrée nécessite :

| Field | Type | Description |
| ------- | ------ | ------------- |
| `finding_id` | chaîne de caractères | L'ID de la règle/de l'anomalie à supprimer. |
| `expires` | chaîne de caractères | Date au format ISO (`AAAA-MM-JJ`). Les entrées expirées échouent la vérification. |
| `reason` | chaîne de caractères | Au moins 10 caractères expliquant la suppression. |

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

Les entrées expirées de la liste d'exceptions ne sont pas ignorées silencieusement. Elles échouent la vérification avec un message clair indiquant quelle entrée a expiré et quand.

## Format du rapport

a11y-ci accepte les rapports contenant soit des nombres récapitulatifs, soit des anomalies brutes (ou les deux) :

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

Les ID des anomalies sont extraits de manière flexible des champs `id`, `rule_id`, `finding_id` ou `code`.

## Exemple pour GitHub Actions

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

### Mise à jour de la référence

Lorsque vous modifiez intentionnellement la sortie de l'interface en ligne de commande, mettez à jour la référence :

```bash
a11y-lint scan output.txt --json > baseline/a11y.scorecard.json
git add baseline/a11y.scorecard.json
git commit -m "Update a11y baseline"
```

## Fonctionnement

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

## Outils complémentaires

| Tool | Description |
| ------ | ------------- |
| [a11y-lint](https://pypi.org/project/a11y-lint/) | Analyseur d'accessibilité pour la sortie de l'interface en ligne de commande (génère des rapports). |
| [a11y-assist](https://pypi.org/project/a11y-assist/) | Assistant pour les utilisateurs ayant une faible vision, conçu pour gérer les erreurs de CLI. |

## Contribution

Consultez le fichier [CONTRIBUTING.md](CONTRIBUTING.md) pour connaître les directives.

## Licence

MIT
