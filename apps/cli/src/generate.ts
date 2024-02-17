import fs from "node:fs";
import path from "node:path";
import prettier from "prettier";
import { CollectionsConfig } from "./types";
import { assert, createLogger, Logger } from "./utils";

const firestoreTypeNames = {
  nodejs: "FirebaseFirestore.Firestore",
  web: "@TODO",
};

export async function generateFacade(
  configFilePath: string,
  flags: { verbose?: boolean } = {}
) {
  const log = createLogger(flags.verbose);

  log.debug("Config file path:", configFilePath);

  const configModuleContent = await import(configFilePath);

  log.debug("Config file content:\n", JSON.stringify(configModuleContent));

  assert(
    configModuleContent.default,
    "Failed to find a default export in the configuration file"
  );

  let config = configModuleContent.default;

  /**
   * There is something strange going on with the ts-node/esm loader it seems.
   * When running the cli script externally via bin like `yarn run
   * generate-facade-direct some/config/file.ts` the contents of the file seem
   * to have a default export with another "default" wrapped inside.
   */
  if (!config.root && config.default) {
    config = config.default;
  }

  assert(
    config.root,
    "Failed to find a root property in the configuration object"
  );

  const { name: configFileName, dir: configFileDirectory } =
    path.parse(configFilePath);

  const outputFilePath = path.join(configFileDirectory, "facade.ts");

  const now = new Date();

  const code = `
    /**
     * This file was generated ${now.toLocaleString()} by the
     * \`generate-facade\` command, and should not be edited manually.
     *
     * Whenever your database document types change, you can update
     * your facade configuration file and re-execute the code generator from the
     * command-line, which in turn will update this file accordingly.
     *
     * Depending on your setup, the command would be something like:
     * \`npx generate-facade src/facade-config.ts\`
     */
    import {
      createCollectionMethods,
      createTransactionCollectionMethods
    } from "@firestore-facade/server";
    import def from "./${configFileName}.js"; // Use .js to support ESM targets

    export function createFacade(db: ${
      firestoreTypeNames[
        (config as CollectionsConfig).options?.context ?? "nodejs"
      ]
    }) {
      return {
        ${generateCollectionsCode(config, log)}
        ${generateTransactionCollectionsCode(config, log)}
      }
    }
  `;

  await fs.promises.writeFile(
    outputFilePath,
    /**
     * We could allow the user passing prettier options, but I figure you might
     * as wel let you IDE reformat the file to match your project's settings.
     */
    prettier.format(code, { parser: "typescript", trailingComma: "all" })
  );

  log.success("Successfully generated facade code at:", outputFilePath);
}

function generateCollectionsCode(config: CollectionsConfig, log: Logger) {
  const rootCollectionNames = Object.keys(config.root);

  let code = "";

  for (const collectionName of rootCollectionNames) {
    log.debug(`Adding root collection:\t ${collectionName}`);

    const subConfig = config.sub[collectionName];

    if (subConfig) {
      const subCollectionNames = Object.keys(subConfig);

      code = `${code}
      ${collectionName}: {
        ...createCollectionMethods<typeof def.root.${collectionName}>(db, "${collectionName}"),
        sub: (parentDocumentId: string) => ({
          ${generateSubCollectionsCode(collectionName, subCollectionNames, log)}
        }),
      },`;
    } else {
      code = `${code}
      ${collectionName}: createCollectionMethods<typeof def.root.${collectionName}>(db, "${collectionName}"),
    `;
    }
  }

  return code;
}

function generateSubCollectionsCode(
  rootCollectionName: string,
  subCollectionNames: string[],
  log: Logger
) {
  let code = "";

  for (const collectionName of subCollectionNames) {
    log.debug(
      `Adding /sub collection:\t ${rootCollectionName}/${collectionName}`
    );

    code = `${code}
      ${collectionName}: createCollectionMethods<typeof def.sub.${rootCollectionName}.${collectionName}>(
        db,
        \`${rootCollectionName}/\${parentDocumentId}/${collectionName}\`
      ),
    `;
  }

  return code;
}

function generateTransactionCollectionsCode(
  config: CollectionsConfig,
  log: Logger
) {
  const rootCollectionNames = Object.keys(config.root);

  let code = "";

  for (const collectionName of rootCollectionNames) {
    log.debug(`Adding transaction root collection:\t ${collectionName}`);

    const subConfig = config.sub[collectionName];

    if (subConfig) {
      const subCollectionNames = Object.keys(subConfig);

      code = `${code}
      ${collectionName}: {
        ...createTransactionCollectionMethods<typeof def.root.${collectionName}>(transaction, db, "${collectionName}"),
        sub: (parentDocumentId: string) => ({
          ${generateTransactionSubCollectionsCode(
            collectionName,
            subCollectionNames,
            log
          )}
        }),
      },`;
    } else {
      code = `${code}
      ${collectionName}: createTransactionCollectionMethods<typeof def.root.${collectionName}>(transaction, db, "${collectionName}"),
    `;
    }
  }

  return `useTransaction: (transaction: FirebaseFirestore.Transaction) => ({
   ${code}
  })`;
}

function generateTransactionSubCollectionsCode(
  rootCollectionName: string,
  subCollectionNames: string[],
  log: Logger
) {
  let code = "";

  for (const collectionName of subCollectionNames) {
    log.debug(
      `Adding /sub collection:\t ${rootCollectionName}/${collectionName}`
    );

    code = `${code}
      ${collectionName}: createTransactionCollectionMethods<typeof def.sub.${rootCollectionName}.${collectionName}>(
        transaction,
        db,
        \`${rootCollectionName}/\${parentDocumentId}/${collectionName}\`
      ),
    `;
  }

  return code;
}
