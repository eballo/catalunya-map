# Changelog

All notable changes to this project will be documented in this file.

## [13.4.0] - 2026-08-04

### Changed
- Upgrade dependencies: security patches + webpack-dev-server 6

## [13.3.0] - 2026-07-11

### Changed
- update versions

## [13.2.0] - 2026-07-11

### Changed
- add auto release

## [13.1.3] - 2026-06-17
### Fixed
- `catalunya-map-main.js`: substituït `show()` + `fadeIn()` redundants i `toggle()` per un fade de blanc via `#map-overlay` — el mapa apareix ara amb transició suau en lloc de sobtadament

## [13.1.2] - 2026-06-07
### Fixed
- `createLlistaComarquesText`: guard against `null` comarca name in sort comparator (`null ?? ''`) to prevent `TypeError: Cannot read properties of null (reading 'localeCompare')` when map data has missing names
- `buildComarcaStats`: strip query string (`?ver=…`) from `comarquesJsonUrl` before deriving `imagesUrl`, preventing broken marker icon paths when WordPress appends cache-busting parameters
- `createLlistaComarquesText`: filter out comarques with empty or missing names before rendering the list, preventing blank entries at the top when map data has entries with no name

## [13.1.1] - 2026-05-30
### Changed
- Improved test suite to reach 100% coverage across all source files (statements, branches, functions, lines)
- Added `scripts/deploy.js` for SFTP deployment (`npm run deploy`)
- Added `CLAUDE.md` with release checklist and development notes

## [13.1.0] - 2026-05-27
### Added
- Exposed map instance as `window.cmMapManager` so host pages can access the map programmatically.
- Added `recalcPositions()` method to `CatMap` to recompute and reposition comarca and capital labels (useful after dynamic layout changes).

## [13.0.0] - 2026-05-26
### Added
- Added `markersJsonUrl` config option to load a second JSON feed with building markers.
- Added `buildComarcaStats()` helper that aggregates marker counts per comarca and building type, generating an HTML breakdown injected into each comarca's info panel.
- Added `BUILDING_TYPES` constant listing all 15 supported building categories grouped by type (militar, civil, religios, altres).

### Changed
- Replaced `url_json` config key with `comarquesJsonUrl` (breaking rename).
- Migrated data loading from jQuery `$.ajax` to `Promise.all([fetch(), fetch()])`, loading comarques and markers in parallel.
- Map wrapper height is now dynamic (`mapHeight + 100 px`) instead of the hard-coded `700 px`.
- Increased default `textInitWidth` from 250 to 280 px.
- Redesigned side panel CSS: system font stack, scrollable panel, structured comarca-info component (`.cm-comarca-info`, `.cm-type-list`, `.cm-type-item`, `.cm-type-count`, `.cm-type-total`).
- Redesigned legend with glassmorphism style (backdrop blur, rounded card, compact rows).
- Removed legacy CSS classes: `.llistat-edificis`, `.button`, `.background`, `.badge`, `.greyBackground`, `#infoEdifici`, `#veure-contingut` (complex variant).

## [12.0.0] - 2026-05-16
### Added
- Added `buildPlugin` command to compile the project for plugin usage and automate copying files to the plugin directory.
- Fixed 20 npm security vulnerabilities via `npm audit fix`.
- Resolved 4 low-severity vulnerabilities in jsdom dependency chain by upgrading Jest ecosystem from v29 to v30 (`jest`, `jest-environment-jsdom`, `@jest/globals`, `babel-jest`).
- Fixed Jest v30 breaking change: replaced non-spec-compliant `delete window.location` test pattern with `testEnvironmentOptions.url` in Jest configuration.

## [11.0.0]
- Center names by default using `getBox`.
- Update to 2.3.0 Raphaël JS library.
- Add use of `extra_x` and `extra_y` to help to place names.

## [10.0.0]
- Migration to Webpack.
- Add Comarca Llucanès.

## [9.0.0]
- Integration with BrowserSync.
- Change build system to Gulp.

## [8.0.0]
- Add `grunt-contrib-watch` package.
- Add `grunt-replace` package.
- Remove effect when clicking on comarca.
- Add background grey color on mouse over.
- Change typography to Droid Sans.
- Add configuration file parameters (remove old configuration files for environment).

## [7.5.0]
- Background color lock when a comarca is selected.
- Configuration option v3.
- Add text and effects.

## [7.4.0]
- Larger text configuration.

## [7.3.0]
- Integration with Grunt.
- Migration to Node.js.
- Code refactoring.
- SonarCloud fixes.

## [7.2.0]
- Style fixes.

## [7.1.0]
- Add button option configuration.
- Styles for icons.

## [7.0.0]
- Update README.
- Create different configuration option files (v1, v2).
- Beautified all code.
- Code documentation.

## [6.2.0]
- Object-Oriented implementation (refactor).

## [6.1.0]
- Fix responsive design.

## [6.0.0]
- Add Droid Sans Font.
- Change colors.
- Update Raphaël JS and jQuery versions.
- Add Bootstrap.
- Add all buildings.

## [5.2.0]
- Add `onClick` property and `newWindow` (requested functionality).

## [5.1.0]
- Reposition of all the names.
- New screenshot.

## [5.0.0]
- Add Comarca del Moianès (Source image: `Mapa_comarcal_de_Catalunya_v2.svg`).

## [4.1.0]
- Add `touchStart` for tablets (iPad).

## [4.0.0]
- Add Comarca Info box on mouse click.

## [3.1.0]
- New `catalunya-map-path.js`.
- Add colors on mouse hover.

## [3.0.0]
- Add comarca and capital names.

## [2.1.0]
- Debug information and better resize example.

## [2.0.0]
- Resize functionality using [ScaleRaphael](http://www.shapevent.com/scaleraphael/).

## [1.0.0]
- Initial release with the map.