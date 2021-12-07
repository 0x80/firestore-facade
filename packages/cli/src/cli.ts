#!/usr/bin/env node --experimental-specifier-resolution=node --loader ts-node/esm

import { assert } from "@sindresorhus/is";
import meow from "meow";
import path from "path";
import { generateFacade } from "./generate.js";

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

assert.string(configFilePath);

const absoluteFilePath = path.resolve(configFilePath);

generateFacade(absoluteFilePath, cli.flags).catch((err) => {
  console.error(`Failed to generate facade code: ${err.message}`);
});
