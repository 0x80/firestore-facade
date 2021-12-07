/**
 * This file was created 12/7/2021, 5:11:34 PM by the `generate-facade`
 * command, and is not meant not be edited manually. If you change anything
 * about your database document types, simply re-execute the code generator
 * to update this file.
 */

import { createCollectionMethods } from "firestore-facade";
import def from "./config";

export function createFacade(db: FirebaseFirestore.Firestore) {
  return {
    athletes: {
      ...createCollectionMethods<typeof def.root.athletes>(db, "athletes"),
      sub: (parentDocumentId: string) => ({
        medals: createCollectionMethods<typeof def.sub.athletes.medals>(
          db,
          `athletes/${parentDocumentId}/medals`,
        ),
      }),
    },
    sports_events: createCollectionMethods<typeof def.root.sports_events>(
      db,
      "sports_events",
    ),
  };
}
