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
- [ ] Allow limit to be used on getDocuments-type functions, overriding batch
      size if needed.
- [ ] Consider getIfExist/Possibly, delete, batchedDelete
- [ ] Consider adding getFirst (likely not needed if limit can be used in
      queries)
- [ ] Document all API methods
- [ ] Add tests using firestore emulator. Not strictly necessary IMO since the
      code is a only a thin wrapper around the official Firestore API.
- [ ] Make sure CLI works on Windows and Linux

## Future Ambitions

- Add support for Cloud Firestore (instead of Firebase Firestore)
- Use the same concept to create a package for web clients

## Supported Platforms

At the moment this project focusses solely on Node.js using the
[firebase-admin](https://github.com/firebase/firebase-admin-node) client, and
the most of the code is providing patterns that are useful for backend
applications.

It should be possible to make this compatible with the [Cloud
Firestore](https://github.com/googleapis/nodejs-firestore) with little
modification, because both are technically the same product.

Porting the concept to the Firebase web client should also be possible, however
it would not be a one-on-one port of all methods as typically you would use
different patterns in a front-end application and also not all of the used
functionality of the `firebase-admin` package is available for web environments.

I plan to investigate if the concept is also feasible for a web and I would be
specifically interested in using it for React hooks.
