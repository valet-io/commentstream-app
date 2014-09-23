'use strict';

module.exports = function ($scope, event) {
  $scope.event = event;
};

module.exports.$inject = ['$scope', 'event'];

var resolve = module.exports.resolve = {};

resolve.event = function (EventModel, $stateParams) {
  return new EventModel($stateParams.id);
};
resolve.event.$inject = ['EventModel', '$stateParams'];
