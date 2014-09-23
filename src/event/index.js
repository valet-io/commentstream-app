'use strict';

require('angular')
  .module('Event', [
    'ui.router'
  ])
  .factory('EventModel', require('./model'))
  .controller('EventController', require('./controllers/event'))
  .controller('ProjectorController', require('./controllers/projector'))
  .controller('ModerateController', require('./controllers/moderate'))
  .config(require('./routes'));

module.exports = 'Event';
