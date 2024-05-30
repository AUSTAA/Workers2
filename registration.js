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

        // عرض ريكابتشا
        document.getElementById('recaptcha-container').style.display = 'block';

        // تأخير إخفاء ريكابتشا بعد ظهور الرسالة لفترة قصيرة
        setTimeout(() => {
            document.getElementById('recaptcha-container').style.display = 'none';
            alert('تم إرسال رمز التحقق');
        }, 1000); // تأخير لمدة ثانية واحدة (1000 مللي ثانية)
    } catch (error) {
        console.error('Error sending verification code:', error);
        alert('فشل في إرسال رمز التحقق. تأكد من صحة رقم الهاتف.');
    }
});

// تسجيل الدخول باستخدام رمز التحقق
document.getElementById('verifyCode').addEventListener('click', async (e) => {
    e.preventDefault();
    const code = document.getElementById('code').value;
    const password = document.getElementById('password').value;
    try {
        const result = await window.confirmationResult.confirm(code);
        const user = result.user;

        // تعيين كلمة المرور
        user.updatePassword(password).then(() => {
            alert('تم التسجيل بنجاح');
            window.location.href = 'profile.html';
        }).catch((error) => {
            console.error('Error setting password:', error);
            alert('خطأ في تعيين كلمة المرور.');
        });
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
