import "./style";

import img from "./img.jpeg";

console.log("hello world");

const element = document.createElement("img");
element.src = img;
element.width = 100;
element.height = 100;
document.body.append(element);
