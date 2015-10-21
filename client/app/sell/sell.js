angular.module('shwop.sell', [])

.controller('SellController', ['$http', '$scope', '$location', 'Products', 'Photos', function ($http, $scope, $location, Products, Photos) {
  $scope.product = {};
  $scope.product.tags = [];
  $scope.product.photoURL = '';
  $scope.product.category = null;

  $scope.categories = [
    {id: '1', name: 'Antiques'},
    {id: '2', name: 'Appliances'},
    {id: '3', name: 'Arts, Crafts & Sewing'},
    {id: '4', name: 'Automotive'},
    {id: '5', name: 'Baby & Kids'},
    {id: '6', name: 'Barter'},
    {id: '7', name: 'Beauty'},
    {id: '8', name: 'Bikes'},
    {id: '9', name: 'Boats'},
    {id: '10', name: 'Books'},
    {id: '11', name: 'Cell Phones & Accessories'},
    {id: '12', name: 'Clothing, Shoes & Jewelry - Women'},
    {id: '13', name: 'Clothing, Shoes & Jewelry - Men'},
    {id: '14', name: 'Clothing, Shoes & Jewelry - Girls'},
    {id: '15', name: 'Clothing, Shoes & Jewelry - Boys'},
    {id: '16', name: 'Clothing, Shoes & Jewelry - Baby'},
    {id: '17', name: 'Collectibles & Fine Art'},
    {id: '18', name: 'Computers & Software'},
    {id: '19', name: 'Electronics'},
    {id: '20', name: 'Free'},
    {id: '21', name: 'Furniture'},
    {id: '22', name: 'Games & Toys'},
    {id: '23', name: 'Garage Sale'},
    {id: '24', name: 'General / Miscellaneous'},
    {id: '25', name: 'Grocery & Food'},
    {id: '26', name: 'Handmade'},
    {id: '27', name: 'Health & Personal Care'},
    {id: '28', name: 'Home & Kitchen'},
    {id: '29', name: 'Industrial & Scientific'},
    {id: '30', name: 'Luggage & Travel Gear'},
    {id: '31', name: 'Movies & TV'},
    {id: '32', name: 'Music & Musical Instruments'},
    {id: '33', name: 'Office & Business'},
    {id: '34', name: 'Patio, Lawn & Garden'},
    {id: '35', name: 'Pet Supplies'},
    {id: '36', name: 'Sports & Outdoors'},
    {id: '37', name: 'Tickets'},
    {id: '38', name: 'Tools & Home Improvement'},
    {id: '39', name: 'Video Games'}
  ];

  // Helper function that adds an item to an array if the item is not already
  // in the array and the item is not blank. 
  var addToArray = function(item, array) {
    if(array.indexOf(item) === -1 && !isBlank(item)){
      array.push(item);
    }
  };

  // Helper function that ensures a string is not blank.
  var isBlank = function(string) {
    return string.trim() === '';
  };

  // Adds tag to array of tags associated with a product.
  $scope.addTag = function() {
    addToArray($scope.product.tag, $scope.product.tags);
    $scope.product.tag = '';
  };

  // Calls factory method that adds photo to parse.com and returns photo url.
  $scope.addPhoto = function() {
    $scope.filePath = '';
    Photos.uploadPhoto($scope.productPhoto, function(url){
      $scope.product.photoURL = url;
    }.bind($scope));
  };

  // Calls factory method that adds a product to the database.
  $scope.addProduct = function () {
    Products.addProduct($scope.product)
    .then(function (res) {
      $location.path('/products');
    })
    .catch(function (err) {
      console.log(err);
    });
  };
}])

// The 'fileread' directive ensures that the photo uploaded in the browser
// is available for manipulation within the controller.
.directive('fileread', [function () {
  return {
      scope: {
          fileread: '='
      },
      link: function (scope, element, attributes) {
          element.bind('change', function (changeEvent) {
              scope.$apply(function () {
                  scope.fileread = changeEvent.target.files[0];
              });
          });
      }
  };
}]);
