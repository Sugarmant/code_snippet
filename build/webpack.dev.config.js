const path = require('path');
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const dirname = __dirname.replace('build','')

// webpack.config.js
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

const webpack = require("webpack")

module.exports = {
    entry: dirname+'/src/main.js',
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(dirname,'dist'),
        clean:true
    },
    resolve:{
        alias: {
            '@': path.join(dirname,'src')
        }
    },
    module:{
        rules:[
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader","postcss-loader"],
            },
            {
                test: /\.less$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader","postcss-loader","less-loader"],
            }
        ],
    },
    devtool: 'inline-source-map',
    plugins:[
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            filename:'index.html',
            template:dirname+'/public/index.html'
        }),
        new MiniCssExtractPlugin(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
        new webpack.DefinePlugin({
            BASE_URL : "'./'",
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__:false
        })
    ],
    devServer: {
        port: "8080",
        proxy: {

            "/api": {
                target: 'http://www.yehger.cn',
                changeOrigin: true,
                // secure: true, // 如果是https接口，需要配置这个参数
                pathRewrite: {
                    '^/api': ''
                },
                headers: {
                    'Cookie':'PHPSESSID=71e4acp7ktbj9smofig5sngd7d; uid=2; token=dcd0ac50-d5eb-4958-9647-d45e8e2c7948'
                }
            }
        },
    },
    
};