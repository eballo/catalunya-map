# CLAUDE.md — Catalunya Map

## Release checklist

Each time a new release is prepared, perform **all** of the following steps in order:

### 1. Determine the new version number
- **Major** (`X.0.0`): breaking changes (renamed config keys, removed public API, changed data contract).
- **Minor** (`X.Y.0`): new backwards-compatible features.
- **Patch** (`X.Y.Z`): bug fixes only.

### 2. Update version in package files
- `package.json` → `"version"` field.
- `package-lock.json` → top-level `"version"` field **and** the inner `packages[""].version` field (two occurrences, use replace_all).

### 3. Update `changelog.md`
Add a new entry at the top (below the `# Changelog` heading) using this format:

```
## [X.Y.Z] - YYYY-MM-DD
### Added
- ...
### Changed
- ...
### Fixed
- ...
### Removed
- ...
```

Only include sections that have entries. Use today's date.

### 4. Update `demo.md`
Add a new entry at the bottom of the list following the existing pattern:
`- [Demo vX.Y](http://demo.catalunyamedieval.es/mapXY)`
(e.g. v13.0 → `map13`, v14.0 → `map14`)

### 5. Update version string in `web/index.html`
The `<title>` and `<h1>` tags contain the version (e.g. `Demo v12.0`). Update them to match the new version.

### 6. Take a screenshot
- Start the dev server on port 9090 (port 9000 is used by PhpStorm): `npx webpack serve --mode development --port 9090 --hot &`
- Capture the live map using Playwright (inject `window.catalunyaMapConfig = { comarquesJsonUrl: 'http://localhost:9090/js/catalunya-map-path-sample.json', markersJsonUrl: '' }` as an init script so the map renders).
- Save the screenshot as `screenshot/screenshot-vX.Y.png` (e.g. `screenshot-v13.0.png`).
- **Stop the server** after the screenshot: `kill $(lsof -ti :9090)` — leaving it running blocks the port for future sessions.

### 7. Deploy
Actualitza `SFTP_REMOTE_PATH` a `.env.production` amb el nou path (e.g. `/var/www/html/map13`), fes el build i puja:
```bash
npm run buildProd
npm run deploy
```

---

## Development notes

- The webpack dev server default port (9000) conflicts with PhpStorm's Xdebug listener. Use port 9090 instead.
- `comarquesJsonUrl` and `markersJsonUrl` must be provided by the host page via `window.catalunyaMapConfig`; they default to `''`.
- Playwright is available via `npx playwright`; the chromium binary is cached at `~/.npm/_npx/`.
