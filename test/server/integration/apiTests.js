var request = require('supertest'); // http assertions made easy
var sinon = require('sinon');

describe('API calls', function () {
  var app, JSONresponse, findAllStub;

  before(function () {
    process.env.NODE_ENV = 'test';
    app = require('../../../server/server');
    
    JSONresponse = { products: 
      [{ id: 123, photoUrl: 'http://placehold.it/120x120&text=image1', price: 50.00, user_id: 111 },
       { id: 456, photoUrl: 'http://placehold.it/120x120&text=image2', price: 15.25, user_id: 112 },
       { id: 789, photoUrl: 'http://placehold.it/120x120&text=image3', price: 101.99, user_id: 113 }]
    };

    // findAllStub = sinon.stub(allProducts, 'findAll');

  });

  after(function () {
    // allProducts.findAll.restore();
  });

  describe('GET /api/products', function () {
    xit('should respond with a 200 status code', function (done) {
      request(app)
        .get('/api/products')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

    describe('POST /api/products', function () {
    xit('should respond with a 200 status code', function (done) {
      request(app)
        .get('/api/products')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
});
