'use strict';

var angular = require('angular');

module.exports = function ($scope, event, $firebase, $firebaseUtils) {
  $scope.queue = $firebase(event.messages.queue).$asArray();
  Object.defineProperty($scope, 'moderating', {
    get: function () {
      return $scope.queue[0];
    }
  });

  $scope.moderate = function (message, approved) {
    var msg = $firebaseUtils.toJSON(message);
    angular.extend(msg, {
      moderatedAt: Date.now(),
      '.priority': ~~approved
    });
    event.messages.moderated.push(msg, function () {
      event.messages.queue.child(message.$id).remove();
    });
  };

};

module.exports.$inject = ['$scope', 'event', '$firebase', '$firebaseUtils'];
