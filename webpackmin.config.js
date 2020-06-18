const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'p5ui.min.js',
        path: path.resolve(__dirname, 'test/public'),
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: 'p5ui.min.js - By Saksham Shah\n'
        })
    ]
};