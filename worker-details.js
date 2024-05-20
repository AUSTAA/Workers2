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

function loadRatingsAndComments(workerId) {
    // حساب وعرض متوسط التقييمات
    const ratingSection = document.getElementById('ratingSection');
    const starRating = document.getElementById('starRating');
    const averageRatingElement = document.getElementById('averageRating');

    db.collection("ratings").where("workerId", "==", workerId).get()
        .then((querySnapshot) => {
            let totalRatings = 0;
            let numberOfRatings = 0;

            querySnapshot.forEach((doc) => {
                totalRatings += doc.data().rating;
                numberOfRatings++;
            });

            const averageRating = numberOfRatings ? totalRatings / numberOfRatings : 0;
            averageRatingElement.textContent = `متوسط التقييم: ${averageRating.toFixed(2)}`;
        })
        .catch((error) => {
            console.error("Error getting ratings: ", error);
        });

    // التحقق مما إذا كان المستخدم قد قام بالتقييم مسبقًا
    auth.onAuthStateChanged((user) => {
        if (user) {
            const userId = user.uid;
            const userRatingRef = db.collection("ratings").doc(`${userId}_${workerId}`);

            userRatingRef.get().then((doc) => {
                if (doc.exists) {
                    const userRating = doc.data().rating;
                    document.querySelector(`input[name="rating"][value="${userRating}"]`).checked = true;
                    starRating.style.pointerEvents = 'none'; // منع المستخدم من التقييم مرة أخرى
                }
            });

            // إضافة حدث للتقييم
            starRating.addEventListener('change', (event) => {
                const rating = event.target.value;
                userRatingRef.set({ rating, workerId }).then(() => {
                    alert('تم إرسال التقييم بنجاح!');
                    starRating.style.pointerEvents = 'none'; // منع المستخدم من التقييم مرة أخرى
                }).catch((error) => {
                    console.error("Error submitting rating: ", error);
                });
            });
        } else {
            ratingSection.style.display = 'none';
        }
    });

    // تحميل التعليقات
    const commentsContainer = document.getElementById('commentsContainer');
    db.collection("comments").where("workerId", "==", workerId).get()
        .then((querySnapshot) => {
            commentsContainer.innerHTML = ''; // مسح المحتوى الحالي
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
        const user = firebase.auth().currentUser;
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

// تحميل التقييمات والتعليقات بمجرد تحميل الصفحة
loadRatingsAndComments(workerId);
