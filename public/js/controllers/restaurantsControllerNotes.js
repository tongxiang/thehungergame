// console.log('Rooms object length is', Object.keys($scope.existingRooms).length)
//       console.log($scope.userAddedToFirebase)
//       while (!($scope.userAddedToFirebase)){
//         $.each($scope.existingRooms, function(key, value){
//           console.log('within foreach loop, key:', key)
//           if (key.charAt(0) != '$'){
//             console.log('this is a key without $', key);
//             console.log('this is the object corresponding to that key', $scope.existingRooms[key])
//             var timeBoolean = (withinTimeInterval($scope.existingRooms[key].initiator.visitTime, $scope.visitTime))
//             if (timeBoolean && (getDistanceFromLatLonInKm($scope.existingRooms[key].initiator.latLng.lat, $scope.existingRooms[key].initiator.latLng.long, $scope.coords.lat, $scope.coords.long) < 0.1)){

//               $scope.userAddedToFirebase = true
//               console.log($scope.existingRooms[key].initiator, 'is within 100 meters!')
//               //assign the initiator's data to our own
//               $scope.multiPlayerData = $scope.existingRooms[key].initiator.multiPlayerData;
              
//               var random = $scope.multiPlayerData[Math.floor(Math.random() * ($scope.multiPlayerData.length))];
//               console.log('Rando frm ctrl if we pull it data from an initiator: ', random)
//               nomSelector.setRandom(random);

//               //create a new userObject on the scope
//               $scope.userObject = {
//                 latLng: $scope.coords,
//                 // multiPlayerData: $scope.multiPlayerData,
//                 visitTime: $scope.visitTime
//               }
//               Rooms.findRoomAndAddUser(key, $scope.userObject).then(function(ref){
//                 console.log('you added yourself as a new user to an existing room, your firebase ref:', ref)
//                 $scope.venuesLoaded = true;
//               })
//             }
//           }//end of if (key.charAt(0) != '$') statement 
//         })
//       }
//         $scope.userAddedToFirebase = true
//         $http({method: 'GET', url: '/venues', params: {latLng: $scope.latLngString}}).
//           success(function(data, status, headers, config){
//             console.log('rest controller', data.length);
//             $scope.multiPlayerData = data;
//             $scope.venuesLoaded = true;

//             var random = $scope.multiPlayerData[Math.floor(Math.random() * ($scope.multiPlayerData.length))];
//             console.log('Rando from ctrl if withinTimeInterval tests fail: ', random)
//             nomSelector.setRandom(random);

//             $scope.userObject = {
//               latLng: $scope.coords, 
//               multiPlayerData: data,
//               visitTime: $scope.visitTime
//             }

//             $scope.newRoomObject = {'initiator': $scope.userObject}
//             Rooms.create($scope.newRoomObject).then(function(ref){
//               console.log('All withinTimeInterval tests have failed! You initiated a new room and its ref is:', ref, 'your new rooms id:', ref.path.m[1]);
//               $scope.venuesLoaded = true;
//             })
//           }).
//           error(function(data, status, headers, config){
//               console.log(status);
//           });