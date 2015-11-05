describe('Auth Service', function() {


  var Auth;
  var location;

  var exampleUser = {
    email: 'bob@bob.com',
    password: 'bob'
  };

  beforeEach(angular.mock.module('shwop'));
  beforeEach(inject(function($injector) {
    Auth = $injector.get('Auth');
    location = $injector.get('$location');
  }));


  beforeEach(angular.mock.inject(function($httpBackend) {
    backend = $httpBackend;
    inject(function($window) {
      window = $window;
    });
  }));

  afterEach(function() {
    backend.verifyNoOutstandingExpectation();
    backend.verifyNoOutstandingRequest();
  });

  it('Should make a POST request to /api/users/signin with correct data when signin is called', function(){
    backend.expectPOST('/api/users/signin', {email: 'bob@bob.com', password: 'bob'}).respond(200,'');
    Auth.signin(exampleUser);
    backend.flush();
  });

  it('Should make a POST request to /api/users/signup with correct data when signup is called', function(){
    backend.expectPOST('/api/users/signup', {email: 'bob@bob.com', password: 'bob'}).respond(200,'');
    Auth.signup(exampleUser);
    backend.flush();
  });

  it('Should return false when isAuth is called and the user has no token.', function(){
    expect(Auth.isAuth()).to.equal(false);
  })

  it('Should return true when isAuth is called and the user has a token.', function(){
    window.localStorage.setItem('com.shwop','sadfaksjdbgksjdbfjksadf');
    expect(Auth.isAuth()).to.equal(true);
  })

  it('Should remove user token from localStorage and redirect to /signin when signout is called.', function(){
    expect(Auth.isAuth()).to.equal(true);
    Auth.signout();
    expect(Auth.isAuth()).to.equal(false);
    expect(window.localStorage.getItem('com.shwop')).to.equal(null);
    expect(location.path()).to.equal('/signin');
  })
});