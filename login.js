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
        // يمكنك إعادة توجيه المستخدم أو تنفيذ أي منطق آخر هنا
    } catch (error) {
        console.error('Error verifying code:', error);
        alert('رمز التحقق غير صحيح');
    }
});
تحديث ملف HTML لتضمين مكتبة libphonenumber-js:
html
نسخ الكود
<!DOCTYPE html>
<html>
<head>
    <title>صفحة تسجيل الدخول</title>
    <script src="https://www.gstatic.com/firebasejs/10.11.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.11.1/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.11.1/firebase-storage-compat.js"></script>
    <script src="https://unpkg.com/libphonenumber-js@1.9.42/bundle/libphonenumber-js.min.js"></script>
</head>
<body>
    <h1>تسجيل الدخول باستخدام رقم الهاتف</h1>
    <form id="loginForm">
        <label for="phone">رقم الهاتف:</label>
        <input type="tel" id="phone" required><br>
        <div id="recaptcha-container"></div>
        <button type="button" id="sendCode">إرسال رمز التحقق</button><br>
        
        <label for="code">رمز التحقق:</label>
        <input type="text" id="code"><br>
        <button type="submit">تسجيل الدخول</button>
    </form>

    <script src="login.js"></script>
</body>
</html>
