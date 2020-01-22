import { $ } from "zepto-browserify";

import "./style";

$.ajax({
  url: "https://scorpionjay.github.io/json/blog.json",
  success: function(data) {
    console.log(data);
    let html = "";
    data.forEach((item) => (html += `<div>${item.title}</div>`));
    $("#container").html(html);
  }
});
