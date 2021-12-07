# Firestore Façade

A clean, strongly-typed, zero-dependency interface to Firebase Firestore for
Typescript projects.

> NOTE: This project is still in its infancy, and probably not ready for
> consumption just yet

## Motivation

- Reduce boilerplate code and improve readability
- Provide strict typing on collection methods like `set` and `update`
- Provide strict typing on query select statements and their partial response
  documents

The aim is to keep the API as close to native as possible while providing as
much type safety as is still practical. Firestore Façade is a fairly thin
wrapper which does not prevent you from using using plain Firestore API methods.
For that reason it is also not aiming to cover the full Firestore API surface.

At the moment this library focusses solely on Node.js using the
[firestore-admin](https://github.com/firebase/firebase-admin-node) client.

It should be possible to make this compatible with the [Cloud
Firestore](https://github.com/googleapis/nodejs-firestore) with a small
modification, because both are technically the same product.

In the future I would like to add a package addressing the web client and
another one specifically for React hooks.

## TODO v1.0

- [x] Add strict typing for `update` method.
- [x] Generate facade factory function based in collection config
- [x] Convert to monorepo with separate CLI and examples packages
- [x] Implement CLI for facade generator
- [x] Use peer-dependencies where appropriate
- [x] Remove need for other dependencies
- [x] Improve and type the collections configuration
- [ ] Test and support FieldValue operations for increment and arrays etc
- [ ] Implement query pagination via generator function
- [ ] Document all API methods
- [ ] Optionally add some tests. Not really necessary because the facade code is
      a only thin wrapper and when something is wrong it is very likely that the
      compiler will complain.

## Install

1. `npm install firestore-facade`
2. `npm install --save-dev firestore-facade-cli`

## Configure

In your repository, create a configuration file. It can be named anything and
place anywhere. In this file create a **default export** object using a `root`
and optionally a `sub` property.

In the root property you list all the Firestore root collections using the name
as key, and map their document type using a placeholder object as shown below:

```ts
export default {
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

Subcollections are place under `sub`. Currently one level of nesting is
supported.

The empty objects are simply placeholders to make the types available at
runtime. @TODO explain in detail.

## Generate Facade Factory Function

From your project command line generate the facade by passing the location of
the configuration file:

`generate-fade ./src/my-document-types-config.ts`

This should generate a file named `facade.ts` (containing the facade factory
function) in the same location as the config file.

Whenever you change something about your collections or their document types,
simply re-run this command to update the facade function.

## Usage

Now you can use the factory function to wrap your instance of firestore. Below
is an example showing the different API methods.

@TODO list API methods in detail.

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

const { id: eventId } = await db.events.add({
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
```
