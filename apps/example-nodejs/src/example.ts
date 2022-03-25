/**
 * NOTE: Local imports require .js because the example code runs using ESM in
 * Node.
 */
import {
  arrayUnion,
  deleteField,
  incrementField,
  serverTimestamp,
} from "firestore-facade";
import { createFacade } from "./facade.js";
import { firestore } from "./firestore-client.js";

export async function example() {
  /**
   * We import the facade factory function, which was generated based on the
   * config file in this directory, and use that to wrap the firestore instance.
   */
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
    phone_number: "+31(0)612345678",
  });

  {
    const doc = await db.athletes.get(ref.id);
    console.log(doc.data.name, doc.data.age);
  }

  /**
   * For the update function all keys, nested field paths and their values are
   * typed.
   *
   * Note that the type allows for arrays and tuples to be set. Mutating their
   * content should be done via Firestore FieldValue helpers like arrayUnion.
   */
  await db.athletes.update(ref.id, {
    age: incrementField(1),
    "skills.c": true,
    "skills.d": arrayUnion("four_union", "five_union"),
    "skills.tuple": ["bar", 890],
    phone_number: deleteField(),
    updated_at: serverTimestamp(),
  });

  {
    const doc = await db.athletes.get(ref.id);
    console.log(doc.data);
  }

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
   * The query internally uses batching to fetch all documents in chunks and
   * return them combined. An alternative API is available using an async
   * generator function to query and process files in separate chunks.
   */
  {
    const docs = await db.athletes.query((ref) =>
      ref.where("skills.c", "==", true),
    );

    console.log(`Retrieved ${docs.length} documents`);
  }

  /**
   * Perform a query with document field selection. The fields argument is
   * typed, and the response document is typed to only contain the picked
   * properties.
   */
  {
    const docs = await db.athletes.queryAndSelect(
      (ref) => ref.where("updated_at", "<", new Date()),
      ["name", "skills"],
    );

    docs.forEach((doc) => console.log(doc.data.name, doc.data.skills));
  }

  /**
   * Using transactions
   */
  await firestore.runTransaction(async (transaction) => {
    const t = db.useTransaction(transaction);

    const doc = await t.athletes.get(ref.id);

    console.log(doc.data);

    const docs = await t.athletes.query((ref) =>
      ref.where("skills.c", "==", true),
    );

    console.log(`Retrieved ${docs.length} documents`);

    await t.athletes.update(ref.id, {
      "skills.d": arrayUnion("transaction_win"),
    });
  });

  {
    const doc = await db.athletes.get(ref.id);
    console.log(doc.data);
  }

  /**
   * Using an async generator we can query and process documents in a large
   * collection one chunk at a time, optionally with select.
   */
  for await (const documents of db.athletes.genQueryAndSelect(
    (ref) => ref.orderBy("updated_at", "desc"),
    ["name", "updated_at"],
  )) {
    console.log(
      documents.map((x) => [
        x.data.name,
        x.data.updated_at?.toDate().toISOString(),
      ]),
    );
  }
}
