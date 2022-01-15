const path = require('path');
const merge = require('webpack-merge').merge;
const common = require('./webpack.common.js');

module.exports = merge(common, {
   mode: 'development',
   devServer: {
      hot: true,
      static: {
         directory: path.join(__dirname, 'dist'),
      },
    compress: true,
    port: 9000,
   },
});