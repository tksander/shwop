angular.module('shwop.mystore', [])

.controller('MyStoreController', ['$scope', '$rootScope','$window', '$translate', 'Photos', 'Products', 'Auth', function ($scope, $rootScope, $window, $translate, Photos, Products, Auth) {
  $scope.data = {};
  $scope.data.currentProductId;
  $scope.data.currentProduct = {};
  $scope.data.currentProductCategory;

  $scope.data.updatedProduct = {};
  $scope.data.updatedProductCategory;

  $scope.data.removedTags = [];
  $scope.data.addedTags = [];
  $scope.data.tag = '';

  $scope.data.productPhoto;

  $scope.categories = Products.categories;
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
      $scope.data.currentProductCategory = Products.splitCategoryFromTags(tags.data.tags);
      $scope.data.updatedProductCategory = $scope.data.currentProductCategory;
      $scope.data.currentProduct.tags = tags.data.tags.slice();
      $scope.data.updatedProduct.tags = tags.data.tags.slice();
      $rootScope.Ui.turnOn('viewProductModal');
    });
  };

  $scope.updateProductMode = function () {
    $scope.updateMode = true;
    $('.tag').removeClass('disabled-tag');
  };

  $scope.viewProductMode = function () {
    $scope.updateMode = false;
  };

  $scope.cancelChanges = function () {
    $scope.updateMode = false;
    $scope.data.tag = '';
    $('.tag').addClass('disabled-tag');
    $scope.data.updatedProduct = $.extend(true, {}, $scope.data.currentProduct);
  };

  $scope.closeProductModal = function () {
    $rootScope.Ui.turnOff('viewProductModal');
    $scope.updateMode = false;
  };

  $scope.setCurrent = function (product) {
    $scope.data.currentProductId = product.id;
    $scope.data.currentProduct = $.extend(true, {}, product);
    $scope.data.updatedProduct = $.extend(true, {}, product);
  };

  $scope.removeTag = function (tagName) {
    $rootScope.$$childHead.data.removedTags.push(tagName);
    for (var i = 0; i < $rootScope.$$childHead.data.updatedProduct.tags.length; i++) {
      if ($rootScope.$$childHead.data.updatedProduct.tags[i] === tagName) {
        $rootScope.$$childHead.data.updatedProduct.tags.splice(i, 1);
      }
    }
  };

  $scope.addTag = function () {
    if ($scope.data.updatedProduct.tags.indexOf($scope.data.tag) === -1) {
      $scope.data.addedTags.push($scope.data.tag);
      $scope.data.updatedProduct.tags.push($scope.data.tag);
    }
    $scope.data.tag = '';
  };

  $scope.removePhoto = function () {
    $scope.data.updatedProduct.photoURL = '';
    console.log('photoURL is ', $scope.data.updatedProduct.photoURL);
  };

  $scope.addPhoto = function() {
    $scope.filePath = '';
    console.log('$scope.productPhoto is', $scope.data.productPhoto);
    Photos.uploadPhoto($scope.data.productPhoto, function(url){
      $scope.data.updatedProduct.photoURL = url;
    }.bind($scope));
  };

  $scope.updateProduct = function () {
    if ($scope.data.updatedProductCategory !== $scope.data.currentProductCategory) {
      $scope.data.removedTags.push($scope.data.currentProductCategory);
      $scope.data.addedTags.push($scope.data.updatedProductCategory);
      $scope.data.currentProductCategory = $scope.data.updatedProductCategory;
    }
    $scope.updateMode = false;
    $('.tag').addClass('disabled-tag');
    $scope.data.currentProduct = $.extend(true, {}, $scope.data.updatedProduct);
    Products.updateProduct($scope.data.updatedProduct, $scope.data.addedTags, $scope.data.removedTags)
    .then(function () {
      return $translate('productUpdateAlert');
    })
    .then(function (translatedValue) {
      alert(translatedValue);
      for (var i = 0; i < $scope.data.products.length; i++) {
        if ($scope.data.products[i].id === $scope.data.currentProductId) {
          $scope.data.products[i] = $.extend(true, {}, $scope.data.updatedProduct);
          break;
        }
      }
      $scope.data.removedTags = [];
      $scope.data.addedTags = [];
    });
  };

  $scope.getUserProducts();
}]);
