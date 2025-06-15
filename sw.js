const cacheDB = "PWA-App-v3";
const urlsToCache = [
  "/",
  "/index.html",
  "/pages/page-1.html",
  "/pages/page-2.html",
  "/CSS/style.css",
  "/CSS/page-1.css",
  "/CSS/page-2.css",
  "/CSS/offline.css",
  "/JS/main.js",
  "/JS/page-1.js",
  "/JS/page-2.js",
  "/offline.html",
  "/wrongUrl.html",
  "/CSS/wrongUrl.css",
  "/pwa-logo-black-purple-modern-design-transparent-background-1.png",
  "/manifest-and-icons/manifest.json",
  "/manifest-and-icons/icon512_maskable.png",
];

// 1. Install
self.addEventListener("install", (event) => {
  console.log("Installing Service Worker...");
  event.waitUntil(
    caches.open(cacheDB).then((cache) => {
      console.log("Caching essential files...");
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// 2. Activate
self.addEventListener("activate", (event) => {
  console.log("Activating Service Worker...");
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names.map((name) => name !== cacheDB && caches.delete(name))
        )
      )
  );
  self.clients.claim();
});

// 3. Fetch
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      // online
      .then((response) => {
        if (!response || response.status === 404) {
          return caches.match("/wrongUrl.html");
        }
        return response;
      })
      .catch(() => {
        // offline
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          if (event.request.destination === "document") {
            return caches.match("/offline.html");
          }

          return caches.match("/wrongUrl.html");
        });
      })
  );
});
