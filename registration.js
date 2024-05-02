import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, signInWithPhoneNumber } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';
import { GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7YJhtaefEPc9NMzhTBjQC06WmSEja0xc",
  authDomain: "omran-16f44.firebaseapp.com",
  databaseURL: "https://omran-16f44-default-rtdb.firebaseio.com",
  projectId: "omran-16f44",
  storageBucket: "omran-16f44.appspot.com",
  messagingSenderId: "598982209417",
  appId: "1:598982209417:web:dc9cbddd485a1ea52bbb58"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

// Handle registration form submission
const registrationForm = document.getElementById('registrationForm');
registrationForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    const username = document.getElementById('username').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const verificationMethod = document.getElementById('verificationMethod').value;

    if (verificationMethod === 'phone') {
        // Send verification code to phone number
        signInWithPhoneNumber(auth, phone)
            .then((confirmationResult) => {
                const code = prompt('الرجاء إدخال رمز التحقق المرسل إلى رقم الهاتف:');
                return confirmationResult.confirm(code);
            })
            .then(() => {
                console.log("Phone verification successful.");
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        // Save user data to Firestore
                        setDoc(doc(firestore, "users", userCredential.user.uid), {
                            username: username,
                            phone: phone
                        })
                        .then(() => {
                            console.log("User data saved to Firestore.");
                            // Redirect user to verification_sent.html
                            window.location.href = 'verification_sent.html';
                        })
                        .catch((error) => {
                            console.error("Error saving user data to Firestore:", error);
                        });
                    })
                    .catch((error) => {
                        console.error("Error creating user:", error);
                    });
            })
            .catch((error) => {
                console.error("Error verifying phone number:", error);
            });
    } else if (verificationMethod === 'email') {
        createUserWithEmailAndPassword(auth, email, password)
            then((userCredential).
