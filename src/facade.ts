import { getDocument, getDocuments } from "./documents";

/**
 * Use ts-morph
 * https://stackoverflow.com/questions/36407154/is-there-code-generation-api-for-typescript
 */
type DocumentA = {
  a: string;
  b: number;
  nested: {
    c: boolean;
    d: string[];
  };
};

type DocumentB = {
  ba: string;
  bb: number;
};

/**
 * The collection configuration needs to be absolutely typed, and this type has
 * to be passed on to the createFacade via absolute typing as well. One solution
 * would be to generate the createFacade function definition from the config.
 */
export const collectionConfig = {
  collectionA: {} as DocumentA,
  collectionB: {} as DocumentB,
};

export function createFacade(db: FirebaseFirestore.Firestore) {
  return Object.fromEntries(
    Object.entries(collectionConfig).map(([path, document]) => [
      path,
      createMethods<typeof document>(db, path),
    ]),
  );
}

function createMethods<T>(
  db: FirebaseFirestore.Firestore,
  collectionPath: string,
) {
  return {
    add: (data: T) => db.collection(collectionPath).add(data),

    set: (documentId: string, data: T) =>
      db.collection(collectionPath).doc(documentId).set(data),

    update: (
      documentId: string,
      data: Partial<T> | FirebaseFirestore.UpdateData,
    ) => db.collection(collectionPath).doc(documentId).update(data),

    get: (documentId: string) => getDocument(db, collectionPath, documentId),

    query: (query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>) =>
      getDocuments<T>(query),
  };
}
