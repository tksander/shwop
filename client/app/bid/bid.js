angular.module('shwop.bid', [])

.controller('BidController', ['$http', '$scope', '$location', 'Products', function ($http, $scope, $location, Products) {
  $scope.product = Products.getCurrentProduct();
  $scope.addProduct = function () {
    console.log("Add Twilio code here!")    // TODO: Add Twilio code!
  };

  console.log($scope.product);
}]);