const CACHE="luebeck-our-way-v16";
const CORE=["./","./index.html","./style.css?v=16","./app.js?v=16","./enhancements.js?v=16","./event-radar.html","./field-updates-v14.js?v=16","./data/places.js?v=16","./data/gastro.js?v=16","./data/walks.js?v=16","./data/events.json","./manifest.webmanifest","./assets/icon-192.png","./assets/icon-512.png"];

self.addEventListener("install",e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const url=new URL(e.request.url);
  const sameOrigin=url.origin===self.location.origin;

  if(!sameOrigin)return;

  const isFreshAsset =
    e.request.mode==="navigate" ||
    url.pathname.endsWith(".html") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".json");

  if(isFreshAsset){
    e.respondWith(
      fetch(e.request,{cache:"no-store"})
        .then(resp=>{
          if(resp.ok){
            const copy=resp.clone();
            caches.open(CACHE).then(c=>c.put(e.request,copy));
          }
          return resp;
        })
        .catch(async()=>{
          const cached=await caches.match(e.request);
          if(cached)return cached;
          if(e.request.mode==="navigate")return caches.match("./index.html");
          throw new Error("offline");
        })
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached=>cached||fetch(e.request).then(resp=>{
      if(resp.ok){
        const copy=resp.clone();
        caches.open(CACHE).then(c=>c.put(e.request,copy));
      }
      return resp;
    }))
  );
});