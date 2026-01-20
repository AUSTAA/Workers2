/*********************************
 * Firebase v11 Imports
 *********************************/
import { initializeApp } from
  "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from
  "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from
  "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

/*********************************
 * Firebase Config
 *********************************/
const firebaseConfig = {
  apiKey: "AIzaSyB7YJhtaefEPc9NMzhTBjQC06WmSEja0xc",
  authDomain: "omran-16f44.firebaseapp.com",
  projectId: "omran-16f44",
  storageBucket: "omran-16f44.appspot.com",
  messagingSenderId: "598982209417",
  appId: "1:598982209417:web:dc9cbddd485a1ea52bbb58"
};

/*********************************
 * Init
 *********************************/
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

auth.languageCode = "ar";

/*********************************
 * Google Login
 *********************************/
document.getElementById("googleSignIn").onclick = async () => {
  try {
    const result = await signInWithPopup(
      auth,
      new GoogleAuthProvider()
    );
    await saveUser(result.user);
  } catch (e) {
    console.error(e);
    alert("فشل تسجيل الدخول بجوجل");
  }
};

/*********************************
 * Facebook Login
 *********************************/
document.getElementById("facebookSignIn").onclick = async () => {
  try {
    const result = await signInWithPopup(
      auth,
      new FacebookAuthProvider()
    );
    await saveUser(result.user);
  } catch (e) {
    console.error(e);
    alert("فشل تسجيل الدخول بفيسبوك");
  }
};

/*********************************
 * Save User
 *********************************/
async function saveUser(user) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email || "",
      photo: user.photoURL || "",
      provider: user.providerData[0].providerId,
      createdAt: serverTimestamp()
    });
  }

  window.location.href = "profile.html";
}
