import { getDocument, getDocuments, getDocumentsWithSelect } from "./documents";

export function createRootCollectionMethods<T extends object>(
  db: FirebaseFirestore.Firestore,
  collectionName: string,
) {
  return {
    add: (data: T) => db.collection(collectionName).add(data),

    set: (documentId: string, data: T) =>
      db.collection(collectionName).doc(documentId).set(data),

    update: (
      documentId: string,
      data: Partial<T> | FirebaseFirestore.UpdateData,
    ) => db.collection(collectionName).doc(documentId).update(data),

    get: (documentId: string) => getDocument(db, collectionName, documentId),

    query: (
      fn: (
        ref: FirebaseFirestore.CollectionReference,
      ) => FirebaseFirestore.Query,
    ) => getDocuments<T>(fn(db.collection(collectionName))),

    /**
     * A query where select is used to strongly type the selector and returned
     * document shape using Pick<T, K>
     */
    queryAndSelect<K extends keyof T>(
      fn: (
        ref: FirebaseFirestore.CollectionReference,
      ) => FirebaseFirestore.Query,
      selectFields: readonly K[],
    ) {
      return getDocumentsWithSelect<T, K>(
        fn(db.collection(collectionName)),
        selectFields,
      );
    },
  };
}

export function createSubCollectionMethods<T extends object>(
  db: FirebaseFirestore.Firestore,
  parentCollectionName: string,
  collectionName: string,
) {
  return {
    add: (parentDocumentId: string, data: T) =>
      db
        .collection(
          `${parentCollectionName}/${parentDocumentId}/${collectionName}`,
        )
        .add(data),

    set: (parentDocumentId: string, documentId: string, data: T) =>
      db
        .collection(
          `${parentCollectionName}/${parentDocumentId}/${collectionName}`,
        )
        .doc(documentId)
        .set(data),
  };
}
