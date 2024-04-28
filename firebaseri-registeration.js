<!-- Add Firebase SDK script tags -->
<script src="https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.11.1/firebase-analytics.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js"></script>

<script>
  // Your web app's Firebase configuration
  optional
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
