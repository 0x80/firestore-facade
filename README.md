# Firestore Façade Packages

> !!WARNING This code is not ready for public consumption just yet.

A simplified, strongly-typed, zero-dependency API for Typescript projects using
Firestore.

See the [Server package README](./packages/facade/README.md) for more details.

## Packages

- [@firestore-facade/cli](./apps/cli/README.md): The command-line tool for
  generating the facade boilerplate
- [@firestore-facade/server](./packages/server/README.md): The Firestore Facade
  server API for Node.js

## Examples

- [node](./examples/node/README.md): A Node.js example showcasing the use of
  `@firestore-facade/cli` and `s@firestore-facade/server`.

## Supported Platforms

At the moment this project focusses on Node.js using the
[firebase-admin](https://github.com/firebase/firebase-admin-node) client, and
the most of the code is providing patterns that are useful for backend
applications.

In the future this should be made compatible with the
[Cloud Firestore](https://github.com/googleapis/nodejs-firestore) with little
modification, because both are technically the same product.

Applying same the concept to the Firebase web client should also be possible,
however it would probably not be trivial because not all of the used
functionality of the `firebase-admin` package is available in the web client.

I plan to investigate if the concept is also feasible for a web and I would be
specifically interested in using it for React hooks.
