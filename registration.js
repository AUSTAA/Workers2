// تهيئة Firebase
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

// تنسيق والتحقق من رقم الهاتف باستخدام libphonenumber-js
function formatPhoneNumber(phoneNumber) {
    const parsedNumber = libphonenumber.parsePhoneNumberFromString(phoneNumber);
    if (parsedNumber && parsedNumber.isValid()) {
        return parsedNumber.format('E.164');
    } else {
        throw new Error('رقم الهاتف غير صالح');
    }
}

// إرسال رمز التحقق
document.getElementById('sendCode').addEventListener('click', async () => {
    const phoneNumber = document.getElementById('phone').value;
    try {
        const formattedNumber = formatPhoneNumber(phoneNumber);
        const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
        const confirmationResult = await auth.signInWithPhoneNumber(formattedNumber, appVerifier);
        window.confirmationResult = confirmationResult;
        alert('تم إرسال رمز التحقق');
    } catch (error) {
        console.error('Error sending verification code:', error);
        alert('فشل في إرسال رمز التحقق. تأكد من صحة رقم الهاتف.');
    }
});

// تسجيل الدخول باستخدام رمز التحقق
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = document.getElementById('code').value;
    try {
        const result = await window.confirmationResult.confirm(code);
        alert('تم تسجيل الدخول بنجاح');
        window.location.href = `index.html`;
    } catch (error) {
        console.error('Error verifying code:', error);
        alert('رمز التحقق غير صحيح');
    }
});

// التعامل مع نموذج التسجيل بالبريد الإلكتروني وكلمة المرور
const registrationForm = document.getElementById('registrationForm');
registrationForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    // تسجيل المستخدم باستخدام البريد الإلكتروني وكلمة المرور
    auth.createUserWithEmailAndPassword(`${phone}@example.com`, password)
        .then((userCredential) => {
            // حفظ بيانات المستخدم في Firestore
            db.collection("users").doc(userCredential.user.uid).set({
                username: username,
                phone: phone
            })
            .then(() => {
                console.log("تم حفظ بيانات المستخدم في Firestore.");
                window.location.href = `profile.html?userId=${userCredential.user.uid}`;
            })
            .catch((error) => {
                console.error("خطأ في حفظ بيانات المستخدم في Firestore:", error);
            });
        })
        .catch((error) => {
            console.error("خطأ في إنشاء المستخدم:", error);
        });
});

// تسجيل الدخول باستخدام Google
const googleSignInButton = document.getElementById('googleSignIn');
googleSignInButton.addEventListener('click', function() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            window.location.href = `profile.html?userId=${user.uid}`;
        })
        .catch((error) => {
            console.error("Error signing in with Google:", error);
        });
});
