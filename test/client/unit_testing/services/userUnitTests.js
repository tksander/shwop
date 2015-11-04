

describe('Users Service', function() {

  var Users;
  var exampleUser = {
    id: 42,
    firstName: 'Han',
    lastName: 'Solo',
    phoneNumber: '1234567890',
    email: 'hansolo@milleniumf.io',
    password: 'Chewie',
    address1: '1122 Alderaan Way',
    address2: 'Suite 601',
    city: 'Trading Outpost',
    state: 'Tatooine',
    zip: '10001',
    country: 'Tatooine',
    latitude: 29.7604,
    longitude: 95.3698
  };

  beforeEach(angular.mock.module('shwop'));
  beforeEach(inject(function($injector) {
    Products = $injector.get('Users');
  }));


  beforeEach(angular.mock.inject(function($httpBackend) {
    backend = $httpBackend;
  }));

  afterEach(function() {
    backend.verifyNoOutstandingExpectation();
    backend.verifyNoOutstandingRequest();
  });

  it('Should make a GET request to /api/users when getUsers is called', function(){
    backend.expectGET('/api/users').respond(200,'');
    Users.getUsers();
    backend.flush();
  });

  it('Should post correct data to /api/users/profile when getUserInfo is called', function() {
    backend.expectPOST('/api/users/profile', {token: 'superSecretToken111'}).respond(200,'');
    Users.getUserInfo('superSecretToken111');
    backend.flush();
  });

  it('Should post correct data to /api/users when addUser is called', function() {
    backend.expectPOST('/api/users', exampleUser).respond(200,'');
    Users.addUser(exampleProduct);
    backend.flush();
  });


  it('Should make a GET request to "/api/users/ + UserId" when getUserLocation is called', function() {
    backend.expectGET('/api/users/42').respond(200,'');
    Products.getUserLocation(42);
    backend.flush();
  });

});
