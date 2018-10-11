// Webpack v4 Config

const path = require('path');
// const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');


const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: {
        index: './src/script.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    // devServer: {
    //     contentBase: path.resolve(__dirname, 'dist'),
    //     compress: true,
    //     port: 9090
    // },

    optimization: {
        minimizer: [
            new UglifyJsPlugin({}),
            new OptimizeCSSAssetsPlugin({})
        ]
    },

    plugins: [
        new CleanWebpackPlugin(['dist']),
        new MiniCssExtractPlugin({}),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify: devMode ? false : {
                removeComments: true,
                collapseWhitespace: true,
                conservativeCollapse: true
            },
        }),
        new CopyWebpackPlugin([
            { from: 'src/img/', to: 'img/' },
            { from: 'src/ext/', to: 'ext/' },
        ]),
        new ImageminPlugin({
            disable: devMode,
            test: /\.(jpe?g|png|gif)$/i,
            optipng: {
                optimizationLevel: 7
            },
            plugins: [
                imageminMozjpeg({
                    quality: 90,
                    progressive: true
                })
            ]
        })
        // new VueLoaderPlugin(),
        // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],

    // resolve: {
    //     alias: {
    //         'vue$': 'vue/dist/vue.esm.js'
    //     }
    // },

    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            },
            // {
            //     test: /\.scss$/,
            //     use: [
            //         devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            //         "css-loader",
            //         'sass-loader'
            //     ]
            // },
            // {
            //     test: /\.vue$/,
            //     loader: 'vue-loader'
            // },
            // {
            //     test: /\.(jpg|png|crx|nex|xpi)$/,
            //     use: [{
            //         loader: 'file-loader',
            //         options: {
            //             name: '[name].[ext]'
            //         }
            //     }]
            // }
        ]
    }
}