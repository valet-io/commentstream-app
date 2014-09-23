'use strict';

module.exports = function ($scope, $firebase, event) {
  $scope.messages = $firebase(event.messages.approved.limit(10)).$asArray()
  $scope.messages.$watch(function () {
    $scope.messages.sort(function ($1, $2) {
      return $2.approvedAt - $1.approvedAt;
    });
  });
};

module.exports.$inject = ['$scope', '$firebase', 'event'];
