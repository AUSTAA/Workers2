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

            // تحميل التقييمات وحساب المتوسط
            loadRatingsAndComments(workerId);
        } else {
            console.log("No such document!");
        }
    })
    .catch((error) => {
        console.error("Error getting document:", error);
    });

// دالة لإنشاء نجمة أو نصف نجمة
function createStar(filled, half = false) {
    const star = document.createElement('span');
    star.textContent = half ? '☆' : '★';  // '☆' للنصف نجمة
    star.style.color = filled ? 'gold' : 'gray';
    star.style.fontSize = '24px'; // حجم النجمة
    star.style.margin = '2px';    // تباعد بين النجوم
    return star;
}

// دالة لعرض التقييم بالنجوم
function displayRatingStars(averageRating) {
    const starRatingDisplay = document.getElementById('averageRating');
    starRatingDisplay.innerHTML = ''; // مسح المحتوى السابق

    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(averageRating)) {
            starRatingDisplay.appendChild(createStar(true));
        } else if (i === Math.ceil(averageRating)) {
            if (averageRating % 1 !== 0) {
                starRatingDisplay.appendChild(createStar(true, true)); // نصف نجمة
            } else {
                starRatingDisplay.appendChild(createStar(false));
            }
        } else {
            starRatingDisplay.appendChild(createStar(false));
        }
    }
}

// حساب متوسط عدد النجوم بالوزن المناسب
function calculateWeightedAverage(ratings) {
    let totalWeightedSum = 0;
    let totalWeight = 0;

    // تحديد الوزن لكل تقييم وضربه بعدد النجوم المقابل
    for (const rating of ratings) {
        let weight = 0;
        switch (rating) {
            case 1:
                weight = 1;
                break;
            case 2:
                weight = 2;
                break;
            case 3:
                weight = 3;
                break;
            case 4:
                weight = 4;
                break;
            case 5:
                weight = 5;
                break;
            default:
                break;
        }
        totalWeightedSum += weight * rating;
        totalWeight += weight;
    }

    // حساب المتوسط
    const weightedAverage = totalWeightedSum / totalWeight;
    return weightedAverage;
}

// حساب متوسط عدد النجوم
function loadRatingsAndComments(workerId) {
    const ratingSection = document.getElementById('ratingSection');
    const starRating = document.getElementById('starRating');
    const rateButton = document.getElementById('rateButton');
    const averageRatingDisplay = document.getElementById('averageRating');

    // جلب التقييمات
    db.collection("ratings").where("workerId", "==", workerId).get()
        .then((querySnapshot) => {
            const ratings = [];
            querySnapshot.forEach((doc) => {
                ratings.push(doc.data().rating);
            });

            // حساب المتوسط بالوزن المناسب
            const weightedAverage = calculateWeightedAverage(ratings);
            displayRatingStars(weightedAverage); // عرض التقييم المتوسط كعدد من النجوم
        })
        .catch((error) => {
            console.error("Error getting ratings: ", error);
        });
}

// التحقق من حالة تسجيل الدخول
auth.onAuthStateChanged((user) => {
    const authButton = document.getElementById('authButton');
    if (user) {
        authButton.style.display = 'none'; // إخفاء زر تسجيل الدخول إذا كان المستخدم مسجلاً الدخول
    } else {
        authButton.style.display = 'inline-block'; // عرض زر تسجيل الدخول إذا لم يكن المستخدم مسجلاً الدخول
        authButton.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }
});

// العودة إلى الصفحة الرئيسية
document.getElementById('homeButton').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// العودة إلى القائمة السابقة
document.getElementById('backButton').addEventListener('click', () => {
    window.history.back();
});
