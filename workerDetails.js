// workerDetails.js

// إعداد Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB7YJhtaefEPc9NMzhTBjQC06WmSEja0xc",
  authDomain: "omran-16f44.firebaseapp.com",
  databaseURL: "https://omran-16f44-default-rtdb.firebaseio.com",
  projectId: "omran-16f44",
  storageBucket: "omran-16f44.appspot.com",
  messagingSenderId: "598982209417",
  appId: "1:598982209417:web:dc9cbddd485a1ea52bbb58",
  measurementId: "G-PGZJ0T555G"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// استعراض بيانات العامل
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    if (userId) {
        db.collection("workers").doc(userId).get()
            .then((doc) => {
                if (doc.exists) {
                    const workerData = doc.data();
                    document.getElementById('profilePicture').src = workerData.profilePicture;
                    document.getElementById('username').innerText = workerData.username;
                    document.getElementById('phone').innerText = workerData.phone;
                    document.getElementById('newPhone').innerText = workerData.newPhone;
                    document.getElementById('nationality').innerText = workerData.nationality;
                    document.getElementById('city').innerText = workerData.city;
                    document.getElementById('experienceYears').innerText = workerData.experienceYears;
                    document.getElementById('age').innerText = workerData.age;
                    document.getElementById('profession').innerText = workerData.profession;

                    const serviceImagesContainer = document.getElementById('serviceImagesContainer');
                    workerData.serviceImages.forEach((url) => {
                        const img = document.createElement('img');
                        img.src = url;
                        serviceImagesContainer.appendChild(img);
                    });
                } else {
                    console.error("No such document!");
                }
            })
            .catch((error) => {
                console.error("Error fetching worker data: ", error);
            });
    } else {
        console.error("No user ID provided in URL");
    }
});
