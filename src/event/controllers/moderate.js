'use strict';

module.exports = function ($scope, event, $firebase, $firebaseUtils) {
  $scope.queue = $firebase(event.messages.queue).$asArray();
  Object.defineProperty($scope, 'moderating', {
    get: function () {
      return $scope.queue[0];
    }
  });

  $scope.all = $firebase(event.messages.moderated).$asArray();

  $scope.moderate = function (message, approved) {
    var msg = $firebaseUtils.toJSON(message);
    msg.moderatedAt = Date.now();
    msg['.priority'] = (approved ? 1 : -1) * msg.moderatedAt;
    event.messages.moderated.push(msg, function () {
      event.messages.queue.child(message.$id).remove();
    });
  };

};

module.exports.$inject = ['$scope', 'event', '$firebase', '$firebaseUtils'];
