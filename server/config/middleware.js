var morgan = require('morgan'); // http request logger middleware
var bodyParser = require('body-parser'); // body parsing middleware
var helpers = require('./helpers.js'); // our custom middleware


module.exports = function (app, express) {
  // Express 4 allows us to use multiple routers with their own configurations
  var userRouter = express.Router();
  var productRouter = express.Router();
  var bidRouter = express.Router();

  app.use(morgan('dev')); // configures morgan to output concise logs colored by response status
  app.use(bodyParser.urlencoded({extended: true})); //allows for rich objects and arrays to be encoded into the URL-encoded format
  app.use(bodyParser.json()); //returns middleware that only parses json
  app.use(express.static(__dirname + '/../../client')); //serve static files in client folder


  app.use('/api/users', userRouter); // use user router for all user request

  // authentication middleware used to decode token and made available on the request
  //app.use('/api/links', helpers.decode);

  app.use('/api/products', productRouter); // user link router for product request
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  // inject our routers into their respective route files
  require('../users/userRoutes.js')(userRouter);
  require('../products/productRoutes.js')(productRouter);
  require('../bids/bidRoutes.js')(bidRouter);
};