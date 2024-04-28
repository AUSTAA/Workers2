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
    appId: "1:196462535548:web:f789f54c6fe36fe33fbaf9",
    measurementId: "G-VYNKHYHBCG"
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
            // Handle successful registration
            console.log("User registered successfully:", userCredential);
            
            // Send email verification
            auth.currentUser.sendEmailVerification()
                .then(() => {
                    // Email sent
                    console.log("Verification email sent.");
                    // Redirect user to a page indicating that verification email has been sent
                    window.location.href = 'verification_sent.html'; // Change 'verification_sent.html' to the desired URL
                })
                .catch((error) => {
                    // Handle errors
                    console.error("Error sending verification email:", error);
                });
        })
        .catch((error) => {
            // Handle errors
            console.error("Error registering user:", error);
        });
});
