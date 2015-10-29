angular.module('shwop.mybids', [])

.controller('MyBidsController', ['$scope', '$window', 'Products', 'Auth', function ($scope, $window, Products, Auth) {
  $scope.data = {};

  $scope.signout = function() {
    Auth.signout();
  };
  
  // Calls factory method that returns all bids info from DB and renders it.
  $scope.getBids = function () {
    console.log('getting bids');

    //get the token
    var token = $window.localStorage.getItem('com.shwop');

    Products.getAllBids(token)
    .then(function (bids) {     
      console.log(bids);

      $scope.data = bids.data;
    })
    .catch(function (err) {
      console.log('/api/products/mystore POST failed', err);
    })
  };

  // $scope.deleteProduct = function (productId) {
  //   if (window.confirm('Are you sure you want to delete this product?')) {
  //     Products.deleteProduct(productId)
  //     .then(function () {
  //       $scope.getUserProducts();
  //     })
  //     .catch(function (err) {
  //       console.log('/api/products/:productId DELETE failed', err);
  //     });
  //   }
  // };

  $scope.getBids();
}]);
