"""Tests for the validate CLI command."""

import json
from pathlib import Path

from click.testing import CliRunner

from a11y_ci.cli import main

FIX = Path(__file__).parent / "fixtures"


class TestValidateScorecard:
    """Validate subcommand — scorecard tests."""

    def test_valid_scorecard(self):
        runner = CliRunner()
        result = runner.invoke(main, ["validate", "--scorecard", str(FIX / "current_ok.json")])
        assert result.exit_code == 0
        assert "Scorecard OK" in result.output
        assert "VALIDATE.PASS" in result.output

    def test_valid_scorecard_with_findings(self):
        runner = CliRunner()
        result = runner.invoke(main, ["validate", "--scorecard", str(FIX / "current_fail.json")])
        assert result.exit_code == 0
        assert "Scorecard OK" in result.output

    def test_invalid_scorecard_json(self, tmp_path):
        bad = tmp_path / "bad.json"
        bad.write_text("not json", encoding="utf-8")
        runner = CliRunner()
        result = runner.invoke(main, ["validate", "--scorecard", str(bad)])
        assert result.exit_code == 2
        assert "VALIDATE.FAIL" in result.output


class TestValidateAllowlist:
    """Validate subcommand — allowlist tests."""

    def test_valid_allowlist(self):
        runner = CliRunner()
        result = runner.invoke(main, ["validate", "--allowlist", str(FIX / "allowlist_ok.json")])
        assert result.exit_code == 0
        assert "Allowlist OK" in result.output
        assert "none expired" in result.output

    def test_valid_allowlist_with_expired(self):
        runner = CliRunner()
        result = runner.invoke(
            main, ["validate", "--allowlist", str(FIX / "allowlist_expired.json")]
        )
        assert result.exit_code == 0
        assert "Allowlist OK" in result.output
        assert "expired" in result.output

    def test_invalid_allowlist(self, tmp_path):
        bad = tmp_path / "bad_allow.json"
        bad.write_text(json.dumps({"allow": [{"wrong": "schema"}]}), encoding="utf-8")
        runner = CliRunner()
        result = runner.invoke(main, ["validate", "--allowlist", str(bad)])
        assert result.exit_code == 2
        assert "VALIDATE.FAIL" in result.output


class TestValidateBoth:
    """Validate subcommand — combined tests."""

    def test_both_valid(self):
        runner = CliRunner()
        result = runner.invoke(
            main,
            [
                "validate",
                "--scorecard",
                str(FIX / "current_ok.json"),
                "--allowlist",
                str(FIX / "allowlist_ok.json"),
            ],
        )
        assert result.exit_code == 0
        assert "Scorecard OK" in result.output
        assert "Allowlist OK" in result.output
        assert "VALIDATE.PASS" in result.output

    def test_no_input_gives_error(self):
        runner = CliRunner()
        result = runner.invoke(main, ["validate"])
        assert result.exit_code == 2
        assert "VALIDATE.NO_INPUT" in result.output
