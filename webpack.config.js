const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'p5ui.js',
        path: path.resolve(__dirname, 'test/public'),
    },
    optimization: {
        minimize: false
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: 'p5ui.js - By Saksham Shah\n'
        })
    ]
};