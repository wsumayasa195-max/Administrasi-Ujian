// Service worker: file statis dari cache dulu; panggilan ke GAS tidak pernah di-cache
const CACHE = 'ujian-smpn3-v1';
const ASET = ['./', './index.html', './css/style.css', './js/config.js', './js/api.js', './js/ui.js', './js/app.js', './js/pages.js', './js/pages2.js', './manifest.json', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASET))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.hostname.indexOf('script.google') > -1 || u.hostname.indexOf('googleusercontent') > -1 || u.hostname.indexOf('accounts.google') > -1) return;
  // jaringan dulu untuk berkas sendiri (agar update langsung terlihat), cache sebagai cadangan offline
  e.respondWith(fetch(e.request).then(r => { if (u.origin === location.origin && r.ok) { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); } return r; }).catch(() => caches.match(e.request).then(m => m || caches.match('./index.html'))));
});
