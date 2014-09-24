'use strict';

module.exports = function ($scope, $firebase, event) {
  $scope.messages = $firebase(event.messages.shown().endAt().limit(10)).$asArray()
  $scope.messages.$watch(function () {
    $scope.messages.sort(function ($1, $2) {
      return $2.moderatedAt - $1.moderatedAt;
    });
  });
};

module.exports.$inject = ['$scope', '$firebase', 'event'];
