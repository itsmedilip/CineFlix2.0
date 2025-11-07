const CACHE_NAME = 'cineflix-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Note: We don't cache index.tsx directly as it's bundled.
  // The main resources are fetched via the HTML file.
  // We also won't cache external resources like Google Fonts, TailwindCSS, or the TMDb API.
  // The service worker will handle API calls by fetching from the network.
];

// Install the service worker and cache the app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercept fetch requests
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // For API calls to TMDb or other external resources, always go to the network.
  if (requestUrl.hostname === 'api.themoviedb.org' || requestUrl.hostname.endsWith('.io')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // For app assets, use a "cache-first" strategy.
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache - fetch from network
        return fetch(event.request).then(
          networkResponse => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // We don't cache POST requests
                if(event.request.method !== 'GET') return;
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        );
      })
      .catch(() => {
        // If both cache and network fail, we can show a fallback page.
        // For this app, we'll just let the browser's default offline error show.
      })
  );
});

// Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
