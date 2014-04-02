'use strict';

// http://www.sitepoint.com/creating-slide-show-plugin-angularjs/

var hungergame=angular.module('hungergame.restaurants');

// http://docs.angularjs.org/guide/directive

// Moved controller to restaurants controller
hungergame.directive('slider', ['$timeout', '$state', 'nomSelector', 'Rooms', '$rootScope', function ($timeout, $state, nomSelector, Rooms, $rootScope) {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            restaurants: '='
        },

        link: function (scope, elem, attrs) {

            // Variables
            scope.currentIndex=0;
            scope.restaurantsCount=scope.restaurants.length;
            scope.slideshowOn=false;
            scope.nom_count=0;
            scope.nope_count=0;
            scope.vote_count = scope.nom_count + scope.nom_count;

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
                       // scope.next();
                  }, 2)
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

                // ** var next2Index = (scope.currentIndex<scope.restaurants.length-1) ? scope.currentIndex+2 : 1;

                var prevIndex = (scope.currentIndex!==0) ? scope.currentIndex-1:scope.restaurants.length-1;

                // var prev2Index = (scope.currentIndex) ? scope.currentIndex-2:scope.restaurants.length-2;
                // if (scope.currentIndex===0) {
                //   var prev2Index = scope.restaurants.length-2;
                // } else if (scope.currentIndex===1) {
                //   var prev2Index = scope.restaurants.length-1;
                // } else {
                //   var prev2Index = scope.currentIndex-2
                // }

                if(!$event) {
                  scope.currentIndex = nextIndex;
                } else {
                    // This is the swiped restaurant <li>
                    var ele = $event.target.parentNode;
                    console.log('next ele: ', ele);

                    // This is the swiped restaurant's siblings <li>
                    var lis = $event.target.parentNode.parentNode.children;
                    console.log('this dat first li: ', lis[0])

                    console.log('BEFORE==> ');
                    console.log('event ele: ', ele);
                    console.log('lis curr index: ', lis[scope.currentIndex])
                    console.log('next ele: ', lis[nextIndex])

                    // Removes reverse class from list item (note: +1 is to account for the icon divs which are part of the <ul>)
                    lis[scope.currentIndex+1].classList.remove('reverse');
                    lis[nextIndex+1].classList.remove('reverse');
                    // ** lis[next2Index].classList.remove('reverse');

                    // Changes the restaurant
                    console.log('next index: ', nextIndex);
                    $timeout(function() {
                      scope.currentIndex = nextIndex;
                      // Adds reverse to swiped element post animation to anticipate a 'previous' swipe motion
                      $timeout(function() {
                        ele.classList.add('reverse');
                      }, 350) // 350
                    }, 2) //50
                    console.log('scope.current: ', scope.currentIndex);
                }
            };

            scope.prev=function($event){
                scope.end();
                // This is the prev restaurant to be displayed's index
                // if (scope.currentIndex===0) {
                //   var prev2Index = scope.restaurants.length-2;
                // } else if (scope.currentIndex===1) {
                //   var prev2Index = scope.restaurants.length-1;
                // } else {
                //   var prev2Index = scope.currentIndex-2
                // }
                var prevIndex = (scope.currentIndex!==0) ? scope.currentIndex-1:scope.restaurants.length-1;

                var nextIndex = (scope.currentIndex<scope.restaurants.length-1) ? scope.currentIndex+1 : 0;
                // var next2Index = (scope.currentIndex<scope.restaurants.length-1) ? scope.currentIndex+2 : 1;

                // This is the swiped restaurant <li>
                var ele = $event.target.parentNode;

                  // This is the swiped restaurant's siblings <li>
                var lis = $event.target.parentNode.parentNode.children;

                // Adds the class for the appropriate reverse animation
                ele.classList.add('reverse');
                // lis[scope.currentIndex+1].classList.add('reverse');

                // Adds reverse class to list item (note: +1 is to account for the icon divs which are part of the <ul>)
                lis[prevIndex+1].classList.add('reverse');

                // console.log('ele: ', ele)
                // console.log('VERSUS')
                // console.log('currIndex: ', lis[scope.currentIndex])
                // console.log('VERSUS')
                // console.log('currIndex+1: ', lis[scope.currentIndex+1])
                // console.log('VERSUS')
                // console.log('prevIndex+1: ', lis[prevIndex+1])

                // Changes the restaurant
                $timeout(function() {
                  scope.currentIndex = prevIndex;
                  // Removes reverse from swiped element post animation
                  $timeout(function() {
                    ele.classList.remove('reverse');
                  }, 350)
                }, 50)
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
                var lis = $event.target.parentNode.parentNode.children;
                console.log('this is the ele: ', ele);
                // lis.forEach(function(li){
                //   li.classList.remove('reverse')
                // })

                for (var i=0; i<lis.length; i++) {
                  lis[i].classList.remove('reverse')
                }

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
                  if (!($rootScope.singlePlayer)){
                    var nomId = nomSelector.getId()
                    console.log('nomId', nomId)
                    Rooms.changeVote(nomId, nom.originalIndex.toString(), function(voteValue){
                      $rootScope.madeSelection = true
                      return voteValue + 1;
                      // console.log(nope.name, 'has been downvoted!')
                    })
                  }

                  // +++ NOTE: Will need to incorporate firebase functionality here for multiplayer !! +++
                    // Attach to a user?
                    // Broadcast event?
                  if ($rootScope.singlePlayer){
                    nomSelector.addNom(nom);
                    scope.noms_arr.push(nom);
                  }


                  // Resets page <li> element
                  ele.classList.remove('swipedup');
                }, 550);

                $timeout(function() {
                  scope.slideshowOn=false;
                }, 50) // 200
            };

            scope.swipedDown=function($event){
                scope.end();
                var ele = $event.target;
                var lis = $event.target.parentNode.parentNode.children;
                console.log('this is the ele: ', ele);
                // lis.forEach(function(li) {
                //   li.classList.remove('reverse');
                // })

                ele.classList.add('swipeddown');

                for (var i=0; i<lis.length; i++) {
                  lis[i].classList.remove('reverse')
                }



                // Removes the list item
                $timeout (function() {
                  var nope = restaurantSelector();
                  // console.log('nope object index', nope.originalIndex)
                  // console.log('$scope.roomId:', scope.roomId)
                  if (!($rootScope.singlePlayer)){
                    var nopeId = nomSelector.getId()
                    console.log('nopeId', nopeId)
                    Rooms.changeVote(nopeId, nope.originalIndex.toString(), function(voteValue){
                      return voteValue - 1;
                      // console.log(nope.name, 'has been downvoted!')
                    })
                  }
                  scope.nopes_arr.push(nope);
                  // console.log('this is the nope: ', nope);
                  ele.classList.remove('swipeddown');
                  // console.log("after index: ", scope.currentIndex);
                }, 550);

                $timeout(function() {
                  scope.slideshowOn=false;
                }, 50) // 200
            };

            // Toggles card flip
            scope.moreInfo=function($event){
              var ele = $event.target;
              var lis = $event.target.parentNode.parentNode.children;
              console.log('this is the ele: ', ele);
              console.log('dees dem lis: ', lis[0]);

              for (var i=0; i<lis.length; i++) {
                lis[i].classList.remove('reverse')
              }

              scope.moreInfoClicks+=1
              // End slideshow if playing
              scope.restaurants[scope.currentIndex].info=!scope.restaurants[scope.currentIndex].info;
              scope.restaurants[scope.currentIndex].foodpic=!scope.restaurants[scope.currentIndex].foodpic;
              scope.end();

              if(scope.moreInfoClicks%2==0) {
                console.log('moreInfo should restart slideshow');
                // lis.forEach(function(li){
                //   li.classList.remove('reverse');
                // })

                $timeout (function() {
                  scope.slideshowOn=false;
                }, 50); // 200
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

            scope.$watch('restaurantsCount',function(){
              if (scope.restaurantsCount == 1) {
                console.log('one restaurant left')
                scope.restaurants.forEach(function(restaurant){
                    restaurant.visible=true;
                });
              }
              if (scope.restaurantsCount == 0) {
                // Breaks the recursive loop formed the sliderFunc
                sliderFunc = scope.end;
                console.log('NO MO NOMS')
                $scope.$broadcast('timer-stop');
              }
            });

            // Watch the nom count to set a ceiling on the number a moms a user can select
            // ** UPDATED TO ACCOUNT FOR SHAKE FUNCITONALITY
            // scope.$watch('nom_count',function(){
            //         if (scope.nom_count > 0) {
            //             console.log('nom_count is: ', scope.nom_count);
            //             // scope.round.madeSelection = true;
            //             // if(scope.restaurants[scope.currentIndex]) {
            //             //   scope.restaurants[scope.currentIndex].visible=false;
            //             // }
            //         }
            //     });

            var timer;
            var interval = 700;

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
                scope.restaurantsCount-=1
                var random = scope.restaurants[Math.floor(Math.random() * scope.restaurants.length)]
                nomSelector.setRandom(random)
                return selection;
            };


            scope.$on('$destroy',function(){
                $timeout.cancel(timer);
            });
        },
        templateUrl:'../views/slider_temp.html'
    };

}]);