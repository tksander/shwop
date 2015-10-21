angular.module('shwop.bid', [])

.controller('BidController', ['$http', '$scope', '$location', '$window', 'Products', function ($http, $scope, $location, $window, Products) {
  $scope.product = Products.getCurrentProduct();
  $scope.bid = null;
  $scope.sendBid = function () {
    console.log($window.localStorage.getItem('userId'), $scope.product.id, $scope.bid);
    Products.sendBid($window.localStorage.getItem('userId'), $scope.product.id, $scope.bid);
  };

  $scope.cancel = function () {
    Products.products();
  };

  console.log($scope.product);


}]);