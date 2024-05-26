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
            document.getElementById('workerPhone').innerHTML = `رقم الهاتف: <a href="tel:${workerData.phone}">${workerData.phone}</a>`;
                document.getElementById('newPhone').textContent = userData.newPhone ? `رقم هاتف إضافي: ${userData.newPhone}` : '';
            document.getElementById('workerNationality').textContent = `الجنسية: ${workerData.nationality}`;
            document.getElementById('workerCity').textContent = `المدينة: ${workerData.city}`;
            document.getElementById('workerExperienceYears').textContent = `عدد سنين الخبرة: ${workerData.experienceYears}`;
            document.getElementById('workerAge').textContent = `العمر: ${workerData.age}`;
            document.getElementById('workerProfession').textContent = `المهنة: ${workerData.profession}`;

             عرض رابط الفيسبوك
           const facebookLink = workerData.facebookLink;
            if (facebookLink) {
                const facebookLinkElement = document.getElementById('workerFacebookLink');
                facebookLinkElement.href = facebookLink;
                facebookLinkElement.style.display = 'block'; // إظهار الرابط
           // }
            
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

// دالة لإنشاء نجمة معينة
function createStar(filled) {
    const star = document.createElement('span');
    star.textContent = '★';
    star.style.color = filled ? 'gold' : 'gray';
    return star;
}

// دالة لعرض التقييم بالنجوم
function displayRatingStars(averageRating) {
    const starRatingDisplay = document.getElementById('averageRating');
    starRatingDisplay.innerHTML = ''; // مسح المحتوى السابق

    for (let i = 1; i <= 5; i++) {
        starRatingDisplay.appendChild(createStar(i <= averageRating));
    }
}

// حساب متوسط عدد النجوم
function loadRatingsAndComments(workerId) {
    const ratingSection = document.getElementById('ratingSection');
    const starRating = document.getElementById('starRating');
    const rateButton = document.getElementById('rateButton');
    const averageRatingDisplay = document.getElementById('averageRating');

    auth.onAuthStateChanged((user) => {
        if (user) {
            const userId = user.uid;
            const userRatingRef = db.collection("Whoraited").doc(`${userId}_${workerId}`);

            // التحقق مما إذا كان المستخدم قد قام بالتقييم مسبقًا
            userRatingRef.get().then((doc) => {
                if (doc.exists) {
                    starRating.style.display = 'none'; // إخفاء النجوم
                    rateButton.style.display = 'none'; // إخفاء زر التقييم
                    averageRatingDisplay.textContent = 'لقد قمت بالتقييم مسبقًا.';
                } else {
                    rateButton.addEventListener('click', () => {
                        starRating.style.display = 'block';
                    });

                    starRating.addEventListener('change', (event) => {
                        const rating = parseInt(event.target.value);
                        userRatingRef.set({ userId, workerId }).then(() => {
                            db.collection("ratings").add({ workerId, rating }).then(() => {
                                alert('تم إرسال التقييم بنجاح!');
                                starRating.style.display = 'none'; // إخفاء النجوم بعد التقييم
                                rateButton.style.display = 'none'; // إخفاء زر التقييم
                                averageRatingDisplay.textContent = 'لقد قمت بالتقييم مسبقًا.';
                            }).catch((error) => {
                                console.error("Error submitting rating: ", error);
                            });
                        }).catch((error) => {
                            console.error("Error saving rating: ", error);
                        });
                    });
                }
            });

           
