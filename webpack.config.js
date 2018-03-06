var path = require('path')
var webpack = require('webpack')

var glob = require('glob')

var HtmlWebpackPlugin = require('html-webpack-plugin')

var WebpackNotifierPlugin = require('webpack-notifier')

var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

var ip = require('ip')

// 插件列表
let pluginsList = [
    new WebpackNotifierPlugin(),
    new webpack.ProvidePlugin({    // webpack的全局注入，在项目中少写点require
        React: ['react', 'default'],
        ReactDOM: ['react-dom', 'default']
    })
]



//入口文件列表
let newEntries = glob.sync('./src/*/main.js')

let entryArr = {}

newEntries.forEach(function (f) {
    //得到apps/question/index这样的文件名
    let tArr = f.split('/')
    let name = tArr[tArr.length - 2]
    entryArr[name] = f
});


// dll加载
let viewUrl = ''

// 系统页
//let chunksArr = ['common', 'main']
let chunksArr = []
let entryKeys = Object.keys(entryArr)

if (process.env.NODE_ENV === 'production') {
    pluginsList.push(
        new webpack.DefinePlugin({
            devtoolTip: false
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./public/vendor/vendor-manifest.json')
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false
        })
    )
} else {
    pluginsList.push(
        new webpack.DefinePlugin({
            devtoolTip: true
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./public/vendor/vendor-manifest-dev.json')
        })
    )
}

if (process.env.NODE_ENV === 'production') {

    entryKeys.map(function (key) {

        chunksArr = [key]

        // 首页处理
        viewUrl = './views/tpl/' + key + '/index.html'

        pluginsList.push(
            new HtmlWebpackPlugin({
                title: '物流工作台',
                filename: viewUrl,
                template: './tpl/tpl.html',
                hash: false,
                chunks: chunksArr
            })
        )

        return key
    })
} else {

    entryKeys.map(function (key) {

        chunksArr = [key]

        // 首页处理
        if (key == 'index') {
            viewUrl = 'index.html'
        } else {
            viewUrl = key + '/index.html'
        }

        pluginsList.push(
            new HtmlWebpackPlugin({
                title: '物流工作台',
                filename: viewUrl,
                template: './tpl/tpl-dev.html',
                hash: false,
                chunks: chunksArr
            })
        )

        return key
    })
}

var pathUrl, publicPathUrl
if (process.env.NODE_ENV === 'production') {
    pathUrl = './public'
    publicPathUrl = '/public/'
} else {
    pathUrl = './'
    publicPathUrl = '/'
}

module.exports = {
    entry: entryArr,
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    output: {
        path: path.resolve(__dirname, pathUrl),
        publicPath: publicPathUrl,
        filename: '[name]/build.js?[hash]',
        chunkFilename: '[name].js?[hash]'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'import-glob'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'file-loader',
                options: {
                    name: 'static/[path][name].[ext]?[hash:8]'
                }
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader',
                options: {
                    name: 'static/[path]/[name].[ext]?[hash:8]'
                }
            }
        ]
    },
    plugins: pluginsList,
    resolve: {
        alias: {
            // 'vue$': 'vue/dist/vue.common.js',
            // 'vuex$': 'vuex/dist/vuex.js',
            // 'vue-router$': 'vue-router/dist/vue-router.common.js'
        },
        extensions: ['.js', '.jsx', '.json']
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        port: 8787,
        host: ip.address(),
        proxy: {
            
        }
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map'
}


if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
}
