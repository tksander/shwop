angular.module('shwop.mystore', [])

.controller('MyStoreController', ['$scope', '$rootScope','$window', '$translate', 'Products', 'Auth', function ($scope, $rootScope, $window, $translate, Products, Auth) {
  $scope.data = {};
  $scope.data.currentProduct = {};
  $scope.updateMode = false;

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

  $scope.viewProduct = function () {
    Products.getTags($scope.data.currentProduct.id)
    .then(function (tags) {
      $scope.data.currentProduct.tags = tags.data.tags;
      $rootScope.Ui.turnOn('viewProductModal');
      console.log('tags is ', $scope.data.currentProduct.tags);
    });
  };

  $scope.updateProductMode = function () {
    $scope.updateMode = true;
  };

  $scope.viewProductMode = function () {
    $scope.updateMode = false;
  };

  $scope.setCurrent = function (product) {
    $scope.data.currentProduct = product;
  };

  $scope.removeTag = function (tagName) {
    console.log('going to remove ', tagName);
    console.log('tags is', $scope.data.currentProduct.tags);
    for (var i = 0; i < $scope.data.currentProduct.tags; i++) {
      if ($scope.data.currentProduct.tags[i] === tagName) {
        $scope.data.currentProduct.splice(i, 1);
      }
    }
    console.log('tags is ', $scope.data.currentProduct.tags);
  };

  $scope.getUserProducts();
}]);
