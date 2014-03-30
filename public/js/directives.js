'use strict';

// http://www.sitepoint.com/creating-slide-show-plugin-angularjs/

var hungergame=angular.module('hungergame.restaurants');

// http://docs.angularjs.org/guide/directive

// Moved controller to restaurants controller
hungergame.directive('slider', function ($timeout, $state, nomSelector) {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            restaurants: '=',
        },

        link: function (scope, elem, attrs) {

            // Variables
            scope.currentIndex=0;
            scope.restaurantsCount=scope.restaurants.length;
            scope.slideshowOn=false;
            scope.nom_count=0;
            scope.nope_count=0;

            scope.moreInfoClicks=0;
            scope.playing=true; // Indicates Round
            scope.gameover=false; // Indicates Game

            // Gameplay: Restaurant Choices
            scope.noms_arr = [];
            scope.nopes_arr = [];

            scope.start=function(){
              // timeout to account for slide animation
              if(!scope.slideshowOn) {
                  scope.slideshowOn=true;
                  $timeout(function() {
                       sliderFunc();
                  }, 1500)
                };
              }

            scope.end=function(){
                  $timeout.cancel(timer);
            };

            scope.next=function($event){
                scope.end()
                console.log('running next func')
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
                    console.log('next index: ', nextIndex);
                    scope.currentIndex = nextIndex;
                    console.log('scope.current: ', scope.currentIndex);
                }
            };

            scope.prev=function($event){
                scope.end();
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
                // Add timeout to remove reverse class
            };

            scope.resume=function() {
              // if the slideshow.false kicks off auto slideshow.

              $timeout(function() {
                if(!scope.slideshowOn) {
                  scope.slideshowOn=false;
                }
            }, 1)
            }

            scope.swipedUp=function($event){
                scope.end();
                var ele = $event.target;
                console.log('this is the ele: ', ele);
                ele.classList.add('swipedup');

                // +++ Incorporate timer here +++
                // !!!! Check where this is going and later remove !!!!
                // scope.playing = false;

                // Removes the list item
                $timeout (function() {
                  scope.nom_count +=1;
                  // Sets restaurant selection
                  var nom = restaurantSelector();
                  console.log("nom chosen: ", nom)

                  // +++ NOTE: Will need to incorporate firebase functionality here for multiplayer !! +++
                    // Attach to a user?
                    // Broadcast event?

                  nomSelector.addNom(nom);
                  scope.noms_arr.push(nom);

                  // Resets page <li> element
                  ele.classList.remove('swipedup');
                }, 550);

                $timeout(function() {
                  scope.slideshowOn=false;
                }, 200)
            };

            scope.swipedDown=function($event){
                scope.end();
                var ele = $event.target;
                console.log('this is the ele: ', ele);
                ele.classList.add('swipeddown');

                // Removes the list item
                $timeout (function() {
                  var nope = restaurantSelector();
                  scope.nopes_arr.push(nope);
                  console.log('this is the nope: ', nope);
                  ele.classList.remove('swipeddown');
                  // console.log("after index: ", scope.currentIndex);
                }, 550);

                $timeout(function() {
                  scope.slideshowOn=false;
                }, 200)
            };

            // Toggles card flip
            scope.moreInfo=function($event){
              scope.moreInfoClicks+=1
              // End slideshow if playing
              scope.restaurants[scope.currentIndex].info=!scope.restaurants[scope.currentIndex].info;
              scope.restaurants[scope.currentIndex].foodpic=!scope.restaurants[scope.currentIndex].foodpic;
              scope.end();

              if(scope.moreInfoClicks%2==0) {
                console.log('moreInfo should restart slideshow')
                $timeout (function() {
                  scope.slideshowOn=false
                }, 200);
              }
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

            // Watch the nom count to set a ceiling on the number a moms a user can select
            // ** UPDATED TO ACCOUNT FOR SHAKE FUNCITONALITY
            // scope.$watch('nom_count',function(){
            //         if (scope.nom_count > 0) {
            //             console.log('nom_count is: ', scope.nom_count);
            //             scope.round.madeSelection = true;
            //             // if(scope.restaurants[scope.currentIndex]) {
            //             //   scope.restaurants[scope.currentIndex].visible=false;
            //             // }
            //         }
            //     });

            var timer;
            var interval = 350;

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
            };

            var restaurantSelector = function() {
                var selection_no = scope.currentIndex;

                // Sets restaurant selection
                var selection = scope.restaurants.splice(selection_no,1)[0];
                return selection;
            };


            scope.$on('$destroy',function(){
                $timeout.cancel(timer);
            });
        },
        templateUrl:'../views/slider_temp.html'
    };

});