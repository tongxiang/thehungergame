// 'use strict'

// //Create our Firebase reference 
// var geoFenceRef = new Firebase('https://thehungergame.firebaseIO.com');

// //We want to store the intiator's geocoded latlng somewhere in firebase >>> 

// //Each time a new browser is opened, when the geolocation function runs, we want to store this latlng information in firebase.

// //if there are no users logged in, the first user's latlng will immediately be input into the database. 

// //there are also a lot of 

// //Each time a new user goes to the site, their geolocation information will be sent to firebase, where the getDistanceInKmFromLatLon function is run on the original latlng information (perhaps we can just run this with the array[0] element, which will be the first person logged in.)

// //Let's get to the point where if they are validated, their screen just console logs something. 

// //We can test this by changing their sensors to register a latlng in, say, Beijing.

// //LATER, ONCE WE HAVE THE MVP WORKING: 
// //If getDistanceInKmFromLatLon returns a value < .1 (100 meters), then they are given access to the specific data. 


// //GEOFENCE 2.0
// //right now, let's just have this check, and if the person isn't inthe right latlng, we don't let them enter the room. 

// //GEOFENCE 3.0
// //Later we can develop separate rooms for different locations. 

// //But do we need to create new room objects, where all the players in the same room will have their pages updated with the information? 

// //DATA SNAPSHOT - A DATASNAPSHOT contains data from a Firebase location. Anytime you read Firebase data, you receive the data as a DataSnapshot, which contains data from a Firebase location. Anytime you read Firebase data, you receive the data as a data snapshot. 

// //on() is a function that is used to listen for data changes in a particular location This is the primary way to read data from Firebase. Yur callback will be triggered for the initial data and again whenever the data changes. Use off() to stop receiving updates.

// //GEOFIRE LIBRARY 

// //Include geoFire.js, and create a geoFire object with the firebase reference 

// geofire: NOT USEFUL FOR OUR PURPOSES

// //ANGULAR THINKSTER TUTORIAL - http://www.thinkster.io/angularjs/S2MxGFCO0B/3-communicating-with-a-server-using-a-service-and-resource

// //'use strict';
 
// app.factory('Post', function ($resource) {
//   return $resource('https://FIREBASE-URL.firebaseIO.com/posts/:id.json');
// });

// //they create a custom service--the one above--for interacting with the firebase "posts" object. Firebase stores all data in objects, and specifying posts.json tells Firebase to store all the posts in an object called posts. (I don't think we need to create this on our end.) 

// //They then inject the service into the controller, and then retrieve the posts by setting $scope.posts = Post.get(). This sends a get request to our resource url without any parameters (so the :id part is ignored). 

// //So in our restaurants controller, we can create a new method that will use the service to save the post. see below: 

// $scope.submitPost = function () {
//   Post.save($scope.post); //we save the thing in $scope.post into the Post.save function, and then we can 
//   $scope.post = {url: 'http://, title: ''};' //this right here is resetting what $scope.post is equal to. Now $scope.post is clear and empty. 
// };

// //After storing an object into Firebase, it returns the ID of the object that's a reference to the saved post in this format: {name: (postId here)}. We can store this with our $scope.posts as a reference. 

// Post.save($scope.post, function (ref) {
//   $scope.posts[ref.name] = $scope.post
//   $scope.post = {url: 'http://', title: ''};
// });

// //so our post object persists in the scope with a key[ref.name] that comes from Angular (similar to Mongo's _id). 

// //we can also further interact with the Post service with a delete function by passing in the PostId in the ng-repeat directive in the post div

// <div ng-repeat="(postId, post) in posts">

// //and then we can also update our ng-click with a deletePost function that uses this postId, and passes it into deletePost. 

// //Then we can update our delete function to use our post service: 

// $scope.deletePost = function (postId) {
//   Post.delete({id: postId}, function () {
//     delete $scope.posts[postId];
//   });
// };

// //NOte that we're interacting with the Post service and applying $resource's default methods on it by just calling Post.delete

// //ANGULAR FIRE - THREE WAY DATA BINDING - http://www.thinkster.io/angularjs/wKhWRNnWuX/4-three-way-data-binding-with-a-real-time-server

// //So we need to develop a new service to figure out 

// var degrees_to_radians = function(degrees){
//     return degrees * (Math.PI/180);
// }

// var getDistanceInKmFromLatLon = function(lat1,lon1,lat2,lon2){
//     var earthRadius = 6371;
//     var differenceLatitude = degrees_to_radians(lat2-lat1)
//     var differenceLongitude = degrees_to_radians(lon2-lon1);
//   var a = 
//     Math.sin(differenceLatitude/2) * Math.sin(differenceLatitude/2) +
//     Math.cos(degrees_to_radians(lat1)) * Math.cos(degrees_to_radians(lat2)) * 
//     Math.sin(differenceLongitude/2) * Math.sin(differenceLongitude/2)
//     ; 
//   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
//   var distanceBetweenPoints = earthRadius * c; // Distance in km
//   return distanceBetweenPoints;
// };