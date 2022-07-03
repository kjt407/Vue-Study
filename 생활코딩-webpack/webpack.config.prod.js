// 공식문서 예제 https://webpack.js.org/concepts/configuration/

const path = require("path");

module.exports = {
  mode: "production",
  entry: "./source/index.js",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "main.js",
  },
};
