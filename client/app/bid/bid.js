angular.module('shwop.bid', [])

.controller('BidController', ['$http', '$scope', '$rootScope', '$location', '$window', '$translate', 'Products', 'Auth', function ($http, $scope, $rootScope, $location, $window, $translate, Products, Auth) {
  $scope.product = Products.getCurrentProduct();
  $scope.bid = null;
  $scope.bidSent = false;

  $translate('sendBidButton')
  .then(function (translatedValue) {
    $scope.currentButtonText = translatedValue;
    $scope.sendBidButton = translatedValue;
  });


  $scope.sendBid = function () {
    $translate('sendingBidMessage')
    .then(function (translatedValue) {
      $scope.currentButtonText = translatedValue;
    });

    Products.sendBid($window.localStorage.getItem('com.shwop'), $scope.product.id, $scope.bid)
      .then(function (results) {
        console.log("Results in bid.js: ", results);
        $scope.bidSent = true;
      })
      .catch(function (error) {
        console.log("Error in creating a bid:  ", error);
      });
  };

  $scope.cancel = function () {
    Products.products();
  };

  $scope.signout = function () {
    Auth.signout();
  };

}]);
