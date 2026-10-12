'use strict';
const CACHE='vcl-v8';
const SHELL=['./','./index.html','./config.js','./manifest.json','https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>0)))))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim())));
self.addEventListener('message',e=>{if(e.data&&e.data.type==='WIPE_CACHE')caches.delete(CACHE)});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.hostname.indexOf('google')>=0)return;                                   // የ Sheet ጥሪዎች በፍጹም አይካሹም
  const ok=u.origin===location.origin||SHELL.indexOf(r.url)>=0;                 // የራስ ፋይሎች + xlsx ብቻ ይካሻሉ
  e.respondWith(fetch(r).then(x=>{if(ok&&x&&x.status===200){const c=x.clone();caches.open(CACHE).then(h=>h.put(r,c))}return x}).catch(()=>caches.match(r).then(m=>m||(r.mode==='navigate'?caches.match('./index.html'):undefined))))});
