/**
 * This file was generated 3/22/2022, 5:45:50 PM by the `generate-facade`
 * command, and should never be edited manually.
 *
 * If your database document types have changed since, you should update your
 * facade configuration file and re-execute the code generator from the
 * command-line, which will then update this file accordingly.
 *
 * Depending on your repository, the command could be: `npx generate-facade
 * src/facade-config.ts`
 */
import {
  createCollectionMethods,
  createTransactionCollectionMethods,
} from "@firestore-facade/server";
import def from "./facade-config.js"; // Use .js to support ESM targets

export function createFacade(db: FirebaseFirestore.Firestore) {
  return {
    athletes: {
      ...createCollectionMethods<typeof def.root.athletes>(db, "athletes"),
      sub: (parentDocumentId: string) => ({
        medals: createCollectionMethods<typeof def.sub.athletes.medals>(
          db,
          `athletes/${parentDocumentId}/medals`
        ),
      }),
    },
    sports_events: createCollectionMethods<typeof def.root.sports_events>(
      db,
      "sports_events"
    ),

    useTransaction: (transaction: FirebaseFirestore.Transaction) => ({
      athletes: {
        ...createTransactionCollectionMethods<typeof def.root.athletes>(
          transaction,
          db,
          "athletes"
        ),
        sub: (parentDocumentId: string) => ({
          medals: createTransactionCollectionMethods<
            typeof def.sub.athletes.medals
          >(transaction, db, `athletes/${parentDocumentId}/medals`),
        }),
      },
      sports_events: createTransactionCollectionMethods<
        typeof def.root.sports_events
      >(transaction, db, "sports_events"),
    }),
  };
}
