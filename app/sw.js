// Retired /app/ copy: uninstall and reload open tabs so they land on the redirect.
// Its old cache is cleaned by the main sw.js, which deletes every non-current fundedtrack-* cache.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil((async()=>{
 await self.registration.unregister();
 for(const c of await self.clients.matchAll({type:'window'}))c.navigate(c.url);
})()));
