'use strict';

// hungergame.controller('SliderController', function($scope) {
//     $scope.images=[{src:'img1.png',title:'Pic 1'},{src:'img2.jpg',title:'Pic 2'},{src:'img3.jpg',title:'Pic 3'},{src:'img4.png',title:'Pic 4'},{src:'img5.png',title:'Pic 5'}];
// });

var _ = require('underscore')

angular.module('hungergame.restaurants')
  .controller('RestaurantsController', ['$scope', '$stateParams', '$location', 'Global', 'Restaurants', 'geolocation', '$http', 'nomPasser', 'usSpinnerService', 'Rooms', '$state', function ($scope, $stateParams, $location, Global, Restaurants, geolocation, $http, nomPasser, usSpinnerService, Rooms, '$state') {

  $scope.global = Global;
  $scope.venuesLoaded = false;
  $scope.multiPlayerData = {};
  $scope.newRoomArray = [];
  $scope.userObject = {};
//OMARI'S NEW CODE
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
      $scope.roundTime = data.seconds
      $scope.round.roundOver = true;
      $state.go('home.transition');
  });
//END OMARI'S NEW CODE 

  var geolocate = function(){
    geolocation.getLocation().then(function(data){ //this is happening asynchronously. probably could use async.series (https://github.com/caolan/async#series) - OR maybe we don't need to isolate this at all. 
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

  //in using findNearBy, notice that both the geolocate and the findNearby functions are asynchronous requests. So we'll have to place findNearby in the geolocate callback or we'll have to use promises to run them. 

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

  $scope.initialize = function() {
    var loginDateTime = new Date; 
    $scope.visitTime = loginDateTime.getTime(); //a string of milliseconds 
    geolocation.getLocation().then(function(data) {
      $scope.coords = {'lat':data.coords.latitude, 'long':data.coords.longitude}; //REVISIT THIS, CONSIDERING GEOLOCATION FUNCTION MODULARIZED ABOVE 
      $scope.latLngString = data.coords.latitude + ',' + data.coords.longitude;
      //GET firebase rooms object - ?
      $scope.existingRooms = Rooms.all //callback not required here. We don't need to update existing rooms, since data is being synchronized with firebase. 

      //check $scope.visitTime against each room's [0] user with a function withinTimeInterval
      if (_.size($scope.existingRooms) > 0){
        Object.keys($scope.existingRooms).forEach(function(key){
          if (withinTimeInterval($scope.existingRooms[key][0].visitTime, $scope.visitTime)){
            if (getDistanceFromLatLonInKm($scope.existingRooms[key][0].latLng.lat, $scope.existingRooms[key][0].latLng.long, $scope.coords.lat, $scope.coords.long) < 0.1){
              //assign the initiator's data to our own 
              $scope.multiPlayerData = $scope.userObject.multiPlayerData = $scope.existingRooms[key][0].data;
              //create a new userObject on the scope
              $scope.userObject = {
                latLng: $scope.coord,
                multiPlayerData: $scope.multiPlayerData,
                visitTime: $scope.visitTime
              }
              Rooms.findRoomAndAddUser(key, $scope.userObject).then(function(ref){
                console.log('you added yourself as a new user to an existing room, your firebase ref:', ref)
                $scope.venuesLoaded = true;
              })
              break; //does this break us out of the outer-most if statement? Is this necessary? Do I need to include other breaks for the other if statements?
            }
          }
        })
        //Condition if all withinTimeInterval tests fail for each of the rooms' initiators--we're creating a new room and populating it with the initiator user
        findNearBy(latLngString).then(function(restaurantData){ //BUILD A PROMISED-BASED IMPLEMENTATION OF FINDNEARBY
          $scope.userObject = {
            latLng: $scope.coords, 
            multiPlayerData: restaurantData,
            visitTime: $scope.visitTime
          }

          $scope.newRoomArray.push($scope.userObject)
          Rooms.create($scope.newRoomArray).then(function(ref){
            console.log('you initiated a new room, the firebase ref for that room:', ref);
            $scope.venuesLoaded = true;
          })
        }) 

      }//first if statement closes 
      //if no rooms exist then create a new room, populate it with the initiator 
      findNearBy(latLngString).then(function(restaurantData){ //BUILD A PROMISED-BASED IMPLEMENTATION OF FINDNEARBY
        $scope.userObject = {
          latLng: $scope.coords, 
          multiPlayerData: restaurantData,
          visitTime: $scope.visitTime
        }

        $scope.newRoomArray.push($scope.userObject)
        Rooms.create($scope.newRoomArray).then(function(ref){
          console.log('you initiated a new room, the firebase ref for that room:', ref)
          $scope.venuesLoaded = true;
        })
      }) 

    });//geolocation query closes
  } //initialize function closes

  $scope.winner = nomPasser.getNom();

  $scope.$on('timer-stopped', function (event, data){
      console.log('Timer Stopped - data = ', data);
  });
}]);
