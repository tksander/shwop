
var db = require('../../server/db/db_config.js');
var Promise = require('bluebird');

// create a  user
var createUser = function (user) {
  db.User.create(user)
  .then(function (result) {
    return result;
  })
  .catch(function (error) {
    console.log('Error creating new user:', error);
  });
};

// User format is Object, Product format is Object, Tags format is Array
var createProduct = function (userModel, product, tags, callback) {
  // FindOne with user.email
  // findOrCreate tags
  // Create product

  // Allows for 
  var productModel;

  var promiseModels = [];
  for(var i = 0; i < tags.length; i++) {
    promiseModels.push(db.Tag.findOrCreate({where: { tagName: tags[i] }}));
  }
  // promiseModels.push(db.User.findOne({where: {email: user.email}}));
  promiseModels.push(db.Product.create(product));

  Promise.all(promiseModels)
  .spread(function () {
    var args = Array.prototype.slice.call(arguments);
    productModel = args.pop();
    // userModel = args.pop();

    var results = [];
    for(var i = 0; i < args.length; i++) {
      results.push(args[i][0]);
    }
    // Save
    return productModel.setTags(results);
  })
  .then(function (results) {
    return productModel.setUser(userModel);
  })
  .then(function (result) {
    console.log('Success! Create a product with user and tags.');
    callback(null, result);
  })
  .catch(function (error) {
    console.log('Error in createProduct function: ', error);
    callback(error, null);
  });
};

exports.createProduct = createProduct;