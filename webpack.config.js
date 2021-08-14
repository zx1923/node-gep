const path = require('path');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

function getArgValue(key) {
  for (let i = 0; i < process.argv.length; i++) {
    const paramKey = process.argv[i];
    if (paramKey === key) {
      return process.argv[i + 1] || null;
    }
  }
  return null;
}

const buildOutPath = path.resolve(__dirname, `dist/lib`);

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'gep.min.js',
    path: buildOutPath,
    libraryTarget: 'umd',
    globalObject: 'this',
    library: "gep",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
};