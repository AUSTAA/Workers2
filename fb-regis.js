<!-- Add Firebase SDK script tags -->
<script src="https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.11.1/firebase-analytics.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js"></script>

<script>
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
     apiKey: "AIzaSyB-xY9BrFF7NO8iwKwMn4O3aX__30Iqjnk",
    authDomain: "workers2-c1d8f.firebaseapp.com",
    projectId: "workers2-c1d8f",
    storageBucket: "workers2-c1d8f.appspot.com",
    messagingSenderId: "750487110155",
    appId: "1:750487110155:web:36d72d9a0528d476e63d0e",
    measurementId: "G-06X9VJ7005
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
