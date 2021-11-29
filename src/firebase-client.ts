import admin from "firebase-admin";

const serviceAccount = require("../credentials/service-account-key.json");

export const adminApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const firestore = admin.firestore(adminApp);

export const client = new admin.firestore.v1.FirestoreAdminClient();

export const FieldValue = admin.firestore.FieldValue;

firestore.settings({
  timestampsInSnapshots: true,
  ignoreUndefinedProperties: true,
});

export function serverTimestamp() {
  return FieldValue.serverTimestamp() as FirebaseFirestore.Timestamp;
}
