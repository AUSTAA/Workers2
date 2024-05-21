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
    const ratingRef = db.collection("ratings").doc(`${workerId}_${userRating}`);
    ratingRef.set({
        workerId: workerId,
        rating: userRating
    }).then(() => {
        console.log("تم تقييم العامل بنجاح");
        // تحديث متوسط التقييم بعد التقييم
        updateAverageRating(workerId);
    }).catch((error) => {
        console.error("Error submitting rating: ", error);
    });

    // تخزين معرف المستخدم الذي قام بالتقييم في مجموعة "Whoraited"
    const whoRatedRef = db.collection("Whoraited").doc(userId);
    whoRatedRef.set({
        userId: userId,
        workerId: workerId
    }).then(() => {
        console.log("تم تخزين معرف المستخدم الذي قام بالتقييم بنجاح");
    }).catch((error) => {
        console.error("Error storing who rated: ", error);
    });
}

function checkIfUserRated(userId, workerId) {
    const userRatedRef = db.collection("Whoraited").doc(userId);
    userRatedRef.get().then((doc) => {
        if (doc.exists) {
            // المستخدم قام بالتقييم مسبقًا
            console.log("المستخدم قام بالتقييم مسبقًا");
            document.querySelector('#starRating').style.pointerEvents = 'none'; // منع المستخدم من التقييم مرة أخرى
        } else {
            // المستخدم لم يقم بالتقييم من قبل
            console.log("المستخدم لم يقم بالتقييم من قبل");
            setupRatingEvent(userId, workerId);
        }
    }).catch((error) => {
        console.error("Error checking if user rated: ", error);
    });
}

// إعداد حدث التقييم
function setupRatingEvent(userId, workerId) {
    const starRating = document.getElementById('starRating');
    starRating.addEventListener('change', (event) => {
        const rating = event.target.value;
        rateWorker(userId, workerId, rating);
        alert('تم إرسال التقييم بنجاح!');
        starRating.style.pointerEvents = 'none'; // منع المستخدم من التقييم مرة أخرى
    });
}

// حساب وعرض متوسط التقييم
function updateAverageRating(workerId) {
    db.collection("ratings").where("workerId", "==", workerId).get()
        .then((querySnapshot) => {
            let totalRating = 0;
            let ratingCount = 0;
            querySnapshot.forEach((doc) => {
                totalRating += doc.data().rating;
                ratingCount++;
            });
            const averageRating = totalRating / ratingCount;
            document.getElementById('averageRating').textContent = `متوسط التقييم: ${averageRating.toFixed(2)}`;
        })
        .catch((error) => {
            console.error("Error calculating average rating: ", error);
        });
}

// تحميل التقييمات والتعليقات
function loadRatingsAndComments(workerId) {
    // تحميل التقييمات
    const ratingsContainer = document.getElementById('ratingsContainer');
    db.collection("ratings").where("workerId", "==", workerId).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const ratingData = doc.data();
                const ratingElement = document.createElement('p');
                ratingElement.textContent = `التقييم: ${ratingData.rating}`;
                ratingsContainer.appendChild(ratingElement);
            });
            // تحديث متوسط التقييم بعد تحميل التقييمات
            updateAverageRating(workerId);
        })
        .catch((error) => {
            console.error("Error getting ratings: ", error);
        });

    // تحميل التعليقات
    const commentsContainer = document.getElementById('commentsContainer');
    db.collection("comments").where("workerId", "==", workerId).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const commentData = doc.data();
                const commentElement = document.createElement('p');
                commentElement.textContent = `${commentData.username}: ${commentData.comment}`;
                commentsContainer.appendChild(commentElement);
            });
        })
        .catch((error) => {
            console.error("Error getting comments: ", error);
        });

    // إرسال تعليق جديد
    const commentInput = document.getElementById('commentInput');
    const submitCommentButton = document.getElementById('submitComment');
    submitCommentButton.addEventListener('click', () => {
        const comment = commentInput.value.trim();
        const user = auth.currentUser;
        if (comment && user) {
            const commentData = {
                workerId,
                username: user.displayName || user.email,
                comment,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };
            db.collection("comments").add(commentData).then(() => {
                const commentElement = document.createElement('p');
                commentElement.textContent = `${commentData.username}: ${commentData.comment}`;
                commentsContainer.appendChild(commentElement);
                commentInput.value = ''; // مسح التعليق
            }).catch((error) => {
                console.error("Error submitting comment: ", error);
            });
        } else if (!user) {
            alert('يجب تسجيل الدخول لإرسال تعليق.');
        }
    });
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
        authButton.style.display = 'inline-block'; // عرض زر تسجيل الدخول إذا لم يكن المستخدم مسجلاً الدخول
        authButton.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
        // يمكنك هنا أيضًا تحميل التقييمات والتعليقات بشكل افتراضي للمستخدمين غير المسجلين
        loadRatingsAndComments(workerId);
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

// حساب وعرض متوسط التقييم عند تحميل الصفحة
updateAverageRating(workerId);
