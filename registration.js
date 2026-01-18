/***********************
 * Firebase Init
 ***********************/
const firebaseConfig = {
  apiKey: "AIzaSyB7YJhtaefEPc9NMzhTBjQC06WmSEja0xc",
  authDomain: "omran-16f44.firebaseapp.com",
  projectId: "omran-16f44",
  storageBucket: "omran-16f44.appspot.com",
  messagingSenderId: "598982209417",
  appId: "1:598982209417:web:dc9cbddd485a1ea52bbb58",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

/***********************
 * Phone Auth
 ***********************/
let confirmationResult;

const recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
  "recaptcha-container",
  { size: "normal" }
);

document.getElementById("sendCode").onclick = async () => {
  try {
    const phone = document.getElementById("phone").value.trim();
    confirmationResult = await auth.signInWithPhoneNumber(phone, recaptchaVerifier);
    alert("تم إرسال رمز التحقق");
  } catch (e) {
    alert("فشل إرسال الرمز");
    console.error(e);
  }
};

document.getElementById("verifyCode").onclick = async () => {
  try {
    const code = document.getElementById("code").value;
    const password = document.getElementById("password").value;

    const result = await confirmationResult.confirm(code);
    await result.user.updatePassword(password);

    alert("تم التسجيل بنجاح");
    window.location.href = "profile.html";
  } catch (e) {
    alert("رمز غير صحيح");
    console.error(e);
  }
};

/***********************
 * Google Login
 ***********************/
document.getElementById("googleSignIn").onclick = async () => {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    window.location.href = "profile.html";
  } catch (e) {
    alert("فشل تسجيل Google");
    console.error(e);
  }
};

/***********************
 * Facebook Login
 ***********************/
document.getElementById("facebookSignIn").onclick = async () => {
  try {
    const provider = new firebase.auth.FacebookAuthProvider();
    const result = await auth.signInWithPopup(provider);
    window.location.href = "profile.html";
  } catch (e) {
    alert("فشل تسجيل Facebook");
    console.error(e);
  }
};
