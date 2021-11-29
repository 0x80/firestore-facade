import { createFacade } from "./facade";
import { FieldValue, firestore } from "./firebase-client";

/**
 * This would be an example of client code. Note that everything is typed and we
 * do not need to import any of the types in the calling context.
 */
(async function run() {
  const db = createFacade(firestore);

  /**
   * Add and set will enforce the exact document type for each collection. Each
   * collection name is a property, so no more use of untyped strings to
   * reference collections.
   */
  const ref = await db.collection_a.add({
    a: "hi",
    b: 123,
    nested: { c: true, d: ["one", "two", "three"] },
  });

  await db.collection_a.set(ref.id, {
    a: "hi",
    b: 123,
    nested: { c: true, d: ["one", "two", "three"] },
  });

  /**
   * For the update function all keys and nested field paths are typed, but the
   * values are currently set to accept "any".
   *
   * This is maybe not ideal, but it allows us to pass FieldValue.serverTimestamp()
   * on updated_at, which is passing FirebaseFirestore.FieldValue where the
   * document type defines the field as FirebaseFirestore.Timestamp.
   */
  await db.collection_a.update(ref.id, {
    a: "bye",
    b: 321,
    "nested.c": false,
    updated_at: FieldValue.serverTimestamp(),
  });

  const doc = await db.collection_a.get(ref.id);

  console.log(doc.data);

  await db.collection_b.add({
    ba: "hi",
    bb: 123,
  });

  /**
   * Subcollections are accessed by passing a parent document id to the sub
   * method. Currently one level of nesting is supported, but more would be
   * possible if required.
   */
  await db.collection_a.sub(ref.id).collection_sub.add({
    zz: "hi",
  });

  /**
   * Queries are using a regular Firestore collection reference, so they largely
   * use the official API and parameters to methods like "where" are not typed.
   *
   * The query does use automatic batching to fetch all documents in chunks. An
   * alternative, using generator function, will be available in the future.
   */
  const docs = await db.collection_a.query((ref) => ref.where("a", "==", "hi"));

  /**
   * Perform a query with document field selection. The fields argument is
   * typed, and the response document is typed to only contain the picked
   * properties.
   */
  const pickedDocs = await db.collection_a.queryAndSelect(
    (ref) => ref.where("a", "==", "hi"),
    ["a"],
  );

  pickedDocs.forEach((doc) => console.log(doc.data.a));
})();
