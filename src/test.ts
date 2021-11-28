import { createFacade } from "./facade";
import { firestore } from "./firebase-client";

/**
 * This would be an example of client code. Note that everything is typed and we
 * do not need to import any of the types in the calling context.
 */
(async function run() {
  const db = createFacade(firestore);

  const doc = await db.collectionA.add({
    a: "hi",
    b: 123,
    nested: { c: true, d: ["one", "two", "three"] },
  });

  await db.collectionA.set(doc.id, {
    a: "hi",
    b: 123,
    nested: { c: true, d: ["one", "two", "three"] },
  });

  await db.collectionA.update(doc.id, { a: "bye", b: 321 });
  await db.collectionA.update(doc.id, { "nested.c": false });

  const finalDoc = await db.collectionA.get(doc.id);

  console.log(finalDoc.data);

  await db.collectionB.add({
    a: "hi",
    b: 123,
    nested: { c: true, d: ["one", "two", "three"] },
  });
})();
