'use strict';

module.exports = function ($scope, $firebase, $stateParams) {
  var eventRef = new Firebase('https://commentstream-dev.firebaseio.com/events').child($stateParams.id);
  var approvedRef = eventRef.child('messages').child('moderated').startAt(1).limit(10);
  $scope.messages = $firebase(approvedRef).$asArray()
  $scope.messages.$watch(function () {
    $scope.messages.sort(function ($1, $2) {
      return $2.approvedAt - $1.approvedAt;
    });
  });
};

module.exports.$inject = ['$scope', '$firebase', '$stateParams'];
