var webpack = require("webpack");
const WebpackMd5Hash = require('webpack-md5-hash');
var webpackConfig = require('./webpack.config.js');

webpackConfig.plugins.concat([
	new WebpackMd5Hash(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
]);

module.exports = webpackConfig;
