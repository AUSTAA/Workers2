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

// إضافة مستمعين للأحداث للأزرار
document.getElementById('homeButton').addEventListener('click', () => {
    window.location.href = 'index.html'; // قم بتغيير 'index.html' إلى رابط الصفحة الرئيسية الفعلي
});

document.getElementById('backButton').addEventListener('click', () => {
    window.history.back();
});


// تحديد الـ ID من عنوان URL
const workerId = getWorkerIdFromUrl(window.location.href);

// دالة للحصول على الـ ID من عنوان URL
function getWorkerIdFromUrl(url) {
    const queryString = url.split('?')[1];
    const params = new URLSearchParams(queryString);
    return params.get('id');
}

// دالة لإنشاء نجمة معينة
function createStar(filled) {
    const starContainer = document.createElement('div');
    starContainer.style.display = 'flex'; // لتمكين عرض الزر والنجوم في نفس السطر
    const star = document.createElement('span');
    star.textContent = '★';
    star.style.color = filled ? 'gold' : 'gray';
    starContainer.appendChild(star);
    
    // إنشاء زر "إرسال التقييم"
    const submitRatingButton = document.createElement('button');
    submitRatingButton.textContent = 'إرسال التقييم';
    submitRatingButton.id = 'submitRating';
    submitRatingButton.style.marginLeft = '5px'; // تحديد تباعد بين الزر والنجوم
    submitRatingButton.style.display = 'none'; // بدايةً يتم إخفاء الزر

    // إضافة حدث النقر إلى الزر
    submitRatingButton.addEventListener('click', () => {
        // إرسال التقييم هنا
    });

    starContainer.appendChild(submitRatingButton);

    return starContainer;
}

// دالة لعرض التقييم بالنجوم
function displayRatingStars(averageRating) {
    const starRatingDisplay = document.getElementById('averageRating');
    starRatingDisplay.innerHTML = ''; // مسح المحتوى السابق

    for (let i = 1; i <= 5; i++) {
        starRatingDisplay.appendChild(createStar(i <= averageRating));
    }
}

// جلب بيانات العامل باستخدام الـ ID
db.collection("users").doc(workerId).get()
    .then((doc) => {
        if (doc.exists) {
            const workerData = doc.data();
            document.getElementById('workerName').textContent = `الاسم: ${workerData.username}`;
            document.getElementById('workerPhone').innerHTML = `رقم الهاتف: <a href="tel:${workerData.phone}">${workerData.phone}</a>`;
            document.getElementById('workerNewPhone').innerHTML = `رقم الهاتف الجديد: <a href="tel:${workerData.newPhone}">${workerData.newPhone}</a>`;
            document.getElementById('workerNationality').textContent = `الجنسية: ${workerData.nationality}`;
            document.getElementById('workerCity').textContent = `المدينة: ${workerData.city}`;
            document.getElementById('workerExperienceYears').textContent = `عدد سنين الخبرة: ${workerData.experienceYears}`;
            document.getElementById('workerAge').textContent = `العمر: ${workerData.age}`;
            document.getElementById('workerProfession').textContent = `المهنة: ${workerData.profession}`;

            // عرض رابط الفيسبوك
            const facebookLink = workerData.facebookLink;
            if (facebookLink) {
                const facebookLinkElement = document.getElementById('facebookLink');
                facebookLinkElement.href = facebookLink;
                facebookLinkElement.style.display = 'block'; // إظهار الرابط
            }

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

            // إنشاء الزر لإرسال التقييم
const sendRatingButton = document.createElement('button');
sendRatingButton.textContent = 'إرسال التقييم';
sendRatingButton.id = 'sendRatingButton'; // تعيين هوية للزر
sendRatingButton.style.marginRight = '10px'; // تعيين هامش للزر
sendRatingButton.style.display = 'none'; // إخفاء الزر في البداية

// إضافة مستمع للنقر على الزر
sendRatingButton.addEventListener('click', () => {
    const selectedRating = parseInt(starRating.value); // الحصول على التقييم المختار
    if (selectedRating) {
        // إرسال التقييم إلى قاعدة البيانات أو اتخاذ الإجراء المناسب
        console.log('Rating sent:', selectedRating);
        // قم بإخفاء الزر بعد إرسال التقييم
        sendRatingButton.style.display = 'none';
    } else {
        alert('يرجى تحديد التقييم أولاً!');
    }
});

// إضافة الزر إلى الصفحة بجوار مجموعة النجوم
const starRatingContainer = document.getElementById('starRatingContainer');
starRatingContainer.appendChild(sendRatingButton);

// إضافة مستمع للتغيير في قيمة النجوم
starRating.addEventListener('change', () => {
    // عرض الزر إذا تم تحديد تقييم
    sendRatingButton.style.display = 'block';
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
                    let totalStars = 0;
                    let ratingCount = 0;

                    querySnapshot.forEach((doc) => {
                        totalStars += doc.data().rating;
                        ratingCount++;
                    });

                    const averageStars = ratingCount ? (totalStars / ratingCount) : 0;
                    displayRatingStars(Math.round(averageStars)); // عرض التقييم المتوسط كعدد من النجوم
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
    }
});
