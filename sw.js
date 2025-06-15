const cacheDB = "PWA-App";
const filesToCache = [
  "/index.html",
  "/pages/page1.html",
  "/pages/page2.html",
  "/pages/404.html",
  "/pages/offline.html",
  "/CSS/style.css",
  "/CSS/page1.css",
  "/CSS/page2.css",
  "/CSS/404.css",
  "/CSS/offline.css",
  "/JS/main.js",
  "/assets/manifest.json",
  "/assets/anger-512x512.png",
];

// 1. Install
self.addEventListener("install", (event) => {
  console.log("Installing Service Worker...");
  event.waitUntil(
    caches.open(cacheDB).then((cache) => {
      console.log("Caching essential files...");
      return cache.addAll(filesToCache);
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
          return caches.match("/404.html");
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

          return caches.match("/404.html");
        });
      })
  );
});
