/* EduManager — service worker : fichiers de l'app = réseau d'abord (mises à jour immédiates), bibliothèques CDN = cache d'abord. */
const CACHE='edumanager-v5';
const LOCAL=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./favicon-32.png','./favicon.svg','./icon-maskable-192.png','./icon-maskable-512.png'];
const CDN=[
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
];
self.addEventListener('install',e=>{
  e.waitUntil((async()=>{
    const c=await caches.open(CACHE);
    await Promise.all(LOCAL.map(u=>c.add(u).catch(()=>{})));                         /* un fichier manquant n'empêche pas l'installation */
    await Promise.all(CDN.map(u=>c.add(new Request(u,{mode:'no-cors'})).catch(()=>{})));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()));
});
function offline(){
  return new Response('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>EduManager</title><body style="font-family:system-ui;padding:24px;background:#10302f;color:#fff"><h2>Hors connexion</h2><p>Ouvrez l\u2019application une première fois avec Internet : elle fonctionnera ensuite sans connexion.</p></body>',{status:200,headers:{'Content-Type':'text/html; charset=utf-8'}});
}
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.hostname==='api.github.com')return;                         /* jamais de cache pour l'API GitHub */
  const store=res=>{if(res&&(res.ok||res.type==='opaque')&&!res.redirected){const k=res.clone();caches.open(CACHE).then(c=>c.put(r,k)).catch(()=>{})}return res};
  if(u.origin===location.origin){
    e.respondWith(fetch(r).then(store).catch(()=>caches.match(r).then(h=>h||caches.match('./index.html')).then(h=>h||offline())));
  }else{
    e.respondWith(caches.match(r).then(h=>h||fetch(r).then(store)));
  }
});
