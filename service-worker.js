const CACHE_NAME = 'calendar-pwa-stable-v1';
const urlsToCache = [
    '/',               // корень сайта
    './index.html',    // основной HTML
    './manifest.json', // манифест PWA
    './app.js',        // JS для календаря
    './icon-192.png',  // иконки
    './icon-512.png'
];

// Установка Service Worker и кэширование ресурсов
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

// Активация Service Worker и удаление старых кэшей
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(name => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Перехват запросов и отдача из кэша с fallback на сеть
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(() => {
                // Если навигация и офлайн, возвращаем index.html
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
