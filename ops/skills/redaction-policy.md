# Redaction Policy Skill

Use this card before staging, committing, or publishing agent output.

## Default

Redaction is a hard fail by default. The checker must stop on likely secrets, private server details, credential-bearing URLs, or production environment values.

## Fix Mode

`--fix` may only rewrite low-risk generated text such as a redacted placeholder in a report. Real secrets are never auto-redacted.

## Never Print

The checker must never print the secret value. It may print:

- file path
- line number
- rule name
- remediation hint

## Hard-Fail Categories

- private key blocks
- GitHub credentials
- Supabase credentials
- Stripe credentials
- OpenAI credentials
- Anthropic credentials
- AWS access identifiers
- credential-bearing URLs, except explicit test fixtures
- `.env.production` values
- temporary GitHub archive URLs
- public server address candidates

## Test Fixture Allowlist

- `localhost`
- `127.0.0.1`
- `0.0.0.0`
- `example.com`
- `example.invalid`
- `https://user:pass@example.com`
- `sk_test_dummy`
