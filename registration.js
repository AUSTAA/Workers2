/*********
 * Firebase Init
 *********/
import firebase from "https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js";
import "https://www.gstatic.com/firebasejs/8.6.8/firebase-auth.js";
import "https://www.gstatic.com/firebasejs/8.6.8/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB7YJhtaefEPc9NMzhTBjQC06WmSEja0xc",
  authDomain: "omran-16f44.firebaseapp.com",
  projectId: "omran-16f44",
  storageBucket: "omran-16f44.appspot.com",
  messagingSenderId: "598982209417",
  appId: "1:598982209417:web:dc9cbddd485a1ea52bbb58",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

/*********
 * Phone Auth (OTP)
 *********/
let confirmationResult;
