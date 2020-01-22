/**
 * webpack base config
 */

const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const glob = require("glob");
const ENV = process.env.NODE_ENV || "development";
class MyPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("MyPlugin", (compilation) => {
      // console.log("The compiler is starting a new compilation...");

      // Staic Plugin interface |compilation |HOOK NAME | register listener
      HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tapAsync(
        "MyPlugin", // <-- Set a meaningful name here for stacktraces
        (data, cb) => {
          data.headTags.push({
            tagName: "script",
            voidTag: false,
            attributes: {},
            innerHTML: `function setRootFontSize() {
                          var width = document.documentElement.clientWidth,
                            fontSize;
                          if (width > 750) {
                            width = 750;
                          }
                          fontSize = width / 7.5;
                          document.getElementsByTagName("html")[0].style["font-size"] =
                            fontSize + "px";
                        }
                        setRootFontSize();
                        window.addEventListener(
                          "resize",
                          function() {
                            setRootFontSize();
                          },
                          false
                        );`
          });
          // Tell webpack to move on
          cb(null, data);
        }
      );
    });
  }
}

/**
 * entry config
 */
const fnEntry = () => {
  var entryFiles = glob.sync("./src/page/**/*.js");
  var map = {};
  entryFiles.forEach((filePath) => {
    var filename = filePath.substring(filePath.lastIndexOf("/") + 1, filePath.lastIndexOf("."));
    map[filename] = filePath;
  });
  return map;
};

/**
 * generate html
 */
const generateHtml = (path, filename) => {
  return {
    template: path,
    filename: `${filename}.html`,
    chunks: [`${filename}`],
    // favicon: "./static/images/favicon.ico",
    inject: true,
    meta: {
      // viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
      // Will generate: <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      // "theme-color": "#4285f4"
      // Will generate: <meta name="theme-color" content="#4285f4">
    },
    minify:
      ENV === "production"
        ? {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeEmptyAttributes: true,
            minifyJS: true
          }
        : {}
  };
};

/**
 * html
 */
const fnHtml = () => {
  let entryHtml = glob.sync("./src/page/*/*.html");
  let map = [];
  entryHtml.forEach((item) => {
    map.push(new HtmlWebpackPlugin(generateHtml(item, item.split("/")[3])));
  });
  return map;
};

module.exports = {
  mode: ENV,
  //   context: path.resolve(__dirname, "../src/"),
  entry: fnEntry,
  output: {
    filename: "js/[name].js",
    // chunkFilename: "[name][name].js",
    // publicPath: "./",
    path: path.resolve(__dirname, "../dist")
  },
  externals: {},
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  resolve: {
    extensions: [".js", ".less", ".css"],
    alias: {
      Utils: path.resolve(__dirname, "../src/utils")
    }
  },
  plugins: [
    ...fnHtml(),
    new MyPlugin({ options: "" }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      BUILD_ENV: JSON.stringify(process.env.BUILD_ENV)
    })
    // new ProgressBarPlugin()
  ]
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       // styles: {
  //       //   name: "styles",
  //       //   test: /\.less$/
  //       //   // chunks: "all",
  //       //   // enforce: true
  //       // },
  //       commons: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name: "commons",
  //         chunks: "all"
  //       }
  //     }
  //   }
  // }
};
