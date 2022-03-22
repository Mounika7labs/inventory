let cacheData = "appV1";

var resourcesToCache = [
    '/',
    '/static/js/main.chunk.js',
    '/static/js/bundle.js',
    '/index.html',
    '/static/js/vendors~main.chunk.js',
    '/favicon.ico',
    '/manifest.json',
    '/static/css/splash.css',
    '/static/css/search.css',
    '/static/css/sign-up-dark.css',
    '/static/css/or-this.css',
    '/static/css/styleguide.css',
    '/static/css/globals.css',
    '/static/css/welcome.css',
    '/static/css/bottomnavbar.css',
    '/static/css/cards.css',
     '/static/css/chat.css',
     '/static/css/sidebar.css',
     '/static/css/dashboard.css',
     '/static/css/imagecarousel.css',
     '/static/css/profile.css',
     '/static/css/appointment.css',
     '/static/css/bookings.css',
     '/static/css/binitems.css',
    '/static/img/users/user.png',
    '/static/img/home.svg',
    '/static/img/logout.svg',
    '/static/img/delete.svg',
    '/static/img/arrow.svg',
    '/static/js/jquery.slim.min.js'




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





