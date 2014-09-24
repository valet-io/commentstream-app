'use strict';

var angular  = require('angular');
var Firebase = require('firebase');

module.exports = function ($firebase) {

  var events = new Firebase('https://commentstream-dev.firebaseio.com/events');

  return function EventModel (id) {
    this.ref = events.child(id);
    this.settings = $firebase(this.ref.child('settings')).$asObject();
    var messages = this.ref.child('messages');
    this.messages = {};
    ['shown', 'hidden', 'queue'].forEach(function (list) {
      this.messages[list] = function () {
        return messages.child(list);
      };
    }, this);
  };

};

module.exports.$inject = ['$firebase'];
