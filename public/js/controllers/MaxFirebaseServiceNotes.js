'use strict';

app.factory('Message',
function($firebase, FIREBASE_URL, $routeParams) {
var instanceId = $routeParams.instanceId;
var ref = new Firebase(FIREBASE_URL + 'instances/' + instanceId);
var messages = $firebase(ref);
    var Message = {
        all: messages,
        create: function(message) {
            return messages.$add(message);
        },
        find: function(messageId) {
            return messages.$child(messageId);
        },
        delete: function(messageId) {
            return messages.$remove(messageId);
        }
    };
return Message;
});




'use strict';

// Save instance to Firebase
app.factory('Instance',
function($firebase, FIREBASE_URL) {
var ref = new Firebase(FIREBASE_URL + 'instances');
var instances = $firebase(ref);

    var Instance = {
        all: instances,
        create: function(instance) {
        return instances.$add(instance);
        },
        find: function(instanceId) {
        return instances.$child(instanceId);
        },
        delete: function(instanceId) {
        return instances.$remove(instanceId);
        },
        submitMessage: function(instanceId, messageInput) {
        return instances.$child(instanceId).$child('messages').$add(messageInput);
        }
    };

return Instance;
});




// instanceView controller
'use strict';

app.factory('Message',
function($firebase, FIREBASE_URL, $routeParams) {
var instanceId = $routeParams.instanceId;
var ref = new Firebase(FIREBASE_URL + 'instances/' + instanceId);
var messages = $firebase(ref);
var Message = {
all: messages,
create: function(message) {
return messages.$add(message);
},
find: function(messageId) {
return messages.$child(messageId);
},
delete: function(messageId) {
return messages.$remove(messageId);
}
};
return Message;
});




// View ALL instances controller

'use strict';

app.controller('InstancesCtrl', function($scope, $location, Instance) {
$scope.instance = {name: '', url: 'http://', created: new Date(), messages: {}};
$scope.instances = Instance.all;

$scope.submitInstance = function() {
Instance.create($scope.instance).then(function(ref) {
$scope.instance = {name: '', url: 'http://', dateCreated: new Date()};
$location.path('/instances/' + ref.name());
});
};
$scope.deleteInstance = function(instanceId) {
Instance.delete(instanceId);
};
});


console.log('All withinTimeInterval tests have failed! You initiated a new room and its ref is:', ref, 'your new rooms id:', ref.path.m[1]);

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

