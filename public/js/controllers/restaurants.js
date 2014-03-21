'use strict';

angular.module('hungergame.restaurants').controller('RestaurantsController', ['$scope', '$stateParams', '$location', 'Global', 'Restaurants', function ($scope, $stateParams, $location, Global, Restaurants) {
    $scope.global = Global;

    $scope.create = function() {
        var restaurant = new Restaurants({
            title: this.title,
            content: this.content
        });
        restaurant.$save(function(response) {
            $location.path('restaurants/' + response._id);
        });

        this.title = '';
        this.content = '';
    };

    $scope.remove = function(restaurant) {
        if (restaurant) {
            restaurant.$remove();

            for (var i in $scope.restaurants) {
                if ($scope.restaurants[i] === restaurant) {
                    $scope.restaurants.splice(i, 1);
                }
            }
        }
        else {
            $scope.restaurant.$remove();
            $location.path('restaurants');
        }
    };

    $scope.update = function() {
        var restaurant = $scope.restaurant;
        if (!restaurant.updated) {
            restaurant.updated = [];
        }
        restaurant.updated.push(new Date().getTime());

        restaurant.$update(function() {
            $location.path('restaurants/' + restaurant._id);
        });
    };

    $scope.find = function() {
        Restaurants.query(function(restaurants) {
            $scope.restaurants = restaurants;
        });
    };

    $scope.findOne = function() {
        Restaurants.get({
            restaurantId: $stateParams.restaurantId
        }, function(restaurant) {
            $scope.restaurant = restaurant;
        });
    };
}]);