const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/script/main.js'
];

// تثبيت الـ Service Worker والاحتفاظ بالملفات في الـ Cache
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// التعامل مع الطلبات وجلبها من الـ Cache أولاً ثم من الشبكة إذا لم تكن موجودة في الـ Cache
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // إرجاع الاستجابة من الـ Cache إذا كانت موجودة
        if (response) {
          return response;
        }

        // إذا لم تكن الاستجابة في الـ Cache، جلبها من الشبكة
        return fetch(event.request).catch(function() {
          // يمكن هنا إضافة fallback page أو شيء آخر عند عدم توفر الشبكة
          return caches.match('/offline.html');
        });
      })
  );
});

// تفعيل الـ Service Worker وتنظيف الـ Cache القديمة
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// تسجيل المزامنة الخلفية
self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

function syncData() {
  return new Promise((resolve, reject) => {
    // تنفيذ مهام المزامنة هنا
    fetch('/api/sync', {
      method: 'POST',
      body: JSON.stringify(getPendingData()),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
      .then(data => {
        clearPendingData(); // مسح البيانات المعلقة بعد المزامنة الناجحة
        resolve();
      })
      .catch(error => {
        reject();
      });
  });
}

// المزامنة الدورية لتحديث التطبيق
self.addEventListener('periodicsync', function(event) {
  if (event.tag === 'content-sync') {
    event.waitUntil(updateContent());
  }
});

function updateContent() {
  return caches.open(CACHE_NAME).then(function(cache) {
    return fetch('/api/update-content')
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        // تحديث المحتوى هنا
        return cache.put('/data/content', new Response(JSON.stringify(data)));
      });
  });
}

// إعدادات Firebase للإشعارات
importScripts('https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.8/firebase-messaging.js');

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

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  const notificationTitle = 'New message from your app';
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/Workers2/icon-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
