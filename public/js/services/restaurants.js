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

//+++ NOTE: Restaurants service used for passing data between the public directive and the restaurants controller
  // See http://jsfiddle.net/b2fCE/1/

angular.module('hungergame.restaurants').service('nomPasser',[function() {
    var nomSelection;

    return {
        getNom: function() {
          return nomSelection;
        },

        setNom: function(nom) {
          nomSelection = nom;
        },
    }

}]);