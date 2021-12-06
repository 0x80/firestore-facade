/**
 * This file was created 12/6/2021, 6:40:25 PM by the `generate-facade`
 * command, and is not meant not be edited manually. If you change anything
 * about your database document types, simply re-execute the code generator
 * to update this file.
 */

import def from "./config";
import { createCollectionMethods } from "./methods";

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
    events: createCollectionMethods<typeof def.root.events>(db, "events"),
  };
}
