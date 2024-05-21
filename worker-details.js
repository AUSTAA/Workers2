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
    if (half) {
        star.innerHTML = '<span style="color: gold; position: absolute;">&#9733;</span>' +
                         '<span style="color: gray; padding-left: 12px;">&#9733;</span>';
    } else {
        star.innerHTML = '&#9733;';  // نجمة ممتلئة
    }
    star.style.color = filled ? 'gold' : 'gray';
    star.style.fontSize = '24px'; // حجم النجمة
    star.style.margin = '2px';    // تباعد بين النجوم
    star.style.position = half ? 'relative' : 'static';
    return star;
}

// دالة لعرض التقييم بالنجوم
function displayRatingStars(averageRating) {
    const starRatingDisplay = document.getElementById('averageRating');
    starRatingDisplay.innerHTML = ''; // مسح المحتوى السابق

    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(averageRating)) {
            starRatingDisplay.appendChild(createStar(true));
        } else if (i === Math.ceil(averageRating) && averageRating % 1 !== 0) {
            starRatingDisplay.appendChild(createStar(true, true)); // نصف نجمة
        } else {
            starRatingDisplay.appendChild(createStar(false));
        }
    }
}

// حساب متوسط عدد النجوم بالوزن المناسب
function calculateWeightedAverage(ratings) {
    let totalStars = 0;
    let ratingCount = 0;

    ratings.forEach(rating => {
        totalStars += rating;
        ratingCount++;
    });

    return ratingCount ? totalStars / ratingCount : 0;
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

            // حساب متوسط عدد النجوم
            db.collection("ratings").where("workerId", "==", workerId).get()
                .then((querySnapshot) => {
                    const ratings = [];
                    querySnapshot.forEach((doc) => {
                        ratings.push(doc.data().rating);
                    });

                    const averageRating = calculateWeightedAverage(ratings);
                    displayRatingStars(averageRating); // عرض التقييم المتوسط كعدد من النجوم
                })
                .catch((error) => {
                    console.error("Error getting ratings: ", error);
                });

        } else {
            ratingSection.style.display = 'none';
        }
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
        if (comment && auth.currentUser) {
            const commentData = {
                workerId,
                username: auth.currentUser.displayName || auth.currentUser.email,
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
        } else if (!auth.currentUser) {
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
