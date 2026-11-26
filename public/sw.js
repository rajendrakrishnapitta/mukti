const CACHE = "mukti-portraits-v8";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key.startsWith("mukti-static-") || (
          key.startsWith("mukti-portraits-") && key !== CACHE
        )).map((key) => caches.delete(key)),
      ),
    ).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  // Let the browser fetch the current HTML and its matching build assets.
  if (
    request.method !== "GET" ||
    request.mode === "navigate" ||
    url.origin !== self.location.origin ||
    !url.pathname.startsWith("/philosophers/")
  ) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  })());
});
