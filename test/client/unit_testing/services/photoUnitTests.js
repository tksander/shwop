

describe('Photos Service', function() {

  var Photos;

  var exampleParseKeys = {
          'X-Parse-Application-Id': 'sup3rcal1frag1l1st1c3xp1al1d0c10us',
          'X-Parse-REST-API-Key': 'su01c0d1la1px3c1ts1l1garf1lac3pus'
  };

  beforeEach(angular.mock.module('shwop'));
  beforeEach(inject(function($injector) {
    Photos = $injector.get('Photos');
  }));


  beforeEach(angular.mock.inject(function($httpBackend) {
    backend = $httpBackend;
  }));

  afterEach(function() {
    backend.verifyNoOutstandingExpectation();
    backend.verifyNoOutstandingRequest();
  });

  it('Should make a GET request to /api/products/keys when getPhotoAPIKeys is called', function(){
    backend.expectGET('/api/products/keys').respond(200, exampleParseKeys);
    Photos.getPhotoAPIKeys();
    backend.flush();
  });
});
