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

angular.module('hungergame.restaurants').service('nomSelector',[function() {
    var nomSelection_arr = [];
    var randomNom;
    var roomId;
    var madeSelection = true;

    // Returns a random integer up to a max
    function getRandom(max) {
        return Math.floor(Math.random() * (max));
    }

    return {
        getNom: function() {
          var winner;
          if (nomSelection_arr.length === 0) {
            winner = randomNom;
          } else {
            winner = nomSelection_arr[getRandom(nomSelection_arr.length)];
          }

          if(winner) {
            winner.map = {
              center: {
                latitude: winner.latLng[0],
                longitude: winner.latLng[1]
              },
              zoom: 14,
            }
          }
          return winner;
        },

        clearNom: function(){
          nomSelection_arr = [];
        },

        // Logs a users nom choices
        addNom: function(nom) {
          nomSelection_arr.push(nom);
        },

        nomCount: function() {
          return nomSelection_arr.length;
        },

        setRandom: function(random) {
          randomNom = random;
        },

        getId: function(){
          return roomId;
        }, 

        setId: function(id){
          roomId = id;
        }, 

        getStatus: function(){
          return madeSelection;
        }
    }

}]);