var VERSION = `v1`;
var APP_PREFIX = 'rtvjs_';
var GHPATH = '/realtimeVisualJS';

var URLS = [
  './index.html'
]

var CACHE_NAME = APP_PREFIX + VERSION

self.addEventListener('fetch', function (e) {
  console.log('Fetch request : ' + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) { 
        console.log('Responding with cache : ' + e.request.url);
        return request
      } else {       
        console.log('File is not cached, fetching : ' + e.request.url);
        return fetch(e.request)
      }
    })
  )
})

// self.addEventListener('install', function (e) {
//   e.waitUntil(
//     caches.open(CACHE_NAME).then(function (cache) {
//       console.log('Installing cache : ' + CACHE_NAME);
//       return cache.addAll(URLS)
//     })
//   )
// })

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll([
      '${GHPATH}/',
      '${GHPATH}/manifest.json',
      '${GHPATH}/node_modules/d3/dist/d3.js',
      '${GHPATH}/node_modules/timechart/dist/timechart.min.js',
      '${GHPATH}/node_modules/gridstack/dist/gridstack-all.js',
      '${GHPATH}/node_modules/gridstack/dist/gridstack.min.css',
      '${GHPATH}/img/sine.png',
      '${GHPATH}/img/icon512.png',
      '${GHPATH}/src/style.css',
      '${GHPATH}/src/index.js',
      '${GHPATH}/index.html'
    ]);
  })());
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX)
      })
      cacheWhitelist.push(CACHE_NAME);
      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('Deleting cache : ' + keyList[i] );
          return caches.delete(keyList[i])
        }
      }))
    })
  )
})
