var expect = require('chai').expect;

describe('Database', function () {
  var db = require('../../server/db/db_config.js');
  describe('Products table', function () {
    var JSONresponse;

    // the before section runs once
    before(function () {

      JSONresponse = { products: 
        [{ name: 'book', photoURL: 'http://placehold.it/120x120&text=image1', price: 50.00 },
         { name: 'racecar', photoURL: 'http://placehold.it/120x120&text=image2', price: 15.25 },
         { name: 'wallet', photoURL: 'http://placehold.it/120x120&text=image3', price: 101.99 }]
      };

    });

    // the before each section runs before each test
    beforeEach(function () {
      // Clears all the records from Products database
      db.Product.destroy(
        {where: 
          {name: ''},
          truncate: true
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
            where: {name: 'old couch'}
          });
        })
        .then(function (product) {
          expect(product).to.exist;
          expect(product.get('name')).to.equal('old couch');
          done();
        });

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
            console.log('products created');
          })
        .then(function () {
          db.Product.findOne({where: {name: 'book'}})
          .then(function (product) {
            product.destroy()
              .then(function() {
                console.log('Model destoryed.');
                db.Product.findOne({where: {name: 'book'}})
                  .then(function(product) {
                    console.log('Result of find operation: ', product);
                    expect(product).to.equal(null);
                    db.Product.findOne({where: {name: 'racecar'}})
                      .then(function(product) {
                        console.log('Result of find operation: ', product.dataValues.name);
                        expect(product.dataValues.name).to.equal('racecar');
                        done();
                      })
                  })
              })
          });
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
            where: {name: 'ken griffey jr bobblehead'}
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
            where: {name: 'ken griffey jr bobblehead'}
          });
        })
        .then(function (product) {
          expect(product.get('price')).to.equal(priceAfter);
          done();
        });
      });

    });

  });
});

// Check if one item was inputted 



// Check data was added to the Products table in DB

// Get all query to DB, should return 3 products

