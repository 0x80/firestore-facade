// @ts-check
const { resolve } = require("node:path");
const project = resolve(__dirname, "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@codecompose/eslint-config/node"],
  parserOptions: {
    project,
  },
};
