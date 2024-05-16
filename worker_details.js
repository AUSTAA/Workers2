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

const db = firebase.firestore();
const storage = firebase.storage();

// جلب معرّف المستخدم من URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');

// دالة لتحميل صورة من Firebase Storage
async function loadImage(imageRef) {
    try {
        const imageUrl = await imageRef.getDownloadURL();
        return imageUrl;
    } catch (error) {
        console.error("Error loading image:", error);
        return null;
    }
}

// جلب بيانات المستخدم عند تحميل الصفحة
if (userId) {
    const userDocRef = db.collection('users').doc(userId);

    userDocRef.get().then(async (doc) => {
        if (doc.exists) {
            const userData = doc.data();
            document.getElementById('workerName').textContent = `الاسم: ${userData.username}`;
            document.getElementById('workerPhone').textContent = `رقم الهاتف: ${userData.phone}`;
            document.getElementById('workerNationality').textContent = `الجنسية: ${userData.nationality}`;
            document.getElementById('workerCity').textContent = `المدينة: ${userData.city}`;
            document.getElementById('workerExperienceYears').textContent = `عدد سنين الخبرة: ${userData.experienceYears}`;
            document.getElementById('workerAge').textContent = `العمر: ${userData.age}`;
            document.getElementById('workerProfession').textContent = `المهنة: ${userData.profession}`;

            // تحميل الصورة الشخصية
            const profilePictureRef = storage.ref().child(`users/${userId}/profilePicture.jpg`);
            const profilePictureUrl = await loadImage(profilePictureRef);
            if (profilePictureUrl) {
                document.getElementById('workerProfilePicture').src = profilePictureUrl;
            }

            // تحميل صور الخدمات
            const serviceImagesContainer = document.getElementById('workerServiceImages');
            serviceImagesContainer.innerHTML = ''; // مسح المحتوى الحالي
            const serviceImagesRef = storage.ref().child(`users/${userId}/serviceImages`);
            const serviceImagesSnapshot = await serviceImagesRef.listAll();

            if (serviceImagesSnapshot.items.length > 0) {
                for (const itemRef of serviceImagesSnapshot.items) {
                    const imageUrl = await loadImage(itemRef);
                    if (imageUrl) {
                        const img = document.createElement('img');
                        img.src = imageUrl;
                        img.alt = 'صورة خدمة';
                        serviceImagesContainer.appendChild(img);
                    }
                }
            } else {
                console.log("No service images found for this user.");
            }
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.error("Error getting document:", error);
    });
} else {
    console.log("No user ID provided in URL");
}

// زر للعودة إلى الصفحة الرئيسية
document.getElementById('homeButton').addEventListener('click', () => {
    window.location.href = 'index.html';
});
