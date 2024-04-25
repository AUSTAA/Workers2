/* script.js */
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginContainer = document.getElementById('login-container');
    const servicesContainer = document.getElementById('services-container');
    const cityFilter = document.getElementById('city-filter');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // هنا يمكنك إضافة الكود للتحقق من اسم المستخدم وكلمة المرور وتوجيه المستخدم
        if (username === 'علي' && password === '123456') {
            loginContainer.style.display = 'none'; // إخفاء واجهة تسجيل الدخول
            servicesContainer.style.display = 'block'; // عرض واجهة الخدمات
            cityFilter.style.display = 'block'; // عرض عنصر فرز المدينة
        } else {
            alert('خطأ في اسم المستخدم أو كلمة المرور. هل نسيت كلمة المرور؟');
        }
    });
});
