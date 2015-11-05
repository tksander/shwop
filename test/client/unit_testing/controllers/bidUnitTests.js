
describe('BidController', function() {
  var createController;
  var $controller;

  beforeEach(module('shwop'));

  beforeEach(inject(function(_$controller_, Auth, Products) {
      $controller = _$controller_;
      AuthService = Auth;
      ProductsService = Products;
      sinon.spy(AuthService,'signout');
      sinon.spy(ProductsService, 'products')
  }));

  describe('$scope.cancel', function() {
    it('Should call the products method on the Products service', function(){
      var $scope = {};
      var controller = $controller('BidController', {$scope: $scope});
      $scope.cancel();
      assert(ProductsService.products.calledOnce);
    });
  });

  describe('$scope.signout', function() {
    it('calls the signout method on the Auth service', function() {
      var $scope = {};
      var controller = $controller('BidController', { $scope: $scope });
      $scope.signout();
      assert(AuthService.signout.calledOnce);
    });
  });
});
