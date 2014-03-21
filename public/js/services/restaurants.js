'use strict';

//restaurants service used for restaurants REST endpoint
angular.module('hungergame.restaurants').factory('Restaurants', ['$resource', function($resource) {
    return $resource('restaurants/:restaurantId', {
        restaurantId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);