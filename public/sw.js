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
    '/static/img/path-791@1x.png',
    '/static/img/asset-6-1@1x.png',
    '/logo192.png',
    '/logo144.png',
    '/static/img/bg-3@1x.png',
    '/static/img/background-10@1x.png',
    '/static/img/doctors/baker.webp',
    '/static/img/doctors/ether.webp',
    '/static/img/doctors/james.webp',
    '/static/img/doctors/john.webp',
    '/static/img/doctors/lalitha.webp',
    '/static/img/doctors/mounika.webp',
    '/static/img/doctors/angel.webp',
    '/static/img/users/user1.jpeg',
    '/static/img/users/user2.jpeg',
    '/static/img/users/user3.jpeg',
    '/static/img/users/user4.jpeg',
    '/static/img/users/user5.jpeg',
     '/static/img/filter.svg',
    '/static/img/doctors/smith.webp',
    '/static/img/patient.png',
    '/static/img/home.svg',
    '/static/img/calendar1.svg',
    '/static/img/user.svg',
    '/static/img/info.svg',
    '/static/img/logout.svg',
    '/static/img/arrow.svg',
    '/static/img/share.svg',
    '/static/img/angle-down.svg',
    '/static/img/userchat.svg',
    '/static/img/chat.svg',
    '/static/img/userheart.svg',
    '/static/img/heart.svg',
    '/static/img/filter_black.svg',
    '/static/img/feature/maps.png',
    '/static/img/chat.png',
    '/static/img/call.svg',
    '/static/img/message.svg',
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





