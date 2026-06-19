/*
 * TermuxHub service-worker.js
 * Enables full offline-ready PWA asset caching
 */

const CACHE_NAME = 'termuxhub-v1.2.0';
const ASSETS_TO_CACHE = [
    'index.html',
    'style.css',
    'script.js',
    'manifest.json',
    'data/categories.json',
    'data/tools.json',
    'firebase/firebase-config.js',
    'firebase/auth.js',
    'firebase/firestore.js',
    'components/navbar.js',
    'components/searchbar.js',
    'components/categoryCard.js',
    'components/toolCard.js',
    'components/button.js',
    'components/modal.js',
    'pages/splash.html',
    'pages/disclaimer.html',
    'pages/login.html',
    'pages/home.html',
    'pages/category.html',
    'pages/tool.html',
    'pages/favorites.html',
    'pages/settings.html',
    'pages/about.html'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('SW: Pre-caching Core Application Shell Assets.');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheKeys => {
            return Promise.all(
                cacheKeys.map(key => {
                    if (key !== CACHE_NAME) {
                        console.log('SW: Clearing cached stale references: ', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    // Only intercept local assets or http file streams, bypass CDN or foreign origins
    const requestUrl = new URL(event.request.url);
    if (requestUrl.origin !== self.location.origin) {
        return; 
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                return fetch(event.request)
                    .then(response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Dynamically populate cache with newly fetched files
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                            
                        return response;
                    })
                    .catch(() => {
                        // Fallback response if fetch completely fails offline
                        return caches.match('index.html');
                    });
            })
    );
});
