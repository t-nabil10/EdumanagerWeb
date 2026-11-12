/* EduManager — service worker : fonctionne hors connexion après la première visite. */
const V='edumanager-v1';
const CORE=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png','icons/favicon-32.png','icons/favicon.svg'];
const CDN=[
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
];
self.addEventListener('install',e=>{e.waitUntil((async()=>{
  const c=await caches.open(V);
  await c.addAll(CORE);
  /* bibliothèques Excel / PDF / ZIP : mises en cache pour le mode hors connexion (échec toléré) */
  await Promise.all(CDN.map(u=>c.add(new Request(u,{mode:'no-cors'})).catch(()=>{})));
  await self.skipWaiting();
})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{
  for(const k of await caches.keys())if(k!==V)await caches.delete(k);
  await self.clients.claim();
})())});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.hostname==='api.github.com')return;           /* jamais de cache pour l'API GitHub */
  if(r.mode==='navigate'){                                              /* page : réseau d'abord, cache si hors ligne */
    e.respondWith(fetch(r).then(x=>{const k=x.clone();caches.open(V).then(c=>c.put('index.html',k));return x}).catch(()=>caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{               /* reste : cache d'abord, puis réseau */
    if(x&&(x.ok||x.type==='opaque')){const k=x.clone();caches.open(V).then(c=>c.put(r,k))}
    return x;
  })));
});
