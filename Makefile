.PHONY: verify lint test audit

verify: lint test audit

lint:
	python -m ruff check a11y_ci/

test:
	python -m pytest tests/ -v --tb=short

audit:
	pip-audit --strict --desc || true
