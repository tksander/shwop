var db = require('../db/db_config.js');
var util = require('../config/utils.js');
var helpers = require('../db/helpers.js');
var jwt  = require('jwt-simple');
var Promise = require('bluebird');


module.exports = {

  // retrieve all the products from the database
  allProducts: function (req, res, next) {
    db.Product.findAll()
    .then(function (products) {
      if(products === null) {
        res.status(400).send('We could not find products in the database.');
      }
      res.send({products: products});
    })
    .catch(function (error) {
      res.status(400).send('Error retrieving all products from database: ' + error);
    });
  },

  productsByTags: function (req, res, next) {
    //query to find products by tags
    var tags = req.params.tags.split('+');
    // Category tag will always be inserted at end of tags array
    var categoryTag = tags.pop();
    var categoryProducts;
    console.log(categoryTag);

    // Get all associated products by Category tag
    db.Tag.findOne({where: {tagName: categoryTag}})
    .then(function (tag) {
      if(tag === null) {
        res.status(400).send('We could not find a tag in the database.');
      }
      return tag.getProducts();
    })
    .then(function (associatedProducts) {
      if(associatedProducts === null) {
        // Not sure if this is the correct error. Leaving in for future testing purposes. 
        res.status(400).send('We could not find the associated tags in the database.');
      }
      categoryProducts = associatedProducts;
      res.send({products: associatedProducts});
    })
    .catch(function (error) {
      return next(error);
    });
  },

  // adds a new product to the database
  newProduct: function (req, res, next) {

    var token = req.body.token;
    if (!token) {
      res.status(401).send('We could not locate the required token.');
      // Keeping this error syntax for future reference. 
      // next(new Error('No token'));
    } else {
      var user = jwt.decode(token, 'secret');
      db.User.findOne({where: {email: user.email}})
      .then(function (foundUser) {
        if (foundUser) {
          var product = req.body.product;
          var tags = req.body.tags;

          helpers.createProduct(foundUser, product, tags, function (error, result) {
            if (error) {
              next(error);
            }
            res.send(200);
          });
        } else {
          res.status(401).send('Error creating new product in database: We could not locate the product in the database.');
        }
      })
      .catch(function (error) {
        next(error);
      });
    }
  },


  updateProduct: function (req, res, next) {
    console.log('updating product');
    var updates = {};
    if (req.body.product.name)     { updates.name     = req.body.product.name     ;}
    if (req.body.product.photoURL) { updates.photoURL = req.body.product.photoURL ;}
    if (req.body.product.price)    { updates.price    = req.body.product.price    ;}

    db.Product.update(updates, { 
      where: { 
        id: req.body.product.id
      }
    })
    .then( function () {
      next();
    })
    .catch( function (err) {
      next(err);
    });
  },

  addTags: function (req, res, next) {
    console.log('adding tags:', req.body.addedTags);

    if (req.body.addedTags.length > 0) {
      var promiseModels = [];
      for(var i = 0; i < req.body.addedTags.length; i++) {
        promiseModels.push(db.Tag.findOrCreate({where: { tagName: req.body.addedTags[i] }}));
      }
      promiseModels.push(db.Product.findOne({where: {id: req.body.product.id }}));

      Promise.all(promiseModels)
      .spread(function () {
        var args = Array.prototype.slice.call(arguments);
        var productModel = args.pop();
        var results = [];
        for(var i = 0; i < args.length; i++) {
          results.push(args[i][0]);
        }
        return productModel.setTags(results);
      })
      .then(function () {
        next();
      })
      .catch(function (err) {
        next(err);
      });
    } else {
      next();
    }
  },

  removeTags: function (req, res, next) {
    console.log('removing tags:', req.body.removedTags);

    if (req.body.removedTags.length > 0) {
      var promiseModels = [];
      for(var i = 0; i < req.body.removedTags.length; i++) {
        promiseModels.push(db.Tag.find({where: { tagName: req.body.removedTags[i] }}));
      }
      promiseModels.push(db.Product.findOne({where: {id: req.body.product.id }}));

      Promise.all(promiseModels)
      .spread(function () {
        var args = Array.prototype.slice.call(arguments);
        var productModel = args.pop();
        var promises = [];
        for(var i = 0; i < args.length; i++) {
          promises.push(
            db.Product_Tag.destroy({
              where: {
                ProductId: productModel.id,
                TagId: args[i][0]
              }
            })
          );
        }
        return Promise.all(promises);
      })
      .then(function () {
        res.status(200).send('Item updated succcessfully');
      })
      .catch(function (err) {
        next(err);
      });
    } else {
      next();
    }
  },

  // update the product
  // updateProduct: function (req, res, next) {
  //   var promises = [];
  //   var tagIds = [];
  //   var productModel;

  //   var updates = {};
  //   if (req.body.product.name)     { updates.name     = req.body.product.name     ;}
  //   if (req.body.product.photoURL) { updates.photoURL = req.body.product.photoURL ;}
  //   if (req.body.product.price)    { updates.price    = req.body.product.price    ;}

  //   promises.push(db.Product.update(updates, { where: { id: req.body.product.id }}));
  //   for (var i = 0; i < req.body.addedTags.length; i++) {
  //     promises.push(db.Tag.findOrCreate({ where: { tagName: req.body.addedTags[i]}}));
  //   }
  //   Promise.all(promises)
  //   .spread(function () {
  //     var args = Array.prototype.slice.call(arguments, 1);
  //     for (var j = 0; j < args.length; j++) {
  //       tagIds.push(args[j][0].get('id'));
  //     }
  //     return db.Product.findOne({ where: { id: req.body.product.id }})
  //   .then(function (product) {
  //     productModel = product;
  //     return productModel.setTags(tagIds);
  //   })
  //   .then(function (results) {
  //     var toRemovePromises = [];
  //     console.log('results is ', results);
  //     for (var k = 0; k < req.body.removedTags.length; k++) {
  //       db.
  //     } 
  //   })

  //     res.status(200).send('Update successful');
  //   })
  //   .catch(function (error) {
  //     res.status(400).send('Error updating the product in database: ' + error);
  //   });
  // },

  // delete the product
  deleteProduct: function (req, res, next) {
    var productId = req.params.productId;
    db.Product_Tag.destroy({
      where: {
        ProductId: productId
      }
    })
    .then(function () {
      db.Product.destroy({
        where: {
          id: productId
        }
      });
    })
    //need to delete tags in the tags 
    .then(function () {
        res.status(200).send('Product successfully deleted.');
    })
    .catch(function (error) {
      res.status(400).send('Error deleting the product in the database: ' + error);
    });
  },

  // get all products the user is selling
  userProducts: function (req, res, next) {
    var token = req.body.token;
    if (!token) {
      next(new Error('No token'));
    } else {
      var user = jwt.decode(token, 'secret');
      db.User.findOne({where: {email: user.email}})
      .then(function (foundUser) {
        if (foundUser) {
          db.Product.findAll({where: { UserId: foundUser.id }})
          .then(function (foundProducts) {
            var productsArray = [];
            for (var i = 0; i < foundProducts.length; i++) {
              productsArray.push(foundProducts[i].dataValues);
            }
            res.send({products: productsArray});
          })
          .catch(function (err) {
            res.send(401, 'Error finding products');
          });
        } else {
          res.send(401,'corrupted token');
        }
      })
      .catch(function (error) {
        next(error);
      });
    }
  },

  //get all tags for a certain product
  productTags: function (req, res, next) {
    var id = req.params.productId;
    console.log('id is ', id);
    db.Product_Tag.findAll({
      where: { ProductId: id}
    })
    .then(function (product_tags) {
      var tagsPromises = [];
      for (var i = 0; i < product_tags.length; i++) {
        var tagId = product_tags[i].get('TagId');
        tagsPromises.push(db.Tag.findOne({
          where: { id: tagId}
        }));
      }
      return Promise.all(tagsPromises);
    })
    .then(function (tags) {
      var tagNames = [];
      for (var i = 0; i < tags.length; i++) {
        tagNames.push(tags[i].get('tagName'));
      }
      console.log('tagNames is ', tagNames);
      res.send({tags: tagNames});
    });
  }

};


