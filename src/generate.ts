import fs from "fs";
import path from "path";
import prettier from "prettier";
import { CollectionsConfig } from "./config";
import { assert } from "./utils";

const firestoreTypeNames = {
  admin: "FirebaseFirestore.Firestore",
  web: "@TODO",
};

export async function generateFacade(
  configFilePath: string,
  flags: { verbose?: boolean } = {},
) {
  const { default: config } = (await import(configFilePath)) as {
    default: CollectionsConfig;
  };

  /**
   * Do some basic assertion to see if the default export is the thing we expect
   */
  assert(
    config.root,
    `Failed to find a property "root" in the default export from file ${configFilePath}`,
  );

  const { name: configFileName, dir: configFileDirectory } =
    path.parse(configFilePath);

  const outputFilePath = path.join(configFileDirectory, "facade.ts");

  const now = new Date();

  const code = `
    /**
     * This file was created ${now.toLocaleString()} by the \`generate-facade\`
     * command, and is not meant not be edited manually. If you change anything
     * about your database document types, simply re-execute the code generator
     * to update this file.
     */

    import def from "./${configFileName}";
    import { createCollectionMethods } from "./methods";

    export function createFacade(db: ${
      firestoreTypeNames[config.options?.context ?? "admin"]
    }) {
      return {
        ${genCollections(config)}
      }
    }
  `;

  await fs.promises.writeFile(
    outputFilePath,
    prettier.format(code, { parser: "typescript" }),
  );

  console.log("Facade code successfully generated at:", outputFilePath);
}

function genCollections(config: CollectionsConfig) {
  const rootCollectionNames = Object.keys(config.root);

  let code = "";

  for (const collectionName of rootCollectionNames) {
    console.log(`Generating code for root collection ${collectionName}`);

    const subConfig = config.sub[collectionName];

    if (subConfig) {
      const subCollectionNames = Object.keys(subConfig);

      code = `${code}
      ${collectionName}: {
        ...createCollectionMethods<typeof def.root.${collectionName}>(db, "${collectionName}"),
        sub: (parentDocumentId: string) => ({
          ${genSubCollections(collectionName, subCollectionNames)}
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

function genSubCollections(
  rootCollectionName: string,
  subCollectionNames: string[],
) {
  let code = "";

  for (const collectionName of subCollectionNames) {
    code = `${code}
      ${collectionName}: createCollectionMethods<typeof def.sub.${rootCollectionName}.${collectionName}>(
        db,
        \`${rootCollectionName}/\${parentDocumentId}/${collectionName}\`
      ),
    `;
  }

  return code;
}
