'use strict';

var angular  = require('angular');
var Firebase = require('firebase');

module.exports = function ($firebase) {

  var events = new Firebase('https://commentstream-dev.firebaseio.com/events');

  return function EventModel (id) {
    this.ref = events.child(id);
    this.settings = $firebase(this.ref.child('settings')).$asObject();
    var messages = this.ref.child('messages');
    this.messages = {
      moderated: messages.child('moderated'),
      queue: messages.child('toModerate')
    };
    this.messages.approved = this.messages.moderated.limit(10).endAt();
  };

};

module.exports.$inject = ['$firebase'];
