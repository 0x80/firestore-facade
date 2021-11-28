import { last } from "remeda";
import { assert } from "./utils";

const BATCH_SIZE = 500;

export interface FirestoreDocument<T> {
  id: string;
  data: T;
  ref: FirebaseFirestore.DocumentReference;
}

export function documentFromSnapshot<T>(
  snapshot: FirebaseFirestore.DocumentSnapshot,
) {
  return {
    id: snapshot.id,
    data: snapshot.data() as T,
    ref: snapshot.ref,
  };
}

export async function getDocument<T>(
  db: FirebaseFirestore.Firestore,
  collectionName: string,
  documentId: string,
): Promise<FirestoreDocument<T>> {
  const snapshot = await db.collection(collectionName).doc(documentId).get();

  assert(
    snapshot.exists,
    `No document ${documentId} exists in collection ${collectionName}`,
  );

  return { id: snapshot.id, data: snapshot.data() as T, ref: snapshot.ref };
}

export async function getDocuments<T>(
  query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>,
): Promise<FirestoreDocument<T>[]> {
  const limitedQuery = query.limit(BATCH_SIZE);

  return _getDocumentsBatch<T>(limitedQuery);
}

async function _getDocumentsBatch<T>(
  query: FirebaseFirestore.Query,
): Promise<FirestoreDocument<T>[]> {
  const snapshot = await query.get();

  if (snapshot.empty) {
    return [];
  }

  const lastDoc = last(
    snapshot.docs,
  ) as FirebaseFirestore.QueryDocumentSnapshot;

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
