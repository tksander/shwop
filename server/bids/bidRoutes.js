var bidController = require('./bidController.js');
var userController = require('../users/userController.js');

module.exports = function (app) {
  // app === productRouter injected from middleware.js

  // app.param will hijack any request with a 'code' parameter on in
  // like line 16 below. That code will actually be the shortned url
  // so the real URL will be pre fetched from mongo and attached to
  // req.navLink before it reaches line 16.

  // app.param('code', linksController.findUrl);

  app.route('/')
    .post(userController.checkAuth, bidController.newBid)
    // .get(userController.checkAuth, bidController.allBids)
  // app.get('/:code', linksController.navToLink);

  app.post('/messages', bidController.messageHandler);
  app.post('/allBids', userController.checkAuth, bidController.allBids);

};