const path = require('path');
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const dirname = __dirname.replace('build','')

module.exports = {
    entry: dirname+'/src/main.js',
    output: {
        filename: '[name].[fullhash].js',
        path: path.resolve('d://code/www.yehger.com/public/static_file', 'code_snippet'),
        publicPath: '/static_file/code_snippet/',
        clean: true
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
    // devtool: 'inline-source-map',
    plugins:[
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            filename:'index.html',
            template:dirname+'/public/index.html'
        }),
        new MiniCssExtractPlugin()
    ]
    
};