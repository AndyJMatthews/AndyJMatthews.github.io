importScripts('/js/vendor/sw-toolbox.js'); // Update path to match your own setup

const spCaches = {
    'static':'static-v2',
    'dynamic': 'dynamic-v2' ,
    'dynamicApi': 'dynamic-api'
};
var urlsToPrefetch = [
  "https://statsapi.web.nhl.com/api/v1/teams/24?hydrate=roster(person(stats(splits=statsSingleSeason)))"
];


self.addEventListener('install', function(event){
    console.log('SW installed at ', new Date().toLocaleDateString()); 
    /*event.waitUntil(
        caches.open(spCaches.static).then(function(cache){
            return cache.addAll([
                '/css/*',
                '/img/real_cf.png',
                '/index.html',
                '/js/vendor/*',
                'js/angular.js'
            ]);
            
        }));*/
    event.waitUntil(
    caches.open(spCaches.static).then(function(cache) {
        console.log('Opened cache');
        // Magic is here. Look the  mode: 'no-cors' part.
        cache.addAll(urlsToPrefetch.map(function(urlToPrefetch) {
           return new Request(urlToPrefetch, { mode: 'no-cors' });
        })).then(function() {
          console.log('All resources have been fetched and cached.');
        });
      })
  );
    
    
    
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

//toolbox.precache(['/index.html', '/css/*', '/img/*', '/js/*']);
toolbox.cache('https://nhl.bamcontent.com/images/headshots/current/168x168/8470147.jpg', {
    cache:{
       name: spCaches.dynamicApi,
       maxEntries:20000,
       maxAgeSeconds: 60 * 60 * 24
    }
});
toolbox.router.get('/css/*', toolbox.cacheFirst,{
    cache:{
        name: spCaches.static,
        maxAgeSeconds: 60 * 60 * 24 * 3 //3 Days
    }
});
toolbox.router.get('/*',toolbox.networkFirst,{
   cache: {
       name: spCaches.dynamic,
       maxEntries:20000,
       maxAgeSeconds: 60 * 60 * 24 //1 Days
   } 
});
