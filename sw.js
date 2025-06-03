const CACHE_NAME = 'jobtrack-v1.1'; // Increment cache version to ensure new SW is installed
const urlsToCache = [
    './',
    './index.html', // Or time_tracker.html if that's your main file
    './manifest.json',
    './sw.js', // Cache the service worker itself
    'https://cdn.tailwindcss.com', // Explicitly cache Tailwind CSS
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap', // Google Fonts CSS
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
                if (response) {
                    console.log('[Service Worker] Serving from cache:', event.request.url);
                    return response;
                }
                console.log('[Service Worker] Fetching from network:', event.request.url);
                return fetch(event.request);
            })
            .catch(error => {
                console.error('[Service Worker] Fetch failed for:', event.request.url, error);
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
