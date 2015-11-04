angular.module('shwop.products', [])


.controller('ProductController', ['$scope', '$rootScope', '$translate', 'Products', 'Auth', '$window', 'Users', function ($scope, $rootScope, $translate, Products, Auth, $window, Users) {
  $scope.categories = Products.categories;
  $scope.product = {};
  $scope.product.category = null;
  $scope.searchText = null;

  $scope.signout = function() {
    Auth.signout();
  };
  
  // Determines what happens when a user swipes a product photo left or right.
  $scope.swiped = function(direction) {
    // If user swipes left, the topmost photo is removed from the array, revealing
    // the next product to the user.
    if (direction === 'LEFT') {
      console.log("swiped left")
      $scope.data.products.shift();
      
      if ($scope.data.products.length === 0){
        $scope.getAllProducts();
      }
      Products.setCurrentProduct($scope.data.products[0]);
    } else {
      // If user swipes right, the bid() factory method is called.
      Products.bid();
    }
  };

  $scope.showModal = function(){
    $rootScope.Ui.turnOn('bidModal');
  }

  $scope.data = {};
  var findingMessage = $translate.instant('findingMessage');
  $scope.data.location = findingMessage;

  // Calls factory method that returns all product info from DB and renders it.
  $scope.getAllProducts = function (callback) {
    // This hacky callback is to allow the location function to be called after we get all the products
    callback = callback || function(){};

    Products.getAllProducts()
    .then(function (promise) {
      $scope.data.products = promise.data.products;
      Products.setCurrentProduct($scope.data.products[0]);

      // Only run this if we do not already have the bidder location information
      if(!$scope.bidderLat) {
        console.log("intializing bidder location")
        getProductLocation();
      }
      callback();
    })
    .catch(function (err) {
      if (err){
        console.log('/api/products GET failed. Populating products with dummy data: ', err);
        $scope.data.products = [{url: '../../photos/chessboard.jpg', price: 60}, 
        {url: '../../photos/decoration.jpg', price: 100}, {url: '../../photos/drone.jpg', price: 300}, 
        {url: '../../photos/plane.jpg', price: 35000}];
        Products.setCurrentProduct($scope.data.products[0]);
      }
    });
  };

  // Calls factory method to get all products matching tag
  $scope.submitSearch = function () {
    var tagsString = $scope.searchText + "+" + $scope.product.category;

    Products.getProductsByTag(tagsString)
      .then(function (promise) {
        console.log("promise.categoryOnly", promise.data.categoryOnly);
        if(promise.data === '') {
          alert("Sorry, no results matched your search. Please try again or keep shwoping!")
        } else if(promise.data.categoryOnly) {
          alert("We were unable to find results matching \"" + $scope.searchText + 
                "\". Showing results for \"" + $scope.product.category + "\". Happy shwopping!");
          $scope.data.products = promise.data.products;
          Products.setCurrentProduct($scope.data.products[0]);
        } else {
          $scope.data.products = promise.data.products;
          Products.setCurrentProduct($scope.data.products[0]);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  var getBidderLocation = function (callback) {

      var successCallback = function (position) {
           $scope.bidderLat = position.coords.latitude;
           $scope.bidderLong = position.coords.longitude;
           callback();
      }

      var errorCallback = function (error) {
        console.log(error);
      }
      var watchId = navigator.geolocation.getCurrentPosition(successCallback, 
                                                        errorCallback,
                                                        {enableHighAccuracy:true,timeout:60000,maximumAge:0});
  };

  // Gets the location from the bidder to the product
  var getProductLocation = function () {

    var currentProduct = $scope.data.products[0];
    console.log("Current user", currentProduct.UserId);
    var userId = currentProduct.UserId;

    // get the location of the user associated to the product
    Users.getUserLocation(userId)
    .then(function (user) {
      var productLat = user.data.userInfo.latitude;
      var productLong = user.data.userInfo.longitude;

      getBidderLocation(function () {
        // return $scope.getDistanceFrom();
        var distance = Products.getDistance($scope.bidderLat, $scope.bidderLong, productLat, productLong);
        var distanceDisplay = $translate.instant('distanceDisplay');
        var distanceUnits = $translate.instant('distanceUnits');
        $scope.data.location = distanceDisplay + Math.round(distance) + " " + distanceUnits;
      })

    })
    .catch(function (error) {
      console.log('/api/users/profile POST failed', error);
    })
  };



  $scope.getAllProducts();
}])

// Angular directive to control drag functionality.
.directive('carousel', ['$document', '$translate', 'Users', function($document, $translate, Users){
  return {
    restrict: 'C',
    controller: function($scope, Products) {
      this.itemCount = 0;
      this.activeItem = null;

      function arrowHandler (event) {
        if (event.keyCode === 37) {
          if ($scope.data.products.length > 1){
            $scope.data.products.shift();
            Products.setCurrentProduct($scope.data.products[0]);

            // This section gets the location for the next product in the stack
            var currentProduct = $scope.data.products[0];
            var userId = currentProduct.UserId;

            // get the location of the user associated to the product
            Users.getUserLocation(userId)
            .then(function (user) {
              var productLat = user.data.userInfo.latitude;
              var productLong = user.data.userInfo.longitude;

              var distance = Products.getDistance($scope.bidderLat, $scope.bidderLong, productLat, productLong);

             var distanceDisplay = $translate.instant('distanceDisplay');
             var distanceUnits = $translate.instant('distanceUnits');
             $scope.data.location = distanceDisplay + Math.round(distance) + " " + distanceUnits;
            })
          } else {
            $scope.data.products.shift();
            
            // Gets all products if at the bottom of the stack, 
            // then gets the location for the product at the top of the refreshed stack
            $scope.getAllProducts(function () {
                var currentProduct = $scope.data.products[0];
                var userId = currentProduct.UserId;

              // get the location of the user associated to the product
              Users.getUserLocation(userId)
              .then(function (user) {
                var productLat = user.data.userInfo.latitude;
                var productLong = user.data.userInfo.longitude;

                var distance = Products.getDistance($scope.bidderLat, $scope.bidderLong, productLat, productLong);
                var distanceDisplay = $translate.instant('distanceDisplay');
                var distanceUnits = $translate.instant('distanceUnits');
                $scope.data.location = distanceDisplay + Math.round(distance) + " " + distanceUnits;
              })
            });
          }
        } else if (event.keyCode === 39) {
            $scope.showModal();
        }
        $scope.$apply();
      }

      $document.on('keydown', arrowHandler);

      this.addItem = function(){
        var newId = this.itemCount++;
        this.activeItem = this.itemCount === 1 ? newId : this.activeItem;
        return newId;
      };

      this.reject = function(){
        this.activeItem = this.activeItem || 0;
        this.activeItem = this.activeItem === this.itemCount - 1 ? 0 : this.activeItem + 1;
        
        if ($scope.data.products.length > 1){
          console.log('popping first product');
          $scope.data.products.shift();
          Products.setCurrentProduct($scope.data.products[0]);
          console.log(Products.getCurrentProduct());


          // This section gets the location for the next product in the stack
          var currentProduct = $scope.data.products[0];
          var userId = currentProduct.UserId;

          // get the location of the user associated to the product
          Users.getUserLocation(userId)
          .then(function (user) {
            var productLat = user.data.userInfo.latitude;
            var productLong = user.data.userInfo.longitude;

            var distance = Products.getDistance($scope.bidderLat, $scope.bidderLong, productLat, productLong);

            var distanceDisplay = $translate.instant('distanceDisplay');
            var distanceUnits = $translate.instant('distanceUnits');
            $scope.data.location = distanceDisplay + Math.round(distance) + " " + distanceUnits;
          })


        } else {
          $scope.data.products.shift();

          // Gets all products if at the bottom of the stack, 
          // then gets the location for the product at the top of the refreshed stack
          $scope.getAllProducts(function () {
              var currentProduct = $scope.data.products[0];
              var userId = currentProduct.UserId;

            // get the location of the user associated to the product
            Users.getUserLocation(userId)
            .then(function (user) {
              var productLat = user.data.userInfo.latitude;
              var productLong = user.data.userInfo.longitude;

              var distance = Products.getDistance($scope.bidderLat, $scope.bidderLong, productLat, productLong);
              var distanceDisplay = $translate.instant('distanceDisplay');
              var distanceUnits = $translate.instant('distanceUnits');
              $scope.data.location = distanceDisplay + Math.round(distance) + " " + distanceUnits;
            })
          });
        }
      };

      this.bid = function(){
        $scope.showModal();
      };

      this.prev = function(){
        this.activeItem = this.activeItem || 0;
        this.activeItem = this.activeItem === 0 ? this.itemCount - 1 : this.activeItem - 1;
      };
    }
  };
}])

.directive('carouselItem',['$drag', function ($drag) {
  return {
    restrict: 'C',
    require: '^carousel',
    transclude: true,
    template: '<div class="item"><div ng-transclude></div></div>',
    link: function(scope, elem, attrs, carousel) {
      scope.carousel = carousel;
      var id = carousel.addItem();

      var zIndex = function(){
        var res = 0;
        if (id === carousel.activeItem){
          res = 2000;
        } else if (carousel.activeItem < id) {
          res = 2000 - (id - carousel.activeItem);
        } else {
          res = 2000 - (carousel.itemCount - 1 - carousel.activeItem + id);
        }
        return res;
      };

      scope.$watch(function(){
        return carousel.activeItem;
      }, function(){
        elem[0].style.zIndex = zIndex();
      });
      
      $drag.bind(elem, {
        //
        // This is an example of custom transform function
        //
        transform: function(element, transform, touch) {
          // 
          // use translate both as basis for the new transform:
          // 
          var t = $drag.TRANSLATE_BOTH(element, transform, touch);
          
          //
          // Add rotation:
          //
          var Dx    = touch.distanceX, 
              t0    = touch.startTransform, 
              sign  = Dx < 0 ? -1 : 1,
              angle = sign * Math.min( ( Math.abs(Dx) / 700 ) * 30 , 30 );
          
          t.rotateZ = angle + (Math.round(t0.rotateZ));
          
          return t;
        },
        move: function(drag){
          if(Math.abs(drag.distanceX) >= drag.rect.width / 4) {
            elem.addClass('dismiss');  
          } else {
            elem.removeClass('dismiss');  
          }
        },
        cancel: function(){
          elem.removeClass('dismiss');
        },
        end: function(drag) {
          elem.removeClass('dismiss');
          if(Math.abs(drag.distanceX) >= drag.rect.width / 4) {
            scope.$apply(function() {
              if(drag.distanceX < 0){
                console.log('dragged left');
                carousel.reject();
              } else {
                console.log('dragged right');
                carousel.bid();
              }
            });
          }
          drag.reset();
        }
      });
    }
  };
}])
.directive('dragMe', ['$drag', function ($drag){
  return {
    controller: function($scope, $element) {
      $drag.bind($element, 
        {
          //
          // Here you can see how to limit movement 
          // to an element
          //
          transform: $drag.TRANSLATE_INSIDE($element.parent()),
          end: function(drag) {
            // go back to initial position
            drag.reset();
          }
        },
        { // release touch when movement is outside bounduaries
          sensitiveArea: $element.parent()
        }
      );
    }
  };
}]);
