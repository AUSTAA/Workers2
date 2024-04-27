// الحصول على بيانات المستخدم من Firebase Authentication
const user = firebase.auth().currentUser;

if (user) {
    // إذا كان المستخدم مسجل الدخول، قم بعرض بياناته الشخصية
    document.getElementById('name').textContent = user.displayName;
    document.getElementById('email').textContent = user.email;
    // يمكنك إضافة مزيد من بيانات المستخدم هنا مثل الصورة الشخصية إذا كانت متاحة
} else {
    // إذا لم يكن المستخدم مسجل الدخول، قم بتوجيهه إلى صفحة تسجيل الدخول
    window.location.href = 'login.html';
}

// إضافة إستماع لزر تسجيل الخروج
document.getElementById('logout').addEventListener('click', function() {
    // تسجيل الخروج من Firebase Authentication
    firebase.auth().signOut().then(function() {
        // بنجاح
        console.log('تم تسجيل الخروج بنجاح');
        // قم بتوجيه المستخدم إلى صفحة تسجيل الدخول
        window.location.href = 'login.html';
    }).catch(function(error) {
        // في حالة وجود خطأ، قم بطباعته في وحدة التحكم
        console.error('حدث خطأ أثناء تسجيل الخروج:', error);
    });
});
