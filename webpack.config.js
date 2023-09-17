const path = require('path');

module.exports = {
    entry: {
        prod:  { import: './src/app/catalunya-map-prod', filename: './dist/prod/catalunya-map.min.js'},
        local: { import: './src/app/catalunya-map-local', filename: './dist/local/catalunya-map.min.js'},
        work:  { import: './src/app/catalunya-map-work', filename: './dist/work/catalunya-map.min.js'},
        web:   { import: './src/app/catalunya-map-local', filename: './web/js/catalunya-map.min.js'},
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './'),
    },
    devServer: {
        static: {
            directory: path.join(__dirname, './web'),
        },
        compress: true,
        port: 9000,
    },
    externals: {
        jquery: 'jQuery',
    },
};