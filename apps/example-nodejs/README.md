# Firestore Facade Node.js Example

> I don't think it is particularly useful to run this example code, and instead,
> I advise you to just read through the it. Running the code will inject some
> documents into your Firestore database, and that might not be what you want
> since you'll have to clean it up again.

## Install

From the **root of the monorepo** run:

1. `npm install`
2. `npm run build`

## Configure Credentials

To run the example you need to set up a Firebase project using Firestore if you
haven't already done so.

Create a `.env` file in the root of the `example-nodejs` folder and set
GOOGLE_APPLICATION_CREDENTIALS to point to the absolute path of your service
credentials file. For example:

```sh
GOOGLE_APPLICATION_CREDENTIALS="/Users/me/development/firestore-facade/credentials/service-account-key.json"
```

## Run Example Code

Running `npm run start` from the `app/example-nodejs` folder will execute the
example code and output some data to the console. This should illustrate that
the facade is working correctly.

## Regenerate The Facade Code

You can try to alter the [facade-config](./src/facade-config.ts) file and then
recreate the facade code by running `npx generate-facade src/facade-config.ts`
from the root of the example app. This should update the file at `src/facade.ts`
accordingly.

## Documentation

For more information please read the [firestore-facade
documentation](/packages/facade/README.md).
