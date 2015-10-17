var expect = require('chai').expect

describe('Database', function () {
  var db = require('../../server/db/db_config.js');
  describe('Products table', function () {
    var JSONresponse;

    before(function () {
      // Clears all the records from Products database
      db.Product.destroy({where: {photoURL: 'http://placehold.it/120x120&text=image1'},truncate: true});

      JSONresponse = { products: 
        [{ photoURL: 'http://placehold.it/120x120&text=image1', price: 50.00 },
         { photoURL: 'http://placehold.it/120x120&text=image2', price: 15.25 },
         { photoURL: 'http://placehold.it/120x120&text=image3', price: 101.99 }]
      };
    })
    describe('Create one record', function () {
      it('should create one record and find within database', function (done) {
        
        db.Product.create({ 
          photoURL: 'http://placehold.it/120x120&text=image1',
          price: 50.52 
        })
        .then(function() {
          db.Product.findOne({
            where: {photoURL: 'http://placehold.it/120x120&text=image1'}
          })
          .then(function(record) {
            expect(record).to.exist;
            expect(record.dataValues.photoURL).to.equal('http://placehold.it/120x120&text=image1');
            done();
          })
        })

      })
    });
  });
});


// Check if one item was inputted 


// db.Product.bulkCreate(JSONresponse.products)
//   .then(function() {
//     console.log('products created');
//   });



// Check data was added to the Products table in DB

// Get all query to DB, should return 3 products