
const db = require("../helper/dbconnectivity.js");
exports.getdata = async () => {
  
  const snapshot = await db.collection('Cars').get();
  let array=[];
  snapshot.forEach((doc) => {
        array.push(doc.data());
  });

  return array;
}