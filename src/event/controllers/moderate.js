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
  $scope.shown = $firebase(shown).$asArray();
  $scope.hidden = $firebase(hidden).$asArray();

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

  $scope.log = {
    toggle: function () {
      this.shown = !this.shown
    },
    shown: true
  }

  $scope.hide = function (message) {
    var msg = $firebaseUtils.toJSON(message);
    var now = Date.now();
    angular.extend(msg, {
      moderatedAt: now,
      '.priority': now
    });
    hidden.push(msg, function () {
      shown.child(message.$id).remove();
    });
  };

  $scope.show = function (message) {
    var msg = $firebaseUtils.toJSON(message);
    var now = Date.now();
    angular.extend(msg, {
      moderatedAt: now,
      '.priority': now
    });
    shown.push(msg, function () {
      hidden.child(message.$id).remove();
    });
  };

};

module.exports.$inject = ['$scope', 'event', '$firebase', '$firebaseUtils'];
