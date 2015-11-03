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
    console.log("Start of Product by Tags /()()()()()()()()()()(")
    // Splits the received tags into two array elements: Element 1 = Input Tag, Element 2 = Category Tag
    var tags = req.params.tags.split('+');
    var inputTags = [];
    console.log("TAGS ", tags);

    // Splits the Input Tag into separate words. This allows for search by each word entered into the search query. 
    // E.g., "Search: Brown cow" -> ["Brown", "cow"],
    if(tags[0] !== "null") {
      var inputTags = tags[0].split(" ");
    }

    // Add the Category Tag to the array of tags to be searched/compared
    if(tags[1] !== 'null') {
      inputTags.push(tags[1]);
    }
    console.log('input tags', inputTags);

    var tagPromises = [];
    // Search tags db by each Input Tag word in inputTags
    // !!! I'm not sure what will happen if one of these returns Null!!!
    for(var i = 0; i < inputTags.length; i++) {
      tagPromises.push(db.Tag.findAll({where: {'tagName': inputTags[i]}}));
    }

    Promise.all(tagPromises)
    .then(function (tags) {
      if(tags === null) {
        res.status(400).send("No tags were found matching your query.");
      }

      // 'tags' is an array of arrays (each array containing one db result)
      // so we break those arrays out here
      var fullTags = [];
      for(var k = 0; k < tags.length; k++) {
        // console.log("Broken out tag", tags[k][0]);s
        fullTags.push(tags[k][0]);
      }
      console.log("Full tags  id ", fullTags[0].dataValues.id);

      // Create an array of tagIds from the tags result
      var tagIds = [];
      for(var z = 0; z < fullTags.length; z++) {
        tagIds.push(fullTags[z].dataValues.id);
      }
      console.log("tagIds", tagIds);

      var tagIdPromises = [];
      // Get all productIds from Product_Tags table that match tagId
      for(var j = 0; j < tagIds.length; j++) {
        tagIdPromises.push(db.Product_Tag.findAll({where: {'TagId': tagIds[j]}}));
      }

      console.log('tag id promises', tagIdPromises);
      Promise.all(tagIdPromises)
      .then(function (productTags) {
        var fullproductTags = [];
        for(var w = 0; w < productTags.length; w++) {
          console.log("Broken out product_tag", productTags[w][0]);
          fullproductTags.push(productTags[w][0]);
        }
        console.log("Full tags  id ", fullproductTags);
        // for(var u = 0; u < productTags.length; u++) {
        //   console.log('productTags:  ', productTags[u]);
        // }

        // var res = _.countBy(productTags, function(object) {
        //   return object.dataValues.ProductId;
        // });
        // console.log('res', res);

        // Now we have all the product tags in one place as an array of objects. 

        // Create a library object of productIds

          // while loop - if there is a number that equals total number of tags, return product

          // else, decrement the number until condition is fulfilled

          // if no products are found, return null

          res.status(200);
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


