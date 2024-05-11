const firebaseConfig = {
    apiKey: "Your-API-Key",
    authDomain: "Your-Auth-Domain",
    databaseURL: "Your-Database-URL",
    projectId: "Your-Project-ID",
    storageBucket: "Your-Storage-Bucket",
    messagingSenderId: "Your-Messaging-Sender-ID",
    appId: "Your-App-ID",
    measurementId: "Your-Measurement-ID"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storageRef = firebase.storage().ref();

// Handle registration form submission
const registrationForm = document.getElementById('registrationForm');
registrationForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    const username = document.getElementById('username').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    
    // Register user with phone number and password
    auth.createUserWithEmailAndPassword(`${phone}@example.com`, password)
        .then((userCredential) => {
            // Save user data to Firestore
            db.collection("users").doc(userCredential.user.uid).set({
                username: username,
                phone: phone
            })
            .then(() => {
                console.log("User data saved to Firestore.");
                // Redirect user to their profile page with user ID as query parameter
                window.location.href = `profile.html?userId=${userCredential.user.uid}`;
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
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            // Redirect user to their profile page with user ID as query parameter
            window.location.href = `profile.html?userId=${user.uid}`;
        })
        .catch((error) => {
            console.error("Error signing in with Google:", error);
        });
});
