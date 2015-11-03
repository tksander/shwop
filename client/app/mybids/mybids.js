angular.module('shwop.mybids', [])

.controller('MyBidsController', ['$scope', '$window', '$translate', 'Products', 'Auth', function ($scope, $window, $translate, Products, Auth) {
  $scope.data = {};

  $scope.signout = function() {
    Auth.signout();
  };
  
  // Calls factory method that returns all bids info from DB and renders it.
  $scope.getBids = function () {
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

  $scope.deleteBid = function (bidId) {
    var cancelBidVerification = $translate.instant('cancelBidVerification');
    if (window.confirm(cancelBidVerification)) {
      Products.deleteMyBid(bidId)
      .then(function (result) {
        console.log('Deleted bid' + result);
      })
      .catch(function (err) {
        console.log('/api/bids/:BidId DELETE failed' + err);
      });
    }
  };

  $scope.remove = function(index) {
    $scope.data.splice(index, 1);
  }

  $scope.getBids();
}]);
