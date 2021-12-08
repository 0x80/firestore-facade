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

## Start

`npm run start` or `yarn start` will execute the example code.

Read the code, and the [firestore-facade documentation](../facade/README.md).
