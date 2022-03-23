let cacheData = "appV1";

var resourcesToCache = [
    '/',
    '/index.html',
    '/favicon.ico',
    '/logo192.png',
    '/logo144.png',
    '/logo512.png',
    '/static/img/users/user.png',
    '/static/img/home.svg',
    '/static/img/logout.svg',
    '/static/img/delete.svg',
    '/static/img/arrow.svg',
    '/manifest.json',
    '/static/css/splash.css',
    '/static/css/sign-up-dark.css',
    '/static/css/styleguide.css',
    '/static/css/globals.css',
     '/static/css/sidebar.css',
     '/static/css/dashboard.css',
     '/static/css/binitems.css',
    '/static/js/jquery.slim.min.js',
    '/static/js/bundle.js',
    '/static/js/main.chunk.js',
    '/static/js/vendors~main.chunk.js',
   





];


this.addEventListener("install",(event)=>{
    event.waitUntil(
        caches.open(cacheData).then((cache)=>{
            cache.addAll(resourcesToCache)
        })
        .catch(err=>console.log(err))

    )
})

this.addEventListener("fetch", (event) =>{
        if(!navigator.onLine){
            event.respondWith(
                caches.match(event.request).then((resp)=>{
                    if(resp){
                        return resp
                    }
                    let requestUrl = event.request.clone();
                    fetch(requestUrl)
                })
            )
        }


  
})





