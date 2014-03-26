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