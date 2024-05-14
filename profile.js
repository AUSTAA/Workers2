const firebaseConfig = {
    apiKey: "AIzaSyB7YJhtaefEPc9NMzhTBjQC06WmSEja0xc",
    authDomain: "omran-16f44.firebaseapp.com",
    projectId: "omran-16f44",
    storageBucket: "omran-16f44.appspot.com",
    messagingSenderId: "598982209417",
    appId: "1:598982209417:web:dc9cbddd485a1ea52bbb58"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// جلب بيانات المستخدم عند تحميل الصفحة
auth.onAuthStateChanged((user) => {
    if (user) {
        const userId = user.uid;
        const userDocRef = db.collection('users').doc(userId);

        userDocRef.get().then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                document.getElementById('usernameDisplay').innerText = `الاسم: ${userData.username || ''}`;
                document.getElementById('phoneDisplay').innerText = `رقم الهاتف: ${userData.phone || ''}`;
                document.getElementById('nationalityDisplay').innerText = `الجنسية: ${userData.nationality || ''}`;
                document.getElementById('cityDisplay').innerText = `المدينة: ${userData.city || ''}`;
                document.getElementById('experienceYearsDisplay').innerText = `عدد سنين الخبرة: ${userData.experienceYears || ''}`;
                document.getElementById('ageDisplay').innerText = `العمر: ${userData.age || ''}`;

                const profilePictureRef = storage.ref().child(`users/${userId}/profilePicture.jpg`);
                profilePictureRef.getDownloadURL().then((url) => {
                    document.getElementById('profilePictureDisplay').src = url;
                }).catch((error) => {
                    console.error("Error getting profile picture:", error);
                });

                const serviceImagesRef = storage.ref().child(`users/${userId}/serviceImages/`);
                serviceImagesRef.listAll().then((result) => {
                    result.items.forEach((imageRef) => {
                        imageRef.getDownloadURL().then((url) => {
                            const img = document.createElement('img');
                            img.src = url;
                            img.width = 100;
                            document.getElementById('serviceImagesDisplay').appendChild(img);
                        }).catch((error) => {
                            console.error("Error getting service image:", error);
                        });
                    });
                }).catch((error) => {
                    console.error("Error listing service images:", error);
                });
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.error("Error getting document:", error);
        });
    } else {
        console.log("User is not signed in");
        window.location.href = 'registration.html'; // إعادة توجيه المستخدم إذا لم يكن مسجلاً الدخول
    }
});

// زر للعودة إلى الصفحة الرئيسية
document.getElementById('homeButton').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// زر لتعديل الصفحة الشخصية
document.getElementById('editProfileButton').addEventListener('click', () => {
    window.location.href = 'edit-profile.html';
});
