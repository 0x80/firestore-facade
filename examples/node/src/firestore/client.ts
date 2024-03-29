/**
 * How you configure the Firebase client is up to you. Here I'm using service
 * credentials stored in a folder next to "packages". If you want to run this
 * example I suggest to download the service credentials for your Firebase
 * project and store them in the same location.
 *
 * All firestore-facade requires is a handle to your firestore instance.
 */
import admin from "firebase-admin";
import { createFacade } from "./facade";

export const adminApp = admin.initializeApp();

export const firestore = admin.firestore(adminApp);

// export const client = new admin.firestore.v1.FirestoreAdminClient();

export const FieldValue = admin.firestore.FieldValue;

firestore.settings({
  timestampsInSnapshots: true,
  ignoreUndefinedProperties: true,
});

export const db = createFacade(firestore);
