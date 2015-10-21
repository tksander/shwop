var db = require('../../server/db/db_config.js');
var Promise = require('bluebird');
var helpers = require('../../server/db/helpers.js');

//dummy user data
var users = [
 { firstName: 'Michael',
   lastName: 'Jordan',
   phoneNumber: '(232)323-1995',
   email: 'michael@jordan.com'
 },
 { firstName: 'Bill',
   lastName: 'Gates',
   phoneNumber: '(101)111-1001',
   email: 'bill@microsoft.com'
 },
 { firstName: 'Donkey',
   lastName: 'Kong',
   phoneNumber: '(808)888-8181',
   email: 'donkey@nintendo.com'
 },
 { firstName: 'Ray',
   lastName: 'Ban',
   phoneNumber: '(777)777-7777',
   email: 'me@rayban.com',
 }
];

//dummy product data
var products = [
  { name: 'Nintendo 64 - grey',
    photoURL: 'http://i.imgur.com/ITxLVsn.jpg',
    price: 64.00,
    tags: ['nintendo', '64', 'grey', 'videogames', 'electronics'],
    // UserId: '3'
  },
  { name: 'ray ban sunglasses',
    photoURL: 'http://i.imgur.com/5ESVFt2.jpg',
    price: 100.00,
    tags: ['sunglasses', 'rayban', 'ray', 'bans', 'black', 'accessories'],
    // UserId: '4'
  },
  { name: 'xbox 360 with 1 working controller',
    photoURL: 'http://i.imgur.com/1AyzZOH.jpg',
    price: 360.00,
    tags: ['xbox', 'xbox 360', 'videogames', 'microsoft', 'controller', 'black'],
    // UserId: '2'
  },
  { name: 'donkey kong (Special Edition) for Supernintendo',
    photoURL: 'http://i.imgur.com/4nJFSwP.jpg',
    price: 1000.45,
    tags: ['donkey kong', 'donkey', 'kong', 'nintendo', 'videogames', 'electronics', 'games', 'supernintendo'],
    // UserId: '3'
  },
  { name: 'air jordan VII shoes',
    photoURL: 'http://i.imgur.com/Xz4kxFI.jpg',
    price: 7000.00,
    tags: ['jordan', 'nike', 'basketball', 'shoes', 'mens', 'apparel', 'black'],
    // UserId: '1'
  },
  { name: 'donkey kong retro womens tank top',
    photoURL: 'http://i.imgur.com/Rj13NmR.jpg',
    price: 12.99,
    tags: ['donkey kong', 'donkey', 'kong', 'retro', 'tank', 'top', 'shirt', 'apparel', 'womens'],
    // UserId: '3'
  },
];

var tags = [
  {tagName: 'nintendo'},
  {tagName: 'xbox'},
  {tagName: 'jordan'},
  {tagName: 'nike'},
  {tagName: 'retro'},
  {tagName: 'tank'},
  {tagName: 'videogames'},
  {tagName: 'ray'},
  {tagName: 'bans'},
  {tagName: 'grey'},
];


//add the dummy user data to the database
// db.User.bulkCreate(users)
// .then(function () {
//   return db.Product.bulkCreate(products);
// }
// .then(function () {
//   return associate.userToProduct('michael@jordan.com', 'air jordan VII shoes');
// }
// .then(function () {
//   return associate.userToProduct('donkey@nintendo.com', 'Nintendo 64 - grey');
// }
// .then(function () {
//   return associate.userToProduct('donkey@nintendo.com', 'donkey kong (Special Edition) for Supernintendo');
// }
// .then(function () {
//   return associate.userToProduct('donkey@nintendo.com', 'donkey kong retro womens tank top');
// }
// .then(function () { 
//   return associate.userToProduct('bill@microsoft.com', 'xbox 360 with 1 working controller');
// }
// .then(function () {
//   return associate.userToProduct('me@rayban.com', 'ray ban sunglasses');
// })
// .catch(function (err) {
//   console.log('There was an error creating dummy products');
//   throw err;
// })))))));

//add the dummy user data to the database
db.User.bulkCreate(users)
.then(function () {
  return db.User.findAll();
})
.catch(function (err) {
  console.log('There was an error creating dummy users');
  throw err;
});

//add the dummy product data to the database
db.Product.bulkCreate(products)
.then(function () {
  return db.Product.findAll();
})
.catch(function (err) {
  console.log('There was an error creating dummy products');
  throw err;
});

db.Tag.bulkCreate(tags)
.then(function () {
  return db.Tag.findAll();
})
.catch(function (err) {
  console.log('There was an error creating dummy tags');
  throw err;
});


helpers.associateUserToProduct('michael@jordan.com', 'air jordan VII shoes');
// associate.userToProduct('donkey@nintendo.com', 'Nintendo 64 - grey');
// associate.userToProduct('donkey@nintendo.com', 'donkey kong (Special Edition) for Supernintendo');
// associate.userToProduct('donkey@nintendo.com', 'donkey kong retro womens tank top');
// associate.userToProduct('bill@microsoft.com', 'xbox 360 with 1 working controller');
// associate.userToProduct('me@rayban.com', 'ray ban sunglasses');
// associate.tagsToProduct('')

//export the stringified dummy data
exports.users = JSON.stringify(users);
exports.products = JSON.stringify(products);
