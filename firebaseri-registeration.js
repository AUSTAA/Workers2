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
            // Handle success - for example, redirecting the user to a page after registration
            window.location.href = 'verification.html';
        })
        .catch((error) => {
            // Handle errors - display an error message to the user for example
            console.error(error.message);
        });
});
