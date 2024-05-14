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

// التعامل مع نموذج التسجيل
const registrationForm = document.getElementById('registrationForm');
registrationForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // تسجيل المستخدم باستخدام البريد الإلكتروني وكلمة المرور
    auth.createUserWithEmailAndPassword(`${username}@example.com`, password)
        .then((userCredential) => {
            // توجيه المستخدم إلى صفحة الملف الشخصي
            window.location.href = `profile.html?userId=${userCredential.user.uid}`;
        })
        .catch((error) => {
            console.error("خطأ في إنشاء المستخدم:", error);
        });
});

// زر تسجيل الدخول باستخدام Google
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
