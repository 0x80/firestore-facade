import type {
  CollectionReference,
  Firestore,
  Query,
  SetOptions,
  Transaction,
  UpdateData,
} from "firebase-admin/firestore";
import {
  genGetDocuments,
  genGetDocumentsWithSelect,
  getDocument,
  getDocumentFromTransaction,
  getDocuments,
  getDocumentsFromTransaction,
  getDocumentsFromTransactionWithSelect,
  getDocumentsWithSelect,
} from "./documents.js";

export function createCollectionMethods<T extends object>(
  db: Firestore,
  collectionPath: string
) {
  return {
    add(data: T) {
      return db.collection(collectionPath).add(data);
    },

    get(documentId: string) {
      return getDocument<T>(db.collection(collectionPath).doc(documentId));
    },

    set(documentId: string, data: T, options?: SetOptions) {
      return options
        ? db.collection(collectionPath).doc(documentId).set(data, options)
        : db.collection(collectionPath).doc(documentId).set(data);
    },

    update(documentId: string, data: UpdateData<T>) {
      return db.collection(collectionPath).doc(documentId).update(data);
    },

    query(fn: (ref: CollectionReference) => Query) {
      return getDocuments<T>(fn(db.collection(collectionPath)));
    },

    /**
     * A query where select is used to strongly type the selector and returned
     * document shape using Pick<T, K>
     */
    queryAndSelect<K extends keyof T>(
      fn: (ref: CollectionReference) => Query,
      selectFields: readonly K[]
    ) {
      return getDocumentsWithSelect<T, K>(
        fn(db.collection(collectionPath)),
        selectFields
      );
    },

    /**
     * The same as query but instead of returning all documents batched and
     * combined together, it returns an async generator function which yields
     * each batch of documents so that incremental processing can be done on
     * large collections.
     */
    genQuery(fn: (ref: CollectionReference) => Query) {
      return genGetDocuments<T>(fn(db.collection(collectionPath)));
    },

    /**
     * The same as queryAndSelect but returning an async generator function
     * similar to genQuery.
     */
    genQueryAndSelect<K extends keyof T>(
      fn: (ref: CollectionReference) => Query,
      selectFields: readonly K[]
    ) {
      return genGetDocumentsWithSelect<T, K>(
        fn(db.collection(collectionPath)),
        selectFields
      );
    },
  };
}

export function createTransactionCollectionMethods<T extends object>(
  t: Transaction,
  db: Firestore,
  collectionPath: string
) {
  return {
    get(documentId: string) {
      return getDocumentFromTransaction<T>(
        t,
        db.collection(collectionPath).doc(documentId)
      );
    },

    set(documentId: string, data: T, options?: SetOptions) {
      return options
        ? t.set(db.collection(collectionPath).doc(documentId), data, options)
        : t.set(db.collection(collectionPath).doc(documentId), data);
    },

    update(documentId: string, data: UpdateData<T>) {
      return t.update(db.collection(collectionPath).doc(documentId), data);
    },

    query(fn: (ref: CollectionReference) => Query) {
      return getDocumentsFromTransaction<T>(
        t,
        fn(db.collection(collectionPath))
      );
    },

    /**
     * A query where select is used to strongly type the selector and returned
     * document shape using Pick<T, K>
     */
    queryAndSelect<K extends keyof T>(
      fn: (ref: CollectionReference) => Query,
      selectFields: readonly K[]
    ) {
      return getDocumentsFromTransactionWithSelect<T, K>(
        t,
        fn(db.collection(collectionPath)),
        selectFields
      );
    },
  };
}
