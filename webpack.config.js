const path = require('path');
const fs   = require('fs');
const Dotenv = require('dotenv-webpack');

function readPluginPath() {
    const envFile = path.join(__dirname, '.env.production');
    if (!fs.existsSync(envFile)) return null;
    for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
        const m = line.match(/^PLUGIN_PATH=(.*)$/);
        if (m) return m[1].trim().replace(/^'(.*)'$/, '$1');
    }
    return null;
}

module.exports = (env, argv) => {
    const envPath = env && env.demo
        ? '.env.demo'
        : argv.mode === 'development' ? '.env' : `.env.${argv.mode}`;

    const entries = {
        dist: { import: './src/app/catalunya-map-main', filename: `./dist/${argv.mode}/catalunya-map.min.js` },
        web:  { import: './src/app/catalunya-map-main', filename: `./web/js/catalunya-map.min.js` },
    };

    if (env && env.plugin) {
        const pluginPath = process.env.PLUGIN_PATH || readPluginPath();
        if (!pluginPath) throw new Error('PLUGIN_PATH not set. Add it to .env.production or set the environment variable.');
        entries.wp = {
            import: './src/app/catalunya-map-main',
            filename: path.relative(path.resolve(__dirname), path.join(pluginPath, 'plugins/refreshMap/pages/js/catalunya-map.min.js')),
        };
    }

    return {
        entry: entries,
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, './'),
        },
        plugins: [
            new Dotenv({ path: envPath })
        ],
        devServer: {
            static: { directory: path.join(__dirname, './web') },
            compress: true,
            port: 9090,
        },
        externals: {
            jquery: 'jQuery',
        },
    };
};