'use strict';

angular.module('hungergame', ['ngCookies', 'ngResource', 'ui.bootstrap', 'ui.router', 'hungergame.system', 'hungergame.restaurants' , 'geolocation', 'google-maps']);

angular.module('hungergame.system', []);
angular.module('hungergame.restaurants', ['ngAnimate', 'angular-gestures', 'google-maps']);