'use strict';

// hungergame.controller('SliderController', function($scope) {
//     $scope.images=[{src:'img1.png',title:'Pic 1'},{src:'img2.jpg',title:'Pic 2'},{src:'img3.jpg',title:'Pic 3'},{src:'img4.png',title:'Pic 4'},{src:'img5.png',title:'Pic 5'}];
// });

angular.module('hungergame.restaurants')
  .controller('RestaurantsController', ['$scope', '$stateParams', '$location', 'Global', 'Restaurants', 'geolocation', '$http', 'Geocodes','nomSelector', 'usSpinnerService', '$state', function ($scope, $stateParams, $location, Global, geolocation, $http, nomSelector, usSpinnerService, $state) {

    $scope.global = Global;
    $scope.multiplayer = false;
    $scope.round = {
      //make a duration timer that is dynamic with the timer directive
      roundOver: false,
      elapsed: 30 - this.roundTime,
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
        $scope.round.roundTime = data.seconds
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
          // console.log(latLngString)
          var findNearBy = function(coordString){
              $http({method: 'GET', url: '/venues',
                  params: {latLng: coordString}}).
                  success(function(data, status, headers, config){
                      console.log('rest controller', data.length);
                      $scope.restaurants = data;
                      var random = data[Math.floor(Math.random() * (data.length))];
                      console.log('Rando frm ctrl: ', random)
                      nomSelector.setRandom(random);
                      $scope.venuesLoaded = true;
                        Geocodes.create($scope.coords).then(function(ref){
                            console.log('you have pushed in your current latlng', ref)
                        })
                  }).
                  error(function(data, status, headers, config){
                      console.log(status);
                  });
          };
          findNearBy(latLngString);
      });
    }
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
