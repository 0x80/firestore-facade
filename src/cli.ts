#!/usr/bin/env node

import meow from "meow";
import path from "path";
import { generateFacade } from "./generate.js";
import { assert } from "./utils.js";

const cli = meow(
  `
	Usage
	  $ generate-facade <path-to-config.ts>

	Options
	  --firestore-type, -v  Enable verbose logging

	Examples
	  $ generate-facade ./src/collections-config.ts
`,
  {
    importMeta: import.meta,
    flags: {
      verbose: {
        type: "boolean",
        alias: "v",
      },
    },
  },
);

const [configFilePath] = cli.input;

assert(configFilePath, "Missing config file argument to generate-facade");

const absoluteFilePath = path.resolve(configFilePath);

generateFacade(absoluteFilePath, cli.flags).catch((err) => {
  console.error(`Failed to generate facade code: ${err.message}`);
});
