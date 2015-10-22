angular.module('shwop.sell', [])

.controller('SellController', ['$http', '$scope', '$location', 'Products', 'Photos', function ($http, $scope, $location, Products, Photos) {
  $scope.product = {};
  $scope.product.tags = [];
  $scope.product.photoURL = '';
  $scope.product.category = null;

  $scope.categories = Products.categories

  // Helper function that adds an item to an array if the item is not already
  // in the array and the item is not blank. 
  var addToArray = function(item, array) {
    if(array.indexOf(item) === -1 && !isBlank(item)){
      array.push(item);
    }
  };

  // Helper function that ensures a string is not blank.
  var isBlank = function(string) {
    return string.trim() === '';
  };

  // Adds tag to array of tags associated with a product.
  $scope.addTag = function() {
    addToArray($scope.product.tag, $scope.product.tags);
    $scope.product.tag = '';
  };

  // Calls factory method that adds photo to parse.com and returns photo url.
  $scope.addPhoto = function() {
    $scope.filePath = '';
    Photos.uploadPhoto($scope.productPhoto, function(url){
      $scope.product.photoURL = url;
    }.bind($scope));
  };

  // Calls factory method that adds a product to the database.
  $scope.addProduct = function () {
    Products.addProduct($scope.product)
    .then(function (res) {
      $location.path('/products');
    })
    .catch(function (err) {
      console.log(err);
    });
  };
}])

// The 'fileread' directive ensures that the photo uploaded in the browser
// is available for manipulation within the controller.
.directive('fileread', [function () {
  return {
      scope: {
          fileread: '='
      },
      link: function (scope, element, attributes) {
          element.bind('change', function (changeEvent) {
              scope.$apply(function () {
                  scope.fileread = changeEvent.target.files[0];
              });
          });
      }
  };
}]);
