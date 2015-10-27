var expect = require('chai').expect;
var Promise = require('bluebird');
var Sequelize = require('sequelize');
var clearDB = require('../../server/db/clear_db.js');
var helpers = require('../../server/db/helpers.js');
var db = require('../../server/db/db_config.js');

describe('Database integration tests', function () {
  //initializes test data
  var JSONresponse = { products: 
        [{ name: 'book',    photoURL: 'http://placehold.it/120x120&text=image1', price: 50.00 },
         { name: 'racecar', photoURL: 'http://placehold.it/120x120&text=image2', price: 15.25 },
         { name: 'wallet',  photoURL: 'http://placehold.it/120x120&text=image3', price: 101.99 }]
  };

  //clears the database before each test
  beforeEach(function (done) {
    clearDB(done);
  });

  //clears the database after all tests have complete
  after(function (done) {
    clearDB(done);
  });

  xdescribe('Adding to join table', function () {

    it('should create a product and tag record and associate in database', function (done) {

      var tagsArr = [];
      var names = ['Bobblehead', 'Baseball', 'Ken Griffey Jr'];
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
        .then(function (results) {
          console.log("all files were created");
          product = results.pop();
          return product.setTags(results);
        })
        .then(function () {
          return db.Product.findOne({
            where: { name: 'ken griffey jr bobblehead' }
          });
        })
        .then(function (product) {
          expect(product).to.exist;
          return product.getTags();
        })
        .then(function (associatedTasks){
          expect(associatedTasks.length).to.equal(3);
          expect(associatedTasks[0].dataValues.tagName).to.equal('Bobblehead');
          done();
        });

    });
  });

  describe('Retrieves multiple products associated with user', function () {

    //dummy user data
    var user2 = { 
      firstName: 'Dennis',
      lastName: 'Jordan',
      phoneNumber: '(232)323-1995',
      email: 'michael@jordan.com',
      password: 'bulls4ever'
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
      .then(function (results) { 
        var user = results.pop();
        return user.setProducts(results);
      })
      .then(function (results) {
        return db.User.findOne({where: {firstName: 'Dennis'}});
      })
      .then(function (user) {
        return user.getProducts();
      })
      .then(function (products) {
        expect(products.length).to.equal(2);
        expect(products[0].dataValues.name).to.equal('bob griffey jr bobblehead');
        done();
      });

    });
  });


  describe('Retrieves products for tag', function () {

    it('should get all products matching tag', function (done) {

      var tagsArr = [];
      var names = ['Bobblehead', 'Baseball', 'Ken Griffey Jr', 'Seattle'];
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
      var names2 = ['Bat', 'Baseball', 'Mike Trout', 'Los Angeles', 'Angels', 'Sports'];
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
        return product.setTags(results);
      })
      .then(function (results) {
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
        return product.setTags(results);
      })
      .then(function (results) {
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
        expect(products.length).to.equal(2);
        expect(products[0].dataValues.name).to.equal('ken griffey jr bobblehead');
        expect(products[1].dataValues.name).to.equal('mike trout baseball bat');
        done();
      });
    });
  });

  describe('Full entry test', function () {

    var newUser = { 
      firstName: 'Michael',
      lastName: 'Jordan',
      phoneNumber: '(232)323-1995',
      email: 'michael@jordan.com',
      password: 'bulls4ever'
    };

    it('should add a user, with a product, and associated tags', function (done) {
      var product;
      var user;
      var tagsArr = [];
      var names = ['Bobblehead', 'Baseball', 'Ken Griffey Jr', 'Seattle'];
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
      var names2 = ['Bat', 'Baseball', 'Mike Trout', 'Los Angeles', 'Angels', 'Sports'];
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
        return product.setTags(results);
      })
      .then(function (results) {
        return product.setUser(user);
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
        return product.setTags(results);
      })
      .then(function (results) {
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
        expect(products[0].dataValues.UserId).to.equal(1);
        done();
      });
    });
  });
});

