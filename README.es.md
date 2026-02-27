<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.md">English</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
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

## ¿Por qué?

La verificación de accesibilidad solo es útil si evita regresiones. La mayoría de los equipos la omiten porque no existe una forma nativa de fallar una compilación debido a problemas de accesibilidad sin generar demasiados falsos positivos o perder el contexto de qué regresiones se han producido.

**a11y-ci** soluciona esa brecha:

- Consume informes generados por [a11y-lint](https://pypi.org/project/a11y-lint/) (o cualquier archivo JSON compatible).
- Evalúa la gravedad, el número de regresiones y la detección de nuevos problemas.
- Admite listas de exclusión temporales para que las supresiones nunca sean permanentes.
- Muestra cada resultado en el formato **¿Qué / Por qué / Solución** priorizando a usuarios con baja visión.

No realiza llamadas a la red. Es completamente determinista. Funciona en cualquier sistema de integración continua que tenga Python.

## Instalación

```bash
pip install a11y-ci
```

Requiere Python 3.11 o posterior.

## Guía rápida

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

## ¿Qué hace?

| Capacidad | Descripción |
|-----------|-------------|
| **Severity gate** | Falla si algún problema cumple o supera la gravedad configurada (por defecto: grave). |
| **Baseline regression** | Compara la ejecución actual con una línea de base guardada; falla si el número de problemas graves aumenta o aparecen nuevos identificadores de problemas graves. |
| **Allowlist with expiry** | Suprime temporalmente los problemas conocidos; las entradas caducadas fallan automáticamente la verificación. |
| **Low-vision-first output** | Cada mensaje sigue el contrato `[OK]/[ADVERTENCIA]/[ERROR]` + ¿Qué/Por qué/Solución. |

## Referencia de la interfaz de línea de comandos (CLI)

```
a11y-ci gate [OPTIONS]

Options:
  --current PATH       Path to the current scorecard JSON (required)
  --baseline PATH      Path to the baseline scorecard JSON (optional)
  --allowlist PATH     Path to the allowlist JSON (optional)
  --fail-on SEVERITY   Minimum severity to fail on (default: serious)
                       Choices: info | minor | moderate | serious | critical
```

### Niveles de gravedad

| Nivel | Cuándo usar |
|-------|-------------|
| **critical** | Solo bloquea problemas críticos. |
| **serious** | Por defecto. Bloquea problemas que afectan el uso diario. |
| **moderate** | Más estricto. Incluye problemas de usabilidad. |
| **minor** | El más estricto posible. Detecta la mayoría de los problemas. |
| **info** | Detecta todo, incluidas las notas informativas. |

## Códigos de salida

| Código | Significado |
|------|---------|
| `0` | Todas las verificaciones pasaron. |
| `2` | Error de entrada o validación (JSON incorrecto, archivo faltante, falta de coincidencia de esquema). |
| `3` | La verificación falló (umbral de gravedad, regresión o lista de exclusión caducada). |

## Contrato de salida

Cada mensaje sigue el contrato priorizando a usuarios con baja visión. Ningún mensaje es simplemente un código de estado o una línea de texto críptica.

### Verificación superada

```
[OK] Accessibility gate passed (ID: A11Y.CI.GATE.PASS)

What:
  No policy violations were detected.

Why:
  Current findings meet the configured threshold and baseline policy.

Fix:
  Proceed with merge/release.
```

### Verificación fallida

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

### Errores de entrada

```
[ERROR] Allowlist is invalid (ID: A11Y.CI.ALLOWLIST.INVALID)

What:
  The allowlist file failed schema validation.

Why:
  The allowlist must include finding_id, expires, and reason for each entry.

Fix:
  Fix the allowlist JSON and re-run the gate.
```

## Formato de la lista de exclusión

Las entradas de la lista de exclusión suprimen temporalmente los problemas conocidos. Cada entrada requiere:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `finding_id` | cadena de texto | El ID de la regla/problema a suprimir. |
| `expires` | cadena de texto | Fecha en formato ISO (`aaaa-mm-dd`). Las entradas caducadas fallan la verificación. |
| `reason` | cadena de texto | Una explicación de al menos 10 caracteres sobre la supresión. |

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

Las entradas caducadas de la lista de exclusión no se ignoran silenciosamente. Fallan la verificación con un mensaje claro que explica qué entrada caducó y cuándo.

## Formato del informe

a11y-ci acepta informes con recuentos resumidos o problemas individuales (o ambos):

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

Los ID de los problemas se extraen de forma flexible de los campos `id`, `rule_id`, `finding_id` o `code`.

## Ejemplo para GitHub Actions

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

### Actualización de la línea de base

Cuando cambia intencionalmente la salida de la interfaz de línea de comandos, actualice la línea de base:

```bash
a11y-lint scan output.txt --json > baseline/a11y.scorecard.json
git add baseline/a11y.scorecard.json
git commit -m "Update a11y baseline"
```

## Cómo funciona

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

## Herramientas complementarias

| Herramienta | Descripción |
|------|-------------|
| [a11y-lint](https://pypi.org/project/a11y-lint/) | Verificador de accesibilidad para la salida de la interfaz de línea de comandos (genera informes). |
| [a11y-assist](https://pypi.org/project/a11y-assist/) | Asistente priorizando a usuarios con baja visión para los fallos de la interfaz de línea de comandos. |

## Seguridad y alcance de los datos

- **Datos accedidos:** Lee archivos de informe JSON desde el disco. Compara los problemas con las líneas de base y las listas de exclusión.
- **Datos NO accedidos:** No realiza solicitudes a la red. No recopila datos de telemetría. No almacena datos de usuario. No utiliza credenciales ni tokens.
- **Permisos requeridos:** Solo se requiere acceso de lectura a los archivos de informe, línea de base y lista de exclusión.

## Informe

| Verificación | Estado |
|------|--------|
| A. Línea base de seguridad | PASADO |
| B. Manejo de errores | PASADO |
| C. Documentación para operadores | PASADO |
| D. Higiene en el envío | PASADO |
| E. Identidad | PASADO |

## Contribuciones

Consulte [CONTRIBUTING.md](CONTRIBUTING.md) para obtener las directrices.

## Licencia

MIT

---

Creado por <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a>
