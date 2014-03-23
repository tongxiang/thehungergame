'use strict';

// hungergame.controller('SliderController', function($scope) {
//     $scope.images=[{src:'img1.png',title:'Pic 1'},{src:'img2.jpg',title:'Pic 2'},{src:'img3.jpg',title:'Pic 3'},{src:'img4.png',title:'Pic 4'},{src:'img5.png',title:'Pic 5'}];
// });

angular.module('hungergame.restaurants')
  .controller('RestaurantsController', ['$scope', '$stateParams', '$location', 'Global', 'Restaurants', 'geolocation',function ($scope, $stateParams, $location, Global, Restaurants, geolocation) {
    $scope.global = Global;


    // Get player's location;
    geolocation.getLocation().then(function(data) {
        $scope.coords = {'lat':data.coords.latitude, 'long':data.coords.longitude};
    });


    // +++ Deprecated +++

    // // Controller  for Carousel
    //   $scope.myInterval = 1000;
    //    // Initializing  slide rray
    $scope.images = [
        { src:'http://kalbiburger.com/wp-content/uploads/2010/06/Kalbi_Burger.jpg',title:'Burger'},
        { src:'http://www.littlebabysicecream.com/wp-content/uploads/2012/09/pizza.jpg',title:'Pizza'},
        { src:'http://www.tacobell.com/static_files/TacoBell/StaticAssets/images/menuItems/pdp/pdp_cantina_burrito_steak.png',title:'Burrito'},
    ];

    // $scope.direction = 'left';
    // $scope.currentIndex = 0;

    // $scope.setCurrentSlideIndex = function (index) {
    //     $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
    //     $scope.currentIndex = index;
    // };

    // $scope.isCurrentSlideIndex = function (index) {
    //     return $scope.currentIndex === index;
    // };

    // $scope.nextSlide = function () {
    //     $scope.direction = 'right';
    //     $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
    // };

    // $scope.prevSlide = function () {
    //     $scope.direction = 'left';
    //     $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.slides.length - 1;
    // };

// **************************************************** //

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