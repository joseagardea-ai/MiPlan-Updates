const CACHE = "mi-plan-auto-v12.3.0";
self.addEventListener("install", event => event.waitUntil(self.skipWaiting()));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith("mi-plan-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", event => {
  if(event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if(url.pathname.endsWith("/version.json")){ event.respondWith(fetch(event.request,{cache:"no-store"})); return; }
  if(url.pathname.endsWith("/index.html") || url.pathname.endsWith("/")){
    event.respondWith(fetch(event.request,{cache:"no-store"}).then(r=>{const c=r.clone(); caches.open(CACHE).then(x=>x.put("./index.html",c)); return r;}).catch(()=>caches.match("./index.html"))); return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(r=>{const c=r.clone(); caches.open(CACHE).then(x=>x.put(event.request,c)); return r;}).catch(()=>cached)));
});
