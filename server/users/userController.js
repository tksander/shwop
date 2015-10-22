var db = require('../db/db_config.js');
var jwt  = require('jwt-simple');

module.exports = {
  signin: function (req, res, next) {

    db.User.findOne({
      where: {email: req.body.email}
    })
    .then( function (user) {
      if (!user) {
        next(new Error('User does not exist!'));
      } else {
        return user.comparePasswords(req.body.password)
        .then(function (foundUser) {
          if (foundUser) {
            var token = jwt.encode(user, 'secret');
            res.json({token: token});
          } else {
            return next(new Error('No user'));
          }
        });
      }
    })
    .catch(function (error) {
      next(error);
    });
    // var findUser = Q.nbind(User.findOne, User);
    // findUser({username: username})
    //   .then(function (user) {
    //     if (!user) {
    //       next(new Error('User does not exist'));
    //     } else {
    //       return user.comparePasswords(password)
    //         .then(function (foundUser) {
    //           if (foundUser) {
    //             var token = jwt.encode(user, 'secret');
    //             res.json({token: token});
    //           } else {
    //             return next(new Error('No user'));
    //           }
    //         });
    //     }
    //   })
    //   .fail(function (error) {
    //     next(error);
    //   });
  },

  signup: function (req, res, next) {
    // var create;
    // var newUser;

    // var findOne = Q.nbind(User.findOne, User);
    db.User.findOne({
      where: {email: req.body.email}
    })
    .then(function (user) {
      if (user) {
        next(new Error('User already exists!'));
      } else {
        return db.User.create({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
          password: req.body.password
        });
      }
    })
    .then(function (user) {
      var token = jwt.encode(user, 'secret');
      res.json({token: token});
    })
    .catch(function (error) {
      next(error);
    });

    // // check to see if user already exists
    // findOne({username: username})
    //   .then(function (user) {
    //     if (user) {
    //       next(new Error('User already exist!'));
    //     } else {
    //       // make a new user if not one
    //       create = Q.nbind(User.create, User);
    //       newUser = {
    //         username: username,
    //         password: password
    //       };
    //       return create(newUser);
    //     }
    //   })
    //   .then(function (user) {
    //     // create token to send back for auth
    //     var token = jwt.encode(user, 'secret');
    //     res.json({token: token});
    //   })
    //   .fail(function (error) {
    //     next(error);
    //   });
  },

  checkAuth: function (req, res, next) {
    // checking to see if the user is authenticated
    // grab the token in the header is any
    // then decode the token, which we end up being the user object
    // check to see if that user exists in the database
    // var token = req.headers['x-access-token'];
    // if (!token) {
    //   next(new Error('No token'));
    // } else {
    //   var user = jwt.decode(token, 'secret');
    //   var findUser = Q.nbind(User.findOne, User);
    //   findUser({username: user.username})
    //     .then(function (foundUser) {
    //       if (foundUser) {
    //         res.send(200);
    //       } else {
    //         res.send(401);
    //       }
    //     })
    //     .fail(function (error) {
    //       next(error);
    //     });
    // }
  }
};