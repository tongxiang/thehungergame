'use strict';

// http://www.sitepoint.com/creating-slide-show-plugin-angularjs/

var hungergame=angular.module('hungergame.restaurants');

// http://docs.angularjs.org/guide/directive

// Moved controller to restaurants controller
// hungergame.controller('SliderController', function($scope) {
//     $scope.images=[{src:'img1.png',title:'Pic 1'},{src:'img2.jpg',title:'Pic 2'},{src:'img3.jpg',title:'Pic 3'},{src:'img4.png',title:'Pic 4'},{src:'img5.png',title:'Pic 5'}];
// });

hungergame.directive('slider', function ($timeout) {
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
            images: '=',
        },
        link: function (scope, elem, attrs) {

            scope.currentIndex=0;
            scope.playing=false;
            scope.noms_images = [];

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
                // This is the next image to be displayed's index
                var nextIndex = (scope.currentIndex<scope.images.length-1) ? scope.currentIndex+1 : 0;
                if(!$event) {
                  scope.currentIndex = nextIndex;
                } else {
                    // This is the swiped image <li>
                    var ele = $event.target.parentNode;
                    console.log('next ele: ', ele);

                    // This is the swiped image's siblings <li>
                    var lis = $event.target.parentNode.parentNode.children;

                    // This removes the class for the appropriate animation
                    lis[nextIndex].classList.remove('reverse');
                    ele.classList.remove('reverse');

                    // Changes the image
                    scope.currentIndex = nextIndex;
                }
            };

            scope.prev=function($event){
                // This is the prev image to be displayed's index
                var prevIndex = (scope.currentIndex) ? scope.currentIndex-1:scope.images.length-1;

                // This is the swiped image <li>
                var ele = $event.target.parentNode;
                console.log('prev ele: ', ele);

                  // This is the swiped image's siblings <li>
                var lis = $event.target.parentNode.parentNode.children;
                console.log("lis: ",lis);

                // This removes the class for the appropriate animation
                lis[prevIndex].classList.add('reverse');
                ele.classList.add('reverse');

                // Changes the image
                scope.currentIndex = prevIndex;
            };

            scope.swipedUp=function($event){
                var ele = $event.target;
                console.log('this is the ele: ', ele);
                ele.classList.add('swipedup');

                // Removes the list item
                $timeout (function() {
                    if (scope.playing) {
                      var removed = scope.currentIndex-1;
                    } else {
                      removed = scope.currentIndex,1;
                    }
                      var nom = scope.images.splice(removed,1);
                      scope.noms_images.push(nom);
                      console.log("NOM! ", nom);
                      if (scope.noms_images.length >= 3) {
                        console.log('noms satisfied')
                        scope.images = scope.noms_images;
                      }
                      // console.log("yes images: ", scope.yes_images)

                      // when scope.yes_images.length = 3, got to final round
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
                      scope.next();
                      ele.classList.remove('swipeddown');
                      console.log("after index: ", scope.currentIndex);
                  }, 1000);
            }

            scope.$watch('currentIndex',function(){
                scope.images.forEach(function(image){
                    image.visible=false;
                });
                scope.images[scope.currentIndex].visible=true;
            });

            // // attempt to watch the nom count
            // scope.$watch('nomHits',function(){
            //       if (scope.noms_images.length >= 3) {
            //         console.log('noms satisfied')
            //         scope.images = scope.noms_images;
            //       }
            // });

    /* Start: For Automatic slideshow*/

            var timer;
            var interval = 500;

            var sliderFunc=function(){
                timer=$timeout(function(){
                    scope.next();
                    timer=$timeout(sliderFunc,interval);
                },interval);
            };


            scope.$on('$destroy',function(){
                $timeout.cancel(timer);
            });

    /* End : For Automatic slideshow*/

        },
        templateUrl:'../views/slider_temp.html'
    };
});