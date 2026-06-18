# Tool Install Policy

## Default

Codex must not install new plugins, global CLI tools, browser extensions, MCP servers, or cloud service plugins by default.

## Global Installs

Global installs are denied by default:

- no `brew install`
- no `npm install -g`
- no `pipx install`
- no shell installer fetched over HTTP
- no pipe-to-shell installer

If a required tool is missing, Codex reports the missing tool and suggests a human-reviewed install command. Codex must not install it unless the active roadmap task explicitly sets install permission.

## Project Dependencies

Project dependency changes must happen through a PR. They must update `package.json` and, when applicable, `package-lock.json`. Any new dependency must be reviewed with `npm run third-party:check`.

## Production Configuration

Real production tool configuration must not be committed. Local config belongs outside Git or in ignored local files.

## Auditability

Every new tool must be reviewable in a PR diff:

- reason for use
- phase where it is allowed
- required permissions
- install mode
- allowed commands
- forbidden commands
