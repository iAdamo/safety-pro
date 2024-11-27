import * as admin from 'firebase-admin';
const serviceAccount = require('../../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: 'https://<-default->.firebaseio.com'
});

export const db = admin.firestore();
export const messaging = admin.messaging();