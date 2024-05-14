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

// تحقق من رمز التحقق
document.getElementById('verifyCode').addEventListener('click', async () => {
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
