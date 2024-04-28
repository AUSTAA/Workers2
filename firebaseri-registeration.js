<!-- Add Firebase SDK script tags -->
<script src="https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.11.1/firebase-analytics.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js"></script>

<script>
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const analytics = firebase.analytics();
  const auth = firebase.auth();

  // Listen for the registration form submission event
  const registrationForm = document.getElementById('registration_form');
  registrationForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent default form submission
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const phoneNumber = document.getElementById('phone').value;

      // Use Firebase SDK to create a new account
      firebase.auth().createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
              // Handle successful registration
              console.log("User registered successfully:", userCredential);
              
              // Send email verification
              firebase.auth().currentUser.sendEmailVerification()
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
</script>
