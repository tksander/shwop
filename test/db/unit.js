var expect = require('chai').expect;
var Sequelize = require('sequelize');

describe('Database', function () {
  var db = require('../../server/db/db_config.js');

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

    //This runs before each test
    beforeEach(function (done) {

      // Disable the check for foreign keys to enable TRUCATE. Otherwise, we cannot clear b/c of constraints
      db.Orm.query('SET FOREIGN_KEY_CHECKS = 0')
      .then(function (){
        return db.Orm.sync({ force: true });
      })
      .then(function (){
        return db.Orm.query('SET FOREIGN_KEY_CHECKS = 1');
      })
      .then(function (){
        console.log('Database synchronised.');
        done();
      })
      .catch(function (error) {
        console.log('Found an error: ', error);
        done();
      });

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

  });


  /*
   * This section includes all unit tests related to the
   * Users table in the database.
   */
  describe('Users table', function () {

  });


  /*
   * This section includes all unit tests related to the
   * Tags table in the database.
   */
  describe('Tags table', function () {

  });


});

// Check if one item was inputted 



// Check data was added to the Products table in DB

// Get all query to DB, should return 3 products
