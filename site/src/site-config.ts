import type { SiteConfig } from '@mcptoolshop/site-theme';

export const config: SiteConfig = {
  title: 'a11y-ci',
  description: 'CI gate for a11y-lint scorecards. Low-vision-first output with strict policy enforcement.',
  logoBadge: 'CI',
  brandName: 'a11y-ci',
  repoUrl: 'https://github.com/mcp-tool-shop-org/a11y-ci',
  footerText: 'MIT Licensed — built by <a href="https://github.com/mcp-tool-shop-org" style="color:var(--color-muted);text-decoration:underline">mcp-tool-shop-org</a>',

  hero: {
    badge: 'Open source',
    headline: 'a11y-ci',
    headlineAccent: 'Block regressions. Not developers.',
    description: 'CI gate for accessibility scorecards. Severity thresholds, baseline regression detection, time-boxed allowlists, and low-vision-first What/Why/Fix output.',
    primaryCta: { href: '#quick-start', label: 'Get started' },
    secondaryCta: { href: '#features', label: 'Learn more' },
    previews: [
      { label: 'Install', code: 'pip install a11y-ci' },
      { label: 'Gate', code: 'a11y-ci gate --current a11y.scorecard.json' },
      { label: 'Baseline', code: 'a11y-ci gate --current current.json --baseline baseline.json' },
    ],
  },

  sections: [
    {
      kind: 'features',
      id: 'features',
      title: 'Core Features',
      subtitle: 'Accessibility linting is only useful if it blocks regressions.',
      features: [
        { title: 'Severity Gate', desc: 'Fail the build when findings meet or exceed your configured severity threshold. Default: serious.' },
        { title: 'Baseline Regression', desc: 'Compare against a saved baseline. Fail if serious+ count increases or new serious+ IDs appear.' },
        { title: 'Time-Boxed Allowlists', desc: 'Suppress known findings temporarily. Expired entries automatically fail the gate — no permanent suppressions.' },
        { title: 'Low-Vision-First Output', desc: 'Every message follows the What/Why/Fix contract. No cryptic status codes or one-liners.' },
        { title: 'Fully Deterministic', desc: 'No network calls. Same input always produces the same result. Runs anywhere Python runs.' },
        { title: 'Clear Exit Codes', desc: 'Exit 0 = passed, exit 2 = input error, exit 3 = policy failure. No ambiguity.' },
      ],
    },
    {
      kind: 'code-cards',
      id: 'quick-start',
      title: 'Quick Start',
      cards: [
        {
          title: 'Install & gate',
          code: '# Install\npip install a11y-ci\n\n# Generate scorecard with a11y-lint\na11y-lint scan output.txt --json > a11y.scorecard.json\n\n# Gate on the scorecard\na11y-ci gate --current a11y.scorecard.json',
        },
        {
          title: 'With baseline + allowlist',
          code: '# Full pipeline\na11y-ci gate \\\n  --current a11y.scorecard.json \\\n  --baseline baseline/a11y.scorecard.json \\\n  --allowlist a11y-ci.allowlist.json \\\n  --fail-on moderate',
        },
      ],
    },
    {
      kind: 'data-table',
      id: 'severity',
      title: 'Severity Levels',
      columns: ['Level', 'When to Use'],
      rows: [
        ['critical', 'Only block on show-stoppers'],
        ['serious', 'Default — blocks on barriers that affect daily use'],
        ['moderate', 'Stricter — includes usability issues'],
        ['minor', 'Strictest practical — catches most issues'],
        ['info', 'Catches everything including informational notes'],
      ],
    },
    {
      kind: 'data-table',
      id: 'exit-codes',
      title: 'Exit Codes',
      columns: ['Code', 'Meaning'],
      rows: [
        ['0', 'All checks passed'],
        ['2', 'Input or validation error (bad JSON, missing file, schema mismatch)'],
        ['3', 'Policy gate failed (severity threshold, regression, or expired allowlist)'],
      ],
    },
    {
      kind: 'api',
      id: 'cli',
      title: 'CLI Reference',
      apis: [
        { signature: 'a11y-ci gate --current PATH', description: 'Gate on a scorecard. Fails if findings meet or exceed the severity threshold.' },
        { signature: '--baseline PATH', description: 'Compare against a saved baseline. Fails on regression.' },
        { signature: '--allowlist PATH', description: 'Suppress known findings temporarily. Expired entries auto-fail.' },
        { signature: '--fail-on SEVERITY', description: 'Minimum severity to fail on: info | minor | moderate | serious | critical (default: serious).' },
      ],
    },
    {
      kind: 'data-table',
      id: 'companion',
      title: 'Companion Tools',
      columns: ['Tool', 'Description'],
      rows: [
        ['a11y-lint', 'Accessibility linter for CLI output — produces scorecards'],
        ['a11y-assist', 'Low-vision-first assistant for CLI failures'],
        ['a11y-demo-site', 'End-to-end demo with provenance verification'],
      ],
    },
  ],
};
