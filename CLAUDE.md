# CLAUDE.md — Catalunya Map

## Release process

Version bumping is **automated by CI/CD**: on every push to `main` (i.e. after a PR merges), the `release` job in `.github/workflows/build.yml` runs once the `sonarcloud` and `build` jobs pass, and:

- Collects every PR merged since the last `v*` tag (direct pushes with `[skip ci]` are left out). If there are none — an earlier run already released them — it stops there.
- Determines the bump level from the source branch names of those PRs, highest wins (`fix/*` → patch, `major/*` → major, anything else, `dependabot/*` included → minor).
- Bumps `package.json` and `package-lock.json` via `npm version <level> --no-git-tag-version`.
- Adds a new entry to the top of `changelog.md` listing those PRs' titles (`Title (#N)`).
- Appends a new line to `demo.md` and updates the version string in `web/index.html`'s `<title>`/`<h1>`, both computed purely from the new version number:
  - slug: `13.0.0` → `map13` (minor=0, patch=0), `13.1.0` → `map131` (patch=0), `13.1.1` → `map1311` (patch≠0)
  - label: `vX.Y` if patch=0, else `vX.Y.Z`
- Commits the changes, creates an annotated tag `vX.Y.Z`, pushes to `main`, and publishes a GitHub Release with those notes.

Release runs are serialised (`concurrency: release-main`, shared with the manual `release.yml`, no cancel-in-progress), so merging several PRs in a row is safe: they queue instead of racing to push `main`. GitHub keeps only one pending run per group and may cancel an intermediate one; nothing is lost, because the next run picks up every PR since the last tag. If `main` moves while a run is releasing, it rebases over `[skip ci]` commits and stands down for anything else (that PR's queued run releases both). Rules: `catalunya-medieval-skills/docs/releases.md`.

Do **not** bump the version, edit `changelog.md`/`demo.md`/`web/index.html`, or create tags/releases by hand — the CI job does this automatically after merge. If the auto-generated changelog entry needs more detail than the PR title provides, edit it in a follow-up commit after the release job runs.

Once the CI release job has run (new version tagged and released), finish the release manually:

### 1. Take a screenshot
- Start the dev server on port 9090 (port 9000 is used by PhpStorm): `npx webpack serve --mode development --port 9090 --hot &`
- Capture the live map using Playwright (inject `window.catalunyaMapConfig = { comarquesJsonUrl: 'http://localhost:9090/js/catalunya-map-path-sample.json', markersJsonUrl: '' }` as an init script so the map renders).
- Save the screenshot as `screenshot/screenshot-vX.Y.png` (e.g. `screenshot-v13.0.png`).
- **Stop the server** after the screenshot: `kill $(lsof -ti :9090)` — leaving it running blocks the port for future sessions.

### 2. Deploy
El script llegeix la configuració de `.env.demo` i construeix el path remot automàticament a partir de la versió de `package.json` (mateixes slug rules del bump automàtic de CI). No cal editar cap fitxer `.env` manualment. Simplement executa:
```bash
npm run deploy
```

---

## Development notes

- The webpack dev server default port (9000) conflicts with PhpStorm's Xdebug listener. Use port 9090 instead.
- `comarquesJsonUrl` and `markersJsonUrl` must be provided by the host page via `window.catalunyaMapConfig`; they default to `''`.
- Playwright is available via `npx playwright`; the chromium binary is cached at `~/.npm/_npx/`.
