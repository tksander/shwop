angular.module('shwop.mystore', [])

.controller('MyStoreController', ['$scope', '$rootScope','$window', '$translate', 'Products', 'Auth', function ($scope, $rootScope, $window, $translate, Products, Auth) {
  $scope.data = {};
  $scope.currentProduct = {};

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

  $scope.viewProduct = function (productId) {
    for (var i = 0; i < $scope.data.products.length; i++) {
      if ($scope.data.products[i].id === productId) {
        $scope.currentProduct = $scope.data.products[i];
      }
    }
    console.log($scope.currentProduct);
    $rootScope.Ui.turnOn('viewProductModal');
  };

  $scope.updateProduct = function () {

  };

  $scope.getUserProducts();
}]);
