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

        userDocRef.get().then(async (doc) => {
            if (doc.exists) {
                const userData = doc.data();
                document.getElementById('username').value = userData.username || '';
                document.getElementById('phone').value = userData.phone || '';
                document.getElementById('nationality').value = userData.nationality || '';
                document.getElementById('city').value = userData.city || '';
                document.getElementById('experienceYears').value = userData.experienceYears || '';
                document.getElementById('age').value = userData.age || '';
                document.getElementById('profession').value = userData.profession || '';
                document.getElementById('facebook-link').value = userData.facebookLink || '';

                // تحميل الصورة الشخصية
                const profilePictureRef = storage.ref().child(`users/${userId}/profilePicture.jpg`);
                try {
                    const profilePictureUrl = await profilePictureRef.getDownloadURL();
                    document.getElementById('profilePictureDisplay').src = profilePictureUrl;
                } catch (error) {
                    console.log("No profile picture found");
                }

                // إعداد أزرار الحذف والتغيير
                document.getElementById('deleteProfilePictureButton').addEventListener('click', async () => {
                    if (confirm('هل أنت متأكد من أنك تريد حذف الصورة الشخصية؟')) {
                        try {
                            await profilePictureRef.delete();
                            document.getElementById('profilePictureDisplay').src = '';
                            console.log('تم حذف الصورة الشخصية بنجاح');
                        } catch (error) {
                            console.error('حدث خطأ أثناء حذف الصورة الشخصية:', error);
                        }
                    }
                });

                document.getElementById('changeProfilePictureButton').addEventListener('click', () => {
                    document.getElementById('newProfilePicture').click();
                });

                document.getElementById('newProfilePicture').addEventListener('change', (event) => {
                    const file = event.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            document.getElementById('profilePictureDisplay').src = e.target.result;
                        };
                        reader.readAsDataURL(file);
                    }
                });

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
    const phone = document.getElementById('phone').value;
    const newPhone = document.getElementById('newPhone').value;
    const nationality = document.getElementById('nationality').value;
    const city = document.getElementById('city').value;
    const experienceYears = document.getElementById('experienceYears').value;
    const age = document.getElementById('age').value;
    const profession = document.getElementById('profession').value;
    const facebookLink = document.getElementById('facebook-link').value;

    const user = auth.currentUser;
    if (user) {
        const userId = user.uid;
        const userDocRef = db.collection('users').doc(userId);

        const updatedData = {
            username,
            phone,
            nationality,
            city,
            experienceYears,
            age,
            profession,
            facebookLink
        };

        if (newPhone) {
            updatedData.newPhone = newPhone;
        }

        try {
            // تحديث البيانات في Firestore
            await userDocRef.set(updatedData, { merge: true });

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
