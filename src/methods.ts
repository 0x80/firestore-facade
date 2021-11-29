import { getDocument, getDocuments, getDocumentsWithSelect } from "./documents";
import { FieldPaths } from "./types";

export function createCollectionMethods<T extends object>(
  db: FirebaseFirestore.Firestore,
  collectionPath: string,
) {
  return {
    add: (data: T) => db.collection(collectionPath).add(data),

    set: (documentId: string, data: T) =>
      db.collection(collectionPath).doc(documentId).set(data),

    /**
     * @TODO FirebaseFirestore.UpdateData is not strict at all, we need to find
     * a way to type the data argument.
     *
     * Problem is that update can get many different types, including number
     * increments and array remove/union instructions.
     * See https://firebase.google.com/docs/firestore/manage-data/add-data#web-version-9_4
     *
     * So not sure how strict we can get here.
     */
    update: (documentId: string, data: Partial<T> | FieldPaths<T>) =>
      db.collection(collectionPath).doc(documentId).update(data),

    // updateField: (documentId: string, data: DeepKeyMap<T>) =>
    //   db.collection(collectionPath).doc(documentId).update(data),

    get: (documentId: string) => getDocument(db, collectionPath, documentId),

    query: (
      fn: (
        ref: FirebaseFirestore.CollectionReference,
      ) => FirebaseFirestore.Query,
    ) => getDocuments<T>(fn(db.collection(collectionPath))),

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
        fn(db.collection(collectionPath)),
        selectFields,
      );
    },
  };
}
