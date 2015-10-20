angular.module('shwop.products', [])

.controller('ProductController', ['$scope', 'Products', function ($scope, Products) {
  $scope.swiped = function(direction) {
    if (direction === "LEFT") {
      $scope.data.products.pop();
      if ($scope.data.products.length === 0){
        $scope.data.products = [{url: '../../photos/chessboard.jpg', price: 60}, 
        {url: '../../photos/decoration.jpg', price: 100}, {url: '../../photos/drone.jpg', price: 300}, 
        {url: '../../photos/plane.jpg', price: 35000}];
      }
    } else {
      Products.bid();
    }
  };

  $scope.data = {};

  $scope.data.products = [{url: '../../photos/chessboard.jpg', price: 60}, 
  {url: '../../photos/decoration.jpg', price: 100}, {url: '../../photos/drone.jpg', price: 300}, 
  {url: '../../photos/plane.jpg', price: 35000}];

  // $scope.getProducts = function () {
  //   Products.getProducts()
  //   .then(function (promise) {
  //     // console.log("promise.data", JSON.stringify(promise.data));
  //     $scope.data.products = promise.data;
  //   })
  //   .catch(function (err) {
  //     console.log(err);
  //   });
  // };
  // $scope.getProducts();
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