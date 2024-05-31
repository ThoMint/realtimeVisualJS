var VERSION = `v3`;
var APP_PREFIX = 'rtvjs_';
var GHPATH = '/realtimeVisualJS';

var URLS = [
  './',
  './manifest.json',
  './node_modules/d3/dist/d3.js',
  './node_modules/timechart/dist/timechart.min.js',
  './node_modules/gridstack/dist/gridstack-all.js',
  './node_modules/gridstack/dist/gridstack.min.css',
  './img/sine.png',
  './img/icon512.png',
  './src/style.css',
  './src/index.js',
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

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('Installing cache : ' + CACHE_NAME);
      return cache.addAll(URLS)
    })
  )
})


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
