// This is the "Offline page" service worker

// importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
//
// const CACHE = "pwabuilder-page";
// const offlineFallbackPage = "index.html";
//
// self.addEventListener("message", (event) => {
//     if (event.data && event.data.type === "SKIP_WAITING") {
//         self.skipWaiting();
//     }
// });
//
// self.addEventListener('install', async (event) => {
//     event.waitUntil(
//         caches.open(CACHE)
//             .then((cache) => cache.add(offlineFallbackPage))
//     );
// });
//
// if (workbox.navigationPreload.isSupported()) {
//     workbox.navigationPreload.enable();
// }

const cacheName = 'v1';
const offlineFallbackPage = 'index.html';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => cache.addAll([
                offlineFallbackPage,
                'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
                '/img/manifest-icon-512.maskable.png'
            ]))
    );
});

self.addEventListener('message', function (event) {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});

self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith(/*(async () => {
            try {
                return ((preloadResp = await event.preloadResponse) && preloadResp)
                    ? preloadResp
                    : await fetch(event.request);
            } catch (error) {
                const cache = await caches.open(CACHE);
                return await cache.match(offlineFallbackPage);
            }
        })()*/
            caches.match(event.request)
                .then(function (response) {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                })
        );
    }
});