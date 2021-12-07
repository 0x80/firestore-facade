import { app } from "./app";

(async function () {
  app();
})()
  .then(() => console.log("Example finished"))
  .catch((err) => console.error(err.message));
