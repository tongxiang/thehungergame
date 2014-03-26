'use strict';

// http://www.sitepoint.com/creating-slide-show-plugin-angularjs/

var hungergame=angular.module('hungergame.restaurants');

// http://docs.angularjs.org/guide/directive

// Moved controller to restaurants controller
// hungergame.controller('SliderController', function($scope) {
//     $scope.restaurants=[{src:'img1.png',title:'Pic 1'},{src:'img2.jpg',title:'Pic 2'},{src:'img3.jpg',title:'Pic 3'},{src:'img4.png',title:'Pic 4'},{src:'img5.png',title:'Pic 5'}];
// });

hungergame.directive('slider', function ($timeout, $state) {
    return {
        restrict: 'AE',
    /*
    The restrict option is typically set to:

    'A' - only matches attribute name
    'E' - only matches element name
    'C' - only matches class name
    These restrictions can all be combined as needed:

    'AEC' - matches either attribute or element or class name
    */
        replace: true,
        scope:{
            restaurants: '=',
        },
        link: function (scope, elem, attrs) {

            scope.currentIndex=0;
            scope.playing=false;
            scope.nom_count = 0;
            scope.noms_restaurants = [];

            scope.start=function(){
                if(!scope.playing) {
                    sliderFunc();
                    scope.playing=true;
                }
            };

            scope.end=function(){
                if(scope.playing) {
                  $timeout.cancel(timer);
                  scope.playing=false;
                }
            };

            scope.next=function($event){
                // This is the next restaurant to be displayed's index
                var nextIndex = (scope.currentIndex<scope.restaurants.length-1) ? scope.currentIndex+1 : 0;
                if(!$event) {
                  scope.currentIndex = nextIndex;
                } else {
                    // This is the swiped restaurant <li>
                    var ele = $event.target.parentNode;
                    console.log('next ele: ', ele);

                    // This is the swiped restaurant's siblings <li>
                    var lis = $event.target.parentNode.parentNode.children;

                    // This removes the class for the appropriate animation
                    lis[nextIndex].classList.remove('reverse');
                    ele.classList.remove('reverse');

                    // Changes the restaurant
                    scope.currentIndex = nextIndex;
                }
            };

            scope.prev=function($event){
                // This is the prev restaurant to be displayed's index
                var prevIndex = (scope.currentIndex) ? scope.currentIndex-1:scope.restaurants.length-1;

                // This is the swiped restaurant <li>
                var ele = $event.target.parentNode;
                console.log('prev ele: ', ele);

                  // This is the swiped restaurant's siblings <li>
                var lis = $event.target.parentNode.parentNode.children;
                console.log("lis: ",lis);

                // This removes the class for the appropriate animation
                lis[prevIndex].classList.add('reverse');
                ele.classList.add('reverse');

                // Changes the restaurant
                scope.currentIndex = prevIndex;
            };

            scope.swipedUp=function($event){
                var ele = $event.target;
                console.log('this is the ele: ', ele);
                ele.classList.add('swipedup');
                scope.nom_count +=1;

                // Removes the list item
                $timeout (function() {
                    if (scope.playing) {
                      var removed = scope.currentIndex-1;
                    } else {
                      removed = scope.currentIndex,1;
                    }
                      var nom = scope.restaurants.splice(removed,1)[0];
                      scope.noms_restaurants.push(nom);
                      console.log("NOM! ", nom);
                      if (scope.noms_restaurants.length >= 3) {
                        console.log('noms satisfied');
                        arrReplace(scope.restaurants,scope.noms_restaurants);
                        // scope.noms_restaurants.forEach(function(ele) {
                        //   scope.restaurants.push(ele);
                        // })
                        // scope.restaurants.push({ src:'http://lorempixel.com/500/500',title:'Random2'});
                        console.log('TESING 123!:', scope.restaurants)
                      }
                      // console.log("yes restaurants: ", scope.yes_restaurants)

                      // when scope.yes_restaurants.length = 3, got to final round
                      scope.next();
                      ele.classList.remove('swipedup');
                      console.log("after index: ", scope.currentIndex);
                  }, 1000);
            }

            scope.swipedDown=function($event){
                var ele = $event.target;
                console.log('this is the ele: ', ele);
                ele.classList.add('swipeddown');

                // Removes the list item
                $timeout (function() {
                    if (scope.playing) {
                      var removed = scope.currentIndex-1;
                    } else {
                      removed = scope.currentIndex,1;
                    }
                      scope.restaurants.splice(removed,1)
                      scope.next();
                      ele.classList.remove('swipeddown');
                      console.log("after index: ", scope.currentIndex);
                  }, 1000);
            }

            scope.moreInfo=function($event){
              // End slideshow if playing
              scope.end();

              scope.restaurants[scope.currentIndex].info=!scope.restaurants[scope.currentIndex].info

              scope.restaurants[scope.currentIndex].foodpic=!scope.restaurants[scope.currentIndex].foodpic

              // // Hide current card
              // scope.restaurants[scope.currentIndex].visible=false;

              // var ele = $event.target;
              // console.log('this is the ele: ', ele);
              // ele.classList.add('flip');

            }

            scope.$watch('currentIndex',function(){
                scope.restaurants.forEach(function(restaurant){
                    restaurant.visible=false;
                    restaurant.foodpic=true;
                    restaurant.info=false;
                });
                scope.restaurants[scope.currentIndex].visible=true;
            });

            // scope.$watch('info',function(){
            //     scope.restaurants.forEach(function(restaurant){
            //         restaurant.visible=false;
            //     });
            //     scope.restaurants[scope.currentIndex].visible=true;
            // });

            // attempt to watch the nom count
            scope.$watch('nom_count',function(){
                  if (scope.nom_count === 3) {
                    console.log('nom_count is: ', scope.nom_count)
                    $state.go('home.transition')
                    scope.restaurants[scope.currentIndex].visible=false;
                  }
            });

    /* Start: For Automatic slideshow*/

            var timer;
            var interval = 500;

            var sliderFunc=function(){
                timer=$timeout(function(){
                    scope.next();
                    timer=$timeout(sliderFunc,interval);
                },interval);
            };

            var arrReplace = function(arr1, arr2){
              // Clears the arr1
              arr1.splice(0,arr1.length);

              // Adds arr2 elements to arr1
              arr2.forEach(function(el) {
                arr1.unshift(el);
              })

              // Reset arr2
              arr2.splice(0,arr2.length);

            }

            scope.$on('$destroy',function(){
                $timeout.cancel(timer);
            });

    /* End : For Automatic slideshow*/

        },
        templateUrl:'../views/slider_temp.html'
    };
});