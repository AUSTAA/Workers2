/*********************************
 * Firebase v11 Imports
 *********************************/
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
 * Init Firebase
 *********************************/
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

auth.languageCode = "ar";

/*********************************
 * reCAPTCHA (الصحيح لـ v11)
 *********************************/
let recaptchaVerifier;
let confirmationResult;

function initRecaptcha() {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
  }

  recaptchaVerifier = new RecaptchaVerifier(
    auth,
    "recaptcha-container",
    {
      size: "normal",
      callback: () => {
        console.log("reCAPTCHA verified");
      },
      "expired-callback": () => {
        console.log("reCAPTCHA expired");
      }
    }
  );

  recaptchaVerifier.render();
}

window.addEventListener("load", initRecaptcha);

/*********************************
 * Phone Auth
 *********************************/
document.getElementById("sendCode").addEventListener("click", async () => {
  const phoneNumber = document.getElementById("phone").value.trim();

  if (!phoneNumber) {
    alert("أدخل رقم الهاتف");
    return;
  }

  try {
    confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      recaptchaVerifier
    );

    alert("تم إرسال رمز التحقق");
  } catch (error) {
    console.error(error);
    alert(error.message || "فشل إرسال الرمز");

    // إعادة تهيئة reCAPTCHA عند الفشل
    initRecaptcha();
  }
});

document.getElementById("verifyCode").addEventListener("click", async () => {
  const code = document.getElementById("code").value.trim();

  if (!code) {
    alert("أدخل رمز التحقق");
    return;
  }

  try {
    const result = await confirmationResult.confirm(code);
    await saveUser(result.user);
  } catch (error) {
    console.error(error);
    alert("رمز التحقق غير صحيح");
  }
});

/*********************************
 * Google Sign In
 *********************************/
document.getElementById("googleSignIn").addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    await saveUser(result.user);
  } catch (error) {
    console.error(error);
    alert("فشل تسجيل الدخول بجوجل");
  }
});

/*********************************
 * Facebook Sign In
 *********************************/
document.getElementById("facebookSignIn").addEventListener("click", async () => {
  const provider = new FacebookAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    await saveUser(result.user);
  } catch (error) {
    console.error(error);
    alert("فشل تسجيل الدخول بفيسبوك");
  }
});

/*********************************
 * Save User
 *********************************/
async function saveUser(user) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      phone: user.phoneNumber || "",
      email: user.email || "",
      name: user.displayName || "",
      createdAt: serverTimestamp()
    });
  }

  window.location.href = "profile.html";
}
