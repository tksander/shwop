angular.module('shwop.profile', [])


.controller('ProfileController', ['$scope', '$window', '$translate', 'Users', 'Auth', function ($scope, $window, $translate, Users, Auth) {
  $scope.data = {};

  $scope.signout = function() {
    Auth.signout();
  };

// Calls factory mehtod that returns the user's information
  $scope.getUserInfo = function () {
    var token = $window.localStorage.getItem('com.shwop');
    Users.getUserInfo(token)
    .then(function (user) {
      $scope.data.user = user.data.userInfo;
    })
    .catch(function (err) {
        console.log('/api/users/profile POST failed', err);
    });
  };

  $scope.updateUser = function () {
    var token = $window.localStorage.getItem('com.shwop');
    Users.updateUser(token, $scope.data.user)
    .then(function() {
      return $translate('profileUpdateAlert');
    })
    .then(function (translatedValue) {
      $scope.data.user = {};
      alert(translatedValue);
      $scope.getUserInfo();
    })
    .catch(function (err) {
      console.log('/api/users/update POST failed', err);
    });
  };

  $scope.getUserInfo();
}]);
