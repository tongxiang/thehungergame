'use strict'

angular.module('hungergame.restaurants')
  .controller('RestaurantsController', ['$scope', '$stateParams', '$location', 'Global', 'Restaurants', 'geolocation', '$http', 'nomSelector', 'usSpinnerService', 'Rooms', '$state', function ($scope, $stateParams, $location, Global, Restaurants, geolocation, $http, nomSelector, usSpinnerService, Rooms, $state) {

  $scope.global = Global;
  $scope.venuesLoaded = false;
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
    // Ends user round on a spacebar keypress or a phone shake

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

      //
      // if($scope.multiplayer) {
      //   // send random vote to modify scope.multiplayer data


      // }

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
    if (difference/1000 < 6000){ //we can change this later
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

  function checkTimeLatLng (roomArray){
    console.log('checkTimeLatLng running')

    for (var room in roomArray) {
      // console.log('this the room: ', room)

      // console.log('room Value: ', roomArray[room])
      // console.log('room initiator: ', roomArray[room]['initiator'])
      // console.log('room initiator: ', roomArray[room]['initiator']['visitTime'])

      var initiator = roomArray[room]['initiator']
      var visitTime = initiator['visitTime']
      var latLng = initiator['latLng']
      var lat = latLng['lat'];
      var lng = latLng['long'];
      var multiPlayerData = initiator['multiPlayerData']


      // console.log('vs.')
      // console.log('scope visitTime: ', $scope.visitTime)

      var timeBoolean = withinTimeInterval(visitTime, $scope.visitTime)
      var distanceCheck = getDistanceFromLatLonInKm(lat, lng, $scope.coords.lat, $scope.coords.long)

      console.log('Result of timeBoolean: ', timeBoolean);
      console.log('Result of distanceCheck: ', distanceCheck);
      if (timeBoolean && (distanceCheck < 0.1)){
        // $scope.multiPlayerData = multiPlayerData;
        //create new user, but will voting work if we're no longer attached to the initiator via firebase? Do we have an indicator of which function we're on? Can we save the roomId? <<< critical 
        var roomInitiator = initiator
        var roomKey = room 
        roomInitiator['roomId'] = roomKey
        break;
        //returns true or false, true if the user has attaches 
      }
    }
    return roomInitiator;
  }

  //in using findNearBy, notice that both the geolocate and the findNearby functions are asynchronous requests. So we'll have to place findNearby in the geolocate callback or we'll have to use promises to run them.

    // OW Follow Up Note ^^: Neither promises nor chaining are necessary.  By setting the results of the geolocate function to a value on the scope, you can then use that value later on in a findNearBy query by also attaching findNearBy to the scope.  This also allows you to control the view on which the function runs

  $scope.initialize = function() {
    var loginDateTime = new Date;
    $scope.visitTime = loginDateTime.getTime(); 
    geolocation.getLocation().then(function(location) {
      $scope.coords = {'lat':location.coords.latitude, 'long':location.coords.longitude}; 
      $scope.latLngString = location.coords.latitude + ',' + location.coords.longitude;
      $scope.existingRooms = Rooms.all;
      console.log('here is an immediately run console.log of $scope.existingRooms', $scope.existingRooms)

      // THIS IS HOW IT's DONE!! See Anant N.: https://groups.google.com/forum/#!topic/firebase-angular/kbZnPIgeMco

      $scope.existingRooms.$on('loaded', function(val) {
        console.log('all rooms: ', val)
        var availableRoom = checkTimeLatLng(val)
        if (!availableRoom) {
          console.log('a room will be created')
            $http({method: 'GET', url: '/venues',
                params: {latLng: $scope.latLngString}}).
                success(function(data, status, headers, config){
                  console.log('rest controller', data.length);
                    $scope.restaurants = data;
                    $scope.venuesLoaded = true;
                    var newRoom = {
                      initiator: {
                        latLng: $scope.coords,
                        visitTime: $scope.visitTime,
                        entrants: 1,
                        multiPlayerData: data, 
                        roomId: ''
                      }
                    }

                    Rooms.create(newRoom);

                    Rooms.all.$on('child_added', function(snapshot){
                      $scope.roomId = snapshot.snapshot.name;
                      Rooms.addRoomIdToInitiator($scope.roomId).then(function(ref){
                        console.log('successfully changed initiator', ref)
                      });
                      console.log('snapshot id from child added', snapshot.snapshot.name)
                    })

                }).
                error(function(data, status, headers, config){
                    console.log(status);
                });
          //if a room needs to be created, set a variable to the scope, $scope.runFourSquareQuery (default value is false) - have a function on the next page with just ng-init > takes true or false, if true does foursquare query and adds the results to firebase. 
          //
          // Foursquare query
        } else {
          console.log('$scope.restaurants will be set for multiplayer entrants')
          console.log('this is the available room!: ', availableRoom);
          $scope.restaurants = availableRoom.multiPlayerData
          Rooms.addEntrant(availableRoom.roomId, function(entrantsCount){
            return entrantsCount + 1;
          }).then(function(snapshot){
            if (!snapshot){
              console.log('entrants add function failed');
            } else {
              console.log('entrants snapshot', snapshot)
            }
          }, function(err){
            console.log('entrants transaction failed: ', err)
          })
        }
      })
    });//geolocation query closes
  } //initialize function closes
}]); //closing controller 