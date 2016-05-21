'use strict';

const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    context: path.join(__dirname, 'bundles'),
    entry: {
        main: './main/main.js',
        questPage: './quest_page/quest_page.js',
        quests: './quests/quests.js',
        profile: './profile/profile.js',
        questAddition: './questAddition/questAddition.js'
    },
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'public'),
        filename: '[name].js',
        sourceMapFilename: '[name].map',
        publicPath: '/'
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },
            {
                test: /(\.png$)|(\.jpg$)|(\.jpeg$)/,
                loader: 'file-loader'
            },
            {
                test: /\.svg$/,
                loader: 'svg-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /\.hbs$/,
                loader: 'handlebars-loader',
                query: {
                    partialDirs: [
                        path.join(__dirname, 'blocks')
                    ]
                }
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name].css')
    ],
    postcss: () => [autoprefixer]
};
