'use strict';

// hungergame.controller('SliderController', function($scope) {
//     $scope.images=[{src:'img1.png',title:'Pic 1'},{src:'img2.jpg',title:'Pic 2'},{src:'img3.jpg',title:'Pic 3'},{src:'img4.png',title:'Pic 4'},{src:'img5.png',title:'Pic 5'}];
// });

var _ = require('underscore')

angular.module('hungergame.restaurants')
  .controller('RestaurantsController', ['$scope', '$stateParams', '$location', 'Global', 'Restaurants', 'geolocation', '$http', 'Geocodes', 'nomPasser', 'usSpinnerService', 'Rooms', function ($scope, $stateParams, $location, Global, Restaurants, geolocation, $http, Geocodes, nomPasser, usSpinnerService, Rooms) {

    $scope.global = Global;
    $scope.venuesLoaded = false;

var geolocate = function(){
  geolocation.getLocation().then(function(data){ //this is happening asynchronously. probably could use async.series (https://github.com/caolan/async#series)
    $scope.coords = {'lat':data.coords.latitude, 'long':data.coords.longitude};
    $scope.latLngString = data.coords.latitude + ',' + data.coords.longitude;
  });
}

var withinTimeInterval = function(time1, time2){
  var difference = Math.abs(time2-time1)
  if (difference/1000 < 60){
    return true 
  }
  return false
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

    var findNearBy = function(coordString){
        $http({method: 'GET', url: '/venues',
            params: {latLng: coordString}}).
            success(function(data, status, headers, config){
                console.log('rest controller', data.length);
                // $scope.restaurants = data;
                $scope.venuesLoaded = true;
                  // Geocodes.create($scope.coords).then(function(ref){
                  //     console.log('you have pushed in your current latlng', ref)
                  // });
                return data;
            }).
            error(function(data, status, headers, config){
                console.log(status);
            });
    };

    // Get player's location;
    $scope.initialize = function() {
      // console.log('function starting')
      var date = new Date; 
      $scope.visitTime = date.getTime();
      // console.log('User visited site on: ', $scope.visitTime)
      geolocation.getLocation().then(function(data) {
//GET firebase rooms object - ?
        var existingRooms = Rooms.all
//check $scope.visitTime against each room's [0] user with a function withinTimeInterval
        if (_.size(existingRooms) > 0){
          Object.keys(existingRooms).forEach(function(key){
            if (withinTimeInterval(existingRooms[key][0].visitTime, $scope.visitTime)){
              if (getDistanceFromLatLonInKm(existingRooms[key][0].latLng.lat, existingRooms[key][0].latLng.long, $scope.coords.lat, $scope.coords.long) < 0.1){

                existingRooms[key].push($scope.userObject)
                //HOW THE FUCK DO I DO THE ABOVE IN FIREBASE???? I need to do some kind of findAndReplace I think. 

              }
            }
          })



        }

    //if withinTimeInterval returns true (time difference less than 30 seconds)
        //latLng check against that [0] user
        //if distance check works, then room.push(userObject) - we need to create this userObject
              //attach room[0].multiPlayerData = user.multiPlayerData = $scope.multiPlayerData <<< we need to have separate data variables on our scope between singleplayer and multiplayer 
              //"join multiplayer room" button appears
              //BREAK
//(outside of withinTimeInterval check) >>> run findNearBy function, assign $scope.multiPlayerData = whatever findNearBy returns 
//create new Room in firebase, push in new User with latLng, timeStamp, and multiPlayerData

$scope.multiPlayerData = findNearBy(latLngString);//does this work?

$scope.newRoomArray = []

$scope.userObject = {
  latLng: $scope.coords,
  multiPlayerData: $scope.multiPlayerData,
  visitTime: ''
};

Rooms.create($scope.newRoomArray.push($scope.userObject));

//"start new multiplayer room" button appears

//WHAT INITIALIZES THE SINGLEPLAYER findNearBy function? Is all the multiplayer data acquisition/binding going to happen before even the multiplayer buttons appear?

//Let's initialize the SINGLEPLAYER findNearBy function when the "singleplayer" button is clicked. So on redirect, we still use this controller, and we tie another function like singlePlayerInit() to ng-init in the single player view. singlePlayerInit will run findNearBy, and attach the results to another variable like $scope.SinglePlayerData.

          $scope.coords = {'lat':data.coords.latitude, 'long':data.coords.longitude};
          var latLngString = data.coords.latitude + ',' + data.coords.longitude;
          // console.log(latLngString)
          findNearBy(latLngString);
      });
    }

    $scope.winner = nomPasser.getNom();

    $scope.$on('timer-stopped', function (event, data){
        console.log('Timer Stopped - data = ', data);
    });
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
