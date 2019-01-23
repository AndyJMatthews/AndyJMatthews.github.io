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
                '/css/*',
                '/img/real_cf.png',
                '/index.html',
                'https://code.highcharts.com/highcharts.js',
                'https://code.jquery.com/jquery-1.12.4.min.js',
                'js/vendor/*',
                'js/angular.js'
                'https://nhl.bamcontent.com/images/headshots/current/168x168/*',
                'https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/*'
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
        maxAgeSeconds: 60 * 60 * 24 * 3 //3 Days
    }
});
toolbox.router.get('/*', toolbox.networkFirst,{
   cache: {
       name: spCaches.dynamic,
       maxAgeSeconds: 60 * 60 * 24 //1 Days
   } 
});