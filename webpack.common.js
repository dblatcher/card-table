const path = require('path');

const handleBarsPlugin = require("./plugins/Handlebars.plugin");
const recursiveGetFilePaths = require("./recursiveGetFilePaths");

module.exports = {
    entry: {
        "index": './src/js/index.js',
        "public-files": recursiveGetFilePaths('./public'),
    },
    module: {
        rules: [

            { //sass rule
                test: /\.s[ac]ss$/i, exclude: /node_modules/,
                use: ['style-loader', 'css-loader', "postcss-loader", 'sass-loader',],
            },

            { // css rule
                test: /\.css$/i, exclude: /node_modules/,
                use: ["style-loader", "css-loader", "postcss-loader"],
            },
            { // public file rule
                test: path.resolve(__dirname, 'public'),
                type: 'asset/resource',
                generator: {
                    filename: '[path][name][ext][query]'
                }
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        handleBarsPlugin
    ],
    output: {

        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: 'public/[name][ext][query]',
        globalObject: 'this',
        clean: true
    },
};
