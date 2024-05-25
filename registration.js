        // إعداد Firebase
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

        // تسجيل الدخول باستخدام Google
        document.getElementById('googleSignIn').addEventListener('click', async () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            try {
                const result = await auth.signInWithPopup(provider);
                const user = result.user;

                // تخزين معلومات المستخدم في Firestore
                await db.collection('users').doc(user.uid).set({
                    uid: user.uid,
                    phone: user.phoneNumber || '',
                    email: user.email || '',
                    displayName: user.displayName || ''
                });

                alert('تم تسجيل الدخول بنجاح باستخدام Google');
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Error signing in with Google:', error);
                alert('فشل تسجيل الدخول باستخدام Google');
            }
        });

        // إرسال رمز التحقق في حال نسيان الرمز السري
        document.getElementById('forgotPassword').addEventListener('click', async () => {
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

                // تخزين معلومات المستخدم وكلمة المرور في Firestore
                await db.collection('users').doc(user.uid).set({
                    uid: user.uid,
                    phone: user.phoneNumber,
                    password: password // يجب أن يتم تشفير كلمة المرور بشكل أفضل في الإنتاج
                });

                alert('تم التسجيل بنجاح');
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Error verifying code:', error);
                alert('رمز التحقق غير صحيح');
            }
        });

        // تسجيل الدخول باستخدام رقم الهاتف والرمز السري
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const phoneNumber = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            try {
                const formattedNumber = formatPhoneNumber(phoneNumber);
                const userDoc = await db.collection('users').where('phone', '==', formattedNumber).where('password', '==', password).get();
                if (!userDoc.empty) {
                    alert('تم تسجيل الدخول بنجاح');
                    window.location.href = 'index.html';
                } else {
                    alert('رقم الهاتف أو الرمز السري غير صحيح');
                }
            } catch (error) {
                console.error('Error logging in:', error);
                alert('حدث خطأ أثناء تسجيل الدخول');
            }
        });
