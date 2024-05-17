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
                        serviceImagesContainer.appendChild(img);
                    }).catch((error) => {
                        console.error("Error getting service image:", error);
                    });
                });
            }).catch((error) => {
                console.error("Error getting service images:", error);
            });

            // تحميل التقييمات والتعليقات
            loadRatingsAndComments(workerId);
        } else {
            console.log("No such document!");
        }
    })
    .catch((error) => {
        console.error("Error getting document:", error);
    });

// تحميل التقييمات والتعليقات
function loadRatingsAndComments(workerId) {
    const ratingsRef = db.collection("ratings").doc(workerId);
    ratingsRef.get().then((doc) => {
        if (doc.exists) {
            const ratingData = doc.data();
            const starRating = document.getElementById('starRating');
            if (ratingData.rating) {
                const rating = ratingData.rating;
                document.querySelector(`input[name="rating"][value="${rating}"]`).checked = true;
            }
            if (ratingData.comments) {
                const commentsContainer = document.getElementById('commentsContainer');
                commentsContainer.innerHTML = '';
                ratingData.comments.forEach((comment) => {
                    const commentDiv = document.createElement('div');
                    commentDiv.textContent = comment;
                    commentsContainer.appendChild(commentDiv);
                });
            }
        }
    }).catch((error) => {
        console.error("Error getting ratings and comments:", error);
    });
}

// تسجيل التقييم والتعليقات
const ratingInputs = document.querySelectorAll('input[name="rating"]');
ratingInputs.forEach((input) => {
    input.addEventListener('change', () => {
        const selectedRating = document.querySelector('input[name="rating"]:checked').value;
        const user = auth.currentUser;
        if (user) {
            const ratingsRef = db.collection("ratings").doc(workerId);
            ratingsRef.set({
                rating: parseInt(selectedRating),
            }, { merge: true }).then(() => {
                alert('تم تسجيل تقييمك بنجاح');
            }).catch((error) => {
                console.error("Error saving rating:", error);
            });
        } else {
            alert('يجب تسجيل الدخول لتقييم العامل');
            document.getElementById('authButton').click();
        }
    });
});

document.getElementById('submitComment').addEventListener('click', () => {
    const commentInput = document.getElementById('commentInput').value.trim();
    if (commentInput) {
        const user = auth.currentUser;
        if (user) {
            const ratingsRef = db.collection("ratings").doc(workerId);
            ratingsRef.update({
                comments: firebase.firestore.FieldValue.arrayUnion(commentInput)
            }).then(() => {
                loadRatingsAndComments(workerId);
                document.getElementById('commentInput').value = '';
                alert('تم تسجيل تعليقك بنجاح');
            }).catch((error) => {
                console.error("Error saving comment:", error);
            });
        } else {
            alert('يجب تسجيل الدخول لكتابة تعليق');
            document.getElementById('authButton').click();
        }
    }
});

// أزرار التنقل
document.getElementById('backButton').addEventListener('click', () => {
    window.history.back();
});

document.getElementById('homeButton').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// زر تسجيل الدخول / حساب جديد
document.getElementById('authButton').addEventListener('click', () => {
    window.location.href = 'registration.html';
});
