const ESLintPlugin = require('eslint-webpack-plugin'); // eslint
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const portFinderSync = require('portfinder-sync');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    home: './src/pages/home/index.tsx',
  },
  devServer: {
    historyApiFallback: true,
    hot: false,
    open: ['/home/index.html'],
    port: portFinderSync.getPort(8080),
    allowedHosts: ['.dingtalk.com'],
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    },
  },
  output: {
    filename: '[name]/index.js',
    path: path.resolve(__dirname, 'dist'),
  },

  resolve: {
    alias: {
      '@': './src',
    },
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
        use: ['babel-loader'],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]',
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[hash:7].[ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]',
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ESLintPlugin({
      context: path.resolve(__dirname, 'src'),
      emitError: true,
      emitWarning: true,
    }),
    new CopyPlugin({
      patterns: [{ from: 'public' }],
    }),
    new HtmlWebpackPlugin({
      filename: 'home/index.html',
      inject: false,
      template: 'src/pages/home/index.html',
    }),
  ],
};
