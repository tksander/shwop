var db = require('../../server/db/db_config.js');
// var Sequelize = require('sequelize');


//This function clears everything from the database.
var clearDB = function (done) {
  // Disable the check for foreign keys to enable TRUCATE. Otherwise, we cannot clear b/c of constraints\
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
};

// Executes the clear DB function
// This is needed for the 'clear' task in the Gruntfile
// clearDB(function() { console.log('Cleared database.'); });

// Exports the clearDB function which is used in the tests
module.exports = clearDB;