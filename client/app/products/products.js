angular.module('shwop.products', [])

.controller('ProductController', ['$scope', 'Products', function ($scope, Products) {
  

  $scope.swiped = function(direction) {
    if (direction === "LEFT") {
      $scope.data.products.shift();
      if ($scope.data.products.length === 0){
        $scope.getAllProducts();
      }
      Products.setCurrentProduct($scope.data.products[0]);
    } else {
      Products.bid();
    }
  };

  $scope.data = {};

  $scope.getAllProducts = function () {
    Products.getAllProducts()
    .then(function (promise) {
      $scope.data.products = promise.data.products;
      Products.setCurrentProduct($scope.data.products[0]);
    })
    .catch(function (err) {
      if (err){
        console.log("/api/products GET failed. Populating products with dummy data.");
        $scope.data.products = [{url: '../../photos/chessboard.jpg', price: 60}, 
        {url: '../../photos/decoration.jpg', price: 100}, {url: '../../photos/drone.jpg', price: 300}, 
        {url: '../../photos/plane.jpg', price: 35000}];
        Products.setCurrentProduct($scope.data.products[0]);
      }
    });
  };
  $scope.getAllProducts();
}])

.directive('dragMe', ['$drag', function($drag){
  return {
    controller: function($scope, $element) {
      $drag.bind($element, 
        {
          // limit movement of element to its parent
          transform: $drag.TRANSLATE_INSIDE($element.parent()),

          // go back to initial position
          end: function(drag) {
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