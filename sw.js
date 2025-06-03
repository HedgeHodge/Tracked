const CACHE_NAME = 'jobtrack-v1';
const urlsToCache = [
    './', // Caches the root (index.html or time_tracker.html)
    './index.html', // Explicitly cache index.html if that's your main file
    './time_tracker.html', // Or time_tracker.html if you stick to that name
    './manifest.json',
    // Tailwind CSS is loaded from CDN, so no need to cache it directly here.
    // If you were self-hosting it, you'd add its path.
    // Add any other local assets (e.g., custom CSS, JS files, images)
];

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching app shell');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('[Service Worker] Caching failed:', error);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    console.log('[Service Worker] Serving from cache:', event.request.url);
                    return response;
                }
                // No cache hit - fetch from network
                console.log('[Service Worker] Fetching from network:', event.request.url);
                return fetch(event.request);
            })
            .catch(error => {
                console.error('[Service Worker] Fetch failed:', error);
                // You could return an offline page here if needed
            })
    );
});

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
