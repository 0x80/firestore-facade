# Firestore Facade CLI

This package contains the command line interface used to generate the facade
factory function.

## Usage

`npm install firestore-facade-cli ts-node --save-dev`

`npx generate-facade ./path/to/config.ts`

Or, if you prefer to use Yarn:

`yarn add firestore-facade-cli ts-node --dev`

`yarn run generate-facade ./path/to/config.ts`

Currently ts-node is required because the generate script tries to resolve the
ts-node loader from the environment where you call the command. I hope to find a
way to make the command self-contained in the future.

For more information see the [firestore-facade
documentation](../facade/README.md).
