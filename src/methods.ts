import { getDocument, getDocuments } from "./documents";

export function createRootCollectionMethods<T>(
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

    query: (query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>) =>
      getDocuments<T>(query),

    /**
     * A query where select is used to strongly type the returned documents
     * using Pick<T>
     */
    // querySelect: (
    //   query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>,
    //   selectFields: keyof T[],
    // ) => getDocumentsWithSelect<T>(query, selectFields),
  };
}

export function createSubCollectionMethods<T>(
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
