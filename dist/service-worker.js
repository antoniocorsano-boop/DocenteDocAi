const CACHE_NAME = 'docentedoc-ai-v48'; 

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  // Be tolerant to failures when precaching (e.g., during local dev or offline)
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch(err => {
        // Do not fail install if precache fails (dev or network issues).
        console.warn('[SW] cache.addAll failed (dev/offline):', err);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Purgaging both old 'orariodoc' and previous 'docentedoc' caches
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Purgaging legacy cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;
      return fetch(event.request).catch(err => {
        // Network unavailable or resource unreachable: fall back to cached '/' (if present) or return an error-like response
        console.warn('[SW] network fetch failed:', event.request.url, err);
        return caches.match('./').then(fallback => fallback || new Response('', { status: 504, statusText: 'Gateway Timeout' }));
      });
    })
  );
});