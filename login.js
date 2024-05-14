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

// معالجة نموذج تسجيل الدخول
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            // إعادة توجيه المستخدم إلى صفحة ملفه الشخصي
            window.location.href = `profile.html?userId=${user.uid}`;
        })
        .catch((error) => {
            console.error("خطأ في تسجيل الدخول:", error);
        });
});

// تسجيل الدخول باستخدام Google
const googleSignInButton = document.getElementById('googleSignIn');
googleSignInButton.addEventListener('click', function() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            // إعادة توجيه المستخدم إلى صفحة ملفه الشخصي
            window.location.href = `profile.html?userId=${user.uid}`;
        })
        .catch((error) => {
            console.error("خطأ في تسجيل الدخول باستخدام Google:", error);
        });
});
