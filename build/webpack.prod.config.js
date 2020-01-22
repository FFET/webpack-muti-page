/**
 * webpack prod config
 */

const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const merge = require("webpack-merge");
const base = require("./webpack.base.config.js");
// const ZipPlugin = require("zip-webpack-plugin");

module.exports = merge(base, {
  // devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.less|.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../"
            }
          },
          // "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: [
                require("autoprefixer")({
                  // browsers: [
                  //   ">1%",
                  //   "last 4 versions",
                  //   "Firefox ESR",
                  //   "not ie < 9" // React doesn't support IE8 anyway
                  // ],
                  flexbox: "no-2009"
                }),
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
        test: /\.(png|jpg|gif|jpeg|svg|)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              name: "[hash:6].[ext]",
              outputPath: "image/"

              // name: function(filename) {
              //   const array = filename.split("/");
              //   return `${array[array.length - 2]}/[name].[ext]`;
              // },
              // publicPath: "../"
            }
          }
        ]
      },
      {
        test: /\.(mp4)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "static/"

              // name: function(filename) {
              //   const array = filename.split("/");
              //   return `${array[array.length - 2]}/[name].[ext]`;
              // },
              // publicPath: "../"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].css"
      // publicPath: "/"
    }),
    new webpack.BannerPlugin("Build in " + new Date())
    // new ZipPlugin({
    //   path: "../",
    //   pathPrefix: "www",
    //   filename: "www.zip"
    // })
  ],
  optimization: {
    minimizer: [
      // new UglifyJsPlugin({
      new TerserPlugin({
        // uglifyOptions: {
        terserOptions: {
          parallel: true,
          cache: true,
          compress: { warnings: true, drop_console: true },
          output: {
            comments: false
            // comments: /Build in/i
          }
        },
        extractComments: false
        // sourceMap: false,
        // extractComments: {
        //   condition: true,
        //   // filename(file) {
        //   //  return `${file}.LICENSE`;
        //   // },
        //   banner(commentsFile) {
        //     return `My custom banner about license information ${commentsFile}`;
        //   }
        // }
      })
    ]
  }
});
