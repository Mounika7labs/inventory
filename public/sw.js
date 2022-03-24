let cacheData = "appV1";

var resourcesToCache = [
    '/',
    '/static/js/main.chunk.js',
    '/static/js/bundle.js',
    '/index.html',
    '/static/js/vendors~main.chunk.js',
    '/static/js/jquery.slim.min.js',
    '/favicon.ico',
    '/manifest.json',
    '/logo192.png',
    '/logo144.png',
    '/logo512.png',
    '/static/img/users/user.png',
    '/static/img/home.svg',
    '/static/img/logout.svg',
    '/static/img/delete.svg',
    '/static/img/arrow.svg',
    '/static/css/signin.css',
    '/static/css/sign-up-dark.css',
    '/static/css/styleguide.css',
    '/static/css/globals.css',
     '/static/css/sidebar.css',
     '/static/css/dashboard.css',
     '/static/css/binitems.css'





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





