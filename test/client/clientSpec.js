

describe('Products Service', function() {

  var Products;
  var exampleProduct = {
    id:1, 
    name:'car', 
    photoURL: 'http://files.parsetfss.com/743459eb-d522-41ce-8aa8…bbca6a01-64c9-456b-95d0-1328f29b26ba-IMG_5986.jpg', 
    price: 20000
  };

  var exampleBidData = {
    token: 'superSecretToken111',
    productId: 1,
    bidAmount: 20
  };

  beforeEach(angular.mock.module('shwop'));
  beforeEach(inject(function($injector) {
    Products = $injector.get('Products');
  }));


  beforeEach(angular.mock.inject(function($httpBackend) {
    backend = $httpBackend;
    // backend.expect('GET','/api/products').respond([
    //   {"name": " Bob", "age": 18}
    // ]);
  }));

  afterEach(function() {
    backend.verifyNoOutstandingExpectation();
    backend.verifyNoOutstandingRequest();
  });

  it('Should make a GET request to /api/products when getAllProducts is called', function(){
    backend.expectGET('/api/products').respond(200,'');
    Products.getAllProducts();
    backend.flush();
  });

  it('Should successfully set and get a current product', function() {
    Products.setCurrentProduct('hot dog');
    expect(Products.getCurrentProduct()).to.equal('hot dog');
  });

  it('Should post correct data to /api/products when addProduct is called', function() {
    backend.expectPOST('/api/products', exampleProduct).respond(200,'');
    Products.addProduct(exampleProduct);
    backend.flush();
  });

  it('Should post correct data to /api/bids when sendBid is called', function() {
    backend.expectPOST('/api/bids', exampleBidData).respond(200,'');
    Products.sendBid('superSecretToken111', 1, 20);
    backend.flush();
  });

  it('Should post correct data to api/bids/allBids when getAllBids is called', function() {
    backend.expectPOST('api/bids/allBids', {token: 'superSecretToken111'}).respond(200,'');
    Products.getAllBids('superSecretToken111');
    backend.flush();
  });

  it('Should make a DELETE request to correct bid when getAllBids is called', function() {
    backend.expectDELETE('/api/bids/3').respond(200,'');
    Products.deleteMyBid(3);
    backend.flush();
  });

  it('Should make a GET request with correct tag when getProductsByTag is called', function() {
    backend.expectGET('/api/products/shoe').respond(200,'');
    Products.getProductsByTag('shoe');
    backend.flush();
  });

  it('Should make a POST request with correct token when getUserProducts is called', function() {
    backend.expectPOST('/api/products/mystore').respond(200,'');
    Products.getUserProducts('superSecretToken111');
    backend.flush();
  });

  it('Should make a DELETE request with correct product ID when deleteProduct is called', function() {
    backend.expectDELETE('/api/products/3').respond(200,'');
    Products.deleteProduct(3);
    backend.flush();
  });

  it('Should return the distance between 2 lat/long points when getDistance is called', function() {
    expect(Products.getDistance(29.7604,95.3698,37.7833,122.4167)).to.be.at.least(1642);
    expect(Products.getDistance(29.7604,95.3698,37.7833,122.4167)).to.be.at.most(1643);
  });

  it('Should make a GET request to /api/products/tags (with correct product id) when getTags is called', function() {
    backend.expectGET('/api/products/tags/3').respond(200,'');
    Products.getTags(3);
    backend.flush();
  });

});



//BELOW CODE TRIES TO TEST BOTH CONTROLLER AND SERVICE FROM SAME FILE, CAUSING ISSUES.


// describe('ProductController', function() {
//   beforeEach(angular.mock.module('shwop'));
//   describe('getAllProducts', function() {
//     var $httpBackend, $rootScope, createController;

//     beforeEach(inject(function($injector){

//       $httpBackend = $injector.get('$httpBackend')

//       $rootScope = $injector.get('$rootScope');
//       var $controller = $injector.get('$controller');
//       var Products = $injector.get('Products');

//       createController = function() {
//         return $controller('ProductController', {
//           '$scope': $rootScope
//         });
//       };
//     }));


//     it('should give back the data I want', function(){
//       $httpBackend.when('GET', '/api/products').respond( 
//         {'products':
//           [{url: '../../photos/chessboard.jpg', price: 60}, 
//           {url: '../../photos/decoration.jpg', price: 100}, 
//           {url: '../../photos/drone.jpg', price: 300}, 
//           {url: '../../photos/plane.jpg', price: 35000}]
//         });
//       createController();
//       $rootScope.getAllProducts(
//         function(output){
//           console.log('\n\n\n*** fasdf',output);
//           //expect($rootScope.data.products[0]['name']).to.equal('fleevasdgasdgsadg');
//         }
//       );
//       $rootScope.$apply();
      
//     });
//   })
// })
