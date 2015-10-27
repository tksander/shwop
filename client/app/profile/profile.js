angular.module('shwop.profile', [])


.controller('ProfileController', ['$scope', '$window', 'Users', 'Auth', function ($scope, $window, Users, Auth) {
  $scope.data = {};

  $scope.signout = function() {
    Auth.signout();
  };

// Calls factory mehtod that returns the user's information
  $scope.getUserInfo = function () {
    //get the token
    var token = $window.localStorage.getItem('com.shwop');
    console.log('token is', token);
    Users.getUserInfo(token)
    .then(function (user) {
      console.log('user is ', user);
      $scope.data.user = user.data.userInfo;
      console.log('$scope.data.user is', $scope.data.user);
    })
    .catch(function (err) {
        console.log('/api/users/profile POST failed', err);
    });
  };

  $scope.getUserInfo();
}]);