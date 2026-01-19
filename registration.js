/***********************
 * Firebase Init
 ***********************/
const firebaseConfig = {
  apiKey: "AIzaSyB7YJhtaefEPc9NMzhTBjQC06WmSEja0xc",
  authDomain: "omran-16f44.firebaseapp.com",
  projectId: "omran-16f44",
  storageBucket: "omran-16f44.appspot.com",
  messagingSenderId: "598982209417",
  appId: "1:598982209417:web:dc9cbddd485a1ea52bbb58"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

/***********************
 * Phone Auth (OTP)
 ***********************/
let confirmationResult;
let recaptchaVerifier;

/* إنشاء reCAPTCHA مرة واحدة فقط */
window.onload = () => {
  recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    "recaptcha-container",
    {
      size: "normal",
      callback: () => {
        console.log("reCAPTCHA solved");
      },
      "expired-callback": () => {
        console.log("reCAPTCHA expired");
      }
    }
  );

  recaptchaVerifier.render();
};

document.getElementById("sendCode").addEventListener("click", async () => {
  const phoneNumber = document.getElementById("phone").value.trim();

  if (!phoneNumber.startsWith("+")) {
    alert("يجب إدخال رقم الهاتف مع رمز الدولة مثل +218");
    return;
  }

  try {
    confirmationResult = await auth.signInWithPhoneNumber(
      phoneNumber,
      recaptchaVerifier
    );

    alert("تم إرسال رمز التحقق");
  } catch (error) {
    console.error(error);
    alert("فشل إرسال الرمز");

    // إعادة تهيئة reCAPTCHA عند الفشل
    recaptchaVerifier.clear();
    recaptchaVerifier.render();
  }
});

document.getElementById("verifyCode").addEventListener("click", async () => {
  const code = document.getElementById("code").value.trim();

  if (!confirmationResult) {
    alert("يجب طلب الرمز أولاً");
    return;
  }

  try {
    const result = await confirmationResult.confirm(code);
    await handleUser(result.user);
  } catch (error) {
    console.error(error);
    alert("رمز التحقق غير صحيح");
  }
});

/***********************
 * Google Sign In
 ***********************/
document.getElementById("googleSignIn").addEventListener("click", async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await auth.signInWithPopup(provider);
    await handleUser(result.user);
  } catch (error) {
    console.error(error);
    alert("فشل تسجيل الدخول بجوجل");
  }
});

/***********************
 * Facebook Sign In
 ***********************/
document.getElementById("facebookSignIn").addEventListener("click", async () => {
  const provider = new firebase.auth.FacebookAuthProvider();
  try {
    const result = await auth.signInWithPopup(provider);
    await handleUser(result.user);
  } catch (error) {
    console.error(error);
    alert("فشل تسجيل الدخول بفيسبوك");
  }
});

/***********************
 * Handle User (New / Existing)
 ***********************/
async function handleUser(user) {
  const userRef = db.collection("users").doc(user.uid);
  const doc = await userRef.get();

  if (!doc.exists) {
    await userRef.set({
      uid: user.uid,
      phone: user.phoneNumber || "",
      email: user.email || "",
      name: user.displayName || "",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  window.location.href = "profile.html";
}
