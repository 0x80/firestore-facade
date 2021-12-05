import { collectionDocumentTypes as def } from "./config";
import { createCollectionMethods } from "./methods";

/**
 * @TODO This file would have to be generated based on the definitions file.
 * Simply iterating over the definitions can not give us strict typing.
 */
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
    events: createCollectionMethods<typeof def.root.events>(db, "events"),
  };
}
