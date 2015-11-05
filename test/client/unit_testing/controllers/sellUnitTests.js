

xdescribe('SellController', function() {
  var backend, $rootScope, $location, $window, createController, authRequestHandler;

  var exampleArray = [1, 3, 5, 7];

  beforeEach(module('shwop.sell'));

  beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      testCont = $controller('SellController', {$scope: scope});
  }));

  // beforeEach(inject(function($injector) {
  //   backend = $injector.get('$httpBackend');
  //   $rootScope = $injector.get('$rootScope');

  //   createController = function() {
  //     return $controller('SellController', {'$scope': $rootScope});
  //   };
  // }));

  afterEach(function() {
    backend.verifyNoOutstandingExpectation();
    backend.verifyNoOutstandingRequest();
  });

  describe('addToArray', function() {
    it('Should add an item to the specified array if it is not already present', function(){
      $scope.addToArray(2, exampleArray);
      $scope.addToArray(4, exampleArray);
      $scope.addToArray(2, exampleArray);
      $scope.addToArray('', exampleArray);
      expect(exampleArray).to.equal([1, 3, 5, 7, 2, 4]);
    });
  });

  describe('isBlank', function() {
    it('Should return "true" if the passed-in item is an empty string and otherwise return "false"', function(){
      expect('').to.equal(true);
      expect(' ').to.equal(false);
      expect('So long and thanks for all the fish!').to.equal(false);
    });
  });
});
