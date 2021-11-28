import { collectionsDefinition as def } from "./config";
import {
  createRootCollectionMethods,
  createSubCollectionMethods,
} from "./methods";

/**
 * @TODO This file would have to be generated with ts-morph or some sort of
 * templating based on the definitions file.
 *
 * Simply iterating over the definitions could not give us strict typing.
 */
export function createFacade(db: FirebaseFirestore.Firestore) {
  return {
    collection_a: {
      ...createRootCollectionMethods<typeof def.root.collection_a>(
        db,
        "collection_a",
      ),
      collection_sub: createSubCollectionMethods<
        typeof def.sub.collection_a.collection_sub
      >(db, "collection_a", "collection_sub"),
    },
    collection_b: createRootCollectionMethods<typeof def.root.collection_b>(
      db,
      "collection_b",
    ),
  };
}
