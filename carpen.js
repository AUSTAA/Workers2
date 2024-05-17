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

// جلب بيانات النجارين من Firestore
function loadCarpenters() {
    const workerList = document.getElementById('worker-list');
    workerList.innerHTML = ""; // تفريغ القائمة قبل بدء التحميل

    db.collection("users").where("profession", "==", "نجار").get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                workerList.innerHTML = "<p>لا يوجد نجارين متاحين في الوقت الحالي.</p>";
            } else {
                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    const li = document.createElement('li');
                    li.classList.add('worker-box');
                    li.innerHTML = `
                        <img src="${userData.image}" alt="${userData.username}">
                        <h3>${userData.username}</h3>
                        <p>المدينة: ${userData.city}</p>
                        <p>سنين الخبرة: ${userData.experienceYears}</p>
                        <p><a href="worker-details.html?id=${doc.id}" class="details-link">تفاصيل</a></p>
                    `;
                    workerList.appendChild(li);
                });
            }
        })
        .catch((error) => {
            workerList.innerHTML = "<p>حدث خطأ أثناء جلب بيانات النجارين. الرجاء المحاولة لاحقًا.</p>";
            console.error("Error fetching carpenters: ", error);
        });
}

// عرض أو إخفاء التصنيفات عند النقر على الزر
const menuButton = document.getElementById('menuButton');
const categoriesMenu = document.getElementById('categoriesMenu');

menuButton.addEventListener('click', () => {
    categoriesMenu.style.display = categoriesMenu.style.display === 'block' ? 'none' : 'block';
});

// تحميل النجارين عند تحميل الصفحة
window.onload = loadCarpenters;
