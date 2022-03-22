# Firestore Façade

A clean, strongly-typed, zero-dependency API for Firestore Typescript projects.

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

In the future I would like to investigate if this is idea is also feasible for
the web client and specifically React hooks.

## Usage

### 1. Install

- `npm install firestore-facade`
- `npm install firestore-facade-cli ts-node --save-dev`

Or, if you prefer Yarn:

- `yarn add firestore-facade`
- `yarn add firestore-facade-cli ts-node --save-dev`

Currently ts-node is required because the generate script tries to resolve the
ts-node loader from the environment where you call the command. I hope find a
way to make the command self-contained in the future.

### 2. Configure Document Type Mapping

In your repository, create a configuration file. It can be named anything and
placed anywhere. In this file you create a **default export** object using a
`root` and optionally a `sub` property.

In the root property, list all the Firestore root collections using the name as
key, and apply their document type on a placeholder object as shown below:

```ts
export default {
  root: {
    athletes: {} as Athlete,
    sports_events: {} as Event,
  },
  sub: {
    athletes: {
      medals: {} as Medal,
    },
  },
};
```

Subcollections are defined under `sub`. Currently, one level of nesting is
supported.

In this example the collection names in Firestore are snake-cased, but if your
names are camel-cased the key names should mirror that.

The empty objects are only there to connect the types to runtime data so that
they can be consumed by the facade factory function.

> @TODO explain in more detail.

### 3. Generate Facade Factory Function

The next step is to generate the facade code by passing the location of the
configuration file to the `generate-facade` command:

`npx generate-facade ./src/my-document-types-config.ts`

Or if you use Yarn:

`yarn run generate-facade ./src/my-document-types-config.ts`

This should create a file named `facade.ts` containing the facade factory
function in the same location as the supplied config file.

Whenever you change something about your collections or their document types,
simply re-run this command to update the facade function.

### 4. Wrap Firestore Instance

Now you can use the facade factory to wrap your instance of the Firestore
client.

```ts
import { createFacade } from "./facade";

const db = createFacade(firestore);
```

## API

Below is an example showing the different API methods.

You can find the complete source code in the [nodejs example
package](./src/packages/example-nodejs)

> @TODO document API in detail.

```ts
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
```
