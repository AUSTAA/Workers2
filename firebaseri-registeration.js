// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA1L9YC72fzgG_UhbZJAyuueAePoM9CgAU",
    authDomain: "workers2-e6d6f.firebaseapp.com",
    projectId: "workers2-e6d6f",
    storageBucket: "workers2-e6d6f.appspot.com",
    messagingSenderId: "196462535548",
    appId: "1:196462535548:web:e5ccd41d6adf5f893fbaf9",
    measurementId: "G-EVVLM3Q526"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Define action code settings
const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
url:   'https://workers2-e6d6f.firebaseapp.com/__/auth/action',
    // This must be true.
    handleCodeInApp: true
};

// Listen for the registration form submission event
const registrationForm = document.getElementById('registration_form');
registrationForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phoneNumber = document.getElementById('phone').value;

    // Use Firebase SDK to create a new account
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Send verification code via email
auth.currentUser.sendEmailVerification(actionCodeSettings)
                .then(() => {
                    // Email sent
                    console.log("Verification email sent.");
                    // Redirect user to enter the verification code
                    // For example, redirect to a page where the user enters the code
                    window.location.href = 'verification.html';
                })
                .catch((error) => {
                    // Handle errors
                    console.error("Error sending verification email:", error);
                });
        })
        .catch((error) => {
            // Handle errors - display an error message to the user for example
            console.error(error.message);
        });
});
