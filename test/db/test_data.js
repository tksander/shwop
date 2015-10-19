var expect = require('chai').expect;

describe('Database', function () {
  var db = require('../../server/db/db_config.js');
  describe('Products table', function () {
    var JSONresponse;

    before(function () {

      JSONresponse = { products: 
        [{ name: 'book', photoURL: 'http://placehold.it/120x120&text=image1', price: 50.00 },
         { name: 'racecar', photoURL: 'http://placehold.it/120x120&text=image2', price: 15.25 },
         { name: 'wallet', photoURL: 'http://placehold.it/120x120&text=image3', price: 101.99 }]
      };
    });

    beforeEach(function () {
      // Clears all the records from Products database
      db.Product.destroy(
        {where: 
          {photoURL: 'http://placehold.it/120x120&text=image1'},
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
        .then(function() {
          db.Product.findOne({
            where: {name: 'old couch'}
          })
          .then(function(product) {
            expect(product).to.exist;
            expect(product.dataValues.name).to.equal('old couch');
            done();
          });
        });

      });

    });

    describe('Create multiple records', function () {
      it('should create 3 records and find within database', function (done) {
        
        db.Product.bulkCreate(JSONresponse.products)
          .then(function () {
            console.log('products created');
          })
        .then(function () {
          db.Product.findAll()
          .then(function (products) {
            expect(products.length).to.equal(3);
            done();
          });
        });

      });
    });

    // describe('Not find a record that doesn\'t exist', function () {
    //   it('should throw error when looking for non-existant record', function (done) {
        
    //     var findNonExistantProduct = function () {
    //       return db.Product.findOne({
    //         where: {name: 'coffee cup'}
    //       }).then(function (product) {
    //         console.log('found the product');
    //         return product;
    //         done();
    //       }).catch(function () {
    //         console.log('in the catch statement');
    //         throw err;
    //         done();
    //       });
    //     };

    //     expect(findNonExistantProduct()).to.throw(Error);

    //   });
    // });


  });
});

// Check if one item was inputted 



// Check data was added to the Products table in DB

// Get all query to DB, should return 3 products