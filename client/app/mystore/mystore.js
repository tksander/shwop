angular.module('shwop.mystore', [])

.controller('MyStoreController', ['$scope', '$rootScope','$window', '$translate', 'Products', 'Auth', function ($scope, $rootScope, $window, $translate, Products, Auth) {
  $scope.data = {};
  $scope.data.currentProduct = {name: 'burger', price: '5'};

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
    $translate('deleteProductConfirm')
    .then(function (translatedValue) {
      if (window.confirm(translatedValue)) {
        Products.deleteProduct(productId)
        .then(function () {
          $scope.getUserProducts();
        })
        .catch(function (err) {
          console.log('/api/products/:productId DELETE failed', err);
        });
      }
    })
    .catch(function (err) {
      console.log('failed to return string from localization resource file', err);
    });
  };

  $scope.viewProduct = function (product) {
    $scope.data.currentProduct = product;
    console.log($scope.data.currentProduct);
    $rootScope.Ui.turnOn('viewProductModal');
  };

  $scope.updateProduct = function () {

  };

  $scope.setCurrent = function (product) {
    $scope.data.currentProduct = product;
    console.log('the currentProduct is ', $scope.data.currentProduct);
  };

  $scope.getUserProducts();
}]);
