const path = require('path');
const cleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './printArea.js',
  output: {
    path: path.resolve(__dirname, './dist/lib'),
    filename: 'index.js'
  },
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ],
        exclude: /node_modules/,
      },
    ]
  },
  plugins: [
    new cleanWebpackPlugin()
  ],
};
