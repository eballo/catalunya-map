#!/usr/bin/env node
const fs   = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function readEnvFile(filePath) {
    if (!fs.existsSync(filePath)) return {};
    return fs.readFileSync(filePath, 'utf8').split('\n').reduce((acc, line) => {
        const m = line.match(/^([^#=]+)=(.*)$/);
        if (m) acc[m[1].trim()] = m[2].trim().replace(/^'(.*)'$/, '$1');
        return acc;
    }, {});
}

function getPluginPath() {
    if (process.env.PLUGIN_PATH) return process.env.PLUGIN_PATH;
    const env = readEnvFile(path.join(ROOT, '.env.production'));
    if (env.PLUGIN_PATH) return env.PLUGIN_PATH;
    throw new Error('PLUGIN_PATH not set. Add it to .env.production or set the environment variable.');
}

function minify(css) {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s*([\{\}\:\;\,])\s*/g, '$1')
        .trim();
}

const PLUGIN_PATH = getPluginPath();
const PLUGIN_CSS  = path.join(PLUGIN_PATH, 'plugins/refreshMap/pages/css');

// CSS — always overwrite (changes with each build)
const cssSrc = path.join(ROOT, 'web/css/catalunya-map-v3.css');
if (!fs.existsSync(cssSrc)) { console.error(`CSS source not found: ${cssSrc}`); process.exit(1); }
const cssContent = minify(fs.readFileSync(cssSrc, 'utf8'));
for (const dest of [path.join(PLUGIN_CSS, 'catalunya-map.min.css'), path.join(ROOT, 'dist/production/catalunya-map.min.css')]) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, cssContent);
    console.log(`CSS → ${path.relative(ROOT, dest)}`);
}
