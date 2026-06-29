/* CoachIA — service worker (network-first, auto-update) */
const CACHE = 'coachia-v11';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (req.url.includes('supabase.co')) return;
  if (req.mode === 'navigate' || req.destination === 'document' || req.url.endsWith('/') || req.url.endsWith('index.html') || req.url.endsWith('sw.js')) {
    e.respondWith(fetch(req).then((r) => { const c = r.clone(); caches.open(CACHE).then((ca) => ca.put(req, c)); return r; }).catch(() => caches.match(req).then((m) => m || caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(req).then((c) => c || fetch(req).then((r) => { const cp = r.clone(); if (r.ok) caches.open(CACHE).then((ca) => ca.put(req, cp)); return r; })));
});
