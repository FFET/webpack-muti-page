/**
 * webpack dev config
 */

const webpack = require("webpack");
const base = require("./webpack.base.config.js");
const merge = require("webpack-merge");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(base, {
  devtool: "cheap-module-source-map",
  module: {
    rules: [
      // {
      //   enforce: "pre",
      //   test: /\.jsx?$/,
      //   exclude: /node_modules/,
      //   loader: "eslint-loader"
      // },
      {
        test: /\.less|.css$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: [
                require("autoprefixer")(),
                require("cssnano")({
                  preset: "default"
                })
              ]
            }
          },
          {
            loader: "less-loader",
            options: {
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif|jpeg|mp4)$/,
        use: ["file-loader"]
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
    // new BundleAnalyzerPlugin({ analyzerPort: 8888 })
    // new MiniCssExtractPlugin({
    //   filename: "css/[name].[hash:5].css",
    //   publicPath: "/"
    // })
  ],
  devServer: {
    contentBase: "./dist",
    hot: true,
    port: 8080,
    host: "0.0.0.0",
    disableHostCheck: true,
    historyApiFallback: true,
    proxy: {
      "/api": {
        target: " http://localhost:8081",
        changeOrigin: true,
        pathRewrite: { "^/api": "" }
      }
    }
  }
});
