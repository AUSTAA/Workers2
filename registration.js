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

// التحقق من اسم المستخدم عند الانتهاء من كتابته
document.getElementById('username').addEventListener('input', async (e) => {
    const username = e.target.value;
    const usernameFeedback = document.getElementById('username-feedback');

    try {
        // التحقق من عدم وجود اسم مستخدم مكرر
        const userSnapshot = await db.collection('users').where('username', '==', username).get();
        if (!userSnapshot.empty) {
            usernameFeedback.innerHTML = 'هذا الاسم موجود بالفعل. جرب اسم مستخدم آخر.';
        } else {
            usernameFeedback.innerHTML = ''; // إزالة رسالة الخطأ إذا كانت موجودة
        }
    } catch (error) {
        console.error('Error checking username:', error);
        alert('حدث خطأ أثناء التحقق من اسم المستخدم.');
    }
});

// إرسال رمز التحقق
document.getElementById('sendCode').addEventListener('click', async () => {
    const phoneNumber = document.getElementById('phone').value;
    const username = document.getElementById('username').value;

    try {
        // التحقق من صحة رقم الهاتف وإرسال رمز التحقق
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
    const username = document.getElementById('username').value; // إضافة استرداد اسم المستخدم من النموذج

    try {
        const result = await window.confirmationResult.confirm(code);
        const user = result.user;

        // تحقق من عدم وجود اسم مستخدم مكرر
        const userSnapshot = await db.collection('users').where('username', '==', username).get();
        if (!userSnapshot.empty) {
            alert('اسم المستخدم موجود، جرب اسم مستخدم آخر.');
            return;
        }

        // تعيين كلمة المرور واسم المستخدم
        user.updatePassword(password).then(() => {
            // إضافة بيانات المستخدم إلى قاعدة البيانات
            db.collection('users').doc(user.uid).set({
                phoneNumber: user.phoneNumber, // رقم الهاتف
                username: username, // اسم المستخدم
                password: password // الرقم السري
                // يمكنك إضافة المزيد من البيانات إذا كانت مطلوبة
            }).then(() => {
                alert('تم التسجيل بنجاح');
                // توجيه المستخدم إلى صفحة الملف الشخصي
                window.location.href = 'profile.html';
            }).catch((error) => {
                console.error('Error adding user data:', error);
                alert('حدث خطأ أثناء تسجيل البيانات.');
            });
        }).catch((error) => {
            console.error('Error setting password:', error);
            alert('خطأ في تعيين كلمة المرور.');
        });
    } catch (error) {
        console.error('Error verifying code:', error);
        alert('رمز التحقق غير صحي
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
