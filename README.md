# Firestore Façade Packages

A clean, strongly-typed, zero-dependency API for Firestore Typescript projects.

> NOTE: This project is still in its infancy, and probably not ready for
> consumption just yet

## Packages

- [Facade](./packages/facade/README.md)
- [CLI](./packages/cli/README.md)
- [Node.js Example](./packages/example-nodejs/README.md)

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
- [ ] Implement query pagination via generator function
- [ ] Expose field value helpers via package
- [ ] Document all API methods
- [ ] Add tests using firestore emulator. Not strictly necessary IMO since
      the code is a only a thin wrapper around the official Firestore API.
- [ ] Make sure CLI works on Windows and Linux

## Future Versions

- Add support for web client (including version 9)
- Implement a React hooks package using a similar approach
