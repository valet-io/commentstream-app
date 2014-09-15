'use strict';

module.exports = function ($scope) {
  $scope.messages = [
    {
      message: 'Hi there!'
    },
    {
      message: 'Well hello! Nice to be chatting with the room.'
    },
    {
      message: 'Welcome everyone!'
    }
  ];
};

module.exports.$inject = ['$scope'];
