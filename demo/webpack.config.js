const path = require('path');
const { RemarxWebpackPlugin } = require('../bin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [new RemarxWebpackPlugin()],
};
