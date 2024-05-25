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

        userDocRef.get().then(async (doc) => {
            if (doc.exists) {
                const userData = doc.data();
                document.getElementById('username').textContent = `الاسم: ${userData.username}`;
                document.getElementById('phoneNumber').textContent = `رقم الهاتف: ${userData.phone}`;
                document.getElementById('newPhone').textContent = userData.newPhone ? `رقم هاتف إضافي: ${userData.newPhone}` : '';
                document.getElementById('nationality').textContent = `الجنسية: ${userData.nationality}`;
                document.getElementById('city').textContent = `المدينة: ${userData.city}`;
                document.getElementById('experienceYears').textContent = `عدد سنين الخبرة: ${userData.experienceYears}`;
                document.getElementById('age').textContent = `العمر: ${userData.age}`;
                document.getElementById('profession').textContent = `المهنة: ${userData.profession}`;

                // تحميل الصورة الشخصية
                const profilePictureRef = storage.ref().child(`users/${userId}/profilePicture.jpg`);
                const profilePictureUrl = await profilePictureRef.getDownloadURL();
                document.getElementById('profilePicture').src = profilePictureUrl;

                // تحميل صور الخدمات
                const serviceImagesContainer = document.getElementById('serviceImages');
                serviceImagesContainer.innerHTML = ''; // مسح المحتوى الحالي
                const serviceImagesRef = storage.ref().child(`users/${userId}/serviceImages`);
                const serviceImagesSnapshot = await serviceImagesRef.listAll();
                for (const itemRef of serviceImagesSnapshot.items) {
                    const imageUrl = await itemRef.getDownloadURL();
                    const img = document.createElement('img');
                    img.src = imageUrl;
                    img.alt = 'صورة خدمة';
                    serviceImagesContainer.appendChild(img);
                }
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

// زر لتعديل الملف الشخصي
document.getElementById('editProfileButton').addEventListener('click', () => {
    window.location.href = 'edit-profile.html';
});
