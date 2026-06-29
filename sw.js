/* CoachIA — service worker */
const CACHE = 'coachia-v9';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => { const req = e.request; if (req.method !== 'GET') return; if (req.url.includes('supabase.co')) return; e.respondWith(caches.match(req).then((cached) => cached || fetch(req).then((resp) => { const copy = resp.clone(); if (resp.ok) caches.open(CACHE).then((c) => c.put(req, copy)); return resp; }).catch(() => caches.match('./index.html')))); });
