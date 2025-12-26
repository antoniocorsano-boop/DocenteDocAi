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
    caches.open(CACHE_NAME).then(async (cache) => {
      // Fetch each resource and cache individually; ignore failures per-resource
      const results = await Promise.allSettled(
        urlsToCache.map(async (url) => {
          try {
            const res = await fetch(url, { cache: 'no-store' });
            if (!res || !res.ok) throw new Error(`Fetch failed: ${url} (${res && res.status})`);
            await cache.put(url, res.clone());
            return { url, ok: true };
          } catch (err) {
            console.warn('[SW] precache failed for', url, err);
            return { url, ok: false, err };
          }
        })
      );
      const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && r.value && r.value.ok === false));
      if (failed.length > 0) {
        console.warn('[SW] Some precache resources failed:', failed.map(f => f.value ? f.value.url : (f.reason && f.reason.url) || String(f)));
      }
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