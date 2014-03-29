// Omaris correction: 

// OW: Temporary patch to account for no photos loading
        // if (!photoArrayObject || !photoArrayObject.photos.items[0]) {
        //     venueObject['photoUrl'] = 'http://lorempixel.com/500/500/'
        // }
        // else if (!photoArrayObject.photos.items[1]){
        //     venueObject['photoUrl'] = photoArrayObject.photos.items[0].prefix.concat('500x500', photoArrayObject.photos.items[0].suffix)
        //     // console.log('this ' + venueObject.name + ' doesnt have a second photo!')
        // }



// ERROR THAT RETURNS WHEN I TAKE OUT THE {limit: 3} property, because one of the venuesObjects has an undefined property 


// enter: getVenueAspect
// debug: getVenueAspect:venueId: 4a734456f964a520f8db1fe3
// debug: getVenueAspect:aspect: photos
// debug: getVenueAspect:params: { limit: 2, group: 'venue' }
// https://irs0.4sqi.net/img/general/ /14909343_lYzHBVEDm-WSMamGirMyfXsSBkTajOdfIrMUin75fm8.jpg
// https://irs0.4sqi.net/img/general/ /43769736_MR-kxSI8FKlwEqlkweuAET87FNhTlns1jAnvGrbBXHs.jpg
// https://irs0.4sqi.net/img/general/ /1023388_osi24KP9GHivH4iKp22VfpSmKB15aKCbqbSnfK3hDac.jpg
// https://irs0.4sqi.net/img/general/ /63593554_RWAdWUjitBcjf-uZa_m-KHhQqhMUM8fikzpcZi8DpSI.jpg
// https://irs3.4sqi.net/img/general/ /80895239_DyFejS7owyqIvujNUo1L7nQCyjHUZq6jWanIXjESKgY.jpg
// https://irs3.4sqi.net/img/general/ /8466760_oLEEwTcK-iNb7qC5ePEiTFrb2yP3Jj2tzTRT8TggB34.jpg
// https://irs3.4sqi.net/img/general/ /7254053_EfN06ChHEgmfG2iJIjbIjKckMOaKhpjuDRtdLTKisXg.jpg
// https://irs1.4sqi.net/img/general/ /758181__ZZrpgYC4caRLarbHBWnZZItbiiwLPkiuTf3Te44ErI.jpg
// https://irs1.4sqi.net/img/general/ /620601_GZ4uQJLS95slRqY6xeFGpeUDfr7cNXh4YsLCm__2HzM.jpg
// https://irs1.4sqi.net/img/general/ /5384293_umtDsnFOIQuY11BCWNJuZeSljUno42FkkvfrPa6Npjk.jpg
// https://irs2.4sqi.net/img/general/ /30301788_gTU0S9Fe2rYhWIHSCSHqr0mhIrZnBWMaAtkErmD-r_M.jpg
// https://irs0.4sqi.net/img/general/ /705980_AzyGEh6xAZ0hoBnytDUzlJBOmYk_k5-7wDDldlyqiKE.jpg
// https://irs3.4sqi.net/img/general/ /20267621_JX7cC3R5b0riT7Hsy4YJtKZRQBFUpDuSUnRAfa1BNOs.jpg
// https://irs0.4sqi.net/img/general/ /4730516_IATV2HVEdOyzFK3BOG3YBSUbN0rhHzdnMOZ4lBMd43Q.jpg
// https://irs3.4sqi.net/img/general/ /60013587_VzEY7vfLmmeALmTKUzU3Hh5kwnz0jPl8wa5giGVwD8E.jpg
// https://irs3.4sqi.net/img/general/ /7563681_tAmM8o_DF0Q297fC4mRrJsoj6IySzwDlIU3eE6vA3GQ.jpg
// https://irs1.4sqi.net/img/general/ /11443690_D9PWDPyPMD8O8DGVeTOM6PGbIo-lbMEH1-P9h2Mdw74.jpg
// https://irs0.4sqi.net/img/general/ /65455030_-WQvxCFH391YurgGgbxVqEoy8NITf1R8nTEapI-BPqA.jpg
// https://irs2.4sqi.net/img/general/ /60477635_xeUtA7kD4A7HcPtA_5JyWl2zqu9-sLS86lSwXwLZ_do.jpg
// https://irs2.4sqi.net/img/general/ /64081965_LJBxekJyn0BGC103RBW-QR5CWfKWiz9A5zzXTLQsuTo.jpg
// https://irs2.4sqi.net/img/general/ /8102214_a7RUPMLO_NSrZmQ4VydySdiVGsxv8lxHbO9h0BijjSE.jpg

// /Users/tong/fullstack/thehungergame/app/controllers/foursquare.js:61
//         console.log(photoArrayObject.photos.items[1].prefix, photoArrayObject.
//                                                     ^
// TypeError: Cannot read property 'prefix' of undefined
//     at /Users/tong/fullstack/thehungergame/app/controllers/foursquare.js:61:53
//     at extractData (/Users/tong/fullstack/thehungergame/node_modules/node-foursquare/lib/core.js:139:11)
//     at /Users/tong/fullstack/thehungergame/node_modules/node-foursquare/lib/core.js:187:7
//     at /Users/tong/fullstack/thehungergame/node_modules/node-foursquare/lib/core.js:105:11
//     at IncomingMessage.<anonymous> (/Users/tong/fullstack/thehungergame/node_modules/node-foursquare/lib/core.js:65:9)
//     at IncomingMessage.EventEmitter.emit (events.js:117:20)
//     at _stream_readable.js:920:16
//     at process._tickCallback (node.js:415:13)

