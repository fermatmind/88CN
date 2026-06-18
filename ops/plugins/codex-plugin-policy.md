# Codex Plugin Policy

## Default

Codex must not install plugins by default. Approved repo-native skill cards are listed in `ops/plugins/approved-plugins.json`. Denied categories are listed in `ops/plugins/denied-plugins.json`.

## Approval Requirements

Any future plugin request must state:

- plugin id
- task phase
- reason
- permissions
- install mode
- data it can read
- data it can write
- rollback plan

## Denial Rules

Plugins are denied when they request browser session data, unrestricted filesystem access, production database writes, live payment actions, cloud writes, private credential stores, or unreviewed outbound communication.

## Review Rule

Plugin changes must be committed as reviewable registry updates. Codex must not install or activate a plugin in OPS2.
