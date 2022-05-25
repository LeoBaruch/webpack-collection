const path = require('path');
const AssetPackagePlugin = require('../lib/index');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, './index.js'),
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'output.js',
  },
  plugins: [
    new AssetPackagePlugin({
      packageNameValue: 'iyb-demo',
    }),
  ],
};
