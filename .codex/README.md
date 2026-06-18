# Codex Local Config

This directory may contain example project config for Codex. Real local config must not be committed.

Allowed in Git:

- `.codex/README.md`
- `.codex/config.example.toml`

Ignored local files:

- `.codex/config.toml`
- `.codex/*.local.toml`

Do not place credentials, private endpoints, public server addresses, browser profile paths, or unrestricted filesystem roots in committed config.
