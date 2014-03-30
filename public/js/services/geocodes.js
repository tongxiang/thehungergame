'use strict';

angular.module('hungergame.restaurants').factory('Geocodes', ['$firebase', 'FIREBASE_URL',
    function($firebase, FIREBASE_URL){
        var ref = new Firebase(FIREBASE_URL + 'geocodes');

        var geocodes = $firebase(ref);

        var Geocodes = {
            all: geocodes, 
            create: function(geocode){
                return geocodes.$add(geocode);
            }, 
            find: function(geocodeId){
                return geocodes.$child(geocodeId);
            },
            delete: function(geocodeId){
                return geocodes.$remove(geocodeId);
            }
        };
        return Geocodes;
    }
]);

