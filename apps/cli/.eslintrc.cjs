/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["0x80"],
  project: path.join(__dirname, "./tsconfig.json")
};
