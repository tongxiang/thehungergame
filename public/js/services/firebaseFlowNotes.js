// Geocode.create($scope.coords).then(function(ref){
//     console.log('you have pushed in your current latlng', ref)
// })

// three asynchronous requests: 

// geolocation.getLocation()

// findNearBy ($http GET method)

// Geocodes.create ($firebase method)

// log the time of the query - time based restrictions for getting in the same room

// ROOMS
// [[{initiator}, {entrant}, {entrant}],[{initiator}, {entrant}], [{initiator}, {entrant}, {entrant}]]


// INITIATOR FLOW 
// 1) initiator navigates to site (loading page, perhaps?) - only Single Player button is displayed 
// 2) timestamp determined, attached to restaurants $scope
// 3) geolocation function automatically begins running 
// 4) GET firebase ROOMS object 
// 5) timestamp check on each ROOMS[0] object, comparing initiators timestamp to the timestamp of each ROOMS[0] user (the initiator of each room)
// 6) if timestamp check returns false (i.e., initiators time is not within 30 seconds of any other rooms creation), then we do not run the latlng check. (7, 8, 9 happen after check returns false)
// 7) now we CREATE a new room in firebase with the initiators LatLng and timestamp
// 8) Foursquare API query begins with LatLng
// 9) Another button is displayed (Create New MultiPlayer Room) 
// 10) When Foursquare data returns, attach to $scope.restaurants as well as to the ROOM[0] user object as data. 

// ENTRANT FLOW

// 1) entrant navigates to site (loading page, perhaps?)
// 2) timestamp determined, attached to restaurants $scope
// 3) geolocation function automatically begins running 
// 4) GET firebase ROOMS object
// 5) timestamp check on each ROOMS[0] object, comparing entrants timestamp to the timestamp of each ROOMS[0] user
// 6) if timestamp check on any ROOMS[0] user returns true (entrants time is within 30 seconds of any other rooms creation), then we run the latlng check
// 7) latlng check: if latlng distance returns true (entrant and initiator are within x meters), then >>> 
// 8) from that ROOMS[0] user we take their user.data (restaurants data), apply it to the entrants data, and then apply it to the entrants $scope.restaurants 
// 9) Buttons display > (Single Player) & (Join MultiPlayer Room)
// 10) If multiplayer room is joined, displays loading wheel until foursquare API returns and data is attached to entrants scope. 
// 10) if entrant swipes up a restaurant the vote property of that restaurants is added one, if swipe down the vote property is subtracted one
// 11) After end of round, voting data from all users is sent to Firebase.
// 12) Each client runs a GET Firebase query
// 13) voting logic occurs in client, winner is displayed 

// SINGLEPLAYER FLOW 
// 1) singleplayer navigates to site, initialize function begins //Or do we want a different singlePlayerInitialize function, instead? 


// //Later, I make each rooms object a little bit more nuanced--I can attach a global data property, independent of the individual users, to each room and sync the data that way. That way, we can contain the votes properties there. 

// //$firebase service takes a single argument: a Firebase reference. Note that you may apply queries and limits on it if you want to only sync a subset of your data. WHAT DOES THIS MEAN??? If we want to access a particular room, what sorts of queries and limits should we set on it? 

// //the object returned by $firebase will automatically be kept in sync with the remote Firebase data. Firebase >>> object returned. But not the other way around. 

// //$update(value)

// //$scope.items.$set({foo: "bar", baz: "boo"})
// //$scope.items.$update({baz: "fizz"}); //the data is now {foo: "bar", baz: "fizz"}. 

// $firebase(ref)['keyOfTargetRoom'].restaurantKey.userVotes.$update({userVotes: 1++})

// Below is how firebase will return the entire thehungergame database. Each added geocode is assigned a firebase id as its key. 

// How we can access the first geocode object by URL, and then directly manipulate it at the following URL: 

// https://thehungergame.firebaseio.com/geocodes/-JJEpuHVi1WHBJn2rq8m

// can also reference it by service.key, or Rooms.roomId.$save("asdfsdfsfs")

// {
//   "geocodes" : {
//     "-JJEpuHVi1WHBJn2rq8m" : {
//       "lat" : 40.705876499999995,
//       "long" : -74.0076811
//     }
//   }
// }


// //EXCISED ODDS AND ENDS FROM RESTAURANTS.JS CONTROLLERS WRITING: 

//     //if withinTimeInterval returns true (time difference less than 30 seconds)
//         //latLng check against that [0] user
//         //if distance check works, then room.push(userObject) - we need to create this userObject
//               //attach room[0].multiPlayerData = user.multiPlayerData = $scope.multiPlayerData <<< we need to have separate data variables on our scope between singleplayer and multiplayer 
//               //"join multiplayer room" button appears
//               //BREAK
// //(outside of withinTimeInterval check) >>> run findNearBy function, assign $scope.multiPlayerData = whatever findNearBy returns 
// //create new Room in firebase, push in new User with latLng, timeStamp, and multiPlayerData

// $scope.multiPlayerData = findNearBy(latLngString);//does this work?


// $scope.userObject = {
//   latLng: $scope.coords,
//   multiPlayerData: $scope.multiPlayerData,
//   visitTime: ''
// };

// Rooms.create($scope.newRoomArray.push($scope.userObject)).then(function(ref){
//   console.log('figure out some way to extract the firebaseId (key name) from the ref of this room I just pushed in:', ref);
// });

// //"start new multiplayer room" button appears

// //WHAT INITIALIZES THE SINGLEPLAYER findNearBy function? Is all the multiplayer data acquisition/binding going to happen before even the multiplayer buttons appear?

// //Let's initialize the SINGLEPLAYER findNearBy function when the "singleplayer" button is clicked. So on redirect, we still use this controller, and we tie another function like singlePlayerInit() to ng-init in the single player view. singlePlayerInit will run findNearBy, and attach the results to another variable like $scope.SinglePlayerData.

//           findNearBy(latLngString);



//     // // For multiplayer
//     // scope.players = [];
//     // $scope.multiplayer;


// // **************************************************** //

// //     $scope.create = function() {
// //         var restaurant = new Restaurants({
// //             title: this.title,
// //             content: this.content
// //         });
// //         restaurant.$save(function(response) {
// //             $location.path('restaurants/' + response._id);
// //         });

// //         this.title = '';
// //         this.content = '';
// //     };

// //     $scope.remove = function(restaurant) {
// //         if (restaurant) {
// //             restaurant.$remove();

// //             for (var i in $scope.restaurants) {
// //                 if ($scope.restaurants[i] === restaurant) {
// //                     $scope.restaurants.splice(i, 1);
// //                 }
// //             }
// //         }
// //         else {
// //             $scope.restaurant.$remove();
// //             $location.path('restaurants');
// //         }
// //     };

// //     $scope.update = function() {
// //         var restaurant = $scope.restaurant;
// //         if (!restaurant.updated) {
// //             restaurant.updated = [];
// //         }
// //         restaurant.updated.push(new Date().getTime());

// //         restaurant.$update(function() {
// //             $location.path('restaurants/' + restaurant._id);
// //         });
// //     };

// //     $scope.find = function() {
// //         Restaurants.query(function(restaurants) {
// //             $scope.restaurants = restaurants;
// //         });
// //     };

// //     $scope.findOne = function() {
// //         Restaurants.get({
// //             restaurantId: $stateParams.restaurantId
// //         }, function(restaurant) {
// //             $scope.restaurant = restaurant;
// //         });
// //     };
// // }]);
