import { createFacade } from "./facade";
import { firestore } from "./firebase-client";

/**
 * This would be an example of client code. Note that everything is typed and we
 * do not need to import any of the types in the calling context.
 */
(async function run() {
  const db = createFacade(firestore);

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

  await db.collection_a.update(ref.id, { a: "bye", b: 321 });
  await db.collection_a.update(ref.id, { "nested.c": false });

  const doc = await db.collection_a.get(ref.id);

  console.log(doc.data);

  await db.collection_b.add({
    ba: "hi",
    bb: 123,
  });

  /**
   * Call subcollections by passing the parent document id as the first
   * argument. Only one level of subcollections is supported.
   */
  await db.collection_a.collection_sub.add(ref.id, {
    zz: "hi",
  });

  /**
   * When doing a query in combination with selecting fields, pass them as a
   * second argument and the return type will be "picked" correctly.
   */

  {
    const docs = await db.collection_a.query((ref) =>
      ref.where("a", "==", "hi"),
    );

    console.log("found", docs.length);
  }

  {
    /**
     * Perform a query with select fields on the document response.
     */
    const docs = await db.collection_a.queryAndSelect(
      (ref) => ref.where("a", "==", "hi"),
      ["a"],
    );

    /**
     * Only the property a should allowed to be accessed
     */
    docs.forEach((doc) => console.log(doc.data.a));
  }
})();
