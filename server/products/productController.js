var db = require('../db/db_config.js');
var Product = require('./productModel.js');
var Q = require('q');  // a library for promises
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

  // adds a new product to the database
  newProduct: function (req, res, next) {

    db.Product.create({
      name: req.body.name,
      photoURL: req.body.photoURL,
      price: req.body.price
    })
    .then(function (product) {
      console.log('Successfully added product to database');
      // for each tag
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

    db.Product.update({
      name: req.body.name,
      photoURL: req.body.photoURL,
      price: req.body.price
    }, {
      where: { id: req.body.id }
    })
    .then(function (product) {
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


