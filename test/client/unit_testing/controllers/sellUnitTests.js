
describe('SellController', function() {
  var backend, $rootScope, $location, $window, createController, authRequestHandler;
  var $controller;

  var exampleArray = [1, 3, 5, 7];

  beforeEach(module('shwop'));

  // define(['angular', 'angular-translate'], function (angular) {
  //     angular.module('shwop.sell', ['pascalprecht.translate']);
  // });

  beforeEach(inject(function(_$controller_) {
      // var scope = $rootScope.$new();
      // var translate = $translate;
      $controller = _$controller_;
      // var testCont = $controller('SellController', {$scope: scope});
  }));

  // beforeEach(inject(function($injector) {
  //   backend = $injector.get('$httpBackend');
  //   $rootScope = $injector.get('$rootScope');

  //   createController = function() {
  //     return $controller('SellController', {'$scope': $rootScope});
  //   };
  // }));

  // afterEach(function() {
  //   backend.verifyNoOutstandingExpectation();
  //   backend.verifyNoOutstandingRequest();
  // });

  describe('addTag', function() {
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

  // describe('addToArray', function() {
  //   it('Should add an item to the specified array if it is not already present', function(){
  //     $scope.addToArray(2, exampleArray);
  //     $scope.addToArray(4, exampleArray);
  //     $scope.addToArray(2, exampleArray);
  //     $scope.addToArray('', exampleArray);
  //     expect(exampleArray).to.equal([1, 3, 5, 7, 2, 4]);
  //   });
  // });

  // describe('isBlank', function() {
  //   it('Should return "true" if the passed-in item is an empty string and otherwise return "false"', function(){
  //     var $scope = {};
  //     var controller = $controller('SellController', {$scope: $scope});
  //     expect(isBlank('')).to.equal(true);
  //     expect(isBlank(' ')).to.equal(false);
  //     expect('So long and thanks for all the fish!').to.equal(false);
  //   });
  // });
});
