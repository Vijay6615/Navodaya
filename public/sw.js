/* Puja Dham Service Worker */

const CACHE_VERSION = "puja-dham-v1";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

const OFFLINE_URL = "/offline.html";

const PRECACHE_URLS = [
  OFFLINE_URL,
  "/icons/icon-192.png",
  "/icons/icon-512.jpg",
  "/icons/icon-512-maskable.jpg",
  "/Pujadhamlogo1.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) =>
        cache.addAll(PRECACHE_URLS)
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  const validCaches = new Set([
    STATIC_CACHE,
    IMAGE_CACHE,
  ]);

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName.startsWith("puja-dham-") &&
              !validCaches.has(cacheName)
            ) {
              return caches.delete(cacheName);
            }

            return Promise.resolve(false);
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (
    request.method !== "GET" ||
    request.url.startsWith("chrome-extension://")
  ) {
    return;
  }

  const url = new URL(request.url);

  // API/auth requests should always remain network-only.
  if (
    url.origin === self.location.origin &&
    (url.pathname.startsWith("/api/") ||
      url.pathname.startsWith("/_next/webpack-hmr"))
  ) {
    return;
  }

  // Page navigation: network first, offline fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache =
          await caches.open(STATIC_CACHE);

        return cache.match(OFFLINE_URL);
      })
    );

    return;
  }

  // Images: cache first, then network.
  if (
    request.destination === "image" ||
    url.hostname === "res.cloudinary.com"
  ) {
    event.respondWith(
      cacheFirst(request, IMAGE_CACHE)
    );

    return;
  }

  // Versioned Next.js assets and local static files:
  // return cache quickly and update it in background.
  if (
    url.origin === self.location.origin &&
    (
      url.pathname.startsWith("/_next/static/") ||
      request.destination === "style" ||
      request.destination === "script" ||
      request.destination === "font"
    )
  ) {
    event.respondWith(
      staleWhileRevalidate(
        request,
        STATIC_CACHE
      )
    );
  }
});

async function cacheFirst(
  request,
  cacheName
) {
  const cache = await caches.open(cacheName);
  const cachedResponse =
    await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse =
      await fetch(request);

    if (
      networkResponse &&
      (
        networkResponse.ok ||
        networkResponse.type === "opaque"
      )
    ) {
      cache.put(
        request,
        networkResponse.clone()
      );
    }

    return networkResponse;
  } catch (error) {
    if (request.destination === "image") {
      const fallback =
        await caches.match(
          "/Pujadhamlogo1.png"
        );

      if (fallback) {
        return fallback;
      }
    }

    throw error;
  }
}

async function staleWhileRevalidate(
  request,
  cacheName
) {
  const cache = await caches.open(cacheName);
  const cachedResponse =
    await cache.match(request);

  const networkPromise = fetch(request)
    .then((networkResponse) => {
      if (
        networkResponse &&
        networkResponse.ok
      ) {
        cache.put(
          request,
          networkResponse.clone()
        );
      }

      return networkResponse;
    })
    .catch(() => null);

  return (
    cachedResponse ||
    (await networkPromise) ||
    new Response("", {
      status: 504,
      statusText: "Gateway Timeout",
    })
  );
}