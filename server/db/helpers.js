
var db = require('../../server/db/db_config.js');
var Promise = require('bluebird');


var associateUserToProduct = function (userEmail, productName) {
  var promiseArray = [];
  promiseArray.push(db.User.findOne({ where: {email: 'michael@jordan.com'}}));
  promiseArray.push(db.Product.findOne({ where: { name: 'air jordan VII shoes'}}));
  Promise.all(promiseArray)
  .then(function (results) {
    var user = results[0];
    var product = results[1];
    // console.log('user is ', user);
    // console.log('product is ', product);
    return product.setUser(user);
  });
};

var createProduct = function (user, product, tags) {
  
};

// var createProductAndAssociateToUser = function(userEmail, productName) {
//   var promiseArray = [];
//   promiseArray.push(db.User.findOne({ where: {email: 'michael@jordan.com'}}));
//   promiseArray.push(db.Product.findOne({ where: { name: 'air jordan VII shoes'}}));
//   Promise.all(promiseArray)
//   .then(function (results) {
//     var user = results[0];
//     var product = results[1];
//     return product.setUser(user);
//   });
// };

exports.associateUserToProduct = associateUserToProduct;
exports.createProduct = createProduct;