/**
 * This file was created 12/8/2021, 11:06:43 AM by the `generate-facade`
 * command, and is not meant not be edited manually. If you change anything
 * about your database document types, simply re-execute the code generator
 * to update this file.
 */

import { createCollectionMethods } from "firestore-facade";
import def from "./facade-config.js";

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
