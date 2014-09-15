'use strict';

require('angular')
  .module('Event', [
    'ui.router'
  ])
  .controller('ProjectorController', require('./controllers/projector'))
  .config(require('./routes'));

module.exports = 'Event';
