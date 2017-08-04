const webpack = require('webpack');
const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir);
}

var environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';

var config = {
    entry : {
        "site" : "./src/site/main.js",
        "qmgr" : "./src/qmgr/main.js"
    },
    output : {
        filename : "./build/[name].js"
    },
    module : {
        loaders : [
            { test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            { test: /\.vue$/, loader: "vue-loader" },
            { test: /\.css$/, loader: "style-loader!css-loader" },
            { test: /\.(woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader' },
            { test: /\.(png|jpe?g|gif|svg)$/i, loaders: [
                "file-loader?name=build/assets/[name]_[hash].[ext]&publicPath=ui/",
                'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
            ] }
        ]
    },
    resolve : {
        alias : {
            'vue$' : 'vue/dist/vue.common.js',
            '@' : resolve('src'),
            'config' : path.join(__dirname, 'config', environment)
        }
    },
    plugins : [
        // Workaround to exclude moment.js locales
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
};

module.exports = config;
