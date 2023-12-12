const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const babel = require("@rollup/plugin-babel");
const postcss = require("rollup-plugin-postcss");
const svg = require("rollup-plugin-svg");
const html = require("@rollup/plugin-html");
const replace = require("@rollup/plugin-replace");
const fs = require("fs");
const mustache = require("mustache");

function kvToAttributes(kv) {
  let attributes = "";
  for (let key in kv) {
    attributes += ` ${key}="${kv[key]}"`;
  }
  return attributes;
}

module.exports = {
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "iife",
  },
  plugins: [
    resolve(),
    svg({
      base64: true,
    }),
    postcss({
      extensions: [".css"],
    }),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      presets: ["@babel/env", "@babel/react"],
    }),
    commonjs(),
    replace({
      preventAssignment: true,
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    html({
      template({ attributes, files, publicPath, title }) {
        const scripts = files.js
          .map(
            ({ fileName }) => `<script src="${publicPath}${fileName}"></script>`
          )
          .join("\n");
        return mustache.render(
          fs.readFileSync("./public/index.html", { encoding: "utf-8" }),
          { attrs: kvToAttributes(attributes.html), title, scripts }
        );
      },
    }),
  ],
};
