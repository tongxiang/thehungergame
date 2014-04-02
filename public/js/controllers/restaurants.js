'use strict'

angular.module('hungergame.restaurants')
  .controller('RestaurantsController', ['$scope', '$stateParams', '$location', 'Global', 'Restaurants', 'geolocation', '$http', 'nomSelector', 'usSpinnerService', 'Rooms', '$state', '$rootScope', function ($scope, $stateParams, $location, Global, Restaurants, geolocation, $http, nomSelector, usSpinnerService, Rooms, $state, $rootScope) {

  $scope.global = Global;
  $scope.venuesLoaded = false;
  $scope.newRoomObject = {};
  $scope.userObject = {};
  $scope.userAddedToFirebase = false;
  $scope.roundsOver = 0;
  $scope.playing = true;
  $scope.gameOver = false;
  $rootScope.multiWinner;
  $rootScope.winner;

  $scope.reset = function(){
    $rootScope.madeSelection = null;
    $rootScope.multiWinner = null;
    $rootScope.winner = null;
    nomSelector.clearNom();
    console.log('RESETTING IS HAPPENING NOW', $rootScope.winner)
  }

  $scope.solo = function() {
    console.log('solo player game started')
    console.log('before solo value', $rootScope.singlePlayer)
    $rootScope.singlePlayer = true;
    $rootScope.getYoFood = true;
    // $rootScope.getYoFood = true;
    console.log('after solo value', $rootScope.singlePlayer)
    Rooms.modifyEntrants($scope.roomId, function(entrantsCount){
      return entrantsCount - 1;
    }).then(function(snapshot){
      if (!snapshot){
        console.log('entrants subtract function failed');
      } else {
        console.log('entrants snapshot', snapshot)
      }
    }, function(err){
      console.log('entrants transaction failed: ', err)
    })
  }
  $scope.round = {
    //make a duration timer that is dynamic with the timer directive
    roundOver: false,
    elapsed: function() {
      return 30 - $scope.roundTime;
    }
  } 

  $scope.multi = function(){
    $rootScope.singlePlayer = false;
    $rootScope.getYoFood = false;
    $rootScope.madeSelection = false;
    Rooms.modifyEntrants($scope.roomId, function(entrantsCount){
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


  $scope.venuesLoaded = false;
  if ($rootScope.singlePlayer){
    $scope.winner = nomSelector.getNom();
  } 
  
  // Ends user round on a spacebar keypress or a phone shake
  $scope.shakeNbake=function() {
    window.addEventListener("keypress", checkKeyPressed, false);
//wrap this in a condition, once they end it, they can't end it again. 
    function checkKeyPressed(e) {
      if($scope.playing){
        if (e.charCode == "32") {
          $scope.$broadcast('timer-stop');
          $scope.playing = false 
        }
      }
    }

    window.addEventListener('shake', shakeEventDidOccur, false);
    // Ends user round on a spacebar keypress or a phone shake

    // Define a custom method to fire when shake occurs.
    function shakeEventDidOccur () {
      if($scope.playing){
        $scope.$broadcast('timer-stop');
        // if (confirm("Oh no you didn't?")) {
        //     alert("Ohh bit*h we bout to fight!")
        // }
        $scope.playing = false
      }
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

    
    // Multiplayer
    if (!($rootScope.singlePlayer)){
      Rooms.modifyRoundsOver($scope.roomId, function(roundsCompleted){
        return roundsCompleted + 1;
      }).then(function(snapshot){
        if (!snapshot){
          console.log('rounds add function failed');
        } else {
          console.log('rounds snapshot', snapshot)
        }
      }, function(err){
        console.log('rounds transaction failed: ', err)
      })
    }


    // Single Player
    if($rootScope.singlePlayer) {
      console.log('Timer Stopped - data = ', data);
      $scope.nom_count = nomSelector.nomCount()
      console.log('Nom count from service: ', $scope.nom_count)
      if($scope.nom_count>0) {
        $rootScope.madeSelection = true;
      } else {
        $rootScope.madeSelection = false;
      }
    }
    
    console.log('madeSelection?: ', $rootScope.madeSelection)
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
    if (difference/1000 < 20){ //we can change this later
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

  // function entrantsChecker(number){
  //   if (number === 0){
  //     return false;
  //   }
  //   return true
  // }

  function checkTimeLatLng (roomArray){
    console.log('checkTimeLatLng running')

    for (var room in roomArray) {
      // console.log('this the room: ', room)

      // console.log('room Value: ', roomArray[room])
      // console.log('room initiator: ', roomArray[room]['initiator'])
      // console.log('room initiator: ', roomArray[room]['initiator']['visitTime'])
      var initiator = roomArray[room]['initiator']
      var entrants = initiator['entrants']
      var visitTime = initiator['visitTime']
      var latLng = initiator['latLng']
      var lat = latLng['lat'];
      var lng = latLng['long'];
      var multiPlayerData = initiator['multiPlayerData']
      // console.log('vs.')
      // console.log('scope visitTime: ', $scope.visitTime)
      var timeBoolean = withinTimeInterval(visitTime, $scope.visitTime)
      var distanceCheck = getDistanceFromLatLonInKm(lat, lng, $scope.coords.lat, $scope.coords.long)
      // var entrantsCheck = entrantsChecker(entrants);

      console.log('Result of timeBoolean: ', timeBoolean);
      console.log('Result of distanceCheck: ', distanceCheck);
      if (timeBoolean && (distanceCheck < 0.2)){
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
                    var random = data[Math.floor(Math.random() * data.length)]
                    nomSelector.setRandom(random)
                    $scope.restaurants = data;
                    console.log('restaurants data from new room creation', $scope.restaurants)
                    $scope.venuesLoaded = true;
                    var newRoom = {
                      initiator: {
                        latLng: ($scope.coords || {'lat': 0, 'long': 0}),
                        visitTime: ($scope.visitTime || 0),
                        entrants: 0,
                        multiPlayerData: data, 
                        roomId: '',
                        roundsOver: 0,
                        gameOver: false,
                        winningRestaurant: {}
                      }
                    }

                    Rooms.create(newRoom);

                    Rooms.all.$on('child_added', function(snapshot){
                      $scope.roomId = snapshot.snapshot.name;
                      Rooms.addRoomIdToInitiator($scope.roomId).then(function(ref){
                        console.log('successfully changed initiator', ref)
                      });
                      nomSelector.setId($scope.roomId);
                      Rooms.getEntrants($scope.roomId).$on('value', function(value){
                        console.log('entrantsNumber val', value.snapshot.value)
                        $scope.entrantsNumber = value.snapshot.value
                      })
                      Rooms.getRoundsOver($scope.roomId).$on('value', function(value){
                        console.log('number of roundsOver', value.snapshot.value)
                        $scope.roundsOver = value.snapshot.value
                        if ($scope.roundsOver == $scope.entrantsNumber){
                          $rootScope.getYoFood = true 
                          console.log('inside rounds over equality')
                          Rooms.modifyGameOver($scope.roomId, function(gameStatus){
                            return true;
                            console.log('modifying game over property to be true')
                          }).then(function(snapshot){
                            if (!snapshot){
                              console.log('game over function failed');
                            } else {
                              console.log('gameover snapshot', snapshot)
                              console.log('winning restaurant', snapshot.val())
                              console.log('winning restaurant votes array', $scope.restaurantVotes)
                              var winningRest = []
                              var highestVoteCount = 0
                              for (var rest in $scope.restaurantVotes){
                                if ($scope.restaurantVotes[rest].userVotes >= highestVoteCount){
                                  highestVoteCount = $scope.restaurantVotes[rest].userVotes;
                                  winningRest.push($scope.restaurantVotes[rest])
                                }
                              }
                              console.log('array of winning BOOM BOWW', winningRest)
                              $rootScope.multiWinner = winningRest.pop()
                              console.log('the ULTIMATE WINNER', $rootScope.multiWinner);
                              $rootScope.multiWinner['map'] = {
                                                      center: {
                                                        latitude: $rootScope.multiWinner.latLng[0],
                                                        longitude: $rootScope.multiWinner.latLng[1]
                                                      },
                                                      zoom: 14,
                                                    }
                              Rooms.broadCastWinningGame($scope.roomId, winningRest);
                            }
                          }, function(err){
                            console.log('gameover transaction failed: ', err)
                          })
                          console.log('game over!!!')
                        }
                      })
                      Rooms.getRestaurantVotes($scope.roomId).$on('value', function(value){
                        console.log('get restaurant votes array', value.snapshot.value);
                        $scope.restaurantVotes = value.snapshot.value;
                      })
                      Rooms.getGameOver($scope.roomId).$on('value', function(value){
                        console.log('is game over?', value.snapshot.value)
                        $scope.gameOver = value.snapshot.value
                      })
                      Rooms.getWinningRestaurant($scope.roomId).$on('value', function(value){
                        console.log('THIS IS THE WINNING RESTAURANT', value.snapshot.value)
                        if (!($rootScope.singlePlayer)){
                          $scope.winner = value.snapshot.value;
                        }
                      })
                      // console.log('snapshot id from child added', snapshot.snapshot.name)
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
          $scope.joinRoom = true;
          $scope.restaurants = availableRoom.multiPlayerData;
          console.log('restaurants data from firebase', $scope.restaurants);
          $scope.venuesLoaded = true;
          $scope.roomId = availableRoom.roomId;
          nomSelector.setId($scope.roomId);
          Rooms.getEntrants($scope.roomId).$on('value', function(value){
            console.log('entrantsNumber val', value.snapshot.value)
            $scope.entrantsNumber = value.snapshot.value
          })
          Rooms.getRestaurantVotes($scope.roomId).$on('value', function(value){
            console.log('get restaurant votes array', value.snapshot.value);
            $scope.restaurantVotes = value.snapshot.value;
          })
          Rooms.getRoundsOver($scope.roomId).$on('value', function(value){
            console.log('number of roundsOver', value.snapshot.value)
            $scope.roundsOver = value.snapshot.value
            if ($scope.roundsOver == $scope.entrantsNumber){
              $rootScope.getYoFood = true;
              console.log('inside rounds over equality')
              Rooms.modifyGameOver($scope.roomId, function(gameStatus){
                return true;
                console.log('modifying game over property to be true')
              }).then(function(snapshot){
                if (!snapshot){
                  console.log('game over function failed');
                } else {
                  console.log('gameover snapshot', snapshot)
                  console.log('winning restaurant', snapshot.val())
                  console.log('winning restaurant votes array', $scope.restaurantVotes)
                  var winningRest = []
                  var highestVoteCount = 0
                  for (var rest in $scope.restaurantVotes){
                    if ($scope.restaurantVotes[rest].userVotes >= highestVoteCount){
                      highestVoteCount = $scope.restaurantVotes[rest].userVotes;
                      winningRest.push($scope.restaurantVotes[rest])
                    }
                  }
                  console.log('array of winning BOOM BOWW', winningRest)
                  $rootScope.multiWinner = winningRest.pop()
                  console.log('the ULTIMATE WINNER', $rootScope.multiWinner);

                  $rootScope.multiWinner['map'] = {
                                          center: {
                                            latitude: $rootScope.multiWinner.latLng[0],
                                            longitude: $rootScope.multiWinner.latLng[1]
                                          },
                                          zoom: 14,
                                        }
                                        console.log('google maps object successfully attached:', $rootScope.multiWinner.map)
                  Rooms.broadCastWinningGame($scope.roomId, winningRest);
                }
              }, function(err){
                console.log('gameover transaction failed: ', err)
              })
              console.log('game over!!!')
            }
          })
          Rooms.getGameOver($scope.roomId).$on('value', function(value){
            console.log('is game over?', value.snapshot.value)
            $scope.gameOver = value.snapshot.value
            if ($scope.gameOver) {
              console.log('this is the final restaurant votes array--a winner has been determined', $scope.restaurantVotes)
            }
          })
          // console.log('entrants', $scope.numberOfEntrants)
        }
      })
    });//geolocation query closes
  } //initialize function closes
}]); //closing controller 