# html 自定义插件

https://github.com/jantimon/html-webpack-plugin

https://github.com/jantimon/html-webpack-plugin/issues/1001

```
class MyPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("MyPlugin", compilation => {
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
```

```
new MyPlugin({ options: "" }),
```
