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
      template: '<ui-view/>'
    })
    .state('event.edit', {
      url: '/edit'
    })
    .state('event.projector', {
      url: '/projector',
      controller: 'ProjectorController',
      templateUrl: '/views/event/projector.html'
    });
};

module.exports.$inject = ['$stateProvider'];
