importScripts('js/vendor/sw-toolbox.js'); // Update path to match your own setup

const spCaches = {
    'static':'static-v2',
    'dynamic': 'dynamic-v2'    
};
self.addEventListener('install', function(event){
    console.log('SW installed at ', new Date().toLocaleDateString()); 
    event.waitUntil(
        caches.open(spCaches.static).then(function(cache){
            return cache.addAll([
                '/css/main.css',
                '/img/real_cf.png',
                '/index.html'
            ]);
            
        }));
});
self.addEventListener('activate', function(event){
   console.log('SW activated at ',  new Date().toLocaleDateString()); 
    event.waitUntil(
        caches.keys().then(function(keys){
            return Promise.all(keys.filter(function(key){
                return !Object.values(spCaches).includes(key);
            }).map(function(key){
                return caches.delete(key);
            }));            
        }))    
    
});
toolbox.router.get('/css/*', toolbox.cacheFirst,{
    cache:{
        name: spCaches.static,
        maxAgeSeconds: 60 * 60 * 24 //1 Day
    }
});
toolbox.router.get('/*', toolbox.networkFirst,{
   cache: {
       name: spCaches.dynamic,
       maxAgeSeconds: 60 * 60 * 24 * 3 //3 Days
   } 
});