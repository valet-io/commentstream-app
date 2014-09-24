'use strict';

var angular = require('angular');

module.exports = function ($scope, event, $firebase, $firebaseUtils) {
  var shown = event.messages.shown();
  var hidden = event.messages.hidden();
  var queue = event.messages.queue();

  $scope.queue = $firebase(queue).$asArray();
  Object.defineProperty($scope, 'moderating', {
    get: function () {
      return $scope.queue[0];
    }
  });
  $scope.moderate = function (message, approved) {
    var msg = $firebaseUtils.toJSON(message);
    var now = Date.now();
    angular.extend(msg, {
      moderatedAt: now,
      '.priority': now
    });
    (approved ? shown : hidden).push(msg, function () {
      queue.child(message.$id).remove();
    });
  };

};

module.exports.$inject = ['$scope', 'event', '$firebase', '$firebaseUtils'];
