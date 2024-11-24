import * as admin from 'firebase-admin';
const serviceAccount = require('../../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: 'https://<mydb>.firebaseio.com'
});

export default admin;