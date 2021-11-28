import admin from "firebase-admin";

const serviceAccount = require("../credentials/service-account-key.json");

export const adminApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const firestore = admin.firestore(adminApp);

export const client = new admin.firestore.v1.FirestoreAdminClient();

export const FieldValue = admin.firestore.FieldValue;
export const GeoPoint = admin.firestore.GeoPoint;
export const Timestamp = admin.firestore.Timestamp;

firestore.settings({
  timestampsInSnapshots: true,
  ignoreUndefinedProperties: true,
});
