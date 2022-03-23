# Firestore Façade

A simplified, strongly-typed, zero-dependency API for Typescript projects using
Firestore.

## Disclaimer

Currently only Node.js is supported, and the CLI has been tested only on MacOS.

## Introduction

Using the official Firestore API with Typescript requires a lot of boilerplate
if you want to type your data collections. It requires discipline to manually
cast the return values from queries, and pass the correct data to methods like
`set` and `update`. I found this way of working cumbersome and error-prone, and
it defeats much of the convenience and safety that Typescript naturally brings.

Firestore Façade removes virtually all boilerplate code while adding strict
typing on arguments and return values from various methods. It does this by
generating a thin layer of code, based on your Firestore document types. The
resulting code is committed to your repository and acts as a façade interface to
the official Firestore API.

The aim is to keep the API as close to native as possible while providing as
much type safety as is still practical. Firestore Façade does not prevent you
from using the original Firestore API methods.

## Features

- A lightweight abstraction over the native Firestore API with no discernable
  runtime cost.
- Almost completely typed data for documents and collections using a familiar
  API, facilitating things like auto-complete and improving refactoring.
- Methods return a simple document type to reduce boilerplate.
- Built-in batching for queries on large collections.
- An async generator based query function to fetch and process large amounts of
  documents one chunk at a time.
- Support for sub-collections (limited to one level).

## Usage

### 1. Install

1. `npm install firestore-facade`
2. `npm install firestore-facade-cli ts-node --save-dev`

Or, if you prefer to use Yarn:

1. `yarn add firestore-facade`
2. `yarn add firestore-facade-cli ts-node --save-dev`

Currently ts-node is required because the `generate-facade` script tries to
resolve the ts-node loader from the environment where you execute the command. I
hope to find a way to make the command self-contained in the future.

### 2. Configure The Document Type Mapping

In your repository, create a configuration file to be consumed by the facade
generator. It can be named anything and placed anywhere. In this file you create
a **default export** object using a `root` and optionally a `sub` property as
shown below.

In the root property, list all the Firestore root collections using the
collection name as the key, and apply the document type via a placeholder object
as follows:

```ts
export default {
  root: {
    athletes: {} as Athlete,
    sports_events: {} as SportsEvent,
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

In this example the collection names in Firestore are snake-cased, but if yours
are camel-cased the key names should mirror that.

The empty objects are only there to connect the types to runtime data so that
the type information can be consumed by the facade factory function.

### 3. Generate The Facade Factory Function

The next step is to generate the facade code by passing the location of the
configuration file you just created to the `generate-facade` executable. From
the root of your repository the command would look something like:

`npx generate-facade ./src/my-document-types-config.ts`

Or if you use Yarn:

`yarn run generate-facade ./src/my-document-types-config.ts`

This should output a file named `facade.ts` next to the supplied configuration
file, which then contains the facade code custom to your project.

Whenever you change anything about your collections or their document types,
simply update the configuration and re-run this command to update the facade to
match your new types.

### 4. Wrap The Firestore Instance

Now you can use the facade factory to wrap your instance of the Firestore
client:

```ts
import { createFacade } from "./facade";

const db = createFacade(firestore);
```

And that's it! We'll discuss the various API methods below.

## API

> @TODO document API in detail.

Below you will find some example code calling the different API methods.
Detailed documentation will follow later but most of it should look very
familiar if you have experience with Firestore.

You can find the complete source code in the [nodejs example
app](./src/apps/example-nodejs)

```ts
/**
 * NOTE: These imports require .js because the example code runs using ESM in
 * Node.
 */
import { createFacade } from "./facade.js";
import { firestore } from "./firestore-client.js";
import {
  arrayUnion,
  deleteField,
  incrementField,
  serverTimestamp,
} from "./firestore-field-values.js";

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
```

## Caveats

Not everything is strictly typed. Since one of the aims was to stay as close to
the native API as practically feasible, some compromises were made:

- All query `where` clauses are not strictly typed. I don't see this as a huge
  problem as you will probably notice any mistake quite quickly and typically it
  would not have destructive consequences if you make a mistake there.
- The API currently allows you to call `deleteField()` on a required type
  property.
