
describe('SellController', function() {
  var createController;
  var $controller;

  var exampleArray = [1, 3, 5, 7];

  beforeEach(module('shwop'));

  beforeEach(inject(function(_$controller_, Auth) {
      $controller = _$controller_;
      AuthService = Auth;
      sinon.spy(AuthService,'signout');
  }));

  describe('$scope.addTag', function() {
    it('Should add the passed-in tag to the passed-in array', function(){
      var $scope = {};
      $scope.data = {};
      var controller = $controller('SellController', {$scope: $scope});

      $scope.data.tag = "five";
      $scope.product.tags = ["one", "two", "three", "four"];
      $scope.addTag();
      expect($scope.product.tags[4]).to.equal('five');
    });
  });

  describe('$scope.signout', function() {
    it('calls the signout method on the Auth service', function() {
      var $scope = {};
      var controller = $controller('SellController', { $scope: $scope });
      $scope.signout();
      assert(AuthService.signout.calledOnce);
    });
  });
});

