// This "My Bids" controller enables the retrieval and deletion of bids
// made a single user via methods from the injected Products service.
angular.module('shwop.mybids', [])

.controller('MyBidsController', ['$scope', '$window', '$translate', 'Products', 'Auth', function ($scope, $window, $translate, Products, Auth) {
  $scope.data = {};

  $scope.signout = function() {
    Auth.signout();
  };
  
  $scope.getBids = function () {
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

  $scope.deleteBid = function (bidId, bidIndex) {
    var cancelBidVerification = $translate.instant('cancelBidVerification');
    if (window.confirm(cancelBidVerification)) {
      Products.deleteMyBid(bidId)
      .then(function (result) {
        console.log('Deleted bid' + result);
        $scope.data.splice(bidIndex, 1);
      })
      .catch(function (err) {
        console.log('/api/bids/:BidId DELETE failed' + err);
      });
    }
  };


  $scope.getBids();
}]);
