const webpack = require('webpack');
const path = require('path');

webpack([{
    entry: './src/index.js',
    output: {
        filename: 'p5ui.js',
        path: path.resolve(__dirname, '../test/public'),
    },
    optimization: {
        minimize: false
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: 'p5ui.js pre-v1.0.0 July 15, 2020 - by Saksham Shah'
        })
    ]
}, {
    entry: './src/index.js',
    output: {
        filename: 'p5ui.min.js',
        path: path.resolve(__dirname, '../test/public'),
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: 'p5ui.js pre-v1.0.0 July 15, 2020 - by Saksham Shah\n'
        })
    ]
}], (err, stats) => {
    if (err || stats.hasErrors()) {
        console.log('Build failed.');
        console.log(err);
        return;
    }

    console.log('Build succeeded.');
    console.log(stats.toString());
})