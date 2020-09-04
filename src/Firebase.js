import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDFU2MSpJCxuiCUQ7OUbr6poLwkjiXX7kc",
    authDomain: "zhustagram.firebaseapp.com",
    databaseURL: "https://zhustagram.firebaseio.com",
    projectId: "zhustagram",
    storageBucket: "zhustagram.appspot.com",
    messagingSenderId: "419757883860",
    appId: "1:419757883860:web:ff16b814c99dbef88bd641",
    measurementId: "G-W4ZV9RX3MD"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();


export { db, auth, storage };