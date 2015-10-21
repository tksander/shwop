angular.module('shwop.sell', [])

.controller('SellController', ['$http', '$scope', '$location', 'Products', 'Photos', function ($http, $scope, $location, Products, Photos) {
  $scope.product = {};
  $scope.product.tags = [];
  $scope.product.photoURL = '';

  var addToArray = function(item, array) {
    if(array.indexOf(item) === -1 && !isBlank(item)){
      array.push(item);
      console.log('$scope.product.tags: ' + $scope.product.tags);
    }
  };

  var isBlank = function(string) {
    return string.trim() === '';
  };

  $scope.addTag = function() {
    addToArray($scope.product.tag, $scope.product.tags);
    $scope.product.tag = '';
  };

  $scope.addPhoto = function() {
    $scope.filePath = '';
    Photos.uploadPhoto($scope.productPhoto, function(url){
      $scope.product.photoURL = url;
    }.bind($scope));
  };

  $scope.addProduct = function () {
    Products.addProduct($scope.product)
    .then(function (res) {
      $location.path('/products');     // $location is Angular module. Keeps this a single-page
    })                          // app & prevents controllers from being reloaded.
    .catch(function (err) {
      console.log(err);
    });
  };
}])
.directive('fileread', [function () {
  return {
      scope: {
          fileread: '='
      },
      link: function (scope, element, attributes) {
          element.bind('change', function (changeEvent) {
              scope.$apply(function () {
                  scope.fileread = changeEvent.target.files[0];
                  // or all selected files:
                  // scope.fileread = changeEvent.target.files;
              });
          });
      }
  };
}]);
