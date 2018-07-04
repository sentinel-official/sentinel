// import { MongoClient } from "mongodb";
// let url = "mongodb://localhost:27017/";


// export const dbs = (cb) => {
//   MongoClient.connect(url, {
//     socketTimeoutMS: 30000,
//     autoReconnect: true,
//     poolSize: 10,
//     connectTimeoutMS: 30000,
//   }, (err, dbo) => {
//     if (err) throw err;
//     else cb(null, dbo);
//   });
// }