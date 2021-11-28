# Firestore Façade

A clean and strongly typed interface to Firebase Firestore.

> This library is not ready for consumption just yet

The aim is to keep the API as close to the original as possible while providing
as much type safety. Firestore Façade is a fairly thin wrapper that still allows
you to tap into the underlying Firestore methods.

The initial version focusses solely on Node.js. For front-end I
would suggest to use something like
[react-firebase-hooks](https://github.com/csfrequency/react-firebase-hooks).

## Motivation

- Reduce boilerplate
- Strongly typed methods for collections
- Strongly typed query select arguments and response

## Configuration

For each collection and subcollection (one level currently supported), you
provide a mapping as follows:

```ts
type DocumentA = {
  a: string;
  b: number;
  nested: {
    c: boolean;
    d: string[];
  };
};

type DocumentB = {
  ba: string;
  bb: number;
};

type DocumentSub = {
  zz: string;
};

/**
 * In the definition we cast bogus objects for each of the document
 * types. This configuration only serves as type information when generating the
 * createFacade function, so it knows how to type each of the collection methods.
 */
export const collectionsDefinition = {
  // Root collections
  root: {
    collection_a: {} as DocumentA,
    collection_b: {} as DocumentB,
  },
  // Sub collections
  sub: {
    collection_a: {
      collection_sub: {} as DocumentSub,
    },
  },
};
```

> @TODO describe how to generate the facade factory function code.

## Usage

You provide a configuration file mapping each collection to a document type.
Then the module generates a facade factory function for you to use as
demonstrated below:

```ts
const db = createFacade(firestore);

const ref = await db.collection_a.add({
  a: "hi",
  b: 123,
  nested: { c: true, d: ["one", "two", "three"] },
});

await db.collection_a.update(ref.id, { a: "bye", b: 321 });
await db.collection_a.update(ref.id, { "nested.c": false });

const doc = await db.collection_a.get(ref.id);

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

const docs = await db.collection_a.query((ref) => ref.where("a", "==", "hi"));

/**
 * Perform a query with select fields on the document response.
 */
const pickeDocs = await db.collection_a.queryAndSelect(
  (ref) => ref.where("a", "==", "hi"),
  ["a"],
);

/**
 * At this point TS knows only the property "a" is available
 */
pickeDocs.forEach((doc) => console.log(doc.data.a));
```
