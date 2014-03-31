'use strict'

angular.module('hungergame.restaurants')
  .controller('RestaurantsController', ['$scope', '$stateParams', '$location', 'Global', 'Restaurants', 'geolocation', '$http', 'nomSelector', 'usSpinnerService', 'Rooms', '$state', function ($scope, $stateParams, $location, Global, Restaurants, geolocation, $http, nomSelector, usSpinnerService, Rooms, $state, $timeout) {

  $scope.global = Global;
  $scope.venuesLoaded = false;
  $scope.multiPlayerData = {};
  $scope.newRoomObject = {};
  $scope.userObject = {};
  $scope.userAddedToFirebase = false;
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
    if (difference/1000 < 6000){
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
              return data;
          }).
          error(function(data, status, headers, config){
              console.log(status);
          });
  };

  $scope.initialize = function() {
    var loginDateTime = new Date;
    $scope.visitTime = loginDateTime.getTime(); 
    geolocation.getLocation().then(function(location) {
      $scope.coords = {'lat':location.coords.latitude, 'long':location.coords.longitude}; 
      $scope.latLngString = location.coords.latitude + ',' + location.coords.longitude;
      $scope.existingRooms = Rooms.all;
      console.log('here is an immediately run console.log of $scope.existingRooms', $scope.existingRooms)

      var consolingMyself = function(){
        console.log('here is a fucked up array of all the object keys:', Object.keys($scope.existingRooms))
      }
      // setInterval(consolingMyself, 2000);

      //filter room properties into $ or - 
      var filterRooms = function(){
        var roomArray = [];
        $.each($scope.existingRooms, function(key, value){
          console.log('within foreach loop, key:', key)
          if (key.charAt(0) != '$'){
            roomArray.push($scope.existingRooms[key])
            }
          })
        return roomArray
      }

      var checkTimeLatLng = function(roomArray){
        roomArray.forEach(function(room){
          var timeBoolean = (withinTimeInterval(room.initiator.visitTime, $scope.visitTime))
          if (timeBoolean && (getDistanceFromLatLonInKm(room.initiator.latLng.lat, room.initiator.latLng.long, $scope.coords.lat, $scope.coords.long) < 0.1)){
            $scope.multiPlayerData = room.initiator.multiPlayerData;
            $scope.initiator = 
            //create new user, but will voting work if we're no longer attached to the initiator via firebase? Do we have an indicator of which function we're on? Can we save the roomId? <<< critical 

            //returns true or false, true if the user has attaches 
          }
        })
      }



    
    });//geolocation query closes
  } //initialize function closes
}]);
