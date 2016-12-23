var webpack = require('webpack');

module.exports = {
    entry: {
        showMessage: __dirname + '/js/content_scripts/showMessage.js',
        injectPic: __dirname + '/js/content_scripts/injectPic.js',
        background: __dirname + '/js/background.js',
        popup: __dirname + '/js/popup.js'
    },
    output: {
        path: __dirname + '/extension/src',
        filename: '[name].min.js'
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }, {
                test: /\.less$/,
                loader: 'style!css!less'
            }, {
                test: /\.jade$/,
                loader: 'jade-loader'
            }
        ]
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};