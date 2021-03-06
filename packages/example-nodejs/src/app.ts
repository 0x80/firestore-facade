/**
 * This is an example of client code. Note that everything is strictly typed and
 * we do not need to import any of the collection types in this context.
 *
 * We import the facade factory function which was generated based on the config
 * file in this directory and use that to wrap the firestore instance.
 */
import { createFacade } from "./facade.js";
import { firestore, serverTimestamp } from "./firebase-client.js";

export async function app() {
  const db = createFacade(firestore);

  /**
   * Add and set will enforce the exact document type for each collection. Each
   * collection name is a property, so no more use of untyped strings to
   * reference collections.
   */
  const ref = await db.athletes.add({
    name: "Joe",
    age: 23,
    skills: { c: true, d: ["one", "two", "three"], tuple: ["foo", 123] },
  });

  console.log(`Stored new document at collection_a/${ref.id}`);

  await db.athletes.set(ref.id, {
    name: "Jane",
    age: 26,
    skills: { c: true, d: ["one", "two", "three"], tuple: ["foo", 456] },
  });

  /**
   * For the update function all keys, nested field paths and their values are
   * typed.
   *
   * Note that the type allows for arrays and tuples to be set. Mutating their
   * content via a path like "nested.tuple.1" is not allowed. This should be
   * done the Firestore way using FieldValue objects (not supported yet).
   */
  await db.athletes.update(ref.id, {
    age: 27,
    "skills.c": true,
    "skills.tuple": ["bar", 890],
    updated_at: serverTimestamp(),
  });

  const doc = await db.athletes.get(ref.id);

  console.log(doc.data);

  const { id: eventId } = await db.sports_events.add({
    name: "Olympics",
    year: 2045,
  });

  /**
   * Subcollections are accessed by passing a parent document id to the sub
   * method. Currently one level of nesting is supported, but more would be
   * possible if required.
   */
  await db.athletes.sub(ref.id).medals.add({
    event_id: eventId,
    type: "gold",
  });

  /**
   * Queries are using a regular Firestore collection reference, so they largely
   * use the official API and parameters to methods like "where" are not typed.
   *
   * The query does use automatic batching to fetch all documents in chunks. An
   * alternative, using generator function, will be available in the future.
   */
  const fullDocs = await db.athletes.query((ref) =>
    ref.where("skills.c", "==", true),
  );

  console.log(`Retrieved ${fullDocs.length} documents`);

  /**
   * Perform a query with document field selection. The fields argument is
   * typed, and the response document is typed to only contain the picked
   * properties.
   */
  const partialDocs = await db.athletes.queryAndSelect(
    (ref) => ref.where("updated_at", "<", new Date()),
    ["name", "skills"],
  );

  partialDocs.forEach((doc) => console.log(doc.data.name, doc.data.skills));
}
