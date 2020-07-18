import * as admin from 'firebase-admin';

export function initFirebase() {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: ''
  });
}
