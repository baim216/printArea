const path = require('path');
const cleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './printArea.js',
  output: {
    path: path.resolve(__dirname, './dist/lib'),
    filename: 'index.js'
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['stage-0']
        }
      },
    ]
  },
  plugins: [
    new cleanWebpackPlugin()
  ],
};
