angular.module('shwop.mystore', [])

.controller('MyStoreController', ['$scope', '$window', 'Products', 'Auth', function ($scope, $window, Products, Auth) {
  $scope.data = {};

  $scope.signout = function() {
    Auth.signout();
  };
  
  // Calls factory method that returns all product info from DB and renders it.
  $scope.getUserProducts = function () {
    //get the token
    var token = $window.localStorage.getItem('com.shwop');
    Products.getUserProducts(token)
    .then(function (myProducts) {
      $scope.data.products = myProducts.data.products;
    })
    .catch(function (err) {
        console.log('/api/products/mystore POST failed', err);
    });
  };

  $scope.deleteProduct = function (productId) {
    if (window.confirm('Are you sure you want to delete this product?')) {
      Products.deleteProduct(productId)
      .then(function () {
        $scope.getUserProducts();
      })
      .catch(function (err) {
        console.log('/api/products/:productId DELETE failed', err);
      });
    }
  };

  $scope.getUserProducts();
}]);
