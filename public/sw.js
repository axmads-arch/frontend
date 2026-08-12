const CACHE = 'rc-v2'; // versiya oshirildi — eski keshni majburan tozalaydi
const ASSETS = ['/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('/api/')) return;

  // HTML sahifa so'rovlari (navigatsiya) — HECH QACHON keshdan olinmaydi,
  // doim tarmoqdan yangi versiya so'raladi. Shu orqali "eski deploy ko'rinishi" muammosi butunlay yo'qoladi.
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Boshqa fayllar (rasm, css, js) — tarmoq birinchi, keshga zaxira sifatida
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

// Push notification
self.addEventListener('push', e => {
  const data = e.data?.json() || {};
  e.waitUntil(
    self.registration.showNotification(data.title || 'Rahmat Chef', {
      body: data.body || 'Yangi xabar',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [200, 100, 200],
      data: { url: data.url || '/' },
      actions: [
        { action: 'open', title: 'Ochish' },
        { action: 'close', title: 'Yopish' },
      ],
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'close') return;
  e.waitUntil(clients.openWindow(e.notification.data?.url || '/'));
});
