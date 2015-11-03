var request = require('request');

var saveTags = function (tags, callback) {
  console.log("Saving tags into esDB");
  console.log("Here is the passed in argument: ", tags);
  // var numberOfTags = tags.length;

  // loop over the tags and send a POST request for each
  for(var i = 0; i < tags.length; i++) {
    request({
      method: "POST",
      url: "https://rfhuqk0n:6zs2zfz0oq6eg3sb@privet-3569975.us-east-1.bonsai.io/shwop/tags",
      json: {
          // add tags here
          "tagName": tags[i].tagName,
          "id": tags[i].id
      }}, function (error, response, body) {
        if(error) {
          console.log('Error:  ', error);
        } 
        console.log('Success: saved a tag in ES DB!');
      })
  }
  callback();
}

exports.saveTags = saveTags;