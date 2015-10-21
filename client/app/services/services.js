angular.module('shwop.services', [])


.factory('Products', ['$http', '$location', function ($http, $location) {

  var currentProduct = null;

  var getAllProducts = function () {
    return $http({
      method: 'GET',
      url: '/api/products'
    });
  };

  var addProduct = function(product) {
    return $http({
      method: 'POST',
      url: '/api/products',
      data: product
    });
  };

  var bid = function() {
    $location.path('/bid');
  };

  var setCurrentProduct = function(newProduct) {
    currentProduct = newProduct;
  };

  var getCurrentProduct = function() {
    return currentProduct;
  };

  var sendBid = function(bidderId, productId, bidAmount) {
    return $http({
      method: 'POST',
      url: '/api/bids',
      data: {
        bidderId: bidderId,
        productId: productId,
        bidAmount: bidAmount
      }
    });
  };

  return {
    getAllProducts: getAllProducts,
    addProduct: addProduct,
    setCurrentProduct: setCurrentProduct,
    getCurrentProduct: getCurrentProduct,
    bid: bid,
    sendBid: sendBid
  };

}])
.factory('Users', ['$http', function ($http) {
  var getUsers = function () {
    return $http({
      method: 'GET',
      url: '/api/users'
    });
  };

  var addUser = function(user) {
    return $http({
      method: 'POST',
      url: '/api/users',
      data: user
    });
  };

  return {
    getUsers: getUsers,
    addUser: addUser
  };
}])
.factory('Photos', function($http) {
  var resizeImage = function (file, height, callback) {
    // Takes an uploaded file, resizes it based on height and calls the callback sending it a Blob
    var img = new Image();
    var reader = new FileReader();

    img.onload = function() {
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      
      canvas.height = height;
      canvas.width = canvas.height * (img.width / img.height);

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      console.log(ctx.canvas);
      ctx.canvas.toBlob(callback);
    };

    reader.onload = function (e) {
      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  };

  var getPhotoAPIKeys = function(){
    return $http.get('/api/keys')
      .then(function(resp) {
        return resp.data;
      });
  };

  var uploadPhoto = function(file, callback) {
    // takes a File after upload, resizes it and uploads it to Parse.
    // Sends Url of upload to callback function
    var resizedFileHeight = 300;
    resizeImage(file, resizedFileHeight, function(fileBlob) {
      var serverUrl = 'https://api.parse.com/1/files/' + file.name;

      getPhotoAPIKeys().then(function(keys) {
        $http.post(serverUrl, fileBlob, {
          headers: {
            'X-Parse-Application-Id': keys['X-Parse-Application-Id'],
            'X-Parse-REST-API-Key': keys['X-Parse-REST-API-Key'],
            'Content-Type': file.type
          }
        }).then(function(resp) {
          callback(resp.data.url);
        });
      });
    });
  };

  return {
    uploadPhoto: uploadPhoto
  };

})
.factory('Auth', ['$http', '$location', '$window', function ($http, $location, $window) {
  // This auth service is responsible for authenticating the user
  // by exchanging the user's username and password
  // for a JWT from the server.
  // That JWT is then stored in localStorage as 'com.shwop'.
  // After you signin/signup, open devtools, click resources and
  // then localStorage, and you'll see your token from the server.
  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.shwop');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.shwop');
    $location.path('/signin');
  };


  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
}]);
