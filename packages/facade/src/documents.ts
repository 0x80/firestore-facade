import type { firestore } from "firebase-admin";
import { assert, last } from "./utils.js";

const BATCH_SIZE = 500;

export interface FirestoreDocument<T> {
  id: string;
  data: T;
  ref: firestore.DocumentReference;
}

export function documentFromSnapshot<T>(snapshot: firestore.DocumentSnapshot) {
  return {
    id: snapshot.id,
    data: snapshot.data() as T,
    ref: snapshot.ref,
  };
}

export async function getDocument<T>(
  ref: FirebaseFirestore.DocumentReference,
): Promise<FirestoreDocument<T>> {
  const snapshot = await ref.get();

  assert(snapshot.exists, `No document exists at ${ref.path}`);

  return { id: snapshot.id, data: snapshot.data() as T, ref: snapshot.ref };
}

export async function getDocuments<T>(
  query: firestore.Query<firestore.DocumentData>,
): Promise<FirestoreDocument<T>[]> {
  const finalQuery = query.limit(BATCH_SIZE);

  return _getDocumentsBatch<T>(finalQuery);
}

export async function getDocumentsWithSelect<T, K extends keyof T>(
  query: firestore.Query<firestore.DocumentData>,
  selectFields: readonly K[],
): Promise<FirestoreDocument<Pick<T, K>>[]> {
  const finalQuery = query
    .limit(BATCH_SIZE)
    .select(...(selectFields as unknown as string[]));

  return _getDocumentsBatch<Pick<T, K>>(finalQuery);
}

async function _getDocumentsBatch<T>(
  query: firestore.Query,
): Promise<FirestoreDocument<T>[]> {
  const snapshot = await query.get();

  if (snapshot.empty) {
    return [];
  }

  const lastDoc = last(snapshot.docs);

  const results = snapshot.docs.map((doc) => documentFromSnapshot<T>(doc));

  const numRead = snapshot.size;

  if (process.env.VERBOSE) {
    /**
     * Log some information about count and pagination
     */
    console.log(`Read ${numRead} records, until ${lastDoc.id}`);
  }

  if (numRead < BATCH_SIZE) {
    return results;
  } else {
    const nextQuery = query.startAfter(lastDoc);
    /**
     * Return results with tail recursion
     */
    return results.concat(await _getDocumentsBatch<T>(nextQuery));
  }
}

export async function getDocumentFromTransaction<T>(
  transaction: FirebaseFirestore.Transaction,
  ref: FirebaseFirestore.DocumentReference,
) {
  const doc = await transaction.get(ref);

  assert(doc.exists, `No document available at path ${ref.path}`);

  return { id: doc.id, data: doc.data() as T, ref: doc.ref };
}

/**
 * Query documents using a transaction. Note that this is not using any
 * batching.
 */
export async function getDocumentsFromTransaction<T>(
  transaction: FirebaseFirestore.Transaction,
  query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>,
): Promise<FirestoreDocument<T>[]> {
  const snapshot = await transaction.get(query);

  if (snapshot.empty) return [];

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    data: doc.data() as T,
    ref: doc.ref,
  }));
}

/**
 * Query documents using a transaction in combination with select. Note that
 * this is not using any batching.
 */
export async function getDocumentsFromTransactionWithSelect<
  T,
  K extends keyof T,
>(
  transaction: FirebaseFirestore.Transaction,
  query: firestore.Query<firestore.DocumentData>,
  selectFields: readonly K[],
): Promise<FirestoreDocument<Pick<T, K>>[]> {
  const finalQuery = query
    .limit(BATCH_SIZE)
    .select(...(selectFields as unknown as string[]));

  const snapshot = await transaction.get(query);

  if (snapshot.empty) return [];

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    data: doc.data() as Pick<T, K>,
    ref: doc.ref,
  }));
}
