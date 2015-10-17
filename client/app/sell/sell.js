angular.module('shwop.sell', [])

.controller('SellController', ['$http', '$scope', '$location', 'Products', function ($http, $scope, $location, Products) {
  $scope.product = {};
  $scope.addProduct = function () {
    Products.addProduct($scope.product)
    .then(function (res) {
      $location.path('/products');     // $location is Angular module. Keeps this a single-page
    })                          // app & prevents controllers from being reloaded.
    .catch(function (err) {
      console.log(err);
    });
  };
}]);