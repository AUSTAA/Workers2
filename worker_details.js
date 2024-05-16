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

// جلب معرّف العامل من URL
const urlParams = new URLSearchParams(window.location.search);
const workerId = urlParams.get('id');

// جلب بيانات العامل عند تحميل الصفحة
if (workerId) {
    const workerDocRef = db.collection('workers').doc(workerId);

    workerDocRef.get().then(async (doc) => {
        if (doc.exists) {
            const workerData = doc.data();
            document.getElementById('workerName').textContent = `الاسم: ${workerData.name}`;
            document.getElementById('workerPhone').textContent = `رقم الهاتف: ${workerData.phone}`;
            document.getElementById('workerNationality').textContent = `الجنسية: ${workerData.nationality}`;
            document.getElementById('workerCity').textContent = `المدينة: ${workerData.city}`;
            document.getElementById('workerExperienceYears').textContent = `عدد سنين الخبرة: ${workerData.experienceYears}`;
            document.getElementById('workerAge').textContent = `العمر: ${workerData.age}`;
            document.getElementById('workerProfession').textContent = `المهنة: ${workerData.profession}`;

            // تحميل الصورة الشخصية
            const profilePictureRef = storage.ref().child(`workers/${workerId}/profilePicture.jpg`);
            try {
                const profilePictureUrl = await profilePictureRef.getDownloadURL();
                document.getElementById('workerProfilePicture').src = profilePictureUrl;
            } catch (error) {
                console.log("No profile picture available:", error);
            }

            // تحميل صور الخدمات
            const serviceImagesContainer = document.getElementById('workerServiceImages');
            serviceImagesContainer.innerHTML = ''; // مسح المحتوى الحالي
            const serviceImagesRef = storage.ref().child(`workers/${workerId}/serviceImages`);
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
    console.log("No worker ID provided in URL");
}

// زر للعودة إلى الصفحة الرئيسية
document.getElementById('homeButton').addEventListener('click', () => {
    window.location.href = 'index.html';
});
