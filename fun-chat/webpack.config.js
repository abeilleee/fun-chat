const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const EsLintPlugin = require('eslint-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        assetModuleFilename: 'assets/images/[name][ext]',
    },
    mode: 'development',
    optimization: {
        minimize: false,
    },
    module: {
        rules: [
            {
                test: /\.ts$/i,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|webp)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(scss|css)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(mp3|ogg|wav)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/audio/[name][ext]',
                },
            },
            {
                test: /\.(eot|otf|ttf|woff|woff2)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/fonts/[name][ext]',
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html',
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new CleanWebpackPlugin(),
        new EsLintPlugin({ extensions: ['ts'] }),
    ],
    resolve: {
        extensions: ['.ts', '.js'],
    },
    devServer: {
        watchFiles: path.join(__dirname, 'src'),
        port: 9000,
        historyApiFallback: true,
    },
};
