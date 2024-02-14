// const firebase = require('firebase/app');
// require('firebase/database');

// // Initialize Firebase with your web configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyDeCmYdsbTwNJwQHaCewTB4dctJf-93mMU",
//     authDomain: "bill-splitter-934ca.firebaseapp.com",
//     databaseURL: "https://bill-splitter-934ca-default-rtdb.firebaseio.com",
//     projectId: "bill-splitter-934ca",
//     storageBucket: "bill-splitter-934ca.appspot.com",
//     messagingSenderId: "985820815188",
//     appId: "1:985820815188:web:c4509e620e3252e1ffb2c1",
//     measurementId: "G-39KV2ZD12N"
//   };

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

// // Get a reference to the database
// const database = firebase.database();

// module.exports = database;

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore/lite');
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyDeCmYdsbTwNJwQHaCewTB4dctJf-93mMU",
    authDomain: "bill-splitter-934ca.firebaseapp.com",
    databaseURL: "https://bill-splitter-934ca-default-rtdb.firebaseio.com",
    projectId: "bill-splitter-934ca",
    storageBucket: "bill-splitter-934ca.appspot.com",
    messagingSenderId: "985820815188",
    appId: "1:985820815188:web:c4509e620e3252e1ffb2c1",
    measurementId: "G-39KV2ZD12N"
  };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    module.exports = db;

   



// // Get a list of cities from your database
// async function getCities(db) {
//   const citiesCol = collection(db, 'cities');
//   const citySnapshot = await getDocs(citiesCol);
//   const cityList = citySnapshot.docs.map(doc => doc.data());
//   return cityList;
// }