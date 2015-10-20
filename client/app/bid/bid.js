angular.module('shwop.bid', [])

.controller('BidController', ['$http', '$scope', '$location', 'Products', function ($http, $scope, $location, Products) {
  $scope.product = Products.getCurrentProduct();
  $scope.bid = null;
  $scope.sendBid = function () {
    Products.sendBid($window.localStorage.getItem('userId'), $scope.product.id, $scope.bid);
  };

  console.log($scope.product);
}]);