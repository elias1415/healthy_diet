// sw.js - improved caching strategy v3
const CACHE_NAME = 'diet-sa-final3-v3';
const ASSETS = ['/', '/index.html', '/css/styles.css', '/js/app.safe.js', '/js/meals.js', '/js/tracker.js'];
self.addEventListener('install', evt=>{
  self.skipWaiting();
  evt.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate', evt=>{
  evt.waitUntil(caches.keys().then(keys=> Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', evt=>{
  const req = evt.request;
  if(req.mode === 'navigate' || (req.method==='GET' && req.headers.get('accept')?.includes('text/html'))){
    evt.respondWith(fetch(req).then(resp=>{ caches.open(CACHE_NAME).then(c=>c.put(req, resp.clone())); return resp; }).catch(()=>caches.match('/index.html')));
    return;
  }
  evt.respondWith(caches.match(req).then(cached=> cached || fetch(req).then(net=>{ if(net && net.status===200){ caches.open(CACHE_NAME).then(c=>c.put(req, net.clone())); } return net; }).catch(()=>null)));
});
self.addEventListener('message', evt=>{
  const msg = evt.data;
  if(msg && msg.type === 'SKIP_WAITING'){ self.skipWaiting(); }
  if(msg && msg.type === 'CLEAR_CACHE'){ caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))); }
});
