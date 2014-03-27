'use strict';

// http://www.sitepoint.com/creating-slide-show-plugin-angularjs/

var hungergame=angular.module('hungergame.restaurants');

// http://docs.angularjs.org/guide/directive

// Moved controller to restaurants controller
// hungergame.controller('SliderController', function($scope) {
//     $scope.restaurants=[{src:'img1.png',title:'Pic 1'},{src:'img2.jpg',title:'Pic 2'},{src:'img3.jpg',title:'Pic 3'},{src:'img4.png',title:'Pic 4'},{src:'img5.png',title:'Pic 5'}];
// });

hungergame.directive('slider', function ($timeout, $state, nomPasser) {
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

            // Variables
            scope.currentIndex=0;
            scope.slideshowOn=false;
            scope.nom_count=0;
            scope.nope_count=0;
            scope.playing=true; // Indicates Round
            scope.gameover=false; // Indicates Game

            // Gameplay: Restaurant Choices
            scope.noms_arr = [];
            scope.nopes_arr = [];

            scope.start=function(){
                if(!scope.slideshowOn) {
                    sliderFunc();
                    scope.slideshowOn=true;
                }
            };

            scope.end=function(){
                if(scope.slideshowOn) {
                  $timeout.cancel(timer);
                  scope.slideshowOn=false;
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
                // +++ Incorporate timer here +++
                scope.playing = false;

                // Removes the list item and ends user round
                $timeout (function() {
                      // Sets restaurant selection
                      var nom = restaurantSelector();

                      nom.winner = true;
                      nom.map = {
                        center: {
                          latitude: nom.latLng[0],
                          longitude: nom.latLng[1]
                        },
                        zoom: 14,
                      }

                      // +++ NOTE: Will need to incorporate firebase functionality here for multiplayer !! +++
                        // Attach to a user?
                        // Broadcast event?

                      nomPasser.setNom(nom);
                      scope.noms_arr.push(nom);
                      console.log('Selection lat: ', Math.round(nom.latLng[0]))
                      console.log('Selection long: ', Math.round(nom.latLng[1]))

                      // Ends single user session, makes restaurants array that page sees the user selection
                        // +++ NOTE: Will need to modify to account for scope.restaurant.winner
                      if (scope.noms_arr.length === 1) {
                        arrReplace(scope.restaurants,scope.noms_arr);
                      }

                      // Resets page <li> element
                      ele.classList.remove('swipedup');
                  }, 1000);
            }

            scope.swipedDown=function($event){
                var ele = $event.target;
                console.log('this is the ele: ', ele);
                ele.classList.add('swipeddown');

                // Removes the list item
                $timeout (function() {
                      var nope = restaurantSelector();
                      scope.nopes_restaurants.push(nom);
                      scope.next();
                      ele.classList.remove('swipeddown');
                      // console.log("after index: ", scope.currentIndex);
                  }, 1000);
            }

            // Toggles card flip
            scope.moreInfo=function($event){
              // End slideshow if playing
              scope.restaurants[scope.currentIndex].info=!scope.restaurants[scope.currentIndex].info;
              scope.restaurants[scope.currentIndex].foodpic=!scope.restaurants[scope.currentIndex].foodpic;
            };


            scope.$watch('currentIndex',function(){
                scope.restaurants.forEach(function(restaurant){
                    restaurant.visible=false;
                    restaurant.foodpic=true;
                    restaurant.info=false;
                    restaurant.winner=false;
                });
                scope.restaurants[scope.currentIndex].visible=true;
            });

            // scope.$watch('playing',function(){
            //     if (!scope.playing) {
            //       scope.moreInfo()
            //     }
            // });

            // attempt to watch the nom count
            scope.$watch('nom_count',function(){
                $timeout(function(){
                    if (scope.nom_count === 1) {
                      console.log('nom_count is: ', scope.nom_count)
                      $state.go('home.transition')
                      scope.restaurants[scope.currentIndex].visible=false;
                    }
                  },1000)
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


            var restaurantSelector = function() {
              if (scope.slideshowOn) {
                var selection_no = scope.currentIndex-1;
              } else {
                selection_no = scope.currentIndex,1;
              }

              // Sets restaurant selection
              var selection = scope.restaurants.splice(selection_no,1)[0];
              return selection;
            }


            scope.$on('$destroy',function(){
                $timeout.cancel(timer);
            });

    /* End : For Automatic slideshow*/

        },
        templateUrl:'../views/slider_temp.html'
    };
});