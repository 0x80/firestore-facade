
import { last } from 'remeda';
import { assert } from './utils';

const BATCH_SIZE = 500

export interface FirestoreDocument<T> {
  id: string;
  data: T;
  ref: FirebaseFirestore.DocumentReference;
}

export function documentFromSnapshot<T>(snapshot: FirebaseFirestore.DocumentSnapshot) {
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
  options?: {
    useBatching?: boolean;
    limitToFirstBatch?: boolean;
  },
): Promise<FirestoreDocument<T>[]> {
  const defaults = {
    useBatching: true,
    limitToFirstBatch: false,
  };

  const { useBatching, limitToFirstBatch } = {
    ...defaults,
    ...options,
  };

  if (!useBatching) {
    const snapshot = await query.get();

    return snapshot.docs.map(doc => documentFromSnapshot<T>(doc));
  } else {
    const limitedQuery = query.limit(BATCH_SIZE);

    return _getDocumentsBatch<T>(limitedQuery,
      limitToFirstBatch,
    );
  }
}


async function _getDocumentsBatch<T>(
  query: FirebaseFirestore.Query,
  limitToFirstBatch = false,
): Promise<FirestoreDocument<T>[]> {
  /**
   * For easy testing we sometimes need to run an algorithm on only a part of a
   * collection (like cities). This boolean makes that easy but it should never
   * be used in production so we log it with a warning.
   */
  if (limitToFirstBatch) {
    console.log(
      "Returning only the first batch of documents (limitToFirstBatch = true)",
    );
  }

  const snapshot = await query.get();

  if (snapshot.empty) {
    return [];
  }

  const lastDoc = last(
    snapshot.docs,
  ) as FirebaseFirestore.QueryDocumentSnapshot;

  const results = snapshot.docs.map(doc => documentFromSnapshot<T>(doc));

  const numRead = snapshot.size;

  if (process.env.VERBOSE) {
    /**
   * Log some information about count and pagination
   */
    console.log(`Read ${numRead} records, until ${lastDoc.id}`);
  }

  if (numRead < BATCH_SIZE || limitToFirstBatch === true) {
    return results;
  } else {
    const pagedQuery = query.startAfter(lastDoc);
    /**
     * Return results with tail recursion
     */
    return results.concat(await _getDocumentsBatch<T>(pagedQuery));
  }
}

