'use strict';

module.exports = function ($scope) {
  $scope.messages = [
    {
      message: 'Hi there! This is a comment that is up on the screen!'
    },
    {
      message: 'Truly. This next comment is much longer. In fact, it is as long as text messages can be: 160 total characters. Any more and the phone will split it into parts. '
    },
    {
      message: 'This is a bit more reasonable in length. The average message is like this. Two to three short sentences.'
    },
    {
      message: 'Another message in between to force the last off my MBP screen.'
    },
    {
      message: 'This last one (the oldest) runs just slightly off screen. Its contents are cut off eventually, but the first two lines show up on screen.'
    }
  ];
};

module.exports.$inject = ['$scope'];
