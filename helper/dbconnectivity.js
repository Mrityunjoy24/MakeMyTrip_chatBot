var admin = require("firebase-admin");

var serviceAccount = require("your key");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

console.log("connected to database");

const db = admin.firestore();

// const snapshot = db.collection('Cars').get();
// //let array=[];
// snapshot.forEach((doc) => {
//     console.log(doc.data());
// });


module.exports = db;