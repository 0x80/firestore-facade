# Firestore Façade

A clean and strongly typed interface to Firebase Firestore for Typescript
projects.

---

**NOTE** This library is still in its proof-of-concept phase and therefore not
ready for consumption.

---

The goal is to keep the API as close to native as possible while providing as
much type safety as is still practical. Firestore Façade is a fairly thin
wrapper that does not prevent you from using using plain Firestore methods. As
such it is not aiming to cover the full Firestore API surface.

At the moment this library focusses solely on Node.js using the
[firestore-admin](https://github.com/firebase/firebase-admin-node) client.
Hopefully we can make this compatible with the [Cloud
Firestore](https://github.com/googleapis/nodejs-firestore) in the future,
because both products are technically the same.

For front-end I would suggest to use something like
[react-firebase-hooks](https://github.com/csfrequency/react-firebase-hooks).

The release version will aim to have zero dependencies.

## TODO v1.0

- [x] Add strict typing for `update` method.
- [ ] Generate facade factory function based in collection config
- [ ] Convert to monorepo with separate CLI and examples packages
- [ ] Implement CLI for facade generator
- [ ] Use peer-dependencies where appropriate
- [ ] Remove need for other dependencies
- [ ] Add tests
- [ ] Test number increment and array update operations
- [ ] Improve and type the collections configuration
- [ ] Implement query pagination via generator function

## Motivation

- Reduce boilerplate
- Strongly typed methods for collections
- Strongly typed query select arguments and response

## Configuration

For each collection and subcollection (one level currently supported), you
provide a mapping as follows:

```ts
export type Athlete = {
  name: string;
  age: number;
  skills: {
    c: boolean;
    d: string[];
    tuple: [string, number];
  };
  updated_at?: FirebaseFirestore.Timestamp;
};

type Event = {
  name: string;
  year: number;
};

type Medal = {
  type: "bronze" | "silver" | "gold";
};

/**
 * In the definition we cast bogus objects for each of the document
 * types. This configuration only serves as type information when generating the
 * createFacade function, so it knows how to type each of the collection methods.
 */
export const collectionsDefinition = {
  root: {
    athletes: {} as Athlete,
    events: {} as Event,
  },
  sub: {
    athletes: {
      medals: {} as Medal,
    },
  },
};
```

> @TODO describe how to generate the facade factory function code.

## Usage

Based on a configuration file, which maps each collection to a document type,
the CLI generates the facade factory function code for you to include in your
project.

The factory wraps your instance of firestore and returns a facade interface.

```ts
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
 * typed!! 💅
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

await db.events.add({
  name: "Olympics",
  year: 2045,
});

/**
 * Subcollections are accessed by passing a parent document id to the sub
 * method. Currently one level of nesting is supported, but more would be
 * possible if required.
 */
await db.athletes.sub(ref.id).medals.add({
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
```
