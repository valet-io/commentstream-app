'use strict';

var angular  = require('angular');
var Firebase = require('firebase');

module.exports = function ($firebase, config) {

  var streams = new Firebase(config.firebase).child('streams');

  return function MessageStream (attributes) {
    angular.extend(this, attributes);
    
    var streamRef = streams.child(this.id));
    this.options = $firebase(streamRef.child('options')).$asObject();
    // this.messages = 
  };


  

};
