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
- [ ] Test and support FieldValue operations for increment and arrays etc
- [ ] Implement query pagination via generator function
- [ ] Document all API methods
- [ ] Optionally add some tests. Not really necessary because the facade code is
      a only thin wrapper and when something is wrong it is very likely that the
      compiler will complain.
