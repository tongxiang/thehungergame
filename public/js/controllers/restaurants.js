'use strict';

angular.module('hungergame.restaurants')
  .controller('RestaurantsController', ['$scope', '$stateParams', '$location', 'Global', 'Restaurants', 'geolocation', '$http','nomSelector', 'usSpinnerService', '$state', function ($scope, $stateParams, $location, Global, Restaurants, geolocation, $http, nomSelector, usSpinnerService, $state) {

    // Removed Geocodes from between $http and nomSelector;

    $scope.global = Global;
    $scope.multiplayer = false;
    $scope.social = function() {
      $scope.multiplayer = true;
    }

    $scope.round = {
      //make a duration timer that is dynamic with the timer directive
      roundOver: false,
      elapsed: function() {
        return 30 - $scope.roundTime;
      }
    }

    // $scope.madeSelection = false


    $scope.venuesLoaded = false;

    $scope.winner = nomSelector.getNom();

    // Ends user round on a spacebar keypress or a phone shake


    $scope.shakeNbake=function() {
      window.addEventListener("keypress", checkKeyPressed, false);

      function checkKeyPressed(e) {
        if (e.charCode == "32") {
          $scope.$broadcast('timer-stop');
        }
      }

      window.addEventListener('shake', shakeEventDidOccur, false);

      // Define a custom method to fire when shake occurs.
      function shakeEventDidOccur () {
        $scope.$broadcast('timer-stop');
        // if (confirm("Oh no you didn't?")) {
        //     alert("Ohh bit*h we bout to fight!")
        // }
      }
    }

    $scope.$watch('restaurants',function(){
      if ($scope.restaurants) {
        if ($scope.restaurants.length === 0) {
          $scope.$broadcast('timer-stop');
        }
      }
    });

    $scope.$on('timer-stopped', function (event, data){
        console.log('Timer Stopped - data = ', data);
        $scope.nom_count = nomSelector.nomCount()
        console.log('Nom count from service: ', $scope.nom_count)
        if($scope.nom_count>0) {
          $scope.madeSelection = true;
        } else {
          $scope.madeSelection = false;
        }
        console.log('madeSelection?: ', $scope.madeSelection)
        $scope.roundTime = data.seconds
        $scope.round.roundOver = true;
        $state.go('home.transition');
    });

    // Get player's location;
    $scope.initialize = function() {
      console.log('function starting')
      $scope.visitTime = new Date;
      console.log('User visited site on: ', $scope.visitTime)
      geolocation.getLocation().then(function(data) {
          $scope.coords = {'lat':data.coords.latitude, 'long':data.coords.longitude};
          var latLngString = data.coords.latitude + ',' + data.coords.longitude;
          $scope.latLngString = latLngString;
      })
    }

    $scope.findNearBy = function(coordinates) {
      // var findNearBy = function(coordinates){
          $http({method: 'GET', url: '/venues',
            params: {latLng: coordinates}}).
            success(function(data, status, headers, config){
                console.log('rest controller', data.length);
                $scope.restaurants = data;

                // Assigns random restaurant if user decides to not choose one during gameplay
                var random = data[Math.floor(Math.random() * (data.length))];
                console.log('Rando frm ctrl: ', random)
                nomSelector.setRandom(random);
                $scope.venuesLoaded = true;
                  // Geocodes.create($scope.coords).then(function(ref){
                  //     console.log('you have pushed in your current latlng', ref)
                  // })
            }).
            error(function(data, status, headers, config){
                console.log(status);
            });
      };
      // findNearBy(latLngString);
}]);




    // // For multiplayer
    // scope.players = [];
    // $scope.multiplayer;


// **************************************************** //

//     $scope.create = function() {
//         var restaurant = new Restaurants({
//             title: this.title,
//             content: this.content
//         });
//         restaurant.$save(function(response) {
//             $location.path('restaurants/' + response._id);
//         });

//         this.title = '';
//         this.content = '';
//     };

//     $scope.remove = function(restaurant) {
//         if (restaurant) {
//             restaurant.$remove();

//             for (var i in $scope.restaurants) {
//                 if ($scope.restaurants[i] === restaurant) {
//                     $scope.restaurants.splice(i, 1);
//                 }
//             }
//         }
//         else {
//             $scope.restaurant.$remove();
//             $location.path('restaurants');
//         }
//     };

//     $scope.update = function() {
//         var restaurant = $scope.restaurant;
//         if (!restaurant.updated) {
//             restaurant.updated = [];
//         }
//         restaurant.updated.push(new Date().getTime());

//         restaurant.$update(function() {
//             $location.path('restaurants/' + restaurant._id);
//         });
//     };

//     $scope.find = function() {
//         Restaurants.query(function(restaurants) {
//             $scope.restaurants = restaurants;
//         });
//     };

//     $scope.findOne = function() {
//         Restaurants.get({
//             restaurantId: $stateParams.restaurantId
//         }, function(restaurant) {
//             $scope.restaurant = restaurant;
//         });
//     };
// }]);
