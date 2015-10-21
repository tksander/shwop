var db = require('../db/db_config.js');
var util = require('../config/utils.js');


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
    db.Product.create({
      name: req.body.name,
      photoURL: req.body.photoURL,
      price: req.body.price
    })
    .then(function (product) {
      console.log('Successfully added product to database');
      res.send('Creation successful');
      // for each tag
      for (var i = 0; i < tags.length; i++) {
        db.Tag.findOrCreate({ where: { tagName: tags[i] } })
        .spread(function (tag, created) {
          console.log('created');
        });
      }
      // if not already in tags table
      //   add to tags table
      // add tag-product to tag-product table
    })
    .catch(function (error) {
      next(error);
    });

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


