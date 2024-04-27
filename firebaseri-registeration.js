// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();
const auth = firebase.auth();

// Define action code settings
const actionCodeSettings = {
    url: 'https://workers2-e6d6f.firebaseapp.com/__/auth/action?mode=action&oobCode=code',
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
    auth.createUserWithEmailAndPassword(email, password)
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