// BELOW IS WHAT WE ACTUALLY WANT TO RETURN: 
// {
// //from venue.Explore query:
//     restaurant_name: , 
//     restaurant_id: , 
//     latitude: , 
//     longitude: , 
//     distance: ,
// //from venue.Photo query:
//     photoUrl: photoUrlPrefix + '500x500' + photoUrlSuffix
// }

// SAMPLE QUERIES SHOWING THE DATA STRUCTURE: 

// foursquare.Venues.explore(40.7058908,-74.0076924, {venuePhotos: 1, openNow: 1, sortByDistance: 1, price: 1}, null, function(error, data){
//     data.groups[0].items.forEach(function(place){
//             console.log(place.venue.name, place.venue.price, place.venue.location.lat, place.venue.location.lng, place.venue.location.distance, place.venue.photos.groups[0].items[0].prefix + '500x500' + place.venue.photos.groups[0].items[0].suffix)
//     });
// });

// console.log(place.venue.name, place.venue.price, place.venue.location.lat, place.venue.location.lng, place.venue.location.distance, place.venue.photos.groups[0].items[0].prefix, place.venue.photos.groups[0].items[0].suffix)

// foursquare.Venues.explore(40.7058908,-74.0076924, {venuePhotos: 1, openNow: 1, sortByDistance: 1, query: 'restaurant', price: 1}, null, function(error, data){
//     data.groups[0].items.forEach(function(place){
//         var newPlace = {
//             name: place.venue.name, 
//             price: place.venue.price,
//             latLng: [place.venue.location.lat, place.venue.location.lng],
//             distance: place.venue.location.distance, 
//             photoUrlPrefix: place.venue.photos.groups[0].items[0].prefix, 
//             photoUrlSuffix: place.venue.photos.groups[0].items[0].suffix
//         }
//     });

// what this returns>>>console.log(place.venue.name, place.venue.price)
// L'Artusi { tier: 3, message: 'Expensive', currency: '$' }

// What the unfiltered, no-optioned request returns >>> 

// { reasons: { count: 0, items: [] },
//     venue:
//      { id: '4abce679f964a5209d8720e3',
//        name: 'Luke\'s Lobster EV',
//        contact: [Object],
//        location: [Object],
//        categories: [Object],
//        verified: true,
//        stats: [Object],
//        url: 'http://lukeslobster.com',
//        price: [Object],
//        likes: [Object],
//        rating: 9.63,
//        menu: [Object],
//        hours: [Object],
//        specials: [Object],
//        photos: [Object],
//        hereNow: [Object],
//        storeId: '' },
//     tips: [ [Object] ],
//     referralId: 'e-0-4abce679f964a5209d8720e3-24' }

// INDIVIDUAL Photo Object

// { id: '52f9b4e9498e570fd680471f',
//   createdAt: 1392096489,
//   source:
//    { name: 'foursquare for iPhone',
//      url: 'https://foursquare.com/download/#/iphone' },
//   prefix: 'https://irs0.4sqi.net/img/general/',
//   suffix: '/68797288_troOBRTAYWa4E8kHEA9Yvll8YWTXG5eJWSc-Ms78NvE.jpg',
//   width: 720,
//   height: 960,
//   user:
//    { id: '68797288',
//      firstName: 'Ming',
//      lastName: 'C.',
//      gender: 'male',
//      photo:
//       { prefix: 'https://irs0.4sqi.net/img/user/',
//         suffix: '/5L3BUUXK0R3AS4E4.jpg' } },
//   visibility: 'public' }

// PHOTO REQUEST OBJECT
// debug: getVenueAspect:params: { limit: 2, group: 'venue' }
// { photos: { count: 95, items: [ [Object], [Object] ] } }
// { photos: { count: 214, items: [ [Object], [Object] ] } }
// { photos: { count: 41, items: [ [Object], [Object] ] } }
// { photos: { count: 152, items: [ [Object], [Object] ] } }
// { photos: { count: 352, items: [ [Object], [Object] ] } }
// { photos: { count: 25, items: [ [Object], [Object] ] } }
// { photos: { count: 36, items: [ [Object], [Object] ] } }
// { photos: { count: 14, items: [ [Object], [Object] ] } }
// { photos: { count: 0, items: [] } }
// { photos: { count: 48, items: [ [Object], [Object] ] } }
// { photos: { count: 37, items: [ [Object], [Object] ] } }
// { photos: { count: 28, items: [ [Object], [Object] ] } }
// { photos: { count: 12, items: [ [Object], [Object] ] } }
// There are a total of 13venues for which we have now retrieved photos for
// [ { photos: { count: 95, items: [Object] } },
//   { photos: { count: 214, items: [Object] } },
//   { photos: { count: 12, items: [Object] } },
//   { photos: { count: 37, items: [Object] } },
//   { photos: { count: 28, items: [Object] } },
//   { photos: { count: 41, items: [Object] } },
//   { photos: { count: 152, items: [Object] } },
//   { photos: { count: 352, items: [Object] } },
//   { photos: { count: 25, items: [Object] } },
//   { photos: { count: 14, items: [Object] } },
//   { photos: { count: 36, items: [Object] } },
//   { photos: { count: 48, items: [Object] } },
//   { photos: { count: 0, items: [] } } ]

// foursquare.Venues.explore(40.7058908,-74.0076924, {venuePhotos: 1, openNow: 1, sortByDistance: 1, price: 1}, null, function(error, data){
//     data.groups[0].items.forEach(function(place){
//             // console.log(place.venue.name, place.venue.id)
//             foursquare.Venues.getPhotos(place.venue.id, null, {limit: 10}, null, function(error, data){
//                 // console.log(data.photos.items[1].id, data.photos.items[1].prefix, data.photos.items[1].suffix, data.photos.items);
//             })
//     });
// });