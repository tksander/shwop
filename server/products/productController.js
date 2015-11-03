var db = require('../db/db_config.js');
var util = require('../config/utils.js');
var helpers = require('../db/helpers.js');
var jwt  = require('jwt-simple');
var _ = require('underscore');

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

  // productsByTags: function (req, res, next) {
  //   //query to find products by tags
  //   var tags = req.params.tags.split('+');
  //   // Category tag will always be inserted at end of tags array
  //   var categoryTag = tags.pop();
  //   var categoryProducts;
  //   console.log(categoryTag);

  //   // Get all associated products by Category tag
  //   db.Tag.findOne({where: {tagName: categoryTag}})
  //   .then(function (tag) {
  //     if(tag === null) {
  //       res.status(400).send('We could not find a tag in the database.');
  //     }
  //     return tag.getProducts();
  //   })
  //   .then(function (associatedProducts) {
  //     if(associatedProducts === null) {
  //       // Not sure if this is the correct error. Leaving in for future testing purposes. 
  //       res.status(400).send('We could not find the associated tags in the database.');
  //     }
  //     categoryProducts = associatedProducts;
  //     res.send({products: associatedProducts});
  //   })
  //   .catch(function (error) {
  //     return next(error);
  //   });
  // },

   productsByTags: function (req, res, next) {
    // Splits the received tags into two array elements: Element 1 = Input Tag, Element 2 = Category Tag
    var tags = req.params.tags.split('+');
    var inputTags = [];

    // Splits the Input Tag into separate words. This allows for search by each word entered into the search query. 
    // E.g., "Search: Brown cow" -> ["Brown", "cow"],
    if(tags[0] !== "null") {
      var inputTags = tags[0].split(" ");
    }

    // Add the Category Tag to the array of tags to be searched/compared
    if(tags[1] !== 'null') {
      inputTags.push(tags[1]);
    }

    // Search tags db by each Input Tag word in inputTags
    var tagPromises = _.map(inputTags, function(inputTag) {
      return db.Tag.findAll({where: {'tagName': inputTag}});
    });

    Promise.all(tagPromises)
    .then(function (tags) {
      console.log("Tags should equal null", tags.length);
      if(tags[0].length === 0) {
        res.status(200).send(null);
      } 

      // Flattens the returned array of arrays into one array of objects
      tags = _.flatten(tags);
      console.log("Tags after promise.all", tags);

      // Create an array of tagIds from the tags result
      var tagIds = _.map(tags, function(tags) {
        return tags.dataValues.id;
      });

      // Get all productIds from Product_Tags table that match tagId
      var tagIdPromises = _.map(tagIds, function(tagId) {
        return db.Product_Tag.findAll({where: {'TagId': tagId}});
      });

      Promise.all(tagIdPromises)
      .then(function (productTags) {

        // Flattens the returned array of arrays into one array of objects
        productTags = _.flatten(productTags);
        console.log(productTags);

        var productIdArray = helpers.maxProductId(productTags);   
        console.log("productIdArray  ", productIdArray);

        var productPromises = _.map(productIdArray, function (productId) {
          return db.Product.findAll({where: {id: productId}});
        })
        console.log("product promises", productPromises);

        Promise.all(productPromises)
        .then(function (products) {
          products = _.flatten(products);
          console.log("Final products!", products[0].dataValues);
          res.status(200).send({products: products});
        })
        .catch(function (error) {
          console.log(error);
        });

        
      })
      .catch(function (error) {
        return next(error);
      })

    })
    .catch(function (error) {
      return next(error);
    })
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

  // update the product
  updateProduct: function (req, res, next) {
    var updates = {};
    if (req.body.product.name)     { updates.name     = req.body.product.name     ;}
    if (req.body.product.photoURL) { updates.photoURL = req.body.product.photoURL ;}
    if (req.body.product.price)    { updates.price    = req.body.product.price    ;}

    db.Product.update(updates, {
      where: { id: req.body.product.id }
    })
    .then(function () {
      res.status(200).send('Update successful');
    })
    .catch(function (error) {
      res.status(400).send('Error updating the product in database: ' + error);
    });
  },

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


