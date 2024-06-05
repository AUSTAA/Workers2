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
