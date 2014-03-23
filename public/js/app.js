'use strict';

angular.module('hungergame', ['ngCookies', 'ngResource', 'ui.bootstrap', 'ui.router', 'hungergame.system', 'hungergame.restaurants' , 'geolocation']);

angular.module('hungergame.system', []);
angular.module('hungergame.restaurants', ['ngAnimate']);