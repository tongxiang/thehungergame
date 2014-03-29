'use strict';

angular.module('hungergame', ['ngCookies', 'ngResource', 'ui.bootstrap', 'ui.router', 'hungergame.system', 'hungergame.restaurants' , 'geolocation', 'firebase']).
    constant('FIREBASE_URL', 'https://thehungergame.firebaseio.com/')

angular.module('hungergame.system', []);
angular.module('hungergame.restaurants', ['ngAnimate', 'angular-gestures', 'firebase']);