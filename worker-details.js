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
const auth = firebase.auth();

// تحديد الـ ID من عنوان URL
const workerId = getWorkerIdFromUrl(window.location.href);

// دالة للحصول على الـ ID من عنوان URL
function getWorkerIdFromUrl(url) {
    const queryString = url.split('?')[1];
    const params = new URLSearchParams(queryString);
    return params.get('id');
}

// جلب بيانات العامل باستخدام الـ ID
db.collection("users").doc(workerId).get()
    .then((doc) => {
        if (doc.exists) {
            const workerData = doc.data();
            document.getElementById('workerName').textContent = `الاسم: ${workerData.username}`;
            document.getElementById('workerPhone').textContent = `رقم الهاتف: ${workerData.phone}`;
            document.getElementById('workerNationality').textContent = `الجنسية: ${workerData.nationality}`;
            document.getElementById('workerCity').textContent = `المدينة: ${workerData.city}`;
            document.getElementById('workerExperienceYears').textContent = `عدد سنين الخبرة: ${workerData.experienceYears}`;
            document.getElementById('workerAge').textContent = `العمر: ${workerData.age}`;
            document.getElementById('workerProfession').textContent = `المهنة: ${workerData.profession}`;

            // تحميل الصورة الشخصية
            const profilePictureRef = firebase.storage().ref().child(`users/${workerId}/profilePicture.jpg`);
            profilePictureRef.getDownloadURL().then((url) => {
                document.getElementById('workerProfilePicture').src = url;
            }).catch((error) => {
                console.error("Error getting profile picture:", error);
            });

            // تحميل صور الخدمات
            const serviceImagesContainer = document.getElementById('workerServiceImages');
            serviceImagesContainer.innerHTML = ''; // مسح المحتوى الحالي
            const serviceImagesRef = firebase.storage().ref().child(`users/${workerId}/serviceImages`);
            serviceImagesRef.listAll().then((serviceImagesSnapshot) => {
                serviceImagesSnapshot.items.forEach((itemRef) => {
                    itemRef.getDownloadURL().then((imageUrl) => {
                        const img = document.createElement('img');
                        img.src = imageUrl;
                        img.alt = 'صورة خدمة';
                        img.style.maxWidth = '100%';
                        img.style.marginBottom = '10px';
                        serviceImagesContainer.appendChild(img);
                    }).catch((error) => {
                        console.error("Error getting service image:", error);
                    });
                });
            }).catch((error) => {
                console.error("Error getting service images:", error);
            });
        } else {
            console.log("No such document!");
        }
    })
    .catch((error) => {
        console.error("Error getting document:", error);
    });

// عند تقييم العامل
function rateWorker(userId, workerId, userRating) {
    // تخزين التقييم في مجموعة "ratings"
    const ratingRef = db.collection("ratings").doc();
    ratingRef.set({
        userId: userId,
        workerId: workerId,
        rating: userRating
    }).then(() => {
        // تم تقييم العامل بنجاح
    }).catch((error) => {
        console.error("Error submitting rating: ", error);
    });

    // تخزين معرف المستخدم الذي قام بالتقييم في مجموعة "WhoRated"
    const whoRatedRef = db.collection("WhoRated").doc(userId);
    whoRatedRef.set({
        userId: userId
    }).then(() => {
        // تم تخزين معرف المستخدم الذي قام بالتقييم بنجاح
    }).catch((error) => {
        console.error("Error storing who rated: ", error);
    });
}

function checkIfUserRated(userId, workerId) {
    const userRatedRef = db.collection("Whoraited").doc(userId);
    userRatedRef.get().then((doc) => {
        if (doc.exists) {
            // المستخدم قام بالتقييم مسبقًا
            // يمكنك تحديث واجهة المستخدم هنا لعرض رسالة أو إجراء مناسب
        } else {
            // المستخدم لم يقم بالتقييم من قبل
            // يمكنك تحديث واجهة المستخدم هنا لعرض رسالة أو إجراء مناسب
        }
    }).catch((error) => {
        console.error("Error checking if user rated: ", error);
    });
}

// تحميل التقييمات والتعليقات
function loadRatingsAndComments(workerId) {
    // تحميل التقييمات والتعليقات
}

// التحقق من حالة تسجيل الدخول
auth.onAuthStateChanged((user) => {
    const authButton = document.getElementById('authButton');
    if (user) {
        authButton.style.display = 'none'; // إخفاء زر تسجيل الدخول إذا كان المستخدم مسجلاً الدخول
        const userId = user.uid;
        // التحقق مما إذا كان المستخدم قد قام بالتقييم من قبل
        checkIfUserRated(userId, workerId);
        // تحميل التقييمات والتعليقات بعد التأكد من حالة تسجيل الدخول
        loadRatingsAndComments(workerId);
    } else {
        authButton.style.display = 'inline-block'; // :

```javascript
auth.onAuthStateChanged((user) => {
    const authButton = document.getElementById('authButton');
    if (user) {
        authButton.style.display = 'none'; // إخفاء زر تسجيل الدخول إذا كان المستخدم مسجلاً الدخول
        const userId = user.uid;
        // التحقق مما إذا كان المستخدم قد قام بالتقييم من قبل
        checkIfUserRated(userId, workerId);
        // تحميل التقييمات والتعليقات بعد التأكد من حالة تسجيل الدخول
        loadRatingsAndComments(workerId);
    } else {
        authButton.style.display = 'inline-block'; // عرض زر تسجيل الدخول إذا لم يكن المستخدم مسجلاً الدخول
        authButton.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
        // يمكنك هنا أيضًا تحميل التقييمات والتعليقات بشكل افتراضي للمستخدمين غير المسجلين
        loadRatingsAndComments(workerId);
    }
});
```
