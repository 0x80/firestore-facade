# Firestore Facade Node.js Example

> I don't think it is particularly useful to run this example code, and instead, I
> advise you to just read through the it. Running the code will inject some
> documents into your Firestore database, and that might not be what you want
> since you'll have to clean it up again.

## Install

Run `npm install` or `yarn install`

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

`npm run start` or `yarn start` will execute the example code and output some
data to the console. This verifies that the facade is working correctly.

## Adapt / Recreate the facade code

You can try to alter the facade-config file and then recreate the facade code by
running `npx generate-facade src/facade-config.ts` from the root of the example
app. This should update the file at `src/facade.ts`.

## Documentation

Besides the code you can read the [firestore-facade documentation](../facade/README.md).
