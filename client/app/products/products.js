angular.module('shwop.products', [])

.controller('ProductController', ['$scope', 'Products', function ($scope, Products) {
  $scope.data = {};

  $scope.data.products = [{url: '../../photos/chessboard.jpg', price: 60}, 
  {url: '../../photos/decoration.jpg', price: 100}, {url: '../../photos/drone.jpg', price: 300}, 
  {url: '../../photos/plane.jpg', price: 35000}];

  // $scope.getProducts = function () {
  //   Products.getProducts()
  //   .then(function (promise) {
  //     // console.log("promise.data", JSON.stringify(promise.data));
  //     $scope.data.products = promise.data;
  //   })
  //   .catch(function (err) {
  //     console.log(err);
  //   });
  // };
  // $scope.getProducts();
}]);