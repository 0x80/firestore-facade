# Firestore Façade Packages

A simplified, strongly-typed, zero-dependency API for Typescript projects using
Firestore.

See the [Facade package README](./packages/facade/README.md) for more details.

## Disclaimer

Currently only Node.js is supported, and the CLI has been tested only on MacOS.

## Packages

- [firestore-facade](./packages/facade/README.md) The Firestore Facade API for
  Node.js
- [firestore-facade-cli](./packages/cli/README.md) The command-line tool
  required to generate the custom facade code based on your configuration.

## Apps

- [Node.js Example](./apps/example-nodejs/README.md)

## TODO v1.0

- [x] Add strict typing for `update` method.
- [x] Generate facade factory function based in collection config
- [x] Convert to monorepo with separate CLI and examples packages
- [x] Implement CLI for facade generator
- [x] Use peer-dependencies where appropriate
- [x] Remove need for other dependencies
- [x] Improve and type the collections configuration
- [x] Test support for non-ESM client environment
- [x] Test and support FieldValue operations for increment and arrays etc
- [x] Test and support transactions
- [x] Implement query pagination via generator function
- [ ] Expose field value helpers via package
- [ ] Document all API methods
- [ ] Add tests using firestore emulator. Not strictly necessary IMO since the
      code is a only a thin wrapper around the official Firestore API.
- [ ] Make sure CLI works on Windows and Linux
- [ ] Allow limit to be used on getDocuments-type functions, overriding batch
      size if needed.

## Supported Platforms

At the moment this project focusses solely on Node.js using the
[firestore-admin](https://github.com/firebase/firebase-admin-node) client, and
the most of the code is providing patterns that are useful for backend
applications.

It should be very possible to make this compatible with the [Cloud
Firestore](https://github.com/googleapis/nodejs-firestore) with a only a small
modification, because both are technically the same product. However, a
one-on-one port does not seem feasible as typically you'll want different
behavior from documents in a front-end application.

A web client usually wants to subscribe to updates on the document it fetches,
whereas the backend will typically only query and process a document once.

I plan to investigate if the same concept is also feasible for a web client and
specifically something like React hooks.
