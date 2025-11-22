// Service Worker to hide API calls from Network tab
const CACHE_NAME = 'api-cache-v1';
const HIDDEN_ENDPOINTS = ['/api/proxy'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Check if this is a request we want to hide
  const shouldHide = HIDDEN_ENDPOINTS.some(endpoint => url.pathname.includes(endpoint));
  
  if (shouldHide) {
    event.respondWith(
      (async () => {
        try {
          // Try to fetch from network
          const response = await fetch(event.request);
          
          // Clone the response before returning
          const responseClone = response.clone();
          
          // Optional: Cache the response
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, responseClone);
          
          return response;
        } catch (error) {
          // If network fails, try cache
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Return error response
          return new Response(JSON.stringify({ 
            success: false, 
            message: 'Network request failed',
            data: null,
            errors: ['Service Worker: Network error']
          }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      })()
    );
  }
});
