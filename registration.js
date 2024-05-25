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
    const parsedNumber = libphonenumber.parsePhoneNumber(phoneNumber, 'US'); // تغيير 'US' إلى الكود المناسب لبلدك
    if (parsedNumber && parsedNumber.isValid()) {
        return parsedNumber.format('E.164');
    } else {
        throw new Error('رقم الهاتف غير صالح');
    }
}

// التحقق من وجود اسم المستخدم
async function checkUsername(username) {
    const userRef = db.collection('users').doc(username);
    const doc = await userRef.get();
    return doc.exists;
}

// إضافة اسم المستخدم وحفظ رقم الهاتف وكلمة المرور
document.getElementById('register').addEventListener('click', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const phoneNumber = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    
    try {
        const usernameExists = await checkUsername(username);
        if (usernameExists) {
            alert('اسم المستخدم موجود بالفعل، جرب اسماً آخر.');
        } else {
            const formattedNumber = formatPhoneNumber(phoneNumber);
            await db.collection('users').doc(username).set({
                phoneNumber: formattedNumber,
                password: password
            });
            alert('تم حفظ البيانات بنجاح');
            // ربما تحويل المستخدم إلى صفحة تسجيل الدخول هنا
        }
    } catch (error) {
        console.error('Error registering user:', error);
        alert('حدث خطأ أثناء التسجيل، يرجى المحاولة مرة أخرى.');
    }
});

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
