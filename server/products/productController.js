var db = require('../db/db_config.js');
var util = require('../config/utils.js');
var helpers = require('../db/helpers.js');


module.exports = {

  // retrieve all the products from the database
  allProducts: function (req, res, next) {
    db.Product.findAll()
    .then(function (products) {
      res.send({products: products});
    })
    .catch(function (error) {
      next(error);
    });
  },

  productsByTags: function (req, res, next) {
    //query to find products by tags
    var tags = req.params.tags.split('+');
    console.log(tags);
    db.Tag.findAll({
      where: {
        tagName: tags[0]
      }
    })
    .then(function (tags) {
      res.send(tags);
      // return tags.getProducts();
    })
    .catch(function (err) {
      throw err;
    });
  },

  // adds a new product to the database
  newProduct: function (req, res, next) {
    var user = req.body.user;
    var product = req.body.product;
    var tags = req.body.tags;

    helpers.createProduct(user, product, tags);
  },

  // update the product
  updateProduct: function (req, res, next) {
    var updates = {};
    if (req.body.name) { updates.name = req.body.name; }
    if (req.body.photoURL) { updates.photoURL = req.body.photoURL; }
    if (req.body.price) { updates.price = req.body.price; }

    db.Product.update(updates, {
      where: { id: req.body.id }
    })
    .then(function () {
      console.log('Successfully updated the product');
      res.send('Update successful');
    })
    .catch(function (error) {
      next(error);
    });
  },

  // delete the product
  deleteProduct: function (req, res, next) {
    db.Product.findOne({ where: { id: req.body.id } })
    .then(function (product) {
      product.destroy();
    })
    .then(function () {
      console.log('Successfully deleted the product');
      res.send('Delete successful');
    });
  }

};


