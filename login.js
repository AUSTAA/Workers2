// تكوين Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB7YJhtaefEPc9NMzhTBjQC06WmSEja0xc",
    authDomain: "omran-16f44.firebaseapp.com",
    databaseURL: "https://omran-16f44-default-rtdb.firebaseio.com",
    projectId: "omran-16f44",
    storageBucket: "omran-16f44.appspot.com",
    messagingSenderId: "598982209417",
    appId: "1:598982209417:web:dc9cbddd485a1ea52bbb58",
    measurementId: "G-PGZJ0T555G"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebaseApp.auth();

// إعداد reCAPTCHA
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
    'size': 'normal',
    'callback': (response) => {
        console.log('reCAPTCHA solved');
    },
    'expired-callback': () => {
        console.log('reCAPTCHA expired');
    }
});
recaptchaVerifier.render().then((widgetId) => {
    window.recaptchaWidgetId = widgetId;
});

// إرسال رمز التحقق
const sendCodeButton = document.getElementById('sendCode');
sendCodeButton.addEventListener('click', function() {
    const phoneNumber = document.getElementById('phone').value;
    const appVerifier = window.recaptchaVerifier;

    auth.signInWithPhoneNumber(phoneNumber, appVerifier)
        .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            console.log("تم إرسال رمز التحقق");
        })
        .catch((error) => {
            console.error("خطأ في إرسال رمز التحقق:", error);
        });
});

// معالجة تسجيل الدخول
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const code = document.getElementById('code').value;

    window.confirmationResult.confirm(code)
        .then((result) => {
            const user = result.user;
            console.log("تم تسجيل الدخول بنجاح:", user);
            window.location.href = `profile.html?userId=${user.uid}`;
        })
        .catch((error) => {
            console.error("خطأ في تسجيل الدخول:", error);
        });
});
