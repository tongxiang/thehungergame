'use strict'

angular.module('hungergame.restaurants')
  .controller('RestaurantsController', ['$scope', '$stateParams', '$location', 'Global', 'Restaurants', 'geolocation', '$http', 'nomSelector', 'usSpinnerService', 'Rooms', '$state', function ($scope, $stateParams, $location, Global, Restaurants, geolocation, $http, nomSelector, usSpinnerService, Rooms, $state) {

  $scope.global = Global;
  $scope.venuesLoaded = false;
  $scope.multiPlayerData = {};
  $scope.newRoomObject = {};
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
      $scope.existingRooms = Rooms.all
      console.log('rooms.all is logged here', Rooms.all)
      console.log('specifically identifying child', Rooms.all.$child('testRoom'))
      console.log($scope.existingRooms);
      //callback not required here. We don't need to update existing rooms, since data is being synchronized with firebase. 

      //check $scope.visitTime against each room's [0] user with a function withinTimeInterval

      if (Object.keys($scope.existingRooms).length > 0){ //this isn't working because the object, by default, has helper functions attached within it. This also might not be working because it doesn't have 
        console.log('Rooms object length is', Object.keys($scope.existingRooms).length)
        Object.keys($scope.existingRooms).forEach(function(key){
          if (key.charAt(0) != '$'){
            console.log('this is the first key without $', key);
            console.log('this is the object corresponding to that key', $scope.existingRooms[key])
            if (withinTimeInterval($scope.existingRooms[key].initiator.visitTime, $scope.visitTime)){
              if (getDistanceFromLatLonInKm($scope.existingRooms[key][0].latLng.lat, $scope.existingRooms[key][0].latLng.long, $scope.coords.lat, $scope.coords.long) < 0.1){
                //assign the initiator's data to our own 
                $scope.multiPlayerData = $scope.userObject.multiPlayerData = $scope.existingRooms[key][0].data;
                //create a new userObject on the scope

                var random = $scope.multiPlayerData[Math.floor(Math.random() * ($scope.multiPlayerData.length))];
                console.log('Rando frm ctrl: ', random)
                nomSelector.setRandom(random);

                $scope.userObject = {
                  latLng: $scope.coord,
                  multiPlayerData: $scope.multiPlayerData,
                  visitTime: $scope.visitTime
                }
                Rooms.findRoomAndAddUser(key, $scope.userObject).then(function(ref){
                  console.log('you added yourself as a new user to an existing room, your firebase ref:', ref)
                  $scope.venuesLoaded = true;
                })
                // break; //does this break us out of the outer-most if statement? Is this necessary? Do I need to include other breaks for the other if statements?
              }
            }
          }
        })
        //Condition if all withinTimeInterval tests fail for each of the rooms' initiators--we're creating a new room and populating it with the initiator user

        $http({method: 'GET', url: '/venues', params: {latLng: $scope.latLngString}}).
          success(function(data, status, headers, config){
            console.log('rest controller', data.length);
            $scope.multiPlayerData = data;
            $scope.venuesLoaded = true;

            var random = $scope.multiPlayerData[Math.floor(Math.random() * ($scope.multiPlayerData.length))];
            console.log('Rando from ctrl: ', random)
            nomSelector.setRandom(random);

            $scope.userObject = {
              latLng: $scope.coords, 
              multiPlayerData: data,
              visitTime: $scope.visitTime
            }

            $scope.newRoomObject = {'initiator': $scope.userObject}
            Rooms.create($scope.newRoomObject).then(function(ref){
              console.log('you initiated a new room, the firebase ref for that room:', ref);
              $scope.venuesLoaded = true;
            })
          }).
          error(function(data, status, headers, config){
              console.log(status);
          });
      }//first if statement closes 
      //if no rooms exist then create a new room, populate it with the initiator 
      $http({method: 'GET', url: '/venues', params: {latLng: $scope.latLngString}}).
        success(function(data, status, headers, config){
          console.log('rest controller', data.length);
          $scope.multiPlayerData = data;
          $scope.venuesLoaded = true;

          var random = $scope.multiPlayerData[Math.floor(Math.random() * ($scope.multiPlayerData.length))];
          console.log('Rando from ctrl: ', random)
          nomSelector.setRandom(random);

          $scope.userObject = {
            latLng: $scope.coords, 
            multiPlayerData: data,
            visitTime: $scope.visitTime
          }

          $scope.newRoomObject = {'initiator': $scope.userObject}
          Rooms.create($scope.newRoomObject).then(function(ref){
            console.log('you initiated a new room, the firebase ref for that room:', ref);
            $scope.venuesLoaded = true;
          })
        }).
        error(function(data, status, headers, config){
            console.log(status);
        });

    });//geolocation query closes
  } //initialize function closes
}]);
