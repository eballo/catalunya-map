# CLAUDE.md — Catalunya Map

## Release process

Version bumping is **automated by CI/CD**: on every push to `main` (i.e. after a PR merges), the `release` job in `.github/workflows/build.yml` runs once the `sonarcloud` and `build` jobs pass, and:

- Collects every PR merged since the last `v*` tag (direct pushes with `[skip ci]` are left out). If there are none — an earlier run already released them — it stops there.
- Determines the bump level from the source branch names of those PRs, highest wins (`fix/*` → patch, `major/*` → major, anything else, `dependabot/*` included → minor).
- Bumps `package.json` and `package-lock.json` via `npm version <level> --no-git-tag-version`.
- Adds a new entry to the top of `changelog.md` listing those PRs' titles (`Title (#N)`).
- Updates the version string in `web/index.html`'s `<title>`/`<h1>` (label: `vX.Y` if patch=0, else `vX.Y.Z`). `demo.md` is not touched: the demo lives in one fixed directory.
- Commits the changes, creates an annotated tag `vX.Y.Z`, pushes to `main`, and publishes a GitHub Release with those notes.

Release runs are serialised (`concurrency: release-main`, shared with the manual `release.yml`, no cancel-in-progress), so merging several PRs in a row is safe: they queue instead of racing to push `main`. GitHub keeps only one pending run per group and may cancel an intermediate one; nothing is lost, because the next run picks up every PR since the last tag. If `main` moves while a run is releasing, it rebases over `[skip ci]` commits and stands down for anything else (that PR's queued run releases both). Rules: `catalunya-medieval-skills/docs/releases.md`.

Do **not** bump the version, edit `changelog.md`/`web/index.html`, or create tags/releases by hand — the CI job does this automatically after merge. If the auto-generated changelog entry needs more detail than the PR title provides, edit it in a follow-up commit after the release job runs.

Once the CI release job has run (new version tagged and released), finish the release manually:

### 1. Take a screenshot
- Start the dev server on port 9090 (port 9000 is used by PhpStorm): `npx webpack serve --mode development --port 9090 --hot &`
- Capture the live map using Playwright (inject `window.catalunyaMapConfig = { comarquesJsonUrl: 'http://localhost:9090/js/catalunya-map-path-sample.json', markersJsonUrl: '' }` as an init script so the map renders).
- Save the screenshot as `screenshot/screenshot-vX.Y.png` (e.g. `screenshot-v13.0.png`).
- **Stop the server** after the screenshot: `kill $(lsof -ti :9090)` — leaving it running blocks the port for future sessions.

### 2. Deploy
Only the latest version is kept on the demo site: `npm run deploy` always uploads to `<SFTP_REMOTE_PATH>/map` (`http://demo.catalunyamedieval.es/map`) and **wipes that directory first**. `SFTP_REMOTE_PATH` is the **base** directory (e.g. `/home/user/www/demo`), never versioned. It builds the demo itself, so no manual build is needed. The password prompt is interactive: hand this step to the user.
```bash
npm run deploy
```

---

## Development notes

- The webpack dev server default port (9000) conflicts with PhpStorm's Xdebug listener. Use port 9090 instead.
- `comarquesJsonUrl` and `markersJsonUrl` must be provided by the host page via `window.catalunyaMapConfig`; they default to `''`.
- Playwright is available via `npx playwright`; the chromium binary is cached at `~/.npm/_npx/`.
