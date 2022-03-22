import type { SetOptions } from "@google-cloud/firestore";
import type { firestore } from "firebase-admin";
import {
  getDocument,
  getDocumentFromTransaction,
  getDocuments,
  getDocumentsFromTransaction,
  getDocumentsFromTransactionWithSelect,
  getDocumentsWithSelect,
} from "./documents.js";
import { FieldPaths } from "./types";

export function createCollectionMethods<T extends object>(
  db: firestore.Firestore,
  collectionPath: string,
) {
  return {
    add: (data: T) => db.collection(collectionPath).add(data),

    get: (documentId: string) =>
      getDocument<T>(db.collection(collectionPath).doc(documentId)),

    set: (documentId: string, data: T, options?: SetOptions) =>
      options
        ? db.collection(collectionPath).doc(documentId).set(data, options)
        : db.collection(collectionPath).doc(documentId).set(data),

    update: (documentId: string, data: Partial<T> | Partial<FieldPaths<T>>) =>
      db.collection(collectionPath).doc(documentId).update(data),

    query: (fn: (ref: firestore.CollectionReference) => firestore.Query) =>
      getDocuments<T>(fn(db.collection(collectionPath))),

    /**
     * A query where select is used to strongly type the selector and returned
     * document shape using Pick<T, K>
     */
    queryAndSelect<K extends keyof T>(
      fn: (ref: firestore.CollectionReference) => firestore.Query,
      selectFields: readonly K[],
    ) {
      return getDocumentsWithSelect<T, K>(
        fn(db.collection(collectionPath)),
        selectFields,
      );
    },
  };
}

export function createTransactionCollectionMethods<T extends object>(
  t: firestore.Transaction,
  db: firestore.Firestore,
  collectionPath: string,
) {
  return {
    get: (documentId: string) =>
      getDocumentFromTransaction<T>(
        t,
        db.collection(collectionPath).doc(documentId),
      ),

    set: (documentId: string, data: T, options?: SetOptions) =>
      options
        ? t.set(db.collection(collectionPath).doc(documentId), data, options)
        : t.set(db.collection(collectionPath).doc(documentId), data),

    update: (documentId: string, data: Partial<T> | Partial<FieldPaths<T>>) =>
      t.update(db.collection(collectionPath).doc(documentId), data),

    query: (fn: (ref: firestore.CollectionReference) => firestore.Query) =>
      getDocumentsFromTransaction<T>(t, fn(db.collection(collectionPath))),

    /**
     * A query where select is used to strongly type the selector and returned
     * document shape using Pick<T, K>
     */
    queryAndSelect<K extends keyof T>(
      fn: (ref: firestore.CollectionReference) => firestore.Query,
      selectFields: readonly K[],
    ) {
      return getDocumentsFromTransactionWithSelect<T, K>(
        t,
        fn(db.collection(collectionPath)),
        selectFields,
      );
    },
  };
}
