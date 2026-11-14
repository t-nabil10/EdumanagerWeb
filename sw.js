const V = 'edumanager-v1';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png',
  './icon-maskable-192.png', './icon-maskable-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return;
  if (u.hostname === 'api.github.com') return;               // sauvegarde GitHub : jamais en cache
  if (r.mode === 'navigate') {                               // page : réseau d'abord, cache hors ligne
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(V).then(x => x.put('./index.html', c)); return res; })
      .catch(() => caches.match('./index.html').then(m => m || caches.match('./'))));
    return;
  }
  if (u.origin === location.origin) {                        // fichiers de l'app : cache puis mise à jour
    e.respondWith(caches.match(r).then(m => {
      const net = fetch(r).then(res => { if (res.ok) { const c = res.clone(); caches.open(V).then(x => x.put(r, c)); } return res; }).catch(() => m);
      return m || net;
    }));
    return;
  }
  e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => {   // bibliothèques CDN & polices : cache d'abord
    const c = res.clone(); caches.open(V).then(x => x.put(r, c)); return res;
  }).catch(() => m)));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(l => l.length ? l[0].focus() : self.clients.openWindow('./index.html')));
});
