<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/a11y-ci/readme.png" alt="a11y-ci logo" width="400" />
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

## क्यों

एक्सेसिबिलिटी लिंटिंग केवल तभी उपयोगी होती है जब यह पुरानी समस्याओं को ठीक करने में मदद करे। अधिकांश टीमें इसका उपयोग नहीं करती हैं क्योंकि कोई भी ऐसा सीधा तरीका नहीं है जिससे बिल्ड को एक्सेसिबिलिटी संबंधी समस्याओं के कारण विफल किया जा सके, बिना झूठी त्रुटियों के या यह जाने बिना कि किस चीज में समस्या है।

**a11y-ci** इस अंतर को पाटता है:

- यह [a11y-lint](https://pypi.org/project/a11y-lint/) (या किसी भी संगत JSON) द्वारा उत्पन्न स्कोरकार्ड का उपयोग करता है।
- यह गंभीरता, पुरानी समस्याओं की संख्या और नई समस्याओं का पता लगाने पर आधारित होता है।
- यह अस्थायी रूप से समस्याओं को अनदेखा करने की अनुमति देता है, ताकि उन्हें स्थायी रूप से न हटाया जाए।
- यह प्रत्येक परिणाम को "समस्या/कारण/समाधान" प्रारूप में प्रदर्शित करता है, जो दृष्टिबाधित लोगों के लिए उपयुक्त है।

इसमें नेटवर्क कनेक्शन की आवश्यकता नहीं होती है। यह पूरी तरह से विश्वसनीय है। यह किसी भी CI सिस्टम पर चलता है जिसमें पायथन स्थापित है।

## इंस्टॉलेशन

```bash
pip install a11y-ci
```

इसके लिए पायथन 3.11 या उसके बाद के संस्करण की आवश्यकता है।

## शुरुआत कैसे करें

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

## यह क्या करता है

| क्षमता | विवरण |
| ----------- | ------------- |
| **Severity gate** | यदि कोई भी समस्या कॉन्फ़िगर की गई गंभीरता (डिफ़ॉल्ट: गंभीर) या उससे अधिक की है, तो यह विफल हो जाता है। |
| **Baseline regression** | यह वर्तमान रन की तुलना सहेजे गए बेसलाइन से करता है; यदि गंभीर समस्याओं की संख्या बढ़ती है या नई गंभीर समस्याएं दिखाई देती हैं, तो यह विफल हो जाता है। |
| **Allowlist with expiry** | यह ज्ञात समस्याओं को अस्थायी रूप से अनदेखा करता है; समय सीमा समाप्त होने पर, ये प्रविष्टियां स्वचालित रूप से विफल हो जाती हैं। |
| **Low-vision-first output** | प्रत्येक संदेश `[OK]`/`[WARN]`/`[ERROR]` + समस्या/कारण/समाधान प्रारूप का पालन करता है। |

## कमांड-लाइन इंटरफ़ेस (CLI) संदर्भ

```
a11y-ci gate [OPTIONS]

Options:
  --current PATH       Path to the current scorecard JSON (required)
  --baseline PATH      Path to the baseline scorecard JSON (optional)
  --allowlist PATH     Path to the allowlist JSON (optional)
  --fail-on SEVERITY   Minimum severity to fail on (default: serious)
                       Choices: info | minor | moderate | serious | critical
```

### गंभीरता स्तर

| Level | कब उपयोग करें |
| ------- | ------------- |
| **गंभीर (critical)** | केवल उन समस्याओं को ब्लॉक करें जो काम करने में बाधा डालती हैं। |
| **गंभीर (serious)** | डिफ़ॉल्ट। उन समस्याओं को ब्लॉक करता है जो दैनिक उपयोग को प्रभावित करती हैं। |
| **मध्यम (moderate)** | अधिक सख्त। इसमें उपयोगिता संबंधी समस्याओं को शामिल किया गया है। |
| **मामूली (minor)** | सबसे सख्त व्यावहारिक स्तर। अधिकांश समस्याओं का पता लगाता है। |
| **जानकारी (info)** | सभी चीजों का पता लगाता है, जिसमें सूचनात्मक टिप्पणियां भी शामिल हैं। |

## एग्जिट कोड

| Code | अर्थ |
| ------ | --------- |
| `0` | सभी जांच पास हो गईं |
| `2` | इनपुट या सत्यापन त्रुटि (खराब JSON, गुम फ़ाइल, स्कीमा मिसमैच) |
| `3` | नीति विफल हो गई (गंभीरता सीमा, पुरानी समस्या, या समय सीमा समाप्त हो चुकी अनदेखी प्रविष्टि) |

## आउटपुट प्रारूप

प्रत्येक संदेश दृष्टिबाधित लोगों के लिए उपयुक्त प्रारूप का पालन करता है। कोई भी संदेश केवल एक स्थिति कोड या अस्पष्ट वाक्य नहीं होता है।

### जांच पास हो गई

```
[OK] Accessibility gate passed (ID: A11Y.CI.GATE.PASS)

What:
  No policy violations were detected.

Why:
  Current findings meet the configured threshold and baseline policy.

Fix:
  Proceed with merge/release.
```

### जांच विफल हो गई

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

### इनपुट त्रुटियां

```
[ERROR] Allowlist is invalid (ID: A11Y.CI.ALLOWLIST.INVALID)

What:
  The allowlist file failed schema validation.

Why:
  The allowlist must include finding_id, expires, and reason for each entry.

Fix:
  Fix the allowlist JSON and re-run the gate.
```

## अनदेखी प्रारूप

अनदेखी प्रविष्टियां ज्ञात समस्याओं को अस्थायी रूप से अनदेखा करती हैं। प्रत्येक प्रविष्टि के लिए निम्नलिखित जानकारी आवश्यक है:

| Field | Type | विवरण |
| ------- | ------ | ------------- |
| `finding_id` | string (स्ट्रिंग) | उस नियम/समस्या का आईडी जिसे अनदेखा किया जाना है। |
| `expires` | string (स्ट्रिंग) | ISO तिथि (`yyyy-mm-dd`)। समय सीमा समाप्त होने पर, प्रविष्टियां विफल हो जाती हैं। |
| `reason` | string (स्ट्रिंग) | कम से कम 10 अक्षरों का विवरण जो अनदेखी का कारण बताता है। |

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

समय सीमा समाप्त होने वाली अनदेखी प्रविष्टियों को चुपचाप अनदेखा नहीं किया जाता है। वे एक स्पष्ट संदेश के साथ विफल हो जाती हैं जो बताती है कि कौन सी प्रविष्टि समाप्त हो गई और कब।

## स्कोरकार्ड प्रारूप

a11y-ci सारांश गणना या कच्चे डेटा (या दोनों) वाले स्कोरकार्ड स्वीकार करता है।

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

समस्या आईडी को `id`, `rule_id`, `finding_id`, या `code` फ़ील्ड से लचीले ढंग से निकाला जाता है।

## GitHub Actions का उदाहरण

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

### बेसलाइन को अपडेट करना

जब आप जानबूझकर CLI आउटपुट बदलते हैं, तो बेसलाइन को अपडेट करें:

```bash
a11y-lint scan output.txt --json > baseline/a11y.scorecard.json
git add baseline/a11y.scorecard.json
git commit -m "Update a11y baseline"
```

## यह कैसे काम करता है

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

## सहायक उपकरण

| Tool | विवरण |
| ------ | ------------- |
| [a11y-lint](https://pypi.org/project/a11y-lint/) | CLI आउटपुट के लिए एक्सेसिबिलिटी लिंटर (स्कोरकार्ड उत्पन्न करता है) |
| [a11y-assist](https://pypi.org/project/a11y-assist/) | कम दृष्टि वाले उपयोगकर्ताओं के लिए, CLI (कमांड लाइन इंटरफेस) विफलताओं में सहायक उपकरण। |

## योगदान

मार्गदर्शिका के लिए, [CONTRIBUTING.md](CONTRIBUTING.md) देखें।

## लाइसेंस

MIT
