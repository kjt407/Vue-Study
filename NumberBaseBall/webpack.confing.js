const path = require("path");

module.exports = {
  entry: {
    app: path.join(__dirname, "main.js"), // 수많은 파일들을 app.js로 합침
  },
  module: {
    rules: [{}],
  },
  Plugin: {},
  output: {
    filename: "app.js",
    path: path.join(__dirname, "dist"),
  },
};
