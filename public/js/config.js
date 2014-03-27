'use strict';

//Setting up route
angular.module('hungergame').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    // For unmatched routes:
    $urlRouterProvider.otherwise('/');

    // states for my app
    $stateProvider
    //   .state('all restaurants', {
    //     url: '/restaurants',
    //     templateUrl: 'views/restaurants/list.html'
    // })
    //   .state('create restaurant', {
    //     url: '/restaurants/create',
    //     templateUrl: 'views/restaurants/create.html'
    // })
    //   .state('edit restaurant', {
    //     url: '/restaurants/:restaurantId/edit',
    //     templateUrl: 'views/restaurants/edit.html'
    // })
    //   .state('restaurant by id', {
    //     url: '/restaurants/:restaurantId',
    //     templateUrl: 'views/restaurants/view.html'
    // })
      .state('home', {
        url: '/',
        templateUrl: 'views/index.html'
    })
      .state('home.firstRound', {
        views: {
            'first': {
                templateUrl: 'views/first.html'
            }
        }
    })
      .state('home.transition', {
        views: {
            'transition': {
                templateUrl: 'views/final_transition.html'
            }
        }
    })
      .state('final', {
        url: '/final',
        templateUrl: 'views/final.html'
    });
}
]);

//Setting HTML5 Location Mode
angular.module('hungergame').config(['$locationProvider',
  function($locationProvider) {
    $locationProvider.hashPrefix('!');
}
]);
