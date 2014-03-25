'use strict'

//Implement Promises Library -- Q, so that we can 

//we may also need the async series library, since we're going to running the arrayofResponses.foreach() over the entire 

var config = {
    'secrets' : {
        'clientId': 'E4AWAAAQ0FVJZWUCJAKDEGLOVV2XHIM5Y2X32UEWEPFMACFT',
        'clientSecret': 'Z2KX31US4VQEKSOZTTBPLQ3LXD5DAODYVXVB4QFPJN3OKUVS',
        'redirectUrl': 'http://google.com'
    }, 
    'winston' : {
        'loggers' : {
            'core' : {
                'console' : {
                    'level' : 'warn'
                }
            },
            'venues' : {
                'console': {
                    'level': 'debug'
                }
            }
        }
    }
};

var foursquare = require('node-foursquare')(config);

// foursquare.Venues.explore(40.7058908,-74.0076924, {venuePhotos: 1, openNow: 1, sortByDistance: 1, price: 1}, null, function(error, data){
//     data.groups[0].items.forEach(function(place){
//             console.log(place.venue.name, place.venue.price, place.venue.location.lat, place.venue.location.lng, place.venue.location.distance, place.venue.photos.groups[0].items[0].prefix + '500x500' + place.venue.photos.groups[0].items[0].suffix)
//     });
// });

exports.foursquareQuery = function(req, res){
    var coords = req.query.lngLat.split(",");
    var lat = coords[0];
    var lng = coords[1];
    foursquare.Venues.explore(lat,lng, {venuePhotos: 1, openNow: 1, sortByDistance: 1, price: 1}, null, function(error, data){
        res.json(data.groups[0].items);
    });
}

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

//what this returns>>>console.log(place.venue.name, place.venue.price)
//L'Artusi { tier: 3, message: 'Expensive', currency: '$' }

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

// Photo Object

//  { id: '4e85eebb29c2b442d19d5edc',
//     createdAt: 1317400251,
//     prefix: 'https://irs1.4sqi.net/img/general/',
//     suffix: '/3ETYLZEFWZ4EWLQ4C5ZQFPBNQZ0MCRJDMIEEXAEXACQPIZJ2.jpg',
//     width: 300,
//     height: 400,
//     user:
//      { id: '10940274',
//        firstName: 'Rodel',
//        lastName: 'P.',
//        gender: 'male',
//        photo: [Object] },
//     visibility: 'public' } ]