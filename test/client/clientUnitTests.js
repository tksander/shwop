// // var SellController = require('../../client/app/sell/sell.js');
// // var angular = require('../../client/lib/angular-mocks/angular-mocks.js');
// // if (angular) {
// //   console.log("angular found!");
// // }

// var assert = require('assert');
// // var expect = require('chai').expect;

// describe('Controller Test', function() {

//   // Arrange
//   var mockScope = {};
//   var controller;

//   beforeEach(angular.mock.module('exampleApp'));

//   beforeEach(angular.mock.inject(function($controller, $rootScope) {
//     mockScope = $rootScope.$new();
//     controller = $controller('SellController', {
//       $scope: mockScope
//     });
//   }));

//   // Act and Assess
//   it('Creates variable', function() {
//     expect(mockScope.counter).toEqual(0);
//   });

//   it('Increments counter', function() {
//     mockScope.incrementCounter();
//     expect(mockScope.counter).toEqual(1);
//   });

// });

// xdescribe('BidController', function() {
//   describe('$scope.sendBid', function() {
//     it('should invoke the sendBid method of the Products factory with the proper arguments', function() {
//       $scope.something.somethingelse = 'dummy data';

//       assert.equal(0, $scope.errorMessages.length);
//     });

//   });

//   describe('$scope.cancel', function() {
//     it('should redirect the user to the products page', function () {

//     });
//   });
// });

// describe('SellController', function() {
//   describe('test Karma', function() {
//     var counter;

//     beforeEach(function() {
//       counter = 0;
//     });

//     it('increments value', function() {
//       counter++;
//       assert.equal(1, counter);
//     });
//   });

//   xdescribe('addToArray', function() {
//     var $scope;

//     beforeEach(function() {
//       $scope = {};
//     });

//     it('should add an item to the specified array, if the item is not already there and if the item is not an empty string', function() {
//     $scope.testArray = ['zero', 'one', 'two'];
//     addToArray('three', $scope.testArray);

//     assert.equal(4, $scope.testArray.length);
//     assert.equal('three', $scope.testArray[4]);
//     });
//   });

//   xdescribe('isBlank', function() {
//     it('should return true if the passed-in string does not contain any text and false if it does', function() {
//       assert.equal(true, isBlank(''));
//       assert.equal(false, isBlank('testString'));
//     });
//   });

//   xdescribe('$scope.addTag', function() {
//     var $scope;

//     beforeEach(function() {
//       $scope = {};
//     });

//     it('should add a tag to the tags array and then reset value of $scope.product.tag to empty string', function() {
//       $scope.product.tags = ['car', 'red'];
//       $scope.product.tag = ['hybrid'];

//       $scope.addTag();
//       assert.equal(3, $scope.product.tags.length);
//       assert.equal('hybrid', $scope.product.tags[2]);
//       assert.equal('', $scope.product.tag);
//     });
//   });

//   xdescribe('$scope.addPhoto', function() {
//     var $scope;

//     beforeEach(function() {
//       $scope = {};
//     });

//     it('should invoke uploadPhoto method of Photos factory, then store resulting url in $scope.product.photoURL', function() {
//       $scope.productPhoto = 'dummy data';

//       var Photos = {
//         uploadPhoto: function(file, callback) {
//           var url = 'http://www.testurl.com';
//           return url;
//         }
//       };

//       $scope.addPhoto();

//       assert.equal('http://www.testurl.com', $scope.product.photoURL);
//     });
//   });

//   xdescribe('$scope.addProduct', function() {
//     var $scope;

//     beforeEach(function() {
//       $scope = {};
//     });

//     xit('should invoke the addProduct method of the Products factory, then redirect to the products page', function() {
//       $scope.product = 'dummy data';

//       var Products = {
//         addProduct: function(product) {
//           return products;
//         }
//       };

//       $scope.addProduct();

//       assert.equal('http://www.testurl.com', $scope.product.photoURL);

//     });
//   });

//   xdescribe('fileread directive', function() {
//     it('should ensure that photos uploaded in browser are available for manipulation in the Angular controller', function() {

//     });
//   });
// });

// xdescribe('ProductController', function() {
//   describe('$scope.swiped', function() {
//     it('should remove the topmost photo from the array if the user swipes left', function() {

//     });

//     it('should invoke the bid method of the Products factory if the user swipes right', function() {

//     });
//   });

//   describe('$scope.getAllProducts', function() {
//     it('should invoke the getAllProducts method of the Products factory', function() {

//     });

//     it('should set $scope.data.products to the array of product data returned from the getAllProducts method', function() {

//     });

//     it('should set the current product to the first product in the array', function() {

//     });

//     it('should log an error message if the call to getAllProducts results in an error', function() {

//     });
//   });

//   describe('dragme directive', function() {

//   });
// });

// xdescribe('Products factory', function() {
//   describe('getAllProducts', function() {
//     it('should get all products from the database', function() {

//     });
//   });

//   describe('addProduct', function() {
//     it('should add a product to the database', function() {

//     });
//   });

//   describe('bid', function() {
//     it('should redirect the user to the /bid page', function() {

//     });
//   });

//   describe('products', function() {
//     it('should redirect the user to the /products page', function() {

//     });
//   });

//   describe('setCurrentProduct', function() {
//     it('should set the currentProduct variable to the passed-in product', function() {

//     });
//   });

//   describe('getCurrentProduct', function() {
//     it('should return the value of the currentProduct variable', function() {

//     });
//   });

//   describe('send bid', function() {
//     it('should post a bid to the database', function() {

//     });
//   });
// });

// xdescribe('Users factory', function() {
//   describe('getUsers', function() {
//     it('should get all users from the database', function() {

//     });
//   });

//   describe('addUser', function() {
//     it('should post a new user to the database', function() {

//     });
//   });
// });

// xdescribe('Photos factory', function() {
//   describe('resizeImage', function() {
//     it('should take an uploaded photo, resize it, convert it to a blob, and call the callback', function() {

//     });
//   });

//   describe('getPhotoAPIKeys', function() {
//     it('should return the keys needed to post photos to parse.com', function() {

//     });
//   });

//   describe('uploadPhoto', function() {
//     it('should post a photo to parse.com and call the callback with the resulting url', function() {

//     });
//   });
// });

// xdescribe('Auth factory', function() {
//   describe('signin', function() {

//   });

//   describe('signup', function() {

//   });

//   describe('isAuth', function() {

//   });

//   describe('isAuth', function() {

//   });
// });
