/**
 * These helper functions exist to provide easy and typed use of the Firestore
 * FieldValue methods. They are optional since they contain no actual runtime
 * logic and only alter the types their values to make the TS compiler happy.
 *
 * @todo Provide these helpers via the facade package exports
 */
import admin from "firebase-admin";

export const FieldValue = admin.firestore.FieldValue;

export function serverTimestamp() {
  return FieldValue.serverTimestamp() as FirebaseFirestore.Timestamp;
}

export function deleteField() {
  return FieldValue.delete() as unknown as undefined;
}

export function incrementField(value: number) {
  return FieldValue.increment(value) as unknown as number;
}

export function arrayUnion<T>(...elements: T[]) {
  return FieldValue.arrayUnion(...elements) as unknown as T[];
}

export function arrayRemove<T>(...elements: T[]) {
  return FieldValue.arrayRemove(...elements) as unknown as T[];
}
