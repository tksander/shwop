var expect = require('chai').expect;
var Promise = require('bluebird');
var Sequelize = require('sequelize');
var clearDB = require('../../server/db/clear_db.js');


describe('Database', function () {
  var db = require('../../server/db/db_config.js');
  console.log('clearDB is ', clearDB);
  /*
   * This section includes all unit tests related to the
   * Products table in the database.
   */
  describe('Products table', function () {
    var JSONresponse;

    // This runs once
    before(function () {
      JSONresponse = { products: 
        [{ name: 'book',    photoURL: 'http://placehold.it/120x120&text=image1', price: 50.00 },
         { name: 'racecar', photoURL: 'http://placehold.it/120x120&text=image2', price: 15.25 },
         { name: 'wallet',  photoURL: 'http://placehold.it/120x120&text=image3', price: 101.99 }]
      };

    });

    after(function (done) {
      clearDB(done);
    });

    //This runs before each test
    beforeEach(function (done) {
      clearDB(done);
    });


    describe('Create one record', function () {

      it('should create one record and find within database', function (done) {
        
        db.Product.create({
          name: 'old couch',
          photoURL: 'http://placehold.it/120x120&text=image1',
          price: 50.52 
        })
        .then(function () {
          return db.Product.findOne({
            where: { name: 'old couch' }
          });
        })
        .then(function (product) {
          expect(product).to.exist;
          expect(product.get('name')).to.equal('old couch');
          done();
        });

      });

      it('should throw an error if all required fields are not provided', function (done) {
        
        var postWithoutPhoto = function () {
          db.Product.create({
            name: 'gary payton vintage jersey',
            price: 500.00 
          })
          .then(function () {
            console.log('Warning! A product was successfully posted without a photo');
            expect(undefined).to.be.ok;
            done();
          })
          .catch(function (err) {
            expect(err).to.be.ok;
            done();
          });
        };

        // expect(postWithoutPhoto).to.throw(Error);
        postWithoutPhoto();
      });
    });

    describe('Create multiple records', function () {

      it('should create 3 records and find within database', function (done) {
        
        db.Product.bulkCreate(JSONresponse.products)
        .then(function () {
          return db.Product.findAll();
        })
        .then(function (products) {
          expect(products.length).to.equal(3);
          done();
        });

      });
    });

    describe('Delete specific records', function () {

      it('should find one record and delete from database', function (done) {
       
        db.Product.bulkCreate(JSONresponse.products)
        .then(function () {
          return db.Product.findOne({ where: { name: 'book' } });
        })
        .then(function (product) {
          return product.destroy();
        })
        .then(function() {
          // console.log('Model destroyed.');
          return db.Product.findOne({ where: { name: 'book' } });
        })
        .then(function (product) {
          // console.log('Result of find operation: ', product);
          expect(product).to.equal(null);
          return db.Product.findOne({ where: {name: 'racecar'} });
        })
        .then(function (product) {
          // console.log('Result of find operation: ', product.dataValues.name);
          expect(product.get('name')).to.equal('racecar');
          done();
        })
        .catch(function (error) {
         console.log("Found this error:  ", error);
        });

      });
    });

    describe('Updating a product record', function () {

      it('should create a product record and update its price', function (done) {
        var priceBefore = 24.24;
        var priceAfter = 99.99;

        db.Product.create({
          name: 'ken griffey jr bobblehead',
          photoURL: 'http://placehold.it/120x120&text=image1',
          price: priceBefore
        })
        .then(function () {
          return db.Product.findOne({
            where: { name: 'ken griffey jr bobblehead' }
          });
        })
        .then(function (product) {
          expect(product.get('price')).to.equal(priceBefore);
        })
        .then(function () {
          return db.Product.update({ price: priceAfter }, {
            where: { name:'ken griffey jr bobblehead' }
          });
        })
        .then(function () {
          return db.Product.findOne({
            where: { name: 'ken griffey jr bobblehead' }
          });
        })
        .then(function (product) {
          expect(product.get('price')).to.equal(priceAfter);
          done();
        });
      });
    });

    describe('Adding to join table', function () {

      it('should create a product and tag record and associate in database', function (done) {

        var tagsArr = [];
        var names = ['Bobblehead', 'Baseball', 'Ken Griffey Jr']
        for(var i = 0; i < names.length; i++) {
          tagsArr.push(db.Tag.create({ tagName: names[i] }));
        }
        tagsArr.push(db.Product.create({
                      name: 'ken griffey jr bobblehead',
                      photoURL: 'http://placehold.it/120x120&text=image1',
                      price: 55.55
                      })
        );

        // Promise.all takes the array of promises and fulfills them at once
        // https://www.promisejs.org/patterns/
        Promise.all(tagsArr)
          .then(function(results) {
            console.log("all files were created");
            product = results.pop();
            // Save
            product.setTags(results).then(function() {
              // saved!
              // console.log('saved!');
            });
          })
          .then(function() {
            return db.Product.findOne({
              where: { name: 'ken griffey jr bobblehead' }
            });
          })
          .then(function(product) {
            expect(product).to.exist;
            // ok now they are saved
            return product.getTags();
          })
          .then(function(associatedTasks){
            expect(associatedTasks.length).to.equal(3);
            expect(associatedTasks[0].dataValues.tagName).to.equal('Bobblehead');
            done();
          });

      });
    });
  });


// write test for products user foreign key 
  // read & write query 

  /*
   * This section includes all unit tests related to the
   * Users table in the database.
   */
  describe('Users table', function () {

    after(function (done) {
      clearDB(done);
    });

    //This runs before each test
    beforeEach(function (done) {
      clearDB(done);
    });


    describe('Retrieves product associated with user', function () {
      //dummy user data
      var user = { 
        firstName: 'Poopy',
        lastName: 'Jordan',
        phoneNumber: '(232)323-1995',
        email: 'michael@jordan.com'
       };

       var product1 = {
                      name: 'ken griffey jr bobblehead',
                      photoURL: 'http://placehold.it/120x120&text=image1',
                      price: 55.55
        };

      it('should return single product associated with user', function (done) {


        var promiseArray = [];
        promiseArray.push(db.User.create(user));
        promiseArray.push(db.Product.create(product1));

        Promise.all(promiseArray) // Creates User and Product
        .spread(function(user, product) { // [User, Product] 
          // console.log(product);
          return product.setUser(user);
        })
        .then(function () {
          return db.Product.findOne({where: {name: 'ken griffey jr bobblehead'}});
        })
        .then(function (product) {
          // console.log(product);
          return product.getUser(); // Get the User associate with this Product
        })
        .then(function (user) {
          expect(user.dataValues.firstName).to.equal('Poopy');
        })
        .then(function () {
          return db.User.findOne({where: {firstName: 'Poopy'}});
        })
        .then(function (user) {
         return user.getProducts(); // Get the Product associated with this User, Returns an array
        })
        .then(function (product) {
          expect(product[0].dataValues.name).to.equal('ken griffey jr bobblehead');
          done();
        });

        // -------------------------------------------------------------
        // Alternative way to create the Product and User. 
        // This way does not allow to pass an object for Product attributes though. 
        // -------------------------------------------------------------

        // db.Product.create({
        //    name: 'ken griffey jr bobblehead',
        //     photoURL: 'http://placehold.it/120x120&text=image1',
        //     price: 13.37,
        //   User: user
        // }, {
        //   include: [ db.User ]
        // })
        // .then(function () {
        //   return db.Product.findOne({where: {name: 'ken griffey jr bobblehead'}})
        // })
        // .then(function (product) {
        //   // console.log(product);
        //   return product.getUser();
        // })
        // .then(function (user) {
        //   expect(user.dataValues.firstName).to.equal('Poopy')
        //   done()
        // })
      });
    });

    describe('Retrieves multiple products associated with user', function () {

      //dummy user data
      var user2 = { 
        firstName: 'Dennis',
        lastName: 'Jordan',
        phoneNumber: '(232)323-1995',
        email: 'michael@jordan.com'
       };

      var product2 = {
                      name: 'bob griffey jr bobblehead',
                      photoURL: 'http://placehold.it/120x120&text=image1',
                      price: 55.55
      };

      var product3 = { 
                      name: 'knife',    
                      photoURL: 'http://placehold.it/120x120&text=image1', 
                      price: 50.00 
      };

      it('should return multiple products associated with user', function (done) { 

        var promiseArray2 = [];
        promiseArray2.push(db.Product.create(product2));
        promiseArray2.push(db.Product.create(product3));
        promiseArray2.push(db.User.create(user2));

        Promise.all(promiseArray2) // Creates User and 2 Products
        .then(function(results) { 
          var user = results.pop();
          return user.setProducts(results);
        })
        .then(function (results) {
          return db.User.findOne({where: {firstName: 'Dennis'}})
        })
        .then(function (user) {
          return user.getProducts();
        })
        .then(function (products) {
          expect(products.length).to.equal(2)
          expect(products[0].dataValues.name).to.equal('bob griffey jr bobblehead');
          done();
        })

      });
    });
  }); 


  /*
   * This section includes all unit tests related to the
   * Tags table in the database.
   */
  describe('Tags table', function () {

    after(function (done) {
      clearDB(done);
    });

    //This runs before each test
    beforeEach(function (done) {
      clearDB(done);
    });

    it('should get all products matching tag', function (done) {

      var tagsArr = [];
      var names = ['Bobblehead', 'Baseball', 'Ken Griffey Jr', 'Seattle']
      for(var i = 0; i < names.length; i++) {
        tagsArr.push(db.Tag.findOrCreate({where: { tagName: names[i] }}));
      }
      tagsArr.push(db.Product.create({
                    name: 'ken griffey jr bobblehead',
                    photoURL: 'http://placehold.it/120x120&text=image1',
                    price: 55.55
                    })
      );

      var tagsArr2 = [];
      var names2 = ['Bat', 'Baseball', 'Mike Trout', 'Los Angeles', 'Angels', 'Sports']
      for(var i = 0; i < names2.length; i++) {
        tagsArr2.push(db.Tag.findOrCreate({where: { tagName: names2[i] }}));
      }
      tagsArr2.push(db.Product.create({
                    name: 'mike trout baseball bat',
                    photoURL: 'http://placehold.it/120x120&text=image2',
                    price: 20.99
                    })
      );

      // Promise.all takes the array of promises and fulfills them at once
      // https://www.promisejs.org/patterns/
      Promise.all(tagsArr)
      .spread(function () {
        var args = Array.prototype.slice.call(arguments);
        var product = args.pop();

        var results = [];
        for(var i = 0; i < args.length; i++) {
          results.push(args[i][0]);
        }
        // Save
        return product.setTags(results)
      })
      .then(function(results) {
        // saved!
        console.log('saved1! ');
      })
      .then(function () {
        return Promise.all(tagsArr2);
      })
      .spread(function () {
        var args = Array.prototype.slice.call(arguments);
        var product = args.pop();

        var results = [];
        for(var i = 0; i < args.length; i++) {
          results.push(args[i][0]);
        }
        // Save
        return product.setTags(results)
      })
      .then(function(results) {
        // saved!
      })
      .then(function () {
        return db.Tag.findOne({
          where: { tagName: 'Baseball' }
        });
      })
      .then(function (tag) {
        return tag.getProducts();
      })
      .then(function (products) {
        done()
      })
    });
  });

  ////////////////////////////////////////////
  ////////////// Full Entry Test
  ////////////////////////////////////////////

  describe('Full entry test', function () {

    var newUser = { 
      firstName: 'Michael',
      lastName: 'Jordan',
      phoneNumber: '(232)323-1995',
      email: 'michael@jordan.com'
    };

    // after(function (done) {
    //   clearDB(done);
    // });

    //This runs before each test
    beforeEach(function (done) {
      clearDB(done);
    });

    it('should add a user, with a product, and associated tags', function (done) {
      var product;
      var user;
      var tagsArr = [];
      var names = ['Bobblehead', 'Baseball', 'Ken Griffey Jr', 'Seattle']
      for(var i = 0; i < names.length; i++) {
        tagsArr.push(db.Tag.findOrCreate({where: { tagName: names[i] }}));
      }
      tagsArr.push(db.User.create(newUser));
      tagsArr.push(db.Product.create({
                    name: 'ken griffey jr bobblehead',
                    photoURL: 'http://placehold.it/120x120&text=image1',
                    price: 55.55
                    })
      );

      var tagsArr2 = [];
      var names2 = ['Bat', 'Baseball', 'Mike Trout', 'Los Angeles', 'Angels', 'Sports']
      for(var i = 0; i < names2.length; i++) {
        tagsArr2.push(db.Tag.findOrCreate({where: { tagName: names2[i] }}));
      }
      tagsArr2.push(db.Product.create({
                    name: 'mike trout baseball bat',
                    photoURL: 'http://placehold.it/120x120&text=image2',
                    price: 20.99
                    })
      );


      Promise.all(tagsArr)
      .spread(function () {
        var args = Array.prototype.slice.call(arguments);
        product = args.pop();
        user = args.pop();

        var results = [];
        for(var i = 0; i < args.length; i++) {
          results.push(args[i][0]);
        }
        // Save
        return product.setTags(results)
      })
      .then(function(results) {
        // saved!
        return product.setUser(user);
        console.log('saved1! ');
      })
      .then(function () {
        return Promise.all(tagsArr2);
      })
      .spread(function () {
        var args = Array.prototype.slice.call(arguments);
        var product = args.pop();

        var results = [];
        for(var i = 0; i < args.length; i++) {
          results.push(args[i][0]);
        }
        // Save
        return product.setTags(results)
      })
      .then(function(results) {
        // saved!
      })
      .then(function () {
        return db.Tag.findOne({
          where: { tagName: 'Baseball' }
        });
      })
      .then(function (tag) {
        return tag.getProducts();
      })
      .then(function (products) {
        done()
      })
    });
  });



});

// Check if one item was inputted 



// Check data was added to the Products table in DB

// Get all query to DB, should return 3 products

