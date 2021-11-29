import { collectionsDefinition as def } from "./config";
import { createCollectionMethods } from "./methods";

/**
 * @TODO This file would have to be generated based on the definitions file.
 * Simply iterating over the definitions can not give us strict typing.
 */
export function createFacade(db: FirebaseFirestore.Firestore) {
  return {
    collection_a: {
      ...createCollectionMethods<typeof def.root.collection_a>(
        db,
        "collection_a",
      ),
      sub: (parentDocumentId: string) => ({
        collection_sub: createCollectionMethods<
          typeof def.sub.collection_a.collection_sub
        >(db, `collection_a/${parentDocumentId}/collection_sub`),
      }),
    },
    collection_b: createCollectionMethods<typeof def.root.collection_b>(
      db,
      "collection_b",
    ),
  };
}
