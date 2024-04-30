// Firebase SDK Configuration
const firebaseConfig = {
    apiKey: "AIzaSyB-xY9BrFF7NO8iwKwMn4O3aX__30Iqjnk",
    authDomain: "workers2-c1d8f.firebaseapp.com",
    projectId: "workers2-c1d8f",
    storageBucket: "workers2-c1d8f.appspot.com",
    messagingSenderId: "750487110155",
    appId: "1:750487110155:web:36d72d9a0528d476e63d0e",
    measurementId: "G-06X9VJ7005",
    clientId: "750487110155-mb34unvhr3rhq5ef84ai8k6t206s435m.apps.googleusercontent.com"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();

// Handle registration form submission
const registrationForm = document.getElementById('registrationForm');
registrationForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phoneNumber = document.getElementById('phone').value;

    // Create account with email and password
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Save user data to Firestore
            firestore.collection("users").doc(userCredential.user.uid).set({
                email: email,
                phoneNumber: phoneNumber
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
});

// Google Sign-In
const googleSignInButton = document.getElementById('googleSignIn');
googleSignInButton.addEventListener('click', function() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            const credential = result.credential;
            const user = result.user;
            console.log("Google sign-in successful:", user);
        }).catch((error) => {
            console.error("Error signing in with Google:", error);
        });
});
