var path = require('path'),
    libPath = path.join(__dirname, 'lib'),
    wwwPath = path.join(__dirname, 'www'),
    pkg = require('./package.json'),
    webpack = require('webpack'),
    autoprefixer = require('autoprefixer'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {};
module.exports = config;

config.devtool = 'source-map';

config.entry = {
    app: path.join(libPath, 'main.ts'),
    login: path.join(libPath, 'index-login.ts'),
    vendors: path.join(libPath, 'vendors.ts'),
    polyfills: path.join(libPath, 'polyfills.ts')
}

config.output = {
    path: wwwPath,
    filename: '[name].js',
    publicPath: '/public/'
}

config.module = {
    loaders: [
    {
        test: /\.ts$/,
        loader: 'ts',
        exclude: [
            /node_modules/
        ]
    },
    {
        test: /\.json$/,
        loader: "json"
    }
    , {
        test: /\.html$/,
        loader: 'raw'
    }
    , {
        test: /\.css$/,
        loader: "style!css!postcss",
        include: path.join(libPath, 'vendor/css')
    }
    , {
        test: /\.scss$/,
        loader: "style!css!postcss!sass",
        include: path.join(libPath, 'scss')
    }, 
    {
        test: /\.(png|jpg|ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/, // Use the file-loader for fonts
        loaders: ['file-loader']
    }
    ]
}

config.resolve = {
    extensions: ['', '.ts', '.js', '.html', '.scss'],
    modulesDirectories: ['node_modules'],
    alias: {
        cropperjs: "cropperjs/dist/cropper.min.js"
    }
}

config.postcss = [
    autoprefixer({ browsers: ['last 3 versions'] })
];

config.sassLoader = {
    outputStyle: 'compressed',
    precision: 10,
    sourceComments: false
};

config.plugins = [
    //new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendors", /* filename= */"vendor.bundle.js"),
    new webpack.ProvidePlugin({
        jQuery: 'jquery',
        $: 'jquery',
        jquery: 'jquery'
    }),
    new webpack.ProvidePlugin({
        cropperjs: 'cropperjs',
        Cropper: 'cropperjs'
    }),
    new HtmlWebpackPlugin({
        filename: 'index.html',
        chunkSortMode: 'dependency',
        excludeChunks: ['login'],
        pkg: pkg,
        template: path.join(libPath, 'index.html'),
        hash: false,
        inject: 'body'
    }),
    new HtmlWebpackPlugin({
        filename: 'index-login.html',
        chunkSortMode: 'dependency',
        pkg: pkg,
        chunks: ['login', 'vendors', 'polyfills'],
        template: path.join(libPath, 'index-login.html'),
        hash: false,
        inject: 'body'
    })
];
