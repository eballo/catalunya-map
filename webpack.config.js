const path = require('path');

module.exports = {
    entry: './src/app/index.js',
    output: {
        filename: 'catalunya-map.min.js',
        path: path.resolve(__dirname, 'web/js'),
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