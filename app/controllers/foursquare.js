'use strict'

var Q = require('q');
var async = require('async');

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


var foursquareExplore = function(lat, lng){
    var venuesRelevantDataArray = [];
    var deferred = Q.defer();
    foursquare.Venues.explore(lat, lng, {venuePhotos: 1, openNow: 1, sortByDistance: 1, price: 1}, null, function(error, venuesObject){
        console.log("the restaurant count that foursquareExplore is returning is",venuesObject.groups[0].items.length)
        var counter = 0
        venuesObject.groups[0].items.forEach(function(venue){
            // Had to implement patch at 11pm; error stating that groups[0] was undefined
            if (venue.venue.photos.groups[0] && venue.venue.photos.groups[0].items.length === 1){
                venuesRelevantDataArray.push(
                {
                    'name': venue.venue.name,
                    'id': venue.venue.id,
                    'address': venue.venue.location.address,
                    'postalCode': venue.venue.location.postalCode,
                    'latLng': [venue.venue.location.lat, venue.venue.location.lng],
                    'distance': venue.venue.location.distance,
                    'formattedPhoneNumber': venue.venue.contact.formattedPhone,
                    'unformattedPhoneNumber': venue.venue.contact.phone,
                    'url': venue.venue.url,
                    'userVotes': 0,
                    'photoUrl': '',
                    'originalIndex': counter
                })
                counter ++;
            }
        })
        deferred.resolve(venuesRelevantDataArray);
    });
    return deferred.promise;
};

var getPhotosFromVenue = function(venueObject, done){
    foursquare.Venues.getPhotos(venueObject.id, null, {limit: 2}, null, function(error, photoArrayObject){
        // OW: Temporary patch to account for no photos loading
        if (!photoArrayObject || !photoArrayObject.photos.items[0]) {
            venueObject['photoUrl'] = 'http://lorempixel.com/500/500/'
        }
        else if (!photoArrayObject.photos.items[1]){
            venueObject['photoUrl'] = photoArrayObject.photos.items[0].prefix.concat('500x500', photoArrayObject.photos.items[0].suffix)
            // console.log('this ' + venueObject.name + ' doesnt have a second photo!')
        }
        else {
            venueObject['photoUrl'] = photoArrayObject.photos.items[1].prefix.concat('500x500', photoArrayObject.photos.items[1].suffix)
        }
        done(null, venueObject);
        //returns an array of photo objects, from a single venue
    });
};

exports.foursquareQuery = function(req, res){
    var coords = req.query.latLng.split(",");
    var lat = coords[0];
    var lng = coords[1];
    foursquareExplore(lat, lng).then(function(venuesObject){
        async.map(venuesObject, getPhotosFromVenue, function(err, photoArraysObject){
            console.log("There are a total of " + photoArraysObject.length + "venues for which we have now retrieved photos for");
                console.log(photoArraysObject);
                res.json(photoArraysObject);
        });
    });
}

