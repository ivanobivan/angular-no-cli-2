const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const ngtools = require('@ngtools/webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const a = require("@angular-devkit/build-optimizer")
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env) => {
    return {
        mode: env.production ? "production" : "development",
        devtool: env.production ? false : "eval",
        context: path.resolve(__dirname),
        entry: {
            index: ["./src/main.ts", "./src/index.css"],
        },
        stats: 'normal',
        devServer: {
            static: {
                directory: path.resolve(__dirname, "dist")
            },
            port: 4200,
            hot: true,
            open: false
        },
        output: {
            clean: true,
            path: path.resolve(__dirname, "dist"),
            filename: env.production ? "[name].[chunkhash].js" : "[name].js"
        },
        resolve: {
            extensions: [".ts", ".js"]
        },
        module: {
            rules: [
                {
                    test: /\.?(svg|html)$/,
                    resourceQuery: /\?ngResource/,
                    type: "asset/source"
                },
                {
                    test: /\.[cm]?[tj]sx?$/,
                    exclude: /\/node_modules\//,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true,
                                compact: true,
                                plugins: ["@angular/compiler-cli/linker/babel"],
                            },
                        },
                        {
                            loader: "@angular-devkit/build-angular/src/babel/webpack-loader",
                            options: {
                                aot: true,
                                optimize: true,
                                scriptTarget: 7
                            }
                        },
                        {
                            loader: '@ngtools/webpack',
                        },
                    ],
                },
                {
                    test: /\.(css)$/,
                    exclude: /\/node_modules\//,
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
                }
            ]
        },
        optimization: {
            minimize: true,
            runtimeChunk: "single",
            splitChunks: {
                chunks: "all",
                maxAsyncRequests: Infinity,
                minSize: 0,
                name: "vendor"
            },
        },
        /*optimization: {
            minimize: true,
            runtimeChunk: 'single',
            splitChunks: {
                chunks: "all",
                maxAsyncRequests: Infinity,
                minSize: 0,
                cacheGroups: {
                    defaultVendors: {
                        test: /[\\/]node_modules[\\/]/,
                        name(module) {
                            const name = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                            return `${name.replace('@', '')}`;
                        }
                    },
                }
            }
        },*/
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
            }),
            //new a.BuildOptimizerWebpackPlugin()
            //new BundleAnalyzerPlugin()
        ]
    }
}

