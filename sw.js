// Bump CACHE on every deploy so the activate handler purges the old cache and
// the app picks up new code. (v1 never changed, so app.js/style.css updates were
// permanently trapped behind cache-first.)
const CACHE = 'study-gantt-v4';
const ASSETS = [
  '.',
  'index.html',
  'style.css',
  'app.js',
  'manifest.json',
  'public/schedule.md',
];

// Core assets that must reflect the latest deploy when online.
// Everything else (icons, etc.) stays cache-first for offline speed.
function isNetworkFirst(url) {
  return url.includes('schedule.md')
    || url.endsWith('app.js')
    || url.endsWith('style.css')
    || url.endsWith('index.html')
    || url.endsWith('/');
}

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  // Network first for core assets + schedule.md: fetch fresh, cache on success,
  // fall back to cache only when offline.
  if (isNetworkFirst(url)) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }
  // Cache first for the rest.
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
