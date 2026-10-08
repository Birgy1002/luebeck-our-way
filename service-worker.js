/* v0.17 cleanup worker: deliberately removes the old persistent app-shell cache. */
self.addEventListener("install",()=>self.skipWaiting());

self.addEventListener("activate",event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith("luebeck-our-way-")).map(k=>caches.delete(k)));
    const windows=await self.clients.matchAll({type:"window",includeUncontrolled:true});
    await self.registration.unregister();
    await Promise.all(windows.map(client=>{
      try{return client.navigate(client.url);}catch(e){return Promise.resolve();}
    }));
  })());
});

self.addEventListener("fetch",event=>{
  if(event.request.method==="GET"){
    event.respondWith(fetch(event.request));
  }
});
