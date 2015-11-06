//  Walkthrough of the server:
//  Express and our server are initialized in server.js.
//  We then inject the server into our config/middleware.js file for setup.
//  We also export the server for easy testing.
//  middleware.js requires all Express middleware and sets it up.
//  It also sets up our authentication.
//  We have created individual routers for our two main features - links and users.
//  Each feature has its own folder with a model, controller, and route file.
//  The respective route file is required in middleware.js and injected with its own router.
//  That route file then requires the respective controller and sets up all the routes.
//  The controller then requires the respective model and sets up all our endpoints, which respond to requests.
var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');
var app = express();

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use('/public', express.static(path.join(__dirname, 'public')));

require('./config/middleware.js')(app, express);

var port = process.env.PORT || 8080;
app.listen(port);
console.log('Server is running on port:', port);

module.exports = app;
