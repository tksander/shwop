angular.module('shwop.products', [])

.controller('ProductController', function ($scope, Products) {
  $scope.data = {};

  $scope.getProducts = function () {
    Products.getProducts()
    .then(function (promise) {
      // console.log("promise.data", JSON.stringify(promise.data));
      $scope.data.products = promise.data;
    })
    .catch(function (err) {
      console.log(err);
    });
  };
  $scope.getProducts();
});