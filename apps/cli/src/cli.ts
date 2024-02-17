#!/usr/bin/env node --experimental-specifier-resolution=node --loader ts-node/esm

import meow from "meow";
import path from "path";
import { generateFacade } from "./generate.js";
import { assert, createLogger } from "./utils.js";

const log = createLogger();

const cli = meow(
  `
	Usage
	  $ generate-facade <path-to-config.ts>

	Options
	  --verbose, -v  Enable verbose/debug logging

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
  }
);

const [configFilePath] = cli.input;

assert(configFilePath, "A configuration filepath is required");

const absoluteFilePath = path.resolve(configFilePath);

generateFacade(absoluteFilePath, cli.flags).catch((err) => {
  log.error(`Failed to generate facade code: ${err.message}`);
});
