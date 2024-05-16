const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
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
let displayedCommentsCount = 0;
const commentsPerPage = 3;

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

function displayPhotos(photos) {
    const photosContainer = document.getElementById('photos-container');
    photosContainer.innerHTML = ''; // تفريغ المحتوى الحالي
    if (photos && photos.length > 0) {
        photos.forEach(photoUrl => {
            const img = document.createElement('img');
            img.src = photoUrl;
            img.alt = 'صورة من أعمال النجار';
            img.style.width = '100px';
            img.style.height = '100px';
            img.style.margin = '5px';
            img.style.cursor = 'pointer';
            img.onclick = () => window.open(photoUrl, '_blank');
            photosContainer.appendChild(img);
        });
    } else {
        photosContainer.textContent = 'لا توجد صور بعد.';
    }
}

// جلب تعليقات العملاء
function displayComments(comments) {
    const commentsContainer = document.getElementById('comments-container');
    commentsContainer.innerHTML = ''; // تفريغ المحتوى الحالي
    const initialComments = comments.slice(0, commentsPerPage);
    initialComments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        commentDiv.textContent = comment.text;
        commentsContainer.appendChild(commentDiv);
    });

    displayedCommentsCount = initialComments.length;

    if (comments.length > displayedCommentsCount) {
        document.getElementById('load-more-comments').style.display = 'block';
    }
}

document.getElementById('load-more-comments').addEventListener('click', function() {
    db.collection("users").doc(workerId).get().then((doc) => {
        if (doc.exists) {
            const userData = doc.data();
            const comments = userData.comments || [];
            const moreComments = comments.slice(displayedCommentsCount, displayedCommentsCount + commentsPerPage);
            moreComments.forEach(comment => {
                const commentDiv = document.createElement('div');
                commentDiv.className = 'comment';
                commentDiv.textContent = comment.text;
                document.getElementById('comments-container').appendChild(commentDiv);
            });

            displayedCommentsCount += moreComments.length;

            if (displayedCommentsCount >= comments.length) {
                document.getElementById('load-more-comments').style.display = 'none';
            }
        }
    }).catch((error) => {
        console.error("Error loading more comments: ", error);
    });
});

// عرض تفاصيل العامل
if (workerId) {
    db.collection("users").doc(workerId).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                displayWorkerDetails(userData);
                if (userData.ratings) {
                    displayAverageRating(userData.ratings);
                }
                if (userData.serviceImages) {
                    // عرض الصور المتعلقة بالخدمات
                    displayPhotos(userData.serviceImages);
                }
                if (userData.profilePicture) {
                    // عرض صورة الملف الشخصي
                    document.getElementById('profilePicture').src = userData.profilePicture;
                }
                if (userData.comments) {
                    displayComments(userData.comments);
                }
            } else {
                document.getElementById('worker-details').innerHTML = "<p>لم يتم العثور على تفاصيل النجار.</p>";
            }
        })
        .catch((error) => {
            document.getElementById('worker-details').innerHTML = "<p>حدث خطأ أثناء جلب تفاصيل النجار. الرجاء المحاولة لاحق
                ًا.</p>";
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
