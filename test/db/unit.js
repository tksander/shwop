var expect = require('chai').expect;
var Promise = require('bluebird');
var Sequelize = require('sequelize');
var clearDB = require('../../server/db/clear_db.js');
var helpers = require('../../server/db/helpers.js');
var db = require('../../server/db/db_config.js');


describe('Database unit tests', function () {

    var JSONresponse = { products: 
        [{ name: 'book',    photoURL: 'http://placehold.it/120x120&text=image1', price: 50.00 },
         { name: 'racecar', photoURL: 'http://placehold.it/120x120&text=image2', price: 15.25 },
         { name: 'wallet',  photoURL: 'http://placehold.it/120x120&text=image3', price: 101.99 }]
      };

   /* This section includes all unit tests related to the
   * Products table in the database.
   */
  describe('Products table', function () {

    //This runs before each test
    beforeEach(function (done) {
      clearDB(done);
    });

    after(function (done) {
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
    });

    describe('Create record without photo url' , function () {

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
        email: 'michael@jordan.com',
        password: 'bulls4ever'
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
        .spread(function (user, product) { // [User, Product] 
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
  });

});
