angular.module('shwop.bid', [])

.controller('BidController', ['$http', '$scope', '$location', '$window', 'Products', function ($http, $scope, $location, $window, Products) {
  $scope.product = Products.getCurrentProduct();
  $scope.bid = null;
  $scope.sendBid = function () {

    console.log('the token is ', $window.localStorage.getItem('com.shwop'));
    console.log($window.localStorage.getItem('com.shwop'), $scope.product.id, $scope.bid);
    Products.sendBid($window.localStorage.getItem('com.shwop'), $scope.product.id, $scope.bid);
    $location.path('/products');
  };

  $scope.cancel = function () {
    Products.products();
  };

  console.log($scope.product);


}]);