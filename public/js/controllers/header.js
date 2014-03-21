'use strict';

angular.module('hungergame.system').controller('HeaderController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

    $scope.menu = [{
        'title': 'Restaurants',
        'link': 'restaurants'
    }, {
        'title': 'Create New Restaurant',
        'link': 'restaurants/create'
    }];
    
    $scope.isCollapsed = false;
}]);