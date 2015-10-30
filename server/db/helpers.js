
var db = require('../../server/db/db_config.js');
var Promise = require('bluebird');
var request = require('request');
if (!process.env.GoogleKey) {
  var locally = require('../../sneakyLocal.js');
}

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

var addLongAndLat = function (user) {
  var address1 = user.address1.split(' ').join('+');
  var city = user.city.split(' ').join('+');
  var state = user.state.split(' ').join('+');
  var zip = user.zip.split(' ').join('+');
  var address = address1 + ',+' + city + ',+' + state + ',+' + zip;
  var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + (process.env.GoogleKey || locally.GoogleKey);
  return request(url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var JSONbody = JSON.parse(body);
      var longitude = JSONbody.results[0].geometry.location.lng;
      var latitude = JSONbody.results[0].geometry.location.lat;
      return db.User.update({ 
        longitude: longitude,
        latitude: latitude,
      }, {
        where: {
          email: user.email
        }
      });
    }
  });
};

exports.createProduct = createProduct;
exports.addLongAndLat = addLongAndLat;


