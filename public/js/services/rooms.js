'use strict';

angular.module('hungergame.restaurants').factory('Rooms', ['$firebase', 'FIREBASE_URL',
    function($firebase, FIREBASE_URL){
        var ref = new Firebase(FIREBASE_URL + 'rooms'); //this is a Firebase reference, which is a pointer to a location inside your Firebase. 
        var rooms = $firebase(ref);

        var Rooms = {
            all: rooms, 
            create: function(roomObject){
                return rooms.$add(roomObject);
            }, 
            find: function(roomId){
                return rooms.$child(roomId);
            },
            delete: function(roomId){
                return rooms.$remove(roomId); //$remove takes a single optional argument, a key. Removes child referenced by that key. 
            }, 
            findRoomAndAddUser: function(roomId, newUserObject){
                return rooms.roomId.$add(newUserObject)
            }
        };
        return Rooms;
    }
]);

findAndReplace: function(roomId, roomObject){

}

//Later, I make each rooms object a little bit more nuanced--I can attach a global data property, independent of the individual users, to each room and sync the data that way. That way, we can contain the votes properties there. 

//$firebase service takes a single argument: a Firebase reference. Note that you may apply queries and limits on it if you want to only sync a subset of your data. WHAT DOES THIS MEAN??? If we want to access a particular room, what sorts of queries and limits should we set on it? 

//the object returned by $firebase will automatically be kept in sync with the remote Firebase data. Firebase >>> object returned. But not the other way around. 

//$update(value)

//$scope.items.$set({foo: "bar", baz: "boo"})
//$scope.items.$update({baz: "fizz"}); //the data is now {foo: "bar", baz: "fizz"}. 

$firebase(ref)['keyOfTargetRoom'].restaurantKey.userVotes.$update({userVotes: 1++})

Below is how firebase will return the entire thehungergame database. Each added geocode is assigned a firebase id as its key. 

How we can access the first geocode object by URL, and then directly manipulate it at the following URL: 

https://thehungergame.firebaseio.com/geocodes/-JJEpuHVi1WHBJn2rq8m

can also reference it by service.key, or Rooms.roomId.$save("asdfsdfsfs")

{
  "geocodes" : {
    "-JJEpuHVi1WHBJn2rq8m" : {
      "lat" : 40.705876499999995,
      "long" : -74.0076811
    }
  }
}

