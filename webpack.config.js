const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const ngtools = require('@ngtools/webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: "development",
    devtool: false,
    context: path.resolve(__dirname),
    entry: {
        index: [
            path.resolve(__dirname, "src/main.ts"),
            path.resolve(__dirname, "src/index.css")
        ],
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, "dist")
        },
        compress: true,
        port: 4200,
        hot: true,
        open: false,
        client: {
            progress: true
        }
    },
    output: {
        clean: true,
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js"
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            /*{
                test: /\.?(svg|html)$/,
                resourceQuery: /\?ngResource/,
                type: "asset/source"
            },*/
            /*{
                test: /\.(js|ts)$/,
                loader: "ts-loader",
                exclude: /node_modules/
            },*/
            {
                test: /\.(css)$/,
                oneOf: [
                    {
                        resourceQuery: {
                            not: [/\?ngResource/]
                        },
                        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"]
                    },
                    {
                        type: "asset/source",
                        loader: "postcss-loader"
                    }
                ]
            },
            {
                test: /\.[jt]sx?$/,
                loader: '@ngtools/webpack',
            },
            {
                test: /\.[cm]?js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        compact: false,
                        plugins: ["@angular/compiler-cli/linker/babel"],
                    },
                },
            },
        ]
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: "all",
            maxAsyncRequests: Infinity,
            minSize: 0,
            name: "vendor"
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, "dist", "index.html"),
            template: path.resolve(__dirname, "src/index.html")
        }),
        new ngtools.AngularWebpackPlugin({
            tsconfig: path.resolve(__dirname, "tsconfig.json"),
            jitMode: false,
            directTemplateLoading: true
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new CopyPlugin({
            patterns: [
                {
                    context: "src/assets/",
                    from: "**/*",
                    to: "assets/",

                }
            ]
        })
    ]
}
