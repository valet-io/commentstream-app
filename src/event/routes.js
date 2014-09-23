'use strict';

module.exports = function ($stateProvider) {
  $stateProvider
    .state('events', {
      url: '/events',
      template: '<ui-view/>'
    })
    .state('event', {
      parent: 'events',
      url: '/:id',
      controller: 'EventController',
      template: '<ui-view/>',
      resolve: require('./controllers/event').resolve
    })
    .state('event.moderate', {
      url: '/moderate',
      controller: 'ModerateController',
      templateUrl: '/views/event/moderate.html'
    })
    .state('event.projector', {
      url: '/projector',
      controller: 'ProjectorController',
      templateUrl: '/views/event/projector.html'
    });
};

module.exports.$inject = ['$stateProvider'];
