var request = require('request');
var expect = chai.expect;

describe('server', function () {
  it('should respond to GET requests for /api/products with a 200 status code', function (done) {
    request('http://127.0.0.1:8080/api/products', function (error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });
});