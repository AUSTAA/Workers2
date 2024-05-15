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

// جلب معرّف النجار من عنوان URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const workerId = getQueryParam('id');

function displayWorkerDetails(userData) {
    document.getElementById('username').textContent = `اسم المستخدم: ${userData.username}`;
    document.getElementById('city').textContent = `المدينة: ${userData.city}`;
    document.getElementById('profession').textContent = `المهنة: ${userData.profession}`;
    if (auth.currentUser) {
        document.querySelector('.additional-info').style.display = 'block';
        document.getElementById('phone').textContent = `رقم الهاتف: ${userData.phone}`;
        document.getElementById('newPhone').textContent = `رقم الهاتف الجديد: ${userData.newPhone}`;
        document.getElementById('nationality').textContent = `الجنسية: ${userData.nationality}`;
        document.getElementById('experienceYears').textContent = `سنين الخبرة: ${userData.experienceYears}`;
        document.getElementById('age').textContent = `العمر: ${userData.age}`;
    }
}

function displayAverageRating(ratings) {
    const starAverage = document.getElementById('star-average');
    starAverage.innerHTML = ''; // تفريغ المحتوى الحالي
    if (ratings.length > 0) {
        const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / ratings.length;
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.textContent = '☆';
            if (i <= Math.round(averageRating)) {
                star.style.color = '#f90';
            } else {
                star.style.color = '#ccc';
            }
            starAverage.appendChild(star);
        }
    } else {
        starAverage.textContent = 'لا توجد تقييمات بعد.';
    }
}

if (workerId) {
    // جلب تفاصيل النجار من Firestore باستخدام المعرّف
    db.collection("users").doc(workerId).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                displayWorkerDetails(userData);
                if (userData.ratings) {
                    displayAverageRating(userData.ratings);
                }
            } else {
                document.getElementById('worker-details').innerHTML = "<p>لم يتم العثور على تفاصيل النجار.</p>";
            }
        })
        .catch((error) => {
            document.getElementById('worker-details').innerHTML = "<p>حدث خطأ أثناء جلب تفاصيل النجار. الرجاء المحاولة لاحقًا.</p>";
            console.error("Error fetching worker details: ", error);
        });
} else {
    document.getElementById('worker-details').innerHTML = "<p>معرّف النجار غير موجود في عنوان URL.</p>";
}

// التحقق من تسجيل الدخول
auth.onAuthStateChanged((user) => {
    if (user) {
        const ratingForm = document.getElementById('rating-form');
        
        // التحقق مما إذا كان المستخدم قد قيم النجار من قبل
        db.collection("users").doc(workerId).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    const hasRated = userData.ratings && userData.ratings.some(r => r.userId === user.uid);
                    if (!hasRated) {
                        ratingForm.style.display = 'block';
                    } else {
                        ratingForm.innerHTML = "<p>لقد قمت بتقييم هذا النجار من قبل.</p>";
                    }
                }
            })
            .catch((error) => {
                console.error("Error checking if user has rated: ", error);
            });
    }
});

// إرسال التقييم
document.getElementById('submit-rating').addEventListener('submit', function (event) {
    event.preventDefault();
    const rating = document.querySelector('input[name="rating"]:checked').value;
    const currentUser = auth.currentUser;
    
    if (currentUser) {
        db.collection("users").doc(workerId).update({
            ratings: firebase.firestore.FieldValue.arrayUnion({
                userId: currentUser.uid,
                rating: parseInt(rating, 10)
            })
        }).then(() => {
            alert("تم إرسال التقييم بنجاح.");
            window.location.reload();
        }).catch((error) => {
            console.error("Error submitting rating: ", error);
        });
    } else {
        alert("يجب تسجيل الدخول لتقديم التقييم.");
    }
});
