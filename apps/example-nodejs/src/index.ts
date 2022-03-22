import { example } from "./example.js";

(async function () {
  example();
})()
  .then(() => console.log("Example finished"))
  .catch((err) => console.error(err.message));
