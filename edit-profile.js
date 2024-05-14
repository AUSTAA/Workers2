const firebaseConfig = {
    apiKey: "AIzaSyB7YJhtaefEPc9NMzhTBjQC06WmSEja0xc",
    authDomain: "omran-16f44.firebaseapp.com",
    projectId: "omran-16f44",
    storageBucket: "omran-16f44.appspot.com",
    messagingSenderId: "598982209417",
    appId: "1:598982209417:web:dc9cbddd485a1ea52bbb58"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// جلب بيانات المستخدم عند تحميل الصفحة
auth.onAuthStateChanged((user) => {
    if (user) {
        const userId = user.uid;
        const userDocRef = db.collection('users').doc(userId);

        userDocRef.get().then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                document.getElementById('username').value = userData.username || '';
                document.getElementById('phone').value = userData.phone || '';
                document.getElementById('nationality').value = userData.nationality || '';
                document.getElementById('city').value = userData.city || '';
                document.getElementById('experienceYears').value = userData.experienceYears || '';
                document.getElementById('age').value = userData.age || '';
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.error("Error getting document:", error);
        });
    } else {
        console.log("User is not signed in");
        window.location.href = 'registration.html'; // إعادة توجيه المستخدم إذا لم يكن مسجلاً الدخول
    }
});

// تحديث بيانات المستخدم عند حفظ التعديلات
document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const newPhone = document.getElementById('newPhone').value;
    const nationality = document.getElementById('nationality').value;
    const city = document.getElementById('city').value;
    const experienceYears = document.getElementById('experienceYears').value;
    const age = document.getElementById('age').value;

    const user = auth.currentUser;
    if (user) {
        const userId = user.uid;
        const userDocRef = db.collection('users').doc(userId);

        const updatedData = {
            username,
            nationality,
            city,
            experienceYears,
            age
        };

        if (newPhone) {
            updatedData.newPhone = newPhone;
        }

        try {
            // تحديث البيانات في Firestore
            await userDocRef.set(updatedData, { merge: true });

            // تحديث الصور
            const profilePictureFile = document.getElementById('profilePicture').files[0];
            const serviceImagesFiles = document.getElementById('serviceImages').files;

            if (profilePictureFile) {
                const profilePictureRef = storage.ref().child(`users/${userId}/profilePicture.jpg`);
                await profilePictureRef.put(profilePictureFile);
            }

            if (serviceImagesFiles.length > 0) {
                for (let i = 0; i < serviceImagesFiles.length; i++) {
                    const serviceImageRef = storage.ref().child(`users/${userId}/serviceImages/${serviceImagesFiles[i].name}`);
                    await serviceImageRef.put(serviceImagesFiles[i]);
                }
            }

            // عرض رسالة تأكيد
            alert('تم تحديث البيانات بنجاح');

            // إعادة توجيه المستخدم إلى صفحته الشخصية
            window.location.href = `profile.html`;
        } catch (error) {
            console.error("Error updating document:", error);
            alert('حدث خطأ أثناء تحديث البيانات');
        }
    } else {
        console.log("User is not signed in");
        window.location.href = 'registration.html'; // إعادة توجيه المستخدم إذا لم يكن مسجلاً الدخول
    }
});

// زر للعودة إلى الصفحة الرئيسية
document.getElementById('homeButton').addEventListener('click', () => {
    window.location.href = 'index.html';
});
