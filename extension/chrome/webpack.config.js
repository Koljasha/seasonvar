//Webpack v4 Config

const path = require('path');

const eslintFriendlyFormatter = require('eslint-friendly-formatter');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const CleanWebpackPlugin = require('clean-webpack-plugin');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: {
        eventPage: './src/eventPage.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },

    optimization: {
        minimizer: [
            new UglifyJsPlugin({})
        ]
    },

    plugins: [
        new CleanWebpackPlugin(['dist']),
        new CopyWebpackPlugin([{ from: 'src' }])
    ],
    module: {
        rules: [{
            test: /\.js$/,
            enforce: 'pre',
            exclude: /node_modules/,
            options: {
                formatter: eslintFriendlyFormatter,
                emitWarning: false
            },
            loader: 'eslint-loader'
        },
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }
        ]
    }
};
