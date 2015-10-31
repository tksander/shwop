var db = require('../db/db_config.js');
var util = require('../config/utils.js');
var helpers = require('../db/helpers.js');
var jwt  = require('jwt-simple');
if(!process.env.TwilioSid) {
  var locally = require('../../sneakyLocal.js');
}
var client = require('twilio')(process.env.TwilioSid || locally.TwilioSid, process.env.TwilioAuthToken || locally.TwilioAuthToken);

module.exports = {

  // sends bid alert to seller
  newBid: function (req, res, next) {
    var product;
    var seller;
    var bidder = jwt.decode(req.body.token, 'secret');

    db.Product.findOne({ where: { id: req.body.productId } })
    .then(function (foundProduct) {
      if(foundProduct === null) {
        res.status(400).send('Error creating new bid in database: We could not locate the product in the database.');
      }
      product = foundProduct;
      return db.User.findOne({ where: { id: foundProduct.get('UserId') } });
    })
    .then(function(foundSeller) {
      if(foundSeller === null) {
        res.status(400).send('Error creating new bid in database: We could not locate a seller for the product.');
      }
      seller = foundSeller;
      return db.User.findOne({ where: { id: bidder.id } });
    })
    .then(function(foundBidder){
      if(foundBidder === null) {
        res.status(400).send('Error creating new bid in database: We could not locate you (the bidder) in the database.');
      }
      bidder = foundBidder;
      helpers.storeBid(req.body.bidAmount, product, bidder, function(error, result) {
        if(error) {
          res.status(400).send("Error creating bid in database : " + err);
        }
        
        res.status(200).send("Successfully stored the bid in the database. Response data:" + result);
        client.sendMessage({
            to: seller.get('phoneNumber'), // Any number Twilio can deliver to
            from: '+18327695630', // A number you bought from Twilio and can use for outbound communication
            body: '' + bidder.get('firstName') + ' has bid ' + req.body.bidAmount + ' for your ' 
                  + product.get('name') + ". Respond to them at " 
                  + bidder.get('phoneNumber') + ". The bid ID is " + result.get('id') + "."
                  + "Respond to them by sending a message to this number that starts with \"2:\"."

        }, function(err, responseData) { //this function is executed when a response is received from Twilio
          if (!err) { // if NO error is received sending the message ("err" is an error received during the request, if any)
          // "responseData" is a JavaScript object containing data received from Twilio.
          // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
          // http://www.twilio.com/docs/api/rest/sending-sms#example-1

            console.log('Response data:  ', responseData.from); // outputs "+18327695630"
            console.log('Response responseData.body: ', responseData.body); // outputs the actual message text
            res.status(200).send("Successfully sent message. Response data:" + responseData);
          // Store the bid information
          

          } else {
            res.status(400).send("Error creating twilio request: "+ err);
          }
        });
      });
    })
    .catch(function(error) {
      res.status(400).send('Error creating new bid in database: '+ error);
    })
  },

  oldMessageHandler: function(req, res, next){
    var message = req.body.Body

    client.sendMessage({

        to: '7133034742', // Any number Twilio can deliver to
        from: '+18327695630', // A number you bought from Twilio and can use for outbound communication
        body: "Hey John, someone sent a message back to twilio. They said: " + req.body.Body + " and their number is " + req.body.From

    }, function(err, responseData) { //this function is executed when a response is received from Twilio

      if (!err) { // "err" is an error received during the request, if any

        // "responseData" is a JavaScript object containing data received from Twilio.
        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
        // http://www.twilio.com/docs/api/rest/sending-sms#example-1

        console.log('Response data:  ', responseData.from); // outputs "+18327695630"
        console.log('Response responseData.body: ', responseData.body); // outputs the actual message text
        res.status(200).send("Successfully sent message. Response data:"+ responseData);
      } else {
        res.status(400).send("Error creating twilio request: "+ err);
      }
    })
  },

  // gets all the open bids for a user
  allBids: function(req, res, next) {
    // object to be sent to client side
    var responseArray = [];

    // Token is sent on client side
    var bidder = jwt.decode(req.body.token, 'secret');

    db.Bid.findAll({where: {UserId: bidder.id}})
    .then(function(bids) {

      if(bids === null) {
        res.status(400).send("Sorry, you have no current bids");
      }

      // productIds array is used to grab the associated products for each bid
      var productIds = [];
      // Iterate over the bid objects and grab the ProductIds and Created_at
      for(var z = 0; z < bids.length; z++) {
        productIds.push(bids[z].get('ProductId'));

        var productsObj = {
          productInfo: null,
          bidInfo: bids[z].dataValues
        }
        responseArray.push(productsObj);
      }


      var productPromises = [];
      // Retrieve all products and push into array
      for(var j = 0; j < productIds.length; j++) {
        productPromises.push(db.Product.find({where : { id: productIds[j]} }));
      }

      Promise.all(productPromises)
      .then(function (foundProducts) {
        for (var i = 0; i < foundProducts.length; i++) {
          responseArray[i]['productInfo'] = foundProducts[i].dataValues;
        }
      })
      .then(function() {
        console.log(responseArray);
        res.status(200).send(responseArray);
      })
    })
    .catch(function (error) {
      res.status(400).send('Error getting all bids from database:  ' + error);
    });
  },

  // deletes bid from bid table (Bidder cancels bid)
  deleteBid: function (req, res, next) {
    var bidId = req.params.bidId;
    db.Bid.destroy({
      where: {
        ProductId: bidId
      }
    })
    .then(function (result) {
      res.status(200).send('Product successfully deleted. Here is result message: ' + result);
    })
    .catch(function (error) {
      res.status(400).send('Error deleting the bid in the database: ' + error);
    })
  },

  messageHandler: function(req, res, next) {
    var productId;
    var targetnumber;
    var sellerNumber;
    var bidderBumber;
    var bidderId;
    var foundBidId;
    var fromName;

    var fromNumber = req.body.From;
    var incoming = req.body.Body.split(':');
    var bidId = Number(incoming.shift());
    console.log(bidId);
    var message = incoming.join(":");


    db.Bid.findOne({where: {id: bidId}})
    .then(function(foundBid) {
      console.log("found bid is", foundBid);
      if(foundBid === null) {
        res.status(400).send("Sorry, you have no current bids");
      }
      foundBidId = foundBid.get('id');
      productId = foundBid.get('ProductId');
      bidderId = foundBid.get('UserId');
      console.log("looking for product with ID: ",productId);
      return db.Product.findOne({ where: { id: productId} });
    })
    .then(function(foundProduct){
      if(foundProduct === null) {
        res.status(400).send('Error finding  bid in database: Product may have been deleted.');
      }
      product = foundProduct;
      var sellerId = foundProduct.get('UserId')
      console.log("found product is", product);
      return db.User.findOne({ where: { id: sellerId } });
    })
    .then(function(foundSeller){
      sellerNumber = foundSeller.get('phoneNumber');
      sellerName = foundSeller.get('firstName');
      console.log("found seller number is", sellerNumber);
      return db.User.findOne({ where: { id: bidderId } });
    })
    .then(function(foundBidder){
      bidderNumber = foundBidder.get('phoneNumber');
      bidderName = foundBidder.get('firstName');

      targetNumber = bidderNumber;
      fromName = sellerName;

      if (bidderNumber === fromNumber){
        targetNumber = sellerNumber;
        fromName = bidderName;
      }


      client.sendMessage({
          to: targetNumber, // Any number Twilio can deliver to
          from: '+18327695630', // A number you bought from Twilio and can use for outbound communication
          body: "" + fromName + " says: \"" + message + "\""
                + "\nRespond to them by starting your message with \"" 
                + foundBidId + ":\"."

      }, function(err, responseData) { //this function is executed when a response is received from Twilio
        if (!err) { // if NO error is received sending the message ("err" is an error received during the request, if any)
        // "responseData" is a JavaScript object containing data received from Twilio.
        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
        // http://www.twilio.com/docs/api/rest/sending-sms#example-1

          console.log('Response data: ', responseData.from); // outputs "+18327695630"
          console.log('Response responseData.body: ', responseData.body); // outputs the actual message text
          res.status(200).send("Successfully sent message. Response data:" + responseData);
        // Store the bid information
      
        } else {
          res.status(400).send("Error creating twilio request: "+ err);
        }
      });
      
    })
    .catch(function (error) {
      res.status(400).send('Error getting all bids from database:  ' + error);
    });
  },
};
