
const CACHE_NAME='diet-sa-final3-v2';
const ASSETS=['/','/index.html','/css/styles.css','/js/app.js','/js/meals.js','/js/tracker.js','/assets/cover.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))) });
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match('/index.html'))))});
