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

type CollectionTypes = {
  collectionA: DocumentA;
};

export function createFacade(db: FirebaseFirestore.Firestore) {
  return {
    collectionA: {
      add: (data: DocumentA) => db.collection("collectionA").add(data),

      set: (documentId: string, data: DocumentA) =>
        db.collection("collectionA").doc(documentId).set(data),

      update: (
        documentId: string,
        data: Partial<DocumentA> | FirebaseFirestore.UpdateData,
      ) => db.collection("collectionA").doc(documentId).update(data),

      get: (documentId: string) => getDocument(db, "collectionA", documentId),

      query: (query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>) =>
        getDocuments<DocumentA>(query),
    },
  };
}
