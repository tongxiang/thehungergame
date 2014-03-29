'use strict';

angular.module('hungergame', ['ngCookies', 'ngResource', 'ui.bootstrap', 'ui.router', 'hungergame.system', 'hungergame.restaurants' , 'geolocation', 'firebase', 'google-maps', 'timer']).
    constant('FIREBASE_URL', 'https://thehungergame.firebaseio.com/')

angular.module('hungergame.system', []);
angular.module('hungergame.restaurants', ['ngAnimate', 'angular-gestures', 'firebase', 'google-maps', 'timer', 'angularSpinner']);